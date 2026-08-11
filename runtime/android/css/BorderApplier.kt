package io.dolphin.runtime

import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.view.View
import android.widget.LinearLayout
import com.google.android.material.button.MaterialButton
import com.google.android.material.card.MaterialCardView
import com.google.android.material.textfield.TextInputLayout

/**
 * 🔲 BorderApplier — Dedicated border stroke applier, corner clipping, and dynamic stroke color resolver.
 */
object BorderApplier {

    fun applyBorder(v: View?, borderStr: String, dpFunc: (Int) -> Int) {
        if (v == null || borderStr.isEmpty()) return
        v.setWillNotDraw(false)

        var bWidthDp = 1
        var bColorVal = if (DolphinStateEngine.themeLevel > 128) Color.parseColor("#475569") else Color.parseColor("#cbd5e1")

        val parts = borderStr.split("|")
        var bStyle = "solid"
        if (parts.isNotEmpty()) {
            val widthMatch = Regex("(\\d+)").find(parts[0])
            if (widthMatch != null) {
                bWidthDp = widthMatch.value.toInt()
            }
            if (parts.size > 1) {
                val sStr = parts[1].trim()
                if (sStr.isNotEmpty()) bStyle = sStr
            }
            if (parts.size > 2) {
                val cStr = parts[2].trim()
                if (cStr.isNotEmpty() && cStr != "none" && cStr != "transparent") {
                    try {
                        val hex = TailwindColorResolver.resolveHex(cStr)
                        bColorVal = Color.parseColor(hex)
                    } catch (_: Exception) {}
                }
            }
        }

        val isBottomOnly = borderStr.contains("bottom") || borderStr.contains("border-b") || borderStr.contains("_b") || borderStr.contains("|b|") || borderStr.contains("b|")
        if (isBottomOnly) {
            val gd = GradientDrawable().apply {
                shape = GradientDrawable.RECTANGLE
                setColor(Color.TRANSPARENT)
                setStroke(dpFunc(bWidthDp), bColorVal)
            }
            val inset = android.graphics.drawable.InsetDrawable(
                gd,
                -dpFunc(bWidthDp * 4),
                -dpFunc(bWidthDp * 4),
                -dpFunc(bWidthDp * 4),
                0
            )
            v.background = inset
            v.setWillNotDraw(false)
            return
        }

        if (bStyle == "inset" || bStyle == "outset") {
            fun blendColors(color1: Int, color2: Int, ratio: Float): Int {
                val inverseRatio = 1f - ratio
                val a = (Color.alpha(color1) * inverseRatio + Color.alpha(color2) * ratio).toInt()
                val r = (Color.red(color1) * inverseRatio + Color.red(color2) * ratio).toInt()
                val g = (Color.green(color1) * inverseRatio + Color.green(color2) * ratio).toInt()
                val b = (Color.blue(color1) * inverseRatio + Color.blue(color2) * ratio).toInt()
                return Color.argb(a, r, g, b)
            }
            
            val darkColor = blendColors(bColorVal, Color.BLACK, 0.3f)
            val lightColor = blendColors(bColorVal, Color.WHITE, 0.3f)
            
            val topLeftColor: Int = if (bStyle == "inset") darkColor else lightColor
            val bottomRightColor: Int = if (bStyle == "inset") lightColor else darkColor
            
            val gdBase = GradientDrawable().apply {
                shape = GradientDrawable.RECTANGLE
                setColor(Color.TRANSPARENT)
                setStroke(dpFunc(bWidthDp), bottomRightColor)
            }
            
            val gdTopLeft = GradientDrawable().apply {
                shape = GradientDrawable.RECTANGLE
                setColor(Color.TRANSPARENT)
                setStroke(dpFunc(bWidthDp), topLeftColor)
            }
            
            val insetTopLeft = android.graphics.drawable.InsetDrawable(
                gdTopLeft, 0, 0, dpFunc(bWidthDp), dpFunc(bWidthDp)
            )
            
            val layer = android.graphics.drawable.LayerDrawable(arrayOf(gdBase, insetTopLeft))
            v.background = layer
            v.setWillNotDraw(false)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                v.clipToOutline = true
            }
            return
        }

        val cardParent = v.parent as? MaterialCardView ?: (v as? MaterialCardView)
        if (cardParent != null) {
            if (cardParent.tag != "SelectContainer") {
                cardParent.strokeWidth = dpFunc(bWidthDp)
                cardParent.strokeColor = bColorVal
                cardParent.invalidate()
            }
        } else if (v is MaterialButton) {
            v.strokeWidth = dpFunc(bWidthDp)
            v.strokeColor = ColorStateList.valueOf(bColorVal)
        } else if (v is TextInputLayout || (v is LinearLayout && v.tag == "FormEngineRoot")) {
            if (v.tag == "FormEngineRoot") {
                val borderContainer = v.findViewWithTag<View>("FormBorderContainer")
                if (borderContainer != null) {
                    val borderGd = borderContainer.background as? GradientDrawable
                    borderGd?.setStroke(dpFunc(bWidthDp), bColorVal)
                }
            }
        } else {
            val gd = (v.background as? GradientDrawable) ?: GradientDrawable().apply {
                shape = GradientDrawable.RECTANGLE
                setColor(Color.TRANSPARENT)
                v.background = this
            }
            if (bStyle == "dashed") {
                gd.setStroke(dpFunc(bWidthDp), bColorVal, dpFunc(4).toFloat(), dpFunc(4).toFloat())
            } else if (bStyle == "dotted") {
                gd.setStroke(dpFunc(bWidthDp), bColorVal, dpFunc(2).toFloat(), dpFunc(2).toFloat())
            } else {
                gd.setStroke(dpFunc(bWidthDp), bColorVal)
            }
            v.setWillNotDraw(false)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                v.clipToOutline = true
            }
        }
    }
}
