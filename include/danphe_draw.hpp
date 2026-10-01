/**
 * 🎨 DANPHE-UI NATIVE C++ CAD & PROTEUS SCHEMATIC WIRE ROUTING ENGINE
 * ═════════════════════════════════════════════════════════════════════════════
 * Professional Proteus/AutoCAD EDA Schematic Wire & Node Snapping Architecture.
 * • Point-to-Point Continuous Wire Routing (Right-click / Esc to terminate)
 * • Magnetic Vertex & Junction Snapping (Snap Radius with Solder Joint Dots)
 * • Manhattan 90° Orthogonal & Direct Vector Routing
 * • 16-Bit Register Micro-Bus Integration (Bank 0x47)
 *
 * Author: Phuyalshankar (Nepal) 🇳🇵 | Architecture: C++17 / Dolphin Native
 */

#ifndef DANPHE_DRAW_HPP
#define DANPHE_DRAW_HPP

#include <iostream>
#include <string>
#include <vector>
#include <cmath>
#include <algorithm>
#include <cstdint>

namespace DanpheUI {

// 16-Bit Register Addresses for CAD Drawing & Proteus Wire Routing (Bank 0x47)
#define TITAN_REG_DRAW_TOOL       0x4700 // 0=Off, 1=Freehand, 2=ProteusWire, 3=OrthogonalWire, 4=Junction, 5=Eraser
#define TITAN_REG_DRAW_STROKE_W   0x4701 // Stroke / Wire width in px (1 - 20)
#define TITAN_REG_DRAW_COLOR_RGB  0x4702 // Packed 24-Bit RGB (e.g. 0x38BDF8)
#define TITAN_REG_DRAW_SNAP_RAD   0x4704 // Magnetic Snap Radius in px (default 12)

struct CADPoint {
    double x;
    double y;
    double pressure;
    uint64_t timestampMs;
};

// Proteus Schematic Node / Pin / Solder Joint
struct ProteusNode {
    int id;
    double x;
    double y;
    bool isJunction; // Solder dot (●)
    std::string label;
};

// Proteus Connected Wire Segment (Point A -> Point B with optional 90° elbow)
struct ProteusWireSegment {
    int id;
    int startNodeId;
    int endNodeId;
    std::vector<CADPoint> polyline;
    std::string color;
    double width;
    bool isOrthogonal;
};

class DanpheProteusRouter {
private:
    std::vector<ProteusNode> nodes;
    std::vector<ProteusWireSegment> wires;
    int nextNodeId;
    int nextWireId;
    int activeStartNodeId;
    bool isRoutingWire;

public:
    DanpheProteusRouter() : nextNodeId(1), nextWireId(1), activeStartNodeId(-1), isRoutingWire(false) {}

    // ── 1. MAGNETIC NODE SNAPPING (Finds nearest pin/junction) ──
    int findSnapNode(double x, double y, double snapRadius = 12.0) const {
        int bestId = -1;
        double minDistance = snapRadius;

        for (const auto& node : nodes) {
            double dist = std::hypot(node.x - x, node.y - y);
            if (dist <= minDistance) {
                minDistance = dist;
                bestId = node.id;
            }
        }
        return bestId;
    }

    const ProteusNode* getNode(int id) const {
        for (const auto& n : nodes) {
            if (n.id == id) return &n;
        }
        return nullptr;
    }

    int getOrCreateNode(double x, double y, double snapRadius = 12.0) {
        int snapped = findSnapNode(x, y, snapRadius);
        if (snapped != -1) {
            // Snapped to existing point -> mark as junction joint
            for (auto& n : nodes) {
                if (n.id == snapped) {
                    n.isJunction = true;
                    return n.id;
                }
            }
            return snapped;
        }

        // Create new node
        ProteusNode n;
        n.id = nextNodeId++;
        n.x = x;
        n.y = y;
        n.isJunction = false;
        nodes.push_back(n);
        return n.id;
    }

    // ── 2. PROTEUS POINT-TO-POINT CONTINUOUS WIRE ROUTING ──
    // Click 1: Starts wire from Point A
    void startWire(double x, double y, double snapRadius = 12.0) {
        activeStartNodeId = getOrCreateNode(x, y, snapRadius);
        isRoutingWire = true;
    }

    // Click 2, 3, 4...: Connects to Point B and immediately makes Point B the new start point!
    int connectToPoint(double targetX, double targetY, bool orthogonal = true, const std::string& color = "#38bdf8", double width = 2.5, double snapRadius = 12.0) {
        if (!isRoutingWire || activeStartNodeId == -1) return -1;

        const ProteusNode* startN = getNode(activeStartNodeId);
        if (!startN) return -1;

        int endNodeId = getOrCreateNode(targetX, targetY, snapRadius);
        const ProteusNode* endN = getNode(endNodeId);
        if (!endN) return -1;

        // Create Wire with Manhattan 90° routing or Direct Vector
        ProteusWireSegment wire;
        wire.id = nextWireId++;
        wire.startNodeId = activeStartNodeId;
        wire.endNodeId = endNodeId;
        wire.color = color;
        wire.width = width;
        wire.isOrthogonal = orthogonal;

        // Polyline points
        wire.polyline.push_back({ startN->x, startN->y, 1.0, 0 });
        if (orthogonal && (startN->x != endN->x) && (startN->y != endN->y)) {
            // 90° Elbow Corner Point (Horizontal first, then vertical)
            wire.polyline.push_back({ endN->x, startN->y, 1.0, 0 });
        }
        wire.polyline.push_back({ endN->x, endN->y, 1.0, 0 });

        wires.push_back(wire);

        // CONTINUOUS PROTEUS FLOW: Point B becomes the new start point!
        activeStartNodeId = endNodeId;
        return wire.id;
    }

    // Right-Click / Escape: Finishes the continuous wire chain
    void endWireChain() {
        activeStartNodeId = -1;
        isRoutingWire = false;
    }

    bool isCurrentlyRouting() const { return isRoutingWire; }
    int getActiveStartNodeId() const { return activeStartNodeId; }
    size_t getNodeCount() const { return nodes.size(); }
    size_t getWireCount() const { return wires.size(); }
    const std::vector<ProteusNode>& getAllNodes() const { return nodes; }
    const std::vector<ProteusWireSegment>& getAllWires() const { return wires; }
    void clearAll() {
        nodes.clear();
        wires.clear();
        activeStartNodeId = -1;
        isRoutingWire = false;
    }
};

} // namespace DanpheUI

#endif // DANPHE_DRAW_HPP
