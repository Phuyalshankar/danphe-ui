'use strict';

const fs = require('fs');
const path = require('path');
const KtPluginParser = require('./KtPluginParser');

/**
 * KtPluginRegistry for Dolphin Native 2
 * ───────────────┬────────────────────────────────────────────────────
 * Scans assets/plugins/ directory, parses all downloaded .kt files,
 * registers native plugin components and connects them to the JSX compiler.
 */
class KtPluginRegistry {
    constructor(options = {}) {
        this.parser = new KtPluginParser();
        this.registeredPlugins = new Map();
    }

    /**
     * Scan project assets/plugins/ directory and parse all .kt files
     * @param {string} projectRoot - Path to project root
     * @returns {Map<string, Object>} Map of registered plugins
     */
    loadPluginsFromAssets(projectRoot) {
        const pluginsDir = path.join(projectRoot, 'assets', 'plugins');
        if (!fs.existsSync(pluginsDir)) {
            try {
                fs.mkdirSync(pluginsDir, { recursive: true });
            } catch (e) {}
            return this.registeredPlugins;
        }

        try {
            const files = fs.readdirSync(pluginsDir);
            for (const file of files) {
                if (file.endsWith('.kt')) {
                    const filePath = path.join(pluginsDir, file);
                    const ktSource = fs.readFileSync(filePath, 'utf8');
                    const parsed = this.parser.parse(ktSource, file);
                    this.registeredPlugins.set(parsed.metadata.name, parsed);
                    console.log(`  🔌 [KtPluginRegistry] Registered Kotlin Plugin: <${parsed.metadata.name} /> from assets/plugins/${file}`);
                }
            }
        } catch (err) {
            console.warn(`⚠️ [KtPluginRegistry] Error scanning assets/plugins: ${err.message}`);
        }

        return this.registeredPlugins;
    }

    /**
     * Get a registered plugin by name
     * @param {string} name 
     */
    getPlugin(name) {
        return this.registeredPlugins.get(name) || null;
    }

    /**
     * Export all parsed plugins as generated JSX code wrappers
     */
    exportGeneratedJSX() {
        const snippets = [];
        for (const [name, plugin] of this.registeredPlugins.entries()) {
            snippets.push(plugin.jsxSnippet);
        }
        return snippets.join('\n\n');
    }
}

module.exports = KtPluginRegistry;
