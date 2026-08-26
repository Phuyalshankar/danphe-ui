# 🤖 AI Maintenance Guidelines for Hardware API (`src/hardware`)

This document provides strict invariants, action naming rules, and descriptor standards for AI Coding Assistants working on `src/hardware`.

---

## 🔒 Descriptor Invariants

1. **Stateless Functions**:
   - Hardware modules MUST be plain JavaScript objects containing pure descriptor functions.
   - Do NOT store per-call state inside hardware objects.

2. **Action Naming Convention (`_action`)**:
   - Every hardware descriptor MUST specify `_hw: true`.
   - Every hardware descriptor MUST include `cmd` (from `HW_CMD`) and `_action` string in format `hw:<domain>:<action>` (e.g. `hw:gps:get`, `hw:camera:capture`, `hw:battery:status`).

3. **Android/iOS Matching**:
   - `_action` strings MUST match the action dispatchers handling requests in `DolphinHardwareBridge.kt` (Android) and `DolphinHardwareBridge.swift` (iOS).
