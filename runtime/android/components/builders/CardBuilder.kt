package io.dolphin.runtime


import android.content.Context
import android.content.res.ColorStateList
import android.graphics.Color
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.LinearLayout
import com.google.android.material.card.MaterialCardView

/**
 * 🃏 Clean Dedicated CardBuilder
 * Handles Opcode 0x11 (Card Component) independently without Column mixing.
 */
class CardBuilder : ComponentBuilder {
    override fun getType(): Int = 0x11
    override fun getName(): String = "Card"

    override fun build(ctx: Context, data: ByteArray, factory: ViewFactory): View {
        val action = factory.nextStr()
        val sig = data[data.size - 1].toInt() and 0xFF
        val justifyBetween = (sig and 0x20) != 0

        val count = data[13].toInt() and 0x0F
        val orientation = data[12].toInt() and 0x0F
        val gap = (data[12].toInt() shr 4) and 0x0F
        val gapPx = factory.dp(gap * 4)

        // 1. Create Dedicated MaterialCardView
        val cardView = MaterialCardView(ctx).apply {
            radius = factory.dp(12).toFloat()
            cardElevation = factory.dp(4).toFloat()
            setCardBackgroundColor(ColorStateList.valueOf(Color.WHITE))
            useCompatPadding = true
            preventCornerOverlap = true
            clipChildren = false
            clipToPadding = false
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, 
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
            setContentPadding(factory.dp(16), factory.dp(16), factory.dp(16), factory.dp(16))
        }

        if (action.isNotEmpty()) {
            cardView.isClickable = true
            cardView.isFocusable = true
            cardView.setOnClickListener { factory.onAction?.invoke(action, "Card") }
        }

        // 2. Inner Container for Children Layout
        val innerContainer = GapAwareLinearLayout(ctx).apply {
            this.orientation = if (orientation == 1) LinearLayout.HORIZONTAL else LinearLayout.VERTICAL
            if (orientation == 1) setGap(gapPx, 0) else setGap(0, gapPx)
            layoutParams = FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, 
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
            setBackgroundColor(Color.TRANSPARENT)
        }
        factory.applyGravity(innerContainer, data)
        cardView.addView(innerContainer)

        // 3. Apply Base Styles & Colors
        factory.applyStyles(cardView, data)

        // 4. Build Children
        repeat(count) { i ->
            val child = factory.buildComp()
            if (child != null) {
                val clp: LinearLayout.LayoutParams = factory.getOrCreateLinearLayoutParams(child, ViewGroup.LayoutParams.MATCH_PARENT)

                if (orientation == 1) {
                    if (clp.weight > 0) clp.width = 0
                    if (gapPx > 0 && i > 0) clp.leftMargin = gapPx
                } else {
                    if (clp.width <= 0 && clp.width != ViewGroup.LayoutParams.WRAP_CONTENT) {
                        clp.width = ViewGroup.LayoutParams.MATCH_PARENT
                    }
                    if (clp.weight > 0) {
                        if (!factory.isInScrollView) {
                            clp.height = 0
                        } else {
                            clp.weight = 0f
                            clp.height = ViewGroup.LayoutParams.WRAP_CONTENT
                        }
                    }
                    if (gapPx > 0 && i > 0) clp.topMargin = gapPx
                }

                if (justifyBetween && i > 0) {
                    val spacer = View(ctx).apply {
                        layoutParams = LinearLayout.LayoutParams(0, 0, 1f)
                    }
                    innerContainer.addView(spacer)
                }
                innerContainer.addView(child, clp as ViewGroup.LayoutParams)
            }
        }

        innerContainer.enforceNow()
        return cardView
    }
}
