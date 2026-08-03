'use strict';

class AlignmentUtils {
    static padToAlignment(position, alignment) {
        if (alignment <= 1) return position;
        const remainder = position % alignment;
        if (remainder === 0) return position;
        return position + (alignment - remainder);
    }

    static getPaddingNeeded(position, alignment) {
        if (alignment <= 1) return 0;
        const remainder = position % alignment;
        if (remainder === 0) return 0;
        return alignment - remainder;
    }

    static createAlignedBuffer(data, alignment) {
        if (alignment <= 1) return data;
        const alignedSize = this.padToAlignment(data.length, alignment);
        const buffer = Buffer.alloc(alignedSize);
        data.copy(buffer);
        for (let i = data.length; i < alignedSize; i++) {
            buffer[i] = 0;
        }
        return buffer;
    }

    static validateAlignment(buffer, alignment) {
        if (alignment <= 1) return true;
        if (buffer.length % alignment !== 0) {
            return false;
        }
        return true;
    }
}

module.exports = AlignmentUtils;