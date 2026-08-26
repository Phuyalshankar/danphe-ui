// Type definitions for Dolphin Router (DolphinRouter.js)
// This file adds ONLY types. It does not change any variable name,
// property name, method name, or function signature of the original
// JavaScript source. It is safe to drop next to the untouched .js file.
//
// See ../AI.md for integration notes and known runtime quirks that are
// intentionally preserved (not "fixed") in these types.

export type RouterMode = 'hash' | 'history' | 'memory';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | '*';

/** Params extracted from a path pattern, e.g. "/user/:id" -> { id: string } */
export interface RouteParams {
    [paramName: string]: string;
}

/** Parsed query-string key/value pairs. */
export interface QueryParams {
    [key: string]: string;
}

/** Object passed to every route handler, beforeEach guard, and listener. */
export interface RouteContext<P extends RouteParams = RouteParams> {
    path: string;
    query: QueryParams;
    params: P;
    name?: string;
    router: DolphinRouter;
}

export type RouteHandler<P extends RouteParams = RouteParams> = (
    ctx: RouteContext<P>
) => void;

/** Handler shape used for the special '*' (not-found) route. */
export type NotFoundHandler = (ctx: RouteContext<Record<string, never>>) => void;

export type NextFn = () => void;
export type RejectFn = (err?: unknown) => void;

/**
 * Navigation guard: `beforeEach(ctx, next, reject)`.
 * Call `next()` to proceed to the route handler, or `reject(err)` to abort.
 */
export type BeforeEachGuard = (
    ctx: RouteContext,
    next: NextFn,
    reject: RejectFn
) => void;

/** Fired by `_notify` after every successful route resolution. */
export type RouteChangeListener = (path: string, ctx: RouteContext) => void;

/** Shape of the `onChange` constructor option (see AI.md for the shadowing quirk). */
export type RouteChangeHook = (path: string, ctx: RouteContext) => void;

export interface DolphinRouterOptions {
    /** Default: 'hash' in a browser (window defined), otherwise 'memory'. */
    mode?: RouterMode;
    /** Base path prefix used in 'history' mode. Default: ''. */
    base?: string;
    /** Global navigation guard run before every route handler. Default: null. */
    beforeEach?: BeforeEachGuard | null;
    /**
     * Optional hook stored as an instance property named `onChange`.
     * NOTE: setting this (or leaving it undefined, which defaults to null)
     * shadows the `onChange(fn)` prototype method — see AI.md.
     */
    onChange?: RouteChangeHook | null;
}

export interface Route {
    method: HttpMethod;
    path: string;
    pattern: RegExp;
    handler: RouteHandler;
    name: string;
    params: string[];
}

export type GroupCallback = (router: DolphinRouter, prefix: string) => void;

/**
 * 🌊 Dolphin Router — Ultra Lightweight URL Router.
 * Pure JavaScript, no dependencies. Works in Node.js, Browser, React Native.
 */
export declare class DolphinRouter {
    routes: Route[];
    mode: RouterMode;
    base: string;
    current: string | null;
    beforeEach: BeforeEachGuard | null;

    /**
     * Data property (not the prototype method below) because the
     * constructor always assigns `this.onChange = options.onChange || null`,
     * which shadows `onChange(fn)` on the prototype for every instance.
     * Documented in AI.md under "Known runtime quirks".
     */
    onChange: RouteChangeHook | null;

    _listeners: RouteChangeListener[];

    constructor(options?: DolphinRouterOptions);

    // ─── Route Registration ─────────────────────────────────────
    get<P extends RouteParams = RouteParams>(
        path: string,
        handler: RouteHandler<P>,
        name?: string
    ): this;

    post<P extends RouteParams = RouteParams>(
        path: string,
        handler: RouteHandler<P>,
        name?: string
    ): this;

    put<P extends RouteParams = RouteParams>(
        path: string,
        handler: RouteHandler<P>,
        name?: string
    ): this;

    delete<P extends RouteParams = RouteParams>(
        path: string,
        handler: RouteHandler<P>,
        name?: string
    ): this;

    any<P extends RouteParams = RouteParams>(
        path: string,
        handler: RouteHandler<P>,
        name?: string
    ): this;

    /** Register nested/prefixed routes: `router.group('/admin', (r, prefix) => {...})`. */
    group(prefix: string, callback: GroupCallback): this;

    // ─── Navigation ─────────────────────────────────────────────
    push(path: string, data?: Record<string, unknown>): void;
    replace(path: string, data?: Record<string, unknown>): void;
    back(): void;

    // ─── Lifecycle ──────────────────────────────────────────────
    start(): void;
    stop(): void;

    // ─── URL Helpers ────────────────────────────────────────────
    getPath(): string;
    getQuery(): QueryParams;

    // ─── Internal (kept for completeness; not part of the public contract) ──
    /** @internal */
    _addRoute(
        method: HttpMethod,
        path: string,
        handler: RouteHandler,
        name?: string
    ): void;
    /** @internal */
    _resolve(): void;
    /** @internal */
    _pathToRegex(path: string): RegExp;
    /** @internal */
    _extractParams(path: string): string[];
    /** @internal */
    _notify(path: string, ctx: RouteContext): void;
}

/**
 * Builds a URL by substituting `:param` tokens found in `path` with values
 * from `params`; any leftover keys are appended as a query string.
 */
export declare function buildUrl(
    path: string,
    params?: Record<string, string | number>
): string;

export interface LinkProps {
    to: string;
    children?: unknown;
    className?: string;
    activeClass?: string;
    onClick?: (...args: unknown[]) => void;
}

export interface LinkElement {
    type: 'Link';
    props: LinkProps;
}

/** Plain object "element" — this is NOT a JSX/React component, just a data shape. */
export declare function Link(props: LinkProps): LinkElement;
