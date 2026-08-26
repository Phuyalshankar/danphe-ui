package io.dolphin.runtime


import android.app.AlertDialog
import android.content.Context
import android.util.Log

/**
 * 🐬 Dolphin Callback Handler v2.0 (24-byte Protocol Sync)
 * 
 * Pure Kotlin callback execution engine for React-style lambda support.
 * Executed zero-JS lambdas by decoding JS CallbackParser payloads into native actions.
 * 
 * NO WebView. NO JavaScript Engine. Pure Native Android + NanoStore State Bridge.
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
     * Reads current state values and performs actions natively
     */
    fun execute(id: String, context: Context? = null): Boolean {
        val callback = callbacks[id] ?: return false
        
        Log.d("CallbackHandler", "⚡ Executing callback ${callback.id}")
        
        try {
            // Build context object with current state values
            val contextData = mutableMapOf<String, Any?>()
            callback.stateKeys.forEach { key ->
                contextData[key] = DolphinStateEngine.get(key)
            }
            
            // Execute each action in sequence
            callback.actions.forEach { action ->
                when {
                    action.startsWith("log:") -> {
                        // console.log support
                        val keys = action.substring(4).split(",")
                        val logData = keys.associateWith { contextData[it] ?: DolphinStateEngine.get(it) }
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
                        val msg = action.substring(6)
                        if (context != null) {
                            android.widget.Toast.makeText(context, msg.ifEmpty { "Notification" }, android.widget.Toast.LENGTH_SHORT).show()
                        } else {
                            DolphinStateEngine.handleAction("toast:$msg")
                        }
                    }
                    action.startsWith("alert:") -> {
                        val msg = action.substring(6)
                        if (context != null) {
                            AlertDialog.Builder(context)
                                .setTitle("Alert")
                                .setMessage(msg.ifEmpty { "Notice" })
                                .setPositiveButton("OK", null)
                                .show()
                        } else {
                            Log.i("DolphinCallback", "Alert: $msg")
                        }
                    }
                    action.startsWith("confirm:") -> {
                        val msg = action.substring(8)
                        if (context != null) {
                            AlertDialog.Builder(context)
                                .setTitle("Confirm")
                                .setMessage(msg.ifEmpty { "Are you sure?" })
                                .setPositiveButton("Yes") { _, _ ->
                                    DolphinStateEngine.set("confirm_result", "true")
                                }
                                .setNegativeButton("No") { _, _ ->
                                    DolphinStateEngine.set("confirm_result", "false")
                                }
                                .show()
                        } else {
                            Log.i("DolphinCallback", "Confirm: $msg")
                        }
                    }
                    action.startsWith("prompt:") -> {
                        val msg = action.substring(7)
                        if (context != null) {
                            val input = android.widget.EditText(context)
                            AlertDialog.Builder(context)
                                .setTitle("Input")
                                .setMessage(msg.ifEmpty { "Enter value:" })
                                .setView(input)
                                .setPositiveButton("OK") { _, _ ->
                                    val valStr = input.text.toString()
                                    DolphinStateEngine.set("prompt_result", valStr)
                                }
                                .setNegativeButton("Cancel", null)
                                .show()
                        } else {
                            Log.i("DolphinCallback", "Prompt: $msg")
                        }
                    }
                    action.startsWith("api:") -> {
                        // 🆕 24-byte: Native API Fetch Call
                        val apiSpec = action.substring(4)
                        Log.i("DolphinCallback", "Native API Call: $apiSpec")
                        // Trigger native fetch bridge
                        if (context != null) {
                            DolphinHardwareBridge.handleHardwareAction(context, "hw:fetch:request", apiSpec) { _ -> }
                        }
                    }
                    action.startsWith("hw:") -> {
                        // 🆕 24-byte: Native Hardware Bridge Trigger
                        if (context != null) {
                            DolphinHardwareBridge.handleHardwareAction(context, action, contextData) { _ -> }
                        }
                    }
                    else -> {
                        // Generic action string handler
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
    
    fun has(id: String): Boolean = callbacks.containsKey(id)
    
    fun remove(id: String) {
        callbacks.remove(id)
    }
    
    fun clear() {
        callbacks.clear()
        nextId = 1
    }
    
    fun getAllIds(): List<String> = callbacks.keys.toList()
    
    fun getInfo(id: String): CallbackData? = callbacks[id]
}
