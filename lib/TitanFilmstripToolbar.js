'use strict';

/**
 * 🐬 TitanFilmstripToolbar (danphe-ui/lib)
 * STUDIO MASTER PRECISION DECK (3-GROUP COMPACT ARCHITECTURE)
 * Height: 30px ultra-compact sleek studio toolbar
 */

const CUTTING_TOOLS = [
    { id: 'split', name: 'Split Clip', shortcut: 'C', group: 'cut', desc: 'Slice clip at playhead position (C)' },
    { id: 'leftcut', name: 'Trim Start (Left Cut)', shortcut: 'Q', group: 'cut', desc: 'Left-cutting scissors: slice & drop left into dustbin (Q)' },
    { id: 'rightcut', name: 'Trim End (Right Cut)', shortcut: 'W', group: 'cut', desc: 'Right-cutting scissors: slice & drop right into dustbin (W)' },
    { id: 'center', name: 'Keep Center', shortcut: 'X', group: 'cut', desc: 'Dual scissors: slice left & right into dustbins, keep center (X)' }
];

const ACTION_TOOLS = [
    { id: 'delete', name: 'Ripple Delete', shortcut: 'Del', group: 'action', desc: 'Delete selection & close timeline gap (Del)' },
    { id: 'undo', name: 'Undo Step', shortcut: 'Ctrl+Z', group: 'action', desc: 'Rollback last editing change (Ctrl+Z)' },
    { id: 'redo', name: 'Redo Step', shortcut: 'Ctrl+Y', group: 'action', desc: 'Re-apply undone change (Ctrl+Y)' }
];

const DRAWING_TOOLS = [
    { id: 'draw_pen', name: 'Laser Pen', shortcut: 'P', group: 'draw', desc: 'Freehand stylus drawing & slice tool (P)' },
    { id: 'draw_line', name: 'Straight Line', shortcut: 'L', group: 'draw', desc: 'CAD precision 2-point straight line (L)' },
    { id: 'draw_rect', name: 'Rectangle / Box', shortcut: 'R', group: 'draw', desc: 'Geometric rectangle & square shape (R)' },
    { id: 'draw_triangle', name: 'Triangle', shortcut: 'T', group: 'draw', desc: 'Geometric 3-point triangle shape (T)' },
    { id: 'draw_circle', name: 'Circle / Ellipse', shortcut: 'O', group: 'draw', desc: 'Center-radius circle & ellipse shape (O)' },
    { id: 'draw_poly', name: 'Polygon / Star', shortcut: 'G', group: 'draw', desc: 'Multi-vertex polygon & angular geometry (G)' },
    { id: 'draw_curve', name: 'Bézier Curve', shortcut: 'U', group: 'draw', desc: 'Smooth Bézier curve spline with handles (U)' },
    { id: 'draw_track', name: 'Motion Pin / Head', shortcut: 'M', group: 'draw', desc: 'Auto-track moving head/object & pin replacement (M)' }
];

const FILMSTRIP_TOOLS = [...CUTTING_TOOLS, ...ACTION_TOOLS, ...DRAWING_TOOLS];

function renderStudioVectorIcon(toolId, isCurrent) {
    const stroke = isCurrent ? '#38bdf8' : '#94a3b8';
    const strokeGreen = isCurrent ? '#34d399' : '#10b981';
    const accentRed = isCurrent ? '#fb7185' : '#f43f5e';
    const strokeW = '1.6';

    switch (toolId) {
        case 'split':
            return `
            <g transform="translate(10, 3) scale(0.65)">
                <line x1="0" y1="18" x2="24" y2="18" stroke="${stroke}" stroke-width="1.3" stroke-linecap="round" />
                <line x1="8" y1="2" x2="13" y2="17" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" />
                <line x1="16" y1="2" x2="11" y2="17" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" />
                <circle cx="12" cy="11" r="1.3" fill="#38bdf8" />
                <circle cx="7" cy="2" r="2.6" fill="none" stroke="${stroke}" stroke-width="1.3" />
                <circle cx="17" cy="2" r="2.6" fill="none" stroke="${stroke}" stroke-width="1.3" />
            </g>`;

        case 'leftcut':
            return `
            <g transform="translate(5, 3) scale(0.65)">
                <path d="M1,6.5 L9,6.5 M3,6.5 L3,4.5 L7,4.5 L7,6.5" stroke="${accentRed}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                <path d="M2,6.5 L3,17 L7,17 L8,6.5" stroke="${accentRed}" stroke-width="1.2" stroke-linejoin="round" fill="${isCurrent ? '#450a0a' : 'none'}" />
                <line x1="4" y1="9" x2="4" y2="14.5" stroke="${accentRed}" stroke-width="0.8" />
                <line x1="6" y1="9" x2="6" y2="14.5" stroke="${accentRed}" stroke-width="0.8" />
                <path d="M18,10.5 Q12,5 5,7.5" fill="none" stroke="${accentRed}" stroke-width="1.2" stroke-dasharray="1.8,1.8" stroke-linecap="round" />
                <circle cx="14" cy="7" r="1" fill="${accentRed}" />
                <circle cx="9" cy="6.5" r="0.9" fill="${accentRed}" />
                <line x1="28" y1="5.5" x2="16" y2="12" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" />
                <line x1="28" y1="16.5" x2="16" y2="9" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" />
                <circle cx="20" cy="10.5" r="1.3" fill="#38bdf8" />
                <circle cx="30" cy="4.5" r="2.6" fill="none" stroke="${stroke}" stroke-width="1.3" />
                <circle cx="30" cy="17.5" r="2.6" fill="none" stroke="${stroke}" stroke-width="1.3" />
            </g>`;

        case 'rightcut':
            return `
            <g transform="translate(6, 3) scale(0.65)">
                <circle cx="4" cy="4.5" r="2.6" fill="none" stroke="${stroke}" stroke-width="1.3" />
                <circle cx="4" cy="17.5" r="2.6" fill="none" stroke="${stroke}" stroke-width="1.3" />
                <line x1="6" y1="5.5" x2="18" y2="12" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" />
                <line x1="6" y1="16.5" x2="18" y2="9" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" />
                <circle cx="14" cy="10.5" r="1.3" fill="#38bdf8" />
                <path d="M16,10.5 Q22,5 29,7.5" fill="none" stroke="${accentRed}" stroke-width="1.2" stroke-dasharray="1.8,1.8" stroke-linecap="round" />
                <circle cx="20" cy="7" r="1" fill="${accentRed}" />
                <circle cx="25" cy="6.5" r="0.9" fill="${accentRed}" />
                <path d="M25,6.5 L33,6.5 M27,6.5 L27,4.5 L31,4.5 L31,6.5" stroke="${accentRed}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                <path d="M26,6.5 L27,17 L31,17 L32,6.5" stroke="${accentRed}" stroke-width="1.2" stroke-linejoin="round" fill="none" />
                <line x1="28" y1="9" x2="28" y2="14.5" stroke="${accentRed}" stroke-width="0.8" />
                <line x1="30" y1="9" x2="30" y2="14.5" stroke="${accentRed}" stroke-width="0.8" />
            </g>`;

        case 'center':
            return `
            <g transform="translate(6, 3) scale(0.65)">
                <path d="M2,6.5 L7,6.5 L6,16 L3,16 Z" stroke="${accentRed}" stroke-width="1" fill="${isCurrent ? '#450a0a' : 'none'}" />
                <path d="M29,6.5 L34,6.5 L33,16 L30,16 Z" stroke="${accentRed}" stroke-width="1" fill="${isCurrent ? '#450a0a' : 'none'}" />
                <circle cx="10" cy="5" r="2" fill="none" stroke="${stroke}" stroke-width="1.2" />
                <line x1="12" y1="7" x2="16" y2="14" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round" />
                <circle cx="26" cy="5" r="2" fill="none" stroke="${stroke}" stroke-width="1.2" />
                <line x1="24" y1="7" x2="20" y2="14" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round" />
                <rect x="15" y="4" width="6" height="15" rx="1.5" fill="${isCurrent ? '#0369a1' : '#0f172a'}" stroke="#38bdf8" stroke-width="1.2" />
                <circle cx="18" cy="11.5" r="1.3" fill="#ffffff" />
            </g>`;

        case 'delete':
            return `
            <g transform="translate(10, 3) scale(0.65)">
                <path d="M3,6 L21,6" stroke="${accentRed}" stroke-width="1.5" stroke-linecap="round" />
                <path d="M8,6 L8,3 L16,3 L16,6" stroke="${accentRed}" stroke-width="1.2" fill="none" />
                <path d="M5,6 L6,19 C6,20 7,21 8,21 L16,21 C17,21 18,20 18,19 L19,6" stroke="${accentRed}" stroke-width="1.5" fill="${isCurrent ? '#450a0a' : 'none'}" />
                <line x1="9" y1="10" x2="9" y2="17" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" />
                <line x1="15" y1="10" x2="15" y2="17" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" />
            </g>`;

        case 'undo':
            return `
            <g transform="translate(10, 3) scale(0.65)">
                <path d="M5 10l-4-4 4-4" fill="none" stroke="#f59e0b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M1 6h12a8 8 0 0 1 8 8 8 8 0 0 1-8 8H7" fill="none" stroke="#f59e0b" stroke-width="1.6" stroke-linecap="round"/>
            </g>`;

        case 'redo':
            return `
            <g transform="translate(10, 3) scale(0.65)">
                <path d="M19 10l4-4-4-4" fill="none" stroke="#f59e0b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M23 6H11a8 8 0 0 0-8 8 8 8 0 0 0 8 8h6" fill="none" stroke="#f59e0b" stroke-width="1.6" stroke-linecap="round"/>
            </g>`;

        case 'draw_pen':
            return `
            <g transform="translate(10, 3) scale(0.65)">
                <path d="M12 19l7-7 3 3-7 7-3-3z" fill="${isCurrent ? '#047857' : 'none'}" stroke="${strokeGreen}" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" fill="none" stroke="${strokeGreen}" stroke-width="1.5" stroke-linejoin="round"/>
                <circle cx="11" cy="11" r="1.5" fill="#38bdf8" />
            </g>`;

        case 'draw_line':
            return `
            <g transform="translate(10, 3) scale(0.65)">
                <line x1="3" y1="18" x2="21" y2="4" stroke="${strokeGreen}" stroke-width="1.6" stroke-linecap="round" />
                <circle cx="3" cy="18" r="2.2" fill="#ffffff" stroke="${strokeGreen}" stroke-width="1" />
                <circle cx="21" cy="4" r="2.2" fill="#ffffff" stroke="${strokeGreen}" stroke-width="1" />
            </g>`;

        case 'draw_rect':
            return `
            <g transform="translate(10, 3) scale(0.65)">
                <rect x="3" y="4" width="18" height="14" rx="2" fill="none" stroke="${strokeGreen}" stroke-width="1.6" />
                <circle cx="3" cy="4" r="1.5" fill="${strokeGreen}" />
                <circle cx="21" cy="4" r="1.5" fill="${strokeGreen}" />
                <circle cx="21" cy="18" r="1.5" fill="${strokeGreen}" />
                <circle cx="3" cy="18" r="1.5" fill="${strokeGreen}" />
            </g>`;

        case 'draw_triangle':
            return `
            <g transform="translate(10, 3) scale(0.65)">
                <polygon points="12,3 21,18 3,18" fill="none" stroke="${strokeGreen}" stroke-width="1.6" stroke-linejoin="round" />
                <circle cx="12" cy="3" r="1.5" fill="${strokeGreen}" />
                <circle cx="21" cy="18" r="1.5" fill="${strokeGreen}" />
                <circle cx="3" cy="18" r="1.5" fill="${strokeGreen}" />
            </g>`;

        case 'draw_circle':
            return `
            <g transform="translate(10, 3) scale(0.65)">
                <circle cx="12" cy="10" r="7.5" fill="none" stroke="${strokeGreen}" stroke-width="1.6" />
                <circle cx="12" cy="2.5" r="1.3" fill="${strokeGreen}" />
                <circle cx="12" cy="17.5" r="1.3" fill="${strokeGreen}" />
                <circle cx="4.5" cy="10" r="1.3" fill="${strokeGreen}" />
                <circle cx="19.5" cy="10" r="1.3" fill="${strokeGreen}" />
            </g>`;

        case 'draw_poly':
            return `
            <g transform="translate(10, 3) scale(0.65)">
                <polygon points="12,2 19,6 19,14 12,18 5,14 5,6" fill="none" stroke="${strokeGreen}" stroke-width="1.6" stroke-linejoin="round" />
                <circle cx="12" cy="2" r="1.3" fill="${strokeGreen}" />
                <circle cx="19" cy="6" r="1.3" fill="${strokeGreen}" />
                <circle cx="19" cy="14" r="1.3" fill="${strokeGreen}" />
                <circle cx="12" cy="18" r="1.3" fill="${strokeGreen}" />
                <circle cx="5" cy="14" r="1.3" fill="${strokeGreen}" />
                <circle cx="5" cy="6" r="1.3" fill="${strokeGreen}" />
            </g>`;

        case 'draw_curve':
            return `
            <g transform="translate(10, 3) scale(0.65)">
                <path d="M2,16 C6,4 16,18 22,4" fill="none" stroke="${strokeGreen}" stroke-width="1.6" stroke-linecap="round" />
                <circle cx="2" cy="16" r="1.8" fill="#090d16" stroke="${strokeGreen}" stroke-width="1.2" />
                <circle cx="22" cy="4" r="1.8" fill="#090d16" stroke="${strokeGreen}" stroke-width="1.2" />
            </g>`;

        case 'draw_track':
            return `
            <g transform="translate(10, 3) scale(0.65)">
                <circle cx="12" cy="10" r="6.5" fill="${isCurrent ? '#3b0764' : 'none'}" stroke="${strokeGreen}" stroke-width="1.5" />
                <circle cx="12" cy="17" r="1.6" fill="#38bdf8" />
                <line x1="12" y1="1" x2="12" y2="4" stroke="#ec4899" stroke-width="1.2" />
                <line x1="12" y1="16" x2="12" y2="19" stroke="#ec4899" stroke-width="1.2" />
                <line x1="3" y1="10" x2="6" y2="10" stroke="#ec4899" stroke-width="1.2" />
                <line x1="18" y1="10" x2="21" y2="10" stroke="#ec4899" stroke-width="1.2" />
            </g>`;

        default:
            return `<circle cx="9" cy="11" r="5" fill="#38bdf8" />`;
    }
}

function renderTitanFilmstripToolbar(options = {}) {
    const {
        id = 'titan-filmstrip-toolbar',
        activeToolId = 'split',
        width = '100%',
        height = 30
    } = options;

    const btnW = 34;
    const btnH = 22;
    const btnGap = 2;

    const renderButtonsGroup = (toolList, activeBorderColor, activeBgColor) => {
        return toolList.map((tool, idx) => {
            const bx = idx * (btnW + btnGap) + 3;
            const isCurrent = tool.id === activeToolId;
            const iconSvg = renderStudioVectorIcon(tool.id, isCurrent);

            return `
            <g id="${id}-frame-${tool.id}" transform="translate(${bx}, 2.5)" class="cursor-pointer" 
               onclick="selectFilmstripTool('${tool.id}')" 
               onmouseenter="showFilmstripTooltip(event, '${tool.id}')" 
               onmouseleave="hideFilmstripTooltip()">
                <rect id="${id}-frame-bg-${tool.id}" x="0" y="0" width="${btnW}" height="${btnH}" rx="4" 
                      fill="${isCurrent ? activeBgColor : '#080d1a'}" 
                      stroke="${isCurrent ? activeBorderColor : '#1e293b'}" stroke-width="${isCurrent ? 1.2 : 0.8}" />
                <text x="${btnW - 3}" y="7" font-size="5" font-weight="900" font-family="monospace" fill="${isCurrent ? activeBorderColor : '#64748b'}" text-anchor="end">${tool.shortcut}</text>
                <g id="${id}-vector-icon-${tool.id}">
                    ${iconSvg}
                </g>
            </g>`;
        }).join('\n');
    };

    const cutGroupWidth = CUTTING_TOOLS.length * (btnW + btnGap) + 6;
    const cutButtonsSvg = renderButtonsGroup(CUTTING_TOOLS, '#38bdf8', '#082f49');

    const actionGroupWidth = ACTION_TOOLS.length * (btnW + btnGap) + 6;
    const actionButtonsSvg = renderButtonsGroup(ACTION_TOOLS, '#f59e0b', '#1c1917');

    const drawGroupWidth = DRAWING_TOOLS.length * (btnW + btnGap) + 6;
    const drawButtonsSvg = renderButtonsGroup(DRAWING_TOOLS, '#10b981', '#064e3b');

    const totalDeckWidth = cutGroupWidth + actionGroupWidth + drawGroupWidth + 16;

    return `
<div id="${id}-wrapper" style="position:relative; width:${width}; height:${height}px; background:#040711; border:1px solid #142036; border-radius:6px; overflow:hidden; user-select:none; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display:flex; align-items:center; justify-content:center;">
    <div id="${id}-track-container" style="width:100%; height:100%; overflow-x:auto; overflow-y:hidden; scrollbar-width:none; display:flex; align-items:center; justify-content:center;">
        <svg id="${id}-svg" viewBox="0 0 ${totalDeckWidth} 28" width="${totalDeckWidth}" height="28" xmlns="http://www.w3.org/2000/svg" style="display:block; margin:0 auto;">
            <!-- Group 1: 4-Way Cutting -->
            <g id="${id}-group-cutting" transform="translate(3, 0.5)">
                <rect x="0" y="0" width="${cutGroupWidth}" height="27" rx="5" fill="#060b18" stroke="#0284c7" stroke-width="0.9" stroke-opacity="0.85" />
                ${cutButtonsSvg}
            </g>
            <!-- Group 2: Actions -->
            <g id="${id}-group-action" transform="translate(${cutGroupWidth + 7}, 0.5)">
                <rect x="0" y="0" width="${actionGroupWidth}" height="27" rx="5" fill="#0c0a09" stroke="#d97706" stroke-width="0.9" stroke-opacity="0.75" />
                ${actionButtonsSvg}
            </g>
            <!-- Group 3: Vector Draw & Shapes -->
            <g id="${id}-group-draw" transform="translate(${cutGroupWidth + actionGroupWidth + 11}, 0.5)">
                <rect x="0" y="0" width="${drawGroupWidth}" height="27" rx="5" fill="#022c22" stroke="#059669" stroke-width="0.9" stroke-opacity="0.85" />
                ${drawButtonsSvg}
            </g>
        </svg>
    </div>
    <!-- Floating Tooltip -->
    <div id="${id}-tooltip" style="display:none; position:fixed; z-index:9999; pointer-events:none; background:#090d16f2; border:1.2px solid #38bdf8; border-radius:6px; padding:4px 8px; box-shadow:0 8px 24px rgba(0,0,0,0.95); backdrop-filter:blur(10px); transform:translate(-50%, -100%); margin-top:-6px;">
        <div style="display:flex; align-items:center; gap:6px;">
            <span id="${id}-tt-name" style="font-size:10px; font-weight:900; color:#ffffff;">Split Clip</span>
            <span id="${id}-tt-key" style="font-size:7.5px; font-weight:900; background:#0284c7; color:#ffffff; padding:1px 4px; border-radius:3px; font-family:monospace;">[ C ]</span>
        </div>
    </div>
</div>`;
}

module.exports = {
    renderTitanFilmstripToolbar,
    renderStudioVectorIcon,
    FILMSTRIP_TOOLS,
    CUTTING_TOOLS,
    ACTION_TOOLS,
    DRAWING_TOOLS
};
