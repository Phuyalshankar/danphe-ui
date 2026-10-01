/**
 * Danphe UI - TitanTimelineRuler (Skeuomorphic Precision Millimeter & Beat Ruler)
 * Generates high-precision NLE timecode graduations with major ticks, minor mm tick marks,
 * and snap-ready musical beat markers (Beat 1, Beat 2, Drop, Bass transients).
 */

export function renderTimelineRuler(options = {}) {
    const {
        durationSeconds = 180,
        fps = 60,
        scale = 1.0,
        pixelsPerSecond = 20,
        beats = [
            { time: 10, label: 'Beat 1', color: '#facc15' },
            { time: 25, label: 'Beat 2', color: '#facc15' },
            { time: 45, label: 'Beat 3', color: '#facc15' },
            { time: 60, label: 'Drop 1', color: '#ef4444' },
            { time: 90, label: 'Chorus', color: '#38bdf8' },
            { time: 120, label: 'Bridge', color: '#a855f7' },
            { time: 150, label: 'Outro', color: '#4ade80' }
        ]
    } = options;

    const pps = pixelsPerSecond * scale;
    const totalWidth = Math.max(1400, durationSeconds * pps);
    
    let majorInterval = 10;
    if (scale >= 2.0) majorInterval = 5;
    if (scale >= 3.0) majorInterval = 2;
    if (scale <= 0.6) majorInterval = 30;

    let minorInterval = majorInterval / 5;

    let ticksHtml = '';

    for (let sec = 0; sec <= durationSeconds; sec += minorInterval) {
        const leftPos = sec * pps;
        const isMajor = Math.abs(sec % majorInterval) < 0.001;
        const isMedium = Math.abs(sec % (majorInterval / 2)) < 0.001;

        const mins = Math.floor(sec / 60).toString().padStart(2, '0');
        const secs = Math.floor(sec % 60).toString().padStart(2, '0');
        const frames = Math.floor((sec % 1) * fps).toString().padStart(2, '0');
        const timecodeStr = `00:${mins}:${secs}:${frames}`;

        if (isMajor) {
            ticksHtml += `
                <div class="ruler-tick major-tick" style="left: ${leftPos}px;">
                    <div class="tick-line major-line"></div>
                    <span class="tick-label">${timecodeStr}</span>
                </div>
            `;
        } else if (isMedium) {
            ticksHtml += `
                <div class="ruler-tick medium-tick" style="left: ${leftPos}px;">
                    <div class="tick-line medium-line"></div>
                </div>
            `;
        } else {
            ticksHtml += `
                <div class="ruler-tick minor-tick" style="left: ${leftPos}px;">
                    <div class="tick-line minor-line"></div>
                </div>
            `;
        }
    }

    let beatsHtml = '';
    beats.forEach(b => {
        const bLeft = b.time * pps;
        beatsHtml += `
            <div class="ruler-beat-pin" style="left: ${bLeft}px;" title="${b.label} at ${b.time}s">
                <div class="beat-flag" style="background: ${b.color};">
                    <span>${b.label}</span>
                </div>
                <div class="beat-vertical-guide" style="border-left-color: ${b.color};"></div>
            </div>
        `;
    });

    return `
        <div class="titan-timeline-ruler-canvas" style="width: ${totalWidth}px;">
            <div class="ruler-ticks-track">
                ${ticksHtml}
            </div>
            <div class="ruler-beats-overlay">
                ${beatsHtml}
            </div>
        </div>
    `;
}

export const TitanTimelineRulerStyles = `
.titan-timeline-ruler-canvas {
    height: 28px;
    background: linear-gradient(180deg, #090e1a 0%, #030712 100%);
    border-bottom: 1.5px solid #1e293b;
    position: relative;
    user-select: none;
    cursor: ew-resize;
    overflow: visible;
}
.ruler-ticks-track {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
}
.ruler-tick {
    position: absolute;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none;
}
.tick-line {
    width: 1px;
    background: rgba(255, 255, 255, 0.2);
}
.minor-line {
    height: 5px;
    background: rgba(148, 163, 184, 0.3);
}
.medium-line {
    height: 9px;
    background: rgba(148, 163, 184, 0.6);
    width: 1.2px;
}
.major-line {
    height: 16px;
    background: #38bdf8;
    box-shadow: 0 0 4px rgba(56, 189, 248, 0.8);
    width: 1.5px;
}
.tick-label {
    position: absolute;
    bottom: 11px;
    left: 4px;
    font-family: monospace;
    font-size: 9px;
    font-weight: 700;
    color: #94a3b8;
    letter-spacing: 0.5px;
    white-space: nowrap;
}
.ruler-beats-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    pointer-events: none;
}
.ruler-beat-pin {
    position: absolute;
    top: 1px;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 5;
}
.beat-flag {
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 8px;
    font-weight: 800;
    color: #000;
    display: flex;
    align-items: center;
    gap: 2px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.8);
    pointer-events: auto;
    cursor: pointer;
    transition: transform 0.1s;
}
.beat-flag:hover {
    transform: scale(1.15);
}
.beat-vertical-guide {
    position: absolute;
    top: 24px;
    width: 1px;
    height: 280px;
    border-left: 1px dashed;
    opacity: 0.25;
    pointer-events: none;
}
`;
