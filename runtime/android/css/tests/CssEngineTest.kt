package io.dolphin.runtime.css.tests

import android.graphics.Color
import io.dolphin.runtime.ViewFactory
import org.junit.Assert.assertEquals
import org.junit.Test

/**
 * 🧪 Unit Tests for CSS & Color Parsing (`runtime/android/css`)
 */
class CssEngineTest {

    @Test
    fun testTransparentColorCode() {
        val parsed = ViewFactory.parseColor(23, 0)
        assertEquals(Color.TRANSPARENT, parsed)
    }
}
