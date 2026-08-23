'use strict';

/**
 * ⚡ TITAN COMPILER (Direct Single-Pass 2-Stage Pipeline)
 * ─────────────────────────────────────────────────────────────
 * Direct Lexical & Token-to-Bytecode Engine.
 * Converts JSX AST / Element Nodes directly into Titan 24-Byte Layout Binaries.
 * Eliminates intermediate JSON representations and prevents data truncation.
 */

class TitanCompiler {
    constructor() {
        this.PALETTE_MAP = {
            blue: 0x01, green: 0x02, red: 0x04, slate: 0x07, gray: 0x08,
            amber: 0x09, yellow: 0x0A, rose: 0x0B, cyan: 0x0C, indigo: 0x0D,
            emerald: 0x0E, purple: 0x06, dark: 0x07, light: 0x08, white: 0x08, black: 0x07
        };

        this.OPCODE_MAP = {
            button: 0x10, Button: 0x10,
            card: 0x11, Card: 0x11,
            container: 0x12, Container: 0x12, div: 0x12,
            column: 0x13, Column: 0x13,
            row: 0x14, Row: 0x14,
            stack: 0x15, Stack: 0x15,
            text: 0x16, Text: 0x16, span: 0x16, p: 0x16, label: 0x16, h1: 0x16, h2: 0x16, h3: 0x16, h4: 0x16,
            image: 0x17, Image: 0x17, img: 0x17,
            input: 0x18, TextField: 0x18, textarea: 0x18,
            slider: 0x19, Slider: 0x19,
            tabbar: 0x20, TabBar: 0x20,
            grid: 0x22, Grid: 0x22, GridView: 0x22,
            icon: 0x23, Icon: 0x23, i: 0x23,
            thorvg: 0x61, ThorVG: 0x61, svg: 0x61,
            state: 0xD0, State: 0xD0
        };
    }

    compile(node) {
        const binaries = [];
        const stringPool = [];
        this._compileNode(node, binaries, stringPool);
        return {
            binaries,
            stringPool,
            binaryLength: binaries.length * 24,
            componentsCount: binaries.length
        };
    }

    _compileNode(node, binaries, stringPool) {
        if (!node) return;

        if (typeof node === 'string' || typeof node === 'number') {
            const textStr = String(node).trim();
            if (textStr.length === 0) return;
            const bin = new Uint8Array(24);
            bin[1] = 0x16; // Text
            bin[2] = 250;  // 950 shade
            bin[3] = 0x08; // Neutral
            binaries.push(bin);
            stringPool.push(textStr);
            return;
        }

        const tag = (node.tag || node.type || 'div').toLowerCase();
        const props = node.props || {};
        const className = String(props.className || props.class || '');
        const children = node.children || [];

        const bin = new Uint8Array(24);
        let opcode = this.OPCODE_MAP[tag] || 0x12;

        const tokens = className.trim().split(/\s+/).filter(Boolean);
        if (tokens.includes('btn') && opcode === 0x12) opcode = 0x10;
        let pt = 0, pr = 0, pb = 0, pl = 0;
        let mt = 0, mr = 0, mb = 0, ml = 0;
        let bgPalette = 0, bgShade = 0;
        let borderPalette = 0, borderWidth = 0;
        let radius = 0;
        let flexWeight = 0;
        let gravity = 0;
        let sigFlags = 0;
        let stateKey = props.stateKey || props['state-key'] || props.state || '';
        let isRow = tag === 'row';
        let isCol = tag === 'column';

        for (let i = 0; i < tokens.length; i++) {
            const t = tokens[i];

            if (t === 'flex-row') { isRow = true; isCol = false; }
            else if (t === 'flex-col' || t === 'flex-column') { isCol = true; isRow = false; }
            else if (t === 'flex-1') flexWeight = 1;
            else if (t === 'flex-2') flexWeight = 2;
            else if (t === 'flex-3') flexWeight = 3;
            else if (t === 'items-center') gravity |= 0x01;
            else if (t === 'justify-center') gravity |= 0x02;
            else if (t === 'justify-between') sigFlags |= 0x20;

            else if (t.startsWith('p-') && !t.startsWith('px-') && !t.startsWith('py-') && !t.startsWith('pt-') && !t.startsWith('pr-') && !t.startsWith('pb-') && !t.startsWith('pl-')) {
                const val = this._parseUnits(t.slice(2));
                pt = val; pr = val; pb = val; pl = val;
            } else if (t.startsWith('px-')) {
                const val = this._parseUnits(t.slice(3));
                pr = val; pl = val;
            } else if (t.startsWith('py-')) {
                const val = this._parseUnits(t.slice(3));
                pt = val; pb = val;
            } else if (t.startsWith('pt-')) pt = this._parseUnits(t.slice(3));
            else if (t.startsWith('pr-')) pr = this._parseUnits(t.slice(3));
            else if (t.startsWith('pb-')) pb = this._parseUnits(t.slice(3));
            else if (t.startsWith('pl-')) pl = this._parseUnits(t.slice(3));

            else if (t.startsWith('-mt-')) mt = -this._parseUnits(t.slice(4));
            else if (t.startsWith('-mb-')) mb = -this._parseUnits(t.slice(4));
            else if (t.startsWith('-ml-')) ml = -this._parseUnits(t.slice(4));
            else if (t.startsWith('-mr-')) mr = -this._parseUnits(t.slice(4));
            else if (t.startsWith('-m-')) {
                const val = -this._parseUnits(t.slice(3));
                mt = val; mr = val; mb = val; ml = val;
            } else if (t.startsWith('m-') && !t.startsWith('mx-') && !t.startsWith('my-') && !t.startsWith('mt-') && !t.startsWith('mr-') && !t.startsWith('mb-') && !t.startsWith('ml-')) {
                const val = this._parseUnits(t.slice(2));
                mt = val; mr = val; mb = val; ml = val;
            } else if (t.startsWith('mx-')) {
                const val = this._parseUnits(t.slice(3));
                mr = val; ml = val;
            } else if (t.startsWith('my-')) {
                const val = this._parseUnits(t.slice(3));
                mt = val; mb = val;
            } else if (t.startsWith('mt-')) mt = this._parseUnits(t.slice(3));
            else if (t.startsWith('mr-')) mr = this._parseUnits(t.slice(3));
            else if (t.startsWith('mb-')) mb = this._parseUnits(t.slice(3));
            else if (t.startsWith('ml-')) ml = this._parseUnits(t.slice(3));

            else if (t.startsWith('bg-')) {
                const clean = t.slice(3);
                const [pal, sh] = this._resolveColorAndShade(clean);
                if (pal !== 0) {
                    bgPalette = pal;
                    bgShade = sh;
                }
            }

            else if (t === 'border') {
                borderWidth = 1;
                sigFlags |= 0x04;
            } else if (t.startsWith('border-') && !t.startsWith('border-t-') && !t.startsWith('border-b-') && !t.startsWith('border-l-') && !t.startsWith('border-r-')) {
                const sub = t.slice(7);
                if (!isNaN(parseInt(sub)) && !sub.includes('-')) {
                    borderWidth = parseInt(sub);
                    sigFlags |= 0x04;
                } else {
                    const [pal] = this._resolveColorAndShade(sub);
                    if (pal !== 0) {
                        borderPalette = pal;
                        if (borderWidth === 0) borderWidth = 1;
                        sigFlags |= 0x04;
                    }
                }
            }

            else if (t === 'rounded') radius = 4;
            else if (t === 'rounded-full' || t === 'rounded-circle') radius = 255;
            else if (t === 'rounded-sm') radius = 2;
            else if (t === 'rounded-md') radius = 6;
            else if (t === 'rounded-lg') radius = 8;
            else if (t === 'rounded-xl') radius = 12;
            else if (t === 'rounded-2xl') radius = 16;
            else if (t === 'rounded-3xl') radius = 24;
            else if (t === 'rounded-none') radius = 0;
            else if (t.startsWith('rounded-[')) {
                radius = parseInt(t.slice(9, -3)) || 0;
            }

            else if (t === 'shadow' || t.startsWith('shadow-')) {
                sigFlags |= 0x40;
            }
        }

        if (tag === 'div' || tag === 'container') {
            if (isRow) opcode = 0x14;
            else if (isCol) opcode = 0x13;
        }

        if (stateKey) sigFlags |= 0x08;

        bin[0] = ((flexWeight & 0x0F) << 4) | (gravity & 0x0F);
        bin[1] = opcode;
        bin[2] = bgShade & 0xFF;
        bin[3] = bgPalette & 0xFF;
        bin[4] = Math.min(pt, 255);
        bin[5] = Math.min(pr, 255);
        bin[6] = Math.min(pb, 255);
        bin[7] = Math.min(pl, 255);
        bin[8] = (256 + mt) & 0xFF;
        bin[9] = (256 + mr) & 0xFF;
        bin[10] = (256 + mb) & 0xFF;
        bin[11] = (256 + ml) & 0xFF;
        bin[12] = Math.min(borderWidth, 255);
        bin[13] = borderPalette & 0xFF;
        bin[14] = Math.min(radius, 255);
        bin[15] = sigFlags & 0xFF;

        binaries.push(bin);
        this._populateStringPool(opcode, tag, props, children, stringPool);

        const isLeaf = (opcode === 0x16 || opcode === 0x10 || opcode === 0x17 || opcode === 0x18 || opcode === 0x23 || opcode === 0x61);
        if (!isLeaf && Array.isArray(children)) {
            for (let c = 0; c < children.length; c++) {
                this._compileNode(children[c], binaries, stringPool);
            }
        }
    }

    _parseUnits(str) {
        if (!str) return 0;
        if (str.startsWith('[') && str.endsWith('px]')) {
            return parseFloat(str.slice(1, -3)) || 0;
        }
        const val = parseFloat(str);
        if (isNaN(val)) return 0;
        return Math.round(val * 4);
    }

    _resolveColorAndShade(colorStr) {
        if (!colorStr) return [0, 0];
        let clean = colorStr;
        let opacity = 100;

        if (clean.includes('/')) {
            const parts = clean.split('/');
            clean = parts[0];
            opacity = parseInt(parts[1], 10) || 100;
        }

        const segments = clean.split('-');
        const colorName = segments[0];
        const shadeNum = segments[1] ? parseInt(segments[1], 10) : 500;

        const paletteId = this.PALETTE_MAP[colorName] || 0;
        let shadeByte = Math.min(Math.round(shadeNum / 4), 250);

        if (opacity === 90) shadeByte = 254;
        else if (opacity === 80) shadeByte = 253;
        else if (opacity === 40) shadeByte = 252;
        else if (opacity === 60) shadeByte = 251;

        return [paletteId, shadeByte];
    }

    _populateStringPool(opcode, tag, props, children, stringPool) {
        switch (opcode) {
            case 0x16:
                const textContent = props.text || (typeof children[0] === 'string' ? children[0] : (typeof children === 'string' ? children : ''));
                stringPool.push(textContent || '');
                break;
            case 0x10: {
                let btnLabel = props.label || props.title || props.text || '';
                if (!btnLabel && Array.isArray(children)) {
                    for (const c of children) {
                        if (typeof c === 'string' || typeof c === 'number') {
                            const str = String(c).trim();
                            if (str) btnLabel += (btnLabel ? ' ' : '') + str;
                        } else if (c && typeof c === 'object' && c.children) {
                            const subText = typeof c.children === 'string' ? c.children.trim() : '';
                            if (subText) btnLabel += (btnLabel ? ' ' : '') + subText;
                        }
                    }
                } else if (!btnLabel && (typeof children === 'string' || typeof children === 'number')) {
                    btnLabel = String(children).trim();
                }
                stringPool.push(btnLabel || 'Button');
                stringPool.push(props.action || '');
                break;
            }
            case 0x18:
                stringPool.push(props.stateKey || props.name || '');
                stringPool.push(props.label || '');
                stringPool.push(props.placeholder || props.hint || '');
                stringPool.push(props.type || 'text');
                stringPool.push(props.variant || 'plain');
                const leftIcon = props.icon || props.leftIcon || '';
                const rightIcon = props.rightIcon || props.suffixIcon || '';
                stringPool.push(rightIcon ? (leftIcon + '|' + rightIcon) : leftIcon);
                break;
            case 0x23:
                const iconName = props.name || props.icon || props.className || '';
                stringPool.push(iconName);
                break;
            case 0x61:
                stringPool.push(props.action || '');
                stringPool.push(props.svg || props.src || '');
                break;
            default:
                if (props.action) stringPool.push(props.action);
                break;
        }
    }
}

module.exports = TitanCompiler;
