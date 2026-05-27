# File Tree — Chromatic Design Studios

Auto-generated from `find chromatic-design-studios/ -type f | sort`.

```
chromatic-design-studios/
├── CHROMATIC_DESIGN_SYSTEM.md
├── CHROMATIC_TREES.md
├── DESIGN_QUEUE.md
├── PROJECT_STATE.md
├── README.md
├── getdesign.md
├── 00_governance/
│   ├── CONFIDENCE_GATE_PLAYBOOK.md
│   ├── GO_MODE_PLAYBOOK.md
│   └── MODEL_ROUTING_PLAYBOOK.md
├── 01_brand/
│   ├── brand_manifest.md
│   └── visual_language.md
├── 02_design_tokens/
│   ├── tokens.colors.json
│   ├── tokens.glow.json
│   ├── tokens.motion.json
│   ├── tokens.spacing.json
│   └── tokens.typography.json
├── 03_components/
│   └── hero-component.md
├── 04_css_library/
│   ├── chromatic-base.css
│   ├── chromatic-components.css
│   ├── chromatic-effects.css
│   └── chromatic-layout.css
├── 05_prompts/
│   ├── claude-design/
│   │   └── implementation.md
│   └── openart/
│       └── hero-assets.md
├── 06_agents/
│   ├── cartographer.md
│   ├── component-builder.md
│   ├── css-architect.md
│   ├── prompt-engineer.md
│   ├── qa-auditor.md
│   └── visual-director.md
├── 07_qa/
│   └── DESIGN_QA_CHECKLIST.md
├── 08_examples/
│   └── hero-page/
│       └── example.md
├── 09_packaging/
│   └── RELEASE_CHECKLIST.md
└── 10_appendices/
    └── FILE_TREE.md
```

## Regenerate

```bash
cd chromatic-design-studios/
find . -type f -not -path './.git/*' -not -path './.agents/*' -not -path './docs/*' | sort > 10_appendices/FILE_TREE.md
```
