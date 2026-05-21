---
id: agent-template
version: "2.0.0"
last_updated: "2026-05-19"
updated_by: "TL: agents-architecture audit"
status: active
type: template
review_cycle: 90
next_review: "2026-08-19"
owner_role: "Tech Lead"
---

# Subagent Template

Copy-paste template for creating a new subagent in the `.agents/subagents/` source-of-truth directory.

## How to use this template

1. Copy the [Template Content](#template-content) block
2. Replace all `[PLACEHOLDERS]` with your content
3. Save as `.agents/subagents/[agent-name].md` (filename **must** match `name:` field)
4. Run `./.agents/sync.sh --only=agents` to distribute
5. Test by triggering the matching task in any supported platform

**Platform reach:** Claude Code, Cursor, Gemini CLI, Copilot (4 of 5 platforms). Antigravity does not support subagents.

---

## Template Content

```markdown
---
name: [agent-name]
description: Use this agent when [trigger condition]. It [primary action] and returns [output type].
tools: Read, Edit, Grep, Bash
model: sonnet
color: blue
---

# [Agent Title]

You are an autonomous subagent specialized in [specific task or domain].

## Your Capabilities

- [Capability 1]: [Description]
- [Capability 2]: [Description]
- [Capability 3]: [Description]
- [Capability 4]: [Description]

## Your Workflow

1. **[Step 1 Name]**: [What to do in this step]
   - [Detail or sub-step]
2. **[Step 2 Name]**: [What to do next]
   - [Detail]
3. **[Step 3 Name]**: [How to proceed]
   - [Detail]
4. **[Step 4 Name]**: [What to do here]
   - [Detail]
5. **[Final Step Name]**: [How to conclude]
   - [Detail]

## Autonomous Decision-Making

You decide independently:

- [Decision area 1]
- [Decision area 2]
- [Decision area 3]

You escalate to the main agent for:

- [Decision requiring user input 1]
- [Decision requiring user input 2]

## Guidelines

**Quality standards:**

- [Guideline 1]
- [Guideline 2]

**Constraints:**

- [Constraint 1]
- [Constraint 2]

## Output Format

### [Section 1 Name]

[What this section contains]

### [Section 2 Name]

[What this section contains]
```

---

## Customization tips

### Frontmatter fields

| Field         | Required?         | Notes                                                                              |
| ------------- | ----------------- | ---------------------------------------------------------------------------------- |
| `name`        | ✅                | Lowercase + hyphens. **Must match filename** (without `.md`).                      |
| `description` | ✅                | When to invoke this agent. The main agent matches user intent against this string. |
| `tools`       | optional          | Comma-separated tools the agent can use. Omit to inherit all.                      |
| `model`       | optional (Claude) | `sonnet` (default), `opus` (heavy reasoning), `haiku` (fast).                      |
| `color`       | optional (Claude) | UI tint: `red`, `orange`, `yellow`, `green`, `blue`, `purple`, `pink`.             |

Cursor / Gemini / Copilot accept the same frontmatter and silently ignore fields they don't recognize.

### Writing the description

The `description:` field is **the trigger**. The main agent reads it to decide whether to delegate. Be concrete.

✅ **Good:** `Use this agent for thorough code review on a recent change. Analyzes quality, security, best practices; returns a prioritized markdown report.`

❌ **Poor:** `Reviews code.`

✅ **Good (proactive trigger):** `Use proactively when a ticket transitions to "Ready for QA". Generates test plan + test cases + bug report scaffolding.`

❌ **Poor:** `QA agent.`

### Tool selection

Only grant tools the agent actually uses.

| Agent type       | Suggested tools           |
| ---------------- | ------------------------- |
| Code reviewer    | `Read, Grep, Bash`        |
| Test generator   | `Read, Write, Grep, Bash` |
| Refactorer       | `Read, Edit, Grep, Bash`  |
| Doc auditor      | `Read, Grep, Glob`        |
| Security scanner | `Read, Grep, Bash`        |

### Model & color (Claude only, ignored elsewhere)

- `model: sonnet` — default for most. Good balance of speed/quality.
- `model: opus` — heavy reasoning, complex analysis, high-stakes decisions.
- `model: haiku` — fast, cheap, simple checks.
- `color: <name>` — visual identifier in the Claude Code UI. Other platforms ignore it.

## Complete examples

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
   - Hardcoded credentials
   - Console statements (`console\.(log|debug)`)
   - TODO/FIXME comments
   - Unsafe SQL string concatenation
4. **Assess**: Rate each finding Critical/High/Medium/Low.
5. **Recommend**: Provide specific fixes with code examples.
6. **Verify**: Run the test suite if available.
7. **Report**: Return a prioritized markdown report.

## Autonomous Decision-Making

You decide independently:

- Which files to analyze based on change scope
- Severity ratings
- Whether to suggest refactoring or accept current code

You escalate for:

- Breaking changes
- Architectural decisions

## Guidelines

- Prioritize security and correctness over style
- Use `file:line` format for all locations
- Be specific and actionable

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
2. **Identify** test cases: happy path, edge cases, error conditions.
3. **Inspect** existing tests via Grep for naming patterns and framework.
4. **Generate** the test file following project conventions.
5. **Execute** the suite to confirm tests pass.
6. **Estimate** coverage delta.
7. **Report** what was generated.

## Autonomous Decision-Making

You decide independently:

- Which test cases are most important
- Test structure and organization
- Mocking strategy

You escalate for:

- Test framework choice (if project has none)
- Adding new test dependencies

## Guidelines

- Match existing test patterns
- One assertion per test where possible
- Include edge cases and error conditions

## Output Format

### Summary

- Tests created: N
- Coverage estimate: X%

### Files

[List]

### Execution

[pass/fail counts]

### Coverage Gaps

[areas still untested]
```

### Example 3: LIDR project-specific agent

**File:** `.agents/subagents/lidr-qa-agent.md`

The actual `lidr-qa-agent` (and its 5 siblings: `lidr-docs-agent`, `lidr-metrics-agent`, `lidr-onboarding-agent`, `lidr-release-agent`, `lidr-security-agent`) live in this repo and serve as production reference implementations. Study them for SDLC-integrated agents:

```bash
ls .agents/subagents/lidr-*.md
cat .agents/subagents/lidr-qa-agent.md | head -30
```

## Platform behavior summary

| Platform         | File seen by platform            | Sync method                          |
| ---------------- | -------------------------------- | ------------------------------------ |
| Claude Code      | `.claude/agents/{name}.md`       | Symlink → `.agents/subagents/`       |
| Cursor           | `.cursor/agents/{name}.md`       | Symlink → `.agents/subagents/`       |
| Gemini CLI       | `.gemini/agents/{name}.md`       | Symlink → `.agents/subagents/`       |
| Copilot (VSCode) | `.github/agents/{name}.agent.md` | Generated copy (re-sync after edits) |
| Antigravity      | —                                | Not supported                        |

## Validation

After creating an agent:

```bash
./.agents/skills/agents-architecture/scripts/validate-agent.sh {name}
```

The script checks:

- ✅ File exists at `.agents/subagents/{name}.md`
- ✅ YAML frontmatter present and well-formed
- ✅ Required fields: `name`, `description`
- ✅ `name:` matches the filename
- ✅ Optional fields valid: `tools`, `model`, `color`

## Testing workflow

1. Create the agent following the template
2. Run `./.agents/sync.sh --only=agents`
3. Trigger a task matching the `description:` field
4. Confirm the harness invokes your subagent
5. Verify the output structure matches your contract
6. Iterate on the system prompt if behavior diverges

Common adjustments:

- Refine workflow steps for clarity
- Tighten the `description:` so the trigger is unambiguous
- Adjust tool list if the agent fails on permissions
- Improve output format specification so downstream consumers can parse

## Changelog

| Version | Date       | Author                        | Changes                                                                                                                                                                   |
| ------- | ---------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.0.0   | 2026-05-19 | TL: agents-architecture audit | Source is `.agents/subagents/` (not `.claude/agents/`); 4 platforms supported; updated sync command; matched real LIDR subagent layout; removed "Claude Code only" claim. |
| 1.0.0   | 2025-Q4    | (original)                    | Initial version — described agents as Claude Code-only with path `.claude/agents/`.                                                                                       |
