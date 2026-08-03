package io.dolphin.runtime



import android.content.Context

import android.content.res.ColorStateList

import android.graphics.Color

import android.graphics.Typeface

import android.util.Log

import android.view.Gravity

import android.view.View

import android.view.ViewGroup

import android.widget.*

import android.graphics.drawable.GradientDrawable

import androidx.core.content.ContextCompat

import androidx.core.graphics.ColorUtils

import com.google.android.material.button.MaterialButton

import com.google.android.material.textfield.TextInputLayout

import android.app.Activity

import android.os.Build

import androidx.appcompat.app.AppCompatDelegate

import com.google.android.material.card.MaterialCardView

import com.google.android.material.switchmaterial.SwitchMaterial

import android.os.SystemClock

import androidx.core.view.ViewCompat



class ViewFactory(val ctx: Context) {
    private val initialStateMarker = "__DOLPHIN_INITIAL_STATE__:"
    init {
        DolphinStateEngine.imageLoader = { imageView, url ->
            loadImage(imageView, url)
        }
    }



    var comps: List<ByteArray> = emptyList()

    var compIdx = 0

    var data: ByteArray = byteArrayOf()

    var dataIdx = 0

    

    // Targeted Update Tracking

    var globalOffset = 0

    val viewMap = mutableMapOf<Int, View>()

    

    var onAction: ((action: String, value: Any?) -> Unit)? = null



    fun buildScreen(screen: DolphinScreen, allComponents: List<ByteArray>): View {

        comps = allComponents.subList(screen.componentOffset, screen.componentOffset + screen.componentCount)

        compIdx = 0

        data = screen.rawData

        dataIdx = 0

        

        globalOffset = screen.componentOffset

        viewMap.clear()

        

        Log.d("DolphinView", "Building: ${screen.name} with ${comps.size} components")
        applyEmbeddedInitialState()

        

        // Setup offline theme change listener

        DolphinStateEngine.onThemeChanged = { level ->

            Log.d("DolphinView", "🌓 Theme changed to $level, re-applying styles...")

            (ctx as? Activity)?.runOnUiThread {

                // Smooth transition for the whole screen

                val root = (viewMap[screen.componentOffset]?.parent as? ViewGroup) ?: (viewMap[screen.componentOffset] as? ViewGroup)

                if (root != null) {

                    val transition = android.transition.Fade().apply {
                        duration = 200
                    }

                    android.transition.TransitionManager.beginDelayedTransition(root, transition)

                }



                // Re-apply styles to all views using their original binaries

                for (idx in screen.componentOffset until (screen.componentOffset + screen.componentCount)) {

                    val view = viewMap[idx]

                    val binary = allComponents.getOrNull(idx)

                    if (view != null && binary != null) {

                        applyStyles(view, binary)

                        if (view is TextView) {

                            applyTextStyles(view, binary)

                        }

                        // Also update all child TextViews (e.g. AppBar title inside RelativeLayout)

                        if (view is ViewGroup) {

                            applyTextStylesToChildren(view, binary)

                        }

                        view.invalidate()

                    }

                }

            }

        }

        

        return try {

            val root = buildComp() ?: View(ctx)

            

            val rlp = root.layoutParams as? LinearLayout.LayoutParams
            Log.d("DolphinView", "Root view: ${root.javaClass.simpleName}, layoutParams: ${root.layoutParams?.javaClass?.simpleName}, weight: ${rlp?.weight}")

            if (root is LinearLayout || (rlp != null && rlp.weight > 0)) {
                root.layoutParams = ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
                return root
            }



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

        }

    }

    /**
     * The compiler appends the project's NanoStore defaults to a screen's string
     * pool. Register them before creating views so stateKey bindings mount with
     * the declared value instead of the generic fallback (usually 0).
     */
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

        val sig = bin[15].toInt() and 0xFF

        val gradStr = if (sig and 0x01 != 0) nextStr() else ""

        val borderStr = if (sig and 0x04 != 0) nextStr() else ""

        val dynamicStr = if (sig and 0x08 != 0) nextStr() else ""

        val animStr = if (sig and 0x10 != 0) nextStr() else ""



        // PLUGIN SYSTEM HOOK
        val plugin = io.dolphin.runtime.plugin.DolphinPluginRegistry.getPlugin(type.toByte())
        val view = if (plugin != null) {
            val pluginView = plugin.createView(ctx, bin, this)
            applyStyles(pluginView, bin)
            pluginView
        } else {
            when (type) {
                0x10 -> createButton(bin)

            0x11 -> createColumn(bin, true)  // Card

            0x12 -> createColumn(bin, false) // Container

            0x13 -> createColumn(bin, false) // Column

            0x14 -> createRow(bin)

            0x16 -> createText(bin)

            0x1D -> createAppBar(bin)

            0x1A -> createSwitch(bin)

            0x19 -> createSlider(bin)

            0x17 -> createImage(bin)

            0x23 -> createIcon(bin)

            0x23 -> createIcon(bin)

            0x1E -> createListView(bin)

            0x20 -> createHorizontalListView(bin)

            0x24 -> createViewPager(bin)

            0x22 -> createSimpleGrid(bin) // Grid

            0x18 -> createTextField(bin)

            0x1B -> createCheckbox(bin)

            0x1C -> createSelect(bin)

            0x1F -> createRadioButton(bin)

            0x40 -> createFileUpload(bin)

            0x32 -> createHardwareView(bin, "location")

            0x34 -> createHardwareView(bin, "haptics")

            0x35 -> createHardwareView(bin, "battery")

            0x36 -> createHardwareView(bin, "sensors")

            else -> createColumn(bin)
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

            // Optional lightweight animation spec for runtime bindings
            // Encoded as a special entry: "__anim:t=transform,d=300,e=in-out"
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

                        DolphinStateEngine.bind(stateKey, view, property, colorCode = colorCode, anim = animSpec)

                    }

                }

            }

        }

        

        if (gradStr.isNotEmpty()) {

            // Fix: For Cards, apply gradient to the inner layout, otherwise it won't show.

            // Move padding from Card to inner layout so the gradient fills the entire card area.

            val targetView = if (view is MaterialCardView && view.childCount > 0) {

                val inner = view.getChildAt(0)

                inner.setPadding(view.contentPaddingLeft, view.contentPaddingTop, view.contentPaddingRight, view.contentPaddingBottom)

                view.setContentPadding(0, 0, 0, 0)

                inner

            } else view

            

            // Fix: For MaterialButton, we MUST clear backgroundTintList to show a custom gradient background

            if (view is MaterialButton) {

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

            // Always check binary bits (Bit 4 of Signature) ONLY if no string-based animation

            // This prevents applyBinary from canceling the string-based animation

            AnimationEngine.applyBinary(view, sig, bin[12].toInt() and 0xFF)

        }

        

        // Track for targeted updates

        viewMap[currentGlobalIdx] = view

        

        return view

    }



    /**

     * Statelessly update a single component's style/state without re-rendering the whole screen.

     */

    fun updateComponent(index: Int, binary: ByteArray) {

        val view = viewMap[index] ?: return

        Log.d("DolphinView", "Targeted update for component index: $index")

        

        (ctx as? Activity)?.runOnUiThread {

            applyStyles(view, binary)

            if (view is TextView) applyTextStyles(view, binary)

            

            // Handle component-specific state updates (e.g. Switch state)

            val type = binary[1].toInt() and 0xFF

            if (type == 0x1A && view is SwitchMaterial) {

                // For switches, byte 14 usually holds the boolean state in our protocol

                // but currently it might be in an action. 

                // If we want state to be binary-driven, we'd read it here.

            }

            

            view.invalidate()

            view.requestLayout()

        }

    }



    fun loadImage(imageView: ImageView, url: String) {
        if (url.isEmpty()) return
        if (url.startsWith("http")) {
            Thread {
                try {
                    var currentUrl = url
                    var stream: java.io.InputStream? = null
                    var conn: java.net.HttpURLConnection? = null
                    var redirects = 0
                    
                    while (redirects < 5) {
                        val connection = java.net.URL(currentUrl).openConnection() as java.net.HttpURLConnection
                        connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                        connection.instanceFollowRedirects = true
                        connection.connectTimeout = 15000
                        connection.readTimeout = 15000
                        
                        if (connection is javax.net.ssl.HttpsURLConnection) {
                            try {
                                val trustAllCerts = arrayOf<javax.net.ssl.TrustManager>(
                                    object : javax.net.ssl.X509TrustManager {
                                        override fun getAcceptedIssuers(): Array<java.security.cert.X509Certificate>? = null
                                        override fun checkClientTrusted(certs: Array<java.security.cert.X509Certificate>?, authType: String?) {}
                                        override fun checkServerTrusted(certs: Array<java.security.cert.X509Certificate>?, authType: String?) {}
                                    }
                                )
                                val sc = javax.net.ssl.SSLContext.getInstance("SSL")
                                sc.init(null, trustAllCerts, java.security.SecureRandom())
                                connection.sslSocketFactory = sc.socketFactory
                                connection.hostnameVerifier = javax.net.ssl.HostnameVerifier { _, _ -> true }
                            } catch (e: Exception) {
                                Log.e("DolphinImage", "Failed to setup trust-all SSL", e)
                            }
                        }
                        
                        val status = connection.responseCode
                        if (status == 301 || status == 302 || status == 303 || status == 307 || status == 308) {
                            val newUrl = connection.getHeaderField("Location")
                            connection.disconnect()
                            if (newUrl != null) {
                                currentUrl = newUrl
                                redirects++
                                continue
                            }
                        }
                        
                        conn = connection
                        stream = connection.inputStream
                        break
                    }
                    
                    if (stream != null) {
                        val bytes = stream.readBytes()
                        val bitmap = android.graphics.BitmapFactory.decodeByteArray(bytes, 0, bytes.size)
                        (ctx as? Activity)?.runOnUiThread {
                            if (bitmap != null) {
                                imageView.setImageBitmap(bitmap)
                            } else {
                                Log.e("DolphinImage", "Decoded bitmap is null for url: $url")
                            }
                        }
                        stream.close()
                    }
                    conn?.disconnect()
                } catch (e: java.lang.Exception) {
                    Log.e("DolphinImage", "Failed to load image: $url", e)
                }
            }.start()
        } else if (url.startsWith("data:image/")) {
            try {
                val base64Data = url.substringAfter("base64,")
                val bytes = android.util.Base64.decode(base64Data, android.util.Base64.DEFAULT)
                val bitmap = android.graphics.BitmapFactory.decodeByteArray(bytes, 0, bytes.size)
                if (bitmap != null) {
                    imageView.setImageBitmap(bitmap)
                } else {
                    Log.e("DolphinImage", "Failed to decode base64 bitmap")
                }
            } catch (e: Exception) {
                Log.e("DolphinImage", "Error decoding base64 image: ${e.message}", e)
            }
        } else if (url.startsWith("file://")) {
            try {
                val filePath = url.removePrefix("file://")
                val bitmap = android.graphics.BitmapFactory.decodeFile(filePath)
                (ctx as? Activity)?.runOnUiThread {
                    if (bitmap != null) {
                        imageView.setImageBitmap(bitmap)
                    } else {
                        Log.e("DolphinImage", "Failed to decode local file: $filePath")
                    }
                }
            } catch (e: Exception) {
                Log.e("DolphinImage", "Error loading local file image: ${e.message}", e)
            }
        } else if (url.startsWith("system:icon:")) {
            val iconName = url.removePrefix("system:icon:")
            var resId = 0
            try {
                val clazz = Class.forName("android.R\$drawable")
                val field = clazz.getField(iconName)
                resId = field.getInt(null)
            } catch (e: Exception) {
                resId = when {
                    iconName.contains("add") || iconName.contains("plus") -> android.R.drawable.ic_menu_add
                    iconName.contains("share") -> android.R.drawable.ic_menu_share
                    iconName.contains("save") || iconName.contains("disk") -> android.R.drawable.ic_menu_save
                    iconName.contains("rotate") || iconName.contains("refresh") || iconName.contains("sync") || iconName.contains("revert") -> android.R.drawable.ic_menu_revert
                    iconName.contains("view") || iconName.contains("preview") || iconName.contains("eye") -> android.R.drawable.ic_menu_view
                    iconName.contains("close") || iconName.contains("cancel") || iconName.contains("clear") -> android.R.drawable.ic_menu_close_clear_cancel
                    iconName.contains("person") || iconName.contains("user") -> android.R.drawable.ic_menu_view
                    iconName.contains("email") || iconName.contains("envelope") -> android.R.drawable.ic_dialog_email
                    iconName.contains("lock") || iconName.contains("key") -> android.R.drawable.ic_lock_idle_lock
                    iconName.contains("camera") -> android.R.drawable.ic_menu_camera
                    iconName.contains("upload") -> android.R.drawable.ic_menu_upload
                    iconName.contains("delete") || iconName.contains("trash") -> android.R.drawable.ic_menu_delete
                    iconName.contains("edit") -> android.R.drawable.ic_menu_edit
                    iconName.contains("search") -> android.R.drawable.ic_menu_search
                    iconName.contains("info") -> android.R.drawable.ic_dialog_info
                    else -> android.R.drawable.ic_menu_help
                }
            }
            imageView.setImageResource(resId)
            imageView.layoutParams.width = dp(24)
            imageView.layoutParams.height = dp(24)
            imageView.setColorFilter(Color.GRAY)
        } else {
            Thread {
                try {
                    val cleanPath = url.trim().removePrefix("/").removePrefix("./")
                    var bitmap: android.graphics.Bitmap? = null
                    try {
                        val isStr = ctx.assets.open(cleanPath)
                        bitmap = android.graphics.BitmapFactory.decodeStream(isStr)
                        isStr.close()
                    } catch (e: Exception) {
                        try {
                            val isStr = ctx.assets.open("icons/$cleanPath")
                            bitmap = android.graphics.BitmapFactory.decodeStream(isStr)
                            isStr.close()
                        } catch (e2: Exception) {}
                    }
                    
                    if (bitmap == null && !HotPatchClient.activeHost.isNullOrEmpty()) {
                        val devUrl = "http://${HotPatchClient.activeHost}:${HotPatchClient.activeHttpPort}/${cleanPath}"
                        val conn = java.net.URL(devUrl).openConnection() as java.net.HttpURLConnection
                        conn.connectTimeout = 5000
                        conn.readTimeout = 5000
                        if (conn.responseCode == 200) {
                            val isStr = conn.inputStream
                            val bytes = isStr.readBytes()
                            bitmap = android.graphics.BitmapFactory.decodeByteArray(bytes, 0, bytes.size)
                            isStr.close()
                        }
                        conn.disconnect()
                    }
                    
                    if (bitmap != null) {
                        val finalBmp = bitmap
                        (ctx as? Activity)?.runOnUiThread {
                            imageView.setImageBitmap(finalBmp)
                            imageView.requestLayout()
                            imageView.invalidate()
                        }
                    } else {
                        Log.e("DolphinImage", "Could not load relative image: $url")
                    }
                } catch (e: Exception) {
                    Log.e("DolphinImage", "Error loading relative image: $url", e)
                }
            }.start()
        }
    }

    fun createImage(bin: ByteArray): View {
        val imageView = ImageView(ctx).apply {
            scaleType = ImageView.ScaleType.CENTER_CROP
            adjustViewBounds = true
        }
        applyStyles(imageView, bin)
        val url = nextStr() // string 1: image url (read AFTER applyStyles consumes metadata strings)
        var lp = imageView.layoutParams
        if (lp == null) {
            lp = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(200))
        } else if (lp.height == ViewGroup.LayoutParams.WRAP_CONTENT || lp.height <= 0) {
            lp.height = dp(200)
        }
        imageView.layoutParams = lp
        loadImage(imageView, url)
        return imageView
    }

    fun getSystemIcon(iconName: String): Int {
        return try {
            when {
                iconName.contains("add") || iconName.contains("plus") -> android.R.drawable.ic_menu_add
                iconName.contains("share") -> android.R.drawable.ic_menu_share
                iconName.contains("save") || iconName.contains("disk") -> android.R.drawable.ic_menu_save
                iconName.contains("rotate") || iconName.contains("refresh") || iconName.contains("sync") -> android.R.drawable.ic_menu_manage
                iconName.contains("view") || iconName.contains("preview") || iconName.contains("eye") -> android.R.drawable.ic_menu_view
                iconName.contains("close") || iconName.contains("cancel") || iconName.contains("clear") -> android.R.drawable.ic_menu_close_clear_cancel
                iconName.contains("person") || iconName.contains("user") -> android.R.drawable.ic_menu_my_calendar
                iconName.contains("email") || iconName.contains("envelope") || iconName.contains("mail") -> android.R.drawable.ic_dialog_email
                iconName.contains("lock") || iconName.contains("key") || iconName.contains("password") || iconName.contains("secure") -> android.R.drawable.ic_dialog_alert
                iconName.contains("camera") -> android.R.drawable.ic_menu_camera
                iconName.contains("upload") -> android.R.drawable.ic_menu_upload
                iconName.contains("delete") || iconName.contains("trash") -> android.R.drawable.ic_menu_delete
                iconName.contains("edit") -> android.R.drawable.ic_menu_edit
                iconName.contains("search") -> android.R.drawable.ic_menu_search
                iconName.contains("info") -> android.R.drawable.ic_dialog_info
                iconName.contains("help") -> android.R.drawable.ic_dialog_alert
                else -> android.R.drawable.ic_menu_more
            }
        } catch (e: Exception) { 0 }
    }



    fun applySize(v: View, sizeStr: String) {

        val parts = sizeStr.split('|')

        if (parts.size < 2) return

        val w = parts[0].toIntOrNull() ?: 0

        val h = parts[1].toIntOrNull() ?: 0

        val elevation = if (parts.size > 2) parts[2].toIntOrNull() ?: -1 else -1

        val fontSize = if (parts.size > 3) parts[3].toIntOrNull() ?: 0 else 0

        

        if (fontSize > 0 && v is TextView) {

            v.textSize = fontSize.toFloat()

        }

        

        if (w != 0 || h != 0) {

            var lp = v.layoutParams

            if (lp == null) {

                lp = LinearLayout.LayoutParams(

                    if (w == -1) ViewGroup.LayoutParams.MATCH_PARENT else ViewGroup.LayoutParams.WRAP_CONTENT,

                    if (h == -1) ViewGroup.LayoutParams.MATCH_PARENT else ViewGroup.LayoutParams.WRAP_CONTENT

                )

            }

            if (w == -1) lp.width = ViewGroup.LayoutParams.MATCH_PARENT

            else if (w > 0) lp.width = dp(w)

            

            // Only update height if NOT a weight-based layout (flex-1 / weight > 0).
            // If weight > 0, the height must stay at 0 for LinearLayout weight to work.
            val isWeighted = lp is LinearLayout.LayoutParams && (lp as LinearLayout.LayoutParams).weight > 0f

            if (!isWeighted) {
                if (h == -1) lp.height = ViewGroup.LayoutParams.MATCH_PARENT
                else if (h > 0) lp.height = dp(h)
            }

            v.layoutParams = lp

        }



        if (elevation >= 0) {

            if (v is MaterialCardView) {

                v.cardElevation = dp(elevation).toFloat()

                v.maxCardElevation = dp(elevation + 2).toFloat()

            } else {

                v.elevation = dp(elevation).toFloat()

            }

        }

    }


    fun createTextField(bin: ByteArray): View {
        val stateKey = nextStr()   // string 1: stateKey
        val label    = nextStr()   // string 2: label
        val hint     = nextStr()   // string 3: hint
        val typeStr  = nextStr()   // string 4: input type
        val variant  = nextStr()   // string 5: variant (outlined, filled, standard)
        val iconName = nextStr()   // string 6: icon
        
        val hasBorder = (bin[15].toInt() and 0x04) != 0
        val parts = iconName.split("|")
        val iconResId = if (parts.size > 0 && parts[0].isNotEmpty()) getSystemIcon(parts[0]) else 0
        val endIconResId = if (parts.size > 1 && parts[1].isNotEmpty()) getSystemIcon(parts[1]) else 0
        
        val iconColorStr = if (parts.size > 2) parts[2] else ""
        val endIconColorStr = if (parts.size > 3) parts[3] else ""
        val iconSizeDp = if (parts.size > 4) (parts[4].toIntOrNull() ?: 24) else 24
               val view = DolphinFormEngine.createTextField(
            ctx, label, stateKey, hint, typeStr, onAction, hasBorder, variant,
            iconResId, endIconResId, iconColorStr, endIconColorStr, iconSizeDp, iconName
        )
        // ⚠️ Do NOT call applyStyles on TextInputLayout — it overrides MATCH_PARENT
        // with WRAP_CONTENT making the field invisible. Set layout directly.
        view.layoutParams = LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        ).apply {
            val mt = bin[8].toInt() and 0xFF
            val mr = bin[9].toInt() and 0xFF
            val mb = bin[10].toInt() and 0xFF
            val ml = bin[11].toInt() and 0xFF
            setMargins(dp(ml), dp(mt), dp(mr), dp(mb))
        }
        return view
    }



    fun createAppBar(bin: ByteArray): View {

        val action = nextStr()

        val title = nextStr()

        

        val layout = RelativeLayout(ctx).apply {

            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(56))

            

            val tv = TextView(ctx).apply {

                text = title
                textSize = 18f
                setTypeface(null, Typeface.BOLD)

                val lp = RelativeLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT)
                lp.addRule(RelativeLayout.CENTER_VERTICAL)
                lp.addRule(RelativeLayout.ALIGN_PARENT_START)
                lp.leftMargin = dp(16)
                layoutParams = lp

            }

            

            if (action.isNotEmpty()) {

                val btn = ImageButton(ctx).apply {

                    setBackgroundColor(Color.TRANSPARENT)

                    val lp = RelativeLayout.LayoutParams(dp(48), dp(48))

                    lp.addRule(RelativeLayout.CENTER_VERTICAL)



                    if (action == "drawer:open") {

                        // Menu icon on the LEFT

                        setImageResource(android.R.drawable.ic_menu_info_details) // Better than nothing

                        lp.addRule(RelativeLayout.ALIGN_PARENT_START)

                        tv.setPadding(dp(56), 0, 0, 0)

                    } else {

                        // Back button on the RIGHT (User requested)

                        setImageResource(android.R.drawable.ic_menu_revert)

                        lp.addRule(RelativeLayout.ALIGN_PARENT_END)

                        tv.setPadding(0, 0, dp(56), 0)

                    }



                    layoutParams = lp

                    setOnClickListener { onAction?.invoke(action, "AppBarBtn") }

                }

                addView(btn)

            }

            

            addView(tv)

            applyStyles(this, bin)



            val colorCode = bin[13].toInt() and 0xFF

            if (colorCode != 0) {

                applyTextStyles(tv, bin)

            } else {

                tv.setTextColor(parseColor(1, 253))

            }



            if (action.isNotEmpty()) {

                setOnClickListener { onAction?.invoke(action, title) }

            }

        }

        return layout

    }











    fun applyTextStyles(v: TextView, bin: ByteArray) {

        val colorCode = bin[13].toInt() and 0xFF

        val colorShade = bin[12].toInt() and 0x1F // Extract shade bits (0-31)

        

        if (colorCode != 0) {

            // Sentinel Mapping (5-bit to 8-bit)

            // 31 -> 254 (BG)

            // 30 -> 253 (Text)

            // 29 -> 252 (Card)

            val finalShade = when (colorShade) {

                31 -> 254

                30 -> 253

                29 -> 252

                else -> colorShade * 8

            }

            val textColor = parseColor(colorCode, finalShade)

            if (textColor != 0) v.setTextColor(textColor)

        } else {
            val hasBg = (bin[3].toInt() and 0xFF) != 0
            if (hasBg) {
                v.setTextColor(Color.WHITE)
            } else {
                val isDark = DolphinStateEngine.themeLevel > 128
                v.setTextColor(if (isDark) Color.WHITE else Color.parseColor("#0f172a"))
            }
        }

    }



    fun createText(bin: ByteArray): View {
        val content = nextStr()

        val view = TextView(ctx).apply {
            var targetKey: String? = null
            var defaultText: String = content

            if (content.startsWith("stateKey:")) {
                val key = content.removePrefix("stateKey:")
                defaultText = key.substringAfterLast("|", "")
                targetKey   = key.substringBeforeLast("|")
            } else if (content.contains("[stateKey:")) {
                val match = Regex("\\[stateKey:([a-zA-Z0-9_$]+)\\]").find(content)
                if (match != null) {
                    targetKey = match.groupValues[1]
                }
            }

            if (targetKey != null && targetKey.isNotEmpty()) {
                DolphinStateEngine.bind(targetKey, this, defaultText)
            } else {
                text = content
            }

            textSize = 16f
            applyStyles(this, bin)
            applyTextStyles(this, bin)
        }

        return view

    }



    private var cdnIconMap: Map<String, String>? = null
    private var cdnTypeface: android.graphics.Typeface? = null
    private var cdnIconLoaded = false

    private fun loadCdnIconAssets(ctx: Context) {
        if (cdnIconLoaded) return
        cdnIconLoaded = true
        try {
            val assetManager = ctx.assets
            val list = assetManager.list("icons") ?: emptyArray()
            if (list.contains("icon-map.json")) {
                val jsonStr = assetManager.open("icons/icon-map.json").bufferedReader().use { it.readText() }
                val jsonObj = org.json.JSONObject(jsonStr)
                val map = mutableMapOf<String, String>()
                val keys = jsonObj.keys()
                while (keys.hasNext()) {
                    val k = keys.next()
                    map[k] = jsonObj.getString(k)
                }
                cdnIconMap = map
            }
            val fontFileName = list.find { it.startsWith("icon-font") }
            if (fontFileName != null) {
                val fontFile = java.io.File(ctx.cacheDir, fontFileName)
                assetManager.open("icons/$fontFileName").use { input ->
                    java.io.FileOutputStream(fontFile).use { output -> input.copyTo(output) }
                }
                cdnTypeface = android.graphics.Typeface.createFromFile(fontFile)
            }
        } catch (e: Exception) { /* ignore CDN load error */ }
    }

    fun getDynamicIconDrawable(ctx: Context, iconName: String, color: Int = Color.WHITE): android.graphics.drawable.Drawable {
        loadCdnIconAssets(ctx)

        val density = ctx.resources.displayMetrics.density
        val size = (32 * density).toInt()
        val bitmap = android.graphics.Bitmap.createBitmap(size, size, android.graphics.Bitmap.Config.ARGB_8888)
        val canvas = android.graphics.Canvas(bitmap)

        val trimmed = iconName.trim()
        val cleanName = trimmed.replace(Regex("^(fa-(solid|regular|brands|light|duotone)-?|fa-|icon-)"), "").trim()
        
        val hardcodedMap = mapOf(
            "house" to "f015", "home" to "f015",
            "user" to "f007", "profile" to "f007",
            "bars" to "f0c9", "menu" to "f0c9", "navicon" to "f0c9",
            "gas-pump" to "f52f", "gas" to "f52f", "pump" to "f52f", "fuel" to "f52f", "car" to "f1b9",
            "mobile-screen" to "f3cf", "mobile" to "f3cf", "phone" to "f095",
            "file-lines" to "f15c", "file" to "f15b", "document" to "f15b", "form" to "f15c",
            "circle-info" to "f05a", "info" to "f05a", "about" to "f05a",
            "droplet" to "f043", "drop" to "f043", "water" to "f043",
            "bolt" to "f0e7", "flash" to "f0e7",
            "camera" to "f030", "wifi" to "f1eb", "lightbulb" to "f0eb", "torch" to "f0eb",
            "location-dot" to "f3c5", "gps" to "f3c5",
            "battery-full" to "f240", "battery" to "f240",
            "address-book" to "f2b9", "contacts" to "f2b9",
            "sliders" to "f1de", "check" to "f00c", "rotate" to "f01e"
        )

        val hexUnicode = cdnIconMap?.get(trimmed)
                      ?: cdnIconMap?.get(cleanName)
                      ?: cdnIconMap?.get("fa-$cleanName")
                      ?: hardcodedMap[cleanName]

        if (hexUnicode != null && cdnTypeface != null) {
            try {
                val codePoint = hexUnicode.toInt(16)
                val glyphStr = String(Character.toChars(codePoint))
                val paint = android.graphics.Paint(android.graphics.Paint.ANTI_ALIAS_FLAG).apply {
                    this.color = color
                    this.typeface = cdnTypeface
                    this.textSize = 24f * density
                    this.textAlign = android.graphics.Paint.Align.CENTER
                }
                val cy = (size / 2f) - ((paint.descent() + paint.ascent()) / 2f)
                canvas.drawText(glyphStr, size / 2f, cy, paint)
                return android.graphics.drawable.BitmapDrawable(ctx.resources, bitmap)
            } catch (e: Exception) { /* fallback to vector */ }
        }

        val paint = android.graphics.Paint(android.graphics.Paint.ANTI_ALIAS_FLAG).apply {
            this.color = color
            this.style = android.graphics.Paint.Style.FILL_AND_STROKE
            this.strokeWidth = 2.5f * density
        }
        val cx = size / 2f
        val cy = size / 2f
        val r = size / 2f - 4f
        val lower = cleanName.lowercase()

        when {
            lower.contains("gas") || lower.contains("pump") || lower.contains("fuel") -> {
                // Vector Gas Pump Icon
                val body = android.graphics.RectF(cx - r * 0.5f, cy - r * 0.6f, cx + r * 0.2f, cy + r * 0.7f)
                canvas.drawRoundRect(body, 4f * density, 4f * density, paint)
                val hose = android.graphics.Path()
                hose.moveTo(cx + r * 0.2f, cy - r * 0.2f)
                hose.lineTo(cx + r * 0.6f, cy - r * 0.2f)
                hose.lineTo(cx + r * 0.6f, cy + r * 0.4f)
                canvas.drawPath(hose, paint)
            }
            lower.contains("file") || lower.contains("form") || lower.contains("document") -> {
                // Vector Document Icon
                val doc = android.graphics.RectF(cx - r * 0.5f, cy - r * 0.7f, cx + r * 0.5f, cy + r * 0.7f)
                canvas.drawRoundRect(doc, 4f * density, 4f * density, paint)
                canvas.drawLine(cx - r * 0.3f, cy - r * 0.3f, cx + r * 0.3f, cy - r * 0.3f, paint)
                canvas.drawLine(cx - r * 0.3f, cy, cx + r * 0.3f, cy, paint)
                canvas.drawLine(cx - r * 0.3f, cy + r * 0.3f, cx + r * 0.1f, cy + r * 0.3f, paint)
            }
            lower.contains("phone") || lower.contains("mobile") || lower.contains("screen") -> {
                // Vector Mobile Screen Icon
                val phone = android.graphics.RectF(cx - r * 0.4f, cy - r * 0.75f, cx + r * 0.4f, cy + r * 0.75f)
                canvas.drawRoundRect(phone, 6f * density, 6f * density, paint)
            }
            lower.contains("house") || lower.contains("home") -> {
                val path = android.graphics.Path()
                path.moveTo(cx, cy - r * 0.7f)
                path.lineTo(cx + r * 0.7f, cy + r * 0.1f)
                path.lineTo(cx + r * 0.5f, cy + r * 0.1f)
                path.lineTo(cx + r * 0.5f, cy + r * 0.7f)
                path.lineTo(cx - r * 0.5f, cy + r * 0.7f)
                path.lineTo(cx - r * 0.5f, cy + r * 0.1f)
                path.lineTo(cx - r * 0.7f, cy + r * 0.1f)
                path.close()
                canvas.drawPath(path, paint)
            }
            lower.contains("user") || lower.contains("profile") || lower.contains("person") -> {
                canvas.drawCircle(cx, cy - r * 0.35f, r * 0.35f, paint)
                val rectF = android.graphics.RectF(cx - r * 0.6f, cy, cx + r * 0.6f, cy + r * 0.8f)
                canvas.drawArc(rectF, 180f, 180f, true, paint)
            }
            lower.contains("heart") -> {
                val path = android.graphics.Path()
                path.moveTo(cx, cy + r * 0.7f)
                path.cubicTo(cx - r, cy, cx - r * 0.5f, cy - r * 0.7f, cx, cy - r * 0.3f)
                path.cubicTo(cx + r * 0.5f, cy - r * 0.7f, cx + r, cy, cx, cy + r * 0.7f)
                path.close()
                canvas.drawPath(path, paint)
            }
            lower.contains("star") -> {
                val path = android.graphics.Path()
                val outer = r * 0.8f
                val inner = r * 0.35f
                for (i in 0 until 5) {
                    val angleOuter = Math.toRadians((i * 72 - 90).toDouble())
                    val xO = cx + (outer * Math.cos(angleOuter)).toFloat()
                    val yO = cy + (outer * Math.sin(angleOuter)).toFloat()
                    if (i == 0) path.moveTo(xO, yO) else path.lineTo(xO, yO)

                    val angleInner = Math.toRadians((i * 72 + 36 - 90).toDouble())
                    val xI = cx + (inner * Math.cos(angleInner)).toFloat()
                    val yI = cy + (inner * Math.sin(angleInner)).toFloat()
                    path.lineTo(xI, yI)
                }
                path.close()
                canvas.drawPath(path, paint)
            }
            lower.contains("bell") -> {
                canvas.drawCircle(cx, cy - r * 0.1f, r * 0.45f, paint)
                canvas.drawCircle(cx, cy + r * 0.55f, r * 0.15f, paint)
            }
            lower.contains("gear") || lower.contains("cog") || lower.contains("settings") -> {
                canvas.drawCircle(cx, cy, r * 0.6f, paint)
                paint.style = android.graphics.Paint.Style.STROKE
                canvas.drawCircle(cx, cy, r * 0.25f, paint)
            }
            lower.contains("trash") -> {
                canvas.drawRect(cx - r * 0.45f, cy - r * 0.2f, cx + r * 0.45f, cy + r * 0.6f, paint)
                canvas.drawLine(cx - r * 0.6f, cy - r * 0.3f, cx + r * 0.6f, cy - r * 0.3f, paint)
            }
            lower.contains("check") -> {
                canvas.drawLine(cx - r * 0.5f, cy, cx - r * 0.1f, cy + r * 0.4f, paint)
                canvas.drawLine(cx - r * 0.1f, cy + r * 0.4f, cx + r * 0.6f, cy - r * 0.4f, paint)
            }
            else -> {
                canvas.drawCircle(cx, cy, r * 0.7f, paint)
            }
        }
        return android.graphics.drawable.BitmapDrawable(ctx.resources, bitmap)
    }

    fun resolveColorFromBin(bin: ByteArray): Int {
        try {
            val colorCode = bin[13].toInt() and 0xFF
            val colorShade = bin[12].toInt() and 0x1F
            if (colorCode != 0) {
                val finalShade = when (colorShade) {
                    31 -> 254
                    30 -> 253
                    29 -> 252
                    else -> (colorShade * 255) / 31
                }
                return parseColor(colorCode, finalShade)
            }
        } catch (e: Exception) {}
        return 0
    }

    private fun createIcon(bin: ByteArray): View {
        val iconName = nextStr()
        val view = android.widget.ImageView(ctx)
        val iconSizeDp = dp(32)
        view.layoutParams = LinearLayout.LayoutParams(iconSizeDp, iconSizeDp)
        view.minimumWidth = iconSizeDp
        view.minimumHeight = iconSizeDp
        view.scaleType = android.widget.ImageView.ScaleType.FIT_CENTER
        view.adjustViewBounds = true
        val resolvedColor = resolveColorFromBin(bin)
        val iconColor = if (resolvedColor != 0) resolvedColor else Color.parseColor("#3B82F6")
        val drawable = getDynamicIconDrawable(ctx, iconName, iconColor)
        view.setImageDrawable(drawable)
        applyStyles(view, bin)
        return view
    }

    fun createButton(bin: ByteArray): View {
        var action = nextStr()
        var text = nextStr()
        var iconName = nextStr()

        if (action.isNotEmpty() && !action.contains(":") && text.isEmpty()) {
            text = action
            action = ""
        }
        return androidx.appcompat.widget.AppCompatButton(ctx).apply {
            minWidth = 0
            minHeight = 0
            setMinimumWidth(0)
            setMinimumHeight(0)
            this.text = text
            val gravCode = bin[0].toInt() and 0x0F
            this.gravity = when (gravCode) {
                0x01 -> Gravity.START or Gravity.CENTER_VERTICAL
                0x03 -> Gravity.END or Gravity.CENTER_VERTICAL
                else -> Gravity.CENTER // 0x02 or default -> CENTER!
            }
            this.isAllCaps = false
            this.textSize = 15f
            this.isClickable = true
            this.isFocusable = true
            this.backgroundTintList = null
            androidx.core.view.ViewCompat.setBackgroundTintList(this, null)
            
            if (iconName.isNotEmpty()) {
                try {
                    val resolvedColor = resolveColorFromBin(bin)
                    val iconColor = if (resolvedColor != 0) resolvedColor else Color.WHITE
                    val drawable = getDynamicIconDrawable(ctx, iconName, iconColor)
                    setCompoundDrawablesWithIntrinsicBounds(drawable, null, null, null)
                    compoundDrawablePadding = dp(8)
                } catch (e: Exception) { /* ignore icon errors */ }
            }

            

            applyStyles(this, bin)

            applyTextStyles(this, bin)

            

            setOnClickListener {

                // Try offline state engine first

                val handled = DolphinStateEngine.handleAction(action)

                if (!handled) {

                    if (action.startsWith("anim:")) {

                        val animName = action.substring(5)

                        AnimationEngine.apply(this, animName)

                    } else {

                        // Forward to server/MainActivity for nav: or custom actions

                        onAction?.invoke(action, text)

                    }

                } else if (action.startsWith("nav:")) {

                    // Even if handled by engine (returning true), we need to trigger navigation

                    onAction?.invoke(action, text)

                } else if (action.startsWith("alert:")) {
                    
                    // Show native Android AlertDialog
                    val message = action.substring(6)
                    val activity = ctx as? android.app.Activity
                    activity?.runOnUiThread {
                        android.app.AlertDialog.Builder(ctx)
                            .setTitle("Alert")
                            .setMessage(message)
                            .setPositiveButton("OK") { dialog, _ -> dialog.dismiss() }
                            .show()
                    }
                    
                }

            }

        }

    }



    fun createSwitch(bin: ByteArray): View {

        val actionOrState = nextStr()

        val label = nextStr()

        val initialChecked = (bin[14].toInt() and 0xFF) == 1

        return SwitchMaterial(ctx).apply {

            text = label

            // Avoid hardcoded native text color; choose based on themed background.

            setTextColor(contrastText(parseColor(bin[3].toInt() and 0xFF, bin[2].toInt() and 0xFF)))

            val currentState = DolphinStateEngine.get(actionOrState)

            isChecked = if (currentState != null) currentState.toString().toBoolean() else initialChecked

            

            applyStyles(this, bin)

            setOnCheckedChangeListener { _, checked -> 

                DolphinStateEngine.handleAction("$actionOrState:=$checked")

                onAction?.invoke(actionOrState, checked) 

            }

            if (actionOrState.isNotEmpty()) DolphinStateEngine.declareIfAbsent(actionOrState, isChecked)

        }

    }



    fun createSlider(bin: ByteArray): View {

        val actionOrState = nextStr()

        val label = nextStr()

        val initialValue = bin[14].toInt() and 0xFF



        val container = LinearLayout(ctx).apply {

            orientation = LinearLayout.VERTICAL

            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)

            setPadding(dp(16), dp(8), dp(16), dp(8))

            

            val tv = TextView(ctx).apply {

                text = label

                textSize = 14f

                // Avoid hardcoded native text color; choose based on themed background.

                setTextColor(contrastText(parseColor(bin[3].toInt() and 0xFF, bin[2].toInt() and 0xFF)))

            }

            addView(tv)

            

            val sb = SeekBar(ctx).apply {

                max = 255

                val currentState = DolphinStateEngine.get(actionOrState)

                progress = if (currentState != null) currentState.toString().toFloat().toInt() else initialValue



                // Make the slider track clearly visible in both light/dark backgrounds.

                try {

                    val accent = Color.parseColor("#3b82f6") // blue-500

                    val track  = Color.parseColor("#cbd5e1") // slate-300

                    progressTintList = ColorStateList.valueOf(accent)

                    progressBackgroundTintList = ColorStateList.valueOf(track)

                    thumbTintList = ColorStateList.valueOf(accent)

                } catch (_: Exception) {}

                // Ensure it has room to draw the track/thumb reliably

                minimumHeight = dp(24)

                ViewCompat.setPaddingRelative(this, paddingStart, paddingTop, paddingEnd, paddingBottom)

                

                // Throttle action spam for smoother live patching.

                var lastSentAt = 0L

                var pendingValue: Int? = null

                val sendIfDue = {

                    val p = pendingValue

                    val now = SystemClock.uptimeMillis()

                    if (p != null && (now - lastSentAt) >= 120) {

                        lastSentAt = now

                        pendingValue = null

                        DolphinStateEngine.handleAction("$actionOrState:=$p")

                        onAction?.invoke(actionOrState, p)

                    }

                }

                val sender = Runnable { sendIfDue() }



                setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {

                    override fun onProgressChanged(s: SeekBar?, p: Int, f: Boolean) {

                        tv.text = "$label: $p"

                        if (f) {

                            pendingValue = p

                            // coalesce updates; run immediately if due, otherwise schedule soon

                            removeCallbacks(sender)

                            postDelayed(sender, 60)

                            sendIfDue()

                        }

                    }

                    override fun onStartTrackingTouch(s: SeekBar?) {}

                    override fun onStopTrackingTouch(s: SeekBar?) {

                        pendingValue = s?.progress

                        removeCallbacks(sender)

                        sendIfDue()

                    }

                })

            }

            addView(sb)

            applyStyles(this, bin)

            if (actionOrState.isNotEmpty()) DolphinStateEngine.declareIfAbsent(actionOrState, sb.progress)

        }

        return container

    }



    fun createCheckbox(bin: ByteArray): View {

        val actionOrState = nextStr()

        val label = nextStr()

        val initialChecked = (bin[14].toInt() and 0xFF) == 1

        return com.google.android.material.checkbox.MaterialCheckBox(ctx).apply {

            text = label

            // Bootstrap-like blue tint

            buttonTintList = ColorStateList.valueOf(Color.parseColor("#3b82f6"))

            

            val level = DolphinStateEngine.themeLevel

            setTextColor(if (level > 128) Color.WHITE else Color.parseColor("#374151")) // Slate-700

            

            // Force wrap_content to avoid layout issues in rows

            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT)

            

            isFocusable = true

            isFocusableInTouchMode = true

            

            val currentState = DolphinStateEngine.get(actionOrState)

            isChecked = if (currentState != null) currentState.toString().toBoolean() else initialChecked

            

            applyStyles(this, bin)

            setOnCheckedChangeListener { _, checked -> 

                DolphinStateEngine.handleAction("$actionOrState:=$checked")

                onAction?.invoke(actionOrState, checked) 

            }

            if (actionOrState.isNotEmpty()) DolphinStateEngine.declareIfAbsent(actionOrState, isChecked)

        }

    }



    fun createRadioButton(bin: ByteArray): View {

        val actionOrState = nextStr()

        val label = nextStr()

        val initialChecked = (bin[14].toInt() and 0xFF) == 1

        return com.google.android.material.radiobutton.MaterialRadioButton(ctx).apply {

            text = label

            // Bootstrap-like blue tint

            buttonTintList = ColorStateList.valueOf(Color.parseColor("#3b82f6"))

            

            val level = DolphinStateEngine.themeLevel

            setTextColor(if (level > 128) Color.WHITE else Color.parseColor("#374151"))

            

            // Force wrap_content to avoid layout issues in rows

            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT)



            isFocusable = true

            isFocusableInTouchMode = true

            

            val currentState = DolphinStateEngine.get(actionOrState)

            isChecked = if (currentState != null) currentState.toString().toBoolean() else initialChecked

            

            applyStyles(this, bin)

            setOnClickListener {

                isChecked = true

                DolphinStateEngine.handleAction("$actionOrState:=true")

                onAction?.invoke(actionOrState, true)

            }

            if (actionOrState.isNotEmpty()) DolphinStateEngine.declareIfAbsent(actionOrState, isChecked)

        }

    }



    fun createSelect(bin: ByteArray): View {

        val actionOrState = nextStr()

        val label = nextStr()

        val optionsStr = nextStr()

        val initialValueStr = nextStr()



        val rawOptions = optionsStr.split(',').map { it.trim() }.filter { it.isNotEmpty() }

        val options = if (rawOptions.isEmpty()) listOf(label.ifEmpty { "Select Option" }) else rawOptions



        val level = DolphinStateEngine.themeLevel
        val isDark = level > 128
        val containerBg = if (isDark) Color.parseColor("#1e293b") else Color.WHITE
        val containerStroke = if (isDark) Color.parseColor("#334155") else Color.parseColor("#e5e7eb")
        val itemTextColor = if (isDark) Color.WHITE else Color.parseColor("#1e293b")
        val dropdownBg = if (isDark) Color.parseColor("#0f172a") else Color.WHITE
        val dropdownTextColor = if (isDark) Color.WHITE else Color.parseColor("#1e293b")

        val container = MaterialCardView(ctx).apply {
            tag = "SelectContainer"
            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(45))
            radius = dp(8).toFloat()
            cardElevation = 0f
            setCardBackgroundColor(containerBg)
            strokeWidth = dp(1)
            strokeColor = containerStroke
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                isForceDarkAllowed = false
            }
            
            val inner = RelativeLayout(ctx).apply {
                layoutParams = FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
                
                val spinner = Spinner(ctx, Spinner.MODE_DROPDOWN).apply {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                        isForceDarkAllowed = false
                    }
                    id = View.generateViewId()
                    val adapter = object : ArrayAdapter<String>(ctx, android.R.layout.simple_spinner_item, options) {
                        override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
                            val v = super.getView(position, convertView, parent)
                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                                v.isForceDarkAllowed = false
                            }
                            if (v is TextView) {
                                val currentLevel = DolphinStateEngine.themeLevel
                                val currentIsDark = currentLevel > 128
                                val currentItemTextColor = if (currentIsDark) Color.WHITE else Color.parseColor("#1e293b")
                                
                                v.setPadding(dp(12), dp(10), dp(40), dp(10)) // Keep padding
                                v.gravity = Gravity.CENTER_VERTICAL
                                v.setTextColor(currentItemTextColor)
                                v.textSize = 15f
                            }
                            return v
                        }
                        override fun getDropDownView(position: Int, convertView: View?, parent: ViewGroup): View {
                            val v = super.getDropDownView(position, convertView, parent)
                            val currentLevel = DolphinStateEngine.themeLevel
                            val currentIsDark = currentLevel > 128
                            val currentDropdownBg = if (currentIsDark) Color.parseColor("#0f172a") else Color.WHITE
                            val currentDropdownTextColor = if (currentIsDark) Color.WHITE else Color.parseColor("#1e293b")
                            
                            v.setBackgroundColor(currentDropdownBg)
                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                                v.isForceDarkAllowed = false
                            }
                            if (v is TextView) {
                                v.setPadding(dp(16), dp(12), dp(16), dp(12)) // Keep padding
                                v.setTextColor(currentDropdownTextColor)
                            }
                            return v
                        }
                    }
                    adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                    this.adapter = adapter
                    background = null
                    
                    val currentState = DolphinStateEngine.get(actionOrState)?.toString() ?: initialValueStr
                    val index = options.indexOf(currentState)
                    if (index >= 0) setSelection(index)

                    onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
                        override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                            val selected = options[position]
                            DolphinStateEngine.handleAction("$actionOrState:=$selected")
                            onAction?.invoke(actionOrState, selected)
                        }
                        override fun onNothingSelected(parent: AdapterView<*>?) {}
                    }
                }

                val arrow = ImageView(ctx).apply {
                    setImageResource(android.R.drawable.arrow_down_float)
                    setColorFilter(Color.GRAY)
                    val params = RelativeLayout.LayoutParams(dp(20), dp(20)).apply {
                        addRule(RelativeLayout.ALIGN_PARENT_RIGHT)
                        addRule(RelativeLayout.CENTER_VERTICAL)
                        rightMargin = dp(12)
                    }
                    layoutParams = params
                }

                addView(spinner, RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT))
                addView(arrow)
                
                // Allow clicking the arrow area to trigger the spinner
                setOnClickListener { spinner.performClick() }
            }
            
            addView(inner)
            applyStyles(this, bin)
        }
        
        return container



        val base = parseColor(bin[3].toInt() and 0xFF, bin[2].toInt() and 0xFF)

        val hasBorder = (bin[15].toInt() and 0x04) != 0

        val gd = GradientDrawable().apply {

            shape = GradientDrawable.RECTANGLE

            setColor(if (base != 0) base else Color.parseColor("#f9fafb"))

            if (hasBorder) {
                setStroke(dp(1), Color.parseColor("#e5e7eb"))
            } else {
                setStroke(0, Color.TRANSPARENT)
            }

            cornerRadius = dp(8).toFloat()

        }

        container.background = gd

        

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {

            container.clipToOutline = true

        }



        applyStyles(container, bin)

        return container

    }



    fun createFileUpload(bin: ByteArray): View {

        val action = nextStr()

        val label = nextStr()

        return com.google.android.material.button.MaterialButton(ctx).apply {

            // Use dark text color to be sure it's visible if bg is light

            text = if (label.isEmpty()) "Choose File" else label

            setTextColor(Color.parseColor("#374151")) // Dark gray text

            

            // Material styling

            icon = ContextCompat.getDrawable(ctx, android.R.drawable.ic_menu_upload)

            iconTint = ColorStateList.valueOf(Color.parseColor("#374151"))

            iconGravity = com.google.android.material.button.MaterialButton.ICON_GRAVITY_TEXT_START

            iconPadding = dp(8)

            

            // Light background (gray-100)

            backgroundTintList = ColorStateList.valueOf(Color.parseColor("#f3f4f6"))

            strokeColor = ColorStateList.valueOf(Color.parseColor("#d1d5db"))

            strokeWidth = dp(1)

            

            isAllCaps = false

            textSize = 14f

            

            isClickable = true

            isFocusable = true

            

            applyStyles(this, bin)

            

            setPadding(dp(16), dp(10), dp(16), dp(10))

            

            setOnClickListener {

                onAction?.invoke(if (action.isEmpty()) "file:picker" else action, "FILE_PICKER")

            }

        }

    }



    fun createHardwareView(bin: ByteArray, type: String): View {

        val stateKeyOrAction = nextStr()

        val config = nextStr() // e.g., "heavy", "light" for haptics



        when (type) {

            "haptics" -> {

                // Execute immediately on render, or bind to an action.

                // Usually Haptics should be triggered by an action via DolphinStateEngine interceptor, 

                // but if placed in UI, it triggers once.

                io.dolphin.runtime.hardware.DolphinHaptics.vibrate(ctx, config)

            }

            "location" -> {

                if (stateKeyOrAction.isNotEmpty()) {

                    io.dolphin.runtime.hardware.DolphinLocation.requestLocation(ctx, stateKeyOrAction)

                }

            }

        }

        

        // Return invisible zero-size view since these are hardware/background operations

        return View(ctx).apply { 

            layoutParams = ViewGroup.LayoutParams(0, 0) 

            visibility = View.GONE

        }

    }



    fun applyStyles(v: View, bin: ByteArray) {

        val mt = bin[8].toInt() and 0xFF

        val mr = bin[9].toInt() and 0xFF

        val mb = bin[10].toInt() and 0xFF

        val ml = bin[11].toInt() and 0xFF



        var lp = v.layoutParams

        if (lp == null) {

            val isFullWidthView = v is LinearLayout || v is MaterialCardView || v is EditText || v is FrameLayout

            val w = if (isFullWidthView) ViewGroup.LayoutParams.MATCH_PARENT else ViewGroup.LayoutParams.WRAP_CONTENT

            lp = LinearLayout.LayoutParams(w, ViewGroup.LayoutParams.WRAP_CONTENT)

        }

        

        if (lp is ViewGroup.MarginLayoutParams) {
            val left = if (ml > 0) dp(ml) else lp.leftMargin
            val top = if (mt > 0) dp(mt) else lp.topMargin
            val right = if (mr > 0) dp(mr) else lp.rightMargin
            val bottom = if (mb > 0) dp(mb) else lp.bottomMargin
            lp.setMargins(left, top, right, bottom)
        }

        v.layoutParams = lp



        // Flex (Weight) support
        val flex = (bin[0].toInt() shr 4) and 0x0F
        if (flex > 0 && lp is LinearLayout.LayoutParams) {
            lp.weight = flex.toFloat()
            // Keep width as MATCH_PARENT for vertical layouts so children do not shrink during hotpatching
            if (lp.width <= 0 && lp.width != ViewGroup.LayoutParams.MATCH_PARENT) {
                lp.width = ViewGroup.LayoutParams.MATCH_PARENT
            }
        }



        val base = parseColor(bin[3].toInt() and 0xFF, bin[2].toInt() and 0xFF)

        val hasBg = (bin[3].toInt() and 0xFF) != 0 // Color code 0 means no background

        val radiusVal = bin[14].toInt() and 0xFF

        val sig = bin[15].toInt() and 0xFF

        val hasBorder = (sig and 0x04) != 0 // Bit 2: Explicit Border flag

        

        if (v is MaterialCardView) {

            if (v.tag == "SelectContainer") {

                val level = DolphinStateEngine.themeLevel

                val isDark = level > 128

                val containerBg = if (isDark) Color.parseColor("#1e293b") else Color.WHITE

                val containerStroke = if (isDark) Color.parseColor("#334155") else Color.parseColor("#e5e7eb")

                

                v.setCardBackgroundColor(ColorStateList.valueOf(containerBg))

                v.strokeColor = containerStroke

                v.strokeWidth = dp(1)

                

                val inner = v.getChildAt(0) as? ViewGroup

                val spinner = inner?.getChildAt(0) as? Spinner

                if (spinner != null) {

                    val itemTextColor = if (isDark) Color.WHITE else Color.parseColor("#1e293b")
                    (spinner.adapter as? android.widget.ArrayAdapter<*>)?.notifyDataSetChanged()

                    for (i in 0 until spinner.childCount) {

                        val child = spinner.getChildAt(i)

                        if (child is TextView) {

                            child.setTextColor(itemTextColor)

                        }

                    }

                }

            } else {

                v.setCardBackgroundColor(ColorStateList.valueOf(base))

                if (radiusVal > 0) v.radius = dp(radiusVal).toFloat()

                

                // TOTAL LOCKDOWN: Only allow border if explicitly requested via protocol

                if (hasBorder) {

                    v.strokeWidth = dp(1)
                    val isDarkCard = DolphinStateEngine.themeLevel > 128
                    v.strokeColor = if (isDarkCard) Color.parseColor("#475569") else Color.parseColor("#cccccc") // dark: slate-600

                } else {

                    v.strokeWidth = 0

                    v.strokeColor = Color.TRANSPARENT

                }

            }

            

            v.cardElevation = 0f 

            v.maxCardElevation = 0f

            v.useCompatPadding = true

            v.preventCornerOverlap = true

            // Disable internal Material card stroke default behavior
            v.setContentPadding(0, 0, 0, 0)
            v.stateListAnimator = null

            // Add Ripple to Card

            val outValue = android.util.TypedValue()

            ctx.theme.resolveAttribute(android.R.attr.selectableItemBackground, outValue, true)

            v.foreground = ContextCompat.getDrawable(ctx, outValue.resourceId)

            v.isClickable = true

            v.isFocusable = true

        } else if (v is MaterialButton) {
            if (hasBg) {
                v.backgroundTintList = ColorStateList.valueOf(base)
                if (base == Color.TRANSPARENT) {
                    v.backgroundTintList = ColorStateList.valueOf(Color.TRANSPARENT)
                    v.background = null
                }
            } else {
                v.backgroundTintList = null
                v.background = null
            }

            if (radiusVal > 0) v.cornerRadius = dp(radiusVal)

            

            if (hasBorder) {
                v.strokeWidth = dp(1)
                val isDarkBtn = DolphinStateEngine.themeLevel > 128
                v.strokeColor = ColorStateList.valueOf(if (isDarkBtn) Color.parseColor("#475569") else Color.parseColor("#cccccc"))
            } else {
                v.strokeWidth = 0
                v.strokeColor = ColorStateList.valueOf(Color.TRANSPARENT)
            }
            
            v.insetTop = 0
            v.insetBottom = 0
            v.elevation = 0f
            v.stateListAnimator = null
        } else if (v is TextInputLayout || (v is LinearLayout && v.tag == "FormEngineRoot")) {
            if (v.tag == "FormEngineRoot") {
                val borderContainer = v.findViewWithTag<View>("FormBorderContainer")
                if (borderContainer != null) {
                    val radius = if (radiusVal > 0) radiusVal else 8
                    val borderGd = borderContainer.background as? GradientDrawable ?: GradientDrawable().apply {
                        shape = GradientDrawable.RECTANGLE
                        cornerRadius = dp(radius).toFloat()
                    }
                    if (hasBg) {
                        borderGd.setColor(base)
                    }
                    if (hasBorder) {
                        val level = DolphinStateEngine.themeLevel
                        val strokeColor = if (level > 128) Color.parseColor("#475569") else Color.parseColor("#d1d5db")
                        borderGd.setStroke(dp(1), strokeColor)
                    }
                    borderContainer.background = borderGd
                }
            }
        } else if (v is EditText || v is CheckBox || v is RadioButton || v is TextView || v is ViewGroup) {
            // Apply background if color is specified (even if transparent code 23)
            if (radiusVal > 0 || hasBorder) {
                val gd = android.graphics.drawable.GradientDrawable().apply {
                    shape = android.graphics.drawable.GradientDrawable.RECTANGLE
                    setColor(if (hasBg) base else Color.TRANSPARENT)
                    
                    // Apply dynamic mathematical geometric curves based on byte markers
                    if (radiusVal == 250) {
                        // 💬 Sent bubble: smooth except bottom-right
                        val smooth = dp(16).toFloat()
                        val sharp = dp(2).toFloat()
                        cornerRadii = floatArrayOf(
                            smooth, smooth, // Top-Left
                            smooth, smooth, // Top-Right
                            sharp, sharp,   // Bottom-Right
                            smooth, smooth  // Bottom-Left
                        )
                    } else if (radiusVal == 251) {
                        // 💬 Received bubble: smooth except bottom-left
                        val smooth = dp(16).toFloat()
                        val sharp = dp(2).toFloat()
                        cornerRadii = floatArrayOf(
                            smooth, smooth, // Top-Left
                            smooth, smooth, // Top-Right
                            smooth, smooth, // Bottom-Right
                            sharp, sharp    // Bottom-Left
                        )
                    } else if (radiusVal == 252) {
                        // 🍃 Leaf shape: diagonal sharp, diagonal smooth
                        val smooth = dp(24).toFloat()
                        val sharp = dp(4).toFloat()
                        cornerRadii = floatArrayOf(
                            smooth, smooth, // Top-Left
                            sharp, sharp,   // Top-Right
                            smooth, smooth, // Bottom-Right
                            sharp, sharp    // Bottom-Left
                        )
                    } else if (radiusVal == 254) {
                        // 💊 Capsule shape
                        val capsule = dp(50).toFloat()
                        cornerRadius = capsule
                    } else {
                        // Standard symmetric curve
                        cornerRadius = dp(radiusVal).toFloat()
                    }

                    if (hasBorder) {
                        val isDarkBorder = DolphinStateEngine.themeLevel > 128
                        val strokeColor = if (isDarkBorder) Color.parseColor("#475569") else Color.parseColor("#cccccc")
                        setStroke(dp(1), strokeColor)
                    } else {
                        setStroke(0, Color.TRANSPARENT)
                    }
                }
                v.background = gd
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    v.clipToOutline = true
                }
            } else if (hasBg) {
                val gd = android.graphics.drawable.GradientDrawable().apply {
                    setColor(base)
                    if (hasBorder) {
                        val isDarkBorder = DolphinStateEngine.themeLevel > 128
                        val strokeColor = if (isDarkBorder) Color.parseColor("#475569") else Color.parseColor("#cccccc")
                        setStroke(dp(1), strokeColor)
                    } else {
                        setStroke(0, Color.TRANSPARENT)
                    }
                }
                v.background = gd
            }

            

            if (v.isClickable) {

                val outValue = android.util.TypedValue()

                ctx.theme.resolveAttribute(android.R.attr.selectableItemBackground, outValue, true)

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {

                    v.foreground = ContextCompat.getDrawable(ctx, outValue.resourceId)

                } else {

                    // Fallback for older versions if needed, but foreground is safer for ripples

                }

            }

        }

        

        val pt = bin[4].toInt() and 0xFF

        val pr = bin[5].toInt() and 0xFF

        val pb = bin[6].toInt() and 0xFF

        val pl = bin[7].toInt() and 0xFF

        

        if (pt > 0 || pr > 0 || pb > 0 || pl > 0) {

            if (v is MaterialCardView) {

                v.setContentPadding(dp(pl), dp(pt), dp(pr), dp(pb))

            } else {

                v.setPadding(dp(pl), dp(pt), dp(pr), dp(pb))

            }

        }
        
        // Text Alignment (Byte 0, bits 0-3: gravity)
        // For TextView, Button, AppBar: apply text alignment
        if (v is TextView) {
            val gravity = bin[0].toInt() and 0x03
            when (gravity) {
                0x02 -> v.gravity = Gravity.CENTER_HORIZONTAL
                0x03 -> v.gravity = Gravity.END or Gravity.CENTER_VERTICAL
                else -> v.gravity = Gravity.START or Gravity.CENTER_VERTICAL
            }
        }

    }



    fun applyInputStyles(container: View, input: View, bin: ByteArray) {

        val mt = bin[8].toInt() and 0xFF

        val mr = bin[9].toInt() and 0xFF

        val mb = bin[10].toInt() and 0xFF

        val ml = bin[11].toInt() and 0xFF

        

        var lp = container.layoutParams

        if (lp == null) {

            lp = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)

        }

        if (lp is ViewGroup.MarginLayoutParams) {

            lp.setMargins(dp(ml), dp(mt), dp(mr), dp(mb))

        }

        

        val flex = (bin[0].toInt() shr 4) and 0x0F

        if (flex > 0 && lp is LinearLayout.LayoutParams) {

            lp.weight = flex.toFloat()

        }

        container.layoutParams = lp



        val base = parseColor(bin[3].toInt() and 0xFF, bin[2].toInt() and 0xFF)

        val bgColor = if (base != 0) base else Color.WHITE

        val radiusVal = bin[14].toInt() and 0xFF

        val cornerPx  = if (radiusVal > 0) dp(radiusVal).toFloat() else dp(8).toFloat()



        // ── Default border (Bootstrap gray-300) ──────────────────────────

        fun makeBorderDrawable(strokeColor: Int): android.graphics.drawable.GradientDrawable {

            val gd = android.graphics.drawable.GradientDrawable()

            gd.setColor(bgColor)

            gd.cornerRadius = cornerPx

            gd.setStroke(dp(1), strokeColor)

            return gd

        }



        val isDarkInputMode = DolphinStateEngine.themeLevel > 128
        val borderNormal = if (isDarkInputMode) Color.parseColor("#334155") else Color.parseColor("#e5e7eb")  // dark: slate-700, light: gray-200

        val borderFocus  = Color.parseColor("#3b82f6")  // Bootstrap blue

        

        if (container is TextInputLayout) {

            // Let TextInputLayout handle its own outlined/filled background

            // Just ensure the EditText inside it doesn't have its own underline

            input.background = null

        } else {

            container.background = makeBorderDrawable(borderNormal)

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {

                container.clipToOutline = true

            }

            input.background = null



            // ── ACTIVE RING: swap border color on focus ───────────────────────

            input.setOnFocusChangeListener { _, hasFocus ->

                container.background = makeBorderDrawable(

                    if (hasFocus) borderFocus else borderNormal

                )

            }

        }



        val pt = bin[4].toInt() and 0xFF

        val pr = bin[5].toInt() and 0xFF

        val pb = bin[6].toInt() and 0xFF

        val pl = bin[7].toInt() and 0xFF

        

        val padH = if (pl > 0 || pr > 0) 0 else dp(12)

        val padV = if (pt > 0 || pb > 0) 0 else dp(10)

        input.setPadding(

            if (pl > 0) dp(pl) else padH,

            if (pt > 0) dp(pt) else padV,

            if (pr > 0) dp(pr) else padH,

            if (pb > 0) dp(pb) else padV

        )

        

        val colorCode = bin[13].toInt() and 0xFF

        val colorShade = bin[12].toInt() and 0xFF

        if (colorCode != 0 && input is TextView) {

            val textColor = parseColor(colorCode, colorShade)

            if (textColor != 0) {

                input.setTextColor(textColor)

                input.setHintTextColor(ColorUtils.setAlphaComponent(textColor, 128))

            }

        } else if (input is TextView) {

            val isDarkMode = DolphinStateEngine.themeLevel > 128
            input.setTextColor(if (isDarkMode) Color.parseColor("#f1f5f9") else Color.parseColor("#111827"))   // auto light/dark
            input.setHintTextColor(if (isDarkMode) Color.parseColor("#64748b") else Color.parseColor("#9ca3af"))

        }

    }



    /**

     * Recursively re-applies theme-aware text color to all child TextViews inside a ViewGroup.

     * Used during theme change to update nested text (e.g. AppBar title inside RelativeLayout).

     * Uses sentinel 253 (theme-text-0) so color auto-inverts with the theme level.

     */

    fun applyTextStylesToChildren(parent: ViewGroup, bin: ByteArray) {

        for (i in 0 until parent.childCount) {

            val child = parent.getChildAt(i)

            if (child is TextView && child !is android.widget.Button && child !is android.widget.EditText) {

                // Re-apply using the same logic as applyTextStyles

                val colorCode = bin[13].toInt() and 0xFF

                if (colorCode != 0) {

                    applyTextStyles(child, bin)

                } else {

                    // Default: theme-text-0 sentinel (auto white/black based on theme)

                    child.setTextColor(parseColor(1, 253))

                }

            } else if (child is ViewGroup) {

                applyTextStylesToChildren(child, bin)

            }

        }

    }



    fun applyGravity(l: LinearLayout, bin: ByteArray) {

        val g = bin[0].toInt() and 0x0F

        if (g == 0 || g == 0xFF) return

        val isHorizontal = l.orientation == LinearLayout.HORIZONTAL

        l.gravity = when (g) {
            1 -> if (isHorizontal) Gravity.START or Gravity.CENTER_VERTICAL else Gravity.START
            // ⚠️ For vertical layouts, Gravity.CENTER shrinks child widths — use CENTER_VERTICAL only.
            // For horizontal layouts, CENTER is fine (children arrange side-by-side).
            2 -> if (isHorizontal) Gravity.CENTER else Gravity.CENTER_VERTICAL
            3 -> if (isHorizontal) Gravity.END or Gravity.CENTER_VERTICAL else Gravity.END or Gravity.CENTER_VERTICAL
            else -> Gravity.TOP or Gravity.START
        }

    }





    fun mapColorNameToCode(name: String): Int {
        if (name.startsWith("theme-")) return 1 // Theme colors use base 1 (White)
        return when (name.lowercase()) {
            "white" -> 10
            "black" -> 9
            "blue" -> 1
            "green" -> 2
            "indigo" -> 3
            "red" -> 4
            "orange" -> 5
            "amber" -> 6
            "gray" -> 7
            "teal" -> 8
            "cyan" -> 11
            "pink" -> 12
            "purple" -> 13
            "yellow" -> 14
            "lime" -> 15
            "rose" -> 16
            "fuchsia" -> 17
            "violet" -> 18
            "sky" -> 19
            "emerald" -> 20
            "slate" -> 21
            "zinc" -> 22
            "transparent" -> 23
            "darkblue" -> 24
            else -> 1
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

        if (dataIdx < data.size) dataIdx++ // Skip the null terminator

        return s

    }

    companion object {
        fun parseColor(colorCode: Int, shade: Int, isText: Boolean = false): Int {
            if (colorCode == 23) return Color.TRANSPARENT
            if (colorCode == 25) {
                return Color.argb(shade, 255, 255, 255)
            }
            
            val level = DolphinStateEngine.themeLevel
            val isDark = level > 128
            
            // Neutral color check for automatic theme adaptation (Auto-Dark)
            // Only slate/zinc/gray are true neutral theme-adaptive colors.
            // White (10) and Black (9) are EXPLICIT colors and must NEVER be auto-inverted.
            val isNeutral = (colorCode == 21 || colorCode == 22 || colorCode == 7)

            // FIX: If encoder defaults to 128, treat it as Sentinel 254 (Background) 
            // if it's a neutral color to enable "Auto-Dark" mode.
            // White/Black are explicit and bypass this logic entirely.
            val effectiveShade = if (shade == 128 && isDark && isNeutral) {
                if (isText) 253 else 254
            } else shade

            val finalShade = when (effectiveShade) {
                254 -> level 
                253 -> 255 - level
                252 -> if (isDark) Math.max(128, level - 20) else Math.min(127, level + 15)
                else -> {
                    // For non-sentinel shades, invert if it's a dark theme and the color is either text
                    // OR a neutral background (like input fields/cards) to ensure readability.
                    if (isDark && (isText || isNeutral) && shade != 0) 255 - effectiveShade else effectiveShade
                }
            }

            // Perceptually pure base colors — hue-accurate, no tint bleed
            // shade=128 → pure base, lighter shades blend with white, darker with black
            val base = when (colorCode) {
                1  -> Color.parseColor("#1a73e8") // blue     — Google Blue, hue 213°, clearly BLUE not violet
                2  -> Color.parseColor("#16a34a") // green    — vivid natural green, hue 142°
                3  -> Color.parseColor("#4338ca") // indigo   — deep indigo, hue 239°
                4  -> Color.parseColor("#e53935") // red      — Material Red 600, pure hue 1°
                5  -> Color.parseColor("#f4511e") // orange   — deep orange, hue 16°
                6  -> Color.parseColor("#f59f00") // amber    — vivid amber, hue 44°
                7  -> Color.parseColor("#6b7280") // gray     — neutral gray
                8  -> Color.parseColor("#00897b") // teal     — Material Teal 600, hue 174°
                9  -> Color.BLACK
                10 -> Color.WHITE
                11 -> Color.parseColor("#0097a7") // cyan     — Material Cyan 700, hue 187°
                12 -> Color.parseColor("#d81b60") // pink     — Material Pink 600, hue 340°
                13 -> Color.parseColor("#8e24aa") // purple   — Material Purple 600, hue 291°
                14 -> Color.parseColor("#f9a825") // yellow   — vivid yellow, hue 42°
                15 -> Color.parseColor("#558b2f") // lime     — lime green, hue 86°
                16 -> Color.parseColor("#e91e63") // rose     — Material Pink 500, hue 340°
                17 -> Color.parseColor("#ab47bc") // fuchsia  — Material Purple 400, hue 291°
                18 -> Color.parseColor("#5e35b1") // violet   — Deep Purple 600, hue 261°
                19 -> Color.parseColor("#039be5") // sky      — Light Blue 600, hue 200°
                20 -> Color.parseColor("#455a64") // slate    — Blue Grey 700
                21 -> Color.parseColor("#546e7a") // zinc     — Blue Grey 600
                22 -> Color.parseColor("#616161") // neutral  — Grey 700
                23 -> Color.TRANSPARENT
                24 -> Color.parseColor("#558b2f") // lime dup
                else -> Color.GRAY
            }

            val adjustedBase = when {
                isDark && (shade == 254 || effectiveShade == 254) -> Color.parseColor("#0f172a") // slate-950
                isDark && shade == 252 -> Color.parseColor("#1e293b") // slate-900
                isDark && isNeutral && !isText -> Color.parseColor("#1e293b") // slate-900 surface
                else -> base
            }

            // Blend ratio 0.72f preserves more saturation → vivid not washed-out
            return if (finalShade < 128) {
                val ratio = 1.0f - (finalShade / 128.0f)
                androidx.core.graphics.ColorUtils.blendARGB(adjustedBase, Color.WHITE, ratio * 0.72f)
            } else {
                val ratio = (finalShade - 128.0f) / 127.0f
                androidx.core.graphics.ColorUtils.blendARGB(adjustedBase, Color.BLACK, ratio * 0.72f)
            }
        }
    }

    private fun applyCustomBorder(v: View?, borderStr: String) {
        if (v == null || borderStr.isEmpty()) return
        
        var bWidthDp = 1
        var bColorVal = if (DolphinStateEngine.themeLevel > 128) Color.parseColor("#475569") else Color.parseColor("#cccccc")

        val parts = borderStr.split("|")
        if (parts.isNotEmpty()) {
            val widthMatch = Regex("(\\d+)").find(parts[0])
            if (widthMatch != null) {
                bWidthDp = widthMatch.value.toInt()
            }
            if (parts.size > 2) {
                try {
                    bColorVal = Color.parseColor(parts[2])
                } catch (e: Exception) {}
            }
        }

        if (v is MaterialCardView) {
            if (v.tag != "SelectContainer") {
                v.strokeWidth = dp(bWidthDp)
                v.strokeColor = bColorVal
            }
        } else if (v is MaterialButton) {
            v.strokeWidth = dp(bWidthDp)
            v.strokeColor = android.content.res.ColorStateList.valueOf(bColorVal)
        } else if (v is TextInputLayout || (v is LinearLayout && v.tag == "FormEngineRoot")) {
            if (v.tag == "FormEngineRoot") {
                val borderContainer = v.findViewWithTag<View>("FormBorderContainer")
                if (borderContainer != null) {
                    val borderGd = borderContainer.background as? android.graphics.drawable.GradientDrawable
                    borderGd?.setStroke(dp(bWidthDp), bColorVal)
                }
            }
        } else {
            val gd = v.background as? android.graphics.drawable.GradientDrawable
            gd?.setStroke(dp(bWidthDp), bColorVal)
        }
    }
}
