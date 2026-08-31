#pragma once
#include "net.hpp"
#include <sstream>
#include <iomanip>
#include <array>
#include <cstring>

// ─── SHA-1 (RFC 3174) ─────────────────────────────────────────────────────
namespace SHA1Impl {
    struct SHA1Context {
        uint32_t h[5];
        uint32_t lo, hi;
        uint8_t  block[64];
        int      index;
    };

    static uint32_t rol(uint32_t v, int n) { return (v << n) | (v >> (32 - n)); }

    static void process(SHA1Context& c) {
        uint32_t w[80];
        for (int i = 0; i < 16; i++) {
            w[i]  = ((uint32_t)c.block[i*4  ] << 24);
            w[i] |= ((uint32_t)c.block[i*4+1] << 16);
            w[i] |= ((uint32_t)c.block[i*4+2] <<  8);
            w[i] |= ((uint32_t)c.block[i*4+3]);
        }
        for (int i = 16; i < 80; i++)
            w[i] = rol(w[i-3] ^ w[i-8] ^ w[i-14] ^ w[i-16], 1);

        uint32_t a=c.h[0], b=c.h[1], cc=c.h[2], d=c.h[3], e=c.h[4], f, k, t;
        for (int i = 0; i < 80; i++) {
            if      (i < 20) { f = (b & cc) | (~b & d); k = 0x5A827999; }
            else if (i < 40) { f = b ^ cc ^ d;           k = 0x6ED9EBA1; }
            else if (i < 60) { f = (b & cc)|(b & d)|(cc & d); k = 0x8F1BBCDC; }
            else             { f = b ^ cc ^ d;           k = 0xCA62C1D6; }
            t = rol(a,5) + f + e + k + w[i];
            e=d; d=cc; cc=rol(b,30); b=a; a=t;
        }
        c.h[0]+=a; c.h[1]+=b; c.h[2]+=cc; c.h[3]+=d; c.h[4]+=e;
    }

    static void init(SHA1Context& c) {
        c.h[0]=0x67452301; c.h[1]=0xEFCDAB89; c.h[2]=0x98BADCFE;
        c.h[3]=0x10325476; c.h[4]=0xC3D2E1F0;
        c.lo = c.hi = c.index = 0;
    }

    static void update(SHA1Context& c, const uint8_t* data, size_t len) {
        for (size_t i = 0; i < len; i++) {
            c.block[c.index++] = data[i];
            c.lo += 8;
            if (c.index == 64) { process(c); c.index = 0; }
        }
    }

    static std::string finalize(SHA1Context& c) {
        c.block[c.index++] = 0x80;
        if (c.index > 56) {
            while (c.index < 64) c.block[c.index++] = 0;
            process(c); c.index = 0;
        }
        while (c.index < 56) c.block[c.index++] = 0;
        uint64_t bits = (uint64_t)c.lo + ((uint64_t)c.hi << 32);
        for (int i = 7; i >= 0; i--) { c.block[56 + (7 - i)] = (bits >> (i * 8)) & 0xFF; }
        process(c);
        std::string out(20, '\0');
        for (int i = 0; i < 5; i++) {
            out[i*4  ] = (c.h[i] >> 24) & 0xFF;
            out[i*4+1] = (c.h[i] >> 16) & 0xFF;
            out[i*4+2] = (c.h[i] >>  8) & 0xFF;
            out[i*4+3] = (c.h[i]      ) & 0xFF;
        }
        return out;
    }

    static std::string hash(const std::string& input) {
        SHA1Context c; init(c);
        update(c, (const uint8_t*)input.data(), input.size());
        return finalize(c);
    }
}

// ─── Base64 ───────────────────────────────────────────────────────────────
namespace Base64Impl {
    static const char* TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    std::string encode(const std::string& in) {
        std::string out;
        int val = 0, valb = -6;
        for (unsigned char c : in) {
            val = (val << 8) + c;
            valb += 8;
            while (valb >= 0) {
                out.push_back(TABLE[(val >> valb) & 0x3F]);
                valb -= 6;
            }
        }
        if (valb > -6) out.push_back(TABLE[((val << 8) >> (valb + 8)) & 0x3F]);
        while (out.size() % 4) out.push_back('=');
        return out;
    }
}

// ─── WS Frame ─────────────────────────────────────────────────────────────
static const std::string WS_MAGIC = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

struct WSFrame {
    bool fin = true;
    uint8_t opcode = 0x01;
    bool masked = false;
    std::string payload;
    bool valid = false;
};

// Returns false if more data needed (partial frame)
static bool parseWSFrame(const std::string& buf, WSFrame& frame, size_t& consumed) {
    if (buf.size() < 2) return false;

    const uint8_t* b = (const uint8_t*)buf.data();
    frame.fin    = (b[0] & 0x80) != 0;
    frame.opcode = (b[0] & 0x0F);
    frame.masked = (b[1] & 0x80) != 0;

    uint64_t plen = (b[1] & 0x7F);
    size_t header_len = 2;

    if (plen == 126) {
        if (buf.size() < 4) return false;
        plen = ((uint64_t)b[2] << 8) | b[3];
        header_len = 4;
    } else if (plen == 127) {
        if (buf.size() < 10) return false;
        plen = 0;
        for (int i = 0; i < 8; i++) plen = (plen << 8) | b[2 + i];
        header_len = 10;
    }

    size_t mask_len = frame.masked ? 4 : 0;
    size_t total = header_len + mask_len + (size_t)plen;
    if (buf.size() < total) return false;

    uint8_t mask[4] = {0,0,0,0};
    if (frame.masked) {
        const uint8_t* m = b + header_len;
        mask[0]=m[0]; mask[1]=m[1]; mask[2]=m[2]; mask[3]=m[3];
    }

    frame.payload.resize((size_t)plen);
    const uint8_t* payload_ptr = b + header_len + mask_len;
    for (size_t i = 0; i < (size_t)plen; i++) {
        frame.payload[i] = (char)(payload_ptr[i] ^ (frame.masked ? mask[i % 4] : 0));
    }

    consumed = total;
    frame.valid = true;
    return true;
}

// Encode a WS frame (masked = true for client -> server, false for server -> client)
static std::string encodeWSFrame(const std::string& payload, uint8_t opcode = 0x01, bool masked = false) {
    std::string out;
    out.push_back((char)(0x80 | opcode)); // FIN + opcode

    size_t plen = payload.size();
    uint8_t mask_bit = masked ? 0x80 : 0x00;

    if (plen < 126) {
        out.push_back((char)(mask_bit | plen));
    } else if (plen < 65536) {
        out.push_back((char)(mask_bit | 126));
        out.push_back((char)((plen >> 8) & 0xFF));
        out.push_back((char)(plen & 0xFF));
    } else {
        out.push_back((char)(mask_bit | 127));
        for (int i = 7; i >= 0; i--) out.push_back((char)((plen >> (i * 8)) & 0xFF));
    }

    if (masked) {
        uint8_t mask[4] = {0x37, 0xfa, 0x21, 0x3d};
        for (int i = 0; i < 4; i++) out.push_back((char)mask[i]);
        for (size_t i = 0; i < plen; i++) {
            out.push_back((char)(payload[i] ^ mask[i % 4]));
        }
    } else {
        out.append(payload);
    }
    return out;
}

// Compute WS accept key from client's Sec-WebSocket-Key
static std::string computeWSAcceptKey(const std::string& clientKey) {
    std::string combined = clientKey + WS_MAGIC;
    std::string sha1_bytes = SHA1Impl::hash(combined);
    return Base64Impl::encode(sha1_bytes);
}

// Parse HTTP header value from raw headers string
static std::string getHeader(const std::string& headers, const std::string& name) {
    std::string lower_headers = headers;
    std::string lower_name = name;
    std::transform(lower_headers.begin(), lower_headers.end(), lower_headers.begin(), ::tolower);
    std::transform(lower_name.begin(), lower_name.end(), lower_name.begin(), ::tolower);

    size_t pos = lower_headers.find(lower_name + ":");
    if (pos == std::string::npos) return "";
    pos += name.size() + 1;
    while (pos < headers.size() && (headers[pos] == ' ' || headers[pos] == '\t')) pos++;
    size_t end = headers.find("\r\n", pos);
    if (end == std::string::npos) end = headers.find("\n", pos);
    if (end == std::string::npos) return headers.substr(pos);
    return headers.substr(pos, end - pos);
}

// ─── WebSocket Namespace ──────────────────────────────────────────────────
struct WebSocketNamespace {

    // ── Create a WS client wrapper var around a raw TCP socket ──
    var makeWSSocket(var tcp_socket, const std::string& path = "/", bool is_client = false) {
        var ws = var(var_object{});
        ws.event_listeners = std::make_shared<std::map<std::string, std::vector<var>>>();
        auto ws_listeners = ws.event_listeners;

        // ws.send(text or binary)
        ws["send"] = var([tcp_socket, is_client](const std::vector<var>& args) mutable -> var {
            var data = args.size() > 0 ? args[0] : var();
            std::string frame = encodeWSFrame(data.toString(), 0x01, is_client); // text frame
            tcp_socket.write(frame);
            return var();
        });

        // ws.sendBinary(data) — binary frame
        ws["sendBinary"] = var([tcp_socket, is_client](const std::vector<var>& args) mutable -> var {
            var data = args.size() > 0 ? args[0] : var();
            std::string frame = encodeWSFrame(data.toString(), 0x02, is_client); // binary frame
            tcp_socket.write(frame);
            return var();
        });

        // ws.close()
        ws["close"] = var([tcp_socket, ws_listeners](const std::vector<var>& _) mutable -> var {
            std::string frame = encodeWSFrame("", 0x08); // close frame
            tcp_socket.write(frame);
            tcp_socket.close();
            if (ws_listeners && ws_listeners->count("close")) {
                for (const auto& cb : (*ws_listeners)["close"]) {
                    if (cb.isFunction()) DolphinRuntime::EventLoop::instance().queueCallback(cb, {});
                }
            }
            return var();
        });

        // ws.ping()
        ws["ping"] = var([tcp_socket](const std::vector<var>& _) mutable -> var {
            std::string frame = encodeWSFrame("PING", 0x09); // ping frame
            tcp_socket.write(frame);
            return var();
        });

        return ws;
    }

    // ── Helper: emit event on shared_listeners ──
    static void emitWS(const std::shared_ptr<std::map<std::string, std::vector<var>>>& listeners,
                        const std::string& event, const var& data = var()) {
        if (listeners && listeners->count(event)) {
            auto copy = (*listeners)[event];
            for (const auto& cb : copy) {
                if (cb.isFunction())
                    cb(std::vector<var>{data});
            }
        }
    }

    static void emitWS_sync(const std::shared_ptr<std::map<std::string, std::vector<var>>>& listeners,
                             const std::string& event, const var& data = var()) {
        if (listeners && listeners->count(event)) {
            auto copy = (*listeners)[event];
            for (const auto& cb : copy) {
                if (cb.isFunction())
                    cb(std::vector<var>{data});
            }
        }
    }

    // ── WS Server ──────────────────────────────────────────────────────────
    var Server() {
        var tcp_srv = TCP.Server();
        var s = var(var_object{});
        s.event_listeners = std::make_shared<std::map<std::string, std::vector<var>>>();
        s.tcp_server = tcp_srv.tcp_server;

        auto s_listeners = s.event_listeners;

        tcp_srv.on(var("connection"), var([this, s_listeners](const std::vector<var>& args) mutable -> var {
            var tcp_socket = args[0];
            auto header_buf = std::make_shared<std::string>();
            auto upgraded   = std::make_shared<bool>(false);
            auto ws_buf     = std::make_shared<std::string>();
            auto ws_obj     = std::make_shared<var>(var());

            tcp_socket.on(var("data"), var([this, tcp_socket, header_buf, upgraded, ws_buf, ws_obj, s_listeners]
                                           (const std::vector<var>& data_args) mutable -> var {
                std::string chunk = data_args[0].toString();

                if (!*upgraded) {
                    header_buf->append(chunk);
                    size_t end = header_buf->find("\r\n\r\n");
                    if (end == std::string::npos) return var(); // wait for full headers

                    std::string headers = header_buf->substr(0, end);
                    std::string remaining = header_buf->substr(end + 4);

                    // Check it's a WS upgrade request
                    std::string lower_h = headers;
                    std::transform(lower_h.begin(), lower_h.end(), lower_h.begin(), ::tolower);
                    if (lower_h.find("upgrade: websocket") == std::string::npos) {
                        // Not a WS upgrade — send 400
                        std::string bad = "HTTP/1.1 400 Bad Request\r\nContent-Length: 0\r\n\r\n";
                        tcp_socket.write(bad);
                        tcp_socket.close();
                        return var();
                    }

                    std::string wsKey    = getHeader(headers, "Sec-WebSocket-Key");
                    std::string acceptKey = computeWSAcceptKey(wsKey);

                    // Send 101 Switching Protocols
                    std::string response =
                        "HTTP/1.1 101 Switching Protocols\r\n"
                        "Upgrade: websocket\r\n"
                        "Connection: Upgrade\r\n"
                        "Sec-WebSocket-Accept: " + acceptKey + "\r\n\r\n";
                    tcp_socket.write(response);

                    *upgraded = true;

                    // Build WS socket wrapper
                    *ws_obj = makeWSSocket(tcp_socket);
                    auto ws_listeners = (*ws_obj).event_listeners;

                    // Propagate raw tcp close → ws close
                    tcp_socket.on(var("close"), var([ws_listeners](const std::vector<var>& _) -> var {
                        emitWS(ws_listeners, "close");
                        return var();
                    }));

                    // Emit "connection" event with ws socket
                    emitWS_sync(s_listeners, "connection", *ws_obj);

                    // Process any data received alongside the handshake
                    if (!remaining.empty()) ws_buf->append(remaining);
                    chunk = ""; // already handled
                } else {
                    ws_buf->append(chunk);
                }

                // Parse and dispatch WS frames
                while (!ws_buf->empty()) {
                    WSFrame frame;
                    size_t consumed = 0;
                    if (!parseWSFrame(*ws_buf, frame, consumed)) break; // wait for more data
                    *ws_buf = ws_buf->substr(consumed);

                    auto current_ws_listeners = (*ws_obj).event_listeners;

                    switch (frame.opcode) {
                        case 0x01: // text
                        case 0x02: // binary
                            print("[WS Server Rx Message] " + frame.payload);
                            emitWS(current_ws_listeners, "message", var(frame.payload));
                            break;
                        case 0x08: // close
                            emitWS(current_ws_listeners, "close");
                            tcp_socket.close();
                            return var();
                        case 0x09: { // ping → send pong
                            std::string pong = encodeWSFrame(frame.payload, 0x0A, false);
                            tcp_socket.write(pong);
                            break;
                        }
                        case 0x0A: // pong
                            emitWS(current_ws_listeners, "pong");
                            break;
                        default: break;
                    }
                }
                return var();
            }));

            return var();
        }));

        // s.listen(port)
        s["listen"] = var([tcp_srv](const var& port) mutable -> var {
            print("[WebSocket] Server listening on ws://0.0.0.0:" + port.toString());
            tcp_srv.listen(port);
            return var(true);
        });

        // s.broadcast(message) — send to all connected ws clients
        // (basic: iterate active connections)
        s["broadcast"] = var([](const var& msg) mutable -> var {
            // Requires tracking — advanced feature
            return var();
        });

        return s;
    }

    // ── WS Client ──────────────────────────────────────────────────────────
    // Usage: WebSocket.connect("ws://host:port/path")
    var connect(const var& url_v) {
        std::string url = url_v.toString();

        // Parse: ws://host:port/path
        std::string host = "127.0.0.1";
        int port = 80;
        std::string path = "/";

        std::string scheme = url.substr(0, 5);
        bool is_wss = (scheme == "wss:/");
        size_t after = url.find("://");
        if (after != std::string::npos) {
            std::string rest = url.substr(after + 3);
            size_t slash = rest.find('/');
            std::string hostport = (slash != std::string::npos) ? rest.substr(0, slash) : rest;
            path = (slash != std::string::npos) ? rest.substr(slash) : "/";
            size_t colon = hostport.find(':');
            if (colon != std::string::npos) {
                host = hostport.substr(0, colon);
                port = std::stoi(hostport.substr(colon + 1));
            } else {
                host = hostport;
                port = is_wss ? 443 : 80;
            }
        }

        var c = var(var_object{});
        c.event_listeners = std::make_shared<std::map<std::string, std::vector<var>>>();
        auto c_listeners = c.event_listeners;

        var tcp_socket = TCP.connect(var(host), var(port));
        if (tcp_socket.isNull()) {
            print("[WebSocket] Connection failed to " + host + ":" + std::to_string(port));
            return var();
        }

        // Random 16-byte nonce for Sec-WebSocket-Key
        std::string nonce(16, '\0');
        for (int i = 0; i < 16; i++) nonce[i] = (char)(rand() % 256);
        std::string wsKey = Base64Impl::encode(nonce);

        // Send HTTP upgrade request
        std::string req =
            "GET " + path + " HTTP/1.1\r\n"
            "Host: " + host + ":" + std::to_string(port) + "\r\n"
            "Upgrade: websocket\r\n"
            "Connection: Upgrade\r\n"
            "Sec-WebSocket-Key: " + wsKey + "\r\n"
            "Sec-WebSocket-Version: 13\r\n\r\n";
        tcp_socket.write(req);

        auto upgraded   = std::make_shared<bool>(false);
        auto resp_buf   = std::make_shared<std::string>();
        auto ws_buf     = std::make_shared<std::string>();

        // Build WS socket wrapper  
        var ws = makeWSSocket(tcp_socket, path, true);
        auto ws_listeners = ws.event_listeners;

        // c.send / c.close / c.sendBinary mirror ws
        c["send"]       = ws["send"];
        c["sendBinary"] = ws["sendBinary"];
        c["close"]      = ws["close"];
        c["ping"]       = ws["ping"];

        // Read loop: first handle HTTP 101, then WS frames
        tcp_socket.on(var("data"), var([this, c, tcp_socket, upgraded, resp_buf, ws_buf, c_listeners, ws_listeners]
                                       (const std::vector<var>& data_args) mutable -> var {
            std::string chunk = data_args[0].toString();

            if (!*upgraded) {
                resp_buf->append(chunk);
                size_t end = resp_buf->find("\r\n\r\n");
                if (end == std::string::npos) return var();

                std::string headers = resp_buf->substr(0, end);
                std::string remaining = resp_buf->substr(end + 4);

                if (headers.find("101") == std::string::npos) {
                    print("[WebSocket] Server did not accept upgrade: " + headers.substr(0, 50));
                    tcp_socket.close();
                    return var();
                }

                *upgraded = true;
                if (!remaining.empty()) ws_buf->append(remaining);

                emitWS(c_listeners, "open", c);
                chunk = "";
            } else {
                ws_buf->append(chunk);
            }

            while (!ws_buf->empty()) {
                WSFrame frame;
                size_t consumed = 0;
                if (!parseWSFrame(*ws_buf, frame, consumed)) break;
                *ws_buf = ws_buf->substr(consumed);

                switch (frame.opcode) {
                    case 0x01:
                    case 0x02:
                        emitWS(c_listeners, "message", var(frame.payload));
                        break;
                    case 0x08:
                        emitWS(c_listeners, "close");
                        tcp_socket.close();
                        return var();
                    case 0x09: {
                        std::string pong = encodeWSFrame(frame.payload, 0x0A);
                        tcp_socket.write(pong);
                        break;
                    }
                    case 0x0A:
                        emitWS(c_listeners, "pong");
                        break;
                    default: break;
                }
            }
            return var();
        }));

        tcp_socket.on(var("close"), var([c_listeners](const std::vector<var>& _) -> var {
            emitWS(c_listeners, "close");
            return var();
        }));

        // Defer startRead to event loop so script has time to attach open/message listeners
        DolphinRuntime::EventLoop::instance().queueCallback(var([tcp_socket](const std::vector<var>& _) mutable -> var {
            tcp_socket["startRead"]();
            return var();
        }));

        return c;
    }

} WebSocket;
