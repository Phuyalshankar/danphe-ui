'use strict';

const React = require('react');
const { useRef, useCallback, useState } = React;
const { renderMasterCard, CARD_FLAGS } = require('../lib/TitanMasterCard');
const { TITAN_ICON, TITAN_ANIM } = require('../lib/TitanAdaptiveIcon');

let TitanMicroBus = null;
let TitanDeclarative = null;
try {
    const tb = require('d:/titan-bus/index.js');
    TitanMicroBus = tb.TitanMicroBus;
    TitanDeclarative = tb.TitanDeclarative;
} catch (e) {}

/**
 * 📦 TitanMasterCard React Component (Grand Universal Container)
 */
const TitanMasterCard = ({
    flags = 0,
    reg = null,
    address = null,
    formReg = null,
    variant = 'glass',
    modal = false,
    toast = false,
    isOpen = true,
    position = 'top-right',
    tabs = [],
    activeTab = 0,
    columns = [],
    data = [],
    icon = 192,
    title = '',
    subtitle = '',
    value = '',
    trend = '',
    trendUp = true,
    badge = 'ONLINE',
    fields = [],
    buttons = [],
    endpoint = '',
    method = 'POST',
    bus = '',
    action = 'SUBMIT',
    onSubmit = null,
    onData = null,
    onSuccess = null,
    onError = null,
    children = null,
    disabled = false,
    className = '',
    ...rest
}) => {
    const cardRef = useRef(null);
    const [currentActiveTab, setCurrentActiveTab] = useState(activeTab);

    // 🌟 Master Autonomous Data Collector
    const collectData = useCallback(() => {
        if (!cardRef.current) return { values: {}, registers: {} };
        const values = {};
        const registers = {};
        const inputs = cardRef.current.querySelectorAll('input, select, textarea');

        inputs.forEach(inp => {
            const key = inp.getAttribute('data-state-key') || inp.name || inp.id;
            const regId = inp.getAttribute('data-reg');
            let val = inp.value;

            if (inp.type === 'checkbox') val = inp.checked ? 1 : 0;
            else if (inp.type === 'radio') {
                if (!inp.checked) return;
                val = inp.value || 1;
            }

            if (key) values[key] = val;
            if (regId) registers[Number(regId)] = val;
        });

        return { values, registers };
    }, []);

    // 🌟 Master Action Handler
    const handleCardAction = useCallback(async (e) => {
        const target = e.target.closest('button, .titan-master-btn');
        if (!target) return;

        const isSubmit = target.type === 'submit' || target.getAttribute('data-action') === 'submit' || target.innerText.toLowerCase().includes('submit') || target.innerText.toLowerCase().includes('login') || target.innerText.toLowerCase().includes('connect') || target.innerText.toLowerCase().includes('save');

        if (isSubmit) {
            if (e.preventDefault) e.preventDefault();
            const { values, registers } = collectData();

            if (TitanDeclarative && Object.keys(registers).length > 0) {
                TitanDeclarative.writeBatch(registers);
            }

            const targetFormReg = formReg || address || reg;
            if (TitanMicroBus && targetFormReg !== null) {
                TitanMicroBus.write(Number(targetFormReg), values);
            }

            if (onData) onData(values, registers);
            if (onSubmit) onSubmit(values, e);

            if (endpoint) {
                try {
                    const res = await fetch(endpoint, {
                        method: method || 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(values)
                    });
                    const result = await res.json();
                    if (onSuccess) onSuccess(result);
                } catch (err) {
                    if (onError) onError(err);
                }
            }
        }
    }, [collectData, formReg, address, reg, onData, onSubmit, endpoint, method, onSuccess, onError]);

    const childrenHtml = typeof children === 'string' ? children : '';
    const html = renderMasterCard({
        flags,
        reg: formReg || address || reg,
        variant,
        modal,
        toast,
        isOpen,
        position,
        tabs,
        activeTab: currentActiveTab,
        columns,
        data,
        icon,
        title,
        subtitle,
        value,
        trend,
        trendUp,
        badge,
        fields,
        buttons,
        children: childrenHtml,
        bus,
        action,
        disabled,
        className
    });

    if (children && typeof children !== 'string') {
        return (
            <div 
                ref={cardRef}
                onClick={handleCardAction}
                className={`titan-master-card-wrapper relative ${className}`} 
                {...rest}
            >
                <div dangerouslySetInnerHTML={{ __html: html }} />
                <div className="card-children-slot -mt-4 px-6 pb-6 flex flex-col gap-3">
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div 
            ref={cardRef}
            onClick={handleCardAction}
            className={`titan-master-card-root ${className}`}
            dangerouslySetInnerHTML={{ __html: html }}
            {...rest}
        />
    );
};

// 🌟 Ultra-Clean Aliases (All Powered by TitanMasterCard)
const TitanModal = (props) => <TitanMasterCard modal={true} {...props} />;
const TitanToast = (props) => <TitanMasterCard toast={true} {...props} />;
const TitanTabs = (props) => <TitanMasterCard variant="tabs" {...props} />;
const TitanTable = (props) => <TitanMasterCard variant="table" {...props} />;

module.exports = {
    TitanMasterCard,
    TitanCard: TitanMasterCard,
    TitanModal,
    TitanToast,
    TitanTabs,
    TitanTable,
    CARD_FLAGS,
    TITAN_ICON,
    TITAN_ANIM
};
module.exports.default = TitanMasterCard;
