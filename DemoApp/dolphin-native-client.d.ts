export class DolphinClient {
  baseUrl: string;
  tokenKey: string;
  sseConnection: any;
  wsConnection: any;
  realtimeCallbacks: Set<Function>;
  constructor(baseUrl?: string);
  setToken(token: string | null): void;
  getToken(): string | null;
  connectRealtime(onMessage: (data: any) => void): () => void;
}

export interface DolphinClient {
  api: {
    todos: {
      get(options?: any): Promise<any>;
      post(body?: any, options?: any): Promise<any>;
      delete(id: string | number, options?: any): Promise<any>;
    };
    auth: {
      login(body?: any, options?: any): Promise<any>;
      register(body?: any, options?: any): Promise<any>;
    };
  };
}

export const client: DolphinClient;


export class DolphinNativeSync {
  client: DolphinClient;
  deviceId: string;
  app: any;
  stopFn: any;
  constructor(baseUrl: string, deviceId?: string, options?: { token?: string | null });
  sync(app: any): void;
  disconnect(): void;
}