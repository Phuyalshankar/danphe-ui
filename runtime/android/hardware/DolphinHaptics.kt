package io.dolphin.runtime

import android.content.Context
import android.media.AudioAttributes
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.util.Log

object DolphinHaptics {
    fun vibrate(ctx: Context, pattern: String) {
        try {
            @Suppress("DEPRECATION")
            val vibrator = ctx.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
            if (vibrator == null || !vibrator.hasVibrator()) {
                Log.w("DolphinHaptics", "Device has no vibrator motor")
                return
            }

            val timings = when (pattern) {
                "light" -> longArrayOf(0, 250)
                "heavy" -> longArrayOf(0, 600, 200, 600)
                else    -> longArrayOf(0, 500)
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val audioAttrs = AudioAttributes.Builder()
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .setUsage(AudioAttributes.USAGE_ASSISTANCE_SONIFICATION)
                    .build()
                if (timings.size > 2) {
                    val effect = VibrationEffect.createWaveform(timings, -1)
                    vibrator.vibrate(effect, audioAttrs)
                } else {
                    val effect = VibrationEffect.createOneShot(timings[1], VibrationEffect.DEFAULT_AMPLITUDE)
                    vibrator.vibrate(effect, audioAttrs)
                }
            } else {
                @Suppress("DEPRECATION")
                if (timings.size > 2) {
                    vibrator.vibrate(timings, -1)
                } else {
                    vibrator.vibrate(timings[1])
                }
            }
            Log.d("DolphinHaptics", "Vibrated successfully with pattern: $pattern")
        } catch (e: Exception) {
            Log.e("DolphinHaptics", "Failed to vibrate: ${e.message}", e)
        }
    }
}
