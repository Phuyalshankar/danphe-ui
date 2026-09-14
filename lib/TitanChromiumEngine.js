'use strict';

/**
 * 🚀 TitanChromiumEngine (danphe-ui / lib)
 * Ultra-Fast Headless Chromium / Edge Engine with 60FPS Screencasting, Real Touch & Mobile Swipe Gestures
 */

const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');
const WebSocket = require('ws');

class TitanChromiumEngine {
    constructor(options = {}) {
        this.port = options.port || 9222;
        this.wsPort = options.wsPort || 3006;
        this.width = options.width || 360;
        this.height = options.height || 680;
        this.deviceScaleFactor = options.deviceScaleFactor || 2;
        this.initialUrl = options.initialUrl || 'https://www.tiktok.com';
        this.userAgent = options.userAgent || 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';

        this.chromeProcess = null;
        this.cdpWs = null;
        this.wss = null;
        this.clients = new Set();
        this.currentUrl = this.initialUrl;
        this.lastFrame = null;
        this.detectedMedia = [];
        this.msgId = 1;
        this.isInitialized = false;
    }

    findBrowserPath() {
        const candidates = [
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
            'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
            path.join(os.homedir(), 'AppData\\Local\\Google\\Chrome\\Application\\chrome.exe')
        ];

        for (const p of candidates) {
            if (fs.existsSync(p)) return p;
        }
        return 'chrome';
    }

    async start() {
        const browserPath = this.findBrowserPath();
        const profileDir = path.join(os.tmpdir(), 'titan_chromium_mobile_profile_' + process.pid);

        console.log(`🚀 [TitanChromiumEngine] Launching browser: ${browserPath}`);
        console.log(`📁 [TitanChromiumEngine] Profile Dir: ${profileDir}`);

        const args = [
            `--remote-debugging-port=${this.port}`,
            '--headless=new',
            '--disable-gpu',
            '--no-first-run',
            '--no-default-browser-check',
            '--remote-allow-origins=*',
            `--window-size=${this.width},${this.height}`,
            `--user-data-dir=${profileDir}`,
            '--autoplay-policy=no-user-gesture-required',
            `--user-agent=${this.userAgent}`,
            '--disable-blink-features=AutomationControlled',
            '--disable-web-security',
            '--allow-running-insecure-content',
            '--ignore-certificate-errors',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--lang=zh-CN,en-US,en,ne',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            this.initialUrl
        ];

        try {
            this.chromeProcess = spawn(browserPath, args, { stdio: 'ignore' });
            this.chromeProcess.on('exit', (code) => {
                console.log(`⚠️ [TitanChromiumEngine] Browser process exited with code ${code}`);
            });
        } catch (err) {
            console.error('❌ [TitanChromiumEngine] Failed to spawn browser process:', err.message);
            return false;
        }

        // Wait for CDP endpoint to be ready
        const cdpReady = await this.waitForCdp(25, 200);
        if (!cdpReady) {
            console.error('❌ [TitanChromiumEngine] Timed out waiting for CDP port');
            return false;
        }

        await this.connectCdp();
        this.startWebSocketBridge();
        this.isInitialized = true;
        console.log(`✅ [TitanChromiumEngine] Active & Streaming on ws://localhost:${this.wsPort}`);
        return true;
    }

    waitForCdp(retries = 20, interval = 200) {
        return new Promise((resolve) => {
            const check = (rem) => {
                const req = http.get(`http://127.0.0.1:${this.port}/json`, (res) => {
                    let data = '';
                    res.on('data', d => data += d);
                    res.on('end', () => {
                        try {
                            const pages = JSON.parse(data);
                            if (pages && pages.length > 0) return resolve(true);
                        } catch (e) {}
                        if (rem > 0) setTimeout(() => check(rem - 1), interval);
                        else resolve(false);
                    });
                });
                req.on('error', () => {
                    if (rem > 0) setTimeout(() => check(rem - 1), interval);
                    else resolve(false);
                });
            };
            check(retries);
        });
    }

    async connectCdp() {
        return new Promise((resolve, reject) => {
            http.get(`http://127.0.0.1:${this.port}/json`, (res) => {
                let data = '';
                res.on('data', d => data += d);
                res.on('end', () => {
                    try {
                        const pages = JSON.parse(data);
                        const page = pages.find(p => p.type === 'page') || pages[0];
                        if (!page || !page.webSocketDebuggerUrl) {
                            return reject(new Error('No debuggable page target found'));
                        }

                        console.log(`🔌 [TitanChromiumEngine] Connecting CDP to ${page.webSocketDebuggerUrl}`);
                        this.cdpWs = new WebSocket(page.webSocketDebuggerUrl);

                        this.cdpWs.on('open', () => {
                            this.initCdpSession();
                            resolve(true);
                        });

                        this.cdpWs.on('message', (msg) => {
                            this.handleCdpMessage(msg);
                        });

                        this.cdpWs.on('error', (err) => {
                            console.error('❌ [TitanChromiumEngine] CDP WS error:', err.message);
                        });
                    } catch (e) {
                        reject(e);
                    }
                });
            }).on('error', reject);
        });
    }

    sendCdp(method, params = {}) {
        if (!this.cdpWs || this.cdpWs.readyState !== WebSocket.OPEN) return;
        const id = ++this.msgId;
        this.cdpWs.send(JSON.stringify({ id, method, params }));
        return id;
    }

    initCdpSession() {
        // 1. Enable Core Domains
        this.sendCdp('Page.enable');
        this.sendCdp('DOM.enable');
        this.sendCdp('Network.enable');
        this.sendCdp('Runtime.enable');
        
        // 2. Set Mobile Metrics & Touch Emulation
        this.sendCdp('Emulation.setDeviceMetricsOverride', {
            width: this.width,
            height: this.height,
            deviceScaleFactor: this.deviceScaleFactor,
            mobile: true,
            fitWindow: false
        });
        this.sendCdp('Emulation.setUserAgentOverride', {
            userAgent: this.userAgent,
            platform: 'iPhone'
        });
        this.sendCdp('Emulation.setTouchEmulationEnabled', {
            enabled: true,
            maxTouchPoints: 5
        });
        this.sendCdp('Emulation.setEmitTouchEventsForMouse', {
            enabled: true,
            configuration: 'mobile'
        });

        // 3. Bypass Bot / WebDriver Detection
        this.sendCdp('Page.addScriptToEvaluateOnNewDocument', {
            source: `
                Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
                window.chrome = { runtime: {} };
            `
        });

        // 4. Start Ultra-Fast Screencast
        this.sendCdp('Page.startScreencast', {
            format: 'jpeg',
            quality: 80,
            maxWidth: this.width,
            maxHeight: this.height,
            everyNthFrame: 1
        });
    }

    handleCdpMessage(rawMsg) {
        try {
            const msg = JSON.parse(rawMsg);

            // Handle Screencast Frames
            if (msg.method === 'Page.screencastFrame') {
                const { data, metadata, sessionId } = msg.params;
                this.lastFrame = data;

                // Acknowledge frame to receive next frame without delay
                this.sendCdp('Page.screencastFrameAck', { sessionId });

                // Broadcast frame to all connected clients
                this.broadcast({
                    type: 'screencast_frame',
                    data: data,
                    metadata: metadata,
                    url: this.currentUrl
                });
            }

            // Handle URL Navigations
            if (msg.method === 'Page.frameNavigated') {
                if (msg.params.frame && !msg.params.frame.parentId) {
                    this.currentUrl = msg.params.frame.url;
                    this.broadcast({
                        type: 'url_changed',
                        url: this.currentUrl,
                        title: msg.params.frame.name || ''
                    });
                }
            }

            // Handle Media Sniffing (Detects MP4 / Video streams for 1-click timeline grabber)
            if (msg.method === 'Network.responseReceived') {
                const resp = msg.params.response;
                const mime = resp.mimeType || '';
                const url = resp.url || '';

                if (mime.startsWith('video/') || url.match(/\.(mp4|m3u8|webm|mov)(\?.*)?$/i)) {
                    const mediaItem = {
                        url: url,
                        mimeType: mime,
                        size: resp.encodedDataLength || 0,
                        title: path.basename(url.split('?')[0]) || 'Web Video Stream'
                    };
                    this.detectedMedia.push(mediaItem);
                    if (this.detectedMedia.length > 20) this.detectedMedia.shift();

                    this.broadcast({
                        type: 'media_detected',
                        media: mediaItem
                    });
                }
            }
        } catch (e) {
            console.error('Error parsing CDP message:', e);
        }
    }

    startWebSocketBridge() {
        this.wss = new WebSocket.Server({ port: this.wsPort });

        this.wss.on('connection', (ws) => {
            this.clients.add(ws);
            console.log(`📱 [TitanChromiumEngine] Client connected. Total: ${this.clients.size}`);

            // Send initial state & last frame immediately
            ws.send(JSON.stringify({
                type: 'init_state',
                url: this.currentUrl,
                width: this.width,
                height: this.height,
                detectedMedia: this.detectedMedia
            }));

            if (this.lastFrame) {
                ws.send(JSON.stringify({
                    type: 'screencast_frame',
                    data: this.lastFrame,
                    url: this.currentUrl
                }));
            }

            // Handle Client Events
            ws.on('message', (message) => {
                this.handleClientEvent(message);
            });

            ws.on('close', () => {
                this.clients.delete(ws);
            });
        });
    }

    handleClientEvent(message) {
        try {
            const event = JSON.parse(message);
            
            switch (event.type) {
                case 'navigate': {
                    let targetUrl = (event.url || '').trim();
                    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
                        targetUrl = 'https://' + targetUrl;
                    }
                    this.currentUrl = targetUrl;
                    this.sendCdp('Page.navigate', { url: targetUrl });
                    break;
                }

                case 'swipe_up': {
                    // Vertical Swipe Up (Next Video in TikTok / Douyin / Shorts)
                    this.sendCdp('Input.synthesizeScrollGesture', {
                        x: Math.round(this.width / 2),
                        y: Math.round(this.height * 0.75),
                        xDistance: 0,
                        yDistance: -550,
                        speed: 1500,
                        gestureSourceType: 'touch'
                    });
                    // Also send ArrowDown & PageDown for web platforms listening to keyboard navigation
                    this.sendCdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowDown', code: 'ArrowDown', windowsVirtualKeyCode: 40 });
                    this.sendCdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowDown', code: 'ArrowDown', windowsVirtualKeyCode: 40 });
                    break;
                }

                case 'swipe_down': {
                    // Vertical Swipe Down (Previous Video)
                    this.sendCdp('Input.synthesizeScrollGesture', {
                        x: Math.round(this.width / 2),
                        y: Math.round(this.height * 0.25),
                        xDistance: 0,
                        yDistance: 550,
                        speed: 1500,
                        gestureSourceType: 'touch'
                    });
                    this.sendCdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowUp', code: 'ArrowUp', windowsVirtualKeyCode: 38 });
                    this.sendCdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowUp', code: 'ArrowUp', windowsVirtualKeyCode: 38 });
                    break;
                }

                case 'touch_start': {
                    const x = Math.round(event.x);
                    const y = Math.round(event.y);
                    this.sendCdp('Input.dispatchTouchEvent', {
                        type: 'touchStart',
                        touchPoints: [{ x, y }]
                    });
                    break;
                }

                case 'touch_move': {
                    const x = Math.round(event.x);
                    const y = Math.round(event.y);
                    this.sendCdp('Input.dispatchTouchEvent', {
                        type: 'touchMove',
                        touchPoints: [{ x, y }]
                    });
                    break;
                }

                case 'touch_end': {
                    this.sendCdp('Input.dispatchTouchEvent', {
                        type: 'touchEnd',
                        touchPoints: []
                    });
                    break;
                }

                case 'mouse_click': {
                    const x = Math.round(event.x);
                    const y = Math.round(event.y);
                    this.sendCdp('Input.dispatchMouseEvent', {
                        type: 'mousePressed',
                        x: x,
                        y: y,
                        button: 'left',
                        clickCount: 1
                    });
                    this.sendCdp('Input.dispatchMouseEvent', {
                        type: 'mouseReleased',
                        x: x,
                        y: y,
                        button: 'left',
                        clickCount: 1
                    });
                    break;
                }

                case 'mouse_down': {
                    this.sendCdp('Input.dispatchMouseEvent', {
                        type: 'mousePressed',
                        x: Math.round(event.x),
                        y: Math.round(event.y),
                        button: 'left',
                        clickCount: 1
                    });
                    break;
                }

                case 'mouse_up': {
                    this.sendCdp('Input.dispatchMouseEvent', {
                        type: 'mouseReleased',
                        x: Math.round(event.x),
                        y: Math.round(event.y),
                        button: 'left',
                        clickCount: 1
                    });
                    break;
                }

                case 'mouse_move': {
                    this.sendCdp('Input.dispatchMouseEvent', {
                        type: 'mouseMoved',
                        x: Math.round(event.x),
                        y: Math.round(event.y)
                    });
                    break;
                }

                case 'scroll': {
                    const deltaY = event.deltaY || 0;
                    this.sendCdp('Input.synthesizeScrollGesture', {
                        x: Math.round(event.x || (this.width / 2)),
                        y: Math.round(event.y || (this.height / 2)),
                        xDistance: Math.round(-(event.deltaX || 0)),
                        yDistance: Math.round(-deltaY),
                        speed: 1000
                    });
                    break;
                }

                case 'key': {
                    this.sendCdp('Input.dispatchKeyEvent', {
                        type: 'keyDown',
                        text: event.text || undefined,
                        key: event.key,
                        code: event.code,
                        windowsVirtualKeyCode: event.keyCode
                    });
                    this.sendCdp('Input.dispatchKeyEvent', {
                        type: 'keyUp',
                        key: event.key,
                        code: event.code,
                        windowsVirtualKeyCode: event.keyCode
                    });
                    break;
                }

                case 'go_back': {
                    this.sendCdp('Runtime.evaluate', { expression: 'window.history.back()' });
                    break;
                }

                case 'reload': {
                    this.sendCdp('Page.reload');
                    break;
                }
            }
        } catch (e) {
            console.error('Error processing client event:', e);
        }
    }

    broadcast(payload) {
        const msg = JSON.stringify(payload);
        for (const client of this.clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg);
            }
        }
    }

    stop() {
        if (this.wss) {
            this.wss.close();
            this.wss = null;
        }
        if (this.cdpWs) {
            this.cdpWs.close();
            this.cdpWs = null;
        }
        if (this.chromeProcess) {
            this.chromeProcess.kill();
            this.chromeProcess = null;
        }
    }
}

module.exports = { TitanChromiumEngine };

