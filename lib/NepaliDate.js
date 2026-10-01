'use strict';

/**
 * 🇳🇵 DOLPHIN NATIVE PATRO / BIKRAM SAMBAT STANDARD (BS 2000 - 2100)
 * Ported 1:1 from d:/dolphin-cpp/dolphin_modules/patro/include/patro.hpp
 */

const MONTHS_NP = [
    "वैशाख", "जेठ", "असार", "श्रावण", "भाद्र", "असोज",
    "कार्तिक", "मंसिर", "पुस", "माघ", "फाल्गुन", "चैत"
];

const MONTHS_EN = [
    "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
    "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

const DAYS_NP = [
    "आइतबार", "सोमबार", "मंगलबार", "बुधबार", "बिहिबार", "शुक्रबार", "शनिबार"
];

const DAYS_EN = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

const DEV_NUMS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

function toDevanagari(num) {
    return String(num).replace(/[0-9]/g, d => DEV_NUMS[d]);
}

// 101-Year Flat Array (BS 2000 to 2100) directly from dolphin-cpp
const BS_MONTH_DAYS = [
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2000
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2001
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2002
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2003
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2004
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2005
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2006
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2007
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31], // 2008
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2009
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2010
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2011
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], // 2012
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2013
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2014
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2015
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], // 2016
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2017
    [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2018
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2019
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2020
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2021
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 2022
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2023
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2024
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2025
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2026
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2027
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2028
    [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30], // 2029
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2030
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2031
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2032
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2033
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2034
    [30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31], // 2035
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2036
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2037
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2038
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], // 2039
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2040
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2041
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2042
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], // 2043
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2044
    [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2045
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2046
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2047
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2048
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 2049
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2050
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2051
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2052
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 2053
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2054
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2055
    [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30], // 2056
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2057
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2058
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2059
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2060
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2061
    [30, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31], // 2062
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2063
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2064
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2065
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31], // 2066
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2067
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2068
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2069
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], // 2070
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2071
    [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2072
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], // 2073
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2074
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2075
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 2076
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2077
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], // 2078
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2079
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 2080
    [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30], // 2081
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30], // 2082
    [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30], // 2083
    [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30], // 2084
    [31, 32, 31, 32, 30, 31, 30, 30, 29, 30, 30, 30], // 2085
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30], // 2086
    [31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30], // 2087
    [30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30], // 2088
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30], // 2089
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30], // 2090
    [31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30], // 2091
    [30, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30], // 2092
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30], // 2093
    [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30], // 2094
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 30, 30, 30], // 2095
    [30, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2096
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30], // 2097
    [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 30, 31], // 2098
    [31, 31, 32, 31, 31, 31, 30, 29, 29, 30, 30, 30], // 2099
    [31, 32, 31, 32, 30, 31, 30, 29, 30, 29, 30, 30]  // 2100
];

function getDaysInBSMonth(bsYear, bsMonth) {
    if (bsYear >= 2000 && bsYear <= 2100 && bsMonth >= 1 && bsMonth <= 12) {
        return BS_MONTH_DAYS[bsYear - 2000][bsMonth - 1];
    }
    return 30;
}

function toJulianDay(year, month, day) {
    let y = year;
    let m = month;
    if (m <= 2) {
        y--;
        m += 12;
    }
    const A = Math.floor(y / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) +
           Math.floor(30.6001 * (m + 1)) +
           day + B - 1524.5;
}

function adToBs(adYear, adMonth, adDay) {
    const targetJdn = toJulianDay(adYear, adMonth, adDay);
    let currentJdn = toJulianDay(1943, 4, 14);

    let bsYear = 2000;
    let bsMonth = 1;
    let bsDay = 1;

    while (bsYear <= 2100) {
        let daysInYear = 0;
        for (let m = 1; m <= 12; ++m) {
            daysInYear += getDaysInBSMonth(bsYear, m);
        }
        if (currentJdn + daysInYear > targetJdn) break;
        currentJdn += daysInYear;
        bsYear++;
    }

    while (bsMonth <= 12) {
        const daysInMonth = getDaysInBSMonth(bsYear, bsMonth);
        if (currentJdn + daysInMonth > targetJdn) break;
        currentJdn += daysInMonth;
        bsMonth++;
    }

    bsDay += Math.floor(targetJdn - currentJdn);

    return {
        year: bsYear,
        month: bsMonth,
        day: bsDay,
        monthNameNp: MONTHS_NP[bsMonth - 1] || '',
        monthNameEn: MONTHS_EN[bsMonth - 1] || ''
    };
}

function getNepaliDate(date) {
    const d = date ? new Date(date) : new Date();
    const bs = adToBs(d.getFullYear(), d.getMonth() + 1, d.getDate());
    const dayOfWeek = d.getDay();

    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    const secs = String(d.getSeconds()).padStart(2, '0');

    const formattedNp = toDevanagari(bs.year) + ' ' + bs.monthNameNp + ' ' + toDevanagari(bs.day) + ' गते, ' + DAYS_NP[dayOfWeek];
    const formattedEn = bs.day + ' ' + bs.monthNameEn + ' ' + bs.year + ' B.S. (' + DAYS_EN[dayOfWeek] + ')';
    const shortNp = toDevanagari(bs.year) + '/' + toDevanagari(String(bs.month).padStart(2, '0')) + '/' + toDevanagari(String(bs.day).padStart(2, '0'));
    const shortEn = bs.year + '-' + String(bs.month).padStart(2, '0') + '-' + String(bs.day).padStart(2, '0') + ' B.S.';
    const timeNp = toDevanagari(hours) + ':' + toDevanagari(mins) + ':' + toDevanagari(secs);
    const timeEn = hours + ':' + mins + ':' + secs;

    return {
        year: bs.year,
        month: bs.month,
        day: bs.day,
        monthNameNp: bs.monthNameNp,
        monthNameEn: bs.monthNameEn,
        dayNameNp: DAYS_NP[dayOfWeek],
        dayNameEn: DAYS_EN[dayOfWeek],
        formattedNp: formattedNp,
        formattedEn: formattedEn,
        shortNp: shortNp,
        shortEn: shortEn,
        timeNp: timeNp,
        timeEn: timeEn
    };
}

function renderNepaliDateTag(options) {
    const opts = options || {};
    const variant = opts.variant || 'pill';
    const className = opts.className || '';
    const nep = getNepaliDate();

    if (variant === 'pill') {
        return '<div class="nepali-date-pill inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-rose-950/90 via-slate-900 to-slate-950 rounded-full border border-rose-500/50 text-xs font-mono shadow-[0_0_15px_rgba(200,16,46,0.3)] backdrop-blur-md ' + className + '">' +
            '<span class="text-rose-400 font-bold flex items-center gap-1"><span>🇳🇵</span> वि.सं.</span>' +
            '<span class="text-white font-black">' + nep.formattedNp + '</span>' +
            '<span class="text-slate-500">&bull;</span>' +
            '<span class="text-cyan-400 font-mono font-black animate-pulse">' + nep.timeNp + '</span>' +
        '</div>';
    }

    if (variant === 'badge') {
        return '<div class="nepali-date-badge inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-950/90 text-rose-300 rounded-xl border border-rose-600 font-mono text-xs font-bold shadow-[0_0_12px_rgba(200,16,46,0.35)] ' + className + '">' +
            '<span>🇳🇵</span>' +
            '<span>' + nep.shortNp + ' वि.सं.</span>' +
        '</div>';
    }

    return '<div class="nepali-date-card p-3.5 bg-slate-950/95 rounded-2xl border border-rose-500/40 flex items-center justify-between gap-4 shadow-xl ' + className + '">' +
        '<div class="flex items-center gap-3">' +
            '<div class="w-11 h-11 rounded-xl bg-rose-950 border border-rose-500/60 flex flex-col items-center justify-center text-white shadow-inner">' +
                '<span class="text-[9px] font-mono text-rose-300 uppercase leading-none font-bold">' + nep.monthNameNp + '</span>' +
                '<span class="text-lg font-black font-mono leading-tight">' + toDevanagari(nep.day) + '</span>' +
            '</div>' +
            '<div class="flex flex-col">' +
                '<span class="text-xs font-black text-white font-mono">' + nep.formattedNp + '</span>' +
                '<span class="text-[10px] font-mono text-slate-400">' + nep.formattedEn + '</span>' +
            '</div>' +
        '</div>' +
        '<div class="flex items-center gap-1 text-xs font-mono text-cyan-400 font-bold px-3 py-1.5 bg-slate-900 rounded-xl border border-slate-800 shadow-inner">' +
            '<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>' +
            '<span>' + nep.timeNp + '</span>' +
        '</div>' +
    '</div>';
}

module.exports = {
    adToBs,
    getNepaliDate,
    renderNepaliDateTag,
    NepaliDateTag: renderNepaliDateTag,
    toDevanagari,
    BS_MONTH_DAYS
};
