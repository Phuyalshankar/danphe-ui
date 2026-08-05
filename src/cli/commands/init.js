'use strict';

/**
 * 🌊 Dolphin CLI — `init` command
 * Scaffold a new Dolphin mobile project — EXACT 1:1 Clone of mini-phone frontend architecture.
 *
 * Usage: dolphin init <AppName>
 */

const path = require('path');
const fs   = require('fs');

function cmdInit(appName) {
    if (!appName) {
        console.error('❌  Usage: dolphin init <AppName>');
        process.exit(1);
    }

    const dir = path.resolve(process.cwd(), appName);
    if (fs.existsSync(dir)) {
        console.error(`❌  Directory "${appName}" already exists.`);
        process.exit(1);
    }

    // ── Folder structure ────────────────────────────────────────
    const folders = [
        'pages',
        'components',
        'hooks',
        'actions',
        'store',
        'utils',
        'assets',
        'assets/images',
        'assets/fonts',
        'dist',
    ];
    fs.mkdirSync(dir, { recursive: true });
    folders.forEach(f => fs.mkdirSync(path.join(dir, f), { recursive: true }));

    // ── dolphin.config.js ───────────────────────────────────────
    fs.writeFileSync(path.join(dir, 'dolphin.config.js'),
`'use strict';

module.exports = {
    app:      '${appName}',
    package:  'com.${appName.toLowerCase().replace(/[^a-z0-9_]/g, '')}.app',
    version:  '1.0.0',
    platform: 'NATIVE',
    entry:    'Home',
    icon:     'assets/icon.png',
    icons:    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    cdns: [
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
        'https://cdn.jsdelivr.net/npm/@mui/material@5.14.0/umd/material-ui.development.js'
    ],
    splash:   'assets/splash.png',
    dev: {
        host:     '0.0.0.0',
        port:     7788,
        httpPort: 7787,
    }
};
`);

    // ── Generate Default Assets (1x1 transparent PNGs) ───────────
    const defaultPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    const pngBuffer = Buffer.from(defaultPngBase64, 'base64');
    fs.writeFileSync(path.join(dir, 'assets', 'icon.png'), pngBuffer);
    fs.writeFileSync(path.join(dir, 'assets', 'splash.png'), pngBuffer);

    // ── app.jsx  (main entry) ───────────────────────────────────
    fs.writeFileSync(path.join(dir, 'app.jsx'),
`'use strict';

const Dolphin = require('dolphin-native');
const { HomeScreen } = require('./pages/HomeScreen.jsx');

const app = Dolphin.createApp({ name: '${appName}', version: '1.0.0' });

app.screen('Home', HomeScreen());
app.entry('Home');

module.exports = app;
`);

    // ── server.js (Server-side Event Handler & NanoStore Listener) ─
    fs.writeFileSync(path.join(dir, 'server.js'),
`'use strict';

const actions = require('./actions');
const { appStore } = require('./store/appStore');

module.exports = function registerServerHandlers(server) {
    // Dynamic Action Dispatcher (Handles app.increment, app.toggleLogin, app.showToast, app.resetAll)
    server.on('deviceAction', ({ id, action, value }) => {
        console.log(\`\\n⚡ [Device Action] \${id} -> \${action}\`);
        if (!action) return;

        let actionName = action;
        let actionParam = value;

        if (action.includes(':')) {
            const colonIdx = action.indexOf(':');
            actionName = action.substring(0, colonIdx).trim();
            actionParam = action.substring(colonIdx + 1).trim() || value;
        }

        if (actionName.includes('.')) {
            const [mod, method] = actionName.split('.');
            if (actions[mod] && typeof actions[mod][method] === 'function') {
                actions[mod][method](actionParam);
                return;
            }
        }

        // Fallback for legacy actions
        if (action === 'INCREMENT' && actions.app) {
            actions.app.increment();
        }
    });

    // NanoStore Listener Log
    appStore.subscribe((state, key, value) => {
        console.log(\`🐬 [NanoStore Update] Key: "\${key}" =\`, value);
    });
};
`);

    // ── store/appStore.js (NanoStore) ───────────────────────────
    fs.writeFileSync(path.join(dir, 'store', 'appStore.js'),
`'use strict';

const { createNanoStore, atom } = require('dolphin-native');

// 1. Core NanoStore Instance
const appStore = createNanoStore({
    counter: 0,
    theme: 'light',
    userStatus: 'Guest User',
    notification: 'Welcome to ${appName} NanoStore!',
    isLoggedIn: false
});

// 2. Atom Instance for Independent State
const activeTabAtom = atom('HomeTab');

module.exports = {
    appStore,
    activeTabAtom
};
`);

    // ── actions/appActions.js ───────────────────────────────────
    fs.writeFileSync(path.join(dir, 'actions', 'appActions.js'),
`'use strict';

const { appStore, activeTabAtom } = require('../store/appStore');

const appActions = {
    // 1. Single Key Set
    increment: () => {
        const c = appStore.get('counter') || 0;
        appStore.set('counter', c + 1);
    },

    decrement: () => {
        const c = appStore.get('counter') || 0;
        appStore.set('counter', Math.max(0, c - 1));
    },

    // 2. Multi Key setMany()
    toggleLogin: () => {
        const logged = appStore.get('isLoggedIn');
        if (!logged) {
            appStore.setMany({
                isLoggedIn: true,
                userStatus: 'VIP Member 🌟'
            });
        } else {
            appStore.setMany({
                isLoggedIn: false,
                userStatus: 'Guest User'
            });
        }
    },

    // 3. Functional Update update()
    toggleTheme: () => {
        appStore.update(s => ({
            ...s,
            theme: s.theme === 'light' ? 'dark' : 'light'
        }));
    },

    // 4. Temporary State setTemp() - Toast auto expires
    showToast: () => {
        appStore.setTemp('notification', '⚡ Temporary Toast (expires in 3s)', 3000);
    },

    // 5. Reset All State reset()
    resetAll: () => {
        appStore.reset();
        activeTabAtom.set('HomeTab');
    },

    // 6. Atom Update
    switchTab: (tabName) => {
        activeTabAtom.set(tabName || 'ProfileTab');
    }
};

module.exports = appActions;
`);

    // ── actions/userActions.js ──────────────────────────────────
    fs.writeFileSync(path.join(dir, 'actions', 'userActions.js'),
`'use strict';

const { appStore } = require('../store/appStore');

/**
 * ⚡ UserActions — Pure Background Action Handlers (Zero UI Dependency)
 */
const userActions = {
    incrementCounter: () => {
        const current = appStore.get('counter') || 0;
        const updated = current + 1;
        appStore.set('counter', updated);
        console.log('⚡ [NanoStore Action] Counter incremented to:', updated);
        return updated;
    },

    decrementCounter: () => {
        const current = appStore.get('counter') || 0;
        const updated = Math.max(0, current - 1);
        appStore.set('counter', updated);
        console.log('⚡ [NanoStore Action] Counter decremented to:', updated);
        return updated;
    },

    login: (userData) => {
        appStore.setMany({
            isLoggedIn: true,
            userProfile: userData,
            lastSyncTime: Date.now()
        });
        console.log('⚡ [Background Action] User logged in:', userData);
    },

    logout: () => {
        appStore.setMany({
            isLoggedIn: false,
            userProfile: null,
            lastSyncTime: Date.now()
        });
        console.log('⚡ [Background Action] User logged out');
    }
};

module.exports = userActions;
`);

    // ── actions/index.js ────────────────────────────────────────
    fs.writeFileSync(path.join(dir, 'actions', 'index.js'),
`'use strict';

const appActions = require('./appActions');
const userActions = require('./userActions');

module.exports = {
    app: appActions,
    user: userActions
};
`);

    // ── pages/HomeScreen.jsx ────────────────────────────────────
    fs.writeFileSync(path.join(dir, 'pages', 'HomeScreen.jsx'),
`'use strict';

const HomeScreen = () => (
    <div title="Home" type="Screen" id="HomeScreen" className="flex-column items-center justify-center bg-white h-full w-full p-6">
        
        {/* Fixed Title (Pristine Binary) */}
        <h1 className="text-3xl font-bold text-slate-200 bg-blue-128 rounded-10 mb-4 p-4">Welcome to ${appName}  🐬</h1>
        
        {/* NanoStore State Bindings using exact [stateKey:key] syntax */}
        <p className="text-xl font-bold text-slate-700 mb-2">[stateKey:counter]</p>
        <p className="text-base text-slate-600 mb-2">[stateKey:userStatus]</p>
        <p className="text-sm text-slate-500 mb-4">[stateKey:notification]</p>
        
        {/* Feature Action Buttons */}
        <button action="app.increment" className="bg-blue-128 text-gray-1 p-3 rounded-10 font-bold mb-2 w-full">
            1. Increment Counter (+1) 🚀
        </button>

        <button action="app.toggleLogin" className="bg-blue-128 text-gray-1 p-3 rounded-10 font-bold mb-2 w-full">
            2. Toggle Login (setMany) 🔑
        </button>

        <button action="app.showToast" className="bg-blue-128 text-gray-1 p-3 rounded-10 font-bold mb-2 w-full">
            3. Show Toast (setTemp 3s) ⏳
        </button>

        <button action="app.resetAll" className="bg-blue-128 text-gray-1 p-3 rounded-10 font-bold mb-2 w-full">
            4. Reset Store (reset) 🔄
        </button>

    </div>
);

module.exports = { HomeScreen };
`);

    // ── pages/index.js ──────────────────────────────────────────
    fs.writeFileSync(path.join(dir, 'pages', 'index.js'),
`'use strict';

const { HomeScreen } = require('./HomeScreen.jsx');

module.exports = { HomeScreen };
`);

    // ── hooks/index.js ──────────────────────────────────────────
    fs.writeFileSync(path.join(dir, 'hooks', 'index.js'),
`'use strict';

module.exports = {};
`);

    // ── components/index.js ─────────────────────────────────────
    fs.writeFileSync(path.join(dir, 'components', 'index.js'),
`'use strict';

module.exports = {};
`);

    // ── utils/index.js ──────────────────────────────────────────
    fs.writeFileSync(path.join(dir, 'utils', 'index.js'),
`'use strict';

module.exports = {};
`);

    // ── package.json ─────────────────────────────────────────────
    const pkg = {
        name:        appName.toLowerCase().replace(/\s+/g, '-'),
        version:     '1.0.0',
        description: `Dolphin mobile app — ${appName}`,
        main:        'app.jsx',
        scripts: {
            dev:   'dolphin dev',
            build: 'dolphin build',
            'build:android': 'dolphin android build --hotpatch',
        },
        dependencies: { 'dolphin-native': '*' },
    };
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2));

    // ── .gitignore ───────────────────────────────────────────────
    fs.writeFileSync(path.join(dir, '.gitignore'),
`node_modules/
dist/
*.dolp
.dolphin-android/
`);

    // ── README.md ────────────────────────────────────────────────
    fs.writeFileSync(path.join(dir, 'README.md'),
`# ${appName}

Built with 🌊 **Dolphin Mobile Platform** — 1:1 mini-phone NanoStore Architecture

## Project Structure

\`\`\`
${appName}/
├── pages/          ← Screens (HomeScreen.jsx)
├── actions/        ← NanoStore Actions (appActions.js, userActions.js)
├── store/          ← NanoStore State (appStore.js)
├── hooks/          ← Custom Hooks
├── components/     ← UI Components
├── utils/          ← Utilities
├── app.jsx         ← App Entry Point
├── server.js       ← Action Router & NanoStore Subscriber
└── dolphin.config.js
\`\`\`
`);

    // ── jsconfig.json — VS Code TypeScript IntelliSense ─────────
    fs.writeFileSync(path.join(dir, 'jsconfig.json'),
`{
  "compilerOptions": {
    "checkJs": false,
    "jsx": "react-jsx",
    "module": "esnext",
    "moduleResolution": "bundler",
    "ignoreDeprecations": "6.0"
  },
  "include": [
    "**/*.js",
    "**/*.jsx",
    "*.d.ts",
    "node_modules/dolphin-native/src/index.d.ts",
    "node_modules/dolphin-native/src/store/*.d.ts"
  ],
  "exclude": [
    "node_modules/dolphin-native/node_modules",
    "dist"
  ]
}
`);

    // Auto-link dolphin-native into scaffolded project
    try {
        const { execSync } = require('child_process');
        execSync('npm link dolphin-native', { cwd: dir, stdio: 'ignore' });
    } catch(e) {}

    console.log('');
    console.log(`  🌊 \x1b[1m\x1b[36mDolphin project created:\x1b[0m ${appName}/ (1:1 mini-phone NanoStore Architecture)`);
    console.log('');
    console.log('  \x1b[90mStructure:\x1b[0m');
    console.log(`    ${appName}/pages/          ← screens`);
    console.log(`    ${appName}/actions/        ← NanoStore actions`);
    console.log(`    ${appName}/store/          ← NanoStore state`);
    console.log(`    ${appName}/hooks/          ← custom hooks`);
    console.log(`    ${appName}/components/     ← reusable UI`);
    console.log(`    ${appName}/utils/          ← helpers`);
    console.log(`    ${appName}/server.js       ← server-side action handler`);
    console.log('');
    console.log('  \x1b[90mNext steps:\x1b[0m');
    console.log(`    cd ${appName}`);
    console.log('    npm link dolphin-native');
    console.log('    dolphin android build --hotpatch');
    console.log('');
}

module.exports = { cmdInit };
