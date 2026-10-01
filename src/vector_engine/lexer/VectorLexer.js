'use strict';

/**
 * ? Danphe Vector Engine (DVE) - Lexical Analyzer
 * Converts HTML/JSX-like syntax into a stream of pure Vector Tokens.
 * No DOM, no HTML. Strictly for parsing DVE syntax into AST.
 */

const TokenType = {
    TAG_OPEN: 'TAG_OPEN',
    TAG_CLOSE: 'TAG_CLOSE',
    TAG_END: 'TAG_END',
    ATTR_NAME: 'ATTR_NAME',
    ATTR_VALUE: 'ATTR_VALUE',
    TEXT: 'TEXT',
    EOF: 'EOF'
};

class VectorLexer {
    constructor(input) {
        this.input = input;
        this.pos = 0;
        this.tokens = [];
    }

    tokenize() {
        while (this.pos < this.input.length) {
            let char = this.input[this.pos];

            if (char === '<') {
                if (this.input[this.pos + 1] === '/') {
                    // Closing tag: </DBox>
                    this.pos += 2;
                    let tagName = this.readIdentity();
                    this.tokens.push({ type: TokenType.TAG_CLOSE, value: tagName });
                    this.consumeWhitespace();
                    if (this.input[this.pos] === '>') this.pos++;
                } else {
                    // Opening tag: <DBox
                    this.pos++;
                    let tagName = this.readIdentity();
                    this.tokens.push({ type: TokenType.TAG_OPEN, value: tagName });
                    
                    // Parse attributes
                    while (this.pos < this.input.length && this.input[this.pos] !== '>' && this.input[this.pos] !== '/') {
                        this.consumeWhitespace();
                        if (this.input[this.pos] === '>' || this.input[this.pos] === '/') break;
                        
                        let attrName = this.readIdentity();
                        this.tokens.push({ type: TokenType.ATTR_NAME, value: attrName });
                        
                        if (this.input[this.pos] === '=') {
                            this.pos++; // skip '='
                            let quote = this.input[this.pos];
                            if (quote === '"' || quote === "'") {
                                this.pos++;
                                let attrValue = this.readUntil(quote);
                                this.tokens.push({ type: TokenType.ATTR_VALUE, value: attrValue });
                                this.pos++; // skip closing quote
                            }
                        }
                    }

                    if (this.input[this.pos] === '/') {
                        this.tokens.push({ type: TokenType.TAG_END, value: 'SELF_CLOSE' });
                        this.pos += 2; // skip />
                    } else if (this.input[this.pos] === '>') {
                        this.tokens.push({ type: TokenType.TAG_END, value: 'OPEN' });
                        this.pos++;
                    }
                }
            } else {
                // Text content
                let text = this.readUntil('<').trim();
                if (text.length > 0) {
                    this.tokens.push({ type: TokenType.TEXT, value: text });
                }
            }
        }
        
        this.tokens.push({ type: TokenType.EOF, value: null });
        return this.tokens;
    }

    readIdentity() {
        let start = this.pos;
        while (this.pos < this.input.length && /[a-zA-Z0-9\-_]/.test(this.input[this.pos])) {
            this.pos++;
        }
        return this.input.slice(start, this.pos);
    }

    readUntil(char) {
        let start = this.pos;
        while (this.pos < this.input.length && this.input[this.pos] !== char) {
            this.pos++;
        }
        return this.input.slice(start, this.pos);
    }

    consumeWhitespace() {
        while (this.pos < this.input.length && /\s/.test(this.input[this.pos])) {
            this.pos++;
        }
    }
}

module.exports = { VectorLexer, TokenType };
