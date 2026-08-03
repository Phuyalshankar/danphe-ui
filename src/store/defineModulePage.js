'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineModulePage = defineModulePage;
function defineModulePage(config) {
    if (!config || typeof config !== 'object')
        throw new Error('defineModulePage: configuration is required.');
    const { name, controller = {}, view } = config;
    if (!name || typeof name !== 'string')
        throw new Error('defineModulePage: config.name must be a string.');
    if (typeof view !== 'function')
        throw new Error('defineModulePage: config.view must be a function.');
    const state = controller.state || {};
    const actions = controller.actions || {};
    const stateKey = (key) => `${name}.${key}`;
    const actionKey = (key) => `${name}:${key}`;
    const page = {
        name,
        stateKey,
        actionKey,
        bind(app) {
            const get = (key) => app.getState(stateKey(key));
            const render = () => {
                const props = { get, stateKey, actionKey };
                for (const key of Object.keys(state))
                    props[key] = get(key);
                return view(props);
            };
            const patch = () => {
                app.screen(name, render());
                app.patchScreen(name);
            };
            for (const [key, value] of Object.entries(state))
                app.state(stateKey(key), value);
            for (const [key, handler] of Object.entries(actions)) {
                if (typeof handler !== 'function')
                    throw new Error(`defineModulePage: action "${key}" must be a function.`);
                app.action(actionKey(key), async (_action, value, deviceId) => handler({
                    set: (stateName, nextValue) => app.state(stateKey(stateName), nextValue),
                    get,
                    patch,
                    value,
                    deviceId,
                    stateKey,
                    actionKey,
                }));
            }
            app.screen(name, render());
            return page;
        },
    };
    return page;
}
exports.default = { defineModulePage };
//# sourceMappingURL=defineModulePage.js.map