// connection.js - COMPLETE SINGLE FILE
'use strict';

const { SerialPort } = require('serialport');
const { exec, spawn } = require('child_process');
const net = require('net');
const WebSocket = require('ws');
const { Buffer } = require('buffer');
const fs = require('fs');

class UniversalConnection {
    constructor(config = {}) {
        // Configuration
        this.config = {
            wsPort: config.wsPort || 8080,
            ndkPath: config.ndkPath || './hardware_bridge',
            liveViewPath: config.liveViewPath || './native_liveview',
            serialPath: config.serialPath || '/dev/ttyUSB0',
            baudRate: config.baudRate || 115200,
            autoRestart: config.autoRestart !== false,
            ...config
        };
        
        // State
        this.platform = this.detectPlatform();
        this.isConnected = false;
        this.streaming = false;
        
        // Hardware Bridges
        this.hwBridge = null;
        this.liveView = null;
        this.serial = null;
        this.wss = null;
        
        // Clients
        this.uiClients = new Set();
        this.binStore = null;
        
        // Hardware State
        this.hardwareState = {
            gpio: new Map(),
            pwm: new Map(),
            i2c: new Map(),
            spi: new Map(),
            analog: new Map(),
            devices: new Map()
        };
        
        // Buffers
        this.frameBuffer = null;
        this.commandQueue = [];
        this.processingQueue = false;
        
        // Initialize Everything
        this.initialize();
    }
    
    // ================= INITIALIZATION =================
    
    initialize() {
        console.log(`🚀 Initializing ${this.platform.toUpperCase()} Hardware Framework...`);
        
        try {
            // 1. Compile Native Components
            this.compileNativeComponents();
            
            // 2. Start WebSocket Server
            this.startWebSocketServer();
            
            // 3. Initialize Hardware
            this.initializeHardware();
            
            // 4. Initialize Live View
            this.initializeLiveView();
            
            // 5. Start Command Processor
            this.startCommandProcessor();
            
            this.isConnected = true;
            console.log('✅ Hardware Framework Ready');
            
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.cleanup();
        }
    }
    
    compileNativeComponents() {
        // Hardware Bridge (C++)
        const hwBridgeCode = `
#include <iostream>
#include <fstream>
#include <fcntl.h>
#include <linux/fb.h>
#include <sys/mman.h>
#include <sys/ioctl.h>
#include <sys/stat.h>
#include <unistd.h>
#include <thread>
#include <atomic>
#include <vector>
#include <sstream>
#include <cstring>

class HardwareBridge {
private:
    std::atomic<bool> running{true};
    int fb_fd = -1;
    char* fb_ptr = nullptr;
    long screen_size = 0;
    int width = 0, height = 0, bpp = 0;
    
public:
    void run() {
        std::cout << "HWBRIDGE:READY" << std::endl;
        
        // Try to initialize framebuffer
        initFramebuffer();
        
        std::string cmd;
        while (running && std::getline(std::cin, cmd)) {
            processCommand(cmd);
        }
    }
    
    void initFramebuffer() {
        fb_fd = open("/dev/graphics/fb0", O_RDWR);
        if (fb_fd == -1) fb_fd = open("/dev/fb0", O_RDWR);
        
        if (fb_fd != -1) {
            struct fb_var_screeninfo vinfo;
            ioctl(fb_fd, FBIOGET_VSCREENINFO, &vinfo);
            
            width = vinfo.xres;
            height = vinfo.yres;
            bpp = vinfo.bits_per_pixel;
            screen_size = width * height * (bpp / 8);
            
            fb_ptr = (char*)mmap(0, screen_size, PROT_READ | PROT_WRITE, MAP_SHARED, fb_fd, 0);
            
            std::cout << "FRAMEBUFFER:" << width << "x" << height << "@" << bpp << std::endl;
        } else {
            std::cout << "FRAMEBUFFER:UNAVAILABLE" << std::endl;
        }
    }
    
    void processCommand(const std::string& cmd) {
        std::istringstream iss(cmd);
        std::string type;
        iss >> type;
        
        if (type == "GPIO") {
            int pin, value;
            iss >> pin >> value;
            writeGPIO(pin, value);
            std::cout << "HW_UPDATE GPIO " << pin << " " << value << std::endl;
        }
        else if (type == "PWM") {
            int channel, duty;
            iss >> channel >> duty;
            writePWM(channel, duty);
            std::cout << "PWM_SET " << channel << ":" << duty << std::endl;
        }
        else if (type == "I2C_WRITE") {
            int addr, reg, value;
            iss >> addr >> reg >> value;
            writeI2C(addr, reg, value);
            std::cout << "I2C_WRITE " << addr << ":" << reg << ":" << value << std::endl;
        }
        else if (type == "I2C_READ") {
            int addr, reg;
            iss >> addr >> reg;
            int value = readI2C(addr, reg);
            std::cout << "I2C_READ " << addr << ":" << reg << ":" << value << std::endl;
        }
        else if (type == "SPI") {
            std::string data;
            iss >> data;
            std::string response = transferSPI(data);
            std::cout << "SPI_XFER " << data << ":" << response << std::endl;
        }
        else if (type == "DRAW") {
            int x, y, color;
            iss >> x >> y >> color;
            drawPixel(x, y, color);
            std::cout << "DRAW_ACK " << x << ":" << y << std::endl;
        }
        else if (type == "EXIT") {
            running = false;
            std::cout << "HWBRIDGE:EXITING" << std::endl;
        }
    }
    
    void writeGPIO(int pin, int value) {
        std::string path = "/sys/class/gpio/gpio" + std::to_string(pin) + "/value";
        std::ofstream file(path);
        if (file.is_open()) {
            file << value;
            file.close();
        }
    }
    
    void writePWM(int channel, int duty) {
        std::string path = "/sys/class/pwm/pwmchip0/pwm" + std::to_string(channel) + "/duty_cycle";
        std::ofstream file(path);
        if (file.is_open()) {
            file << duty;
            file.close();
        }
    }
    
    void writeI2C(int addr, int reg, int value) {
        std::string cmd = "i2cset -y 1 " + std::to_string(addr) + " " + 
                         std::to_string(reg) + " " + std::to_string(value);
        system(cmd.c_str());
    }
    
    int readI2C(int addr, int reg) {
        std::string cmd = "i2cget -y 1 " + std::to_string(addr) + " " + std::to_string(reg);
        FILE* pipe = popen(cmd.c_str(), "r");
        if (!pipe) return 0;
        
        char buffer[128];
        fgets(buffer, sizeof(buffer), pipe);
        pclose(pipe);
        
        return std::stoi(std::string(buffer), nullptr, 16);
    }
    
    std::string transferSPI(const std::string& data) {
        std::string cmd = "spidev_test -D /dev/spidev0.0 -v -p \"" + data + "\" 2>&1";
        FILE* pipe = popen(cmd.c_str(), "r");
        if (!pipe) return "ERROR";
        
        char buffer[1024];
        std::string result;
        while (fgets(buffer, sizeof(buffer), pipe)) {
            result += buffer;
        }
        pclose(pipe);
        
        return result.substr(0, 100); // Return first 100 chars
    }
    
    void drawPixel(int x, int y, unsigned int color) {
        if (!fb_ptr || x >= width || y >= height) return;
        
        long location = x * (bpp / 8) + y * width * (bpp / 8);
        
        if (bpp == 32) {
            *((unsigned int*)(fb_ptr + location)) = color;
        } else if (bpp == 24) {
            fb_ptr[location] = color & 0xFF;
            fb_ptr[location + 1] = (color >> 8) & 0xFF;
            fb_ptr[location + 2] = (color >> 16) & 0xFF;
        }
    }
    
    ~HardwareBridge() {
        if (fb_ptr) munmap(fb_ptr, screen_size);
        if (fb_fd != -1) close(fb_fd);
    }
};

int main() {
    HardwareBridge bridge;
    bridge.run();
    return 0;
}
`;
        
        // Save and compile
        fs.writeFileSync('hardware_bridge.cpp', hwBridgeCode);
        
        try {
            exec('g++ -std=c++11 -o hardware_bridge hardware_bridge.cpp -lpthread -O2', (error) => {
                if (!error) console.log('✅ Hardware Bridge Compiled');
            });
        } catch (e) {
            console.warn('⚠️ Could not compile hardware bridge');
        }
    }
    
    startWebSocketServer() {
        this.wss = new WebSocket.Server({ port: this.config.wsPort });
        
        this.wss.on('connection', (ws) => {
            this.uiClients.add(ws);
            console.log('📱 UI Client Connected');
            
            // Send welcome message
            ws.send(JSON.stringify({
                type: 'CONNECTED',
                platform: this.platform,
                timestamp: Date.now()
            }));
            
            // Send current hardware state
            this.sendFullState(ws);
            
            ws.on('message', (message) => {
                this.handleUIMessage(message.toString(), ws);
            });
            
            ws.on('close', () => {
                this.uiClients.delete(ws);
                console.log('📱 UI Client Disconnected');
            });
        });
        
        console.log(`🌐 WebSocket Server running on port ${this.config.wsPort}`);
    }
    
    initializeHardware() {
        switch(this.platform) {
            case 'android':
                this.startAndroidBridge();
                break;
            case 'rpi':
            case 'linux':
                this.startLinuxBridge();
                break;
            case 'mcu':
                this.startMCUBridge();
                break;
            default:
                console.log('⚠️ Running in simulation mode');
                this.startSimulation();
        }
    }
    
    startAndroidBridge() {
        this.hwBridge = spawn(this.config.ndkPath, [], {
            stdio: ['pipe', 'pipe', 'pipe']
        });
        
        this.hwBridge.stdout.on('data', (data) => {
            this.processBridgeOutput(data.toString());
        });
        
        this.hwBridge.stderr.on('data', (data) => {
            console.error('[HW_ERROR]', data.toString());
        });
        
        this.hwBridge.on('close', (code) => {
            console.warn(`Hardware bridge closed with code ${code}`);
            if (this.config.autoRestart) {
                setTimeout(() => this.startAndroidBridge(), 1000);
            }
        });
    }
    
    startLinuxBridge() {
        // Direct hardware access for Raspberry Pi/Linux
        console.log('🍓 Using direct hardware access');
        
        // Test hardware availability
        this.testHardware();
    }
    
    startMCUBridge() {
        this.serial = new SerialPort({
            path: this.config.serialPath,
            baudRate: this.config.baudRate
        });
        
        this.serial.on('data', (data) => {
            this.processSerialData(data);
        });
        
        this.serial.on('open', () => {
            console.log('🔌 Serial port opened');
        });
    }
    
    initializeLiveView() {
        if (this.platform === 'android' || this.platform === 'rpi') {
            try {
                this.liveView = spawn(this.config.liveViewPath, [], {
                    stdio: ['pipe', 'pipe', 'pipe']
                });
                
                this.liveView.stdout.on('data', (data) => {
                    const output = data.toString().trim();
                    if (output.startsWith('FRAMEBUFFER:')) {
                        this.broadcastToUI({
                            type: 'LIVEVIEW_INFO',
                            info: output.split(':')[1]
                        });
                    }
                });
                
                console.log('📺 Live View Initialized');
                
            } catch (error) {
                console.warn('Live View not available:', error.message);
            }
        }
    }
    
    startCommandProcessor() {
        // Process queued commands every 10ms
        setInterval(() => {
            if (this.commandQueue.length > 0 && !this.processingQueue) {
                this.processingQueue = true;
                const command = this.commandQueue.shift();
                this.executeCommand(command);
                this.processingQueue = false;
            }
        }, 10);
    }
    
    // ================= HARDWARE OPERATIONS =================
    
    executeCommand(command) {
        const { type, params, callback } = command;
        
        switch(type) {
            case 'GPIO_SET':
                this.gpioWrite(params.pin, params.value);
                break;
            case 'GPIO_READ':
                this.gpioRead(params.pin, callback);
                break;
            case 'PWM_SET':
                this.pwmWrite(params.channel, params.duty);
                break;
            case 'I2C_WRITE':
                this.i2cWrite(params.address, params.register, params.data);
                break;
            case 'I2C_READ':
                this.i2cRead(params.address, params.register, callback);
                break;
            case 'SPI_TRANSFER':
                this.spiTransfer(params.data, callback);
                break;
            case 'ANALOG_READ':
                this.analogRead(params.channel, callback);
                break;
            case 'DRAW_PIXEL':
                this.drawPixel(params.x, params.y, params.color);
                break;
            case 'CAPTURE_FRAME':
                this.captureFrame(callback);
                break;
        }
    }
    
    gpioWrite(pin, value) {
        const command = `GPIO ${pin} ${value}\n`;
        
        if (this.platform === 'android' && this.hwBridge) {
            this.hwBridge.stdin.write(command);
        }
        else if (this.platform === 'rpi') {
            exec(`echo ${value} > /sys/class/gpio/gpio${pin}/value`);
        }
        else if (this.serial) {
            this.serial.write(`GPIO ${pin} ${value}\n`);
        }
        
        // Update state and broadcast
        this.hardwareState.gpio.set(pin, value);
        this.broadcastToUI({
            type: 'GPIO_UPDATE',
            pin: pin,
            value: value,
            timestamp: Date.now()
        });
    }
    
    gpioRead(pin, callback) {
        if (this.platform === 'rpi') {
            exec(`cat /sys/class/gpio/gpio${pin}/value`, (error, stdout) => {
                const value = parseInt(stdout.trim());
                if (callback) callback(value);
                
                this.broadcastToUI({
                    type: 'GPIO_READ',
                    pin: pin,
                    value: value
                });
            });
        } else if (this.hwBridge) {
            this.hwBridge.stdin.write(`GPIO_READ ${pin}\n`);
            // Response will come via processBridgeOutput
        }
    }
    
    pwmWrite(channel, duty) {
        const command = `PWM ${channel} ${duty}\n`;
        
        if (this.hwBridge) {
            this.hwBridge.stdin.write(command);
        } else if (this.platform === 'rpi') {
            exec(`echo ${duty} > /sys/class/pwm/pwmchip0/pwm${channel}/duty_cycle`);
        }
        
        this.hardwareState.pwm.set(channel, duty);
        this.broadcastToUI({
            type: 'PWM_UPDATE',
            channel: channel,
            duty: duty,
            percent: ((duty / 4095) * 100).toFixed(1)
        });
    }
    
    i2cWrite(address, register, data) {
        const command = `I2C_WRITE ${address} ${register} ${data}\n`;
        
        if (this.hwBridge) {
            this.hwBridge.stdin.write(command);
        } else if (this.platform === 'rpi') {
            exec(`i2cset -y 1 ${address} ${register} ${data}`);
        }
        
        this.broadcastToUI({
            type: 'I2C_WRITE',
            address: address,
            register: register,
            data: data
        });
    }
    
    i2cRead(address, register, callback) {
        if (this.hwBridge) {
            this.hwBridge.stdin.write(`I2C_READ ${address} ${register}\n`);
        } else if (this.platform === 'rpi') {
            exec(`i2cget -y 1 ${address} ${register}`, (error, stdout) => {
                const value = parseInt(stdout, 16);
                if (callback) callback(value);
            });
        }
    }
    
    spiTransfer(data, callback) {
        const command = `SPI ${data}\n`;
        
        if (this.hwBridge) {
            this.hwBridge.stdin.write(command);
        } else if (this.platform === 'rpi') {
            exec(`spidev_test -D /dev/spidev0.0 -v -p "${data}"`, (error, stdout) => {
                if (callback) callback(stdout);
            });
        }
    }
    
    analogRead(channel, callback) {
        if (this.platform === 'rpi') {
            exec(`cat /sys/bus/iio/devices/iio\\:device0/in_voltage${channel}_raw`, 
                (error, stdout) => {
                    const value = parseInt(stdout);
                    if (callback) callback(value);
                    
                    this.broadwareState.analog.set(channel, value);
                    this.broadcastToUI({
                        type: 'ANALOG_READ',
                        channel: channel,
                        value: value
                    });
                });
        }
    }
    
    drawPixel(x, y, color) {
        if (this.liveView) {
            this.liveView.stdin.write(`DRAW ${x} ${y} ${color}\n`);
        } else if (this.hwBridge) {
            this.hwBridge.stdin.write(`DRAW ${x} ${y} ${color}\n`);
        }
    }
    
    captureFrame(callback) {
        if (this.liveView) {
            this.liveView.stdin.write('CAPTURE\n');
            // Response will come via stdout
        }
    }
    
    // ================= DATA PROCESSING =================
    
    processBridgeOutput(data) {
        const lines = data.toString().trim().split('\n');
        
        lines.forEach(line => {
            if (line.startsWith('HW_UPDATE')) {
                const [_, type, id, value] = line.split(' ');
                this.hardwareState[type.toLowerCase()].set(id, value);
                
                this.broadcastToUI({
                    type: 'HW_UPDATE',
                    hwType: type,
                    id: id,
                    value: value
                });
            }
            else if (line.startsWith('I2C_READ')) {
                const [_, addr, reg, value] = line.split(':');
                this.broadcastToUI({
                    type: 'I2C_DATA',
                    address: addr,
                    register: reg,
                    value: value
                });
            }
            else if (line.startsWith('SPI_XFER')) {
                const [_, sent, received] = line.split(' ');
                this.broadcastToUI({
                    type: 'SPI_DATA',
                    sent: sent,
                    received: received
                });
            }
            else if (line.startsWith('PWM_SET')) {
                const [_, channel, duty] = line.split(':');
                this.broadcastToUI({
                    type: 'PWM_UPDATE',
                    channel: channel,
                    duty: duty
                });
            }
            else if (line.startsWith('FRAMEBUFFER:')) {
                this.broadcastToUI({
                    type: 'LIVEVIEW_INFO',
                    info: line.split(':')[1]
                });
            }
        });
    }
    
    processSerialData(data) {
        // Process MCU serial data
        const packet = data.toString().trim();
        
        if (packet.startsWith('SENSOR:')) {
            const [_, type, value] = packet.split(':');
            this.broadcastToUI({
                type: 'SENSOR_DATA',
                sensor: type,
                value: value
            });
        }
    }
    
    // ================= UI COMMUNICATION =================
    
    broadcastToUI(data) {
        const message = JSON.stringify({
            ...data,
            timestamp: Date.now()
        });
        
        this.uiClients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
        
        // Update BinStore if connected
        if (this.binStore) {
            const address = Buffer.from(`${data.type}_${Date.now()}`);
            const value = Buffer.from(message);
            this.binStore.set(address, value);
        }
    }
    
    sendFullState(ws) {
        const state = {
            type: 'FULL_STATE',
            platform: this.platform,
            gpio: Array.from(this.hardwareState.gpio.entries()),
            pwm: Array.from(this.hardwareState.pwm.entries()),
            i2c: Array.from(this.hardwareState.i2c.entries()),
            spi: Array.from(this.hardwareState.spi.entries()),
            analog: Array.from(this.hardwareState.analog.entries()),
            connected: this.isConnected
        };
        
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(state));
        }
    }
    
    handleUIMessage(message, ws) {
        try {
            const command = JSON.parse(message);
            
            // Add to command queue
            this.commandQueue.push({
                type: command.action,
                params: command.params,
                callback: (result) => {
                    ws.send(JSON.stringify({
                        type: 'COMMAND_RESULT',
                        action: command.action,
                        result: result,
                        id: command.id
                    }));
                }
            });
            
        } catch (error) {
            console.error('UI message error:', error);
            ws.send(JSON.stringify({
                type: 'ERROR',
                message: 'Invalid command format'
            }));
        }
    }
    
    // ================= PLATFORM DETECTION =================
    
    detectPlatform() {
        if (typeof process !== 'undefined') {
            if (process.platform === 'android') return 'android';
            
            if (process.platform === 'linux') {
                try {
                    const cpuinfo = fs.readFileSync('/proc/cpuinfo', 'utf8');
                    
                    if (cpuinfo.includes('Raspberry Pi')) {
                        // Check for hardware
                        if (fs.existsSync('/dev/i2c-1')) return 'rpi';
                        return 'linux';
                    }
                    
                    // Check for MCU connection
                    if (fs.existsSync('/dev/ttyUSB0') || fs.existsSync('/dev/ttyACM0')) {
                        return 'mcu';
                    }
                    
                } catch (e) {
                    // Ignore
                }
            }
        }
        
        return 'simulation';
    }
    
    testHardware() {
        console.log('🔍 Testing hardware availability...');
        
        const tests = [
            { name: 'GPIO', path: '/sys/class/gpio/export', test: 'ls' },
            { name: 'I2C', path: '/dev/i2c-1', test: 'i2cdetect -y 1' },
            { name: 'SPI', path: '/dev/spidev0.0', test: 'ls' },
            { name: 'PWM', path: '/sys/class/pwm', test: 'ls' }
        ];
        
        tests.forEach(test => {
            if (fs.existsSync(test.path)) {
                console.log(`✅ ${test.name} available`);
            } else {
                console.log(`❌ ${test.name} not available`);
            }
        });
    }
    
    // ================= BINSTORE INTEGRATION =================
    
    linkBinStore(binStore) {
        this.binStore = binStore;
        
        // Listen for BinStore changes
        binStore.on('change', (change) => {
            this.handleBinStoreChange(change);
        });
        
        console.log('🔗 BinStore linked');
    }
    
    handleBinStoreChange(change) {
        const address = change.address.toString();
        const data = change.data;
        
        // Parse address to determine action
        if (address.startsWith('gpio')) {
            const pin = parseInt(address.replace('gpio', ''));
            const value = data[0];
            this.gpioWrite(pin, value);
        }
        else if (address.startsWith('i2c_')) {
            const parts = address.split('_');
            this.i2cWrite(parseInt(parts[1]), parseInt(parts[2]), data.toString('hex'));
        }
        else if (address.startsWith('pwm')) {
            const channel = parseInt(address.replace('pwm', ''));
            const duty = data.readUInt16BE(0);
            this.pwmWrite(channel, duty);
        }
    }
    
    // ================= LIVE VIEW CONTROLS =================
    
    startLiveStream() {
        if (!this.liveView) {
            console.warn('Live View not available');
            return;
        }
        
        this.streaming = true;
        this.liveView.stdin.write('STREAM_START\n');
        
        console.log('📡 Live streaming started');
        this.broadcastToUI({ type: 'STREAM_STARTED' });
    }
    
    stopLiveStream() {
        this.streaming = false;
        if (this.liveView) {
            this.liveView.stdin.write('STREAM_STOP\n');
        }
        
        console.log('📡 Live streaming stopped');
        this.broadcastToUI({ type: 'STREAM_STOPPED' });
    }
    
    captureScreenshot() {
        if (this.liveView) {
            this.liveView.stdin.write('CAPTURE_SCREEN\n');
        }
    }
    
    // ================= UTILITY METHODS =================
    
    queueCommand(action, params) {
        return new Promise((resolve) => {
            this.commandQueue.push({
                type: action,
                params: params,
                callback: resolve
            });
        });
    }
    
    getHardwareState() {
        return {
            gpio: Object.fromEntries(this.hardwareState.gpio),
            pwm: Object.fromEntries(this.hardwareState.pwm),
            i2c: Object.fromEntries(this.hardwareState.i2c),
            spi: Object.fromEntries(this.hardwareState.spi),
            analog: Object.fromEntries(this.hardwareState.analog)
        };
    }
    
    // ================= CLEANUP =================
    
    cleanup() {
        console.log('🛑 Cleaning up hardware framework...');
        
        // Stop streaming
        this.stopLiveStream();
        
        // Close WebSocket
        if (this.wss) {
            this.wss.close();
        }
        
        // Kill hardware bridge
        if (this.hwBridge && !this.hwBridge.killed) {
            this.hwBridge.stdin.write('EXIT\n');
            setTimeout(() => {
                if (!this.hwBridge.killed) {
                    this.hwBridge.kill();
                }
            }, 500);
        }
        
        // Kill live view
        if (this.liveView && !this.liveView.killed) {
            this.liveView.kill();
        }
        
        // Close serial port
        if (this.serial && this.serial.isOpen) {
            this.serial.close();
        }
        
        // Clear clients
        this.uiClients.clear();
        
        this.isConnected = false;
        console.log('✅ Cleanup complete');
    }
    
    // ================= SIMULATION MODE =================
    
    startSimulation() {
        console.log('🎮 Starting hardware simulation');
        
        // Simulate hardware responses
        setInterval(() => {
            if (this.uiClients.size > 0) {
                // Simulate sensor data
                const simulatedData = {
                    type: 'SIMULATED_DATA',
                    temperature: 25 + Math.random() * 5,
                    humidity: 50 + Math.random() * 20,
                    light: Math.random() * 100,
                    timestamp: Date.now()
                };
                
                this.broadcastToUI(simulatedData);
            }
        }, 1000);
    }
}

module.exports = UniversalConnection;

// Auto-start if run directly
if (require.main === module) {
    const connection = new UniversalConnection();
    
    // Handle shutdown
    process.on('SIGINT', () => {
        connection.cleanup();
        process.exit(0);
    });
    
    process.on('SIGTERM', () => {
        connection.cleanup();
        process.exit(0);
    });
}