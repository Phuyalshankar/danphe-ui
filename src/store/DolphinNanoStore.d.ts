interface DolphinDevServer {
    patchState?: (action: null, key: unknown, value: unknown) => void;
    server?: {
        broadcast?: (payload: Buffer, opcode: number) => void;
    };
}
declare global {
    var dolphinDevServer: DolphinDevServer | undefined;
}
/** Base shape a Dolphin store's state must satisfy: a flat, string-keyed record. */
export type DolphinState = Record<string, unknown>;
type Listener<S extends DolphinState> = (state: S, key?: keyof S, value?: unknown) => void;
type Unsubscribe = () => void;
type Updater<S extends DolphinState> = (state: S) => S;
/** A `{ value, onChange }` pair suitable for spreading onto a controlled input. */
export interface BindProps<T = unknown> {
    value: T;
    onChange: (eventOrValue: {
        target: {
            type?: string;
            checked?: boolean;
            value?: T;
        };
    } | T) => void;
}
/** Public API returned by {@link createStore}. */
export interface DolphinStore<S extends DolphinState> {
    get(): S;
    get<K extends keyof S>(key: K): S[K];
    set<K extends keyof S>(key: K, value: S[K]): void;
    setMany(updates: Partial<S>): void;
    update(fn: Updater<S>): void;
    reset(): void;
    subscribe(listener: Listener<S>): Unsubscribe;
    setTemp<K extends keyof S>(key: K, value: S[K], duration?: number): Unsubscribe;
    use<K extends keyof S>(key: K): S[K];
    useStore<R = S>(selector?: (state: S) => R): R;
    usePath<T = unknown>(pathStr: string): T;
    usePick(...paths: string[]): Record<string, unknown>;
    bind<K extends keyof S>(key: K): BindProps<S[K]>;
    useBind<K extends keyof S>(key: K): BindProps<S[K]>;
    persist(storageKey: string): Unsubscribe | undefined;
    $<K extends keyof S>(key: K): S[K];
    $$(...paths: string[]): Record<string, unknown>;
    $path<T = unknown>(pathStr: string): T;
    $temp<K extends keyof S>(key: K, value: S[K], duration?: number): Unsubscribe;
}
declare function createStore<S extends DolphinState>(initial?: S): DolphinStore<S>;
declare function create<S extends DolphinState>(initial: S): DolphinStore<S>;
/** A single-value store, handy for one-off pieces of shared state. */
export interface DolphinAtom<T> {
    (): T;
    set(value: T): void;
    setTemp(value: T, duration?: number): Unsubscribe;
    get(): T;
}
declare function atom<T>(initial: T): DolphinAtom<T>;
export { createStore, create, atom };
declare const _default: {
    createStore: typeof createStore;
    create: typeof create;
    atom: typeof atom;
};
export default _default;
//# sourceMappingURL=DolphinNanoStore.d.ts.map