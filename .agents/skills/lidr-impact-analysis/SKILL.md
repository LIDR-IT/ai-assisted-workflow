---
name: lidr-impact-analysis
description: This skill should be used when the user asks to "analyze change impact", "check contract impact", "validate variant compatibility", "what does this change break", "análisis de impacto". Analyzes the impact of a proposed change (RF, diff, PRD delta) against client-maintained registries — integration/contract catalogs (APIs, enums, schemas shared with other systems) and variant/configuration matrices (countries, brands, tenants, editions). Produces an impact report with affected entries, severity, and required actions. Requires the client registry artifacts to exist; degrades to a guided manual checklist when they don't.
id: impact-analysis
version: "1.0.0"
last_updated: "2026-06-10"
updated_by: "TL: Capability gap closure"
status: active
phase: 4
stage: development
owner_role: "Tech Lead"
domain_agnostic: true
language_default: en
integrations: []
---

# Impact Analysis — Contracts & Variants

Phase: 4 — Implementation · development (contract mode at G4) | also consumed at G2 (variant mode, specification stage) | Language: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`).

Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml`; the active client binds concrete tools in `clients/<CODE>.yaml`.

## Relationship to BMad

LIDR-unique: BMad has no impact-analysis artifact. `bmad-investigate` covers _reactive_ forensic analysis (something already broke); this skill covers _proactive_ impact analysis (what would break) by matching a proposed change against client-maintained registries. It consumes outputs of `lidr-generate-rf` / `bmad-prd` (variant mode) and code diffs / `lidr-spec-*` changes (contract mode), and feeds Gate 2 and Gate 4 evidence (`gate-evidence.yaml`, optional entries).

## What this skill is — and what the client provides

The framework provides three things:

1. **Registry formats** (`templates/contract-registry.yaml`, `templates/variant-matrix.yaml`) — the schema the client fills in.
2. **The analysis procedure** (two modes, below) — deterministic matching of a change surface against registry entries.
3. **The report template** (`templates/impact-report.md`) — auditable output with severity and verdict.

The **client provides the data**: the registries are CLIENT-OWNED artifacts that live in `docs/projects/{client}/registries/` (`contract-registry.yaml`, `variant-matrix.yaml`). Without populated registries the skill cannot produce an automated analysis — see _Degraded mode_.

## Two analysis modes

| Mode                      | Question it answers                                                                                     | Registry consumed        | Typical input                                   | Gate                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------ | ----------------------------------------------- | ------------------------------------ |
| **contract-impact**       | Does this change break a contract (enum, API, schema, event, message) shared with another system?       | `contract-registry.yaml` | Code diff, `lidr-spec-*` change, API spec delta | G4 (development → qa)                |
| **variant-compatibility** | Is this requirement/feature compatible with every variant (country, brand, tenant, edition) it touches? | `variant-matrix.yaml`    | New/modified RFs, PRD delta, user story         | G2 (specification → sprint-planning) |

## Inputs

| Input                                                     | Required                 | Source                                                                              |
| --------------------------------------------------------- | ------------------------ | ----------------------------------------------------------------------------------- |
| Change artifact (RF/spec/PRD delta/diff/change container) | ✅                       | `lidr-generate-rf`, `bmad-prd`, git diff, `docs/projects/{client}/changes/<name>/`  |
| Client registry file for the chosen mode                  | ✅ (degrades if missing) | `docs/projects/{client}/registries/contract-registry.yaml` or `variant-matrix.yaml` |
| Architecture doc (system boundaries)                      | Desirable                | `bmad-create-architecture` output                                                   |
| Risk log (known integration/variant risks)                | Desirable                | `lidr-risk-log` output                                                              |

## Procedure — contract-impact mode

1. **Load registry**: read `docs/projects/{client}/registries/contract-registry.yaml`. Record its `version` and `last_updated` (they go in the report). If missing → Degraded mode.
2. **Extract touched surface from the change**: enums, types, API endpoints/routes, DB schema elements, events/messages, serialized payloads that the diff/spec adds, modifies, or removes. Use file paths, type names, endpoint paths, and identifiers as match keys.
3. **Match against registry entries**: compare the touched surface with each entry's `source_path`, `id`, and `type`. Direct hit = entry whose owned surface is modified. Indirect hit = entry whose `consumer_systems` depend on a modified element.
4. **Classify severity per affected entry**:
   - **Critical** — breaking change to a contract with ≥1 external consumer (removed enum value, renamed field, changed type, removed endpoint).
   - **High** — backward-incompatible behavior change consumers may rely on (semantics, ordering, nullability, error codes).
   - **Medium** — additive change consumers must eventually adopt (new enum value, new optional field) or contract owned here with internal-only consumers.
   - **Low** — touched a registered surface without observable contract change (refactor, comments, internal rename).
5. **Emit report + recommended actions**: write `docs/projects/{client}/impact/contract-impact-<change-name>-YYYY-MM-DD.md` from `templates/impact-report.md`. Actions per severity: Critical → block until consumers coordinated (versioning, migration, deprecation window per tech-stack §4.4); High → consumer notification + regression tests; Medium → changelog + consumer backlog item; Low → none.
6. **Verdict**: BLOCKING if any Critical · REVIEW REQUIRED if any High/Medium · SAFE otherwise.

## Procedure — variant-compatibility mode

1. **Load registry**: read `docs/projects/{client}/registries/variant-matrix.yaml`. Record `version`/`last_updated`. If missing → Degraded mode.
2. **Extract touched surface from the change**: features, configuration dimensions, flows, and scope declarations the RFs/PRD delta introduce or modify. Identify whether the change declares itself `global` or `variant-specific` (team convention).
3. **Match against variants**: for each variant in the matrix, check the touched dimensions against that variant's configuration values, feature flags, and overrides. Flag conflicts (change assumes a value a variant overrides), gaps (variant lacks a dimension the change requires), and silent scope creep (global change altering variant-specific behavior).
4. **Classify severity per affected variant**:
   - **Critical** — change breaks an existing variant configuration or removes behavior a variant depends on.
   - **High** — change conflicts with a variant override; needs per-variant decision before specs freeze.
   - **Medium** — change requires a new configuration value per variant (default exists but should be confirmed).
   - **Low** — variant touched but behavior identical (verified against matrix).
5. **Emit report + recommended actions**: write `docs/projects/{client}/impact/variant-compatibility-<change-name>-YYYY-MM-DD.md` from `templates/impact-report.md`. Actions: Critical/High → resolve with variant owners before G2; Medium → add per-variant acceptance criteria to the RFs; Low → record as verified.
6. **Verdict**: BLOCKING / REVIEW REQUIRED / SAFE (same rules as contract mode).

## When each gate consumes it

- **G2 checklist (Specs Complete)** — variant-compatibility report for new/modified RFs. Optional evidence in `gate-evidence.yaml` (`{client_root}/impact/variant-compatibility-*.md`); recommended whenever the product has more than one variant.
- **G4 checklist (DoD / Code Quality)** — contract-impact report for the diff/change. Optional evidence in `gate-evidence.yaml` (`{client_root}/impact/contract-impact-*.md`); recommended whenever the system shares contracts with other systems.

## Degraded mode (no registry)

If the required registry does not exist or is empty:

1. **State it explicitly** in the output: automated analysis is impossible without the client registry — do NOT fabricate entries.
2. **Emit the guided manual checklist** instead of a matched report:
   - Contract mode: Which enums/types/endpoints/schemas/events does this change touch? Who else consumes each one (other services, sync jobs, mobile apps, partners)? Is the change additive or breaking? Who must be notified?
   - Variant mode: Which variants (countries/brands/tenants/editions) does this feature reach? Does any variant override the touched configuration? Is the change declared global or variant-specific? Which variant owners must confirm?
3. **Recommend creating the registry** from `templates/contract-registry.yaml` / `templates/variant-matrix.yaml` into `docs/projects/{client}/registries/`, and registering the gap in `lidr-risk-log` (manual-only impact analysis is itself a risk).
4. Verdict in degraded mode caps at **REVIEW REQUIRED** (never SAFE — there is no registry to verify against).

## Output Location

Generated reports: **`docs/projects/{client}/impact/`**

- `contract-impact-<change-name>-YYYY-MM-DD.md`
- `variant-compatibility-<change-name>-YYYY-MM-DD.md`

Client registries (CLIENT-OWNED data, maintained by the client per their DTC duty — update in the same PR that changes a contract or a variant):

- `docs/projects/{client}/registries/contract-registry.yaml`
- `docs/projects/{client}/registries/variant-matrix.yaml`

## Key Rules

- **Registries are client-owned data**: the framework ships the format and the procedure, never the entries. Never invent registry content.
- **Registry version travels in the report**: every report records the registry `version` + `last_updated` it was matched against — an analysis is only as fresh as its registry.
- **Severity is consumer-driven**: a breaking change with zero external consumers is not Critical; an additive change consumed by a regulated partner may be High. Always reason from `consumer_systems` / variant ownership.
- **Stale registry warning**: if the registry `last_updated` is older than 90 days, WARN in the report (staleness policy per `lidr-sdlc/documentation.md` §7).
- **Human sign-off**: the report verdict is input for the gate decision; a human (TL for G4, PO+QA for G2) signs the gate. Mark business-judgment calls `[REQUIERE VALIDACIÓN HUMANA]`.
- **Domain-agnostic**: works for any stack and industry — automotive multi-country retail, multi-tenant SaaS, white-label fintech, healthcare editions. Examples in templates are illustrative placeholders only.

## Changelog

| Version | Date       | Author                     | Changes                                                                                                                                                              |
| ------- | ---------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0.0   | 2026-06-10 | TL: Capability gap closure | Initial creation — closes PP-05-class (contract impact) and PP-06-class (variant compatibility) framework gaps with one skill driven by client-maintained registries |
