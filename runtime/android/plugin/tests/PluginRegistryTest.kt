package io.dolphin.runtime.plugin.tests

import io.dolphin.runtime.plugin.DolphinPluginRegistry
import io.dolphin.runtime.plugin.VideoPlayerPlugin
import org.junit.Assert.assertNotNull
import org.junit.Test

/**
 * 🧪 Unit Tests for Plugin System (`runtime/android/plugin`)
 */
class PluginRegistryTest {

    @Test
    fun testPluginRegistration() {
        val plugin = VideoPlayerPlugin()
        DolphinPluginRegistry.register(plugin)
        val registered = DolphinPluginRegistry.getPlugin(0x50.toByte())
        assertNotNull("VideoPlayerPlugin should be registered under opcode 0x50", registered)
    }
}
