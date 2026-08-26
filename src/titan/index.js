'use strict';

// Core Engine
const TitanMainEngine = require('./engine/TitanMainEngine');
const TitanOrchestrator = require('./engine/TitanOrchestrator');

// Protocol
const TBC_PROTO = require('./protocol/TBC_PROTO');

// UI Import
const UniversalUIImporter = require('./ui/UniversalUIImporter');

// Bridge
const DolphinTitanBridge = require('./bridge/DolphinTitanBridge');

/**
 * Titan Render Engine - Complete System
 */
const Titan = {
    // Core Engine
    TitanMainEngine,
    TitanOrchestrator,
    
    // Protocol
    TBC_PROTO,
    
    // UI Import
    UniversalUIImporter,
    
    // Bridge
    DolphinTitanBridge,
    
    // Factory Methods
    createEngine: (config = {}) => new TitanMainEngine(config),
    createOrchestrator: (engine) => new TitanOrchestrator(engine),
    createImporter: (dolphinInstance) => new UniversalUIImporter(dolphinInstance),
    createBridge: (config = {}) => new DolphinTitanBridge(config),
    
    // Utility Methods
    createBinary: (library = 'UNIVERSAL', component = 'CONTAINER') => {
        return TBC_PROTO.createBinary(library, component);
    },
    
    validateBinary: (binary) => {
        return TBC_PROTO.validate(binary);
    },
    
    toHumanReadable: (binary) => {
        return TBC_PROTO.toHumanReadable(binary);
    },
    
    fromProperties: (props) => {
        return TBC_PROTO.fromProperties(props);
    },
    
    // Version Info
    version: '1.0.0',
    description: 'High-performance Binary AI Render Engine',
    author: 'Titan Engine Team',
    license: 'MIT',
    
    // Health Check
    health: () => ({
        status: 'OK',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        components: {
            engine: true,
            protocol: true,
            importer: true,
            bridge: true
        },
        capabilities: {
            binaryRendering: true,
            uiImport: true,
            dolphinIntegration: true,
            realtimeStreaming: true
        }
    }),
    
    // Quick Start
    quickStart: (config = {}) => {
        console.log('🚀 Starting Titan Render Engine...');
        
        const engine = new TitanMainEngine(config);
        const orchestrator = new TitanOrchestrator(engine);
        const importer = new UniversalUIImporter();
        
        return {
            engine,
            orchestrator,
            importer,
            
            // Example usage
            example: () => {
                const binary = TBC_PROTO.createBinary('MUI', 'BUTTON');
                binary[TBC_PROTO.SCALE] = 120;
                binary[TBC_PROTO.OPACITY] = 200;
                
                const result = engine.directRender(binary, null, 'Click Me');
                console.log('Example render result:', result);
                
                return result;
            }
        };
    }
};

module.exports = Titan;