/**
 * 🐬 TITAN-DOM AUTOMATED TEST SUITE
 * Node.js Native Test Runner (node --test)
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  TitanRegisterStore,
  TitanDOMEngine,
  TitanComponentManager,
  TitanRouter,
  TitanErrorManager,
  ERROR_REGISTERS,
  ErrorModule,
  ErrorSeverity,
  createTitanApp
} = require("../dist/index.js");

// ─── Minimal DOM Mock for Node Environment ──────────────────────────────────
class MockAttribute {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

class MockElement {
  constructor(tagName = "div") {
    this.tagName = tagName.toUpperCase();
    this.attributes = [];
    this.children = [];
    this.classList = new Set();
    this.style = {};
    this.textContent = "";
    this.innerHTML = "";
    this.value = "";
    this.type = "text";
    this.checked = false;
    this.eventListeners = new Map();
    this.parentElement = null;
  }

  setAttribute(name, val) {
    const existing = this.attributes.find((a) => a.name === name);
    if (existing) existing.value = String(val);
    else this.attributes.push(new MockAttribute(name, String(val)));
  }

  getAttribute(name) {
    const attr = this.attributes.find((a) => a.name === name);
    return attr ? attr.value : null;
  }

  hasAttribute(name) {
    return this.attributes.some((a) => a.name === name);
  }

  removeAttribute(name) {
    this.attributes = this.attributes.filter((a) => a.name !== name);
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
  }

  querySelectorAll(selector) {
    const results = [];
    const match = (el) => {
      let isMatch = false;
      if (selector === "*") isMatch = true;
      else if (selector.startsWith("[") && selector.endsWith("]")) {
        const attrName = selector.slice(1, -1);
        isMatch = el.hasAttribute(attrName);
      }
      if (isMatch) results.push(el);

      for (const c of el.children) {
        match(c);
      }
    };
    match(this);
    return results;
  }

  querySelector(selector) {
    const all = this.querySelectorAll(selector);
    return all.length > 0 ? all[0] : null;
  }

  closest(selector) {
    return this;
  }

  addEventListener(type, cb) {
    if (!this.eventListeners.has(type)) this.eventListeners.set(type, []);
    this.eventListeners.get(type).push(cb);
  }

  dispatchEvent(e) {
    e.target = this;
    const listeners = this.eventListeners.get(e.type) || [];
    for (const l of listeners) l(e);
  }
}

class MockDocument extends MockElement {
  constructor() {
    super("document");
    this.body = new MockElement("body");
    this.appendChild(this.body);
  }

  createElement(tag) {
    return new MockElement(tag);
  }
}

// ─── TEST SUITE ─────────────────────────────────────────────────────────────

test("TitanRegisterStore: Core Read, Write, and Typed Accessors", () => {
  const store = new TitanRegisterStore();

  store.write(1001, 42);
  assert.equal(store.read(1001), 42);
  assert.equal(store.readNumber(1001), 42);
  assert.equal(store.readString(1001), "42");
  assert.equal(store.readBool(1001), true);

  // String value
  store.write(1002, "TitanBus");
  assert.equal(store.read(1002), "TitanBus");
  assert.equal(store.readString(1002), "TitanBus");

  // Toggle
  assert.equal(store.toggle(1003), 1);
  assert.equal(store.read(1003), 1);
  assert.equal(store.toggle(1003), 0);
  assert.equal(store.read(1003), 0);

  // Increment & Decrement
  assert.equal(store.increment(1004, 5), 5);
  assert.equal(store.increment(1004, 2), 7);
  assert.equal(store.decrement(1004, 3), 4);

  // Batch Write & Read
  store.writeBatch({ 2001: 100, 2002: 200, 2003: 300 });
  const batch = store.readBatch([2001, 2002, 2003]);
  assert.deepEqual(batch, { 2001: 100, 2002: 200, 2003: 300 });
});

test("TitanRegisterStore: Listeners and Wildcards", () => {
  const store = new TitanRegisterStore();
  const received = [];

  const unsub = store.on(1001, (val, reg, src) => {
    received.push({ val, reg, src });
  });

  store.write(1001, 99, "sensor");
  assert.equal(received.length, 1);
  assert.deepEqual(received[0], { val: 99, reg: 1001, src: "sensor" });

  // Unsubscribe
  unsub();
  store.write(1001, 100);
  assert.equal(received.length, 1); // No new events
});

test("TitanDOMEngine: Two-way Binding and Reactive Text", () => {
  const doc = new MockDocument();
  const engine = new TitanDOMEngine({ root: doc });

  const input = new MockElement("input");
  input.setAttribute("tb-bind", "1001");
  input.value = "InitialUser";
  doc.body.appendChild(input);

  const label = new MockElement("span");
  label.setAttribute("tb-text", "1001");
  doc.body.appendChild(label);

  engine.scanAndBind(doc.body);

  // Initial read from DOM into store
  assert.equal(engine.store.read(1001), "InitialUser");
  assert.equal(label.textContent, "InitialUser");

  // Update store directly -> label and input update!
  engine.store.write(1001, "UpdatedUser");
  assert.equal(label.textContent, "UpdatedUser");
  assert.equal(input.value, "UpdatedUser");
});

test("TitanDOMEngine: Form Serialization", () => {
  const doc = new MockDocument();
  const engine = new TitanDOMEngine({ root: doc });

  const form = new MockElement("form");
  const field1 = new MockElement("input");
  field1.setAttribute("tb-bind", "1010");
  field1.setAttribute("name", "username");
  field1.value = "admin";

  const field2 = new MockElement("input");
  field2.setAttribute("tb-bind", "1011");
  field2.setAttribute("name", "role");
  field2.value = "engineer";

  form.appendChild(field1);
  form.appendChild(field2);
  doc.body.appendChild(form);

  engine.scanAndBind(form);

  const formData = engine.getFormData(form);
  assert.deepEqual(formData, {
    username: "admin",
    role: "engineer"
  });
});

test("TitanRouter: Path to Register Synchronization", () => {
  const store = new TitanRegisterStore();
  const engine = new TitanDOMEngine({ store });
  const comp = new TitanComponentManager(engine);
  const router = new TitanRouter(engine, comp, { routeRegister: 990, mode: "hash" });

  router.add({ path: "/dashboard", registerId: 1 });
  router.add({ path: "/settings", registerId: 2 });
  router.add({ path: "/logs", registerId: 3 });

  // Navigate sets Register 990
  router.navigate("/settings");
  assert.equal(store.read(990), 2);

  router.navigate("/logs");
  assert.equal(store.read(990), 3);
});

test("createTitanApp: Unified Factory", () => {
  const doc = new MockDocument();
  const app = createTitanApp({ dom: { root: doc } });

  assert.ok(app.store);
  assert.ok(app.engine);
  assert.ok(app.components);
  assert.ok(app.router);

  app.store.write(5000, "ActiveApp");
  assert.equal(app.store.read(5000), "ActiveApp");
  assert.ok(app.errors);
});

test("TitanDOMEngine: Reactive Visibility (tb-show / tb-hide)", () => {
  const doc = new MockDocument();
  const engine = new TitanDOMEngine({ root: doc });

  const bannerShow = new MockElement("div");
  bannerShow.setAttribute("tb-show", "90");
  bannerShow.style.display = "none";
  doc.body.appendChild(bannerShow);

  const bannerHide = new MockElement("div");
  bannerHide.setAttribute("tb-hide", "90");
  doc.body.appendChild(bannerHide);

  engine.scanAndBind(doc.body);

  // Initial state: Reg 90 is 0 (falsy)
  assert.equal(bannerShow.style.display, "none");
  assert.equal(bannerHide.style.display, "");

  // Turn Reg 90 to 1 (active)
  engine.store.write(90, 1);
  assert.equal(bannerShow.style.display, "");
  assert.equal(bannerHide.style.display, "none");

  // Turn Reg 90 back to 0
  engine.store.write(90, 0);
  assert.equal(bannerShow.style.display, "none");
  assert.equal(bannerHide.style.display, "");
});

test("TitanErrorManager: Master Error Registers (90-99)", () => {
  const store = new TitanRegisterStore();
  const errors = new TitanErrorManager(store);

  // Initially error registers are empty/0
  assert.equal(store.read(ERROR_REGISTERS.MASTER), 0);

  // Report error from Network module
  errors.report({
    module: ErrorModule.NETWORK,
    code: 404,
    severity: ErrorSeverity.CRITICAL,
    message: "Network payload not found"
  });

  assert.equal(store.read(ERROR_REGISTERS.MASTER), 1);
  assert.equal(store.read(ERROR_REGISTERS.COUNT), 1);
  assert.equal(store.read(ERROR_REGISTERS.MODULE), ErrorModule.NETWORK);
  assert.equal(store.read(ERROR_REGISTERS.CODE), 404);
  assert.equal(store.read(ERROR_REGISTERS.SEVERITY), ErrorSeverity.CRITICAL);
  assert.equal(store.read(ERROR_REGISTERS.JSON), "Network payload not found");

  // Clear error
  errors.clear();
  assert.equal(store.read(ERROR_REGISTERS.MASTER), 0);
  // Count remains persisted for audit tally
  assert.equal(store.read(ERROR_REGISTERS.COUNT), 1);
});

test("TitanDOMEngine: Action Exception Trap to Master Error Register", () => {
  const store = new TitanRegisterStore();
  const engine = new TitanDOMEngine({ store });

  engine.registerAction("failingAction", () => {
    throw new Error("PLC Connection Timeout");
  });

  const dummyEl = new MockElement("button");
  const dummyEvent = { type: "click" };

  // Trigger failing action via directive
  engine.executeDirective("action:failingAction", dummyEvent, dummyEl);

  // Check that Master Error Register was automatically updated!
  assert.equal(store.read(ERROR_REGISTERS.MASTER), 1);
  assert.equal(store.read(ERROR_REGISTERS.MODULE), ErrorModule.USER_ACTION);
  assert.equal(store.read(ERROR_REGISTERS.CODE), 500);
  assert.equal(store.read(ERROR_REGISTERS.JSON), "PLC Connection Timeout");
});

test("TitanDOMEngine: Directives (set, error, clear_error)", () => {
  const store = new TitanRegisterStore();
  const engine = new TitanDOMEngine({ store });
  const dummyEl = new MockElement("button");
  const dummyEvent = { type: "click" };

  // 1. set directive
  engine.executeDirective("set:500:99", dummyEvent, dummyEl);
  assert.equal(store.read(500), 99);

  // 2. manual error trigger directive
  engine.executeDirective("error:Emergency Stop Pressed:503:6:4", dummyEvent, dummyEl);
  assert.equal(store.read(ERROR_REGISTERS.MASTER), 1);
  assert.equal(store.read(ERROR_REGISTERS.CODE), 503);
  assert.equal(store.read(ERROR_REGISTERS.MODULE), 6); // Hardware
  assert.equal(store.read(ERROR_REGISTERS.SEVERITY), 4); // Fatal
  assert.equal(store.read(ERROR_REGISTERS.JSON), "Emergency Stop Pressed");

  // 3. clear_error directive
  engine.executeDirective("clear_error", dummyEvent, dummyEl);
  assert.equal(store.read(ERROR_REGISTERS.MASTER), 0);
});

