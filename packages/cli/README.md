# chromatic-ui

> CLI for adding Chromatic Design Studios components and tokens to your project.

```bash
npx chromatic-ui@latest init
npx chromatic-ui@latest add button
npx chromatic-ui@latest list
npx chromatic-ui@latest tokens
npx chromatic-ui@latest doctor
```

The CLI copies component sources into your project (`./components/chromatic/`) — no runtime dependency, no telemetry, no network calls. You own the components you add; the design tokens come from `@chromatic/tokens`.

## Commands

| Command | What it does |
|---------|--------------|
| `init` | Scaffolds the `components/chromatic/` directory with the barrel export |
| `add <name>` | Copies a single component source into `components/chromatic/` |
| `list` | Lists all available components (23 in v0.5.0) |
| `tokens` | Emits the `@chromatic/tokens` CSS layer to `./chromatic-tokens.css` |
| `doctor` | Verifies project setup (Tailwind, components dir, package.json) |

## Distribution model

`chromatic-ui` follows the **copy-paste distribution** model (à la shadcn/ui):

- Components live in **your** repo, not in `node_modules`.
- You can edit them, theme them, or fork them.
- Token updates flow through `@chromatic/tokens` (which you control).
- No version-locking; bump on your own cadence.

## License

MIT — see [chromatic-design-studios](https://github.com/kas1987/chromatic-design-studios).