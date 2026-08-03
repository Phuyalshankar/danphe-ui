import { HWDescriptor } from './types';
/**
 * 🌊 DolphinJS Hardware — Storage / File System
 */
export declare const Storage: {
    /** Read file as text */
    readFile: (path: string) => HWDescriptor<{
        path: string;
    }>;
    /** Write text to file path */
    writeFile: (path: string, content: string) => HWDescriptor<{
        path: string;
        content: string;
    }>;
    /** Delete file */
    deleteFile: (path: string) => HWDescriptor<{
        path: string;
    }>;
    /** List files in directory */
    listDir: (path: string) => HWDescriptor<{
        path: string;
    }>;
    /** Create directory */
    mkdir: (path: string) => HWDescriptor<{
        path: string;
    }>;
    /** Get all storage directory paths */
    getDirs: () => HWDescriptor<Record<string, never>>;
    /** Open file picker */
    pickFile: (types?: string[]) => HWDescriptor<{
        types: string[];
    }>;
    /** Save file (download) */
    saveFile: (filename: string, data: unknown) => HWDescriptor<{
        filename: string;
        data: unknown;
    }>;
    /** Get images from gallery */
    getImages: (limit?: number) => HWDescriptor<{
        limit: number;
    }>;
    /** Get videos from gallery */
    getVideos: (limit?: number) => HWDescriptor<{
        limit: number;
    }>;
    /** Get audio files from storage */
    getAudio: (limit?: number) => HWDescriptor<{
        limit: number;
    }>;
    _action: {
        images: string;
        dirs: string;
    };
};
export type StorageModule = typeof Storage;
/**
 * 🌊 DolphinJS Hardware — File (alias for Storage)
 *
 * Original JS delegated to `this.Storage.*` on the shared class instance.
 * Since Storage is now a stateless module, File delegates directly to it —
 * same descriptors, same behavior.
 */
export declare const File: {
    pick: (types?: string[]) => HWDescriptor<{
        types: string[];
    }>;
    save: (filename: string, data: unknown) => HWDescriptor<{
        filename: string;
        data: unknown;
    }>;
    read: (path: string) => HWDescriptor<{
        path: string;
    }>;
    write: (path: string, content: string) => HWDescriptor<{
        path: string;
        content: string;
    }>;
    delete: (path: string) => HWDescriptor<{
        path: string;
    }>;
    list: (path: string) => HWDescriptor<{
        path: string;
    }>;
};
export type FileModule = typeof File;
//# sourceMappingURL=Storage.d.ts.map