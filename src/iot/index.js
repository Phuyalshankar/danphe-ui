'use strict';

/**
 * 🌊 DolphinIoT — Unified IoT Module
 *
 * Better than Flutter for IoT:
 *   - MQTTClient       → Pure-JS MQTT 3.1.1/5.0, no native deps, QoS 0/1/2
 *   - TelemetryEncoder → Binary encoding 8-15x smaller than JSON
 *   - DeviceRegistry   → Fleet management, OTA, health monitoring, alerts
 *
 * Usage:
 *   const { IoT } = require('dolphin-native');
 *   const mqtt = IoT.createMQTT({ host: 'broker.hivemq.com' });
 *   mqtt.subscribe('sensors/+/temp', (payload, topic) => { ... });
 */

const MQTTClient       = require('./MQTTClient');
const TelemetryEncoder = require('./TelemetryEncoder');
const DeviceRegistry   = require('./DeviceRegistry');

const IoT = {
  MQTTClient,
  TelemetryEncoder,
  DeviceRegistry,
  version: '4.0.0',

  createMQTT: (config = {}) => {
    const client = new MQTTClient(config);
    client.connect();
    return client;
  },

  createEncoder: (config = {}) => new TelemetryEncoder(config),

  createRegistry: (config = {}) => new DeviceRegistry(config),

  encode:  (fields, deviceId) => new TelemetryEncoder({ deviceId }).encode(fields),
  decode:  (buf)              => new TelemetryEncoder().decode(buf),
};

module.exports = IoT;
module.exports.IoT             = IoT;
module.exports.MQTTClient      = MQTTClient;
module.exports.TelemetryEncoder = TelemetryEncoder;
module.exports.DeviceRegistry  = DeviceRegistry;
