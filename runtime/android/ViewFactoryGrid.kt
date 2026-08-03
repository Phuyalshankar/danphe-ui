package io.dolphin.runtime

import android.content.Context
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView

/**
 * 🐬 Grid Layout Extension for ViewFactory
 * Responsive grid system with auto-fit columns
 */

fun ViewFactory.createGridView(bin: ByteArray): View {
    val action = nextStr() // Read action string
    
    // Byte 12: Contains column count in lower 4 bits
    val columns = (bin[12].toInt() and 0x0F).coerceAtLeast(1)
    val gap = ((bin[12].toInt() shr 4) and 0x0F) * 4 // Gap in dp
    
    Log.d("DolphinGrid", "Creating Grid: columns=$columns, gap=$gap")
    
    // Use RecyclerView for efficient grid rendering
    val recyclerView = RecyclerView(ctx).apply {
        layoutParams = LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        )
        
        // Setup grid layout manager
        layoutManager = GridLayoutManager(ctx, columns)
        
        // Add item decoration for spacing
        if (gap > 0) {
            addItemDecoration(GridSpacingDecoration(columns, dp(gap)))
        }
        
        applyStyles(this, bin)
        
        if (action.isNotEmpty()) {
            isClickable = true
            isFocusable = true
            setOnClickListener { onAction?.invoke(action, "Grid") }
        }
    }
    
    // Build child components
    val count = bin[13].toInt() and 0xFF
    val children = mutableListOf<View>()
    
    repeat(count) {
        buildComp()?.let { child ->
            children.add(child)
        }
    }
    
    // Setup adapter
    val adapter = GridAdapter(children)
    recyclerView.adapter = adapter
    
    return recyclerView
}

/**
 * Simple grid adapter for static children
 */
class GridAdapter(private val children: List<View>) : RecyclerView.Adapter<GridAdapter.ViewHolder>() {
    
    class ViewHolder(val view: View) : RecyclerView.ViewHolder(view)
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        // Views are already created, just wrap them
        return ViewHolder(children.getOrNull(viewType) ?: View(parent.context))
    }
    
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        // Nothing to bind, views are pre-built
    }
    
    override fun getItemCount(): Int = children.size
    
    override fun getItemViewType(position: Int): Int = position
}

/**
 * Grid item spacing decoration
 */
class GridSpacingDecoration(
    private val spanCount: Int,
    private val spacing: Int
) : RecyclerView.ItemDecoration() {
    
    override fun getItemOffsets(
        outRect: android.graphics.Rect,
        view: View,
        parent: RecyclerView,
        state: RecyclerView.State
    ) {
        val position = parent.getChildAdapterPosition(view)
        val column = position % spanCount
        
        outRect.left = spacing - column * spacing / spanCount
        outRect.right = (column + 1) * spacing / spanCount
        
        if (position < spanCount) {
            outRect.top = spacing
        }
        outRect.bottom = spacing
    }
}

/**
 * Alternative: Simple Grid using LinearLayouts (lighter weight)
 */
fun ViewFactory.createSimpleGrid(bin: ByteArray): View {
    val action = nextStr()
    
    val columns = (bin[12].toInt() and 0x0F).coerceAtLeast(1)
    val gap = ((bin[12].toInt() shr 4) and 0x0F) * 4
    
    // Main vertical container
    val container = LinearLayout(ctx).apply {
        orientation = LinearLayout.VERTICAL
        layoutParams = LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        )
        
        applyStyles(this, bin)
        
        if (action.isNotEmpty()) {
            isClickable = true
            isFocusable = true
            setOnClickListener { onAction?.invoke(action, "Grid") }
        }
    }
    
    // Build children
    val count = bin[13].toInt() and 0xFF
    val children = mutableListOf<View>()
    
    repeat(count) {
        buildComp()?.let { child ->
            children.add(child)
        }
    }
    
    // Arrange children in rows
    var currentRow: LinearLayout? = null
    
    children.forEachIndexed { index, child ->
        if (index % columns == 0) {
            // Create new row
            currentRow = LinearLayout(ctx).apply {
                orientation = LinearLayout.HORIZONTAL
                layoutParams = LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                ).apply {
                    if (index > 0 && gap > 0) {
                        topMargin = dp(gap)
                    }
                }
            }
            container.addView(currentRow)
        }
        
        // Add child to current row with equal weight
        val childParams = LinearLayout.LayoutParams(
            0,
            ViewGroup.LayoutParams.WRAP_CONTENT,
            1f
        ).apply {
            if (index % columns > 0 && gap > 0) {
                leftMargin = dp(gap)
            }
        }
        child.layoutParams = childParams
        currentRow?.addView(child)
    }
    
    return container
}
