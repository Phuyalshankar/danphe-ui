/**
 * 🐬 TITAN-DOM COMPONENT MANAGER (TypeScript)
 * Declarative, File-to-File Component Architecture for Titan Bus.
 * 
 * Far simpler than React:
 * - No JSX / Babel / Webpack compilation required.
 * - Works with standard .html component files or templates.
 * - Props passed via standard HTML attributes.
 * - Auto-hydrates and connects to Titan Bus register store.
 */

import { ComponentDefinition } from "./types";
import { TitanDOMEngine } from "./core";

declare const require: any;

export class TitanComponentManager {
  private components: Map<string, ComponentDefinition> = new Map();
  private engine: TitanDOMEngine;

  constructor(engine: TitanDOMEngine) {
    this.engine = engine;
  }

  define(def: ComponentDefinition): this {
    this.components.set(def.name, def);
    return this;
  }

  async loadFile(name: string, filePath: string, setup?: ComponentDefinition["setup"]): Promise<this> {
    try {
      let template = "";
      if (typeof fetch !== "undefined") {
        const res = await fetch(filePath);
        if (!res.ok) throw new Error(`HTTP error ${res.status} fetching component ${filePath}`);
        template = await res.text();
      } else if (typeof require !== "undefined") {
        // Node / Electron environment
        const fs = require("fs");
        template = fs.readFileSync(filePath, "utf-8");
      }

      this.components.set(name, {
        name,
        template,
        file: filePath,
        setup
      });
    } catch (err) {
      console.error(`[TitanComponent] Failed to load component '${name}' from '${filePath}':`, err);
    }
    return this;
  }

  async mount(container: HTMLElement, name: string, props: Record<string, any> = {}): Promise<void> {
    let def = this.components.get(name);
    if (!def && name.endsWith(".html")) {
      // Dynamic on-demand file loading
      await this.loadFile(name, name);
      def = this.components.get(name);
    }

    if (!def || !def.template) {
      console.warn(`[TitanComponent] Component '${name}' not found or empty.`);
      return;
    }

    // Interpolate prop placeholders in template: e.g. {{title}} or {title}
    let html = def.template;
    for (const [k, v] of Object.entries(props)) {
      html = html.replace(new RegExp(`\\{\\{${k}\\}\\}|\\{${k}\\}`, "g"), String(v));
    }

    container.innerHTML = html;

    // Run component setup hook if present
    if (def.setup) {
      def.setup(props, { store: this.engine.store, el: container });
    }

    // Surgically bind all Titan DOM reactive directives inside the newly mounted component
    this.engine.scanAndBind(container);

    // Recursively scan for nested sub-components
    await this.scanAndHydrate(container);
  }

  async scanAndHydrate(root: Document | HTMLElement = this.engine.root || document): Promise<void> {
    const targets = root.querySelectorAll<HTMLElement>("[tb-component]");
    for (const el of Array.from(targets)) {
      const compName = el.getAttribute("tb-component");
      if (!compName) continue;

      // Extract all other attributes as props
      const props: Record<string, any> = {};
      for (const attr of Array.from(el.attributes)) {
        if (attr.name !== "tb-component") {
          props[attr.name] = attr.value;
        }
      }

      // Remove tb-component attribute to prevent infinite re-hydration
      el.removeAttribute("tb-component");
      el.setAttribute("tb-mounted", compName);

      await this.mount(el, compName, props);
    }
  }
}
