'use strict';

const { TITAN_TEXT_BITS, TITAN_TEXT_REG } = require('./TitanTextRegisters');
const { PIXELLAB_PRESETS } = require('./TitanTextPresets');
const { renderTitanPixelTextStudio, TitanPixelTextStudio, PIXEL_STUDIO_CSS } = require('./TitanPixelTextStudio');

module.exports = {
    renderTitanPixelTextStudio,
    TitanPixelTextStudio,
    TITAN_TEXT_BITS,
    TITAN_TEXT_REG,
    PIXELLAB_PRESETS,
    PIXEL_STUDIO_CSS
};
