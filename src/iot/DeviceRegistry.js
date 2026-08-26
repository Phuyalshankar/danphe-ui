'use strict';

const { EventEmitter } = require('events');

/**
 * 🌊 DolphinIoT — DeviceRegistry
 *
 * IoT device discovery, registration, health monitoring, OTA updates.
 * Flutter को no-equivalent — Flutter apps are single-device, DolphinJS
 * can manage a fleet of IoT devices from a single Node.js gateway.
 */

const DEVICE_STATE = {
  ONLINE:   'online',
  OFFLINE:  'offline',
  SLEEPING: 'sleeping',
  ERROR:    'error',
  OTA:      'ota',
};

class IoTDevice {
  constructor(config = {}) {
    this.id          = config.id          || 'dev-' + Date.now();
    this.name        = config.name        || 'Device';
    this.type        = config.type        || 'generic';   // sensor/actuator/gateway/camera
    this.firmware    = config.firmware    || '1.0.0';
    this.ipAddress   = config.ipAddress   || null;
    this.macAddress  = config.macAddress  || null;
    this.capabilities= config.capabilities|| [];
    this.metadata    = config.metadata    || {};
    this.state       = DEVICE_STATE.OFFLINE;
    this.lastSeen    = null;
    this.telemetry   = {};                // latest sensor readings
    this.errors      = [];
  }

  updateTelemetry(data) {
    Object.assign(this.telemetry, data);
    this.lastSeen = new Date();
    if (this.state !== DEVICE_STATE.OTA) this.state = DEVICE_STATE.ONLINE;
  }

  toJSON() {
    return {
      id: this.id, name: this.name, type: this.type,
      firmware: this.firmware, ipAddress: this.ipAddress,
      macAddress: this.macAddress, capabilities: this.capabilities,
      state: this.state, lastSeen: this.lastSeen,
      telemetry: this.telemetry, metadata: this.metadata,
    };
  }
}

class DeviceRegistry extends EventEmitter {
  constructor(config = {}) {
    super();
    this._devices    = new Map();
    this._timeoutMs  = config.deviceTimeout || 30000;  // mark offline after 30s
    this._watchTimer = null;
    this.startHealthWatch();
  }

  // ── Registration ──────────────────────────────────────────────────────────

  register(config) {
    const device = config instanceof IoTDevice ? config : new IoTDevice(config);
    this._devices.set(device.id, device);
    this.emit('deviceRegistered', device.toJSON());
    return device;
  }

  unregister(deviceId) {
    const device = this._devices.get(deviceId);
    if (device) { this._devices.delete(deviceId); this.emit('deviceUnregistered', { id: deviceId }); }
  }

  // ── Discovery ─────────────────────────────────────────────────────────────

  /** Handle device announcing itself (from MQTT or WebSocket) */
  announce(payload) {
    const { id, name, type, firmware, ipAddress, macAddress, capabilities, metadata } = payload;
    let device = this._devices.get(id);
    if (!device) {
      device = this.register({ id, name, type, firmware, ipAddress, macAddress, capabilities, metadata });
      this.emit('deviceDiscovered', device.toJSON());
    } else {
      Object.assign(device, { name, firmware, ipAddress });
    }
    device.state    = DEVICE_STATE.ONLINE;
    device.lastSeen = new Date();
    return device;
  }

  // ── Telemetry ─────────────────────────────────────────────────────────────

  updateTelemetry(deviceId, data) {
    const device = this._devices.get(deviceId);
    if (!device) return null;
    const prev = { ...device.telemetry };
    device.updateTelemetry(data);
    this.emit('telemetry', { deviceId, data, device: device.toJSON() });

    // Threshold alerts
    for (const [key, val] of Object.entries(data)) {
      const alert = device.metadata.alerts?.[key];
      if (alert) {
        if (alert.max !== undefined && val > alert.max) this.emit('alert', { deviceId, key, val, threshold: alert.max, type: 'HIGH' });
        if (alert.min !== undefined && val < alert.min) this.emit('alert', { deviceId, key, val, threshold: alert.min, type: 'LOW' });
      }
    }
    return device;
  }

  // ── OTA Updates ───────────────────────────────────────────────────────────

  scheduleOTA(deviceId, firmware) {
    const device = this._devices.get(deviceId);
    if (!device) throw new Error(`Device ${deviceId} not found`);
    device.state = DEVICE_STATE.OTA;
    this.emit('otaScheduled', { deviceId, firmware, device: device.toJSON() });
    return { deviceId, firmware, scheduledAt: new Date() };
  }

  confirmOTA(deviceId, newFirmware) {
    const device = this._devices.get(deviceId);
    if (!device) return;
    device.firmware = newFirmware;
    device.state    = DEVICE_STATE.ONLINE;
    device.lastSeen = new Date();
    this.emit('otaComplete', { deviceId, firmware: newFirmware });
  }

  // ── Commands ──────────────────────────────────────────────────────────────

  sendCommand(deviceId, command, params = {}) {
    const device = this._devices.get(deviceId);
    if (!device) throw new Error(`Device ${deviceId} not found`);
    if (device.state === DEVICE_STATE.OFFLINE) throw new Error(`Device ${deviceId} is offline`);
    const cmd = { deviceId, command, params, sentAt: new Date() };
    this.emit('command', cmd);
    return cmd;
  }

  broadcast(command, params = {}, filter = {}) {
    let devices = [...this._devices.values()];
    if (filter.type)  devices = devices.filter(d => d.type  === filter.type);
    if (filter.state) devices = devices.filter(d => d.state === filter.state);
    return devices.map(d => this.sendCommand(d.id, command, params));
  }

  // ── Health monitoring ─────────────────────────────────────────────────────

  startHealthWatch() {
    this._watchTimer = setInterval(() => {
      const now = Date.now();
      for (const device of this._devices.values()) {
        if (device.state === DEVICE_STATE.ONLINE && device.lastSeen) {
          if (now - device.lastSeen.getTime() > this._timeoutMs) {
            device.state = DEVICE_STATE.OFFLINE;
            this.emit('deviceOffline', { id: device.id, lastSeen: device.lastSeen });
          }
        }
      }
    }, 5000);
    this._watchTimer.unref?.();
  }

  stopHealthWatch() { clearInterval(this._watchTimer); }

  // ── Queries ───────────────────────────────────────────────────────────────

  getDevice(id)     { return this._devices.get(id)?.toJSON() || null; }
  getAll()          { return [...this._devices.values()].map(d => d.toJSON()); }
  getOnline()       { return this.getAll().filter(d => d.state === DEVICE_STATE.ONLINE); }
  getByType(type)   { return this.getAll().filter(d => d.type === type); }
  count()           { return this._devices.size; }
  summary() {
    const all = this.getAll();
    const byState = {};
    all.forEach(d => { byState[d.state] = (byState[d.state] || 0) + 1; });
    return { total: all.length, byState };
  }

  static Device = IoTDevice;
  static STATE  = DEVICE_STATE;
}

module.exports = DeviceRegistry;
