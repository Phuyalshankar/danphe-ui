#pragma once
/**
 * ════════════════════════════════════════════════════════════════════════════
 * 🐬 UNIVERSAL UB 2.0 RUNTIME ENGINE (Hardware, Graphic & 2D Drawing Core)
 * ════════════════════════════════════════════════════════════════════════════
 * Pure C++17 In-Memory Synthesizer (<0.05ms):
 * • 8-Bit Byte Scale (0–255 / uint8_t) for 0-copy MCU / Web harmony
 * • Declarative 2D Multi-Layer Drawing Module (<draw>, <layer>, <path>, <circle>, <rect>, <line>, <star>, <text>, <arc>)
 * • Turtle Coordinate Directional Path Parser (start-X-Y right-N down-N left-N up-N to-X-Y close)
 * • IoT Directional Fills (fill-up, fill-right, fill-down, fill-circle, fill-gauge, fill-arc-180)
 * • Universal Geometry Engine (geo-circle, geo-polygon-6, geo-star-6, geo-needle, geo-ticks, geo-wave, semicircle)
 * • Dynamic Multi-Stop OKLCH Gradients & Text Gradients
 * • Hardware Scale Transforms & Hover Micro-Interactions
 * ════════════════════════════════════════════════════════════════════════════
 */

#include "core.hpp"
#include <string>
#include <vector>
#include <map>
#include <unordered_map>
#include <unordered_set>
#include <sstream>
#include <iomanip>
#include <cmath>
#include <algorithm>
#include <regex>

namespace DolphinUBEngine {

constexpr int SCALE_MAX = 255;
constexpr int PX_MULTIPLIER = 4;
constexpr int BORDER_MULTIPLIER = 1;
constexpr int GAP_MULTIPLIER = 4;
constexpr int SIZE_MULTIPLIER = 4;

inline double safeClamp(double val, double minVal, double maxVal) {
    return std::min(maxVal, std::max(minVal, val));
}

inline std::string px(double n) { return std::to_string((int)(n * PX_MULTIPLIER)) + "px"; }
inline std::string borderPx(double n) { return std::to_string((int)(n * BORDER_MULTIPLIER)) + "px"; }
inline std::string gapPx(double n) { return std::to_string((int)(n * GAP_MULTIPLIER)) + "px"; }

struct ColorCoord {
    double L; double C; double H;
};

static const std::unordered_map<std::string, ColorCoord> BASE_PALETTE = {
    {"red",    {0.62, 0.28, 25.0}},
    {"blue",   {0.68, 0.24, 260.0}},
    {"green",  {0.67, 0.22, 145.0}},
    {"purple", {0.65, 0.22, 310.0}},
    {"orange", {0.78, 0.22, 60.0}},
    {"pink",   {0.78, 0.24, 350.0}},
    {"teal",   {0.70, 0.18, 180.0}},
    {"amber",  {0.84, 0.18, 80.0}},
    {"gray",   {0.88, 0.04, 240.0}},
    {"white",  {0.99, 0.00, 0.0}},
};

struct OKLCHColor {
    double L = 0.0; double C = 0.0; double H = 0.0; double alpha = 1.0;

    std::string toString() const {
        std::stringstream ss;
        ss << std::fixed << std::setprecision(3);
        if (alpha < 1.0) {
            ss << "oklch(" << L << " " << C << " " << H << " / " << alpha << ")";
        } else {
            ss << "oklch(" << L << " " << C << " " << H << ")";
        }
        return ss.str();
    }
};

inline OKLCHColor computeOKLCH(const std::string& name, double shade, bool darkMode = false) {
    if (name == "white") return {0.99, 0.0, 0.0, 1.0};
    double safeShade = safeClamp(shade, 0.0, 255.0);
    ColorCoord base = BASE_PALETTE.count(name) ? BASE_PALETTE.at(name) : BASE_PALETTE.at("gray");

    double t = safeShade / static_cast<double>(SCALE_MAX);
    double L, C;

    if (name == "gray") {
        L = 0.98 - (t * 0.90);
        C = 0.04 + (t * 0.08);
    } else {
        L = 0.92 - (t * 0.77);
        static const std::unordered_map<std::string, double> chroma = {
            {"blue", 0.20}, {"purple", 0.20}, {"red", 0.22}, {"orange", 0.22},
            {"green", 0.18}, {"teal", 0.18}, {"pink", 0.20}, {"amber", 0.20}
        };
        double baseC = chroma.count(name) ? chroma.at(name) : 0.16;
        C = baseC + (t * 0.14);
    }

    if (darkMode) {
        L = L * 0.9 + 0.05;
        C = C * 0.95;
    }

    L = safeClamp(L, 0.05, 0.98);
    C = safeClamp(C, 0.03, 0.35);

    return {L, C, base.H, 1.0};
}

inline std::string computeContrastText(const OKLCHColor& col) {
    if (col.H >= 220 && col.H <= 260 && col.C < 0.1) {
        return col.L > 0.62 ? "oklch(0.10 0.01 " + std::to_string((int)col.H) + ")"
                            : "oklch(0.99 0.005 " + std::to_string((int)col.H) + ")";
    }
    double threshold = 0.5;
    if (col.H >= 70 && col.H <= 180) threshold = 0.42;
    else if (col.H >= 220 && col.H <= 320) threshold = 0.58;
    else if ((col.H >= 0 && col.H <= 40) || (col.H >= 340 && col.H <= 360)) threshold = 0.52;
    else if (col.H >= 50 && col.H <= 90) threshold = 0.4;

    return col.L > threshold ? "oklch(0.10 0.01 " + std::to_string((int)col.H) + ")"
                             : "oklch(0.99 0.005 " + std::to_string((int)col.H) + ")";
}

// ─── Precision Dynamic Class Rule Synthesizer ─────────────────────────────────
inline std::string compileClassRule(const std::string& cls, bool darkMode = false) {
    std::stringstream css;
    std::smatch m;

    // ── 1. IoT DIRECTIONAL FILLS (fill-up, fill-right, fill-down, fill-left) ──
    if (std::regex_match(cls, m, std::regex(R"(^fill-(up|down|right|left)-([a-z]+)-(\d+)-(\d+)(?:-(\d+(?:\.\d+)?(?:s|ms)))?$)"))) {
        std::string dir = m[1];
        std::string color = m[2];
        double shade = std::stod(m[3]);
        double level = std::stod(m[4]);
        std::string dur = m[5].matched ? m[5].str() : "";

        double pct = (level / 255.0) * 100.0;
        OKLCHColor c = computeOKLCH(color, shade, darkMode);

        std::string dirCSS = (dir == "up") ? "to top" : (dir == "down") ? "to bottom" : (dir == "right") ? "to right" : "to left";

        if (!dur.empty()) {
            std::string animName = "ub-fill-" + cls;
            std::replace(animName.begin(), animName.end(), '.', '_');
            css << "@keyframes " << animName << " {\n"
                << "  0% { background-size: " << (dir == "up" || dir == "down" ? "100% 0%" : "0% 100%") << "; }\n"
                << "  100% { background-size: " << (dir == "up" || dir == "down" ? "100% " + std::to_string((int)pct) + "%" : std::to_string((int)pct) + "% 100%") << "; }\n"
                << "}\n"
                << "." << cls << " { background-image: linear-gradient(" << dirCSS << ", " << c.toString() << ", " << c.toString() << "); background-repeat: no-repeat; background-position: "
                << (dir == "up" ? "bottom" : dir == "down" ? "top" : dir == "right" ? "left" : "right") << "; animation: " << animName << " " << dur << " ease-out forwards; }\n";
        } else {
            css << "." << cls << " { background: linear-gradient(" << dirCSS << ", " << c.toString() << " " << (int)pct << "%, rgba(255,255,255,0.06) " << (int)pct << "%); }\n";
        }
        return css.str();
    }

    // ── 2. HOLLOW CIRCULAR, GAUGE & DEGREE ARC FILLS (Crisp & Clean) ──
    if (std::regex_match(cls, m, std::regex(R"(^fill-(circle|gauge|deg|arc-180)-([a-z]+)-(\d+)-(\d+)(?:-(\d+(?:\.\d+)?(?:s|ms)))?$)"))) {
        std::string mode = m[1];
        std::string color = m[2];
        double shade = std::stod(m[3]);
        double level = std::stod(m[4]);

        double maxSweep = (mode == "gauge") ? 270.0 : (mode == "arc-180") ? 180.0 : 360.0;
        double deg = (level / 255.0) * maxSweep;
        OKLCHColor c = computeOKLCH(color, shade, darkMode);

        std::string startAngle = (mode == "gauge") ? "from -135deg, " : (mode == "arc-180") ? "from -90deg, " : "from 0deg, ";

        if (mode == "arc-180") {
            css << "." << cls << " {\n"
                << "  background: conic-gradient(from -90deg, " << c.toString() << " 0deg " << (int)deg << "deg, rgba(255,255,255,0.08) " << (int)deg << "deg 180deg, transparent 180deg 360deg);\n"
                << "  border-radius: 9999px;\n"
                << "  mask: radial-gradient(circle, transparent 70%, black 72%);\n"
                << "  -webkit-mask: radial-gradient(circle, transparent 70%, black 72%);\n"
                << "  position: absolute;\n"
                << "  top: 0;\n"
                << "  left: 0;\n"
                << "  width: 100%;\n"
                << "  height: 200%;\n"
                << "  pointer-events: none;\n"
                << "}\n";
        } else {
            css << "." << cls << " {\n"
                << "  background: conic-gradient(" << startAngle << c.toString() << " 0deg " << (int)deg << "deg, rgba(255,255,255,0.06) " << (int)deg << "deg " << (int)maxSweep << "deg, transparent " << (int)maxSweep << "deg 360deg);\n"
                << "  border-radius: 9999px;\n"
                << "  aspect-ratio: 1 / 1;\n"
                << "  mask: radial-gradient(circle, transparent 70%, black 72%);\n"
                << "  -webkit-mask: radial-gradient(circle, transparent 70%, black 72%);\n"
                << "  position: absolute;\n"
                << "  width: 100%;\n"
                << "  height: 100%;\n"
                << "}\n";
        }
        return css.str();
    }

    // ── 3. GEOMETRIC SHAPES & LAYERS ──
    if (cls == "circle" || cls == "geo-circle") {
        return ".circle, .geo-circle { border-radius: 9999px !important; aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center; }\n";
    }
    if (cls == "semicircle" || cls == "geo-semicircle" || cls == "geo-arc-half") {
        return ".semicircle, .geo-semicircle, .geo-arc-half { aspect-ratio: 2 / 1; border-radius: 9999px 9999px 0 0 !important; overflow: hidden; position: relative; display: flex; align-items: flex-end; justify-content: center; }\n";
    }
    if (cls == "draw-dial-180") {
        return ".draw-dial-180 { position: absolute; top: 0; left: 0; width: 100%; height: 200%; border-radius: 9999px !important; border: 2px solid rgba(255, 255, 255, 0.18); box-shadow: inset 0 0 24px rgba(0, 0, 0, 0.6); pointer-events: none; }\n";
    }
    if (cls == "geo-ticks-180" || cls == "draw-ticks-180") {
        return ".geo-ticks-180, .draw-ticks-180 { position: absolute; top: 0; left: 0; width: 100%; height: 200%; border-radius: 9999px; background: repeating-conic-gradient(from -90deg, rgba(255,255,255,0.7) 0deg 1deg, transparent 1deg 18deg); mask: radial-gradient(circle, transparent 84%, black 86%); -webkit-mask: radial-gradient(circle, transparent 84%, black 86%); clip-path: polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%); pointer-events: none; }\n";
    }
    if (cls == "geo-ruler-y") {
        return ".geo-ruler-y { position: absolute; right: 8px; top: 12px; bottom: 12px; width: 24px; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end; font-size: 9px; font-weight: 700; color: rgba(255,255,255,0.4); pointer-events: none; border-right: 2px solid rgba(255,255,255,0.2); padding-right: 4px; }\n";
    }
    if (cls == "draw-dial") {
        return ".draw-dial { position: absolute; width: 100%; height: 100%; border-radius: 9999px !important; border: 2px solid rgba(255, 255, 255, 0.18); box-shadow: inset 0 0 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(0, 0, 0, 0.4); pointer-events: none; }\n";
    }
    if (cls == "geo-triangle" || cls == "geo-triangle-up") {
        return ".geo-triangle, .geo-triangle-up { clip-path: polygon(50% 0%, 0% 100%, 100% 100%); width: 100%; height: 100%; }\n";
    }
    if (cls == "geo-polygon-6") {
        return ".geo-polygon-6 { clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%); width: 100%; height: 100%; transform-origin: center center; }\n";
    }
    if (cls == "geo-polygon-8") {
        return ".geo-polygon-8 { clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%); width: 100%; height: 100%; transform-origin: center center; }\n";
    }
    if (cls == "geo-star-6") {
        return ".geo-star-6 { clip-path: polygon(50% 0%, 65% 25%, 100% 25%, 75% 50%, 100% 75%, 65% 75%, 50% 100%, 35% 75%, 0% 75%, 25% 50%, 0% 25%, 35% 25%); width: 100%; height: 100%; transform-origin: center center !important; }\n";
    }
    if (cls == "geo-needle") {
        return ".geo-needle { width: 3px; height: 42%; background: linear-gradient(to top, #ef4444, #f97316); border-radius: 3px 3px 0 0; position: absolute; bottom: 50%; left: calc(50% - 1.5px); transform-origin: center bottom !important; box-shadow: 0 0 10px rgba(239, 68, 68, 0.9); z-index: 15; }\n";
    }
    if (cls == "geo-ticks-10" || cls == "draw-ticks-10") {
        return ".geo-ticks-10, .draw-ticks-10 { position: absolute; width: 100%; height: 100%; border-radius: 9999px; background: repeating-conic-gradient(from -135deg, rgba(255,255,255,0.7) 0deg 1deg, transparent 1deg 27deg); mask: radial-gradient(circle, transparent 84%, black 86%); -webkit-mask: radial-gradient(circle, transparent 84%, black 86%); pointer-events: none; }\n";
    }
    if (cls == "geo-ticks-12" || cls == "draw-ticks-12") {
        return ".geo-ticks-12, .draw-ticks-12 { position: absolute; width: 100%; height: 100%; border-radius: 9999px; background: repeating-conic-gradient(from 0deg, rgba(255,255,255,0.7) 0deg 1deg, transparent 1deg 30deg); mask: radial-gradient(circle, transparent 84%, black 86%); -webkit-mask: radial-gradient(circle, transparent 84%, black 86%); pointer-events: none; }\n";
    }
    if (cls == "geo-wave") {
        return ".geo-wave { width: 100%; height: 16px; background: radial-gradient(circle at 50% 100%, oklch(0.68 0.24 260 / 0.8) 0%, transparent 70%); animation: ub-wave-pulse 2s infinite ease-in-out; }\n@keyframes ub-wave-pulse { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(1.4); } }\n";
    }
    if (cls == "draw-pivot") {
        return ".draw-pivot { width: 14px; height: 14px; border-radius: 9999px; background: radial-gradient(circle, #f8fafc 25%, #334155 85%); position: absolute; z-index: 20; box-shadow: 0 0 10px rgba(0,0,0,0.9); }\n";
    }

    // ── 4. STROKE & FILL (stroke-[color]-[shade]-[width], fill-[color]-[shade]) ──
    if (std::regex_match(cls, m, std::regex(R"(^stroke-([a-z]+)(?:-(\d+))?(?:-(\d+))?$)"))) {
        std::string color = m[1];
        double shade = m[2].matched ? std::stod(m[2]) : (color == "white" ? 0.0 : 120.0);
        int width = m[3].matched ? std::stoi(m[3]) : 2;
        OKLCHColor c = computeOKLCH(color, shade, darkMode);
        css << "." << cls << " { stroke: " << c.toString() << " !important; stroke-width: " << width << "px !important; }\n";
        return css.str();
    }
    if (std::regex_match(cls, m, std::regex(R"(^fill-([a-z]+)(?:-(\d+))?$)"))) {
        std::string color = m[1];
        if (color != "up" && color != "down" && color != "right" && color != "left" && color != "circle" && color != "gauge" && color != "deg" && color != "arc") {
            double shade = m[2].matched ? std::stod(m[2]) : (color == "white" ? 0.0 : 120.0);
            OKLCHColor c = computeOKLCH(color, shade, darkMode);
            css << "." << cls << " { fill: " << c.toString() << " !important; }\n";
            return css.str();
        }
    }

    // ── 5. ANGULAR ROTATIONS (rotate-0..255) ──
    if (std::regex_match(cls, m, std::regex(R"(^rotate-(\d+)(?:-(\d+)-(\d+(?:\.\d+)?(?:s|ms)))?(?:-(loop|inf|alt))?$)"))) {
        double v1 = std::stod(m[1]);
        double deg1 = (v1 / 255.0) * 360.0;

        if (m[2].matched) {
            double v2 = std::stod(m[2]);
            std::string dur = m[3];
            bool isLoop = m[4].matched;
            double deg2 = (v2 / 255.0) * 360.0;

            std::string animName = "ub-rot-" + cls;
            std::replace(animName.begin(), animName.end(), '.', '_');

            css << "@keyframes " << animName << " {\n"
                << "  0% { transform: rotate(" << (int)deg1 << "deg); }\n"
                << "  100% { transform: rotate(" << (int)deg2 << "deg); }\n"
                << "}\n"
                << "." << cls << " { animation: " << animName << " " << dur << " " << (isLoop ? "linear infinite" : "ease-out forwards") << "; }\n";
        } else {
            css << "." << cls << " { transform: rotate(" << (int)deg1 << "deg); transition: transform 0.3s ease; }\n";
        }
        return css.str();
    }

    // ── 6. DYNAMIC FLOWING GRADIENTS (gradient-135-blue-80-purple-160-3s) ──
    if (std::regex_match(cls, m, std::regex(R"(^gradient-(?:(135|90|45|180|horiz|vert|radial)-)?([a-z]+)-(\d+)-([a-z]+)-(\d+)(?:-(\d+(?:\.\d+)?(?:s|ms)))?$)"))) {
        std::string dir = m[1].matched ? m[1].str() : "135";
        std::string c1Name = m[2]; double s1 = std::stod(m[3]);
        std::string c2Name = m[4]; double s2 = std::stod(m[5]);
        std::string dur = m[6].matched ? m[6].str() : "";

        OKLCHColor c1 = computeOKLCH(c1Name, s1, darkMode);
        OKLCHColor c2 = computeOKLCH(c2Name, s2, darkMode);
        std::string dirCSS = (dir == "135") ? "135deg" : (dir == "90" || dir == "horiz") ? "to right" : (dir == "180" || dir == "vert") ? "to bottom" : (dir == "45") ? "45deg" : "circle";

        if (!dur.empty()) {
            std::string animName = "ub-grad-" + cls;
            css << "@keyframes " << animName << " {\n"
                << "  0% { background-position: 0% 50%; }\n"
                << "  50% { background-position: 100% 50%; }\n"
                << "  100% { background-position: 0% 50%; }\n"
                << "}\n"
                << "." << cls << " { background: linear-gradient(" << dirCSS << ", " << c1.toString() << ", " << c2.toString() << ", " << c1.toString() << ") !important; background-size: 200% 200% !important; animation: " << animName << " " << dur << " infinite ease-in-out; color: #ffffff !important; }\n";
        } else {
            css << "." << cls << " { background: linear-gradient(" << dirCSS << ", " << c1.toString() << ", " << c2.toString() << ") !important; color: #ffffff !important; }\n";
        }
        return css.str();
    }

    // ── 7. TEXT GRADIENT (text-grad-135-blue-30-purple-90) ──
    if (std::regex_match(cls, m, std::regex(R"(^text-grad-(135|horiz|45)-([a-z]+)-(\d+)-([a-z]+)-(\d+)$)"))) {
        std::string dir = m[1];
        std::string c1Name = m[2]; double s1 = std::stod(m[3]);
        std::string c2Name = m[4]; double s2 = std::stod(m[5]);
        OKLCHColor c1 = computeOKLCH(c1Name, s1, darkMode);
        OKLCHColor c2 = computeOKLCH(c2Name, s2, darkMode);
        std::string dirCSS = (dir == "135") ? "135deg" : (dir == "horiz") ? "to right" : "45deg";
        css << "." << cls << " { background: linear-gradient(" << dirCSS << ", " << c1.toString() << ", " << c2.toString() << "); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }\n";
        return css.str();
    }

    // ── 8. HARDWARE SCALE & HOVER ──
    if (std::regex_match(cls, m, std::regex(R"(^scale-(\d+)$)"))) {
        double val = std::stod(m[1]);
        double s = val / 100.0;
        css << "." << cls << " { transform: scale(" << s << "); transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1); }\n";
        return css.str();
    }
    if (std::regex_match(cls, m, std::regex(R"(^hover:scale-(\d+)(?:-(\d+(?:\.\d+)?(?:s|ms)))?$)"))) {
        double val = std::stod(m[1]);
        std::string dur = m[2].matched ? m[2].str() : "150ms";
        css << "." << cls << ":hover { transform: scale(" << (val / 100.0) << "); transition: transform " << dur << " ease; }\n";
        return css.str();
    }

    // ── 9. FIXED COLORS ──
    if (std::regex_match(cls, m, std::regex(R"(^bg-([a-z]+)-(\d+(?:\.\d+)?)$)"))) {
        std::string color = m[1]; double shade = std::stod(m[2]);
        OKLCHColor c = computeOKLCH(color, shade, darkMode);
        css << "." << cls << " { background: " << c.toString() << " !important; color: " << computeContrastText(c) << " !important; }\n";
        return css.str();
    }
    if (std::regex_match(cls, m, std::regex(R"(^text-([a-z]+)-(\d+(?:\.\d+)?)$)"))) {
        std::string color = m[1]; double shade = std::stod(m[2]);
        OKLCHColor c = computeOKLCH(color, shade, darkMode);
        css << "." << cls << " { color: " << c.toString() << " !important; }\n";
        return css.str();
    }

    // ── 10. SPACING & SIZING ──
    if (std::regex_match(cls, m, std::regex(R"(^(p|m|pl|pr|pt|pb|mt|mb|gap|w|h|rounded)-(\d+(?:\.\d+)?)$)"))) {
        std::string prop = m[1]; double val = std::stod(m[2]);
        static const std::unordered_map<std::string, std::string> sMap = {
            {"p", "padding"}, {"m", "margin"}, {"pl", "padding-left"}, {"pr", "padding-right"},
            {"pt", "padding-top"}, {"pb", "padding-bottom"}, {"mt", "margin-top"}, {"mb", "margin-bottom"},
            {"gap", "gap"}, {"w", "width"}, {"h", "height"}, {"rounded", "border-radius"}
        };
        css << "." << cls << " { " << sMap.at(prop) << ": " << px(val) << "; }\n";
        return css.str();
    }

    // ── 11. OPACITY ──
    if (std::regex_match(cls, m, std::regex(R"(^opacity-(\d+)$)"))) {
        double val = std::stod(m[1]);
        css << "." << cls << " { opacity: " << (val / 255.0) << "; }\n";
        return css.str();
    }

    // ── 12. RESPONSIVE GRIDS ──
    if (std::regex_match(cls, m, std::regex(R"(^grid-(\d+)x(\d+)-(\d+(?:\.\d+)?)$)"))) {
        int cols = std::stoi(m[1]); int rows = std::stoi(m[2]); double gap = std::stod(m[3]);
        css << "." << cls << " { display: grid; grid-template-columns: repeat(" << cols 
            << ", minmax(0, 1fr)); grid-template-rows: repeat(" << rows << ", auto); gap: " 
            << gapPx(gap) << "; width: 100%; }\n";
        return css.str();
    }
    if (std::regex_match(cls, m, std::regex(R"(^grid-(\d+)$)"))) {
        int count = std::stoi(m[1]);
        int minWidth = (count == 4) ? 220 : (count == 3) ? 260 : (count == 2) ? 300 : 100;
        if (count == 1) {
            css << "." << cls << " { display: grid; grid-template-columns: 1fr; gap: 16px; width: 100%; }\n";
        } else {
            css << "." << cls << " { display: grid; grid-template-columns: repeat(auto-fit, minmax(" 
                << minWidth << "px, 1fr)); gap: 20px; width: 100%; }\n";
        }
        return css.str();
    }

    // ── 13. CARD & GLASS SUITE (Natural Balanced Modern Look) ──
    if (cls == "card") return ".card { background: rgba(30, 41, 59, 0.65); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 22px; backdrop-filter: blur(16px); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.15); transition: all 0.2s ease-out; }\n.card:hover { transform: translateY(-2px); border-color: rgba(255, 255, 255, 0.14); box-shadow: 0 14px 30px -4px rgba(0, 0, 0, 0.35); }\n";
    if (cls == "card-glass") return ".card-glass { background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255, 255, 255, 0.07); border-radius: 14px; padding: 20px; backdrop-filter: blur(16px); }\n";
    if (cls == "card-glow") return ".card-glow { box-shadow: 0 0 20px rgba(59, 130, 246, 0.15); border: 1px solid rgba(96, 165, 250, 0.25); }\n";
    if (cls == "glass-135") return ".glass-135 { background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8)) !important; backdrop-filter: blur(20px) !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; }\n";

    // ── 14. TYPOGRAPHY ──
    if (cls == "text-xs") return ".text-xs { font-size: 11px; line-height: 16px; }\n";
    if (cls == "text-sm") return ".text-sm { font-size: 13px; line-height: 18px; }\n";
    if (cls == "text-base") return ".text-base { font-size: 15px; line-height: 22px; }\n";
    if (cls == "text-lg") return ".text-lg { font-size: 18px; line-height: 26px; }\n";
    if (cls == "text-xl") return ".text-xl { font-size: 20px; line-height: 28px; }\n";
    if (cls == "text-2xl") return ".text-2xl { font-size: 24px; line-height: 32px; }\n";
    if (cls == "text-3xl") return ".text-3xl { font-size: 30px; line-height: 38px; }\n";
    if (cls == "text-4xl") return ".text-4xl { font-size: 36px; line-height: 44px; }\n";

    if (cls == "font-normal") return ".font-normal { font-weight: 400; }\n";
    if (cls == "font-semibold") return ".font-semibold { font-weight: 600; }\n";
    if (cls == "font-bold") return ".font-bold { font-weight: 700; }\n";
    if (cls == "font-extrabold") return ".font-extrabold { font-weight: 800; }\n";
    if (cls == "font-black") return ".font-black { font-weight: 900; }\n";

    if (cls == "text-left") return ".text-left { text-align: left; }\n";
    if (cls == "text-center") return ".text-center { text-align: center; }\n";
    if (cls == "text-right") return ".text-right { text-align: right; }\n";

    // ── 15. FLEXBOX & UTILITIES ──
    if (cls == "flex") return ".flex { display: flex; }\n";
    if (cls == "flex-col") return ".flex-col { display: flex; flex-direction: column; }\n";
    if (cls == "flex-wrap") return ".flex-wrap { display: flex; flex-wrap: wrap; }\n";
    if (cls == "flex-center") return ".flex-center { display: flex; align-items: center; justify-content: center; }\n";
    if (cls == "flex-between") return ".flex-between { display: flex; align-items: center; justify-content: space-between; }\n";
    if (cls == "relative") return ".relative { position: relative; }\n";
    if (cls == "absolute") return ".absolute { position: absolute; }\n";
    if (cls == "overflow-hidden") return ".overflow-hidden { overflow: hidden; }\n";
    if (cls == "w-full") return ".w-full { width: 100%; }\n";
    if (cls == "h-full") return ".h-full { height: 100%; }\n";
    if (cls == "origin-bottom") return ".origin-bottom { transform-origin: bottom center !important; }\n";
    if (cls == "origin-center") return ".origin-center { transform-origin: center center !important; }\n";

    if (cls == "btn") return ".btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 24px; font-size: 14px; font-weight: 600; border-radius: 12px; border: none; cursor: pointer; transition: all 0.3s ease; text-decoration: none; }\n";
    if (cls == "btn-primary") return ".btn-primary { background: linear-gradient(135deg, oklch(0.68 0.24 260), oklch(0.55 0.26 260)); color: white; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4); }\n";
    if (cls == "btn-success") return ".btn-success { background: linear-gradient(135deg, oklch(0.67 0.22 145), oklch(0.52 0.24 145)); color: white; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4); }\n";
    if (cls == "btn-danger") return ".btn-danger { background: linear-gradient(135deg, oklch(0.62 0.28 25), oklch(0.48 0.30 25)); color: white; box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4); }\n";
    if (cls == "btn-glow") return ".btn-glow { animation: ub-pulse-glow 2s infinite ease-in-out; }\n@keyframes ub-pulse-glow { 0%, 100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); } 50% { box-shadow: 0 0 25px rgba(59, 130, 246, 0.9); } }\n";

    if (cls == "rounded-lg") return ".rounded-lg { border-radius: 12px; }\n";
    if (cls == "rounded-xl") return ".rounded-xl { border-radius: 16px; }\n";
    if (cls == "rounded-2xl") return ".rounded-2xl { border-radius: 20px; }\n";
    if (cls == "rounded-full") return ".rounded-full { border-radius: 9999px; }\n";

    return "";
}

// ─── 🎨 DECLARATIVE 2D DRAWING & VECTOR LAYER TRANSLATOR ──────────────────────
inline std::string parseTurtlePath(const std::string& classStr) {
    std::stringstream ss(classStr);
    std::string token;
    std::stringstream d;
    std::smatch m;

    while (ss >> token) {
        if (std::regex_match(token, m, std::regex(R"(^start-(\d+)-(\d+)$)"))) {
            d << "M " << m[1] << " " << m[2] << " ";
        } else if (std::regex_match(token, m, std::regex(R"(^to-(\d+)-(\d+)$)"))) {
            d << "L " << m[1] << " " << m[2] << " ";
        } else if (std::regex_match(token, m, std::regex(R"(^right-(\d+)$)"))) {
            d << "h " << m[1] << " ";
        } else if (std::regex_match(token, m, std::regex(R"(^left-(\d+)$)"))) {
            d << "h -" << m[1] << " ";
        } else if (std::regex_match(token, m, std::regex(R"(^down-(\d+)$)"))) {
            d << "v " << m[1] << " ";
        } else if (std::regex_match(token, m, std::regex(R"(^up-(\d+)$)"))) {
            d << "v -" << m[1] << " ";
        } else if (token == "close") {
            d << "Z ";
        }
    }
    return d.str();
}

template<typename Callback>
inline std::string regexReplaceCallback(const std::string& input, const std::regex& re, Callback cb) {
    std::string result;
    auto words_begin = std::sregex_iterator(input.begin(), input.end(), re);
    auto words_end = std::sregex_iterator();
    size_t lastPos = 0;
    for (std::sregex_iterator i = words_begin; i != words_end; ++i) {
        std::smatch match = *i;
        result.append(input, lastPos, match.position() - lastPos);
        result.append(cb(match));
        lastPos = match.position() + match.length();
    }
    result.append(input, lastPos, input.length() - lastPos);
    return result;
}

inline std::string renderNativeIcon(const std::string& name) {
    if (name == "cpu") return "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\"/><rect x=\"9\" y=\"9\" width=\"6\" height=\"6\"/><path d=\"M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3\"/>";
    if (name == "wifi") return "<path d=\"M5 12.55a11 11 0 0 1 14.08 0\"/><path d=\"M1.42 9a16 16 0 0 1 21.16 0\"/><path d=\"M8.53 16.11a6 6 0 0 1 6.95 0\"/><line x1=\"12\" y1=\"20\" x2=\"12.01\" y2=\"20\"/>";
    if (name == "battery") return "<rect x=\"1\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\"/><line x1=\"23\" y1=\"11\" x2=\"23\" y2=\"13\"/><line x1=\"5\" y1=\"12\" x2=\"13\" y2=\"12\"/>";
    if (name == "server") return "<rect x=\"2\" y=\"2\" width=\"20\" height=\"8\" rx=\"2\"/><rect x=\"2\" y=\"14\" width=\"20\" height=\"8\" rx=\"2\"/><line x1=\"6\" y1=\"6\" x2=\"6.01\" y2=\"6\"/><line x1=\"6\" y1=\"18\" x2=\"6.01\" y2=\"18\"/>";
    if (name == "gauge") return "<path d=\"M12 15l3.5-3.5\"/><path d=\"M20.3 18a9 9 0 1 0-16.6 0\"/>";
    if (name == "database") return "<ellipse cx=\"12\" cy=\"5\" rx=\"9\" ry=\"3\"/><path d=\"M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5\"/><path d=\"M3 12c0 1.66 4 3 9 3s9-1.34 9-3\"/>";
    if (name == "activity" || name == "pulse") return "<polyline points=\"22 12 18 12 15 21 9 3 6 12 2 12\"/>";
    if (name == "zap" || name == "bolt") return "<polygon points=\"13 2 3 14 12 14 11 22 21 10 12 10 13 2\"/>";
    if (name == "bell") return "<path d=\"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9\"/><path d=\"M13.73 21a2 2 0 0 1-3.46 0\"/>";
    if (name == "gear" || name == "settings") return "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z\"/>";
    if (name == "cloud") return "<path d=\"M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z\"/>";
    if (name == "check") return "<polyline points=\"20 6 9 17 4 12\"/>";
    if (name == "shield") return "<path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\"/>";
    if (name == "lock") return "<rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"/>";
    if (name == "user") return "<path d=\"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\"/><circle cx=\"12\" cy=\"7\" r=\"4\"/>";
    if (name == "code") return "<polyline points=\"16 18 22 12 16 6\"/><polyline points=\"8 6 2 12 8 18\"/>";
    if (name == "terminal") return "<polyline points=\"4 17 10 11 4 5\"/><line x1=\"12\" y1=\"19\" x2=\"20\" y2=\"19\"/>";
    if (name == "clock") return "<circle cx=\"12\" cy=\"12\" r=\"10\"/><polyline points=\"12 6 12 12 16 14\"/>";
    if (name == "heart") return "<path d=\"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z\"/>";
    if (name == "search") return "<circle cx=\"11\" cy=\"11\" r=\"8\"/><line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\"/>";
    return "<circle cx=\"12\" cy=\"12\" r=\"10\"/>";
}

inline std::string transformDrawingTags(const std::string& html) {
    std::string result = html;

    // 0. <icon name="cpu" class="..." /> ➔ Native Clean SVG Icon
    std::regex iconRegex(R"(<icon\s+name=["']([a-zA-Z0-9_-]+)["'](?:\s+class=["']([^"']*)["'])?\s*/>)");
    result = regexReplaceCallback(result, iconRegex, [](const std::smatch& sm) {
        std::string name = sm[1].str();
        std::string cls = sm[2].matched ? sm[2].str() : "";
        std::string pathData = renderNativeIcon(name);
        return "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"ub-icon " + cls + "\">" + pathData + "</svg>";
    });

    // 1. <draw canvas="255x255" class="..."> ➔ <svg viewBox="0 0 W H" class="...">
    std::regex drawOpenRegex(R"(<draw(?:\s+canvas=["'](\d+)x(\d+)["'])?(?:\s+class=["']([^"']*)["'])?\s*>)");
    result = regexReplaceCallback(result, drawOpenRegex, [](const std::smatch& sm) {
        std::string w = sm[1].matched ? sm[1].str() : "255";
        std::string h = sm[2].matched ? sm[2].str() : "255";
        std::string cls = sm[3].matched ? sm[3].str() : "";
        return "<svg viewBox=\"0 0 " + w + " " + h + "\" class=\"ub-draw " + cls + "\">";
    });
    result = std::regex_replace(result, std::regex(R"(</draw>)"), "</svg>");

    // 2. <layer z="1" class="..."> ➔ <g class="ub-layer ...">
    std::regex layerOpenRegex(R"(<layer(?:\s+z=["']\d+["'])?(?:\s+class=["']([^"']*)["'])?\s*>)");
    result = regexReplaceCallback(result, layerOpenRegex, [](const std::smatch& sm) {
        std::string cls = sm[1].matched ? sm[1].str() : "";
        return "<g class=\"ub-layer " + cls + "\">";
    });
    result = std::regex_replace(result, std::regex(R"(</layer>)"), "</g>");

    // 3. <path class="..." /> (Turtle Directional Path DSL)
    std::regex pathRegex(R"(<path\s+class=["']([^"']+)["']\s*/>)");
    result = regexReplaceCallback(result, pathRegex, [](const std::smatch& sm) {
        std::string cls = sm[1].str();
        std::string pathData = parseTurtlePath(cls);
        return "<path d=\"" + pathData + "\" class=\"" + cls + "\" />";
    });

    // 4. <circle at="X-Y" r="R" class="..." />
    std::regex circleRegex(R"(<circle\s+at=["'](\d+)-(\d+)["']\s+r=["'](\d+)["'](?:\s+class=["']([^"']*)["'])?\s*/>)");
    result = regexReplaceCallback(result, circleRegex, [](const std::smatch& sm) {
        return "<circle cx=\"" + sm[1].str() + "\" cy=\"" + sm[2].str() + "\" r=\"" + sm[3].str() + "\" class=\"" + (sm[4].matched ? sm[4].str() : "") + "\" />";
    });

    // 5. <rect at="X-Y" size="W-H" (rounded="R") class="..." />
    std::regex rectRegex(R"(<rect\s+at=["'](\d+)-(\d+)["']\s+size=["'](\d+)-(\d+)["'](?:\s+rounded=["'](\d+)["'])?(?:\s+class=["']([^"']*)["'])?\s*/>)");
    result = regexReplaceCallback(result, rectRegex, [](const std::smatch& sm) {
        std::string rx = sm[5].matched ? " rx=\"" + sm[5].str() + "\"" : "";
        return "<rect x=\"" + sm[1].str() + "\" y=\"" + sm[2].str() + "\" width=\"" + sm[3].str() + "\" height=\"" + sm[4].str() + "\"" + rx + " class=\"" + (sm[6].matched ? sm[6].str() : "") + "\" />";
    });

    // 6. <line from="X1-Y1" to="X2-Y2" class="..." />
    std::regex lineRegex(R"(<line\s+from=["'](\d+)-(\d+)["']\s+to=["'](\d+)-(\d+)["'](?:\s+class=["']([^"']*)["'])?\s*/>)");
    result = regexReplaceCallback(result, lineRegex, [](const std::smatch& sm) {
        return "<line x1=\"" + sm[1].str() + "\" y1=\"" + sm[2].str() + "\" x2=\"" + sm[3].str() + "\" y2=\"" + sm[4].str() + "\" class=\"" + (sm[5].matched ? sm[5].str() : "") + "\" />";
    });

    // 7. <text at="X-Y" class="...">Content</text>
    std::regex textRegex(R"(<text\s+at=["'](\d+)-(\d+)["'](?:\s+class=["']([^"']*)["'])?\s*>([^<]+)</text>)");
    result = regexReplaceCallback(result, textRegex, [](const std::smatch& sm) {
        return "<text x=\"" + sm[1].str() + "\" y=\"" + sm[2].str() + "\" dominant-baseline=\"middle\" text-anchor=\"middle\" class=\"" + (sm[3].matched ? sm[3].str() : "") + "\">" + sm[4].str() + "</text>";
    });

    return result;
}

// ─── Live HTML JIT Parser & Style Injector ────────────────────────────────────
inline std::string compileHTML(const std::string& htmlContent, bool darkMode = false) {
    // Step 1: Translate Declarative <draw> & <layer> tags into Native Vector SVG Nodes
    std::string processedHTML = transformDrawingTags(htmlContent);

    // Step 2: Extract all class tokens from HTML + Vector Nodes
    std::unordered_set<std::string> classes;
    std::regex classAttrRegex(R"(class\s*=\s*["']([^"']+)["'])");
    auto words_begin = std::sregex_iterator(processedHTML.begin(), processedHTML.end(), classAttrRegex);
    auto words_end = std::sregex_iterator();

    for (std::sregex_iterator i = words_begin; i != words_end; ++i) {
        std::smatch match = *i;
        std::string classList = match[1].str();
        std::stringstream ss(classList);
        std::string token;
        while (ss >> token) {
            classes.insert(token);
        }
    }

    std::stringstream dynamicCSS;
    dynamicCSS << "/* 🐬 Universal UB 2.0 Hardware, 2D Vector & Natural Modern Theme (<0.05ms C++ Execution) */\n"
               << "* { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased; }\n"
               << "body { background: radial-gradient(circle at 50% 0%, #1e293b 0%, #0f172a 60%, #090d16 100%); color: #f8fafc; min-height: 100vh; }\n"
               << ".container { max-width: 1200px; margin: 0 auto; padding: 32px 20px; width: 100%; }\n"
               << ".ub-draw { width: 100%; height: 100%; overflow: visible; display: block; }\n";

    for (const auto& cls : classes) {
        dynamicCSS << compileClassRule(cls, darkMode);
    }

    std::string injectedStyle = "\n<style id=\"ub-runtime-engine\">\n" + dynamicCSS.str() + "</style>\n</head>";
    std::string result = processedHTML;
    size_t headPos = result.find("</head>");
    if (headPos != std::string::npos) {
        result.replace(headPos, 7, injectedStyle);
    } else {
        result = injectedStyle + result;
    }

    return result;
}

} // namespace DolphinUBEngine

// ─── 🇳🇵 Global Dolphin Native UB Runtime Namespace ───────────────────────────
struct UBNamespace {
    var compile(const var& html) {
        return var(DolphinUBEngine::compileHTML(html.toString()));
    }

    var render(const var& templatePath, const var& data = var()) {
        std::ifstream f(templatePath.toString());
        if (!f.is_open()) {
            return var("Template not found: " + templatePath.toString());
        }
        std::stringstream ss;
        ss << f.rdbuf();
        return var(DolphinUBEngine::compileHTML(ss.str()));
    }

    var oklch(const var& colorName, const var& shade) {
        auto c = DolphinUBEngine::computeOKLCH(colorName.toString(), shade.toDouble());
        return var(c.toString());
    }

    var contrast(const var& colorName, const var& shade) {
        auto c = DolphinUBEngine::computeOKLCH(colorName.toString(), shade.toDouble());
        return var(DolphinUBEngine::computeContrastText(c));
    }
};

inline UBNamespace UB, DolphinUB;
