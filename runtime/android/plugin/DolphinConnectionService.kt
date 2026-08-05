package io.dolphin.runtime

import android.os.Build
import android.telecom.Connection
import android.telecom.ConnectionRequest
import android.telecom.ConnectionService
import android.telecom.PhoneAccountHandle
import android.telecom.TelecomManager
import android.telecom.VideoProfile
import android.util.Log
import androidx.annotation.RequiresApi

@RequiresApi(Build.VERSION_CODES.M)
class DolphinConnectionService : ConnectionService() {

    override fun onCreateIncomingConnection(
        connectionManagerPhoneAccount: PhoneAccountHandle?,
        request: ConnectionRequest?
    ): Connection {
        Log.d("DolphinTelecom", "Incoming connection created")
        
        val connection = DolphinConnection()
        connection.setInitializing()
        
        connection.videoState = request?.videoState ?: VideoProfile.STATE_AUDIO_ONLY
        
        val address = request?.address
        connection.setAddress(address, TelecomManager.PRESENTATION_ALLOWED)
        
        val callerName = request?.extras?.getString("CALLER_NAME") ?: "Intercom Caller"
        connection.setCallerDisplayName(callerName, TelecomManager.PRESENTATION_ALLOWED)
        
        connection.setRinging()
        
        return connection
    }

    override fun onCreateOutgoingConnection(
        connectionManagerPhoneAccount: PhoneAccountHandle?,
        request: ConnectionRequest?
    ): Connection {
        Log.d("DolphinTelecom", "Outgoing connection created")
        
        val connection = DolphinConnection()
        connection.setDialing()
        
        val address = request?.address
        connection.setAddress(address, TelecomManager.PRESENTATION_ALLOWED)
        
        return connection
    }
}

@RequiresApi(Build.VERSION_CODES.M)
class DolphinConnection : Connection() {

    init {
        connectionCapabilities = CAPABILITY_MUTE or CAPABILITY_HOLD
    }

    override fun onAnswer() {
        super.onAnswer()
        Log.d("DolphinTelecom", "User answered the call")
        setActive() 
    }

    override fun onAnswer(videoState: Int) {
        super.onAnswer(videoState)
        Log.d("DolphinTelecom", "User answered the video call")
        setActive()
    }

    override fun onDisconnect() {
        super.onDisconnect()
        Log.d("DolphinTelecom", "User disconnected the call")
        setDisconnected(android.telecom.DisconnectCause(android.telecom.DisconnectCause.LOCAL))
        destroy()
    }

    override fun onReject() {
        super.onReject()
        Log.d("DolphinTelecom", "User rejected the call")
        setDisconnected(android.telecom.DisconnectCause(android.telecom.DisconnectCause.REJECTED))
        destroy()
    }

    override fun onAbort() {
        super.onAbort()
        Log.d("DolphinTelecom", "Call aborted")
        setDisconnected(android.telecom.DisconnectCause(android.telecom.DisconnectCause.CANCELED))
        destroy()
    }
}
