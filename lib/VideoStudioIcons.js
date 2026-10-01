'use strict';

/**
 * 🎬 VIDEO_STUDIO_ICONS (danphe-ui / ThorVG Vector Icon Engine)
 * Comprehensive 64 Hand-Crafted 24x24 Pure Vector Bézier Paths for NLE Video Editors
 */

const VIDEO_STUDIO_ICONS = {
    // ── 1. Premiere Pro 12-Tool Master Palette ──────────────────────────────────
    "tool_selection": '<path d="M3 3l7 18 3-7 7-3L3 3z"/>',
    "tool_track_select_fwd": '<polygon points="13 19 22 12 13 5 13 19"/><polygon points="2 19 11 12 2 5 2 19"/>',
    "tool_track_select_back": '<polygon points="11 19 2 12 11 5 11 19"/><polygon points="22 19 13 12 22 5 22 19"/>',
    "tool_ripple_edit": '<path d="M6 4v16"/><path d="M18 4v16"/><path d="M6 12h12"/><polyline points="10 8 6 12 10 16"/><polyline points="14 8 18 12 14 16"/>',
    "tool_rolling_edit": '<line x1="12" y1="2" x2="12" y2="22"/><polyline points="8 8 4 12 8 16"/><polyline points="16 8 20 12 16 16"/>',
    "tool_rate_stretch": '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/><path d="M19 18h4"/><path d="M19 22h4"/>',
    "tool_razor_cut": '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>',
    "tool_slip": '<rect x="4" y="6" width="16" height="12" rx="2"/><polyline points="9 10 7 12 9 14"/><polyline points="15 10 17 12 15 14"/>',
    "tool_slide": '<rect x="7" y="6" width="10" height="12" rx="1"/><polyline points="4 10 2 12 4 14"/><polyline points="20 10 22 12 20 14"/>',
    "tool_pen_mask": '<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><circle cx="11" cy="11" r="1.5"/>',
    "tool_hand_pan": '<path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8a7 7 0 0 0 14 0v-3a2 2 0 0 0-4 0v0"/>',
    "tool_zoom": '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>',
    "tool_type_text": '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>',

    // ── 2. Cut, Slicing & Timeline Actions ──────────────────────────────────────
    "action_split_playhead": '<line x1="12" y1="2" x2="12" y2="22"/><polyline points="8 6 12 2 16 6"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>',
    "action_trim_boundaries": '<path d="M4 6v12"/><path d="M20 6v12"/><line x1="4" y1="12" x2="11" y2="12"/><line x1="13" y1="12" x2="20" y2="12"/>',
    "action_ripple_delete": '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><line x1="9" y1="12" x2="15" y2="12"/>',
    "action_keyframe": '<polygon points="12 3 21 12 12 21 3 12 12 3"/><circle cx="12" cy="12" r="2"/>',
    "action_speed_ramp": '<path d="M3 18c3-6 6-12 18-12"/><circle cx="3" cy="18" r="2"/><circle cx="21" cy="6" r="2"/><polyline points="15 6 21 6 21 12"/>',
    "action_rotate_90": '<path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>',
    "action_crop_pan": '<path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"/><path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"/>',
    "action_reverse_playback": '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',

    // ── 3. Audio & DSP ──────────────────────────────────────────────────────────
    "audio_speaker": '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>',
    "audio_mute": '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>',
    "audio_mic_record": '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>',
    "audio_equalizer": '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>',
    "audio_denoise": '<path d="M2 10v4"/><path d="M6 6v12"/><path d="M10 3v18"/><path d="M14 8v8"/><path d="M18 5v14"/><path d="M22 10v4"/><line x1="1" y1="1" x2="23" y2="23"/>',
    "audio_ducking": '<polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/>',
    "audio_headphones": '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',

    // ── 4. OKLCH Color & Lumetri Grading ────────────────────────────────────────
    "color_wheel_3way": '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="22"/><line x1="2" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="22" y2="12"/>',
    "color_lut_cube": '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
    "color_exposure": '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
    "color_contrast": '<circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor"/>',
    "color_blend_mode": '<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>',

    // ── 5. Typography & Text Suite ──────────────────────────────────────────────
    "text_edit_string": '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
    "text_font_matrix": '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/><text x="14" y="21" font-size="7" font-family="monospace">N</text>',
    "text_neon_glow": '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
    "text_auto_captions": '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="13" y2="13"/>',
    "text_nepal_stamp": '<polygon points="4 2 20 9 9 9 20 18 4 18 4 22"/><line x1="4" y1="2" x2="4" y2="22"/>',

    // ── 6. AI & Smart VFX ───────────────────────────────────────────────────────
    "ai_smart_cutout": '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M19 8l2 2-2 2M15 4l-1 2 1 2"/>',
    "ai_beat_sync": '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/><circle cx="12" cy="10" r="1.5" fill="currentColor"/>',
    "ai_trendy_vfx": '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    "vfx_motion_blur": '<line x1="4" y1="6" x2="16" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="2" y1="18" x2="14" y2="18"/>',
    "vfx_vector_shapes": '<polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>',

    // ── 7. Transport, Tracks & System ───────────────────────────────────────────
    "media_video_cam": '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>',
    "media_audio_track": '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    "media_import": '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    "media_export": '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
    "transport_play": '<polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>',
    "transport_pause": '<rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/>',
    "transport_step_back": '<polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/>',
    "transport_step_fwd": '<polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/>',
    "transport_loop": '<path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
    "track_eye_visible": '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    "track_lock": '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    "track_magnet_snap": '<path d="M6 3v7a6 6 0 0 0 12 0V3"/><line x1="4" y1="8" x2="8" y2="8"/><line x1="16" y1="8" x2="20" y2="8"/>',
    "system_trash": '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
    "system_clone": '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'
};

function getDanpheSVG(name, size = 16, stroke = "currentColor", fill = "none") {
    const path = VIDEO_STUDIO_ICONS[name] || VIDEO_STUDIO_ICONS["tool_selection"];
    return `<svg class="danphe-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}

module.exports = { VIDEO_STUDIO_ICONS, getDanpheSVG };