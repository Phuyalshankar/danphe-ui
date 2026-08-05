package io.dolphin.runtime

import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.util.Log
import android.content.pm.ServiceInfo
import android.os.Build
import android.telecom.PhoneAccount
import android.telecom.PhoneAccountHandle
import android.telecom.TelecomManager
import android.content.ComponentName
import android.net.Uri
import android.os.Bundle
import android.content.Context

class DolphinBackgroundService : Service() {

    private lateinit var notificationHelper: NotificationHelper
    private var isConnected = false

    override fun onCreate() {
        super.onCreate()
        notificationHelper = NotificationHelper(this)
        registerPhoneAccount()
        Log.d("DolphinService", "Background Service Created")
    }

    private fun registerPhoneAccount() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                val telecomManager = getSystemService(Context.TELECOM_SERVICE) as TelecomManager
                val componentName = ComponentName(this, DolphinConnectionService::class.java)
                val phoneAccountHandle = PhoneAccountHandle(componentName, "DolphinAccount")
                
                val phoneAccount = PhoneAccount.builder(phoneAccountHandle, "Dolphin Native")
                    .setCapabilities(PhoneAccount.CAPABILITY_SELF_MANAGED)
                    .build()
                
                telecomManager.registerPhoneAccount(phoneAccount)
            }
        } catch (e: Throwable) {
            Log.e("DolphinService", "Telecom register error: ${e.message}")
        }
    }

    private fun simulateTelecomCall(from: String, isVideo: Boolean) {
        // 1. Show high-priority notification
        notificationHelper.showIncomingCall(from, isVideo)

        // 2. Wake up device CPU and screen immediately
        try {
            val pm = getSystemService(Context.POWER_SERVICE) as android.os.PowerManager
            val isScreenOn = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT_WATCH) {
                pm.isInteractive
            } else {
                @Suppress("DEPRECATION")
                pm.isScreenOn
            }
            if (!isScreenOn) {
                @Suppress("DEPRECATION")
                val wl = pm.newWakeLock(
                    android.os.PowerManager.FULL_WAKE_LOCK or
                    android.os.PowerManager.ACQUIRE_CAUSES_WAKEUP or
                    android.os.PowerManager.ON_AFTER_RELEASE,
                    "Dolphin:IncomingCallWake"
                )
                wl.acquire(10000) // Acquire lock for 10 seconds to show the UI
                Log.d("DolphinService", "WakeLock acquired: screen turned ON for incoming call")
            }
        } catch (e: Throwable) {
            Log.e("DolphinService", "Failed to acquire WakeLock: ${e.message}")
        }

        // 3. Try to wake up/navigate MainActivity immediately if in simulation mode
        try {
            val intent = packageManager.getLaunchIntentForPackage(packageName)?.apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
                putExtra("action", "incoming_call")
                putExtra("from", from)
            }
            startActivity(intent)
        } catch (e: Throwable) {
            Log.e("DolphinService", "Failed to auto-start MainActivity: ${e.message}")
        }

        // 3. Optional: Real Telecom simulation (might fail if not default dialer)
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                val telecomManager = getSystemService(Context.TELECOM_SERVICE) as TelecomManager
                val componentName = ComponentName(this, DolphinConnectionService::class.java)
                val phoneAccountHandle = PhoneAccountHandle(componentName, "DolphinAccount")
                
                val extras = Bundle().apply {
                    putString("CALLER_NAME", from)
                    if (isVideo) {
                        putInt(TelecomManager.EXTRA_INCOMING_VIDEO_STATE, android.telecom.VideoProfile.STATE_BIDIRECTIONAL)
                    }
                }
                
                val uri = Uri.fromParts("tel", from.replace(Regex("[^0-9+]"), ""), null)
                val callExtras = Bundle().apply {
                    putParcelable(TelecomManager.EXTRA_INCOMING_CALL_ADDRESS, uri)
                    putBundle(TelecomManager.EXTRA_INCOMING_CALL_EXTRAS, extras)
                }
                
                telecomManager.addNewIncomingCall(phoneAccountHandle, callExtras)
            }
        } catch (e: Throwable) {
            Log.e("DolphinService", "Telecom simulation error: ${e.message}")
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                // Use DATA_SYNC type to match the declared manifest foreground service type
                var typeFlags = ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC
                if (Build.VERSION.SDK_INT >= 34) { // Android 14+
                    typeFlags = ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC
                }
                startForeground(
                    NotificationHelper.NOTIF_ID_SERVICE, 
                    notificationHelper.getServiceNotification(),
                    typeFlags
                )
            } else {
                startForeground(NotificationHelper.NOTIF_ID_SERVICE, notificationHelper.getServiceNotification())
            }
        } catch (t: Throwable) {
            Log.e("DolphinService", "Failed to start as foreground service: ${t.message}", t)
        }
        
        Log.d("DolphinService", "Background Service Started - Intercom Active")
        
        // Handle simulation intents from UI
        intent?.let {
            val action = it.getStringExtra("action")
            if (action == "SIMULATE_EVENT") {
                val type = it.getStringExtra("type") ?: "CALL"
                val from = it.getStringExtra("from") ?: "Dolphin Visitor"
                val msg = it.getStringExtra("message") ?: ""
                handleIncomingEvent(type, from, msg)
            }
        }

        connectToIntercom()

        return START_STICKY
    }

    private val pollingRunning = java.util.concurrent.atomic.AtomicBoolean(false)
    @Volatile private var cachedServerIp: String = ""

    /**
     * Discover Dolphin Dev Server IP dynamically via UDP broadcast (Port 9092)
     */
    private fun discoverServerIP(): String? {
        return try {
            val socket = java.net.DatagramSocket().apply {
                broadcast = true
                soTimeout = 1500 // 1.5 second timeout
            }
            val msg = "DOLPHIN_DISCOVER".toByteArray()
            val broadcast = java.net.InetAddress.getByName("255.255.255.255")
            socket.send(java.net.DatagramPacket(msg, msg.size, broadcast, 9092))

            val buf = ByteArray(256)
            val recvPkt = java.net.DatagramPacket(buf, buf.size)
            socket.receive(recvPkt)
            socket.close()

            val reply = String(recvPkt.data, 0, recvPkt.length).trim()
            if (reply.startsWith("DOLPHIN_OFFER:")) {
                val params = reply.removePrefix("DOLPHIN_OFFER:").split(";")
                val ipParam = params.firstOrNull { it.startsWith("ip=") }
                val ip = ipParam?.removePrefix("ip=")?.trim()
                if (!ip.isNullOrBlank()) return ip
            }
            null
        } catch (e: Throwable) {
            Log.e("DolphinService", "UDP Discovery failed: ${e.message}")
            null
        }
    }

    private fun connectToIntercom() {
        if (pollingRunning.getAndSet(true)) return
        Log.d("DolphinService", "Starting Background Message Polling Service...")

        kotlin.concurrent.thread(name = "DolphinMsgPollEngine", isDaemon = true) {
            while (pollingRunning.get()) {
                try {
                    // Read active settings directly from local sandbox files (survives app close!)
                    val filesDir = filesDir.absolutePath
                    val userFile = java.io.File("$filesDir/user.txt")
                    
                    var userExt = ""
                    if (userFile.exists()) {
                        try {
                            val userJson = userFile.readText(Charsets.UTF_8).trim()
                            if (userJson.startsWith("{")) {
                                val json = org.json.JSONObject(userJson)
                                userExt = json.optString("extension", "")
                            }
                        } catch (e: Exception) {
                            Log.e("DolphinService", "Failed to parse user file: ${e.message}")
                        }
                    }
                    
                    // Dynamically discover Server IP if cached IP is empty/failed
                    if (cachedServerIp.isEmpty()) {
                        val discovered = discoverServerIP()
                        if (discovered != null) {
                            cachedServerIp = discovered
                            Log.i("DolphinService", "Dynamic Server IP discovered via UDP: $cachedServerIp")
                        } else {
                            // Fallback to read from file if UDP discovery fails
                            val serverFile = java.io.File("$filesDir/server.txt")
                            if (serverFile.exists()) {
                                val fileIp = serverFile.readText(Charsets.UTF_8).trim().replace("http://", "").replace(Regex(":\\d+$"), "")
                                if (fileIp.isNotEmpty()) cachedServerIp = fileIp
                            }
                        }
                    }
                    
                    if (userExt.isNotEmpty() && cachedServerIp.isNotEmpty()) {
                        val url = java.net.URL("http://$cachedServerIp:3000/api/chats/unread/poll?extension=$userExt")
                        
                        val conn = url.openConnection() as java.net.HttpURLConnection
                        conn.requestMethod = "GET"
                        conn.connectTimeout = 3000
                        conn.readTimeout = 3000
                        
                        if (conn.responseCode == 200) {
                            val responseText = conn.inputStream.bufferedReader().readText()
                            val json = org.json.JSONObject(responseText)
                            val count = json.optInt("count", 0)
                            
                            if (count > 0) {
                                val messages = json.optJSONArray("messages")
                                if (messages != null) {
                                    for (i in 0 until messages.length()) {
                                        val m = messages.getJSONObject(i)
                                        val sender = m.optString("senderName", "Intercom User")
                                        val text = m.optString("content", "")
                                        Log.d("DolphinService", "Background Poller received new msg from $sender: $text")
                                        
                                        // Trigger android notification
                                        notificationHelper.showMessage(sender, text)
                                    }
                                }
                            }
                        }
                        conn.disconnect()
                    }
                } catch (e: Throwable) {
                    Log.e("DolphinService", "Polling error: ${e.message}")
                    cachedServerIp = "" // reset cached IP on network failure to trigger rediscovery
                }
                
                try { Thread.sleep(5000) } catch (_: InterruptedException) { break }
            }
            Log.d("DolphinService", "Background Message Polling Service stopped.")
        }
    }

    fun handleIncomingEvent(eventType: String, from: String, message: String = "") {
        when (eventType) {
            "CALL" -> {
                Log.d("DolphinService", "Incoming call from $from")
                simulateTelecomCall(from, isVideo = false)
            }
            "VIDEO_CALL" -> {
                Log.d("DolphinService", "Incoming video call from $from")
                simulateTelecomCall(from, isVideo = true)
            }
            "SMS", "MESSAGE" -> {
                Log.d("DolphinService", "Incoming message from $from")
                notificationHelper.showMessage(from, message)
            }
            else -> {
                Log.d("DolphinService", "Unknown event type: $eventType")
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        pollingRunning.set(false)
        Log.d("DolphinService", "Background Service Destroyed")
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }
}
