# 🤖 AI Maintenance Guidelines for Parser (`src/parser`)

## 🔒 AST Invariants

1. **Tag Opcode Mapping**:
   - `mapTagToOpcode` MUST map `button` -> `0x10`, `div` -> `0x13`, `span`/`h1`/`p` -> `0x16`, `img` -> `0x17`, `input` -> `0x18`.
2. **Prop Normalization**:
   - Both `class` and `className` MUST normalize to `className`.
3. **Action Expression**:
   - Callbacks MUST be normalized to action strings (`key:=value`, `key+=1`, `key!=toggle`).
