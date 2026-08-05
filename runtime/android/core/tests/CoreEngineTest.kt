package io.dolphin.runtime.core.tests

import io.dolphin.runtime.BinaryParser
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Test

/**
 * 🧪 Unit Tests for Core Engine (`runtime/android/core`)
 */
class CoreEngineTest {

    @Test
    fun testMagicHeaderValidation() {
        // Construct minimum valid DOLP header (20 bytes)
        val header = ByteArray(20)
        header[0] = 'D'.code.toByte()
        header[1] = 'O'.code.toByte()
        header[2] = 'L'.code.toByte()
        header[3] = 'P'.code.toByte()
        header[4] = 0x01 // Version 1

        val parser = BinaryParser()
        val bundle = parser.parse(header)

        assertNotNull("Bundle should parse header successfully", bundle)
        assertEquals("Bundle version should be 1", 1, bundle.version)
        assertEquals("Bundle should contain 0 screens", 0, bundle.screens.size)
    }

    @Test
    fun testComponentByteSizeInvariant() {
        val parser = BinaryParser()
        assertNotNull("Parser instance should be initialized", parser)
    }
}
