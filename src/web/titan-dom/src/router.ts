/**
 * 🐬 TITAN-DOM ROUTER (TypeScript)
 * Hardware-Synchronized Reactive Routing Engine for Titan Bus.
 * 
 * Features:
 * - Direct mapping between URL route and a 16-bit Titan Register (e.g. Register 990).
 * - Click `<a tb-link="/path">` -> updates view and writes route ID to Titan Bus.
 * - External hardware or server writes to Register 990 -> UI page immediately changes!
 * - Automatic active link highlighting with .active class.
 */

import { RouteDefinition, RouterOptions, RegisterId } from "./types";
import { TitanDOMEngine } from "./core";
import { TitanComponentManager } from "./component";

export class TitanRouter {
  private routes: Map<string, RouteDefinition> = new Map();
  private routeIdToPath: Map<RegisterId, string> = new Map();
  private pathToRouteId: Map<string, RegisterId> = new Map();
  private engine: TitanDOMEngine;
  private componentManager: TitanComponentManager;
  private options: Required<RouterOptions>;
  private currentPath: string = "";

  constructor(
    engine: TitanDOMEngine,
    componentManager: TitanComponentManager,
    options: RouterOptions = {}
  ) {
    this.engine = engine;
    this.componentManager = componentManager;
    this.options = {
      mode: options.mode || "hash",
      routeRegister: options.routeRegister !== undefined ? options.routeRegister : 990,
      viewSelector: options.viewSelector || "[tb-view]"
    };
  }

  add(route: RouteDefinition): this {
    this.routes.set(route.path, route);

    // Auto-assign numeric ID for register mapping if not provided
    const routeId = route.registerId !== undefined ? route.registerId : this.routes.size;
    this.routeIdToPath.set(routeId, route.path);
    this.pathToRouteId.set(route.path, routeId);

    return this;
  }

  init(): this {
    if (typeof window === "undefined") return this;

    // Listen to browser URL changes
    if (this.options.mode === "hash") {
      window.addEventListener("hashchange", () => this.handleLocationChange());
    } else {
      window.addEventListener("popstate", () => this.handleLocationChange());
    }

    // Intercept tb-link clicks globally
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const linkEl = target.closest<HTMLElement>("[tb-link]");
      if (linkEl) {
        e.preventDefault();
        const targetPath = linkEl.getAttribute("tb-link");
        if (targetPath) {
          this.navigate(targetPath);
        }
      }
    });

    // ⚡ Two-way synchronization with Titan Bus Register
    this.engine.store.on(this.options.routeRegister, (regVal) => {
      const targetRouteId = Number(regVal);
      const mappedPath = this.routeIdToPath.get(targetRouteId);
      if (mappedPath && mappedPath !== this.currentPath) {
        // Hardware or Server triggered route switch!
        this.navigate(mappedPath, false); // false = do not echo back write to register
      }
    });

    // Initial load
    this.handleLocationChange();
    return this;
  }

  navigate(path: string, syncRegister: boolean = true): void {
    if (typeof window !== "undefined") {
      if (this.options.mode === "hash") {
        window.location.hash = path.startsWith("#") ? path : `#${path}`;
      } else {
        window.history.pushState({}, "", path);
        this.handleLocationChange();
      }
    } else {
      this.currentPath = path;
    }

    if (syncRegister) {
      const routeId = this.pathToRouteId.get(path);
      if (routeId !== undefined) {
        this.engine.store.write(this.options.routeRegister, routeId, "router");
      }
    }
  }

  getCurrentPath(): string {
    if (typeof window === "undefined") return "/";
    if (this.options.mode === "hash") {
      const hash = window.location.hash.slice(1);
      return hash.startsWith("/") ? hash : `/${hash}`;
    }
    return window.location.pathname || "/";
  }

  private async handleLocationChange(): Promise<void> {
    const path = this.getCurrentPath();
    this.currentPath = path;

    const route = this.routes.get(path) || this.routes.get("*") || this.routes.get("/");
    if (!route) {
      console.warn(`[TitanRouter] No route match for '${path}'`);
      return;
    }

    if (route.title && typeof document !== "undefined") {
      document.title = route.title;
    }

    // Update active class on all matching [tb-link] elements
    if (typeof document !== "undefined") {
      const links = document.querySelectorAll<HTMLElement>("[tb-link]");
      links.forEach((link) => {
        const linkPath = link.getAttribute("tb-link");
        link.classList.toggle("active", linkPath === path);
      });
    }

    // Mount route view into outlet
    await this.renderView(route);
  }

  private async renderView(route: RouteDefinition): Promise<void> {
    if (typeof document === "undefined") return;

    const outlet = document.querySelector<HTMLElement>(this.options.viewSelector);
    if (!outlet) {
      console.warn(`[TitanRouter] View outlet '${this.options.viewSelector}' not found in DOM.`);
      return;
    }

    if (route.template) {
      outlet.innerHTML = route.template;
      this.engine.scanAndBind(outlet);
      await this.componentManager.scanAndHydrate(outlet);
    } else if (route.component) {
      await this.componentManager.mount(outlet, route.component);
    }
  }
}
