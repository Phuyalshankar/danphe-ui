/**
 * 🌊 DolphinJS — Full Hardware API v2.0
 *
 * Complete hardware access for DolphinJS apps.
 * All calls are serialized to binary via DolphinBinaryProtocol
 * and dispatched to the Android/iOS runtime.
 *
 * Usage:
 *   import { Camera, GPS, Phone, SMS, Fetch, Audio, Video,
 *            Contacts, Storage, Sensor, Battery, Bluetooth,
 *            NFC, Mic, Haptic, Torch, Clipboard, WebRTC } from 'dolphin-hardware';
 */
/**
 * Each domain module (Camera, GPS, Sensor, ...) is a stateless object of
 * descriptor-building functions — there's no per-instance state to hold,
 * which is why they live in their own files as plain consts rather than
 * class fields. `DolphinHardware` exists to preserve the original single
 * entry-point shape (`Hardware.Camera.takePicture()`, etc.) and the
 * `_callbacks` registry reserved for future dispatch wiring.
 */
export declare class DolphinHardware {
    private _callbacks;
    Camera: {
        takePicture: (options?: import("./types").TakePictureOptions) => import("./types").HWDescriptor<{
            quality: number;
            facing: string;
        }>;
        open: (facing?: string) => import("./types").HWDescriptor<import("./types").CameraOpenParams>;
        close: () => import("./types").HWDescriptor<Record<string, never>>;
        switchFace: () => import("./types").HWDescriptor<Record<string, never>>;
        startVideo: (o?: import("./types").CameraStartVideoOptions) => import("./types").HWDescriptor<import("./types").CameraStartVideoOptions>;
        stopVideo: () => import("./types").HWDescriptor<Record<string, never>>;
        _action: {
            open: string;
            takePhoto: string;
        };
    };
    GPS: {
        getLocation: (options?: import("./types").GetLocationOptions) => import("./types").HWDescriptor<{
            accuracy: string;
            timeout: number;
        }>;
        watch: (options?: import("./types").GPSWatchOptions) => import("./types").HWDescriptor<{
            interval: number;
            accuracy: string;
        }>;
        stop: () => import("./types").HWDescriptor<Record<string, never>>;
        _action: {
            get: string;
            watch: string;
            stop: string;
        };
    };
    Phone: {
        call: (number: string) => import("./types").HWDescriptor<{
            number: string;
        }>;
        dial: (number: string) => import("./types").HWDescriptor<{
            number: string;
        }>;
        getCallLogs: (limit?: number) => import("./types").HWDescriptor<{
            limit: number;
        }>;
        getCarrier: () => import("./types").HWDescriptor<Record<string, never>>;
        getSimState: () => import("./types").HWDescriptor<Record<string, never>>;
        getNumber: () => import("./types").HWDescriptor<Record<string, never>>;
        _action: {
            call: (_n: string) => string;
            dial: (_n: string) => string;
            callLogs: string;
            carrier: string;
        };
    };
    SMS: {
        send: (to: string, body: string) => import("./types").HWDescriptor<{
            to: string;
            body: string;
        }>;
        compose: (to: string, body?: string) => import("./types").HWDescriptor<{
            to: string;
            body: string;
        }>;
        getInbox: (limit?: number) => import("./types").HWDescriptor<{
            limit: number;
        }>;
        getSent: (limit?: number) => import("./types").HWDescriptor<{
            limit: number;
        }>;
        _action: {
            inbox: string;
            sent: string;
        };
    };
    Contacts: {
        getAll: () => import("./types").HWDescriptor<Record<string, never>>;
        search: (query: string) => import("./types").HWDescriptor<{
            query: string;
        }>;
        _action: {
            list: string;
        };
    };
    Audio: {
        play: (urlOrPath: string, options?: import("./types").AudioPlayOptions) => import("./types").HWDescriptor<{
            src: string;
            loop: boolean;
        }>;
        stop: () => import("./types").HWDescriptor<Record<string, never>>;
        pause: () => import("./types").HWDescriptor<Record<string, never>>;
        setVolume: (level: number) => import("./types").HWDescriptor<{
            level: number;
        }>;
        getLibrary: (limit?: number) => import("./types").HWDescriptor<{
            limit: number;
        }>;
        _action: {
            play: (_url: string) => string;
            stop: string;
            pause: string;
        };
    };
    Mic: {
        start: (options?: import("./types").MicStartOptions) => import("./types").HWDescriptor<{
            sampleRate: number;
            channels: number;
        }>;
        stop: () => import("./types").HWDescriptor<Record<string, never>>;
        _action: {
            start: string;
            stop: string;
        };
    };
    Video: {
        openCamera: () => import("./types").HWDescriptor<Record<string, never>>;
        startRecording: (options?: import("./types").VideoStartRecordingOptions) => import("./types").HWDescriptor<{
            quality: string;
            front: boolean;
        }>;
        stopRecording: () => import("./types").HWDescriptor<Record<string, never>>;
        play: (urlOrPath: string) => import("./types").HWDescriptor<{
            src: string;
        }>;
        getGallery: (limit?: number) => import("./types").HWDescriptor<{
            limit: number;
        }>;
        _action: {
            open: string;
            record: string;
            stop: string;
        };
    };
    Storage: {
        readFile: (path: string) => import("./types").HWDescriptor<{
            path: string;
        }>;
        writeFile: (path: string, content: string) => import("./types").HWDescriptor<{
            path: string;
            content: string;
        }>;
        deleteFile: (path: string) => import("./types").HWDescriptor<{
            path: string;
        }>;
        listDir: (path: string) => import("./types").HWDescriptor<{
            path: string;
        }>;
        mkdir: (path: string) => import("./types").HWDescriptor<{
            path: string;
        }>;
        getDirs: () => import("./types").HWDescriptor<Record<string, never>>;
        pickFile: (types?: string[]) => import("./types").HWDescriptor<{
            types: string[];
        }>;
        saveFile: (filename: string, data: unknown) => import("./types").HWDescriptor<{
            filename: string;
            data: unknown;
        }>;
        getImages: (limit?: number) => import("./types").HWDescriptor<{
            limit: number;
        }>;
        getVideos: (limit?: number) => import("./types").HWDescriptor<{
            limit: number;
        }>;
        getAudio: (limit?: number) => import("./types").HWDescriptor<{
            limit: number;
        }>;
        _action: {
            images: string;
            dirs: string;
        };
    };
    File: {
        pick: (types?: string[]) => import("./types").HWDescriptor<{
            types: string[];
        }>;
        save: (filename: string, data: unknown) => import("./types").HWDescriptor<{
            filename: string;
            data: unknown;
        }>;
        read: (path: string) => import("./types").HWDescriptor<{
            path: string;
        }>;
        write: (path: string, content: string) => import("./types").HWDescriptor<{
            path: string;
            content: string;
        }>;
        delete: (path: string) => import("./types").HWDescriptor<{
            path: string;
        }>;
        list: (path: string) => import("./types").HWDescriptor<{
            path: string;
        }>;
    };
    Fetch: {
        get: (url: string, options?: import("./types").FetchOptions) => import("./types").HWDescriptor<{
            url: string;
            headers: Record<string, string>;
            timeout: number;
        }>;
        post: (url: string, body: import("./types").FetchBody, options?: import("./types").FetchOptions) => import("./types").HWDescriptor<{
            url: string;
            body: string;
            headers: Record<string, string>;
            timeout: number;
        }>;
        put: (url: string, body: import("./types").FetchBody, options?: import("./types").FetchOptions) => import("./types").HWDescriptor<{
            url: string;
            body: string;
            headers: Record<string, string>;
        }>;
        patch: (url: string, body: import("./types").FetchBody, options?: import("./types").FetchOptions) => import("./types").HWDescriptor<{
            url: string;
            body: string;
            headers: Record<string, string>;
        }>;
        delete: (url: string, options?: import("./types").FetchOptions) => import("./types").HWDescriptor<{
            url: string;
            headers: Record<string, string>;
        }>;
        request: (method: string, url: string, body: import("./types").FetchBody, options?: import("./types").FetchOptions) => import("./types").HWDescriptor<{
            url: string;
            body: import("./types").FetchBody;
            headers: Record<string, string>;
            timeout: number;
        }>;
        _action: (method: string, url: string, body: import("./types").FetchBody, headers: Record<string, string>) => {
            action: string;
            value: string;
        };
    };
    Sensor: {
        accelerometer: (interval?: number) => import("./types").HWDescriptor<{
            interval: number;
        }>;
        gyroscope: (interval?: number) => import("./types").HWDescriptor<{
            interval: number;
        }>;
        compass: (interval?: number) => import("./types").HWDescriptor<{
            interval: number;
        }>;
        barometer: (interval?: number) => import("./types").HWDescriptor<{
            interval: number;
        }>;
        light: (interval?: number) => import("./types").HWDescriptor<{
            interval: number;
        }>;
        proximity: () => import("./types").HWDescriptor<Record<string, never>>;
        rotation: (interval?: number) => import("./types").HWDescriptor<{
            interval: number;
        }>;
        gravity: (interval?: number) => import("./types").HWDescriptor<{
            interval: number;
        }>;
        linearAcceleration: (interval?: number) => import("./types").HWDescriptor<{
            interval: number;
        }>;
        stepCounter: () => import("./types").HWDescriptor<Record<string, never>>;
        temperature: () => import("./types").HWDescriptor<Record<string, never>>;
        humidity: () => import("./types").HWDescriptor<Record<string, never>>;
        heartRate: () => import("./types").HWDescriptor<Record<string, never>>;
        orientation: () => import("./types").HWDescriptor<Record<string, never>>;
        list: () => import("./types").HWDescriptor<Record<string, never>>;
        stop: (type?: string) => import("./types").HWDescriptor<{
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
    Battery: {
        getStatus: () => import("./types").HWDescriptor<Record<string, never>>;
        watch: (interval?: number) => import("./types").HWDescriptor<{
            interval: number;
        }>;
        _action: {
            status: string;
        };
    };
    Device: {
        info: () => import("./types").HWDescriptor<Record<string, never>>;
        battery: () => import("./types").HWDescriptor<Record<string, never>>;
    };
    WebRTC: {
        createPeer: (options?: import("./types").CreatePeerOptions) => import("./types").HWDescriptor<{
            peerId: string;
            iceServers: unknown[];
            audio: boolean;
            video: boolean;
        }>;
        offer: (peerId: string, sdp: unknown) => import("./types").HWDescriptor<{
            peerId: string;
            sdp: unknown;
        }>;
        answer: (peerId: string, sdp: unknown) => import("./types").HWDescriptor<{
            peerId: string;
            sdp: unknown;
        }>;
        ice: (peerId: string, candidate: unknown) => import("./types").HWDescriptor<{
            peerId: string;
            candidate: unknown;
        }>;
        hangup: (peerId: string) => import("./types").HWDescriptor<{
            peerId: string;
        }>;
    };
    Bluetooth: {
        scan: (duration?: number) => import("./types").HWDescriptor<{
            duration: number;
        }>;
        connect: (address: string) => import("./types").HWDescriptor<{
            address: string;
        }>;
        send: (address: string, data: unknown) => import("./types").HWDescriptor<{
            address: string;
            data: unknown;
        }>;
        disconnect: (address: string) => import("./types").HWDescriptor<{
            address: string;
        }>;
        getStatus: () => import("./types").HWDescriptor<Record<string, never>>;
    };
    NFC: {
        read: () => import("./types").HWDescriptor<Record<string, never>>;
        write: (data: unknown) => import("./types").HWDescriptor<{
            data: unknown;
        }>;
        getStatus: () => import("./types").HWDescriptor<Record<string, never>>;
    };
    Haptic: {
        vibrate: (ms?: number) => import("./types").HWDescriptor<{
            ms: number;
        }>;
        impact: (style?: import("./types").HapticStyle) => import("./types").HWDescriptor<{
            style: import("./types").HapticStyle;
        }>;
        success: () => import("./types").HWDescriptor<{
            style: string;
        }>;
        error: () => import("./types").HWDescriptor<{
            style: string;
        }>;
        warning: () => import("./types").HWDescriptor<{
            style: string;
        }>;
        _action: {
            light: string;
            medium: string;
            heavy: string;
        };
    };
    Torch: {
        on: () => import("./types").HWDescriptor<Record<string, never>>;
        off: () => import("./types").HWDescriptor<Record<string, never>>;
        _action: {
            on: string;
            off: string;
        };
    };
    Clipboard: {
        write: (text: string) => import("./types").HWDescriptor<{
            text: string;
        }>;
        read: () => import("./types").HWDescriptor<Record<string, never>>;
    };
    constructor();
    /** Reserved for future native → JS callback dispatch wiring (unused today, same as the original JS). */
    _getCallbackRegistry(): Map<string, unknown>;
}
export declare const Hardware: DolphinHardware;
export declare const Camera: DolphinHardware['Camera'];
export declare const GPS: DolphinHardware['GPS'];
export declare const Phone: DolphinHardware['Phone'];
export declare const SMS: DolphinHardware['SMS'];
export declare const Contacts: DolphinHardware['Contacts'];
export declare const Audio: DolphinHardware['Audio'];
export declare const Mic: DolphinHardware['Mic'];
export declare const Video: DolphinHardware['Video'];
export declare const Storage: DolphinHardware['Storage'];
export declare const File: DolphinHardware['File'];
export declare const Fetch: DolphinHardware['Fetch'];
export declare const Sensor: DolphinHardware['Sensor'];
export declare const Battery: DolphinHardware['Battery'];
export declare const Device: DolphinHardware['Device'];
export declare const WebRTC: DolphinHardware['WebRTC'];
export declare const Bluetooth: DolphinHardware['Bluetooth'];
export declare const NFC: DolphinHardware['NFC'];
export declare const Haptic: DolphinHardware['Haptic'];
export declare const Torch: DolphinHardware['Torch'];
export declare const Clipboard: DolphinHardware['Clipboard'];
export declare const HW_CMD: typeof import("./protocol").HW_CMD;
export declare const HW_EVENT: typeof import("./protocol").HW_EVENT;
export declare const buildHWCall: typeof import("./protocol").buildHWCall;
export declare const parseHWEvent: typeof import("./protocol").parseHWEvent;
//# sourceMappingURL=DolphinHardwareAPI.d.ts.map