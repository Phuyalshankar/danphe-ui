'use strict';

/**
 * 🐬 DANPHE EFFECTS 256 (danphe-ui/effects)
 * Universal 256 Hardware Opcode VFX, Super-Power, Laser, Fire & Particle Shaders
 * Opcode: 0x00 - 0xFF (0 - 255)
 */

const VFX_CATEGORIES = {
    FIRE: '🔥 Fire & Inferno Flame',
    LASER: '⚡ Superman Laser & Electric Arc',
    PLASMA: '💥 Cosmic Plasma & Supernova',
    PORTAL: '🌌 Quantum Portal & Wormhole',
    FROST: '❄️ Cryo Frost & Ice Shards',
    MAGIC: '✨ Celestial Magic Dust & Glitter',
    CYBER: '🧪 Cyberpunk Neon & Matrix Glitch',
    SHIELD: '🛡️ Sonic Shockwave & Forcefield'
};

const SECTOR_CONFIGS = [
    {
        cat: VFX_CATEGORIES.FIRE,
        names: ['Inferno Fire', 'Phoenix Aura', 'Blue Hellfire', 'Ghostfire Flame', 'Volcanic Lava', 'Wildfire Embers', 'Solar Corona', 'Napalm Jet', 'Combustion Wave', 'Meteor Comet', 'Magma Fountain', 'Thermite Flash', 'Blackflame', 'Starlight Fusion', 'Spiral Vortex', 'Supernova Fire'],
        modes: ['fire_trail', 'fire_aura', 'fire_blue', 'fire_green', 'lava_burst', 'ember_spark', 'solar_flare', 'napalm', 'combustion', 'meteor', 'magma_fountain', 'thermite', 'blackflame', 'fusion', 'fire_spiral', 'supernova_fire'],
        c1List: ['#ff4500', '#ff2200', '#0066ff', '#00ff66', '#ff3700', '#ff7700', '#ffcc00', '#ff4400', '#ff5500', '#ff3300', '#ff2200', '#ffffff', '#9900ff', '#ffffff', '#ff3300', '#ff0055'],
        c2List: ['#ffd700', '#ffaa00', '#00ffff', '#ccff00', '#ff9900', '#ffee55', '#ffffff', '#ffbb33', '#ffff88', '#ffffaa', '#ffbb00', '#ff9900', '#ff0066', '#ffdd00', '#ff9933', '#ffffaa'],
        c3List: ['#8b0000', '#ff0055', '#000088', '#004411', '#4a0000', '#aa2200', '#ff3300', '#880000', '#991100', '#550000', '#550000', '#ff3300', '#0a0014', '#ff5500', '#770000', '#880022']
    },
    {
        cat: VFX_CATEGORIES.LASER,
        names: ['Superman Laser', 'Krypton Red Core', 'Thor Lightning Arc', 'Tesla Coil Arc', 'Cyberpunk Neon', 'Ionic Beam', 'Quantum Taser', 'Gamma Ray Slicer', 'Proton Accelerator', 'EMP Shock Arc', 'Darkside Lightning', 'Kyber Saber Beam', 'Violet Mace Arc', 'Antimatter Beam', 'Thunderstrike Bolt', 'Omega Sanction Beam'],
        modes: ['superman_laser', 'krypton_laser', 'lightning_arc', 'tesla_stream', 'neon_beam', 'ionic_beam', 'taser_spark', 'gamma_slicer', 'proton_beam', 'emp_arc', 'dark_lightning', 'kyber_beam', 'violet_arc', 'antimatter_line', 'thunder_bolt', 'omega_beam'],
        c1List: ['#ff0033', '#ff0055', '#00d4ff', '#bf00ff', '#00ffcc', '#39ff14', '#00f0ff', '#00ff44', '#ff00aa', '#0088ff', '#ff0022', '#0099ff', '#9d00ff', '#ff0066', '#ffff00', '#ff1100'],
        c2List: ['#ffffff', '#ffe6ea', '#ffffff', '#e699ff', '#ffffff', '#ffffff', '#ffff80', '#ffffff', '#ffffff', '#ffffff', '#ff9999', '#ffffff', '#ffffff', '#00ffff', '#ffffff', '#ffffff'],
        c3List: ['#ff8800', '#990022', '#0044ff', '#4b0082', '#006655', '#0d6b00', '#005577', '#004411', '#770044', '#001155', '#440000', '#002288', '#3a0066', '#1a0033', '#886600', '#550000']
    },
    {
        cat: VFX_CATEGORIES.PLASMA,
        names: ['Cosmic Supernova', 'Nebula Stardust', 'Dark Matter Void', 'Pulsar Star Frequency', 'Quasar Core Ray', 'Aurora Curtain', 'Galactic Halo', 'Celestial Comet', 'Solar Flare Corona', 'Plasma Torpedo', 'Magnetar Pulse', 'Hypernova Blast', 'Stellar Wind', 'Void Annihilator', 'Cosmic Ray Stream', 'Big Bang Singularity'],
        modes: ['cosmic_blast', 'nebula_swirl', 'dark_matter', 'pulsar_star', 'quasar_core', 'aurora_curtain', 'galactic_halo', 'comet_tail', 'solar_flare', 'plasma_cutter', 'hyperdense', 'supernova', 'solar_flare', 'antimatter_line', 'proton_beam', 'cosmic_blast'],
        c1List: ['#ec4899', '#a855f7', '#4c1d95', '#38bdf8', '#f59e0b', '#10b981', '#6366f1', '#00f2fe', '#f97316', '#06b6d4', '#8b5cf6', '#d946ef', '#14b8a6', '#4338ca', '#f43f5e', '#ffffff'],
        c2List: ['#8b5cf6', '#06b6d4', '#ec4899', '#f472b6', '#ef4444', '#06b6d4', '#f43f5e', '#4facfe', '#fbbf24', '#38bdf8', '#c084fc', '#fbcfe8', '#5eead4', '#a5b4fc', '#fda4af', '#facc15'],
        c3List: ['#3b82f6', '#f43f5e', '#020617', '#1e1b4b', '#6366f1', '#8b5cf6', '#0ea5e9', '#ffffff', '#7c2d12', '#083344', '#2e1065', '#701a75', '#134e4a', '#1e1b4b', '#881337', '#b45309']
    },
    {
        cat: VFX_CATEGORIES.PORTAL,
        names: ['Dr Strange Portal', 'Wormhole Spacetime', 'Event Horizon Void', 'Interdimensional Gateway', 'Hyperspace Conduit', 'Quantum String', 'Tesseract 4D Matrix', 'Cosmic Singularity Eye', 'Astral Projection', 'Chronos Time Rift', 'Void Gate', 'Bifrost Bridge', 'Eldritch Abyss', 'Subspace Tear', 'Multiverse Tunnel', 'Infinity Nexus'],
        modes: ['eldritch_portal', 'wormhole_rift', 'event_horizon', 'gateway_vortex', 'hyperspace', 'quantum_string', 'tesseract', 'singularity_eye', 'eldritch_portal', 'wormhole_rift', 'event_horizon', 'gateway_vortex', 'hyperspace', 'quantum_string', 'tesseract', 'singularity_eye'],
        c1List: ['#f59e0b', '#8b5cf6', '#d946ef', '#10b981', '#38bdf8', '#ec4899', '#06b6d4', '#f43f5e', '#eab308', '#6366f1', '#a855f7', '#3b82f6', '#059669', '#0284c7', '#db2777', '#f97316'],
        c2List: ['#fbbf24', '#06b6d4', '#0284c7', '#6366f1', '#ffffff', '#38bdf8', '#a855f7', '#fbbf24', '#fef08a', '#a5b4fc', '#e9d5ff', '#93c5fd', '#6ee7b7', '#7dd3fc', '#f472b6', '#fed7aa'],
        c3List: ['#78350f', '#1e1b4b', '#030712', '#064e3b', '#0c4a6e', '#581c87', '#083344', '#4c0519', '#713f12', '#1e1b4b', '#3b0764', '#172554', '#064e3b', '#0c4a6e', '#831843', '#7c2d12']
    },
    {
        cat: VFX_CATEGORIES.FROST,
        names: ['Absolute Zero Frost', 'Glacial Ice Shards', 'Blizzard Snow Whirl', 'Cryogenic Mist', 'Permafrost Shimmer', 'Icicle Spire Burst', 'Diamond Ice Sparkle', 'Avalanche Blast', 'Hailstorm Impact', 'Frostbite Aura', 'Polar Vortex', 'Iceberg Stalagmite', 'Glacier Needle', 'Arctic Wind', 'Cryo Freeze Ray', 'Crystalline Frost'],
        modes: ['frost_path', 'ice_shards', 'blizzard_swirl', 'cryo_mist', 'permafrost', 'icicle_spikes', 'diamond_ice', 'avalanche', 'ice_shards', 'frost_path', 'blizzard_swirl', 'icicle_spikes', 'diamond_ice', 'cryo_mist', 'frost_path', 'ice_shards'],
        c1List: ['#38bdf8', '#0284c7', '#bae6fd', '#7dd3fc', '#0ea5e9', '#38bdf8', '#67e8f9', '#e0f2fe', '#06b6d4', '#0284c7', '#38bdf8', '#7dd3fc', '#0ea5e9', '#67e8f9', '#bae6fd', '#38bdf8'],
        c2List: ['#e0f2fe', '#ffffff', '#ffffff', '#f0f9ff', '#e0f2fe', '#ffffff', '#ffffff', '#7dd3fc', '#cffafe', '#e0f2fe', '#ffffff', '#f0f9ff', '#ffffff', '#ffffff', '#f0f9ff', '#ffffff'],
        c3List: ['#0369a1', '#075985', '#0284c7', '#0c4a6e', '#0369a1', '#082f49', '#155e75', '#0284c7', '#164e63', '#075985', '#0369a1', '#0c4a6e', '#075985', '#155e75', '#0369a1', '#082f49']
    },
    {
        cat: VFX_CATEGORIES.MAGIC,
        names: ['Fairy Glitter Wand', 'Celestial Stardust', 'Ethereal Soul Wisp', 'Bokeh Orb Magic', 'Arcane Mystic Runes', 'Golden Sparkler', 'Pixie Dust Swarm', 'Divine Holy Aura', 'Seraphic Light', 'Witchcraft Violet Flame', 'Alchemical Gold Dust', 'Sacred Mandala', 'Enchanted Starlight', 'Spirit Dragon Wisp', 'Celestial Halo', 'Archangel Radiance'],
        modes: ['fairy_glitter', 'stardust_shimmer', 'soul_wisp', 'bokeh_orbs', 'arcane_runes', 'sparkler', 'pixie_dust', 'holy_aura', 'fairy_glitter', 'arcane_runes', 'sparkler', 'arcane_runes', 'stardust_shimmer', 'soul_wisp', 'holy_aura', 'fairy_glitter'],
        c1List: ['#fbbf24', '#f472b6', '#34d399', '#a78bfa', '#60a5fa', '#f59e0b', '#f43f5e', '#fef08a', '#eab308', '#a855f7', '#fbbf24', '#38bdf8', '#ec4899', '#10b981', '#f59e0b', '#ffffff'],
        c2List: ['#fef08a', '#fbcfe8', '#a7f3d0', '#ddd6fe', '#bfdbfe', '#ffffff', '#fecdd3', '#ffffff', '#fef9c3', '#e9d5ff', '#fef08a', '#bae6fd', '#fbcfe8', '#6ee7b7', '#fef08a', '#fde047'],
        c3List: ['#b45309', '#9d174d', '#065f46', '#5b21b6', '#1e40af', '#78350f', '#881337', '#d97706', '#713f12', '#581c87', '#b45309', '#0369a1', '#831843', '#064e3b', '#78350f', '#b45309']
    },
    {
        cat: VFX_CATEGORIES.CYBER,
        names: ['Cyberpunk Neon Wire', 'Matrix Digital Rain', 'RGB Glitch Wave', 'Hologram Scanlines', 'Synthwave 80s Grid', 'Biohazard Toxic Ooze', 'Circuit Data Pulse', 'Optical HUD Laser', 'Cyber Glitch Slicer', 'Quantum Bit Rain', 'Hacker Terminal Data', 'Nanotech Swarm', 'Laser Grid Array', 'Tron Cyan Lightcycle', 'Digital Glitch Ripple', 'Cyber Overdrive'],
        modes: ['neon_wire', 'matrix_rain', 'rgb_glitch', 'holo_scan', 'synthwave_grid', 'toxic_ooze', 'circuit_pulse', 'hud_grid', 'rgb_glitch', 'matrix_rain', 'matrix_rain', 'circuit_pulse', 'hud_grid', 'neon_wire', 'rgb_glitch', 'neon_wire'],
        c1List: ['#06b6d4', '#22c55e', '#ef4444', '#38bdf8', '#d946ef', '#84cc16', '#0ea5e9', '#ef4444', '#f43f5e', '#10b981', '#00ff66', '#06b6d4', '#ef4444', '#00f0ff', '#a855f7', '#3b82f6'],
        c2List: ['#ec4899', '#86efac', '#3b82f6', '#bae6fd', '#06b6d4', '#d9f99d', '#f59e0b', '#ffffff', '#38bdf8', '#6ee7b7', '#a7f3d0', '#38bdf8', '#fca5a5', '#ffffff', '#f472b6', '#60a5fa'],
        c3List: ['#0f172a', '#052e16', '#22c55e', '#075985', '#4a044e', '#365314', '#082f49', '#450a0a', '#1e1b4b', '#064e3b', '#022c22', '#083344', '#7f1d1d', '#003344', '#3b0764', '#172554']
    },
    {
        cat: VFX_CATEGORIES.SHIELD,
        names: ['Hex Titanium Shield', 'Sonic Shockwave', 'Gravity Distortion Bubble', 'Magnetic Flux Shield', 'Kinetic Barrier', 'Plasma Aegis Dome', 'Pulse Wave Detonation', 'Godmode Omnishield', 'Vibranium Deflector', 'Quantum Bubble', 'Plasma Barrier', 'Ion Deflection Grid', 'Photon Screen', 'Electromagnetic Ward', 'Chrono Stasis Field', 'Titan Supreme Shield'],
        modes: ['forcefield', 'shockwave', 'gravity_bubble', 'magnetic_shield', 'kinetic_barrier', 'plasma_aegis', 'pulse_wave', 'omnishield', 'forcefield', 'gravity_bubble', 'plasma_aegis', 'forcefield', 'magnetic_shield', 'shockwave', 'gravity_bubble', 'omnishield'],
        c1List: ['#06b6d4', '#f59e0b', '#8b5cf6', '#3b82f6', '#10b981', '#ec4899', '#ef4444', '#ffffff', '#14b8a6', '#a855f7', '#f43f5e', '#0284c7', '#eab308', '#6366f1', '#06b6d4', '#fbbf24'],
        c2List: ['#38bdf8', '#ffffff', '#d946ef', '#60a5fa', '#6ee7b7', '#f472b6', '#fbbf24', '#fbbf24', '#5eead4', '#e9d5ff', '#fda4af', '#38bdf8', '#fef08a', '#a5b4fc', '#38bdf8', '#ffffff'],
        c3List: ['#083344', '#78350f', '#1e1b4b', '#172554', '#064e3b', '#700736', '#450a0a', '#06b6d4', '#134e4a', '#3b0764', '#881337', '#075985', '#713f12', '#1e1b4b', '#083344', '#b45309']
    }
];

const EFFECTS_256 = [];

for (let i = 0; i < 256; i++) {
    const sectorIdx = Math.floor(i / 32); // 8 sectors (0 to 7), 32 opcodes each
    const sector = SECTOR_CONFIGS[sectorIdx] || SECTOR_CONFIGS[0];
    const subIdx = i % 16;
    const variant = Math.floor((i % 32) / 16); // 0 or 1 for variation

    const hex = i.toString(16).toUpperCase().padStart(2, '0');
    const baseName = sector.names[subIdx] || `VFX Shader ${i}`;
    const name = variant === 0 ? baseName : `${baseName} (Mk-${variant + 1})`;
    const mode = sector.modes[subIdx] || 'vfx_shader';
    const c1 = sector.c1List[subIdx] || '#06b6d4';
    const c2 = sector.c2List[subIdx] || '#ffffff';
    const c3 = sector.c3List[subIdx] || '#ff0055';

    EFFECTS_256.push({
        opcode: i,
        opcodeHex: hex,
        name: name,
        category: sector.cat,
        mode: mode,
        color1: c1,
        color2: c2,
        color3: c3,
        glow: 24 + (i % 20),
        particleCount: 30 + (i % 35),
        speed: 1.0 + (i % 12) * 0.15
    });
}

function getEffectFromOpcode(opcode) {
    const code = Math.max(0, Math.min(255, parseInt(opcode, 10) || 0));
    return EFFECTS_256[code] || EFFECTS_256[0];
}

module.exports = {
    EFFECTS_256,
    VFX_CATEGORIES,
    getEffectFromOpcode
};
