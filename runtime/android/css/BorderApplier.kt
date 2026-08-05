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
        if (parts.isNotEmpty()) {
            val widthMatch = Regex("(\\d+)").find(parts[0])
            if (widthMatch != null) {
                bWidthDp = widthMatch.value.toInt()
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
            gd.setStroke(dpFunc(bWidthDp), bColorVal)
            v.setWillNotDraw(false)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                v.clipToOutline = true
            }
        }
    }
}
