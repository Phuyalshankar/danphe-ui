#pragma once

/**
 * 🐬 TITAN CARD MODULAR HARDWARE PCB (C++20 / C++17 Header-Only Architecture)
 * Plug-and-Play Bi-Directional Signal Bus & Memory-Mapped Register Bank
 * 
 * Packaging:
 * - Left Panel (Media / Overlay / Tracking / Lens)
 * - Right Panel (Animation / Transform / Color / Typo / VFX / Thumbnail)
 * - Input Signal Lines: Mouse Drag, Wheel Zoom, Touch Pinch, Tool Select, Keyboard IRQ
 * - Output Signal Lines: 120 FPS Matrix Telemetry, Layer Packet, CLI Command TX
 */

#include <cstdint>
#include <cstring>
#include <string>
#include <vector>
#include <functional>
#include <unordered_map>
#include <array>
#include <sstream>
#include <iomanip>

namespace TitanPCB {

// ── 1. TITAN 16-BIT MEMORY-MAPPED REGISTERS ──
enum RegisterAddress : uint16_t {
    // System Status & Mode (0x4000 - 0x40FF)
    REG_SYS_STATUS       = 0x4000,
    REG_SYS_ACTIVE_CARD  = 0x4001,
    REG_SYS_ACTIVE_TOOL  = 0x4002,
    REG_SYS_TIME_SEC_MSB = 0x4003,
    REG_SYS_TIME_SEC_LSB = 0x4004,

    // Video Transform & Motion Matrix (0x4100 - 0x410F)
    REG_VIDEO_SCALE      = 0x4100, // 10% - 400%
    REG_VIDEO_ROTATION   = 0x4101, // 0 - 360 deg
    REG_VIDEO_POS_X      = 0x4102, // Signed 16-bit offset
    REG_VIDEO_POS_Y      = 0x4103, // Signed 16-bit offset
    REG_VIDEO_OPACITY    = 0x4104, // 0 - 100%
    REG_VIDEO_SPEED      = 0x4105, // Fixed point 100 = 1.0x
    REG_VIDEO_ANCHOR     = 0x4106, // 0-8 Grid (TL..BR)

    // Color Grading & Exposure (0x4110 - 0x411F)
    REG_COLOR_HUE        = 0x4110, // 0x00 - 0xFF (256 Hues)
    REG_COLOR_TEMP       = 0x4111, // 0-100 (Cool to Warm)
    REG_COLOR_SATURATION = 0x4112, // 0-100%
    REG_COLOR_BRIGHTNESS = 0x4113, // 0-100%
    REG_COLOR_MODE       = 0x4114, // 0: Solid, 1: Grad, 2: Rainbow

    // Superpower VFX & Aura Shaders (0x4120 - 0x412F)
    REG_VFX_OPCODE       = 0x4120, // 0x00 - 0xFF (256 VFX)
    REG_VFX_STROKE_WIDTH = 0x4121, // 1 - 64 px
    REG_VFX_INTENSITY    = 0x4122, // 0 - 100%
    REG_VFX_TURBULENCE   = 0x4123, // 0 - 100

    // Typography & Subtitles (0x4130 - 0x413F)
    REG_TYPO_FONT_OPCODE = 0x4130, // 0x00 - 0xFF (256 Fonts)
    REG_TYPO_FONT_SIZE   = 0x4131, // 12 - 144 px
    REG_TYPO_STROKE_W    = 0x4132, // 0 - 16 px
    REG_TYPO_STROKE_COL  = 0x4133, // 24-bit RGB packed
    REG_TYPO_BG_STYLE    = 0x4134, // 0: None, 1: Obsidian, 2: Red, 3: Gold, 4: Glass
    REG_TYPO_BG_OPACITY  = 0x4135, // 0 - 100%
    REG_TYPO_CURVE_ARC   = 0x4136, // -180 to +180 deg (Half circle)
    REG_TYPO_KARAOKE_EN  = 0x4137, // 0: Off, 1: Active Word Glow
    REG_TYPO_GRADIENT_EN = 0x4138, // 0: Solid, 1: Sunset, 2: Cyber, 3: Chrome, 4: Emerald

    // Media, Overlay & AI Head Swap (0x4140 - 0x414F)
    REG_OVERLAY_ACTIVE   = 0x4140, // 0: Inactive, 1: Active
    REG_OVERLAY_RATIO    = 0x4141, // 0: 16:9, 1: 9:16, 2: 1:1, 3: 4:5
    REG_OVERLAY_ANCHOR   = 0x4142, // 0: TL, 1: TR, 2: BL, 3: BR, 4: CC
    REG_HEAD_SWAP_AVATAR = 0x4143, // 0: Cyborg, 1: Lion, 2: Crown, 3: Shades, 4: Cartoon, 5: Alien
    REG_HEAD_WALK_BOB    = 0x4144, // 0 - 100%
    REG_HEAD_NECK_PIVOT  = 0x4145, // 50 - 120%

    // YouTube Thumbnail Studio (0x4150 - 0x415F)
    REG_THUMB_AI_CUTOUT  = 0x4150, // 0: Off, 1: On
    REG_THUMB_STROKE_W   = 0x4151, // 0 - 24 px
    REG_THUMB_STROKE_COL = 0x4152, // RGB Packed
    REG_THUMB_GLOW_INT   = 0x4153, // 0 - 100%
    REG_THUMB_HDR_POP    = 0x4154, // 0 - 100%
    REG_THUMB_BG_BLUR    = 0x4155, // 0 - 30 px Bokeh

    // Drawing & Filmstrip (0x4160 - 0x416F)
    REG_DRAW_ACTIVE_TOOL = 0x4160, // Tool ID Opcode
    REG_DRAW_STROKE_W    = 0x4161, // 1 - 32 px
    REG_DRAW_COLOR       = 0x4162  // RGB Packed
};

// ── 2. INPUT SIGNAL PACKET (MOUSE, TOUCH, KEYBOARD, TOOL, CLIPBOARD, DRAW) ──
enum class InputSignalType : uint8_t {
    MOUSE_DOWN          = 0x01,
    MOUSE_MOVE          = 0x02,
    MOUSE_UP            = 0x03,
    DRAG_DELTA          = 0x04,
    WHEEL_ZOOM          = 0x05,
    TOUCH_PINCH         = 0x06,
    TOOL_SELECT         = 0x07,
    CARD_SWITCH         = 0x08,
    KEY_IRQ             = 0x09,
    CLIPBOARD_COPY      = 0x0A,
    CLIPBOARD_PASTE     = 0x0B,
    CLIPBOARD_DUPLICATE = 0x0C,
    FILE_DROP           = 0x0D,
    DRAW_STROKE_POINT   = 0x0E,
    DRAW_STROKE_COMMIT  = 0x0F
};

struct InputSignalPacket {
    InputSignalType type;
    int16_t x{0};
    int16_t y{0};
    int16_t deltaX{0};
    int16_t deltaY{0};
    float zoomFactor{1.0f};
    uint16_t toolId{0};
    uint8_t cardId{0};
    uint8_t subTabId{0};
    uint32_t keyCode{0};
    bool isCtrl{false};
    bool isShift{false};
    bool isAlt{false};
};

// ── 3. OUTPUT TELEMETRY FRAME PACKET ──
struct OutputFramePacket {
    uint32_t frameId{0};
    double timeSec{0.0};
    
    // Transform Matrix
    float matrix[6]{1.0f, 0.0f, 0.0f, 1.0f, 0.0f, 0.0f}; // 2D Affine: a, b, c, d, tx, ty
    float opacity{1.0f};
    
    // Active VFX & Colors
    uint8_t vfxOpcode{0};
    uint8_t hueOpcode{0};
    
    // Active Text & Subtitle
    uint8_t fontOpcode{32};
    uint16_t fontSize{28};
    int16_t curveArcDeg{0};
    bool isKaraokeActive{false};
    
    // Overlay & Head Swap
    bool isOverlayActive{false};
    uint8_t headAvatarId{0};
    float walkingBobSync{1.0f};
    
    // Thumbnail Studio
    bool isAiCutoutActive{false};
    uint8_t creatorStrokeWidth{8};
    uint8_t bgBokehBlur{12};
    
    // CLI Telemetry Line
    char cliCommandTx[256]{0};
};

// ── 4. MASTER PLUG-AND-PLAY TITAN CARD PCB CLASS ──
class TitanCardPCB {
public:
    using OutputCallback = std::function<void(const OutputFramePacket&)>;
    using RegisterChangeCallback = std::function<void(uint16_t reg, uint32_t value)>;

    TitanCardPCB() {
        resetDefaultRegisters();
    }

    void resetDefaultRegisters() {
        std::memset(m_registers.data(), 0, m_registers.size() * sizeof(uint32_t));
        writeRegister(REG_SYS_STATUS, 0x0001); // Ready
        writeRegister(REG_VIDEO_SCALE, 100);
        writeRegister(REG_VIDEO_OPACITY, 100);
        writeRegister(REG_VIDEO_SPEED, 100);
        writeRegister(REG_COLOR_HUE, 0x10);
        writeRegister(REG_TYPO_FONT_OPCODE, 32); // Sagarmatha Display
        writeRegister(REG_TYPO_FONT_SIZE, 28);
        writeRegister(REG_TYPO_STROKE_W, 3);
        writeRegister(REG_TYPO_BG_OPACITY, 80);
        writeRegister(REG_HEAD_WALK_BOB, 100);
        writeRegister(REG_HEAD_NECK_PIVOT, 90);
        writeRegister(REG_THUMB_STROKE_W, 8);
        writeRegister(REG_THUMB_GLOW_INT, 80);
        writeRegister(REG_THUMB_BG_BLUR, 12);
    }

    // Direct Register Read / Write
    inline void writeRegister(uint16_t address, uint32_t value) {
        uint16_t offset = address & 0x0FFF;
        if (offset < m_registers.size()) {
            m_registers[offset] = value;
            if (m_regCallback) {
                m_regCallback(address, value);
            }
        }
    }

    inline uint32_t readRegister(uint16_t address) const {
        uint16_t offset = address & 0x0FFF;
        return (offset < m_registers.size()) ? m_registers[offset] : 0;
    }

    // Ingest Input Signal Line (Mouse, Drag, Zoom, Tool Select, IRQ)
    void processInputSignal(const InputSignalPacket& signal) {
        m_lastSignal = signal;

        switch (signal.type) {
            case InputSignalType::DRAG_DELTA: {
                int32_t posX = static_cast<int32_t>(readRegister(REG_VIDEO_POS_X)) + signal.deltaX;
                int32_t posY = static_cast<int32_t>(readRegister(REG_VIDEO_POS_Y)) + signal.deltaY;
                writeRegister(REG_VIDEO_POS_X, static_cast<uint32_t>(posX));
                writeRegister(REG_VIDEO_POS_Y, static_cast<uint32_t>(posY));
                break;
            }

            case InputSignalType::WHEEL_ZOOM: {
                int32_t curScale = static_cast<int32_t>(readRegister(REG_VIDEO_SCALE));
                int32_t nextScale = static_cast<int32_t>(curScale * signal.zoomFactor);
                if (nextScale < 10) nextScale = 10;
                if (nextScale > 400) nextScale = 400;
                writeRegister(REG_VIDEO_SCALE, static_cast<uint32_t>(nextScale));
                break;
            }

            case InputSignalType::TOOL_SELECT: {
                writeRegister(REG_SYS_ACTIVE_TOOL, signal.toolId);
                writeRegister(REG_DRAW_ACTIVE_TOOL, signal.toolId);
                break;
            }

            case InputSignalType::CARD_SWITCH: {
                writeRegister(REG_SYS_ACTIVE_CARD, signal.cardId);
                break;
            }

            default:
                break;
        }

        emitOutputFrame();
    }

    // Generate 120 FPS Output Frame Packet
    OutputFramePacket generateOutputPacket(double timeSec = 0.0) {
        OutputFramePacket pkt;
        pkt.frameId = ++m_frameCounter;
        pkt.timeSec = timeSec;

        float scale = readRegister(REG_VIDEO_SCALE) / 100.0f;
        float rotRad = (readRegister(REG_VIDEO_ROTATION) * 3.14159265f) / 180.0f;
        float posX = static_cast<float>(static_cast<int32_t>(readRegister(REG_VIDEO_POS_X)));
        float posY = static_cast<float>(static_cast<int32_t>(readRegister(REG_VIDEO_POS_Y)));

        // Compute 2D Affine Matrix
        pkt.matrix[0] = scale * std::cos(rotRad);
        pkt.matrix[1] = scale * std::sin(rotRad);
        pkt.matrix[2] = -scale * std::sin(rotRad);
        pkt.matrix[3] = scale * std::cos(rotRad);
        pkt.matrix[4] = posX;
        pkt.matrix[5] = posY;
        pkt.opacity = readRegister(REG_VIDEO_OPACITY) / 100.0f;

        pkt.vfxOpcode = static_cast<uint8_t>(readRegister(REG_VFX_OPCODE));
        pkt.hueOpcode = static_cast<uint8_t>(readRegister(REG_COLOR_HUE));
        pkt.fontOpcode = static_cast<uint8_t>(readRegister(REG_TYPO_FONT_OPCODE));
        pkt.fontSize = static_cast<uint16_t>(readRegister(REG_TYPO_FONT_SIZE));
        pkt.curveArcDeg = static_cast<int16_t>(static_cast<int32_t>(readRegister(REG_TYPO_CURVE_ARC)));
        pkt.isKaraokeActive = (readRegister(REG_TYPO_KARAOKE_EN) != 0);

        pkt.isOverlayActive = (readRegister(REG_OVERLAY_ACTIVE) != 0);
        pkt.headAvatarId = static_cast<uint8_t>(readRegister(REG_HEAD_SWAP_AVATAR));
        pkt.walkingBobSync = readRegister(REG_HEAD_WALK_BOB) / 100.0f;

        pkt.isAiCutoutActive = (readRegister(REG_THUMB_AI_CUTOUT) != 0);
        pkt.creatorStrokeWidth = static_cast<uint8_t>(readRegister(REG_THUMB_STROKE_W));
        pkt.bgBokehBlur = static_cast<uint8_t>(readRegister(REG_THUMB_BG_BLUR));

        // Format CLI Telemetry String
        std::snprintf(pkt.cliCommandTx, sizeof(pkt.cliCommandTx),
            "[TITAN_PCB_TX] FRM:%u TIME:%.3fs SCALE:%.2f ROT:%u POS:(%.1f,%.1f) TOOL:0x%04X FONT:0x%02X",
            pkt.frameId, pkt.timeSec, scale, readRegister(REG_VIDEO_ROTATION), posX, posY,
            readRegister(REG_SYS_ACTIVE_TOOL), pkt.fontOpcode);

        return pkt;
    }

    void setOutputCallback(OutputCallback cb) { m_outCallback = cb; }
    void setRegisterChangeCallback(RegisterChangeCallback cb) { m_regCallback = cb; }

private:
    void emitOutputFrame() {
        if (m_outCallback) {
            m_outCallback(generateOutputPacket());
        }
    }

    std::array<uint32_t, 4096> m_registers; // 4K 32-bit Memory-Mapped Register Space
    uint32_t m_frameCounter{0};
    InputSignalPacket m_lastSignal{};
    OutputCallback m_outCallback{nullptr};
    RegisterChangeCallback m_regCallback{nullptr};
};

} // namespace TitanPCB
