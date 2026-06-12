---
description: Evaluate gate and generate handoff package
argument-hint: [gate-number]
allowed-tools: Read, Write, Bash(git:*), Bash(jq:*), Skill(lidr-sdlc-tracking), AskUserQuestion
model: opus
---

<!--
COMMAND: lidr-advance-gate
VERSION: 2.1.2
AUTHOR: SDLC Team
LAST UPDATED: 2026-06-11

PURPOSE:
Universal handoff orchestrator — evaluates a gate's criteria with CONTENT
validation, cross-coherence checks, weighted scoring, and tracking registration.
Covers all 8 gates (G0-G7) of the unified SDLC phase model
(see _shared/lidr/UNIFIED-PHASES.md).

USAGE:
  /lidr-advance-gate 0   -> Phase 1 Analysis -> Phase 2 Planning (Intake)
  /lidr-advance-gate 3   -> Phase 3 Solutioning -> Phase 4 Implementation
  /lidr-advance-gate 7   -> release -> Producción (Gate Final)

ARGUMENTS:
  gate-number: 0-7 (required). Maps to the unified phase model:
    0 = Phase 1 Analysis -> Phase 2 Planning (Intake)
    1 = Phase 2 Planning -> Phase 3 Solutioning (PRD approved)
    2 = Phase 3 Solutioning: specification -> sprint-planning (Specs complete)
    3 = Phase 3 Solutioning -> Phase 4 Implementation (Ready to implement)
    4 = Phase 4 Implementation: development -> qa (DoD met)
    5 = Phase 4 Implementation: qa -> security (QA sign-off)
    6 = Phase 4 Implementation: security -> release (Security sign-off)
    7 = Phase 4 Implementation: release -> Producción (CR approved — Gate Final)

REQUIREMENTS:
  - .claude/rules/lidr-sdlc/ configured (org.md, tech-stack.md, project.md, workflows.md)
  - Tracking access for status transitions (degrades without)
  - Notification system for status updates (degrades without)

RELATED COMMANDS:
  /lidr-implement-ticket - Gate 4 per-ticket workflow
  /lidr-prepare-testing  - Pre-Gate 5 QA preparation
  /lidr-create-release-notes - Pre-Gate 7 changelog

OUTPUT TEMPLATE:
  skills/lidr-gate-evaluation/templates/gate-evaluation.md (tpl-gate-evaluation)

CHANGELOG:
  v1.0.0 (2025-03-05): Initial release - all 8 gates
  v2.0.0 (2026-03-09): Content validation, cross-coherence, weighted scoring,
                        tracking Gate Status registration, tpl-gate-evaluation output
  v2.1.0 (2026-06-09): Step 4 is now manifest-driven — reads
                        _shared/lidr/gate-evidence.yaml (BMad artifacts as primary
                        evidence + LIDR gap-fillers). Gate verifies BMad outputs
                        instead of re-implementing them. LIDR quantitative guards
                        (RF-BDD, NFR, RTM, zero-tolerance) preserved on top.
  v2.1.1 (2026-06-10): Repointed rule/template loads to real paths
                        (rules/lidr-sdlc/, skills/lidr-gate-evaluation/); gate map
                        rewritten to unified phase model (G0-G7); handoffs now
                        written to AND read from docs/projects/{client}/handoffs/
                        gate-N-handoff.md (aligns with gate-evidence.yaml contract).
  v2.1.2 (2026-06-11): Tool-routing — Jira registration/transition prose routed
                        through Skill(lidr-sdlc-tracking) and {{TRACKING_TOOL}};
                        Jira priority enum replaced by neutral severity mapping
                        resolved by the tracking skill.
-->

> **Model note** (per @../rules/lidr-sdlc/model-selection.md): gate evaluation is
> cross-cutting analysis — stays on the session model; promote to Opus high only
> if CRITICAL coherence gaps surface.

# Advance Gate $1

Load context from rules FIRST:

- @../rules/lidr-sdlc/org.md -> organizational standards, roles, gate criteria
- @../rules/lidr-sdlc/tech-stack.md -> technical conventions
- @../rules/lidr-sdlc/project.md -> current project context
- @../rules/lidr-sdlc/workflows.md -> role permissions, command chains
- @../rules/lidr-sdlc/documentation.md -> doc governance standards

## Step 1: Validate Gate Number

If "$1" is empty or not a number 0-7:
ERROR: Gate number required (0-7).
Usage: /lidr-advance-gate [0-7]
Show gate map and exit.

## Step 2: Verify Role Authorization

Check @../rules/lidr-sdlc/workflows.md for the role permissions matrix.
Authorized roles for /lidr-advance-gate: PME, PO, Tech Lead, QA Lead, Security Lead, DevOps.

Use AskUserQuestion to confirm role:

- question: "Cual es tu rol para esta evaluacion de gate?"
- header: "Tu rol"
- options:
  - PME (Project Manager)
  - PO (Product Owner)
  - Tech Lead (R&D Lead)
  - QA Lead
  - Security Lead
  - DevOps

If role is "Dev" -> "Devs no ejecutan /lidr-advance-gate. Usa /lidr-implement-ticket para tu ticket." Exit.

## Step 3: Verify Previous Gate

If $1 > 0, check that Gate ($1 - 1) has been passed.
Look for previous handoff package: `docs/projects/{client}/handoffs/gate-{N-1}-handoff.md`

If not found:
WARNING: Gate {N-1} handoff not found. Previous gate may not be passed.

Use AskUserQuestion:

- question: "Gate anterior no registrado. Continuar de todos modos?"
- header: "Confirmar"
- options:
  - Si (Continuar con la evaluacion)
  - No (Cancelar y resolver primero)

If "No" -> Exit.

## Step 4: Evaluate Gate Criteria — Existence + CONTENT Validation

Based on gate number $1, evaluate the specific criteria.

**CRITICAL: For EVERY artifact, validate TWO dimensions:**

1. **Existence**: The artifact file/document exists
2. **Content validity**: The artifact has meaningful content (not empty, not placeholder)

**Content validation rules:**

- File must have >50 characters of meaningful content (excluding frontmatter)
- Required sections must be present AND populated (not "TBD", "TODO", "N/A" without justification)
- Frontmatter must be valid: id, version, last_updated, status fields present
- References to other artifacts must be resolvable (read the referenced file to confirm it exists)
- An empty or placeholder artifact is WORSE than a missing one — it gives false confidence

### 4a. Load the Gate Evidence Manifest (source of per-gate criteria)

Read `@../_shared/lidr/gate-evidence.yaml`. This manifest is the SINGLE source
of truth for "what evidence satisfies each gate". The evidence comes PRIMARILY
from BMad artifacts (the engine that produces PRDs, architecture, epics,
stories, test plans, brownfield docs) plus a few LIDR custom-skill outputs
(gap-fillers BMad has no concept of: business case, RTM, capacity, security
compliance, change/rollback/release).

> **The gate VERIFIES evidence — it never regenerates it. BMad is read-only.**

Resolve `path_vars`: substitute `{client}` with the active CLIENT_CODE (from
@../rules/lidr-sdlc/project.md); BMad artifacts resolve under `_bmad-output/`
(see `_bmad/*/config.yaml`). Handoffs and sign-offs resolve under
`docs/projects/{client}/handoffs/`.

### 4b. Evaluate the evidence for Gate $1

From the manifest entry `gates.G$1`, evaluate EACH item with the two dimensions
above (existence + content):

1. **`bmad_evidence`** — glob each `artifact`; existence = ≥1 file matches.
   BMad filenames vary by config, so match leniently by producing `skill` +
   glob. Read a match and apply the content-validity rules.
2. **`lidr_evidence`** — same, for LIDR custom-skill outputs.
3. **`checklist`** — confirm each binary statement against the evidence found.
4. **`signoffs`** — verify the sign-off artifact exists and is dated.

**Verdict rules** (from manifest `matching`):

- Any `required: true` artifact missing or empty → **FAIL**.
- Only `required: false` evidence missing → cap at **CONDITIONAL**.
- All required evidence present + checklist satisfied + sign-offs dated → **PASS**.

### 4c. Quantitative guards (LIDR-specific, applied ON TOP of the manifest)

These hard counters BLOCK regardless of the manifest verdict — they encode the
zero-tolerance and traceability rules from @../rules/lidr-sdlc/org.md:

- **G2 — RF-BDD 100%**: RF_with_BDD / RF_total must equal 100%. On shortfall → FAIL with the list of RFs missing Given/When/Then.
- **G2 — NFR measurability 100%**: every NFR needs metric + threshold + measurement method. <100% → FAIL (Gates 5/6 cannot evaluate non-measurable NFRs).
- **G5 — RTM coverage 100%**: test_cases_linked / RF_total must equal 100%. <100% → FAIL with the list of untested RFs (blocks QA sign-off).
- **G6 — Zero-tolerance**: 0 Critical/High vulnerabilities across SAST/SCA/DAST. Any open → FAIL.

For each criterion, report: PASS / WARN / FAIL with specific detail.

## Step 5: Ecosystem Health Validation

**CRITICAL**: Before evaluating gate criteria, validate ecosystem health by
running the count-drift guard:

```bash
bash .agents/hooks/scripts/validate-ecosystem-counts.sh
```

A non-zero exit means the ecosystem sources of truth have drifted (skill/command/
rule/agent/hook counts out of sync with CLAUDE.md). Treat drift as a blocking
issue for critical gates.

**Ecosystem requirements by gate:**

- Gates 0,1,2,7 (critical): require the count guard to pass (exit 0)
- Gates 3,4,5,6 (operational): warn on drift but allow with action items

If the count guard fails, provide specific actions to fix:

1. Run `./.agents/sync.sh` to re-sync all platforms
2. Fix count drift between filesystem and CLAUDE.md
3. Re-run `bash .agents/hooks/scripts/validate-ecosystem-counts.sh`

## Step 6: Cross-Coherence Validation

Validate referential integrity BETWEEN artifacts across phases:

**Cross-reference checks:**

| Source                | Target                                             | Validation                                          |
| --------------------- | -------------------------------------------------- | --------------------------------------------------- |
| RF -> PRD             | Each RF must reference a valid PRD section         | Read RF, extract PRD ref, verify PRD section exists |
| US -> RF              | Each US must trace to a valid RF                   | Read US, extract RF ref, verify RF exists           |
| BDD -> AC             | Each BDD scenario must map to acceptance criteria  | Read test, extract AC ref, verify in US             |
| Test -> RF (RTM)      | Each RF must have at least 1 linked test           | Cross RTM matrix with test execution                |
| Checklist -> Artifact | Each checklist item must reference a real artifact | Verify paths in checklist evaluations               |

**Process:**

1. For the current gate, identify all SOURCE artifacts (produced in current/previous phases)
2. For each source, extract references to TARGET artifacts
3. Attempt to READ each referenced target — if not found, mark as BROKEN REF
4. Calculate: refs_valid / refs_total = coherence_score

**Gate-specific coherence:**

- Gate 2: RF->PRD traceability + BDD coverage per RF
- Gate 3: US->RF traceability + DoR per US
- Gate 4: PR->Ticket traceability + DoD per ticket
- Gate 5: Test->RF traceability (RTM completeness)

If any broken reference found -> CONDITIONAL (with action items to fix refs)
If >20% broken references -> FAIL

## Step 7: Generate Handoff Package (via tpl-gate-evaluation)

If overall result is PASS or CONDITIONAL:

Generate handoff package using **tpl-gate-evaluation** template (@../skills/lidr-gate-evaluation/templates/gate-evaluation.md) and save to `docs/projects/{client}/handoffs/gate-$1-handoff.md` (the same path Step 3 reads and that `_shared/lidr/gate-evidence.yaml` declares for sign-offs).

The output MUST follow the tpl-gate-evaluation schema:

- Header: gate, evaluator, date, project, sprint, epic
- Artifacts Evaluation table with existence + content validation
- Checklists Evaluation table with item-level pass/fail
- Cross-Coherence Evaluation table with reference validation
- Signoffs Evaluation table (Gates 5/6)
- Weighted Score Calculation
- Verdict with threshold evaluation
- Action Items (if CONDITIONAL or FAIL)
- Evidence with links to actual files
- Handoff Context for next phase
- Tracking-tool registration metadata

## Step 8: Execute Transitions

If PASS:

- Tracking: transition epic/tickets to next phase status (manual or script)
- Notification: notify next phase's team with handoff summary
- If Gate 1 PASS -> suggest: "Run lidr-requirements skill (per-rf mode) to draft RFs from PRDs"
- If Gate 2 PASS -> suggest: "Run lidr-user-stories skill to draft US from RFs"
- If Gate 3 PASS -> suggest: "Devs can now run /lidr-create-branch [ID] for their tickets"
- If Gate 6 PASS -> suggest: "Run /lidr-create-release-notes then /lidr-update-changelog"

If CONDITIONAL:

- Tracking (via `lidr-sdlc-tracking`, resolving {{TRACKING_TOOL}} from the registry): transition epic/tickets to next phase BUT add comment with action items
- Notification: notify with "CONDITIONAL" status and list mandatory action items with deadlines
- Create {{TRACKING_TOOL}} subtasks for each action item (assigned to owner role)

If FAIL:

- List ALL failed criteria with specific actions to fix each
- Suggest who should fix each item (based on role from @../rules/lidr-sdlc/workflows.md)
- Do NOT transition tracking status
- Create {{TRACKING_TOOL}} subtasks for each FAIL item (assigned to owner role)

## Step 9: Calculate Weighted Score

Apply the weighted scoring model:

| Dimension  | Weight | Calculation                                           |
| ---------- | ------ | ----------------------------------------------------- |
| Artifacts  | 40%    | (artifacts_pass / artifacts_total) \* 100             |
| Checklists | 35%    | (checklist_items_pass / checklist_items_total) \* 100 |
| Coherence  | 15%    | (refs_valid / refs_total) \* 100                      |
| Signoffs   | 10%    | (signoffs_signed / signoffs_required) \* 100          |

**Total = (Artifacts _ 0.40) + (Checklists _ 0.35) + (Coherence _ 0.15) + (Signoffs _ 0.10)**

**Verdict thresholds:**

- > = 90%: PASS — proceed to next phase
- 70-89%: CONDITIONAL — proceed with mandatory action items (deadline required)
- < 70%: FAIL — block advancement, resolve all FAIL items

**Special rules:**

- Any single Critical artifact missing -> automatic FAIL regardless of score
- Any signoff missing when required (Gates 5/6) -> automatic FAIL
- RF BDD coverage <100% at Gate 2 -> automatic FAIL
- RNF measurability <100% at Gate 2 -> automatic FAIL
- RTM coverage <100% at Gate 5 -> automatic FAIL (blocks QA sign-off)

## Step 10: Report

Present final report:

```
## /lidr-advance-gate $1 — Result

Gate $1: [Phase Name] -> [Next Phase Name]
Status: PASS / CONDITIONAL / FAIL
Score: [total_score]% (Artifacts: [a]% | Checklists: [c]% | Coherence: [co]% | Signoffs: [s]%)
Approved by: [role]
Date: [today]

[Criteria table from Step 4]
[Cross-coherence results from Step 5]
[Weighted score breakdown from Step 8]
[Handoff package link if PASS/CONDITIONAL]
[Action items with owners and deadlines if CONDITIONAL/FAIL]

Next command: /lidr-advance-gate [N+1] (when next phase completes)
```

## Step 11: Register Result in the Tracking Tool

Via `lidr-sdlc-tracking` (which resolves {{TRACKING_TOOL}} from the registry),
register the gate evaluation result:

1. **Update Epic**: Set custom field "Gate Status" on the epic:
   - Value: `Gate {N}: {verdict} ({score}%) — {date}`
   - If field does not exist, add as comment with label `gate-evaluation`

2. **Create Subtasks** (if CONDITIONAL or FAIL):
   - One subtask per action item from the evaluation
   - Title: `[Gate {N}] {action_item_description}`
   - Assignee: based on owner role from action items
   - Priority: mapped from neutral severity (Critical->highest, High->high, Medium->medium), then resolved to the bound tracker's priority enum by `lidr-sdlc-tracking`
   - Label: `gate-remediation`

3. **Add Comment to Epic**:

   ```
   Gate {N} Evaluation — {verdict} ({score}%)
   Evaluator: {role}
   Date: {date}
   Handoff: docs/projects/{client}/handoffs/gate-{N}-handoff.md
   Action Items: {count}
   Next: /lidr-advance-gate {N+1}
   ```

4. **Transition Epic**:
   - PASS: Move to next phase status
   - CONDITIONAL: Move to next phase + add "gate-conditional" label
   - FAIL: Keep current status + add "gate-blocked" label
