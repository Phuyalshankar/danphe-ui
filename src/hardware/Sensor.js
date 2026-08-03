"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sensor = void 0;
const protocol_1 = require("./protocol");
/**
 * 🌊 DolphinJS Hardware — Sensors (complete suite)
 */
exports.Sensor = {
    /** Raw accelerometer: { x, y, z } m/s² */
    accelerometer: (interval = 100) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.SENSOR_ACCEL,
        params: { interval },
    }),
    /** Gyroscope: { x, y, z } rad/s */
    gyroscope: (interval = 100) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.SENSOR_GYRO,
        params: { interval },
    }),
    /** Compass / Magnetometer: { x, y, z } μT */
    compass: (interval = 100) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.SENSOR_COMPASS,
        params: { interval },
    }),
    /** Barometer: { pressure } hPa */
    barometer: (interval = 500) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.SENSOR_BARO,
        params: { interval },
    }),
    /** Ambient light: { lux } */
    light: (interval = 500) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.SENSOR_LIGHT,
        params: { interval },
    }),
    /** Proximity: { distance } cm (or 0/5 for near/far) */
    proximity: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.SENSOR_PROX,
        params: {},
    }),
    /** Rotation vector: { x, y, z, w } quaternion */
    rotation: (interval = 100) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.SENSOR_ROTATION,
        params: { interval },
    }),
    /** Gravity vector: { x, y, z } */
    gravity: (interval = 100) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.SENSOR_GRAVITY,
        params: { interval },
    }),
    /** Linear acceleration (no gravity): { x, y, z } */
    linearAcceleration: (interval = 100) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.SENSOR_LINEAR_ACCEL,
        params: { interval },
    }),
    /** Step counter: { steps } total since boot */
    stepCounter: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.SENSOR_STEPS,
        params: {},
    }),
    /** Ambient temperature: { celsius } */
    temperature: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.SENSOR_TEMPERATURE,
        params: {},
    }),
    /** Relative humidity: { humidity } % */
    humidity: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.SENSOR_HUMIDITY,
        params: {},
    }),
    /** Heart rate (wearables): { bpm } */
    heartRate: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.SENSOR_HEARTRATE,
        params: {},
    }),
    /** Device orientation: { azimuth, pitch, roll } degrees */
    orientation: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.SENSOR_ORIENTATION,
        params: {},
    }),
    /** List all available sensors on this device */
    list: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.SENSOR_LIST,
        params: {},
    }),
    /** Stop a specific sensor or all */
    stop: (type = 'all') => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.SENSOR_STOP,
        params: { type },
    }),
    _action: {
        accel: 'hw:sensor:accel',
        gyro: 'hw:sensor:gyro',
        compass: 'hw:sensor:compass',
        baro: 'hw:sensor:baro',
        light: 'hw:sensor:light',
        prox: 'hw:sensor:prox',
        rotation: 'hw:sensor:rotation',
        steps: 'hw:sensor:steps',
        gravity: 'hw:sensor:gravity',
        temperature: 'hw:sensor:temperature',
        humidity: 'hw:sensor:humidity',
        orientation: 'hw:sensor:orientation',
        list: 'hw:sensor:list',
        stopAll: 'hw:sensor:stop',
    },
};
//# sourceMappingURL=Sensor.js.map