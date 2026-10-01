'use strict';

function renderDanpheWorkspaceSwitcher(activeTab = 'edit') {
    const tabs = [
        { id: 'edit', label: 'EDIT', icon: '🎬' },
        { id: 'color', label: 'COLOR', icon: '🎨' },
        { id: 'motion', label: 'MOTION / FX', icon: '✨' },
        { id: 'audio', label: 'FAIRLIGHT', icon: '🎙️' },
        { id: 'deliver', label: 'DELIVER', icon: '🚀' }
    ];

    return `<div class="header-center-workspaces">
${tabs.map(t => `        <button type="button" class="ws-pill-btn${t.id === activeTab ? ' active' : ''}" onclick="switchNLEWorkspace('${t.id}')">${t.icon} ${t.label}</button>`).join('\n')}
    </div>`;
}

module.exports = {
    renderDanpheWorkspaceSwitcher,
    DanpheWorkspaceSwitcher: renderDanpheWorkspaceSwitcher
};
