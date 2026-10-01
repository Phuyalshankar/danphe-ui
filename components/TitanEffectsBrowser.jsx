'use strict';

/**
 * 🎨 TitanEffectsBrowser - Professional Effects Library Component
 * World-class effects browser matching DaVinci Resolve/Premiere Pro
 * Features: Categories, search, drag-to-timeline, favorites, presets
 */

const React = require('react');
const { useState } = React;
const { renderAdaptiveIconSVG, TITAN_ICON } = require('../lib/TitanAdaptiveIcon');

const EFFECT_CATEGORIES = [
    { id: 'video', label: 'Video Effects', icon: TITAN_ICON.VIDEO.TRACK_VIDEO, color: '#38bdf8' },
    { id: 'transitions', label: 'Transitions', icon: TITAN_ICON.VIDEO.CROSSFADE, color: '#c084fc' },
    { id: 'color', label: 'Color Grading', icon: TITAN_ICON.VIDEO.COLOR_WHEEL, color: '#f59e0b' },
    { id: 'audio', label: 'Audio FX', icon: TITAN_ICON.VIDEO.TRACK_AUDIO, color: '#4ade80' },
    { id: 'text', label: 'Text & Titles', icon: TITAN_ICON.VIDEO.SUBTITLE, color: '#facc15' },
    { id: 'generators', label: 'Generators', icon: TITAN_ICON.WEB.GRID, color: '#8b5cf6' }
];

const EFFECTS_LIBRARY = {
    video: [
        { id: 'blur', name: 'Gaussian Blur', desc: 'Professional blur effect', icon: '🌫️', preset: true },
        { id: 'sharpen', name: 'Sharpen', desc: 'Enhance image detail', icon: '✨', preset: true },
        { id: 'transform', name: 'Transform', desc: 'Scale, rotate, position', icon: '🔄', preset: false },
        { id: 'crop', name: 'Crop', desc: 'Crop and reframe', icon: '✂️', preset: false },
        { id: 'vignette', name: 'Vignette', desc: 'Darken edges', icon: '🌗', preset: true },
        { id: 'lens_flare', name: 'Lens Flare', desc: 'Cinematic lens flare', icon: '☀️', preset: true },
        { id: 'glow', name: 'Glow', desc: 'Add luminous glow', icon: '✨', preset: true },
        { id: 'film_grain', name: 'Film Grain', desc: 'Vintage film texture', icon: '📽️', preset: true }
    ],
    transitions: [
        { id: 'crossfade', name: 'Cross Dissolve', desc: 'Standard fade transition', icon: '〰️', preset: false },
        { id: 'dip_black', name: 'Dip to Black', desc: 'Fade through black', icon: '⬛', preset: false },
        { id: 'push', name: 'Push', desc: 'Slide transition', icon: '➡️', preset: false },
        { id: 'wipe', name: 'Wipe', desc: 'Directional wipe', icon: '▶️', preset: true },
        { id: 'zoom', name: 'Zoom Transition', desc: 'Scale transition', icon: '🔍', preset: true },
        { id: 'spin', name: 'Spin', desc: '3D rotation transition', icon: '🌀', preset: true }
    ],
    color: [
        { id: 'color_wheels', name: 'Color Wheels', desc: 'Lift, gamma, gain control', icon: '🎨', preset: false },
        { id: 'curves', name: 'Curves', desc: 'RGB curve adjustment', icon: '📈', preset: false },
        { id: 'hsl', name: 'HSL Secondary', desc: 'Selective color grading', icon: '🌈', preset: false },
        { id: 'lut', name: 'LUT', desc: 'Color lookup table', icon: '🎬', preset: true },
        { id: 'temperature', name: 'Temperature', desc: 'Warm/cool adjustment', icon: '🌡️', preset: false },
        { id: 'vibrance', name: 'Vibrance', desc: 'Smart saturation', icon: '💎', preset: false }
    ],
    audio: [
        { id: 'eq', name: 'Parametric EQ', desc: '10-band equalizer', icon: '🎚️', preset: true },
        { id: 'compressor', name: 'Compressor', desc: 'Dynamic range control', icon: '📊', preset: true },
        { id: 'reverb', name: 'Reverb', desc: 'Room ambience', icon: '🏛️', preset: true },
        { id: 'denoise', name: 'AI Denoise', desc: 'Remove background noise', icon: '🎙️', preset: true },
        { id: 'delay', name: 'Delay', desc: 'Echo effect', icon: '⏱️', preset: true },
        { id: 'limiter', name: 'Limiter', desc: 'Peak protection', icon: '🛡️', preset: false }
    ],
    text: [
        { id: 'basic_title', name: 'Basic Title', desc: 'Simple text overlay', icon: '📝', preset: true },
        { id: 'lower_third', name: 'Lower Third', desc: 'Professional name tag', icon: '📌', preset: true },
        { id: 'subtitle', name: 'Subtitle', desc: 'Closed captions', icon: '💬', preset: true },
        { id: 'kinetic', name: 'Kinetic Typography', desc: 'Animated text', icon: '🎭', preset: true },
        { id: 'credits', name: 'Rolling Credits', desc: 'End credits roll', icon: '📜', preset: false }
    ],
    generators: [
        { id: 'solid', name: 'Solid Color', desc: 'Flat color matte', icon: '🟦', preset: false },
        { id: 'gradient', name: 'Gradient', desc: 'Color gradient', icon: '🌈', preset: true },
        { id: 'noise', name: 'Noise', desc: 'Random noise pattern', icon: '📺', preset: true },
        { id: 'bars', name: 'Color Bars', desc: 'Test pattern', icon: '📊', preset: false }
    ]
};

const TitanEffectsBrowser = ({
    className = '',
    onEffectDrag = null,
    onEffectApply = null
}) => {
    const [activeCategory, setActiveCategory] = useState('video');
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState(new Set());

    const handleDragStart = (effect, e) => {
        if (onEffectDrag) {
            e.dataTransfer.setData('effect', JSON.stringify(effect));
            onEffectDrag(effect);
        }
    };

    const toggleFavorite = (effectId) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(effectId)) {
            newFavorites.delete(effectId);
        } else {
            newFavorites.add(effectId);
        }
        setFavorites(newFavorites);
    };

    const filteredEffects = EFFECTS_LIBRARY[activeCategory]?.filter(effect =>
        effect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        effect.desc.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div className={`titan-effects-browser ${className}`} style={{
            width: '100%',
            height: '100%',
            background: '#0d1527',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {/* Search Bar */}
            <div style={{
                padding: '8px',
                borderBottom: '1px solid #1e293b',
                background: '#0b1120'
            }}>
                <div style={{
                    position: 'relative',
                    width: '100%'
                }}>
                    <input
                        type="text"
                        placeholder="Search effects..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            height: '32px',
                            padding: '0 12px 0 36px',
                            background: '#0f172a',
                            border: '1px solid #1e293b',
                            borderRadius: '6px',
                            color: '#e2e8f0',
                            fontSize: '12px',
                            outline: 'none'
                        }}
                        onFocus={e => e.target.style.borderColor = '#38bdf8'}
                        onBlur={e => e.target.style.borderColor = '#1e293b'}
                    />
                    <div style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none'
                    }} dangerouslySetInnerHTML={{ __html: renderAdaptiveIconSVG(TITAN_ICON.WEB.SEARCH, false, 'slate', 16) }} />
                </div>
            </div>

            {/* Category Tabs */}
            <div style={{
                display: 'flex',
                gap: '4px',
                padding: '8px',
                borderBottom: '1px solid #1e293b',
                background: '#080d1a',
                overflowX: 'auto',
                flexWrap: 'wrap'
            }}>
                {EFFECT_CATEGORIES.map(cat => {
                    const isActive = activeCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            title={cat.label}
                            style={{
                                height: '32px',
                                padding: '0 12px',
                                background: isActive ? '#0284c7' : '#0f172a',
                                border: `1px solid ${isActive ? '#38bdf8' : '#1e293b'}`,
                                borderRadius: '6px',
                                color: isActive ? '#fff' : '#94a3b8',
                                fontSize: '10px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.15s',
                                boxShadow: isActive ? '0 0 12px rgba(56, 189, 248, 0.5)' : 'none',
                                whiteSpace: 'nowrap'
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
                        >
                            <span dangerouslySetInnerHTML={{ __html: renderAdaptiveIconSVG(cat.icon, isActive, cat.color.replace('#', ''), 14) }} />
                            <span>{cat.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Effects Grid */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '8px'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '8px'
                }}>
                    {filteredEffects.map(effect => {
                        const isFavorite = favorites.has(effect.id);
                        return (
                            <div
                                key={effect.id}
                                draggable
                                onDragStart={e => handleDragStart(effect, e)}
                                onClick={() => onEffectApply && onEffectApply(effect)}
                                style={{
                                    background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                                    border: '1px solid #1e293b',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    position: 'relative',
                                    userSelect: 'none'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = '#38bdf8';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(56, 189, 248, 0.3)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = '#1e293b';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {/* Favorite Star */}
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(effect.id);
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '6px',
                                        right: '6px',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        opacity: isFavorite ? 1 : 0.3,
                                        transition: 'opacity 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = isFavorite ? '1' : '0.3'}
                                >
                                    ⭐
                                </div>

                                {/* Icon */}
                                <div style={{
                                    fontSize: '32px',
                                    textAlign: 'center',
                                    marginBottom: '8px'
                                }}>
                                    {effect.icon}
                                </div>

                                {/* Name */}
                                <div style={{
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    color: '#e2e8f0',
                                    marginBottom: '4px',
                                    textAlign: 'center'
                                }}>
                                    {effect.name}
                                </div>

                                {/* Description */}
                                <div style={{
                                    fontSize: '9px',
                                    color: '#94a3b8',
                                    textAlign: 'center',
                                    lineHeight: '1.3'
                                }}>
                                    {effect.desc}
                                </div>

                                {/* Preset Badge */}
                                {effect.preset && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '6px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        background: '#059669',
                                        color: '#fff',
                                        fontSize: '8px',
                                        fontWeight: '700',
                                        padding: '2px 6px',
                                        borderRadius: '4px'
                                    }}>
                                        PRESET
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {filteredEffects.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: '#64748b'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
                        <div style={{ fontSize: '14px', fontWeight: '600' }}>No effects found</div>
                        <div style={{ fontSize: '11px', marginTop: '6px' }}>
                            Try a different search term or category
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

module.exports = { TitanEffectsBrowser, EFFECT_CATEGORIES, EFFECTS_LIBRARY };
module.exports.default = TitanEffectsBrowser;
