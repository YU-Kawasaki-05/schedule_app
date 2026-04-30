# CLAUDE.md

## Design system

Visual design specification: @DESIGN.md

Read this file before creating or modifying any UI, components, or styles.

---

## Repository workflow policy (mandatory)

### 1) Branch policy

- All agent commits must be created only on `feature/*` branches.
- Do not commit on `main` or `master`.
- If current branch is not `feature/*`, create/switch first:
  - `git switch -c feature/<topic>`

### 2) Push policy

- `git push` is human-only.
- Claude Code must not run `git push` (including `--no-verify`).
- After Claude Code completes work and local commit(s), hand off to a human for push and PR operations.

### 3) Commit policy

- Keep commits scoped to one coherent objective.
- Use clear commit messages with intent + scope.
- Do not bypass repository hooks (`--no-verify`) unless a human explicitly instructs and approves.

### 4) Safety guardrails

- Never use destructive git operations unless explicitly instructed:
  - `git reset --hard`
  - `git clean -fdx`
  - force push variants
- Prefer read-first investigation before file edits.

### 5) Docs-first behavior in this repo

- Prioritize `docs/` updates and consistency checks when requirements or process changes.
- Keep IDs stable in requirements docs (`FR-*`, `SCR-*`, `U-*`, `BR-*`, `AC-*`).

### 6) Handoff format for humans

When work is done, report:

- changed files
- local commit hash
- recommended human commands:
  - `git push -u origin feature/<topic>`
  - PR creation command/path
