---
id: tpl-gate-evaluation
version: "1.2.0"
last_updated: "2026-06-10"
updated_by: "TL: Gate-evidence contract fix"
status: active
code: "T-GATE-001"
name: "Gate Evaluation Report"
used_by:
  - /lidr-advance-gate (all 8 gates)
---

# Gate Evaluation Report — Gate {N}

> Standardized output template for `/lidr-advance-gate`. All gates (0-7) use this format.
> Generated automatically by the `/lidr-advance-gate {N}` command.

---

## Header

| Field         | Value                            |
| ------------- | -------------------------------- |
| **Gate**      | {N} — {phase_from} -> {phase_to} |
| **Evaluator** | {role} — {evaluator_name}        |
| **Date**      | {date}                           |
| **Project**   | {project_id} — {project_name}    |
| **Sprint**    | {sprint_id} (if applicable)      |
| **Epic**      | {epic_key} — {epic_summary}      |

---

## Artifacts Evaluation

> Weight: **40%** of total score

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

> Weight: **35%** of total score

| #   | Checklist      | Items Total | Items PASS | Items FAIL | Score  | Status         |
| --- | -------------- | ----------- | ---------- | ---------- | ------ | -------------- |
| 1   | {checklist_id} | {total}     | {pass}     | {fail}     | {pct}% | PASS/WARN/FAIL |
| ... | ...            | ...         | ...        | ...        | ...    | ...            |

**Checklist score:** {checklist_score}%

---

## Cross-Coherence Evaluation

> Weight: **15%** of total score

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

> Weight: **10%** of total score

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

| Field              | Value                     |
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

`/lidr-advance-gate {N+1}` (when {next_phase} completes)

### Additional suggestions:

{suggestions}

---

## {{TRACKING_TOOL}} Registration

| Field                | Value                                         |
| -------------------- | --------------------------------------------- |
| **Epic**             | {epic_key}                                    |
| **Field**            | Gate Status                                   |
| **Value**            | Gate {N}: {verdict} ({total_score}%) — {date} |
| **Subtasks Created** | {count} (one per FAIL action item)            |

---

_Generated by `/lidr-advance-gate {N}` using tpl-gate-evaluation v1.2.0_
_Template: .agents/skills/lidr-gate-evaluation/templates/gate-evaluation.md_

---

## Changelog

| Version | Date       | Author                 | Changes                                                                                |
| ------- | ---------- | ---------------------- | -------------------------------------------------------------------------------------- |
| 1.1.0   | 2026-06-09 | TL: lang+tool agnostic | Language to English-default-configurable; abstracted tracking (Jira) via tool-registry |
| 1.0.0   | 2026-03-09 | TL: Lead Engineer      | Initial template creation                                                              |
