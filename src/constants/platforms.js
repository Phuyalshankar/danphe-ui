'use strict';

// Platform-specific Magic Bytes
const MAGIC_BYTES = {
    NORMAL: 'DOLP',      // Standard buffer for Node.js/Web
    NATIVE: 'DOLP_MOB',  // Native mobile (4-byte aligned)
    EMBEDDED: 'DOLP_EMB' // Embedded with relative offsets
};

// Platform-specific constants
const PLATFORM_CONFIG = {
    NORMAL: {
        alignment: 1,      // No alignment requirement
        headerSize: 12,
        magicBytes: MAGIC_BYTES.NORMAL,
        pointerSize: 8,    // 64-bit pointers
        useRelativeOffsets: false
    },
    NATIVE: {
        alignment: 4,      // 4-byte alignment for C++ reinterpret_cast
        headerSize: 16,
        magicBytes: MAGIC_BYTES.NATIVE,
        pointerSize: 4,    // 32-bit pointers for mobile
        useRelativeOffsets: false
    },
    EMBEDDED: {
        alignment: 2,      // 2-byte alignment for embedded
        headerSize: 16,
        magicBytes: MAGIC_BYTES.EMBEDDED,
        pointerSize: 2,    // 16-bit relative offsets
        useRelativeOffsets: true,
        maxOffset: 65535   // Max 16-bit offset
    }
};

module.exports = {
    MAGIC_BYTES,
    PLATFORM_CONFIG
};