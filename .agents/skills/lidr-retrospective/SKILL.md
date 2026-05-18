---
name: lidr-retrospective
id: retrospective
version: "1.1.0"
last_updated: "2026-03-16"
updated_by: "System: Quality Assurance Enhancement"
status: active
phase: 8
owner_role: "SM"
automation: false
domain_agnostic: true
description: "Structure a data-driven retrospective with metrics from Jira (velocity, bugs), GitHub (PRs, CI), and QA (pass rate, defects), ensuring improvement actions are concrete and tracked. Use at the end of each sprint (mandatory), at release completion, post-incident, or quarterly for strategic review. Triggers on prepare retrospective, sprint retro, retro data, what went well what didn't, continuous improvement. Principle: data first, opinions second. Without data, a retro is a complaints session; with data, it's continuous improvement. ALWAYS use at sprint and epic completion to drive continuous improvement."
---

# Data-Driven Retrospective Structurer

Phase: 8 — Sprint/Release closure | Language: Spanish

**Principle:** Datos primero, opiniones después. Sin datos, la retro es una sesión de quejas. Con datos, es mejora continua.

## Workflow

1. Collect sprint metrics: velocity, commitment vs delivered, bug count
2. Collect engineering metrics: PR cycle time, build success rate, deploy frequency
3. Collect QA metrics: pass rate, defect density, regression results
4. Review previous retro action items (accountability check)
5. Structure retro with data + team discussion sections
6. Generate SMART action items with owners and deadlines

## Input

| Input                             | Required  | Source                                      |
| --------------------------------- | --------- | ------------------------------------------- |
| Sprint goal + commitment          | ✅        | Jira sprint board                           |
| Velocity (committed vs delivered) | ✅        | Jira reports                                |
| Bug metrics                       | ✅        | Jira (found, fixed, escaped, severity)      |
| Previous retro action items       | ✅        | Prior retro notes                           |
| CI/CD metrics                     | Desirable | GitHub Actions (build success, deploy freq) |
| PR metrics                        | Desirable | GitHub (review time, merge time, size)      |
| QA metrics                        | Desirable | TestRail / skill `test-execution-report/`   |
| Team happiness                    | Desirable | Pulse survey                                |

## Output Template

```markdown
# Retrospective: Sprint {N} — [DD/MM/YYYY]

| Campo           | Valor                           |
| --------------- | ------------------------------- |
| **Sprint**      | Sprint {N} — [{start} to {end}] |
| **Facilitador** | [SM]                            |
| **Asistentes**  | [Names]                         |

## 1. Métricas del Sprint (Data Section)

### Velocity

| Metric     | Value                  | Trend | Health |
| ---------- | ---------------------- | ----- | ------ |
| Committed  | {X} US / {Y}h          |       |        |
| Delivered  | {X} US / {Y}h          | ↑↓→   | 🟢🟡🔴 |
| Velocity % | {delivered/committed}% |       |        |

### Quality

| Metric                   | Value                        | Trend |
| ------------------------ | ---------------------------- | ----- |
| Bugs found               | {N} (P1:{n}, P2:{n}, P3:{n}) |       |
| Bugs escaped to UAT/Prod | {N}                          |       |
| Test pass rate           | {X}%                         |       |

### Engineering

| Metric             | Value       | Trend |
| ------------------ | ----------- | ----- |
| Avg PR review time | {X}h        |       |
| Build success rate | {X}%        |       |
| Deploy frequency   | {N} deploys |       |

## 2. Previous Action Items Review

| Action            | Owner  | Status                                 | Impact         |
| ----------------- | ------ | -------------------------------------- | -------------- |
| [from last retro] | [name] | ✅ Done / ❌ Not done / 🔄 In progress | [what changed] |

## 3. Discussion (Team Section)

### What Went Well 🟢

- [data-backed observation]

### What Didn't Go Well 🔴

- [data-backed observation]

### What Can We Improve 🔵

- [specific improvement with expected impact]

## 4. Action Items (SMART)

| #   | Action                        | Owner  | Deadline | Metric to Verify           |
| --- | ----------------------------- | ------ | -------- | -------------------------- |
| 1   | [specific, measurable action] | [name] | [date]   | [how we'll know it worked] |

## 5. Team Health / Happiness

[Score: X/10 — trend vs last sprint]
```

## Key Rules

- **Data before opinions**: Every "what went wrong" should reference a metric.
- **Previous actions accountability**: Always review last retro's actions FIRST. If actions aren't completed, address that.
- **SMART actions only**: "Improve code quality" → "Reduce avg PR review time from 24h to 8h by implementing reviewer assignment automation by Sprint N+2"
- **Max 3-5 actions**: Too many actions = none get done. Focus on highest impact.
- **Metrics to verify**: Each action has a success metric — check in next retro.
- **Blameless**: Discuss systems and processes, not individuals.

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Sprint retrospective and metrics compliance patterns
- Progressive disclosure adherence
- Resource organization standards

**When to use:**

- Before skill release/packaging
- In CI/CD pipeline (quality gates)
- After major example updates
- During skill maintenance cycles

**Integration with ecosystem:**

- Used by `/multi-agent-audit` for ecosystem validation
- Supports quality gates in SDLC workflow
- Provides consistent validation across all skills
