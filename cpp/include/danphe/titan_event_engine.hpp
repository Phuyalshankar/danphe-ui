/**
 * 🏔️ TITAN UNIVERSAL EVENT & REACTIVE CONTROL ENGINE (v2.0)
 * ═══════════════════════════════════════════════════════════════════════════════
 * Pure C++17/C++20 Header-Only In-Memory Hardware Bus & Event Engine.
 * Zero-Heap Allocations (0 Bytes Dynamic RAM).
 *
 * Compatible with Dolphin Language, Android NDK, Node.js C++ Addons,
 * Embedded Systems, Windows, Linux, and macOS.
 */

#ifndef DANPHE_TITAN_EVENT_ENGINE_HPP
#define DANPHE_TITAN_EVENT_ENGINE_HPP

#include <cstdint>
#include <cstddef>
#include <array>
#include <functional>
#include <vector>
#include <cmath>
#include <algorithm>
#include <string_view>

namespace danphe::titan {

// ── 1. TITAN 16-BIT REGISTER ADDRESS MAP (0x4000 - 0x4700) ───────────────────
enum class TitanReg : uint16_t {
    // Transport & Master (0x4000 - 0x401F)
    SYS_STATUS           = 0x4000,
    PLAYBACK_STATE       = 0x4001,
    PLAYHEAD_MS          = 0x4002,
    MASTER_VOLUME        = 0x4003,
    ACTIVE_TOOL          = 0x4004,
    ACTIVE_WORKSPACE     = 0x4005,
    MONITOR_ZOOM_LEVEL   = 0x4006,
    MONITOR_PAN_X        = 0x4007,
    MONITOR_PAN_Y        = 0x4008,
    TIMELINE_ZOOM        = 0x4009,

    // Video Compositing & 2D/3D Transforms (0x4100 - 0x411F)
    VIDEO_OPACITY        = 0x4100,
    VIDEO_SCALE          = 0x4101,
    VIDEO_ROTATION       = 0x4102,
    VIDEO_POS_X          = 0x4103,
    VIDEO_POS_Y          = 0x4104,
    VIDEO_CORNER_RADIUS  = 0x4105,
    VIDEO_BLUR_GAUSSIAN  = 0x4106,
    VIDEO_FLAGS_BITMASK  = 0x4110,

    // Lumetrie Color Grading (0x4120 - 0x413F)
    COLOR_EXPOSURE       = 0x4120,
    COLOR_CONTRAST       = 0x4121,
    COLOR_SATURATION     = 0x4122,
    COLOR_TEMPERATURE    = 0x4123,
    COLOR_TINT           = 0x4124,
    COLOR_HIGHLIGHTS     = 0x4125,
    COLOR_SHADOWS        = 0x4126,

    // Typography & Text (0x4200 - 0x423F)
    TEXT_FONT_SIZE       = 0x4200,
    TEXT_TRACKING        = 0x4201,
    TEXT_STROKE_WIDTH    = 0x4202,
    TEXT_SHADOW_BLUR     = 0x4203,
    TEXT_SHADOW_ANGLE    = 0x4204,
    TEXT_SHADOW_DIST     = 0x4205,
    TEXT_EXTRUDE_DEPTH   = 0x4206,
    TEXT_GLOW_SPREAD     = 0x4207,
    TEXT_OPACITY         = 0x4208,
    TEXT_ROTATION_Z      = 0x4209,
    TEXT_ROT_X_3D        = 0x420A,

    // Audio & Vector CAD Draw (0x4300 - 0x438F)
    AUDIO_EQ_MASTER_GAIN = 0x4300,
    DRAW_TOOL_MODE       = 0x4380,
    DRAW_BRUSH_SIZE      = 0x4381,
    DRAW_BRUSH_COLOR_R   = 0x4382,
    DRAW_BRUSH_COLOR_G   = 0x4383,
    DRAW_BRUSH_COLOR_B   = 0x4384,
    DRAW_BRUSH_OPACITY   = 0x4385,
    DRAW_STROKE_COUNT    = 0x4386,

    // Timeline Multi-Track State (0x4400 - 0x4420)
    TL_ACTIVE_TRACK      = 0x4400,
    TL_TOTAL_CLIPS       = 0x4401,
    TL_CLIP_START_MS     = 0x4402,
    TL_CLIP_DURATION_MS  = 0x4403,
    TL_CLIP_SPEED_PCT    = 0x4404,
    TL_LINKED_STATE      = 0x4405,
    TL_SNAP_MAGNET       = 0x4406,
    TL_ACTION_TRIGGER    = 0x4407,

    // Universal Input & Event Registers (0x4600 - 0x4650)
    MOUSE_POS_X          = 0x4600,
    MOUSE_POS_Y          = 0x4601,
    MOUSE_CANVAS_X       = 0x4602,
    MOUSE_CANVAS_Y       = 0x4603,
    MOUSE_DELTA_X        = 0x4604,
    MOUSE_DELTA_Y        = 0x4605,
    MOUSE_WHEEL_DELTA    = 0x4606,
    MOUSE_BUTTONS_MASK   = 0x4607,
    MODIFIER_KEYS_MASK   = 0x4608,
    ACTIVE_SURFACE       = 0x4609,
    ACTIVE_DRAG_MODE     = 0x460A,
    ACTIVE_HOVER_CLIP    = 0x460B,
    ACTIVE_HOVER_TRACK   = 0x460C,

    // Forms, Inputs, Sliders & Actions (0x4610 - 0x4620)
    FORM_INPUT_REG_TARGET= 0x4610,
    FORM_INPUT_RAW_VAL   = 0x4611,
    FORM_EVENT_TRIGGER   = 0x4612,
    KEYBOARD_LAST_KEY    = 0x4630,
    KEYBOARD_HOTKEY_CODE = 0x4631
};

// ── 2. BITMASKS & ENUMS ───────────────────────────────────────────────────────
namespace Modifiers {
    constexpr uint8_t CTRL  = 1 << 0;
    constexpr uint8_t SHIFT = 1 << 1;
    constexpr uint8_t ALT   = 1 << 2;
    constexpr uint8_t SPACE = 1 << 3;
    constexpr uint8_t META  = 1 << 4;
}

namespace MouseButtons {
    constexpr uint8_t LEFT   = 1 << 0;
    constexpr uint8_t RIGHT  = 1 << 1;
    constexpr uint8_t MIDDLE = 1 << 2;
}

enum class SurfaceTarget : uint8_t {
    UNKNOWN          = 0,
    CANVAS_STAGE     = 1,
    TIME_RULER       = 2,
    TRACK_LANES      = 3,
    TRACK_HEADERS    = 4,
    INSPECTOR_DECK   = 5,
    WORKSPACE_SPLIT  = 6
};

enum class DragMode : uint8_t {
    IDLE             = 0,
    SCRUB            = 1,
    CLIP_MOVE        = 2,
    CLIP_TRIM        = 3,
    RAZOR_SLICE      = 4,
    STROKE_DRAW      = 5,
    HAND_PAN         = 6,
    GIZMO_TRANSFORM  = 7
};

enum class ToolMode : uint8_t {
    SELECT = 1,
    TRACK_SELECT = 2,
    RIPPLE = 3,
    RAZOR = 4,
    HAND = 5,
    ZOOM = 6,
    DRAW = 7
};

// ── 3. MEMORY-MAPPED HARDWARE BUS CORE (0x5500 Registers) ─────────────────────
constexpr size_t TITAN_MEMORY_BANK_SIZE = 0x5500;

class TitanMicroBus {
public:
    using RegisterCallback = std::function<void(double val, uint16_t addr, double oldVal)>;

    TitanMicroBus() {
        m_memoryBank.fill(0.0);
    }

    void write(uint16_t address, double value) {
        if (address >= TITAN_MEMORY_BANK_SIZE) return;
        double oldVal = m_memoryBank[address];
        m_memoryBank[address] = value;

        if (m_isBatching) {
            m_batchQueue.push_back({address, value, oldVal});
            return;
        }

        dispatchListeners(address, value, oldVal);
    }

    void write(TitanReg reg, double value) {
        write(static_cast<uint16_t>(reg), value);
    }

    double read(uint16_t address, double defaultValue = 0.0) const {
        if (address >= TITAN_MEMORY_BANK_SIZE) return defaultValue;
        return m_memoryBank[address];
    }

    double read(TitanReg reg, double defaultValue = 0.0) const {
        return read(static_cast<uint16_t>(reg), defaultValue);
    }

    void subscribe(uint16_t address, RegisterCallback callback) {
        if (address >= TITAN_MEMORY_BANK_SIZE) return;
        m_listeners[address].push_back(callback);
    }

    void subscribe(TitanReg reg, RegisterCallback callback) {
        subscribe(static_cast<uint16_t>(reg), callback);
    }

    void startBatch() {
        m_isBatching = true;
        m_batchQueue.clear();
    }

    void flushBatch() {
        m_isBatching = false;
        for (const auto& item : m_batchQueue) {
            dispatchListeners(item.addr, item.val, item.oldVal);
        }
        m_batchQueue.clear();
    }

private:
    struct BatchItem {
        uint16_t addr;
        double val;
        double oldVal;
    };

    void dispatchListeners(uint16_t addr, double val, double oldVal) {
        if (addr < m_listeners.size()) {
            for (const auto& cb : m_listeners[addr]) {
                if (cb) cb(val, addr, oldVal);
            }
        }
    }

    std::array<double, TITAN_MEMORY_BANK_SIZE> m_memoryBank;
    std::array<std::vector<RegisterCallback>, TITAN_MEMORY_BANK_SIZE> m_listeners;
    std::vector<BatchItem> m_batchQueue;
    bool m_isBatching = false;
};

// ── 4. EVENT STRUCTS & ENGINE ─────────────────────────────────────────────────
struct TitanPointerEvent {
    double clientX = 0;
    double clientY = 0;
    double deltaX = 0;
    double deltaY = 0;
    uint8_t buttonMask = 0;
    uint8_t modifierMask = 0;
    SurfaceTarget surface = SurfaceTarget::UNKNOWN;
    DragMode dragMode = DragMode::IDLE;
};

struct TitanWheelEvent {
    double delta = 0;
    uint8_t modifierMask = 0;
};

struct TitanKeyEvent {
    uint32_t keyCode = 0;
    uint8_t hotkeyCode = 0;
    uint8_t modifierMask = 0;
};

struct TitanChangeEvent {
    uint16_t targetReg = 0;
    double value = 0;
    uint8_t eventType = 0; // 1=Change, 2=Input
};

class TitanEventEngine {
public:
    explicit TitanEventEngine(TitanMicroBus& bus) : m_bus(bus) {}

    // Pointer Down (Click / Drag Start)
    void dispatchPointerDown(const TitanPointerEvent& evt) {
        m_isDragging = true;
        m_startX = evt.clientX;
        m_startY = evt.clientY;
        m_curX = evt.clientX;
        m_curY = evt.clientY;
        m_activeDragMode = evt.dragMode;

        m_bus.startBatch();
        m_bus.write(TitanReg::MOUSE_POS_X, evt.clientX);
        m_bus.write(TitanReg::MOUSE_POS_Y, evt.clientY);
        m_bus.write(TitanReg::MOUSE_DELTA_X, 0.0);
        m_bus.write(TitanReg::MOUSE_DELTA_Y, 0.0);
        m_bus.write(TitanReg::MOUSE_BUTTONS_MASK, evt.buttonMask);
        m_bus.write(TitanReg::MODIFIER_KEYS_MASK, evt.modifierMask);
        m_bus.write(TitanReg::ACTIVE_SURFACE, static_cast<double>(evt.surface));
        m_bus.write(TitanReg::ACTIVE_DRAG_MODE, static_cast<double>(evt.dragMode));
        m_bus.flushBatch();
    }

    // Pointer Move (Scrub, Drag, Draw, Transform)
    void dispatchPointerMove(double clientX, double clientY, uint8_t modifierMask) {
        double dx = clientX - m_curX;
        double dy = clientY - m_curY;
        m_curX = clientX;
        m_curY = clientY;

        m_bus.startBatch();
        m_bus.write(TitanReg::MOUSE_POS_X, clientX);
        m_bus.write(TitanReg::MOUSE_POS_Y, clientY);
        m_bus.write(TitanReg::MOUSE_DELTA_X, dx);
        m_bus.write(TitanReg::MOUSE_DELTA_Y, dy);
        m_bus.write(TitanReg::MODIFIER_KEYS_MASK, modifierMask);
        m_bus.flushBatch();
    }

    // Pointer Up
    void dispatchPointerUp() {
        m_isDragging = false;
        m_activeDragMode = DragMode::IDLE;

        m_bus.startBatch();
        m_bus.write(TitanReg::MOUSE_BUTTONS_MASK, 0.0);
        m_bus.write(TitanReg::ACTIVE_DRAG_MODE, 0.0);
        m_bus.flushBatch();
    }

    // Wheel
    void dispatchWheel(double delta, uint8_t modifierMask) {
        m_bus.startBatch();
        m_bus.write(TitanReg::MOUSE_WHEEL_DELTA, delta);
        m_bus.write(TitanReg::MODIFIER_KEYS_MASK, modifierMask);
        m_bus.flushBatch();
    }

    // Keyboard Hotkey
    void dispatchKey(uint32_t keyCode, uint8_t hotkeyCode, uint8_t modifierMask) {
        m_bus.startBatch();
        m_bus.write(TitanReg::KEYBOARD_LAST_KEY, static_cast<double>(keyCode));
        m_bus.write(TitanReg::KEYBOARD_HOTKEY_CODE, static_cast<double>(hotkeyCode));
        m_bus.write(TitanReg::MODIFIER_KEYS_MASK, static_cast<double>(modifierMask));
        m_bus.flushBatch();

        if (hotkeyCode >= 1 && hotkeyCode <= 5) {
            setTool(static_cast<ToolMode>(hotkeyCode == 1 ? 1 : (hotkeyCode == 2 ? 4 : (hotkeyCode == 3 ? 7 : (hotkeyCode == 4 ? 5 : 6)))));
        }
    }

    // Input & Change Events (Sliders, Color, Inputs)
    void dispatchChange(uint16_t targetReg, double value, uint8_t eventType) {
        m_bus.startBatch();
        m_bus.write(TitanReg::FORM_INPUT_REG_TARGET, targetReg);
        m_bus.write(TitanReg::FORM_INPUT_RAW_VAL, value);
        m_bus.write(TitanReg::FORM_EVENT_TRIGGER, eventType);
        m_bus.write(targetReg, value);
        m_bus.flushBatch();
    }

    void setTool(ToolMode tool) {
        m_currentTool = tool;
        m_bus.write(TitanReg::ACTIVE_TOOL, static_cast<double>(tool));
    }

    ToolMode getTool() const { return m_currentTool; }
    bool isDragging() const { return m_isDragging; }
    DragMode getDragMode() const { return m_activeDragMode; }

private:
    TitanMicroBus& m_bus;
    ToolMode m_currentTool = ToolMode::SELECT;
    bool m_isDragging = false;
    double m_startX = 0;
    double m_startY = 0;
    double m_curX = 0;
    double m_curY = 0;
    DragMode m_activeDragMode = DragMode::IDLE;
};

} // namespace danphe::titan

#endif // DANPHE_TITAN_EVENT_ENGINE_HPP
