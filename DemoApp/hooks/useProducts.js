'use strict';

/**
 * useProducts — fetch and manage product data.
 *
 * @param {string} [jsonPath]  Optional path to local products.json
 * @returns {{ products, loading, error, getById, getByCategory }}
 */

const fs   = require('fs');
const path = require('path');

function useProducts(jsonPath) {
    const filePath = jsonPath || path.resolve(process.cwd(), 'products.json');

    let products = [];
    let loading  = true;
    let error    = null;

    try {
        if (fs.existsSync(filePath)) {
            const raw = fs.readFileSync(filePath, 'utf8');
            products  = JSON.parse(raw);
        } else {
            error = `products.json not found at: ${filePath}`;
        }
        loading = false;
    } catch (e) {
        error   = e.message;
        loading = false;
    }

    /**
     * Get a single product by ID.
     * @param {string|number} id
     */
    function getById(id) {
        return products.find(p => String(p.id) === String(id)) || null;
    }

    /**
     * Get all products in a category.
     * @param {string} category
     */
    function getByCategory(category) {
        return products.filter(p =>
            (p.category || '').toLowerCase() === category.toLowerCase()
        );
    }

    return { products, loading, error, getById, getByCategory };
}

module.exports = { useProducts };
