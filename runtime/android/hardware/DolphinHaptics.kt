package io.dolphin.runtime

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.util.Log

object DolphinHaptics {
    fun vibrate(ctx: Context, pattern: String) {
        try {
            val vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vibratorManager = ctx.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
                vibratorManager.defaultVibrator
            } else {
                @Suppress("DEPRECATION")
                ctx.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
            }

            if (!vibrator.hasVibrator()) return

            when (pattern) {
                "light" -> {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                        vibrator.vibrate(VibrationEffect.createPredefined(VibrationEffect.EFFECT_TICK))
                    } else {
                        @Suppress("DEPRECATION")
                        vibrator.vibrate(20)
                    }
                }
                "medium" -> {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        vibrator.vibrate(VibrationEffect.createOneShot(50, VibrationEffect.DEFAULT_AMPLITUDE))
                    } else {
                        @Suppress("DEPRECATION")
                        vibrator.vibrate(50)
                    }
                }
                "heavy" -> {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                        vibrator.vibrate(VibrationEffect.createPredefined(VibrationEffect.EFFECT_HEAVY_CLICK))
                    } else {
                        @Suppress("DEPRECATION")
                        vibrator.vibrate(100)
                    }
                }
                else -> {
                    @Suppress("DEPRECATION")
                    vibrator.vibrate(50)
                }
            }
            Log.d("DolphinHaptics", "Vibrated with pattern: $pattern")
        } catch (e: Exception) {
            Log.e("DolphinHaptics", "Failed to vibrate", e)
        }
    }
}
