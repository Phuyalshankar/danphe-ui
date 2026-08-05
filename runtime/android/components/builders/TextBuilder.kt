package io.dolphin.runtime



import android.content.Context
import android.util.Log
import android.view.View
import android.widget.TextView

class TextBuilder : ComponentBuilder {
    override fun getType(): Int = 0x16
    override fun getName(): String = "Text"

    override fun build(ctx: Context, data: ByteArray, factory: ViewFactory): View {
        val rawContent = factory.nextStr()

        // Safety Filter: If string pool ever gets out of sync and passes raw size string (e.g. 0|0|0|0), clear it
        val content = if (rawContent.matches(Regex("^\\d+\\|\\d+\\|\\d+\\|\\d+$"))) "" else rawContent

        Log.d("TextBuilder", "Building Text: '$content'")

        return TextView(ctx).apply {
            var targetKey: String? = null
            var defaultText: String = content

            if (content.startsWith("stateKey:")) {
                val key = content.removePrefix("stateKey:")
                defaultText = key.substringAfterLast("|", "")
                targetKey   = key.substringBeforeLast("|")
            } else if (content.contains("[stateKey:")) {
                val match = Regex("\\[stateKey:([a-zA-Z0-9_$]+)\\]").find(content)
                if (match != null) {
                    targetKey = match.groupValues[1]
                }
            }

            text = defaultText

            factory.applyStyles(this, data)
            factory.applyTextStyles(this, data)

            if (targetKey != null) {
                val colorCode = data[13].toInt() and 0xFF
                DolphinStateEngine.bind(key = targetKey, view = this, property = DolphinStateEngine.Property.TEXT, colorCode = colorCode)
            }
        }
    }
}
