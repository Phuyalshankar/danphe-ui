'use strict';

/**
 * 🐬 Dolphin Form Validators
 * Ready-made validation functions
 */

const validators = {
    // Email validation
    email: (value) => {
        const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return {
            isValid: emailRegex.test(value),
            error: emailRegex.test(value) ? '' : 'Invalid email address'
        };
    },

    // Phone validation
    phone: (value) => {
        const phoneRegex = /^[+]?[0-9]{10,15}$/;
        const clean = value.replace(/\s/g, '');
        return {
            isValid: phoneRegex.test(clean),
            error: phoneRegex.test(clean) ? '' : 'Invalid phone number'
        };
    },

    // Required field
    required: (value) => {
        const isValid = value && value.toString().trim().length > 0;
        return {
            isValid,
            error: isValid ? '' : 'This field is required'
        };
    },

    // Min length
    minLength: (minLen) => (value) => {
        const isValid = value && value.length >= minLen;
        return {
            isValid,
            error: isValid ? '' : `Minimum ${minLen} characters required`
        };
    },

    // Max length
    maxLength: (maxLen) => (value) => {
        const isValid = !value || value.length <= maxLen;
        return {
            isValid,
            error: isValid ? '' : `Maximum ${maxLen} characters allowed`
        };
    },

    // Password strength
    password: (value) => {
        const errors = [];
        
        if (!value || value.length < 8) errors.push('At least 8 characters required');
        if (!/[A-Z]/.test(value)) errors.push('At least one uppercase letter required');
        if (!/[a-z]/.test(value)) errors.push('At least one lowercase letter required');
        if (!/[0-9]/.test(value)) errors.push('At least one number required');
        
        return {
            isValid: errors.length === 0,
            error: errors.join(', ')
        };
    },

    // URL validation
    url: (value) => {
        try {
            new URL(value);
            return { isValid: true, error: '' };
        } catch {
            return { isValid: false, error: 'Invalid URL' };
        }
    },

    // Number validation
    number: (value) => {
        const isValid = !isNaN(parseFloat(value)) && isFinite(value);
        return {
            isValid,
            error: isValid ? '' : 'Must be a valid number'
        };
    },

    // Range validation
    range: (min, max) => (value) => {
        const num = parseFloat(value);
        const isValid = !isNaN(num) && num >= min && num <= max;
        return {
            isValid,
            error: isValid ? '' : `Value must be between ${min} and ${max}`
        };
    },

    // Pattern validation
    pattern: (regex, errorMsg) => (value) => {
        const isValid = regex.test(value);
        return {
            isValid,
            error: isValid ? '' : (errorMsg || 'Invalid format')
        };
    },

    // Match validation (for password confirmation)
    match: (otherValue, fieldName = 'field') => (value) => {
        const isValid = value === otherValue;
        return {
            isValid,
            error: isValid ? '' : `Does not match ${fieldName}`
        };
    }
};

/**
 * Validate multiple fields
 */
function validateForm(fields) {
    const errors = {};
    let isValid = true;

    for (const [fieldName, { value, validators: fieldValidators }] of Object.entries(fields)) {
        for (const validator of fieldValidators) {
            const result = validator(value);
            if (!result.isValid) {
                errors[fieldName] = result.error;
                isValid = false;
                break; // Stop at first error for this field
            }
        }
    }

    return { isValid, errors };
}

module.exports = { validators, validateForm };
