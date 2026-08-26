package io.dolphin.runtime


import android.content.Context
import android.view.View

/**
 * 🔽 SelectBuilder — Native Select dropdown component builder (Opcode 0x1C)
 */
class SelectBuilder : ComponentBuilder {
    override fun getType(): Int = 0x1C
    override fun getName(): String = "Select"

    override fun build(ctx: Context, data: ByteArray, factory: ViewFactory): View {
        val stateKeyOrAction = factory.nextStr()
        val label = factory.nextStr()
        val optionsCsv = factory.nextStr()
        val initialValueStr = factory.nextStr() // Consume 4th string to maintain strict string pool alignment

        val view = FormSelect.createSelect(
            ctx = ctx,
            label = label,
            optionsCsv = optionsCsv,
            stateKey = stateKeyOrAction,
            action = stateKeyOrAction,
            onAction = factory.onAction
        )

        factory.applyStyles(view, data)
        return view
    }
}
