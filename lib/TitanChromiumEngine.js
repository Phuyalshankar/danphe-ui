'use strict';

/**
 * 🚀 TitanChromiumEngine (titan-companion / engine & danphe-ui / lib)
 * 60FPS Screencast + Multi-Phase Touch/Wheel/Key Scroll + In-Page Video Capture + Single-Audio Guardian
 */

const { spawn, execSync } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');
const WebSocket = require('ws');

class TitanChromiumEngine {
    constructor(options = {}) {
        this.port = options.port || 9222;
        this.wsPort = options.wsPort || 3009;
        this.width = options.width || 360;
        this.height = options.height || 680;
        this.deviceScaleFactor = options.deviceScaleFactor || 2;
        this.initialUrl = options.initialUrl || 'https://www.tiktok.com';
        this.profileDir = options.profileDir || path.join(__dirname, '..', 'data', 'user_profile');
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
        this.isMuted = false;
        this.onMediaDetected = options.onMediaDetected || null;
    }

    findBrowserPath() {
        const candidates = [
            'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
            'C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
            'C:\\\\Program Files (x86)\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe',
            'C:\\\\Program Files\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe',
            path.join(os.homedir(), 'AppData\\\\Local\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe')
        ];

        for (const p of candidates) {
            if (fs.existsSync(p)) return p;
        }
        return 'chrome';
    }

    cleanOldProcessOnPort() {
        try {
            if (process.platform === 'win32') {
                const out = execSync('netstat -ano | findstr :' + this.port + ' || echo NONE', { encoding: 'utf8' });
                const lines = out.split('\\n');
                for (const line of lines) {
                    const parts = line.trim().split(/\\s+/);
                    if (parts.length >= 5 && parts[1].includes(':' + this.port)) {
                        const pid = parts[parts.length - 1];
                        if (pid && pid !== '0' && pid !== String(process.pid)) {
                            try { execSync('taskkill /F /PID ' + pid, { stdio: 'ignore' }); } catch (_) {}
                        }
                    }
                }
            }
        } catch (_) {}
    }

    async start() {
        this.cleanOldProcessOnPort();

        const browserPath = this.findBrowserPath();
        if (!fs.existsSync(this.profileDir)) fs.mkdirSync(this.profileDir, { recursive: true });

        console.log('[TitanChromiumEngine] Launching browser: ' + browserPath);
        console.log('[TitanChromiumEngine] Persistent Profile: ' + this.profileDir);

        const args = [
            '--remote-debugging-port=' + this.port,
            '--headless=new',
            '--disable-gpu',
            '--no-first-run',
            '--no-default-browser-check',
            '--remote-allow-origins=*',
            '--window-size=' + this.width + ',' + this.height,
            '--user-data-dir=' + this.profileDir,
            '--autoplay-policy=no-user-gesture-required',
            '--user-agent=' + this.userAgent,
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
                console.log('[TitanChromiumEngine] Browser exited code ' + code);
            });
        } catch (err) {
            console.error('[TitanChromiumEngine] Failed to spawn browser: ' + err.message);
            return false;
        }

        const cdpReady = await this.waitForCdp(30, 200);
        if (!cdpReady) {
            console.error('[TitanChromiumEngine] Timed out waiting for CDP');
            return false;
        }

        await this.connectCdp();
        this.startWebSocketBridge();
        this.isInitialized = true;
        console.log('[TitanChromiumEngine] Active & Streaming on ws://localhost:' + this.wsPort);
        return true;
    }

    waitForCdp(retries = 30, interval = 200) {
        return new Promise((resolve) => {
            const check = (rem) => {
                const req = http.get('http://127.0.0.1:' + this.port + '/json', (res) => {
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
            http.get('http://127.0.0.1:' + this.port + '/json', (res) => {
                let data = '';
                res.on('data', d => data += d);
                res.on('end', () => {
                    try {
                        const pages = JSON.parse(data);
                        const page = pages.find(p => p.type === 'page') || pages[0];
                        if (!page || !page.webSocketDebuggerUrl) {
                            return reject(new Error('No debuggable page target'));
                        }

                        console.log('[TitanChromiumEngine] CDP connecting to ' + page.webSocketDebuggerUrl);
                        this.cdpWs = new WebSocket(page.webSocketDebuggerUrl);

                        this.cdpWs.on('open', () => {
                            this.initCdpSession();
                            resolve(true);
                        });

                        this.cdpWs.on('message', (msg) => {
                            this.handleCdpMessage(msg);
                        });

                        this.cdpWs.on('error', (err) => {
                            console.error('[TitanChromiumEngine] CDP error: ' + err.message);
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
        this.sendCdp('Page.enable');
        this.sendCdp('DOM.enable');
        this.sendCdp('Network.enable');
        this.sendCdp('Runtime.enable');

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

        // 🛡️ Single Active Audio Guardian + Anti-bot
        this.sendCdp('Page.addScriptToEvaluateOnNewDocument', {
            source: `
                Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
                window.chrome = { runtime: {} };

                (function() {
                    let activeMedia = null;

                    function enforceSingleAudio(media) {
                        if (!media) return;
                        activeMedia = media;
                        document.querySelectorAll('video, audio').forEach(function(el) {
                            if (el !== activeMedia && !el.paused) {
                                try {
                                    el.pause();
                                    el.muted = true;
                                } catch(_) {}
                            }
                        });
                    }

                    document.addEventListener('play', function(e) {
                        if (e.target && (e.target.tagName === 'VIDEO' || e.target.tagName === 'AUDIO')) {
                            enforceSingleAudio(e.target);
                        }
                    }, true);

                    setInterval(function() {
                        const playing = Array.from(document.querySelectorAll('video, audio')).filter(function(v) { return !v.paused; });
                        if (playing.length > 1) {
                            for (let i = 0; i < playing.length - 1; i++) {
                                try { playing[i].pause(); playing[i].muted = true; } catch(_) {}
                            }
                        }
                    }, 800);
                })();
            `
        });

        this.sendCdp('Page.startScreencast', {
            format: 'jpeg',
            quality: 80,
            maxWidth: this.width,
            maxHeight: this.height,
            everyNthFrame: 1
        });
    }

    stopAllAudio() {
        this.sendCdp('Runtime.evaluate', {
            expression: "document.querySelectorAll('video, audio').forEach(function(el) { try { el.pause(); el.muted = true; } catch(_) {} });"
        });
    }

    toggleMute(shouldMute) {
        this.isMuted = shouldMute !== undefined ? shouldMute : !this.isMuted;
        this.sendCdp('Runtime.evaluate', {
            expression: "document.querySelectorAll('video, audio').forEach(function(el) { try { el.muted = " + this.isMuted + "; } catch(_) {} });"
        });
        this.broadcast({ type: 'mute_state', isMuted: this.isMuted });
        return this.isMuted;
    }

    // 🌟 Multi-Phase Scroll & Reel Flip (TikTok, Douyin, Shorts, Facebook)
    performSwipeUp() {
        const midX = Math.round(this.width / 2);
        const startY = Math.round(this.height * 0.75);
        const endY = Math.round(this.height * 0.15);

        // 1. Touch Sequence
        this.sendCdp('Input.dispatchTouchEvent', {
            type: 'touchStart',
            touchPoints: [{ x: midX, y: startY }]
        });
        setTimeout(() => {
            this.sendCdp('Input.dispatchTouchEvent', {
                type: 'touchMove',
                touchPoints: [{ x: midX, y: Math.round(this.height * 0.45) }]
            });
        }, 30);
        setTimeout(() => {
            this.sendCdp('Input.dispatchTouchEvent', {
                type: 'touchMove',
                touchPoints: [{ x: midX, y: endY }]
            });
            this.sendCdp('Input.dispatchTouchEvent', {
                type: 'touchEnd',
                touchPoints: []
            });
        }, 80);

        // 2. Synthesize Scroll Gesture
        this.sendCdp('Input.synthesizeScrollGesture', {
            x: midX,
            y: startY,
            xDistance: 0,
            yDistance: -500,
            speed: 1600,
            gestureSourceType: 'touch'
        });

        // 3. Mouse Wheel Event (For FB / standard web feeds)
        this.sendCdp('Input.dispatchMouseEvent', {
            type: 'mouseWheel',
            x: midX,
            y: Math.round(this.height / 2),
            deltaX: 0,
            deltaY: 500
        });

        // 4. Keyboard Navigation (TikTok / Douyin arrow keys)
        this.sendCdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowDown', code: 'ArrowDown', windowsVirtualKeyCode: 40 });
        this.sendCdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowDown', code: 'ArrowDown', windowsVirtualKeyCode: 40 });
        this.sendCdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'PageDown', code: 'PageDown', windowsVirtualKeyCode: 34 });
        this.sendCdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'PageDown', code: 'PageDown', windowsVirtualKeyCode: 34 });

        // 5. DOM Scroll Evaluation (For FB & normal websites)
        this.sendCdp('Runtime.evaluate', {
            expression: "window.scrollBy({ top: 450, left: 0, behavior: 'smooth' });"
        });
    }

    performSwipeDown() {
        const midX = Math.round(this.width / 2);
        const startY = Math.round(this.height * 0.25);
        const endY = Math.round(this.height * 0.85);

        // 1. Touch Sequence
        this.sendCdp('Input.dispatchTouchEvent', {
            type: 'touchStart',
            touchPoints: [{ x: midX, y: startY }]
        });
        setTimeout(() => {
            this.sendCdp('Input.dispatchTouchEvent', {
                type: 'touchMove',
                touchPoints: [{ x: midX, y: Math.round(this.height * 0.55) }]
            });
        }, 30);
        setTimeout(() => {
            this.sendCdp('Input.dispatchTouchEvent', {
                type: 'touchMove',
                touchPoints: [{ x: midX, y: endY }]
            });
            this.sendCdp('Input.dispatchTouchEvent', {
                type: 'touchEnd',
                touchPoints: []
            });
        }, 80);

        // 2. Synthesize Scroll Gesture
        this.sendCdp('Input.synthesizeScrollGesture', {
            x: midX,
            y: startY,
            xDistance: 0,
            yDistance: 500,
            speed: 1600,
            gestureSourceType: 'touch'
        });

        // 3. Mouse Wheel Event
        this.sendCdp('Input.dispatchMouseEvent', {
            type: 'mouseWheel',
            x: midX,
            y: Math.round(this.height / 2),
            deltaX: 0,
            deltaY: -500
        });

        // 4. Keyboard Navigation
        this.sendCdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowUp', code: 'ArrowUp', windowsVirtualKeyCode: 38 });
        this.sendCdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowUp', code: 'ArrowUp', windowsVirtualKeyCode: 38 });
        this.sendCdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'PageUp', code: 'PageUp', windowsVirtualKeyCode: 33 });
        this.sendCdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'PageUp', code: 'PageUp', windowsVirtualKeyCode: 33 });

        // 5. DOM Scroll Evaluation
        this.sendCdp('Runtime.evaluate', {
            expression: "window.scrollBy({ top: -450, left: 0, behavior: 'smooth' });"
        });
    }

    // 🌟 Extract Active Video From Page Context (Handles blob & direct streams)
    async captureActiveVideoFromDOM() {
        return new Promise((resolve) => {
            const id = ++this.msgId;
            const handler = (raw) => {
                try {
                    const msg = JSON.parse(raw);
                    if (msg.id === id) {
                        this.cdpWs.off('message', handler);
                        const result = msg.result && msg.result.result ? msg.result.result.value : null;
                        resolve(result);
                    }
                } catch (_) {}
            };

            this.cdpWs.on('message', handler);
            setTimeout(() => {
                this.cdpWs.off('message', handler);
                resolve(null);
            }, 3000);

            this.sendCdp('Runtime.evaluate', {
                expression: `
                    (function() {
                        const video = document.querySelector('video');
                        if (!video) return null;
                        const src = video.currentSrc || video.src || '';
                        return {
                            title: document.title || 'Captured Video',
                            videoUrl: src,
                            pageUrl: window.location.href,
                            isBlob: src.startsWith('blob:')
                        };
                    })()
                `,
                returnByValue: true
            });
        });
    }

    handleCdpMessage(rawMsg) {
        try {
            const msg = JSON.parse(rawMsg);

            if (msg.method === 'Page.screencastFrame') {
                const { data, metadata, sessionId } = msg.params;
                this.lastFrame = data;
                this.sendCdp('Page.screencastFrameAck', { sessionId });
                this.broadcast({
                    type: 'screencast_frame',
                    data: data,
                    metadata: metadata,
                    url: this.currentUrl,
                    isMuted: this.isMuted
                });
            }

            if (msg.method === 'Page.frameNavigated' && msg.params.frame && !msg.params.frame.parentId) {
                this.currentUrl = msg.params.frame.url;
                this.broadcast({
                    type: 'url_changed',
                    url: this.currentUrl,
                    title: msg.params.frame.name || ''
                });
            }

            if (msg.method === 'Network.responseReceived') {
                const resp = msg.params.response;
                const mime = resp.mimeType || '';
                const url = resp.url || '';

                if (
                    mime.startsWith('video/') ||
                    url.match(/\\.(mp4|m3u8|webm|mov)(\\?.*)?$/i) ||
                    url.includes('aweme/v1/play') ||
                    url.includes('kuaishou.com/video') ||
                    url.includes('tiktokcdn.com') ||
                    url.includes('fbcdn.net')
                ) {
                    const mediaItem = {
                        url: url,
                        mimeType: mime,
                        size: resp.encodedDataLength || 0,
                        title: path.basename(url.split('?')[0]) || 'Video Stream',
                        platform: url.includes('douyin') ? 'Douyin' : (url.includes('kuaishou') ? 'Kuaishou' : (url.includes('tiktok') ? 'TikTok' : (url.includes('fbcdn') || url.includes('facebook') ? 'Facebook' : 'Web Video'))),
                        pageUrl: this.currentUrl,
                        timestamp: Date.now()
                    };

                    this.detectedMedia.push(mediaItem);
                    if (this.detectedMedia.length > 30) this.detectedMedia.shift();

                    this.broadcast({ type: 'media_detected', media: mediaItem });
                    if (typeof this.onMediaDetected === 'function') {
                        this.onMediaDetected(mediaItem);
                    }
                }
            }
        } catch (e) {}
    }

    startWebSocketBridge() {
        this.wss = new WebSocket.Server({ port: this.wsPort });

        this.wss.on('connection', (ws) => {
            this.clients.add(ws);

            ws.send(JSON.stringify({
                type: 'init_state',
                url: this.currentUrl,
                width: this.width,
                height: this.height,
                isMuted: this.isMuted,
                detectedMedia: this.detectedMedia
            }));

            if (this.lastFrame) {
                ws.send(JSON.stringify({
                    type: 'screencast_frame',
                    data: this.lastFrame,
                    url: this.currentUrl,
                    isMuted: this.isMuted
                }));
            }

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
                    this.stopAllAudio();
                    this.currentUrl = targetUrl;
                    this.sendCdp('Page.navigate', { url: targetUrl });
                    break;
                }

                case 'mute_toggle': {
                    this.toggleMute(event.isMuted);
                    break;
                }

                case 'stop_audio': {
                    this.stopAllAudio();
                    break;
                }

                case 'swipe_up': {
                    this.performSwipeUp();
                    break;
                }

                case 'swipe_down': {
                    this.performSwipeDown();
                    break;
                }

                case 'touch_start': {
                    this.sendCdp('Input.dispatchTouchEvent', {
                        type: 'touchStart',
                        touchPoints: [{ x: Math.round(event.x), y: Math.round(event.y) }]
                    });
                    break;
                }

                case 'touch_move': {
                    this.sendCdp('Input.dispatchTouchEvent', {
                        type: 'touchMove',
                        touchPoints: [{ x: Math.round(event.x), y: Math.round(event.y) }]
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
                    this.sendCdp('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
                    this.sendCdp('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
                    break;
                }

                case 'mouse_down': {
                    this.sendCdp('Input.dispatchMouseEvent', { type: 'mousePressed', x: Math.round(event.x), y: Math.round(event.y), button: 'left', clickCount: 1 });
                    break;
                }

                case 'mouse_up': {
                    this.sendCdp('Input.dispatchMouseEvent', { type: 'mouseReleased', x: Math.round(event.x), y: Math.round(event.y), button: 'left', clickCount: 1 });
                    break;
                }

                case 'mouse_move': {
                    this.sendCdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x: Math.round(event.x), y: Math.round(event.y) });
                    break;
                }

                case 'scroll': {
                    const deltaY = event.deltaY || 0;
                    this.sendCdp('Input.dispatchMouseEvent', {
                        type: 'mouseWheel',
                        x: Math.round(event.x || (this.width / 2)),
                        y: Math.round(event.y || (this.height / 2)),
                        deltaX: Math.round(event.deltaX || 0),
                        deltaY: Math.round(deltaY)
                    });
                    this.sendCdp('Runtime.evaluate', {
                        expression: 'window.scrollBy({ top: ' + Math.round(deltaY) + ', left: 0, behavior: "smooth" });'
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
                    this.stopAllAudio();
                    this.sendCdp('Runtime.evaluate', { expression: 'window.history.back()' });
                    break;
                }

                case 'reload': {
                    this.stopAllAudio();
                    this.sendCdp('Page.reload');
                    break;
                }
            }
        } catch (e) {}
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
        this.stopAllAudio();
        if (this.wss) { this.wss.close(); this.wss = null; }
        if (this.cdpWs) { this.cdpWs.close(); this.cdpWs = null; }
        if (this.chromeProcess) {
            try { this.chromeProcess.kill('SIGKILL'); } catch (_) {}
            this.chromeProcess = null;
        }
        this.cleanOldProcessOnPort();
    }
}

module.exports = { TitanChromiumEngine };
