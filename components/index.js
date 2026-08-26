'use strict';

const { VectorKeypad } = require('./VectorKeypad.jsx');
const { Digit7Seg, RealSevenSegmentPanel } = require('./SevenSegmentDisplay.jsx');
const { TitanIconMatrix } = require('./TitanIconMatrix.jsx');
const { TitanTelephonyMatrix } = require('./TitanTelephonyMatrix.jsx');
const { TitanAdaptiveIcon, TitanIcon } = require('./TitanAdaptiveIcon.jsx');
const { TitanUI, TITAN_UI, TITAN_ICON, TITAN_ANIM } = require('./TitanUI.jsx');
const { TitanMasterInput, TitanInput, INPUT_FLAGS } = require('./TitanAdaptiveInput.jsx');
const { TitanMasterButton, TitanButton, BUTTON_FLAGS } = require('./TitanMasterButton.jsx');
const { TitanMasterCard, TitanCard, TitanModal, TitanToast, TitanTabs, CARD_FLAGS } = require('./TitanMasterCard.jsx');
const { TitanTable } = require('./TitanTable.jsx');
const { TitanNavbar } = require('./TitanNavbar.jsx');
const { NepalFlag } = require('./NepalFlag.jsx');
const { NepaliDateTag } = require('./NepaliDateBadge.jsx');
const { TITAN_REG, TITAN_ADDRESS } = require('../lib/TitanRegisters');

module.exports = {
    VectorKeypad,
    Digit7Seg,
    RealSevenSegmentPanel,
    TitanIconMatrix,
    TitanTelephonyMatrix,
    TitanAdaptiveIcon,
    TitanIcon,
    TitanUI,
    TitanMasterInput,
    TitanInput,
    INPUT_FLAGS,
    TitanMasterButton,
    TitanButton,
    BUTTON_FLAGS,
    TitanMasterCard,
    TitanCard,
    TitanModal,
    TitanToast,
    TitanTabs,
    TitanTable,
    TitanButtonGroup,
    TitanNavbar,
    NepalFlag,
    NepaliDateTag,
    CARD_FLAGS,
    TITAN_REG,
    TITAN_ADDRESS,
    TITAN_UI,
    TITAN_ICON,
    TITAN_ANIM
};

