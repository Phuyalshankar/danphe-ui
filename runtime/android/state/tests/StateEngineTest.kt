package io.dolphin.runtime.state.tests

import io.dolphin.runtime.DolphinStateEngine
import org.junit.Assert.assertEquals
import org.junit.Test

/**
 * 🧪 Unit Tests for State Engine (`runtime/android/state`)
 */
class StateEngineTest {

    @Test
    fun testStateSetAndGet() {
        DolphinStateEngine.declareIfAbsent("testKey", "hello")
        assertEquals("hello", DolphinStateEngine.get("testKey"))

        DolphinStateEngine.set("testKey", "world")
        assertEquals("world", DolphinStateEngine.get("testKey"))
    }
}
