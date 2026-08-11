package io.dolphin.runtime



import android.content.Context
import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.Spinner
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.core.graphics.ColorUtils
import com.google.android.material.button.MaterialButton
import com.google.android.material.card.MaterialCardView
import com.google.android.material.textfield.TextInputLayout

fun isViewInsideScrollView(v: View): Boolean {
    var p = v.parent
    while (p != null) {
        if (p is android.widget.ScrollView || p is DolphinScrollView) return true
        p = p.parent
    }
    return false
}

private fun getParentBackgroundColor(v: View): Int {
    var p: android.view.ViewParent? = v.parent
    var depth = 0
    while (p is View && depth < 3) {
        val parentView = p as View
        val bg = parentView.background
        if (bg is android.graphics.drawable.ColorDrawable) {
            val color = bg.color
            if (color != 0 && (color and 0xFF000000.toInt()) != 0) {
                return color
            }
        } else if (parentView is com.google.android.material.card.MaterialCardView) {
            val cardBg = parentView.cardBackgroundColor.defaultColor
            if (cardBg != 0 && cardBg != Color.TRANSPARENT) {
                return cardBg
            }
        }
        p = parentView.parent
        depth++
    }
    return 0
}

fun ViewFactory.applyTextStyles(v: TextView, bin: ByteArray) {
    if (v is EditText) return
    val colorCode = bin[13].toInt() and 0xFF
    val colorShade = bin[12].toInt() and 0x1F

    if (colorCode != 0) {
        val finalShade = when (colorShade) {
            31 -> 254
            30 -> 253
            29 -> 252
            else -> colorShade * 8
        }
        val textColor = ColorParser.parseColor(colorCode, finalShade)
        if (textColor != 0) v.setTextColor(textColor)
    } else {
        val hasBg = (bin[3].toInt() and 0xFF) != 0
        if (hasBg) {
            v.setTextColor(Color.WHITE)
        } else {
            val isDark = DolphinStateEngine.themeLevel > 128
            v.setTextColor(if (isDark) Color.WHITE else Color.parseColor("#0f172a"))
        }
    }
}

fun ViewFactory.applyTextStylesToChildren(parent: ViewGroup, bin: ByteArray) {
    for (i in 0 until parent.childCount) {
        val child = parent.getChildAt(i)
        if (child is TextView && child !is android.widget.Button && child !is android.widget.EditText) {
            val colorCode = bin[13].toInt() and 0xFF
            if (colorCode != 0) {
                applyTextStyles(child, bin)
            } else {
                child.setTextColor(ColorParser.parseColor(1, 253))
            }
        } else if (child is ViewGroup) {
            applyTextStylesToChildren(child, bin)
        }
    }
}

fun ViewFactory.applySize(v: View, sizeStr: String) {
    val parts = sizeStr.split('|')
    if (parts.size < 2) return

    val w = parts[0].toIntOrNull() ?: 0
    val h = parts[1].toIntOrNull() ?: 0
    val elevation = if (parts.size > 2) parts[2].toIntOrNull() ?: -1 else -1
    val fontSize = if (parts.size > 3) parts[3].toIntOrNull() ?: 0 else 0
    val opacity = if (parts.size > 4) parts[4].toFloatOrNull() ?: 1.0f else 1.0f
    val glassStyle = if (parts.size > 5) parts[5] else ""
    val glowStyle = if (parts.size > 6) parts[6] else ""

    if (opacity < 1.0f) {
        v.alpha = opacity
    } else {
        v.alpha = 1.0f
    }

    if (glassStyle.isNotEmpty()) {
        GlassmorphismApplier.apply(v, glassStyle)
    }

    if (glowStyle.isNotEmpty()) {
        GlowApplier.apply(v, glowStyle)
    }

    if (fontSize > 0 && v is TextView) {
        v.textSize = fontSize.toFloat()
    }

    if (w != 0 || h != 0) {
        var lp = v.layoutParams
        if (lp == null) {
            lp = LinearLayout.LayoutParams(
                if (w == -1) ViewGroup.LayoutParams.MATCH_PARENT else ViewGroup.LayoutParams.WRAP_CONTENT,
                if (h == -1) ViewGroup.LayoutParams.MATCH_PARENT else ViewGroup.LayoutParams.WRAP_CONTENT
            )
        }
        if (w == -1) lp.width = ViewGroup.LayoutParams.MATCH_PARENT
        else if (w > 0) lp.width = dp(w)

        if (h == -1) lp.height = ViewGroup.LayoutParams.MATCH_PARENT
        else if (h > 0) lp.height = dp(h)

        v.layoutParams = lp
    }

    if (elevation >= 0) {
        if (v is MaterialCardView) {
            v.cardElevation = dp(elevation).toFloat()
            v.maxCardElevation = dp(elevation + 2).toFloat()
        } else {
            v.elevation = dp(elevation).toFloat()
        }
    }
}

fun ViewFactory.applyStyles(v: View, bin: ByteArray) {
    if (v is EditText) {
        val pt = bin[4].toInt() and 0xFF
        val pr = bin[5].toInt() and 0xFF
        val pb = bin[6].toInt() and 0xFF
        val pl = bin[7].toInt() and 0xFF
        if (pt > 0 || pr > 0 || pb > 0 || pl > 0) {
            v.setPadding(dp(pl), dp(pt), dp(pr), dp(pb))
        }
        return
    }

    val mt = bin[8].toInt() and 0xFF
    val mr = bin[9].toInt() and 0xFF
    val mb = bin[10].toInt() and 0xFF
    val ml = bin[11].toInt() and 0xFF

    var lp = v.layoutParams
    if (lp == null) {
        val isFullWidthView = v is LinearLayout || v is MaterialCardView || v is EditText || v is FrameLayout || v is TitanCanvas || v.javaClass.simpleName.contains("Canvas")
        val w = if (isFullWidthView) ViewGroup.LayoutParams.MATCH_PARENT else ViewGroup.LayoutParams.WRAP_CONTENT
        lp = LinearLayout.LayoutParams(w, ViewGroup.LayoutParams.WRAP_CONTENT)
    }

    if (lp is ViewGroup.MarginLayoutParams) {
        val left = if (ml > 0) dp(ml) else lp.leftMargin
        val top = if (mt > 0) dp(mt) else lp.topMargin
        val right = if (mr > 0) dp(mr) else lp.rightMargin
        val bottom = if (mb > 0) dp(mb) else lp.bottomMargin
        lp.setMargins(left, top, right, bottom)
    }

    v.layoutParams = lp

    val flex = (bin[0].toInt() shr 4) and 0x0F
    if (flex > 0 && lp is LinearLayout.LayoutParams) {
        lp.weight = flex.toFloat()
        if (lp.width <= 0) lp.width = ViewGroup.LayoutParams.MATCH_PARENT
        if (lp.height <= 0) lp.height = ViewGroup.LayoutParams.WRAP_CONTENT
    }

    val base = ColorParser.parseColor(bin[3].toInt() and 0xFF, bin[2].toInt() and 0xFF)
    val hasBg = (bin[3].toInt() and 0xFF) != 0
    val radiusVal = bin[14].toInt() and 0xFF
    val sig = bin[15].toInt() and 0xFF
    val hasBorder = (sig and 0x04) != 0

    if (v is MaterialCardView) {
        if (v.tag == "SelectContainer") {
            val level = DolphinStateEngine.themeLevel
            val isDark = level > 128
            val containerBg = if (isDark) Color.parseColor("#1e293b") else Color.WHITE
            val containerStroke = if (isDark) Color.parseColor("#334155") else Color.parseColor("#e5e7eb")
            
            v.setCardBackgroundColor(ColorStateList.valueOf(containerBg))
            v.strokeColor = containerStroke
            v.strokeWidth = dp(1)

            val inner = v.getChildAt(0) as? ViewGroup
            val spinner = inner?.getChildAt(0) as? Spinner
            if (spinner != null) {
                val itemTextColor = if (isDark) Color.WHITE else Color.parseColor("#1e293b")
                (spinner.adapter as? android.widget.ArrayAdapter<*>)?.notifyDataSetChanged()
                for (i in 0 until spinner.childCount) {
                    val child = spinner.getChildAt(i)
                    if (child is TextView) {
                        child.setTextColor(itemTextColor)
                    }
                }
            }
        } else {
            val isDarkCard = DolphinStateEngine.themeLevel > 128
            val cardBg = if (hasBg) base else (if (isDarkCard) Color.parseColor("#1e293b") else Color.WHITE)
            v.setCardBackgroundColor(ColorStateList.valueOf(cardBg))
            if (radiusVal > 0) v.radius = dp(radiusVal).toFloat()

            val strokeClr = ColorTokens.getCardBorder(isDarkCard)
            v.strokeWidth = dp(1)
            v.strokeColor = strokeClr
        }

        v.useCompatPadding = true
        v.preventCornerOverlap = true
        if (v.contentPaddingLeft == 0 && v.contentPaddingTop == 0) {
            val pad = dp(12)
            v.setContentPadding(pad, pad, pad, pad)
        }
        v.stateListAnimator = null

        val outValue = TypedValue()
        ctx.theme.resolveAttribute(android.R.attr.selectableItemBackground, outValue, true)
        v.foreground = ContextCompat.getDrawable(ctx, outValue.resourceId)
        v.isClickable = true
        v.isFocusable = true

    } else if (v is MaterialButton) {
        if (hasBg) {
            v.backgroundTintList = ColorStateList.valueOf(base)
            if (base == Color.TRANSPARENT) {
                v.backgroundTintList = ColorStateList.valueOf(Color.TRANSPARENT)
                v.background = null
            }
        } else {
            v.backgroundTintList = null
            v.background = null
        }

        if (radiusVal > 0) v.cornerRadius = dp(radiusVal)

        if (hasBorder) {
            v.strokeWidth = dp(1)
            val isDarkBtn = DolphinStateEngine.themeLevel > 128
            v.strokeColor = ColorStateList.valueOf(if (isDarkBtn) Color.parseColor("#475569") else Color.parseColor("#cccccc"))
        } else {
            v.strokeWidth = 0
            v.strokeColor = ColorStateList.valueOf(Color.TRANSPARENT)
        }
        
        v.insetTop = 0
        v.insetBottom = 0
        v.elevation = 0f
        v.stateListAnimator = null
    } else if (v is TextInputLayout || (v is LinearLayout && v.tag == "FormEngineRoot")) {
        if (v.tag == "FormEngineRoot") {
            val borderContainer = v.findViewWithTag<View>("FormBorderContainer")
            if (borderContainer != null) {
                val radius = if (radiusVal > 0) radiusVal else 8
                val borderGd = borderContainer.background as? GradientDrawable ?: GradientDrawable().apply {
                    shape = GradientDrawable.RECTANGLE
                    cornerRadius = dp(radius).toFloat()
                }
                if (hasBg) {
                    borderGd.setColor(base)
                }
                if (hasBorder) {
                    val level = DolphinStateEngine.themeLevel
                    val strokeColor = if (level > 128) Color.parseColor("#475569") else Color.parseColor("#d1d5db")
                    borderGd.setStroke(dp(1), strokeColor)
                }
                borderContainer.background = borderGd
            }
        }
    } else if (v is EditText || v is android.widget.CheckBox || v is android.widget.RadioButton || v is TextView || (v is ViewGroup && v.tag != "TextFieldContainer")) {
        if (radiusVal > 0 || hasBg || hasBorder) {
            val gd = (v.background as? GradientDrawable) ?: GradientDrawable().apply {
                shape = GradientDrawable.RECTANGLE
            }
            if (hasBg) {
                gd.setColor(base)
            }
            if (radiusVal > 0) {
                if (radiusVal == 254 || radiusVal == 255) {
                    gd.cornerRadius = dp(50).toFloat()
                } else {
                    gd.cornerRadius = dp(radiusVal).toFloat()
                }
            }
            if (hasBorder) {
                val isDarkBorder = DolphinStateEngine.themeLevel > 128
                val strokeColor = if (isDarkBorder) Color.parseColor("#475569") else Color.parseColor("#cbd5e1")
                gd.setStroke(dp(1), strokeColor)
            }
            v.background = gd
            v.setWillNotDraw(false)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                v.clipToOutline = true
            }
        }

        if (v.isClickable) {
            val outValue = TypedValue()
            ctx.theme.resolveAttribute(android.R.attr.selectableItemBackground, outValue, true)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                v.foreground = ContextCompat.getDrawable(ctx, outValue.resourceId)
            }
        }
    }

    val pt = bin[4].toInt() and 0xFF
    val pr = bin[5].toInt() and 0xFF
    val pb = bin[6].toInt() and 0xFF
    val pl = bin[7].toInt() and 0xFF

    // Skip padding for tabbar — TabBuilder manages its own fixed compact padding
    val isTabbar = v.tag == "tabbar"
    if (!isTabbar && (pt > 0 || pr > 0 || pb > 0 || pl > 0)) {
        if (v is MaterialCardView) {
            v.setContentPadding(dp(pl), dp(pt), dp(pr), dp(pb))
        } else {
            v.setPadding(dp(pl), dp(pt), dp(pr), dp(pb))
        }
    }
    
    if (v is TextView) {
        val gravity = bin[0].toInt() and 0x03
        when (gravity) {
            0x02 -> v.gravity = Gravity.CENTER
            0x03 -> v.gravity = Gravity.END or Gravity.CENTER_VERTICAL
            else -> v.gravity = Gravity.START or Gravity.CENTER_VERTICAL
        }
    }
}

fun ViewFactory.applyInputStyles(container: View, input: View, bin: ByteArray) {
    if (input is EditText) return
    val mt = bin[8].toInt() and 0xFF
    val mr = bin[9].toInt() and 0xFF
    val mb = bin[10].toInt() and 0xFF
    val ml = bin[11].toInt() and 0xFF

    var lp = container.layoutParams
    if (lp == null) {
        lp = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
    }
    if (lp is ViewGroup.MarginLayoutParams) {
        lp.setMargins(dp(ml), dp(mt), dp(mr), dp(mb))
    }

    val flex = (bin[0].toInt() shr 4) and 0x0F
    if (flex > 0 && lp is LinearLayout.LayoutParams) {
        lp.weight = flex.toFloat()
    }
    container.layoutParams = lp

    val base = ColorParser.parseColor(bin[3].toInt() and 0xFF, bin[2].toInt() and 0xFF)
    val bgColor = if (base != 0) base else Color.WHITE
    val radiusVal = bin[14].toInt() and 0xFF
    val cornerPx  = if (radiusVal > 0) dp(radiusVal).toFloat() else dp(8).toFloat()

    fun makeBorderDrawable(strokeColor: Int): GradientDrawable {
        val gd = GradientDrawable()
        gd.setColor(bgColor)
        gd.cornerRadius = cornerPx
        gd.setStroke(dp(1), strokeColor)
        return gd
    }

    val isDarkInputMode = DolphinStateEngine.themeLevel > 128
    val borderNormal = if (isDarkInputMode) Color.parseColor("#334155") else Color.parseColor("#e5e7eb")
    val borderFocus  = Color.parseColor("#3b82f6")

    if (container is TextInputLayout) {
        input.background = null
    } else {
        container.background = makeBorderDrawable(borderNormal)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            container.clipToOutline = true
        }
        input.background = null

        input.setOnFocusChangeListener { _, hasFocus ->
            container.background = makeBorderDrawable(
                if (hasFocus) borderFocus else borderNormal
            )
        }
    }

    val pt = bin[4].toInt() and 0xFF
    val pr = bin[5].toInt() and 0xFF
    val pb = bin[6].toInt() and 0xFF
    val pl = bin[7].toInt() and 0xFF

    val padH = if (pl > 0 || pr > 0) 0 else dp(12)
    val padV = if (pt > 0 || pb > 0) 0 else dp(10)

    input.setPadding(
        if (pl > 0) dp(pl) else padH,
        if (pt > 0) dp(pt) else padV,
        if (pr > 0) dp(pr) else padH,
        if (pb > 0) dp(pb) else padV
    )

    val colorCode = bin[13].toInt() and 0xFF
    val colorShade = bin[12].toInt() and 0xFF
    if (colorCode != 0 && input is TextView) {
        val textColor = ColorParser.parseColor(colorCode, colorShade)
        if (textColor != 0) {
            input.setTextColor(textColor)
            input.setHintTextColor(ColorUtils.setAlphaComponent(textColor, 128))
        }
    } else if (input is TextView) {
        val isDarkMode = DolphinStateEngine.themeLevel > 128
        input.setTextColor(if (isDarkMode) Color.parseColor("#f1f5f9") else Color.parseColor("#111827"))
        input.setHintTextColor(if (isDarkMode) Color.parseColor("#64748b") else Color.parseColor("#9ca3af"))
    }
}

fun ViewFactory.applyCustomBorder(v: View?, borderStr: String) {
    if (v == null || borderStr.isEmpty()) return
    v.setWillNotDraw(false)
    
    var bWidthDp = 1
    var bColorVal = if (DolphinStateEngine.themeLevel > 128) Color.parseColor("#475569") else Color.parseColor("#e2e8f0")

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
                    bColorVal = if (cStr.startsWith("#")) {
                        Color.parseColor(cStr)
                    } else if (cStr.contains("slate-200") || cStr.contains("gray-200") || cStr.contains("zinc-200")) {
                        Color.parseColor("#e2e8f0")
                    } else if (cStr.contains("slate-700") || cStr.contains("gray-700")) {
                        Color.parseColor("#334155")
                    } else if (cStr.contains("blue-500") || cStr.contains("blue-600")) {
                        Color.parseColor("#2563eb")
                    } else {
                        Color.parseColor(cStr)
                    }
                } catch (e: Exception) {}
            }
        }
    }

    val isBottomOnly = borderStr.contains("bottom") || borderStr.contains("border-b") || borderStr.contains("_b") || borderStr.contains("|b|") || borderStr.contains("b|")
    if (isBottomOnly) {
        val gd = GradientDrawable().apply {
            shape = GradientDrawable.RECTANGLE
            setColor(Color.TRANSPARENT)
            setStroke(dp(bWidthDp), bColorVal)
        }
        val inset = android.graphics.drawable.InsetDrawable(
            gd,
            -dp(bWidthDp * 4),
            -dp(bWidthDp * 4),
            -dp(bWidthDp * 4),
            0
        )
        v.background = inset
        v.setWillNotDraw(false)
        return
    }

    val cardParent = v.parent as? MaterialCardView ?: (v as? MaterialCardView)
    if (cardParent != null) {
        if (cardParent.tag != "SelectContainer") {
            cardParent.strokeWidth = dp(bWidthDp)
            cardParent.strokeColor = bColorVal
            cardParent.invalidate()
        }
    } else if (v is MaterialButton) {
        v.strokeWidth = dp(bWidthDp)
        v.strokeColor = ColorStateList.valueOf(bColorVal)
    } else if (v is TextInputLayout || (v is LinearLayout && v.tag == "FormEngineRoot")) {
        if (v.tag == "FormEngineRoot") {
            val borderContainer = v.findViewWithTag<View>("FormBorderContainer")
            if (borderContainer != null) {
                val borderGd = borderContainer.background as? GradientDrawable
                borderGd?.setStroke(dp(bWidthDp), bColorVal)
            }
        }
    } else {
        val gd = (v.background as? GradientDrawable) ?: GradientDrawable().apply {
            shape = GradientDrawable.RECTANGLE
            setColor(Color.TRANSPARENT)
            v.background = this
        }
        if (bStyle == "dashed") {
            gd.setStroke(dp(bWidthDp), bColorVal, dp(4).toFloat(), dp(4).toFloat())
        } else if (bStyle == "dotted") {
            gd.setStroke(dp(bWidthDp), bColorVal, dp(2).toFloat(), dp(2).toFloat())
        } else {
            gd.setStroke(dp(bWidthDp), bColorVal)
        }
        v.setWillNotDraw(false)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            v.clipToOutline = true
        }
    }
}

fun ViewFactory.applyGravity(l: LinearLayout, bin: ByteArray) {
    val g = bin[0].toInt() and 0x0F
    if (g == 0 || g == 0xFF) return
    val isHorizontal = l.orientation == LinearLayout.HORIZONTAL

    l.gravity = when (g) {
        1 -> if (isHorizontal) Gravity.START or Gravity.CENTER_VERTICAL else Gravity.START
        2 -> Gravity.CENTER
        3 -> if (isHorizontal) Gravity.END or Gravity.CENTER_VERTICAL else Gravity.END or Gravity.CENTER_HORIZONTAL
        else -> Gravity.TOP or Gravity.START
    }
}

fun ViewFactory.resolveColorFromBin(bin: ByteArray): Int {
    try {
        val colorCode = bin[13].toInt() and 0xFF
        val colorShade = bin[12].toInt() and 0x1F
        if (colorCode != 0) {
            val finalShade = when (colorShade) {
                31 -> 254
                30 -> 253
                29 -> 252
                else -> (colorShade * 255) / 31
            }
            return ColorParser.parseColor(colorCode, finalShade)
        }
    } catch (e: Exception) {}
    return 0
}

fun ViewFactory.mapColorNameToCode(name: String): Int {
    if (name.startsWith("theme-")) return 1
    return when (name.lowercase()) {
        "white" -> 10
        "black" -> 9
        "blue" -> 1
        "green" -> 2
        "indigo" -> 3
        "red" -> 4
        "orange" -> 5
        "amber" -> 6
        "gray" -> 7
        "teal" -> 8
        "cyan" -> 11
        "pink" -> 12
        "purple" -> 13
        "yellow" -> 14
        "lime" -> 15
        "rose" -> 16
        "fuchsia" -> 17
        "violet" -> 18
        "sky" -> 19
        "emerald" -> 20
        "slate" -> 21
        "zinc" -> 22
        "transparent" -> 23
        "darkblue" -> 24
        else -> 1
    }
}

fun ViewFactory.updatePaddingInPlace(v: View, bin: ByteArray) {
    if (v.tag == "tabbar") return
    val pt = bin[4].toInt() and 0xFF
    val pr = bin[5].toInt() and 0xFF
    val pb = bin[6].toInt() and 0xFF
    val pl = bin[7].toInt() and 0xFF
    if (v is MaterialCardView) {
        v.setContentPadding(dp(pl), dp(pt), dp(pr), dp(pb))
    } else {
        v.setPadding(dp(pl), dp(pt), dp(pr), dp(pb))
    }
}

fun ViewFactory.updateMarginInPlace(v: View, bin: ByteArray) {
    if (v.tag == "tabbar") return
    val mt = bin[8].toInt() and 0xFF
    val mr = bin[9].toInt() and 0xFF
    val mb = bin[10].toInt() and 0xFF
    val ml = bin[11].toInt() and 0xFF
    val lp = v.layoutParams as? ViewGroup.MarginLayoutParams ?: return
    lp.setMargins(dp(ml), dp(mt), dp(mr), dp(mb))
    v.layoutParams = lp
}

fun ViewFactory.updateBackgroundInPlace(v: View, bin: ByteArray) {
    val colorCode = bin[3].toInt() and 0xFF
    val colorShade = bin[2].toInt() and 0xFF

    val base = if (colorCode != 0) ColorParser.parseColor(colorCode, colorShade) else 0

    if (v is MaterialCardView) {
        v.setCardBackgroundColor(ColorStateList.valueOf(base))
    } else if (v is MaterialButton) {
        v.backgroundTintList = ColorStateList.valueOf(base)
    } else {
        val bg = v.background
        if (bg is GradientDrawable) {
            bg.setColor(base)
        } else {
            v.setBackgroundColor(base)
        }
    }
}

fun ViewFactory.updateBorderRadiusInPlace(v: View, bin: ByteArray) {
    val radiusVal = bin[14].toInt() and 0xFF
    if (radiusVal == 0) return

    val radPx = if (radiusVal == 254 || radiusVal == 255) dp(50).toFloat() else dp(radiusVal).toFloat()
    if (v is MaterialCardView) {
        v.radius = radPx
    } else {
        val bg = v.background
        if (bg is GradientDrawable) {
            bg.cornerRadius = radPx
        }
    }
}

fun ViewFactory.applyStylesInPlace(v: View, bin: ByteArray, changedBytes: ByteArray? = null) {
    updatePaddingInPlace(v, bin)
    updateMarginInPlace(v, bin)
    updateBackgroundInPlace(v, bin)
    updateBorderRadiusInPlace(v, bin)
    v.invalidate()
    v.requestLayout()
}
