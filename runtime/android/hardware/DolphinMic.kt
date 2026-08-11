package io.dolphin.runtime

import android.media.MediaRecorder
import android.util.Log

object DolphinMic {
    private var recorder: MediaRecorder? = null
    private const val TAG = "DolphinMic"

    fun startRecording(outputPath: String): String? {
        try {
            stopRecording() // Clean up any existing recording first
            val file = java.io.File(outputPath)
            file.parentFile?.mkdirs()
            if (file.exists()) file.delete()

            recorder = MediaRecorder().apply {
                setAudioSource(MediaRecorder.AudioSource.MIC)
                setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
                setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
                setOutputFile(outputPath)
                prepare()
                start()
            }
            Log.d(TAG, "Recording started: $outputPath")
            return null // success
        } catch (e: Throwable) {
            Log.e(TAG, "Failed to start recording: ${e.message}", e)
            recorder?.release()
            recorder = null
            return e.message ?: "Unknown MediaRecorder error"
        }
    }

    fun stopRecording(): String? {
        val rec = recorder ?: return null
        return try {
            try {
                rec.stop()
            } catch (e: Throwable) {
                Log.w(TAG, "MediaRecorder stop failed (short recording?): ${e.message}")
            }
            rec.release()
            recorder = null
            Log.d(TAG, "Recording stopped")
            null // success
        } catch (e: Throwable) {
            Log.e(TAG, "Failed to release MediaRecorder: ${e.message}", e)
            recorder = null
            e.message ?: "Failed to stop MediaRecorder"
        }
    }
}
