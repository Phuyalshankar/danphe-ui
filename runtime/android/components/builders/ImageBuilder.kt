package io.dolphin.runtime



import android.content.Context
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.LinearLayout

/**
 * 🖼️ ImageBuilder — Native ImageView component builder (Opcode 0x17)
 */
class ImageBuilder : ComponentBuilder {
    override fun getType(): Int = 0x17
    override fun getName(): String = "Image"

    override fun build(ctx: Context, data: ByteArray, factory: ViewFactory): View {
        val url = factory.nextStr()
        val imageView = ImageView(ctx).apply {
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
            scaleType = ImageView.ScaleType.CENTER_CROP
        }

        if (url.isNotEmpty()) {
            DolphinStateEngine.imageLoader?.invoke(imageView, url)
        }

        factory.applyStyles(imageView, data)
        return imageView
    }
}
