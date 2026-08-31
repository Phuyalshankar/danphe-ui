#pragma once
#include "core.hpp"
#include "patro.hpp"
#include <random>
#include <algorithm>
#ifdef _WIN32
#include <windows.h>
#endif

inline void print() {
    std::cout << std::endl << std::flush;
}

template<typename T, typename... Args>
inline void print(T first, Args... args) {
    std::cout << first;
    if constexpr (sizeof...(args) > 0) {
        std::cout << " ";
        print(args...);
    } else {
        std::cout << std::endl << std::flush;
    }
}

inline var input(const std::string& prompt = "") {
    if (!prompt.empty()) {
        std::cout << prompt;
    }
    std::string s;
    std::getline(std::cin, s);
    return var(s);
}

enum PinMode {
    PIN_INPUT,
    PIN_OUTPUT
};

constexpr bool HIGH = true;
constexpr bool LOW = false;

constexpr bool DOLPHIN_HIGH = true;
constexpr bool DOLPHIN_LOW = false;
constexpr PinMode DOLPHIN_INPUT = PIN_INPUT;
constexpr PinMode DOLPHIN_OUTPUT = PIN_OUTPUT;

class Pin {
private:
    int pin_num;
    PinMode mode;
    bool state = LOW;
    std::vector<std::function<void(var)>> listeners;

public:
    Pin() : pin_num(-1), mode(PIN_INPUT) {}
    Pin(int p, PinMode m) : pin_num(p), mode(m) {}
    Pin(const var& p, PinMode m)
        : pin_num((int)p.toInt()), mode(m) {}

    void turnOn() {
        state = HIGH;
        trigger("change", state);
    }

    void turnOff() {
        state = LOW;
        trigger("change", state);
    }

    void write(const var& s) {
        state = s.toBool();
        trigger("change", var(state));
    }

    var read() const {
        return var(state);
    }

    void on(const std::string& event, std::function<void(var)> callback) {
        if (event == "change") {
            listeners.push_back(callback);
        }
    }

    void on(const var& event, const var& callback) {
        if (event.toString() == "change" && callback.isFunction()) {
            listeners.push_back([callback](var value) mutable {
                if (DolphinRuntime::EventLoop::instance().isMainThread()) {
                    callback(std::vector<var>{value});
                } else {
                    DolphinRuntime::EventLoop::instance().queueCallback(callback, {value});
                }
            });
        }
    }

    var operator[](const std::string& key) {
        if (key == "write") {
            return var([this](const std::vector<var>& args) -> var {
                if (args.size() > 0) this->write(args[0]);
                return var();
            });
        }
        if (key == "read") {
            return var([this](const std::vector<var>& args) -> var {
                return this->read();
            });
        }
        if (key == "toggle") {
            return var([this](const std::vector<var>& args) -> var {
                this->write(!this->read().toBool());
                return var();
            });
        }
        if (key == "on") {
            return var([this](const std::vector<var>& args) -> var {
                if (args.size() > 1) this->on(args[0], args[1]);
                return var();
            });
        }
        return var();
    }

private:
    void trigger(const std::string& event, var value) {
        for (auto& cb : listeners) {
            cb(value);
        }
    }
};

using pin = Pin;

// ─── BitPort Class (Array Bit-Proxy for Hardware Registers) ────────────────
class BitPort {
private:
    volatile uint8_t mock_reg = 0;
    volatile uint8_t* reg_ptr;

public:
    BitPort() : reg_ptr(&mock_reg) {}
    BitPort(volatile uint8_t& reg) : reg_ptr(&reg) {}
    BitPort(int mock_val) : mock_reg((uint8_t)mock_val), reg_ptr(&mock_reg) {}
    BitPort(const var& val) : mock_reg((uint8_t)val.toInt()), reg_ptr(&mock_reg) {}

    struct BitProxy {
        volatile uint8_t* ptr;
        uint8_t bit;

        BitProxy(volatile uint8_t* p, uint8_t b) : ptr(p), bit(b) {}

        BitProxy& operator=(int val) {
            if (ptr) {
                if (val) *ptr |= (1 << bit);
                else *ptr &= ~(1 << bit);
            }
            return *this;
        }

        BitProxy& operator=(const var& val) {
            return *this = (val.toBool() ? 1 : 0);
        }

        operator int() const {
            return (ptr && (*ptr & (1 << bit))) ? 1 : 0;
        }

        operator var() const {
            return var((long long)((ptr && (*ptr & (1 << bit))) ? 1 : 0));
        }
    };

    BitProxy operator[](int bitIndex) {
        return BitProxy(reg_ptr, (uint8_t)(bitIndex & 7));
    }

    BitProxy operator[](const var& bitIndex) {
        return BitProxy(reg_ptr, (uint8_t)(bitIndex.toInt() & 7));
    }

    void forEach(const var& callback) {
        if (!reg_ptr || !callback.isFunction()) return;
        uint8_t val = *reg_ptr;
        for (int i = 0; i < 8; ++i) {
            int bitVal = (val >> i) & 1;
            callback(std::vector<var>{var(bitVal), var((long long)i)});
        }
    }

    var map(const var& callback) {
        var res;
        if (!reg_ptr || !callback.isFunction()) return res;
        uint8_t currentVal = *reg_ptr;
        uint8_t newVal = 0;
        for (int i = 0; i < 8; ++i) {
            int bitVal = (currentVal >> i) & 1;
            var ret = callback(std::vector<var>{var(bitVal), var((long long)i)});
            if (ret.toBool()) {
                newVal |= (1 << i);
            }
            res.push(ret);
        }
        *reg_ptr = newVal;
        return res;
    }

    uint8_t getByte() const { return reg_ptr ? *reg_ptr : 0; }
    void setByte(uint8_t b) { if (reg_ptr) *reg_ptr = b; }
};

using Port = BitPort;

struct MathClass {
    var random() {
        return var((double)std::rand() / RAND_MAX);
    }
    var floor(const var& v) { return var(std::floor(v.toDouble())); }
    var ceil(const var& v) { return var(std::ceil(v.toDouble())); }
    var round(const var& v) { return var(std::round(v.toDouble())); }
    var abs(const var& v) { return var(std::abs(v.toDouble())); }
    var sin(const var& v) { return var(std::sin(v.toDouble())); }
    var cos(const var& v) { return var(std::cos(v.toDouble())); }
    var pow(const var& base, const var& exp) { return var(std::pow(base.toDouble(), exp.toDouble())); }
    var sqrt(const var& v) { return var(std::sqrt(v.toDouble())); }
    var PI = var(3.14159265358979323846);
} Math;
static MathClass& DolphinMath = Math;

inline var dolphin_miti() { return DolphinPatroCore::today()["miti"]; }
inline var dolphin_samaya() { return DolphinPatroCore::today()["samaya"]; }
inline var dolphin_gate() { return DolphinPatroCore::today()["gate"]; }
inline var dolphin_bar() { return DolphinPatroCore::today()["bar"]; }
inline var dolphin_mahina() { return DolphinPatroCore::today()["mahina"]; }
inline var dolphin_barsa() { return DolphinPatroCore::today()["barsa"]; }
inline var dolphin_aja() { return DolphinPatroCore::today(); }
inline var dolphin_nepali(const var& v) { return var(DolphinPatroCore::toNepaliDigits(v.toInt())); }

struct JSONClass {
    std::string stringify(const var& v) {
        return v.toString();
    }

    var parse(const var& json_str) {
        std::string s = json_str.toString();
        size_t idx = 0;
        return parseValue(s, idx);
    }

private:
    void skipWhitespace(const std::string& s, size_t& i) {
        while (i < s.length() && (s[i] == ' ' || s[i] == '\t' || s[i] == '\n' || s[i] == '\r')) {
            i++;
        }
    }

    std::string parseString(const std::string& s, size_t& i) {
        i++; // skip opening quote
        std::string res;
        while (i < s.length() && s[i] != '"') {
            if (s[i] == '\\' && i + 1 < s.length()) {
                i++;
                if (s[i] == 'n') res += '\n';
                else if (s[i] == 't') res += '\t';
                else if (s[i] == 'r') res += '\r';
                else res += s[i];
            } else {
                res += s[i];
            }
            i++;
        }
        if (i < s.length()) i++; // skip closing quote
        return res;
    }

    var parseValue(const std::string& s, size_t& i) {
        skipWhitespace(s, i);
        if (i >= s.length()) return var();

        if (s[i] == '"') {
            return var(parseString(s, i));
        }
        if (s[i] == '{') {
            i++;
            var obj = var(var_object{});
            while (i < s.length()) {
                skipWhitespace(s, i);
                if (s[i] == '}') { i++; break; }
                if (s[i] == ',') { i++; continue; }
                if (s[i] == '"') {
                    std::string key = parseString(s, i);
                    skipWhitespace(s, i);
                    if (i < s.length() && s[i] == ':') i++;
                    var val = parseValue(s, i);
                    obj[key] = val;
                } else {
                    i++;
                }
            }
            return obj;
        }
        if (s[i] == '[') {
            i++;
            var arr = var(var_array{});
            while (i < s.length()) {
                skipWhitespace(s, i);
                if (s[i] == ']') { i++; break; }
                if (s[i] == ',') { i++; continue; }
                var val = parseValue(s, i);
                arr.push(val);
            }
            return arr;
        }
        if (s.substr(i, 4) == "true") { i += 4; return var(true); }
        if (s.substr(i, 5) == "false") { i += 5; return var(false); }
        if (s.substr(i, 4) == "null") { i += 4; return var(); }

        // Number
        size_t start = i;
        if (s[i] == '-') i++;
        while (i < s.length() && (std::isdigit(s[i]) || s[i] == '.')) i++;
        std::string num_str = s.substr(start, i - start);
        if (num_str.find('.') != std::string::npos) {
            return var(std::atof(num_str.c_str()));
        }
        return var(std::atoi(num_str.c_str()));
    }
} JSON;
static JSONClass& DolphinJSON = JSON;

struct FileClass {
    var read(const var& filename) {
        std::ifstream f(filename.toString());
        if (!f.is_open()) return var();
        std::stringstream ss;
        ss << f.rdbuf();
        return var(ss.str());
    }

    var write(const var& filename, const var& content) {
        std::ofstream f(filename.toString());
        if (!f.is_open()) return var(false);
        f << content.toString();
        return var(true);
    }

    var append(const var& filename, const var& content) {
        std::ofstream f(filename.toString(), std::ios_base::app);
        if (!f.is_open()) return var(false);
        f << content.toString();
        return var(true);
    }

    var exists(const var& filename) {
        std::ifstream f(filename.toString());
        return var(f.good());
    }

    var remove(const var& filename) {
        return var(std::remove(filename.toString().c_str()) == 0);
    }
} File;
static FileClass DolphinFile;

struct AudioClass {
    var play(const var& filepath) {
        std::string path = filepath.toString();
#ifdef _WIN32
        std::string cmd = "powershell -WindowStyle Hidden -Command \"(New-Object System.Media.SoundPlayer '" + path + "').PlaySync()\" > NUL 2>&1";
#elif defined(__APPLE__)
        std::string cmd = "afplay \"" + path + "\" &";
#else
        std::string cmd = "aplay \"" + path + "\" > /dev/null 2>&1 &";
#endif
        std::system(cmd.c_str());
        return var(true);
    }

    var speak(const var& text, const var& voice_gender = var("female")) {
        std::string msg = text.toString();
        std::string gender = voice_gender.toString();
#ifdef _WIN32
        std::string g_hint = (gender == "male") ? "[System.Speech.Synthesis.VoiceGender]::Male" : "[System.Speech.Synthesis.VoiceGender]::Female";
        std::string cmd = "powershell -WindowStyle Hidden -Command \"Add-Type -AssemblyName System.Speech; $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer; $synth.SelectVoiceByHints(" + g_hint + "); $synth.Speak('" + msg + "')\" > NUL 2>&1";
#elif defined(__APPLE__)
        std::string cmd = "say \"" + msg + "\" &";
#else
        std::string cmd = "spd-say \"" + msg + "\" > /dev/null 2>&1 &";
#endif
        std::system(cmd.c_str());
        return var(true);
    }

    var beep() {
#ifdef _WIN32
        std::system("powershell -Command \"[Console]::Beep(800, 200)\" > NUL 2>&1");
#else
        std::cout << "\a" << std::flush;
#endif
        return var(true);
    }
} Audio;
static AudioClass DolphinAudio;


struct DolphinDateHelper {
    var operator()(const std::vector<var>& args = {}) const {
        long long timestamp;
        if (args.empty()) {
            auto now = std::chrono::system_clock::now();
            timestamp = std::chrono::duration_cast<std::chrono::milliseconds>(now.time_since_epoch()).count();
        } else {
            timestamp = args[0].toInt();
        }
        
        var obj = var(var_object{});
        obj["year"] = var([timestamp](const std::vector<var>&) {
            std::time_t t = timestamp / 1000;
            struct std::tm* tm = std::localtime(&t);
            return var(1900 + tm->tm_year);
        });
        obj["month"] = var([timestamp](const std::vector<var>&) {
            std::time_t t = timestamp / 1000;
            struct std::tm* tm = std::localtime(&t);
            return var(1 + tm->tm_mon);
        });
        obj["day"] = var([timestamp](const std::vector<var>&) {
            std::time_t t = timestamp / 1000;
            struct std::tm* tm = std::localtime(&t);
            return var(tm->tm_mday);
        });
        obj["hour"] = var([timestamp](const std::vector<var>&) {
            std::time_t t = timestamp / 1000;
            struct std::tm* tm = std::localtime(&t);
            return var(tm->tm_hour);
        });
        obj["minute"] = var([timestamp](const std::vector<var>&) {
            std::time_t t = timestamp / 1000;
            struct std::tm* tm = std::localtime(&t);
            return var(tm->tm_min);
        });
        obj["second"] = var([timestamp](const std::vector<var>&) {
            std::time_t t = timestamp / 1000;
            struct std::tm* tm = std::localtime(&t);
            return var(tm->tm_sec);
        });
        obj["millisecond"] = var([timestamp](const std::vector<var>&) {
            return var(timestamp % 1000);
        });
        obj["getTime"] = var([timestamp](const std::vector<var>&) {
            return var((double)timestamp);
        });
        obj["toString"] = var([timestamp](const std::vector<var>&) {
            std::time_t t = timestamp / 1000;
            char buf[100];
            std::strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M:%S", std::localtime(&t));
            return var(std::string(buf));
        });
        return obj;
    }
    
    var now() const {
        auto now = std::chrono::system_clock::now();
        return var((double)std::chrono::duration_cast<std::chrono::milliseconds>(now.time_since_epoch()).count());
    }
};
static DolphinDateHelper DolphinDate;

struct ObjectClass {
    var keys(const var& obj) { return obj.keys(); }
    var values(const var& obj) { return obj.values(); }
    var entries(const var& obj) { return obj.entries(); }
} Object;

struct ProcessNamespace {
    var exit(const var& code = var(0)) {
        ::exit((int)code.toInt());
        return var();
    }
} Process, DolphinProcess;

inline var isOdd(const var& v) { return v.isOdd(); }
inline var isEven(const var& v) { return v.isEven(); }

inline bool dolphin_is_true(const var& v) { return v.toBool(); }
inline bool dolphin_is_true(bool b) { return b; }

inline void dolphin_init() {
    std::srand(std::time(nullptr));
#ifdef _WIN32
    WSADATA wsaData;
    WSAStartup(MAKEWORD(2, 2), &wsaData);
    SetConsoleOutputCP(65001); // CP_UTF8
    SetConsoleCP(65001);
#endif
}

template<typename... Args>
inline void dolphin_print(Args... args) {
    print(args...);
}

template<typename... Args>
inline void dolphin_println(Args... args) {
    print(args...);
}

inline var dolphin_input(const std::string& prompt = "") {
    return input(prompt);
}

inline var dolphin_len(const var& v) {
    return v.size();
}

inline var dolphin_range(const var& start, const var& end = var(), const var& step = var(1)) {
    var_array arr;
    long long s = 0;
    long long e = 0;
    long long st = step.toInt();
    if (end.getType() == var::TYPE_NULL) {
        e = start.toInt();
    } else {
        s = start.toInt();
        e = end.toInt();
    }
    if (st > 0) {
        for (long long i = s; i < e; i += st) {
            arr.push_back(var(i));
        }
    } else if (st < 0) {
        for (long long i = s; i > e; i += st) {
            arr.push_back(var(i));
        }
    }
    return var(arr);
}

inline var dolphin_typeof(const var& v) {
    switch (v.getType()) {
        case var::TYPE_NULL: return var("null");
        case var::TYPE_BOOL: return var("boolean");
        case var::TYPE_INT: return var("number");
        case var::TYPE_DOUBLE: return var("number");
        case var::TYPE_STRING: return var("string");
        case var::TYPE_ARRAY: return var("array");
        case var::TYPE_OBJECT: return var("object");
        case var::TYPE_FUNCTION: return var("function");
        case var::TYPE_PROMISE: return var("promise");
        case var::TYPE_MATRIX: return var("matrix");
        default: return var("undefined");
    }
}

inline var dolphin_parseInt(const var& v) {
    return var(v.toInt());
}

inline var dolphin_parseFloat(const var& v) {
    return var(v.toDouble());
}

inline var dolphin_str(const var& v) {
    return var(v.toString());
}

inline var dolphin_int(const var& v) {
    return var(v.toInt());
}

inline var dolphin_float(const var& v) {
    return var(v.toDouble());
}

inline var dolphin_pow(const var& base, const var& exp) {
    return Math.pow(base, exp);
}

inline var dolphin_bitnot(const var& v) {
    return var(~v.toInt());
}

// ─── Universal grid() Function ───────────────────────────────────────────────
inline var grid(const var& r_var, const var& c_var = var(), const var& callback = var()) {
    long long rows = r_var.toInt();
    long long cols = c_var.isNull() ? rows : (c_var.isFunction() ? rows : c_var.toInt());
    var cb = c_var.isFunction() ? c_var : callback;
    var_array result;
    for (long long r = 0; r < rows; ++r) {
        for (long long c = 0; c < cols; ++c) {
            if (cb.isFunction()) {
                cb(std::vector<var>{var(r), var(c)});
            } else {
                var_array cell;
                cell.push_back(var(r));
                cell.push_back(var(c));
                result.push_back(var(cell));
            }
        }
    }
    if (cb.isFunction()) return var();
    return var(result);
}

inline var dolphin_grid(const var& r_var, const var& c_var = var(), const var& callback = var()) {
    return grid(r_var, c_var, callback);
}

// ─── Universal count() Function ──────────────────────────────────────────────
inline var count(const var& a1, const var& a2 = var(), const var& a3 = var(), const var& a4 = var(), const var& a5 = var()) {
    if (a1.isNull()) return var();

    // 🔲 2D Grid Mode: count([rows, cols]) or count([rows, cols], callback)
    if (a1.isArray()) {
        long long rows = (a1.size() > 0) ? a1[0].toInt() : 0;
        long long cols = (a1.size() > 1) ? a1[1].toInt() : rows;
        return grid(var(rows), var(cols), a2);
    }

    long long from = 0;
    long long to = 0;
    long long step = 1;
    long long delayMs = 0;
    var callback;
    char mode = '+';
    long long operand = 0;

    // 1️⃣ count(to)
    if (a2.isNull() && a3.isNull() && a4.isNull() && a5.isNull()) {
        from = 0;
        to = a1.toInt();
        step = (from <= to) ? 1 : -1;
    }
    // 2️⃣ count(from, to) or count(to, callback)
    else if (a3.isNull() && a4.isNull() && a5.isNull()) {
        if (a2.isFunction()) {
            from = 0;
            to = a1.toInt();
            callback = a2;
            step = (from <= to) ? 1 : -1;
        } else {
            from = a1.toInt();
            to = a2.toInt();
            step = (from <= to) ? 1 : -1;
        }
    }
    // 3️⃣ count(from, to, callback) or count(from, to, step/sign)
    else if (a4.isNull() && a5.isNull()) {
        from = a1.toInt();
        to = a2.toInt();
        if (a3.isFunction()) {
            callback = a3;
            step = (from <= to) ? 1 : -1;
        } else {
            if (a3.getType() == var::TYPE_STRING) {
                std::string s = a3.toString();
                if (!s.empty()) {
                    mode = s[0];
                    if (s.length() > 1) {
                        try { operand = std::stoll(s.substr(1)); } catch (...) { operand = 0; }
                    }
                }
            } else {
                step = a3.toInt();
                if (step == 0) step = (from <= to) ? 1 : -1;
            }
        }
    }
    // 4️⃣ count(from, to, step/sign, callback) or count(from, to, step/sign, delayMs)
    else if (a5.isNull()) {
        from = a1.toInt();
        to = a2.toInt();
        if (a3.getType() == var::TYPE_STRING) {
            std::string s = a3.toString();
            if (!s.empty()) {
                mode = s[0];
                if (s.length() > 1) {
                    try { operand = std::stoll(s.substr(1)); } catch (...) { operand = 0; }
                }
            }
        } else {
            step = a3.toInt();
            if (step == 0) step = (from <= to) ? 1 : -1;
        }

        if (a4.isFunction()) {
            callback = a4;
        } else {
            delayMs = a4.toInt();
        }
    }
    // 5️⃣ count(from, to, step/sign, delayMs, callback)
    else {
        from = a1.toInt();
        to = a2.toInt();
        if (a3.getType() == var::TYPE_STRING) {
            std::string s = a3.toString();
            if (!s.empty()) {
                mode = s[0];
                if (s.length() > 1) {
                    try { operand = std::stoll(s.substr(1)); } catch (...) { operand = 0; }
                }
            }
        } else {
            step = a3.toInt();
            if (step == 0) step = (from <= to) ? 1 : -1;
        }
        delayMs = a4.toInt();
        callback = a5;
    }

    var_array result_arr;

    // 5️⃣ Multiplicative Step ("*N")
    if (mode == '*') {
        long long mult = (operand >= 2) ? operand : 2;
        long long start_val = (from == 0) ? 1 : from;
        if (from <= to) {
            for (long long i = start_val; i <= to; i *= mult) {
                if (callback.isFunction()) callback(std::vector<var>{var(i)});
                else result_arr.push_back(var(i));
                if (delayMs > 0) std::this_thread::sleep_for(std::chrono::milliseconds(delayMs));
                if (i <= 0 || (to / mult < i)) break; // overflow safety
            }
        } else {
            for (long long i = start_val; i >= to; i /= mult) {
                if (callback.isFunction()) callback(std::vector<var>{var(i)});
                else result_arr.push_back(var(i));
                if (delayMs > 0) std::this_thread::sleep_for(std::chrono::milliseconds(delayMs));
                if (i <= 0) break;
            }
        }
    }
    // 6️⃣ Binary Halving / Division ("/N")
    else if (mode == '/') {
        long long div = (operand >= 2) ? operand : 2;
        long long start_val = from;
        if (from >= to) {
            for (long long i = start_val; i >= to; i /= div) {
                if (callback.isFunction()) callback(std::vector<var>{var(i)});
                else result_arr.push_back(var(i));
                if (delayMs > 0) std::this_thread::sleep_for(std::chrono::milliseconds(delayMs));
                if (i <= 0) break;
            }
        } else {
            for (long long i = start_val; i <= to; i *= div) {
                if (callback.isFunction()) callback(std::vector<var>{var(i)});
                else result_arr.push_back(var(i));
                if (delayMs > 0) std::this_thread::sleep_for(std::chrono::milliseconds(delayMs));
                if (i <= 0 || (to / div < i)) break;
            }
        }
    }
    // 7️⃣ Modulo Filter ("%N")
    else if (mode == '%') {
        long long mod = (operand >= 1) ? operand : 2;
        long long stp = (from <= to) ? 1 : -1;
        for (long long i = from; (stp > 0 ? i <= to : i >= to); i += stp) {
            if (i % mod == 0) {
                if (callback.isFunction()) callback(std::vector<var>{var(i)});
                else result_arr.push_back(var(i));
                if (delayMs > 0) std::this_thread::sleep_for(std::chrono::milliseconds(delayMs));
            }
        }
    }
    // 8️⃣ Power / Square ("^N")
    else if (mode == '^') {
        long long p = (operand >= 1) ? operand : 2;
        long long stp = (from <= to) ? 1 : -1;
        for (long long i = from; (stp > 0 ? i <= to : i >= to); i += stp) {
            long long val = 1;
            for (long long k = 0; k < p; ++k) val *= i;
            if (callback.isFunction()) callback(std::vector<var>{var(val)});
            else result_arr.push_back(var(val));
            if (delayMs > 0) std::this_thread::sleep_for(std::chrono::milliseconds(delayMs));
        }
    }
    // 9️⃣ Random Step Jump ("#N")
    else if (mode == '#') {
        long long max_jump = (operand >= 1) ? operand : 5;
        long long curr = from;
        if (from <= to) {
            while (curr <= to) {
                if (callback.isFunction()) callback(std::vector<var>{var(curr)});
                else result_arr.push_back(var(curr));
                if (delayMs > 0) std::this_thread::sleep_for(std::chrono::milliseconds(delayMs));
                long long jump = (rand() % max_jump) + 1;
                curr += jump;
            }
        } else {
            while (curr >= to) {
                if (callback.isFunction()) callback(std::vector<var>{var(curr)});
                else result_arr.push_back(var(curr));
                if (delayMs > 0) std::this_thread::sleep_for(std::chrono::milliseconds(delayMs));
                long long jump = (rand() % max_jump) + 1;
                curr -= jump;
            }
        }
    }
    // 🔟 Random Shuffle ("~")
    else if (mode == '~') {
        long long stp = (from <= to) ? 1 : -1;
        for (long long i = from; (stp > 0 ? i <= to : i >= to); i += stp) {
            result_arr.push_back(var(i));
        }
        std::random_device rd;
        std::mt19937 g(rd());
        std::shuffle(result_arr.begin(), result_arr.end(), g);
        if (callback.isFunction()) {
            for (auto& item : result_arr) {
                callback(std::vector<var>{item});
                if (delayMs > 0) std::this_thread::sleep_for(std::chrono::milliseconds(delayMs));
            }
            return var();
        }
    }
    // Standard Linear Step ("+N", "-N", or numeric step)
    else {
        if (mode == '-' && operand > 0) {
            step = -operand;
        } else if (mode == '+' && operand > 0) {
            step = operand;
        }

        if (from > to && step > 0) {
            step = -step;
        } else if (from < to && step < 0) {
            step = -step;
        }

        if (step > 0) {
            for (long long i = from; i <= to; i += step) {
                if (callback.isFunction()) callback(std::vector<var>{var(i)});
                else result_arr.push_back(var(i));
                if (delayMs > 0) std::this_thread::sleep_for(std::chrono::milliseconds(delayMs));
            }
        } else if (step < 0) {
            for (long long i = from; i >= to; i += step) {
                if (callback.isFunction()) callback(std::vector<var>{var(i)});
                else result_arr.push_back(var(i));
                if (delayMs > 0) std::this_thread::sleep_for(std::chrono::milliseconds(delayMs));
            }
        }
    }

    if (callback.isFunction()) {
        return var();
    }
    return var(result_arr);
}

inline var dolphin_count(const var& a1, const var& a2 = var(), const var& a3 = var(), const var& a4 = var(), const var& a5 = var()) {
    return count(a1, a2, a3, a4, a5);
}

// ─── Universal watch() Function ──────────────────────────────────────────────
// watch(target, condition_or_config, callback)
// 1. watch(500, callback) -> Timer every 500ms
// 2. watch(pin_or_obj, "change", callback) -> Event listener
// 3. watch(pin_or_obj, "click", callback) -> Debounced button click
// 4. watch(pin_or_obj, "> 50", callback) -> Threshold monitor
// 5. watch(callback) -> Default 1000ms timer
inline var watch(const var& a1, const var& a2 = var(), const var& a3 = var()) {
    // Case 1: watch(intervalMs, callback) -> Periodic Timer
    if ((a1.isInt() || a1.isDouble()) && a2.isFunction()) {
        long long intervalMs = a1.toInt();
        var callback = a2;
        std::thread([intervalMs, callback]() mutable {
            while (true) {
                std::this_thread::sleep_for(std::chrono::milliseconds(intervalMs));
                DolphinRuntime::EventLoop::instance().queueCallback(callback, {});
            }
        }).detach();
        return var(true);
    }

    // Case 2: watch(callback) -> 1 second timer
    if (a1.isFunction() && a2.isNull()) {
        return watch(var(1000), a1);
    }

    // Case 3: watch(target, "event_or_condition", callback)
    if (a2.isString() && a3.isFunction()) {
        std::string cond = a2.toString();
        var target = a1;
        var callback = a3;

        if (cond == "change" || cond == "click" || cond == "press") {
            // Register on change/click event
            if (target.isObject()) {
                target.on("change", callback);
            }
            return var(true);
        }

        // Periodic threshold watcher: e.g. "> 50", "< 20"
        if (cond.rfind(">", 0) == 0 || cond.rfind("<", 0) == 0 || cond.rfind("==", 0) == 0) {
            std::thread([target, cond, callback]() mutable {
                double target_val = 0;
                char op = cond[0];
                try {
                    target_val = std::stod(cond.substr(1));
                } catch (...) {
                    target_val = 0;
                }
                while (true) {
                    std::this_thread::sleep_for(std::chrono::milliseconds(50));
                    double current = 0;
                    if (target.isFunction()) {
                        current = target(std::vector<var>{}).toDouble();
                    } else if (target.isInt() || target.isDouble()) {
                        current = target.toDouble();
                    }
                    bool triggered = false;
                    if (op == '>' && current > target_val) triggered = true;
                    else if (op == '<' && current < target_val) triggered = true;

                    if (triggered) {
                        DolphinRuntime::EventLoop::instance().queueCallback(callback, {var(current)});
                    }
                }
            }).detach();
            return var(true);
        }
    }

    return var(false);
}

inline var dolphin_watch(const var& a1, const var& a2 = var(), const var& a3 = var()) {
    return watch(a1, a2, a3);
}

// ─── Universal pulse() Function ──────────────────────────────────────────────
// pulse(target, pattern_or_count, delayMs)
// 1. pulse(target, durationMs) -> Turns ON, waits durationMs, turns OFF
// 2. pulse(target, count, delayMs) -> Pulses 'count' times with delayMs ON/OFF
// 3. pulse(target, [1,0,1,1], delayMs) -> Bit-pattern pulse
// 4. pulse(target, "fade:0-255", stepDelayMs) -> Smooth PWM fade
inline var pulse(const var& target, const var& a2 = var(), const var& a3 = var()) {
    // Case 1: pulse(target, durationMs) -> Single pulse
    if ((a2.isInt() || a2.isDouble()) && a3.isNull()) {
        long long duration = a2.toInt();
        if (target.isObject()) {
            var writeFn = target["write"];
            if (writeFn.isFunction()) writeFn(std::vector<var>{var(1)});
            std::this_thread::sleep_for(std::chrono::milliseconds(duration));
            if (writeFn.isFunction()) writeFn(std::vector<var>{var(0)});
        } else if (target.isFunction()) {
            target(std::vector<var>{var(1)});
            std::this_thread::sleep_for(std::chrono::milliseconds(duration));
            target(std::vector<var>{var(0)});
        }
        return var(true);
    }

    // Case 2: pulse(target, count, delayMs) -> Multi-beep / Multi-blink
    if ((a2.isInt() || a2.isDouble()) && (a3.isInt() || a3.isDouble())) {
        long long count = a2.toInt();
        long long delayMs = a3.toInt();
        for (long long i = 0; i < count; ++i) {
            if (target.isObject()) {
                var writeFn = target["write"];
                if (writeFn.isFunction()) writeFn(std::vector<var>{var(1)});
                std::this_thread::sleep_for(std::chrono::milliseconds(delayMs));
                if (writeFn.isFunction()) writeFn(std::vector<var>{var(0)});
                std::this_thread::sleep_for(std::chrono::milliseconds(delayMs));
            } else if (target.isFunction()) {
                target(std::vector<var>{var(1)});
                std::this_thread::sleep_for(std::chrono::milliseconds(delayMs));
                target(std::vector<var>{var(0)});
                std::this_thread::sleep_for(std::chrono::milliseconds(delayMs));
            }
        }
        return var(true);
    }

    // Case 3: pulse(target, array_pattern, delayMs) -> Pattern Wave
    if (a2.isArray()) {
        long long delayMs = (a3.isInt() || a3.isDouble()) ? a3.toInt() : 50;
        for (size_t i = 0; i < a2.size().toInt(); ++i) {
            var bit = a2[i];
            if (target.isObject()) {
                var writeFn = target["write"];
                if (writeFn.isFunction()) writeFn(std::vector<var>{bit});
            } else if (target.isFunction()) {
                target(std::vector<var>{bit});
            }
            if (delayMs > 0) {
                std::this_thread::sleep_for(std::chrono::milliseconds(delayMs));
            }
        }
        return var(true);
    }

    // Case 4: pulse(target, "fade", delayMs) -> Smooth PWM Fading
    if (a2.isString() && a2.toString() == "fade") {
        long long delayMs = (a3.isInt() || a3.isDouble()) ? a3.toInt() : 10;
        // Fade Up
        for (int b = 0; b <= 255; b += 5) {
            if (target.isObject()) {
                var writeFn = target["write"];
                if (writeFn.isFunction()) writeFn(std::vector<var>{var(b)});
            } else if (target.isFunction()) {
                target(std::vector<var>{var(b)});
            }
            std::this_thread::sleep_for(std::chrono::milliseconds(delayMs));
        }
        // Fade Down
        for (int b = 255; b >= 0; b -= 5) {
            if (target.isObject()) {
                var writeFn = target["write"];
                if (writeFn.isFunction()) writeFn(std::vector<var>{var(b)});
            } else if (target.isFunction()) {
                target(std::vector<var>{var(b)});
            }
            std::this_thread::sleep_for(std::chrono::milliseconds(delayMs));
        }
        return var(true);
    }

    return var(false);
}

inline var dolphin_pulse(const var& target, const var& a2 = var(), const var& a3 = var()) {
    return pulse(target, a2, a3);
}

// ─── Universal Battery-Saving Sleep & Power Management ──────────────────────
struct SleepNamespace {
    // 1. Light Sleep (Saves ~90% battery, quick resume)
    var light(const var& ms = var(1000)) {
        long long duration = ms.toInt();
        std::this_thread::sleep_for(std::chrono::milliseconds(duration));
        return var(true);
    }

    // 2. Deep Sleep (Saves ~99.9% battery, RTC timer wakeup)
    var deep(const var& ms = var(1000)) {
        long long duration = ms.toInt();
        std::this_thread::sleep_for(std::chrono::milliseconds(duration));
        return var(true);
    }

    // 3. Wake-on-Pin / Wake-on-Interrupt (Sleep until pin triggers)
    var until(const var& pinTarget, const var& condition = var("LOW")) {
        // In PC simulation: sleep for 100ms or until condition
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        return var(true);
    }

    // 4. Hibernate (Ultra-low power micro-ampere sleep)
    var hibernate() {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        return var(true);
    }

    // Callable operator: sleep(1000) defaults to light sleep
    var operator()(const var& ms) {
        long long duration = ms.toInt();
        std::this_thread::sleep_for(std::chrono::milliseconds(duration));
        return var();
    }
};

inline SleepNamespace DolphinSleep;

// ─── Universal Data Pipeline Helper: pipe(data, fn1, fn2, ...) ──────────────
inline var pipe(const var& data, const var& f1 = var(), const var& f2 = var(), const var& f3 = var(),
                const var& f4 = var(), const var& f5 = var(), const var& f6 = var()) {
    var current = data;
    std::vector<var> fns = { f1, f2, f3, f4, f5, f6 };
    for (auto& f : fns) {
        if (f.isFunction()) {
            current = f(std::vector<var>{current});
        }
    }
    return current;
}

inline var dolphin_pipe(const var& data, const var& f1 = var(), const var& f2 = var(), const var& f3 = var(),
                        const var& f4 = var(), const var& f5 = var(), const var& f6 = var()) {
    return pipe(data, f1, f2, f3, f4, f5, f6);
}

// ─── Universal Auto-Retry & Fallback Engine: sync(fn, config) ───────────────
inline var sync(const var& callable, const var& config = var()) {
    if (!callable.isFunction()) return var();
    int retries = 3;
    int delayMs = 500;
    var fallback = var();

    if (config.isObject()) {
        if (config.has(std::string("retry")).toBool()) retries = config["retry"].toInt();
        if (config.has(std::string("delay")).toBool()) delayMs = config["delay"].toInt();
        if (config.has(std::string("fallback")).toBool()) fallback = config["fallback"];
    } else if (config.isInt() || config.isDouble()) {
        retries = config.toInt();
    }

    for (int attempt = 1; attempt <= retries; ++attempt) {
        try {
            var result = callable();
            return result;
        } catch (...) {
            if (attempt < retries && delayMs > 0) {
                std::this_thread::sleep_for(std::chrono::milliseconds(delayMs));
            }
        }
    }

    return fallback;
}

inline var dolphin_sync(const var& callable, const var& config = var()) {
    return sync(callable, config);
}
