package io.dolphin.runtime

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Build
import android.util.Log

object DolphinSensors {
    private const val TAG = "DolphinSensors"
    private var sensorManager: SensorManager? = null
    private val activeListeners = mutableMapOf<String, SensorEventListener>()

    data class SensorReading(
        val type: String,
        val x: Float = 0f,
        val y: Float = 0f,
        val z: Float = 0f,
        val value: Float = 0f,
        val accuracy: Int = 0
    )

    private fun getSM(ctx: Context): SensorManager {
        if (sensorManager == null) {
            sensorManager = ctx.getSystemService(Context.SENSOR_SERVICE) as SensorManager
        }
        return sensorManager!!
    }

    private fun register(ctx: Context, key: String, sensorType: Int, delay: Int = SensorManager.SENSOR_DELAY_NORMAL, onData: (SensorReading) -> Unit) {
        val sm = getSM(ctx)
        val sensor = sm.getDefaultSensor(sensorType)
        if (sensor == null) {
            Log.w(TAG, "Sensor not available: $sensorType")
            return
        }
        stop(key)
        val listener = object : SensorEventListener {
            override fun onSensorChanged(event: SensorEvent) {
                val v = event.values
                onData(SensorReading(
                    type = key,
                    x = if (v.size > 0) v[0] else 0f,
                    y = if (v.size > 1) v[1] else 0f,
                    z = if (v.size > 2) v[2] else 0f,
                    value = if (v.size > 0) v[0] else 0f,
                    accuracy = event.accuracy
                ))
            }
            override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
        }
        sm.registerListener(listener, sensor, delay)
        activeListeners[key] = listener
        Log.d(TAG, "Sensor started: $key")
    }

    fun stop(key: String) {
        activeListeners.remove(key)?.let {
            sensorManager?.unregisterListener(it)
            Log.d(TAG, "Sensor stopped: $key")
        }
    }

    fun stopAll() {
        activeListeners.keys.toList().forEach { stop(it) }
    }

    // ── Accelerometer ────────────────────────────────────────
    fun startAccelerometer(ctx: Context, intervalMs: Int = 100, onData: (SensorReading) -> Unit) =
        register(ctx, "accelerometer", Sensor.TYPE_ACCELEROMETER, msToDelay(intervalMs), onData)

    // ── Gyroscope ────────────────────────────────────────────
    fun startGyroscope(ctx: Context, intervalMs: Int = 100, onData: (SensorReading) -> Unit) =
        register(ctx, "gyroscope", Sensor.TYPE_GYROSCOPE, msToDelay(intervalMs), onData)

    // ── Magnetometer / Compass ───────────────────────────────
    fun startCompass(ctx: Context, intervalMs: Int = 100, onData: (SensorReading) -> Unit) =
        register(ctx, "compass", Sensor.TYPE_MAGNETIC_FIELD, msToDelay(intervalMs), onData)

    // ── Linear Acceleration (no gravity) ─────────────────────
    fun startLinearAcceleration(ctx: Context, intervalMs: Int = 100, onData: (SensorReading) -> Unit) =
        register(ctx, "linear_acceleration", Sensor.TYPE_LINEAR_ACCELERATION, msToDelay(intervalMs), onData)

    // ── Gravity ──────────────────────────────────────────────
    fun startGravity(ctx: Context, intervalMs: Int = 100, onData: (SensorReading) -> Unit) =
        register(ctx, "gravity", Sensor.TYPE_GRAVITY, msToDelay(intervalMs), onData)

    // ── Barometer (Pressure) ─────────────────────────────────
    fun startBarometer(ctx: Context, intervalMs: Int = 500, onData: (SensorReading) -> Unit) =
        register(ctx, "barometer", Sensor.TYPE_PRESSURE, msToDelay(intervalMs), onData)

    // ── Ambient Light ────────────────────────────────────────
    fun startLightSensor(ctx: Context, intervalMs: Int = 500, onData: (SensorReading) -> Unit) =
        register(ctx, "light", Sensor.TYPE_LIGHT, msToDelay(intervalMs), onData)

    // ── Proximity ────────────────────────────────────────────
    fun startProximity(ctx: Context, onData: (SensorReading) -> Unit) =
        register(ctx, "proximity", Sensor.TYPE_PROXIMITY, SensorManager.SENSOR_DELAY_NORMAL, onData)

    // ── Rotation Vector ──────────────────────────────────────
    fun startRotationVector(ctx: Context, intervalMs: Int = 100, onData: (SensorReading) -> Unit) =
        register(ctx, "rotation", Sensor.TYPE_ROTATION_VECTOR, msToDelay(intervalMs), onData)

    // ── Step Counter ─────────────────────────────────────────
    fun startStepCounter(ctx: Context, onData: (SensorReading) -> Unit) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            register(ctx, "step_counter", Sensor.TYPE_STEP_COUNTER, SensorManager.SENSOR_DELAY_NORMAL, onData)
        } else {
            Log.w(TAG, "Step counter requires API 19+")
        }
    }

    // ── Step Detector ────────────────────────────────────────
    fun startStepDetector(ctx: Context, onData: (SensorReading) -> Unit) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            register(ctx, "step_detector", Sensor.TYPE_STEP_DETECTOR, SensorManager.SENSOR_DELAY_NORMAL, onData)
        }
    }

    // ── Temperature ──────────────────────────────────────────
    fun startTemperature(ctx: Context, onData: (SensorReading) -> Unit) =
        register(ctx, "temperature", Sensor.TYPE_AMBIENT_TEMPERATURE, SensorManager.SENSOR_DELAY_NORMAL, onData)

    // ── Humidity ─────────────────────────────────────────────
    fun startHumidity(ctx: Context, onData: (SensorReading) -> Unit) =
        register(ctx, "humidity", Sensor.TYPE_RELATIVE_HUMIDITY, SensorManager.SENSOR_DELAY_NORMAL, onData)

    // ── Heart Rate (wearables) ───────────────────────────────
    fun startHeartRate(ctx: Context, onData: (SensorReading) -> Unit) =
        register(ctx, "heart_rate", Sensor.TYPE_HEART_RATE, SensorManager.SENSOR_DELAY_NORMAL, onData)

    // ── Device Orientation (derived from accel + mag) ────────
    fun getOrientation(ctx: Context, onData: (azimuth: Float, pitch: Float, roll: Float) -> Unit) {
        val sm = getSM(ctx)
        val accel = sm.getDefaultSensor(Sensor.TYPE_ACCELEROMETER) ?: return
        val mag   = sm.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD) ?: return
        val accelValues = FloatArray(3)
        val magValues   = FloatArray(3)
        var accelReady  = false
        var magReady    = false

        val listener = object : SensorEventListener {
            override fun onSensorChanged(event: SensorEvent) {
                when (event.sensor.type) {
                    Sensor.TYPE_ACCELEROMETER -> { accelValues[0]=event.values[0]; accelValues[1]=event.values[1]; accelValues[2]=event.values[2]; accelReady = true }
                    Sensor.TYPE_MAGNETIC_FIELD -> { magValues[0]=event.values[0]; magValues[1]=event.values[1]; magValues[2]=event.values[2]; magReady = true }
                }
                if (accelReady && magReady) {
                    val rotMat = FloatArray(9)
                    val incMat = FloatArray(9)
                    if (SensorManager.getRotationMatrix(rotMat, incMat, accelValues, magValues)) {
                        val orientation = FloatArray(3)
                        SensorManager.getOrientation(rotMat, orientation)
                        val azimuth = Math.toDegrees(orientation[0].toDouble()).toFloat()
                        val pitch   = Math.toDegrees(orientation[1].toDouble()).toFloat()
                        val roll    = Math.toDegrees(orientation[2].toDouble()).toFloat()
                        onData(azimuth, pitch, roll)
                    }
                }
            }
            override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
        }
        sm.registerListener(listener, accel, SensorManager.SENSOR_DELAY_NORMAL)
        sm.registerListener(listener, mag, SensorManager.SENSOR_DELAY_NORMAL)
        activeListeners["orientation"] = listener
    }

    /** List all available sensors on the device */
    fun listAvailableSensors(ctx: Context): List<Map<String, String>> {
        return getSM(ctx).getSensorList(Sensor.TYPE_ALL).map { s ->
            mapOf(
                "name"   to s.name,
                "vendor" to s.vendor,
                "type"   to s.type.toString(),
                "power"  to s.power.toString()
            )
        }
    }

    private fun msToDelay(ms: Int): Int = when {
        ms <= 20  -> SensorManager.SENSOR_DELAY_FASTEST
        ms <= 60  -> SensorManager.SENSOR_DELAY_GAME
        ms <= 200 -> SensorManager.SENSOR_DELAY_UI
        else      -> SensorManager.SENSOR_DELAY_NORMAL
    }

    fun stopAccelerometer() = stop("accelerometer")
    fun stopGyroscope()     = stop("gyroscope")
    fun stopCompass()       = stop("compass")
    fun stopBarometer()     = stop("barometer")
    fun stopLight()         = stop("light")
    fun stopProximity()     = stop("proximity")
    fun stopStepCounter()   = stop("step_counter")
}
