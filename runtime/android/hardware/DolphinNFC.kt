package io.dolphin.runtime

import android.content.Context
import android.nfc.NfcAdapter
import android.util.Log

object DolphinNFC {
    fun isSupported(ctx: Context): Boolean {
        return try {
            val adapter = NfcAdapter.getDefaultAdapter(ctx)
            adapter != null
        } catch (e: Exception) {
            Log.e("DolphinNFC", "Failed to check NFC support", e)
            false
        }
    }

    fun isEnabled(ctx: Context): Boolean {
        return try {
            val adapter = NfcAdapter.getDefaultAdapter(ctx)
            adapter?.isEnabled == true
        } catch (e: Exception) {
            Log.e("DolphinNFC", "Failed to check NFC status", e)
            false
        }
    }
    
    // Note: Full NFC reading/writing requires foreground dispatch and intent handling 
    // in MainActivity, but this provides basic state checking for the bridge.
}
