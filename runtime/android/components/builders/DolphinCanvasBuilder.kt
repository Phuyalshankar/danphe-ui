package io.dolphin.runtime

import android.content.Context
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout

/**
 * 🐬 DolphinCanvasBuilder — Unified ComponentBuilder for Canvas & Charts (Opcodes 0x61 & 0x62)
 *
 * Single builder for:
 * 1. Stream Mode (`<div type="canvas" src="http://..." />`)
 * 2. Matrix Mode (`<div type="matrixcanvas" grid="64" src="http://..." />`)
 * 3. Chart Mode (`<div type="chart" chartType="line|bar|pie|gauge" data="10,40,60,90" />`)
 */
class DolphinCanvasBuilder(private val opcode: Int = 0x61) : ComponentBuilder {

    override fun getType(): Int = opcode

    override fun getName(): String = if (opcode == 0x62) "MatrixCanvas" else "DolphinCanvas"

    override fun build(ctx: Context, bin: ByteArray, factory: ViewFactory): View {
        val devHost = DolphinRuntime.instance?.getDevServerHost() ?: "127.0.0.1"
        var rawUrl = factory.nextStr()
        if (devHost.isNotEmpty() && devHost != "127.0.0.1") {
            rawUrl = rawUrl.replace(Regex("http://[0-9a-zA-Z\\.-]+:9094"), "http://$devHost:9094")
                .replace("127.0.0.1", devHost)
                .replace("localhost", devHost)
        }

        val canvas = DolphinCanvas(ctx).apply {
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                0,
                1f
            )
        }

        if (opcode == 0x62 || rawUrl.contains("grid=") || rawUrl.contains("matrix")) {
            val gridCount = if (bin.size > 12 && bin[12].toInt() != 0) (bin[12].toInt() and 0xFF) else 64
            canvas.setMatrix(url = rawUrl, grid = gridCount)
        } else if (rawUrl.startsWith("chart:") || rawUrl.contains("data=")) {
            // Chart Mode
            val parts = rawUrl.substringAfter("chart:").split('?')
            val typeStr = parts[0].uppercase()
            val type = when (typeStr) {
                "BAR" -> DolphinCanvas.ChartType.BAR
                "PIE" -> DolphinCanvas.ChartType.PIE
                "GAUGE" -> DolphinCanvas.ChartType.GAUGE
                else -> DolphinCanvas.ChartType.LINE
            }

            val dataStr = if (parts.size > 1) parts[1].substringAfter("data=").substringBefore('&') else "10,40,25,80,60,90"
            val dataList = dataStr.split(',').mapNotNull { it.trim().toFloatOrNull() }
            canvas.setChart(type = type, data = dataList)
        } else {
            // Single Stream Mode
            canvas.setStream(rawUrl)
        }

        android.util.Log.d("DolphinCanvasBuilder", "🐬 Unified Canvas (0x${Integer.toHexString(opcode)}) initialized for: $rawUrl")
        return canvas
    }
}
