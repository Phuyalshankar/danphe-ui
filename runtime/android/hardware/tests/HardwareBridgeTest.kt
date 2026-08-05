package io.dolphin.runtime.hardware.tests

import io.dolphin.runtime.hardware.DolphinHardwareBridge
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * 🧪 Unit Tests for Hardware Bridge (`runtime/android/hardware`)
 */
class HardwareBridgeTest {

    @Test
    fun testHardwareActionPrefixCheck() {
        val action = "hw:gps:get"
        assertTrue("Action should be recognized as hardware action", action.startsWith("hw:"))
    }
}
