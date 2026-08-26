package io.dolphin.runtime

import android.content.Context
import android.graphics.Bitmap
import android.net.http.SslError
import android.util.Log
import android.view.View
import android.webkit.*
import android.widget.FrameLayout
import android.widget.ProgressBar

/**
 * 🐬 DolphinWebView — Full-featured WebView with WebRTC, JavaScript, and media support.
 *
 * Capabilities:
 *  - WebRTC video/audio (getUserMedia, RTCPeerConnection)
 *  - Jitsi Meet / Zoom Web SDK / Google Meet
 *  - Unlimited web-based video grid (bypasses Android MediaCodec 4-8 decoder limit)
 *  - DOM Storage, IndexedDB, LocalStorage
 *  - Hardware-accelerated Chromium GPU decoding
 *  - Zero gesture required for media autoplay (mediaPlaybackRequiresUserGesture = false)
 *  - Full-screen video support via CustomView (WebChromeClient)
 *  - SSL error tolerance for self-signed NVR/RTSP-web endpoints
 */
class DolphinWebView(context: Context) : FrameLayout(context) {

    companion object {
        private const val TAG = "DolphinWebView"
    }

    // ── ProgressBar must be initialized BEFORE webView so the WebChromeClient closure can reference it ──
    val progressBar: ProgressBar = ProgressBar(context, null, android.R.attr.progressBarStyleHorizontal).apply {
        layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, 6).apply {
            topMargin = 0
        }
        isIndeterminate = false
        max = 100
        visibility = View.GONE
    }

    private var customViewContainer: FrameLayout? = null
    private var customViewCallback: WebChromeClient.CustomViewCallback? = null

    val webView: WebView = WebView(context).apply {
        layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)

        // ── Settings ─────────────────────────────────────────────────────────
        settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            mediaPlaybackRequiresUserGesture = false   // Autoplay video/audio
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            useWideViewPort = true
            loadWithOverviewMode = true
            setSupportZoom(false)
            builtInZoomControls = false
            displayZoomControls = false
            cacheMode = WebSettings.LOAD_DEFAULT
        }

        // Hardware acceleration for GPU decoding
        setLayerType(View.LAYER_TYPE_HARDWARE, null)

        // ── WebRTC / Media permission grants ─────────────────────────────────
        webChromeClient = object : WebChromeClient() {

            // Grant camera / mic / screen-share permission without user dialog
            override fun onPermissionRequest(request: PermissionRequest?) {
                request?.grant(request.resources)
                Log.d(TAG, "✅ WebRTC permission granted: ${request?.resources?.joinToString()}")
            }

            // Full-screen video overlay (e.g. YouTube, HLS player in web page)
            override fun onShowCustomView(view: View?, callback: CustomViewCallback?) {
                if (customViewContainer != null) {
                    callback?.onCustomViewHidden()
                    return
                }
                customViewCallback = callback
                customViewContainer = FrameLayout(context).apply {
                    layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
                    setBackgroundColor(android.graphics.Color.BLACK)
                    addView(view, LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT))
                }
                this@DolphinWebView.addView(customViewContainer)
                Log.d(TAG, "📺 Full-screen custom view shown")
            }

            override fun onHideCustomView() {
                customViewContainer?.let {
                    this@DolphinWebView.removeView(it)
                    customViewContainer = null
                }
                customViewCallback?.onCustomViewHidden()
                customViewCallback = null
                Log.d(TAG, "📺 Full-screen custom view hidden")
            }

            // Progress updates → drive ProgressBar
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                progressBar.progress = newProgress
                progressBar.visibility = if (newProgress < 100) View.VISIBLE else View.GONE
            }
        }

        // ── WebViewClient ────────────────────────────────────────────────────
        webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                progressBar.visibility = View.VISIBLE
                Log.d(TAG, "🌐 Loading: $url")
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                progressBar.visibility = View.GONE
                Log.d(TAG, "✅ Loaded: $url")
            }

            // Allow self-signed SSL certs (needed for local NVR / RTSP-web endpoints)
            override fun onReceivedSslError(view: WebView?, handler: SslErrorHandler?, error: SslError?) {
                Log.w(TAG, "⚠️ SSL error ignored (self-signed cert): ${error?.primaryError}")
                handler?.proceed()
            }

            // Keep navigation inside this WebView (no system browser launch)
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                return false
            }
        }
    }

    init {
        addView(webView)
        addView(progressBar)
    }

    /** Load a URL or HTML content. Accepts http://, https://, or data:text/html */
    fun load(url: String) {
        if (url.startsWith("data:")) {
            webView.loadData(url, "text/html", "UTF-8")
        } else {
            webView.loadUrl(url)
        }
        Log.d(TAG, "🚀 DolphinWebView.load($url)")
    }

    /** Pause WebView (call from onPause) — keeps stream alive */
    fun pause() {
        webView.onPause()
        webView.pauseTimers()
    }

    /** Resume WebView (call from onResume) — resumes in 0ms */
    fun resume() {
        webView.onResume()
        webView.resumeTimers()
    }

    /** Clean up resources */
    fun destroy() {
        webView.stopLoading()
        webView.destroy()
    }

    /** Handle hardware Back button inside WebView */
    fun canGoBack(): Boolean = webView.canGoBack()
    fun goBack() = webView.goBack()
}
