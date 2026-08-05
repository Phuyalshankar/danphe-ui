package io.dolphin.runtime

import android.content.Context
import android.graphics.Color
import android.util.Log
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView
import com.google.android.material.button.MaterialButton

/**
 * 🔒 Native Dedicated Header Builder (Opcode 0x1D)
 * Top Navigation Header bar with Menu button (drawer:open), Title & Theme Toggle
 */
class HeaderBuilder : ComponentBuilder {
    override fun getType(): Int = 0x1D
    override fun getName(): String = "Header"

    override fun build(ctx: Context, data: ByteArray, factory: ViewFactory): View {
        val action = factory.nextStr()
        val titleStr = factory.nextStr().ifEmpty { "Dolphin Native Test" }

        val container = LinearLayout(ctx).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                factory.dp(54)
            ).apply {
                bottomMargin = factory.dp(12)
            }
            setBackgroundColor(Color.parseColor("#0f172a"))
            setPadding(factory.dp(12), factory.dp(6), factory.dp(12), factory.dp(6))
        }

        // ☰ Menu Button
        val menuBtn = MaterialButton(ctx).apply {
            text = "☰ Menu"
            isAllCaps = false
            textSize = 12f
            cornerRadius = factory.dp(8)
            setBackgroundColor(Color.parseColor("#1e293b"))
            setTextColor(Color.WHITE)
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ).apply {
                marginEnd = factory.dp(12)
            }
            setOnClickListener {
                factory.onAction?.invoke("drawer:open", "Menu")
            }
        }

        // Title
        val titleView = TextView(ctx).apply {
            tag = "HeaderTitle"
            id = 10002
            text = "🐬 $titleStr"
            textSize = 16f
            typeface = android.graphics.Typeface.DEFAULT_BOLD
            setTextColor(Color.WHITE)
            layoutParams = LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f)
        }

        container.addView(menuBtn)
        container.addView(titleView)

        return container
    }
}
