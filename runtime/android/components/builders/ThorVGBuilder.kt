package io.dolphin.runtime

import android.content.Context
import android.view.View

/**
 * ⚡ ThorVGBuilder — Opcode 0x61
 *
 * Samsung ThorVG 120 FPS Hardware-Accelerated Vector Graphics View
 */
class ThorVGBuilder : ComponentBuilder {

    companion object {
        const val OPCODE = 0x61
    }

    override fun getType(): Int = OPCODE

    override fun getName(): String = "ThorVG"

    override fun build(ctx: Context, bin: ByteArray, factory: ViewFactory): View {
        val action = factory.nextStr()
        val svgData = factory.nextStr()

        return ThorVGView(ctx).apply {
            if (svgData.isNotEmpty()) {
                setSvg(svgData)
            }
            if (action.isNotEmpty()) {
                setTouchHandler { _, _, act ->
                    if (act == "up") {
                        factory.onAction?.invoke(action, null)
                    }
                }
            }
            factory.applyStyles(this, bin)
        }
    }
}
