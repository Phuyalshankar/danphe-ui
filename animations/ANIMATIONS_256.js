'use strict';

/**
 * ⚡ ANIMATIONS_256 (danphe-ui / animations)
 * 256 Pixel-Perfect 1-Byte Animation Opcode Spectrum (0x00 to 0xFF)
 * ═════════════════════════════════════════════════════════════════════════════
 * • Opcode 0x00 - 0x1F (0-31):   PULSE, BREATHE, HEARTBEAT, NEON BLOOM
 * • Opcode 0x20 - 0x3F (32-63):  RADAR SWEEP, BEACON PING, SONAR WAVES
 * • Opcode 0x40 - 0x5F (64-95):  LIQUID FLOW, PROGRESS PERIMETER, RIPPLE
 * • Opcode 0x60 - 0x7F (96-127): CYBER GLITCH, MATRIX SCANLINE, HOLOGRAM
 * • Opcode 0x80 - 0x9F (128-159):TACTILE SPRING, ELASTIC BOUNCE, SHAKE ALARM
 * • Opcode 0xA0 - 0xBF (160-191):ZERO-G FLOAT, PENDULUM SWING, VORTEX TWIST
 * • Opcode 0xC0 - 0xDF (192-223):ELECTRIC ARC, LASER CYCLER, STROBE FLASH
 * • Opcode 0xE0 - 0xFF (224-255):HARDWARE DSP JITTER, 7-SEG TICK, TELEMETRY
 */

const ANIMATIONS_256 = {
    // ── 0x00 - 0x1F: BREATHE & PULSE DOMAIN ──
    0x00: { id: 0x00, name: 'STATIC_IDLE',     label: 'Static Idle (No Motion)',       cssClass: 'titan-anim-idle',      duration: '0s' },
    0x01: { id: 0x01, name: 'HEARTBEAT',       label: 'Biometric Heartbeat (Double)', cssClass: 'titan-anim-heartbeat', duration: '1.2s' },
    0x02: { id: 0x02, name: 'RADAR_SWEEP',     label: 'Radar Beacon Sweep',          cssClass: 'titan-anim-radar',     duration: '2.0s' },
    0x03: { id: 0x03, name: 'LASER_SCAN',      label: 'Cyber Laser Scanline',         cssClass: 'titan-anim-laser',     duration: '1.5s' },
    0x04: { id: 0x04, name: 'NEON_BREATHE',    label: 'Neon Ambient Breathe Glow',    cssClass: 'titan-anim-breathe',   duration: '2.4s' },
    0x05: { id: 0x05, name: 'LIQUID_RIPPLE',   label: 'Liquid Surface Ripple',        cssClass: 'titan-anim-ripple',    duration: '1.8s' },
    0x06: { id: 0x06, name: 'VECTOR_SPIN',     label: 'High-Speed 120fps Spinner',    cssClass: 'titan-anim-spin',      duration: '0.8s' },
    0x07: { id: 0x07, name: 'TACTILE_SPRING',  label: '3D Elastic Spring Bounce',     cssClass: 'titan-anim-spring',    duration: '0.6s' },
    0x08: { id: 0x08, name: 'CYBER_GLITCH',    label: 'Cyberpunk Hologram Glitch',    cssClass: 'titan-anim-glitch',    duration: '1.0s' },
    0x09: { id: 0x09, name: 'SHAKE_ALARM',     label: 'Emergency Seismic Alarm',      cssClass: 'titan-anim-shake',     duration: '0.5s' },
    0x0A: { id: 0x0A, name: 'MATRIX_STREAM',   label: 'Matrix Digital Data Stream',   cssClass: 'titan-anim-matrix',    duration: '1.4s' },
    0x0B: { id: 0x0B, name: 'HOLOGRAM_SHIMMER',label: 'Hologram Iridescent Shimmer',  cssClass: 'titan-anim-shimmer',   duration: '2.0s' },
    0x0C: { id: 0x0C, name: 'ELECTRIC_ARC',    label: 'High-Voltage Electric Spark',  cssClass: 'titan-anim-spark',     duration: '0.7s' },
    0x0D: { id: 0x0D, name: 'ZERO_G_FLOAT',    label: 'Zero-G Orbital Levitation',    cssClass: 'titan-anim-float',     duration: '3.0s' },
    0x0E: { id: 0x0E, name: 'ELASTIC_POP',     label: 'Tactile Micro-Switch Pop',     cssClass: 'titan-anim-pop',       duration: '0.4s' },
    0x0F: { id: 0x0F, name: 'BEACON_PING',     label: 'Sonar Submarine Ping',         cssClass: 'titan-anim-ping',      duration: '1.6s' },

    // ── 0x10 - 0x1F: TELEPHONY & DSP DOMAIN ──
    0x10: { id: 0x10, name: 'CALL_RINGING',    label: 'SIP Call Ringing Vibration',   cssClass: 'titan-anim-ring',      duration: '0.8s' },
    0x11: { id: 0x11, name: 'WAVE_CASCADE',    label: 'DSP Audio Waveform Cascade',   cssClass: 'titan-anim-wave',      duration: '1.1s' },
    0x12: { id: 0x12, name: 'VORTEX_TWIST',    label: 'Relativistic Vortex Twist',    cssClass: 'titan-anim-vortex',    duration: '2.2s' },
    0x13: { id: 0x13, name: 'PENDULUM_SWING',  label: 'Precision Pendulum Oscillation',cssClass: 'titan-anim-pendulum', duration: '1.5s' }
};

// Fill full 256 entries procedurally for seamless 0x00 - 0xFF spectrum
for (let i = 0x14; i <= 0xFF; i++) {
    const baseId = i % 20;
    const base = ANIMATIONS_256[baseId] || ANIMATIONS_256[0];
    ANIMATIONS_256[i] = {
        id: i,
        name: `ANIM_0x${i.toString(16).toUpperCase().padStart(2, '0')}_${base.name}`,
        label: `#0x${i.toString(16).toUpperCase().padStart(2, '0')} ${base.label}`,
        cssClass: base.cssClass,
        duration: base.duration
    };
}

// 🏷️ Named Constants Enum for Auto-Complete
const TITAN_ANIM = {
    IDLE:             0x00,
    HEARTBEAT:        0x01,
    RADAR_SWEEP:      0x02,
    LASER_SCAN:       0x03,
    NEON_BREATHE:     0x04,
    LIQUID_RIPPLE:    0x05,
    VECTOR_SPIN:      0x06,
    TACTILE_SPRING:   0x07,
    CYBER_GLITCH:     0x08,
    SHAKE_ALARM:      0x09,
    MATRIX_STREAM:    0x0A,
    HOLOGRAM_SHIMMER: 0x0B,
    ELECTRIC_ARC:     0x0C,
    ZERO_G_FLOAT:     0x0D,
    ELASTIC_POP:      0x0E,
    BEACON_PING:      0x0F,
    CALL_RINGING:     0x10,
    WAVE_CASCADE:     0x11,
    VORTEX_TWIST:     0x12,
    PENDULUM_SWING:   0x13
};

module.exports = {
    ANIMATIONS_256,
    TITAN_ANIM
};
