'use strict';

const fs = require('fs');

const serverPath = 'd:\\danphe-ui\\server.js';
let content = fs.readFileSync(serverPath, 'utf8');

const pListen = content.indexOf('server.listen(PORT, () => {');
const pEnd = content.indexOf('});', pListen);

if (pEnd !== -1) {
    content = content.slice(0, pEnd + 3) + '\n';
    fs.writeFileSync(serverPath, content, 'utf8');
    console.log('✅ Cleanly truncated server.js at server.listen closing bracket!');
}
