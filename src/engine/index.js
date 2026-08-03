/**
 * index.js
 * 
 * Main entry point for the Dynamic UI Copier Plugin for Dolphin Native.
 * Provides decoupled functions to scrape DOM elements and produce Titan binaries.
 */

const { DOMScraperEngine } = require('./DOMScraperEngine');
const { TitanBinaryEncoder } = require('./TitanBinaryEncoder');

class DynamicUICopierPlugin {
    constructor(options = {}) {
        this.options = options;
        this.scraper = new DOMScraperEngine(options);
        this.encoder = new TitanBinaryEncoder();
    }

    /**
     * Scrapes a DOM container and returns both the extracted AST and the Titan Binary Payload.
     */
    async processContainer(containerElement) {
        const astNodes = await this.scraper.scrapeContainer(containerElement);
        const compiled = this.encoder.encode(astNodes);
        return {
            astNodes,
            binaryBuffer: compiled.binaryBuffer,
            stringPool: compiled.stringPool,
            nodeCount: compiled.nodeCount
        };
    }

    /**
     * Client-side script string that can be dynamically injected into web preview responses.
     */
    getClientScraperBundleScript() {
        return `
            (function() {
                console.log("⚡ Dynamic UI Copier Client Active");
                if (window.DOMScraperEngine && window.TitanBinaryEncoder) {
                    const plugin = new DynamicUICopierPlugin();
                    window.DolphinUICopier = plugin;
                }
            })();
        `;
    }
}

module.exports = {
    DynamicUICopierPlugin,
    DOMScraperEngine,
    TitanBinaryEncoder
};
