/**
 * 🐬 TITAN-DOM CORE ENGINE (TypeScript)
 * Universal Zero-VDOM Surgical Reactive Engine for Titan Bus (0x5442)
 */

import {
  RegisterId,
  RegisterValue,
  ITitanRegisterStore,
  RegisterListener,
  ActionContext,
  ActionHandler,
  TitanDOMOptions
} from "./types";
import {
  TitanErrorManager,
  ErrorModule,
  ErrorSeverity,
  ERROR_REGISTERS
} from "./error";

const EVENT_TYPES: string[] = [
  "click", "dblclick", "input", "change", "submit", "reset",
  "keydown", "keyup", "mouseenter", "mouseleave", "mousemove",
  "scroll", "touchstart", "touchmove", "touchend", "focus", "blur"
];

export class TitanRegisterStore implements ITitanRegisterStore {
  readonly size: number;
  private registers: Map<RegisterId, RegisterValue> = new Map();
  private listeners: Map<RegisterId, Set<RegisterListener>> = new Map();

  constructor(size: number = 65536) {
    this.size = size;
  }

  private normalizeReg(reg: RegisterId): RegisterId {
    const n = Number(reg);
    return !isNaN(n) && typeof reg !== "boolean" && String(reg).trim() !== "" ? n : String(reg);
  }

  write(reg: RegisterId, value: RegisterValue, source: any = "dom"): void {
    reg = this.normalizeReg(reg);
    const prev = this.registers.get(reg);
    if (prev === value) return;

    this.registers.set(reg, value);
    this.notify(reg, value, source);
  }

  read(reg: RegisterId, defaultValue: RegisterValue = 0): RegisterValue {
    reg = this.normalizeReg(reg);
    return this.registers.has(reg) ? this.registers.get(reg) : defaultValue;
  }

  readNumber(reg: RegisterId, defaultValue: number = 0): number {
    const val = this.read(reg, defaultValue);
    const num = Number(val);
    return isNaN(num) ? defaultValue : num;
  }

  readString(reg: RegisterId, defaultValue: string = ""): string {
    const val = this.read(reg, defaultValue);
    return val !== null && val !== undefined ? String(val) : defaultValue;
  }

  readBool(reg: RegisterId, defaultValue: boolean = false): boolean {
    const val = this.read(reg, defaultValue);
    return Boolean(val);
  }

  toggle(reg: RegisterId): number {
    reg = this.normalizeReg(reg);
    const current = this.read(reg, 0);
    const next = current ? 0 : 1;
    this.write(reg, next);
    return next;
  }

  increment(reg: RegisterId, step: number = 1): number {
    reg = this.normalizeReg(reg);
    const next = this.readNumber(reg, 0) + Number(step);
    this.write(reg, next);
    return next;
  }

  decrement(reg: RegisterId, step: number = 1): number {
    return this.increment(reg, -Number(step));
  }

  writeBatch(mapObject: Record<string | number, RegisterValue>): void {
    for (const [k, v] of Object.entries(mapObject)) {
      this.write(this.normalizeReg(k), v);
    }
  }

  readBatch(regArray: RegisterId[]): Record<string | number, RegisterValue> {
    const res: Record<string | number, RegisterValue> = {};
    for (const r of regArray) {
      res[r] = this.read(r);
    }
    return res;
  }

  on(reg: RegisterId, callback: RegisterListener): () => void {
    reg = this.normalizeReg(reg);
    if (!this.listeners.has(reg)) {
      this.listeners.set(reg, new Set());
    }
    this.listeners.get(reg)!.add(callback);
    return () => this.off(reg, callback);
  }

  off(reg: RegisterId, callback: RegisterListener): void {
    reg = this.normalizeReg(reg);
    const set = this.listeners.get(reg);
    if (set) {
      set.delete(callback);
    }
  }

  private notify(reg: RegisterId, value: RegisterValue, source: any): void {
    const set = this.listeners.get(reg);
    if (set) {
      for (const cb of set) {
        cb(value, reg, source);
      }
    }
    // Wildcard listeners (-1)
    const wild = this.listeners.get(-1);
    if (wild) {
      for (const cb of wild) {
        cb(value, reg, source);
      }
    }
  }
}

export class TitanDOMEngine {
  readonly store: ITitanRegisterStore;
  public readonly errors: TitanErrorManager;
  private actions: Map<string, ActionHandler> = new Map();
  private throttles: Map<any, number> = new Map();
  private debounces: Map<any, any> = new Map();
  public root: Document | HTMLElement | null = null;
  public initialized: boolean = false;

  constructor(options: TitanDOMOptions = {}) {
    this.store = options.store || new TitanRegisterStore();
    this.errors = new TitanErrorManager(this.store);
    if (options.root) {
      this.init(options.root);
    }
  }

  registerAction(name: string, handler: ActionHandler): this {
    this.actions.set(name, handler);
    return this;
  }

  init(root: Document | HTMLElement | null = typeof document !== "undefined" ? document : null): this {
    if (!root) return this;
    this.root = root;
    this.errors.installGlobalTraps();
    this.initGlobalDelegator(root);
    this.scanAndBind(root);
    this.setupMutationObserver(root);
    this.initialized = true;
    return this;
  }

  private setupMutationObserver(root: Document | HTMLElement): void {
    if (typeof MutationObserver === "undefined") return;

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element Node
              this.scanAndBind(node as HTMLElement);
            }
          });
        }
      }
    });

    const targetNode = (root as any).body || root;
    if (targetNode && targetNode.nodeType === 1) {
      observer.observe(targetNode, { childList: true, subtree: true });
    }
  }

  scanAndBind(container: Document | HTMLElement | null = this.root): void {
    if (!container || !container.querySelectorAll) return;

    // 1. Initial Two-Way Bindings (tb-bind)
    const boundElements = container.querySelectorAll<HTMLElement>("[tb-bind]");
    boundElements.forEach((el) => {
      const regAttr = el.getAttribute("tb-bind");
      if (!regAttr) return;
      const reg = !isNaN(Number(regAttr)) ? Number(regAttr) : regAttr;

      const currentVal = this.store.read(reg, null);
      if (currentVal !== null) {
        this.updateElementValue(el as HTMLInputElement, currentVal);
      } else {
        const domVal = this.getElementValue(el as HTMLInputElement);
        if (domVal !== "" && domVal !== undefined) {
          this.store.write(reg, domVal, "initial_dom");
        }
      }

      this.store.on(reg, (val, _r, src) => {
        if (src !== el) {
          this.updateElementValue(el as HTMLInputElement, val);
        }
      });
    });

    // 2. Reactive Text Watchers (tb-text)
    const textElements = container.querySelectorAll<HTMLElement>("[tb-text]");
    textElements.forEach((el) => {
      const expr = el.getAttribute("tb-text") || "";
      const parts = expr.split(".");
      const rawReg = parts[0];
      const reg = !isNaN(Number(rawReg)) ? Number(rawReg) : rawReg;
      const propPath = parts.slice(1);

      const renderText = (val: any) => {
        if (propPath.length > 0 && val && typeof val === "object") {
          let resolved = val;
          for (const p of propPath) {
            resolved = resolved?.[p];
          }
          el.textContent = resolved !== null && resolved !== undefined ? String(resolved) : "";
        } else if (typeof val === "object" && val !== null) {
          el.textContent = Array.isArray(val) ? String(val.length) : JSON.stringify(val);
        } else {
          el.textContent = val !== null && val !== undefined ? String(val) : "";
        }
      };

      renderText(this.store.read(reg, ""));
      this.store.on(reg, renderText);
    });

    // 3. Reactive HTML Watchers (tb-html)
    const htmlElements = container.querySelectorAll<HTMLElement>("[tb-html]");
    htmlElements.forEach((el) => {
      const regAttr = el.getAttribute("tb-html");
      if (!regAttr) return;
      const reg = !isNaN(Number(regAttr)) ? Number(regAttr) : regAttr;
      el.innerHTML = this.store.readString(reg, "");
      this.store.on(reg, (val) => {
        el.innerHTML = val !== null && val !== undefined ? String(val) : "";
      });
    });

    // 4. Reactive Visibility Directives (tb-show / tb-hide)
    const showElements = container.querySelectorAll<HTMLElement>("[tb-show]");
    showElements.forEach((el) => {
      const regAttr = el.getAttribute("tb-show");
      if (!regAttr) return;
      const reg = !isNaN(Number(regAttr)) ? Number(regAttr) : regAttr;
      const orig = (el.style.display === "none" || !el.style.display) ? "" : el.style.display;
      const update = (val: any) => {
        el.style.display = Boolean(val) ? orig : "none";
      };
      update(this.store.read(reg, 0));
      this.store.on(reg, update);
    });

    const hideElements = container.querySelectorAll<HTMLElement>("[tb-hide]");
    hideElements.forEach((el) => {
      const regAttr = el.getAttribute("tb-hide");
      if (!regAttr) return;
      const reg = !isNaN(Number(regAttr)) ? Number(regAttr) : regAttr;
      const orig = (el.style.display === "none" || !el.style.display) ? "" : el.style.display;
      const update = (val: any) => {
        el.style.display = Boolean(val) ? "none" : orig;
      };
      update(this.store.read(reg, 0));
      this.store.on(reg, update);
    });

    // 5. Reactive Auto-Fetch Directives (tb-fetch="url:reg")
    const fetchElements = container.querySelectorAll<HTMLElement>("[tb-fetch]");
    fetchElements.forEach((el) => {
      const attr = el.getAttribute("tb-fetch");
      if (!attr) return;
      const parts = attr.includes("->") ? attr.split("->").map(s => s.trim()) : attr.split(":");
      const regStr = parts.pop()!;
      const url = parts.join(":");
      const reg = Number(regStr);
      if (!isNaN(reg) && url) {
        this.fetchData(url, reg);
      }
    });

    // 6. Reactive List Directives (tb-for="item in reg")
    const forElements = container.querySelectorAll<HTMLElement>("[tb-for]");
    forElements.forEach((el) => {
      const expr = el.getAttribute("tb-for");
      if (!expr) return;
      this.bindFor(el, expr);
    });

    // 7. Dynamic Class, Style, and Attribute Directives
    const allNodes = container.querySelectorAll<HTMLElement>("*");
    allNodes.forEach((el) => {
      for (const attr of Array.from(el.attributes || [])) {
        if (attr.name.startsWith("tb-class:")) {
          const className = attr.name.substring(9);
          const reg = Number(attr.value);
          const apply = Boolean(this.store.read(reg, 0));
          el.classList.toggle(className, apply);

          this.store.on(reg, (val) => {
            el.classList.toggle(className, Boolean(val));
          });
        } else if (attr.name.startsWith("tb-style:")) {
          const styleProp = attr.name.substring(9);
          const template = attr.value;
          this.bindStyle(el, styleProp, template);
        } else if (attr.name.startsWith("tb-attr:")) {
          const attrName = attr.name.substring(8);
          const reg = Number(attr.value);
          this.bindAttribute(el, attrName, reg);
        } else if (attr.name.startsWith("tb-on:")) {
          // 🚀 Dynamic Universal Event Auto-Registration
          const rawEvent = attr.name.substring(6);
          const eventType = rawEvent.split(".")[0];
          if (eventType) {
            this.ensureEventDelegator(eventType);
          }
        }
      }
    });
  }

  private bindStyle(el: HTMLElement, styleProp: string, template: string): void {
    const regMatches = template.match(/\{?(\d+)\}?/g);
    if (!regMatches) return;

    const updateStyle = () => {
      let finalVal = template;
      for (const match of regMatches) {
        const cleanReg = Number(match.replace(/[\{\}]/g, ""));
        const regVal = this.store.readString(cleanReg, "0");
        finalVal = finalVal.replace(match, regVal);
      }
      (el.style as any)[styleProp] = finalVal;
    };

    updateStyle();

    for (const match of regMatches) {
      const cleanReg = Number(match.replace(/[\{\}]/g, ""));
      this.store.on(cleanReg, updateStyle);
    }
  }

  private bindAttribute(el: HTMLElement, attrName: string, reg: RegisterId): void {
    const updateAttr = (val: RegisterValue) => {
      if (attrName === "disabled" || attrName === "readonly" || attrName === "hidden") {
        if (Boolean(val)) {
          el.setAttribute(attrName, "");
        } else {
          el.removeAttribute(attrName);
        }
      } else {
        el.setAttribute(attrName, String(val ?? ""));
      }
    };
    updateAttr(this.store.read(reg, 0));
    this.store.on(reg, updateAttr);
  }

  async fetchData(url: string, targetReg: RegisterId): Promise<any> {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const contentType = res.headers.get("content-type") || "";
      let data: any;
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        try {
          data = JSON.parse(text);
        } catch (_) {
          data = text;
        }
      }
      this.store.write(targetReg, data, "fetch");
      return data;
    } catch (err: any) {
      this.errors.report({
        module: ErrorModule.NETWORK,
        code: 400,
        severity: ErrorSeverity.CRITICAL,
        message: `Fetch error for ${url}: ${err.message || err}`,
        details: err
      });
      throw err;
    }
  }

  private bindFor(el: HTMLElement, expr: string): void {
    // Matches: "item in 5000", "item in products", "(item, index) in 5000", or just "5000"
    const match = expr.match(/^(?:(?:\(([^,]+),?\s*([^)]*)\)|([a-zA-Z0-9_$]+))\s+in\s+)?([a-zA-Z0-9_$-]+)$/);
    if (!match) return;

    const itemVar = (match[1] || match[3] || "item").trim();
    const indexVar = (match[2] || "index").trim();
    const reg = !isNaN(Number(match[4])) ? Number(match[4]) : match[4];

    const parent = el.parentElement;
    if (!parent) return;

    const anchor = (typeof document !== "undefined" && document.createComment)
      ? document.createComment(`tb-for:${expr}`)
      : null;
    if (anchor) {
      parent.insertBefore(anchor, el);
    }

    let templateHTML = "";
    if (el.tagName && el.tagName.toLowerCase() === "template") {
      templateHTML = (el as HTMLTemplateElement).innerHTML;
      el.remove();
    } else {
      const clone = el.cloneNode(true) as HTMLElement;
      clone.removeAttribute("tb-for");
      templateHTML = clone.outerHTML;
      el.remove();
    }

    let renderedNodes: Node[] = [];

    const renderList = (data: any) => {
      // Clean up previously rendered nodes
      for (const node of renderedNodes) {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      }
      renderedNodes = [];

      if (!data) return;

      let items: any[] = [];
      if (Array.isArray(data)) {
        items = data;
      } else if (data && typeof data === "object" && Array.isArray((data as any).products)) {
        items = (data as any).products;
      } else if (data && typeof data === "object" && Array.isArray((data as any).data)) {
        items = (data as any).data;
      } else if (data && typeof data === "object" && Array.isArray((data as any).items)) {
        items = (data as any).items;
      } else if (typeof data === "number") {
        items = Array.from({ length: data }, (_, i) => i + 1);
      } else if (typeof data === "object" && data !== null) {
        items = Object.entries(data).map(([key, val]) => ({ key, val }));
      }

      if (typeof document === "undefined") return;

      const fragment = document.createDocumentFragment();
      const tempDiv = document.createElement("div");

      items.forEach((item, idx) => {
        let itemHtml = templateHTML;

        // 1. Interpolate nested properties: {{item.prop}}
        if (typeof item === "object" && item !== null) {
          itemHtml = itemHtml.replace(new RegExp(`{{\\s*${itemVar}\\.([a-zA-Z0-9_$.]+)\\s*}}`, "g"), (_, prop) => {
            const val = prop.split(".").reduce((acc: any, p: string) => acc?.[p], item);
            return val !== undefined && val !== null ? String(val) : "";
          });
        }

        // 2. Interpolate item itself: {{item}}
        const itemValStr = typeof item === "object" && item !== null ? JSON.stringify(item) : String(item);
        itemHtml = itemHtml.replace(new RegExp(`{{\\s*${itemVar}\\s*}}`, "g"), itemValStr);

        // 3. Interpolate index: {{index}}
        itemHtml = itemHtml.replace(new RegExp(`{{\\s*${indexVar}\\s*}}`, "g"), String(idx));

        tempDiv.innerHTML = itemHtml.trim();
        while (tempDiv.firstChild) {
          const child = tempDiv.firstChild;
          renderedNodes.push(child);
          fragment.appendChild(child);
        }
      });

      if (anchor && anchor.parentNode) {
        anchor.parentNode.insertBefore(fragment, anchor.nextSibling);
      } else if (parent) {
        parent.appendChild(fragment);
      }

      // Re-hydrate directives on newly created elements
      for (const node of renderedNodes) {
        if (node.nodeType === 1) {
          this.scanAndBind(node as HTMLElement);
        }
      }
    };

    renderList(this.store.read(reg, []));
    this.store.on(reg, (val) => renderList(val));
  }

  private registeredEvents: Set<string> = new Set();

  private ensureEventDelegator(eventType: string): void {
    if (this.registeredEvents.has(eventType) || !this.root) return;
    this.registeredEvents.add(eventType);

    const isPassive = ["scroll", "touchmove", "mousemove", "wheel"].includes(eventType);
    const targetRoot = (["resize", "online", "offline"].includes(eventType) && typeof window !== "undefined")
      ? window
      : this.root;

    targetRoot.addEventListener(
      eventType,
      (e: Event) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;

        // 1. Two-way binding trigger
        if (target.hasAttribute && target.hasAttribute("tb-bind")) {
          if (eventType === "input" || eventType === "change") {
            const reg = Number(target.getAttribute("tb-bind"));
            const val = this.getElementValue(target as HTMLInputElement);
            this.store.write(reg, val, target);
          }
        }

        // 2. Directives matching: tb-on:<event> or tb-on:<event>.<modifier>
        let actionEl: HTMLElement | null = null;
        let current: HTMLElement | null = target;
        while (current && current !== this.root && (current as any) !== document) {
          if (current.attributes) {
            const hasAttr = Array.from(current.attributes).some(a =>
              a.name === `tb-on:${eventType}` || a.name.startsWith(`tb-on:${eventType}.`)
            );
            if (hasAttr) {
              actionEl = current;
              break;
            }
          }
          current = current.parentElement;
        }

        if (!actionEl) return;

        const matchedAttr = Array.from(actionEl.attributes).find(
          a => a.name === `tb-on:${eventType}` || a.name.startsWith(`tb-on:${eventType}.`)
        );
        if (!matchedAttr) return;

        const attrName = matchedAttr.name;
        const attrVal = matchedAttr.value;

        // Keyboard modifier checks: e.g. tb-on:keydown.enter, tb-on:keydown.ctrl.s
        if (eventType === "keydown" || eventType === "keyup") {
          const keyEvent = e as KeyboardEvent;
          const modifiers = attrName.split(".").slice(1);
          for (const mod of modifiers) {
            const m = mod.toLowerCase();
            if (m === "prevent" || m === "stop" || m.startsWith("debounce") || m.startsWith("throttle")) continue;

            if (m === "ctrl" && !keyEvent.ctrlKey) return;
            if (m === "shift" && !keyEvent.shiftKey) return;
            if (m === "alt" && !keyEvent.altKey) return;
            if (m === "meta" && !keyEvent.metaKey) return;

            if (m === "enter" && keyEvent.key.toLowerCase() !== "enter") return;
            if ((m === "esc" || m === "escape") && keyEvent.key.toLowerCase() !== "escape") return;
            if (m === "space" && keyEvent.code !== "Space" && keyEvent.key !== " ") return;
            if (m === "tab" && keyEvent.key.toLowerCase() !== "tab") return;
            if (m === "arrowup" && keyEvent.key !== "ArrowUp") return;
            if (m === "arrowdown" && keyEvent.key !== "ArrowDown") return;
            if (m === "arrowleft" && keyEvent.key !== "ArrowLeft") return;
            if (m === "arrowright" && keyEvent.key !== "ArrowRight") return;

            // Direct key match (e.g. .s, .a, .k)
            if (m.length === 1 && keyEvent.key.toLowerCase() !== m) return;
          }
        }

        // Modifiers: preventDefault & stopPropagation
        if (attrName.includes(".prevent")) e.preventDefault();
        if (attrName.includes(".stop")) e.stopPropagation();

        // Throttle: .throttle(ms)
        const throttleMatch = attrName.match(/\.throttle\((\d+)\)/);
        if (throttleMatch) {
          const ms = Number(throttleMatch[1]);
          const key = actionEl;
          const now = Date.now();
          const last = this.throttles.get(key) || 0;
          if (now - last < ms) return;
          this.throttles.set(key, now);
        }

        // Debounce: .debounce(ms)
        const debounceMatch = attrName.match(/\.debounce\((\d+)\)/);
        if (debounceMatch) {
          const ms = Number(debounceMatch[1]);
          const key = actionEl;
          if (this.debounces.has(key)) clearTimeout(this.debounces.get(key));
          this.debounces.set(key, setTimeout(() => {
            this.executeDirective(attrVal, e, actionEl!);
            this.debounces.delete(key);
          }, ms));
          return;
        }

        this.executeDirective(attrVal, e, actionEl);
      },
      { passive: isPassive }
    );
  }

  private initGlobalDelegator(root: Document | HTMLElement): void {
    // Register base foundational events immediately
    const BASE_EVENTS = [
      "click", "dblclick", "input", "change", "submit", "reset",
      "keydown", "keyup", "mouseenter", "mouseleave", "mousemove",
      "scroll", "touchstart", "touchmove", "touchend", "focus", "blur",
      "wheel", "contextmenu", "pointerdown", "pointerup", "pointermove"
    ];
    BASE_EVENTS.forEach(ev => this.ensureEventDelegator(ev));
  }

  executeDirective(directiveStr: string, event: Event, el: HTMLElement): void {
    if (!directiveStr) return;

    const statements = directiveStr.split(";").map(s => s.trim()).filter(Boolean);

    for (const stmt of statements) {
      const firstColon = stmt.indexOf(":");
      if (firstColon === -1) {
        if (stmt === "clear_error") {
          this.errors.clear();
        }
        continue;
      }

      const cmd = stmt.substring(0, firstColon).trim();
      const rest = stmt.substring(firstColon + 1).trim();

      if (cmd === "write" || cmd === "set") {
        const secondColon = rest.indexOf(":");
        if (secondColon !== -1) {
          const reg = Number(rest.substring(0, secondColon).trim());
          let valStr = rest.substring(secondColon + 1).trim();
          let val: any = valStr;
          if (val === "true") val = 1;
          else if (val === "false") val = 0;
          else if (!isNaN(Number(val)) && val !== "") val = Number(val);
          else if ((valStr.startsWith("{") && valStr.endsWith("}")) || (valStr.startsWith("[") && valStr.endsWith("]"))) {
            try { val = JSON.parse(valStr); } catch (_) {}
          }
          this.store.write(reg, val, el);
        }
      } else if (cmd === "toggle") {
        const reg = Number(rest);
        this.store.toggle(reg);
      } else if (cmd === "increment") {
        const p = rest.split(":");
        const reg = Number(p[0]);
        const step = p[1] !== undefined ? Number(p[1]) : 1;
        this.store.increment(reg, step);
      } else if (cmd === "decrement") {
        const p = rest.split(":");
        const reg = Number(p[0]);
        const step = p[1] !== undefined ? Number(p[1]) : 1;
        this.store.decrement(reg, step);
      } else if (cmd === "fetch") {
        const lastColon = rest.lastIndexOf(":");
        if (lastColon !== -1) {
          const url = rest.substring(0, lastColon).trim();
          const reg = Number(rest.substring(lastColon + 1).trim());
          if (!isNaN(reg) && url) {
            this.fetchData(url, reg);
          }
        }
      } else if (cmd === "clear_error") {
        this.errors.clear();
      } else if (cmd === "error") {
        const errParts = rest.split(":");
        let msg = rest;
        let code = 500, mod = ErrorModule.CORE, sev = ErrorSeverity.CRITICAL;
        if (errParts.length >= 4 && !isNaN(Number(errParts[errParts.length - 1]))) {
          sev = Number(errParts.pop());
          mod = Number(errParts.pop());
          code = Number(errParts.pop());
          msg = errParts.join(":");
        } else if (errParts.length >= 2 && !isNaN(Number(errParts[errParts.length - 1]))) {
          code = Number(errParts.pop());
          msg = errParts.join(":");
        }
        this.errors.report({ module: mod, code, severity: sev, message: msg });
      } else if (cmd === "coords") {
        const p = rest.split(":");
        const regX = Number(p[0]);
        const regY = Number(p[1]);
        const anyEv = event as any;
        const x = anyEv.clientX ?? (anyEv.touches?.[0]?.clientX || 0);
        const y = anyEv.clientY ?? (anyEv.touches?.[0]?.clientY || 0);
        this.store.write(regX, Math.round(x), el);
        this.store.write(regY, Math.round(y), el);
      } else if (cmd === "delta") {
        const reg = Number(rest);
        const delta = (event as WheelEvent).deltaY || 0;
        this.store.write(reg, delta, el);
      } else if (cmd === "key") {
        const reg = Number(rest);
        this.store.write(reg, (event as KeyboardEvent).key, el);
      } else if (cmd === "val") {
        const reg = Number(rest);
        this.store.write(reg, (event.target as any)?.value, el);
      } else if (cmd === "action") {
        const p = rest.split(":");
        const actionName = p[0];
        const handler = this.actions.get(actionName);
        if (handler) {
          try {
            const res = handler({ event, element: el, store: this.store, params: p.slice(1) });
            if (res && typeof (res as any).catch === "function") {
              (res as any).catch((err: any) => {
                this.errors.report({
                  module: ErrorModule.USER_ACTION,
                  code: 500,
                  severity: ErrorSeverity.CRITICAL,
                  message: err?.message || String(err),
                  details: err
                });
              });
            }
          } catch (err: any) {
            this.errors.report({
              module: ErrorModule.USER_ACTION,
              code: 500,
              severity: ErrorSeverity.CRITICAL,
              message: err?.message || String(err),
              details: err
            });
          }
        }
      }
    }
  }

  getElementValue(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): any {
    if ((el as HTMLInputElement).type === "checkbox") {
      return (el as HTMLInputElement).checked ? 1 : 0;
    }
    if ((el as HTMLInputElement).type === "radio") {
      return (el as HTMLInputElement).checked ? el.value : null;
    }
    if ((el as HTMLInputElement).type === "number" || (el as HTMLInputElement).type === "range") {
      return el.value === "" ? 0 : Number(el.value);
    }
    return el.value;
  }

  updateElementValue(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, val: RegisterValue): void {
    if ((el as HTMLInputElement).type === "checkbox") {
      (el as HTMLInputElement).checked = Boolean(val);
    } else if ((el as HTMLInputElement).type === "radio") {
      (el as HTMLInputElement).checked = el.value === String(val);
    } else {
      if (el.value !== String(val ?? "")) {
        el.value = val !== null && val !== undefined ? String(val) : "";
      }
    }
  }

  getFormData(formSelectorOrElement: string | HTMLElement): Record<string, RegisterValue> {
    const form = typeof formSelectorOrElement === "string"
      ? (this.root ? (this.root as HTMLElement).querySelector(formSelectorOrElement) : null)
      : formSelectorOrElement;
    if (!form) return {};

    const boundEls = form.querySelectorAll<HTMLElement>("[tb-bind]");
    const data: Record<string, RegisterValue> = {};
    boundEls.forEach((el) => {
      const reg = el.getAttribute("tb-bind");
      if (!reg) return;
      const name = el.getAttribute("name") || `reg_${reg}`;
      data[name] = this.store.read(Number(reg));
    });
    return data;
  }
}
