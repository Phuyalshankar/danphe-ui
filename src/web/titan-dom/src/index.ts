/**
 * 🐬 TITAN-DOM (TypeScript)
 * Universal Zero-VDOM Reactive DOM, Component & Routing Engine for Titan Bus
 *
 * Exports:
 * - TitanRegisterStore
 * - TitanDOMEngine
 * - TitanComponentManager
 * - TitanRouter
 * - createTitanApp() (Convenience Factory)
 */

export * from "./types";
export * from "./core";
export * from "./component";
export * from "./router";
export * from "./error";

import { TitanRegisterStore, TitanDOMEngine } from "./core";
import { TitanComponentManager } from "./component";
import { TitanRouter } from "./router";
import { TitanErrorManager, ERROR_REGISTERS, ErrorModule, ErrorSeverity } from "./error";
import { TitanDOMOptions, RouterOptions } from "./types";

export interface TitanApp {
  store: TitanRegisterStore;
  engine: TitanDOMEngine;
  components: TitanComponentManager;
  router: TitanRouter;
  errors: TitanErrorManager;
  mount: (root?: Document | HTMLElement) => Promise<TitanApp>;
}

/**
 * Creates and initializes a complete Titan application instance
 * with Register Store, Reactive DOM Engine, Component Manager, and Router.
 */
export function createTitanApp(options: {
  dom?: TitanDOMOptions;
  router?: RouterOptions;
} = {}): TitanApp {
  const store = (options.dom?.store as TitanRegisterStore) || new TitanRegisterStore();
  const engine = new TitanDOMEngine({ ...options.dom, store });
  const components = new TitanComponentManager(engine);
  const router = new TitanRouter(engine, components, options.router);

  const app: TitanApp = {
    store,
    engine,
    components,
    router,
    errors: engine.errors,
    async mount(root?: Document | HTMLElement): Promise<TitanApp> {
      engine.init(root);
      await components.scanAndHydrate(engine.root || document);
      router.init();
      return app;
    }
  };

  // Expose on global window if in browser environment
  if (typeof window !== "undefined") {
    (window as any).TitanDOM = engine;
    (window as any).TitanApp = app;
    (window as any).createTitanApp = createTitanApp;
    (window as any).TitanRegisterStore = TitanRegisterStore;
    (window as any).TitanDOMEngine = TitanDOMEngine;
    (window as any).TitanComponentManager = TitanComponentManager;
    (window as any).TitanRouter = TitanRouter;
    (window as any).TitanErrorManager = TitanErrorManager;
    (window as any).ERROR_REGISTERS = ERROR_REGISTERS;
    (window as any).ErrorModule = ErrorModule;
    (window as any).ErrorSeverity = ErrorSeverity;
  }

  return app;
}

// ─── Default Auto-Bootstrapping Application ─────────────────────────────────
let defaultApp: TitanApp | null = null;

export function getDefaultTitanApp(): TitanApp {
  if (!defaultApp) {
    defaultApp = createTitanApp();
  }
  return defaultApp;
}

// Global Browser API & Auto-Bootstrap
if (typeof window !== "undefined") {
  const app = getDefaultTitanApp();

  // Convenient, powerful global Titan proxy
  const Titan = {
    app,
    store: app.store,
    engine: app.engine,
    components: app.components,
    router: app.router,

    // Store shortcuts
    read: (reg: number, defVal?: any) => app.store.read(reg, defVal),
    write: (reg: number, val: any) => app.store.write(reg, val),
    toggle: (reg: number) => app.store.toggle(reg),
    increment: (reg: number, step?: number) => app.store.increment(reg, step),
    decrement: (reg: number, step?: number) => app.store.decrement(reg, step),
    on: (reg: number, cb: any) => app.store.on(reg, cb),
    writeBatch: (map: Record<number, any>) => app.store.writeBatch(map),
    readBatch: (regs: number[]) => app.store.readBatch(regs),

    // Form & Action shortcuts
    getFormData: (selector: string | HTMLElement) => app.engine.getFormData(selector),
    action: (name: string, fn: any) => app.engine.registerAction(name, fn),

    // Router & Component shortcuts
    navigate: (path: string) => app.router.navigate(path),
    route: (path: string, component: string, registerId?: number) =>
      app.router.add({ path, component, registerId }),
    component: (def: any) => app.components.define(def),
    loadFile: (name: string, path: string) => app.components.loadFile(name, path),

    // Error & Fetch shortcuts
    errors: app.engine.errors,
    reportError: (info: any) => app.engine.errors.report(info),
    clearError: () => app.engine.errors.clear(),
    fetch: (url: string, reg: number) => app.engine.fetchData(url, reg)
  };

  (window as any).Titan = Titan;
  (window as any).TitanDOM = app.engine;
  (window as any).TitanApp = app;
  (window as any).createTitanApp = createTitanApp;
  (window as any).TitanRegisterStore = TitanRegisterStore;
  (window as any).TitanDOMEngine = TitanDOMEngine;
  (window as any).TitanComponentManager = TitanComponentManager;
  (window as any).TitanRouter = TitanRouter;

  // 🚀 Auto-Bootstrap: Zero JS Required!
  const autoInit = () => {
    const root = document.querySelector("[tb-app]") || document.body;
    if (root && !(window as any)._titanMounted) {
      (window as any)._titanMounted = true;
      app.mount(root as HTMLElement);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInit);
  } else {
    // DOM already ready (e.g. async or deferred script)
    setTimeout(autoInit, 0);
  }
}
