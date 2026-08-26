// BinStore.js - Fixed version with getMemoryUsage method
'use strict';

const { EventEmitter } = require('events');
const { Buffer } = require('buffer');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const zlib = require('zlib');
const util = require('util');

const gzip = util.promisify(zlib.gzip);
const gunzip = util.promisify(zlib.gunzip);

class BinStore extends EventEmitter {
    constructor(config = {}) {
        super();
        
        this.config = {
            maxBufferSize: config.maxBufferSize || 10 * 1024 * 1024,
            autoSync: config.autoSync !== false,
            compression: config.compression || false,
            compressionLevel: config.compressionLevel || 6,
            language: config.language || 'en',
            persistToFile: config.persistToFile || false,
            persistPath: config.persistPath || './binstore_data',
            maxHistory: config.maxHistory || 100,
            cacheSize: config.cacheSize || 1000,
            cacheTTL: config.cacheTTL || 60000,
            encryption: config.encryption || false,
            encryptionKey: config.encryptionKey,
            ...config
        };
        
        // Initialize storage buffers
        this.initializeBuffers();
        
        // Index tracking
        this.index = new Map();
        this.history = new Map();
        this.cache = new Map();
        this.cacheHits = 0;
        this.cacheMisses = 0;
        this.lruQueue = [];
        
        // Connection management
        this.connection = null;
        this.syncQueue = [];
        this.isSyncing = false;
        
        // Statistics
        this.stats = {
            operations: 0,
            writes: 0,
            reads: 0,
            syncs: 0,
            errors: 0,
            cacheHits: 0,
            cacheMisses: 0,
            startTime: Date.now(),
            compressionSavings: 0
        };
        
        // Fast KV store
        this.kvStore = new Map();
        
        // Performance monitoring
        this.operationTimings = new Map();
        this.lastCompaction = Date.now();
        
        // Initialize encryption if enabled
        if (this.config.encryption && this.config.encryptionKey) {
            this.initializeEncryption();
        }
        
        // Load persisted data if enabled
        if (this.config.persistToFile) {
            this.loadPersistedData().catch(console.error);
        }
        
        // Start maintenance tasks
        this.startMaintenanceTasks();
        
        console.log(`💾 BinStore v2.1 Initialized (${this.getMemoryUsage()})`);
    }
    
    // ==================== INITIALIZATION ====================
    
    initializeBuffers() {
        this.buffers = {
            // Hardware buffers
            gpio: Buffer.alloc(4096),
            pwm: Buffer.alloc(8192),
            i2c: Buffer.alloc(131072),
            spi: Buffer.alloc(65536),
            adc: Buffer.alloc(16384),
            dac: Buffer.alloc(8192),
            
            // Communication buffers
            uart: Buffer.alloc(32768),
            can: Buffer.alloc(65536),
            modbus: Buffer.alloc(32768),
            
            // Memory and storage
            memory: Buffer.alloc(2097152),
            flash: Buffer.alloc(1048576),
            eeprom: Buffer.alloc(65536),
            
            // Metadata
            meta: Buffer.alloc(16384),
            config: Buffer.alloc(8192),
            logs: Buffer.alloc(32768),
            
            // Custom data
            custom: new Map()
        };
        
        // Initialize hardware state cache
        this.hardwareState = new Map();
        
        // Initialize free space tracking
        this.freeSpace = new Map();
        this.freeBitmaps = new Map();
        
        for (const [type, buffer] of Object.entries(this.buffers)) {
            if (Buffer.isBuffer(buffer)) {
                this.freeSpace.set(type, buffer.length);
                const bitmapSize = Math.ceil(buffer.length / 512);
                this.freeBitmaps.set(type, Buffer.alloc(bitmapSize, 0xFF));
            }
        }
    }
    
    initializeEncryption() {
        try {
            const key = crypto.createHash('sha256')
                .update(this.config.encryptionKey)
                .digest();
            
            const iv = crypto.randomBytes(16);
            
            this.cipher = {
                encrypt: (data) => {
                    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
                    const encrypted = Buffer.concat([
                        cipher.update(data),
                        cipher.final()
                    ]);
                    const authTag = cipher.getAuthTag();
                    return Buffer.concat([iv, authTag, encrypted]);
                },
                decrypt: (data) => {
                    const iv = data.slice(0, 16);
                    const authTag = data.slice(16, 32);
                    const encrypted = data.slice(32);
                    
                    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
                    decipher.setAuthTag(authTag);
                    
                    return Buffer.concat([
                        decipher.update(encrypted),
                        decipher.final()
                    ]);
                }
            };
            
            console.log('🔐 Encryption initialized');
        } catch (error) {
            console.error('❌ Failed to initialize encryption:', error.message);
            this.config.encryption = false;
        }
    }
    
    startMaintenanceTasks() {
        // Cache cleanup every 30 seconds
        this.cacheCleanupInterval = setInterval(() => {
            this.cleanupCache();
        }, 30000);
        
        // Auto-compaction every 5 minutes
        this.compactionInterval = setInterval(() => {
            if (Date.now() - this.lastCompaction > 300000) {
                this.autoCompact();
            }
        }, 60000);
        
        // Statistics logging every minute
        this.statsInterval = setInterval(() => {
            this.logStatistics();
        }, 60000);
    }
    
    // ==================== MEMORY USAGE METHOD ====================
    
    getMemoryUsage() {
        let total = 0;
        
        // Calculate buffer sizes
        for (const buffer of Object.values(this.buffers)) {
            if (Buffer.isBuffer(buffer)) {
                total += buffer.length;
            } else if (buffer instanceof Map) {
                for (const entry of buffer.values()) {
                    total += entry.size || 0;
                }
            }
        }
        
        // Add estimated overhead
        total += this.index.size * 128;
        total += this.history.size * 192;
        total += this.cache.size * 256;
        total += this.kvStore.size * 160;
        
        // Format output
        if (total < 1024) return `${total} bytes`;
        if (total < 1024 * 1024) return `${(total / 1024).toFixed(2)} KB`;
        return `${(total / (1024 * 1024)).toFixed(2)} MB`;
    }
    
    // ==================== CORE STORAGE METHODS ====================
    
    async set(key, value, options = {}) {
        const operationId = crypto.randomBytes(8).toString('hex');
        const startTime = Date.now();
        
        try {
            if (!key) {
                throw new Error('Key cannot be empty');
            }
            
            const keyStr = Buffer.isBuffer(key) ? key.toString('hex') : String(key);
            
            // Check cache
            const cacheKey = `set:${keyStr}`;
            if (this.cache.has(cacheKey)) {
                this.stats.cacheHits++;
                return this.cache.get(cacheKey);
            }
            
            // Convert value to buffer
            let bufferValue = await this.processValue(value, options);
            
            // Apply compression if enabled
            if (this.config.compression && bufferValue.length > 100) {
                const compressed = await gzip(bufferValue, {
                    level: this.config.compressionLevel
                });
                
                if (compressed.length < bufferValue.length * 0.9) {
                    bufferValue = compressed;
                    options.compressed = true;
                    this.stats.compressionSavings += (bufferValue.length - compressed.length);
                }
            }
            
            // Apply encryption if enabled
            if (this.config.encryption && this.cipher) {
                bufferValue = this.cipher.encrypt(bufferValue);
                options.encrypted = true;
            }
            
            // Store the value
            const storeType = options.storeType || 'custom';
            const result = await this.storeValue(keyStr, bufferValue, storeType, options);
            
            // Update index
            const indexEntry = {
                key: keyStr,
                storeType,
                position: result.position,
                size: bufferValue.length,
                originalSize: Buffer.isBuffer(value) ? value.length : 
                             typeof value === 'string' ? Buffer.byteLength(value) : 0,
                timestamp: Date.now(),
                checksum: this.calculateChecksum(bufferValue),
                dataType: options.dataType || this.detectDataType(value),
                version: options.version || 1,
                metadata: {
                    ...options.metadata,
                    compressed: options.compressed || false,
                    encrypted: options.encrypted || false
                },
                accessCount: 0,
                lastAccessed: Date.now()
            };
            
            this.index.set(keyStr, indexEntry);
            
            // Store in fast KV store
            if (storeType === 'custom' || storeType === 'memory') {
                this.kvStore.set(keyStr, {
                    value: bufferValue,
                    metadata: indexEntry
                });
            }
            
            // Track history
            this.addToHistory(keyStr, 'set', {
                ...indexEntry,
                previousValue: this.getPreviousValue(keyStr),
                operationId
            });
            
            // Update statistics
            this.stats.operations++;
            this.stats.writes++;
            
            const duration = Date.now() - startTime;
            
            // Cache the result
            this.cacheResult(cacheKey, {
                success: true,
                operationId,
                key: keyStr,
                size: bufferValue.length,
                originalSize: indexEntry.originalSize,
                compressed: options.compressed || false,
                encrypted: options.encrypted || false,
                storeType,
                position: result.position,
                timestamp: indexEntry.timestamp,
                duration
            });
            
            // Emit events
            this.emit('set', {
                operationId,
                key: keyStr,
                size: bufferValue.length,
                storeType,
                timestamp: Date.now(),
                duration
            });
            
            console.log(`💾 SET ${keyStr} → ${bufferValue.length} bytes (${duration}ms)`);
            
            return {
                success: true,
                operationId,
                key: keyStr,
                size: bufferValue.length,
                checksum: indexEntry.checksum,
                storeType,
                position: result.position,
                timestamp: indexEntry.timestamp,
                duration
            };
            
        } catch (error) {
            this.stats.errors++;
            const duration = Date.now() - startTime;
            
            console.error(`❌ SET failed for ${key}:`, error.message);
            
            this.emit('error', {
                operationId,
                key: String(key),
                error: error.message,
                timestamp: Date.now(),
                duration
            });
            
            return {
                success: false,
                operationId,
                key: String(key),
                error: error.message,
                duration
            };
        }
    }
    
    async get(key, options = {}) {
        const startTime = Date.now();
        const keyStr = Buffer.isBuffer(key) ? key.toString('hex') : String(key);
        
        try {
            // Check cache first
            const cacheKey = `get:${keyStr}:${JSON.stringify(options)}`;
            if (options.useCache !== false && this.cache.has(cacheKey)) {
                this.stats.cacheHits++;
                const cached = this.cache.get(cacheKey);
                
                if (Date.now() - cached.timestamp < (options.cacheTTL || this.config.cacheTTL)) {
                    return options.includeMetadata ? cached : cached.value;
                }
            }
            
            this.stats.cacheMisses++;
            
            // Check fast KV store
            if (this.kvStore.has(keyStr)) {
                const kvEntry = this.kvStore.get(keyStr);
                kvEntry.metadata.accessCount++;
                kvEntry.metadata.lastAccessed = Date.now();
                
                let value = kvEntry.value;
                let metadata = { ...kvEntry.metadata };
                
                // Apply decryption if needed
                if (metadata.metadata?.encrypted && this.cipher) {
                    value = this.cipher.decrypt(value);
                }
                
                // Apply decompression if needed
                if (metadata.metadata?.compressed) {
                    value = await gunzip(value);
                }
                
                // Convert to requested format
                const result = this.convertValue(value, metadata.dataType, options);
                
                const duration = Date.now() - startTime;
                
                // Cache the result
                this.cacheResult(cacheKey, options.includeMetadata ? {
                    value: result,
                    metadata: metadata,
                    timestamp: Date.now(),
                    duration
                } : {
                    value: result,
                    timestamp: Date.now(),
                    duration
                });
                
                this.stats.operations++;
                this.stats.reads++;
                
                return options.includeMetadata ? {
                    value: result,
                    metadata: metadata,
                    duration
                } : result;
            }
            
            // Standard lookup
            const entry = this.index.get(keyStr);
            if (!entry) {
                if (options.throwIfMissing !== false) {
                    throw new Error(`Key not found: ${keyStr}`);
                }
                return options.defaultValue || null;
            }
            
            // Update access statistics
            entry.accessCount++;
            entry.lastAccessed = Date.now();
            this.index.set(keyStr, entry);
            
            let bufferValue;
            
            if (entry.storeType === 'custom') {
                const customEntry = this.buffers.custom.get(keyStr);
                if (!customEntry) {
                    throw new Error(`Custom entry not found: ${keyStr}`);
                }
                bufferValue = customEntry.value;
            } else {
                const buffer = this.buffers[entry.storeType];
                if (!buffer || !Buffer.isBuffer(buffer)) {
                    throw new Error(`Invalid buffer type: ${entry.storeType}`);
                }
                
                bufferValue = buffer.slice(entry.position, entry.position + entry.size);
            }
            
            // Verify checksum
            const currentChecksum = this.calculateChecksum(bufferValue);
            if (currentChecksum !== entry.checksum && options.verifyChecksum !== false) {
                console.warn(`⚠️ Checksum mismatch for ${keyStr}`);
            }
            
            // Apply decryption if needed
            if (entry.metadata?.encrypted && this.cipher) {
                bufferValue = this.cipher.decrypt(bufferValue);
            }
            
            // Apply decompression if needed
            if (entry.metadata?.compressed) {
                bufferValue = await gunzip(bufferValue);
            }
            
            // Convert to requested format
            const result = this.convertValue(bufferValue, entry.dataType, options);
            
            const duration = Date.now() - startTime;
            
            // Cache the result
            this.cacheResult(cacheKey, options.includeMetadata ? {
                value: result,
                metadata: entry,
                timestamp: Date.now(),
                duration
            } : {
                value: result,
                timestamp: Date.now(),
                duration
            });
            
            // Store in fast KV store
            if (!this.kvStore.has(keyStr)) {
                this.kvStore.set(keyStr, {
                    value: bufferValue,
                    metadata: entry
                });
            }
            
            this.stats.operations++;
            this.stats.reads++;
            
            return options.includeMetadata ? {
                value: result,
                metadata: entry,
                duration
            } : result;
            
        } catch (error) {
            this.stats.errors++;
            const duration = Date.now() - startTime;
            
            console.error(`❌ GET failed for ${keyStr}:`, error.message);
            
            return options.defaultValue || null;
        }
    }
    
    // ==================== UTILITY METHODS ====================
    
    async processValue(value, options) {
        if (Buffer.isBuffer(value)) {
            return value;
        }
        
        if (value === null || value === undefined) {
            return Buffer.from([0x00]);
        }
        
        if (typeof value === 'object') {
            return Buffer.from(JSON.stringify(value), 'utf8');
        }
        
        if (typeof value === 'number') {
            const buffer = Buffer.alloc(8);
            buffer.writeDoubleBE(value);
            return buffer;
        }
        
        if (typeof value === 'boolean') {
            return Buffer.from([value ? 1 : 0]);
        }
        
        return Buffer.from(String(value), options.encoding || 'utf8');
    }
    
    convertValue(buffer, dataType, options) {
        if (options.raw || dataType === 'binary') {
            return buffer;
        }
        
        if (dataType === 'json') {
            try {
                return JSON.parse(buffer.toString('utf8'));
            } catch {
                return buffer.toString('utf8');
            }
        }
        
        if (dataType === 'number') {
            if (buffer.length === 8) {
                return buffer.readDoubleBE(0);
            }
            return parseFloat(buffer.toString('utf8'));
        }
        
        if (dataType === 'boolean') {
            return buffer[0] === 1;
        }
        
        if (dataType === 'string') {
            return buffer.toString('utf8');
        }
        
        // Auto-detect
        if (buffer.length === 1) return buffer[0] === 1;
        if (buffer.length === 8) {
            try {
                return buffer.readDoubleBE(0);
            } catch {
                return buffer;
            }
        }
        
        try {
            return JSON.parse(buffer.toString('utf8'));
        } catch {
            return buffer.toString('utf8');
        }
    }
    
    detectDataType(value) {
        if (Buffer.isBuffer(value)) return 'binary';
        if (typeof value === 'object') return 'json';
        if (typeof value === 'number') return 'number';
        if (typeof value === 'boolean') return 'boolean';
        if (typeof value === 'string') return 'string';
        return 'binary';
    }
    
    calculateChecksum(buffer) {
        let checksum = 0;
        for (let i = 0; i < buffer.length; i++) {
            checksum = (checksum + buffer[i] * (i + 1)) & 0xFFFFFFFF;
        }
        return checksum.toString(16).padStart(8, '0');
    }
    
    async storeValue(key, value, storeType, options) {
        if (storeType === 'custom') {
            const entry = {
                value,
                timestamp: Date.now(),
                checksum: this.calculateChecksum(value),
                size: value.length,
                type: options.dataType || 'binary',
                version: options.version || 1
            };
            
            this.buffers.custom.set(key, entry);
            return { position: 0, buffer: 'custom' };
        }
        
        const buffer = this.buffers[storeType];
        if (!Buffer.isBuffer(buffer)) {
            throw new Error(`Invalid buffer type: ${storeType}`);
        }
        
        // Find free position
        const position = this.findFreePosition(storeType, value.length);
        if (position === -1) {
            throw new Error(`No space available in ${storeType} buffer`);
        }
        
        value.copy(buffer, position);
        return { position, buffer: storeType };
    }
    
    findFreePosition(bufferType, size) {
        const buffer = this.buffers[bufferType];
        if (!Buffer.isBuffer(buffer)) return 0;
        
        for (let i = 0; i <= buffer.length - size; i++) {
            let free = true;
            for (let j = 0; j < size; j++) {
                if (buffer[i + j] !== 0) {
                    free = false;
                    break;
                }
            }
            if (free) return i;
        }
        
        return -1;
    }
    
    // ==================== CACHE MANAGEMENT ====================
    
    cacheResult(key, value) {
        if (this.cache.size >= this.config.cacheSize) {
            const oldestKey = this.lruQueue.shift();
            if (oldestKey) {
                this.cache.delete(oldestKey);
            }
        }
        
        this.cache.set(key, value);
        this.lruQueue.push(key);
    }
    
    cleanupCache() {
        const now = Date.now();
        const ttl = this.config.cacheTTL;
        
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > ttl) {
                this.cache.delete(key);
                const index = this.lruQueue.indexOf(key);
                if (index > -1) {
                    this.lruQueue.splice(index, 1);
                }
            }
        }
    }
    
    // ==================== HISTORY MANAGEMENT ====================
    
    addToHistory(key, operation, data) {
        if (!this.history.has(key)) {
            this.history.set(key, []);
        }
        
        const history = this.history.get(key);
        history.push({
            operation,
            timestamp: Date.now(),
            data,
            sequence: history.length
        });
        
        if (history.length > this.config.maxHistory) {
            history.splice(0, history.length - this.config.maxHistory);
        }
    }
    
    getPreviousValue(key) {
        const history = this.history.get(key);
        if (!history || history.length < 2) return null;
        
        const prevEntry = history[history.length - 2];
        return prevEntry.data.oldValue || prevEntry.data.value || null;
    }
    
    // ==================== BASIC METHODS ====================
    
    async delete(key) {
        const startTime = Date.now();
        const keyStr = Buffer.isBuffer(key) ? key.toString('hex') : String(key);
        
        try {
            const entry = this.index.get(keyStr);
            if (!entry) {
                return {
                    success: false,
                    error: `Key not found: ${keyStr}`,
                    duration: Date.now() - startTime
                };
            }
            
            const oldValue = await this.get(key, { raw: true });
            
            // Remove from storage
            if (entry.storeType === 'custom') {
                this.buffers.custom.delete(keyStr);
            } else {
                const buffer = this.buffers[entry.storeType];
                if (buffer && Buffer.isBuffer(buffer)) {
                    buffer.fill(0, entry.position, entry.position + entry.size);
                }
            }
            
            // Remove from index and KV store
            this.index.delete(keyStr);
            this.kvStore.delete(keyStr);
            
            // Add to history
            this.addToHistory(keyStr, 'delete', { oldValue });
            
            // Update statistics
            this.stats.operations++;
            
            const duration = Date.now() - startTime;
            
            this.emit('delete', {
                key: keyStr,
                storeType: entry.storeType,
                size: entry.size,
                timestamp: Date.now()
            });
            
            console.log(`🗑️ DELETE ${keyStr} (${duration}ms)`);
            
            return {
                success: true,
                key: keyStr,
                size: entry.size,
                storeType: entry.storeType,
                duration
            };
            
        } catch (error) {
            this.stats.errors++;
            const duration = Date.now() - startTime;
            
            console.error(`❌ DELETE failed for ${keyStr}:`, error.message);
            
            return {
                success: false,
                key: keyStr,
                error: error.message,
                duration
            };
        }
    }
    
    has(key) {
        const keyStr = Buffer.isBuffer(key) ? key.toString('hex') : String(key);
        return this.index.has(keyStr);
    }
    
    // ==================== STATISTICS ====================
    
    getStats() {
        const now = Date.now();
        const uptime = now - this.stats.startTime;
        
        return {
            ...this.stats,
            uptime,
            uptimeFormatted: this.formatDuration(uptime),
            indexSize: this.index.size,
            historySize: this.history.size,
            cacheSize: this.cache.size,
            kvStoreSize: this.kvStore.size,
            memoryUsage: this.getMemoryUsage(),
            timestamp: now
        };
    }
    
    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days}d ${hours % 24}h`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }
    
    logStatistics() {
        const stats = this.getStats();
        console.log('📊 BinStore Statistics:', {
            uptime: stats.uptimeFormatted,
            operations: stats.operations,
            cacheSize: stats.cacheSize,
            memoryUsage: stats.memoryUsage
        });
    }
    
    // ==================== MAINTENANCE ====================
    
    compactBuffer(bufferType) {
        const buffer = this.buffers[bufferType];
        if (!Buffer.isBuffer(buffer)) return;
        
        const entries = [];
        for (const [key, entry] of this.index.entries()) {
            if (entry.storeType === bufferType) {
                entries.push({ key, entry });
            }
        }
        
        entries.sort((a, b) => a.entry.position - b.entry.position);
        
        let currentPos = 0;
        for (const { key, entry } of entries) {
            if (entry.position !== currentPos) {
                const data = buffer.slice(entry.position, entry.position + entry.size);
                data.copy(buffer, currentPos);
                entry.position = currentPos;
                this.index.set(key, entry);
            }
            currentPos += entry.size;
        }
        
        buffer.fill(0, currentPos);
        
        console.log(`🔧 Compacted ${bufferType}: ${currentPos} bytes used`);
    }
    
    autoCompact() {
        console.log('🔧 Starting auto-compaction...');
        
        for (const [type, buffer] of Object.entries(this.buffers)) {
            if (Buffer.isBuffer(buffer)) {
                this.compactBuffer(type);
            }
        }
        
        this.lastCompaction = Date.now();
        console.log('🔧 Auto-compaction completed');
    }
    
    // ==================== CLEANUP ====================
    
    clear() {
        // Clear all buffers
        for (const [type, buffer] of Object.entries(this.buffers)) {
            if (Buffer.isBuffer(buffer)) {
                buffer.fill(0);
            } else if (buffer instanceof Map) {
                buffer.clear();
            }
        }
        
        // Clear data structures
        this.index.clear();
        this.history.clear();
        this.cache.clear();
        this.kvStore.clear();
        this.lruQueue = [];
        
        // Reset free space
        for (const [type, buffer] of Object.entries(this.buffers)) {
            if (Buffer.isBuffer(buffer)) {
                this.freeSpace.set(type, buffer.length);
            }
        }
        
        // Reset stats
        const startTime = this.stats.startTime;
        this.stats = {
            operations: 0,
            writes: 0,
            reads: 0,
            syncs: 0,
            errors: 0,
            cacheHits: 0,
            cacheMisses: 0,
            startTime,
            compressionSavings: 0
        };
        
        console.log('🧹 BinStore cleared');
        this.emit('clear');
    }
    
    destroy() {
        // Clear intervals
        if (this.cacheCleanupInterval) clearInterval(this.cacheCleanupInterval);
        if (this.compactionInterval) clearInterval(this.compactionInterval);
        if (this.statsInterval) clearInterval(this.statsInterval);
        
        // Clear all data
        this.clear();
        
        // Remove all listeners
        this.removeAllListeners();
        
        console.log('♻️ BinStore destroyed');
    }
}

module.exports = BinStore;