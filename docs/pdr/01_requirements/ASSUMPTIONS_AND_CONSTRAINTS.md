# Assumptions and Constraints

## Assumptions

- User wants minimal-prompt GO-mode operation.
- Claude Design is a target consumer, not the only execution environment.
- OpenArt or similar tools will generate image/video assets.
- The design system should fit Chromatic Harness conventions.
- The first implementation target is a scaffold, not a polished production app.

## Constraints

- Must avoid one-off design artifacts without traceability.
- Must not let subagents choose unlimited next steps without confidence scoring.
- Must keep design assets organized by role and lifecycle.
- Must preserve repo-tree hygiene.
- Must be usable by multiple LLMs with different strengths.
