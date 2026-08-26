'use strict';

/**
 * 🌟 TitanAdaptiveIcon (danphe-ui)
 * Complete 256 Unique Vector Icons with 100% Pure ThorVG / Danphe-2 Compliance
 * ═════════════════════════════════════════════════════════════════════════════
 * Supports:
 * - 256 Unique Pure Vector SVG Definitions (0 to 255)
 * - Positive (+) Unsigned: Luxury Circular Ring Badge
 * - Negative (-) Signed  : Pure Borderless Vector Icon
 * - Animation Sub-Opcodes: (0: Static, 1: Pulse, 2: Spin, 3: Bounce, 4: Ring, 5: Ripple, 6: Wave, 7: Flash, 8: Glow)
 */

const { parseBitmask } = require('./TitanIconMatrix');
const { EXTENDED_WEB_ICONS } = require('./TitanExtendedIcons');

const TITAN_ICON = {
    IDLE: 0,
    INCOMING_VOICE: 1,
    INCOMING_VIDEO: 2,
    OUTGOING_VOICE: 3,
    MISSED_CALL: 4,
    CONNECTED_CALL: 5,
    MIC_MUTE: 6,
    CHAT: 7,
    VOICEMAIL: 8,
    HEADSET: 9,
    CALL_FORWARD: 10,
    CALL_HOLD: 11,
    CALL_TRANSFER: 12,
    CONFERENCE: 13,
    RECORDING: 14,
    DTMF_KEYPAD: 15,
    SPEAKERPHONE: 16,
    SIM_CARD: 180,
    NETWORK_TRUNK: 181,
    SRTP_SHIELD: 182,
    PADLOCK_LOCKED: 192,
    USER_AVATAR: 225,
    SETTINGS_GEAR: 226,
    GLOBAL_SEARCH: 232,
    TITAN_ALL_HIGHWAY: 255,

    // ── 🌐 EXTENDED WEB & LUCIDE-MATCHING SUITE ──
    WEB: {
        SEARCH: 256,
        HOME: 257,
        SETTINGS: 258,
        USER: 259,
        USERS: 260,
        BELL: 261,
        FILTER: 262,
        SHARE: 263,
        LINK: 264,
        EXTERNAL_LINK: 265,
        MENU: 266,
        GRID: 267,
        LIST: 268,
        MORE_H: 269,
        MORE_V: 270,
        CHEVRON_UP: 271,
        CHEVRON_DOWN: 272,
        CHEVRON_LEFT: 273,
        CHEVRON_RIGHT: 274,
        ARROW_UP: 275,
        ARROW_DOWN: 276,
        ARROW_LEFT: 277,
        ARROW_RIGHT: 278,
        EXPAND: 279,
        EDIT: 280,
        TRASH: 281,
        PLUS: 282,
        MINUS: 283,
        CHECK: 284,
        CLOSE: 285,
        COPY: 286,
        SAVE: 287,
        DOWNLOAD: 288,
        UPLOAD: 289,
        FILE: 290,
        FILE_TEXT: 291,
        FOLDER: 292,
        IMAGE: 293,
        EYE: 294,
        EYE_OFF: 295,
        LOCK: 296,
        UNLOCK: 297,
        REFRESH: 298,
        SHIELD: 299,
        CODE: 300,
        TERMINAL: 301,
        CPU: 302,
        DATABASE: 303,
        SERVER: 304,
        CLOUD: 305,
        GIT_BRANCH: 306,
        BUG: 307,
        WIFI: 308,
        BATTERY: 309,
        GLOBE: 310,
        MONITOR: 311,
        SMARTPHONE: 312
    },

    FINTECH: {
        CREDIT_CARD: 326,
        WALLET: 327,
        CART: 328
    },

    MEDICAL: {
        ACTIVITY: 329,
        STETHOSCOPE: 330,
        PILL: 331,
        THERMOMETER: 332,
        BED: 333,
        AMBULANCE: 334
    },

    COMM: {
        CHAT: 335,
        MAIL: 336,
        CALENDAR: 337,
        CLOCK: 338,
        MAP_PIN: 339,
        HEART: 340,
        STAR: 341,
        SUN: 342,
        MOON: 343
    }
};

// ⚡ ANIMATION SUB-OPCODES (0 to 8)
const TITAN_ANIM = {
    STATIC: 0,
    PULSE:  1,
    SPIN:   2,
    BOUNCE: 3,
    RING:   4,
    RIPPLE: 5,
    WAVE:   6,
    FLASH:  7,
    GLOW:   8
};

const ANIM_CLASSES = {
    0: '',
    1: 'titan-anim-pulse',
    2: 'titan-anim-spin',
    3: 'titan-anim-bounce',
    4: 'titan-anim-ring',
    5: 'titan-anim-ripple',
    6: 'titan-anim-wave',
    7: 'titan-anim-flash',
    8: 'titan-anim-glow'
};

const ANIM_KEYFRAMES_CSS = `
@keyframes titan-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } }
@keyframes titan-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes titan-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes titan-ring { 0% { transform: rotate(0); } 10%, 30%, 50%, 70%, 90% { transform: rotate(-12deg); } 20%, 40%, 60%, 80% { transform: rotate(12deg); } 100% { transform: rotate(0); } }
@keyframes titan-ripple { 0% { transform: scale(0.95); stroke-opacity: 0.8; } 50% { transform: scale(1.05); stroke-opacity: 0.3; } 100% { transform: scale(0.95); stroke-opacity: 0.8; } }
@keyframes titan-wave { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.6); } }
@keyframes titan-flash { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
@keyframes titan-glow { 0%, 100% { filter: drop-shadow(0 0 3px currentColor); } 50% { filter: drop-shadow(0 0 10px currentColor); } }

.titan-anim-pulse { animation: titan-pulse 1.8s infinite ease-in-out; transform-origin: center; }
.titan-anim-spin { animation: titan-spin 1.5s infinite linear; transform-origin: center; }
.titan-anim-bounce { animation: titan-bounce 1s infinite ease-in-out; transform-origin: center; }
.titan-anim-ring { animation: titan-ring 1.2s infinite ease-in-out; transform-origin: center; }
.titan-anim-ripple { animation: titan-ripple 2s infinite ease-in-out; transform-origin: center; }
.titan-anim-wave { animation: titan-wave 1s infinite ease-in-out; transform-origin: center; }
.titan-anim-flash { animation: titan-flash 0.6s infinite ease-in-out; transform-origin: center; }
.titan-anim-glow { animation: titan-glow 1.5s infinite ease-in-out; transform-origin: center; }
`;

const ICONS_256 = {
    "0": {
        "name": "idle_phone",
        "theme": "slate",
        "label": "Standby Phone",
        "svg": "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\" fill=\"none\" stroke=\"#64748b\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>"
    },
    "1": {
        "name": "incoming_voice",
        "theme": "emerald",
        "label": "Incoming Call",
        "svg": "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><polyline points=\"16 2 20 6 16 10\" fill=\"none\" stroke=\"#6ee7b7\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><line x1=\"20\" y1=\"6\" x2=\"11\" y2=\"15\" stroke=\"#6ee7b7\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>"
    },
    "2": {
        "name": "incoming_video",
        "theme": "purple",
        "label": "Incoming Video",
        "svg": "<polygon points=\"23 7 16 12 23 17 23 7\" fill=\"rgba(192,132,252,0.3)\" stroke=\"#c084fc\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/><rect x=\"1\" y=\"5\" width=\"15\" height=\"14\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><polyline points=\"10 9 10 13 6 13\" fill=\"none\" stroke=\"#38bdf8\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><line x1=\"10\" y1=\"13\" x2=\"5\" y2=\"8\" stroke=\"#38bdf8\" stroke-width=\"2\" stroke-linecap=\"round\"/>"
    },
    "3": {
        "name": "outgoing_voice",
        "theme": "amber",
        "label": "Outgoing Call",
        "svg": "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><polyline points=\"20 10 20 4 14 4\" fill=\"none\" stroke=\"#fde047\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><line x1=\"13\" y1=\"11\" x2=\"20\" y2=\"4\" stroke=\"#fde047\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>"
    },
    "4": {
        "name": "missed_call",
        "theme": "red",
        "label": "Missed Call",
        "svg": "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\" fill=\"none\" stroke=\"#f87171\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><line x1=\"22\" y1=\"2\" x2=\"16\" y2=\"8\" stroke=\"#ef4444\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"16\" y1=\"2\" x2=\"22\" y2=\"8\" stroke=\"#ef4444\" stroke-width=\"3\" stroke-linecap=\"round\"/>"
    },
    "5": {
        "name": "active_call",
        "theme": "emerald",
        "label": "Connected Call",
        "svg": "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M14 2a8 8 0 0 1 8 8\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M14 6a4 4 0 0 1 4 4\" fill=\"none\" stroke=\"#6ee7b7\" stroke-width=\"2\" stroke-linecap=\"round\"/>"
    },
    "6": {
        "name": "mic_mute",
        "theme": "red",
        "label": "Microphone Muted",
        "svg": "<line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\" stroke=\"#f43f5e\" stroke-width=\"2.5\" stroke-linecap=\"round\"/><path d=\"M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6\" fill=\"none\" stroke=\"#f43f5e\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23\" fill=\"none\" stroke=\"#f43f5e\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"23\" stroke=\"#f43f5e\" stroke-width=\"2\"/><line x1=\"8\" y1=\"23\" x2=\"16\" y2=\"23\" stroke=\"#f43f5e\" stroke-width=\"2\"/>"
    },
    "7": {
        "name": "chat_unread",
        "theme": "cyan",
        "label": "New Chat Message",
        "svg": "<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\" fill=\"rgba(34,211,238,0.2)\" stroke=\"#22d3ee\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><circle cx=\"8\" cy=\"10\" r=\"1.2\" fill=\"#22d3ee\"/><circle cx=\"12\" cy=\"10\" r=\"1.2\" fill=\"#22d3ee\"/><circle cx=\"16\" cy=\"10\" r=\"1.2\" fill=\"#22d3ee\"/>"
    },
    "8": {
        "name": "voicemail",
        "theme": "purple",
        "label": "Voicemail Audio",
        "svg": "<circle cx=\"5.5\" cy=\"11.5\" r=\"4.5\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"18.5\" cy=\"11.5\" r=\"4.5\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"5.5\" y1=\"16\" x2=\"18.5\" y2=\"16\" stroke=\"#c084fc\" stroke-width=\"2\"/>"
    },
    "9": {
        "name": "headset",
        "theme": "emerald",
        "label": "Call Center Headset",
        "svg": "<path d=\"M3 18v-6a9 9 0 0 1 18 0v6\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "10": {
        "name": "call_forward",
        "theme": "amber",
        "label": "Call Forwarding",
        "svg": "<polyline points=\"15 14 20 9 15 4\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M4 20v-7a4 4 0 0 1 4-4h12\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\" stroke-linecap=\"round\"/>"
    },
    "11": {
        "name": "call_hold",
        "theme": "amber",
        "label": "Call On Hold",
        "svg": "<rect x=\"6\" y=\"4\" width=\"4\" height=\"16\" fill=\"#fbbf24\" rx=\"1\"/><rect x=\"14\" y=\"4\" width=\"4\" height=\"16\" fill=\"#fbbf24\" rx=\"1\"/>"
    },
    "12": {
        "name": "call_transfer",
        "theme": "cyan",
        "label": "Call Transfer",
        "svg": "<path d=\"M16 3h5v5\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M4 20L21 3\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M21 16v5h-5\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M15 15l6 6\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "13": {
        "name": "conference_call",
        "theme": "purple",
        "label": "Group Conference",
        "svg": "<path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"9\" cy=\"7\" r=\"4\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><path d=\"M23 21v-2a4 4 0 0 0-3-3.87\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><path d=\"M16 3.13a4 4 0 0 1 0 7.75\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/>"
    },
    "14": {
        "name": "call_recording",
        "theme": "red",
        "label": "Audio Recording",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#f87171\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"4\" fill=\"#ef4444\"/>"
    },
    "15": {
        "name": "dtmf_keypad",
        "theme": "cyan",
        "label": "Dialpad Matrix",
        "svg": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"3\" fill=\"none\" stroke=\"#ffffff\" stroke-width=\"2\"/><circle cx=\"8\" cy=\"8\" r=\"1.2\" fill=\"#fff\"/><circle cx=\"12\" cy=\"8\" r=\"1.2\" fill=\"#fff\"/><circle cx=\"16\" cy=\"8\" r=\"1.2\" fill=\"#fff\"/><circle cx=\"8\" cy=\"12\" r=\"1.2\" fill=\"#fff\"/><circle cx=\"12\" cy=\"12\" r=\"1.2\" fill=\"#fff\"/><circle cx=\"16\" cy=\"12\" r=\"1.2\" fill=\"#fff\"/><circle cx=\"8\" cy=\"16\" r=\"1.2\" fill=\"#fff\"/><circle cx=\"12\" cy=\"16\" r=\"1.2\" fill=\"#fff\"/><circle cx=\"16\" cy=\"16\" r=\"1.2\" fill=\"#fff\"/>"
    },
    "16": {
        "name": "speakerphone",
        "theme": "emerald",
        "label": "Speakerphone",
        "svg": "<polygon points=\"11 5 6 9 2 9 2 15 6 15 11 19 11 5\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M15.54 8.46a5 5 0 0 1 0 7.07\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M19.07 4.93a10 10 0 0 1 0 14.14\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "17": {
        "name": "bluetooth_audio",
        "theme": "cyan",
        "label": "Bluetooth Audio",
        "svg": "<polyline points=\"6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "18": {
        "name": "phone_locked",
        "theme": "red",
        "label": "Phone Line Locked",
        "svg": "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3\" fill=\"none\" stroke=\"#f87171\" stroke-width=\"2\"/><rect x=\"14\" y=\"2\" width=\"8\" height=\"6\" rx=\"1\" fill=\"none\" stroke=\"#f87171\" stroke-width=\"1.5\"/>"
    },
    "19": {
        "name": "phone_ring",
        "theme": "amber",
        "label": "Ringing Alert",
        "svg": "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><path d=\"M18 2a5 5 0 0 1 5 5\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>"
    },
    "20": {
        "name": "intercom_bell",
        "theme": "cyan",
        "label": "Intercom Bell",
        "svg": "<path d=\"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M13.73 21a2 2 0 0 1-3.46 0\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "21": {
        "name": "call_park",
        "theme": "purple",
        "label": "Call Park Slot",
        "svg": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"4\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><path d=\"M9 16V8h4a2 2 0 0 1 0 4H9\" stroke=\"#c084fc\" stroke-width=\"2\"/>"
    },
    "22": {
        "name": "ivr_menu",
        "theme": "emerald",
        "label": "IVR Auto Attendant",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M8 12h8M12 8v8\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "23": {
        "name": "music_on_hold",
        "theme": "purple",
        "label": "Music on Hold",
        "svg": "<path d=\"M9 18V5l12-2v13\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"6\" cy=\"18\" r=\"3\" fill=\"#c084fc\"/><circle cx=\"18\" cy=\"16\" r=\"3\" fill=\"#c084fc\"/>"
    },
    "24": {
        "name": "call_queue",
        "theme": "cyan",
        "label": "Queue Waiting",
        "svg": "<path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\" stroke=\"#22d3ee\" stroke-width=\"2\" fill=\"none\"/><circle cx=\"9\" cy=\"7\" r=\"4\" stroke=\"#22d3ee\" stroke-width=\"2\" fill=\"none\"/><path d=\"M23 21v-2a4 4 0 0 0-3-3.87\" stroke=\"#22d3ee\" stroke-width=\"2\" fill=\"none\"/>"
    },
    "25": {
        "name": "dial_tone",
        "theme": "emerald",
        "label": "Dial Tone Wave",
        "svg": "<path d=\"M2 12h4l3-6 6 12 3-6h4\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "26": {
        "name": "emergency_e911",
        "theme": "red",
        "label": "E911 Emergency",
        "svg": "<polygon points=\"12 2 2 22 22 22 12 2\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"12\" y1=\"9\" x2=\"12\" y2=\"13\" stroke=\"#ef4444\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"17\" r=\"1\" fill=\"#ef4444\"/>"
    },
    "27": {
        "name": "backspace_delete",
        "theme": "slate",
        "label": "Delete Backspace",
        "svg": "<path d=\"M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"18\" y1=\"9\" x2=\"12\" y2=\"15\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"12\" y1=\"9\" x2=\"18\" y2=\"15\" stroke=\"#94a3b8\" stroke-width=\"2\"/>"
    },
    "28": {
        "name": "volume_mute",
        "theme": "slate",
        "label": "Audio Muted",
        "svg": "<polygon points=\"11 5 6 9 2 9 2 15 6 15 11 19 11 5\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"23\" y1=\"9\" x2=\"17\" y2=\"15\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"17\" y1=\"9\" x2=\"23\" y2=\"15\" stroke=\"#94a3b8\" stroke-width=\"2\"/>"
    },
    "29": {
        "name": "volume_up",
        "theme": "emerald",
        "label": "Volume High",
        "svg": "<polygon points=\"11 5 6 9 2 9 2 15 6 15 11 19 11 5\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "30": {
        "name": "speed_dial",
        "theme": "cyan",
        "label": "Speed Dial Key",
        "svg": "<polygon points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "31": {
        "name": "hangup_call",
        "theme": "red",
        "label": "Call Terminated",
        "svg": "<path d=\"M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91\" fill=\"none\" stroke=\"#f87171\" stroke-width=\"2\"/><line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\" stroke=\"#ef4444\" stroke-width=\"2.5\"/>"
    },
    "32": {
        "name": "chat_bubble",
        "theme": "cyan",
        "label": "Chat Room",
        "svg": "<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "33": {
        "name": "typing_indicator",
        "theme": "cyan",
        "label": "Typing Dots",
        "svg": "<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><circle cx=\"8\" cy=\"11\" r=\"1.5\" fill=\"#22d3ee\"/><circle cx=\"12\" cy=\"11\" r=\"1.5\" fill=\"#22d3ee\"/><circle cx=\"16\" cy=\"11\" r=\"1.5\" fill=\"#22d3ee\"/>"
    },
    "34": {
        "name": "msg_sent",
        "theme": "slate",
        "label": "Message Sent",
        "svg": "<polyline points=\"20 6 9 17 4 12\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/>"
    },
    "35": {
        "name": "msg_delivered",
        "theme": "cyan",
        "label": "Message Delivered",
        "svg": "<polyline points=\"18 6 7 17 2 12\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><polyline points=\"22 6 11 17 8 14\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "36": {
        "name": "msg_read",
        "theme": "emerald",
        "label": "Message Read",
        "svg": "<polyline points=\"18 6 7 17 2 12\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2.5\"/><polyline points=\"22 6 11 17 8 14\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2.5\"/>"
    },
    "37": {
        "name": "attachment_clip",
        "theme": "slate",
        "label": "Attachment File",
        "svg": "<path d=\"M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/>"
    },
    "38": {
        "name": "image_media",
        "theme": "purple",
        "label": "Image Picture",
        "svg": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"8.5\" cy=\"8.5\" r=\"1.5\" fill=\"#c084fc\"/><polyline points=\"21 15 16 10 5 21\" stroke=\"#c084fc\" stroke-width=\"2\" fill=\"none\"/>"
    },
    "39": {
        "name": "audio_mic_note",
        "theme": "emerald",
        "label": "Voice Note",
        "svg": "<path d=\"M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "40": {
        "name": "emoji_happy",
        "theme": "amber",
        "label": "Emoji Smile",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><path d=\"M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01\" stroke=\"#fbbf24\" stroke-width=\"2\"/>"
    },
    "41": {
        "name": "send_paper_plane",
        "theme": "cyan",
        "label": "Send Dispatch",
        "svg": "<line x1=\"22\" y1=\"2\" x2=\"11\" y2=\"13\" stroke=\"#22d3ee\" stroke-width=\"2\"/><polygon points=\"22 2 15 22 11 13 2 9 22 2\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "42": {
        "name": "location_pin",
        "theme": "red",
        "label": "Location Pin",
        "svg": "<path d=\"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"10\" r=\"3\" fill=\"#ef4444\"/>"
    },
    "43": {
        "name": "contact_card",
        "theme": "cyan",
        "label": "Contact Card",
        "svg": "<path d=\"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"7\" r=\"4\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "44": {
        "name": "contacts_directory",
        "theme": "purple",
        "label": "Directory Contacts",
        "svg": "<path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"9\" cy=\"7\" r=\"4\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><path d=\"M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75\" stroke=\"#c084fc\" stroke-width=\"2\"/>"
    },
    "45": {
        "name": "star_favorite",
        "theme": "amber",
        "label": "Star Favorite",
        "svg": "<polygon points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>"
    },
    "46": {
        "name": "pin_chat",
        "theme": "cyan",
        "label": "Pin Conversation",
        "svg": "<path d=\"M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "47": {
        "name": "search_chat",
        "theme": "slate",
        "label": "Search Chat",
        "svg": "<circle cx=\"11\" cy=\"11\" r=\"8\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\" stroke=\"#94a3b8\" stroke-width=\"2\"/>"
    },
    "48": {
        "name": "presence_online",
        "theme": "emerald",
        "label": "Online Status",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"6\" fill=\"#34d399\"/><circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "49": {
        "name": "history_recent",
        "theme": "cyan",
        "label": "Recent Call History",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><polyline points=\"12 6 12 12 14 14\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "50": {
        "name": "presence_busy",
        "theme": "amber",
        "label": "Busy Status",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"8\" y1=\"12\" x2=\"16\" y2=\"12\" stroke=\"#fbbf24\" stroke-width=\"2.5\"/>"
    },
    "51": {
        "name": "presence_away",
        "theme": "amber",
        "label": "Away Status",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"2\"/><polyline points=\"12 6 12 12 15 15\" stroke=\"#f59e0b\" stroke-width=\"2\" fill=\"none\"/>"
    },
    "52": {
        "name": "presence_dnd",
        "theme": "red",
        "label": "DND Mode",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"7\" y1=\"12\" x2=\"17\" y2=\"12\" stroke=\"#ffffff\" stroke-width=\"3\"/>"
    },
    "53": {
        "name": "presence_offline",
        "theme": "slate",
        "label": "Offline Status",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#64748b\" stroke-width=\"2\"/>"
    },
    "54": {
        "name": "group_channel",
        "theme": "purple",
        "label": "Broadcast Channel",
        "svg": "<path d=\"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/>"
    },
    "55": {
        "name": "announcement",
        "theme": "amber",
        "label": "Announcement",
        "svg": "<path d=\"M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>"
    },
    "56": {
        "name": "back_arrow",
        "theme": "cyan",
        "label": "Back Arrow",
        "svg": "<line x1=\"19\" y1=\"12\" x2=\"5\" y2=\"12\" stroke=\"#22d3ee\" stroke-width=\"2.5\"/><polyline points=\"12 19 5 12 12 5\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2.5\"/>"
    },
    "57": {
        "name": "forward_arrow",
        "theme": "cyan",
        "label": "Forward Arrow",
        "svg": "<line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\" stroke=\"#22d3ee\" stroke-width=\"2.5\"/><polyline points=\"12 5 19 12 12 19\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2.5\"/>"
    },
    "58": {
        "name": "reply_thread",
        "theme": "cyan",
        "label": "Reply Thread",
        "svg": "<polyline points=\"9 17 4 12 9 7\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M20 18v-2a4 4 0 0 0-4-4H4\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "59": {
        "name": "share_link",
        "theme": "purple",
        "label": "Share Link",
        "svg": "<circle cx=\"18\" cy=\"5\" r=\"3\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"6\" cy=\"12\" r=\"3\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"18\" cy=\"19\" r=\"3\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"8.59\" y1=\"13.51\" x2=\"15.42\" y2=\"17.49\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"15.41\" y1=\"6.51\" x2=\"8.59\" y2=\"10.49\" stroke=\"#c084fc\" stroke-width=\"2\"/>"
    },
    "60": {
        "name": "ai_bot_assistant",
        "theme": "cyan",
        "label": "AI Titan Agent",
        "svg": "<path d=\"M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><rect x=\"4\" y=\"8\" width=\"16\" height=\"12\" rx=\"4\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><circle cx=\"9\" cy=\"14\" r=\"1\" fill=\"#22d3ee\"/><circle cx=\"15\" cy=\"14\" r=\"1\" fill=\"#22d3ee\"/>"
    },
    "61": {
        "name": "verified_badge",
        "theme": "cyan",
        "label": "Verified Identity",
        "svg": "<path d=\"M12 2l2.4 2.8 3.7-.4 1.2 3.5 3.3 1.7-1 3.6 1.7 3.3-2.8 2.4.4 3.7-3.5 1.2-1.7 3.3-3.6-1-3.3 1.7-2.4-2.8-3.7.4-1.2-3.5-3.3-1.7 1-3.6-1.7-3.3 2.8-2.4-.4-3.7 3.5-1.2 1.7-3.3 3.6 1z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"1.8\"/><polyline points=\"9 12 11 14 15 10\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "62": {
        "name": "block_user",
        "theme": "red",
        "label": "Block Contact",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"4.93\" y1=\"4.93\" x2=\"19.07\" y2=\"19.07\" stroke=\"#ef4444\" stroke-width=\"2\"/>"
    },
    "63": {
        "name": "mute_notifications",
        "theme": "slate",
        "label": "Bell Muted",
        "svg": "<path d=\"M13.73 21a2 2 0 0 1-3.46 0M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\" stroke=\"#ef4444\" stroke-width=\"2\"/>"
    },
    "64": {
        "name": "cpu_chip",
        "theme": "emerald",
        "label": "CPU Processor",
        "svg": "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\" fill=\"rgba(52,211,153,0.15)\" stroke=\"#34d399\" stroke-width=\"2\"/><rect x=\"9\" y=\"9\" width=\"6\" height=\"6\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"1.5\"/><path d=\"M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3\" stroke=\"#34d399\" stroke-width=\"1.8\" stroke-linecap=\"round\"/>"
    },
    "65": {
        "name": "mcu_board",
        "theme": "cyan",
        "label": "MCU NodeMCU",
        "svg": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"7\" y1=\"8\" x2=\"17\" y2=\"8\" stroke=\"#22d3ee\" stroke-width=\"1.5\"/><line x1=\"7\" y1=\"12\" x2=\"17\" y2=\"12\" stroke=\"#22d3ee\" stroke-width=\"1.5\"/><line x1=\"7\" y1=\"16\" x2=\"17\" y2=\"16\" stroke=\"#22d3ee\" stroke-width=\"1.5\"/>"
    },
    "66": {
        "name": "relay_module",
        "theme": "purple",
        "label": "Relay Module",
        "svg": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"8\" cy=\"12\" r=\"2\" fill=\"#c084fc\"/><path d=\"M14 8h4M14 12h4M14 16h4\" stroke=\"#c084fc\" stroke-width=\"1.5\"/>"
    },
    "67": {
        "name": "solenoid_lock",
        "theme": "amber",
        "label": "Solenoid Door Lock",
        "svg": "<rect x=\"5\" y=\"11\" width=\"14\" height=\"10\" rx=\"2\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><path d=\"M8 11V7a4 4 0 0 1 8 0v4\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>"
    },
    "68": {
        "name": "rfid_nfc",
        "theme": "cyan",
        "label": "RFID NFC Reader",
        "svg": "<path d=\"M4 10a8 8 0 0 1 16 0M7 13a5 5 0 0 1 10 0M10 16a2 2 0 0 1 4 0\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"19\" r=\"1\" fill=\"#22d3ee\"/>"
    },
    "69": {
        "name": "temperature_sensor",
        "theme": "red",
        "label": "Temperature ADC",
        "svg": "<path d=\"M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z\" fill=\"none\" stroke=\"#f87171\" stroke-width=\"2\"/>"
    },
    "70": {
        "name": "humidity_sensor",
        "theme": "cyan",
        "label": "Humidity Sensor",
        "svg": "<path d=\"M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "71": {
        "name": "pressure_baro",
        "theme": "purple",
        "label": "Barometer Sensor",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><path d=\"M12 6v6l4 2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/>"
    },
    "72": {
        "name": "ambient_light",
        "theme": "amber",
        "label": "Light LDR Sensor",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"5\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"12\" y1=\"1\" x2=\"12\" y2=\"3\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"23\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"4.22\" y1=\"4.22\" x2=\"5.64\" y2=\"5.64\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"18.36\" y1=\"18.36\" x2=\"19.78\" y2=\"19.78\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"1\" y1=\"12\" x2=\"3\" y2=\"12\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"21\" y1=\"12\" x2=\"23\" y2=\"12\" stroke=\"#fbbf24\" stroke-width=\"2\"/>"
    },
    "73": {
        "name": "pir_motion",
        "theme": "emerald",
        "label": "PIR Motion Sensor",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"4\" fill=\"#34d399\"/><path d=\"M6 6a9 9 0 0 1 12 0M3 3a13 13 0 0 1 18 0\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "74": {
        "name": "gas_smoke",
        "theme": "red",
        "label": "Gas Smoke Detector",
        "svg": "<path d=\"M8 19h8a4 4 0 0 0 0-8 6 6 0 0 0-11.8 1.4A4 4 0 0 0 8 19z\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/>"
    },
    "75": {
        "name": "water_leak",
        "theme": "cyan",
        "label": "Water Leak Sensor",
        "svg": "<path d=\"M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z\" fill=\"none\" stroke=\"#06b6d4\" stroke-width=\"2\"/><line x1=\"2\" y1=\"22\" x2=\"22\" y2=\"22\" stroke=\"#06b6d4\" stroke-width=\"2\"/>"
    },
    "76": {
        "name": "accelerometer",
        "theme": "purple",
        "label": "Accelerometer Gyro",
        "svg": "<polygon points=\"12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"12\" y1=\"22\" x2=\"12\" y2=\"12\" stroke=\"#c084fc\" stroke-width=\"1.5\"/><polyline points=\"22 8.5 12 12 2 8.5\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"1.5\"/>"
    },
    "77": {
        "name": "magnetic_reed",
        "theme": "amber",
        "label": "Magnetic Reed Switch",
        "svg": "<rect x=\"4\" y=\"6\" width=\"6\" height=\"12\" rx=\"1\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><rect x=\"14\" y=\"6\" width=\"6\" height=\"12\" rx=\"1\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>"
    },
    "78": {
        "name": "adc_voltage",
        "theme": "cyan",
        "label": "ADC Voltage Probe",
        "svg": "<polyline points=\"22 12 18 12 15 21 9 3 6 12 2 12\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "79": {
        "name": "fingerprint_sensor",
        "theme": "emerald",
        "label": "Biometric Fingerprint",
        "svg": "<path d=\"M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4M5 19.5C5.5 18 6 15 6 12c0-3.3 2.7-6 6-6 2.5 0 4.6 1.5 5.5 3.7M12 12v3a3 3 0 0 1-3 3M19 14.5a8 8 0 0 1-2 5.5\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "80": {
        "name": "relay_ch1",
        "theme": "emerald",
        "label": "Relay CH-1 (ON)",
        "svg": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><circle cx=\"8\" cy=\"12\" r=\"2\" fill=\"#34d399\"/>"
    },
    "81": {
        "name": "relay_ch2",
        "theme": "emerald",
        "label": "Relay CH-2 (ON)",
        "svg": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><circle cx=\"16\" cy=\"12\" r=\"2\" fill=\"#34d399\"/>"
    },
    "82": {
        "name": "relay_ch3",
        "theme": "purple",
        "label": "Relay CH-3 (ON)",
        "svg": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"8\" cy=\"9\" r=\"2\" fill=\"#c084fc\"/><circle cx=\"8\" cy=\"15\" r=\"2\" fill=\"#c084fc\"/>"
    },
    "83": {
        "name": "relay_ch4",
        "theme": "purple",
        "label": "Relay CH-4 (ON)",
        "svg": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"16\" cy=\"9\" r=\"2\" fill=\"#c084fc\"/><circle cx=\"16\" cy=\"15\" r=\"2\" fill=\"#c084fc\"/>"
    },
    "84": {
        "name": "i2c_bus",
        "theme": "cyan",
        "label": "I2C Data Bus",
        "svg": "<rect x=\"3\" y=\"7\" width=\"18\" height=\"10\" rx=\"2\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"7\" y1=\"2\" x2=\"7\" y2=\"7\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"17\" y1=\"2\" x2=\"17\" y2=\"7\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "85": {
        "name": "spi_bus",
        "theme": "purple",
        "label": "SPI Serial Bus",
        "svg": "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"4\" y1=\"9\" x2=\"20\" y2=\"9\" stroke=\"#c084fc\"/><line x1=\"4\" y1=\"15\" x2=\"20\" y2=\"15\" stroke=\"#c084fc\"/>"
    },
    "86": {
        "name": "uart_serial",
        "theme": "amber",
        "label": "UART RX/TX Port",
        "svg": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"3\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><polyline points=\"7 10 10 12 7 14\" stroke=\"#fbbf24\" stroke-width=\"2\" fill=\"none\"/><line x1=\"13\" y1=\"14\" x2=\"17\" y2=\"14\" stroke=\"#fbbf24\" stroke-width=\"2\"/>"
    },
    "87": {
        "name": "pwm_motor",
        "theme": "cyan",
        "label": "PWM Stepper Motor",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M12 7v5l3 3\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "88": {
        "name": "buzzer_alarm",
        "theme": "red",
        "label": "Buzzer Piezo",
        "svg": "<path d=\"M11 5L6 9H2v6h4l5 4V5zM15 9l6 6M21 9l-6 6\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/>"
    },
    "89": {
        "name": "seven_segment_led",
        "theme": "red",
        "label": "7-Segment Display",
        "svg": "<rect x=\"4\" y=\"3\" width=\"16\" height=\"18\" rx=\"2\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"7\" y1=\"6\" x2=\"17\" y2=\"6\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"17\" y1=\"6\" x2=\"17\" y2=\"12\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"7\" y1=\"12\" x2=\"17\" y2=\"12\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"7\" y1=\"12\" x2=\"7\" y2=\"18\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"7\" y1=\"18\" x2=\"17\" y2=\"18\" stroke=\"#ef4444\" stroke-width=\"2\"/>"
    },
    "90": {
        "name": "matrix_lcd_16x2",
        "theme": "emerald",
        "label": "Matrix LCD Screen",
        "svg": "<rect x=\"2\" y=\"5\" width=\"20\" height=\"14\" rx=\"2\" fill=\"rgba(16,185,129,0.2)\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"5\" y1=\"9\" x2=\"19\" y2=\"9\" stroke=\"#34d399\"/><line x1=\"5\" y1=\"14\" x2=\"15\" y2=\"14\" stroke=\"#34d399\"/>"
    },
    "91": {
        "name": "oled_display",
        "theme": "cyan",
        "label": "OLED SSD1306 Display",
        "svg": "<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"3\" fill=\"#22d3ee\"/>"
    },
    "92": {
        "name": "led_indicator",
        "theme": "emerald",
        "label": "LED Status Diode",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"5\" fill=\"#34d399\"/><circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "93": {
        "name": "rotary_encoder",
        "theme": "purple",
        "label": "Rotary Encoder Knob",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"3\" fill=\"#c084fc\"/><line x1=\"12\" y1=\"3\" x2=\"12\" y2=\"6\" stroke=\"#c084fc\" stroke-width=\"2\"/>"
    },
    "94": {
        "name": "potentiometer",
        "theme": "amber",
        "label": "Analog Potentiometer",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><path d=\"M12 12l5-5\" stroke=\"#fbbf24\" stroke-width=\"2.5\"/>"
    },
    "95": {
        "name": "dac_audio",
        "theme": "emerald",
        "label": "DAC Audio Output",
        "svg": "<path d=\"M2 12h5l3-7 4 14 3-7h5\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "96": {
        "name": "ac_power_plug",
        "theme": "emerald",
        "label": "AC Mains Power",
        "svg": "<path d=\"M12 2v6m0 8v6M8 8v4m8-4v4M5 12h14v2a7 7 0 0 1-14 0v-2z\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "97": {
        "name": "battery_charging",
        "theme": "amber",
        "label": "Battery Charging",
        "svg": "<rect x=\"1\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"23\" y1=\"11\" x2=\"23\" y2=\"13\" stroke=\"#fbbf24\" stroke-width=\"2\"/><polygon points=\"10 8 7 13 11 13 9 17 14 11 10 11 10 8\" fill=\"#fbbf24\"/>"
    },
    "98": {
        "name": "battery_100",
        "theme": "emerald",
        "label": "Battery 100%",
        "svg": "<rect x=\"1\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"23\" y1=\"11\" x2=\"23\" y2=\"13\" stroke=\"#34d399\" stroke-width=\"2\"/><rect x=\"3\" y=\"8\" width=\"14\" height=\"8\" rx=\"1\" fill=\"#34d399\"/>"
    },
    "99": {
        "name": "battery_75",
        "theme": "emerald",
        "label": "Battery 75%",
        "svg": "<rect x=\"1\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"23\" y1=\"11\" x2=\"23\" y2=\"13\" stroke=\"#34d399\" stroke-width=\"2\"/><rect x=\"3\" y=\"8\" width=\"10.5\" height=\"8\" rx=\"1\" fill=\"#34d399\"/>"
    },
    "100": {
        "name": "battery_50",
        "theme": "amber",
        "label": "Battery 50%",
        "svg": "<rect x=\"1\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"23\" y1=\"11\" x2=\"23\" y2=\"13\" stroke=\"#fbbf24\" stroke-width=\"2\"/><rect x=\"3\" y=\"8\" width=\"7\" height=\"8\" rx=\"1\" fill=\"#fbbf24\"/>"
    },
    "101": {
        "name": "battery_25",
        "theme": "amber",
        "label": "Battery 25%",
        "svg": "<rect x=\"1\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"23\" y1=\"11\" x2=\"23\" y2=\"13\" stroke=\"#fbbf24\" stroke-width=\"2\"/><rect x=\"3\" y=\"8\" width=\"3.5\" height=\"8\" rx=\"1\" fill=\"#fbbf24\"/>"
    },
    "102": {
        "name": "battery_critical",
        "theme": "red",
        "label": "Battery 5% Alert",
        "svg": "<rect x=\"1\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"23\" y1=\"11\" x2=\"23\" y2=\"13\" stroke=\"#ef4444\" stroke-width=\"2\"/><rect x=\"3\" y=\"8\" width=\"2\" height=\"8\" rx=\"1\" fill=\"#ef4444\"/>"
    },
    "103": {
        "name": "battery_eco_save",
        "theme": "emerald",
        "label": "Battery Eco Mode",
        "svg": "<rect x=\"1\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\" fill=\"none\" stroke=\"#10b981\" stroke-width=\"2\"/><line x1=\"23\" y1=\"11\" x2=\"23\" y2=\"13\" stroke=\"#10b981\" stroke-width=\"2\"/><path d=\"M9 14s2-4 5-4\" stroke=\"#10b981\" stroke-width=\"2\"/>"
    },
    "104": {
        "name": "solar_panel",
        "theme": "amber",
        "label": "Solar Photovoltaic",
        "svg": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"3\" y1=\"12\" x2=\"21\" y2=\"12\" stroke=\"#fbbf24\"/><line x1=\"9\" y1=\"4\" x2=\"9\" y2=\"20\" stroke=\"#fbbf24\"/><line x1=\"15\" y1=\"4\" x2=\"15\" y2=\"20\" stroke=\"#fbbf24\"/>"
    },
    "105": {
        "name": "generator_power",
        "theme": "purple",
        "label": "Generator Unit",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><path d=\"M12 6v6l3 3\" stroke=\"#c084fc\" stroke-width=\"2\"/>"
    },
    "106": {
        "name": "ups_backup",
        "theme": "emerald",
        "label": "UPS Smart Battery",
        "svg": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"3\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M8 8h8M8 12h8M8 16h5\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "107": {
        "name": "voltage_high",
        "theme": "amber",
        "label": "High Voltage Danger",
        "svg": "<polygon points=\"13 2 3 14 12 14 11 22 21 10 12 10 13 2\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>"
    },
    "108": {
        "name": "fuse_breaker",
        "theme": "red",
        "label": "Circuit Breaker",
        "svg": "<rect x=\"6\" y=\"2\" width=\"12\" height=\"20\" rx=\"2\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"12\" y1=\"6\" x2=\"12\" y2=\"10\" stroke=\"#ef4444\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"15\" r=\"2\" fill=\"#ef4444\"/>"
    },
    "109": {
        "name": "power_meter",
        "theme": "cyan",
        "label": "KWh Power Meter",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M12 12l4-3\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "110": {
        "name": "current_shunt",
        "theme": "purple",
        "label": "Ampere Shunt",
        "svg": "<path d=\"M4 12h4l4-8 4 16 4-8h4\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/>"
    },
    "111": {
        "name": "transformer_step",
        "theme": "amber",
        "label": "AC Transformer",
        "svg": "<circle cx=\"8\" cy=\"12\" r=\"5\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><circle cx=\"16\" cy=\"12\" r=\"5\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>"
    },
    "112": {
        "name": "ground_earth",
        "theme": "emerald",
        "label": "Chassis Earth Ground",
        "svg": "<line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"12\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"4\" y1=\"12\" x2=\"20\" y2=\"12\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"7\" y1=\"16\" x2=\"17\" y2=\"16\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"10\" y1=\"20\" x2=\"14\" y2=\"20\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "113": {
        "name": "capacitor_bank",
        "theme": "cyan",
        "label": "Capacitor Bank",
        "svg": "<line x1=\"2\" y1=\"12\" x2=\"10\" y2=\"12\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"14\" y1=\"12\" x2=\"22\" y2=\"12\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"10\" y1=\"5\" x2=\"10\" y2=\"19\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"14\" y1=\"5\" x2=\"14\" y2=\"19\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "114": {
        "name": "inductor_coil",
        "theme": "purple",
        "label": "Inductor Choke",
        "svg": "<path d=\"M3 12a3 3 0 0 1 6 0 3 3 0 0 1 6 0 3 3 0 0 1 6 0\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/>"
    },
    "115": {
        "name": "diode_rectifier",
        "theme": "amber",
        "label": "Rectifier Bridge",
        "svg": "<polygon points=\"8 4 16 12 8 20 8 4\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"16\" y1=\"4\" x2=\"16\" y2=\"20\" stroke=\"#fbbf24\" stroke-width=\"2\"/>"
    },
    "116": {
        "name": "inverter_dc_ac",
        "theme": "cyan",
        "label": "DC-AC Inverter",
        "svg": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"6\" y1=\"10\" x2=\"10\" y2=\"10\" stroke=\"#22d3ee\"/><path d=\"M14 14s1-2 2-2 2 2 2 2\" stroke=\"#22d3ee\" fill=\"none\"/>"
    },
    "117": {
        "name": "power_plug_euro",
        "theme": "slate",
        "label": "Euro Schuko Plug",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><circle cx=\"9\" cy=\"12\" r=\"1.5\" fill=\"#94a3b8\"/><circle cx=\"15\" cy=\"12\" r=\"1.5\" fill=\"#94a3b8\"/>"
    },
    "118": {
        "name": "power_plug_us",
        "theme": "slate",
        "label": "NEMA US Plug",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"9\" y1=\"9\" x2=\"9\" y2=\"15\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"15\" y1=\"9\" x2=\"15\" y2=\"15\" stroke=\"#94a3b8\" stroke-width=\"2\"/>"
    },
    "119": {
        "name": "wireless_charge",
        "theme": "cyan",
        "label": "Qi Wireless Charge",
        "svg": "<path d=\"M6 18a8 8 0 0 1 12 0M8 15a5 5 0 0 1 8 0\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><polygon points=\"12 4 9 9 13 9 11 14 15 9 12 9 12 4\" fill=\"#22d3ee\"/>"
    },
    "120": {
        "name": "energy_leaf",
        "theme": "emerald",
        "label": "Green Energy Leaf",
        "svg": "<path d=\"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z\" fill=\"none\" stroke=\"#10b981\" stroke-width=\"2\"/><path d=\"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12\" stroke=\"#10b981\" stroke-width=\"2\"/>"
    },
    "121": {
        "name": "power_button",
        "theme": "red",
        "label": "Master Power Switch",
        "svg": "<path d=\"M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/>"
    },
    "122": {
        "name": "power_reset",
        "theme": "amber",
        "label": "System Reset Reboot",
        "svg": "<path d=\"M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>"
    },
    "123": {
        "name": "power_sleep",
        "theme": "purple",
        "label": "Standby Sleep Mode",
        "svg": "<path d=\"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/>"
    },
    "124": {
        "name": "power_lockout",
        "theme": "red",
        "label": "LOTO Safety Lockout",
        "svg": "<rect x=\"5\" y=\"11\" width=\"14\" height=\"10\" rx=\"2\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><path d=\"M8 11V7a4 4 0 0 1 8 0v4\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/>"
    },
    "125": {
        "name": "fan_cooling",
        "theme": "cyan",
        "label": "Cooling Fan Exhaust",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M12 12a3 3 0 0 1 3-3c2 0 3 2 3 3s-2 3-3 3M12 12a3 3 0 0 1-3 3c0 2 2 3 3 3s3-2 3-3M12 12a3 3 0 0 1-3-3c-2 0-3 2-3 3s2 3 3 3\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"1.8\"/>"
    },
    "126": {
        "name": "heatsink_temp",
        "theme": "slate",
        "label": "Heatsink Fin Thermal",
        "svg": "<path d=\"M4 4v16M8 4v16M12 4v16M16 4v16M20 4v16\" stroke=\"#94a3b8\" stroke-width=\"2\"/>"
    },
    "127": {
        "name": "surge_suppressor",
        "theme": "emerald",
        "label": "Surge Suppressor TVS",
        "svg": "<polygon points=\"13 2 3 14 12 14 11 22 21 10 12 10 13 2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"2\" y1=\"22\" x2=\"22\" y2=\"22\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "128": {
        "name": "ethernet_lan",
        "theme": "emerald",
        "label": "Gigabit LAN RJ45",
        "svg": "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><rect x=\"8\" y=\"12\" width=\"8\" height=\"8\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"1.5\"/><line x1=\"8\" y1=\"16\" x2=\"16\" y2=\"16\" stroke=\"#34d399\"/>"
    },
    "129": {
        "name": "wifi_full",
        "theme": "emerald",
        "label": "WiFi 100% Signal",
        "svg": "<path d=\"M5 12.55a11 11 0 0 1 14.08 0\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M1.42 9a16 16 0 0 1 21.16 0\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M8.53 16.11a6 6 0 0 1 6.95 0\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"20\" r=\"1.2\" fill=\"#34d399\"/>"
    },
    "130": {
        "name": "wifi_med",
        "theme": "amber",
        "label": "WiFi 60% Signal",
        "svg": "<path d=\"M5 12.55a11 11 0 0 1 14.08 0\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><path d=\"M8.53 16.11a6 6 0 0 1 6.95 0\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"20\" r=\"1.2\" fill=\"#fbbf24\"/>"
    },
    "131": {
        "name": "wifi_low",
        "theme": "amber",
        "label": "WiFi 30% Signal",
        "svg": "<path d=\"M8.53 16.11a6 6 0 0 1 6.95 0\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"20\" r=\"1.2\" fill=\"#f59e0b\"/>"
    },
    "132": {
        "name": "wifi_off",
        "theme": "red",
        "label": "WiFi Disconnected",
        "svg": "<line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\" stroke=\"#ef4444\" stroke-width=\"2\"/><path d=\"M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.58 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"20\" r=\"1\" fill=\"#ef4444\"/>"
    },
    "133": {
        "name": "cellular_5g",
        "theme": "cyan",
        "label": "5G Mobile Ultra",
        "svg": "<path d=\"M2 20h3v-8H2v8zM7 20h3v-12H7v12zM12 20h3v-16H12v16zM17 20h3v-19H17v19z\" fill=\"#22d3ee\"/>"
    },
    "134": {
        "name": "cellular_4g",
        "theme": "emerald",
        "label": "4G LTE Broadband",
        "svg": "<path d=\"M2 20h3v-8H2v8zM7 20h3v-12H7v12zM12 20h3v-16H12v16z\" fill=\"#34d399\"/><path d=\"M17 20h3v-19H17v19z\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"1.5\"/>"
    },
    "135": {
        "name": "sim_card_slot",
        "theme": "cyan",
        "label": "Nano SIM Slot",
        "svg": "<path d=\"M6 2h8l6 6v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "136": {
        "name": "bluetooth_mesh",
        "theme": "cyan",
        "label": "Bluetooth BLE Mesh",
        "svg": "<polyline points=\"6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "137": {
        "name": "hotspot_tether",
        "theme": "purple",
        "label": "Mobile Hotspot",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"3\" fill=\"#c084fc\"/><path d=\"M6 18a8 8 0 0 1 12 0M8 15a5 5 0 0 1 8 0\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/>"
    },
    "138": {
        "name": "lorawan_iot",
        "theme": "amber",
        "label": "LoRaWAN Long Range",
        "svg": "<circle cx=\"12\" cy=\"18\" r=\"2\" fill=\"#fbbf24\"/><path d=\"M5 13a10 10 0 0 1 14 0M8 16a5 5 0 0 1 8 0\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>"
    },
    "139": {
        "name": "gps_satellite",
        "theme": "cyan",
        "label": "GNSS GPS Satellite",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\" stroke=\"#22d3ee\"/><path d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\" fill=\"none\" stroke=\"#22d3ee\"/>"
    },
    "140": {
        "name": "router_switch",
        "theme": "purple",
        "label": "Core IP Router",
        "svg": "<rect x=\"2\" y=\"8\" width=\"20\" height=\"8\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"6\" y1=\"12\" x2=\"6\" y2=\"12.01\" stroke=\"#c084fc\" stroke-width=\"2.5\"/><line x1=\"10\" y1=\"12\" x2=\"10\" y2=\"12.01\" stroke=\"#c084fc\" stroke-width=\"2.5\"/><line x1=\"14\" y1=\"12\" x2=\"14\" y2=\"12.01\" stroke=\"#c084fc\" stroke-width=\"2.5\"/><line x1=\"18\" y1=\"12\" x2=\"18\" y2=\"12.01\" stroke=\"#c084fc\" stroke-width=\"2.5\"/><line x1=\"6\" y1=\"4\" x2=\"6\" y2=\"8\" stroke=\"#c084fc\" stroke-width=\"1.8\"/><line x1=\"18\" y1=\"4\" x2=\"18\" y2=\"8\" stroke=\"#c084fc\" stroke-width=\"1.8\"/>"
    },
    "141": {
        "name": "switch_hub",
        "theme": "cyan",
        "label": "Managed 24-Port Switch",
        "svg": "<rect x=\"2\" y=\"6\" width=\"20\" height=\"12\" rx=\"2\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><circle cx=\"6\" cy=\"12\" r=\"1.5\" fill=\"#22d3ee\"/><circle cx=\"10\" cy=\"12\" r=\"1.5\" fill=\"#22d3ee\"/><circle cx=\"14\" cy=\"12\" r=\"1.5\" fill=\"#22d3ee\"/><circle cx=\"18\" cy=\"12\" r=\"1.5\" fill=\"#22d3ee\"/>"
    },
    "142": {
        "name": "patch_panel",
        "theme": "slate",
        "label": "Rack Patch Panel",
        "svg": "<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><circle cx=\"6\" cy=\"8\" r=\"1\" fill=\"#94a3b8\"/><circle cx=\"10\" cy=\"8\" r=\"1\" fill=\"#94a3b8\"/><circle cx=\"14\" cy=\"8\" r=\"1\" fill=\"#94a3b8\"/><circle cx=\"18\" cy=\"8\" r=\"1\" fill=\"#94a3b8\"/><circle cx=\"6\" cy=\"16\" r=\"1\" fill=\"#94a3b8\"/><circle cx=\"10\" cy=\"16\" r=\"1\" fill=\"#94a3b8\"/><circle cx=\"14\" cy=\"16\" r=\"1\" fill=\"#94a3b8\"/><circle cx=\"18\" cy=\"16\" r=\"1\" fill=\"#94a3b8\"/>"
    },
    "143": {
        "name": "firewall_wall",
        "theme": "red",
        "label": "Hardware Firewall",
        "svg": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"3\" y1=\"9\" x2=\"21\" y2=\"9\" stroke=\"#ef4444\"/><line x1=\"3\" y1=\"15\" x2=\"21\" y2=\"15\" stroke=\"#ef4444\"/><line x1=\"8\" y1=\"3\" x2=\"8\" y2=\"9\" stroke=\"#ef4444\"/><line x1=\"16\" y1=\"3\" x2=\"16\" y2=\"9\" stroke=\"#ef4444\"/><line x1=\"12\" y1=\"9\" x2=\"12\" y2=\"15\" stroke=\"#ef4444\"/><line x1=\"8\" y1=\"15\" x2=\"8\" y2=\"21\" stroke=\"#ef4444\"/><line x1=\"16\" y1=\"15\" x2=\"16\" y2=\"21\" stroke=\"#ef4444\"/>"
    },
    "144": {
        "name": "vpn_tunnel",
        "theme": "emerald",
        "label": "IPSec VPN Tunnel",
        "svg": "<rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 10 0v4\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"16\" r=\"1.5\" fill=\"#34d399\"/>"
    },
    "145": {
        "name": "cloud_online",
        "theme": "cyan",
        "label": "Cloud Platform",
        "svg": "<path d=\"M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "146": {
        "name": "cloud_upload",
        "theme": "emerald",
        "label": "Cloud Sync Upload",
        "svg": "<path d=\"M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><polyline points=\"16 16 12 12 8 16\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"12\" y1=\"12\" x2=\"12\" y2=\"21\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "147": {
        "name": "cloud_download",
        "theme": "cyan",
        "label": "Cloud Fetch Download",
        "svg": "<path d=\"M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><polyline points=\"8 17 12 21 16 17\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"12\" y1=\"12\" x2=\"12\" y2=\"21\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "148": {
        "name": "cloud_sync",
        "theme": "amber",
        "label": "Cloud Bidirectional",
        "svg": "<path d=\"M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>"
    },
    "149": {
        "name": "cloud_offline",
        "theme": "slate",
        "label": "Cloud Offline Mode",
        "svg": "<path d=\"M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0-4 7h1a5 5 0 0 0 4 5h12\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\" stroke=\"#ef4444\" stroke-width=\"2\"/>"
    },
    "150": {
        "name": "server_blade",
        "theme": "purple",
        "label": "Linux Blade Host",
        "svg": "<rect x=\"2\" y=\"2\" width=\"20\" height=\"8\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><rect x=\"2\" y=\"14\" width=\"20\" height=\"8\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"6\" cy=\"6\" r=\"1\" fill=\"#c084fc\"/><circle cx=\"6\" cy=\"18\" r=\"1\" fill=\"#c084fc\"/>"
    },
    "151": {
        "name": "server_rack",
        "theme": "purple",
        "label": "Datacenter Server Rack",
        "svg": "<rect x=\"4\" y=\"2\" width=\"16\" height=\"20\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"4\" y1=\"7\" x2=\"20\" y2=\"7\" stroke=\"#c084fc\"/><line x1=\"4\" y1=\"12\" x2=\"20\" y2=\"12\" stroke=\"#c084fc\"/><line x1=\"4\" y1=\"17\" x2=\"20\" y2=\"17\" stroke=\"#c084fc\"/>"
    },
    "152": {
        "name": "database_sql",
        "theme": "cyan",
        "label": "PostgreSQL DB",
        "svg": "<ellipse cx=\"12\" cy=\"5\" rx=\"9\" ry=\"3\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M21 12c0 1.66-4 3-9 3s-9-1.34-9-3\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "153": {
        "name": "database_sync",
        "theme": "emerald",
        "label": "DB Replication Sync",
        "svg": "<ellipse cx=\"12\" cy=\"5\" rx=\"9\" ry=\"3\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "154": {
        "name": "redis_cache",
        "theme": "red",
        "label": "Redis In-Memory Key",
        "svg": "<polygon points=\"12 2 2 7 12 12 22 7 12 2\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><polyline points=\"2 17 12 22 22 17\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><polyline points=\"2 12 12 17 22 12\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/>"
    },
    "155": {
        "name": "kafka_stream",
        "theme": "purple",
        "label": "Kafka Event Stream",
        "svg": "<circle cx=\"6\" cy=\"12\" r=\"3\" fill=\"#c084fc\"/><circle cx=\"18\" cy=\"6\" r=\"3\" fill=\"#c084fc\"/><circle cx=\"18\" cy=\"18\" r=\"3\" fill=\"#c084fc\"/><line x1=\"8.5\" y1=\"10.5\" x2=\"15.5\" y2=\"7.5\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"8.5\" y1=\"13.5\" x2=\"15.5\" y2=\"16.5\" stroke=\"#c084fc\" stroke-width=\"2\"/>"
    },
    "156": {
        "name": "mqtt_broker",
        "theme": "amber",
        "label": "MQTT Broker Queue",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><path d=\"M12 7v5l3 3\" stroke=\"#fbbf24\" stroke-width=\"2\"/>"
    },
    "157": {
        "name": "webrtc_media",
        "theme": "emerald",
        "label": "WebRTC P2P Peer",
        "svg": "<circle cx=\"18\" cy=\"5\" r=\"3\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><circle cx=\"6\" cy=\"12\" r=\"3\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><circle cx=\"18\" cy=\"19\" r=\"3\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"8.59\" y1=\"13.51\" x2=\"15.42\" y2=\"17.49\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"15.41\" y1=\"6.51\" x2=\"8.59\" y2=\"10.49\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "158": {
        "name": "rtsp_stream",
        "theme": "purple",
        "label": "RTSP Video Camera",
        "svg": "<polygon points=\"23 7 16 12 23 17 23 7\" fill=\"rgba(192,132,252,0.3)\" stroke=\"#c084fc\" stroke-width=\"1.8\"/><rect x=\"1\" y=\"5\" width=\"15\" height=\"14\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/>"
    },
    "159": {
        "name": "sip_proxy",
        "theme": "cyan",
        "label": "SIP Proxy Kamailio",
        "svg": "<rect x=\"2\" y=\"3\" width=\"20\" height=\"18\" rx=\"3\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"7\" y1=\"8\" x2=\"17\" y2=\"8\" stroke=\"#22d3ee\"/><line x1=\"7\" y1=\"12\" x2=\"17\" y2=\"12\" stroke=\"#22d3ee\"/><line x1=\"7\" y1=\"16\" x2=\"13\" y2=\"16\" stroke=\"#22d3ee\"/>"
    },
    "160": {
        "name": "audio_waveform",
        "theme": "cyan",
        "label": "Audio DSP Waveform",
        "svg": "<path d=\"M2 12h3l2-6 4 12 3-8 2 5 2-3h4\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "161": {
        "name": "opus_hd_codec",
        "theme": "emerald",
        "label": "Opus HD 48kHz Codec",
        "svg": "<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"3\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><text x=\"12\" y=\"15\" font-family=\"monospace\" font-size=\"7\" font-weight=\"bold\" fill=\"#34d399\" text-anchor=\"middle\">OPUS</text>"
    },
    "162": {
        "name": "g711_alaw",
        "theme": "slate",
        "label": "G.711u PSTN Codec",
        "svg": "<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"3\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><text x=\"12\" y=\"15\" font-family=\"monospace\" font-size=\"7\" font-weight=\"bold\" fill=\"#94a3b8\" text-anchor=\"middle\">G711</text>"
    },
    "163": {
        "name": "echo_cancellation",
        "theme": "purple",
        "label": "AEC Echo Filter",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><path d=\"M8 12s1.5-3 4-3 4 3 4 3-1.5 3-4 3-4-3-4-3z\" stroke=\"#c084fc\" stroke-width=\"2\" fill=\"none\"/>"
    },
    "164": {
        "name": "jitter_buffer",
        "theme": "amber",
        "label": "Jitter Buffer DSP",
        "svg": "<rect x=\"3\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"7\" y1=\"10\" x2=\"7\" y2=\"14\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"16\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"17\" y1=\"10\" x2=\"17\" y2=\"14\" stroke=\"#fbbf24\" stroke-width=\"2\"/>"
    },
    "165": {
        "name": "video_camera_hd",
        "theme": "purple",
        "label": "HD Video Camera",
        "svg": "<polygon points=\"23 7 16 12 23 17 23 7\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><rect x=\"1\" y=\"5\" width=\"15\" height=\"14\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/>"
    },
    "166": {
        "name": "camera_flip",
        "theme": "cyan",
        "label": "Camera Flip Selfie",
        "svg": "<path d=\"M20 7h-3a2 2 0 0 1-2-2 2 2 0 0 0-2-2H9a2 2 0 0 0-2 2 2 2 0 0 1-2 2H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M8 13a4 4 0 0 1 8 0\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "167": {
        "name": "camera_off",
        "theme": "red",
        "label": "Video Camera Muted",
        "svg": "<line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\" stroke=\"#ef4444\" stroke-width=\"2\"/><path d=\"M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/>"
    },
    "168": {
        "name": "screen_share",
        "theme": "emerald",
        "label": "Screen Share Desktop",
        "svg": "<rect x=\"2\" y=\"3\" width=\"20\" height=\"14\" rx=\"2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><polyline points=\"8 21 12 17 16 21\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"12\" y1=\"17\" x2=\"12\" y2=\"21\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "169": {
        "name": "pip_picture_in_pic",
        "theme": "purple",
        "label": "Picture-in-Picture",
        "svg": "<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><rect x=\"12\" y=\"10\" width=\"8\" height=\"8\" rx=\"1\" fill=\"#c084fc\"/>"
    },
    "170": {
        "name": "fullscreen_expand",
        "theme": "cyan",
        "label": "Fullscreen Expand",
        "svg": "<polyline points=\"15 3 21 3 21 9\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><polyline points=\"9 21 3 21 3 15\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"21\" y1=\"3\" x2=\"14\" y2=\"10\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"3\" y1=\"21\" x2=\"10\" y2=\"14\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "171": {
        "name": "minimize_screen",
        "theme": "slate",
        "label": "Minimize Screen",
        "svg": "<polyline points=\"4 14 10 14 10 20\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><polyline points=\"20 10 14 10 14 4\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"14\" y1=\"10\" x2=\"21\" y2=\"3\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"3\" y1=\"21\" x2=\"10\" y2=\"14\" stroke=\"#94a3b8\" stroke-width=\"2\"/>"
    },
    "172": {
        "name": "video_grid_view",
        "theme": "cyan",
        "label": "Gallery Grid View",
        "svg": "<rect x=\"3\" y=\"3\" width=\"7\" height=\"7\" rx=\"1\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\" rx=\"1\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\" rx=\"1\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\" rx=\"1\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "173": {
        "name": "video_speaker_focus",
        "theme": "purple",
        "label": "Active Speaker Focus",
        "svg": "<rect x=\"2\" y=\"2\" width=\"20\" height=\"14\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"9\" r=\"3\" fill=\"#c084fc\"/><rect x=\"4\" y=\"18\" width=\"4\" height=\"4\" rx=\"1\" fill=\"#c084fc\"/><rect x=\"10\" y=\"18\" width=\"4\" height=\"4\" rx=\"1\" fill=\"#c084fc\"/><rect x=\"16\" y=\"18\" width=\"4\" height=\"4\" rx=\"1\" fill=\"#c084fc\"/>"
    },
    "174": {
        "name": "ptz_pan_tilt",
        "theme": "amber",
        "label": "PTZ Camera Control",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><polyline points=\"12 6 12 18\" stroke=\"#fbbf24\" stroke-width=\"2\"/><polyline points=\"6 12 18 12\" stroke=\"#fbbf24\" stroke-width=\"2\"/>"
    },
    "175": {
        "name": "zoom_in_cam",
        "theme": "cyan",
        "label": "Optical Zoom In",
        "svg": "<circle cx=\"11\" cy=\"11\" r=\"8\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"11\" y1=\"8\" x2=\"11\" y2=\"14\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"8\" y1=\"11\" x2=\"14\" y2=\"11\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "176": {
        "name": "zoom_out_cam",
        "theme": "cyan",
        "label": "Optical Zoom Out",
        "svg": "<circle cx=\"11\" cy=\"11\" r=\"8\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"8\" y1=\"11\" x2=\"14\" y2=\"11\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "177": {
        "name": "night_vision_ir",
        "theme": "emerald",
        "label": "IR Night Vision",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"3\" fill=\"#34d399\"/><path d=\"M12 2v2M12 20v2M2 12h2M20 12h2\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "178": {
        "name": "motion_alert_box",
        "theme": "red",
        "label": "Motion Detection Box",
        "svg": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\" stroke-dasharray=\"4 2\"/><circle cx=\"12\" cy=\"12\" r=\"3\" fill=\"#ef4444\"/>"
    },
    "179": {
        "name": "audio_equalizer",
        "theme": "cyan",
        "label": "Parametric EQ",
        "svg": "<line x1=\"4\" y1=\"21\" x2=\"4\" y2=\"14\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"4\" y1=\"10\" x2=\"4\" y2=\"3\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"12\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"3\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"20\" y1=\"21\" x2=\"20\" y2=\"16\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"20\" y1=\"12\" x2=\"20\" y2=\"3\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"1\" y1=\"14\" x2=\"7\" y2=\"14\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"9\" y1=\"8\" x2=\"15\" y2=\"8\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"17\" y1=\"16\" x2=\"23\" y2=\"16\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "180": {
        "name": "sim_card",
        "theme": "cyan",
        "label": "SIM Card",
        "svg": "<path d=\"M6 2h8l6 6v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><rect x=\"8\" y=\"10\" width=\"8\" height=\"8\" rx=\"1\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"1.5\"/><line x1=\"8\" y1=\"14\" x2=\"16\" y2=\"14\" stroke=\"#22d3ee\" stroke-width=\"1.5\"/><line x1=\"12\" y1=\"10\" x2=\"12\" y2=\"18\" stroke=\"#22d3ee\" stroke-width=\"1.5\"/>"
    },
    "181": {
        "name": "network_trunk",
        "theme": "emerald",
        "label": "Network Trunk",
        "svg": "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><rect x=\"8\" y=\"12\" width=\"8\" height=\"8\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"1.5\"/><line x1=\"8\" y1=\"16\" x2=\"16\" y2=\"16\" stroke=\"#34d399\" stroke-width=\"1.5\"/><line x1=\"12\" y1=\"4\" x2=\"12\" y2=\"12\" stroke=\"#34d399\" stroke-width=\"1.5\"/>"
    },
    "182": {
        "name": "srtp_shield",
        "theme": "purple",
        "label": "SRTP Security Shield",
        "svg": "<path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\" fill=\"none\" stroke=\"#a855f7\" stroke-width=\"2\"/><path d=\"M12 22V2\" stroke=\"#a855f7\" stroke-width=\"1.5\"/>"
    },
    "183": {
        "name": "srtp_lock_key",
        "theme": "emerald",
        "label": "SRTP Master Key",
        "svg": "<path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><rect x=\"9\" y=\"10\" width=\"6\" height=\"5\" rx=\"1\" fill=\"#34d399\"/>"
    },
    "184": {
        "name": "tls_handshake",
        "theme": "cyan",
        "label": "TLS 1.3 Cipher Handshake",
        "svg": "<circle cx=\"8\" cy=\"12\" r=\"5\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><circle cx=\"16\" cy=\"12\" r=\"5\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><polyline points=\"6 12 18 12\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "185": {
        "name": "media_play",
        "theme": "emerald",
        "label": "Play Media",
        "svg": "<polygon points=\"5 3 19 12 5 21 5 3\" fill=\"#34d399\"/>"
    },
    "186": {
        "name": "media_pause",
        "theme": "amber",
        "label": "Pause Media",
        "svg": "<rect x=\"6\" y=\"4\" width=\"4\" height=\"16\" fill=\"#fbbf24\" rx=\"1\"/><rect x=\"14\" y=\"4\" width=\"4\" height=\"16\" fill=\"#fbbf24\" rx=\"1\"/>"
    },
    "187": {
        "name": "media_stop",
        "theme": "red",
        "label": "Stop Media",
        "svg": "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\" fill=\"#ef4444\"/>"
    },
    "188": {
        "name": "media_rewind",
        "theme": "cyan",
        "label": "Rewind Seek",
        "svg": "<polygon points=\"11 19 2 12 11 5 11 19\" fill=\"#22d3ee\"/><polygon points=\"22 19 13 12 22 5 22 19\" fill=\"#22d3ee\"/>"
    },
    "189": {
        "name": "media_fastforward",
        "theme": "cyan",
        "label": "Fast Forward Seek",
        "svg": "<polygon points=\"13 19 22 12 13 5 13 19\" fill=\"#22d3ee\"/><polygon points=\"2 19 11 12 2 5 2 19\" fill=\"#22d3ee\"/>"
    },
    "190": {
        "name": "audio_shuffle",
        "theme": "purple",
        "label": "Shuffle Tracks",
        "svg": "<polyline points=\"16 3 21 3 21 8\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"4\" y1=\"20\" x2=\"21\" y2=\"3\" stroke=\"#c084fc\" stroke-width=\"2\"/><polyline points=\"21 16 21 21 16 21\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"15\" y1=\"15\" x2=\"21\" y2=\"21\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"4\" y1=\"4\" x2=\"9\" y2=\"9\" stroke=\"#c084fc\" stroke-width=\"2\"/>"
    },
    "191": {
        "name": "audio_repeat",
        "theme": "cyan",
        "label": "Repeat Loop",
        "svg": "<polyline points=\"17 1 21 5 17 9\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M3 11V9a4 4 0 0 1 4-4h14\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><polyline points=\"7 23 3 19 7 15\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M21 13v2a4 4 0 0 1-4 4H3\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "192": {
        "name": "padlock_locked",
        "theme": "emerald",
        "label": "Door Vault Locked",
        "svg": "<rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 10 0v4\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "193": {
        "name": "padlock_unlocked",
        "theme": "amber",
        "label": "Door Vault Unlocked",
        "svg": "<rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 9.9-1\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>"
    },
    "194": {
        "name": "key_pass",
        "theme": "cyan",
        "label": "Physical Key",
        "svg": "<path d=\"M21 2l-2 2m-1.5 1.5L14 9l-3-3L2 15l7 7 9-9 3.5-3.5z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "195": {
        "name": "shield_check",
        "theme": "emerald",
        "label": "Shield Verified",
        "svg": "<path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><polyline points=\"9 12 11 14 15 10\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "196": {
        "name": "shield_alert",
        "theme": "red",
        "label": "Security Threat Alert",
        "svg": "<path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"12\" stroke=\"#ef4444\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"16\" r=\"1\" fill=\"#ef4444\"/>"
    },
    "197": {
        "name": "retina_scan",
        "theme": "cyan",
        "label": "Iris Retina Biometric",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"3\" fill=\"#22d3ee\"/><line x1=\"3\" y1=\"12\" x2=\"21\" y2=\"12\" stroke=\"#22d3ee\" stroke-width=\"1.5\"/>"
    },
    "198": {
        "name": "face_id_scan",
        "theme": "purple",
        "label": "Face ID Scanner",
        "svg": "<path d=\"M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M4 16v3a1 1 0 0 0 1 1h3M16 20h3a1 1 0 0 0 1-1v-3\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"9\" cy=\"10\" r=\"1\" fill=\"#c084fc\"/><circle cx=\"15\" cy=\"10\" r=\"1\" fill=\"#c084fc\"/><path d=\"M9 15s1 1 3 1 3-1 3-1\" stroke=\"#c084fc\" stroke-width=\"2\"/>"
    },
    "199": {
        "name": "smart_card_id",
        "theme": "cyan",
        "label": "Badge SmartCard",
        "svg": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><circle cx=\"9\" cy=\"10\" r=\"2\" fill=\"#22d3ee\"/><line x1=\"15\" y1=\"9\" x2=\"18\" y2=\"9\" stroke=\"#22d3ee\"/><line x1=\"15\" y1=\"13\" x2=\"18\" y2=\"13\" stroke=\"#22d3ee\"/><line x1=\"7\" y1=\"16\" x2=\"17\" y2=\"16\" stroke=\"#22d3ee\"/>"
    },
    "200": {
        "name": "siren_flasher",
        "theme": "red",
        "label": "Strobe Siren Alarm",
        "svg": "<path d=\"M12 2a7 7 0 0 0-7 7v4l-2 3h18l-2-3V9a7 7 0 0 0-7-7z\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><path d=\"M12 18v3M8 21h8\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"0\" stroke=\"#ef4444\"/>"
    },
    "201": {
        "name": "tamper_switch",
        "theme": "amber",
        "label": "Enclosure Tamper Switch",
        "svg": "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"3\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"3\" fill=\"#fbbf24\"/>"
    },
    "202": {
        "name": "cctv_dome",
        "theme": "purple",
        "label": "CCTV Dome Surveillance",
        "svg": "<path d=\"M3 12a9 9 0 0 1 18 0H3z\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"4\" fill=\"#c084fc\"/>"
    },
    "203": {
        "name": "fire_flame",
        "theme": "red",
        "label": "Fire Hazard Alert",
        "svg": "<path d=\"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/>"
    },
    "204": {
        "name": "gas_leak_alert",
        "theme": "amber",
        "label": "Toxic Gas Alert",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><path d=\"M12 8v4M12 16h.01\" stroke=\"#fbbf24\" stroke-width=\"2\"/>"
    },
    "205": {
        "name": "glass_break",
        "theme": "cyan",
        "label": "Acoustic Glass Break",
        "svg": "<polygon points=\"6 2 18 2 22 8 12 22 2 8 6 2\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"2\" y1=\"8\" x2=\"22\" y2=\"8\" stroke=\"#22d3ee\"/>"
    },
    "206": {
        "name": "panic_button_sos",
        "theme": "red",
        "label": "SOS Emergency Panic",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"#ef4444\"/><text x=\"12\" y=\"15\" font-family=\"monospace\" font-size=\"7\" font-weight=\"black\" fill=\"#ffffff\" text-anchor=\"middle\">SOS</text>"
    },
    "207": {
        "name": "geofence_perimeter",
        "theme": "emerald",
        "label": "Geofence Barrier",
        "svg": "<polygon points=\"1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "208": {
        "name": "passcode_hash",
        "theme": "purple",
        "label": "SHA-256 Crypto Hash",
        "svg": "<line x1=\"4\" y1=\"9\" x2=\"20\" y2=\"9\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"4\" y1=\"15\" x2=\"20\" y2=\"15\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"10\" y1=\"3\" x2=\"8\" y2=\"21\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"16\" y1=\"3\" x2=\"14\" y2=\"21\" stroke=\"#c084fc\" stroke-width=\"2\"/>"
    },
    "209": {
        "name": "audit_log",
        "theme": "cyan",
        "label": "Security Audit Trail",
        "svg": "<path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><polyline points=\"14 2 14 8 20 8\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"16\" y1=\"13\" x2=\"8\" y2=\"13\" stroke=\"#22d3ee\"/><line x1=\"16\" y1=\"17\" x2=\"8\" y2=\"17\" stroke=\"#22d3ee\"/>"
    },
    "210": {
        "name": "two_factor_2fa",
        "theme": "emerald",
        "label": "2FA Authenticator",
        "svg": "<rect x=\"5\" y=\"2\" width=\"14\" height=\"20\" rx=\"2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"12\" y1=\"18\" x2=\"12.01\" y2=\"18\" stroke=\"#34d399\" stroke-width=\"3\"/><polyline points=\"9 10 11 12 15 8\" stroke=\"#34d399\" stroke-width=\"2\" fill=\"none\"/>"
    },
    "211": {
        "name": "secret_vault",
        "theme": "amber",
        "label": "Safe Deposit Vault",
        "svg": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"3\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"4\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"12\" y1=\"12\" x2=\"15\" y2=\"12\" stroke=\"#fbbf24\" stroke-width=\"2\"/>"
    },
    "212": {
        "name": "antivirus_scan",
        "theme": "emerald",
        "label": "Malware Antivirus Clean",
        "svg": "<path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\" fill=\"none\" stroke=\"#10b981\" stroke-width=\"2\"/><path d=\"M9 12l2 2 4-4\" stroke=\"#10b981\" stroke-width=\"2\" fill=\"none\"/>"
    },
    "213": {
        "name": "ddos_shield",
        "theme": "purple",
        "label": "DDoS Traffic Scrubbing",
        "svg": "<path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\" stroke=\"#c084fc\" stroke-width=\"2\"/>"
    },
    "214": {
        "name": "ssh_terminal_key",
        "theme": "cyan",
        "label": "SSH RSA Private Key",
        "svg": "<polyline points=\"4 17 10 11 4 5\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"12\" y1=\"19\" x2=\"20\" y2=\"19\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "215": {
        "name": "api_token_lock",
        "theme": "amber",
        "label": "API Key Token Lock",
        "svg": "<circle cx=\"8\" cy=\"12\" r=\"4\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"12\" y1=\"12\" x2=\"20\" y2=\"12\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"17\" y1=\"12\" x2=\"17\" y2=\"15\" stroke=\"#fbbf24\" stroke-width=\"2\"/>"
    },
    "216": {
        "name": "ssl_cert_padlock",
        "theme": "emerald",
        "label": "HTTPS Valid SSL Cert",
        "svg": "<rect x=\"4\" y=\"10\" width=\"16\" height=\"11\" rx=\"2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M7 10V6a5 5 0 0 1 10 0v4\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"15\" r=\"1.5\" fill=\"#34d399\"/>"
    },
    "217": {
        "name": "session_timeout",
        "theme": "slate",
        "label": "Session Expired Timer",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><polyline points=\"12 6 12 12 16 14\" stroke=\"#94a3b8\" stroke-width=\"2\" fill=\"none\"/><line x1=\"2\" y1=\"2\" x2=\"22\" y2=\"22\" stroke=\"#ef4444\" stroke-width=\"2\"/>"
    },
    "218": {
        "name": "ip_blacklist",
        "theme": "red",
        "label": "Banned IP Address",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"4.93\" y1=\"4.93\" x2=\"19.07\" y2=\"19.07\" stroke=\"#ef4444\" stroke-width=\"2\"/>"
    },
    "219": {
        "name": "ip_whitelist",
        "theme": "emerald",
        "label": "Allowed IP Address",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><polyline points=\"8 12 11 15 16 9\" stroke=\"#34d399\" stroke-width=\"2\" fill=\"none\"/>"
    },
    "220": {
        "name": "fail2ban_jail",
        "theme": "purple",
        "label": "Fail2Ban Security Jail",
        "svg": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"8\" y1=\"3\" x2=\"8\" y2=\"21\" stroke=\"#c084fc\" stroke-width=\"1.8\"/><line x1=\"12\" y1=\"3\" x2=\"12\" y2=\"21\" stroke=\"#c084fc\" stroke-width=\"1.8\"/><line x1=\"16\" y1=\"3\" x2=\"16\" y2=\"21\" stroke=\"#c084fc\" stroke-width=\"1.8\"/>"
    },
    "221": {
        "name": "watermark_security",
        "theme": "cyan",
        "label": "Digital Watermark",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"1.5\" stroke-dasharray=\"2 2\"/><text x=\"12\" y=\"14.5\" font-family=\"monospace\" font-size=\"6\" font-weight=\"bold\" fill=\"#22d3ee\" text-anchor=\"middle\">AUTH</text>"
    },
    "222": {
        "name": "disaster_recovery",
        "theme": "amber",
        "label": "Disaster Backup Mirror",
        "svg": "<path d=\"M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>"
    },
    "223": {
        "name": "quarantine_isolate",
        "theme": "red",
        "label": "Quarantine Isolation",
        "svg": "<polygon points=\"12 2 2 22 22 22 12 2\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"13\" r=\"3\" fill=\"#ef4444\"/>"
    },
    "224": {
        "name": "home_dashboard",
        "theme": "cyan",
        "label": "Home Dashboard",
        "svg": "<path d=\"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><polyline points=\"9 22 9 12 15 12 15 22\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "225": {
        "name": "user_avatar",
        "theme": "cyan",
        "label": "User Account",
        "svg": "<path d=\"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"7\" r=\"4\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "226": {
        "name": "settings_gear",
        "theme": "slate",
        "label": "System Config",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"3\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/>"
    },
    "227": {
        "name": "wrench_tools",
        "theme": "amber",
        "label": "Maintenance Tool",
        "svg": "<path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>"
    },
    "228": {
        "name": "terminal_cli",
        "theme": "emerald",
        "label": "Terminal Console",
        "svg": "<polyline points=\"4 17 10 11 4 5\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"12\" y1=\"19\" x2=\"20\" y2=\"19\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "229": {
        "name": "chevron_left",
        "theme": "slate",
        "label": "Chevron Left",
        "svg": "<polyline points=\"15 18 9 12 15 6\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2.5\"/>"
    },
    "230": {
        "name": "chevron_right",
        "theme": "slate",
        "label": "Chevron Right",
        "svg": "<polyline points=\"9 18 15 12 9 6\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2.5\"/>"
    },
    "231": {
        "name": "chevron_up",
        "theme": "slate",
        "label": "Chevron Up",
        "svg": "<polyline points=\"18 15 12 9 6 15\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2.5\"/>"
    },
    "232": {
        "name": "chevron_down",
        "theme": "slate",
        "label": "Chevron Down",
        "svg": "<polyline points=\"6 9 12 15 18 9\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2.5\"/>"
    },
    "233": {
        "name": "menu_hamburger",
        "theme": "cyan",
        "label": "Navigation Menu",
        "svg": "<line x1=\"3\" y1=\"6\" x2=\"21\" y2=\"6\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"3\" y1=\"12\" x2=\"21\" y2=\"12\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"3\" y1=\"18\" x2=\"21\" y2=\"18\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "234": {
        "name": "more_vert",
        "theme": "slate",
        "label": "More Actions",
        "svg": "<circle cx=\"12\" cy=\"5\" r=\"1.5\" fill=\"#94a3b8\"/><circle cx=\"12\" cy=\"12\" r=\"1.5\" fill=\"#94a3b8\"/><circle cx=\"12\" cy=\"19\" r=\"1.5\" fill=\"#94a3b8\"/>"
    },
    "235": {
        "name": "more_horiz",
        "theme": "slate",
        "label": "Horizontal Actions",
        "svg": "<circle cx=\"5\" cy=\"12\" r=\"1.5\" fill=\"#94a3b8\"/><circle cx=\"12\" cy=\"12\" r=\"1.5\" fill=\"#94a3b8\"/><circle cx=\"19\" cy=\"12\" r=\"1.5\" fill=\"#94a3b8\"/>"
    },
    "236": {
        "name": "slider_controls",
        "theme": "cyan",
        "label": "Audio Mixer Sliders",
        "svg": "<line x1=\"4\" y1=\"21\" x2=\"4\" y2=\"14\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"4\" y1=\"10\" x2=\"4\" y2=\"3\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"12\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"3\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"20\" y1=\"21\" x2=\"20\" y2=\"16\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"20\" y1=\"12\" x2=\"20\" y2=\"3\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "237": {
        "name": "toggle_on_switch",
        "theme": "emerald",
        "label": "Switch ON",
        "svg": "<rect x=\"1\" y=\"5\" width=\"22\" height=\"14\" rx=\"7\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><circle cx=\"16\" cy=\"12\" r=\"4\" fill=\"#34d399\"/>"
    },
    "238": {
        "name": "toggle_off_switch",
        "theme": "slate",
        "label": "Switch OFF",
        "svg": "<rect x=\"1\" y=\"5\" width=\"22\" height=\"14\" rx=\"7\" fill=\"none\" stroke=\"#64748b\" stroke-width=\"2\"/><circle cx=\"8\" cy=\"12\" r=\"4\" fill=\"#64748b\"/>"
    },
    "239": {
        "name": "checkbox_checked",
        "theme": "emerald",
        "label": "Checkbox Checked",
        "svg": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"3\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><polyline points=\"8 12 11 15 16 9\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2.5\"/>"
    },
    "240": {
        "name": "checkbox_empty",
        "theme": "slate",
        "label": "Checkbox Empty",
        "svg": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"3\" fill=\"none\" stroke=\"#64748b\" stroke-width=\"2\"/>"
    },
    "241": {
        "name": "check_success",
        "theme": "emerald",
        "label": "Operation Success",
        "svg": "<polyline points=\"20 6 9 17 4 12\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>"
    },
    "242": {
        "name": "cross_cancel",
        "theme": "red",
        "label": "Operation Failed",
        "svg": "<line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\" stroke=\"#ef4444\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\" stroke=\"#ef4444\" stroke-width=\"3\" stroke-linecap=\"round\"/>"
    },
    "243": {
        "name": "info_circle",
        "theme": "cyan",
        "label": "Information Info",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"12\" stroke=\"#22d3ee\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"8\" r=\"1\" fill=\"#22d3ee\"/>"
    },
    "244": {
        "name": "help_question",
        "theme": "amber",
        "label": "Help Question",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01\" stroke=\"#fbbf24\" stroke-width=\"2\"/>"
    },
    "245": {
        "name": "clock_timer",
        "theme": "cyan",
        "label": "Realtime Chrono",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><polyline points=\"12 6 12 12 14 14\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "246": {
        "name": "calendar_date",
        "theme": "emerald",
        "label": "Calendar Schedule",
        "svg": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"16\" y1=\"2\" x2=\"16\" y2=\"6\" stroke=\"#34d399\"/><line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"6\" stroke=\"#34d399\"/><line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\" stroke=\"#34d399\"/>"
    },
    "247": {
        "name": "metric_speedometer",
        "theme": "emerald",
        "label": "83M ops/sec Speed",
        "svg": "<path d=\"M12 15l3.5-3.5\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M20.3 18a9 9 0 1 0-16.6 0\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "248": {
        "name": "progress_donut",
        "theme": "purple",
        "label": "Memory Donut Ring",
        "svg": "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"3\" stroke-dasharray=\"35 20\"/>"
    },
    "249": {
        "name": "trash_delete",
        "theme": "red",
        "label": "Trash Recycle Bin",
        "svg": "<polyline points=\"3 6 5 6 21 6\" stroke=\"#ef4444\" stroke-width=\"2\"/><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\" stroke=\"#ef4444\" stroke-width=\"2\" fill=\"none\"/>"
    },
    "250": {
        "name": "download_file",
        "theme": "cyan",
        "label": "File Downloader",
        "svg": "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" stroke=\"#22d3ee\" stroke-width=\"2\" fill=\"none\"/><polyline points=\"7 10 12 15 17 10\" stroke=\"#22d3ee\" stroke-width=\"2\" fill=\"none\"/><line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"3\" stroke=\"#22d3ee\" stroke-width=\"2\"/>"
    },
    "251": {
        "name": "upload_file",
        "theme": "emerald",
        "label": "File Uploader",
        "svg": "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" stroke=\"#34d399\" stroke-width=\"2\" fill=\"none\"/><polyline points=\"17 8 12 3 7 8\" stroke=\"#34d399\" stroke-width=\"2\" fill=\"none\"/><line x1=\"12\" y1=\"3\" x2=\"12\" y2=\"15\" stroke=\"#34d399\" stroke-width=\"2\"/>"
    },
    "252": {
        "name": "folder_directory",
        "theme": "amber",
        "label": "Folder Storage",
        "svg": "<path d=\"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>"
    },
    "253": {
        "name": "qr_barcode",
        "theme": "cyan",
        "label": "QR Code Barcode",
        "svg": "<rect x=\"3\" y=\"3\" width=\"7\" height=\"7\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><rect x=\"14\" y=\"14\" width=\"3\" height=\"3\" fill=\"#22d3ee\"/><rect x=\"18\" y=\"18\" width=\"3\" height=\"3\" fill=\"#22d3ee\"/>"
    },
    "254": {
        "name": "nfc_tap_pay",
        "theme": "emerald",
        "label": "NFC Contactless",
        "svg": "<path d=\"M6 18a8 8 0 0 1 12 0M8 15a5 5 0 0 1 8 0\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"18\" r=\"1\" fill=\"#34d399\"/>"
    },
    "255": {
        "name": "titan_all_highway",
        "theme": "emerald",
        "label": "Titan 255 Highway",
        "svg": "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><polyline points=\"16 2 20 6 16 10\" fill=\"none\" stroke=\"#6ee7b7\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><line x1=\"20\" y1=\"6\" x2=\"11\" y2=\"15\" stroke=\"#6ee7b7\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>"
    }
};

const THEMES = {
    emerald: { glow: '#34d399', bg: '#022c22', badge: '#ef4444' },
    purple:  { glow: '#c084fc', bg: '#2e1065', badge: '#ef4444' },
    amber:   { glow: '#fbbf24', bg: '#451a03', badge: '#ef4444' },
    red:     { glow: '#f87171', bg: '#4c0519', badge: '#ef4444' },
    cyan:    { glow: '#22d3ee', bg: '#083344', badge: '#ef4444' },
    slate:   { glow: '#64748b', bg: '#0f172a', badge: '#ef4444' }
};

function resolveAnimOpcode(anim) {
    if (typeof anim === 'number') return anim & 0x0F;
    if (typeof anim === 'string') {
        const key = anim.trim().toLowerCase();
        if (key === 'pulse') return TITAN_ANIM.PULSE;
        if (key === 'spin') return TITAN_ANIM.SPIN;
        if (key === 'bounce') return TITAN_ANIM.BOUNCE;
        if (key === 'ring' || key === 'shake') return TITAN_ANIM.RING;
        if (key === 'ripple') return TITAN_ANIM.RIPPLE;
        if (key === 'wave') return TITAN_ANIM.WAVE;
        if (key === 'flash') return TITAN_ANIM.FLASH;
        if (key === 'glow') return TITAN_ANIM.GLOW;
    }
    return TITAN_ANIM.STATIC;
}

const TWIN_ICON_PAIRS = {
    'eye': { active: 298, inactive: 299 },
    'eye_off': { active: 298, inactive: 299 },
    'lock': { active: 300, inactive: 301 },
    'unlock': { active: 300, inactive: 301 },
    'mic': { active: 412, inactive: 413 },
    'mic_mute': { active: 412, inactive: 413 },
    'video': { active: 411, inactive: 296 },
    'volume': { active: 414, inactive: 415 },
    'volume_mute': { active: 414, inactive: 415 },
    'play': { active: 417, inactive: 418 },
    'pause': { active: 417, inactive: 418 },
    'wifi': { active: 323, inactive: 324 },
    'sun': { active: 430, inactive: 431 },
    'moon': { active: 430, inactive: 431 },
    'toggle': { active: 473, inactive: 472 },
    'heart': { active: 305, inactive: 305 },
    'bookmark': { active: 303, inactive: 303 },
    'shield': { active: 460, inactive: 461 },
    'user': { active: 467, inactive: 468 },
    'folder': { active: 293, inactive: 294 },

    298: { active: 298, inactive: 299 },
    299: { active: 298, inactive: 299 },
    300: { active: 300, inactive: 301 },
    301: { active: 300, inactive: 301 },
    412: { active: 412, inactive: 413 },
    413: { active: 412, inactive: 413 },
    414: { active: 414, inactive: 415 },
    415: { active: 414, inactive: 415 },
    417: { active: 417, inactive: 418 },
    418: { active: 417, inactive: 418 },
    323: { active: 323, inactive: 324 },
    324: { active: 323, inactive: 324 },
    430: { active: 430, inactive: 431 },
    431: { active: 430, inactive: 431 },
    472: { active: 473, inactive: 472 },
    473: { active: 473, inactive: 472 }
};

function renderAdaptiveIconSVG(inputCodeOrMask, missedCount = 0, size = 64, forceCircle = null, anim = 0, active = null) {
    let isNegative = false;
    let rawNum = 0;
    let inputStr = '';

    if (typeof inputCodeOrMask === 'number') {
        isNegative = inputCodeOrMask < 0;
        rawNum = Math.abs(inputCodeOrMask);
    } else if (typeof inputCodeOrMask === 'string') {
        inputStr = inputCodeOrMask.trim().toLowerCase();
        if (inputStr.startsWith('-')) {
            isNegative = true;
            rawNum = Math.abs(parseInt(inputStr, 10));
        } else if (!isNaN(Number(inputStr))) {
            rawNum = parseInt(inputStr, 10);
        } else if (TWIN_ICON_PAIRS[inputStr]) {
            const pair = TWIN_ICON_PAIRS[inputStr];
            rawNum = (active === false) ? pair.inactive : pair.active;
        } else {
            rawNum = parseBitmask(inputStr);
        }
    }

    // Auto-resolve twin state if active is explicitly passed
    if (active !== null && TWIN_ICON_PAIRS[rawNum]) {
        const pair = TWIN_ICON_PAIRS[rawNum];
        rawNum = active ? pair.active : pair.inactive;
    }

    let iconData;
    let val = rawNum & 0xFFFF;

    if (val >= 256 && EXTENDED_WEB_ICONS[val]) {
        const ext = EXTENDED_WEB_ICONS[val];
        iconData = {
            name: ext.name,
            label: ext.label,
            theme: 'cyan',
            svg: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ext.path + '</g>'
        };
    } else {
        val = rawNum & 0xFF;
        iconData = ICONS_256[val] || ICONS_256[0];
    }

    const circle = forceCircle !== null ? forceCircle : !isNegative;
    const t = THEMES[iconData.theme] || THEMES.slate;

    const animOpcode = resolveAnimOpcode(anim);
    const animClass = ANIM_CLASSES[animOpcode] || '';

    if (circle) {
        let badgeSvg = '';
        if ((val === 4 || val === 255) && missedCount > 0) {
            badgeSvg = `
  <circle cx="25" cy="7" r="5" fill="#ef4444" stroke="#020617" stroke-width="1.5"/>
  <text x="25" y="8.8" font-family="monospace, sans-serif" font-size="5.5" font-weight="bold" fill="#ffffff" text-anchor="middle">${missedCount}</text>`;
        }

        let dotSvg = '';
        if (val === 7 || val === 255) {
            dotSvg = `
  <circle cx="7" cy="25" r="2.5" fill="#22d3ee" stroke="#020617" stroke-width="1"/>`;
        }

        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}" class="titan-adaptive-icon ${animClass}">
  <style>${ANIM_KEYFRAMES_CSS}</style>
  <circle cx="16" cy="16" r="15" fill="none" stroke="${t.glow}" stroke-opacity="0.25" stroke-width="1.5"/>
  <circle cx="16" cy="16" r="13.5" fill="${t.bg}" fill-opacity="0.88" stroke="${t.glow}" stroke-width="1.4"/>
  <g transform="translate(4, 4)">
    ${iconData.svg}
  </g>
${badgeSvg}
${dotSvg}
</svg>`;
    } else {
        // ✨ Pure 24x24 Vector (Unsigned Ring OFF)
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="titan-adaptive-icon ${animClass}">
  <style>${ANIM_KEYFRAMES_CSS}</style>
  ${iconData.svg}
</svg>`;
    }
}

const TitanAdaptiveIcon = ({
    code = 0,
    icon = null,
    mask = null,
    active = null,
    state = null,
    missedCount = 0,
    size = 64,
    circle = null,
    anim = 0
} = {}) => {
    const inputVal = icon !== null ? icon : (mask !== null ? mask : code);
    const activeVal = active !== null ? active : state;
    return renderAdaptiveIconSVG(inputVal, missedCount, size, circle, anim, activeVal);
};

module.exports = {
    TitanAdaptiveIcon,
    TitanIcon: TitanAdaptiveIcon,
    TITAN_ICON,
    TITAN_ANIM,
    TWIN_ICON_PAIRS,
    ICONS_256,
    ANIM_CLASSES,
    ANIM_KEYFRAMES_CSS,
    renderAdaptiveIconSVG
};
