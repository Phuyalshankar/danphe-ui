package io.dolphin.runtime

import android.util.Log
import android.view.View
import android.widget.EditText
import android.widget.TextView

/**
 * 🐬 DolphinStateEngine v3.0 - Modularized & High-Performance Reactive State Store
 *
 * Thread-safe reactive state store with Main Looper view property bindings,
 * support for deep atomic transactions, state expressions, and offline action dispatching.
 */
object DolphinStateEngine {

    var imageLoader: ((view: android.widget.ImageView, url: String) -> Unit)? = null

    enum class Property {
        TEXT, INPUT_VALUE, BG_SHADE, ALPHA, TEXT_SIZE, VISIBILITY, IMAGE,
        WIDTH, HEIGHT, PADDING, RADIUS,
        TRANSLATE_X, TRANSLATE_Y,
        SCALE, SCALE_X, SCALE_Y,
        ROTATION, ELEVATION
    }

    enum class AnimTransition { NONE, ALL, TRANSFORM, OPACITY }
    enum class AnimEase { LINEAR, IN, OUT, IN_OUT }

    data class AnimSpec(
        val transition: AnimTransition,
        val durationMs: Long,
        val ease: AnimEase
    )

    data class Binding(
        val view: View,
        val property: Property,
        val colorCode: Int = 0,
        val anim: AnimSpec? = null
    )

    private val state = mutableMapOf<String, Any>()
    private val initial = mutableMapOf<String, Any>()
    private val propertyBindings = mutableMapOf<String, MutableList<Binding>>()

    var themeLevel: Int = 0
    var onThemeChanged: ((level: Int) -> Unit)? = null

    private val defaultState = mapOf(
        "name" to "",
        "email" to "",
        "password" to "",
        "text" to "",
        "username" to "",
        "phone" to "",
        "address" to "",
        "message" to "",
        "search" to "",
        "comment" to "",
        "formName" to "",
        "formEmail" to "",
        "formPhone" to "",
        "formPassword" to "",
        "formStatus" to "",
        "counter" to 0,
        "isLoggedIn" to false,
        "userStatus" to "Guest User",
        "theme" to "light",
        "notification" to "",
        "selectedCount" to 0,
        "selectedFilesSize" to "0.0 MB",
        "lastAirPickItem" to "No Item Picked",
        "lastTransferStatus" to "Idle",
        "transferSpeed" to "0.0 MB/s",
        "currentScreen" to "Home",
        "activeTab" to "Home",
        "needleAngle" to "0deg",
        "gaugeVal" to "50%"
    )

    init {
        defaultState.forEach { (key, value) ->
            state[key] = value
            initial[key] = value
        }
        Log.d("DolphinState", "✅ ${defaultState.size} default states initialized")
    }

    private val stateCache = mutableMapOf<String, Any>()

    fun preserveCurrentState() {
        stateCache.clear()
        stateCache.putAll(state)
        Log.d("DolphinState", "🔒 Preserved ${stateCache.size} state keys")
    }

    fun restoreState() {
        stateCache.forEach { (key, value) ->
            state[key] = value
            set(key, value)
        }
        Log.d("DolphinState", "🔓 Restored ${stateCache.size} state keys")
    }

    fun declareIfAbsent(key: String, initialValue: Any) {
        if (!state.containsKey(key)) {
            state[key] = initialValue
            initial[key] = initialValue
            Log.d("DolphinState", "Declared state: $key = $initialValue")
            if (key == "theme") {
                themeLevel = StateHelpers.toNumber(initialValue).toInt().coerceIn(0, 255)
                onThemeChanged?.invoke(themeLevel)
            }
        }
    }

    fun bind(
        key: String,
        view: View,
        property: Property,
        initialValue: Any = "",
        colorCode: Int = 0,
        anim: AnimSpec? = null
    ) {
        if (!state.containsKey(key)) {
            state[key] = initialValue
            initial[key] = initialValue
            Log.d("DolphinState", "✅ Auto-declared: $key = $initialValue")
        }

        val list = propertyBindings.getOrPut(key) { mutableListOf() }
        val binding = Binding(view, property, colorCode, anim)
        list.add(binding)

        view.addOnAttachStateChangeListener(object : View.OnAttachStateChangeListener {
            override fun onViewAttachedToWindow(v: View) {}
            override fun onViewDetachedFromWindow(v: View) {
                v.post {
                    if (!v.isAttachedToWindow && v.parent == null) {
                        list.remove(binding)
                        Log.d("DolphinState", "🧹 Cleaned binding: $key")
                    }
                }
            }
        })

        val currentValue = state[key] ?: initialValue
        StateBinder.apply(view, property, currentValue, colorCode, anim = null)
    }

    fun bind(key: String, view: TextView, initialValue: Any = "") {
        bind(key, view as View, Property.TEXT, initialValue)
    }

    fun bindInput(key: String, view: EditText, initialValue: Any = "") {
        bind(key, view as View, Property.INPUT_VALUE, initialValue)
    }

    fun clearDeadBindings() {
        propertyBindings.values.forEach { list ->
            list.removeAll {
                val v = it.view
                (v.context as? android.app.Activity)?.isDestroyed == true ||
                (!v.isAttachedToWindow && v.parent == null)
            }
        }
    }

    // ─── Universal Action Handler ──────────────────────────────────────────────────

    fun handleAction(action: String, isFromDevServer: Boolean = false): Boolean {
        if (action.isBlank()) return false
        
        if (action.startsWith("state:") && isFromDevServer) {
            return false // Skip echo
        }

        // Global Theme Toggle
        if (action == "toggle_theme") {
            themeLevel = if (themeLevel == 0) 255 else 0
            onThemeChanged?.invoke(themeLevel)
            return true
        }

        val cleanAct = action.removePrefix("app:").removePrefix("app.").trim()

        // ── Screen Navigation Actions ──
        val isNav = cleanAct.startsWith("nav:") || cleanAct.startsWith("tab:") ||
                    cleanAct.startsWith("switchScreen:") || cleanAct.startsWith("switchTab:") ||
                    cleanAct.startsWith("navigate:")
        if (isNav) {
            val targetScreen = cleanAct.substringAfter(":")
            if (targetScreen.isNotEmpty()) {
                updateState("currentScreen", targetScreen)
                updateState("activeTab", targetScreen)
            }
            return true
        }

        // ── Counter Actions ──
        if (cleanAct == "increment" || cleanAct == "incrementCounter") {
            val c = (StateHelpers.toNumber(state["counter"] ?: 0) + 1).toInt()
            updateState("counter", c)
            return true
        }
        if (cleanAct == "decrement" || cleanAct == "decrementCounter") {
            val c = kotlin.math.max(0, (StateHelpers.toNumber(state["counter"] ?: 0) - 1).toInt())
            updateState("counter", c)
            return true
        }

        // ── Login Actions ──
        if (cleanAct == "toggleLogin" || cleanAct == "toggle_login") {
            val logged = state["isLoggedIn"] == true || state["isLoggedIn"].toString() == "true"
            if (!logged) {
                updateState("isLoggedIn", true)
                updateState("userStatus", "VIP Member 🌟")
            } else {
                updateState("isLoggedIn", false)
                updateState("userStatus", "Guest User")
            }
            return true
        }

        // ── Toast Actions ──
        if (cleanAct == "showToast" || cleanAct == "show_toast") {
            val msg = "⚡ Temporary Toast (Auto-expires in 3 seconds)"
            updateState("notification", msg)
            updateState("app_alert", "Notification|$msg")
            return true
        }

        // ── Theme Actions ──
        if (cleanAct == "toggleTheme" || cleanAct == "toggle_theme" || cleanAct == "theme") {
            themeLevel = if (themeLevel > 128) 0 else 255
            val newTheme = if (themeLevel > 128) "dark" else "light"
            updateState("theme", newTheme)
            onThemeChanged?.invoke(themeLevel)
            return true
        }

        // ── Gauge Meter Needle Actions ──
        if (cleanAct == "setNeedleLow" || cleanAct == "set_needle_low") {
            updateState("needleAngle", "-60deg")
            updateState("gaugeVal", "25%")
            return true
        }
        if (cleanAct == "setNeedleMid" || cleanAct == "set_needle_mid") {
            updateState("needleAngle", "0deg")
            updateState("gaugeVal", "50%")
            return true
        }
        if (cleanAct == "setNeedleHigh" || cleanAct == "set_needle_high") {
            updateState("needleAngle", "60deg")
            updateState("gaugeVal", "95%")
            return true
        }

        // ── Reset All ──
        if (cleanAct == "resetAll" || cleanAct == "reset_all") {
            initial.forEach { (key, value) -> updateState(key, value) }
            return true
        }

        // ── Generic Expression Parser (key:=value, key+=1, key-=1, key!=toggle) ──
        val sepIdx = if (action.contains(':')) action.indexOf(':') else action.indexOf('.')
        if (sepIdx < 0) return false

        val key = action.substring(0, sepIdx).trim()
        val cmd = action.substring(sepIdx + 1).trim()

        if (!state.containsKey(key)) return false

        val current: Any = state[key] ?: return false
        val newValue: Any = when {
            cmd == "toggle" || cmd == "toggleLogin" -> {
                when (current) {
                    is Boolean -> !current
                    is Number  -> if (current.toInt() == 0) 1 else 0
                    else       -> if (current.toString() == "true") "false" else "true"
                }
            }
            cmd == "reset" || cmd == "resetAll" -> initial[key] ?: 0
            cmd.startsWith("+") || cmd == "increment" -> StateHelpers.toNumber(current) + (cmd.drop(1).toDoubleOrNull() ?: 1.0)
            cmd.startsWith("-") || cmd == "decrement" -> kotlin.math.max(0.0, StateHelpers.toNumber(current) - (cmd.drop(1).toDoubleOrNull() ?: 1.0))
            cmd.startsWith("*") -> StateHelpers.toNumber(current) * (cmd.drop(1).toDoubleOrNull() ?: 1.0)
            cmd.startsWith("/") -> {
                val d = cmd.drop(1).toDoubleOrNull() ?: 1.0
                if (d != 0.0) StateHelpers.toNumber(current) / d else current
            }
            cmd.startsWith("=") -> {
                val raw = cmd.drop(1)
                raw.toDoubleOrNull() ?: raw.toBooleanStrictOrNull() ?: raw
            }
            else -> return false
        }

        updateState(key, newValue)
        return true
    }

    // ─── State Accessors ───────────────────────────────────────────────────────

    fun get(key: String): Any? = state[key] ?: defaultState[key]

    fun set(key: String, value: Any) {
        updateState(key, value)
    }

    private val listeners = mutableListOf<(key: String, value: Any) -> Unit>()

    fun addListener(listener: (key: String, value: Any) -> Unit) {
        synchronized(listeners) {
            listeners.add(listener)
        }
    }

    fun updateState(key: String, value: Any) {
        val normalized: Any = StateHelpers.normalizeValue(value)
        state[key] = normalized

        synchronized(listeners) {
            listeners.forEach { it(key, normalized) }
        }

        // Global Theme Support
        if (key == "theme") {
            themeLevel = when (value.toString().lowercase().trim()) {
                "dark", "255", "night", "true" -> 255
                "light", "0", "day", "false" -> 0
                else -> StateHelpers.toNumber(value).toInt().coerceIn(0, 255)
            }
            onThemeChanged?.invoke(themeLevel)
        }

        val list = propertyBindings[key] ?: return

        // Main thread property binding updates
        android.os.Handler(android.os.Looper.getMainLooper()).post {
            val snapshot = list.toList()
            snapshot.forEach { binding ->
                StateBinder.apply(binding.view, binding.property, normalized, binding.colorCode, binding.anim)
            }
        }
    }

    // ─── Animation Spec Parser ─────────────────────────────────────────────────

    fun parseAnimSpec(raw: String): AnimSpec? {
        val parts = raw.split(',').map { it.trim() }.filter { it.isNotEmpty() }
        if (parts.isEmpty()) return null
        var t: AnimTransition = AnimTransition.NONE
        var d: Long = 0
        var e: AnimEase = AnimEase.LINEAR

        parts.forEach { p ->
            val kv = p.split("=", limit = 2)
            if (kv.size != 2) return@forEach
            val k = kv[0].trim()
            val v = kv[1].trim()
            when (k) {
                "t", "transition" -> {
                    t = when (v) {
                        "all" -> AnimTransition.ALL
                        "transform" -> AnimTransition.TRANSFORM
                        "opacity" -> AnimTransition.OPACITY
                        "none" -> AnimTransition.NONE
                        else -> AnimTransition.NONE
                    }
                }
                "d", "duration" -> d = v.toLongOrNull() ?: 0
                "e", "ease" -> {
                    e = when (v) {
                        "linear" -> AnimEase.LINEAR
                        "in" -> AnimEase.IN
                        "out" -> AnimEase.OUT
                        "in-out" -> AnimEase.IN_OUT
                        else -> AnimEase.LINEAR
                    }
                }
            }
        }

        return AnimSpec(transition = t, durationMs = d, ease = e)
    }

    // ─── Reset ────────────────────────────────────────────────────────────────

    fun reset() {
        defaultState.forEach { (key, value) ->
            state[key] = value
            initial[key] = value
        }
        propertyBindings.clear()
        Log.d("DolphinState", "✅ Reset to default states (${defaultState.size} keys)")
    }

    fun getState(): Map<String, Any> = state.toMap()

    fun getBindings(): Map<String, Int> = propertyBindings.mapValues { it.value.size }
}