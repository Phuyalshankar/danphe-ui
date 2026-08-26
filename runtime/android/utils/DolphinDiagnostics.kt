package io.dolphin.runtime

import android.content.Context
import android.util.Log
import org.json.JSONObject
import java.io.PrintWriter
import java.io.StringWriter

/**
 * 🛡️ DolphinDiagnostics
 * Captures uncaught crashes, validates binary bundles, and forwards debugging reports to PC.
 * Supports offline storage so crashes can be inspected directly on the device.
 */
object DolphinDiagnostics {
    private const val TAG = "DolphinDiagnostics"

    @Volatile private var lastLoadedBundleHash: String = "NO_BUNDLE"

    fun setLastLoadedBundle(bytes: ByteArray) {
        lastLoadedBundleHash = try {
            val md = java.security.MessageDigest.getInstance("MD5")
            val digest = md.digest(bytes)
            digest.joinToString("") { "%02x".format(it) }
        } catch (e: Throwable) {
            "HASH_ERROR:${e.message}"
        }
    }

    fun getCurrentBundleHash(): String {
        return lastLoadedBundleHash
    }

    /**
     * Set up a global uncaught exception handler to redirect all Android runtime crashes to the PC terminal.
     * Also saves the crash details locally in a sandbox file to survive offline build crashes.
     */
    fun setupExceptionHandler(context: Context) {
        val defaultHandler = Thread.getDefaultUncaughtExceptionHandler()
        Thread.setDefaultUncaughtExceptionHandler { thread, throwable ->
            try {
                val sw = StringWriter()
                throwable.printStackTrace(PrintWriter(sw))
                val stackTrace = sw.toString()

                val errJson = JSONObject().apply {
                    put("type", "CRASH")
                    put("timestamp", System.currentTimeMillis())
                    put("thread", thread.name)
                    put("message", throwable.message ?: "No message")
                    put("stackTrace", stackTrace)
                    put("bundleHash", lastLoadedBundleHash)
                }

                // 1. Save crash locally (sandboxed - survives crashes and offline release builds!)
                try {
                    val logFile = java.io.File(context.filesDir, "dolphin_crash_log.txt")
                    logFile.writeText(errJson.toString(), Charsets.UTF_8)
                    Log.i(TAG, "💾 Crash logs stored locally at: ${logFile.absolutePath}")
                } catch (fe: Throwable) {
                    Log.e(TAG, "Failed to save crash log locally: ${fe.message}")
                }

                // 2. Send to PC DevServer (if connected)
                DolphinRuntime.instance?.sendAction("diagnostics:crash", errJson.toString())
                Log.e(TAG, "💥 Uncaught Exception captured: ${throwable.message}")
                
                // Allow a small window for the TCP socket to flush the log before crash exits
                Thread.sleep(800)
            } catch (e: Throwable) {
                Log.e(TAG, "Failed to send crash diagnostics: ${e.message}")
            }

            // Let default Android system handle the crash
            defaultHandler?.uncaughtException(thread, throwable)
        }
        Log.i(TAG, "✅ Uncaught Exception Handler registered successfully.")
    }

    /**
     * Checks if a crash log exists from the previous run (e.g. offline release build crash).
     * If found, shows a native diagnostic dialog on the screen to let the developer see the crash logs directly on the phone!
     */
    fun checkAndShowCrashDialog(context: Context) {
        try {
            val logFile = java.io.File(context.filesDir, "dolphin_crash_log.txt")
            if (logFile.exists()) {
                val rawContent = logFile.readText(Charsets.UTF_8)
                val errJson = JSONObject(rawContent)
                
                val message = errJson.optString("message")
                val stackTrace = errJson.optString("stackTrace")
                val threadName = errJson.optString("thread")
                val timestamp = errJson.optLong("timestamp")
                val bundleHash = errJson.optString("bundleHash", "Unknown")
                
                val dateStr = java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss", java.util.Locale.getDefault())
                    .format(java.util.Date(timestamp))

                // Show native Android AlertDialog on Main Looper
                android.os.Handler(android.os.Looper.getMainLooper()).post {
                    try {
                        android.app.AlertDialog.Builder(context)
                            .setTitle("🌊 Dolphin Diagnostics (Last App Crash)")
                            .setMessage(
                                "The application crashed on $dateStr (Thread: $threadName).\n" +
                                "Bundle Hash: $bundleHash\n\n" +
                                "Error: $message\n\n" +
                                "Click 'VIEW DETAILS' to inspect the stack trace."
                            )
                            .setPositiveButton("VIEW DETAILS") { _, _ ->
                                // Show full scrollable stack trace
                                val scrollView = android.widget.ScrollView(context)
                                val textView = android.widget.TextView(context).apply {
                                    text = stackTrace
                                    textSize = 11f
                                    setPadding(32, 32, 32, 32)
                                    setTextIsSelectable(true)
                                    typeface = android.graphics.Typeface.MONOSPACE
                                }
                                scrollView.addView(textView)

                                android.app.AlertDialog.Builder(context)
                                    .setTitle("💥 Stack Trace Details")
                                    .setView(scrollView)
                                    .setPositiveButton("OK", null)
                                    .setNeutralButton("DELETE LOG") { _, _ ->
                                        logFile.delete()
                                    }
                                    .show()
                            }
                            .setNegativeButton("DISMISS", null)
                            .setNeutralButton("DELETE LOG") { _, _ ->
                                logFile.delete()
                            }
                            .show()
                    } catch (dialogEx: Throwable) {
                        Log.e(TAG, "Failed to render crash dialog: ${dialogEx.message}")
                    }
                }
            }
        } catch (e: Throwable) {
            Log.e(TAG, "Error checking crash logs: ${e.message}")
        }
    }

    /**
     * Run strict validation on the compiled binary bundle.
     */
    fun validateBundle(bytes: ByteArray): JSONObject {
        val result = JSONObject()
        val errors = org.json.JSONArray()
        
        try {
            if (bytes.size < 24) {
                errors.put("Bundle size (${bytes.size} bytes) is too small to contain valid headers.")
            } else {
                val magic = bytes.slice(0..3).map { it.toChar() }.joinToString("")
                if (magic != "DOLP") {
                    errors.put("Invalid magic signature: '$magic' (expected 'DOLP'). Code might be corrupted.")
                }
                
                val version = (bytes[4].toInt() and 0xFF) or ((bytes[5].toInt() and 0xFF) shl 8)
                val scrCount = (bytes[8].toInt() and 0xFF) or ((bytes[9].toInt() and 0xFF) shl 8)
                val compCount = (bytes[10].toInt() and 0xFF) or ((bytes[11].toInt() and 0xFF) shl 8)

                var cursor = 20 // HEADER_SIZE
                var screensOffsetVerified = true

                // Check screens
                for (it in 0 until scrCount) {
                    if (cursor >= bytes.size) {
                        errors.put("EOF reached before reading metadata of screen #$it")
                        screensOffsetVerified = false
                        break
                    }
                    val nameLen = bytes[cursor].toInt() and 0xFF
                    cursor++
                    if (cursor + nameLen > bytes.size) {
                        errors.put("EOF reading screen name of index #$it (length $nameLen)")
                        screensOffsetVerified = false
                        break
                    }
                    cursor += nameLen // Name
                    if (cursor + 8 > bytes.size) {
                        errors.put("EOF reading screen #$it size hints")
                        screensOffsetVerified = false
                        break
                    }
                    // Skip compOff (2), compCnt (2)
                    cursor += 4
                    val dataLen = ((bytes[cursor].toInt() and 0xFF)) or 
                                  ((bytes[cursor+1].toInt() and 0xFF) shl 8) or 
                                  ((bytes[cursor+2].toInt() and 0xFF) shl 16) or 
                                  ((bytes[cursor+3].toInt() and 0xFF) shl 24)
                    cursor += 4
                    if (cursor + dataLen > bytes.size) {
                        errors.put("EOF reading screen #$it data payload (length $dataLen)")
                        screensOffsetVerified = false
                        break
                    }
                    cursor += dataLen
                }

                if (screensOffsetVerified) {
                    // Check components
                    for (i in 0 until compCount) {
                        if (cursor + 24 > bytes.size) {
                            errors.put("EOF reading component index #$i (expected $compCount components, parsed only $i before EOF)")
                            break
                        }
                        val comp = bytes.copyOfRange(cursor, cursor + 24)
                        cursor += 24
                        
                        // Validate component opcode
                        val typeByte = comp[1].toInt() and 0xFF
                        if (typeByte == 0) {
                            errors.put("Component #$i has empty opcode: 0x0")
                        }


                    }
                }
            }
        } catch (e: Throwable) {
            errors.put("Exception during validation: ${e.message}")
        }

        result.put("success", errors.length() == 0)
        result.put("errors", errors)
        return result
    }

    /**
     * Validates and automatically forwards errors to the PC console.
     */
    fun reportValidation(bytes: ByteArray) {
        val report = validateBundle(bytes)
        if (!report.optBoolean("success")) {
            DolphinRuntime.instance?.sendAction("diagnostics:validation_fail", report.toString())
        }
    }

    /**
     * Streams Android logcat output directly to the PC DevServer over WebSocket/TCP.
     */
    fun streamLogcatToPC(linesCount: Int = 200) {
        kotlin.concurrent.thread {
            try {
                val process = Runtime.getRuntime().exec(arrayOf("logcat", "-d", "-b", "main", "-v", "time"))
                val reader = java.io.BufferedReader(java.io.InputStreamReader(process.inputStream))
                val sb = StringBuilder()
                var line: String?
                while (reader.readLine().also { line = it } != null) {
                    if (!line.isNullOrEmpty()) {
                        sb.append(line).append("\n")
                    }
                }
                val logStr = sb.toString()
                if (logStr.isNotEmpty()) {
                    DolphinRuntime.instance?.sendAction("diagnostics:logcat", logStr)
                }
            } catch (e: Throwable) {
                Log.e(TAG, "Logcat read failed: ${e.message}")
            }
        }
    }
}
