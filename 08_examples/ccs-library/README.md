# CCS Asset Library

Imported design assets for Chromatic Design Studios. Each subfolder preserves the
original package's internal structure.

| Folder | Source | Contents |
|---|---|---|
| `front-end-universe/` | Chromatic Front-End Universe | Single standalone showcase HTML. |
| `social-engine-ui/` | Social Engine UI | Dashboard JSX (`src/`) + shared `lib/` (metachromatic css/icon, design-canvas, tweaks-panel). |
| `system-dashboard/` | System Dashboard | `apps/metachromatic` tokens, `apps/prism-dashboard`, `browser/`, `dashboard/`, hero/rift HTML showcases, curated `screenshots/`. |
| `shader-wallpapers/` | Shader Wallpapers | 6 shader-wallpaper HTMLs, `lib/` (shader-runtime, chrome-dock, wallpaper.css), `assets/bg/*.jpg` backgrounds. |

## Import notes

- Raw `uploads/` generation artifacts (~55 MB across packages) and `.thumbnail`
  files were **excluded** to keep git history lean (repo has no git-LFS).
- Curated `screenshots/` were retained.
- Originals remain in `~/Downloads` (copy-only import).
