package io.dolphin.runtime

import android.view.View

/**
 * 🌊 AnimationEngine
 * Facade entry point for Dolphin Native animation subsystem.
 * Delegates string animation specs and binary protocol bits to AnimationFactory.
 */
object AnimationEngine {

    fun apply(v: View, animStr: String, parseColor: ((String, Int) -> Int)? = null) {
        AnimationFactory.dispatchStringAnimation(v, animStr, parseColor)
    }

    fun applyBinary(v: View, sig: Int, config: Int) {
        AnimationFactory.dispatchBinaryAnimation(v, sig, config)
    }
}
