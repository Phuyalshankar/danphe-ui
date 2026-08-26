package io.dolphin.runtime

import android.content.Context
import android.media.AudioManager
import android.media.Ringtone
import android.media.RingtoneManager
import android.media.ToneGenerator
import android.net.Uri
import android.util.Log

object DolphinRingtone {
    private var currentRingtone: Ringtone? = null
    private var toneGenerator: ToneGenerator? = null

    // Play default system tone (type can be TYPE_RINGTONE, TYPE_NOTIFICATION, TYPE_ALARM)
    fun playSystemTone(ctx: Context, type: Int = RingtoneManager.TYPE_RINGTONE) {
        try {
            stopSystemTone()
            val uri: Uri = RingtoneManager.getDefaultUri(type)
            currentRingtone = RingtoneManager.getRingtone(ctx, uri)
            currentRingtone?.play()
            Log.d("DolphinRingtone", "Playing system tone of type: $type")
        } catch (e: Throwable) {
            Log.e("DolphinRingtone", "Failed to play system tone", e)
        }
    }

    fun playToneByUri(ctx: Context, uriString: String) {
        try {
            stopSystemTone()
            val uri = Uri.parse(uriString)
            currentRingtone = RingtoneManager.getRingtone(ctx, uri)
            currentRingtone?.play()
        } catch (e: Throwable) {
            Log.e("DolphinRingtone", "Failed to play tone from URI", e)
        }
    }

    fun stopSystemTone() {
        try {
            currentRingtone?.let {
                if (it.isPlaying) {
                    it.stop()
                }
            }
            currentRingtone = null
        } catch (e: Throwable) {
            Log.e("DolphinRingtone", "Failed to stop system tone", e)
        }
    }

    // List all available ringtones on the device
    fun getAvailableTones(ctx: Context, type: Int = RingtoneManager.TYPE_ALL): List<Map<String, String>> {
        val tones = mutableListOf<Map<String, String>>()
        try {
            val ringtoneManager = RingtoneManager(ctx)
            ringtoneManager.setType(type)
            val cursor = ringtoneManager.cursor
            while (cursor.moveToNext()) {
                val title = cursor.getString(RingtoneManager.TITLE_COLUMN_INDEX) ?: ""
                val uriPrefix = cursor.getString(RingtoneManager.URI_COLUMN_INDEX) ?: ""
                val id = cursor.getString(RingtoneManager.ID_COLUMN_INDEX) ?: ""
                val fullUri = "$uriPrefix/$id"
                tones.add(mapOf(Pair("title", title), Pair("uri", fullUri)))
            }
        } catch (e: Throwable) {
            Log.e("DolphinRingtone", "Failed to get available tones", e)
        }
        return tones
    }

    // Play dial pad tones (DTMF tones) - 0 to 9, *, #
    fun playDialTone(toneType: Int = ToneGenerator.TONE_DTMF_0, durationMs: Int = 200) {
        try {
            if (toneGenerator == null) {
                // STREAM_DTMF is specifically for dial pad tones
                toneGenerator = ToneGenerator(AudioManager.STREAM_DTMF, 80)
            }
            toneGenerator?.startTone(toneType, durationMs)
            Log.d("DolphinRingtone", "Playing dial tone: $toneType")
        } catch (e: Throwable) {
            Log.e("DolphinRingtone", "Failed to play dial tone", e)
        }
    }
    
    fun releaseDialTone() {
        try {
            toneGenerator?.release()
            toneGenerator = null
        } catch (e: Throwable) {
            Log.e("DolphinRingtone", "Failed to release tone generator", e)
        }
    }
}
