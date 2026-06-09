---
name: lidr-postmortem
id: postmortem
version: "1.2.1"
last_updated: "2026-06-09"
updated_by: "TL: BMad-coherence batch-fix"
status: active
phase: 8
owner_role: "PME"
automation: false
domain_agnostic: true
language_default: en
integrations: [chat]
description: "Structure a blameless incident postmortem using Five Whys root cause analysis, detailed timeline, and systemic corrective actions. Domain-agnostic - works for any system or service type. Mandatory for S1/S2 production incidents; recommended for S3 with customer impact, near-misses, and executed rollbacks. Deadline: draft in 24h, review in 48h, publish in 72h. Triggers on create postmortem, incident analysis, what happened in production, root cause analysis, five whys, incident report. Culture: blameless — analyze SYSTEMS, don't blame PEOPLE. Output: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`). ALWAYS use after production incidents to identify root causes and prevent recurrence."
---

# Blameless Postmortem Structurer

Phase: 8 — Post-incident | Output: English by default; artifact language follows the client `language` setting (see `_shared/lidr/integrations/`). Logs and commands stay in English.

Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml`; the active client binds concrete tools in `clients/<CODE>.yaml`.

**Culture:** Blameless — the postmortem analyzes SYSTEMS, not blame PEOPLE.

## Relationship to BMad

LIDR-unique post-incident artifact — distinct from `bmad-retrospective`, which is a post-epic review of planned work. A postmortem is triggered by an unplanned production incident (S1/S2) and applies Five Whys root-cause analysis; the retrospective looks back at a completed epic for process improvement. The two are complementary, not interchangeable.

## When to Use

### Mandatory Usage

- **S1/S2 Production Incidents**: Any severity 1 or 2 incident that impacts production systems
- **Customer-Facing Outages**: Any incident that directly affects user experience or access
- **Data Loss Events**: Any incident involving data corruption, loss, or unauthorized access
- **Security Breaches**: Security incidents, attempted breaches, or policy violations
- **Executed Rollbacks**: When production deployments require emergency rollback

### Recommended Usage

- **S3 Incidents with Customer Impact**: Lower severity incidents that still affect users
- **Near-Miss Events**: Close calls that could have become major incidents
- **Process Failures**: When established processes break down, even without system impact
- **Recurring Issues**: Patterns of smaller issues that suggest systemic problems
- **Learning Opportunities**: Significant events that provide valuable lessons

### Optional Usage

- **Planned Maintenance Issues**: When planned maintenance encounters unexpected problems
- **Capacity Events**: Performance degradation due to unexpected load
- **Vendor-Caused Incidents**: Third-party service issues affecting your systems

### Triggering Phrases

- "What went wrong in production?"
- "Why did this fail?"
- "Create incident analysis"
- "Root cause analysis needed"
- "Write postmortem"
- "Five whys analysis"
- "Incident report"
- "Production issue investigation"

### When NOT to Use

- **Individual Developer Mistakes**: Personal learning issues better addressed in 1:1s
- **Expected Behaviors**: System acting according to design (even if design is wrong)
- **Minor Issues Without Impact**: Internal issues with no customer or business impact
- **Blame-Focused Requests**: When the goal is to identify who is responsible rather than improve systems

## Workflow

1. Collect incident timeline with timestamps from all sources
2. Collect evidence: alerts, logs, monitoring dashboards, communications
3. Perform Five Whys root cause analysis
4. Identify contributing factors (not just root cause)
5. Generate systemic corrective actions (prevent recurrence)
6. Write dual-audience report: executive summary + technical detail

## Input

| Input                              | Required  | Source                                                           |
| ---------------------------------- | --------- | ---------------------------------------------------------------- |
| Incident timeline                  | ✅        | {{CHAT_TOOL}} incident channel, logs, monitoring                 |
| Alerts triggered                   | ✅        | Alerting platform — Example (PagerDuty / Opsgenie)               |
| Relevant logs                      | ✅        | Log aggregation — Example (ELK / CloudWatch / app logs)          |
| Monitoring dashboards              | ✅        | Observability platform — Example (Datadog / Grafana) screenshots |
| Communication records              | ✅        | {{CHAT_TOOL}} threads, war room notes                            |
| Change Request (if deploy-related) | Desirable | skill `change-request/`                                          |
| Previous postmortems               | Desirable | Postmortem repo (detect patterns)                                |

## Output Template

```markdown
# Postmortem: {INCIDENT-ID} — {Title}

## Classification

| Field                  | Value                                               |
| ---------------------- | --------------------------------------------------- |
| **Severity**           | S1 / S2 / S3                                        |
| **Duration**           | {detection → resolution}                            |
| **Impact**             | {who was affected, how many, what couldn't they do} |
| **Status**             | Draft / Reviewed / Published                        |
| **Incident Commander** | [name]                                              |
| **Date**               | [YYYY-MM-DD]                                        |

## Executive Summary (1 paragraph — for management)

[What happened, how long, who was affected, how it was resolved, what we're doing to prevent recurrence. Business language, no jargon.]

## Timeline

| Time (UTC) | Event           | Source             |
| ---------- | --------------- | ------------------ |
| {HH:MM}    | [what happened] | [log/alert/person] |

## Impact Analysis

- Users affected: {N} ({X}% of total)
- Revenue impact: {if applicable}
- Data loss: {yes/no — details}
- SLA impact: {if applicable}

## Root Cause Analysis — Five Whys

1. **Why** did {symptom}? → Because {cause 1}
2. **Why** did {cause 1}? → Because {cause 2}
3. **Why** did {cause 2}? → Because {cause 3}
4. **Why** did {cause 3}? → Because {cause 4}
5. **Why** did {cause 4}? → Because {root cause}

**Root Cause:** {systemic root cause}

## Contributing Factors

- [Factor 1 — what made the impact worse or detection slower]
- [Factor 2]

## What Went Well

- [Things that worked during incident response]

## What Went Poorly

- [Things that made response harder — NOT people, but systems/processes]

## Corrective Actions

| #   | Action         | Type                        | Owner  | Deadline | Priority |
| --- | -------------- | --------------------------- | ------ | -------- | -------- |
| 1   | [systemic fix] | Prevent / Detect / Mitigate | [name] | [date]   | P1/P2    |

## Lessons Learned

- [Lesson 1 — applicable beyond this incident]
```

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Incident analysis compliance patterns
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

## Key Rules

### Blameless Culture (Critical)

- **Blameless language**: "The monitoring gap allowed..." NOT "John failed to monitor..."
- **Systems thinking**: Focus on how systems enabled the incident, not individual actions
- **Learning mindset**: Frame as learning opportunity, not fault-finding exercise
- **Safe space**: Encourage honest sharing without fear of punishment
- **Human factors**: Recognize that skilled professionals made reasonable decisions given available information

### Root Cause Analysis Standards

- **Five Whys goes deep**: Stop at systemic causes, not human error. "Engineer deployed wrong config" → WHY was it possible? → lack of validation → WHY no validation? → process gap
- **Multiple causes**: Most incidents have multiple contributing factors, not single root cause
- **Proximate vs root**: Distinguish between immediate trigger and underlying system weakness
- **Ask "How" not "Who"**: Focus on how systems allowed the incident, not who was involved
- **Evidence-based**: Every "Why" must be supported by concrete evidence

### Documentation Requirements

- **Timeline is sacred**: Every action with UTC timestamp. This is the factual backbone
- **Multiple sources**: Correlate evidence from logs, monitoring, communications, and human accounts
- **Preserve context**: Capture what information was available to responders at each moment
- **Objective language**: State facts, avoid interpretation or judgment
- **Visual aids**: Include screenshots of dashboards, alert messages, and error states

### Corrective Action Standards

- **Systemic fixes only**: "Be more careful" is NOT a corrective action. "Add automated config validation to CI pipeline" IS
- **Action types**: Prevent (stop it from happening), Detect (find it faster), Mitigate (reduce impact)
- **Ownership**: Each action must have specific owner and concrete deadline
- **Prioritization**: P1 (prevent recurrence), P2 (improve detection), P3 (reduce impact)
- **Measurable outcomes**: Actions must have verifiable completion criteria

### Process & Timing Requirements

- **Deadline: 72h**: Draft in 24h, review in 48h, publish in 72h. Context fades fast
- **Stakeholder review**: Include incident commander, service owner, and affected teams in review
- **Executive communication**: Separate executive summary from technical details
- **Follow-up tracking**: Schedule reviews to verify corrective actions are completed
- **Knowledge sharing**: Share lessons learned with broader engineering organization

### Quality Standards

- **Pattern detection**: Check previous postmortems for recurring themes and systemic issues
- **Actionable insights**: Every postmortem should generate concrete improvements
- **Proportional response**: Corrective actions should match the severity and impact of the incident
- **Cross-functional input**: Include perspectives from engineering, operations, support, and product teams
- **Continuous improvement**: Use postmortem quality as a metric for incident response maturity

### Domain-Agnostic Applications

- **Technology neutral**: Framework applies to web services, mobile apps, data pipelines, embedded systems, or infrastructure
- **Scale neutral**: Principles work for startup teams or enterprise environments
- **Industry neutral**: Suitable for financial services, healthcare, e-commerce, or any regulated industry
- **Role neutral**: Any team member can initiate or contribute to postmortem process
- **Tool neutral**: Works with any incident management, monitoring, or communication tools

---

## Changelog

| Version | Date       | Author                       | Changes                                                                                                                                    |
| ------- | ---------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1.2.1   | 2026-06-09 | TL: BMad-coherence batch-fix | Added "Relationship to BMad" note (LIDR-unique post-incident artifact, distinct from bmad-retrospective)                                   |
| 1.2.0   | 2026-06-09 | TL: lang+tool agnostic       | Language to English-default-configurable; abstracted chat tools via tool-registry                                                          |
| 1.1.0   | 2026-04-06 | System: Phase 2 Remediation  | Added comprehensive "When to Use" section, expanded Key Rules with structured guidelines, added changelog section for LIDR SDLC compliance |
| 1.0.1   | 2026-03-16 | System: Normalization        | Domain-agnostic normalization updates                                                                                                      |
| 1.0.0   | 2026-02-01 | PME: Initial Release         | Initial blameless postmortem structurer with Five Whys framework                                                                           |
