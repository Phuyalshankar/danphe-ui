'use strict';

/**
 * 🎞️ TitanProTimelineTrack - Professional Timeline Track Header
 * DaVinci Resolve / Premiere Pro style track controls
 * Features: Lock, Solo, Mute, Visibility, Track type icons, Color coding
 */

const React = require('react');
const { renderAdaptiveIconSVG, TITAN_ICON } = require('../lib/TitanAdaptiveIcon');

const TRACK_TYPES = {
    VIDEO: { icon: TITAN_ICON.VIDEO.TRACK_VIDEO, label: 'Video', baseColor: '#38bdf8' },
    AUDIO: { icon: TITAN_ICON.VIDEO.TRACK_AUDIO, label: 'Audio', baseColor: '#4ade80' },
    TEXT: { icon: TITAN_ICON.VIDEO.TRACK_TEXT, label: 'Text/Titles', baseColor: '#facc15' }
};

const TitanProTimelineTrack = ({
    trackId = 'V1',
    trackName = 'Video Track 1',
    trackType = 'VIDEO',
    color = '#38bdf8',
    locked = false,
    muted = false,
    solo = false,
    visible = true,
    height = 48,
    onToggleLock = null,
    onToggleMute = null,
    onToggleSolo = null,
    onToggleVisible = null,
    onTrackSelect = null,
    className = ''
}) => {
    const typeInfo = TRACK_TYPES[trackType] || TRACK_TYPES.VIDEO;

    const ControlButton = ({ icon, active, activeColor, onClick, title }) => (
        <button
            onClick={onClick}
            title={title}
            style={{
                width: '22px',
                height: '22px',
                background: active ? activeColor : 'transparent',
                border: `1px solid ${active ? activeColor : '#1e293b'}`,
                borderRadius: '4px',
                color: active ? '#fff' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
                fontSize: '10px',
                fontWeight: '700',
                padding: 0
            }}
            onMouseEnter={e => {
                if (!active) {
                    e.currentTarget.style.background = '#1e293b';
                    e.currentTarget.style.borderColor = '#334155';
                    e.currentTarget.style.color = '#94a3b8';
                }
            }}
            onMouseLeave={e => {
                if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = '#1e293b';
                    e.currentTarget.style.color = '#64748b';
                }
            }}
            dangerouslySetInnerHTML={{ __html: renderAdaptiveIconSVG(icon, active, activeColor.replace('#', ''), 14) }}
        />
    );

    return (
        <div
            className={`titan-pro-timeline-track ${className}`}
            onClick={() => onTrackSelect && onTrackSelect(trackId)}
            style={{
                width: '120px',
                minWidth: '120px',
                height: `${height}px`,
                background: 'linear-gradient(90deg, #0c1426 0%, #0a1220 100%)',
                borderRight: '2px solid #1e293b',
                borderBottom: '1px solid #141f33',
                position: 'sticky',
                left: 0,
                zIndex: 15,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '6px',
                cursor: 'pointer',
                transition: 'background 0.15s',
                userSelect: 'none'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(90deg, #0f172a 0%, #0d1527 100%)'}
            onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(90deg, #0c1426 0%, #0a1220 100%)'}
        >
            {/* Top Row: Track ID & Color Badge */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '6px'
            }}>
                {/* Track Icon & Name */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flex: 1,
                    minWidth: 0
                }}>
                    <div style={{
                        width: '4px',
                        height: '24px',
                        background: color,
                        borderRadius: '2px',
                        boxShadow: `0 0 8px ${color}`
                    }} />
                    <span dangerouslySetInnerHTML={{ __html: renderAdaptiveIconSVG(typeInfo.icon, false, color.replace('#', ''), 16) }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            fontSize: '10px',
                            fontWeight: '800',
                            color: color,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            letterSpacing: '0.3px'
                        }}>
                            {trackId}
                        </div>
                        <div style={{
                            fontSize: '8px',
                            color: '#64748b',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {trackName}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Control Buttons */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '3px'
            }}>
                {/* Visibility Toggle */}
                <ControlButton
                    icon={visible ? TITAN_ICON.VIDEO.EYE_OPEN : TITAN_ICON.VIDEO.EYE_SLASH}
                    active={visible}
                    activeColor="#38bdf8"
                    onClick={e => {
                        e.stopPropagation();
                        onToggleVisible && onToggleVisible(trackId);
                    }}
                    title={`${visible ? 'Hide' : 'Show'} Track`}
                />

                {/* Audio: Mute/Solo OR Video: Lock */}
                {trackType === 'AUDIO' ? (
                    <>
                        <ControlButton
                            icon={TITAN_ICON.VIDEO.MUTE_BADGE}
                            active={muted}
                            activeColor="#ef4444"
                            onClick={e => {
                                e.stopPropagation();
                                onToggleMute && onToggleMute(trackId);
                            }}
                            title={`${muted ? 'Unmute' : 'Mute'} Track`}
                        />
                        <ControlButton
                            icon={TITAN_ICON.VIDEO.SOLO_BADGE}
                            active={solo}
                            activeColor="#facc15"
                            onClick={e => {
                                e.stopPropagation();
                                onToggleSolo && onToggleSolo(trackId);
                            }}
                            title={`${solo ? 'Unsolo' : 'Solo'} Track`}
                        />
                    </>
                ) : (
                    <ControlButton
                        icon={locked ? TITAN_ICON.VIDEO.TRACK_LOCK : TITAN_ICON.VIDEO.TRACK_UNLOCK}
                        active={locked}
                        activeColor="#f59e0b"
                        onClick={e => {
                            e.stopPropagation();
                            onToggleLock && onToggleLock(trackId);
                        }}
                        title={`${locked ? 'Unlock' : 'Lock'} Track`}
                    />
                )}

                {/* Record Arm (Audio only) */}
                {trackType === 'AUDIO' && (
                    <div style={{
                        width: '22px',
                        height: '22px',
                        background: 'transparent',
                        border: '1px solid #1e293b',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        cursor: 'pointer'
                    }}
                    title="Record Arm">
                        🎙️
                    </div>
                )}
            </div>
        </div>
    );
};

module.exports = { TitanProTimelineTrack, TRACK_TYPES };
module.exports.default = TitanProTimelineTrack;
