'use strict';

/**
 * ⚡ WebEventDispatcher — Manages web DOM event listeners, click handlers, and NanoStore action dispatches.
 */
class WebEventDispatcher {
    static bindElementEvent(domElement, eventType, actionStr, stateEngine) {
        if (!domElement || typeof domElement.addEventListener !== 'function') return;

        domElement.addEventListener(eventType, (e) => {
            if (actionStr && typeof actionStr === 'string') {
                if (stateEngine && typeof stateEngine.handleAction === 'function') {
                    stateEngine.handleAction(actionStr);
                }
            }
        });
    }
}

module.exports = WebEventDispatcher;
