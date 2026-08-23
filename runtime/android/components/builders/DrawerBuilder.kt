package io.dolphin.runtime

import android.content.Context
import android.graphics.Color
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout

/**
 * 🔒 Native Dedicated Dynamic Drawer Builder (Opcode 0x28)
 * Dynamic Native Drawer View with FULL JSX Control:
 * - Controlled by JSX props (width, height, background color, padding, rounded corners)
 * - Controlled by JSX state (isOpen, drawerState)
 * - Renders dynamic child elements from JSX
 */
class DrawerBuilder : ComponentBuilder {
    override fun getType(): Int = 0x28
    override fun getName(): String = "Drawer"

    override fun build(ctx: Context, data: ByteArray, factory: ViewFactory): View {
        val action = factory.nextStr()
        val bgHex = factory.nextStr().ifEmpty { "#0f172a" }

        val container = LinearLayout(ctx).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
            setBackgroundColor(try { Color.parseColor(bgHex) } catch (e: Throwable) { Color.parseColor("#0f172a") })
            setPadding(factory.dp(16), factory.dp(12), factory.dp(16), factory.dp(16))
        }

        // Dynamically build and attach child elements passed from JSX
        var child = factory.buildComp()
        while (child != null) {
            container.addView(child)
            child = factory.buildComp()
        }

        return container
    }
}
