'use strict';

const MAX_BUFFER_SIZE = 100 * 1024 * 1024;
const MAX_CACHE_SIZE = 10000;
const MAX_KEY_LENGTH = 255;
const VERSION = '4.0.0';

const DEFAULT_CONFIG = {
    version: VERSION,
    debug: false,
    hardware: false,
    compression: true,
    validation: true,
    maxCacheSize: MAX_CACHE_SIZE,
    maxBufferSize: MAX_BUFFER_SIZE,
    language: 'en',
    logLevel: 'info',
    enableMetrics: true,
    autoCompact: true,
    encryption: false,
    encryptionKey: null,
    platform: 'NORMAL',
    alignment: 'strict'
};

module.exports = {
    MAX_BUFFER_SIZE,
    MAX_CACHE_SIZE,
    MAX_KEY_LENGTH,
    VERSION,
    DEFAULT_CONFIG
};