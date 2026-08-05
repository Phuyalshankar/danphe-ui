package io.dolphin.runtime

import android.content.Context
import android.graphics.Color

/**
 * 🎨 FormStyle — Parses CSS parameters, margins, paddings, and theme palettes for form components.
 */
object FormStyle {

    data class ThemeColors(
        val bg: Int,
        val text: Int,
        val label: Int,
        val border: Int,
        val focus: Int
    )

    data class Margin(val top: Int, val right: Int, val bottom: Int, val left: Int)

    fun getThemeColors(isDark: Boolean): ThemeColors {
        return if (isDark) {
            ThemeColors(
                bg = Color.parseColor("#1e293b"),
                text = Color.WHITE,
                label = Color.parseColor("#94a3b8"),
                border = Color.parseColor("#475569"),
                focus = Color.parseColor("#3b82f6")
            )
        } else {
            ThemeColors(
                bg = Color.WHITE,
                text = Color.parseColor("#0f172a"),
                label = Color.parseColor("#64748b"),
                border = Color.parseColor("#cbd5e1"),
                focus = Color.parseColor("#2563eb")
            )
        }
    }

    fun dp(ctx: Context, px: Int): Int {
        return (px * ctx.resources.displayMetrics.density).toInt()
    }
}
