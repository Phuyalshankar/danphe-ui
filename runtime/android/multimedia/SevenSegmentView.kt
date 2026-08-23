package io.dolphin.runtime

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Path
import android.util.AttributeSet
import android.view.View

/**
 * 📟 SevenSegmentView - Pure Vector GPU Canvas 7-Segment Digit Renderer
 * Zero Font files required. Draws exact mathematical polygon segments in real time.
 */
class SevenSegmentView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    var text: String = ""
        set(value) {
            field = value
            invalidate()
        }

    var activeColor: Int = Color.parseColor("#EF4444") // Bright glowing red
        set(value) {
            field = value
            paintOn.color = value
            invalidate()
        }

    var inactiveColor: Int = Color.parseColor("#220808") // Dark off segment
        set(value) {
            field = value
            paintOff.color = value
            invalidate()
        }

    private val paintOn = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.FILL
        color = activeColor
    }

    private val paintOff = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.FILL
        color = inactiveColor
    }

    companion object {
        // Bitmask for segments: [G, F, E, D, C, B, A]
        fun getMask(ch: Char): Int = when (ch) {
            '0' -> 0b00111111
            '1' -> 0b00000110
            '2' -> 0b01011011
            '3' -> 0b01001111
            '4' -> 0b01100110
            '5' -> 0b01101101
            '6' -> 0b01111101
            '7' -> 0b00000111
            '8' -> 0b01111111
            '9' -> 0b01101111
            '-' -> 0b01000000
            else -> 0b00000000
        }
    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        val density = resources.displayMetrics.density
        val defaultH = (56 * density).toInt()
        val defaultW = (240 * density).toInt()

        val widthMode = MeasureSpec.getMode(widthMeasureSpec)
        val widthSize = MeasureSpec.getSize(widthMeasureSpec)
        val heightMode = MeasureSpec.getMode(heightMeasureSpec)
        val heightSize = MeasureSpec.getSize(heightMeasureSpec)

        val w = when (widthMode) {
            MeasureSpec.EXACTLY -> widthSize
            MeasureSpec.AT_MOST -> if (widthSize > 0) widthSize else defaultW
            else -> defaultW
        }

        val h = when (heightMode) {
            MeasureSpec.EXACTLY -> heightSize
            MeasureSpec.AT_MOST -> if (heightSize > 0 && heightSize < defaultH * 2) heightSize else defaultH
            else -> defaultH
        }

        setMeasuredDimension(w, h)
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        val chars = if (text.isEmpty()) "----" else text
        val density = resources.displayMetrics.density
        
        val digitWidth = 28f * density
        val digitHeight = 48f * density
        val gap = 6f * density
        val stroke = 4.5f * density

        val totalWidth = chars.length * (digitWidth + gap) - gap
        var startX = (width - totalWidth) / 2f
        val startY = (height - digitHeight) / 2f

        for (ch in chars) {
            drawDigit(canvas, ch, startX, startY, digitWidth, digitHeight, stroke)
            startX += digitWidth + gap
        }
    }

    private fun drawDigit(
        canvas: Canvas,
        ch: Char,
        x: Float,
        y: Float,
        w: Float,
        h: Float,
        s: Float
    ) {
        val mask = getMask(ch)
        val halfH = h / 2f

        // Segment A (Top horizontal)
        drawPoly(canvas, (mask and 1) != 0, floatArrayOf(
            x + s, y,
            x + w - s, y,
            x + w - s * 1.5f, y + s,
            x + s * 1.5f, y + s
        ))

        // Segment B (Top right vertical)
        drawPoly(canvas, (mask and 2) != 0, floatArrayOf(
            x + w, y + s,
            x + w, y + halfH - s * 0.5f,
            x + w - s, y + halfH - s,
            x + w - s, y + s * 1.5f
        ))

        // Segment C (Bottom right vertical)
        drawPoly(canvas, (mask and 4) != 0, floatArrayOf(
            x + w, y + halfH + s * 0.5f,
            x + w, y + h - s,
            x + w - s, y + h - s * 1.5f,
            x + w - s, y + halfH + s
        ))

        // Segment D (Bottom horizontal)
        drawPoly(canvas, (mask and 8) != 0, floatArrayOf(
            x + s, y + h,
            x + w - s, y + h,
            x + w - s * 1.5f, y + h - s,
            x + s * 1.5f, y + h - s
        ))

        // Segment E (Bottom left vertical)
        drawPoly(canvas, (mask and 16) != 0, floatArrayOf(
            x, y + halfH + s * 0.5f,
            x, y + h - s,
            x + s, y + h - s * 1.5f,
            x + s, y + halfH + s
        ))

        // Segment F (Top left vertical)
        drawPoly(canvas, (mask and 32) != 0, floatArrayOf(
            x, y + s,
            x, y + halfH - s * 0.5f,
            x + s, y + halfH - s,
            x + s, y + s * 1.5f
        ))

        // Segment G (Middle horizontal)
        drawPoly(canvas, (mask and 64) != 0, floatArrayOf(
            x + s * 1.2f, y + halfH,
            x + w - s * 1.2f, y + halfH,
            x + w - s * 1.8f, y + halfH + s * 0.5f,
            x + s * 1.8f, y + halfH + s * 0.5f
        ))
    }

    private val path = Path()
    private fun drawPoly(canvas: Canvas, isOn: Boolean, pts: FloatArray) {
        if (pts.size < 4) return
        path.reset()
        path.moveTo(pts[0], pts[1])
        var i = 2
        while (i < pts.size) {
            path.lineTo(pts[i], pts[i + 1])
            i += 2
        }
        path.close()
        canvas.drawPath(path, if (isOn) paintOn else paintOff)
    }
}
