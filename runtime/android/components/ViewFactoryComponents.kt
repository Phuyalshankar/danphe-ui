package io.dolphin.runtime



import android.app.Activity
import android.content.Context
import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.Typeface
import android.os.Build
import android.os.SystemClock
import android.util.Log
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.core.content.ContextCompat
import androidx.core.graphics.ColorUtils
import androidx.core.view.ViewCompat
import com.google.android.material.card.MaterialCardView
import com.google.android.material.switchmaterial.SwitchMaterial
import com.google.android.material.textfield.TextInputLayout

private var cdnIconMap: Map<String, String>? = null
private var cdnTypeface: Typeface? = null
private var cdnIconLoaded = false

private fun loadCdnIconAssets(ctx: Context) {
    if (cdnIconLoaded) return
    cdnIconLoaded = true
    try {
        val assetManager = ctx.assets
        try {
            val jsonStr = assetManager.open("icons/icon-map.json").bufferedReader().use { it.readText() }
            val jsonObj = org.json.JSONObject(jsonStr)
            val map = mutableMapOf<String, String>()
            val keys = jsonObj.keys()
            while (keys.hasNext()) {
                val k = keys.next()
                map[k] = jsonObj.getString(k)
            }
            cdnIconMap = map
            android.util.Log.i("DolphinIcons", "✅ Loaded ${map.size} dynamic icon mappings from asset icons/icon-map.json")
        } catch (e: Exception) {
            android.util.Log.w("DolphinIcons", "Could not open icons/icon-map.json: ${e.message}")
        }

        try {
            val fontFile = java.io.File(ctx.cacheDir, "icon-font.ttf")
            assetManager.open("icons/icon-font.ttf").use { input ->
                java.io.FileOutputStream(fontFile).use { output -> input.copyTo(output) }
            }
            cdnTypeface = Typeface.createFromFile(fontFile)
            android.util.Log.i("DolphinIcons", "✅ Loaded native TTF icon typeface from asset icons/icon-font.ttf")
        } catch (e: Exception) {
            android.util.Log.w("DolphinIcons", "Could not open icons/icon-font.ttf: ${e.message}")
        }
    } catch (e: Exception) { /* ignore CDN load error */ }
}

fun ViewFactory.loadImage(imageView: ImageView, url: String) {
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

fun ViewFactory.createImage(bin: ByteArray): View {
    val imageView = ImageView(ctx).apply {
        scaleType = ImageView.ScaleType.CENTER_CROP
        adjustViewBounds = true
    }
    applyStyles(imageView, bin)
    val url = nextStr()
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

fun ViewFactory.getSystemIcon(iconName: String): Int {
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

fun ViewFactory.createTextField(bin: ByteArray): View {
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

fun ViewFactory.createAppBar(bin: ByteArray): View {
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
            val btn = TextView(ctx).apply {
                text = if (action == "drawer:open") "☰" else "◀"
                textSize = 22f
                setTextColor(Color.WHITE)
                gravity = Gravity.CENTER
                val lp = RelativeLayout.LayoutParams(dp(48), dp(48))
                lp.addRule(RelativeLayout.CENTER_VERTICAL)

                if (action == "drawer:open") {
                    lp.addRule(RelativeLayout.ALIGN_PARENT_START)
                    tv.setPadding(dp(56), 0, 0, 0)
                } else {
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
            tv.setTextColor(ColorParser.parseColor(1, 253))
        }

        if (action.isNotEmpty()) {
            setOnClickListener { onAction?.invoke(action, title) }
        }
    }
    return layout
}

fun ViewFactory.createText(bin: ByteArray): View {
    val content = nextStr()

    val view = TextView(ctx).apply {
        var targetKey: String? = null
        var defaultText: String = content

        if (content.startsWith("stateKey:") || content.startsWith("bus:")) {
            val key = content.removePrefix("stateKey:").removePrefix("bus:")
            defaultText = key.substringAfterLast("|", "")
            targetKey   = if (content.startsWith("bus:")) "bus:" + key.substringBeforeLast("|") else key.substringBeforeLast("|")
        } else if (content.contains("[stateKey:") || content.contains("[bus:")) {
            val match = Regex("\\[(stateKey|bus):([a-zA-Z0-9_$\\.]+)\\]").find(content)
            if (match != null) {
                val prefix = match.groupValues[1]
                val rawKey = match.groupValues[2]
                targetKey = if (prefix == "bus") "bus:$rawKey" else rawKey
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

fun ViewFactory.getDynamicIconDrawable(ctx: Context, iconName: String, color: Int = Color.WHITE): android.graphics.drawable.Drawable {
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
        "sliders" to "f1de", "check" to "f00c", "rotate" to "f01e",
        "keypad" to "f11c", "keyboard" to "f11c", "dialpad" to "f11c"
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
        lower.contains("keypad") || lower.contains("dialpad") || lower.contains("keyboard") || lower.contains("matrix") -> {
            val dotPaint = android.graphics.Paint(paint).apply {
                this.style = android.graphics.Paint.Style.FILL
            }
            val dotR = 2.2f * density
            val spacingX = r * 0.45f
            val spacingY = r * 0.45f
            for (row in -1..1) {
                for (col in -1..1) {
                    canvas.drawCircle(cx + col * spacingX, cy + row * spacingY, dotR, dotPaint)
                }
            }
        }
        lower.contains("gas") || lower.contains("pump") || lower.contains("fuel") -> {
            val body = android.graphics.RectF(cx - r * 0.5f, cy - r * 0.6f, cx + r * 0.2f, cy + r * 0.7f)
            canvas.drawRoundRect(body, 4f * density, 4f * density, paint)
            val hose = android.graphics.Path()
            hose.moveTo(cx + r * 0.2f, cy - r * 0.2f)
            hose.lineTo(cx + r * 0.6f, cy - r * 0.2f)
            hose.lineTo(cx + r * 0.6f, cy + r * 0.4f)
            canvas.drawPath(hose, paint)
        }
        lower.contains("file") || lower.contains("form") || lower.contains("document") -> {
            val doc = android.graphics.RectF(cx - r * 0.5f, cy - r * 0.7f, cx + r * 0.5f, cy + r * 0.7f)
            canvas.drawRoundRect(doc, 4f * density, 4f * density, paint)
            canvas.drawLine(cx - r * 0.3f, cy - r * 0.3f, cx + r * 0.3f, cy - r * 0.3f, paint)
            canvas.drawLine(cx - r * 0.3f, cy, cx + r * 0.3f, cy, paint)
            canvas.drawLine(cx - r * 0.3f, cy + r * 0.3f, cx + r * 0.1f, cy + r * 0.3f, paint)
        }
        lower.contains("phone") || lower.contains("mobile") || lower.contains("call") -> {
            val phone = android.graphics.RectF(cx - r * 0.4f, cy - r * 0.75f, cx + r * 0.4f, cy + r * 0.75f)
            canvas.drawRoundRect(phone, 6f * density, 6f * density, paint)
            val screen = android.graphics.RectF(cx - r * 0.28f, cy - r * 0.55f, cx + r * 0.28f, cy + r * 0.45f)
            val screenPaint = android.graphics.Paint(paint).apply {
                this.color = Color.TRANSPARENT
                this.xfermode = android.graphics.PorterDuffXfermode(android.graphics.PorterDuff.Mode.CLEAR)
            }
            canvas.drawRect(screen, screenPaint)
            canvas.drawCircle(cx, cy + r * 0.6f, 2f * density, paint)
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
        lower.contains("user") || lower.contains("profile") || lower.contains("person") || lower.contains("contact") || lower.contains("address-book") -> {
            val strokePaint = android.graphics.Paint(paint).apply {
                this.style = android.graphics.Paint.Style.STROKE
                this.strokeWidth = 2.5f * density
                this.strokeCap = android.graphics.Paint.Cap.ROUND
            }
            canvas.drawCircle(cx, cy - r * 0.3f, r * 0.28f, strokePaint)
            val bodyArc = android.graphics.RectF(cx - r * 0.55f, cy - r * 0.05f, cx + r * 0.55f, cy + r * 0.85f)
            canvas.drawArc(bodyArc, 180f, 180f, false, strokePaint)
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
            val strokePaint = android.graphics.Paint(paint).apply {
                this.style = android.graphics.Paint.Style.STROKE
                this.strokeWidth = 2.5f * density
            }
            canvas.drawCircle(cx, cy - r * 0.1f, r * 0.45f, strokePaint)
            canvas.drawCircle(cx, cy + r * 0.55f, r * 0.15f, paint)
        }
        lower.contains("gear") || lower.contains("cog") || lower.contains("settings") -> {
            val strokePaint = android.graphics.Paint(paint).apply {
                this.style = android.graphics.Paint.Style.STROKE
                this.strokeWidth = 2.5f * density
                this.strokeCap = android.graphics.Paint.Cap.ROUND
            }
            for (i in 0 until 6) {
                val angle = Math.toRadians((i * 60).toDouble())
                val x1 = cx + ((r * 0.25f) * Math.cos(angle)).toFloat()
                val y1 = cy + ((r * 0.25f) * Math.sin(angle)).toFloat()
                val x2 = cx + ((r * 0.75f) * Math.cos(angle)).toFloat()
                val y2 = cy + ((r * 0.75f) * Math.sin(angle)).toFloat()
                canvas.drawLine(x1, y1, x2, y2, strokePaint)
            }
            canvas.drawCircle(cx, cy, r * 0.45f, strokePaint)
            canvas.drawCircle(cx, cy, r * 0.18f, strokePaint)
        }
        lower.contains("trash") -> {
            canvas.drawRect(cx - r * 0.45f, cy - r * 0.2f, cx + r * 0.45f, cy + r * 0.6f, paint)
            canvas.drawLine(cx - r * 0.6f, cy - r * 0.3f, cx + r * 0.6f, cy - r * 0.3f, paint)
        }
        lower.contains("chat") || lower.contains("message") || lower.contains("comment") -> {
            val bubble = android.graphics.RectF(cx - r * 0.6f, cy - r * 0.6f, cx + r * 0.6f, cy + r * 0.2f)
            canvas.drawRoundRect(bubble, 6f * density, 6f * density, paint)
            val tail = android.graphics.Path()
            tail.moveTo(cx - r * 0.3f, cy + r * 0.2f)
            tail.lineTo(cx - r * 0.5f, cy + r * 0.6f)
            tail.lineTo(cx - r * 0.05f, cy + r * 0.2f)
            tail.close()
            canvas.drawPath(tail, paint)
        }
        lower.contains("conference") || lower.contains("meeting") || lower.contains("users") || lower.contains("group") -> {
            canvas.drawCircle(cx, cy - r * 0.3f, r * 0.25f, paint)
            val body1 = android.graphics.RectF(cx - r * 0.4f, cy, cx + r * 0.4f, cy + r * 0.6f)
            canvas.drawArc(body1, 180f, 180f, true, paint)
            canvas.drawCircle(cx + r * 0.45f, cy - r * 0.35f, r * 0.2f, paint)
        }
        lower.contains("search") -> {
            canvas.drawCircle(cx - r * 0.15f, cy - r * 0.15f, r * 0.4f, paint)
            canvas.drawLine(cx + r * 0.15f, cy + r * 0.15f, cx + r * 0.65f, cy + r * 0.65f, paint)
        }
        lower.contains("lock") -> {
            canvas.drawRect(cx - r * 0.45f, cy - r * 0.1f, cx + r * 0.45f, cy + r * 0.6f, paint)
            val shackle = android.graphics.RectF(cx - r * 0.3f, cy - r * 0.6f, cx + r * 0.3f, cy + r * 0.1f)
            canvas.drawArc(shackle, 180f, 180f, false, paint)
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

fun ViewFactory.createIcon(bin: ByteArray): View {
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

fun ViewFactory.createButton(bin: ByteArray): View {
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
            else -> Gravity.CENTER
        }
        this.isAllCaps = false
        this.textSize = 15f
        this.isClickable = true
        this.isFocusable = true
        this.stateListAnimator = null
        this.backgroundTintList = null
        androidx.core.view.ViewCompat.setBackgroundTintList(this, null)
        
        if (iconName.isNotEmpty()) {
            try {
                val resolvedColor = resolveColorFromBin(bin)
                val iconColor = if (resolvedColor != 0) resolvedColor else Color.WHITE
                val drawable = getDynamicIconDrawable(ctx, iconName, iconColor)
                if (this.text.isEmpty()) {
                    setCompoundDrawablesWithIntrinsicBounds(null, drawable, null, null)
                } else {
                    setCompoundDrawablesWithIntrinsicBounds(drawable, null, null, null)
                    compoundDrawablePadding = dp(8)
                }
            } catch (e: Exception) { /* ignore icon errors */ }
        }

        applyStyles(this, bin)
        applyTextStyles(this, bin)

        setOnClickListener {
            if (action.startsWith("anim:")) {
                val animName = action.substring(5)
                DolphinEventDebugger.trace(this, action, "AnimationEngine", "EXECUTED", "animStr=$animName")
                AnimationEngine.apply(this, animName)
            } else if (action.startsWith("alert:")) {
                val message = action.substring(6)
                DolphinEventDebugger.trace(this, action, "AlertDialog", "SHOWING", "msg=$message")
                val activity = ctx as? android.app.Activity
                activity?.runOnUiThread {
                    android.app.AlertDialog.Builder(ctx)
                        .setTitle("Alert")
                        .setMessage(message)
                        .setPositiveButton("OK") { dialog, _ -> dialog.dismiss() }
                        .show()
                }
            } else {
                val handled = DolphinStateEngine.handleAction(action)
                if (handled) {
                    DolphinEventDebugger.trace(this, action, "DolphinStateEngine", "STATE_UPDATED")
                } else {
                    DolphinEventDebugger.trace(this, action, "CallbackHandler", "DELEGATED_TO_ONACTION")
                    onAction?.invoke(action, text)
                }
            }
        }
    }
}

fun ViewFactory.createSwitch(bin: ByteArray): View {
    val actionOrState = nextStr()
    val label = nextStr()
    val initialChecked = (bin[14].toInt() and 0xFF) == 1

    return SwitchMaterial(ctx).apply {
        text = label
        setTextColor(contrastText(ColorParser.parseColor(bin[3].toInt() and 0xFF, bin[2].toInt() and 0xFF)))
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

fun ViewFactory.createSlider(bin: ByteArray): View {
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
            setTextColor(contrastText(ColorParser.parseColor(bin[3].toInt() and 0xFF, bin[2].toInt() and 0xFF)))
        }
        addView(tv)
        
        val sb = SeekBar(ctx).apply {
            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
            max = 255
            val currentStateStr = DolphinStateEngine.get(actionOrState)?.toString() ?: ""
            progress = currentStateStr.toFloatOrNull()?.toInt() ?: initialValue

            try {
                val accent = Color.parseColor("#3b82f6")
                val track  = Color.parseColor("#cbd5e1")
                progressTintList = ColorStateList.valueOf(accent)
                progressBackgroundTintList = ColorStateList.valueOf(track)
                thumbTintList = ColorStateList.valueOf(accent)
            } catch (_: Exception) {}

            minimumHeight = dp(24)
            ViewCompat.setPaddingRelative(this, paddingStart, paddingTop, paddingEnd, paddingBottom)
            
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

fun ViewFactory.createCheckbox(bin: ByteArray): View {
    val actionOrState = nextStr()
    val label = nextStr()
    val initialChecked = (bin[14].toInt() and 0xFF) == 1

    return com.google.android.material.checkbox.MaterialCheckBox(ctx).apply {
        text = label
        buttonTintList = ColorStateList.valueOf(Color.parseColor("#3b82f6"))
        
        val level = DolphinStateEngine.themeLevel
        setTextColor(if (level > 128) Color.WHITE else Color.parseColor("#374151"))
        
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

fun ViewFactory.createRadioButton(bin: ByteArray): View {
    val actionOrState = nextStr()
    val label = nextStr()
    val initialChecked = (bin[14].toInt() and 0xFF) == 1

    val rb = com.google.android.material.radiobutton.MaterialRadioButton(ctx).apply {
        text = label
        buttonTintList = ColorStateList.valueOf(Color.parseColor("#3b82f6"))
        
        val level = DolphinStateEngine.themeLevel
        setTextColor(if (level > 128) Color.WHITE else Color.parseColor("#374151"))
        
        layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        
        val currentState = DolphinStateEngine.get(actionOrState)
        isChecked = if (currentState != null) currentState.toString().toBoolean() else initialChecked
        
        setOnClickListener {
            isChecked = true
            DolphinStateEngine.handleAction("$actionOrState:=true")
            onAction?.invoke(actionOrState, true)
        }
        if (actionOrState.isNotEmpty()) DolphinStateEngine.declareIfAbsent(actionOrState, isChecked)
    }
    
    val container = LinearLayout(ctx).apply {
        layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        addView(rb)
        applyStyles(this, bin)
    }
    return container
}

fun ViewFactory.createSelect(bin: ByteArray): View {
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
                            
                            v.setPadding(dp(12), dp(10), dp(40), dp(10))
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
                            v.setPadding(dp(16), dp(12), dp(16), dp(12))
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
            setOnClickListener { spinner.performClick() }
        }
        
        addView(inner)
        applyStyles(this, bin)
    }
    return container
}

fun ViewFactory.createFileUpload(bin: ByteArray): View {
    val action = nextStr()
    val label = nextStr()

    return com.google.android.material.button.MaterialButton(ctx).apply {
        text = if (label.isEmpty()) "Choose File" else label
        setTextColor(Color.parseColor("#374151"))
        
        icon = ContextCompat.getDrawable(ctx, android.R.drawable.ic_menu_upload)
        iconTint = ColorStateList.valueOf(Color.parseColor("#374151"))
        iconGravity = com.google.android.material.button.MaterialButton.ICON_GRAVITY_TEXT_START
        iconPadding = dp(8)
        
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

fun ViewFactory.createHardwareView(bin: ByteArray, type: String): View {
    val stateKeyOrAction = nextStr()
    val config = nextStr()

    when (type) {
        "camera", "camera-preview", "cam-preview", "camera-front", "camera-back" -> {
            val facing = if (type == "camera-front" || config.contains("front")) "front" else "back"
            return DolphinCamera.createEmbeddedCameraView(ctx, facing).apply {
                applyStyles(this, bin)
            }
        }
        "haptics" -> {
            DolphinHaptics.vibrate(ctx, config)
        }
        "location" -> {
            if (stateKeyOrAction.isNotEmpty()) {
                DolphinLocation.requestLocation(ctx, stateKeyOrAction)
            }
        }
    }
    
    return View(ctx).apply { 
        layoutParams = ViewGroup.LayoutParams(0, 0) 
        visibility = View.GONE
    }
}
