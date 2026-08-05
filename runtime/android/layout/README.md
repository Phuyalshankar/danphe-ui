# 📐 Dolphin Native Layout Engine (`runtime/android/layout`)

The **Layout Engine** manages responsive grid rendering (`ViewFactoryGrid`), flexbox distributions (`ViewFactoryLayouts`), and gap/margin locks (`GapAwareLinearLayout`).

---

## 📂 Key Classes

| File | Class | Description |
|---|---|---|
| `GapAwareLinearLayout.kt` | `GapAwareLinearLayout` | Special `LinearLayout` overriding `onLayout` to lock gap margins and flex-1 weights against Android relayout collapses. |
| `ViewFactoryLayouts.kt` | Layout Extensions | Helpers for creating horizontal/vertical column containers and layout parameters. |
| `ViewFactoryGrid.kt` | `createSimpleGrid` | Custom grid container mapping `grid-cols-N` opcodes (`0x22`) to multi-column rows. |

---

## 🔒 Gap Lock Protocol
Standard Android `LinearLayout` resets margins and collapses weighted (`weight > 0`) children when state updates occur inside `ScrollView`. `GapAwareLinearLayout` stores weight hashes and reapplies margins deterministically on every layout pass.
