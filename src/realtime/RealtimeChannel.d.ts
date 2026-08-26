import { EventEmitter } from 'events';
import { RealtimeChannelConfig, EmitOpts, ChannelMessage, TopicHandler } from './types';
declare const EventEmitterBase: {
    new (): Omit<EventEmitter, "on" | "off" | "emit">;
};
declare class RealtimeChannel extends EventEmitterBase {
    name: string;
    historyLimit: number;
    deduplicate: boolean;
    private _subscribers;
    private _history;
    private _seen;
    private _seenLimit;
    private _transport;
    constructor(config?: RealtimeChannelConfig);
    on(topic: string, handler: TopicHandler): () => void;
    off(topic: string, handler: TopicHandler): void;
    emit(topic: string, data: unknown, opts?: EmitOpts): boolean;
    private _dispatch;
    getHistory(topic?: string | null, limit?: number): ChannelMessage[];
    replay(topic: string, handler: TopicHandler): void;
    clear(): void;
    static PRIORITY: {
        readonly HIGH: 0;
        readonly NORMAL: 1;
        readonly LOW: 2;
    };
}
export default RealtimeChannel;
//# sourceMappingURL=RealtimeChannel.d.ts.map