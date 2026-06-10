---
name: lidr-propuesta-builder
id: propuesta-builder
version: "1.1.0"
last_updated: "2026-06-09"
updated_by: "PME: Luis Urdaneta"
status: active
phase: 2
stage: planning
owner_role: "PME"
automation: false
domain_agnostic: true
language_default: en
integrations: [docs]
description: >
  Generate the three JSON artifacts that power the "Propuesta de Mejora" UI for a new client
  (diagnostico.json, mejoras.json, flujo.json) by reading a structured discovery report markdown.
  Closes the consultancy cycle: discovery session → discovery report → propuesta UI without
  manual TSX edits. Domain-agnostic — works for any industry given a properly structured
  discovery report.
  ALWAYS use this skill when onboarding a new client to the LIDR SDLC Methodology UI.
  Triggers on "build propuesta", "generate propuesta JSONs", "convert discovery report to UI",
  "onboard new client to LIDR UI", "create client propuesta".
  Do NOT use for editing diagrams (use diagram-store JSONs directly), for generating the
  discovery report itself (the report is the input — produced by the discovery session and
  the kickoff/bmad-document-project skills), or for the metrics tab (separate component).
  Output: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`).
  Emits 3 validated JSONs in `src/data/clients/<clientId>/propuesta/` + a brief summary
  of which sections came from where in the report.
  Audience: PME (drives), TL (validates technical content), PO (validates business framing).
---

# Improvement Proposal Builder

Phase: 2 — Discovery (post-session) | Output: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`). | Domain: Any

Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml`; the active client binds concrete tools in `clients/<CODE>.yaml`.

## What this skill does

Given a structured discovery report markdown for a client (e.g.,
`docs/guides/lidr-core/<cliente>-discovery-report.md`), this skill produces three JSONs
that drive the Improvement Proposal UI (component name in the codebase: `Propuesta de Mejora`)
for that client. The JSON filenames and the `propuesta/` directory are fixed codebase
identifiers; their rendered content follows the client `language` setting.

```
src/data/clients/<clientId>/propuesta/
├── diagnostico.json   ← executive summary + strengths/opportunities/gaps + pain points
├── mejoras.json       ← 8 SDLC phases mapped to gates with AS-IS vs TO-BE
└── flujo.json         ← React Flow diagram + Quality Gates summary
```

Resolution order at runtime (handled by `src/data/propuesta-store.ts`):
`clients/<clientId>/propuesta/<kind>.json` → `clients/base/propuesta/<kind>.json` → error UI.

A client only needs to override the JSONs that have client-specific content. The rest
inherit from `base`. This skill emits whatever the report justifies and skips the rest.

## When to use vs. skip

USE this skill when:

- A discovery report markdown exists with sections matching the structure below
- A client has a folder under `src/data/clients/<clientId>/` (registered in `client-registry`)
- You need the Propuesta UI to reflect real findings without editing TSX

DO NOT use when:

- No discovery has happened yet (use `kickoff` + `bmad-document-project` skills first)
- You want to edit the architecture diagrams (those live in `src/data/clients/<clientId>/diagrams/*.json`)
- The report has no AS-IS audit — the diagnostico JSON would be empty

## Expected discovery report structure

The skill expects a report with these (or equivalent) headings — Aramis discovery report v1.4.0
is the canonical reference (`docs/guides/lidr-core/aramis-discovery-report.md`). Heading labels
below are shown in English; a report written in the client's configured language uses the
equivalent localized headings — map them before extracting.

| Section in report                                                           | Feeds into JSON                        |
| --------------------------------------------------------------------------- | -------------------------------------- |
| `## Executive Summary`                                                      | `diagnostico.summary.executiveSummary` |
| `## Identified Pain Points` (PP-01 to PP-NN)                                | `diagnostico.painPoints[]`             |
| `## Gap Analysis vs. LIDR SDLC Methodology` → "Strengths"                   | `diagnostico.summary.fortalezas`       |
| `## Gap Analysis vs. LIDR SDLC Methodology` → gaps table                    | `diagnostico.summary.gapsCriticos`     |
| `## TO-BE Proposal` (Vision + Quick Wins + Structural Changes + Automation) | `mejoras.fases[].propuesta`            |
| `## Current Development Flow` (AS-IS narrative)                             | `mejoras.fases[].actual` per phase     |
| Specific extensions (e.g., Bridge Impact, Cross-Country)                    | extra nodes in `flujo.diagram`         |

If the report uses different headings, map them explicitly before extracting.

## Workflow

1. **Read the discovery report** end-to-end. Identify:
   - Client name (matches `client-registry`)
   - Report version + date + author (goes to `metadata.sourceReport`)
   - Section anchors (Summary, Pain Points, AS-IS Analysis, TO-BE Proposal)

2. **Read the schema** to know the contract:
   - `src/data/schemas/propuesta-schema.ts` — DiagnosticoSchema, MejorasSchema, FlujoSchema
   - Required fields, value enums, min lengths

3. **Read the base templates** to know the default content the client inherits:
   - `src/data/clients/base/propuesta/diagnostico.json`
   - `src/data/clients/base/propuesta/mejoras.json`
   - `src/data/clients/base/propuesta/flujo.json`

4. **Read the Aramis reference** to see the canonical end-to-end example:
   - `src/data/clients/aramis/propuesta/diagnostico.json`
   - `src/data/clients/aramis/propuesta/mejoras.json`
   - `src/data/clients/aramis/propuesta/flujo.json`

5. **Generate `diagnostico.json`** by extracting from the report:
   - One pain point per PP-NN with verbatim quotes attributed to speakers (verify against VTT
     when available — never invent attributions)
   - Each pain point: `id` (PP-NN), `fase` (short label), `problema` (verbatim with cite),
     `impacto` (Crítico/Alto/Medio/Bajo), `mejora` (LIDR skill or gate proposed), `evidence`
     (section anchor or VTT timestamp)
   - Summary lists with `• ` prefix to match the renderer style; do NOT include bullets
     more than once (renderer no longer prepends `•`)

6. **Decide whether to emit `mejoras.json`**:
   - YES if there are client-specific extensions to any phase (e.g., a Bridge Impact Analyzer,
     a Cross-Country Check, a custom CI gate to preserve, etc.)
   - NO if the 8 LIDR phases apply identically — base/mejoras.json covers it
   - When emitting, set `phaseNumber` 1–8 and `gateNumber` 0–7 mapping per
     `base/propuesta/mejoras.json`. Use `border` / `bg` Tailwind class strings consistent
     with phase colors in `src/data/phases.ts`.

7. **Decide whether to emit `flujo.json`**:
   - YES if the client has flow-level extensions (extra nodes for unique gates, parallel
     branches like hotfix flows, blocked states, etc.)
   - NO if the standard LIDR flow applies — base/flujo.json covers it
   - When emitting, all `x`/`y` coordinates MUST be ≥ 0 (schema rejects negatives), and
     `variant` MUST be one of the allowed Tailwind colors (see DiagramNodeSchema regex)

8. **Validate** the generated JSONs with the validation script (see below).

9. **Verify the UI** by switching to the client in the running app and confirming the three
   tabs render the new content.

## Input

| Input                             | Required  | Source                                                                       |
| --------------------------------- | --------- | ---------------------------------------------------------------------------- |
| Discovery report markdown         | ✅        | `docs/guides/lidr-core/<cliente>-discovery-report.md`                        |
| Client registered in registry     | ✅        | `src/data/clients/<cliente>/config.ts`                                       |
| Schema and Aramis reference       | ✅        | `src/data/schemas/propuesta-schema.ts`, `src/data/clients/aramis/propuesta/` |
| Pre-kickoff survey (if available) | Desirable | Cross-reference for quantitative claims                                      |
| Discovery session VTT/transcript  | Desirable | Attribution verification for verbatim quotes                                 |

## Output location

Generated JSONs go to:

```
src/data/clients/<clientId>/propuesta/
├── diagnostico.json   (always generated)
├── mejoras.json       (only if client-specific extensions exist)
└── flujo.json         (only if client-specific extensions exist)
```

Always include in `metadata`:

- `version` matching the discovery report version (e.g., `1.4.0`)
- `sourceReport` pointing to the markdown file with `@<version>` suffix
- `lastUpdated` = report's `last_updated` date
- `author` = report's `updated_by` field

## Validation

After generating, run:

```bash
npx tsx .claude/skills/propuesta-builder/scripts/validate-propuesta.ts <clientId>
```

This validates every existing JSON in `src/data/clients/<clientId>/propuesta/` against the
Zod schema and reports specific errors with paths. Exit code 0 = all valid, 1 = at least one
failure.

## Common pitfalls

| Pitfall                                 | Fix                                                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Negative node coordinates               | All `x`/`y` ≥ 0 per `DiagramNodeSchema` regex                                                              |
| Invalid color variant                   | Use only: purple, blue, green, cyan, teal, indigo, violet, orange, red, amber, emerald, sky, slate, yellow |
| Edge style not in enum                  | Only `dashed`, `red`, `green`, `purple` are allowed                                                        |
| Pain point with double bullet           | Renderer does NOT prepend `• ` — bullets must be in the data (consistent with all clients)                 |
| Inventing quotes or attributions        | Every verbatim quote must be traceable to VTT or report — set `evidence` field                             |
| Inheriting wrong content for the client | Don't emit `mejoras.json`/`flujo.json` unless there are real client-specific extensions                    |
| `phaseNumber`/`gateNumber` mismatch     | F1→G0, F2→G1, F3→G2, F4→G3, F5→G4, F6→G5, F7→G6, F8→G7                                                     |

## Quality bar

An improvement proposal is "good enough to present" when:

1. Every pain point has a verbatim quote with verified speaker attribution
2. Every solution references an existing LIDR skill, gate, or proposed agent
3. Existing client strengths (`fortalezas`) are preserved in the TO-BE (not replaced — extended)
4. Client-specific extensions are visually distinct in the flow (`flujo`) diagram
5. All 3 JSONs (or only diagnostico.json + base inheritance) validate against Zod
6. The Improvement Proposal UI renders without errors for the client
7. The report `version` and JSON `metadata.version` match

## Examples

See `examples/` for the canonical case:

- `examples/aramis-as-reference.md` — how the Aramis report v1.4.0 maps to the 3 JSONs

## Related skills

- `kickoff` — produces the initial session summary the discovery report builds on
- `bmad-document-project` — produces the inventory of artifacts to read during discovery
- `bmad-prd` / `bmad-prd` — what comes AFTER the improvement proposal is approved
- `risk-log` — Pain points often duplicate risks; cross-reference to avoid duplicates

## Changelog

| Version | Date       | Author                 | Changes                                                                                                                    |
| ------- | ---------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1.1.0   | 2026-06-09 | TL: lang+tool agnostic | Language to English-default-configurable; documented tool resolution via tool-registry (no concrete tools were hardcoded). |
| 1.0.0   | 2026-05-14 | PME: Luis Urdaneta     | Initial version.                                                                                                           |
