# 🤖 AI Maintenance Guidelines for Router Engine (`src/router`)

## 🔒 Route Invariants

1. **Parameter Pattern Matching**:
   - Routes with `:param` syntax MUST decode URI components.
2. **Opcode 0x0A (NAVIGATE_TO)**:
   - Navigation events dispatched over dev bridge MUST use command opcode `0x0A`.
