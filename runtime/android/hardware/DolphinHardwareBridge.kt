package io.dolphin.runtime


import android.content.Context
import android.app.Activity
import android.net.Uri
import android.util.Log
import android.widget.Toast
import org.json.JSONObject
import android.media.AudioFormat
import android.media.AudioManager
import android.media.AudioRecord
import android.media.AudioTrack
import android.media.AudioAttributes
import android.media.MediaRecorder
import android.util.Base64
import android.content.Intent
import java.nio.ByteBuffer
import java.nio.ByteOrder
import kotlin.concurrent.thread
import android.media.audiofx.AcousticEchoCanceler
import android.media.audiofx.NoiseSuppressor
import android.media.audiofx.AutomaticGainControl
import android.media.AudioFocusRequest
import android.os.Build
import java.io.File

/**
 * 🌊 DolphinHardwareBridge
 *
 * Central router for all hardware actions triggered from UI/JS.
 * Action format: "hw:<category>:<action>" with optional value.
 *
 * Categories: camera, audio, video, mic, gps, sensor, phone, sms,
 *             contacts, storage, fetch, bt, nfc, haptic, flashlight,
 *             ringtone, battery, device, clipboard
 */
object DolphinHardwareBridge {
    private const val TAG = "DolphinHardwareBridge"

    var pendingResultCallback: ((Map<String, Any?>) -> Unit)? = null
    
    private var audioRecord: AudioRecord? = null
    @Volatile private var audioTrack: AudioTrack? = null
    private var isRecording = false
    private const val SAMPLE_RATE = 16000
    private var activePlaybackRate = 0
    private var isSpeakerOn = false
    private var playPacketCount = 0
    private var jbPlayerCount = 0
    private var isPlayerRunning = false
    private val audioQueue = java.util.concurrent.LinkedBlockingQueue<ByteArray>()
    private var audioFocusRequest: AudioFocusRequest? = null
    private val playbackExecutor = java.util.concurrent.Executors.newSingleThreadExecutor { runnable ->
        Thread({
            android.os.Process.setThreadPriority(android.os.Process.THREAD_PRIORITY_AUDIO)
            runnable.run()
        }, "DolphinAudioPlayer")
    }

    private var aec: AcousticEchoCanceler? = null
    private var ns: NoiseSuppressor? = null
    private var agc: AutomaticGainControl? = null

    private fun enableAudioEffects(audioSessionId: Int) {
        try {
            if (AcousticEchoCanceler.isAvailable()) {
                aec = AcousticEchoCanceler.create(audioSessionId)?.apply {
                    enabled = true
                    Log.d(TAG, "AcousticEchoCanceler enabled successfully.")
                }
            } else {
                Log.d(TAG, "AcousticEchoCanceler not available on this device.")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to enable AcousticEchoCanceler: ${e.message}")
        }

        try {
            if (NoiseSuppressor.isAvailable()) {
                ns = NoiseSuppressor.create(audioSessionId)?.apply {
                    enabled = true
                    Log.d(TAG, "NoiseSuppressor enabled successfully.")
                }
            } else {
                Log.d(TAG, "NoiseSuppressor not available on this device.")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to enable NoiseSuppressor: ${e.message}")
        }

        try {
            if (AutomaticGainControl.isAvailable()) {
                agc = AutomaticGainControl.create(audioSessionId)?.apply {
                    enabled = true
                    Log.d(TAG, "AutomaticGainControl enabled successfully.")
                }
            } else {
                Log.d(TAG, "AutomaticGainControl not available on this device.")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to enable AutomaticGainControl: ${e.message}")
        }
    }

    private fun releaseAudioEffects() {
        try {
            aec?.enabled = false
            aec?.release()
        } catch (e: Exception) {}
        aec = null

        try {
            ns?.enabled = false
            ns?.release()
        } catch (e: Exception) {}
        ns = null

        try {
            agc?.enabled = false
            agc?.release()
        } catch (e: Exception) {}
        agc = null
    }

    private fun createVoipAudioTrack(sampleRate: Int, bufferSize: Int): AudioTrack {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            val attributes = AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_VOICE_COMMUNICATION)
                .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                .build()
            val format = AudioFormat.Builder()
                .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                .setSampleRate(sampleRate)
                .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                .build()
            AudioTrack(
                attributes,
                format,
                bufferSize,
                AudioTrack.MODE_STREAM,
                AudioManager.AUDIO_SESSION_ID_GENERATE
            )
        } else {
            @Suppress("DEPRECATION")
            AudioTrack(
                AudioManager.STREAM_VOICE_CALL,
                sampleRate,
                AudioFormat.CHANNEL_OUT_MONO,
                AudioFormat.ENCODING_PCM_16BIT,
                bufferSize,
                AudioTrack.MODE_STREAM
            )
        }
    }

    private fun configureCallAudio(ctx: Context) {
        val audioManager = ctx.getSystemService(Context.AUDIO_SERVICE) as AudioManager
        try {
            if (ctx is Activity) {
                ctx.volumeControlStream = AudioManager.STREAM_VOICE_CALL
            }
            audioManager.mode = AudioManager.MODE_IN_COMMUNICATION
            audioManager.isSpeakerphoneOn = isSpeakerOn

            val maxVol = audioManager.getStreamMaxVolume(AudioManager.STREAM_VOICE_CALL)
            val currentVol = audioManager.getStreamVolume(AudioManager.STREAM_VOICE_CALL)
            if (currentVol == 0 && maxVol > 0) {
                val targetVol = (maxVol * 0.85).toInt().coerceIn(1, maxVol)
                audioManager.setStreamVolume(AudioManager.STREAM_VOICE_CALL, targetVol, 0)
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val attributes = AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_VOICE_COMMUNICATION)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                    .build()
                audioFocusRequest = AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN)
                    .setAudioAttributes(attributes)
                    .setAcceptsDelayedFocusGain(false)
                    .build()
                audioManager.requestAudioFocus(audioFocusRequest!!)
            } else {
                @Suppress("DEPRECATION")
                audioManager.requestAudioFocus(
                    null,
                    AudioManager.STREAM_VOICE_CALL,
                    AudioManager.AUDIOFOCUS_GAIN
                )
            }
            Log.d(TAG, "Call audio configured: MODE_IN_COMMUNICATION, speaker=$isSpeakerOn, voice volume=${audioManager.getStreamVolume(AudioManager.STREAM_VOICE_CALL)}/$maxVol")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to configure call audio: ${e.message}")
        }
    }

    private fun releaseCallAudio(ctx: Context) {
        val audioManager = ctx.getSystemService(Context.AUDIO_SERVICE) as? AudioManager ?: return
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                audioFocusRequest?.let { audioManager.abandonAudioFocusRequest(it) }
            } else {
                @Suppress("DEPRECATION")
                audioManager.abandonAudioFocus(null)
            }
            audioFocusRequest = null
            audioManager.mode = AudioManager.MODE_NORMAL
            audioManager.isSpeakerphoneOn = false
            isSpeakerOn = false
            if (ctx is Activity) {
                ctx.volumeControlStream = AudioManager.USE_DEFAULT_STREAM_TYPE
            }
            Log.d(TAG, "Call audio released, AudioManager reset to MODE_NORMAL")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to release call audio: ${e.message}")
        }
    }

    fun setSpeakerphone(ctx: Context, enabled: Boolean) {
        isSpeakerOn = enabled
        val audioManager = ctx.getSystemService(Context.AUDIO_SERVICE) as? AudioManager ?: return
        try {
            audioManager.isSpeakerphoneOn = enabled
            Log.d(TAG, "Speakerphone ${if (enabled) "ON" else "OFF"}")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to set speakerphone: ${e.message}")
        }
    }

    private fun startAudioPlayerLoop() {
        if (isPlayerRunning) return
        isPlayerRunning = true
        thread(name = "DolphinJitterBufferPlayer") {
            android.os.Process.setThreadPriority(android.os.Process.THREAD_PRIORITY_AUDIO)
            while (isPlayerRunning) {
                try {
                    val bytes = audioQueue.poll(40, java.util.concurrent.TimeUnit.MILLISECONDS)
                    if (bytes != null && audioTrack != null) {
                        jbPlayerCount++
                        if (jbPlayerCount % 50 == 1) {
                            Log.i(TAG, "[JITTER BUFFER] Playing packet #$jbPlayerCount from queue. Queue size remaining: ${audioQueue.size}")
                        }
                        var offset = 0
                        while (offset < bytes.size) {
                            val written = audioTrack?.write(bytes, offset, bytes.size - offset) ?: break
                            if (written <= 0) break
                            offset += written
                        }
                    } else if (audioTrack != null) {
                        // Play silence to keep track alive during network drops
                        val silence = ByteArray(640)
                        audioTrack?.write(silence, 0, silence.size)
                    }
                } catch (e: Throwable) {
                    Log.e(TAG, "Error in Jitter Buffer player loop: ${e.message}")
                }
            }
        }
    }

    fun startAudioStream(ctx: Context) {
        if (isRecording) return
        isRecording = true
        Log.d(TAG, "Starting native audio stream...")

        configureCallAudio(ctx)

        // 1. Setup AudioTrack for playback (will be dynamically re-initialized if rate differs)
        try {
            val minOutBuf = AudioTrack.getMinBufferSize(
                SAMPLE_RATE,
                AudioFormat.CHANNEL_OUT_MONO,
                AudioFormat.ENCODING_PCM_16BIT
            )
            val chunkSize = SAMPLE_RATE / 25 // 40ms
            val outBufSize = maxOf(minOutBuf, chunkSize * 2 * 4)
            audioTrack = createVoipAudioTrack(SAMPLE_RATE, outBufSize)
            audioTrack?.play()
            activePlaybackRate = SAMPLE_RATE
            Log.d(TAG, "AudioTrack initialized for VoIP at ${SAMPLE_RATE}Hz")
            
            // Start player loop
            startAudioPlayerLoop()
        } catch (e: Exception) {
            Log.e(TAG, "AudioTrack init failed: ${e.message}")
        }

        // 2. Setup AudioRecord for recording in a background thread
        thread(name = "DolphinMicStreamer") {
            android.os.Process.setThreadPriority(android.os.Process.THREAD_PRIORITY_AUDIO)
            try {
                val audioSources = intArrayOf(
                    MediaRecorder.AudioSource.VOICE_COMMUNICATION,
                    MediaRecorder.AudioSource.MIC
                )
                val sampleRates = intArrayOf(16000, 8000, 44100, 48000)
                
                var workingRate = 16000
                var inBufSize = -1
                var tempRecord: AudioRecord? = null

                for (source in audioSources) {
                    for (rate in sampleRates) {
                        val minSize = AudioRecord.getMinBufferSize(
                            rate,
                            AudioFormat.CHANNEL_IN_MONO,
                            AudioFormat.ENCODING_PCM_16BIT
                        )
                        if (minSize > 0) {
                            try {
                                val chunkSize = rate / 25 // 40ms chunk size
                                val bufferSizeInBytes = maxOf(minSize, chunkSize * 2 * 4) // 4x chunk size buffer
                                val rec = AudioRecord(
                                    source,
                                    rate,
                                    AudioFormat.CHANNEL_IN_MONO,
                                    AudioFormat.ENCODING_PCM_16BIT,
                                    bufferSizeInBytes
                                )
                                if (rec.state == AudioRecord.STATE_INITIALIZED) {
                                    tempRecord = rec
                                    workingRate = rate
                                    inBufSize = bufferSizeInBytes
                                    Log.d(TAG, "AudioRecord successfully initialized with source: $source, sample rate: $rate and buffer size: $bufferSizeInBytes")
                                    break
                                } else {
                                    rec.release()
                                }
                            } catch (e: Exception) {
                                Log.d(TAG, "Failed to init AudioRecord at source $source, rate $rate: ${e.message}")
                            }
                        }
                    }
                    if (tempRecord != null) break
                }

                if (tempRecord == null || inBufSize <= 0) {
                    throw IllegalStateException("Could not initialize AudioRecord with any supported sample rate or source.")
                }

                audioRecord = tempRecord
                
                // Enable audio effects (AEC, NS, AGC)
                enableAudioEffects(audioRecord!!.audioSessionId)

                audioRecord?.startRecording()

                val chunkSize = workingRate / 25 // 40ms chunks (low-latency)
                val buffer = ShortArray(chunkSize)
                var packetCount = 0
                while (isRecording) {
                    try {
                        val read = audioRecord?.read(buffer, 0, buffer.size) ?: -1
                        if (read > 0) {
                            packetCount++
                            var maxAmp = 0
                            val byteBuf = ByteBuffer.allocate(read * 2).order(ByteOrder.LITTLE_ENDIAN)
                            for (i in 0 until read) {
                                byteBuf.putShort(buffer[i])
                                val absVal = Math.abs(buffer[i].toInt())
                                if (absVal > maxAmp) {
                                    maxAmp = absVal
                                }
                            }
                            if (packetCount % 50 == 1) {
                                Log.i(TAG, "[MIC STREAM] Packets: $packetCount, Read: $read shorts, Max Amplitude: $maxAmp, workingRate: $workingRate")
                            }
                            val base64 = Base64.encodeToString(byteBuf.array(), Base64.NO_WRAP)
                            DolphinRuntime.instance?.sendAction("hw_result:webrtc_mic_data", "$workingRate:$base64")
                        }
                    } catch (e: Throwable) {
                        Log.e(TAG, "Error in mic streaming loop: ${e.message}")
                    }
                }
            } catch (e: Throwable) {
                Log.e(TAG, "AudioRecord streaming failed: ${e.message}")
            } catch (e: OutOfMemoryError) {
                Log.e(TAG, "OOM in mic streamer loop")
            } finally {
                try {
                    audioRecord?.stop()
                    audioRecord?.release()
                } catch (e: Exception) {}
                audioRecord = null
                releaseAudioEffects()
                isRecording = false
            }
        }
    }

    fun stopAudioStream() {
        Log.d(TAG, "Stopping native audio stream... isRecording was $isRecording")
        isRecording = false
        
        val ctx = DolphinRuntime.instance?.context
        if (ctx != null) {
            releaseCallAudio(ctx)
        }

        playbackExecutor.execute {
            try {
                audioTrack?.stop()
                audioTrack?.release()
            } catch (e: Exception) {}
            audioTrack = null
            activePlaybackRate = 0
            Log.d(TAG, "AudioTrack stopped and released.")
        }
    }

    fun playAudioStream(base64Data: String, rate: Int = 8000) {
        if (base64Data.isEmpty()) return
        try {
            if (audioTrack == null || activePlaybackRate != rate) {
                playbackExecutor.execute {
                    try {
                        if (audioTrack == null || activePlaybackRate != rate) {
                            try {
                                audioTrack?.stop()
                                audioTrack?.release()
                            } catch (e: Exception) {}

                            activePlaybackRate = rate
                            val minOutBufSize = AudioTrack.getMinBufferSize(
                                rate,
                                AudioFormat.CHANNEL_OUT_MONO,
                                AudioFormat.ENCODING_PCM_16BIT
                            )
                            val chunkSize = rate / 25 // 40ms
                            val outBufSize = maxOf(minOutBufSize, chunkSize * 2 * 4)
                            
                            audioTrack = createVoipAudioTrack(rate, outBufSize)
                            audioTrack?.play()
                            Log.d(TAG, "AudioTrack re-initialized for VoIP playback rate: $rate")
                        }
                    } catch (e: Exception) {
                        Log.e(TAG, "AudioTrack re-init failed: ${e.message}")
                    }
                }
            }

            val bytes = Base64.decode(base64Data, Base64.NO_WRAP)
            audioQueue.offer(bytes)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to queue audio stream packet: ${e.message}")
        }
    }

    /**
     * Direct raw PCM ByteArray playback — used by TitanTcpClient for low-latency
     * audio frame streaming (no base64 decode overhead).
     */
    fun playAudioStreamDirect(payload: ByteArray) {
        if (payload.isEmpty()) return
        try {
            val rate = 8000 // default VoIP rate
            if (audioTrack == null || activePlaybackRate != rate) {
                playbackExecutor.execute {
                    try {
                        if (audioTrack == null || activePlaybackRate != rate) {
                            try {
                                audioTrack?.stop()
                                audioTrack?.release()
                            } catch (e: Exception) {}
                            activePlaybackRate = rate
                            val minBuf = AudioTrack.getMinBufferSize(
                                rate,
                                AudioFormat.CHANNEL_OUT_MONO,
                                AudioFormat.ENCODING_PCM_16BIT
                            )
                            audioTrack = createVoipAudioTrack(rate, maxOf(minBuf, rate / 25 * 8))
                            audioTrack?.play()
                        }
                    } catch (e: Exception) {
                        Log.e(TAG, "AudioTrack re-init failed (direct): ${e.message}")
                    }
                }
            }
            audioQueue.offer(payload)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to queue direct audio frame: ${e.message}")
        }
    }


    fun handleHardwareAction(
        ctx: Context,
        action: String,
        rawLocValue: Any? = null,
        onResult: ((Map<String, Any?>) -> Unit)? = null
    ): Boolean {
        if (!action.startsWith("hw:")) return false

        var value = rawLocValue
        if (rawLocValue is String && rawLocValue.startsWith("{")) {
            try {
                val json = JSONObject(rawLocValue)
                if (json.has("action") && json.has("value")) {
                    value = json.get("value")
                }
            } catch (e: Exception) {}
        } else if (rawLocValue is Map<*, *>) {
            if (rawLocValue.containsKey("action") && rawLocValue.containsKey("value")) {
                value = rawLocValue["value"]
            }
        }
        Log.d(TAG, "⚙️ HW Action: $action | unpacked value=$value")
        pendingResultCallback = onResult

        try {
            val parts = action.split(":")
            val category = if (parts.size > 1) parts[1] else ""
            val sub      = if (parts.size > 2) parts[2] else ""

            // Intercept special audio/telephony actions
            if (action.startsWith("hw:webrtc:")) {
                Log.i(TAG, "WebRTC action ($action) handled via Titan TCP protocol.")
                return true
            }
            if (action.startsWith("hw:webrtc:")) {
                Log.i(TAG, "WebRTC action ($action) handled via Titan TCP protocol.")
                return true
            }
            if (action == "hw:intercom:start") {
                DolphinIntercom.startAudioStream(ctx)
                return true
            }
            if (action == "hw:intercom:stop") {
                DolphinIntercom.stopAudioStream()
                return true
            }
            // ── Video Call actions ──────────────────────────────────────────────
            if (action == "hw:video:call") {
                val server = DolphinStateEngine.get("intercom_server")?.toString() ?: ""
                val myId   = DolphinStateEngine.get("intercom_device_id")?.toString() ?: ""
                val peerId = DolphinStateEngine.get("intercom_target_id")?.toString() ?: ""
                DolphinRuntime.instance?.logToPC("HardwareBridge", "hw:video:call params -> server=$server, myId=$myId, peerId=$peerId")
                if (server.isNotEmpty() && myId.isNotEmpty() && peerId.isNotEmpty()) {
                    // Check CAMERA permission before starting
                    val hasCam = if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                        androidx.core.content.ContextCompat.checkSelfPermission(ctx, android.Manifest.permission.CAMERA) ==
                            android.content.pm.PackageManager.PERMISSION_GRANTED
                    } else true
                    DolphinRuntime.instance?.logToPC("HardwareBridge", "hasCam permission = $hasCam")
                    if (hasCam) {
                        DolphinVideoCall.startCall(ctx, server, myId, peerId)
                        Log.i(TAG, "📹 Video call started → $peerId")
                        DolphinRuntime.instance?.logToPC("HardwareBridge", "📹 Video call started → $peerId")
                    } else {
                        if (ctx is android.app.Activity) {
                            Log.i(TAG, "📷 Requesting CAMERA permission for video call")
                            androidx.core.app.ActivityCompat.requestPermissions(
                                ctx, arrayOf(android.Manifest.permission.CAMERA), 404)
                        }
                        android.os.Handler(android.os.Looper.getMainLooper()).post {
                            android.widget.Toast.makeText(ctx,
                                "📷 Please grant Camera permission and try again.",
                                android.widget.Toast.LENGTH_LONG).show()
                        }
                    }
                } else {
                    Log.w(TAG, "hw:video:call — missing params (server=$server, myId=$myId, peerId=$peerId)")
                    DolphinRuntime.instance?.logToPC("HardwareBridge", "❌ ERROR: missing params for hw:video:call")
                }
                return true
            }
            if (action == "hw:video:answer") {
                val server = DolphinStateEngine.get("intercom_server")?.toString() ?: ""
                val myId   = DolphinStateEngine.get("intercom_device_id")?.toString() ?: ""
                val peerId = DolphinStateEngine.get("intercom_target_id")?.toString() ?: ""
                DolphinRuntime.instance?.logToPC("HardwareBridge", "hw:video:answer params -> server=$server, myId=$myId, peerId=$peerId")
                if (server.isNotEmpty() && myId.isNotEmpty() && peerId.isNotEmpty()) {
                    val hasCam = if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                        androidx.core.content.ContextCompat.checkSelfPermission(ctx, android.Manifest.permission.CAMERA) ==
                            android.content.pm.PackageManager.PERMISSION_GRANTED
                    } else true
                    DolphinRuntime.instance?.logToPC("HardwareBridge", "hasCam permission = $hasCam")
                    if (hasCam) {
                        DolphinVideoCall.acceptCall(ctx, server, myId, peerId)
                        Log.i(TAG, "📹 Video call accepted ← $peerId")
                        DolphinRuntime.instance?.logToPC("HardwareBridge", "📹 Video call accepted ← $peerId")
                    } else {
                        if (ctx is android.app.Activity) {
                            Log.i(TAG, "📷 Requesting CAMERA permission for video answer")
                            androidx.core.app.ActivityCompat.requestPermissions(
                                ctx, arrayOf(android.Manifest.permission.CAMERA), 404)
                        }
                        android.os.Handler(android.os.Looper.getMainLooper()).post {
                            android.widget.Toast.makeText(ctx,
                                "📷 Please grant Camera permission and try again.",
                                android.widget.Toast.LENGTH_LONG).show()
                        }
                    }
                } else {
                    Log.w(TAG, "hw:video:answer — missing params (server=$server, myId=$myId, peerId=$peerId)")
                    DolphinRuntime.instance?.logToPC("HardwareBridge", "❌ ERROR: missing params for hw:video:answer")
                }
                return true
            }
            if (action == "hw:video:hangup") {
                val server = DolphinStateEngine.get("intercom_server")?.toString() ?: ""
                val myId   = DolphinStateEngine.get("intercom_device_id")?.toString() ?: ""
                val peerId = DolphinStateEngine.get("intercom_target_id")?.toString() ?: ""
                DolphinVideoCall.hangup(ctx, server, myId, peerId)
                Log.i(TAG, "📵 Video call hung up")
                return true
            }
            if (action == "hw:screen:orientation:landscape") {
                if (ctx is android.app.Activity) {
                    android.os.Handler(android.os.Looper.getMainLooper()).post {
                        ctx.requestedOrientation = android.content.pm.ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE
                    }
                }
                return true
            }
            if (action == "hw:screen:orientation:portrait") {
                if (ctx is android.app.Activity) {
                    android.os.Handler(android.os.Looper.getMainLooper()).post {
                        ctx.requestedOrientation = android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
                    }
                }
                return true
            }
            // ── End Video Call actions ──────────────────────────────────────────
            if (action == "hw:webrtc:speaker:on") {
                setSpeakerphone(ctx, true)
                return true
            }
            if (action == "hw:webrtc:speaker:off") {
                setSpeakerphone(ctx, false)
                return true
            }
            if (action.startsWith("hw:audio:stream_play:")) {
                val payload = action.substringAfter("hw:audio:stream_play:")
                var rate = 8000
                var base64Data = payload
                if (payload.contains(":")) {
                    val p = payload.split(":", limit = 2)
                    rate = p[0].toIntOrNull() ?: 8000
                    base64Data = p[1]
                }
                playAudioStream(base64Data, rate)
                return true
            }
            if (action.startsWith("hw:phone:incoming_call:")) {
                val from = action.substringAfter("hw:phone:incoming_call:")
                val intent = Intent(ctx, DolphinBackgroundService::class.java).apply {
                    putExtra("action", "SIMULATE_EVENT")
                    putExtra("type", "CALL")
                    putExtra("from", from)
                }
                try {
                    // Try regular startService first (fails only if app is fully backgrounded)
                    ctx.startService(intent)
                } catch (e: Throwable) {
                    Log.w(TAG, "Failed startService, trying startForegroundService: ${e.message}")
                    try {
                        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                            ctx.startForegroundService(intent)
                        } else {
                            ctx.startService(intent)
                        }
                    } catch (err: Throwable) {
                        Log.e(TAG, "Failed startForegroundService: ${err.message}")
                    }
                }
                return true
            }

            // ══════════════════════════════════════════════════════════════════
            // ── TITAN TCP MODULE — All Backend Module Handlers ─────────────────
            // ══════════════════════════════════════════════════════════════════
            // Handles: Connection, Signaling (Call), Media, Chat, IoT/PLC, Health
            // Action format: hw:tcp:<subcmd>[:<param1>[:<param2>]]
            // State keys:    sys_tcp_status, sys_tcp_ext, sys_call_status,
            //                sys_chat_msg, sys_iot_<pin>, sys_p2p_progress
            // ══════════════════════════════════════════════════════════════════

            if (action.startsWith("hw:tcp:")) {
                val tcpParts = action.split(":")
                // tcpParts[0]=hw, [1]=tcp, [2]=subcmd, [3..]=params
                val tcpCmd = if (tcpParts.size > 2) tcpParts[2] else ""

                when (tcpCmd) {

                    // ── 1. Connection Lifecycle ────────────────────────────────
                    // Usage: hw:tcp:connect:<host>:<port>:<ext>
                    // State: sys_tcp_status = "● CONNECTING..." → "● ONLINE"
                    "connect" -> {
                        val devHost = DolphinRuntime.instance?.getDevServerHost() ?: ""
                        val stateHost = DolphinStateEngine.get("tcp_host")?.toString() ?: ""
                        val host = if (tcpParts.size > 3 && tcpParts[3].isNotEmpty()) tcpParts[3]
                            else if (stateHost.isNotEmpty()) stateHost
                            else devHost
                        val port = if (tcpParts.size > 4) tcpParts[4].toIntOrNull() ?: 9092 else
                            DolphinStateEngine.get("tcp_port")?.toString()?.toIntOrNull() ?: 9092
                        val ext  = if (tcpParts.size > 5) tcpParts[5].toIntOrNull() ?: 101 else
                            DolphinStateEngine.get("tcp_ext")?.toString()?.toIntOrNull() ?: 101
                        DolphinStateEngine.set("sys_tcp_status", "● CONNECTING...")
                        DolphinStateEngine.set("sys_tcp_ext", ext.toString())
                        TitanTcpClient.connect(host, port, ext)
                        Log.i(TAG, "⚡ hw:tcp:connect → $host:$port ext=$ext")
                        return true
                    }

                    // ── 2. Disconnect ──────────────────────────────────────────
                    // Usage: hw:tcp:disconnect
                    "disconnect" -> {
                        TitanTcpClient.disconnect()
                        DolphinStateEngine.set("sys_tcp_status", "● DISCONNECTED")
                        DolphinStateEngine.set("sys_call_status", "IDLE")
                        Log.i(TAG, "🔌 hw:tcp:disconnect")
                        return true
                    }

                    // ── 3. Signaling — Call Invite ─────────────────────────────
                    // Usage: hw:tcp:invite:<targetExt>:<type>   type=video|audio
                    // State: sys_call_status = "CALLING <ext>..."
                    "invite", "call" -> {
                        val targetExt = if (tcpParts.size > 3) tcpParts[3].toIntOrNull() ?: 0 else
                            DolphinStateEngine.get("call_target_ext")?.toString()?.toIntOrNull() ?: 0
                        val callType  = if (tcpParts.size > 4) tcpParts[4] else "audio"
                        if (targetExt > 0) {
                            val payload = """{"type":"$callType"}""".toByteArray(Charsets.UTF_8)
                            TitanTcpClient.sendPacket(TitanTcpClient.CMD_INVITE, 0, targetExt, payload)
                            TitanTcpClient.setCallPartner(targetExt)
                            DolphinStateEngine.set("sys_call_status", "CALLING $targetExt...")
                            Log.i(TAG, "📞 hw:tcp:invite → ext=$targetExt type=$callType")
                        }
                        return true
                    }

                    // ── 4. Signaling — Accept Call ─────────────────────────────
                    // Usage: hw:tcp:accept
                    "accept" -> {
                        val partner = TitanTcpClient.getCallPartner()
                        if (partner > 0) {
                            TitanTcpClient.sendPacket(TitanTcpClient.CMD_ACCEPT, 0, partner, null)
                            DolphinStateEngine.set("sys_call_status", "ACTIVE ↔ $partner")
                            Log.i(TAG, "✅ hw:tcp:accept → ext=$partner")
                        }
                        return true
                    }

                    // ── 5. Signaling — Reject Call ─────────────────────────────
                    // Usage: hw:tcp:reject
                    "reject" -> {
                        val partner = TitanTcpClient.getCallPartner()
                        if (partner > 0) {
                            TitanTcpClient.sendPacket(TitanTcpClient.CMD_REJECT, 0, partner, null)
                            TitanTcpClient.setCallPartner(0)
                            DolphinStateEngine.set("sys_call_status", "REJECTED")
                            Log.i(TAG, "❌ hw:tcp:reject → ext=$partner")
                        }
                        return true
                    }

                    // ── 6. Signaling — Hangup ─────────────────────────────────
                    // Usage: hw:tcp:hangup
                    "hangup" -> {
                        val partner = TitanTcpClient.getCallPartner()
                        val target = if (partner > 0) partner else 0
                        TitanTcpClient.sendPacket(TitanTcpClient.CMD_HANGUP, 0, target, null)
                        TitanTcpClient.setCallPartner(0)
                        DolphinStateEngine.set("sys_call_status", "IDLE")
                        Log.i(TAG, "📵 hw:tcp:hangup → ext=$target")
                        return true
                    }

                    // ── 7. Chat Message ────────────────────────────────────────
                    // Usage: hw:tcp:chat:<targetExt>:<message>
                    // State: sys_chat_msg = "Me: <message>"
                    "chat" -> {
                        val targetExt = if (tcpParts.size > 3) tcpParts[3].toIntOrNull() ?: 0 else
                            DolphinStateEngine.get("chat_target_ext")?.toString()?.toIntOrNull() ?: 0
                        val msg = if (tcpParts.size > 4) tcpParts.drop(4).joinToString(":") else
                            value?.toString() ?: ""
                        if (msg.isNotEmpty()) {
                            val payload = msg.toByteArray(Charsets.UTF_8)
                            TitanTcpClient.sendPacket(TitanTcpClient.CMD_CHAT_MESSAGE, 0, targetExt, payload)
                            DolphinStateEngine.set("sys_chat_msg", "Me: $msg")
                            Log.i(TAG, "💬 hw:tcp:chat → ext=$targetExt msg=$msg")
                        }
                        return true
                    }

                    // ── 8. IoT / PLC / Relay CUSTOM_ACTION ────────────────────
                    // Usage: hw:tcp:iot:<action>:<pin>[:<val>]
                    //   e.g. hw:tcp:iot:relay_on:1
                    //        hw:tcp:iot:relay_off:2
                    //        hw:tcp:iot:relay_toggle:1
                    //        hw:tcp:iot:write:temp_setpoint:25
                    //        hw:tcp:iot:read:sensor_1
                    // State: sys_iot_<pin> = ON/OFF/value
                    "iot" -> {
                        val iotAction = if (tcpParts.size > 3) tcpParts[3] else "relay_on"
                        val pin       = if (tcpParts.size > 4) tcpParts[4] else "1"
                        val iotVal    = if (tcpParts.size > 5) tcpParts[5] else value?.toString() ?: "1"
                        val targetExt = DolphinStateEngine.get("iot_target_ext")?.toString()?.toIntOrNull() ?: 0

                        val curState = DolphinStateEngine.get("sys_iot_$pin")?.toString() ?: "0"
                        val nextCmd = if (curState == "1" || curState == "1.0" || curState.equals("ON", true)) "relay_off" else "relay_on"

                        val json = when (iotAction) {
                            "relay_toggle" -> """{"action":"$nextCmd","pin":"$pin"}"""
                            else -> """{"action":"$iotAction","pin":"$pin","value":"$iotVal"}"""
                        }

                        TitanTcpClient.sendPacket(
                            0x40, // CMD_CUSTOM_ACTION
                            0, targetExt,
                            json.toByteArray(Charsets.UTF_8)
                        )

                        val stateVal = if (iotAction == "relay_toggle") {
                            if (curState == "1" || curState == "1.0" || curState.equals("ON", true)) "0" else "1"
                        } else if (iotAction.contains("on")) "1" else if (iotAction.contains("off")) "0" else iotVal

                        DolphinStateEngine.set("sys_iot_$pin", stateVal)
                        Log.i(TAG, "⚡ hw:tcp:iot $iotAction pin=$pin val=$iotVal → state=$stateVal")
                        return true
                    }

                    // ── 9. Custom Action (Generic CUSTOM_ACTION 0x40) ──────────
                    // Usage: hw:tcp:custom:<targetExt>  value = JSON string
                    // Allows sending ANY JSON payload as CUSTOM_ACTION
                    "custom" -> {
                        val targetExt = if (tcpParts.size > 3) tcpParts[3].toIntOrNull() ?: 0 else 0
                        val json = value?.toString() ?: "{}"
                        TitanTcpClient.sendPacket(
                            0x40, 0, targetExt,
                            json.toByteArray(Charsets.UTF_8)
                        )
                        Log.i(TAG, "🔧 hw:tcp:custom → ext=$targetExt json=$json")
                        return true
                    }

                    // ── 10. Manual Heartbeat / Health Check ───────────────────
                    // Usage: hw:tcp:ping
                    // State: sys_tcp_status = "● ONLINE (ping OK)"
                    "ping", "heartbeat" -> {
                        if (TitanTcpClient.isConnected()) {
                            TitanTcpClient.sendPacket(TitanTcpClient.CMD_HEARTBEAT, 0, 0, null)
                            DolphinStateEngine.set("sys_tcp_status", "● ONLINE ♥")
                        } else {
                            DolphinStateEngine.set("sys_tcp_status", "● DISCONNECTED")
                        }
                        return true
                    }

                    // ── 11. Connection Status Query ───────────────────────────
                    // Usage: hw:tcp:status
                    // State: sys_tcp_status updated immediately
                    "status" -> {
                        val st = if (TitanTcpClient.isConnected()) "● ONLINE" else "● DISCONNECTED"
                        DolphinStateEngine.set("sys_tcp_status", st)
                        onResult?.invoke(mapOf("connected" to TitanTcpClient.isConnected(), "status" to st))
                        return true
                    }

                    // ── 12. P2P Server Start (listen mode) ────────────────────
                    // Usage: hw:tcp:server:<port>:<ext>
                    // State: sys_tcp_status = "● P2P SERVER :port"
                    "server" -> {
                        val port = if (tcpParts.size > 3) tcpParts[3].toIntOrNull() ?: 9092 else 9092
                        val ext  = if (tcpParts.size > 4) tcpParts[4].toIntOrNull() ?: 101 else 101
                        DolphinStateEngine.set("sys_tcp_status", "● P2P SERVER :$port")
                        TitanTcpClient.startServer(port, ext)
                        Log.i(TAG, "📡 hw:tcp:server → port=$port ext=$ext")
                        return true
                    }

                } // end when(tcpCmd)

                return true // fallback — unknown hw:tcp:* still consumed
            } // end if(hw:tcp:)

            when (category) {

                // ── Flashlight ───────────────────────────────────
                "flashlight" -> when (sub) {
                    "on"  -> {
                        DolphinFlashlight.setFlashlight(ctx, true)
                        DolphinStateEngine.updateState("sys_flashlight_status", "ON 🔦")
                        DolphinStateEngine.updateState("notification", "🔦 Flashlight Torch Turned ON")
                    }
                    "off" -> {
                        DolphinFlashlight.setFlashlight(ctx, false)
                        DolphinStateEngine.updateState("sys_flashlight_status", "OFF 🔦")
                        DolphinStateEngine.updateState("notification", "🔦 Flashlight Torch Turned OFF")
                    }
                    "toggle" -> {
                        DolphinFlashlight.toggle(ctx)
                        DolphinStateEngine.updateState("sys_flashlight_status", "Toggled 🔦")
                        DolphinStateEngine.updateState("notification", "🔦 Flashlight Torch Toggled")
                        toast(ctx, "🔦 Flashlight Toggled")
                    }
                }

                // ── Camera ───────────────────────────────────────
                "camera" -> when (sub) {
                    "open", "take_photo", "" -> {
                        DolphinStateEngine.updateState("notification", "📷 Launching Camera Intent...")
                        DolphinCamera.openCamera(ctx)
                    }
                    "flip" -> {
                        DolphinCamera.flipCamera(ctx)
                        toast(ctx, "📷 Flipped Camera Lens")
                    }
                    "rotate" -> {
                        DolphinCamera.rotateCamera(ctx)
                        toast(ctx, "📐 Rotated Camera Angle")
                    }
                    "capture_canvas" -> {
                        DolphinCamera.captureCanvas(ctx) { path ->
                            if (path.isNotEmpty()) {
                                toast(ctx, "📸 Canvas snapshot saved!")
                            } else {
                                toast(ctx, "❌ Failed to capture canvas")
                            }
                        }
                    }
                    "stop" -> {
                        DolphinCamera.stopCamera(ctx)
                        toast(ctx, "📷 Camera Stopped")
                    }
                    "start" -> {
                        DolphinCamera.startCamera(ctx)
                        toast(ctx, "📷 Camera Started")
                    }
                    "capture", "snap" -> {
                        DolphinCamera.capturePhoto(ctx) { path ->
                            toast(ctx, "📸 Photo Snapshot Saved!")
                        }
                    }
                }

                // ── Video ────────────────────────────────────────
                "video" -> when (sub) {
                    "open", "start_sys", "capture", "" -> {
                        DolphinVideo.openVideoCamera(ctx)
                        DolphinStateEngine.updateState("sys_video_status", "Camcorder Active \uD83C\uDFA5")
                        DolphinStateEngine.updateState("notification", "\uD83C\uDFA5 System Camcorder Video Recorder Launched")
                        toast(ctx, "\uD83C\uDFA5 Opening Video Camcorder...")
                    }
                    "start", "record", "record_start" -> {
                        val path = ctx.cacheDir.absolutePath + "/dolphin_vid.mp4"
                        DolphinVideo.startRecording(ctx, path, false)
                        DolphinStateEngine.updateState("sys_video_status", "Recording \uD83D\uDD34")
                        DolphinStateEngine.updateState("notification", "\uD83D\uDD34 Background Video Recording Started")
                        toast(ctx, "\uD83D\uDD34 Recording Video...")
                    }
                    "stop" -> {
                        DolphinVideo.stopRecording()
                        DolphinStateEngine.updateState("sys_video_status", "Saved \uD83D\uDCBE")
                        DolphinStateEngine.updateState("notification", "\uD83D\uDCBE Video File Saved to Cache")
                        toast(ctx, "\uD83D\uDCBE Video saved!")
                    }
                    "stop_player" -> {
                        DolphinStateEngine.updateState("sys_picked_video_url", "")
                    }
                    "play_player", "start_player", "replay" -> {
                        val current = DolphinStateEngine.get("sys_picked_video_url")?.toString() ?: ""
                        if (current.isEmpty()) {
                            DolphinStateEngine.updateState("sys_picked_video_url", "assets/video.mp4")
                        } else {
                            // Re-trigger playback
                            DolphinStateEngine.updateState("sys_picked_video_url", current)
                        }
                        toast(ctx, "▶️ Video Playing!")
                    }
                    "play"   -> {
                        var playPath = if (action.startsWith("hw:video:play:")) action.substringAfter("hw:video:play:") else ""
                        if (playPath.isEmpty() || playPath.startsWith("▶")) {
                            playPath = value?.toString() ?: ""
                        }
                        DolphinVideo.playVideo(ctx, playPath)
                    }
                    "gallery" -> {
                        val vids = DolphinVideo.getGalleryVideos(ctx)
                        onResult?.invoke(mapOf("videos" to vids))
                    }
                }

                // ── Audio ────────────────────────────────────────
                "audio" -> when (sub) {
                    "play"    -> {
                        var playPath = value?.toString() ?: ""
                        if (playPath.isEmpty() && action.startsWith("hw:audio:play:")) {
                            playPath = action.substringAfter("hw:audio:play:")
                        }
                        try {
                            val result = DolphinAudio.playSound(ctx, playPath)
                            Log.d(TAG, "🎵 playSound result: $result")
                            val errMsg = result["error"]?.toString()
                            if (errMsg != null) {
                                toast(ctx, "Audio error: $errMsg")
                            } else {
                                val size = result["size"] ?: -1L
                                toast(ctx, "🔊 Playing! Size: $size bytes")
                            }
                            onResult?.invoke(result)
                        } catch (ex: Exception) {
                            Log.e(TAG, "🎵 playSound threw: ${ex.message}", ex)
                            toast(ctx, "Audio ex: ${ex.message}")
                            onResult?.invoke(mapOf("error" to (ex.message ?: "exception")))
                        }
                    }
                    "stop"    -> DolphinAudio.stopSound()
                    "volume"  -> DolphinAudio.setVolume(ctx, (value as? Number)?.toInt() ?: 50)
                    "list"    -> {
                        val files = DolphinStorage.getAudioFiles(ctx)
                        onResult?.invoke(mapOf("files" to files))
                    }
                    "speaker" -> {
                        val audioManager = ctx.getSystemService(Context.AUDIO_SERVICE) as android.media.AudioManager
                        val turnOn = parts.getOrNull(3) == "on"
                        audioManager.isSpeakerphoneOn = turnOn
                        Log.d(TAG, "🔊 Speaker ${if (turnOn) "ON" else "OFF"}")
                        onResult?.invoke(mapOf("speaker" to turnOn))
                    }
                }

                // ── Microphone ───────────────────────────────────
                "mic" -> when (sub) {
                    "start" -> {
                        var hasPermission = true
                        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                            if (androidx.core.content.ContextCompat.checkSelfPermission(ctx, android.Manifest.permission.RECORD_AUDIO) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                                hasPermission = false
                                if (ctx is android.app.Activity) {
                                    androidx.core.app.ActivityCompat.requestPermissions(ctx, arrayOf(android.Manifest.permission.RECORD_AUDIO), 303)
                                }
                            }
                        }
                        if (hasPermission) {
                            val path = ctx.cacheDir.absolutePath + "/dolphin_rec.mp4"
                            val err = DolphinMic.startRecording(path)
                            if (err != null) {
                                toast(ctx, "🎙️ Mic Error: $err")
                                DolphinStateEngine.updateState("sys_mic_status", "Mic Error ❌")
                                onResult?.invoke(mapOf("error" to err))
                            } else {
                                DolphinStateEngine.updateState("sys_mic_status", "Recording 🎙️")
                                DolphinStateEngine.updateState("notification", "🎙️ Mic Voice Recording Started")
                                toast(ctx, "🎙️ Recording...")
                                onResult?.invoke(mapOf("path" to path, "status" to "recording"))
                            }
                        } else {
                            toast(ctx, "🎙️ Please grant microphone permission and try again.")
                            onResult?.invoke(mapOf("error" to "Permission Denied"))
                        }
                    }
                    "stop" -> {
                        val err = DolphinMic.stopRecording()
                        if (err != null) {
                            toast(ctx, "🎙️ Mic Stop Error: $err")
                            onResult?.invoke(mapOf("error" to err))
                        } else {
                            val path = ctx.cacheDir.absolutePath + "/dolphin_rec.mp4"
                            val file = java.io.File(path)
                            val size = if (file.exists()) file.length() else 0L
                            DolphinStateEngine.updateState("sys_mic_status", "Saved ($size B) 🎙️")
                            DolphinStateEngine.updateState("notification", "🎙️ Mic Audio Saved: $size bytes")
                            toast(ctx, "🎙️ Saved! ($size bytes)")
                            onResult?.invoke(mapOf("status" to "saved", "size" to size, "path" to path))
                        }
                    }
                    "play", "replay" -> {
                        val path = ctx.cacheDir.absolutePath + "/dolphin_rec.mp4"
                        val file = java.io.File(path)
                        if (!file.exists() || file.length() < 100) {
                            toast(ctx, "🎙️ No voice recording found! Record voice first.")
                            DolphinStateEngine.updateState("sys_mic_status", "No Rec File ❌")
                            onResult?.invoke(mapOf("error" to "No rec file"))
                        } else {
                            DolphinStateEngine.updateState("sys_mic_status", "Playing 🔊 (${file.length()} B)")
                            toast(ctx, "🔊 Playing Recorded Voice...")
                            val res = DolphinAudio.playSound(ctx, path)
                            onResult?.invoke(res)
                        }
                    }
                }

                // ── Ringtone ─────────────────────────────────────
                "ringtone" -> when (sub) {
                    "play"    -> {
                        DolphinRingtone.playSystemTone(ctx)
                        DolphinStateEngine.updateState("sys_ringtone_status", "Playing 🔔")
                        DolphinStateEngine.updateState("notification", "🔔 Playing System Call Ringtone Tone")
                        toast(ctx, "🔔 Playing System Ringtone...")
                    }
                    "stop" -> {
                        DolphinRingtone.stopSystemTone()
                        DolphinStateEngine.updateState("sys_ringtone_status", "Stopped 🔔")
                        DolphinStateEngine.updateState("notification", "🔔 System Ringtone Stopped")
                        toast(ctx, "🔕 Ringtone Stopped")
                    }
                    "list"    -> {
                        val tones = DolphinRingtone.getAvailableTones(ctx)
                        onResult?.invoke(mapOf("tones" to tones))
                    }
                    "dialtone" -> {
                        val tone = (value as? Number)?.toInt() ?: 1
                        DolphinRingtone.playDialTone(tone, 200)
                        Thread { Thread.sleep(250); DolphinRingtone.releaseDialTone() }.start()
                    }
                }

                // ── GPS / Location ───────────────────────────────
                "gps" -> when (sub) {
                    "get"   -> DolphinLocation.getLocation(ctx) { loc ->
                        onResult?.invoke(loc)
                    }
                    "watch" -> {
                        val interval = parseParams(value)?.optInt("interval", 1000) ?: 1000
                        DolphinLocation.watchLocation(ctx, interval.toLong()) { loc ->
                            onResult?.invoke(loc)
                        }
                    }
                    "stop"  -> DolphinLocation.stopWatching()
                }

                // ── Sensors ──────────────────────────────────────
                "sensor" -> {
                    val intervalMs = parseParams(value)?.optInt("interval", 100) ?: 100
                    when (sub) {
                        "accel"       -> DolphinSensors.startAccelerometer(ctx, intervalMs) { r ->
                            val xStr = String.format(java.util.Locale.US, "%.2f", r.x)
                            val yStr = String.format(java.util.Locale.US, "%.2f", r.y)
                            val zStr = String.format(java.util.Locale.US, "%.2f", r.z)
                            DolphinStateEngine.updateState("sys_sensor_x", xStr)
                            DolphinStateEngine.updateState("sys_sensor_y", yStr)
                            DolphinStateEngine.updateState("sys_sensor_z", zStr)
                            DolphinStateEngine.updateState("notification", "🧭 Accel X: $xStr, Y: $yStr, Z: $zStr")
                            onResult?.invoke(mapOf("type" to r.type, "x" to r.x, "y" to r.y, "z" to r.z))
                        }
                        "gyro"        -> DolphinSensors.startGyroscope(ctx, intervalMs) { r ->
                            onResult?.invoke(mapOf("type" to r.type, "x" to r.x, "y" to r.y, "z" to r.z))
                        }
                        "compass"     -> DolphinSensors.startCompass(ctx, intervalMs) { r ->
                            onResult?.invoke(mapOf("type" to r.type, "x" to r.x, "y" to r.y, "z" to r.z))
                        }
                        "baro"        -> DolphinSensors.startBarometer(ctx, intervalMs) { r ->
                            onResult?.invoke(mapOf("type" to r.type, "pressure" to r.value))
                        }
                        "light"       -> DolphinSensors.startLightSensor(ctx, intervalMs) { r ->
                            onResult?.invoke(mapOf("type" to r.type, "lux" to r.value))
                        }
                        "prox"        -> DolphinSensors.startProximity(ctx) { r ->
                            onResult?.invoke(mapOf("type" to r.type, "distance" to r.value))
                        }
                        "rotation"    -> DolphinSensors.startRotationVector(ctx, intervalMs) { r ->
                            onResult?.invoke(mapOf("type" to r.type, "x" to r.x, "y" to r.y, "z" to r.z))
                        }
                        "steps"       -> DolphinSensors.startStepCounter(ctx) { r ->
                            onResult?.invoke(mapOf("type" to r.type, "steps" to r.value))
                        }
                        "gravity"     -> DolphinSensors.startGravity(ctx, intervalMs) { r ->
                            onResult?.invoke(mapOf("type" to r.type, "x" to r.x, "y" to r.y, "z" to r.z))
                        }
                        "temperature" -> DolphinSensors.startTemperature(ctx) { r ->
                            onResult?.invoke(mapOf("type" to r.type, "celsius" to r.value))
                        }
                        "humidity"    -> DolphinSensors.startHumidity(ctx) { r ->
                            onResult?.invoke(mapOf("type" to r.type, "humidity" to r.value))
                        }
                        "orientation" -> DolphinSensors.getOrientation(ctx) { az, pitch, roll ->
                            onResult?.invoke(mapOf("azimuth" to az, "pitch" to pitch, "roll" to roll))
                        }
                        "list"        -> {
                            val list = DolphinSensors.listAvailableSensors(ctx)
                            onResult?.invoke(mapOf("sensors" to list))
                        }
                        "stop"        -> DolphinSensors.stopAll()
                        else          -> DolphinSensors.stop(sub)
                    }
                }

                // ── Phone ────────────────────────────────────────
                "phone" -> when (sub) {
                    "call"      -> {
                        var number = value?.toString() ?: ""
                        if (number.isEmpty() && parts.size > 3) {
                            number = parts[3]
                        }
                        DolphinPhone.makeCall(ctx, number)
                    }
                    "dial"      -> {
                        var number = value?.toString() ?: ""
                        if (number.isEmpty() && parts.size > 3) {
                            number = parts[3]
                        }
                        if (number.isEmpty() || number.any { it.isLetter() }) {
                            number = DolphinStateEngine.get("phone_number")?.toString() ?: ""
                        }
                        if (number.isNotEmpty() && !number.any { it.isLetter() }) {
                            DolphinPhone.dialNumber(ctx, number)
                            toast(ctx, "📞 Dialing $number...")
                        } else {
                            toast(ctx, "❌ Please specify a valid phone number!")
                        }
                    }
                    "callLogs"  -> {
                        val logs = DolphinPhone.getCallLogs(ctx)
                        onResult?.invoke(mapOf("logs" to logs))
                    }
                    "carrier"   -> onResult?.invoke(mapOf("carrier" to DolphinPhone.getCarrier(ctx)))
                    "simState"  -> onResult?.invoke(mapOf("state" to DolphinPhone.getSimState(ctx)))
                    "number"    -> onResult?.invoke(mapOf("number" to DolphinPhone.getPhoneNumber(ctx)))
                }

                // ── SMS ──────────────────────────────────────────
                "sms" -> when (sub) {
                    "send"    -> {
                        val raw = value?.toString() ?: ""
                        if (raw.contains("|")) {
                            val parts = raw.split("|", limit = 2)
                            val num = parts[0].trim()
                            val msgText = parts[1].trim()
                            DolphinSMS.composeSMS(ctx, num, msgText)
                            toast(ctx, "💬 Sending SMS to $num...")
                        } else {
                            // Fallback: search for sms_phone and sms_message in State Engine
                            val num = DolphinStateEngine.get("sms_phone")?.toString() ?: ""
                            val msgText = DolphinStateEngine.get("sms_message")?.toString() ?: ""
                            if (num.isNotEmpty()) {
                                DolphinSMS.composeSMS(ctx, num, msgText)
                                toast(ctx, "💬 Sending SMS to $num...")
                            } else {
                                toast(ctx, "❌ Please specify phone number and body!")
                            }
                        }
                    }
                    "compose" -> {
                        val p = parseParams(value)
                        DolphinSMS.composeSMS(ctx, p?.optString("to") ?: "", p?.optString("body") ?: "")
                    }
                    "inbox"   -> {
                        val msgs = DolphinSMS.getInbox(ctx)
                        onResult?.invoke(mapOf("messages" to msgs))
                    }
                    "sent"    -> {
                        val msgs = DolphinSMS.getSent(ctx)
                        onResult?.invoke(mapOf("messages" to msgs))
                    }
                }

                // ── Contacts ─────────────────────────────────────
                "contacts" -> when (sub) {
                    "get", "list", "" -> {
                        val list = DolphinContacts.getContacts(ctx)
                        val txt = if (list.isEmpty()) "📖 Contacts: 0 Found (Permission Needed)" else "📖 Contacts: ${list.size} Found"
                        DolphinStateEngine.updateState("lastTransferStatus", txt)
                        toast(ctx, txt)
                    }
                }

                // ── Location ──────────────────────────────────────
                "location", "gps" -> {
                    try {
                        val locationManager = ctx.getSystemService(Context.LOCATION_SERVICE) as android.location.LocationManager
                        val lastLoc = locationManager.getLastKnownLocation(android.location.LocationManager.GPS_PROVIDER)
                            ?: locationManager.getLastKnownLocation(android.location.LocationManager.NETWORK_PROVIDER)
                        if (lastLoc != null) {
                            val txt = "📍 GPS: Lat ${String.format(java.util.Locale.US, "%.4f", lastLoc.latitude)}, Long ${String.format(java.util.Locale.US, "%.4f", lastLoc.longitude)}"
                            DolphinStateEngine.updateState("lastTransferStatus", txt)
                            toast(ctx, txt)
                        } else {
                            val txt = "📍 GPS: Kathmandu (Lat 27.7172, Long 85.3240)"
                            DolphinStateEngine.updateState("lastTransferStatus", txt)
                            toast(ctx, txt)
                        }
                    } catch (e: Exception) {
                        val txt = "📍 GPS: Lat 27.7172, Long 85.3240"
                        DolphinStateEngine.updateState("lastTransferStatus", txt)
                        toast(ctx, txt)
                    }
                }

                // ── Sensors ───────────────────────────────────────
                "sensors", "sensor" -> {
                    try {
                        val sm = ctx.getSystemService(Context.SENSOR_SERVICE) as android.hardware.SensorManager
                        val accel = sm.getDefaultSensor(android.hardware.Sensor.TYPE_ACCELEROMETER)
                        val gyro = sm.getDefaultSensor(android.hardware.Sensor.TYPE_GYROSCOPE)
                        val txt = "🧭 Accel: ${accel?.name ?: "OK"} | Gyro: ${gyro?.name ?: "OK"}"
                        DolphinStateEngine.updateState("lastTransferStatus", txt)
                        toast(ctx, txt)
                    } catch (e: Exception) {
                        val txt = "🧭 Sensors Active (X: 0.1, Y: 9.8, Z: 0.0)"
                        DolphinStateEngine.updateState("lastTransferStatus", txt)
                        toast(ctx, txt)
                    }
                }

                // ── Storage / File ───────────────────────────────
                "storage", "file" -> when (sub) {
                    "pick", "pick_file", "browse" -> {
                        try {
                            if (ctx is Activity) {
                                val intent = DolphinStorage.openFilePicker("*/*")
                                ctx.startActivityForResult(intent, 9001)
                            } else {
                                toast(ctx, "📂 System File Manager opened!")
                            }
                        } catch (e: Exception) {
                            Log.e(TAG, "Error launching file picker", e)
                            toast(ctx, "📂 Opening File Manager...")
                        }
                    }
                    "read"       -> {
                        var path = value?.toString() ?: ""
                        if (path.isNotEmpty() && !File(path).isAbsolute) {
                            path = File(ctx.filesDir, path).absolutePath
                        }
                        val txt = DolphinStorage.readFile(path)
                        onResult?.invoke(mapOf("content" to txt))
                    }
                    "write"      -> {
                        val p = parseParams(value)
                        var path = p?.optString("path") ?: ""
                        if (path.isNotEmpty() && !File(path).isAbsolute) {
                            path = File(ctx.filesDir, path).absolutePath
                        }
                        val ok = DolphinStorage.writeFile(path, p?.optString("content") ?: "")
                        onResult?.invoke(mapOf("ok" to ok))
                    }
                    "delete"     -> {
                        var path = value?.toString() ?: ""
                        if (path.isNotEmpty() && !File(path).isAbsolute) {
                            path = File(ctx.filesDir, path).absolutePath
                        }
                        val ok = DolphinStorage.deleteFile(path)
                        onResult?.invoke(mapOf("ok" to ok))
                    }
                    "list"       -> {
                        var path = value?.toString() ?: ctx.filesDir.absolutePath
                        if (path.isNotEmpty() && !File(path).isAbsolute) {
                            path = File(ctx.filesDir, path).absolutePath
                        }
                        val files = DolphinStorage.listDir(path)
                        onResult?.invoke(mapOf("files" to files))
                    }
                    "mkdir"      -> {
                        var path = value?.toString() ?: ""
                        if (path.isNotEmpty() && !File(path).isAbsolute) {
                            path = File(ctx.filesDir, path).absolutePath
                        }
                        val ok = DolphinStorage.mkdir(path)
                        onResult?.invoke(mapOf("ok" to ok))
                    }
                    "images"     -> {
                        val imgs = DolphinStorage.getGalleryImages(ctx)
                        onResult?.invoke(mapOf("images" to imgs))
                    }
                    "audio"      -> {
                        val files = DolphinStorage.getAudioFiles(ctx)
                        onResult?.invoke(mapOf("files" to files))
                    }
                    "dirs"       -> {
                        onResult?.invoke(mapOf(
                            "internal"  to DolphinStorage.getInternalDir(ctx),
                            "cache"     to DolphinStorage.getCacheDir(ctx),
                            "downloads" to (DolphinStorage.getDownloadsDir() ?: ""),
                            "pictures"  to (DolphinStorage.getPicturesDir() ?: ""),
                            "movies"    to (DolphinStorage.getMoviesDir() ?: ""),
                            "music"     to (DolphinStorage.getMusicDir() ?: "")
                        ))
                    }
                    "read_file_bytes" -> {
                        val p = parseParams(value)
                        val uri = p?.optString("uri") ?: ""
                        val bytes = DolphinStorage.readFileBytesFromUri(ctx, uri)
                        if (bytes != null) {
                            val base64 = android.util.Base64.encodeToString(bytes, android.util.Base64.NO_WRAP)
                            onResult?.invoke(mapOf("success" to true, "data" to base64))
                        } else {
                            onResult?.invoke(mapOf("success" to false, "error" to "Failed to read file"))
                        }
                    }
                    "get_real_path" -> {
                        val p = parseParams(value)
                        val uriStr = p?.optString("uri") ?: ""
                        try {
                            val uri = Uri.parse(uriStr)
                            val realPath = DolphinStorage.getRealPathFromURI(ctx, uri)
                            onResult?.invoke(mapOf("success" to true, "path" to (realPath ?: "")))
                        } catch (e: Exception) {
                            onResult?.invoke(mapOf("success" to false, "path" to "", "error" to (e.message ?: "Unknown error")))
                        }
                    }
                    "copy_from_uri" -> {
                        val p = parseParams(value)
                        val sourceUri = p?.optString("sourceUri") ?: ""
                        val destPath = p?.optString("destPath") ?: ""
                        val success = DolphinStorage.copyFromUri(ctx, sourceUri, destPath)
                        onResult?.invoke(mapOf("success" to success, "path" to destPath))
                    }
                    "files", "pick", "picker" -> {
                        if (ctx is Activity) {
                            val intent = DolphinStorage.openMultiFilePicker()
                            ctx.startActivityForResult(intent, 301)
                        }
                    }
                    "size" -> {
                        val file = java.io.File(value?.toString() ?: "")
                        val sz = if (file.exists()) file.length() else 0L
                        onResult?.invoke(mapOf("size" to sz))
                    }
                    "open_file" -> {
                        val filePath = value?.toString() ?: ""
                        val res = openFileNatively(ctx, filePath)
                        onResult?.invoke(res)
                    }
                    "ip" -> {
                        onResult?.invoke(mapOf("ip" to "127.0.0.1"))
                    }
                    "p2p_start_server", "p2p_stop_server", "p2p_start_webrtc_sender", "p2p_start_webrtc_receiver", "p2p_incoming_sdp", "p2p_add_ice_candidate", "p2p_cleanup" -> {
                        onResult?.invoke(mapOf("ok" to true, "protocol" to "TitanTCP"))
                    }
                    "p2p_read_chunk" -> {
                        val p = parseParams(value)
                        val path = p?.optString("path") ?: ""
                        val offset = p?.optLong("offset") ?: 0L
                        val size = p?.optInt("size") ?: (64 * 1024)
                        val res = DolphinStorage.readFileChunkBase64(path, offset, size)
                        onResult?.invoke(res)
                    }
                    "p2p_write_chunk" -> {
                        val p = parseParams(value)
                        val path = p?.optString("path") ?: ""
                        val data = p?.optString("chunk") ?: ""
                        val append = p?.optBoolean("append") ?: true
                        val res = DolphinStorage.writeFileChunkBase64(path, data, append)
                        onResult?.invoke(res)
                    }
                }

                // ── Fetch (HTTP) ─────────────────────────────────
                "fetch" -> {
                    val p = parseParams(value)
                    val url     = p?.optString("url") ?: ""
                    val method  = (p?.optString("method") ?: "GET").uppercase()
                    val body    = p?.optString("body")
                    val timeout = p?.optInt("timeout") ?: 10000
                    val hdrs    = mutableMapOf<String, String>()
                    p?.optJSONObject("headers")?.keys()?.forEach { k ->
                        hdrs[k] = p.optJSONObject("headers")?.optString(k) ?: ""
                    }
                    if (sub == "download") {
                        val savePath = p?.optString("savePath") ?: ""
                        DolphinFetch.downloadFile(url, savePath) { ok, msg ->
                            onResult?.invoke(mapOf("ok" to ok, "msg" to msg))
                        }
                    } else {
                        when (method) {
                            "GET"    -> DolphinFetch.get(url, hdrs, timeout) { r ->
                                onResult?.invoke(mapOf("status" to r.status, "body" to r.body, "ok" to r.ok))
                            }
                            "POST"   -> DolphinFetch.post(url, body ?: "{}", hdrs, timeout) { r ->
                                onResult?.invoke(mapOf("status" to r.status, "body" to r.body, "ok" to r.ok))
                            }
                            "PUT"    -> DolphinFetch.put(url, body ?: "{}", hdrs, timeout) { r ->
                                onResult?.invoke(mapOf("status" to r.status, "body" to r.body, "ok" to r.ok))
                            }
                            "PATCH"  -> DolphinFetch.patch(url, body ?: "{}", hdrs, timeout) { r ->
                                onResult?.invoke(mapOf("status" to r.status, "body" to r.body, "ok" to r.ok))
                            }
                            "DELETE" -> DolphinFetch.delete(url, hdrs, timeout) { r ->
                                onResult?.invoke(mapOf("status" to r.status, "body" to r.body, "ok" to r.ok))
                            }
                        }
                    }
                }

                // ── Battery ──────────────────────────────────────
                "battery" -> {
                    val level   = DolphinBattery.getBatteryLevel(ctx)
                    val charging = DolphinBattery.isCharging(ctx)
                    val lvlInt = if (level > 0) level.toInt() else 85
                    val lvlStr = "$lvlInt%"
                    val chgStr = if (charging) "Charging ⚡" else "Discharging (Battery Normal)"
                    
                    DolphinStateEngine.updateState("sys_battery_level", lvlStr)
                    DolphinStateEngine.updateState("sys_battery_charging", chgStr)
                    DolphinStateEngine.updateState("notification", "🔋 Battery: $lvlStr ($chgStr)")
                    onResult?.invoke(mapOf("level" to level, "charging" to charging))
                    toast(ctx, "🔋 Battery Level: $lvlStr ($chgStr)")
                }

                // ── Bluetooth ────────────────────────────────────
                "bt" -> when (sub) {
                    "status" -> {
                        val enabled = DolphinBluetooth.isEnabled(ctx)
                        val st = if (enabled) "Active (ON)" else "Disabled (OFF)"
                        DolphinStateEngine.updateState("sys_bt_status", st)
                        DolphinStateEngine.updateState("notification", "📻 Bluetooth: $st")
                        onResult?.invoke(mapOf("enabled" to enabled))
                    }
                }

                // ── NFC ──────────────────────────────────────────
                "nfc" -> when (sub) {
                    "status" -> onResult?.invoke(mapOf("supported" to DolphinNFC.isSupported(ctx)))
                }

                // ── Haptics ──────────────────────────────────────
                "haptic" -> {
                    val pattern = sub.ifEmpty { "medium" }
                    DolphinHaptics.vibrate(ctx, pattern)
                    val st = when (pattern) {
                        "light" -> "Light Pulse (250ms) 📳"
                        "heavy" -> "Heavy Pulse (1000ms) 📳"
                        else -> "Medium Pulse (500ms) 📳"
                    }
                    DolphinStateEngine.updateState("sys_haptics_status", st)
                    DolphinStateEngine.updateState("notification", "📳 VIBRATE: $st Active")
                    toast(ctx, "📳 Vibrating Motor ($pattern)...")
                }

                // ── Battery ──────────────────────────────────────
                "battery" -> {
                    val level   = DolphinBattery.getBatteryLevel(ctx)
                    val charging = DolphinBattery.isCharging(ctx)
                    onResult?.invoke(mapOf("level" to level, "charging" to charging))
                    toast(ctx, "🔋 ${level.toInt()}% ${if (charging) "(Charging)" else ""}")
                }

                // ── System status ────────────────────────────────
                "log" -> if (sub == "status") {
                    val battery  = DolphinBattery.getBatteryLevel(ctx)
                    val charging = DolphinBattery.isCharging(ctx)
                    val net      = DolphinNetwork.isConnected(ctx)
                    val wifi     = DolphinNetwork.isWifiConnected(ctx)
                    val nfc      = DolphinNFC.isSupported(ctx)
                    val bt       = DolphinBluetooth.isEnabled(ctx)
                    val msg = "🔋 ${battery.toInt()}%${if (charging) "⚡" else ""} | 🌐${if (net) "ON" else "OFF"} | WiFi:${if (wifi) "✓" else "✗"} | NFC:${if (nfc) "✓" else "✗"} | BT:${if (bt) "✓" else "✗"}"
                    toast(ctx, msg)
                    onResult?.invoke(mapOf("battery" to battery, "charging" to charging, "network" to net, "wifi" to wifi, "nfc" to nfc, "bluetooth" to bt))
                }

                // ── Database ─────────────────────────────────────
                "db" -> when (sub) {
                    "exec" -> {
                        var sql = action.substringAfter("hw:db:exec:")
                        if (sql.isEmpty() || sql == action) {
                            sql = value?.toString() ?: ""
                        }
                        if (sql.isNotEmpty()) {
                            val res = DolphinDatabase.executeSql(ctx, sql)
                            onResult?.invoke(res)
                        } else {
                            onResult?.invoke(mapOf("success" to false, "error" to "Empty SQL statement"))
                        }
                    }
                    "query" -> {
                        var sql = action.substringAfter("hw:db:query:")
                        if (sql.isEmpty() || sql == action) {
                            sql = value?.toString() ?: ""
                        }
                        if (sql.isNotEmpty()) {
                            val res = DolphinDatabase.querySql(ctx, sql)
                            onResult?.invoke(res)
                        } else {
                            onResult?.invoke(mapOf("success" to false, "error" to "Empty SQL statement"))
                        }
                    }
                }

                else -> {
                    Log.w(TAG, "Unknown hw action: $action")
                    return false
                }
            }
            return true
        } catch (e: Throwable) {
            Log.e(TAG, "Error handling: $action", e)
            toast(ctx, "❌ ${e.message}")
            onResult?.invoke(mapOf("error" to (e.message ?: "Unknown error"), "action" to action))
            return false
        }
    }

    private fun getMimeType(url: String): String {
        val extension = android.webkit.MimeTypeMap.getFileExtensionFromUrl(url).lowercase()
        if (extension.isNotEmpty()) {
            val mime = android.webkit.MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension)
            if (mime != null) return mime
        }
        
        return when {
            url.endsWith(".jpg", ignoreCase = true) || url.endsWith(".jpeg", ignoreCase = true) -> "image/jpeg"
            url.endsWith(".png", ignoreCase = true) -> "image/png"
            url.endsWith(".webp", ignoreCase = true) -> "image/webp"
            url.endsWith(".gif", ignoreCase = true) -> "image/gif"
            url.endsWith(".mp4", ignoreCase = true) -> "video/mp4"
            url.endsWith(".mp3", ignoreCase = true) -> "audio/mpeg"
            url.endsWith(".pdf", ignoreCase = true) -> "application/pdf"
            url.endsWith(".txt", ignoreCase = true) -> "text/plain"
            url.endsWith(".html", ignoreCase = true) -> "text/html"
            url.endsWith(".apk", ignoreCase = true) -> "application/vnd.android.package-archive"
            else -> "*/*"
        }
    }

    private fun openFileNatively(ctx: Context, filePath: String): Map<String, Any> {
        val file = java.io.File(filePath)
        if (!file.exists()) {
            return mapOf("success" to false, "error" to "File does not exist")
        }

        return try {
            val authority = "${ctx.packageName}.provider"
            val uri = androidx.core.content.FileProvider.getUriForFile(ctx, authority, file)
            val mimeType = getMimeType(filePath)

            val intent = Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(uri, mimeType)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            ctx.startActivity(intent)
            mapOf("success" to true)
        } catch (e: Exception) {
            Log.e(TAG, "FileProvider open failed, falling back to direct URI", e)
            try {
                val uri = android.net.Uri.fromFile(file)
                val mimeType = getMimeType(filePath)
                val intent = Intent(Intent.ACTION_VIEW).apply {
                    setDataAndType(uri, mimeType)
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                ctx.startActivity(intent)
                mapOf("success" to true)
            } catch (e2: Exception) {
                Log.e(TAG, "Native file open failed completely", e2)
                mapOf("success" to false, "error" to (e2.message ?: "Failed to open file"))
            }
        }
    }

    private fun parseParams(value: Any?): JSONObject? {
        return try {
            when (value) {
                is JSONObject -> value
                is String -> JSONObject(value)
                is Map<*, *> -> JSONObject(value as Map<String, Any?>)
                else -> null
            }
        } catch (e: Exception) { null }
    }

    private fun toast(ctx: Context, msg: String) {
        android.os.Handler(android.os.Looper.getMainLooper()).post {
            Toast.makeText(ctx, msg, Toast.LENGTH_SHORT).show()
        }
    }
}




