'use strict';

const fs = require('fs');
const path = require('path');
const { ICONS_256 } = require('../lib/TitanAdaptiveIcon');
const { EXTENDED_WEB_ICONS } = require('../lib/TitanExtendedIcons');

console.log('📦 Packing 550+ Danphe Vector Icons for Dolphin-CPP & Dolphin-Language...');

const allIcons = {};
const nameToId = {};

// 1. Bank 0x00: Telephony & Hardware (0 - 255)
for (const [idStr, item] of Object.entries(ICONS_256)) {
    const id = parseInt(idStr, 10);
    allIcons[id] = {
        id,
        name: item.name || 'icon_' + id,
        label: item.label || item.name,
        theme: item.theme || 'cyan',
        path: item.svg || ''
    };
    if (item.name) nameToId[item.name.toLowerCase()] = id;
}

// 2. Bank 0x01: Extended Web Suite (256 - 511+)
for (const [idStr, item] of Object.entries(EXTENDED_WEB_ICONS)) {
    const id = parseInt(idStr, 10);
    const cleanName = (item.name || 'icon_' + id).toLowerCase().replace(/[^a-z0-9_]/g, '_');
    allIcons[id] = {
        id,
        name: cleanName,
        label: item.name || 'Icon ' + id,
        theme: 'cyan',
        path: item.path || ''
    };
    nameToId[cleanName] = id;
}

const totalCount = Object.keys(allIcons).length;
console.log(`✅ Collected ${totalCount} unique vector icons.`);

// Write danphe_icons.json
const jsonPath = path.join(__dirname, '../danphe_icons.json');
fs.writeFileSync(jsonPath, JSON.stringify(allIcons, null, 2), 'utf8');
console.log(`📄 Wrote ${jsonPath}`);

// Generate include/danphe_icons.hpp
let cppHeader = `// 🦚 Danphe-UI Master Pure Vector Icons Suite: danphe_icons.hpp
// Generated for Dolphin-CPP & Native C++17
// Total Icons: ${totalCount} (0-255 Telephony/Hardware + 256-511 Extended Web/UI)
#pragma once
#include <string>
#include <unordered_map>
#include <sstream>
#include <cstdint>
#include <algorithm>

namespace DanpheUI {

class DanpheIcons {
public:
    static const int TOTAL_ICONS = ${totalCount};

    static std::string getIconPath(int id) {
        switch (id) {
`;

for (const [id, item] of Object.entries(allIcons)) {
    // Escape quotes and backslashes
    const escapedPath = (item.path || '')
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"');
    cppHeader += `            case ${id}: return "${escapedPath}";\n`;
}

cppHeader += `            default: return "";
        }
    }

    static int resolveName(const std::string& name) {
        static const std::unordered_map<std::string, int> nameMap = {
`;

for (const [name, id] of Object.entries(nameToId)) {
    cppHeader += `            {"${name}", ${id}},\n`;
}

cppHeader += `        };
        std::string lower = name;
        std::transform(lower.begin(), lower.end(), lower.begin(), ::tolower);
        auto it = nameMap.find(lower);
        if (it != nameMap.end()) return it->second;
        return 1; // Default
    }

    static std::string render(int id, int size = 32, bool circle = true, const std::string& customColor = "") {
        std::string pathData = getIconPath(id);
        if (pathData.empty()) pathData = getIconPath(1);

        std::string strokeColor = customColor.empty() ? "#38bdf8" : customColor;
        std::string glowColor = customColor.empty() ? "rgba(56,189,248,0.4)" : customColor;

        std::ostringstream ss;
        ss << "<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 32 32\\" width=\\"" << size << "\\" height=\\"" << size << "\\">\\n";
        if (circle) {
            ss << "  <circle cx=\\"16\\" cy=\\"16\\" r=\\"15\\" fill=\\"#030712\\" stroke=\\"" << strokeColor << "\\" stroke-opacity=\\"0.3\\" stroke-width=\\"1.2\\"/>\\n";
            ss << "  <circle cx=\\"16\\" cy=\\"16\\" r=\\"13.5\\" fill=\\"#0a1324\\" stroke=\\"" << strokeColor << "\\" stroke-width=\\"1.4\\"/>\\n";
        }
        ss << "  <g transform=\\"translate(4, 4)\\">\\n";
        ss << "    " << pathData << "\\n";
        ss << "  </g>\\n";
        ss << "</svg>";
        return ss.str();
    }

    static std::string render(const std::string& name, int size = 32, bool circle = true, const std::string& customColor = "") {
        return render(resolveName(name), size, circle, customColor);
    }
};

inline std::string Icon(int id, int size = 32, bool circle = true, const std::string& color = "") {
    return DanpheIcons::render(id, size, circle, color);
}

inline std::string Icon(const std::string& name, int size = 32, bool circle = true, const std::string& color = "") {
    return DanpheIcons::render(name, size, circle, color);
}

} // namespace DanpheUI
`;

const hppPath = path.join(__dirname, '../include/danphe_icons.hpp');
fs.writeFileSync(hppPath, cppHeader, 'utf8');
console.log(`📄 Wrote ${hppPath} (${Math.round(cppHeader.length / 1024)} KB)`);

console.log('🎉 Done packing icons for Dolphin-CPP!');
