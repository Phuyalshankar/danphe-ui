package io.dolphin.runtime.hardware

import android.content.Context
import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CameraManager
import android.util.Log

object DolphinFlashlight {
    fun setFlashlight(ctx: Context, state: Boolean) {
        try {
            val cameraManager = ctx.getSystemService(Context.CAMERA_SERVICE) as CameraManager
            var selectedId: String? = null

            for (id in cameraManager.cameraIdList) {
                try {
                    val chars = cameraManager.getCameraCharacteristics(id)
                    val hasFlash = chars.get(CameraCharacteristics.FLASH_INFO_AVAILABLE) == true
                    val facing = chars.get(CameraCharacteristics.LENS_FACING)
                    if (hasFlash && facing == CameraCharacteristics.LENS_FACING_BACK) {
                        selectedId = id
                        break
                    } else if (hasFlash && selectedId == null) {
                        selectedId = id
                    }
                } catch (e: Throwable) {}
            }

            if (selectedId == null) {
                selectedId = cameraManager.cameraIdList.firstOrNull()
            }

            if (selectedId != null) {
                cameraManager.setTorchMode(selectedId, state)
                Log.d("DolphinFlashlight", "Flashlight ($selectedId) turned ${if(state) "ON" else "OFF"}")
            } else {
                Log.e("DolphinFlashlight", "No camera with flashlight found")
            }
        } catch (e: Throwable) {
            Log.e("DolphinFlashlight", "Failed to toggle flashlight: ${e.message}", e)
        }
    }
}
