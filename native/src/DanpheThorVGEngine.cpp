#include <string>
#include <sstream>
#include <vector>
#include <cmath>
#include <algorithm>
#include "ub.hpp"

namespace Danphe {

struct BusEvent {
    std::string channel;
    std::string key;
    std::string value;

    std::string getActionString() const {
        if (!key.empty()) return "bus:key:" + key;
        if (!channel.empty() && !value.empty()) return "bus:" + channel + ":" + value;
        if (!channel.empty()) return "bus:" + channel;
        return "";
    }
};

/**
 * 🚌 EverestBusEngine — Native C++ Binary Event & Action Bus Engine
 */
class EverestBusEngine {
public:
    static std::string processObjectAction(const std::string& inputAction) {
        if (inputAction.empty()) return "";
        if (inputAction.find('{') == std::string::npos) return inputAction; // Standard string action

        BusEvent evt;
        if (inputAction.find("\"key\"") != std::string::npos) {
            size_t pos = inputAction.find("\"key\"");
            size_t valPos = inputAction.find(':', pos);
            if (valPos != std::string::npos) {
                size_t q1 = inputAction.find('"', valPos);
                size_t q2 = inputAction.find('"', q1 + 1);
                if (q1 != std::string::npos && q2 != std::string::npos) {
                    evt.key = inputAction.substr(q1 + 1, q2 - q1 - 1);
                }
            }
        }
        return evt.getActionString();
    }
};

class ThorVGSynthesizer {
public:
    // ── 1. PURE C++ VECTOR DIALER UI GENERATOR ──
    static std::string buildKeypadSvg(const std::string& dialedNumber, int activeKey = -1) {
        std::stringstream svg;
        svg << "<svg viewBox=\"0 0 360 480\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">";
        
        // Deep Sleek Slate Background
        svg << "<rect width=\"360\" height=\"480\" rx=\"24\" fill=\"#020617\"/>";

        // Top Display Monitor Box (High-Contrast Glass Bezel)
        svg << "<rect x=\"20\" y=\"20\" width=\"320\" height=\"60\" rx=\"16\" fill=\"#090d16\" stroke=\"#1e293b\" stroke-width=\"1.5\"/>";
        
        // Render Dialed Text or Standby Cursor
        std::string displayText = dialedNumber.empty() ? "Enter Number" : dialedNumber;
        std::string textColor = dialedNumber.empty() ? "#64748b" : "#ffffff";
        svg << "<text x=\"180\" y=\"58\" font-size=\"28\" font-weight=\"bold\" fill=\"" << textColor << "\" text-anchor=\"middle\" letter-spacing=\"2\">" 
            << displayText << "</text>";

        // Dial Key Definitions
        struct KeyDef { const char* num; const char* sub; int x; int y; };
        std::vector<KeyDef> keys = {
            {"1", "",     60, 130}, {"2", "ABC", 180, 130}, {"3", "DEF", 300, 130},
            {"4", "GHI",  60, 205}, {"5", "JKL", 180, 205}, {"6", "MNO", 300, 205},
            {"7", "PQRS", 60, 280}, {"8", "TUV", 180, 280}, {"9", "WXYZ", 300, 280},
            {"*", "",     60, 355}, {"0", "+",   180, 355}, {"#", "",     300, 355}
        };

        for (const auto& k : keys) {
            svg << "<g>";
            // Button Outer Glow & Disc
            svg << "<circle cx=\"" << k.x << "\" cy=\"" << k.y << "\" r=\"32\" fill=\"#0f172a\" stroke=\"#1e293b\" stroke-width=\"1.5\"/>";
            // Number Text
            svg << "<text x=\"" << k.x << "\" y=\"" << (k.y + (strlen(k.sub) > 0 ? 0 : 8)) << "\" font-size=\"24\" font-weight=\"bold\" fill=\"#ffffff\" text-anchor=\"middle\">" 
                << k.num << "</text>";
            // Sub-Letters Text
            if (strlen(k.sub) > 0) {
                svg << "<text x=\"" << k.x << "\" y=\"" << (k.y + 14) << "\" font-size=\"9\" font-weight=\"bold\" fill=\"#94a3b8\" text-anchor=\"middle\">" 
                    << k.sub << "</text>";
            }
            svg << "</g>";
        }

        // Bottom Actions Bar
        // 1. Hide Button
        svg << "<circle cx=\"70\" cy=\"430\" r=\"26\" fill=\"#0f172a\" stroke=\"#1e293b\" stroke-width=\"1.5\"/>";
        svg << "<text x=\"70\" y=\"438\" font-size=\"18\" fill=\"#38bdf8\" text-anchor=\"middle\">⌨</text>";

        // 2. Call FAB Button (Glowing Emerald)
        svg << "<circle cx=\"180\" cy=\"430\" r=\"32\" fill=\"#10b981\" stroke=\"#34d399\" stroke-width=\"2\"/>";
        svg << "<text x=\"180\" y=\"440\" font-size=\"26\" fill=\"#ffffff\" text-anchor=\"middle\">📞</text>";

        // 3. Backspace Button
        svg << "<circle cx=\"290\" cy=\"430\" r=\"26\" fill=\"#0f172a\" stroke=\"#1e293b\" stroke-width=\"1.5\"/>";
        svg << "<text x=\"290\" y=\"437\" font-size=\"18\" fill=\"#cbd5e1\" text-anchor=\"middle\">⌫</text>";

        svg << "</svg>";
        return svg.str();
    }

    // ── 2. PURE C++ UB SEVEN-SEGMENT VECTOR GENERATOR ──
    static std::string buildSevenSegmentSvg(const std::string& dialedNumber, int width = 360, int height = 80) {
        std::stringstream svg;
        svg << "<svg viewBox=\"0 0 " << width << " " << height << "\" width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\">";
        svg << "<rect width=\"" << width << "\" height=\"" << height << "\" rx=\"16\" fill=\"#000000\"/>";

        std::string text = dialedNumber.empty() ? "----" : dialedNumber;
        int len = (int)text.length();
        if (len < 4) len = 4;
        
        float digitHeight = height * 0.86f;
        float maxDigitW = (width - (len * 10.0f)) / (float)len;
        float digitWidth = std::min(digitHeight * 0.62f, maxDigitW);
        float gap = std::max(6.0f, digitWidth * 0.20f);
        float s = std::max(5.0f, digitWidth * 0.20f);
        
        float totalW = text.length() * (digitWidth + gap) - gap;
        float startX = (width - totalW) / 2.0f;
        float startY = (height - digitHeight) / 2.0f;

        for (char ch : text) {
            int mask = 0;
            switch (ch) {
                case '0': mask = 0b00111111; break;
                case '1': mask = 0b00000110; break;
                case '2': mask = 0b01011011; break;
                case '3': mask = 0b01001111; break;
                case '4': mask = 0b01100110; break;
                case '5': mask = 0b01101101; break;
                case '6': mask = 0b01111101; break;
                case '7': mask = 0b00000111; break;
                case '8': mask = 0b01111111; break;
                case '9': mask = 0b01101111; break;
                case '-': mask = 0b01000000; break;
                case '*': mask = 0b01110000; break;
                case '#': mask = 0b01110110; break;
            }

            float halfH = digitHeight / 2.0f;
            auto seg = [&](bool on, float x1, float y1, float w1, float h1, float rx1) {
                svg << "<rect x=\"" << x1 << "\" y=\"" << y1 << "\" width=\"" << w1 << "\" height=\"" << h1 << "\" rx=\"" << rx1 << "\" fill=\"" << (on ? "#10B981" : "#062E22") << "\"/>";
            };

            // A (Top)
            seg(mask & 1, startX + s, startY, digitWidth - 2*s, s, s/2);
            // B (Top-Right)
            seg(mask & 2, startX + digitWidth - s, startY + s, s, halfH - s, s/2);
            // C (Bottom-Right)
            seg(mask & 4, startX + digitWidth - s, startY + halfH, s, halfH - s, s/2);
            // D (Bottom)
            seg(mask & 8, startX + s, startY + digitHeight - s, digitWidth - 2*s, s, s/2);
            // E (Bottom-Left)
            seg(mask & 16, startX, startY + halfH, s, halfH - s, s/2);
            // F (Top-Left)
            seg(mask & 32, startX, startY + s, s, halfH - s, s/2);
            // G (Middle)
            seg(mask & 64, startX + s, startY + halfH - s/2, digitWidth - 2*s, s, s/2);

            startX += digitWidth + gap;
        }

        svg << "</svg>";
        return svg.str();
    }

    // ── 3. PURE C++ NATIVE SVG ICON GENERATOR ──
    static std::string buildIconSvg(const std::string& name, const std::string& strokeColor = "#38bdf8", int size = 48) {
        std::stringstream svg;
        svg << "<svg viewBox=\"0 0 24 24\" width=\"" << size << "\" height=\"" << size << "\" "
            << "fill=\"none\" stroke=\"" << strokeColor << "\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">";
        svg << DolphinUBEngine::renderNativeIcon(name);
        svg << "</svg>";
        return svg.str();
    }
};

} // namespace Danphe
