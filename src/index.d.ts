// 🌊 Dolphin Native — TypeScript Declaration File
// Provides full autocomplete, IntelliSense, and compile-time type checking for JS/TS developers.

export interface AppConfig {
    name?: string;
    platform?: 'ANDROID' | 'IOS' | 'UNIVERSAL';
    debug?: boolean;
}

export type ActionCallback = (actionName: string, actionValue?: any) => void | Promise<void>;

export interface DolphinApp {
    name: string;
    platform: string;
    debug: boolean;

    /**
     * Get or set a reactive state key in the offline state engine.
     */
    state(key: string): any;
    state(key: string, value: any): void;

    /**
     * Define a UI screen with standard components or layouts.
     */
    screen(name: string, screenElement: any): void;

    /**
     * Navigate to a registered screen on the mobile interface.
     */
    navigate(screenName: string): void;

    /**
     * Register a callback to handle dynamic actions or event patterns.
     * Use wildcards like 'intercom:*' or 'nav:*' for grouping.
     */
    action(pattern: string, callback: ActionCallback): void;

    /**
     * Set the main entrance screen for the application.
     */
    entry(screenName: string): void;
}

export class DolphinCSS {
    constructor(config?: any);
    compile(html: string, options?: any): Buffer;
    compileForPlatform(html: string, platform: string, options?: any): Buffer;
    parse(binary: Buffer, options?: any): any;
    toCHeader(binary: Buffer, name: string, options?: any): string;
    destroy(): void;
}

export class LightBinStore {
    constructor(config?: any);
    get(key: string): any;
    set(key: string, value: any): void;
}

export type DolphinRouterOptions = import("./router/DolphinRouter").DolphinRouterOptions;
export type DolphinRouter = import("./router/DolphinRouter").DolphinRouter;
export declare const DolphinRouter: typeof import("./router/DolphinRouter").DolphinRouter;
export declare const buildUrl: typeof import("./router/DolphinRouter").buildUrl;
export declare const Link: typeof import("./router/DolphinRouter").Link;

// Global Factory Functions
export function createApp(config?: AppConfig): DolphinApp;
export function createStore(config?: any): LightBinStore;
export function createRouter(config?: DolphinRouterOptions): import("./router/DolphinRouter").DolphinRouter;

export function compileHTML(html: string, options?: any): Buffer;
export function compileForPlatform(html: string, platform: string, options?: any): Buffer;
export function parseBinary(binary: Buffer, options?: any): any;
export function toCHeader(binary: Buffer, name: string, options?: any): string;

export const version: string;
export const platforms: string[];

export function health(): {
    status: string;
    version: string;
    timestamp: string;
    crossPlatform: boolean;
    supportedPlatforms: string[];
};

// Unified JSX Components
export interface ComponentProps {
    className?: string;
    id?: string;
    stateKey?: string;
    action?: string;
    text?: string;
    content?: string;
    label?: string;
    placeholder?: string;
    initial?: string | number | boolean;
    min?: string | number;
    max?: string | number;
    value?: any;
    children?: any;
}

export function Button(props: ComponentProps): any;
export function Text(props: ComponentProps): any;
export function Slider(props: ComponentProps): any;
export function Switch(props: ComponentProps): any;
export function Checkbox(props: ComponentProps): any;
export function Radio(props: ComponentProps): any;
export function TextField(props: ComponentProps): any;
export function Select(props: ComponentProps): any;
export function Image(props: ComponentProps): any;
export function Row(props: ComponentProps): any;
export function Column(props: ComponentProps): any;
export function Card(props: ComponentProps): any;
export function Grid(props: ComponentProps): any;
export function ListView(props: ComponentProps): any;
export function AppBar(props: ComponentProps): any;

// ─── NanoStore — Full TypeScript Types ───────────────────────────────────────

export type DolphinState = Record<string, unknown>;

export interface BindProps<T = unknown> {
    value: T;
    onChange: (eventOrValue: { target: { type?: string; checked?: boolean; value?: T } } | T) => void;
}

export interface DolphinStore<S extends DolphinState> {
    get(): S;
    get<K extends keyof S>(key: K): S[K];
    set<K extends keyof S>(key: K, value: S[K]): void;
    setMany(updates: Partial<S>): void;
    update(fn: (state: S) => S): void;
    reset(): void;
    subscribe(listener: (state: S, key?: keyof S, value?: unknown) => void): () => void;
    setTemp<K extends keyof S>(key: K, value: S[K], duration?: number): () => void;
    use<K extends keyof S>(key: K): S[K];
    useStore<R = S>(selector?: (state: S) => R): R;
    usePath<T = unknown>(pathStr: string): T;
    usePick(...paths: string[]): Record<string, unknown>;
    bind<K extends keyof S>(key: K): BindProps<S[K]>;
    useBind<K extends keyof S>(key: K): BindProps<S[K]>;
    persist(storageKey: string): (() => void) | undefined;
    $<K extends keyof S>(key: K): S[K];
    $$(...paths: string[]): Record<string, unknown>;
    $path<T = unknown>(pathStr: string): T;
    $temp<K extends keyof S>(key: K, value: S[K], duration?: number): () => void;
}

export interface DolphinAtom<T> {
    (): T;
    set(value: T): void;
    setTemp(value: T, duration?: number): () => void;
    get(): T;
}

export function createStore<S extends DolphinState>(initial: S): DolphinStore<S>;
export function createNanoStore<S extends DolphinState>(initial: S): DolphinStore<S>;
export function atom<T>(initial: T): DolphinAtom<T>;

// ─── defineStore ─────────────────────────────────────────────────────────────

export type StoreSet = (key: string, value: unknown) => void;
export type StoreGet = (key: string) => unknown;
export type StorePatch = (...screenNames: string[]) => void;
export type StoreSliceFn<T extends Record<string, unknown>> = (set: StoreSet, get: StoreGet, patch: StorePatch) => T;
export type StateOf<T> = { [K in keyof T as T[K] extends ((...args: unknown[]) => unknown) ? never : K]: T[K] };
export type ActionsOf<T> = { [K in keyof T as T[K] extends ((...args: unknown[]) => unknown) ? K : never]: T[K] };

export interface DolphinStoreDefinition<T extends Record<string, unknown>> {
    bind(app: DolphinApp): DolphinStoreDefinition<T>;
    screens(screenMap: Record<string, () => unknown>): DolphinStoreDefinition<T>;
    get: StoreGet;
    set: StoreSet;
    patch: StorePatch;
    actions: ActionsOf<T>;
}

export function defineStore<T extends Record<string, unknown>>(sliceFn: StoreSliceFn<T>): DolphinStoreDefinition<T>;

// ─── definePage ──────────────────────────────────────────────────────────────

export interface DefinePageConfig {
    name: string;
    state?: Record<string, unknown>;
    actions?: Record<string, (value?: unknown, deviceId?: unknown) => unknown | Promise<unknown>>;
    render: (state: Record<string, unknown>) => unknown;
}

export function definePage(config: DefinePageConfig): { bind: (app: DolphinApp) => void };
export function defineControllerPage(config: DefinePageConfig): { bind: (app: DolphinApp) => void };

// ─── Intercom — Full TypeScript Types ────────────────────────────────────────

export type DispatchFn = (buf: Buffer) => void;

export interface HttpCallConfig {
    baseURL?: string;
    timeout?: number;
    retries?: number;
    headers?: Record<string, string>;
    dispatch?: DispatchFn;
}

export interface VideoCallConfig {
    peerId: string;
    audio?: boolean;
    video?: boolean;
    iceServers?: string[];
    dispatch?: DispatchFn;
}

export interface ChatConfig {
    userId: string;
    roomId: string;
    dispatch?: DispatchFn;
    offlineQueue?: boolean;
}

export interface MeetingConfig {
    hostId?: string;
    title?: string;
    maxParticipants?: number;
    dispatch?: DispatchFn;
}

export interface GroupConfig {
    name: string;
    createdBy: string;
    dispatch?: DispatchFn;
}

export declare class HttpCall {
    constructor(config?: HttpCallConfig);
    get(path: string, params?: Record<string, unknown>): Promise<unknown>;
    post(path: string, body?: unknown): Promise<unknown>;
    put(path: string, body?: unknown): Promise<unknown>;
    delete(path: string): Promise<unknown>;
    useRequest(fn: (config: HttpCallConfig) => HttpCallConfig): void;
    useResponse(fn: (res: unknown) => unknown): void;
}

export declare class VideoCall {
    constructor(config: VideoCallConfig);
    start(): void;
    answer(): void;
    hangup(): void;
    mute(): void;
    unmute(): void;
    on(event: 'stateChange' | 'ended' | 'hwCommand' | 'titanCommand', listener: (...args: unknown[]) => void): this;
}

export declare class Chat {
    constructor(config: ChatConfig);
    connect(): void;
    disconnect(): void;
    send(message: string, type?: 'text' | 'image' | 'audio' | 'video' | 'file'): void;
    react(messageId: string, emoji: string): void;
    markRead(messageId: string): void;
    on(event: 'message' | 'typing' | 'receipt' | 'hwCommand' | 'titanCommand', listener: (...args: unknown[]) => void): this;
}

export declare class Meeting {
    constructor(config?: MeetingConfig);
    start(): void;
    end(): void;
    join(userId: string): void;
    leave(userId: string): void;
    startScreenShare(userId: string): void;
    stopScreenShare(userId: string): void;
    on(event: 'participantJoined' | 'participantLeft' | 'ended' | 'hwCommand', listener: (...args: unknown[]) => void): this;
}

export declare class Group {
    chat: Chat;
    constructor(config: GroupConfig);
    create(): void;
    addMember(userId: string, role?: 'admin' | 'member'): void;
    removeMember(userId: string): void;
    send(message: string): void;
    on(event: 'memberJoined' | 'memberLeft' | 'message' | 'hwCommand', listener: (...args: unknown[]) => void): this;
}

export declare const Intercom: {
    HttpCall: typeof HttpCall;
    VideoCall: typeof VideoCall;
    Chat: typeof Chat;
    Meeting: typeof Meeting;
    Group: typeof Group;
    version: string;
    createHttpClient(config?: HttpCallConfig): HttpCall;
    createVideoCall(peerId: string, opts?: Omit<VideoCallConfig, 'peerId'>): VideoCall;
    createChat(userId: string, roomId: string, opts?: Omit<ChatConfig, 'userId' | 'roomId'>): Chat;
    createMeeting(config?: MeetingConfig): Meeting;
    createGroup(name: string, createdBy: string, opts?: Omit<GroupConfig, 'name' | 'createdBy'>): Group;
};

// ─── Realtime — Full TypeScript Types ────────────────────────────────────────

export interface WebSocketClientConfig {
    url?: string;
    host?: string;
    port?: number;
    heartbeatMs?: number;
    maxRetries?: number;
    retryDelay?: number;
    maxDelay?: number;
}

export interface RealtimeChannelConfig {
    name?: string;
    history?: number;
    deduplicate?: boolean;
    transport?: { publish(channel: string, data: unknown): boolean } | null;
}

export declare class WebSocketClient {
    constructor(urlOrOpts?: string | WebSocketClientConfig);
    connect(): void;
    disconnect(): void;
    subscribe(channelName: string, fn: (payload: Buffer, channel: string) => void): void;
    unsubscribe(channelName: string): void;
    publish(channelName: string, data: unknown): boolean;
    on(event: 'connected' | 'disconnected' | 'reconnecting' | 'serverError' | 'presence' | 'frame', listener: (...args: unknown[]) => void): this;
}

export declare class RealtimeChannel {
    constructor(config?: RealtimeChannelConfig);
    on(topic: string, handler: (data: unknown, msg: unknown) => void): this;
    off(topic: string, handler?: (...args: unknown[]) => void): this;
    emit(topic: string, data: unknown, opts?: { id?: string; priority?: 0 | 1 | 2 }): unknown;
    publish(topic: string, data: unknown): boolean;
    getHistory(topic?: string, limit?: number): unknown[];
    clearHistory(): void;
}

export declare class StreamManager {
    constructor();
    create(name: string, opts?: { id?: number; type?: number; buffer?: number }): unknown;
    get(name: string): unknown;
    destroy(name: string): boolean;
    sensorStream(name?: string, bufferSize?: number): unknown;
    cameraStream(name?: string, bufferSize?: number): unknown;
    audioStream(name?: string, bufferSize?: number): unknown;
    telemetryStream(name?: string, bufferSize?: number): unknown;
    getSummary(): Record<string, unknown>;
}

export declare class DataStream {
    push(chunk: Buffer): boolean;
    subscribe(fn: (data: Buffer, meta: unknown) => void): () => void;
    getStats(): Record<string, unknown>;
    pause(): void;
    resume(): void;
}

export declare const Realtime: {
    WebSocketClient: typeof WebSocketClient;
    RealtimeChannel: typeof RealtimeChannel;
    StreamManager: typeof StreamManager;
    version: string;
    createClient(url: string, opts?: WebSocketClientConfig): WebSocketClient;
    createChannel(name: string, opts?: RealtimeChannelConfig): RealtimeChannel;
    createStreamManager(): StreamManager;
};

export declare const WebSocketClient: typeof WebSocketClient;
export declare const RealtimeChannel: typeof RealtimeChannel;
export declare const StreamManager: typeof StreamManager;

// ─── Hardware — Full TypeScript Types ─────────────────────────────────────────

export type TakePictureOptions = import("./hardware/types").TakePictureOptions;
export type GetLocationOptions = import("./hardware/types").GetLocationOptions;
export type FetchOptions = import("./hardware/types").FetchOptions;
export type FetchBody = import("./hardware/types").FetchBody;
export type HWDescriptor<T> = import("./hardware/types").HWDescriptor<T>;

export declare const Hardware: import("./hardware/DolphinHardwareAPI").DolphinHardware;
export declare const Camera: import("./hardware/DolphinHardwareAPI").DolphinHardware['Camera'];
export declare const GPS: import("./hardware/DolphinHardwareAPI").DolphinHardware['GPS'];
export declare const Phone: import("./hardware/DolphinHardwareAPI").DolphinHardware['Phone'];
export declare const SMS: import("./hardware/DolphinHardwareAPI").DolphinHardware['SMS'];
export declare const Contacts: import("./hardware/DolphinHardwareAPI").DolphinHardware['Contacts'];
export declare const Audio: import("./hardware/DolphinHardwareAPI").DolphinHardware['Audio'];
export declare const Mic: import("./hardware/DolphinHardwareAPI").DolphinHardware['Mic'];
export declare const Video: import("./hardware/DolphinHardwareAPI").DolphinHardware['Video'];
export declare const Storage: import("./hardware/DolphinHardwareAPI").DolphinHardware['Storage'];
export declare const File: import("./hardware/DolphinHardwareAPI").DolphinHardware['File'];
export declare const Fetch: import("./hardware/DolphinHardwareAPI").DolphinHardware['Fetch'];
export declare const Sensor: import("./hardware/DolphinHardwareAPI").DolphinHardware['Sensor'];
export declare const Battery: import("./hardware/DolphinHardwareAPI").DolphinHardware['Battery'];
export declare const Device: import("./hardware/DolphinHardwareAPI").DolphinHardware['Device'];
export declare const WebRTC: import("./hardware/DolphinHardwareAPI").DolphinHardware['WebRTC'];
export declare const Bluetooth: import("./hardware/DolphinHardwareAPI").DolphinHardware['Bluetooth'];
export declare const NFC: import("./hardware/DolphinHardwareAPI").DolphinHardware['NFC'];
export declare const Haptic: import("./hardware/DolphinHardwareAPI").DolphinHardware['Haptic'];
export declare const Torch: import("./hardware/DolphinHardwareAPI").DolphinHardware['Torch'];
export declare const Clipboard: import("./hardware/DolphinHardwareAPI").DolphinHardware['Clipboard'];

declare module "dolphin-native/ui/mui" {
    export * from "./ui/mui";
}

declare module "dolphin-native/src/ui/mui.js" {
    export * from "./ui/mui";
}

declare module "dolphin-native/ui/bootstrap" {
    export * from "./ui/bootstrap";
}

declare module "dolphin-native/src/ui/bootstrap.js" {
    export * from "./ui/bootstrap";
}

export declare const TitanIcon: (props: { id?: number; name?: string; mode?: string; bit?: number; size?: number; color?: string; className?: string }) => any;
export declare const PhoneIcon: typeof TitanIcon;
export declare const ICONS: Record<string, number>;
export declare const NAME_TO_ID: Record<string, number>;
export declare function getIconSvg(idOrName: number | string, color?: string): string;



