#pragma once
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <sstream>
#include <algorithm>
#include <random>
#include <memory>
#include <initializer_list>
#include <functional>
#include <map>
#include <cmath>
#include <cstdlib>
#include <ctime>
#include <type_traits>
#include <thread>
#include <chrono>
#include <queue>
#include <mutex>
#include <atomic>
#include <condition_variable>

#ifdef ESP32
#include <WiFi.h>
#include <BluetoothSerial.h>
#include "driver/twai.h"
#endif

#ifdef _WIN32
    #define WIN32_LEAN_AND_MEAN
    #include <winsock2.h>
    #include <ws2tcpip.h>
#else
    #include <sys/socket.h>
    #include <netinet/in.h>
    #include <unistd.h>
    #include <arpa/inet.h>
    #include <fcntl.h>
    using SOCKET = int;
    #define INVALID_SOCKET -1
    #define SOCKET_ERROR -1
    #define closesocket close
#endif

class HTTPServerClass;
class TCPServerClass;
class TCPSocketClass;

class var;
inline void print();
template<typename T, typename... Args>
inline void print(T first, Args... args);
struct PromiseClass {
    std::mutex mtx;
    std::condition_variable cv;
    bool resolved = false;
    std::shared_ptr<var> value_ptr = nullptr;
    
    void resolve(const var& val);
    var await_resolve();
};

struct MatrixClass {
    int rows = 0;
    int cols = 0;
    std::vector<double> data;

    MatrixClass() = default;
    MatrixClass(int r, int c) : rows(r), cols(c), data(r * c, 0.0) {}
    MatrixClass(int r, int c, const std::vector<double>& d) : rows(r), cols(c), data(d) {}

    double get(int r, int c) const {
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
            return data[r * cols + c];
        }
        return 0.0;
    }

    void set(int r, int c, double val) {
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
            data[r * cols + c] = val;
        }
    }
};

using var_array = std::vector<var>;
using var_object = std::map<std::string, var>;

class var {
public:
    enum Type {
        TYPE_NULL,
        TYPE_BOOL,
        TYPE_INT,
        TYPE_DOUBLE,
        TYPE_STRING,
        TYPE_ARRAY,
        TYPE_OBJECT,
        TYPE_FUNCTION,
        TYPE_PROMISE,
        TYPE_MATRIX
    };

private:
    Type type = TYPE_NULL;
    bool bool_val = false;
    long long int_val = 0;
    double double_val = 0.0;
    std::string string_val = "";
    std::shared_ptr<var_array> array_val = nullptr;
    std::shared_ptr<var_object> object_val = nullptr;
    std::function<var(const std::vector<var>&)> func_val = nullptr;
    std::shared_ptr<PromiseClass> promise_val = nullptr;
    std::shared_ptr<MatrixClass> matrix_val = nullptr;

public:
    std::shared_ptr<std::map<std::string, std::vector<var>>> event_listeners = nullptr;
    std::shared_ptr<HTTPServerClass> http_server = nullptr;
    std::shared_ptr<TCPServerClass> tcp_server = nullptr;
    std::shared_ptr<TCPSocketClass> tcp_socket = nullptr;
    int http_status = 200;

    var() : type(TYPE_NULL) {}
    var(const std::shared_ptr<PromiseClass>& p) : type(TYPE_PROMISE), promise_val(p) {}
    var(const std::shared_ptr<MatrixClass>& m) : type(TYPE_MATRIX), matrix_val(m) {}
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
    var(std::initializer_list<std::pair<const std::string, var>> list) : type(TYPE_OBJECT), object_val(std::make_shared<var_object>(list.begin(), list.end())) {}

    template<typename F, typename = std::enable_if_t<
        !std::is_same_v<std::decay_t<F>, var> && 
        (std::is_invocable_v<F> || 
         std::is_invocable_v<F, var> || 
         std::is_invocable_v<F, var, var> || 
         std::is_invocable_v<F, var, var, var> ||
         std::is_invocable_v<F, const std::vector<var>&>)
    >>
    var(F&& f) : type(TYPE_FUNCTION) {
        func_val = [f = std::forward<F>(f)](const std::vector<var>& args) mutable -> var {
            if constexpr (std::is_invocable_v<F, var, var, var>) {
                var a1 = args.size() > 0 ? args[0] : var();
                var a2 = args.size() > 1 ? args[1] : var();
                var a3 = args.size() > 2 ? args[2] : var();
                if constexpr (std::is_void_v<std::invoke_result_t<F, var, var, var>>) {
                    f(a1, a2, a3);
                    return var();
                } else {
                    return f(a1, a2, a3);
                }
            } else if constexpr (std::is_invocable_v<F, var, var>) {
                var a1 = args.size() > 0 ? args[0] : var();
                var a2 = args.size() > 1 ? args[1] : var();
                if constexpr (std::is_void_v<std::invoke_result_t<F, var, var>>) {
                    f(a1, a2);
                    return var();
                } else {
                    return f(a1, a2);
                }
            } else if constexpr (std::is_invocable_v<F, var>) {
                var a1 = args.size() > 0 ? args[0] : var();
                if constexpr (std::is_void_v<std::invoke_result_t<F, var>>) {
                    f(a1);
                    return var();
                } else {
                    return f(a1);
                }
            } else if constexpr (std::is_invocable_v<F>) {
                if constexpr (std::is_void_v<std::invoke_result_t<F>>) {
                    f();
                    return var();
                } else {
                    return f();
                }
            } else if constexpr (std::is_invocable_r_v<var, F, const std::vector<var>&>) {
                return f(args);
            } else {
                return var();
            }
        };
    }

    Type getType() const { return type; }

    bool isNull() const { return type == TYPE_NULL; }
    bool isBool() const { return type == TYPE_BOOL; }
    bool isInt() const { return type == TYPE_INT; }
    bool isDouble() const { return type == TYPE_DOUBLE; }
    bool isString() const { return type == TYPE_STRING; }
    bool isArray() const { return type == TYPE_ARRAY; }
    bool isObject() const { return type == TYPE_OBJECT; }
    bool isFunction() const { return type == TYPE_FUNCTION; }
    bool isPromise() const { return type == TYPE_PROMISE; }
    bool isMatrix() const { return type == TYPE_MATRIX; }

    double toDouble() const {
        if (type == TYPE_DOUBLE) return double_val;
        if (type == TYPE_INT) return (double)int_val;
        if (type == TYPE_BOOL) return bool_val ? 1.0 : 0.0;
        if (type == TYPE_STRING) {
            try { return std::stod(string_val); } catch(...) { return 0.0; }
        }
        return 0.0;
    }

    long long toInt() const {
        if (type == TYPE_INT) return int_val;
        if (type == TYPE_DOUBLE) return (long long)double_val;
        if (type == TYPE_BOOL) return bool_val ? 1 : 0;
        if (type == TYPE_STRING) {
            try { return std::stoll(string_val); } catch(...) { return 0; }
        }
        return 0;
    }

    // ── Direct Hardware / Digital Display Conversions ────────────────────────
    var toHex(const var& width = var(0)) const {
        long long val = toInt();
        std::stringstream ss;
        ss << std::hex << std::uppercase << val;
        std::string hexStr = ss.str();
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

    explicit operator bool() const {
        return toBool();
    }

    std::string toString() const {
        if (type == TYPE_STRING) return string_val;
        if (type == TYPE_INT) return std::to_string(int_val);
        if (type == TYPE_DOUBLE) {
            std::string s = std::to_string(double_val);
            s.erase(s.find_last_not_of('0') + 1, std::string::npos);
            if (s.back() == '.') s.pop_back();
            return s;
        }
        if (type == TYPE_BOOL) return bool_val ? "true" : "false";
        if (type == TYPE_ARRAY) {
            std::string res = "[";
            if (array_val) {
                for (size_t i = 0; i < array_val->size(); ++i) {
                    const var& val = (*array_val)[i];
                    if (val.isString()) {
                        res += "\"" + val.toString() + "\"";
                    } else {
                        res += val.toString();
                    }
                    if (i + 1 < array_val->size()) res += ", ";
                }
            }
            res += "]";
            return res;
        }
        if (type == TYPE_OBJECT) {
            if (object_val && object_val->count("toString")) {
                var ts = (*object_val)["toString"];
                if (ts.isFunction()) {
                    auto& non_const_ts = const_cast<var&>(ts);
                    return non_const_ts(std::vector<var>{}).toString();
                }
            }
            std::string res = "{";
            if (object_val) {
                size_t i = 0;
                for (auto const& [key, val] : *object_val) {
                    res += "\"" + key + "\": ";
                    if (val.isString()) {
                        res += "\"" + val.toString() + "\"";
                    } else {
                        res += val.toString();
                    }
                    if (++i < object_val->size()) res += ", ";
                }
            }
            res += "}";
            return res;
        }
        if (type == TYPE_MATRIX && matrix_val) {
            std::string res = "Matrix(" + std::to_string(matrix_val->rows) + "x" + std::to_string(matrix_val->cols) + ") [\n";
            for (int i = 0; i < matrix_val->rows; ++i) {
                res += "  [";
                for (int j = 0; j < matrix_val->cols; ++j) {
                    res += std::to_string(matrix_val->get(i, j));
                    if (j + 1 < matrix_val->cols) res += ", ";
                }
                res += "]";
                if (i + 1 < matrix_val->rows) res += ",\n";
            }
            res += "\n]";
            return res;
        }
        if (type == TYPE_FUNCTION) {
            return "[Function]";
        }
        return "null";
    }

    operator std::string() const {
        return toString();
    }

    var operator()(const std::vector<var>& args) const {
        if (type == TYPE_FUNCTION && func_val) {
            return func_val(args);
        }
        if (type == TYPE_OBJECT && object_val) {
            if (object_val->count("_invoke")) {
                return (*object_val)["_invoke"](args);
            }
        }
        if (type == TYPE_ARRAY && array_val) {
            if (args.empty()) return *this;

            // 1. Slice: arr(start, end)
            if (args.size() == 2 && (args[0].type == TYPE_INT || args[0].type == TYPE_DOUBLE) &&
                                    (args[1].type == TYPE_INT || args[1].type == TYPE_DOUBLE)) {
                var res;
                long long st = args[0].toInt();
                long long en = args[1].toInt();
                long long sz = (long long)array_val->size();
                if (st < 0) st = 0;
                if (en > sz) en = sz;
                for (long long i = st; i < en; ++i) res.push((*array_val)[i]);
                return res;
            }

            // 2. Direct single function callback: arr(fn) -> map
            if (args.size() == 1 && args[0].isFunction()) {
                return this->map(args[0]);
            }

            // 3. Dual argument patterns: arr("+", val), arr(val, "+"), arr("?", fn), arr("&", delim), etc.
            if (args.size() == 2) {
                std::string s0 = args[0].isString() ? args[0].toString() : "";
                std::string s1 = args[1].isString() ? args[1].toString() : "";
                if (!s0.empty() && s0[0] == '+') {
                    var res = *this;
                    long long idx = -1;
                    if (s0.length() > 1) {
                        try { idx = std::stoll(s0.substr(1)); } catch (...) { idx = -1; }
                    }
                    if (idx >= 0 && (size_t)idx <= res.array_val->size()) {
                        res.array_val->insert(res.array_val->begin() + idx, args[1]);
                    } else {
                        if (args[1].isArray() && args[1].array_val) {
                            for (auto& item : *args[1].array_val) res.array_val->push_back(item);
                        } else {
                            res.array_val->push_back(args[1]);
                        }
                    }
                    return res;
                }
                if (!s1.empty() && s1[0] == '+') {
                    var res = *this;
                    if (args[0].isArray() && args[0].array_val) {
                        for (auto& item : *args[0].array_val) res.array_val->push_back(item);
                    } else {
                        res.array_val->push_back(args[0]);
                    }
                    return res;
                }
                if (s0 == "?" && args[1].isFunction()) {
                    return this->filter(args[1]);
                }
                if (s0 == ">" && args[1].isFunction()) {
                    return this->map(args[1]);
                }
                if (s0 == "&") {
                    return this->join(args[1]);
                }
                if (s0 == "-") {
                    var res = *this;
                    long long idx = args[1].toInt();
                    if (idx >= 0 && (size_t)idx < res.array_val->size()) {
                        res.array_val->erase(res.array_val->begin() + idx);
                    }
                    return res;
                }
                if (s0 == "*") {
                    double f = args[1].toDouble();
                    return this->map([f](const var& x) { return x * var(f); });
                }
                if (s0 == "/") {
                    double f = args[1].toDouble();
                    return this->map([f](const var& x) { return x / var(f); });
                }
            }

            // 4. Sequential pipeline chaining: arr("?>20", "*2", "^", "&, ")
            var current = *this;
            for (size_t a_idx = 0; a_idx < args.size(); ++a_idx) {
                const var& arg = args[a_idx];
                if (arg.isFunction()) {
                    current = current.map(arg);
                    continue;
                }
                if (!arg.isString()) continue;
                std::string s = arg.toString();
                if (s.empty()) continue;

                char sign = s[0];

                // Unary "+" -> Sum total of all elements
                if (s == "+") {
                    return current.reduce([](const var& acc, const var& x) { return acc + x; }, var(0));
                }

                // "-" -> Pop / Remove / Shift
                if (sign == '-') {
                    if (s == "-" || s == "-pop") {
                        if (current.array_val && !current.array_val->empty()) current.array_val->pop_back();
                    } else if (s == "-0" || s == "-shift") {
                        if (current.array_val && !current.array_val->empty()) current.array_val->erase(current.array_val->begin());
                    } else {
                        try {
                            long long idx = std::stoll(s.substr(1));
                            if (idx >= 0 && (size_t)idx < current.array_val->size()) {
                                current.array_val->erase(current.array_val->begin() + idx);
                            }
                        } catch (...) {}
                    }
                    continue;
                }

                // "?" -> Filter / Condition
                if (sign == '?') {
                    std::string cond = s.substr(1);
                    if (cond == "even" || cond == "%2") {
                        current = current.filter([](const var& x) { return var(x.toInt() % 2 == 0); });
                    } else if (cond == "odd") {
                        current = current.filter([](const var& x) { return var(x.toInt() % 2 != 0); });
                    } else if (!cond.empty()) {
                        std::string op = "";
                        double val = 0.0;
                        if (cond.rfind(">=", 0) == 0) { op = ">="; val = std::stod(cond.substr(2)); }
                        else if (cond.rfind("<=", 0) == 0) { op = "<="; val = std::stod(cond.substr(2)); }
                        else if (cond.rfind("==", 0) == 0) { op = "=="; val = std::stod(cond.substr(2)); }
                        else if (cond.rfind("!=", 0) == 0) { op = "!="; val = std::stod(cond.substr(2)); }
                        else if (cond.rfind(">", 0) == 0) { op = ">"; val = std::stod(cond.substr(1)); }
                        else if (cond.rfind("<", 0) == 0) { op = "<"; val = std::stod(cond.substr(1)); }
                        
                        if (op == ">") current = current.filter([val](const var& x) { return var(x.toDouble() > val); });
                        else if (op == "<") current = current.filter([val](const var& x) { return var(x.toDouble() < val); });
                        else if (op == ">=") current = current.filter([val](const var& x) { return var(x.toDouble() >= val); });
                        else if (op == "<=") current = current.filter([val](const var& x) { return var(x.toDouble() <= val); });
                        else if (op == "==") current = current.filter([val](const var& x) { return var(x.toDouble() == val); });
                        else if (op == "!=") current = current.filter([val](const var& x) { return var(x.toDouble() != val); });
                    }
                    continue;
                }

                // "*" -> Multiply / Scale
                if (sign == '*') {
                    if (s.length() > 1) {
                        try {
                            double factor = std::stod(s.substr(1));
                            current = current.map([factor](const var& x) { return x * var(factor); });
                        } catch (...) {}
                    }
                    continue;
                }

                // "/" -> Divide / Scale
                if (sign == '/') {
                    if (s.length() > 1) {
                        try {
                            double factor = std::stod(s.substr(1));
                            if (factor != 0.0) current = current.map([factor](const var& x) { return x / var(factor); });
                        } catch (...) {}
                    }
                    continue;
                }

                // "^" / "<" / "asc" -> Sort Ascending
                if (s == "^" || s == "<" || s == "asc") {
                    current = current.sort();
                    continue;
                }

                // "v" / ">" / "desc" -> Sort Descending
                if (s == "v" || s == "desc") {
                    current = current.sort().reverse();
                    continue;
                }

                // "~" / "shuffle" -> Shuffle
                if (s == "~" || s == "shuffle") {
                    if (current.array_val && current.array_val->size() > 1) {
                        std::random_device rd;
                        std::mt19937 g(rd());
                        std::shuffle(current.array_val->begin(), current.array_val->end(), g);
                    }
                    continue;
                }

                // "&" -> Join
                if (sign == '&') {
                    std::string delim = (s.length() > 1) ? s.substr(1) : ", ";
                    return current.join(var(delim));
                }
            }
            return current;
        }
        return var();
    }

    var operator()() const {
        return (*this)(std::vector<var>{});
    }

    var operator()(const var& a1) const {
        return (*this)(std::vector<var>{a1});
    }

    var operator()(const var& a1, const var& a2) const {
        return (*this)(std::vector<var>{a1, a2});
    }

    var operator()(const var& a1, const var& a2, const var& a3) const {
        return (*this)(std::vector<var>{a1, a2, a3});
    }

    var operator()(const var& a1, const var& a2, const var& a3, const var& a4) const {
        return (*this)(std::vector<var>{a1, a2, a3, a4});
    }

    var operator()(const var& a1, const var& a2, const var& a3, const var& a4, const var& a5) const {
        return (*this)(std::vector<var>{a1, a2, a3, a4, a5});
    }

    var operator()(const var& a1, const var& a2, const var& a3, const var& a4, const var& a5, const var& a6) const {
        return (*this)(std::vector<var>{a1, a2, a3, a4, a5, a6});
    }


    void add(const var& v) {
        if (type != TYPE_ARRAY) {
            type = TYPE_ARRAY;
            array_val = std::make_shared<var_array>();
        }
        array_val->push_back(v);
    }

    var& operator[](size_t index) {
        if (type != TYPE_ARRAY || !array_val) {
            type = TYPE_ARRAY;
            array_val = std::make_shared<var_array>();
        }
        if (index >= array_val->size()) {
            array_val->resize(index + 1);
        }
        return (*array_val)[index];
    }

    const var& operator[](size_t index) const {
        static const var null_var;
        if (type != TYPE_ARRAY || !array_val || index >= array_val->size()) {
            return null_var;
        }
        return (*array_val)[index];
    }

    var& operator[](int index) {
        return (*this)[(size_t)index];
    }

    const var& operator[](int index) const {
        return (*this)[(size_t)index];
    }

    var& operator[](const std::string& key) {
        if (type != TYPE_OBJECT || !object_val) {
            type = TYPE_OBJECT;
            object_val = std::make_shared<var_object>();
        }
        return (*object_val)[key];
    }

    const var& operator[](const std::string& key) const {
        static const var null_var;
        if (type != TYPE_OBJECT || !object_val) return null_var;
        auto it = object_val->find(key);
        if (it == object_val->end()) return null_var;
        return it->second;
    }

    var& operator[](const char* key) {
        return (*this)[std::string(key)];
    }

    const var& operator[](const char* key) const {
        return (*this)[std::string(key)];
    }

    var& operator[](const var& key) {
        if (key.type == TYPE_INT) {
            return (*this)[(int)key.toInt()];
        }
        return (*this)[key.toString()];
    }

    const var& operator[](const var& key) const {
        if (key.type == TYPE_INT) {
            return (*this)[(int)key.toInt()];
        }
        return (*this)[key.toString()];
    }

    // Array / String / Object methods
    void push(const var& v) {
        add(v);
    }

    var pop() {
        if (type == TYPE_ARRAY && array_val && !array_val->empty()) {
            var back = array_val->back();
            array_val->pop_back();
            return back;
        }
        return var();
    }

    var shift() {
        if (type == TYPE_ARRAY && array_val && !array_val->empty()) {
            var front = array_val->front();
            array_val->erase(array_val->begin());
            return front;
        }
        return var();
    }

    void unshift(const var& v) {
        if (type != TYPE_ARRAY) {
            type = TYPE_ARRAY;
            array_val = std::make_shared<var_array>();
        }
        array_val->insert(array_val->begin(), v);
    }

    var length() const {
        if (type == TYPE_ARRAY && array_val) return var((long long)array_val->size());
        if (type == TYPE_STRING) return var((long long)string_val.length());
        if (type == TYPE_OBJECT && object_val) return var((long long)object_val->size());
        return var(0);
    }

    var size() const {
        return length();
    }

    var join(const std::string& separator = ",") const {
        if (type != TYPE_ARRAY || !array_val) return var("");
        std::string result = "";
        for (size_t i = 0; i < array_val->size(); ++i) {
            result += (*array_val)[i].toString();
            if (i + 1 < array_val->size()) result += separator;
        }
        return var(result);
    }

    var split(const std::string& separator) const {
        var res;
        if (type != TYPE_STRING) return res;
        std::string s = string_val;
        size_t pos = 0;
        std::string token;
        if (separator.empty()) {
            for (char c : s) {
                res.push(var(std::string(1, c)));
            }
            return res;
        }
        while ((pos = s.find(separator)) != std::string::npos) {
            token = s.substr(0, pos);
            res.push(var(token));
            s.erase(0, pos + separator.length());
        }
        res.push(var(s));
        return res;
    }

    var indexOf(const var& search) const {
        if (type == TYPE_STRING) {
            size_t pos = string_val.find(search.toString());
            return pos == std::string::npos ? var(-1) : var((long long)pos);
        }
        if (type == TYPE_ARRAY && array_val) {
            for (size_t i = 0; i < array_val->size(); ++i) {
                if ((*array_val)[i] == search) return var((long long)i);
            }
        }
        return var(-1);
    }

    var toLowerCase() const {
        if (type != TYPE_STRING) return *this;
        std::string s = string_val;
        std::transform(s.begin(), s.end(), s.begin(), [](unsigned char c){ return std::tolower(c); });
        return var(s);
    }

    var toUpperCase() const {
        if (type != TYPE_STRING) return *this;
        std::string s = string_val;
        std::transform(s.begin(), s.end(), s.begin(), [](unsigned char c){ return std::toupper(c); });
        return var(s);
    }

    var trim() const {
        if (type == TYPE_STRING) {
            std::string str = string_val;
            size_t first = str.find_first_not_of(" \t\r\n");
            if (std::string::npos == first) {
                return var("");
            }
            size_t last = str.find_last_not_of(" \t\r\n");
            return var(str.substr(first, (last - first + 1)));
        }
        return *this;
    }

    var substring(const var& start, const var& end = var()) const {
        if (type != TYPE_STRING) return var("");
        long long s = start.toInt();
        long long len = string_val.length();
        if (s < 0) s = 0;
        if (s > len) s = len;
        long long e = len;
        if (end.getType() != TYPE_NULL) {
            e = end.toInt();
            if (e < 0) e = 0;
            if (e > len) e = len;
        }
        if (s > e) std::swap(s, e);
        return var(string_val.substr(s, e - s));
    }

    var keys() const {
        var res;
        if (type == TYPE_OBJECT && object_val) {
            for (auto const& [key, val] : *object_val) {
                res.push(var(key));
            }
        }
        return res;
    }

    var has(const std::string& key) const {
        if (type == TYPE_OBJECT && object_val) {
            return var(object_val->count(key) > 0);
        }
        return var(false);
    }

    var has(const var& key) const {
        return has(key.toString());
    }

    var erase(const std::string& key) {
        if (type == TYPE_OBJECT && object_val) {
            object_val->erase(key);
            return var(true);
        }
        return var(false);
    }

    var get(const var& a1 = var(), const var& a2 = var());
    var post(const var& a1 = var(), const var& a2 = var());
    var put(const var& a1 = var(), const var& a2 = var());
    var del(const var& a1 = var(), const var& a2 = var());
    var use(const var& a1 = var());
    var cors(const var& enable = var(true));
    var rateLimit(const var& maxRequests = var(100), const var& windowSeconds = var(60));

    var on(const std::string& event, const var& callback) {
        if (!event_listeners) {
            event_listeners = std::make_shared<std::map<std::string, std::vector<var>>>();
        }
        (*event_listeners)[event].push_back(callback);
        return *this;
    }

    var emit(const std::string& event, const var& data = var());

    var off(const std::string& event) {
        if (event_listeners) {
            event_listeners->erase(event);
        }
        return *this;
    }

    var once(const std::string& event, const var& callback) {
        auto fired = std::make_shared<bool>(false);
        var wrapper;
        wrapper = var([fired, callback](const std::vector<var>& args) -> var {
            if (!(*fired)) {
                *fired = true;
                if (callback.isFunction()) {
                    callback(args);
                }
            }
            return var();
        });
        on(event, wrapper);
        return *this;
    }

    // JS-like Functional Array methods
    template<typename F>
    var map(F callback) const {
        var res;
        if (type == TYPE_ARRAY && array_val) {
            for (size_t i = 0; i < array_val->size(); ++i) {
                if constexpr (std::is_invocable_v<F, var, var>) {
                    res.push(var(callback((*array_val)[i], var((long long)i))));
                } else {
                    res.push(var(callback((*array_val)[i])));
                }
            }
        }
        return res;
    }

    var find() const {
        if (type == TYPE_OBJECT && object_val && object_val->count("find")) {
            var fn = (*object_val)["find"];
            if (fn.isFunction()) return fn(std::vector<var>{});
        }
        return *this;
    }

    template<typename F>
    var find(F callback) const {
        if (type == TYPE_ARRAY && array_val) {
            for (size_t i = 0; i < array_val->size(); ++i) {
                if constexpr (std::is_invocable_v<F, var, var>) {
                    if (var(callback((*array_val)[i], var((long long)i))).toBool()) {
                        return (*array_val)[i];
                    }
                } else {
                    if (var(callback((*array_val)[i])).toBool()) {
                        return (*array_val)[i];
                    }
                }
            }
        }
        return var();
    }

    template<typename F>
    var findOne(F callback) const {
        return find(callback);
    }

    template<typename F>
    var filter(F callback) const {
        var res;
        if (type == TYPE_ARRAY && array_val) {
            for (size_t i = 0; i < array_val->size(); ++i) {
                if constexpr (std::is_invocable_v<F, var, var>) {
                    if (var(callback((*array_val)[i], var((long long)i))).toBool()) {
                        res.push((*array_val)[i]);
                    }
                } else {
                    if (var(callback((*array_val)[i])).toBool()) {
                        res.push((*array_val)[i]);
                    }
                }
            }
        }
        return res;
    }

    template<typename F>
    void forEach(F callback) const {
        if (type == TYPE_ARRAY && array_val) {
            for (size_t i = 0; i < array_val->size(); ++i) {
                if constexpr (std::is_invocable_v<F, var, var>) {
                    callback((*array_val)[i], var((long long)i));
                } else {
                    callback((*array_val)[i]);
                }
            }
        }
    }

    template<typename F>
    var reduce(F callback, const var& initialValue = var()) const {
        if (type != TYPE_ARRAY || !array_val || array_val->empty()) return initialValue;
        var accumulator = initialValue;
        size_t start_idx = 0;
        if (initialValue.isNull()) {
            accumulator = (*array_val)[0];
            start_idx = 1;
        }
        for (size_t i = start_idx; i < array_val->size(); ++i) {
            if constexpr (std::is_invocable_v<F, var, var, var>) {
                accumulator = callback(accumulator, (*array_val)[i], var((long long)i));
            } else {
                accumulator = callback(accumulator, (*array_val)[i]);
            }
        }
        return accumulator;
    }

    template<typename F>
    var sort(F comparator) const {
        if (type != TYPE_ARRAY || !array_val) return *this;
        var res = *this;
        std::sort(res.array_val->begin(), res.array_val->end(), [comparator](const var& a, const var& b) {
            return comparator(a, b).toInt() < 0;
        });
        return res;
    }

    var sort() const {
        if (type != TYPE_ARRAY || !array_val) return *this;
        var res = *this;
        std::sort(res.array_val->begin(), res.array_val->end(), [](const var& a, const var& b) {
            if ((a.type == TYPE_INT || a.type == TYPE_DOUBLE) && (b.type == TYPE_INT || b.type == TYPE_DOUBLE))
                return a.toDouble() < b.toDouble();
            return a.toString() < b.toString();
        });
        return res;
    }

    var sortBy(const var& key, const var& ascending = var(true)) const {
        if (type != TYPE_ARRAY || !array_val) return *this;
        var res = *this;
        std::string k = key.toString();
        bool asc = ascending.toBool();
        std::sort(res.array_val->begin(), res.array_val->end(), [k, asc](const var& a, const var& b) {
            var va = (a.isObject() && a.has(k).toBool()) ? a[k] : a;
            var vb = (b.isObject() && b.has(k).toBool()) ? b[k] : b;
            bool less = false;
            if ((va.type == TYPE_INT || va.type == TYPE_DOUBLE) && (vb.type == TYPE_INT || vb.type == TYPE_DOUBLE))
                less = va.toDouble() < vb.toDouble();
            else
                less = va.toString() < vb.toString();
            return asc ? less : !less;
        });
        return res;
    }

    var reverse() const {
        if (type != TYPE_ARRAY || !array_val) return *this;
        var res = *this;
        std::reverse(res.array_val->begin(), res.array_val->end());
        return res;
    }

    var join(const var& delimiter = var(",")) const {
        if (type != TYPE_ARRAY || !array_val) return var("");
        std::string delim = delimiter.toString();
        std::string result = "";
        for (size_t i = 0; i < array_val->size(); ++i) {
            if (i > 0) result += delim;
            result += (*array_val)[i].toString();
        }
        return var(result);
    }

    var split(const var& delimiter = var(",")) const {
        std::string s = this->toString();
        std::string delim = delimiter.toString();
        var res;
        if (delim.empty()) {
            for (char c : s) {
                res.push(var(std::string(1, c)));
            }
            return res;
        }
        size_t pos = 0;
        while (pos < s.length()) {
            size_t next = s.find(delim, pos);
            if (next == std::string::npos) {
                res.push(var(s.substr(pos)));
                break;
            }
            res.push(var(s.substr(pos, next - pos)));
            pos = next + delim.length();
        }
        return res;
    }

    std::vector<var>::iterator begin() {
        if (type != TYPE_ARRAY || !array_val) {
            static std::vector<var> empty;
            return empty.begin();
        }
        return array_val->begin();
    }
    std::vector<var>::iterator end() {
        if (type != TYPE_ARRAY || !array_val) {
            static std::vector<var> empty;
            return empty.end();
        }
        return array_val->end();
    }
    std::vector<var>::const_iterator begin() const {
        if (type != TYPE_ARRAY || !array_val) {
            static const std::vector<var> empty;
            return empty.begin();
        }
        return array_val->begin();
    }
    std::vector<var>::const_iterator end() const {
        if (type != TYPE_ARRAY || !array_val) {
            static const std::vector<var> empty;
            return empty.end();
        }
        return array_val->end();
    }

    bool as_bool() const { return toBool(); }
    const var& as_iterable() const { return *this; }
    var& as_iterable() { return *this; }

    var isOdd() const {
        if (type == TYPE_INT) return var(int_val % 2 != 0);
        if (type == TYPE_DOUBLE) return var((long long)double_val % 2 != 0);
        return var(false);
    }
    var isEven() const {
        if (type == TYPE_INT) return var(int_val % 2 == 0);
        if (type == TYPE_DOUBLE) return var((long long)double_val % 2 == 0);
        return var(false);
    }

    var values() const {
        var res;
        if (type == TYPE_OBJECT && object_val) {
            for (const auto& pair : *object_val) {
                res.push(pair.second);
            }
        }
        return res;
    }
    var entries() const {
        var res;
        if (type == TYPE_OBJECT && object_val) {
            for (const auto& pair : *object_val) {
                var entry;
                entry.push(var(pair.first));
                entry.push(pair.second);
                res.push(entry);
            }
        }
        return res;
    }

    var rotateRight(const var& steps_var = var(1)) const {
        long long steps = steps_var.toInt();
        if (type == TYPE_ARRAY && array_val && !array_val->empty()) {
            long long size = array_val->size();
            steps = (steps % size + size) % size;
            var res;
            for (long long i = 0; i < size; ++i) {
                res.push((*array_val)[(i - steps + size) % size]);
            }
            return res;
        }
        if (type == TYPE_STRING) {
            if (string_val.empty()) return *this;
            long long size = string_val.length();
            steps = (steps % size + size) % size;
            return var(string_val.substr(size - steps) + string_val.substr(0, size - steps));
        }
        return *this;
    }

    var rotateLeft(const var& steps_var = var(1)) const {
        long long steps = steps_var.toInt();
        if (type == TYPE_ARRAY && array_val && !array_val->empty()) {
            long long size = array_val->size();
            steps = (steps % size + size) % size;
            var res;
            for (long long i = 0; i < size; ++i) {
                res.push((*array_val)[(i + steps) % size]);
            }
            return res;
        }
        if (type == TYPE_STRING) {
            if (string_val.empty()) return *this;
            long long size = string_val.length();
            steps = (steps % size + size) % size;
            return var(string_val.substr(steps) + string_val.substr(0, steps));
        }
        return *this;
    }

    var operator+(const var& other) const {
        if (type == TYPE_MATRIX && other.type == TYPE_MATRIX) {
            int r1 = matrix_val->rows, c1 = matrix_val->cols;
            int r2 = other.matrix_val->rows, c2 = other.matrix_val->cols;
            if (r1 == r2 && c1 == c2) {
                std::shared_ptr<MatrixClass> res = std::make_shared<MatrixClass>(r1, c1);
                for (size_t i = 0; i < matrix_val->data.size(); ++i) {
                    res->data[i] = matrix_val->data[i] + other.matrix_val->data[i];
                }
                return var(res);
            }
            if (r2 == 1 && c1 == c2) {
                std::shared_ptr<MatrixClass> res = std::make_shared<MatrixClass>(r1, c1);
                for (int i = 0; i < r1; ++i) {
                    for (int j = 0; j < c1; ++j) {
                        res->set(i, j, matrix_val->get(i, j) + other.matrix_val->get(0, j));
                    }
                }
                return var(res);
            }
            if (r1 == 1 && c1 == c2) {
                std::shared_ptr<MatrixClass> res = std::make_shared<MatrixClass>(r2, c2);
                for (int i = 0; i < r2; ++i) {
                    for (int j = 0; j < c2; ++j) {
                        res->set(i, j, matrix_val->get(0, j) + other.matrix_val->get(i, j));
                    }
                }
                return var(res);
            }
            print("[Matrix Error] operator+ shape mismatch: " + std::to_string(r1) + "x" + std::to_string(c1) + " and " + std::to_string(r2) + "x" + std::to_string(c2));
            return var();
        }
        if (type == TYPE_MATRIX) {
            std::shared_ptr<MatrixClass> res = std::make_shared<MatrixClass>(matrix_val->rows, matrix_val->cols);
            double val = other.toDouble();
            for (size_t i = 0; i < matrix_val->data.size(); ++i) {
                res->data[i] = matrix_val->data[i] + val;
            }
            return var(res);
        }
        if (other.type == TYPE_MATRIX) {
            std::shared_ptr<MatrixClass> res = std::make_shared<MatrixClass>(other.matrix_val->rows, other.matrix_val->cols);
            double val = this->toDouble();
            for (size_t i = 0; i < other.matrix_val->data.size(); ++i) {
                res->data[i] = val + other.matrix_val->data[i];
            }
            return var(res);
        }
        if (type == TYPE_STRING || other.type == TYPE_STRING) {
            return var(this->toString() + other.toString());
        }
        if (type == TYPE_DOUBLE || other.type == TYPE_DOUBLE) {
            return var(this->toDouble() + other.toDouble());
        }
        return var(this->toInt() + other.toInt());
    }

    var operator-() const {
        if (type == TYPE_INT) return var(-int_val);
        if (type == TYPE_DOUBLE) return var(-double_val);
        if (type == TYPE_MATRIX && matrix_val) {
            std::shared_ptr<MatrixClass> res = std::make_shared<MatrixClass>(matrix_val->rows, matrix_val->cols);
            for (size_t i = 0; i < matrix_val->data.size(); ++i) {
                res->data[i] = -matrix_val->data[i];
            }
            return var(res);
        }
        return var(0.0 - toDouble());
    }

    var operator-(const var& other) const {
        if (type == TYPE_MATRIX && other.type == TYPE_MATRIX) {
            int r1 = matrix_val->rows, c1 = matrix_val->cols;
            int r2 = other.matrix_val->rows, c2 = other.matrix_val->cols;
            if (r1 == r2 && c1 == c2) {
                std::shared_ptr<MatrixClass> res = std::make_shared<MatrixClass>(r1, c1);
                for (size_t i = 0; i < matrix_val->data.size(); ++i) {
                    res->data[i] = matrix_val->data[i] - other.matrix_val->data[i];
                }
                return var(res);
            }
            if (r2 == 1 && c1 == c2) {
                std::shared_ptr<MatrixClass> res = std::make_shared<MatrixClass>(r1, c1);
                for (int i = 0; i < r1; ++i) {
                    for (int j = 0; j < c1; ++j) {
                        res->set(i, j, matrix_val->get(i, j) - other.matrix_val->get(0, j));
                    }
                }
                return var(res);
            }
            if (r1 == 1 && c1 == c2) {
                std::shared_ptr<MatrixClass> res = std::make_shared<MatrixClass>(r2, c2);
                for (int i = 0; i < r2; ++i) {
                    for (int j = 0; j < c2; ++j) {
                        res->set(i, j, matrix_val->get(0, j) - other.matrix_val->get(i, j));
                    }
                }
                return var(res);
            }
            print("[Matrix Error] operator- shape mismatch: " + std::to_string(r1) + "x" + std::to_string(c1) + " and " + std::to_string(r2) + "x" + std::to_string(c2));
            return var();
        }
        if (type == TYPE_MATRIX) {
            std::shared_ptr<MatrixClass> res = std::make_shared<MatrixClass>(matrix_val->rows, matrix_val->cols);
            double val = other.toDouble();
            for (size_t i = 0; i < matrix_val->data.size(); ++i) {
                res->data[i] = matrix_val->data[i] - val;
            }
            return var(res);
        }
        if (other.type == TYPE_MATRIX) {
            std::shared_ptr<MatrixClass> res = std::make_shared<MatrixClass>(other.matrix_val->rows, other.matrix_val->cols);
            double val = this->toDouble();
            for (size_t i = 0; i < other.matrix_val->data.size(); ++i) {
                res->data[i] = val - other.matrix_val->data[i];
            }
            return var(res);
        }
        if (type == TYPE_DOUBLE || other.type == TYPE_DOUBLE) {
            return var(this->toDouble() - other.toDouble());
        }
        return var(this->toInt() - other.toInt());
    }

    var operator*(const var& other) const {
        if (type == TYPE_MATRIX && other.type == TYPE_MATRIX) {
            int r1 = matrix_val->rows, c1 = matrix_val->cols;
            int r2 = other.matrix_val->rows, c2 = other.matrix_val->cols;
            if (r1 == r2 && c1 == c2) {
                std::shared_ptr<MatrixClass> res = std::make_shared<MatrixClass>(r1, c1);
                for (size_t i = 0; i < matrix_val->data.size(); ++i) {
                    res->data[i] = matrix_val->data[i] * other.matrix_val->data[i];
                }
                return var(res);
            }
            if (r2 == 1 && c1 == c2) {
                std::shared_ptr<MatrixClass> res = std::make_shared<MatrixClass>(r1, c1);
                for (int i = 0; i < r1; ++i) {
                    for (int j = 0; j < c1; ++j) {
                        res->set(i, j, matrix_val->get(i, j) * other.matrix_val->get(0, j));
                    }
                }
                return var(res);
            }
            if (r1 == 1 && c1 == c2) {
                std::shared_ptr<MatrixClass> res = std::make_shared<MatrixClass>(r2, c2);
                for (int i = 0; i < r2; ++i) {
                    for (int j = 0; j < c2; ++j) {
                        res->set(i, j, matrix_val->get(0, j) * other.matrix_val->get(i, j));
                    }
                }
                return var(res);
            }
            print("[Matrix Error] operator* shape mismatch: " + std::to_string(r1) + "x" + std::to_string(c1) + " and " + std::to_string(r2) + "x" + std::to_string(c2));
            return var();
        }
        if (type == TYPE_MATRIX) {
            std::shared_ptr<MatrixClass> res = std::make_shared<MatrixClass>(matrix_val->rows, matrix_val->cols);
            double val = other.toDouble();
            for (size_t i = 0; i < matrix_val->data.size(); ++i) {
                res->data[i] = matrix_val->data[i] * val;
            }
            return var(res);
        }
        if (other.type == TYPE_MATRIX) {
            std::shared_ptr<MatrixClass> res = std::make_shared<MatrixClass>(other.matrix_val->rows, other.matrix_val->cols);
            double val = this->toDouble();
            for (size_t i = 0; i < other.matrix_val->data.size(); ++i) {
                res->data[i] = val * other.matrix_val->data[i];
            }
            return var(res);
        }
        if (type == TYPE_DOUBLE || other.type == TYPE_DOUBLE) {
            return var(this->toDouble() * other.toDouble());
        }
        return var(this->toInt() * other.toInt());
    }

    var operator/(const var& other) const {
        if (type == TYPE_MATRIX && other.type == TYPE_MATRIX) {
            int r1 = matrix_val->rows, c1 = matrix_val->cols;
            int r2 = other.matrix_val->rows, c2 = other.matrix_val->cols;
            if (r1 == r2 && c1 == c2) {
                std::shared_ptr<MatrixClass> res = std::make_shared<MatrixClass>(r1, c1);
                for (size_t i = 0; i < matrix_val->data.size(); ++i) {
                    double d = other.matrix_val->data[i];
                    res->data[i] = (d == 0.0) ? 0.0 : (matrix_val->data[i] / d);
                }
                return var(res);
            }
            if (r2 == 1 && c1 == c2) {
                std::shared_ptr<MatrixClass> res = std::make_shared<MatrixClass>(r1, c1);
                for (int i = 0; i < r1; ++i) {
                    for (int j = 0; j < c1; ++j) {
                        double d = other.matrix_val->get(0, j);
                        res->set(i, j, (d == 0.0) ? 0.0 : (matrix_val->get(i, j) / d));
                    }
                }
                return var(res);
            }
            if (r1 == 1 && c1 == c2) {
                std::shared_ptr<MatrixClass> res = std::make_shared<MatrixClass>(r2, c2);
                for (int i = 0; i < r2; ++i) {
                    for (int j = 0; j < c2; ++j) {
                        double d = other.matrix_val->get(i, j);
                        res->set(i, j, (d == 0.0) ? 0.0 : (matrix_val->get(0, j) / d));
                    }
                }
                return var(res);
            }
            print("[Matrix Error] operator/ shape mismatch: " + std::to_string(r1) + "x" + std::to_string(c1) + " and " + std::to_string(r2) + "x" + std::to_string(c2));
            return var();
        }
        if (type == TYPE_MATRIX) {
            std::shared_ptr<MatrixClass> res = std::make_shared<MatrixClass>(matrix_val->rows, matrix_val->cols);
            double val = other.toDouble();
            for (size_t i = 0; i < matrix_val->data.size(); ++i) {
                res->data[i] = (val == 0.0) ? 0.0 : (matrix_val->data[i] / val);
            }
            return var(res);
        }
        if (other.type == TYPE_MATRIX) {
            std::shared_ptr<MatrixClass> res = std::make_shared<MatrixClass>(other.matrix_val->rows, other.matrix_val->cols);
            double val = this->toDouble();
            for (size_t i = 0; i < other.matrix_val->data.size(); ++i) {
                double d = other.matrix_val->data[i];
                res->data[i] = (d == 0.0) ? 0.0 : (val / d);
            }
            return var(res);
        }
        double denom = other.toDouble();
        if (denom == 0.0) return var(0.0);
        if (type == TYPE_DOUBLE || other.type == TYPE_DOUBLE) {
            return var(this->toDouble() / denom);
        }
        return var(this->toInt() / other.toInt());
    }

    var operator%(const var& other) const {
        long long denom = other.toInt();
        if (denom == 0) return var(0);
        return var(this->toInt() % denom);
    }

    var& operator+=(const var& other) {
        *this = *this + other;
        return *this;
    }
    var& operator-=(const var& other) {
        *this = *this - other;
        return *this;
    }
    var& operator*=(const var& other) {
        *this = *this * other;
        return *this;
    }
    var& operator/=(const var& other) {
        *this = *this / other;
        return *this;
    }
    var& operator%=(const var& other) {
        *this = *this % other;
        return *this;
    }

    // Prefix increment
    var& operator++() {
        if (type == TYPE_DOUBLE) double_val++;
        else {
            type = TYPE_INT;
            int_val++;
        }
        return *this;
    }
    // Postfix increment
    var operator++(int) {
        var temp = *this;
        ++(*this);
        return temp;
    }
    // Prefix decrement
    var& operator--() {
        if (type == TYPE_DOUBLE) double_val--;
        else {
            type = TYPE_INT;
            int_val--;
        }
        return *this;
    }
    // Postfix decrement
    var operator--(int) {
        var temp = *this;
        --(*this);
        return temp;
    }

    var operator!() const {
        return var(!toBool());
    }

    var operator<<(const var& other) const {
        return var(this->toInt() << other.toInt());
    }
    var operator>>(const var& other) const {
        return var(this->toInt() >> other.toInt());
    }
    var operator&(const var& other) const {
        return var(this->toInt() & other.toInt());
    }
    var operator|(const var& other) const {
        return var(this->toInt() | other.toInt());
    }
    var operator^(const var& other) const {
        return var(this->toInt() ^ other.toInt());
    }
    var operator~() const {
        return var(~this->toInt());
    }

    var& operator<<=(const var& other) { *this = *this << other; return *this; }
    var& operator>>=(const var& other) { *this = *this >> other; return *this; }
    var& operator&=(const var& other) { *this = *this & other; return *this; }
    var& operator|=(const var& other) { *this = *this | other; return *this; }
    var& operator^=(const var& other) { *this = *this ^ other; return *this; }

    var operator==(const var& other) const {
        if (type == TYPE_STRING && other.type == TYPE_STRING) return var(string_val == other.string_val);
        if (type == TYPE_DOUBLE || other.type == TYPE_DOUBLE) return var(this->toDouble() == other.toDouble());
        return var(this->toInt() == other.toInt());
    }

    var operator!=(const var& other) const {
        return var(!((*this == other).toBool()));
    }

    var operator<(const var& other) const {
        if (type == TYPE_STRING && other.type == TYPE_STRING) return var(string_val < other.string_val);
        if (type == TYPE_DOUBLE || other.type == TYPE_DOUBLE) return var(this->toDouble() < other.toDouble());
        return var(this->toInt() < other.toInt());
    }

    var operator>(const var& other) const {
        if (type == TYPE_STRING && other.type == TYPE_STRING) return var(string_val > other.string_val);
        if (type == TYPE_DOUBLE || other.type == TYPE_DOUBLE) return var(this->toDouble() > other.toDouble());
        return var(this->toInt() > other.toInt());
    }

    var operator<=(const var& other) const {
        return var(!((*this > other).toBool()));
    }

    var operator>=(const var& other) const {
        return var(!((*this < other).toBool()));
    }

    static var Promise();
    void resolve(const var& val);
    var await_value() const;

    static var MatrixCreate(int r, int c, const var& data);
    static var MatrixZeros(int r, int c);
    static var MatrixOnes(int r, int c);
    static var MatrixRandom(int r, int c);

    var matmul(const var& other) const;
    var transpose() const;
    var sigmoid() const;
    var sigmoidDerivative() const;
    var relu() const;
    var reluDerivative() const;
    var toArray() const;

    var serve_static(const var& dir);
    var listen(const var& port = var(80));
    var write(const var& data);
    var close();
    var status(const var& code);
    var send(const var& body);
    var json(const var& body);
    var html(const var& body);
    var sendFile(const var& path);
    var file(const var& path);
    var redirect(const var& url);
    var render(const var& vpath, const var& vdata = var());
};



inline std::ostream& operator<<(std::ostream& os, const var& v) {
    os << v.toString();
    return os;
}

// Global operator overloads for LHS values
inline var operator+(const char* lhs, const var& rhs) { return var(lhs) + rhs; }
inline var operator+(const std::string& lhs, const var& rhs) { return var(lhs) + rhs; }
inline var operator+(double lhs, const var& rhs) { return var(lhs) + rhs; }
inline var operator+(long long lhs, const var& rhs) { return var(lhs) + rhs; }
inline var operator+(int lhs, const var& rhs) { return var(lhs) + rhs; }
inline var operator+(bool lhs, const var& rhs) { return var(lhs) + rhs; }

inline var operator-(double lhs, const var& rhs) { return var(lhs) - rhs; }
inline var operator-(long long lhs, const var& rhs) { return var(lhs) - rhs; }
inline var operator-(int lhs, const var& rhs) { return var(lhs) - rhs; }

inline var operator*(double lhs, const var& rhs) { return var(lhs) * rhs; }
inline var operator*(long long lhs, const var& rhs) { return var(lhs) * rhs; }
inline var operator*(int lhs, const var& rhs) { return var(lhs) * rhs; }

inline var operator/(double lhs, const var& rhs) { return var(lhs) / rhs; }
inline var operator/(long long lhs, const var& rhs) { return var(lhs) / rhs; }
inline var operator/(int lhs, const var& rhs) { return var(lhs) / rhs; }

inline var operator%(long long lhs, const var& rhs) { return var(lhs) % rhs; }
inline var operator%(int lhs, const var& rhs) { return var(lhs) % rhs; }

inline var operator==(const char* lhs, const var& rhs) { return var(lhs) == rhs; }
inline var operator==(const std::string& lhs, const var& rhs) { return var(lhs) == rhs; }
inline var operator==(double lhs, const var& rhs) { return var(lhs) == rhs; }
inline var operator==(long long lhs, const var& rhs) { return var(lhs) == rhs; }
inline var operator==(int lhs, const var& rhs) { return var(lhs) == rhs; }
inline var operator==(bool lhs, const var& rhs) { return var(lhs) == rhs; }

inline var operator!=(const char* lhs, const var& rhs) { return var(lhs) != rhs; }
inline var operator!=(const std::string& lhs, const var& rhs) { return var(lhs) != rhs; }
inline var operator!=(double lhs, const var& rhs) { return var(lhs) != rhs; }
inline var operator!=(long long lhs, const var& rhs) { return var(lhs) != rhs; }
inline var operator!=(int lhs, const var& rhs) { return var(lhs) != rhs; }
inline var operator!=(bool lhs, const var& rhs) { return var(lhs) != rhs; }

inline var operator<(const char* lhs, const var& rhs) { return var(lhs) < rhs; }
inline var operator<(const std::string& lhs, const var& rhs) { return var(lhs) < rhs; }
inline var operator<(double lhs, const var& rhs) { return var(lhs) < rhs; }
inline var operator<(long long lhs, const var& rhs) { return var(lhs) < rhs; }
inline var operator<(int lhs, const var& rhs) { return var(lhs) < rhs; }

inline var operator>(const char* lhs, const var& rhs) { return var(lhs) > rhs; }
inline var operator>(const std::string& lhs, const var& rhs) { return var(lhs) > rhs; }
inline var operator>(double lhs, const var& rhs) { return var(lhs) > rhs; }
inline var operator>(long long lhs, const var& rhs) { return var(lhs) > rhs; }
inline var operator>(int lhs, const var& rhs) { return var(lhs) > rhs; }

inline var operator<=(const char* lhs, const var& rhs) { return var(lhs) <= rhs; }
inline var operator<=(const std::string& lhs, const var& rhs) { return var(lhs) <= rhs; }
inline var operator<=(double lhs, const var& rhs) { return var(lhs) <= rhs; }
inline var operator<=(long long lhs, const var& rhs) { return var(lhs) <= rhs; }
inline var operator<=(int lhs, const var& rhs) { return var(lhs) <= rhs; }

inline var operator>=(const char* lhs, const var& rhs) { return var(lhs) >= rhs; }
inline var operator>=(const std::string& lhs, const var& rhs) { return var(lhs) >= rhs; }
inline var operator>=(double lhs, const var& rhs) { return var(lhs) >= rhs; }
inline var operator>=(long long lhs, const var& rhs) { return var(lhs) >= rhs; }
inline var operator>=(int lhs, const var& rhs) { return var(lhs) >= rhs; }

// Forward declarations for Nepali Patro builtins
var dolphin_miti();
var dolphin_samaya();
var dolphin_gate();
var dolphin_bar();
var dolphin_mahina();
var dolphin_barsa();
var dolphin_aja();
var dolphin_nepali(const var& v);

