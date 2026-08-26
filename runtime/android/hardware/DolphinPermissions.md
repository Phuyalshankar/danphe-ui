# DolphinJS — Android Permissions Reference

Add these to your `AndroidManifest.xml` to enable each hardware feature.

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- ── NETWORK / FETCH ─────────────────────────────── -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />

    <!-- ── CAMERA ──────────────────────────────────────── -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-feature android:name="android.hardware.camera" android:required="false" />

    <!-- ── AUDIO / MIC ────────────────────────────────── -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />

    <!-- ── STORAGE / FILES ────────────────────────────── -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="29" />
    <!-- Android 13+ granular media permissions -->
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
    <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />

    <!-- ── GPS / LOCATION ─────────────────────────────── -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />

    <!-- ── PHONE / CALLS ──────────────────────────────── -->
    <uses-permission android:name="android.permission.CALL_PHONE" />
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    <uses-permission android:name="android.permission.READ_CALL_LOG" />
    <!-- <uses-permission android:name="android.permission.PROCESS_OUTGOING_CALLS" /> -->

    <!-- ── SMS ─────────────────────────────────────────── -->
    <uses-permission android:name="android.permission.SEND_SMS" />
    <uses-permission android:name="android.permission.READ_SMS" />
    <uses-permission android:name="android.permission.RECEIVE_SMS" />

    <!-- ── CONTACTS ────────────────────────────────────── -->
    <uses-permission android:name="android.permission.READ_CONTACTS" />
    <uses-permission android:name="android.permission.WRITE_CONTACTS" />

    <!-- ── SENSORS ────────────────────────────────────── -->
    <uses-permission android:name="android.permission.ACTIVITY_RECOGNITION" />
    <uses-feature android:name="android.hardware.sensor.accelerometer" android:required="false" />
    <uses-feature android:name="android.hardware.sensor.gyroscope" android:required="false" />
    <uses-feature android:name="android.hardware.sensor.compass" android:required="false" />
    <uses-feature android:name="android.hardware.sensor.barometer" android:required="false" />
    <uses-feature android:name="android.hardware.sensor.proximity" android:required="false" />
    <uses-feature android:name="android.hardware.sensor.light" android:required="false" />
    <uses-feature android:name="android.hardware.sensor.heartrate" android:required="false" />

    <!-- ── BATTERY ─────────────────────────────────────── -->
    <!-- No special permission — uses IntentFilter(BATTERY_CHANGED) -->

    <!-- ── BLUETOOTH ──────────────────────────────────── -->
    <uses-permission android:name="android.permission.BLUETOOTH" android:maxSdkVersion="30" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" android:maxSdkVersion="30" />
    <uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
    <uses-feature android:name="android.hardware.bluetooth" android:required="false" />

    <!-- ── NFC ─────────────────────────────────────────── -->
    <uses-permission android:name="android.permission.NFC" />
    <uses-feature android:name="android.hardware.nfc" android:required="false" />

    <!-- ── VIBRATION / HAPTICS ────────────────────────── -->
    <uses-permission android:name="android.permission.VIBRATE" />

    <!-- ── FLASHLIGHT / TORCH ─────────────────────────── -->
    <uses-permission android:name="android.permission.FLASHLIGHT" />
    <uses-feature android:name="android.hardware.camera.flash" android:required="false" />

    <application ...>
        <!-- Background service for location -->
        <service android:name=".DolphinBackgroundService" android:foregroundServiceType="location" />
    </application>
</manifest>
```

## Runtime Permission Requests

These permissions require **runtime request** (user dialog) on Android 6+:

| Feature        | Permission(s)                                   |
|----------------|-------------------------------------------------|
| Camera         | `CAMERA`                                        |
| Microphone     | `RECORD_AUDIO`                                  |
| GPS            | `ACCESS_FINE_LOCATION`                          |
| Storage (≤12)  | `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`|
| Storage (13+)  | `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO`, `READ_MEDIA_AUDIO` |
| Phone Call     | `CALL_PHONE`                                    |
| Phone State    | `READ_PHONE_STATE`                              |
| Call Log       | `READ_CALL_LOG`                                 |
| SMS Send       | `SEND_SMS`                                      |
| SMS Read       | `READ_SMS`                                      |
| Contacts Read  | `READ_CONTACTS`                                 |
| Contacts Write | `WRITE_CONTACTS`                                |
| Step Counter   | `ACTIVITY_RECOGNITION`                          |
| Bluetooth      | `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT`           |
| NFC            | `NFC`                                           |
