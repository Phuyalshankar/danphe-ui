package io.dolphin.runtime.hardware

import android.content.Context
import android.database.Cursor
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import android.util.Log

/**
 * 🌊 DolphinDatabase
 *
 * Lightweight native SQLite wrapper for local database persistence.
 * Exposes SQL execution and querying capabilities to the UI thread.
 */
object DolphinDatabase {
    private const val TAG = "DolphinDatabase"
    private const val DATABASE_NAME = "dolphin_local.db"
    private const val DATABASE_VERSION = 1

    private var helper: DbHelper? = null

    private fun getHelper(context: Context): DbHelper {
        if (helper == null) {
            helper = DbHelper(context.applicationContext)
        }
        return helper!!
    }

    private class DbHelper(context: Context) : SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {
        override fun onCreate(db: SQLiteDatabase) {
            // Generic dynamic SQLite database. Tables are created dynamically via SQL statements from JSX.
        }

        override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
            // Simple drop and recreate or migration schema
        }
    }

    /**
     * Execute a database query that does not return rows (e.g. CREATE TABLE, INSERT, UPDATE, DELETE).
     */
    @Synchronized
    fun executeSql(context: Context, sql: String): Map<String, Any?> {
        val result = mutableMapOf<String, Any?>()
        try {
            val db = getHelper(context).writableDatabase
            db.execSQL(sql)
            result["success"] = true
        } catch (e: Throwable) {
            Log.e(TAG, "executeSql failed: $sql", e)
            result["success"] = false
            result["error"] = e.message ?: "Unknown database error"
        }
        return result
    }

    /**
     * Execute a database query that returns rows (e.g. SELECT).
     */
    @Synchronized
    fun querySql(context: Context, sql: String): Map<String, Any?> {
        val result = mutableMapOf<String, Any?>()
        val rows = mutableListOf<Map<String, Any?>>()
        var cursor: Cursor? = null
        try {
            val db = getHelper(context).readableDatabase
            cursor = db.rawQuery(sql, null)
            cursor?.use { c ->
                val columnNames = c.columnNames
                while (c.moveToNext()) {
                    val row = mutableMapOf<String, Any?>()
                    for (i in 0 until c.columnCount) {
                        val name = columnNames[i]
                        when (c.getType(i)) {
                            Cursor.FIELD_TYPE_NULL -> row[name] = null
                            Cursor.FIELD_TYPE_INTEGER -> row[name] = c.getLong(i)
                            Cursor.FIELD_TYPE_FLOAT -> row[name] = c.getDouble(i)
                            Cursor.FIELD_TYPE_STRING -> row[name] = c.getString(i)
                            Cursor.FIELD_TYPE_BLOB -> {
                                val blob = c.getBlob(i)
                                row[name] = String(blob, Charsets.UTF_8)
                            }
                        }
                    }
                    rows.add(row)
                }
            }
            result["success"] = true
            result["rows"] = rows
        } catch (e: Throwable) {
            Log.e(TAG, "querySql failed: $sql", e)
            result["success"] = false
            result["error"] = e.message ?: "Unknown database error"
        }
        return result
    }
}
