package io.dolphin.runtime


import android.content.Context
import android.content.res.ColorStateList
import android.graphics.Color
import android.view.ViewGroup
import android.widget.LinearLayout
import com.google.android.material.checkbox.MaterialCheckBox

/**
 * ☑️ FormCheckbox — Dedicated Material Checkbox input component for forms.
 */
object FormCheckbox {

    fun createCheckbox(
        ctx: Context,
        label: String,
        stateKey: String,
        action: String,
        isChecked: Boolean = false,
        onAction: ((String, Any?) -> Unit)?
    ): MaterialCheckBox {
        val level = DolphinStateEngine.themeLevel
        val isDark = level > 128

        return MaterialCheckBox(ctx).apply {
            text = label
            this.isChecked = isChecked
            setTextColor(if (isDark) Color.WHITE else Color.parseColor("#0f172a"))
            buttonTintList = ColorStateList.valueOf(if (isDark) Color.parseColor("#3b82f6") else Color.parseColor("#2563eb"))
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )

            if (stateKey.isNotEmpty()) {
                val stateStr = DolphinStateEngine.get(stateKey)?.toString() ?: ""
                if (stateStr.isNotEmpty()) {
                    this.isChecked = stateStr.toBoolean()
                }
            }

            setOnCheckedChangeListener { _, checked ->
                if (stateKey.isNotEmpty()) {
                    DolphinStateEngine.set(stateKey, checked.toString())
                }
                if (action.isNotEmpty()) {
                    onAction?.invoke(action, checked)
                }
            }
        }
    }
}
