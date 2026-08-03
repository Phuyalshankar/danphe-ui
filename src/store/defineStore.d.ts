import type { DolphinApp } from './types';
/**
 * defineStore — Zustand-style state management for Dolphin Native
 *
 * Usage (store/index.ts मा):
 *
 *   import { defineStore } from 'dolphin-native';
 *
 *   const useStore = defineStore((set, get, patch) => ({
 *       // ── State ──
 *       tasks:   [] as Task[],
 *       counter: 0,
 *
 *       // ── Actions ──
 *       addTask: (text: string) => {
 *           set('tasks', [...get('tasks'), { id: Date.now(), title: text }]);
 *           patch('Todo');
 *       },
 *       increment: () => set('counter', get('counter') + 1),
 *   }));
 *
 *   export { useStore };
 *
 * app.tsx मा:
 *   useStore.bind(app).screens({ Todo, Home });
 *
 * जुनसुकै page/action मा:
 *   const tasks = useStore.get('tasks');
 *   useStore.actions.addTask('नयाँ काम');
 */
/** Any function is treated as an "action"; everything else is "state". */
type AnyFunction = (...args: unknown[]) => unknown;
/** Extracts the state-shaped (non-function) keys of a store slice. */
export type StateOf<T> = {
    [K in keyof T as T[K] extends AnyFunction ? never : K]: T[K];
};
/** Extracts the action-shaped (function) keys of a store slice. */
export type ActionsOf<T> = {
    [K in keyof T as T[K] extends AnyFunction ? K : never]: T[K];
};
type ScreenRenderFn = () => unknown;
/** Setter passed into the {@link defineStore} builder function. */
export type StoreSet = (key: string, value: unknown) => void;
/** Getter passed into the {@link defineStore} builder function. */
export type StoreGet = (key: string) => unknown;
/** Patch/re-render trigger passed into the {@link defineStore} builder function. */
export type StorePatch = (...screenNames: string[]) => void;
/** The builder function supplied to {@link defineStore}. */
export type StoreSliceFn<T extends Record<string, unknown>> = (set: StoreSet, get: StoreGet, patch: StorePatch) => T;
/** The object returned by {@link defineStore}. */
export interface DolphinStoreDefinition<T extends Record<string, unknown>> {
    bind(app: DolphinApp): DolphinStoreDefinition<T>;
    screens(screenMap: Record<string, ScreenRenderFn>): DolphinStoreDefinition<T>;
    get: StoreGet;
    set: StoreSet;
    patch: StorePatch;
    actions: ActionsOf<T>;
}
declare function defineStore<T extends Record<string, unknown>>(sliceFn: StoreSliceFn<T>): DolphinStoreDefinition<T>;
export { defineStore };
declare const _default: {
    defineStore: typeof defineStore;
};
export default _default;
//# sourceMappingURL=defineStore.d.ts.map