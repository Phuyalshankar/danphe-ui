'use strict';

/**
 * 🐬 TitanKotlinSimulator — Accurate JavaScript Mirror of Android Kotlin Runtime
 * 
 * Accurately simulates:
 * - ViewFactoryStyles.kt
 * - ColorParser.kt / ColorPalette.kt
 * - BorderApplier.kt
 * - TextBuilder.kt / ButtonBuilder.kt / RowBuilder.kt / ColumnBuilder.kt
 * - LayoutHelper.kt
 */
class TitanKotlinSimulator {
    constructor() {
        this.colorPalette = {
            0x00: '#00000000', // Transparent
            0x01: '#00f2fe',   // Cyan (Primary)
            0x02: '#10b981',   // Emerald (Success)
            0x03: '#ef4444',   // Rose / Danger
            0x04: '#f59e0b',   // Amber / Warning
            0x05: '#3b82f6',   // Blue / Info
            0x06: '#8b5cf6',   // Purple / Indigo
            0x07: '#64748b',   // Slate
            0x08: '#334155',   // Slate Dark
            0x09: '#0f172a',   // Slate 900
            0x0A: '#020617',   // Slate 950
            0x0B: '#ffffff',   // White
            0x0C: '#000000'    // Black
        };
    }

    /**
     * Decode a 24-Byte Titan Binary Opcode Slot
     * @param {Buffer|Uint8Array|Array} bin 24-byte array
     * @param {string} [stringPoolStr=''] The string pool for string offset resolution
     */
    decodeOpcode(bin, stringPoolStr = '') {
        if (!bin || bin.length < 24) {
            return { error: 'Invalid 24-byte opcode buffer length: ' + (bin ? bin.length : 0) };
        }

        const b = Array.from(bin);

        // Byte 0: Gravity & Flex
        const flexWeight = (b[0] >> 4) & 0x0F;
        const gravityCode = b[0] & 0x0F;
        let gravityDesc = 'START';
        if (gravityCode === 0x02) gravityDesc = 'CENTER';
        else if (gravityCode === 0x03) gravityDesc = 'END';
        else if (gravityCode === 0x04) gravityDesc = 'TOP';
        else if (gravityCode === 0x05) gravityDesc = 'BOTTOM';

        // Byte 1: Component Opcode Type
        const opcode = b[1];
        let componentType = 'Unknown (0x' + opcode.toString(16) + ')';
        let kotlinBuilder = 'ViewFactory.kt';

        switch (opcode) {
            case 0x10: componentType = 'Button'; kotlinBuilder = 'ButtonBuilder.kt'; break;
            case 0x12: componentType = 'Container / Card'; kotlinBuilder = 'CardBuilder.kt / ViewFactory.kt'; break;
            case 0x13: componentType = 'Column (flex-col)'; kotlinBuilder = 'ColumnBuilder.kt'; break;
            case 0x14: componentType = 'Row (flex-row)'; kotlinBuilder = 'RowBuilder.kt'; break;
            case 0x16: componentType = 'Text / Span / P'; kotlinBuilder = 'TextBuilder.kt'; break;
            case 0x1A: componentType = 'Image'; kotlinBuilder = 'ImageBuilder.kt'; break;
            case 0x1D: componentType = 'Header (h1-h6)'; kotlinBuilder = 'HeaderBuilder.kt'; break;
            case 0x1E: componentType = 'Screen'; kotlinBuilder = 'DolphinRuntime.kt'; break;
            case 0x20: componentType = 'TabBar'; kotlinBuilder = 'TabBuilder.kt'; break;
            case 0x22: componentType = 'Grid'; kotlinBuilder = 'GridBuilder.kt'; break;
            case 0x25: componentType = 'Icon'; kotlinBuilder = 'IconBuilder.kt'; break;
        }

        // Byte 2 & 3: Background Color & Shade
        const shadeIndex = b[2];
        const colorIndex = b[3];
        let bgColor = this.colorPalette[colorIndex] || (colorIndex === 0 ? 'TRANSPARENT' : `#Palette_${colorIndex}`);

        // Bytes 4..7: Padding T, R, B, L
        const padding = {
            top: b[4],
            right: b[5],
            bottom: b[6],
            left: b[7]
        };

        // Bytes 8..11: Margin T, R, B, L
        const margin = {
            top: b[8],
            right: b[9],
            bottom: b[10],
            left: b[11]
        };

        // Byte 12: Contextual Shade / Speed
        const contextShade = b[12];

        // Byte 13: Text Color Index
        const textColorIndex = b[13];
        let textColor = this.colorPalette[textColorIndex] || (textColorIndex === 0 ? '#FFFFFF (Default)' : `#TextPalette_${textColorIndex}`);

        // Byte 14: Corner Radius
        const cornerRadius = b[14];

        // Byte 15: Flags
        const flags = b[15];
        const hasBorder = (flags & 0x04) !== 0;
        const hasStateBinding = (flags & 0x08) !== 0;
        const isJustifyBetween = (flags & 0x20) !== 0;

        // Bytes 16..23: String Offset
        let stringContent = '';
        const strOffset = (b[16] << 8) | b[17];
        const strLen = (b[18] << 8) | b[19];
        if (stringPoolStr && strLen > 0 && strOffset + strLen <= stringPoolStr.length) {
            stringContent = stringPoolStr.substring(strOffset, strOffset + strLen);
        }

        return {
            rawHex: b.map(x => x.toString(16).padStart(2, '0').toUpperCase()).join(' '),
            componentType,
            kotlinBuilder,
            opcode: '0x' + opcode.toString(16).toUpperCase(),
            flexWeight,
            gravity: gravityDesc,
            padding,
            margin,
            cornerRadius: cornerRadius + 'px',
            backgroundColor: bgColor,
            textColor,
            hasBorder,
            hasStateBinding,
            isJustifyBetween,
            stringContent,
            nativeApplied: {
                viewClass: opcode === 0x16 ? 'android.widget.TextView' : (opcode === 0x10 ? 'MaterialButton' : 'LinearLayout'),
                setPaddingDp: `T:${padding.top}dp, R:${padding.right}dp, B:${padding.bottom}dp, L:${padding.left}dp`,
                setMarginDp: `T:${margin.top}dp, R:${margin.right}dp, B:${margin.bottom}dp, L:${margin.left}dp`,
                backgroundDrawable: bgColor !== 'TRANSPARENT' || cornerRadius > 0 || hasBorder
                    ? `GradientDrawable(Color=${bgColor}, Radius=${cornerRadius}dp, Stroke=${hasBorder ? '1dp' : '0'})`
                    : 'ColorDrawable(TRANSPARENT)',
                layoutParams: flexWeight > 0
                    ? `LinearLayout.LayoutParams(weight=${flexWeight}, width=MATCH_PARENT)`
                    : 'LinearLayout.LayoutParams(width=MATCH_PARENT/WRAP_CONTENT)'
            }
        };
    }
}

module.exports = TitanKotlinSimulator;
