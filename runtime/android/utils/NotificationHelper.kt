package io.dolphin.runtime

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat

class NotificationHelper(private val context: Context) {
    private val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    companion object {
        const val CHANNEL_CALL = "dolphin_calls"
        const val CHANNEL_MSG = "dolphin_messages"
        const val NOTIF_ID_SERVICE = 101
        const val NOTIF_ID_CALL = 102
    }

    init {
        createChannels()
    }

    private fun createChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val callChannel = NotificationChannel(
                CHANNEL_CALL,
                "Incoming Calls",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "High priority notifications for calls"
                enableLights(true)
                enableVibration(true)
                setLockscreenVisibility(Notification.VISIBILITY_PUBLIC)
            }

            val msgChannel = NotificationChannel(
                CHANNEL_MSG,
                "Messages",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Chat and group messages"
                enableLights(true)
                enableVibration(true)
                setLockscreenVisibility(Notification.VISIBILITY_PUBLIC)
            }

            manager.createNotificationChannel(callChannel)
            manager.createNotificationChannel(msgChannel)
        }
    }

    fun getServiceNotification(): Notification {
        val intent = context.packageManager.getLaunchIntentForPackage(context.packageName)
        val pendingIntent = PendingIntent.getActivity(
            context, 0, intent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        return NotificationCompat.Builder(context, CHANNEL_MSG)
            .setContentTitle("Dolphin Native")
            .setContentText("Telephone system active in background")
            .setSmallIcon(android.R.drawable.ic_menu_call)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .build()
    }

    fun showIncomingCall(from: String, isVideo: Boolean) {
        val intent = context.packageManager.getLaunchIntentForPackage(context.packageName)?.apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
            putExtra("action", "incoming_call")
            putExtra("from", from)
        }

        val pendingIntent = PendingIntent.getActivity(
            context, 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val builder = NotificationCompat.Builder(context, CHANNEL_CALL)
            .setContentTitle(if (isVideo) "Incoming Video Call" else "Incoming Call")
            .setContentText(from)
            .setSmallIcon(android.R.drawable.ic_menu_call)
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_CALL)
            .setFullScreenIntent(pendingIntent, true) // Key: This triggers the UI even when locked
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setAutoCancel(true)
            .setOngoing(true)
            .addAction(android.R.drawable.ic_menu_call, "Accept", pendingIntent)

        manager.notify(NOTIF_ID_CALL, builder.build())
    }

    fun showMessage(from: String, message: String) {
        val intent = context.packageManager.getLaunchIntentForPackage(context.packageName)?.apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
        }
        val pendingIntent = PendingIntent.getActivity(
            context, 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val builder = NotificationCompat.Builder(context, CHANNEL_MSG)
            .setContentTitle(from)
            .setContentText(message)
            .setSmallIcon(android.R.drawable.stat_notify_chat)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setDefaults(NotificationCompat.DEFAULT_ALL)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)

        manager.notify(System.currentTimeMillis().toInt(), builder.build())
    }
}
