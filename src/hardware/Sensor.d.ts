import { HWDescriptor } from './types';
/**
 * 🌊 DolphinJS Hardware — Sensors (complete suite)
 */
export declare const Sensor: {
    /** Raw accelerometer: { x, y, z } m/s² */
    accelerometer: (interval?: number) => HWDescriptor<{
        interval: number;
    }>;
    /** Gyroscope: { x, y, z } rad/s */
    gyroscope: (interval?: number) => HWDescriptor<{
        interval: number;
    }>;
    /** Compass / Magnetometer: { x, y, z } μT */
    compass: (interval?: number) => HWDescriptor<{
        interval: number;
    }>;
    /** Barometer: { pressure } hPa */
    barometer: (interval?: number) => HWDescriptor<{
        interval: number;
    }>;
    /** Ambient light: { lux } */
    light: (interval?: number) => HWDescriptor<{
        interval: number;
    }>;
    /** Proximity: { distance } cm (or 0/5 for near/far) */
    proximity: () => HWDescriptor<Record<string, never>>;
    /** Rotation vector: { x, y, z, w } quaternion */
    rotation: (interval?: number) => HWDescriptor<{
        interval: number;
    }>;
    /** Gravity vector: { x, y, z } */
    gravity: (interval?: number) => HWDescriptor<{
        interval: number;
    }>;
    /** Linear acceleration (no gravity): { x, y, z } */
    linearAcceleration: (interval?: number) => HWDescriptor<{
        interval: number;
    }>;
    /** Step counter: { steps } total since boot */
    stepCounter: () => HWDescriptor<Record<string, never>>;
    /** Ambient temperature: { celsius } */
    temperature: () => HWDescriptor<Record<string, never>>;
    /** Relative humidity: { humidity } % */
    humidity: () => HWDescriptor<Record<string, never>>;
    /** Heart rate (wearables): { bpm } */
    heartRate: () => HWDescriptor<Record<string, never>>;
    /** Device orientation: { azimuth, pitch, roll } degrees */
    orientation: () => HWDescriptor<Record<string, never>>;
    /** List all available sensors on this device */
    list: () => HWDescriptor<Record<string, never>>;
    /** Stop a specific sensor or all */
    stop: (type?: string) => HWDescriptor<{
        type: string;
    }>;
    _action: {
        accel: string;
        gyro: string;
        compass: string;
        baro: string;
        light: string;
        prox: string;
        rotation: string;
        steps: string;
        gravity: string;
        temperature: string;
        humidity: string;
        orientation: string;
        list: string;
        stopAll: string;
    };
};
export type SensorModule = typeof Sensor;
//# sourceMappingURL=Sensor.d.ts.map