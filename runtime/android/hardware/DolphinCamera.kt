package io.dolphin.runtime

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.provider.MediaStore
import android.util.Log

object DolphinCamera {
    fun hasCamera(ctx: Context): Boolean {
        return ctx.packageManager.hasSystemFeature(PackageManager.FEATURE_CAMERA_ANY)
    }

    fun openCamera(ctx: Context) {
        try {
            val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
            if (ctx !is Activity) {
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            ctx.startActivity(intent)
            Log.d("DolphinCamera", "Camera opened via ACTION_IMAGE_CAPTURE")
        } catch (e: Throwable) {
            Log.e("DolphinCamera", "Failed ACTION_IMAGE_CAPTURE, trying STILL_IMAGE_CAMERA", e)
            try {
                val fallback = Intent(MediaStore.INTENT_ACTION_STILL_IMAGE_CAMERA)
                if (ctx !is Activity) {
                    fallback.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                ctx.startActivity(fallback)
                Log.d("DolphinCamera", "Camera opened via STILL_IMAGE_CAMERA")
            } catch (e2: Throwable) {
                Log.e("DolphinCamera", "Failed to open camera fallback", e2)
            }
        }
    }
}
