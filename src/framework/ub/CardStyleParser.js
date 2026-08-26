'use strict';

/**
 * 🃏 CardStyleParser — Dedicated parser for 'card' and 'card-glass' styles with explicit border, radius, and elevation.
 */
class CardStyleParser {
    static parseCardStyle(props = {}, p = '') {
        if (p === 'card') {
            props.border = '1px solid #cbd5e1';
            props.borderColor = '#cbd5e1';
            props.borderWidth = '1px';
            props.bg = 'white';
            props.backgroundColor = 'white';
            if (!props.radius) props.radius = 12;
            if (!props.radiusExtended) props.radiusExtended = 12;
            return true;
        }

        if (p === 'card-glass') {
            props.border = '1px solid rgba(255,255,255,0.2)';
            props.borderColor = 'rgba(255,255,255,0.2)';
            props.borderWidth = '1px';
            props.bg = 'rgba(255,255,255,0.1)';
            if (!props.radius) props.radius = 16;
            if (!props.radiusExtended) props.radiusExtended = 16;
            return true;
        }

        return false;
    }
}

module.exports = CardStyleParser;
