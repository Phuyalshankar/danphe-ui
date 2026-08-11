package io.dolphin.runtime

import android.graphics.Color
import android.graphics.RenderEffect
import android.graphics.Shader
import android.graphics.drawable.ColorDrawable
import android.graphics.drawable.LayerDrawable
import android.os.Build
import android.view.View

object GlassmorphismApplier {
    fun apply(view: View, glassStyle: String) {
        if (glassStyle.isEmpty()) return

        // Parse glass style: e.g. "glass-red-10", "glass", "glass-blue-50"
        var colorHex = if (DolphinStateEngine.themeLevel > 128) "#000000" else "#FFFFFF"
        var alpha = 0.1f // Default 10%

        val parts = glassStyle.split("-")
        if (parts.size >= 2) {
            val colorStr = parts[1]
            colorHex = when {
                colorStr.startsWith("#") -> colorStr
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
                colorStr == "slate" || colorStr == "gray" -> "#64748B"
                colorStr == "black" -> "#000000"
                colorStr == "white" -> "#FFFFFF"
                else -> colorHex
            }

            if (parts.size >= 3) {
                alpha = (parts[2].toIntOrNull() ?: 10) / 100f
            }
        }

        val parsedColor = try {
            Color.parseColor(colorHex)
        } catch (e: Exception) {
            Color.WHITE
        }

        val alphaInt = (alpha * 255).toInt().coerceIn(0, 255)
        val overlayColor = Color.argb(alphaInt, Color.red(parsedColor), Color.green(parsedColor), Color.blue(parsedColor))

        val currentBg = view.background
        if (currentBg is android.graphics.drawable.GradientDrawable) {
            // Keep the existing corners and border intact, just change the background color
            currentBg.setColor(overlayColor)
        } else {
            // If there's no GradientDrawable yet, create one
            val gd = android.graphics.drawable.GradientDrawable()
            gd.setColor(overlayColor)
            view.background = gd
        }
        view.clipToOutline = true
    }
}
