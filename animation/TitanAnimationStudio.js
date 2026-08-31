'use strict';

/**
 * 🎬 TitanAnimationStudio — Pro 3-Phase Motion & Transition Suite
 * Component of @danphe/ui/animation
 * ═════════════════════════════════════════════════════════════════════════════
 * • Phase 1: IN ANIMATION (Entrance Transitions & Presets)
 * • Phase 2: OVERALL ANIMATION (Continuous Floating, Pulse & Spin FX)
 * • Phase 3: OUT ANIMATION (Exit Transitions & Disappearances)
 * • 100% Pure 16-Bit Memory Mapped Titan Registers (0x4500 - 0x4530)
 */

function renderTitanAnimationStudio(options = {}) {
    const rootId = options.id || 'studio-anim-suite';

    return `
<div id="${rootId}" class="titan-anim-root font-mono select-none" data-active-tab="in">
    <style id="titan-anim-studio-css">
    /* ═══════ Titan Animation Studio Styles ═══════ */
    .titan-anim-root {
        background: radial-gradient(circle at 50% 0%, #151c28 0%, #080c14 100%);
        border: 1.5px solid #1e2d42;
        border-radius: 14px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(56,189,248,0.2);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 10px;
        margin-bottom: 8px;
    }
    .titan-anim-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #1a2638;
        padding-bottom: 6px;
    }
    .titan-anim-title {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #38bdf8;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.08em;
    }
    .titan-anim-chip {
        font-size: 8.5px;
        background: #0b1f38;
        color: #7dd3fc;
        border: 1px solid #0284c7;
        padding: 1px 6px;
        border-radius: 4px;
        font-weight: 800;
    }

    /* 3-Tab Bar: IN / OVERALL / OUT */
    .anim-tab-bar {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 4px;
        background: #05080e;
        padding: 3px;
        border-radius: 8px;
        border: 1px solid #141f30;
    }
    .anim-tab-btn {
        background: transparent;
        border: none;
        color: #64748b;
        padding: 5px 2px;
        font-size: 9.5px;
        font-weight: 800;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.15s;
        text-align: center;
    }
    .anim-tab-btn:hover { color: #cbd5e1; background: #0c1424; }
    .anim-tab-btn.active {
        background: #0284c7;
        color: #ffffff;
        box-shadow: 0 0 10px rgba(2,132,199,0.5);
    }
    .anim-tab-btn.tab-overall.active {
        background: #8b5cf6;
        box-shadow: 0 0 10px rgba(139,92,246,0.5);
    }
    .anim-tab-btn.tab-out.active {
        background: #e11d48;
        box-shadow: 0 0 10px rgba(225,29,72,0.5);
    }

    /* Preset Grids */
    .anim-preset-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 5px;
        margin-top: 4px;
    }
    .anim-card-btn {
        background: #0c121e;
        border: 1px solid #1a2638;
        border-radius: 7px;
        padding: 7px 4px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        transition: all 0.15s;
        color: #94a3b8;
    }
    .anim-card-btn:hover {
        border-color: #38bdf8;
        background: #111c30;
        color: #fff;
    }
    .anim-card-btn.active {
        border-color: #38bdf8;
        background: rgba(2,132,199,0.2);
        color: #38bdf8;
        box-shadow: 0 0 8px rgba(56,189,248,0.3);
    }
    .anim-card-ico {
        font-size: 14px;
    }
    .anim-card-title {
        font-size: 8.5px;
        font-weight: 800;
        text-align: center;
        white-space: nowrap;
    }

    /* Duration & Easing Sliders */
    .anim-prop-box {
        background: #090e18;
        border: 1px solid #162234;
        border-radius: 8px;
        padding: 6px 8px;
        display: flex;
        flex-direction: column;
        gap: 3px;
        margin-top: 4px;
    }
    </style>

    <!-- Header -->
    <div class="titan-anim-header">
        <div class="titan-anim-title">
            <span>🎬 MOTION & TRANSITIONS</span>
        </div>
        <div class="flex items-center gap-1.5">
            <span class="titan-anim-chip">0x4500 REG</span>
            <button type="button" class="btn-reset" onclick="window.titanAnimResetActiveLayer('${rootId}')">Reset</button>
        </div>
    </div>

    <!-- 3 Tabs: IN / OVERALL / OUT -->
    <div class="anim-tab-bar">
        <button type="button" class="anim-tab-btn active" id="${rootId}-tab-in" onclick="window.titanAnimSwitchTab('${rootId}', 'in')">1. IN (ENTRANCE)</button>
        <button type="button" class="anim-tab-btn tab-overall" id="${rootId}-tab-overall" onclick="window.titanAnimSwitchTab('${rootId}', 'overall')">2. OVERALL (LOOP)</button>
        <button type="button" class="anim-tab-btn tab-out" id="${rootId}-tab-out" onclick="window.titanAnimSwitchTab('${rootId}', 'out')">3. OUT (EXIT)</button>
    </div>

    <!-- PAGE 1: IN ANIMATIONS -->
    <div class="anim-page-view" id="${rootId}-page-in">
        <div class="anim-preset-grid">
            <button type="button" class="anim-card-btn active" id="${rootId}-in-none" onclick="window.titanAnimSetIn('${rootId}', 'none')">
                <span class="anim-card-ico">🚫</span>
                <span class="anim-card-title">None</span>
            </button>
            <button type="button" class="anim-card-btn" id="${rootId}-in-fade" onclick="window.titanAnimSetIn('${rootId}', 'fade_in')">
                <span class="anim-card-ico">✨</span>
                <span class="anim-card-title">Fade In</span>
            </button>
            <button type="button" class="anim-card-btn" id="${rootId}-in-slide-up" onclick="window.titanAnimSetIn('${rootId}', 'slide_up')">
                <span class="anim-card-ico">⬆️</span>
                <span class="anim-card-title">Slide Up</span>
            </button>
            <button type="button" class="anim-card-btn" id="${rootId}-in-slide-left" onclick="window.titanAnimSetIn('${rootId}', 'slide_left')">
                <span class="anim-card-ico">⬅️</span>
                <span class="anim-card-title">Slide Left</span>
            </button>
            <button type="button" class="anim-card-btn" id="${rootId}-in-zoom-pop" onclick="window.titanAnimSetIn('${rootId}', 'zoom_pop')">
                <span class="anim-card-ico">💥</span>
                <span class="anim-card-title">Zoom Pop</span>
            </button>
            <button type="button" class="anim-card-btn" id="${rootId}-in-spin-360" onclick="window.titanAnimSetIn('${rootId}', 'spin_360')">
                <span class="anim-card-ico">🌀</span>
                <span class="anim-card-title">Spin 360</span>
            </button>
            <button type="button" class="anim-card-btn" id="${rootId}-in-bounce" onclick="window.titanAnimSetIn('${rootId}', 'bounce_in')">
                <span class="anim-card-ico">🏀</span>
                <span class="anim-card-title">Bounce In</span>
            </button>
            <button type="button" class="anim-card-btn" id="${rootId}-in-flip-3d" onclick="window.titanAnimSetIn('${rootId}', 'flip_3d')">
                <span class="anim-card-ico">🃏</span>
                <span class="anim-card-title">3D Flip</span>
            </button>
            <button type="button" class="anim-card-btn" id="${rootId}-in-wipe-rt" onclick="window.titanAnimSetIn('${rootId}', 'wipe_right')">
                <span class="anim-card-ico">🎬</span>
                <span class="anim-card-title">Cinema Wipe</span>
            </button>
        </div>

        <div class="anim-prop-box">
            <div class="flex justify-between text-[9.5px] font-bold text-slate-300">
                <span>IN DURATION (0x4501)</span>
                <span id="${rootId}-in-dur-val" class="text-cyan-400">0.8 s</span>
            </div>
            <input type="range" min="1" max="40" value="8" class="zoom-slider w-full" oninput="window.titanAnimSetInDur('${rootId}', this.value)" />
        </div>
    </div>

    <!-- PAGE 2: OVERALL ANIMATIONS -->
    <div class="anim-page-view" id="${rootId}-page-overall" style="display:none;">
        <div class="anim-preset-grid">
            <button type="button" class="anim-card-btn active" id="${rootId}-ov-none" onclick="window.titanAnimSetOverall('${rootId}', 'none')">
                <span class="anim-card-ico">🚫</span>
                <span class="anim-card-title">None</span>
            </button>
            <button type="button" class="anim-card-btn" id="${rootId}-ov-float" onclick="window.titanAnimSetOverall('${rootId}', 'float_drift')">
                <span class="anim-card-ico">🌊</span>
                <span class="anim-card-title">Float Drift</span>
            </button>
            <button type="button" class="anim-card-btn" id="${rootId}-ov-pulse" onclick="window.titanAnimSetOverall('${rootId}', 'pulse_heart')">
                <span class="anim-card-ico">💓</span>
                <span class="anim-card-title">Pulse Beat</span>
            </button>
            <button type="button" class="anim-card-btn" id="${rootId}-ov-spin-slow" onclick="window.titanAnimSetOverall('${rootId}', 'spin_loop')">
                <span class="anim-card-ico">🌍</span>
                <span class="anim-card-title">Slow Spin</span>
            </button>
            <button type="button" class="anim-card-btn" id="${rootId}-ov-wiggle" onclick="window.titanAnimSetOverall('${rootId}', 'wiggle_shake')">
                <span class="anim-card-ico">⚡</span>
                <span class="anim-card-title">Wiggle Jitter</span>
            </button>
            <button type="button" class="anim-card-btn" id="${rootId}-ov-breathe" onclick="window.titanAnimSetOverall('${rootId}', 'glow_breathe')">
                <span class="anim-card-ico">💡</span>
                <span class="anim-card-title">Glow Breathe</span>
            </button>
        </div>

        <div class="anim-prop-box">
            <div class="flex justify-between text-[9.5px] font-bold text-purple-300">
                <span>LOOP SPEED (0x4511)</span>
                <span id="${rootId}-ov-spd-val" class="text-purple-400">1.0 x</span>
            </div>
            <input type="range" min="2" max="30" value="10" class="zoom-slider w-full" oninput="window.titanAnimSetOverallSpeed('${rootId}', this.value)" />
        </div>
    </div>

    <!-- PAGE 3: OUT ANIMATIONS -->
    <div class="anim-page-view" id="${rootId}-page-out" style="display:none;">
        <div class="anim-preset-grid">
            <button type="button" class="anim-card-btn active" id="${rootId}-out-none" onclick="window.titanAnimSetOut('${rootId}', 'none')">
                <span class="anim-card-ico">🚫</span>
                <span class="anim-card-title">None</span>
            </button>
            <button type="button" class="anim-card-btn" id="${rootId}-out-fade" onclick="window.titanAnimSetOut('${rootId}', 'fade_out')">
                <span class="anim-card-ico">🌫️</span>
                <span class="anim-card-title">Fade Out</span>
            </button>
            <button type="button" class="anim-card-btn" id="${rootId}-out-slide-down" onclick="window.titanAnimSetOut('${rootId}', 'slide_down')">
                <span class="anim-card-ico">⬇️</span>
                <span class="anim-card-title">Slide Down</span>
            </button>
            <button type="button" class="anim-card-btn" id="${rootId}-out-slide-right" onclick="window.titanAnimSetOut('${rootId}', 'slide_right')">
                <span class="anim-card-ico">➡️</span>
                <span class="anim-card-title">Slide Right</span>
            </button>
            <button type="button" class="anim-card-btn" id="${rootId}-out-zoom-shrink" onclick="window.titanAnimSetOut('${rootId}', 'zoom_shrink')">
                <span class="anim-card-ico">🕳️</span>
                <span class="anim-card-title">Zoom Shrink</span>
            </button>
            <button type="button" class="anim-card-btn" id="${rootId}-out-spin-out" onclick="window.titanAnimSetOut('${rootId}', 'spin_out')">
                <span class="anim-card-ico">💫</span>
                <span class="anim-card-title">Spin Out</span>
            </button>
        </div>

        <div class="anim-prop-box">
            <div class="flex justify-between text-[9.5px] font-bold text-rose-300">
                <span>OUT DURATION (0x4521)</span>
                <span id="${rootId}-out-dur-val" class="text-rose-400">0.8 s</span>
            </div>
            <input type="range" min="1" max="40" value="8" class="zoom-slider w-full" oninput="window.titanAnimSetOutDur('${rootId}', this.value)" />
        </div>
    </div>
</div>
`;
}

module.exports = {
    renderTitanAnimationStudio
};
