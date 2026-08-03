/**
 * TitanBinaryEncoder.js
 * 
 * Takes extracted DOM AST nodes from DOMScraperEngine and encodes them
 * into 16-byte fixed-width Titan binary packets and String Pools.
 * Compatible with Dolphin Native Android ViewFactory runtime.
 */

class TitanBinaryEncoder {
    constructor() {
        this.stringPool = [];
        this.binaries = [];
    }

    /**
     * Encodes an array of AST nodes into Titan binary buffer & string pool payload.
     */
    encode(astNodes) {
        this.stringPool = [];
        this.binaries = [];

        if (!Array.isArray(astNodes)) {
            return { binaryBuffer: Buffer.alloc(0), stringPool: [] };
        }

        for (const node of astNodes) {
            const packet = Buffer.alloc(16);
            packet.fill(0);

            // Byte 0: Opcode
            packet[0] = node.opcode & 0xFF;

            // Byte 1-4: X, Y coordinates (Int16BE)
            packet.writeInt16BE(node.bounds.x || 0, 1);
            packet.writeInt16BE(node.bounds.y || 0, 3);

            // Byte 5-7: Width, Height (Int16BE for W, Int8 for H or scaled)
            packet.writeInt16BE(node.bounds.width || 0, 5);

            // Byte 8-11: Margins / Paddings (Top, Right, Bottom, Left)
            packet[8] = node.padding.top & 0xFF;
            packet[9] = node.padding.right & 0xFF;
            packet[10] = node.padding.bottom & 0xFF;
            packet[11] = node.padding.left & 0xFF;

            // Byte 12: Border Radius / Style Modifier
            packet[12] = (node.styles.borderRadius || 0) & 0xFF;

            // Byte 13: Border Width
            packet[13] = (node.styles.borderWidth || 0) & 0xFF;

            // Byte 14: Font Size
            packet[14] = (node.styles.fontSize || 14) & 0xFF;

            // Byte 15: Flags (Bit 0: HasGradient/Effect, Bit 2: HasBorder, Bit 3: DynamicBindings)
            let flags = 0;
            if (node.styles.gradient) flags |= 0x01;
            if (node.styles.borderWidth > 0) flags |= 0x04;
            if (node.content || node.placeholder) flags |= 0x08;
            packet[15] = flags & 0xFF;

            this.binaries.push(packet);

            // Populate String Pool based on ViewFactory specifications:
            // String 0: Layout Metadata `${width}|${height}|${elevation}|${fontSize}`
            const w = node.bounds.width || 0;
            const h = node.bounds.height || 0;
            const elevation = node.styles.zIndex || 0;
            const fontSize = node.styles.fontSize || 14;
            this.stringPool.push(`${w}|${h}|${elevation}|${fontSize}`);

            // String 1: Gradient or Effect (if Bit 0 is set)
            if (flags & 0x01) {
                this.stringPool.push(node.styles.gradient || 'gradient-glass');
            }

            // String 2+: Border descriptor (if Bit 2 is set)
            if (flags & 0x04) {
                this.stringPool.push(`${node.styles.borderWidth || 1}px|solid|${node.styles.borderColor || '#cccccc'}`);
            }

            // Component Specific Strings
            this._pushStringsForNode(node);
        }

        const binaryBuffer = Buffer.concat(this.binaries);

        return {
            binaryBuffer,
            stringPool: this.stringPool,
            nodeCount: astNodes.length
        };
    }

    _pushStringsForNode(node) {
        switch (node.opcode) {
            case 0x10: // Button: action, text, icon
                this.stringPool.push(''); // Action
                this.stringPool.push(node.content || 'Button');
                this.stringPool.push(''); // Icon
                break;
            case 0x16: // Text: text/stateKey
                this.stringPool.push(node.content || '');
                break;
            case 0x18: // TextField: stateKey, label, hint, inputType, variant, icon
                this.stringPool.push(''); // stateKey
                this.stringPool.push(''); // label
                this.stringPool.push(node.placeholder || '');
                this.stringPool.push(node.inputType || 'text');
                this.stringPool.push('outlined'); // variant
                this.stringPool.push('||||24'); // icon descriptor
                break;
            case 0x11: // Card / Column / Container
            case 0x13:
            case 0x12:
            default:
                this.stringPool.push(''); // action/descriptor
                break;
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TitanBinaryEncoder };
} else {
    window.TitanBinaryEncoder = TitanBinaryEncoder;
}
