# 📱 Titan SVG Animation Card & Opcode Bus (danphe-ui)

> **Flagship 100% Pure Vector Handheld Studio Inspector & Pluggable DSP Hardware Module**  
> Built for High-Performance NLE Video Editors, Motion Graphics Studios, and Web Platforms.

---

## 🌟 1. Overview & Core Philosophy

The **Titan SVG Animation Card** (`lib/TitanSvgAnimationCard.js`) is an **independent, self-contained "Ready-Made PCB/Hardware-Style" DSP module**. 

Just like plugging a physical DSP daughterboard into a master mixer via data bus lines, you can embed this pure vector SVG component anywhere and connect it directly using the **Titan Opcode Bus (`lib/TitanOpcodeBus.js`)**.

```
┌────────────────────────────────────────────────────────────────────────┐
│               TITAN SVG ANIMATION CARD (PLUG-AND-PLAY MODULE)          │
│                                                                        │
│   📱 Top OLED Viewport (120 FPS Live Realtime Preview)                 │
│   🎬 4-Stage Lifecycle Engine (IN ➔ OVERALL ➔ OUT ➔ TRANS)             │
│   🎛️ 3-Channel Precision Touch Sliders (0 - 255 Steppers)              │
│   🚀 Master Launch Button ("APPLY TO MAIN CANVAS")                    │
│   📱 6-Tab Horizontal Navigation Dock (ANIM, TEXT, TYPO, COLOR...)     │
│                                                                        │
│        ▲                                              │                │
│   📥 INPUT WIRE (Timeline Selection)             📤 OUTPUT WIRE        │
│                                                   (0x00 - 0xFF Opcode) │
└────────┼──────────────────────────────────────────────┼────────────────┘
         │                                              ▼
 ┌───────┴───────────────────────────────────────────────────────────────┐
 │               NLE VIDEO TIMELINE & 16:9 CINEMA COMPOSITOR             │
 └───────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ 2. Key Specifications

| Specification | Details |
|---|---|
| **Rendering Engine** | 100% Pure Vector SVG (`viewBox="0 0 360 560"`) |
| **Resolution Scaling** | Infinite Vector Precision (Clean on 720p, 1080p, 4K, 8K) |
| **Opcode Capacity** | 256 Discrete Hardware Opcodes (`0x00` - `0xFF`) |
| **Animation Lifecycle** | 4 Stages: `IN (Entrance)` \| `OVERALL (Loop)` \| `OUT (Exit)` \| `TRANS (Cut)` |
| **Chassis Display Modes** | 📱 `With Frame` (Titanium Smartphone) \| ⬛ `Without Frame` (OLED Studio) |
| **Communication Bus** | Bi-directional Event Bus & Binary Serializer (`TitanOpcodeBus`) |

---

## 🚀 3. Quick Start Guide

### A. Basic Rendering in Node.js / Express / SSR

```javascript
const { renderTitanSvgAnimationCard } = require('danphe-ui');

// Generate the complete pure vector SVG markup
const svgHtml = renderTitanSvgAnimationCard({
    id: 'my-animation-card',
    activeStage: 'overall',
    activeTab: 'anim',
    textVal: 7,   // 0x07 = SINE_S_WAVE
    colorVal: 0,
    normalVal: 0
});

console.log(svgHtml);
```

---

### B. React / Next.js Component Usage

```jsx
import React, { useEffect } from 'react';
import { TitanSvgAnimationCard, TitanOpcodeBus } from 'danphe-ui';

export default function VideoInspector() {
    useEffect(() => {
        // Wire up output listener from the card
        const unsubscribe = TitanOpcodeBus.subscribe(
            TitanOpcodeBus.PROTOCOL.EVENTS.CARD_APPLY_TRIGGERED,
            (packet) => {
                console.log('⚡ Received Opcode from Card:', packet.data.opcode, packet.data.name);
                // Apply to active timeline clip
            }
        );
        return () => unsubscribe();
    }, []);

    return (
        <div className="w-full max-w-[360px] mx-auto">
            <div dangerouslySetInnerHTML={{ __html: TitanSvgAnimationCard() }} />
        </div>
    );
}
```

---

### C. Plain HTML / Browser Client Integration

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Danphe Animation Card</title>
    <!-- Include Danphe UI Animation CSS -->
    <link rel="stylesheet" href="danphe-animations.css">
    <script src="TitanOpcodeBus.js"></script>
</head>
<body class="bg-slate-950 p-8 flex items-center justify-center">

    <!-- Card Container -->
    <div id="card-slot" class="w-full max-w-[360px]">
        <!-- Injected SVG Card Here -->
    </div>

    <script>
        // 1. Listen for applied animations
        TitanOpcodeBus.subscribe('TITAN:CARD_APPLY_TRIGGERED', function(packet) {
            alert('Applied Opcode: ' + packet.data.opcode + ' (' + packet.data.name + ')');
        });

        // 2. Feed Timeline Selection into Card
        function onSelectTimelineClip(clip) {
            TitanOpcodeBus.dispatch('TITAN:TIMELINE_LAYER_SELECTED', {
                layerId: clip.id,
                layerType: clip.type, // 'text' | 'video' | 'audio'
                opcode: clip.opcode
            });
        }
    </script>
</body>
</html>
```

---

## 📡 4. Titan Opcode Bus Architecture (`TitanOpcodeBus.js`)

The card communicates asynchronously with any Timeline or WebGL canvas using standard **Opcode Packets**.

### 📦 Opcode Packet Data Structure:

```json
{
  "magic": 1414083921,
  "version": "1.0.0",
  "timestamp": 1756708300000,
  "action": "TITAN:CARD_APPLY_TRIGGERED",
  "sender": "titan_card",
  "target": "timeline",
  "data": {
    "layerId": "track-t1-clip-01",
    "layerType": "text",
    "stage": "overall",
    "opcode": "0x07",
    "opcodeInt": 7,
    "name": "SINE_S_WAVE",
    "cssClass": "titan-anim-type-sine-wave",
    "durationSec": 0.8,
    "easing": "cubic-bezier(0.4, 0, 0.2, 1)",
    "channels": {
      "textVal": 7,
      "colorVal": 0,
      "normalVal": 0
    },
    "timeRange": {
      "startSec": 2.0,
      "endSec": 4.5,
      "duration": 2.5
    }
  }
}
```

---

## 🔌 5. Event Directory & Protocol Channels

| Event Name | Direction | Description |
|---|---|---|
| `TITAN:CARD_OPCODE_CHANGED` | Card ➔ Bus | Fired when dragging sliders or stepping opcodes (`0 - 255`). |
| `TITAN:CARD_STAGE_CHANGED` | Card ➔ Bus | Fired when switching lifecycle pills (`IN`, `OVERALL`, `OUT`, `TRANS`). |
| `TITAN:CARD_APPLY_TRIGGERED` | Card ➔ Timeline | Fired when clicking `APPLY TO MAIN CANVAS`. Transmits complete opcode payload. |
| `TITAN:TIMELINE_LAYER_SELECTED` | Timeline ➔ Card | Sent by timeline when user selects a clip. Auto-switches card tabs. |
| `TITAN:TIMELINE_RANGE_DRAWN` | Timeline ➔ Card | Sent when drawing a Point A to Point B range with the Pen Tool. |
| `TITAN:TIMELINE_CUT_TRIGGERED` | Timeline ➔ Editor | Executes Draw-to-Cut on active media strip. |

---

## ⚡ 6. High-Speed 32-Byte Binary Serialization

For WebGL, WebCodecs, Web Workers, or C++/Rust/WASM video encoders, `TitanOpcodeBus` encodes packets into a raw 32-byte `ArrayBuffer`:

```javascript
const { encodeBinary, decodeBinary } = TitanOpcodeBus;

// Encode to 32-byte buffer
const rawBuffer = encodeBinary(packet);

// Decode back in C++ / WebAssembly / Worker
const decoded = decodeBinary(rawBuffer);
console.log(decoded.opcodeHex); // '0x07'
```

---

## 🎨 7. Common Opcode Cheat Sheet

| Opcode | Hex | Name | Effect Description |
|---|---|---|---|
| `0` | `0x00` | `STATIC_NORMAL` | Clean un-animated static typography / baseline. |
| `1` | `0x01` | `SLIDE_IN_LEFT` | Smooth kinetic slide entrance from left edge. |
| `2` | `0x02` | `SLIDE_IN_RIGHT` | Smooth kinetic slide entrance from right edge. |
| `3` | `0x03` | `JUMP_FROM_BOTTOM` | Upward pop-in with ease-out acceleration. |
| `4` | `0x04` | `DROP_FROM_TOP` | Downward gravity drop. |
| `5` | `0x05` | `DROP_BOUNCE_TOP` | Elastic multi-bounce impact from top. |
| `6` | `0x06` | `JUMP_UP_BOUNCE` | Upward leap with spring dampening. |
| `7` | `0x07` | `SINE_S_WAVE` | **S-Curve undulating sine wave ripple across letters.** |
| `8` | `0x08` | `WIPE_IN_RIGHT` | Left-to-right directional clip reveal. |
| `9` | `0x09` | `WIPE_IN_LEFT` | Right-to-left directional clip reveal. |
| `16` | `0x10` | `RAINDROP_SHATTER_FUSION` | **Letters shatter outward then snap back into crystal alignment.** |
| `17` | `0x11` | `S_CURVE_SNAKE_WAVE` | Continuous multi-frequency snake ripple. |
| `21` | `0x15` | `CIRCULAR_ORBIT_SPIN` | 360° circular orbit typography path. |

---

## 📄 License & System
Part of the **Danphe UI Universal Suite**. Designed for ultra-high-fidelity browser and hardware-accelerated desktop video compositors.
