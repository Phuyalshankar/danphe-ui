package io.dolphin.runtime


import android.content.Context
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout

/**
 * 🔒 Column & Container Builder (Opcode 0x13 & 0x12)
 * Cleaned: Card logic moved to dedicated CardBuilder.kt
 */
class ColumnBuilder(private val opcode: Int = 0x13) : ComponentBuilder {
    override fun getType(): Int = opcode
    override fun getName(): String = if (opcode == 0x12) "Container" else "Column"

    override fun build(ctx: Context, data: ByteArray, factory: ViewFactory): View {
        val action = factory.nextStr()
        val sig = data[data.size - 1].toInt() and 0xFF
        val justifyBetween = (sig and 0x20) != 0

        val count = data[13].toInt() and 0xFF
        val orientation = data[12].toInt() and 0x0F
        val gap = (data[12].toInt() shr 4) and 0x0F
        val gapPx = factory.dp(gap * 4)

        val layout = GapAwareLinearLayout(ctx).apply {
            this.orientation = if (orientation == 1) LinearLayout.HORIZONTAL else LinearLayout.VERTICAL
            if (orientation == 1) setGap(gapPx, 0) else setGap(0, gapPx)
            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        }

        factory.applyGravity(layout, data)
        factory.applyStyles(layout, data)

        if (action.isNotEmpty()) {
            layout.isClickable = true
            layout.isFocusable = true
            layout.setOnClickListener { factory.onAction?.invoke(action, getName()) }

            if (action.startsWith("hw:camera:preview") || action.startsWith("hw:camera:front") || action.startsWith("hw:camera:back") || action.startsWith("hw:camera:embed")) {
                val facing = if (action.contains("front")) "front" else "back"
                val h = if (layout.layoutParams.height > 0) layout.layoutParams.height else factory.dp(224)
                layout.minimumHeight = h
                val cameraView = DolphinCamera.createEmbeddedCameraView(ctx, facing)
                layout.addView(cameraView, LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    h
                ))
            }
        }

        val children = mutableListOf<View>()
        var hasFlexChild = false

        repeat(count) { i ->
            val child = factory.buildComp()
            if (child != null) {
                val origWeight = (child.layoutParams as? LinearLayout.LayoutParams)?.weight ?: 0f
                val clp: LinearLayout.LayoutParams = factory.getOrCreateLinearLayoutParams(child, ViewGroup.LayoutParams.MATCH_PARENT)
                val weightToApply = if (origWeight > 0f) origWeight else clp.weight

                if (orientation == 1) {
                    if (weightToApply > 0) {
                        clp.weight = weightToApply
                        clp.width = 0
                        hasFlexChild = true
                    }
                    if (gapPx > 0 && i > 0) clp.leftMargin = gapPx
                } else {
                    if (clp.width <= 0 && clp.width != ViewGroup.LayoutParams.WRAP_CONTENT) {
                        clp.width = ViewGroup.LayoutParams.MATCH_PARENT
                    }
                    if (weightToApply > 0) {
                        clp.weight = weightToApply
                        hasFlexChild = true
                        if (!factory.isInScrollView) {
                            clp.height = 0
                        } else {
                            clp.height = ViewGroup.LayoutParams.WRAP_CONTENT
                        }
                    }
                    if (gapPx > 0 && i > 0) clp.topMargin = gapPx
                }
                child.layoutParams = clp
                children.add(child)
            }
        }

        children.forEachIndexed { i, child ->
            if (justifyBetween && i > 0 && !hasFlexChild) {
                val spacer = View(ctx).apply {
                    layoutParams = if (orientation == 1) {
                        LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, 1f)
                    } else {
                        LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f)
                    }
                }
                layout.addView(spacer)
            }
            layout.addView(child)
        }

        layout.enforceNow()
        return layout
    }
}
