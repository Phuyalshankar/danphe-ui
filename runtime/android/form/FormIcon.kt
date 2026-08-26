package io.dolphin.runtime

import android.content.Context
import android.content.res.ColorStateList
import android.graphics.drawable.Drawable
import androidx.core.content.ContextCompat
import com.google.android.material.textfield.TextInputLayout

/**
 * 🎨 FormIcon — Manages start/end icons, password eye toggle, and icon tinting for form inputs.
 */
object FormIcon {

    fun applyStartIcon(
        ctx: Context,
        layout: TextInputLayout,
        iconName: String,
        iconResId: Int,
        iconColor: Int
    ) {
        val drawable = resolveIconDrawable(ctx, iconName, iconResId)
        if (drawable != null) {
            layout.startIconDrawable = drawable
            layout.setStartIconTintList(ColorStateList.valueOf(iconColor))
        }
    }

    fun applyEndIcon(
        ctx: Context,
        layout: TextInputLayout,
        endIconName: String,
        endIconResId: Int,
        isPassword: Boolean,
        iconColor: Int
    ) {
        if (isPassword) {
            layout.endIconMode = TextInputLayout.END_ICON_PASSWORD_TOGGLE
            layout.setEndIconTintList(ColorStateList.valueOf(iconColor))
        } else {
            val drawable = resolveIconDrawable(ctx, endIconName, endIconResId)
            if (drawable != null) {
                layout.endIconMode = TextInputLayout.END_ICON_CUSTOM
                layout.endIconDrawable = drawable
                layout.setEndIconTintList(ColorStateList.valueOf(iconColor))
            }
        }
    }

    private fun resolveIconDrawable(ctx: Context, iconName: String, iconResId: Int): Drawable? {
        if (iconResId != 0) {
            return ContextCompat.getDrawable(ctx, iconResId)
        }
        if (iconName.isNotEmpty()) {
            val name = iconName.lowercase().trim()
            val systemResId = when (name) {
                "user", "person", "account" -> android.R.drawable.ic_menu_myplaces
                "email", "mail" -> android.R.drawable.ic_dialog_email
                "lock", "password", "key" -> android.R.drawable.ic_lock_lock
                "phone", "call" -> android.R.drawable.ic_menu_call
                "search" -> android.R.drawable.ic_menu_search
                else -> 0
            }
            if (systemResId != 0) {
                return ContextCompat.getDrawable(ctx, systemResId)
            }
        }
        return null
    }
}
