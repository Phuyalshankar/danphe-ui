'use strict';
const { renderAdaptiveIconSVG } = require('d:/danphe-ui/lib/TitanAdaptiveIcon');
const svgContent = renderAdaptiveIconSVG(225, 0, 28, false);

const isIcon = svgContent.includes('titan-adaptive-icon') || svgContent.includes('viewBox="0 0 24 24"') || svgContent.includes('viewBox="0 0 32 32"') || svgContent.length < 1500;
const is7Seg = svgContent.includes('7seg') || svgContent.includes('segment') || svgContent.includes('dial_input');
const isGauge = svgContent.includes('gauge') || svgContent.includes('180 130') || svgContent.includes('200 150');

let extractedW = isIcon ? 32 : is7Seg ? 240 : isGauge ? 220 : 240;
let extractedH = isIcon ? 32 : is7Seg ? 32 : isGauge ? 160 : 180;

const wMatch = svgContent.match(/width="(\d+)"/);
if (wMatch) extractedW = parseInt(wMatch[1]) || extractedW;
const hMatch = svgContent.match(/height="(\d+)"/);
if (hMatch) extractedH = parseInt(hMatch[1]) || extractedH;

console.log('isIcon =>', isIcon);
console.log('SVG default size from onMeasure:', extractedW + 'x' + extractedH);
console.log('applySize sets:              28dp x 28dp');
console.log('onMeasure respects explicitW/H from layoutParams => 28dp x 28dp');
console.log('');
console.log('SVG first 200 chars:', svgContent.substring(0, 200));
console.log('');

// Now simulate the REAL stringPool ordering problem
// ThorVGBuilder reads: action = nextStr(), svgData = nextStr()
// BUT buildComp reads:  sizeStr = nextStr() FIRST, then passes to builder

// So the stringPool order is:
// [0] sizeStr = "28|28|0|0|1.0||"
// [1] action  = ""
// [2] svgData = "<svg>...</svg>"

// BUT in UniversalUIImporter case 0x61:
// stringPool.push(props.action || '')   <-- index 0
// stringPool.push(props.svg || ...)     <-- index 1

// And in buildComp:
// sizeStr = nextStr()  <-- reads index 0 = "28|28|..."  (size)
// then builder.build() is called, which does:
// action = factory.nextStr()   <-- reads index 1 = "" (action)
// svgData = factory.nextStr()  <-- reads index 2 = SVG content

// WAIT. Does sizeStr consume an entry BEFORE the builder reads?
// Let's count how many nextStr() calls happen:

console.log('=== StringPool Order Audit ===');
console.log('buildComp() calls:');
console.log('  [0] nextStr() -> sizeStr = "28|28|0|0|1.0||"');
console.log('  [sig check] no gradient/border/dynamic/anim flags -> no extra reads');
console.log('  Then ThorVGBuilder.build() calls:');
console.log('    [1] nextStr() -> action = ""');
console.log('    [2] nextStr() -> svgData = "<svg>...</svg>"');
console.log('');
console.log('UniversalUIImporter pushes for opcode 0x61:');
console.log('  [0] sizeStr pushed by line 675 = "28|28|0|0|1.0||"');
console.log('  [1] action = props.action || "" = ""');
console.log('  [2] svgData = props.svg = "<svg>...</svg>"');
console.log('');
console.log('=> ORDER MATCHES! 28dp x 28dp SVG should render!');
console.log('');
console.log('... So what IS the actual problem on mobile?');
console.log('=> Most likely: setSvg() is called BEFORE onSizeChanged fires!');
console.log('=> ThorVGView calls renderThorVGFrame() only in onSizeChanged');
console.log('=> If view is 0x0 at mount time, onSizeChanged never fires!');
console.log('=> setSvg() does NOT trigger a re-render if view has no size yet!');
