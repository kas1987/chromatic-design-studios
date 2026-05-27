# Product Requirements

## Core Capability

Chromatic Design Studios must convert short design intent into governed design outputs.

## User Stories

| ID | Story | Acceptance Criteria |
|---|---|---|
| US-001 | As a creative director, I can write a short design request in `getdesign.md` | Request is classified, scored, and queued |
| US-002 | As a builder agent, I can read the queue and know exactly what to build | Task has files, output format, and stop condition |
| US-003 | As a prompt agent, I can create OpenArt prompts consistently | Prompt uses visual language and asset taxonomy |
| US-004 | As a Claude Design user, I can paste a bridge prompt | Prompt includes layout, tokens, constraints, and QA rules |
| US-005 | As an auditor, I can reject inconsistent designs | QA checklist has objective checks |

## MVP Requirements

- Define source-of-truth documents.
- Define design asset taxonomy.
- Define token schema.
- Define CSS bundle structure.
- Define Claude Design bridge prompt.
- Define OpenArt prompt patterns.
- Define agent handoffs.
- Define acceptance checklist.
