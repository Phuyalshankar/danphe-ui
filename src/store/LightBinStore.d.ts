/**
 * 🌊 Dolphin Light BinStore - Super Lightweight Key-Value Store
 * ~2KB minified. Works everywhere: Node, Browser, React Native, Native.
 */
/** Options accepted when constructing a {@link LightBinStore}. */
export interface LightBinStoreOptions {
    /** Namespace prefix used for every stored key (also used for localStorage persistence). */
    namespace?: string;
}
/** Options accepted by {@link LightBinStore.set}. */
export interface LightBinStoreSetOptions {
    /** Time-to-live in milliseconds. When it elapses the key is treated as deleted. */
    ttl?: number;
}
/** Anything that can be handed to {@link LightBinStore.set}. */
export type LightStoreValue = Buffer | Uint8Array | string | number | boolean | Record<string, unknown> | unknown[] | null;
/**
 * Super lightweight, dependency-free key/value store backed by in-memory `Map`s,
 * with optional persistence to `localStorage` when available (browser / React Native).
 */
export declare class LightBinStore {
    private readonly ns;
    private readonly _store;
    private readonly _meta;
    private readonly _ttl;
    constructor(options?: LightBinStoreOptions);
    set(key: string | number, value: LightStoreValue, options?: LightBinStoreSetOptions): this;
    get<T = unknown>(key: string | number, def?: T | null): T | null;
    has(key: string | number): boolean;
    delete(key: string | number): this;
    clear(): this;
    keys(): string[];
    get size(): number;
    getStats(): {
        keys: number;
        bytes: number;
        avg: number;
    };
    export(): Buffer;
    import(buf: Buffer): this;
    private _key;
    private _save;
    private _load;
}
declare const _default: {
    LightBinStore: typeof LightBinStore;
};
export default _default;
//# sourceMappingURL=LightBinStore.d.ts.map