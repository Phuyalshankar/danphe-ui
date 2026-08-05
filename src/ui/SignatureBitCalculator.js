'use strict';

const BorderFlagDetector = require('./BorderFlagDetector');

/**
 * ⚡ SignatureBitCalculator — Calculates Titan 24-byte protocol signature bits (Byte 15 & 23).
 * Bit 0: Gradient (0x01)
 * Bit 2: Border (0x04)
 * Bit 3: Dynamic Bindings (0x08)
 * Bit 4: Animation (0x10)
 * Bit 5: Justify Between (0x20)
 * Bit 6: Swipeable (0x40)
 */
class SignatureBitCalculator {
    static calculateSignature(props = {}, tw = '', compType = '') {
        let sig = 0;

        // Bit 0: Gradient
        if (props.gradient) sig |= 0x01;

        // Bit 2: Border
        if (BorderFlagDetector.hasValidBorder(props, tw)) sig |= 0x04;

        // Bit 3: Dynamic Bindings
        const hasBindings = props.bindings && typeof props.bindings === 'object' && Object.keys(props.bindings).length > 0;
        if (hasBindings) sig |= 0x08;

        // Bit 4: Animation
        if (props.animation || props.anim || String(tw).includes('animate-')) sig |= 0x10;

        // Bit 5: Justify Between
        if (props.justify === 'between' || String(tw).includes('justify-between') || String(tw).includes('flex-between')) sig |= 0x20;

        // Bit 6: Swipeable
        if (props.swipeable || props.swipe || String(tw).includes('swipeable') || compType === 'Screen') sig |= 0x40;

        return sig;
    }
}

module.exports = SignatureBitCalculator;
