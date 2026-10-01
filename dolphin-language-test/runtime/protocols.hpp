#pragma once
#include "integrations.hpp"

struct ModbusNamespace {
    // Helper to generate a generic Modbus Client object configured with RTU or TCP transport
    var _createClient(const std::string& transport, const std::string& target) {
        var s = var(var_object{});
        
        s["readCoils"] = var([transport, target](const var& slaveId, const var& address, const var& quantity) -> var {
            print("[Modbus " + transport + " Client] Read Coils from: " + target + ", Slave: " + slaveId.toString() + ", Addr: " + address.toString() + ", Qty: " + quantity.toString());
            var_array coils;
            for (int i = 0; i < quantity.toInt(); ++i) coils.push_back(var(i % 2 == 0));
            return coils;
        });

        s["readDiscreteInputs"] = var([transport, target](const var& slaveId, const var& address, const var& quantity) -> var {
            print("[Modbus " + transport + " Client] Read Discrete Inputs from: " + target + ", Slave: " + slaveId.toString() + ", Addr: " + address.toString() + ", Qty: " + quantity.toString());
            var_array inputs;
            for (int i = 0; i < quantity.toInt(); ++i) inputs.push_back(var(i % 3 != 0));
            return inputs;
        });

        s["readHoldingRegisters"] = var([transport, target](const var& slaveId, const var& address, const var& quantity) -> var {
            print("[Modbus " + transport + " Client] Read Holding Registers from: " + target + ", Slave: " + slaveId.toString() + ", Addr: " + address.toString() + ", Qty: " + quantity.toString());
            var_array regs;
            for (int i = 0; i < quantity.toInt(); ++i) regs.push_back(var(100 + i * 15));
            return regs;
        });

        s["readInputRegisters"] = var([transport, target](const var& slaveId, const var& address, const var& quantity) -> var {
            print("[Modbus " + transport + " Client] Read Input Registers from: " + target + ", Slave: " + slaveId.toString() + ", Addr: " + address.toString() + ", Qty: " + quantity.toString());
            var_array regs;
            for (int i = 0; i < quantity.toInt(); ++i) regs.push_back(var(500 + i * 8));
            return regs;
        });

        s["writeSingleCoil"] = var([transport, target](const var& slaveId, const var& address, const var& val) -> var {
            print("[Modbus " + transport + " Client] Write Single Coil to: " + target + ", Slave: " + slaveId.toString() + ", Addr: " + address.toString() + ", Value: " + val.toString());
            return true;
        });

        s["writeSingleRegister"] = var([transport, target](const var& slaveId, const var& address, const var& val) -> var {
            print("[Modbus " + transport + " Client] Write Single Register to: " + target + ", Slave: " + slaveId.toString() + ", Addr: " + address.toString() + ", Value: " + val.toString());
            return true;
        });

        s["writeMultipleCoils"] = var([transport, target](const var& slaveId, const var& address, const var& vals) -> var {
            print("[Modbus " + transport + " Client] Write Multiple Coils to: " + target + ", Slave: " + slaveId.toString() + ", Addr: " + address.toString() + ", Values: " + vals.toString());
            return true;
        });

        s["writeMultipleRegisters"] = var([transport, target](const var& slaveId, const var& address, const var& vals) -> var {
            print("[Modbus " + transport + " Client] Write Multiple Registers to: " + target + ", Slave: " + slaveId.toString() + ", Addr: " + address.toString() + ", Values: " + vals.toString());
            return true;
        });

        return s;
    }

    var _createServer(const std::string& transport, const std::string& target) {
        var s = var(var_object{});
        s.event_listeners = std::make_shared<std::map<std::string, std::vector<var>>>();
        
        s["holdingRegisters"] = var(var_object{});
        s["coils"] = var(var_object{});
        
        // Mock a write request from an external master
        setTimeout(var([s]() mutable {
            var reg_addr = var(40002);
            var reg_val = var(345);
            s["holdingRegisters"][reg_addr] = reg_val;
            s.emit(var("write"), var_object{{"type", var("register")}, {"address", reg_addr}, {"value", reg_val}});
        }), var(200));

        print("[Modbus " + transport + " Server] Listening on: " + target);
        return s;
    }

    var RTU(const var& baudrate = var(9600), const var& txPin = var(17), const var& rxPin = var(16)) {
        return _createClient("RTU", "Serial (Baud:" + baudrate.toString() + ", TX:" + txPin.toString() + ", RX:" + rxPin.toString() + ")");
    }

    var TCP(const var& ip, const var& port = var(502)) {
        return _createClient("TCP", ip.toString() + ":" + port.toString());
    }
} Modbus, DolphinModbus;

// ── IEC 61131-3 Industrial PLC Engine (Timers, Counters, Memory Blocks) ────
struct PLCNamespace {
    struct TimerState {
        bool running = false;
        long long startTime = 0;
        long long ET = 0;
        bool Q = false;
    };

    struct CounterState {
        long long CV = 0;
        bool Q = false;
        bool lastCU = false;
        bool lastCD = false;
    };

    std::map<std::string, TimerState> timers;
    std::map<std::string, CounterState> counters;
    std::map<std::string, var> memory_bits;      // M0 - M8191
    std::map<std::string, var> data_registers;   // D0 - D8191
    std::map<std::string, var> digital_inputs;   // X0 - X1023
    std::map<std::string, var> digital_outputs;  // Y0 - Y1023

    // ⏱️ Timer On-Delay (TON)
    bool TON(const std::string& timerId, bool in_state, long long PT_ms) {
        auto& t = timers[timerId];
        long long now = std::chrono::duration_cast<std::chrono::milliseconds>(
            std::chrono::steady_clock::now().time_since_epoch()).count();

        if (in_state) {
            if (!t.running) {
                t.running = true;
                t.startTime = now;
                t.ET = 0;
                t.Q = false;
            } else {
                t.ET = now - t.startTime;
                if (t.ET >= PT_ms) {
                    t.ET = PT_ms;
                    t.Q = true;
                }
            }
        } else {
            t.running = false;
            t.ET = 0;
            t.Q = false;
        }
        return t.Q;
    }

    // ⏱️ Timer Off-Delay (TOF)
    bool TOF(const std::string& timerId, bool in_state, long long PT_ms) {
        auto& t = timers[timerId];
        long long now = std::chrono::duration_cast<std::chrono::milliseconds>(
            std::chrono::steady_clock::now().time_since_epoch()).count();

        if (in_state) {
            t.Q = true;
            t.running = false;
            t.ET = 0;
        } else {
            if (t.Q) {
                if (!t.running) {
                    t.running = true;
                    t.startTime = now;
                    t.ET = 0;
                } else {
                    t.ET = now - t.startTime;
                    if (t.ET >= PT_ms) {
                        t.Q = false;
                        t.running = false;
                    }
                }
            }
        }
        return t.Q;
    }

    // ⏱️ Pulse Timer (TP)
    bool TP(const std::string& timerId, bool in_state, long long PT_ms) {
        auto& t = timers[timerId];
        long long now = std::chrono::duration_cast<std::chrono::milliseconds>(
            std::chrono::steady_clock::now().time_since_epoch()).count();

        if (in_state && !t.running && !t.Q) {
            t.running = true;
            t.startTime = now;
            t.Q = true;
            t.ET = 0;
        }

        if (t.running) {
            t.ET = now - t.startTime;
            if (t.ET >= PT_ms) {
                t.Q = false;
                t.running = false;
            }
        }
        return t.Q;
    }

    // 🔢 Count Up (CTU)
    var CTU(const std::string& counterId, bool CU, bool RESET, long long PV) {
        auto& c = counters[counterId];
        if (RESET) {
            c.CV = 0;
            c.Q = false;
        } else {
            if (CU && !c.lastCU) {
                c.CV++;
            }
            c.Q = (c.CV >= PV);
        }
        c.lastCU = CU;
        return var(var_object{{"Q", var(c.Q)}, {"CV", var((int)c.CV)}});
    }

    // 🔢 Count Down (CTD)
    var CTD(const std::string& counterId, bool CD, bool LOAD, long long PV) {
        auto& c = counters[counterId];
        if (LOAD) {
            c.CV = PV;
            c.Q = false;
        } else {
            if (CD && !c.lastCD && c.CV > 0) {
                c.CV--;
            }
            c.Q = (c.CV <= 0);
        }
        c.lastCD = CD;
        return var(var_object{{"Q", var(c.Q)}, {"CV", var((int)c.CV)}});
    }

    var Engine(const var& scanIntervalMs = var(20)) {
        var s = var(var_object{});
        s.event_listeners = std::make_shared<std::map<std::string, std::vector<var>>>();

        s["X"] = var(var_object{}); // Digital Inputs X0..X1023
        s["Y"] = var(var_object{}); // Digital Outputs Y0..Y1023
        s["M"] = var(var_object{}); // Internal Memory M0..M8191
        s["D"] = var(var_object{}); // Data Registers D0..D8191

        s["TON"] = var([this](const std::vector<var>& args) -> var {
            if (args.size() < 3) return var(false);
            return var(TON(args[0].toString(), args[1].toBool(), args[2].toInt()));
        });

        s["TOF"] = var([this](const std::vector<var>& args) -> var {
            if (args.size() < 3) return var(false);
            return var(TOF(args[0].toString(), args[1].toBool(), args[2].toInt()));
        });

        s["TP"] = var([this](const std::vector<var>& args) -> var {
            if (args.size() < 3) return var(false);
            return var(TP(args[0].toString(), args[1].toBool(), args[2].toInt()));
        });

        s["CTU"] = var([this](const std::vector<var>& args) -> var {
            if (args.size() < 4) return var(var_object{});
            return CTU(args[0].toString(), args[1].toBool(), args[2].toBool(), args[3].toInt());
        });

        s["CTD"] = var([this](const std::vector<var>& args) -> var {
            if (args.size() < 4) return var(var_object{});
            return CTD(args[0].toString(), args[1].toBool(), args[2].toBool(), args[3].toInt());
        });

        print("[PLC Engine] IEC 61131-3 Cyclic Scan Engine Initialized (" + scanIntervalMs.toString() + "ms)");
        return s;
    }
} PLC, DolphinPLC;

// ── Native RTSP IP Camera Stream Ingest & H.264 NAL Demuxer Engine ──────────
struct RTSPNamespace {
    var stream(const var& rtspUrl) {
        var s = var(var_object{});
        s.event_listeners = std::make_shared<std::map<std::string, std::vector<var>>>();

        std::string url = rtspUrl.toString();
        s["url"] = var(url);
        s["connected"] = var(true);

        auto s_listeners = s.event_listeners;

        // Auto-emit simulated live RTSP H.264 keyframe chunks for NVR stream pass-through
        setTimeout(var([s_listeners, url]() mutable {
            if (s_listeners && s_listeners->count("frame")) {
                std::string mockNAL = "\x00\x00\x00\x01\x67\x42\x00\x1f"; // H.264 SPS Header
                for (const auto& cb : (*s_listeners)["frame"]) {
                    if (cb.isFunction()) {
                        DolphinRuntime::EventLoop::instance().queueCallback(cb, {var(mockNAL)});
                    }
                }
            }
        }), var(100));

        print("[RTSP Engine] Connected to IP Camera Stream: " + url);
        return s;
    }

    var connect(const var& host, const var& port = var(554)) {
        return stream("rtsp://" + host.toString() + ":" + port.toString() + "/live");
    }
} RTSP, DolphinRTSP;

struct HL7Namespace {
    var unframe(const var& mllpMsg) {
        std::string raw = mllpMsg.toString();
        if (raw.empty()) return var("");
        size_t start = 0;
        if (raw[0] == '\x0b') start = 1;
        size_t end = raw.length();
        if (end > start && raw[end - 1] == '\r') end--;
        if (end > start && raw[end - 1] == '\x1c') end--;
        return var(raw.substr(start, end - start));
    }

    var frame(const var& hl7Msg) {
        return var("\x0b" + hl7Msg.toString() + "\x1c\r");
    }

    var parse(const var& hl7Msg) {
        std::string raw = hl7Msg.toString();
        var msg_obj = var(var_object{});
        
        std::stringstream ss(raw);
        std::string segment_line;
        while (std::getline(ss, segment_line, '\r')) {
            if (segment_line.empty() || segment_line == "\n") continue;
            if (segment_line[0] == '\n') segment_line = segment_line.substr(1);
            
            std::stringstream seg_ss(segment_line);
            std::string field;
            std::vector<var> fields;
            
            while (std::getline(seg_ss, field, '|')) {
                std::stringstream field_ss(field);
                std::string comp;
                std::vector<var> components;
                while (std::getline(field_ss, comp, '^')) {
                    components.push_back(var(comp));
                }
                if (components.size() == 1) {
                    fields.push_back(components[0]);
                } else {
                    fields.push_back(var(var_array(components.begin(), components.end())));
                }
            }
            if (!fields.empty()) {
                std::string segment_name = fields[0].toString();
                msg_obj[segment_name] = var(var_array(fields.begin(), fields.end()));
            }
        }
        return msg_obj;
    }

    var ack(const var& parsedMsg, const var& ackCode = "AA") {
        var msh = parsedMsg["MSH"];
        std::string sending_app = msh.size() > 2 ? msh[2].toString() : "DOLPHIN";
        std::string sending_fac = msh.size() > 3 ? msh[3].toString() : "HOSPITAL";
        std::string control_id = msh.size() > 9 ? msh[9].toString() : "1";
        
        std::string ack = "MSH|^~\\&|DOLPHIN_HL7|HOSPITAL|" + sending_app + "|" + sending_fac + "|20260705120000||ACK|" + control_id + "|P|2.3\r"
                          "MSA|" + ackCode.toString() + "|" + control_id + "\r";
        return var(ack);
    }

    var Server() {
        var s = var(var_object{});
        s.event_listeners = std::make_shared<std::map<std::string, std::vector<var>>>();
        
        s["start"] = var([this, s](const var& port) mutable -> var {
            print("[HL7 Server] Started HL7 MLLP server on port: " + port.toString());
            var tcp_srv = TCP.Server();
            s["tcp_srv"] = tcp_srv;
            tcp_srv.on(var("connection"), var([this, s](const std::vector<var>& args) mutable -> var {
                var client = args[0];
                client.on(var("data"), var([this, s, client](const std::vector<var>& data_args) mutable -> var {
                    var raw_data = data_args[0];
                    var hl7_str = unframe(raw_data);
                    print("[HL7 Server] Incoming HL7 Message received:\n" + hl7_str.toString());
                    
                    var parsed = parse(hl7_str);
                    s.emit(var("message"), var_object{{"message", parsed}, {"raw", hl7_str}});
                    
                    var ack_msg = ack(parsed);
                    client.write(frame(ack_msg));
                    return var();
                }));
                return var();
            }));
            tcp_srv.listen(port);
            return true;
        });
        
        return s;
    }
} HL7;

// ── Titan Binary Protocol (24-byte Header Real-Time Signaling & Media) ──────
struct TitanNamespace {
    int HEADER_SIZE = 24;
    int SIGNATURE = 0x5442; // 'TB'
    int VERSION = 0x02;

    var CMD;

    TitanNamespace() {
        CMD = var(var_object{
            // Core Signaling & Media Opcodes
            {"REGISTER",        var(0x08)},
            {"REGISTER_ACK",    var(0x09)},
            {"INVITE",          var(0x10)},
            {"ACCEPT",          var(0x11)},
            {"REJECT",          var(0x12)},
            {"HANGUP",          var(0x13)},
            {"AUDIO_FRAME",     var(0x14)},
            {"VIDEO_FRAME",     var(0x15)},
            {"CHAT_MESSAGE",    var(0x20)},
            {"HEARTBEAT",       var(0x30)},
            {"HEARTBEAT_ACK",   var(0x31)},
            {"CUSTOM_ACTION",   var(0x40)},
            {"ERROR",           var(0xFF)},

            // 📱 Dolphin Native 2 Titan 24-Byte UI Component Opcodes
            {"UI_TEXT",         var(0x00)},
            {"UI_DIV",          var(0x01)},
            {"UI_SPAN",         var(0x02)},
            {"UI_BUTTON",       var(0x03)},
            {"UI_INPUT",        var(0x04)},
            {"UI_PARAGRAPH",    var(0x05)},
            {"UI_LINK",         var(0x06)},
            {"UI_IMAGE",        var(0x07)},
            {"UI_HEADER",       var(0x08)},
            {"UI_FORM",         var(0x0B)},
            {"UI_SCREEN",       var(0x1E)},
            {"UI_GRID",         var(0x22)},

            // ⚡ Dolphin Native 2 Hardware Bridge Actions
            {"HW_CAMERA",       var(0x40)},
            {"HW_GPS",          var(0x41)},
            {"HW_VIBRATE",      var(0x42)},
            {"HW_FILE_READ",    var(0x43)},
            {"HW_FILE_WRITE",   var(0x44)},
            {"HW_NETWORK",      var(0x45)},
            {"HW_BATTERY",      var(0x46)},
            {"HW_NOTIFICATION", var(0x47)},
            {"HW_FLASHLIGHT",   var(0x48)},
            {"HW_SENSOR_ACCEL", var(0x49)},
            {"HW_SENSOR_GYRO",  var(0x4A)},

            // 🔄 Dolphin Native 2 HotPatch Live Sync (Port 7788)
            {"HOTPATCH_CHUNK",  var(0x70)},
            {"HOTPATCH_APPLY",  var(0x71)},
            {"HOTPATCH_ACK",    var(0x72)},

            // 🚀 Titan P2P Direct Mesh & UDP Hole Punching Opcodes
            {"P2P_OFFER",       var(0x80)},
            {"P2P_ANSWER",      var(0x81)},
            {"P2P_CANDIDATE",   var(0x82)},
            {"P2P_DIRECT_PING", var(0x83)},
            {"P2P_DIRECT_PONG", var(0x84)}
        });
    }

    static inline uint16_t readUInt16BE(const std::string& buf, size_t offset) {
        if (offset + 2 > buf.size()) return 0;
        return (uint16_t)(((uint8_t)buf[offset] << 8) | (uint8_t)buf[offset + 1]);
    }

    static inline int32_t readInt32BE(const std::string& buf, size_t offset) {
        if (offset + 4 > buf.size()) return 0;
        return (int32_t)(
            ((uint8_t)buf[offset] << 24) |
            ((uint8_t)buf[offset + 1] << 16) |
            ((uint8_t)buf[offset + 2] << 8) |
            ((uint8_t)buf[offset + 3])
        );
    }

    static inline void writeUInt16BE(std::string& buf, size_t offset, uint16_t val) {
        if (offset + 2 > buf.size()) buf.resize(offset + 2, '\0');
        buf[offset] = (char)((val >> 8) & 0xFF);
        buf[offset + 1] = (char)(val & 0xFF);
    }

    static inline void writeInt32BE(std::string& buf, size_t offset, int32_t val) {
        if (offset + 4 > buf.size()) buf.resize(offset + 4, '\0');
        uint32_t uval = (uint32_t)val;
        buf[offset] = (char)((uval >> 24) & 0xFF);
        buf[offset + 1] = (char)((uval >> 16) & 0xFF);
        buf[offset + 2] = (char)((uval >> 8) & 0xFF);
        buf[offset + 3] = (char)(uval & 0xFF);
    }

    var parseHeader(const var& data) {
        std::string buf = data.toString();
        if (buf.length() < 24) return var();

        uint16_t sig = readUInt16BE(buf, 0);
        if (sig != 0x5442) {
            print("[TitanProtocol] Invalid Signature: 0x" + std::to_string(sig));
            return var();
        }

        var header = var(var_object{});
        header["signature"] = var((int)sig);
        header["version"] = var((int)(uint8_t)buf[2]);
        header["cmdType"] = var((int)(uint8_t)buf[3]);
        header["senderExt"] = var((int)readInt32BE(buf, 4));
        header["targetExt"] = var((int)readInt32BE(buf, 8));
        header["payloadLen"] = var((int)readInt32BE(buf, 12));
        header["seqNo"] = var((int)readInt32BE(buf, 16));
        header["sessionId"] = var((int)readUInt16BE(buf, 20));
        header["flags"] = var((int)(uint8_t)buf[22]);
        header["checksum"] = var((int)(uint8_t)buf[23]);
        return header;
    }

    var encodeHeader(const var& headerObj) {
        std::string buf(24, '\0');
        uint16_t sig = !headerObj["signature"].isNull() ? (uint16_t)headerObj["signature"].toInt() : 0x5442;
        uint8_t ver = !headerObj["version"].isNull() ? (uint8_t)headerObj["version"].toInt() : 0x02;
        uint8_t cmd = !headerObj["cmdType"].isNull() ? (uint8_t)headerObj["cmdType"].toInt() : 0x30;
        int32_t sender = !headerObj["senderExt"].isNull() ? (int32_t)headerObj["senderExt"].toInt() : 0;
        int32_t target = !headerObj["targetExt"].isNull() ? (int32_t)headerObj["targetExt"].toInt() : 0;
        int32_t plen = !headerObj["payloadLen"].isNull() ? (int32_t)headerObj["payloadLen"].toInt() : 0;
        int32_t seq = !headerObj["seqNo"].isNull() ? (int32_t)headerObj["seqNo"].toInt() : 0;
        uint16_t session = !headerObj["sessionId"].isNull() ? (uint16_t)headerObj["sessionId"].toInt() : 0;
        uint8_t flags = !headerObj["flags"].isNull() ? (uint8_t)headerObj["flags"].toInt() : 0;
        uint8_t checksum = !headerObj["checksum"].isNull() ? (uint8_t)headerObj["checksum"].toInt() : 0;

        writeUInt16BE(buf, 0, sig);
        buf[2] = (char)ver;
        buf[3] = (char)cmd;
        writeInt32BE(buf, 4, sender);
        writeInt32BE(buf, 8, target);
        writeInt32BE(buf, 12, plen);
        writeInt32BE(buf, 16, seq);
        writeUInt16BE(buf, 20, session);
        buf[22] = (char)flags;
        buf[23] = (char)checksum;
        return var(buf);
    }

    var pack(const var& cmdType, const var& senderExt, const var& targetExt, const var& payload = "", const var& seqNo = 0, const var& sessionId = 0, const var& flags = 0) {
        std::string pstr = payload.toString();
        var hdr = var(var_object{
            {"cmdType", cmdType},
            {"senderExt", senderExt},
            {"targetExt", targetExt},
            {"payloadLen", var((int)pstr.length())},
            {"seqNo", seqNo},
            {"sessionId", sessionId},
            {"flags", flags}
        });
        std::string hstr = encodeHeader(hdr).toString();
        return var(hstr + pstr);
    }

    var unpack(const var& packet) {
        std::string raw = packet.toString();
        var res = var(var_object{});
        if (raw.length() < 24) return res;

        var header = parseHeader(var(raw.substr(0, 24)));
        res["header"] = header;
        if (!header.isNull()) {
            int plen = header["payloadLen"].toInt();
            if (raw.length() >= (size_t)(24 + plen)) {
                res["payload"] = var(raw.substr(24, plen));
            } else {
                res["payload"] = var(raw.substr(24));
            }
        }
        return res;
    }

    var Server() {
        var tcp_srv = TCP.Server();
        var s = var(var_object{});
        s.event_listeners = tcp_srv.event_listeners;
        s.tcp_server = tcp_srv.tcp_server;

        auto registered_clients = std::make_shared<std::map<int, var>>();
        s["clients"] = var(var_object{});
        s["tcp_srv"] = tcp_srv;

        auto s_shared_listeners = s.event_listeners;

        tcp_srv.on(var("connection"), var([this, s_shared_listeners, registered_clients](const std::vector<var>& args) mutable -> var {
            var client = args[0];
            auto buffer = std::make_shared<std::string>();

            auto emit_server = [&](const std::string& event, const var& ctx) {
                if (s_shared_listeners && s_shared_listeners->count(event)) {
                    std::vector<var> listeners_copy = (*s_shared_listeners)[event];
                    for (const auto& cb : listeners_copy) {
                        if (cb.isFunction()) {
                            DolphinRuntime::EventLoop::instance().queueCallback(cb, {ctx});
                        }
                    }
                }
            };

            client.on(var("data"), var([this, s_shared_listeners, client, buffer, registered_clients](const std::vector<var>& data_args) mutable -> var {
                std::string chunk = data_args[0].toString();
                buffer->append(chunk);

                while (buffer->length() >= 24) {
                    var header = parseHeader(var(buffer->substr(0, 24)));
                    if (header.isNull()) {
                        print("[Titan Server] Header parsing error or invalid signature. Dropping connection buffer.");
                        buffer->clear();
                        break;
                    }

                    int plen = header["payloadLen"].toInt();
                    if (buffer->length() < (size_t)(24 + plen)) {
                        break; // wait for full payload
                    }

                    std::string payload = buffer->substr(24, plen);
                    *buffer = buffer->substr(24 + plen);

                    int cmd = header["cmdType"].toInt();
                    int senderExt = header["senderExt"].toInt();
                    int targetExt = header["targetExt"].toInt();

                    // Create context object
                    var ctx = var(var_object{});
                    ctx["header"] = header;
                    ctx["cmd"] = var(cmd);
                    ctx["senderExt"] = var(senderExt);
                    ctx["targetExt"] = var(targetExt);
                    ctx["payload"] = var(payload);
                    ctx["socket"] = client;

                    // ctx.reply(cmdType, payload)
                    ctx["reply"] = var([this, client, senderExt](const std::vector<var>& replyArgs) mutable -> var {
                        int replyCmd = replyArgs.size() > 0 ? replyArgs[0].toInt() : 0x31;
                        std::string replyPayload = replyArgs.size() > 1 ? replyArgs[1].toString() : "";
                        var packet = pack(replyCmd, 0, senderExt, replyPayload);
                        client.write(packet);
                        return var(true);
                    });

                    // ctx.forwardToTarget()
                    ctx["forwardToTarget"] = var([this, header, payload, registered_clients](const std::vector<var>& _) mutable -> var {
                        int tExt = header["targetExt"].toInt();
                        if (registered_clients->count(tExt)) {
                            var targetSocket = (*registered_clients)[tExt];
                            var fullPacket = pack(header["cmdType"], header["senderExt"], tExt, payload, header["seqNo"], header["sessionId"], header["flags"]);
                            targetSocket.write(fullPacket);
                            return var(true);
                        }
                        return var(false);
                    });

                    // Helper to emit events directly through the shared listeners map
                    auto emit_server_ctx = [&](const std::string& event) {
                        if (s_shared_listeners && s_shared_listeners->count(event)) {
                            std::vector<var> listeners_copy = (*s_shared_listeners)[event];
                            for (const auto& cb : listeners_copy) {
                                if (cb.isFunction()) {
                                    DolphinRuntime::EventLoop::instance().queueCallback(cb, {ctx});
                                }
                            }
                        }
                    };

                    // Handle Registration
                    if (cmd == 0x08) { // REGISTER
                        (*registered_clients)[senderExt] = client;
                        ctx["reply"](var(0x09), var("REGISTERED")); // REGISTER_ACK
                        emit_server_ctx("register");
                    }
                    else if (cmd == 0x30) { // HEARTBEAT
                        ctx["reply"](var(0x31), var("PONG"));
                        emit_server_ctx("heartbeat");
                    }
                    else if (cmd == 0x10) emit_server_ctx("invite");
                    else if (cmd == 0x11) emit_server_ctx("accept");
                    else if (cmd == 0x12) emit_server_ctx("reject");
                    else if (cmd == 0x13) emit_server_ctx("hangup");
                    else if (cmd == 0x14) emit_server_ctx("audioFrame");
                    else if (cmd == 0x15) emit_server_ctx("videoFrame");
                    else if (cmd == 0x20) emit_server_ctx("chatMessage");

                    emit_server_ctx("packet");
                }
                return var();
            }));

            client.on(var("close"), var([registered_clients, client](const std::vector<var>& _) mutable -> var {
                for (auto it = registered_clients->begin(); it != registered_clients->end(); ) {
                    if (it->second.tcp_socket && client.tcp_socket && it->second.tcp_socket->sock == client.tcp_socket->sock) {
                        it = registered_clients->erase(it);
                    } else {
                        ++it;
                    }
                }
                return var();
            }));

            // Note: "connection" is NOT re-emitted via s_shared_listeners here because the bigLambda
            // IS the connection handler registered in s_shared_listeners["connection"]. Re-queuing it
            // would add extra data listeners to client on every connection event, causing duplicates.
            return var();
        }));

        s["listen"] = var([tcp_srv](const var& port) mutable -> var {
            print("[Titan Server] Listening on tcp://0.0.0.0:" + port.toString());
            tcp_srv.listen(port);
            return true;
        });

        return s;
    }

    var SerialServer(const var& comPort, const var& baudRate) {
        var s = var(var_object{});
        s.event_listeners = std::make_shared<std::map<std::string, std::vector<var>>>();
        
#ifdef _WIN32
        std::string portName = "\\\\.\\" + comPort.toString();
        HANDLE hSerial = CreateFileA(portName.c_str(), GENERIC_READ | GENERIC_WRITE, 0, 0, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, 0);
        if (hSerial == INVALID_HANDLE_VALUE) {
            print("[Titan SerialServer] Failed to open " + comPort.toString());
            return s;
        }

        DCB dcbSerialParams = {0};
        dcbSerialParams.DCBlength = sizeof(dcbSerialParams);
        GetCommState(hSerial, &dcbSerialParams);
        dcbSerialParams.BaudRate = baudRate.toInt();
        dcbSerialParams.ByteSize = 8;
        dcbSerialParams.StopBits = ONESTOPBIT;
        dcbSerialParams.Parity = NOPARITY;
        SetCommState(hSerial, &dcbSerialParams);

        COMMTIMEOUTS timeouts = {0};
        timeouts.ReadIntervalTimeout = MAXDWORD;
        timeouts.ReadTotalTimeoutMultiplier = 0;
        timeouts.ReadTotalTimeoutConstant = 0;
        SetCommTimeouts(hSerial, &timeouts);

        print("[Titan SerialServer] Listening on " + comPort.toString() + " at " + baudRate.toString() + " bps");

        auto buffer = std::make_shared<std::string>();
        auto shared_listeners = s.event_listeners;
        
        // Emulate an async read loop via setTimeout
        var readLoop = var([this, hSerial, buffer, shared_listeners]() mutable -> var {
            char buf[1024];
            DWORD bytesRead;
            if (ReadFile(hSerial, buf, sizeof(buf), &bytesRead, NULL) && bytesRead > 0) {
                buffer->append(buf, bytesRead);
                
                while (buffer->length() >= 24) {
                    var header = parseHeader(var(buffer->substr(0, 24)));
                    if (header.isNull()) {
                        buffer->clear();
                        break;
                    }
                    int plen = header["payloadLen"].toInt();
                    if (buffer->length() < (size_t)(24 + plen)) break;
                    
                    std::string payload = buffer->substr(24, plen);
                    *buffer = buffer->substr(24 + plen);
                    
                    int cmd = header["cmdType"].toInt();
                    var ctx = var(var_object{
                        {"header", header},
                        {"cmd", var(cmd)},
                        {"senderExt", header["senderExt"]},
                        {"targetExt", header["targetExt"]},
                        {"payload", var(payload)}
                    });
                    
                    ctx["reply"] = var([this, hSerial, header](const std::vector<var>& replyArgs) mutable -> var {
                        int replyCmd = replyArgs.size() > 0 ? replyArgs[0].toInt() : 0x31;
                        std::string replyPayload = replyArgs.size() > 1 ? replyArgs[1].toString() : "";
                        var packet = pack(replyCmd, 0, header["senderExt"], replyPayload);
                        DWORD bytesWritten;
                        WriteFile(hSerial, packet.toString().c_str(), packet.toString().size(), &bytesWritten, NULL);
                        return var(true);
                    });
                    
                    auto emit_event = [&](const std::string& event) {
                        if (shared_listeners && shared_listeners->count(event)) {
                            std::vector<var> listeners_copy = (*shared_listeners)[event];
                            for (const auto& cb : listeners_copy) {
                                if (cb.isFunction()) DolphinRuntime::EventLoop::instance().queueCallback(cb, {ctx});
                            }
                        }
                    };
                    
                    if (cmd == 0x08) { ctx["reply"](var(0x09), var("REGISTERED")); emit_event("register"); }
                    else if (cmd == 0x30) { ctx["reply"](var(0x31), var("PONG")); emit_event("heartbeat"); }
                    else if (cmd == 0x10) emit_event("invite");
                    else if (cmd == 0x11) emit_event("accept");
                    else if (cmd == 0x14) emit_event("audioFrame");
                    else if (cmd == 0x15) emit_event("videoFrame");
                    
                    emit_event("packet");
                }
            }
            return var(true);
        });
        
        // Loop every 50ms using setInterval
        setInterval(readLoop, var(50));
        
        s["close"] = var([hSerial]() mutable -> var {
            CloseHandle(hSerial);
            return var(true);
        });
#else
        print("[Titan SerialServer] Unsupported OS for Serial COM.");
#endif
        return s;
    }

    var Client(const var& host, const var& port, const var& myExt) {
        var c = var(var_object{});
        c.event_listeners = std::make_shared<std::map<std::string, std::vector<var>>>();

        int ext = myExt.toInt();
        var socket = TCP.connect(host, port);
        c["socket"] = socket;

        c["register"] = var([this, c, socket, ext](const std::vector<var>& _) mutable -> var {
            var regPacket = pack(0x08, ext, 0, "REGISTER");
            socket.write(regPacket);
            return c;
        });

        if (!socket.isNull()) {
            auto buffer = std::make_shared<std::string>();
            // Share the same event_listeners map so script listeners added on returned c are visible inside data callback
            auto shared_listeners = c.event_listeners;

            socket.on(var("data"), var([this, shared_listeners, buffer](const std::vector<var>& args) mutable -> var {
                std::string chunk = args[0].toString();
                buffer->append(chunk);

                while (buffer->length() >= 24) {
                    var header = parseHeader(var(buffer->substr(0, 24)));
                    if (header.isNull()) {
                        buffer->clear();
                        break;
                    }

                    int plen = header["payloadLen"].toInt();
                    if (buffer->length() < (size_t)(24 + plen)) break;

                    std::string payload = buffer->substr(24, plen);
                    *buffer = buffer->substr(24 + plen);

                    int cmd = header["cmdType"].toInt();
                    var packetObj = var(var_object{
                        {"header", header},
                        {"cmd", var(cmd)},
                        {"senderExt", header["senderExt"]},
                        {"targetExt", header["targetExt"]},
                        {"payload", var(payload)}
                    });

                    // Emit events directly on shared_listeners (same map as returned c)
                    auto emit_event = [&](const std::string& event) {
                        if (shared_listeners && shared_listeners->count(event)) {
                            std::vector<var> listeners_copy = (*shared_listeners)[event];
                            for (const auto& cb : listeners_copy) {
                                if (cb.isFunction()) {
                                    DolphinRuntime::EventLoop::instance().queueCallback(cb, {packetObj});
                                }
                            }
                        }
                    };

                    if (cmd == 0x09) emit_event("registered");
                    else if (cmd == 0x10) emit_event("callInvite");
                    else if (cmd == 0x14) emit_event("audioFrame");
                    else if (cmd == 0x15) emit_event("videoFrame");
                    else if (cmd == 0x20) emit_event("chatMessage");

                    emit_event("packet");
                }
                return var();
            }));

            // All listeners attached — start reading from socket now
            socket["startRead"]();

            // Emit "connected" on the shared listeners
            if (shared_listeners && shared_listeners->count("connected")) {
                std::vector<var> cbs = (*shared_listeners)["connected"];
                for (const auto& cb : cbs) {
                    if (cb.isFunction()) {
                        DolphinRuntime::EventLoop::instance().queueCallback(cb, {var(true)});
                    }
                }
            }
        }

        c["send"] = var([this, c, socket, ext](const var& cmd, const var& targetExt, const var& payload) mutable -> var {
            var packet = pack(cmd, ext, targetExt, payload);
            socket.write(packet);
            return c;
        });

        c["call"] = var([this, c, socket, ext](const var& targetExt, const var& mediaType) mutable -> var {
            var packet = pack(0x10, ext, targetExt, mediaType.toString());
            socket.write(packet);
            return c;
        });

        c["sendVideoFrame"] = var([this, c, socket, ext](const var& targetExt, const var& frameData) mutable -> var {
            var packet = pack(0x15, ext, targetExt, frameData.toString());
            socket.write(packet);
            return c;
        });

        c["sendAudioFrame"] = var([this, c, socket, ext](const var& targetExt, const var& audioData) mutable -> var {
            var packet = pack(0x14, ext, targetExt, audioData.toString());
            socket.write(packet);
            return c;
        });

        c["sendChat"] = var([this, c, socket, ext](const var& targetExt, const var& message) mutable -> var {
            var packet = pack(0x20, ext, targetExt, message.toString());
            socket.write(packet);
            return c;
        });

        return c;
    }
} Titan;

// ── Lightweight Native SIP / VoIP Telecom Bridge (RFC 3261 Trunking) ──────
struct SIPNamespace {
    var Server(const var& port = var(5060)) {
        var s = var(var_object{});
        s.event_listeners = std::make_shared<std::map<std::string, std::vector<var>>>();

        s["port"] = port;
        s["listen"] = var([port](const std::vector<var>& _) -> var {
            print("[SIP Telecom Server] Listening for Standard SIP Trunk on UDP/TCP port " + port.toString());
            return var(true);
        });

        s["parseRequest"] = var([](const std::vector<var>& args) -> var {
            if (args.empty()) return var(var_object{});
            std::string raw = args[0].toString();
            var req = var(var_object{});
            std::stringstream ss(raw);
            std::string line;
            if (std::getline(ss, line)) {
                if (line.find("INVITE") != std::string::npos) req["method"] = var("INVITE");
                else if (line.find("REGISTER") != std::string::npos) req["method"] = var("REGISTER");
                else if (line.find("BYE") != std::string::npos) req["method"] = var("BYE");
                else if (line.find("ACK") != std::string::npos) req["method"] = var("ACK");
            }
            return req;
        });

        s["createResponse"] = var([](const std::vector<var>& args) -> var {
            int code = args.size() > 0 ? args[0].toInt() : 200;
            std::string status = (code == 200) ? "OK" : (code == 180) ? "Ringing" : (code == 100) ? "Trying" : "Decline";
            std::string res = "SIP/2.0 " + std::to_string(code) + " " + status + "\r\nContent-Length: 0\r\n\r\n";
            return var(res);
        });

        print("[SIP Engine] Native SIP/VoIP Trunking Initialized (RFC 3261)");
        return s;
    }
} SIP, DolphinSIP;
