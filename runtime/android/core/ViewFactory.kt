package io.dolphin.runtime



import android.app.Activity
import android.content.Context
import android.graphics.Color
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView
import androidx.core.graphics.ColorUtils
import com.google.android.material.card.MaterialCardView

class ViewFactory(val ctx: Context) {
    private val componentBuilders = mutableMapOf<Int, ComponentBuilder>()
    private val initialStateMarker = "__DOLPHIN_INITIAL_STATE__:"

    init {
        DolphinStateEngine.imageLoader = { imageView, url ->
            loadImage(imageView, url)
        }

        // Register modular ComponentBuilders
        registerBuilder(ButtonBuilder())
        registerBuilder(TextBuilder())
        registerBuilder(ColumnBuilder(opcode = 0x13))
        registerBuilder(ColumnBuilder(opcode = 0x12))
        registerBuilder(CardBuilder())
        registerBuilder(RowBuilder())
        registerBuilder(TextFieldBuilder())
        registerBuilder(ImageBuilder())
        registerBuilder(SwitchBuilder())
        registerBuilder(CheckboxBuilder())
        registerBuilder(SelectBuilder())
        registerBuilder(RadioButtonBuilder())
        registerBuilder(GridBuilder())
        registerBuilder(TabBuilder())
        registerBuilder(NavBuilder())
        registerBuilder(HeaderBuilder())
        registerBuilder(DrawerBuilder())

        Log.d("ViewFactory", "✅ ${componentBuilders.size} ComponentBuilders registered")
    }

    fun registerBuilder(builder: ComponentBuilder) {
        componentBuilders[builder.getType()] = builder
        Log.d("ViewFactory", "Registered Builder: ${builder.getName()} (0x${Integer.toHexString(builder.getType())})")
    }

    var bundle: DolphinBundle? = null
    var comps: List<ByteArray> = emptyList()
    var compIdx = 0
    var data: ByteArray = byteArrayOf()
    var dataIdx = 0
    
    // Targeted Update Tracking
    var globalOffset = 0
    val viewMap = mutableMapOf<Int, View>()
    var onAction: ((action: String, value: Any?) -> Unit)? = null
    var isInScrollView: Boolean = false

    fun buildScreen(screen: DolphinScreen, allComponents: List<ByteArray>): View {
        comps = allComponents.subList(screen.componentOffset, screen.componentOffset + screen.componentCount)
        compIdx = 0
        data = screen.rawData
        dataIdx = 0
        
        globalOffset = screen.componentOffset
        viewMap.clear()
        
        Log.d("DolphinView", "Building: ${screen.name} with ${comps.size} components")

        // ✅ Register theme listener FIRST — before applyEmbeddedInitialState() which may fire onThemeChanged
        DolphinStateEngine.onThemeChanged = { level ->
            Log.d("DolphinView", "🌓 Theme changed to $level, re-applying styles...")
            (ctx as? Activity)?.runOnUiThread {
                val root = (viewMap[screen.componentOffset]?.parent as? ViewGroup) ?: (viewMap[screen.componentOffset] as? ViewGroup)
                if (root != null) {
                    val transition = android.transition.Fade().apply {
                        duration = 200
                    }
                    android.transition.TransitionManager.beginDelayedTransition(root, transition)
                }

                for (idx in screen.componentOffset until (screen.componentOffset + screen.componentCount)) {
                    val view = viewMap[idx]
                    val binary = allComponents.getOrNull(idx)
                    if (view != null && binary != null) {
                        // Skip TabBar — TabBuilder manages its own padding/styles
                        if (view.tag != TabBuilder.TABBAR_TYPE) {
                            applyStyles(view, binary)
                        }
                        if (view is TextView) {
                            applyTextStyles(view, binary)
                        }
                        if (view is ViewGroup) {
                            applyTextStylesToChildren(view, binary)
                        }
                        view.invalidate()
                    }
                }
            }
        }

        applyEmbeddedInitialState()

        val wasInScroll = isInScrollView
        return try {
            isInScrollView = true
            val root = buildComp() ?: View(ctx)
            
            root.layoutParams = ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
            
            val scrollView = DolphinScrollView(ctx).apply {
                layoutParams = ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
                isFillViewport = true
                setBackgroundColor(Color.TRANSPARENT)
                addView(root)
            }

            scrollView
        } catch (e: Exception) {
            Log.e("DolphinView", "Build Error", e)
            TextView(ctx).apply { text = "Error: ${e.message}"; setTextColor(Color.RED) }
        } finally {
            isInScrollView = wasInScroll
        }
    }

    private fun applyEmbeddedInitialState() {
        try {
            val raw = String(data, Charsets.UTF_8)
            val markerIndex = raw.lastIndexOf(initialStateMarker)
            if (markerIndex < 0) return
            val jsonStart = markerIndex + initialStateMarker.length
            val jsonEnd = raw.indexOf('\u0000', jsonStart).let { if (it >= 0) it else raw.length }
            val values = org.json.JSONObject(raw.substring(jsonStart, jsonEnd))
            val keys = values.keys()
            while (keys.hasNext()) {
                val key = keys.next()
                val value = values.get(key)
                DolphinStateEngine.declareIfAbsent(key, if (value == org.json.JSONObject.NULL) "" else value)
            }
        } catch (error: Exception) {
            Log.w("DolphinView", "Could not read embedded initial NanoStore state", error)
        }
    }

    fun contrastText(onColor: Int): Int {
        return try {
            val lum = ColorUtils.calculateLuminance(onColor)
            if (lum < 0.42) Color.WHITE else Color.DKGRAY
        } catch (_: Exception) {
            Color.DKGRAY
        }
    }

    fun buildComp(): View? {
        if (compIdx >= comps.size) return null

        val currentGlobalIdx = globalOffset + compIdx
        val bin = comps[compIdx++]
        val type = bin[1].toInt() and 0xFF
        
        Log.d("DolphinView", "Building component type: 0x${Integer.toHexString(type)}")
        
        // Byte 16+: String Data (width|height)
        val sizeStr = nextStr()
        
        // Read advanced feature strings BEFORE traversing children to maintain exact string pool alignment
        val sig = bin[bin.size - 1].toInt() and 0xFF
        val gradStr = if (sig and 0x01 != 0) nextStr() else ""
        val borderStr = if (sig and 0x04 != 0) nextStr() else ""
        val dynamicStr = if (sig and 0x08 != 0) nextStr() else ""
        val animStr = if (sig and 0x10 != 0) nextStr() else ""

        // MODULAR COMPONENT BUILDER HOOK
        val builder = componentBuilders[type]
        val plugin = DolphinPluginRegistry.getPlugin(type.toByte())

        val view: View = try {
            when {
                builder != null -> {
                    Log.d("ViewFactory", "✅ Rendering via ComponentBuilder: ${builder.getName()} (0x${Integer.toHexString(type)})")
                    builder.build(ctx, bin, this)
                }
                plugin != null -> {
                    val pluginView = plugin.createView(ctx, bin, this)
                    applyStyles(pluginView, bin)
                    pluginView
                }
                else -> {
                    when (type) {
                        0x22 -> createSimpleGrid(bin)
                        0x20, 0x21 -> createColumn(bin, isCard = false)
                        0x40 -> createFileUpload(bin)
                        0x32 -> createHardwareView(bin, "location")
                        0x34 -> createHardwareView(bin, "haptics")
                        0x35 -> createHardwareView(bin, "battery")
                        0x36 -> createHardwareView(bin, "sensors")
                        else -> createColumn(bin, isCard = false)
                    }
                }
            }
        } catch (e: Throwable) {
            val compName = builder?.getName() ?: "Opcode_0x${Integer.toHexString(type)}"
            ModuleDiagnosticManager.recordFailure(type, compName, e, ctx)
            val stack = e.stackTrace.firstOrNull { !it.className.startsWith("java.") }
            val loc = if (stack != null) " (${stack.fileName}:${stack.lineNumber})" else ""
            Log.e("DolphinModuleIsolation", "🛡️ Module Isolated Failure in [$compName]$loc: ${e.message}", e)
            TextView(ctx).apply {
                text = "⚠️ [$compName Failed$loc]\n${e.message}"
                setTextColor(Color.parseColor("#ef4444")) // Red warning text
                setBackgroundColor(Color.parseColor("#fee2e2")) // Light red background
                textSize = 11f
                setPadding(dp(8), dp(6), dp(8), dp(6))
            }
        }

        // Apply explicit size if provided
        applySize(view, sizeStr)

        if ((sig and 0x04) != 0) {
            applyCustomBorder(view, borderStr)
        }

        // APPLY DYNAMIC BINDINGS
        if (dynamicStr.isNotEmpty()) {
            val bindings = dynamicStr.split('|')
            var animSpec: DolphinStateEngine.AnimSpec? = null
            bindings.forEach { binding ->
                val parts = binding.split(":", limit = 2)
                if (parts.size == 2 && parts[0] == "__anim") {
                    animSpec = DolphinStateEngine.parseAnimSpec(parts[1])
                }
            }

            bindings.forEach { binding ->
                val parts = binding.split(":", limit = 2)
                if (parts.size == 2) {
                    val propName = parts[0]
                    val stateKey = parts[1]

                    if (propName == "__anim") return@forEach

                    val property = when (propName) {
                        "bgShade" -> DolphinStateEngine.Property.BG_SHADE
                        "alpha" -> DolphinStateEngine.Property.ALPHA
                        "textSize" -> DolphinStateEngine.Property.TEXT_SIZE
                        "width" -> DolphinStateEngine.Property.WIDTH
                        "height" -> DolphinStateEngine.Property.HEIGHT
                        "padding" -> DolphinStateEngine.Property.PADDING
                        "radius" -> DolphinStateEngine.Property.RADIUS
                        "translateX", "x", "shiftX" -> DolphinStateEngine.Property.TRANSLATE_X
                        "translateY", "y", "shiftY" -> DolphinStateEngine.Property.TRANSLATE_Y
                        "scale", "zoom" -> DolphinStateEngine.Property.SCALE
                        "scaleX" -> DolphinStateEngine.Property.SCALE_X
                        "scaleY" -> DolphinStateEngine.Property.SCALE_Y
                        "rotation", "rotate" -> DolphinStateEngine.Property.ROTATION
                        "elevation" -> DolphinStateEngine.Property.ELEVATION
                        "textColor" -> DolphinStateEngine.Property.TEXT
                        "src", "url" -> DolphinStateEngine.Property.IMAGE
                        else -> null
                    }

                    if (property != null) {
                        val colorCode = if (property == DolphinStateEngine.Property.BG_SHADE) (bin[3].toInt() and 0xFF) else 0
                        DolphinStateEngine.bind(key = stateKey, view = view, property = property, colorCode = colorCode, anim = animSpec)
                    }
                }
            }
        }

        if (gradStr.isNotEmpty()) {
            val targetView = if (view is MaterialCardView && view.childCount > 0) {
                val inner = view.getChildAt(0)
                inner.setPadding(view.contentPaddingLeft, view.contentPaddingTop, view.contentPaddingRight, view.contentPaddingBottom)
                view.setContentPadding(0, 0, 0, 0)
                inner
            } else view

            if (view is com.google.android.material.button.MaterialButton) {
                view.backgroundTintList = null
            }

            GradientRenderer.apply(targetView, gradStr, bin[14].toInt() and 0xFF) { name, shade ->
                parseColor(mapColorNameToCode(name), shade)
            }
        }

        // APPLY ANIMATION
        if (animStr.isNotEmpty()) {
            AnimationEngine.apply(view, animStr)
        } else {
            AnimationEngine.applyBinary(view, sig, bin[12].toInt() and 0xFF)
        }

        // Track for targeted updates
        viewMap[currentGlobalIdx] = view
        return view
    }

    fun updateComponent(index: Int, binary: ByteArray, changedBytes: ByteArray? = null) {
        val view = viewMap[index] ?: return
        Log.d("DolphinView", "⚡ Targeted in-place update for component index: $index")
        
        (ctx as? Activity)?.runOnUiThread {
            val type = binary[1].toInt() and 0xFF
            // Skip applyStylesInPlace for TabBar (0x27) — TabBuilder manages its own compact padding
            if (type != 0x27) {
                applyStylesInPlace(view, binary, changedBytes)
            }
            if (view is TextView) applyTextStyles(view, binary)

            if (type == 0x27) { // TabBar (0x27)
                (componentBuilders[0x27] as? TabBuilder)?.applyHotPatchUpdate(this, binary)
            }
        }
    }

    fun updateScreenInPlace(screenName: String) {
        val bundle = this.bundle ?: return
        val screen = bundle.screens.firstOrNull { it.name.equals(screenName, ignoreCase = true) } ?: return

        data = screen.rawData
        dataIdx = 0

        Log.d("DolphinView", "⚡ In-place screen update for '$screenName' (${screen.componentCount} components)")

        for (i in 0 until screen.componentCount) {
            val compIdx = screen.componentOffset + i
            val bin = bundle.components.getOrNull(compIdx) ?: continue
            val type = bin[1].toInt() and 0xFF

            val sizeStr = nextStr()
            val sig = bin[bin.size - 1].toInt() and 0xFF
            val gradStr = if (sig and 0x01 != 0) nextStr() else ""
            val borderStr = if (sig and 0x04 != 0) nextStr() else ""
            val dynamicStr = if (sig and 0x08 != 0) nextStr() else ""
            val animStr = if (sig and 0x10 != 0) nextStr() else ""

            var updatedText: String? = null
            when (type) {
                0x16 -> { // Text (0x16) — 1 string
                    val rawContent = nextStr()
                    updatedText = if (rawContent.matches(Regex("^\\d+\\|\\d+\\|\\d+\\|\\d+$"))) "" else rawContent
                }
                0x10 -> { // Button (0x10) — 3 strings
                    val action = nextStr()
                    val textStr = nextStr()
                    val iconStr = nextStr()
                    updatedText = when {
                        textStr.isNotEmpty() -> textStr
                        action.isNotEmpty() -> action.removePrefix("nav:").removePrefix("tab:").removePrefix("app:")
                        else -> ""
                    }
                }
                0x1D -> { // Header (0x1D) — 2 strings
                    val action = nextStr()
                    val titleStr = nextStr()
                    updatedText = titleStr
                }
                0x17 -> { // Checkbox (0x17) — 2 strings
                    val stateKey = nextStr()
                    val label = nextStr()
                    if (label.isNotEmpty()) updatedText = label
                }
                0x1B -> { // RadioButton (0x1B) — 2 strings
                    val stateKey = nextStr()
                    val label = nextStr()
                    if (label.isNotEmpty()) updatedText = label
                }
                0x15 -> { // Switch (0x15) — 2 strings
                    val stateKey = nextStr()
                    val label = nextStr()
                    if (label.isNotEmpty()) updatedText = label
                }
                0x19 -> { // Select (0x19) — 3 strings
                    val stateKey = nextStr()
                    val label = nextStr()
                    val options = nextStr()
                    if (label.isNotEmpty()) updatedText = label
                }
                0x18 -> { // TextField (0x18) — 6 strings
                    val stateKey = nextStr()
                    val label = nextStr()
                    val hint = nextStr()
                    val typeStr = nextStr()
                    val variant = nextStr()
                    val iconStr = nextStr()
                    if (label.isNotEmpty()) updatedText = label
                }
                else -> {
                    // Container (0x12), Column (0x13), Row (0x14), Card (0x11), TabBar (0x27), Drawer (0x28), Image (0x1F), etc. — 1 string
                    val action = nextStr()
                }
            }

            val view = viewMap[compIdx]
            if (view != null) {
                // Skip applyStylesInPlace for TabBar — TabBuilder manages its own padding
                if (type != 0x27) {
                    applyStylesInPlace(view, bin)
                }
                if (view is TextView) {
                    applyTextStyles(view, bin)
                    if (updatedText != null && !updatedText.startsWith("stateKey:")) {
                        view.text = updatedText
                    }
                } else if (view is ViewGroup) {
                    // Update header/container title text if applicable
                    val titleTv = view.findViewWithTag<TextView>("HeaderTitle") ?: view.findViewById<TextView>(10002)
                    if (titleTv != null && updatedText != null) {
                        titleTv.text = updatedText
                    }
                }
                if (type == 0x27) { // TabBar (0x27)
                    (componentBuilders[0x27] as? TabBuilder)?.applyHotPatchUpdate(this, bin)
                }
            }
        }
    }

    fun dp(px: Int): Int {
        return (px * ctx.resources.displayMetrics.density).toInt()
    }

    fun nextStr(): String {
        if (dataIdx >= data.size) return ""
        val start = dataIdx
        while (dataIdx < data.size && data[dataIdx] != 0.toByte()) {
            dataIdx++
        }
        val len = dataIdx - start
        val s = if (len > 0) String(data, start, len) else ""
        if (dataIdx < data.size) dataIdx++
        return s
    }

    companion object {
        const val TITAN_SIZE = 24

        fun parseColor(colorCode: Int, shade: Int, isText: Boolean = false): Int {
            if (colorCode == 23) return Color.TRANSPARENT
            if (colorCode == 25) {
                return Color.argb(shade, 255, 255, 255)
            }
            
            val level = DolphinStateEngine.themeLevel
            val isDark = level > 128
            val isNeutral = (colorCode == 21 || colorCode == 22 || colorCode == 7)

            val effectiveShade = if (shade == 128 && isDark && isNeutral) {
                if (isText) 253 else 254
            } else shade

            val finalShade = when (effectiveShade) {
                254 -> level 
                253 -> 255 - level
                252 -> if (isDark) Math.max(128, level - 20) else Math.min(127, level + 15)
                else -> {
                    if (isDark && (isText || isNeutral) && shade != 0) 255 - effectiveShade else effectiveShade
                }
            }

            val base = when (colorCode) {
                1  -> Color.parseColor("#1a73e8")
                2  -> Color.parseColor("#16a34a")
                3  -> Color.parseColor("#4338ca")
                4  -> Color.parseColor("#e53935")
                5  -> Color.parseColor("#f4511e")
                6  -> Color.parseColor("#f59f00")
                7  -> Color.parseColor("#6b7280")
                8  -> Color.parseColor("#00897b")
                9  -> Color.BLACK
                10 -> Color.WHITE
                11 -> Color.parseColor("#0097a7")
                12 -> Color.parseColor("#d81b60")
                13 -> Color.parseColor("#8e24aa")
                14 -> Color.parseColor("#f9a825")
                15 -> Color.parseColor("#558b2f")
                16 -> Color.parseColor("#e91e63")
                17 -> Color.parseColor("#ab47bc")
                18 -> Color.parseColor("#5e35b1")
                19 -> Color.parseColor("#039be5")
                20 -> Color.parseColor("#455a64")
                21 -> Color.parseColor("#546e7a")
                22 -> Color.parseColor("#616161")
                23 -> Color.TRANSPARENT
                24 -> Color.parseColor("#558b2f")
                else -> Color.GRAY
            }

            val adjustedBase = when {
                isDark && (shade == 254 || effectiveShade == 254) -> Color.parseColor("#0f172a")
                isDark && shade == 252 -> Color.parseColor("#1e293b")
                isDark && isNeutral && !isText -> Color.parseColor("#1e293b")
                else -> base
            }

            return if (finalShade < 128) {
                val ratio = 1.0f - (finalShade / 128.0f)
                androidx.core.graphics.ColorUtils.blendARGB(adjustedBase, Color.WHITE, ratio * 0.72f)
            } else {
                val ratio = (finalShade - 128.0f) / 127.0f
                androidx.core.graphics.ColorUtils.blendARGB(adjustedBase, Color.BLACK, ratio * 0.72f)
            }
        }
    }
}
