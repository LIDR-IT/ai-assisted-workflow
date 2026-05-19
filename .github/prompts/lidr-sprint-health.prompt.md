---
description: Active sprint monitoring with health metrics and risk detection
agent: 'agent'
---

<!--
COMMAND: sprint-health
VERSION: 1.0.0
AUTHOR: SDLC Team
LAST UPDATED: 2026-03-15
TIER: 2 (Tactical)

PURPOSE:
LIDR SDLC Methodology active sprint monitoring command for real-time health assessment.
Tracks velocity, burndown, blockers, team capacity utilization, scope changes,
and provides early warning system for sprint risks based on data patterns.

USAGE:
  /sprint-health current         → Current active sprint
  /sprint-health SP-24-05       → Specific sprint by ID
  /sprint-health               → Auto-detect current sprint

INTEGRATION:
  - Uses sprint-capacity skill for capacity analysis
  - Feeds into bmad-retrospective skill for historical patterns
  - Connects to advance-gate for sprint transition decisions

LIDR SDLC PATTERN:
Based on LIDR SDLC sprint-status pattern for continuous sprint monitoring
with data-driven risk detection and actionable insights.

CHANGELOG:
  v1.0.0 (2026-03-15): Initial LIDR SDLC Methodology sprint health implementation
-->

# Sprint Health Monitor — Sprint: $1

Load: @../skills/sprint-capacity/SKILL.md
Load: bmad-retrospective skill (post-epic retro reference)
Load: @../rules/org.md

## Detect Sprint Context

### Auto-Detect Sprint ID if not provided

If "$1" is empty or "$1" equals "current":
Look for current active sprint:

- Jira query equivalent: `project = SDLC AND sprint in openSprints()`
- Git branch patterns: `git branch -r | grep -E "(sprint|SP-)" | head -5`
- Check recent commits: `git log --oneline --since="14 days ago" | head -10`

If no sprint detected:
Use AskUserQuestion:

- question: "¿Cuál sprint quieres monitorizar?"
- header: "Sprint Selection"
- options:
  - current (Sprint activo actual)
  - SP-24-05 (Sprint específico)
  - last (Último sprint completado para comparación)

## Collect Sprint Health Data

### Sprint Basics

Sprint information to gather:

- Sprint ID: $1
- Start date: {auto-detect from sprint config}
- End date: {auto-detect from sprint config}
- Days remaining: {calculate from today}
- Total sprint days: {usually 10 working days}

### Velocity & Burndown Data

**Committed vs Delivered (so far):**

```
Total story points committed: {from sprint planning}
Story points completed: {tickets in Done status}
Story points in progress: {tickets in Progress status}
Story points remaining: {tickets in To Do status}
```

**Burndown tracking:**

- Ideal burndown rate: {total_points / total_days} per day
- Actual burndown to date: {completed_points / days_elapsed}
- Projected completion: {if current rate continues}

**Historical velocity (last 3 sprints for comparison):**
Use skill `sprint-capacity` pattern to load historical data if available.

### Team Capacity Analysis

**Current capacity utilization:**

- Team members active: {count}
- Planned absences this sprint: {vacation days, holidays}
- Unplanned absences: {sick days, emergencies}
- Effective capacity remaining: {hours}

**Capacity red flags:**

- Any team member over 100% allocated
- Critical path dependencies on unavailable members
- Knowledge bottlenecks (only 1 person knows X)

### Quality & Technical Health

**Code quality indicators:**

- PRs merged vs target: {current} / {expected}
- Average PR review time: {calculate from last 5 PRs}
- Build success rate: {green builds / total builds}
- Test coverage trend: {if measurable}

**Technical debt signals:**

- Hotfixes applied this sprint: {count emergency commits}
- Rollback incidents: {deployments reverted}
- Performance degradation alerts: {if monitoring available}

### Scope & Change Analysis

**Scope changes:**

- Stories added mid-sprint: {count & impact}
- Stories removed/deferred: {count & reason}
- Requirements clarifications: {count of back-and-forth}
- Scope inflation: {original estimate vs current estimate}

**Blocker analysis:**

- Active blockers: {list from ticket dependencies}
- Average blocker resolution time: {historical}
- External dependency delays: {waiting for other teams}

## Risk Detection Engine

Based on collected data, calculate risk scores:

### Sprint Risk Matrix

| Risk Category       | Green (0-2)     | Yellow (3-6)      | Red (7-10)        | Critical (10+)        |
| ------------------- | --------------- | ----------------- | ----------------- | --------------------- |
| **Velocity Risk**   | On track        | 10-20% behind     | 20-40% behind     | >40% behind           |
| **Capacity Risk**   | <80% utilized   | 80-100% utilized  | >100% allocated   | Team burnout signals  |
| **Quality Risk**    | <2 bugs/week    | 2-5 bugs/week     | >5 bugs/week      | Quality gates failing |
| **Scope Risk**      | No changes      | Minor additions   | Major scope creep | Scope doubling        |
| **Dependency Risk** | Self-sufficient | 1-2 external deps | Multiple blockers | Critical path blocked |

### Early Warning Signals

**Velocity warnings:**

- If burndown rate < ideal rate for 3+ consecutive days → 🟡 Yellow
- If projected completion > sprint end → 🔴 Red
- If no story completed in 3+ days → ⚫ Critical

**Team stress indicators:**

- Multiple team members working >9h/day → 🟡 Yellow
- Weekend work detected in commits → 🔴 Red
- Same person involved in multiple hotfixes → 🟡 Yellow

**Quality degradation:**

- Test coverage dropping sprint-over-sprint → 🟡 Yellow
- Bug escape rate increasing → 🔴 Red
- PR review time increasing → 🟡 Yellow

## Generate Health Dashboard

### Sprint Health Score: {X}%

**Overall Status:** 🟢 Healthy | 🟡 At Risk | 🔴 Critical | ⚫ Emergency

### Key Metrics

```markdown
## Sprint {sprint_id} Health Dashboard

**Date:** {today} | **Days Remaining:** {days}

### 📊 Velocity Health: {score}/10

| Metric               | Current          | Target            | Status     |
| -------------------- | ---------------- | ----------------- | ---------- |
| Points Completed     | {completed}      | {expected_by_now} | {🟢/🟡/🔴} |
| Daily Burn Rate      | {actual_rate}    | {ideal_rate}      | {🟢/🟡/🔴} |
| Projected Completion | {projected_date} | {sprint_end}      | {🟢/🟡/🔴} |

### 👥 Team Capacity: {score}/10

| Member | Allocation | Availability | Bottleneck Risk |
| ------ | ---------- | ------------ | --------------- |

{team_member_table}

### 🛠️ Technical Health: {score}/10

| Metric             | Current       | Trend      | Status     |
| ------------------ | ------------- | ---------- | ---------- |
| PR Review Time     | {avg_hours}h  | {↗️/↔️/↘️} | {🟢/🟡/🔴} |
| Build Success Rate | {percentage}% | {↗️/↔️/↘️} | {🟢/🟡/🔴} |
| Active Blockers    | {count}       | {↗️/↔️/↘️} | {🟢/🟡/🔴} |

### 📋 Scope Stability: {score}/10

| Change Type         | Count   | Impact  | Risk Level |
| ------------------- | ------- | ------- | ---------- |
| Stories Added       | {count} | {hours} | {🟢/🟡/🔴} |
| Stories Removed     | {count} | {hours} | {🟢/🟡/🔴} |
| Requirement Changes | {count} | {hours} | {🟢/🟡/🔴} |
```

### Risk Alerts & Recommendations

**🔴 Critical Actions Required:**
{list critical actions if any}

**🟡 Attention Needed:**
{list warnings if any}

**📈 Optimization Opportunities:**
{list improvements if any}

### Comparison with Sprint Norms

**Historical context (last 3 sprints):**

- Velocity this sprint vs average: {comparison}
- Quality metrics vs average: {comparison}
- Team utilization vs average: {comparison}

## Integration Triggers

### Auto-escalate if Critical

If overall health score < 5/10 OR any category is Critical:

```
RECOMMENDED IMMEDIATE ACTIONS:
1. Notify PME + Tech Lead immediately
2. Suggest emergency sprint planning session
3. Consider scope reduction conversation with PO
4. Plan capacity reallocation or team assistance
```

### Feed Historical Data

Store current metrics for future `bmad-retrospective` skill usage:

- Sprint velocity achieved
- Quality indicators final values
- Team stress indicators observed
- Scope changes documented

### Suggest Follow-up Commands

Based on detected issues:

- If scope issues: `/quick-spec` for new requirements
- If quality issues: `/prepare-testing` for additional test coverage
- If capacity issues: Skill `sprint-capacity` for rebalancing
- If sprint failing: `/advance-gate` analysis for sprint closure options

## Manual Overrides

Allow team input for context AI cannot detect:

Use AskUserQuestion for team sentiment:

- question: "¿Hay factores no detectados que afecten el sprint?"
- header: "Context Override"
- options:
  - Todo normal (Métricas reflejan realidad)
  - Hay contexto adicional (Explicar factores externos)
  - Escalado requerido (Situación más crítica de lo que muestran métricas)
