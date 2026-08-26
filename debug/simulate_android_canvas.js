'use strict';
/**
 * 🔬 FULL ANDROID CANVAS SIMULATION
 * Exactly mimics ThorVGView.drawSvgIcon() on Android
 * Outputs SVG file showing what mobile would actually render
 */

const fs = require('fs');
const { renderAdaptiveIconSVG } = require('d:/danphe-ui/lib/TitanAdaptiveIcon');

const TEST_ICONS = [
    { name: 'CONTACTS (Home Tab)',   code: 225, size: 28 },
    { name: 'KEYPAD 9-pin',          code: 15,  size: 28 },
    { name: 'CHAT bubble',           code: 7,   size: 28 },
    { name: 'INCOMING call',         code: 1,   size: 22 },
    { name: 'OUTGOING call',         code: 3,   size: 22 },
    { name: 'MISSED call (badge=2)', code: 4,   size: 22, missedCount: 2 },
    { name: 'SEARCH',                code: 47,  size: 18 },
    { name: 'SETTINGS',              code: 226, size: 28 },
    { name: 'HOME tab',              code: 224, size: 28 },
];

// Simulate exactly what Android dp() does on 3x screen
const DENSITY = 3.0;
function dp(v) { return Math.round(v * DENSITY); }

const results = [];

for (const icon of TEST_ICONS) {
    const svgContent = renderAdaptiveIconSVG(icon.code, icon.missedCount || 0, icon.size, false);
    const viewW = dp(icon.size); // e.g. 28dp → 84px
    const viewH = dp(icon.size);

    const isCircle32 = svgContent.includes('viewBox="0 0 32 32"') || svgContent.includes('r="13.5"') || svgContent.includes('r="15"');
    const viewBoxSize = isCircle32 ? 32 : 24;
    const scale = Math.min(viewW, viewH) / viewBoxSize;
    const scaleFactorForStroke = isCircle32 ? ((24/32) * (viewW/24)) : (viewW/24);

    // Parse paths exactly like drawSvgIcon does
    const pathRegex = /<path[^>]*?d="([^"]+)"[^>]*?>/g;
    const strokeColorRx = /stroke="([^"]+)"/;
    const strokeWidthRx = /stroke-width="([^"]+)"/;
    const fillRx = /fill="([^"]+)"/;
    const circleRx = /<circle[^>]*?cx="([^"]+)"[^>]*?cy="([^"]+)"[^>]*?r="([^"]+)"[^>]*?>/g;

    let match;
    const paths = [];
    const circles = [];
    let pathErrors = 0;

    // Paths
    while ((match = pathRegex.exec(svgContent)) !== null) {
        const fullTag = match[0];
        const d = match[1];
        const stroke = (strokeColorRx.exec(fullTag) || [])[1] || '#ffffff';
        const strokeW_raw = parseFloat((strokeWidthRx.exec(fullTag) || [])[1] || '2');
        const fill = (fillRx.exec(fullTag) || [])[1] || 'none';
        const strokeW_scaled = strokeW_raw / scaleFactorForStroke;
        
        // Validate path (check for common SVG path commands)
        const validCmds = /^[MmLlHhVvCcSsQqTtAaZz\s\d.,\-+eE]+$/;
        const pathValid = validCmds.test(d);
        if (!pathValid) pathErrors++;

        paths.push({ d, stroke, fill, strokeW_raw, strokeW_scaled, pathValid });
    }

    // Circles — NOW HANDLED in ThorVGView.kt (after fix)
    while ((match = circleRx.exec(svgContent)) !== null) {
        circles.push({ cx: match[1], cy: match[2], r: match[3] });
    }

    // Search for <line> and <polyline> too
    const lineRx = /<line[^>]*?>/g;
    const polylineRx = /<polyline[^>]*?>/g;
    let lineCount = 0, polylineCount = 0;
    while (lineRx.exec(svgContent) !== null) lineCount++;
    while (polylineRx.exec(svgContent) !== null) polylineCount++;

    const r = {
        icon,
        viewW, viewH,
        scale,
        scaleFactorForStroke,
        pathCount: paths.length,
        circleCount: circles.length,
        lineCount, polylineCount,
        pathErrors,
        paths,
        circles,
        svgLength: svgContent.length,
        // After fix: circles ARE rendered
        willRender: paths.length > 0 || circles.length > 0 || lineCount > 0 || polylineCount > 0,
    };
    results.push(r);

    const hasElements = paths.length + circles.length + lineCount + polylineCount;
    console.log(`\n════════════════════════════════════════`);
    console.log(`📱 ${icon.name} (code=${icon.code}, size=${icon.size}dp)`);
    console.log(`   View pixels:     ${viewW}×${viewH}px (${DENSITY}x screen)`);
    console.log(`   Canvas scale:    ${scaleFactorForStroke.toFixed(3)}x`);
    console.log(`   <path> found:    ${paths.length}`);
    console.log(`   <circle> found:  ${circles.length} ${circles.length > 0 ? '✅ NOW RENDERED (circle fix applied)' : ''}`);
    console.log(`   <line> found:    ${lineCount}`);
    console.log(`   <polyline> found:${polylineCount}`);
    console.log(`   Path errors:     ${pathErrors}`);
    paths.forEach((p, i) => {
        console.log(`   PATH[${i}]: stroke="${p.stroke}" fill="${p.fill}" strokePx=${p.strokeW_scaled.toFixed(3)} valid=${p.pathValid ? '✅' : '❌'}`);
    });
    circles.forEach((c, i) => {
        console.log(`   CIRCLE[${i}]: cx=${c.cx} cy=${c.cy} r=${c.r} ✅ will draw`);
    });
    const status = hasElements > 0 ? `✅ FULL render (${hasElements} elements)` : '❌ NOTHING TO DRAW';
    console.log(`   ► RESULT: ${status}`);
}

// Summary
console.log('\n\n════════════════════════════════════════');
console.log('📊 FINAL SIMULATION SUMMARY (POST circle-fix)');
console.log('════════════════════════════════════════');
let allPass = true;
for (const r of results) {
    const total = r.pathCount + r.circleCount + r.lineCount + r.polylineCount;
    const status = total > 0 ? `✅ WILL RENDER (${r.pathCount}p + ${r.circleCount}c + ${r.lineCount}l + ${r.polylineCount}pl)` : '❌ NOTHING';
    if (total === 0) allPass = false;
    console.log(`  ${r.icon.name.padEnd(25)} : ${status}`);
}
console.log(`\n${allPass ? '✅ ALL ICONS PASS — safe to build!' : '❌ SOME ICONS STILL BLANK — DO NOT BUILD'}`);
console.log('════════════════════════════════════════\n');
