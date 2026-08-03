package io.dolphin.runtime

import android.util.Log

private const val TAG = "BinaryParser"

// Protocol constants — must mirror DolphinBinaryProtocol.js exactly
private const val MAGIC          = "DOLP"
private const val HEADER_SIZE    = 20
private const val TITAN_COMP_LEN = 16
private const val TITAN_SIG_MASK = 0x0F.toByte() // Only validate bits 0-3
private const val TITAN_SIG      = 0x0E.toByte() // Bits 4-7 are for animation

/**
 * DolphinBundle — in-memory representation of a parsed .dolp file
 */
data class DolphinBundle(
    val magic        : String,
    val version      : Int,
    val flags        : Int,
    val screens      : MutableList<DolphinScreen>,
    val components   : MutableList<ByteArray>,
    val entryIndex   : Int = 0,
    val drawerIndex  : Int = 0xFFFF,
    val checksumValid: Boolean
)

/**
 * DolphinScreen — one screen inside the bundle
 */
data class DolphinScreen(
    val name          : String,
    val componentOffset: Int,
    val componentCount : Int,
    val rawData        : ByteArray
)

/** Patch a screen's data in a live bundle */
fun DolphinBundle.patchScreen(name: String, compBytes: ByteArray, data: ByteArray) {
    val idx = screens.indexOfFirst { it.name == name }
    if (idx >= 0) {
        val s = screens[idx]
        val newCount = compBytes.size / 16
        val oldComponentsSize = components.size
        
        // Append all new components to the end of the global components list
        for (i in 0 until newCount) {
            components.add(compBytes.copyOfRange(i * 16, (i + 1) * 16))
        }
        
        // Update the screen metadata with the new offset and count
        screens[idx] = s.copy(
            componentOffset = oldComponentsSize,
            componentCount = newCount,
            rawData = data
        )
    }
}

/** Patch a specific Titan component by index */
fun DolphinBundle.patchComponent(index: Int, titanBinary: ByteArray) {
    if (index in components.indices && titanBinary.size == TITAN_COMP_LEN) {
        components[index] = titanBinary
    }
}

/**
 * 📦 BinaryParser
 *
 * Pure Kotlin binary parser for .dolp bundle files.
 * Reads byte-by-byte with zero reflection, zero JSON, zero WebView.
 *
 * Implements the exact same format as DolphinBinaryProtocol.js (Node.js).
 */
class BinaryParser {

    /**
     * Parse a raw .dolp byte array into a DolphinBundle.
     * @throws IllegalArgumentException on invalid format.
     */
    fun parse(bytes: ByteArray): DolphinBundle {
        require(bytes.size >= HEADER_SIZE + 4) {
            "Bundle too small: ${bytes.size} bytes (minimum ${HEADER_SIZE + 4})"
        }

        var cursor = 0

        // ── MAGIC ──────────────────────────────────────
        val magic = bytes.slice(0..3).map { it.toChar() }.joinToString("")
        require(magic == MAGIC) { "Invalid magic: \"$magic\" (expected \"$MAGIC\")" }
        cursor += 4

        // ── VERSION (uint16 LE) ────────────────────────
        val version = readUInt16LE(bytes, cursor); cursor += 2

        // ── FLAGS (uint16 LE) ──────────────────────────
        val flags = readUInt16LE(bytes, cursor); cursor += 2

        // ── SCREEN COUNT (uint16 LE) ───────────────────
        val scrCount = readUInt16LE(bytes, cursor); cursor += 2

        // ── COMPONENT COUNT (uint16 LE) ────────────────
        val compCount = readUInt16LE(bytes, cursor); cursor += 2

        // ── ENTRY SCREEN INDEX (uint16 LE) ─────────────
        val entryIdx = readUInt16LE(bytes, cursor); cursor += 2

        // ── DRAWER SCREEN INDEX (uint16 LE) ────────────
        val drawerIdx = readUInt16LE(bytes, cursor); cursor += 2

        // ── RESERVED 4 bytes ──────────────────────────
        cursor += 4

        Log.d(TAG, "Header: magic=$magic ver=0x${version.toString(16)} screens=$scrCount components=$compCount entry=$entryIdx")

        // ── SCREEN BLOCKS ──────────────────────────────
        val screens = mutableListOf<DolphinScreen>()
        repeat(scrCount) {
            val nameLen = bytes[cursor++].toInt() and 0xFF
            val name    = String(bytes, cursor, nameLen, Charsets.UTF_8); cursor += nameLen
            val compOff = readUInt16LE(bytes, cursor); cursor += 2
            val compCnt = readUInt16LE(bytes, cursor); cursor += 2
            val dataLen = readUInt32LE(bytes, cursor); cursor += 4
            val data    = bytes.copyOfRange(cursor, cursor + dataLen); cursor += dataLen

            Log.d(TAG, "  Screen[$it]: name=$name compOff=$compOff compCnt=$compCnt dataLen=$dataLen")
            screens.add(DolphinScreen(name, compOff, compCnt, data))
        }

        // ── TITAN COMPONENT TABLE ──────────────────────
        val components = mutableListOf<ByteArray>()
        repeat(compCount) {
            require(cursor + TITAN_COMP_LEN <= bytes.size - 4) {
                "Unexpected end of bundle reading component $it"
            }
            val comp = bytes.copyOfRange(cursor, cursor + TITAN_COMP_LEN)
            // Validate Titan signature (bits 1, 2, 3)
            if ((comp[15].toInt() and 0x0E).toByte() != TITAN_SIG) {
                Log.w(TAG, "Component[$it] has invalid signature bits: 0x${(comp[15].toInt() and 0x0E).toString(16)}")
            }
            components.add(comp)
            cursor += TITAN_COMP_LEN
        }

        // ── CHECKSUM VALIDATION ────────────────────────
        val bodyEnd   = bytes.size - 4
        val expected  = readUInt32LE(bytes, bodyEnd).toLong() and 0xFFFFFFFFL
        val actual    = xor32(bytes, 0, bodyEnd).toLong() and 0xFFFFFFFFL
        val checksumValid = expected == actual
        if (!checksumValid) {
            Log.w(TAG, "Checksum mismatch: expected=0x${expected.toString(16)} actual=0x${actual.toString(16)}")
        }

        return DolphinBundle(
            magic         = magic,
            version       = version,
            flags         = flags,
            screens       = screens,
            components    = components,
            entryIndex    = entryIdx,
            drawerIndex   = drawerIdx,
            checksumValid = checksumValid
        )
    }

    // ─────────────────────────────────────────────────────
    // HOT PATCH MESSAGE PARSING
    // ─────────────────────────────────────────────────────

    /**
     * Parse a hot-patch message from the dev server.
     * Format: <CMD(1)> <PAYLOAD_LEN(4 LE)> <PAYLOAD...>
     *
     * @return Pair<cmd: Int, payload: ByteArray>
     */
    fun parseHotPatchMessage(bytes: ByteArray): Pair<Int, ByteArray> {
        require(bytes.size >= 5) { "Message too short: ${bytes.size}" }
        val cmd    = bytes[0].toInt() and 0xFF
        val payLen = readUInt32LE(bytes, 1)
        require(bytes.size >= 5 + payLen) { "Incomplete message: need ${5 + payLen}, got ${bytes.size}" }
        val payload = bytes.copyOfRange(5, 5 + payLen)
        return Pair(cmd, payload)
    }

    /**
     * Build an ACK message to send back to dev server.
     */
    fun buildAck(info: String = "ok"): ByteArray {
        val infoBytes = info.toByteArray(Charsets.UTF_8)
        val msg = ByteArray(1 + 4 + infoBytes.size)
        msg[0] = 0x06 // CMD.ACK
        writeUInt32LE(msg, 1, infoBytes.size)
        infoBytes.copyInto(msg, 5)
        return msg
    }

    /**
     * Build a PONG message.
     */
    fun buildPong(payload: ByteArray = byteArrayOf()): ByteArray {
        val msg = ByteArray(1 + 4 + payload.size)
        msg[0] = 0x05 // CMD.PONG
        writeUInt32LE(msg, 1, payload.size)
        payload.copyInto(msg, 5)
        return msg
    }

    // ─────────────────────────────────────────────────────
    // BINARY UTILITIES
    // ─────────────────────────────────────────────────────

    private fun readUInt16LE(bytes: ByteArray, offset: Int): Int {
        return (bytes[offset].toInt() and 0xFF) or
               ((bytes[offset + 1].toInt() and 0xFF) shl 8)
    }

    private fun readUInt32LE(bytes: ByteArray, offset: Int): Int {
        return (bytes[offset].toInt() and 0xFF) or
               ((bytes[offset + 1].toInt() and 0xFF) shl 8) or
               ((bytes[offset + 2].toInt() and 0xFF) shl 16) or
               ((bytes[offset + 3].toInt() and 0xFF) shl 24)
    }

    private fun writeUInt32LE(bytes: ByteArray, offset: Int, value: Int) {
        bytes[offset]     = (value and 0xFF).toByte()
        bytes[offset + 1] = ((value shr 8) and 0xFF).toByte()
        bytes[offset + 2] = ((value shr 16) and 0xFF).toByte()
        bytes[offset + 3] = ((value shr 24) and 0xFF).toByte()
    }

    /** XOR-32 checksum — mirrors Node.js _xor32() exactly */
    private fun xor32(bytes: ByteArray, start: Int, end: Int): Int {
        var checksum = 0
        var i = start
        while (i + 3 < end) {
            checksum = checksum xor readUInt32LE(bytes, i)
            i += 4
        }
        val rem = (end - start) % 4
        if (rem > 0) {
            val tail = ByteArray(4)
            bytes.copyInto(tail, 0, end - rem, end)
            checksum = checksum xor readUInt32LE(tail, 0)
        }
        return checksum
    }
}