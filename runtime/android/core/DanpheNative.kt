package io.dolphin.runtime

import android.graphics.Bitmap

/**
 * 🐬 DanpheNative - C++ Native Vector & GPU Math Engine Bridge
 */
object DanpheNative {
    private var isLoaded = false

    init {
        try {
            System.loadLibrary("danphe_vector")
            isLoaded = true
        } catch (e: Throwable) {
            isLoaded = false
        }
    }

    fun isAvailable(): Boolean = isLoaded

    external fun render7Segment(
        bitmap: Bitmap,
        text: String,
        onColor: Int,
        offColor: Int
    )
}
