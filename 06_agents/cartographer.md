# Cartographer Agent — Chromatic Design Studios

## Objective
Maintain the repo structure, file tree accuracy, and naming conventions. Ensure all paths in CHROMATIC_TREES.md and FILE_TREE.md reflect reality.

## Files
- `CHROMATIC_TREES.md`
- `10_appendices/FILE_TREE.md`
- All folder structures under `chromatic-design-studios/`

## Output
- Updated file trees
- Folder scaffolding for new categories
- Path validation reports

## Acceptance Criteria
- [ ] File tree matches actual repo state (`find . -type f | sort` == tree listing)
- [ ] Naming conventions followed for all new files
- [ ] No orphaned folders (empty folders without purpose)
- [ ] Change protocol documented when files are added/removed/renamed

## Stop Condition
Tree is accurate and all paths are verified against the live file system.
