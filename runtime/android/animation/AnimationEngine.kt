package io.dolphin.runtime

import android.animation.ArgbEvaluator
import android.animation.ObjectAnimator
import android.animation.ValueAnimator
import android.view.View
import android.view.animation.AccelerateDecelerateInterpolator
import android.view.animation.OvershootInterpolator
import android.view.animation.AnticipateOvershootInterpolator
import android.view.animation.BounceInterpolator
import android.util.Log

/**
 * 🌊 AnimationEngine
 * Handles all animation logic for Dolphin Native views.
 * Framer Motion Inspired Spring Physics + Full 24-byte Protocol Support.
 */
object AnimationEngine {

    fun apply(v: View, animStr: String, parseColor: ((String, Int) -> Int)? = null) {
        if (animStr.isEmpty()) return
        
        // RESET properties for fresh animation
        v.animate().cancel()
        v.alpha = 1f
        v.scaleX = 1f
        v.scaleY = 1f
        v.translationY = 0f
        v.translationX = 0f
        v.rotation = 0f

        val cleanAnim = animStr.lowercase()

        try {
            when {
                // ─── TAILWIND & NATIVE ANIMATION UTILITIES ───────────────────────
                cleanAnim.contains("pulse") -> pulse(v)
                cleanAnim.contains("float") -> float(v)
                cleanAnim.contains("shimmer") || cleanAnim.contains("glow") -> shimmer(v)
                cleanAnim.contains("heartbeat") -> heartBeat(v)
                cleanAnim.contains("headshake") -> headShake(v)
                cleanAnim.contains("breathe") -> breathe(v)
                cleanAnim.contains("ripple") -> ripple(v)
                cleanAnim.contains("wave") -> wave(v)
                cleanAnim.contains("tada") -> tada(v)
                cleanAnim.contains("wobble") -> wobble(v)
                cleanAnim.contains("jello") -> jello(v)
                cleanAnim.contains("rubberband") -> rubberBand(v)
                cleanAnim.contains("swing") -> swing(v)
                cleanAnim.contains("flash") -> flash(v)
                cleanAnim.contains("flip") -> flip(v)
                cleanAnim.contains("zoom") -> zoomIn(v)

                // Slide variants
                cleanAnim.contains("slide-left") || cleanAnim.contains("slideleft") -> slideInLeft(v)
                cleanAnim.contains("slide-right") || cleanAnim.contains("slideright") -> slideInRight(v)
                cleanAnim.contains("slide-down") -> slideDown(v)
                cleanAnim.contains("slide-up") || cleanAnim.contains("fadeinup") -> slideUp(v)
                cleanAnim.contains("slide") -> slideIn(v)

                // Scale / Rotate / Bounce / Shake / Fade
                cleanAnim.contains("scale") -> scaleIn(v)
                cleanAnim.contains("rotate") -> rotateIn(v)
                cleanAnim.contains("bounce") -> bounceIn(v)
                cleanAnim.contains("shake") -> shake(v)
                cleanAnim.contains("fade") -> fadeIn(v)

                // Framer motion fallbacks
                cleanAnim.contains("framer-spring") -> {
                    v.scaleX = 0.5f; v.scaleY = 0.5f; v.alpha = 0f
                    v.animate().scaleX(1f).scaleY(1f).alpha(1f).setDuration(600).setInterpolator(AnticipateOvershootInterpolator(1.5f)).start()
                }

                // Animated background color: bg-blue-100-200-500ms
                cleanAnim.startsWith("bg-") && parseColor != null -> animateBgColor(v, animStr, parseColor)

                // PROPERTY ANIMATION: animate-w-100-200-500ms
                cleanAnim.startsWith("animate-") -> animateProperty(v, animStr)

                // Default: fade in
                else -> fadeIn(v)
            }
        } catch (e: Exception) {
            v.alpha = 1f
        }
    }

    private fun animateProperty(v: View, animStr: String) {
        val regex = Regex("""^animate-([a-z]+)-(\d+)-(\d+)-(\d+)(ms|s)$""")
        val match = regex.find(animStr) ?: return
        val (prop, from, to, dur, unit) = match.destructured
        val durationMs = if (unit == "s") dur.toLong() * 1000 else dur.toLong()
        val f = from.toFloat()
        val t = to.toFloat()

        val density = v.context.resources.displayMetrics.density

        val anim = ValueAnimator.ofFloat(f, t)
        anim.duration = durationMs
        anim.interpolator = AccelerateDecelerateInterpolator()
        anim.addUpdateListener { animator ->
            val value = animator.animatedValue as Float
            val scaled = (value * density).toInt()
            val lp = v.layoutParams
            when (prop) {
                "w" -> { lp.width = scaled; v.layoutParams = lp }
                "h" -> { lp.height = scaled; v.layoutParams = lp }
                "p" -> v.setPadding(scaled, scaled, scaled, scaled)
                "m" -> {
                    if (lp is android.view.ViewGroup.MarginLayoutParams) {
                        lp.setMargins(scaled, scaled, scaled, scaled)
                        v.layoutParams = lp
                    }
                }
                "scale" -> {
                    v.scaleX = value / 100f
                    v.scaleY = value / 100f
                }
                "opacity" -> v.alpha = value / 100f
            }
        }
        anim.start()
    }

    /**
     * MCU-Style Binary Animation Engine
     * Uses bit toggling from Signature Byte (15) and Config Byte (12)
     */
    fun applyBinary(v: View, sig: Int, config: Int) {
        if (sig and 0x10 == 0) return
        
        v.animate().cancel()
        v.alpha = 1f; v.scaleX = 1f; v.scaleY = 1f
        v.translationY = 0f; v.translationX = 0f; v.rotation = 0f
        
        val animId = sig and 0x6E
        val loop = (sig and 0x80) != 0
        
        val isTextOrButton = (v is android.widget.TextView)
        val speedCode = if (isTextOrButton) (config shr 5) and 0x07 else (config shr 1) and 0x07
        val duration = (speedCode + 1) * 150L

        try {
            when (animId) {
                0x00 -> fadeIn(v, duration)
                0x02 -> bounceIn(v, duration)
                0x04 -> shake(v, duration)
                0x08 -> pulse(v, duration)
                0x0A -> flip(v, duration)
                0x0C -> slideUp(v, duration)
                0x0E -> slideDown(v, duration)
                0x1A -> float(v, duration)
                0x1C -> ripple(v, duration)
                0x1D -> wave(v, duration)
                0x20 -> slideIn(v, duration)
                0x22 -> slideInLeft(v, duration)
                0x24 -> slideInRight(v, duration)
                0x26 -> zoomIn(v, duration)
                0x28 -> zoomOut(v, duration)
                0x2A -> flash(v, duration)
                0x2C -> swing(v, duration)
                0x2E -> rubberBand(v, duration)
                0x40 -> scaleIn(v, duration)
                0x42 -> tada(v, duration)
                0x44 -> wobble(v, duration)
                0x46 -> jello(v, duration)
                0x60 -> rotateIn(v, duration)
                else -> fadeIn(v, duration)
            }
            
            if (loop) pulse(v, 1200)
        } catch (e: Exception) {
            v.alpha = 1f
        }
    }

    // ── Individual Animations ──────────────────────────────

    private fun fadeIn(v: View, dur: Long = 400) {
        v.alpha = 0f
        v.animate().alpha(1f).setDuration(dur).setInterpolator(AccelerateDecelerateInterpolator()).start()
    }

    private fun slideIn(v: View, dur: Long = 350) {
        v.translationX = -200f; v.alpha = 0f
        v.animate().translationX(0f).alpha(1f).setDuration(dur).start()
    }

    private fun slideInLeft(v: View, dur: Long = 350) {
        v.translationX = -400f; v.alpha = 0f
        v.animate().translationX(0f).alpha(1f).setDuration(dur).start()
    }

    private fun slideInRight(v: View, dur: Long = 350) {
        v.translationX = 400f; v.alpha = 0f
        v.animate().translationX(0f).alpha(1f).setDuration(dur).start()
    }

    private fun slideUp(v: View, dur: Long = 350) {
        v.translationY = 200f; v.alpha = 0f
        v.animate().translationY(0f).alpha(1f).setDuration(dur).start()
    }

    private fun slideDown(v: View, dur: Long = 350) {
        v.translationY = -200f; v.alpha = 0f
        v.animate().translationY(0f).alpha(1f).setDuration(dur).start()
    }

    private fun scaleIn(v: View, dur: Long = 400) {
        v.scaleX = 0f; v.scaleY = 0f; v.alpha = 0f
        v.animate().scaleX(1f).scaleY(1f).alpha(1f).setDuration(dur).setInterpolator(OvershootInterpolator(1.2f)).start()
    }

    private fun rotateIn(v: View, dur: Long = 400) {
        v.rotation = -360f
        v.animate().rotation(0f).setDuration(dur).setInterpolator(AccelerateDecelerateInterpolator()).start()
    }

    private fun bounceIn(v: View, dur: Long = 600) {
        v.translationY = -200f; v.alpha = 0f
        v.animate().translationY(0f).alpha(1f).setDuration(dur).setInterpolator(BounceInterpolator()).start()
    }

    private fun pulse(v: View, dur: Long = 1000) {
        val anim = ObjectAnimator.ofFloat(v, "scaleX", 1f, 1.08f, 1f)
        val animY = ObjectAnimator.ofFloat(v, "scaleY", 1f, 1.08f, 1f)
        anim.duration = dur; animY.duration = dur
        anim.repeatCount = ValueAnimator.INFINITE; animY.repeatCount = ValueAnimator.INFINITE
        anim.start(); animY.start()
    }

    private fun breathe(v: View, dur: Long = 1200) {
        pulse(v, dur)
    }

    private fun float(v: View, dur: Long = 1400) {
        val density = v.context.resources.displayMetrics.density
        val anim = ObjectAnimator.ofFloat(v, "translationY", 0f, -12f * density, 0f)
        anim.duration = dur
        anim.repeatCount = ValueAnimator.INFINITE
        anim.interpolator = AccelerateDecelerateInterpolator()
        anim.start()
    }

    private fun shimmer(v: View, dur: Long = 1000) {
        val anim = ObjectAnimator.ofFloat(v, "alpha", 1f, 0.4f, 1f)
        anim.duration = dur
        anim.repeatCount = ValueAnimator.INFINITE
        anim.start()
    }

    private fun ripple(v: View, dur: Long = 600) {
        v.scaleX = 0.2f; v.scaleY = 0.2f; v.alpha = 0.9f
        v.animate().scaleX(1.4f).scaleY(1.4f).alpha(0f).setDuration(dur).start()
    }

    private fun wave(v: View, dur: Long = 800) {
        val anim = ObjectAnimator.ofFloat(v, "rotation", 0f, 20f, -20f, 15f, -10f, 0f)
        anim.duration = dur
        anim.start()
    }

    private fun heartBeat(v: View, dur: Long = 900) {
        val sX = ObjectAnimator.ofFloat(v, "scaleX", 1f, 1.25f, 1f, 1.25f, 1f)
        val sY = ObjectAnimator.ofFloat(v, "scaleY", 1f, 1.25f, 1f, 1.25f, 1f)
        sX.duration = dur; sY.duration = dur
        sX.start(); sY.start()
    }

    private fun headShake(v: View, dur: Long = 600) {
        val tX = ObjectAnimator.ofFloat(v, "translationX", 0f, -8f, 6f, -4f, 2f, 0f)
        val rot = ObjectAnimator.ofFloat(v, "rotation", 0f, -4f, 4f, -2f, 1f, 0f)
        tX.duration = dur; rot.duration = dur
        tX.start(); rot.start()
    }

    private fun shake(v: View, dur: Long = 500) {
        val anim = ObjectAnimator.ofFloat(v, "translationX", 0f, 25f, -25f, 20f, -20f, 15f, -15f, 0f)
        anim.duration = dur; anim.start()
    }

    private fun flash(v: View, dur: Long = 600) {
        val anim = ObjectAnimator.ofFloat(v, "alpha", 1f, 0f, 1f, 0f, 1f)
        anim.duration = dur; anim.start()
    }

    private fun flip(v: View, dur: Long = 600) {
        v.rotationY = -180f
        v.animate().rotationY(0f).setDuration(dur).setInterpolator(AccelerateDecelerateInterpolator()).start()
    }

    private fun zoomIn(v: View, dur: Long = 500) {
        v.scaleX = 0.3f; v.scaleY = 0.3f; v.alpha = 0f
        v.animate().scaleX(1f).scaleY(1f).alpha(1f).setDuration(dur).start()
    }

    private fun zoomOut(v: View, dur: Long = 500) {
        v.scaleX = 1.5f; v.scaleY = 1.5f; v.alpha = 0f
        v.animate().scaleX(1f).scaleY(1f).alpha(1f).setDuration(dur).start()
    }

    private fun swing(v: View, dur: Long = 700) {
        val anim = ObjectAnimator.ofFloat(v, "rotation", 0f, 15f, -10f, 5f, -5f, 0f)
        anim.duration = dur; anim.start()
    }

    private fun tada(v: View, dur: Long = 800) {
        val sX = ObjectAnimator.ofFloat(v, "scaleX", 1f, 0.9f, 0.9f, 1.1f, 1.1f, 1.1f, 1.1f, 1.1f, 1.1f, 1f)
        val sY = ObjectAnimator.ofFloat(v, "scaleY", 1f, 0.9f, 0.9f, 1.1f, 1.1f, 1.1f, 1.1f, 1.1f, 1.1f, 1f)
        val rot = ObjectAnimator.ofFloat(v, "rotation", 0f, -3f, -3f, 3f, -3f, 3f, -3f, 3f, -3f, 0f)
        sX.duration = dur; sY.duration = dur; rot.duration = dur
        sX.start(); sY.start(); rot.start()
    }

    private fun rubberBand(v: View, dur: Long = 800) {
        val sX = ObjectAnimator.ofFloat(v, "scaleX", 1f, 1.25f, 0.75f, 1.15f, 0.95f, 1.05f, 1f)
        val sY = ObjectAnimator.ofFloat(v, "scaleY", 1f, 0.75f, 1.25f, 0.85f, 1.05f, 0.95f, 1f)
        sX.duration = dur; sY.duration = dur; sX.start(); sY.start()
    }

    private fun wobble(v: View, dur: Long = 800) {
        val tX = ObjectAnimator.ofFloat(v, "translationX", 0f, -25f, 20f, -15f, 10f, -5f, 0f)
        val rot = ObjectAnimator.ofFloat(v, "rotation", 0f, -5f, 3f, -3f, 2f, -1f, 0f)
        tX.duration = dur; rot.duration = dur; tX.start(); rot.start()
    }

    private fun jello(v: View, dur: Long = 800) {
        val anim = ObjectAnimator.ofFloat(v, "rotation", 0f, -12.5f, 6.25f, -3.125f, 1.5625f, -0.78125f, 0.390625f, 0f)
        anim.duration = dur; anim.start()
    }

    private fun animateBgColor(v: View, animStr: String, parseColor: (String, Int) -> Int) {
        val regex = Regex("""^bg-([a-z]+)-(\d+)-(\d+)-(\d+)(ms|s)$""")
        val match = regex.find(animStr) ?: return fadeIn(v, 400)
        val (colorName, fromShade, toShade, dur, unit) = match.destructured
        val durationMs = if (unit == "s") dur.toLong() * 1000 else dur.toLong()
        val c1 = parseColor(colorName, fromShade.toInt())
        val c2 = parseColor(colorName, toShade.toInt())
        val anim = ValueAnimator.ofObject(ArgbEvaluator(), c1, c2)
        anim.duration = durationMs
        anim.addUpdateListener { v.setBackgroundColor(it.animatedValue as Int) }
        anim.start()
    }
}
