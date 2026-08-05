'use strict';

const ub = require('../framework/ub');

/**
 * 🌐 UniversalUIImporter - Titan 16-byte Protocol Mapper
 * TRUE 10-day work version with STRICT STRING ALIGNMENT.
 */
class UniversalUIImporter {
    constructor() {
        this.stringPool = [];
        this.cdns = [];
        console.log('🌐 Universal UI Importer Initialized');
    }

    setCDNs(cdns) {
        this.cdns = Array.isArray(cdns) ? cdns : [];
        if (this.cdns.length > 0) {
            console.log(`📡 Registered ${this.cdns.length} external UI CDNs`);
        }
    }

    importSchema(schema, options = {}) {
        const binaries = [];
        const stringPool = [];

        const process = (comp, inheritedColor = null) => {
            if (typeof comp === 'function') {
                try {
                    return process(comp(), inheritedColor);
                } catch (e) {
                    return;
                }
            }
            if (comp && typeof comp.type === 'function') {
                try {
                    return process(comp.type(comp.props || {}), inheritedColor);
                } catch (e) {
                    return;
                }
            }
            if (comp && typeof comp.tag === 'function') {
                try {
                    return process(comp.tag(comp.props || {}), inheritedColor);
                } catch (e) {
                    return;
                }
            }
            // Skip empty/whitespace-only HTML AST text nodes and JSX comments ({/* ... */})
            if (comp && comp.type === 'text') {
                const val = String(comp.value || '').trim();
                if (!val || val.startsWith('{/*') || val.startsWith('/*') || val.startsWith('//')) {
                    return;
                }
            }
            const rawAttributes = comp.attributes || {};
            const normAttributes = {};
            Object.keys(rawAttributes).forEach(k => {
                normAttributes[k.toLowerCase()] = rawAttributes[k];
            });

            // Schema format: comp.type='AppBar', comp.children=[...]
            require("fs").appendFileSync("comp_debug.log", "ELEM: " + (comp.type==="element"?comp.tag:comp.type) + " " + JSON.stringify(comp.attributes||comp.props||{}) + "\n");
let compType = comp.props && comp.props.type ? comp.props.type
                         : (normAttributes.type ? normAttributes.type
                         : (comp.type === 'element' ? (comp.tag || '').toLowerCase() : comp.type));
            if (typeof compType === 'function') {
                compType = compType.name || '';
            }
            let rawTw = comp.props && comp.props.className ? comp.props.className
                      : (normAttributes.classname ? normAttributes.classname
                      : (comp.tw || comp.className || ''));
                      
            // Strip bracketed web-only classes [...] so Mobile Compiler ignores them completely
            const tw = typeof rawTw === 'string' ? rawTw.replace(/\[.*?\]/g, '').trim() : rawTw;

            // ── Auto-extract text color from className (e.g. text-red-100, text-white) ──
            const extractTextColorFromClass = (className) => {
                if (!className) return null;
                const match = className.match(/(?:^|\s)(text-[a-z]+-\d+|text-white|text-black)(?:\s|$)/);
                return match ? match[1] : null;
            };
            const inheritedTextColor = extractTextColorFromClass(tw);

            const explicitProps = comp.props ? { ...comp.props } : { ...comp, ...normAttributes };
            // PLATFORM FILTERING: skip target="web" elements in Mobile Compiler
            const _target = explicitProps.target || comp.target || explicitProps.platform || comp.platform || '';
            if (_target === 'web' || _target === 'browser') {
                return;
            }
            const twProps = ub.parseTW(tw);
            const styleProps = explicitProps.style || {};

            // PRIORITY: styleProps > explicitProps > twProps
            const props = { ...twProps, ...explicitProps, ...styleProps };
            
            // Fix: If a Tailwind class explicitly set a layout type (like Row, Column, Card),
            // it should override generic HTML tags like 'div', 'span', or a Babel-injected 'Container'.
            if (twProps.type && (explicitProps.type === 'div' || explicitProps.type === 'span' || explicitProps.type === 'Container' || !explicitProps.type)) {
                props.type = twProps.type;
            }
            // Deep-merge bindings so className DSL + explicit `bindings={{...}}` can coexist.
            // Priority: explicit bindings override tw bindings on key conflict.
            if (twProps.bindings || explicitProps.bindings || styleProps.bindings) {
                props.bindings = {
                    ...(twProps.bindings || {}),
                    ...(explicitProps.bindings || {}),
                    ...(styleProps.bindings || {}),
                };
            }
            if (compType && compType !== 'div') {
                // Do not let a generic 'Container' override a specific 'Row' or 'Column' from Tailwind
                if (compType === 'Container' && (twProps.type === 'Row' || twProps.type === 'Column')) {
                    // Keep props.type as Row or Column
                } else {
                    props.type = compType;
                }
            }
            if (props.id === 'ContactsScreen' || props.id === 'ChatListScreen' || props.type === 'Screen') {
                console.log(`[UniversalUIImporter] Compiling Screen: ${props.id}, type: ${props.type}, className: ${tw}, justify: ${props.justify}`);
            }

            // ── Native HTML Table, List & Divider Tags Mapping ──
            if (compType === 'hr' || compType === 'divider' || String(tw).includes('divider')) {
                compType = 'Column';
                props.type = 'Column';
                props.minHeight = 2;
                props.bg = 'slate-300';
            }
            if (compType === 'table' || compType === 'tbody' || compType === 'thead' || compType === 'tfoot') {
                compType = 'Column';
                props.type = 'Column';
                props.orientation = 'vertical';
            }
            if (compType === 'tr') {
                compType = 'Row';
                props.type = 'Row';
                props.orientation = 'horizontal';
            }
            if (compType === 'th' || compType === 'td') {
                compType = 'Column';
                props.type = 'Column';
                if (!String(tw).includes('flex-')) {
                    tw = (tw ? tw + ' ' : '') + 'flex-1';
                }
            }
            if (compType === 'ul' || compType === 'ol') {
                compType = 'Column';
                props.type = 'Column';
                props.orientation = 'vertical';
            }
            if (compType === 'li') {
                compType = 'Row';
                props.type = 'Row';
                props.orientation = 'horizontal';
            }

            // ── Bootstrap & Tailwind Flex Container Standard Flow ──
            // NOTE: flex-1, flex-auto, flex-none, flex-grow, flex-shrink, flex-wrap are sizing/growth
            // classes — they do NOT define direction. Only explicit direction classes trigger Row.
            const isFlexSizing = /\bflex-1\b|\bflex-auto\b|\bflex-none\b|\bflex-grow\b|\bflex-shrink\b|\bflex-wrap\b|\bflex-nowrap\b/.test(String(tw));
            const isExplicitFlexRow = String(tw).includes('d-flex') || String(tw).includes('flex-row') || String(tw).includes('flex-row-center') || String(tw).includes('flex-row-between') || String(tw).includes('flex-row-around') || String(tw).includes('flex-row-evenly') || String(tw).includes('flex-row-start') || String(tw).includes('flex-row-end');
            // Standalone 'flex' class (exact match) also triggers Row — but NOT flex-1 etc.
            const isStandaloneFlex = /\bflex\b/.test(String(tw)) && !isFlexSizing;
            if (isExplicitFlexRow || isStandaloneFlex) {
                if (!String(tw).includes('flex-column') && !String(tw).includes('flex-col') && !String(tw).includes('flex-vertical') && !String(tw).includes('flex-col-left')) {
                    props.type = 'Row';
                    props.orientation = 'horizontal';
                }
            }


            // ── DolphinCSS & Bootstrap Floating Label Container Folding ──
            const isFloatingContainer = String(tw).includes('floatinglabel') || String(tw).includes('form-floating') || String(tw).includes('floating-label');
            if (isFloatingContainer) {
                const children = props.children || (props.props && props.props.children) || comp.children || [];
                const arr = Array.isArray(children) ? children : (children ? [children] : []);
                let labelText = '';
                let inputType = 'text';
                let placeholderText = '';
                let stateKey = props.stateKey || props.name || '';

                const extractNodeText = (node) => {
                    if (!node) return '';
                    if (typeof node === 'string' || typeof node === 'number') return String(node);
                    if (Array.isArray(node)) return node.map(extractNodeText).join(' ');
                    if (typeof node === 'object') {
                        if (node.text) return String(node.text);
                        if (node.props && node.props.text) return String(node.props.text);
                        if (node.value !== undefined && node.value !== null) return String(node.value);
                        const children = node.children || (node.props && node.props.children);
                        if (children) return extractNodeText(children);
                    }
                    return '';
                };

                arr.forEach(c => {
                    if (!c) return;
                    const cType = (c.type || c.tagName || '').toLowerCase();
                    const cProps = c.props || c.attributes || {};
                    if (cType === 'label' || String(cProps.className || '').includes('label')) {
                        labelText = extractNodeText(c);
                    } else if (cType === 'input' || cType === 'textarea' || String(cProps.className || '').includes('input')) {
                        inputType = cProps.type || 'text';
                        placeholderText = cProps.placeholder || cProps.hint || '';
                        if (!stateKey) stateKey = cProps.id || cProps.name || cProps.stateKey || '';
                    }
                });

                if (labelText || inputType) {
                    compType = 'input';
                    props.type = 'TextField';
                    props.floatingLabel = labelText.trim();
                    props.label = labelText.trim();
                    props.placeholder = placeholderText;
                    props.inputType = inputType;
                    props.stateKey = stateKey;
                    props.children = [];
                }
            }

            // DEFAULT ORIENTATIONS for Native Components
            if (props.type === 'Row' && props.orientation === undefined) props.orientation = 'horizontal';
            if (props.type === 'Column' && props.orientation === undefined) props.orientation = 'vertical';

            // Extract spacing from both twProps and props
            const s = { t: 0, r: 0, b: 0, l: 0, mt: 0, mr: 0, mb: 0, ml: 0 };

            // Padding mapping
            const pVal = props.p !== undefined ? props.p : twProps.p;
            if (pVal !== undefined) { const ps = ub.parseSpacing(pVal); s.t = ps.t; s.r = ps.r; s.b = ps.b; s.l = ps.l; }
            if (twProps.pt !== undefined) s.t = twProps.pt;
            if (twProps.pr !== undefined) s.r = twProps.pr;
            if (twProps.pb !== undefined) s.b = twProps.pb;
            if (twProps.pl !== undefined) s.l = twProps.pl;
            if (props.pt !== undefined) s.t = props.pt;
            if (props.pr !== undefined) s.r = props.pr;
            if (props.pb !== undefined) s.b = props.pb;
            if (props.pl !== undefined) s.l = props.pl;

            // Margin mapping
            const mVal = props.m !== undefined ? props.m : twProps.m;
            if (mVal !== undefined) { const ms = ub.parseSpacing(mVal); s.mt = ms.t; s.mr = ms.r; s.mb = ms.b; s.ml = ms.l; }
            if (twProps.mt !== undefined) s.mt = twProps.mt;
            if (twProps.mr !== undefined) s.mr = twProps.mr;
            if (twProps.mb !== undefined) s.mb = twProps.mb;
            if (twProps.ml !== undefined) s.ml = twProps.ml;
            if (props.mt !== undefined) s.mt = props.mt;
            if (props.mr !== undefined) s.mr = props.mr;
            if (props.mb !== undefined) s.mb = props.mb;
            if (props.ml !== undefined) s.ml = props.ml;

            const bin = Buffer.alloc(24);

            if (String(tw).includes('flex-row-between')) {
            }

            // Byte 1: Type Code
            let typeCode = this.getComponentCode(props.type || compType);
            const isGridClass = String(tw).includes('grid') || String(tw).includes('grid-cols-') || props.type === 'GridView' || props.type === 'Grid' || compType === 'GridView' || compType === 'Grid';
            if (isGridClass && (typeCode === 0x12 || typeCode === 0x13 || typeCode === 0x14)) {
                typeCode = 0x22; // Upgrade container/column/row to GridView opcode (0x22)
            }
            bin[1] = typeCode & 0xFF;

            const isTextType = (typeCode === 0x1D || typeCode === 0x16 || typeCode === 0x10 || typeCode === 0x23);

            // Inherit text color if not explicitly defined on text element
            if (isTextType && !props.color && !props.textColor && inheritedColor) {
                props.color = inheritedColor.replace('text-', '');
            }

            // Byte 0: Gravity (0-3) | Flex (4-7)
            // For text elements, gravity controls text alignment (left/center/right)
            // For containers, gravity controls child alignment
            let gravity = 0x01; // default: start/left

            if (isTextType) {
                // Button (0x10) defaults to center alignment (0x02), Text defaults to left (0x01)
                if (typeCode === 0x10) {
                    if (props.align === 'left' || props.align === 'start') gravity = 0x01;
                    else if (props.align === 'right' || props.align === 'end') gravity = 0x03;
                    else gravity = 0x02; // center for buttons!
                } else {
                    if (props.align === 'center') gravity = 0x02;
                    else if (props.align === 'right' || props.align === 'end') gravity = 0x03;
                    else gravity = 0x01; // left/start
                }
            } else {
                // Container alignment: props.items from 'items-center', etc.
                if (props.items) {
                    gravity = props.items === 'center' ? 0x02 : (props.items === 'end' ? 0x03 : 0x01);
                } else {
                    // Fallback string matching for explicitly written classes
                    if (String(tw).includes('items-center') || String(tw).includes('flex-center') || String(tw).includes('center')) gravity = 0x02;
                    else if (String(tw).includes('items-end') || String(tw).includes('flex-right') || String(tw).includes('flex-end') || String(tw).includes('right')) gravity = 0x03;
                    else gravity = 0x01;
                }
            }
            const flex = Math.min(props.flex !== undefined ? props.flex : (twProps.flex !== undefined ? twProps.flex : (String(tw).includes('flex-1') ? 1 : 0)), 15);
            bin[0] = gravity | (flex << 4);

            // Byte 2: Shade
            let bg = props.backgroundColor || props.bg || twProps.bg;
            if (bg && bg !== 'transparent') {
                const shadeVal = props.bgShade || props.shade;
                if (shadeVal && !String(bg).includes('-')) {
                    bg = `${bg}-${shadeVal}`;
                }
            }
            if (typeCode === 0x10 && (!bg || bg === 'transparent') && !String(tw).includes('outlined') && !String(tw).includes('plain')) {
                bg = 'indigo-140';
            }
            if (!bg && isTextType && typeCode !== 0x10) bg = 'transparent';
            bin[2] = ub.getShade(bg || 'transparent');

            // Byte 3: Color
            bin[3] = ub.getColor(bg || 'transparent');

            // Bytes 4-7: Padding (T, R, B, L)
            bin[4] = s.t; bin[5] = s.r; bin[6] = s.b; bin[7] = s.l;

            // Bytes 8-11: Margin (T, R, B, L)
            bin[8] = s.mt; bin[9] = s.mr; bin[10] = s.mb; bin[11] = s.ml;

            // Byte 12: Contextual Packing
            const speed = Math.min(props.animationSpeed || 4, 7);

            // ─── EXTRACT TEXT CONTENT ───
            const rawChildren = props.children || (props.props && props.props.children) || comp.children || [];
            const childArr = (Array.isArray(rawChildren) ? rawChildren : (rawChildren ? [rawChildren] : [])).filter(c => {
                if (c && typeof c === 'object') {
                    if (c.type === 'text') {
                        const val = String(c.value || '').trim();
                        if (!val || val.startsWith('{/*') || val.startsWith('/*') || val.startsWith('//')) return false;
                    }
                    const rawA = c.attributes || {};
                    const normA = {};
                    Object.keys(rawA).forEach(k => { normA[k.toLowerCase()] = rawA[k]; });
                    const cp = c.props ? { ...c.props } : { ...normA, ...c };
                    const ct = cp.target || c.target || cp.platform || c.platform || '';
                    if (ct === 'web' || ct === 'browser') return false;
                }
                return true;
            });

            // Translate ring to native border before signature calculation
            if (props.ringWidth) {
                props.borderWidth = props.ringWidth + 'px';
                props.borderStyle = 'solid';
                props.borderColor = props.ringColor || 'blue-500';
            }

            // Translate divide to child native borders
            if (props.divide) {
                let validChildIndex = 0;
                childArr.forEach(child => {
                    if (child && typeof child === 'object' && child.type) {
                        if (validChildIndex > 0) {
                            child.props = child.props || {};
                            if (props.divide === 'y') {
                                child.props.borderWidth = '1px 0px 0px 0px';
                            } else if (props.divide === 'x') {
                                child.props.borderWidth = '0px 0px 0px 1px';
                            }
                            child.props.borderStyle = 'solid';
                            child.props.borderColor = props.divideColor || 'slate-200';
                        }
                        validChildIndex++;
                    }
                });
            }

            if (isTextType) {
                let textColor = props.color || props.textColor;
                if (textColor && textColor !== 'transparent') {
                    const shadeVal = props.colorShade || props.shade;
                    if (shadeVal && !String(textColor).includes('-')) {
                        textColor = `${textColor}-${shadeVal}`;
                    }
                }
                const shade = ub.getShade(textColor || 'white');
                let shadeSentinel = Math.floor(shade / 8) & 0x1F;
                if (shade === 254) shadeSentinel = 31;
                if (shade === 253) shadeSentinel = 30;
                if (shade === 252) shadeSentinel = 29;
                // Byte 12: [Speed 3 bits | Shade 5 bits]
                bin[12] = (shadeSentinel & 0x1F) | ((speed & 0x07) << 5);
            } else {
                const activeGap = props.gap !== undefined ? props.gap : twProps.gap;
                const isGrid = bin[1] === 0x22 || isGridClass;
                if (isGrid) {
                    let cols = props.columns || 2;
                    const gridColMatch = String(tw).match(/grid-cols-(\d+)/);
                    if (gridColMatch) cols = parseInt(gridColMatch[1]) || 2;
                    let gapVal = 0;
                    const gapMatch = String(tw).match(/gap-(\d+)/);
                    if (gapMatch) {
                        gapVal = parseInt(gapMatch[1]) || 0;
                    } else if (activeGap !== undefined) {
                        gapVal = Math.floor(activeGap / 4);
                    }
                    bin[12] = (cols & 0x0F) | ((Math.min(gapVal, 15) & 0x0F) << 4);
                } else {
                    const gapVal = Math.min(Math.floor((activeGap || 0) / 4), 15);
                    let orientation = (props.type === 'Row' || props.orientation === 'horizontal' || String(tw).includes('flex-row')) ? 1 : 0;
                    bin[12] = (orientation & 0x0F) | ((gapVal & 0x0F) << 4);
                }
            }

            // Note: justify-between and justify-around spacing is handled by Native Android
            // via the 0x20 signature bit. We don't inject spacers manually here.
            const justifyMode = props.justify || (String(tw).includes('justify-between') || String(tw).includes('flex-between') ? 'between' : String(tw).includes('justify-around') || String(tw).includes('flex-around') ? 'around' : null);


            // Recursive helper to flatten all text content
            const flattenText = (items) => {
                return items.map(c => {
                    if (typeof c === 'string' || typeof c === 'number') return String(c);
                    if (c && typeof c === 'object') {
                        if (c.text) return c.text;
                        if (c.props && c.props.text) return c.props.text;
                        if (c.value !== undefined && c.value !== null) return String(c.value);
                        const nested = c.children || (c.props && c.props.children) || [];
                        if (nested) return flattenText(Array.isArray(nested) ? nested : [nested]);
                    }
                    return '';
                }).filter(Boolean).join(' ');
            };

            if (isTextType && !props.text && !props.content) {
                props.text = flattenText(childArr).trim();
            }

            if (props.text) {
                console.log(`   [UI] ${props.type} text extracted: "${props.text}"`);
                if (typeof props.text === 'string' && props.text.includes('[stateKey:')) {
                    const match = props.text.match(/\[stateKey:([a-zA-Z0-9_$]+)\]/);
                    if (match) {
                        if (!props.bindings) props.bindings = {};
                        props.bindings.text = match[1];
                        console.log(`   ✨ [NanoStore Binding] Extracted text binding: "${match[1]}" for component ${props.type}`);
                    }
                }
            }

            // Byte 13: Text Color / Child Count
            if (isTextType) {
                let textColor = props.color || props.textColor || twProps.color || twProps.textColor;
                if (textColor && textColor !== 'transparent') {
                    const shadeVal = props.colorShade || props.shade;
                    if (shadeVal && !String(textColor).includes('-')) {
                        textColor = `${textColor}-${shadeVal}`;
                    }
                }
                bin[13] = ub.getColor(textColor);
            } else {
                // Count exactly the same children that will be recursively processed
                let count = 0;
                childArr.forEach(child => {
                    if (child && typeof child === 'object' && child.type) {
                        count++;
                    } else if (typeof child === 'string' && child.trim().length > 0) {
                        count++;
                    }
                });
                bin[13] = count & 0xFF;
            }

            // Byte 14: Radius (Full 8 bits)
            bin[14] = (props.borderRadius || props.radius || 0) & 0xFF;

            // Byte 15: Signature / Animation / Gradient Bits
            // Bit 0: Gradient | Bit 4: Animation ACTIVE (0x10) | Bit 7: Loop
            const mobileTwClass = String(tw || '').replace(/\[.*?\]/g, '');
            const hasAnim = Boolean(props.animation || twProps.animation || mobileTwClass.includes('animate-') || mobileTwClass.includes('framer-'));
            let sig = hasAnim ? 0x10 : 0;

            if (props.scrollX || props.overflowX === 'scroll' || props.overflowX === 'auto' || mobileTwClass.includes('scroll-x') || mobileTwClass.includes('overflow-x-auto') || mobileTwClass.includes('overflow-x-scroll')) {
                sig |= 0x02;
                // Upgrade Container, Row, Column, or Table to Native Horizontal ListView for horizontal scroll support (opcode 0x20)
                if (bin[1] === 0x12 || bin[1] === 0x13 || bin[1] === 0x14) {
                    bin[1] = 0x20;
                }
            } else if (props.scrollable || props.scroll || props.overflow === 'scroll' || props.scrollY || mobileTwClass.includes('scroll-y') || mobileTwClass.includes('scrollable')) {
                sig |= 0x02;
                // Upgrade Container or Column to Native ListView for scroll support
                if (bin[1] === 0x12 || bin[1] === 0x13 || bin[1] === 0x14) {
                    bin[1] = 0x1E;
                }
            }
            if (props.gradient) sig |= 0x01;
            
            // Bit 2: Explicit Border flag — ignore 'none', '0', '0px'
            const hasValidBorder = (b, bw, bc, twStr) => {
                if (String(twStr || '').includes('border') && !String(twStr || '').includes('border-none')) return true;
                if (b === true || b === 'true') return true;
                if (b && b !== 'none' && b !== '0' && b !== '0px' && b !== 0) return true;
                if (bw && bw !== '0' && bw !== '0px' && bw !== 0) return true;
                if (bc && bc !== 'transparent' && bc !== 'none' && bc !== '0') return true;
                if (String(props.className || '').includes('border') && !String(props.className || '').includes('border-none')) return true;
                return false;
            };
            if (hasValidBorder(props.border, props.borderWidth, props.borderColor, tw)) sig |= 0x04;
            if (props.justify === 'between' || String(tw).includes('justify-between') || String(tw).includes('flex-between')) sig |= 0x20;
            if (props.swipeable || props.swipe || mobileTwClass.includes('swipeable') || props.type === 'Screen' || compType === 'Screen') sig |= 0x40;

            // Bit 3: Dynamic Styling — only activate when bindings are genuinely present
            const hasBindings = props.bindings && typeof props.bindings === 'object' && Object.keys(props.bindings).length > 0;
            if (hasBindings) sig |= 0x08;

            bin[15] = sig;
            bin[23] = sig;

            console.log(`   [UI] Opcode: 0x${bin[1].toString(16)}, Byte15(Sig): ${bin[15].toString(16)}, Byte12(Shade/Grav): ${bin[12]}, Byte13(Color/Count): ${bin[13]}`);
            binaries.push(bin);

            // Byte 16+: String Data (width|height|elevation, then component specific)
            let w = props.width !== undefined ? props.width : (twProps.width !== undefined ? twProps.width : 0);
            if (!w && (compType === 'card' || String(tw).includes('card') || String(tw).includes('w-full') || String(tw).includes('w-100') || String(tw).includes('w-screen'))) {
                w = -1;
            }
            if (typeof w === 'string') {
                if (w.includes('%') || w.includes('vw') || w === 'full') w = -1;
                else w = parseInt(w.replace(/[^0-9-]/g, '')) || 0;
            }
            if (typeCode === 0x18 && w === 0) {
                w = -1; // Default Input/TextField to 100% width (MATCH_PARENT)
            }
            let h = props.height !== undefined ? props.height : (twProps.height !== undefined ? twProps.height : 0);
            if (!h && (String(tw).includes('h-full') || String(tw).includes('h-screen') || String(tw).includes('h-100') || String(tw).includes('min-h-screen') || String(tw).includes('min-h-full'))) {
                h = -1;
            }
            if (typeof h === 'string') {
                if (h.includes('%') || h.includes('vh') || h === 'full') h = -1;
                else h = parseInt(h.replace(/[^0-9-]/g, '')) || 0;
            }
            const elevation = props.elevation || (String(tw).includes('shadow-sm') ? 2 : (String(tw).includes('shadow-lg') ? 8 : (String(tw).includes('shadow-xl') ? 12 : (String(tw).includes('shadow-2xl') ? 16 : (String(tw).includes('shadow') ? 4 : 0)))));
            const size = props.size || 0;
            stringPool.push(`${Math.round(w)}|${Math.round(h)}|${Math.round(elevation)}|${Math.round(size)}`);

            // Advanced Feature Strings (Gradient, Animation) pushed after size
            if (sig & 0x01) {
                const rawGrad = props.gradient || '';
                stringPool.push(ub.normalizeGradient(rawGrad));
            }

            if (sig & 0x04) {
                let bWidth = "1px", bStyle = "solid", bColor = "#e2e8f0";
                if (props.border && typeof props.border === 'string' && props.border !== 'none') {
                    const parts = props.border.split(' ');
                    if (parts[0]) bWidth = parts[0];
                    if (parts[1]) bStyle = parts[1];
                    if (parts[2]) bColor = parts.slice(2).join(' ');
                }
                if (props.borderColor) bColor = props.borderColor;
                if (props.borderWidth) bWidth = props.borderWidth;
                if (props.borderStyle) bStyle = props.borderStyle;

                let hexColor = bColor;
                if (bColor && !bColor.startsWith('#') && !bColor.startsWith('rgb')) {
                    const resolved = ub && ub.resolveColorToHex ? ub.resolveColorToHex(bColor) : null;
                    if (resolved && typeof resolved === 'string' && resolved.startsWith('#')) {
                        hexColor = resolved;
                    } else if (bColor.includes('slate-200') || bColor.includes('gray-200') || bColor.includes('zinc-200')) {
                        hexColor = '#cbd5e1';
                    } else if (bColor.includes('slate-700') || bColor.includes('gray-700')) {
                        hexColor = '#334155';
                    } else if (bColor.includes('blue-500') || bColor.includes('blue-600')) {
                        hexColor = '#2563eb';
                    } else {
                        hexColor = '#cbd5e1';
                    }
                }
                stringPool.push(`${bWidth}|${bStyle}|${hexColor}`);
            }

            if (sig & 0x08) {
                if (props.bindings && typeof props.bindings === 'object') {
                    const descriptor = Object.entries(props.bindings)
                        .map(([prop, key]) => {
                            const finalProp = prop === 'text' ? 'textColor' : prop;
                            return `${finalProp}:${key}`;
                        })
                        .join('|');
                    stringPool.push(descriptor);
                } else {
                    stringPool.push('');
                }
            }

            if (sig & 0x10) {
                let animStr = props.animation || twProps.animation || (mobileTwClass.match(/animate-([a-z0-9-]+)/)?.[0]) || '';
                stringPool.push(animStr);
            }

            switch (typeCode) {
                case 0x1D: // AppBar: action, title
                    stringPool.push(props.action || '');
                    let appTitle = props.title || props.text || '';
                    stringPool.push(appTitle || flattenText(childArr).trim());
                    break;
                case 0x16: // Text: content (or stateKey binding)
                    if (props.stateKey) {
                        // Explicit stateKey prop — use initial prop, or children text, or ''
                        let initVal = props.initial !== undefined ? props.initial : '';
                        if (initVal === '' || initVal === 0) {
                            // Try children text as fallback
                            const childTxt = flattenText(childArr).trim();
                            if (childTxt && !childTxt.includes('[stateKey:')) {
                                initVal = childTxt;
                            }
                        }
                        stringPool.push(`stateKey:${props.stateKey}|${initVal}`);
                    } else {
                        let txt = props.text || props.content || '';
                        if (!txt) txt = flattenText(childArr).trim();

                        // Detect [stateKey:key] inside text
                        if (txt && typeof txt === 'string' && txt.includes('[stateKey:')) {
                            const match = txt.match(/\[stateKey:(.*?)\]/);
                            if (match) {
                                const key = match[1];
                                if (txt.trim() === `[stateKey:${key}]`) {
                                    // No surrounding text — use props.initial or children as default
                                    const fallbackInit = props.initial !== undefined ? props.initial : '';
                                    stringPool.push(`stateKey:${key}|${fallbackInit}`);
                                } else {
                                    // Surrounding text present — pass as-is, ViewFactory handles regex extraction
                                    stringPool.push(txt);
                                }
                            } else {
                                stringPool.push(txt);
                            }
                        } else {
                            const finalTxt = String(txt || '');
                            // Safety: Ensure text content never looks like a meta string accidentally (e.g. 0|0|0|0)
                            // This prevents the runtime from misinterpreting text as layout metadata.
                            if (finalTxt.match(/^\d+\|\d+\|\d+\|\d+$/)) {
                                stringPool.push(" " + finalTxt);
                            } else {
                                stringPool.push(finalTxt);
                            }
                        }
                    }
                    break;

                case 0x10: // Button: action, text, icon
                    stringPool.push(props.action || '');
                    stringPool.push(props.text || flattenText(childArr).trim() || '');
                    const btnIcon = props.icon || props.iconName || props.iconLeft || props.iconRight || twProps.icon || twProps.iconLeft || (String(props.className || '').match(/\b(fa-[a-z0-9-]+|bi-[a-z0-9-]+|ri-[a-z0-9-]+|icon-[a-z0-9-]+)\b/i) || [])[1] || '';
                    stringPool.push(btnIcon);
                    break;
                case 0x12: // Container: action
                case 0x13: // Column: action
                case 0x14: // Row: action
                case 0x11: // Card: action
                case 0x15: // Stack: action  ← was missing!
                case 0x20: // Modal: action  ← was missing!
                case 0x21: // Form: action   ← was missing!
                case 0x22: // GridView: action ← was missing!
                case 0x1E: // ListView: action
                    stringPool.push(props.action || props.onClick || '');
                    break;
                case 0x1A: // Switch: action/stateKey, label
                    stringPool.push(props.stateKey || props.action || '');
                    stringPool.push(props.label || '');
                    break;
                case 0x19: // Slider: action/stateKey, label
                    stringPool.push(props.stateKey || props.action || '');
                    stringPool.push(props.label || '');
                    break;
                case 0x1B: // Checkbox: action/stateKey, label
                case 0x1F: // Radio: action/stateKey, label
                    stringPool.push(props.stateKey || props.action || '');
                    stringPool.push(props.label || '');
                    break;

                case 0x40: // File Upload: action, label
                    stringPool.push(props.action || '');
                    stringPool.push(props.label || '');
                    break;
                case 0x1C: // Select: action/stateKey, label, options, initialValue
                    stringPool.push(props.stateKey || props.action || '');
                    stringPool.push(props.label || '');
                    stringPool.push(Array.isArray(props.options) ? props.options.join(',') : (props.options || ''));
                    stringPool.push(props.value || '');
                    break;
                case 0x30: // Camera
                case 0x31: // Microphone
                case 0x32: // Location
                case 0x33: // Bluetooth
                case 0x34: // Haptics
                case 0x35: // Battery
                case 0x36: // Sensors
                case 0x37: // WebRTCVideo
                case 0x38: // WebRTCAudio
                    stringPool.push(props.stateKey || props.action || '');
                    stringPool.push(props.config || '');
                    break;
                case 0x50: // VideoPlayer: action, url
                    const action = props.action || '';
                    const videoSrc = props.src || props.url || '';
                    stringPool.push(action);
                    stringPool.push(videoSrc);
                    break;

                case 0x17: // Image: src
                    const imgSrc = typeof props.src === 'object' ? (props.src.uri || props.src.default || '') : (typeof props.source === 'object' ? (props.source.uri || props.source.default || '') : (props.src || props.source || props.url || ''));
                    stringPool.push(String(imgSrc || ''));
                    break;
                case 0x23: // Icon: iconName
                    const iconVal = props.icon || props.name || props.iconName || props.iconLeft || twProps.icon || twProps.iconLeft || (String(props.className || explicitProps.className || (comp.props && comp.props.className) || comp.className || tw || '').match(/\b(fa-[a-z0-9-]+|bi-[a-z0-9-]+|ri-[a-z0-9-]+|icon-[a-z0-9-]+)\b/i) || [])[1] || '';
                    stringPool.push(iconVal);
                    break;
                case 0x18: // TextField: stateKey, label, hint, type, variant, icon
                    stringPool.push(props.stateKey || props.statekey || props.name || props.id || '');
                    stringPool.push(props.label || '');
                    stringPool.push(props.hint || props.placeholder || '');
                    stringPool.push(props.inputType || props.type || 'text');
                    stringPool.push(props.variant || props.varient || (String(props.className || tw || '').includes('filled') ? 'filled' : (String(props.className || tw || '').includes('standard') ? 'standard' : 'outlined')));
                    let iconL = props.icon || props.iconLeft || props.startIcon || '';
                    let iconR = props.iconRight || props.endIcon || '';
                    let iconColorL = ub.resolveColorToHex(props.iconColor || props.iconColorLeft || props.startIconColor || '');
                    let iconColorR = ub.resolveColorToHex(props.iconColorRight || props.endIconColor || '');
                    let iconSize = props.iconSize || '';
                    stringPool.push(`${iconL}|${iconR}|${iconColorL}|${iconColorR}|${iconSize}`);
                    break;

                default:
                    // Generic Metadata Payload for Custom Native Plugins
                    if (typeCode >= 0x60 && typeCode <= 0x7F) {
                        stringPool.push(props.meta || props.config || '');
                    }
                    break;
            }

            // ─── RECURSIVE PROCESSING (Containers Only) ───
            // Use the same childArr built above to guarantee count == recursion iterations.
            // Leaf nodes (Text, Button, Image, etc.) should NOT have their children processed
            // as separate Titan 16-byte blocks. This maintains strict binary alignment.
            const CONTAINER_TYPES = new Set([
                'Screen', 'screen', 'div', 'Column', 'Row', 'Card', 'Container', 'ListView', 'GridView', 'Modal', 'Form', 'Stack',
                'div', 'ul', 'li', 'ol', 'form', 'a', 'section', 'header', 'footer', 'main', 'span', 'p',
                'table', 'tbody', 'thead', 'tfoot', 'tr', 'th', 'td',
                'column', 'row', 'card', 'container', 'listview', 'gridview', 'modal', 'form', 'stack'
            ]);
            if ((CONTAINER_TYPES.has(props.type) || CONTAINER_TYPES.has(compType)) && !isTextType) {
                const activeInheritedColor = inheritedTextColor || inheritedColor;
                childArr.forEach(child => {
                    if (child && typeof child === 'object' && child.type) {
                        process(child, activeInheritedColor);
                    } else if (typeof child === 'string' && child.trim().length > 0) {
                        // Auto-wrap raw strings in Text component
                        // Inherit text color from parent container's className (e.g. text-red-100)
                        const textProps = { text: child };
                        if (activeInheritedColor) {
                            // Parse color name from class like "text-red-100" → color: "red-100"
                            textProps.color = activeInheritedColor.replace('text-', '');
                        }
                        process({ type: 'Text', props: textProps });
                    }
                });
            }
        };

        process(schema);

        return {
            binaries,
            stringData: Buffer.from(stringPool.length > 0 ? stringPool.join('\0') + '\0' : '', 'utf8')
        };
    }

    /**
     * Import an array of Titan Nodes (from BinCSS/StreamProcessor)
     */
    importTitanNodes(nodes, options = {}) {
        const binaries = [];
        const stringPool = [];

        nodes.forEach(node => {
            const bin = Buffer.alloc(24);

            // Byte 1: Type
            const typeCode = this.getComponentCode(node.type || node.tagName);
            bin[1] = typeCode;

            // Byte 0: Gravity/Flex (BinCSS nodes usually have absolute x/y, but we map them)
            bin[0] = 0x01; // Default gravity

            // Style mapping from BinCSS node.styles
            const styles = node.styles || {};

            // Byte 2 & 3: Color/Shade from backgroundColor
            const bgColor = styles.backgroundColor || 'transparent';
            bin[2] = ub.getShade(bgColor);
            bin[3] = ub.getColor(bgColor);

            // Bytes 4-11: Spacing
            const p = ub.parseSpacing(styles.padding);
            const m = ub.parseSpacing(styles.margin);
            bin[4] = p.t; bin[5] = p.r; bin[6] = p.b; bin[7] = p.l;
            bin[8] = m.t; bin[9] = m.r; bin[10] = m.b; bin[11] = m.l;

            // Byte 13: Text Color / Child Count
            if (node.isText || node.isButton) {
                bin[13] = ub.getColor(styles.color || '#000000');
            } else {
                bin[13] = (node.children ? node.children.length : 0) & 0xFF;
            }

            // Byte 14: Radius
            bin[14] = parseInt(styles.borderRadius) || 0;

            // Byte 15: Signature
            let sig = 0x00;
            if (styles.border || styles.borderColor || styles.borderWidth) sig |= 0x04;
            bin[15] = sig;
            bin[23] = sig;

            binaries.push(bin);

            // String Data Alignment
            const w = node.w || 0;
            const h = node.h || 0;
            const x = node.x || 0;
            const y = node.y || 0;

            // We use the string pool to store coordinates and sizes for absolute positioning
            stringPool.push(`${x}|${y}|${w}|${h}`);

            if (sig & 0x04) {
                let bWidth = "1px", bStyle = "solid", bColor = "#cccccc";
                if (styles.border && typeof styles.border === 'string' && styles.border !== 'none') {
                    const parts = styles.border.split(' ');
                    if (parts[0]) bWidth = parts[0];
                    if (parts[1]) bStyle = parts[1];
                    if (parts[2]) bColor = parts.slice(2).join(' ');
                }
                if (styles.borderColor) bColor = styles.borderColor;
                if (styles.borderWidth) bWidth = styles.borderWidth;
                if (styles.borderStyle) bStyle = styles.borderStyle;
                stringPool.push(`${bWidth}|${bStyle}|${bColor}`);
            }

            // Component specific strings
            if (node.isText || node.isButton) {
                stringPool.push(node.text || '');
            } else if (node.isImage) {
                stringPool.push(node.src || '');
            } else {
                stringPool.push(''); // Placeholder
            }
        });

        return {
            binaries,
            stringData: Buffer.from(stringPool.length > 0 ? stringPool.join('\0') + '\0' : '', 'utf8')
        };
    }

    getComponentCode(type) {
        if (!type) return 0x12; // Default to Container

        let typeStr = type;
        if (typeof type === 'function') {
            typeStr = type.name || '';
        }

        const cleanType = String(typeStr).toLowerCase();
        if (cleanType === 'card' || cleanType === 'cardview' || cleanType === 'card-view') return 0x11;

        const map = {
            // Native/Flutter Style
            'Button': 0x10,
            'Card': 0x11,
            'Container': 0x12,
            'Column': 0x13,
            'Row': 0x14,
            'View': 0x12, // Alias for Container
            'Stack': 0x15,
            'Text': 0x16,
            'Image': 0x17,
            'Icon': 0x23,
            'TextField': 0x18,
            'Slider': 0x19,
            'VideoPlayer': 0x50, // Custom Plugin
            'Switch': 0x1A,
            'Checkbox': 0x1B,
            'Select': 0x1C,
            'AppBar': 0x1D,
            'ListView': 0x1E,
            'ViewPager': 0x24,
            'Pager': 0x24,
            'GridView': 0x22, // Move GridView to 0x22 to avoid conflict with Radio
            'Radio': 0x1F,
            'RadioButton': 0x1F,
            'Modal': 0x20,
            'Form': 0x21,

            // HTML Style
            'div': 0x12,
            'i': 0x23,
            'header': 0x1D, // Map HTML header to AppBar
            'span': 0x16, // Treat span as Text
            'p': 0x16, // Treat p as Text
            'h1': 0x16, 'h2': 0x16, 'h3': 0x16, 'h4': 0x16, 'h5': 0x16, 'h6': 0x16,
            'ul': 0x13, // Treat ul as Column
            'li': 0x14, // Treat li as Row
            'ol': 0x13,
            'table': 0x13, // Treat table as Column (vertical stack of rows)
            'tbody': 0x13,
            'thead': 0x13,
            'tfoot': 0x13,
            'tr': 0x14, // Treat tr as Row (horizontal stack of cells)
            'th': 0x13, // Treat th as Cell Column
            'td': 0x13, // Treat td as Cell Column
            'a': 0x12,
            'img': 0x17,
            'video': 0x50,
            'button': 0x10,

            'input': 0x18,

            // IoT / Hardware
            'FileUpload': 0x40,
            'Camera': 0x30,
            'Microphone': 0x31,
            'Location': 0x32,
            'Bluetooth': 0x33,
            'Haptics': 0x34,
            'Battery': 0x35,
            'Sensors': 0x36,
            'WebRTCVideo': 0x37,
            'WebRTCAudio': 0x38
        };
        // Handle case-insensitive matching for HTML tags
        const normalized = (typeof typeStr === 'string') ? typeStr.toLowerCase() : '';
        const foundKey = Object.keys(map).find(k => k.toLowerCase() === normalized);
        if (foundKey) return map[foundKey];

        // Support custom opcodes directly from JSX (e.g. type="0x7F")
        if (typeof typeStr === 'string' && typeStr.startsWith('0x')) { require('fs').appendFileSync('opcode_debug.log', 'HIT OPCODE: ' + typeStr + '\n');
            return parseInt(typeStr, 16);
        }

        return map[typeStr] || 0x12;
    }

    _convertSingleComponent(schema, platform = 'UNIVERSAL') {
        const result = this.importSchema(schema);
        return result.binaries[0] || Buffer.alloc(24);
    }
}

module.exports = UniversalUIImporter;
