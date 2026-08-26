package io.dolphin.runtime

import android.content.Context
import android.util.Log
import android.view.View
import android.widget.TextView

class TextBuilder : ComponentBuilder {
    override fun getType(): Int = 0x16
    override fun getName(): String = "Text"

    override fun build(ctx: Context, data: ByteArray, factory: ViewFactory): View {
        val content = factory.nextStr()
        Log.d("TextBuilder", "Building Text: '$content'")

        return TextView(ctx).apply {
            var targetKey: String? = null
            var defaultText: String = content

            if (content.startsWith("stateKey:") || content.startsWith("bus:")) {
                val key = content.removePrefix("stateKey:").removePrefix("bus:")
                if (key.contains("|")) {
                    defaultText = key.substringAfter("|")
                    targetKey = if (content.startsWith("bus:")) "bus:" + key.substringBefore("|") else key.substringBefore("|")
                } else {
                    targetKey = if (content.startsWith("bus:")) "bus:$key" else key
                    defaultText = ""
                }
            } else if (content.contains("[stateKey:") || content.contains("[bus:")) {
                val match = Regex("\\[(stateKey|bus):([a-zA-Z0-9_$\\.]+)\\]").find(content)
                if (match != null) {
                    val prefix = match.groupValues[1]
                    val rawKey = match.groupValues[2]
                    targetKey = if (prefix == "bus") "bus:$rawKey" else rawKey
                }
            }

            text = defaultText

            factory.applyStyles(this, data)
            factory.applyTextStyles(this, data)

            if (targetKey != null) {
                val colorCode = data[13].toInt() and 0xFF
                DolphinStateEngine.bind(key = targetKey, view = this, property = DolphinStateEngine.Property.TEXT, initialValue = defaultText, colorCode = colorCode)
            }
        }
    }
}
