package io.dolphin.runtime

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Bundle
import android.util.Log
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

object DolphinLocation {
    private var locationListener: LocationListener? = null
    private var locationManagerRef: LocationManager? = null

    fun requestLocation(ctx: Context, stateKey: String) {
        getLocation(ctx) { map ->
            val lat = map["lat"]?.toString() ?: "--"
            val lng = map["lng"]?.toString() ?: "--"
            val acc = map["acc"]?.toString() ?: "--"
            DolphinStateEngine.updateState("sys_gps_lat", lat)
            DolphinStateEngine.updateState("sys_gps_lng", lng)
            DolphinStateEngine.updateState("sys_gps_acc", acc)
        }
    }

    fun getLocation(ctx: Context, callback: (Map<String, Any>) -> Unit) {
        try {
            val locationManager = ctx.getSystemService(Context.LOCATION_SERVICE) as LocationManager
            locationManagerRef = locationManager

            if (ContextCompat.checkSelfPermission(ctx, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
                ContextCompat.checkSelfPermission(ctx, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                Log.w("DolphinLocation", "Location permission not granted. Prompting user...")
                if (ctx is Activity) {
                    ActivityCompat.requestPermissions(ctx, arrayOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION), 202)
                }
                callback(mapOf(
                    "lat" to "Permission Needed",
                    "lng" to "Allow Location Access",
                    "acc" to "Pending"
                ))
                return
            }

            val isGpsEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)
            val isNetEnabled = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)

            if (!isGpsEnabled && !isNetEnabled) {
                callback(mapOf(
                    "lat" to "GPS Disabled",
                    "lng" to "Turn On Location Services",
                    "acc" to "Off"
                ))
                return
            }

            // 1. Try last known location across ALL providers
            val lastLoc = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER)
                ?: locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER)
                ?: locationManager.getLastKnownLocation(LocationManager.PASSIVE_PROVIDER)

            if (lastLoc != null) {
                val latStr = String.format(java.util.Locale.US, "%.5f", lastLoc.latitude)
                val lngStr = String.format(java.util.Locale.US, "%.5f", lastLoc.longitude)
                val accStr = "${lastLoc.accuracy.toInt()}m"
                Log.i("DolphinLocation", "✅ Last Known Location Fix: $latStr, $lngStr ($accStr)")

                DolphinStateEngine.updateState("sys_gps_lat", latStr)
                DolphinStateEngine.updateState("sys_gps_lng", lngStr)
                DolphinStateEngine.updateState("sys_gps_acc", accStr)

                try {
                    val geocoder = android.location.Geocoder(ctx, java.util.Locale.getDefault())
                    @Suppress("DEPRECATION")
                    val addresses = geocoder.getFromLocation(lastLoc.latitude, lastLoc.longitude, 1)
                    if (!addresses.isNullOrEmpty()) {
                        val addr = addresses[0]
                        val city = addr.locality ?: addr.subAdminArea ?: addr.adminArea ?: "Kathmandu"
                        val country = addr.countryName ?: "Nepal"
                        val locName = "$city, $country 🇳🇵"
                        DolphinStateEngine.updateState("sys_gps_name", locName)
                    } else {
                        DolphinStateEngine.updateState("sys_gps_name", "Kathmandu, Nepal 🇳🇵")
                    }
                } catch (e: Exception) {
                    DolphinStateEngine.updateState("sys_gps_name", "Kathmandu, Nepal 🇳🇵")
                }

                callback(mapOf(
                    "lat" to latStr,
                    "lng" to lngStr,
                    "acc" to accStr,
                    "altitude" to lastLoc.altitude,
                    "speed" to lastLoc.speed,
                    "timestamp" to lastLoc.time
                ))
            } else {
                callback(mapOf(
                    "lat" to "Searching Satellites...",
                    "lng" to "Acquiring GPS Fix...",
                    "acc" to "Connecting..."
                ))
            }

            // 2. Request live active location update from available providers
            val listener = object : LocationListener {
                override fun onLocationChanged(location: Location) {
                    val latStr = String.format(java.util.Locale.US, "%.5f", location.latitude)
                    val lngStr = String.format(java.util.Locale.US, "%.5f", location.longitude)
                    val accStr = "${location.accuracy.toInt()}m"
                    Log.i("DolphinLocation", "⚡ Live GPS Fix Acquired: $latStr, $lngStr ($accStr)")

                    DolphinStateEngine.updateState("sys_gps_lat", latStr)
                    DolphinStateEngine.updateState("sys_gps_lng", lngStr)
                    DolphinStateEngine.updateState("sys_gps_acc", accStr)
                    DolphinStateEngine.updateState("notification", "📍 GPS Live: $latStr, $lngStr ($accStr)")

                    callback(mapOf(
                        "lat" to latStr,
                        "lng" to lngStr,
                        "acc" to accStr,
                        "altitude" to location.altitude,
                        "speed" to location.speed,
                        "timestamp" to location.time
                    ))

                    try { locationManager.removeUpdates(this) } catch (_: Exception) {}
                }
                override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}
                override fun onProviderEnabled(provider: String) {}
                override fun onProviderDisabled(provider: String) {}
            }

            if (isGpsEnabled) {
                locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 500L, 0f, listener, android.os.Looper.getMainLooper())
            }
            if (isNetEnabled) {
                locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 500L, 0f, listener, android.os.Looper.getMainLooper())
            }
        } catch (e: Throwable) {
            Log.e("DolphinLocation", "Failed to get location: ${e.message}", e)
            callback(mapOf(
                "lat" to "Location Error",
                "lng" to (e.message ?: "Error"),
                "acc" to "Failed"
            ))
        }
    }

    fun watchLocation(ctx: Context, intervalMs: Long, callback: (Map<String, Any>) -> Unit) {
        getLocation(ctx, callback)
    }

    fun stopWatching() {
        try {
            val listener = locationListener
            val manager = locationManagerRef
            if (manager != null && listener != null) {
                manager.removeUpdates(listener)
                Log.d("DolphinLocation", "Stopped watching location")
            }
            locationListener = null
        } catch (e: Throwable) {
            Log.e("DolphinLocation", "Failed to stop watching location", e)
        }
    }
}
