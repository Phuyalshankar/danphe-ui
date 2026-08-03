'use strict';

const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const { DevServer } = require('./src/runtime/DevServer');
const { DynamicUICopierPlugin, TitanBinaryEncoder } = require('./src/engine/index');

const HTTP_PORT = process.env.PORT || 7787;
const TCP_PORT = process.env.TCP_PORT || 7788;

const server = new DevServer({
    port: TCP_PORT,
    httpPort: HTTP_PORT,
    watchDir: process.cwd()
});

console.log('🐬 Initializing Dolphin Native V2 Server & Dashboard Engine...');

server.start().then(() => {
    console.log(`🌐 Dolphin Native V2 Dashboard Live at http://localhost:${HTTP_PORT}/dashboard`);
    console.log(`📱 Dolphin Native V2 TCP Streaming on port ${TCP_PORT}`);
}).catch(err => {
    console.error('❌ Failed to start Dolphin V2 server:', err);
});

module.exports = server;
