# Core Principles

## Project Architecture

This project demonstrates a **centralized source-of-truth** pattern for managing multi-agent AI development environments across 4 platforms: Cursor, Claude Code, Gemini CLI, and Antigravity.

### Source of Truth Pattern

**Central Configuration Directory:** `.agents/`
- Contains master configurations for all agents
- Single location to update shared resources
- Synchronized to agent-specific directories via symlinks or generation scripts

**Key Directories:**
- `.agents/rules/` - Source of truth for all project rules
- `.agents/skills/` - Source of truth for all agent skills
- `.agents/commands/` - Source of truth for all slash commands
- `.agents/agents/` - Source of truth for all subagents
- `.agents/mcp/` - Source of truth for MCP server configurations

### Synchronization Strategies

**1. Symlinks (Rules, Skills, Commands, Agents)**
- **Used for:** Rules, skills, commands, and agents distribution
- **Platforms:** Cursor, Claude Code, Gemini CLI
- **Mechanism:** Full directory symlinks pointing to `.agents/`
- **Advantages:** Instant propagation, zero duplication, single source of truth
- **Note:** Antigravity does NOT support agents directory

**2. Script Generation (MCP Configs)**
- **Used for:** MCP server configurations
- **Script:** `.agents/mcp/sync-mcp.sh`
- **Mechanism:** Transforms `.agents/mcp/mcp-servers.json` into platform-specific configs
- **Advantages:** Platform-specific formatting, validation, preprocessing

**3. Manual Copy (Antigravity Special Case)**
- **Used for:** Antigravity rules (limitation: no project-level symlink support)
- **Script:** `.agents/rules/sync-rules.sh`
- **Mechanism:** Copy `.md` files to `.agent/rules/`
- **Note:** Skills use selective symlinks in `.agent/skills/`

### Platform Support Matrix

| Platform | Rules | Skills | Commands | Agents | MCP Project | MCP Global |
|----------|-------|--------|----------|--------|-------------|------------|
| Cursor | ✅ Symlink | ✅ Symlink | ✅ Symlink | ✅ Symlink | ✅ | ✅ |
| Claude Code | ✅ Symlink | ✅ Symlink | ✅ Symlink | ✅ Symlink | ✅ | ✅ |
| Gemini CLI | ✅ Symlink | ✅ Symlink | ✅ Symlink | ✅ Symlink | ✅ | ✅ |
| Antigravity | ✅ Copy | ✅ Selective | ✅ Copy | ❌ Not supported | ❌ Global only | ✅ |

## Design Decisions

### 1. Centralized Configuration Over Distributed
- **Decision:** Use `.agents/` as single source of truth
- **Rationale:** Eliminates inconsistencies, reduces maintenance, clear ownership
- **Trade-off:** Requires sync process, but automated via scripts

### 2. Symlinks Over Copies (Where Supported)
- **Decision:** Prefer full directory symlinks for skills and rules
- **Rationale:** Instant updates, zero duplication, filesystem-native
- **Trade-off:** Platform limitations (Antigravity), but handled gracefully

### 3. Script Generation for MCP Configs
- **Decision:** Generate platform-specific configs from single source
- **Rationale:** Each platform has different JSON structure requirements
- **Trade-off:** Requires manual sync run, but validated and consistent

### 4. No Ruler Tool Dependency
- **Decision:** Use custom bash scripts instead of `@intellectronica/ruler`
- **Rationale:** Maintains architectural consistency, no npm dependency, full control
- **Trade-off:** Custom maintenance, but aligns with project patterns

### 5. Graceful Platform Degradation
- **Decision:** Handle Antigravity limitations with copy strategy
- **Rationale:** Support all platforms despite limitations
- **Trade-off:** Manual copy required, but documented clearly

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
2. Run `.agents/rules/sync-rules.sh` (handles skills too)
3. Verify with `ls -la .cursor/skills .claude/skills`

**Rules:**
1. Create in `.agents/rules/{rule-name}.md`
2. Run `.agents/rules/sync-rules.sh`
3. Verify with `ls -la .cursor/rules .claude/rules`

**MCP Servers:**
1. Edit `.agents/mcp/mcp-servers.json`
2. Add platform array: `["cursor", "claude", "gemini"]`
3. Run `.agents/mcp/sync-mcp.sh`
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
2. Re-run sync: `.agents/rules/sync-rules.sh`
3. Manual creation: `ln -s ../.agents/rules .cursor/rules`

**Antigravity MCP not working:**
1. Check global config: `~/.gemini/antigravity/mcp_config.json`
2. See: `docs/guides/mcp/ANTIGRAVITY_SETUP.md`
3. Remember: Project-level MCP not supported

**Changes not propagating:**
1. Verify symlink: `readlink .cursor/rules`
2. Check source file exists: `ls .agents/rules/{file}.md`
3. For Antigravity: Re-run sync script (rules are copied)

## References

- `.agents/mcp/sync-mcp.sh` - MCP synchronization script
- `.agents/rules/sync-rules.sh` - Rules/skills synchronization script
- `docs/guides/mcp/ANTIGRAVITY_LIMITATION.md` - Antigravity constraints
- `docs/guidelines/team-conventions/skills-management-guidelines.md` - Skills guidelines
