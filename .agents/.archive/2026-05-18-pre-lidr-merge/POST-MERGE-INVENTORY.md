# Post-Merge Inventory — lidr-ecosystem/

Generated: Mon May 18 22:10:50 CEST 2026

## Counts

| Categoría   | Total | LIDR (lidr-\*) | Genéricos (ai-assisted) |
| ----------- | ----- | -------------- | ----------------------- |
| Skills      | 74    | 62             | 12                      |
| Commands    | 30    | 23             | 7                       |
| Subagents   | 9     | 6              | 3                       |
| Hooks       | 8     | 4              | 4                       |
| Rules (.md) | 22    | 5              | 17                      |

## Estructuras añadidas

- `.agents/skills/lidr-*` — 58 skills nuevos + 4 pre-existentes intactos
- `.agents/commands/lidr-*` — 23 commands LIDR
- `.agents/subagents/lidr-*` — 6 agents autónomos LIDR
- `.agents/hooks/lidr/` — 4 hooks bash LIDR (sin tocar hooks.json ni scripts/)
- `.agents/rules/lidr-sdlc/` — 5 rules organizacionales LIDR
- `.agents/_shared/lidr/` — validators compartidos (validate-bdd-patterns, etc)
- `.agents/memory/lidr/` — memory persistente (docs-agent)
- `app/` — React app completa (sin node_modules, dist, coverage, .git)

## Archivados

- `.archive/2026-05-18-pre-lidr-merge/lidr-claude-root/` — CLAUDE.md, settings\*, mcps/, monitoring/ del .claude/ original
- `.archive/2026-05-18-pre-lidr-merge/overwritten/` — vacío (no hubo colisiones)
- `.archive/2026-05-18-pre-lidr-merge/diff-reports/PRE-MIGRATED-SKILLS-DIFF.md` — diferencias entre los 4 skills lidr-\* ya migrados y los originales LIDR (decisión: NO sobrescribir)

## Logs

- SKILLS-MIGRATION.log
- COMMANDS-MIGRATION.log
- SUBAGENTS-MIGRATION.log

## Fuentes originales (intactas)

- `../LIDR - AI powered workflow 2026/` — NO TOCADO
- `../ai-assisted-workflow/` — NO TOCADO

## Tamaño total lidr-ecosystem/

```
 50M	.
```
