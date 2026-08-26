/**
 * 🌊 DolphinJS — Hardware API shared types
 *
 * Every domain method (Camera.takePicture, GPS.getLocation, ...) returns a
 * plain descriptor object — not a live call. The host runtime reads `cmd`
 * + `params`, serializes via `buildHWCall`, and dispatches over the wire.
 */
import { HWCmdValue } from './protocol';
export interface HWDescriptor<TParams = Record<string, unknown>> {
    _hw: true;
    cmd: HWCmdValue;
    params: TParams;
}
/** A function-valued `_action` entry, e.g. `call: (n) => 'hw:phone:call'` */
export type ActionFn = (...args: string[]) => string;
export type ActionEntry = string | ActionFn;
export type ActionMap = Record<string, ActionEntry>;
export interface TakePictureOptions {
    quality?: number;
    facing?: string;
}
export interface CameraOpenParams {
    facing: string;
    flash: 'auto';
}
export interface CameraStartVideoOptions {
    [key: string]: unknown;
}
export interface GetLocationOptions {
    accuracy?: string;
    timeout?: number;
}
export interface GPSWatchOptions {
    interval?: number;
    accuracy?: string;
}
export interface AudioPlayOptions {
    loop?: boolean;
}
export interface MicStartOptions {
    sampleRate?: number;
    channels?: number;
}
export interface VideoStartRecordingOptions {
    quality?: string;
    front?: boolean;
}
export interface FetchOptions {
    headers?: Record<string, string>;
    timeout?: number;
}
export type FetchBody = string | Record<string, unknown> | unknown;
export interface IceServer {
    urls: string;
    [key: string]: unknown;
}
export interface CreatePeerOptions {
    peerId?: string;
    iceServers?: IceServer[];
    audio?: boolean;
    video?: boolean;
}
export type HapticStyle = string;
//# sourceMappingURL=types.d.ts.map