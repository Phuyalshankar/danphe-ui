'use strict';

const React = require('react');
const { useState, useEffect } = React;
const { renderMasterInput, INPUT_FLAGS } = require('../lib/TitanMasterInput');
const { TITAN_ICON, TITAN_ANIM } = require('../lib/TitanAdaptiveIcon');

let TitanMicroBus = null;
try {
    TitanMicroBus = require('d:/titan-bus/index.js').TitanMicroBus;
} catch (e) {}

/**
 * 🔤 TitanMasterInput React Component with Native Register Binding
 */
const TitanMasterInput = ({
    flags = 0,
    reg = null,
    name = '',
    borderMode = 'box',
    slotAlign = 'left',
    float = 'top',
    mode = 'text',
    multiline = false,
    rows = 4,
    sensorLevel = 3,
    icon = 225,
    label = '',
    placeholder = '',
    value = '',
    error = false,
    checked = false,
    bus = '',
    disabled = false,
    className = '',
    ...rest
}) => {
    // If reg is provided and TitanMicroBus is active, auto-sync value
    const [liveVal, setLiveVal] = useState(value);

    useEffect(() => {
        if (reg !== null && TitanMicroBus) {
            const initial = TitanMicroBus.read(reg, value);
            if (initial !== null && initial !== undefined) setLiveVal(initial);

            const unsub = TitanMicroBus.subscribe(reg, (newVal) => {
                setLiveVal(newVal);
            });
            return () => unsub();
        }
    }, [reg]);

    const html = renderMasterInput({
        flags,
        reg,
        name,
        borderMode,
        slotAlign,
        float,
        mode,
        multiline,
        rows,
        sensorLevel,
        icon,
        label,
        placeholder,
        value: liveVal,
        error,
        checked,
        bus,
        disabled,
        className
    });

    return (
        <div 
            className={`titan-master-input-root w-full ${className}`}
            dangerouslySetInnerHTML={{ __html: html }}
            {...rest}
        />
    );
};

module.exports = {
    TitanMasterInput,
    TitanInput: TitanMasterInput,
    INPUT_FLAGS,
    TITAN_ICON,
    TITAN_ANIM
};
module.exports.default = TitanMasterInput;
