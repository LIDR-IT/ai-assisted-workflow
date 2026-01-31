# Subagents in Cursor

## Overview

**Subagents** in Cursor are specialized AI assistants that the main Agent can delegate tasks to. Each subagent operates in its own context window, handling specific work types independently and returning results to the parent agent.

**Official Documentation:** [cursor.com/docs/context/subagents](https://cursor.com/docs/context/subagents)

---

## What Are Subagents?

### Definition

Subagents are autonomous AI assistants that:
- Run in **separate context windows**
- Work **independently** on delegated tasks
- **Return results** to the parent Agent
- Can run in **foreground** (blocking) or **background** (parallel)
- Start with **clean context** (no access to parent conversation history)

### Key Concept

When Cursor's Agent encounters a complex task, it can launch subagents that work independently and return final results—keeping the main conversation focused and preserving context.

---

## Core Benefits

### 1. Context Isolation

Lengthy operations don't consume space in primary conversation.

**Example:**
- Research task generates 10,000 tokens
- Only summary returns to main context
- Main conversation stays focused

### 2. Parallel Execution

Multiple subagents can run simultaneously on different codebase sections.

**Example:**
```
Review API changes and update documentation in parallel
```
- API review subagent runs concurrently
- Documentation subagent runs concurrently
- Results merge when both complete

### 3. Specialized Expertise

Configure custom prompts, tool access, and models for domain-specific responsibilities.

**Example:**
- Debugger with root cause analysis prompts
- Test runner with strict test validation
- Verifier with security focus

### 4. Reusability

Define custom subagents once, use across multiple projects.

**Storage:**
- **User-level:** `~/.cursor/agents/`
- **Project-level:** `.cursor/agents/`

---

## Built-in Subagents

Cursor includes three automatic subagents designed based on analysis of Agent conversations hitting context limits:

### Explore

**Purpose:** Codebase searching and analysis

**Rationale:** "Codebase exploration generates large intermediate output"

**When used:**
- Searching for files or patterns
- Understanding code structure
- Analyzing dependencies
- Discovering implementation details

**Benefit:** Keeps verbose exploration output isolated from main conversation

### Bash

**Purpose:** Execute series of shell commands

**Rationale:** "Command output isolation keeps parent focused on decisions"

**When used:**
- Running build scripts
- Executing tests
- Git operations
- File manipulations

**Benefit:** Command output and errors stay in subagent context; only results/decisions return to main Agent

### Browser

**Purpose:** Browser control via MCP tools

**Rationale:** "DOM snapshots and screenshots filtered to relevant results"

**When used:**
- Web scraping
- UI testing
- Documentation browsing
- Visual verification

**Benefit:** Large DOM snapshots don't clutter main context

---

## Creating Custom Subagents

### File Structure

Create Markdown files with YAML frontmatter:

**Project location:** `.cursor/agents/`
**User location:** `~/.cursor/agents/`
**Compatibility:** `.claude/agents/` and `.codex/agents/` also work

### Configuration Fields

#### Required Fields

**`name`** (optional but recommended)
- Unique identifier
- Lowercase letters and hyphens
- Examples: `verifier`, `test-runner`, `debugger`

**`description`** (optional but recommended)
- Determines when Agent delegates to this subagent
- Include concrete use cases
- Use phrases like "use proactively" or "always use for"

**Example:**
```yaml
description: Independently validates completed work. Use proactively before marking tickets complete to verify features work end-to-end.
```

#### Optional Fields

**`model`**
- Which model to use
- Options: `fast`, `inherit`, or specific model ID
- Default: `inherit` (uses parent's model)

**`readonly`**
- When `true`, restricts write permissions
- Subagent cannot modify files
- Good for verification and analysis tasks

**`is_background`**
- When `true`, runs in background without waiting
- Returns immediately while working independently
- Ideal for long-running or parallel workstreams

### Example Subagent File

**`.cursor/agents/verifier.md`:**

```markdown
---
name: verifier
description: Independently validates that claimed work is complete. Use proactively before marking tickets complete to verify features work end-to-end, tests pass, and no regressions exist.
model: fast
readonly: true
---

You are an independent verifier that validates work completion.

When invoked:
1. Identify the claimed completed work
2. Run relevant tests
3. Search for edge cases
4. Verify the feature works end-to-end
5. Check for regressions

Verification checklist:
- All tests pass
- Feature works as described
- No obvious bugs or errors
- Edge cases handled
- No regressions in related features
- Code quality is acceptable

Report:
- ✅ What works correctly
- ❌ What's incomplete or broken
- ⚠️ Potential issues or concerns
- 📝 Recommendations

Be thorough and skeptical. Your job is to catch issues before they reach production.
```

---

## Execution Modes

### Foreground Mode (Blocking)

**Behavior:**
- Blocks parent Agent until completion
- Returns results immediately
- Can ask clarifying questions
- Can request permissions

**Best for:**
- Sequential tasks requiring immediate output
- Tasks needing user interaction
- Work dependent on results for next steps

**Example:**
```
Use the verifier to confirm the auth flow works
[Agent waits for verifier to complete]
[Results return immediately]
```

### Background Mode (Non-blocking)

**Behavior:**
- Returns immediately while working independently
- Runs concurrently with other work
- Cannot ask clarifying questions
- Cannot request additional permissions

**Best for:**
- Long-running tasks
- Parallel workstreams
- Independent research
- Non-blocking operations

**Example:**
```
Have the test-runner check all tests in the background
[Agent continues working]
[Results return when complete]
```

**Configure via field:**
```yaml
is_background: true
```

---

## Invocation Methods

### Automatic Delegation

Agent proactively delegates based on:
- Task complexity
- Custom subagent descriptions
- Available tools
- Context

**Encourage automatic delegation:**
```yaml
description: Use proactively after code changes to verify all tests pass.
```

### Explicit Invocation

**Slash syntax:**
```
/verifier confirm the feature works
```

**Natural language:**
```
Have the debugger subagent investigate this error
Use the test-runner to check all unit tests
```

### Parallel Execution

**Request multiple subagents:**
```
Review API changes and update documentation in parallel
Run tests while analyzing performance metrics
```

---

## Resuming Subagents

Subagent executions return agent IDs for resuming previous conversations.

**Resume syntax:**
```
Resume agent abc123 and analyze remaining test failures
```

**When to resume:**
- Continue incomplete work
- Add follow-up analysis
- Extend investigation
- Build on previous results

**Benefits:**
- Preserves full context
- Retains tool call history
- Continues reasoning
- Avoids redundant work

**Background subagents:**
- Write state continuously
- Can be resumed after completion
- Useful for long-running tasks

---

## Common Patterns

### 1. Verification Agent

**Purpose:** Independently validates work completion

**Use case:**
- Confirms features work end-to-end
- Runs tests
- Searches for edge cases
- Identifies incomplete implementations

**Example:**
```markdown
---
name: verifier
description: Independently validates completed work. Use proactively before marking tickets complete.
readonly: true
model: fast
---

You validate that claimed work is actually complete.

Check:
- Tests pass
- Feature works as described
- No regressions
- Edge cases handled

Report what works, what's broken, and what's missing.
```

### 2. Orchestrator Pattern

**Purpose:** Parent agent coordinates multiple specialists

**Workflow:**
```
Planner (research) → Implementer (code) → Verifier (validate)
```

**Benefits:**
- Clear separation of concerns
- Structured handoffs
- Independent verification
- Parallel execution where possible

### 3. Debugger Specialist

**Purpose:** Root cause analysis and minimal fixes

**Workflow:**
1. Capture stack traces
2. Identify reproduction steps
3. Isolate failure location
4. Implement minimal fix
5. Verify solution

**Example:**
```markdown
---
name: debugger
description: Specializes in debugging errors and failures. Use proactively when encountering bugs or unexpected behavior.
model: inherit
---

You are an expert debugger focusing on root cause analysis.

Process:
1. Capture full error and stack trace
2. Identify minimal reproduction steps
3. Isolate exact failure location
4. Implement smallest possible fix
5. Verify solution resolves issue

Provide:
- Root cause explanation
- Evidence supporting diagnosis
- Specific code fix
- Verification approach
```

### 4. Test Runner

**Purpose:** Proactively run and fix tests

**Behavior:**
- Detects code changes
- Runs relevant tests
- Analyzes failures
- Fixes issues
- Reports results

**Example:**
```markdown
---
name: test-runner
description: Proactively runs tests when code changes are detected. Analyzes failures and fixes issues while preserving test intent.
is_background: true
---

You run tests and fix failures.

When code changes:
1. Identify affected tests
2. Run test suite
3. Analyze any failures
4. Fix code (not tests) to pass
5. Verify all tests pass
6. Report results

Report:
- Tests run
- Pass/fail status
- Issues found
- Fixes applied
```

---

## Best Practices

### Design

✅ **DO:**
- Write **focused subagents** with single, clear responsibilities
- **Invest heavily** in description fields (they drive delegation)
- Keep prompts **concise and specific**
- Use **proactive language**: "use proactively", "always use for"
- Add to **version control** for team benefits

❌ **DON'T:**
- Create dozens of generic subagents
- Write vague descriptions like "Use for general tasks"
- Write overly long prompts (lengthy ≠ effective)
- Duplicate slash command functionality
- Start with too many subagents (begin with 2-3)

### Tool Access

✅ **DO:**
- Use `readonly: true` for verification/analysis
- Limit access to minimum tools needed
- Test subagent behavior before deploying

❌ **DON'T:**
- Grant all tools by default
- Mix read and write without clear purpose
- Allow dangerous operations without safeguards

### Collaboration

✅ **DO:**
- **Version control** project subagents
- **Document** tool requirements
- **Share** successful patterns with team
- **Let Agent help** draft initial configs

❌ **DON'T:**
- Keep useful subagents local only
- Skip documentation
- Over-engineer before testing

---

## When to Use Subagents

### Choose Subagents For

✅ **Context isolation** on lengthy research
✅ **Parallel workstreams**
✅ **Tasks requiring specialized expertise** across multiple steps
✅ **Independent verification** of work
✅ **Long-running operations** that don't need main context

### Choose Skills Instead For

✅ **Single-purpose tasks** (changelog generation, formatting)
✅ **Quick, repeatable actions**
✅ **One-shot completions**
✅ **Tasks not requiring separate context windows**

### Choose Main Conversation For

✅ **Frequent back-and-forth** needed
✅ **Iterative refinement**
✅ **Phases sharing significant context**
✅ **Quick, targeted changes**
✅ **When latency matters**

---

## Performance Considerations

### Token Usage

**Each subagent maintains independent context:**
- 5 parallel subagents ≈ 5× token consumption
- Foreground subagents block parent
- Background subagents run concurrently

**Trade-offs:**
- Context isolation vs. startup overhead
- Parallel execution vs. higher token usage
- Specialized focus vs. potential latency

### When Subagents Excel

✅ **Complex work** (multi-step reasoning)
✅ **Long-running tasks** (extensive research)
✅ **Parallel work** (independent streams)
✅ **Verbose output** (keep main context clean)

### When They're Slower

⚠️ **Simple tasks** (fresh-start overhead)
⚠️ **Quick operations** (main Agent is faster)
⚠️ **Sequential dependent work** (handoff latency)

---

## Anti-Patterns to Avoid

❌ **Creating dozens of generic subagents** with vague instructions
❌ **Vague descriptions** like "Use for general tasks"
❌ **Overly long prompts** (doesn't increase effectiveness)
❌ **Duplicating slash commands** (use commands instead)
❌ **Starting with too many** (begin with 2-3 focused ones)
❌ **No version control** (team can't benefit)
❌ **Missing descriptions** (Agent won't know when to delegate)

---

## Access Requirements

### Legacy Plans (Request-based)

Requires enabling **Max Mode** to use subagents.

### Usage-based Plans

Subagents **enabled by default**.

---

## Compatibility Notes

### Storage Locations

Cursor reads subagents from multiple locations for compatibility:

| Location | Scope | Platform |
|----------|-------|----------|
| `.cursor/agents/` | Project | Cursor |
| `~/.cursor/agents/` | User | Cursor |
| `.claude/agents/` | Project | Cross-platform |
| `.codex/agents/` | Project | Cross-platform |

**Recommendation:** Use `.cursor/agents/` for Cursor-specific subagents.

---

## Example: Complete Verifier Subagent

**File:** `.cursor/agents/verifier.md`

```markdown
---
name: verifier
description: Independently validates that claimed completed work actually works end-to-end. Use proactively before marking tickets complete to verify features work, tests pass, edge cases are handled, and no regressions exist.
model: fast
readonly: true
is_background: false
---

# Verifier Agent

You are an independent verifier that validates work completion with a skeptical, thorough approach.

## When Invoked

1. **Identify** what work was claimed to be complete
2. **Run** all relevant tests
3. **Search** for potential edge cases
4. **Verify** the feature works end-to-end as described
5. **Check** for regressions in related features

## Verification Checklist

### Functionality
- ✅ Feature works exactly as described
- ✅ All acceptance criteria met
- ✅ Edge cases handled properly
- ✅ Error handling works correctly
- ✅ No obvious bugs or crashes

### Testing
- ✅ All existing tests still pass
- ✅ New tests added for new functionality
- ✅ Tests cover edge cases
- ✅ No test failures or warnings

### Quality
- ✅ Code follows project conventions
- ✅ No code duplication introduced
- ✅ Proper error messages
- ✅ No performance regressions

### Regressions
- ✅ Related features still work
- ✅ No broken dependencies
- ✅ No unexpected side effects

## Report Format

### ✅ What Works
List features and tests that work correctly.

### ❌ What's Incomplete or Broken
List specific issues found with:
- File locations
- Line numbers
- Error messages
- Reproduction steps

### ⚠️ Concerns
List potential issues or areas needing attention.

### 📝 Recommendations
Suggest improvements or fixes.

## Mindset

Be **thorough and skeptical**. Your job is to catch issues before they reach production. Don't assume something works just because it's claimed to work—verify it independently.

If something is incomplete or broken, be specific about what's wrong and how to fix it.
```

---

## Comparison: Cursor vs Claude Code Subagents

### Similarities

- ✅ Separate context windows
- ✅ Custom prompts and configurations
- ✅ Markdown files with YAML frontmatter
- ✅ Project and user scopes
- ✅ Automatic and explicit delegation
- ✅ Resumable executions

### Differences

| Feature | Cursor | Claude Code |
|---------|--------|-------------|
| **Foreground/Background** | `is_background` field | Automatic decision + Ctrl+B |
| **Tool control** | `readonly` flag | `tools`, `disallowedTools` fields |
| **Hooks** | Not documented | Full lifecycle hooks support |
| **Skills integration** | Not documented | `skills` field in frontmatter |
| **Permission modes** | Basic | Advanced (`acceptEdits`, `bypassPermissions`, etc.) |
| **MCP tools** | Available | Foreground only |

### Recommendation

- Use **Cursor subagents** for Cursor-specific workflows
- Use **Claude Code sub-agents** for Claude Code-specific workflows
- Share common patterns via **cross-platform compatible locations** (`.claude/agents/`)

---

## Resources

**Official Documentation:**
- [Cursor Subagents](https://cursor.com/docs/context/subagents)

**In This Repository:**
- `sub-agents-claude-code.md` - Claude Code sub-agents reference
- `agent-development-claude-code.md` - Building agents in Claude Code
- `agents-md-format.md` - AGENTS.md standard
- `docs/references/skills/` - Skills ecosystem
- `docs/references/commands/` - Command development

---

**Last Updated:** January 2026
**Category:** Cursor Subagents
**Status:** Active Feature
**Platform:** Cursor
