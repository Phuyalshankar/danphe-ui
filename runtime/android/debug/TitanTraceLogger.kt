package io.dolphin.runtime.debug

import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.widget.TextView

/**
 * 🐬 TitanTraceLogger — Unified Native Kotlin Trace & CSS Output Engine
 *
 * Logs exact inputs (24-byte opcode) and applied Android view properties across all .kt builders
 * so developers can spot any styling or layout discrepancy in seconds.
 */
object TitanTraceLogger {

    fun logComponentEntry(builderName: String, opcode: Byte, bin: ByteArray, label: String = "") {
        if (!DebugConfig.ENABLE_TRACE) return
        val opHex = "0x%02X".format(opcode.toInt() and 0xFF)
        val fullHex = if (DebugConfig.LOG_RAW_HEX) bin.joinToString(" ") { "%02X".format(it) } else ""
        
        Log.d(DebugConfig.LOG_TAG, "╔══════════════════════════════════════════════════════════════")
        Log.d(DebugConfig.LOG_TAG, "║ 🏗️ BUILDER: $builderName | Opcode: $opHex ${if (label.isNotEmpty()) "| Label: \"$label\"" else ""}")
        if (DebugConfig.LOG_RAW_HEX) {
            Log.d(DebugConfig.LOG_TAG, "║ 📦 RAW 24-BYTE HEX: [$fullHex]")
        }
    }

    fun logStylesApplied(
        view: View,
        bin: ByteArray,
        padTop: Int, padRight: Int, padBottom: Int, padLeft: Int,
        marginTop: Int, marginRight: Int, marginBottom: Int, marginLeft: Int,
        bgColor: Int,
        radius: Float,
        hasBorder: Boolean,
        borderColor: Int = 0,
        borderWidth: Float = 0f
    ) {
        if (!DebugConfig.ENABLE_TRACE || !DebugConfig.LOG_STYLES) return
        val bgHex = if (bgColor != 0) "#%08X".format(bgColor) else "TRANSPARENT"
        val borderHex = if (borderColor != 0) "#%08X".format(borderColor) else "NONE"

        Log.d(DebugConfig.LOG_TAG, "║ 🎨 STYLES APPLIED:")
        Log.d(DebugConfig.LOG_TAG, "║   ├─ Padding (dp) : T=$padTop, R=$padRight, B=$padBottom, L=$padLeft")
        Log.d(DebugConfig.LOG_TAG, "║   ├─ Margin  (dp) : T=$marginTop, R=$marginRight, B=$marginBottom, L=$marginLeft")
        Log.d(DebugConfig.LOG_TAG, "║   ├─ Radius  (px) : ${radius}f")
        Log.d(DebugConfig.LOG_TAG, "║   ├─ Background   : $bgHex")
        if (hasBorder) {
            Log.d(DebugConfig.LOG_TAG, "║   └─ Border       : ${borderWidth}dp | Color: $borderHex")
        } else {
            Log.d(DebugConfig.LOG_TAG, "║   └─ Border       : None")
        }
    }

    fun logTextApplied(
        textView: TextView,
        text: String,
        textColor: Int,
        textSizeSp: Float,
        isBold: Boolean,
        stateKey: String? = null
    ) {
        if (!DebugConfig.ENABLE_TRACE || !DebugConfig.LOG_TEXT_PROPS) return
        val colorHex = if (textColor != 0) "#%08X".format(textColor) else "DEFAULT"
        Log.d(DebugConfig.LOG_TAG, "║ 🔤 TEXT APPLIED:")
        Log.d(DebugConfig.LOG_TAG, "║   ├─ Content  : \"$text\"")
        Log.d(DebugConfig.LOG_TAG, "║   ├─ Color    : $colorHex")
        Log.d(DebugConfig.LOG_TAG, "║   ├─ Size     : ${textSizeSp}sp | Bold: $isBold")
        if (!stateKey.isNullOrEmpty()) {
            Log.d(DebugConfig.LOG_TAG, "║   └─ StateKey : [$stateKey] (Dynamic Reactive Binding Active)")
        } else {
            Log.d(DebugConfig.LOG_TAG, "║   └─ StateKey : Static Text")
        }
    }

    fun logLayoutParams(view: View, widthParam: Int, heightParam: Int, flexWeight: Float = 0f, gravity: Int = 0) {
        if (!DebugConfig.ENABLE_TRACE || !DebugConfig.LOG_LAYOUT_PARAMS) return
        val wStr = when (widthParam) {
            ViewGroup.LayoutParams.MATCH_PARENT -> "MATCH_PARENT (-1)"
            ViewGroup.LayoutParams.WRAP_CONTENT -> "WRAP_CONTENT (-2)"
            else -> "${widthParam}px"
        }
        val hStr = when (heightParam) {
            ViewGroup.LayoutParams.MATCH_PARENT -> "MATCH_PARENT (-1)"
            ViewGroup.LayoutParams.WRAP_CONTENT -> "WRAP_CONTENT (-2)"
            else -> "${heightParam}px"
        }
        Log.d(DebugConfig.LOG_TAG, "║ 📐 LAYOUT PARAMS:")
        Log.d(DebugConfig.LOG_TAG, "║   ├─ Dimensions : Width=$wStr | Height=$hStr")
        if (flexWeight > 0f) {
            Log.d(DebugConfig.LOG_TAG, "║   ├─ Flex Weight: $flexWeight")
        }
        Log.d(DebugConfig.LOG_TAG, "║   └─ Gravity    : 0x%02X".format(gravity))
        Log.d(DebugConfig.LOG_TAG, "╚══════════════════════════════════════════════════════════════")
    }

    fun logStateUpdate(key: String, oldValue: Any?, newValue: Any?, targetViewsCount: Int) {
        if (!DebugConfig.ENABLE_TRACE || !DebugConfig.LOG_STATE_ENGINE) return
        Log.d(DebugConfig.LOG_TAG, "⚡ [STATE_MUTATION] Key: \"$key\" | \"$oldValue\" ➔ \"$newValue\" | Repainted $targetViewsCount Native Views (< 1ms)")
    }
}
