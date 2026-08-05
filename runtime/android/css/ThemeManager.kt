package io.dolphin.runtime

/**
 * 🌗 ThemeManager — Manages Dark/Light mode transitions, theme level luminance, and theme change callbacks.
 */
object ThemeManager {

    val isDarkMode: Boolean
        get() = DolphinStateEngine.themeLevel > 128

    fun setThemeLevel(level: Int) {
        DolphinStateEngine.themeLevel = level
        DolphinStateEngine.onThemeChanged?.invoke(level)
    }
}
