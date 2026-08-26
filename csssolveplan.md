# 🎨 CSS Solve & Native Debug Architecture Plan (`csssolveplan.md`)
══════════════════════════════════════════════════════════════════════════════════
> **प्रोजेक्ट (Project):** Danphe-2 (Dolphin Native 2) & Dolphin-PBX  
> **समस्या (Problem):** Dolphin-PBX को `ActiveCallScreen` / Action Pages मा `AppBar` तथा अन्य कम्पोनेन्टहरूमा CSS शैली (Styles) ठीकसँग apply नहुनु।  
> **उद्देश्य (Objective):** JSX मा लेखिएको CSS ➔ Compiler ले बनाएको 24-Byte Opcode ➔ Android Kotlin Native (`ViewFactoryStyles.kt`) मा कसरी र के-के apply भयो भनेर 100% स्पष्ट हेर्न मिल्ने Native Debug Logger & Comparison System निर्माण गर्नु।

---

## 1. 🔍 समस्याको विस्तृत विश्लेषण (Problem Root-Cause Analysis)

`dolphin-pbx` को `AppBar.jsx` मा लेखिएको CSS:
```jsx
<div className="flex-row items-center justify-between p-3 bg-slate-900/90 rounded-2xl border border-slate-800/80 shadow-lg w-full mb-2">
```

### सम्भावित कारणहरू (Potential Failure Points):
1. **Opacity Slash Syntax (`/90`, `/80`)**:
   - `bg-slate-900/90` र `border-slate-800/80` मा भएको `/opacity` पार्सिङ `ubParser.js` वा `UniversalUIImporter.js` मा हराउने वा शून्य (`0`) हुने सम्भावना।
2. **24-Byte Opcode Slot Mapping**:
   - `Padding (p-3 = 12px)` Byte 4..7 मा सहि लेखिए पनि Kotlin को `ViewFactoryStyles.kt` मा View Layout Params ले override गरेको हुनसक्ने।
3. **Child / Parent View Hierarchy**:
   - `ActiveCallScreen.jsx` मा Root Container `min-h-screen items-center` हुँदा `AppBar` को `w-full` (Full Width) layout Android `LinearLayout` ले `WRAP_CONTENT` मा सीमित गरिदिएको हुनसक्ने।
4. **Visibility / Logging Gap**:
   - अहिले Android Native मा वास्तवमा कुन View मा कुन `bin[0..23]` पुग्यो र कुन Android View Method (`setBackground`, `setPadding`, `setTextColor`) कल भयो भन्ने प्रत्यक्ष Log नहुँदा अनुमानमा काम गर्नुपर्ने अवस्था छ।

---

## 2. 🛠️ प्रस्तावित समाधान: Native CSS Debug & Inspector System

हामी `d:\danphe-2\runtime\android\` भित्र एउटा डेडिकेटेड `debug/` मोड्युल निर्माण गर्नेछौं, जसलाई विकास (development) को बेला सजिलै `ON` र प्रोडक्सनमा `OFF` गर्न सकिनेछ।

```
d:\danphe-2\runtime\android\
 └── debug/
      ├── CssApplyLogger.kt          # Native Android CSS Apply & Opcode Decoder Logger
      ├── CssInspectorBridge.kt      # WebSocket / DevServer मा प्रत्यक्ष Live CSS Trace पठाउने
      └── DebugConfig.kt             # DEBUG_CSS = true / false टगल फ्ल्याग
```

### A. `CssApplyLogger.kt` को कार्य (Architecture & Implementation)

प्रत्येक View मा CSS apply हुँदा `CssApplyLogger` ले निम्न कुराहरू Logcat तथा DevServer मा रेकर्ड गर्नेछ:
1. **View Identifier**: View Type (`LinearLayout`, `TextView`, `MaterialButton`), View ID / Index, Screen Name।
2. **Raw 24-Byte Binary Opcode (`bin[0..23]`)**: Byte 0 (Flex/Gravity), Byte 1 (Opcode), Byte 2..3 (BgColor), Byte 4..7 (Padding T/R/B/L), Byte 8..11 (Margin T/R/B/L), Byte 14 (Radius), Byte 15 (Flags)।
3. **Computed Native Values**:
   - `Padding`: `[Top: 12dp, Right: 12dp, Bottom: 12dp, Left: 12dp]`
   - `Margin`: `[Top: 0dp, Right: 0dp, Bottom: 8dp, Left: 0dp]`
   - `Background`: Color Hex (उदा. `#E60F172A` - Alpha 90%) + Corner Radius (`16dp`)
   - `Border`: Width (`1dp`) + Color (`#CC1E293B`)
   - `Layout Size`: Width = `MATCH_PARENT`, Height = `WRAP_CONTENT`
4. **Android Native Action Executed**: `v.setPadding(...)`, `v.background = GradientDrawable(...)`, `v.layoutParams = ...`।

```kotlin
// Example Concept for CssApplyLogger.kt
package io.dolphin.runtime.debug

import android.util.Log
import android.view.View

object CssApplyLogger {
    var isEnabled: Boolean = true
    private const val TAG = "🐬[CSS_APPLY]"

    fun logApply(viewName: String, bin: ByteArray, details: String) {
        if (!isEnabled) return
        val hex = bin.joinToString(" ") { "%02X".format(it) }
        val pad = "T:${bin[4]} R:${bin[5]} B:${bin[6]} L:${bin[7]}"
        val radius = bin[14].toInt() and 0xFF
        val flags = bin[15].toInt() and 0xFF
        
        Log.d(TAG, "┌─ View: $viewName | Opcode: 0x%02X".format(bin[1]))
        Log.d(TAG, "│  HEX: [$hex]")
        Log.d(TAG, "│  Decoded: Pad($pad) | Radius: ${radius}px | Flags: 0x%02X".format(flags))
        Log.d(TAG, "│  Native Applied: $details")
        Log.d(TAG, "└──────────────────────────────────────────────")
    }
}
```

---

## 3. 📊 JSX vs Compiled Opcode vs Kotlin Applied (3-Way Comparison Dashboard)

हामी DevServer (`http://localhost:7787/css-inspect`) मा एउटा प्रत्यक्ष **3-Way Comparison Screen** थप्नेछौं:

| JSX Source Class (Input) | Compiled 24-Byte Opcode (`UniversalUIImporter.js`) | Android Native Applied (`ViewFactoryStyles.kt`) | Status |
| :--- | :--- | :--- | :--- |
| `p-3` | Bytes 4..7: `[12, 12, 12, 12]` | `v.setPadding(12, 12, 12, 12)` | ✅ Match |
| `bg-slate-900/90` | Byte 2: `0x5A`, Byte 3: `0x09`, Alpha: `0xE6` | `GradientDrawable.setColor(#E60F172A)` | ⚠️ Verify |
| `border-slate-800/80` | Byte 15 Flag: `0x04`, BorderColor: `#CC1E293B` | `GradientDrawable.setStroke(1dp, ...)` | ⚠️ Verify |
| `rounded-2xl` | Byte 14: `16` (16px Corner Radius) | `GradientDrawable.cornerRadius = 16f` | ✅ Match |
| `w-full` | Byte 0 Layout Flag: `MATCH_PARENT` | `LayoutParams.width = -1` | ⚠️ Check |

---

## 4. 💡 छु्ट्टै प्रोजेक्ट (Standalone Comparator Tool) बनाउने आइडिया बारे सुझाव

> **हजुरको आइडिया:** *"सबै final kt ra jsx compare accurate hune chhutai project banaune kasto chha idea plan dinus"*

### 🌟 मूल्याङ्कन (Evaluation) & उत्कृष्ट सुझाव (Best Recommendation):
हजुरको यो सोच **अत्यन्तै प्रभावकारी र उत्कृष्ट** छ! 
तर छुट्टै पूरै फरक प्रोजेक्ट बनाउँदा कोड synchronize गर्न गाह्रो हुन सक्छ। त्यसैले यसलाई निम्न अनुसार **२-भागिय स्मार्ट सिस्टम (2-Tier Architecture)** मा निर्माण गर्नु सबैभन्दा उत्तम हुनेछ:

1. **Tier 1: Danphe-2 भित्रै Native Debug Folder (`d:\danphe-2\runtime\android\debug/`)**:
   - यो Kotlin Runtime भित्रै बस्नेछ।
   - एउटा सिंगल फ्ल्याग `DebugConfig.ENABLE_CSS_LOGS = true` ले अन/अफ हुनेछ।
   - विकास सकिएपछि कुनै फाइल हटाउनु पर्दैन; केवल फ्ल्याग `false` गरेपछि 0% runtime overhead रहन्छ।
2. **Tier 2: Dedicated CSS Inspector & Test Suite Project (`d:\danphe-css-inspector` वा `d:\danphe-2\tools\inspector`)**:
   - यो एउटा हलुका (lightweight) नोड / वेब टुल हुनेछ जसले:
     - कुनै पनि JSX फाइल (उदा. `AppBar.jsx`) इनपुट लिन्छ।
     - `UniversalUIImporter.js` र `DolphinCompiler.js` चलाएर बाइनरी अपकोड निकाल्छ।
     - Kotlin Native `ViewFactoryStyles.kt` को नियमसँग line-by-line दाँजेर (compare गरेर) कुन CSS छुट्यो वा apply भएन तुरुन्तै रातो/हरियो (diff table) मा देखाउँछ।

---

## 5. 🚀 कार्य योजना र चरणहरू (Step-by-Step Execution Plan)

### चरण १: Debug Folder र Native Logger तयार गर्ने (`Danphe-2`)
- [ ] `d:\danphe-2\runtime\android\debug\CssApplyLogger.kt` निर्माण गर्ने।
- [ ] `ViewFactoryStyles.kt`, `BorderApplier.kt`, `TextBuilder.kt` मा Logger hook जोड्ने।
- [ ] Opcode, Padding, Color, Border र LayoutParams कसरी सेट भयो सो Logcat मा स्पष्ट देखिने बनाउने।

### चरण २: `AppBar.jsx` को CSS समस्या समाधान गर्ने
- [ ] `bg-slate-900/90` र `border-slate-800/80` मा भएको opacity slash syntax compiler मा validate गर्ने।
- [ ] `ActiveCallScreen.jsx` मा `AppBar` को width layout (`w-full`) Android root container मा `MATCH_PARENT` रहने निश्चित गर्ने।
- [ ] `rounded-2xl` र `p-3` को GradientDrawable Background ठीकसँग apply भएको सुनिश्चित गर्ने।

### चरण ३: Comparison Dashboard & Inspector Tool निर्माण गर्ने
- [ ] DevServer HTTP (Port 7787) मा `/css-inspect` endpoint थप्ने जसले JSX vs Opcode vs Native Rule देखाउनेछ।
- [ ] परीक्षण र प्रमाणीकरण सम्पन्न गरी Walkthrough रिपोर्ट तयार गर्ने।
