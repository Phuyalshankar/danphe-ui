'use strict';

/**
 * 🖋️ TitanPixelTextStudio React Component (danphe-ui)
 * 3-Page Android PixelLab-Grade Typography Studio
 */
const React = require('react');
const { renderTitanPixelTextStudio, TITAN_TEXT_BITS, TITAN_TEXT_REG, PIXELLAB_PRESETS } = require('../text');

const TitanPixelTextStudio = ({
    id = 'titan-pixel-studio',
    text = 'DANPHE CINEMA 4K',
    preset = 'cinema_gold',
    className = ''
}) => {
    const html = renderTitanPixelTextStudio({ id, text, preset, className });
    return (
        <div 
            className="titan-pixel-text-component-root"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};

module.exports = {
    TitanPixelTextStudio,
    TITAN_TEXT_BITS,
    TITAN_TEXT_REG,
    PIXELLAB_PRESETS
};
