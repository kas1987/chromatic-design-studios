# CHROMATIC_TREES — Repo Source of Truth

## File Tree

```
chromatic-design-studios/
├── README.md                           # Project overview
├── CHROMATIC_DESIGN_SYSTEM.md          # Design laws and reusable standards
├── PROJECT_STATE.md                    # Current project state
├── DESIGN_QUEUE.md                     # Execution queue
├── getdesign.md                        # Primary command file
├── CHROMATIC_TREES.md                  # This file — repo tree source of truth
│
├── 00_governance/
│   ├── GO_MODE_PLAYBOOK.md             # Task selection and execution rules
│   ├── CONFIDENCE_GATE_PLAYBOOK.md     # Confidence thresholds
│   └── MODEL_ROUTING_PLAYBOOK.md       # Agent role assignments
│
├── 01_brand/
│   ├── brand_manifest.md               # Brand identity and voice
│   └── visual_language.md              # Visual direction v0.1
│
├── 02_design_tokens/
│   ├── tokens.colors.json              # Color system
│   ├── tokens.spacing.json             # Spacing rhythm
│   ├── tokens.typography.json          # Typography scale
│   ├── tokens.motion.json              # Motion primitives
│   └── tokens.glow.json                # Glow and effect tokens
│
├── 03_components/
│   └── hero-component.md               # Hero section component spec
│
├── 04_css_library/
│   ├── chromatic-base.css              # CSS custom properties + reset
│   ├── chromatic-layout.css            # Layout primitives
│   ├── chromatic-components.css        # Component patterns
│   └── chromatic-effects.css           # Holographic/glassmorphism effects
│
├── 05_prompts/
│   ├── claude-design/
│   │   └── implementation.md           # Bridge prompt for Claude Design
│   └── openart/
│       └── hero-assets.md              # Layered asset prompts
│
├── 06_agents/
│   ├── cartographer.md                 # Repo structure agent
│   ├── css-architect.md                # Token/CSS agent
│   ├── visual-director.md              # Visual consistency agent
│   ├── prompt-engineer.md              # Prompt creation agent
│   ├── component-builder.md            # Component spec agent
│   └── qa-auditor.md                   # QA verification agent
│
├── 07_qa/
│   └── DESIGN_QA_CHECKLIST.md          # Objective design checks
│
├── 08_examples/
│   └── hero-page/
│       └── example.md                  # Demo hero page
│
├── 09_packaging/
│   └── RELEASE_CHECKLIST.md            # Pre-release verification
│
└── 10_appendices/
    └── FILE_TREE.md                    # Auto-generated file tree
```

## Scaffold Tree (PDR Target)

New monorepo scaffold following `CHROMATIC_DESIGN_STUDIOS_SCAFFOLD_PDR.md`:

```text
chromatic-design-studios/
├── README.md                           # Project overview
├── package.json                        # Root monorepo manifest
├── CHROMATIC_DESIGN_SYSTEM.md          # Design laws and standards
├── CHROMATIC_TREES.md                  # This file
├── docker-compose.chromatic.yml        # Service orchestration
├── .env.example                        # Environment template
├── apps/
│   ├── web/                            # Next.js / T3 frontend
│   ├── api/                            # Backend adapter
│   └── worker/                         # Agent job runner
├── packages/
│   ├── ui/                             # shadcn/ui + Chromatic components
│   ├── tokens/                         # Design tokens (migrated from 02_design_tokens)
│   ├── prompts/                        # Prompt templates
│   ├── agents/                         # Agent definitions
│   ├── workflows/                      # Workflow specs
│   └── schemas/                        # Shared Zod/type schemas
├── services/
│   ├── litellm/                        # Model gateway config
│   ├── n8n/                            # Automation workflows
│   ├── open-webui/                     # Local AI cockpit
│   ├── comfyui/                        # Visual asset pipeline
│   └── ollama/                         # Local model runtime
├── docs/
│   ├── PDR/                            # Product design records
│   ├── playbooks/                      # GO mode, model routing, confidence gates
│   ├── taxonomy/                       # Classification docs
│   └── architecture/                   # Service maps, repo trees, decision matrices
├── handoffs/
│   └── AGENT_HANDOFF_QUEUE.md          # Agent-ready work queue
├── prompts/
│   ├── CLAUDE_DESIGN_SCAFFOLD_PROMPT.md
│   └── CODEX_SCAFFOLD_PROMPT.md
├── scripts/
│   ├── bootstrap_chromatic_design_studios.ps1
│   └── bootstrap_chromatic_design_studios.sh
├── manifests/
│   └── artifact_manifest.json          # Generated asset registry
└── validation/
    └── VALIDATION_CHECKLIST.md         # Acceptance criteria
```

## Legacy Tree (v0.1.0)

```text
chromatic-design-studios/
├── 00_governance/                      # Confidence gates, GO mode, model routing
├── 01_brand/                           # Brand manifest, visual language
├── 02_design_tokens/                   # Color, spacing, typography, motion, glow
├── 03_components/                      # Component specs (hero)
├── 04_css_library/                     # CSS custom properties + effects
├── 05_prompts/                         # Agent prompts for Claude Design, OpenArt
├── 06_agents/                          # Agent role definitions
├── 07_qa/                              # Design QA checklist
├── 08_examples/                        # Demo pages
├── 09_packaging/                       # Release checklist
└── 10_appendices/                      # Auto-generated file trees
```

## Migration Notes

- **02_design_tokens/** contents copied into `packages/tokens/src/`
- **00_governance/** playbooks copied into `docs/playbooks/`
- **05_prompts/** and **06_agents/** to migrate into `packages/prompts/` and `packages/agents/`
- Legacy tree preserved until v0.2.6. Deprecated after full migration.

## Naming Conventions

- **Folders:** `NN_category/` — zero-padded, snake_case, no spaces
- **Files:** `descriptive-name.ext` — kebab-case, no spaces
- **Tokens:** `tokens.<domain>.json` — plural domain, lowercase
- **CSS:** `chromatic-<layer>.css` — layer name, kebab-case
- **Agents:** `<role-name>.md` — kebab-case, no agent suffix
- **Checklists:** `ALL_CAPS.md` — screaming snake case for human attention

## Change Protocol

When adding, removing, or renaming files:
1. Update this document (CHROMATIC_TREES.md)
2. Update `10_appendices/FILE_TREE.md`
3. Update any agent handoffs that reference the changed paths
4. Run `getdesign.md` protocol to re-classify affected tasks
