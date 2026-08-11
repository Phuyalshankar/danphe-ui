package io.dolphin.runtime

import android.graphics.drawable.GradientDrawable
import android.util.Log
import android.view.View
import android.widget.EditText
import android.widget.TextView
import com.google.android.material.button.MaterialButton
import com.google.android.material.card.MaterialCardView

/**
 * 🐬 StateBinder - Native View Property Applier
 * Applies reactive state property bindings to Android Native Views efficiently.
 */
object StateBinder {

    fun apply(view: View, property: DolphinStateEngine.Property, value: Any, colorCode: Int, anim: DolphinStateEngine.AnimSpec?) {
        try {
            when (property) {
                DolphinStateEngine.Property.TEXT -> if (view is TextView) {
                    view.text = value.toString()
                    view.visibility = View.VISIBLE
                    view.invalidate()
                }

                DolphinStateEngine.Property.INPUT_VALUE -> {
                    val editText: EditText? = when (view) {
                        is com.google.android.material.textfield.TextInputEditText -> view
                        is EditText -> view
                        is com.google.android.material.textfield.TextInputLayout -> view.editText
                        else -> null
                    }
                    if (editText != null && !editText.isFocused) {
                        val newStr = value.toString()
                        if (editText.text?.toString() != newStr) {
                            editText.setText(newStr)
                            if (newStr.isNotEmpty()) editText.setSelection(newStr.length)
                        }
                    }
                }

                DolphinStateEngine.Property.BG_SHADE -> {
                    val shade = (StateHelpers.toNumber(value)).toInt().coerceIn(0, 255)
                    val color = ColorParser.parseColor(colorCode, shade)
                    when (view) {
                        is MaterialCardView -> {
                            view.setCardBackgroundColor(android.content.res.ColorStateList.valueOf(color))
                        }
                        is MaterialButton -> {
                            view.backgroundTintList = android.content.res.ColorStateList.valueOf(color)
                        }
                        else -> {
                            val gd = view.background as? android.graphics.drawable.GradientDrawable
                            if (gd != null) {
                                gd.setColor(color)
                            } else {
                                view.setBackgroundColor(color)
                            }
                        }
                    }
                }

                DolphinStateEngine.Property.ALPHA -> {
                    val alpha = (StateHelpers.toNumber(value) / 100.0).toFloat().coerceIn(0f, 1f)
                    if (StateHelpers.shouldAnimate(property, anim)) {
                        view.animate()
                            .alpha(alpha)
                            .setDuration(anim!!.durationMs)
                            .setInterpolator(StateHelpers.interpolatorFor(anim.ease))
                            .start()
                    } else {
                        view.alpha = alpha
                    }
                }

                DolphinStateEngine.Property.TEXT_SIZE -> {
                    if (view is TextView) {
                        val size = StateHelpers.toNumber(value).toFloat().coerceIn(8f, 100f)
                        view.textSize = size
                    }
                }

                DolphinStateEngine.Property.VISIBILITY -> {
                    val visible = when (value) {
                        is Boolean -> value
                        is Number -> value.toInt() != 0
                        else -> value.toString() == "true"
                    }
                    view.visibility = if (visible) View.VISIBLE else View.GONE
                }

                DolphinStateEngine.Property.IMAGE -> {
                    if (view is android.widget.ImageView) {
                        DolphinStateEngine.imageLoader?.invoke(view, value.toString())
                    }
                }

                DolphinStateEngine.Property.WIDTH -> {
                    val width = StateHelpers.toLayoutDimension(view, value)
                    StateHelpers.updateLayout(view) { lp -> lp.width = width }
                }

                DolphinStateEngine.Property.HEIGHT -> {
                    val height = StateHelpers.toLayoutDimension(view, value)
                    StateHelpers.updateLayout(view) { lp -> lp.height = height }
                }

                DolphinStateEngine.Property.PADDING -> {
                    val padding = StateHelpers.dp(view, StateHelpers.toNumber(value).toInt().coerceAtLeast(0))
                    view.setPadding(padding, padding, padding, padding)
                    view.requestLayout()
                }

                DolphinStateEngine.Property.RADIUS -> {
                    val radiusPx = StateHelpers.dp(view, StateHelpers.toNumber(value).toInt().coerceAtLeast(0)).toFloat()
                    when (view) {
                        is MaterialCardView -> view.radius = radiusPx
                        is MaterialButton -> view.cornerRadius = radiusPx.toInt()
                        else -> {
                            val bg = (view.background as? GradientDrawable) ?: GradientDrawable().also { drawable ->
                                drawable.setColor(android.graphics.Color.TRANSPARENT)
                                view.background = drawable
                            }
                            bg.cornerRadius = radiusPx
                        }
                    }
                    view.invalidate()
                }

                DolphinStateEngine.Property.TRANSLATE_X -> {
                    val tx = StateHelpers.dp(view, StateHelpers.toNumber(value).toInt()).toFloat()
                    if (StateHelpers.shouldAnimate(property, anim)) {
                        view.animate()
                            .translationX(tx)
                            .setDuration(anim!!.durationMs)
                            .setInterpolator(StateHelpers.interpolatorFor(anim.ease))
                            .start()
                    } else {
                        view.translationX = tx
                    }
                }

                DolphinStateEngine.Property.TRANSLATE_Y -> {
                    val ty = StateHelpers.dp(view, StateHelpers.toNumber(value).toInt()).toFloat()
                    if (StateHelpers.shouldAnimate(property, anim)) {
                        view.animate()
                            .translationY(ty)
                            .setDuration(anim!!.durationMs)
                            .setInterpolator(StateHelpers.interpolatorFor(anim.ease))
                            .start()
                    } else {
                        view.translationY = ty
                    }
                }

                DolphinStateEngine.Property.SCALE -> {
                    val scale = StateHelpers.toScale(value)
                    if (StateHelpers.shouldAnimate(property, anim)) {
                        view.animate()
                            .scaleX(scale)
                            .scaleY(scale)
                            .setDuration(anim!!.durationMs)
                            .setInterpolator(StateHelpers.interpolatorFor(anim.ease))
                            .start()
                    } else {
                        view.scaleX = scale
                        view.scaleY = scale
                    }
                }

                DolphinStateEngine.Property.SCALE_X -> {
                    val sx = StateHelpers.toScale(value)
                    if (StateHelpers.shouldAnimate(property, anim)) {
                        view.animate()
                            .scaleX(sx)
                            .setDuration(anim!!.durationMs)
                            .setInterpolator(StateHelpers.interpolatorFor(anim.ease))
                            .start()
                    } else {
                        view.scaleX = sx
                    }
                }

                DolphinStateEngine.Property.SCALE_Y -> {
                    val sy = StateHelpers.toScale(value)
                    if (StateHelpers.shouldAnimate(property, anim)) {
                        view.animate()
                            .scaleY(sy)
                            .setDuration(anim!!.durationMs)
                            .setInterpolator(StateHelpers.interpolatorFor(anim.ease))
                            .start()
                    } else {
                        view.scaleY = sy
                    }
                }

                DolphinStateEngine.Property.ROTATION -> {
                    val rot = StateHelpers.toNumber(value).toFloat()
                    val applyRotation: () -> Unit = {
                        val w = if (view.width > 0) view.width.toFloat() else view.measuredWidth.toFloat()
                        val h = if (view.height > 0) view.height.toFloat() else view.measuredHeight.toFloat()
                        if (w > 0f && h > 0f) {
                            view.pivotX = w / 2f
                            view.pivotY = h / 2f
                        }
                        if (StateHelpers.shouldAnimate(property, anim)) {
                            view.animate()
                                .rotation(rot)
                                .setDuration(anim!!.durationMs)
                                .setInterpolator(StateHelpers.interpolatorFor(anim.ease))
                                .start()
                        } else {
                            view.rotation = rot
                        }
                    }

                    if (view.width > 0 && view.height > 0) {
                        applyRotation()
                    } else {
                        view.post(applyRotation)
                        view.addOnLayoutChangeListener(object : View.OnLayoutChangeListener {
                            override fun onLayoutChange(v: View, l: Int, t: Int, r: Int, b: Int, ol: Int, ot: Int, or: Int, ob: Int) {
                                v.removeOnLayoutChangeListener(this)
                                applyRotation()
                            }
                        })
                    }
                }

                DolphinStateEngine.Property.ELEVATION -> {
                    val elevationPx = StateHelpers.dp(view, StateHelpers.toNumber(value).toInt().coerceAtLeast(0)).toFloat()
                    when (view) {
                        is MaterialCardView -> {
                            view.cardElevation = elevationPx
                            view.maxCardElevation = elevationPx
                        }
                        else -> view.elevation = elevationPx
                    }
                }
            }
        } catch (e: Exception) {
            Log.e("DolphinState", "ApplyBinding failed for $property", e)
        }
    }
}