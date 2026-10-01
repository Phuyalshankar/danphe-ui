/**
 * 🐬 TITAN-DOM (Universal Browser Bundle)
 * Zero-VDOM Surgical Reactive Engine, Components & Router for Titan Bus
 * Author: Phuyalshankar
 * License: MIT
 */
(function(global) {
  var exports = {};
  var module = { exports: exports };

/* ─── types.js ─── */

/**
 * 🐬 TITAN-DOM TYPESCRIPT DEFINITIONS
 * Strongly Typed Contracts for Zero-VDOM Reactive DOM, Components, and Routing.
 */

//# sourceMappingURL=types.js.map
/* ─── error.js ─── */

/**
 * 🐬 TITAN-DOM ERROR MANAGER (TypeScript)
 * Universal Error Trap & Master Error Register Architecture (0x5442)
 *
 * Registers:
 * - 90: REG_ERROR_MASTER (1 = Active Error, 0 = Clear)
 * - 91: REG_ERROR_COUNT (Total error tally)
 * - 92: REG_ERROR_MODULE (1=Core, 2=Network, 3=Component, 4=Router, 5=Action, 6=Hardware)
 * - 93: REG_ERROR_CODE (Numeric code: 404, 500, 1001, etc.)
 * - 94: REG_ERROR_SEVERITY (1=Info, 2=Warn, 3=Critical, 4=Fatal)
 * - 99: REG_ERROR_JSON (Human-readable error message or JSON payload)
 */

exports.TitanErrorManager = exports.ErrorSeverity = exports.ErrorModule = exports.ERROR_REGISTERS = void 0;
exports.ERROR_REGISTERS = {
    MASTER: 90,
    COUNT: 91,
    MODULE: 92,
    CODE: 93,
    SEVERITY: 94,
    JSON: 99
};
var ErrorModule;
(function (ErrorModule) {
    ErrorModule[ErrorModule["CORE"] = 1] = "CORE";
    ErrorModule[ErrorModule["NETWORK"] = 2] = "NETWORK";
    ErrorModule[ErrorModule["COMPONENT"] = 3] = "COMPONENT";
    ErrorModule[ErrorModule["ROUTER"] = 4] = "ROUTER";
    ErrorModule[ErrorModule["USER_ACTION"] = 5] = "USER_ACTION";
    ErrorModule[ErrorModule["HARDWARE"] = 6] = "HARDWARE";
})(ErrorModule || (exports.ErrorModule = ErrorModule = {}));
var ErrorSeverity;
(function (ErrorSeverity) {
    ErrorSeverity[ErrorSeverity["INFO"] = 1] = "INFO";
    ErrorSeverity[ErrorSeverity["WARN"] = 2] = "WARN";
    ErrorSeverity[ErrorSeverity["CRITICAL"] = 3] = "CRITICAL";
    ErrorSeverity[ErrorSeverity["FATAL"] = 4] = "FATAL";
})(ErrorSeverity || (exports.ErrorSeverity = ErrorSeverity = {}));
class TitanErrorManager {
    store;
    errorCount = 0;
    trapsInstalled = false;
    constructor(store) {
        this.store = store;
    }
    report(info) {
        this.errorCount++;
        const severity = info.severity !== undefined ? info.severity : ErrorSeverity.CRITICAL;
        this.store.writeBatch({
            [exports.ERROR_REGISTERS.MASTER]: 1,
            [exports.ERROR_REGISTERS.COUNT]: this.errorCount,
            [exports.ERROR_REGISTERS.MODULE]: info.module,
            [exports.ERROR_REGISTERS.CODE]: info.code,
            [exports.ERROR_REGISTERS.SEVERITY]: severity,
            [exports.ERROR_REGISTERS.JSON]: info.message
        });
        console.error(`[TitanError] [Mod ${info.module} | Code ${info.code} | Sev ${severity}]: ${info.message}`, info.details || "");
    }
    clear() {
        this.store.write(exports.ERROR_REGISTERS.MASTER, 0);
    }
    installGlobalTraps() {
        if (this.trapsInstalled || typeof window === "undefined")
            return this;
        this.trapsInstalled = true;
        // 1. Uncaught Runtime Exceptions
        window.addEventListener("error", (event) => {
            this.report({
                module: ErrorModule.CORE,
                code: 1001,
                severity: ErrorSeverity.FATAL,
                message: event.message || "Uncaught script exception",
                details: { filename: event.filename, lineno: event.lineno, colno: event.colno, error: event.error }
            });
        });
        // 2. Unhandled Promise Rejections
        window.addEventListener("unhandledrejection", (event) => {
            const reason = event.reason;
            const msg = reason instanceof Error ? reason.message : String(reason || "Unhandled Promise rejection");
            this.report({
                module: ErrorModule.NETWORK,
                code: 1002,
                severity: ErrorSeverity.CRITICAL,
                message: msg,
                details: reason
            });
        });
        return this;
    }
}
exports.TitanErrorManager = TitanErrorManager;
//# sourceMappingURL=error.js.map
/* ─── core.js ─── */

/**
 * 🐬 TITAN-DOM CORE ENGINE (TypeScript)
 * Universal Zero-VDOM Surgical Reactive Engine for Titan Bus (0x5442)
 */

exports.TitanDOMEngine = exports.TitanRegisterStore = void 0;

const EVENT_TYPES = [
    "click", "dblclick", "input", "change", "submit", "reset",
    "keydown", "keyup", "mouseenter", "mouseleave", "mousemove",
    "scroll", "touchstart", "touchmove", "touchend", "focus", "blur"
];
class TitanRegisterStore {
    size;
    registers = new Map();
    listeners = new Map();
    constructor(size = 65536) {
        this.size = size;
    }
    normalizeReg(reg) {
        const n = Number(reg);
        return !isNaN(n) && typeof reg !== "boolean" && String(reg).trim() !== "" ? n : String(reg);
    }
    write(reg, value, source = "dom") {
        reg = this.normalizeReg(reg);
        const prev = this.registers.get(reg);
        if (prev === value)
            return;
        this.registers.set(reg, value);
        this.notify(reg, value, source);
    }
    read(reg, defaultValue = 0) {
        reg = this.normalizeReg(reg);
        return this.registers.has(reg) ? this.registers.get(reg) : defaultValue;
    }
    readNumber(reg, defaultValue = 0) {
        const val = this.read(reg, defaultValue);
        const num = Number(val);
        return isNaN(num) ? defaultValue : num;
    }
    readString(reg, defaultValue = "") {
        const val = this.read(reg, defaultValue);
        return val !== null && val !== undefined ? String(val) : defaultValue;
    }
    readBool(reg, defaultValue = false) {
        const val = this.read(reg, defaultValue);
        return Boolean(val);
    }
    toggle(reg) {
        reg = this.normalizeReg(reg);
        const current = this.read(reg, 0);
        const next = current ? 0 : 1;
        this.write(reg, next);
        return next;
    }
    increment(reg, step = 1) {
        reg = this.normalizeReg(reg);
        const next = this.readNumber(reg, 0) + Number(step);
        this.write(reg, next);
        return next;
    }
    decrement(reg, step = 1) {
        return this.increment(reg, -Number(step));
    }
    writeBatch(mapObject) {
        for (const [k, v] of Object.entries(mapObject)) {
            this.write(this.normalizeReg(k), v);
        }
    }
    readBatch(regArray) {
        const res = {};
        for (const r of regArray) {
            res[r] = this.read(r);
        }
        return res;
    }
    on(reg, callback) {
        reg = this.normalizeReg(reg);
        if (!this.listeners.has(reg)) {
            this.listeners.set(reg, new Set());
        }
        this.listeners.get(reg).add(callback);
        return () => this.off(reg, callback);
    }
    off(reg, callback) {
        reg = this.normalizeReg(reg);
        const set = this.listeners.get(reg);
        if (set) {
            set.delete(callback);
        }
    }
    notify(reg, value, source) {
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
exports.TitanRegisterStore = TitanRegisterStore;
class TitanDOMEngine {
    store;
    errors;
    actions = new Map();
    throttles = new Map();
    debounces = new Map();
    root = null;
    initialized = false;
    constructor(options = {}) {
        this.store = options.store || new TitanRegisterStore();
        this.errors = new error_1.TitanErrorManager(this.store);
        if (options.root) {
            this.init(options.root);
        }
    }
    registerAction(name, handler) {
        this.actions.set(name, handler);
        return this;
    }
    init(root = typeof document !== "undefined" ? document : null) {
        if (!root)
            return this;
        this.root = root;
        this.errors.installGlobalTraps();
        this.initGlobalDelegator(root);
        this.scanAndBind(root);
        this.setupMutationObserver(root);
        this.initialized = true;
        return this;
    }
    setupMutationObserver(root) {
        if (typeof MutationObserver === "undefined")
            return;
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === "childList") {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element Node
                            this.scanAndBind(node);
                        }
                    });
                }
            }
        });
        const targetNode = root.body || root;
        if (targetNode && targetNode.nodeType === 1) {
            observer.observe(targetNode, { childList: true, subtree: true });
        }
    }
    scanAndBind(container = this.root) {
        if (!container || !container.querySelectorAll)
            return;
        // 1. Initial Two-Way Bindings (tb-bind)
        const boundElements = container.querySelectorAll("[tb-bind]");
        boundElements.forEach((el) => {
            const regAttr = el.getAttribute("tb-bind");
            if (!regAttr)
                return;
            const reg = !isNaN(Number(regAttr)) ? Number(regAttr) : regAttr;
            const currentVal = this.store.read(reg, null);
            if (currentVal !== null) {
                this.updateElementValue(el, currentVal);
            }
            else {
                const domVal = this.getElementValue(el);
                if (domVal !== "" && domVal !== undefined) {
                    this.store.write(reg, domVal, "initial_dom");
                }
            }
            this.store.on(reg, (val, _r, src) => {
                if (src !== el) {
                    this.updateElementValue(el, val);
                }
            });
        });
        // 2. Reactive Text Watchers (tb-text)
        const textElements = container.querySelectorAll("[tb-text]");
        textElements.forEach((el) => {
            const expr = el.getAttribute("tb-text") || "";
            const parts = expr.split(".");
            const rawReg = parts[0];
            const reg = !isNaN(Number(rawReg)) ? Number(rawReg) : rawReg;
            const propPath = parts.slice(1);
            const renderText = (val) => {
                if (propPath.length > 0 && val && typeof val === "object") {
                    let resolved = val;
                    for (const p of propPath) {
                        resolved = resolved?.[p];
                    }
                    el.textContent = resolved !== null && resolved !== undefined ? String(resolved) : "";
                }
                else if (typeof val === "object" && val !== null) {
                    el.textContent = Array.isArray(val) ? String(val.length) : JSON.stringify(val);
                }
                else {
                    el.textContent = val !== null && val !== undefined ? String(val) : "";
                }
            };
            renderText(this.store.read(reg, ""));
            this.store.on(reg, renderText);
        });
        // 3. Reactive HTML Watchers (tb-html)
        const htmlElements = container.querySelectorAll("[tb-html]");
        htmlElements.forEach((el) => {
            const regAttr = el.getAttribute("tb-html");
            if (!regAttr)
                return;
            const reg = !isNaN(Number(regAttr)) ? Number(regAttr) : regAttr;
            el.innerHTML = this.store.readString(reg, "");
            this.store.on(reg, (val) => {
                el.innerHTML = val !== null && val !== undefined ? String(val) : "";
            });
        });
        // 4. Reactive Visibility Directives (tb-show / tb-hide)
        const showElements = container.querySelectorAll("[tb-show]");
        showElements.forEach((el) => {
            const regAttr = el.getAttribute("tb-show");
            if (!regAttr)
                return;
            const reg = !isNaN(Number(regAttr)) ? Number(regAttr) : regAttr;
            const orig = (el.style.display === "none" || !el.style.display) ? "" : el.style.display;
            const update = (val) => {
                el.style.display = Boolean(val) ? orig : "none";
            };
            update(this.store.read(reg, 0));
            this.store.on(reg, update);
        });
        const hideElements = container.querySelectorAll("[tb-hide]");
        hideElements.forEach((el) => {
            const regAttr = el.getAttribute("tb-hide");
            if (!regAttr)
                return;
            const reg = !isNaN(Number(regAttr)) ? Number(regAttr) : regAttr;
            const orig = (el.style.display === "none" || !el.style.display) ? "" : el.style.display;
            const update = (val) => {
                el.style.display = Boolean(val) ? "none" : orig;
            };
            update(this.store.read(reg, 0));
            this.store.on(reg, update);
        });
        // 5. Reactive Auto-Fetch Directives (tb-fetch="url:reg")
        const fetchElements = container.querySelectorAll("[tb-fetch]");
        fetchElements.forEach((el) => {
            const attr = el.getAttribute("tb-fetch");
            if (!attr)
                return;
            const parts = attr.includes("->") ? attr.split("->").map(s => s.trim()) : attr.split(":");
            const regStr = parts.pop();
            const url = parts.join(":");
            const reg = Number(regStr);
            if (!isNaN(reg) && url) {
                this.fetchData(url, reg);
            }
        });
        // 6. Reactive List Directives (tb-for="item in reg")
        const forElements = container.querySelectorAll("[tb-for]");
        forElements.forEach((el) => {
            const expr = el.getAttribute("tb-for");
            if (!expr)
                return;
            this.bindFor(el, expr);
        });
        // 7. Dynamic Class, Style, and Attribute Directives
        const allNodes = container.querySelectorAll("*");
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
                }
                else if (attr.name.startsWith("tb-style:")) {
                    const styleProp = attr.name.substring(9);
                    const template = attr.value;
                    this.bindStyle(el, styleProp, template);
                }
                else if (attr.name.startsWith("tb-attr:")) {
                    const attrName = attr.name.substring(8);
                    const reg = Number(attr.value);
                    this.bindAttribute(el, attrName, reg);
                }
                else if (attr.name.startsWith("tb-on:")) {
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
    bindStyle(el, styleProp, template) {
        const regMatches = template.match(/\{?(\d+)\}?/g);
        if (!regMatches)
            return;
        const updateStyle = () => {
            let finalVal = template;
            for (const match of regMatches) {
                const cleanReg = Number(match.replace(/[\{\}]/g, ""));
                const regVal = this.store.readString(cleanReg, "0");
                finalVal = finalVal.replace(match, regVal);
            }
            el.style[styleProp] = finalVal;
        };
        updateStyle();
        for (const match of regMatches) {
            const cleanReg = Number(match.replace(/[\{\}]/g, ""));
            this.store.on(cleanReg, updateStyle);
        }
    }
    bindAttribute(el, attrName, reg) {
        const updateAttr = (val) => {
            if (attrName === "disabled" || attrName === "readonly" || attrName === "hidden") {
                if (Boolean(val)) {
                    el.setAttribute(attrName, "");
                }
                else {
                    el.removeAttribute(attrName);
                }
            }
            else {
                el.setAttribute(attrName, String(val ?? ""));
            }
        };
        updateAttr(this.store.read(reg, 0));
        this.store.on(reg, updateAttr);
    }
    async fetchData(url, targetReg) {
        try {
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }
            const contentType = res.headers.get("content-type") || "";
            let data;
            if (contentType.includes("application/json")) {
                data = await res.json();
            }
            else {
                const text = await res.text();
                try {
                    data = JSON.parse(text);
                }
                catch (_) {
                    data = text;
                }
            }
            this.store.write(targetReg, data, "fetch");
            return data;
        }
        catch (err) {
            this.errors.report({
                module: error_1.ErrorModule.NETWORK,
                code: 400,
                severity: error_1.ErrorSeverity.CRITICAL,
                message: `Fetch error for ${url}: ${err.message || err}`,
                details: err
            });
            throw err;
        }
    }
    bindFor(el, expr) {
        // Matches: "item in 5000", "item in products", "(item, index) in 5000", or just "5000"
        const match = expr.match(/^(?:(?:\(([^,]+),?\s*([^)]*)\)|([a-zA-Z0-9_$]+))\s+in\s+)?([a-zA-Z0-9_$-]+)$/);
        if (!match)
            return;
        const itemVar = (match[1] || match[3] || "item").trim();
        const indexVar = (match[2] || "index").trim();
        const reg = !isNaN(Number(match[4])) ? Number(match[4]) : match[4];
        const parent = el.parentElement;
        if (!parent)
            return;
        const anchor = (typeof document !== "undefined" && document.createComment)
            ? document.createComment(`tb-for:${expr}`)
            : null;
        if (anchor) {
            parent.insertBefore(anchor, el);
        }
        let templateHTML = "";
        if (el.tagName && el.tagName.toLowerCase() === "template") {
            templateHTML = el.innerHTML;
            el.remove();
        }
        else {
            const clone = el.cloneNode(true);
            clone.removeAttribute("tb-for");
            templateHTML = clone.outerHTML;
            el.remove();
        }
        let renderedNodes = [];
        const renderList = (data) => {
            // Clean up previously rendered nodes
            for (const node of renderedNodes) {
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            }
            renderedNodes = [];
            if (!data)
                return;
            let items = [];
            if (Array.isArray(data)) {
                items = data;
            }
            else if (data && typeof data === "object" && Array.isArray(data.products)) {
                items = data.products;
            }
            else if (data && typeof data === "object" && Array.isArray(data.data)) {
                items = data.data;
            }
            else if (data && typeof data === "object" && Array.isArray(data.items)) {
                items = data.items;
            }
            else if (typeof data === "number") {
                items = Array.from({ length: data }, (_, i) => i + 1);
            }
            else if (typeof data === "object" && data !== null) {
                items = Object.entries(data).map(([key, val]) => ({ key, val }));
            }
            if (typeof document === "undefined")
                return;
            const fragment = document.createDocumentFragment();
            const tempDiv = document.createElement("div");
            items.forEach((item, idx) => {
                let itemHtml = templateHTML;
                // 1. Interpolate nested properties: {{item.prop}}
                if (typeof item === "object" && item !== null) {
                    itemHtml = itemHtml.replace(new RegExp(`{{\\s*${itemVar}\\.([a-zA-Z0-9_$.]+)\\s*}}`, "g"), (_, prop) => {
                        const val = prop.split(".").reduce((acc, p) => acc?.[p], item);
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
            }
            else if (parent) {
                parent.appendChild(fragment);
            }
            // Re-hydrate directives on newly created elements
            for (const node of renderedNodes) {
                if (node.nodeType === 1) {
                    this.scanAndBind(node);
                }
            }
        };
        renderList(this.store.read(reg, []));
        this.store.on(reg, (val) => renderList(val));
    }
    registeredEvents = new Set();
    ensureEventDelegator(eventType) {
        if (this.registeredEvents.has(eventType) || !this.root)
            return;
        this.registeredEvents.add(eventType);
        const isPassive = ["scroll", "touchmove", "mousemove", "wheel"].includes(eventType);
        const targetRoot = (["resize", "online", "offline"].includes(eventType) && typeof window !== "undefined")
            ? window
            : this.root;
        targetRoot.addEventListener(eventType, (e) => {
            const target = e.target;
            if (!target)
                return;
            // 1. Two-way binding trigger
            if (target.hasAttribute && target.hasAttribute("tb-bind")) {
                if (eventType === "input" || eventType === "change") {
                    const reg = Number(target.getAttribute("tb-bind"));
                    const val = this.getElementValue(target);
                    this.store.write(reg, val, target);
                }
            }
            // 2. Directives matching: tb-on:<event> or tb-on:<event>.<modifier>
            let actionEl = null;
            let current = target;
            while (current && current !== this.root && current !== document) {
                if (current.attributes) {
                    const hasAttr = Array.from(current.attributes).some(a => a.name === `tb-on:${eventType}` || a.name.startsWith(`tb-on:${eventType}.`));
                    if (hasAttr) {
                        actionEl = current;
                        break;
                    }
                }
                current = current.parentElement;
            }
            if (!actionEl)
                return;
            const matchedAttr = Array.from(actionEl.attributes).find(a => a.name === `tb-on:${eventType}` || a.name.startsWith(`tb-on:${eventType}.`));
            if (!matchedAttr)
                return;
            const attrName = matchedAttr.name;
            const attrVal = matchedAttr.value;
            // Keyboard modifier checks: e.g. tb-on:keydown.enter, tb-on:keydown.ctrl.s
            if (eventType === "keydown" || eventType === "keyup") {
                const keyEvent = e;
                const modifiers = attrName.split(".").slice(1);
                for (const mod of modifiers) {
                    const m = mod.toLowerCase();
                    if (m === "prevent" || m === "stop" || m.startsWith("debounce") || m.startsWith("throttle"))
                        continue;
                    if (m === "ctrl" && !keyEvent.ctrlKey)
                        return;
                    if (m === "shift" && !keyEvent.shiftKey)
                        return;
                    if (m === "alt" && !keyEvent.altKey)
                        return;
                    if (m === "meta" && !keyEvent.metaKey)
                        return;
                    if (m === "enter" && keyEvent.key.toLowerCase() !== "enter")
                        return;
                    if ((m === "esc" || m === "escape") && keyEvent.key.toLowerCase() !== "escape")
                        return;
                    if (m === "space" && keyEvent.code !== "Space" && keyEvent.key !== " ")
                        return;
                    if (m === "tab" && keyEvent.key.toLowerCase() !== "tab")
                        return;
                    if (m === "arrowup" && keyEvent.key !== "ArrowUp")
                        return;
                    if (m === "arrowdown" && keyEvent.key !== "ArrowDown")
                        return;
                    if (m === "arrowleft" && keyEvent.key !== "ArrowLeft")
                        return;
                    if (m === "arrowright" && keyEvent.key !== "ArrowRight")
                        return;
                    // Direct key match (e.g. .s, .a, .k)
                    if (m.length === 1 && keyEvent.key.toLowerCase() !== m)
                        return;
                }
            }
            // Modifiers: preventDefault & stopPropagation
            if (attrName.includes(".prevent"))
                e.preventDefault();
            if (attrName.includes(".stop"))
                e.stopPropagation();
            // Throttle: .throttle(ms)
            const throttleMatch = attrName.match(/\.throttle\((\d+)\)/);
            if (throttleMatch) {
                const ms = Number(throttleMatch[1]);
                const key = actionEl;
                const now = Date.now();
                const last = this.throttles.get(key) || 0;
                if (now - last < ms)
                    return;
                this.throttles.set(key, now);
            }
            // Debounce: .debounce(ms)
            const debounceMatch = attrName.match(/\.debounce\((\d+)\)/);
            if (debounceMatch) {
                const ms = Number(debounceMatch[1]);
                const key = actionEl;
                if (this.debounces.has(key))
                    clearTimeout(this.debounces.get(key));
                this.debounces.set(key, setTimeout(() => {
                    this.executeDirective(attrVal, e, actionEl);
                    this.debounces.delete(key);
                }, ms));
                return;
            }
            this.executeDirective(attrVal, e, actionEl);
        }, { passive: isPassive });
    }
    initGlobalDelegator(root) {
        // Register base foundational events immediately
        const BASE_EVENTS = [
            "click", "dblclick", "input", "change", "submit", "reset",
            "keydown", "keyup", "mouseenter", "mouseleave", "mousemove",
            "scroll", "touchstart", "touchmove", "touchend", "focus", "blur",
            "wheel", "contextmenu", "pointerdown", "pointerup", "pointermove"
        ];
        BASE_EVENTS.forEach(ev => this.ensureEventDelegator(ev));
    }
    executeDirective(directiveStr, event, el) {
        if (!directiveStr)
            return;
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
                    let val = valStr;
                    if (val === "true")
                        val = 1;
                    else if (val === "false")
                        val = 0;
                    else if (!isNaN(Number(val)) && val !== "")
                        val = Number(val);
                    else if ((valStr.startsWith("{") && valStr.endsWith("}")) || (valStr.startsWith("[") && valStr.endsWith("]"))) {
                        try {
                            val = JSON.parse(valStr);
                        }
                        catch (_) { }
                    }
                    this.store.write(reg, val, el);
                }
            }
            else if (cmd === "toggle") {
                const reg = Number(rest);
                this.store.toggle(reg);
            }
            else if (cmd === "increment") {
                const p = rest.split(":");
                const reg = Number(p[0]);
                const step = p[1] !== undefined ? Number(p[1]) : 1;
                this.store.increment(reg, step);
            }
            else if (cmd === "decrement") {
                const p = rest.split(":");
                const reg = Number(p[0]);
                const step = p[1] !== undefined ? Number(p[1]) : 1;
                this.store.decrement(reg, step);
            }
            else if (cmd === "fetch") {
                const lastColon = rest.lastIndexOf(":");
                if (lastColon !== -1) {
                    const url = rest.substring(0, lastColon).trim();
                    const reg = Number(rest.substring(lastColon + 1).trim());
                    if (!isNaN(reg) && url) {
                        this.fetchData(url, reg);
                    }
                }
            }
            else if (cmd === "clear_error") {
                this.errors.clear();
            }
            else if (cmd === "error") {
                const errParts = rest.split(":");
                let msg = rest;
                let code = 500, mod = error_1.ErrorModule.CORE, sev = error_1.ErrorSeverity.CRITICAL;
                if (errParts.length >= 4 && !isNaN(Number(errParts[errParts.length - 1]))) {
                    sev = Number(errParts.pop());
                    mod = Number(errParts.pop());
                    code = Number(errParts.pop());
                    msg = errParts.join(":");
                }
                else if (errParts.length >= 2 && !isNaN(Number(errParts[errParts.length - 1]))) {
                    code = Number(errParts.pop());
                    msg = errParts.join(":");
                }
                this.errors.report({ module: mod, code, severity: sev, message: msg });
            }
            else if (cmd === "coords") {
                const p = rest.split(":");
                const regX = Number(p[0]);
                const regY = Number(p[1]);
                const anyEv = event;
                const x = anyEv.clientX ?? (anyEv.touches?.[0]?.clientX || 0);
                const y = anyEv.clientY ?? (anyEv.touches?.[0]?.clientY || 0);
                this.store.write(regX, Math.round(x), el);
                this.store.write(regY, Math.round(y), el);
            }
            else if (cmd === "delta") {
                const reg = Number(rest);
                const delta = event.deltaY || 0;
                this.store.write(reg, delta, el);
            }
            else if (cmd === "key") {
                const reg = Number(rest);
                this.store.write(reg, event.key, el);
            }
            else if (cmd === "val") {
                const reg = Number(rest);
                this.store.write(reg, event.target?.value, el);
            }
            else if (cmd === "action") {
                const p = rest.split(":");
                const actionName = p[0];
                const handler = this.actions.get(actionName);
                if (handler) {
                    try {
                        const res = handler({ event, element: el, store: this.store, params: p.slice(1) });
                        if (res && typeof res.catch === "function") {
                            res.catch((err) => {
                                this.errors.report({
                                    module: error_1.ErrorModule.USER_ACTION,
                                    code: 500,
                                    severity: error_1.ErrorSeverity.CRITICAL,
                                    message: err?.message || String(err),
                                    details: err
                                });
                            });
                        }
                    }
                    catch (err) {
                        this.errors.report({
                            module: error_1.ErrorModule.USER_ACTION,
                            code: 500,
                            severity: error_1.ErrorSeverity.CRITICAL,
                            message: err?.message || String(err),
                            details: err
                        });
                    }
                }
            }
        }
    }
    getElementValue(el) {
        if (el.type === "checkbox") {
            return el.checked ? 1 : 0;
        }
        if (el.type === "radio") {
            return el.checked ? el.value : null;
        }
        if (el.type === "number" || el.type === "range") {
            return el.value === "" ? 0 : Number(el.value);
        }
        return el.value;
    }
    updateElementValue(el, val) {
        if (el.type === "checkbox") {
            el.checked = Boolean(val);
        }
        else if (el.type === "radio") {
            el.checked = el.value === String(val);
        }
        else {
            if (el.value !== String(val ?? "")) {
                el.value = val !== null && val !== undefined ? String(val) : "";
            }
        }
    }
    getFormData(formSelectorOrElement) {
        const form = typeof formSelectorOrElement === "string"
            ? (this.root ? this.root.querySelector(formSelectorOrElement) : null)
            : formSelectorOrElement;
        if (!form)
            return {};
        const boundEls = form.querySelectorAll("[tb-bind]");
        const data = {};
        boundEls.forEach((el) => {
            const reg = el.getAttribute("tb-bind");
            if (!reg)
                return;
            const name = el.getAttribute("name") || `reg_${reg}`;
            data[name] = this.store.read(Number(reg));
        });
        return data;
    }
}
exports.TitanDOMEngine = TitanDOMEngine;
//# sourceMappingURL=core.js.map
/* ─── component.js ─── */

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

exports.TitanComponentManager = void 0;
class TitanComponentManager {
    components = new Map();
    engine;
    constructor(engine) {
        this.engine = engine;
    }
    define(def) {
        this.components.set(def.name, def);
        return this;
    }
    async loadFile(name, filePath, setup) {
        try {
            let template = "";
            if (typeof fetch !== "undefined") {
                const res = await fetch(filePath);
                if (!res.ok)
                    throw new Error(`HTTP error ${res.status} fetching component ${filePath}`);
                template = await res.text();
            }
            else if (typeof require !== "undefined") {
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
        }
        catch (err) {
            console.error(`[TitanComponent] Failed to load component '${name}' from '${filePath}':`, err);
        }
        return this;
    }
    async mount(container, name, props = {}) {
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
    async scanAndHydrate(root = this.engine.root || document) {
        const targets = root.querySelectorAll("[tb-component]");
        for (const el of Array.from(targets)) {
            const compName = el.getAttribute("tb-component");
            if (!compName)
                continue;
            // Extract all other attributes as props
            const props = {};
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
exports.TitanComponentManager = TitanComponentManager;
//# sourceMappingURL=component.js.map
/* ─── router.js ─── */

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

exports.TitanRouter = void 0;
class TitanRouter {
    routes = new Map();
    routeIdToPath = new Map();
    pathToRouteId = new Map();
    engine;
    componentManager;
    options;
    currentPath = "";
    constructor(engine, componentManager, options = {}) {
        this.engine = engine;
        this.componentManager = componentManager;
        this.options = {
            mode: options.mode || "hash",
            routeRegister: options.routeRegister !== undefined ? options.routeRegister : 990,
            viewSelector: options.viewSelector || "[tb-view]"
        };
    }
    add(route) {
        this.routes.set(route.path, route);
        // Auto-assign numeric ID for register mapping if not provided
        const routeId = route.registerId !== undefined ? route.registerId : this.routes.size;
        this.routeIdToPath.set(routeId, route.path);
        this.pathToRouteId.set(route.path, routeId);
        return this;
    }
    init() {
        if (typeof window === "undefined")
            return this;
        // Listen to browser URL changes
        if (this.options.mode === "hash") {
            window.addEventListener("hashchange", () => this.handleLocationChange());
        }
        else {
            window.addEventListener("popstate", () => this.handleLocationChange());
        }
        // Intercept tb-link clicks globally
        document.addEventListener("click", (e) => {
            const target = e.target;
            if (!target)
                return;
            const linkEl = target.closest("[tb-link]");
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
    navigate(path, syncRegister = true) {
        if (typeof window !== "undefined") {
            if (this.options.mode === "hash") {
                window.location.hash = path.startsWith("#") ? path : `#${path}`;
            }
            else {
                window.history.pushState({}, "", path);
                this.handleLocationChange();
            }
        }
        else {
            this.currentPath = path;
        }
        if (syncRegister) {
            const routeId = this.pathToRouteId.get(path);
            if (routeId !== undefined) {
                this.engine.store.write(this.options.routeRegister, routeId, "router");
            }
        }
    }
    getCurrentPath() {
        if (typeof window === "undefined")
            return "/";
        if (this.options.mode === "hash") {
            const hash = window.location.hash.slice(1);
            return hash.startsWith("/") ? hash : `/${hash}`;
        }
        return window.location.pathname || "/";
    }
    async handleLocationChange() {
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
            const links = document.querySelectorAll("[tb-link]");
            links.forEach((link) => {
                const linkPath = link.getAttribute("tb-link");
                link.classList.toggle("active", linkPath === path);
            });
        }
        // Mount route view into outlet
        await this.renderView(route);
    }
    async renderView(route) {
        if (typeof document === "undefined")
            return;
        const outlet = document.querySelector(this.options.viewSelector);
        if (!outlet) {
            console.warn(`[TitanRouter] View outlet '${this.options.viewSelector}' not found in DOM.`);
            return;
        }
        if (route.template) {
            outlet.innerHTML = route.template;
            this.engine.scanAndBind(outlet);
            await this.componentManager.scanAndHydrate(outlet);
        }
        else if (route.component) {
            await this.componentManager.mount(outlet, route.component);
        }
    }
}
exports.TitanRouter = TitanRouter;
//# sourceMappingURL=router.js.map
/* ─── index.js ─── */

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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

exports.createTitanApp = createTitanApp;
exports.getDefaultTitanApp = getDefaultTitanApp;
__exportStar(require("./types"), exports);
__exportStar(require("./core"), exports);
__exportStar(require("./component"), exports);
__exportStar(require("./router"), exports);
__exportStar(require("./error"), exports);




/**
 * Creates and initializes a complete Titan application instance
 * with Register Store, Reactive DOM Engine, Component Manager, and Router.
 */
function createTitanApp(options = {}) {
    const store = options.dom?.store || new core_1.TitanRegisterStore();
    const engine = new core_1.TitanDOMEngine({ ...options.dom, store });
    const components = new component_1.TitanComponentManager(engine);
    const router = new router_1.TitanRouter(engine, components, options.router);
    const app = {
        store,
        engine,
        components,
        router,
        errors: engine.errors,
        async mount(root) {
            engine.init(root);
            await components.scanAndHydrate(engine.root || document);
            router.init();
            return app;
        }
    };
    // Expose on global window if in browser environment
    if (typeof window !== "undefined") {
        window.TitanDOM = engine;
        window.TitanApp = app;
        window.createTitanApp = createTitanApp;
        window.TitanRegisterStore = core_1.TitanRegisterStore;
        window.TitanDOMEngine = core_1.TitanDOMEngine;
        window.TitanComponentManager = component_1.TitanComponentManager;
        window.TitanRouter = router_1.TitanRouter;
        window.TitanErrorManager = error_1.TitanErrorManager;
        window.ERROR_REGISTERS = error_1.ERROR_REGISTERS;
        window.ErrorModule = error_1.ErrorModule;
        window.ErrorSeverity = error_1.ErrorSeverity;
    }
    return app;
}
// ─── Default Auto-Bootstrapping Application ─────────────────────────────────
let defaultApp = null;
function getDefaultTitanApp() {
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
        read: (reg, defVal) => app.store.read(reg, defVal),
        write: (reg, val) => app.store.write(reg, val),
        toggle: (reg) => app.store.toggle(reg),
        increment: (reg, step) => app.store.increment(reg, step),
        decrement: (reg, step) => app.store.decrement(reg, step),
        on: (reg, cb) => app.store.on(reg, cb),
        writeBatch: (map) => app.store.writeBatch(map),
        readBatch: (regs) => app.store.readBatch(regs),
        // Form & Action shortcuts
        getFormData: (selector) => app.engine.getFormData(selector),
        action: (name, fn) => app.engine.registerAction(name, fn),
        // Router & Component shortcuts
        navigate: (path) => app.router.navigate(path),
        route: (path, component, registerId) => app.router.add({ path, component, registerId }),
        component: (def) => app.components.define(def),
        loadFile: (name, path) => app.components.loadFile(name, path),
        // Error & Fetch shortcuts
        errors: app.engine.errors,
        reportError: (info) => app.engine.errors.report(info),
        clearError: () => app.engine.errors.clear(),
        fetch: (url, reg) => app.engine.fetchData(url, reg)
    };
    window.Titan = Titan;
    window.TitanDOM = app.engine;
    window.TitanApp = app;
    window.createTitanApp = createTitanApp;
    window.TitanRegisterStore = core_1.TitanRegisterStore;
    window.TitanDOMEngine = core_1.TitanDOMEngine;
    window.TitanComponentManager = component_1.TitanComponentManager;
    window.TitanRouter = router_1.TitanRouter;
    // 🚀 Auto-Bootstrap: Zero JS Required!
    const autoInit = () => {
        const root = document.querySelector("[tb-app]") || document.body;
        if (root && !window._titanMounted) {
            window._titanMounted = true;
            app.mount(root);
        }
    };
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", autoInit);
    }
    else {
        // DOM already ready (e.g. async or deferred script)
        setTimeout(autoInit, 0);
    }
}
//# sourceMappingURL=index.js.map
  // Expose on global window / scope
  global.TitanRegisterStore = exports.TitanRegisterStore;
  global.TitanDOMEngine = exports.TitanDOMEngine;
  global.TitanComponentManager = exports.TitanComponentManager;
  global.TitanRouter = exports.TitanRouter;
  global.TitanErrorManager = exports.TitanErrorManager;
  global.createTitanApp = exports.createTitanApp;

  // Auto-initialize if [tb-app] attribute is found on body or document
  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", function() {
      var appRoot = document.querySelector("[tb-app]") || document.body;
      if (appRoot && !global._titanAppInitialized) {
        global._titanAppInitialized = true;
        global.titanApp = exports.createTitanApp().mount(appRoot);
      }
    });
  }
})(typeof window !== "undefined" ? window : globalThis);
