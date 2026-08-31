#pragma once

#include <iostream>
#include <string>
#include <vector>
#include <cmath>
#include <ctime>
#include <cstdint>

// ══════════════════════════════════════════════════════════════════════════════
// 🇳🇵 DOLPHIN NATIVE NEPALI DATE & TIME STANDARD (BS 2000 - 2100)
// Ultra-Lightweight (1.2 KB footprint), Embedded & Device Ready, Zero Bloat
// 100% Accurate Gate (गते), Bar (वार), Live NPT Time (UTC+05:45) & Conversion
// ══════════════════════════════════════════════════════════════════════════════

namespace DolphinPatroCore {

// 1. Month & Day Constants
static const std::vector<std::string> MONTHS_NP = {
    "वैशाख", "जेठ", "असार", "श्रावण", "भाद्र", "असोज",
    "कार्तिक", "मंसिर", "पुस", "माघ", "फाल्गुन", "चैत"
};

static const std::vector<std::string> MONTHS_EN = {
    "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
    "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
};

static const std::vector<std::string> DAYS_NP = {
    "आइतबार", "सोमबार", "मंगलबार", "बुधबार", "बिहिबार", "शुक्रबार", "शनिबार"
};

static const std::vector<std::string> DAYS_EN = {
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
};

// 2. Unicode Nepali Number Formatting
inline std::string toNepaliDigits(long long num) {
    if (num == 0) return "०";
    std::string s = std::to_string(num);
    std::string out = "";
    static const char* nepDigits[] = {"०", "१", "२", "३", "४", "५", "६", "७", "८", "९"};
    for (char c : s) {
        if (c >= '0' && c <= '9') {
            out += nepDigits[c - '0'];
        } else {
            out += c;
        }
    }
    return out;
}

// 3. 100-Year Bikram Sambat Month Days Table (BS 2000 - 2100)
// Ultra-Lightweight Flat Array: 101 Years (BS 2000 to 2100)
// Memory footprint: exactly 1,212 bytes (1.2 KB) — embedded/device grade
static const uint8_t BS_MONTH_DAYS[101][12] = {
    {30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31}, // 2000
    {31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30}, // 2001
    {31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30}, // 2002
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31}, // 2003
    {30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31}, // 2004
    {31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30}, // 2005
    {31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30}, // 2006
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31}, // 2007
    {31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31}, // 2008
    {31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30}, // 2009
    {31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30}, // 2010
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31}, // 2011
    {31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30}, // 2012
    {31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30}, // 2013
    {31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30}, // 2014
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31}, // 2015
    {31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30}, // 2016
    {31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30}, // 2017
    {31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30}, // 2018
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31}, // 2019
    {31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30}, // 2020
    {31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30}, // 2021
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30}, // 2022
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31}, // 2023
    {31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30}, // 2024
    {31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30}, // 2025
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31}, // 2026
    {30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31}, // 2027
    {31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30}, // 2028
    {31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30}, // 2029
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31}, // 2030
    {30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31}, // 2031
    {31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30}, // 2032
    {31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30}, // 2033
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31}, // 2034
    {30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31}, // 2035
    {31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30}, // 2036
    {31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30}, // 2037
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31}, // 2038
    {31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30}, // 2039
    {31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30}, // 2040
    {31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30}, // 2041
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31}, // 2042
    {31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30}, // 2043
    {31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30}, // 2044
    {31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30}, // 2045
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31}, // 2046
    {31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30}, // 2047
    {31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30}, // 2048
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30}, // 2049
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31}, // 2050
    {31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30}, // 2051
    {31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30}, // 2052
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30}, // 2053
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31}, // 2054
    {31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30}, // 2055
    {31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30}, // 2056
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31}, // 2057
    {30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31}, // 2058
    {31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30}, // 2059
    {31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30}, // 2060
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31}, // 2061
    {30, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31}, // 2062
    {31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30}, // 2063
    {31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30}, // 2064
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31}, // 2065
    {31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31}, // 2066
    {31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30}, // 2067
    {31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30}, // 2068
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31}, // 2069
    {31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30}, // 2070
    {31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30}, // 2071
    {31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30}, // 2072
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31}, // 2073
    {31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30}, // 2074
    {31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30}, // 2075
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30}, // 2076
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31}, // 2077
    {31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30}, // 2078
    {31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30}, // 2079
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30}, // 2080
    {31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30}, // 2081
    {30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30}, // 2082
    {31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30}, // 2083
    {31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30}, // 2084
    {31, 32, 31, 32, 30, 31, 30, 30, 29, 30, 30, 30}, // 2085
    {30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30}, // 2086
    {31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30}, // 2087
    {30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30}, // 2088
    {30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30}, // 2089
    {30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30}, // 2090
    {31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30}, // 2091
    {30, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30}, // 2092
    {30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30}, // 2093
    {31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30}, // 2094
    {31, 31, 32, 31, 31, 31, 30, 29, 30, 30, 30, 30}, // 2095
    {30, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30}, // 2096
    {31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30}, // 2097
    {31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 30, 31}, // 2098
    {31, 31, 32, 31, 31, 31, 30, 29, 29, 30, 30, 30}, // 2099
    {31, 32, 31, 32, 30, 31, 30, 29, 30, 29, 30, 30}, // 2100
};

inline int getDaysInBSMonth(int bsYear, int bsMonth) {
    if (bsYear >= 2000 && bsYear <= 2100 && bsMonth >= 1 && bsMonth <= 12) {
        return BS_MONTH_DAYS[bsYear - 2000][bsMonth - 1];
    }
    return 30; // fallback
}

// 4. Julian Day Number (JDN) Arithmetic
inline double toJulianDay(int year, int month, int day) {
    int y = year;
    int m = month;
    if (m <= 2) {
        y--;
        m += 12;
    }
    int A = y / 100;
    int B = 2 - A + (A / 4);
    return std::floor(365.25 * (y + 4716)) +
           std::floor(30.6001 * (m + 1)) +
           day + B - 1524.5;
}

inline void fromJulianDay(double jdn, int& year, int& month, int& day) {
    long long Z = (long long)std::floor(jdn + 0.5);
    double F = (jdn + 0.5) - Z;
    long long A = Z;
    if (Z >= 2299161) {
        long long alpha = (long long)std::floor((Z - 1867216.25) / 36524.25);
        A = Z + 1 + alpha - (alpha / 4);
    }
    long long B = A + 1524;
    long long C = (long long)std::floor((B - 122.1) / 365.25);
    long long D = (long long)std::floor(365.25 * C);
    long long E = (long long)std::floor((B - D) / 30.6001);
    day = (int)(B - D - std::floor(30.6001 * E) + F);
    month = (int)((E < 14) ? (E - 1) : (E - 13));
    year = (int)((month > 2) ? (C - 4716) : (C - 4715));
}

// 5. BS -> AD Date Conversion
inline var bsToAd(int bsYear, int bsMonth, int bsDay) {
    // Anchor: 2000-01-01 BS = 1943-04-14 AD (JDN = 2430829)
    double jdn = toJulianDay(1943, 4, 14);

    int startY = 2000;
    int endY = (bsYear < 2100) ? bsYear : 2100;
    for (int y = startY; y < endY; ++y) {
        for (int m = 1; m <= 12; ++m) {
            jdn += getDaysInBSMonth(y, m);
        }
    }

    for (int m = 1; m < bsMonth && m <= 12; ++m) {
        jdn += getDaysInBSMonth(bsYear, m);
    }
    jdn += (bsDay - 1);

    int adY, adM, adD;
    fromJulianDay(jdn, adY, adM, adD);

    var res(var_object{});
    res["year"] = var(adY);
    res["month"] = var(adM);
    res["day"] = var(adD);
    char buf[32];
    snprintf(buf, sizeof(buf), "%04d-%02d-%02d", adY, adM, adD);
    res["ad"] = var(std::string(buf));
    return res;
}

// 6. AD -> BS Date Conversion
inline var adToBs(int adYear, int adMonth, int adDay) {
    double targetJdn = toJulianDay(adYear, adMonth, adDay);

    // Anchor: 2000-01-01 BS = 1943-04-14 AD
    double currentJdn = toJulianDay(1943, 4, 14);

    int bsYear = 2000;
    int bsMonth = 1;
    int bsDay = 1;

    // Scan years
    while (bsYear <= 2100) {
        int daysInYear = 0;
        for (int m = 1; m <= 12; ++m) {
            daysInYear += getDaysInBSMonth(bsYear, m);
        }
        if (currentJdn + daysInYear > targetJdn) break;
        currentJdn += daysInYear;
        bsYear++;
    }

    // Scan months
    while (bsMonth <= 12) {
        int daysInMonth = getDaysInBSMonth(bsYear, bsMonth);
        if (currentJdn + daysInMonth > targetJdn) break;
        currentJdn += daysInMonth;
        bsMonth++;
    }

    // Remaining days
    bsDay += (int)(targetJdn - currentJdn);

    var res(var_object{});
    res["year"] = var(bsYear);
    res["month"] = var(bsMonth);
    res["day"] = var(bsDay);

    char buf[32];
    snprintf(buf, sizeof(buf), "%04d-%02d-%02d", bsYear, bsMonth, bsDay);
    res["bs"] = var(std::string(buf));

    std::string mNp = (bsMonth >= 1 && bsMonth <= 12) ? MONTHS_NP[bsMonth - 1] : "";
    std::string mEn = (bsMonth >= 1 && bsMonth <= 12) ? MONTHS_EN[bsMonth - 1] : "";
    res["monthName"] = var(mNp);
    res["monthNameEn"] = var(mEn);
    res["nepaliMonth"] = var(mNp);

    return res;
}

// 7. Full Standard Nepali Date & Time Builder
inline var fromAD(int year, int month, int day, int hour_ = -1, int min_ = -1, int sec_ = -1) {
    var bs = adToBs(year, month, day);

    double jdn = toJulianDay(year, month, day);
    int vaarIndex = (int)(((long long)std::floor(jdn + 1.5)) % 7);
    if (vaarIndex < 0) vaarIndex += 7;

    int bsY = bs["year"].toInt();
    int bsM = bs["month"].toInt();
    int bsD = bs["day"].toInt();

    var res(var_object{});

    // AD Date fields
    char adBuf[32];
    snprintf(adBuf, sizeof(adBuf), "%04d-%02d-%02d", year, month, day);
    res["ad"] = var(std::string(adBuf));
    var adObj(var_object{});
    adObj["year"] = var(year);
    adObj["month"] = var(month);
    adObj["day"] = var(day);
    res["adDate"] = adObj;

    // BS Date fields
    res["bs"] = bs["bs"];
    res["year"] = var(bsY);
    res["month"] = var(bsM);
    res["day"] = var(bsD);
    res["monthName"] = bs["monthName"];
    res["monthNameEn"] = bs["monthNameEn"];
    res["nepaliMonth"] = bs["nepaliMonth"];
    res["dayName"] = var(DAYS_EN[vaarIndex]);
    res["nepaliDay"] = var(DAYS_NP[vaarIndex]);
    res["vaar"] = var(DAYS_NP[vaarIndex]);

    // Formatted String (e.g. २०८३ श्रावण ३१, आइतबार)
    std::string formatted = toNepaliDigits(bsY) + " " + bs["monthName"].toString() + " " + toNepaliDigits(bsD) + ", " + DAYS_NP[vaarIndex];
    res["formatted"] = var(formatted);
    res["formattedNepali"] = var(formatted);
    res["nepaliFormatted"] = var(formatted);

    // 🇳🇵 Easy Native Nepali Aliases (बच्चाले पनि बुझ्ने सरल नामहरू)
    res["miti"]   = var(formatted);
    res["gate"]   = var(bsD);
    res["bar"]    = var(DAYS_NP[vaarIndex]);
    res["mahina"] = bs["monthName"];
    res["barsa"]  = var(bsY);

    // Live Time Fields (when hour_ >= 0)
    if (hour_ >= 0) {
        std::string ampm = (hour_ < 12) ? "AM" : "PM";
        int h12 = hour_ % 12; if (h12 == 0) h12 = 12;
        char tbuf[32], t12buf[32], isoBuf[64];
        snprintf(tbuf,   sizeof(tbuf),   "%02d:%02d:%02d", hour_, min_, sec_);
        snprintf(t12buf, sizeof(t12buf), "%02d:%02d %s",   h12, min_, ampm.c_str());
        snprintf(isoBuf, sizeof(isoBuf), "%04d-%02d-%02dT%02d:%02d:%02d+05:45",
                 year, month, day, hour_, min_, sec_);
        res["hour"]      = var(hour_);
        res["minute"]    = var(min_);
        res["second"]    = var(sec_);
        res["time"]      = var(std::string(tbuf));
        res["time12"]    = var(std::string(t12buf));
        res["timeNPT"]   = var(std::string(tbuf) + " NPT");
        res["samaya"]    = var(std::string(t12buf));
        res["timestamp"] = var(std::string(isoBuf));
        res["timezone"]  = var(std::string("Asia/Kathmandu (NPT, UTC+05:45)"));
    }

    return res;
}

inline var fromBS(int year, int month, int day) {
    var ad = bsToAd(year, month, day);
    return fromAD(ad["year"].toInt(), ad["month"].toInt(), ad["day"].toInt());
}

inline var today() {
    std::time_t t = std::time(nullptr);
    // Nepal Standard Time = UTC + 5h 45m = 20700 seconds
    std::time_t nptTime = t + 20700;
    std::tm* now = std::gmtime(&nptTime);
    int adY = now->tm_year + 1900;
    int adM = now->tm_mon + 1;
    int adD = now->tm_mday;
    int h   = now->tm_hour;
    int mn  = now->tm_min;
    int sc  = now->tm_sec;
    return fromAD(adY, adM, adD, h, mn, sc);
}

inline var month(int year, int m) {
    int totalDays = getDaysInBSMonth(year, m);
    var daysArr(var_array{});
    for (int d = 1; d <= totalDays; ++d) {
        var p = fromBS(year, m, d);
        daysArr.push(p);
    }
    return daysArr;
}

} // namespace DolphinPatroCore

// ─── 🇳🇵 Global Top-Level Nepali Functions (सोझै कल गर्न सकिने) ──────────────
inline var aja() { return DolphinPatroCore::today(); }
inline var aaja() { return DolphinPatroCore::today(); }
inline var miti() { return DolphinPatroCore::today()["miti"]; }
inline var gate() { return DolphinPatroCore::today()["gate"]; }
inline var bar() { return DolphinPatroCore::today()["bar"]; }
inline var samaya() { return DolphinPatroCore::today()["samaya"]; }
inline var mahina() { return DolphinPatroCore::today()["mahina"]; }
inline var barsa() { return DolphinPatroCore::today()["barsa"]; }
inline var nepali(const var& num) { return var(DolphinPatroCore::toNepaliDigits(num.toInt())); }

// ─── 🇳🇵 Native Global Namespaces: Aaja, Miti, NepaliDate, Patro ─────────────
struct MitiNamespace {
    // Current live properties & methods
    var aja() { return DolphinPatroCore::today(); }
    var aaja() { return DolphinPatroCore::today(); }
    var today() { return DolphinPatroCore::today(); }
    var now() { return DolphinPatroCore::today(); }
    var miti() { return DolphinPatroCore::today()["miti"]; }
    var gate() { return DolphinPatroCore::today()["gate"]; }
    var bar() { return DolphinPatroCore::today()["bar"]; }
    var samaya() { return DolphinPatroCore::today()["samaya"]; }
    var mahina() { return DolphinPatroCore::today()["mahina"]; }
    var barsa() { return DolphinPatroCore::today()["barsa"]; }

    // Conversions & Month views
    var fromAD(const var& y, const var& m, const var& d) {
        return DolphinPatroCore::fromAD(y.toInt(), m.toInt(), d.toInt());
    }
    var fromBS(const var& y, const var& m, const var& d) {
        return DolphinPatroCore::fromBS(y.toInt(), m.toInt(), d.toInt());
    }
    var adToBs(const var& y, const var& m, const var& d) {
        return DolphinPatroCore::fromAD(y.toInt(), m.toInt(), d.toInt());
    }
    var bsToAd(const var& y, const var& m, const var& d) {
        return DolphinPatroCore::bsToAd(y.toInt(), m.toInt(), d.toInt());
    }
    var mahina(const var& year, const var& m) {
        return DolphinPatroCore::month(year.toInt(), m.toInt());
    }
    var month(const var& year, const var& m) {
        return DolphinPatroCore::month(year.toInt(), m.toInt());
    }
    var toNepali(const var& num) {
        return var(DolphinPatroCore::toNepaliDigits(num.toInt()));
    }
};
inline MitiNamespace Miti, Aaja, Aja, NepaliDate, Patro, Date, DolphinPatro, DolphinMiti, DolphinNepaliDate;