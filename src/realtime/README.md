# 📡 Dolphin Native Realtime TCP Engine (`src/realtime`)

The **Realtime Engine** provides high-frequency, binary TCP socket streaming (`0x5442 'TB'` protocol), channel pub/sub, presence tracking, and stream buffering without WebSocket or WebRTC overhead.

---

## 📂 Modular Architecture

| File | Class | Description |
|---|---|---|
| `TitanFrameBuilder.js` | `TitanFrameBuilder` | Binary TCP frame encoder/decoder (`0x5442 'TB'`). |
| `WebSocketClient.js` | `WebSocketClient` | Pure Binary TCP client with auto-reconnect, ping/pong heartbeats, and offline queue. |
| `RealtimeChannel.js` | `RealtimeChannel` | Channel pub/sub, broadcast, and presence tracking. |
| `StreamManager.js` | `StreamManager` | High-frequency data stream chunk buffering and flow control. |

---

## 💻 Usage Example

```js
const { WebSocketClient } = require('dolphin-native/src/realtime/WebSocketClient');

const client = new WebSocketClient({ host: '127.0.0.1', port: 9092 });
client.connect();

const channel = client.channel('room-1');
channel.subscribe();
channel.broadcast({ user: 'John', status: 'online' });
```
