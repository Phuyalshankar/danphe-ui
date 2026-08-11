package io.dolphin.runtime

import android.content.Context
import android.graphics.Color
import android.net.Uri
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.VideoView

class VideoPlayerPlugin : DolphinUIPlugin {
    override val typeCode: Byte = 0x52.toByte()

    override fun createView(ctx: Context, bin: ByteArray, factory: ViewFactory): View {
        val action = factory.nextStr()
        var videoUrl = factory.nextStr()

        Log.i("VideoPlayerPlugin", "▶️ INIT VideoPlayerPlugin. Initial URL: $videoUrl")

        if (videoUrl.isEmpty() || videoUrl.contains("sys_picked_video_url")) {
            val stateVal = DolphinStateEngine.get("sys_picked_video_url")?.toString() ?: ""
            videoUrl = if (stateVal.isNotEmpty()) stateVal else ""
            Log.i("VideoPlayerPlugin", "🔥 Resolved initial state URL: $videoUrl")
        }

        val container = FrameLayout(ctx).apply {
            setBackgroundColor(Color.BLACK)
            clipToOutline = true
            minimumHeight = factory.dp(224)
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                factory.dp(224)
            )
        }

        val videoView = VideoView(ctx).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT,
                Gravity.CENTER
            )
        }

        val progressBar = ProgressBar(ctx).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.WRAP_CONTENT,
                FrameLayout.LayoutParams.WRAP_CONTENT,
                Gravity.CENTER
            )
            visibility = View.GONE
        }

        val errorText = TextView(ctx).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.WRAP_CONTENT,
                Gravity.CENTER
            )
            setTextColor(Color.RED)
            setBackgroundColor(Color.parseColor("#80000000"))
            setPadding(16, 16, 16, 16)
            gravity = Gravity.CENTER
            visibility = View.GONE
        }

        container.addView(videoView)
        container.addView(progressBar)
        container.addView(errorText)

        fun playUrl(rawUrl: String) {
            Log.i("VideoPlayerPlugin", "▶️ playUrl() called with: $rawUrl")
            if (rawUrl.isEmpty()) return

            Handler(Looper.getMainLooper()).post {
                try {
                    progressBar.visibility = View.GONE
                    errorText.visibility = View.GONE
                    videoView.visibility = View.VISIBLE

                    videoView.setOnPreparedListener { mp ->
                        progressBar.visibility = View.GONE
                        errorText.visibility = View.GONE
                        try { mp.setVolume(0f, 0f) } catch (_: Exception) {}
                        mp.isLooping = true
                        videoView.start()
                        Log.i("VideoPlayerPlugin", "✅ VideoView READY")
                    }

                    videoView.setOnErrorListener { _, what, extra ->
                        Log.e("VideoPlayerPlugin", "❌ VideoView error: $what, $extra")
                        progressBar.visibility = View.GONE
                        errorText.visibility = View.VISIBLE
                        errorText.text = "Video error ($what,$extra)"
                        true
                    }

                    videoView.setVideoURI(Uri.parse(rawUrl))
                } catch (e: Exception) {
                    progressBar.visibility = View.GONE
                    errorText.visibility = View.VISIBLE
                    errorText.text = "Crash: ${e.message}"
                    Log.e("VideoPlayerPlugin", "❌ Crash: ${e.message}", e)
                }
            }
        }

        if (videoUrl.isNotEmpty()) {
            playUrl(videoUrl)
        }

        // Subscribe to NanoStore state changes for dynamic picked video embedding
        DolphinStateEngine.addListener { key, value ->
            if (key == "sys_picked_video_url") {
                val newUrl = value.toString()
                Log.i("VideoPlayerPlugin", "🔥 StateEngine Triggered! sys_picked_video_url = $newUrl")
                if (newUrl.isNotEmpty()) {
                    playUrl(newUrl)
                }
            }
        }

        container.addOnAttachStateChangeListener(object : View.OnAttachStateChangeListener {
            override fun onViewAttachedToWindow(v: View) {}
            override fun onViewDetachedFromWindow(v: View) {
                try { videoView.pause() } catch (_: Exception) {}
            }
        })

        factory.applyStyles(container, bin)
        return container
    }
}
