package io.dolphin.runtime.animation.tests

import org.junit.Assert.assertEquals
import org.junit.Test

/**
 * 🧪 Unit Tests for Animation Engine (`runtime/android/animation`)
 */
class AnimationEngineTest {

    @Test
    fun testAnimationDurationParsing() {
        val animSpec = "fade:300"
        val duration = animSpec.split(":")[1].toLong()
        assertEquals(300L, duration)
    }
}
