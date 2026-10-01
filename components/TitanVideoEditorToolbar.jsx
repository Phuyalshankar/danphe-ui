'use strict';

/**
 * 🎬 TitanVideoEditorToolbar - World-Class NLE Toolbar Component
 * Professional video editing toolbar matching DaVinci Resolve, Premiere Pro, Final Cut Pro
 * Features: Tool palette, transport controls, timeline zoom, magnetic snapping
 */

const React = require('react');
const { renderAdaptiveIconSVG, TITAN_ICON } = require('../lib/TitanAdaptiveIcon');

const EDITOR_TOOLS = {
    SELECTION: { id: 'v', icon: TITAN_ICON.WEB.ARROW_UP, label: 'Selection (V)', color: '#38bdf8', key: 'V' },
    HAND: { id: 'h', icon: TITAN_ICON.WEB.HAND, label: 'Hand Pan (H)', color: '#94a3b8', key: 'H' },
    ZOOM: { id: 'z', icon: TITAN_ICON.WEB.SEARCH, label: 'Zoom (Z)', color: '#94a3b8', key: 'Z' },
    RAZOR: { id: 'c', icon: TITAN_ICON.VIDEO.RAZOR, label: 'Razor Split (C)', color: '#ef4444', key: 'C' },
    TRIM_LEFT: { id: 'q', icon: TITAN_ICON.VIDEO.TRIM_LEFT, label: 'Trim Left (Q)', color: '#f87171', key: 'Q' },
    TRIM_RIGHT: { id: 'w', icon: TITAN_ICON.VIDEO.TRIM_RIGHT, label: 'Trim Right (W)', color: '#f87171', key: 'W' },
    RATE_STRETCH: { id: 'x', icon: TITAN_ICON.VIDEO.SPEED_RAMP, label: 'Rate Stretch (X)', color: '#facc15', key: 'X' },
    TEXT: { id: 't', icon: TITAN_ICON.VIDEO.SUBTITLE, label: 'Type Text (T)', color: '#38bdf8', key: 'T' },
    DELETE: { id: 'del', icon: TITAN_ICON.WEB.TRASH, label: 'Delete (Del)', color: '#ef4444', key: 'Del' }
};

const AI_TOOLS = [
    { id: 'captions', icon: TITAN_ICON.VIDEO.SUBTITLE, label: 'Auto Captions', color: '#38bdf8' },
    { id: 'speed', icon: TITAN_ICON.VIDEO.SPEED_RAMP, label: 'Speed Curve', color: '#c084fc' },
    { id: 'cutout', icon: TITAN_ICON.VIDEO.MASK_TOOL, label: 'AI Cutout', color: '#4ade80' },
    { id: 'keyframe', icon: TITAN_ICON.VIDEO.KEYFRAME, label: 'Add Keyframe', color: '#facc15' }
];

const TitanVideoEditorToolbar = ({
    activeTool = 'v',
    onToolChange = null,
    onUndo = null,
    onRedo = null,
    onAITool = null,
    onToggleSnap = null,
    onZoomChange = null,
    magneticSnap = true,
    zoomLevel = 100,
    fps = 60,
    className = ''
}) => {
    const handleToolClick = (toolId) => {
        if (onToolChange) onToolChange(toolId);
    };

    const handleZoom = (delta) => {
        const newZoom = Math.max(50, Math.min(300, zoomLevel + delta));
        if (onZoomChange) onZoomChange(newZoom);
    };

    return (
        <div className={`titan-video-toolbar ${className}`} style={{
            height: '40px',
            minHeight: '40px',
            maxHeight: '40px',
            background: 'linear-gradient(180deg, #0d1527 0%, #090e1c 100%)',
            borderTop: '1px solid #1e293b',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px',
            gap: '12px',
            width: '100%',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
            {/* History Controls */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: '#040814',
                padding: '4px',
                borderRadius: '8px',
                border: '1px solid #1e293b'
            }}>
                <button
                    onClick={onUndo}
                    title="Undo (Ctrl+Z)"
                    style={{
                        width: '28px',
                        height: '28px',
                        background: '#0f172a',
                        border: '1px solid #1e293b',
                        borderRadius: '6px',
                        color: '#38bdf8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = '#1e293b';
                        e.currentTarget.style.borderColor = '#38bdf8';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = '#0f172a';
                        e.currentTarget.style.borderColor = '#1e293b';
                    }}
                    dangerouslySetInnerHTML={{ __html: renderAdaptiveIconSVG(TITAN_ICON.WEB.ARROW_LEFT, false, 'cyan', 16) }}
                />
                <button
                    onClick={onRedo}
                    title="Redo (Ctrl+Y)"
                    style={{
                        width: '28px',
                        height: '28px',
                        background: '#0f172a',
                        border: '1px solid #1e293b',
                        borderRadius: '6px',
                        color: '#38bdf8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = '#1e293b';
                        e.currentTarget.style.borderColor = '#38bdf8';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = '#0f172a';
                        e.currentTarget.style.borderColor = '#1e293b';
                    }}
                    dangerouslySetInnerHTML={{ __html: renderAdaptiveIconSVG(TITAN_ICON.WEB.ARROW_RIGHT, false, 'cyan', 16) }}
                />
            </div>

            {/* Core Editing Tools Palette */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                background: '#040814',
                padding: '4px',
                borderRadius: '8px',
                border: '1px solid #1e293b'
            }}>
                {Object.values(EDITOR_TOOLS).map(tool => {
                    const isActive = activeTool === tool.id;
                    return (
                        <button
                            key={tool.id}
                            onClick={() => handleToolClick(tool.id)}
                            title={tool.label}
                            style={{
                                width: '32px',
                                height: '32px',
                                background: isActive ? '#0284c7' : '#0f172a',
                                border: `1px solid ${isActive ? '#38bdf8' : '#1e293b'}`,
                                borderRadius: '6px',
                                color: isActive ? '#fff' : tool.color,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.15s',
                                boxShadow: isActive ? '0 0 12px rgba(56, 189, 248, 0.5)' : 'none',
                                position: 'relative'
                            }}
                            onMouseEnter={e => {
                                if (!isActive) {
                                    e.currentTarget.style.background = '#1e293b';
                                    e.currentTarget.style.borderColor = '#334155';
                                }
                            }}
                            onMouseLeave={e => {
                                if (!isActive) {
                                    e.currentTarget.style.background = '#0f172a';
                                    e.currentTarget.style.borderColor = '#1e293b';
                                }
                            }}
                            dangerouslySetInnerHTML={{ __html: renderAdaptiveIconSVG(tool.icon, isActive, 'cyan', 18) }}
                        />
                    );
                })}
            </div>

            {/* AI Smart Tools */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
            }}>
                {AI_TOOLS.map(tool => (
                    <button
                        key={tool.id}
                        onClick={() => onAITool && onAITool(tool.id)}
                        title={tool.label}
                        style={{
                            height: '32px',
                            padding: '0 12px',
                            background: '#0f172a',
                            border: `1px solid rgba(56, 189, 248, 0.3)`,
                            borderRadius: '6px',
                            color: '#e2e8f0',
                            fontSize: '10px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = '#0284c7';
                            e.currentTarget.style.borderColor = '#38bdf8';
                            e.currentTarget.style.boxShadow = '0 0 12px rgba(56, 189, 248, 0.6)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = '#0f172a';
                            e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <span dangerouslySetInnerHTML={{ __html: renderAdaptiveIconSVG(tool.icon, false, tool.color.replace('#', ''), 14) }} />
                        <span>{tool.label}</span>
                    </button>
                ))}
            </div>

            {/* Timeline Controls */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginLeft: 'auto'
            }}>
                {/* Magnetic Snap Toggle */}
                <button
                    onClick={onToggleSnap}
                    title={`Magnetic Snapping: ${magneticSnap ? 'ON' : 'OFF'} (N)`}
                    style={{
                        width: '32px',
                        height: '32px',
                        background: magneticSnap ? '#0284c7' : '#0f172a',
                        border: `1px solid ${magneticSnap ? '#38bdf8' : '#1e293b'}`,
                        borderRadius: '6px',
                        color: magneticSnap ? '#fff' : '#10b981',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s',
                        boxShadow: magneticSnap ? '0 0 12px rgba(56, 189, 248, 0.5)' : 'none'
                    }}
                    dangerouslySetInnerHTML={{ __html: renderAdaptiveIconSVG(TITAN_ICON.VIDEO.MAGNET, magneticSnap, 'emerald', 18) }}
                />

                {/* Zoom Controls */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#0b1120',
                    border: '1px solid #1e293b',
                    padding: '4px 8px',
                    borderRadius: '8px'
                }}>
                    <button
                        onClick={() => handleZoom(-25)}
                        title="Zoom Out (-)"
                        style={{
                            width: '24px',
                            height: '24px',
                            background: '#0f172a',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >−</button>
                    
                    <input
                        type="range"
                        min="50"
                        max="300"
                        value={zoomLevel}
                        step="5"
                        onChange={e => onZoomChange && onZoomChange(parseInt(e.target.value))}
                        title="Timeline Zoom"
                        style={{
                            width: '80px',
                            height: '6px',
                            accentColor: '#38bdf8',
                            cursor: 'pointer'
                        }}
                    />
                    
                    <button
                        onClick={() => handleZoom(25)}
                        title="Zoom In (+)"
                        style={{
                            width: '24px',
                            height: '24px',
                            background: '#0f172a',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >+</button>
                    
                    <span style={{
                        fontFamily: 'monospace',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: '#38bdf8',
                        minWidth: '38px',
                        textAlign: 'right'
                    }}>{zoomLevel}%</span>
                    
                    <button
                        onClick={() => onZoomChange && onZoomChange(100)}
                        title="Fit to Screen (Shift+Z)"
                        style={{
                            width: '24px',
                            height: '24px',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        dangerouslySetInnerHTML={{ __html: renderAdaptiveIconSVG(TITAN_ICON.WEB.EXPAND, false, 'amber', 16) }}
                    />
                </div>

                {/* FPS Badge */}
                <div style={{
                    background: '#1e293b',
                    color: '#38bdf8',
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    fontWeight: '800',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid #334155',
                    letterSpacing: '0.5px'
                }}>
                    {fps} FPS
                </div>
            </div>
        </div>
    );
};

module.exports = { TitanVideoEditorToolbar, EDITOR_TOOLS, AI_TOOLS };
module.exports.default = TitanVideoEditorToolbar;
