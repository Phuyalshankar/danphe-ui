'use strict';

/**
 * 🗺️ TITAN_REG / TITAN_ADDRESS (Named Memory-Mapped Register Constants)
 * No need to memorize numbers (0-65535)! Full IDE Auto-Complete.
 */
const TITAN_REG = {
    // ── Core & Navigation (0 - 999) ──
    ONLINE_STATUS:       1,
    ROUTER_SCREEN:       10,
    SYSTEM_UPTIME:       20,

    // ── UI & Keypads (1,000 - 9,999) ──
    DIAL_BUFFER:         1000,
    KEYPAD_DTMF:         1001,
    LCD_LINE1:           1010,
    LCD_LINE2:           1011,
    SEVEN_SEG_DISPLAY:   1020,
    AUDIO_WAVE_METER:    1030,

    // ── Database & Contacts (10,000 - 19,999) ──
    CONTACTS_LIST:       10001,
    ACTIVE_USER_PROFILE: 19000,

    // ── Hardware Relays & GPIO (20,000 - 29,999) ──
    RELAY_1:             20001,
    RELAY_2:             20002,
    RELAY_3:             20003,
    RELAY_4:             20004,
    SOLENOID_LOCK:       20010,
    SIREN_ALARM:         20020,

    // ── Sensors & Telemetry (30,000 - 39,999) ──
    TEMP_SENSOR:         30003,
    WIFI_RSSI:           30004,
    BATTERY_VOLTAGE:     30005,
    CALL_LATENCY_MS:     30010,

    // ── Custom Forms & Pages (40,000 - 65,535) ──
    AUTH_LOGIN_FORM:     40001,
    SIP_EXTENSION_REG:   40002,
    REMEMBER_SESSION:    40003,
    PBX_SETTINGS_FORM:   40010
};

module.exports = {
    TITAN_REG,
    TITAN_ADDRESS: TITAN_REG
};
