import type { DolphinApp } from './types';
/**
 * definePage — Zustand-style local state and action management for Dolphin Native pages.
 */
type GetFn = (key: string) => unknown;
type SetFn = (key: string, value: unknown) => void;
type PatchFn = () => void;
/** Handler signature for actions declared in a page's `config.actions`. */
export type PageActionHandler = (set: SetFn, get: GetFn, patch: PatchFn, value: unknown, deviceId: unknown) => unknown | Promise<unknown>;
/** Render function signature for a page's `config.render`. */
export type PageRenderFn = (get: GetFn) => unknown;
export interface DefinePageConfig {
    state?: Record<string, unknown>;
    actions?: Record<string, PageActionHandler>;
    render: PageRenderFn;
}
/** Object returned by {@link definePage}. */
export interface DolphinPage {
    name: string;
    state: Record<string, unknown>;
    actions: Record<string, PageActionHandler>;
    render: PageRenderFn;
    bind(app: DolphinApp): DolphinPage;
    getState(key: string): unknown;
    setState(key: string, value: unknown): DolphinPage;
}
declare function definePage(name: string, config: DefinePageConfig): DolphinPage;
/** Controller shape accepted by {@link defineControllerPage}. */
export interface PageController {
    state?: Record<string, unknown>;
    actions?: Record<string, PageActionHandler>;
}
/** UI component signature accepted by {@link defineControllerPage}. */
export type ControllerUiComponent = (props: Record<string, unknown> & {
    get: GetFn;
}) => unknown;
declare function defineControllerPage(name: string, controller: PageController, uiComponent: ControllerUiComponent): DolphinPage;
export { definePage, defineControllerPage };
declare const _default: {
    definePage: typeof definePage;
    defineControllerPage: typeof defineControllerPage;
};
export default _default;
//# sourceMappingURL=definePage.d.ts.map