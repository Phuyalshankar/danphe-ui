package io.dolphin.runtime

import android.content.Context
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView
import com.google.android.material.button.MaterialButton
import com.google.android.material.card.MaterialCardView

/**
 * ⚡ TITAN ENGINE (Atomic Single-Pass Native View Inflater)
 * ─────────────────────────────────────────────────────────────
 * Directly consumes 24-byte Titan layout packets and instantiates + styles
 * Android Views in a single atomic pass, eliminating intermediate style passes.
 */
object TitanEngine {

    inline fun inflateView(
        ctx: Context,
        data: ByteArray,
        offset: Int,
        factory: ViewFactory,
        strPoolGetter: () -> String
    ): View {
        val flexGravity = data[offset].toInt() and 0xFF
        val opcode = data[offset + 1].toInt() and 0xFF
        val bgShade = data[offset + 2].toInt() and 0xFF
        val bgPalette = data[offset + 3].toInt() and 0xFF

        val pt = data[offset + 4].toInt() and 0xFF
        val pr = data[offset + 5].toInt() and 0xFF
        val pb = data[offset + 6].toInt() and 0xFF
        val pl = data[offset + 7].toInt() and 0xFF

        val mt = data[offset + 8].toByte().toInt()
        val mr = data[offset + 9].toByte().toInt()
        val mb = data[offset + 10].toByte().toInt()
        val ml = data[offset + 11].toByte().toInt()

        val borderWidth = data[offset + 12].toInt() and 0xFF
        val borderPalette = data[offset + 13].toInt() and 0xFF
        val radius = data[offset + 14].toInt() and 0xFF
        val sig = data[offset + 15].toInt() and 0xFF

        val flexWeight = (flexGravity shr 4) and 0x0F
        val gravityFlag = flexGravity and 0x0F

        // 1. Instant View Construction based on Opcode
        val view: View = when (opcode) {
            0x10 -> { // Button
                val label = strPoolGetter()
                val action = strPoolGetter()
                MaterialButton(ctx).apply {
                    text = label
                    isAllCaps = false
                    if (action.isNotEmpty()) setOnClickListener { factory.onAction?.invoke(action, this) }
                }
            }
            0x14 -> { // Row (LinearLayout Horizontal)
                LinearLayout(ctx).apply {
                    orientation = LinearLayout.HORIZONTAL
                    gravity = when {
                        (gravityFlag and 0x01) != 0 && (gravityFlag and 0x02) != 0 -> Gravity.CENTER
                        (gravityFlag and 0x01) != 0 -> Gravity.CENTER_VERTICAL
                        (gravityFlag and 0x02) != 0 -> Gravity.CENTER_HORIZONTAL
                        else -> Gravity.START or Gravity.TOP
                    }
                }
            }
            0x13 -> { // Column (LinearLayout Vertical)
                LinearLayout(ctx).apply {
                    orientation = LinearLayout.VERTICAL
                    gravity = when {
                        (gravityFlag and 0x01) != 0 && (gravityFlag and 0x02) != 0 -> Gravity.CENTER
                        (gravityFlag and 0x01) != 0 -> Gravity.CENTER_VERTICAL
                        (gravityFlag and 0x02) != 0 -> Gravity.CENTER_HORIZONTAL
                        else -> Gravity.START or Gravity.TOP
                    }
                }
            }
            0x16 -> { // Text
                val textStr = strPoolGetter()
                TextView(ctx).apply {
                    text = textStr
                    setTextColor(Color.WHITE)
                    textSize = 14f
                }
            }
            0x11 -> { // Card
                MaterialCardView(ctx).apply {
                    cardElevation = factory.dp(4).toFloat()
                    if (radius > 0) setRadius(factory.dp(radius).toFloat())
                }
            }
            else -> { // Generic Container
                LinearLayout(ctx).apply {
                    orientation = LinearLayout.VERTICAL
                }
            }
        }

        // 2. Atomic Style Application
        view.setPadding(factory.dp(pl), factory.dp(pt), factory.dp(pr), factory.dp(pb))

        // Background & Border Drawable
        if (bgPalette != 0 || borderWidth > 0) {
            val bgCol = if (bgPalette != 0) ColorParser.parseColor(bgPalette, bgShade) else Color.TRANSPARENT
            val borderCol = if (borderPalette != 0) ColorParser.parseColor(borderPalette, 200) else Color.parseColor("#334155")

            val gd = GradientDrawable().apply {
                setColor(bgCol)
                if (radius > 0) cornerRadius = factory.dp(if (radius == 255) 999 else radius).toFloat()
                if (borderWidth > 0) setStroke(factory.dp(borderWidth), borderCol)
            }
            view.background = gd
        }

        // Layout Parameters & Margins
        val lp = LinearLayout.LayoutParams(
            if (flexWeight > 0) 0 else (if (view is LinearLayout || view is MaterialCardView) ViewGroup.LayoutParams.MATCH_PARENT else ViewGroup.LayoutParams.WRAP_CONTENT),
            ViewGroup.LayoutParams.WRAP_CONTENT,
            if (flexWeight > 0) flexWeight.toFloat() else 0f
        ).apply {
            val left = if (ml != 0) (if (ml > 0) factory.dp(ml) else -factory.dp(-ml)) else 0
            val top = if (mt != 0) (if (mt > 0) factory.dp(mt) else -factory.dp(-mt)) else 0
            val right = if (mr != 0) (if (mr > 0) factory.dp(mr) else -factory.dp(-mr)) else 0
            val bottom = if (mb != 0) (if (mb > 0) factory.dp(mb) else -factory.dp(-mb)) else 0
            setMargins(left, top, right, bottom)
        }
        view.layoutParams = lp

        return view
    }
}
