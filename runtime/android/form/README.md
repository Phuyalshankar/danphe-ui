# 📋 Dolphin Native Form Engine (`runtime/android/form`)

The **Form Engine** is a fully modularized form component system. Each form control resides in its own focused, single-responsibility micro-component file.

---

## 📂 Form Micro-Components

| File | Class / Object | Description |
|---|---|---|
| `FormInputField.kt` | `FormInputField` | Native `TextInputEditText` with input types (text, password, email, number), gravity & NanoStore watcher. |
| `FormLabel.kt` | `FormLabel` | MUI-style floating label typography, default/focused colors & state handling. |
| `FormIcon.kt` | `FormIcon` | Leading & trailing icon resolver, system icon mappings & password eye toggle. |
| `FormCheckbox.kt` | `FormCheckbox` | Native `MaterialCheckBox` input control with state binding. |
| `FormSelect.kt` | `FormSelect` | Native Dropdown / Spinner control mapped to CSV options & state engine. |
| `FormRadioGroup.kt` | `FormRadioGroup` | Native Radio Button group control for option selection. |
| `FormStyle.kt` | `FormStyle` | CSS properties, margin/padding parsing & dark/light theme palette resolution. |
| `FormValidator.kt` | `FormValidator` | Input validation rules (email regex, required fields, min/max length). |
| `DolphinFormEngine.kt` | `DolphinFormEngine` | Master orchestrator connecting form micro-components to the runtime. |

---

## 💻 Usage Example

```kotlin
// Create a text input using FormInputField
val editText = FormInputField.createEditText(
    ctx = context,
    inputTypeStr = "email",
    hintText = "Enter Email",
    stateKey = "user_email",
    textColor = Color.BLACK,
    onAction = null
)
```
