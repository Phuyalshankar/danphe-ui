'use strict';

const fs = require('fs');

const serverPath = 'd:\\danphe-ui\\server.js';
let content = fs.readFileSync(serverPath, 'utf8');

const pReturn = content.indexOf('return `<!DOCTYPE html>');
const returnContent = content.slice(pReturn);

// Let's find any `</div>\`;\s*\}\)\.join\(''\);` in returnContent
const regex = /<\/div>\s*<\/div>\s*<\/div>\s*<div>\s*<h4[^>]*>\$\{a\.name\}<\/h4>[\s\S]*?\}\)\.join\(''\);/;

if (regex.test(returnContent)) {
    const fixedReturnContent = returnContent.replace(regex, '');
    content = content.slice(0, pReturn) + fixedReturnContent;
    fs.writeFileSync(serverPath, content, 'utf8');
    console.log('✅ Removed corrupted join snippet from return statement!');
} else {
    console.log('⚠️ Regex did not match, checking manual index...');
    const pBad = content.indexOf('${a.name}');
    if (pBad !== -1) {
        console.log('Found ${a.name} around index:', pBad);
        const pJoin = content.indexOf("}).join('');", pBad);
        if (pJoin !== -1) {
            content = content.slice(0, pBad - 100) + content.slice(pJoin + "}).join('');".length);
            fs.writeFileSync(serverPath, content, 'utf8');
            console.log('✅ Manually removed corrupted snippet!');
        }
    }
}
