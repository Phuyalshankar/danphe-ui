package io.dolphin.runtime

import android.content.Context
import android.content.res.Configuration
import android.util.Log

/**
 * 📐 DolphinResponsive v1.0 — Universal Responsive & Bracketed CSS Parser Engine
 * Handles Phone (1-col), Tablet (2-col), Industrial HMI Panel, and Smart TV Bracketed [...] Layout Overrides
 */
object DolphinResponsive {
    private const val TAG = "DolphinResponsive"

    enum class DeviceCategory {
        PHONE,      // < 600dp (e.g. Android phone portrait)
        TABLET,     // 600dp - 960dp (e.g. 7"-10" Android tablet)
        HMI_DESKTOP,// 960dp - 1200dp (e.g. Industrial Touch Panels)
        SMART_TV    // >= 1200dp or TV Mode
    }

    /** Determine current device screen category */
    fun getDeviceCategory(ctx: Context): DeviceCategory {
        if (DolphinTV.isSmartTV(ctx)) {
            return DeviceCategory.SMART_TV
        }
        val metrics = ctx.resources.displayMetrics
        val dpWidth = metrics.widthPixels / metrics.density
        return when {
            dpWidth >= 1200f -> DeviceCategory.SMART_TV
            dpWidth >= 960f  -> DeviceCategory.HMI_DESKTOP
            dpWidth >= 600f  -> DeviceCategory.TABLET
            else             -> DeviceCategory.PHONE
        }
    }

    /** Returns true if running on Tablet, Industrial HMI, Smart TV, or Desktop Web */
    fun isLargeScreenOrTv(ctx: Context): Boolean {
        val category = getDeviceCategory(ctx)
        return category != DeviceCategory.PHONE
    }

    /** Parse className string, expanding bracketed [...] CSS rules for Large Screen / TV */
    fun resolveResponsiveClasses(rawClassName: String, ctx: Context): String {
        if (!rawClassName.contains("[")) return rawClassName

        val isLarge = isLargeScreenOrTv(ctx)
        val baseClasses = rawClassName.replace(Regex("\\[.*?\\]"), "").trim()

        if (isLarge) {
            val bracketMatch = Regex("\\[(.*?)\\]").find(rawClassName)
            val bracketClasses = bracketMatch?.groupValues?.get(1) ?: ""
            val merged = "$baseClasses $bracketClasses".trim()
            Log.d(TAG, "📺 Large Screen / TV Detected. Appling Bracketed CSS: $bracketClasses")
            return merged
        }

        return baseClasses
    }
}
