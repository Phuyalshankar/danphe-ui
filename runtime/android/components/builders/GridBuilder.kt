package io.dolphin.runtime

import android.content.Context
import android.view.View

/**
 * 🔲 GridBuilder — ComponentBuilder for Opcode 0x22 (GridView)
 * Routes opcode 0x22 directly to factory.createSimpleGrid(data) for multi-column layout rendering.
 */
class GridBuilder : ComponentBuilder {
    override fun getType(): Int = 0x22
    override fun getName(): String = "GridView"

    override fun build(ctx: Context, data: ByteArray, factory: ViewFactory): View {
        return factory.createSimpleGrid(data)
    }
}
