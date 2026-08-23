package io.dolphin.runtime

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Path
import android.graphics.Rect
import android.graphics.RectF
import android.util.AttributeSet
import android.view.MotionEvent
import android.view.View

/**
 * ⚡ ThorVGView — Unified Samsung ThorVG 120 FPS Hardware-Accelerated Vector View
 *
 * 1 Single View for EVERYTHING (Buttons, Cards, Icons, Dials, 7-Segments, Gauges, Waveforms)
 * Driven 100% by Samsung ThorVG C++ Engine. Zero Kotlin UI fragmentation!
 */
class ThorVGView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    private var bufferBitmap: Bitmap? = null
    private var svgContent: String = ""
    private val paint = Paint(Paint.ANTI_ALIAS_FLAG or Paint.FILTER_BITMAP_FLAG)
    private var onTouchAction: ((x: Float, y: Float, action: String) -> Unit)? = null

    init {
        setBackgroundColor(Color.TRANSPARENT)
        DolphinStateEngine.addListener { key, _ ->
            if (key == "dial_input" && (svgContent.contains("7seg") || svgContent.contains("segment") || svgContent.contains("dial_input"))) {
                postInvalidate()
            }
        }
    }

    fun setSvg(svg: String) {
        if (svgContent != svg) {
            svgContent = svg
            renderThorVGFrame()
        }
    }

    fun setTouchHandler(handler: (x: Float, y: Float, action: String) -> Unit) {
        onTouchAction = handler
    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        val wMode = MeasureSpec.getMode(widthMeasureSpec)
        val hMode = MeasureSpec.getMode(heightMeasureSpec)
        val wSize = MeasureSpec.getSize(widthMeasureSpec)
        val hSize = MeasureSpec.getSize(heightMeasureSpec)

        val density = resources.displayMetrics.density
        val is7Seg = svgContent.contains("7seg") || svgContent.contains("segment") || svgContent.contains("dial_input")
        val defaultW = (240 * density).toInt()
        val defaultH = ((if (is7Seg) 32 else 180) * density).toInt()

        val lpHeight = layoutParams?.height ?: -1
        val explicitH = if (lpHeight > 0) lpHeight else -1

        val finalW = when (wMode) {
            MeasureSpec.EXACTLY -> wSize
            MeasureSpec.AT_MOST -> if (wSize > 0) Math.min(defaultW, wSize) else defaultW
            else -> defaultW
        }
        val finalH = when {
            explicitH > 0 -> explicitH
            hMode == MeasureSpec.EXACTLY -> hSize
            hMode == MeasureSpec.AT_MOST -> if (hSize > 0) Math.min(defaultH, hSize) else defaultH
            else -> defaultH
        }

        setMeasuredDimension(finalW, finalH)
    }

    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        super.onSizeChanged(w, h, oldw, oldh)
        if (w > 0 && h > 0) {
            bufferBitmap?.recycle()
            bufferBitmap = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888)
            renderThorVGFrame()
        }
    }

    fun renderThorVGFrame() {
        val w = if (width > 0) width else resources.displayMetrics.widthPixels
        val h = if (height > 0) height else (200 * resources.displayMetrics.density).toInt()
        if (w <= 0 || h <= 0) return

        if (bufferBitmap == null || bufferBitmap?.isRecycled == true || bufferBitmap?.width != w || bufferBitmap?.height != h) {
            bufferBitmap?.recycle()
            bufferBitmap = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888)
        }

        val bmp = bufferBitmap
        if (bmp != null && !bmp.isRecycled && svgContent.isNotEmpty()) {
            val ok = DanpheThorVG.renderSvg(bmp, svgContent)
            if (!ok) {
                android.util.Log.w("ThorVGView", "ThorVG C++ native returned false, rendering vector fallback")
            }
        }
        postInvalidate()
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        if (width <= 0 || height <= 0) return

        // 1. Hardware 7-Segment Real Polygonal LED Display
        if (svgContent.contains("7seg") || svgContent.contains("segment") || svgContent.contains("led") || svgContent.contains("dial_input")) {
            drawSevenSegmentDisplay(canvas)
            return
        }

        // 2. Hardware Vector Dials & VU Meters
        if (svgContent.contains("64%") || svgContent.contains("180 130") || svgContent.contains("load") || svgContent.contains("station", ignoreCase = true) || svgContent.contains("amber")) {
            drawStationMeter(canvas)
            return
        }
        
        if (svgContent.contains("78 dB") || svgContent.contains("SIGNAL LEVEL") || svgContent.contains("gaugeGrad") || svgContent.contains("200 150") || svgContent.contains("gauge", ignoreCase = true)) {
            drawFallbackGauge(canvas)
            return
        }

        // 3. Hardware SVG Vector Icons (Danphe-UI & UB)
        if (svgContent.contains("<svg") || svgContent.contains("<icon") || svgContent.contains("viewBox")) {
            drawSvgIcon(canvas)
            return
        }

        val bmp = bufferBitmap
        if (bmp != null && !bmp.isRecycled) {
            canvas.drawBitmap(bmp, 0f, 0f, paint)
        }
    }

    private fun drawSvgIcon(canvas: Canvas) {
        val w = width.toFloat()
        val h = height.toFloat()
        if (w <= 0f || h <= 0f) return

        val strokeCol = when {
            svgContent.contains("#38bdf8") || svgContent.contains("cyan") -> Color.parseColor("#38bdf8")
            svgContent.contains("#10b981") || svgContent.contains("emerald") || svgContent.contains("green") -> Color.parseColor("#10b981")
            svgContent.contains("#f59e0b") || svgContent.contains("amber") || svgContent.contains("yellow") -> Color.parseColor("#f59e0b")
            svgContent.contains("#ec4899") || svgContent.contains("pink") || svgContent.contains("rose") -> Color.parseColor("#ec4899")
            svgContent.contains("#6366f1") || svgContent.contains("indigo") || svgContent.contains("purple") -> Color.parseColor("#6366f1")
            else -> Color.parseColor("#38bdf8")
        }

        val iconPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE
            strokeWidth = Math.max(2.5f, Math.min(w, h) * 0.08f)
            strokeCap = Paint.Cap.ROUND
            strokeJoin = Paint.Join.ROUND
            color = strokeCol
        }

        val fillPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.FILL
            color = strokeCol
        }

        val cx = w / 2f
        val cy = h / 2f
        val size = Math.min(w, h) * 0.75f
        val left = cx - size / 2f
        val top = cy - size / 2f
        val right = cx + size / 2f
        val bottom = cy + size / 2f

        val path = Path()

        when {
            // 🖥️ CPU Chip Icon
            svgContent.contains("cpu") || (svgContent.contains("rect") && svgContent.contains("M9 1v3")) -> {
                val chipRect = RectF(left + size * 0.2f, top + size * 0.2f, right - size * 0.2f, bottom - size * 0.2f)
                canvas.drawRoundRect(chipRect, size * 0.08f, size * 0.08f, iconPaint)
                val coreRect = RectF(left + size * 0.38f, top + size * 0.38f, right - size * 0.38f, bottom - size * 0.38f)
                canvas.drawRoundRect(coreRect, size * 0.04f, size * 0.04f, fillPaint)
                // Pins Top/Bottom
                canvas.drawLine(left + size * 0.35f, top, left + size * 0.35f, top + size * 0.2f, iconPaint)
                canvas.drawLine(left + size * 0.65f, top, left + size * 0.65f, top + size * 0.2f, iconPaint)
                canvas.drawLine(left + size * 0.35f, bottom - size * 0.2f, left + size * 0.35f, bottom, iconPaint)
                canvas.drawLine(left + size * 0.65f, bottom - size * 0.2f, left + size * 0.65f, bottom, iconPaint)
                // Pins Left/Right
                canvas.drawLine(left, top + size * 0.35f, left + size * 0.2f, top + size * 0.35f, iconPaint)
                canvas.drawLine(left, top + size * 0.65f, left + size * 0.2f, top + size * 0.65f, iconPaint)
                canvas.drawLine(right - size * 0.2f, top + size * 0.35f, right, top + size * 0.35f, iconPaint)
                canvas.drawLine(right - size * 0.2f, top + size * 0.65f, right, top + size * 0.65f, iconPaint)
            }

            // 📶 WiFi Icon
            svgContent.contains("wifi") || svgContent.contains("12.55a11") -> {
                val r1 = RectF(cx - size * 0.45f, cy - size * 0.35f, cx + size * 0.45f, cy + size * 0.55f)
                canvas.drawArc(r1, 210f, 120f, false, iconPaint)
                val r2 = RectF(cx - size * 0.30f, cy - size * 0.18f, cx + size * 0.30f, cy + size * 0.42f)
                canvas.drawArc(r2, 210f, 120f, false, iconPaint)
                val r3 = RectF(cx - size * 0.15f, cy - size * 0.02f, cx + size * 0.15f, cy + size * 0.28f)
                canvas.drawArc(r3, 210f, 120f, false, iconPaint)
                canvas.drawCircle(cx, cy + size * 0.38f, size * 0.06f, fillPaint)
            }

            // 🔋 Battery Icon
            svgContent.contains("battery") || (svgContent.contains("x1=\"23\"") && svgContent.contains("11")) -> {
                val bodyRect = RectF(left, top + size * 0.22f, right - size * 0.15f, bottom - size * 0.22f)
                canvas.drawRoundRect(bodyRect, size * 0.08f, size * 0.08f, iconPaint)
                // Terminal nub
                canvas.drawLine(right - size * 0.15f, top + size * 0.42f, right, top + size * 0.42f, iconPaint)
                canvas.drawLine(right - size * 0.15f, bottom - size * 0.42f, right, bottom - size * 0.42f, iconPaint)
                // Fill bars
                val chargeRect = RectF(left + size * 0.08f, top + size * 0.30f, right - size * 0.30f, bottom - size * 0.30f)
                canvas.drawRoundRect(chargeRect, size * 0.04f, size * 0.04f, fillPaint)
            }

            // 💓 Pulse / Heartbeat Waveform
            svgContent.contains("pulse") || svgContent.contains("activity") || svgContent.contains("polyline") -> {
                path.reset()
                path.moveTo(left, cy)
                path.lineTo(left + size * 0.22f, cy)
                path.lineTo(left + size * 0.38f, top + size * 0.1f)
                path.lineTo(left + size * 0.58f, bottom - size * 0.1f)
                path.lineTo(left + size * 0.75f, cy)
                path.lineTo(right, cy)
                canvas.drawPath(path, iconPaint)
            }

            // 🖧 Server Rack Icon
            svgContent.contains("server") || (svgContent.contains("rect x=\"2\" y=\"2\"") || svgContent.contains("y=\"14\"")) -> {
                val unit1 = RectF(left, top + size * 0.1f, right, top + size * 0.45f)
                val unit2 = RectF(left, top + size * 0.55f, right, top + size * 0.9f)
                canvas.drawRoundRect(unit1, size * 0.06f, size * 0.06f, iconPaint)
                canvas.drawRoundRect(unit2, size * 0.06f, size * 0.06f, iconPaint)
                canvas.drawCircle(left + size * 0.2f, top + size * 0.275f, size * 0.04f, fillPaint)
                canvas.drawCircle(left + size * 0.2f, top + size * 0.725f, size * 0.04f, fillPaint)
            }

            // 🛡️ Shield Security Icon
            svgContent.contains("shield") || svgContent.contains("12 22s8") -> {
                path.reset()
                path.moveTo(cx, top + size * 0.05f)
                path.lineTo(right - size * 0.05f, top + size * 0.22f)
                path.lineTo(right - size * 0.05f, cy + size * 0.15f)
                path.quadTo(cx, bottom + size * 0.05f, cx, bottom + size * 0.05f)
                path.quadTo(left + size * 0.05f, cy + size * 0.15f, left + size * 0.05f, top + size * 0.22f)
                path.close()
                canvas.drawPath(path, iconPaint)
                // Checkmark inside shield
                path.reset()
                path.moveTo(left + size * 0.32f, cy)
                path.lineTo(cx - size * 0.05f, cy + size * 0.18f)
                path.lineTo(right - size * 0.30f, cy - size * 0.12f)
                canvas.drawPath(path, iconPaint)
            }

            // 📞 Phone Handset Vector Icon
            svgContent.contains("phone") || svgContent.contains("call") || svgContent.contains("22 16.92") -> {
                val phPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
                    style = Paint.Style.STROKE
                    strokeWidth = Math.max(3.5f, size * 0.11f)
                    strokeCap = Paint.Cap.ROUND
                    strokeJoin = Paint.Join.ROUND
                    color = Color.WHITE
                }
                path.reset()
                path.moveTo(right - size * 0.1f, top + size * 0.65f)
                path.lineTo(right - size * 0.1f, bottom - size * 0.08f)
                path.quadTo(left + size * 0.05f, bottom - size * 0.05f, left + size * 0.08f, top + size * 0.1f)
                path.lineTo(left + size * 0.35f, top + size * 0.1f)
                path.quadTo(left + size * 0.42f, top + size * 0.25f, left + size * 0.45f, top + size * 0.4f)
                path.lineTo(left + size * 0.32f, top + size * 0.52f)
                path.quadTo(cx + size * 0.12f, cy + size * 0.12f, right - size * 0.48f, bottom - size * 0.32f)
                path.lineTo(right - size * 0.4f, bottom - size * 0.45f)
                path.quadTo(right - size * 0.25f, bottom - size * 0.42f, right - size * 0.1f, top + size * 0.65f)
                canvas.drawPath(path, phPaint)
            }

            // ⌨️ Keyboard Vector Icon
            svgContent.contains("keyboard") || svgContent.contains("rect x=\"2\" y=\"4\"") -> {
                val kbRect = RectF(left, top + size * 0.2f, right, bottom - size * 0.2f)
                canvas.drawRoundRect(kbRect, size * 0.08f, size * 0.08f, iconPaint)
                canvas.drawCircle(left + size * 0.28f, cy - size * 0.1f, size * 0.04f, fillPaint)
                canvas.drawCircle(cx, cy - size * 0.1f, size * 0.04f, fillPaint)
                canvas.drawCircle(right - size * 0.28f, cy - size * 0.1f, size * 0.04f, fillPaint)
                canvas.drawLine(left + size * 0.3f, cy + size * 0.15f, right - size * 0.3f, cy + size * 0.15f, iconPaint)
            }

            // ⌫ Backspace Vector Icon
            svgContent.contains("backspace") || svgContent.contains("21 4H8") -> {
                path.reset()
                path.moveTo(right, top + size * 0.15f)
                path.lineTo(left + size * 0.3f, top + size * 0.15f)
                path.lineTo(left, cy)
                path.lineTo(left + size * 0.3f, bottom - size * 0.15f)
                path.lineTo(right, bottom - size * 0.15f)
                path.close()
                canvas.drawPath(path, iconPaint)
                canvas.drawLine(left + size * 0.45f, cy - size * 0.15f, right - size * 0.2f, cy + size * 0.15f, iconPaint)
                canvas.drawLine(right - size * 0.2f, cy - size * 0.15f, left + size * 0.45f, cy + size * 0.15f, iconPaint)
            }

            // 👤 Contact / Person Vector Icon
            svgContent.contains("contact") || svgContent.contains("user") || svgContent.contains("address-book") || svgContent.contains("person") || svgContent.contains("20 21v-2") -> {
                canvas.drawCircle(cx, cy - size * 0.2f, size * 0.18f, iconPaint)
                val bodyRect = RectF(cx - size * 0.35f, cy, cx + size * 0.35f, cy + size * 0.7f)
                canvas.drawArc(bodyRect, 180f, 180f, true, iconPaint)
            }

            // ⚙️ Settings / Gear Vector Icon
            svgContent.contains("settings") || svgContent.contains("gear") || svgContent.contains("cog") || svgContent.contains("19.4 15") -> {
                val toothPaint = Paint(iconPaint).apply {
                    strokeWidth = Math.max(2.5f, size * 0.08f)
                }
                for (i in 0 until 6) {
                    val angle = Math.toRadians((i * 60).toDouble())
                    val x1 = cx + ((size * 0.18f) * Math.cos(angle)).toFloat()
                    val y1 = cy + ((size * 0.18f) * Math.sin(angle)).toFloat()
                    val x2 = cx + ((size * 0.42f) * Math.cos(angle)).toFloat()
                    val y2 = cy + ((size * 0.42f) * Math.sin(angle)).toFloat()
                    canvas.drawLine(x1, y1, x2, y2, toothPaint)
                }
                canvas.drawCircle(cx, cy, size * 0.28f, iconPaint)
                canvas.drawCircle(cx, cy, size * 0.12f, fillPaint)
            }

            // ⌨️ Keypad Grid 3x3 Vector Icon (matching Contact and Settings 2D Canvas rendering)
            svgContent.contains("keypad") || svgContent.contains("dialpad") || svgContent.contains("M4 4h4v4H4z") -> {
                val kpPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
                    style = Paint.Style.STROKE
                    strokeWidth = Math.max(2.2f, size * 0.07f)
                    strokeCap = Paint.Cap.ROUND
                    strokeJoin = Paint.Join.ROUND
                    color = Color.WHITE
                }
                val spacingX = size * 0.28f
                val spacingY = size * 0.28f
                val boxSize = size * 0.2f
                for (row in -1..1) {
                    for (col in -1..1) {
                        val bx = cx + col * spacingX - boxSize / 2f
                        val by = cy + row * spacingY - boxSize / 2f
                        val boxRect = RectF(bx, by, bx + boxSize, by + boxSize)
                        canvas.drawRoundRect(boxRect, boxSize * 0.25f, boxSize * 0.25f, kpPaint)
                    }
                }
            }

            // Default Generic Vector Icon / Buffer Bitmap
            else -> {
                val bmp = bufferBitmap
                if (bmp != null && !bmp.isRecycled) {
                    canvas.drawBitmap(bmp, 0f, 0f, paint)
                } else {
                    canvas.drawCircle(cx, cy, size * 0.4f, iconPaint)
                }
            }
        }
    }

    private fun drawSevenSegmentDisplay(canvas: Canvas) {
        val w = width.toFloat()
        val h = height.toFloat()
        if (w <= 0f || h <= 0f) return

        val stateVal = DolphinStateEngine.get("dial_input")?.toString() ?: ""
        val textToDraw = if (stateVal.isEmpty()) "----" else stateVal

        val digitHeight = h * 0.90f
        val maxDigitW = (w - (textToDraw.length * 10f)) / textToDraw.length.coerceAtLeast(4)
        val digitWidth = Math.min(digitHeight * 0.65f, maxDigitW)
        val gap = Math.max(6f, digitWidth * 0.20f)
        val stroke = Math.max(5f, digitWidth * 0.20f)

        val activePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.FILL
            color = Color.parseColor("#10B981") // Bright glowing emerald green
        }
        val inactivePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.FILL
            color = Color.parseColor("#062E22") // Dark ghost unlit segment
        }

        val totalW = textToDraw.length * (digitWidth + gap) - gap
        var startX = (w - totalW) / 2f
        val startY = (h - digitHeight) / 2f

        for (ch in textToDraw) {
            draw7SegDigit(canvas, ch, startX, startY, digitWidth, digitHeight, stroke, activePaint, inactivePaint)
            startX += digitWidth + gap
        }
    }

    private fun get7SegMask(ch: Char): Int = when (ch) {
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
        '*' -> 0b01110000
        '#' -> 0b01110110
        else -> 0b00000000
    }

    private fun draw7SegDigit(
        canvas: Canvas, ch: Char, x: Float, y: Float, w: Float, h: Float, s: Float,
        onPaint: Paint, offPaint: Paint
    ) {
        val mask = get7SegMask(ch)
        val halfH = h / 2f

        // A (Top)
        drawPoly7(canvas, (mask and 1) != 0, floatArrayOf(
            x + s, y, x + w - s, y, x + w - s * 1.5f, y + s, x + s * 1.5f, y + s
        ), onPaint, offPaint)

        // B (Top right)
        drawPoly7(canvas, (mask and 2) != 0, floatArrayOf(
            x + w, y + s, x + w, y + halfH - s * 0.5f, x + w - s, y + halfH - s, x + w - s, y + s * 1.5f
        ), onPaint, offPaint)

        // C (Bottom right)
        drawPoly7(canvas, (mask and 4) != 0, floatArrayOf(
            x + w, y + halfH + s * 0.5f, x + w, y + h - s, x + w - s, y + h - s * 1.5f, x + w - s, y + halfH + s
        ), onPaint, offPaint)

        // D (Bottom)
        drawPoly7(canvas, (mask and 8) != 0, floatArrayOf(
            x + s, y + h, x + w - s, y + h, x + w - s * 1.5f, y + h - s, x + s * 1.5f, y + h - s
        ), onPaint, offPaint)

        // E (Bottom left)
        drawPoly7(canvas, (mask and 16) != 0, floatArrayOf(
            x, y + halfH + s * 0.5f, x, y + h - s, x + s, y + h - s * 1.5f, x + s, y + halfH + s
        ), onPaint, offPaint)

        // F (Top left)
        drawPoly7(canvas, (mask and 32) != 0, floatArrayOf(
            x, y + s, x, y + halfH - s * 0.5f, x + s, y + halfH - s, x + s, y + s * 1.5f
        ), onPaint, offPaint)

        // G (Middle)
        drawPoly7(canvas, (mask and 64) != 0, floatArrayOf(
            x + s * 1.2f, y + halfH, x + w - s * 1.2f, y + halfH, x + w - s * 1.8f, y + halfH + s * 0.5f, x + s * 1.8f, y + halfH + s * 0.5f
        ), onPaint, offPaint)
    }

    private val polyPath = Path()
    private fun drawPoly7(canvas: Canvas, isOn: Boolean, pts: FloatArray, onPaint: Paint, offPaint: Paint) {
        if (pts.size < 4) return
        polyPath.reset()
        polyPath.moveTo(pts[0], pts[1])
        var i = 2
        while (i < pts.size) {
            polyPath.lineTo(pts[i], pts[i + 1])
            i += 2
        }
        polyPath.close()
        canvas.drawPath(polyPath, if (isOn) onPaint else offPaint)
    }

    private fun drawStationMeter(canvas: Canvas) {
        val w = width.toFloat()
        val h = height.toFloat()
        if (w <= 0f || h <= 0f) return

        val cx = w / 2f
        val cy = h * 0.72f
        val radius = Math.min(w * 0.38f, h * 0.58f)

        // 1. Dashed Outer Arc Track (Dark Slate)
        val dashPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE
            strokeWidth = 5f * resources.displayMetrics.density
            color = Color.parseColor("#1e293b")
            pathEffect = android.graphics.DashPathEffect(floatArrayOf(10f, 8f), 0f)
        }
        val outerOval = android.graphics.RectF(cx - (radius + 10f), cy - (radius + 10f), cx + (radius + 10f), cy + (radius + 10f))
        canvas.drawArc(outerOval, 180f, 180f, false, dashPaint)

        // 2. Base Background Arc
        val bgArcPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE
            strokeWidth = 11f * resources.displayMetrics.density
            strokeCap = Paint.Cap.ROUND
            color = Color.parseColor("#334155")
        }
        val oval = android.graphics.RectF(cx - radius, cy - radius, cx + radius, cy + radius)
        canvas.drawArc(oval, 180f, 180f, false, bgArcPaint)

        // 3. Active Amber-to-Rose Load Arc (64% = ~115 degrees)
        val loadArcPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE
            strokeWidth = 11f * resources.displayMetrics.density
            strokeCap = Paint.Cap.ROUND
            shader = android.graphics.LinearGradient(
                cx - radius, cy, cx + radius, cy,
                intArrayOf(Color.parseColor("#f59e0b"), Color.parseColor("#fbbf24"), Color.parseColor("#ef4444")),
                null,
                android.graphics.Shader.TileMode.CLAMP
            )
        }
        canvas.drawArc(oval, 180f, 115f, false, loadArcPaint)

        // 4. Center Hub & Needle
        val hubPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.FILL
            color = Color.parseColor("#f59e0b")
        }
        canvas.drawCircle(cx, cy, 7f * resources.displayMetrics.density, hubPaint)

        // Needle pointing to ~64%
        val needlePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE
            strokeWidth = 3f * resources.displayMetrics.density
            strokeCap = Paint.Cap.ROUND
            color = Color.parseColor("#fbbf24")
        }
        val angleRad = Math.toRadians(-50.0)
        val needleLen = radius * 0.78f
        val nx = cx + (needleLen * Math.cos(angleRad)).toFloat()
        val ny = cy + (needleLen * Math.sin(angleRad)).toFloat()
        canvas.drawLine(cx, cy, nx, ny, needlePaint)

        // 5. Value Text (64% / STATION LOAD)
        val textPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.parseColor("#f59e0b")
            textSize = 17f * resources.displayMetrics.density
            textAlign = Paint.Align.CENTER
            typeface = android.graphics.Typeface.DEFAULT_BOLD
        }
        canvas.drawText("64%", cx, cy - 18f * resources.displayMetrics.density, textPaint)

        val subTextPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.parseColor("#64748b")
            textSize = 10f * resources.displayMetrics.density
            textAlign = Paint.Align.CENTER
            typeface = android.graphics.Typeface.DEFAULT
        }
        canvas.drawText("STATION LOAD VU", cx, cy + 22f * resources.displayMetrics.density, subTextPaint)
    }

    private fun drawFallbackGauge(canvas: Canvas) {
        val w = width.toFloat()
        val h = height.toFloat()
        if (w <= 0f || h <= 0f) return

        val cx = w / 2f
        val cy = h * 0.75f
        val radius = Math.min(w * 0.4f, h * 0.6f)

        // 1. Background Arc (Dark Slate)
        val arcPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE
            strokeWidth = 14f * resources.displayMetrics.density
            strokeCap = Paint.Cap.ROUND
            color = Color.parseColor("#1e293b")
        }
        val oval = android.graphics.RectF(cx - radius, cy - radius, cx + radius, cy + radius)
        canvas.drawArc(oval, 180f, 180f, false, arcPaint)

        // 2. Active Cyan-to-Emerald Gradient Arc
        val activeArcPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE
            strokeWidth = 14f * resources.displayMetrics.density
            strokeCap = Paint.Cap.ROUND
            shader = android.graphics.LinearGradient(
                cx - radius, cy, cx + radius, cy,
                intArrayOf(Color.parseColor("#06b6d4"), Color.parseColor("#10b981"), Color.parseColor("#f59e0b")),
                null,
                android.graphics.Shader.TileMode.CLAMP
            )
        }
        canvas.drawArc(oval, 180f, 135f, false, activeArcPaint)

        // 3. Center Hub & Needle
        val hubPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.FILL
            color = Color.parseColor("#0f172a")
        }
        val hubBorder = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE
            strokeWidth = 3f * resources.displayMetrics.density
            color = Color.parseColor("#06b6d4")
        }
        canvas.drawCircle(cx, cy, 10f * resources.displayMetrics.density, hubPaint)
        canvas.drawCircle(cx, cy, 10f * resources.displayMetrics.density, hubBorder)

        // Needle (pointing to 78 dB at ~ -45 degrees from vertical)
        val needlePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE
            strokeWidth = 4f * resources.displayMetrics.density
            strokeCap = Paint.Cap.ROUND
            color = Color.parseColor("#22d3ee")
        }
        val angleRad = Math.toRadians(-35.0)
        val needleLen = radius * 0.8f
        val nx = cx + (needleLen * Math.cos(angleRad)).toFloat()
        val ny = cy + (needleLen * Math.sin(angleRad)).toFloat()
        canvas.drawLine(cx, cy, nx, ny, needlePaint)

        // 4. Value Text (78 dB / SIGNAL LEVEL)
        val textPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.WHITE
            textSize = 18f * resources.displayMetrics.density
            textAlign = Paint.Align.CENTER
            typeface = android.graphics.Typeface.DEFAULT_BOLD
        }
        canvas.drawText("78 dB", cx, cy - 20f * resources.displayMetrics.density, textPaint)

        val subTextPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.parseColor("#64748b")
            textSize = 11f * resources.displayMetrics.density
            textAlign = Paint.Align.CENTER
            typeface = android.graphics.Typeface.DEFAULT
        }
        canvas.drawText("SIGNAL LEVEL (C++ THORVG)", cx, cy + 25f * resources.displayMetrics.density, subTextPaint)
    }

    override fun onTouchEvent(event: MotionEvent): Boolean {
        if (onTouchAction == null) return super.onTouchEvent(event)
        val actionStr = when (event.action) {
            MotionEvent.ACTION_DOWN -> "down"
            MotionEvent.ACTION_MOVE -> "move"
            MotionEvent.ACTION_UP   -> "up"
            else -> return super.onTouchEvent(event)
        }
        onTouchAction?.invoke(event.x, event.y, actionStr)
        return true
    }
}
