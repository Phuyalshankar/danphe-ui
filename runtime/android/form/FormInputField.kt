package io.dolphin.runtime


import android.content.Context
import android.text.Editable
import android.text.InputType
import android.text.TextWatcher
import android.view.Gravity
import android.view.ViewGroup
import android.widget.LinearLayout
import com.google.android.material.textfield.TextInputEditText

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
    ): TextInputEditText {
        return TextInputEditText(ctx).apply {
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
            gravity = Gravity.CENTER_VERTICAL or Gravity.START
            setTextColor(textColor)
            setHint(hintText)

            // Set Input Type
            inputType = when (inputTypeStr.lowercase()) {
                "password" -> InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_PASSWORD
                "email" -> InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS
                "number", "phone" -> InputType.TYPE_CLASS_NUMBER
                "decimal" -> InputType.TYPE_CLASS_NUMBER or InputType.TYPE_NUMBER_FLAG_DECIMAL
                else -> InputType.TYPE_CLASS_TEXT
            }

            // Sync with initial state
            if (stateKey.isNotEmpty()) {
                val initialValue = DolphinStateEngine.get(stateKey)?.toString() ?: ""
                if (initialValue.isNotEmpty()) {
                    setText(initialValue)
                }
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
