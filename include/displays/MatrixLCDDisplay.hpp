#pragma once
#include <string>
#include <sstream>

namespace DanpheUI {

class MatrixLCDDisplay {
public:
    static std::string renderLCD(const std::string& line1, const std::string& line2 = "", const std::string& theme = "emerald") {
        std::string bg = (theme == "blue") ? "bg-cyan-950/90 border-cyan-500/40 text-cyan-300" : 
                         (theme == "amber") ? "bg-amber-950/90 border-amber-500/40 text-amber-300" :
                         "bg-emerald-950/90 border-emerald-500/40 text-emerald-400";
        
        std::stringstream ss;
        ss << "<div class=\"flex-col p-3.5 rounded-2xl border-2 shadow-inner " << bg << " w-full font-mono font-bold tracking-widest\">";
        ss << "  <div class=\"text-lg font-black tracking-wider text-left\">" << (line1.empty() ? " " : line1) << "</div>";
        if (!line2.empty()) {
            ss << "  <div class=\"text-xs opacity-75 mt-1 tracking-widest text-left\">" << line2 << "</div>";
        }
        ss << "</div>";
        return ss.str();
    }
};

}
