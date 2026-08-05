package io.dolphin.runtime


import android.content.Context
import android.view.View

interface DolphinUIPlugin {
    /**
     * The 1-byte HEX code representing this UI component (e.g., 0x10 for Button)
     */
    val typeCode: Byte

    /**
     * Called when the Native Runtime encounters this component's type code.
     * @param ctx The Android Context
     * @param bin The 16-byte binary payload for this component
     * @param factory The ViewFactory instance to read strings or build child components
     * @return The fully constructed Android View
     */
    fun createView(ctx: Context, bin: ByteArray, factory: ViewFactory): View
}

object DolphinPluginRegistry {
    private val plugins = mutableMapOf<Byte, DolphinUIPlugin>()

    init {
        register(VideoPlayerPlugin())
        register(CalendarPlugin())
    }

    /**
     * External developers can call this method to register their own custom components.
     * Example: DolphinPluginRegistry.register(VideoPlayerPlugin())
     */
    fun register(plugin: DolphinUIPlugin) {
        plugins[plugin.typeCode] = plugin
    }

    /**
     * Used by ViewFactory to resolve a binary code to its plugin.
     */
    fun getPlugin(typeCode: Byte): DolphinUIPlugin? {
        return plugins[typeCode]
    }
    
    /**
     * Get all registered plugins.
     */
    fun getAllPlugins(): Collection<DolphinUIPlugin> {
        return plugins.values
    }
}
