package io.dolphin.runtime


import android.content.Context
import android.util.Log
import android.graphics.BitmapFactory
import java.io.InputStream
import java.io.OutputStream
import java.net.Socket
import java.net.InetSocketAddress
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicBoolean
import kotlin.concurrent.thread

object TitanTcpClient {
    private const val TAG = "TitanTcpClient"
    private var socket: Socket? = null
    private var outputStream: OutputStream? = null
    private val isConnected = AtomicBoolean(false)
    private val executor = Executors.newSingleThreadExecutor()
    private var myExt: Int = 0
    private var activeCallPartnerExt: Int = 0

    private var lastHost = ""
    private var lastPort = 9092
    private val isReconnecting = AtomicBoolean(false)

    // Command types matching TBSP_CMD
    const val CMD_REGISTER = 0x08
    const val CMD_INVITE = 0x10
    const val CMD_ACCEPT = 0x11
    const val CMD_REJECT = 0x12
    const val CMD_HANGUP = 0x13
    const val CMD_AUDIO_FRAME = 0x14
    const val CMD_VIDEO_FRAME = 0x40
    const val CMD_CHAT_MESSAGE = 0x20
    const val CMD_HEARTBEAT = 0x30
    const val CMD_HEARTBEAT_ACK = 0x31

    private val messageListeners = mutableListOf<(cmdType: Int, senderExt: Int, payload: ByteArray) -> Unit>()

    fun addMessageListener(listener: (cmdType: Int, senderExt: Int, payload: ByteArray) -> Unit) {
        synchronized(messageListeners) {
            if (!messageListeners.contains(listener)) {
                messageListeners.add(listener)
            }
        }
    }

    fun removeMessageListener(listener: (cmdType: Int, senderExt: Int, payload: ByteArray) -> Unit) {
        synchronized(messageListeners) {
            messageListeners.remove(listener)
        }
    }

    private var serverSocket: java.net.ServerSocket? = null

    fun startServer(port: Int, ext: Int) {
        if (isConnected.get()) {
            disconnect()
        }
        myExt = ext
        thread(name = "TitanTcpServerListenerThread") {
            try {
                Log.i(TAG, "Starting Titan P2P TCP Server on port $port...")
                serverSocket = java.net.ServerSocket(port)
                val sock = serverSocket?.accept() ?: return@thread
                sock.soTimeout = 40000 // 40 seconds timeout
                socket = sock
                outputStream = sock.getOutputStream()
                isConnected.set(true)
                Log.i(TAG, "P2P client connected: ${sock.remoteSocketAddress}")
                DolphinStateEngine.set("titan_connected", "● TCP ONLINE")

                // Send register packet immediately (keeps protocol aligned)
                sendPacket(CMD_REGISTER, myExt, 0, null)

                // Start reader thread
                thread(name = "TitanTcpReadThread") {
                    readLoop(sock.getInputStream())
                }

                // Start heartbeat thread
                thread(name = "TitanTcpHeartbeatThread") {
                    heartbeatLoop()
                }
            } catch (e: Exception) {
                Log.e(TAG, "Server socket failed: ${e.message}")
                disconnect()
            }
        }
    }

    fun startAutoConnectLoop(host: String = "192.168.1.6", port: Int = 8888, ext: Int = 101) {
        lastHost = host
        lastPort = port
        myExt = ext
        thread(name = "TitanAutoConnectThread", isDaemon = true) {
            while (true) {
                if (!isConnected.get()) {
                    try {
                        val activeH = if (HotPatchClient.activeHost.isNotEmpty() && HotPatchClient.activeHost != "127.0.0.1") HotPatchClient.activeHost else host
                        Log.i(TAG, "🔄 Auto-connecting to Titan TCP at $activeH:$port (ext $ext)...")
                        
                        android.os.Handler(android.os.Looper.getMainLooper()).post {
                            DolphinStateEngine.set("sys_tcp_status", "● CONNECTING to $activeH:$port...")
                        }

                        val sock = Socket()
                        sock.connect(InetSocketAddress(activeH, port), 4000)
                        sock.tcpNoDelay = true
                        sock.soTimeout = 0
                        socket = sock
                        outputStream = sock.getOutputStream()
                        isConnected.set(true)
                        Log.i(TAG, "✅ Auto-connected to Titan TCP successfully at $activeH:$port")
                        
                        android.os.Handler(android.os.Looper.getMainLooper()).post {
                            DolphinStateEngine.set("titan_connected", "● TCP ONLINE")
                            DolphinStateEngine.set("sys_tcp_status", "● ONLINE ($activeH:$port)")
                        }

                        // Send register packet immediately
                        sendPacket(CMD_REGISTER, myExt, 0, null)

                        // Block and read continuous stream
                        readLoop(sock.getInputStream())
                    } catch (e: Exception) {
                        val err = e.message ?: e.javaClass.simpleName
                        Log.w(TAG, "Titan TCP connection retry: $err")
                        android.os.Handler(android.os.Looper.getMainLooper()).post {
                            DolphinStateEngine.set("sys_tcp_status", "● ERR: $err")
                        }
                        disconnect()
                    }
                }
                try {
                    Thread.sleep(2000) // Retry every 2 seconds automatically
                } catch (_: Exception) {}
            }
        }
    }

    fun connect(host: String, port: Int, ext: Int) {
        startAutoConnectLoop(host, port, ext)
    }

    fun disconnect() {
        if (!isConnected.getAndSet(false)) {
            try { serverSocket?.close() } catch (_: Exception) {}
            serverSocket = null
            DolphinStateEngine.set("titan_connected", "● DISCONNECTED")
            DolphinStateEngine.set("sys_tcp_status", "● DISCONNECTED")
            return
        }
        try {
            socket?.close()
        } catch (e: Exception) {}
        try {
            serverSocket?.close()
        } catch (e: Exception) {}
        socket = null
        serverSocket = null
        outputStream = null
        activeCallPartnerExt = 0
        DolphinStateEngine.set("titan_connected", "● DISCONNECTED")
        DolphinStateEngine.set("sys_tcp_status", "● DISCONNECTED")
        Log.i(TAG, "Disconnected from Titan TCP session")
    }


    fun isConnected(): Boolean = isConnected.get()

    fun setCallPartner(partnerExt: Int) {
        activeCallPartnerExt = partnerExt
    }

    fun getCallPartner(): Int = activeCallPartnerExt

    fun sendPacket(cmdType: Int, sender: Int, target: Int, payload: ByteArray?) {
        if (!isConnected.get()) return
        val actualSender = if (sender == 0) myExt else sender
        executor.execute {
            try {
                val payloadLen = payload?.size ?: 0
                val header = ByteBuffer.allocate(24).order(ByteOrder.BIG_ENDIAN)
                header.putShort(0x5442.toShort()) // Signature 'TB'
                header.put(0x02.toByte())        // Version
                header.put(cmdType.toByte())      // CmdType
                header.putInt(actualSender)
                header.putInt(target)
                header.putInt(payloadLen)
                header.putInt(0)                  // SeqNo
                header.putShort(0)                // SessionId
                header.put(0.toByte())            // Flags
                header.put(0.toByte())            // Checksum

                val out = outputStream ?: return@execute
                synchronized(out) {
                    out.write(header.array())
                    if (payload != null && payloadLen > 0) {
                        out.write(payload)
                    }
                    out.flush()
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error sending packet: ${e.message}")
                disconnect()
            }
        }
    }

    private fun readLoop(inputStream: InputStream) {
        val headerBuffer = ByteArray(24)
        while (isConnected.get()) {
            // Read exact 24-byte header
            var bytesRead = 0
            while (bytesRead < 24) {
                val read = inputStream.read(headerBuffer, bytesRead, 24 - bytesRead)
                if (read == -1) {
                    Log.i(TAG, "Server closed Titan stream")
                    return
                }
                bytesRead += read
            }

            val header = ByteBuffer.wrap(headerBuffer).order(ByteOrder.BIG_ENDIAN)
            val signature = header.short
            if (signature != 0x5442.toShort()) {
                // If signature didn't match, slide 1 byte and search for 0x5442 'TB'
                continue
            }
            val version = header.get()
            val cmdType = header.get().toInt() and 0xFF
            val sender = header.int
            val target = header.int
            val payloadLen = header.int
            val seqNo = header.int
            val sessionId = header.short
            val flags = header.get()
            val checksum = header.get()

            // Read payload safely
            if (payloadLen in 1..2097152) { // Max 2MB per frame
                val pBuffer = ByteArray(payloadLen)
                var pBytesRead = 0
                while (pBytesRead < payloadLen) {
                    val read = inputStream.read(pBuffer, pBytesRead, payloadLen - pBytesRead)
                    if (read == -1) return
                    pBytesRead += read
                }
                handleIncomingPacket(cmdType, sender, pBuffer)
            } else if (payloadLen == 0) {
                handleIncomingPacket(cmdType, sender, ByteArray(0))
            }
        }
    }

    private fun heartbeatLoop() {
        while (isConnected.get()) {
            try {
                Thread.sleep(15000) // 15 seconds heartbeat interval
                if (isConnected.get()) {
                    sendPacket(CMD_HEARTBEAT, myExt, 0, null)
                }
            } catch (e: InterruptedException) {
                break
            } catch (e: Exception) {
                Log.e(TAG, "Heartbeat loop error: ${e.message}")
                disconnect()
                break
            }
        }
    }

    private fun handleIncomingPacket(cmdType: Int, senderExt: Int, payload: ByteArray) {
        // Forward high-frequency audio frames directly to the audio playback queue
        if (cmdType == CMD_AUDIO_FRAME) {
            DolphinHardwareBridge.playAudioStreamDirect(payload)
            return
        }
        if (cmdType == CMD_VIDEO_FRAME) {
            // Give priority to attached listeners (like TitanNativeCanvas for GPU decoding)
            synchronized(messageListeners) {
                messageListeners.forEach { it.invoke(cmdType, senderExt, payload) }
            }
            
            // Removed fallback to video call rendering to prevent UI thread freezing
            return
        }

        // Otherwise pass to bridge or custom listener
        synchronized(messageListeners) {
            messageListeners.forEach { it.invoke(cmdType, senderExt, payload) }
        }
    }
}
