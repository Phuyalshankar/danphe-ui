'use strict';

const path = require('path');
const fs = require('fs');
const { DevServer } = require('./src/runtime/DevServer');

const HTTP_PORT = process.env.PORT || 7787;
const TCP_PORT = process.env.TCP_PORT || 7788;

const projectRoot = __dirname;
const appPath = path.resolve(projectRoot, 'app.jsx');

console.log('🐬 Starting Dolphin Native V2 Dual-Target Web & Native Server...');
console.log(`📁 Project Root: ${projectRoot}`);
console.log(`📄 App Entry: ${appPath}`);

const config = fs.existsSync(path.resolve(projectRoot, 'dolphin.config.js')) 
    ? require(path.resolve(projectRoot, 'dolphin.config.js')) 
    : {};

const server = new DevServer({
    host: '0.0.0.0',
    port: TCP_PORT,
    httpPort: HTTP_PORT,
    watchDir: projectRoot
});

global.dolphinDevServer = server;

server.start().then(() => {
    console.log(`🌐 Dolphin Web Preview Live at http://localhost:${HTTP_PORT}/`);
    console.log(`📊 Dolphin Admin Dashboard Live at http://localhost:${HTTP_PORT}/dashboard`);
    console.log(`📱 Dolphin TCP Native Streaming on port ${TCP_PORT}`);
}).catch(err => {
    console.error('❌ Failed to start Dolphin V2 server:', err);
});
