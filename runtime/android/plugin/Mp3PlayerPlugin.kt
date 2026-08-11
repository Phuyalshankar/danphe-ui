package io.dolphin.runtime

import android.app.Activity
import android.content.Context
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.view.Gravity
import android.view.View
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import android.util.Log

/**
 * Native Android MP3 Music Player Plugin (opcode 0x51).
 * Maps to <div type="mp3player">.
 * Includes Track Name, Play/Pause/Stop Controls, and Audio Engine Integration.
 */
class Mp3PlayerPlugin : DolphinUIPlugin {
    override val typeCode: Byte = 0x51

    override fun createView(ctx: Context, bin: ByteArray, factory: ViewFactory): View {
        val action = factory.nextStr()
        var audioUrl = factory.nextStr()

        val bgShape = GradientDrawable().apply {
            setColor(Color.parseColor("#0F172A")) // slate-900
            setStroke(2, Color.parseColor("#1E293B")) // slate-800
            cornerRadius = 32f
        }

        val container = LinearLayout(ctx).apply {
            orientation = LinearLayout.VERTICAL
            background = bgShape
            setPadding(32, 32, 32, 32)
        }

        // Header Row: Icon + Title
        val headerRow = LinearLayout(ctx).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
        }

        val musicIcon = TextView(ctx).apply {
            text = "🎵"
            textSize = 24f
            setPadding(0, 0, 16, 0)
        }

        val trackTitle = TextView(ctx).apply {
            text = if (audioUrl.isNotEmpty() && !audioUrl.contains("sys_picked_audio")) audioUrl else "🎵 Dedicated MP3 Audio Canvas"
            setTextColor(Color.WHITE)
            textSize = 14f
            typeface = android.graphics.Typeface.DEFAULT_BOLD
        }

        headerRow.addView(musicIcon)
        headerRow.addView(trackTitle)
        container.addView(headerRow)

        // Status / Waveform bar
        val statusText = TextView(ctx).apply {
            text = "Idle • Tap Play or Pick Audio File"
            setTextColor(Color.parseColor("#94A3B8")) // slate-400
            textSize = 12f
            setPadding(0, 12, 0, 20)
        }
        container.addView(statusText)

        // Controls Deck
        val controlsRow = LinearLayout(ctx).apply {
            orientation = LinearLayout.HORIZONTAL
            weightSum = 3f
        }

        val btnPlay = Button(ctx).apply {
            text = "▶ Play"
            setTextColor(Color.WHITE)
            setBackgroundColor(Color.parseColor("#16A34A")) // emerald-600
            textSize = 11f
            layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f).apply {
                marginEnd = 8
            }
            setOnClickListener {
                statusText.text = "🔊 Playing Audio..."
                val target = if (audioUrl.isNotEmpty()) audioUrl else "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                DolphinAudio.playSound(ctx, target)
            }
        }

        val btnStop = Button(ctx).apply {
            text = "⏹ Stop"
            setTextColor(Color.WHITE)
            setBackgroundColor(Color.parseColor("#DC2626")) // rose-600
            textSize = 11f
            layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f).apply {
                marginEnd = 8
            }
            setOnClickListener {
                statusText.text = "⏹ Stopped"
                DolphinAudio.stopSound()
            }
        }

        val btnPick = Button(ctx).apply {
            text = "📂 Pick File"
            setTextColor(Color.WHITE)
            setBackgroundColor(Color.parseColor("#2563EB")) // blue-600
            textSize = 11f
            layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f)
            setOnClickListener {
                (ctx as? Activity)?.startActivityForResult(DolphinStorage.openFilePicker("audio/*"), 9001)
            }
        }

        controlsRow.addView(btnPlay)
        controlsRow.addView(btnStop)
        controlsRow.addView(btnPick)
        container.addView(controlsRow)

        // Listen for NanoStore state changes for picked audio
        DolphinStateEngine.addListener { key, value ->
            if (key == "sys_picked_audio_name" || key == "sys_picked_audio_url") {
                val strVal = value.toString()
                if (strVal.isNotEmpty()) {
                    (ctx as? Activity)?.runOnUiThread {
                        if (key == "sys_picked_audio_name") {
                            trackTitle.text = "🎵 $strVal"
                        }
                        if (key == "sys_picked_audio_url") {
                            audioUrl = strVal
                            statusText.text = "🔊 Playing Picked Track..."
                        }
                    }
                }
            }
        }

        factory.applyStyles(container, bin)
        return container
    }
}
