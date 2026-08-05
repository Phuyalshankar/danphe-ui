package io.dolphin.runtime


import android.content.Context
import android.view.View

/**
 * ☑️ CheckboxBuilder — Native Checkbox component builder (Opcode 0x1B)
 */
class CheckboxBuilder : ComponentBuilder {
    override fun getType(): Int = 0x1B
    override fun getName(): String = "Checkbox"

    override fun build(ctx: Context, data: ByteArray, factory: ViewFactory): View {
        val stateKeyOrAction = factory.nextStr()
        val label = factory.nextStr()

        val view = FormCheckbox.createCheckbox(
            ctx = ctx,
            label = label,
            stateKey = stateKeyOrAction,
            action = stateKeyOrAction,
            onAction = factory.onAction
        )

        factory.applyStyles(view, data)
        return view
    }
}
