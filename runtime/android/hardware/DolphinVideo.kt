package io.dolphin.runtime

import android.content.Context
import android.content.Intent
import android.media.MediaPlayer
import android.media.MediaRecorder
import android.net.Uri
import android.os.Build
import android.provider.MediaStore
import android.util.Log

object DolphinVideo {
    private const val TAG = "DolphinVideo"
    private var mediaRecorder: MediaRecorder? = null
    private var mediaPlayer: MediaPlayer? = null
    private var isRecording = false

    /** Open system video recording camera */
    fun openVideoCamera(ctx: Context) {
        try {
            val intent = Intent(MediaStore.ACTION_VIDEO_CAPTURE)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            ctx.startActivity(intent)
        } catch (e: Throwable) {
            Log.e(TAG, "openVideoCamera failed", e)
        }
    }

    /** Start video recording to file path */
    fun startRecording(ctx: Context, outputPath: String, frontCamera: Boolean = false) {
        if (isRecording) {
            Log.w(TAG, "Already recording")
            return
        }
        try {
            mediaRecorder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                MediaRecorder(ctx)
            } else {
                @Suppress("DEPRECATION")
                MediaRecorder()
            }
            mediaRecorder?.apply {
                setVideoSource(MediaRecorder.VideoSource.CAMERA)
                setAudioSource(MediaRecorder.AudioSource.MIC)
                setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
                setVideoEncoder(MediaRecorder.VideoEncoder.H264)
                setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
                setVideoEncodingBitRate(1_000_000)
                setVideoFrameRate(30)
                setVideoSize(1280, 720)
                setOutputFile(outputPath)
                prepare()
                start()
            }
            isRecording = true
            Log.d(TAG, "Video recording started → $outputPath")
        } catch (e: Throwable) {
            Log.e(TAG, "startRecording failed", e)
            mediaRecorder?.release()
            mediaRecorder = null
        }
    }

    /** Stop video recording */
    fun stopRecording(): String {
        return try {
            mediaRecorder?.apply {
                stop()
                release()
            }
            mediaRecorder = null
            isRecording = false
            Log.d(TAG, "Video recording stopped")
            "ok"
        } catch (e: Throwable) {
            Log.e(TAG, "stopRecording failed", e)
            mediaRecorder = null
            isRecording = false
            "error: ${e.message}"
        }
    }

    /** Play a video file or URL (uses external player) */
    fun playVideo(ctx: Context, uriString: String) {
        try {
            val uri = Uri.parse(uriString)
            val intent = Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(uri, "video/*")
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_GRANT_READ_URI_PERMISSION
            }
            ctx.startActivity(intent)
        } catch (e: Throwable) {
            Log.e(TAG, "playVideo failed", e)
        }
    }

    /** Play video inline using MediaPlayer (no UI — use with SurfaceView) */
    fun playInline(urlOrPath: String, onReady: (MediaPlayer) -> Unit) {
        try {
            stopInline()
            mediaPlayer = MediaPlayer().apply {
                setDataSource(urlOrPath)
                prepareAsync()
                setOnPreparedListener { mp ->
                    mp.start()
                    onReady(mp)
                }
            }
        } catch (e: Throwable) {
            Log.e(TAG, "playInline failed", e)
        }
    }

    /** Stop inline playback */
    fun stopInline() {
        try {
            mediaPlayer?.let {
                if (it.isPlaying) it.stop()
                it.release()
            }
            mediaPlayer = null
        } catch (e: Throwable) {
            Log.e(TAG, "stopInline failed", e)
        }
    }

    /** Get all videos from device gallery */
    fun getGalleryVideos(ctx: Context, limit: Int = 50): List<Map<String, String>> {
        val videos = mutableListOf<Map<String, String>>()
        try {
            val cursor = ctx.contentResolver.query(
                MediaStore.Video.Media.EXTERNAL_CONTENT_URI,
                arrayOf(
                    MediaStore.Video.Media._ID,
                    MediaStore.Video.Media.DISPLAY_NAME,
                    MediaStore.Video.Media.SIZE,
                    MediaStore.Video.Media.DURATION,
                    MediaStore.Video.Media.DATA
                ),
                null, null,
                "${MediaStore.Video.Media.DATE_ADDED} DESC LIMIT $limit"
            )
            cursor?.use {
                while (it.moveToNext()) {
                    videos.add(mapOf(
                        "id"       to (it.getString(0) ?: ""),
                        "name"     to (it.getString(1) ?: ""),
                        "size"     to (it.getString(2) ?: "0"),
                        "duration" to (it.getString(3) ?: "0"),
                        "path"     to (it.getString(4) ?: "")
                    ))
                }
            }
        } catch (e: Throwable) {
            Log.e(TAG, "getGalleryVideos failed", e)
        }
        return videos
    }

    fun isRecording() = isRecording
}
