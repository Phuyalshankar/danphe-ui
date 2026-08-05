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
        try {
            val locationManager = ctx.getSystemService(Context.LOCATION_SERVICE) as LocationManager

            if (ContextCompat.checkSelfPermission(ctx, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                Log.d("DolphinLocation", "Location permission not granted. Requesting...")
                if (ctx is Activity) {
                    ActivityCompat.requestPermissions(ctx, arrayOf(Manifest.permission.ACCESS_FINE_LOCATION), 202)
                }
                return
            }

            // Try to get last known location quickly
            val lastLoc = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER)
                ?: locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER)

            if (lastLoc != null) {
                updateState(stateKey, lastLoc)
            }

            // Request a single update
            locationManager.requestSingleUpdate(
                LocationManager.GPS_PROVIDER,
                object : LocationListener {
                    override fun onLocationChanged(location: Location) {
                        updateState(stateKey, location)
                    }
                    override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}
                    override fun onProviderEnabled(provider: String) {}
                    override fun onProviderDisabled(provider: String) {}
                },
                null
            )
            Log.d("DolphinLocation", "Requested location update for key: $stateKey")
        } catch (e: Throwable) {
            Log.e("DolphinLocation", "Failed to get location", e)
            DolphinStateEngine.handleAction("$stateKey:=error")
        }
    }

    private fun updateState(stateKey: String, loc: Location) {
        val lat = loc.latitude
        val lng = loc.longitude
        Log.d("DolphinLocation", "Location acquired: $lat, $lng")
        DolphinStateEngine.handleAction("$stateKey:=$lat,$lng")
    }

    fun getLocation(ctx: Context, callback: (Map<String, Any>) -> Unit) {
        try {
            val locationManager = ctx.getSystemService(Context.LOCATION_SERVICE) as LocationManager

            if (ContextCompat.checkSelfPermission(ctx, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                Log.d("DolphinLocation", "Location permission not granted")
                callback(mapOf("error" to "Permission denied"))
                return
            }

            val lastLoc = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER)
                ?: locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER)

            if (lastLoc != null) {
                callback(mapOf(
                    "latitude" to lastLoc.latitude,
                    "longitude" to lastLoc.longitude,
                    "accuracy" to lastLoc.accuracy,
                    "altitude" to lastLoc.altitude,
                    "speed" to lastLoc.speed,
                    "timestamp" to lastLoc.time
                ))
            }

            locationManager.requestSingleUpdate(
                LocationManager.GPS_PROVIDER,
                object : LocationListener {
                    override fun onLocationChanged(location: Location) {
                        callback(mapOf(
                            "latitude" to location.latitude,
                            "longitude" to location.longitude,
                            "accuracy" to location.accuracy,
                            "altitude" to location.altitude,
                            "speed" to location.speed,
                            "timestamp" to location.time
                        ))
                    }
                    override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}
                    override fun onProviderEnabled(provider: String) {}
                    override fun onProviderDisabled(provider: String) {}
                },
                null
            )
        } catch (e: Throwable) {
            Log.e("DolphinLocation", "Failed to get location", e)
            callback(mapOf("error" to (e.message ?: "Unknown error")))
        }
    }

    fun watchLocation(ctx: Context, intervalMs: Long, callback: (Map<String, Any>) -> Unit) {
        try {
            val locationManager = ctx.getSystemService(Context.LOCATION_SERVICE) as LocationManager
            locationManagerRef = locationManager

            if (ContextCompat.checkSelfPermission(ctx, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                Log.d("DolphinLocation", "Location permission not granted")
                callback(mapOf("error" to "Permission denied"))
                return
            }

            stopWatching() // Stop any previous watcher

            val listener = object : LocationListener {
                override fun onLocationChanged(location: Location) {
                    callback(mapOf(
                        "latitude" to location.latitude,
                        "longitude" to location.longitude,
                        "accuracy" to location.accuracy,
                        "altitude" to location.altitude,
                        "speed" to location.speed,
                        "timestamp" to location.time
                    ))
                }
                override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}
                override fun onProviderEnabled(provider: String) {}
                override fun onProviderDisabled(provider: String) {}
            }
            locationListener = listener

            locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, intervalMs, 0f, listener)
            locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, intervalMs, 0f, listener)
            Log.d("DolphinLocation", "Started watching location with interval: $intervalMs ms")
        } catch (e: Throwable) {
            Log.e("DolphinLocation", "Failed to watch location", e)
            callback(mapOf("error" to (e.message ?: "Unknown error")))
        }
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
