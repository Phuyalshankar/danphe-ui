'use strict';

/**
 * DemoApp — Hooks Barrel
 *
 * Export all custom hooks from one place:
 *   const { useProducts, useCart } = require('./hooks');
 */

const { useProducts } = require('./useProducts');

module.exports = {
    useProducts,
    // Add new hooks here:
};
