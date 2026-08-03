package io.dolphin.runtime.plugin

import android.content.Context
import android.graphics.Color
import android.view.View
import android.widget.CalendarView
import android.widget.FrameLayout
import android.widget.Toast
import io.dolphin.runtime.ViewFactory

/**
 * 🔌 Third-Party Kotlin UI Plugin Example: CalendarPlugin
 * Implements DolphinUIPlugin interface to return a 100% Native Android View!
 */
class CalendarPlugin : DolphinUIPlugin {
    override val typeCode: Byte = 0x55 // Custom UI Plugin Byte Code

    override fun createView(ctx: Context, bin: ByteArray, factory: ViewFactory): View {
        val action = factory.nextStr()

        val container = FrameLayout(ctx).apply {
            setBackgroundColor(Color.WHITE)
        }

        val calendarView = CalendarView(ctx).apply {
            setOnDateChangeListener { _, year, month, dayOfMonth ->
                val selectedDate = "$year-${month + 1}-$dayOfMonth"
                Toast.makeText(ctx, "📅 Native Kotlin Plugin Selected Date: $selectedDate", Toast.LENGTH_SHORT).show()
                if (action.isNotEmpty()) {
                    factory.onAction?.invoke(action, selectedDate)
                }
            }
        }

        container.addView(calendarView, FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.WRAP_CONTENT
        ))

        return container
    }
}
