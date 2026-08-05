package io.dolphin.runtime.components.tests

import io.dolphin.runtime.components.builders.*
import org.junit.Assert.assertEquals
import org.junit.Test

/**
 * 🧪 Unit Tests for Component Builders (`runtime/android/components`)
 */
class ComponentBuildersTest {

    @Test
    fun testBuilderOpcodes() {
        val buttonBuilder = ButtonBuilder()
        assertEquals(0x10, buttonBuilder.getType())
        assertEquals("Button", buttonBuilder.getName())

        val cardBuilder = CardBuilder()
        assertEquals(0x11, cardBuilder.getType())
        assertEquals("Card", cardBuilder.getName())

        val rowBuilder = RowBuilder()
        assertEquals(0x14, rowBuilder.getType())
        assertEquals("Row", rowBuilder.getName())

        val textBuilder = TextBuilder()
        assertEquals(0x16, textBuilder.getType())
        assertEquals("Text", textBuilder.getName())
    }
}
