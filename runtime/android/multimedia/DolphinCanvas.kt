package io.dolphin.runtime

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.LinearGradient
import android.graphics.Paint
import android.graphics.Path
import android.graphics.Rect
import android.graphics.RectF
import android.graphics.Shader
import android.graphics.Typeface
import android.util.AttributeSet
import android.util.Log
import android.view.SurfaceHolder
import android.view.SurfaceView
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.Executors
import kotlin.concurrent.thread

/**
 * 🐬 DolphinCanvas — Unified Ultra-Fast Hardware-Accelerated Native Canvas Engine
 *
 * Consolidates all canvas functionality into ONE single high-performance engine:
 * 1. Stream Mode (Single Video / MJPEG Snapshot)
 * 2. Matrix Mode (4, 16, 36, 64 Channel NVR CCTV Grid rendered in 1 single View)
 * 3. Chart Mode (60 FPS Native Vector Charts: Line, Bar, Pie/Donut, Gauge Meter)
 */
class DolphinCanvas @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null
) : SurfaceView(context, attrs), SurfaceHolder.Callback {

    companion object {
        private const val TAG = "DolphinCanvas"
    }

    enum class CanvasMode { STREAM, MATRIX, CHART }
    enum class ChartType { LINE, BAR, PIE, GAUGE }

    private var currentMode = CanvasMode.STREAM
    private var chartType = ChartType.LINE

    // Stream & Matrix properties
    private var serverUrl: String = ""
    private var channelName: String = ""
    private var gridCount: Int = 1
    private var channelsList: List<String> = emptyList()

    // Chart properties
    private var chartData: List<Float> = listOf(10f, 45f, 30f, 85f, 60f, 95f, 70f)
    private var chartLabels: List<String> = listOf("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul")

    private var isRendering = false
    private val tileBitmaps = ConcurrentHashMap<Int, Bitmap>()
    // 16 threads — handles 64 tiles in 4 parallel rounds (fast enough)
    private val fetchExecutor = Executors.newFixedThreadPool(16)

    // Common Paints
    private val paint = Paint(Paint.ANTI_ALIAS_FLAG)
    private val strokePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
    }
    private val fillPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.FILL
    }
    private val textPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.WHITE
        textSize = 12f * context.resources.displayMetrics.density
        typeface = Typeface.DEFAULT_BOLD
    }

    init {
        holder.addCallback(this)
    }

    // ── Configuration APIs ──

    fun setStream(url: String) {
        this.currentMode = CanvasMode.STREAM
        val parts = url.trim().split('#')
        var cleanUrl = parts[0].trim()
        if (parts.size > 1) this.channelName = parts[1].trim()

        val devHost = DolphinRuntime.instance?.getDevServerHost() ?: "192.168.1.6"
        this.serverUrl = cleanUrl.replace("127.0.0.1", devHost).replace("localhost", devHost)
        Log.i(TAG, "🐬 DolphinCanvas Stream Mode Active: $serverUrl")

        if (holder.surface != null && holder.surface.isValid) startRendering()
    }

    fun setMatrix(url: String, grid: Int = 64, channels: List<String> = emptyList()) {
        this.currentMode = CanvasMode.MATRIX
        this.gridCount = if (grid > 0) grid else 64
        this.channelsList = channels
        val devHost = DolphinRuntime.instance?.getDevServerHost() ?: ""
        var cleanUrl = url
        if (devHost.isNotEmpty() && devHost != "127.0.0.1") {
            cleanUrl = cleanUrl.replace(Regex("http://[0-9a-zA-Z\\.-]+:9094"), "http://$devHost:9094")
                .replace("127.0.0.1", devHost)
                .replace("localhost", devHost)
        }
        this.serverUrl = cleanUrl
        Log.i(TAG, "🐬 DolphinCanvas Matrix Mode Active: $gridCount grid -> $serverUrl")

        if (holder.surface != null && holder.surface.isValid) startRendering()
    }

    fun setChart(type: ChartType, data: List<Float>, labels: List<String> = emptyList()) {
        this.currentMode = CanvasMode.CHART
        this.chartType = type
        if (data.isNotEmpty()) this.chartData = data
        if (labels.isNotEmpty()) this.chartLabels = labels
        Log.i(TAG, "🐬 DolphinCanvas Chart Mode Active: Type=$type, Points=${chartData.size}")

        if (holder.surface != null && holder.surface.isValid) renderFrameOnce()
    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        var w = MeasureSpec.getSize(widthMeasureSpec)
        var h = MeasureSpec.getSize(heightMeasureSpec)
        val metrics = context.resources.displayMetrics
        if (w <= 0) w = metrics.widthPixels
        if (h <= 0) h = (metrics.heightPixels * 0.7).toInt()
        val safeW = MeasureSpec.makeMeasureSpec(w, MeasureSpec.EXACTLY)
        val safeH = MeasureSpec.makeMeasureSpec(h, MeasureSpec.EXACTLY)
        super.onMeasure(safeW, safeH)
    }

    // ── SurfaceHolder Callbacks ──

    override fun surfaceCreated(holder: SurfaceHolder) {
        startRendering()
    }

    override fun surfaceChanged(holder: SurfaceHolder, format: Int, width: Int, height: Int) {
        if (currentMode == CanvasMode.CHART) renderFrameOnce()
    }

    private fun stopRendering() {
        isRendering = false
        try {
            TitanTcpClient.removeMessageListener(tcpListener)
        } catch (_: Exception) {}
    }

    override fun surfaceDestroyed(holder: SurfaceHolder) {
        stopRendering()
    }

    // ── Render Loops ──

    private val tcpListener: (cmdType: Int, senderExt: Int, payload: ByteArray) -> Unit = { cmdType, senderExt, payload ->
        if (cmdType == TitanTcpClient.CMD_VIDEO_FRAME && payload.isNotEmpty()) {
            try {
                if (currentMode == CanvasMode.STREAM) {
                    val targetCamNum = serverUrl.substringAfter("cam_").substringBefore('#').substringBefore('?').substringBefore('/').toIntOrNull() ?: 1
                    if (senderExt == targetCamNum || targetCamNum == 0) {
                        val opts = BitmapFactory.Options().apply {
                            inPreferredConfig = Bitmap.Config.RGB_565
                        }
                        val bmp = BitmapFactory.decodeByteArray(payload, 0, payload.size, opts)
                        if (bmp != null) {
                            tileBitmaps[0] = bmp
                        }
                    }
                } else {
                    // MATRIX Mode: Update the specific tile for this camera
                    val targetCamNum = senderExt
                    val tileIndex = targetCamNum - 1
                    if (tileIndex in 0..63) {
                        val opts = BitmapFactory.Options().apply {
                            inPreferredConfig = Bitmap.Config.RGB_565
                        }
                        val bmp = BitmapFactory.decodeByteArray(payload, 0, payload.size, opts)
                        if (bmp != null) {
                            tileBitmaps[tileIndex] = bmp
                        }
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Frame decode error: ${e.message}")
            }
        }
    }

    private fun startRendering() {
        if (isRendering) return
        isRendering = true

        if (currentMode == CanvasMode.CHART) {
            renderFrameOnce()
            return
        }

        // 📡 Register TCP Listener for zero-copy TCP video streaming
        val devHost = DolphinRuntime.instance?.getDevServerHost() ?: "127.0.0.1"
        try {
            TitanTcpClient.addMessageListener(tcpListener)
            if (!TitanTcpClient.isConnected()) {
                Log.i(TAG, "⚡ Connecting Titan Pure Binary TCP Client to tcp://$devHost:9098...")
                TitanTcpClient.connect(devHost, 9098, 999)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Titan TCP connection error: ${e.message}")
        }

        // Dedicated rendering thread
        thread(start = true, name = "DolphinCanvasRenderThread") {
            while (isRendering) {
                val start = System.currentTimeMillis()
                renderActiveModeFrame()
                val elapsed = System.currentTimeMillis() - start
                val sleepTime = (33L - elapsed).coerceAtLeast(16L)
                try { Thread.sleep(sleepTime) } catch (_: Exception) {}
            }
        }

        // Network thread for HTTP fallback (only if URL starts with http)
        thread(start = true, name = "DolphinCanvasNetworkThread") {
            val baseUrl = serverUrl.substringBefore('?').trimEnd('/')
            while (isRendering) {
                if (currentMode == CanvasMode.STREAM) {
                    if (serverUrl.startsWith("http")) {
                        fetchSingleStreamFrame(serverUrl)
                        try { Thread.sleep(100L) } catch (_: Exception) {}
                    } else {
                        try { Thread.sleep(50L) } catch (_: Exception) {}
                    }
                } else if (currentMode == CanvasMode.MATRIX) {
                    if (serverUrl.startsWith("http")) {
                        val total = gridCount
                        for (i in 0 until total) {
                            if (!isRendering) break
                            val camNum = i + 1
                            val camId = "cam_" + (if (camNum < 10) "0$camNum" else "$camNum")
                            val tileUrl = "$baseUrl/$camId"
                            val capturedI = i
                            fetchExecutor.submit { fetchMatrixTileFrame(capturedI, tileUrl) }
                        }
                        try { Thread.sleep(100L) } catch (_: Exception) {}
                    } else {
                        try { Thread.sleep(50L) } catch (_: Exception) {}
                    }
                }
            }
        }
    }

    private fun fetchSingleStreamFrame(urlStr: String) {
        if (urlStr.isEmpty()) return
        try {
            val conn = URL(urlStr).openConnection() as HttpURLConnection
            conn.connectTimeout = 2000
            conn.readTimeout = 3000
            conn.setRequestProperty("Connection", "keep-alive")
            conn.setRequestProperty("Cache-Control", "no-cache")
            conn.setRequestProperty("User-Agent", "Dolphin-Native-Canvas/2.0")
            conn.useCaches = false
            if (conn.responseCode == 200) {
                val bytes = conn.inputStream.use { it.readBytes() }
                if (bytes.isNotEmpty()) {
                    val opts = BitmapFactory.Options().apply {
                        inPreferredConfig = Bitmap.Config.RGB_565 // 50% less memory vs ARGB_8888
                    }
                    val bmp = BitmapFactory.decodeByteArray(bytes, 0, bytes.size, opts)
                    if (bmp != null) {
                        tileBitmaps[0]?.let { old -> if (!old.isRecycled) old.recycle() }
                        tileBitmaps[0] = bmp
                    }
                }
            }
            conn.disconnect()
        } catch (_: Exception) {}
    }

    private fun fetchMatrixTileFrame(index: Int, urlStr: String) {
        try {
            val conn = URL(urlStr).openConnection() as HttpURLConnection
            conn.connectTimeout = 2000
            conn.readTimeout = 3000
            conn.setRequestProperty("Connection", "keep-alive")
            conn.setRequestProperty("Cache-Control", "no-cache")
            conn.setRequestProperty("User-Agent", "Dolphin-Native-Canvas/2.0")
            conn.useCaches = false
            if (conn.responseCode == 200) {
                val bytes = conn.inputStream.use { it.readBytes() }
                if (bytes.isNotEmpty()) {
                    val opts = BitmapFactory.Options().apply {
                        inPreferredConfig = Bitmap.Config.RGB_565
                    }
                    val bmp = BitmapFactory.decodeByteArray(bytes, 0, bytes.size, opts)
                    if (bmp != null) {
                        tileBitmaps[index] = bmp
                    }
                }
            } else {
                Log.e(TAG, "Tile $index HTTP ${conn.responseCode}")
            }
            conn.disconnect()
        } catch (e: Exception) {
            Log.e(TAG, "Tile $index fetch failed: ${e.message}")
        }
    }

    private fun renderFrameOnce() {
        thread(start = true) { renderActiveModeFrame() }
    }

    private fun renderActiveModeFrame() {
        var canvas: Canvas? = null
        try {
            canvas = holder.lockCanvas()
            if (canvas != null) {
                when (currentMode) {
                    CanvasMode.STREAM -> drawSingleStreamFrame(canvas)
                    CanvasMode.MATRIX -> drawMatrixFrame(canvas)
                    CanvasMode.CHART -> drawChartFrame(canvas)
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error rendering canvas frame: ${e.message}")
        } finally {
            if (canvas != null) {
                try { holder.unlockCanvasAndPost(canvas) } catch (_: Exception) {}
            }
        }
    }

    // ── Drawing Engines ──

    private fun drawSingleStreamFrame(canvas: Canvas) {
        val w = canvas.width
        val h = canvas.height
        val bmp = tileBitmaps[0]
        if (bmp != null && !bmp.isRecycled) {
            val src = Rect(0, 0, bmp.width, bmp.height)
            val dst = Rect(0, 0, w, h)
            canvas.drawBitmap(bmp, src, dst, null)
        } else {
            canvas.drawColor(Color.parseColor("#0f172a"))
        }

        if (channelName.isNotEmpty()) {
            val density = context.resources.displayMetrics.density
            textPaint.color = Color.parseColor("#38bdf8")
            canvas.drawText(channelName, 12f * density, 24f * density, textPaint)
        }
    }

    private fun drawMatrixFrame(canvas: Canvas) {
        val w = canvas.width
        val h = canvas.height
        val total = gridCount
        val cols = kotlin.math.ceil(kotlin.math.sqrt(total.toDouble())).toInt().coerceAtLeast(1)
        val rows = kotlin.math.ceil(total.toDouble() / cols).toInt().coerceAtLeast(1)

        val tileW = w / cols
        val tileH = h / rows
        val density = context.resources.displayMetrics.density

        strokePaint.color = Color.parseColor("#1e293b")
        strokePaint.strokeWidth = 2f
        fillPaint.color = Color.parseColor("#0f172a")

        for (i in 0 until total) {
            val col = i % cols
            val row = i / cols
            val left = col * tileW
            val top = row * tileH
            val right = if (col == cols - 1) w else left + tileW
            val bottom = if (row == rows - 1) h else top + tileH
            val dst = Rect(left, top, right, bottom)

            val bmp = tileBitmaps[i]
            if (bmp != null && !bmp.isRecycled) {
                val src = Rect(0, 0, bmp.width, bmp.height)
                canvas.drawBitmap(bmp, src, dst, null)
            } else {
                canvas.drawRect(dst, fillPaint)
            }
            canvas.drawRect(dst, strokePaint)

            val chName = if (i < channelsList.size) channelsList[i] else "CH ${i + 1}"
            textPaint.color = Color.parseColor("#38bdf8")
            canvas.drawText(chName, left + 4f * density, top + 14f * density, textPaint)
        }
    }

    private fun drawChartFrame(canvas: Canvas) {
        val w = canvas.width.toFloat()
        val h = canvas.height.toFloat()
        canvas.drawColor(Color.parseColor("#090d16")) // Deep Dark Canvas BG

        when (chartType) {
            ChartType.LINE -> drawLineChart(canvas, w, h)
            ChartType.BAR -> drawBarChart(canvas, w, h)
            ChartType.PIE -> drawPieChart(canvas, w, h)
            ChartType.GAUGE -> drawGaugeChart(canvas, w, h)
        }
    }

    private fun drawLineChart(canvas: Canvas, w: Float, h: Float) {
        if (chartData.isEmpty()) return
        val padding = 40f
        val chartW = w - (padding * 2)
        val chartH = h - (padding * 2)

        val maxVal = (chartData.maxOrNull() ?: 100f).coerceAtLeast(1f)
        val minVal = (chartData.minOrNull() ?: 0f)

        val path = Path()
        val stepX = chartW / (chartData.size - 1).coerceAtLeast(1)

        val points = chartData.mapIndexed { idx, valF ->
            val x = padding + (idx * stepX)
            val normalizedY = (valF - minVal) / (maxVal - minVal).coerceAtLeast(1f)
            val y = (h - padding) - (normalizedY * chartH)
            Pair(x, y)
        }

        path.moveTo(points[0].first, points[0].second)
        for (i in 1 until points.size) {
            val prev = points[i - 1]
            val curr = points[i]
            val cx = (prev.first + curr.first) / 2f
            path.cubicTo(cx, prev.second, cx, curr.second, curr.first, curr.second)
        }

        // Draw Line Shader Gradient
        strokePaint.color = Color.parseColor("#06b6d4") // Cyan
        strokePaint.strokeWidth = 6f
        strokePaint.shader = LinearGradient(0f, 0f, w, 0f, Color.parseColor("#38bdf8"), Color.parseColor("#818cf8"), Shader.TileMode.CLAMP)
        canvas.drawPath(path, strokePaint)
        strokePaint.shader = null

        // Draw Points
        fillPaint.color = Color.parseColor("#38bdf8")
        points.forEach { (px, py) ->
            canvas.drawCircle(px, py, 8f, fillPaint)
        }
    }

    private fun drawBarChart(canvas: Canvas, w: Float, h: Float) {
        if (chartData.isEmpty()) return
        val padding = 40f
        val chartW = w - (padding * 2)
        val chartH = h - (padding * 2)

        val maxVal = (chartData.maxOrNull() ?: 100f).coerceAtLeast(1f)
        val barCount = chartData.size
        val barW = (chartW / barCount) * 0.6f
        val gap = (chartW / barCount) * 0.4f

        chartData.forEachIndexed { idx, valF ->
            val left = padding + (idx * (barW + gap)) + (gap / 2f)
            val barH = (valF / maxVal) * chartH
            val top = (h - padding) - barH
            val right = left + barW
            val bottom = h - padding

            fillPaint.shader = LinearGradient(left, top, left, bottom, Color.parseColor("#f43f5e"), Color.parseColor("#881337"), Shader.TileMode.CLAMP)
            val rectF = RectF(left, top, right, bottom)
            canvas.drawRoundRect(rectF, 12f, 12f, fillPaint)
        }
        fillPaint.shader = null
    }

    private fun drawPieChart(canvas: Canvas, w: Float, h: Float) {
        val radius = (w.coerceAtMost(h) / 2f) - 40f
        val rectF = RectF(w / 2f - radius, h / 2f - radius, w / 2f + radius, h / 2f + radius)

        val colors = intArrayOf(Color.parseColor("#38bdf8"), Color.parseColor("#f43f5e"), Color.parseColor("#10b981"), Color.parseColor("#fbbf24"))
        val total = chartData.sum().coerceAtLeast(1f)

        var startAngle = -90f
        chartData.forEachIndexed { idx, valF ->
            val sweepAngle = (valF / total) * 360f
            fillPaint.color = colors[idx % colors.size]
            canvas.drawArc(rectF, startAngle, sweepAngle, true, fillPaint)
            startAngle += sweepAngle
        }
    }

    private fun drawGaugeChart(canvas: Canvas, w: Float, h: Float) {
        val cx = w / 2f
        val cy = h / 2f + 40f
        val radius = (w.coerceAtMost(h) / 2.2f)
        val rectF = RectF(cx - radius, cy - radius, cx + radius, cy + radius)

        // Arc Background
        strokePaint.color = Color.parseColor("#1e293b")
        strokePaint.strokeWidth = 24f
        strokePaint.strokeCap = Paint.Cap.ROUND
        canvas.drawArc(rectF, 180f, 180f, false, strokePaint)

        // Active Value Arc
        val currentVal = chartData.firstOrNull() ?: 50f
        val sweepAngle = (currentVal.coerceIn(0f, 100f) / 100f) * 180f
        strokePaint.color = Color.parseColor("#06b6d4")
        canvas.drawArc(rectF, 180f, sweepAngle, false, strokePaint)

        // Needle Line
        val angleRad = Math.toRadians((180f + sweepAngle).toDouble())
        val needleX = cx + (radius * 0.7f * Math.cos(angleRad)).toFloat()
        val needleY = cy + (radius * 0.7f * Math.sin(angleRad)).toFloat()

        strokePaint.color = Color.parseColor("#f43f5e")
        strokePaint.strokeWidth = 8f
        canvas.drawLine(cx, cy, needleX, needleY, strokePaint)
        fillPaint.color = Color.parseColor("#f43f5e")
        canvas.drawCircle(cx, cy, 14f, fillPaint)
    }
}
