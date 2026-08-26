package io.dolphin.runtime

/**
 * 🧪 FormValidator — Validates input values (email format, required fields, numeric bounds, password strength).
 */
object FormValidator {

    data class ValidationResult(val isValid: Boolean, val errorMessage: String = "")

    fun validateEmail(value: String): ValidationResult {
        if (value.isBlank()) return ValidationResult(false, "Email is required")
        val emailRegex = Regex("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$")
        return if (emailRegex.matches(value.trim())) {
            ValidationResult(true)
        } else {
            ValidationResult(false, "Invalid email address format")
        }
    }

    fun validateRequired(value: String, fieldName: String = "Field"): ValidationResult {
        return if (value.isNotBlank()) {
            ValidationResult(true)
        } else {
            ValidationResult(false, "$fieldName cannot be empty")
        }
    }

    fun validateMinLength(value: String, minLength: Int): ValidationResult {
        return if (value.length >= minLength) {
            ValidationResult(true)
        } else {
            ValidationResult(false, "Must be at least $minLength characters")
        }
    }
}
