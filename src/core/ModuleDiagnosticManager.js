'use strict';

/**
 * 🩺 ModuleDiagnosticManager — Central Node.js diagnostic wrapper for tracking per-module compilation & parser failures.
 */
class ModuleDiagnosticManager {
    static failures = [];

    static recordFailure(moduleName, opcode, error, contextData = {}) {
        const record = {
            moduleName: moduleName || 'UnknownModule',
            opcode: opcode || 0x00,
            errorMessage: error ? (error.message || String(error)) : 'Unknown Error',
            stack: error ? error.stack : '',
            context: contextData,
            timestamp: new Date().toISOString()
        };

        ModuleDiagnosticManager.failures.push(record);

        console.error(`🚨 [NODE.JS MODULE FAILURE DETECTED] Module: ${record.moduleName} (Opcode: 0x${record.opcode.toString(16)})`);
        console.error(`   Reason: ${record.errorMessage}`);
    }

    static getFailedModules() {
        return [...ModuleDiagnosticManager.failures];
    }

    static clearDiagnostics() {
        ModuleDiagnosticManager.failures = [];
    }
}

module.exports = ModuleDiagnosticManager;
