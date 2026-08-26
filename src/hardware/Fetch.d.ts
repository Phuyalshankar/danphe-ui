import { HWDescriptor, FetchOptions, FetchBody } from './types';
/**
 * 🌊 DolphinJS Hardware — Fetch / HTTP
 */
export declare const Fetch: {
    /**
     * HTTP GET request from the device.
     * Returns: { status, body, ok }
     */
    get: (url: string, options?: FetchOptions) => HWDescriptor<{
        url: string;
        headers: Record<string, string>;
        timeout: number;
    }>;
    /** HTTP POST with JSON body */
    post: (url: string, body: FetchBody, options?: FetchOptions) => HWDescriptor<{
        url: string;
        body: string;
        headers: Record<string, string>;
        timeout: number;
    }>;
    put: (url: string, body: FetchBody, options?: FetchOptions) => HWDescriptor<{
        url: string;
        body: string;
        headers: Record<string, string>;
    }>;
    patch: (url: string, body: FetchBody, options?: FetchOptions) => HWDescriptor<{
        url: string;
        body: string;
        headers: Record<string, string>;
    }>;
    delete: (url: string, options?: FetchOptions) => HWDescriptor<{
        url: string;
        headers: Record<string, string>;
    }>;
    /** Generic request */
    request: (method: string, url: string, body: FetchBody, options?: FetchOptions) => HWDescriptor<{
        url: string;
        body: FetchBody;
        headers: Record<string, string>;
        timeout: number;
    }>;
    _action: (method: string, url: string, body: FetchBody, headers: Record<string, string>) => {
        action: string;
        value: string;
    };
};
export type FetchModule = typeof Fetch;
//# sourceMappingURL=Fetch.d.ts.map