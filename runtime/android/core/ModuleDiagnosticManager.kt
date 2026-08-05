package io.dolphin.runtime

import android.content.Context
import android.util.Log
import android.widget.Toast
import java.util.concurrent.CopyOnWriteArrayList

/**
 * 🩺 ModuleDiagnosticManager — Central diagnostic wrapper for tracking, line-number extraction, and reporting per-module failures across Mobile Screen & VS Code Terminal.
 */
object ModuleDiagnosticManager {

    data class ModuleFailureRecord(
        val typeOpcode: Int,
        val moduleName: String,
        val fileName: String,
        val lineNumber: Int,
        val errorMessage: String,
        val causeStackTrace: String,
        val timestamp: Long = System.currentTimeMillis()
    )

    private val failedModules = CopyOnWriteArrayList<ModuleFailureRecord>()

    fun recordFailure(typeOpcode: Int, moduleName: String, throwable: Throwable, context: Context? = null) {
        val stackElements = throwable.stackTrace
        val topElement = stackElements.firstOrNull { 
            !it.className.startsWith("java.") && !it.className.startsWith("kotlin.") 
        } ?: stackElements.firstOrNull()

        val fileName = topElement?.fileName ?: "UnknownSource.kt"
        val lineNumber = topElement?.lineNumber ?: -1

        val record = ModuleFailureRecord(
            typeOpcode = typeOpcode,
            moduleName = moduleName,
            fileName = fileName,
            lineNumber = lineNumber,
            errorMessage = throwable.message ?: "Unknown Error",
            causeStackTrace = throwable.stackTraceToString()
        )
        failedModules.add(record)

        // 1. VS Code / Logcat Console Output with File & Line Number
        Log.e("DolphinDiagnostics", "🚨 [MODULE FAILURE] Module: $moduleName (Opcode: 0x${Integer.toHexString(typeOpcode)})")
        Log.e("DolphinDiagnostics", "   📍 Location: $fileName:$lineNumber")
        Log.e("DolphinDiagnostics", "   💥 Error: ${record.errorMessage}")

        // 2. Mobile Toast Notification for Instant Feedback
        if (context != null) {
            try {
                Toast.makeText(context, "⚠️ [$moduleName] Fail at $fileName:$lineNumber", Toast.LENGTH_LONG).show()
            } catch (_e: Exception) {}
        }
    }

    fun getFailedModules(): List<ModuleFailureRecord> = failedModules.toList()

    fun clearDiagnostics() {
        failedModules.clear()
    }
}
