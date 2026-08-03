/**
 * Shared type definitions for the "Dolphin Native" app-binding helpers
 * (`defineStore`, `definePage`, `defineModulePage`).
 *
 * These describe the minimal surface of the host `app` object that Dolphin
 * Native provides at runtime — state registration, action dispatch and
 * screen patching.
 */
/** Handler invoked when a registered action is dispatched. */
export type DolphinActionHandler = (action: unknown, value: unknown, deviceId: unknown) => unknown | Promise<unknown>;
/** The host application object that pages/stores bind themselves to. */
export interface DolphinApp {
    /** Registers (or updates) a piece of top-level state. */
    state(key: string, value: unknown): void;
    /** Reads the current value of a piece of state. */
    getState(key: string): unknown;
    /** Registers an action handler. */
    action(key: string, handler: DolphinActionHandler): void;
    /** Registers/updates the compiled UI for a named screen. */
    screen(name: string, ui: unknown): void;
    /** Tells the runtime to re-render/patch a previously registered screen. */
    patchScreen(name: string): void;
}
//# sourceMappingURL=types.d.ts.map