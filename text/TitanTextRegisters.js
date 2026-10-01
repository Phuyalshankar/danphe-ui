'use strict';

/**
 * ⚡ TITAN HARDWARE TEXT REGISTERS & BITMASKS (Bank 0x4200 - 0x4230)
 */
const TITAN_TEXT_BITS = {
    // Register 0x4210: Formatting & Shader Flags
    BOLD:              0x0001, // Bit 0
    ITALIC:            0x0002, // Bit 1
    ALL_CAPS:          0x0004, // Bit 2
    SMALL_CAPS:        0x0008, // Bit 3
    UNDERLINE:         0x0010, // Bit 4
    STRIKETHROUGH:     0x0020, // Bit 5
    GLOW_ACTIVE:       0x0040, // Bit 6
    STROKE_ACTIVE:     0x0080, // Bit 7
    DUAL_STROKE:       0x0100, // Bit 8
    DROP_SHADOW:       0x0200, // Bit 9
    INNER_SHADOW:      0x0400, // Bit 10
    EMBOSS_LIGHTING:   0x0800, // Bit 11
    
    // Register 0x4211: 3D & Advanced Transformations
    EXTRUDE_3D:        0x0001, // Bit 0: 3D Active
    OBLIQUE_MODE:      0x0002, // Bit 1: Oblique 3D (else Perspective)
    FLOOR_SHADOW_3D:   0x0004, // Bit 2: 3D Floor Shadow
    MIRROR_REFLECTION: 0x0008, // Bit 3: Floor Reflection
    CURVED_BEND:       0x0010, // Bit 4: Circular Arc Bend
    BACKDROP_BANNER:   0x0020, // Bit 5: Subtitle Background Banner
    METALLIC_GRADIENT: 0x0040, // Bit 6: Multi-Stop Gradient Fill
    NEON_PULSE_FX:     0x0080  // Bit 7: Neon Pulse Animation
};

const TITAN_TEXT_REG = {
    FONT_SIZE:       0x4200, // 10 - 240 px
    TRACKING:        0x4201, // -10 to +60 px (Letter-Spacing)
    STROKE_WIDTH:    0x4202, // 0 - 30 px (Primary Stroke)
    SHADOW_BLUR:     0x4203, // 0 - 60 px
    SHADOW_ANGLE:    0x4204, // 0 - 360 deg
    SHADOW_DIST:     0x4205, // 0 - 80 px
    EXTRUDE_DEPTH:   0x4206, // 0 - 40 px (3D Depth)
    GLOW_SPREAD:     0x4207, // 0 - 50 px
    OPACITY:         0x4208, // 0 - 100 %
    ROTATION_Z:      0x4209, // -180 to +180 deg
    ROTATION_X_3D:   0x420A, // -90 to +90 deg (3D Tilt)
    ROTATION_Y_3D:   0x420B, // -90 to +90 deg (3D Swivel)
    DUAL_STROKE_W:   0x420C, // 0 - 20 px (Outer Secondary Stroke)
    INNER_SHADOW_D:  0x420D, // 0 - 25 px
    CURVE_BEND_DEG:  0x420E, // -180 to +180 deg (Arc Bend)
    LINE_HEIGHT:     0x420F, // 0.8 to 2.5 em
    FLAGS_BITMASK_1: 0x4210, // 16-bit Bitmask (Formatting & Shaders)
    FLAGS_BITMASK_2: 0x4211, // 16-bit Bitmask (3D & Deformations)
    BANNER_PAD_X:    0x4212, // 0 - 60 px
    BANNER_PAD_Y:    0x4213, // 0 - 40 px
    BANNER_RADIUS:   0x4214  // 0 - 40 px
};

module.exports = {
    TITAN_TEXT_BITS,
    TITAN_TEXT_REG
};
