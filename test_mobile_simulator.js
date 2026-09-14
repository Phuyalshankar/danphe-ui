'use strict';

const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');
const { renderTitanMobileSimulator } = require('./lib/TitanMobileSimulator');
const { TitanChromiumEngine } = require('./lib/TitanChromiumEngine');

// ── 0. START REAL CHROMIUM 60FPS HEADLESS ENGINE (Mobile Viewport 390x780) ──
const chromiumEngine = new TitanChromiumEngine({
    port: 9222,
    wsPort: 3006,
    width: 390,
    height: 780,
    initialUrl: 'https://en.m.wikipedia.org/wiki/Nepal'
});

chromiumEngine.start().then((started) => {
    if (started) {
        console.log('⚡ [Chromium Engine] Running at native speed with Screencast & Input Bridge!');
    } else {
        console.log('⚠️ [Chromium Engine] Headless browser fallback mode active.');
    }
}).catch((err) => {
    console.error('Error starting chromium engine:', err);
});

// ── 1. HIGH-SPEED LOCAL VIDEO STREAMER (Supports HTTP 206 Partial Range) ──
function handleVideoStreaming(req, res, videoName) {
    const safeName = path.basename(videoName || 'tiktok.mp4');
    const filePath = path.join(__dirname, 'assets', 'videos', safeName);

    if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Video not found');
        return;
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(filePath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
            'Access-Control-Allow-Origin': '*'
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
            'Accept-Ranges': 'bytes',
            'Access-Control-Allow-Origin': '*'
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
}

// ── 2. STREAMING MOBILE WEB PROXY (Bypasses X-Frame-Options) ──
function handleProxyRequest(req, res) {
    try {
        const parsedReqUrl = url.parse(req.url, true);
        let targetUrl = parsedReqUrl.query.url;

        if (!targetUrl) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Missing url');
            return;
        }

        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            targetUrl = 'https://' + targetUrl;
        }

        const fetchUrl = (target, redirectCount = 0) => {
            if (redirectCount > 5) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Too many redirects');
                return;
            }

            const parsedTarget = url.parse(target);
            const isHttps = parsedTarget.protocol === 'https:';
            const client = isHttps ? https : http;

            const options = {
                protocol: parsedTarget.protocol,
                hostname: parsedTarget.hostname,
                host: parsedTarget.host,
                port: parsedTarget.port || (isHttps ? 443 : 80),
                path: parsedTarget.path || '/',
                method: req.method,
                rejectUnauthorized: false,
                headers: {
                    'Host': parsedTarget.host,
                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9'
                }
            };

            const proxyReq = client.request(options, (proxyRes) => {
                if ([301, 302, 303, 307, 308].includes(proxyRes.statusCode) && proxyRes.headers.location) {
                    let redirectLocation = proxyRes.headers.location;
                    if (!redirectLocation.startsWith('http://') && !redirectLocation.startsWith('https://')) {
                        redirectLocation = url.resolve(target, redirectLocation);
                    }
                    fetchUrl(redirectLocation, redirectCount + 1);
                    return;
                }

                const responseHeaders = Object.assign({}, proxyRes.headers);
                delete responseHeaders['x-frame-options'];
                delete responseHeaders['content-security-policy'];
                delete responseHeaders['content-security-policy-report-only'];
                delete responseHeaders['strict-transport-security'];

                responseHeaders['access-control-allow-origin'] = '*';
                responseHeaders['access-control-allow-methods'] = 'GET, POST, OPTIONS';

                const contentType = responseHeaders['content-type'] || '';

                if (contentType.includes('text/html')) {
                    let bodyChunks = [];
                    proxyRes.on('data', chunk => bodyChunks.push(chunk));
                    proxyRes.on('end', () => {
                        let html = Buffer.concat(bodyChunks).toString('utf-8');
                        const origin = `${parsedTarget.protocol}//${parsedTarget.host}`;

                        const injection = `
                            <base href="${origin}/">
                            <style> body { -webkit-text-size-adjust: 100%; font-family: sans-serif; } </style>
                            <script>
                                document.addEventListener('click', function(e) {
                                    const a = e.target.closest('a');
                                    if (a && a.href && !a.href.startsWith('javascript:') && !a.href.startsWith('#')) {
                                        e.preventDefault();
                                        window.location.href = '/api/proxy?url=' + encodeURIComponent(a.href);
                                    }
                                });
                            </script>
                        `;

                        if (html.includes('<head>')) {
                            html = html.replace('<head>', '<head>' + injection);
                        } else {
                            html = injection + html;
                        }

                        responseHeaders['content-length'] = Buffer.byteLength(html);
                        res.writeHead(proxyRes.statusCode, responseHeaders);
                        res.end(html);
                    });
                } else {
                    res.writeHead(proxyRes.statusCode, responseHeaders);
                    proxyRes.pipe(res);
                }
            });

            proxyReq.on('error', (err) => {
                res.writeHead(502, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`
                    <div style="font-family:sans-serif;padding:30px;text-align:center;color:#eee;background:#0f172a;min-height:100vh;">
                        <h3 style="color:#f43f5e;">⚠️ Could not connect to site</h3>
                        <p style="color:#94a3b8;font-size:12px;">${err.message}</p>
                    </div>
                `);
            });

            if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
                req.pipe(proxyReq);
            } else {
                proxyReq.end();
            }
        };

        fetchUrl(targetUrl);
    } catch (e) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Proxy Error: ' + e.message);
    }
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Danphe-UI — Real Chromium 60FPS Mobile Phone Simulator</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            background: radial-gradient(circle at 50% 10%, #0f172a 0%, #020617 100%);
            min-height: 100vh;
            color: #f8fafc;
            font-family: system-ui, -apple-system, sans-serif;
        }
    </style>
</head>
<body class="p-4 md:p-6 flex flex-col items-center justify-center min-h-screen">
    
    <div class="max-w-4xl w-full text-center mb-4">
        <h1 class="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400">
            📱 Danphe-UI Titanium Mobile Simulator (Real Chromium Engine)
        </h1>
        <p class="text-xs text-slate-400 font-mono mt-1">
            ⚡ 60FPS Screencast Stream • Real Chromium Browser • Live TikTok / 抖音 / YouTube / FB • 1-Click Timeline Grabber
        </p>
    </div>

    <!-- Live Rendered Simulator -->
    ${renderTitanMobileSimulator({
        id: 'phone-sim-demo',
        width: 390,
        height: 780,
        deviceModel: 'iPhone 16 Pro Max Titanium',
        deviceColor: 'titanium',
        initialUrl: 'https://en.m.wikipedia.org/wiki/Nepal',
        batteryPct: 96,
        wsUrl: 'ws://localhost:3006'
    })}

</body>
</html>`;

const server = http.createServer((req, res) => {
    // 1. Video Streaming Route
    if (req.url.startsWith('/api/video')) {
        const parsed = url.parse(req.url, true);
        const name = parsed.query.name || 'tiktok.mp4';
        handleVideoStreaming(req, res, name);
        return;
    }

    // 2. Direct /assets/videos/... Route
    if (req.url.startsWith('/assets/videos/')) {
        const videoName = req.url.replace('/assets/videos/', '');
        handleVideoStreaming(req, res, videoName);
        return;
    }

    // 3. Web Proxy Route
    if (req.url.startsWith('/api/proxy')) {
        handleProxyRequest(req, res);
        return;
    }

    // 4. Main HTML Page
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
});

const PORT = 3005;
server.listen(PORT, () => {
    console.log(`📱 Danphe Mobile Simulator Running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
    chromiumEngine.stop();
    process.exit(0);
});
process.on('SIGTERM', () => {
    chromiumEngine.stop();
    process.exit(0);
});
