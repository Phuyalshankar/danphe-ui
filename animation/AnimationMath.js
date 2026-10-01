'use strict';

/**
 * 📐 AnimationMath — Zero-Allocation 60 FPS Easing & Physics Curves
 * Component of @danphe/ui/animation
 */

const AnimationMath = {
    linear: (t) => Math.max(0, Math.min(1, t)),
    
    easeOutCubic: (t) => {
        const c = Math.max(0, Math.min(1, t));
        return 1 - Math.pow(1 - c, 3);
    },
    
    easeInCubic: (t) => {
        const c = Math.max(0, Math.min(1, t));
        return c * c * c;
    },
    
    easeInOutCubic: (t) => {
        const c = Math.max(0, Math.min(1, t));
        return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
    },
    
    elasticBounceOut: (t) => {
        const c = Math.max(0, Math.min(1, t));
        if (c === 0) return 0;
        if (c === 1) return 1;
        return Math.pow(2, -10 * c) * Math.sin((c * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
    },
    
    backOvershootOut: (t) => {
        const c = Math.max(0, Math.min(1, t));
        const s = 1.70158;
        const p = c - 1;
        return p * p * ((s + 1) * p + s) + 1;
    },
    
    // Overall / Continuous Loop Math
    pulse: (time, speed = 1.0) => 0.5 + 0.5 * Math.sin(time * Math.PI * 2 * speed),
    floatDrift: (time, speed = 1.0) => Math.sin(time * Math.PI * 1.5 * speed),
    wiggle: (time, speed = 1.0) => Math.sin(time * 12 * speed) * Math.cos(time * 7 * speed)
};

module.exports = AnimationMath;
