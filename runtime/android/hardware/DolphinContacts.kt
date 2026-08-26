package io.dolphin.runtime

import android.annotation.SuppressLint
import android.content.Context
import android.provider.ContactsContract
import android.util.Log

object DolphinContacts {
    @SuppressLint("Range")
    fun getContacts(ctx: Context): List<Map<String, String>> {
        val contactsList = mutableListOf<Map<String, String>>()
        try {
            val cursor = ctx.contentResolver.query(
                ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
                null, null, null, null
            )
            
            cursor?.use {
                while (it.moveToNext()) {
                    val name = it.getString(it.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME)) ?: ""
                    val number = it.getString(it.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER)) ?: ""
                    contactsList.add(mapOf(Pair("name", name), Pair("phone", number)))
                }
            }
        } catch (e: Exception) {
            Log.e("DolphinContacts", "Failed to read contacts (check permissions)", e)
        }
        return contactsList
    }
}
