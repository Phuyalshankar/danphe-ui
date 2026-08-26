'use strict';

/**
 * 🐬 Dolphin Native Component Library
 * 24-byte Titan Protocol Ready
 * 
 * This is the "Component Library" of the Dolphin Mobile Platform.
 * Each component is pre-wired to the 24-byte format.
 * 
 * Version: 2.0.0 (24-byte)
 */

const { MAPPING_TABLE } = (() => {
    // Inline the mapping table for zero-dependency components
    const MAPPING_TABLE = {
        LIBRARIES: { 
            FLUTTER: 0x06, 
            MUI: 0x01, 
            TAILWIND: 0x02, 
            IOS: 0x04, 
            ANDROID: 0x05, 
            UNIVERSAL: 0xFF 
        },
        COMPONENTS: {
            Button: 0x10, 
            Card: 0x11, 
            Container: 0x12, 
            Column: 0x13,
            Row: 0x14, 
            Stack: 0x15, 
            Text: 0x16, 
            Image: 0x17,
            TextField: 0x18, 
            Slider: 0x19, 
            Switch: 0x1A,
            Checkbox: 0x1B, 
            Select: 0x1C, 
            AppBar: 0x1D,
            ListView: 0x1E, 
            GridView: 0x22, 
            Modal: 0x20, 
            Form: 0x21, 
            Icon: 0x23,
            Camera: 0x30, 
            Microphone: 0x31, 
            Location: 0x32, 
            Bluetooth: 0x33, 
            Haptics: 0x34,
            Battery: 0x35, 
            Sensors: 0x36, 
            WebRTCVideo: 0x37, 
            WebRTCAudio: 0x38,
            Radio: 0x1F,
            FileUpload: 0x40,
            VideoPlayer: 0x50
        },
        ANIMATIONS: { 
            none: 0x00, 
            fade: 0x01, 
            slide: 0x02, 
            scale: 0x03, 
            rotate: 0x04, 
            bounce: 0x05,
            pulse: 0x06,
            shake: 0x07
        }
    };
    return { MAPPING_TABLE };
})();

let _importer = null;

function _getImporter() {
    if (_importer) return _importer;
    try {
        const Importer = require('../ui/UniversalUIImporter');
        _importer = new Importer();
    } catch (e) {
        // Fallback for environments where require fails
        _importer = {
            importSchema: (s) => _makeBinary(0x12, { ...s })
        };
    }
    return _importer;
}

/**
 * ✅ FIXED: Create 24-byte binary
 */
function _makeBinary(compCode, opts = {}) {
    const bin = new Uint8Array(24);  // ← 24 bytes
    
    // Byte 0: Library (Universal)
    bin[0] = MAPPING_TABLE.LIBRARIES.UNIVERSAL;
    
    // Byte 1: Component Type
    bin[1] = compCode;
    
    // Byte 15: Signature (Active)
    bin[15] = 0xEE;
    
    // Byte 23: Mirror Signature (24-byte protocol)
    bin[23] = 0xEE;
    
    // Byte 16-17: Width (if provided)
    if (opts.width) {
        bin[16] = opts.width & 0xFF;
        bin[17] = (opts.width >> 8) & 0xFF;
    }
    
    // Byte 18-19: Height (if provided)
    if (opts.height) {
        bin[18] = opts.height & 0xFF;
        bin[19] = (opts.height >> 8) & 0xFF;
    }
    
    // Byte 20: Color Index (if provided)
    if (opts.colorIndex) {
        bin[20] = opts.colorIndex & 0xFF;
    }
    
    // Byte 21: Border Radius (if provided)
    if (opts.radius) {
        bin[21] = opts.radius & 0xFF;
    }
    
    // Byte 22: Z-Index (if provided)
    if (opts.zIndex) {
        bin[22] = opts.zIndex & 0xFF;
    }
    
    return bin;
}

/**
 * Create a component with binary property
 */
function _makeComponent(type, opts = {}) {
    const obj = { type, ...opts };
    let cachedBin = null;
    
    Object.defineProperty(obj, 'binary', {
        get() {
            if (cachedBin) return cachedBin;
            
            const importer = _getImporter();
            const result = importer.importSchema(obj);
            const bin = result.binaries[0] || _makeBinary(
                MAPPING_TABLE.COMPONENTS[type] || 0x12, 
                opts
            );
            
            // ✅ Ensure 24-byte format
            bin[0] = MAPPING_TABLE.LIBRARIES.UNIVERSAL;
            bin[1] = MAPPING_TABLE.COMPONENTS[type] || 0x12;
            bin[15] = 0xEE;
            bin[23] = 0xEE;  // ← Mirror signature
            
            cachedBin = Buffer.from(bin);
            return cachedBin;
        },
        configurable: true,
        enumerable: false
    });
    
    return obj;
}

// ─── UI COMPONENTS ──────────────────────────────────────────────

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
        className: ((opts.className || '') + ' fixed bottom-0 left-0 right-0 w-full flex-row items-center justify-around z-50 bg-white').trim()
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

/**
 * 🪟 Modal Component
 */
function Modal(opts = {}) {
    return _makeComponent('Modal', opts);
}

/**
 * 📋 ListView Component
 */
function ListView(opts = {}) {
    return _makeComponent('ListView', opts);
}

/**
 * 📊 GridView Component
 */
function GridView(opts = {}) {
    return _makeComponent('GridView', opts);
}

/**
 * 🎨 Icon Component
 */
function Icon(opts = {}) {
    return _makeComponent('Icon', opts);
}

/**
 * 🎬 VideoPlayer Component
 */
function VideoPlayer(opts = {}) {
    return _makeComponent('VideoPlayer', opts);
}

// ─── HARDWARE COMPONENTS ────────────────────────────────────────

/**
 * 📷 Camera Component
 */
function Camera(opts = {}) {
    return _makeComponent('Camera', opts);
}

/**
 * 🎤 Microphone Component
 */
function Microphone(opts = {}) {
    return _makeComponent('Microphone', opts);
}

/**
 * 📍 Location Component
 */
function Location(opts = {}) {
    return _makeComponent('Location', opts);
}

/**
 * 🦷 Bluetooth Component
 */
function Bluetooth(opts = {}) {
    return _makeComponent('Bluetooth', opts);
}

/**
 * 📳 Haptics Component
 */
function Haptics(opts = {}) {
    return _makeComponent('Haptics', opts);
}

/**
 * 🔋 Battery Status Component
 */
function Battery(opts = {}) {
    return _makeComponent('Battery', opts);
}

/**
 * 🧭 Sensors Component
 */
function Sensors(opts = {}) {
    return _makeComponent('Sensors', opts);
}

/**
 * 📹 WebRTC Video Chat Component
 */
function WebRTCVideo(opts = {}) {
    return _makeComponent('WebRTCVideo', opts);
}

/**
 * 🎧 WebRTC Audio Component
 */
function WebRTCAudio(opts = {}) {
    return _makeComponent('WebRTCAudio', opts);
}

// ─── UTILITY COMPONENTS ─────────────────────────────────────────

/**
 * 🌍 NativeUI Component
 * Universal wrapper for Flutter, Tailwind, Bootstrap, or Raw HTML.
 */
function NativeUI(content, opts = {}) {
    if (typeof content === 'string') {
        const isHTML = /<[a-z][\s\S]*>/i.test(content);
        if (isHTML) {
            return { type: 'Container', html: content, ...opts };
        } else {
            return { type: 'Container', className: content, ...opts };
        }
    }
    if (typeof content === 'object') {
        return { ...content, ...opts };
    }
    return { type: 'Container', ...opts };
}

/**
 * 📦 Stack Component
 */
function Stack(opts = {}) {
    return _makeComponent('Stack', opts);
}

/**
 * 📝 Form Component
 */
function Form(opts = {}) {
    return _makeComponent('Form', opts);
}

// ─── UTILITY FUNCTIONS ──────────────────────────────────────────

/**
 * Compose multiple components into a single screen schema.
 * @param {...object} components 
 * @returns {object} A root Container schema
 */
function compose(...components) {
    const arr = components.flat();
    return {
        type: 'Column',
        children: arr
    };
}

/**
 * ✅ FIXED: Get total binary size (24 bytes per component)
 */
function getBinarySize(composed) {
    if (composed instanceof Uint8Array) return composed.length;
    if (Array.isArray(composed)) return composed.length * 24;  // ← 24 bytes
    if (composed.binary) return 24;
    return 0;
}

/**
 * Create a screen with entry point
 */
function createScreen(name, component, opts = {}) {
    return {
        name,
        component,
        entry: opts.entry || false,
        ...opts
    };
}

/**
 * Create a full app bundle
 */
function createApp(screens, entry = null, opts = {}) {
    return {
        screens,
        entry: entry || (screens.length > 0 ? screens[0].name : null),
        ...opts
    };
}

// ─── EXPORTS ──────────────────────────────────────────────────────

module.exports = {
    // ── UI Components ──
    Button,
    Card,
    Container,
    Text,
    Image,
    Row,
    Column,
    Stack,
    AppBar,
    TabBar,
    TextField,
    Switch,
    Slider,
    Checkbox,
    Select,
    Radio,
    FileUpload,
    Modal,
    ListView,
    GridView,
    Icon,
    VideoPlayer,
    Form,
    
    // ── Hardware Components ──
    Camera,
    Microphone,
    Location,
    Bluetooth,
    Haptics,
    Battery,
    Sensors,
    WebRTCVideo,
    WebRTCAudio,
    
    // ── Utility ──
    NativeUI,
    compose,
    getBinarySize,
    createScreen,
    createApp,
    
    // ── Raw binary factory (for advanced users) ──
    _makeBinary,
    _makeComponent,
    MAPPING_TABLE
};