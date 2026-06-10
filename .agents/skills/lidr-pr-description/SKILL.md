---
name: lidr-pr-description
id: pr-description
version: "1.3.0"
last_updated: "2026-06-09"
updated_by: "TL: BMad-coherence batch-fix"
status: active
phase: 4
stage: development
owner_role: "Dev"
automation: false
domain_agnostic: true
language_default: en
integrations: [tracking, chat, code_quality, vcs]
description: "Generate a structured Pull Request description from git diff and {{TRACKING_TOOL}} ticket context. Use when creating a PR from a feature branch to develop/main, when updating a PR with significant changes, or when invoked by /implement-ticket or /create-pr commands. Triggers on create PR description, generate PR body, write PR summary, open pull request. Output is a structured English PR description for code reviewers and QA. ALWAYS use when creating pull requests to communicate changes effectively."
---

# PR Description Generator

Phase: 5 — Development | Language: English

Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml`; the active client binds concrete tools in `clients/<CODE>.yaml`.

## Relationship to BMad

LIDR-unique Phase-5 development artifact — no BMad equivalent. Consumed by the `/lidr-create-pr` and `/lidr-implement-ticket` commands to produce the PR body and pre-evaluate DoD compliance.

## Workflow

1. Read git diff: `git diff develop...HEAD`
2. Read {{TRACKING_TOOL}} ticket (MCP or manual): title, BDD criteria, linked US/RF
3. Read DoD checklist: checklists/dod.md
4. Generate PR description using template below
5. Pre-evaluate DoD compliance
6. Output ready-to-paste PR body

## Input

| Input                                           | Required  | Source                            |
| ----------------------------------------------- | --------- | --------------------------------- |
| Git diff                                        | ✅        | `git diff develop...HEAD`         |
| {{TRACKING_TOOL}} ticket (BDD criteria, US, RF) | ✅        | Manual or script                  |
| DoD checklist                                   | ✅        | checklists/dod.md                 |
| Commit messages                                 | Desirable | `git log develop..HEAD --oneline` |
| ADRs (if applicable)                            | Optional  | `docs/adrs/`                      |

## Output Template

```markdown
## 📋 Summary

> [2-3 sentences: WHAT changed and WHY. Reviewer decides from this alone.]

**Ticket:** [{PROJ-XXX}]({tracking_url}) — {US title}
**RF Origin:** RF-{PROY}-{NNN}

---

## 🔍 What Changed

### Functional Description

[Business-language summary of user-facing changes]

### Technical Changes

| File     | Type                 | Description    |
| -------- | -------------------- | -------------- |
| `{path}` | New/Modified/Deleted | {what and why} |

---

## 🧪 How to Test

> [Step-by-step for reviewer/QA, mapped to BDD criteria]

1. {Given context}
2. {When action}
3. {Then verify expected result}

**Test data needed:** {if any}
**Environment:** {staging URL or local setup}

---

## ⚠️ Breaking Changes

{None / Description + migration steps}

---

## 📝 Checklist

- [x] Tests added/updated and passing
- [x] Lint clean (0 warnings)
- [x] Build succeeds
- [ ] Code review approved
- [x] Docs updated (if applicable)
- [x] No TODOs without linked {{TRACKING_TOOL}} ticket

---

## 🔗 Context

- **BDD Criteria covered:** {list from ticket}
- **Dependencies:** {blocking/related tickets}
- **Feature flag:** {flag name if behind flag, or "N/A"}
- **ADR:** {link if architectural decision}
```

## Key Rules

- Summary must let a reviewer decide "should I merge this?" without reading the ticket.
- "What Changed" in functional/business language first, technical table second.
- "How to Test" maps 1:1 to BDD acceptance criteria from the {{TRACKING_TOOL}} ticket.
- Every file change gets a row explaining WHY, not just WHAT.
- Mark breaking changes prominently with migration steps.
- If diff is large (>30 files): group by component/feature, not alphabetically.
- Conventional commit prefix in title: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`.

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- PR documentation compliance patterns
- Progressive disclosure adherence
- Resource organization standards

**When to use:**

- Before skill release/packaging
- In CI/CD pipeline (quality gates)
- After major example updates
- During skill maintenance cycles

**Integration with ecosystem:**

- Used by `bmad-eval-runner` for ecosystem validation
- Supports quality gates in SDLC workflow
- Provides consistent validation across all skills

## Examples

**Good summary:**

> Implement {{PRIMARY_WORKFLOW}} flow with {{VERIFICATION_METHOD}} validation. Users can now complete {{BUSINESS_PROCESS}} during onboarding using {{CAPTURE_DEVICE}} with real-time feedback. Closes PROJ-123.

**Bad summary:**

> Added files and fixed things for the enrollment feature.

---

## Changelog

| Version | Date       | Author                                    | Changes                                                                                                                                                                                                                                    |
| ------- | ---------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1.3.0   | 2026-06-09 | TL: BMad-coherence batch-fix              | Added `language_default: en` frontmatter; added Relationship to BMad note (LIDR-unique Phase-5 artifact consumed by /lidr-create-pr + /lidr-implement-ticket)                                                                              |
| 1.2.0   | 2026-06-09 | TL: lang+tool agnostic                    | Language to English-default-configurable; abstracted Jira (tracking), Slack (chat), SonarQube/Snyk (code_quality), GitHub (vcs) via tool-registry                                                                                          |
| 1.1.0   | 2026-04-06 | System: Phase 4 Python Script Remediation | Domain-agnostic remediation: replaced biometric-specific examples with template variables ({{PRIMARY_WORKFLOW}}, {{VERIFICATION_METHOD}}, {{BUSINESS_PROCESS}}, {{CAPTURE_DEVICE}}) in Examples section. Achieving 75→92/100 target score. |
| 1.0.1   | 2026-03-16 | System: Normalization                     | Previous improvements                                                                                                                                                                                                                      |
