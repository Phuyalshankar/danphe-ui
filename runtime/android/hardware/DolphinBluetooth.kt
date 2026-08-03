package io.dolphin.runtime.hardware

import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothManager
import android.content.Context
import android.content.Intent
import android.provider.Settings
import android.util.Log
import io.dolphin.runtime.DolphinStateEngine

object DolphinBluetooth {
    private const val TAG = "DolphinBluetooth"

    fun isEnabled(ctx: Context): Boolean {
        return try {
            val bluetoothManager = ctx.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
            val adapter: BluetoothAdapter? = bluetoothManager.adapter
            adapter?.isEnabled == true
        } catch (e: Exception) {
            Log.e(TAG, "Failed to check Bluetooth status", e)
            false
        }
    }

    fun openBluetoothSettings(ctx: Context) {
        try {
            val intent = Intent(Settings.ACTION_BLUETOOTH_SETTINGS)
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            ctx.startActivity(intent)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to open Bluetooth settings", e)
        }
    }

    fun getBondedDevices(ctx: Context): List<Map<String, String>> {
        val list = mutableListOf<Map<String, String>>()
        try {
            val bluetoothManager = ctx.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
            val adapter = bluetoothManager.adapter
            if (adapter != null && adapter.isEnabled) {
                val paired = adapter.bondedDevices
                for (device in paired) {
                    list.add(mapOf(
                        "name" to (device.name ?: "Unknown IoT Device"),
                        "address" to device.address
                    ))
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error getting bonded IoT devices", e)
        }
        return list
    }

    fun scanIoTDevices(ctx: Context, stateKey: String = "lastTransferStatus") {
        try {
            val enabled = isEnabled(ctx)
            if (!enabled) {
                val txt = "📡 Bluetooth OFF. Opening BT Settings..."
                DolphinStateEngine.updateState(stateKey, txt)
                openBluetoothSettings(ctx)
                return
            }

            val paired = getBondedDevices(ctx)
            val names = paired.map { it["name"] }
            val txt = if (paired.isEmpty()) {
                "📡 Bluetooth Active (Scanning IoT BLE Devices...)"
            } else {
                "📡 Paired IoT Devices (${paired.size}): ${names.take(3).joinToString(", ")}"
            }
            DolphinStateEngine.updateState(stateKey, txt)
        } catch (e: Exception) {
            Log.e(TAG, "Error scanning IoT devices", e)
            DolphinStateEngine.updateState(stateKey, "📡 Bluetooth Engine Active")
        }
    }
}
