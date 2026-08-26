package io.dolphin.runtime

import android.content.Context
import android.view.View

/**
 * 🎚️ SliderBuilder — Native Range Slider component builder (Opcode 0x19)
 */
class SliderBuilder : ComponentBuilder {
    override fun getType(): Int = 0x19
    override fun getName(): String = "Slider"

    override fun build(ctx: Context, data: ByteArray, factory: ViewFactory): View {
        val view = factory.createSlider(data)
        factory.applyStyles(view, data)
        return view
    }
}