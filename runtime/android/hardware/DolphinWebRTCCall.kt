package io.dolphin.runtime.hardware

import android.content.Context
import android.util.Log

/**
 * 🌊 DolphinWebRTCCall (Legacy Stub)
 * Replaced by TitanTcpClient pure binary TCP protocol.
 */
class DolphinWebRTCCall(private val context: Context) {
    companion object {
        private const val TAG = "DolphinWebRTCCall"
    }

    fun handleCommand(action: String, value: String) {
        Log.i(TAG, "Legacy WebRTC command ignored ($action) — Titan TCP Protocol active.")
    }

    fun close() {}
}
