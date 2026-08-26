/**
 * DOMScraperEngine.js
 * 
 * Dynamic Browser DOM Scraper for Dolphin Native (Dynamic UI Copier Plugin)
 * Powered by DolphinTitan Engine (D:\bincss\src\core\Engine.js).
 * Extracts computed styles via `window.getComputedStyle()` from any rendered web UI
 * (DolphinCSS, Bootstrap, Tailwind, MUI, Ant Design) and converts them into Titan AST Nodes.
 */

const { errorPipeline } = require('../../errors/ErrorPipeline');

errorPipeline.registerFile('DOMScraperEngine.js', __filename);

class DOMScraperEngine {
    constructor(options = {}) {
        this.maxNodes = options.maxNodes || 5000;
        this.nodes = [];
    }

    /**
     * Waits for CDN stylesheets to finish loading and applying styles.
     */
    async waitForCDNStyles(container, maxWaitMs = 2000) {
        const startTime = Date.now();
        return new Promise((resolve) => {
            const check = () => {
                const elapsed = Date.now() - startTime;
                const stylesheets = Array.from(document.styleSheets);
                let ready = true;

                for (const sheet of stylesheets) {
                    try {
                        if (!sheet.cssRules && !sheet.rules) {
                            ready = false;
                        }
                    } catch (e) {
                        // CORS restricted stylesheet
                    }
                }

                if (ready || elapsed >= maxWaitMs) {
                    resolve();
                } else {
                    setTimeout(check, 50);
                }
            };
            check();
        });
    }

    /**
     * Scrapes all rendered elements inside a container element using `window.getComputedStyle()`.
     */
    async scrapeContainer(containerElement) {
        try {
            if (!containerElement) {
                throw new Error('DOMScraperEngine: Target container element is null or undefined.');
            }

            await this.waitForCDNStyles(containerElement);

            this.nodes = [];
            const containerRect = containerElement.getBoundingClientRect();
            const allElements = containerElement.querySelectorAll('*');

            for (let i = 0; i < allElements.length; i++) {
                if (this.nodes.length >= this.maxNodes) break;
                const el = allElements[i];
                const nodeAST = this._extractNodeAST(el, containerElement, containerRect, i);
                if (nodeAST) {
                    this.nodes.push(nodeAST);
                }
            }

            return this.nodes;
        } catch (error) {
            errorPipeline.capture(error, {
                file: 'DOMScraperEngine.js',
                function: 'scrapeContainer',
                severity: 'error'
            });
            throw error;
        }
    }

    /**
     * Extracts computed styles for a single DOM element into a Titan AST Node.
     */
    _extractNodeAST(el, containerElement, containerRect, index) {
        const style = window.getComputedStyle(el);

        // Ignore hidden or non-rendered elements
        if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity || '1') === 0) {
            return null;
        }

        const rect = el.getBoundingClientRect();
        if (rect.width <= 1 && rect.height <= 1) {
            return null;
        }

        // Relative positioning to parent container
        const x = Math.round(rect.left - containerRect.left);
        const y = Math.round(rect.top - containerRect.top);
        const width = Math.round(rect.width);
        const height = Math.round(rect.height);

        // Skip elements rendered outside container bounds
        if (x < 0 || y < 0 || x > containerRect.width || y > containerRect.height) {
            return null;
        }

        // Colors & Backgrounds
        const bgHex = this._rgbToHex(style.backgroundColor);
        const textHex = this._rgbToHex(style.color);
        const borderHex = this._rgbToHex(style.borderColor);

        // Dimensions & Metrics
        const borderRadius = parseInt(style.borderRadius, 10) || 0;
        const borderWidth = parseInt(style.borderWidth, 10) || 0;
        const fontSize = parseInt(style.fontSize, 10) || 14;
        const paddingLeft = parseInt(style.paddingLeft, 10) || 0;
        const paddingTop = parseInt(style.paddingTop, 10) || 0;
        const paddingRight = parseInt(style.paddingRight, 10) || 0;
        const paddingBottom = parseInt(style.paddingBottom, 10) || 0;

        const tagName = el.tagName.toUpperCase();
        const classes = Array.from(el.classList);
        const inputTypeAttr = (el.getAttribute('type') || '').toLowerCase();

        // Detect DolphinCSS visual effects and background gradients
        let gradientStr = '';
        const bgImage = style.backgroundImage || '';
        if (classes.includes('fx-aurora') || classes.includes('aurora')) gradientStr = 'gradient-aurora';
        else if (classes.includes('fx-cyber') || classes.includes('cyber')) gradientStr = 'gradient-cyber';
        else if (classes.includes('fx-neon') || classes.includes('neon')) gradientStr = 'gradient-neon';
        else if (classes.includes('fx-glass') || classes.includes('glass') || (style.backdropFilter && style.backdropFilter.includes('blur'))) gradientStr = 'gradient-glass';
        else if (classes.includes('fx-metal') || classes.includes('metal')) gradientStr = 'gradient-metal';
        else if (classes.includes('fx-flare') || classes.includes('flare')) gradientStr = 'gradient-flare';
        else if (classes.includes('fx-crystal') || classes.includes('crystal')) gradientStr = 'gradient-crystal';
        else if (bgImage.includes('gradient')) gradientStr = bgImage;

        // Classify Element Type & Titan Opcode
        let opcode = 0x12; // Default Container
        let typeName = 'Container';

        if (tagName === 'BUTTON' || classes.includes('btn') || classes.includes('filled') || classes.includes('MuiButton-root')) {
            opcode = 0x10;
            typeName = 'Button';
        } else if (tagName === 'INPUT' && inputTypeAttr === 'checkbox') {
            opcode = 0x1B;
            typeName = 'Checkbox';
        } else if (tagName === 'INPUT' && inputTypeAttr === 'radio') {
            opcode = 0x1F;
            typeName = 'Radio';
        } else if (tagName === 'SELECT' || classes.includes('select')) {
            opcode = 0x1C;
            typeName = 'Select';
        } else if (tagName === 'INPUT' || tagName === 'TEXTAREA' || classes.includes('form-control') || classes.includes('MuiTextField-root')) {
            opcode = 0x18;
            typeName = 'TextField';
        } else if (classes.includes('card') || classes.includes('glass') || classes.includes('dolphin-card') || classes.includes('dolphin-alert') || classes.includes('dolphin-navbar') || classes.includes('MuiCard-root') || classes.includes('MuiPaper-root')) {
            opcode = 0x11;
            typeName = 'Card';
        } else if (tagName === 'P' || tagName === 'SPAN' || tagName === 'H1' || tagName === 'H2' || tagName === 'H3' || tagName === 'H4' || tagName === 'H5' || tagName === 'H6' || tagName === 'LABEL' || classes.includes('MuiTypography-root')) {
            opcode = 0x16;
            typeName = 'Text';
        } else if (style.display === 'flex' && style.flexDirection === 'row') {
            opcode = 0x14;
            typeName = 'Row';
        } else if (style.display === 'flex' && style.flexDirection === 'column') {
            opcode = 0x13;
            typeName = 'Column';
        }

        // Extract Text Content (with Titan deduplication logic)
        let textContent = '';
        if (typeName === 'Text' || typeName === 'Button') {
            textContent = Array.from(el.childNodes)
                .filter(node => node.nodeType === Node.TEXT_NODE)
                .map(node => node.textContent.trim())
                .join(' ');

            if (!textContent && (typeName === 'Text' || typeName === 'Button')) {
                textContent = el.innerText ? el.innerText.trim() : '';
            }

            // Deduplication: skip text if already covered by parent
            if (typeName === 'Text' && textContent) {
                let parent = el.parentElement;
                while (parent && parent !== containerElement) {
                    if (parent.textContent.trim() === textContent && (parent.tagName === 'BUTTON' || parent.classList.contains('btn'))) {
                        return null; // Skip redundant leaf text covered by button
                    }
                    parent = parent.parentElement;
                }
            }
        }

        let placeholderContent = '';
        if (typeName === 'TextField') {
            placeholderContent = el.getAttribute('placeholder') || el.getAttribute('hint') || '';
        }

        return {
            id: index,
            tagName,
            opcode,
            typeName,
            classes,
            bounds: { x, y, width, height },
            padding: { left: paddingLeft, top: paddingTop, right: paddingRight, bottom: paddingBottom },
            styles: {
                backgroundColor: bgHex,
                textColor: textHex,
                borderColor: borderHex,
                borderRadius,
                borderWidth,
                fontSize,
                fontWeight: style.fontWeight,
                fontFamily: style.fontFamily ? style.fontFamily.split(',')[0].replace(/["']/g, '') : '',
                opacity: parseFloat(style.opacity || '1'),
                zIndex: parseInt(style.zIndex, 10) || 0,
                gradient: gradientStr
            },
            content: textContent,
            placeholder: placeholderContent,
            inputType: inputTypeAttr || 'text'
        };
    }

    _rgbToHex(rgbStr) {
        if (!rgbStr || rgbStr === 'transparent' || rgbStr === 'rgba(0, 0, 0, 0)') return '#00000000';
        const match = rgbStr.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
        if (!match) return rgbStr;
        const r = parseInt(match[1], 10).toString(16).padStart(2, '0');
        const g = parseInt(match[2], 10).toString(16).padStart(2, '0');
        const b = parseInt(match[3], 10).toString(16).padStart(2, '0');
        const a = match[4] !== undefined ? Math.round(parseFloat(match[4]) * 255).toString(16).padStart(2, '0') : 'ff';
        return `#${a}${r}${g}${b}`;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DOMScraperEngine };
} else {
    window.DOMScraperEngine = DOMScraperEngine;
}
