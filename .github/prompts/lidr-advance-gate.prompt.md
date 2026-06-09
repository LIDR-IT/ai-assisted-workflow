---
description: Evaluate gate and generate handoff package
agent: 'agent'
---

<!--
COMMAND: advance-gate
VERSION: 2.0.0
AUTHOR: SDLC Team
LAST UPDATED: 2026-03-09

PURPOSE:
Universal handoff orchestrator — evaluates a gate's criteria with CONTENT
validation, cross-coherence checks, weighted scoring, and Jira registration.
Covers all 8 gates (0-7) of the SDLC.

USAGE:
  /advance-gate 0        -> Originacion -> Discovery
  /advance-gate 3        -> Sprint Planning -> Desarrollo
  /advance-gate 7        -> Deploy -> Produccion (Gate Final)

ARGUMENTS:
  gate-number: 0-7 (required). Maps to:
    0 = Originacion -> Discovery
    1 = Discovery -> Especificacion
    2 = Especificacion -> Sprint Planning
    3 = Sprint Planning -> Desarrollo
    4 = Desarrollo -> QA (sprint aggregator)
    5 = QA -> Seguridad
    6 = Seguridad -> Despliegue
    7 = Despliegue -> Produccion (Gate Final)

REQUIREMENTS:
  - .claude/rules/ configured (org.md, tech-stack.md, project.md, workflows.md)
  - Jira access for status transitions (degrades without)
  - Notification system for status updates (degrades without)

RELATED COMMANDS:
  /implement-ticket - Gate 4 per-ticket workflow
  /prepare-testing  - Pre-Gate 5 QA preparation
  /create-release-notes - Pre-Gate 7 changelog

OUTPUT TEMPLATE:
  skills/{skill-name}/templates/gate-evaluation.md (tpl-gate-evaluation)

CHANGELOG:
  v1.0.0 (2025-03-05): Initial release - all 8 gates
  v2.0.0 (2026-03-09): Content validation, cross-coherence, weighted scoring,
                        Jira Gate Status registration, tpl-gate-evaluation output
  v2.1.0 (2026-06-09): Step 4 is now manifest-driven — reads
                        _shared/lidr/gate-evidence.yaml (BMad artifacts as primary
                        evidence + LIDR gap-fillers). Gate verifies BMad outputs
                        instead of re-implementing them. LIDR quantitative guards
                        (RF-BDD, NFR, RTM, zero-tolerance) preserved on top.
-->

> **Model note** (per @../rules/lidr-sdlc/model-selection.md): gate evaluation is
> cross-cutting analysis — stays on the session model; promote to Opus high only
> if CRITICAL coherence gaps surface.

# Advance Gate $1

Load context from rules FIRST:

- @../rules/org.md -> organizational standards, roles, gate criteria
- @../rules/tech-stack.md -> technical conventions
- @../rules/project.md -> current project context
- @../rules/workflows.md -> role permissions, command chains
- @../rules/documentation.md -> doc governance standards

## Step 1: Validate Gate Number

If "$1" is empty or not a number 0-7:
ERROR: Gate number required (0-7).
Usage: /advance-gate [0-7]
Show gate map and exit.

## Step 2: Verify Role Authorization

Check @../rules/workflows.md for the role permissions matrix.
Authorized roles for /advance-gate: PME, PO, Tech Lead, QA Lead, Security Lead, DevOps.

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

If role is "Dev" -> "Devs no ejecutan /advance-gate. Usa /implement-ticket para tu ticket." Exit.

## Step 3: Verify Previous Gate

If $1 > 0, check that Gate ($1 - 1) has been passed.
Look for previous handoff package: `docs/projects/{project}/handoffs/gate-{N-1}-handoff.md`

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
(see `_bmad/*/config.yaml`).

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

## Step 5: Ecosystem Health Validation (NEW - Phase 1 Enhancement)

**CRITICAL**: Before evaluating gate criteria, validate ecosystem health using the new validation engine:

```bash
# Import ecosystem validation
import { validateForGateAdvancement } from '../_shared/validators/ecosystem-validation.js';

# Run ecosystem health check
const ecosystemResult = await validateForGateAdvancement($1);

if (!ecosystemResult.success) {
  ERROR: Ecosystem health check failed for Gate $1

  ecosystemResult.issues.forEach(issue => {
    console.log(`${issue.severity}: ${issue.message}`);
    console.log(`Suggestion: ${issue.suggestion}`);
  });

  EXIT with ecosystem health report and recommendations.
}

console.log(`✅ Ecosystem health: ${ecosystemResult.score.toFixed(1)}/5.0 for Gate $1`);
```

**Ecosystem requirements by gate:**

- Gates 0,1,2,7 (critical): Require ≥90% ecosystem health
- Gates 3,4,5,6 (operational): Require ≥70% ecosystem health

If ecosystem health fails, provide specific actions to fix:

1. Run ecosystem synchronization script
2. Fix count drift between filesystem and tracking
3. Resolve validation script issues
4. Update tracking files (HelpCenter.tsx, CLAUDE.md, stats.ts)

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

Generate handoff package using **tpl-gate-evaluation** template (@../skills/gate-evaluation/templates/gate-evaluation.md) and save to `.claude/handoffs/gate-$1-handoff.local.md`.

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
- Jira Registration metadata

## Step 8: Execute Transitions

If PASS:

- Jira: transition epic/tickets to next phase status (manual or script)
- Notification: notify next phase's team with handoff summary
- If Gate 1 PASS -> suggest: "Run generate-rf skill to draft RFs from PRDs"
- If Gate 2 PASS -> suggest: "Run user-stories skill to draft US from RFs"
- If Gate 3 PASS -> suggest: "Devs can now run /create-branch [ID] for their tickets"
- If Gate 6 PASS -> suggest: "Run /create-release-notes then /update-changelog"

If CONDITIONAL:

- Jira: transition epic/tickets to next phase BUT add comment with action items (manual or script)
- Notification: notify with "CONDITIONAL" status and list mandatory action items with deadlines
- Create Jira subtasks for each action item (assigned to owner role)

If FAIL:

- List ALL failed criteria with specific actions to fix each
- Suggest who should fix each item (based on role from workflows.md)
- Do NOT transition Jira status
- Create Jira subtasks for each FAIL item (assigned to owner role)

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
- RTM coverage <100% at Gate 5 -> automatic FAIL (blocks so-qa)

## Step 10: Report

Present final report:

```
## /advance-gate $1 — Result

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

Next command: /advance-gate [N+1] (when next phase completes)
```

## Step 11: Register Result in Jira

Via Jira (manual or script), register the gate evaluation result:

1. **Update Epic**: Set custom field "Gate Status" on the epic:
   - Value: `Gate {N}: {verdict} ({score}%) — {date}`
   - If field does not exist, add as comment with label `gate-evaluation`

2. **Create Subtasks** (if CONDITIONAL or FAIL):
   - One subtask per action item from the evaluation
   - Title: `[Gate {N}] {action_item_description}`
   - Assignee: based on owner role from action items
   - Priority: mapped from severity (Critical->Blocker, High->Critical, Medium->Major)
   - Label: `gate-remediation`

3. **Add Comment to Epic**:

   ```
   Gate {N} Evaluation — {verdict} ({score}%)
   Evaluator: {role}
   Date: {date}
   Handoff: .claude/handoffs/gate-{N}-handoff.local.md
   Action Items: {count}
   Next: /advance-gate {N+1}
   ```

4. **Transition Epic**:
   - PASS: Move to next phase status
   - CONDITIONAL: Move to next phase + add "gate-conditional" label
   - FAIL: Keep current status + add "gate-blocked" label
