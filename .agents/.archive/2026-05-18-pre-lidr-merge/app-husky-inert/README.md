# Archived: app/.husky (inert hooks)

These hooks were copied from the LIDR React app (`LIDR - AI powered workflow 2026/.husky/`)
when migrating to lidr-ecosystem/. They are **inert** because:

- The unified repo has only ONE `.git/` (at root)
- `core.hooksPath` is `.husky/_` (the root husky)
- Git never reads `app/.husky/`

The valuable logic from these hooks (commitlint, branch naming validation, lint-staged
for app/) was ported to the root `.husky/` directory on 2026-05-18.

Preserved here for reference.
