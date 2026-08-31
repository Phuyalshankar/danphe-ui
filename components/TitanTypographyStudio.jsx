'use strict';

/**
 * 🖋️ TitanTypographyStudio React Component (danphe-ui)
 * 16-Bit Bitmask Hollywood Motion Typography Studio
 */
const React = require('react');
const { renderTitanTypographyStudio, TITAN_TYPO_BITS, TYPO_PRESETS, TITAN_TYPO_REG } = require('../lib/TitanTypographyStudio');

const TitanTypographyStudio = ({
    id = 'titan-typo-studio',
    text = 'DANPHE CINEMA 4K',
    preset = 'cinema_gold',
    bitmask = undefined,
    className = '',
    onBitmaskChange = null
}) => {
    const html = renderTitanTypographyStudio({ id, text, preset, bitmask, className });
    return (
        <div 
            className="titan-typo-component-root"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};

module.exports = {
    TitanTypographyStudio,
    TITAN_TYPO_BITS,
    TYPO_PRESETS,
    TITAN_TYPO_REG
};
