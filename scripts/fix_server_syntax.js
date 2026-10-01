'use strict';

const fs = require('fs');

const serverPath = 'd:\\danphe-ui\\server.js';
let content = fs.readFileSync(serverPath, 'utf8');

// Find the first <body id="master-page-body" up to the second return `<!DOCTYPE html>
const p1 = content.indexOf('<body id="master-page-body"');
const p2 = content.indexOf('return `<!DOCTYPE html>');

if (p1 !== -1 && p2 !== -1 && p1 < p2) {
    content = content.slice(0, p1) + content.slice(p2);
    fs.writeFileSync(serverPath, content, 'utf8');
    console.log('✅ Removed duplicate body chunk before return statement!');
} else {
    console.log('⚠️ Chunk indices not matched: p1=' + p1 + ', p2=' + p2);
}
