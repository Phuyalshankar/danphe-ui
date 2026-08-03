package io.dolphin.runtime

import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.util.Log
import android.view.View

/**
 * 🌊 GradientRenderer
 * Handles all gradient background logic for Dolphin Native views.
 * Kept separate from ViewFactory so gradient bugs never break core rendering.
 *
 * Supported gradient class formats (from ub.js string pool):
 *   gradient-blue-100-red-200           (diagonal TL→BR)
 *   gradient-45deg-blue-100-red-200     (custom angle)
 *   gradient-vert-blue-100-red-200      (top → bottom)
 *   gradient-horiz-blue-100-red-200     (left → right)
 *   gradient-radial-blue-100-red-200    (radial — approximated as diagonal)
 */
object GradientRenderer {

    fun apply(v: View, gradStr: String, radiusByte: Int, parseColor: (String, Int) -> Int) {
        Log.d("GradientRenderer", "apply() gradStr='$gradStr' radiusByte=$radiusByte")
        try {
            val parts = gradStr.split("-")
            Log.d("GradientRenderer", "parts=$parts size=${parts.size}")

            // ── Colored Glass: glass-blue-100-80 → flat tinted semi-transparent background ──
            if (parts[0] == "glass" && parts.size >= 4) {
                val colorName = parts[1]
                val shade     = parts[2].toIntOrNull() ?: 128
                val alpha     = parts[3].toIntOrNull() ?: 80
                val baseColor = parseColor(colorName, shade)
                // blend alpha into color using bit ops (no Color.red/green/blue needed)
                val glassColor: Int = (alpha.coerceIn(0, 255) shl 24) or (baseColor and 0x00FFFFFF)
                val gd = GradientDrawable()
                gd.setColor(glassColor)
                if (radiusByte > 0) {
                    val density = v.context.resources.displayMetrics.density
                    gd.cornerRadius = if (radiusByte == 255) 9999f else (radiusByte * density)
                }
                v.background = gd
                Log.d("GradientRenderer", "glass color applied: 0x${Integer.toHexString(glassColor)}")
                return
            }

            // ── Danphe & Nepal Multi-Color Gradient Theme Preset ──
            if (gradStr.contains("danphe") || (parts.size >= 2 && parts[1] == "danphe")) {
                val danpheColors = intArrayOf(
                    Color.parseColor("#0f172a"), // Deep Slate Navy
                    Color.parseColor("#1e3a8a"), // Royal Blue
                    Color.parseColor("#047857"), // Emerald Green
                    Color.parseColor("#f59e0b")  // Vivid Danphe Gold/Yellow
                )
                val gd = GradientDrawable(GradientDrawable.Orientation.TL_BR, danpheColors)
                if (radiusByte > 0) {
                    val density = v.context.resources.displayMetrics.density
                    gd.cornerRadius = if (radiusByte == 255) 9999f else (radiusByte * density)
                }
                v.background = gd
                Log.d("GradientRenderer", "Applied Danphe multi-color gradient (Blue + Emerald + Gold Yellow)")
                return
            }

            // ── Aurora Multi-Color Gradient Theme Preset ──
            if (gradStr.contains("aurora") || (parts.size >= 2 && parts[1] == "aurora")) {
                val auroraColors = intArrayOf(
                    Color.parseColor("#0f172a"),
                    Color.parseColor("#1e1b4b"),
                    Color.parseColor("#065f46"),
                    Color.parseColor("#10b981")
                )
                val gd = GradientDrawable(GradientDrawable.Orientation.TL_BR, auroraColors)
                if (radiusByte > 0) {
                    val density = v.context.resources.displayMetrics.density
                    gd.cornerRadius = if (radiusByte == 255) 9999f else (radiusByte * density)
                }
                v.background = gd
                return
            }

            if (parts.isEmpty() || parts[0] != "gradient") {
                Log.w("GradientRenderer", "Not a gradient string, skipping")
                return
            }

            val orientation: GradientDrawable.Orientation
            var c1Name: String
            var s1: Int
            var c2Name: String
            var s2: Int

            when {
                // gradient-vert-blue-100-red-200
                parts.size >= 6 && parts[1] == "vert" -> {
                    orientation = GradientDrawable.Orientation.TOP_BOTTOM
                    c1Name = parts[2]; s1 = parts[3].toIntOrNull() ?: 128
                    c2Name = parts[4]; s2 = parts[5].toIntOrNull() ?: 128
                }
                // gradient-horiz-blue-100-red-200
                parts.size >= 6 && parts[1] == "horiz" -> {
                    orientation = GradientDrawable.Orientation.LEFT_RIGHT
                    c1Name = parts[2]; s1 = parts[3].toIntOrNull() ?: 128
                    c2Name = parts[4]; s2 = parts[5].toIntOrNull() ?: 128
                }
                // gradient-radial-blue-100-red-200
                parts.size >= 6 && parts[1] == "radial" -> {
                    orientation = GradientDrawable.Orientation.TL_BR
                    c1Name = parts[2]; s1 = parts[3].toIntOrNull() ?: 128
                    c2Name = parts[4]; s2 = parts[5].toIntOrNull() ?: 128
                }
                // gradient-45deg-blue-100-red-200 (Prefix Angle)
                parts.size >= 6 && parts[1].endsWith("deg") -> {
                    val angle = parts[1].removeSuffix("deg").toIntOrNull() ?: 135
                    orientation = angleToOrientation(angle)
                    c1Name = parts[2]; s1 = parts[3].toIntOrNull() ?: 128
                    c2Name = parts[4]; s2 = parts[5].toIntOrNull() ?: 128
                }
                // gradient-blue-100-red-200-45 (Suffix Angle)
                parts.size >= 6 && parts[5].toIntOrNull() != null -> {
                    val angle = parts[5].toIntOrNull() ?: 135
                    orientation = angleToOrientation(angle)
                    c1Name = parts[1]; s1 = parts[2].toIntOrNull() ?: 128
                    c2Name = parts[3]; s2 = parts[4].toIntOrNull() ?: 128
                }
                // gradient-blue-100-red-200 (Default Diagonal)
                parts.size >= 5 -> {
                    orientation = GradientDrawable.Orientation.TL_BR
                    c1Name = parts[1]; s1 = parts[2].toIntOrNull() ?: 128
                    c2Name = parts[3]; s2 = parts[4].toIntOrNull() ?: 128
                }
                else -> return
            }

            val color1 = parseColor(c1Name, s1)
            val color2 = parseColor(c2Name, s2)
            Log.d("GradientRenderer", "color1=0x${Integer.toHexString(color1)} color2=0x${Integer.toHexString(color2)} from '$c1Name'/$s1 '$c2Name'/$s2")
            // Only skip if BOTH are fully transparent (0x00000000) — not just alpha=0 from Color.TRANSPARENT
            if (color1 == 0 && color2 == 0) {
                Log.w("GradientRenderer", "Both colors resolved to 0, skipping gradient")
                return
            }

            val gd = GradientDrawable(orientation, intArrayOf(color1, color2))
            if (radiusByte > 0) {
                val density = v.context.resources.displayMetrics.density
                gd.cornerRadius = if (radiusByte == 255) 9999f else (radiusByte * density)
            }
            v.background = gd

        } catch (e: Exception) {
            // Gradient parse failed — core rendering unaffected
        }
    }

    private fun angleToOrientation(angle: Int): GradientDrawable.Orientation {
        return when ((angle / 45) % 8) {
            0 -> GradientDrawable.Orientation.BOTTOM_TOP
            1 -> GradientDrawable.Orientation.BL_TR
            2 -> GradientDrawable.Orientation.LEFT_RIGHT
            3 -> GradientDrawable.Orientation.TL_BR
            4 -> GradientDrawable.Orientation.TOP_BOTTOM
            5 -> GradientDrawable.Orientation.TR_BL
            6 -> GradientDrawable.Orientation.RIGHT_LEFT
            else -> GradientDrawable.Orientation.BR_TL
        }
    }
}
