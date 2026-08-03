"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = exports.Storage = void 0;
const protocol_1 = require("./protocol");
/**
 * 🌊 DolphinJS Hardware — Storage / File System
 */
exports.Storage = {
    /** Read file as text */
    readFile: (path) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.FILE_READ,
        params: { path },
    }),
    /** Write text to file path */
    writeFile: (path, content) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.FILE_WRITE,
        params: { path, content },
    }),
    /** Delete file */
    deleteFile: (path) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.FILE_DELETE,
        params: { path },
    }),
    /** List files in directory */
    listDir: (path) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.FILE_LIST,
        params: { path },
    }),
    /** Create directory */
    mkdir: (path) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.FILE_MKDIR,
        params: { path },
    }),
    /** Get all storage directory paths */
    getDirs: () => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.FILE_DIRS,
        params: {},
    }),
    /** Open file picker */
    pickFile: (types = ['*/*']) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.FILE_PICK,
        params: { types },
    }),
    /** Save file (download) */
    saveFile: (filename, data) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.FILE_SAVE,
        params: { filename, data },
    }),
    /** Get images from gallery */
    getImages: (limit = 100) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.GALLERY_IMAGES,
        params: { limit },
    }),
    /** Get videos from gallery */
    getVideos: (limit = 50) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.GALLERY_VIDEOS,
        params: { limit },
    }),
    /** Get audio files from storage */
    getAudio: (limit = 100) => ({
        _hw: true,
        cmd: protocol_1.HW_CMD.AUDIO_FILES,
        params: { limit },
    }),
    _action: {
        images: 'hw:storage:images',
        dirs: 'hw:storage:dirs',
    },
};
/**
 * 🌊 DolphinJS Hardware — File (alias for Storage)
 *
 * Original JS delegated to `this.Storage.*` on the shared class instance.
 * Since Storage is now a stateless module, File delegates directly to it —
 * same descriptors, same behavior.
 */
exports.File = {
    pick: (types = []) => exports.Storage.pickFile(types),
    save: (filename, data) => exports.Storage.saveFile(filename, data),
    read: (path) => exports.Storage.readFile(path),
    write: (path, content) => exports.Storage.writeFile(path, content),
    delete: (path) => exports.Storage.deleteFile(path),
    list: (path) => exports.Storage.listDir(path),
};
//# sourceMappingURL=Storage.js.map