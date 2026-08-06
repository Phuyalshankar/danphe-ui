package io.dolphin.runtime

import android.util.Log
import android.view.View

/**
 * ⚡ DolphinEventDebugger
 * Realtime Event & Callback Pipeline Diagnostics (1-Second Instant Event Tracer)
 * Traces: User Tap ➔ Action Extraction ➔ State Engine ➔ Target Subsystem Execution.
 */
object DolphinEventDebugger {

    private const val TAG = "⚡EVENT_DEBUGGER"

    data class EventTrace(
        val timestamp: Long = System.currentTimeMillis(),
        val viewType: String,
        val viewId: String,
        val rawAction: String,
        val targetSubsystem: String,
        val status: String,
        val details: String = ""
    )

    private val eventHistory = mutableListOf<EventTrace>()

    fun trace(view: View, action: String, subsystem: String, status: String, details: String = "") {
        val viewType = view.javaClass.simpleName
        val viewId = if (view.id != View.NO_ID) "id/0x${Integer.toHexString(view.id)}" else "auto_${view.hashCode()}"
        val trace = EventTrace(
            viewType = viewType,
            viewId = viewId,
            rawAction = action,
            targetSubsystem = subsystem,
            status = status,
            details = details
        )

        synchronized(eventHistory) {
            if (eventHistory.size >= 100) eventHistory.removeAt(0)
            eventHistory.add(trace)
        }

        val formattedLog = "🎯 [EVENT_FLOW] View: $viewType ($viewId) | Action: \"$action\" ➔ Subsystem: [$subsystem] ➔ Status: [$status] ${if (details.isNotEmpty()) "($details)" else ""}"
        Log.i(TAG, formattedLog)
    }

    fun getHistory(): List<EventTrace> {
        synchronized(eventHistory) {
            return eventHistory.toList()
        }
    }
}
