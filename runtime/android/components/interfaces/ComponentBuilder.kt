package io.dolphin.runtime


import android.content.Context
import android.view.View

interface ComponentBuilder {
    fun build(ctx: Context, data: ByteArray, factory: ViewFactory): View
    fun getType(): Int
    fun getName(): String
}
