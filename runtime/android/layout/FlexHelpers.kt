package io.dolphin.runtime

import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout

/**
 * 🐬 FlexHelpers — Flex Shrink & Flex Weight Protection Engine
 * Prevents flex items from shrinking to 0px under layout pressure
 */
object FlexHelpers {

    fun applyFlexParams(view: View, weight: Float, isHorizontal: Boolean) {
        val lp = view.layoutParams as? LinearLayout.LayoutParams ?: return
        lp.weight = weight
        if (isHorizontal) {
            lp.width = 0
            if (lp.height <= 0) lp.height = ViewGroup.LayoutParams.WRAP_CONTENT
        } else {
            lp.height = 0
            if (lp.width <= 0) lp.width = ViewGroup.LayoutParams.MATCH_PARENT
        }
        view.layoutParams = lp
    }

    fun preventShrink(view: View) {
        val lp = view.layoutParams as? LinearLayout.LayoutParams ?: return
        if (lp.weight > 0f) return
        view.minimumWidth = Math.max(view.minimumWidth, 1)
        view.minimumHeight = Math.max(view.minimumHeight, 1)
    }
}