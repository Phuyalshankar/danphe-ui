#pragma once
#include "ub.hpp"
#include <string>
#include <vector>
#include <sstream>

namespace DanpheNativeVector {

class SevenSegment {
public:
    static uint8_t getMask(char ch) {
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
            default:  return 0b00000000;
        }
    }

    static std::string renderSVG(const std::string& input, const std::string& theme = "red") {
        std::string onColor = (theme == "amber") ? "#f59e0b" : (theme == "cyan") ? "#06b6d4" : (theme == "emerald") ? "#10b981" : "#ef4444";
        std::string offColor = (theme == "amber") ? "#291b00" : (theme == "cyan") ? "#022026" : (theme == "emerald") ? "#022619" : "#220808";

        int totalWidth = (int)input.length() * 45 + 10;
        if (totalWidth < 50) totalWidth = 50;

        std::stringstream ss;
        ss << "<svg viewBox=\"0 0 " << totalWidth << " 80\" height=\"50\" class=\"danphe-7seg\">";

        int xOffset = 5;
        for (char ch : input) {
            uint8_t m = getMask(ch);
            ss << "<polygon points=\"" << (xOffset+8) << ",8 " << (xOffset+32) << ",8 " << (xOffset+28) << ",13 " << (xOffset+12) << ",13\" fill=\"" << ((m & 0b00000001) ? onColor : offColor) << "\"/>";
            ss << "<polygon points=\"" << (xOffset+34) << ",10 " << (xOffset+34) << ",36 " << (xOffset+29) << ",32 " << (xOffset+29) << ",15\" fill=\"" << ((m & 0b00000010) ? onColor : offColor) << "\"/>";
            ss << "<polygon points=\"" << (xOffset+34) << ",42 " << (xOffset+34) << ",68 " << (xOffset+29) << ",63 " << (xOffset+29) << ",46\" fill=\"" << ((m & 0b00000100) ? onColor : offColor) << "\"/>";
            ss << "<polygon points=\"" << (xOffset+8) << ",70 " << (xOffset+32) << ",70 " << (xOffset+28) << ",65 " << (xOffset+12) << ",65\" fill=\"" << ((m & 0b00001000) ? onColor : offColor) << "\"/>";
            ss << "<polygon points=\"" << (xOffset+6) << ",42 " << (xOffset+6) << ",68 " << (xOffset+11) << ",63 " << (xOffset+11) << ",46\" fill=\"" << ((m & 0b00010000) ? onColor : offColor) << "\"/>";
            ss << "<polygon points=\"" << (xOffset+6) << ",10 " << (xOffset+6) << ",36 " << (xOffset+11) << ",32 " << (xOffset+11) << ",15\" fill=\"" << ((m & 0b00100000) ? onColor : offColor) << "\"/>";
            ss << "<polygon points=\"" << (xOffset+10) << ",39 " << (xOffset+30) << ",39 " << (xOffset+27) << ",36 " << (xOffset+13) << ",36\" fill=\"" << ((m & 0b01000000) ? onColor : offColor) << "\"/>";
            xOffset += 45;
        }

        ss << "</svg>";
        return ss.str();
    }
};

}
