package io.dolphin.runtime.hardware.titanv2

/**
 * 🚀 TITAN PROTOCOL v2 — NVR Edition
 * ════════════════════════════════════════════════════════
 *
 * Designed for:
 *   - Multi-camera NVR streaming
 *   - Low-latency (80–150ms target)
 *   - Frame fragmentation support (large JPEG/H264 frames)
 *   - Multi-stream multiplexing (up to 255 cameras per connection)
 *   - I-frame / P-frame awareness
 *   - Real checksum (CRC8)
 *   - Timestamps for A/V sync
 *
 * HEADER FORMAT (28 bytes):
 * ┌────────────────────────────────────────────────────────┐
 * │ Offset │ Size │ Field       │ Description              │
 * ├────────┼──────┼─────────────┼──────────────────────────┤
 * │  0     │  2   │ Signature   │ 0x5432 ('T2')            │
 * │  2     │  1   │ Version     │ 0x02                     │
 * │  3     │  1   │ CmdType     │ Command type             │
 * │  4     │  4   │ SenderExt   │ Sender extension number  │
 * │  8     │  4   │ TargetExt   │ Target extension number  │
 * │  12    │  4   │ PayloadLen  │ Payload length in bytes  │
 * │  16    │  4   │ SeqNo       │ Packet sequence number   │
 * │  20    │  2   │ SessionId   │ Call/Stream session ID   │
 * │  22    │  1   │ StreamId    │ Camera ID (0–255)        │
 * │  23    │  1   │ Flags       │ See FLAG_* constants      │
 * │  24    │  1   │ Checksum    │ CRC8 of header[0..23]   │
 * │  25    │  1   │ Reserved    │ 0x00 (future use)        │
 * │  26    │  2   │ Timestamp   │ Relative ms (0–65535)    │
 * └────────────────────────────────────────────────────────┘
 *
 * vs Titan v1 (24 bytes): +4 bytes = StreamId + Checksum + Reserved + Timestamp
 *
 * NOT IN USE YET — Reference implementation for NVR v2
 */

object TitanV2Protocol {

    // ── Signature ───────────────────────────────────────
    const val SIGNATURE: Short = 0x5432.toShort() // 'T2'
    const val VERSION: Byte    = 0x02
    const val HEADER_SIZE: Int = 28

    // ── Command Types ────────────────────────────────────
    const val CMD_REGISTER      = 0x08  // Extension register
    const val CMD_REGISTER_ACK  = 0x09  // Register confirmation

    // ── Call Signaling ───────────────────────────────────
    const val CMD_INVITE        = 0x10  // Call invite
    const val CMD_ACCEPT        = 0x11  // Call accepted
    const val CMD_REJECT        = 0x12  // Call rejected
    const val CMD_HANGUP        = 0x13  // Call ended

    // ── Media Streaming ──────────────────────────────────
    const val CMD_AUDIO_FRAME   = 0x14  // PCM audio chunk
    const val CMD_VIDEO_FRAME   = 0x15  // JPEG/H264 video frame (or fragment)
    const val CMD_VIDEO_KEYFRAME = 0x16 // H264 IDR/I-frame (request/notify)

    // ── NVR Specific ─────────────────────────────────────
    const val CMD_NVR_STREAM_START  = 0x20  // Start camera stream
    const val CMD_NVR_STREAM_STOP   = 0x21  // Stop camera stream
    const val CMD_NVR_RECORD_START  = 0x22  // Start recording to disk
    const val CMD_NVR_RECORD_STOP   = 0x23  // Stop recording
    const val CMD_NVR_MOTION_EVENT  = 0x24  // Motion detected alert
    const val CMD_NVR_SNAPSHOT      = 0x25  // Request/send snapshot
    const val CMD_NVR_STATUS        = 0x26  // Camera/recording status

    // ── Chat ─────────────────────────────────────────────
    const val CMD_CHAT_MESSAGE  = 0x30  // Text message relay

    // ── Heartbeat ────────────────────────────────────────
    const val CMD_HEARTBEAT     = 0x40
    const val CMD_HEARTBEAT_ACK = 0x41

    // ── Error ────────────────────────────────────────────
    const val CMD_ERROR         = 0xFF  // Error response

    // ── Flags (bit field) ─────────────────────────────────
    /**
     * Bit 0: IS_KEYFRAME   — This video frame is an I-frame/IDR frame
     * Bit 1: IS_FRAGMENT   — This packet is a fragment of a larger frame
     * Bit 2: IS_LAST_FRAG  — This is the last fragment (reassemble now)
     * Bit 3: NEEDS_ACK     — Sender expects acknowledgment
     * Bit 4: IS_ENCRYPTED  — Payload is AES-128-GCM encrypted
     * Bit 5: IS_BROADCAST  — Send to all registered extensions
     * Bit 6: LOW_LATENCY   — Prioritize delivery over reliability
     * Bit 7: RESERVED
     */
    const val FLAG_IS_KEYFRAME   = 0x01
    const val FLAG_IS_FRAGMENT   = 0x02
    const val FLAG_IS_LAST_FRAG  = 0x04
    const val FLAG_NEEDS_ACK     = 0x08
    const val FLAG_IS_ENCRYPTED  = 0x10
    const val FLAG_IS_BROADCAST  = 0x20
    const val FLAG_LOW_LATENCY   = 0x40

    // ── Stream IDs ───────────────────────────────────────
    const val STREAM_AUDIO       = 0x00  // Main audio stream
    const val STREAM_CAM_1       = 0x01  // Camera 1
    const val STREAM_CAM_2       = 0x02  // Camera 2
    const val STREAM_CAM_3       = 0x03  // Camera 3
    const val STREAM_CAM_4       = 0x04  // Camera 4
    // ... up to 0xFF (255 cameras)

    // ── Max Fragment Size ────────────────────────────────
    // TCP optimal chunk size — avoids Nagle algorithm delay
    const val MAX_FRAGMENT_SIZE  = 16_384  // 16KB per fragment

    // ── CRC8 Checksum ────────────────────────────────────
    // Polynomial: 0x07 (CRC-8/SMBUS)
    fun crc8(data: ByteArray, length: Int): Byte {
        var crc = 0
        for (i in 0 until length) {
            crc = crc xor (data[i].toInt() and 0xFF)
            repeat(8) {
                crc = if ((crc and 0x80) != 0) ((crc shl 1) xor 0x07) and 0xFF
                else (crc shl 1) and 0xFF
            }
        }
        return crc.toByte()
    }
}
