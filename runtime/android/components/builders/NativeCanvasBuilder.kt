package io.dolphin.runtime

import android.content.Context
import android.view.View
import android.widget.LinearLayout

/**
 * 👑 NativeCanvasBuilder — Opcode 0x61
 *
 * Instantiates TitanNativeCanvas (Pure Native EGL/Surface Canvas Engine).
 * Competes directly with Hikvision iVMS / Dahua SmartPSS.
 *
 * JSX Usage:
 * ```jsx
 * <div type="0x61" src="http://192.168.1.15:9094" className="w-full h-full" />
 * ```
 */
class NativeCanvasBuilder : ComponentBuilder {

    companion object {
        const val OPCODE = 0x61
    }

    override fun getType(): Int = OPCODE

    override fun getName(): String = "NativeCanvas"

    override fun build(ctx: Context, bin: ByteArray, factory: ViewFactory): View {
        val devHost = DolphinRuntime.instance?.getDevServerHost() ?: "127.0.0.1"
        var url = factory.nextStr()
        if (url.contains("127.0.0.1") || url.contains("localhost")) {
            url = url.replace("127.0.0.1", devHost).replace("localhost", devHost)
        }

        val titanCanvas = TitanCanvas(ctx).apply {
            layoutParams = android.widget.LinearLayout.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                1f
            )
            setServerUrl(url)
        }

        android.util.Log.d("NativeCanvasBuilder", "⚡ Titan Native Canvas (0x61) initialized for server: $url")
        return titanCanvas
    }
}
