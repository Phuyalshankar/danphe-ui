'use strict';

const http = require('http');
const https = require('https');
const url = require('url');
const { renderTitanMobileSimulator } = require('./lib/TitanMobileSimulator');

// ── ROBUST STREAMING MOBILE PROXY ENGINE ──
function handleProxyRequest(req, res) {
    try {
        const parsedReqUrl = url.parse(req.url, true);
        let targetUrl = parsedReqUrl.query.url;

        if (!targetUrl) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Missing "url" query parameter');
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
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9'
                }
            };

            const proxyReq = client.request(options, (proxyRes) => {
                // Follow 301, 302, 303, 307 Redirects
                if ([301, 302, 303, 307, 308].includes(proxyRes.statusCode) && proxyRes.headers.location) {
                    let redirectLocation = proxyRes.headers.location;
                    if (!redirectLocation.startsWith('http://') && !redirectLocation.startsWith('https://')) {
                        redirectLocation = url.resolve(target, redirectLocation);
                    }
                    fetchUrl(redirectLocation, redirectCount + 1);
                    return;
                }

                const responseHeaders = Object.assign({}, proxyRes.headers);

                // Strip Iframe-blocking headers
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

                        // Inject <base href="..."> so relative paths work, and click interceptor
                        const injection = `
                            <base href="${origin}/">
                            <style>
                                body { -webkit-text-size-adjust: 100%; }
                            </style>
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
    <title>Danphe-UI — Titanium Mobile Simulator & Live Browser</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            background: radial-gradient(circle at 50% 10%, #0f172a 0%, #020617 100%);
            min-height: 100vh;
            color: #f8fafc;
            font-family: system-ui, -apple-system, sans-serif;
        }
        .mode-tab {
            cursor: pointer !important;
            user-select: none;
        }
    </style>
</head>
<body class="p-4 md:p-8 flex flex-col items-center justify-center min-h-screen">
    
    <div class="max-w-4xl w-full text-center mb-6">
        <h1 class="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
            📱 Danphe-UI Titanium Mobile Simulator
        </h1>
        <p class="text-xs text-slate-400 font-mono mt-1">
            Live Web Browser • TikTok / Douyin / Facebook Reels Grabber to Video Editor Timeline
        </p>
    </div>

    <!-- Live Rendered Simulator -->
    ${renderTitanMobileSimulator({
        id: 'phone-sim-demo',
        width: 390,
        height: 780,
        deviceModel: 'iPhone 16 Pro Titanium',
        deviceColor: 'titanium',
        initialUrl: 'https://en.wikipedia.org/wiki/Nepal',
        initialApp: 'tiktok',
        batteryPct: 96
    })}

</body>
</html>`;

const server = http.createServer((req, res) => {
    if (req.url.startsWith('/api/proxy')) {
        handleProxyRequest(req, res);
        return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
});

const PORT = 3005;
server.listen(PORT, () => {
    console.log(`📱 Danphe Mobile Simulator Running on http://localhost:${PORT}`);
});
