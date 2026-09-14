/**
 * ⚡ DANPHE-UI NATIVE C++ ANIMATION & KEYFRAME EASING ENGINE
 * ═════════════════════════════════════════════════════════════════════════════
 * High-Speed Zero-Heap Parametric Keyframe Interpolation & Motion Curves.
 * Supports Bezier Math, Elastic/Bounce Physics, and 16-Bit Register Highway.
 *
 * Author: Phuyalshankar (Nepal) 🇳🇵 | Architecture: C++17 / Dolphin Native
 */

#ifndef DANPHE_ANIMATION_HPP
#define DANPHE_ANIMATION_HPP

#include <iostream>
#include <string>
#include <vector>
#include <cmath>
#include <algorithm>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

namespace DanpheUI {

// 16-Bit Register Addresses for Animation Engine (Bank 0x43)
#define TITAN_REG_ANIM_OPCODE     0x4300 // 0=None, 1=ZoomPop, 2=NeonGlow, 3=SlideIn, 4=Bounce, 5=Shake
#define TITAN_REG_ANIM_EASING     0x4301 // 0=Linear, 1=EaseIn, 2=EaseOut, 3=EaseInOut, 4=Elastic, 5=Bounce
#define TITAN_REG_ANIM_DURATION   0x4302 // Duration in 10ms units (e.g. 100 = 1.0 sec)
#define TITAN_REG_ANIM_INTENSITY  0x4303 // 0 - 255 (Scale / Power factor)

enum class EasingType {
    Linear = 0,
    EaseInQuad = 1,
    EaseOutQuad = 2,
    EaseInOutQuad = 3,
    EaseInCubic = 4,
    EaseOutCubic = 5,
    EaseInOutCubic = 6,
    EaseInElastic = 7,
    EaseOutElastic = 8,
    EaseInBounce = 9,
    EaseOutBounce = 10
};

struct KeyframePoint {
    double timeSec;
    double value;
    EasingType easing;
};

class DanpheAnimationEngine {
public:
    // ── 1. MATHEMATICAL EASING CURVES (Normalized 0.0 -> 1.0) ──
    static inline double evaluateEasing(double t, EasingType type) {
        t = std::max(0.0, std::min(1.0, t));
        switch (type) {
            case EasingType::Linear:
                return t;
            case EasingType::EaseInQuad:
                return t * t;
            case EasingType::EaseOutQuad:
                return t * (2.0 - t);
            case EasingType::EaseInOutQuad:
                return t < 0.5 ? 2.0 * t * t : -1.0 + (4.0 - 2.0 * t) * t;
            case EasingType::EaseInCubic:
                return t * t * t;
            case EasingType::EaseOutCubic: {
                double f = t - 1.0;
                return f * f * f + 1.0;
            }
            case EasingType::EaseInOutCubic:
                return t < 0.5 ? 4.0 * t * t * t : (t - 1.0) * (2.0 * t - 2.0) * (2.0 * t - 2.0) + 1.0;
            case EasingType::EaseOutElastic: {
                if (t == 0.0) return 0.0;
                if (t == 1.0) return 1.0;
                double p = 0.3;
                return std::pow(2.0, -10.0 * t) * std::sin((t - p / 4.0) * (2.0 * M_PI) / p) + 1.0;
            }
            case EasingType::EaseOutBounce: {
                if (t < (1.0 / 2.75)) {
                    return 7.5625 * t * t;
                } else if (t < (2.0 / 2.75)) {
                    t -= (1.5 / 2.75);
                    return 7.5625 * t * t + 0.75;
                } else if (t < (2.5 / 2.75)) {
                    t -= (2.25 / 2.75);
                    return 7.5625 * t * t + 0.9375;
                } else {
                    t -= (2.625 / 2.75);
                    return 7.5625 * t * t + 0.984375;
                }
            }
            default:
                return t;
        }
    }

    // ── 2. PRESET CINEMATIC MOTION GENERATORS ──
    // Zoom Pop Intro: Over-shoots scale and snaps with elastic bounce
    static inline double evalZoomPop(double t, double startScale = 0.0, double endScale = 100.0) {
        double ease = evaluateEasing(t, EasingType::EaseOutElastic);
        return startScale + (endScale - startScale) * ease;
    }

    // Neon Glow Pulse: Oscillates intensity smoothly with sine wave
    static inline double evalNeonPulse(double timeSec, double freqHz = 2.0) {
        return 0.5 + 0.5 * std::sin(2.0 * M_PI * freqHz * timeSec);
    }

    // Slide In Left: Smooth cubic entrance
    static inline double evalSlideIn(double t, double startX = -1920.0, double endX = 0.0) {
        double ease = evaluateEasing(t, EasingType::EaseOutCubic);
        return startX + (endX - startX) * ease;
    }

    // Drop & Bounce: Gravity drop simulation
    static inline double evalDropBounce(double t, double startY = -1080.0, double endY = 0.0) {
        double ease = evaluateEasing(t, EasingType::EaseOutBounce);
        return startY + (endY - startY) * ease;
    }

    // ── 3. KEYFRAME TRACK INTERPOLATOR ──
    static inline double interpolateKeyframes(const std::vector<KeyframePoint>& kfs, double curTime) {
        if (kfs.empty()) return 0.0;
        if (kfs.size() == 1 || curTime <= kfs.front().timeSec) return kfs.front().value;
        if (curTime >= kfs.back().timeSec) return kfs.back().value;

        for (size_t i = 0; i < kfs.size() - 1; ++i) {
            if (curTime >= kfs[i].timeSec && curTime <= kfs[i + 1].timeSec) {
                double segDur = kfs[i + 1].timeSec - kfs[i].timeSec;
                if (segDur <= 0.0001) return kfs[i].value;
                double t = (curTime - kfs[i].timeSec) / segDur;
                double factor = evaluateEasing(t, kfs[i].easing);
                return kfs[i].value + (kfs[i + 1].value - kfs[i].value) * factor;
            }
        }
        return kfs.back().value;
    }
};

} // namespace DanpheUI

#endif // DANPHE_ANIMATION_HPP
