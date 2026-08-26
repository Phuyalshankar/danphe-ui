package io.dolphin.runtime


import android.content.Context
import android.view.View

/**
 * 📻 RadioButtonBuilder — Native RadioButton component builder (Opcode 0x1F)
 */
class RadioButtonBuilder : ComponentBuilder {
    override fun getType(): Int = 0x1F
    override fun getName(): String = "RadioButton"

    override fun build(ctx: Context, data: ByteArray, factory: ViewFactory): View {
        val stateKeyOrAction = factory.nextStr()
        val label = factory.nextStr()

        val view = FormRadioGroup.createRadioGroup(
            ctx = ctx,
            optionsCsv = label,
            stateKey = stateKeyOrAction,
            action = stateKeyOrAction,
            onAction = factory.onAction
        )

        factory.applyStyles(view, data)
        return view
    }
}
