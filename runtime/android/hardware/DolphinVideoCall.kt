package io.dolphin.runtime


import android.content.Context
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.ImageFormat
import android.graphics.Matrix
import android.hardware.camera2.*
import java.io.ByteArrayOutputStream
import android.media.ImageReader
import android.os.Handler
import android.os.HandlerThread
import android.util.Base64
import android.util.Log
import android.util.Range
import android.widget.Toast
import androidx.core.content.ContextCompat
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.atomic.AtomicBoolean

/**
 * 🎥 DolphinVideoCall
 *
 * Full-duplex video call over HTTP relay — no external WebRTC library required.
 * Matches the DolphinIntercom HTTP-relay pattern for audio.
 *
 * HOW IT WORKS:
 *   Caller/Receiver both run Camera2 capture + remote frame display simultaneously.
 *
 *   SEND path:
 *     Camera2 (front cam) → JPEG @ 640×480 ~15fps
 *     → POST /api/video/frame/push?from=<myId>&to=<targetId>
 *
 *   RECEIVE path:
 *     GET /api/video/frame/pull?from=<targetId>&to=<myId>
 *     → JPEG bytes → Base64 → DolphinStateEngine "video_remote_frame"
 *     → UI renders <img src="{video_remote_frame}">
 *
 * REQUIRED Android permissions (add to manifest if not present):
 *   <uses-permission android:name="android.permission.CAMERA" />
 *   <uses-permission android:name="android.permission.INTERNET" />
 *
 * hw: actions (handled in DolphinHardwareBridge):
 *   hw:webrtc:call    → startCall()   (initiating side)
 *   hw:webrtc:answer  → acceptCall()  (receiving side)
 *   hw:webrtc:hangup  → hangup()
 *   hw:webrtc:poll    → pollIncoming() — check if someone is calling me
 */
object DolphinVideoCall {
    private const val TAG    = "DolphinVideoCall"
    const val FRAME_W        = 640
    const val FRAME_H        = 480
    private const val FPS    = 15
    private const val JPEG_Q = 60   // lower = smaller frame, less bandwidth

    /** Optional logger — bridge sets this to push log lines into UI state */
    var onLog: ((String) -> Unit)? = null

    private val running = AtomicBoolean(false)

    private var captureThread: HandlerThread? = null
    private var captureHandler: Handler? = null
    private var cameraDevice: CameraDevice? = null
    private var imageReader: ImageReader? = null
    private var captureSession: CameraCaptureSession? = null

    private var serverUrl  = ""
    private var myId       = ""
    private var targetId   = ""
    private var useFrontCamera = true
    private var sensorOrientation = 90

    // ────────────────────────────────────────────────────────────
    // Public API
    // ────────────────────────────────────────────────────────────

    /** Initiate a video call (caller side). Sends offer signal then starts streaming. */
    fun startCall(ctx: Context, server: String, deviceId: String, target: String) {
        useFrontCamera = true
        if (running.get()) {
            // Already running — clean up previous session before starting fresh
            log("⚠️ Video call already active — closing previous session before restart.")
            closeCamera()
            Thread.sleep(300)
        }
        running.set(true)
        serverUrl = server; myId = deviceId; targetId = target

        Thread {
            try {
                httpPost("$server/api/video/offer",
                    """{"from":"$deviceId","to":"$target"}""")
                log("📹 Video offer sent → $target")
            } catch (e: Exception) { log("❌ Offer failed: ${e.message}") }
        }.start()

        // Camera2 requires openCamera() to be called on a Looper/main thread
        // Delay slightly to allow AudioRecord (intercom) to initialize first
        Handler(android.os.Looper.getMainLooper()).postDelayed({ openCamera(ctx) }, 500)
        startReceiveLoop()
    }

    /** Accept an incoming video call (receiver side). Sends answer signal then starts streaming. */
    fun acceptCall(ctx: Context, server: String, deviceId: String, target: String) {
        useFrontCamera = true
        if (running.get()) {
            // Already running — clean up previous session before starting fresh
            log("⚠️ Video call already active — closing previous session before restart.")
            closeCamera()
            Thread.sleep(300)
        }
        running.set(true)
        serverUrl = server; myId = deviceId; targetId = target

        Thread {
            try {
                httpPost("$server/api/video/answer",
                    """{"from":"$deviceId","to":"$target"}""")
                log("📹 Video call accepted ← $target")
            } catch (e: Exception) { log("❌ Answer failed: ${e.message}") }
        }.start()

        // Camera2 requires openCamera() to be called on a Looper/main thread
        // Delay slightly to allow AudioRecord (intercom) to initialize first
        Handler(android.os.Looper.getMainLooper()).postDelayed({ openCamera(ctx) }, 500)
        startReceiveLoop()
    }

    /** Hang up — stops camera, stops loops, sends hangup signal. */
    fun hangup(ctx: Context, server: String, deviceId: String, target: String) {
        if (!running.getAndSet(false)) { log("⚠️ No active video call"); return }

        Thread {
            try {
                httpPost("$server/api/video/hangup",
                    """{"from":"$deviceId","to":"$target"}""")
                log("📵 Video hangup signal sent")
            } catch (e: Exception) { log("❌ Hangup signal failed: ${e.message}") }
        }.start()

        closeCamera()
        DolphinStateEngine.set("video_remote_frame", "")
        DolphinStateEngine.set("video_remote_active", false)
        DolphinStateEngine.set("video_remote_connecting", false)
        DolphinStateEngine.set("video_local_frame", "")
        DolphinStateEngine.set("video_local_active", false)
        log("📵 Video streaming stopped")
    }

    /**
     * Poll the server to check if there is an incoming video call waiting for deviceId.
     * Returns the caller's deviceId string if there is a pending call, null otherwise.
     */
    fun pollIncoming(server: String, deviceId: String): String? {
        return try {
            val url = URL("$server/api/video/poll?deviceId=$deviceId")
            with(url.openConnection() as HttpURLConnection) {
                requestMethod  = "GET"
                connectTimeout = 3000
                readTimeout    = 3000
                if (responseCode == 200) {
                    val json = org.json.JSONObject(inputStream.bufferedReader().readText())
                    disconnect()
                    if (json.optBoolean("hasCall")) json.optString("from") else null
                } else { disconnect(); null }
            }
        } catch (e: Exception) { null }
    }

    // ────────────────────────────────────────────────────────────
    // Camera2 capture
    // ────────────────────────────────────────────────────────────

    private fun openCamera(ctx: Context) {
        // Helper to show main alerts in VideoCall too
        val showVideoAlert = { title: String, msg: String ->
            android.os.Handler(android.os.Looper.getMainLooper()).post {
                try {
                    android.app.AlertDialog.Builder(ctx)
                        .setTitle(title)
                        .setMessage(msg)
                        .setPositiveButton("OK", null)
                        .show()
                } catch (t: Throwable) { Log.e(TAG, "Popup failed: ${t.message}") }
            }
        }

        val showVideoToast = { msg: String ->
            android.os.Handler(android.os.Looper.getMainLooper()).post {
                android.widget.Toast.makeText(ctx.applicationContext, msg, android.widget.Toast.LENGTH_SHORT).show()
            }
        }

        showVideoToast("📹 Video Step 1: Checking Camera Permission...")
        // ── Runtime CAMERA permission guard ──────────────────────────
        if (ContextCompat.checkSelfPermission(ctx, android.Manifest.permission.CAMERA)
                != PackageManager.PERMISSION_GRANTED) {
            log("❌ CAMERA permission not granted — cannot open camera for video call")
            showVideoAlert("📹 Video Permission Error", "Camera permission (CAMERA) is not granted in Android system!")
            running.set(false)
            return
        }

        try {
            showVideoToast("📹 Video Step 2: Starting HandlerThread...")
            captureThread = HandlerThread("DolphinVideoCap").also { it.start() }
            captureHandler = Handler(captureThread!!.looper)
        } catch (e: Throwable) {
            showVideoAlert("📹 Video Step 2 Error", "Failed to start capture thread: ${e.message}\nStack: ${Log.getStackTraceString(e)}")
            running.set(false)
            return
        }

        val cm = ctx.getSystemService(Context.CAMERA_SERVICE) as CameraManager
        var camId: String? = null
        try {
            showVideoToast("📹 Video Step 3: Resolving camera ID...")
            camId = cm.cameraIdList.firstOrNull { id ->
                val facing = cm.getCameraCharacteristics(id).get(CameraCharacteristics.LENS_FACING)
                if (useFrontCamera) {
                    facing == CameraCharacteristics.LENS_FACING_FRONT
                } else {
                    facing == CameraCharacteristics.LENS_FACING_BACK
                }
            } ?: cm.cameraIdList.firstOrNull()

            if (camId != null) {
                val chars = cm.getCameraCharacteristics(camId)
                sensorOrientation = chars.get(CameraCharacteristics.SENSOR_ORIENTATION) ?: 90
                log("📹 Resolved camera sensorOrientation = $sensorOrientation")
            }
        } catch (e: Throwable) {
            showVideoAlert("📹 Video Step 3 Error", "Failed to access camera list/characteristics: ${e.message}\nStack: ${Log.getStackTraceString(e)}")
            running.set(false)
            return
        }

        if (camId == null) {
            log("❌ No camera available on this device")
            showVideoAlert("📹 Camera Error", "No camera device found on this system!")
            running.set(false)
            return
        }

        showVideoToast("Selected Camera ID: $camId")

        try {
            imageReader = ImageReader.newInstance(FRAME_W, FRAME_H, ImageFormat.JPEG, 3)
            imageReader!!.setOnImageAvailableListener({ reader ->
                if (!running.get()) return@setOnImageAvailableListener
                val image = reader.acquireLatestImage() ?: return@setOnImageAvailableListener
                try {
                    val videoEnabled = DolphinStateEngine.get("local_video_enabled") as? Boolean ?: true
                    if (!videoEnabled) {
                        DolphinStateEngine.set("video_local_frame", "")
                        DolphinStateEngine.set("video_local_active", false)
                        image.close()
                        return@setOnImageAvailableListener
                    }
                    val buf   = image.planes[0].buffer
                    var bytes = ByteArray(buf.remaining()).also { buf.get(it) }
                    
                    if (sensorOrientation != 0) {
                        try {
                            val bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.size)
                            if (bitmap != null) {
                                val matrix = Matrix()
                                matrix.postRotate(sensorOrientation.toFloat())
                                val rotated = Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true)
                                val outStream = ByteArrayOutputStream()
                                rotated.compress(Bitmap.CompressFormat.JPEG, JPEG_Q, outStream)
                                bytes = outStream.toByteArray()
                                bitmap.recycle()
                                rotated.recycle()
                            }
                        } catch (ex: Exception) {
                            log("❌ Error rotating fallback camera frame: ${ex.message}")
                        }
                    }

                    pushFrame(bytes)
                    
                    // Also update local preview frame!
                    val b64 = Base64.encodeToString(bytes, Base64.NO_WRAP)
                    DolphinStateEngine.set(
                        "video_local_frame",
                        "data:image/jpeg;base64,$b64"
                    )
                    DolphinStateEngine.set("video_local_active", true)
                } finally {
                    image.close()
                }
            }, captureHandler)
        } catch (e: Throwable) {
            showVideoAlert("📹 ImageReader Error", "Failed to setup ImageReader buffer: ${e.message}\nStack: ${Log.getStackTraceString(e)}")
            running.set(false)
            return
        }

        try {
            showVideoToast("📹 Video Step 4: Accessing hardware Camera device...")
            cm.openCamera(camId, object : CameraDevice.StateCallback() {
                override fun onOpened(cam: CameraDevice) {
                    cameraDevice = cam
                    val surface  = imageReader!!.surface
                    try {
                        showVideoToast("📹 Video Step 5: Creating camera session...")
                        cam.createCaptureSession(
                            listOf(surface),
                            object : CameraCaptureSession.StateCallback() {
                                override fun onConfigured(session: CameraCaptureSession) {
                                    if (!running.get()) return
                                    captureSession = session
                                    try {
                                        val req = cam.createCaptureRequest(
                                            CameraDevice.TEMPLATE_PREVIEW
                                        ).apply {
                                            addTarget(surface)
                                            set(CaptureRequest.CONTROL_AE_TARGET_FPS_RANGE,
                                                Range(FPS, FPS))
                                            set(CaptureRequest.JPEG_QUALITY, JPEG_Q.toByte())
                                        }.build()
                                        session.setRepeatingRequest(req, null, captureHandler)
                                        log("📹 Camera started (${FRAME_W}×${FRAME_H} @ ${FPS}fps)")
                                        showVideoToast("✅ Video Connected successfully!")
                                    } catch (e: Throwable) {
                                        showVideoAlert("📹 Capture Request Error", "Failed to build or set capture request: ${e.message}\nStack: ${Log.getStackTraceString(e)}")
                                    }
                                }
                                override fun onConfigureFailed(s: CameraCaptureSession) {
                                    log("❌ Camera session config failed")
                                    showVideoAlert("📹 Configuration Error", "Camera configuration session failed!")
                                }
                            },
                            captureHandler
                        )
                    } catch (e: Throwable) {
                        showVideoAlert("📹 Session Creation Error", "Failed to create camera session: ${e.message}\nStack: ${Log.getStackTraceString(e)}")
                    }
                }
                override fun onDisconnected(cam: CameraDevice) {
                    cam.close()
                    showVideoToast("📹 Camera Disconnected")
                }
                override fun onError(cam: CameraDevice, err: Int) {
                    cam.close()
                    log("❌ Camera error code: $err")
                    showVideoAlert("📹 Camera Hardware Error", "Camera device reported an error code: $err")
                }
            }, captureHandler)
        } catch (e: SecurityException) {
            log("❌ CAMERA permission not granted. Add CAMERA permission to manifest.")
            showVideoAlert("📹 Camera Security Error", "SecurityException opening camera: ${e.message}")
            running.set(false)
        } catch (e: Exception) {
            log("❌ Camera open failed: ${e.message}")
            showVideoAlert("📹 Camera Open Failure", "Exception opening camera: ${e.message}\nStack: ${Log.getStackTraceString(e)}")
            running.set(false)
        }
    }

    private fun closeCamera() {
        try { captureSession?.stopRepeating(); captureSession?.close() } catch (_: Exception) {}
        try { cameraDevice?.close()  } catch (_: Exception) {}
        try { imageReader?.close()   } catch (_: Exception) {}
        captureThread?.quitSafely()
        captureSession = null
        cameraDevice   = null
        imageReader    = null
        captureThread  = null
        captureHandler = null
    }

    // ────────────────────────────────────────────────────────────
    // Frame push (send our camera output to server)
    // ────────────────────────────────────────────────────────────

    private fun pushFrame(jpeg: ByteArray) {
        if (!running.get()) return
        try {
            val url = URL("$serverUrl/api/video/frame/push?from=$myId&to=$targetId")
            with(url.openConnection() as HttpURLConnection) {
                requestMethod = "POST"
                doOutput      = true
                setRequestProperty("Content-Type", "image/jpeg")
                setRequestProperty("Content-Length", jpeg.size.toString())
                connectTimeout = 1500
                readTimeout    = 1500
                outputStream.write(jpeg)
                responseCode   // trigger send
                disconnect()
            }
        } catch (_: Exception) {
            // Silence — this fires 15 times/sec; transient errors are expected
        }
    }

    // ────────────────────────────────────────────────────────────
    // Receive loop (pull remote video frames, push to state engine)
    // ────────────────────────────────────────────────────────────

    private fun startReceiveLoop() {
        val intervalMs = (1000L / FPS)
        DolphinStateEngine.set("video_remote_connecting", true)
        Thread {
            while (running.get()) {
                try {
                    val url = URL("$serverUrl/api/video/frame/pull?from=$targetId&to=$myId")
                    with(url.openConnection() as HttpURLConnection) {
                        requestMethod  = "GET"
                        connectTimeout = 1500
                        readTimeout    = 1500
                        if (responseCode == 200) {
                            val bytes = inputStream.readBytes()
                            if (bytes.isNotEmpty()) {
                                val b64 = Base64.encodeToString(bytes, Base64.NO_WRAP)
                                DolphinStateEngine.set(
                                    "video_remote_frame",
                                    "data:image/jpeg;base64,$b64"
                                )
                                DolphinStateEngine.set(
                                    "video_remote_active",
                                    true
                                )
                                DolphinStateEngine.set(
                                    "video_remote_connecting",
                                    false
                                )
                            }
                        }
                        disconnect()
                    }
                } catch (_: Exception) {}
                Thread.sleep(intervalMs)
            }
        }.apply { isDaemon = true; name = "DolphinVideoRecv"; start() }
    }

    // ────────────────────────────────────────────────────────────
    // HTTP helper
    // ────────────────────────────────────────────────────────────

    private fun httpPost(urlStr: String, body: String) {
        val url = URL(urlStr)
        with(url.openConnection() as HttpURLConnection) {
            requestMethod = "POST"
            doOutput      = true
            setRequestProperty("Content-Type", "application/json")
            connectTimeout = 5000
            readTimeout    = 5000
            outputStream.write(body.toByteArray())
            responseCode
            disconnect()
        }
    }

    fun flipCamera(ctx: Context) {
        if (!running.get()) {
            log("⚠️ Cannot flip camera: call not running")
            return
        }
        useFrontCamera = !useFrontCamera
        log("🔄 Flipping camera. useFrontCamera = $useFrontCamera")
        Thread {
            try {
                closeCamera()
                openCamera(ctx)
            } catch (e: Exception) {
                log("❌ Failed to flip camera: ${e.message}")
            }
        }.start()
    }

    private fun log(msg: String) {
        Log.d(TAG, msg)
        DolphinRuntime.instance?.logToPC("VideoCall", msg)
        onLog?.invoke(msg)
    }

    /**
     * Renders a raw JPEG ByteArray received from TitanTcpClient video frames.
     * Converts to Base64 and pushes into DolphinStateEngine as "video_remote_frame"
     * so the UI can display it via <img stateKey="video_remote_frame" />
     */
    fun renderRemoteFrameRaw(payload: ByteArray) {
        try {
            val base64Frame = android.util.Base64.encodeToString(payload, android.util.Base64.NO_WRAP)
            val dataUri = "data:image/jpeg;base64,$base64Frame"
            DolphinStateEngine.set("video_remote_frame", dataUri)
        } catch (e: Exception) {
            Log.e(TAG, "renderRemoteFrameRaw failed: ${e.message}")
        }
    }
}
