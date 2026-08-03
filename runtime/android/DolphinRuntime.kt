package io.dolphin.runtime

import android.content.Context
import android.util.Log
import java.io.File
import java.io.InputStream

private const val TAG = "DolphinRuntime"

open class DolphinSwipeContainer(context: Context) : android.widget.FrameLayout(context) {
    var gestureDetector: android.view.GestureDetector? = null

    override fun onInterceptTouchEvent(ev: android.view.MotionEvent): Boolean {
        if (gestureDetector?.onTouchEvent(ev) == true) {
            return true
        }
        return super.onInterceptTouchEvent(ev)
    }

    override fun onTouchEvent(event: android.view.MotionEvent): Boolean {
        if (gestureDetector?.onTouchEvent(event) == true) {
            return true
        }
        return super.onTouchEvent(event)
    }

    /**
     * 🛡️ SHRINK GUARD — DO NOT REMOVE.
     *
     * Forces this container to ALWAYS measure itself with EXACTLY the parent-provided
     * width and height. Without this, a requestLayout() triggered from deep inside the
     * screen (e.g., from a state binding update, visibility change, or HEIGHT property
     * update) can propagate upward and cause Android to re-measure this container in
     * AT_MOST mode if the parent's size isn't confirmed yet, collapsing the entire UI.
     *
     * Fixing this at the container level is the correct approach because:
     * - All screen roots use MATCH_PARENT inside this container.
     * - The container itself always has MATCH_PARENT layout params in contentContainer.
     * - Any WRAP_CONTENT re-measurement here would cause weight=1 children to get height=0.
     */
    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        val wSize = android.view.View.MeasureSpec.getSize(widthMeasureSpec)
        val hSize = android.view.View.MeasureSpec.getSize(heightMeasureSpec)

        // If parent gave us a concrete size (EXACTLY or AT_MOST with a real value),
        // force EXACTLY so children with weight=1 always expand to fill the screen.
        val safeW = if (wSize > 0) android.view.View.MeasureSpec.makeMeasureSpec(wSize, android.view.View.MeasureSpec.EXACTLY)
                    else widthMeasureSpec
        val safeH = if (hSize > 0) android.view.View.MeasureSpec.makeMeasureSpec(hSize, android.view.View.MeasureSpec.EXACTLY)
                    else heightMeasureSpec

        super.onMeasure(safeW, safeH)
    }
}

/**
 * 🛡️ SHRINK-PROOF SCROLL VIEW — DO NOT REMOVE.
 *
 * Custom ScrollView that prevents Android's isFillViewport from forcing
 * EXACTLY viewport height on inner LinearLayouts when content height exceeds
 * viewport height. Without this, isFillViewport causes Android's LinearLayout
 * to calculate negative remaining space and crush weighted children to 0 height
 * during state updates, text changes, or hotpatches.
 */
open class DolphinScrollView(context: Context) : android.widget.ScrollView(context) {
    init {
        isFillViewport = true
    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec)
        if (childCount > 0) {
            val child = getChildAt(0)
            val hMode = android.view.View.MeasureSpec.getMode(heightMeasureSpec)
            val hSize = android.view.View.MeasureSpec.getSize(heightMeasureSpec) - paddingTop - paddingBottom
            if (hMode != android.view.View.MeasureSpec.UNSPECIFIED && hSize > 0) {
                if (child.measuredHeight > hSize) {
                    val unspecifiedH = android.view.View.MeasureSpec.makeMeasureSpec(0, android.view.View.MeasureSpec.UNSPECIFIED)
                    val childWidthSpec = getChildMeasureSpec(
                        widthMeasureSpec,
                        paddingLeft + paddingRight,
                        child.layoutParams?.width ?: android.view.ViewGroup.LayoutParams.MATCH_PARENT
                    )
                    child.measure(childWidthSpec, unspecifiedH)
                    setMeasuredDimension(
                        resolveSize(child.measuredWidth + paddingLeft + paddingRight, widthMeasureSpec),
                        resolveSize(hSize + paddingTop + paddingBottom, heightMeasureSpec)
                    )
                }
            }
        }
    }
}

/**
 * 🌊 Dolphin Native Runtime
 *
 * Entry point for the Dolphin Binary Platform on Android.
 * Loads a .dolp bundle and renders native Android Views.
 *
 * Usage:
 *   val runtime = DolphinRuntime(context)
 *   runtime.loadFromFile(File(filesDir, "app.dolp"))
 *   setContentView(runtime.buildScreen("Home"))
 *
 * No WebView. No JavaScript. Pure binary → Native Views.
 */
class DolphinRuntime(val context: Context) {
    companion object {
        var instance: DolphinRuntime? = null
        val scrollStateCache = mutableMapOf<String, Int>()
    }

    private val parser      = BinaryParser()
    private val viewFactory = ViewFactory(context)
    private var bundle      : DolphinBundle? = null
    private var hotPatch    : HotPatchClient? = null

    init {
        instance = this
        io.dolphin.runtime.plugin.DolphinPluginRegistry.register(io.dolphin.runtime.plugin.VideoPlayerPlugin())
        io.dolphin.runtime.plugin.DolphinPluginRegistry.register(io.dolphin.runtime.plugin.WebRTCAudioPlugin())
        DolphinDiagnostics.setupExceptionHandler(context)
        DolphinDiagnostics.checkAndShowCrashDialog(context)
    }

    fun sendAction(action: String, value: Any?) {
        hotPatch?.sendAction(action, value)
    }

    /**
     * Send log messages from Android directly to PC console terminal.
     */
    fun logToPC(tag: String, message: String) {
        Log.d(tag, message)
        sendAction("log:$tag", message)
    }

    /** Returns the current Dev Server host IP (works dynamically with UDP discovery) */
    fun getDevServerHost(): String {
        return hotPatch?.getHost() ?: "127.0.0.1"
    }

    
    // Anti-flicker state
    var lastNavScreen: String? = null
    private var lastNavTime: Long = 0

    /** Handler for UI interactions like button clicks or switches */
    var onAction: ((action: String, value: Any?) -> Unit)? = null

    // ─────────────────────────────────────────────────────
    // LOADING
    // ─────────────────────────────────────────────────────

    /**
     * Load a .dolp bundle from a file.
     * @param file The .dolp binary file to load.
     */
    fun loadFromFile(file: File) {
        Log.i(TAG, "Loading bundle from file: ${file.name} (${file.length()} bytes)")
        val bytes = file.readBytes()
        loadFromBytes(bytes)
    }

    /**
     * Load a .dolp bundle from an InputStream (e.g. assets).
     * @param stream InputStream of the .dolp file.
     */
    fun loadFromStream(stream: InputStream) {
        val bytes = stream.readBytes()
        stream.close()
        loadFromBytes(bytes)
    }

    /**
     * Load a .dolp bundle from a raw byte array.
     * @param bytes Raw .dolp bundle data.
     */
    fun loadFromBytes(bytes: ByteArray) {
        DolphinDiagnostics.setLastLoadedBundle(bytes)
        DolphinDiagnostics.reportValidation(bytes)
        bundle = parser.parse(bytes)
        Log.i(TAG, "Bundle loaded: ${bundle?.screens?.size} screen(s), ${bundle?.components?.size} component(s)")
    }

    // ─────────────────────────────────────────────────────
    // RENDERING
    // ─────────────────────────────────────────────────────

    /**
     * Build a native Android View tree for a named screen.
     * Returns a ViewGroup that can be set as the content view.
     *
     * @param screenName The name of the screen to render.
     * @return An android.view.View representing the screen.
     */
    fun buildScreen(screenName: String): android.view.View {
        try {
            val b = bundle ?: throw IllegalStateException("No bundle loaded. Call loadFromFile() first.")
            val screen = b.screens.find { it.name == screenName }
                ?: throw IllegalArgumentException("Screen not found: \"$screenName\". Available: ${b.screens.map { it.name }}")

            Log.i(TAG, "Rendering screen: $screenName (${screen.componentCount} components)")
            
            viewFactory.onAction = { actionRaw, value ->
                var action = actionRaw
                if (action.startsWith("hw.") || action.startsWith("hw:")) {
                    action = action.replace('.', ':')
                } else if (action.startsWith("app:hw_")) {
                    action = "hw:" + action.substring(7).replace('_', ':')
                }

                Log.d(TAG, "⚡ Action Triggered: $action (value: $value)")
                val valueStr: String? = value?.toString()
                
                // 1. Intercept Hardware Actions
                val isHardwareAction = io.dolphin.runtime.hardware.DolphinHardwareBridge.handleHardwareAction(context, action, value) { result ->
                    try {
                        val json = mapToJson(result).toString()
                        hotPatch?.sendAction("hw_result:$action", json)
                        
                        android.os.Handler(context.mainLooper).post {
                        try {
                            when {
                                action == "hw:gps:get" || action == "hw:gps:watch" -> {
                                    val lat = result["latitude"] ?: result["lat"]
                                    val lng = result["longitude"] ?: result["lng"]
                                    val acc = result["accuracy"]
                                    if (lat != null) io.dolphin.runtime.DolphinStateEngine.set("gps_lat", String.format("%.5f", (lat as Number).toDouble()))
                                    if (lng != null) io.dolphin.runtime.DolphinStateEngine.set("gps_lng", String.format("%.5f", (lng as Number).toDouble()))
                                    if (acc != null) io.dolphin.runtime.DolphinStateEngine.set("gps_acc", String.format("%.1fm", (acc as Number).toDouble()))
                                }
                                action == "hw:contacts:get" || action == "hw:contacts:list" -> {
                                    val contacts = result["contacts"] as? List<Map<String, Any?>>
                                    if (contacts != null) {
                                        val listStr = contacts.mapIndexed { idx, c ->
                                            "[${idx + 1}] 👤 ${c["name"] ?: "No Name"}: ${c["phone"] ?: ""}"
                                        }.joinToString("\n")
                                        io.dolphin.runtime.DolphinStateEngine.set("contacts_text", listStr)
                                    }
                                }
                                action == "hw:sensor:accel" -> {
                                    val x = result["x"] as? Number
                                    val y = result["y"] as? Number
                                    val z = result["z"] as? Number
                                    if (x != null) io.dolphin.runtime.DolphinStateEngine.set("sensor_x", String.format("%.4f", x.toDouble()))
                                    if (y != null) io.dolphin.runtime.DolphinStateEngine.set("sensor_y", String.format("%.4f", y.toDouble()))
                                    if (z != null) io.dolphin.runtime.DolphinStateEngine.set("sensor_z", String.format("%.4f", z.toDouble()))
                                }
                                action == "hw:battery" -> {
                                    val level = result["level"] as? Number
                                    val charging = result["charging"] as? Boolean ?: false
                                    if (level != null) {
                                        io.dolphin.runtime.DolphinStateEngine.set("battery_text", "${Math.round(level.toDouble())}% ${if (charging) "⚡ (Charging)" else "(Discharging)"}")
                                    }
                                }
                                action == "hw:phone:carrier" -> {
                                    val carrier = result["carrier"]?.toString() ?: "Unknown"
                                    io.dolphin.runtime.DolphinStateEngine.set("device_carrier", carrier)
                                }
                                action == "hw:phone:simState" -> {
                                    val state = result["state"]?.toString() ?: "Unknown"
                                    io.dolphin.runtime.DolphinStateEngine.set("device_sim", state)
                                }
                                action == "hw:phone:number" -> {
                                    val number = result["number"]?.toString() ?: "Unavailable"
                                    io.dolphin.runtime.DolphinStateEngine.set("device_number", number)
                                }
                                action == "hw:storage:dirs" -> {
                                    val internal = result["internal"] ?: "N/A"
                                    val cache = result["cache"] ?: "N/A"
                                    val downloads = result["downloads"] ?: "N/A"
                                    val pictures = result["pictures"] ?: "N/A"
                                    val movies = result["movies"] ?: "N/A"
                                    val music = result["music"] ?: "N/A"
                                    val dirs = "🏠 Internal: $internal\n\n⚡ Cache: $cache\n\n📥 Downloads: $downloads\n\n🖼️ Pictures: $pictures\n\n🎬 Movies: $movies\n\n🎵 Music: $music"
                                    io.dolphin.runtime.DolphinStateEngine.set("storage_dirs", dirs)
                                }
                                action == "hw:storage:files" || action == "file:picker" -> {
                                    val filesList = result["files"] as? List<Map<String, Any?>>
                                    if (filesList != null) {
                                        io.dolphin.runtime.DolphinStateEngine.set("upload_status", "Selected ${filesList.size} Files")
                                        for (i in 0 until 5) {
                                            io.dolphin.runtime.DolphinStateEngine.set("upload_preview_$i", "system:icon:ic_menu_gallery")
                                            io.dolphin.runtime.DolphinStateEngine.set("upload_path_$i", "")
                                            io.dolphin.runtime.DolphinStateEngine.set("upload_visible_$i", false)
                                        }
                                        filesList.take(5).forEachIndexed { i, file ->
                                            val name = file["name"] as String
                                            val path = file["path"] as String
                                            val size = (file["size"] as? Number)?.toLong() ?: 0L
                                            io.dolphin.runtime.DolphinStateEngine.set("upload_path_$i", "$name (${String.format("%.1f", size / 1024.0)} KB)")
                                            val ext = name.substringAfterLast(".", "").lowercase()
                                            if (listOf("jpg", "jpeg", "png", "webp", "gif").contains(ext)) {
                                                io.dolphin.runtime.DolphinStateEngine.set("upload_preview_$i", "file://$path")
                                            } else if (listOf("mp4", "3gp", "mkv", "webm").contains(ext)) {
                                                io.dolphin.runtime.DolphinStateEngine.set("upload_preview_$i", "system:icon:ic_menu_slideshow")
                                            } else {
                                                io.dolphin.runtime.DolphinStateEngine.set("upload_preview_$i", "system:icon:ic_menu_save")
                                            }
                                            io.dolphin.runtime.DolphinStateEngine.set("upload_visible_$i", true)
                                        }
                                    }
                                }

                            }
                        } catch (e: Throwable) {
                            Log.e(TAG, "Failed to update offline states: ${e.message}", e)
                        }
                    }
                } catch (t: Throwable) {
                    Log.e(TAG, "Error in hardware action callback", t)
                } }
                
                if (!isHardwareAction) {
                    // 2. Intercept Offline Navigation
                    // Supports both:
                    //  - action = "nav:Success" (classic)
                    //  - action = "nav", value = "Success" (some runtimes)
                    val isNavWithColon = action.startsWith("nav:") || action.startsWith("tab:")
                    val isNavSplit = (action == "nav" || action == "tab") && !valueStr.isNullOrBlank()

                    if (isNavWithColon || isNavSplit) {
                        val targetScreen = if (isNavWithColon) action.substringAfter(":") else (valueStr ?: "")
                        if (getScreenNames().contains(targetScreen)) {
                            Log.i(TAG, "🧭 Native Navigation to: $targetScreen")

                            // Anti-flicker: record navigation
                            lastNavScreen = targetScreen
                            lastNavTime = System.currentTimeMillis()

                            // We need a way to tell the Activity to switch views.
                            // For now, we'll trigger the onAction listener.
                            this.onAction?.invoke(if (isNavWithColon) action else "nav:$targetScreen", valueStr)
                        } else {
                            this.onAction?.invoke(action, valueStr)
                        }
                    } else {
                        this.onAction?.invoke(action, valueStr)
                    }
                    
                    // 3. Notify Dev Server if connected
                    hotPatch?.sendAction(action, value)
                }
            }
            val view = viewFactory.buildScreen(screen, b.components)

            // ── Native Finger Swipe Gesture Container ──
            val container = DolphinSwipeContainer(context).apply {
                layoutParams = android.widget.FrameLayout.LayoutParams(
                    android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                    android.view.ViewGroup.LayoutParams.MATCH_PARENT
                )
            }

            // Restore scroll position + attach scroll listener AFTER the container
            // is added to the window, so we read the real measured height of the ScrollView.
            // NOTE: We post on the CONTAINER (not the inner view) so the requestLayout()
            // originates from a node whose parent measures it with MeasureSpec.EXACTLY.
            // Posting on the inner view caused the requestLayout() to propagate up through
            // WRAP_CONTENT intermediate parents, collapsing weight=1 children (UI shrink bug).
            container.post {
                val scrollView = findFirstScrollView(view)
                if (scrollView != null) {
                    val savedY = scrollStateCache[screenName] ?: 0
                    if (savedY > 0) {
                        scrollView.scrollTo(0, savedY)
                    }
                    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                        scrollView.setOnScrollChangeListener { _, _, scrollY, _, _ ->
                            scrollStateCache[screenName] = scrollY
                        }
                    } else {
                        scrollView.viewTreeObserver.addOnScrollChangedListener {
                            scrollStateCache[screenName] = scrollView.scrollY
                        }
                    }
                }
                // No requestLayout() here — the layout triggered by addView is sufficient.
                // Calling requestLayout() here would cause a second measurement pass where
                // any WRAP_CONTENT ancestor collapses the layout (confirmed UI shrink cause).
            }

            try {
                val gestureDetector = android.view.GestureDetector(context, object : android.view.GestureDetector.SimpleOnGestureListener() {
                    override fun onFling(e1: android.view.MotionEvent?, e2: android.view.MotionEvent, velocityX: Float, velocityY: Float): Boolean {
                        if (e1 == null) return false
                        val diffX = e2.x - e1.x
                        val diffY = e2.y - e1.y
                        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 150 && Math.abs(velocityX) > 300) {
                            val screens = this@DolphinRuntime.getScreenNames()
                            val currentIndex = screens.indexOf(screenName)
                            if (currentIndex != -1) {
                                if (diffX < 0 && currentIndex < screens.size - 1) {
                                    val nextScreen = screens[currentIndex + 1]
                                    this@DolphinRuntime.onAction?.invoke("tab:$nextScreen", null)
                                    return true
                                } else if (diffX > 0 && currentIndex > 0) {
                                    val prevScreen = screens[currentIndex - 1]
                                    this@DolphinRuntime.onAction?.invoke("tab:$prevScreen", null)
                                    return true
                                }
                            }
                        }
                        return false
                    }
                })

                container.gestureDetector = gestureDetector
            } catch (e: Throwable) {
                Log.e(TAG, "Failed to attach swipe gesture detector: ${e.message}")
            }

            val oldLp = view.layoutParams
            val newLp = android.widget.FrameLayout.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                android.view.ViewGroup.LayoutParams.MATCH_PARENT
            )
            if (oldLp is android.view.ViewGroup.MarginLayoutParams) {
                newLp.setMargins(oldLp.leftMargin, oldLp.topMargin, oldLp.rightMargin, oldLp.bottomMargin)
            }
            view.layoutParams = newLp
            container.addView(view)
            return container
        } catch (e: Throwable) {
            Log.e(TAG, "Failed to render screen: $screenName", e)
            
            // Explicitly report rendering crashes back to the Node.js Dev Server
            try {
                val sw = java.io.StringWriter()
                e.printStackTrace(java.io.PrintWriter(sw))
                val errJson = org.json.JSONObject().apply {
                    put("type", "RENDER_CRASH")
                    put("timestamp", System.currentTimeMillis())
                    put("thread", Thread.currentThread().name)
                    put("message", e.message ?: "No message")
                    put("stackTrace", sw.toString())
                    put("bundleHash", DolphinDiagnostics.getCurrentBundleHash())
                }
                hotPatch?.sendAction("diagnostics:crash", errJson.toString())
            } catch (ignore: Throwable) {}

            return buildErrorView(screenName, e)
        }
    }

    private fun findFirstScrollView(view: android.view.View): android.widget.ScrollView? {
        if (view is android.widget.ScrollView) return view
        if (view is android.view.ViewGroup) {
            for (i in 0 until view.childCount) {
                val found = findFirstScrollView(view.getChildAt(i))
                if (found != null) return found
            }
        }
        return null
    }

    private fun buildErrorView(screenName: String, error: Throwable): android.view.View {
        val root = android.widget.LinearLayout(context).apply {
            orientation = android.widget.LinearLayout.VERTICAL
            layoutParams = android.view.ViewGroup.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                android.view.ViewGroup.LayoutParams.MATCH_PARENT
            )
            setPadding(48, 80, 48, 48)
            setBackgroundColor(android.graphics.Color.parseColor("#FDF2F2"))
        }

        val titleView = android.widget.TextView(context).apply {
            text = "⚠️ Rendering Error"
            textSize = 22f
            typeface = android.graphics.Typeface.DEFAULT_BOLD
            setTextColor(android.graphics.Color.parseColor("#9B1C1C"))
            layoutParams = android.widget.LinearLayout.LayoutParams(
                android.widget.LinearLayout.LayoutParams.WRAP_CONTENT,
                android.widget.LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                bottomMargin = 16
            }
        }
        root.addView(titleView)

        val descView = android.widget.TextView(context).apply {
            text = "Dolphin Native failed to render screen: \"$screenName\"\n" +
                   "This is usually caused by an invalid component binary offset, misalignment, or corrupted payload."
            textSize = 14f
            setTextColor(android.graphics.Color.parseColor("#7F1D1D"))
            layoutParams = android.widget.LinearLayout.LayoutParams(
                android.widget.LinearLayout.LayoutParams.WRAP_CONTENT,
                android.widget.LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                bottomMargin = 32
            }
        }
        root.addView(descView)

        val scrollView = android.widget.ScrollView(context).apply {
            layoutParams = android.widget.LinearLayout.LayoutParams(
                android.widget.LinearLayout.LayoutParams.MATCH_PARENT,
                0,
                1.0f
            ).apply {
                bottomMargin = 32
            }
            setBackgroundColor(android.graphics.Color.parseColor("#FFE4E6"))
            setPadding(24, 24, 24, 24)
        }

        val logView = android.widget.TextView(context).apply {
            text = Log.getStackTraceString(error)
            textSize = 12f
            typeface = android.graphics.Typeface.MONOSPACE
            setTextColor(android.graphics.Color.parseColor("#9B1C1C"))
        }
        scrollView.addView(logView)
        root.addView(scrollView)

        val buttonContainer = android.widget.LinearLayout(context).apply {
            orientation = android.widget.LinearLayout.HORIZONTAL
            layoutParams = android.widget.LinearLayout.LayoutParams(
                android.widget.LinearLayout.LayoutParams.MATCH_PARENT,
                android.widget.LinearLayout.LayoutParams.WRAP_CONTENT
            )
            gravity = android.view.Gravity.CENTER
        }

        val reloadBtn = android.widget.Button(context).apply {
            text = "Reload Screen"
            setBackgroundColor(android.graphics.Color.parseColor("#1E1B4B"))
            setTextColor(android.graphics.Color.WHITE)
            setOnClickListener {
                try {
                    (context as? android.app.Activity)?.recreate()
                } catch (ex: Throwable) {
                    Log.e(TAG, "Recreate activity failed", ex)
                }
            }
            layoutParams = android.widget.LinearLayout.LayoutParams(
                android.widget.LinearLayout.LayoutParams.WRAP_CONTENT,
                android.widget.LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                rightMargin = 16
            }
        }
        buttonContainer.addView(reloadBtn)

        val homeBtn = android.widget.Button(context).apply {
            text = "Back to Home"
            setBackgroundColor(android.graphics.Color.parseColor("#4B5563"))
            setTextColor(android.graphics.Color.WHITE)
            setOnClickListener {
                try {
                    onAction?.invoke("nav:Home", null)
                } catch (ex: Throwable) {
                    Log.e(TAG, "Navigation to Home failed", ex)
                }
            }
        }
        buttonContainer.addView(homeBtn)

        root.addView(buttonContainer)

        return root
    }

    /**
     * Build the first/entry screen in the bundle.
     */
    fun buildEntryScreen(): android.view.View {
        val b = bundle ?: throw IllegalStateException("No bundle loaded.")
        val entry = b.screens.getOrNull(b.entryIndex)
            ?: b.screens.firstOrNull()
            ?: throw IllegalStateException("Bundle has no screens.")
        return buildScreen(entry.name)
    }

    /**
     * List all available screen names.
     */
    fun getScreenNames(): List<String> = bundle?.screens?.map { it.name } ?: emptyList()

    // ─────────────────────────────────────────────────────
    // HOT PATCH (Dev Mode)
    // ─────────────────────────────────────────────────────

    /**
     * Connect to the Dolphin Dev Server for hot binary patching.
     * Call this only during development.
     *
     * @param host   Dev server IP (e.g. "192.168.1.100" or "127.0.0.1" via adb forward)
     * @param port   Dev server port (default: 9091)
     * @param onPatch Callback when a patch is applied — use this to re-render the screen
     */
    fun connectDevServer(
        host: String = "127.0.0.1",
        port: Int = 9091,
        onPatch: (patchType: String, screenName: String?) -> Unit
    ) {
        hotPatch = HotPatchClient(host, port, object : HotPatchClient.Listener {
            override fun onFullReload(bundleBytes: ByteArray) {
                Log.i(TAG, "⚡ Hot patch: FULL_RELOAD (${bundleBytes.size} bytes)")
                android.os.Handler(context.mainLooper).post {
                    DolphinStateEngine.clearDeadBindings()
                    loadFromBytes(bundleBytes)
                    onPatch("FULL_RELOAD", null)
                }
            }

            override fun onPatchScreen(screenName: String, components: ByteArray, rawData: ByteArray) {
                android.os.Handler(context.mainLooper).post {
                    val now = System.currentTimeMillis()
                    if (screenName == lastNavScreen && (now - lastNavTime) < 100) {
                        Log.d(TAG, "⚡ Skipping patch for $screenName (flicker protection)")
                        bundle?.patchScreen(screenName, components, rawData)
                        return@post
                    }

                    Log.i(TAG, "🚀 [HOT PATCH] Received screen update for: $screenName | Size: ${components.size / 16} comps")
                    DolphinStateEngine.clearDeadBindings()
                    bundle?.patchScreen(screenName, components, rawData)
                    onPatch("PATCH_SCREEN", screenName)
                }
            }

            override fun onPatchComponent(index: Int, titanBinary: ByteArray) {
                Log.i(TAG, "⚡ Hot patch: PATCH_COMPONENT[$index]")
                android.os.Handler(context.mainLooper).post {
                    applyComponentPatch(index, titanBinary)
                }
            }

            override fun onPatchState(key: String, value: String) {
                // If key is "hw" or value starts with "hw:" or "hw.", trigger Android Hardware Bridge directly
                if ((key == "hw" || value.startsWith("hw:") || value.startsWith("hw.")) && value.isNotEmpty()) {
                    var fullAction = if (value.startsWith("hw:") || value.startsWith("hw.")) value else "hw:$value"
                    fullAction = fullAction.replace('.', ':')
                    Log.i(TAG, "🔌 Hardware Bridge triggered from patchState: $fullAction")
                    io.dolphin.runtime.hardware.DolphinHardwareBridge.handleHardwareAction(context, fullAction, null)
                    if (fullAction.startsWith("hw:audio:stream_play:")) return
                }

                val logValue = if (value.length > 80) value.substring(0, 80) + "...(${value.length} chars)" else value
                Log.i(TAG, "⚡ Hot patch: PATCH_STATE [$key = $logValue]")
                android.os.Handler(context.mainLooper).post {
                    if (key == "app_alert" && value.contains("|")) {
                        val parts = value.split("|", limit = 2)
                        val title = parts[0]
                        val msg = parts[1]
                        try {
                            android.app.AlertDialog.Builder(context)
                                .setTitle(title)
                                .setMessage(msg)
                                .setPositiveButton("OK", null)
                                .show()
                        } catch (e: Throwable) {
                            Log.e(TAG, "Alert show failed", e)
                            android.widget.Toast.makeText(context, "$title: $msg", android.widget.Toast.LENGTH_LONG).show()
                        }
                    }
                    val success = DolphinStateEngine.handleAction("$key:=$value")
                    if (!success) {
                        DolphinStateEngine.declareIfAbsent(key, value)
                        DolphinStateEngine.set(key, value)
                    }

                    if (key == "hw" && value.isNotEmpty()) {
                        if (value.startsWith("{")) {
                            try {
                                val json = org.json.JSONObject(value)
                                val actionName = json.optString("action") ?: ""
                                if (actionName.isNotEmpty()) {
                                    val fullAction = "hw:$actionName"
                                    Log.i(TAG, "🔌 Triggering hardware JSON action: $fullAction")
                                    if (viewFactory.onAction != null) {
                                        viewFactory.onAction?.invoke(fullAction, value)
                                    } else {
                                        io.dolphin.runtime.hardware.DolphinHardwareBridge.handleHardwareAction(
                                            context, fullAction, value
                                        ) { result ->
                                            try {
                                                val resJson = mapToJson(result).toString()
                                                hotPatch?.sendAction("hw_result:$fullAction", resJson)
                                            } catch (t: Throwable) {
                                                Log.e(TAG, "Error in JSON fallback callback", t)
                                            }
                                        }
                                    }
                                    return@post
                                }
                            } catch (e: Exception) {
                                Log.e(TAG, "Failed to parse hw JSON state value: $value", e)
                            }
                        }

                        val fullAction = if (value.startsWith("hw:")) value else "hw:$value"
                        Log.i(TAG, "🔌 Triggering hardware action from state 'hw': $fullAction")
                        if (viewFactory.onAction != null) {
                            viewFactory.onAction?.invoke(fullAction, null)
                        } else {
                            // Fallback: viewFactory.onAction not set yet — call bridge directly
                            Log.w(TAG, "⚠️ viewFactory.onAction is null, calling bridge directly")
                            io.dolphin.runtime.hardware.DolphinHardwareBridge.handleHardwareAction(
                                context, fullAction, null
                            ) { result ->
                                try {
                                    val json = mapToJson(result).toString()
                                    hotPatch?.sendAction("hw_result:$fullAction", json)
                                } catch (t: Throwable) {
                                    Log.e(TAG, "Error in fallback callback", t)
                                }
                            }
                        }
                    }
                }
            }

            override fun onNavigateTo(screenName: String) {
                Log.i(TAG, "🧭 Dev server commanded navigation to: $screenName")
                android.os.Handler(context.mainLooper).post {
                    onPatch("NAVIGATE_TO", screenName)
                }
            }

            override fun onOpenDrawer(drawerName: String) {
                Log.i(TAG, "📂 Dev server commanded opening drawer: $drawerName")
                android.os.Handler(context.mainLooper).post {
                    onPatch("OPEN_DRAWER", drawerName)
                }
            }

            override fun onConnected(connectedHost: String) {
                Log.i(TAG, "✅ Connected to Dev Server at $connectedHost")
                // Store the current server host so hardware modules can derive backend URLs
                DolphinStateEngine.set("dolphin_server_host", connectedHost)
                // Report currently loaded bundle hash to Server for synchronization verification
                sendAction("device_bundle_hash", DolphinDiagnostics.getCurrentBundleHash())
            }
            
            override fun onDisconnected(reason: String) {
                Log.w(TAG, "Dev server disconnected: $reason")
            }
        })
        hotPatch?.connect()
    }

    /**
     * Disconnect from dev server.
     */
    fun disconnectDevServer() {
        hotPatch?.disconnect()
        hotPatch = null
    }

    /**
     * Apply a targeted binary patch to a single component.
     * Updates both the in-memory bundle and the live native View.
     */
    fun applyComponentPatch(index: Int, titanBinary: ByteArray) {
        // Update bundle state
        bundle?.patchComponent(index, titanBinary)
        
        // Update live native view without full screen rebuild
        viewFactory.updateComponent(index, titanBinary)
    }

    // ─────────────────────────────────────────────────────
    // DIAGNOSTICS
    // ─────────────────────────────────────────────────────

    /** Returns a diagnostic string about the loaded bundle. */
    fun inspect(): String {
        val b = bundle
        if (b == null) return "No bundle loaded."
        return buildString {
            appendLine("🌊 Dolphin Bundle Inspection")
            appendLine("   Magic:      ${b.magic}")
            appendLine("   Version:    ${b.version}")
            appendLine("   Screens:    ${b.screens.size}")
            b.screens.forEach { s ->
                appendLine("     • ${s.name} (${s.componentCount} components, ${s.rawData.size} bytes)")
            }
            appendLine("   Components: ${b.components.size} (${b.components.size * 16} bytes)")
            appendLine("   Checksum:   ${if (b.checksumValid) "✅ valid" else "❌ invalid"}")
        }
    }

    /**
     * Properly serialize a Map<String, Any?> to a JSONObject,
     * recursively handling List<Map> and nested Map values.
     * org.json.JSONObject(map) does NOT do this by default — it calls
     * .toString() on list values, producing Java-format strings like
     * [{name=John, phone=123}] instead of [{"name":"John","phone":"123"}].
     */
    private fun mapToJson(map: Map<String, Any?>): org.json.JSONObject {
        val obj = org.json.JSONObject()
        for ((key, value) in map) {
            when (value) {
                null -> obj.put(key, org.json.JSONObject.NULL)
                is Map<*, *> -> {
                    @Suppress("UNCHECKED_CAST")
                    obj.put(key, mapToJson(value as Map<String, Any?>))
                }
                is List<*> -> {
                    val arr = org.json.JSONArray()
                    for (item in value) {
                        when (item) {
                            null -> arr.put(org.json.JSONObject.NULL)
                            is Map<*, *> -> {
                                @Suppress("UNCHECKED_CAST")
                                arr.put(mapToJson(item as Map<String, Any?>))
                            }
                            else -> arr.put(item)
                        }
                    }
                    obj.put(key, arr)
                }
                else -> obj.put(key, value)
            }
        }
        return obj
    }
}
