# 🧩 Dolphin Native Component System (`runtime/android/components`)

The **Component System** defines modular, single-responsibility builders for native Android views.

---

## 📂 Included Builders & Interfaces

| Component | Opcode | Builder Class | Description |
|---|---|---|---|
| Interface | N/A | `ComponentBuilder.kt` | Abstract contract for all modular UI builders. |
| Button | `0x10` | `ButtonBuilder.kt` | Native `MaterialButton` with icon, ripple, gradient & dynamic states. |
| Card | `0x11` | `CardBuilder.kt` | Standalone `MaterialCardView` with elevation, stroke & padding. |
| Column | `0x13` | `ColumnBuilder.kt` | Vertical container with `GapAwareLinearLayout` protection. |
| Container | `0x12` | `ColumnBuilder.kt` | Generic vertical/horizontal container layout. |
| Row | `0x14` | `RowBuilder.kt` | Horizontal container with gap and weighted child distribution. |
| Text | `0x16` | `TextBuilder.kt` | Native `TextView` supporting state bindings, typography & colors. |
| Image | `0x17` | `ImageBuilder.kt` | Native `ImageView` component with dynamic image loading. |
| TextField | `0x18` | `TextFieldBuilder.kt` | Material `TextInputLayout` supporting outline/filled variants and icons. |
| Switch | `0x1A` | `SwitchBuilder.kt` | Native `SwitchMaterial` input component. |
| Checkbox | `0x1B` | `CheckboxBuilder.kt` | Native `MaterialCheckBox` input component. |
| Select | `0x1C` | `SelectBuilder.kt` | Native dropdown select component. |
| RadioButton | `0x1F` | `RadioButtonBuilder.kt` | Native radio button group input component. |
