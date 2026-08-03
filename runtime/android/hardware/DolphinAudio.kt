package io.dolphin.runtime.hardware

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioManager
import android.media.MediaPlayer
import android.net.Uri
import android.util.Log
import java.io.File

object DolphinAudio {
    private var mediaPlayer: MediaPlayer? = null
    private const val TAG = "DolphinAudio"

    /**
     * Play audio from a local file path or URL.
     * Returns a result map: {"status":"playing"} or {"error":"..."}.
     */
    fun playSound(ctx: Context, urlOrPath: String): Map<String, Any> {
        try {
            stopSound()

            if (urlOrPath.isEmpty()) {
                Log.e(TAG, "playSound: empty path")
                return mapOf("error" to "Empty audio path")
            }

            val mp: MediaPlayer

            val size: Long
            if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
                // Remote URL: manual setup
                size = -1L
                mp = MediaPlayer().apply {
                    setAudioAttributes(
                        AudioAttributes.Builder()
                            .setUsage(AudioAttributes.USAGE_MEDIA)
                            .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                            .build()
                    )
                    setDataSource(urlOrPath)
                    prepare()
                }
            } else {
                // Local file: use Uri + MediaPlayer.create (most reliable)
                val cleanPath = urlOrPath.removePrefix("file://")
                val file = File(cleanPath)
                if (!file.exists()) {
                    Log.e(TAG, "File not found: $cleanPath")
                    return mapOf("error" to "File not found: $cleanPath")
                }
                size = file.length()
                Log.d(TAG, "File exists: $cleanPath  size=$size bytes")

                val uri = Uri.fromFile(file)
                // MediaPlayer.create handles prepare() internally
                mp = MediaPlayer.create(ctx, uri)
                    ?: return mapOf("error" to "MediaPlayer.create returned null for: $cleanPath")
            }

            mp.setOnCompletionListener {
                Log.d(TAG, "Playback completed")
                it.release()
                if (mediaPlayer === it) mediaPlayer = null
            }
            mp.setOnErrorListener { _, what, extra ->
                Log.e(TAG, "MediaPlayer error: what=$what extra=$extra")
                false
            }

            mp.start()
            mediaPlayer = mp
            Log.d(TAG, "✅ Playback started: $urlOrPath")
            return mapOf("status" to "playing", "path" to urlOrPath, "size" to size)

        } catch (e: Throwable) {
            Log.e(TAG, "❌ playSound failed: ${e.message}", e)
            return mapOf("error" to (e.message ?: "Unknown error"))
        }
    }

    fun stopSound() {
        try {
            mediaPlayer?.let {
                try { if (it.isPlaying) it.stop() } catch (_: Throwable) {}
                it.release()
            }
            mediaPlayer = null
            Log.d(TAG, "Audio stopped")
        } catch (e: Throwable) {
            Log.e(TAG, "stopSound error", e)
        }
    }

    fun setVolume(ctx: Context, level: Int) {
        try {
            val audioManager = ctx.getSystemService(Context.AUDIO_SERVICE) as AudioManager
            val maxVolume = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC)
            audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, level.coerceIn(0, maxVolume), 0)
        } catch (e: Throwable) {
            Log.e(TAG, "setVolume error", e)
        }
    }
}

