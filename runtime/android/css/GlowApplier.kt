package io.dolphin.runtime

import android.graphics.Color
import android.os.Build
import android.view.View

object GlowApplier {
    fun apply(view: View, glowStyle: String) {
        if (glowStyle.isEmpty()) return

        // Parse glow style: e.g. "glow-neon", "glow-red-50", "glow"
        var colorHex = "#8B5CF6" // default neon purple

        val parts = glowStyle.split("-")
        if (parts.size >= 2) {
            val colorStr = parts[1]
            colorHex = when {
                colorStr.startsWith("#") -> colorStr
                colorStr == "neon" -> "#06B6D4"
                colorStr == "red" -> "#EF4444"
                colorStr == "blue" -> "#3B82F6"
                colorStr == "green" -> "#10B981"
                colorStr == "yellow" -> "#F59E0B"
                colorStr == "purple" -> "#8B5CF6"
                colorStr == "pink" -> "#EC4899"
                colorStr == "orange" -> "#F97316"
                colorStr == "teal" -> "#14B8A6"
                colorStr == "cyan" -> "#06B6D4"
                colorStr == "indigo" -> "#6366F1"
                colorStr == "rose" -> "#F43F5E"
                colorStr == "white" -> "#FFFFFF"
                else -> colorHex
            }
        }

        val parsedColor = try {
            Color.parseColor(colorHex)
        } catch (e: Exception) {
            Color.parseColor("#8B5CF6")
        }

        // Use standard native Android shadows to NEVER break the background or rounded corners
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            view.outlineAmbientShadowColor = parsedColor
            view.outlineSpotShadowColor = parsedColor
            
            // Required for shadows to actually render
            view.outlineProvider = android.view.ViewOutlineProvider.BACKGROUND
            view.clipToOutline = false
            
            // Force elevation for the glow to appear
            if (view.elevation == 0f) {
                view.elevation = 20 * view.context.resources.displayMetrics.density
            }
        }
    }
}
