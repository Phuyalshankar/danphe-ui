package io.dolphin.runtime

import android.content.Context
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import com.google.android.material.button.MaterialButton

class ButtonBuilder : ComponentBuilder {
    override fun getType(): Int = 0x10
    override fun getName(): String = "Button"

    override fun build(ctx: Context, data: ByteArray, factory: ViewFactory): View {
        val action = factory.nextStr()
        val textStr = factory.nextStr()
        val iconStr = factory.nextStr() // Read 3rd string iconStr to maintain strict string pool alignment

        val displayTitle = when {
            textStr.isNotEmpty() -> textStr
            action.isNotEmpty() -> action.removePrefix("nav:").removePrefix("tab:").removePrefix("app:")
            else -> ""
        }

        Log.d("ButtonBuilder", "Building Button: displayTitle='$displayTitle', action='$action', icon='$iconStr'")

        return MaterialButton(ctx).apply {
            text = displayTitle
            isAllCaps = false
            cornerRadius = factory.dp(8)
            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
            stateListAnimator = null // Disable Android Material Button default state animator to allow custom animations

            factory.applyStyles(this, data)
            factory.applyTextStyles(this, data)

            // Guarantee text is ALWAYS 100% centered horizontally & vertically inside MaterialButton
            gravity = android.view.Gravity.CENTER
            textAlignment = View.TEXT_ALIGNMENT_CENTER

            if (action.isNotEmpty()) {
                setOnClickListener {
                    if (action.startsWith("anim:")) {
                        val animName = action.substring(5)
                        DolphinEventDebugger.trace(this, action, "AnimationEngine", "EXECUTED", "animStr=$animName")
                        AnimationEngine.apply(this, animName)
                        factory.onAction?.invoke(action, displayTitle)
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
                        factory.onAction?.invoke(action, displayTitle)
                    } else {
                        DolphinStateEngine.handleAction(action)
                        DolphinEventDebugger.trace(this, action, "DolphinRuntime", "DISPATCHED")
                        factory.onAction?.invoke(action, displayTitle)
                    }
                }
            }
        }
    }
}
