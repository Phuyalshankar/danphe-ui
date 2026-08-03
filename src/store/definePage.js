'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.definePage = definePage;
exports.defineControllerPage = defineControllerPage;
function definePage(name, config) {
    if (!name || typeof name !== 'string') {
        throw new Error('definePage: First argument must be the screen name string.');
    }
    if (!config || typeof config !== 'object') {
        throw new Error('definePage: Second argument must be a config object.');
    }
    if (typeof config.render !== 'function') {
        throw new Error('definePage: config.render must be a function.');
    }
    let _app = null;
    const pageObj = {
        name,
        state: config.state || {},
        actions: config.actions || {},
        render: config.render,
        bind(app) {
            _app = app;
            // 1. Register local state
            for (const [key, value] of Object.entries(config.state || {})) {
                app.state(key, value);
            }
            // 2. Register local actions
            for (const [actionName, fn] of Object.entries(config.actions || {})) {
                let actionKey = actionName;
                if (!actionName.includes(':')) {
                    actionKey = 'app:' + actionName.replace(/([A-Z])/g, '_$1').toLowerCase();
                }
                app.action(actionKey, async (_action, value, deviceId) => {
                    const set = (k, v) => app.state(k, v);
                    const get = (k) => app.getState(k);
                    const patch = () => {
                        const ui = config.render(get);
                        app.screen(name, ui);
                        app.patchScreen(name);
                    };
                    return await fn(set, get, patch, value, deviceId);
                });
            }
            // 3. Register and compile initial screen
            const get = (k) => app.getState(k);
            app.screen(name, config.render(get));
            return pageObj;
        },
        getState(key) {
            if (!_app)
                throw new Error(`definePage "${name}": Not bound to app yet.`);
            return _app.getState(key);
        },
        setState(key, value) {
            if (!_app)
                throw new Error(`definePage "${name}": Not bound to app yet.`);
            _app.state(key, value);
            return pageObj;
        },
    };
    return pageObj;
}
function defineControllerPage(name, controller, uiComponent) {
    if (!controller || typeof controller !== 'object') {
        throw new Error('defineControllerPage: Second argument must be a controller object containing state and actions.');
    }
    if (typeof uiComponent !== 'function') {
        throw new Error('defineControllerPage: Third argument must be a UI rendering component function.');
    }
    return definePage(name, {
        state: controller.state || {},
        actions: controller.actions || {},
        render(get) {
            const props = { get };
            for (const key of Object.keys(controller.state || {})) {
                props[key] = get(key);
            }
            return uiComponent(props);
        },
    });
}
exports.default = { definePage, defineControllerPage };
//# sourceMappingURL=definePage.js.map