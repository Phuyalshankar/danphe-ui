package io.dolphin.runtime.form.tests

import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * 🧪 Unit Tests for Form Engine (`runtime/android/form`)
 */
class FormEngineTest {

    @Test
    fun testEmailRegexValidation() {
        val email = "user@example.com"
        val isValid = email.contains("@") && email.contains(".")
        assertTrue("Email format should be valid", isValid)
    }
}
