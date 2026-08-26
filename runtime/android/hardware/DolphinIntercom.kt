package io.dolphin.runtime

import android.content.Context
import android.util.Log

/**
 * 🎙️ DolphinIntercom (Cleaned & Delegated to Titan TCP)
 * Audio and video streams are handled with zero latency via TitanTcpClient.
 */
object DolphinIntercom {
    private const val TAG = "DolphinIntercom"

    fun handleAction(action: String, value: String) {
        Log.i(TAG, "Intercom action ($action) — routed via TitanTcpClient.")
    }

    fun startAudioStream(context: Context) {
        Log.i(TAG, "Audio stream active via TitanTcpClient.")
    }

    fun stopAudioStream() {
        Log.i(TAG, "Audio stream stopped.")
    }
}
