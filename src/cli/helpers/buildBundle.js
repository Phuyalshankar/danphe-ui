'use strict';

/**
 * 🌊 Dolphin — Build Bundle Helper
 * Shared utility used by `dev` and `build` commands.
 * Loads the app entry file, serializes all screens/components into
 * the Dolphin Binary Protocol (.dolp) buffer.
 */

const path = require('path');
const fs = require('fs');
const { DolphinBinaryProtocol } = require('../../protocol/DolphinBinaryProtocol');

const INITIAL_STATE_MARKER = '__DOLPHIN_INITIAL_STATE__:';

function loadInitialStoreState(appPath) {
    const projectRoot = path.dirname(appPath);
    const storePaths = [
        path.join(projectRoot, 'store', 'appStore.js'),
        path.join(projectRoot, 'store', 'index.js'),
        path.join(projectRoot, 'store.js'),
    ];

    for (const storePath of storePaths) {
        if (!fs.existsSync(storePath)) continue;
        try {
            delete require.cache[require.resolve(storePath)];
            const storeModule = require(storePath);
            const store = storeModule.default || storeModule.appStore || storeModule.nanoStore || storeModule.store || storeModule;
            const state = store && typeof store.get === 'function' ? store.get() : null;
            if (state && typeof state === 'object' && !Array.isArray(state)) return state;
        } catch (error) {
            console.warn(`   ⚠️ Could not load initial NanoStore state from ${storePath}: ${error.message}`);
        }
    }
    return {};
}

/**
 * Build a .dolp bundle from the given app entry file.
 *
 * @param {string} appPath   - Absolute path to app.js / app.jsx
 * @param {object} config    - dolphin.config.js contents
 * @returns {{ buffer, screens, entry, actionHandler, appInstance }}
 */
function buildBundle(appPath, config) {
    const app = require(appPath);
    const initialStoreState = loadInitialStoreState(appPath);

    // Support both: DolphinApp instance (export app) or pre-built bundle (export app.build())
    const isInstance = app && app.constructor && app.constructor.name === 'DolphinApp';
    const appBundle  = isInstance ? app.build() : app;

    const protocol   = new DolphinBinaryProtocol();

    console.log('   🔍 App screens:', Object.keys(appBundle.screens || {}));

    const screens    = [];
    const components = [];
    let   compOffset = 0;

    for (const [name, screen] of Object.entries(appBundle.screens || {})) {
        console.log(`   🔍 Screen "${name}":`, {
            binaryType:    screen.binaryType,
            binaryIsBuffer: Buffer.isBuffer(screen.binary),
            binaryIsArray:  Array.isArray(screen.binary),
            binaryLength:   screen.binary
                ? (Buffer.isBuffer(screen.binary) ? screen.binary.length : screen.binary.length)
                : 0,
            rawDataLength: screen.rawData ? screen.rawData.length : 0,
        });

        const screenComps = [];

        if (Array.isArray(screen.binary)) {
            screen.binary.forEach(bin => {
                if (bin && bin.length >= 16) {
                    components.push(Buffer.from(bin.slice(0, 16)));
                    screenComps.push(Buffer.from(bin.slice(0, 16)));
                }
            });
        } else if (Buffer.isBuffer(screen.binary)) {
            for (let i = 0; i < screen.binary.length; i += 16) {
                if (i + 16 <= screen.binary.length) {
                    const chunk = screen.binary.slice(i, i + 16);
                    components.push(chunk);
                    screenComps.push(chunk);
                }
            }
        }

        const rawData = screen.rawData || Buffer.alloc(0);
        const stateData = Object.keys(initialStoreState).length > 0
            ? Buffer.concat([rawData, Buffer.from(`${INITIAL_STATE_MARKER}${JSON.stringify(initialStoreState)}\0`, 'utf8')])
            : rawData;

        screens.push({
            name,
            data:            stateData,
            componentOffset: compOffset,
            components:      screenComps,
        });
        compOffset += screenComps.length;

        console.log(`   📱 "${name}": ${screenComps.length} components`);
    }

    console.log(`   📦 Total: ${screens.length} screens, ${components.length} components`);

    return {
        buffer: protocol.serialize({
            screens,
            components,
            entry:  appBundle.entry,
            drawer: appBundle.drawer,
            flags:  appBundle.flags || 0,
        }),
        screens,
        entry:         appBundle.entry,
        actionHandler: appBundle.__actionHandler,
        appInstance:   isInstance ? app : null,
    };
}

module.exports = { buildBundle };
