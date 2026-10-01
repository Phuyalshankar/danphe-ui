'use strict';

/**
 * 🎬 TitanVideoIcons (danphe-ui)
 * Unified Proxy mapping to Core Icon Matrix Bundle (Bank 0x02: 512 - 530)
 */

const { renderAdaptiveIconSVG, TITAN_ICON } = require('./TitanAdaptiveIcon');
const { renderVideoToolbar, TitanVideoToolbar, VIDEO_TOOLS } = require('./TitanVideoToolbar');
const { EXTENDED_WEB_ICONS } = require('./TitanExtendedIcons');

const VIDEO_EDITOR_ICONS = {};
for (let id = 512; id <= 530; id++) {
    if (EXTENDED_WEB_ICONS[id]) {
        VIDEO_EDITOR_ICONS[id] = EXTENDED_WEB_ICONS[id];
    }
}

function renderVideoIconSVG(iconKeyOrCode, options) {
    const opts = options || {};
    const size = opts.size || 24;
    return renderAdaptiveIconSVG(iconKeyOrCode, 0, size, false);
}

module.exports = {
    VIDEO_EDITOR_ICONS,
    VIDEO_TOOLS,
    renderVideoIconSVG,
    renderVideoToolbar,
    TitanVideoToolbar
};
