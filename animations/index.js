'use strict';

const { ANIMATIONS_256, TITAN_ANIM } = require('./ANIMATIONS_256');
const { KINETIC_TEXT_256 } = require('./KINETIC_TEXT_256');
const { generateAnimationCSS, getAnimationClass } = require('./TitanAnimationEngine');

module.exports = {
    ANIMATIONS_256,
    KINETIC_TEXT_256,
    TITAN_ANIM,
    generateAnimationCSS,
    getAnimationClass
};
