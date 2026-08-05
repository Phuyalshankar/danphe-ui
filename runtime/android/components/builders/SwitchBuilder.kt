package io.dolphin.runtime



import android.content.Context
import android.content.res.ColorStateList
import android.graphics.Color
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import com.google.android.material.switchmaterial.SwitchMaterial

/**
 * 🔘 SwitchBuilder — Native SwitchMaterial component builder (Opcode 0x1A)
 */
class SwitchBuilder : ComponentBuilder {
    override fun getType(): Int = 0x1A
    override fun getName(): String = "Switch"

    override fun build(ctx: Context, data: ByteArray, factory: ViewFactory): View {
        val stateKeyOrAction = factory.nextStr()
        val label = factory.nextStr()

        val isDark = DolphinStateEngine.themeLevel > 128

        val switchView = SwitchMaterial(ctx).apply {
            text = label
            setTextColor(if (isDark) Color.WHITE else Color.parseColor("#0f172a"))
            thumbTintList = ColorStateList.valueOf(if (isDark) Color.parseColor("#3b82f6") else Color.parseColor("#2563eb"))
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )

            if (stateKeyOrAction.isNotEmpty()) {
                val stateStr = DolphinStateEngine.get(stateKeyOrAction)?.toString() ?: ""
                if (stateStr.isNotEmpty()) {
                    isChecked = stateStr.toBoolean()
                }
            }

            setOnCheckedChangeListener { _, checked ->
                if (stateKeyOrAction.isNotEmpty()) {
                    DolphinStateEngine.set(stateKeyOrAction, checked.toString())
                    factory.onAction?.invoke(stateKeyOrAction, checked)
                }
            }
        }

        factory.applyStyles(switchView, data)
        return switchView
    }
}
