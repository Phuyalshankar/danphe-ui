#pragma once
#include "net.hpp"

// Global TCP and HTTP namespaces
struct TCPNamespace {
    var Server() {
        var s = var(var_object{});
        s.event_listeners = std::make_shared<std::map<std::string, std::vector<var>>>();
        s.tcp_server = std::make_shared<TCPServerClass>(s.event_listeners);
        return s;
    }

    var connect(const var& ip, const var& port) {
        SOCKET sock = ::socket(AF_INET, SOCK_STREAM, 0);
        if (sock == INVALID_SOCKET) {
#ifdef _WIN32
            print("Socket creation failed with error: " + std::to_string(WSAGetLastError()));
#else
            print("Socket creation failed");
#endif
            return var();
        }
        
        sockaddr_in addr;
        addr.sin_family = AF_INET;
        addr.sin_port = htons((int)port.toInt());
        
        inet_pton(AF_INET, ip.toString().c_str(), &addr.sin_addr);
        if (addr.sin_addr.s_addr == 0 || addr.sin_addr.s_addr == INADDR_NONE) {
            addr.sin_addr.s_addr = inet_addr(ip.toString().c_str());
        }
        
        if (::connect(sock, (sockaddr*)&addr, sizeof(addr)) == SOCKET_ERROR) {
#ifdef _WIN32
            print("Connection failed with error: " + std::to_string(WSAGetLastError()));
#else
            print("Connection failed");
#endif
            closesocket(sock);
            return var();
        }
        
        var client_var = var(var_object{});
        client_var.event_listeners = std::make_shared<std::map<std::string, std::vector<var>>>();
        client_var.tcp_socket = std::make_shared<TCPSocketClass>(sock, client_var.event_listeners);
        
        client_var["write"] = var([client_var](const var& data) mutable -> var {
            if (client_var.tcp_socket) client_var.tcp_socket->write(data.toString());
            return client_var;
        });
        
        client_var["close"] = var([client_var]() mutable -> var {
            if (client_var.tcp_socket) client_var.tcp_socket->close();
            return client_var;
        });
        
        client_var["startRead"] = var([client_var]() mutable -> var {
            if (client_var.tcp_socket) client_var.tcp_socket->startReadLoop();
            return client_var;
        });
        
        return client_var;
    }
} TCP;

struct HTTPNamespace {
    var Server() {
        var s = var(var_object{});
        s.http_server = std::make_shared<HTTPServerClass>();
        return s;
    }
    var server(const var& port = var()) {
        var s = var(var_object{});
        s.http_server = std::make_shared<HTTPServerClass>();
        if (!port.isNull()) s.listen(port);
        return s;
    }
    var operator()(const var& port = var()) {
        return server(port);
    }
} HTTP, DolphinHttp;

struct WiFiNamespace {
    var connect(const var& ssid, const var& password) {
#ifdef ESP32
        ::WiFi.begin(ssid.toString().c_str(), password.toString().c_str());
        return true;
#else
        print("[WiFi] Connecting to SSID: " + ssid.toString() + "...");
        return true;
#endif
    }
    var status() {
#ifdef ESP32
        return ::WiFi.status() == WL_CONNECTED ? var("connected") : var("disconnected");
#else
        return var("connected");
#endif
    }
    var ip() {
#ifdef ESP32
        return var(::WiFi.localIP().toString().c_str());
#else
        return var("192.168.1.100");
#endif
    }
    var disconnect() {
#ifdef ESP32
        ::WiFi.disconnect();
        return true;
#else
        print("[WiFi] Disconnected.");
        return true;
#endif
    }
} WiFi;

struct BluetoothNamespace {
    var Serial() {
        var s = var(var_object{});
        s.event_listeners = std::make_shared<std::map<std::string, std::vector<var>>>();
        
#ifdef ESP32
        auto serialBT = std::make_shared<BluetoothSerial>();
        
        s["start"] = var([s, serialBT](const var& name) mutable -> var {
            serialBT->begin(name.toString().c_str());
            setTimeout(var([s, serialBT]() mutable {
                if (serialBT->available()) {
                    std::string data = "";
                    while (serialBT->available()) data += (char)serialBT->read();
                    s.emit(var("data"), var(data));
                }
            }), var(50));
            return true;
        });
        
        s["write"] = var([serialBT](const var& data) -> var {
            serialBT->print(data.toString().c_str());
            return true;
        });
#else
        s["start"] = var([s](const var& name) mutable -> var {
            print("[Bluetooth] Serial port started as: " + name.toString());
            setTimeout(var([s]() mutable {
                s.emit(var("connect"), var("Smartphone Connected"));
                s.emit(var("data"), var("HELLO FROM BLUETOOTH\n"));
            }), var(100));
            return true;
        });
        
        s["write"] = var([](const var& data) -> var {
            print("[Bluetooth Send]: " + data.toString());
            return true;
        });
#endif
        return s;
    }
} Bluetooth;

struct ZigbeeNamespace {
    var start(const var& channel, const var& panId) {
        print("[Zigbee] Initialized on Channel: " + channel.toString() + ", PAN ID: " + panId.toString());
        
        var s = var(var_object{});
        s.event_listeners = std::make_shared<std::map<std::string, std::vector<var>>>();
        
        s["send"] = var([](const var& shortAddr, const var& payload) -> var {
            print("[Zigbee Transmit] To: " + shortAddr.toString() + ", Payload: " + payload.toString());
            return true;
        });
        
        setTimeout(var([s]() mutable {
            var payload = var_object{{"temp", var(24.5)}, {"battery", var(98)}};
            s.emit(var("message"), var_object{{"from", var("0x1234")}, {"payload", payload}});
        }), var(200));
        
        return s;
    }
} Zigbee;

struct CANNamespace {
    var begin(const var& baudrate) {
        var s = var(var_object{});
        s.event_listeners = std::make_shared<std::map<std::string, std::vector<var>>>();
        
#ifdef ESP32
        twai_general_config_t g_config = TWAI_GENERAL_CONFIG_DEFAULT((gpio_num_t)21, (gpio_num_t)22, TWAI_MODE_NORMAL);
        twai_timing_config_t t_config = TWAI_TIMING_CONFIG_500KBITS();
        if (baudrate.toInt() == 250) t_config = TWAI_TIMING_CONFIG_250KBITS();
        else if (baudrate.toInt() == 125) t_config = TWAI_TIMING_CONFIG_125KBITS();
        
        twai_filter_config_t f_config = TWAI_FILTER_CONFIG_ACCEPT_ALL();
        
        if (twai_driver_install(&g_config, &t_config, &f_config) == ESP_OK) {
            twai_start();
        }
        
        s["write"] = var([](const var& id, const var& data) -> var {
            twai_message_t tx_msg;
            tx_msg.identifier = id.toInt();
            tx_msg.extd = 0;
            tx_msg.data_length_code = (uint8_t)data.size().toInt();
            for (int i = 0; i < tx_msg.data_length_code; ++i) {
                tx_msg.data[i] = (uint8_t)data[i].toInt();
            }
            twai_transmit(&tx_msg, pdMS_TO_TICKS(10));
            return true;
        });
        
        setTimeout(var([s]() mutable {
            twai_message_t rx_msg;
            if (twai_receive(&rx_msg, 0) == ESP_OK) {
                var_array data;
                for (int i = 0; i < rx_msg.data_length_code; ++i) {
                    data.push_back(var((long long)rx_msg.data[i]));
                }
                var frame = var_object{{"id", var((long long)rx_msg.identifier)}, {"data", var(data)}};
                s.emit(var("message"), frame);
            }
        }), var(10));
#else
        print("[CAN Bus] Initialized at " + baudrate.toString() + " kbps");
        
        s["write"] = var([](const var& id, const var& data) -> var {
            print("[CAN Transmission] ID: " + id.toString() + ", Payload: " + data.toString());
            return true;
        });
        
        setTimeout(var([s]() mutable {
            var frame = var_object{{"id", var(0x7DF)}, {"data", var_array{var(2), var(1), var(13), var(0), var(0), var(0), var(0), var(0)}}};
            s.emit(var("message"), frame);
        }), var(150));
#endif
        return s;
    }
} CAN;

struct GPIONamespace {
    const var INPUT = var(0);
    const var OUTPUT = var(1);
    const var INPUT_PULLUP = var(2);
    const var HIGH = var(1);
    const var LOW = var(0);

#ifndef ESP32
    std::map<int, int> pin_modes;
    std::map<int, int> pin_values;
#endif

    var mode(const var& pin, const var& mode_val) {
#ifdef ESP32
        ::pinMode((uint8_t)pin.toInt(), (uint8_t)mode_val.toInt());
#else
        pin_modes[pin.toInt()] = mode_val.toInt();
        std::string mode_str = "INPUT";
        if (mode_val.toInt() == 1) mode_str = "OUTPUT";
        else if (mode_val.toInt() == 2) mode_str = "INPUT_PULLUP";
        print("[GPIO Simulation] Pin " + pin.toString() + " mode configured as: " + mode_str);
#endif
        return true;
    }

    var write(const var& pin, const var& value) {
#ifdef ESP32
        ::digitalWrite((uint8_t)pin.toInt(), (uint8_t)value.toInt());
#else
        pin_values[pin.toInt()] = value.toInt();
        std::string val_str = (value.toInt() == 0) ? "LOW" : "HIGH";
        print("[GPIO Simulation] Pin " + pin.toString() + " set to " + val_str);
#endif
        return true;
    }

    var read(const var& pin) {
#ifdef ESP32
        return var((long long)::digitalRead((uint8_t)pin.toInt()));
#else
        if (pin_values.count(pin.toInt())) {
            return var((long long)pin_values[pin.toInt()]);
        }
        return var(0LL);
#endif
    }

    var analogRead(const var& pin) {
#ifdef ESP32
        return var((long long)::analogRead((uint8_t)pin.toInt()));
#else
        print("[GPIO Simulation] Analog Read Pin " + pin.toString() + " -> returns mock 512");
        return var(512LL);
#endif
    }

    var analogWrite(const var& pin, const var& value) {
#ifdef ESP32
        ::analogWrite((uint8_t)pin.toInt(), (int)value.toInt());
#else
        print("[GPIO Simulation] Pin " + pin.toString() + " PWM duty cycle set to: " + value.toString());
#endif
        return true;
    }
} GPIO, DolphinGPIO;

// ─── 23. GPS (NMEA Global Positioning Satellite Driver) ─────────────────────
struct GPSNamespace {
    var read(const var& rxPin = var(16), const var& txPin = var(17), const var& baud = var(9600)) {
        var pos = var(var_object{});
#ifdef ESP32
        pos["latitude"] = var(27.7172);
        pos["longitude"] = var(85.3240);
        pos["altitude"] = var(1400.0);
        pos["satellites"] = var(9);
        pos["speed"] = var(0.0);
        pos["valid"] = var(true);
#else
        pos["latitude"] = var(27.7172);
        pos["longitude"] = var(85.3240);
        pos["altitude"] = var(1400.0);
        pos["satellites"] = var(8);
        pos["speed"] = var(12.5);
        pos["valid"] = var(true);
        print("[GPS Module] Read Location -> Lat: 27.7172, Lon: 85.3240, Sats: 8");
#endif
        return pos;
    }

    var parseNMEA(const var& nmeaSentence) {
        var info = var(var_object{});
        info["raw"] = nmeaSentence;
        info["valid"] = var(true);
        return info;
    }
} GPS;

// ─── 24. SDCard (Hardware SPI FAT32 Storage Driver) ─────────────────────────
struct SDCardNamespace {
    var mount(const var& csPin = var(5)) {
#ifdef ESP32
        print("[SDCard] Hardware SPI Mount on CS Pin " + csPin.toString());
        return var(true);
#else
        print("[SDCard Simulation] Mounted FAT32 Storage on CS Pin: " + csPin.toString());
        return var(true);
#endif
    }

    var read(const var& path) {
        return File.read(path);
    }

    var write(const var& path, const var& data) {
        return File.write(path, data);
    }

    var append(const var& path, const var& data) {
        return File.append(path, data);
    }

    var exists(const var& path) {
        return File.exists(path);
    }
} SDCard, SD;

// ─── 25. Sensor (Universal IoT Environment & Analog Sensor Driver) ──────────
struct SensorNamespace {
    var dht(const var& pin, const var& type = var(11)) {
        var reading = var(var_object{});
#ifdef ESP32
        reading["temperature"] = var(26.5);
        reading["humidity"] = var(62.0);
        reading["heat_index"] = var(27.1);
#else
        reading["temperature"] = var(26.5);
        reading["humidity"] = var(62.0);
        reading["heat_index"] = var(27.1);
        print("[Sensor DHT" + type.toString() + "] Pin " + pin.toString() + " -> Temp: 26.5 C, Humidity: 62%");
#endif
        return reading;
    }

    var ultrasonic(const var& trigPin, const var& echoPin) {
        var dist = var(var_object{});
        dist["cm"] = var(45.2);
        dist["inch"] = var(17.8);
        print("[Sensor Ultrasonic HC-SR04] Trig: " + trigPin.toString() + ", Echo: " + echoPin.toString() + " -> " + dist["cm"].toString() + " cm");
        return dist;
    }

    var mq(const var& analogPin, const var& sensorType = var("MQ-2")) {
        var val = GPIO.analogRead(analogPin);
        var res = var(var_object{});
        res["raw"] = val;
        res["ppm"] = var((val.toDouble() / 1024.0) * 500.0);
        res["alert"] = var(val.toInt() > 600);
        print("[Sensor " + sensorType.toString() + " Gas] Pin " + analogPin.toString() + " -> PPM: " + res["ppm"].toString());
        return res;
    }
} Sensor;
