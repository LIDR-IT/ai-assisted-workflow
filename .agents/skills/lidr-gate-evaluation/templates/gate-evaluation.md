---
id: tpl-gate-evaluation
version: "1.0.0"
last_updated: "2026-03-09"
updated_by: "TL: Lead Engineer"
status: active
code: "T-GATE-001"
name: "Gate Evaluation Report"
used_by:
  - /advance-gate (all 8 gates)
---

# Gate Evaluation Report — Gate {N}

> Template estandarizado de output para `/advance-gate`. Todos los gates (0-7) usan este formato.
> Generado automaticamente por el command `/advance-gate {N}`.

---

## Header

| Campo         | Valor                            |
| ------------- | -------------------------------- |
| **Gate**      | {N} — {phase_from} -> {phase_to} |
| **Evaluador** | {role} — {evaluator_name}        |
| **Fecha**     | {date}                           |
| **Proyecto**  | {project_id} — {project_name}    |
| **Sprint**    | {sprint_id} (si aplica)          |
| **Epica**     | {epic_key} — {epic_summary}      |

---

## Artifacts Evaluation

> Peso: **40%** del score total

| #   | Artifact        | Exists | Content Valid | Detail   | Status         |
| --- | --------------- | ------ | ------------- | -------- | -------------- |
| 1   | {artifact_name} | Yes/No | Yes/No        | {detail} | PASS/WARN/FAIL |
| ... | ...             | ...    | ...           | ...      | ...            |

**Content Validation Rules:**

- Artifact exists AND is non-empty (>50 chars meaningful content)
- Required sections present and populated (not placeholder text)
- Frontmatter valid (id, version, last_updated, status)
- References to other artifacts are resolvable (no broken links)

**Subtotals:**

- Artifacts found: {found} / {required}
- Content valid: {valid} / {found}
- Artifact score: {artifact_score}%

---

## Checklists Evaluation

> Peso: **35%** del score total

| #   | Checklist      | Items Total | Items PASS | Items FAIL | Score  | Status         |
| --- | -------------- | ----------- | ---------- | ---------- | ------ | -------------- |
| 1   | {checklist_id} | {total}     | {pass}     | {fail}     | {pct}% | PASS/WARN/FAIL |
| ... | ...            | ...         | ...        | ...        | ...    | ...            |

**Checklist score:** {checklist_score}%

---

## Cross-Coherence Evaluation

> Peso: **15%** del score total

| #   | Source -> Target | Refs Total | Refs Valid | Refs Broken | Status         |
| --- | ---------------- | ---------- | ---------- | ----------- | -------------- |
| 1   | RF -> PRD        | {total}    | {valid}    | {broken}    | PASS/WARN/FAIL |
| 2   | US -> RF         | {total}    | {valid}    | {broken}    | PASS/WARN/FAIL |
| 3   | BDD -> AC        | {total}    | {valid}    | {broken}    | PASS/WARN/FAIL |
| 4   | Test -> RF (RTM) | {total}    | {valid}    | {broken}    | PASS/WARN/FAIL |
| ... | ...              | ...        | ...        | ...         | ...            |

**Coherence Checks (gate-specific):**

- **Gate 2**: RF_total={n}, RF_with_BDD={m}, BDD_coverage={pct}% (threshold: 100%)
- **Gate 2**: RNF_total={n}, RNF_with_metric={m}, RNF_measurable={pct}% (threshold: 100%)
- **Gate 5**: RF_total={n}, test_cases_linked={m}, RTM_coverage={pct}% (threshold: 100%)

**Coherence score:** {coherence_score}%

---

## Signoffs Evaluation

> Peso: **10%** del score total

| #   | Signoff      | Required | Signed | Signer Role | Date   | Status    |
| --- | ------------ | -------- | ------ | ----------- | ------ | --------- |
| 1   | {signoff_id} | Yes/No   | Yes/No | {role}      | {date} | PASS/FAIL |
| ... | ...          | ...      | ...    | ...         | ...    | ...       |

**Signoff Rules:**

- Gate 5: so-qa required, signed by QA Lead
- Gate 6: so-security required, signed by Sec Lead
- Signoff date must be AFTER last artifact modification date

**Signoff score:** {signoff_score}%

---

## Weighted Score Calculation

| Dimension  | Weight   | Score              | Weighted             |
| ---------- | -------- | ------------------ | -------------------- |
| Artifacts  | 40%      | {artifact_score}%  | {weighted_artifact}  |
| Checklists | 35%      | {checklist_score}% | {weighted_checklist} |
| Coherence  | 15%      | {coherence_score}% | {weighted_coherence} |
| Signoffs   | 10%      | {signoff_score}%   | {weighted_signoff}   |
| **TOTAL**  | **100%** |                    | **{total_score}%**   |

### Verdict Thresholds

| Range  | Verdict     | Action                                                  |
| ------ | ----------- | ------------------------------------------------------- |
| >= 90% | PASS        | Proceed to next phase                                   |
| 70-89% | CONDITIONAL | Proceed with mandatory action items (deadline required) |
| < 70%  | FAIL        | Block. Resolve all FAIL items before re-evaluation      |

---

## Verdict

| Campo              | Valor                     |
| ------------------ | ------------------------- |
| **Score**          | {total_score}%            |
| **Verdict**        | PASS / CONDITIONAL / FAIL |
| **Blocking Items** | {count}                   |

---

## Action Items (if CONDITIONAL or FAIL)

| #   | Item          | Severity             | Owner Role | Deadline | Status |
| --- | ------------- | -------------------- | ---------- | -------- | ------ |
| 1   | {description} | Critical/High/Medium | {role}     | {date}   | Open   |
| ... | ...           | ...                  | ...        | ...      | ...    |

---

## Evidence

| #   | Evidence      | Type                                  | Link          |
| --- | ------------- | ------------------------------------- | ------------- |
| 1   | {description} | Artifact/Checklist/Signoff/Screenshot | {path_or_url} |
| ... | ...           | ...                                   | ...           |

---

## Handoff Context for Next Phase

### What the next phase needs to know:

{context_summary}

### Recommended next command:

`/advance-gate {N+1}` (when {next_phase} completes)

### Additional suggestions:

{suggestions}

---

## Jira Registration

| Campo                | Valor                                         |
| -------------------- | --------------------------------------------- |
| **Epic**             | {epic_key}                                    |
| **Field**            | Gate Status                                   |
| **Value**            | Gate {N}: {verdict} ({total_score}%) — {date} |
| **Subtasks Created** | {count} (one per FAIL action item)            |

---

_Generated by `/advance-gate {N}` using tpl-gate-evaluation v1.0.0_
_Template: docs/templates/gate-evaluation.md_
