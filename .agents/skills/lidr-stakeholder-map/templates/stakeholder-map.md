---
id: tpl-stakeholder-map
version: "1.1.0"
last_updated: "2026-06-09"
updated_by: "TL: lang+tool agnostic"
status: active
type: template
review_cycle: 60
next_review: "2026-05-15"
owner_role: "PME"
language_default: en
integrations: [chat]
---

# Stakeholder Map Template

> **Usage**: Stakeholder map with power-interest matrix. Used by the `stakeholder-map` skill.
> **Gate**: Gate 0 (Intake)

Tools resolve via the central registry `_shared/lidr/integrations/tool-registry.yaml`; the active client binds concrete tools in `clients/<CODE>.yaml`.

---

## Metadata

| Field         | Value          |
| ------------- | -------------- |
| Project       | {project_name} |
| Owner         | {pme_name}     |
| Creation date | {YYYY-MM-DD}   |
| Last updated  | {YYYY-MM-DD}   |

---

## Stakeholder Map

| Name   | Role   | Organization | Power           | Interest        | Strategy                                                  | Preferred channel                        | Frequency                           | Notes   |
| ------ | ------ | ------------ | --------------- | --------------- | --------------------------------------------------------- | ---------------------------------------- | ----------------------------------- | ------- |
| {name} | {role} | {org/area}   | high/medium/low | high/medium/low | manage closely / keep satisfied / keep informed / monitor | email / {{CHAT_TOOL}} / meeting / report | daily / weekly / biweekly / monthly | {notes} |

---

## Power-Interest Matrix (2x2)

```
Power ↑

  HIGH  │  Keep Satisfied    │  Manage Closely     │
        │  {names}           │  {names}            │
        │                    │                     │
  ──────┼────────────────────┼─────────────────────┤
        │                    │                     │
  LOW   │  Monitor           │  Keep Informed      │
        │  {names}           │  {names}            │
        │                    │                     │
        └────────────────────┴─────────────────────→
              LOW                  HIGH         Interest
```

---

## Management Strategies

| Quadrant                                       | Strategy              | Typical actions                                         |
| ---------------------------------------------- | --------------------- | ------------------------------------------------------- |
| **Manage Closely** (high power, high interest) | Active engagement     | Regular meetings, joint decision-making, feedback loops |
| **Keep Satisfied** (high power, low interest)  | Inform proactively    | Executive reports, early risk escalation                |
| **Keep Informed** (low power, high interest)   | Regular communication | Newsletters, demos, dashboard access                    |
| **Monitor** (low power, low interest)          | Passive observation   | General communications, quarterly reports               |

---

## Derived Communication Plan

| Audience     | Key message           | Channel   | Frequency   | Owner  |
| ------------ | --------------------- | --------- | ----------- | ------ |
| {group/name} | {what to communicate} | {channel} | {frequency} | {name} |

---

## Change History

| Date         | Change                                                       | Owner  |
| ------------ | ------------------------------------------------------------ | ------ |
| {YYYY-MM-DD} | {change description: new stakeholder, strategy change, etc.} | {name} |
