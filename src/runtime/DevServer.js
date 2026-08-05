'use strict';

const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const { EventEmitter } = require('events');
const net = require('net');
const dgram = require('dgram');


class DolphinServer extends EventEmitter {
    constructor(options) {
        super();
        this.host = options.host || '0.0.0.0';
        this.port = options.port || 9091;
        this.devices = new Map();
        this.server = net.createServer((socket) => {
            const id = Math.random().toString(36).substring(7);
            const addr = socket.remoteAddress;
            const device = { id, addr, status: 'CONNECTED', socket };
            this.devices.set(id, device);
            
            this.emit('deviceConnected', { id, addr });

            let accumulated = Buffer.alloc(0);

            socket.on('data', (data) => {
                accumulated = Buffer.concat([accumulated, data]);

                while (accumulated.length >= 5) {
                    const cmd = accumulated[0];
                    const payLen = accumulated.readUInt32LE(1);

                    if (accumulated.length >= 5 + payLen) {
                        const payload = accumulated.slice(5, 5 + payLen);

                        if (cmd === 0x06 /* ACK */) {
                            this.emit('ack', id, payload.toString());
                        } else if (cmd === 0x07 /* ACTION */) {
                            const actionLen = payload[0];
                            const action = payload.slice(1, 1 + actionLen).toString();
                            const value = payload.slice(1 + actionLen).toString();
                            this.emit('deviceAction', { id, action, value });
                        } else if (cmd === 0x05 /* PONG */) {
                            // ignore
                        }

                        accumulated = accumulated.slice(5 + payLen);
                    } else {
                        break;
                    }
                }
            });

            socket.on('error', () => {});
            socket.on('close', () => {
                this.devices.delete(id);
                this.emit('deviceDisconnected', id);
            });
        });
        
        // ping heartbeat to prevent closing
        setInterval(() => {
            const pingMsg = Buffer.from([0x04, 0, 0, 0, 0]);
            for (const dev of this.devices.values()) {
                try { dev.socket.write(pingMsg); } catch(e) {}
            }
        }, 8000);
    }
    
    start() {
        this.server.listen(this.port, this.host, () => {
            const localIP = this.host === '0.0.0.0' ? 'Local IP' : this.host;
            console.log(`✅ TCP Server listening on ${this.host}:${this.port}`);
        });
    }
    
    sendToDevice(id, data, opcode) {
        const header = Buffer.alloc(5);
        header.writeUInt8(opcode, 0);
        header.writeUInt32LE(data ? data.length : 0, 1);
        const payload = data ? Buffer.concat([header, data]) : header;

        if (id) {
            const device = this.devices.get(id);
            if (device) {
                try { device.socket.write(payload); } catch(e) {}
            }
        } else {
            for (const device of this.devices.values()) {
                try { device.socket.write(payload); } catch(e) {}
            }
        }
    }

    /**
     * Targeted patch for a single component
     */
    patchComponent(deviceId, index, titanBinary) {
        const payload = Buffer.alloc(2 + 24);
        payload.writeUInt16LE(index, 0);
        Buffer.from(titanBinary).copy(payload, 2);
        this.sendToDevice(deviceId, payload, 0x03 /* PATCH_COMPONENT */);
    }

    /**
     * Broadcast state update to a device
     */
    patchState(deviceId, key, value) {
        const keyBuf = Buffer.from(key, 'utf8');
        const valStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
        const valBuf = Buffer.from(valStr, 'utf8');
        const payload = Buffer.alloc(1 + keyBuf.length + valBuf.length);
        
        payload[0] = keyBuf.length;
        keyBuf.copy(payload, 1);
        valBuf.copy(payload, 1 + keyBuf.length);
        
        this.sendToDevice(deviceId, payload, 0x08 /* PATCH_STATE */);
    }

    /**
     * Patch a single screen for all devices or specific device
     */
    patchScreen(deviceId, name, screen) {
        const nameBuf = Buffer.from(name, 'utf8');
        const binary = screen.binary; // 24-byte components
        const rawData = screen.rawData || Buffer.alloc(0);
        
        // Protocol for PATCH_SCREEN (0x02):
        // [1 byte nameLen] [N bytes name] [4 bytes compCount] [4 bytes rawDataLen] [M bytes components] [K bytes rawData]
        const compCount = (binary.length / 24) | 0;
        const payload = Buffer.alloc(1 + nameBuf.length + 4 + 4 + binary.length + rawData.length);
        
        payload[0] = nameBuf.length;
        nameBuf.copy(payload, 1);
        payload.writeUInt32LE(compCount, 1 + nameBuf.length);
        payload.writeUInt32LE(rawData.length, 1 + nameBuf.length + 4);
        binary.copy(payload, 1 + nameBuf.length + 8);
        rawData.copy(payload, 1 + nameBuf.length + 8 + binary.length);
        
        if (deviceId) {
            this.sendToDevice(deviceId, payload, 0x02 /* PATCH_SCREEN */);
        } else {
            this.broadcast(payload, 0x02 /* PATCH_SCREEN */);
        }
    }
    
    broadcast(data, opcode) {
        let sent = 0;
        const header = Buffer.alloc(5);
        header.writeUInt8(opcode, 0);
        header.writeUInt32LE(data ? data.length : 0, 1);
        const payload = data ? Buffer.concat([header, data]) : header;
        
        for (const dev of this.devices.values()) {
            try { 
                dev.socket.write(payload); 
                sent++;
            } catch(e) {}
        }
        return sent;
    }
    
    getConnectedDevices() {
        return Array.from(this.devices.values()).map(d => ({ id: d.id, addr: d.addr, status: d.status }));
    }

    /**
     * Send a navigation command to a device
     */
    navigateToScreen(deviceId, screenName) {
        const payload = Buffer.from(screenName, 'utf8');
        this.sendToDevice(deviceId, payload, 0x0A /* NAVIGATE_TO */);
    }

    /**
     * Send an open drawer command to a device with specific drawer name
     */
    openDrawer(deviceId, drawerName = 'MainDrawer') {
        const payload = Buffer.from(drawerName, 'utf8');
        console.log(`📡 Sending OPEN_DRAWER (0x0C) to device ${deviceId}...`);
        this.sendToDevice(deviceId, payload, 0x0C /* OPEN_DRAWER */);
        
        // Alternative method for some versions: Send as a string action
        const actionPayload = Buffer.from(`DRAWER:${drawerName}`, 'utf8');
        this.sendToDevice(deviceId, actionPayload, 0x07 /* COMMAND */);
    }
}

class DevServer extends EventEmitter {
    constructor(options = {}) {
        super();
        this.host = options.host || '0.0.0.0';
        this.port = options.port || 9091;
        this.httpPort = options.httpPort || 9090;
        this.watchDir = options.watchDir || process.cwd();
        
        this.server = new DolphinServer({ host: this.host, port: this.port });
        this.httpServer = null;
        
        this._bundle = null;
        this._patchCount = 0;
        this._ackCount = 0;
        this._startTime = Date.now();
        
        this._sseClients = new Set();
        this.deviceScreens = {}; // Tracks currently active screen for each connected device
        global.dolphinDevServer = this;
    }

    patchState(deviceId, key, value) {
        const keyBuf = Buffer.from(String(key), 'utf8');
        const valBuf = Buffer.from(String(value !== undefined && value !== null ? value : ''), 'utf8');
        const payload = Buffer.alloc(1 + keyBuf.length + valBuf.length);
        payload.writeUInt8(keyBuf.length, 0);
        keyBuf.copy(payload, 1);
        valBuf.copy(payload, 1 + keyBuf.length);
        if (deviceId) {
            this.server.sendToDevice(deviceId, payload, 0x08 /* PATCH_STATE */);
        } else {
            this.server.broadcast(payload, 0x08 /* PATCH_STATE */);
        }
    }

    _getWebInitialState(screenName = 'Home') {
        let initialState = { activeNav: screenName, activeTab: screenName };
        try {
            // Try multiple store file locations (in priority order)
            const storePaths = [
                path.join(this.watchDir, 'store', 'appStore.js'),
                path.join(this.watchDir, 'store', 'index.js'),
                path.join(this.watchDir, 'store.js'),
                path.join(this.watchDir, '..', 'store', 'index.js'),
                path.join(this.watchDir, '..', 'store.js')
            ];

            for (const storePath of storePaths) {
                if (fs.existsSync(storePath)) {
                    delete require.cache[require.resolve(storePath)];
                    const storeModule = require(storePath);
                    
                    // Try to extract store object (support multiple patterns)
                    const storeObj = storeModule.default || storeModule.appStore || storeModule.nanoStore || storeModule.store || storeModule;
                    
                    // NanoStore / createStore pattern - has .get() method
                    if (storeObj && typeof storeObj.get === 'function') {
                        // Check if get() returns full state object (NanoStore pattern)
                        const stateData = storeObj.get();
                        if (stateData && typeof stateData === 'object') {
                            initialState = { ...stateData, activeNav: screenName, activeTab: screenName };
                        }
                        
                        // Set navigation state if setter exists
                        if (typeof storeObj.set === 'function') {
                            storeObj.set('activeNav', screenName);
                        }
                    }
                    
                    // Handle activeTabAtom (Atom pattern)
                    if (storeModule.activeTabAtom && typeof storeModule.activeTabAtom.set === 'function') {
                        storeModule.activeTabAtom.set(screenName);
                        if (typeof storeModule.activeTabAtom.get === 'function') {
                            initialState.activeTab = storeModule.activeTabAtom.get();
                        }
                    }
                    
                    // Successfully loaded store, stop searching
                    break;
                }
            }
        } catch (e) {
            // Silently fail - web will use empty initial state
        }
        return initialState;
    }

    async start() {
        this.server.start();
        this._startUDPDiscovery();
        
        // Device events from module
        this.server.on('deviceConnected', (device) => {
            console.log(`✅ Device ${device.id} connected (${device.addr})`);
            if (this._bundle) {
                this.server.sendToDevice(device.id, this._bundle, 0x01); // FULL_RELOAD
            }
            this._notify();
        });

        this.server.on('deviceDisconnected', (id) => {
            console.log(`Log: Device ${id} disconnected`);
            delete this.deviceScreens[id];
            this._notify();
        });

        this.server.on('deviceAction', ({ id, action, value }) => {
            if (action.startsWith('nav:')) {
                const screenName = action.substring(4);
                this.deviceScreens[id] = screenName;
                console.log(`📌 Device ${id} navigated to screen: ${screenName}`);
            } else if (action === 'diagnostics:logcat') {
                console.log(`\n================ 📱 REALTIME DEVICE LOGCAT (${id}) ================`);
                console.log(value);
                console.log(`===================================================================\n`);
                try {
                    const logDir = path.join(this.watchDir, 'logs');
                    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
                    fs.writeFileSync(path.join(logDir, 'device_logcat.txt'), value, 'utf8');
                } catch (e) {
                    console.error('Failed to save logcat to file:', e.message);
                }
            }
        });

        this.server.on('ack', (id, msg) => {
            this._ackCount++;
            console.log(`⚡ ACK from ${id}: ${msg}`);
            this._notify();
        });

        this._startHTTP();
        this._watchFiles();
        
        const localIP = this._getLocalIP();
        console.log('🌊 DOLPHIN DEV SERVER');
        console.log('─────────────────────────────');
        console.log(`TCP:    ${localIP}:${this.port}  (Enter this in Mobile App)`);
        console.log(`HTTP:   http://${localIP}:${this.httpPort} (Dashboard)`);
        console.log(`UDP:    Auto-Discovery on port 9092 (devices find you automatically)`);
        
        this.emit('ready');
    }

    _startUDPDiscovery() {
        const DISCOVERY_PORT = 9092;
        const udpServer = dgram.createSocket('udp4');

        udpServer.on('error', (err) => {
            console.error(`⚠️  UDP Discovery error: ${err.message}`);
            udpServer.close();
        });

        udpServer.on('message', (msg, rinfo) => {
            const text = msg.toString().trim();
            if (text === 'DOLPHIN_DISCOVER') {
                const localIP = this._getLocalIP();
                const reply = Buffer.from(`DOLPHIN_OFFER:ip=${localIP};tcpPort=${this.port};httpPort=${this.httpPort}`);
                udpServer.send(reply, rinfo.port, rinfo.address, (err) => {
                    if (!err) {
                        console.log(`📡 UDP Discovery: Responded to ${rinfo.address} → ip=${localIP};tcpPort=${this.port};httpPort=${this.httpPort}`);
                    }
                });
            }
        });

        udpServer.bind(DISCOVERY_PORT, '0.0.0.0', () => {
            udpServer.setBroadcast(true);
            console.log(`✅ UDP Auto-Discovery listening on port ${DISCOVERY_PORT}`);
        });

        this._udpServer = udpServer;
    }


    _startHTTP() {
        // In-memory device registry + audio queues for the intercom relay
        const intercomDevices = new Map();

        const readBody = (req, cb) => {
            const chunks = [];
            req.on('data', c => chunks.push(c));
            req.on('end', () => cb(Buffer.concat(chunks).toString('utf8')));
        };

        const cors = (res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Device-Id, X-Target-Id');
        };

        this.httpServer = http.createServer((req, res) => {
            if (req.method === 'OPTIONS') { cors(res); res.writeHead(204); res.end(); return; }
            if (!req.url.startsWith('/api/dolphin/server')) {
                console.log(`   🌐 HTTP: ${req.method} ${req.url}`);
            }
            const url = req.url.split('?')[0];
            
            if (url === '/hexdump' || url === '/inspect') {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(this._renderHexdump());
                return;
            }
            if (url === '/logcat') {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(this._renderLogcatPage());
                return;
            }
            if (url === '/api/dolphin/logcat') {
                cors(res);
                res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                const logPath = path.join(this.watchDir, 'logs', 'device_logcat.txt');
                let logs = 'No logs received yet. Open app and make a change.';
                if (fs.existsSync(logPath)) {
                    logs = fs.readFileSync(logPath, 'utf8');
                }
                res.end(logs);
                return;
            }

            const isWebRoute = (url === '/' || url === '/app' || url === '/web' || url === '/about' || url === '/products' || url === '/contact') || (!url.includes('.') && !url.startsWith('/api/') && !url.startsWith('/events') && !url.startsWith('/dist') && !url.startsWith('/download') && url !== '/dashboard' && url !== '/admin' && url !== '/hexdump' && url !== '/inspect' && url !== '/logcat' && url !== '/download-apk');

            if (isWebRoute) {
                const DolphinWebEngine = require('../web/DolphinWebEngine');
                const CdnAssetFetcher  = require('../compiler/CdnAssetFetcher');
                const pagesDir = path.resolve(this.watchDir, 'pages');
                // Resolve local CDN paths synchronously (files already downloaded at build time)
                const localCdnPaths = CdnAssetFetcher.resolveLocalPaths(this.watchDir);
                // Kick off background download if any missing (non-blocking)
                CdnAssetFetcher.ensureDownloaded(this.watchDir).catch(() => {});
                let htmlContent = '';
                if (fs.existsSync(pagesDir)) {
                    const pageFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx') || f.endsWith('.js'));
                    if (pageFiles.length > 0) {
                        try {
                            const cleanPath = (url === '/' || url === '/app' || url === '/web') ? 'home' : url.replace(/^\//, '').toLowerCase();
                            const matchedFile = pageFiles.find(f => {
                                const base = f.replace(/\.(jsx|js)$/i, '').toLowerCase();
                                return base === cleanPath || base === `${cleanPath}screen` || base === cleanPath.replace(/screen$/, '');
                            }) || pageFiles[0];

                            const pagePath = path.join(pagesDir, matchedFile);
                            delete require.cache[require.resolve(pagePath)];
                            const pageModule = require(pagePath);
                            const compFunc = Object.values(pageModule)[0];
                            if (typeof compFunc === 'function') {
                                const vnode = compFunc();
                                const pageName = matchedFile.replace(/\.(jsx|js)$/i, '');
                                const screenName = pageName.replace(/Screen$/i, '') || 'Home';
                                let initialState = this._getWebInitialState(screenName);
                                htmlContent = DolphinWebEngine.renderToWebHTML(vnode, {
                                    title: `Dolphin Native — ${pageName}`,
                                    description: `Live ${pageName} Web Page rendered by Dolphin Native Engine`
                                }, initialState, localCdnPaths);

                                // Inject Live SSE Hot-reload snippet before </body>
                                const hotreloadScript = `
                                <script>
                                  window.addEventListener('load', function() {
                                    setTimeout(function() {
                                      const es = new EventSource('/events');
                                      es.onmessage = function(e) {
                                        try {
                                          const data = JSON.parse(e.data);
                                          if (data.type === 'reload' || data.type === 'patch') {
                                            location.reload();
                                          }
                                        } catch(err) {}
                                      };
                                    }, 200);
                                  });
                                </script>
                                </body>`;
                                htmlContent = htmlContent.replace('</body>', hotreloadScript);
                            }
                        } catch(e) {}
                    }
                }
                if (htmlContent) {
                    res.writeHead(200, { 
                        'Content-Type': 'text/html; charset=utf-8',
                        'Cache-Control': 'no-cache, no-store, must-revalidate'
                    });
                    res.end(htmlContent);
                    return;
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Page not found');
                    return;
                }
            } else if (url === '/dashboard' || url === '/admin') {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(this._renderDashboard());
            } else if (url === '/hexdump' || url === '/inspect') {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(this._renderHexdump());
            } else if (url === '/api/dolphin/snapshot') {
                cors(res);
                this._savedSnapshot = this._bundle ? Buffer.from(this._bundle) : null;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, size: this._savedSnapshot ? this._savedSnapshot.length : 0 }));
            } else if (url === '/api/dolphin/server') {
                cors(res);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                const localIP = this._getLocalIP();
                const apkInfo = this._findLatestApk();

                const deviceArray = this.server.getConnectedDevices().map(d => ({
                    id: d.id,
                    addr: d.addr,
                    screen: this.deviceScreens[d.id] || 'Home',
                    connectedAt: Date.now()
                }));
                res.end(JSON.stringify({
                    ips: [localIP],
                    tcpPort: this.port,
                    relayPort: 9092,
                    httpPort: this.httpPort,
                    bundleSize: this._bundle ? this._bundle.length : 0,
                    apkName: apkInfo ? apkInfo.file : null,
                    apkSize: apkInfo ? apkInfo.stat.size : 0,
                    apkMtime: apkInfo ? new Date(apkInfo.stat.mtime).toISOString() : null,
                    devices: deviceArray
                }));
            } else if (url.startsWith('/assets/') || url.includes('.')) {
                cors(res);
                const relPath = url.startsWith('/') ? url.slice(1) : url;
                const candidatePaths = [
                    path.join(this.watchDir, relPath),
                    path.join(process.cwd(), relPath),
                    path.join(this.watchDir, 'assets', relPath.replace(/^assets\//, '')),
                    path.join(process.cwd(), 'assets', relPath.replace(/^assets\//, '')),
                ];
                const foundFile = candidatePaths.find(p => {
                    try { return fs.existsSync(p) && fs.statSync(p).isFile(); } catch(e) { return false; }
                });
                if (foundFile) {
                    const ext = path.extname(foundFile).toLowerCase();
                    const stat = fs.statSync(foundFile);
                    const fileSize = stat.size;
                    const mimeTypes = {
                        '.jpg': 'image/jpeg',
                        '.jpeg': 'image/jpeg',
                        '.png': 'image/png',
                        '.gif': 'image/gif',
                        '.webp': 'image/webp',
                        '.svg': 'image/svg+xml',
                        '.mp4': 'video/mp4',
                        '.ttf': 'font/ttf',
                        '.woff': 'font/woff'
                    };
                    const contentType = mimeTypes[ext] || 'application/octet-stream';
                    const range = req.headers.range;

                    if (range && ext === '.mp4') {
                        const parts = range.replace(/bytes=/, "").split("-");
                        const start = parseInt(parts[0], 10);
                        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                        const chunksize = (end - start) + 1;
                        const file = fs.createReadStream(foundFile, { start, end });
                        res.writeHead(206, {
                            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                            'Accept-Ranges': 'bytes',
                            'Content-Length': chunksize,
                            'Content-Type': contentType,
                        });
                        file.pipe(res);
                    } else {
                        res.writeHead(200, {
                            'Content-Length': fileSize,
                            'Content-Type': contentType,
                            'Accept-Ranges': 'bytes'
                        });
                        fs.createReadStream(foundFile).pipe(res);
                    }
                } else {
                    res.writeHead(404);
                    res.end('Asset file not found');
                }
            } else if (url === '/download-apk') {
                const apkInfo = this._findLatestApk();
                if (apkInfo && fs.existsSync(apkInfo.path)) {
                    res.writeHead(200, {
                        'Content-Type': 'application/vnd.android.package-archive',
                        'Content-Disposition': `attachment; filename="${apkInfo.file}"`
                    });
                    fs.createReadStream(apkInfo.path).pipe(res);
                } else {
                    res.writeHead(404);
                    res.end('APK not built yet. Run dolphin android build');
                }
            } else if (url === '/web' || url === '/app') {
                const DolphinWebEngine = require('../web/DolphinWebEngine');
                const CdnAssetFetcher2  = require('../compiler/CdnAssetFetcher');
                const localCdnPaths2 = CdnAssetFetcher2.resolveLocalPaths(this.watchDir);
                CdnAssetFetcher2.ensureDownloaded(this.watchDir).catch(() => {});
                const pagesDir2 = path.resolve(this.watchDir, 'pages');
                let htmlContent = '';
                if (fs.existsSync(pagesDir2)) {
                    const pageFiles = fs.readdirSync(pagesDir2).filter(f => f.endsWith('.jsx') || f.endsWith('.js'));
                    if (pageFiles.length > 0) {
                        try {
                            const homePagePath = path.join(pagesDir2, pageFiles[0]);
                            delete require.cache[require.resolve(homePagePath)];
                            const pageModule = require(homePagePath);
                            const compFunc = Object.values(pageModule)[0];
                            if (typeof compFunc === 'function') {
                                const vnode = compFunc();
                                let initialState = this._getWebInitialState('Home');
                                htmlContent = DolphinWebEngine.renderToWebHTML(vnode, {
                                    title: 'Dolphin Web App (Live Hotpatch)',
                                    description: 'Live Dual-Target Web Render'
                                }, initialState, localCdnPaths2);
                                // Inject Live SSE Hot-reload snippet before </body>
                                const hotreloadScript = `
                                <script>
                                  window.addEventListener('load', function() {
                                    setTimeout(function() {
                                      const es = new EventSource('/events');
                                      es.onmessage = function(e) {
                                        try {
                                          const data = JSON.parse(e.data);
                                          if (data.type === 'reload' || data.type === 'patch') {
                                            location.reload();
                                          }
                                        } catch(err) {}
                                      };
                                    }, 200);
                                  });
                                </script>
                                </body>`;
                                htmlContent = htmlContent.replace('</body>', hotreloadScript);
                            }
                        } catch(e) {}
                    }
                }
                if (htmlContent) {
                    res.writeHead(200, { 
                        'Content-Type': 'text/html; charset=utf-8',
                        'Cache-Control': 'no-cache, no-store, must-revalidate'
                    });
                    res.end(htmlContent);
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Live Web App not available');
                }
            } else if (url === '/api/action' && req.method === 'POST') {
                let body = '';
                req.on('data', chunk => { body += chunk.toString(); });
                req.on('end', () => {
                    try {
                        const payload = JSON.parse(body);
                        const { action, value } = payload;
                        if (action) {
                            console.log(`🌐 [Web Action] ${action}`);
                            this.emit('deviceAction', { id: 'web-browser', action, value });
                            setTimeout(() => this._notify(), 50);
                        }
                        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                        res.end(JSON.stringify({ success: true, action }));
                    } catch(err) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: err.message }));
                    }
                });
            } else if (url === '/status') {
                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify(this._getStatus()));
            } else if (url === '/events') {
                res.writeHead(200, {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'Access-Control-Allow-Origin': '*',
                    'X-Accel-Buffering': 'no'
                });
                this._sseClients.add(res);
                res.write(`data: ${JSON.stringify(this._getStatus())}\n\n`);
                
                const keepAlive = setInterval(() => {
                    try { res.write(`: ping\n\n`); } catch(e) { 
                        clearInterval(keepAlive);
                        this._sseClients.delete(res);
                    }
                }, 20000);
                
                req.on('close', () => {
                    clearInterval(keepAlive);
                    this._sseClients.delete(res);
                });
            } else if (url === '/simulator') {
                const simPath = path.join(this.watchDir, 'simulator.html');
                if (fs.existsSync(simPath)) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    fs.createReadStream(simPath).pipe(res);
                } else {
                    const fallbackSimPath = path.join(__dirname, 'simulator.html');
                    if (fs.existsSync(fallbackSimPath)) {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        fs.createReadStream(fallbackSimPath).pipe(res);
                    } else {
                        res.writeHead(404);
                        res.end('Simulator not found');
                    }
                }
            } else if (url === '/bundle') {
                if (this._bundle) {
                    res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
                    res.end(this._bundle);
                } else {
                    res.writeHead(404);
                    res.end('No bundle yet');
                }
            } else if (url.startsWith('/dist/') || url === '/download-apk' || url.endsWith('.apk')) {
                const apkInfo = this._findLatestApk();
                if (apkInfo && fs.existsSync(apkInfo.path)) {
                    res.writeHead(200, {
                        'Content-Type': 'application/vnd.android.package-archive',
                        'Content-Length': apkInfo.stat.size,
                        'Content-Disposition': `attachment; filename="${apkInfo.file}"`
                    });
                    fs.createReadStream(apkInfo.path).pipe(res);
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('APK file not found. Please run: dolphin build --android');
                }
            } else if (url === '/inspect') {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(this._renderInspector());
            } else if (url === '/inspect/json') {
                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                if (!this._bundle) {
                    res.end(JSON.stringify({ error: 'No bundle loaded' }));
                } else {
                    const bytes = this._bundle;
                    const scrCount = bytes.readUInt16LE(8);
                    const compCount = bytes.readUInt16LE(10);
                    let cursor = 20;
                    for (let i = 0; i < scrCount; i++) {
                        const nameLen = bytes[cursor++];
                        cursor += nameLen;
                        cursor += 2;
                        cursor += 2;
                        const dataLen = bytes.readUInt32LE(cursor);
                        cursor += 4;
                        cursor += dataLen;
                    }
                    const comps = [];
                    for (let i = 0; i < compCount; i++) {
                        if (cursor + 16 > bytes.length - 4) break;
                        const bin = bytes.slice(cursor, cursor + 16);
                        comps.push(this._decodeBinary(bin, i));
                        cursor += 16;
                    }
                    res.end(JSON.stringify(comps, null, 2));
                }
            } else if (url === '/debug/screens') {
                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                if (!this._bundle) {
                    res.end(JSON.stringify({ error: 'No bundle loaded' }));
                } else {
                    const bytes = this._bundle;
                    const scrCount = bytes.readUInt16LE(8);
                    let cursor = 20;
                    const screens = [];
                    for (let i = 0; i < scrCount; i++) {
                        const nameLen = bytes[cursor++];
                        const name = bytes.slice(cursor, cursor + nameLen).toString('utf8');
                        cursor += nameLen;
                        const offset = bytes.readUInt16LE(cursor);
                        cursor += 2;
                        const count = bytes.readUInt16LE(cursor);
                        cursor += 2;
                        const dataLen = bytes.readUInt32LE(cursor);
                        cursor += 4;
                        cursor += dataLen;
                        screens.push({ name, offset, count, dataLen });
                    }
                    res.end(JSON.stringify(screens, null, 2));
                }
            // ── Intercom Signaling & Audio Relay ─────────────────────────────
            // FIX: Added real audio chunk relay so Android devices can actually
            //      send and receive PCM audio during intercom calls.
            } else if (url === '/api/intercom/register' && req.method === 'POST') {
                readBody(req, (body) => {
                    try {
                        const { deviceId } = JSON.parse(body);
                        if (!deviceId) { res.writeHead(400); res.end(JSON.stringify({ success: false, error: 'deviceId required' })); return; }
                        intercomDevices.set(deviceId, { registeredAt: Date.now(), audioQueue: [] });
                        console.log(`   📟 Intercom: registered "${deviceId}"`);
                        cors(res); res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true }));
                    } catch(e) { res.writeHead(400); res.end(JSON.stringify({ success: false, error: e.message })); }
                });

            } else if (url === '/api/intercom/invite' && req.method === 'POST') {
                readBody(req, (body) => {
                    try {
                        const { from, to, message } = JSON.parse(body);
                        if (!intercomDevices.has(from)) intercomDevices.set(from, { registeredAt: Date.now(), audioQueue: [] });
                        if (!intercomDevices.has(to))   intercomDevices.set(to,   { registeredAt: Date.now(), audioQueue: [] });
                        console.log(`   📟 Intercom: "${from}" inviting "${to}"`);
                        cors(res); res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, status: 'ringing' }));
                    } catch(e) { res.writeHead(400); res.end(JSON.stringify({ success: false, error: e.message })); }
                });

            } else if (url === '/api/intercom/accept' && req.method === 'POST') {
                readBody(req, (body) => {
                    try {
                        const { from, to } = JSON.parse(body);
                        console.log(`   📟 Intercom: "${from}" accepted call from "${to}"`);
                        cors(res); res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true }));
                    } catch(e) { res.writeHead(400); res.end(JSON.stringify({ success: false, error: e.message })); }
                });

            } else if (url === '/api/intercom/end' && req.method === 'POST') {
                readBody(req, (body) => {
                    try {
                        const { from, to } = JSON.parse(body);
                        // Clear audio queues on hangup
                        if (intercomDevices.has(from)) intercomDevices.get(from).audioQueue = [];
                        if (intercomDevices.has(to))   intercomDevices.get(to).audioQueue   = [];
                        console.log(`   📟 Intercom: call ended between "${from}" and "${to}"`);
                        cors(res); res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true }));
                    } catch(e) { res.writeHead(400); res.end(JSON.stringify({ success: false, error: e.message })); }
                });

            } else if (url === '/api/intercom/audio/push' && req.method === 'POST') {
                // Android device pushes PCM audio chunk → we queue it for the peer to pull
                const senderId   = req.headers['x-device-id'] || '';
                const targetId   = req.headers['x-target-id'] || '';
                const chunks     = [];
                req.on('data', (c) => chunks.push(c));
                req.on('end', () => {
                    const pcm = Buffer.concat(chunks);
                    if (targetId && intercomDevices.has(targetId)) {
                        const peer = intercomDevices.get(targetId);
                        peer.audioQueue.push(pcm);
                        // Keep queue bounded (max ~500ms of audio at 16kHz/16bit mono)
                        if (peer.audioQueue.length > 25) peer.audioQueue.shift();
                    }
                    cors(res); res.writeHead(204); res.end();
                });

            } else if (url === '/api/intercom/audio/pull' && req.method === 'GET') {
                // Android device polls for PCM audio queued by its peer
                const myId     = req.headers['x-device-id'] || '';
                const peerId   = req.headers['x-target-id'] || '';
                if (myId && intercomDevices.has(myId)) {
                    const me = intercomDevices.get(myId);
                    if (me.audioQueue.length > 0) {
                        const chunk = me.audioQueue.shift();
                        cors(res); res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
                        res.end(chunk);
                    } else {
                        cors(res); res.writeHead(204); res.end();
                    }
                } else {
                    cors(res); res.writeHead(204); res.end();
                }

            // ── Video Call relay ──────────────────────────────────────────────
            // FIX: DolphinHardwareAPI.js defined WebRTC commands (0x40-0x44) but
            // the server had ZERO endpoints to relay video signaling or frames.
            // These endpoints match DolphinVideoCall.kt's HTTP relay pattern:
            //   /api/video/offer        POST  caller signals intent to call
            //   /api/video/answer       POST  receiver accepts the call
            //   /api/video/hangup       POST  either side ends the call
            //   /api/video/poll         GET   receiver polls for incoming call
            //   /api/video/frame/push   POST  sender pushes JPEG frame (image/jpeg)
            //   /api/video/frame/pull   GET   receiver pulls latest JPEG frame

            } else if (url.startsWith('/api/video/')) {
                // Lazy-init video state
                if (!this._videoSessions) {
                    // Map: deviceId → { latestFrame: Buffer|null, pendingCall: {from} | null }
                    this._videoSessions = new Map();
                }
                const vs = this._videoSessions;
                const ensure = (id) => {
                    if (!vs.has(id)) vs.set(id, { latestFrame: null, pendingCall: null });
                    return vs.get(id);
                };

                const readRaw = (req, cb) => {
                    const chunks = [];
                    req.on('data', c => chunks.push(c));
                    req.on('end', () => cb(Buffer.concat(chunks)));
                };

                if (url === '/api/video/offer' && req.method === 'POST') {
                    readBody(req, (body) => {
                        const { from, to } = body;
                        const toSession = ensure(to);
                        toSession.pendingCall = { from };
                        cors(res); res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, msg: `Offer from ${from} queued for ${to}` }));
                    });

                } else if (url === '/api/video/answer' && req.method === 'POST') {
                    readBody(req, (body) => {
                        const { from, to } = body;
                        // Clear the pending call from the answerer's queue
                        if (vs.has(from)) vs.get(from).pendingCall = null;
                        cors(res); res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, msg: `${from} answered call from ${to}` }));
                    });

                } else if (url === '/api/video/hangup' && req.method === 'POST') {
                    readBody(req, (body) => {
                        const { from, to } = body;
                        // Clear frames and pending calls for both parties
                        if (vs.has(from)) { vs.get(from).latestFrame = null; vs.get(from).pendingCall = null; }
                        if (vs.has(to))   { vs.get(to).latestFrame   = null; vs.get(to).pendingCall   = null; }
                        cors(res); res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true }));
                    });

                } else if (url.startsWith('/api/video/poll') && req.method === 'GET') {
                    const qs      = new URLSearchParams(url.split('?')[1] || '');
                    const deviceId = qs.get('deviceId') || '';
                    const session  = vs.has(deviceId) ? vs.get(deviceId) : null;
                    const pending  = session?.pendingCall;
                    cors(res); res.writeHead(200, { 'Content-Type': 'application/json' });
                    if (pending) {
                        res.end(JSON.stringify({ hasCall: true, from: pending.from }));
                    } else {
                        res.end(JSON.stringify({ hasCall: false }));
                    }

                } else if (url.startsWith('/api/video/frame/push') && req.method === 'POST') {
                    // Receive JPEG frame from sender — store as latest frame for target
                    const qs  = new URLSearchParams(url.split('?')[1] || '');
                    const from = qs.get('from') || '';
                    const to   = qs.get('to')   || '';
                    readRaw(req, (frameBytes) => {
                        if (to) {
                            const toSession = ensure(to);
                            // Store under a key that the receiver uses: "incoming from <from>"
                            toSession.latestFrame = frameBytes;
                        }
                        cors(res); res.writeHead(204); res.end();
                    });

                } else if (url.startsWith('/api/video/frame/pull') && req.method === 'GET') {
                    // Serve the latest JPEG frame to receiver
                    const qs   = new URLSearchParams(url.split('?')[1] || '');
                    const to   = qs.get('to') || '';
                    const session = vs.has(to) ? vs.get(to) : null;
                    const frame   = session?.latestFrame;
                    if (frame && frame.length > 0) {
                        cors(res);
                        res.writeHead(200, {
                            'Content-Type':   'image/jpeg',
                            'Content-Length': frame.length,
                            'Cache-Control':  'no-store',
                        });
                        res.end(frame);
                    } else {
                        cors(res); res.writeHead(204); res.end();
                    }

                } else {
                    cors(res); res.writeHead(404); res.end('Video endpoint not found');
                }

            } else {
                res.writeHead(404);
                res.end('404');
            }
        });

        this.httpServer.on('error', err => {
            console.error(`❌ HTTP error: ${err.message}`);
        });

        this.httpServer.listen(this.httpPort, this.host, () => {
            console.log(`✅ HTTP listening on ${this.host}:${this.httpPort}`);
        });
    }

    _findLatestApk() {
        const primaryDir = path.join(this.watchDir, 'dist');
        if (fs.existsSync(primaryDir)) {
            try {
                const files = fs.readdirSync(primaryDir).filter(f => f.endsWith('.apk'));
                if (files.length > 0) {
                    const apks = files.map(file => {
                        const fullPath = path.join(primaryDir, file);
                        return { file, path: fullPath, stat: fs.statSync(fullPath) };
                    }).sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);
                    return apks[0];
                }
            } catch(e) {}
        }

        const candidateDirs = [
            path.join(process.cwd(), 'dist'),
            path.resolve(this.watchDir, '..', 'test-apk', 'dist'),
            path.resolve(process.cwd(), '..', 'test-apk', 'dist')
        ];

        try {
            const parentDir = path.dirname(this.watchDir);
            if (fs.existsSync(parentDir)) {
                const subDirs = fs.readdirSync(parentDir);
                subDirs.forEach(sub => {
                    candidateDirs.push(path.join(parentDir, sub, 'dist'));
                });
            }
        } catch(e) {}

        const allApks = [];
        for (const dir of candidateDirs) {
            if (dir && fs.existsSync(dir)) {
                try {
                    const files = fs.readdirSync(dir).filter(f => f.endsWith('.apk'));
                    files.forEach(file => {
                        const fullPath = path.join(dir, file);
                        if (fs.existsSync(fullPath)) {
                            const stat = fs.statSync(fullPath);
                            allApks.push({ file, path: fullPath, stat });
                        }
                    });
                } catch(e) {}
            }
        }

        if (allApks.length === 0) return null;
        allApks.sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);
        return allApks[0];
    }

    _renderDashboard() {
        const s = this._getStatus();
        const localIP = this._getLocalIP();
        const apkInfo = this._findLatestApk();

        const apk = apkInfo ? apkInfo.file : null;
        const apkSize = apkInfo ? (apkInfo.stat.size / (1024 * 1024)).toFixed(1) : '0';
        const apkMtime = apkInfo ? new Date(apkInfo.stat.mtime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'medium' }) : 'No APK Built Yet';


        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dolphin Backend | Live Dashboard & APK Download</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    :root {
      --bg-color: #0f172a;
      --card-bg: rgba(30, 41, 59, 0.7);
      --card-border: rgba(255, 255, 255, 0.1);
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #38bdf8;
      --accent-hover: #0284c7;
      --success: #10b981;
      --danger: #ef4444;
      --warning: #f59e0b;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
    }

    body {
      background: var(--bg-color);
      background-image: 
        radial-gradient(circle at 15% 50%, rgba(56, 189, 248, 0.15), transparent 25%),
        radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.15), transparent 25%);
      background-attachment: fixed;
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    header {
      padding: 1.5rem 2rem;
      text-align: center;
      border-bottom: 1px solid var(--card-border);
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    header h1 {
      font-weight: 700;
      font-size: 2.2rem;
      background: linear-gradient(to right, #38bdf8, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.25rem;
    }

    header p {
      color: var(--text-muted);
      font-size: 0.95rem;
    }

    main {
      flex: 1;
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 1.5rem;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease;
    }

    .card:hover {
      transform: translateY(-2px);
    }

    .card h2 {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .status-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
    }
    .status-online { background-color: var(--success); box-shadow: 0 0 10px var(--success); }
    .status-offline { background-color: var(--danger); box-shadow: 0 0 10px var(--danger); }

    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.65rem 0;
      border-bottom: 1px solid var(--card-border);
    }
    .stat-row:last-child {
      border-bottom: none;
    }

    .stat-label {
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    .stat-value {
      font-weight: 600;
      font-family: monospace;
      font-size: 0.95rem;
    }

    /* Device List Table */
    .device-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .device-item {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--card-border);
      border-radius: 10px;
      padding: 0.9rem 1.1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .device-info h4 {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .device-info p {
      color: var(--text-muted);
      font-size: 0.8rem;
      margin-top: 0.15rem;
    }

    .badge {
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      background: rgba(16, 185, 129, 0.2);
      color: var(--success);
      border: 1px solid rgba(16, 185, 129, 0.4);
    }

    .empty-state {
      text-align: center;
      color: var(--text-muted);
      padding: 2rem 0;
      font-style: italic;
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border: none;
      padding: 0.85rem 1.5rem;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: opacity 0.2s ease, transform 0.1s ease;
      width: 100%;
      margin-top: 1rem;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .btn:hover {
      opacity: 0.92;
    }
    .btn:active {
      transform: scale(0.98);
    }
    
    .btn-secondary {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid var(--card-border);
      color: var(--text-main);
      box-shadow: none;
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    /* 📱 100% Mobile Responsive Media Queries */
    @media (max-width: 768px) {
      header {
        padding: 1rem 1.25rem !important;
      }
      header h1 {
        font-size: 1.5rem !important;
      }
      header p {
        font-size: 0.85rem !important;
      }
      header div {
        flex-direction: column !important;
        gap: 8px !important;
      }
      header a.btn {
        width: 100% !important;
      }
      main {
        padding: 1rem !important;
        gap: 1rem !important;
        grid-template-columns: 1fr !important;
      }
      .card {
        grid-column: span 1 !important;
        padding: 1.1rem !important;
        border-radius: 12px !important;
      }
      .stat-row {
        font-size: 0.85rem !important;
      }
      .stat-value {
        font-size: 0.85rem !important;
        word-break: break-all;
      }
      .device-item {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 8px !important;
      }
      .btn {
        padding: 0.9rem 1rem !important;
        font-size: 0.95rem !important;
      }
    }
  </style>
</head>
<body>
  <header>
    <h1>🌊 Dolphin OS Dashboard</h1>
    <p>Real-time Device Connection, Titan P2P & Client APK Monitoring</p>
    <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: center;">
      <a href="/" class="btn" style="padding: 8px 16px; font-size: 0.9rem; width: auto; margin:0;">🌊 Server & Device Monitor</a>
      <a href="/web" class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.9rem; width: auto; margin:0;">📱 Dolphin Web Phone Previewer</a>
    </div>
  </header>

  <main>
    <!-- 1. Server Network Status Card -->
    <div class="card">
      <h2>
        <span id="server-indicator" class="status-indicator status-online"></span>
        Server & Network Monitor
      </h2>
      <div class="stat-row">
        <span class="stat-label">Server IP Address</span>
        <span class="stat-value" id="stat-ip" style="color: var(--accent);">${localIP}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">TCP Port (Devices)</span>
        <span class="stat-value" id="stat-tcp" style="color: var(--success);">${this.port}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Titan P2P Relay Port</span>
        <span class="stat-value" id="stat-relay" style="color: var(--warning);">9092</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">HTTP API Port</span>
        <span class="stat-value" id="stat-http">${this.httpPort}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">UI Bundle Size</span>
        <span class="stat-value" id="stat-bundle">${this._bundle ? this._bundle.length.toLocaleString() : 539} bytes</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">TCP Heartbeat Ping</span>
        <span class="stat-value" style="color: var(--success);">Every 8.0s</span>
      </div>
    </div>

    <!-- 2. Client APK Download Card -->
    <div class="card">
      <h2>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#10b981" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>
        Client App Download
      </h2>
      <div class="stat-row">
        <span class="stat-label">Package</span>
        <span class="stat-value">${apk}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">File Size</span>
        <span class="stat-value" id="stat-apk-size" style="color: var(--success);">${apkSize} MB</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Build Date & Time</span>
        <span class="stat-value" id="stat-apk-time" style="color: var(--warning);">${apkMtime}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Target Server IP</span>

        <span class="stat-value" id="stat-target-ip" style="color: var(--accent);">${localIP}:${this.port}</span>
      </div>

      <a id="apk-download-btn" href="/download-apk" download class="btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>
        Download ${apk} (${apkSize} MB)
      </a>
    </div>

    <!-- 3. Connected Devices Monitor Card -->
    <div class="card" style="grid-column: span 2;">
      <h2>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#38bdf8" viewBox="0 0 16 16"><path d="M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm4-2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zM9 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 9 8zm1 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5z"/><path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zM1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8.96c.026-.163.04-.33.04-.5C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1.006 1.006 0 0 1 1 12V4z"/></svg>
        Live Connected Devices Monitoring
      </h2>
      <div id="device-list" class="device-list">
        <div class="empty-state">Fetching connected devices...</div>
      </div>
    </div>
  </main>

  <script>
    function formatTimeAgo(isoString) {
      if (!isoString) return 'No APK Built Yet';
      const date = new Date(isoString);
      const diffSec = Math.max(0, Math.floor((new Date() - date) / 1000));
      const clockStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      if (diffSec < 5) return 'Just now (' + clockStr + ') ⚡';
      if (diffSec < 60) return diffSec + 's ago (' + clockStr + ') ⚡';
      const min = Math.floor(diffSec / 60);
      if (min < 60) return min + 'm ago (' + clockStr + ') ⏱️';
      const hr = Math.floor(min / 60);
      if (hr < 24) return hr + 'h ' + (min % 60) + 'm ago (' + clockStr + ') ⏱️';
      return date.toLocaleString();
    }

    async function fetchServerStatus() {
      try {
        const res = await fetch('/api/dolphin/server');
        if (res.ok) {
          const data = await res.json();
          document.getElementById('server-indicator').className = 'status-indicator status-online';
          
          const ipList = data.ips && data.ips.length > 0 ? data.ips.join(', ') : '${localIP}';
          document.getElementById('stat-ip').innerText = ipList;
          document.getElementById('stat-tcp').innerText = data.tcpPort || '${this.port}';
          document.getElementById('stat-relay').innerText = data.relayPort || '9092';
          document.getElementById('stat-http').innerText = data.httpPort || '${this.httpPort}';
          document.getElementById('stat-bundle').innerText = (data.bundleSize ? data.bundleSize.toLocaleString() : '539') + ' bytes';
          
          if (data.apkSize) {
            const sizeMb = (data.apkSize / (1024 * 1024)).toFixed(1);
            document.getElementById('stat-apk-size').innerText = sizeMb + ' MB';
          }

          if (data.apkMtime) {
            document.getElementById('stat-apk-time').innerText = formatTimeAgo(data.apkMtime);
          }

          if (data.ips && data.ips[0]) {
            document.getElementById('stat-target-ip').innerText = data.ips[0] + ':' + (data.tcpPort || ${this.port});
          }

          // Render Device List
          const deviceContainer = document.getElementById('device-list');
          if (!data.devices || data.devices.length === 0) {
            deviceContainer.innerHTML = '<div class="empty-state">No devices currently connected over TCP ${this.port}. Open app on phone to connect.</div>';
          } else {
            deviceContainer.innerHTML = data.devices.map(dev => {
              const connectedTime = new Date(dev.connectedAt).toLocaleTimeString();
              return \`
                <div class="device-item">
                  <div class="device-info">
                    <h4>📱 Device Socket: \${dev.id}</h4>
                    <p>IP Address: <strong>\${dev.addr}</strong> · Connected: \${connectedTime}</p>
                  </div>
                  <span class="badge">🟢 CONNECTED</span>
                </div>
              \`;
            }).join('');
          }
        }
      } catch (err) {
        document.getElementById('server-indicator').className = 'status-indicator status-offline';
      }
    }

    // Refresh every 2 seconds for live monitoring
    fetchServerStatus();
    setInterval(fetchServerStatus, 2000);
  </script>
</body>
</html>`;
    }

    _getStatus() {
        const bundleSize = this._bundle ? `${(this._bundle.length / 1024).toFixed(1)} KB` : 'none';
        const devices = this.server.getConnectedDevices();
        return {
            running: true,
            uptime: this._formatTime(Date.now() - this._startTime),
            tcp: devices.length,
            patch: this._patchCount,
            ack: this._ackCount,
            sse: this._sseClients.size,
            bundle: bundleSize,
            connections: devices
        };
    }

    _formatTime(ms) {
        const s = Math.floor(ms / 1000);
        const m = Math.floor(s / 60);
        const h = Math.floor(m / 60);
        if (h) return `${h}h ${m%60}m`;
        if (m) return `${m}m ${s%60}s`;
        return `${s}s`;
    }

    _getLocalIP() {
        const nets = require('os').networkInterfaces();
        let preferred = null;
        for (const name of Object.keys(nets)) {
            for (const n of nets[name]) {
                const family = typeof n.family === 'string' ? n.family : `IPv${n.family}`;
                if (family === 'IPv4' && !n.internal) {
                    // Prioritize 192.168.x.x (standard home/office networks)
                    if (n.address.startsWith('192.168.')) return n.address;
                    // Fallback to any other non-internal IPv4
                    preferred = n.address;
                }
            }
        }
        return preferred || 'localhost';
    }

    _notify() {
        const data = JSON.stringify(this._getStatus());
        this._sseClients.forEach(c => {
            try { c.write(`data: ${data}\n\n`); } catch(e) { this._sseClients.delete(c); }
        });
    }

    _watchFiles() {
        let watchTimeout = null;
        const activeWatchers = new Map();

        const watchDirRecursive = (dir) => {
            if (activeWatchers.has(dir)) return;
            try {
                const watcher = fs.watch(dir, (evt, filename) => {
                    if (!filename) return;
                    const fullPath = path.join(dir, filename);
                    const relPath = path.relative(this.watchDir, fullPath).replace(/\\/g, '/');
                    
                    if (relPath.includes('node_modules') || 
                        relPath.includes('dist') || 
                        relPath.includes('.dolphin') ||
                        relPath.includes('.git')) return;
                    
                    if (!relPath.endsWith('.js') && !relPath.endsWith('.jsx')) return;
                    
                    console.log(`🔍 Watcher detected change in: ${relPath}`);
                    
                    if (watchTimeout) clearTimeout(watchTimeout);
                    watchTimeout = setTimeout(() => {
                        console.log(`📝 Rebuilding due to change in: ${relPath}`);
                        this.emit('fileChanged', { file: relPath, evt });
                    }, 350);
                });
                activeWatchers.set(dir, watcher);

                const entries = fs.readdirSync(dir, { withFileTypes: true });
                for (const entry of entries) {
                    if (entry.isDirectory()) {
                        const name = entry.name;
                        if (name !== 'node_modules' && name !== 'dist' && !name.startsWith('.')) {
                            watchDirRecursive(path.join(dir, name));
                        }
                    }
                }
            } catch (e) {}
        };

        watchDirRecursive(this.watchDir);
    }

    _renderHexdump() {
        if (!this._bundle) return '<h1>No bundle loaded.</h1><p>Run dolphin dev / save project files to build bundle.</p>';
        
        const bytes = this._bundle;
        const magic = bytes.slice(0, 4).toString('ascii');
        const version = bytes.readUInt16LE(4);
        const flags = bytes.readUInt16LE(6);
        const scrCount = bytes.readUInt16LE(8);
        const compCount = bytes.readUInt16LE(10);
        const entryIdx = bytes.readUInt16LE(12);
        const drawerIdx = bytes.readUInt16LE(14);
        
        let cursor = 20;
        const screens = [];
        for (let i = 0; i < scrCount; i++) {
            const nameLen = bytes[cursor++];
            const name = bytes.toString('utf8', cursor, cursor + nameLen);
            cursor += nameLen;
            const compOff = bytes.readUInt16LE(cursor); cursor += 2;
            const compCnt = bytes.readUInt16LE(cursor); cursor += 2;
            const dataLen = bytes.readUInt32LE(cursor); cursor += 4;
            const rawData = bytes.slice(cursor, cursor + dataLen);
            cursor += dataLen;

            // Extract printable strings from data pool
            const strings = [];
            let strStart = 0;
            for (let j = 0; j < rawData.length; j++) {
                if (rawData[j] === 0) {
                    if (j > strStart) {
                        strings.push(rawData.toString('utf8', strStart, j));
                    } else {
                        strings.push('∅');
                    }
                    strStart = j + 1;
                }
            }

            screens.push({
                index: i,
                name,
                compOff,
                compCnt,
                dataLen,
                strings
            });
        }

        const comps = [];
        for (let i = 0; i < compCount; i++) {
            if (cursor + 24 > bytes.length - 4) break;
            const bin = bytes.slice(cursor, cursor + 24);
            comps.push(this._decodeTitan24(bin, i));
            cursor += 24;
        }

        return `<!DOCTYPE html>
<html>
<head>
    <title>Dolphin Binary Hexdump & Debugger</title>
    <meta charset="utf-8">
    <style>
        body { font-family: 'JetBrains Mono', monospace, sans-serif; background: #090d16; color: #f8fafc; padding: 20px; line-height: 1.5; }
        h1, h2, h3 { color: #38bdf8; margin-bottom: 8px; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
        .meta-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-top: 10px; }
        .meta-item { background: #0f172a; padding: 8px 12px; border-radius: 6px; border: 1px solid #1e293b; }
        .meta-label { font-size: 11px; color: #94a3b8; text-transform: uppercase; }
        .meta-val { font-size: 16px; font-weight: bold; color: #38bdf8; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
        th, td { border: 1px solid #334155; padding: 8px 10px; text-align: left; }
        th { background: #0f172a; color: #94a3b8; text-transform: uppercase; }
        tr:nth-child(even) { background: rgba(255,255,255,0.02); }
        tr:hover { background: rgba(56, 189, 248, 0.08); }
        .tag { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; }
        .tag-blue { background: #0284c7; color: white; }
        .tag-green { background: #16a34a; color: white; }
        .tag-amber { background: #d97706; color: white; }
        .hex { color: #fbbf24; font-family: monospace; letter-spacing: 1px; }
        .btn { display: inline-block; background: #0284c7; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; border: none; cursor: pointer; }
        .btn:hover { background: #0369a1; }
        .str-badge { background: #1e293b; border: 1px solid #475569; padding: 2px 6px; border-radius: 4px; color: #cbd5e1; font-size: 11px; margin-right: 4px; display: inline-block; margin-bottom: 4px; }
    </style>
</head>
<body>
    <div style="display:flex; justify-between; align-items:center; margin-bottom: 16px;">
        <div>
            <h1>🌊 Dolphin Native Binary Hexdump & Debugger</h1>
            <p style="color:#94a3b8; font-size:13px;">Live inspect 24-byte Titan protocol, string pools, and screen offsets</p>
        </div>
        <div>
            <button onclick="saveSnapshot()" class="btn">📸 Save Baseline Snapshot</button>
            <a href="/" class="btn" style="background:#475569; margin-left:8px;">Back to Dashboard</a>
        </div>
    </div>

    <div class="card">
        <h3>📦 Bundle Metadata Header</h3>
        <div class="meta-grid">
            <div class="meta-item"><div class="meta-label">Magic</div><div class="meta-val">${magic}</div></div>
            <div class="meta-item"><div class="meta-label">Version</div><div class="meta-val">0x${version.toString(16)}</div></div>
            <div class="meta-item"><div class="meta-label">Screens</div><div class="meta-val">${scrCount}</div></div>
            <div class="meta-item"><div class="meta-label">Components</div><div class="meta-val">${compCount}</div></div>
            <div class="meta-item"><div class="meta-label">Total Size</div><div class="meta-val">${bytes.length} B</div></div>
        </div>
    </div>

    <div class="card">
        <h3>📱 Screens & String Data Pools</h3>
        <table>
            <thead>
                <tr>
                    <th>Idx</th>
                    <th>Screen Name</th>
                    <th>Comp Offset</th>
                    <th>Comp Count</th>
                    <th>Data Len</th>
                    <th>String Pool Items</th>
                </tr>
            </thead>
            <tbody>
                ${screens.map(s => `
                    <tr>
                        <td>#${s.index}</td>
                        <td style="font-weight:bold; color:#38bdf8">${s.name}</td>
                        <td>${s.compOff}</td>
                        <td>${s.compCnt}</td>
                        <td>${s.dataLen} B</td>
                        <td>${s.strings.slice(0, 15).map(str => `<span class="str-badge">${str.replace(/</g, '&lt;')}</span>`).join('')} ${s.strings.length > 15 ? `<span style="color:#94a3b8">+${s.strings.length - 15} more</span>` : ''}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    <div class="card">
        <h3>🧩 24-Byte Titan Component Table (${comps.length} components)</h3>
        <table>
            <thead>
                <tr>
                    <th>Idx</th>
                    <th>Type (Opcode)</th>
                    <th>Color (Code:Shade)</th>
                    <th>Padding (T R B L)</th>
                    <th>Margin (T R B L)</th>
                    <th>Radius</th>
                    <th>Flags (Sig)</th>
                    <th>24-Byte Hex Dump</th>
                </tr>
            </thead>
            <tbody>
                ${comps.map(c => `
                    <tr>
                        <td>#${c.idx}</td>
                        <td><span class="tag tag-blue">${c.typeName} (0x${c.type.toString(16)})</span></td>
                        <td>${c.colorCode}:${c.shade}</td>
                        <td>${c.padT} ${c.padR} ${c.padB} ${c.padL}</td>
                        <td>${c.marT} ${c.marR} ${c.marB} ${c.marL}</td>
                        <td>${c.radius}px</td>
                        <td>
                            ${c.hasBorder ? '<span class="tag tag-green">BORDER</span> ' : ''}
                            ${c.hasGradient ? '<span class="tag tag-amber">GRADIENT</span> ' : ''}
                            ${c.isScrollable ? '<span class="tag tag-blue">SCROLL</span> ' : ''}
                            ${c.hasAnim ? '<span class="tag tag-green">ANIM</span> ' : ''}
                        </td>
                        <td class="hex">${c.hex}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    <script>
        function saveSnapshot() {
            fetch('/api/dolphin/snapshot')
                .then(res => res.json())
                .then(d => alert('✅ Baseline snapshot saved (' + d.size + ' bytes)! You can now edit files and compare!'));
        }
    </script>
</body>
</html>`;
    }

    _decodeTitan24(bin, idx) {
        const types = {
            0x10: 'Button', 0x11: 'Card', 0x12: 'Container', 0x13: 'Column', 0x14: 'Row',
            0x15: 'Switch', 0x16: 'Text', 0x17: 'Checkbox', 0x18: 'TextField', 0x19: 'Select',
            0x1B: 'RadioButton', 0x1D: 'Header', 0x1F: 'Image', 0x27: 'TabBar', 0x28: 'Drawer'
        };
        const type = bin[1] & 0xFF;
        const sig = bin[15] & 0xFF;
        return {
            idx,
            type,
            typeName: types[type] || `Opcode_0x${type.toString(16)}`,
            shade: bin[2] & 0xFF,
            colorCode: bin[3] & 0xFF,
            padT: bin[4] & 0xFF,
            padR: bin[5] & 0xFF,
            padB: bin[6] & 0xFF,
            padL: bin[7] & 0xFF,
            marT: bin[8] & 0xFF,
            marR: bin[9] & 0xFF,
            marB: bin[10] & 0xFF,
            marL: bin[11] & 0xFF,
            radius: bin[14] & 0xFF,
            hasBorder: (sig & 0x04) !== 0,
            hasGradient: (sig & 0x01) !== 0,
            isScrollable: (sig & 0x02) !== 0,
            hasAnim: (sig & 0x10) !== 0,
            hex: Array.from(bin).map(b => (b & 0xFF).toString(16).padStart(2, '0')).join(' ')
        };
    }

    _renderLogcatPage() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dolphin Native — Live Device Logcat</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f172a; color: #f8fafc; font-family: monospace; font-size: 13px; padding: 20px; line-height: 1.5; }
        header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 15px; margin-bottom: 20px; }
        h1 { color: #38bdf8; font-size: 20px; }
        .status { background: #0284c7; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        pre { background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 15px; overflow-x: auto; max-height: 80vh; color: #4ade80; font-family: 'Consolas', 'Fira Code', monospace; white-space: pre-wrap; word-break: break-all; }
        .controls { display: flex; gap: 10px; }
        button { background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; }
        button:hover { background: #2563eb; }
    </style>
</head>
<body>
    <header>
        <div>
            <h1>📱 Real-Time Android Device Logcat</h1>
            <p style="color: #94a3b8; font-size: 12px;">Live logs streamed over WebSocket from connected Android device</p>
        </div>
        <div class="controls">
            <span class="status" id="live-indicator">LIVE AUTO-REFRESH (2s)</span>
            <button onclick="fetchLogs()">🔄 Refresh Now</button>
        </div>
    </header>

    <pre id="log-content">Loading live logcat from device...</pre>

    <script>
        function fetchLogs() {
            fetch('/api/dolphin/logcat')
                .then(r => r.text())
                .then(txt => {
                    const el = document.getElementById('log-content');
                    el.textContent = txt;
                    el.scrollTop = el.scrollHeight;
                })
                .catch(err => {
                    document.getElementById('log-content').textContent = 'Failed to fetch logs: ' + err;
                });
        }
        fetchLogs();
        setInterval(fetchLogs, 2000);
    </script>
</body>
</html>`;
    }

    pushReload(bundle) {
        this._bundle = bundle;
        this._patchCount++;
        const sent = this.server.broadcast(bundle, 0x01); // FULL_RELOAD
        console.log(`📡 PATCH → ${sent} devices (${bundle ? bundle.length : 0} bytes)`);
    }

    pushScreenPatches(bundle, screens, entry) {
        this._bundle = bundle;
        this._patchCount++;
        
        const devices = this.server.getConnectedDevices();
        if (devices.length === 0) return;
        
        devices.forEach(dev => {
            screens.forEach(screenObj => {
                const screenBinary = Buffer.concat(screenObj.components);
                this.server.patchScreen(dev.id, screenObj.name, {
                    binary: screenBinary,
                    rawData: screenObj.data
                });
            });
            console.log(`📡 All screens Hot Patched for device ${dev.id}`);
        });
    }

    patchScreen(name, screen) {
        this._patchCount++;
        this.server.patchScreen(null, name, screen);
        console.log(`📡 SCREEN PATCH: ${name} → ${this.server.getConnectedDevices().length} devices`);
    }
}
module.exports = { DevServer };