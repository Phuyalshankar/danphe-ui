'use strict';

const DolphinTitanBridge = require('./DolphinTitanBridge');

/**
 * Integration module exports
 */
module.exports = {
    // Main bridge class
    DolphinTitanBridge,
    
    // Helper functions
    createBridge: (config = {}) => new DolphinTitanBridge(config),
    
    // Version info
    version: '1.0.0',
    description: 'DolphinCSS + Titan Render Engine Integration Layer'
};