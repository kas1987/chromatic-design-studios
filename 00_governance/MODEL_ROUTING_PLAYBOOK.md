# Model Routing Playbook — Chromatic Design Studios

## Agent Roles

### cartographer
- **Objective:** Maintain repo structure, file tree accuracy, and naming conventions
- **Files:** `CHROMATIC_TREES.md`, `10_appendices/FILE_TREE.md`
- **Output:** Updated file trees, folder scaffolding, path validation
- **Acceptance:** File tree matches actual repo; naming conventions followed
- **Stop condition:** Tree is accurate and all paths are verified

### css-architect
- **Objective:** Expand and maintain design tokens and CSS library
- **Files:** `02_design_tokens/*.json`, `04_css_library/*.css`
- **Output:** Token JSON files, CSS custom properties, component styles
- **Acceptance:** All tokens have CSS variable mappings; CSS parses without errors
- **Stop condition:** Token coverage is complete and CSS variables are synchronized

### visual-director
- **Objective:** Enforce visual consistency and brand compliance across all outputs
- **Files:** `01_brand/*.md`, `02_design_tokens/*.json`
- **Output:** Visual review notes, correction recommendations
- **Acceptance:** No unauthorized colors, fonts, or spacing outside token system
- **Stop condition:** All visual outputs pass token-reference check

### prompt-engineer
- **Objective:** Create reusable, structured prompts for asset generation tools
- **Files:** `05_prompts/**/*.md`
- **Output:** Claude Design bridge prompts, OpenArt/ComfyUI layered prompts
- **Acceptance:** Prompts include all required sections (context, tokens, constraints, QA)
- **Stop condition:** Prompt pack is complete and tested with at least one sample

### component-builder
- **Objective:** Build component specs and acceptance criteria
- **Files:** `03_components/*.md`
- **Output:** Component specifications with layout, tokens, responsive behavior
- **Acceptance:** Spec includes exact token references and measurable acceptance criteria
- **Stop condition:** Component spec is complete and can be handed to an implementer

### qa-auditor
- **Objective:** Verify all outputs against objective QA criteria before marking complete
- **Files:** `07_qa/*.md`
- **Output:** QA reports, pass/fail verdicts
- **Acceptance:** Every deliverable passes its associated checklist items
- **Stop condition:** All checklists are run and findings are documented

## Routing Rules

### Default Routing

When `getdesign.md` receives a request:

1. **Classify** the request type:
   - "Create tokens/CSS" → css-architect
   - "Review visual consistency" → visual-director
   - "Write prompts" → prompt-engineer
   - "Build component" → component-builder
   - "Check repo structure" → cartographer
   - "Verify quality" → qa-auditor

2. **Load** the agent's handoff file from `06_agents/`
3. **Score** confidence per Confidence Gate Playbook
4. **Execute** if Green/Yellow; ask human if Red

### Multi-Agent Workflows

For complex requests requiring multiple agents:

```
Request → cartographer (verify paths)
       → css-architect (tokens + CSS)
       → visual-director (review)
       → component-builder (spec)
       → qa-auditor (validate)
```

Each agent reads the previous agent's output and adds their layer. No agent skips ahead.

### Human Escalation

Escalate to human when:
- Two agents disagree on visual direction
- A task requires a decision not covered by tokens or brand manifest
- A destructive change is requested (deletion, major refactor)
- Confidence gate is Red for any agent

## Model Tiers

| Task Complexity | Recommended Model | Reasoning |
|-----------------|-------------------|-----------|
| Creative direction (visual language, brand) | High | Nuanced aesthetic decisions |
| Token expansion, CSS variables | Medium | Structured, pattern-based |
| Prompt engineering | Medium | Template-filling with creativity |
| QA auditing, checklist verification | Low | Objective, rule-based |
| File tree maintenance, scaffolding | Low | Mechanical, deterministic |
