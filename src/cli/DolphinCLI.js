'use strict';

/**
 * 🌊 Dolphin CLI — Main Dispatcher
 * Parses process.argv and routes to the correct command handler.
 *
 * Called by: bin/dolphin.js
 */

const path = require('path');
const globalNativePath = path.resolve(__dirname, '../../');
if (module.paths && !module.paths.includes(globalNativePath)) {
    module.paths.unshift(globalNativePath);
}

const { cmdInit, cmdDev, cmdBuild, cmdInspect, cmdAndroid, cmdDoctor, cmdGenerate, cmdThorVG, showHelp } = require('./commands');

// ── Enable JSX via Babel globally ───────────────────────────────
try {
    const babelRegister = require(require.resolve('@babel/register', { paths: [globalNativePath, process.cwd()] }));
    const pluginPath = require.resolve('@babel/plugin-transform-react-jsx', { paths: [globalNativePath, process.cwd()] });
    babelRegister({
        presets: [],
        plugins: [[pluginPath, { pragma: 'React.createElement', runtime: 'classic' }]],
        extensions: ['.js', '.jsx'],
        only: [() => true],
        ignore: [
            (filepath) => {
                if (filepath && filepath.includes('dolphin-native')) return false;
                return /node_modules/.test(filepath);
            }
        ],
    });
    // Stub React.createElement so Babel output doesn't crash at runtime
    global.React = {
        createElement(type, props, ...children) {
            const flatChildren = children.flat(Infinity).filter(c => c !== null && c !== undefined && c !== false);
            return {
                $$typeof: Symbol.for('react.element'),
                type,
                props: { ...props, children: flatChildren.length === 1 ? flatChildren[0] : flatChildren },
            };
        },
    };
} catch (e) {
    // @babel/register warning catch
}

// ── Parse argv ────────────────────────────────────────────────────────────────
const [,, command, sub, ...rest] = process.argv;
const allArgs = [sub, ...rest].filter(Boolean);

let version = '1.0.0';
try { version = require('../../package.json').version; } catch (e) {}

// ── Dispatch ──────────────────────────────────────────────────────────────────
async function main() {
    switch (command) {
        case 'init':     await cmdInit(sub);                 process.exit(0);
        case 'dev':      await cmdDev(allArgs);              break;
        case 'build':    await cmdBuild(allArgs);            process.exit(0);
        case 'inspect':  await cmdInspect(sub);              process.exit(0);
        case 'android':  await cmdAndroid(sub, rest);        process.exit(0);
        case 'doctor':   await cmdDoctor(allArgs);           process.exit(0);
        case 'thorvg':   await cmdThorVG(allArgs);           process.exit(0);
        case 'g':
        case 'generate': await cmdGenerate(sub, rest[0]);    process.exit(0);
        default:         showHelp(version);                  process.exit(0);
    }
}

if (require.main && (require.main.filename.endsWith('dolphin.js') || require.main.filename.endsWith('dolphin-mobile.js') || require.main.filename.endsWith('DolphinCLI.js'))) {
    main().catch(err => {
        console.error(err);
        process.exit(1);
    });
}

