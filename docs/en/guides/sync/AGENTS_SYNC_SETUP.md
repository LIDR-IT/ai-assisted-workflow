# Agents Synchronization Setup

This guide explains how agents (subagents) are synchronized across multiple AI platforms.

## Overview

Agents are autonomous subprocesses that handle complex, multi-step tasks independently. They are synchronized from `.agents/agents/` to platform-specific directories using symlinks.

## Platform Support

| Platform        | Agents Support       | Method  | Location                             |
| --------------- | -------------------- | ------- | ------------------------------------ |
| **Cursor**      | ✅ Full              | Symlink | `.cursor/agents → ../.agents/agents` |
| **Claude Code** | ✅ Full              | Symlink | `.claude/agents → ../.agents/agents` |
| **Gemini CLI**  | ✅ Full              | Symlink | `.gemini/agents → ../.agents/agents` |
| **Antigravity** | ❌ **NOT Supported** | N/A     | N/A                                  |

### Important: Antigravity Limitation

**Antigravity does NOT support project-level agents directory.**

This is a platform limitation. While Antigravity supports:

- ✅ Rules (native detection from `.agents/rules/`)
- ✅ Skills (native detection from `.agents/skills/`)
- ✅ Commands (native detection from `.agents/workflows/`)

It does **NOT** support:

- ❌ Agents directory

Agents will only work in Cursor, Claude Code, and Gemini CLI.

## Architecture

```
.agents/agents/              ← Source of truth
├── doc-improver.md          ← Agent 1
├── code-reviewer.md         ← Agent 2 (example)
├── (synced via .agents/sync.sh --only=agents)
└── README.md

↓ Symlinks to ↓

.cursor/agents → ../.agents/agents
.claude/agents → ../.agents/agents
.gemini/agents → ../.agents/agents
```

## Sync Script

**Location:** `.agents/sync.sh` (use `--only=agents` flag)

**What it does:**

1. Validates `.agents/agents/` source directory exists
2. Creates symlinks for Cursor, Claude Code, Gemini CLI
3. Skips Antigravity (not supported)
4. Verifies all symlinks created correctly

**Usage:**

```bash
# Manual sync
./.agents/sync.sh --only=agents

# Dry run (preview changes)
./.agents/sync.sh --only=agents --dry-run

# Or use the sync-all script
./.agents/sync.sh
```

## Automatic Synchronization

Agents are automatically synchronized when using:

```bash
# Sync all components (includes agents)
/sync-setup

# Or manually
./.agents/sync.sh
```

The sync order is:

1. Rules
2. Skills
3. Commands
4. **Agents** ← Added here
5. MCP Servers

## Agent Structure

Every agent in `.agents/agents/` should follow this structure:

```markdown
---
name: agent-name
description: Use when [conditions]. Examples: [...]
tools: ["Read", "Write", "Grep", "Skill"]
model: inherit
color: blue
---

You are [agent role]...

## Phase 1: Discovery

[Workflow steps]

## Phase 2: Analysis

[Analysis steps]

## Phase 3: Reporting

[Reporting format]

## Phase 4: Implementation

[Implementation process]
```

## Available Agents

### doc-improver

**Purpose:** Audits and improves project documentation

**Triggered by:**

- `/improve-docs` command
- User asks to review/audit documentation

**What it does:**

1. Reads `.agents/rules/process/documentation.md`
2. Analyzes docs structure and content
3. Identifies gaps and issues
4. Reports findings with priorities
5. Implements approved improvements

**Example:**

```bash
/improve-docs docs/guides
```

See: [doc-improver.md](../../../.agents/agents/doc-improver.md)

## Creating New Agents

### Quick Steps

1. **Create agent file:**

```bash
touch .agents/agents/your-agent.md
```

2. **Add frontmatter and system prompt:**

```yaml
---
name: your-agent
description: Use when [triggering conditions]
tools: ["Read", "Write"]
---
You are [agent role]...
```

3. **Run sync:**

```bash
./.agents/sync.sh --only=agents
```

4. **Verify:**

```bash
ls -la .cursor/agents/your-agent.md
ls -la .claude/agents/your-agent.md
ls -la .gemini/agents/your-agent.md
```

5. **Create invoking command (optional):**

```bash
touch .agents/commands/your-command.md
```

See: [Command → Agent → Skill Pattern](../patterns/command-agent-skill-pattern.md)

## Verification

### Check Symlinks Exist

```bash
# Verify agents symlinks
ls -la .cursor/agents
ls -la .claude/agents
ls -la .gemini/agents

# Should show:
# lrwxr-xr-x ... .cursor/agents -> ../.agents/agents
# lrwxr-xr-x ... .claude/agents -> ../.agents/agents
# lrwxr-xr-x ... .gemini/agents -> ../.agents/agents
```

### Check Symlinks Point to Correct Target

```bash
# Check symlink targets
readlink .cursor/agents
readlink .claude/agents
readlink .gemini/agents

# All should output:
# ../.agents/agents
```

### Verify Agent Files Accessible

```bash
# List agents through symlinks
ls .cursor/agents/
ls .claude/agents/
ls .gemini/agents/

# Should show:
# doc-improver.md
# README.md
```

### Test Agent Access

```bash
# Read agent file through symlink
cat .cursor/agents/doc-improver.md
cat .claude/agents/doc-improver.md
cat .gemini/agents/doc-improver.md

# Should display agent content
```

## Troubleshooting

### Symlinks Not Created

**Issue:** Agent symlinks missing after sync

**Solution:**

```bash
# Re-run sync script
./.agents/sync.sh --only=agents

# Or manually create
ln -s ../.agents/agents .cursor/agents
ln -s ../.agents/agents .claude/agents
ln -s ../.agents/agents .gemini/agents
```

### Symlinks Point to Wrong Location

**Issue:** Symlink exists but points to incorrect target

**Solution:**

```bash
# Remove incorrect symlinks
rm .cursor/agents
rm .claude/agents
rm .gemini/agents

# Re-run sync
./.agents/sync.sh --only=agents
```

### Agent Not Found

**Issue:** Platform can't find agent after creating

**Solution:**

```bash
# 1. Verify agent exists in source
ls .agents/agents/your-agent.md

# 2. Verify symlink works
ls .cursor/agents/your-agent.md

# 3. Restart AI agent/platform
# Sometimes platforms cache agent lists
```

### Antigravity Can't See Agents

**Issue:** Antigravity reports agent not found

**Expected:** This is normal - Antigravity does NOT support agents

**Solution:** Use Cursor, Claude Code, or Gemini CLI for agents

## Integration with Other Components

### Agents + Commands

Agents are typically invoked by commands:

```
Command: /improve-docs
    ↓
Agent: doc-improver
    ↓
Rules: documentation.md
```

See: [Commands Sync Setup](./COMMANDS_SYNC_SETUP.md)

### Agents + Rules

Agents should always read project rules:

```markdown
## Phase 1: Discovery

1. Read `.agents/rules/relevant-rule.md`
2. Understand project standards
3. Execute workflow
```

See: [Rules Sync Setup](./RULES_SYNC_SETUP.md)

### Agents + Skills

Agents can invoke skills for specialized knowledge:

```markdown
## When to use skill:

If complex API documentation needed:
Use Skill("api-doc-generator")
```

See: [Skills Sync Setup](./SKILLS_SYNC_SETUP.md)

## Best Practices

### 1. One Agent Per File

Each agent should be in its own `.md` file:

```
.agents/agents/
├── doc-improver.md      ✅ Good
├── code-reviewer.md     ✅ Good
└── all-agents.md        ❌ Bad (don't combine)
```

### 2. Clear Trigger Conditions

Use examples to show when agent activates:

```yaml
description: Use when [conditions]. Examples:

<example>
user: "/command"
assistant: "I'll launch the agent..."
</example>
```

### 3. Always Read Rules First

Agents must respect project standards:

```markdown
## Phase 1: Discovery

1. Read `.agents/rules/process/documentation.md`
2. Read `.agents/rules/code/style.md`
3. Proceed with understanding of standards
```

### 4. Request Approval Before Changes

Never modify files without user consent:

```markdown
## Recommendations

1. Fix broken links
2. Update examples

**Would you like me to implement these?**
```

### 5. Structured Workflows

Break agent work into clear phases:

```markdown
## Phase 1: Discovery

## Phase 2: Analysis

## Phase 3: Reporting

## Phase 4: Implementation
```

## Related Documentation

- [Command → Agent → Skill Pattern](../patterns/command-agent-skill-pattern.md)
- [Agents README](../../../.agents/agents/README.md)
- [Agent Development Skill](../../../.agents/skills/agent-development/)
- [Sync All Components](./SYNC_ALL_SETUP.md)
- [Platform Support Matrix](../../references/PLATFORM_SUPPORT.md)

## Summary

**What:** Agents are synchronized via symlinks to platform directories

**Where:** `.agents/agents/` → `.cursor/agents`, `.claude/agents`, `.gemini/agents`

**How:** Run `./.agents/sync.sh --only=agents` or `/sync-setup`

**Limitation:** Antigravity does NOT support agents

**Verify:** `ls -la .cursor/agents .claude/agents .gemini/agents`
