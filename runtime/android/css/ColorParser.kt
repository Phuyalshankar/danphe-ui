package io.dolphin.runtime

import android.graphics.Color
import androidx.core.graphics.ColorUtils

/**
 * 🎨 ColorParser — High-speed native color parser.
 * Perfectly synchronized with Node.js ubColors.js mapping table (Opcodes 0..25).
 */
object ColorParser {

    fun parseColor(colorCode: Int, shade: Int, isText: Boolean = false): Int {
        if (colorCode == 0 || colorCode == 23 && shade == 0) return Color.TRANSPARENT
        if (colorCode == 25) {
            val alpha = if (shade > 0) shade.coerceIn(0, 255) else 128
            return Color.argb(alpha, 255, 255, 255)
        }

        val isDark = DolphinStateEngine.themeLevel > 128
        val effectiveShade = if (shade > 0) shade else 128

        return when (colorCode) {
            1  -> ColorPalette.resolveBlue(effectiveShade)     // blue, sky, cyan, info
            2  -> ColorPalette.resolveGreen(effectiveShade)    // green, emerald, teal, lime, success
            3  -> ColorPalette.resolveIndigo(effectiveShade)   // primary, indigo, violet
            4  -> ColorPalette.resolveRed(effectiveShade)      // red, rose, danger
            5  -> ColorPalette.resolveAmber(effectiveShade)    // amber, warning
            6  -> ColorPalette.resolveOrange(effectiveShade)   // orange
            7  -> ColorPalette.resolveSlate(effectiveShade)    // gray, slate, zinc, neutral, stone, secondary, light
            9  -> if (isDark) Color.parseColor("#0f172a") else Color.BLACK // black, dark
            10 -> Color.WHITE                                  // white
            12 -> ColorPalette.resolvePink(effectiveShade)     // pink, fuchsia
            13 -> ColorPalette.resolvePurple(effectiveShade)   // purple
            14 -> ColorPalette.resolveYellow(effectiveShade)   // yellow
            21 -> ColorTokens.getBackground(isDark)            // Background
            22 -> ColorTokens.getSurface(isDark)               // Surface
            else -> Color.TRANSPARENT
        }
    }

    fun contrastText(onColor: Int): Int {
        return try {
            val lum = ColorUtils.calculateLuminance(onColor)
            if (lum < 0.42) Color.WHITE else Color.parseColor("#0f172a")
        } catch (_: Exception) {
            Color.parseColor("#0f172a")
        }
    }
}
