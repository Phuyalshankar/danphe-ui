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
internal object Cmd {
    const val FULL_RELOAD     = 0x01
    const val PATCH_SCREEN    = 0x02
    const val PATCH_COMPONENT = 0x03
    const val PING            = 0x04
    const val PONG            = 0x05
    const val ACK             = 0x06
    const val ACTION          = 0x07
    const val PATCH_STATE     = 0x08
    const val PATCH_DELTA     = 0x09
    const val NAVIGATE_TO     = 0x0A
    const val OPEN_DRAWER     = 0x0C
}

/**
 * 📡 DolphinPlatformClient (formerly HotPatchClient)
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

    @Volatile private var host: String = initialHost
        set(value) {
            field = value
            if (value.isNotEmpty() && value != "0.0.0.0") {
                activeHost = value
            }
        }

    fun getHost(): String = host

    interface Listener {
        fun onFullReload(bundleBytes: ByteArray)
        fun onPatchScreen(screenName: String, components: ByteArray, rawData: ByteArray)
        fun onPatchComponent(index: Int, titanBinary: ByteArray)
        fun onPatchDelta(deltaBytes: ByteArray) {}
        fun onPatchState(key: String, value: String)
        fun onNavigateTo(screenName: String)
        fun onOpenDrawer(drawerName: String)
        fun onDisconnected(reason: String)
        fun onConnected(connectedHost: String)
    }

    private val parser      = BinaryParser()
    private val running     = AtomicBoolean(false)
    
    @Volatile private var socket: Socket? = null
    @Volatile private var outputStream: OutputStream? = null

    private val PING_INTERVAL_MS = 10000L
    private val RECONNECT_DELAY_MS = 3000L

    fun connect() {
        if (running.getAndSet(true)) {
            Log.w(TAG, "Already connected or connecting.")
            return
        }

        thread(name = "DolphinConnectionEngine", isDaemon = true) {
            var reconnectCount = 0
            while (running.get()) {
                try {
                    Log.i(TAG, "Connecting to Dolphin Server $host:$port (Attempt ${reconnectCount + 1})...")
                    val sock = Socket()
                    sock.connect(InetSocketAddress(host, port), 2000)
                    sock.soTimeout = 0
                    sock.tcpNoDelay = true
                    sock.keepAlive = true
                    
                    socket = sock
                    outputStream = sock.getOutputStream()
                    reconnectCount = 0
                    
                    val connectedIp = sock.inetAddress?.hostAddress ?: host
                    if (connectedIp.isNotEmpty() && connectedIp != "0.0.0.0") {
                        activeHost = connectedIp
                    }
                    Log.i(TAG, "✅ Linked to Server successfully: $activeHost")
                    listener.onConnected(activeHost)
                    
                    startHeartbeat(sock)
                    readLoop(sock.getInputStream())

                } catch (e: Throwable) {
                    val reason = e.message ?: "Unknown socket error"
                    Log.e(TAG, "Connection lost/failed: $reason")
                    listener.onDisconnected(reason)
                    
                    cleanupConnection()

                    if (running.get()) {
                        reconnectCount++
                        val newIP = discoverServerIP()
                        if (newIP != null && newIP != host) {
                            Log.i(TAG, "🔄 IP changed detected via UDP: $host → $newIP")
                            host = newIP
                            reconnectCount = 0
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
    }

    private fun startHeartbeat(sock: Socket) {
        thread(name = "DolphinHeartbeatModule", isDaemon = true) {
            while (running.get() && socket === sock && sock.isConnected && !sock.isClosed) {
                try {
                    Thread.sleep(PING_INTERVAL_MS)
                    if (socket === sock && !sock.isClosed) {
                        sendPing()
                    }
                } catch (e: InterruptedException) {
                    break
                } catch (e: Throwable) {
                    Log.w(TAG, "Heartbeat write error: ${e.message}")
                    break
                }
            }
        }
    }

    private fun discoverServerIP(): String? {
        var udpSocket: DatagramSocket? = null
        return try {
            udpSocket = DatagramSocket()
            udpSocket.broadcast = true
            udpSocket.soTimeout = 1500

            val requestData = "DOLPHIN_DISCOVER_REQUEST".toByteArray(Charsets.UTF_8)
            val packet = DatagramPacket(requestData, requestData.size, InetAddress.getByName("255.255.255.255"), 9092)
            udpSocket.send(packet)

            val buf = ByteArray(256)
            val responsePacket = DatagramPacket(buf, buf.size)
            udpSocket.receive(responsePacket)

            val message = String(responsePacket.data, 0, responsePacket.length, Charsets.UTF_8)
            if (message.startsWith("DOLPHIN_SERVER_HERE")) {
                responsePacket.address.hostAddress
            } else null
        } catch (_: Exception) {
            null
        } finally {
            try { udpSocket?.close() } catch (_: Exception) {}
        }
    }

    private fun cleanupConnection() {
        try { outputStream?.close() } catch (_: Exception) {}
        try { socket?.close() } catch (_: Exception) {}
        outputStream = null
        socket = null
    }

    private fun readLoop(input: InputStream) {
        val header = ByteArray(5)
        while (running.get()) {
            try {
                if (!readExactly(input, header)) break

                val cmd    = header[0].toInt() and 0xFF
                val payLen = readUInt32LE(header, 1)

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
                
                val compBytes = payload.copyOfRange(1 + nameLen + 8, 1 + nameLen + 8 + (compCount * 24))
                val rawData   = payload.copyOfRange(1 + nameLen + 8 + (compCount * 24), payload.size)
                
                Log.i(TAG, "⚡ PATCH_SCREEN [$name] ($compCount comps, ${rawData.size} bytes)")
                listener.onPatchScreen(name, compBytes, rawData)
                sendAck("PATCH_SCREEN:$name")
            }
            Cmd.PATCH_COMPONENT -> {
                val index  = readUInt16LE(payload, 0)
                val binary = payload.copyOfRange(2, 26)
                Log.i(TAG, "⚡ PATCH_COMPONENT [$index]")
                listener.onPatchComponent(index, binary)
                sendAck("PATCH_COMPONENT:$index")
            }
            Cmd.PATCH_DELTA -> {
                Log.i(TAG, "⚡ PATCH_DELTA (${payload.size} bytes)")
                listener.onPatchDelta(payload)
                sendAck("PATCH_DELTA")
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
            Cmd.ACTION -> {
                val actionLen = if (payload.isNotEmpty()) payload[0].toInt() and 0xFF else 0
                val action = if (actionLen > 0 && actionLen <= payload.size - 1) {
                    String(payload, 1, actionLen, Charsets.UTF_8)
                } else {
                    String(payload, Charsets.UTF_8)
                }
                Log.i(TAG, "⚡ ACTION [$action]")
                
                val lastSent = recentlySentActions[action] ?: 0L
                if (System.currentTimeMillis() - lastSent < 1000) {
                    Log.d(TAG, "Ignoring echoed action from dev server: $action")
                    sendAck("ACTION:$action")
                    return
                }

                android.os.Handler(android.os.Looper.getMainLooper()).post {
                    val context = DolphinRuntime.instance?.context
                    if (action.startsWith("hw.") || action.startsWith("hw:")) {
                        val finalAction = action.replace('.', ':')
                        if (context != null) {
                            DolphinHardwareBridge.handleHardwareAction(context, finalAction, null) { _ -> }
                        }
                    } else {
                        DolphinStateEngine.handleAction(action, isFromDevServer = true)
                    }
                }
                sendAck("ACTION:$action")
            }
            Cmd.PING -> {
                sendPong()
            }
            Cmd.PONG -> {
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

    private fun sendAck(info: String) {
        sendRaw(parser.buildAck(info))
    }

    private fun sendPong() {
        sendRaw(parser.buildPong(ByteArray(0)))
    }
    
    private val recentlySentActions = mutableMapOf<String, Long>()

    fun sendAction(action: String, value: Any?) {
        val actionBytes = action.toByteArray(Charsets.UTF_8)
        val valueStr = value?.toString() ?: ""
        val valueBytes = valueStr.toByteArray(Charsets.UTF_8)
        
        val payload = ByteArray(1 + actionBytes.size + valueBytes.size)
        payload[0] = actionBytes.size.toByte()
        System.arraycopy(actionBytes, 0, payload, 1, actionBytes.size)
        System.arraycopy(valueBytes, 0, payload, 1 + actionBytes.size, valueBytes.size)
        
        recentlySentActions[action] = System.currentTimeMillis()

        val header = ByteArray(5)
        header[0] = Cmd.ACTION.toByte()
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
        val msg = ByteArray(5)
        msg[0] = Cmd.PING.toByte()
        msg[1] = 0; msg[2] = 0; msg[3] = 0; msg[4] = 0;
        sendRaw(msg)
    }

    private val sendExecutor = java.util.concurrent.Executors.newSingleThreadExecutor()

    private fun sendRaw(bytes: ByteArray) {
        sendExecutor.execute {
            try {
                outputStream?.write(bytes)
                outputStream?.flush()
            } catch (e: Throwable) {
                Log.e(TAG, "Transmit failure: ${e.message}")
                cleanupConnection()
            }
        }
    }

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
