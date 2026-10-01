// 🦚 Danphe-UI C++17 Header: WorkspaceSwitcher.hpp
#pragma once
#include <string>
#include <vector>

namespace DanpheUI {
    struct WorkspaceTab {
        std::string id;
        std::string label;
        std::string icon;
        bool isActive;
    };

    inline std::string renderWorkspaceSwitcher(const std::string& activeTab = "edit") {
        std::vector<WorkspaceTab> tabs = {
            {"edit", "EDIT", "🎬", activeTab == "edit"},
            {"color", "COLOR", "🎨", activeTab == "color"},
            {"motion", "MOTION / FX", "✨", activeTab == "motion"},
            {"audio", "FAIRLIGHT", "🎙️", activeTab == "audio"},
            {"deliver", "DELIVER", "🚀", activeTab == "deliver"}
        };

        std::string html = "<div class=\"header-center-workspaces\">\n";
        for (const auto& tab : tabs) {
            std::string activeClass = tab.isActive ? " active" : "";
            html += "    <button type=\"button\" class=\"ws-pill-btn" + activeClass + 
                    "\" onclick=\"switchNLEWorkspace('" + tab.id + "')\">" + 
                    tab.icon + " " + tab.label + "</button>\n";
        }
        html += "</div>";
        return html;
    }
}
