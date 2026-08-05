'use strict';

/**
 * 🗺️ ComponentOpcodeMapper — Maps UI tags, React component types, and Tailwind classes to Titan Opcodes.
 */
class ComponentOpcodeMapper {
    static mapOpcode(compType = '', tw = '', props = {}) {
        const typeLower = String(compType).toLowerCase();
        const twStr = String(tw || '');

        if (props.type === 'GridView' || twStr.includes('grid-cols-')) return 0x22;
        if (typeLower === 'button' || props.type === 'Button') return 0x10;
        if (typeLower === 'card' || props.type === 'Card') return 0x11;
        if (typeLower === 'row' || props.type === 'Row' || twStr.includes('flex-row')) return 0x14;
        if (typeLower === 'column' || props.type === 'Column' || twStr.includes('flex-col')) return 0x13;
        if (typeLower === 'span' || typeLower === 'p' || typeLower === 'h1' || typeLower === 'h2' || typeLower === 'h3' || typeLower === 'label') return 0x16;
        if (typeLower === 'img' || props.type === 'Image') return 0x17;
        if (typeLower === 'input' || props.type === 'TextField') return 0x18;
        if (typeLower === 'switch' || props.type === 'Switch') return 0x1A;
        if (typeLower === 'checkbox' || props.type === 'Checkbox') return 0x1B;
        if (typeLower === 'select' || props.type === 'Select') return 0x1C;

        return 0x13; // Default Container
    }
}

module.exports = ComponentOpcodeMapper;
