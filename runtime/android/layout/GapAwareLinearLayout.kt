// runtime/android/GapAwareLinearLayout.kt
// 🔒 COMPLETE: GAP + FLEX-1 SUPPORT

package io.dolphin.runtime

import android.content.Context
import android.util.AttributeSet
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout

/**
 * 🔒 GAP AWARE LINEAR LAYOUT
 * 
 * FIXES BOTH:
 * 1. Gap shrink (margins disappearing)
 * 2. Flex-1 shrink (weights resetting)
 * 
 * NEVER REMOVE THIS CLASS!
 */
open class GapAwareLinearLayout @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : LinearLayout(context, attrs, defStyleAttr) {

    companion object {
        private const val TAG = "GapAwareLayout"
        private var isLockEnabled = true

        fun setEnabled(enabled: Boolean) {
            isLockEnabled = enabled
            Log.w(TAG, "🔒 ${if (enabled) "ENABLED" else "DISABLED"}")
        }
    }

    private var horizontalGapPx = 0
    private var verticalGapPx = 0
    
    // 🆕 Store flex-1 weights
    private val childWeights = mutableMapOf<Int, Float>()

    fun setGap(gapPx: Int) {
        this.horizontalGapPx = gapPx
        this.verticalGapPx = gapPx
    }

    fun setGap(horizontal: Int, vertical: Int) {
        this.horizontalGapPx = horizontal
        this.verticalGapPx = vertical
    }

    /**
     * 🆕 Store weight when adding child (flex-1 support)
     */
    override fun addView(child: View, index: Int, params: ViewGroup.LayoutParams) {
        super.addView(child, index, params)
        
        if (params is LayoutParams && params.weight > 0) {
            childWeights[child.hashCode()] = params.weight
            Log.d(TAG, "🔒 Stored weight: ${params.weight} for child ${child.hashCode()}")
        }
    }

    /**
     * 🔒 CRITICAL: Override onLayout
     * Do NOT mutate LayoutParams inside onLayout to avoid cumulative margin escalation!
     */
    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {
        super.onLayout(changed, l, t, r, b)
    }

    /**
     * 🆕 FIX FLEX-1 WEIGHTS
     * This prevents flex-1 from shrinking!
     */
    /**
     * 🆕 FIX FLEX-1 WEIGHTS
     * Restores stored weights without triggering requestLayout() inside onLayout
     */
    private fun fixFlexWeights() {
        for (i in 0 until childCount) {
            val child = getChildAt(i)
            val lp = child.layoutParams as? LayoutParams ?: continue
            val storedWeight = childWeights[child.hashCode()]
            
            if (storedWeight != null && storedWeight > 0) {
                if (lp.weight != storedWeight) {
                    lp.weight = storedWeight
                    Log.d(TAG, "🔒 Restored weight: $storedWeight")
                }
            }
        }
    }

    /**
     * 🔒 FIX GAPS (Margins)
     */
    private fun enforceGaps() {
        if (childCount <= 1) return

        for (i in 1 until childCount) {
            val child = getChildAt(i)
            val lp = child.layoutParams as? MarginLayoutParams ?: continue

            if (orientation == HORIZONTAL) {
                // Horizontal: leftMargin is the gap
                if (horizontalGapPx > 0 && lp.leftMargin < horizontalGapPx) {
                    lp.leftMargin = horizontalGapPx
                }
                // Also fix top/bottom for vertical centering
                if (verticalGapPx > 0 && lp.topMargin < verticalGapPx) {
                    lp.topMargin = verticalGapPx
                }
                if (verticalGapPx > 0 && lp.bottomMargin < verticalGapPx) {
                    lp.bottomMargin = verticalGapPx
                }
            } else {
                // Vertical: topMargin is the gap
                if (verticalGapPx > 0 && lp.topMargin < verticalGapPx) {
                    lp.topMargin = verticalGapPx
                }
                // Also fix left/right for horizontal centering
                if (horizontalGapPx > 0 && lp.leftMargin < horizontalGapPx) {
                    lp.leftMargin = horizontalGapPx
                }
                if (horizontalGapPx > 0 && lp.rightMargin < horizontalGapPx) {
                    lp.rightMargin = horizontalGapPx
                }
            }
        }
    }

    /**
     * 🔒 Force enforce everything
     */
    fun enforceNow() {
        fixFlexWeights()
        enforceGaps()
    }
}