package io.dolphin.runtime

import android.content.Context
import android.util.Log

/**
 * 🌊 DolphinP2PTransfer (Legacy Stub)
 * Direct binary P2P file transfer is handled by TitanTcpClient over port 9092.
 */
object DolphinP2PTransfer {
    private const val TAG = "DolphinP2PTransfer"

    fun handleAction(action: String, value: String) {
        Log.i(TAG, "Legacy P2PTransfer action ($action) — handled via Titan TCP Stream.")
    }
}
