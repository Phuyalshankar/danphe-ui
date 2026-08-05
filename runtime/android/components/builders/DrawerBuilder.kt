package io.dolphin.runtime

import android.content.Context
import android.graphics.Color
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView
import com.google.android.material.button.MaterialButton

/**
 * 🔒 Native Dedicated Drawer Builder (Opcode 0x28)
 * Dedicated Native Side Drawer View for modular screen menu navigation
 */
class DrawerBuilder : ComponentBuilder {
    override fun getType(): Int = 0x28
    override fun getName(): String = "Drawer"

    override fun build(ctx: Context, data: ByteArray, factory: ViewFactory): View {
        val action = factory.nextStr()

        val container = LinearLayout(ctx).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            setBackgroundColor(Color.parseColor("#1e293b")) // Slate-800
            setPadding(factory.dp(16), factory.dp(32), factory.dp(16), factory.dp(16))
        }

        val headerText = TextView(ctx).apply {
            text = "📑 Navigation Drawer"
            textSize = 18f
            typeface = android.graphics.Typeface.DEFAULT_BOLD
            setTextColor(Color.WHITE)
        }

        val subText = TextView(ctx).apply {
            text = "Modular screen navigator for 100+ test suite pages."
            textSize = 12f
            setTextColor(Color.parseColor("#94a3b8"))
            setPadding(0, 0, 0, factory.dp(16))
        }

        container.addView(headerText)
        container.addView(subText)

        val items = listOf(
            Pair("➔ 1. Main Overview Dashboard", "nav:Home"),
            Pair("➔ 2. Comprehensive CSS Showcase", "nav:CssTest"),
            Pair("➔ 3. 🎨 Native Gradients & Banners", "nav:GradientTest"),
            Pair("➔ 4. 🎬 Native CSS Animations", "nav:AnimationTest"),
            Pair("➔ 5. NanoStore State Reactivity", "nav:StoreTest"),
            Pair("➔ 6. Native Hardware API Tester", "nav:HardwareTest")
        )

        for (item in items) {
            val btn = MaterialButton(ctx).apply {
                text = item.first
                isAllCaps = false
                textSize = 13f
                textAlignment = View.TEXT_ALIGNMENT_TEXT_START
                cornerRadius = factory.dp(8)
                layoutParams = LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                ).apply {
                    bottomMargin = factory.dp(8)
                }
                setBackgroundColor(Color.parseColor("#334155"))
                setTextColor(Color.WHITE)
                setOnClickListener {
                    factory.onAction?.invoke(item.second, item.first)
                }
            }
            container.addView(btn)
        }

        return container
    }
}
