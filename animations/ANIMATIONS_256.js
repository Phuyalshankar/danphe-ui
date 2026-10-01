'use strict';

/**
 * ⚡ ANIMATIONS_256 (danphe-ui / animations)
 * Full 256 Distinct 1-Byte Hardware Animation Spectrum (0x00 to 0xFF)
 * ═════════════════════════════════════════════════════════════════════════════
 * • 0x00 - 0x1F (0-31):   BIOMETRICS, SIGNALS, PULSE & RADAR
 * • 0x20 - 0x3F (32-63):  UI MICRO-INTERACTIONS, BUTTONS & SPRING PHYSICS
 * • 0x40 - 0x5F (64-95):  ✍️ TYPOGRAPHY, KINETIC TEXT & TYPEWRITER SUITE
 * • 0x60 - 0x7F (96-127): VIDEO TRANSITIONS, ZOOM WIPES & GLITCH DISTORTION
 * • 0x80 - 0x9F (128-159):3D ISOMETRIC HUD, GYROSCOPE & SPATIAL PHYSICS
 * • 0xA0 - 0xBF (160-191):NATURAL ELEMENTS: FIRE, PLASMA, RAIN & AURORA
 * • 0xC0 - 0xDF (192-223):AUDIO DSP, SOUND-REACTIVE VUMETERS & FREQUENCY
 * • 0xE0 - 0xFF (224-255):SIP TELEPHONY, HARDWARE 7-SEG, LEDS & PACKET HIGHWAY
 */

const ANIMATIONS_256 = {};

function reg(id, name, label, cssClass, duration, category = 'general') {
    ANIMATIONS_256[id] = { id, name, label, cssClass, duration, category };
}

// ── DOMAIN 0: BIOMETRICS & SIGNALS (0x00 - 0x1F) ──
reg(0x00, 'STATIC_IDLE',         'Static Idle (No Motion)',          'titan-anim-idle',        '0s',   'signal');
reg(0x01, 'HEARTBEAT',           'Biometric Heartbeat (Double)',     'titan-anim-heartbeat',   '1.2s', 'biometric');
reg(0x02, 'RADAR_SWEEP',         'Radar Beacon Sweep 360°',          'titan-anim-radar',       '2.0s', 'signal');
reg(0x03, 'LASER_SCAN',          'Cyber Laser Scanline',             'titan-anim-laser',       '1.5s', 'signal');
reg(0x04, 'NEON_BREATHE',        'Neon Ambient Breathe Glow',        'titan-anim-breathe',     '2.4s', 'light');
reg(0x05, 'LIQUID_RIPPLE',       'Liquid Surface Ripple Wave',       'titan-anim-ripple',      '1.8s', 'fluid');
reg(0x06, 'VECTOR_SPIN',         'High-Speed 120fps Spinner',        'titan-anim-spin',        '0.8s', 'motion');
reg(0x07, 'TACTILE_SPRING',      '3D Elastic Spring Bounce',         'titan-anim-spring',      '0.6s', 'physics');
reg(0x08, 'CYBER_GLITCH',        'Cyberpunk Hologram Glitch',        'titan-anim-glitch',      '1.0s', 'fx');
reg(0x09, 'SHAKE_ALARM',         'Emergency Seismic Alarm',          'titan-anim-shake',       '0.5s', 'alert');
reg(0x0A, 'MATRIX_STREAM',       'Matrix Digital Data Stream',       'titan-anim-matrix',      '1.4s', 'digital');
reg(0x0B, 'HOLOGRAM_SHIMMER',    'Hologram Iridescent Shimmer',      'titan-anim-shimmer',     '2.0s', 'light');
reg(0x0C, 'ELECTRIC_ARC',        'High-Voltage Electric Spark',      'titan-anim-spark',       '0.7s', 'energy');
reg(0x0D, 'ZERO_G_FLOAT',        'Zero-G Orbital Levitation',        'titan-anim-float',       '3.0s', 'physics');
reg(0x0E, 'ELASTIC_POP',         'Tactile Micro-Switch Pop',         'titan-anim-pop',         '0.4s', 'ui');
reg(0x0F, 'BEACON_PING',         'Sonar Submarine Ping Wave',        'titan-anim-ping',        '1.6s', 'signal');
reg(0x10, 'CALL_RINGING',        'SIP Call Ringing Vibration',       'titan-anim-ring',        '0.8s', 'telecom');
reg(0x11, 'WAVE_CASCADE',        'DSP Audio Waveform Cascade',       'titan-anim-wave',        '1.1s', 'audio');
reg(0x12, 'VORTEX_TWIST',        'Relativistic Vortex Twist',        'titan-anim-vortex',      '2.2s', 'motion');
reg(0x13, 'PENDULUM_SWING',      'Precision Pendulum Swing',         'titan-anim-pendulum',    '1.5s', 'physics');
reg(0x14, 'TORCH_FLICKER',       'Organic Torch Flame Flicker',      'titan-anim-torch',       '1.3s', 'light');
reg(0x15, 'QUANTUM_JITTER',      'Subatomic Quantum Jitter',         'titan-anim-jitter',      '0.3s', 'fx');
reg(0x16, 'WARP_STRETCH',        'Hyperspace Warp Stretch',          'titan-anim-warp',        '1.0s', 'motion');
reg(0x17, 'STROBE_FLASH',        'High-Frequency Strobe Flash',      'titan-anim-strobe',      '0.2s', 'light');
reg(0x18, 'SPIRAL_GALAXY',       'Logarithmic Spiral Galaxy',        'titan-anim-spiral',      '3.5s', 'motion');
reg(0x19, 'MAGNETIC_SNAP',       'Magnetic Attractor Snap',          'titan-anim-magnet',      '0.5s', 'physics');
reg(0x1A, 'ECG_SPIKE_QRS',       'Medical ICU ECG QRS Spike',        'titan-anim-ecg',         '0.9s', 'biometric');
reg(0x1B, 'CARDIAC_ARRHYTHMIA',  'Irregular Pulse Arrhythmia',       'titan-anim-arrhythmia',  '1.4s', 'biometric');
reg(0x1C, 'HYPERDRIVE_BLOOM',    'Hyperdrive Whiteout Bloom',        'titan-anim-bloom',       '1.6s', 'light');
reg(0x1D, 'SUB_BASS_THUMP',      '20Hz Sub-Bass Subwoofer Thump',    'titan-anim-thump',       '0.8s', 'audio');
reg(0x1E, 'PLASMA_CORONA',       'Solar Plasma Corona Discharge',    'titan-anim-plasma',      '2.5s', 'energy');
reg(0x1F, 'BLACKHOLE_SIPHON',    'Singularity Event Horizon',        'titan-anim-siphon',      '2.8s', 'motion');

// ── DOMAIN 1: UI MICRO-INTERACTIONS (0x20 - 0x3F) ──
reg(0x20, 'BTN_JIGGLE',          'Playful Button Jiggle',            'titan-anim-btn-jiggle',  '0.6s', 'ui');
reg(0x21, 'BADGE_BOUNCE',        'Notification Badge Bounce',        'titan-anim-badge-bounce','0.8s', 'ui');
reg(0x22, 'BELL_SWING',          'Alert Bell Harmonic Swing',        'titan-anim-bell-swing',  '1.0s', 'ui');
reg(0x23, 'THUMBS_UP_POP',       'Social Reaction Thumbs Pop',       'titan-anim-thumbs-pop',  '0.5s', 'ui');
reg(0x24, 'STAR_BURST',          'Favorited Star Sparkle Burst',     'titan-anim-star-burst',  '0.7s', 'ui');
reg(0x25, 'LOCK_SHAKE_ERROR',    'Invalid Password Shake Error',     'titan-anim-lock-error',  '0.4s', 'ui');
reg(0x26, 'CHECK_SUCCESS_MORPH', 'Success Checkmark Morph Stamp',    'titan-anim-check-stamp', '0.6s', 'ui');
reg(0x27, 'DOWNLOAD_DROP',       'File Download Drop & Bounce',      'titan-anim-dl-drop',     '1.1s', 'ui');
reg(0x28, 'UPLOAD_ROCKET',       'Cloud Upload Rocket Jet',          'titan-anim-ul-jet',      '1.2s', 'ui');
reg(0x29, 'CART_WOBBLE',         'E-Commerce Cart Item Wobble',      'titan-anim-cart-wobble', '0.7s', 'ui');
reg(0x2A, 'SWITCH_SNAP',         'Hardware Toggle Switch Snap',      'titan-anim-switch-snap', '0.3s', 'ui');
reg(0x2B, 'VUMETER_BARS',        'Audio Level Meter 8-Segment Bar',  'titan-anim-vu-meter',    '0.5s', 'audio');
reg(0x2C, 'BATTERY_CHARGE_FLOW', 'Liquid Green Battery Charge Flow', 'titan-anim-bat-charge',  '1.5s', 'ui');
reg(0x2D, 'SIGNAL_BAR_LADDER',   '5G Signal Strength Bar Escalation','titan-anim-sig-ladder',  '1.0s', 'ui');
reg(0x2E, 'TRASH_CRUMPLE',       'Delete Item Crumple & Drop',       'titan-anim-trash-drop',  '0.6s', 'ui');
reg(0x2F, 'BOOKMARK_RIBBON',     'Bookmark Ribbon Drop Down',        'titan-anim-bookmark',    '0.8s', 'ui');
reg(0x30, 'CARD_FLIP_Y',         '3D Card Flip on Y-Axis (180°)',    'titan-anim-flip-y',      '0.8s', '3d');
reg(0x31, 'CARD_TILT_X',         '3D Card Tilt on X-Axis Perspective','titan-anim-tilt-x',     '0.9s', '3d');
reg(0x32, 'ACCORDION_UNFOLD',    'Smooth Quadratic Accordion Unfold','titan-anim-accordion',   '0.5s', 'ui');
reg(0x33, 'MODAL_ZOOM_IN',       'Dialog Modal Zoom Pop Entrance',   'titan-anim-modal-zoom',  '0.4s', 'ui');
reg(0x34, 'DRAWER_SLIDE_IN',     'Side Navigation Drawer Slide In',  'titan-anim-drawer-slide','0.4s', 'ui');
reg(0x35, 'TOAST_DROP_DOWN',     'Floating Toast Drop & Settle',     'titan-anim-toast-drop',  '0.5s', 'ui');
reg(0x36, 'TOOLTIP_SPRING',      'Contextual Tooltip Spring Emergence','titan-anim-tooltip-pop','0.3s', 'ui');
reg(0x37, 'BORDER_CHASE_CYAN',   'Neon Cyan Active Border Chase',    'titan-anim-border-cyan', '1.8s', 'ui');
reg(0x38, 'RAINBOW_GRADIENT_BAR','Animated Rainbow Edge Bar Flow',   'titan-anim-rainbow-bar', '2.5s', 'ui');
reg(0x39, 'SKELETON_SHIMMER',    'Content Loading Skeleton Shimmer', 'titan-anim-skeleton',    '1.5s', 'ui');
reg(0x3A, 'DROPDOWN_CASCADE',    'Menu Cascade Dropdown Waterfall',  'titan-anim-cascade',     '0.6s', 'ui');
reg(0x3B, 'RIPPLE_CLICK_BURST',  'Material Ink Tap Ripple Burst',    'titan-anim-ink-ripple',  '0.6s', 'ui');
reg(0x3C, 'FAB_PULSE_ACTION',    'Floating Action Button Neon Halo', 'titan-anim-fab-halo',    '2.0s', 'ui');
reg(0x3D, 'GLASS_FROST_FADE',    'Frosted Glassmorphism Backdrop Glow','titan-anim-glass-frost','1.4s','ui');
reg(0x3E, 'FOCUS_RING_EXPAND',   'Accessibility Focus Ring Pulse',   'titan-anim-focus-ring',  '1.0s', 'ui');
reg(0x3F, 'RUBBER_SQUASH',       'Squash & Stretch Kinetic Impact',  'titan-anim-rubber-squash','0.5s','physics');

// ── DOMAIN 2: ✍️ TYPOGRAPHY, KINETIC TEXT & CIRCULAR SUITE (0x40 - 0x5F) ──
reg(0x40, 'CIRCULAR_ORBIT_SPIN',  '360° Rotating Circular Text Orbit Badge',     'titan-anim-type-circular-orbit', '3.0s', 'type');
reg(0x41, '3D_CYLINDER_DRUM',     '3D Cylindrical Barrel Drum Spin',             'titan-anim-type-cylinder-drum',  '2.4s', 'type');
reg(0x42, 'SPIRAL_VORTEX_IN',     'Singularity Spiral Vortex Inward Decrypt',     'titan-anim-type-spiral-vortex',  '2.0s', 'type');
reg(0x43, 'KARAOKE_WORD_BOUNCE',  'Hormozi / Viral Shorts Word-by-Word Bounce',   'titan-anim-type-karaoke-bounce', '1.2s', 'type');
reg(0x44, 'ROLLERCOASTER_SINE',   'Curved Sine-Wave Rollercoaster Motion Path',   'titan-anim-type-rollercoaster',  '2.2s', 'type');
reg(0x45, 'TYPEWRITER_CURSOR',    'Classic Terminal Typing with Blinking Caret |','titan-anim-typewriter',         '2.0s', 'type');
reg(0x46, 'TYPE_GLITCH_DECRYPT',  'Cyberpunk Matrix Code Decrypt & Reveal',      'titan-anim-type-decrypt',        '1.4s', 'type');
reg(0x47, 'TYPE_NEON_FLICKER',    'Broadway Neon Billboard Letter Sparks',       'titan-anim-type-neon',           '1.5s', 'type');
reg(0x48, 'TYPE_3D_FLIP_IN',      '3D Letter Tumbling Cascade on Y-Axis',        'titan-anim-type-3d-flip',        '1.2s', 'type');
reg(0x49, 'TYPE_ELASTIC_BOUNCE',  'Kinetic Gravity Drop & Rubber Letter Bounce', 'titan-anim-type-bounce',         '1.0s', 'type');
reg(0x4A, 'TYPE_RAINBOW_FLOW',    'Liquid Iridescent Spectrum Rainbow Flow',     'titan-anim-type-rainbow',        '3.0s', 'type');
reg(0x4B, 'TYPE_GOLDEN_SHINE',    'Metallic 24K Gold Sheen Beam Reflection',     'titan-anim-type-gold',           '2.0s', 'type');
reg(0x4C, 'TYPE_FIRE_BURN_IN',    'Incandescent Glowing Fire Ember Words',       'titan-anim-type-fire',           '1.8s', 'type');
reg(0x4D, 'TYPE_RGB_SPLIT',       'Chromatic Aberration RGB Letter Stutter',     'titan-anim-type-rgb',            '0.8s', 'type');
reg(0x4E, 'TYPE_SMOKE_DISSOLVE',  'Gaussian Particle Smoke Vaporize',            'titan-anim-type-smoke',          '1.8s', 'type');
reg(0x4F, 'TYPE_CINEMATIC_TRACK', 'Anamorphic Letter Tracking Expansion',        'titan-anim-type-track',          '2.5s', 'type');
reg(0x50, 'TYPE_LASER_ETCH',      'High-Precision Blue Laser Vector Etch',       'titan-anim-type-laser',          '1.6s', 'type');
reg(0x51, 'TYPE_HACKER_CODE',     'Green Terminal Matrix Decode Cascade',        'titan-anim-type-hacker',         '1.4s', 'type');
reg(0x52, 'TYPE_SMOOTH_WIPE',     'Cinematic Smooth Character Width Wipe',       'titan-anim-type-wipe',           '1.6s', 'type');
reg(0x53, 'TYPE_3D_EXTRUDE',      'Isometric 3D Depth Block Extrusion',          'titan-anim-type-extrude',        '1.5s', 'type');
reg(0x54, 'TYPE_EXPLODE_BURST',   'Radial Letter Particle Blast on Trigger',     'titan-anim-type-explode',        '0.9s', 'type');
reg(0x55, 'TYPE_AURORA_GLOW',     'Nordic Aurora Borealis Ambient Text Glow',    'titan-anim-type-aurora',         '3.0s', 'type');
reg(0x56, 'TYPE_RETRO_8BIT',      'Arcade 8-Bit Pixelated Stepped Jump Typing',  'titan-anim-type-8bit',           '1.1s', 'type');
reg(0x57, 'TYPE_RANSOM_NOTE',     'Punky Cutout Letter Angle Stagger',           'titan-anim-type-ransom',         '1.0s', 'type');
reg(0x58, 'TYPE_CALLIGRAPHY',     'Vector Bézier Handwriting Stroke Draw',       'titan-anim-type-cursive',        '2.4s', 'type');
reg(0x59, 'TYPE_VORTEX_SUCK',     'Gravitational Center Vortex Siphon',          'titan-anim-type-vortex',         '1.8s', 'type');
reg(0x5A, 'TYPE_UNDERLINE_DRAW',  'Energetic Brush Stroke Underline Draw',       'titan-anim-type-uline',          '0.8s', 'type');
reg(0x5B, 'TYPE_BALLOON_POP',     'Glossy 3D Bubble Text Inflation',             'titan-anim-type-balloon',        '0.7s', 'type');
reg(0x5C, 'TYPE_ELECTRIC_ZAP',    'High-Voltage Branching Lightning Across Words','titan-anim-type-zap',           '0.8s', 'type');
reg(0x5D, 'TYPE_WATER_DROP',      'Submerged Fluid Refraction Ripples',          'titan-anim-type-water',          '2.0s', 'type');
reg(0x5E, 'TYPE_WARP_SPEED',      'Sci-Fi Hyperspace Velocity Text Streak',      'titan-anim-type-warp',           '1.2s', 'type');
reg(0x5F, 'TYPE_MIRROR_SPLIT',    'Vertical Dual Mirror Reflection Split',       'titan-anim-type-mirror',         '1.4s', 'type');

// ── DOMAIN 3: VIDEO TRANSITIONS & WIPES (0x60 - 0x7F) ──
for (let i = 0x60; i <= 0x7F; i++) {
    const subIdx = i - 0x60;
    const names = [
        'CROSS_DISSOLVE_4K', 'WHIP_PAN_RIGHT', 'ZOOM_BURST_TRANSITION', 'IRIS_CIRCLE_WIPE',
        'GLITCH_ANALOG_VHS', 'RGB_SPLIT_WIPE', 'FILM_BURN_FLASH', 'LIGHT_LEAK_ORANGE',
        'BARN_DOOR_SPLIT', 'RADIAL_CLOCK_WIPE', 'MOSAIC_PIXEL_BLUR', 'DIRECTIONAL_SMEAR',
        'LUMA_FADE_HIGH', 'INK_DROP_TRANSITION', 'CUBE_3D_ROTATE', 'PAGE_CURL_ALBUM',
        'SHUTTER_BLADE_WIPE', 'HEATWAVE_DISTORT', 'KALEIDOSCOPE_FX', 'PRISM_REFRACTION',
        'STRETCH_SNAP_ZOOM', 'SPLIT_SCREEN_DUAL', 'MATRIX_SCAN_WIPE', 'FLASH_WHITE_POP',
        'SHAKE_IMPACT_ZOOM', 'SMOOTH_PUSH_UP', 'SMOOTH_SLIDE_LEFT', 'ELASTIC_OVERLAP',
        'SPIN_BLUR_CLOCK', 'DIAGONAL_STRIPE_WIPE', 'POLAROID_SNAP_FX', 'END_CARD_FADE_BLACK'
    ];
    const n = names[subIdx] || ('VIDEO_FX_0x' + i.toString(16).toUpperCase());
    reg(i, n, `Video Dynamic FX: ${n.replace(/_/g, ' ')}`, 'titan-anim-video-fx', '1.0s', 'video');
}

// ── DOMAIN 4: 3D HUD & SPATIAL PHYSICS (0x80 - 0x9F) ──
for (let i = 0x80; i <= 0x9F; i++) {
    const subIdx = i - 0x80;
    const names = [
        'HUD_TARGET_LOCK', 'ISOMETRIC_CUBE_SPIN', 'GYRO_STABILIZER_RING', 'CYBER_CROSSHAIR',
        'HEURISTIC_DATA_RING', 'DEPTH_PARALLAX_3D', 'SPHERICAL_WARP_GLOBE', 'HEXAGON_SHIELD_GRID',
        'HOLOGRAM_PYRAMID', 'QUANTUM_ORBIT_ELECTRONS', 'SATELLITE_TELEMETRY', 'AEROSPACE_ALTIMETER',
        'VECTOR_COMPASS_360', 'SONAR_DEPTH_GRID', 'TOPOGRAPHIC_ELEVATION', 'BIOMETRIC_RETINA_SCAN',
        'FINGERPRINT_BÉZIER_PASS', 'DNA_HELIX_ROTATION', 'NEURAL_SYNAPSE_PULSE', 'CYBER_SKULL_HOLOGRAM',
        'CIRCUIT_TRACE_LIGHT', 'OPTICAL_LENS_FLARE', 'DIFFRACTION_SPIKE', 'MATRIX_RAIN_3D',
        'PARTICLE_COLLIDER', 'GRAVITATIONAL_LENS', 'WORMHOLE_TUNNEL', 'DIMENSIONAL_PORTAL',
        'ENERGY_FORCEFIELD_HEX', 'CYBER_CITY_WIREFRAME', 'REACTOR_CORE_OVERLOAD', 'TITAN_HIGHWAY_STREAM'
    ];
    const n = names[subIdx] || ('HUD_3D_0x' + i.toString(16).toUpperCase());
    reg(i, n, `3D Spatial HUD: ${n.replace(/_/g, ' ')}`, 'titan-anim-hud-3d', '1.5s', '3d');
}

// ── DOMAIN 5: NATURAL & PARTICLE ELEMENTS (0xA0 - 0xBF) ──
for (let i = 0xA0; i <= 0xBF; i++) {
    const subIdx = i - 0xA0;
    const names = [
        'PLASMA_BURST_SOLAR', 'NEON_LIGHTNING_BOLT', 'FIRE_EMBER_STREAM', 'VOLCANIC_LAVA_BUBBLE',
        'WATER_CAUSTIC_LIGHT', 'OCEAN_TIDAL_SURGE', 'SNOWFLAKE_CRYSTAL', 'BLIZZARD_WIND_GUST',
        'DESERT_SANDSTORM', 'METEOR_SHOWER_STREAK', 'SUPERNOVA_EXPLOSION', 'COSMIC_DUST_NEBULA',
        'AURORA_GREEN_RIBBON', 'RAINBOW_FOG_DIFFUSE', 'TOXIC_SMOG_ROLL', 'CRYSTAL_FACET_SHINE',
        'BIO_LUMINESCENT_JELLY', 'FOREST_LEAF_TUMBLE', 'TORNADO_FUNNEL_TWIST', 'TSUNAMI_CREST_CRASH',
        'EARTHQUAKE_FAULT_LINE', 'GEOTHERMAL_GEYSER', 'ELECTRIC_EEL_DISCHARGE', 'FIREFLY_SWARM_GLOW',
        'THUNDERSTORM_CLOUDS', 'CORONA_MASS_EJECTION', 'STARDUST_DISPERSAL', 'PHOTON_BURST_LASER',
        'SONIC_BOOM_RING', 'SHOCKWAVE_PRESSURE', 'ANTIMATTER_ANNIHILATION', 'GENESIS_SPARK_CREATION'
    ];
    const n = names[subIdx] || ('ELEMENT_0x' + i.toString(16).toUpperCase());
    reg(i, n, `Natural FX: ${n.replace(/_/g, ' ')}`, 'titan-anim-element', '2.0s', 'nature');
}

// ── DOMAIN 6: AUDIO DSP & SOUND REACTIVE (0xC0 - 0xDF) ──
for (let i = 0xC0; i <= 0xDF; i++) {
    const subIdx = i - 0xC0;
    const names = [
        'DSP_SPECTRUM_ANALYZER', 'OSCILLOSCOPE_LIFESIGN', 'CIRCULAR_AUDIO_ORBIT', 'STEREO_PHASE_CORRELATOR',
        'PARAMETRIC_EQ_DANCE', 'SUB_WOOFER_CONE_EXCURSION', 'TAPE_WARBLE_WOW', 'VINYL_CRACKLE_SPARK',
        'SYNTHESIZER_LFO_SWEEP', 'REVERB_TAIL_DIFFUSE', 'DELAY_ECHO_BOUNCE', 'BITCRUSHER_SAMPLE_STEP',
        'CHORUS_ROTARY_SPEAKER', 'FLANGER_COMB_FILTER', 'VOCODER_CARRIER_WAVE', 'WHITE_NOISE_CASCADE',
        'PINK_NOISE_AMBIENCE', 'KICK_DRUM_IMPACT', 'SNARE_SNAP_TRANSIENT', 'HI_HAT_SIZZLE_SHIMMER',
        'BASSLINE_ACID_303', 'LEAD_SAW_DETUNE', 'PAD_LUSH_SWELL', 'CHIP_TUNE_ARPEGGIATOR',
        'MASTER_LIMITER_CLIP', 'EXPANDER_GATE_BREATHE', 'ANALOG_TUBE_WARMTH', 'SIDECHAIN_DUCK_PUMP',
        'MULTIBAND_CROSSOVER', 'DOLBY_ATMOS_OBJECT_PAN', 'BINAURAL_3D_HEAD_TRACK', 'TITAN_DSP_BIT_PERFECT'
    ];
    const n = names[subIdx] || ('AUDIO_0x' + i.toString(16).toUpperCase());
    reg(i, n, `Audio DSP: ${n.replace(/_/g, ' ')}`, 'titan-anim-audio', '1.0s', 'audio');
}

// ── DOMAIN 7: TELEPHONY, HARDWARE & PACKET HIGHWAY (0xE0 - 0xFF) ──
for (let i = 0xE0; i <= 0xFF; i++) {
    const subIdx = i - 0xE0;
    const names = [
        'SIP_TRUNK_HANDSHAKE', 'PBX_AUTO_ATTENDANT_PULSE', 'IVR_VOICE_PROMPT_GLOW', 'EXT_LINE_BLF_BUSY',
        'CALL_TRANSFER_SLIDE', 'CONFERENCE_BRIDGE_SUM', 'VOICEMAIL_MWI_STUTTER', 'EMERGENCY_E911_FLASH',
        'SEVEN_SEG_DIGIT_FLICKER', 'MATRIX_LCD_DOT_REFRESH', 'HARDWARE_RELAY_CLICK', 'I2C_BUS_TELEMETRY',
        'SPI_CLOCK_BURST', 'CAN_BUS_VEHICLE_FRAME', 'MODBUS_RTU_QUERY', 'RS485_DIFFERENTIAL_TX',
        'BLUETOOTH_LE_ADVERTISE', 'ZIGBEE_MESH_HOP', 'LORA_WAN_LONG_RANGE', 'ETHERNET_PHY_LINK_BLINK',
        'FIBER_OPTIC_GIGABIT_PULSE', 'TITAN_0x5442_PACKET_BLAST', 'REGISTER_BUS_WRITE_FLASH', 'REGISTER_BUS_SUBSCRIBE_TICK',
        'HARDWARE_WATCHDOG_KICK', 'CPU_THROTTLE_WARNING', 'THERMAL_OVERHEAT_PULSE', 'POWER_SUPPLY_RAIL_3V3',
        'GROUND_FAULT_INTERRUPT', 'EEPROM_BURN_CYCLE', 'FIRMWARE_OTA_PROGRESS', 'DANPHE_TITAN_SYS_ONLINE'
    ];
    const n = names[subIdx] || ('HW_0x' + i.toString(16).toUpperCase());
    reg(i, n, `Hardware & Telecom: ${n.replace(/_/g, ' ')}`, 'titan-anim-telecom', '0.8s', 'hardware');
}

// 🏷️ Named Constants Enum for Clean Autocomplete
const TITAN_ANIM = {
    // Biometrics & Signals
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
    PENDULUM_SWING:   0x13,

    // Typography & Kinetic Text Suite (0x40 - 0x5F)
    TYPEWRITER_CURSOR:   0x40,
    TYPE_SMOOTH_WIPE:    0x41,
    TYPE_GLITCH_DECRYPT: 0x42,
    TYPE_KARAOKE_SWEEP:  0x43,
    TYPE_NEON_FLICKER:   0x44,
    TYPE_3D_FLIP_IN:     0x45,
    TYPE_ELASTIC_BOUNCE: 0x46,
    TYPE_WAVE_SINE:      0x47,
    TYPE_SMOKE_DISSOLVE: 0x48,
    TYPE_CINEMATIC_TRACK:0x49,
    TYPE_FADE_UP_WORDS:  0x4A,
    TYPE_RGB_SPLIT:      0x4B,
    TYPE_FIRE_BURN_IN:   0x4C,
    TYPE_GOLDEN_SHINE:   0x4D,
    TYPE_SLOT_MACHINE:   0x4E,
    TYPE_STAMP_SLAM:     0x4F,
    TYPE_LASER_ETCH:     0x50,
    TYPE_HACKER_CODE:    0x51,
    TYPE_RAINBOW_FLOW:   0x52,
    TYPE_3D_EXTRUDE:     0x53,
    TYPE_EXPLODE_BURST:  0x54,
    TYPE_AURORA_GLOW:    0x55,
    TYPE_RETRO_8BIT:     0x56,
    TYPE_RANSOM_NOTE:    0x57,
    TYPE_CALLIGRAPHY:    0x58,
    TYPE_VORTEX_SUCK:    0x59,
    TYPE_UNDERLINE_DRAW: 0x5A,
    TYPE_BALLOON_POP:    0x5B,
    TYPE_ELECTRIC_ZAP:   0x5C,
    TYPE_WATER_DROP:     0x5D,
    TYPE_WARP_SPEED:     0x5E,
    TYPE_MIRROR_SPLIT:   0x5F
};

module.exports = {
    ANIMATIONS_256,
    TITAN_ANIM
};
