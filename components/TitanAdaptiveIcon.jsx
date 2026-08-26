'use strict';

/**
 * 🌟 TitanAdaptiveIcon React Component (danphe-ui)
 * Complete 256 Unique 8-Bit Vector Icons (with circle toggle)
 */
const React = require('react');
const { renderAdaptiveIconSVG, TITAN_ANIM, TITAN_ICON } = require('../lib/TitanAdaptiveIcon');

const TitanAdaptiveIcon = ({
    code = 0,
    icon = null,
    mask = null,
    active = null,
    state = null,
    missedCount = 0,
    size = 64,
    circle = true,
    anim = 0,
    onClick = null
}) => {
    const inputVal = icon !== null ? icon : (mask !== null ? mask : code);
    const activeVal = active !== null ? active : state;
    const html = renderAdaptiveIconSVG(inputVal, missedCount, size, circle, anim, activeVal);
    return (
        <div 
            onClick={onClick}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};

const TitanIcon = ({
    id = undefined,
    code = 0,
    icon = null,
    active = null,
    state = null,
    size = 24,
    circle = false,
    anim = 0,
    className = '',
    onClick = null,
    ...rest
}) => {
    const targetId = icon !== null ? icon : (id !== undefined ? id : code);
    const activeVal = active !== null ? active : state;
    const html = renderAdaptiveIconSVG(targetId, 0, size, circle, anim, activeVal);

    return (
        <span 
            className={`titan-icon-root inline-flex items-center justify-center ${className}`}
            onClick={onClick}
            dangerouslySetInnerHTML={{ __html: html }}
            {...rest}
        />
    );
};

module.exports = { 
    TitanAdaptiveIcon,
    TitanIcon,
    TITAN_ANIM,
    TITAN_ICON
};
module.exports.default = TitanAdaptiveIcon;
