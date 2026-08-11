package io.dolphin.runtime

import android.content.Context
import android.view.View
import android.widget.FrameLayout

/**
 * 🐬 WebViewBuilder — Opcode 0x60
 *
 * Renders a full Chromium WebView inside a Dolphin Native screen.
 *
 * JSX Usage:
 * ```jsx
 * <WebView
 *   src="https://meet.jit.si/DolphinMeetRoom"
 *   width="full"
 *   height="500"
 * />
 * ```
 *
 * Or for NVR multi-camera web grid:
 * ```jsx
 * <WebView
 *   src="http://192.168.1.100:8080/live-grid"
 *   width="full"
 *   height="full"
 * />
 * ```
 *
 * Features:
 *  - Opcode: 0x60
 *  - WebRTC getUserMedia / RTCPeerConnection (Jitsi, Zoom, Google Meet)
 *  - Unlimited concurrent video decoding (Chromium GPU, bypasses Android MediaCodec limit)
 *  - SSL self-signed cert tolerance (for local NVR/RTSP-web servers)
 *  - DOM Storage, IndexedDB, LocalStorage
 *  - Zero-gesture media autoplay
 *  - Full-screen video overlay support
 */
class WebViewBuilder : ComponentBuilder {

    companion object {
        const val OPCODE = 0x60
    }

    override fun getType(): Int = OPCODE

    override fun getName(): String = "WebView"

    override fun build(ctx: Context, bin: ByteArray, factory: ViewFactory): View {
        var url = factory.nextStr().ifEmpty { "about:blank" }
        
        if (url.contains("127.0.0.1") || url.contains("localhost")) {
            val devHost = DolphinRuntime.instance?.getDevServerHost()
            if (!devHost.isNullOrEmpty() && devHost != "127.0.0.1") {
                url = url.replace("127.0.0.1", devHost).replace("localhost", devHost)
            }
        }

        val dolphinWebView = DolphinWebView(ctx).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        }

        // Load the URL immediately — no gesture required
        if (url.isNotBlank() && url != "about:blank") {
            dolphinWebView.load(url)
        }

        android.util.Log.d("WebViewBuilder", "🌐 WebView loaded: $url")
        return dolphinWebView
    }
}
