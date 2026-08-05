package io.dolphin.runtime

import android.content.Context
import android.graphics.Color
import android.util.Log
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import com.google.android.material.button.MaterialButton

/**
 * 🐬 TabBar Builder (Opcode: 0x27)
 * ✅ Type="tabbar" Support
 * ✅ Never disappears
 * ✅ CSS apply (Single Source of Truth)
 */
class TabBuilder : ComponentBuilder {
    
    companion object {
        private const val TAG = "TabBuilder"
        const val TABBAR_ID = 9999
        const val TABBAR_TYPE = "tabbar"
        
        // ✅ Singleton instance
        private var tabbarInstance: LinearLayout? = null
        private var tabButtons = mutableListOf<MaterialButton>()
        private var isInitialized = false
        
        // ✅ State cache
        private var activeTabKey = "Home"
        private var tabDataList = mutableListOf<TabData>()
        
        data class TabData(
            val key: String,
            val label: String,
            val icon: String,
            val action: String
        )
    }
    
    override fun getType(): Int = 0x27
    override fun getName(): String = "TabBar"

    override fun build(ctx: Context, data: ByteArray, factory: ViewFactory): View {
        Log.d(TAG, "🔨 Building fresh Tabbar")
        
        // ✅ Extract tab data
        tabDataList = extractTabData(data, factory)
        activeTabKey = getActiveTab()
        
        // ✅ Container — always fresh on screen rebuild
        val container = LinearLayout(ctx).apply {
            id = TABBAR_ID
            tag = TABBAR_TYPE
            
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            clipToPadding = false
            clipChildren = false
            
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ).apply {
                topMargin = factory.dp(12)
            }
            minimumHeight = factory.dp(52)
        }

        // ✅ Apply background only (skip padding — TabBar manages its own)
        val hasBg = (data[3].toInt() and 0xFF) != 0
        if (!hasBg) {
            container.setBackgroundColor(Color.parseColor("#0f172a"))
        } else {
            factory.applyStyles(container, data)
        }

        // ✅ Always enforce compact TabBar padding (8dp H, 6dp V)
        container.setPadding(factory.dp(8), factory.dp(6), factory.dp(8), factory.dp(6))

        // ✅ Build tabs
        tabButtons.clear()
        tabDataList.forEach { tab ->
            val isActive = activeTabKey.equals(tab.key, ignoreCase = true)
            val btn = createTabButton(ctx, factory, tab, isActive)
            container.addView(btn)
            tabButtons.add(btn)
        }

        tabbarInstance = container
        isInitialized = true

        Log.d(TAG, "✅ Tabbar built with ${tabButtons.size} tabs")
        return container
    }
    
    // ─── CREATE TAB BUTTON ─────────────────────────────────────────
    
    private fun createTabButton(
        ctx: Context,
        factory: ViewFactory,
        tab: TabData,
        isActive: Boolean
    ): MaterialButton {
        return MaterialButton(ctx).apply {
            text = if (tab.icon.isNotEmpty()) "${tab.icon} ${tab.label}" else tab.label
            isAllCaps = false
            textSize = 12f
            cornerRadius = factory.dp(10)
            insetTop = 0
            insetBottom = 0
            minHeight = factory.dp(36)
            setPadding(factory.dp(6), factory.dp(8), factory.dp(6), factory.dp(8))
            
            layoutParams = LinearLayout.LayoutParams(
                0,
                ViewGroup.LayoutParams.WRAP_CONTENT,
                1f
            ).apply {
                marginEnd = factory.dp(4)
            }
            
            val bgColor = if (isActive) "#2563eb" else "#1e293b"
            val textColor = if (isActive) "#ffffff" else "#94a3b8"
            
            setBackgroundColor(Color.parseColor(bgColor))
            setTextColor(Color.parseColor(textColor))
            
            setOnClickListener {
                activeTabKey = tab.key
                updateActiveTab(tab.key)
                factory.onAction?.invoke(tab.action, tab.label)
            }
        }
    }
    
    // ─── UPDATE FUNCTIONS ──────────────────────────────────────────
    
    private fun updateTabbar(data: ByteArray, factory: ViewFactory) {
        val tabbar = tabbarInstance ?: return
        
        // Always enforce compact TabBar padding
        tabbar.setPadding(factory.dp(8), factory.dp(6), factory.dp(8), factory.dp(6))
        
        val newTabData = extractTabData(data, factory)
        if (newTabData != tabDataList && newTabData.isNotEmpty()) {
            tabDataList = newTabData
            updateTabs(factory)
        }
        
        tabbar.invalidate()
        tabbar.requestLayout()
    }
    
    private fun updateTabs(factory: ViewFactory) {
        tabDataList.forEachIndexed { index, tab ->
            if (index < tabButtons.size) {
                val btn = tabButtons[index]
                val isActive = activeTabKey.equals(tab.key, ignoreCase = true)
                
                btn.text = if (tab.icon.isNotEmpty()) "${tab.icon} ${tab.label}" else tab.label
                
                val bgColor = if (isActive) "#2563eb" else "#1e293b"
                val textColor = if (isActive) "#ffffff" else "#94a3b8"
                
                btn.setBackgroundColor(Color.parseColor(bgColor))
                btn.setTextColor(Color.parseColor(textColor))
                btn.invalidate()
            }
        }
    }
    
    private fun updateActiveTab(selectedKey: String) {
        activeTabKey = selectedKey
        DolphinStateEngine.set("activeTab", selectedKey)
        
        tabButtons.forEachIndexed { index, btn ->
            if (index < tabDataList.size) {
                val tab = tabDataList[index]
                val isActive = tab.key.equals(selectedKey, ignoreCase = true)
                
                val bgColor = if (isActive) "#2563eb" else "#1e293b"
                val textColor = if (isActive) "#ffffff" else "#94a3b8"
                
                btn.setBackgroundColor(Color.parseColor(bgColor))
                btn.setTextColor(Color.parseColor(textColor))
                btn.invalidate()
            }
        }
    }
    
    // ─── HELPERS ────────────────────────────────────────────────────
    
    private fun extractTabData(data: ByteArray, factory: ViewFactory): MutableList<TabData> {
        return mutableListOf(
            TabData("Home", "Home", "🏠", "tab:Home"),
            TabData("CssTest", "CSS", "🎨", "tab:CssTest"),
            TabData("StoreTest", "Store", "⚡", "tab:StoreTest"),
            TabData("HardwareTest", "Hardware", "🔌", "tab:HardwareTest")
        )
    }
    
    private fun getActiveTab(): String {
        return DolphinStateEngine.get("activeTab")?.toString() ?: "Home"
    }
    
    // ─── PUBLIC API ───────────────────────────────────────────────
    
    fun applyHotPatchUpdate(factory: ViewFactory, data: ByteArray) {
        if (isInitialized && tabbarInstance != null) {
            updateTabbar(data, factory)
        }
    }
    
    fun getTabbarInstance(): LinearLayout? = tabbarInstance
}