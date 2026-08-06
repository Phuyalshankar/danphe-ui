package io.dolphin.runtime

import android.view.View

/**
 * 🌊 AnimationFactory
 * Resolves Tailwind/CSS animation strings and Titan 24-byte binary bit protocols,
 * dispatching them to KeyframeGenerator.
 */
object AnimationFactory {

    fun dispatchStringAnimation(v: View, animStr: String, parseColor: ((String, Int) -> Int)? = null) {
        if (animStr.isEmpty()) return
        
        KeyframeGenerator.resetViewProperties(v)
        val cleanAnim = animStr.lowercase()

        try {
            when {
                cleanAnim.contains("pulse") -> KeyframeGenerator.pulse(v)
                cleanAnim.contains("float") -> KeyframeGenerator.float(v)
                cleanAnim.contains("shimmer") || cleanAnim.contains("glow") -> KeyframeGenerator.shimmer(v)
                cleanAnim.contains("heartbeat") -> KeyframeGenerator.heartBeat(v)
                cleanAnim.contains("headshake") -> KeyframeGenerator.headShake(v)
                cleanAnim.contains("breathe") -> KeyframeGenerator.breathe(v)
                cleanAnim.contains("ripple") -> KeyframeGenerator.ripple(v)
                cleanAnim.contains("wave") -> KeyframeGenerator.wave(v)
                cleanAnim.contains("tada") -> KeyframeGenerator.tada(v)
                cleanAnim.contains("wobble") -> KeyframeGenerator.wobble(v)
                cleanAnim.contains("jello") -> KeyframeGenerator.jello(v)
                cleanAnim.contains("rubberband") -> KeyframeGenerator.rubberBand(v)
                cleanAnim.contains("swing") -> KeyframeGenerator.swing(v)
                cleanAnim.contains("flash") -> KeyframeGenerator.flash(v)
                cleanAnim.contains("flip") -> KeyframeGenerator.flip(v)
                cleanAnim.contains("zoom") -> KeyframeGenerator.zoomIn(v)

                cleanAnim.contains("slide-left") || cleanAnim.contains("slideleft") -> KeyframeGenerator.slideInLeft(v)
                cleanAnim.contains("slide-right") || cleanAnim.contains("slideright") -> KeyframeGenerator.slideInRight(v)
                cleanAnim.contains("slide-down") -> KeyframeGenerator.slideDown(v)
                cleanAnim.contains("slide-up") || cleanAnim.contains("fadeinup") -> KeyframeGenerator.slideUp(v)
                cleanAnim.contains("slide") -> KeyframeGenerator.slideIn(v)

                cleanAnim.contains("scale") -> KeyframeGenerator.scaleIn(v)
                cleanAnim.contains("rotate") -> KeyframeGenerator.rotateIn(v)
                cleanAnim.contains("bounce") -> KeyframeGenerator.bounceIn(v)
                cleanAnim.contains("shake") -> KeyframeGenerator.shake(v)
                cleanAnim.contains("fade") -> KeyframeGenerator.fadeIn(v)

                cleanAnim.contains("framer-spring") -> KeyframeGenerator.framerSpring(v)

                cleanAnim.startsWith("bg-") && parseColor != null -> KeyframeGenerator.animateBgColor(v, animStr, parseColor)
                cleanAnim.startsWith("animate-") -> KeyframeGenerator.animateProperty(v, animStr)

                else -> KeyframeGenerator.fadeIn(v)
            }
        } catch (e: Exception) {
            v.alpha = 1f
        }
    }

    fun dispatchBinaryAnimation(v: View, sig: Int, config: Int) {
        if (sig and 0x10 == 0) return
        
        KeyframeGenerator.resetViewProperties(v)
        
        val animId = sig and 0x6E
        val loop = (sig and 0x80) != 0
        
        val isTextOrButton = (v is android.widget.TextView)
        val speedCode = if (isTextOrButton) (config shr 5) and 0x07 else (config shr 1) and 0x07
        val duration = (speedCode + 1) * 150L

        try {
            when (animId) {
                0x00 -> KeyframeGenerator.fadeIn(v, duration)
                0x02 -> KeyframeGenerator.bounceIn(v, duration)
                0x04 -> KeyframeGenerator.shake(v, duration)
                0x08 -> KeyframeGenerator.pulse(v, duration)
                0x0A -> KeyframeGenerator.flip(v, duration)
                0x0C -> KeyframeGenerator.slideUp(v, duration)
                0x0E -> KeyframeGenerator.slideDown(v, duration)
                0x1A -> KeyframeGenerator.float(v, duration)
                0x1C -> KeyframeGenerator.ripple(v, duration)
                0x1D -> KeyframeGenerator.wave(v, duration)
                0x20 -> KeyframeGenerator.slideIn(v, duration)
                0x22 -> KeyframeGenerator.slideInLeft(v, duration)
                0x24 -> KeyframeGenerator.slideInRight(v, duration)
                0x26 -> KeyframeGenerator.zoomIn(v, duration)
                0x28 -> KeyframeGenerator.zoomOut(v, duration)
                0x2A -> KeyframeGenerator.flash(v, duration)
                0x2C -> KeyframeGenerator.swing(v, duration)
                0x2E -> KeyframeGenerator.rubberBand(v, duration)
                0x40 -> KeyframeGenerator.scaleIn(v, duration)
                0x42 -> KeyframeGenerator.tada(v, duration)
                0x44 -> KeyframeGenerator.wobble(v, duration)
                0x46 -> KeyframeGenerator.jello(v, duration)
                0x60 -> KeyframeGenerator.rotateIn(v, duration)
                else -> KeyframeGenerator.fadeIn(v, duration)
            }
            
            if (loop) KeyframeGenerator.pulse(v, 1200)
        } catch (e: Exception) {
            v.alpha = 1f
        }
    }
}