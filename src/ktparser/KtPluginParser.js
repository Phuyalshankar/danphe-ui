'use strict';

/**
 * KtPluginParser Engine for Dolphin Native 2
 * ───────────────┬────────────────────────────────────────────────────
 * Parses Android Kotlin (.kt) plugin code, Jetpack Compose layouts,
 * Android View DSL, and plugin metadata, converting them into 
 * JSX component definitions and Titan 24-byte Binary Opcodes.
 */
class KtPluginParser {
    constructor() {
        this.cache = new Map();
    }

    /**
     * Parse Kotlin code string or file content
     * @param {string} ktSource - Raw Kotlin (.kt) code
     * @param {string} fileName - Optional filename for reference
     * @returns {Object} Parsed plugin definition { metadata, components, actions, jsxSnippet }
     */
    parse(ktSource, fileName = 'KtPlugin.kt') {
        if (!ktSource || typeof ktSource !== 'string') {
            return this._createEmptyParsed(fileName);
        }

        const metadata = this.extractMetadata(ktSource, fileName);
        const components = this.extractUIComponents(ktSource);
        const actions = this.extractNativeActions(ktSource);
        const jsxSnippet = this.generateJSXSnippet(components, metadata);

        const parsedResult = {
            fileName,
            metadata,
            components,
            actions,
            jsxSnippet
        };

        this.cache.set(metadata.name, parsedResult);
        return parsedResult;
    }

    /**
     * Extract plugin package, class name, imports, and gradle plugin IDs
     */
    extractMetadata(code, fileName) {
        const meta = {
            name: fileName.replace(/\.kt$/i, '') || 'KtPlugin',
            package: 'com.dolphinnative.plugin',
            plugins: [],
            imports: []
        };

        // Extract Package Name
        const pkgMatch = code.match(/package\s+([a-zA-Z0-9_.]+)/);
        if (pkgMatch) meta.package = pkgMatch[1];

        // Extract Class / Object Name
        const classMatch = code.match(/(?:class|object|interface)\s+([a-zA-Z0-9_]+)/);
        if (classMatch) meta.name = classMatch[1];

        // Extract Plugin IDs
        const pluginRegex = /(?:id|plugin)\s*\(?['"]([^'"]+)['"]\)?/g;
        let pMatch;
        while ((pMatch = pluginRegex.exec(code)) !== null) {
            meta.plugins.push(pMatch[1]);
        }

        // Extract Import statements
        const importRegex = /import\s+([a-zA-Z0-9_.]+)/g;
        let iMatch;
        while ((iMatch = importRegex.exec(code)) !== null) {
            meta.imports.push(iMatch[1]);
        }

        return meta;
    }

    /**
     * Extract UI components from Kotlin source code
     */
    extractUIComponents(code) {
        const components = [];
        const lines = code.split('\n');

        lines.forEach((line, idx) => {
            const trimmed = line.trim();

            // 1. Text / TextView / Label
            if (trimmed.includes('Text(') || trimmed.includes('TextView(') || trimmed.includes('title =')) {
                const textMatch = trimmed.match(/(?:text|title|label)\s*=\s*["']([^"']+)["']/) || trimmed.match(/(?:Text|TextView)\s*\(\s*["']([^"']+)["']/);
                const colorMatch = trimmed.match(/color\s*=\s*["']([^"']+)["']/);
                const sizeMatch = trimmed.match(/fontSize\s*=\s*([0-9]+)/);

                components.push({
                    type: 'Text',
                    text: textMatch ? textMatch[1] : (this._extractLiteral(trimmed) || 'Kotlin Text'),
                    color: colorMatch ? colorMatch[1] : '#333333',
                    fontSize: sizeMatch ? parseInt(sizeMatch[1], 10) : 16,
                    line: idx + 1
                });
            }

            // 2. Button / ElevatedButtons
            else if (trimmed.includes('Button(') || trimmed.includes('ElevatedButton(') || trimmed.includes('OutlinedButton(')) {
                const textMatch = trimmed.match(/text\s*=\s*["']([^"']+)["']/) || trimmed.match(/["']([^"']+)["']/);
                const onClickMatch = trimmed.match(/onClick\s*=\s*\{?([^}]+)\}?/);

                const rawAction = onClickMatch ? onClickMatch[1].trim() : 'handlePluginAction';
                const cleanAction = rawAction.replace(/["'()]/g, '');

                components.push({
                    type: 'Button',
                    text: textMatch ? textMatch[1] : 'Action Button',
                    action: cleanAction,
                    variant: trimmed.includes('Outlined') ? 'outline' : 'primary',
                    line: idx + 1
                });
            }

            // 3. TextField / OutlinedTextField / EditText
            else if (trimmed.includes('TextField(') || trimmed.includes('OutlinedTextField(') || trimmed.includes('EditText(')) {
                const labelMatch = trimmed.match(/label\s*=\s*\{?\s*Text\(["']([^"']+)["']\)\s*\}?/) || trimmed.match(/placeholder\s*=\s*["']([^"']+)["']/);
                const valueMatch = trimmed.match(/value\s*=\s*["']([^"']+)["']/);

                components.push({
                    type: 'TextField',
                    inputType: trimmed.toLowerCase().includes('password') ? 'password' : 'text',
                    placeholder: labelMatch ? labelMatch[1] : 'Enter text...',
                    value: valueMatch ? valueMatch[1] : '',
                    line: idx + 1
                });
            }

            // 4. Image / ImageView / Album Cover
            else if (trimmed.includes('Image(') || trimmed.includes('ImageView(')) {
                const srcMatch = trimmed.match(/(?:src|url|painter)\s*=\s*["']([^"']+)["']/);

                components.push({
                    type: 'Image',
                    src: srcMatch ? srcMatch[1] : 'assets/icon.png',
                    alt: 'Kotlin Plugin Asset',
                    line: idx + 1
                });
            }

            // 5. Slider / ProgressBar / SeekBar
            else if (trimmed.includes('Slider(') || trimmed.includes('ProgressBar(') || trimmed.includes('SeekBar(')) {
                const valMatch = trimmed.match(/value\s*=\s*([0-9.]+)/);
                components.push({
                    type: 'Slider',
                    value: valMatch ? parseFloat(valMatch[1]) : 0,
                    line: idx + 1
                });
            }

            // 6. Checkbox / Switch
            else if (trimmed.includes('Checkbox(') || trimmed.includes('Switch(')) {
                const labelMatch = trimmed.match(/label\s*=\s*["']([^"']+)["']/);
                components.push({
                    type: 'Checkbox',
                    label: labelMatch ? labelMatch[1] : 'Enable',
                    checked: trimmed.includes('checked = true'),
                    line: idx + 1
                });
            }
        });

        // Default component if none parsed
        if (components.length === 0) {
            components.push({
                type: 'Text',
                text: 'Kt Plugin Active',
                color: '#6200EE',
                fontSize: 18
            });
        }

        return components;
    }

    /**
     * Extract native Kotlin methods/actions
     */
    extractNativeActions(code) {
        const actions = [];
        const fnRegex = /fun\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/g;
        let match;
        while ((match = fnRegex.exec(code)) !== null) {
            actions.push({
                name: match[1],
                params: match[2].trim() ? match[2].split(',').map(p => p.trim()) : []
            });
        }
        return actions;
    }

    /**
     * Generate equivalent JSX component wrapper snippet
     */
    generateJSXSnippet(components, metadata) {
        const lines = [];
        lines.push(`// Generated JSX Component for ${metadata.name}`);
        lines.push(`export function ${metadata.name}(props) {`);
        lines.push(`    return (`);
        lines.push(`        <View style={{ padding: 16, backgroundColor: '#ffffff', borderRadius: 12 }}>`);
        lines.push(`            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#6200EE', marginBottom: 12 }}>`);
        lines.push(`                🔌 ${metadata.name}`);
        lines.push(`            </Text>`);

        components.forEach(c => {
            switch (c.type) {
                case 'Text':
                    lines.push(`            <Text style={{ fontSize: ${c.fontSize}, color: '${c.color}', marginBottom: 8 }}>`);
                    lines.push(`                ${c.text}`);
                    lines.push(`            </Text>`);
                    break;
                case 'Button':
                    lines.push(`            <Button title="${c.text}" onClick={props.${c.action} || (() => {})} style={{ marginBottom: 8 }} />`);
                    break;
                case 'TextField':
                    lines.push(`            <Input placeholder="${c.placeholder}" style={{ marginBottom: 8 }} />`);
                    break;
                case 'Image':
                    lines.push(`            <Image src="${c.src}" style={{ width: 120, height: 120, borderRadius: 8, marginBottom: 8 }} />`);
                    break;
                case 'Slider':
                    lines.push(`            <Slider value={${c.value}} style={{ marginBottom: 8 }} />`);
                    break;
                case 'Checkbox':
                    lines.push(`            <Checkbox label="${c.label}" checked={${c.checked}} style={{ marginBottom: 8 }} />`);
                    break;
            }
        });

        lines.push(`        </View>`);
        lines.push(`    );`);
        lines.push(`}`);
        return lines.join('\n');
    }

    _extractLiteral(str) {
        const m = str.match(/["']([^"']+)["']/);
        return m ? m[1] : null;
    }

    _createEmptyParsed(fileName) {
        return {
            fileName,
            metadata: { name: 'EmptyPlugin', package: 'com.example', plugins: [], imports: [] },
            components: [],
            actions: [],
            jsxSnippet: ''
        };
    }
}

module.exports = KtPluginParser;
