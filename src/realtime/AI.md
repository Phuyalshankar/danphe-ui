# 🤖 AI Maintenance Guidelines for Realtime Engine (`src/realtime`)

## 🔒 Binary Protocol Invariants

1. **TB Header Specification**:
   - Magic bytes MUST be `0x54` ('T') and `0x42` ('B').
   - Byte 2: Frame Type (`0x30` PING, `0x31` PONG, `0xf2` SUBSCRIBE, `0xf3` PUBLISH, `0x15` STREAM).
   - Byte 3-34: 32-byte channel name buffer.
   - Byte 35-38: 4-byte payload length (`UInt32LE`).
   - Byte 39+: Payload.

2. **Offline Queueing**:
   - Packets sent while disconnected MUST be stored in `_queue` array and flushed on reconnect.
