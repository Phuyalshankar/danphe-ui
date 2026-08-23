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
            android.util.Log.w("DanpheThorVG", "ThorVG native library not loaded: ${e.message}")
            isLoaded = false
        }
    }

    fun isAvailable(): Boolean = isLoaded

    external fun renderSvg(
        bitmap: Bitmap,
        svgStr: String
    ): Boolean
}
