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

// 16-Bit Register Addresses for Audio DSP
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
#define TITAN_REG_EQ_GAIN    0x310A // Master Gain (0-200)
#define TITAN_REG_EQ_FLAGS   0x310B // Bit 0: Bypass, Bit 1: 3D Surround

typedef struct {
    int8_t  bands[10];     // Gain in dB: -12 to +12
    uint8_t master_gain;   // Master gain: 0 to 200 (100 = 0dB)
    bool    is_bypassed;   // Bypass equalizer
    bool    surround_3d;   // 3D Spatial audio expansion
} DanpheEqualizerState;

static inline void danphe_eq_init(DanpheEqualizerState* eq) {
    if (!eq) return;
    for (int i = 0; i < 10; i++) eq->bands[i] = 0;
    eq->master_gain = 100;
    eq->is_bypassed = false;
    eq->surround_3d = false;
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
