'use strict';

/**
 * 🗺️ ComponentOpcodeMapper — Maps UI tags, React component types, and Tailwind classes to Titan Opcodes.
 */
class ComponentOpcodeMapper {
    static mapOpcode(compType = '', tw = '', props = {}) {
        const typeLower = String(compType).toLowerCase();
        const twStr = String(tw || '');

        if (typeLower === 'drawer' || typeLower === 'keypaddrawer' || props.type === 'Drawer' || props.type === 'KeypadDrawer') return 0x28;
        if (typeLower === 'thorvg' || typeLower === 'svg' || typeLower === 'nativecanvas' || typeLower === 'canvas' || typeLower === 'vector' || typeLower === 'draw' || typeLower === 'nvr' || typeLower === '0x61' || props.type === 'ThorVG' || props.type === 'thorvg' || props.type === 'NativeCanvas' || props.type === 'nativecanvas' || props.type === 'canvas' || props.type === '0x61') return 0x61;
        if (typeLower === 'icon' || typeLower === 'i' || props.type === 'Icon' || props.type === 'icon') return 0x23;
        if (typeLower === 'video' || typeLower === 'videoplayer' || props.type === 'VideoPlayer' || props.type === 'video') return 0x52;
        if (typeLower === 'mp3player' || typeLower === 'audioplayer' || props.type === 'Mp3Player' || props.type === 'AudioPlayer') return 0x51;
        if (typeLower === 'webview' || typeLower === 'web' || typeLower === '0x60' || props.type === 'WebView' || props.type === 'webview' || props.type === '0x60') return 0x60;
        if (props.type === 'GridView' || twStr.includes('grid-cols-')) return 0x22;
        if (typeLower === 'button' || props.type === 'Button') return 0x10;
        if (typeLower === 'card' || props.type === 'Card') return 0x11;
        if (typeLower === 'row' || props.type === 'Row' || twStr.includes('flex-row')) return 0x14;
        if (typeLower === 'column' || props.type === 'Column' || twStr.includes('flex-col')) return 0x13;
        if (typeLower === 'span' || typeLower === 'p' || typeLower === 'h1' || typeLower === 'h2' || typeLower === 'h3' || typeLower === 'label') return 0x16;
        if (typeLower === 'img' || props.type === 'Image') return 0x17;
        
        // Form Controls (check type attributes before generic input)
        if (typeLower === 'switch' || props.type === 'switch' || props.type === 'Switch' || (typeLower === 'input' && props.type === 'switch')) return 0x1A;
        if (typeLower === 'checkbox' || props.type === 'checkbox' || props.type === 'Checkbox' || (typeLower === 'input' && props.type === 'checkbox')) return 0x1B;
        if (typeLower === 'radio' || props.type === 'radio' || props.type === 'RadioButton' || (typeLower === 'input' && props.type === 'radio')) return 0x1F;
        if (typeLower === 'slider' || typeLower === 'range' || props.type === 'range' || props.type === 'Slider' || (typeLower === 'input' && props.type === 'range')) return 0x19;
        if (typeLower === 'select' || props.type === 'Select') return 0x1C;
        if (typeLower === 'textarea' || props.type === 'textarea') return 0x18;
        if (typeLower === 'input' || props.type === 'TextField') return 0x18;

        // ── DSP: Dolphin State Protocol ──────────────────────────────
        // <state key="my_ext" />  OR  <state template="..." keys="..." />
        if (typeLower === 'state' || typeLower === 'statetext' || typeLower === 'state-text' ||
            props.type === 'State' || props.type === 'StateText') return 0xD0;

        return 0x13; // Default Container
    }
}

module.exports = ComponentOpcodeMapper;
