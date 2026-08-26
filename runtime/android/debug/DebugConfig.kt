package io.dolphin.runtime.debug

/**
 * 🛠️ DebugConfig — Global Diagnostic & Tracing Controller for Dolphin Native 2
 * 
 * Set [ENABLE_TRACE] to true during development to print exact 24-byte opcode
 * decodings, padding/margin math, color resolutions, and layout parameter applications
 * across all Kotlin builders.
 * 
 * Set to false in production builds for zero-overhead performance.
 */
object DebugConfig {
    /** Global master switch for native Kotlin tracing */
    var ENABLE_TRACE: Boolean = true

    /** Print raw 24-byte Hex array for each component */
    var LOG_RAW_HEX: Boolean = true

    /** Print detailed background, gradient, and border properties */
    var LOG_STYLES: Boolean = true

    /** Print text typography, font weight, and color bindings */
    var LOG_TEXT_PROPS: Boolean = true

    /** Print layout params (MATCH_PARENT, WRAP_CONTENT, Flex weight) */
    var LOG_LAYOUT_PARAMS: Boolean = true

    /** Print state engine reactive updates */
    var LOG_STATE_ENGINE: Boolean = true

    /** Log tag prefix for Logcat filtering */
    const val LOG_TAG: String = "🐬[TITAN_DEBUG]"
}
