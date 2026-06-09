---
name: lidr-skills-criticality
description: Public reference of LIDR skills criticality (required/recommended/optional) relative to BMad base flow. Helps teams decide which LIDR skills can be skipped when using BMad standalone.
last_updated: "2026-05-20"
status: active
type: reference
---

# LIDR Skills Criticality (vs BMad Base Flow)

> **Architecture principle:** BMad is the base flow. LIDR is a thin complement layer that adds Gate enforcement, pre/post wrappers, compliance, automation, and Spanish output. Each LIDR skill is classified by how much value it adds **beyond what BMad already provides**.

## Definitions

| Level               | Meaning                                                                                                                    |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 🔴 **OBLIGATORIO**  | BMad does NOT cover this. Skipping leaves a real gap in the workflow. MUST be invoked.                                     |
| 🟡 **RECOMENDABLE** | BMad covers partially. LIDR adds automation/Spanish/Gate-binding/compliance. Skipping degrades quality but workflow works. |
| 🟢 **OPCIONAL**     | Niche use case (consultancy multi-client, Claude Code meta-tooling, web QA). Only use if your team has that specific case. |

## 🔴 OBLIGATORIO (23 skills)

These fill gaps that BMad has zero coverage for. Cannot be skipped without losing core functionality.

### Pre-Gate 0 (4)

| Skill                       | Why required                                                           |
| --------------------------- | ---------------------------------------------------------------------- |
| `lidr-business-case`        | BMad prfaq is product positioning; BC is financial/ROI executive (ES). |
| `lidr-kickoff`              | BMad has no kickoff acta format (agenda/RACI/decisions).               |
| `lidr-stakeholder-map`      | BMad has no power/interest matrix.                                     |
| `lidr-tracking-integration` | BMad doesn't integrate Jira/Linear/Notion.                             |

### Gate 1 (1)

| Skill                 | Why required                                                                        |
| --------------------- | ----------------------------------------------------------------------------------- |
| `lidr-review-cruzado` | **Gate 1 enforcer**: validates that bmad-prd output has both F+T sections complete. |

### Gate 2 (3)

| Skill                        | Why required                                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `lidr-generate-rf`           | BMad embeds reqs in PRD; LIDR produces standalone Jira-ready RFs with BDD.                                    |
| `lidr-generate-nfr`          | BMad-testarch-nfr **audits evidence** (post-implementation), doesn't **generate**. LIDR produces the NFR doc. |
| `lidr-validate-requirements` | BMad has no RTM / Jira CSV automation (5-pass, 150h/yr ROI).                                                  |

### Gate 3 (1)

| Skill               | Why required                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| `lidr-user-stories` | rf-slicer.py 1184 LOC: 8 slicing patterns + INVEST + capacity + Jira CSV. BMad creates 1 story. |

### Gate 4 (3)

| Skill                 | Why required                                                                         |
| --------------------- | ------------------------------------------------------------------------------------ |
| `lidr-pr-description` | **BMad has nothing about PRs**. DoD checklist hook-wired (`dtc-write-guard`).        |
| `lidr-adr`            | BMad-create-architecture **designs**; ADR is the formal MADR record of the decision. |
| `lidr-dev-handoff-qa` | BMad has no Dev→QA handoff doc. QA can't test without it.                            |

### Gate 5 (2)

| Skill                        | Why required                                                               |
| ---------------------------- | -------------------------------------------------------------------------- |
| `lidr-create-test-cases`     | BMad-testarch-test-design is strategy; LIDR exports to Xray with data.     |
| `lidr-test-execution-report` | BMad-testarch-trace is matrix; LIDR is executive Gate 5 sign-off GO/NO-GO. |

### Gate 6 — Security (4)

| Skill                      | Why required                                                 |
| -------------------------- | ------------------------------------------------------------ |
| `lidr-vuln-assessment`     | BMad has no security skills. SAST/SCA interpretation.        |
| `lidr-dast-interpretation` | BMad has no DAST.                                            |
| `lidr-pentest-report`      | BMad has no pentest. Required for PSD2/ISO 27001 compliance. |
| `lidr-security-checklist`  | BMad has no OWASP Top 10 checklist.                          |

### Gate 7 — Deploy (3)

| Skill                 | Why required                                                            |
| --------------------- | ----------------------------------------------------------------------- |
| `lidr-change-request` | BMad-correct-course is mid-sprint; CR is ITIL deploy approval with CAB. |
| `lidr-rollback-plan`  | BMad has no rollback automation.                                        |
| `lidr-release-notes`  | BMad has no release notes (3-level: exec + technical + customer).       |

### Post-Deploy (1)

| Skill             | Why required                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| `lidr-postmortem` | BMad-retrospective is post-epic; postmortem is post-incident with Five Whys. Different ceremony. |

### Gate Orchestration (1)

| Skill                  | Why required                                           |
| ---------------------- | ------------------------------------------------------ |
| `lidr-gate-evaluation` | BMad has NO Gate G0-G7 methodology. Core of LIDR SDLC. |

## 🟡 RECOMENDABLE (8 skills)

BMad covers partially. LIDR adds automation, Spanish, Gate-binding, or compliance.

| Skill                    | What LIDR adds beyond BMad                                                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `lidr-risk-log`          | Formal registry with industry patterns. BMad could embed risks in PRD.                                                              |
| `lidr-sprint-capacity`   | Math with buffer 15-20% + velocity. BMad-sprint-planning doesn't compute capacity.                                                  |
| `lidr-refinement-notes`  | **WRAPS `bmad-create-story`**: adds DoR-readiness grooming layer (domain decisions, compliance clarifications) post-story creation. |
| `lidr-tech-debt`         | SonarQube auto-parse (120h/yr ROI). BMad-investigate is forensic.                                                                   |
| `lidr-bug-report`        | **WRAPS `bmad-investigate`**: QA→Dev outbound template (audience), BMad investigate is Dev-internal forensic.                       |
| `lidr-ticket-validation` | Validate LIDR/BMad ticket structure pre-refinement and pre-PR. Adds Gate-aware validation over BMad story output.                   |
| `lidr-sdlc-tracking`     | Portfolio state centralized. BMad-sprint-status is per-sprint.                                                                      |
| `lidr-audit-standards`   | **WRAPS `bmad-review-adversarial-general`**: ecosystem-scope audit (`.agents/` frontmatter, drift, paths) vs BMad content reviews.  |

## 🟢 OPCIONAL (9 skills — 4 LIDR + 5 anytime claude-\*)

Only use if your team has the specific use case.

| Skill (source)                       | When to activate                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------------------- |
| `lidr-propuesta-builder` (LIDR)      | Consultancy multi-client: generate UI JSONs for "Propuesta de Mejora".                |
| `lidr-external-sync` (LIDR)          | Multi-tool teams: bidirectional sync Jira ↔ Linear ↔ Notion.                          |
| `lidr-playwright-cli` (LIDR)         | Web QA + runtime/visual review layer over `bmad-code-review` (drives Playwright MCP). |
| `lidr-agents-architecture` (anytime) | Meta-skill: entry point for creating skills/commands/subagents.                       |
| `lidr-command-development` (anytime) | Create Claude Code slash commands.                                                    |
| `lidr-generate-rule` (anytime)       | Extending Claude Code: create behavioral rules.                                       |
| `lidr-hook-development` (anytime)    | Extending Claude Code: PreToolUse/PostToolUse hooks.                                  |
| `lidr-mcp-integration` (anytime)     | Connecting external services via MCP.                                                 |
| `lidr-commit-management` (LIDR)      | Conventional commits, rebase/squash workflows with LIDR scope conventions.            |

## How to use this classification

When invoking LIDR skills in a workflow:

1. **OBLIGATORIO** skills MUST be invoked at the appropriate Gate/phase. Don't skip.
2. **RECOMENDABLE** skills can be skipped at your discretion; document the gap if skipped.
3. **OPCIONAL** skills should only be invoked when the specific use case applies (consultancy, multi-tool, Claude Code extension).

## Workflow integration

For the full BMad-base + LIDR-complement workflow, see:

- `.agents/rules/lidr-sdlc/workflows.md` (orchestration map)
- `.agents/_shared/lidr/MIGRATION.md` (consolidation history)

## Inventory snapshot (as of 2026-05-20, post Phase F)

```
LIDR:    35 skills (23 OBLIGATORIO + 8 RECOMENDABLE + 4 OPCIONAL)
BMad:    69 skills (base flow, untouched)
Anytime: 5 skills (all OPCIONAL — 5 claude-* meta-tooling)
Total:   109 skills
```

> **Phase F (2026-05-20):** Renamed last 2 unprefixed skills to `lidr-commit-management` and
> `lidr-ticket-validation` (source: anytime → lidr). Refactored 4 LIDR SKILL.md descriptions
> to explicitly frame them as thin wrappers over BMad outputs:
>
> - `lidr-refinement-notes` wraps `bmad-create-story` + DoR layer
> - `lidr-bug-report` wraps `bmad-investigate` (QA→Dev audience)
> - `lidr-audit-standards` wraps `bmad-review-adversarial-general` (ecosystem scope)
>
> **Phase E (prior):** Moved 5 Claude Code meta-tooling skills out of LIDR into `anytime` with
> `claude-` prefix. They extend the Claude Code platform itself. The `lidr-` prefix is now
> reserved for skills tied to the LIDR SDLC Gate model.
