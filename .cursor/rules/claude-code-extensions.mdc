---
name: claude-code-extensions
description: Review Claude Code extension structure and usage
id: claude-code-extensions
version: "1.0.0"
last_updated: "2026-06-11"
status: active
alwaysApply: false
globs: [".agents/**/*", ".claude/**/*"]
argument-hint: <extension-path>
paths: [".agents/skills/**/*", ".agents/commands/**/*", ".agents/subagents/**/*"]
trigger: always_on
---

# Claude Code Extension Reference

Review these files for compliance: $ARGUMENTS

Read files, check against rules below. Output concise but comprehensive—sacrifice grammar for brevity. High signal-to-noise.

## Rules

### CRITICAL - Proper Structure

- Skills must be in `.agents/skills/{skill-name}/SKILL.md` (uppercase SKILL.md)
- Commands must be in `.agents/commands/{command-name}.md`
- Agents must be in `.agents/subagents/{agent-name}.md`
- All extensions need complete YAML frontmatter
- Never create extensions in agent-specific directories (`.claude/`, `.cursor/` use symlinks)

### CRITICAL - YAML Frontmatter Required

**Skills:**

```yaml
---
name: skill-name
description: When to use this skill
---
```

**Commands:**

```yaml
---
name: command-name
args: [arg1, arg2]
---
```

**Agents:**

```yaml
---
name: agent-name
description: Triggering conditions with examples
tools: ["Read", "Write"]
---
```

### Available Extension Types

All extension types are authored via the single umbrella skill `/lidr-agents-architecture`; its `references/` files cover command, hook, MCP, and rule design fundamentals.

| Extension       | Skill                       | Reference (deep dive)                | Use When                                                |
| --------------- | --------------------------- | ------------------------------------ | ------------------------------------------------------- |
| **Skills**      | `/lidr-agents-architecture` | `references/skill-creation-guide.md` | Adding specialized knowledge or workflows               |
| **Commands**    | `/lidr-agents-architecture` | `references/command-development.md`  | Creating user-invocable slash commands                  |
| **Agents**      | `/lidr-agents-architecture` | `references/agent-creation-guide.md` | Building autonomous subprocesses (skill+agent flow)     |
| **Hooks**       | `/lidr-agents-architecture` | `references/hook-development.md`     | Event-driven automation (PreToolUse, PostToolUse, etc.) |
| **MCP Servers** | `/lidr-agents-architecture` | `references/mcp-integration.md`      | Connecting external tools/services                      |
| **Rules**       | `/lidr-agents-architecture` | `references/rule-development.md`     | Creating Claude Code behavioral rules                   |

### Reference Templates

#### Creating a Skill

```markdown
---
name: skill-name
description: When to use this skill
---

# Content here
```

**Invoke:** `/lidr-agents-architecture` for full guide

#### Creating a Command

```markdown
---
name: command-name
args: [arg1, arg2]
---

# Content here
```

**Invoke:** `/lidr-agents-architecture` for full guide (see `references/command-development.md`)

#### Creating an Agent

```markdown
---
name: agent-name
description: Triggering conditions with examples
tools: ["Read", "Write"]
---

System prompt here
```

**Invoke:** `/lidr-agents-architecture` for full guide

#### Creating a Hook

```bash
#!/bin/bash
# .claude/hooks/PreToolUse/validate.sh
```

**Invoke:** `/lidr-agents-architecture` for full guide (see `references/hook-development.md`)

#### Adding MCP Server

```json
{
  "servers": {
    "server-name": {
      "platforms": ["cursor", "claude", "gemini"],
      "command": "npx",
      "args": ["-y", "package"]
    }
  }
}
```

**Invoke:** `/lidr-agents-architecture` for full guide (see `references/mcp-integration.md`)

### File Locations

- **Skills:** `.agents/skills/{skill-name}/SKILL.md`
- **Commands:** `.agents/commands/{command-name}.md`
- **Agents:** `.agents/subagents/{agent-name}.md`
- **Hooks:** `.claude/hooks/{Event}/{hook-name}.sh`
- **MCP:** `.agents/mcp/mcp-servers.json`

### Prefer Retrieval Over Pre-training

When extending Claude Code, always invoke the relevant skill to get current, version-matched documentation rather than relying on training data.

**Skills provide:**

- Up-to-date syntax and patterns
- Platform-specific considerations
- Bundled examples and templates
- Progressive disclosure of complexity

## Output Format

Use `file:line` or `path` format (VS Code clickable). Terse findings.

```text
## Extensions Structure

.agents/skills/custom-skill/SKILL.md - ✓ Proper structure with YAML frontmatter
.agents/commands/deploy.md - ✓ Valid command with args defined
.agents/subagents/reviewer.md - ✓ Agent with tools specified

## Issues Found

.agents/skills/broken-skill/skill.md - ✗ Wrong filename, should be SKILL.md
.agents/commands/test.md:1 - ✗ Missing YAML frontmatter
.claude/skills/direct-skill/ - ✗ Should be in .agents/skills/
.agents/subagents/worker.md:5 - ✗ Missing required 'description' field

## Recommendations

.agents/skills/old-skill/ - ⚠️  Consider using `/lidr-agents-architecture` for updates
.agents/commands/complex.md - ⚠️  Complex logic → consider creating agent instead

## Summary

✓ 8 extensions properly configured
✗ 4 issues require fixes
⚠️  2 recommendations
```

State issue + location. Skip explanation unless fix non-obvious. No preamble.
