package io.dolphin.runtime


import android.content.Context
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout

/**
 * 🔒 Row Builder with GapAwareLinearLayout Protection
 */
class RowBuilder : ComponentBuilder {
    override fun getType(): Int = 0x14
    override fun getName(): String = "Row"

    override fun build(ctx: Context, data: ByteArray, factory: ViewFactory): View {
        val action = factory.nextStr()
        val sig = data[data.size - 1].toInt() and 0xFF
        val justifyBetween = (sig and 0x20) != 0

        val count = data[13].toInt() and 0x0F
        val gap = (data[12].toInt() shr 4) and 0x0F
        val gapPx = factory.dp(gap * 4)

        val layout = GapAwareLinearLayout(ctx).apply {
            orientation = LinearLayout.HORIZONTAL
            setGap(gapPx, 0)
            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
            
            if (action.isNotEmpty()) {
                isClickable = true
                isFocusable = true
                setOnClickListener { factory.onAction?.invoke(action, "Row") }
            }
            
            factory.applyStyles(this, data)
            factory.applyGravity(this, data)
        }

        Log.d("RowBuilder", "Building Row with $count children, gapPx=$gapPx")

        repeat(count) { i ->
            val child = factory.buildComp()
            if (child != null) {
                val clp: LinearLayout.LayoutParams = factory.getOrCreateLinearLayoutParams(child, ViewGroup.LayoutParams.WRAP_CONTENT)
                if (clp.width == ViewGroup.LayoutParams.MATCH_PARENT || clp.weight > 0) {
                    clp.weight = 1f
                    clp.width = 0
                }
                if (gapPx > 0 && i > 0) clp.leftMargin = gapPx
                if (justifyBetween && i > 0) {
                    val spacer = View(ctx).apply {
                        layoutParams = LinearLayout.LayoutParams(0, 0, 1f)
                    }
                    layout.addView(spacer)
                }
                layout.addView(child, clp as ViewGroup.LayoutParams)
            } else {
                Log.w("RowBuilder", "Child #$i of Row returned null")
            }
        }

        layout.enforceNow()
        return layout
    }
}
