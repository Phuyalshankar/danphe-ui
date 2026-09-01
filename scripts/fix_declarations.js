'use strict';

const fs = require('fs');

const serverPath = 'd:\\danphe-ui\\server.js';
let content = fs.readFileSync(serverPath, 'utf8');

// Find where fontsGridHtml and animCss were placed
const pAnimCss = content.indexOf('const animCss = generateAnimationCSS();');
const pMain = content.indexOf('<!-- 🐬 PURE 3-COLUMN PROFESSIONAL VIDEO STUDIO WORKSPACE -->');

if (pAnimCss !== -1 && pMain !== -1 && pAnimCss < pMain) {
    const declarations = content.slice(pAnimCss, pMain);
    
    // Remove declarations from inside the HTML template
    content = content.slice(0, pAnimCss) + content.slice(pMain);
    
    // Insert declarations before `return `<!DOCTYPE html>`
    const pReturn = content.indexOf('return `<!DOCTYPE html>');
    content = content.slice(0, pReturn) + declarations + '\n    ' + content.slice(pReturn);
    
    fs.writeFileSync(serverPath, content, 'utf8');
    console.log('✅ Successfully moved variable declarations above return statement!');
}
