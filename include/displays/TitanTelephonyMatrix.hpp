#pragma once
#include "../ub.hpp"
#include <string>
#include <vector>
#include <sstream>
#include <cstdint>

namespace DanpheUI {

/**
 * 📞 TitanTelephonyMatrix
 * Ultra-Clean Rounded World-Class Icon Dock for C++ / Dolphin UB (Text-Free)
 */
class TitanTelephonyMatrix {
public:
    static std::string renderIncomingCallSVG(bool active) {
        std::string stroke = active ? "#34d399" : "#64748b";
        std::string anim = active ? "class=\"animate-bounce\"" : "";
        return "<svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"" + stroke + "\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">"
               "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"/>"
               "<polyline points=\"16 2 20 6 16 10\" " + anim + " stroke=\"" + (active ? "#6ee7b7" : "#64748b") + "\" stroke-width=\"2.5\"/>"
               "<line x1=\"20\" y1=\"6\" x2=\"11\" y2=\"15\" stroke=\"" + (active ? "#6ee7b7" : "#64748b") + "\" stroke-width=\"2.5\"/>"
               "</svg>";
    }

    static std::string renderIncomingVideoCallSVG(bool active) {
        std::string stroke = active ? "#c084fc" : "#64748b";
        return "<svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"" + stroke + "\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">"
               "<polygon points=\"23 7 16 12 23 17 23 7\" fill=\"" + (active ? "rgba(192,132,252,0.3)" : "none") + "\"/>"
               "<rect x=\"1\" y=\"5\" width=\"15\" height=\"14\" rx=\"2\" ry=\"2\"/>"
               "<polyline points=\"10 9 10 13 6 13\" stroke=\"" + (active ? "#38bdf8" : "#64748b") + "\" stroke-width=\"2.5\"/>"
               "<line x1=\"10\" y1=\"13\" x2=\"5\" y2=\"8\" stroke=\"" + (active ? "#38bdf8" : "#64748b") + "\" stroke-width=\"2.5\"/>"
               "</svg>";
    }

    static std::string renderOutgoingCallSVG(bool active) {
        std::string stroke = active ? "#fbbf24" : "#64748b";
        return "<svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"" + stroke + "\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">"
               "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"/>"
               "<polyline points=\"20 10 20 4 14 4\" stroke=\"" + (active ? "#fde047" : "#64748b") + "\" stroke-width=\"2.5\"/>"
               "<line x1=\"13\" y1=\"11\" x2=\"20\" y2=\"4\" stroke=\"" + (active ? "#fde047" : "#64748b") + "\" stroke-width=\"2.5\"/>"
               "</svg>";
    }

    static std::string renderMissedCallSVG(bool active, int missedCount = 0) {
        std::string stroke = active ? "#f87171" : "#64748b";
        std::stringstream ss;
        ss << "<div class=\"relative flex items-center justify-center\">"
           << "<svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"" << stroke << "\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">"
           << "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"/>"
           << "<line x1=\"22\" y1=\"2\" x2=\"16\" y2=\"8\" stroke=\"" << (active ? "#ef4444" : "#64748b") << "\" stroke-width=\"2.8\"/>"
           << "<line x1=\"16\" y1=\"2\" x2=\"22\" y2=\"8\" stroke=\"" << (active ? "#ef4444" : "#64748b") << "\" stroke-width=\"2.8\"/>"
           << "</svg>";
        
        if (active && missedCount > 0) {
            ss << "<span class=\"absolute -top-2.5 -right-3 px-1.5 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-full border border-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.9)] animate-pulse leading-none min-w-[18px] text-center\">"
               << missedCount << "</span>";
        }
        ss << "</div>";
        return ss.str();
    }

    static std::string renderChatUnreadSVG(bool active) {
        std::string stroke = active ? "#22d3ee" : "#64748b";
        return "<svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"" + stroke + "\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"" + (active ? "animate-pulse" : "") + "\">"
               "<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\" fill=\"" + (active ? "rgba(34,211,238,0.25)" : "none") + "\"/>"
               "<circle cx=\"8\" cy=\"10\" r=\"1.2\" fill=\"" + (active ? "#22d3ee" : "#64748b") + "\"/>"
               "<circle cx=\"12\" cy=\"10\" r=\"1.2\" fill=\"" + (active ? "#22d3ee" : "#64748b") + "\"/>"
               "<circle cx=\"16\" cy=\"10\" r=\"1.2\" fill=\"" + (active ? "#22d3ee" : "#64748b") + "\"/>"
               "</svg>";
    }

    /**
     * Render clean rounded circular icon dock
     */
    static std::string renderTelephonyBar(uint8_t bitmask, uint8_t missedCount = 0) {
        std::stringstream ss;
        ss << "<div class=\"flex items-center justify-center w-full p-2.5 bg-black/60 rounded-full border border-slate-800 shadow-2xl backdrop-blur-2xl\">\n"
           << "  <div class=\"flex items-center justify-center gap-3 flex-wrap\">\n";

        bool isIncomingVoice = (bitmask & (1 << 0)) != 0;
        bool isIncomingVideo = (bitmask & (1 << 1)) != 0;
        bool isOutgoing      = (bitmask & (1 << 2)) != 0;
        bool isMissed        = (bitmask & (1 << 3)) != 0;
        bool isUnreadChat    = (bitmask & (1 << 7)) != 0;

        auto wrapRounded = [](const std::string& svgHtml, bool active, const std::string& activeCls) {
            std::string cls = active 
                ? activeCls + " border-2" 
                : "bg-slate-900/60 border border-slate-800 text-slate-500 hover:text-slate-300 opacity-40 hover:opacity-100";
            return "<div class=\"relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200 cursor-pointer " + cls + "\">" + svgHtml + "</div>";
        };

        ss << wrapRounded(renderIncomingCallSVG(isIncomingVoice), isIncomingVoice, "bg-emerald-950/70 border-emerald-400 text-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.55)] scale-110")
           << wrapRounded(renderIncomingVideoCallSVG(isIncomingVideo), isIncomingVideo, "bg-purple-950/70 border-purple-400 text-purple-300 shadow-[0_0_18px_rgba(192,132,252,0.55)] scale-110")
           << wrapRounded(renderOutgoingCallSVG(isOutgoing), isOutgoing, "bg-amber-950/70 border-amber-400 text-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.55)] scale-110")
           << wrapRounded(renderMissedCallSVG(isMissed, missedCount), isMissed, "bg-rose-950/70 border-rose-400 text-rose-300 shadow-[0_0_18px_rgba(244,63,94,0.55)] scale-110")
           << wrapRounded(renderChatUnreadSVG(isUnreadChat), isUnreadChat, "bg-cyan-950/70 border-cyan-400 text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.55)] scale-110");

        ss << "  </div>\n</div>\n";
        return ss.str();
    }
};

} // namespace DanpheUI
