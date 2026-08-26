"use strict";
/**
 * 🌊 DolphinJS — Hardware API shared types
 *
 * Every domain method (Camera.takePicture, GPS.getLocation, ...) returns a
 * plain descriptor object — not a live call. The host runtime reads `cmd`
 * + `params`, serializes via `buildHWCall`, and dispatches over the wire.
 */
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map