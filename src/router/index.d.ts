// Type declarations for router/index.js
// Mirrors the original CommonJS re-export exactly:
//   module.exports = { DolphinRouter, buildUrl, Link };
// No names added, removed, or renamed.

export { DolphinRouter, buildUrl, Link } from './DolphinRouter';
export type {
    RouterMode,
    HttpMethod,
    RouteParams,
    QueryParams,
    RouteContext,
    RouteHandler,
    NotFoundHandler,
    NextFn,
    RejectFn,
    BeforeEachGuard,
    RouteChangeListener,
    RouteChangeHook,
    DolphinRouterOptions,
    Route,
    GroupCallback,
    LinkProps,
    LinkElement,
} from './DolphinRouter';
