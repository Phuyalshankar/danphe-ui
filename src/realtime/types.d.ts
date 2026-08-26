/**
 * 🌊 DolphinRealtime — Shared Types
 *
 * Central types for WebSocketClient, RealtimeChannel, and StreamManager.
 * Binary frame layouts, command codes, and event payload shapes must
 * match the native runtime — do not rename or renumber these.
 */
export interface WebSocketClientConfig {
    url?: string;
    host?: string;
    port?: number;
    heartbeatMs?: number;
    maxRetries?: number;
    retryDelay?: number;
    maxDelay?: number;
}
export type TitanFrameType = number;
export interface TitanFrameMap {
    PING: 0x30;
    PONG: 0x31;
    SUBSCRIBE: 0xf2;
    PUBLISH: 0xf3;
    ACK: 0xf4;
    ERROR: 0xf5;
    STREAM: 0x15;
    PRESENCE: 0xf7;
}
export type ChannelHandler = (payload: Buffer, channel: string, isStream?: boolean) => void;
export interface FrameEvent {
    type: TitanFrameType;
    channel: string;
    payload: Buffer;
}
export interface ServerErrorEvent {
    channel: string;
    msg: string;
}
export interface PresenceEvent {
    channel: string;
    status: string;
}
export interface ReconnectingEvent {
    attempt: number;
    delay: number;
}
export interface ConnectedEvent {
    url?: string;
}
export interface RealtimeChannelConfig {
    name?: string;
    history?: number;
    deduplicate?: boolean;
    transport?: PublishTransport | null;
}
export interface PublishTransport {
    publish(channel: string, data: unknown): boolean;
}
export interface PriorityMap {
    HIGH: 0;
    NORMAL: 1;
    LOW: 2;
}
export type PriorityValue = 0 | 1 | 2;
export interface EmitOpts {
    id?: string;
    priority?: PriorityValue;
}
export interface ChannelMessage {
    id: string;
    topic: string;
    data: unknown;
    at: number;
    priority: PriorityValue;
    binary: boolean;
}
export type TopicHandler = (data: unknown, msg: ChannelMessage) => void;
export interface StreamTypeMap {
    SENSOR: 0x01;
    CAMERA: 0x02;
    AUDIO: 0x03;
    TELEMETRY: 0x04;
    CUSTOM: 0xff;
}
export type StreamTypeValue = 0x01 | 0x02 | 0x03 | 0x04 | 0xff;
export interface DataStreamConfig {
    id?: number;
    type?: StreamTypeValue;
    name?: string;
    buffer?: number;
}
export interface StreamFrameMeta {
    seq: number;
    streamId: number;
    frame?: Buffer;
}
export type StreamSubscriber = (data: Buffer, meta: StreamFrameMeta) => void;
export interface StreamStats {
    framesIn: number;
    bytesIn: number;
    startedAt: number;
    dropped: number;
    fps: string;
    kbps: string;
    subscribers: number;
    buffered: number;
}
export interface StreamCreatedEvent {
    name: string;
    type: StreamTypeValue;
}
export interface StreamDestroyedEvent {
    name: string;
}
export interface StreamSummaryEntry extends StreamStats {
    name: string;
}
export interface WsLike {
    binaryType: string;
    readyState: number;
    on(event: string, listener: (...args: unknown[]) => void): void;
    send(data: Buffer): void;
    ping(): void;
    close(): void;
}
//# sourceMappingURL=types.d.ts.map