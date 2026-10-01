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

import { ITitanRegisterStore, RegisterId } from "./types";

export const ERROR_REGISTERS = {
  MASTER: 90,
  COUNT: 91,
  MODULE: 92,
  CODE: 93,
  SEVERITY: 94,
  JSON: 99
} as const;

export enum ErrorModule {
  CORE = 1,
  NETWORK = 2,
  COMPONENT = 3,
  ROUTER = 4,
  USER_ACTION = 5,
  HARDWARE = 6
}

export enum ErrorSeverity {
  INFO = 1,
  WARN = 2,
  CRITICAL = 3,
  FATAL = 4
}

export interface TitanErrorInfo {
  module: ErrorModule | number;
  code: number;
  severity?: ErrorSeverity | number;
  message: string;
  details?: any;
}

export class TitanErrorManager {
  private store: ITitanRegisterStore;
  private errorCount: number = 0;
  private trapsInstalled: boolean = false;

  constructor(store: ITitanRegisterStore) {
    this.store = store;
  }

  report(info: TitanErrorInfo): void {
    this.errorCount++;
    const severity = info.severity !== undefined ? info.severity : ErrorSeverity.CRITICAL;

    this.store.writeBatch({
      [ERROR_REGISTERS.MASTER]: 1,
      [ERROR_REGISTERS.COUNT]: this.errorCount,
      [ERROR_REGISTERS.MODULE]: info.module,
      [ERROR_REGISTERS.CODE]: info.code,
      [ERROR_REGISTERS.SEVERITY]: severity,
      [ERROR_REGISTERS.JSON]: info.message
    });

    console.error(`[TitanError] [Mod ${info.module} | Code ${info.code} | Sev ${severity}]: ${info.message}`, info.details || "");
  }

  clear(): void {
    this.store.write(ERROR_REGISTERS.MASTER, 0);
  }

  installGlobalTraps(): this {
    if (this.trapsInstalled || typeof window === "undefined") return this;
    this.trapsInstalled = true;

    // 1. Uncaught Runtime Exceptions
    window.addEventListener("error", (event: ErrorEvent) => {
      this.report({
        module: ErrorModule.CORE,
        code: 1001,
        severity: ErrorSeverity.FATAL,
        message: event.message || "Uncaught script exception",
        details: { filename: event.filename, lineno: event.lineno, colno: event.colno, error: event.error }
      });
    });

    // 2. Unhandled Promise Rejections
    window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
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
