import { HWDescriptor, TakePictureOptions, CameraOpenParams, CameraStartVideoOptions } from './types';
/**
 * 🌊 DolphinJS Hardware — Camera
 */
export declare const Camera: {
    takePicture: (options?: TakePictureOptions) => HWDescriptor<{
        quality: number;
        facing: string;
    }>;
    open: (facing?: string) => HWDescriptor<CameraOpenParams>;
    close: () => HWDescriptor<Record<string, never>>;
    switchFace: () => HWDescriptor<Record<string, never>>;
    startVideo: (o?: CameraStartVideoOptions) => HWDescriptor<CameraStartVideoOptions>;
    stopVideo: () => HWDescriptor<Record<string, never>>;
    _action: {
        open: string;
        takePhoto: string;
    };
};
export type CameraModule = typeof Camera;
//# sourceMappingURL=Camera.d.ts.map