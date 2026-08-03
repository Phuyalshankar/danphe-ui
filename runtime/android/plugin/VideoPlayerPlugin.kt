package io.dolphin.runtime.plugin

import android.app.Activity
import android.content.Context
import android.graphics.Color
import android.net.Uri
import android.view.View
import android.widget.FrameLayout
import android.widget.MediaController
import android.widget.VideoView
import android.util.Log
import io.dolphin.runtime.ViewFactory

/**
 * Native Android Video Player Plugin using VideoView & MediaController.
 * Maps to typeCode 0x50.
 */
class VideoPlayerPlugin : DolphinUIPlugin {
    override val typeCode: Byte = 0x50

    override fun createView(ctx: Context, bin: ByteArray, factory: ViewFactory): View {
        val action = factory.nextStr()
        val videoUrl = factory.nextStr()

        val container = FrameLayout(ctx).apply {
            setBackgroundColor(Color.BLACK)
        }

        if (videoUrl.isNotEmpty()) {
            val resolvedUrl = when {
                videoUrl.startsWith("http") || videoUrl.startsWith("file://") || videoUrl.startsWith("content://") -> videoUrl
                videoUrl.startsWith("./assets/") || videoUrl.startsWith("assets/") -> {
                    val cleanPath = videoUrl.removePrefix("./")
                    "http://192.168.1.15:7787/$cleanPath"
                }
                videoUrl.startsWith("/") -> "file://$videoUrl"
                else -> "file:///sdcard/$videoUrl"
            }


            try {
                val videoView = VideoView(ctx).apply {
                    val mc = MediaController(ctx)
                    mc.setAnchorView(this)
                    setMediaController(mc)
                    setVideoURI(Uri.parse(resolvedUrl))
                    setOnPreparedListener { mp ->
                        mp.isLooping = true
                        mp.start()
                    }
                    setOnErrorListener { _, what, extra ->
                        Log.e("VideoPlayerPlugin", "Native VideoView Error ($what, $extra): $resolvedUrl")
                        true
                    }
                }

                container.addView(videoView, FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.MATCH_PARENT,
                    FrameLayout.LayoutParams.MATCH_PARENT
                ))
            } catch (e: Exception) {
                Log.e("VideoPlayerPlugin", "Failed to load Native VideoView: ${e.message}", e)
            }
        }

        factory.applyStyles(container, bin)
        return container
    }


}

