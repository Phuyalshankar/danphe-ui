'use strict';
const ub = require('../framework/ub');

// ─── MUI COLOR TOKENS ─────────────────────────────────────────────────────────
const MUI_COLORS = {
    'primary':   { bg: 'blue-128',    color: 'white' },
    'secondary': { bg: 'purple-150',  color: 'white' },
    'error':     { bg: 'red-150',     color: 'white' },
    'warning':   { bg: 'amber-150',   color: 'white' },
    'info':      { bg: 'cyan-150',    color: 'white' },
    'success':   { bg: 'green-150',   color: 'white' },
    'inherit':   { bg: 'transparent', color: 'theme-text-0' },
};

function parseInlineStyle(styleStr = '') {
    const props = {};
    if (!styleStr) return props;
    styleStr.split(';').forEach(rule => {
        const [k, v] = rule.split(':').map(s => s.trim());
        if (!k || !v) return;
        const key = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        switch (key) {
            case 'backgroundColor': props.bg = v; break;
            case 'color':           props.color = v; break;
            case 'padding':         props.p = parseInt(v) || 0; break;
            case 'paddingLeft':     props.pl = parseInt(v) || 0; break;
            case 'paddingRight':    props.pr = parseInt(v) || 0; break;
            case 'paddingTop':      props.pt = parseInt(v) || 0; break;
            case 'paddingBottom':   props.pb = parseInt(v) || 0; break;
            case 'margin':          props.m = parseInt(v) || 0; break;
            case 'marginLeft':      props.ml = parseInt(v) || 0; break;
            case 'marginRight':     props.mr = parseInt(v) || 0; break;
            case 'marginTop':       props.mt = parseInt(v) || 0; break;
            case 'marginBottom':    props.mb = parseInt(v) || 0; break;
            case 'borderRadius':    props.radius = parseInt(v) || 0; break;
            case 'fontSize':        props.size = parseInt(v) || 14; break;
            case 'fontWeight':      props.bold = (v === 'bold' || parseInt(v) >= 600); break;
            case 'width':           props.width = v === '100%' ? -1 : parseInt(v) || 0; break;
            case 'height':          props.height = v === '100%' ? -1 : parseInt(v) || 0; break;
            case 'opacity':         props.opacity = parseFloat(v) || 1; break;
            case 'display':
                if (v === 'flex') props.type = 'Row';
                break;
            case 'flexDirection':
                if (v === 'column') props.orientation = 'vertical';
                if (v === 'row')    props.orientation = 'horizontal';
                break;
            case 'alignItems':
                props.items = v === 'center' ? 'center' : v === 'flex-end' ? 'end' : 'start';
                break;
            case 'justifyContent':
                if (v === 'center')        props.justify = 'center';
                if (v === 'space-between') props.justify = 'between';
                if (v === 'flex-end')      props.justify = 'end';
                break;
            case 'gap':             props.gap = parseInt(v) || 0; break;
            case 'boxShadow':       props.elevation = v.includes('none') ? 0 : 4; break;
            case 'flex':            props.flex = parseInt(v) || 1; break;
        }
    });
    return props;
}

function parseClassList(classList = '') {
    const classes = classList.split(/\s+/).filter(Boolean);
    const props = {};

    classes.forEach(cls => {
        if (cls === 'MuiButton-root' || cls === 'MuiButtonBase-root') props.type = 'Button';
        if (cls === 'MuiCard-root')        { props.type = 'Card'; props.elevation = 4; }
        if (cls === 'MuiPaper-root')       { props.type = 'Card'; props.elevation = 2; }
        if (cls === 'MuiTypography-root')  props.type = 'Text';
        if (cls === 'MuiTextField-root')   props.type = 'TextField';
        if (cls === 'card')               { props.type = 'Card'; props.bg = 'white'; props.radius = 8; props.elevation = 2; }
        if (cls === 'btn')                { props.type = 'Button'; props.p = 12; props.radius = 6; }
        if (cls === 'btn-primary')        { props.type = 'Button'; Object.assign(props, MUI_COLORS.primary); }
        if (cls === 'btn-secondary')      { props.type = 'Button'; Object.assign(props, MUI_COLORS.secondary); }
        if (cls === 'd-flex')             { props.type = 'Row'; }
        if (cls === 'flex-column')        { props.type = 'Column'; props.orientation = 'vertical'; }
        if (cls === 'flex-row')           { props.type = 'Row'; props.orientation = 'horizontal'; }
        if (cls === 'align-items-center')  props.items = 'center';
        if (cls === 'justify-content-center')  props.justify = 'center';
        if (cls === 'fw-bold')            props.bold = true;
        if (cls === 'text-center')        props.items = 'center';
        if (cls === 'w-100')              props.width = -1;
        if (cls === 'h-100')              props.height = -1;

        const twProps = ub.parseTW(cls);
        Object.assign(props, twProps);
    });
    return props;
}

function tagToType(tag) {
    const map = {
        'BUTTON': 'Button',
        'INPUT':  'TextField',
        'SELECT': 'Select',
        'IMG':    'Image',
        'SLIDER': 'Slider',
        'CHECKBOX': 'Checkbox',
        'H1': 'Text', 'H2': 'Text', 'H3': 'Text',
        'P': 'Text', 'SPAN': 'Text', 'LABEL': 'Text',
        'I': 'Icon',
        'DIV': 'Column',
    };
    return map[tag] || 'Container';
}

function tagTypography(tag) {
    const map = {
        'H1': { size: 32, bold: true },
        'H2': { size: 28, bold: true },
        'P':  { size: 14 },
        'SPAN': { size: 14 },
        'LABEL': { size: 12 },
    };
    return map[tag] || {};
}

function astNodeToSchema(node) {
    if (node.type === 'fragment') {
        const elements = (node.children || []).filter(c => c.type === 'element');
        if (elements.length === 1) return astNodeToSchema(elements[0]);
        return { type: 'Container', children: elements.map(astNodeToSchema).filter(Boolean) };
    }
    if (node.type === 'text') {
        const text = node.value.trim();
        if (!text) return null;
        return { type: 'Text', text, size: 14 };
    }
    if (node.type !== 'element') return null;

    const tag = (node.tag || '').toUpperCase();
    const attrs = node.attributes || {};

    let schema = {
        type: tagToType(tag),
        ...tagTypography(tag),
    };

    const classProps = parseClassList(attrs['CLASS'] || attrs['className'] || '');
    Object.assign(schema, classProps);

    const styleProps = parseInlineStyle(attrs['STYLE'] || '');
    Object.assign(schema, styleProps);

    if (attrs['DATA-ACTION'])   schema.action = attrs['DATA-ACTION'];
    if (attrs['DATA-KEY'])      schema.stateKey = attrs['DATA-KEY'];
    if (attrs['PLACEHOLDER'])   schema.hint = attrs['PLACEHOLDER'];
    if (tag === 'INPUT') {
        const t = (attrs['TYPE'] || '').toLowerCase();
        if (t === 'password') schema.inputType = 'password';
        if (t === 'email')    schema.inputType = 'email';
        if (t === 'range')    schema.type = 'Slider';
        if (t === 'checkbox') schema.type = 'Checkbox';
        if (attrs['LABEL'])   schema.label = attrs['LABEL'];
    }

    const children = (node.children || [])
        .map(child => astNodeToSchema(child))
        .filter(Boolean);

    const textChildren = children.filter(c => c.type === 'Text' && !c.children);

    if (schema.type === 'Button' && textChildren.length > 0) {
        schema.text = textChildren.map(c => c.text).join(' ');
        if (!schema.color) schema.color = 'white';
    } else if (schema.type === 'Text' && textChildren.length > 0) {
        schema.text = textChildren.map(c => c.text).join(' ');
    } else if (children.length > 0) {
        if (schema.orientation === 'vertical' || schema.type === 'Column') {
            schema.type = 'Column';
        } else if (schema.orientation === 'horizontal') {
            schema.type = 'Row';
        }
        schema.children = children;
    }

    return schema;
}

class CDNStyleBridge {
    constructor() { this._HTMLParser = null; }
    _getParser() {
        if (!this._HTMLParser) {
            const HTMLParser = require('../parser/HTMLParser');
            this._HTMLParser = new HTMLParser({ preserveWhitespace: false });
        }
        return this._HTMLParser;
    }
    htmlToSchema(html) {
        try {
            const parser = this._getParser();
            const result = parser.parse(html);
            if (!result.success) return { error: result.error };
            return { schema: astNodeToSchema(result.ast) };
        } catch (e) { return { error: e.message }; }
    }
}
module.exports = CDNStyleBridge;
