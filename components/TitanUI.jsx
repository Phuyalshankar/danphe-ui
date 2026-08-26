'use strict';

const React = require('react');
const { renderTitanUI, TITAN_UI } = require('../lib/TitanUIEngine');
const { TITAN_ICON, TITAN_ANIM } = require('../lib/TitanAdaptiveIcon');
const { TitanIcon } = require('./TitanAdaptiveIcon.jsx');

/**
 * 🌟 TitanUI Universal React Component (danphe-ui)
 * Master 256 Spectrum Component (0 to 255)
 */
const TitanUI = ({
    code = 0,
    icon = 1,
    label = '',
    placeholder = '',
    value = '',
    title = '',
    subtitle = '',
    stateKey = 'titan_field',
    bus = 'bus:titan:io',
    size = 48,
    theme = 'cyan',
    children = null,
    disabled = false,
    className = '',
    ...rest
}) => {
    // If children are passed, convert to HTML string or render container
    const childrenHtml = typeof children === 'string' ? children : '';
    const html = renderTitanUI({
        code,
        icon,
        label,
        placeholder,
        value,
        title,
        subtitle,
        stateKey,
        bus,
        size,
        theme,
        children: childrenHtml,
        disabled,
        className
    });

    return (
        <div 
            className={`titan-ui-root ${className}`}
            dangerouslySetInnerHTML={{ __html: html }}
            {...rest}
        />
    );
};

// Specialized Named Aliases
const TitanInput = (props) => <TitanUI code={props.code !== undefined ? props.code : (props.mask || 1)} {...props} />;
const TitanButton = (props) => <TitanUI code={props.code !== undefined ? props.code : 64} {...props} />;
const TitanCard = (props) => <TitanUI code={props.code !== undefined ? props.code : 128} {...props} />;

module.exports = {
    TitanUI,
    TitanInput,
    TitanButton,
    TitanCard,
    TitanIcon,
    TITAN_UI,
    TITAN_ICON,
    TITAN_ANIM
};
module.exports.default = TitanUI;
