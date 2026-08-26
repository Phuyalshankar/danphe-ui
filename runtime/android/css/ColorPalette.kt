package io.dolphin.runtime

import android.graphics.Color

/**
 * 🎨 ColorPalette — Complete Native Tailwind Shade-Aware Palette Mapper
 * Perfectly synchronized with Node.js ubColors.js mapping table.
 */
object ColorPalette {

    // ── 7: Slate / Gray Scale ──
    fun resolveSlate(shade: Int): Int {
        return when {
            shade <= 25  -> Color.parseColor("#f8fafc") // 50
            shade <= 45  -> Color.parseColor("#f1f5f9") // 100
            shade <= 75  -> Color.parseColor("#e2e8f0") // 200
            shade <= 100 -> Color.parseColor("#cbd5e1") // 300
            shade <= 120 -> Color.parseColor("#94a3b8") // 400
            shade <= 135 -> Color.parseColor("#64748b") // 500
            shade <= 160 -> Color.parseColor("#475569") // 600
            shade <= 190 -> Color.parseColor("#334155") // 700
            shade <= 220 -> Color.parseColor("#1e293b") // 800
            else         -> Color.parseColor("#0f172a") // 900/950
        }
    }

    // ── 1: Blue / Sky / Cyan Scale ──
    fun resolveBlue(shade: Int): Int {
        return when {
            shade <= 25  -> Color.parseColor("#eff6ff")
            shade <= 45  -> Color.parseColor("#dbeafe")
            shade <= 75  -> Color.parseColor("#bfdbfe")
            shade <= 100 -> Color.parseColor("#93c5fd")
            shade <= 120 -> Color.parseColor("#60a5fa")
            shade <= 135 -> Color.parseColor("#3b82f6") // 500
            shade <= 160 -> Color.parseColor("#2563eb") // 600
            shade <= 190 -> Color.parseColor("#1d4ed8")
            shade <= 220 -> Color.parseColor("#1e40af")
            else         -> Color.parseColor("#1e3a8a")
        }
    }

    // ── 2: Green / Emerald / Teal Scale ──
    fun resolveGreen(shade: Int): Int {
        return when {
            shade <= 45  -> Color.parseColor("#dcfce7")
            shade <= 100 -> Color.parseColor("#86efac")
            shade <= 135 -> Color.parseColor("#22c55e")
            shade <= 190 -> Color.parseColor("#16a34a")
            else         -> Color.parseColor("#14532d")
        }
    }

    // ── 3: Indigo / Violet Scale ──
    fun resolveIndigo(shade: Int): Int {
        return when {
            shade <= 45  -> Color.parseColor("#e0e7ff")
            shade <= 100 -> Color.parseColor("#a5b4fc")
            shade <= 135 -> Color.parseColor("#6366f1")
            shade <= 190 -> Color.parseColor("#4f46e5")
            else         -> Color.parseColor("#312e81")
        }
    }

    // ── 4: Red / Rose Scale ──
    fun resolveRed(shade: Int): Int {
        return when {
            shade <= 45  -> Color.parseColor("#fee2e2")
            shade <= 100 -> Color.parseColor("#fca5a5")
            shade <= 135 -> Color.parseColor("#ef4444")
            shade <= 190 -> Color.parseColor("#dc2626")
            else         -> Color.parseColor("#7f1d1d")
        }
    }

    // ── 5: Amber Scale ──
    fun resolveAmber(shade: Int): Int {
        return when {
            shade <= 45  -> Color.parseColor("#fef3c7")
            shade <= 135 -> Color.parseColor("#f59e0b")
            else         -> Color.parseColor("#78350f")
        }
    }

    // ── 6: Orange Scale ──
    fun resolveOrange(shade: Int): Int {
        return when {
            shade <= 45  -> Color.parseColor("#ffedd5")
            shade <= 135 -> Color.parseColor("#f97316")
            else         -> Color.parseColor("#7c2d12")
        }
    }

    // ── 12: Pink / Fuchsia Scale ──
    fun resolvePink(shade: Int): Int {
        return when {
            shade <= 45  -> Color.parseColor("#fce7f3")
            shade <= 135 -> Color.parseColor("#ec4899")
            else         -> Color.parseColor("#831843")
        }
    }

    // ── 13: Purple Scale ──
    fun resolvePurple(shade: Int): Int {
        return when {
            shade <= 45  -> Color.parseColor("#f3e8ff")
            shade <= 135 -> Color.parseColor("#a855f7")
            else         -> Color.parseColor("#581c87")
        }
    }

    // ── 14: Yellow Scale ──
    fun resolveYellow(shade: Int): Int {
        return when {
            shade <= 45  -> Color.parseColor("#fef9c3")
            shade <= 135 -> Color.parseColor("#eab308")
            else         -> Color.parseColor("#713f12")
        }
    }
}
