# Claude Code Extension Reference

Quick reference for extending Claude Code. For detailed instructions, invoke the appropriate skill.

## Available Extension Types

| Extension | Skill | Use When |
|-----------|-------|----------|
| **Skills** | `/skill-creator` | Adding specialized knowledge or workflows |
| **Commands** | `/command-development` | Creating user-invocable slash commands |
| **Agents** | `/agent-development` | Building autonomous subprocesses |
| **Hooks** | `/hook-development` | Event-driven automation (PreToolUse, PostToolUse, etc.) |
| **MCP Servers** | `/mcp-integration` | Connecting external tools/services |

## Quick Patterns

### Creating a Skill
```markdown
---
name: skill-name
description: When to use this skill
---
# Content here
```
**Invoke:** `/skill-creator` for full guide

### Creating a Command
```markdown
---
name: command-name
args: [arg1, arg2]
---
# Content here
```
**Invoke:** `/command-development` for full guide

### Creating an Agent
```markdown
---
name: agent-name
description: Triggering conditions with examples
tools: ["Read", "Write"]
---
System prompt here
```
**Invoke:** `/agent-development` for full guide

### Creating a Hook
```bash
#!/bin/bash
# .claude/hooks/PreToolUse/validate.sh
```
**Invoke:** `/hook-development` for full guide

### Adding MCP Server
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
**Invoke:** `/mcp-integration` for full guide

## File Locations

- **Skills:** `.agents/skills/{skill-name}/skill.md`
- **Commands:** `.agents/commands/{command-name}.md`
- **Agents:** `.agents/agents/{agent-name}.md`
- **Hooks:** `.claude/hooks/{Event}/{hook-name}.sh`
- **MCP:** `.agents/mcp/mcp-servers.json`

## Prefer Retrieval Over Pre-training

When extending Claude Code, always invoke the relevant skill to get current, version-matched documentation rather than relying on training data.

**Skills provide:**
- Up-to-date syntax and patterns
- Platform-specific considerations
- Bundled examples and templates
- Progressive disclosure of complexity
