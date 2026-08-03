'use strict';

/**
 * 🐬 DolphinUIUtils
 * Lightweight, zero-dependency helper functions for UI importing and styling.
 */

function parseTW(twString) {
    if (!twString || typeof twString !== 'string') return {};
    const props = {};
    const classes = twString.split(/\s+/);

    for (let cls of classes) {
        if (!cls) continue;

        // Clean bracket wrapper if present like [flex-center]
        if (cls.startsWith('[') && cls.endsWith(']')) {
            cls = cls.slice(1, -1);
        }

        // Layout / Component types
        if (cls === 'card') { props.type = 'Card'; }
        else if (cls === 'flex-col' || cls === 'col' || cls === 'flex-column') { props.type = 'Column'; props.orientation = 'vertical'; }
        else if (cls === 'flex-row' || cls === 'row') { props.type = 'Row'; props.orientation = 'horizontal'; }
        else if (cls === 'flex-center' || cls === 'items-center') { props.alignItems = 'center'; }
        else if (cls === 'justify-center') { props.justify = 'center'; }
        else if (cls === 'justify-between' || cls === 'flex-between') { props.justify = 'between'; }
        else if (cls === 'justify-around' || cls === 'flex-around') { props.justify = 'around'; }
        else if (cls === 'flex-1') { props.flex = 1; }
        else if (cls === 'w-full' || cls === 'w-100' || cls === 'w-screen') { props.width = -1; }
        else if (cls === 'h-full' || cls === 'h-100' || cls === 'h-screen') { props.height = -1; }
        else if (cls === 'min-h-screen') { props.height = -1; }

        // Padding & Margin
        else if (cls.startsWith('p-')) { const p = parseInt(cls.split('-')[1]) * 4; if (!isNaN(p)) props.padding = p; }
        else if (cls.startsWith('px-')) { const px = parseInt(cls.split('-')[1]) * 4; if (!isNaN(px)) { props.paddingX = px; } }
        else if (cls.startsWith('py-')) { const py = parseInt(cls.split('-')[1]) * 4; if (!isNaN(py)) { props.paddingY = py; } }
        else if (cls.startsWith('pt-')) { const pt = parseInt(cls.split('-')[1]) * 4; if (!isNaN(pt)) props.pt = pt; }
        else if (cls.startsWith('pb-')) { const pb = parseInt(cls.split('-')[1]) * 4; if (!isNaN(pb)) props.pb = pb; }
        else if (cls.startsWith('pl-')) { const pl = parseInt(cls.split('-')[1]) * 4; if (!isNaN(pl)) props.pl = pl; }
        else if (cls.startsWith('pr-')) { const pr = parseInt(cls.split('-')[1]) * 4; if (!isNaN(pr)) props.pr = pr; }

        // Gap
        else if (cls.startsWith('gap-')) { const g = parseInt(cls.split('-')[1]) * 4; if (!isNaN(g)) props.gap = g; }

        // Border Radius
        else if (cls.startsWith('rounded-')) {
            const r = cls.split('-')[1];
            if (r === 'xl') props.borderRadius = 16;
            else if (r === '2xl') props.borderRadius = 24;
            else if (r === '3xl') props.borderRadius = 32;
            else if (r === 'full') props.borderRadius = 999;
            else if (r === 'none') props.borderRadius = 0;
            else { const v = parseInt(r) * 4; if (!isNaN(v)) props.borderRadius = v; }
        }
        else if (cls === 'rounded') { props.borderRadius = 8; }

        // Elevation / Shadow
        else if (cls === 'shadow-sm') props.elevation = 2;
        else if (cls === 'shadow' || cls === 'shadow-md') props.elevation = 6;
        else if (cls === 'shadow-lg' || cls === 'shadow-xl') props.elevation = 12;
        else if (cls === 'shadow-2xl') props.elevation = 24;

        // Colors & Backgrounds & Gradients
        else if (cls.startsWith('bg-gradient-') || cls.startsWith('gradient-') || cls.startsWith('glass-')) {
            props.gradient = cls;
        }
        else if (cls.startsWith('bg-')) {
            props.bg = cls.replace('bg-', '');
        }
        else if (cls.startsWith('text-')) {
            const val = cls.replace('text-', '');
            if (val === 'center' || val === 'left' || val === 'right') {
                props.align = val;
            } else if (val === 'xs') { props.size = 12; }
            else if (val === 'sm') { props.size = 14; }
            else if (val === 'base') { props.size = 16; }
            else if (val === 'lg') { props.size = 18; }
            else if (val === 'xl') { props.size = 20; }
            else if (val === '2xl') { props.size = 24; }
            else if (val === '3xl') { props.size = 30; }
            else if (val === '4xl') { props.size = 36; }
            else {
                props.textColor = val;
            }
        }
        else if (cls.startsWith('border-')) {
            props.borderColor = cls.replace('border-', '');
        }
        else if (cls === 'border') {
            props.border = '1px solid #cccccc';
            props.borderWidth = 1;
        }
    }
    return props;
}

function getColor(colorName) {
    if (!colorName || typeof colorName !== 'string') return 0;
    const name = colorName.toLowerCase().replace(/^(text-|bg-|border-)/, '');
    const map = {
        'white': 10, 'black': 9, 'blue': 1, 'green': 2, 'indigo': 3,
        'red': 4, 'orange': 5, 'amber': 6, 'gray': 7, 'grey': 7,
        'teal': 8, 'cyan': 11, 'pink': 12, 'purple': 13, 'yellow': 14,
        'lime': 15, 'rose': 16, 'fuchsia': 17, 'violet': 18, 'sky': 19,
        'slate': 20, 'zinc': 21, 'neutral': 22, 'transparent': 23
    };
    for (const key of Object.keys(map)) {
        if (name.startsWith(key)) return map[key];
    }
    return 0;
}

function packAnimation(anim) {
    if (!anim) return 0;
    if (typeof anim === 'string') {
        if (anim.includes('fade')) return 0x10 | 0x01;
        if (anim.includes('slide')) return 0x10 | 0x02;
        if (anim.includes('scale')) return 0x10 | 0x03;
        if (anim.includes('rotate')) return 0x10 | 0x04;
        if (anim.includes('bounce')) return 0x10 | 0x05;
        return 0x10;
    }
    return 0;
}

function normalizeGradient(grad) {
    if (!grad) return '';
    if (typeof grad === 'string') return grad;
    if (typeof grad === 'object') {
        const colors = grad.colors || grad.stops || [];
        return colors.join('|');
    }
    return String(grad || '');
}

function getShade(colorName) {
    if (!colorName || typeof colorName !== 'string') return 128;
    const match = colorName.match(/-(\d+)$/);
    if (match) return parseInt(match[1]) || 128;
    if (colorName.includes('white')) return 254;
    if (colorName.includes('black')) return 1;
    return 128;
}

function parseSpacing(val) {
    if (typeof val === 'number') return { t: val, r: val, b: val, l: val };
    if (typeof val === 'string') {
        const num = parseInt(val.replace(/[^0-9-]/g, '')) || 0;
        return { t: num, r: num, b: num, l: num };
    }
    return { t: 0, r: 0, b: 0, l: 0 };
}

module.exports = {
    parseTW,
    getColor,
    getShade,
    parseSpacing,
    packAnimation,
    normalizeGradient
};
