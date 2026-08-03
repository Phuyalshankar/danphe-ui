import { EventEmitter } from 'events';
import type { HttpCallConfig, RequestOptions, HttpResponse, RequestInterceptor, ResponseInterceptor } from './types';
/**
 * 🌊 DolphinIntercom — HttpCall
 *
 * Binary-protocol HTTP/REST call module for Dolphin Intercom apps.
 * Supports GET, POST, PUT, PATCH, DELETE with timeout, retry,
 * interceptors, and binary command dispatch to the Android runtime.
 */
declare const INTERCOM_CMD: Record<string, number>;
declare class HttpCall extends EventEmitter {
    baseURL: string;
    timeout: number;
    retries: number;
    headers: Record<string, string>;
    private _interceptors;
    private _pending;
    constructor(config?: HttpCallConfig);
    useRequest(fn: RequestInterceptor): this;
    useResponse(fn: ResponseInterceptor): this;
    private _buildBinaryCmd;
    private _request;
    private _execute;
    /** Settle a pending request from the Android runtime callback */
    settle(reqId: string, response: HttpResponse): void;
    get(url: string, opts?: RequestOptions): Promise<HttpResponse | undefined>;
    post(url: string, body?: unknown, opts?: RequestOptions): Promise<HttpResponse | undefined>;
    put(url: string, body?: unknown, opts?: RequestOptions): Promise<HttpResponse | undefined>;
    patch(url: string, body?: unknown, opts?: RequestOptions): Promise<HttpResponse | undefined>;
    delete(url: string, opts?: RequestOptions): Promise<HttpResponse | undefined>;
    /** Build binary command packet for manual dispatch */
    buildCommand(method: string, url: string, body?: unknown, headers?: Record<string, string>): Buffer;
}
export default HttpCall;
export { HttpCall, INTERCOM_CMD };
//# sourceMappingURL=HttpCall.d.ts.map