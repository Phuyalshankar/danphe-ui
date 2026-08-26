#pragma once
#include <string>
#include <sstream>
#include <cstdint>
#include <cmath>

namespace DanpheUI {

/**
 * 🌟 TitanAdaptiveIcon (ThorVG & Danphe-2 Native Compliant)
 * ═════════════════════════════════════════════════════════
 * 100% Pure Self-Contained SVG Document (Zero HTML <div>/<span>)
 * Renders Pixel-Perfect on ThorVG (C++), Dolphin UB, LVGL, Web & Mobile!
 */
class TitanAdaptiveIcon {
public:
    static std::string getIconPath(uint8_t code) {
        switch (code) {
            case 1:  // Incoming Voice Call
                return "<path d=\"M17 14.5v2.2a1.5 1.5 0 0 1-1.6 1.5 14.8 14.8 0 0 1-6.5-2.3 14.6 14.6 0 0 1-4.5-4.5A14.8 14.8 0 0 1 2.1 4.9 1.5 1.5 0 0 1 3.6 3.3h2.2a1.5 1.5 0 0 1 1.5 1.3 9.6 9.6 0 0 0 .5 2.1 1.5 1.5 0 0 1-.3 1.6L6.5 9.3a12 12 0 0 0 4.5 4.5l1-1a1.5 1.5 0 0 1 1.6-.3 9.6 9.6 0 0 0 2.1.5 1.5 1.5 0 0 1 1.3 1.5z\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><polyline points=\"13 4 16 7 13 10\" fill=\"none\" stroke=\"#6ee7b7\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><line x1=\"16\" y1=\"7\" x2=\"9\" y2=\"14\" stroke=\"#6ee7b7\" stroke-width=\"2\" stroke-linecap=\"round\"/>";
            
            case 2:  // Incoming Video Call
                return "<rect x=\"2\" y=\"5\" width=\"13\" height=\"12\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"1.8\"/><polygon points=\"21 7 15 11 21 15 21 7\" fill=\"rgba(192,132,252,0.4)\" stroke=\"#c084fc\" stroke-width=\"1.5\" stroke-linejoin=\"round\"/><polyline points=\"9 8 9 12 5 12\" fill=\"none\" stroke=\"#38bdf8\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><line x1=\"9\" y1=\"12\" x2=\"4.5\" y2=\"7.5\" stroke=\"#38bdf8\" stroke-width=\"2\" stroke-linecap=\"round\"/>";
            
            case 3:  // Outgoing Call
                return "<path d=\"M17 14.5v2.2a1.5 1.5 0 0 1-1.6 1.5 14.8 14.8 0 0 1-6.5-2.3 14.6 14.6 0 0 1-4.5-4.5A14.8 14.8 0 0 1 2.1 4.9 1.5 1.5 0 0 1 3.6 3.3h2.2a1.5 1.5 0 0 1 1.5 1.3 9.6 9.6 0 0 0 .5 2.1 1.5 1.5 0 0 1-.3 1.6L6.5 9.3a12 12 0 0 0 4.5 4.5l1-1a1.5 1.5 0 0 1 1.6-.3 9.6 9.6 0 0 0 2.1.5 1.5 1.5 0 0 1 1.3 1.5z\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><polyline points=\"16 8 16 3 11 3\" fill=\"none\" stroke=\"#fde047\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><line x1=\"10.5\" y1=\"8.5\" x2=\"16\" y2=\"3\" stroke=\"#fde047\" stroke-width=\"2\" stroke-linecap=\"round\"/>";
            
            case 4:  // Missed Call
                return "<path d=\"M17 14.5v2.2a1.5 1.5 0 0 1-1.6 1.5 14.8 14.8 0 0 1-6.5-2.3 14.6 14.6 0 0 1-4.5-4.5A14.8 14.8 0 0 1 2.1 4.9 1.5 1.5 0 0 1 3.6 3.3h2.2a1.5 1.5 0 0 1 1.5 1.3 9.6 9.6 0 0 0 .5 2.1 1.5 1.5 0 0 1-.3 1.6L6.5 9.3a12 12 0 0 0 4.5 4.5l1-1a1.5 1.5 0 0 1 1.6-.3 9.6 9.6 0 0 0 2.1.5 1.5 1.5 0 0 1 1.3 1.5z\" fill=\"none\" stroke=\"#f87171\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><line x1=\"18\" y1=\"3\" x2=\"13\" y2=\"8\" stroke=\"#ef4444\" stroke-width=\"2.4\" stroke-linecap=\"round\"/><line x1=\"13\" y1=\"3\" x2=\"18\" y2=\"8\" stroke=\"#ef4444\" stroke-width=\"2.4\" stroke-linecap=\"round\"/>";
            
            case 5:  // Connected In-Call
                return "<path d=\"M17 14.5v2.2a1.5 1.5 0 0 1-1.6 1.5 14.8 14.8 0 0 1-6.5-2.3 14.6 14.6 0 0 1-4.5-4.5A14.8 14.8 0 0 1 2.1 4.9 1.5 1.5 0 0 1 3.6 3.3h2.2a1.5 1.5 0 0 1 1.5 1.3 9.6 9.6 0 0 0 .5 2.1 1.5 1.5 0 0 1-.3 1.6L6.5 9.3a12 12 0 0 0 4.5 4.5l1-1a1.5 1.5 0 0 1 1.6-.3 9.6 9.6 0 0 0 2.1.5 1.5 1.5 0 0 1 1.3 1.5z\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M11 3a6 6 0 0 1 6 6\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"1.8\" stroke-linecap=\"round\"/><path d=\"M11 6a3 3 0 0 1 3 3\" fill=\"none\" stroke=\"#6ee7b7\" stroke-width=\"1.8\" stroke-linecap=\"round\"/>";
            
            case 6:  // Mic Mute
                return "<line x1=\"2\" y1=\"2\" x2=\"22\" y2=\"22\" stroke=\"#f43f5e\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M9 9v3a3 3 0 0 0 5.1 2.1M15 9.3V4a3 3 0 0 0-5.9-.6\" fill=\"none\" stroke=\"#f43f5e\" stroke-width=\"1.8\" stroke-linecap=\"round\"/><path d=\"M17 16.9A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.1 1.2\" fill=\"none\" stroke=\"#f43f5e\" stroke-width=\"1.8\" stroke-linecap=\"round\"/><line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"23\" stroke=\"#f43f5e\" stroke-width=\"1.8\" stroke-linecap=\"round\"/><line x1=\"8\" y1=\"23\" x2=\"16\" y2=\"23\" stroke=\"#f43f5e\" stroke-width=\"1.8\" stroke-linecap=\"round\"/>";
            
            case 7:  // Unread Chat
                return "<path d=\"M20 14a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z\" fill=\"rgba(34,211,238,0.2)\" stroke=\"#22d3ee\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><circle cx=\"8\" cy=\"9.5\" r=\"1.2\" fill=\"#22d3ee\"/><circle cx=\"12\" cy=\"9.5\" r=\"1.2\" fill=\"#22d3ee\"/><circle cx=\"16\" cy=\"9.5\" r=\"1.2\" fill=\"#22d3ee\"/>";
            
            case 64: // CPU Processor
                return "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\" fill=\"rgba(52,211,153,0.15)\" stroke=\"#34d399\" stroke-width=\"1.8\"/><rect x=\"9\" y=\"9\" width=\"6\" height=\"6\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"1.5\"/><path d=\"M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3\" stroke=\"#34d399\" stroke-width=\"1.6\" stroke-linecap=\"round\"/>";
            
            case 129: // WiFi Full
                return "<path d=\"M5 12.5a11 11 0 0 1 14 0\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M1.4 9a16 16 0 0 1 21.2 0\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M8.5 16.1a6 6 0 0 1 7 0\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\" stroke-linecap=\"round\"/><circle cx=\"12\" cy=\"20\" r=\"1\" fill=\"#34d399\"/>";

            case 255: // Master All Highway
                return "<path d=\"M17 14.5v2.2a1.5 1.5 0 0 1-1.6 1.5 14.8 14.8 0 0 1-6.5-2.3 14.6 14.6 0 0 1-4.5-4.5A14.8 14.8 0 0 1 2.1 4.9 1.5 1.5 0 0 1 3.6 3.3h2.2a1.5 1.5 0 0 1 1.5 1.3 9.6 9.6 0 0 0 .5 2.1 1.5 1.5 0 0 1-.3 1.6L6.5 9.3a12 12 0 0 0 4.5 4.5l1-1a1.5 1.5 0 0 1 1.6-.3 9.6 9.6 0 0 0 2.1.5 1.5 1.5 0 0 1 1.3 1.5z\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><polyline points=\"13 4 16 7 13 10\" fill=\"none\" stroke=\"#6ee7b7\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><line x1=\"16\" y1=\"7\" x2=\"9\" y2=\"14\" stroke=\"#6ee7b7\" stroke-width=\"2\" stroke-linecap=\"round\"/>";

            default: // Standby Phone (0)
                return "<path d=\"M17 14.5v2.2a1.5 1.5 0 0 1-1.6 1.5 14.8 14.8 0 0 1-6.5-2.3 14.6 14.6 0 0 1-4.5-4.5A14.8 14.8 0 0 1 2.1 4.9 1.5 1.5 0 0 1 3.6 3.3h2.2a1.5 1.5 0 0 1 1.5 1.3 9.6 9.6 0 0 0 .5 2.1 1.5 1.5 0 0 1-.3 1.6L6.5 9.3a12 12 0 0 0 4.5 4.5l1-1a1.5 1.5 0 0 1 1.6-.3 9.6 9.6 0 0 0 2.1.5 1.5 1.5 0 0 1 1.3 1.5z\" fill=\"none\" stroke=\"#64748b\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>";
        }
    }

    /**
     * Renders 100% Pure SVG for ThorVG & Danphe-2
     * @param signedCode  Positive (+Code) = Luxury Circle ON, Negative (-Code) = Border OFF
     * @param missedCount Counter for missed call badge
     * @param size        Pixel size of SVG document
     */
    static std::string render(int32_t signedCode, uint8_t missedCount = 0, int size = 64) {
        bool circle = (signedCode >= 0);
        uint8_t byteCode = std::abs(signedCode) & 0xFF;

        std::string themeGlow = "#34d399";
        std::string themeBg = "#022c22";
        if (byteCode == 2) { themeGlow = "#c084fc"; themeBg = "#2e1065"; }
        else if (byteCode == 3) { themeGlow = "#fbbf24"; themeBg = "#451a03"; }
        else if (byteCode == 4) { themeGlow = "#f87171"; themeBg = "#4c0519"; }
        else if (byteCode == 6) { themeGlow = "#f43f5e"; themeBg = "#4c0519"; }
        else if (byteCode == 7) { themeGlow = "#22d3ee"; themeBg = "#083344"; }
        else if (byteCode == 0) { themeGlow = "#64748b"; themeBg = "#0f172a"; }

        std::stringstream ss;
        ss << "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" width=\"" << size << "\" height=\"" << size << "\">\n";

        // 1. ThorVG Native Background & Luxury Circle (if circle == true)
        if (circle) {
            // Outer Halo Ring
            ss << "  <circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"none\" stroke=\"" << themeGlow << "\" stroke-opacity=\"0.2\" stroke-width=\"1.5\"/>\n";
            // Luxury Glass Circle
            ss << "  <circle cx=\"16\" cy=\"16\" r=\"13.5\" fill=\"" << themeBg << "\" fill-opacity=\"0.85\" stroke=\"" << themeGlow << "\" stroke-width=\"1.4\"/>\n";
        }

        // 2. Centered Vector Glyph (Scaled cleanly into 32x32 view)
        ss << "  <g transform=\"translate(4, 4)\">\n";
        ss << "    " << getIconPath(byteCode) << "\n";
        ss << "  </g>\n";

        // 3. ThorVG Native Vector Missed Call Badge (if missedCount > 0)
        if ((byteCode == 4 || byteCode == 255) && missedCount > 0) {
            ss << "  <!-- Missed Call Badge -->\n";
            ss << "  <circle cx=\"25\" cy=\"7\" r=\"5\" fill=\"#ef4444\" stroke=\"#020617\" stroke-width=\"1.5\"/>\n";
            ss << "  <text x=\"25\" y=\"8.8\" font-family=\"monospace, sans-serif\" font-size=\"5.5\" font-weight=\"bold\" fill=\"#ffffff\" text-anchor=\"middle\">" 
               << (int)missedCount << "</text>\n";
        }

        // 4. ThorVG Native Ping/Dot Indicator (for Chat or 255 Highway)
        if (byteCode == 7 || byteCode == 255) {
            ss << "  <!-- Active Unread Dot -->\n";
            ss << "  <circle cx=\"7\" cy=\"25\" r=\"2.5\" fill=\"#22d3ee\" stroke=\"#020617\" stroke-width=\"1\"/>\n";
        }

        ss << "</svg>";
        return ss.str();
    }
};

} // namespace DanpheUI
