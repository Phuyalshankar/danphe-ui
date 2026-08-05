package io.dolphin.runtime


import android.content.Context
import android.content.res.ColorStateList
import android.graphics.Color
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.RadioButton
import android.widget.RadioGroup

/**
 * 📻 FormRadioGroup — Dedicated Radio Button Group input component for forms.
 */
object FormRadioGroup {

    fun createRadioGroup(
        ctx: Context,
        optionsCsv: String,
        stateKey: String,
        action: String,
        onAction: ((String, Any?) -> Unit)?
    ): RadioGroup {
        val level = DolphinStateEngine.themeLevel
        val isDark = level > 128

        val group = RadioGroup(ctx).apply {
            orientation = RadioGroup.VERTICAL
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
        }

        val options = optionsCsv.split(",").map { it.trim() }.filter { it.isNotEmpty() }
        options.forEachIndexed { idx, opt ->
            val radio = RadioButton(ctx).apply {
                id = idx + 1000
                text = opt
                setTextColor(if (isDark) Color.WHITE else Color.parseColor("#0f172a"))
                buttonTintList = ColorStateList.valueOf(if (isDark) Color.parseColor("#3b82f6") else Color.parseColor("#2563eb"))
            }
            group.addView(radio)
        }

        group.setOnCheckedChangeListener { _, checkedId ->
            val selectedIdx = checkedId - 1000
            val selectedVal = options.getOrNull(selectedIdx) ?: ""
            if (stateKey.isNotEmpty()) {
                DolphinStateEngine.set(stateKey, selectedVal)
            }
            if (action.isNotEmpty()) {
                onAction?.invoke(action, selectedVal)
            }
        }

        return group
    }
}
