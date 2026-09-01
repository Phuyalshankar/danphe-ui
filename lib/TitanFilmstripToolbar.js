'use strict';

/**
 * 🐬 TitanFilmstripToolbar (danphe-ui/lib)
 * STUDIO MASTER PRECISION DECK (3-GROUP ARCHITECTURE)
 * Group 1: 4-Way Cutting Suite (Split, Left Cut, Right Cut, Keep Center) [Cyan Border]
 * Group 2: Action Suite (Ripple Delete, Undo, Redo) [Amber Border]
 * Group 3: Vector Draw & Shapes Suite (Pen, Line, Rect, Circle, Poly, Curve) [Emerald Border]
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

/**
 * Ultra-Clean 1.5px Precision Studio Vector Glyphs
 */
function renderStudioVectorIcon(toolId, isCurrent) {
    const stroke = isCurrent ? '#38bdf8' : '#94a3b8';
    const strokeGreen = isCurrent ? '#34d399' : '#10b981';
    const accentRed = isCurrent ? '#fb7185' : '#f43f5e';
    const strokeW = '1.6';

    switch (toolId) {
        // 1. SPLIT (C): Downward Cutting Scissors on Track
        case 'split':
            return `
            <g transform="translate(15, 6)">
                <line x1="0" y1="18" x2="24" y2="18" stroke="${stroke}" stroke-width="1.3" stroke-linecap="round" />
                <line x1="8" y1="2" x2="13" y2="17" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" />
                <line x1="16" y1="2" x2="11" y2="17" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" />
                <circle cx="12" cy="11" r="1.3" fill="#38bdf8" />
                <circle cx="7" cy="2" r="2.6" fill="none" stroke="${stroke}" stroke-width="1.3" />
                <circle cx="17" cy="2" r="2.6" fill="none" stroke="${stroke}" stroke-width="1.3" />
            </g>`;

        // 2. LEFT CUT (Q): Compact Left Scissors + Trajectory (•••) into Left Dustbin
        case 'leftcut':
            return `
            <g transform="translate(10, 6)">
                <!-- 🗑️ Mini Dustbin -->
                <path d="M1,6.5 L9,6.5 M3,6.5 L3,4.5 L7,4.5 L7,6.5" stroke="${accentRed}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                <path d="M2,6.5 L3,17 L7,17 L8,6.5" stroke="${accentRed}" stroke-width="1.2" stroke-linejoin="round" fill="${isCurrent ? '#450a0a' : 'none'}" />
                <line x1="4" y1="9" x2="4" y2="14.5" stroke="${accentRed}" stroke-width="0.8" />
                <line x1="6" y1="9" x2="6" y2="14.5" stroke="${accentRed}" stroke-width="0.8" />
                <!-- Trajectory Arc -->
                <path d="M18,10.5 Q12,5 5,7.5" fill="none" stroke="${accentRed}" stroke-width="1.2" stroke-dasharray="1.8,1.8" stroke-linecap="round" />
                <circle cx="14" cy="7" r="1" fill="${accentRed}" />
                <circle cx="9" cy="6.5" r="0.9" fill="${accentRed}" />
                <!-- Scissors -->
                <line x1="28" y1="5.5" x2="16" y2="12" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" />
                <line x1="28" y1="16.5" x2="16" y2="9" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" />
                <circle cx="20" cy="10.5" r="1.3" fill="#38bdf8" />
                <circle cx="30" cy="4.5" r="2.6" fill="none" stroke="${stroke}" stroke-width="1.3" />
                <circle cx="30" cy="17.5" r="2.6" fill="none" stroke="${stroke}" stroke-width="1.3" />
            </g>`;

        // 3. RIGHT CUT (W): Compact Right Scissors + Trajectory (•••) into Right Dustbin
        case 'rightcut':
            return `
            <g transform="translate(10, 6)">
                <!-- Scissors -->
                <circle cx="4" cy="4.5" r="2.6" fill="none" stroke="${stroke}" stroke-width="1.3" />
                <circle cx="4" cy="17.5" r="2.6" fill="none" stroke="${stroke}" stroke-width="1.3" />
                <line x1="6" y1="5.5" x2="18" y2="12" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" />
                <line x1="6" y1="16.5" x2="18" y2="9" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" />
                <circle cx="14" cy="10.5" r="1.3" fill="#38bdf8" />
                <!-- Trajectory Arc -->
                <path d="M16,10.5 Q22,5 29,7.5" fill="none" stroke="${accentRed}" stroke-width="1.2" stroke-dasharray="1.8,1.8" stroke-linecap="round" />
                <circle cx="20" cy="7" r="1" fill="${accentRed}" />
                <circle cx="25" cy="6.5" r="0.9" fill="${accentRed}" />
                <!-- 🗑️ Mini Dustbin -->
                <path d="M25,6.5 L33,6.5 M27,6.5 L27,4.5 L31,4.5 L31,6.5" stroke="${accentRed}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                <path d="M26,6.5 L27,17 L31,17 L32,6.5" stroke="${accentRed}" stroke-width="1.2" stroke-linejoin="round" fill="${isCurrent ? '#450a0a' : 'none'}" />
                <line x1="28" y1="9" x2="28" y2="14.5" stroke="${accentRed}" stroke-width="0.8" />
                <line x1="30" y1="9" x2="30" y2="14.5" stroke="${accentRed}" stroke-width="0.8" />
            </g>`;

        // 4. CENTER USE (X): Preserved Emerald Center
        case 'center':
            return `
            <g transform="translate(10, 7)">
                <line x1="6" y1="2" x2="6" y2="20" stroke="${accentRed}" stroke-width="1.5" stroke-dasharray="2,1" />
                <rect x="9" y="4" width="16" height="14" rx="2.5" fill="${isCurrent ? '#065f46' : '#042f2e'}" stroke="${isCurrent ? '#10b981' : '#059669'}" stroke-width="1.5" />
                <path d="M14,11 L16.5,13.5 L20,8.5" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                <line x1="28" y1="2" x2="28" y2="20" stroke="${accentRed}" stroke-width="1.5" stroke-dasharray="2,1" />
            </g>`;

        // 5. DELETE (Del): Precision Ripple Trash Can
        case 'delete':
            return `
            <g transform="translate(17, 8)">
                <path d="M2,6 L16,6 M6,6 L6,3 L12,3 L12,6 M4,6 L5,18 L13,18 L14,6" fill="none" stroke="${isCurrent ? '#ef4444' : stroke}" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round" />
                <line x1="7" y1="9" x2="7" y2="15" stroke="${isCurrent ? '#ef4444' : stroke}" stroke-width="1.2" stroke-linecap="round" />
                <line x1="11" y1="9" x2="11" y2="15" stroke="${isCurrent ? '#ef4444' : stroke}" stroke-width="1.2" stroke-linecap="round" />
            </g>`;

        // 6. UNDO (Ctrl+Z): Circular Rollback Arrow
        case 'undo':
            return `
            <g transform="translate(16, 7)">
                <path d="M15,16 C15,9 11,5 4,7" fill="none" stroke="${stroke}" stroke-width="${strokeW}" stroke-linecap="round" />
                <path d="M8,3 L3,7 L7,11" fill="none" stroke="${stroke}" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round" />
            </g>`;

        // 7. REDO (Ctrl+Y): Circular Forward Arrow
        case 'redo':
            return `
            <g transform="translate(16, 7)">
                <path d="M3,16 C3,9 7,5 14,7" fill="none" stroke="${stroke}" stroke-width="${strokeW}" stroke-linecap="round" />
                <path d="M10,3 L15,7 L11,11" fill="none" stroke="${stroke}" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round" />
            </g>`;

        // ── 🎨 VECTOR DRAW & SHAPES SUITE (GROUP 3) ──

        // 8. LASER DRAW PEN (P): Stylus Pen with Drawn Line
        case 'draw_pen':
        case 'draw':
            return `
            <g transform="translate(17, 7)">
                <path d="M16,1 L19,4 L7,16 L3,17 L4,13 Z" fill="none" stroke="${strokeGreen}" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round" />
                <line x1="13" y1="4" x2="16" y2="7" stroke="${strokeGreen}" stroke-width="1.2" />
                <circle cx="3" cy="17" r="1.5" fill="${isCurrent ? '#34d399' : '#10b981'}" />
                <line x1="-3" y1="19" x2="21" y2="19" stroke="${isCurrent ? '#34d399' : '#10b981'}" stroke-width="1.8" stroke-linecap="round" />
                <line x1="-3" y1="19" x2="8" y2="19" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" />
            </g>`;

        // 9. STRAIGHT LINE (L): 2-Point CAD Line
        case 'draw_line':
            return `
            <g transform="translate(16, 7)">
                <line x1="2" y1="16" x2="20" y2="4" stroke="${strokeGreen}" stroke-width="${strokeW}" stroke-linecap="round" />
                <circle cx="2" cy="16" r="2.5" fill="#090d16" stroke="${strokeGreen}" stroke-width="1.4" />
                <circle cx="20" cy="4" r="2.5" fill="#090d16" stroke="${strokeGreen}" stroke-width="1.4" />
            </g>`;

        // 10. RECTANGLE / SQUARE (R): Geometric Box
        case 'draw_rect':
            return `
            <g transform="translate(16, 7)">
                <rect x="2" y="3" width="20" height="14" rx="2" fill="${isCurrent ? '#064e3b' : 'none'}" stroke="${strokeGreen}" stroke-width="${strokeW}" />
                <rect x="0" y="1" width="3.5" height="3.5" rx="0.5" fill="${strokeGreen}" />
                <rect x="20.5" y="1" width="3.5" height="3.5" rx="0.5" fill="${strokeGreen}" />
                <rect x="0" y="15.5" width="3.5" height="3.5" rx="0.5" fill="${strokeGreen}" />
                <rect x="20.5" y="15.5" width="3.5" height="3.5" rx="0.5" fill="${strokeGreen}" />
            </g>`;

        // 10. TRIANGLE (T): Geometric 3-Point Triangle
        case 'draw_triangle':
            return `
            <g transform="translate(16, 7)">
                <polygon points="12,2 21,17 3,17" fill="${isCurrent ? '#064e3b' : 'none'}" stroke="${strokeGreen}" stroke-width="${strokeW}" stroke-linejoin="round" />
                <circle cx="12" cy="2" r="1.5" fill="${strokeGreen}" />
                <circle cx="21" cy="17" r="1.5" fill="${strokeGreen}" />
                <circle cx="3" cy="17" r="1.5" fill="${strokeGreen}" />
            </g>`;

        // 11. CIRCLE / ELLIPSE (O): Center-Radius Ellipse
        case 'draw_circle':
            return `
            <g transform="translate(16, 7)">
                <circle cx="12" cy="10" r="8" fill="${isCurrent ? '#064e3b' : 'none'}" stroke="${strokeGreen}" stroke-width="${strokeW}" />
                <!-- 4 Cardinal Nodes -->
                <circle cx="12" cy="2" r="1.5" fill="${strokeGreen}" />
                <circle cx="12" cy="18" r="1.5" fill="${strokeGreen}" />
                <circle cx="4" cy="10" r="1.5" fill="${strokeGreen}" />
                <circle cx="20" cy="10" r="1.5" fill="${strokeGreen}" />
                <circle cx="12" cy="10" r="1" fill="#ffffff" />
            </g>`;

        // 12. POLYGON / STAR (G): 6-Sided Hexagon
        case 'draw_poly':
            return `
            <g transform="translate(16, 7)">
                <polygon points="12,2 19,6 19,14 12,18 5,14 5,6" fill="${isCurrent ? '#064e3b' : 'none'}" stroke="${strokeGreen}" stroke-width="${strokeW}" stroke-linejoin="round" />
                <circle cx="12" cy="2" r="1.5" fill="${strokeGreen}" />
                <circle cx="19" cy="6" r="1.5" fill="${strokeGreen}" />
                <circle cx="19" cy="14" r="1.5" fill="${strokeGreen}" />
                <circle cx="12" cy="18" r="1.5" fill="${strokeGreen}" />
                <circle cx="5" cy="14" r="1.5" fill="${strokeGreen}" />
                <circle cx="5" cy="6" r="1.5" fill="${strokeGreen}" />
            </g>`;

        // 13. BÉZIER CURVE (U): Smooth Spline with Tangents
        case 'draw_curve':
            return `
            <g transform="translate(16, 7)">
                <!-- Smooth S-Curve -->
                <path d="M2,16 C6,4 16,18 22,4" fill="none" stroke="${strokeGreen}" stroke-width="${strokeW}" stroke-linecap="round" />
                <!-- Tangent Handles -->
                <circle cx="2" cy="16" r="2" fill="#090d16" stroke="${strokeGreen}" stroke-width="1.3" />
                <circle cx="22" cy="4" r="2" fill="#090d16" stroke="${strokeGreen}" stroke-width="1.3" />
                <line x1="2" y1="16" x2="6" y2="4" stroke="#ffffff" stroke-width="0.8" stroke-dasharray="1.5,1.5" />
                <circle cx="6" cy="4" r="1.3" fill="#ffffff" />
            </g>`;

        // 14. MOTION TRACK PIN / HEAD SWAP (M): Head with Tracking Crosshairs & Pin
        case 'draw_track':
            return `
            <g transform="translate(16, 7)">
                <!-- Head Contour -->
                <circle cx="12" cy="10" r="7" fill="${isCurrent ? '#3b0764' : 'none'}" stroke="${strokeGreen}" stroke-width="${strokeW}" />
                <!-- Neck Pivot Point -->
                <circle cx="12" cy="17" r="1.8" fill="#38bdf8" />
                <!-- Tracking Crosshairs Target -->
                <line x1="12" y1="0" x2="12" y2="5" stroke="#ec4899" stroke-width="1.2" />
                <line x1="12" y1="15" x2="12" y2="20" stroke="#ec4899" stroke-width="1.2" />
                <line x1="2" y1="10" x2="7" y2="10" stroke="#ec4899" stroke-width="1.2" />
                <line x1="17" y1="10" x2="22" y2="10" stroke="#ec4899" stroke-width="1.2" />
                <!-- Pin Needle -->
                <circle cx="12" cy="10" r="2" fill="#ffffff" stroke="#ec4899" stroke-width="1" />
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
        height = 44
    } = options;

    const btnW = 50;
    const btnH = 34;
    const btnGap = 3.5;

    // ── Helper to render a group of buttons ──
    const renderButtonsGroup = (toolList, activeBorderColor, activeBgColor) => {
        return toolList.map((tool, idx) => {
            const bx = idx * (btnW + btnGap) + 5;
            const isCurrent = tool.id === activeToolId;
            const iconSvg = renderStudioVectorIcon(tool.id, isCurrent);

            return `
            <!-- Tool: ${tool.id} -->
            <g id="${id}-frame-${tool.id}" transform="translate(${bx}, 4)" class="cursor-pointer" 
               onclick="selectFilmstripTool('${tool.id}')" 
               onmouseenter="showFilmstripTooltip(event, '${tool.id}')" 
               onmouseleave="hideFilmstripTooltip()">
                
                <rect id="${id}-frame-bg-${tool.id}" x="0" y="0" width="${btnW}" height="${btnH}" rx="5" 
                      fill="${isCurrent ? activeBgColor : '#090d16'}" 
                      stroke="${isCurrent ? activeBorderColor : '#1e293b'}" stroke-width="${isCurrent ? 1.4 : 1}" />
                
                <text x="${btnW - 4}" y="9" font-size="6.5" font-weight="900" font-family="monospace" fill="${isCurrent ? activeBorderColor : '#64748b'}" text-anchor="end">${tool.shortcut}</text>

                <g id="${id}-vector-icon-${tool.id}">
                    ${iconSvg}
                </g>

                <rect id="${id}-line-${tool.id}" x="6" y="${btnH - 2}" width="${btnW - 12}" height="2" rx="1" fill="${activeBorderColor}" style="${isCurrent ? '' : 'display:none;'}" />
            </g>`;
        }).join('\n');
    };

    // 1. Group 1: 4-Way Cutting Suite
    const cutGroupWidth = CUTTING_TOOLS.length * (btnW + btnGap) + 8;
    const cutButtonsSvg = renderButtonsGroup(CUTTING_TOOLS, '#38bdf8', '#082f49');

    // 2. Group 2: Action Suite (Delete, Undo, Redo)
    const actionGroupWidth = ACTION_TOOLS.length * (btnW + btnGap) + 8;
    const actionButtonsSvg = renderButtonsGroup(ACTION_TOOLS, '#f59e0b', '#1c1917');

    // 3. Group 3: Vector Draw & Shapes Suite (Pen, Line, Rect, Circle, Poly, Curve)
    const drawGroupWidth = DRAWING_TOOLS.length * (btnW + btnGap) + 8;
    const drawButtonsSvg = renderButtonsGroup(DRAWING_TOOLS, '#10b981', '#064e3b');

    const totalDeckWidth = cutGroupWidth + actionGroupWidth + drawGroupWidth + 30;

    return `
<div id="${id}-wrapper" style="position:relative; width:${width}; height:${height}px; background:#040711; border:1px solid #1e293b; border-radius:8px; overflow:hidden; box-shadow:0 4px 16px rgba(0,0,0,0.9); user-select:none; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display:flex; align-items:center; justify-content:center;">
    
    <div id="${id}-track-container" style="width:100%; height:100%; overflow-x:auto; overflow-y:hidden; scrollbar-width:none; display:flex; align-items:center; justify-content:center;">
        
        <svg id="${id}-svg" viewBox="0 0 ${totalDeckWidth} 44" width="${totalDeckWidth}" height="44" xmlns="http://www.w3.org/2000/svg" style="display:block; margin:0 auto;">
            
            <!-- ── GROUP 1: 4-WAY PRECISION CUTTING SUITE (Cyan Border) ── -->
            <g id="${id}-group-cutting" transform="translate(6, 1)">
                <rect x="0" y="0" width="${cutGroupWidth}" height="42" rx="6" fill="#060b18" stroke="#0284c7" stroke-width="1.2" stroke-opacity="0.85" />
                <text x="7" y="-2" font-size="5.2" font-weight="900" font-family="monospace" fill="#38bdf8" letter-spacing="0.5">✂️ CUTTING SUITE</text>
                ${cutButtonsSvg}
            </g>

            <!-- ── GROUP 2: ACTION SUITE (Amber Border) ── -->
            <g id="${id}-group-action" transform="translate(${cutGroupWidth + 12}, 1)">
                <rect x="0" y="0" width="${actionGroupWidth}" height="42" rx="6" fill="#0c0a09" stroke="#d97706" stroke-width="1.2" stroke-opacity="0.75" />
                <text x="7" y="-2" font-size="5.2" font-weight="900" font-family="monospace" fill="#f59e0b" letter-spacing="0.5">⚡ ACTIONS</text>
                ${actionButtonsSvg}
            </g>

            <!-- ── GROUP 3: VECTOR DRAW & SHAPES SUITE (Emerald Border) ── -->
            <g id="${id}-group-draw" transform="translate(${cutGroupWidth + actionGroupWidth + 18}, 1)">
                <rect x="0" y="0" width="${drawGroupWidth}" height="42" rx="6" fill="#022c22" stroke="#059669" stroke-width="1.2" stroke-opacity="0.85" />
                <text x="7" y="-2" font-size="5.2" font-weight="900" font-family="monospace" fill="#34d399" letter-spacing="0.5">🎨 DRAW & SHAPES SUITE</text>
                ${drawButtonsSvg}
            </g>
        </svg>
    </div>

    <!-- Floating Sleek Glass Tooltip -->
    <div id="${id}-tooltip" style="display:none; position:fixed; z-index:9999; pointer-events:none; background:#090d16f2; border:1.2px solid #38bdf8; border-radius:6px; padding:6px 12px; box-shadow:0 8px 24px rgba(0,0,0,0.95); backdrop-filter:blur(10px); transform:translate(-50%, -100%); margin-top:-10px;">
        <div style="display:flex; align-items:center; gap:8px;">
            <span id="${id}-tt-name" style="font-size:11px; font-weight:900; color:#ffffff;">Split Clip</span>
            <span id="${id}-tt-key" style="font-size:8px; font-weight:900; background:#0284c7; color:#ffffff; padding:1px 5px; border-radius:3px; font-family:monospace;">[ C ]</span>
        </div>
        <div id="${id}-tt-desc" style="font-size:8.5px; font-weight:700; color:#94a3b8; margin-top:2px;">Slice clip at playhead position</div>
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
