package io.dolphin.runtime

import android.util.Log
import java.io.InputStream
import java.io.OutputStream
import java.net.DatagramPacket
import java.net.DatagramSocket
import java.net.InetAddress
import java.net.Socket
import java.net.InetSocketAddress
import java.util.concurrent.atomic.AtomicBoolean
import kotlin.concurrent.thread

private const val TAG = "HotPatchClient"

// Command codes
private object Cmd {
    const val FULL_RELOAD     = 0x01
    const val PATCH_SCREEN    = 0x02
    const val PATCH_COMPONENT = 0x03
    const val PING            = 0x04
    const val PONG            = 0x05
    const val ACK             = 0x06
    const val ACTION          = 0x07
    const val PATCH_STATE     = 0x08
    const val NAVIGATE_TO     = 0x0A
    const val OPEN_DRAWER     = 0x0C
}

/**
 * 📡 DolphinPlatformClient (formerly HotPatchClient)
 *
 * 100% Modular client architecture handling robust TCP connections, 
 * Ping/Pong Heartbeats (to prevent auto closed connections), and exponential backoff
 * reconnects. Designed like a standalone module.
 */
class HotPatchClient(
    private val initialHost: String = "127.0.0.1",
    private val port       : Int    = 9091,
    private val listener   : Listener
) {
    companion object {
        @Volatile var activeHost: String = "127.0.0.1"
        @Volatile var activeHttpPort: Int = 7787
    }

    init {
        if (initialHost.isNotEmpty() && initialHost != "127.0.0.1" && initialHost != "0.0.0.0") {
            activeHost = initialHost
        }
    }

    // Current target host — UDP discovery updates this when PC IP changes
    @Volatile private var host: String = initialHost
        set(value) {
            field = value
            if (value.isNotEmpty() && value != "127.0.0.1" && value != "0.0.0.0") {
                activeHost = value
            }
        }

    fun getHost(): String = host

    interface Listener {
        fun onFullReload(bundleBytes: ByteArray)
        fun onPatchScreen(screenName: String, components: ByteArray, rawData: ByteArray)
        fun onPatchComponent(index: Int, titanBinary: ByteArray)
        fun onPatchState(key: String, value: String)
        fun onNavigateTo(screenName: String)
        fun onOpenDrawer(drawerName: String)
        fun onDisconnected(reason: String)
        fun onConnected(connectedHost: String)
    }

    private val parser      = BinaryParser()
    private val running     = AtomicBoolean(false)
    
    // Abstracted Connection State
    @Volatile private var socket: Socket? = null
    @Volatile private var outputStream: OutputStream? = null

    // Heartbeat configuration
    private val PING_INTERVAL_MS = 10000L
    private val RECONNECT_DELAY_MS = 3000L
    
    fun connect() {
        if (running.getAndSet(true)) {
            Log.w(TAG, "Already connected or connecting.")
            return
        }

        // Connection Thread
        thread(name = "DolphinConnectionEngine", isDaemon = true) {
            var reconnectCount = 0
            while (running.get()) {
                try {
                    Log.i(TAG, "Connecting to Dolphin Server $host:$port (Attempt ${reconnectCount + 1})...")
                    val sock = Socket()
                    sock.connect(InetSocketAddress(host, port), 2000) // 2 second timeout for local dev
                    sock.soTimeout = 0 // Keep read blocking, we rely on Pings
                    sock.tcpNoDelay = true
                    sock.keepAlive = true
                    
                    socket = sock
                    outputStream = sock.getOutputStream()
                    reconnectCount = 0
                    
                    val connectedIp = sock.inetAddress?.hostAddress ?: host
                    if (connectedIp.isNotEmpty() && connectedIp != "127.0.0.1" && connectedIp != "0.0.0.0") {
                        activeHost = connectedIp
                    }
                    Log.i(TAG, "✅ Linked to Server successfully: $activeHost")
                    listener.onConnected(activeHost)
                    
                    // Start Heartbeat module for this connection
                    startHeartbeat(sock)
                    
                    // Start Reader module loop
                    readLoop(sock.getInputStream())

                } catch (e: Throwable) {
                    val reason = e.message ?: "Unknown socket error"
                    Log.e(TAG, "Connection lost/failed: $reason")
                    listener.onDisconnected(reason)
                    
                    cleanupConnection()

                    if (running.get()) {
                        reconnectCount++
                        
                        // Try UDP discovery immediately on failure
                        val newIP = discoverServerIP()
                        if (newIP != null && newIP != host) {
                            Log.i(TAG, "🔄 IP changed detected via UDP: $host → $newIP")
                            host = newIP
                            reconnectCount = 0 // reset backoff for fresh IP
                        } else {
                            val delay = (RECONNECT_DELAY_MS * reconnectCount).coerceAtMost(10000L)
                            Log.i(TAG, "Auto-reconnecting in ${delay}ms...")
                            Thread.sleep(delay)
                        }
                    }
                }
            }
            Log.i(TAG, "DolphinConnectionEngine exiting gracefully.")
        }
    }

    fun disconnect() {
        running.set(false)
        cleanupConnection()
        Log.i(TAG, "Modular Client Disconnected via API.")
    }

    /**
     * UDP broadcast मार्फत Dolphin Dev Server को IP फेला पार्ने।
     * PC को IP change भएमा auto-reconnect को क्रममा यो call हुन्छ।
     */
    private fun discoverServerIP(): String? {
        return try {
            val socket = DatagramSocket().apply {
                broadcast = true
                soTimeout  = 1000 // Faster timeout for quicker discovery
            }
            val msg       = "DOLPHIN_DISCOVER".toByteArray()
            val broadcast = InetAddress.getByName("255.255.255.255")
            socket.send(DatagramPacket(msg, msg.size, broadcast, 9092))

            val buf     = ByteArray(256)
            val recvPkt = DatagramPacket(buf, buf.size)
            socket.receive(recvPkt)
            socket.close()

            val reply = String(recvPkt.data, 0, recvPkt.length).trim()
            if (reply.startsWith("DOLPHIN_OFFER:")) {
                val params = reply.removePrefix("DOLPHIN_OFFER:").split(";")
                val ipParam = params.firstOrNull { it.startsWith("ip=") }
                val httpParam = params.firstOrNull { it.startsWith("httpPort=") }
                val ip = ipParam?.removePrefix("ip=")?.trim()
                val httpPort = httpParam?.removePrefix("httpPort=")?.trim()?.toIntOrNull()
                if (!ip.isNullOrBlank()) {
                    activeHost = ip
                    if (httpPort != null) activeHttpPort = httpPort
                    Log.i(TAG, "📡 UDP Discovery updated activeHost: $activeHost, activeHttpPort: $activeHttpPort")
                    return ip
                }
            }
            null
        } catch (e: Throwable) {
            null // timeout या network error — पुरानो IP use गर्नेछ
        }
    }

    private fun cleanupConnection() {
        try { socket?.close() } catch (_: Throwable) {}
        socket = null
        outputStream = null
    }

    // ─────────────────────────────────────────────────────
    // HEARTBEAT MODULE (Fixes connection dropping)
    // ─────────────────────────────────────────────────────
    private fun startHeartbeat(activeSocket: Socket) {
        thread(name = "DolphinPingService", isDaemon = true) {
            while (running.get() && socket === activeSocket && !activeSocket.isClosed) {
                try {
                    Thread.sleep(PING_INTERVAL_MS)
                    sendPing()
                } catch (e: InterruptedException) {
                    break
                } catch (e: Throwable) {
                    Log.e(TAG, "Ping failed, connection might be dead.")
                    cleanupConnection() // Force close to trigger reconnect in readLoop
                    break
                }
            }
            Log.d(TAG, "PingService terminated for old socket.")
        }
    }

    // ─────────────────────────────────────────────────────
    // READER MODULE
    // ─────────────────────────────────────────────────────
    private fun readLoop(input: InputStream) {
        while (running.get() && socket?.isClosed == false) {
            try {
                val headerBuf = ByteArray(5)
                if (!readExactly(input, headerBuf)) break

                val cmd    = headerBuf[0].toInt() and 0xFF
                val payLen = readUInt32LE(headerBuf, 1)

                if (payLen > 10 * 1024 * 1024) { 
                    Log.e(TAG, "Payload too large ($payLen), aborting to protect memory.")
                    break
                }

                val payload = ByteArray(payLen)
                if (payLen > 0 && !readExactly(input, payload)) break

                dispatchCommand(cmd, payload)

            } catch (e: Throwable) {
                Log.e(TAG, "Stream error triggered fallback: ${e.message}")
                break
            }
        }

        listener.onDisconnected("Stream EOF or socket error")
    }

    private fun dispatchCommand(cmd: Int, payload: ByteArray) {
        when (cmd) {
            Cmd.FULL_RELOAD -> {
                Log.i(TAG, "⚡ FULL_RELOAD (${payload.size} bytes)")
                listener.onFullReload(payload)
                sendAck("FULL_RELOAD")
            }
            Cmd.PATCH_SCREEN -> {
                val nameLen   = payload[0].toInt() and 0xFF
                val name      = String(payload, 1, nameLen, Charsets.UTF_8)
                val compCount = readUInt32LE(payload, 1 + nameLen)
                val dataLen   = readUInt32LE(payload, 1 + nameLen + 4)
                
                val compBytes = payload.copyOfRange(1 + nameLen + 8, 1 + nameLen + 8 + (compCount * 16))
                val rawData   = payload.copyOfRange(1 + nameLen + 8 + (compCount * 16), payload.size)
                
                Log.i(TAG, "⚡ PATCH_SCREEN [$name] ($compCount comps, ${rawData.size} bytes)")
                listener.onPatchScreen(name, compBytes, rawData)
                sendAck("PATCH_SCREEN:$name")
            }
            Cmd.PATCH_COMPONENT -> {
                val index  = readUInt16LE(payload, 0)
                val binary = payload.copyOfRange(2, 18)
                Log.i(TAG, "⚡ PATCH_COMPONENT [$index]")
                listener.onPatchComponent(index, binary)
                sendAck("PATCH_COMPONENT:$index")
            }
            Cmd.PATCH_STATE -> {
                val keyLen = payload[0].toInt() and 0xFF
                val key    = String(payload, 1, keyLen, Charsets.UTF_8)
                val value  = String(payload, 1 + keyLen, payload.size - (1 + keyLen), Charsets.UTF_8)
                Log.i(TAG, "⚡ PATCH_STATE [$key = $value]")
                listener.onPatchState(key, value)
                sendAck("PATCH_STATE:$key")
            }
            Cmd.NAVIGATE_TO -> {
                val screenName = String(payload, Charsets.UTF_8)
                Log.i(TAG, "⚡ NAVIGATE_TO [$screenName]")
                listener.onNavigateTo(screenName)
                sendAck("NAVIGATE_TO:$screenName")
            }
            Cmd.OPEN_DRAWER -> {
                val drawerName = String(payload, Charsets.UTF_8)
                Log.i(TAG, "⚡ OPEN_DRAWER [$drawerName]")
                listener.onOpenDrawer(drawerName)
                sendAck("OPEN_DRAWER:$drawerName")
            }
            Cmd.PING -> {
                sendPong()
            }
            Cmd.PONG -> {
                // Heartbeat acknowledged by server
                Log.d(TAG, "PONG received (Heartbeat OK)")
            }
            else -> Log.w(TAG, "Unknown cmd byte: 0x${cmd.toString(16)}")
        }
    }

    private fun readExactly(input: InputStream, buffer: ByteArray): Boolean {
        var bytesRead = 0
        while (bytesRead < buffer.size) {
            val result = input.read(buffer, bytesRead, buffer.size - bytesRead)
            if (result == -1) return false
            bytesRead += result
        }
        return true
    }

    // ─────────────────────────────────────────────────────
    // WRITER MODULE
    // ─────────────────────────────────────────────────────
    private fun sendAck(info: String) {
        sendRaw(parser.buildAck(info))
    }

    private fun sendPong() {
        sendRaw(parser.buildPong(ByteArray(0)))
    }
    
    /**
     * Send an UI action back to the server.
     */
    fun sendAction(action: String, value: Any?) {
        val actionBytes = action.toByteArray(Charsets.UTF_8)
        val valueStr = value?.toString() ?: ""
        val valueBytes = valueStr.toByteArray(Charsets.UTF_8)
        
        // Protocol: [1 byte actionLen][actionBytes][valueBytes]
        val payload = ByteArray(1 + actionBytes.size + valueBytes.size)
        payload[0] = actionBytes.size.toByte()
        System.arraycopy(actionBytes, 0, payload, 1, actionBytes.size)
        System.arraycopy(valueBytes, 0, payload, 1 + actionBytes.size, valueBytes.size)
        
        val header = ByteArray(5)
        header[0] = Cmd.ACTION.toByte()
        // writeUInt32LE payload.size
        header[1] = (payload.size and 0xFF).toByte()
        header[2] = ((payload.size shr 8) and 0xFF).toByte()
        header[3] = ((payload.size shr 16) and 0xFF).toByte()
        header[4] = ((payload.size shr 24) and 0xFF).toByte()
        
        val msg = ByteArray(5 + payload.size)
        System.arraycopy(header, 0, msg, 0, 5)
        System.arraycopy(payload, 0, msg, 5, payload.size)
        
        sendRaw(msg)
    }
    
    private fun sendPing() {
        // Send a ping to server to keep socket alive from Android side
        val msg = ByteArray(5)
        msg[0] = Cmd.PING.toByte()
        // payload size = 0 (4 bytes)
        msg[1] = 0; msg[2] = 0; msg[3] = 0; msg[4] = 0;
        sendRaw(msg)
    }

    private fun sendRaw(bytes: ByteArray) {
        thread {
            try {
                outputStream?.write(bytes)
                outputStream?.flush()
            } catch (e: Throwable) {
                Log.e(TAG, "Transmit failure: ${e.message}")
                cleanupConnection() // trigger reconnect
            }
        }
    }

    // ─────────────────────────────────────────────────────
    // UTILS
    // ─────────────────────────────────────────────────────
    private fun readUInt32LE(bytes: ByteArray, offset: Int): Int {
        return (bytes[offset].toInt() and 0xFF) or
               ((bytes[offset + 1].toInt() and 0xFF) shl 8) or
               ((bytes[offset + 2].toInt() and 0xFF) shl 16) or
               ((bytes[offset + 3].toInt() and 0xFF) shl 24)
    }

    private fun readUInt16LE(bytes: ByteArray, offset: Int): Int {
        return (bytes[offset].toInt() and 0xFF) or
               ((bytes[offset + 1].toInt() and 0xFF) shl 8)
    }
}
