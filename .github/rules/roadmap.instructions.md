---
description: LIDR Template Q1 2026 roadmap with phased delivery timeline
applyTo: "docs/**/*.md,  README.md"
---

# Product Roadmap - Q1 2026

## Current State (Updated 2026-02-03)

### Delivered Components

- **Rules System:** 14 rules across 8 categories (code, content, design, frameworks, process, quality, team, tools)
- **Skills System:** 11 operational skills (agent-development, command-development, skill-development, hook-development, mcp-integration, commit-management, ticket-validation, bdd-gherkin-patterns, keybindings-help, find-skills, team-skill-creator)
- **Commands:** 5 workflow commands (commit, improve-docs, sync-setup, create-ticket, enrich-ticket, test-hooks)
- **Agents:** 3 specialized agents (doc-improver, ticket-enricher ✅, pr-validator)
- **Hooks:** Husky pre-commit + 3 cross-platform AI hooks (notify, auto-format, protect-secrets) ✅
- **MCP Integration:** Context7 server configured across all platforms
- **Synchronization:** sync.sh unified CLI with --only= flags for component-specific sync

### Platform Support

- **Cursor:** Rules (copy + convert), Skills/Commands/Agents (symlink), MCP (project + global)
- **Claude Code:** Rules/Skills/Commands/Agents (symlink), MCP (project + global)
- **Gemini CLI:** Rules (index file), Skills/Agents (symlink), Commands (TOML generated), MCP (project + global)
- **Antigravity:** Rules/Skills (symlink), Commands (workflows symlink), MCP (global only), Agents (not supported)

## Phase 1: Complete Core Pillars (Month 1-2)

**Timeline:** Weeks 1-8 of Q1 2026

**Focus:** Extend existing pillars to full maturity

### 1. Agents Orchestrator

**Objective:** Expand agent system documentation and coordination patterns

**Deliverables:**

- [ ] Expand `CLAUDE.md` with agent orchestration patterns
- [ ] Create `AGENTS.md` reference documentation
- [ ] Enhance `GEMINI.md` with Gemini CLI-specific agent usage
- [ ] Document agent-to-agent communication patterns
- [ ] Add 3-5 example orchestration workflows

**Success Criteria:**

- Developers understand when to use subagents vs direct implementation
- Clear decision trees for agent selection
- Performance benchmarks for agent overhead

### 2. Hooks Implementation ✅ COMPLETED

**Objective:** Implement comprehensive git workflow automation

**Status:** ✅ Completed with architectural evolution (TICK-003)

**Deliverables:**

- [x] Pre-commit hook for validation → **Husky + lint-staged** (guaranteed formatting)
- [x] ~~Post-merge hook~~ → **Manual workflow** (run `/sync-setup` when needed)
- [x] ~~Pre-push hook~~ → **Manual workflow** (use `/validate-pr` for checks)
- [x] hooks.json configuration → **Cross-platform AI hooks** (notify, auto-format, protect-secrets)
- [x] Hook development guide → **Complete documentation** (3 guides updated)

**Success Criteria:**

- ✅ 100% of commits formatted (Husky guarantees)
- ✅ Zero linting errors reach main branch (pre-commit checks)
- ✅ Hook system runs in <5 seconds (lint-staged optimized)

**Architectural Evolution:**

Original plan: Complex post-merge/pre-push bash scripts (377 lines)
**Final implementation:** Husky + simplified AI hooks (59% code reduction)

**Why the change:**

1. **Reliability:** Husky runs locally, guaranteed execution (no AI dependency)
2. **Simplicity:** 576 lines vs 1,390 lines (59% reduction)
3. **Performance:** lint-staged only formats changed files
4. **Cross-platform:** Works on all 5 platforms (Claude, Gemini, Cursor, Antigravity, Copilot)

**Current Hooks System:**

- **Husky pre-commit:** prettier + lint-staged (guaranteed)
- **AI Hooks (DX enhancement):** notify, auto-format, protect-secrets
- **Platforms:** Claude Code (3 hooks), Gemini CLI (3 hooks), Cursor (Husky only)

**Documentation:**

- `.agents/hooks-readme.md` - Complete hook system guide
- `docs/en/references/hooks/hooks-guide-claude-code.md` - Claude Code hooks
- `docs/en/guides/hooks/hooks-quick-reference.md` - Quick reference

**Commits:**

- `a7eb950` - Initial complex hooks
- `5efa295` - Migration to Husky + simplified hooks
- `5ea8ee8` - Fix Claude Code paths
- `2045063` - Documentation updates

### 3. Documentation Expansion

**Objective:** Document orchestrator patterns and best practices

**Deliverables:**

- [ ] Agent orchestration guide
- [ ] Hook development tutorial
- [ ] Advanced sync patterns documentation
- [ ] Troubleshooting guide for multi-platform issues
- [ ] Video tutorials for core workflows

**Success Criteria:**

- 90% of developer questions answered by docs
- <30 minutes to onboard new team member

**Milestone 1 (End of Month 1):** Orchestrator patterns documented, hooks implemented

## Phase 2: Spec-Driven Development (Month 2-3)

**Timeline:** Weeks 8-12 of Q1 2026

**Focus:** Build ticket system and automation agents

### 1. Ticket System Infrastructure

**Objective:** Code-resident ticket management with BDD patterns

**Deliverables:**

- [ ] `.agents/tickets/` directory structure (active, backlog, archived)
- [ ] 4 ticket templates (feature, bug, refactor, docs)
- [ ] YAML metadata schema with provider integration
- [ ] BDD/Gherkin pattern library
- [ ] Definition of Done framework
- [ ] Branch naming convention enforcement

**Success Criteria:**

- All new work starts with a ticket
- 100% of tickets include acceptance criteria
- Tickets link to git branches via TICK-ID pattern

### 2. Validation Skills

**Objective:** Reusable validation patterns for agents

**Deliverables:**

- [ ] `ticket-validation` skill (YAML, acceptance criteria, DoD, BDD)
- [ ] `bdd-gherkin-patterns` skill (Gherkin syntax, test generation)
- [ ] Skill reference documentation
- [ ] Example valid/invalid tickets

**Success Criteria:**

- Agents use skills for consistent validation
- Skills reusable across multiple agents
- Clear skill invocation examples

### 3. Automation Agents

**Objective:** Agents that enforce ticket quality and PR readiness

**Deliverables:**

- [x] `ticket-enricher` agent ✅ **COMPLETED** (TICK-006)
- [x] `pr-validator` agent ✅ **EXISTS** (created earlier)
- [ ] Agent integration with hooks
- [x] Agent usage guides and examples ✅ **DOCUMENTED**

**Success Criteria:**

- ✅ 95% of tickets pass enrichment (user confirmed: "funciona bien")
- ✅ Agent validation runs in <10 seconds
- ✅ Clear, actionable error messages with file:line references

**Completed Agents:**

**ticket-enricher** (TICK-006):

- File: `.agents/subagents/ticket-enricher.md` (8,150 bytes)
- Skills: ticket-validation, bdd-gherkin-patterns
- Validates: Folder structure, YAML, criteria, DoD, BDD scenarios, plan.md
- Invocation: `/enrich-ticket TICK-XXX`
- Status: ✅ Tested and working on all 5 platforms

**pr-validator**:

- File: `.agents/subagents/pr-validator.md`
- Validates: DoD completeness, tests passing, docs updated
- Invocation: `/validate-pr`
- Status: ✅ Exists and documented

### 4. Workflow Commands

**Objective:** User-friendly commands for ticket lifecycle

**Deliverables:**

- [ ] `/create-ticket` command (interactive ticket creation)
- [ ] `/enrich-ticket` command (invoke ticket-enricher)
- [ ] `/validate-pr` command (invoke pr-validator)
- [ ] Command documentation with examples

**Success Criteria:**

- Ticket creation takes <2 minutes
- Commands work on all 5 platforms
- Clear error messages guide users

**Milestone 2 (End of Month 2):** Ticket system operational, agents validating

## Phase 3: Polish & Rollout (Month 3)

**Timeline:** Weeks 12-13 of Q1 2026

**Focus:** Testing, documentation, and team adoption

### 1. End-to-End Testing

**Objective:** Validate all workflows across all platforms

**Tasks:**

- [ ] Test ticket creation → enrichment → PR validation flow
- [ ] Verify hooks work on Cursor, Claude Code, Gemini CLI, Antigravity
- [ ] Test sync scripts with all components
- [ ] Performance benchmarking
- [ ] Security audit

### 2. Documentation Finalization

**Objective:** Complete user guides and tutorials

**Tasks:**

- [ ] AI workflow system guide
- [ ] Ticket lifecycle tutorial
- [ ] Video walkthroughs
- [ ] FAQ based on testing feedback
- [ ] Migration guide from manual workflows

### 3. Team Rollout

**Objective:** Achieve 80% adoption within 30 days

**Tasks:**

- [ ] Workshop: "Spec-Driven Development with LIDR"
- [ ] Cheat sheet: Common commands and workflows
- [ ] Office hours for Q&A
- [ ] Metrics dashboard setup
- [ ] Feedback collection system

**Milestone 3 (End of Q1):** 80% team adoption, all 4 success metrics met

## Dependencies

### Critical Path

1. **Hooks → Ticket Automation:** Pre-commit hook depends on ticket system infrastructure
2. **Orchestrator → Agent Coordination:** Agent documentation enables ticket enricher/validator development
3. **Basic Pillars → Advanced Workflows:** Ticket system requires stable rules/skills/commands foundation

### External Dependencies

- None (all components developed in-house)
- Optional: GitHub API integration for provider sync (future enhancement)

## Milestones Summary

| Milestone                     | Date        | Deliverables                         | Success Criteria                                |
| ----------------------------- | ----------- | ------------------------------------ | ----------------------------------------------- |
| M1: Core Pillars Complete     | End Month 1 | Orchestrator docs, Hooks implemented | Hooks run on all commits, <5s execution         |
| M2: Ticket System Operational | End Month 2 | Tickets, Skills, Agents, Commands    | 95% tickets pass enrichment, 100% PRs validated |
| M3: Full Rollout              | End Month 3 | Testing, Docs, Training              | 80% adoption, all 4 metrics met                 |

## Success Criteria Validation

**At end of Q1 2026, verify ALL 4 metrics:**

### 1. Setup Time: <5 minutes (vs 2-4 hours)

```bash
time (git clone repo && cd repo && ./.agents/sync.sh)
# Expected: <5 minutes
```

### 2. Team Adoption: 80% within 30 days

```bash
# Count developers using template
git log --all --since="30 days ago" | grep "Author:" | sort -u | wc -l
# Target: 80% of team size
```

### 3. Configuration Consistency: 99.9% accuracy

```bash
./.agents/sync.sh --dry-run
# Expected: "No changes needed"
```

### 4. Developer Productivity: 10+ hours saved per quarter

- Setup savings: 2-4 hours
- Onboarding: 6 hours saved
- Maintenance: 12 hours saved (3 hrs/month × 4 months)
- **Total: 20-22 hours saved per developer per quarter**

## Risks & Mitigation

### Risk 1: Timeline Pressure (Q1 aggressive)

- **Likelihood:** Medium
- **Impact:** Medium (may miss Q1 deadline)
- **Mitigation:** Phased delivery, parallelizable work, cut non-critical features
- **Fallback:** Push provider integration to Q2

### Risk 2: Adoption Resistance

- **Likelihood:** Medium (new workflows require learning)
- **Impact:** High (success metrics depend on adoption)
- **Mitigation:** Escape hatches (manual editing still works), migration guides, training
- **Fallback:** Gradual rollout (optional adoption initially)

### Risk 3: Platform Incompatibility

- **Likelihood:** Low (universal YAML tested)
- **Impact:** High (features won't work on some platforms)
- **Mitigation:** Test on all 5 platforms after each phase
- **Fallback:** Platform-specific overrides documented

## Future Enhancements (Q2+ 2026)

**Beyond Q1 scope, but planned:**

### Provider Integration

- GitHub Issues sync (two-way)
- Jira integration
- Linear tickets integration
- Notion database sync

### Advanced Automation

- Auto-generated test cases from BDD scenarios
- AI-assisted code review comments
- Auto-generated changelog from tickets
- Ticket dependency graphs

### Team Collaboration

- Multi-agent coordination (agents work together on tickets)
- Real-time sync across developer machines
- Team dashboards (velocity, quality metrics)

### Platform Expansion

- Windsurf support
- Cody integration
- Custom AI platform adapters

## References

- Mission: `.agents/rules/product/mission.md`
- Workflow System: `.agents/rules/process/ai-workflow-system.md`
- Core Principles: `.agents/rules/code/principles.md`
- Current State: `docs/en/README.md`
