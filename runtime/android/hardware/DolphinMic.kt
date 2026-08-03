package io.dolphin.runtime.hardware

import android.media.MediaRecorder
import android.util.Log

object DolphinMic {
    private var recorder: MediaRecorder? = null
    private const val TAG = "DolphinMic"

    fun startRecording(outputPath: String): String? {
        try {
            stopRecording() // Clean up any existing recording first
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
            return e.message ?: "Unknown MediaRecorder error"
        }
    }

    fun stopRecording(): String? {
        try {
            recorder?.apply {
                stop()
                release()
            }
            recorder = null
            Log.d(TAG, "Recording stopped")
            return null // success
        } catch (e: Throwable) {
            Log.e(TAG, "Failed to stop recording: ${e.message}", e)
            return e.message ?: "Failed to stop MediaRecorder"
        }
    }
}
