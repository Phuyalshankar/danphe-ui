package io.dolphin.runtime

import android.content.Context
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.core.graphics.ColorUtils
import android.content.res.ColorStateList
import android.widget.FrameLayout

/**
 * 🐬 DolphinFormEngine
 *
 * Standalone Form Component Renderer for Dolphin Native.
 * Handles TextField input with offline state management via DolphinStateEngine.
 * Supports MUI style floating labels, standard labels, and theme-adaptive states.
 */
object DolphinFormEngine {

    /**
     * Create a MUI style Floating Label TextField bound to DolphinStateEngine.
     */
    fun createTextField(
        ctx: Context,
        label: String,
        stateKey: String,
        hint: String,
        inputType: String,
        onAction: ((String, Any?) -> Unit)?,
        hasBorder: Boolean = false,
        variant: String = "outlined",
        iconResId: Int = 0,
        endIconResId: Int = 0,
        iconColorStr: String = "",
        endIconColorStr: String = "",
        iconSizeDp: Int = 24,
        iconName: String = ""
    ): View {
        val level = DolphinStateEngine.themeLevel
        val isDark = level > 128
        val labelFocusColor = if (isDark) Color.parseColor("#60a5fa") else Color.parseColor("#1976d2")
        val labelUnfocusColor = if (isDark) Color.parseColor("#94a3b8") else Color.parseColor("#666666")
        
        val inputTextColor = if (isDark) Color.WHITE else Color.parseColor("#1f2937")
        val inputHintColor = if (isDark) Color.parseColor("#64748b") else Color.parseColor("#9ca3af")
        val strokeNormal = if (isDark) Color.parseColor("#475569") else Color.parseColor("#d1d5db")
        val strokeFocused = if (isDark) Color.parseColor("#60a5fa") else Color.parseColor("#1976d2")

        // Parse iconName for toggle detection
        val parts = iconName.split("|")

        val textInputLayout = com.google.android.material.textfield.TextInputLayout(
            ctx, null, com.google.android.material.R.attr.textInputStyle
        ).apply {
            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
                setMargins(0, dp(ctx, 4), 0, dp(ctx, 4))
            }
            this.hint = label
            isHintEnabled = label.isNotEmpty()
            tag = "FormEngineRoot"
            
            boxBackgroundMode = when (variant) {
                "filled"   -> com.google.android.material.textfield.TextInputLayout.BOX_BACKGROUND_FILLED
                "standard" -> com.google.android.material.textfield.TextInputLayout.BOX_BACKGROUND_FILLED
                else       -> com.google.android.material.textfield.TextInputLayout.BOX_BACKGROUND_OUTLINE
            }
            
            if (variant == "filled") {
                boxBackgroundColor = if (isDark) Color.parseColor("#1e293b") else Color.parseColor("#f3f4f6")
            } else if (variant == "standard") {
                // Use same bg as screen to avoid black fill; TRANSPARENT = 0x00000000 renders black in FILLED mode
                boxBackgroundColor = if (isDark) Color.parseColor("#121212") else Color.parseColor("#ffffff")
            } else {
                boxBackgroundColor = Color.parseColor(if (isDark) "#00121212" else "#00ffffff")  // truly transparent outline
            }
            
            val states = arrayOf(
                intArrayOf(android.R.attr.state_focused),
                intArrayOf(-android.R.attr.state_focused)
            )
            val colors = intArrayOf(strokeFocused, strokeNormal)
            setBoxStrokeColorStateList(ColorStateList(states, colors))
            
            defaultHintTextColor = ColorStateList.valueOf(labelUnfocusColor)
            hintTextColor = ColorStateList.valueOf(labelFocusColor)
            
            setBoxCornerRadii(dp(ctx, 8).toFloat(), dp(ctx, 8).toFloat(), dp(ctx, 8).toFloat(), dp(ctx, 8).toFloat())
            
            if (iconResId != 0) {
                try {
                    var drawable = ContextCompat.getDrawable(ctx, iconResId)
                    if (drawable != null) {
                        if (iconSizeDp > 0 && iconSizeDp != 24) {
                            drawable = resizeDrawable(ctx, drawable, iconSizeDp)
                        }
                        setStartIconDrawable(drawable)
                        val tintColor = parseDolphinColor(iconColorStr, labelUnfocusColor)
                        setStartIconTintList(ColorStateList.valueOf(tintColor))
                    }
                } catch (e: Exception) { /* ignore */ }
            }
            if (endIconResId != 0) {
                try {
                    var drawable = ContextCompat.getDrawable(ctx, endIconResId)
                    if (drawable != null) {
                        if (iconSizeDp > 0 && iconSizeDp != 24) {
                            drawable = resizeDrawable(ctx, drawable, iconSizeDp)
                        }
                        endIconMode = com.google.android.material.textfield.TextInputLayout.END_ICON_CUSTOM
                        setEndIconDrawable(drawable)
                        val tintColor = parseDolphinColor(endIconColorStr, labelUnfocusColor)
                        setEndIconTintList(ColorStateList.valueOf(tintColor))
                        
                        // Universal Toggle System for end icon
                        // Auto-detect toggle type based on icon name and input type
                        setEndIconOnClickListener {
                            val firstIconName = parts.getOrNull(1)?.lowercase() ?: ""
                            when {
                                // Password visibility toggle
                                inputType == "password" && (firstIconName.contains("eye") || firstIconName.contains("view") || firstIconName.contains("preview")) -> {
                                    val currentType = (it.parent as? ViewGroup)?.findViewById<com.google.android.material.textfield.TextInputEditText>(0)?.inputType
                                    val editText = (it.parent as? ViewGroup)?.findViewById<com.google.android.material.textfield.TextInputEditText>(0)
                                    if (editText != null) {
                                        val isPasswordVisible = currentType != (android.text.InputType.TYPE_CLASS_TEXT or android.text.InputType.TYPE_TEXT_VARIATION_PASSWORD)
                                        editText.inputType = if (isPasswordVisible) {
                                            android.text.InputType.TYPE_CLASS_TEXT or android.text.InputType.TYPE_TEXT_VARIATION_PASSWORD
                                        } else {
                                            android.text.InputType.TYPE_CLASS_TEXT or android.text.InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD
                                        }
                                        // Move cursor to end after toggle
                                        editText.setSelection(editText.text?.length ?: 0)
                                    }
                                }
                                // Clear text
                                firstIconName.contains("close") || firstIconName.contains("clear") || firstIconName.contains("cancel") -> {
                                    val editText = (it.parent as? ViewGroup)?.findViewById<com.google.android.material.textfield.TextInputEditText>(0)
                                    editText?.setText("")
                                }
                                // Generic toggle using stateKey
                                stateKey.isNotEmpty() && (firstIconName.contains("toggle") || firstIconName.contains("switch")) -> {
                                    DolphinStateEngine.handleAction("$stateKey:toggle")
                                }
                                // Custom action support
                                stateKey.isNotEmpty() && firstIconName.startsWith("action:") -> {
                                    val actionName = firstIconName.removePrefix("action:")
                                    onAction?.invoke(actionName, stateKey)
                                }
                            }
                        }
                    }
                } catch (e: Exception) { /* ignore */ }
            }
        }

        val editText = com.google.android.material.textfield.TextInputEditText(textInputLayout.context).apply {
            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
            setTextColor(inputTextColor)
            setHintTextColor(inputHintColor)
            if (label.isEmpty()) {
                this.hint = hint // Only use inner hint if label is empty
            }
            
            // Fix vertical centering of floating label by applying correct padding
            val padL = if (variant == "standard") dp(ctx, 4) else dp(ctx, 12)
            val padR = if (variant == "standard") dp(ctx, 4) else dp(ctx, 12)
            val padT = if (variant == "standard") dp(ctx, 16) else dp(ctx, 16)
            val padB = if (variant == "standard") dp(ctx, 8) else dp(ctx, 16)
            setPadding(padL, padT, padR, padB)
            
            this.inputType = when (inputType) {
                "email"    -> android.text.InputType.TYPE_CLASS_TEXT or android.text.InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS
                "password" -> android.text.InputType.TYPE_CLASS_TEXT or android.text.InputType.TYPE_TEXT_VARIATION_PASSWORD
                "number"   -> android.text.InputType.TYPE_CLASS_NUMBER or android.text.InputType.TYPE_NUMBER_FLAG_DECIMAL
                "phone"    -> android.text.InputType.TYPE_CLASS_PHONE
                else       -> android.text.InputType.TYPE_CLASS_TEXT
            }
            
            // State binding
            if (stateKey.isNotEmpty()) {
                val currentVal = DolphinStateEngine.get(stateKey)
                if (currentVal != null) setText(currentVal.toString())

                addTextChangedListener(object : TextWatcher {
                    override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
                    override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
                    override fun afterTextChanged(s: Editable?) {
                        val txt = s?.toString() ?: ""
                        DolphinStateEngine.handleAction("$stateKey:=$txt")
                        onAction?.invoke(stateKey, "=$txt")
                    }
                })
                DolphinStateEngine.declareIfAbsent(stateKey, "")
                
                // Register reverse binding: state → EditText (enables form reset from store)
                // Using INPUT_VALUE property so DolphinStateEngine can clear/update the EditText
                DolphinStateEngine.bind(stateKey, this as View, DolphinStateEngine.Property.INPUT_VALUE, "")
            }
        }
        
        textInputLayout.addView(editText)
        return textInputLayout
    }

    private fun dp(ctx: Context, px: Int): Int =
        (px * ctx.resources.displayMetrics.density).toInt()

    private fun resizeDrawable(ctx: Context, drawable: android.graphics.drawable.Drawable, sizeDp: Int): android.graphics.drawable.Drawable {
        val sizePx = (sizeDp * ctx.resources.displayMetrics.density).toInt()
        val bitmap = android.graphics.Bitmap.createBitmap(sizePx, sizePx, android.graphics.Bitmap.Config.ARGB_8888)
        val canvas = android.graphics.Canvas(bitmap)
        drawable.setBounds(0, 0, sizePx, sizePx)
        drawable.draw(canvas)
        return android.graphics.drawable.BitmapDrawable(ctx.resources, bitmap)
    }

    private fun parseDolphinColor(colorStr: String, defaultColor: Int): Int {
        if (colorStr.isEmpty()) return defaultColor
        return try {
            if (colorStr.startsWith("#")) {
                Color.parseColor(colorStr)
            } else {
                when (colorStr.lowercase()) {
                    "red" -> Color.RED
                    "blue" -> Color.parseColor("#1e40af")
                    "green" -> Color.parseColor("#15803d")
                    "yellow" -> Color.YELLOW
                    "gray", "grey" -> Color.GRAY
                    "white" -> Color.WHITE
                    "black" -> Color.BLACK
                    else -> Color.parseColor(colorStr)
                }
            }
        } catch (e: Exception) {
            defaultColor
        }
    }
}
