package io.dolphin.runtime


import android.content.Context
import android.graphics.Color
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.LinearLayout
import android.widget.Spinner

/**
 * 🔽 FormSelect — Dedicated Material Dropdown / Spinner component for forms.
 */
object FormSelect {

    fun createSelect(
        ctx: Context,
        label: String,
        optionsCsv: String,
        stateKey: String,
        action: String,
        onAction: ((String, Any?) -> Unit)?
    ): View {
        val level = DolphinStateEngine.themeLevel
        val isDark = level > 128

        val options = optionsCsv.split(",").map { it.trim() }.filter { it.isNotEmpty() }
        val adapter = ArrayAdapter(ctx, android.R.layout.simple_spinner_item, options).apply {
            setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        }

        val spinner = Spinner(ctx).apply {
            this.adapter = adapter
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
            setBackgroundColor(if (isDark) Color.parseColor("#1e293b") else Color.WHITE)

            onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
                override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                    val selectedValue = options.getOrNull(position) ?: ""
                    if (stateKey.isNotEmpty()) {
                        DolphinStateEngine.set(stateKey, selectedValue)
                    }
                    if (action.isNotEmpty()) {
                        onAction?.invoke(action, selectedValue)
                    }
                }
                override fun onNothingSelected(parent: AdapterView<*>?) {}
            }
        }

        return spinner
    }
}
