'use strict';

const http = require('http');
const { ICONS, NAME_TO_ID, getIconSvg } = require('./src/ui/TitanIconBundle');

const PORT = 3000;

const server = http.createServer((req, res) => {
    if (req.url.startsWith('/api/icon/')) {
        const query = req.url.replace('/api/icon/', '').split('?')[0];
        const svg = getIconSvg(query);
        res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
        return res.end(svg);
    }

    // Build interactive HTML catalog of all 255 icons
    let iconCardsHtml = '';
    const entries = Object.entries(ICONS);
    entries.forEach(([name, id]) => {
        const svg = getIconSvg(id);
        iconCardsHtml += `
            <div class="card" onclick="selectIcon('${name}', ${id})">
                <div class="icon-wrap">${svg}</div>
                <div class="id-badge">#${id}</div>
                <div class="name">${name}</div>
            </div>
        `;
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>👑 Titan 255 Master Telecom Icon Bundle</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background: #0b0f19; color: #f1f5f9; padding: 24px; }
        header { display: flex; align-items: center; justify-content: space-between; border-b: 1px solid #1e293b; padding-bottom: 20px; margin-bottom: 24px; }
        h1 { font-size: 24px; font-weight: 900; background: linear-gradient(135deg, #38bdf8, #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .tagline { font-size: 13px; color: #94a3b8; margin-top: 4px; }
        .search-bar { width: 100%; max-width: 400px; padding: 10px 16px; border-radius: 12px; background: #1e293b; border: 1px solid #334155; color: #fff; font-size: 14px; outline: none; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 14px; }
        .card { background: #131b2e; border: 1px solid #1e293b; border-radius: 16px; padding: 14px 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; text-align: center; }
        .card:hover { transform: translateY(-3px); border-color: #38bdf8; background: #1e293b; box-shadow: 0 10px 25px rgba(56, 189, 248, 0.15); }
        .icon-wrap { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
        .icon-wrap svg { width: 32px; height: 32px; }
        .id-badge { font-size: 11px; font-weight: 800; color: #38bdf8; background: #0c4a6e; padding: 2px 8px; border-radius: 10px; margin-bottom: 4px; }
        .name { font-size: 11px; font-weight: 600; color: #cbd5e1; word-break: break-all; }
        .toast { position: fixed; bottom: 24px; right: 24px; background: #10b981; color: #fff; padding: 12px 20px; border-radius: 12px; font-weight: 700; font-size: 13px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: none; }
    </style>
</head>
<body>
    <header>
        <div>
            <h1>👑 Titan 255 Master Telecom Icon Bundle</h1>
            <div class="tagline">Danphe-UI Native Vector Engine • Live on Port ${PORT}</div>
        </div>
        <input type="text" id="search" class="search-bar" placeholder="Search by name (e.g. missed, video, wifi)..." oninput="filterIcons()">
    </header>

    <div class="grid" id="iconGrid">
        ${iconCardsHtml}
    </div>

    <div id="toast" class="toast"></div>

    <script>
        function filterIcons() {
            const query = document.getElementById('search').value.toLowerCase();
            const cards = document.querySelectorAll('.card');
            cards.forEach(c => {
                const name = c.querySelector('.name').innerText.toLowerCase();
                const id = c.querySelector('.id-badge').innerText.toLowerCase();
                if (name.includes(query) || id.includes(query)) {
                    c.style.display = 'flex';
                } else {
                    c.style.display = 'none';
                }
            });
        }

        function selectIcon(name, id) {
            const toast = document.getElementById('toast');
            toast.innerText = 'Copied: <TitanIcon id={' + id + '} /> /* ' + name + ' */';
            toast.style.display = 'block';
            navigator.clipboard.writeText('<TitanIcon id={' + id + '} />');
            setTimeout(() => { toast.style.display = 'none'; }, 2000);
        }
    </script>
</body>
</html>`;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
});

server.on('error', (e) => {
    console.error('Server error:', e);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Titan 255 Master Icon Test Server running at http://localhost:${PORT}`);
});
