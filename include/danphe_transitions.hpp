/**
 * 🎬 DANPHE-UI NATIVE C++ VIDEO TRANSITIONS ENGINE
 * ═════════════════════════════════════════════════════════════════════════════
 * High-Speed Zero-Heap GLSL & Pixel Blending Transition Algorithms.
 * Supports Cross-Dissolve, Dip to Black, Wipes, Iris, and Glitch Cuts.
 *
 * Author: Phuyalshankar (Nepal) 🇳🇵 | Architecture: C++17 / Dolphin Native
 */

#ifndef DANPHE_TRANSITIONS_HPP
#define DANPHE_TRANSITIONS_HPP

#include <iostream>
#include <string>
#include <vector>
#include <cmath>
#include <algorithm>

namespace DanpheUI {

// 16-Bit Register Addresses for Video Transitions (Bank 0x45)
#define TITAN_REG_TRANS_TYPE      0x4500 // 0=None, 1=CrossDissolve, 2=DipToBlack, 3=DipToWhite, 4=WipeRight, 5=IrisCircle, 6=Glitch
#define TITAN_REG_TRANS_DURATION  0x4501 // Duration in 10ms units (e.g. 50 = 0.5s, 100 = 1.0s)
#define TITAN_REG_TRANS_FEATHER   0x4502 // Edge feathering (0 - 100%)

enum class TransitionType {
    None = 0,
    CrossDissolve = 1,
    DipToBlack = 2,
    DipToWhite = 3,
    WipeRight = 4,
    WipeLeft = 5,
    WipeUp = 6,
    WipeDown = 7,
    IrisCircle = 8,
    GlitchFlash = 9
};

struct TransitionState {
    TransitionType type;
    double durationSec;
    double feather;
};

class DanpheTransitionEngine {
public:
    // ── 1. CROSS DISSOLVE (Linear & Cosine Blended Alpha) ──
    static inline void evalCrossDissolve(double progress, double& alphaA, double& alphaB) {
        progress = std::max(0.0, std::min(1.0, progress));
        alphaA = 1.0 - progress;
        alphaB = progress;
    }

    // ── 2. DIP TO BLACK / DIP TO WHITE ──
    static inline void evalDipToColor(double progress, double& alphaClip, double& alphaSolid) {
        progress = std::max(0.0, std::min(1.0, progress));
        if (progress < 0.5) {
            // First half: Fade out current clip into solid color
            alphaClip = 1.0 - (progress * 2.0);
            alphaSolid = progress * 2.0;
        } else {
            // Second half: Fade in incoming clip from solid color
            alphaClip = (progress - 0.5) * 2.0;
            alphaSolid = 1.0 - ((progress - 0.5) * 2.0);
        }
    }

    // ── 3. LINEAR DIRECTIONAL WIPES (With Edge Feathering) ──
    // Returns mask threshold (0.0 to 1.0) for pixel coordinates (u, v)
    static inline double evalLinearWipe(double u, double progress, double feather = 0.05) {
        progress = std::max(0.0, std::min(1.0, progress));
        if (feather <= 0.001) {
            return u <= progress ? 1.0 : 0.0;
        }
        double edgeStart = progress - feather;
        double edgeEnd = progress + feather;
        if (u <= edgeStart) return 1.0;
        if (u >= edgeEnd) return 0.0;
        return 1.0 - ((u - edgeStart) / (edgeEnd - edgeStart));
    }

    // ── 4. RADIAL IRIS CIRCLE TRANSITION ──
    static inline double evalIrisCircle(double u, double v, double progress, double aspectRatio = 16.0 / 9.0) {
        progress = std::max(0.0, std::min(1.0, progress));
        double dx = (u - 0.5) * aspectRatio;
        double dy = v - 0.5;
        double dist = std::sqrt(dx * dx + dy * dy);
        double maxRadius = std::sqrt(aspectRatio * aspectRatio * 0.25 + 0.25);
        double curRadius = progress * maxRadius;
        return dist <= curRadius ? 1.0 : 0.0;
    }

    // ── 5. GLITCH RGB CHROMATIC FLASH ──
    static inline void evalGlitch(double progress, double& rgbOffset, double& flashIntensity) {
        progress = std::max(0.0, std::min(1.0, progress));
        // Peak glitch intensity right in the middle (at 0.5 progress)
        double peak = 1.0 - std::abs(progress - 0.5) * 2.0;
        rgbOffset = peak * 25.0; // Up to 25px chromatic aberration
        flashIntensity = peak * 0.85; // Brightness flash
    }
};

} // namespace DanpheUI

#endif // DANPHE_TRANSITIONS_HPP
