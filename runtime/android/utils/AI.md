# 🤖 AI Maintenance Guidelines for Utils (`runtime/android/utils`)

## 🔒 Hotpatch Socket Invariants

1. **UDP Discovery**:
   - When TCP connection fails, `discoverServerIP()` MUST send UDP broadcast on port 9091 to auto-detect PC IP changes.
2. **Ping / Pong Heartbeats**:
   - `startHeartbeat()` MUST send PING packet every 10s to keep socket alive through carrier/router timeouts.
