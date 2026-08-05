'use strict';

/**
 * ⚡ StateExpressionParser — Synchronizes state mutation expressions & payload contracts between JS NanoStore & Kotlin DolphinStateEngine.
 * Supported Expressions:
 *   - `key:=value` (Direct assignment)
 *   - `key+=amount` (Increment)
 *   - `key-=amount` (Decrement)
 *   - `key!=toggle` (Boolean toggle)
 */
class StateExpressionParser {
    static INITIAL_STATE_MARKER = '__DOLPHIN_INITIAL_STATE__:';

    static parseExpression(actionStr) {
        if (!actionStr || typeof actionStr !== 'string') return null;

        if (actionStr.includes(':=')) {
            const [key, val] = actionStr.split(':=');
            return { type: 'ASSIGN', key: key.trim(), value: val.trim() };
        }
        if (actionStr.includes('+=')) {
            const [key, val] = actionStr.split('+=');
            return { type: 'INCREMENT', key: key.trim(), amount: parseFloat(val) || 1 };
        }
        if (actionStr.includes('-=')) {
            const [key, val] = actionStr.split('-=');
            return { type: 'DECREMENT', key: key.trim(), amount: parseFloat(val) || 1 };
        }
        if (actionStr.includes('!=')) {
            const [key] = actionStr.split('!=');
            return { type: 'TOGGLE', key: key.trim() };
        }

        return { type: 'DIRECT', key: actionStr.trim() };
    }

    static serializeInitialState(stateObj = {}) {
        return StateExpressionParser.INITIAL_STATE_MARKER + JSON.stringify(stateObj);
    }

    static parseInitialStatePayload(binaryBuffer) {
        if (!binaryBuffer) return {};
        const str = binaryBuffer.toString('utf-8');
        const idx = str.indexOf(StateExpressionParser.INITIAL_STATE_MARKER);
        if (idx === -1) return {};
        try {
            const jsonStr = str.substring(idx + StateExpressionParser.INITIAL_STATE_MARKER.length);
            return JSON.parse(jsonStr);
        } catch (_e) {
            return {};
        }
    }
}

module.exports = StateExpressionParser;
