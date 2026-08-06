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
            cardView.setOnClickListener {
                if (action.startsWith("anim:")) {
                    val animName = action.substring(5)
                    DolphinEventDebugger.trace(cardView, action, "AnimationEngine", "EXECUTED", "animStr=$animName")
                    AnimationEngine.apply(cardView, animName)
                    factory.onAction?.invoke(action, "Card")
                } else {
                    DolphinStateEngine.handleAction(action)
                    DolphinEventDebugger.trace(cardView, action, "DolphinRuntime", "DISPATCHED")
                    factory.onAction?.invoke(action, "Card")
                }
            }
        }

        // 2. Inner Container for Children Layout
        val innerContainer = GapAwareLinearLayout(ctx).apply {
            this.orientation = if (orientation == 1) LinearLayout.HORIZONTAL else LinearLayout.VERTICAL
            if (orientation == 1) setGap(gapPx, 0) else setGap(0, gapPx)
            layoutParams = FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, 
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
            if (justifyBetween) {
                this.gravity = android.view.Gravity.CENTER_VERTICAL
            }
        }

        factory.applyStyles(cardView, data)

        // 3. Build & Attach Children to Inner Container
        for (i in 0 until count) {
            val childView = factory.buildComp()
            if (childView != null) {
                innerContainer.addView(childView)
            }
        }

        cardView.addView(innerContainer)
        return cardView
    }
}
