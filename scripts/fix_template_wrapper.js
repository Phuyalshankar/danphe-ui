'use strict';

const fs = require('fs');

const serverPath = 'd:\\danphe-ui\\server.js';
let content = fs.readFileSync(serverPath, 'utf8');

// Find where `return \`<!DOCTYPE html>` was placed
const pReturn = content.indexOf('return `<!DOCTYPE html>');
const pMain = content.indexOf('<!-- 🐬 PURE 3-COLUMN PROFESSIONAL VIDEO STUDIO WORKSPACE -->');

// Everything from return `<!DOCTYPE html> to </head>\n<body ...>` should wrap the <main>
const pBodyStart = content.indexOf('<body id="master-page-body"', pReturn);
const headAndBody = content.slice(pReturn, pBodyStart + '<body id="master-page-body" class="bg-slate-950 text-slate-100 min-h-screen flex flex-col items-center justify-start p-4 sm:p-8 font-sans transition-all duration-500">'.length);

// Clean up: Remove headAndBody from where it is, and put it right before <main
content = content.replace(headAndBody, '');
const pMainNew = content.indexOf('<!-- 🐬 PURE 3-COLUMN PROFESSIONAL VIDEO STUDIO WORKSPACE -->');
content = content.slice(0, pMainNew) + headAndBody + '\n\n    ' + content.slice(pMainNew);

fs.writeFileSync(serverPath, content, 'utf8');
console.log('✅ Properly structured renderFullPage return block!');
