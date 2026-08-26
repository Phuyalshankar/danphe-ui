// main.js - Integration Logic
const BinStore = require('./BinStore');
const UniversalConnection = require('./UniversalConnection');

class DolphinFramework {
    constructor(config = {}) {
        // Initialize storage
        this.store = new BinStore({
            maxBufferSize: config.storeSize || 10 * 1024 * 1024,
            autoSync: true,
            language: config.language || 'en'
        });
        
        // Initialize connection
        this.connection = new UniversalConnection({
            wsPort: config.wsPort || 8080,
            ...config.connection
        });
        
        // Link them together
        this.store.linkConnection(this.connection);
        this.connection.linkBinStore(this.store);
        
        // Start real-time sync
        this.startRealtimeSync();
        
        console.log('🚀 Dolphin Hardware Framework Started');
    }
    
    startRealtimeSync() {
        // Example: Monitor GPIO changes
        setInterval(() => {
            this.monitorHardware();
        }, 100); // 10Hz monitoring
        
        // Listen for UI commands
        this.connection.on('ui_command', (command) => {
            this.handleUICommand(command);
        });
    }
    
    monitorHardware() {
        // In a real implementation, you'd read from hardware
        // and update BinStore accordingly
        const simulatedChanges = this.simulateHardwareChanges();
        
        simulatedChanges.forEach(change => {
            this.store.setHardwareState(
                change.type,
                change.address,
                change.value,
                { source: 'monitor' }
            );
        });
    }
    
    handleUICommand(command) {
        switch(command.action) {
            case 'SET_GPIO':
                this.store.setPinState(command.pin, command.value);
                break;
            case 'SET_PWM':
                this.store.setPWM(command.channel, command.duty);
                break;
            case 'I2C_WRITE':
                this.store.writeI2C(command.address, command.register, command.data);
                break;
            case 'REQUEST_STATE':
                this.sendStateToUI(command.clientId);
                break;
        }
    }
    
    sendStateToUI(clientId) {
        const state = this.store.exportSnapshot();
        this.connection.sendToClient(clientId, {
            type: 'FULL_STATE',
            state: state
        });
    }
    
    simulateHardwareChanges() {
        // Simulate some hardware changes for testing
        return [
            {
                type: 'gpio',
                address: Math.floor(Math.random() * 40),
                value: Math.random() > 0.5 ? 1 : 0
            },
            {
                type: 'analog',
                address: 'temp_sensor',
                value: 25 + Math.random() * 5
            }
        ];
    }
    
    getStats() {
        return {
            store: this.store.getStats(),
            connection: this.connection.getStats(),
            timestamp: Date.now()
        };
    }
    
    cleanup() {
        this.store.clear();
        this.connection.cleanup();
        console.log('🛑 Framework stopped');
    }
}

// Export for use
module.exports = DolphinFramework;

// Auto-start if run directly
if (require.main === module) {
    const framework = new DolphinFramework();
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        framework.cleanup();
        process.exit(0);
    });
}