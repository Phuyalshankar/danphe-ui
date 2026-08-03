'use strict';

/**
 * DemoApp — Utils Barrel
 *
 * Shared utility functions used across screens and components.
 * Import: const { formatPrice, truncate, slugify } = require('./utils');
 */

/**
 * Format a number as a currency string.
 * @param {number} amount
 * @param {string} [currency='USD']
 */
function formatPrice(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style:    'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(amount);
}

/**
 * Truncate a string to maxLen characters, appending '…'.
 * @param {string} str
 * @param {number} [maxLen=40]
 */
function truncate(str, maxLen = 40) {
    if (!str || str.length <= maxLen) return str;
    return str.slice(0, maxLen).trimEnd() + '…';
}

/**
 * Convert a string to a URL-safe slug.
 * @param {string} str
 */
function slugify(str) {
    return (str || '')
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, '-')
        .replace(/[^\w-]/g, '');
}

/**
 * Clamp a number between min and max.
 * @param {number} val
 * @param {number} min
 * @param {number} max
 */
function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

/**
 * Debounce a function.
 * @param {Function} fn
 * @param {number}   delay  ms
 */
function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

module.exports = { formatPrice, truncate, slugify, clamp, debounce };
