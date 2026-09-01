'use strict';

/**
 * 🐬 danphe-ui - Universal Vector & Animated UI Suite
 * Node.js & Danphe-2 Native Multi-Platform Engine
 */

const { SevenSegment } = require('./SevenSegment');
const { MatrixLCD } = require('./MatrixLCD');
const { VectorKeypad } = require('./VectorKeypad');
const { AudioWaveform } = require('./AudioWaveform');
const { TitanIconMatrix, parseBitmask, renderIconSVG, DEFAULT_TITAN_ICONS } = require('./TitanIconMatrix');
const { TitanTelephonyMatrix, TELEPHONY_ITEMS, TELEPHONY_ICONS_SVG } = require('./TitanTelephonyMatrix');
const { TitanAdaptiveIcon, TITAN_ICON, TITAN_ANIM, ICONS_256, renderAdaptiveIconSVG } = require('./TitanAdaptiveIcon');
const { TitanUI, TITAN_UI, renderTitanUI } = require('./TitanUIEngine');
const { TitanMasterInput, INPUT_FLAGS, renderMasterInput } = require('./TitanMasterInput');
const { TitanMasterButton, BUTTON_FLAGS, renderMasterButton } = require('./TitanMasterButton');
const { TitanMasterCard, CARD_FLAGS, renderMasterCard } = require('./TitanMasterCard');
const { renderTitanTable, TitanTable } = require('./TitanTableSuite');
const { renderTitanButtonGroup, TitanButtonGroup } = require('./TitanButtonGroup');
const { renderTitanNavbar, TitanNavbar } = require('./TitanNavbar');
const { renderTitanDrawer, TitanDrawer } = require('./TitanDrawer');
const { renderTitanProgress, TitanProgress } = require('./TitanProgress');
const { renderDanpheLogo, DanpheLogo, DANPHE_LOGO_CSS } = require('./DanpheLogo');
const { renderTitanChart, TitanChart, CHART_FLAGS } = require('./TitanChart');
const { renderTitanWhiteboard, TitanWhiteboard } = require('./TitanWhiteboard');
const { renderNepalFlag, NepalFlag, NEPAL_FLAG_CSS } = require('./NepalFlag');
const { getNepaliDate, renderNepaliDateTag, NepaliDateTag, toDevanagari } = require('./NepaliDate');
const { TITAN_REG, TITAN_ADDRESS } = require('./TitanRegisters');
const { renderTitanSvgAnimationCard, TitanSvgAnimationCard } = require('./TitanSvgAnimationCard');
const { renderTitanSvgTransformCard, TitanSvgTransformCard } = require('./TitanSvgTransformCard');
const { renderTitanSvgColorCard, TitanSvgColorCard } = require('./TitanSvgColorCard');
const { renderTitanSvgTypoCard, TitanSvgTypoCard } = require('./TitanSvgTypoCard');
const { renderTitanSvgEffectCard, TitanSvgEffectCard } = require('./TitanSvgEffectCard');
const { renderTitanMobileDeviceFrame, TitanMobileDeviceFrame } = require('./TitanMobileDeviceFrame');
const { FONTS_256, getFontFromOpcode, generateFontCSS } = require('../fonts/index.js');
const { EFFECTS_256, getEffectFromOpcode, renderVfxStrokeOnCanvas } = require('../effects/index.js');
const TitanOpcodeBus = require('./TitanOpcodeBus');

module.exports = {
    SevenSegment,
    MatrixLCD,
    VectorKeypad,
    AudioWaveform,
    TitanIconMatrix,
    parseBitmask,
    renderIconSVG,
    DEFAULT_TITAN_ICONS,
    TitanTelephonyMatrix,
    TELEPHONY_ITEMS,
    TELEPHONY_ICONS_SVG,
    TitanAdaptiveIcon,
    TITAN_ICON,
    TITAN_ANIM,
    ICONS_256,
    renderAdaptiveIconSVG,
    TitanUI,
    TITAN_UI,
    renderTitanUI,
    TitanMasterInput,
    TitanInput: TitanMasterInput,
    INPUT_FLAGS,
    renderMasterInput,
    TitanMasterButton,
    TitanButton: TitanMasterButton,
    BUTTON_FLAGS,
    renderMasterButton,
    TitanMasterCard,
    TitanCard: TitanMasterCard,
    TitanModal: (p) => renderMasterCard({ modal: true, ...p }),
    TitanToast: (p) => renderMasterCard({ toast: true, ...p }),
    TitanTabs: (p) => renderMasterCard({ variant: 'tabs', ...p }),
    TitanTable,
    renderTitanTable,
    TitanButtonGroup,
    renderTitanButtonGroup,
    TitanNavbar,
    renderTitanNavbar,
    renderTitanDrawer,
    TitanDrawer,
    renderTitanProgress,
    TitanProgress,
    renderDanpheLogo,
    DanpheLogo,
    DANPHE_LOGO_CSS,
    renderTitanChart,
    TitanChart,
    CHART_FLAGS,
    renderTitanWhiteboard,
    TitanWhiteboard,
    renderNepalFlag,
    NepalFlag,
    NEPAL_FLAG_CSS,
    getNepaliDate,
    renderNepaliDateTag,
    NepaliDateTag,
    toDevanagari,
    CARD_FLAGS,
    renderMasterCard,
    TITAN_REG,
    TITAN_ADDRESS,
    renderTitanSvgAnimationCard,
    TitanSvgAnimationCard,
    renderTitanSvgTransformCard,
    TitanSvgTransformCard,
    renderTitanSvgColorCard,
    TitanSvgColorCard,
    renderTitanSvgTypoCard,
    TitanSvgTypoCard,
    renderTitanSvgEffectCard,
    TitanSvgEffectCard,
    renderTitanMobileDeviceFrame,
    TitanMobileDeviceFrame,
    FONTS_256,
    getFontFromOpcode,
    generateFontCSS,
    EFFECTS_256,
    getEffectFromOpcode,
    renderVfxStrokeOnCanvas,
    TitanOpcodeBus
};
