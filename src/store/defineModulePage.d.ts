import type { DolphinApp } from './types';
/**
 * Defines a feature-level MVC page with namespaced state and actions.
 * Controller actions receive { set, get, patch, value, deviceId, stateKey, actionKey }.
 */
type StateKeyFn = (key: string) => string;
type ActionKeyFn = (key: string) => string;
type GetFn = (key: string) => unknown;
type SetFn = (stateName: string, nextValue: unknown) => void;
type PatchFn = () => void;
/** Arguments passed to every controller action handler. */
export interface ModuleActionContext {
    set: SetFn;
    get: GetFn;
    patch: PatchFn;
    value: unknown;
    deviceId: unknown;
    stateKey: StateKeyFn;
    actionKey: ActionKeyFn;
}
export type ModuleActionHandler = (ctx: ModuleActionContext) => unknown | Promise<unknown>;
/** View props passed to a module page's `view` render function. */
export interface ModuleViewProps {
    get: GetFn;
    stateKey: StateKeyFn;
    actionKey: ActionKeyFn;
    [stateProp: string]: unknown;
}
export type ModuleViewFn = (props: ModuleViewProps) => unknown;
export interface ModuleController {
    state?: Record<string, unknown>;
    actions?: Record<string, ModuleActionHandler>;
}
export interface DefineModulePageConfig {
    name: string;
    controller?: ModuleController;
    view: ModuleViewFn;
}
/** Object returned by {@link defineModulePage}. */
export interface DolphinModulePage {
    name: string;
    stateKey: StateKeyFn;
    actionKey: ActionKeyFn;
    bind(app: DolphinApp): DolphinModulePage;
}
declare function defineModulePage(config: DefineModulePageConfig): DolphinModulePage;
export { defineModulePage };
declare const _default: {
    defineModulePage: typeof defineModulePage;
};
export default _default;
//# sourceMappingURL=defineModulePage.d.ts.map