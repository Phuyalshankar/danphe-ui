'use strict';

const http = require('http');
const { renderTitanMobileSimulator } = require('./lib/TitanMobileSimulator');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Danphe-UI — SVG Mobile Phone Simulator & Real Live Browser</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            background: radial-gradient(circle at 50% 10%, #0f172a 0%, #020617 100%);
            min-height: 100vh;
            color: #f8fafc;
        }
    </style>
</head>
<body class="p-6 flex flex-col items-center justify-center min-h-screen">
    
    <div class="max-w-4xl w-full text-center mb-6">
        <h1 class="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
            📱 Danphe-UI Titanium Mobile Simulator
        </h1>
        <p class="text-xs text-slate-400 font-mono mt-1">
            Ultra-Realistic SVG Hardware Frame • Live Embedded Web Browser Viewport • Clickable Physical Hardware Buttons
        </p>
    </div>

    <!-- Live Rendered Simulator -->
    ${renderTitanMobileSimulator({
        id: 'phone-sim-demo',
        width: 380,
        height: 760,
        deviceModel: 'iPhone 16 Pro Titanium',
        deviceColor: 'titanium',
        initialUrl: 'https://en.wikipedia.org/wiki/Nepal',
        initialApp: 'browser',
        batteryPct: 96
    })}

</body>
</html>`;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
});

const PORT = 3005;
server.listen(PORT, () => {
    console.log(`📱 Danphe Mobile Simulator Running on http://localhost:${PORT}`);
});
