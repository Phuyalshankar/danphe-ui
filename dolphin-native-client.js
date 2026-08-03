
(function(global) {
  
class DolphinClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    this.baseUrl = this.baseUrl.replace(/\/$/, '');
    this.tokenKey = 'dolphin_token';
    this.sseConnection = null;
    this.wsConnection = null;
    this.realtimeCallbacks = new Set();
    this._initSDK();
  }

  setToken(token) {
    if (typeof window !== 'undefined') {
      if (token) {
        window.localStorage.setItem(this.tokenKey, token);
      } else {
        window.localStorage.removeItem(this.tokenKey);
      }
    }
    this._token = token;
  }

  getToken() {
    if (this._token) return this._token;
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  async _request(method, path, body, options = {}) {
    const url = this.baseUrl + path;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }

    const fetchConstructor = (typeof window !== 'undefined' ? window.fetch : (typeof globalThis !== 'undefined' ? globalThis.fetch : null));
    if (!fetchConstructor) {
      throw new Error('[DolphinClient] Fetch is not supported in this environment');
    }

    const response = await fetchConstructor(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      ...options
    });

    if (response.status === 401) {
      this.setToken(null);
    }

    if (!response.ok) {
      let err;
      try {
        const json = await response.json();
        err = new Error(json.message || 'Request failed');
        err.status = response.status;
        err.errors = json.errors;
      } catch {
        err = new Error('Request failed');
        err.status = response.status;
      }
      throw err;
    }

    // Handle 204 No Content
    if (response.status === 204) return null;

    return response.json();
  }

  connectRealtime(onMessage, topics = []) {
    this.realtimeCallbacks.add(onMessage);
    const deviceId = 'web_' + Math.random().toString(36).substring(2, 10);
    const token = this.getToken();
    const tokenParam = token ? '&token=' + encodeURIComponent(token) : '';
    const topicsArr = Array.isArray(topics) ? topics : [topics];
    
    let ws = null;
    let queuedSubs = [];
    const activeSubs = new Set(topicsArr);

    const sendMsg = (msg) => {
      if (ws && ws.readyState === 1) {
        ws.send(JSON.stringify(msg));
      } else {
        queuedSubs.push(msg);
      }
    };

    const subscribe = (topic) => {
      activeSubs.add(topic);
      sendMsg({ type: 'sub', topic });
    };

    const unsubscribe = (topic) => {
      activeSubs.delete(topic);
      sendMsg({ type: 'unsub', topic });
    };

    // Pre-queue initial subscriptions
    topicsArr.forEach(topic => {
      queuedSubs.push({ type: 'sub', topic });
    });

    const wsConstructor = (typeof window !== 'undefined' ? window.WebSocket : (typeof globalThis !== 'undefined' ? globalThis.WebSocket : null));
    if (wsConstructor) {
      const wsProto = this.baseUrl.startsWith('https') ? 'wss://' : 'ws://';
      const wsUrl = this.baseUrl.replace(/^https?:\/\//, wsProto) + '/realtime?deviceId=' + deviceId + tokenParam;
      
      try {
        ws = new wsConstructor(wsUrl);
        this.wsConnection = ws;
        
        ws.onopen = () => {
          console.log('[DolphinClient] WebSocket connected');
          // Send all queued subscriptions
          while (queuedSubs.length > 0) {
            const msg = queuedSubs.shift();
            ws.send(JSON.stringify(msg));
          }
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const payload = data.payload !== undefined ? data.payload : data;
            this.realtimeCallbacks.forEach(cb => cb(payload));
          } catch {}
        };
        
        ws.onerror = () => {
          this._fallbackToSSE(activeSubs);
        };
        
        ws.onclose = () => {
          this._fallbackToSSE(activeSubs);
        };

        const closeFn = () => {
          this.realtimeCallbacks.delete(onMessage);
          if (ws) {
            ws.close();
          }
        };
        closeFn.subscribe = subscribe;
        closeFn.unsubscribe = unsubscribe;
        return closeFn;
      } catch (err) {
        this._fallbackToSSE(activeSubs);
      }
    } else {
      this._fallbackToSSE(activeSubs);
    }

    const fallbackCloseFn = () => {
      this.realtimeCallbacks.delete(onMessage);
      if (this.sseConnection) {
        this.sseConnection.close();
      }
    };
    fallbackCloseFn.subscribe = subscribe;
    fallbackCloseFn.unsubscribe = unsubscribe;
    return fallbackCloseFn;
  }

  _fallbackToSSE(activeSubs) {
    if (this.sseConnection || this.wsConnection?.readyState === 1) return;
    
    const sseConstructor = (typeof window !== 'undefined' ? window.EventSource : (typeof globalThis !== 'undefined' ? globalThis.EventSource : null));
    if (!sseConstructor) {
      console.warn('[DolphinClient] EventSource is not supported in this environment');
      return;
    }

    console.log('[DolphinClient] Falling back to SSE (Server-Sent Events)');
    const token = this.getToken();
    const tokenParam = token ? '?token=' + encodeURIComponent(token) : '';
    const topicsList = activeSubs && activeSubs.size > 0 ? '&topics=' + encodeURIComponent(Array.from(activeSubs).join(',')) : '';
    const sseUrl = this.baseUrl + '/realtime/sse' + tokenParam + topicsList;
    const sse = new sseConstructor(sseUrl);
    this.sseConnection = sse;
    
    sse.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const payload = data.payload !== undefined ? data.payload : data;
        this.realtimeCallbacks.forEach(cb => cb(payload));
      } catch {}
    };
  }
}


  DolphinClient.prototype._initSDK = function() {
    const client = this;
    
    // Route: GET /api/todos
    client.api = client.api || {};
client.api.todos = client.api.todos || {};
    client.api.todos.get = function(options) {
      return this._request('GET', `/api/todos`, undefined, options);
    }.bind(this);


    // Route: POST /api/todos
    client.api = client.api || {};
client.api.todos = client.api.todos || {};
    client.api.todos.post = function(body, options) {
      return this._request('POST', `/api/todos`, body, options);
    }.bind(this);


    // Route: DELETE /api/todos/:id
    client.api = client.api || {};
client.api.todos = client.api.todos || {};
    client.api.todos.delete = function(id, options) {
      return this._request('DELETE', `/api/todos/${id}`, undefined, options);
    }.bind(this);


    // Route: POST /api/auth/login
    client.api = client.api || {};
client.api.auth = client.api.auth || {};
    client.api.auth.login = function(body, options) {
      return this._request('POST', `/api/auth/login`, body, options);
    }.bind(this);


    // Route: POST /api/auth/register
    client.api = client.api || {};
client.api.auth = client.api.auth || {};
    client.api.auth.register = function(body, options) {
      return this._request('POST', `/api/auth/register`, body, options);
    }.bind(this);

  };

  const client = new DolphinClient();

  
class DolphinNativeSync {
  constructor(baseUrl, deviceId, options = {}) {
    this.client = new DolphinClient(baseUrl);
    this.client.setToken(options.token || null);
    this.deviceId = deviceId || 'native_device_' + Math.random().toString(36).substring(2, 10);
    this.app = null;
    this.stopFn = null;
  }

  sync(app) {
    this.app = app;
    
    // Auto sync reactive routes topics to app states
    this.stopFn = this.client.connectRealtime((msg) => {
      if (!this.app) return;

      // ─── Intercom State Syncing ───
      if (msg.topic === 'intercom/calls') {
        if (msg.action === 'invite') {
          this.app.state('call_state', 'RINGING');
          this.app.state('active_call', msg.data);
        } else if (msg.action === 'accept') {
          this.app.state('call_state', 'CONNECTED');
        } else if (msg.action === 'end') {
          this.app.state('call_state', 'ENDED');
          this.app.state('active_call', null);
        }
        return;
      }

      // ─── Standard CRUD State Syncing ───
      const stateName = msg.topic.split('/').pop();
      let currentData = this.app.getState(stateName);
      
      // Auto initialize state if empty or undefined
      if (currentData === undefined) {
        currentData = [];
      }

      if (Array.isArray(currentData)) {
        if (msg.action === 'create') {
          currentData.push(msg.data);
        } else if (msg.action === 'update') {
          currentData = currentData.map(item => item.id === msg.data.id ? msg.data : item);
        } else if (msg.action === 'delete') {
          currentData = currentData.filter(item => item.id !== msg.data.id);
        }
        this.app.state(stateName, currentData);
      } else if (typeof currentData === 'object' && currentData !== null) {
        if (msg.action === 'update') {
          this.app.state(stateName, { ...currentData, ...msg.data });
        }
      }
    }, ['api/#', 'intercom/calls']);
  }

  disconnect() {
    if (this.stopFn) {
      this.stopFn();
      this.stopFn = null;
    }
  }
}


  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { client, DolphinClient, DolphinNativeSync };
  }
  
  if (typeof global !== 'undefined') {
    global.client = client;
    global.DolphinClient = DolphinClient;
    global.DolphinNativeSync = DolphinNativeSync;
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : (typeof self !== 'undefined' ? self : this))));
