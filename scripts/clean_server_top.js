'use strict';

const fs = require('fs');

const serverPath = 'd:\\danphe-ui\\server.js';
let content = fs.readFileSync(serverPath, 'utf8');

// Replace everything between </aside> (the global drawer) and <main class=
const regex = /<!-- Main Container -->[\s\S]*?<!-- 🐬 PURE 3-COLUMN PROFESSIONAL VIDEO STUDIO WORKSPACE -->\s*<main[^>]*>/;
if (regex.test(content)) {
    content = content.replace(regex, '<!-- 🐬 PURE 3-COLUMN PROFESSIONAL VIDEO STUDIO WORKSPACE -->\n    <main class="w-full min-h-screen p-2 m-0 flex flex-col gap-2 max-w-[1920px] mx-auto">');
    fs.writeFileSync(serverPath, content, 'utf8');
    console.log('✅ Successfully cleaned server.js to pure top 0 layout!');
} else {
    console.log('⚠️ Pattern not found directly, checking alternative pattern...');
    const p1 = content.indexOf('<!-- Main Container -->');
    const p2 = content.indexOf('<!-- 🐬 PURE 3-COLUMN PROFESSIONAL VIDEO STUDIO WORKSPACE -->');
    if (p1 !== -1 && p2 !== -1) {
        content = content.slice(0, p1) + '<!-- 🐬 PURE 3-COLUMN PROFESSIONAL VIDEO STUDIO WORKSPACE -->\n    <main class="w-full min-h-screen p-2 m-0 flex flex-col gap-2 max-w-[1920px] mx-auto">' + content.slice(p2 + '<!-- 🐬 PURE 3-COLUMN PROFESSIONAL VIDEO STUDIO WORKSPACE -->\n    <main class="w-full min-h-screen p-3 sm:p-5 flex flex-col gap-4 max-w-[1920px] mx-auto">'.length);
        fs.writeFileSync(serverPath, content, 'utf8');
        console.log('✅ Sliced and cleaned server.js successfully!');
    }
}
