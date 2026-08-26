<div align="center">

<p align="center">
  <img src="./assets/danphe-logo.svg" width="130" alt="3D Animated Danphe Bird (Himalayan Monal)" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="./assets/nepal-flag.svg" width="100" alt="Animated Flag of Nepal" />
</p>

# 🐬 danphe-ui

[![npm version](https://img.shields.io/badge/npm-v1.0.0-crimson.svg?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/danphe-ui)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![ThorVG Ready](https://img.shields.io/badge/ThorVG-C%2B%2B%20LVGL-emerald.svg?style=for-the-badge&logo=cplusplus)](https://www.thorvg.org/)
[![Icons](https://img.shields.io/badge/Pure%20Vector%20Icons-512%20Unique-cyan.svg?style=for-the-badge)](https://github.com/phuyalshankar/danphe-ui)
[![Nepal Pride](https://img.shields.io/badge/National%20Pride-Danphe%20%26%20Flag%20120FPS-red.svg?style=for-the-badge)](https://github.com/phuyalshankar/danphe-ui)

### 👑 The World's 1st Silicon-Grade Vector UI & Native Micro-Bus Component Engine for Web, Android, Embedded C++ & Dolphin Language

**Zero Heavy Dependencies • 100/100 Core Web Vitals • 120 FPS Pure GPU Vector Animation • 512 Hand-Crafted Unique Bézier Icons • 3D Himalayan Monal Bird • Constitutional Flag of Nepal • Dolphin Native Patro Core (B.S. 2000-2100)**

---

</div>

## 🌟 Highlights & Key Innovations

- 🦚 **3D Animated Danphe Bird (National Bird of Nepal):** 9-color iridescent metallic plumage with 120 FPS crown crest flutter and wing respiration physics (`<DanpheLogo />`).
- 🇳🇵 **Constitutional Animated Flag of Nepal:** The world's only non-quadrilateral flag with 120 FPS GPU wave flutter physics (`<NepalFlag />`).
- 📅 **Dolphin Native Patro Core:** 101-Year (BS 2000-2100) Julian Day Number (JDN) Bikram Sambat Date Engine (`<NepaliDateTag />` & `adToBs()`).
- 📈 **Zero-Dependency Vector Chart Suite:** 16-Bit silicon-grade Cubic Bézier Area waves, Bar charts, Donut breakdown & Sparklines (`<TitanChart />`).
- ✍️ **Live SVG Vector Whiteboard & Signature Engine:** Real-time sub-pixel Quadratic Bézier spline smoothing, neon glow brushes, mobile touch & 1-click standalone SVG export (`<TitanWhiteboard />`).
- 🔄 **Twin-State Binary Paired Icons:** 1-Bit automated morphing toggles for Eye/EyeOff, Lock/Unlock, Mic/MicOff, Play/Pause, WiFi, Sun/Moon (`<TitanIcon icon="eye" active={isToggled} />`).
- 🎨 **Full 512 Pure Vector Icons Matrix:** 256 Core Telephony (0-255) + 256 Extended Web/Lucide Suite (256-511) with ZERO repetition.
- ⚡ **Silicon-Grade 16-Bit Register Micro-Bus:** Direct memory-mapped binding with `titan-bus` for ultra-low latency real-time telemetry.
- 🏥 **Enterprise Component Suite:** Hospital ICU Vitals Tables, CDR Tables, Connected Segmented Button Groups, Master Cards, Modals, and Toasts.

---

## 📦 Installation

```bash
npm install danphe-ui
```

---

## 🇳🇵 1. Official National Flag of Nepal & Dolphin Patro Engine

```jsx
import { NepalFlag, NepaliDateTag, getNepaliDate, adToBs } from 'danphe-ui/components';

// 1. 120 FPS Animated Fluttering National Flag of Nepal
<NepalFlag width={64} height={78} animated={true} />

// 2. Live Ticking Bikram Sambat (वि.सं.) Date Badge
<NepaliDateTag variant="pill" />
// Output: [ 🇳🇵 वि.सं. २०८३ भाद्र ९ गते, मंगलबार • २३:३०:०० ]

// 3. Convert Gregorian (A.D.) to Bikram Sambat (B.S.)
const bs = adToBs(2026, 8, 25);
console.log(bs); // { year: 2083, month: 5, day: 9, monthNameNp: 'भाद्र' }
```

---

## 🔄 2. Twin-State Binary Paired Icons (1-Bit Toggle)

<details>
<summary><b>👇 [Click to Expand] Twin-State Binary Pairs (10 Automated Morphing Pairs)</b></summary>

<br/>

| Icon Key | Active State (`active={true}`) | Inactive State (`active={false}`) | Real-World Use Case |
|---|---|---|---|
| `"eye"` | 👁️ `Eye (Visible)` | 🙈 `EyeOff (Hidden)` | Password field reveal toggle |
| `"lock"` | 🔒 `Lock (Locked)` | 🔓 `Unlock (Open)` | Vault / Account security status |
| `"mic"` | 🎙️ `Mic (Unmuted)` | 🔇 `MicOff (Muted)` | Live voice & conference calls |
| `"volume"` | 🔊 `Volume (High)` | 🔇 `VolumeMute (Muted)` | Video / Audio player audio |
| `"play"` | ▶️ `Play (Playing)` | ⏸️ `Pause (Paused)` | Media playback state |
| `"wifi"` | 📶 `WiFi (Online)` | 📵 `WiFi (Offline)` | Network connection monitor |
| `"sun"` | ☀️ `Sun (Light Mode)` | 🌙 `Moon (Dark Mode)` | Theme appearance switcher |
| `"toggle"` | 🔘 `Toggle Right (ON)` | 🔘 `Toggle Left (OFF)` | Hardware switch indicator |
| `"user"` | 👤 `User (Verified)` | 👤 `User (Blocked)` | User authentication gate |
| `"shield"` | 🛡️ `Shield (Secured)` | 🛡️ `Shield (Alert)` | Firewall & endpoint defense |

### Code Example:
```jsx
import { TitanIcon } from 'danphe-ui/components';

// Automatically switches between Eye and EyeOff with zero ternary operators!
<TitanIcon icon="eye" active={showPassword} />
```

</details>

---

## 🎨 3. Full 512 Pure Vector Icons Spectrum (0 to 511)

<details>
<summary><b>👇 [Click to Expand] Full 512 Vector Icon Spectrum Directory</b></summary>

<br/>

### 📞 Bank 0x00: Core Telephony & Hardware Icons (0 to 255)
- `0 - 15`: Idle, Incoming Voice, Incoming Video, Outgoing Voice, Missed Call, Connected Call, Mic Mute, Chat, Voicemail, Headset, Call Forward, Call Hold, Call Transfer, Conference, Recording, DTMF Keypad.
- `16 - 31`: Speakerphone, Bluetooth, Volume Up/Down, Dial Buffer, Signal Bars, Battery Levels, SIM Card, Network Trunk, SRTP Encryption Shield, SIP PBX Status, Trunk Alarms.
- `32 - 127`: Alpha-Numeric Glyphs, Vector Numbers, Diagnostic Indicators, Sensor Gauges.
- `128 - 255`: Cyberpunk Neon Badges, Matrix Displays, Hardware Registers, Master highway indicators.

### 🌐 Bank 0x01: Extended Web & Lucide-Matching Suite (256 to 511)
- **Web & Navigation (256-279)**: `Search`, `Home`, `Settings`, `User`, `Users`, `Bell`, `Filter`, `Share`, `Link`, `ExternalLink`, `Menu`, `Grid`, `List`, `MoreH`, `MoreV`, `ChevronUp`, `ChevronDown`, `ChevronLeft`, `ChevronRight`, `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Expand`.
- **Editing & Files (280-309)**: `Edit`, `Trash`, `Plus`, `Minus`, `Check`, `Close`, `Copy`, `Save`, `Download`, `Upload`, `File`, `FileText`, `Folder`, `FolderPlus`, `FolderMinus`, `Image`, `Video`, `Music`, `Eye`, `EyeOff`, `Lock`, `Unlock`, `Key`, `Bookmark`, `Star`, `Heart`, `Pin`, `Flag`, `Tag`, `Scissors`.
- **Developer & DevOps (310-339)**: `Code`, `Terminal`, `CPU`, `Database`, `Server`, `Cloud`, `CloudRain`, `CloudSnow`, `GitBranch`, `GitCommit`, `GitPullRequest`, `GitMerge`, `Bug`, `WiFi`, `WiFiOff`, `Bluetooth`, `Battery`, `BatteryCharging`, `Plug`, `Globe`, `Monitor`, `Smartphone`, `Tablet`, `Keyboard`, `Mouse`, `Printer`, `HardDrive`, `USB`, `QRCode`, `Barcode`.
- **FinTech & E-Commerce (340-369)**: `CreditCard`, `Wallet`, `Cart`, `ShoppingBag`, `Dollar`, `Euro`, `Pound`, `Bitcoin`, `Coins`, `Receipt`, `Percent`, `Calculator`, `TrendingUp`, `TrendingDown`, `Activity`, `PieChart`, `BarChart`, `Bank`, `PiggyBank`, `Vault`, `Invoice`, `Package`, `Truck`, `Gift`, `Award`, `Crown`, `Scale`, `Briefcase`, `Compass`, `Anchor`.
- **Hospital & Science (370-399)**: `Stethoscope`, `Pill`, `Thermometer`, `ICUBed`, `Ambulance`, `HospitalCross`, `HeartPulse`, `DNA`, `Syringe`, `Microscope`, `Lungs`, `Brain`, `Bone`, `Droplet`, `FirstAid`, `ShieldAlert`, `Cross`, `Flask`, `TestTube`, `Atom`, `Flame`, `Bandage`, `Virus`, `EyeDrop`, `Wheelchair`, `Teeth`, `Prescription`, `Scalpel`, `Oxygen`, `Crutch`.
- **Communication & Media (400-429)**: `Chat`, `Mail`, `MailOpen`, `Send`, `Calendar`, `Clock`, `MapPin`, `Map`, `PhoneCall`, `PhoneForward`, `PhoneMissed`, `VideoCamera`, `Mic`, `MicOff`, `VolumeHigh`, `VolumeMute`, `VolumeLow`, `Play`, `Pause`, `Stop`, `SkipForward`, `SkipBack`, `Shuffle`, `Repeat`, `Radio`, `Podcast`, `Megaphone`, `RSS`, `MessageCircle`, `ThumbsUp`.
- **Weather & Environment (430-459)**: `Sun`, `Moon`, `CloudSun`, `Sunrise`, `Sunset`, `Wind`, `Umbrella`, `Snowflake`, `Lightning`, `WaterDroplets`, `Rainbow`, `ThermometerHot`, `Tree`, `Leaf`, `Flower`, `Mountain`, `Waves`, `Campfire`, `Tornado`, `Bullseye`, `Sparkles`, `MoonStars`, `SunDim`, `CloudFog`, `CloudLightning`, `ThermometerCold`, `Feather`, `GlobeAmericas`, `Planet`, `Tent`.
- **Security & Diagnostics (460-489)**: `ShieldCheck`, `ShieldX`, `ShieldAlert`, `Fingerprint`, `Scan`, `KeyRound`, `LockKeyhole`, `UserCheck`, `UserX`, `UserPlus`, `UserMinus`, `Sliders`, `ToggleLeft`, `ToggleRight`, `Gauge`, `HelpCircle`, `Info`, `AlertTriangle`, `AlertCircle`, `AlertOctagon`, `CheckCircle`, `XCircle`, `Slash`, `RadioTower`, `Power`, `LogIn`, `LogOut`, `Loader`, `Minimize`, `Move`.
- **Tools & Hardware (490-511)**: `Wrench`, `Hammer`, `Screwdriver`, `HexNut`, `Ruler`, `PenTool`, `Highlighter`, `Paperclip`, `Clipboard`, `BookClosed`, `BookOpen`, `GraduationCap`, `Coffee`, `GlassWater`, `Dumbbell`, `Trophy`, `Target`, `Rocket`, `Lightbulb`, `Puzzle`, `CrownGold`, `AllSpectrum`.

</details>

---

## 🏥 4. Enterprise Component Suite

<details>
<summary><b>👇 [Click to Expand] Tables, Buttons, Cards & Navigation Bar Examples</b></summary>

<br/>

### Hospital ICU & Patient Table:
```jsx
import { TitanTable } from 'danphe-ui/components';

<TitanTable 
    variant="medical"
    title="Hospital ICU Patient Roster"
    subtitle="Live Biometrics & Vitals"
    badge="4 ACTIVE BEDS"
/>
```

### Real-Time Vector Wave Chart:
```jsx
import { TitanChart } from 'danphe-ui/components';

<TitanChart 
    variant="area"
    title="ICU Vitals Telemetry"
    data={[72, 75, 78, 85, 98, 88, 76, 80, 84, 92]}
    labels={['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00']}
    color="cyan"
/>
```

### Live SVG Vector Whiteboard & Signature Pad:
```jsx
import { TitanWhiteboard } from 'danphe-ui/components';

<TitanWhiteboard 
    title="Doctor Signature & Freehand Canvas"
    width={800}
    height={360}
/>
```

### Connected Button Group:
```jsx
import { TitanButtonGroup } from 'danphe-ui/components';

<TitanButtonGroup 
    variant="connected"
    buttons={[
        { label: 'All Wards', active: true },
        { label: 'ICU Critical' },
        { label: 'Emergency' }
    ]}
/>
```

### Enterprise Navigation Bar:
```jsx
import { TitanNavbar } from 'danphe-ui/components';

<TitanNavbar 
    brandName="DANPHE-UI"
    brandLogo="🐬"
    systemStatus="ONLINE"
    routes={['Dashboard', 'Patients', 'Telephony', 'Settings']}
    activeRoute="Dashboard"
/>
```

</details>

---

## ⚡ 5. 16-Bit Register Micro-Bus Integration

```javascript
const { TitanMicroBus, TITAN_REG } = require('danphe-ui');

// Write to Bus Register
TitanMicroBus.write(TITAN_REG.CORE.SYSTEM_STATUS, 'ONLINE');

// Subscribe to Real-Time Sensor
TitanMicroBus.subscribe(TITAN_REG.SENSORS.WIFI_RSSI, (rssi) => {
    console.log('Live RSSI:', rssi);
});
```

---

## 📜 License

MIT © 2026 Shankar Phuyal. Crafted with pride in Nepal 🇳🇵
