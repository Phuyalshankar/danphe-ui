package io.dolphin.runtime

import android.graphics.Color

/**
 * 🎨 TailwindColorResolver — Resolves any Tailwind color string (e.g. red-500, blue-600, slate-200, emerald-400)
 * to exact native ARGB Color or Hex string dynamically.
 */
object TailwindColorResolver {

    fun resolveHex(colorStr: String): String {
        if (colorStr.startsWith("#")) return colorStr

        val parts = colorStr.trim().toLowerCase().split("-")
        val base = parts.getOrNull(0) ?: ""
        val shadeNum = parts.getOrNull(1)?.toIntOrNull() ?: 500

        // Convert Tailwind shade (50..950) to byte scale (0..255)
        val shadeByte = when (shadeNum) {
            50  -> 20
            100 -> 35
            200 -> 60
            300 -> 90
            400 -> 115
            500 -> 135
            600 -> 160
            700 -> 190
            800 -> 220
            900 -> 235
            950 -> 245
            else -> 135
        }

        return when (base) {
            "slate", "gray", "zinc", "neutral", "stone" -> colorToHex(ColorPalette.resolveSlate(shadeByte))
            "blue", "sky", "cyan" -> colorToHex(ColorPalette.resolveBlue(shadeByte))
            "green", "emerald", "teal", "lime" -> colorToHex(ColorPalette.resolveGreen(shadeByte))
            "indigo", "violet" -> colorToHex(ColorPalette.resolveIndigo(shadeByte))
            "red", "rose" -> colorToHex(ColorPalette.resolveRed(shadeByte))
            "amber", "warning" -> colorToHex(ColorPalette.resolveAmber(shadeByte))
            "orange" -> colorToHex(ColorPalette.resolveOrange(shadeByte))
            "pink", "fuchsia" -> colorToHex(ColorPalette.resolvePink(shadeByte))
            "purple" -> colorToHex(ColorPalette.resolvePurple(shadeByte))
            "yellow" -> colorToHex(ColorPalette.resolveYellow(shadeByte))
            "white" -> "#ffffff"
            "black" -> "#000000"
            else -> "#cbd5e1"
        }
    }

    private fun colorToHex(colorInt: Int): String {
        return String.format("#%06X", 0xFFFFFF and colorInt)
    }
}
