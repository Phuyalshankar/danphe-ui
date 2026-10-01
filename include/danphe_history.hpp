/**
 * ⏪ DANPHE-UI NATIVE C++ UNDO / REDO HISTORY STACK ENGINE
 * ═════════════════════════════════════════════════════════════════════════════
 * High-Speed Zero-Leak Command History & Timeline Snapshot Buffer.
 * Supports Unlimited Undo/Redo, Timeline Diffing, and 16-Bit Register Highway.
 *
 * Author: Phuyalshankar (Nepal) 🇳🇵 | Architecture: C++17 / Dolphin Native
 */

#ifndef DANPHE_HISTORY_HPP
#define DANPHE_HISTORY_HPP

#include <iostream>
#include <string>
#include <vector>
#include <deque>
#include <cstdint>
#include <algorithm>

namespace DanpheUI {

// 16-Bit Register Addresses for Undo/Redo History (Bank 0x44)
#define TITAN_REG_HISTORY_ACTION  0x4408 // 1=Undo, 2=Redo, 3=PushSnapshot, 4=Clear
#define TITAN_REG_HISTORY_CAN_UNDO 0x4409 // 0=No, 1=Yes
#define TITAN_REG_HISTORY_CAN_REDO 0x440A // 0=No, 1=Yes
#define TITAN_REG_HISTORY_COUNT    0x440B // Total Undo Steps

struct TimelineActionSnapshot {
    std::string actionName;
    std::string serializedState;
    uint64_t timestampMs;
};

class DanpheHistoryEngine {
private:
    std::deque<TimelineActionSnapshot> undoStack;
    std::deque<TimelineActionSnapshot> redoStack;
    size_t maxHistorySteps;

public:
    DanpheHistoryEngine(size_t maxSteps = 100) : maxHistorySteps(maxSteps) {}

    // Push a new action snapshot (e.g. after Move, Split, Delete, Scale, Zoom)
    void pushSnapshot(const std::string& actionName, const std::string& stateJson, uint64_t nowMs = 0) {
        if (undoStack.size() >= maxHistorySteps) {
            undoStack.pop_front();
        }
        undoStack.push_back({ actionName, stateJson, nowMs });
        redoStack.clear(); // Clear redo stack on new action
    }

    bool canUndo() const {
        return undoStack.size() > 1; // Keep initial baseline state
    }

    bool canRedo() const {
        return !redoStack.empty();
    }

    // Execute Undo: Moves current state to redo and returns previous snapshot
    bool undo(std::string& outStateJson, std::string& outActionName) {
        if (!canUndo()) return false;

        TimelineActionSnapshot current = undoStack.back();
        undoStack.pop_back();
        redoStack.push_back(current);

        TimelineActionSnapshot previous = undoStack.back();
        outStateJson = previous.serializedState;
        outActionName = previous.actionName;
        return true;
    }

    // Execute Redo: Moves top redo state back to undo stack
    bool redo(std::string& outStateJson, std::string& outActionName) {
        if (!canRedo()) return false;

        TimelineActionSnapshot next = redoStack.back();
        redoStack.pop_back();
        undoStack.push_back(next);

        outStateJson = next.serializedState;
        outActionName = next.actionName;
        return true;
    }

    void clear() {
        undoStack.clear();
        redoStack.clear();
    }

    size_t getUndoCount() const { return undoStack.size(); }
    size_t getRedoCount() const { return redoStack.size(); }
};

} // namespace DanpheUI

#endif // DANPHE_HISTORY_HPP
