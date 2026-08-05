package io.dolphin.runtime

import android.graphics.Color

/**
 * 🏷️ ColorTokens — Semantic Theme Design System Tokens
 * Clean design tokens for background, surface, input, card, and tab elements.
 */
object ColorTokens {

    fun getBackground(isDark: Boolean): Int {
        return if (isDark) Color.parseColor("#0f172a") else Color.parseColor("#f8fafc")
    }

    fun getSurface(isDark: Boolean): Int {
        return if (isDark) Color.parseColor("#1e293b") else Color.WHITE
    }

    fun getInputFilledBackground(isDark: Boolean): Int {
        return if (isDark) Color.parseColor("#1e293b") else Color.parseColor("#f1f5f9")
    }

    fun getInputBorder(isDark: Boolean): Int {
        return if (isDark) Color.parseColor("#475569") else Color.parseColor("#e2e8f0")
    }

    fun getTextPrimary(isDark: Boolean): Int {
        return if (isDark) Color.WHITE else Color.parseColor("#0f172a")
    }

    fun getTextSecondary(isDark: Boolean): Int {
        return if (isDark) Color.parseColor("#94a3b8") else Color.parseColor("#64748b")
    }

    fun getTabInactiveBackground(isDark: Boolean): Int {
        return if (isDark) Color.parseColor("#1e293b") else Color.parseColor("#f1f5f9")
    }

    fun getTabInactiveText(isDark: Boolean): Int {
        return if (isDark) Color.parseColor("#94a3b8") else Color.parseColor("#475569")
    }

    fun getCardBorder(isDark: Boolean): Int {
        return if (isDark) Color.parseColor("#334155") else Color.parseColor("#e2e8f0")
    }
}
