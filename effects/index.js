'use strict';

/**
 * 🐬 DANPHE EFFECTS 256 (danphe-ui/effects)
 * Universal Single-Pack 256 VFX Suite
 */

const { EFFECTS_256, VFX_CATEGORIES } = require('./EFFECTS_256');
const { getEffectFromOpcode, renderVfxStrokeOnCanvas } = require('./TitanEffectEngine');

module.exports = {
    EFFECTS_256,
    VFX_CATEGORIES,
    getEffectFromOpcode,
    renderVfxStrokeOnCanvas
};
