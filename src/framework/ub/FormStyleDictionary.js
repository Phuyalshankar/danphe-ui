'use strict';

const { SIZING_SCALE } = require('./SizingScale');

/**
 * 📋 FormStyleDictionary — Dedicated micro-module for Form controls (Input, Select, Checkbox, Radio, Switch)
 * with complete sizing variants (sm, md, lg, xl, 2xl) and color state maps.
 */
class FormStyleDictionary {
    static getFormInputStyle(variantStr = '') {
        const lower = String(variantStr).toLowerCase().trim();

        // Size variants
        if (lower === 'input-xs') return SIZING_SCALE['xs'];
        if (lower === 'input-sm') return SIZING_SCALE['sm'];
        if (lower === 'input-md') return SIZING_SCALE['md'];
        if (lower === 'input-lg') return SIZING_SCALE['lg'];
        if (lower === 'input-xl') return SIZING_SCALE['xl'];
        if (lower === 'input-2xl') return SIZING_SCALE['2xl'];

        // Color & state variants
        if (lower === 'input-primary') return { borderColor: '#3b82f6', focusRing: 'rgba(59,130,246,0.2)' };
        if (lower === 'input-success') return { borderColor: '#10b981', focusRing: 'rgba(16,185,129,0.2)' };
        if (lower === 'input-warning') return { borderColor: '#f59e0b', focusRing: 'rgba(245,158,11,0.2)' };
        if (lower === 'input-danger' || lower === 'input-error') return { borderColor: '#ef4444', focusRing: 'rgba(239,68,68,0.2)' };
        if (lower === 'input-disabled') return { bg: '#f1f5f9', color: '#94a3b8', cursor: 'not-allowed' };

        return SIZING_SCALE['md']; // Default
    }

    static getSelectStyle(variantStr = '') {
        const lower = String(variantStr).toLowerCase().trim();
        if (lower.includes('lg')) return SIZING_SCALE['lg'];
        if (lower.includes('xl')) return SIZING_SCALE['xl'];
        if (lower.includes('2xl')) return SIZING_SCALE['2xl'];
        if (lower.includes('sm')) return SIZING_SCALE['sm'];
        return SIZING_SCALE['md'];
    }

    static getCheckboxRadioStyle(variantStr = '') {
        const lower = String(variantStr).toLowerCase().trim();
        if (lower.includes('xl') || lower.includes('2xl')) return { size: '24px', radius: '6px' };
        if (lower.includes('lg')) return { size: '20px', radius: '4px' };
        if (lower.includes('sm')) return { size: '14px', radius: '3px' };
        return { size: '16px', radius: '4px' }; // Default md
    }
}

module.exports = FormStyleDictionary;
