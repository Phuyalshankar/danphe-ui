package io.dolphin.runtime

import android.animation.ArgbEvaluator
import android.animation.ObjectAnimator
import android.animation.ValueAnimator
import android.view.View
import android.view.animation.AccelerateDecelerateInterpolator
import android.view.animation.AnticipateOvershootInterpolator
import android.view.animation.BounceInterpolator
import android.view.animation.OvershootInterpolator

/**
 * 🌊 KeyframeGenerator
 * Houses all 20+ Android View PropertyAnimators and Spring Physics Keyframes.
 */
object KeyframeGenerator {

    fun resetViewProperties(v: View) {
        v.animate().cancel()
        v.alpha = 1f
        v.scaleX = 1f
        v.scaleY = 1f
        v.translationY = 0f
        v.translationX = 0f
        v.rotation = 0f
    }

    fun animateProperty(v: View, animStr: String) {
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

    fun animateBgColor(v: View, animStr: String, parseColor: (String, Int) -> Int) {
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

    fun framerSpring(v: View) {
        v.scaleX = 0.5f; v.scaleY = 0.5f; v.alpha = 0f
        v.animate().scaleX(1f).scaleY(1f).alpha(1f).setDuration(600).setInterpolator(AnticipateOvershootInterpolator(1.5f)).start()
    }

    fun fadeIn(v: View, dur: Long = 400) {
        v.alpha = 0f
        v.animate().alpha(1f).setDuration(dur).setInterpolator(AccelerateDecelerateInterpolator()).start()
    }

    fun slideIn(v: View, dur: Long = 350) {
        v.translationX = -200f; v.alpha = 0f
        v.animate().translationX(0f).alpha(1f).setDuration(dur).start()
    }

    fun slideInLeft(v: View, dur: Long = 350) {
        v.translationX = -400f; v.alpha = 0f
        v.animate().translationX(0f).alpha(1f).setDuration(dur).start()
    }

    fun slideInRight(v: View, dur: Long = 350) {
        v.translationX = 400f; v.alpha = 0f
        v.animate().translationX(0f).alpha(1f).setDuration(dur).start()
    }

    fun slideUp(v: View, dur: Long = 350) {
        v.translationY = 200f; v.alpha = 0f
        v.animate().translationY(0f).alpha(1f).setDuration(dur).start()
    }

    fun slideDown(v: View, dur: Long = 350) {
        v.translationY = -200f; v.alpha = 0f
        v.animate().translationY(0f).alpha(1f).setDuration(dur).start()
    }

    fun scaleIn(v: View, dur: Long = 400) {
        v.scaleX = 0f; v.scaleY = 0f; v.alpha = 0f
        v.animate().scaleX(1f).scaleY(1f).alpha(1f).setDuration(dur).setInterpolator(OvershootInterpolator(1.2f)).start()
    }

    fun rotateIn(v: View, dur: Long = 400) {
        v.rotation = -360f
        v.animate().rotation(0f).setDuration(dur).setInterpolator(AccelerateDecelerateInterpolator()).start()
    }

    fun bounceIn(v: View, dur: Long = 600) {
        v.translationY = -200f; v.alpha = 0f
        v.animate().translationY(0f).alpha(1f).setDuration(dur).setInterpolator(BounceInterpolator()).start()
    }

    fun pulse(v: View, dur: Long = 1000) {
        val anim = ObjectAnimator.ofFloat(v, "scaleX", 1f, 1.08f, 1f)
        val animY = ObjectAnimator.ofFloat(v, "scaleY", 1f, 1.08f, 1f)
        anim.duration = dur; animY.duration = dur
        anim.repeatCount = ValueAnimator.INFINITE; animY.repeatCount = ValueAnimator.INFINITE
        anim.start(); animY.start()
    }

    fun breathe(v: View, dur: Long = 1200) {
        pulse(v, dur)
    }

    fun float(v: View, dur: Long = 1400) {
        val density = v.context.resources.displayMetrics.density
        val anim = ObjectAnimator.ofFloat(v, "translationY", 0f, -12f * density, 0f)
        anim.duration = dur
        anim.repeatCount = ValueAnimator.INFINITE
        anim.interpolator = AccelerateDecelerateInterpolator()
        anim.start()
    }

    fun shimmer(v: View, dur: Long = 1000) {
        val anim = ObjectAnimator.ofFloat(v, "alpha", 1f, 0.4f, 1f)
        anim.duration = dur
        anim.repeatCount = ValueAnimator.INFINITE
        anim.start()
    }

    fun ripple(v: View, dur: Long = 600) {
        v.scaleX = 0.2f; v.scaleY = 0.2f; v.alpha = 0.9f
        v.animate().scaleX(1.4f).scaleY(1.4f).alpha(0f).setDuration(dur).start()
    }

    fun wave(v: View, dur: Long = 800) {
        val anim = ObjectAnimator.ofFloat(v, "rotation", 0f, 20f, -20f, 15f, -10f, 0f)
        anim.duration = dur
        anim.start()
    }

    fun heartBeat(v: View, dur: Long = 900) {
        val sX = ObjectAnimator.ofFloat(v, "scaleX", 1f, 1.25f, 1f, 1.25f, 1f)
        val sY = ObjectAnimator.ofFloat(v, "scaleY", 1f, 1.25f, 1f, 1.25f, 1f)
        sX.duration = dur; sY.duration = dur
        sX.start(); sY.start()
    }

    fun headShake(v: View, dur: Long = 600) {
        val tX = ObjectAnimator.ofFloat(v, "translationX", 0f, -8f, 6f, -4f, 2f, 0f)
        val rot = ObjectAnimator.ofFloat(v, "rotation", 0f, -4f, 4f, -2f, 1f, 0f)
        tX.duration = dur; rot.duration = dur
        tX.start(); rot.start()
    }

    fun shake(v: View, dur: Long = 500) {
        val anim = ObjectAnimator.ofFloat(v, "translationX", 0f, 25f, -25f, 20f, -20f, 15f, -15f, 0f)
        anim.duration = dur; anim.start()
    }

    fun flash(v: View, dur: Long = 600) {
        val anim = ObjectAnimator.ofFloat(v, "alpha", 1f, 0f, 1f, 0f, 1f)
        anim.duration = dur; anim.start()
    }

    fun flip(v: View, dur: Long = 600) {
        v.rotationY = -180f
        v.animate().rotationY(0f).setDuration(dur).setInterpolator(AccelerateDecelerateInterpolator()).start()
    }

    fun zoomIn(v: View, dur: Long = 500) {
        v.scaleX = 0.3f; v.scaleY = 0.3f; v.alpha = 0f
        v.animate().scaleX(1f).scaleY(1f).alpha(1f).setDuration(dur).start()
    }

    fun zoomOut(v: View, dur: Long = 500) {
        v.scaleX = 1.5f; v.scaleY = 1.5f; v.alpha = 0f
        v.animate().scaleX(1f).scaleY(1f).alpha(1f).setDuration(dur).start()
    }

    fun swing(v: View, dur: Long = 700) {
        val anim = ObjectAnimator.ofFloat(v, "rotation", 0f, 15f, -10f, 5f, -5f, 0f)
        anim.duration = dur; anim.start()
    }

    fun tada(v: View, dur: Long = 800) {
        val sX = ObjectAnimator.ofFloat(v, "scaleX", 1f, 0.9f, 0.9f, 1.1f, 1.1f, 1.1f, 1.1f, 1.1f, 1.1f, 1f)
        val sY = ObjectAnimator.ofFloat(v, "scaleY", 1f, 0.9f, 0.9f, 1.1f, 1.1f, 1.1f, 1.1f, 1.1f, 1.1f, 1f)
        val rot = ObjectAnimator.ofFloat(v, "rotation", 0f, -3f, -3f, 3f, -3f, 3f, -3f, 3f, -3f, 0f)
        sX.duration = dur; sY.duration = dur; rot.duration = dur
        sX.start(); sY.start(); rot.start()
    }

    fun rubberBand(v: View, dur: Long = 800) {
        val sX = ObjectAnimator.ofFloat(v, "scaleX", 1f, 1.25f, 0.75f, 1.15f, 0.95f, 1.05f, 1f)
        val sY = ObjectAnimator.ofFloat(v, "scaleY", 1f, 0.75f, 1.25f, 0.85f, 1.05f, 0.95f, 1f)
        sX.duration = dur; sY.duration = dur; sX.start(); sY.start()
    }

    fun wobble(v: View, dur: Long = 800) {
        val tX = ObjectAnimator.ofFloat(v, "translationX", 0f, -25f, 20f, -15f, 10f, -5f, 0f)
        val rot = ObjectAnimator.ofFloat(v, "rotation", 0f, -5f, 3f, -3f, 2f, -1f, 0f)
        tX.duration = dur; rot.duration = dur; tX.start(); rot.start()
    }

    fun jello(v: View, dur: Long = 800) {
        val anim = ObjectAnimator.ofFloat(v, "rotation", 0f, -12.5f, 6.25f, -3.125f, 1.5625f, -0.78125f, 0.390625f, 0f)
        anim.duration = dur; anim.start()
    }
}