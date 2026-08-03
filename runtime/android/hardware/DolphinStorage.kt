package io.dolphin.runtime.hardware

import android.content.Context
import android.content.Intent
import android.database.Cursor
import android.net.Uri
import android.os.Environment
import android.provider.MediaStore
import android.provider.OpenableColumns
import android.util.Log
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.io.IOException

object DolphinStorage {
    private const val TAG = "DolphinStorage"

    // ── File Picker ──────────────────────────────────────────

    /** Open system file picker (use from Activity) */
    fun openFilePicker(mimeType: String = "*/*"): Intent {
        return Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = mimeType
            putExtra(Intent.EXTRA_ALLOW_MULTIPLE, false)
        }
    }

    /** Open multi-file picker */
    fun openMultiFilePicker(mimeType: String = "*/*"): Intent {
        return Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = mimeType
            putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true)
        }
    }

    // ── Read / Write ─────────────────────────────────────────

    /** Read file by path to string */
    fun readFile(path: String): String? {
        return try {
            File(path).readText(Charsets.UTF_8)
        } catch (e: Exception) {
            Log.e(TAG, "readFile failed: $path", e)
            null
        }
    }

    /** Read file from URI (content://...) */
    fun readFileUri(ctx: Context, uri: Uri): ByteArray? {
        return try {
            ctx.contentResolver.openInputStream(uri)?.use { it.readBytes() }
        } catch (e: Exception) {
            Log.e(TAG, "readFileUri failed", e)
            null
        }
    }

    /** Read file URI as UTF-8 text */
    fun readFileUriText(ctx: Context, uri: Uri): String? {
        return readFileUri(ctx, uri)?.toString(Charsets.UTF_8)
    }

    /** Write text to a file */
    fun writeFile(path: String, content: String): Boolean {
        return try {
            val file = File(path)
            file.parentFile?.mkdirs()
            file.writeText(content, Charsets.UTF_8)
            Log.d(TAG, "writeFile: $path")
            true
        } catch (e: Exception) {
            Log.e(TAG, "writeFile failed: $path", e)
            false
        }
    }

    /** Write bytes to a file */
    fun writeFileBytes(path: String, data: ByteArray): Boolean {
        return try {
            val file = File(path)
            file.parentFile?.mkdirs()
            file.writeBytes(data)
            true
        } catch (e: Exception) {
            Log.e(TAG, "writeFileBytes failed: $path", e)
            false
        }
    }

    /** Delete a file */
    fun deleteFile(path: String): Boolean {
        return try {
            File(path).delete()
        } catch (e: Exception) {
            Log.e(TAG, "deleteFile failed: $path", e)
            false
        }
    }

    /** List files in a directory */
    fun listDir(dirPath: String): List<Map<String, String>> {
        return try {
            val dir = File(dirPath)
            if (!dir.isDirectory) return emptyList()
            dir.listFiles()?.map { f ->
                mapOf(
                    "name"      to f.name,
                    "path"      to f.absolutePath,
                    "size"      to f.length().toString(),
                    "isDir"     to f.isDirectory.toString(),
                    "modified"  to f.lastModified().toString()
                )
            } ?: emptyList()
        } catch (e: Exception) {
            Log.e(TAG, "listDir failed", e)
            emptyList()
        }
    }

    /** Create a directory */
    fun mkdir(path: String): Boolean {
        return try {
            File(path).mkdirs()
        } catch (e: Exception) {
            Log.e(TAG, "mkdir failed: $path", e)
            false
        }
    }

    // ── App-level dirs ───────────────────────────────────────

    /** Get app internal files dir */
    fun getInternalDir(ctx: Context): String = ctx.filesDir.absolutePath

    /** Get app cache dir */
    fun getCacheDir(ctx: Context): String = ctx.cacheDir.absolutePath

    /** Get external downloads dir (may be null if no external storage) */
    fun getDownloadsDir(): String? =
        Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)?.absolutePath

    /** Get Pictures dir */
    fun getPicturesDir(): String? =
        Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES)?.absolutePath

    /** Get Movies dir */
    fun getMoviesDir(): String? =
        Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_MOVIES)?.absolutePath

    /** Get Music dir */
    fun getMusicDir(): String? =
        Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_MUSIC)?.absolutePath

    // ── Media Gallery ────────────────────────────────────────

    /** Get images from gallery */
    fun getGalleryImages(ctx: Context, limit: Int = 100): List<Map<String, String>> {
        val images = mutableListOf<Map<String, String>>()
        try {
            val cursor = ctx.contentResolver.query(
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                arrayOf(
                    MediaStore.Images.Media._ID,
                    MediaStore.Images.Media.DISPLAY_NAME,
                    MediaStore.Images.Media.SIZE,
                    MediaStore.Images.Media.DATA,
                    MediaStore.Images.Media.MIME_TYPE,
                    MediaStore.Images.Media.DATE_ADDED
                ),
                null, null,
                "${MediaStore.Images.Media.DATE_ADDED} DESC LIMIT $limit"
            )
            cursor?.use {
                while (it.moveToNext()) {
                    images.add(mapOf(
                        "id"       to (it.getString(0) ?: ""),
                        "name"     to (it.getString(1) ?: ""),
                        "size"     to (it.getString(2) ?: "0"),
                        "path"     to (it.getString(3) ?: ""),
                        "mime"     to (it.getString(4) ?: ""),
                        "date"     to (it.getString(5) ?: "")
                    ))
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "getGalleryImages failed", e)
        }
        return images
    }

    /** Get audio files */
    fun getAudioFiles(ctx: Context, limit: Int = 100): List<Map<String, String>> {
        val files = mutableListOf<Map<String, String>>()
        try {
            val cursor = ctx.contentResolver.query(
                MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
                arrayOf(
                    MediaStore.Audio.Media._ID,
                    MediaStore.Audio.Media.DISPLAY_NAME,
                    MediaStore.Audio.Media.ARTIST,
                    MediaStore.Audio.Media.ALBUM,
                    MediaStore.Audio.Media.DURATION,
                    MediaStore.Audio.Media.DATA
                ),
                null, null,
                "${MediaStore.Audio.Media.DATE_ADDED} DESC LIMIT $limit"
            )
            cursor?.use {
                while (it.moveToNext()) {
                    files.add(mapOf(
                        "id"       to (it.getString(0) ?: ""),
                        "name"     to (it.getString(1) ?: ""),
                        "artist"   to (it.getString(2) ?: ""),
                        "album"    to (it.getString(3) ?: ""),
                        "duration" to (it.getString(4) ?: "0"),
                        "path"     to (it.getString(5) ?: "")
                    ))
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "getAudioFiles failed", e)
        }
        return files
    }

    /** Get file name from URI */
    fun getFileName(ctx: Context, uri: Uri): String? {
        return try {
            val cursor: Cursor? = ctx.contentResolver.query(uri, null, null, null, null)
            cursor?.use {
                if (it.moveToFirst()) {
                    val idx = it.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                    if (idx >= 0) it.getString(idx) else null
                } else null
            }
        } catch (e: Exception) { null }
    }

    /** Copy a file */
    fun copyFile(srcPath: String, dstPath: String): Boolean {
        return try {
            val dst = File(dstPath)
            dst.parentFile?.mkdirs()
            FileInputStream(srcPath).use { inp ->
                FileOutputStream(dstPath).use { out ->
                    inp.copyTo(out)
                }
            }
            true
        } catch (e: IOException) {
            Log.e(TAG, "copyFile failed", e)
            false
        }
    }

    /** Read binary chunk from file as Base64 */
    fun readFileChunkBase64(path: String, offset: Long, size: Int): Map<String, Any> {
        val file = File(path)
        if (!file.exists()) return mapOf("success" to false, "error" to "File not found")
        val len = file.length()
        if (offset >= len) return mapOf("success" to true, "data" to "", "bytesRead" to 0, "eof" to true)
        
        return try {
            val input = FileInputStream(file)
            input.channel.position(offset)
            val buffer = ByteArray(size)
            val bytesRead = input.read(buffer)
            input.close()
            
            if (bytesRead == -1) {
                mapOf("success" to true, "data" to "", "bytesRead" to 0, "eof" to true)
            } else {
                val finalData = if (bytesRead < size) buffer.copyOf(bytesRead) else buffer
                val base64 = android.util.Base64.encodeToString(finalData, android.util.Base64.NO_WRAP)
                mapOf("success" to true, "data" to base64, "bytesRead" to bytesRead, "eof" to (offset + bytesRead >= len))
            }
        } catch (e: Exception) {
            Log.e(TAG, "readFileChunkBase64 failed", e)
            mapOf("success" to false, "error" to (e.message ?: "read error"))
        }
    }

    /** Write Base64 binary chunk to file */
    fun writeFileChunkBase64(path: String, base64Data: String, append: Boolean): Map<String, Any> {
        return try {
            val file = File(path)
            file.parentFile?.mkdirs()
            val bytes = android.util.Base64.decode(base64Data, android.util.Base64.NO_WRAP)
            val output = FileOutputStream(file, append)
            output.write(bytes)
            output.close()
            mapOf("success" to true)
        } catch (e: Exception) {
            Log.e(TAG, "writeFileChunkBase64 failed", e)
            mapOf("success" to false, "error" to (e.message ?: "write error"))
        }
    }

    // ── P2P File Transfer Support ───────────────────────────────

    /** Read file bytes from URI (for P2P transfer) */
    fun readFileBytesFromUri(ctx: Context, uriStr: String): ByteArray? {
        return try {
            val uri = Uri.parse(uriStr)
            ctx.contentResolver.openInputStream(uri)?.use { it.readBytes() }
        } catch (e: Exception) {
            Log.e(TAG, "readFileBytesFromUri failed: $uriStr", e)
            null
        }
    }

    /** Get real file path from Content URI */
    fun getRealPathFromURI(ctx: Context, uri: Uri): String? {
        if (uri.scheme == "file") {
            return uri.path
        }
        
        if (uri.scheme == "content") {
            try {
                val cursor = ctx.contentResolver.query(
                    uri, 
                    arrayOf(MediaStore.Files.FileColumns.DATA), 
                    null, 
                    null, 
                    null
                )
                cursor?.use {
                    if (it.moveToFirst()) {
                        val columnIndex = it.getColumnIndexOrThrow(MediaStore.Files.FileColumns.DATA)
                        return it.getString(columnIndex)
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "getRealPathFromURI failed", e)
            }
        }
        
        return null
    }

    /** Copy file from Content URI to internal path (for P2P transfer) */
    fun copyFromUri(ctx: Context, sourceUri: String, destPath: String): Boolean {
        return try {
            val uri = Uri.parse(sourceUri)
            val destFile = File(destPath)
            destFile.parentFile?.mkdirs()
            
            ctx.contentResolver.openInputStream(uri)?.use { input ->
                FileOutputStream(destFile).use { output ->
                    input.copyTo(output)
                }
            }
            Log.d(TAG, "copyFromUri success: $destPath")
            true
        } catch (e: Exception) {
            Log.e(TAG, "copyFromUri failed: $sourceUri -> $destPath", e)
            false
        }
    }
}
