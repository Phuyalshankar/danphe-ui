package io.dolphin.runtime

import android.content.res.ColorStateList
import com.google.android.material.textfield.TextInputLayout

/**
 * 🏷️ FormLabel — Manages floating label colors, hint enablement, and typography styling for form fields.
 */
object FormLabel {

    fun applyLabel(
        layout: TextInputLayout,
        label: String,
        labelColor: Int,
        focusedColor: Int
    ) {
        layout.hint = label
        layout.isHintEnabled = label.isNotEmpty()

        if (label.isNotEmpty()) {
            val states = arrayOf(
                intArrayOf(android.R.attr.state_focused),
                intArrayOf()
            )
            val colors = intArrayOf(focusedColor, labelColor)
            val colorStateList = ColorStateList(states, colors)
            layout.defaultHintTextColor = colorStateList
            layout.placeholderTextColor = colorStateList
        }
    }
}
