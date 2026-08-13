package io.dolphin.runtime

import android.content.Context
import android.util.Log
import android.view.View
import android.view.ViewGroup
import java.io.File
import java.io.InputStream

private const val TAG = "DolphinRuntime"

open class DolphinSwipeContainer(context: Context) : android.widget.FrameLayout(context) {
    var gestureDetector: android.view.GestureDetector? = null

    override fun onInterceptTouchEvent(ev: android.view.MotionEvent): Boolean {
        gestureDetector?.onTouchEvent(ev)
        return super.onInterceptTouchEvent(ev)
    }

    override fun onTouchEvent(event: android.view.MotionEvent): Boolean {
        return gestureDetector?.onTouchEvent(event) == true || super.onTouchEvent(event)
    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        var wSize = android.view.View.MeasureSpec.getSize(widthMeasureSpec)
        var hSize = android.view.View.MeasureSpec.getSize(heightMeasureSpec)

        val metrics = context.resources.displayMetrics
        if (wSize <= 0) wSize = metrics.widthPixels
        if (hSize <= 0) hSize = metrics.heightPixels

        val safeW = android.view.View.MeasureSpec.makeMeasureSpec(wSize, android.view.View.MeasureSpec.EXACTLY)
        val safeH = android.view.View.MeasureSpec.makeMeasureSpec(hSize, android.view.View.MeasureSpec.EXACTLY)

        super.onMeasure(safeW, safeH)
    }
}

open class DolphinScrollView(context: Context) : android.widget.ScrollView(context) {
    init {
        isFillViewport = true
    }
}

/**
 * 🌊 Dolphin Native Runtime
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
        DolphinPluginRegistry.register(VideoPlayerPlugin())
        DolphinPluginRegistry.register(WebRTCAudioPlugin())
        DolphinDiagnostics.setupExceptionHandler(context)
        DolphinDiagnostics.checkAndShowCrashDialog(context)
    }

    fun sendAction(action: String, value: Any?) {
        hotPatch?.sendAction(action, value)
    }

    fun logToPC(tag: String, message: String) {
        Log.d(tag, message)
        sendAction("log:$tag", message)
    }

    fun getDevServerHost(): String {
        return hotPatch?.getHost() ?: "127.0.0.1"
    }

    var lastNavScreen: String? = null
    private var lastNavTime: Long = 0

    var onAction: ((action: String, value: Any?) -> Unit)? = null

    fun loadFromFile(file: File) {
        Log.i(TAG, "Loading bundle from file: ${file.name} (${file.length()} bytes)")
        val bytes = file.readBytes()
        loadFromBytes(bytes)
    }

    fun loadFromStream(stream: InputStream) {
        val bytes = stream.readBytes()
        stream.close()
        loadFromBytes(bytes)
    }

    fun loadFromBytes(bytes: ByteArray) {
        DolphinDiagnostics.setLastLoadedBundle(bytes)
        DolphinDiagnostics.reportValidation(bytes)
        bundle = parser.parse(bytes)
        viewFactory.bundle = bundle
        Log.i(TAG, "Bundle loaded: ${bundle?.screens?.size} screen(s), ${bundle?.components?.size} component(s)")
    }

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

                hotPatch?.sendAction(action, valueStr ?: "")
                
                val isHardwareAction = DolphinHardwareBridge.handleHardwareAction(context, action, value) { result ->
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
                                        if (lat != null) DolphinStateEngine.set("gps_lat", String.format("%.5f", (lat as Number).toDouble()))
                                        if (lng != null) DolphinStateEngine.set("gps_lng", String.format("%.5f", (lng as Number).toDouble()))
                                        if (acc != null) DolphinStateEngine.set("gps_acc", String.format("%.1fm", (acc as Number).toDouble()))
                                    }
                                    action == "hw:contacts:get" || action == "hw:contacts:list" -> {
                                        val contacts = result["contacts"] as? List<Map<String, Any?>>
                                        if (contacts != null) {
                                            val listStr = contacts.mapIndexed { idx, c ->
                                                "[${idx + 1}] 👤 ${c["name"] ?: "No Name"}: ${c["phone"] ?: ""}"
                                            }.joinToString("\n")
                                            DolphinStateEngine.set("contacts_text", listStr)
                                        }
                                    }
                                    action == "hw:sensor:accel" -> {
                                        val x = result["x"] as? Number
                                        val y = result["y"] as? Number
                                        val z = result["z"] as? Number
                                        if (x != null) DolphinStateEngine.set("sensor_x", String.format("%.4f", x.toDouble()))
                                        if (y != null) DolphinStateEngine.set("sensor_y", String.format("%.4f", y.toDouble()))
                                        if (z != null) DolphinStateEngine.set("sensor_z", String.format("%.4f", z.toDouble()))
                                    }
                                    action == "hw:battery" -> {
                                        val level = result["level"] as? Number
                                        val charging = result["charging"] as? Boolean ?: false
                                        if (level != null) {
                                            DolphinStateEngine.set("battery_text", "${Math.round(level.toDouble())}% ${if (charging) "⚡ (Charging)" else "(Discharging)"}")
                                        }
                                    }
                                    action == "hw:phone:carrier" -> {
                                        val carrier = result["carrier"]?.toString() ?: "Unknown"
                                        DolphinStateEngine.set("device_carrier", carrier)
                                    }
                                    action == "hw:phone:simState" -> {
                                        val state = result["state"]?.toString() ?: "Unknown"
                                        DolphinStateEngine.set("device_sim", state)
                                    }
                                    action == "hw:phone:number" -> {
                                        val number = result["number"]?.toString() ?: "Unavailable"
                                        DolphinStateEngine.set("device_number", number)
                                    }
                                }
                            } catch (e: Throwable) {
                                Log.e(TAG, "Failed to update offline states: ${e.message}", e)
                            }
                        }
                    } catch (t: Throwable) {
                        Log.e(TAG, "Error in hardware action callback", t)
                    }
                }
                
                if (!isHardwareAction) {
                    val isNavWithColon = action.startsWith("nav:") || action.startsWith("tab:") ||
                                         action.startsWith("app.switchScreen:") || action.startsWith("app.switchTab:") ||
                                         action.startsWith("app.navigate:") || action.startsWith("switchScreen:") ||
                                         action.startsWith("switchTab:") || action.startsWith("navigate:")
                    val isNavSplit = (action == "nav" || action == "tab" || action == "switchScreen" || action == "switchTab") && !valueStr.isNullOrBlank()

                    if (isNavWithColon || isNavSplit) {
                        val requestedScreen = if (isNavWithColon) action.substringAfter(":") else (valueStr ?: "")
                        val targetScreen = resolveScreenName(requestedScreen)
                        if (targetScreen != null) {
                            Log.i(TAG, "🧭 Native Navigation to: $targetScreen (from $requestedScreen)")
                            lastNavScreen = targetScreen
                            lastNavTime = System.currentTimeMillis()
                            this.onAction?.invoke("nav:$targetScreen", valueStr)
                        } else {
                            this.onAction?.invoke(action, valueStr)
                        }
                    } else {
                        this.onAction?.invoke(action, valueStr)
                    }
                }
            }

            viewFactory.bundle = b
            val view = viewFactory.buildScreen(screen, b.components)

            val isDrawer = screenName.equals("MainDrawer", ignoreCase = true) || screenName.equals("Drawer", ignoreCase = true)
            if (isDrawer) {
                return view
            }

            val container = DolphinSwipeContainer(context).apply {
                layoutParams = android.widget.FrameLayout.LayoutParams(
                    android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                    android.view.ViewGroup.LayoutParams.MATCH_PARENT
                )
            }
            container.addView(view)

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

            return container
        } catch (e: Throwable) {
            Log.e(TAG, "Failed to render screen: $screenName", e)
            
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
        }
        root.addView(descView)

        return root
    }

    fun buildEntryScreen(): android.view.View {
        val b = bundle ?: throw IllegalStateException("No bundle loaded.")
        val entry = b.screens.getOrNull(b.entryIndex)
            ?: b.screens.firstOrNull()
            ?: throw IllegalStateException("Bundle has no screens.")
        return buildScreen(entry.name)
    }

    fun getScreenNames(): List<String> = bundle?.screens?.map { it.name } ?: emptyList()

    fun resolveScreenName(requested: String): String? {
        val names = getScreenNames()
        if (names.contains(requested)) return requested
        val cleaned = requested.removeSuffix("Screen")
        if (names.contains(cleaned)) return cleaned
        val withSuffix = requested + "Screen"
        if (names.contains(withSuffix)) return withSuffix
        return names.firstOrNull { it.equals(requested, ignoreCase = true) || it.removeSuffix("Screen").equals(cleaned, ignoreCase = true) }
    }

    fun getScreenContainer(): android.view.ViewGroup? {
        val activity = context as? android.app.Activity ?: return null
        val rootGroup = activity.findViewById<android.view.ViewGroup>(android.R.id.content) ?: return null
        if (rootGroup.childCount > 0) {
            val topView = rootGroup.getChildAt(0) as? android.view.ViewGroup
            if (topView != null && (topView is androidx.drawerlayout.widget.DrawerLayout || topView.javaClass.simpleName.contains("Drawer"))) {
                return topView.getChildAt(0) as? android.view.ViewGroup ?: topView
            }
            if (topView != null) return topView
        }
        return rootGroup
    }

    private var pendingReloadRunnable: Runnable? = null
    private val reloadHandler by lazy { android.os.Handler(android.os.Looper.getMainLooper()) }

    private fun debounceReload(delayMs: Long = 150L, action: () -> Unit) {
        pendingReloadRunnable?.let { reloadHandler.removeCallbacks(it) }
        val r = Runnable { action() }
        pendingReloadRunnable = r
        reloadHandler.postDelayed(r, delayMs)
    }

    private fun replaceScreenView(targetContainer: ViewGroup, newScreenView: View) {
        val oldView = if (targetContainer.childCount > 0) targetContainer.getChildAt(0) else null
        if (oldView != null) {
            targetContainer.addView(newScreenView)
            newScreenView.post {
                try {
                    targetContainer.removeView(oldView)
                } catch (e: Throwable) {}
            }
        } else {
            targetContainer.addView(newScreenView)
        }
        targetContainer.invalidate()
        targetContainer.requestLayout()
    }

    fun connectDevServer(host: String = "10.0.2.2", port: Int = 7788, onConnected: ((String, String) -> Unit)? = null) {
        if (hotPatch == null) {
            hotPatch = HotPatchClient(host, port, object : HotPatchClient.Listener {
                override fun onFullReload(bundleBytes: ByteArray) {
                    debounceReload(150L) {
                        try {
                            if (bundleBytes.isNotEmpty()) {
                                val newBundle = BinaryParser().parse(bundleBytes)
                                this@DolphinRuntime.bundle = newBundle
                                viewFactory.bundle = newBundle
                                Log.i(TAG, "⚡ HotPatch parsed new bundle: ${newBundle.screens.size} screen(s)")
                            }
                        } catch (e: Throwable) {
                            Log.e(TAG, "Failed to parse hotpatch bundle: ${e.message}")
                        }
                        
                        scrollStateCache.clear()
                        val activeScreen = lastNavScreen ?: bundle?.screens?.getOrNull(bundle?.entryIndex ?: 0)?.name ?: "Home"
                        val targetScreen = resolveScreenName(activeScreen) ?: activeScreen
                        
                        scrollStateCache.clear()
                        val screenView = buildScreen(targetScreen)
                        val targetContainer = getScreenContainer()
                        if (targetContainer != null) {
                            replaceScreenView(targetContainer, screenView)
                        }
                        DolphinDiagnostics.streamLogcatToPC(150)
                    }
                }
                override fun onPatchScreen(screenName: String, components: ByteArray, rawData: ByteArray) {
                    debounceReload(150L) {
                        try {
                            bundle?.patchScreen(screenName, components, rawData)
                            viewFactory.bundle = bundle
                            val activeScreen = lastNavScreen ?: bundle?.screens?.getOrNull(bundle?.entryIndex ?: 0)?.name ?: "Home"
                            val targetScreen = resolveScreenName(screenName) ?: screenName
                            
                            Log.i(TAG, "⚡ HotPatch screen update for: $screenName")
                            if (activeScreen.equals(targetScreen, ignoreCase = true) || activeScreen.equals(screenName, ignoreCase = true)) {
                                scrollStateCache[targetScreen] = 0
                                scrollStateCache[screenName] = 0
                                val screenView = buildScreen(targetScreen)
                                val targetContainer = getScreenContainer()
                                if (targetContainer != null) {
                                    replaceScreenView(targetContainer, screenView)
                                }
                                DolphinDiagnostics.streamLogcatToPC(150)
                            }
                        } catch (e: Throwable) {
                            Log.e(TAG, "Failed to delta patch screen $screenName: ${e.message}")
                        }
                    }
                }
                override fun onPatchComponent(index: Int, titanBinary: ByteArray) {
                    (context as? android.app.Activity)?.runOnUiThread {
                        bundle?.patchComponent(index, titanBinary)
                        viewFactory.updateComponent(index, titanBinary)
                    }
                }
                override fun onPatchDelta(deltaBytes: ByteArray) {
                    (context as? android.app.Activity)?.runOnUiThread {
                        try {
                            val deltas = parseDelta(deltaBytes)
                            Log.i(TAG, "⚡ Applying fine-grained Delta HotPatch (${deltas.size} component diffs)")
                            deltas.forEach { compData ->
                                bundle?.patchComponent(compData.index, compData.binary)
                                viewFactory.updateComponent(compData.index, compData.binary, compData.changedBytes)
                            }
                        } catch (e: Throwable) {
                            Log.e(TAG, "Failed to apply delta hotpatch: ${e.message}")
                        }
                    }
                }
                override fun onPatchState(key: String, value: String) {
                    (context as? android.app.Activity)?.runOnUiThread {
                        val success = DolphinStateEngine.handleAction("$key:=$value")
                        if (!success) {
                            DolphinStateEngine.declareIfAbsent(key, value)
                            DolphinStateEngine.set(key, value)
                        }
                    }
                }
                override fun onNavigateTo(screenName: String) {}
                override fun onOpenDrawer(drawerName: String) {}
                override fun onDisconnected(reason: String) {}
                override fun onConnected(connectedHost: String) {
                    onConnected?.invoke("CONNECTED", connectedHost)
                }
            })
        }
        hotPatch?.connect()
    }

    fun disconnectDevServer() {
        hotPatch?.disconnect()
        hotPatch = null
    }

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
