'use strict';

/**
 * 🏷️ AttributeNormalizer — Normalizes React props, HTML attributes, style objects, and class names.
 */
class AttributeNormalizer {
    static normalizeKey(key) {
        if (!key || typeof key !== 'string') return '';
        const lower = key.toLowerCase().trim();
        if (lower === 'classname' || lower === 'class') return 'className';
        if (lower === 'onclick') return 'onClick';
        if (lower === 'onchange') return 'onChange';
        return key;
    }

    static normalizeAttributes(attributes = {}) {
        const normalized = {};
        for (const [key, val] of Object.entries(attributes)) {
            const normKey = AttributeNormalizer.normalizeKey(key);
            normalized[normKey] = val;
        }
        return normalized;
    }

    static extractClassNameProps(classNameStr = '') {
        if (!classNameStr || typeof classNameStr !== 'string') return {};
        const classes = classNameStr.split(/\s+/).filter(Boolean);
        return {
            classes,
            hasBorder: classes.some(c => c.includes('border') && !c.includes('border-none')),
            hasFlex: classes.includes('flex') || classes.includes('flex-col') || classes.includes('flex-row'),
            hasCard: classes.includes('card')
        };
    }
}

module.exports = AttributeNormalizer;
