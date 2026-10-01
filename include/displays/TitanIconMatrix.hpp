#pragma once
#include "../ub.hpp"
#include <string>
#include <vector>
#include <sstream>
#include <cstdint>

namespace DanpheUI {

/**
 * 🐬 TitanIconMatrix
 * C++17 Bitmask & Titan Bus Controlled Switchable Status Indicators
 * Converts 0b0010, 0x0F, uint32_t register masks into SVG / OKLCH Glow Icons.
 */
class TitanIconMatrix {
public:
    struct IconItem {
        std::string name;
        std::string label;
        std::string activeColor; // "emerald", "cyan", "amber", "red", "purple"
    };

    static std::vector<IconItem> getDefaultIcons() {
        return {
            {"wifi",     "WIFI",    "cyan"},
            {"cpu",      "CPU",     "emerald"},
            {"battery",  "BATT",    "amber"},
            {"server",   "SRV",     "purple"},
            {"shield",   "SEC",     "emerald"},
            {"zap",      "PWR",     "amber"},
            {"bell",     "ALARM",   "red"},
            {"database", "DB",      "cyan"}
        };
    }

    static std::string renderSVGIcon(const std::string& iconName, bool isActive, const std::string& theme = "emerald", int size = 24) {
        std::string pathData = DolphinUBEngine::renderNativeIcon(iconName);
        
        std::string strokeColor = isActive 
            ? (theme == "cyan" ? "#22d3ee" : theme == "amber" ? "#fbbf24" : theme == "red" ? "#f87171" : theme == "purple" ? "#c084fc" : "#34d399")
            : "#475569";
        
        std::string filterGlow = isActive 
            ? "filter: drop-shadow(0px 0px 6px " + strokeColor + ");" 
            : "";

        std::stringstream ss;
        ss << "<svg viewBox=\"0 0 24 24\" width=\"" << size << "\" height=\"" << size << "\" fill=\"none\" "
           << "stroke=\"" << strokeColor << "\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" "
           << "style=\"" << filterGlow << " transition: all 0.25s ease;\">"
           << pathData
           << "</svg>";
        return ss.str();
    }

    /**
     * Render a hardware bit-switch indicator bar from bitmask (e.g. 0b0010)
     */
    static std::string renderBitBar(uint32_t bitmask, const std::vector<IconItem>& icons = getDefaultIcons()) {
        std::stringstream ss;
        ss << "<div class=\"titan-bit-matrix flex flex-row items-center gap-2 p-3 bg-slate-950/90 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-xl\">\n";

        for (size_t i = 0; i < icons.size(); ++i) {
            bool isActive = (bitmask & (1 << i)) != 0;
            const auto& item = icons[i];

            std::string cardBorder = isActive 
                ? (item.activeColor == "cyan" ? "border-cyan-500/80 bg-cyan-950/40 shadow-[0_0_12px_rgba(6,182,212,0.4)]" :
                   item.activeColor == "amber" ? "border-amber-500/80 bg-amber-950/40 shadow-[0_0_12px_rgba(245,158,11,0.4)]" :
                   item.activeColor == "red" ? "border-red-500/80 bg-red-950/40 shadow-[0_0_12px_rgba(239,68,68,0.4)]" :
                   item.activeColor == "purple" ? "border-purple-500/80 bg-purple-950/40 shadow-[0_0_12px_rgba(168,85,247,0.4)]" :
                   "border-emerald-500/80 bg-emerald-950/40 shadow-[0_0_12px_rgba(16,185,129,0.4)]")
                : "border-slate-800/60 bg-slate-900/30 opacity-40";

            std::string textCol = isActive ? "text-slate-100 font-bold" : "text-slate-500";

            ss << "  <div class=\"flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 " << cardBorder << "\" style=\"min-width: 52px;\">\n"
               << "    " << renderSVGIcon(item.name, isActive, item.activeColor, 22) << "\n"
               << "    <span class=\"text-[10px] mt-1 tracking-wider " << textCol << "\">" << item.label << "</span>\n"
               << "    <span class=\"text-[8px] font-mono " << (isActive ? "text-emerald-400" : "text-slate-600") << "\">B" << i << ":" << (isActive ? "1" : "0") << "</span>\n"
               << "  </div>\n";
        }

        ss << "</div>\n";
        return ss.str();
    }
};

} // namespace DanpheUI
