---
name: product-roadmap
description: LIDR Template Q1 2026 roadmap with phased delivery timeline
alwaysApply: false
globs: ["docs/**/*.md", "README.md"]
argument-hint: <roadmap-doc>
paths: ["docs/**/*.md"]
trigger: always_on
---

# Product Roadmap - Q1 2026

## Current State (Complete)

### Delivered Components
- **Rules System:** 14 rules across 8 categories (code, content, design, frameworks, process, quality, team, tools)
- **Skills System:** 9 operational skills (agent-development, command-development, skill-development, hook-development, mcp-integration, commit-management, keybindings-help, find-skills, team-skill-creator)
- **Commands:** 3 workflow commands (commit, improve-docs, sync-setup)
- **Agents:** 1 specialized agent (doc-improver)
- **MCP Integration:** Context7 server configured across all platforms
- **Synchronization:** sync-all.sh orchestrator with platform-specific sync scripts

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

### 2. Hooks Implementation
**Objective:** Implement comprehensive git workflow automation

**Deliverables:**
- [ ] Pre-commit hook for validation (code style, tests, security)
- [ ] Post-merge hook for cleanup (sync configs, update deps)
- [ ] Pre-push hook for comprehensive checks (all tests, docs, linting)
- [ ] hooks.json configuration with clear examples
- [ ] Hook development guide in docs/

**Success Criteria:**
- 100% of commits follow conventional commit format
- Zero linting errors reach main branch
- Pre-commit hook runs in <5 seconds

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
- [ ] `ticket-enricher` agent (validates ticket completeness)
- [ ] `pr-validator` agent (checks DoD, tests, docs)
- [ ] Agent integration with hooks
- [ ] Agent usage guides and examples

**Success Criteria:**
- 95% of tickets pass enrichment without manual edits
- Zero incomplete PRs reach review
- PR validation runs in <30 seconds

### 4. Workflow Commands
**Objective:** User-friendly commands for ticket lifecycle

**Deliverables:**
- [ ] `/create-ticket` command (interactive ticket creation)
- [ ] `/enrich-ticket` command (invoke ticket-enricher)
- [ ] `/validate-pr` command (invoke pr-validator)
- [ ] Command documentation with examples

**Success Criteria:**
- Ticket creation takes <2 minutes
- Commands work on all 4 platforms
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

| Milestone | Date | Deliverables | Success Criteria |
|-----------|------|--------------|------------------|
| M1: Core Pillars Complete | End Month 1 | Orchestrator docs, Hooks implemented | Hooks run on all commits, <5s execution |
| M2: Ticket System Operational | End Month 2 | Tickets, Skills, Agents, Commands | 95% tickets pass enrichment, 100% PRs validated |
| M3: Full Rollout | End Month 3 | Testing, Docs, Training | 80% adoption, all 4 metrics met |

## Success Criteria Validation

**At end of Q1 2026, verify ALL 4 metrics:**

### 1. Setup Time: <5 minutes (vs 2-4 hours)
```bash
time (git clone repo && cd repo && ./.agents/sync-all.sh)
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
./.agents/sync-all.sh --dry-run
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
- **Mitigation:** Test on all 4 platforms after each phase
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
