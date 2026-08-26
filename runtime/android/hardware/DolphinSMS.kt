package io.dolphin.runtime

import android.content.Context
import android.content.Intent
import android.database.Cursor
import android.net.Uri
import android.provider.Telephony
import android.telephony.SmsManager
import android.os.Build
import android.util.Log

object DolphinSMS {
    private const val TAG = "DolphinSMS"

    /** Send SMS directly (requires SEND_SMS permission) */
    fun sendSMS(ctx: Context, number: String, message: String): Boolean {
        return try {
            val smsManager = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                ctx.getSystemService(SmsManager::class.java)
            } else {
                @Suppress("DEPRECATION")
                SmsManager.getDefault()
            }
            val parts = smsManager.divideMessage(message)
            smsManager.sendMultipartTextMessage(number, null, parts, null, null)
            Log.d(TAG, "SMS sent to $number")
            true
        } catch (e: Exception) {
            Log.e(TAG, "sendSMS failed", e)
            false
        }
    }

    /** Open SMS composer via Intent (no permission needed) */
    fun composeSMS(ctx: Context, number: String, body: String = "") {
        try {
            val intent = Intent(Intent.ACTION_SENDTO).apply {
                data = Uri.parse("smsto:$number")
                putExtra("sms_body", body)
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            ctx.startActivity(intent)
        } catch (e: Exception) {
            Log.e(TAG, "composeSMS failed", e)
        }
    }

    /** Read inbox SMS (requires READ_SMS permission) */
    fun getInbox(ctx: Context, limit: Int = 50): List<Map<String, String>> {
        val messages = mutableListOf<Map<String, String>>()
        try {
            val cursor: Cursor? = ctx.contentResolver.query(
                Telephony.Sms.Inbox.CONTENT_URI,
                arrayOf(
                    Telephony.Sms.ADDRESS,
                    Telephony.Sms.BODY,
                    Telephony.Sms.DATE,
                    Telephony.Sms.READ
                ),
                null, null,
                "${Telephony.Sms.DATE} DESC LIMIT $limit"
            )
            cursor?.use {
                while (it.moveToNext()) {
                    messages.add(mapOf(
                        "from"   to (it.getString(0) ?: ""),
                        "body"   to (it.getString(1) ?: ""),
                        "date"   to (it.getString(2) ?: ""),
                        "read"   to (it.getString(3) ?: "0")
                    ))
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "getInbox failed (check READ_SMS permission)", e)
        }
        return messages
    }

    /** Read sent SMS (requires READ_SMS permission) */
    fun getSent(ctx: Context, limit: Int = 50): List<Map<String, String>> {
        val messages = mutableListOf<Map<String, String>>()
        try {
            val cursor: Cursor? = ctx.contentResolver.query(
                Telephony.Sms.Sent.CONTENT_URI,
                arrayOf(Telephony.Sms.ADDRESS, Telephony.Sms.BODY, Telephony.Sms.DATE),
                null, null,
                "${Telephony.Sms.DATE} DESC LIMIT $limit"
            )
            cursor?.use {
                while (it.moveToNext()) {
                    messages.add(mapOf(
                        "to"   to (it.getString(0) ?: ""),
                        "body" to (it.getString(1) ?: ""),
                        "date" to (it.getString(2) ?: "")
                    ))
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "getSent failed", e)
        }
        return messages
    }
}
