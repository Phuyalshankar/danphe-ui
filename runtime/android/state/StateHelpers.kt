package io.dolphin.runtime

import android.view.View
import android.view.ViewGroup
import android.view.animation.AccelerateDecelerateInterpolator
import android.view.animation.AccelerateInterpolator
import android.view.animation.DecelerateInterpolator
import android.view.animation.LinearInterpolator
import kotlin.math.abs
import kotlin.math.floor

/**
 * 🐬 StateHelpers - Helper functions for DolphinStateEngine & StateBinder
 * High-performance math, DP conversion, type coercion, and animation interpolators.
 */
object StateHelpers {

    fun interpolatorFor(ease: DolphinStateEngine.AnimEase) = when (ease) {
        DolphinStateEngine.AnimEase.LINEAR -> LinearInterpolator()
        DolphinStateEngine.AnimEase.IN -> AccelerateInterpolator()
        DolphinStateEngine.AnimEase.OUT -> DecelerateInterpolator()
        DolphinStateEngine.AnimEase.IN_OUT -> AccelerateDecelerateInterpolator()
    }

    fun shouldAnimate(property: DolphinStateEngine.Property, anim: DolphinStateEngine.AnimSpec?): Boolean {
        if (anim == null) return false
        if (anim.durationMs <= 0) return false

        val isTransformProp = when (property) {
            DolphinStateEngine.Property.TRANSLATE_X, DolphinStateEngine.Property.TRANSLATE_Y,
            DolphinStateEngine.Property.SCALE, DolphinStateEngine.Property.SCALE_X, DolphinStateEngine.Property.SCALE_Y,
            DolphinStateEngine.Property.ROTATION -> true
            else -> false
        }
        val isOpacityProp = property == DolphinStateEngine.Property.ALPHA

        return when (anim.transition) {
            DolphinStateEngine.AnimTransition.NONE -> false
            DolphinStateEngine.AnimTransition.OPACITY -> isOpacityProp
            DolphinStateEngine.AnimTransition.TRANSFORM -> isTransformProp
            DolphinStateEngine.AnimTransition.ALL -> isTransformProp || isOpacityProp
        }
    }

    fun updateLayout(view: View, updater: (ViewGroup.LayoutParams) -> Unit) {
        val existing = view.layoutParams
        val lp = existing ?: ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        )
        val wBefore = lp.width
        val hBefore = lp.height
        updater(lp)
        view.layoutParams = lp
        if (lp.width != wBefore || lp.height != hBefore) {
            view.requestLayout()
        }
    }

    fun toLayoutDimension(view: View, value: Any): Int {
        val numeric = toNumber(value).toInt()
        return when {
            numeric == -1 -> ViewGroup.LayoutParams.MATCH_PARENT
            numeric == -2 -> ViewGroup.LayoutParams.WRAP_CONTENT
            else -> dp(view, numeric)
        }
    }

    fun toScale(value: Any): Float {
        val numeric = toNumber(value)
        return when {
            numeric == 0.0 -> 0f
            abs(numeric) > 10.0 -> (numeric / 100.0).toFloat()
            else -> numeric.toFloat()
        }
    }

    fun dp(view: View, value: Int): Int {
        return (value * view.resources.displayMetrics.density).toInt()
    }

    fun toNumber(value: Any): Double = when (value) {
        is Number -> value.toDouble()
        is String -> value.toDoubleOrNull() ?: 0.0
        is Boolean -> if (value) 1.0 else 0.0
        else -> 0.0
    }

    fun normalizeValue(value: Any): Any {
        return if (value is Double && value == floor(value)) value.toInt() else value
    }
}