package io.dolphin.runtime

import android.content.Context
import android.graphics.Color
import android.view.View
import android.widget.ImageView
import android.widget.LinearLayout
import androidx.core.graphics.ColorUtils

/**
 * 👑 IconBuilder — Opcode 0x23
 * Renders native GPU-accelerated 2D vector icons & FontAwesome CDN glyphs
 */
class IconBuilder : ComponentBuilder {

    companion object {
        const val OPCODE = 0x23
    }

    override fun getType(): Int = OPCODE

    override fun getName(): String = "Icon"

    override fun build(ctx: Context, bin: ByteArray, factory: ViewFactory): View {
        val iconName = factory.nextStr()
        val view = ImageView(ctx)
        val iconSizeDp = factory.dp(32)

        val resolvedColor = factory.resolveColorFromBin(bin)
        val isDark = if (resolvedColor != 0) try { ColorUtils.calculateLuminance(resolvedColor) < 0.25 } catch (e: Exception) { false } else false
        val iconColor = if (resolvedColor != 0 && !isDark) resolvedColor else Color.parseColor("#38BDF8")

        val drawable = factory.getDynamicIconDrawable(ctx, iconName, iconColor)
        view.setImageDrawable(drawable)

        factory.applyStyles(view, bin)

        // Force explicit 32dp size on ImageView so it never collapses to 0x0
        view.layoutParams = LinearLayout.LayoutParams(iconSizeDp, iconSizeDp)
        view.minimumWidth = iconSizeDp
        view.minimumHeight = iconSizeDp
        view.scaleType = ImageView.ScaleType.FIT_CENTER
        view.adjustViewBounds = true

        return view
    }
}