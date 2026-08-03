'use strict';

/**
 * DemoApp — Store Barrel
 *
 * Central state management for the app.
 * Uses Dolphin NanoStore for reactive state management.
 *
 * Usage:
 *   const { appStore, userStore } = require('./store');
 *   appStore.set('counter', 5);
 *   appStore.get('counter'); // returns 5
 */

const { createNanoStore, atom } = require('dolphin-native');

// ══════════════════════════════════════════════════════════════════════════════
// Main Application Store (NanoStore instance)
// ══════════════════════════════════════════════════════════════════════════════
const appStore = createNanoStore({
    // Counter demo
    counter: 5,
    
    // Theme
    theme: 'light',
    
    // User status
    userStatus: 'shankar',
    
    // Notification message
    notification: 'Welcome to test-app NanoStore!',
    
    // Auth state
    isLoggedIn: false,
    
    // Navigation
    activeNav: 'Home',
    activeTab: 'Home'
});

// ══════════════════════════════════════════════════════════════════════════════
// User Store (Separate store for user-related data)
// ══════════════════════════════════════════════════════════════════════════════
const userStore = createNanoStore({ 
    name: null, 
    loggedIn: false 
});

// ══════════════════════════════════════════════════════════════════════════════
// Cart Store (E-commerce example)
// ══════════════════════════════════════════════════════════════════════════════
const cartStore = createNanoStore({ 
    items: [], 
    total: 0 
});

// ══════════════════════════════════════════════════════════════════════════════
// Atom Instance for Independent State (alternative to store keys)
// ══════════════════════════════════════════════════════════════════════════════
const activeTabAtom = atom('HomeTab');

module.exports = { appStore, cartStore, userStore, activeTabAtom };

