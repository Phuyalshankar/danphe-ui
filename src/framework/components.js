'use strict';

const { MAPPING_TABLE } = (() => {
    // Inline the mapping table for zero-dependency components
    const MAPPING_TABLE = {
        LIBRARIES: { FLUTTER: 0x06, MUI: 0x01, TAILWIND: 0x02, IOS: 0x04, ANDROID: 0x05, UNIVERSAL: 0xFF },
        COMPONENTS: {
            Button: 0x10, Card: 0x11, Container: 0x12, Column: 0x13,
            Row: 0x14, Stack: 0x15, Text: 0x16, Image: 0x17,
            TextField: 0x18, Slider: 0x19, Switch: 0x1A,
            Checkbox: 0x1B, Select: 0x1C, AppBar: 0x1D,
            ListView: 0x1E, GridView: 0x22, Modal: 0x20, Form: 0x21, Icon: 0x23,
            Camera: 0x30, Microphone: 0x31, Location: 0x32, Bluetooth: 0x33, Haptics: 0x34,
            Battery: 0x35, Sensors: 0x36, WebRTCVideo: 0x37, WebRTCAudio: 0x38
        },
        ANIMATIONS: { none: 0x00, fade: 0x01, slide: 0x02, scale: 0x03, rotate: 0x04, bounce: 0x05 }
    };
    return { MAPPING_TABLE };
})();

/**
 * Factory for creating Titan 16-byte binary schemas directly.
 * This is the "Component Library" of the Dolphin Mobile Platform.
 * Each component is pre-wired to the 16-byte format.
 */

let _importer = null;
function _getImporter() {
    if (_importer) return _importer;
    try {
        const Importer = require('../ui/UniversalUIImporter');
        _importer = new Importer();
    } catch (e) {
        // Fallback for environments where require('../ui/...') fails
        _importer = {
            importSchema: (s) => _makeBinary(0x12, { ...s }) // basic fallback
        };
    }
    return _importer;
}

function _makeComponent(type, opts = {}) {
    const obj = { type, ...opts };
    let cachedBin = null;
    Object.defineProperty(obj, 'binary', {
        get() {
            if (cachedBin) return cachedBin;
            const importer = _getImporter();
            const result = importer.importSchema(obj);
            const bin = result.binaries[0] || _makeBinary(MAPPING_TABLE.COMPONENTS[type] || 0x12, opts);
            bin[0] = MAPPING_TABLE.LIBRARIES.UNIVERSAL;
            bin[1] = MAPPING_TABLE.COMPONENTS[type] || 0x12;
            bin[15] = 0xEE;
            cachedBin = Buffer.from(bin);
            return cachedBin;
        },
        configurable: true,
        enumerable: false
    });
    return obj;
}

function _makeBinary(compCode, opts = {}) {
    const bin = new Uint8Array(16);
    bin[0] = MAPPING_TABLE.LIBRARIES.UNIVERSAL;
    bin[1] = compCode;
    bin[15] = 0xEE; // Set signature to 0xEE by default
    return bin;
}

/**
 * 🔘 Button Component
 */
function Button(opts = {}) {
    return _makeComponent('Button', opts);
}

/**
 * 🃏 Card Component
 */
function Card(opts = {}) {
    return _makeComponent('Card', opts);
}

/**
 * 📦 Container Component
 */
function Container(opts = {}) {
    return _makeComponent('Container', opts);
}

/**
 * 🔤 Text Component
 */
function Text(opts = {}) {
    return _makeComponent('Text', opts);
}

/**
 * 🖼️ Image Component
 */
function Image(opts = {}) {
    return _makeComponent('Image', opts);
}

/**
 * ⬛ Row Component
 */
function Row(opts = {}) {
    return _makeComponent('Row', opts);
}

/**
 * ⬜ Column Component
 */
function Column(opts = {}) {
    return _makeComponent('Column', opts);
}

/**
 * 🔲 AppBar Component
 */
function AppBar(opts = {}) {
    return _makeComponent('AppBar', opts);
}

/**
 * 📱 TabBar Component (Auto-fixed to bottom)
 */
function TabBar(opts = {}) {
    const optsWithFixed = Object.assign({}, opts, {
        className: ((opts.className || '') + ' fixed bottom-0 left-0 right-0 w-full flex-row items-center justify-around z-50').trim()
    });
    return _makeComponent('Row', optsWithFixed);
}

/**
 * ⌨️ TextField Component
 */
function TextField(opts = {}) {
    return _makeComponent('TextField', opts);
}

/**
 * 📻 Switch Component
 */
function Switch(opts = {}) {
    return _makeComponent('Switch', opts);
}

/**
 * 🎚️ Slider Component
 */
function Slider(opts = {}) {
    return _makeComponent('Slider', opts);
}

/**
 * ☑️ Checkbox Component
 */
function Checkbox(opts = {}) {
    return _makeComponent('Checkbox', opts);
}

/**
 * 🔽 Select Component
 */
function Select(opts = {}) {
    return _makeComponent('Select', opts);
}

/**
 * 🔘 Radio Component
 */
function Radio(opts = {}) {
    return _makeComponent('Radio', opts);
}

/**
 * 📁 FileUpload Component
 */
function FileUpload(opts = {}) {
    return _makeComponent('FileUpload', opts);
}

function Modal(opts = {}) {
    return _makeComponent('Modal', opts);
}

function ListView(opts = {}) {
    return _makeComponent('ListView', opts);
}

function GridView(opts = {}) {
    return _makeComponent('GridView', opts);
}

function Icon(opts = {}) {
    return _makeComponent('Icon', opts);
}

/**
 * 📷 Camera Component
 */
function Camera(opts = {}) { return _makeComponent('Camera', opts); }

/**
 * 🎤 Microphone Component
 */
function Microphone(opts = {}) { return _makeComponent('Microphone', opts); }

/**
 * 📍 Location Component
 */
function Location(opts = {}) { return _makeComponent('Location', opts); }

/**
 * 🦷 Bluetooth Component
 */
function Bluetooth(opts = {}) { return _makeComponent('Bluetooth', opts); }

/**
 * 📳 Haptics Component
 */
function Haptics(opts = {}) { return _makeComponent('Haptics', opts); }

/**
 * 🔋 Battery Status Component
 */
function Battery(opts = {}) { return _makeComponent('Battery', opts); }

/**
 * 🧭 Sensors Component
 */
function Sensors(opts = {}) { return _makeComponent('Sensors', opts); }

/**
 * 📹 WebRTC Video Chat Component
 */
function WebRTCVideo(opts = {}) { return _makeComponent('WebRTCVideo', opts); }

/**
 * 🎧 WebRTC Audio Component
 */
function WebRTCAudio(opts = {}) { return _makeComponent('WebRTCAudio', opts); }

/**
 * Compose multiple components into a single screen schema.
 * @param {...object} components 
 * @returns {object} A root Container schema
 */
function compose(...components) {
    const arr = components.flat();
    arr.type = 'Column';
    arr.children = arr;
    return arr;
}

/**
 * Get total binary size (legacy utility)
 */
function getBinarySize(composed) {
    if (composed instanceof Uint8Array) return composed.length;
    if (Array.isArray(composed)) return composed.length * 16;
    return 0;
}

/**
 * 🌍 NativeUI Component
 * Universal wrapper for Flutter, Tailwind, Bootstrap, or Raw HTML.
 */
function NativeUI(content, opts = {}) {
    // If it's a string, treat as CSS classes or HTML
    if (typeof content === 'string') {
        const isHTML = /<[a-z][\s\S]*>/i.test(content);
        if (isHTML) {
            return { type: 'Container', html: content, ...opts };
        } else {
            return { type: 'Container', className: content, ...opts };
        }
    }

    // If it's an object, treat as Flutter-style schema
    if (typeof content === 'object') {
        return { ...content, ...opts };
    }
}

module.exports = {
    // Components
    Button, Card, Container, Text, Image,
    ListView, Row, Column, AppBar, TabBar, Icon,
    TextField, Switch, Slider, Checkbox, Select, Radio, FileUpload, Modal, GridView,
    Camera, Microphone, Location, Bluetooth, Haptics,
    Battery, Sensors, WebRTCVideo, WebRTCAudio,
    NativeUI,

    // Utilities
    compose,
    getBinarySize,

    // Raw binary factory (for advanced users)
    _makeBinary
};
