package io.dolphin.runtime

import android.content.Context
import android.util.Log
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.Executors

object DolphinFetch {
    private const val TAG = "DolphinFetch"
    private val executor = Executors.newCachedThreadPool()

    data class FetchResponse(
        val status: Int,
        val body: String,
        val headers: Map<String, String>,
        val ok: Boolean
    )

    /** Perform HTTP GET */
    fun get(
        url: String,
        headers: Map<String, String> = emptyMap(),
        timeout: Int = 10000,
        onResult: (FetchResponse) -> Unit
    ) {
        executor.execute {
            try {
                val conn = (URL(url).openConnection() as HttpURLConnection).apply {
                    requestMethod = "GET"
                    connectTimeout = timeout
                    readTimeout = timeout
                    setRequestProperty("Accept", "application/json")
                    headers.forEach { (k, v) -> setRequestProperty(k, v) }
                }
                val resp = readResponse(conn)
                conn.disconnect()
                onResult(resp)
            } catch (e: Exception) {
                Log.e(TAG, "GET failed: $url", e)
                onResult(FetchResponse(-1, e.message ?: "error", emptyMap(), false))
            }
        }
    }

    /** Perform HTTP POST with JSON body */
    fun post(
        url: String,
        body: String,
        headers: Map<String, String> = emptyMap(),
        timeout: Int = 10000,
        onResult: (FetchResponse) -> Unit
    ) {
        executor.execute {
            try {
                val conn = (URL(url).openConnection() as HttpURLConnection).apply {
                    requestMethod = "POST"
                    connectTimeout = timeout
                    readTimeout = timeout
                    doOutput = true
                    setRequestProperty("Content-Type", "application/json; charset=UTF-8")
                    setRequestProperty("Accept", "application/json")
                    headers.forEach { (k, v) -> setRequestProperty(k, v) }
                }
                OutputStreamWriter(conn.outputStream, Charsets.UTF_8).use {
                    it.write(body)
                    it.flush()
                }
                val resp = readResponse(conn)
                conn.disconnect()
                onResult(resp)
            } catch (e: Exception) {
                Log.e(TAG, "POST failed: $url", e)
                onResult(FetchResponse(-1, e.message ?: "error", emptyMap(), false))
            }
        }
    }

    /** Perform HTTP PUT */
    fun put(
        url: String,
        body: String,
        headers: Map<String, String> = emptyMap(),
        timeout: Int = 10000,
        onResult: (FetchResponse) -> Unit
    ) = request("PUT", url, body, headers, timeout, onResult)

    /** Perform HTTP PATCH */
    fun patch(
        url: String,
        body: String,
        headers: Map<String, String> = emptyMap(),
        timeout: Int = 10000,
        onResult: (FetchResponse) -> Unit
    ) = request("PATCH", url, body, headers, timeout, onResult)

    /** Perform HTTP DELETE */
    fun delete(
        url: String,
        headers: Map<String, String> = emptyMap(),
        timeout: Int = 10000,
        onResult: (FetchResponse) -> Unit
    ) = request("DELETE", url, null, headers, timeout, onResult)

    /** Generic HTTP request */
    fun request(
        method: String,
        url: String,
        body: String? = null,
        headers: Map<String, String> = emptyMap(),
        timeout: Int = 10000,
        onResult: (FetchResponse) -> Unit
    ) {
        executor.execute {
            try {
                val conn = (URL(url).openConnection() as HttpURLConnection).apply {
                    requestMethod = method
                    connectTimeout = timeout
                    readTimeout = timeout
                    setRequestProperty("Accept", "application/json")
                    headers.forEach { (k, v) -> setRequestProperty(k, v) }
                    if (body != null) {
                        doOutput = true
                        setRequestProperty("Content-Type", "application/json; charset=UTF-8")
                    }
                }
                if (body != null) {
                    OutputStreamWriter(conn.outputStream, Charsets.UTF_8).use {
                        it.write(body)
                        it.flush()
                    }
                }
                val resp = readResponse(conn)
                conn.disconnect()
                onResult(resp)
            } catch (e: Exception) {
                Log.e(TAG, "$method failed: $url", e)
                onResult(FetchResponse(-1, e.message ?: "error", emptyMap(), false))
            }
        }
    }

    /** Download file to path */
    fun downloadFile(url: String, savePath: String, onResult: (Boolean, String) -> Unit) {
        executor.execute {
            try {
                val conn = (URL(url).openConnection() as HttpURLConnection).apply {
                    requestMethod = "GET"
                    connectTimeout = 30000
                    readTimeout = 60000
                }
                val file = java.io.File(savePath)
                file.parentFile?.mkdirs()
                conn.inputStream.use { inp ->
                    java.io.FileOutputStream(file).use { out ->
                        inp.copyTo(out)
                    }
                }
                conn.disconnect()
                Log.d(TAG, "Downloaded: $url → $savePath")
                onResult(true, savePath)
            } catch (e: Exception) {
                Log.e(TAG, "downloadFile failed", e)
                onResult(false, e.message ?: "error")
            }
        }
    }

    private fun readResponse(conn: HttpURLConnection): FetchResponse {
        val status = conn.responseCode
        val stream = if (status in 200..299) conn.inputStream else conn.errorStream
        val body = try {
            BufferedReader(InputStreamReader(stream, Charsets.UTF_8)).use {
                it.readText()
            }
        } catch (e: Exception) { "" }
        val headers = conn.headerFields
            .filterKeys { it != null }
            .mapValues { it.value.firstOrNull() ?: "" }
        return FetchResponse(status, body, headers, status in 200..299)
    }
}
