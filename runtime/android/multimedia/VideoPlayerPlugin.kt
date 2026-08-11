package io.dolphin.runtime

import android.app.Activity
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
        val isDynamicPickedVideo = videoUrl.isEmpty() || videoUrl.contains("sys_picked_video_url")

        Log.i("VideoPlayerPlugin", "▶️ INIT VideoPlayerPlugin. Initial URL: $videoUrl")

        if (isDynamicPickedVideo) {
            val stateVal = DolphinStateEngine.get("sys_picked_video_url")?.toString() ?: ""
            videoUrl = if (stateVal.isNotEmpty()) stateVal else ""
            Log.i("VideoPlayerPlugin", "🔥 Resolved initial state URL: $videoUrl")
        }

        val originalHeight = factory.dp(224)
        var isFullScreen = false
        var isCurrentlyAttached = false
        var activeUrl: String? = null

        val container = FrameLayout(ctx).apply {
            setBackgroundColor(Color.BLACK)
            clipToOutline = true
            minimumHeight = originalHeight
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                originalHeight
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

        val fullscreenBtn = TextView(ctx).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.WRAP_CONTENT,
                FrameLayout.LayoutParams.WRAP_CONTENT,
                Gravity.TOP or Gravity.END
            ).apply {
                topMargin = 16
                rightMargin = 16
            }
            text = " ⛶ Fullscreen "
            textSize = 11f
            setTextColor(Color.CYAN)
            setBackgroundColor(Color.parseColor("#D00F172A"))
            setPadding(20, 10, 20, 10)
        }

        fun toggleFullscreen() {
            isFullScreen = !isFullScreen
            val activity = ctx as? Activity ?: (DolphinRuntime.instance?.context as? Activity)
            val rootLayout = activity?.findViewById<ViewGroup>(android.R.id.content)

            if (isFullScreen) {
                fullscreenBtn.text = " ✕ Exit Fullscreen "
                fullscreenBtn.setTextColor(Color.RED)
                container.layoutParams = FrameLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )
                if (rootLayout != null) {
                    (container.parent as? ViewGroup)?.removeView(container)
                    rootLayout.addView(container)
                    container.bringToFront()
                }
            } else {
                fullscreenBtn.text = " ⛶ Fullscreen "
                fullscreenBtn.setTextColor(Color.CYAN)
                container.layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    originalHeight
                )
                if (rootLayout != null) {
                    rootLayout.removeView(container)
                }
            }
        }

        fullscreenBtn.setOnClickListener { toggleFullscreen() }

        container.addView(videoView)
        container.addView(progressBar)
        container.addView(errorText)
        container.addView(fullscreenBtn)

        fun startStreaming(rawUrl: String) {
            if (rawUrl.isEmpty()) return
            var finalUrl = rawUrl.trim()

            val devHost = DolphinRuntime.instance?.getDevServerHost()
            if (!devHost.isNullOrEmpty() && (finalUrl.contains("127.0.0.1") || finalUrl.contains("localhost"))) {
                finalUrl = finalUrl.replace("127.0.0.1", devHost).replace("localhost", devHost)
            }

            if (activeUrl == finalUrl) {
                try {
                    progressBar.visibility = View.GONE
                    if (!videoView.isPlaying) {
                        videoView.start()
                    }
                    return
                } catch (_: Exception) {}
            }
            activeUrl = finalUrl

            Handler(Looper.getMainLooper()).post {
                try {
                    progressBar.visibility = View.GONE
                    errorText.visibility = View.GONE
                    
                    videoView.setOnPreparedListener { mp ->
                        progressBar.visibility = View.GONE
                        errorText.visibility = View.GONE
                        try { mp.setVolume(0f, 0f) } catch (_: Exception) {}
                        mp.isLooping = true
                        videoView.start()
                    }

                    videoView.setOnErrorListener { mp, what, extra ->
                        progressBar.visibility = View.GONE
                        true
                    }

                    videoView.setVideoURI(Uri.parse(finalUrl))

                } catch (e: Exception) {
                    progressBar.visibility = View.GONE
                    Log.e("VideoPlayerPlugin", "Stream start error: ${e.message}")
                }
            }
        }

        fun stopStreaming() {
            try {
                if (videoView.isPlaying) {
                    videoView.pause()
                }
                progressBar.visibility = View.GONE
            } catch (_: Exception) {}
        }

        if (videoUrl.isNotEmpty()) {
            startStreaming(videoUrl)
        }

        container.addOnAttachStateChangeListener(object : View.OnAttachStateChangeListener {
            override fun onViewAttachedToWindow(v: View) {
                isCurrentlyAttached = true
                if (videoUrl.isNotEmpty()) {
                    startStreaming(videoUrl)
                }
            }

            override fun onViewDetachedFromWindow(v: View) {
                isCurrentlyAttached = false
                stopStreaming()
            }
        })

        if (isDynamicPickedVideo) {
            DolphinStateEngine.addListener { key, value ->
                if (key == "sys_picked_video_url") {
                    val newUrl = value.toString()
                    videoUrl = newUrl
                    if (newUrl.isNotEmpty()) {
                        startStreaming(newUrl)
                    }
                }
            }
        }

        factory.applyStyles(container, bin)
        return container
    }
}
