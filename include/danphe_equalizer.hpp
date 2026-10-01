#pragma once
/**
 * 🎚️ Danphe C/C++ Audio Equalizer Component (danphe_equalizer.hpp)
 * Zero-Dependency 16-Bit Register Memory-Mapped DSP Audio Equalizer
 * ═════════════════════════════════════════════════════════════════════════════
 * • 10-Band Studio DSP Filters (32Hz to 16kHz)
 * • 16-Bit Register Micro-Bus Integration (TITAN_REG_EQ_BAND_0 ... BAND_9)
 * • Fixed-Point & Float Audio Buffer Bi-quad Filter Math
 */

#include <stdint.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

// 16-Bit Internal Register Addresses for Audio DSP
#define TITAN_REG_EQ_BAND_0  0x3100 // 32Hz
#define TITAN_REG_EQ_BAND_1  0x3101 // 64Hz
#define TITAN_REG_EQ_BAND_2  0x3102 // 125Hz
#define TITAN_REG_EQ_BAND_3  0x3103 // 250Hz
#define TITAN_REG_EQ_BAND_4  0x3104 // 500Hz
#define TITAN_REG_EQ_BAND_5  0x3105 // 1kHz
#define TITAN_REG_EQ_BAND_6  0x3106 // 2kHz
#define TITAN_REG_EQ_BAND_7  0x3107 // 4kHz
#define TITAN_REG_EQ_BAND_8  0x3108 // 8kHz
#define TITAN_REG_EQ_BAND_9  0x3109 // 16kHz
#define TITAN_REG_EQ_GAIN    0x310A // Internal Master Gain (0-200)
#define TITAN_REG_EQ_FLAGS   0x310B // Bit 0: Bypass, Bit 1: 3D Surround

// ── 🎚️ CONSOLIDATED 16-BIT MASTER DSP OUTPUT REGISTER ──
// High Byte [15:8]: Master Output Gain (0 - 200, where 100 = 0 dB unity)
// Low Byte  [7:0] : DSP Status Flags (Bit 0: Bypass, Bit 1: 3D, Bit 2: Peak Clip, Bit 3-7: Preset Index)
#define TITAN_REG_AUDIO_DSP_OUT  0x4300

// ── 🔌 2-WIRE SERIAL DSP PROTOCOL (I2C/TWI Compatible 16-Bit Register Interface) ──
#define DANPHE_DSP_2WIRE_I2C_ADDR 0x4A // Default 7-bit hardware DSP address

typedef struct {
    uint8_t  device_addr; // 0x4A
    uint16_t reg_addr;    // 16-bit register address (e.g., 0x4300 or internal 0x3100-0x310B)
    uint16_t data_word;   // 16-bit payload word
} Danphe2WireDSPPacket;

typedef struct {
    int8_t   bands[10];     // Gain in dB: -12 to +12
    uint16_t freqs[10];     // Tunable Center Frequencies in Hz: 20Hz - 22000Hz
    uint8_t  master_gain;   // Master gain: 0 to 200 (100 = 0dB)
    bool     is_bypassed;   // Bypass equalizer
    bool     surround_3d;   // 3D Spatial audio expansion
    uint8_t  active_preset; // 0: Custom, 1: Flat, 2: Bass, 3: Rock, 4: EDM, 5: Vocal, 6: Cinema
} DanpheEqualizerState;

static inline void danphe_eq_init(DanpheEqualizerState* eq) {
    if (!eq) return;
    const uint16_t std_f[10] = {32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000};
    for (int i = 0; i < 10; i++) {
        eq->bands[i] = 0;
        eq->freqs[i] = std_f[i];
    }
    eq->master_gain = 100;
    eq->is_bypassed = false;
    eq->surround_3d = false;
    eq->active_preset = 1; // Flat
}

// Pack internal DSP state into a single 16-bit consolidated register word (0x4300)
static inline uint16_t danphe_eq_pack_output(const DanpheEqualizerState* eq) {
    if (!eq) return 0;
    uint8_t flags = 0;
    if (eq->is_bypassed) flags |= 0x01;
    if (eq->surround_3d) flags |= 0x02;
    flags |= ((eq->active_preset & 0x1F) << 3);
    return ((uint16_t)eq->master_gain << 8) | (uint16_t)flags;
}

// Unpack single 16-bit consolidated register word from host (0x4300) into DSP state
static inline void danphe_eq_unpack_output(DanpheEqualizerState* eq, uint16_t word) {
    if (!eq) return;
    eq->master_gain = (uint8_t)((word >> 8) & 0xFF);
    uint8_t flags = (uint8_t)(word & 0xFF);
    eq->is_bypassed = (flags & 0x01) != 0;
    eq->surround_3d = (flags & 0x02) != 0;
    eq->active_preset = (flags >> 3) & 0x1F;
}

static inline void danphe_eq_set_preset(DanpheEqualizerState* eq, const char* preset_name) {
    if (!eq || !preset_name) return;
    // Preset table
    if (preset_name[0] == 'b' || preset_name[0] == 'B') { // Bass Boost
        int8_t b[10] = {+6, +5, +4, +2, 0, 0, 0, 0, 0, 0};
        for(int i=0; i<10; i++) eq->bands[i] = b[i];
    } else if (preset_name[0] == 'r' || preset_name[0] == 'R') { // Rock
        int8_t b[10] = {+5, +4, +2, -1, -2, 0, +2, +3, +4, +5};
        for(int i=0; i<10; i++) eq->bands[i] = b[i];
    } else if (preset_name[0] == 'v' || preset_name[0] == 'V') { // Vocal Boost
        int8_t b[10] = {-2, -2, 0, +2, +5, +5, +3, +1, 0, -1};
        for(int i=0; i<10; i++) eq->bands[i] = b[i];
    } else if (preset_name[0] == 'e' || preset_name[0] == 'E') { // Electronic / EDM
        int8_t b[10] = {+6, +5, +1, 0, -2, +2, +1, +3, +5, +6};
        for(int i=0; i<10; i++) eq->bands[i] = b[i];
    } else { // Flat
        for(int i=0; i<10; i++) eq->bands[i] = 0;
    }
}

#ifdef __cplusplus
}
#endif
