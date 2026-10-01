#pragma once
// Real-hardware runtime for Dolphin's `dolphin flash` target.
//
// This header is compiled by the Arduino/ESP32/ESP8266/STM32 toolchains
// (via arduino-cli), NOT by the PC `g++` path used by `dolphin run`.
// It mirrors the public API of dolphin_runtime.hpp's `var`, `Math`, and
// `JSON` helpers, but swaps the `Pin` class for real GPIO calls and routes
// print()/input() through the board's Serial port instead of stdio.
//
// Supported boards (see dolphin.cpp `flash` command for the FQBN table):
//   - ESP32, ESP8266: full support, these toolchains ship a full libstdc++.
//   - STM32 (STM32duino core): full support.
//   - Arduino AVR (Uno/Nano/Mega): best-effort. Stock avr-gcc has no
//     libstdc++, so std::string/std::vector/std::function used by `var`
//     will only compile if the sketch also depends on a Serial-STL shim
//     (e.g. ArduinoSTL) installed in arduino-cli. Prefer ESP32/STM32 for
//     anything beyond simple digital I/O on AVR boards.

#include <Arduino.h>
#undef PI

#ifdef ESP8266
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
using WebServerClass = ESP8266WebServer;
#elif defined(ESP32)
#include <WiFi.h>
#include <WebServer.h>
using WebServerClass = WebServer;
#endif

#if defined(ESP8266) || defined(ESP32)
static WebServerClass* global_esp_web_server = nullptr;
#endif

#ifdef __AVR__
#include <Arduino.h>
#include <stdlib.h>
#include <math.h>
#include <string.h>

namespace std {
    // Minimal initializer_list for AVR (brace-init support)
    template<typename T>
    class initializer_list {
        const T* arr;
        size_t len;
    public:
        constexpr initializer_list(const T* a, size_t l) : arr(a), len(l) {}
        constexpr initializer_list() : arr(nullptr), len(0) {}
        constexpr size_t size() const { return len; }
        constexpr const T* begin() const { return arr; }
        constexpr const T* end() const { return arr + len; }
    };
    class string {
        String str;
    public:
        static const size_t npos = (size_t)-1;
        string() : str("") {}
        string(const char* s) : str(s ? s : "") {}
        string(const String& s) : str(s) {}
        string(int val) : str(val) {}
        string(long long val) : str((long)val) {}
        string(double val) : str(val) {}
        const char* c_str() const { return str.c_str(); }
        size_t length() const { return str.length(); }
        size_t size() const { return str.length(); }
        bool empty() const { return str.length() == 0; }
        string substr(size_t pos = 0, size_t len = npos) const {
            if (pos >= str.length()) return string("");
            if (len == npos || pos + len > str.length()) return string(str.substring(pos));
            return string(str.substring(pos, pos + len));
        }
        size_t find(const string& s, size_t pos = 0) const {
            int idx = str.indexOf(s.str, pos);
            return idx < 0 ? npos : (size_t)idx;
        }
        size_t find(const char* s, size_t pos = 0) const {
            int idx = str.indexOf(s, pos);
            return idx < 0 ? npos : (size_t)idx;
        }
        size_t rfind(const char* s, size_t pos = 0) const {
            if (str.startsWith(s)) return 0;
            int idx = str.lastIndexOf(s);
            return idx < 0 ? npos : (size_t)idx;
        }
        bool operator==(const string& o) const { return str == o.str; }
        bool operator==(const char* o) const { return str == o; }
        bool operator!=(const string& o) const { return str != o.str; }
        string operator+(const string& o) const { return string(str + o.str); }
        string operator+(const char* o) const { return string(str + o); }
        string& operator+=(const string& o) { str += o.str; return *this; }
        string& operator+=(const char* o) { str += o; return *this; }
        char operator[](size_t i) const { return str[i]; }
        char& operator[](size_t i) { return str[i]; }
        const char* begin() const { return str.c_str(); }
        const char* end() const { return str.c_str() + str.length(); }
        const char* rbegin() const { return str.c_str() + str.length() - 1; }
        const char* rend() const { return str.c_str() - 1; }
        void erase(const char* pos) {}
        void erase(size_t pos, size_t len = npos) { str.remove(pos, len == npos ? str.length() - pos : len); }
        char back() const { size_t l = str.length(); return l > 0 ? str[l-1] : '\0'; }
        void pop_back() { size_t l = str.length(); if (l > 0) str.remove(l-1, 1); }
        size_t find_last_not_of(char c) const {
            for (int i = (int)str.length()-1; i >= 0; i--) {
                if (str[i] != c) return (size_t)i;
            }
            return npos;
        }
        bool operator<(const string& o) const { return strcmp(str.c_str(), o.str.c_str()) < 0; }
        bool operator>(const string& o) const { return strcmp(str.c_str(), o.str.c_str()) > 0; }
        bool operator<=(const string& o) const { return strcmp(str.c_str(), o.str.c_str()) <= 0; }
        bool operator>=(const string& o) const { return strcmp(str.c_str(), o.str.c_str()) >= 0; }
    };
    inline string to_string(int val) { return string(String(val)); }
    inline string to_string(long long val) { return string(String((long)val)); }
    inline string to_string(double val) { return string(String(val)); }
    template<typename T>
    class vector {
        T data[16];
        size_t sz = 0;
    public:
        vector() : sz(0) {}
        vector(const vector& o) : sz(o.sz) { for(size_t i=0;i<sz;i++) data[i]=o.data[i]; }
        vector(vector&& o) : sz(o.sz) { for(size_t i=0;i<sz;i++) data[i]=o.data[i]; o.sz=0; }
        vector(initializer_list<T> il) : sz(0) {
            for (const auto& v : il) push_back(v);
        }
        vector& operator=(const vector& o) { sz=o.sz; for(size_t i=0;i<sz;i++) data[i]=o.data[i]; return *this; }
        vector& operator=(vector&& o) { sz=o.sz; for(size_t i=0;i<sz;i++) data[i]=o.data[i]; o.sz=0; return *this; }
        void push_back(const T& val) { if(sz < 16) data[sz++] = val; }
        size_t size() const { return sz; }
        bool empty() const { return sz == 0; }
        void clear() { sz = 0; }
        T& operator[](size_t i) { return data[i]; }
        const T& operator[](size_t i) const { return data[i]; }
        T* begin() { return data; }
        T* end() { return data + sz; }
        const T* begin() const { return data; }
        const T* end() const { return data + sz; }
    };
    template<typename K, typename V>
    class map {
        K keys[8];
        V values[8];
        size_t sz = 0;
    public:
        map() : sz(0) {}
        size_t size() const { return sz; }
        bool empty() const { return sz == 0; }
        V& operator[](const K& key) {
            for (size_t i = 0; i < sz; i++) {
                if (keys[i] == key) return values[i];
            }
            if (sz < 8) {
                keys[sz] = key;
                return values[sz++];
            }
            return values[0];
        }
        size_t count(const K& key) const {
            for (size_t i = 0; i < sz; i++) {
                if (keys[i] == key) return 1;
            }
            return 0;
        }
        // Minimal iterator for range-for / find compatibility
        struct kv_pair { K& first; V& second; };
        struct iterator {
            K* k; V* v; bool valid;
            kv_pair operator*() const { return {*k, *v}; }
            bool operator!=(const iterator& o) const { return valid != o.valid || (valid && k != o.k); }
        };
        iterator end() const { return {nullptr, nullptr, false}; }
        iterator find(const K& key) {
            for (size_t i = 0; i < sz; i++) {
                if (keys[i] == key) return {&keys[i], &values[i], true};
            }
            return end();
        }
    };
    template<typename T>
    class shared_ptr {
        T* ptr;
    public:
        shared_ptr() : ptr(nullptr) {}
        shared_ptr(T* p) : ptr(p) {}
        shared_ptr(decltype(nullptr)) : ptr(nullptr) {}
        shared_ptr(const shared_ptr& o) : ptr(o.ptr) {}
        shared_ptr& operator=(const shared_ptr& o) { ptr = o.ptr; return *this; }
        shared_ptr& operator=(decltype(nullptr)) { ptr = nullptr; return *this; }
        T* get() const { return ptr; }
        T& operator*() const { return *ptr; }
        T* operator->() const { return ptr; }
        explicit operator bool() const { return ptr != nullptr; }
        bool operator==(decltype(nullptr)) const { return ptr == nullptr; }
        bool operator!=(decltype(nullptr)) const { return ptr != nullptr; }
    };
    template<typename T, typename... Args>
    shared_ptr<T> make_shared(Args&&... args) {
        return shared_ptr<T>(new T(args...));
    }
    // std::function for AVR (simple wrapper around a function pointer / lambda stored as void*)
    template<typename Sig> class function;
    template<typename Ret, typename... Params>
    class function<Ret(Params...)> {
        using FPtr = Ret(*)(void*, Params...);
        void* obj;
        FPtr fptr;
    public:
        function() : obj(nullptr), fptr(nullptr) {}
        function(decltype(nullptr)) : obj(nullptr), fptr(nullptr) {}
        template<typename Callable>
        function(Callable fn) : obj(nullptr), fptr(nullptr) {
            auto* heap = new Callable(fn);
            obj = (void*)heap;
            fptr = [](void* o, Params... a) -> Ret {
                return (*static_cast<Callable*>(o))(a...);
            };
        }
        explicit operator bool() const { return fptr != nullptr; }
        Ret operator()(Params... a) const { return fptr(obj, a...); }
        bool operator==(decltype(nullptr)) const { return fptr == nullptr; }
        bool operator!=(decltype(nullptr)) const { return fptr != nullptr; }
    };
#ifdef round
#undef round
#endif
#ifdef abs
#undef abs
#endif
    inline double floor(double d) { return ::floor(d); }
    inline double ceil(double d) { return ::ceil(d); }
    inline double round(double d) { return ::round(d); }
    inline double abs(double d) { return ::fabs(d); }
    inline double sin(double d) { return ::sin(d); }
    inline double cos(double d) { return ::cos(d); }
    inline double pow(double b, double e) { return ::pow(b, e); }
    inline double sqrt(double d) { return ::sqrt(d); }
}
#else
#include <string>
#include <vector>
#include <sstream>
#include <algorithm>
#include <memory>
#include <initializer_list>
#include <functional>
#include <map>
#include <cmath>
#include <cstdlib>
#endif

class var;
using var_array = std::vector<var>;
using var_object = std::map<std::string, var>;

class var {
public:
    enum Type { TYPE_NULL, TYPE_BOOL, TYPE_INT, TYPE_DOUBLE, TYPE_STRING, TYPE_ARRAY, TYPE_OBJECT, TYPE_FUNCTION };

private:
    Type type = TYPE_NULL;
    bool bool_val = false;
    long long int_val = 0;
    double double_val = 0.0;
    std::string string_val = "";
    std::shared_ptr<var_array> array_val = nullptr;
    std::shared_ptr<var_object> object_val = nullptr;
    std::function<var(const std::vector<var>&)> func_val = nullptr;

public:
    var() : type(TYPE_NULL) {}
    var(bool v) : type(TYPE_BOOL), bool_val(v) {}
    var(int v) : type(TYPE_INT), int_val(v) {}
    var(long v) : type(TYPE_INT), int_val(v) {}
    var(long long v) : type(TYPE_INT), int_val(v) {}
    var(double v) : type(TYPE_DOUBLE), double_val(v) {}
    var(const char* v) : type(TYPE_STRING), string_val(v) {}
    var(const std::string& v) : type(TYPE_STRING), string_val(v) {}
    var(const var_array& v) : type(TYPE_ARRAY), array_val(std::make_shared<var_array>(v)) {}
    var(std::initializer_list<var> list) : type(TYPE_ARRAY), array_val(std::make_shared<var_array>(list)) {}
    var(const var_object& o) : type(TYPE_OBJECT), object_val(std::make_shared<var_object>(o)) {}

#ifdef __AVR__
    template<typename F>
    var(F f) : type(TYPE_FUNCTION), func_val(f) {}
#else
    template<typename F, typename = std::enable_if_t<
        !std::is_same_v<std::decay_t<F>, var> &&
        (std::is_invocable_v<F> ||
         std::is_invocable_v<F, var> ||
         std::is_invocable_v<F, var, var> ||
         std::is_invocable_v<F, const std::vector<var>&>)
    >>
    var(F&& f) : type(TYPE_FUNCTION) {
        func_val = [f = std::forward<F>(f)](const std::vector<var>& args) mutable -> var {
            if constexpr (std::is_invocable_r_v<var, F, const std::vector<var>&>) {
                return f(args);
            } else if constexpr (std::is_invocable_v<F>) {
                if constexpr (std::is_void_v<std::invoke_result_t<F>>) { f(); return var(); }
                else return f();
            } else if constexpr (std::is_invocable_v<F, var>) {
                var a1 = args.size() > 0 ? args[0] : var();
                if constexpr (std::is_void_v<std::invoke_result_t<F, var>>) { f(a1); return var(); }
                else return f(a1);
            } else if constexpr (std::is_invocable_v<F, var, var>) {
                var a1 = args.size() > 0 ? args[0] : var();
                var a2 = args.size() > 1 ? args[1] : var();
                if constexpr (std::is_void_v<std::invoke_result_t<F, var, var>>) { f(a1, a2); return var(); }
                else return f(a1, a2);
            } else {
                return var();
            }
        };
    }
#endif

    Type getType() const { return type; }
    bool isNull() const { return type == TYPE_NULL; }
    bool isString() const { return type == TYPE_STRING; }
    bool isFunction() const { return type == TYPE_FUNCTION; }
    bool isArray() const { return type == TYPE_ARRAY; }

    double toDouble() const {
        if (type == TYPE_DOUBLE) return double_val;
        if (type == TYPE_INT) return (double)int_val;
        if (type == TYPE_BOOL) return bool_val ? 1.0 : 0.0;
        if (type == TYPE_STRING) { char* end; double d = strtod(string_val.c_str(), &end); return d; }
        return 0.0;
    }
    long long toInt() const {
        if (type == TYPE_INT) return int_val;
        if (type == TYPE_DOUBLE) return (long long)double_val;
        if (type == TYPE_BOOL) return bool_val ? 1 : 0;
        if (type == TYPE_STRING) return (long long)atol(string_val.c_str());
        return 0;
    }
    var toHex(const var& width = var(0)) const {
        long long val = toInt();
        char buf[32];
        snprintf(buf, sizeof(buf), "%llX", (unsigned long long)val);
        std::string hexStr(buf);
        int w = width.toInt();
        if (w > 0 && (int)hexStr.length() < w) {
            hexStr = std::string(w - hexStr.length(), '0') + hexStr;
        }
        return var(hexStr);
    }
    var toBin(const var& width = var(8)) const {
        unsigned long long val = (unsigned long long)toInt();
        std::string binStr = "";
        if (val == 0) {
            binStr = "0";
        } else {
            while (val > 0) {
                binStr = (val & 1 ? "1" : "0") + binStr;
                val >>= 1;
            }
        }
        int w = width.toInt();
        if (w > 0 && (int)binStr.length() < w) {
            binStr = std::string(w - binStr.length(), '0') + binStr;
        }
        return var(binStr);
    }
    var toBcd() const {
        long long decimal = toInt();
        long long bcd = 0;
        int shift = 0;
        while (decimal > 0) {
            bcd |= ((decimal % 10) << shift);
            decimal /= 10;
            shift += 4;
        }
        return var(bcd);
    }
    bool toBool() const {
        if (type == TYPE_BOOL) return bool_val;
        if (type == TYPE_INT) return int_val != 0;
        if (type == TYPE_DOUBLE) return double_val != 0.0;
        if (type == TYPE_STRING) return !string_val.empty() && string_val != "false" && string_val != "0";
        if (type == TYPE_ARRAY) return array_val && !array_val->empty();
        if (type == TYPE_OBJECT) return object_val && !object_val->empty();
        return false;
    }
    explicit operator bool() const { return toBool(); }
    operator int() const { return toInt(); }
    operator long() const { return toInt(); }
    operator uint32_t() const { return toInt(); }
    operator uint8_t() const { return toInt(); }
    operator double() const { return toDouble(); }
    operator float() const { return toDouble(); }
    operator String() const { return toString().c_str(); }
    bool as_bool() const { return toBool(); }

    var on(const var& event, const var& callback) {
        if (type == TYPE_OBJECT && object_val && object_val->count("on")) {
            return (*object_val)["on"](std::vector<var>{event, callback});
        }
        return var();
    }
    var get(const var& path, const var& callback) {
        if (type == TYPE_OBJECT && object_val && object_val->count("get")) {
            return (*object_val)["get"](std::vector<var>{path, callback});
        }
        return var();
    }
    var post(const var& path, const var& callback) {
        if (type == TYPE_OBJECT && object_val && object_val->count("post")) {
            return (*object_val)["post"](std::vector<var>{path, callback});
        }
        return var();
    }
    var listen(const var& port) {
        if (type == TYPE_OBJECT && object_val && object_val->count("listen")) {
            return (*object_val)["listen"](std::vector<var>{port});
        }
        return var();
    }
    var text(const var& content) {
        if (type == TYPE_OBJECT && object_val && object_val->count("text")) {
            return (*object_val)["text"](std::vector<var>{content});
        }
        return var();
    }
    var html(const var& content) {
        if (type == TYPE_OBJECT && object_val && object_val->count("html")) {
            return (*object_val)["html"](std::vector<var>{content});
        }
        return var();
    }
    var send(const var& content) {
        if (type == TYPE_OBJECT && object_val && object_val->count("send")) {
            return (*object_val)["send"](std::vector<var>{content});
        }
        return var();
    }
    var json(const var& content) {
        if (type == TYPE_OBJECT && object_val && object_val->count("json")) {
            return (*object_val)["json"](std::vector<var>{content});
        }
        return var();
    }

    std::string toString() const {
        if (type == TYPE_STRING) return string_val;
        if (type == TYPE_INT) return std::to_string(int_val);
        if (type == TYPE_DOUBLE) {
            std::string s = std::to_string(double_val);
            s.erase(s.find_last_not_of('0') + 1, std::string::npos);
            if (!s.empty() && s.back() == '.') s.pop_back();
            return s;
        }
        if (type == TYPE_BOOL) return bool_val ? "true" : "false";
        if (type == TYPE_ARRAY) {
            std::string res = "[";
            if (array_val) {
                for (size_t i = 0; i < array_val->size(); ++i) {
                    res += (*array_val)[i].toString();
                    if (i + 1 < array_val->size()) res += ", ";
                }
            }
            return res + "]";
        }
        if (type == TYPE_FUNCTION) return "[Function]";
        return "null";
    }

    var operator()(const std::vector<var>& args = {}) const {
        if (type == TYPE_FUNCTION && func_val) return func_val(args);
        return var();
    }
    var operator()() const { return (*this)(std::vector<var>{}); }
    var operator()(const var& a1) const { return (*this)(std::vector<var>{a1}); }
    var operator()(const var& a1, const var& a2) const { return (*this)(std::vector<var>{a1, a2}); }

    void push(const var& v) {
        if (type != TYPE_ARRAY) { type = TYPE_ARRAY; array_val = std::make_shared<var_array>(); }
        array_val->push_back(v);
    }

    bool isObject() const { return type == TYPE_OBJECT; }
    bool has(const std::string& key) const { return type == TYPE_OBJECT && object_val && object_val->count(key) > 0; }

    var length() const {
        if (type == TYPE_ARRAY && array_val) return var((long long)array_val->size());
        if (type == TYPE_STRING) return var((long long)string_val.length());
        return var(0);
    }
    var size() const { return length(); }

    var operator+(const var& o) const {
        if (type == TYPE_STRING || o.type == TYPE_STRING) return var(this->toString() + o.toString());
        if (type == TYPE_DOUBLE || o.type == TYPE_DOUBLE) return var(this->toDouble() + o.toDouble());
        return var(this->toInt() + o.toInt());
    }
    var operator-(const var& o) const {
        if (type == TYPE_DOUBLE || o.type == TYPE_DOUBLE) return var(this->toDouble() - o.toDouble());
        return var(this->toInt() - o.toInt());
    }
    var operator*(const var& o) const {
        if (type == TYPE_DOUBLE || o.type == TYPE_DOUBLE) return var(this->toDouble() * o.toDouble());
        return var(this->toInt() * o.toInt());
    }
    var operator/(const var& o) const {
        double denom = o.toDouble();
        if (denom == 0.0) return var(0.0);
        if (type == TYPE_DOUBLE || o.type == TYPE_DOUBLE) return var(this->toDouble() / denom);
        return var(this->toInt() / o.toInt());
    }
    var operator%(const var& o) const {
        long long denom = o.toInt();
        if (denom == 0) return var(0);
        return var(this->toInt() % denom);
    }
    var& operator+=(const var& o) { *this = *this + o; return *this; }
    var& operator-=(const var& o) { *this = *this - o; return *this; }
    var& operator*=(const var& o) { *this = *this * o; return *this; }
    var& operator/=(const var& o) { *this = *this / o; return *this; }
    var& operator%=(const var& o) { *this = *this % o; return *this; }
    var& operator++() { if (type == TYPE_DOUBLE) double_val++; else { type = TYPE_INT; int_val++; } return *this; }
    var operator++(int) { var t = *this; ++(*this); return t; }
    var& operator--() { if (type == TYPE_DOUBLE) double_val--; else { type = TYPE_INT; int_val--; } return *this; }
    var operator--(int) { var t = *this; --(*this); return t; }
    var operator!() const { return var(!toBool()); }
    var operator<<(const var& o) const { return var(this->toInt() << o.toInt()); }
    var operator>>(const var& o) const { return var(this->toInt() >> o.toInt()); }
    var operator&(const var& o) const { return var(this->toInt() & o.toInt()); }
    var operator|(const var& o) const { return var(this->toInt() | o.toInt()); }
    var operator^(const var& o) const { return var(this->toInt() ^ o.toInt()); }

    var operator==(const var& o) const {
        if (type == TYPE_STRING && o.type == TYPE_STRING) return var(string_val == o.string_val);
        if (type == TYPE_DOUBLE || o.type == TYPE_DOUBLE) return var(this->toDouble() == o.toDouble());
        return var(this->toInt() == o.toInt());
    }
    var operator!=(const var& o) const { return var(!((*this == o).toBool())); }
    var operator<(const var& o) const {
        if (type == TYPE_STRING && o.type == TYPE_STRING) return var(string_val < o.string_val);
        return var(this->toDouble() < o.toDouble());
    }
    var operator>(const var& o) const {
        if (type == TYPE_STRING && o.type == TYPE_STRING) return var(string_val > o.string_val);
        return var(this->toDouble() > o.toDouble());
    }
    var operator<=(const var& o) const { return var(!((*this > o).toBool())); }
    var operator>=(const var& o) const { return var(!((*this < o).toBool())); }

    var& operator[](const std::string& key) {
        if (type != TYPE_OBJECT) {
            type = TYPE_OBJECT;
            object_val = std::make_shared<var_object>();
        }
        return (*object_val)[key];
    }
    const var& operator[](const std::string& key) const {
        static const var empty;
        if (type == TYPE_OBJECT && object_val) {
#ifdef __AVR__
            if (object_val->count(key)) return (*object_val)[key];
#else
            auto found = object_val->find(key);
            if (found != object_val->end()) return found->second;
#endif
        }
        return empty;
    }
    var& operator[](const char* key) {
        return (*this)[std::string(key)];
    }
    const var& operator[](const char* key) const {
        return (*this)[std::string(key)];
    }
    var& operator[](int index) {
        if (type == TYPE_ARRAY && array_val && index >= 0 && index < (int)array_val->size()) {
            return (*array_val)[index];
        }
        return (*this)[std::to_string(index)];
    }
    const var& operator[](int index) const {
        static const var empty;
        if (type == TYPE_ARRAY && array_val && index >= 0 && index < (int)array_val->size()) {
            return (*array_val)[index];
        }
        return empty;
    }
    var& operator[](const var& key) {
        if (key.type == TYPE_INT || key.type == TYPE_DOUBLE) return (*this)[key.toInt()];
        return (*this)[key.toString()];
    }
    const var& operator[](const var& key) const {
        if (key.type == TYPE_INT || key.type == TYPE_DOUBLE) return (*this)[key.toInt()];
        return (*this)[key.toString()];
    }
};

inline var operator+(const char* lhs, const var& rhs) { return var(lhs) + rhs; }
inline var operator+(const std::string& lhs, const var& rhs) { return var(lhs) + rhs; }
inline var operator+(double lhs, const var& rhs) { return var(lhs) + rhs; }
inline var operator+(int lhs, const var& rhs) { return var(lhs) + rhs; }

inline void print() { Serial.println(); }

template<typename T, typename... Args>
inline void print(T first, Args... args) {
    Serial.print(var(first).toString().c_str());
    if constexpr (sizeof...(args) > 0) {
        Serial.print(" ");
        print(args...);
    } else {
        Serial.println();
    }
}

inline var input(const std::string& prompt = "") {
    if (!prompt.empty()) Serial.print(prompt.c_str());
    while (!Serial.available()) { delay(10); }
    std::string s = Serial.readStringUntil('\n').c_str();
    return var(s);
}

// Real GPIO pin, matching the Pin API used by dolphin_runtime.hpp's PC
// simulation (pin(num, mode), .write(), .read(), .on("change", cb)).
// NOTE: HIGH/LOW/INPUT/OUTPUT are intentionally NOT redefined here -- they
// come from Arduino.h's own macros. Codegen already rewrites the dolphin
// keywords `INPUT`/`OUTPUT` to `PIN_INPUT`/`PIN_OUTPUT` (this file's enum
// below), while `HIGH`/`LOW` pass through untouched and resolve to
// Arduino.h's macros at hardware-compile time.
enum PinMode { PIN_INPUT, PIN_OUTPUT };
#define DOLPHIN_INPUT   PIN_INPUT
#define DOLPHIN_OUTPUT  PIN_OUTPUT
#define DOLPHIN_HIGH    HIGH
#define DOLPHIN_LOW     LOW

class Pin;

namespace DolphinRuntime {
    std::vector<Pin*>& pollRegistry();
}

inline bool dolphin_is_true(const var& v) { return v.toBool(); }

class Pin {
private:
    int pin_num;
    PinMode mode;
    bool state = false;
    std::vector<var> listeners;

public:

    Pin() : pin_num(-1), mode(PIN_INPUT) {}
    Pin(int p, PinMode m) : pin_num(p), mode(m) {
        pinMode(pin_num, m == PIN_OUTPUT ? OUTPUT : INPUT);
        if (m == PIN_INPUT) state = digitalRead(pin_num) == HIGH;
    }
    Pin(const var& p, PinMode m) : pin_num(p.toInt()), mode(m) {
        pinMode(pin_num, m == PIN_OUTPUT ? OUTPUT : INPUT);
        if (m == PIN_INPUT) state = digitalRead(pin_num) == HIGH;
    }
    Pin(const std::vector<var>& args) {
        pin_num = args.size() > 0 ? args[0].toInt() : -1;
        mode = args.size() > 1 ? (PinMode)args[1].toInt() : PIN_INPUT;
        pinMode(pin_num, mode == PIN_OUTPUT ? OUTPUT : INPUT);
        if (mode == PIN_INPUT) state = digitalRead(pin_num) == HIGH;
    }

    void write(const var& s) {
        state = s.toBool();
        if (mode == PIN_OUTPUT) digitalWrite(pin_num, state ? HIGH : LOW);
        trigger(var(state));
    }

    var read() const {
        if (mode == PIN_INPUT) return var(digitalRead(pin_num) == HIGH);
        return var(state);
    }

    void on(const var& event, const var& callback) {
        if (event.toString() == "change") {
            listeners.push_back(callback);
            DolphinRuntime::pollRegistry().push_back(this);
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
        return var();
    }

    // Called every loop() iteration by DolphinRuntime::pollPins() so
    // input-pin `.on("change", ...)` listeners fire on real hardware,
    // since there is no PC-style manual event trigger on a board.
    void poll() {
        if (mode != PIN_INPUT) return;
        bool current = digitalRead(pin_num) == HIGH;
        if (current != state) {
            state = current;
            trigger(var(state));
        }
    }

private:
    void trigger(var value) {
        std::vector<var> args;
        args.push_back(value);
        for (auto& cb : listeners) cb(args);
    }
};

using pin = Pin;

namespace DolphinRuntime {
    inline std::vector<Pin*>& pollRegistry() {
        static std::vector<Pin*> registry;
        return registry;
    }
    inline void pollPins() {
        for (Pin* p : pollRegistry()) p->poll();
#if defined(ESP8266) || defined(ESP32)
        if (global_esp_web_server) {
            global_esp_web_server->handleClient();
        }
#endif
    }
}

#ifdef round
#undef round
#endif
#ifdef abs
#undef abs
#endif

struct MathClass {
    var random() { return var((double)rand() / RAND_MAX); }
    var floor(const var& v) { return var(::floor(v.toDouble())); }
    var ceil(const var& v) { return var(::ceil(v.toDouble())); }
    var round(const var& v) { return var(::round(v.toDouble())); }
    var abs(const var& v) { return var(::fabs(v.toDouble())); }
    var sin(const var& v) { return var(::sin(v.toDouble())); }
    var cos(const var& v) { return var(::cos(v.toDouble())); }
    var pow(const var& base, const var& exp) { return var(::pow(base.toDouble(), exp.toDouble())); }
    var sqrt(const var& v) { return var(::sqrt(v.toDouble())); }
    var PI = var(3.14159265358979323846);
} Math;

struct RandomClass {
    var int_range(const var& min, const var& max) {
        long long low = min.toInt();
        long long high = max.toInt();
        if (high <= low) return var(low);
        return var(low + (rand() % (high - low + 1)));
    }
    var operator[](const std::string& key) {
        if (key == "int") {
            return var([this](const std::vector<var>& args) -> var {
                if (args.size() > 1) return this->int_range(args[0], args[1]);
                if (args.size() > 0) return this->int_range(0, args[0]);
                return var(rand());
            });
        }
        return var();
    }
} DolphinRandom;

inline var random(const var& min, const var& max) {
    long long low = min.toInt();
    long long high = max.toInt();
    if (high <= low) return var(low);
    return var(low + (rand() % (high - low + 1)));
}

struct JSONClass {
    std::string stringify(const var& v) { return v.toString(); }
} JSON;

inline var sleep(const std::vector<var>& args) {
    if (args.size() > 0) {
        unsigned long start = millis();
        unsigned long dur = args[0].toInt();
        while (millis() - start < dur) {
#if defined(ESP8266) || defined(ESP32)
            if (global_esp_web_server) {
                global_esp_web_server->handleClient();
            }
#endif
            delay(1);
        }
    }
    return var();
}
inline var sleep(const var& ms) {
    unsigned long start = millis();
    unsigned long dur = ms.toInt();
    while (millis() - start < dur) {
#if defined(ESP8266) || defined(ESP32)
        if (global_esp_web_server) {
            global_esp_web_server->handleClient();
        }
#endif
        delay(1);
    }
    return var();
}

#if defined(ESP8266) || defined(ESP32)
struct WifiClass {
    var connect(const var& ssid, const var& password) {
        ::WiFi.begin(ssid.toString().c_str(), password.toString().c_str());
        while (::WiFi.status() != WL_CONNECTED) {
            delay(500);
            Serial.print(".");
        }
        Serial.println("\nWiFi connected");
        return var(true);
    }
    var softAP(const var& ssid, const var& password) {
        ::WiFi.mode(WIFI_AP);
        ::WiFi.softAP(ssid.toString().c_str(), password.toString().c_str());
        Serial.print("Access Point started. IP: ");
        Serial.println(::WiFi.softAPIP());
        return var(::WiFi.softAPIP().toString().c_str());
    }
    var ip() {
        return var(::WiFi.localIP().toString().c_str());
    }
    var status() {
        return var((long long)::WiFi.status());
    }
    var operator[](const std::string& key) {
        if (key == "softAP") {
            return var([this](const std::vector<var>& args) -> var {
                if (args.size() > 1) return this->softAP(args[0], args[1]);
                return var();
            });
        }
        if (key == "connect") {
            return var([this](const std::vector<var>& args) -> var {
                if (args.size() > 1) return this->connect(args[0], args[1]);
                return var();
            });
        }
        if (key == "ip") {
            return var([this](const std::vector<var>& args) -> var {
                return this->ip();
            });
        }
        if (key == "status") {
            return var([this](const std::vector<var>& args) -> var {
                return this->status();
            });
        }
        return var();
    }
} DolphinWifi;
#endif

#if defined(ESP8266) || defined(ESP32)
struct HTTPRouteHandler {
    std::string path;
    var callback;
};

static std::vector<HTTPRouteHandler> global_get_routes;
static std::vector<HTTPRouteHandler> global_post_routes;

class HTTPServerClass {
public:
    void get(const var& path, const var& callback) {
        global_get_routes.push_back({path.toString(), callback});
    }
    void post(const var& path, const var& callback) {
        global_post_routes.push_back({path.toString(), callback});
    }
    void listen(const var& port) {
        int port_num = port.toInt();
        static WebServerClass server(port_num);
        global_esp_web_server = &server;

        for (const auto& r : global_get_routes) {
            std::string path = r.path;
            var cb = r.callback;
            server.on(path.c_str(), HTTP_GET, [cb]() {
                var req(var::TYPE_OBJECT);
                var params(var::TYPE_OBJECT);
                if (global_esp_web_server) {
                    for (int i = 0; i < global_esp_web_server->args(); i++) {
                        params[global_esp_web_server->argName(i).c_str()] = var(global_esp_web_server->arg(i).c_str());
                    }
                }
                req["params"] = params;

                var res(var::TYPE_OBJECT);
                res["text"] = var([](const std::vector<var>& args) -> var {
                    if (args.size() > 0 && global_esp_web_server) {
                        global_esp_web_server->send(200, "text/plain", args[0].toString().c_str());
                    }
                    return var();
                });
                res["html"] = var([](const std::vector<var>& args) -> var {
                    if (args.size() > 0 && global_esp_web_server) {
                        global_esp_web_server->send(200, "text/html", args[0].toString().c_str());
                    }
                    return var();
                });
                res["send"] = var([](const std::vector<var>& args) -> var {
                    if (args.size() > 0 && global_esp_web_server) {
                        std::string content = args[0].toString();
                        std::string type = "text/plain";
                        if (content.find("<html") != std::string::npos || content.find("<HTML") != std::string::npos || content.find("<!DOCTYPE") != std::string::npos) {
                            type = "text/html";
                        }
                        global_esp_web_server->send(200, type.c_str(), content.c_str());
                    }
                    return var();
                });
                res["json"] = var([](const std::vector<var>& args) -> var {
                    if (args.size() > 0 && global_esp_web_server) {
                        global_esp_web_server->send(200, "application/json", args[0].toString().c_str());
                    }
                    return var();
                });

                cb(std::vector<var>{req, res});
            });
        }

        for (const auto& r : global_post_routes) {
            std::string path = r.path;
            var cb = r.callback;
            server.on(path.c_str(), HTTP_POST, [cb]() {
                var req(var::TYPE_OBJECT);
                var params(var::TYPE_OBJECT);
                if (global_esp_web_server) {
                    for (int i = 0; i < global_esp_web_server->args(); i++) {
                        params[global_esp_web_server->argName(i).c_str()] = var(global_esp_web_server->arg(i).c_str());
                    }
                }
                req["params"] = params;

                var res(var::TYPE_OBJECT);
                res["text"] = var([](const std::vector<var>& args) -> var {
                    if (args.size() > 0 && global_esp_web_server) {
                        global_esp_web_server->send(200, "text/plain", args[0].toString().c_str());
                    }
                    return var();
                });
                res["html"] = var([](const std::vector<var>& args) -> var {
                    if (args.size() > 0 && global_esp_web_server) {
                        global_esp_web_server->send(200, "text/html", args[0].toString().c_str());
                    }
                    return var();
                });
                res["send"] = var([](const std::vector<var>& args) -> var {
                    if (args.size() > 0 && global_esp_web_server) {
                        std::string content = args[0].toString();
                        std::string type = "text/plain";
                        if (content.find("<html") != std::string::npos || content.find("<HTML") != std::string::npos || content.find("<!DOCTYPE") != std::string::npos) {
                            type = "text/html";
                        }
                        global_esp_web_server->send(200, type.c_str(), content.c_str());
                    }
                    return var();
                });
                res["json"] = var([](const std::vector<var>& args) -> var {
                    if (args.size() > 0 && global_esp_web_server) {
                        global_esp_web_server->send(200, "application/json", args[0].toString().c_str());
                    }
                    return var();
                });

                cb(std::vector<var>{req, res});
            });
        }

        server.onNotFound([]() {
            if (global_esp_web_server) {
                global_esp_web_server->send(404, "text/plain", "Not Found");
            }
        });

        server.begin();
        Serial.println("HTTP Server started");
    }
};

struct HTTPNamespace {
    var Server() {
        auto server_ptr = std::make_shared<HTTPServerClass>();
        var s(var::TYPE_OBJECT);
        s["get"] = var([server_ptr](const std::vector<var>& args) -> var {
            if (args.size() > 1) server_ptr->get(args[0], args[1]);
            return var();
        });
        s["post"] = var([server_ptr](const std::vector<var>& args) -> var {
            if (args.size() > 1) server_ptr->post(args[0], args[1]);
            return var();
        });
        s["listen"] = var([server_ptr](const std::vector<var>& args) -> var {
            if (args.size() > 0) server_ptr->listen(args[0]);
            return var();
        });
        return s;
    }
} HTTP, DolphinHttp;

struct TemplateNamespace {
    var _getValue(const var& data, const std::string& path) {
        if (path.empty()) return var("");
        std::stringstream ss(path);
        std::string part;
        var current = data;
        while (std::getline(ss, part, '.')) {
            if (current.isObject() && current.has(part)) {
                current = current[part];
            } else {
                return var("");
            }
        }
        return current;
    }

    var render(const var& templateStr, const var& data) {
        std::string tpl = templateStr.toString();
        std::string result = "";
        size_t pos = 0;
        
        while (pos < tpl.length()) {
            size_t start = tpl.find("{{", pos);
            if (start == std::string::npos) {
                result += tpl.substr(pos);
                break;
            }
            
            result += tpl.substr(pos, start - pos);
            size_t end = tpl.find("}}", start);
            if (end == std::string::npos) {
                result += tpl.substr(start);
                break;
            }
            
            std::string tag = tpl.substr(start + 2, end - start - 2);
            tag.erase(tag.begin(), std::find_if(tag.begin(), tag.end(), [](unsigned char ch) {
                return !std::isspace(ch);
            }));
            tag.erase(std::find_if(tag.rbegin(), tag.rend(), [](unsigned char ch) {
                return !std::isspace(ch);
            }).base(), tag.end());
            
            if (tag.rfind("loop ", 0) == 0) {
                std::string loop_content = tag.substr(5);
                size_t as_pos = loop_content.find(" as ");
                if (as_pos == std::string::npos) {
                    pos = end + 2;
                    continue;
                }
                std::string container_name = loop_content.substr(0, as_pos);
                std::string item_name = loop_content.substr(as_pos + 4);
                
                size_t loop_end = tpl.find("{{endloop}}", end + 2);
                if (loop_end == std::string::npos) {
                    pos = end + 2;
                    continue;
                }
                
                std::string body = tpl.substr(end + 2, loop_end - end - 2);
                var container = _getValue(data, container_name);
                
                if (container.isArray()) {
                    for (int i = 0; i < container.size().toInt(); ++i) {
                        var local_data = data;
                        local_data[item_name] = container[i];
                        result += render(body, local_data).toString();
                    }
                }
                pos = loop_end + 11;
            }
            else if (tag.rfind("if ", 0) == 0) {
                std::string cond_name = tag.substr(3);
                size_t if_end = tpl.find("{{endif}}", end + 2);
                if (if_end == std::string::npos) {
                    pos = end + 2;
                    continue;
                }
                
                std::string body = tpl.substr(end + 2, if_end - end - 2);
                var cond = _getValue(data, cond_name);
                
                if (cond.toBool()) {
                    result += render(body, data).toString();
                }
                pos = if_end + 9;
            }
            else {
                var val = _getValue(data, tag);
                if (val.isNull()) {
                    if (data.isObject() && data.has(tag)) {
                        val = data[tag];
                    }
                }
                result += val.toString();
                pos = end + 2;
            }
        }
        return result;
    }
} Template;
#endif

template<typename... Args>
inline void dolphin_print(Args... args) {
    print(args...);
}

template<typename... Args>
inline void dolphin_println(Args... args) {
    print(args...);
}

// ─── Real Hardware Power-Saving & Deep Sleep Implementation ──────────────────
struct SleepNamespace {
    var light(const var& ms = var(1000)) {
        long long duration = ms.toInt();
#if defined(ESP32)
        esp_sleep_enable_timer_wakeup(duration * 1000ULL);
        esp_light_sleep_start();
#elif defined(ESP8266)
        delay(duration);
#else
        delay(duration);
#endif
        return var(true);
    }

    var deep(const var& ms = var(1000)) {
        long long duration = ms.toInt();
#if defined(ESP32)
        esp_sleep_enable_timer_wakeup(duration * 1000ULL);
        esp_deep_sleep_start();
#elif defined(ESP8266)
        ESP.deepSleep(duration * 1000ULL);
#else
        delay(duration);
#endif
        return var(true);
    }

    var until(const var& pinTarget, const var& condition = var("LOW")) {
#if defined(ESP32)
        int pinNum = pinTarget.toInt();
        esp_sleep_enable_ext0_wakeup((gpio_num_t)pinNum, condition.toString() == "HIGH" ? 1 : 0);
        esp_deep_sleep_start();
#else
        delay(100);
#endif
        return var(true);
    }

    var hibernate() {
#if defined(ESP32)
        esp_deep_sleep_start();
#else
        delay(100);
#endif
        return var(true);
    }

    var operator()(const var& ms) {
        delay(ms.toInt());
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
                delay(delayMs);
            }
        }
    }

    return fallback;
}

inline var dolphin_sync(const var& callable, const var& config = var()) {
    return sync(callable, config);
}
