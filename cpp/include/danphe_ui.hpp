// 🦚 Danphe-UI C++17 Master Suite: danphe_ui.hpp
#pragma once
#include <string>
#include <vector>
#include <sstream>
#include "WorkspaceSwitcher.hpp"

namespace DanpheUI {
    const std::string VERSION = "19.0.0-PRO";
    const uint16_t TITAN_BUS_SIGNATURE = 0x5442;

    // 1. Workspace Switcher Component
    inline std::string WorkspaceSwitcher(const std::string& active = "edit") {
        return renderWorkspaceSwitcher(active);
    }

    // 2. 5-Button Gyroscope Media Importer Component
    inline std::string CircularImporter() {
        return R"(
        <div class="radial-importer-strip">
            <div class="strip-title">⚡ DANPHE-UI GYRO MEDIA IMPORTER</div>
            <div class="titan-circular-button-group">
                <div class="laser-orbit-ring"></div>
                <div class="inner-metallic-ring"></div>

                <button type="button" class="satellite-btn btn-top" onclick="triggerDanpheImport('video')" title="Import 4K Video">
                    <svg viewBox="0 0 24 24"><use href="#color_lut_cube"/></svg>
                    <span class="btn-sub-lbl">VID</span>
                </button>
                <button type="button" class="satellite-btn btn-left" onclick="triggerDanpheImport('photo')" title="Import Photos / RAW">
                    <svg viewBox="0 0 24 24"><use href="#color_exposure"/></svg>
                    <span class="btn-sub-lbl">RAW</span>
                </button>
                <button type="button" class="satellite-btn btn-right" onclick="triggerDanpheImport('audio')" title="Import 48kHz Audio">
                    <svg viewBox="0 0 24 24"><use href="#audio_mic_record"/></svg>
                    <span class="btn-sub-lbl">AUD</span>
                </button>
                <button type="button" class="satellite-btn btn-bottom" onclick="triggerDanpheImport('vfx')" title="Import Shaders & VFX">
                    <svg viewBox="0 0 24 24"><use href="#ai_trendy_vfx"/></svg>
                    <span class="btn-sub-lbl">VFX</span>
                </button>
                <button type="button" class="master-core-btn" id="danphe-master-core" onclick="triggerDanpheCoreScan()" title="Scan & Sync Media Pool">
                    <svg viewBox="0 0 32 32"><use href="#danphe-logo"/></svg>
                    <span class="core-sub-lbl">SCAN</span>
                </button>
            </div>
        </div>
        )";
    }

    // 3. Pro Hardware Slider Component
    inline std::string ProSlider(const std::string& id, const std::string& label, int min, int max, int val, const std::string& unit, const std::string& color = "cyan") {
        float percent = (float)(val - min) / (float)(max - min) * 100.0f;
        std::ostringstream ss;
        ss << "<div class=\"danphe-pro-slider-group\" id=\"slider-grp-" << id << "\">\n"
           << "    <div class=\"slider-header-row\">\n"
           << "        <span class=\"slider-title-txt\">" << label << "</span>\n"
           << "        <span class=\"slider-val-badge\" id=\"val-badge-" << id << "\">" << val << " " << unit << "</span>\n"
           << "    </div>\n"
           << "    <div class=\"danphe-slider-track\" onmousedown=\"startDanpheSliderDrag(event, '" << id << "', " << min << ", " << max << ", '" << unit << "')\">\n"
           << "        <div class=\"danphe-slider-fill " << color << "\" id=\"fill-" << id << "\" style=\"width: " << percent << "%;\"></div>\n"
           << "        <div class=\"danphe-slider-knob\" id=\"knob-" << id << "\" style=\"left: " << percent << "%;\"></div>\n"
           << "    </div>\n"
           << "</div>\n";
        return ss.str();
    }
}
