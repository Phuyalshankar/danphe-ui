'use strict';

/**
 * DemoApp — Pages Barrel
 *
 * Export all screens from one place so app.jsx stays clean:
 *   const { HomeScreen, ProductScreen } = require('./pages');
 */

const { HomeScreen } = require('./HomeScreen');

module.exports = {
    HomeScreen,
    // Add new screens here:
    // ProductScreen: require('./ProductScreen').ProductScreen,
};
