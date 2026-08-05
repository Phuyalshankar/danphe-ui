'use strict';

/**
 * 🔍 WebSeoGenerator — Generates HTML5 Title, Meta tags, OpenGraph metadata, canonical URLs, and structured SEO headers.
 */
class WebSeoGenerator {
    static generateSeoHeaders(metadata = {}) {
        const title = metadata.title || 'Dolphin Native Web App';
        const description = metadata.description || 'High-Performance Universal Native Architecture';
        const canonical = metadata.canonical || '';
        const ogImage = metadata.ogImage || '';

        return `
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    ${ogImage ? `<meta property="og:image" content="${ogImage}">` : ''}
    ${canonical ? `<link rel="canonical" href="${canonical}">` : ''}
    <meta charset="UTF-8">
        `.trim();
    }
}

module.exports = WebSeoGenerator;
