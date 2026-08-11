package io.dolphin.runtime

import android.content.Context
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout

/**
 * 📷 CameraViewBuilder — Native Camera View Component Builder (Opcode 0x50)
 * Renders embedded live TextureView camera preview inside layout containers.
 */
class CameraViewBuilder : ComponentBuilder {
    override fun getType(): Int = 0x50
    override fun getName(): String = "CameraView"

    override fun build(ctx: Context, data: ByteArray, factory: ViewFactory): View {
        val cameraId = factory.nextStr().ifEmpty { "back" }
        val action = factory.nextStr()

        Log.i("CameraViewBuilder", "📷 Building CameraView component: cameraId=$cameraId, action=$action")

        val cameraView = DolphinCamera.createEmbeddedCameraView(ctx, cameraId)

        // Apply Tailwind CSS layout styles
        factory.applyStyles(cameraView, data)

        // CRITICAL FIX: Make container background TRANSPARENT so parent background color does not cover SurfaceView
        cameraView.background = null
        cameraView.setBackgroundColor(android.graphics.Color.TRANSPARENT)

        // Ensure non-zero height calculation for layout container expansion
        if (cameraView.layoutParams == null) {
            cameraView.layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                factory.dp(224)
            )
        } else {
            val currH = cameraView.layoutParams.height
            if (currH <= 0 && currH != ViewGroup.LayoutParams.WRAP_CONTENT) {
                cameraView.layoutParams.height = factory.dp(224)
            }
        }
        DolphinCamera.bindActionToPreview(cameraView, action, factory)

        // CRITICAL FIX: Disable clipToOutline so Android GPU Compositor does not mask out the hardware SurfaceView/TextureView
        cameraView.clipToOutline = false
        if (cameraView is ViewGroup) {
            cameraView.clipChildren = false
            cameraView.clipToPadding = false
        }

        cameraView.minimumHeight = factory.dp(224)
        return cameraView
    }
}
