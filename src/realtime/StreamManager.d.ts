import { EventEmitter } from 'events';
import { StreamTypeValue, DataStreamConfig, StreamSubscriber, StreamStats, StreamSummaryEntry } from './types';
declare class DataStream extends EventEmitter {
    id: number;
    type: StreamTypeValue;
    name: string;
    bufferSize: number;
    private _seq;
    private _frames;
    private _subs;
    private _recording;
    private _record;
    private _stats;
    private _paused;
    constructor(config?: DataStreamConfig);
    push(payload: Buffer | unknown): boolean;
    subscribe(fn: StreamSubscriber): () => void;
    unsubscribe(fn: StreamSubscriber): void;
    pause(): void;
    resume(): void;
    startRecording(): void;
    stopRecording(): Buffer;
    getLastN(n?: number): Buffer[];
    getStats(): StreamStats;
}
declare class StreamManager extends EventEmitter {
    private _streams;
    constructor();
    create(config?: DataStreamConfig): DataStream;
    get(name: string): DataStream | null;
    destroy(name: string): void;
    sensorStream(name: string, config?: DataStreamConfig): DataStream;
    cameraStream(name: string, config?: DataStreamConfig): DataStream;
    audioStream(name: string, config?: DataStreamConfig): DataStream;
    telemetryStream(name: string, config?: DataStreamConfig): DataStream;
    pipe(streamName: string, wsClient: {
        stream(channel: string, data: Buffer): unknown;
    }, channel: string): () => void;
    summary(): StreamSummaryEntry[];
    static TYPE: {
        readonly SENSOR: 1;
        readonly CAMERA: 2;
        readonly AUDIO: 3;
        readonly TELEMETRY: 4;
        readonly CUSTOM: 255;
    };
    static Stream: typeof DataStream;
}
export default StreamManager;
export { DataStream };
//# sourceMappingURL=StreamManager.d.ts.map