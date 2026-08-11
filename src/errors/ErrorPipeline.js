// src/errors/ErrorPipeline.js

class ErrorPipeline {
    constructor() {
        this.errors = [];
        this.listeners = [];
        this.cache = new Map();
    }

    // ✅ File register गर्ने
    registerFile(fileName, filePath) {
        this.cache.set(filePath, {
            fileName,
            filePath,
            status: 'active',
            errors: [],
            lastError: null
        });
        console.log(`[ErrorPipeline] Registered file: ${fileName}`);
    }

    // ✅ Error capture गर्ने
    capture(error, context) {
        const errorEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            file: context.file || 'unknown',
            function: context.function || 'unknown',
            line: context.line || 0,
            message: error.message || (error && error.toString()) || 'Unknown Error',
            stack: error.stack || '',
            type: error.type || 'runtime',
            severity: context.severity || 'error'
        };

        this.errors.push(errorEntry);
        
        // File-specific error store
        if (context.file && this.cache.has(context.file)) {
            const fileData = this.cache.get(context.file);
            fileData.errors.push(errorEntry);
            fileData.lastError = errorEntry;
        }

        // Print to Console clearly
        console.error(`\n🚨 [PIPELINE ERROR] ${errorEntry.file} -> ${errorEntry.function}() Line ${errorEntry.line}`);
        console.error(`💥 Message: ${errorEntry.message}\n`);

        this.notify(errorEntry);
        this.sendToKotlin(errorEntry);

        return errorEntry;
    }

    notify(errorEntry) {
        this.listeners.forEach(listener => {
            try {
                listener(errorEntry);
            } catch (e) {
                // Silent fail
            }
        });
    }

    sendToKotlin(errorEntry) {
        try {
            const errorStr = JSON.stringify(errorEntry);
            // Broadcast to Kotlin if DevServer global is available
            if (global.devServer && typeof global.devServer.broadcastState === 'function') {
                global.devServer.broadcastState('error_pipeline', errorStr);
            }
        } catch (e) {
            // Silent fail
        }
    }

    traceError(errorId) {
        const error = this.errors.find(e => e.id === errorId);
        if (!error) return null;

        const trace = {
            error: error,
            files: [],
            breakPoint: null
        };

        this.cache.forEach((data, file) => {
            if (data.errors.some(e => e.id === errorId)) {
                trace.files.push(file);
                trace.breakPoint = file;
            }
        });

        return trace;
    }

    clear() {
        this.errors = [];
        this.cache.forEach(data => data.errors = []);
        console.log('[ErrorPipeline] All errors cleared.');
    }
}

// Export singleton instance for app-wide usage
const errorPipeline = new ErrorPipeline();

module.exports = { ErrorPipeline, errorPipeline };
