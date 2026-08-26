package io.dolphin.runtime

import android.content.Context
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout

/**
 * 🔲 GridLayout — Manages native multi-column grid layout generation for grid-cols-N components (opcode 0x22).
 */
object GridLayout {

    fun createSimpleGrid(factory: ViewFactory, ctx: Context, bin: ByteArray): View {
        val action = factory.nextStr()
        val columns = (bin[12].toInt() and 0x0F).coerceAtLeast(1)
        val gap = ((bin[12].toInt() shr 4) and 0x0F) * 4

        val container = LinearLayout(ctx).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
            factory.applyStyles(this, bin)

            if (action.isNotEmpty()) {
                isClickable = true
                isFocusable = true
                setOnClickListener { factory.onAction?.invoke(action, "Grid") }
            }
        }

        val count = bin[13].toInt() and 0xFF
        val children = mutableListOf<View>()

        repeat(count) {
            factory.buildComp()?.let { child ->
                children.add(child)
            }
        }

        var currentRow: LinearLayout? = null
        for (i in children.indices) {
            if (i % columns == 0) {
                currentRow = LinearLayout(ctx).apply {
                    orientation = LinearLayout.HORIZONTAL
                    layoutParams = LinearLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT
                    ).apply {
                        if (i > 0 && gap > 0) topMargin = factory.dp(gap)
                    }
                }
                container.addView(currentRow)
            }

            val child = children[i]
            val clp = LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f).apply {
                if (i % columns > 0 && gap > 0) leftMargin = factory.dp(gap)
            }
            currentRow?.addView(child, clp)
        }

        return container
    }
}
