---
name: principles
description: Core principles and architectural decisions
alwaysApply: false
trigger: always_on
---

# Core Principles

## Project Architecture

This project demonstrates a **centralized source-of-truth** pattern for managing multi-agent AI development environments across 5 platforms: Cursor, Claude Code, Gemini CLI, Antigravity, and GitHub Copilot (VSCode).

### Source of Truth Pattern

**Central Configuration Directory:** `.agents/`

- Contains master configurations for all agents
- Single location to update shared resources
- Synchronized to agent-specific directories via symlinks or generation scripts

**Key Directories:**

- `.agents/rules/` - Source of truth for all project rules
- `.agents/skills/` - Source of truth for all agent skills
- `.agents/commands/` - Source of truth for all slash commands
- `.agents/subagents/` - Source of truth for all subagents
- `.agents/mcp/` - Source of truth for MCP server configurations
- `orchestrator/` - Orchestrator documentation (AGENTS.md)

### Synchronization Strategies

**1. Symlinks (Skills, Commands, Subagents)**

- **Used for:** Skills, commands, and subagents distribution
- **Platforms:** Cursor, Claude Code, Gemini CLI, Antigravity, Copilot (VSCode)
- **Mechanism:** Full directory symlinks pointing to `.agents/`
- **Advantages:** Instant propagation, zero duplication, single source of truth
- **Note:** Antigravity does NOT support subagents directory

**2. Symlinks (Rules - Selective)**

- **Used for:** Rules distribution
- **Platforms:** Claude Code
- **Mechanism:** Full directory symlinks pointing to `.agents/rules/`
- **Note:** Antigravity reads rules natively from `.agents/rules/` (no symlink needed)

**3. Script Generation (MCP Configs, Gemini Index)**

- **Used for:** MCP server configurations, Gemini rules index, Copilot instructions index
- **Scripts:** `.agents/sync.sh --only=mcp`, `.agents/sync.sh --only=rules`
- **Mechanism:** Generates platform-specific configs, GEMINI.md, and copilot-instructions.md
- **Advantages:** Platform-specific formatting, validation, preprocessing

**4. Copy + Rename (Cursor, Copilot Rules; Gemini Commands; Copilot Prompts/Agents)**

- **Used for:** Cursor rules (.mdc), Copilot rules (.instructions.md), Gemini commands (.toml), Copilot prompts (.prompt.md), Copilot agents (.agent.md)
- **Script:** `.agents/sync.sh --only=rules`, `.agents/sync.sh --only=commands`, `.agents/sync.sh --only=agents`
- **Mechanism:** Copy + rename with frontmatter transformation as needed

### Platform Support Matrix

| Platform    | Rules                      | Skills     | Commands              | Subagents           | MCP Project    | MCP Global |
| ----------- | -------------------------- | ---------- | --------------------- | ------------------- | -------------- | ---------- |
| Cursor      | ✅ Copy (flat .mdc)        | ✅ Symlink | ✅ Symlink            | ✅ Symlink          | ✅             | ✅         |
| Claude Code | ✅ Symlink                 | ✅ Symlink | ✅ Symlink            | ✅ Symlink          | ✅             | ✅         |
| Gemini CLI  | ❌ Index file only         | ✅ Symlink | ✅ Generated (.toml)  | ✅ Symlink          | ✅             | ✅         |
| Antigravity | ✅ Native (.agents/)       | ✅ Native  | ✅ Native (workflows) | ❌ Not supported    | ❌ Global only | ✅         |
| Copilot     | ✅ Copy (.instructions.md) | ✅ Symlink | ✅ Copy (.prompt.md)  | ✅ Copy (.agent.md) | ✅ (.vscode/)  | ✅         |

**Notes:**

- **Gemini Commands:** Converted from `.md` → `.toml` (requires TOML format)
- **Copilot:** Rules use `.instructions.md`, commands use `.prompt.md`, agents use `.agent.md`
- **Antigravity Commands:** Native detection via `.agents/workflows` → `commands` (internal symlink)
- **Symlinks in UI:** Explorers (VS Code, Finder) show symlinks as directories (visual only)

**⚠️ Critical Limitations:**

- **Cursor Rules:** Must be `.mdc` + flat structure (no subdirectories) + `name` field required
- **Copilot Rules:** Must be `.instructions.md` + flat structure (no subdirectories)
- **Missing YAML fields:** Can cause rules to be silently ignored on specific platforms
- **Platform-specific fields:** Each platform ignores unsupported fields (safe to include all)

## Design Decisions

### 1. Centralized Configuration Over Distributed

- **Decision:** Use `.agents/` as single source of truth
- **Rationale:** Eliminates inconsistencies, reduces maintenance, clear ownership
- **Trade-off:** Requires sync process, but automated via scripts

### 2. Symlinks Over Copies (Where Supported)

- **Decision:** Prefer full directory symlinks for skills and rules
- **Rationale:** Instant updates, zero duplication, filesystem-native
- **Trade-off:** Cursor requires copies (no subdirectory support)

### 3. Script Generation for MCP Configs

- **Decision:** Generate platform-specific configs from single source
- **Rationale:** Each platform has different JSON structure requirements
- **Trade-off:** Requires manual sync run, but validated and consistent

### 4. No Ruler Tool Dependency

- **Decision:** Use custom bash scripts instead of `@intellectronica/ruler`
- **Rationale:** Maintains architectural consistency, no npm dependency, full control
- **Trade-off:** Custom maintenance, but aligns with project patterns

### 5. Graceful Platform Degradation

- **Decision:** Handle Cursor limitation (no subdirectories) with copy/flatten strategy
- **Rationale:** Support all platforms despite limitations
- **Trade-off:** Manual copy required for Cursor, auto-converts .md → .mdc

## Development Philosophy

### Simplicity First

- Use the simplest solution that works
- Prefer native tools (bash, symlinks) over frameworks
- Add complexity only when clearly justified

### Explicit Over Implicit

- Clear directory structure
- Documented synchronization processes
- Transparent platform limitations

### Automation Where Valuable

- Automate repetitive tasks (MCP sync, rules sync)
- Provide dry-run modes for safety
- Clear verification steps

### Documentation as Code

- Self-documenting scripts with verbose output
- README files in every major directory
- Guidelines and guides for common tasks

## Best Practices

### When Adding New Resources

**Skills:**

1. Create in `.agents/skills/{skill-name}/`
2. Run `.agents/sync.sh --only=rules` (handles skills too)
3. Verify with `ls -la .cursor/skills .claude/skills`

**Rules:**

1. Create in `.agents/rules/{rule-name}.md`
2. Run `.agents/sync.sh --only=rules`
3. Verify with `ls -la .cursor/rules .claude/rules`

**MCP Servers:**

1. Edit `.agents/mcp/mcp-servers.json`
2. Add platform array: `["cursor", "claude", "gemini"]`
3. Run `.agents/sync.sh --only=mcp`
4. Commit generated configs

### Verification Process

After any sync operation:

```bash
# Check symlinks
ls -la .cursor/rules .cursor/skills
ls -la .claude/rules .claude/skills
ls -la .gemini/rules .gemini/skills

# Verify targets
readlink .cursor/rules    # Should: ../.agents/rules
readlink .cursor/skills   # Should: ../.agents/skills

# Test file access
cat .cursor/rules/core-principles.md
ls .claude/skills/
```

### Troubleshooting

**Symlinks not working:**

1. Check source exists: `ls -la .agents/rules .agents/skills`
2. Re-run sync: `.agents/sync.sh --only=rules`
3. Manual creation: `ln -s ../.agents/rules .cursor/rules`

**Antigravity MCP not working:**

1. Check global config: `~/.gemini/antigravity/mcp_config.json`
2. See: `docs/guides/mcp/ANTIGRAVITY_SETUP.md`
3. Remember: Project-level MCP not supported

**Changes not propagating:**

1. Verify symlink: `readlink .cursor/rules` (or `.claude/rules`, `.gemini/rules`)
2. Check source file exists: `ls .agents/rules/{file}.md`
3. For Cursor: Re-run sync script (rules are copied and converted to .mdc)

## References

- `.agents/sync.sh --only=mcp` - MCP synchronization script
- `.agents/sync.sh --only=rules` - Rules/skills synchronization script
- `docs/guides/mcp/ANTIGRAVITY_LIMITATION.md` - Antigravity constraints
- `docs/guidelines/team-conventions/skills-management-guidelines.md` - Skills guidelines
