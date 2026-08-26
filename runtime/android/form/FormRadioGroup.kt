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
            clipChildren = false
            clipToPadding = false
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
        }

        val options = optionsCsv.split(",").map { it.trim() }.filter { it.isNotEmpty() }
        options.forEachIndexed { idx, opt ->
            val parts = opt.split("__HIDETEXT__")
            val valStr = parts[0]
            val hideText = parts.size > 1

            val radio = com.google.android.material.radiobutton.MaterialRadioButton(ctx).apply {
                id = idx + 1000
                text = if (hideText) "" else valStr
                minWidth = 0
                minHeight = 0
                minimumWidth = 0
                minimumHeight = 0
                setPadding(0, 0, 0, 0)
                setTextColor(if (isDark) Color.WHITE else Color.parseColor("#0f172a"))
                buttonTintList = ColorStateList.valueOf(if (isDark) Color.parseColor("#3b82f6") else Color.parseColor("#2563eb"))
            }
            group.addView(radio)

            radio.setOnCheckedChangeListener { _, isChecked ->
                if (isChecked) {
                    if (stateKey.isNotEmpty()) {
                        DolphinStateEngine.set(stateKey, valStr)
                    }
                    if (action.isNotEmpty()) {
                        onAction?.invoke(action, valStr)
                    }
                }
            }
        }

        return group
    }
}
