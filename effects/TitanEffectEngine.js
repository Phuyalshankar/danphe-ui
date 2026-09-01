'use strict';

/**
 * 🐬 TitanEffectEngine (danphe-ui/effects)
 * 16+ Modular 120 FPS Cinematic VFX Shaders
 * Real procedural fire, blue hellfire, ghostfire, lightning forks, tesla coils,
 * dendritic ice crystals, Doctor Strange mandalas, matrix code, and forcefields!
 */

const { EFFECTS_256, VFX_CATEGORIES } = require('./EFFECTS_256');

function getEffectFromOpcode(opcode) {
    const code = Math.max(0, Math.min(255, parseInt(opcode, 10) || 0));
    return EFFECTS_256[code] || EFFECTS_256[0];
}

/**
 * 🎨 120 FPS Cinematic VFX Trajectory Renderer
 */
function renderVfxStrokeOnCanvas(ctx, points, effect, timeSec, options = {}) {
    if (!ctx || !points || points.length < 2) return;

    const {
        strokeWidth = 16,
        intensity = 1.0,
        turbulence = 1.0
    } = options;

    const c1 = effect.color1 || '#ff0033';
    const c2 = effect.color2 || '#ffffff';
    const c3 = effect.color3 || '#ff8800';
    const mode = (effect.mode || '').toLowerCase();
    const t = (timeSec || 0) * (effect.speed || 1.4) * turbulence;
    const totalPts = points.length;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    if (mode === 'fire_blue' || mode.includes('blue_hellfire')) {
        // 🔷 1. BLUE HELLFIRE FLAME (Cyan/Azure Plasma Flames)
        renderProceduralFire(ctx, points, '#0066ff', '#00ffff', '#ffffff', t, strokeWidth, intensity, turbulence);

    } else if (mode === 'fire_green' || mode.includes('ghostfire') || mode.includes('sulfur')) {
        // 🟢 2. GHOSTFIRE EMERALD FLAME (Green Ectoplasm)
        renderProceduralFire(ctx, points, '#00ff66', '#ccff00', '#ffffff', t, strokeWidth, intensity, turbulence);

    } else if (mode.includes('lava') || mode.includes('magma') || mode.includes('molten')) {
        // 🌋 3. VOLCANIC LAVA & MOLTEN DRIPPING GLOBULES
        renderVolcanicLava(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence);

    } else if (mode.includes('fire') || mode.includes('flame') || mode.includes('inferno') || mode.includes('blaze') || mode.includes('ember')) {
        // 🔥 4. CLASSIC INFERNO FIRE & FLAME TONGUES
        renderProceduralFire(ctx, points, c1, c3, c2, t, strokeWidth, intensity, turbulence);

    } else if (mode.includes('lightning') || mode.includes('thunder') || mode.includes('taser') || mode.includes('gigavolt') || mode.includes('dark_lightning')) {
        // ⚡ 5. THOR FRACTAL BRANCHING LIGHTNING FORKS
        renderBranchingLightning(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence);

    } else if (mode.includes('tesla') || mode.includes('ionic') || mode.includes('synchrotron')) {
        // 🌀 6. TESLA COIL HARMONIC SINE WAVE ARCS
        renderTeslaCoil(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence);

    } else if (mode.includes('laser') || mode.includes('beam') || mode.includes('slicer') || mode.includes('superman') || mode.includes('kyber') || mode.includes('orbital') || mode.includes('atomic')) {
        // 🔴 7. BLINDING SUPERMAN HEAT VISION CORE LASER
        renderSupermanLaser(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence);

    } else if (mode.includes('shard') || mode.includes('spike') || mode.includes('glacier')) {
        // 🧊 8. JAGGED CRYO ICE SHARDS & STALAGMITES
        renderJaggedIceShards(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence);

    } else if (mode.includes('frost') || mode.includes('ice') || mode.includes('snow') || mode.includes('zero') || mode.includes('blizzard')) {
        // ❄️ 9. DENDRITIC SNOWFLAKE CRYSTAL BLOOMS
        renderSnowflakeBlooms(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence);

    } else if (mode.includes('portal') || mode.includes('wormhole') || mode.includes('eldritch') || mode.includes('gateway')) {
        // 🌌 10. DOCTOR STRANGE SPARKLING PORTAL & ACCRETION DISK
        renderDoctorStrangePortal(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence);

    } else if (mode.includes('magic') || mode.includes('rune') || mode.includes('sorcery') || mode.includes('mandala')) {
        // ☸️ 11. SACRED GEOMETRY MYSTIC RUNES & CIRCLES
        renderMysticRunes(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence);

    } else if (mode.includes('glitter') || mode.includes('fairy') || mode.includes('stardust') || mode.includes('star')) {
        // ✨ 12. SHIMMERING FAIRY DUST & 4-POINT STARS
        renderFairyStardust(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence);

    } else if (mode.includes('matrix') || mode.includes('rain')) {
        // 🟩 13. MATRIX BINARY RAIN & FALLING CODE
        renderMatrixRain(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence);

    } else if (mode.includes('cyber') || mode.includes('neon') || mode.includes('glitch') || mode.includes('wire')) {
        // 🧪 14. CYBERPUNK NEON GLITCH & RGB SPLIT
        renderCyberNeonGlitch(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence);

    } else if (mode.includes('shield') || mode.includes('forcefield') || mode.includes('barrier')) {
        // 🛡️ 15. HONEYCOMB HEXAGONAL FORCEFIELD
        renderHexForcefield(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence);

    } else {
        // 💥 16. VOLUMETRIC SUPERNOVA & COSMIC PLASMA BLAST
        renderCosmicSupernova(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence);
    }

    ctx.restore();
}

// ── 1. PROCEDURAL FLAME TONGUES & RISING EMBERS ──
function renderProceduralFire(ctx, points, baseCol, midCol, coreCol, t, strokeWidth, intensity, turbulence) {
    const total = points.length;
    const step = Math.max(1, Math.floor(total / 16));

    // Flame Tongues
    for (let i = 0; i < total; i += Math.max(1, Math.floor(step / 2))) {
        const p = points[i];
        for (let k = 0; k < 3; k++) {
            const seed = i * 7 + k * 19;
            const fH = (28 + (Math.sin(t * 12 + seed) * 0.5 + 0.5) * 45) * intensity;
            const fW = (7 + (k % 2) * 6) * intensity;
            const sway = Math.sin(t * 9 + seed) * 16 * turbulence;

            const tip = { x: p.x + sway, y: p.y - fH };
            const grad = ctx.createLinearGradient(p.x, p.y, tip.x, tip.y);
            grad.addColorStop(0, coreCol);
            grad.addColorStop(0.35, midCol);
            grad.addColorStop(0.75, baseCol);
            grad.addColorStop(1, 'transparent');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(p.x - fW * 0.5, p.y);
            ctx.quadraticCurveTo(p.x - fW * 1.2 + sway * 0.4, p.y - fH * 0.5, tip.x, tip.y);
            ctx.quadraticCurveTo(p.x + fW * 1.2 + sway * 0.4, p.y - fH * 0.5, p.x + fW * 0.5, p.y);
            ctx.closePath();
            ctx.fill();
        }
    }

    // Embers
    for (let i = 0; i < total; i += step) {
        const p = points[i];
        for (let e = 0; e < 3; e++) {
            const seed = i * 11 + e * 23;
            const life = (t * 45 + seed) % 60;
            const prog = life / 60;
            const ex = p.x + Math.sin(t * 8 + e + i) * 20 * turbulence;
            const ey = p.y - prog * 70 * intensity;
            const r = Math.max(0.8, (1 - prog) * 4.5 * intensity);

            ctx.fillStyle = prog < 0.3 ? coreCol : (prog < 0.7 ? midCol : baseCol);
            ctx.beginPath();
            ctx.arc(ex, ey, r, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// ── 2. VOLCANIC LAVA & DRIPPING MOLTEN GLOBULES ──
function renderVolcanicLava(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence) {
    const total = points.length;
    const step = Math.max(1, Math.floor(total / 12));

    for (let i = 0; i < total; i += step) {
        const p = points[i];
        const blobR = (12 + Math.sin(t * 5 + i) * 5) * intensity;

        // Molten Core
        const lavaGrad = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, blobR);
        lavaGrad.addColorStop(0, '#ffffff');
        lavaGrad.addColorStop(0.3, c2);
        lavaGrad.addColorStop(0.7, c1);
        lavaGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = lavaGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, blobR, 0, Math.PI * 2);
        ctx.fill();

        // Dripping Lava Drops
        const dropY = p.y + ((t * 35 + i * 15) % 40);
        const dropR = Math.max(1.5, 4 * intensity);
        ctx.fillStyle = c1;
        ctx.beginPath();
        ctx.arc(p.x + Math.sin(i) * 6, dropY, dropR, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ── 3. THOR BRANCHING LIGHTNING FORKS ──
function renderBranchingLightning(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence) {
    const total = points.length;

    // Main Jitter Arc
    ctx.shadowBlur = 25 * intensity;
    ctx.shadowColor = c1;
    ctx.strokeStyle = c2;
    ctx.lineWidth = Math.max(2.5, strokeWidth * 0.4);
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < total; i++) {
        const jitter = (Math.sin(t * 25 + i * 4) - 0.5) * 8 * turbulence;
        ctx.lineTo(points[i].x + jitter, points[i].y - jitter);
    }
    ctx.stroke();

    // Branching Forks
    const step = Math.max(1, Math.floor(total / 10));
    ctx.strokeStyle = c3;
    ctx.lineWidth = 1.6 * intensity;

    for (let i = 0; i < total; i += step) {
        const p = points[i];
        for (let f = 0; f < 2; f++) {
            const seed = i * 13 + f * 31;
            const angle = (Math.sin(t * 15 + seed) * Math.PI) + (f === 0 ? 1 : -1) * (Math.PI / 2);
            const branchLen = (20 + Math.sin(t * 20 + seed) * 16) * intensity;

            let curX = p.x;
            let curY = p.y;
            ctx.beginPath();
            ctx.moveTo(curX, curY);

            for (let s = 1; s <= 4; s++) {
                const segLen = branchLen / 4;
                const jitter = (Math.sin(t * 30 + seed + s) - 0.5) * 12 * turbulence;
                curX += Math.cos(angle) * segLen + Math.sin(angle) * jitter;
                curY += Math.sin(angle) * segLen + Math.cos(angle) * jitter;
                ctx.lineTo(curX, curY);
            }
            ctx.stroke();
        }
    }
}

// ── 4. TESLA COIL SINE WAVE ARCS ──
function renderTeslaCoil(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence) {
    const total = points.length;
    ctx.shadowBlur = 20 * intensity;
    ctx.shadowColor = c1;

    for (let wave = 0; wave < 3; wave++) {
        ctx.strokeStyle = wave === 0 ? c2 : (wave === 1 ? c1 : c3);
        ctx.lineWidth = (2.5 - wave * 0.6) * intensity;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < total; i++) {
            const phase = t * 10 + i * 0.4 + (wave * Math.PI / 1.5);
            const perpDist = Math.sin(phase) * (14 + wave * 6) * turbulence;
            ctx.lineTo(points[i].x + perpDist, points[i].y - perpDist * 0.5);
        }
        ctx.stroke();
    }
}

// ── 5. SUPERMAN HEAT VISION CORE LASER ──
function renderSupermanLaser(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence) {
    // Outer Heat Flare
    ctx.shadowBlur = 40 * intensity;
    ctx.shadowColor = c1;
    ctx.strokeStyle = c1;
    ctx.lineWidth = strokeWidth * 2.4;
    ctx.globalAlpha = 0.45 * intensity;
    drawSmoothPath(ctx, points);

    // Inner Laser Core
    ctx.shadowBlur = 10 * intensity;
    ctx.shadowColor = '#ffffff';
    ctx.strokeStyle = c2;
    ctx.lineWidth = Math.max(3, strokeWidth * 0.45);
    ctx.globalAlpha = 1.0;
    drawSmoothPath(ctx, points);

    // Scorching Spark Specks
    const total = points.length;
    const step = Math.max(1, Math.floor(total / 8));
    for (let i = 0; i < total; i += step) {
        const p = points[i];
        for (let s = 0; s < 3; s++) {
            const ang = (t * 7 + i + s * 2) % (Math.PI * 2);
            const dst = (6 + Math.sin(t * 8 + s) * 12) * intensity;
            ctx.fillStyle = s % 2 === 0 ? c1 : c2;
            ctx.beginPath();
            ctx.arc(p.x + Math.cos(ang) * dst, p.y + Math.sin(ang) * dst, 2.5 * intensity, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// ── 6. JAGGED CRYO ICE SHARDS ──
function renderJaggedIceShards(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence) {
    const total = points.length;
    const step = Math.max(1, Math.floor(total / 10));

    for (let i = 0; i < total; i += step) {
        const p = points[i];
        const shardLen = (18 + Math.sin(t * 4 + i) * 8) * intensity;
        const shardW = (6 + Math.sin(i) * 3) * intensity;

        ctx.fillStyle = 'rgba(224, 242, 254, 0.85)';
        ctx.strokeStyle = c1;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 15 * intensity;
        ctx.shadowColor = c1;

        // Diamond Shard Polygon
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - shardLen);
        ctx.lineTo(p.x + shardW, p.y);
        ctx.lineTo(p.x, p.y + shardLen * 0.4);
        ctx.lineTo(p.x - shardW, p.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}

// ── 7. DENDRITIC SNOWFLAKE CRYSTAL BLOOMS ──
function renderSnowflakeBlooms(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence) {
    const total = points.length;
    const step = Math.max(1, Math.floor(total / 10));

    for (let i = 0; i < total; i += step) {
        const p = points[i];
        const crystalLen = (15 + Math.sin(t * 3 + i) * 6) * intensity;

        ctx.strokeStyle = c2;
        ctx.lineWidth = 1.6;
        ctx.shadowBlur = 12 * intensity;
        ctx.shadowColor = '#ffffff';

        for (let a = 0; a < 6; a++) {
            const rot = (a * Math.PI / 3) + Math.sin(t * 2 + i) * 0.15;
            const endX = p.x + Math.cos(rot) * crystalLen;
            const endY = p.y + Math.sin(rot) * crystalLen;

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            const subLen = crystalLen * 0.45;
            const midX = p.x + Math.cos(rot) * (crystalLen * 0.6);
            const midY = p.y + Math.sin(rot) * (crystalLen * 0.6);
            ctx.beginPath();
            ctx.moveTo(midX, midY);
            ctx.lineTo(midX + Math.cos(rot + Math.PI / 4) * subLen, midY + Math.sin(rot + Math.PI / 4) * subLen);
            ctx.moveTo(midX, midY);
            ctx.lineTo(midX + Math.cos(rot - Math.PI / 4) * subLen, midY + Math.sin(rot - Math.PI / 4) * subLen);
            ctx.stroke();
        }
    }
}

// ── 8. DOCTOR STRANGE SPARKLING PORTAL ──
function renderDoctorStrangePortal(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence) {
    const total = points.length;
    const step = Math.max(1, Math.floor(total / 8));

    for (let i = 0; i < total; i += step) {
        const p = points[i];
        const portalR = (20 + Math.sin(t * 5 + i) * 6) * intensity;

        ctx.strokeStyle = c1;
        ctx.lineWidth = 2.2;
        ctx.shadowBlur = 20 * intensity;
        ctx.shadowColor = c2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, portalR, 0, Math.PI * 2);
        ctx.stroke();

        // Tangential Sparks
        for (let s = 0; s < 6; s++) {
            const ang = t * 6 + (s * Math.PI / 3);
            const sx = p.x + Math.cos(ang) * portalR;
            const sy = p.y + Math.sin(ang) * portalR;
            const tx = sx - Math.sin(ang) * 12 * intensity;
            const ty = sy + Math.cos(ang) * 12 * intensity;

            ctx.strokeStyle = c2;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(tx, ty);
            ctx.stroke();
        }
    }
}

// ── 9. SACRED GEOMETRY MYSTIC RUNES ──
function renderMysticRunes(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence) {
    const total = points.length;
    const step = Math.max(1, Math.floor(total / 8));

    for (let i = 0; i < total; i += step) {
        const p = points[i];
        const runeR = (18 + Math.sin(t * 4 + i) * 6) * intensity;
        const spin = t * 2 + i;

        ctx.strokeStyle = c2;
        ctx.lineWidth = 1.6;
        ctx.shadowBlur = 15 * intensity;
        ctx.shadowColor = c1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, runeR, 0, Math.PI * 2);
        ctx.stroke();

        // Inscribed Triangle
        ctx.beginPath();
        for (let g = 0; g < 3; g++) {
            const ang = spin + (g * Math.PI * 2 / 3);
            const gx = p.x + Math.cos(ang) * (runeR * 0.85);
            const gy = p.y + Math.sin(ang) * (runeR * 0.85);
            if (g === 0) ctx.moveTo(gx, gy);
            else ctx.lineTo(gx, gy);
        }
        ctx.closePath();
        ctx.stroke();
    }
}

// ── 10. FAIRY STARDUST & 4-POINT STARS ──
function renderFairyStardust(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence) {
    const total = points.length;
    const step = Math.max(1, Math.floor(total / 6));

    for (let i = 0; i < total; i += step) {
        const p = points[i];
        const pulse = Math.sin(t * 8 + i * 2) * 0.5 + 0.5;
        const starSize = (4 + pulse * 7) * intensity;

        ctx.fillStyle = c2;
        ctx.shadowBlur = 15 * intensity;
        ctx.shadowColor = c1;

        // 4-Point Diamond Star
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - starSize);
        ctx.quadraticCurveTo(p.x, p.y, p.x + starSize, p.y);
        ctx.quadraticCurveTo(p.x, p.y, p.x, p.y + starSize);
        ctx.quadraticCurveTo(p.x, p.y, p.x - starSize, p.y);
        ctx.quadraticCurveTo(p.x, p.y, p.x, p.y - starSize);
        ctx.closePath();
        ctx.fill();
    }
}

// ── 11. MATRIX BINARY RAIN & FALLING CODE ──
function renderMatrixRain(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence) {
    const total = points.length;
    const step = Math.max(1, Math.floor(total / 10));

    for (let i = 0; i < total; i += step) {
        const p = points[i];
        for (let d = 0; d < 3; d++) {
            const dropLife = (t * 60 + i * 20 + d * 30) % 50;
            const dy = p.y + dropLife;
            const dx = p.x + (d - 1) * 9;

            ctx.fillStyle = dropLife < 10 ? '#ffffff' : '#00ff66';
            ctx.shadowBlur = 10 * intensity;
            ctx.shadowColor = '#00ff66';
            ctx.fillRect(dx, dy, 3.5 * intensity, 8 * intensity);
        }
    }
}

// ── 12. CYBERPUNK NEON GLITCH ──
function renderCyberNeonGlitch(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence) {
    ctx.shadowBlur = 20 * intensity;
    ctx.shadowColor = c1;
    ctx.strokeStyle = c1;
    ctx.lineWidth = strokeWidth * 1.6;
    drawSmoothPath(ctx, points);

    // RGB Split Offset Ribbon
    ctx.strokeStyle = c3;
    ctx.lineWidth = Math.max(2, strokeWidth * 0.4);
    ctx.beginPath();
    ctx.moveTo(points[0].x + 4, points[0].y - 2);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x + 4, points[i].y - 2);
    }
    ctx.stroke();
}

// ── 13. HONEYCOMB HEXAGONAL FORCEFIELD ──
function renderHexForcefield(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence) {
    const total = points.length;
    const step = Math.max(1, Math.floor(total / 8));

    for (let i = 0; i < total; i += step) {
        const p = points[i];
        const hexR = (20 + Math.sin(t * 6 + i) * 6) * intensity;

        ctx.strokeStyle = c1;
        ctx.lineWidth = 1.8;
        ctx.shadowBlur = 20 * intensity;
        ctx.shadowColor = c3;

        ctx.beginPath();
        for (let h = 0; h < 6; h++) {
            const ang = (h * Math.PI / 3) + (Math.PI / 6);
            const hx = p.x + Math.cos(ang) * hexR;
            const hy = p.y + Math.sin(ang) * hexR;
            if (h === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.stroke();
    }
}

// ── 14. COSMIC SUPERNOVA & VOLUMETRIC PLASMA BLAST ──
function renderCosmicSupernova(ctx, points, c1, c2, c3, t, strokeWidth, intensity, turbulence) {
    const total = points.length;
    const step = Math.max(1, Math.floor(total / 8));

    for (let i = 0; i < total; i += step) {
        const p = points[i];
        const plasmaR = (18 + Math.sin(t * 8 + i) * 8) * intensity;

        const plasmaGrad = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, plasmaR);
        plasmaGrad.addColorStop(0, '#ffffff');
        plasmaGrad.addColorStop(0.35, c2);
        plasmaGrad.addColorStop(0.7, c1);
        plasmaGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = plasmaGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, plasmaR, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = c3;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, plasmaR * 1.4, plasmaR * 0.5, t * 3 + i, 0, Math.PI * 2);
        ctx.stroke();
    }
}

function drawSmoothPath(ctx, points) {
    if (!points || points.length === 0) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
}

module.exports = {
    EFFECTS_256,
    VFX_CATEGORIES,
    getEffectFromOpcode,
    renderVfxStrokeOnCanvas
};
