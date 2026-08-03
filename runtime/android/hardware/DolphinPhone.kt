package io.dolphin.runtime.hardware

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.CallLog
import android.telephony.TelephonyManager
import android.util.Log

object DolphinPhone {
    private const val TAG = "DolphinPhone"

    /** Initiate a phone call */
    fun makeCall(ctx: Context, number: String) {
        try {
            val intent = Intent(Intent.ACTION_CALL, Uri.parse("tel:${number}"))
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            ctx.startActivity(intent)
            Log.d(TAG, "Calling: $number")
        } catch (e: Exception) {
            Log.e(TAG, "makeCall failed", e)
        }
    }

    /** Open phone dialer with pre-filled number (no CALL_PHONE permission needed) */
    fun dialNumber(ctx: Context, number: String) {
        try {
            val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:${number}"))
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            ctx.startActivity(intent)
        } catch (e: Exception) {
            Log.e(TAG, "dialNumber failed", e)
        }
    }

    /** Get device phone number (requires READ_PHONE_STATE permission) */
    fun getPhoneNumber(ctx: Context): String {
        return try {
            val tm = ctx.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                "" // Cannot read in modern Android without carrier privilege
            } else {
                @Suppress("DEPRECATION")
                tm.line1Number ?: ""
            }
        } catch (e: Exception) {
            Log.e(TAG, "getPhoneNumber failed", e)
            ""
        }
    }

    /** Get call logs (requires READ_CALL_LOG permission) */
    fun getCallLogs(ctx: Context, limit: Int = 50): List<Map<String, String>> {
        val logs = mutableListOf<Map<String, String>>()
        try {
            val cursor = ctx.contentResolver.query(
                CallLog.Calls.CONTENT_URI,
                arrayOf(
                    CallLog.Calls.NUMBER,
                    CallLog.Calls.CACHED_NAME,
                    CallLog.Calls.TYPE,
                    CallLog.Calls.DATE,
                    CallLog.Calls.DURATION
                ),
                null, null,
                "${CallLog.Calls.DATE} DESC LIMIT $limit"
            )
            cursor?.use {
                while (it.moveToNext()) {
                    val type = when (it.getInt(2)) {
                        CallLog.Calls.INCOMING_TYPE -> "incoming"
                        CallLog.Calls.OUTGOING_TYPE -> "outgoing"
                        CallLog.Calls.MISSED_TYPE   -> "missed"
                        else -> "unknown"
                    }
                    logs.add(mapOf(
                        "number"   to (it.getString(0) ?: ""),
                        "name"     to (it.getString(1) ?: ""),
                        "type"     to type,
                        "date"     to (it.getString(3) ?: ""),
                        "duration" to (it.getString(4) ?: "0")
                    ))
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "getCallLogs failed", e)
        }
        return logs
    }

    /** Get network operator name */
    fun getCarrier(ctx: Context): String {
        return try {
            val tm = ctx.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
            tm.networkOperatorName ?: "Unknown"
        } catch (e: Exception) { "Unknown" }
    }

    /** Get SIM state */
    fun getSimState(ctx: Context): String {
        return try {
            val tm = ctx.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
            when (tm.simState) {
                TelephonyManager.SIM_STATE_READY   -> "ready"
                TelephonyManager.SIM_STATE_ABSENT  -> "absent"
                TelephonyManager.SIM_STATE_UNKNOWN -> "unknown"
                else -> "locked"
            }
        } catch (e: Exception) { "unknown" }
    }
}
