'use strict';

/**
 * 🌊 DeltaProtocol.js
 * Fine-Grained 24-Byte Component & Byte-Level Diffing Engine for Dolphin Native v4.5.0
 */
class DeltaProtocol {
    /**
     * Compare previous and current component binary arrays byte-by-byte.
     * Returns an array of changed component delta objects.
     */
    static createDelta(prevComponents = [], currentComponents = []) {
        const changes = [];
        const maxLen = Math.max(prevComponents.length, currentComponents.length);

        for (let i = 0; i < maxLen; i++) {
            const prev = prevComponents[i];
            const curr = currentComponents[i];

            if (!prev && curr) {
                // Newly added component
                changes.push({
                    type: 'ADD',
                    index: i,
                    binary: Buffer.from(curr),
                    changedBytes: Array.from({ length: curr.length }, (_, k) => k)
                });
            } else if (prev && !curr) {
                // Removed component
                changes.push({
                    type: 'REMOVE',
                    index: i
                });
            } else if (prev && curr) {
                // Check byte-level differences
                const diffBytes = this.getByteDiff(prev, curr);
                if (diffBytes.length > 0) {
                    changes.push({
                        type: 'UPDATE',
                        index: i,
                        binary: Buffer.from(curr),
                        changedBytes: diffBytes
                    });
                }
            }
        }

        return changes;
    }

    /**
     * Identify exact byte indices changed between two 24-byte component buffers.
     */
    static getByteDiff(oldBuf, newBuf) {
        const diff = [];
        const len = Math.min(oldBuf.length, newBuf.length);
        for (let b = 0; b < len; b++) {
            if (oldBuf[b] !== newBuf[b]) {
                diff.push(b);
            }
        }
        return diff;
    }

    /**
     * Serialize delta objects into compact binary wire format:
     * Format: [Count: u16] { [Index: u16] [ByteCount: u8] [Bytes: u8*] [24-byte Binary] }
     */
    static serializeDelta(changes) {
        const chunks = [];
        const countBuf = Buffer.alloc(2);
        countBuf.writeUInt16LE(changes.length, 0);
        chunks.push(countBuf);

        changes.forEach(change => {
            if (change.type === 'UPDATE' || change.type === 'ADD') {
                const header = Buffer.alloc(3);
                header.writeUInt16LE(change.index, 0);
                header.writeUInt8(change.changedBytes.length, 2);

                const changedBytesBuf = Buffer.from(change.changedBytes);
                const binaryBuf = Buffer.from(change.binary);

                chunks.push(header, changedBytesBuf, binaryBuf);
            }
        });

        return Buffer.concat(chunks);
    }

    /**
     * Deserialize delta binary stream into change objects.
     */
    static deserializeDelta(buffer) {
        const changes = [];
        if (!buffer || buffer.length < 2) return changes;

        const count = buffer.readUInt16LE(0);
        let cursor = 2;

        for (let i = 0; i < count; i++) {
            if (cursor + 3 > buffer.length) break;
            const index = buffer.readUInt16LE(cursor);
            const byteCount = buffer.readUInt8(cursor + 2);
            cursor += 3;

            if (cursor + byteCount + 24 > buffer.length) break;
            const changedBytes = Array.from(buffer.slice(cursor, cursor + byteCount));
            cursor += byteCount;

            const binary = Buffer.from(buffer.slice(cursor, cursor + 24));
            cursor += 24;

            changes.push({
                type: 'UPDATE',
                index,
                changedBytes,
                binary
            });
        }

        return changes;
    }
}

module.exports = DeltaProtocol;
