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
