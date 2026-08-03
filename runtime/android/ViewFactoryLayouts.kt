package io.dolphin.runtime

import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.ScrollView
import android.content.res.ColorStateList
import android.graphics.Color
import com.google.android.material.card.MaterialCardView

/**
 * Extension file for ViewFactory containing Layout Containers.
 */

private fun ViewFactory.getOrCreateLinearLayoutParams(
    child: View,
    defaultWidth: Int = ViewGroup.LayoutParams.MATCH_PARENT,
    defaultHeight: Int = ViewGroup.LayoutParams.WRAP_CONTENT
): LinearLayout.LayoutParams {
    val existing = child.layoutParams
    if (existing is LinearLayout.LayoutParams) {
        return existing
    }
    
    val width = if (existing != null && existing.width != 0) existing.width else defaultWidth
    val height = if (existing != null && existing.height != 0) existing.height else defaultHeight
    
    val lp = LinearLayout.LayoutParams(width, height)
    if (existing is ViewGroup.MarginLayoutParams) {
        lp.setMargins(existing.leftMargin, existing.topMargin, existing.rightMargin, existing.bottomMargin)
    }
    return lp
}

/**
 * 🐬 CRITICAL GAP LOCK — DO NOT REMOVE OR ALTER!
 * Enforces minimum margin on children without reassigning layoutParams (which triggers recursive relayouts
 * and can reset MATCH_PARENT width/height on TextInputLayout and other complex views).
 * Uses requestLayout() only if margin actually changed.
 */
private fun enforceVerticalGap(vg: ViewGroup, gapPx: Int) {
    for (idx in 1 until vg.childCount) {
        val c = vg.getChildAt(idx)
        val lp = c.layoutParams as? ViewGroup.MarginLayoutParams ?: continue
        if (lp.topMargin < gapPx) {
            lp.topMargin = gapPx
        }
    }
}

private fun enforceHorizontalGap(vg: ViewGroup, gapPx: Int) {
    for (idx in 1 until vg.childCount) {
        val c = vg.getChildAt(idx)
        val lp = c.layoutParams as? ViewGroup.MarginLayoutParams ?: continue
        if (lp.leftMargin < gapPx) {
            lp.leftMargin = gapPx
        }
    }
}

fun ViewFactory.createListView(bin: ByteArray): View {
    val action = nextStr() // Read action string
    
    val scrollView = DolphinScrollView(ctx).apply {
        layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT, 1f)
        isFillViewport = true
        
        if (action.isNotEmpty()) {
            isClickable = true
            isFocusable = true
            setOnClickListener { onAction?.invoke(action, "ListView") }
        }
    }
    
    val layout = LinearLayout(ctx).apply {
        orientation = LinearLayout.VERTICAL
        applyStyles(this, bin)
        val pt = bin[4].toInt() and 0xFF
        val pr = bin[5].toInt() and 0xFF
        val pb = bin[6].toInt() and 0xFF
        val pl = bin[7].toInt() and 0xFF
        if (pt > 0 || pr > 0 || pb > 0 || pl > 0) {
            setPadding(dp(pl), dp(pt), dp(pr), dp(pb))
        }
        layoutParams = FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        
        val count = bin[13].toInt() and 0xFF
        val gap = (bin[12].toInt() shr 4) and 0x0F
        
        repeat(count) { i ->
            buildComp()?.let { child ->
                val clp = getOrCreateLinearLayoutParams(child, ViewGroup.LayoutParams.MATCH_PARENT)
                if (gap > 0 && i > 0) clp.topMargin = dp(gap * 4)
                child.layoutParams = clp
                addView(child)
            }
        }

        // 🐬 CRITICAL KOTLIN LAYOUT LIFECYCLE LOCK — DO NOT REMOVE OR ALTER!
        if (gap > 0) {
            val gapPx = dp(gap * 4)
            addOnLayoutChangeListener { vg, _, _, _, _, _, _, _, _ ->
                if (vg is ViewGroup) enforceVerticalGap(vg, gapPx)
            }
        }
    }
    
    scrollView.addView(layout)
    return scrollView
}

fun ViewFactory.createColumn(bin: ByteArray, isCard: Boolean = false): View {
    val action = nextStr()
    val sig = bin[15].toInt() and 0xFF
    val justifyBetween = (sig and 0x20) != 0
    
    val layout = if (isCard) {
        MaterialCardView(ctx).apply {
            radius = dp(12).toFloat()
            cardElevation = dp(6).toFloat()
            val isDark = DolphinStateEngine.themeLevel > 128
            val cardBgColor = if (isDark) Color.parseColor("#1e293b") else Color.WHITE
            setCardBackgroundColor(ColorStateList.valueOf(cardBgColor))
            useCompatPadding = true
            preventCornerOverlap = true

            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        }
    } else {
        LinearLayout(ctx).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        }
    }

    if (action.isNotEmpty()) {
        layout.isClickable = true
        layout.isFocusable = true
        layout.setOnClickListener { onAction?.invoke(action, if (isCard) "Card" else "Column") }
    }

    val inner = if (isCard) {
        val l = LinearLayout(ctx)
        l.orientation = if ((bin[12].toInt() and 0x0F) == 1) LinearLayout.HORIZONTAL else LinearLayout.VERTICAL
        applyGravity(l, bin)
        val lp = FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        l.layoutParams = lp
        val pt = bin[4].toInt() and 0xFF
        val pr = bin[5].toInt() and 0xFF
        val pb = bin[6].toInt() and 0xFF
        val pl = bin[7].toInt() and 0xFF
        val padT = if (pt > 0) dp(pt) else dp(12)
        val padR = if (pr > 0) dp(pr) else dp(12)
        val padB = if (pb > 0) dp(pb) else dp(12)
        val padL = if (pl > 0) dp(pl) else dp(12)
        l.setPadding(padL, padT, padR, padB)
        l.setBackgroundColor(Color.TRANSPARENT) 
        (layout as MaterialCardView).addView(l)
        l
    } else {
        val l = layout as LinearLayout
        l.orientation = if ((bin[12].toInt() and 0x0F) == 1) LinearLayout.HORIZONTAL else LinearLayout.VERTICAL
        applyGravity(l, bin)
        l
    }
    
    applyStyles(layout, bin)
    
    val count = bin[13].toInt() and 0xFF
    val orientation = bin[12].toInt() and 0x0F
    val gap = (bin[12].toInt() shr 4) and 0x0F
    
    var hasWeightedChild = false

    repeat(count) { i ->
        buildComp()?.let { child ->
            val isChildContainer = child is android.view.ViewGroup
            val defaultW = if (isChildContainer) ViewGroup.LayoutParams.MATCH_PARENT else ViewGroup.LayoutParams.WRAP_CONTENT
            val clp = getOrCreateLinearLayoutParams(child, defaultW)
            
            if (orientation == 1) {
                // Horizontal Column (Flex Row behavior)
                if (clp.weight > 0) {
                    clp.width = ViewGroup.LayoutParams.WRAP_CONTENT
                }
                if (gap > 0 && i > 0) clp.leftMargin = dp(gap * 4)
            } else {
                // Vertical Column
                if (clp.weight > 0) {
                    clp.height = ViewGroup.LayoutParams.WRAP_CONTENT
                    clp.width = ViewGroup.LayoutParams.MATCH_PARENT
                    hasWeightedChild = true
                }
                if (gap > 0 && i > 0) clp.topMargin = dp(gap * 4)
            }
            if (justifyBetween && i > 0) {
                val spacer = View(ctx).apply {
                    layoutParams = LinearLayout.LayoutParams(0, 0, 1f)
                }
                if (inner is ViewGroup) inner.addView(spacer)
            }
            if (inner is ViewGroup) {
                inner.addView(child, clp)
            }
        }
    }

    // 🐬 CRITICAL KOTLIN LAYOUT LIFECYCLE LOCK — DO NOT REMOVE OR ALTER!
    // Uses safe enforceGap helpers that modify margin fields directly without reassigning layoutParams,
    // preventing MATCH_PARENT resets on TextInputLayout, HorizontalScrollView, and other complex views.
    if (gap > 0) {
        val gapPx = dp(gap * 4)
        val targetVg = (if (isCard) inner else layout) as? ViewGroup
        if (orientation == 1) {
            targetVg?.addOnLayoutChangeListener { vg, _, _, _, _, _, _, _, _ ->
                if (vg is ViewGroup) enforceHorizontalGap(vg, gapPx)
            }
        } else {
            targetVg?.addOnLayoutChangeListener { vg, _, _, _, _, _, _, _, _ ->
                if (vg is ViewGroup) enforceVerticalGap(vg, gapPx)
            }
        }
    }

    if (layout.layoutParams == null) {
        layout.layoutParams = LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        )
    }

    return layout
}

fun ViewFactory.createRow(bin: ByteArray): View {
    val action = nextStr()
    val sig = bin[15].toInt() and 0xFF
    val justifyBetween = (sig and 0x20) != 0

    val layout = LinearLayout(ctx).apply {
        orientation = LinearLayout.HORIZONTAL
        layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        
        if (action.isNotEmpty()) {
            isClickable = true
            isFocusable = true
            setOnClickListener { onAction?.invoke(action, "Row") }
        }
        
        applyStyles(this, bin)
        applyGravity(this, bin)
    }
    
    val count = bin[13].toInt() and 0xFF
    val gap = (bin[12].toInt() shr 4) and 0x0F
    repeat(count) { i ->
        buildComp()?.let { child ->
            val clp = getOrCreateLinearLayoutParams(child, ViewGroup.LayoutParams.WRAP_CONTENT)
            if (clp.weight > 0 || clp.width == ViewGroup.LayoutParams.MATCH_PARENT) {
                clp.width = ViewGroup.LayoutParams.WRAP_CONTENT
            }
            if (gap > 0 && i > 0) clp.leftMargin = dp(gap * 4)
            if (justifyBetween && i > 0) {
                val spacer = View(ctx).apply {
                    layoutParams = LinearLayout.LayoutParams(0, 0, 1f)
                }
                layout.addView(spacer)
            }
            layout.addView(child, clp)
        }
    }

    // 🐬 CRITICAL KOTLIN LAYOUT LIFECYCLE LOCK — DO NOT REMOVE OR ALTER!
    if (gap > 0) {
        val gapPx = dp(gap * 4)
        layout.addOnLayoutChangeListener { vg, _, _, _, _, _, _, _, _ ->
            if (vg is ViewGroup) enforceHorizontalGap(vg, gapPx)
        }
    }

    return layout
}

fun ViewFactory.createHorizontalListView(bin: ByteArray): View {
    val action = nextStr() // Read action string
    
    val scrollView = android.widget.HorizontalScrollView(ctx).apply {
        layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        isFillViewport = true
        isHorizontalScrollBarEnabled = false
        
        if (action.isNotEmpty()) {
            isClickable = true
            isFocusable = true
            setOnClickListener { onAction?.invoke(action, "HorizontalListView") }
        }
    }
    
    val layout = LinearLayout(ctx).apply {
        orientation = LinearLayout.HORIZONTAL
        layoutParams = FrameLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        applyStyles(this, bin)
        
        val count = bin[13].toInt() and 0xFF
        val gap = (bin[12].toInt() shr 4) and 0x0F
        
        repeat(count) { i ->
            buildComp()?.let { child ->
                val clp = getOrCreateLinearLayoutParams(child, ViewGroup.LayoutParams.WRAP_CONTENT)
                clp.width = ViewGroup.LayoutParams.WRAP_CONTENT
                if (gap > 0 && i > 0) clp.leftMargin = dp(gap * 4)
                child.layoutParams = clp
                addView(child)
            }
        }

        // 🐬 CRITICAL KOTLIN LAYOUT LIFECYCLE LOCK — DO NOT REMOVE OR ALTER!
        if (gap > 0) {
            val gapPx = dp(gap * 4)
            addOnLayoutChangeListener { vg, _, _, _, _, _, _, _, _ ->
                if (vg is ViewGroup) enforceHorizontalGap(vg, gapPx)
            }
        }
    }
    
    scrollView.addView(layout)
    return scrollView
}

fun ViewFactory.createViewPager(bin: ByteArray): View {
    val action = nextStr()
    val scrollView = android.widget.HorizontalScrollView(ctx).apply {
        layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f)
        isFillViewport = true
        isHorizontalScrollBarEnabled = false
        
        if (action.isNotEmpty()) {
            isClickable = true
            isFocusable = true
            setOnClickListener { onAction?.invoke(action, "ViewPager") }
        }
    }
    
    val layout = LinearLayout(ctx).apply {
        orientation = LinearLayout.HORIZONTAL
        layoutParams = FrameLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.MATCH_PARENT)
        applyStyles(this, bin)
        
        val count = bin[13].toInt() and 0xFF
        val screenWidth = ctx.resources.displayMetrics.widthPixels
        
        repeat(count) { i ->
            buildComp()?.let { child ->
                val clp = getOrCreateLinearLayoutParams(child, screenWidth, ViewGroup.LayoutParams.MATCH_PARENT)
                clp.width = screenWidth
                child.layoutParams = clp
                addView(child)
            }
        }
    }
    
    scrollView.addView(layout)
    return scrollView
}
