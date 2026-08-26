package io.dolphin.runtime

import android.media.MediaCodec
import android.media.MediaFormat
import android.util.Log
import android.view.Surface
import java.nio.ByteBuffer
import java.util.concurrent.Executors
import kotlin.experimental.and

/**
 * 🚀 TitanVideoDecoder (Hardware Accelerated GPU Rendering)
 * Decodes raw RTSP/RTP H.264 streams directly to a Surface using MediaCodec.
 */
class TitanVideoDecoder(private val surface: Surface) {
    private val TAG = "TitanVideoDecoder"
    private var decoder: MediaCodec? = null
    private var isConfigured = false
    private val executor = Executors.newSingleThreadExecutor()

    // Stream buffering for Interleaved RTSP ($ + channel + len + RTP)
    private var tcpBuffer = ByteArray(1024 * 512)
    private var bufferLength = 0

    // FU-A Reassembly
    private var fuBuffer = ByteArray(1024 * 512)
    private var fuLength = 0

    private val startCode = byteArrayOf(0x00, 0x00, 0x00, 0x01)

    init {
        try {
            decoder = MediaCodec.createDecoderByType(MediaFormat.MIMETYPE_VIDEO_AVC)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to create MediaCodec: ${e.message}")
        }
    }

    /**
     * Called when a raw TCP packet (RTSP payload) arrives from TitanTcpClient.
     */
    fun onRawDataReceived(data: ByteArray) {
        executor.execute {
            feedDecoder(data)
        }
    }

    private fun feedDecoder(nalData: ByteArray) {
        if (nalData.isEmpty()) return

        if (!isConfigured) {
            val format = MediaFormat.createVideoFormat(MediaFormat.MIMETYPE_VIDEO_AVC, 1280, 720)
            
            // Standard H.264 Baseline SPS (Sequence Parameter Set) & PPS (Picture Parameter Set)
            val sps = byteArrayOf(
                0x00, 0x00, 0x00, 0x01, 0x67, 0x42, 0x00, 0x1f.toByte(),
                0xe9.toByte(), 0x01, 0x40, 0x7b.toByte(), 0x20
            )
            val pps = byteArrayOf(
                0x00, 0x00, 0x00, 0x01, 0x68, 0xce.toByte(), 0x38, 0x80.toByte()
            )
            format.setByteBuffer("csd-0", ByteBuffer.wrap(sps))
            format.setByteBuffer("csd-1", ByteBuffer.wrap(pps))

            try {
                decoder?.configure(format, surface, null, 0)
                decoder?.start()
                isConfigured = true
                Log.i(TAG, "MediaCodec configured and started with baseline SPS/PPS.")
            } catch (e: Exception) {
                Log.e(TAG, "Decoder config failed: ${e.message}")
            }
        }

        try {
            // Check if nalData already starts with Annex-B start code (0x00, 0x00, 0x00, 0x01 or 0x00, 0x00, 0x01)
            val hasStartCode = (nalData.size >= 4 && nalData[0] == 0.toByte() && nalData[1] == 0.toByte() && nalData[2] == 0.toByte() && nalData[3] == 1.toByte()) ||
                               (nalData.size >= 3 && nalData[0] == 0.toByte() && nalData[1] == 0.toByte() && nalData[2] == 1.toByte())

            val finalBytes = if (hasStartCode) {
                nalData
            } else {
                val buf = ByteArray(4 + nalData.size)
                buf[0] = 0; buf[1] = 0; buf[2] = 0; buf[3] = 1
                System.arraycopy(nalData, 0, buf, 4, nalData.size)
                buf
            }

            val inputBufIdx = decoder?.dequeueInputBuffer(10000) ?: -1
            if (inputBufIdx >= 0) {
                val inputBuf = decoder?.getInputBuffer(inputBufIdx)
                inputBuf?.clear()
                inputBuf?.put(finalBytes)
                decoder?.queueInputBuffer(inputBufIdx, 0, finalBytes.size, System.currentTimeMillis() * 1000, 0)
            }

            var outputBufInfo = MediaCodec.BufferInfo()
            var outputBufIdx = decoder?.dequeueOutputBuffer(outputBufInfo, 0) ?: -1
            while (outputBufIdx >= 0) {
                decoder?.releaseOutputBuffer(outputBufIdx, true) // true = render to surface
                outputBufIdx = decoder?.dequeueOutputBuffer(outputBufInfo, 0) ?: -1
            }
        } catch (e: Exception) {
            Log.e(TAG, "Decoder feed error: ${e.message}")
        }
    }

    fun release() {
        executor.execute {
            try {
                decoder?.stop()
                decoder?.release()
                decoder = null
                isConfigured = false
            } catch (e: Exception) {
                Log.e(TAG, "Decoder release error: ${e.message}")
            }
        }
        executor.shutdown()
    }
}
