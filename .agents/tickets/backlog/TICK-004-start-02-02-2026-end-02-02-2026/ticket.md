---
id: TICK-004
title: Create video tutorials and troubleshooting guide
status: backlog
priority: medium
assignee: documentation-team
type: docs
provider: none
external_link: null
created_at: 2026-02-02 00:00
updated_at: 2026-02-02 00:00
---

# Create Video Tutorials and Troubleshooting Guide

## Description

Create comprehensive video tutorials demonstrating complete workflows and a detailed troubleshooting guide for multi-platform issues.

**Context:** Text documentation exists but visual learners need video walkthroughs. New team members spend 30-60 minutes reading docs before first ticket - video tutorials can reduce this to 10-15 minutes. Troubleshooting guide will reduce support requests by addressing common issues proactively.

**Scope:**
- Included: 3 video tutorials (5, 10, 15 min), comprehensive troubleshooting guide, quick reference cheat sheet
- Excluded: Platform-specific installation videos (focus on workflow after installation)

**Impact:** Onboarding time reduction from 2 hours → 30 minutes (75% improvement). Support request reduction estimated 60% for common issues.

## Acceptance Criteria

- [ ] Video 1: "Your First Ticket" (5 minutes) - Create, enrich, implement simple ticket
- [ ] Video 2: "Complete Workflow Walkthrough" (10 minutes) - Full lifecycle with validation
- [ ] Video 3: "Advanced Patterns" (15 minutes) - Multi-agent coordination, complex tickets
- [ ] Troubleshooting guide covers 20+ common issues with solutions
- [ ] Quick reference cheat sheet (1-page PDF) with all commands and patterns
- [ ] Videos hosted on accessible platform (YouTube, Vimeo, or company internal)
- [ ] Videos have captions/subtitles for accessibility
- [ ] All video links added to main README and CLAUDE.md

## Definition of Done

**Standard checklist:**
- [ ] All acceptance criteria met
- [ ] Documentation reviewed for clarity and accuracy
- [ ] Code reviewed and approved
- [ ] No linting errors or warnings (markdown)
- [ ] Conventional commit created with TICK-ID
- [ ] PR created with proper template

**Docs-specific:**
- [ ] Examples included and tested
- [ ] Links verified (no broken links)
- [ ] Screenshots up-to-date (if applicable)
- [ ] Cross-references added (related docs linked)
- [ ] Index/table of contents updated

## BDD Scenarios

```gherkin
Feature: Video Tutorial Effectiveness

  Scenario: New developer watches "Your First Ticket"
    Given a new developer with no prior ticket system experience
    When they watch the 5-minute video
    Then they can create and enrich their first ticket
    And complete the workflow without additional documentation
    And time to first ticket is under 10 minutes

  Scenario: Developer follows complete walkthrough
    Given a developer familiar with basic concepts
    When they watch the 10-minute walkthrough
    Then they understand the full lifecycle
    And can apply patterns to their own work
    And recognize when to use validation commands

  Scenario: Team lead learns advanced patterns
    Given a team lead planning complex features
    When they watch the 15-minute advanced patterns video
    Then they understand multi-agent coordination
    And can design efficient ticket breakdowns
    And know how to use orchestration patterns

Feature: Troubleshooting Guide Usage

  Scenario: Developer encounters sync error
    Given developer runs sync-all.sh and gets error
    When they search troubleshooting guide for "sync error"
    Then they find the exact error message listed
    And see step-by-step solution
    And resolve the issue within 5 minutes

  Scenario: Platform-specific issue (Antigravity)
    Given Antigravity user with MCP not working
    When they check platform-specific troubleshooting section
    Then they find "Antigravity MCP Limitation" entry
    And understand it requires global configuration
    And see link to detailed setup guide

  Scenario: Quick command lookup
    Given developer forgot syntax for /enrich-ticket
    When they open quick reference cheat sheet
    Then they find command with example in under 10 seconds
```

## Tasks

- [ ] Script Video 1: "Your First Ticket" - Assigned to: tech-lead
- [ ] Script Video 2: "Complete Workflow" - Assigned to: tech-lead
- [ ] Script Video 3: "Advanced Patterns" - Assigned to: tech-lead
- [ ] Record and edit Video 1 - Assigned to: video-editor
- [ ] Record and edit Video 2 - Assigned to: video-editor
- [ ] Record and edit Video 3 - Assigned to: video-editor
- [ ] Add captions/subtitles to all videos - Assigned to: video-editor
- [ ] Compile 20+ troubleshooting entries - Assigned to: developer-name
- [ ] Design quick reference cheat sheet - Assigned to: designer
- [ ] Test videos with 3-5 new users - Assigned to: QA-team
- [ ] Update README with video links - Assigned to: doc-improver agent
- [ ] Create docs/videos/README.md index - Assigned to: doc-improver agent

## Notes

**Decision log:**
- Decision 1: Use screen recording + voiceover (not talking head) to keep focus on workflow
- Decision 2: Host on YouTube unlisted (accessible via link only, not searchable)
- Decision 3: Include timestamps in video descriptions for easy navigation
- Decision 4: Use real examples from TICK-001, TICK-002, TICK-003 for authenticity

**Trade-offs:**
- Production quality vs speed: Prioritized clear audio and smooth navigation over cinematic quality
- Length vs depth: Video 3 at 15 min (could be 20-25) but keep under attention span limit

**Video Structure:**

**Video 1: "Your First Ticket" (5 min)**
```
0:00 - Intro (30s)
0:30 - Creating ticket with /create-ticket (2min)
2:30 - Enriching with /enrich-ticket (1min)
3:30 - Creating branch and basic implementation (1min)
4:30 - Recap and next steps (30s)
```

**Video 2: "Complete Workflow" (10 min)**
```
0:00 - Intro (30s)
0:30 - Ticket creation (1min)
1:30 - Enrichment and validation (2min)
3:30 - Implementation with commits (3min)
6:30 - PR validation with /validate-pr (2min)
8:30 - Archive workflow (1min)
9:30 - Recap (30s)
```

**Video 3: "Advanced Patterns" (15 min)**
```
0:00 - Intro (1min)
1:00 - Multi-agent coordination patterns (5min)
6:00 - Complex ticket breakdown (4min)
10:00 - Troubleshooting common issues (3min)
13:00 - Best practices and tips (1min)
14:00 - Recap (1min)
```

**Troubleshooting Guide Structure:**
```markdown
# Troubleshooting Guide

## Quick Diagnostics
- Run diagnostic: ./check-system.sh
- Verify installation: ./verify-setup.sh

## Common Issues

### Sync Issues
1. sync-all.sh fails with permission error
2. Symlinks pointing to wrong location
3. Platform not detecting new configs

### Platform-Specific
1. Cursor rules not appearing (Cursor)
2. Commands not recognized (Claude Code)
3. MCP servers not loading (Gemini CLI)
4. Antigravity limitations (Antigravity)

### Ticket Workflow
1. /enrich-ticket not finding ticket
2. /validate-pr fails on valid PR
3. Pre-commit hook blocking legitimate commits

### Git Integration
1. Branch naming not recognized
2. TICK-ID extraction failing
3. Hook timeouts

## Advanced Debugging
[Detailed debugging steps]
```

**Cheat Sheet Content:**
```
┌─────────────────────────────────────────────────┐
│ LIDR AI Workflow - Quick Reference             │
├─────────────────────────────────────────────────┤
│ COMMANDS                                        │
│ /create-ticket [type]  - Create new ticket     │
│ /enrich-ticket TICK-id - Validate ticket       │
│ /validate-pr           - Check PR readiness    │
│                                                 │
│ WORKFLOW                                        │
│ 1. Create  → /create-ticket feature            │
│ 2. Enrich  → /enrich-ticket TICK-001           │
│ 3. Branch  → git checkout -b feature/TICK-001  │
│ 4. Code    → (implement + test + docs)         │
│ 5. Validate→ /validate-pr                      │
│ 6. Commit  → git commit -m "feat(TICK-001):"   │
│ 7. PR      → gh pr create                      │
│ 8. Archive → mv to archived/2026-Q1/           │
│                                                 │
│ BRANCH NAMING                                   │
│ feature/TICK-###-description                    │
│ fix/TICK-###-description                        │
│ refactor/TICK-###-description                   │
│ docs/TICK-###-description                       │
└─────────────────────────────────────────────────┘
```
