package io.dolphin.runtime

import android.graphics.drawable.GradientDrawable
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.view.animation.AccelerateDecelerateInterpolator
import android.view.animation.AccelerateInterpolator
import android.view.animation.DecelerateInterpolator
import android.view.animation.LinearInterpolator
import android.widget.TextView
import com.google.android.material.button.MaterialButton
import com.google.android.material.card.MaterialCardView

/**
 * 🐬 DolphinStateEngine
 *
 * Offline React Hook-like state management for Dolphin Native.
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
        val colorCode: Int = 0, // Used for BG_SHADE
        val anim: AnimSpec? = null
    )

    private val state   = mutableMapOf<String, Any>()
    private val initial = mutableMapOf<String, Any>()
    private val propertyBindings = mutableMapOf<String, MutableList<Binding>>()
    
    var themeLevel: Int = 0
        private set
    
    var onThemeChanged: ((level: Int) -> Unit)? = null

    fun declareIfAbsent(key: String, initialValue: Any) {
        if (!state.containsKey(key)) {
            state[key]   = initialValue
            initial[key] = initialValue
            Log.d("DolphinState", "Declared state: $key = $initialValue")
            if (key == "theme") {
                themeLevel = toNumber(initialValue).toInt().coerceIn(0, 255)
                onThemeChanged?.invoke(themeLevel)
            }
        }
    }

    /**
     * Bind a view's property to a state key.
     */
    fun bind(
        key: String,
        view: View,
        property: Property,
        initialValue: Any = 0,
        colorCode: Int = 0,
        anim: AnimSpec? = null
    ) {
        declareIfAbsent(key, initialValue)
        val list = propertyBindings.getOrPut(key) { mutableListOf() }
        val binding = Binding(view, property, colorCode, anim)
        list.add(binding)
        
        // Listen for view detachment from window to safely clean up binding
        view.addOnAttachStateChangeListener(object : View.OnAttachStateChangeListener {
            override fun onViewAttachedToWindow(v: View) {}
            override fun onViewDetachedFromWindow(v: View) {
                v.post {
                    if (!v.isAttachedToWindow && v.parent == null) {
                        list.remove(binding)
                    }
                }
            }
        })
        
        // Apply initial value
        applyBinding(view, property, state[key] ?: initialValue, colorCode, anim = null)
    }

    /**
     * Compatibility helper for older text-only bindings
     */
    fun bind(key: String, view: TextView, initialValue: Any = 0) {
        bind(key, view as View, Property.TEXT, initialValue)
    }

    fun clearDeadBindings() {
        propertyBindings.values.forEach { list ->
            list.removeAll { 
                val v = it.view
                (v.context as? android.app.Activity)?.isDestroyed == true || (!v.isAttachedToWindow && v.parent == null)
            }
        }
    }

    fun handleAction(action: String): Boolean {
        if (action == "toggle_theme") {
            themeLevel = if (themeLevel == 0) 255 else 0
            onThemeChanged?.invoke(themeLevel)
            return true
        }
        
        if (action.startsWith("nav:") || action.startsWith("tab:")) return false

        // Offline Fallback for Actions (e.g. increment, decrement, toggleLogin, resetAll, showToast, toggleTheme)
        val cleanAct = action.replace("app:", "").replace("app.", "").trim()
        if (cleanAct == "increment" || cleanAct == "incrementCounter") {
            val c = (toNumber(state["counter"] ?: 0) + 1).toInt()
            updateState("counter", c)
            return true
        }
        if (cleanAct == "decrement" || cleanAct == "decrementCounter") {
            val c = kotlin.math.max(0, (toNumber(state["counter"] ?: 0) - 1).toInt())
            updateState("counter", c)
            return true
        }
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
        if (cleanAct == "showToast" || cleanAct == "show_toast") {
            updateState("notification", "⚡ Temporary Toast (expires in 3s)")
            return true
        }
        if (cleanAct == "toggleTheme" || cleanAct == "toggle_theme" || cleanAct == "theme") {
            val newTheme = if (themeLevel > 128) "light" else "dark"
            updateState("theme", newTheme)
            return false // Forward action to server.js so Web & Mobile stay 100% in sync
        }
        if (cleanAct.startsWith("airPickGesture") || cleanAct.startsWith("airpick")) {
            val fileFromState = state["lastAirPickItem"]?.toString()
            val fileName = if (cleanAct.contains(":") && !cleanAct.endsWith(":")) {
                cleanAct.substringAfter(":")
            } else if (!fileFromState.isNullOrBlank() && fileFromState != "No Item Picked") {
                fileFromState
            } else {
                "Picked_Media_File.jpg"
            }
            updateState("lastAirPickItem", fileName)
            updateState("lastTransferStatus", "👌 AirPick Picked: $fileName! Dropping to Galaxy S23...")
            updateState("transferSpeed", "54.2 MB/s")
            return false
        }
        if (cleanAct.startsWith("sendFiles") || cleanAct.startsWith("send_files")) {
            updateState("lastTransferStatus", "🚀 Streaming binary payload over Titan TCP...")
            updateState("transferSpeed", "68.4 MB/s")
            return false // Allow piping to notify onAction/Toast
        }
        if (cleanAct == "selectFile" || cleanAct == "select_file") {
            val c = (toNumber(state["selectedCount"] ?: 0) + 1).toInt()
            updateState("selectedCount", c)
            val mb = String.format(java.util.Locale.US, "%.1f", c * 11.1)
            updateState("selectedFilesSize", "$mb MB ($c Files)")
            return true
        }
        if (cleanAct == "resetAll" || cleanAct == "reset_all") {
            initial.forEach { (key, value) -> updateState(key, value) }
            return true
        }
        if (cleanAct == "resetForm" || cleanAct == "reset_form") {
            // Reset all form-related state keys to their initial (empty) values
            listOf("formName", "formEmail", "formPhone", "formPassword", "formStatus").forEach { key ->
                val initVal = initial[key] ?: ""
                updateState(key, initVal)
            }
            return true
        }

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
            cmd.startsWith("+") || cmd == "increment" -> toNumber(current) + (cmd.drop(1).toDoubleOrNull() ?: 1.0)
            cmd.startsWith("-") || cmd == "decrement" -> kotlin.math.max(0.0, toNumber(current) - (cmd.drop(1).toDoubleOrNull() ?: 1.0))
            cmd.startsWith("*") -> toNumber(current) * (cmd.drop(1).toDoubleOrNull() ?: 1.0)
            cmd.startsWith("/") -> {
                val d = cmd.drop(1).toDoubleOrNull() ?: 1.0
                if (d != 0.0) toNumber(current) / d else current
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

    fun set(key: String, value: Any) {
        updateState(key, value)
    }

    fun updateState(key: String, value: Any) {
        val normalized: Any = if (value is Double && value == kotlin.math.floor(value)) value.toInt() else value
        state[key] = normalized

        // Global Theme Support: When "theme" state key changes, update engine level
        if (key == "theme") {
            themeLevel = when (value.toString().lowercase().trim()) {
                "dark", "255", "night", "true" -> 255
                "light", "0", "day", "false" -> 0
                else -> toNumber(value).toInt().coerceIn(0, 255)
            }
            onThemeChanged?.invoke(themeLevel)
        }

        val list = propertyBindings[key] ?: return

        android.os.Handler(android.os.Looper.getMainLooper()).post {
            val snapshot = list.toList()
            snapshot.forEach { binding ->
                if (binding.view.isAttachedToWindow) {
                    applyBinding(binding.view, binding.property, normalized, binding.colorCode, binding.anim)
                }
            }
        }
    }

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

    private fun interpolatorFor(ease: AnimEase) = when (ease) {
        AnimEase.LINEAR -> LinearInterpolator()
        AnimEase.IN -> AccelerateInterpolator()
        AnimEase.OUT -> DecelerateInterpolator()
        AnimEase.IN_OUT -> AccelerateDecelerateInterpolator()
    }

    private fun shouldAnimate(property: Property, anim: AnimSpec?): Boolean {
        if (anim == null) return false
        if (anim.durationMs <= 0) return false

        val isTransformProp = when (property) {
            Property.TRANSLATE_X, Property.TRANSLATE_Y,
            Property.SCALE, Property.SCALE_X, Property.SCALE_Y,
            Property.ROTATION -> true
            else -> false
        }
        val isOpacityProp = property == Property.ALPHA

        return when (anim.transition) {
            AnimTransition.NONE -> false
            AnimTransition.OPACITY -> isOpacityProp
            AnimTransition.TRANSFORM -> isTransformProp
            AnimTransition.ALL -> isTransformProp || isOpacityProp
        }
    }

    private fun applyBinding(view: View, property: Property, value: Any, colorCode: Int, anim: AnimSpec?) {
        try {
            when (property) {
                Property.TEXT -> if (view is TextView) {
                    val newStr = value.toString()
                    if (newStr.isEmpty()) {
                        view.text = " "
                    } else {
                        view.text = newStr
                    }
                    view.visibility = View.VISIBLE
                    view.invalidate()
                    // NOTE: Do NOT call requestLayout() here — it causes parent containers
                    // to re-measure from WRAP_CONTENT, shrinking the screen on state update.
                }
                Property.INPUT_VALUE -> {
                    // Reverse binding: state → EditText (for form reset support)
                    val editText: android.widget.EditText? = when (view) {
                        is com.google.android.material.textfield.TextInputEditText -> view
                        is android.widget.EditText -> view
                        is com.google.android.material.textfield.TextInputLayout -> view.editText
                        else -> null
                    }
                    if (editText != null && !editText.isFocused) {
                        val newStr = value.toString()
                        // Only update if different to avoid TextWatcher re-trigger loop
                        if (editText.text?.toString() != newStr) {
                            editText.setText(newStr)
                            if (newStr.isNotEmpty()) editText.setSelection(newStr.length)
                        }
                    }
                }
                Property.BG_SHADE -> {
                    val shade = (toNumber(value)).toInt().coerceIn(0, 255)
                    val color = ViewFactory.parseColor(colorCode, shade)
                    when (view) {
                        is MaterialCardView -> {
                            view.setCardBackgroundColor(android.content.res.ColorStateList.valueOf(color))
                        }
                        is MaterialButton -> {
                            view.backgroundTintList = android.content.res.ColorStateList.valueOf(color)
                        }
                        else -> {
                            view.setBackgroundColor(color)
                        }
                    }
                }
                Property.ALPHA -> {
                    val alpha = (toNumber(value) / 100.0).toFloat().coerceIn(0f, 1f)
                    if (shouldAnimate(property, anim)) {
                        view.animate()
                            .alpha(alpha)
                            .setDuration(anim!!.durationMs)
                            .setInterpolator(interpolatorFor(anim.ease))
                            .start()
                    } else {
                        view.alpha = alpha
                    }
                }
                Property.TEXT_SIZE -> {
                    if (view is TextView) {
                        val size = toNumber(value).toFloat().coerceIn(8f, 100f)
                        view.textSize = size
                    }
                }
                Property.VISIBILITY -> {
                    val visible = when(value) {
                        is Boolean -> value
                        is Number -> value.toInt() != 0
                        else -> value.toString() == "true"
                    }
                    view.visibility = if (visible) View.VISIBLE else View.GONE
                }
                Property.IMAGE -> {
                    if (view is android.widget.ImageView) {
                        val url = value.toString()
                        imageLoader?.invoke(view, url)
                    }
                }
                Property.WIDTH -> {
                    val width = toLayoutDimension(view, value)
                    updateLayout(view) { lp -> lp.width = width }
                }
                Property.HEIGHT -> {
                    val height = toLayoutDimension(view, value)
                    updateLayout(view) { lp -> lp.height = height }
                }
                Property.PADDING -> {
                    val padding = dp(view, toNumber(value).toInt().coerceAtLeast(0))
                    view.setPadding(padding, padding, padding, padding)
                    view.requestLayout()
                }
                Property.RADIUS -> {
                    val radiusPx = dp(view, toNumber(value).toInt().coerceAtLeast(0)).toFloat()
                    when (view) {
                        is MaterialCardView -> view.radius = radiusPx
                        is MaterialButton -> view.cornerRadius = radiusPx.toInt()
                        else -> {
                            val bg = (view.background as? GradientDrawable) ?: GradientDrawable().also { drawable ->
                                drawable.setColor(android.graphics.Color.TRANSPARENT)
                                view.background = drawable
                            }
                            bg.cornerRadius = radiusPx
                        }
                    }
                    view.invalidate()
                }
                Property.TRANSLATE_X -> {
                    val tx = dp(view, toNumber(value).toInt()).toFloat()
                    if (shouldAnimate(property, anim)) {
                        view.animate()
                            .translationX(tx)
                            .setDuration(anim!!.durationMs)
                            .setInterpolator(interpolatorFor(anim.ease))
                            .start()
                    } else {
                        view.translationX = tx
                    }
                }
                Property.TRANSLATE_Y -> {
                    val ty = dp(view, toNumber(value).toInt()).toFloat()
                    if (shouldAnimate(property, anim)) {
                        view.animate()
                            .translationY(ty)
                            .setDuration(anim!!.durationMs)
                            .setInterpolator(interpolatorFor(anim.ease))
                            .start()
                    } else {
                        view.translationY = ty
                    }
                }
                Property.SCALE -> {
                    val scale = toScale(value)
                    if (shouldAnimate(property, anim)) {
                        view.animate()
                            .scaleX(scale)
                            .scaleY(scale)
                            .setDuration(anim!!.durationMs)
                            .setInterpolator(interpolatorFor(anim.ease))
                            .start()
                    } else {
                        view.scaleX = scale
                        view.scaleY = scale
                    }
                }
                Property.SCALE_X -> {
                    val sx = toScale(value)
                    if (shouldAnimate(property, anim)) {
                        view.animate()
                            .scaleX(sx)
                            .setDuration(anim!!.durationMs)
                            .setInterpolator(interpolatorFor(anim.ease))
                            .start()
                    } else {
                        view.scaleX = sx
                    }
                }
                Property.SCALE_Y -> {
                    val sy = toScale(value)
                    if (shouldAnimate(property, anim)) {
                        view.animate()
                            .scaleY(sy)
                            .setDuration(anim!!.durationMs)
                            .setInterpolator(interpolatorFor(anim.ease))
                            .start()
                    } else {
                        view.scaleY = sy
                    }
                }
                Property.ROTATION -> {
                    val rot = toNumber(value).toFloat()
                    if (shouldAnimate(property, anim)) {
                        view.animate()
                            .rotation(rot)
                            .setDuration(anim!!.durationMs)
                            .setInterpolator(interpolatorFor(anim.ease))
                            .start()
                    } else {
                        view.rotation = rot
                    }
                }
                Property.ELEVATION -> {
                    val elevationPx = dp(view, toNumber(value).toInt().coerceAtLeast(0)).toFloat()
                    when (view) {
                        is MaterialCardView -> {
                            view.cardElevation = elevationPx
                            view.maxCardElevation = elevationPx
                        }
                        else -> view.elevation = elevationPx
                    }
                }
            }
        } catch (e: Exception) {
            Log.e("DolphinState", "ApplyBinding failed for $property", e)
        }
    }

    private fun updateLayout(view: View, updater: (ViewGroup.LayoutParams) -> Unit) {
        val existing = view.layoutParams
        val lp = existing ?: ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        )
        val wBefore = lp.width
        val hBefore = lp.height
        updater(lp)
        view.layoutParams = lp
        // Only trigger a layout pass if the dimension actually changed.
        // Unnecessary requestLayout() calls propagate up the tree and can collapse
        // WRAP_CONTENT parent containers, causing the screen to shrink (UI shrink bug).
        if (lp.width != wBefore || lp.height != hBefore) {
            view.requestLayout()
        }
    }

    private fun toLayoutDimension(view: View, value: Any): Int {
        val numeric = toNumber(value).toInt()
        return when {
            numeric == -1 -> ViewGroup.LayoutParams.MATCH_PARENT
            numeric == -2 -> ViewGroup.LayoutParams.WRAP_CONTENT
            else -> dp(view, numeric)
        }
    }

    private fun toScale(value: Any): Float {
        val numeric = toNumber(value)
        return when {
            numeric == 0.0 -> 0f
            kotlin.math.abs(numeric) > 10.0 -> (numeric / 100.0).toFloat()
            else -> numeric.toFloat()
        }
    }

    private fun dp(view: View, value: Int): Int {
        return (value * view.resources.displayMetrics.density).toInt()
    }

    private fun toNumber(value: Any): Double = when (value) {
        is Number -> value.toDouble()
        is String -> value.toDoubleOrNull() ?: 0.0
        is Boolean -> if (value) 1.0 else 0.0
        else -> 0.0
    }

    fun reset() {
        state.clear()
        initial.clear()
        propertyBindings.clear()
    }

    fun get(key: String): Any? = state[key]
}
