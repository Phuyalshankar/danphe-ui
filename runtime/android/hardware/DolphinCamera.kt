package io.dolphin.runtime

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Color
import android.graphics.SurfaceTexture
import android.hardware.Camera
import android.provider.MediaStore
import android.util.Log
import android.view.Gravity
import android.view.MotionEvent
import android.view.Surface
import android.view.TextureView
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.widget.FrameLayout
import android.widget.TextView
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import java.io.File
import java.io.FileOutputStream

@Suppress("DEPRECATION")
object DolphinCamera {
    private const val TAG = "DolphinCamera"
    private var isFrontFacing = false
    private var currentRotation = 90
    private val activePreviews = mutableListOf<CameraEmbeddedPreview>()
    private var currentActivePreview: CameraEmbeddedPreview? = null

    fun hasCamera(ctx: Context): Boolean {
        return ctx.packageManager.hasSystemFeature(PackageManager.FEATURE_CAMERA_ANY)
    }

    /** Open system camera app intent */
    fun openCamera(ctx: Context) {
        try {
            val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
            if (ctx !is Activity) {
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            ctx.startActivity(intent)
            Log.d(TAG, "Camera opened via ACTION_IMAGE_CAPTURE")
        } catch (e: Throwable) {
            Log.e(TAG, "Failed ACTION_IMAGE_CAPTURE, trying STILL_IMAGE_CAMERA", e)
            try {
                val fallback = Intent(MediaStore.INTENT_ACTION_STILL_IMAGE_CAMERA)
                if (ctx !is Activity) {
                    fallback.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                ctx.startActivity(fallback)
            } catch (e2: Throwable) {
                Log.e(TAG, "Failed to open camera fallback", e2)
            }
        }
    }

    /** Create Embedded Native Hardware Camera TextureView for Layout Canvas */
    fun createEmbeddedCameraView(ctx: Context, facing: String = "back"): View {
        val isFront = facing.equals("front", ignoreCase = true)
        val isFirstCanvas = activePreviews.isEmpty()
        val preview = CameraEmbeddedPreview(ctx, isFront, isFirstCanvas)
        activePreviews.add(preview)
        return preview.containerView
    }

    fun bindActionToPreview(container: View, action: String, factory: ViewFactory) {
        for (preview in activePreviews) {
            if (preview.containerView == container) {
                preview.bindAction(action, factory)
                break
            }
        }
    }

    fun stopAllOtherPreviews(active: CameraEmbeddedPreview) {
        currentActivePreview = active
        for (preview in activePreviews) {
            if (preview != active) {
                preview.stopPreview()
            }
        }
    }

    fun flipCamera(ctx: Context) {
        isFrontFacing = !isFrontFacing
        val facingStr = if (isFrontFacing) "Front (Selfie)" else "Rear (Main)"
        DolphinStateEngine.updateState("sys_camera_facing", facingStr)

        currentActivePreview?.flipLens() ?: activePreviews.firstOrNull()?.flipLens()
    }

    fun rotateCamera(ctx: Context, degrees: Int? = null) {
        currentRotation = degrees ?: ((currentRotation + 90) % 360)
        DolphinStateEngine.updateState("sys_camera_rotation", "${currentRotation}°")

        currentActivePreview?.setRotationAngle(currentRotation) ?: activePreviews.firstOrNull()?.setRotationAngle(currentRotation)
    }

    fun capturePhoto(ctx: Context, onCaptured: ((String) -> Unit)? = null) {
        try {
            openCamera(ctx)
        } catch (e: Throwable) {
            Log.e(TAG, "Failed to launch camera intent", e)
        }
    }

    fun captureCanvas(ctx: Context, onCaptured: ((String) -> Unit)? = null) {
        val preview = currentActivePreview ?: activePreviews.firstOrNull()
        if (preview != null) {
            val bitmap = preview.getBitmap()
            if (bitmap != null) {
                try {
                    val file = File(ctx.cacheDir, "canvas_snap_${System.currentTimeMillis()}.jpg")
                    val fos = FileOutputStream(file)
                    bitmap.compress(Bitmap.CompressFormat.JPEG, 90, fos)
                    fos.flush()
                    fos.close()
                    val path = "file://${file.absolutePath}"
                    DolphinStateEngine.updateState("sys_canvas_snapshot", path)
                    onCaptured?.invoke(path)
                    return
                } catch (e: Exception) {
                    Log.e(TAG, "Failed to save canvas snapshot", e)
                }
            }
        }
        onCaptured?.invoke("")
    }

    fun stopCamera(ctx: Context) {
        val preview = currentActivePreview ?: activePreviews.firstOrNull()
        preview?.stopPreview()
        DolphinStateEngine.updateState("sys_camera_status", "Camera Stopped 🛑")
    }

    fun startCamera(ctx: Context) {
        val preview = currentActivePreview ?: activePreviews.firstOrNull()
        if (preview != null) {
            preview.startPreviewFromExisting()
        }
    }

    class CameraEmbeddedPreview(private val context: Context, var isFront: Boolean, private val isAutoStartCanvas: Boolean) : TextureView.SurfaceTextureListener {
        val containerView: FrameLayout = FrameLayout(context).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            background = null
            setBackgroundColor(Color.TRANSPARENT)
            clipToOutline = false
            clipChildren = false
            setLayerType(View.LAYER_TYPE_HARDWARE, null)
        }

        private val textureView: TextureView = TextureView(context).apply {
            layoutParams = FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            clipToOutline = false
            setLayerType(View.LAYER_TYPE_HARDWARE, null)
        }

        private val overlayText: TextView = TextView(context).apply {
            layoutParams = FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT,
                Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
            ).apply {
                bottomMargin = 16
            }
            setTextColor(Color.WHITE)
            textSize = 12f
            setPadding(16, 8, 16, 8)
            setBackgroundColor(Color.TRANSPARENT)
            text = "🎥 Tap to Stream / Launch"
            visibility = View.VISIBLE
        }

        private var localCamera: Camera? = null
        private var rotationDegrees = 90
        private var boundAction = ""
        private var factoryRef: ViewFactory? = null
        private var currentTexture: SurfaceTexture? = null

        init {
            containerView.addView(textureView)
            containerView.addView(overlayText)

            textureView.surfaceTextureListener = this

            val touchListener = View.OnTouchListener { _, event ->
                if (event.action == MotionEvent.ACTION_UP) {
                    Log.i(TAG, "📸 TextureView Canvas Touch! Action: '$boundAction'")
                    if (boundAction.isNotEmpty()) {
                        factoryRef?.onAction?.invoke(boundAction, "CameraView")
                    }
                    if (currentTexture != null) {
                        startPreview(currentTexture!!, textureView.width, textureView.height)
                    } else {
                        openCamera(context)
                    }
                }
                true
            }

            containerView.setOnTouchListener(touchListener)
            textureView.setOnTouchListener(touchListener)
            overlayText.setOnTouchListener(touchListener)

            if (textureView.isAvailable) {
                textureView.surfaceTexture?.let { surface ->
                    currentTexture = surface
                    if (isAutoStartCanvas && currentActivePreview == null) {
                        checkPermissionAndStart(surface, textureView.width, textureView.height)
                    }
                }
            }
        }

        fun bindAction(actionStr: String, factory: ViewFactory) {
            boundAction = actionStr
            factoryRef = factory
        }

        override fun onSurfaceTextureAvailable(surface: SurfaceTexture, width: Int, height: Int) {
            Log.d(TAG, "🎥 TextureView SurfaceTexture Available: ${width}x${height}")
            currentTexture = surface
            checkPermissionAndStart(surface, width, height)
        }

        override fun onSurfaceTextureSizeChanged(surface: SurfaceTexture, width: Int, height: Int) {
            surface.setDefaultBufferSize(width, height)
        }

        override fun onSurfaceTextureDestroyed(surface: SurfaceTexture): Boolean {
            Log.d(TAG, "🎥 TextureView Destroyed")
            currentTexture = null
            stopPreview()
            return true
        }

        override fun onSurfaceTextureUpdated(surface: SurfaceTexture) {
            // Frame updated
        }

        private fun checkPermissionAndStart(surface: SurfaceTexture, width: Int, height: Int) {
            if (ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                Log.w(TAG, "Camera permission missing, requesting from user...")
                overlayText.text = "📷 Permission Required - Tap to Allow"
                overlayText.visibility = View.VISIBLE
                val activity = context as? Activity ?: (DolphinRuntime.instance?.context as? Activity)
                if (activity != null) {
                    ActivityCompat.requestPermissions(activity, arrayOf(Manifest.permission.CAMERA), 101)
                }
                return
            }

            stopAllOtherPreviews(this)
            startPreview(surface, width, height)
        }

        fun startPreview(surface: SurfaceTexture, width: Int, height: Int) {
            try {
                stopPreview()

                if (ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                    overlayText.text = "📷 Permission Needed"
                    overlayText.visibility = View.VISIBLE
                    return
                }

                val cameraId = getCameraId(isFront)
                val cam = Camera.open(cameraId)
                localCamera = cam

                val params = cam.parameters
                val sizes = params.supportedPreviewSizes
                val best = sizes?.firstOrNull { it.width <= 1280 && it.height <= 720 } ?: sizes?.firstOrNull { it.width <= 1280 } ?: sizes?.get(0)
                if (best != null) {
                    Log.i(TAG, "🎥 Setting TextureView camera preview size: ${best.width}x${best.height}")
                    params.setPreviewSize(best.width, best.height)
                    surface.setDefaultBufferSize(best.width, best.height)
                }
                if (params.supportedFocusModes?.contains(Camera.Parameters.FOCUS_MODE_CONTINUOUS_VIDEO) == true) {
                    params.focusMode = Camera.Parameters.FOCUS_MODE_CONTINUOUS_VIDEO
                }
                cam.parameters = params

                // Dynamic display orientation calculation
                val info = Camera.CameraInfo()
                Camera.getCameraInfo(cameraId, info)
                val windowManager = context.getSystemService(Context.WINDOW_SERVICE) as? WindowManager
                val rotation = windowManager?.defaultDisplay?.rotation ?: Surface.ROTATION_0
                var degrees = 0
                when (rotation) {
                    Surface.ROTATION_0 -> degrees = 0
                    Surface.ROTATION_90 -> degrees = 90
                    Surface.ROTATION_180 -> degrees = 180
                    Surface.ROTATION_270 -> degrees = 270
                }

                var displayOrientation: Int
                if (info.facing == Camera.CameraInfo.CAMERA_FACING_FRONT) {
                    displayOrientation = (info.orientation + degrees) % 360
                    displayOrientation = (360 - displayOrientation) % 360
                } else {
                    displayOrientation = (info.orientation - degrees + 360) % 360
                }
                cam.setDisplayOrientation(displayOrientation)

                cam.setPreviewTexture(surface)
                cam.startPreview()

                overlayText.visibility = View.GONE
                val label = if (isFront) "Front Selfie Lens" else "Rear Main Lens"
                DolphinStateEngine.updateState("sys_camera_status", "Embedded Live ($label) 🎥")
                Log.i(TAG, "✅ TextureView Live Camera Preview Active: $label")

                containerView.post {
                    containerView.requestLayout()
                    containerView.invalidate()
                    textureView.requestLayout()
                    textureView.invalidate()
                }
            } catch (e: Throwable) {
                Log.e(TAG, "Error starting TextureView camera preview: ${e.message}", e)
                val label = if (isFront) "Front Lens" else "Rear Lens"
                overlayText.text = "🎥 Tap to Open System Camera ($label)"
                overlayText.visibility = View.VISIBLE
            }
        }

        fun stopPreview() {
            try {
                localCamera?.apply {
                    stopPreview()
                    release()
                }
                localCamera = null
            } catch (e: Throwable) {
                Log.e(TAG, "Error stopping TextureView preview: ${e.message}")
            }
        }

        fun flipLens() {
            isFront = !isFront
            currentTexture?.let { startPreview(it, textureView.width, textureView.height) }
        }

        fun setRotationAngle(degrees: Int) {
            rotationDegrees = degrees
            currentTexture?.let { startPreview(it, textureView.width, textureView.height) }
        }

        fun startPreviewFromExisting() {
            currentTexture?.let { startPreview(it, textureView.width, textureView.height) }
        }

        fun getBitmap(): Bitmap? {
            return if (textureView.isAvailable) textureView.bitmap else null
        }

        private fun getCameraId(front: Boolean): Int {
            val info = Camera.CameraInfo()
            val numCameras = Camera.getNumberOfCameras()
            for (i in 0 until numCameras) {
                Camera.getCameraInfo(i, info)
                if (front && info.facing == Camera.CameraInfo.CAMERA_FACING_FRONT) {
                    return i
                } else if (!front && info.facing == Camera.CameraInfo.CAMERA_FACING_BACK) {
                    return i
                }
            }
            return 0
        }
    }
}
