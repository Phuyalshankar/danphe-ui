package io.dolphin.runtime


import android.content.Context
import android.graphics.Color
import android.util.Log
import android.view.View
import android.widget.Toast
import com.google.android.material.snackbar.Snackbar

/**
 * 🐬 DolphinHelpers
 * Ready-made helper functions for common UI patterns
 */
object DolphinHelpers {
    
    // ═══════════════════════════════════════════════════════════
    // 1. FORM VALIDATION
    // ═══════════════════════════════════════════════════════════
    
    fun validateEmail(email: String): Boolean {
        val emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\$".toRegex()
        return email.matches(emailRegex)
    }
    
    fun validatePhone(phone: String): Boolean {
        val phoneRegex = "^[+]?[0-9]{10,15}\$".toRegex()
        return phone.replace("\\s".toRegex(), "").matches(phoneRegex)
    }
    
    fun validateRequired(value: String): Boolean {
        return value.trim().isNotEmpty()
    }
    
    fun validateMinLength(value: String, minLength: Int): Boolean {
        return value.length >= minLength
    }
    
    fun validateMaxLength(value: String, maxLength: Int): Boolean {
        return value.length <= maxLength
    }
    
    fun validatePassword(password: String): ValidationResult {
        val errors = mutableListOf<String>()
        
        if (password.length < 8) errors.add("At least 8 characters required")
        if (!password.any { it.isUpperCase() }) errors.add("At least one uppercase letter required")
        if (!password.any { it.isLowerCase() }) errors.add("At least one lowercase letter required")
        if (!password.any { it.isDigit() }) errors.add("At least one number required")
        
        return ValidationResult(errors.isEmpty(), errors)
    }
    
    data class ValidationResult(val isValid: Boolean, val errors: List<String> = emptyList())
    
    // ═══════════════════════════════════════════════════════════
    // 2. TOAST / SNACKBAR NOTIFICATIONS
    // ═══════════════════════════════════════════════════════════
    
    enum class ToastType { SUCCESS, ERROR, INFO, WARNING }
    
    fun showToast(context: Context, message: String, type: ToastType = ToastType.INFO) {
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
    }
    
    fun showSnackbar(view: View, message: String, type: ToastType = ToastType.INFO, duration: Int = Snackbar.LENGTH_SHORT) {
        val snackbar = Snackbar.make(view, message, duration)
        
        // Color based on type
        val bgColor = when (type) {
            ToastType.SUCCESS -> Color.parseColor("#10b981") // green
            ToastType.ERROR -> Color.parseColor("#ef4444")   // red
            ToastType.WARNING -> Color.parseColor("#f59e0b") // amber
            ToastType.INFO -> Color.parseColor("#3b82f6")    // blue
        }
        
        snackbar.view.setBackgroundColor(bgColor)
        snackbar.setTextColor(Color.WHITE)
        snackbar.show()
    }
    
    // ═══════════════════════════════════════════════════════════
    // 3. LOADING STATE
    // ═══════════════════════════════════════════════════════════
    
    fun setLoading(isLoading: Boolean) {
        DolphinStateEngine.set("_loading", isLoading)
    }
    
    fun isLoading(): Boolean {
        return DolphinStateEngine.get("_loading") as? Boolean ?: false
    }
    
    // ═══════════════════════════════════════════════════════════
    // 4. MODAL / DIALOG STATE
    // ═══════════════════════════════════════════════════════════
    
    fun showModal(modalId: String) {
        DolphinStateEngine.set("_modal_$modalId", true)
    }
    
    fun hideModal(modalId: String) {
        DolphinStateEngine.set("_modal_$modalId", false)
    }
    
    fun isModalOpen(modalId: String): Boolean {
        return DolphinStateEngine.get("_modal_$modalId") as? Boolean ?: false
    }
    
    // ═══════════════════════════════════════════════════════════
    // 5. TABS STATE
    // ═══════════════════════════════════════════════════════════
    
    fun setActiveTab(tabId: String) {
        DolphinStateEngine.set("_activeTab", tabId)
    }
    
    fun getActiveTab(): String {
        return DolphinStateEngine.get("_activeTab") as? String ?: ""
    }
    
    fun isActiveTab(tabId: String): Boolean {
        return getActiveTab() == tabId
    }
    
    // ═══════════════════════════════════════════════════════════
    // 6. LIST OPERATIONS
    // ═══════════════════════════════════════════════════════════
    
    fun addToList(listKey: String, item: Any) {
        val currentList = DolphinStateEngine.get(listKey) as? MutableList<Any> ?: mutableListOf()
        currentList.add(item)
        DolphinStateEngine.set(listKey, currentList)
    }
    
    fun removeFromList(listKey: String, index: Int) {
        val currentList = DolphinStateEngine.get(listKey) as? MutableList<Any> ?: return
        if (index in currentList.indices) {
            currentList.removeAt(index)
            DolphinStateEngine.set(listKey, currentList)
        }
    }
    
    fun clearList(listKey: String) {
        DolphinStateEngine.set(listKey, mutableListOf<Any>())
    }
    
    // ═══════════════════════════════════════════════════════════
    // 7. COUNTER / TIMER
    // ═══════════════════════════════════════════════════════════
    
    fun startTimer(timerKey: String, seconds: Int, onTick: ((Int) -> Unit)? = null, onComplete: (() -> Unit)? = null) {
        DolphinStateEngine.set(timerKey, seconds)
        
        val timer = object : android.os.CountDownTimer((seconds * 1000).toLong(), 1000) {
            override fun onTick(millisUntilFinished: Long) {
                val remaining = (millisUntilFinished / 1000).toInt()
                DolphinStateEngine.set(timerKey, remaining)
                onTick?.invoke(remaining)
            }
            
            override fun onFinish() {
                DolphinStateEngine.set(timerKey, 0)
                onComplete?.invoke()
            }
        }
        timer.start()
    }
    
    // ═══════════════════════════════════════════════════════════
    // 8. DEBOUNCE / THROTTLE
    // ═══════════════════════════════════════════════════════════
    
    private val debounceTimers = mutableMapOf<String, android.os.Handler>()
    
    fun debounce(key: String, delayMillis: Long = 300, action: () -> Unit) {
        debounceTimers[key]?.removeCallbacksAndMessages(null)
        val handler = android.os.Handler(android.os.Looper.getMainLooper())
        handler.postDelayed(action, delayMillis)
        debounceTimers[key] = handler
    }
    
    // ═══════════════════════════════════════════════════════════
    // 9. SEARCH / FILTER
    // ═══════════════════════════════════════════════════════════
    
    fun filterList(listKey: String, query: String, filterFn: (Any, String) -> Boolean): List<Any> {
        val list = DolphinStateEngine.get(listKey) as? List<Any> ?: emptyList()
        return if (query.isEmpty()) list else list.filter { filterFn(it, query) }
    }
    
    // ═══════════════════════════════════════════════════════════
    // 10. LOCAL STORAGE (SharedPreferences)
    // ═══════════════════════════════════════════════════════════
    
    private var sharedPrefs: android.content.SharedPreferences? = null
    
    fun initStorage(context: Context) {
        sharedPrefs = context.getSharedPreferences("dolphin_storage", Context.MODE_PRIVATE)
    }
    
    fun saveToStorage(key: String, value: String) {
        sharedPrefs?.edit()?.putString(key, value)?.apply()
    }
    
    fun getFromStorage(key: String, default: String = ""): String {
        return sharedPrefs?.getString(key, default) ?: default
    }
    
    fun removeFromStorage(key: String) {
        sharedPrefs?.edit()?.remove(key)?.apply()
    }
    
    fun clearStorage() {
        sharedPrefs?.edit()?.clear()?.apply()
    }
}
