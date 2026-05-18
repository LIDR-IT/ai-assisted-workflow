---
id: aramis-as-reference
version: "1.0.0"
last_updated: "2026-05-14"
updated_by: "PME: Luis Urdaneta"
status: active
---

# Aramis Group — End-to-end Reference

This document maps the Aramis discovery report sections to the three propuesta JSONs.
Use this as the canonical example when applying the `propuesta-builder` skill to a new client.

## Inputs

| Input              | File                                               | Version    |
| ------------------ | -------------------------------------------------- | ---------- |
| Discovery report   | `docs/guides/lidr-core/aramis-discovery-report.md` | 1.4.0      |
| Pre-kickoff survey | (referenced in the report)                         | 2026-04-07 |
| Client config      | `src/data/clients/aramis/config.ts`                | (current)  |
| Schema contract    | `src/data/schemas/propuesta-schema.ts`             | (current)  |

## Outputs

| File                                                 | Lines | Highlights                                                          |
| ---------------------------------------------------- | ----- | ------------------------------------------------------------------- |
| `src/data/clients/aramis/propuesta/diagnostico.json` | ~122  | 9 PP, 8 fortalezas, 8 oportunidades, 9 gaps                         |
| `src/data/clients/aramis/propuesta/mejoras.json`     | ~189  | 8 fases ordenadas F1→F8, mapeo gate 0–7                             |
| `src/data/clients/aramis/propuesta/flujo.json`       | ~190  | 32 nodos, 39 edges, hotfix paralelo + Bridge Impact + Cross-Country |

## Section mapping (report → JSON)

### Report → diagnostico.json

| Report section                                       | JSON path                          | Notes                                                             |
| ---------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------- |
| `## Resumen Ejecutivo`                               | `summary.executiveSummary`         | Condensed; reference v1.4.0 + survey 2026-04-07                   |
| `### 1.1 Participantes`                              | (implicit, not stored)             | Use to attribute quotes correctly                                 |
| `## 2. Análisis AS-IS` → "Fortalezas" subset         | `summary.fortalezas[]`             | Prefix each with `• `                                             |
| `## 4. Análisis de Gaps vs LIDR` → strengths bullets | merged into `summary.fortalezas[]` | Pre-Code-Review CI Gate, SCA parcial, etc.                        |
| `## 4. Análisis de Gaps vs LIDR` → gap table         | `summary.gapsCriticos[]`           | Reference PP-NN + impact level                                    |
| `## 3. Pain Points Identificados` (PP-01..PP-09)     | `painPoints[]` (9 items)           | One JSON entry per `### PP-NN`. Include verbatim quote + speaker. |
| Each PP body                                         | `painPoints[].problema`            | Keep verbatim quote, attribute speaker                            |
| Each PP "Referencia LIDR" or "Oportunidad"           | `painPoints[].mejora`              | Use the LIDR skill/gate names                                     |
| Source location of evidence                          | `painPoints[].evidence`            | "discovery report sec. 3 PP-05 · VTT ≈1:49:14 (David)"            |

### Report → mejoras.json (only if client-specific extensions exist)

For Aramis, extensions emitted in `mejoras.json`:

| Fase                 | Aramis-specific element                                                      | Source in report                    |
| -------------------- | ---------------------------------------------------------------------------- | ----------------------------------- |
| F2 — Discovery & PRD | Polaris Knowledge Agent integration, formalize Luis Marco's orchestrator     | sec. 5.2 + 8 "innovadores internos" |
| F3 — Especificación  | Cross-Country Compatibility Check, Sheila ATDD pre-Ready-for-Dev             | PP-03 + PP-06                       |
| F5 — Desarrollo      | Bridge Impact Analyzer, CLAUDE.md por repo, preserve Pre-Code-Review CI Gate | PP-01, PP-02, PP-05, PP-08          |
| F6 — QA              | Move Cypress to FE repo or bloqueante CI, Playwright MCP auto-update         | PP-04                               |
| F7 — Seguridad       | Coordination with Ciberseguridad Aramis Group VP + GDPR hook                 | "Sobre el equipo de Ciberseguridad" |
| F8 — Despliegue      | Hotfix paralelo respected + Sprint Review recovered                          | sec. 2.3 branching + survey gap     |

If the client has NO extensions, do not emit `mejoras.json` — it will inherit from `base/`.

### Report → flujo.json (only if client-specific flow elements exist)

For Aramis, flow extensions emitted in `flujo.json`:

| Aramis extension                  | Diagram nodes/edges                                                              |
| --------------------------------- | -------------------------------------------------------------------------------- |
| Hotfix paralelo (`main → main`)   | Node `hotfix-in` (purple at x=900, y=0) + dashed edge to `comite`                |
| Pre-Code-Review CI Gate existente | Node `ci-existing` (emerald, "preserved + extended")                             |
| Bridge Impact Analyzer            | Node `bridge-impact` (red) parallel to `sast`, with rejection edge to `sast-blk` |
| Cross-Country Check pre-Gate 2    | Node `cross-country` (cyan) parallel to `rf`, feeding into `rtm`                 |

If the client has NO flow extensions, do not emit `flujo.json` — base/ covers it.

## Quality bar applied to Aramis

| Check                                     | Aramis | Notes                                                               |
| ----------------------------------------- | ------ | ------------------------------------------------------------------- |
| Every PP has verbatim quote + attribution | ✅     | PP-01 (Reme), PP-02 (Reme + Dídac), PP-05 (David), PP-08 (Dídac)    |
| Every PP has VTT/section evidence         | ✅     | `evidence` field on each PP                                         |
| Existing strengths preserved in TO-BE     | ✅     | Pre-Code-Review CI Gate, BDD/Gherkin, AI innovators, Sheila QA docs |
| Flow extensions visually distinct         | ✅     | Aramis-specific nodes marked in subtitles                           |
| Zod validation                            | ✅     | Run `validate-propuesta.ts aramis`                                  |
| UI renders without errors                 | ✅     | Switch to Aramis client; all 3 tabs OK                              |

## Validation command

```bash
npx tsx .claude/skills/propuesta-builder/scripts/validate-propuesta.ts aramis
```

Expected output:

```
=== Propuesta validation: client 'aramis' ===
  ✅ diagnostico.json
  ✅ mejoras.json
  ✅ flujo.json
All present JSONs are valid.
```

## How to use this reference for a new client

1. **Skim** the Aramis discovery report from start to finish to internalize the structure.
2. **Skim** the 3 Aramis JSONs side-by-side with the report sections that produced them.
3. **Draft** the new client's report following the same structure (use `kickoff` and
   `document-discovery` skills if you haven't already).
4. **Apply** the `propuesta-builder` skill following its SKILL.md workflow.
5. **Compare** the new JSONs against this reference for completeness (every PP has
   quote + attribution + evidence, etc.).
6. **Validate** with `validate-propuesta.ts <newClientId>`.
7. **Verify** the UI by switching to the new client in the running app.
