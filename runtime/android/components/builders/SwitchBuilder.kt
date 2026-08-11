package io.dolphin.runtime

import android.content.Context
import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.graphics.drawable.StateListDrawable
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView
import com.google.android.material.switchmaterial.SwitchMaterial

/**
 * 🔘 SwitchBuilder — Custom Row container + Material Switch
 *  - Left: TextView for label (always 100% visible with customizable text color/size)
 *  - Right: SwitchMaterial toggle (customizable track width/height and ON/OFF colors)
 *  - trackTintList is set via ColorStateList so ON state track is explicitly colored (emerald, blue, rose, etc.)
 */
class SwitchBuilder : ComponentBuilder {
    override fun getType(): Int = 0x1A
    override fun getName(): String = "Switch"

    override fun build(ctx: Context, data: ByteArray, factory: ViewFactory): View {
        val stateKeyOrAction = factory.nextStr()
        val labelText = factory.nextStr()
        val trackSizeStr = factory.nextStr()
        val trackColorStr = factory.nextStr()
        val isDark = DolphinStateEngine.themeLevel > 128

        // 1. Custom track size from string pool ("w|h")
        var customTrackW = 0
        var customTrackH = 0
        if (trackSizeStr.isNotEmpty() && trackSizeStr.contains("|")) {
            val parts = trackSizeStr.split("|")
            customTrackW = parts.getOrNull(0)?.toIntOrNull() ?: 0
            customTrackH = parts.getOrNull(1)?.toIntOrNull() ?: 0
        }

        // 2. Parse Track ON Color: check trackColorStr first, then binary data[3]/data[2]
        var trackOnColor: Int = Color.parseColor("#22c55e")
        if (trackColorStr.isNotEmpty()) {
            try {
                val hex = TailwindColorResolver.resolveHex(trackColorStr)
                if (hex.isNotEmpty()) {
                    trackOnColor = Color.parseColor(hex)
                }
            } catch (_: Exception) {}
        } else {
            val bgColorIndex = data[3].toInt() and 0xFF
            val bgShade     = data[2].toInt() and 0xFF
            if (bgColorIndex != 0) {
                try { trackOnColor = ColorParser.parseColor(bgColorIndex, bgShade) }
                catch (_: Exception) {}
            }
        }

        val trackOffColor = Color.parseColor("#475569")

        // ColorStateList for SwitchMaterial track & thumb
        val trackColorStateList = ColorStateList(
            arrayOf(
                intArrayOf(android.R.attr.state_checked),
                intArrayOf(-android.R.attr.state_checked)
            ),
            intArrayOf(
                trackOnColor,
                trackOffColor
            )
        )

        val thumbColorStateList = ColorStateList(
            arrayOf(
                intArrayOf(android.R.attr.state_checked),
                intArrayOf(-android.R.attr.state_checked)
            ),
            intArrayOf(
                Color.WHITE,
                Color.parseColor("#cbd5e1")
            )
        )

        // 3. Parse Label Text Color from binary: data[13] = color index, data[12] = shade
        val fgColorIndex = data[13].toInt() and 0xFF
        val fgShade      = data[12].toInt() and 0xFF
        val labelTextColor: Int = if (fgColorIndex != 0) {
            try { ColorParser.parseColor(fgColorIndex, fgShade) }
            catch (_: Exception) { if (isDark) Color.WHITE else Color.parseColor("#0f172a") }
        } else {
            if (isDark) Color.WHITE else Color.parseColor("#0f172a")
        }

        // 4. Size Calculations
        val paddingTopDp = data[4].toInt() and 0xFF
        val thumbSizeDp: Int
        val trackHeightDp: Int
        val trackWidthDp: Int

        if (customTrackW > 0 || customTrackH > 0) {
            trackWidthDp = if (customTrackW > 0) customTrackW else 52
            trackHeightDp = if (customTrackH > 0) customTrackH else Math.max(24, trackWidthDp / 2)
            thumbSizeDp = Math.max(14, trackHeightDp - 6)
        } else if (paddingTopDp > 0) {
            thumbSizeDp = when {
                paddingTopDp >= 8 -> 34
                paddingTopDp >= 6 -> 28
                paddingTopDp >= 4 -> 24
                else -> 20
            }
            trackHeightDp = thumbSizeDp + 8
            trackWidthDp = thumbSizeDp * 2 + 8
        } else {
            thumbSizeDp = 22
            trackHeightDp = 28
            trackWidthDp = 52
        }

        // 5. Custom Drawables for Track and Thumb
        val thumbOn = GradientDrawable().apply {
            shape = GradientDrawable.OVAL
            setColor(Color.WHITE)
            setSize(factory.dp(thumbSizeDp), factory.dp(thumbSizeDp))
        }
        val thumbOff = GradientDrawable().apply {
            shape = GradientDrawable.OVAL
            setColor(Color.parseColor("#cbd5e1"))
            setSize(factory.dp(thumbSizeDp), factory.dp(thumbSizeDp))
        }
        val thumbDrawable = StateListDrawable().apply {
            addState(intArrayOf(android.R.attr.state_checked), thumbOn)
            addState(intArrayOf(), thumbOff)
        }

        val trackOn = GradientDrawable().apply {
            shape = GradientDrawable.RECTANGLE
            cornerRadius = factory.dp(trackHeightDp / 2).toFloat()
            setColor(trackOnColor)
            setSize(factory.dp(trackWidthDp), factory.dp(trackHeightDp))
        }
        val trackOff = GradientDrawable().apply {
            shape = GradientDrawable.RECTANGLE
            cornerRadius = factory.dp(trackHeightDp / 2).toFloat()
            setColor(trackOffColor)
            setSize(factory.dp(trackWidthDp), factory.dp(trackHeightDp))
        }
        val trackDrawable = StateListDrawable().apply {
            addState(intArrayOf(android.R.attr.state_checked), trackOn)
            addState(intArrayOf(), trackOff)
        }

        // 6. Build Container Layout
        val container = LinearLayout(ctx).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(factory.dp(8), factory.dp(6), factory.dp(8), factory.dp(6))
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ).apply {
                setMargins(0, factory.dp(4), 0, factory.dp(4))
            }
        }

        // 7. Label TextView (Left)
        val textView = TextView(ctx).apply {
            text = labelText
            textSize = 16f
            setTextColor(labelTextColor)
            layoutParams = LinearLayout.LayoutParams(
                0,
                ViewGroup.LayoutParams.WRAP_CONTENT,
                1.0f
            )
        }
        container.addView(textView)

        // 8. Material Switch (Right)
        val switchView = SwitchMaterial(ctx).apply {
            this.thumbDrawable = thumbDrawable
            this.trackDrawable = trackDrawable
            this.trackTintList = trackColorStateList
            this.thumbTintList = thumbColorStateList
            setBackgroundColor(Color.TRANSPARENT)

            // Enforce custom track dimensions on SwitchMaterial view
            switchMinWidth = factory.dp(trackWidthDp)
            minimumWidth = factory.dp(trackWidthDp)
            minimumHeight = factory.dp(trackHeightDp)

            layoutParams = LinearLayout.LayoutParams(
                factory.dp(trackWidthDp),
                factory.dp(trackHeightDp)
            )

            // Initial State: Default to checked (ON) if not set, so color is immediately visible
            var initialChecked = true
            if (stateKeyOrAction.isNotEmpty()) {
                val s = DolphinStateEngine.get(stateKeyOrAction)?.toString() ?: ""
                if (s.isNotEmpty()) {
                    initialChecked = s.toBoolean()
                } else {
                    DolphinStateEngine.set(stateKeyOrAction, "true")
                }
            }
            isChecked = initialChecked

            setOnCheckedChangeListener { _, checked ->
                if (stateKeyOrAction.isNotEmpty()) {
                    DolphinStateEngine.set(stateKeyOrAction, checked.toString())
                    factory.onAction?.invoke(stateKeyOrAction, checked)
                }
            }
        }
        container.addView(switchView)

        // Click on entire row toggles switch
        container.isClickable = true
        container.setOnClickListener {
            switchView.toggle()
        }

        factory.applyStyles(container, data)

        // Clear container background so card/row isn't colored
        container.background = null
        container.setBackgroundColor(Color.TRANSPARENT)

        return container
    }
}
