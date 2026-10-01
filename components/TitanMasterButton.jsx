'use strict';

const React = require('react');
const { useState, useEffect, useCallback } = React;
const { renderMasterButton, BUTTON_FLAGS } = require('../lib/TitanMasterButton');
const { TITAN_ICON, TITAN_ANIM } = require('../lib/TitanAdaptiveIcon');

let TitanMicroBus = null;
let TitanDeclarative = null;
try {
    const tb = require('d:/titan-envent-bus/index.js');
    TitanMicroBus = tb.TitanMicroBus || tb.Bus;
    TitanDeclarative = tb.TitanDeclarative;
} catch (e) {}

/**
 * 🔘 TitanMasterButton React Component
 * Autonomous Action & API Dispatcher with Auto-State Morphing & Form Collection
 */
const TitanMasterButton = ({
    flags = 0,
    reg = null,
    targetValue = null,
    relay = null,
    screen = '',
    variant = 'primary',
    state = 'idle',
    progress = 0,
    icon = 1,
    iconPos = 'left',
    label = '',
    successLabel = 'Success!',
    errorLabel = 'Failed - Retry',
    loadingLabel = 'Processing...',
    checked = false,
    counter = null,
    anim = 0,
    size = 'md',
    bus = '',
    action = 'CLICK',
    // 🌟 Autonomous API & Form Collection Props
    endpoint = '',           // REST API URL e.g. '/api/v1/call/hangup'
    method = 'POST',         // 'POST' | 'GET' | 'PUT' | 'DELETE'
    payload = null,          // Static or dynamic payload object
    collect = null,          // 'form' | 'parent' | '#selector' to auto-collect inputs
    autoMorph = true,        // Automatically morphs to Spinner -> Checkmark -> Idle
    onClick = null,          // Custom click handler: (e, collectedData) => {}
    onSuccess = null,        // (apiResponse) => {}
    onError = null,          // (error) => {}
    disabled = false,
    className = '',
    ...rest
}) => {
    const [liveChecked, setLiveChecked] = useState(checked);
    const [liveState, setLiveState] = useState(state);
    const [liveProgress, setLiveProgress] = useState(progress);

    useEffect(() => {
        setLiveState(state);
    }, [state]);

    useEffect(() => {
        setLiveProgress(progress);
    }, [progress]);

    // Live sync for switches
    useEffect(() => {
        if (reg !== null && TitanMicroBus && variant === 'switch') {
            const initial = TitanMicroBus.read(reg);
            setLiveChecked(initial === 1 || initial === '1' || initial === true || initial === 'ON');

            const unsub = TitanMicroBus.subscribe(reg, (val) => {
                setLiveChecked(val === 1 || val === '1' || val === true || val === 'ON');
            });
            return () => unsub();
        }
    }, [reg, variant]);

    // 🌟 Collect Data from DOM helper
    const collectDataFromDOM = useCallback((btnElement) => {
        if (!collect || !btnElement) return {};
        
        let container = null;
        if (collect === 'form' || collect === 'parent') {
            container = btnElement.closest('form, .titan-master-card, .titan-master-card-wrapper') || btnElement.parentElement;
        } else if (typeof collect === 'string' && collect.startsWith('#')) {
            container = document.querySelector(collect);
        }

        if (!container) return {};

        const data = {};
        const inputs = container.querySelectorAll('input, select, textarea');
        inputs.forEach(inp => {
            const key = inp.getAttribute('data-state-key') || inp.name || inp.id;
            if (!key) return;

            if (inp.type === 'checkbox') data[key] = inp.checked ? 1 : 0;
            else if (inp.type === 'radio') {
                if (inp.checked) data[key] = inp.value || 1;
            } else {
                data[key] = inp.value;
            }
        });
        return data;
    }, [collect]);

    // 🌟 Master Click & API Dispatch Handler
    const handleClick = useCallback(async (e) => {
        const btnElement = e.currentTarget;
        const collectedData = collect ? collectDataFromDOM(btnElement) : {};
        const finalPayload = Object.assign({}, payload || {}, collectedData);

        // 1. Dispatch to Titan Micro-Bus
        if (TitanDeclarative) {
            if (relay !== null) TitanDeclarative.relay(relay, 'on');
            else if (screen) TitanDeclarative.screen(screen);
            else if (reg !== null) TitanDeclarative.write(reg, targetValue !== null ? targetValue : (Object.keys(finalPayload).length > 0 ? finalPayload : action));
        } else if (window.TitanBus) {
            const act = bus || (reg !== null ? `bus:write:${reg}` : action);
            window.TitanBus.send(act, JSON.stringify(finalPayload));
        }

        // 2. Custom onClick Callback
        if (onClick) onClick(e, finalPayload);

        // 3. Autonomous API Call
        if (endpoint) {
            if (autoMorph) setLiveState('loading');
            try {
                const fetchOptions = {
                    method: method || 'POST',
                    headers: { 'Content-Type': 'application/json' }
                };
                if (method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD') {
                    fetchOptions.body = JSON.stringify(finalPayload);
                }

                const res = await fetch(endpoint, fetchOptions);
                const data = await res.json();

                if (autoMorph) {
                    setLiveState('success');
                    setTimeout(() => setLiveState('idle'), 2000);
                }
                if (onSuccess) onSuccess(data);
            } catch (err) {
                if (autoMorph) {
                    setLiveState('error');
                    setTimeout(() => setLiveState('idle'), 2500);
                }
                if (onError) onError(err);
            }
        }
    }, [collect, collectDataFromDOM, payload, relay, screen, reg, targetValue, action, bus, onClick, endpoint, autoMorph, method, onSuccess, onError]);

    const html = renderMasterButton({
        flags,
        reg,
        targetValue,
        relay,
        screen,
        variant,
        state: liveState,
        progress: liveProgress,
        icon,
        iconPos,
        label,
        successLabel,
        errorLabel,
        loadingLabel,
        checked: liveChecked,
        counter,
        anim,
        size,
        bus,
        action,
        disabled: disabled || liveState === 'loading',
        className
    });

    return (
        <div 
            onClick={handleClick}
            className={`titan-master-button-root inline-block cursor-pointer ${className}`}
            dangerouslySetInnerHTML={{ __html: html }}
            {...rest}
        />
    );
};

module.exports = {
    TitanMasterButton,
    TitanButton: TitanMasterButton,
    BUTTON_FLAGS,
    TITAN_ICON,
    TITAN_ANIM
};
module.exports.default = TitanMasterButton;
