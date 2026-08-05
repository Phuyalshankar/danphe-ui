package io.dolphin.runtime

import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import android.util.Log

object DolphinBattery {
    
    fun getBatteryLevel(ctx: Context): Float {
        return try {
            val batteryStatus: Intent? = IntentFilter(Intent.ACTION_BATTERY_CHANGED).let { ifilter ->
                ctx.registerReceiver(null, ifilter)
            }
            val level: Int = batteryStatus?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
            val scale: Int = batteryStatus?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: -1
            
            if (level == -1 || scale == -1) {
                -1f
            } else {
                level * 100 / scale.toFloat()
            }
        } catch (e: Exception) {
            Log.e("DolphinBattery", "Failed to get battery level", e)
            -1f
        }
    }

    fun isCharging(ctx: Context): Boolean {
        return try {
            val batteryStatus: Intent? = IntentFilter(Intent.ACTION_BATTERY_CHANGED).let { ifilter ->
                ctx.registerReceiver(null, ifilter)
            }
            val status: Int = batteryStatus?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
            status == BatteryManager.BATTERY_STATUS_CHARGING || status == BatteryManager.BATTERY_STATUS_FULL
        } catch (e: Exception) {
            Log.e("DolphinBattery", "Failed to check charging status", e)
            false
        }
    }
}
