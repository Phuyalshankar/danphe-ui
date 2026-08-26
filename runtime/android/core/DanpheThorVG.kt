package io.dolphin.runtime

import android.graphics.Bitmap

/**
 * ⚡ DanpheThorVG — Samsung ThorVG Native C++ Hardware-Accelerated Vector Engine
 */
object DanpheThorVG {
    private var isLoaded = false

    init {
        try {
            System.loadLibrary("danphe_vector")
            isLoaded = true
            android.util.Log.i("DanpheThorVG", "⚡ Samsung ThorVG Native C++ Engine loaded successfully")
        } catch (e: Throwable) {
            android.util.Log.w("DanpheThorVG", "ThorVG native library not loaded (${e.message}), utilizing Android GPU Vector Path Engine")
            isLoaded = false
        }
    }

    fun isAvailable(): Boolean = isLoaded

    private external fun nativeRenderSvg(
        bitmap: Bitmap,
        svgStr: String
    ): Boolean

    fun renderSvg(bitmap: Bitmap, svgStr: String): Boolean {
        if (!isLoaded) return false
        return try {
            nativeRenderSvg(bitmap, svgStr)
        } catch (e: Throwable) {
            android.util.Log.w("DanpheThorVG", "Native render failed: ${e.message}")
            false
        }
    }
}
