package io.dolphin.runtime

import android.content.Context
import android.content.res.ColorStateList
import android.graphics.Color
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout

class TextFieldBuilder : ComponentBuilder {
    override fun getType(): Int = 0x18
    override fun getName(): String = "TextField"

    override fun build(ctx: Context, data: ByteArray, factory: ViewFactory): View {
        val stateKey = factory.nextStr()
        val label = factory.nextStr()
        val hint = factory.nextStr()
        val typeStr = factory.nextStr()
        val variant = factory.nextStr()
        val iconStr = factory.nextStr()

        Log.d("TextFieldBuilder", "Building Field: stateKey='$stateKey', label='$label', hint='$hint', typeStr='$typeStr', variant='$variant'")

        val isDark = DolphinStateEngine.themeLevel > 128
        val sig = data[15].toInt() and 0xFF
        val hasBorder = (sig and 0x04) != 0

        val bgCode = data[3].toInt() and 0xFF
        val bgShade = data[2].toInt() and 0xFF
        val customBg = if (bgCode != 0) ColorParser.parseColor(bgCode, bgShade) else 0

        val textCode = data[13].toInt() and 0xFF
        val textShade = data[12].toInt() and 0x1F
        val customTextColor = if (textCode != 0 && textCode != 10) ColorParser.parseColor(textCode, textShade * 8) else 0

        val gravByte = data[0].toInt() and 0x0F
        val isCenterAlign = gravByte == 0x02

        val isTextArea = typeStr.contains("textarea", ignoreCase = true) || label.contains("textarea", ignoreCase = true) || hint.contains("textarea", ignoreCase = true)
        val isPlain = variant == "plain" || variant == "raw" || variant == "custom" || (label.isEmpty() && variant != "outlined" && variant != "filled" && variant != "standard") || isTextArea

        // ── Direct Standalone EditText for Plain Inputs & Textareas (No TextInputLayout Overlay) ──
        if (isPlain) {
            val editText = FormInputField.createEditText(
                ctx = ctx,
                inputTypeStr = if (isTextArea) "textarea" else typeStr,
                hintText = hint,
                stateKey = stateKey,
                textColor = if (customTextColor != 0) customTextColor else (if (isDark) Color.WHITE else Color.parseColor("#0f172a")),
                onAction = null
            ).apply {
                tag = "PlainTextField"

                val pt = data[4].toInt() and 0xFF
                val pr = data[5].toInt() and 0xFF
                val pb = data[6].toInt() and 0xFF
                val pl = data[7].toInt() and 0xFF

                val padL = if (pl > 0) factory.dp(pl) else factory.dp(14)
                val padR = if (pr > 0) factory.dp(pr) else factory.dp(14)
                val padT = if (pt > 0) factory.dp(pt) else factory.dp(14)
                val padB = if (pb > 0) factory.dp(pb) else factory.dp(14)
                setPadding(padL, padT, padR, padB)

                val mt = data[8].toInt() and 0xFF
                val mr = data[9].toInt() and 0xFF
                val mb = data[10].toInt() and 0xFF
                val ml = data[11].toInt() and 0xFF

                val topMargin = if (mt > 0) factory.dp(mt) else factory.dp(6)
                val bottomMargin = if (mb > 0) factory.dp(mb) else factory.dp(6)

                layoutParams = LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    if (isTextArea) factory.dp(100) else ViewGroup.LayoutParams.WRAP_CONTENT
                ).apply {
                    setMargins(factory.dp(ml), topMargin, factory.dp(mr), bottomMargin)
                }
            }
            return editText
        }

        // ── Material TextInputLayout Container (For Explicit Floating Labels) ──
        val displayHint = when {
            label.isNotEmpty() -> label
            hint.isNotEmpty() -> hint
            else -> "Field"
        }

        val inputLayout = TextInputLayout(ctx).apply {
            tag = "TextFieldContainer"
            this.hint = displayHint
            isHintEnabled = true
            isExpandedHintEnabled = true

            if (variant == "filled") {
                boxBackgroundMode = TextInputLayout.BOX_BACKGROUND_FILLED
            } else if (variant == "standard") {
                boxBackgroundMode = TextInputLayout.BOX_BACKGROUND_NONE
            } else {
                boxBackgroundMode = TextInputLayout.BOX_BACKGROUND_OUTLINE
            }

            val radiusVal = data[14].toInt() and 0xFF
            val rad = if (radiusVal > 0) factory.dp(radiusVal).toFloat() else factory.dp(12).toFloat()
            setBoxCornerRadii(rad, rad, rad, rad)

            if (variant == "filled") {
                val fillColor = if (customBg != 0) customBg else ColorTokens.getInputFilledBackground(isDark)
                setBoxBackgroundColorStateList(ColorStateList.valueOf(fillColor))
                boxStrokeWidth = 0
                boxStrokeWidthFocused = 0
                setBoxStrokeColorStateList(ColorStateList.valueOf(Color.TRANSPARENT))
            } else if (variant == "standard") {
                boxBackgroundColor = Color.TRANSPARENT
            } else {
                val strokeColor = ColorTokens.getInputBorder(isDark)
                setBoxStrokeColorStateList(ColorStateList.valueOf(strokeColor))
                boxStrokeWidth = factory.dp(1)
                boxStrokeWidthFocused = factory.dp(2)
                val bg = if (customBg != 0) customBg else ColorTokens.getSurface(isDark)
                setBoxBackgroundColorStateList(ColorStateList.valueOf(bg))
            }

            val labelColor = if (isDark) Color.parseColor("#94a3b8") else Color.parseColor("#64748b")
            val focusedLabelColor = Color.parseColor("#2563eb")
            defaultHintTextColor = ColorStateList.valueOf(labelColor)
            setHintTextColor(ColorStateList.valueOf(focusedLabelColor))

            // Icon Parsing
            if (iconStr.isNotEmpty()) {
                val parts = iconStr.split("|")
                val iconL = parts.getOrNull(0) ?: ""
                val iconR = parts.getOrNull(1) ?: ""

                val effectiveLeft = if (iconL.isNotEmpty()) iconL else (if (label.contains("name", ignoreCase = true) || hint.contains("name", ignoreCase = true)) "user" else if (label.contains("email", ignoreCase = true) || hint.contains("email", ignoreCase = true)) "email" else "")
                
                if (effectiveLeft.isNotEmpty()) {
                    val iconRes = factory.getSystemIcon(effectiveLeft)
                    if (iconRes != 0) {
                        setStartIconDrawable(iconRes)
                        setStartIconTintList(ColorStateList.valueOf(labelColor))
                    }
                }

                if (iconR.isNotEmpty()) {
                    val iconRes = factory.getSystemIcon(iconR)
                    if (iconRes != 0) {
                        setEndIconDrawable(iconRes)
                        setEndIconTintList(ColorStateList.valueOf(labelColor))
                    }
                }
            }

            val isPassword = typeStr.contains("password", ignoreCase = true) || label.contains("password", ignoreCase = true) || hint.contains("password", ignoreCase = true)
            if (isPassword) {
                endIconMode = TextInputLayout.END_ICON_PASSWORD_TOGGLE
                setEndIconTintList(ColorStateList.valueOf(labelColor))
            }

            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
        }

        val editText = TextInputEditText(inputLayout.context).apply {
            background = null
            val textColor = if (customTextColor != 0) customTextColor else (if (isDark) Color.WHITE else Color.parseColor("#0f172a"))
            setTextColor(textColor)
            textSize = 16f
            gravity = if (isCenterAlign) android.view.Gravity.CENTER else (android.view.Gravity.CENTER_VERTICAL or android.view.Gravity.START)

            val pt = data[4].toInt() and 0xFF
            val pr = data[5].toInt() and 0xFF
            val pb = data[6].toInt() and 0xFF
            val pl = data[7].toInt() and 0xFF

            val padL = if (pl > 0) factory.dp(pl) else factory.dp(12)
            val padR = if (pr > 0) factory.dp(pr) else factory.dp(12)
            val padT = if (pt > 0) factory.dp(pt) else factory.dp(12)
            val padB = if (pb > 0) factory.dp(pb) else factory.dp(12)
            setPadding(padL, padT, padR, padB)

            inputType = when (typeStr) {
                "password" -> android.text.InputType.TYPE_CLASS_TEXT or android.text.InputType.TYPE_TEXT_VARIATION_PASSWORD
                "email" -> android.text.InputType.TYPE_CLASS_TEXT or android.text.InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS
                "number" -> android.text.InputType.TYPE_CLASS_NUMBER
                "phone", "tel" -> android.text.InputType.TYPE_CLASS_PHONE
                else -> android.text.InputType.TYPE_CLASS_TEXT
            }

            isFocusable = true
            isFocusableInTouchMode = true
            isClickable = true

            setOnTouchListener { v, event ->
                var p = v.parent
                while (p != null) {
                    p.requestDisallowInterceptTouchEvent(event.action == android.view.MotionEvent.ACTION_DOWN || event.action == android.view.MotionEvent.ACTION_MOVE)
                    p = p.parent
                }
                if (event.action == android.view.MotionEvent.ACTION_UP) {
                    v.post {
                        v.requestFocus()
                        val imm = v.context.getSystemService(android.content.Context.INPUT_METHOD_SERVICE) as? android.view.inputmethod.InputMethodManager
                        imm?.showSoftInput(v, android.view.inputmethod.InputMethodManager.SHOW_FORCED)
                    }
                }
                false
            }

            if (stateKey.isNotEmpty()) {
                DolphinStateEngine.bindInput(stateKey, this)
            }
        }

        inputLayout.addView(editText)

        val mt = data[8].toInt() and 0xFF
        val mr = data[9].toInt() and 0xFF
        val mb = data[10].toInt() and 0xFF
        val ml = data[11].toInt() and 0xFF

        val topMargin = if (mt > 0) factory.dp(mt) else factory.dp(6)
        val bottomMargin = if (mb > 0) factory.dp(mb) else factory.dp(6)

        inputLayout.layoutParams = LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        ).apply {
            setMargins(factory.dp(ml), topMargin, factory.dp(mr), bottomMargin)
        }

        return inputLayout
    }
}
