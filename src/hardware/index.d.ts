/**
 * 🌊 DolphinJS — Full Hardware API v2.0 (entry point)
 */
import { Hardware, DolphinHardware } from './DolphinHardwareAPI';
import { HW_CMD, HW_EVENT, buildHWCall, parseHWEvent } from './protocol';
export { Hardware, DolphinHardware, };
export declare const Camera: {
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
export declare const GPS: {
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
export declare const Phone: {
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
export declare const SMS: {
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
export declare const Contacts: {
    getAll: () => import("./types").HWDescriptor<Record<string, never>>;
    search: (query: string) => import("./types").HWDescriptor<{
        query: string;
    }>;
    _action: {
        list: string;
    };
};
export declare const Audio: {
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
export declare const Mic: {
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
export declare const Video: {
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
export declare const Fetch: {
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
export declare const Storage: {
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
export declare const File: {
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
export declare const Sensor: {
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
export declare const Battery: {
    getStatus: () => import("./types").HWDescriptor<Record<string, never>>;
    watch: (interval?: number) => import("./types").HWDescriptor<{
        interval: number;
    }>;
    _action: {
        status: string;
    };
};
export declare const Device: {
    info: () => import("./types").HWDescriptor<Record<string, never>>;
    battery: () => import("./types").HWDescriptor<Record<string, never>>;
};
export declare const WebRTC: {
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
export declare const Bluetooth: {
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
export declare const NFC: {
    read: () => import("./types").HWDescriptor<Record<string, never>>;
    write: (data: unknown) => import("./types").HWDescriptor<{
        data: unknown;
    }>;
    getStatus: () => import("./types").HWDescriptor<Record<string, never>>;
};
export declare const Haptic: {
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
export declare const Torch: {
    on: () => import("./types").HWDescriptor<Record<string, never>>;
    off: () => import("./types").HWDescriptor<Record<string, never>>;
    _action: {
        on: string;
        off: string;
    };
};
export declare const Clipboard: {
    write: (text: string) => import("./types").HWDescriptor<{
        text: string;
    }>;
    read: () => import("./types").HWDescriptor<Record<string, never>>;
};
export { HW_CMD, HW_EVENT, buildHWCall, parseHWEvent };
declare const _default: {
    Hardware: DolphinHardware;
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
    HW_CMD: {
        readonly CAMERA_OPEN: 32;
        readonly CAMERA_CLOSE: 33;
        readonly CAMERA_TAKE_PHOTO: 34;
        readonly CAMERA_START_VIDEO: 35;
        readonly CAMERA_STOP_VIDEO: 36;
        readonly CAMERA_SWITCH: 37;
        readonly GPS_GET: 48;
        readonly GPS_WATCH: 49;
        readonly GPS_STOP: 50;
        readonly WEBRTC_CREATE_PEER: 64;
        readonly WEBRTC_OFFER: 65;
        readonly WEBRTC_ANSWER: 66;
        readonly WEBRTC_ICE: 67;
        readonly WEBRTC_HANGUP: 68;
        readonly WEBRTC_LOCAL_STREAM: 69;
        readonly MIC_START: 80;
        readonly MIC_STOP: 81;
        readonly SENSOR_ACCEL: 96;
        readonly SENSOR_GYRO: 97;
        readonly SENSOR_COMPASS: 98;
        readonly SENSOR_BARO: 99;
        readonly SENSOR_LIGHT: 100;
        readonly SENSOR_PROX: 101;
        readonly SENSOR_ROTATION: 102;
        readonly SENSOR_GRAVITY: 103;
        readonly SENSOR_LINEAR_ACCEL: 104;
        readonly SENSOR_STEPS: 105;
        readonly SENSOR_TEMPERATURE: 106;
        readonly SENSOR_HUMIDITY: 107;
        readonly SENSOR_HEARTRATE: 108;
        readonly SENSOR_ORIENTATION: 109;
        readonly SENSOR_LIST: 110;
        readonly SENSOR_STOP: 111;
        readonly BT_SCAN: 112;
        readonly BT_CONNECT: 113;
        readonly BT_SEND: 114;
        readonly BT_DISCONNECT: 115;
        readonly BT_STATUS: 116;
        readonly NFC_READ: 128;
        readonly NFC_WRITE: 129;
        readonly NFC_STATUS: 130;
        readonly VIBRATE: 144;
        readonly HAPTIC: 145;
        readonly TORCH_ON: 160;
        readonly TORCH_OFF: 161;
        readonly BATTERY_LEVEL: 176;
        readonly DEVICE_INFO: 177;
        readonly BATTERY_WATCH: 178;
        readonly CLIPBOARD_WRITE: 192;
        readonly CLIPBOARD_READ: 193;
        readonly FILE_PICK: 208;
        readonly FILE_SAVE: 209;
        readonly FILE_READ: 210;
        readonly FILE_WRITE: 211;
        readonly FILE_DELETE: 212;
        readonly FILE_LIST: 213;
        readonly FILE_MKDIR: 214;
        readonly FILE_DIRS: 215;
        readonly GALLERY_IMAGES: 216;
        readonly GALLERY_VIDEOS: 217;
        readonly AUDIO_FILES: 218;
        readonly PHONE_CALL: 224;
        readonly PHONE_DIAL: 225;
        readonly PHONE_CALL_LOGS: 226;
        readonly PHONE_CARRIER: 227;
        readonly PHONE_SIM_STATE: 228;
        readonly PHONE_NUMBER: 229;
        readonly SMS_SEND: 232;
        readonly SMS_COMPOSE: 233;
        readonly SMS_INBOX: 234;
        readonly SMS_SENT: 235;
        readonly CONTACTS_GET: 236;
        readonly CONTACTS_SEARCH: 237;
        readonly CONTACTS_ADD: 238;
        readonly CONTACTS_UPDATE: 239;
        readonly AUDIO_PLAY: 240;
        readonly AUDIO_STOP: 241;
        readonly AUDIO_PAUSE: 242;
        readonly AUDIO_VOLUME: 243;
        readonly VIDEO_OPEN_CAMERA: 244;
        readonly VIDEO_RECORD: 245;
        readonly VIDEO_STOP: 246;
        readonly VIDEO_PLAY: 247;
        readonly VIDEO_GALLERY: 248;
        readonly FETCH_GET: 250;
        readonly FETCH_POST: 251;
        readonly FETCH_PUT: 252;
        readonly FETCH_PATCH: 253;
        readonly FETCH_DELETE: 254;
    };
    HW_EVENT: {
        readonly CAMERA_PHOTO_READY: 32;
        readonly CAMERA_FRAME: 33;
        readonly GPS_UPDATE: 48;
        readonly GPS_ERROR: 49;
        readonly WEBRTC_OFFER: 64;
        readonly WEBRTC_ANSWER: 65;
        readonly WEBRTC_ICE: 66;
        readonly WEBRTC_CONNECTED: 67;
        readonly WEBRTC_DISCONNECTED: 68;
        readonly WEBRTC_FRAME: 69;
        readonly MIC_DATA: 80;
        readonly SENSOR_DATA: 96;
        readonly BT_DEVICE: 112;
        readonly BT_DATA: 114;
        readonly NFC_TAG: 128;
        readonly BATTERY_UPDATE: 176;
        readonly PHONE_STATE: 224;
        readonly SMS_RECEIVED: 232;
        readonly FETCH_RESPONSE: 250;
        readonly ERROR: 255;
    };
    buildHWCall: typeof buildHWCall;
    parseHWEvent: typeof parseHWEvent;
};
export default _default;
//# sourceMappingURL=index.d.ts.map