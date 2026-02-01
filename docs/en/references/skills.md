---
title: Skills Reference
description: Quick reference and external resources for AI agent skills
category: reference
platforms: [claude-code, cursor, gemini-cli, antigravity]
---

# Skills Reference

> Part of [Template Best Practices](/) - AI Agent Synchronization Framework

Skills extend AI agent capabilities with specialized knowledge, workflows, and tool integrations.

## Official Documentation

**Claude Code:**
- [Skills Documentation](https://docs.anthropic.com/en/docs/build-with-claude/skills)
- [Skill Development Guide](https://github.com/anthropics/claude-code/blob/main/docs/skills.md)
- CLI: `claude skill list`, `claude skill add`

**Cursor:**
- Skills are supported via `.cursor/skills/` directory
- Same markdown format as Claude Code

**Gemini CLI:**
- Skills supported in `.gemini/skills/` directory
- Uses frontmatter format with `name`, `description`, `args`

**Antigravity:**
- Limited skill support (selective symlinks)
- Global skills: `~/.gemini/antigravity/skills/`

## Skill Ecosystems

**OpenSkills Platform:**
- [skills.sh](https://skills.sh) - Public skill registry
- Discover and share community skills
- Install with `claude skill add <skill-name>`

**NPM Skills Package:**
- [npm @skills](https://www.npmjs.com/search?q=%40skills)
- Versioned skill distributions
- Install: `npm install @skills/<skill-name>`

**Vercel Skill Discovery:**
- [v0 Skills](https://v0.dev/skills) - Browse curated skills
- Integration examples and templates

## Team Skills

This project uses centralized skills in `.agents/skills/`:

```bash
# Source of truth
.agents/skills/

# Synchronized to all platforms via symlinks
.cursor/skills → ../.agents/skills
.claude/skills → ../.agents/skills
.gemini/skills → ../.agents/skills
```

**Current Team Skills:**
- `agent-development` - Create custom agents
- `command-development` - Create slash commands
- `commit-management` - Git commit best practices
- `find-skills` - Discover and install skills
- `hook-development` - Create event hooks
- `mcp-integration` - Add MCP servers
- `skill-creator` - Create new skills
- `skill-development` - Skill development guide
- `team-skill-creator` - Team-wide skill creation

## Skill Anatomy

**Basic Structure:**
```markdown
---
name: skill-name
description: When to use this skill
args: [arg1, arg2]
---

# Skill Content

Instructions and context for the agent.
```

**Frontmatter Fields:**
- `name` - Skill identifier (required)
- `description` - When to trigger this skill (required)
- `args` - Command-line arguments (optional)
- `tools` - Restricted tool access (optional)
- `color` - Terminal color coding (optional)

## Creating Skills

**Using team-skill-creator:**
```bash
# Invoke the skill
claude /team-skill-creator

# Follow prompts to create skill in .agents/skills/
```

**Manual creation:**
```bash
# Create skill directory
mkdir -p .agents/skills/my-skill

# Create skill.md
cat > .agents/skills/my-skill/skill.md << 'EOF'
---
name: my-skill
description: When to use this skill
---
# My Skill
Instructions here.
EOF

# Sync to all agents
.agents/sync-all.sh
```

## Skill Patterns

**Knowledge Skills:**
- Provide specialized domain knowledge
- Example: `copywriting-guidelines`, `react-native-patterns`

**Workflow Skills:**
- Multi-step procedures
- Example: `commit-management`, `mcp-integration`

**Tool Integration Skills:**
- Connect external tools/APIs
- Example: `context7-query`, `database-access`

**Generator Skills:**
- Create code, configs, or documentation
- Example: `skill-creator`, `command-development`

## Discovery and Installation

**Finding skills:**
```bash
# Team skill (invokes find-skills)
claude /find-skills

# Search OpenSkills
claude skill search "topic"

# Browse online
open https://skills.sh
```

**Installing skills:**
```bash
# From OpenSkills
claude skill add skill-name

# From NPM
npm install -g @skills/skill-name

# From Git
git clone https://github.com/user/skill.git .agents/skills/skill-name
.agents/sync-all.sh
```

## Skill Invocation

**Slash commands:**
```bash
# Invoke skill by name
claude /skill-name

# With arguments
claude /commit-management -m "message"

# List available skills
claude /skills
```

**Automatic triggering:**
Skills with good `description` fields trigger automatically based on user intent.

## Advanced Features

**Dynamic Context:**
- Skills can reference `${CLAUDE_PLUGIN_ROOT}`
- Access project files and configs

**Extended Thinking:**
- Enable longer reasoning with `thinking: true`
- Better for complex problem-solving

**Tool Restrictions:**
- Limit tool access with `tools: [Read, Write]`
- Enhance security and focus

**Subagent Integration:**
- Skills can spawn subagents
- Delegate complex subtasks

## Platform Compatibility

| Feature | Claude Code | Cursor | Gemini CLI | Antigravity |
|---------|-------------|--------|------------|-------------|
| Markdown Skills | ✅ | ✅ | ✅ | ⚠️ Selective |
| Slash Commands | ✅ | ✅ | ✅ | ❌ |
| Auto-trigger | ✅ | ✅ | ✅ | ❌ |
| Tool Restrictions | ✅ | ⚠️ Limited | ⚠️ Limited | ❌ |
| Extended Thinking | ✅ | ❌ | ❌ | ❌ |

## Troubleshooting

**Skill not appearing:**
```bash
# Verify file exists
ls .agents/skills/skill-name/skill.md

# Check symlinks
readlink .claude/skills

# Re-run sync
.agents/sync-all.sh
```

**Skill not triggering:**
- Improve `description` field with triggering keywords
- Test with explicit invocation: `claude /skill-name`
- Check frontmatter syntax

**Antigravity skill issues:**
- Antigravity uses selective symlinks or copies
- Check `.agent/skills/` for copied skills
- Global skills: `~/.gemini/antigravity/skills/`

## Best Practices

**Skill Design:**
- Clear, specific descriptions
- Progressive disclosure (start simple, add detail)
- Include examples and templates

**Naming:**
- Use kebab-case: `skill-name`
- Be descriptive: `commit-management` not `commit`
- Avoid conflicts with built-in commands

**Organization:**
- Group related skills in subdirectories
- Maintain README in skill directories
- Document dependencies

**Testing:**
- Test across all platforms
- Verify auto-triggering works
- Check slash command invocation

## Related

- [Skill Creator Guide](/team-skill-creator) - Create team skills
- [Command Development](/command-development) - Create slash commands
- [Agent Development](/agent-development) - Create custom agents

## External References

- [Claude Skills Docs](https://docs.anthropic.com/en/docs/build-with-claude/skills)
- [OpenSkills Platform](https://skills.sh)
- [Skills NPM Search](https://www.npmjs.com/search?q=%40skills)
- [Vercel v0 Skills](https://v0.dev/skills)

---

*Maintained by LIDR Template Team | Last updated: 2026-02-01*
