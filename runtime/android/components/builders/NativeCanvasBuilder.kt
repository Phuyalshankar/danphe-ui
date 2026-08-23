package io.dolphin.runtime

import android.content.Context
import android.graphics.SurfaceTexture
import android.view.Surface
import android.view.TextureView
import android.view.View

/**
 * 👑 NativeCanvasBuilder — Opcode 0x61
 *
 * Wraps TitanVideoDecoder with hardware-accelerated TextureView for seamless grid rendering.
 */
class NativeCanvasBuilder : ComponentBuilder {

    companion object {
        const val OPCODE = 0x63
    }

    override fun getType(): Int = OPCODE

    override fun getName(): String = "NativeCanvas"

    override fun build(ctx: Context, bin: ByteArray, factory: ViewFactory): View {
        var url = factory.nextStr()
        
        val textureView = TextureView(ctx).apply {
            layoutParams = android.widget.LinearLayout.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                1f
            )
        }

        var decoder: TitanVideoDecoder? = null
        var currentSurface: Surface? = null

        val tcpListener: (Int, Int, ByteArray) -> Unit = { cmdType, senderExt, payload ->
            if (cmdType == TitanTcpClient.CMD_VIDEO_FRAME && payload.isNotEmpty()) {
                val targetExt = url.substringAfter("cam_").toIntOrNull()
                if (targetExt == null || targetExt == 0 || senderExt == targetExt || senderExt == 0) {
                    decoder?.onRawDataReceived(payload)
                }
            }
        }

        textureView.surfaceTextureListener = object : TextureView.SurfaceTextureListener {
            override fun onSurfaceTextureAvailable(st: SurfaceTexture, w: Int, h: Int) {
                val surface = Surface(st)
                currentSurface = surface
                decoder = TitanVideoDecoder(surface)
                TitanTcpClient.addMessageListener(tcpListener)
                android.util.Log.d("NativeCanvasBuilder", "⚡ TextureView ready with TitanVideoDecoder for: $url")
                
                if (!TitanTcpClient.isConnected()) {
                    val host = HotPatchClient.activeHost.ifEmpty { "192.168.1.6" }
                    TitanTcpClient.connect(host, 8888, 101)
                }
            }

            override fun onSurfaceTextureSizeChanged(st: SurfaceTexture, w: Int, h: Int) {}

            override fun onSurfaceTextureDestroyed(st: SurfaceTexture): Boolean {
                TitanTcpClient.removeMessageListener(tcpListener)
                decoder?.release()
                decoder = null
                currentSurface?.release()
                currentSurface = null
                return true
            }

            override fun onSurfaceTextureUpdated(st: SurfaceTexture) {}
        }
        
        return textureView
    }
}
