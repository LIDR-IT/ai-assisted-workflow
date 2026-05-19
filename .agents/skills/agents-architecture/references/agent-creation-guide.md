---
id: agent-creation-guide
version: "2.0.0"
last_updated: "2026-05-19"
updated_by: "TL: agents-architecture audit"
status: active
type: reference
review_cycle: 90
next_review: "2026-08-19"
owner_role: "Tech Lead"
---

# Subagent Creation Guide

Complete process for creating subagents within the `.agents/` source-of-truth system. Subagents are specialized, autonomous workers that handle multi-step tasks independently.

> **Terminology:** "Subagents" (Claude Code, Cursor), "Agents" (Gemini CLI Apr 2026), "Custom agents" (Copilot/VSCode). This guide uses "subagent" for the source artifact and "agent" interchangeably when discussing platform-specific names.

## Table of Contents

1. [What Are Subagents?](#what-are-subagents)
2. [Platform Support (verified May 2026)](#platform-support-verified-may-2026)
3. [When to Use Subagents](#when-to-use-subagents)
4. [File Location & Naming](#file-location--naming)
5. [Frontmatter Configuration](#frontmatter-configuration)
6. [System Prompt Design](#system-prompt-design)
7. [Creation Process](#creation-process)
8. [Synchronization](#synchronization)
9. [Best Practices](#best-practices)
10. [Examples](#examples)
11. [Validation & Troubleshooting](#validation--troubleshooting)

## What Are Subagents?

Subagents are **specialized autonomous workers** spawned to handle tasks requiring:

- Multiple steps and decision-making
- Deep codebase exploration
- Independent problem-solving with their own tool/context budget
- A focused system prompt distinct from the main agent

**Key characteristics:**

- Single Markdown file with YAML frontmatter (the system prompt below)
- Source of truth: `.agents/subagents/{name}.md`
- Distributed via symlinks (Claude, Cursor, Gemini) or generated copy (Copilot)
- Invoked by the main agent when its description matches the task

## Platform Support (verified May 2026)

| Platform             | Discovery path                   | Distribution                                         | File format     | Notes                                                                                     |
| -------------------- | -------------------------------- | ---------------------------------------------------- | --------------- | ----------------------------------------------------------------------------------------- |
| **Claude Code**      | `.claude/agents/<name>.md`       | Symlink → `.agents/subagents/`                       | Markdown + YAML | Native invocation via Agent tool                                                          |
| **Cursor**           | `.cursor/agents/<name>.md`       | Symlink → `.agents/subagents/`                       | Markdown + YAML | Same source as Claude                                                                     |
| **Gemini CLI**       | `.gemini/agents/<name>.md`       | Symlink → `.agents/subagents/`                       | Markdown + YAML | Subagents feature shipped Apr 2026 ([docs](https://geminicli.com/docs/core/subagents/))   |
| **Copilot (VSCode)** | `.github/agents/<name>.agent.md` | Generated copy (adapter renames `.md` → `.agent.md`) | Markdown + YAML | Per [VSCode docs](https://code.visualstudio.com/docs/copilot/customization/custom-agents) |
| **Antigravity**      | —                                | **Not supported**                                    | —               | No subagent feature documented as of May 2026                                             |

**4 of 5 platforms** support subagents from the same `.agents/subagents/` source. Only Antigravity does not.

## When to Use Subagents

### Good subagent candidates

**Use subagents when:**

- ✅ Multi-step workflows requiring decisions
- ✅ Deep codebase analysis or refactoring
- ✅ Autonomous operation needed (the main agent delegates and waits)
- ✅ Complex problem-solving with focused scope
- ✅ The work needs its own tool whitelist (different from main agent)

**Examples in this repo:**

- `lidr-qa-agent` — test plan generation when ticket enters Ready for QA
- `lidr-security-agent` — SAST/SCA/DAST interpretation and remediation prioritization
- `lidr-release-agent` — release notes + changelog + CR on merge to main
- `doc-improver` — generic documentation audit and refactor
- `pr-validator` — pre-PR validation
- `ticket-enricher` — ticket completeness check

### Poor subagent candidates

**Don't use subagents when:**

- ❌ Simple, single-turn tasks (use commands)
- ❌ Need bundled resources like templates (use skills)
- ❌ No decision-making required
- ❌ Quick prompts the main agent can handle inline

**Use commands instead:** security review checklist, commit message generation, code formatting prompts.

**Use skills instead:** React testing patterns (needs templates), database queries (needs schema docs), API integration (needs reference docs).

## File Location & Naming

### Source location

```
.agents/subagents/{name}.md
```

Symlinks resolve this to `.claude/agents/`, `.cursor/agents/`, `.gemini/agents/`. The Copilot adapter generates `.github/agents/{name}.agent.md`.

### Naming conventions

- Lowercase, hyphens
- Descriptive and action-oriented: `code-reviewer.md`, `test-generator.md`
- **LIDR convention:** project-specific agents are prefixed `lidr-*` (e.g. `lidr-qa-agent.md`)
- **Critical:** the `name:` field in frontmatter MUST match the filename (without `.md`). Audit fix applied May 2026 aligned all 6 LIDR subagents.

## Frontmatter Configuration

```markdown
---
name: agent-name # Must match filename
description: When this subagent should be invoked (the main agent reads this to decide)
tools: Read, Edit, Grep, Bash # Comma-separated or YAML list; omit to inherit all
model: sonnet # Optional: sonnet|opus|haiku (Claude)
color: blue # Optional: Claude UI tint
---

System prompt goes here...
```

### Required fields

- **name** — lowercase, hyphens, matches filename. Identifier the harness uses.
- **description** — when to invoke. The main agent matches user intent against this. Should answer: "what triggers this?" and "what work does it do?".

### Optional fields

- **tools** — restrict to a tool subset. Format varies by platform:
  - Claude Code: comma-separated string `Read, Grep, Bash` or YAML list `[Read, Grep, Bash]`
  - Other platforms accept the same; unrecognized fields are ignored.
  - Omit to grant all tools the parent has.
- **model** — Claude-specific. `sonnet` (default for most), `opus` (heavy reasoning), `haiku` (fast/cheap).
- **color** — Claude UI affordance. Values: `red`, `orange`, `yellow`, `green`, `blue`, `purple`, `pink`.

### Platform-specific field handling

| Field         | Claude | Cursor       | Gemini  | Copilot |
| ------------- | ------ | ------------ | ------- | ------- |
| `name`        | ✅     | ✅           | ✅      | ✅      |
| `description` | ✅     | ✅           | ✅      | ✅      |
| `tools`       | ✅     | ✅ (limited) | ✅      | ✅      |
| `model`       | ✅     | ignored      | ignored | ignored |
| `color`       | ✅     | ignored      | ignored | ignored |

Each platform ignores fields it doesn't recognize — safe to include all in one source file.

### Example frontmatter

**Simple:**

```yaml
---
name: code-reviewer
description: Use this agent when the user asks for code review on a recent change. It analyzes staged or specified files for quality, security, and best practices.
tools: Read, Grep, Bash
---
```

**Project-specific (LIDR pattern):**

```yaml
---
name: lidr-qa-agent
description: Use proactively when a ticket transitions to "Ready for QA". Generates test plan + test cases + bug report scaffolding from the implementation.
tools: Read, Grep, Glob, Bash, Write, Edit
model: sonnet
---
```

## System Prompt Design

The body below the frontmatter is the subagent's system prompt. It defines role, capabilities, workflow, and decision boundaries.

### Structure template

```markdown
# Agent Title

Brief role statement: "You are a subagent specialized in [task]."

## Your Capabilities

What the subagent can do (3-6 bullets).

## Your Workflow

Numbered steps the subagent follows.

## Autonomous Decision-Making

What it decides on its own vs. what it escalates to the main agent.

## Guidelines

Quality bars, constraints, anti-patterns.

## Output Format

Structure of the final report returned to the main agent.
```

### Writing effective system prompts

**1. Clear role statement.**

✅ `You are an autonomous subagent specialized in comprehensive code review and quality analysis.`
❌ `You review code.`

**2. Specific capabilities.**

✅ Bullet 5 capabilities with concrete verbs ("Detect SQL injection patterns", "Assess test coverage via grep on test files").
❌ "You can find problems."

**3. Defined workflow.**

✅ Numbered steps with verbs and tool hints ("Use Grep to find `eval(` calls in src/").
❌ "Look at code, find issues, report."

**4. Explicit autonomy boundaries.**

✅ Separate "decides independently" from "escalates to user" lists.
❌ "Make decisions about the code."

**5. Output contract.**

✅ Structured template (sections, severity ratings, file:line format).
❌ "Summarize findings."

## Creation Process

### Step 1: Define purpose

Answer:

- What multi-step task needs delegation?
- What decisions will the subagent make?
- What tools does it need?
- What does it return to the main agent?

### Step 2: Design system prompt

Write the body using the structure above. Be specific.

### Step 3: Configure frontmatter

```yaml
---
name: my-agent
description: Use this agent when [trigger]. It [primary action] and returns [output].
tools: Read, Grep, Bash
---
```

### Step 4: Create source file

```bash
# Source of truth (NOT .claude/agents/)
touch .agents/subagents/my-agent.md
```

Edit with your frontmatter + system prompt.

### Step 5: Sync to all platforms

```bash
./.agents/sync.sh --only=agents
```

This creates symlinks (`.claude/agents/`, `.cursor/agents/`, `.gemini/agents/`) and generates `.github/agents/my-agent.agent.md` for Copilot.

### Step 6: Verify

```bash
# Source
ls .agents/subagents/my-agent.md

# Symlinks (3 platforms)
readlink .claude/agents   # → ../.agents/subagents
readlink .cursor/agents   # → ../.agents/subagents
readlink .gemini/agents   # → ../.agents/subagents

# Copilot (generated copy)
ls .github/agents/my-agent.agent.md
```

### Step 7: Test

In Claude Code or Cursor, describe a task that matches your `description:` field. The harness should select your subagent via the Agent tool. In Gemini CLI, use the equivalent invocation. In Copilot, trigger via the agent picker.

## Synchronization

### How it works

The `sync/agents.sh` orchestrator processes `.agents/subagents/` for each platform listed in `platforms.json`:

| Platform    | Strategy          | Output                                    |
| ----------- | ----------------- | ----------------------------------------- |
| Claude Code | Symlink directory | `.claude/agents → ../.agents/subagents`   |
| Cursor      | Symlink directory | `.cursor/agents → ../.agents/subagents`   |
| Gemini CLI  | Symlink directory | `.gemini/agents → ../.agents/subagents`   |
| Copilot     | Copy + rename     | `.github/agents/{name}.agent.md` per file |
| Antigravity | Skip              | (not supported)                           |

### What gets committed

- ✅ Source: `.agents/subagents/*.md` (always commit)
- ✅ Symlinks: `.claude/agents`, `.cursor/agents`, `.gemini/agents` (git tracks symlinks)
- ✅ Copilot copies: `.github/agents/*.agent.md` (regenerated each sync, but commit so reviewers see them)

### Re-syncing after edits

For symlinked platforms (Claude/Cursor/Gemini): edits propagate instantly — no re-sync needed.

For Copilot: re-run `./.agents/sync.sh --only=agents` so the regenerated `.agent.md` reflects your changes.

## Best Practices

### Naming

✅ `code-reviewer`, `test-generator`, `lidr-qa-agent`
❌ `cr`, `agent1`, `helper`

### `name:` field must match filename

Critical: the YAML `name:` and the filename (without `.md`) must be identical. Mismatches confuse the invocation logic.

### Tool selection

Only grant tools the subagent actually uses. Smaller surface = clearer intent = fewer permission prompts.

| Subagent type  | Suggested tools           |
| -------------- | ------------------------- |
| Code reviewer  | `Read, Grep, Bash`        |
| Test generator | `Read, Write, Grep, Bash` |
| Refactorer     | `Read, Edit, Grep, Bash`  |
| Doc auditor    | `Read, Grep, Glob`        |

### Model selection (Claude only)

- **`sonnet`** — default for most subagents. Good balance.
- **`opus`** — heavy reasoning, complex analysis, high-stakes decisions.
- **`haiku`** — fast, cheap, simple checks.

### Color coding (Claude only)

Pick a color per domain so subagents are visually distinct in the UI:

- **Blue** — code analysis, review
- **Green** — testing, QA
- **Purple** — refactoring, restructuring
- **Orange** — documentation
- **Red** — security, critical analysis
- **Yellow** — performance

## Examples

### Example 1: Code Reviewer

**File:** `.agents/subagents/code-reviewer.md`

```markdown
---
name: code-reviewer
description: Use this agent for thorough code review on a recent change. Analyzes quality, security, and best practices; returns a prioritized report.
tools: Read, Grep, Bash
model: sonnet
color: blue
---

# Code Review Agent

You are an autonomous subagent specialized in comprehensive code review.

## Your Capabilities

- Analyze code structure and design patterns
- Identify code smells and anti-patterns
- Detect security vulnerabilities (SQL injection, XSS, hardcoded secrets)
- Assess test coverage gaps
- Recommend refactoring opportunities

## Your Workflow

1. **Scope**: Read the changed files (use git diff context if available).
2. **Analyze**: Examine structure, patterns, and dependencies.
3. **Detect**: Use Grep to find anti-patterns:
   - Hardcoded credentials (`api_key|secret|password|token` near string literals)
   - Console statements (`console\.(log|debug)`)
   - TODO/FIXME comments
   - Unsafe SQL string concatenation
4. **Assess**: Rate each finding Critical/High/Medium/Low.
5. **Recommend**: Provide specific fixes with code examples.
6. **Verify**: Run the test suite if `npm test` or similar is configured.
7. **Report**: Return a prioritized markdown report.

## Autonomous Decision-Making

You decide independently:

- Which files to analyze based on change scope
- Severity ratings
- Whether to suggest refactoring or accept current code
- Priority ordering of recommendations

You escalate to the main agent for:

- Breaking changes
- Architectural decisions
- Whether to delete vs. refactor

## Guidelines

- Prioritize security and correctness over style
- Use `file:line` format for all locations
- Be specific and actionable; no vague advice
- Respect project conventions (read CLAUDE.md / rules/ if uncertain)

## Output Format

### Summary

- Files analyzed: N
- Total issues: N (Critical: N | High: N | Medium: N | Low: N)

### Critical Issues

[List with file:line, description, fix]

### Detailed Findings

**Issue:** [name]
**Severity:** [level]
**Location:** `file:line`
**Description:** [what's wrong]
**Fix:** [specific change]
```

### Example 2: Test Generator

**File:** `.agents/subagents/test-generator.md`

```markdown
---
name: test-generator
description: Use this agent to generate a test suite for a specified module or file. Determines test cases, writes them following project conventions, and reports coverage.
tools: Read, Write, Grep, Bash
model: sonnet
color: green
---

# Test Generation Agent

You are an autonomous subagent specialized in generating comprehensive test suites.

## Your Capabilities

- Analyze code to derive test requirements
- Generate unit, integration, and edge-case tests
- Assess existing coverage
- Follow project test conventions
- Execute tests to verify correctness

## Your Workflow

1. **Read** the target source file(s).
2. **Identify** test cases: happy path, edge cases, error conditions, integration points.
3. **Inspect** existing tests via Grep for naming patterns and framework.
4. **Generate** the test file following project conventions.
5. **Execute** the suite to confirm tests pass (or fail meaningfully).
6. **Estimate** coverage delta.
7. **Report** what was generated and current coverage state.

## Autonomous Decision-Making

You decide independently:

- Which test cases are most important
- Test structure and organization
- Mocking strategy
- Whether to write unit vs. integration tests

You escalate for:

- Test framework choice (if project has none)
- Adding new test dependencies

## Guidelines

- Match existing test patterns (file names, imports, assertion style)
- One assertion per test where possible
- Include edge cases and error conditions
- Comment any non-obvious setup

## Output Format

### Summary

- Tests created: N
- Files: [list]
- Coverage estimate: X%

### Execution

[pass/fail counts]

### Coverage Gaps

[areas still untested]
```

## Validation & Troubleshooting

### Validate structure

```bash
./.agents/skills/agents-architecture/scripts/validate-agent.sh {name}
```

Checks:

- ✅ File exists at `.agents/subagents/{name}.md`
- ✅ YAML frontmatter present and well-formed
- ✅ Required fields: `name`, `description`
- ✅ `name:` matches filename
- ✅ Optional fields valid: `tools`, `model`, `color`

### Issue: Subagent not invoked

**Symptoms:** Main agent doesn't delegate when expected.

**Diagnosis:**

- Read your `description:` field — does it match the task wording the user used?
- Subagent description should answer "when to use this" specifically.

**Fix:** rewrite description with concrete triggers ("Use this agent when the user asks for X, Y, or Z").

### Issue: Subagent not visible in a platform

**Diagnosis:**

```bash
# Confirm source
ls .agents/subagents/{name}.md

# Confirm symlinks (for Claude/Cursor/Gemini)
readlink .claude/agents .cursor/agents .gemini/agents

# Confirm Copilot copy
ls .github/agents/{name}.agent.md
```

**Fix:** re-run `./.agents/sync.sh --only=agents`. For Copilot specifically, the adapter must regenerate `.agent.md` after every source edit.

### Issue: Tool errors at runtime

**Diagnosis:** check the `tools:` field — the subagent can only use tools listed (or all tools if omitted).

**Fix:** add missing tool, or remove the `tools:` field to inherit everything.

### Issue: `name:` doesn't match filename

The May 2026 audit found and fixed this for all 6 LIDR subagents. If you create a new one, ensure they match before committing.

## Summary

Subagents in the `.agents/` system:

**✅ Use subagents for:**

- Multi-step autonomous workflows
- Complex decision-making
- Tasks needing their own context/tool budget
- Reusable specialists invoked from the main flow

**❌ Don't use subagents for:**

- Simple prompts (use commands)
- Bundled resources (use skills)

**Creation steps:**

1. Define purpose and autonomy
2. Write system prompt (role, capabilities, workflow, decisions, output)
3. Configure frontmatter (`name`, `description`, optional `tools`/`model`/`color`)
4. Save to `.agents/subagents/{name}.md`
5. Sync: `./.agents/sync.sh --only=agents`
6. Test by triggering the matching task

**Platform reach:** 4 of 5 platforms (Claude, Cursor, Gemini, Copilot). Antigravity is the only exclusion.

## Changelog

| Version | Date       | Author                        | Changes                                                                                                                                                                                                                                                                                   |
| ------- | ---------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.0.0   | 2026-05-19 | TL: agents-architecture audit | Complete rewrite to reflect post-merge multi-platform reality: source is `.agents/subagents/` (not `.claude/agents/`); 4 platforms support agents (was claimed "Claude only"); Gemini CLI subagents (Apr 2026); Copilot custom agents; updated frontmatter conventions and sync workflow. |
| 1.0.0   | 2025-Q4    | (original)                    | Initial version — described agents as Claude Code-only with path `.claude/agents/`.                                                                                                                                                                                                       |
