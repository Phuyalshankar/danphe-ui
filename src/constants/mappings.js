'use strict';

const MAPPING = {
    ELEM: new Map([
        ['DIV', 1], ['SPAN', 2], ['BUTTON', 3], ['INPUT', 4], ['P', 5],
        ['A', 6], ['IMG', 7], ['H1', 8], ['H2', 9], ['H3', 10],
        ['FORM', 11], ['LABEL', 12], ['SELECT', 13], ['OPTION', 14],
        ['UL', 15], ['LI', 16], ['TEXTAREA', 17], ['TABLE', 18],
        ['TR', 19], ['TD', 20], ['TH', 21], ['NAV', 22], ['HEADER', 23],
        ['FOOTER', 24], ['SECTION', 25], ['ARTICLE', 26], ['ASIDE', 27],
        ['MAIN', 28], ['DIV_CONTAINER', 29], ['SPAN_INLINE', 30],
        ['TEXT', 0]
    ]),
    
    ATTR: new Map([
        ['CLASS', 32], ['ID', 33], ['STYLE', 34], ['SRC', 35], ['HREF', 36],
        ['VALUE', 37], ['TYPE', 38], ['NAME', 39], ['PLACEHOLDER', 40],
        ['ALT', 41], ['TITLE', 42], ['WIDTH', 43], ['HEIGHT', 44],
        ['TARGET', 45], ['REL', 46], ['ROWS', 47], ['COLS', 48],
        ['CHECKED', 49], ['DISABLED', 50], ['READONLY', 51], ['REQUIRED', 52],
        ['AUTOCOMPLETE', 53], ['AUTOFOCUS', 54], ['MAXLENGTH', 55],
        ['MINLENGTH', 56], ['PATTERN', 57], ['SIZE', 58], ['STEP', 59],
        ['DATA-*', 60]
    ]),
    
    EVENTS: new Map([
        ['ON_CLICK', 128],
        ['ON_INPUT', 129],
        ['ON_CHANGE', 130],
        ['ON_SUBMIT', 131],
        ['ON_FOCUS', 132],
        ['ON_BLUR', 133],
        ['ON_KEYDOWN', 134],
        ['ON_KEYUP', 135],
        ['ON_MOUSEDOWN', 136],
        ['ON_MOUSEUP', 137],
        ['ON_MOUSEOVER', 138],
        ['ON_MOUSEOUT', 139],
        ['ON_LOAD', 140],
        ['ON_ERROR', 141]
    ]),
    
    CMD: new Map([
        ['CAMERA_CAPTURE', 64], ['GPS_GET', 65], ['VIBRATE', 66],
        ['FILE_READ', 67], ['FILE_WRITE', 68], ['NETWORK_STATUS', 69],
        ['BATTERY_STATUS', 70], ['NOTIFICATION', 71]
    ])
};

const REVERSE_ELEM = new Map();
const REVERSE_ATTR = new Map();
const REVERSE_EVENTS = new Map();
const REVERSE_CMD = new Map();

MAPPING.ELEM.forEach((value, key) => REVERSE_ELEM.set(value, key));
MAPPING.ATTR.forEach((value, key) => REVERSE_ATTR.set(value, key));
MAPPING.EVENTS.forEach((value, key) => REVERSE_EVENTS.set(value, key));
MAPPING.CMD.forEach((value, key) => REVERSE_CMD.set(value, key));

module.exports = {
    MAPPING,
    REVERSE_ELEM,
    REVERSE_ATTR,
    REVERSE_EVENTS,
    REVERSE_CMD
};