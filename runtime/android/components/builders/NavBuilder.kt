package io.dolphin.runtime

import android.content.Context
import android.graphics.Color
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout

/**
 * 🐬 Nav Tag Builder (Opcode: 0x2A)
 * ✅ Full Flexbox Support
 * ✅ CSS apply हुन्छ
 * ✅ Web-like semantic
 */
class NavBuilder : ComponentBuilder {
    
    companion object {
        private const val TAG = "NavBuilder"
        const val NAV_ID = 10001
    }
    
    override fun getType(): Int = 0x2A
    override fun getName(): String = "Nav"

    override fun build(ctx: Context, data: ByteArray, factory: ViewFactory): View {
        val container = LinearLayout(ctx).apply {
            id = NAV_ID
            tag = "nav"
            
            // ✅ Flexbox: Horizontal
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            clipToPadding = false
            clipChildren = false
            
            // ✅ Layout params
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )

            // ✅ CSS properties apply
            applyCSS(this, data, factory)
        }
        
        return container
    }
    
    /**
     * ✅ CSS apply (Correct Byte Mapping: 4=Top, 5=Right, 6=Bottom, 7=Left)
     */
    private fun applyCSS(view: LinearLayout, data: ByteArray, factory: ViewFactory) {
        val paddingTop = data[4].toInt() and 0xFF
        val paddingRight = data[5].toInt() and 0xFF
        val paddingBottom = data[6].toInt() and 0xFF
        val paddingLeft = data[7].toInt() and 0xFF
        
        if (paddingLeft > 0 || paddingTop > 0 || paddingRight > 0 || paddingBottom > 0) {
            view.setPadding(
                factory.dp(paddingLeft),
                factory.dp(paddingTop),
                factory.dp(paddingRight),
                factory.dp(paddingBottom)
            )
        }
        
        val bgShade = data[2].toInt() and 0xFF
        val bgIndex = data[3].toInt() and 0xFF
        if (bgIndex != 0) {
            val bgColor = resolveColor(bgShade, bgIndex)
            view.setBackgroundColor(Color.parseColor(bgColor))
            
            val radius = data[14].toInt() and 0xFF
            if (radius > 0) {
                val drawable = android.graphics.drawable.GradientDrawable()
                drawable.cornerRadius = factory.dp(radius).toFloat()
                drawable.setColor(Color.parseColor(bgColor))
                view.background = drawable
            }
        }
        
        val marginTop = data[8].toInt() and 0xFF
        val marginRight = data[9].toInt() and 0xFF
        val marginBottom = data[10].toInt() and 0xFF
        val marginLeft = data[11].toInt() and 0xFF
        
        if (marginLeft > 0 || marginTop > 0 || marginRight > 0 || marginBottom > 0) {
            (view.layoutParams as? LinearLayout.LayoutParams)?.apply {
                setMargins(
                    factory.dp(marginLeft),
                    factory.dp(marginTop),
                    factory.dp(marginRight),
                    factory.dp(marginBottom)
                )
            }
        }
    }
    
    private fun resolveColor(shade: Int, index: Int): String {
        return when (index) {
            0 -> "#000000"
            1 -> "#ffffff"
            2 -> "#0f172a"
            3 -> "#2563eb"
            4 -> "#1e293b"
            5 -> "#334155"
            6 -> "#475569"
            7 -> "#64748b"
            8 -> "#94a3b8"
            9 -> "#cbd5e1"
            10 -> "#e2e8f0"
            11 -> "#f1f5f9"
            12 -> "#f8fafc"
            else -> "#0f172a"
        }
    }
}
