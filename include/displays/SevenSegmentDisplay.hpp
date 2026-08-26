#pragma once
#include "ub.hpp"
#include <string>
#include <vector>
#include <sstream>

namespace DanpheUI {

class SevenSegmentDisplay {
public:
    // Segments: a, b, c, d, e, f, g, dp
    //     aaa
    //    f   b
    //     ggg
    //    e   c
    //     ddd  dp
    static uint8_t encodeDigit(char ch) {
        switch (ch) {
            case '0': return 0b00111111;
            case '1': return 0b00000110;
            case '2': return 0b01011011;
            case '3': return 0b01001111;
            case '4': return 0b01100110;
            case '5': return 0b01101101;
            case '6': return 0b01111101;
            case '7': return 0b00000111;
            case '8': return 0b01111111;
            case '9': return 0b01101111;
            case '-': return 0b01000000;
            case ' ': return 0b00000000;
            case 'E': return 0b01111001;
            case 'r': return 0b01010000;
            default:  return 0b00000000;
        }
    }

    static std::string renderSVGDigit(char ch, const std::string& activeColor = "#ef4444", const std::string& inactiveColor = "#220808") {
        uint8_t mask = encodeDigit(ch);
        std::stringstream ss;
        ss << "<svg viewBox=\"0 0 60 100\" width=\"42\" height=\"70\" class=\"seven-segment\">";
        
        // Segment A
        ss << "<polygon points=\"12,10 48,10 42,16 18,16\" fill=\"" << ((mask & 0b00000001) ? activeColor : inactiveColor) << "\"/>";
        // Segment B
        ss << "<polygon points=\"50,12 50,46 44,42 44,18\" fill=\"" << ((mask & 0b00000010) ? activeColor : inactiveColor) << "\"/>";
        // Segment C
        ss << "<polygon points=\"50,54 50,88 44,82 44,58\" fill=\"" << ((mask & 0b00000100) ? activeColor : inactiveColor) << "\"/>";
        // Segment D
        ss << "<polygon points=\"12,90 48,90 42,84 18,84\" fill=\"" << ((mask & 0b00001000) ? activeColor : inactiveColor) << "\"/>";
        // Segment E
        ss << "<polygon points=\"10,54 10,88 16,82 16,58\" fill=\"" << ((mask & 0b00010000) ? activeColor : inactiveColor) << "\"/>";
        // Segment F
        ss << "<polygon points=\"10,12 10,46 16,42 16,18\" fill=\"" << ((mask & 0b00100000) ? activeColor : inactiveColor) << "\"/>";
        // Segment G
        ss << "<polygon points=\"14,50 46,50 42,46 18,46\" fill=\"" << ((mask & 0b01000000) ? activeColor : inactiveColor) << "\"/>";
        
        ss << "</svg>";
        return ss.str();
    }

    static std::string renderDisplay(const std::string& text, const std::string& color = "red") {
        std::stringstream ss;
        std::string activeHex = (color == "amber" || color == "gold") ? "#f59e0b" : (color == "cyan") ? "#06b6d4" : (color == "emerald") ? "#10b981" : "#ef4444";
        std::string inactiveHex = (color == "amber" || color == "gold") ? "#291b00" : (color == "cyan") ? "#022026" : (color == "emerald") ? "#022619" : "#220808";

        ss << "<div class=\"flex-row items-center justify-center p-3 bg-black rounded-2xl border-2 border-slate-900 shadow-2xl\">";
        for (char ch : text) {
            ss << renderSVGDigit(ch, activeHex, inactiveHex);
        }
        ss << "</div>";
        return ss.str();
    }
};

}
