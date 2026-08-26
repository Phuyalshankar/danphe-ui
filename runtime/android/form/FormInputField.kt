package io.dolphin.runtime


import android.content.Context
import android.text.Editable
import android.text.InputType
import android.text.TextWatcher
import android.view.Gravity
import android.view.ViewGroup
import android.widget.LinearLayout
import androidx.appcompat.widget.AppCompatEditText

/**
 * ⌨️ FormInputField — Manages text input edit text creation, input types, gravity, and live state watchers.
 */
object FormInputField {

    fun createEditText(
        ctx: Context,
        inputTypeStr: String,
        hintText: String,
        stateKey: String,
        textColor: Int,
        onAction: ((String, Any?) -> Unit)?
    ): androidx.appcompat.widget.AppCompatEditText {
        return androidx.appcompat.widget.AppCompatEditText(ctx).apply {
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
            val isMultiline = inputTypeStr.lowercase() == "textarea" || inputTypeStr.lowercase() == "multiline"
            gravity = if (isMultiline) (Gravity.TOP or Gravity.START) else (Gravity.CENTER_VERTICAL or Gravity.START)
            if (isMultiline) {
                isSingleLine = false
                setHorizontallyScrolling(false)
                minLines = 3
                maxLines = 10
            }
            isFocusable = true
            isFocusableInTouchMode = true
            isClickable = true
            isEnabled = true
            isCursorVisible = true

            setOnClickListener(null)
            setOnFocusChangeListener(null)

            val effectiveTextColor = if (textColor != 0 && textColor != android.graphics.Color.parseColor("#0f172a")) textColor else android.graphics.Color.WHITE
            setTextColor(effectiveTextColor)
            setTextSize(android.util.TypedValue.COMPLEX_UNIT_SP, 15f)
            setHint(hintText)
            setHintTextColor(android.graphics.Color.parseColor("#94a3b8"))
            setHighlightColor(android.graphics.Color.parseColor("#38bdf8"))

            // Set Input Type
            inputType = when (inputTypeStr.lowercase()) {
                "password" -> InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_PASSWORD
                "email" -> InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS
                "number" -> InputType.TYPE_CLASS_NUMBER
                "phone", "tel" -> InputType.TYPE_CLASS_PHONE
                "decimal" -> InputType.TYPE_CLASS_NUMBER or InputType.TYPE_NUMBER_FLAG_DECIMAL
                "textarea", "multiline" -> InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_FLAG_MULTI_LINE
                else -> InputType.TYPE_CLASS_TEXT
            }

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
                        imm?.showSoftInput(v, android.view.inputmethod.InputMethodManager.SHOW_IMPLICIT)
                    }
                }
                false
            }

            // Sync with initial state & bind reactive updates
            if (stateKey.isNotEmpty()) {
                val initialValue = DolphinStateEngine.get(stateKey)?.toString() ?: ""
                if (initialValue.isNotEmpty()) {
                    setText(initialValue)
                }
                DolphinStateEngine.bindInput(stateKey, this)
            }

            // Real-time TextWatcher for NanoStore & Action handlers
            addTextChangedListener(object : TextWatcher {
                override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
                override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                    val text = s?.toString() ?: ""
                    if (stateKey.isNotEmpty()) {
                        DolphinStateEngine.set(stateKey, text)
                    }
                    onAction?.invoke("input:$stateKey", text)
                }
                override fun afterTextChanged(s: Editable?) {}
            })
        }
    }
}
