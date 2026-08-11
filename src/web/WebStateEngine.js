'use strict';

/**
 * ⚡ WebStateEngine v1.0 — NanoStore Dynamic Reactive State Engine for Web
 * SSR State Hydration, Sub-string [stateKey:] parsing, and 0ms DOM Updates
 */
class WebStateEngine {
    static getDefaultState() {
        return {
            counter: 0,
            isLoggedIn: false,
            userStatus: 'Guest User',
            theme: 'dark',
            notification: 'Welcome to Dolphin Native Suite!',
            selectedCount: 0,
            selectedFilesSize: '0.0 MB',
            lastAirPickItem: 'No Item Picked',
            lastTransferStatus: 'Idle',
            transferSpeed: '0.0 MB/s',
            currentScreen: 'Home',
            activeNav: 'Home',
            activeTab: 'Home',
            formName: 'Shankar Phuyal',
            formEmail: 'shankar@dolphin.dev',
            formPhone: '+977 9841234567',
            formPassword: '••••••••',
            formStatus: 'Form Active & Ready ⚡',
            form_name: 'Shankar Phuyal',
            form_email: 'shankar@dolphin.dev',
            form_password: '••••••••',
            form_phone: '+977 9841234567',
            form_floating: 'Active Floating Component',
            form_notes: 'Dolphin Native 2.0 Universal Dual-Target Architecture deployed.',
            form_role: 'Industrial HMI Architect ⚙️',
            form_terms: 'Agreed',
            form_newsletter: 'Subscribed',
            form_plan: 'Enterprise',
            form_sync: 'Enabled',
            form_freq: '500',
            form_status: 'Form Active & Ready ⚡',
            sys_mic_status: 'Idle 🎙️',
            sys_picked_video_url: '',
            sys_picked_audio_name: 'No File Selected',
            sys_picked_audio_url: ''
        };
    }

    static parseStateKeyString(str, stateMap = {}, escapeHTMLFn = (s) => String(s)) {
        if (str === null || str === undefined) return '';
        const text = String(str);
        if (!text.includes('[stateKey:')) {
            return escapeHTMLFn(text);
        }

        const defaultState = this.getDefaultState();
        const parts = text.split(/(\[stateKey:[a-zA-Z0-9_\-\.]+\])/g);
        return parts.map(part => {
            if (part.startsWith('[stateKey:') && part.endsWith(']')) {
                const stateKey = part.substring(10, part.length - 1);
                const rawVal = stateMap[stateKey] !== undefined ? stateMap[stateKey] : defaultState[stateKey];
                const displayVal = (rawVal !== undefined && rawVal !== null && rawVal !== '') ? String(rawVal) : (defaultState[stateKey] || '--');
                return `<span data-state-key="${escapeHTMLFn(stateKey)}">${escapeHTMLFn(displayVal)}</span>`;
            }
            return escapeHTMLFn(part);
        }).join('');
    }
}

module.exports = WebStateEngine;
