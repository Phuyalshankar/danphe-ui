// 🦚 Danphe-UI Master Pure Vector Icons Suite: danphe_icons.hpp
// Generated for Dolphin-CPP & Native C++17
// Total Icons: 551 (0-255 Telephony/Hardware + 256-511 Extended Web/UI)
#pragma once
#include <string>
#include <unordered_map>
#include <sstream>
#include <cstdint>
#include <algorithm>

namespace DanpheUI {

class DanpheIcons {
public:
    static const int TOTAL_ICONS = 551;

    static std::string getIconPath(int id) {
        switch (id) {
            case 0: return "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\" fill=\"none\" stroke=\"#64748b\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>";
            case 1: return "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><polyline points=\"16 2 20 6 16 10\" fill=\"none\" stroke=\"#6ee7b7\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><line x1=\"20\" y1=\"6\" x2=\"11\" y2=\"15\" stroke=\"#6ee7b7\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>";
            case 2: return "<polygon points=\"23 7 16 12 23 17 23 7\" fill=\"rgba(192,132,252,0.3)\" stroke=\"#c084fc\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/><rect x=\"1\" y=\"5\" width=\"15\" height=\"14\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><polyline points=\"10 9 10 13 6 13\" fill=\"none\" stroke=\"#38bdf8\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><line x1=\"10\" y1=\"13\" x2=\"5\" y2=\"8\" stroke=\"#38bdf8\" stroke-width=\"2\" stroke-linecap=\"round\"/>";
            case 3: return "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><polyline points=\"20 10 20 4 14 4\" fill=\"none\" stroke=\"#fde047\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><line x1=\"13\" y1=\"11\" x2=\"20\" y2=\"4\" stroke=\"#fde047\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>";
            case 4: return "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\" fill=\"none\" stroke=\"#f87171\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><line x1=\"22\" y1=\"2\" x2=\"16\" y2=\"8\" stroke=\"#ef4444\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"16\" y1=\"2\" x2=\"22\" y2=\"8\" stroke=\"#ef4444\" stroke-width=\"3\" stroke-linecap=\"round\"/>";
            case 5: return "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M14 2a8 8 0 0 1 8 8\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M14 6a4 4 0 0 1 4 4\" fill=\"none\" stroke=\"#6ee7b7\" stroke-width=\"2\" stroke-linecap=\"round\"/>";
            case 6: return "<line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\" stroke=\"#f43f5e\" stroke-width=\"2.5\" stroke-linecap=\"round\"/><path d=\"M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6\" fill=\"none\" stroke=\"#f43f5e\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23\" fill=\"none\" stroke=\"#f43f5e\" stroke-width=\"2\" stroke-linecap=\"round\"/><line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"23\" stroke=\"#f43f5e\" stroke-width=\"2\"/><line x1=\"8\" y1=\"23\" x2=\"16\" y2=\"23\" stroke=\"#f43f5e\" stroke-width=\"2\"/>";
            case 7: return "<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\" fill=\"rgba(34,211,238,0.2)\" stroke=\"#22d3ee\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><circle cx=\"8\" cy=\"10\" r=\"1.2\" fill=\"#22d3ee\"/><circle cx=\"12\" cy=\"10\" r=\"1.2\" fill=\"#22d3ee\"/><circle cx=\"16\" cy=\"10\" r=\"1.2\" fill=\"#22d3ee\"/>";
            case 8: return "<circle cx=\"5.5\" cy=\"11.5\" r=\"4.5\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"18.5\" cy=\"11.5\" r=\"4.5\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"5.5\" y1=\"16\" x2=\"18.5\" y2=\"16\" stroke=\"#c084fc\" stroke-width=\"2\"/>";
            case 9: return "<path d=\"M3 18v-6a9 9 0 0 1 18 0v6\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 10: return "<polyline points=\"15 14 20 9 15 4\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M4 20v-7a4 4 0 0 1 4-4h12\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\" stroke-linecap=\"round\"/>";
            case 11: return "<rect x=\"6\" y=\"4\" width=\"4\" height=\"16\" fill=\"#fbbf24\" rx=\"1\"/><rect x=\"14\" y=\"4\" width=\"4\" height=\"16\" fill=\"#fbbf24\" rx=\"1\"/>";
            case 12: return "<path d=\"M16 3h5v5\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M4 20L21 3\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M21 16v5h-5\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M15 15l6 6\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 13: return "<path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"9\" cy=\"7\" r=\"4\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><path d=\"M23 21v-2a4 4 0 0 0-3-3.87\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><path d=\"M16 3.13a4 4 0 0 1 0 7.75\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/>";
            case 14: return "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#f87171\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"4\" fill=\"#ef4444\"/>";
            case 15: return "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"3\" fill=\"none\" stroke=\"#ffffff\" stroke-width=\"2\"/><circle cx=\"8\" cy=\"8\" r=\"1.2\" fill=\"#fff\"/><circle cx=\"12\" cy=\"8\" r=\"1.2\" fill=\"#fff\"/><circle cx=\"16\" cy=\"8\" r=\"1.2\" fill=\"#fff\"/><circle cx=\"8\" cy=\"12\" r=\"1.2\" fill=\"#fff\"/><circle cx=\"12\" cy=\"12\" r=\"1.2\" fill=\"#fff\"/><circle cx=\"16\" cy=\"12\" r=\"1.2\" fill=\"#fff\"/><circle cx=\"8\" cy=\"16\" r=\"1.2\" fill=\"#fff\"/><circle cx=\"12\" cy=\"16\" r=\"1.2\" fill=\"#fff\"/><circle cx=\"16\" cy=\"16\" r=\"1.2\" fill=\"#fff\"/>";
            case 16: return "<polygon points=\"11 5 6 9 2 9 2 15 6 15 11 19 11 5\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M15.54 8.46a5 5 0 0 1 0 7.07\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M19.07 4.93a10 10 0 0 1 0 14.14\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 17: return "<polyline points=\"6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 18: return "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3\" fill=\"none\" stroke=\"#f87171\" stroke-width=\"2\"/><rect x=\"14\" y=\"2\" width=\"8\" height=\"6\" rx=\"1\" fill=\"none\" stroke=\"#f87171\" stroke-width=\"1.5\"/>";
            case 19: return "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><path d=\"M18 2a5 5 0 0 1 5 5\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>";
            case 20: return "<path d=\"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M13.73 21a2 2 0 0 1-3.46 0\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 21: return "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"4\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><path d=\"M9 16V8h4a2 2 0 0 1 0 4H9\" stroke=\"#c084fc\" stroke-width=\"2\"/>";
            case 22: return "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M8 12h8M12 8v8\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 23: return "<path d=\"M9 18V5l12-2v13\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"6\" cy=\"18\" r=\"3\" fill=\"#c084fc\"/><circle cx=\"18\" cy=\"16\" r=\"3\" fill=\"#c084fc\"/>";
            case 24: return "<path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\" stroke=\"#22d3ee\" stroke-width=\"2\" fill=\"none\"/><circle cx=\"9\" cy=\"7\" r=\"4\" stroke=\"#22d3ee\" stroke-width=\"2\" fill=\"none\"/><path d=\"M23 21v-2a4 4 0 0 0-3-3.87\" stroke=\"#22d3ee\" stroke-width=\"2\" fill=\"none\"/>";
            case 25: return "<path d=\"M2 12h4l3-6 6 12 3-6h4\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 26: return "<polygon points=\"12 2 2 22 22 22 12 2\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"12\" y1=\"9\" x2=\"12\" y2=\"13\" stroke=\"#ef4444\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"17\" r=\"1\" fill=\"#ef4444\"/>";
            case 27: return "<path d=\"M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"18\" y1=\"9\" x2=\"12\" y2=\"15\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"12\" y1=\"9\" x2=\"18\" y2=\"15\" stroke=\"#94a3b8\" stroke-width=\"2\"/>";
            case 28: return "<polygon points=\"11 5 6 9 2 9 2 15 6 15 11 19 11 5\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"23\" y1=\"9\" x2=\"17\" y2=\"15\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"17\" y1=\"9\" x2=\"23\" y2=\"15\" stroke=\"#94a3b8\" stroke-width=\"2\"/>";
            case 29: return "<polygon points=\"11 5 6 9 2 9 2 15 6 15 11 19 11 5\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 30: return "<polygon points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 31: return "<path d=\"M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91\" fill=\"none\" stroke=\"#f87171\" stroke-width=\"2\"/><line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\" stroke=\"#ef4444\" stroke-width=\"2.5\"/>";
            case 32: return "<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 33: return "<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><circle cx=\"8\" cy=\"11\" r=\"1.5\" fill=\"#22d3ee\"/><circle cx=\"12\" cy=\"11\" r=\"1.5\" fill=\"#22d3ee\"/><circle cx=\"16\" cy=\"11\" r=\"1.5\" fill=\"#22d3ee\"/>";
            case 34: return "<polyline points=\"20 6 9 17 4 12\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/>";
            case 35: return "<polyline points=\"18 6 7 17 2 12\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><polyline points=\"22 6 11 17 8 14\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 36: return "<polyline points=\"18 6 7 17 2 12\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2.5\"/><polyline points=\"22 6 11 17 8 14\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2.5\"/>";
            case 37: return "<path d=\"M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/>";
            case 38: return "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"8.5\" cy=\"8.5\" r=\"1.5\" fill=\"#c084fc\"/><polyline points=\"21 15 16 10 5 21\" stroke=\"#c084fc\" stroke-width=\"2\" fill=\"none\"/>";
            case 39: return "<path d=\"M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 40: return "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><path d=\"M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01\" stroke=\"#fbbf24\" stroke-width=\"2\"/>";
            case 41: return "<line x1=\"22\" y1=\"2\" x2=\"11\" y2=\"13\" stroke=\"#22d3ee\" stroke-width=\"2\"/><polygon points=\"22 2 15 22 11 13 2 9 22 2\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 42: return "<path d=\"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"10\" r=\"3\" fill=\"#ef4444\"/>";
            case 43: return "<path d=\"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"7\" r=\"4\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 44: return "<path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"9\" cy=\"7\" r=\"4\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><path d=\"M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75\" stroke=\"#c084fc\" stroke-width=\"2\"/>";
            case 45: return "<polygon points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>";
            case 46: return "<path d=\"M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 47: return "<circle cx=\"11\" cy=\"11\" r=\"8\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\" stroke=\"#94a3b8\" stroke-width=\"2\"/>";
            case 48: return "<circle cx=\"12\" cy=\"12\" r=\"6\" fill=\"#34d399\"/><circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 49: return "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><polyline points=\"12 6 12 12 14 14\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 50: return "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"8\" y1=\"12\" x2=\"16\" y2=\"12\" stroke=\"#fbbf24\" stroke-width=\"2.5\"/>";
            case 51: return "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"2\"/><polyline points=\"12 6 12 12 15 15\" stroke=\"#f59e0b\" stroke-width=\"2\" fill=\"none\"/>";
            case 52: return "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"7\" y1=\"12\" x2=\"17\" y2=\"12\" stroke=\"#ffffff\" stroke-width=\"3\"/>";
            case 53: return "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#64748b\" stroke-width=\"2\"/>";
            case 54: return "<path d=\"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/>";
            case 55: return "<path d=\"M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>";
            case 56: return "<line x1=\"19\" y1=\"12\" x2=\"5\" y2=\"12\" stroke=\"#22d3ee\" stroke-width=\"2.5\"/><polyline points=\"12 19 5 12 12 5\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2.5\"/>";
            case 57: return "<line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\" stroke=\"#22d3ee\" stroke-width=\"2.5\"/><polyline points=\"12 5 19 12 12 19\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2.5\"/>";
            case 58: return "<polyline points=\"9 17 4 12 9 7\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M20 18v-2a4 4 0 0 0-4-4H4\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 59: return "<circle cx=\"18\" cy=\"5\" r=\"3\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"6\" cy=\"12\" r=\"3\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"18\" cy=\"19\" r=\"3\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"8.59\" y1=\"13.51\" x2=\"15.42\" y2=\"17.49\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"15.41\" y1=\"6.51\" x2=\"8.59\" y2=\"10.49\" stroke=\"#c084fc\" stroke-width=\"2\"/>";
            case 60: return "<path d=\"M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><rect x=\"4\" y=\"8\" width=\"16\" height=\"12\" rx=\"4\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><circle cx=\"9\" cy=\"14\" r=\"1\" fill=\"#22d3ee\"/><circle cx=\"15\" cy=\"14\" r=\"1\" fill=\"#22d3ee\"/>";
            case 61: return "<path d=\"M12 2l2.4 2.8 3.7-.4 1.2 3.5 3.3 1.7-1 3.6 1.7 3.3-2.8 2.4.4 3.7-3.5 1.2-1.7 3.3-3.6-1-3.3 1.7-2.4-2.8-3.7.4-1.2-3.5-3.3-1.7 1-3.6-1.7-3.3 2.8-2.4-.4-3.7 3.5-1.2 1.7-3.3 3.6 1z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"1.8\"/><polyline points=\"9 12 11 14 15 10\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 62: return "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"4.93\" y1=\"4.93\" x2=\"19.07\" y2=\"19.07\" stroke=\"#ef4444\" stroke-width=\"2\"/>";
            case 63: return "<path d=\"M13.73 21a2 2 0 0 1-3.46 0M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\" stroke=\"#ef4444\" stroke-width=\"2\"/>";
            case 64: return "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\" fill=\"rgba(52,211,153,0.15)\" stroke=\"#34d399\" stroke-width=\"2\"/><rect x=\"9\" y=\"9\" width=\"6\" height=\"6\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"1.5\"/><path d=\"M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3\" stroke=\"#34d399\" stroke-width=\"1.8\" stroke-linecap=\"round\"/>";
            case 65: return "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"7\" y1=\"8\" x2=\"17\" y2=\"8\" stroke=\"#22d3ee\" stroke-width=\"1.5\"/><line x1=\"7\" y1=\"12\" x2=\"17\" y2=\"12\" stroke=\"#22d3ee\" stroke-width=\"1.5\"/><line x1=\"7\" y1=\"16\" x2=\"17\" y2=\"16\" stroke=\"#22d3ee\" stroke-width=\"1.5\"/>";
            case 66: return "<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"8\" cy=\"12\" r=\"2\" fill=\"#c084fc\"/><path d=\"M14 8h4M14 12h4M14 16h4\" stroke=\"#c084fc\" stroke-width=\"1.5\"/>";
            case 67: return "<rect x=\"5\" y=\"11\" width=\"14\" height=\"10\" rx=\"2\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><path d=\"M8 11V7a4 4 0 0 1 8 0v4\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>";
            case 68: return "<path d=\"M4 10a8 8 0 0 1 16 0M7 13a5 5 0 0 1 10 0M10 16a2 2 0 0 1 4 0\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"19\" r=\"1\" fill=\"#22d3ee\"/>";
            case 69: return "<path d=\"M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z\" fill=\"none\" stroke=\"#f87171\" stroke-width=\"2\"/>";
            case 70: return "<path d=\"M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 71: return "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><path d=\"M12 6v6l4 2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/>";
            case 72: return "<circle cx=\"12\" cy=\"12\" r=\"5\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"12\" y1=\"1\" x2=\"12\" y2=\"3\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"23\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"4.22\" y1=\"4.22\" x2=\"5.64\" y2=\"5.64\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"18.36\" y1=\"18.36\" x2=\"19.78\" y2=\"19.78\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"1\" y1=\"12\" x2=\"3\" y2=\"12\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"21\" y1=\"12\" x2=\"23\" y2=\"12\" stroke=\"#fbbf24\" stroke-width=\"2\"/>";
            case 73: return "<circle cx=\"12\" cy=\"12\" r=\"4\" fill=\"#34d399\"/><path d=\"M6 6a9 9 0 0 1 12 0M3 3a13 13 0 0 1 18 0\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 74: return "<path d=\"M8 19h8a4 4 0 0 0 0-8 6 6 0 0 0-11.8 1.4A4 4 0 0 0 8 19z\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/>";
            case 75: return "<path d=\"M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z\" fill=\"none\" stroke=\"#06b6d4\" stroke-width=\"2\"/><line x1=\"2\" y1=\"22\" x2=\"22\" y2=\"22\" stroke=\"#06b6d4\" stroke-width=\"2\"/>";
            case 76: return "<polygon points=\"12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"12\" y1=\"22\" x2=\"12\" y2=\"12\" stroke=\"#c084fc\" stroke-width=\"1.5\"/><polyline points=\"22 8.5 12 12 2 8.5\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"1.5\"/>";
            case 77: return "<rect x=\"4\" y=\"6\" width=\"6\" height=\"12\" rx=\"1\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><rect x=\"14\" y=\"6\" width=\"6\" height=\"12\" rx=\"1\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>";
            case 78: return "<polyline points=\"22 12 18 12 15 21 9 3 6 12 2 12\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 79: return "<path d=\"M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4M5 19.5C5.5 18 6 15 6 12c0-3.3 2.7-6 6-6 2.5 0 4.6 1.5 5.5 3.7M12 12v3a3 3 0 0 1-3 3M19 14.5a8 8 0 0 1-2 5.5\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 80: return "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><circle cx=\"8\" cy=\"12\" r=\"2\" fill=\"#34d399\"/>";
            case 81: return "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><circle cx=\"16\" cy=\"12\" r=\"2\" fill=\"#34d399\"/>";
            case 82: return "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"8\" cy=\"9\" r=\"2\" fill=\"#c084fc\"/><circle cx=\"8\" cy=\"15\" r=\"2\" fill=\"#c084fc\"/>";
            case 83: return "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"16\" cy=\"9\" r=\"2\" fill=\"#c084fc\"/><circle cx=\"16\" cy=\"15\" r=\"2\" fill=\"#c084fc\"/>";
            case 84: return "<rect x=\"3\" y=\"7\" width=\"18\" height=\"10\" rx=\"2\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"7\" y1=\"2\" x2=\"7\" y2=\"7\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"17\" y1=\"2\" x2=\"17\" y2=\"7\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 85: return "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"4\" y1=\"9\" x2=\"20\" y2=\"9\" stroke=\"#c084fc\"/><line x1=\"4\" y1=\"15\" x2=\"20\" y2=\"15\" stroke=\"#c084fc\"/>";
            case 86: return "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"3\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><polyline points=\"7 10 10 12 7 14\" stroke=\"#fbbf24\" stroke-width=\"2\" fill=\"none\"/><line x1=\"13\" y1=\"14\" x2=\"17\" y2=\"14\" stroke=\"#fbbf24\" stroke-width=\"2\"/>";
            case 87: return "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M12 7v5l3 3\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 88: return "<path d=\"M11 5L6 9H2v6h4l5 4V5zM15 9l6 6M21 9l-6 6\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/>";
            case 89: return "<rect x=\"4\" y=\"3\" width=\"16\" height=\"18\" rx=\"2\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"7\" y1=\"6\" x2=\"17\" y2=\"6\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"17\" y1=\"6\" x2=\"17\" y2=\"12\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"7\" y1=\"12\" x2=\"17\" y2=\"12\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"7\" y1=\"12\" x2=\"7\" y2=\"18\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"7\" y1=\"18\" x2=\"17\" y2=\"18\" stroke=\"#ef4444\" stroke-width=\"2\"/>";
            case 90: return "<rect x=\"2\" y=\"5\" width=\"20\" height=\"14\" rx=\"2\" fill=\"rgba(16,185,129,0.2)\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"5\" y1=\"9\" x2=\"19\" y2=\"9\" stroke=\"#34d399\"/><line x1=\"5\" y1=\"14\" x2=\"15\" y2=\"14\" stroke=\"#34d399\"/>";
            case 91: return "<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"3\" fill=\"#22d3ee\"/>";
            case 92: return "<circle cx=\"12\" cy=\"12\" r=\"5\" fill=\"#34d399\"/><circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 93: return "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"3\" fill=\"#c084fc\"/><line x1=\"12\" y1=\"3\" x2=\"12\" y2=\"6\" stroke=\"#c084fc\" stroke-width=\"2\"/>";
            case 94: return "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><path d=\"M12 12l5-5\" stroke=\"#fbbf24\" stroke-width=\"2.5\"/>";
            case 95: return "<path d=\"M2 12h5l3-7 4 14 3-7h5\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 96: return "<path d=\"M12 2v6m0 8v6M8 8v4m8-4v4M5 12h14v2a7 7 0 0 1-14 0v-2z\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 97: return "<rect x=\"1\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"23\" y1=\"11\" x2=\"23\" y2=\"13\" stroke=\"#fbbf24\" stroke-width=\"2\"/><polygon points=\"10 8 7 13 11 13 9 17 14 11 10 11 10 8\" fill=\"#fbbf24\"/>";
            case 98: return "<rect x=\"1\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"23\" y1=\"11\" x2=\"23\" y2=\"13\" stroke=\"#34d399\" stroke-width=\"2\"/><rect x=\"3\" y=\"8\" width=\"14\" height=\"8\" rx=\"1\" fill=\"#34d399\"/>";
            case 99: return "<rect x=\"1\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"23\" y1=\"11\" x2=\"23\" y2=\"13\" stroke=\"#34d399\" stroke-width=\"2\"/><rect x=\"3\" y=\"8\" width=\"10.5\" height=\"8\" rx=\"1\" fill=\"#34d399\"/>";
            case 100: return "<rect x=\"1\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"23\" y1=\"11\" x2=\"23\" y2=\"13\" stroke=\"#fbbf24\" stroke-width=\"2\"/><rect x=\"3\" y=\"8\" width=\"7\" height=\"8\" rx=\"1\" fill=\"#fbbf24\"/>";
            case 101: return "<rect x=\"1\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"23\" y1=\"11\" x2=\"23\" y2=\"13\" stroke=\"#fbbf24\" stroke-width=\"2\"/><rect x=\"3\" y=\"8\" width=\"3.5\" height=\"8\" rx=\"1\" fill=\"#fbbf24\"/>";
            case 102: return "<rect x=\"1\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"23\" y1=\"11\" x2=\"23\" y2=\"13\" stroke=\"#ef4444\" stroke-width=\"2\"/><rect x=\"3\" y=\"8\" width=\"2\" height=\"8\" rx=\"1\" fill=\"#ef4444\"/>";
            case 103: return "<rect x=\"1\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\" fill=\"none\" stroke=\"#10b981\" stroke-width=\"2\"/><line x1=\"23\" y1=\"11\" x2=\"23\" y2=\"13\" stroke=\"#10b981\" stroke-width=\"2\"/><path d=\"M9 14s2-4 5-4\" stroke=\"#10b981\" stroke-width=\"2\"/>";
            case 104: return "<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"3\" y1=\"12\" x2=\"21\" y2=\"12\" stroke=\"#fbbf24\"/><line x1=\"9\" y1=\"4\" x2=\"9\" y2=\"20\" stroke=\"#fbbf24\"/><line x1=\"15\" y1=\"4\" x2=\"15\" y2=\"20\" stroke=\"#fbbf24\"/>";
            case 105: return "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><path d=\"M12 6v6l3 3\" stroke=\"#c084fc\" stroke-width=\"2\"/>";
            case 106: return "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"3\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M8 8h8M8 12h8M8 16h5\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 107: return "<polygon points=\"13 2 3 14 12 14 11 22 21 10 12 10 13 2\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>";
            case 108: return "<rect x=\"6\" y=\"2\" width=\"12\" height=\"20\" rx=\"2\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"12\" y1=\"6\" x2=\"12\" y2=\"10\" stroke=\"#ef4444\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"15\" r=\"2\" fill=\"#ef4444\"/>";
            case 109: return "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M12 12l4-3\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 110: return "<path d=\"M4 12h4l4-8 4 16 4-8h4\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/>";
            case 111: return "<circle cx=\"8\" cy=\"12\" r=\"5\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><circle cx=\"16\" cy=\"12\" r=\"5\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>";
            case 112: return "<line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"12\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"4\" y1=\"12\" x2=\"20\" y2=\"12\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"7\" y1=\"16\" x2=\"17\" y2=\"16\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"10\" y1=\"20\" x2=\"14\" y2=\"20\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 113: return "<line x1=\"2\" y1=\"12\" x2=\"10\" y2=\"12\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"14\" y1=\"12\" x2=\"22\" y2=\"12\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"10\" y1=\"5\" x2=\"10\" y2=\"19\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"14\" y1=\"5\" x2=\"14\" y2=\"19\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 114: return "<path d=\"M3 12a3 3 0 0 1 6 0 3 3 0 0 1 6 0 3 3 0 0 1 6 0\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/>";
            case 115: return "<polygon points=\"8 4 16 12 8 20 8 4\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"16\" y1=\"4\" x2=\"16\" y2=\"20\" stroke=\"#fbbf24\" stroke-width=\"2\"/>";
            case 116: return "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"6\" y1=\"10\" x2=\"10\" y2=\"10\" stroke=\"#22d3ee\"/><path d=\"M14 14s1-2 2-2 2 2 2 2\" stroke=\"#22d3ee\" fill=\"none\"/>";
            case 117: return "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><circle cx=\"9\" cy=\"12\" r=\"1.5\" fill=\"#94a3b8\"/><circle cx=\"15\" cy=\"12\" r=\"1.5\" fill=\"#94a3b8\"/>";
            case 118: return "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"9\" y1=\"9\" x2=\"9\" y2=\"15\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"15\" y1=\"9\" x2=\"15\" y2=\"15\" stroke=\"#94a3b8\" stroke-width=\"2\"/>";
            case 119: return "<path d=\"M6 18a8 8 0 0 1 12 0M8 15a5 5 0 0 1 8 0\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><polygon points=\"12 4 9 9 13 9 11 14 15 9 12 9 12 4\" fill=\"#22d3ee\"/>";
            case 120: return "<path d=\"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z\" fill=\"none\" stroke=\"#10b981\" stroke-width=\"2\"/><path d=\"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12\" stroke=\"#10b981\" stroke-width=\"2\"/>";
            case 121: return "<path d=\"M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/>";
            case 122: return "<path d=\"M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>";
            case 123: return "<path d=\"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/>";
            case 124: return "<rect x=\"5\" y=\"11\" width=\"14\" height=\"10\" rx=\"2\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><path d=\"M8 11V7a4 4 0 0 1 8 0v4\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/>";
            case 125: return "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M12 12a3 3 0 0 1 3-3c2 0 3 2 3 3s-2 3-3 3M12 12a3 3 0 0 1-3 3c0 2 2 3 3 3s3-2 3-3M12 12a3 3 0 0 1-3-3c-2 0-3 2-3 3s2 3 3 3\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"1.8\"/>";
            case 126: return "<path d=\"M4 4v16M8 4v16M12 4v16M16 4v16M20 4v16\" stroke=\"#94a3b8\" stroke-width=\"2\"/>";
            case 127: return "<polygon points=\"13 2 3 14 12 14 11 22 21 10 12 10 13 2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"2\" y1=\"22\" x2=\"22\" y2=\"22\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 128: return "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><rect x=\"8\" y=\"12\" width=\"8\" height=\"8\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"1.5\"/><line x1=\"8\" y1=\"16\" x2=\"16\" y2=\"16\" stroke=\"#34d399\"/>";
            case 129: return "<path d=\"M5 12.55a11 11 0 0 1 14.08 0\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M1.42 9a16 16 0 0 1 21.16 0\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M8.53 16.11a6 6 0 0 1 6.95 0\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"20\" r=\"1.2\" fill=\"#34d399\"/>";
            case 130: return "<path d=\"M5 12.55a11 11 0 0 1 14.08 0\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><path d=\"M8.53 16.11a6 6 0 0 1 6.95 0\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"20\" r=\"1.2\" fill=\"#fbbf24\"/>";
            case 131: return "<path d=\"M8.53 16.11a6 6 0 0 1 6.95 0\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"20\" r=\"1.2\" fill=\"#f59e0b\"/>";
            case 132: return "<line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\" stroke=\"#ef4444\" stroke-width=\"2\"/><path d=\"M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.58 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"20\" r=\"1\" fill=\"#ef4444\"/>";
            case 133: return "<path d=\"M2 20h3v-8H2v8zM7 20h3v-12H7v12zM12 20h3v-16H12v16zM17 20h3v-19H17v19z\" fill=\"#22d3ee\"/>";
            case 134: return "<path d=\"M2 20h3v-8H2v8zM7 20h3v-12H7v12zM12 20h3v-16H12v16z\" fill=\"#34d399\"/><path d=\"M17 20h3v-19H17v19z\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"1.5\"/>";
            case 135: return "<path d=\"M6 2h8l6 6v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 136: return "<polyline points=\"6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 137: return "<circle cx=\"12\" cy=\"12\" r=\"3\" fill=\"#c084fc\"/><path d=\"M6 18a8 8 0 0 1 12 0M8 15a5 5 0 0 1 8 0\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/>";
            case 138: return "<circle cx=\"12\" cy=\"18\" r=\"2\" fill=\"#fbbf24\"/><path d=\"M5 13a10 10 0 0 1 14 0M8 16a5 5 0 0 1 8 0\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>";
            case 139: return "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\" stroke=\"#22d3ee\"/><path d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\" fill=\"none\" stroke=\"#22d3ee\"/>";
            case 140: return "<rect x=\"2\" y=\"8\" width=\"20\" height=\"8\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"6\" y1=\"12\" x2=\"6\" y2=\"12.01\" stroke=\"#c084fc\" stroke-width=\"2.5\"/><line x1=\"10\" y1=\"12\" x2=\"10\" y2=\"12.01\" stroke=\"#c084fc\" stroke-width=\"2.5\"/><line x1=\"14\" y1=\"12\" x2=\"14\" y2=\"12.01\" stroke=\"#c084fc\" stroke-width=\"2.5\"/><line x1=\"18\" y1=\"12\" x2=\"18\" y2=\"12.01\" stroke=\"#c084fc\" stroke-width=\"2.5\"/><line x1=\"6\" y1=\"4\" x2=\"6\" y2=\"8\" stroke=\"#c084fc\" stroke-width=\"1.8\"/><line x1=\"18\" y1=\"4\" x2=\"18\" y2=\"8\" stroke=\"#c084fc\" stroke-width=\"1.8\"/>";
            case 141: return "<rect x=\"2\" y=\"6\" width=\"20\" height=\"12\" rx=\"2\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><circle cx=\"6\" cy=\"12\" r=\"1.5\" fill=\"#22d3ee\"/><circle cx=\"10\" cy=\"12\" r=\"1.5\" fill=\"#22d3ee\"/><circle cx=\"14\" cy=\"12\" r=\"1.5\" fill=\"#22d3ee\"/><circle cx=\"18\" cy=\"12\" r=\"1.5\" fill=\"#22d3ee\"/>";
            case 142: return "<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><circle cx=\"6\" cy=\"8\" r=\"1\" fill=\"#94a3b8\"/><circle cx=\"10\" cy=\"8\" r=\"1\" fill=\"#94a3b8\"/><circle cx=\"14\" cy=\"8\" r=\"1\" fill=\"#94a3b8\"/><circle cx=\"18\" cy=\"8\" r=\"1\" fill=\"#94a3b8\"/><circle cx=\"6\" cy=\"16\" r=\"1\" fill=\"#94a3b8\"/><circle cx=\"10\" cy=\"16\" r=\"1\" fill=\"#94a3b8\"/><circle cx=\"14\" cy=\"16\" r=\"1\" fill=\"#94a3b8\"/><circle cx=\"18\" cy=\"16\" r=\"1\" fill=\"#94a3b8\"/>";
            case 143: return "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"3\" y1=\"9\" x2=\"21\" y2=\"9\" stroke=\"#ef4444\"/><line x1=\"3\" y1=\"15\" x2=\"21\" y2=\"15\" stroke=\"#ef4444\"/><line x1=\"8\" y1=\"3\" x2=\"8\" y2=\"9\" stroke=\"#ef4444\"/><line x1=\"16\" y1=\"3\" x2=\"16\" y2=\"9\" stroke=\"#ef4444\"/><line x1=\"12\" y1=\"9\" x2=\"12\" y2=\"15\" stroke=\"#ef4444\"/><line x1=\"8\" y1=\"15\" x2=\"8\" y2=\"21\" stroke=\"#ef4444\"/><line x1=\"16\" y1=\"15\" x2=\"16\" y2=\"21\" stroke=\"#ef4444\"/>";
            case 144: return "<rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 10 0v4\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"16\" r=\"1.5\" fill=\"#34d399\"/>";
            case 145: return "<path d=\"M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 146: return "<path d=\"M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><polyline points=\"16 16 12 12 8 16\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"12\" y1=\"12\" x2=\"12\" y2=\"21\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 147: return "<path d=\"M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><polyline points=\"8 17 12 21 16 17\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"12\" y1=\"12\" x2=\"12\" y2=\"21\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 148: return "<path d=\"M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>";
            case 149: return "<path d=\"M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0-4 7h1a5 5 0 0 0 4 5h12\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\" stroke=\"#ef4444\" stroke-width=\"2\"/>";
            case 150: return "<rect x=\"2\" y=\"2\" width=\"20\" height=\"8\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><rect x=\"2\" y=\"14\" width=\"20\" height=\"8\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"6\" cy=\"6\" r=\"1\" fill=\"#c084fc\"/><circle cx=\"6\" cy=\"18\" r=\"1\" fill=\"#c084fc\"/>";
            case 151: return "<rect x=\"4\" y=\"2\" width=\"16\" height=\"20\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"4\" y1=\"7\" x2=\"20\" y2=\"7\" stroke=\"#c084fc\"/><line x1=\"4\" y1=\"12\" x2=\"20\" y2=\"12\" stroke=\"#c084fc\"/><line x1=\"4\" y1=\"17\" x2=\"20\" y2=\"17\" stroke=\"#c084fc\"/>";
            case 152: return "<ellipse cx=\"12\" cy=\"5\" rx=\"9\" ry=\"3\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M21 12c0 1.66-4 3-9 3s-9-1.34-9-3\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 153: return "<ellipse cx=\"12\" cy=\"5\" rx=\"9\" ry=\"3\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 154: return "<polygon points=\"12 2 2 7 12 12 22 7 12 2\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><polyline points=\"2 17 12 22 22 17\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><polyline points=\"2 12 12 17 22 12\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/>";
            case 155: return "<circle cx=\"6\" cy=\"12\" r=\"3\" fill=\"#c084fc\"/><circle cx=\"18\" cy=\"6\" r=\"3\" fill=\"#c084fc\"/><circle cx=\"18\" cy=\"18\" r=\"3\" fill=\"#c084fc\"/><line x1=\"8.5\" y1=\"10.5\" x2=\"15.5\" y2=\"7.5\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"8.5\" y1=\"13.5\" x2=\"15.5\" y2=\"16.5\" stroke=\"#c084fc\" stroke-width=\"2\"/>";
            case 156: return "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><path d=\"M12 7v5l3 3\" stroke=\"#fbbf24\" stroke-width=\"2\"/>";
            case 157: return "<circle cx=\"18\" cy=\"5\" r=\"3\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><circle cx=\"6\" cy=\"12\" r=\"3\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><circle cx=\"18\" cy=\"19\" r=\"3\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"8.59\" y1=\"13.51\" x2=\"15.42\" y2=\"17.49\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"15.41\" y1=\"6.51\" x2=\"8.59\" y2=\"10.49\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 158: return "<polygon points=\"23 7 16 12 23 17 23 7\" fill=\"rgba(192,132,252,0.3)\" stroke=\"#c084fc\" stroke-width=\"1.8\"/><rect x=\"1\" y=\"5\" width=\"15\" height=\"14\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/>";
            case 159: return "<rect x=\"2\" y=\"3\" width=\"20\" height=\"18\" rx=\"3\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"7\" y1=\"8\" x2=\"17\" y2=\"8\" stroke=\"#22d3ee\"/><line x1=\"7\" y1=\"12\" x2=\"17\" y2=\"12\" stroke=\"#22d3ee\"/><line x1=\"7\" y1=\"16\" x2=\"13\" y2=\"16\" stroke=\"#22d3ee\"/>";
            case 160: return "<path d=\"M2 12h3l2-6 4 12 3-8 2 5 2-3h4\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 161: return "<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"3\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><text x=\"12\" y=\"15\" font-family=\"monospace\" font-size=\"7\" font-weight=\"bold\" fill=\"#34d399\" text-anchor=\"middle\">OPUS</text>";
            case 162: return "<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"3\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><text x=\"12\" y=\"15\" font-family=\"monospace\" font-size=\"7\" font-weight=\"bold\" fill=\"#94a3b8\" text-anchor=\"middle\">G711</text>";
            case 163: return "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><path d=\"M8 12s1.5-3 4-3 4 3 4 3-1.5 3-4 3-4-3-4-3z\" stroke=\"#c084fc\" stroke-width=\"2\" fill=\"none\"/>";
            case 164: return "<rect x=\"3\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"7\" y1=\"10\" x2=\"7\" y2=\"14\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"16\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"17\" y1=\"10\" x2=\"17\" y2=\"14\" stroke=\"#fbbf24\" stroke-width=\"2\"/>";
            case 165: return "<polygon points=\"23 7 16 12 23 17 23 7\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><rect x=\"1\" y=\"5\" width=\"15\" height=\"14\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/>";
            case 166: return "<path d=\"M20 7h-3a2 2 0 0 1-2-2 2 2 0 0 0-2-2H9a2 2 0 0 0-2 2 2 2 0 0 1-2 2H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M8 13a4 4 0 0 1 8 0\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 167: return "<line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\" stroke=\"#ef4444\" stroke-width=\"2\"/><path d=\"M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/>";
            case 168: return "<rect x=\"2\" y=\"3\" width=\"20\" height=\"14\" rx=\"2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><polyline points=\"8 21 12 17 16 21\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"12\" y1=\"17\" x2=\"12\" y2=\"21\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 169: return "<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><rect x=\"12\" y=\"10\" width=\"8\" height=\"8\" rx=\"1\" fill=\"#c084fc\"/>";
            case 170: return "<polyline points=\"15 3 21 3 21 9\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><polyline points=\"9 21 3 21 3 15\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"21\" y1=\"3\" x2=\"14\" y2=\"10\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"3\" y1=\"21\" x2=\"10\" y2=\"14\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 171: return "<polyline points=\"4 14 10 14 10 20\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><polyline points=\"20 10 14 10 14 4\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"14\" y1=\"10\" x2=\"21\" y2=\"3\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"3\" y1=\"21\" x2=\"10\" y2=\"14\" stroke=\"#94a3b8\" stroke-width=\"2\"/>";
            case 172: return "<rect x=\"3\" y=\"3\" width=\"7\" height=\"7\" rx=\"1\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\" rx=\"1\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\" rx=\"1\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\" rx=\"1\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 173: return "<rect x=\"2\" y=\"2\" width=\"20\" height=\"14\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"9\" r=\"3\" fill=\"#c084fc\"/><rect x=\"4\" y=\"18\" width=\"4\" height=\"4\" rx=\"1\" fill=\"#c084fc\"/><rect x=\"10\" y=\"18\" width=\"4\" height=\"4\" rx=\"1\" fill=\"#c084fc\"/><rect x=\"16\" y=\"18\" width=\"4\" height=\"4\" rx=\"1\" fill=\"#c084fc\"/>";
            case 174: return "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><polyline points=\"12 6 12 18\" stroke=\"#fbbf24\" stroke-width=\"2\"/><polyline points=\"6 12 18 12\" stroke=\"#fbbf24\" stroke-width=\"2\"/>";
            case 175: return "<circle cx=\"11\" cy=\"11\" r=\"8\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"11\" y1=\"8\" x2=\"11\" y2=\"14\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"8\" y1=\"11\" x2=\"14\" y2=\"11\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 176: return "<circle cx=\"11\" cy=\"11\" r=\"8\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"8\" y1=\"11\" x2=\"14\" y2=\"11\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 177: return "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"3\" fill=\"#34d399\"/><path d=\"M12 2v2M12 20v2M2 12h2M20 12h2\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 178: return "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\" stroke-dasharray=\"4 2\"/><circle cx=\"12\" cy=\"12\" r=\"3\" fill=\"#ef4444\"/>";
            case 179: return "<line x1=\"4\" y1=\"21\" x2=\"4\" y2=\"14\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"4\" y1=\"10\" x2=\"4\" y2=\"3\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"12\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"3\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"20\" y1=\"21\" x2=\"20\" y2=\"16\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"20\" y1=\"12\" x2=\"20\" y2=\"3\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"1\" y1=\"14\" x2=\"7\" y2=\"14\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"9\" y1=\"8\" x2=\"15\" y2=\"8\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"17\" y1=\"16\" x2=\"23\" y2=\"16\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 180: return "<path d=\"M6 2h8l6 6v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><rect x=\"8\" y=\"10\" width=\"8\" height=\"8\" rx=\"1\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"1.5\"/><line x1=\"8\" y1=\"14\" x2=\"16\" y2=\"14\" stroke=\"#22d3ee\" stroke-width=\"1.5\"/><line x1=\"12\" y1=\"10\" x2=\"12\" y2=\"18\" stroke=\"#22d3ee\" stroke-width=\"1.5\"/>";
            case 181: return "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><rect x=\"8\" y=\"12\" width=\"8\" height=\"8\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"1.5\"/><line x1=\"8\" y1=\"16\" x2=\"16\" y2=\"16\" stroke=\"#34d399\" stroke-width=\"1.5\"/><line x1=\"12\" y1=\"4\" x2=\"12\" y2=\"12\" stroke=\"#34d399\" stroke-width=\"1.5\"/>";
            case 182: return "<path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\" fill=\"none\" stroke=\"#a855f7\" stroke-width=\"2\"/><path d=\"M12 22V2\" stroke=\"#a855f7\" stroke-width=\"1.5\"/>";
            case 183: return "<path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><rect x=\"9\" y=\"10\" width=\"6\" height=\"5\" rx=\"1\" fill=\"#34d399\"/>";
            case 184: return "<circle cx=\"8\" cy=\"12\" r=\"5\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><circle cx=\"16\" cy=\"12\" r=\"5\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><polyline points=\"6 12 18 12\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 185: return "<polygon points=\"5 3 19 12 5 21 5 3\" fill=\"#34d399\"/>";
            case 186: return "<rect x=\"6\" y=\"4\" width=\"4\" height=\"16\" fill=\"#fbbf24\" rx=\"1\"/><rect x=\"14\" y=\"4\" width=\"4\" height=\"16\" fill=\"#fbbf24\" rx=\"1\"/>";
            case 187: return "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\" fill=\"#ef4444\"/>";
            case 188: return "<polygon points=\"11 19 2 12 11 5 11 19\" fill=\"#22d3ee\"/><polygon points=\"22 19 13 12 22 5 22 19\" fill=\"#22d3ee\"/>";
            case 189: return "<polygon points=\"13 19 22 12 13 5 13 19\" fill=\"#22d3ee\"/><polygon points=\"2 19 11 12 2 5 2 19\" fill=\"#22d3ee\"/>";
            case 190: return "<polyline points=\"16 3 21 3 21 8\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"4\" y1=\"20\" x2=\"21\" y2=\"3\" stroke=\"#c084fc\" stroke-width=\"2\"/><polyline points=\"21 16 21 21 16 21\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"15\" y1=\"15\" x2=\"21\" y2=\"21\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"4\" y1=\"4\" x2=\"9\" y2=\"9\" stroke=\"#c084fc\" stroke-width=\"2\"/>";
            case 191: return "<polyline points=\"17 1 21 5 17 9\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M3 11V9a4 4 0 0 1 4-4h14\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><polyline points=\"7 23 3 19 7 15\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><path d=\"M21 13v2a4 4 0 0 1-4 4H3\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 192: return "<rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 10 0v4\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 193: return "<rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 9.9-1\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>";
            case 194: return "<path d=\"M21 2l-2 2m-1.5 1.5L14 9l-3-3L2 15l7 7 9-9 3.5-3.5z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 195: return "<path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><polyline points=\"9 12 11 14 15 10\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 196: return "<path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"12\" stroke=\"#ef4444\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"16\" r=\"1\" fill=\"#ef4444\"/>";
            case 197: return "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"3\" fill=\"#22d3ee\"/><line x1=\"3\" y1=\"12\" x2=\"21\" y2=\"12\" stroke=\"#22d3ee\" stroke-width=\"1.5\"/>";
            case 198: return "<path d=\"M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M4 16v3a1 1 0 0 0 1 1h3M16 20h3a1 1 0 0 0 1-1v-3\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"9\" cy=\"10\" r=\"1\" fill=\"#c084fc\"/><circle cx=\"15\" cy=\"10\" r=\"1\" fill=\"#c084fc\"/><path d=\"M9 15s1 1 3 1 3-1 3-1\" stroke=\"#c084fc\" stroke-width=\"2\"/>";
            case 199: return "<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><circle cx=\"9\" cy=\"10\" r=\"2\" fill=\"#22d3ee\"/><line x1=\"15\" y1=\"9\" x2=\"18\" y2=\"9\" stroke=\"#22d3ee\"/><line x1=\"15\" y1=\"13\" x2=\"18\" y2=\"13\" stroke=\"#22d3ee\"/><line x1=\"7\" y1=\"16\" x2=\"17\" y2=\"16\" stroke=\"#22d3ee\"/>";
            case 200: return "<path d=\"M12 2a7 7 0 0 0-7 7v4l-2 3h18l-2-3V9a7 7 0 0 0-7-7z\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><path d=\"M12 18v3M8 21h8\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"0\" stroke=\"#ef4444\"/>";
            case 201: return "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"3\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"3\" fill=\"#fbbf24\"/>";
            case 202: return "<path d=\"M3 12a9 9 0 0 1 18 0H3z\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"4\" fill=\"#c084fc\"/>";
            case 203: return "<path d=\"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/>";
            case 204: return "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><path d=\"M12 8v4M12 16h.01\" stroke=\"#fbbf24\" stroke-width=\"2\"/>";
            case 205: return "<polygon points=\"6 2 18 2 22 8 12 22 2 8 6 2\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"2\" y1=\"8\" x2=\"22\" y2=\"8\" stroke=\"#22d3ee\"/>";
            case 206: return "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"#ef4444\"/><text x=\"12\" y=\"15\" font-family=\"monospace\" font-size=\"7\" font-weight=\"black\" fill=\"#ffffff\" text-anchor=\"middle\">SOS</text>";
            case 207: return "<polygon points=\"1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 208: return "<line x1=\"4\" y1=\"9\" x2=\"20\" y2=\"9\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"4\" y1=\"15\" x2=\"20\" y2=\"15\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"10\" y1=\"3\" x2=\"8\" y2=\"21\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"16\" y1=\"3\" x2=\"14\" y2=\"21\" stroke=\"#c084fc\" stroke-width=\"2\"/>";
            case 209: return "<path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><polyline points=\"14 2 14 8 20 8\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"16\" y1=\"13\" x2=\"8\" y2=\"13\" stroke=\"#22d3ee\"/><line x1=\"16\" y1=\"17\" x2=\"8\" y2=\"17\" stroke=\"#22d3ee\"/>";
            case 210: return "<rect x=\"5\" y=\"2\" width=\"14\" height=\"20\" rx=\"2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"12\" y1=\"18\" x2=\"12.01\" y2=\"18\" stroke=\"#34d399\" stroke-width=\"3\"/><polyline points=\"9 10 11 12 15 8\" stroke=\"#34d399\" stroke-width=\"2\" fill=\"none\"/>";
            case 211: return "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"3\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"4\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"12\" y1=\"12\" x2=\"15\" y2=\"12\" stroke=\"#fbbf24\" stroke-width=\"2\"/>";
            case 212: return "<path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\" fill=\"none\" stroke=\"#10b981\" stroke-width=\"2\"/><path d=\"M9 12l2 2 4-4\" stroke=\"#10b981\" stroke-width=\"2\" fill=\"none\"/>";
            case 213: return "<path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\" stroke=\"#c084fc\" stroke-width=\"2\"/>";
            case 214: return "<polyline points=\"4 17 10 11 4 5\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"12\" y1=\"19\" x2=\"20\" y2=\"19\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 215: return "<circle cx=\"8\" cy=\"12\" r=\"4\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"12\" y1=\"12\" x2=\"20\" y2=\"12\" stroke=\"#fbbf24\" stroke-width=\"2\"/><line x1=\"17\" y1=\"12\" x2=\"17\" y2=\"15\" stroke=\"#fbbf24\" stroke-width=\"2\"/>";
            case 216: return "<rect x=\"4\" y=\"10\" width=\"16\" height=\"11\" rx=\"2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M7 10V6a5 5 0 0 1 10 0v4\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"15\" r=\"1.5\" fill=\"#34d399\"/>";
            case 217: return "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><polyline points=\"12 6 12 12 16 14\" stroke=\"#94a3b8\" stroke-width=\"2\" fill=\"none\"/><line x1=\"2\" y1=\"2\" x2=\"22\" y2=\"22\" stroke=\"#ef4444\" stroke-width=\"2\"/>";
            case 218: return "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><line x1=\"4.93\" y1=\"4.93\" x2=\"19.07\" y2=\"19.07\" stroke=\"#ef4444\" stroke-width=\"2\"/>";
            case 219: return "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><polyline points=\"8 12 11 15 16 9\" stroke=\"#34d399\" stroke-width=\"2\" fill=\"none\"/>";
            case 220: return "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"2\"/><line x1=\"8\" y1=\"3\" x2=\"8\" y2=\"21\" stroke=\"#c084fc\" stroke-width=\"1.8\"/><line x1=\"12\" y1=\"3\" x2=\"12\" y2=\"21\" stroke=\"#c084fc\" stroke-width=\"1.8\"/><line x1=\"16\" y1=\"3\" x2=\"16\" y2=\"21\" stroke=\"#c084fc\" stroke-width=\"1.8\"/>";
            case 221: return "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"1.5\" stroke-dasharray=\"2 2\"/><text x=\"12\" y=\"14.5\" font-family=\"monospace\" font-size=\"6\" font-weight=\"bold\" fill=\"#22d3ee\" text-anchor=\"middle\">AUTH</text>";
            case 222: return "<path d=\"M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>";
            case 223: return "<polygon points=\"12 2 2 22 22 22 12 2\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"13\" r=\"3\" fill=\"#ef4444\"/>";
            case 224: return "<path d=\"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><polyline points=\"9 22 9 12 15 12 15 22\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 225: return "<path d=\"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"7\" r=\"4\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 226: return "<circle cx=\"12\" cy=\"12\" r=\"3\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\"/>";
            case 227: return "<path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>";
            case 228: return "<polyline points=\"4 17 10 11 4 5\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"12\" y1=\"19\" x2=\"20\" y2=\"19\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 229: return "<polyline points=\"15 18 9 12 15 6\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2.5\"/>";
            case 230: return "<polyline points=\"9 18 15 12 9 6\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2.5\"/>";
            case 231: return "<polyline points=\"18 15 12 9 6 15\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2.5\"/>";
            case 232: return "<polyline points=\"6 9 12 15 18 9\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2.5\"/>";
            case 233: return "<line x1=\"3\" y1=\"6\" x2=\"21\" y2=\"6\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"3\" y1=\"12\" x2=\"21\" y2=\"12\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"3\" y1=\"18\" x2=\"21\" y2=\"18\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 234: return "<circle cx=\"12\" cy=\"5\" r=\"1.5\" fill=\"#94a3b8\"/><circle cx=\"12\" cy=\"12\" r=\"1.5\" fill=\"#94a3b8\"/><circle cx=\"12\" cy=\"19\" r=\"1.5\" fill=\"#94a3b8\"/>";
            case 235: return "<circle cx=\"5\" cy=\"12\" r=\"1.5\" fill=\"#94a3b8\"/><circle cx=\"12\" cy=\"12\" r=\"1.5\" fill=\"#94a3b8\"/><circle cx=\"19\" cy=\"12\" r=\"1.5\" fill=\"#94a3b8\"/>";
            case 236: return "<line x1=\"4\" y1=\"21\" x2=\"4\" y2=\"14\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"4\" y1=\"10\" x2=\"4\" y2=\"3\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"12\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"3\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"20\" y1=\"21\" x2=\"20\" y2=\"16\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"20\" y1=\"12\" x2=\"20\" y2=\"3\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 237: return "<rect x=\"1\" y=\"5\" width=\"22\" height=\"14\" rx=\"7\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><circle cx=\"16\" cy=\"12\" r=\"4\" fill=\"#34d399\"/>";
            case 238: return "<rect x=\"1\" y=\"5\" width=\"22\" height=\"14\" rx=\"7\" fill=\"none\" stroke=\"#64748b\" stroke-width=\"2\"/><circle cx=\"8\" cy=\"12\" r=\"4\" fill=\"#64748b\"/>";
            case 239: return "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"3\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><polyline points=\"8 12 11 15 16 9\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2.5\"/>";
            case 240: return "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"3\" fill=\"none\" stroke=\"#64748b\" stroke-width=\"2\"/>";
            case 241: return "<polyline points=\"20 6 9 17 4 12\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>";
            case 242: return "<line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\" stroke=\"#ef4444\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\" stroke=\"#ef4444\" stroke-width=\"3\" stroke-linecap=\"round\"/>";
            case 243: return "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"12\" stroke=\"#22d3ee\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"8\" r=\"1\" fill=\"#22d3ee\"/>";
            case 244: return "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/><path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01\" stroke=\"#fbbf24\" stroke-width=\"2\"/>";
            case 245: return "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><polyline points=\"12 6 12 12 14 14\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 246: return "<rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><line x1=\"16\" y1=\"2\" x2=\"16\" y2=\"6\" stroke=\"#34d399\"/><line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"6\" stroke=\"#34d399\"/><line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\" stroke=\"#34d399\"/>";
            case 247: return "<path d=\"M12 15l3.5-3.5\" stroke=\"#34d399\" stroke-width=\"2\"/><path d=\"M20.3 18a9 9 0 1 0-16.6 0\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 248: return "<circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"none\" stroke=\"#c084fc\" stroke-width=\"3\" stroke-dasharray=\"35 20\"/>";
            case 249: return "<polyline points=\"3 6 5 6 21 6\" stroke=\"#ef4444\" stroke-width=\"2\"/><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\" stroke=\"#ef4444\" stroke-width=\"2\" fill=\"none\"/>";
            case 250: return "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" stroke=\"#22d3ee\" stroke-width=\"2\" fill=\"none\"/><polyline points=\"7 10 12 15 17 10\" stroke=\"#22d3ee\" stroke-width=\"2\" fill=\"none\"/><line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"3\" stroke=\"#22d3ee\" stroke-width=\"2\"/>";
            case 251: return "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" stroke=\"#34d399\" stroke-width=\"2\" fill=\"none\"/><polyline points=\"17 8 12 3 7 8\" stroke=\"#34d399\" stroke-width=\"2\" fill=\"none\"/><line x1=\"12\" y1=\"3\" x2=\"12\" y2=\"15\" stroke=\"#34d399\" stroke-width=\"2\"/>";
            case 252: return "<path d=\"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\"/>";
            case 253: return "<rect x=\"3\" y=\"3\" width=\"7\" height=\"7\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\" fill=\"none\" stroke=\"#22d3ee\" stroke-width=\"2\"/><rect x=\"14\" y=\"14\" width=\"3\" height=\"3\" fill=\"#22d3ee\"/><rect x=\"18\" y=\"18\" width=\"3\" height=\"3\" fill=\"#22d3ee\"/>";
            case 254: return "<path d=\"M6 18a8 8 0 0 1 12 0M8 15a5 5 0 0 1 8 0\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"18\" r=\"1\" fill=\"#34d399\"/>";
            case 255: return "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\" fill=\"none\" stroke=\"#34d399\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><polyline points=\"16 2 20 6 16 10\" fill=\"none\" stroke=\"#6ee7b7\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><line x1=\"20\" y1=\"6\" x2=\"11\" y2=\"15\" stroke=\"#6ee7b7\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>";
            case 256: return "<circle cx=\"11\" cy=\"11\" r=\"8\"/><line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\"/>";
            case 257: return "<path d=\"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/><polyline points=\"9 22 9 12 15 12 15 22\"/>";
            case 258: return "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z\"/>";
            case 259: return "<path d=\"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\"/><circle cx=\"12\" cy=\"7\" r=\"4\"/>";
            case 260: return "<path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/><path d=\"M23 21v-2a4 4 0 0 0-3-3.87\"/><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"/>";
            case 261: return "<path d=\"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9\"/><path d=\"M13.73 21a2 2 0 0 1-3.46 0\"/>";
            case 262: return "<polygon points=\"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3\"/>";
            case 263: return "<circle cx=\"18\" cy=\"5\" r=\"3\"/><circle cx=\"6\" cy=\"12\" r=\"3\"/><circle cx=\"18\" cy=\"19\" r=\"3\"/><line x1=\"8.59\" y1=\"13.51\" x2=\"15.42\" y2=\"17.49\"/><line x1=\"15.41\" y1=\"6.51\" x2=\"8.59\" y2=\"10.49\"/>";
            case 264: return "<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"/><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"/>";
            case 265: return "<path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"/><polyline points=\"15 3 21 3 21 9\"/><line x1=\"10\" y1=\"14\" x2=\"21\" y2=\"3\"/>";
            case 266: return "<line x1=\"3\" y1=\"12\" x2=\"21\" y2=\"12\"/><line x1=\"3\" y1=\"6\" x2=\"21\" y2=\"6\"/><line x1=\"3\" y1=\"18\" x2=\"21\" y2=\"18\"/>";
            case 267: return "<rect x=\"3\" y=\"3\" width=\"7\" height=\"7\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\"/>";
            case 268: return "<line x1=\"8\" y1=\"6\" x2=\"21\" y2=\"6\"/><line x1=\"8\" y1=\"12\" x2=\"21\" y2=\"12\"/><line x1=\"8\" y1=\"18\" x2=\"21\" y2=\"18\"/><line x1=\"3\" y1=\"6\" x2=\"3.01\" y2=\"6\"/><line x1=\"3\" y1=\"12\" x2=\"3.01\" y2=\"12\"/><line x1=\"3\" y1=\"18\" x2=\"3.01\" y2=\"18\"/>";
            case 269: return "<circle cx=\"12\" cy=\"12\" r=\"1\"/><circle cx=\"19\" cy=\"12\" r=\"1\"/><circle cx=\"5\" cy=\"12\" r=\"1\"/>";
            case 270: return "<circle cx=\"12\" cy=\"12\" r=\"1\"/><circle cx=\"12\" cy=\"5\" r=\"1\"/><circle cx=\"12\" cy=\"19\" r=\"1\"/>";
            case 271: return "<polyline points=\"18 15 12 9 6 15\"/>";
            case 272: return "<polyline points=\"6 9 12 15 18 9\"/>";
            case 273: return "<polyline points=\"15 18 9 12 15 6\"/>";
            case 274: return "<polyline points=\"9 18 15 12 9 6\"/>";
            case 275: return "<line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"5\"/><polyline points=\"5 12 12 5 19 12\"/>";
            case 276: return "<line x1=\"12\" y1=\"5\" x2=\"12\" y2=\"19\"/><polyline points=\"19 12 12 19 5 12\"/>";
            case 277: return "<line x1=\"19\" y1=\"12\" x2=\"5\" y2=\"12\"/><polyline points=\"12 19 5 12 12 5\"/>";
            case 278: return "<line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"/><polyline points=\"12 5 19 12 12 19\"/>";
            case 279: return "<polyline points=\"15 3 21 3 21 9\"/><polyline points=\"9 21 3 21 3 15\"/><line x1=\"21\" y1=\"3\" x2=\"14\" y2=\"10\"/><line x1=\"3\" y1=\"21\" x2=\"10\" y2=\"14\"/>";
            case 280: return "<path d=\"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7\"/><path d=\"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z\"/>";
            case 281: return "<polyline points=\"3 6 5 6 21 6\"/><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"/><line x1=\"10\" y1=\"11\" x2=\"10\" y2=\"17\"/><line x1=\"14\" y1=\"11\" x2=\"14\" y2=\"17\"/>";
            case 282: return "<line x1=\"12\" y1=\"5\" x2=\"12\" y2=\"19\"/><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"/>";
            case 283: return "<line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"/>";
            case 284: return "<polyline points=\"20 6 9 17 4 12\"/>";
            case 285: return "<line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"/><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"/>";
            case 286: return "<rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/>";
            case 287: return "<path d=\"M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z\"/><polyline points=\"17 21 17 13 7 13 7 21\"/><polyline points=\"7 3 7 8 15 8\"/>";
            case 288: return "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><polyline points=\"7 10 12 15 17 10\"/><line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"3\"/>";
            case 289: return "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><polyline points=\"17 8 12 3 7 8\"/><line x1=\"12\" y1=\"3\" x2=\"12\" y2=\"15\"/>";
            case 290: return "<path d=\"M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z\"/><polyline points=\"13 2 13 9 20 9\"/>";
            case 291: return "<path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"/><polyline points=\"14 2 14 8 20 8\"/><line x1=\"16\" y1=\"13\" x2=\"8\" y2=\"13\"/><line x1=\"16\" y1=\"17\" x2=\"8\" y2=\"17\"/><polyline points=\"10 9 9 9 8 9\"/>";
            case 292: return "<path d=\"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z\"/>";
            case 293: return "<path d=\"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z\"/><line x1=\"12\" y1=\"11\" x2=\"12\" y2=\"17\"/><line x1=\"9\" y1=\"14\" x2=\"15\" y2=\"14\"/>";
            case 294: return "<path d=\"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z\"/><line x1=\"9\" y1=\"14\" x2=\"15\" y2=\"14\"/>";
            case 295: return "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"/><circle cx=\"8.5\" cy=\"8.5\" r=\"1.5\"/><polyline points=\"21 15 16 10 5 21\"/>";
            case 296: return "<polygon points=\"23 7 16 12 23 17 23 7\"/><rect x=\"1\" y=\"5\" width=\"15\" height=\"14\" rx=\"2\" ry=\"2\"/>";
            case 297: return "<path d=\"M9 18V5l12-2v13\"/><circle cx=\"6\" cy=\"18\" r=\"3\"/><circle cx=\"18\" cy=\"16\" r=\"3\"/>";
            case 298: return "<path d=\"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>";
            case 299: return "<path d=\"M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24\"/><line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"/>";
            case 300: return "<rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"/>";
            case 301: return "<rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 9.9-1\"/>";
            case 302: return "<path d=\"M21 2l-2 2m-1.5 1.5L14 9l-1.5-1.5L11 9l-1.5-1.5L8 9l-4 4a5.5 5.5 0 1 0 7.78 7.78l4-4 1.5 1.5 1.5-1.5 1.5 1.5 1.5-1.5L22 4.5 21 2z\"/><circle cx=\"7.5\" cy=\"16.5\" r=\"1.5\"/>";
            case 303: return "<path d=\"M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z\"/>";
            case 304: return "<polygon points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\"/>";
            case 305: return "<path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"/>";
            case 306: return "<line x1=\"12\" y1=\"17\" x2=\"12\" y2=\"22\"/><path d=\"M5 17h14v-2l-2-2V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v8l-2 2v2z\"/>";
            case 307: return "<path d=\"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z\"/><line x1=\"4\" y1=\"22\" x2=\"4\" y2=\"15\"/>";
            case 308: return "<path d=\"M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z\"/><line x1=\"7\" y1=\"7\" x2=\"7.01\" y2=\"7\"/>";
            case 309: return "<circle cx=\"6\" cy=\"6\" r=\"3\"/><circle cx=\"6\" cy=\"18\" r=\"3\"/><line x1=\"20\" y1=\"4\" x2=\"8.12\" y2=\"15.88\"/><line x1=\"14.47\" y1=\"14.48\" x2=\"20\" y2=\"20\"/><line x1=\"8.12\" y1=\"8.12\" x2=\"12\" y2=\"12\"/>";
            case 310: return "<polyline points=\"16 18 22 12 16 6\"/><polyline points=\"8 6 2 12 8 18\"/>";
            case 311: return "<polyline points=\"4 17 10 11 4 5\"/><line x1=\"12\" y1=\"19\" x2=\"20\" y2=\"19\"/>";
            case 312: return "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\"/><rect x=\"9\" y=\"9\" width=\"6\" height=\"6\"/><line x1=\"9\" y1=\"1\" x2=\"9\" y2=\"4\"/><line x1=\"15\" y1=\"1\" x2=\"15\" y2=\"4\"/><line x1=\"9\" y1=\"20\" x2=\"9\" y2=\"23\"/><line x1=\"15\" y1=\"20\" x2=\"15\" y2=\"23\"/><line x1=\"20\" y1=\"9\" x2=\"23\" y2=\"9\"/><line x1=\"20\" y1=\"14\" x2=\"23\" y2=\"14\"/><line x1=\"1\" y1=\"9\" x2=\"4\" y2=\"9\"/><line x1=\"1\" y1=\"14\" x2=\"4\" y2=\"14\"/>";
            case 313: return "<ellipse cx=\"12\" cy=\"5\" rx=\"9\" ry=\"3\"/><path d=\"M21 12c0 1.66-4 3-9 3s-9-1.34-9-3\"/><path d=\"M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5\"/>";
            case 314: return "<rect x=\"2\" y=\"2\" width=\"20\" height=\"8\" rx=\"2\" ry=\"2\"/><rect x=\"2\" y=\"14\" width=\"20\" height=\"8\" rx=\"2\" ry=\"2\"/><line x1=\"6\" y1=\"6\" x2=\"6.01\" y2=\"6\"/><line x1=\"6\" y1=\"18\" x2=\"6.01\" y2=\"18\"/>";
            case 315: return "<path d=\"M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z\"/>";
            case 316: return "<line x1=\"16\" y1=\"13\" x2=\"16\" y2=\"21\"/><line x1=\"8\" y1=\"13\" x2=\"8\" y2=\"21\"/><line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"23\"/><path d=\"M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25\"/>";
            case 317: return "<path d=\"M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25\"/><line x1=\"8\" y1=\"16\" x2=\"8.01\" y2=\"16\"/><line x1=\"8\" y1=\"20\" x2=\"8.01\" y2=\"20\"/><line x1=\"12\" y1=\"18\" x2=\"12.01\" y2=\"18\"/><line x1=\"12\" y1=\"22\" x2=\"12.01\" y2=\"22\"/><line x1=\"16\" y1=\"16\" x2=\"16.01\" y2=\"16\"/><line x1=\"16\" y1=\"20\" x2=\"16.01\" y2=\"20\"/>";
            case 318: return "<line x1=\"6\" y1=\"3\" x2=\"6\" y2=\"15\"/><circle cx=\"18\" cy=\"6\" r=\"3\"/><circle cx=\"6\" cy=\"18\" r=\"3\"/><path d=\"M18 9a9 9 0 0 1-9 9\"/>";
            case 319: return "<circle cx=\"12\" cy=\"12\" r=\"4\"/><line x1=\"1.05\" y1=\"12\" x2=\"7\" y2=\"12\"/><line x1=\"17.01\" y1=\"12\" x2=\"22.96\" y2=\"12\"/>";
            case 320: return "<circle cx=\"18\" cy=\"18\" r=\"3\"/><circle cx=\"6\" cy=\"6\" r=\"3\"/><path d=\"M13 6h3a2 2 0 0 1 2 2v7\"/><line x1=\"6\" y1=\"9\" x2=\"6\" y2=\"21\"/>";
            case 321: return "<circle cx=\"18\" cy=\"18\" r=\"3\"/><circle cx=\"6\" cy=\"6\" r=\"3\"/><path d=\"M6 21V9a9 9 0 0 0 9 9\"/>";
            case 322: return "<rect x=\"8\" y=\"6\" width=\"8\" height=\"14\" rx=\"4\"/><path d=\"M19 7l-3 2\"/><path d=\"M5 7l3 2\"/><path d=\"M19 19l-3-2\"/><path d=\"M5 19l3-2\"/><line x1=\"20\" y1=\"13\" x2=\"4\" y2=\"13\"/>";
            case 323: return "<path d=\"M5 12.55a11 11 0 0 1 14.08 0\"/><path d=\"M1.42 9a16 16 0 0 1 21.16 0\"/><path d=\"M8.53 16.11a6 6 0 0 1 6.95 0\"/><line x1=\"12\" y1=\"20\" x2=\"12.01\" y2=\"20\"/>";
            case 324: return "<line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"/><path d=\"M16.72 11.06A10.94 10.94 0 0 1 19 12.55\"/><path d=\"M5 12.55a10.94 10.94 0 0 1 5.17-2.39\"/><path d=\"M10.71 5.05A16 16 0 0 1 22.58 9\"/><path d=\"M1.42 9a15.91 15.91 0 0 1 4.7-2.88\"/><path d=\"M8.53 16.11a6 6 0 0 1 6.95 0\"/><line x1=\"12\" y1=\"20\" x2=\"12.01\" y2=\"20\"/>";
            case 325: return "<polyline points=\"6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5\"/>";
            case 326: return "<rect x=\"1\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\"/><line x1=\"23\" y1=\"10\" x2=\"23\" y2=\"14\"/>";
            case 327: return "<path d=\"M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19\"/><line x1=\"23\" y1=\"13\" x2=\"23\" y2=\"11\"/><polyline points=\"11 6 7 12 13 12 9 18\"/>";
            case 328: return "<path d=\"M12 22v-5\"/><path d=\"M9 8V2\"/><path d=\"M15 2v6\"/><path d=\"M18 8v5a6 6 0 0 1-12 0V8z\"/>";
            case 329: return "<circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"/><path d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\"/>";
            case 330: return "<rect x=\"2\" y=\"3\" width=\"20\" height=\"14\" rx=\"2\"/><line x1=\"8\" y1=\"21\" x2=\"16\" y2=\"21\"/><line x1=\"12\" y1=\"17\" x2=\"12\" y2=\"21\"/>";
            case 331: return "<rect x=\"5\" y=\"2\" width=\"14\" height=\"20\" rx=\"2\" ry=\"2\"/><line x1=\"12\" y1=\"18\" x2=\"12.01\" y2=\"18\"/>";
            case 332: return "<rect x=\"4\" y=\"2\" width=\"16\" height=\"20\" rx=\"2\"/><line x1=\"12\" y1=\"18\" x2=\"12.01\" y2=\"18\"/>";
            case 333: return "<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\"/><line x1=\"6\" y1=\"8\" x2=\"6.01\" y2=\"8\"/><line x1=\"10\" y1=\"8\" x2=\"10.01\" y2=\"8\"/><line x1=\"14\" y1=\"8\" x2=\"14.01\" y2=\"8\"/><line x1=\"18\" y1=\"8\" x2=\"18.01\" y2=\"8\"/><line x1=\"6\" y1=\"12\" x2=\"6.01\" y2=\"12\"/><line x1=\"18\" y1=\"12\" x2=\"18.01\" y2=\"12\"/><line x1=\"10\" y1=\"12\" x2=\"14\" y2=\"12\"/><line x1=\"8\" y1=\"16\" x2=\"16\" y2=\"16\"/>";
            case 334: return "<rect x=\"6\" y=\"3\" width=\"12\" height=\"18\" rx=\"6\"/><line x1=\"12\" y1=\"7\" x2=\"12\" y2=\"11\"/>";
            case 335: return "<polyline points=\"6 9 6 2 18 2 18 9\"/><path d=\"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2\"/><rect x=\"6\" y=\"14\" width=\"12\" height=\"8\"/>";
            case 336: return "<line x1=\"22\" y1=\"12\" x2=\"2\" y2=\"12\"/><path d=\"M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z\"/><line x1=\"6\" y1=\"16\" x2=\"6.01\" y2=\"16\"/><line x1=\"10\" y1=\"16\" x2=\"10.01\" y2=\"16\"/>";
            case 337: return "<rect x=\"4\" y=\"10\" width=\"16\" height=\"10\" rx=\"2\"/><line x1=\"8\" y1=\"10\" x2=\"8\" y2=\"4\"/><line x1=\"16\" y1=\"10\" x2=\"16\" y2=\"4\"/><line x1=\"8\" y1=\"4\" x2=\"16\" y2=\"4\"/><line x1=\"10\" y1=\"6\" x2=\"10\" y2=\"8\"/><line x1=\"14\" y1=\"6\" x2=\"14\" y2=\"8\"/>";
            case 338: return "<rect x=\"3\" y=\"3\" width=\"7\" height=\"7\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\"/><line x1=\"7\" y1=\"7\" x2=\"7.01\" y2=\"7\"/><line x1=\"17\" y1=\"7\" x2=\"17.01\" y2=\"7\"/><line x1=\"7\" y1=\"17\" x2=\"7.01\" y2=\"17\"/>";
            case 339: return "<line x1=\"3\" y1=\"5\" x2=\"3\" y2=\"19\"/><line x1=\"6\" y1=\"5\" x2=\"6\" y2=\"19\"/><line x1=\"10\" y1=\"5\" x2=\"10\" y2=\"19\"/><line x1=\"13\" y1=\"5\" x2=\"13\" y2=\"19\"/><line x1=\"17\" y1=\"5\" x2=\"17\" y2=\"19\"/><line x1=\"21\" y1=\"5\" x2=\"21\" y2=\"19\"/>";
            case 340: return "<rect x=\"1\" y=\"4\" width=\"22\" height=\"16\" rx=\"2\" ry=\"2\"/><line x1=\"1\" y1=\"10\" x2=\"23\" y2=\"10\"/>";
            case 341: return "<path d=\"M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4\"/><path d=\"M4 6v12a2 2 0 0 0 2 2h14v-4\"/><circle cx=\"18\" cy=\"14\" r=\"1\"/>";
            case 342: return "<circle cx=\"9\" cy=\"21\" r=\"1\"/><circle cx=\"20\" cy=\"21\" r=\"1\"/><path d=\"M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6\"/>";
            case 343: return "<path d=\"M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z\"/><line x1=\"3\" y1=\"6\" x2=\"21\" y2=\"6\"/><path d=\"M16 10a4 4 0 0 1-8 0\"/>";
            case 344: return "<line x1=\"12\" y1=\"1\" x2=\"12\" y2=\"23\"/><path d=\"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\"/>";
            case 345: return "<path d=\"M4 10h12M4 14h9m6.4-5.6a9 9 0 1 0 0 7.2\"/>";
            case 346: return "<path d=\"M18 7c0-5.333-8-5.333-8 0v10h8m-8-5h6M6 21h12\"/>";
            case 347: return "<path d=\"M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.05l1.04-5.9 5.86 1.034m-1.04 5.9-1.04 5.9m2.08-11.8L12.76 1.35M6.9 12.15l5.86 1.035m0 0c4.924.869 3.708-6.025-1.216-6.894L5.684 5.257l1.04-5.9 5.86 1.035m0 0 1.04-5.9\"/>";
            case 348: return "<ellipse cx=\"8\" cy=\"8\" rx=\"6\" ry=\"3\"/><path d=\"M2 8v4c0 1.66 2.69 3 6 3s6-1.34 6-3V8\"/><path d=\"M2 12v4c0 1.66 2.69 3 6 3s6-1.34 6-3v-4\"/><ellipse cx=\"16\" cy=\"16\" rx=\"6\" ry=\"3\"/><path d=\"M10 16v4c0 1.66 2.69 3 6 3s6-1.34 6-3v-4\"/>";
            case 349: return "<path d=\"M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z\"/><line x1=\"8\" y1=\"7\" x2=\"16\" y2=\"7\"/><line x1=\"8\" y1=\"11\" x2=\"16\" y2=\"11\"/><line x1=\"8\" y1=\"15\" x2=\"12\" y2=\"15\"/>";
            case 350: return "<line x1=\"19\" y1=\"5\" x2=\"5\" y2=\"19\"/><circle cx=\"6.5\" cy=\"6.5\" r=\"2.5\"/><circle cx=\"17.5\" cy=\"17.5\" r=\"2.5\"/>";
            case 351: return "<rect x=\"4\" y=\"2\" width=\"16\" height=\"20\" rx=\"2\"/><line x1=\"8\" y1=\"6\" x2=\"16\" y2=\"6\"/><line x1=\"16\" y1=\"14\" x2=\"16\" y2=\"18\"/><path d=\"M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01\"/>";
            case 352: return "<polyline points=\"23 6 13.5 15.5 8.5 10.5 1 18\"/><polyline points=\"17 6 23 6 23 12\"/>";
            case 353: return "<polyline points=\"23 18 13.5 8.5 8.5 13.5 1 6\"/><polyline points=\"17 18 23 18 23 12\"/>";
            case 354: return "<polyline points=\"22 12 18 12 15 21 9 3 6 12 2 12\"/>";
            case 355: return "<path d=\"M21.21 15.89A10 10 0 1 1 8 2.83\"/><path d=\"M22 12A10 10 0 0 0 12 2v10z\"/>";
            case 356: return "<line x1=\"12\" y1=\"20\" x2=\"12\" y2=\"10\"/><line x1=\"18\" y1=\"20\" x2=\"18\" y2=\"4\"/><line x1=\"6\" y1=\"20\" x2=\"6\" y2=\"16\"/>";
            case 357: return "<line x1=\"3\" y1=\"21\" x2=\"21\" y2=\"21\"/><line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\"/><polyline points=\"12 3 2 10 22 10 12 3\"/><line x1=\"6\" y1=\"10\" x2=\"6\" y2=\"21\"/><line x1=\"10\" y1=\"10\" x2=\"10\" y2=\"21\"/><line x1=\"14\" y1=\"10\" x2=\"14\" y2=\"21\"/><line x1=\"18\" y1=\"10\" x2=\"18\" y2=\"21\"/>";
            case 358: return "<path d=\"M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.5-1 2-2V7a2 2 0 0 0-2-2z\"/><path d=\"M16 11h.01\"/>";
            case 359: return "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 8v8m-4-4h8\"/>";
            case 360: return "<rect x=\"4\" y=\"2\" width=\"16\" height=\"20\" rx=\"2\"/><line x1=\"8\" y1=\"6\" x2=\"16\" y2=\"6\"/><line x1=\"8\" y1=\"10\" x2=\"12\" y2=\"10\"/><line x1=\"8\" y1=\"14\" x2=\"16\" y2=\"14\"/><line x1=\"8\" y1=\"18\" x2=\"14\" y2=\"18\"/>";
            case 361: return "<path d=\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"/><polyline points=\"3.27 6.96 12 12.01 20.73 6.96\"/><line x1=\"12\" y1=\"22.08\" x2=\"12\" y2=\"12\"/>";
            case 362: return "<rect x=\"1\" y=\"3\" width=\"15\" height=\"13\"/><polygon points=\"16 8 20 8 23 11 23 16 16 16 16 8\"/><circle cx=\"5.5\" cy=\"18.5\" r=\"2.5\"/><circle cx=\"18.5\" cy=\"18.5\" r=\"2.5\"/>";
            case 363: return "<polyline points=\"20 12 20 22 4 22 4 12\"/><rect x=\"2\" y=\"7\" width=\"20\" height=\"5\"/><line x1=\"12\" y1=\"22\" x2=\"12\" y2=\"7\"/><path d=\"M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z\"/><path d=\"M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z\"/>";
            case 364: return "<circle cx=\"12\" cy=\"8\" r=\"7\"/><polyline points=\"8.21 13.89 7 23 12 20 17 23 15.79 13.88\"/>";
            case 365: return "<path d=\"M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5v-2z\"/>";
            case 366: return "<path d=\"M12 3v18m-8-7l4-9 4 9H4zm12 0l4-9 4 9h-8z\"/>";
            case 367: return "<rect x=\"2\" y=\"7\" width=\"20\" height=\"14\" rx=\"2\" ry=\"2\"/><path d=\"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\"/>";
            case 368: return "<circle cx=\"12\" cy=\"12\" r=\"10\"/><polygon points=\"16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76\"/>";
            case 369: return "<circle cx=\"12\" cy=\"5\" r=\"3\"/><line x1=\"12\" y1=\"22\" x2=\"12\" y2=\"8\"/><path d=\"M5 12H2a10 10 0 0 0 20 0h-3\"/>";
            case 370: return "<path d=\"M4.5 3v5a4.5 4.5 0 0 0 9 0V3M18 14v4a4 4 0 0 1-8 0v-6\"/><circle cx=\"18\" cy=\"12\" r=\"2\"/>";
            case 371: return "<path d=\"M10.5 20.5l10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z\"/><line x1=\"8.5\" y1=\"8.5\" x2=\"15.5\" y2=\"15.5\"/>";
            case 372: return "<path d=\"M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z\"/>";
            case 373: return "<path d=\"M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9\"/>";
            case 374: return "<rect x=\"1\" y=\"8\" width=\"15\" height=\"9\" rx=\"1\"/><path d=\"M16 11h4l3 3v3h-7v-6z\"/><circle cx=\"5.5\" cy=\"18.5\" r=\"2.5\"/><circle cx=\"18.5\" cy=\"18.5\" r=\"2.5\"/><line x1=\"8\" y1=\"11\" x2=\"8\" y2=\"15\"/><line x1=\"6\" y1=\"13\" x2=\"10\" y2=\"13\"/>";
            case 375: return "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"4\"/><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"16\"/><line x1=\"8\" y1=\"12\" x2=\"16\" y2=\"12\"/>";
            case 376: return "<path d=\"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z\"/><path d=\"M3.22 12H9.5l1.5-3 2 6.5 1.5-3.5h6.28\"/>";
            case 377: return "<path d=\"M2 15c6.667-6 13.333 0 20-6M2 9c6.667 6 13.333 0 20 6m-5-3h.01M7 12h.01M12 9h.01M12 15h.01\"/>";
            case 378: return "<path d=\"m18 2 4 4-2 2-4-4 2-2zM15 5l4 4-8 8H7v-4l8-8zM5 19l-3 3\"/>";
            case 379: return "<path d=\"M6 18h8M3 22h18M14 22a7 7 0 1 0-7-7M9 9l3-3 5 5-3 3-5-5zM12 6l-2-2\"/>";
            case 380: return "<path d=\"M12 4v8m-4-6c-3 0-6 3-6 7 0 5 3 7 6 7s4-2 4-5V9zm8 0c3 0 6 3 6 7 0 5-3 7-6 7s-4-2-4-5V9z\"/>";
            case 381: return "<path d=\"M9.5 4a3.5 3.5 0 0 0-3.5 3.5c0 .4.1.8.2 1.2A3.5 3.5 0 0 0 4 12a3.5 3.5 0 0 0 2.2 3.3A3.5 3.5 0 0 0 9.5 20H12V4H9.5zm5 0a3.5 3.5 0 0 1 3.5 3.5c0 .4-.1.8-.2 1.2A3.5 3.5 0 0 1 20 12a3.5 3.5 0 0 1-2.2 3.3A3.5 3.5 0 0 1 14.5 20H12V4h2.5z\"/>";
            case 382: return "<path d=\"M17 4a3 3 0 0 1 3 3 3 3 0 0 1-2.2 2.9L7.9 19.8A3 3 0 1 1 4 17a3 3 0 0 1 2.9-2.2L16.8 4.9A3 3 0 0 1 17 4z\"/>";
            case 383: return "<path d=\"M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z\"/>";
            case 384: return "<rect x=\"2\" y=\"6\" width=\"20\" height=\"16\" rx=\"2\"/><path d=\"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"/><line x1=\"12\" y1=\"11\" x2=\"12\" y2=\"17\"/><line x1=\"9\" y1=\"14\" x2=\"15\" y2=\"14\"/>";
            case 385: return "<path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\"/><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"12\"/><line x1=\"12\" y1=\"16\" x2=\"12.01\" y2=\"16\"/>";
            case 386: return "<path d=\"M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z\"/>";
            case 387: return "<path d=\"M10 2v5.5l-6.5 11a2 2 0 0 0 1.7 3h13.6a2 2 0 0 0 1.7-3L14 7.5V2h-4z\"/><line x1=\"8.5\" y1=\"14\" x2=\"15.5\" y2=\"14\"/>";
            case 388: return "<path d=\"M14.5 2v17.5a4.5 4.5 0 0 1-9 0V2h9zM8 8h4\"/>";
            case 389: return "<circle cx=\"12\" cy=\"12\" r=\"2\"/><ellipse cx=\"12\" cy=\"12\" rx=\"9\" ry=\"4\" transform=\"rotate(45 12 12)\"/><ellipse cx=\"12\" cy=\"12\" rx=\"9\" ry=\"4\" transform=\"rotate(-45 12 12)\"/>";
            case 390: return "<path d=\"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z\"/>";
            case 391: return "<rect x=\"3\" y=\"7\" width=\"18\" height=\"10\" rx=\"3\" transform=\"rotate(45 12 12)\"/><circle cx=\"12\" cy=\"12\" r=\"1.5\"/>";
            case 392: return "<circle cx=\"12\" cy=\"12\" r=\"5\"/><path d=\"M12 2v3m0 14v3M2 12h3m14 0h3M4.9 4.9l2.1 2.1m10 10 2.1 2.1M4.9 19.1l2.1-2.1m10-10 2.1-2.1\"/>";
            case 393: return "<path d=\"m14 7 3 3-8 8H6v-3l8-8zM18 3l3 3-1.5 1.5-3-3L18 3zM2 22h4\"/>";
            case 394: return "<circle cx=\"9\" cy=\"4\" r=\"2\"/><path d=\"M12 8H8v7h4m3-3a5 5 0 1 1-5 5\"/>";
            case 395: return "<path d=\"M6 3c-2 0-3 2-3 4 0 5 2 13 4 13s2-6 3-8c1 2 1 8 3 8s4-8 4-13c0-2-1-4-3-4-2 0-3 2-4 2s-2-2-4-2z\"/>";
            case 396: return "<path d=\"M4 3h6a4 4 0 0 1 4 4 4 4 0 0 1-4 4H4V3zm6 8 5 8m0-4 4 4\"/>";
            case 397: return "<path d=\"m19 5-3-3-9 9 3 3 9-9zM7 14l-5 5h5l2-2\"/>";
            case 398: return "<path d=\"M12 3c-4 0-7 4-7 9 0 4 2 8 7 8s7-4 7-8c0-5-3-9-7-9zm0 13a3 3 0 1 1 0-6 3 3 0 0 1 0 6z\"/>";
            case 399: return "<path d=\"M5 3h14M8 7h8m-4 0v14M8 12h8\"/>";
            case 400: return "<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"/>";
            case 401: return "<path d=\"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z\"/><polyline points=\"22,6 12,13 2,6\"/>";
            case 402: return "<path d=\"M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6z\"/><path d=\"m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10\"/>";
            case 403: return "<line x1=\"22\" y1=\"2\" x2=\"11\" y2=\"13\"/><polygon points=\"22 2 15 22 11 13 2 9 22 2\"/>";
            case 404: return "<rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"/><line x1=\"16\" y1=\"2\" x2=\"16\" y2=\"6\"/><line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"6\"/><line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\"/>";
            case 405: return "<circle cx=\"12\" cy=\"12\" r=\"10\"/><polyline points=\"12 6 12 12 16 14\"/>";
            case 406: return "<path d=\"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z\"/><circle cx=\"12\" cy=\"10\" r=\"3\"/>";
            case 407: return "<polygon points=\"1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6\"/><line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"18\"/><line x1=\"16\" y1=\"6\" x2=\"16\" y2=\"22\"/>";
            case 408: return "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"/><polyline points=\"15 2 22 2 22 9\"/><line x1=\"22\" y1=\"2\" x2=\"15\" y2=\"9\"/>";
            case 409: return "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"/><polyline points=\"18 2 22 6 18 10\"/><line x1=\"14\" y1=\"6\" x2=\"22\" y2=\"6\"/>";
            case 410: return "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"/><line x1=\"23\" y1=\"1\" x2=\"17\" y2=\"7\"/><line x1=\"17\" y1=\"1\" x2=\"23\" y2=\"7\"/>";
            case 411: return "<polygon points=\"23 7 16 12 23 17 23 7\"/><rect x=\"1\" y=\"5\" width=\"15\" height=\"14\" rx=\"2\" ry=\"2\"/>";
            case 412: return "<path d=\"M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z\"/><path d=\"M19 10v2a7 7 0 0 1-14 0v-2\"/><line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"23\"/><line x1=\"8\" y1=\"23\" x2=\"16\" y2=\"23\"/>";
            case 413: return "<line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"/><path d=\"M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6\"/><path d=\"M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23\"/><line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"23\"/><line x1=\"8\" y1=\"23\" x2=\"16\" y2=\"23\"/>";
            case 414: return "<polygon points=\"11 5 6 9 2 9 2 15 6 15 11 19 11 5\"/><path d=\"M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07\"/>";
            case 415: return "<polygon points=\"11 5 6 9 2 9 2 15 6 15 11 19 11 5\"/><line x1=\"23\" y1=\"9\" x2=\"17\" y2=\"15\"/><line x1=\"17\" y1=\"9\" x2=\"23\" y2=\"15\"/>";
            case 416: return "<polygon points=\"11 5 6 9 2 9 2 15 6 15 11 19 11 5\"/><path d=\"M15.54 8.46a5 5 0 0 1 0 7.07\"/>";
            case 417: return "<polygon points=\"5 3 19 12 5 21 5 3\"/>";
            case 418: return "<rect x=\"6\" y=\"4\" width=\"4\" height=\"16\"/><rect x=\"14\" y=\"4\" width=\"4\" height=\"16\"/>";
            case 419: return "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\"/>";
            case 420: return "<polygon points=\"5 4 15 12 5 20 5 4\"/><line x1=\"19\" y1=\"5\" x2=\"19\" y2=\"19\"/>";
            case 421: return "<polygon points=\"19 20 9 12 19 4 19 20\"/><line x1=\"5\" y1=\"19\" x2=\"5\" y2=\"5\"/>";
            case 422: return "<polyline points=\"16 3 21 3 21 8\"/><line x1=\"4\" y1=\"20\" x2=\"21\" y2=\"3\"/><polyline points=\"21 16 21 21 16 21\"/><line x1=\"15\" y1=\"15\" x2=\"21\" y2=\"21\"/><line x1=\"4\" y1=\"4\" x2=\"9\" y2=\"9\"/>";
            case 423: return "<polyline points=\"17 1 21 5 17 9\"/><path d=\"M3 11V9a4 4 0 0 1 4-4h14\"/><polyline points=\"7 23 3 19 7 15\"/><path d=\"M21 13v2a4 4 0 0 1-4 4H3\"/>";
            case 424: return "<circle cx=\"12\" cy=\"12\" r=\"2\"/><path d=\"M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14\"/>";
            case 425: return "<circle cx=\"12\" cy=\"11\" r=\"1\"/><path d=\"M11 17a1 1 0 0 1 2 0c0 .5-.34 3-.5 4.5a.5.5 0 0 1-1 0c-.16-1.5-.5-4-.5-4.5z\"/><path d=\"M8 14a5 5 0 1 1 8 0M5 11a9 9 0 1 1 14 0\"/>";
            case 426: return "<path d=\"M3 11l18-5v12L3 13v-2zM11.6 16.8a3 3 0 1 1-5.8-1.6\"/>";
            case 427: return "<path d=\"M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16\"/><circle cx=\"5\" cy=\"19\" r=\"1\"/>";
            case 428: return "<path d=\"M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z\"/>";
            case 429: return "<path d=\"M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3\"/>";
            case 430: return "<circle cx=\"12\" cy=\"12\" r=\"5\"/><line x1=\"12\" y1=\"1\" x2=\"12\" y2=\"3\"/><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"23\"/><line x1=\"4.22\" y1=\"4.22\" x2=\"5.64\" y2=\"5.64\"/><line x1=\"18.36\" y1=\"18.36\" x2=\"19.78\" y2=\"19.78\"/><line x1=\"1\" y1=\"12\" x2=\"3\" y2=\"12\"/><line x1=\"21\" y1=\"12\" x2=\"23\" y2=\"12\"/><line x1=\"4.22\" y1=\"19.78\" x2=\"5.64\" y2=\"18.36\"/><line x1=\"18.36\" y1=\"5.64\" x2=\"19.78\" y2=\"4.22\"/>";
            case 431: return "<path d=\"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z\"/>";
            case 432: return "<path d=\"M12 2v2m-7.07 2.93 1.41 1.41M2 12h2m2.93 7.07 1.41-1.41\"/><path d=\"M17 12a5 5 0 0 0-5-5c-.75 0-1.47.16-2.11.46A6 6 0 0 0 3 13a6 6 0 0 0 6 6h8a5 5 0 0 0 0-10z\"/>";
            case 433: return "<path d=\"M12 2v6m-7.07.93 1.41 1.41M2 16h2m16 0h2m-4.34-5.66 1.41-1.41M18 16a6 6 0 0 0-12 0\"/><line x1=\"2\" y1=\"20\" x2=\"22\" y2=\"20\"/>";
            case 434: return "<path d=\"M12 10v6m-7.07-7.07 1.41 1.41M2 18h2m16 0h2m-4.34-5.66 1.41-1.41M18 18a6 6 0 0 0-12 0\"/><line x1=\"2\" y1=\"22\" x2=\"22\" y2=\"22\"/>";
            case 435: return "<path d=\"M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2\"/>";
            case 436: return "<path d=\"M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7\"/>";
            case 437: return "<line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"22\"/><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"/><line x1=\"4.93\" y1=\"4.93\" x2=\"19.07\" y2=\"19.07\"/><line x1=\"19.07\" y1=\"4.93\" x2=\"4.93\" y2=\"19.07\"/>";
            case 438: return "<polygon points=\"13 2 3 14 12 14 11 22 21 10 12 10 13 2\"/>";
            case 439: return "<path d=\"M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z\"/><path d=\"M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a7 7 0 0 1-10.45 6.07\"/>";
            case 440: return "<path d=\"M22 17a10 10 0 0 0-20 0m16 0a6 6 0 0 0-12 0m8 0a2 2 0 0 0-4 0\"/>";
            case 441: return "<path d=\"M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z\"/><path d=\"M4 10h4M4 6h4M4 14h4\"/>";
            case 442: return "<polygon points=\"12 2 7 9 10 9 5 16 19 16 14 9 17 9 12 2\"/><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"22\"/>";
            case 443: return "<path d=\"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z\"/><path d=\"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12\"/>";
            case 444: return "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5z\"/>";
            case 445: return "<path d=\"m8 3 4 8 5-5 5 15H2L8 3z\"/>";
            case 446: return "<path d=\"M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1\"/>";
            case 447: return "<path d=\"M12 2c1 3 4 6 4 9a4 4 0 0 1-8 0c0-3 3-6 4-9z\"/><line x1=\"4\" y1=\"21\" x2=\"20\" y2=\"17\"/><line x1=\"4\" y1=\"17\" x2=\"20\" y2=\"21\"/>";
            case 448: return "<path d=\"M21 4H3m15 4H6m10 4H8m6 4h-4m3 4h-2\"/>";
            case 449: return "<circle cx=\"12\" cy=\"12\" r=\"10\"/><circle cx=\"12\" cy=\"12\" r=\"6\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/>";
            case 450: return "<path d=\"m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z\"/>";
            case 451: return "<path d=\"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z\"/><path d=\"M19 3v4m2-2h-4\"/>";
            case 452: return "<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m14.14-14.14-1.41 1.41\"/>";
            case 453: return "<path d=\"M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.2\"/><line x1=\"2\" y1=\"20\" x2=\"22\" y2=\"20\"/><line x1=\"4\" y1=\"17\" x2=\"20\" y2=\"17\"/>";
            case 454: return "<path d=\"M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9\"/><polyline points=\"13 11 9 17 15 17 11 23\"/>";
            case 455: return "<path d=\"M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z\"/><path d=\"M20 9l-4 4m0-4l4 4\"/>";
            case 456: return "<path d=\"M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z\"/><line x1=\"16\" y1=\"8\" x2=\"2\" y2=\"22\"/><line x1=\"17.5\" y1=\"15\" x2=\"9\" y2=\"15\"/>";
            case 457: return "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20zM2 12h20\"/>";
            case 458: return "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M3.6 9h16.8M3.6 15h16.8\"/>";
            case 459: return "<path d=\"M19 21 12 4 5 21M5 21h14M12 4v17\"/>";
            case 460: return "<path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\"/><polyline points=\"9 12 11 14 15 10\"/>";
            case 461: return "<path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\"/><line x1=\"15\" y1=\"9\" x2=\"9\" y2=\"15\"/><line x1=\"9\" y1=\"9\" x2=\"15\" y2=\"15\"/>";
            case 462: return "<path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\"/><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"12\"/><line x1=\"12\" y1=\"16\" x2=\"12.01\" y2=\"16\"/>";
            case 463: return "<path d=\"M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4M14 13.12c0 2.38 0 6.38-1 8.88M2 12h1a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h.5M20 12h-1a2 2 0 0 0-2 2v2a2 2 0 0 1-2 2h-.5M8 6a6 6 0 0 1 8 0c0 1.5-.5 3-1.5 4.5M6 10a8 8 0 0 1 12 0c0 2-1 4-2 6\"/>";
            case 464: return "<path d=\"M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2\"/>";
            case 465: return "<circle cx=\"7.5\" cy=\"15.5\" r=\"5.5\"/><path d=\"m21 2-9.6 9.6M15.5 7.5l3 3M18.5 4.5l3 3\"/>";
            case 466: return "<rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"/><circle cx=\"12\" cy=\"16.5\" r=\"1.5\"/>";
            case 467: return "<path d=\"M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"/><circle cx=\"8.5\" cy=\"7\" r=\"4\"/><polyline points=\"17 11 19 13 23 9\"/>";
            case 468: return "<path d=\"M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"/><circle cx=\"8.5\" cy=\"7\" r=\"4\"/><line x1=\"18\" y1=\"8\" x2=\"23\" y2=\"13\"/><line x1=\"23\" y1=\"8\" x2=\"18\" y2=\"13\"/>";
            case 469: return "<path d=\"M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"/><circle cx=\"8.5\" cy=\"7\" r=\"4\"/><line x1=\"20\" y1=\"8\" x2=\"20\" y2=\"14\"/><line x1=\"23\" y1=\"11\" x2=\"17\" y2=\"11\"/>";
            case 470: return "<path d=\"M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"/><circle cx=\"8.5\" cy=\"7\" r=\"4\"/><line x1=\"23\" y1=\"11\" x2=\"17\" y2=\"11\"/>";
            case 471: return "<line x1=\"4\" y1=\"21\" x2=\"4\" y2=\"14\"/><line x1=\"4\" y1=\"10\" x2=\"4\" y2=\"3\"/><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"12\"/><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"3\"/><line x1=\"20\" y1=\"21\" x2=\"20\" y2=\"16\"/><line x1=\"20\" y1=\"12\" x2=\"20\" y2=\"3\"/><line x1=\"1\" y1=\"14\" x2=\"7\" y2=\"14\"/><line x1=\"9\" y1=\"8\" x2=\"15\" y2=\"8\"/><line x1=\"17\" y1=\"16\" x2=\"23\" y2=\"16\"/>";
            case 472: return "<rect x=\"1\" y=\"5\" width=\"22\" height=\"14\" rx=\"7\" ry=\"7\"/><circle cx=\"8\" cy=\"12\" r=\"3\"/>";
            case 473: return "<rect x=\"1\" y=\"5\" width=\"22\" height=\"14\" rx=\"7\" ry=\"7\"/><circle cx=\"16\" cy=\"12\" r=\"3\"/>";
            case 474: return "<path d=\"M12 14v4m0-4l3-3\"/><path d=\"M3.34 19a10 10 0 1 1 17.32 0\"/>";
            case 475: return "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\"/><line x1=\"12\" y1=\"17\" x2=\"12.01\" y2=\"17\"/>";
            case 476: return "<circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"12\"/><line x1=\"12\" y1=\"8\" x2=\"12.01\" y2=\"8\"/>";
            case 477: return "<path d=\"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z\"/><line x1=\"12\" y1=\"9\" x2=\"12\" y2=\"13\"/><line x1=\"12\" y1=\"17\" x2=\"12.01\" y2=\"17\"/>";
            case 478: return "<circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"12\"/><line x1=\"12\" y1=\"16\" x2=\"12.01\" y2=\"16\"/>";
            case 479: return "<polygon points=\"7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2\"/><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"12\"/><line x1=\"12\" y1=\"16\" x2=\"12.01\" y2=\"16\"/>";
            case 480: return "<path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/>";
            case 481: return "<circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"15\" y1=\"9\" x2=\"9\" y2=\"15\"/><line x1=\"9\" y1=\"9\" x2=\"15\" y2=\"15\"/>";
            case 482: return "<circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"4.93\" y1=\"4.93\" x2=\"19.07\" y2=\"19.07\"/>";
            case 483: return "<path d=\"M4.9 16.1 12 2l7.1 14.1\"/><path d=\"M7.5 11h9\"/><path d=\"M12 2v20\"/><path d=\"m8 22 4-6 4 6\"/>";
            case 484: return "<path d=\"M18.36 6.64a9 9 0 1 1-12.73 0\"/><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"12\"/>";
            case 485: return "<path d=\"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4\"/><polyline points=\"10 17 15 12 10 7\"/><line x1=\"15\" y1=\"12\" x2=\"3\" y2=\"12\"/>";
            case 486: return "<path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\"/><polyline points=\"16 17 21 12 16 7\"/><line x1=\"21\" y1=\"12\" x2=\"9\" y2=\"12\"/>";
            case 487: return "<line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"6\"/><line x1=\"12\" y1=\"18\" x2=\"12\" y2=\"22\"/><line x1=\"4.93\" y1=\"4.93\" x2=\"7.76\" y2=\"7.76\"/><line x1=\"16.24\" y1=\"16.24\" x2=\"19.07\" y2=\"19.07\"/><line x1=\"2\" y1=\"12\" x2=\"6\" y2=\"12\"/><line x1=\"18\" y1=\"12\" x2=\"22\" y2=\"12\"/><line x1=\"4.93\" y1=\"19.07\" x2=\"7.76\" y2=\"16.24\"/><line x1=\"16.24\" y1=\"7.76\" x2=\"19.07\" y2=\"4.93\"/>";
            case 488: return "<polyline points=\"4 14 10 14 10 20\"/><polyline points=\"20 10 14 10 14 4\"/><line x1=\"14\" y1=\"10\" x2=\"21\" y2=\"3\"/><line x1=\"3\" y1=\"21\" x2=\"10\" y2=\"14\"/>";
            case 489: return "<polyline points=\"5 9 2 12 5 15\"/><polyline points=\"9 5 12 2 15 5\"/><polyline points=\"15 19 12 22 9 19\"/><polyline points=\"19 9 22 12 19 15\"/><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"/><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"22\"/>";
            case 490: return "<path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\"/>";
            case 491: return "<path d=\"m15 12-8.5 8.5a2.12 2.12 0 0 1-3-3L12 9\"/><path d=\"M17.64 4.36 21 7.72M14 6l3-3 5 5-3 3-5-5z\"/>";
            case 492: return "<path d=\"m14 10 7-7 1 1-7 7z\"/><path d=\"m9 15 5-5-2-2-5 5v2h2zM3 21l3-3\"/>";
            case 493: return "<polygon points=\"12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/>";
            case 494: return "<path d=\"M21.3 8.7 8.7 21.3a1 1 0 0 1-1.4 0L2.7 16.7a1 1 0 0 1 0-1.4L15.3 2.7a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4z\"/><path d=\"m7.5 10.5 2 2m-4 2 2 2m6-6 2 2m2-2 2 2\"/>";
            case 495: return "<path d=\"M12 19l7-7 3 3-7 7-3-3z\"/><path d=\"M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z\"/><circle cx=\"11\" cy=\"11\" r=\"2\"/>";
            case 496: return "<path d=\"m9 11-6 6v3h3l6-6\"/><path d=\"m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L15 4a2 2 0 0 1 2.8 0l4.2 4.2a2 2 0 0 1 0 2.8z\"/>";
            case 497: return "<path d=\"M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48\"/>";
            case 498: return "<path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\"/><rect x=\"8\" y=\"2\" width=\"8\" height=\"4\" rx=\"1\" ry=\"1\"/>";
            case 499: return "<path d=\"M4 19.5A2.5 2.5 0 0 1 6.5 17H20\"/><path d=\"M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z\"/>";
            case 500: return "<path d=\"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z\"/><path d=\"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z\"/>";
            case 501: return "<path d=\"M22 10v6M2 10l10-5 10 5-10 5z\"/><path d=\"M6 12v5c3 3 9 3 12 0v-5\"/>";
            case 502: return "<path d=\"M18 8h1a4 4 0 0 1 0 8h-1\"/><path d=\"M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z\"/><line x1=\"6\" y1=\"1\" x2=\"6\" y2=\"4\"/><line x1=\"10\" y1=\"1\" x2=\"10\" y2=\"4\"/><line x1=\"14\" y1=\"1\" x2=\"14\" y2=\"4\"/>";
            case 503: return "<path d=\"M15.2 22H8.8a2 2 0 0 1-2-1.79L5 3h14l-1.8 17.21A2 2 0 0 1 15.2 22z\"/><line x1=\"6\" y1=\"12\" x2=\"18\" y2=\"12\"/>";
            case 504: return "<path d=\"m6.5 6.5 11 11M21 21l-1-1M3 3l1 1M18 22l4-4-3-3-4 4zM2 6l4-4 3 3-4 4z\"/>";
            case 505: return "<path d=\"M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2m12 6h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2M6 3h12v7a6 6 0 0 1-12 0V3z\"/><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"22\"/><line x1=\"8\" y1=\"22\" x2=\"16\" y2=\"22\"/>";
            case 506: return "<circle cx=\"12\" cy=\"12\" r=\"10\"/><circle cx=\"12\" cy=\"12\" r=\"6\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/><line x1=\"22\" y1=\"12\" x2=\"18\" y2=\"12\"/><line x1=\"6\" y1=\"12\" x2=\"2\" y2=\"12\"/><line x1=\"12\" y1=\"6\" x2=\"12\" y2=\"2\"/><line x1=\"12\" y1=\"22\" x2=\"12\" y2=\"18\"/>";
            case 507: return "<path d=\"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z\"/><path d=\"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z\"/><path d=\"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0\"/><path d=\"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5\"/>";
            case 508: return "<path d=\"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5\"/><path d=\"M9 18h6m-5 3h4\"/>";
            case 509: return "<path d=\"M19.439 7.85c0-1.571-.944-2.85-2.109-2.85H16V3.5C16 2.12 14.88 1 13.5 1S11 2.12 11 3.5V5H9.67C8.505 5 7.561 6.279 7.561 7.85c0 .762.223 1.458.597 1.99a3.5 3.5 0 0 1-.597 1.66H6a2 2 0 0 0-2 2v2.5H2.5C1.12 16 0 17.12 0 18.5S1.12 21 2.5 21H4v1.5a2 2 0 0 0 2 2h2.5v1.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V24.5H16a2 2 0 0 0 2-2v-2.5h1.439c1.165 0 2.109-1.279 2.109-2.85 0-.762-.223-1.458-.597-1.99.374-.532.597-1.228.597-1.99 0-.762-.223-1.458-.597-1.99.374-.532.597-1.228.597-1.99z\"/>";
            case 510: return "<polygon points=\"12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9 12 2\"/>";
            case 511: return "<circle cx=\"12\" cy=\"12\" r=\"10\"/><polygon points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\"/>";
            case 512: return "<path d=\"M6 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 24a3 3 0 1 0 0-6 3 3 0 0 0 0 6z\"/><line x1=\"8.12\" y1=\"5.88\" x2=\"16\" y2=\"12\"/><line x1=\"8.12\" y1=\"18.12\" x2=\"16\" y2=\"12\"/><line x1=\"16\" y1=\"12\" x2=\"22\" y2=\"12\"/><line x1=\"16\" y1=\"2\" x2=\"16\" y2=\"22\" stroke-dasharray=\"2 2\" stroke-width=\"1.5\"/>";
            case 513: return "<rect x=\"3\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\"/><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"22\"/><line x1=\"7\" y1=\"12\" x2=\"17\" y2=\"12\"/><circle cx=\"7\" cy=\"12\" r=\"1.5\" fill=\"currentColor\"/><circle cx=\"17\" cy=\"12\" r=\"1.5\" fill=\"currentColor\"/><rect x=\"10\" y=\"10\" width=\"4\" height=\"4\" rx=\"1\"/>";
            case 514: return "<path d=\"M19 6a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM19 23a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z\"/><line x1=\"16.8\" y1=\"5.5\" x2=\"11\" y2=\"12\"/><line x1=\"16.8\" y1=\"18.5\" x2=\"11\" y2=\"12\"/><polyline points=\"7 9 4 12 7 15\" stroke-width=\"2.2\"/><line x1=\"4\" y1=\"12\" x2=\"11\" y2=\"12\"/><line x1=\"19\" y1=\"1\" x2=\"19\" y2=\"23\" stroke-dasharray=\"2 2\" stroke-width=\"1.2\"/>";
            case 515: return "<path d=\"M4 4v16\"/><path d=\"M8 7l-4 5 4 5\"/><rect x=\"8\" y=\"7\" width=\"12\" height=\"10\" rx=\"1.5\" fill=\"currentColor\" fill-opacity=\"0.15\"/><line x1=\"20\" y1=\"4\" x2=\"20\" y2=\"20\" stroke-dasharray=\"2 2\"/>";
            case 516: return "<path d=\"M5 6a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM5 23a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z\"/><line x1=\"7.2\" y1=\"5.5\" x2=\"13\" y2=\"12\"/><line x1=\"7.2\" y1=\"18.5\" x2=\"13\" y2=\"12\"/><polyline points=\"17 9 20 12 17 15\" stroke-width=\"2.2\"/><line x1=\"13\" y1=\"12\" x2=\"20\" y2=\"12\"/><line x1=\"5\" y1=\"1\" x2=\"5\" y2=\"23\" stroke-dasharray=\"2 2\" stroke-width=\"1.2\"/>";
            case 517: return "<path d=\"M20 4v16\"/><path d=\"M16 7l4 5-4 5\"/><rect x=\"4\" y=\"7\" width=\"12\" height=\"10\" rx=\"1.5\" fill=\"currentColor\" fill-opacity=\"0.15\"/><line x1=\"4\" y1=\"4\" x2=\"4\" y2=\"20\" stroke-dasharray=\"2 2\"/>";
            case 518: return "<polyline points=\"3 6 5 6 21 6\"/><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"/><polyline points=\"10 11 8 13 10 15\"/><polyline points=\"14 11 16 13 14 15\"/><line x1=\"8\" y1=\"13\" x2=\"16\" y2=\"13\"/>";
            case 519: return "<line x1=\"3\" y1=\"4\" x2=\"3\" y2=\"20\"/><line x1=\"21\" y1=\"4\" x2=\"21\" y2=\"20\"/><polyline points=\"9 9 6 12 9 15\"/><polyline points=\"15 9 18 12 15 15\"/><line x1=\"6\" y1=\"12\" x2=\"18\" y2=\"12\"/><rect x=\"7\" y=\"6\" width=\"10\" height=\"12\" rx=\"1\" fill=\"currentColor\" fill-opacity=\"0.1\"/>";
            case 520: return "<rect x=\"6\" y=\"6\" width=\"12\" height=\"12\" rx=\"2\"/><polyline points=\"4 9 1 12 4 15\"/><polyline points=\"20 9 23 12 20 15\"/><line x1=\"1\" y1=\"12\" x2=\"6\" y2=\"12\"/><line x1=\"18\" y1=\"12\" x2=\"23\" y2=\"12\"/>";
            case 521: return "<path d=\"M6 3v7a6 6 0 0 0 12 0V3\"/><line x1=\"4\" y1=\"7\" x2=\"8\" y2=\"7\"/><line x1=\"16\" y1=\"7\" x2=\"20\" y2=\"7\"/><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"22\" stroke-dasharray=\"2 2\"/><polyline points=\"9 19 12 22 15 19\"/>";
            case 522: return "<polygon points=\"12 2 22 12 12 22 2 12 12 2\" fill=\"currentColor\" fill-opacity=\"0.2\" stroke=\"currentColor\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"2.5\" fill=\"currentColor\"/>";
            case 523: return "<path d=\"M3 18c4-1 6-12 11-12 3 0 4 8 7 8\"/><circle cx=\"3\" cy=\"18\" r=\"2\" fill=\"currentColor\"/><circle cx=\"14\" cy=\"6\" r=\"2\" fill=\"currentColor\"/><circle cx=\"21\" cy=\"14\" r=\"2\" fill=\"currentColor\"/><polyline points=\"17 4 21 4 21 8\"/>";
            case 524: return "<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\"/><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"16\"/><line x1=\"8\" y1=\"12\" x2=\"16\" y2=\"12\"/><line x1=\"9\" y1=\"9\" x2=\"15\" y2=\"15\"/><line x1=\"9\" y1=\"15\" x2=\"15\" y2=\"9\"/><circle cx=\"12\" cy=\"12\" r=\"1.5\" fill=\"currentColor\"/>";
            case 525: return "<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\"/><rect x=\"12\" y=\"11\" width=\"8\" height=\"7\" rx=\"1.5\" fill=\"currentColor\" fill-opacity=\"0.3\" stroke=\"currentColor\" stroke-width=\"1.8\"/>";
            case 526: return "<path d=\"M12 2l4 8-4 12-4-12 4-8z\"/><circle cx=\"12\" cy=\"10\" r=\"2\"/><circle cx=\"4\" cy=\"14\" r=\"1.5\"/><circle cx=\"20\" cy=\"14\" r=\"1.5\"/><path d=\"M4 14q8-3 16 0\" stroke-dasharray=\"2 2\"/>";
            case 527: return "<rect x=\"3\" y=\"3\" width=\"18\" height=\"8\" rx=\"2\"/><path d=\"M3 17a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2z\"/><path d=\"M7 18v-1\"/><path d=\"M10 19v-3\"/><path d=\"M13 18.5v-2\"/><path d=\"M17 19v-3\"/>";
            case 528: return "<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M4 18c6 0 8-12 16-12\" stroke-width=\"2\"/><path d=\"M4 6c6 0 8 12 16 12\" stroke-dasharray=\"2 2\"/>";
            case 529: return "<polygon points=\"11 19 2 12 11 5 11 19\"/><polygon points=\"22 19 13 12 22 5 22 19\"/><path d=\"M12 2a10 10 0 1 0 10 10\" stroke-dasharray=\"3 3\"/>";
            case 530: return "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\"/><polyline points=\"8 12 12 16 16 12\"/><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"16\"/><line x1=\"3\" y1=\"9\" x2=\"21\" y2=\"9\"/><line x1=\"7\" y1=\"5\" x2=\"7\" y2=\"9\"/><line x1=\"17\" y1=\"5\" x2=\"17\" y2=\"9\"/>";
            case 531: return "<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\"/><path d=\"M2 8h20\"/><path d=\"M2 16h20\"/><path d=\"M8 4v4\"/><path d=\"M16 4v4\"/><path d=\"M8 16v4\"/><path d=\"M16 16v4\"/><path d=\"M9 11l4 2.5-4 2.5v-5z\" fill=\"currentColor\"/>";
            case 532: return "<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\"/><path d=\"M6 10v4\"/><path d=\"M9 8v8\"/><path d=\"M12 6v12\"/><path d=\"M15 9v6\"/><path d=\"M18 11v2\"/>";
            case 533: return "<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\"/><path d=\"M7 8h10\"/><path d=\"M12 8v8\"/><path d=\"M10 16h4\"/>";
            case 534: return "<path d=\"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>";
            case 535: return "<path d=\"M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24\"/><line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"/>";
            case 536: return "<rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"/>";
            case 537: return "<rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 9.9-1\"/>";
            case 538: return "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"4\" fill=\"currentColor\" fill-opacity=\"0.2\"/><path d=\"M7 17V7l5 5 5-5v10\" stroke-width=\"2.4\"/>";
            case 539: return "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"4\" fill=\"currentColor\" fill-opacity=\"0.2\"/><path d=\"M16 8.5a3 3 0 0 0-3-2.5h-2a3 3 0 0 0 0 6h2a3 3 0 0 1 0 6h-2a3 3 0 0 1-3-2.5\" stroke-width=\"2.4\"/>";
            case 540: return "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"4\"/><circle cx=\"12\" cy=\"12\" r=\"5\" fill=\"#ef4444\" stroke=\"#f87171\" stroke-width=\"1.5\"/>";
            case 541: return "<line x1=\"17\" y1=\"10\" x2=\"3\" y2=\"10\"/><line x1=\"21\" y1=\"6\" x2=\"3\" y2=\"6\"/><line x1=\"21\" y1=\"14\" x2=\"3\" y2=\"14\"/><line x1=\"15\" y1=\"18\" x2=\"3\" y2=\"18\"/>";
            case 542: return "<line x1=\"18\" y1=\"10\" x2=\"6\" y2=\"10\"/><line x1=\"21\" y1=\"6\" x2=\"3\" y2=\"6\"/><line x1=\"21\" y1=\"14\" x2=\"3\" y2=\"14\"/><line x1=\"18\" y1=\"18\" x2=\"6\" y2=\"18\"/>";
            case 543: return "<line x1=\"21\" y1=\"10\" x2=\"7\" y2=\"10\"/><line x1=\"21\" y1=\"6\" x2=\"3\" y2=\"6\"/><line x1=\"21\" y1=\"14\" x2=\"3\" y2=\"14\"/><line x1=\"21\" y1=\"18\" x2=\"9\" y2=\"18\"/>";
            case 544: return "<path d=\"M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z\" stroke-dasharray=\"2 2\"/><rect x=\"4\" y=\"4\" width=\"14\" height=\"14\" rx=\"3\"/><path d=\"M8 8h6\"/><path d=\"M11 8v6\"/>";
            case 545: return "<circle cx=\"12\" cy=\"12\" r=\"10\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"8\"/><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"22\"/><line x1=\"2\" y1=\"12\" x2=\"8\" y2=\"12\"/><line x1=\"16\" y1=\"12\" x2=\"22\" y2=\"12\"/>";
            case 546: return "<circle cx=\"12\" cy=\"12\" r=\"5\" fill=\"#f59e0b\"/><line x1=\"12\" y1=\"1\" x2=\"12\" y2=\"3\"/><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"23\"/><line x1=\"4.22\" y1=\"4.22\" x2=\"5.64\" y2=\"5.64\"/><line x1=\"18.36\" y1=\"18.36\" x2=\"19.78\" y2=\"19.78\"/><line x1=\"1\" y1=\"12\" x2=\"3\" y2=\"12\"/><line x1=\"21\" y1=\"12\" x2=\"23\" y2=\"12\"/><line x1=\"4.22\" y1=\"19.78\" x2=\"5.64\" y2=\"18.36\"/><line x1=\"18.36\" y1=\"5.64\" x2=\"19.78\" y2=\"4.22\"/>";
            case 547: return "<line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"22\"/><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"/><line x1=\"4.93\" y1=\"4.93\" x2=\"19.07\" y2=\"19.07\"/><line x1=\"19.07\" y1=\"4.93\" x2=\"4.93\" y2=\"19.07\"/><circle cx=\"12\" cy=\"12\" r=\"2\" fill=\"#38bdf8\"/>";
            case 548: return "<path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\"/><path d=\"M3 3v5h5\"/>";
            case 549: return "<circle cx=\"12\" cy=\"12\" r=\"10\"/><circle cx=\"12\" cy=\"12\" r=\"3\" fill=\"currentColor\"/><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"6\"/><line x1=\"12\" y1=\"18\" x2=\"12\" y2=\"22\"/><line x1=\"2\" y1=\"12\" x2=\"6\" y2=\"12\"/><line x1=\"18\" y1=\"12\" x2=\"22\" y2=\"12\"/>";
            case 550: return "<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\"/><rect x=\"5\" y=\"14\" width=\"14\" height=\"3\" rx=\"1\" fill=\"currentColor\" fill-opacity=\"0.4\"/><line x1=\"7\" y1=\"11\" x2=\"17\" y2=\"11\"/>";
            default: return "";
        }
    }

    static int resolveName(const std::string& name) {
        static const std::unordered_map<std::string, int> nameMap = {
            {"idle_phone", 0},
            {"incoming_voice", 1},
            {"incoming_video", 2},
            {"outgoing_voice", 3},
            {"missed_call", 4},
            {"active_call", 5},
            {"mic_mute", 6},
            {"chat_unread", 7},
            {"voicemail", 8},
            {"headset", 9},
            {"call_forward", 10},
            {"call_hold", 11},
            {"call_transfer", 12},
            {"conference_call", 13},
            {"call_recording", 14},
            {"dtmf_keypad", 15},
            {"speakerphone", 16},
            {"bluetooth_audio", 17},
            {"phone_locked", 18},
            {"phone_ring", 19},
            {"intercom_bell", 20},
            {"call_park", 21},
            {"ivr_menu", 22},
            {"music_on_hold", 23},
            {"call_queue", 24},
            {"dial_tone", 25},
            {"emergency_e911", 26},
            {"backspace_delete", 27},
            {"volume_mute", 28},
            {"volume_up", 29},
            {"speed_dial", 30},
            {"hangup_call", 31},
            {"chat_bubble", 400},
            {"typing_indicator", 33},
            {"msg_sent", 34},
            {"msg_delivered", 35},
            {"msg_read", 36},
            {"attachment_clip", 37},
            {"image_media", 38},
            {"audio_mic_note", 39},
            {"emoji_happy", 40},
            {"send_paper_plane", 41},
            {"location_pin", 42},
            {"contact_card", 43},
            {"contacts_directory", 44},
            {"star_favorite", 45},
            {"pin_chat", 46},
            {"search_chat", 47},
            {"presence_online", 48},
            {"history_recent", 49},
            {"presence_busy", 50},
            {"presence_away", 51},
            {"presence_dnd", 52},
            {"presence_offline", 53},
            {"group_channel", 54},
            {"announcement", 55},
            {"back_arrow", 56},
            {"forward_arrow", 57},
            {"reply_thread", 58},
            {"share_link", 59},
            {"ai_bot_assistant", 60},
            {"verified_badge", 61},
            {"block_user", 62},
            {"mute_notifications", 63},
            {"cpu_chip", 64},
            {"mcu_board", 65},
            {"relay_module", 66},
            {"solenoid_lock", 67},
            {"rfid_nfc", 68},
            {"temperature_sensor", 69},
            {"humidity_sensor", 70},
            {"pressure_baro", 71},
            {"ambient_light", 72},
            {"pir_motion", 73},
            {"gas_smoke", 74},
            {"water_leak", 75},
            {"accelerometer", 76},
            {"magnetic_reed", 77},
            {"adc_voltage", 78},
            {"fingerprint_sensor", 79},
            {"relay_ch1", 80},
            {"relay_ch2", 81},
            {"relay_ch3", 82},
            {"relay_ch4", 83},
            {"i2c_bus", 84},
            {"spi_bus", 85},
            {"uart_serial", 86},
            {"pwm_motor", 87},
            {"buzzer_alarm", 88},
            {"seven_segment_led", 89},
            {"matrix_lcd_16x2", 90},
            {"oled_display", 91},
            {"led_indicator", 92},
            {"rotary_encoder", 93},
            {"potentiometer", 94},
            {"dac_audio", 95},
            {"ac_power_plug", 96},
            {"battery_charging", 327},
            {"battery_100", 98},
            {"battery_75", 99},
            {"battery_50", 100},
            {"battery_25", 101},
            {"battery_critical", 102},
            {"battery_eco_save", 103},
            {"solar_panel", 104},
            {"generator_power", 105},
            {"ups_backup", 106},
            {"voltage_high", 107},
            {"fuse_breaker", 108},
            {"power_meter", 109},
            {"current_shunt", 110},
            {"transformer_step", 111},
            {"ground_earth", 112},
            {"capacitor_bank", 113},
            {"inductor_coil", 114},
            {"diode_rectifier", 115},
            {"inverter_dc_ac", 116},
            {"power_plug_euro", 117},
            {"power_plug_us", 118},
            {"wireless_charge", 119},
            {"energy_leaf", 120},
            {"power_button", 121},
            {"power_reset", 122},
            {"power_sleep", 123},
            {"power_lockout", 124},
            {"fan_cooling", 125},
            {"heatsink_temp", 126},
            {"surge_suppressor", 127},
            {"ethernet_lan", 128},
            {"wifi_full", 129},
            {"wifi_med", 130},
            {"wifi_low", 131},
            {"wifi_off", 324},
            {"cellular_5g", 133},
            {"cellular_4g", 134},
            {"sim_card_slot", 135},
            {"bluetooth_mesh", 136},
            {"hotspot_tether", 137},
            {"lorawan_iot", 138},
            {"gps_satellite", 139},
            {"router_switch", 140},
            {"switch_hub", 141},
            {"patch_panel", 142},
            {"firewall_wall", 143},
            {"vpn_tunnel", 144},
            {"cloud_online", 145},
            {"cloud_upload", 146},
            {"cloud_download", 147},
            {"cloud_sync", 148},
            {"cloud_offline", 149},
            {"server_blade", 150},
            {"server_rack", 151},
            {"database_sql", 152},
            {"database_sync", 153},
            {"redis_cache", 154},
            {"kafka_stream", 155},
            {"mqtt_broker", 156},
            {"webrtc_media", 157},
            {"rtsp_stream", 158},
            {"sip_proxy", 159},
            {"audio_waveform", 160},
            {"opus_hd_codec", 161},
            {"g711_alaw", 162},
            {"echo_cancellation", 163},
            {"jitter_buffer", 164},
            {"video_camera_hd", 165},
            {"camera_flip", 166},
            {"camera_off", 167},
            {"screen_share", 168},
            {"pip_picture_in_pic", 169},
            {"fullscreen_expand", 170},
            {"minimize_screen", 171},
            {"video_grid_view", 172},
            {"video_speaker_focus", 173},
            {"ptz_pan_tilt", 174},
            {"zoom_in_cam", 175},
            {"zoom_out_cam", 176},
            {"night_vision_ir", 177},
            {"motion_alert_box", 178},
            {"audio_equalizer", 179},
            {"sim_card", 180},
            {"network_trunk", 181},
            {"srtp_shield", 182},
            {"srtp_lock_key", 183},
            {"tls_handshake", 184},
            {"media_play", 185},
            {"media_pause", 186},
            {"media_stop", 187},
            {"media_rewind", 188},
            {"media_fastforward", 189},
            {"audio_shuffle", 190},
            {"audio_repeat", 191},
            {"padlock_locked", 192},
            {"padlock_unlocked", 193},
            {"key_pass", 194},
            {"shield_check", 195},
            {"shield_alert", 196},
            {"retina_scan", 197},
            {"face_id_scan", 198},
            {"smart_card_id", 199},
            {"siren_flasher", 200},
            {"tamper_switch", 201},
            {"cctv_dome", 202},
            {"fire_flame", 203},
            {"gas_leak_alert", 204},
            {"glass_break", 205},
            {"panic_button_sos", 206},
            {"geofence_perimeter", 207},
            {"passcode_hash", 208},
            {"audit_log", 209},
            {"two_factor_2fa", 210},
            {"secret_vault", 211},
            {"antivirus_scan", 212},
            {"ddos_shield", 213},
            {"ssh_terminal_key", 214},
            {"api_token_lock", 215},
            {"ssl_cert_padlock", 216},
            {"session_timeout", 217},
            {"ip_blacklist", 218},
            {"ip_whitelist", 219},
            {"fail2ban_jail", 220},
            {"watermark_security", 221},
            {"disaster_recovery", 222},
            {"quarantine_isolate", 223},
            {"home_dashboard", 224},
            {"user_avatar", 225},
            {"settings_gear", 226},
            {"wrench_tools", 227},
            {"terminal_cli", 228},
            {"chevron_left", 273},
            {"chevron_right", 274},
            {"chevron_up", 271},
            {"chevron_down", 272},
            {"menu_hamburger", 233},
            {"more_vert", 234},
            {"more_horiz", 235},
            {"slider_controls", 236},
            {"toggle_on_switch", 237},
            {"toggle_off_switch", 238},
            {"checkbox_checked", 239},
            {"checkbox_empty", 240},
            {"check_success", 241},
            {"cross_cancel", 242},
            {"info_circle", 243},
            {"help_question", 244},
            {"clock_timer", 245},
            {"calendar_date", 246},
            {"metric_speedometer", 247},
            {"progress_donut", 248},
            {"trash_delete", 249},
            {"download_file", 250},
            {"upload_file", 251},
            {"folder_directory", 252},
            {"qr_barcode", 253},
            {"nfc_tap_pay", 254},
            {"titan_all_highway", 255},
            {"search", 256},
            {"home", 257},
            {"settings", 258},
            {"user", 259},
            {"users", 260},
            {"bell", 261},
            {"filter", 262},
            {"share", 263},
            {"link", 264},
            {"external_link", 265},
            {"menu", 266},
            {"grid", 267},
            {"list", 268},
            {"more_horizontal", 269},
            {"more_vertical", 270},
            {"arrow_up", 275},
            {"arrow_down", 276},
            {"arrow_left", 277},
            {"arrow_right", 278},
            {"expand", 279},
            {"edit", 280},
            {"trash", 281},
            {"plus", 282},
            {"minus", 283},
            {"check", 284},
            {"close", 285},
            {"copy", 286},
            {"save", 287},
            {"download", 288},
            {"upload", 289},
            {"file", 290},
            {"file_text", 291},
            {"folder", 292},
            {"folder_plus", 293},
            {"folder_minus", 294},
            {"image", 295},
            {"video", 296},
            {"music", 297},
            {"eye", 298},
            {"eye_off", 299},
            {"lock", 300},
            {"unlock", 301},
            {"key", 302},
            {"bookmark", 303},
            {"star", 304},
            {"heart", 305},
            {"pin", 306},
            {"flag", 307},
            {"tag", 308},
            {"scissors", 309},
            {"code", 310},
            {"terminal", 311},
            {"cpu", 312},
            {"database", 313},
            {"server", 314},
            {"cloud", 315},
            {"cloud_rain", 316},
            {"cloud_snow", 317},
            {"git_branch", 318},
            {"git_commit", 319},
            {"git_pull_request", 320},
            {"git_merge", 321},
            {"bug", 322},
            {"wifi", 323},
            {"bluetooth", 325},
            {"battery", 326},
            {"plug", 328},
            {"globe", 329},
            {"monitor", 330},
            {"smartphone", 331},
            {"tablet", 332},
            {"keyboard", 333},
            {"mouse", 334},
            {"printer", 335},
            {"hard_drive", 336},
            {"usb_flash", 337},
            {"qr_code", 338},
            {"barcode", 339},
            {"credit_card", 340},
            {"wallet", 341},
            {"shopping_cart", 342},
            {"shopping_bag", 343},
            {"dollar_sign", 344},
            {"euro", 345},
            {"pound", 346},
            {"bitcoin", 347},
            {"coins", 348},
            {"receipt", 349},
            {"percent", 350},
            {"calculator", 351},
            {"trending_up", 352},
            {"trending_down", 353},
            {"activity_line", 354},
            {"pie_chart", 355},
            {"bar_chart", 356},
            {"bank_landmark", 357},
            {"piggy_bank", 358},
            {"safe_vault", 359},
            {"invoice", 360},
            {"box_parcel", 361},
            {"delivery_truck", 362},
            {"gift_box", 363},
            {"award_ribbon", 364},
            {"royal_crown", 365},
            {"justice_scale", 366},
            {"briefcase", 367},
            {"compass_north", 368},
            {"anchor_marine", 369},
            {"stethoscope", 370},
            {"pill_capsule", 371},
            {"thermometer", 372},
            {"icu_bed", 373},
            {"ambulance", 374},
            {"hospital_red_cross", 375},
            {"heart_pulse_ecg", 376},
            {"dna_helix", 377},
            {"syringe_injection", 378},
            {"microscope", 379},
            {"lungs_pulmonary", 380},
            {"brain_cortex", 381},
            {"bone_orthopedic", 382},
            {"blood_droplet", 383},
            {"first_aid_kit", 384},
            {"shield_health_alert", 385},
            {"clinical_cross", 386},
            {"science_flask", 387},
            {"lab_test_tube", 388},
            {"nuclear_atom", 389},
            {"burn_flame", 390},
            {"medical_bandage", 391},
            {"virus_cell", 392},
            {"eye_drop", 393},
            {"wheelchair_mobility", 394},
            {"dental_teeth", 395},
            {"prescription_rx", 396},
            {"scalpel_surgery", 397},
            {"oxygen_mask_o2", 398},
            {"crutch_ortho", 399},
            {"mail_envelope", 401},
            {"mail_open", 402},
            {"send_plane", 403},
            {"calendar_event", 404},
            {"clock_time", 405},
            {"gps_location_pin", 406},
            {"map_folded", 407},
            {"phone_outgoing_call", 408},
            {"phone_forward_arrow", 409},
            {"phone_missed_cross", 410},
            {"video_camera_live", 411},
            {"microphone_audio", 412},
            {"microphone_mute_slash", 413},
            {"volume_high_3_wave", 414},
            {"volume_mute_x", 415},
            {"volume_low_1_wave", 416},
            {"media_play_triangle", 417},
            {"media_pause_bars", 418},
            {"media_stop_square", 419},
            {"skip_forward_track", 420},
            {"skip_back_track", 421},
            {"shuffle_track", 422},
            {"repeat_loop", 423},
            {"radio_portable", 424},
            {"podcast_cast", 425},
            {"megaphone_bullhorn", 426},
            {"rss_feed_feed", 427},
            {"message_circle_round", 428},
            {"thumbs_up_like", 429},
            {"sun_bright", 430},
            {"moon_crescent", 431},
            {"cloud_sun_day", 432},
            {"sunrise_dawn", 433},
            {"sunset_dusk", 434},
            {"wind_breeze", 435},
            {"umbrella_rain", 436},
            {"snowflake_crystal", 437},
            {"lightning_zap", 438},
            {"water_droplets", 439},
            {"rainbow_arc", 440},
            {"thermometer_hot", 441},
            {"forest_tree", 442},
            {"plant_leaf", 443},
            {"spring_flower", 444},
            {"mountain_peak", 445},
            {"ocean_waves", 446},
            {"campfire_flame", 447},
            {"tornado_cyclone", 448},
            {"target_bullseye", 449},
            {"sparkles_magic", 450},
            {"moon_stars_night", 451},
            {"sun_dim_eco", 452},
            {"cloud_fog_mist", 453},
            {"cloud_lightning_storm", 454},
            {"thermometer_cold", 455},
            {"feather_quill", 456},
            {"globe_americas", 457},
            {"earth_planet", 458},
            {"tent_camp", 459},
            {"shield_check_ok", 460},
            {"shield_x_blocked", 461},
            {"shield_alert_warning", 462},
            {"fingerprint_biometric", 463},
            {"scan_viewfinder", 464},
            {"key_round", 465},
            {"lock_keyhole", 466},
            {"user_check_verified", 467},
            {"user_x_denied", 468},
            {"user_plus_add", 469},
            {"user_minus_remove", 470},
            {"sliders_equalizer", 471},
            {"toggle_left_off", 472},
            {"toggle_right_on", 473},
            {"gauge_speedometer", 474},
            {"help_circle_question", 475},
            {"info_information", 476},
            {"alert_triangle_hazard", 477},
            {"alert_circle_warning", 478},
            {"alert_octagon_stop", 479},
            {"check_circle_success", 480},
            {"x_circle_error", 481},
            {"slash_ban", 482},
            {"radio_tower_mast", 483},
            {"power_switch_off", 484},
            {"log_in_enter", 485},
            {"log_out_exit", 486},
            {"loader_spinner", 487},
            {"minimize_shrink", 488},
            {"move_4_way_arrows", 489},
            {"wrench_tool", 490},
            {"hammer_construction", 491},
            {"screwdriver_fix", 492},
            {"hexagon_nut", 493},
            {"ruler_scale", 494},
            {"pen_tool_vector", 495},
            {"highlighter_marker", 496},
            {"paperclip_attach", 497},
            {"clipboard_document", 498},
            {"book_closed", 499},
            {"book_open_read", 500},
            {"graduation_cap_edu", 501},
            {"coffee_cup_hot", 502},
            {"glass_water_cup", 503},
            {"dumbbell_fitness", 504},
            {"trophy_winner", 505},
            {"target_archery", 506},
            {"rocket_launch", 507},
            {"lightbulb_idea", 508},
            {"puzzle_jigsaw", 509},
            {"crown_king_gold", 510},
            {"all_silicon_spectrum", 511},
            {"razor_split", 512},
            {"razor_blade", 513},
            {"left_cut", 514},
            {"trim_left", 515},
            {"right_cut", 516},
            {"trim_right", 517},
            {"ripple_delete", 518},
            {"slip_edit", 519},
            {"slide_edit", 520},
            {"magnetic_snap", 521},
            {"keyframe_diamond", 522},
            {"speed_ramp", 523},
            {"freeze_frame", 524},
            {"pip_overlay", 525},
            {"mask_pen", 526},
            {"detach_audio", 527},
            {"crossfade_audio", 528},
            {"reverse_clip", 529},
            {"export_render_4k", 530},
            {"track_video_v1", 531},
            {"track_audio_a1", 532},
            {"track_text_t1", 533},
            {"eye_open", 534},
            {"eye_slash", 535},
            {"track_lock", 536},
            {"track_unlock", 537},
            {"audio_mute_badge", 538},
            {"audio_solo_badge", 539},
            {"audio_record_arm", 540},
            {"align_left", 541},
            {"align_center", 542},
            {"align_right", 543},
            {"text_shadow_fx", 544},
            {"3_way_color_wheel", 545},
            {"temperature_warm", 546},
            {"temperature_cold", 547},
            {"reset_transform", 548},
            {"2d_joystick_pan", 549},
            {"subtitle_lower_third", 550},
        };
        std::string lower = name;
        std::transform(lower.begin(), lower.end(), lower.begin(), ::tolower);
        auto it = nameMap.find(lower);
        if (it != nameMap.end()) return it->second;
        return 1; // Default
    }

    static std::string render(int id, int size = 32, bool circle = true, const std::string& customColor = "") {
        std::string pathData = getIconPath(id);
        if (pathData.empty()) pathData = getIconPath(1);

        std::string strokeColor = customColor.empty() ? "#38bdf8" : customColor;
        std::string glowColor = customColor.empty() ? "rgba(56,189,248,0.4)" : customColor;

        std::ostringstream ss;
        ss << "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\" width=\"" << size << "\" height=\"" << size << "\">\n";
        if (circle) {
            ss << "  <circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"#030712\" stroke=\"" << strokeColor << "\" stroke-opacity=\"0.3\" stroke-width=\"1.2\"/>\n";
            ss << "  <circle cx=\"16\" cy=\"16\" r=\"13.5\" fill=\"#0a1324\" stroke=\"" << strokeColor << "\" stroke-width=\"1.4\"/>\n";
        }
        ss << "  <g transform=\"translate(4, 4)\">\n";
        ss << "    " << pathData << "\n";
        ss << "  </g>\n";
        ss << "</svg>";
        return ss.str();
    }

    static std::string render(const std::string& name, int size = 32, bool circle = true, const std::string& customColor = "") {
        return render(resolveName(name), size, circle, customColor);
    }
};

inline std::string Icon(int id, int size = 32, bool circle = true, const std::string& color = "") {
    return DanpheIcons::render(id, size, circle, color);
}

inline std::string Icon(const std::string& name, int size = 32, bool circle = true, const std::string& color = "") {
    return DanpheIcons::render(name, size, circle, color);
}

} // namespace DanpheUI
