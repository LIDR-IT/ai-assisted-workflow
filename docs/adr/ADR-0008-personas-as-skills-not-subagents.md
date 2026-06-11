---
id: adr-0008
version: "1.0.0"
last_updated: "2026-06-11"
updated_by: "TL: ecosystem design (Design Thinking session)"
status: active
type: standard
review_cycle: 90
next_review: "2026-09-09"
owner_role: "Tech Lead"
---

# ADR-0008: BMad Personas Live as Skills, Not Subagents

## Status

Accepted (2026-06-11)

## Context

After the BMad+LIDR merge, the 13 BMad agent personas (`bmad-agent-*`,
`bmad-cis-agent-*`, `bmad-tea`) existed in **two places**:

1. `.agents/skills/<name>/SKILL.md` — the full persona (activation steps,
   greeting, menu, "stop and wait for input", session-persistent identity).
2. `.agents/subagents/<name>.agent.md` — a **one-line wrapper**:
   _"LOAD the FULL SKILL.md and follow its directions"_.

Evidence gathered before deciding (2026-06-11):

- **Claude Code:** the `.agent.md` files (Copilot naming) were NOT registered
  as invocable subagent types — verified empirically in-session. Dead weight.
- **Antigravity:** subagents unsupported entirely.
- **Copilot:** `.agent.md` worked as a chat-mode entry, but Copilot also reads
  the same personas natively from `.agents/skills/` — pure redundancy.
- **`bmad-party-mode`:** builds persona prompts **inline** and spawns generic
  agents; it never referenced the wrappers.
- **User validation:** asked how they invoke a persona, team members enter
  via the skill ("talk to Mary"), not via an agent picker.

The deeper mismatch is in execution model: **personas are conversational
(main-loop) artifacts** — they greet, present menus, wait for input, and keep
their identity across the session. **Subagents run forked** — autonomous,
non-interactive, returning a final result. A persona inside a fork cannot
converse; the designed experience breaks.

## Decision

1. The 13 BMad persona wrappers are **removed** from `.agents/subagents/`
   (and their generated `.github/agents/*.agent.md` copies).
2. Personas live **exclusively as skills**, readable natively or via symlink
   on all 5 platforms (Claude Code, Cursor, Gemini CLI, Copilot, Antigravity).
3. `.agents/subagents/` holds **only autonomous workers** — currently the 10
   `lidr-*` agents (qa, security, release, docs, metrics, onboarding,
   pr-validator, ticket-enricher, doc-improver, spec-orchestrator).

**The criterion going forward:**

> _Does it converse with the user? → **skill** (persona)._
> _Does it work autonomously and report back? → **subagent** (worker)._

When a persona is needed **inside** a fork (e.g. `bmad-party-mode`
roundtables), spawn a generic agent with the persona prompt inline or a
"LOAD skill X" instruction — no registered subagent file is required.

## Consequences

- Single source of truth restored for personas (no second door that is
  sometimes walled off, sometimes missing, sometimes redundant).
- Subagent count: 23 → **10**. Updated: `CLAUDE.md` (orchestrator),
  `README.md` (badge + tree), `.agents/subagent-readme.md`,
  `app/src/data/simple-stats.ts` (+ test), `sitemapView.ts`,
  `integrityTests.ts`, `MIGRATION.md`, propuesta JSONs (aramis, base).
- Copilot users lose the agent-picker entry for personas; the skill path
  (validated as the path actually used) remains on all platforms.
- `ecosystem-coherence.test.ts` guards the counts dynamically
  (filesystem ↔ CLAUDE.md ↔ README), so regrowth of wrappers without
  doc updates fails CI.

## Alternatives Considered

- **Keep both (status quo):** rejected — wrappers were dead on Claude Code,
  unsupported on Antigravity, redundant on Copilot, unused by party-mode,
  and violated the single-source-of-truth principle.
- **Subagents only (delete persona skills):** rejected — breaks the designed
  conversational experience on every platform; skills are the only universal
  surface.

## Changelog

| Version | Date       | Author               | Changes                              |
| ------- | ---------- | -------------------- | ------------------------------------ |
| 1.0.0   | 2026-06-11 | TL: ecosystem design | Initial decision — personas = skills |
