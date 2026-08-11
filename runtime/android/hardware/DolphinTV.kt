package io.dolphin.runtime

import android.app.UiModeManager
import android.content.Context
import android.content.res.Configuration
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.util.Log
import android.view.KeyEvent
import android.view.View
import android.view.ViewGroup

/**
 * 📺 DolphinTV v1.0 — Smart TV & Android TV Hardware Bridge
 * D-Pad Navigation, Remote Controller Focus Highlight, TV Resolution Detection
 */
object DolphinTV {
    private const val TAG = "DolphinTV"

    /** Check if device is running on Android TV or Large Industrial Panel */
    fun isSmartTV(ctx: Context): Boolean {
        val uiManager = ctx.getSystemService(Context.UI_MODE_SERVICE) as? UiModeManager
        if (uiManager?.currentModeType == Configuration.UI_MODE_TYPE_TELEVISION) {
            return true
        }
        val metrics = ctx.resources.displayMetrics
        val widthDp = metrics.widthPixels / metrics.density
        return widthDp >= 960 || metrics.widthPixels >= 1920
    }

    /** Enable D-Pad focus & glowing ring for Smart TV remote control navigation */
    fun setupTvFocus(view: View, focusColorHex: String = "#3B82F6") {
        view.isFocusable = true
        view.isFocusableInTouchMode = true

        val originalBackground = view.background
        val focusDrawable = GradientDrawable().apply {
            setColor(Color.TRANSPARENT)
            setStroke(6, Color.parseColor(focusColorHex))
            cornerRadius = 16f
        }

        view.setOnFocusChangeListener { v, hasFocus ->
            if (hasFocus) {
                v.elevation = 12f
                v.scaleX = 1.05f
                v.scaleY = 1.05f
                v.background = focusDrawable
                Log.d(TAG, "📺 D-Pad Focus on TV View ID: ${v.id}")
            } else {
                v.elevation = 0f
                v.scaleX = 1.0f
                v.scaleY = 1.0f
                v.background = originalBackground
            }
        }
    }

    /** Traverse view hierarchy and enable TV D-Pad focus on interactive components */
    fun enableTvFocusHierarchy(viewGroup: ViewGroup) {
        for (i in 0 until viewGroup.childCount) {
            val child = viewGroup.getChildAt(i)
            if (child is android.widget.Button || child.hasOnClickListeners()) {
                setupTvFocus(child)
            }
            if (child is ViewGroup) {
                enableTvFocusHierarchy(child)
            }
        }
    }

    /** Handle TV D-Pad Key Events (UP, DOWN, LEFT, RIGHT, CENTER CLICK) */
    fun handleTvKey(keyCode: Int, event: KeyEvent): Boolean {
        return when (keyCode) {
            KeyEvent.KEYCODE_DPAD_CENTER, KeyEvent.KEYCODE_ENTER -> {
                Log.d(TAG, "📺 TV D-Pad Center/Enter Clicked")
                false // Allow default click dispatch
            }
            KeyEvent.KEYCODE_DPAD_UP, KeyEvent.KEYCODE_DPAD_DOWN,
            KeyEvent.KEYCODE_DPAD_LEFT, KeyEvent.KEYCODE_DPAD_RIGHT -> {
                Log.d(TAG, "📺 TV D-Pad Navigation: $keyCode")
                false
            }
            else -> false
        }
    }
}
