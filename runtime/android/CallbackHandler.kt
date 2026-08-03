package io.dolphin.runtime

import android.util.Log

/**
 * 🐬 Dolphin Callback Handler
 * 
 * Pure Kotlin callback management for React-style lambda support.
 * Stores serialized callback code and executes via DolphinStateEngine actions.
 * 
 * NO WebView. NO JavaScript Engine. Pure Native + State Bridge.
 */
object CallbackHandler {
    
    private val callbacks = mutableMapOf<String, CallbackData>()
    private var nextId = 1
    
    data class CallbackData(
        val id: String,
        val type: String, // "click", "change", "submit"
        val stateKeys: List<String>, // State keys accessed in callback
        val actions: List<String> // Actions to perform
    )
    
    /**
     * Register a callback with state access pattern
     * Example: onClick={() => console.log({email: state.email})}
     * Becomes: id=__cb_1, stateKeys=[email], actions=[log:email]
     */
    fun register(type: String, stateKeys: List<String>, actions: List<String>): String {
        val id = "__cb_${nextId++}"
        callbacks[id] = CallbackData(id, type, stateKeys, actions)
        Log.d("CallbackHandler", "Registered callback $id: $stateKeys -> $actions")
        return id
    }
    
    /**
     * Execute a callback by ID
     * Reads current state values and performs actions
     */
    fun execute(id: String, context: Any? = null): Boolean {
        val callback = callbacks[id] ?: return false
        
        Log.d("CallbackHandler", "Executing callback ${callback.id}")
        
        try {
            // Build context object with current state values
            val contextData = mutableMapOf<String, Any?>()
            callback.stateKeys.forEach { key ->
                contextData[key] = DolphinStateEngine.get(key)
            }
            
            // Execute each action
            callback.actions.forEach { action ->
                when {
                    action.startsWith("log:") -> {
                        // console.log support
                        val keys = action.substring(4).split(",")
                        val logData = keys.associateWith { contextData[it] }
                        Log.i("DolphinCallback", "Console.log: $logData")
                    }
                    action.startsWith("set:") -> {
                        // setState support: set:name=value
                        val parts = action.substring(4).split("=")
                        if (parts.size == 2) {
                            DolphinStateEngine.handleAction("${parts[0]}:=${parts[1]}")
                        }
                    }
                    action.startsWith("nav:") -> {
                        // Navigation
                        DolphinStateEngine.handleAction(action)
                    }
                    action.startsWith("toast:") -> {
                        // Show toast
                        DolphinStateEngine.handleAction(action)
                    }
                    else -> {
                        // Generic action
                        DolphinStateEngine.handleAction(action)
                    }
                }
            }
            
            return true
        } catch (e: Exception) {
            Log.e("CallbackHandler", "Error executing callback $id", e)
            return false
        }
    }
    
    /**
     * Check if callback exists
     */
    fun has(id: String): Boolean = callbacks.containsKey(id)
    
    /**
     * Remove a callback
     */
    fun remove(id: String) {
        callbacks.remove(id)
    }
    
    /**
     * Clear all callbacks (for cleanup)
     */
    fun clear() {
        callbacks.clear()
        nextId = 1
    }
    
    /**
     * Get all callback IDs (for debugging)
     */
    fun getAllIds(): List<String> = callbacks.keys.toList()
    
    /**
     * Get callback info (for debugging)
     */
    fun getInfo(id: String): CallbackData? = callbacks[id]
}
