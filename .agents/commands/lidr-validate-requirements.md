---
description: Orchestrate full requirements validation — generate RFs, NFRs, validate traceability, and break down epics
argument-hint: [project-name]
allowed-tools: Read, Write, Bash(git:*), Skill(lidr-sdlc-tracking), Skill(lidr-external-sync), AskUserQuestion
model: sonnet
---

<!--
COMMAND: validate-requirements
VERSION: 1.0.0
AUTHOR: SDLC Team
LAST UPDATED: 2026-03-06

PURPOSE:
Orchestrates the Phase 3 Solutioning specification stage end-to-end (gate G2):
generates RFs with BDD, generates standalone NFRs, validates traceability (RTM),
detects gaps, and optionally breaks down the master epic into feature sub-epics.

USAGE:
  /lidr-validate-requirements my-project

ARGUMENTS:
  project-name: Name of the project (matches docs/projects/{name}/)

REQUIREMENTS:
  - Gate 1 PASS (PRDs approved + cross-review OK)
  - the unified PRD (prd.md) approved
  - Business Case and Epic master exist (from Phase 1)

RELATED COMMANDS:
  /lidr-advance-gate 1   - Must have passed before running this
  /lidr-advance-gate 2   - Run after this command to evaluate Gate 2
  /lidr-advance-gate 3   - Next gate after epic decomposition + sprint planning

RELATED SKILLS:
  lidr-requirements (per-rf mode)   - Step 1: Generates RFs with BDD from PRDs
  lidr-requirements (nfr mode)      - Step 2: Generates NFRs from prd.md §4 feature NFRs + Cross-Cutting NFRs (Adapt-In)
  lidr-requirements (validate mode) - Step 3: Cross-validates RFs + NFRs, generates RTM
  bmad-create-epics-and-stories - Step 4: Decomposes master epic (LIDR rules: .agents/_shared/lidr/references/epic-decomposition-rules.md)

CHANGELOG:
  v1.0.1 (2026-06-10): Prefixed skill refs (lidr-*); reframed "Phase 3
                        (Specification)" → unified "Phase 3 Solutioning,
                        specification stage".
  v1.0.0 (2026-03-06): Initial version — orchestrates the specification-stage skills
-->

# Validate Requirements for $1

> **Relationship (de-duplication):** This command owns the `/lidr-validate-requirements` slash and orchestrates the Phase 3 Solutioning specification stage — RFs via `lidr-requirements` (per-rf mode), NFRs via `lidr-requirements` (nfr mode), the RTM / 5-pass cross-validation via the **`lidr-requirements` (validate mode)** (the engine), then epic breakdown via `bmad-create-epics-and-stories`. The engine logic is the skill; this command is the verb that chains it. The skill is marked `user-invocable: false` so it no longer competes for the same slash — reach it by delegation, not the `/` menu.

Load: @../rules/lidr-sdlc/org.md and @../rules/lidr-sdlc/tech-stack.md and @../rules/lidr-sdlc/project.md

## Validate Preconditions

If "$1" is empty:
❌ Project name required. Usage: /lidr-validate-requirements [project-name]
Exit.

Check for approved PRDs:

- Look for `docs/projects/$1/prd.md` or equivalent PRD documents
- Verify PRD status is "Aprobado" (from frontmatter or cross-review sign-off)

If PRDs not found or not approved:
⚠️ PRDs for "$1" not found or not approved.

Use AskUserQuestion:

- question: "PRDs no están aprobados. ¿Continuar igualmente?"
- header: "Precondiciones"
- options:
  - Sí, tengo los PRDs en otro formato (continuar)
  - No, necesito completar Discovery primero (cancelar)

## Step 1: Generate Functional Requirements (RFs)

Using skill `lidr-requirements` (per-rf mode):

1. Read prd.md §4 (Features / FRs) and prd.md §4 feature descriptions / the Architecture doc (referenced in PRD §0)
2. Decompose each functionality into atomic RFs
3. Generate BDD Gherkin scenarios per RF (min: happy + alt + error)
4. Build dependency map with implementation clusters
5. Validate with @../skills/lidr-requirements/checklists/rf-coherence.md

Use AskUserQuestion:

- question: "¿Quieres revisar los RFs generados antes de continuar con NFRs?"
- header: "Checkpoint RF"
- options:
  - Sí, déjame revisar los RFs primero
  - No, continuar con NFRs directamente

Output: RF documents saved to `docs/projects/$1/rfs/`

## Step 2: Generate Non-Functional Requirements (NFRs)

Using skill `lidr-requirements` (nfr mode):

1. Read prd.md §4 feature NFRs + Cross-Cutting NFRs (Adapt-In)
2. Read prd.md §2 (Target User) / §2.3 (User Journeys) success metrics
3. Read `rules/tech-stack.md` for infrastructure constraints
4. Generate NFRs per category using @../skills/lidr-requirements/templates/nfr-format.md:
   - **Mandatory**: Performance, Security, Scalability, Availability, Compliance
   - **Conditional**: Accessibility, Observability, Interoperability, Maintainability
5. Cross-reference each NFR with applicable RFs
6. Generate NFR Summary Matrix

When the active client binds a domain pack, give special attention to its
domain-specific NFRs (e.g. accuracy/quality thresholds, domain processing
latency, special-category data-protection NFRs). The default NFR set stays
domain-agnostic and always covers:

- Performance latency/throughput thresholds
- Security requirements (encryption in transit/at rest, e.g. AES-256, TLS 1.2+)
- General data-protection / compliance NFRs declared by the client

Output: NFR documents saved to `docs/projects/$1/nfrs/`

## Step 3: Validate Traceability (RTM)

Using skill `lidr-requirements` (validate mode):

Execute 5 validation passes:

### Pass 1: Functional Coverage (prd.md §4 → RFs)

For each functionality in prd.md §4 (Features / FRs):
✅ At least 1 RF traces to this functionality
❌ GAP if functionality has 0 RFs

### Pass 2: Technical Coverage (prd.md → NFRs)

For each NFR category in prd.md §4 feature NFRs + Cross-Cutting NFRs (Adapt-In):
✅ At least 1 standalone NFR exists
❌ CRITICAL if a mandatory category (Security/Compliance) is missing

### Pass 3: NFR Allocation (NFRs → RFs)

For each NFR:
✅ Maps to ≥1 RF or is system-wide
❌ GAP if orphan NFR

### Pass 4: Internal Coherence

✅ No contradictions between RFs
✅ No circular dependencies
✅ NFR thresholds are consistent

### Pass 5: Testability & Sprint Readiness

✅ All RFs have ≥3 BDD scenarios
✅ All NFRs have measurable metrics
✅ Implementation clusters identified

Generate RTM using @../skills/lidr-requirements/templates/rtm.md
Output: `docs/projects/$1/rtm.md`

## Step 4: Epic Breakdown (Optional)

Use AskUserQuestion:

- question: "RTM generado. ¿Deseas descomponer la épica master en sub-épicas?"
- header: "Epic Breakdown"
- options:
  - Sí, descomponer épica ahora
  - No, lo haré manualmente en Sprint Planning
  - Sí, pero déjame revisar el RTM primero

If yes, using skill `bmad-create-epics-and-stories` with LIDR rules:

1. Load LIDR decomposition rules: @../../\_shared/lidr/references/epic-decomposition-rules.md
2. Read master epic — via `lidr-sdlc-tracking`, which resolves {{TRACKING_TOOL}} from the registry (or the `lidr-tracking-integration` output)
3. Group RFs into feature epics by cluster + business cohesion
4. Assign NFRs to epics
5. Calculate dependencies between epics
6. Estimate sprint ranges per epic
7. Generate epic breakdown using @../../\_shared/lidr/templates/epic.md (artifact language follows the client `language` setting — see `_shared/lidr/integrations/tool-registry.yaml`, default English)

Output: `docs/projects/$1/epics.md`

## Gate 2 Readiness Check

Evaluate Gate 2 criteria:
| Criterion | Status |
|-----------|--------|
| 100% PRD functionalities covered by RFs | ✅/❌ |
| All mandatory NFR categories present | ✅/❌ |
| All NFRs allocated to RFs or system-wide | ✅/❌ |
| 0 contradictions, 0 circular dependencies | ✅/❌ |
| All RFs have ≥3 BDD scenarios | ✅/❌ |
| All NFRs have measurable metrics | ✅/❌ |
| RTM generated and complete | ✅/❌ |
| Implementation clusters identified | ✅/❌ |

If all PASS → "Ready for /lidr-advance-gate 2"
If any FAIL → Report gaps with action items

## Report

```
/lidr-validate-requirements $1 ✅

Phase 3 Solutioning — Specification stage complete (toward G2):
  - RFs generated: {N} ({N} Must, {N} Should, {N} Could)
  - NFRs generated: {N} ({N} categories covered)
  - RTM coverage: {N}% functional, {N}% NFR
  - Gaps found: {N} critical, {N} warnings
  - Implementation clusters: {N}
  - Epic breakdown: {Yes/Deferred}

Gate 2 Readiness: {PASS / FAIL / CONDITIONAL}

Artifacts generated:
  📄 docs/projects/$1/rfs/ ({N} files)
  📄 docs/projects/$1/nfrs/ ({N} files)
  📄 docs/projects/$1/rtm.md
  📄 docs/projects/$1/epics.md (if generated)

Next: /lidr-advance-gate 2 (if PASS)
```

## Error Handling

If `lidr-sdlc-tracking` cannot resolve {{TRACKING_TOOL}} from the registry:
→ Operate with local files, skip tracking-ticket creation
→ Output JSON for manual {{TRACKING_TOOL}} population

If `lidr-external-sync` cannot resolve {{DOCS_TOOL}} from the registry:
→ Save all documents as local markdown
→ Provide instructions for manual {{DOCS_TOOL}} upload

If PRDs are incomplete:
→ Generate partial RFs/NFRs with explicit markers for gaps
→ Report gaps as FAIL items in Gate 2 readiness
