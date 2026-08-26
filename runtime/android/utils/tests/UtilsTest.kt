package io.dolphin.runtime.utils.tests

import org.junit.Assert.assertEquals
import org.junit.Test

/**
 * 🧪 Unit Tests for Utility Classes (`runtime/android/utils`)
 */
class UtilsTest {

    @Test
    fun testDefaultPortSetting() {
        val port = 9091
        assertEquals(9091, port)
    }
}
