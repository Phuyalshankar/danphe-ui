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

    var themeLevel: Int = 255
    var onThemeChanged: ((level: Int) -> Unit)? = null

    private val defaultState = mapOf(
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
        if (!state.containsKey(key) || (state[key]?.toString().isNullOrEmpty() && initialValue.toString().isNotEmpty())) {
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
        val stateVal = state[key]
        val currentValue = if (stateVal != null && stateVal.toString().isNotEmpty()) {
            stateVal
        } else if (initialValue.toString().isNotEmpty()) {
            state[key] = initialValue
            initial[key] = initialValue
            initialValue
        } else {
            stateVal ?: initialValue
        }

        val list = propertyBindings.getOrPut(key) { mutableListOf() }
        list.removeAll { it.view == view && it.property == property }
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

        // ── Direct Pattern Action: [bus:1000]1, [bus:1000]2, [stateKey:key]val ──
        if (action.startsWith("[bus:") || action.startsWith("[stateKey:")) {
            val endBracket = action.indexOf(']')
            if (endBracket > 0) {
                val rawKey = action.substring(1, endBracket)
                val appendVal = action.substring(endBracket + 1)
                val targetKey = if (rawKey.startsWith("stateKey:")) rawKey.removePrefix("stateKey:") else rawKey
                val current = (state[targetKey] ?: state[targetKey.removePrefix("bus:")] ?: "").toString()
                val updated = current + appendVal
                updateState(targetKey, updated)
                if (targetKey.startsWith("bus:")) {
                    updateState(targetKey.removePrefix("bus:"), updated)
                } else {
                    updateState("bus:$targetKey", updated)
                }
                if (targetKey == "bus:1000" || targetKey == "1000") {
                    updateState("dial_input", updated)
                }
                return true
            }
        }

        val cleanAct = action.removePrefix("app:").removePrefix("app.").removePrefix("state:").removePrefix("state.").trim()

        // ── Chat Send Action (Updates live bus stream & clears input box) ──
        if (cleanAct.contains("send_chat_msg") || cleanAct == "bus:send_chat" || cleanAct == "send_chat") {
            val typedMsg = (state["bus_1100"] ?: state["bus:1100"] ?: state["1100"] ?: state["chat_input"] ?: "").toString().trim()
            if (typedMsg.isNotEmpty()) {
                updateState("bus_1101", typedMsg)
                updateState("bus:1101", typedMsg)
                updateState("1101", typedMsg)
                updateState("bus_1100", "")
                updateState("bus:1100", "")
                updateState("1100", "")
                updateState("chat_input", "")
            }
            return true
        }

        // ── Everest Bus Actions (bus:write:reg:val, bus:key:5, bus:backspace, bus:dial, etc.) ──
        if (action.startsWith("[bus:dial]") || action.startsWith("bus:dial_key:")) {
            val digit = action.substringAfterLast(":")
            val current = (state["bus:1000"] ?: state["1000"] ?: state["dial_input"] ?: "").toString()
            val updated = current + digit
            updateState("bus:1000", updated)
            updateState("1000", updated)
            updateState("dial_input", updated)
            return true
        }

        if (action.startsWith("bus:")) {
            val parts = action.split(":")
            val verb = parts.getOrNull(1) ?: ""
            when (verb) {
                "write" -> {
                    val reg = parts.getOrNull(2) ?: ""
                    val valStr = parts.drop(3).joinToString(":")
                    if (reg.isNotEmpty()) {
                        updateState("bus:$reg", valStr)
                        updateState(reg, valStr)
                    }
                    return true
                }
                "key" -> {
                    val keyChar = parts.getOrNull(2) ?: ""
                    val current = (state["bus:1000"] ?: state["1000"] ?: state["dial_input"] ?: "").toString()
                    val updated = current + keyChar
                    updateState("bus:1000", updated)
                    updateState("1000", updated)
                    updateState("dial_input", updated)
                    return true
                }
                "backspace" -> {
                    val current = (state["bus:1000"] ?: state["1000"] ?: state["dial_input"] ?: "").toString()
                    if (current.isNotEmpty()) {
                        val updated = current.dropLast(1)
                        updateState("bus:1000", updated)
                        updateState("1000", updated)
                        updateState("dial_input", updated)
                    }
                    return true
                }
                "dial" -> {
                    val ext = parts.getOrNull(2) ?: (state["bus:1000"] ?: state["dial_input"] ?: "").toString().ifEmpty { "1000" }
                    updateState("bus:1000", ext)
                    updateState("bus:10", "ActiveCall")
                    updateState("currentScreen", "ActiveCall")
                    updateState("activeTab", "ActiveCall")
                    updateState("isDrawerOpen", false)
                    updateState("drawerState", 0)
                    return true
                }
                "relay" -> {
                    val relayId = parts.getOrNull(2) ?: "1"
                    val stateVal = if (parts.getOrNull(3) == "on" || parts.getOrNull(3) == "1") "1" else "0"
                    updateState("bus:2000$relayId", stateVal)
                    return true
                }
                "screen" -> {
                    val target = parts.getOrNull(2) ?: "Home"
                    updateState("bus:10", target)
                    updateState("currentScreen", target)
                    return true
                }
            }
        }

        // Global Theme Toggle
        if (action == "toggle_theme") {
            themeLevel = if (themeLevel == 0) 255 else 0
            onThemeChanged?.invoke(themeLevel)
            return true
        }

        // ── Dialpad / String Append Actions (e.g. dial_input_append:1, state:dial_input_append:1) ──
        if (cleanAct.contains("_append:")) {
            val key = cleanAct.substringBefore("_append:").trim()
            val charToAppend = cleanAct.substringAfter("_append:").trim()
            val currentStr = (state[key] ?: "").toString()
            updateState(key, currentStr + charToAppend)
            return true
        }

        // ── Dialpad / String Backspace Actions (e.g. dial_input:backspace, dial_input_backspace) ──
        if (cleanAct.endsWith(":backspace") || cleanAct.endsWith("_backspace")) {
            val key = cleanAct.removeSuffix(":backspace").removeSuffix("_backspace").trim()
            val currentStr = (state[key] ?: "").toString()
            if (currentStr.isNotEmpty()) {
                updateState(key, currentStr.dropLast(1))
            }
            return true
        }

        // ── Dialpad / String Clear Actions ──
        if (cleanAct.endsWith(":clear") || cleanAct.endsWith("_clear")) {
            val key = cleanAct.removeSuffix(":clear").removeSuffix("_clear").trim()
            updateState(key, "")
            return true
        }

        // ── Drawer Open / Close Actions (drawer:open:KeypadDrawer, bottom_drawer:open:KeypadDrawer) ──
        val isDrawer = cleanAct.startsWith("drawer:") || cleanAct.startsWith("bottom_drawer:")
        if (isDrawer) {
            val sub = cleanAct.substringAfter(":")
            if (sub.startsWith("open")) {
                val drawerTarget = sub.substringAfter("open:").trim().ifEmpty { "KeypadDrawer" }
                updateState("drawerState", 1)
                updateState("activeDrawer", drawerTarget)
                updateState("isDrawerOpen", true)
            } else if (sub == "close" || sub == "hide") {
                updateState("drawerState", 0)
                updateState("isDrawerOpen", false)
            }
            return true
        }

        // ── Screen Navigation Actions (Automatically resets drawer state) ──
        val isNav = cleanAct.startsWith("nav:") || cleanAct.startsWith("tab:") ||
                    cleanAct.startsWith("switchScreen:") || cleanAct.startsWith("switchTab:") ||
                    cleanAct.startsWith("navigate:")
        if (isNav) {
            val targetScreen = cleanAct.substringAfter(":")
            if (targetScreen.isNotEmpty()) {
                updateState("currentScreen", targetScreen)
                updateState("activeTab", targetScreen)
                updateState("isDrawerOpen", false)
                updateState("drawerState", 0)
                updateState("activeDrawer", "")
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

        // Dual Alias Sync for bus: keys (e.g. bus:1000 <-> 1000)
        val altKey = if (key.startsWith("bus:")) key.removePrefix("bus:") else "bus:$key"
        state[altKey] = normalized

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

        val keysToUpdate = listOf(key, altKey)
        keysToUpdate.forEach { k ->
            val list = propertyBindings[k]
            if (list != null && list.isNotEmpty()) {
                android.os.Handler(android.os.Looper.getMainLooper()).post {
                    val snapshot = list.toList()
                    snapshot.forEach { binding ->
                        StateBinder.apply(binding.view, binding.property, normalized, binding.colorCode, binding.anim)
                    }
                }
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