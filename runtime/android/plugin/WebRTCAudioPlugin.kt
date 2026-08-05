package io.dolphin.runtime

import android.content.Context
import android.util.Log
import android.view.View
import android.view.ViewGroup

/**
 * 🌊 WebRTCAudioPlugin
 * Custom UI component plugin for handling call audio setup and lifetime.
 * Maps to typeCode 0x38.
 */
class WebRTCAudioPlugin : DolphinUIPlugin {
    override val typeCode: Byte = 0x38 // 0x38 for WebRTCAudio

    override fun createView(ctx: Context, bin: ByteArray, factory: ViewFactory): View {
        // Consume strings to keep factory pointer in sync!
        val stateKeyOrAction = factory.nextStr()
        val config = factory.nextStr()
        
        Log.d("WebRTCAudioPlugin", "🔌 WebRTCAudioPlugin created (stateKey=$stateKeyOrAction, config=$config) - legacy stream disabled")
        // DolphinHardwareBridge.startAudioStream(ctx)

        return object : View(ctx) {
            override fun onDetachedFromWindow() {
                super.onDetachedFromWindow()
                val callStatus = DolphinStateEngine.get("call_status")?.toString()
                if (callStatus == "connected") {
                    Log.d("WebRTCAudioPlugin", "WebRTCAudio component detached but call_status is connected")
                } else {
                    Log.d("WebRTCAudioPlugin", "WebRTCAudio component detached")
                    // DolphinHardwareBridge.stopAudioStream()
                }
            }
        }.apply {
            layoutParams = ViewGroup.LayoutParams(0, 0)
            visibility = View.GONE
        }
    }
}
