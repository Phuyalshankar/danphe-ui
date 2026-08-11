package io.dolphin.runtime

import android.util.Log
import org.json.JSONObject

/**
 * 🚨 ErrorReceiver
 * Captures JavaScript ErrorPipeline errors broadcasted via HotPatch/WebSocket
 * and prints them cleanly to the Android Logcat.
 */
class ErrorReceiver {
    companion object {
        data class ErrorEntry(
            val id: Long,
            val file: String,
            val function: String,
            val message: String,
            val stack: String
        )

        private val errorLog = mutableListOf<ErrorEntry>()

        fun onError(errorData: String) {
            try {
                val json = JSONObject(errorData)
                val entry = ErrorEntry(
                    id = json.optLong("id", System.currentTimeMillis()),
                    file = json.optString("file", "unknown"),
                    function = json.optString("function", "unknown"),
                    message = json.optString("message", "Unknown Error"),
                    stack = json.optString("stack", "")
                )

                errorLog.add(entry)
                Log.e("ErrorPipeline", "❌ \${entry.file} -> \${entry.function}: \${entry.message}")
                Log.e("ErrorBreakPoint", "💥 Break at: \${entry.file} -> \${entry.function}()")
            } catch (e: Exception) {
                Log.e("ErrorPipeline", "Failed to parse errorData: \$errorData", e)
            }
        }

        fun getErrors(): List<ErrorEntry> = errorLog
        fun clearErrors() = errorLog.clear()
    }
}
