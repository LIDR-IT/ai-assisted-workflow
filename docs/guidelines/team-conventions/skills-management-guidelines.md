---
description: Guidelines for managing AI agent skills at project level with standardized structure
argument-hint: <project-root>
category: Project Setup Guidelines
status: Team Standard
enforcement: Required for all projects
last-updated: January 2026
---

# Skills Management Guidelines

Review project for skills compliance: $ARGUMENTS

Single source of truth for skills in `.agents/skills/`, accessible to all agents via symlinks.

## Rules

### CRITICAL - Project-Level Only

- Skills at **project level** only (`.agents/skills/`)
- NEVER user level (`~/.claude/skills`, `~/.cursor/skills`)
- NEVER team/organization level
- Version-controlled, reproducible across team

### CRITICAL - Centralized Source of Truth

- All skills in `.agents/skills/` (AGENTS.md standard)
- Individual subfolders are source of truth: `.agents/skills/skill-name/`
- Agent directories use symlinks to `.agents/skills/`
- Prevents duplication, maintains consistency

### CRITICAL - Symlink Structure

**Approach 1: Shared Skills (Recommended)**

```bash
# From project root - all skills to all agents
ln -s .agents/skills .agent/skills
ln -s .agents/skills .claude/skills
ln -s .agents/skills .cursor/skills
ln -s .agents/skills .gemini/skills
```

**Approach 2: Selective Skills (Advanced)**

```bash
# Link specific skills to specific agents only
ln -s ../../.agents/skills/subagent-creator .claude/skills/subagent-creator
ln -s ../../.agents/skills/universal-skill .claude/skills/universal-skill
ln -s ../../.agents/skills/universal-skill .cursor/skills/universal-skill
```

⚠️ Selective linking = maintenance overhead. Use Approach 1 unless skill genuinely agent-specific.

### Directory Structure

**Approach 1:**
```
project-root/
├── .agents/skills/skill-one/SKILL.md    # ← Source of truth
├── .agent/skills → ../.agents/skills
├── .claude/skills → ../.agents/skills
├── .cursor/skills → ../.agents/skills
└── .gemini/skills → ../.agents/skills
```

**Approach 2:**
```
project-root/
├── .agents/skills/
│   ├── universal/SKILL.md
│   └── claude-only/SKILL.md
├── .claude/skills/
│   ├── universal → ../../.agents/skills/universal
│   └── claude-only → ../../.agents/skills/claude-only
└── .cursor/skills/
    └── universal → ../../.agents/skills/universal
```

**Single-agent:** Use native structure (`.claude/skills/` direct). Locks to that agent.

## Quick Setup

```bash
# Create structure
mkdir -p .agents/skills .agent .claude .cursor .gemini

# Create symlinks
ln -s ../.agents/skills .agent/skills
ln -s ../.agents/skills .claude/skills
ln -s ../.agents/skills .cursor/skills
ln -s ../.agents/skills .gemini/skills

# Verify
ls -la .*/skills

# Commit
git add .agents/ .agent .claude .cursor .gemini
git commit -m "feat: initialize skills structure"
```

## Installing Skills

**Project scope:**
```bash
# Via CLI
claude plugin install skill-name@marketplace --scope project

# Manual
mkdir -p .agents/skills/custom-skill
cat > .agents/skills/custom-skill/SKILL.md << 'EOF'
---
name: custom-skill
description: What this skill does
---
Instructions...
EOF
```

**Never user/global:**
```bash
# ❌ WRONG
claude plugin install skill-name --scope user
npx skills add skill-name -g
```

## Best Practices

- ✅ Commit `.agents/skills/` and symlinks to git
- ✅ Document skills in README/AGENTS.md
- ✅ Review skill additions in PRs
- ✅ Use lowercase-hyphen naming: `code-review`, `api-conventions`
- ✅ Periodically update and remove unused skills
- ❌ Never gitignore skills directory
- ❌ Never allow user-level skills
- ❌ No spaces or special chars in names

## Anti-Patterns

### ❌ User-Level Skills
```bash
# Wrong - inconsistent across team
npx skills add skill-name -g
claude plugin install skill-name --scope user
```
**Fix:** Install to `.agents/skills/`

### ❌ Duplicate Copies
```
.agents/skills/skill-one/
.claude/skills/skill-one/    # ❌ Duplicate
```
**Fix:** Use symlinks

### ❌ Hardcoded Paths
```yaml
# Wrong - won't work for team
Read /Users/john/project/config.json
```
**Fix:** Use relative: "Read config.json in project root"

### ❌ Broken Symlinks
```bash
# Wrong - creates broken link
cd .claude && ln -s .agents/skills skills
```
**Fix:** From project root: `ln -s ../.agents/skills .claude/skills`

### ❌ Not Version Controlled
```bash
# Wrong - team can't access
echo ".agents/" >> .gitignore
```
**Fix:** Commit skills to git

## Verification Checklist

- [ ] `.agents/skills/` exists with skill subfolders
- [ ] Each skill has `SKILL.md`
- [ ] `.agent/skills`, `.claude/skills`, `.cursor/skills`, `.gemini/skills` are valid symlinks
- [ ] Symlinks point to `../.agents/skills`
- [ ] `.agents/skills/` committed to git
- [ ] Symlink directories committed
- [ ] Skills NOT in `.gitignore`
- [ ] Skills visible in agents (`/skills` command)
- [ ] Documented in README/AGENTS.md

## Troubleshooting

**Skill not found:**
```bash
ls -la .claude/skills
rm .claude/skills
ln -s ../.agents/skills .claude/skills
```

**Skills not syncing:**
```bash
# Verify symlinks, not directories
file .claude/skills .cursor/skills .gemini/skills

# Fix
rm -rf .claude/skills .cursor/skills .gemini/skills
ln -s ../.agents/skills .claude/skills
ln -s ../.agents/skills .cursor/skills
ln -s ../.agents/skills .gemini/skills
```

**Broken symlink:**
```bash
readlink .claude/skills
ls -la .agents/skills
rm .claude/skills
ln -s ../.agents/skills .claude/skills
```

## Migration

**User-level to project:**
```bash
mkdir -p .agents/skills
cp -r ~/.claude/skills/* .agents/skills/
rm -rf .claude/skills
ln -s ../.agents/skills .claude/skills
git add .agents .claude
git commit -m "feat: migrate skills to project"
rm -rf ~/.claude/skills
```

## Output Format

```
.agents/skills/skill-one/SKILL.md - ✓ Canonical location
.claude/skills - ✓ Valid symlink to ../.agents/skills
.cursor/skills - ✗ Not a symlink, should link to ../.agents/skills
~/.claude/skills/skill-two/ - ✗ User-level, move to .agents/skills/
.agents/skills/ - ✗ Not in git, add to version control
```

## References

- `docs/references/skills/skills-claude-code.md`
- `docs/references/skills/skill-creator.md`
- `docs/references/agents/agents-md-format.md`
- [agents.md](https://agents.md)
- [skills.sh](https://skills.sh)
