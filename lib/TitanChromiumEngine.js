'use strict';

/**
 * 🚀 TitanChromiumEngine (titan-companion / engine)
 * Master CDP Engine + Buffer-Free Force Scroll + Instant Play/Pause Hook + 60FPS Screencast
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
        this.browserWs = null;
        this.activeSessionId = null;
        this.activeTargetId = null;
        this.wss = null;
        this.clients = new Set();
        this.currentUrl = this.initialUrl;
        this.lastFrame = null;
        this.detectedMedia = [];
        this.mediaHeaders = new Map();
        this.msgId = 1;
        this.isInitialized = false;
        this.isMuted = false;
        this.onMediaDetected = options.onMediaDetected || null;
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

    cleanOldProcessOnPort() {
        try {
            if (process.platform === 'win32') {
                const out = execSync('netstat -ano | findstr :' + this.port + ' || echo NONE', { encoding: 'utf8' });
                const lines = out.split('\n');
                for (const line of lines) {
                    const parts = line.trim().split(/\s+/);
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

        const args = [
            '--remote-debugging-port=' + this.port,
            '--window-position=50,50',
            '--window-size=' + this.width + ',' + this.height,
            '--user-data-dir=' + this.profileDir,
            '--autoplay-policy=no-user-gesture-required',
            '--no-first-run',
            '--no-default-browser-check',
            '--remote-allow-origins=*',
            '--user-agent=' + this.userAgent,
            '--disable-blink-features=AutomationControlled',
            '--disable-web-security',
            '--allow-running-insecure-content',
            '--ignore-certificate-errors',
            '--no-sandbox',
            '--disable-setuid-sandbox',
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

        const cdpReady = await this.waitForCdp(35, 200);
        if (!cdpReady) {
            console.error('[TitanChromiumEngine] Timed out waiting for CDP');
            return false;
        }

        await this.connectBrowserCdp();
        this.startWebSocketBridge();
        this.isInitialized = true;
        console.log('[TitanChromiumEngine] Active & Streaming on ws://localhost:' + this.wsPort);
        return true;
    }

    waitForCdp(retries = 35, interval = 200) {
        return new Promise((resolve) => {
            const check = (rem) => {
                const req = http.get('http://127.0.0.1:' + this.port + '/json/version', (res) => {
                    let data = '';
                    res.on('data', d => data += d);
                    res.on('end', () => {
                        try {
                            const json = JSON.parse(data);
                            if (json && json.webSocketDebuggerUrl) return resolve(true);
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

    async connectBrowserCdp() {
        return new Promise((resolve, reject) => {
            http.get('http://127.0.0.1:' + this.port + '/json/version', (res) => {
                let data = '';
                res.on('data', d => data += d);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        if (!json.webSocketDebuggerUrl) return reject(new Error('No browser debugger URL'));

                        console.log('[TitanChromiumEngine] Connecting to Browser Master CDP: ' + json.webSocketDebuggerUrl);
                        this.browserWs = new WebSocket(json.webSocketDebuggerUrl);

                        this.browserWs.on('open', () => {
                            this.sendBrowser('Target.setDiscoverTargets', { discover: true });
                            this.sendBrowser('Target.setAutoAttach', {
                                autoAttach: true,
                                waitForDebuggerOnStart: false,
                                flatten: true
                            });
                            resolve(true);
                        });

                        this.browserWs.on('message', (msg) => {
                            this.handleBrowserCdpMessage(msg);
                        });

                        this.browserWs.on('error', (err) => {
                            console.error('[TitanChromiumEngine] Browser CDP error: ' + err.message);
                        });
                    } catch (e) {
                        reject(e);
                    }
                });
            }).on('error', reject);
        });
    }

    sendBrowser(method, params = {}) {
        if (!this.browserWs || this.browserWs.readyState !== WebSocket.OPEN) return;
        const id = ++this.msgId;
        this.browserWs.send(JSON.stringify({ id, method, params }));
        return id;
    }

    sendSession(method, params = {}, sessionId = null) {
        if (!this.browserWs || this.browserWs.readyState !== WebSocket.OPEN) return;
        const targetSession = sessionId || this.activeSessionId;
        if (!targetSession) return;
        const id = ++this.msgId;
        this.browserWs.send(JSON.stringify({ id, method, params, sessionId: targetSession }));
        return id;
    }

    initTargetSession(sessionId, targetInfo) {
        console.log('[TitanChromiumEngine] Initializing Target Session: ' + targetInfo.url);
        this.activeSessionId = sessionId;
        this.activeTargetId = targetInfo.targetId;
        this.currentUrl = targetInfo.url || this.currentUrl;

        this.sendSession('Page.enable', {}, sessionId);
        this.sendSession('DOM.enable', {}, sessionId);
        this.sendSession('Network.enable', { maxTotalBufferSize: 100000000, maxResourceBufferSize: 50000000 }, sessionId);
        this.sendSession('Runtime.enable', {}, sessionId);

        this.sendSession('Emulation.setDeviceMetricsOverride', {
            width: this.width,
            height: this.height,
            deviceScaleFactor: this.deviceScaleFactor,
            mobile: true,
            fitWindow: false
        }, sessionId);

        this.sendSession('Emulation.setUserAgentOverride', {
            userAgent: this.userAgent,
            platform: 'iPhone'
        }, sessionId);

        this.sendSession('Emulation.setTouchEmulationEnabled', {
            enabled: true,
            maxTouchPoints: 5
        }, sessionId);

        this.sendSession('Emulation.setEmitTouchEventsForMouse', {
            enabled: true,
            configuration: 'mobile'
        }, sessionId);

        // Continuous Anti-Modal Bypass + Audio Unmute Guardian
        this.sendSession('Page.addScriptToEvaluateOnNewDocument', {
            source: `
                Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
                window.chrome = { runtime: {} };

                (function() {
                    function cleanOverlaysAndUnmute() {
                        const masks = document.querySelectorAll('.DivModalMask, .DivModalContainer, [class*="ModalMask"], [class*="ModalContainer"], [class*="login-container"], #login_popup, .xgplayer-loading, [class*="loading-overlay"]');
                        masks.forEach(function(m) { try { m.remove(); } catch(_) {} });

                        const closeBtns = document.querySelectorAll('[data-e2e="modal-close-inner-button"], [aria-label="Close"], button[class*="close"], .login-modal-close, [data-cookiebanner="accept_button"]');
                        closeBtns.forEach(function(b) { try { b.click(); } catch(_) {} });

                        const fbDialogs = document.querySelectorAll('div[role="dialog"] [aria-label="Close"], [aria-label="Decline optional cookies"], [aria-label="Allow all cookies"]');
                        fbDialogs.forEach(function(b) { try { b.click(); } catch(_) {} });

                        if (document.body && document.body.style.overflow === 'hidden') {
                            document.body.style.overflow = 'auto';
                        }

                        const muteBtns = document.querySelectorAll('[data-e2e="volume-mute-btn"], [aria-label*="unmute"], [aria-label*="Unmute"], button[aria-label*="Mute"], .volume-control');
                        muteBtns.forEach(function(b) {
                            if (b.getAttribute('aria-label') === 'Unmute' || b.classList.contains('muted') || (b.textContent && b.textContent.includes('Unmute'))) {
                                try { b.click(); } catch(_) {}
                            }
                        });

                        const videos = Array.from(document.querySelectorAll('video'));
                        const playing = videos.filter(function(v) { return !v.paused; });
                        if (playing.length > 0) {
                            try {
                                playing[0].muted = false;
                                playing[0].volume = 1.0;
                            } catch(_) {}
                            for (let i = 1; i < playing.length; i++) {
                                try { playing[i].pause(); playing[i].muted = true; } catch(_) {}
                            }
                        }
                    }

                    document.addEventListener('play', function(e) {
                        if (e.target && e.target.tagName === 'VIDEO') {
                            try { e.target.muted = false; e.target.volume = 1.0; } catch(_) {}
                        }
                    }, true);

                    setInterval(cleanOverlaysAndUnmute, 500);
                })();
            `
        }, sessionId);

        this.sendSession('Page.startScreencast', {
            format: 'jpeg',
            quality: 75,
            maxWidth: this.width,
            maxHeight: this.height,
            everyNthFrame: 1
        }, sessionId);
    }

    handleBrowserCdpMessage(rawMsg) {
        try {
            const msg = JSON.parse(rawMsg);

            if (msg.method === 'Target.attachedToTarget') {
                const { sessionId, targetInfo } = msg.params;
                if (targetInfo && targetInfo.type === 'page') {
                    this.initTargetSession(sessionId, targetInfo);
                }
            }

            if (msg.method === 'Target.targetInfoChanged') {
                const targetInfo = msg.params.targetInfo;
                if (targetInfo && targetInfo.type === 'page' && targetInfo.url) {
                    this.currentUrl = targetInfo.url;
                    this.broadcast({
                        type: 'url_changed',
                        url: this.currentUrl,
                        title: targetInfo.title || ''
                    });
                }
            }

            if (msg.method === 'Page.screencastFrame') {
                const { data, metadata, sessionId } = msg.params;
                this.lastFrame = data;
                this.sendSession('Page.screencastFrameAck', { sessionId: sessionId || msg.sessionId });
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

            if (msg.method === 'Network.requestWillBeSent') {
                const req = msg.params.request;
                const url = req.url || '';
                if (url.includes('tiktokcdn') || url.includes('tiktok.com/video') || url.includes('zjcdn') || url.includes('videoplayback') || url.includes('fbcdn')) {
                    this.mediaHeaders.set(url, req.headers);
                }
            }

            if (msg.method === 'Network.responseReceived') {
                const resp = msg.params.response;
                const mime = (resp.mimeType || '').toLowerCase();
                const url = resp.url || '';

                if (mime.startsWith('image/') || url.match(/\.(png|jpg|jpeg|webp|gif|svg|ico)(\?.*)?$/i)) {
                    return;
                }

                if (
                    mime.startsWith('video/') ||
                    mime.startsWith('audio/') ||
                    url.match(/\.(mp4|m3u8|webm|mov|mp3|m4a)(\?.*)?$/i) ||
                    url.includes('douyinvod.com') ||
                    url.includes('zjcdn.com') ||
                    url.includes('snssdk.com') ||
                    url.includes('tiktokcdn') ||
                    url.includes('byteoversea') ||
                    url.includes('ibytedtos') ||
                    url.includes('fbcdn.net') ||
                    url.includes('facebook.com') ||
                    url.includes('videoplayback') ||
                    url.includes('kuaishou.com') ||
                    url.includes('kwimgs.com')
                ) {
                    const mediaItem = {
                        url: url,
                        mimeType: mime,
                        size: resp.encodedDataLength || 0,
                        title: path.basename(url.split('?')[0]) || 'Video Stream',
                        platform: url.includes('youtube') || url.includes('videoplayback') ? 'YouTube' : (url.includes('douyin') ? 'Douyin' : (url.includes('kuaishou') ? 'Kuaishou' : (url.includes('tiktok') ? 'TikTok' : (url.includes('fbcdn') || url.includes('facebook') ? 'Facebook' : 'Web Video')))),
                        pageUrl: this.currentUrl,
                        headers: this.mediaHeaders.get(url) || null,
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

    navigateTo(targetUrl) {
        let cleanUrl = (targetUrl || '').trim();
        if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
            cleanUrl = 'https://' + cleanUrl;
        }
        this.stopAllAudio();
        this.currentUrl = cleanUrl;
        console.log('[TitanChromiumEngine] Navigating to: ' + cleanUrl);

        this.sendSession('Runtime.evaluate', { expression: 'window.location.href = ' + JSON.stringify(cleanUrl) });
        this.sendSession('Page.navigate', { url: cleanUrl });
        this.broadcast({ type: 'url_changed', url: cleanUrl });
    }

    stopAllAudio() {
        this.sendSession('Runtime.evaluate', {
            expression: "document.querySelectorAll('video, audio').forEach(function(el) { try { el.pause(); el.muted = true; } catch(_) {} });"
        });
    }

    toggleMute(shouldMute) {
        this.isMuted = shouldMute !== undefined ? shouldMute : !this.isMuted;
        this.sendSession('Runtime.evaluate', {
            expression: "document.querySelectorAll('video, audio').forEach(function(el) { try { el.muted = " + this.isMuted + "; if(!" + this.isMuted + ") el.volume = 1.0; } catch(_) {} });"
        });
        this.broadcast({ type: 'mute_state', isMuted: this.isMuted });
        return this.isMuted;
    }

    // 🌟 Instant Play / Pause Toggle (Works on any video immediately)
    togglePlayPause() {
        this.sendSession('Runtime.evaluate', {
            expression: `
                (function() {
                    const video = document.querySelector('video');
                    if (video) {
                        if (video.paused) {
                            video.play().catch(function() {});
                            return 'playing';
                        } else {
                            video.pause();
                            return 'paused';
                        }
                    }
                    const playBtn = document.querySelector('[data-e2e="video-player-play"], .xgplayer-play, [aria-label*="Play"], [aria-label*="Pause"], .yt-spec-touch-feedback-shape');
                    if (playBtn) { try { playBtn.click(); return 'button_clicked'; } catch(_) {} }
                    return 'no_video';
                })()
            `
        });
    }

    // 🌟 Multi-Phase Reel Navigation & Scroll (Bypasses buffer locks & pauses old video)
    performSwipeUp() {
        // 1. Immediately pause currently playing/buffering video to release network bandwidth
        this.sendSession('Runtime.evaluate', {
            expression: `
                (function() {
                    const vids = document.querySelectorAll('video');
                    vids.forEach(function(v) { try { v.pause(); } catch(_) {} });

                    const masks = document.querySelectorAll('.DivModalMask, .DivModalContainer, [class*="ModalMask"], [class*="ModalContainer"], [class*="loading-overlay"], .xgplayer-loading');
                    masks.forEach(function(m) { try { m.remove(); } catch(_) {} });

                    const nextBtns = document.querySelectorAll('[data-e2e="arrow-right"], button[aria-label*="Next"], button[aria-label*="next"], [data-e2e="feed-arrow-down"], [class*="arrow-down"], [class*="ArrowDown"], .reel-video-in-sequence, [aria-label="Next video"]');
                    nextBtns.forEach(function(b) { try { b.click(); } catch(_) {} });

                    const activeItem = document.querySelector('[data-e2e="feed-active-video"], [class*="active"], [is-active], [active]');
                    if (activeItem && activeItem.nextElementSibling) {
                        try { activeItem.nextElementSibling.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch(_) {}
                    }

                    window.scrollBy({ top: window.innerHeight || 560, behavior: 'smooth' });

                    const evtDown = new KeyboardEvent('keydown', { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40, which: 40, bubbles: true });
                    window.dispatchEvent(evtDown);
                    document.body.dispatchEvent(evtDown);
                })();
            `
        });

        // 2. Touch & Key Dispatch
        const midX = Math.round(this.width / 2);
        const startY = Math.round(this.height * 0.75);
        const endY = Math.round(this.height * 0.15);

        this.sendSession('Input.dispatchTouchEvent', {
            type: 'touchStart',
            touchPoints: [{ x: midX, y: startY }]
        });
        setTimeout(() => {
            this.sendSession('Input.dispatchTouchEvent', {
                type: 'touchMove',
                touchPoints: [{ x: midX, y: endY }]
            });
            this.sendSession('Input.dispatchTouchEvent', {
                type: 'touchEnd',
                touchPoints: []
            });
        }, 40);

        this.sendSession('Input.synthesizeScrollGesture', {
            x: midX,
            y: startY,
            xDistance: 0,
            yDistance: -500,
            speed: 2000,
            gestureSourceType: 'touch'
        });

        this.sendSession('Input.dispatchMouseEvent', {
            type: 'mouseWheel',
            x: midX,
            y: Math.round(this.height / 2),
            deltaX: 0,
            deltaY: 600
        });

        this.sendSession('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowDown', code: 'ArrowDown', windowsVirtualKeyCode: 40 });
        this.sendSession('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowDown', code: 'ArrowDown', windowsVirtualKeyCode: 40 });
        this.sendSession('Input.dispatchKeyEvent', { type: 'keyDown', key: 'PageDown', code: 'PageDown', windowsVirtualKeyCode: 34 });
        this.sendSession('Input.dispatchKeyEvent', { type: 'keyUp', key: 'PageDown', code: 'PageDown', windowsVirtualKeyCode: 34 });
    }

    performSwipeDown() {
        this.sendSession('Runtime.evaluate', {
            expression: `
                (function() {
                    const vids = document.querySelectorAll('video');
                    vids.forEach(function(v) { try { v.pause(); } catch(_) {} });

                    const masks = document.querySelectorAll('.DivModalMask, .DivModalContainer, [class*="ModalMask"], [class*="ModalContainer"], [class*="loading-overlay"], .xgplayer-loading');
                    masks.forEach(function(m) { try { m.remove(); } catch(_) {} });

                    const prevBtns = document.querySelectorAll('[data-e2e="arrow-left"], button[aria-label*="Prev"], button[aria-label*="prev"], [data-e2e="feed-arrow-up"], [class*="arrow-up"], [class*="ArrowUp"], [aria-label="Previous video"]');
                    prevBtns.forEach(function(b) { try { b.click(); } catch(_) {} });

                    const activeItem = document.querySelector('[data-e2e="feed-active-video"], [class*="active"], [is-active], [active]');
                    if (activeItem && activeItem.previousElementSibling) {
                        try { activeItem.previousElementSibling.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch(_) {}
                    }

                    window.scrollBy({ top: -(window.innerHeight || 560), behavior: 'smooth' });

                    const evtUp = new KeyboardEvent('keydown', { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38, which: 38, bubbles: true });
                    window.dispatchEvent(evtUp);
                    document.body.dispatchEvent(evtUp);
                })();
            `
        });

        const midX = Math.round(this.width / 2);
        const startY = Math.round(this.height * 0.25);
        const endY = Math.round(this.height * 0.85);

        this.sendSession('Input.dispatchTouchEvent', {
            type: 'touchStart',
            touchPoints: [{ x: midX, y: startY }]
        });
        setTimeout(() => {
            this.sendSession('Input.dispatchTouchEvent', {
                type: 'touchMove',
                touchPoints: [{ x: midX, y: endY }]
            });
            this.sendSession('Input.dispatchTouchEvent', {
                type: 'touchEnd',
                touchPoints: []
            });
        }, 40);

        this.sendSession('Input.synthesizeScrollGesture', {
            x: midX,
            y: startY,
            xDistance: 0,
            yDistance: 500,
            speed: 2000,
            gestureSourceType: 'touch'
        });

        this.sendSession('Input.dispatchMouseEvent', {
            type: 'mouseWheel',
            x: midX,
            y: Math.round(this.height / 2),
            deltaX: 0,
            deltaY: -600
        });

        this.sendSession('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowUp', code: 'ArrowUp', windowsVirtualKeyCode: 38 });
        this.sendSession('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowUp', code: 'ArrowUp', windowsVirtualKeyCode: 38 });
        this.sendSession('Input.dispatchKeyEvent', { type: 'keyDown', key: 'PageUp', code: 'PageUp', windowsVirtualKeyCode: 33 });
        this.sendSession('Input.dispatchKeyEvent', { type: 'keyUp', key: 'PageUp', code: 'PageUp', windowsVirtualKeyCode: 33 });
    }

    
    async getActivePlayingVideo() {
        return new Promise((resolve) => {
            const id = ++this.msgId;
            const handler = (raw) => {
                try {
                    const msg = JSON.parse(raw);
                    if (msg.id === id) {
                        this.browserWs.off('message', handler);
                        const result = msg.result && msg.result.result ? msg.result.result.value : null;
                        resolve(result);
                    }
                } catch (_) {}
            };

            this.browserWs.on('message', handler);
            setTimeout(() => {
                this.browserWs.off('message', handler);
                resolve(null);
            }, 2500);

            this.sendSession('Runtime.evaluate', {
                expression: `
                    (function() {
                        const vids = Array.from(document.querySelectorAll('video'));
                        const playing = vids.find(v => !v.paused && v.currentTime > 0) || vids[0];
                        if (!playing) return null;
                        return {
                            src: playing.src || '',
                            currentSrc: playing.currentSrc || playing.src || '',
                            title: document.title || 'Video',
                            pageUrl: window.location.href,
                            isBlob: (playing.currentSrc || playing.src || '').startsWith('blob:')
                        };
                    })()
                `,
                returnByValue: true
            });
        });
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
                                case 'insert_text': {
                    if (event.text) {
                        this.sendSession('Input.insertText', { text: event.text });
                    }
                    break;
                }

                case 'navigate': {
                    this.navigateTo(event.url);
                    break;
                }

                case 'toggle_play_pause': {
                    this.togglePlayPause();
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
                    this.sendSession('Input.dispatchTouchEvent', {
                        type: 'touchStart',
                        touchPoints: [{ x: Math.round(event.x), y: Math.round(event.y) }]
                    });
                    break;
                }

                case 'touch_move': {
                    this.sendSession('Input.dispatchTouchEvent', {
                        type: 'touchMove',
                        touchPoints: [{ x: Math.round(event.x), y: Math.round(event.y) }]
                    });
                    break;
                }

                case 'touch_end': {
                    this.sendSession('Input.dispatchTouchEvent', {
                        type: 'touchEnd',
                        touchPoints: []
                    });
                    break;
                }

                                case 'click': {
                    const x = Math.round(event.x);
                    const y = Math.round(event.y);

                    // 1. Dispatch Touch Tap
                    this.sendSession('Input.dispatchTouchEvent', {
                        type: 'touchStart',
                        touchPoints: [{ x, y }]
                    });
                    this.sendSession('Input.dispatchTouchEvent', {
                        type: 'touchEnd',
                        touchPoints: []
                    });

                    // 2. Dispatch Mouse Events
                    this.sendSession('Input.dispatchMouseEvent', {
                        type: 'mouseMoved',
                        x, y
                    });
                    this.sendSession('Input.dispatchMouseEvent', {
                        type: 'mousePressed',
                        x, y,
                        button: 'left',
                        clickCount: 1
                    });
                    this.sendSession('Input.dispatchMouseEvent', {
                        type: 'mouseReleased',
                        x, y,
                        button: 'left',
                        clickCount: 1
                    });

                    // 3. Direct In-Page Element Click & Focus
                    this.sendSession('Runtime.evaluate', {
                        expression: `
                            (function() {
                                const el = document.elementFromPoint(${x}, ${y});
                                if (el) {
                                    if (typeof el.focus === 'function') el.focus();
                                    if (typeof el.click === 'function') {
                                        try { el.click(); } catch(_) {}
                                    }
                                    const clickableParent = el.closest('button, a, input, [role="button"], [role="tab"], [role="searchbox"], [data-e2e]');
                                    if (clickableParent && clickableParent !== el) {
                                        if (typeof clickableParent.focus === 'function') clickableParent.focus();
                                        if (typeof clickableParent.click === 'function') {
                                            try { clickableParent.click(); } catch(_) {}
                                        }
                                    }
                                }
                            })();
                        `
                    });
                    break;
                }

                case 'mouse_click': {
                    const x = Math.round(event.x);
                    const y = Math.round(event.y);
                    this.sendSession('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
                    this.sendSession('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
                    break;
                }

                case 'scroll': {
                    const deltaY = event.deltaY || 0;
                    this.sendSession('Input.dispatchMouseEvent', {
                        type: 'mouseWheel',
                        x: Math.round(event.x || (this.width / 2)),
                        y: Math.round(event.y || (this.height / 2)),
                        deltaX: Math.round(event.deltaX || 0),
                        deltaY: Math.round(deltaY)
                    });
                    this.sendSession('Runtime.evaluate', {
                        expression: 'window.scrollBy({ top: ' + Math.round(deltaY) + ', left: 0, behavior: "smooth" });'
                    });
                    break;
                }

                case 'key': {
                    this.sendSession('Input.dispatchKeyEvent', {
                        type: 'keyDown',
                        text: event.text || undefined,
                        key: event.key,
                        code: event.code,
                        windowsVirtualKeyCode: event.keyCode
                    });
                    this.sendSession('Input.dispatchKeyEvent', {
                        type: 'keyUp',
                        key: event.key,
                        code: event.code,
                        windowsVirtualKeyCode: event.keyCode
                    });
                    break;
                }

                case 'go_back': {
                    this.stopAllAudio();
                    this.sendSession('Runtime.evaluate', { expression: 'window.history.back()' });
                    break;
                }

                case 'reload': {
                    this.stopAllAudio();
                    this.sendSession('Page.reload');
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
        if (this.browserWs) { this.browserWs.close(); this.browserWs = null; }
        if (this.chromeProcess) {
            try { this.chromeProcess.kill('SIGKILL'); } catch (_) {}
            this.chromeProcess = null;
        }
        this.cleanOldProcessOnPort();
    }
}

module.exports = { TitanChromiumEngine };
