package io.dolphin.runtime

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Color
import android.util.AttributeSet
import android.util.Log
import android.view.SurfaceHolder
import android.view.SurfaceView
import java.net.HttpURLConnection
import java.net.URL
import kotlin.concurrent.thread

/**
 * 👑 TitanCanvas — Snapshot-based Video Rendering Engine (Opcode 0x61)
 * Fetches MJPEG/BMP snapshots via HTTP and draws to SurfaceView.
 */
class TitanCanvas @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null
) : SurfaceView(context, attrs), SurfaceHolder.Callback {

    companion object {
        private const val TAG = "TitanCanvas"
    }

    private var serverUrl: String = ""
    private var channelName: String = ""
    private var isRendering = false
    
    private var fixedWidth = 0
    private var fixedHeight = 0

    init {
        holder.addCallback(this)
    }

    fun setFixedSize(width: Int, height: Int) {
        this.fixedWidth = width
        this.fixedHeight = height
        holder.setFixedSize(width, height)
        requestLayout()
    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        val widthMode = MeasureSpec.getMode(widthMeasureSpec)
        val widthSize = MeasureSpec.getSize(widthMeasureSpec)
        val heightMode = MeasureSpec.getMode(heightMeasureSpec)
        val heightSize = MeasureSpec.getSize(heightMeasureSpec)

        val density = context.resources.displayMetrics.density
        val defaultW = if (fixedWidth > 0) fixedWidth else (160 * density).toInt()
        val defaultH = if (fixedHeight > 0) fixedHeight else (120 * density).toInt()

        val w = when (widthMode) {
            MeasureSpec.EXACTLY -> widthSize
            MeasureSpec.AT_MOST -> if (widthSize > 0) widthSize else defaultW
            else -> defaultW
        }

        val h = when (heightMode) {
            MeasureSpec.EXACTLY -> heightSize
            MeasureSpec.AT_MOST -> if (heightSize > 0) heightSize else defaultH
            else -> defaultH
        }

        setMeasuredDimension(w, h)
    }

    fun setServerUrl(url: String) {
        val parts = url.trim().split('#')
        var cleanUrl = parts[0].trim()
        if (parts.size > 1) {
            this.channelName = parts[1].trim()
        }

        val devHost = DolphinRuntime.instance?.getDevServerHost() ?: "192.168.1.6"
        cleanUrl = cleanUrl.replace("127.0.0.1", devHost).replace("localhost", devHost)
        
        this.serverUrl = cleanUrl
        Log.i(TAG, "⚡ Titan Snapshot Canvas Active: $serverUrl (Channel: $channelName)")
        
        if (holder.surface != null && holder.surface.isValid) {
            startRendering()
        }
    }

    override fun surfaceCreated(holder: SurfaceHolder) {
        startRendering()
    }

    override fun surfaceChanged(holder: SurfaceHolder, format: Int, width: Int, height: Int) {}

    override fun surfaceDestroyed(holder: SurfaceHolder) {
        isRendering = false
    }

    private fun startRendering() {
        if (serverUrl.isEmpty() || isRendering) return
        isRendering = true

        thread(start = true) {
            var isFirstFrame = true

            while (isRendering) {
                try {
                    if (isFirstFrame) {
                        // Randomized Initial Jitter (0-600ms) to eliminate Thundering Herd socket collisions
                        val initialJitter = (Math.random() * 600).toLong()
                        Thread.sleep(initialJitter)
                        isFirstFrame = false
                    } else {
                        // Polling rate with random jitter (350ms - 550ms) to keep threads desynchronized
                        val pollJitter = 350L + (Math.random() * 200).toLong()
                        Thread.sleep(pollJitter)
                    }

                    val connection = URL(serverUrl).openConnection() as HttpURLConnection
                    connection.connectTimeout = 3000
                    connection.readTimeout = 3000
                    connection.requestMethod = "GET"
                    connection.doInput = true
                    connection.setRequestProperty("Connection", "keep-alive")
                    connection.setRequestProperty("User-Agent", "Titan-Native-Canvas")

                    if (connection.responseCode == 200) {
                        val bytes = connection.inputStream.use { it.readBytes() }
                        if (bytes.isNotEmpty()) {
                            val bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.size)
                            if (bitmap != null) {
                                drawFrame(bitmap)
                            }
                        }
                    }
                    connection.disconnect()
                } catch (e: Exception) {
                    Log.w(TAG, "Snapshot fetch failed for $serverUrl: ${e.message}")
                }
            }
        }
    }

    private fun drawFrame(bitmap: Bitmap) {
        var canvas: android.graphics.Canvas? = null
        try {
            canvas = holder.lockCanvas()
            if (canvas != null) {
                val canvasWidth = canvas.width
                val canvasHeight = canvas.height
                
                if (canvasWidth > 0 && canvasHeight > 0) {
                    // Draw the fetched snapshot stretching to 100% of the SurfaceView bounds
                    val srcRect = android.graphics.Rect(0, 0, bitmap.width, bitmap.height)
                    val dstRect = android.graphics.Rect(0, 0, canvasWidth, canvasHeight)
                    canvas.drawBitmap(bitmap, srcRect, dstRect, null)

                    // Overlay channel badge directly on top of the canvas
                    if (channelName.isNotEmpty()) {
                        val density = context.resources.displayMetrics.density
                        val paint = android.graphics.Paint().apply {
                            color = Color.parseColor("#38bdf8") // Cyan-400
                            textSize = 11f * density
                            isAntiAlias = true
                            typeface = android.graphics.Typeface.DEFAULT_BOLD
                        }
                        val bgPaint = android.graphics.Paint().apply {
                            color = Color.parseColor("#CC0f172a") // Slate-900 80% opacity
                        }
                        val textWidth = paint.measureText(channelName)
                        val paddingH = 6f * density
                        val badgeHeight = 18f * density
                        
                        canvas.drawRect(0f, 0f, textWidth + (paddingH * 2), badgeHeight, bgPaint)
                        canvas.drawText(channelName, paddingH, badgeHeight - (4f * density), paint)
                    }
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error drawing frame: ${e.message}")
        } finally {
            if (canvas != null) {
                try {
                    holder.unlockCanvasAndPost(canvas)
                } catch (e: Exception) {
                    Log.e(TAG, "Error unlocking canvas: ${e.message}")
                }
            }
        }
    }
}

