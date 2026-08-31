'use strict';

const { TokenType } = require('../lexer/VectorLexer');

/**
 * ? Danphe Vector Engine (DVE) - Parser
 * Converts Vector Tokens into an Abstract Syntax Tree (AST) ready for Layout Math.
 */

class VectorParser {
    constructor(tokens) {
        this.tokens = tokens;
        this.pos = 0;
    }

    parse() {
        return this.parseNodes();
    }

    parseNodes() {
        const nodes = [];
        while (this.pos < this.tokens.length && this.tokens[this.pos].type !== TokenType.EOF) {
            let token = this.tokens[this.pos];
            
            if (token.type === TokenType.TAG_CLOSE) {
                break; // Let the parent handle this
            }
            
            if (token.type === TokenType.TEXT) {
                nodes.push({ type: 'TEXT_NODE', text: token.value });
                this.pos++;
                continue;
            }

            if (token.type === TokenType.TAG_OPEN) {
                let node = {
                    type: 'ELEMENT_NODE',
                    tag: token.value,
                    props: {},
                    children: []
                };
                this.pos++;

                // Parse Attributes
                while (this.tokens[this.pos].type === TokenType.ATTR_NAME) {
                    let attrName = this.tokens[this.pos].value;
                    this.pos++;
                    let attrValue = true; // boolean default
                    if (this.tokens[this.pos] && this.tokens[this.pos].type === TokenType.ATTR_VALUE) {
                        attrValue = this.tokens[this.pos].value;
                        this.pos++;
                    }
                    node.props[attrName] = attrValue;
                }

                // Check self-closing or block
                let endToken = this.tokens[this.pos];
                this.pos++;

                if (endToken.value === 'OPEN') {
                    node.children = this.parseNodes();
                    // Consume closing tag
                    if (this.tokens[this.pos] && this.tokens[this.pos].type === TokenType.TAG_CLOSE) {
                        this.pos++;
                    }
                }
                
                nodes.push(node);
            } else {
                this.pos++;
            }
        }
        return nodes;
    }
}

module.exports = { VectorParser };
