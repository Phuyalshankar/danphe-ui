/**
 * 🐬 TITAN-DOM TYPESCRIPT DEFINITIONS
 * Strongly Typed Contracts for Zero-VDOM Reactive DOM, Components, and Routing.
 */

export type RegisterId = number | string;
export type RegisterValue = string | number | boolean | null | undefined | object | any[];

export interface ITitanRegisterStore {
  readonly size: number;
  write(reg: RegisterId, value: RegisterValue, source?: any): void;
  read(reg: RegisterId, defaultValue?: RegisterValue): RegisterValue;
  readNumber(reg: RegisterId, defaultValue?: number): number;
  readString(reg: RegisterId, defaultValue?: string): string;
  readBool(reg: RegisterId, defaultValue?: boolean): boolean;
  toggle(reg: RegisterId): number;
  increment(reg: RegisterId, step?: number): number;
  decrement(reg: RegisterId, step?: number): number;
  writeBatch(mapObject: Record<number, RegisterValue>): void;
  readBatch(regArray: RegisterId[]): Record<number, RegisterValue>;
  on(reg: RegisterId, callback: RegisterListener): () => void;
  off(reg: RegisterId, callback: RegisterListener): void;
}

export type RegisterListener = (
  value: RegisterValue,
  reg: RegisterId,
  source?: any
) => void;

export interface ActionContext {
  event: Event;
  element: HTMLElement;
  store: ITitanRegisterStore;
  params?: string[];
}

export type ActionHandler = (context: ActionContext) => void | Promise<void>;

export interface TitanDOMOptions {
  store?: ITitanRegisterStore;
  root?: Document | HTMLElement;
  autoScan?: boolean;
}

export interface RouteDefinition {
  path: string;
  component?: string; // Component name or HTML file path
  template?: string;  // Inline template string
  title?: string;
  registerId?: RegisterId; // When this route is active, sets this register
}

export interface RouterOptions {
  mode?: "hash" | "history";
  routeRegister?: RegisterId; // Default 990 (REG_ROUTE)
  viewSelector?: string;      // Default "[tb-view]"
}

export interface ComponentDefinition {
  name: string;
  template?: string;
  file?: string;
  props?: string[];
  setup?: (props: Record<string, any>, context: { store: ITitanRegisterStore, el: HTMLElement }) => void;
}
