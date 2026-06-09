---
name: lidr-help
description: Answer questions about the LIDR SDLC ecosystem and recommend the next skill, command, workflow, or doc. LIDR is the SDLC governance layer (phases 0–8, gates G0–G7, roles/RACI) that wraps and extends BMad — for pure BMad module questions, this skill defers to `bmad-help`. Use when someone asks "what can you do", "how do I", "help me with", "what command/skill should I use", "which gate", "where is", "explain the process", "qué comando uso", "cómo empiezo".
allowed-tools: Read, Grep, Glob, Bash(find:*), Bash(cat:*), Bash(grep:*), AskUserQuestion
model: haiku
---

# LIDR Help — Ecosystem Guide

## Purpose

Help the user understand **where they are in the LIDR SDLC flow** and **what to do next**, then point them to the exact skill, command, or workflow — with how to invoke it. LIDR is the governance layer (phase-gate SDLC, roles, RACI, spec-lifecycle) that **wraps and extends BMad**; this skill reasons about that combined surface and hands BMad-internal questions to `bmad-help`.

This skill replaces the former `/lidr-help` command. It keeps the same `/lidr-help` invocation (skills are user-invocable) but, unlike the old command, it **reads the ecosystem at runtime** instead of carrying a hand-maintained registry that drifts.

## Desired Outcomes

When this skill completes, the user should:

1. **Know where they are** — which SDLC phase (0–8) and gate (G0–G7), what's already done.
2. **Know what to do next** — the next recommended/required skill or command, with reasoning and role check.
3. **Know how to invoke it** — `/command` or skill name in backticks, plus args.
4. **Get offered a quick start** — when one step is the clear next move, offer to run it now.
5. **Feel oriented, not overwhelmed** — surface only what's relevant to their position; don't dump the catalog.
6. **Get answers to general questions** — when it doesn't map to a step, ground the answer in the rules/docs; for BMad module specifics, invoke `bmad-help`.

## Data Sources (read live — never hardcode counts)

Resolve the answer from the source-of-truth tree, not from memory:

- **Workflow authority** — `.agents/rules/lidr-sdlc/workflows.md`: the role × command matrix, phase flow, gate preconditions, and typical command chains. This is the primary router.
- **Command catalog** — `.agents/commands/*.md` frontmatter `description:` (live list of slash commands).
- **Skill catalog** — `.agents/skills/*/SKILL.md` frontmatter `name:` + `description:` (both `lidr-*` and `bmad-*`).
- **SDLC model** — `.agents/rules/lidr-sdlc/org.md` (phases, gates, RACI, quality/security policy), `project.md` (active client, team, roles), `model-selection.md` (Opus-planning vs Sonnet-impl), `spec-execution.md` (mandatory test steps), `documentation.md` (DTC).
- **LIDR↔BMad map** — `.agents/_shared/lidr/MIGRATION.md` if present (which BMad skills LIDR wraps).
- **BMad internals** — for questions about a BMad module's own flow/menu, invoke the **`bmad-help`** skill rather than answering from this layer.

Quick catalog scan when needed:

```bash
# live command list
for f in .agents/commands/*.md; do echo "/$(basename "$f" .md): $(grep -m1 'description:' "$f" | sed 's/.*description: *//')"; done
# live skill list
for f in .agents/skills/*/SKILL.md; do grep -m1 'name:' "$f"; done
```

## How LIDR extends BMad

LIDR does **not** replace BMad — it adds the SDLC governance wrapper around it. Recommend the BMad skill for the core artifact and the LIDR skill/command for the gate, traceability, and orchestration layer:

| BMad provides (core)                        | LIDR adds (governance wrapper)                                                           |
| ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `bmad-prd` (unified PRD)                    | `lidr-review-cruzado` (Gate-1 F+T check), `/lidr-validate-prd` (scored Gate-1 readiness) |
| `bmad-create-epics-and-stories`             | `/lidr-validate-requirements` (RFs+NFRs+RTM, Gate-2)                                     |
| `bmad-create-story`                         | `lidr-refinement-notes` (DoR / Gate-3 layer)                                             |
| `bmad-testarch-*` (test design/automate)    | `/lidr-prepare-testing`, `lidr-test-execution-report` (Gate-5 sign-off)                  |
| `bmad-quick-dev` (code an intent)           | `/lidr-implement-ticket`, the `/lidr-spec-*` lifecycle (branch→tests→PR→handoff, Gate-4) |
| `bmad-correct-course`, `bmad-sprint-status` | `/lidr-course-correct`, `/lidr-sprint-health` (SDLC + portfolio framing)                 |

When the user's need is the artifact itself → recommend the BMad skill. When it's _governance_ (which gate, who signs off, traceability, what's next) → that's the LIDR layer.

## Query Routing

Parse `$ARGUMENTS` (the user's question). If empty, show a short interactive menu (phases, roles, "I'm stuck / catch-up", "browse by artifact") via AskUserQuestion — do not dump everything.

- **ROLE_QUERY** ("what can QA do", "soy Tech Lead") → from `workflows.md` matrix, list the commands that role may run and the phase they sit in.
- **PHASE / GATE_QUERY** ("gate 5", "fase 3") → explain the gate's criteria + required artifacts (from `org.md`) and the skills/commands that produce them.
- **ACTION / WORKFLOW_QUERY** ("how do I ship a hotfix", "start a sprint") → recommend the command chain from `workflows.md` ("Cadena típica").
- **CATCHUP_QUERY** ("my project has no PRDs") → recommend the retrofit chain (bmad-prd → review-cruzado → advance-gate retroactive …).
- **ARTIFACT_QUERY** ("ADR", "release notes") → name the owning skill/command + where output lands.
- **BROWSE_QUERY** → grouped overview by phase, terse.

Always verify the **role permission** and **gate precondition** before recommending a restricted command (per `workflows.md` §7). If the role is unclear, ask.

## Response Format

For each recommendation:

- **How to invoke** — `/command-name` or skill `name` in backticks, with args.
- **One line** on what it does (from its live `description:`).
- **Context** — the phase/gate it belongs to and the role that may run it.
- **Offer to run it** when it's the single clear next step.

Order: optional items first, then the next _required_ step — make clear which is which.

## Constraints

- Present output in the client communication language (Spanish for functional content per `project.md`; technical terms stay English).
- Recommend running heavy workflows (`/lidr-spec-ff`, planning) in a **fresh context window**.
- Surface only what's relevant — never paste the full catalog.
- **Never fabricate** counts or artifacts; read the tree. If a number is asked, count files live.
- For BMad-module internals, defer to **`bmad-help`**; for "create a skill/command/agent", point to `lidr-agents-architecture`.
- Match tone — conversational when casual, structured when they want specifics.
