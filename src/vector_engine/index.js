'use strict';

const { VectorLexer } = require('./lexer/VectorLexer');
const { VectorParser } = require('./parser/VectorParser');
const { LayoutEngine } = require('./layout/LayoutEngine');
const { VectorRenderer } = require('./renderer/VectorRenderer');

/**
 * ? Danphe Vector Engine (DVE) - Main Compiler
 */
function compileVectorUI(sourceCode) {
    const lexer = new VectorLexer(sourceCode);
    const tokens = lexer.tokenize();
    
    const parser = new VectorParser(tokens);
    const ast = parser.parse();
    
    const layout = new LayoutEngine();
    const layoutTree = layout.compute(ast);
    
    const renderer = new VectorRenderer();
    return renderer.compileRoot(layoutTree);
}

module.exports = { compileVectorUI, VectorLexer, VectorParser, LayoutEngine, VectorRenderer };
