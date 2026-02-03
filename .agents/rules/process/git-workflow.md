---
name: git-workflow
description: Git workflow and commit conventions
alwaysApply: false
trigger: always_on
---

# Git Workflow Guidelines

## Branch Strategy

### Branch Types

**Main Branches:**

- `main` - Production-ready code
- `develop` - Integration branch (if using Git Flow)

**Feature Branches:**

```
feature/descriptive-name
feature/add-mcp-sync
feature/implement-rules-system
```

**Fix Branches:**

```
fix/descriptive-name
fix/symlink-creation-error
fix/antigravity-path-resolution
```

**Documentation Branches:**

```
docs/descriptive-name
docs/update-setup-guide
docs/add-troubleshooting
```

**Refactor Branches:**

```
refactor/descriptive-name
refactor/consolidate-sync-scripts
refactor/simplify-error-handling
```

### Branch Naming Rules

- Use lowercase
- Use hyphens (not underscores or spaces)
- Be descriptive but concise
- Include type prefix (feature/, fix/, docs/, refactor/)
- Use present tense verbs (add, fix, update, refactor)

## Commit Messages

### Format

```
type: Brief summary (50 chars or less)

Detailed explanation if needed. Wrap at 72 characters.
Explain WHAT changed and WHY, not HOW (code shows how).

- Bullet points for multiple changes
- Each change on its own line
- Focus on impact and rationale

Refs: #123
Co-authored-by: Name <email@example.com>
```

### Commit Types

- `feat:` New feature or functionality
- `fix:` Bug fix
- `docs:` Documentation only changes
- `refactor:` Code restructuring without behavior change
- `test:` Adding or updating tests
- `chore:` Maintenance tasks (dependencies, configs)
- `perf:` Performance improvements
- `style:` Code formatting (no logic change)

### Examples

**Good commits:**

```
feat: Add centralized rules synchronization script

Implement .agents/rules/sync-rules.sh to synchronize rules
and skills across all agent platforms using symlinks.

- Cursor, Claude, Gemini use full directory symlinks
- Antigravity uses copy strategy (platform limitation)
- Includes dry-run mode and verification steps

Refs: #45
```

```
fix: Handle missing source directory in sync script

Add validation to check .agents/rules exists before
attempting synchronization. Exit with clear error
message if source directory is missing.

Refs: #52
```

```
docs: Add SYNC_SETUP guide for rules synchronization

Create comprehensive guide for using sync-rules.sh
including setup, usage, verification, and troubleshooting.

Refs: #48
```

**Bad commits:**

```
# Too vague
fix: Update script

# No context
feat: New feature

# Too much detail in summary
feat: Add sync-rules.sh script that creates symlinks for cursor claude gemini and copies for antigravity

# Missing type
Add documentation for sync process
```

### Commit Best Practices

**Atomic commits:**

- One logical change per commit
- Should be revertable independently
- Should pass tests when applied

**Clear messages:**

- Start with verb (Add, Fix, Update, Remove)
- Use imperative mood ("Add feature" not "Added feature")
- Explain WHY, not just WHAT

**Commit frequency:**

- Commit after completing a logical unit
- Before switching contexts
- Before potentially breaking changes

## Pull Request Workflow

### Creating Pull Requests

**PR Title:**

```
type: Brief description of changes

Examples:
feat: Implement centralized rules management
fix: Resolve symlink creation errors on macOS
docs: Update MCP setup guide with Antigravity limitations
```

**PR Description Template:**

```markdown
## Description

Brief summary of what this PR accomplishes.

## Changes

- Change 1
- Change 2
- Change 3

## Testing

- [ ] Tested on Cursor
- [ ] Tested on Claude Code
- [ ] Tested on Gemini CLI
- [ ] Tested on Antigravity
- [ ] All verification steps passed

## Screenshots (if applicable)

[Add screenshots here]

## Related Issues

Closes #123
Refs #456

## Checklist

- [ ] Code follows project style guidelines
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Commits follow commit message guidelines
```

### PR Review Process

**Before requesting review:**

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Self-reviewed changes
- [ ] Checked for debugging code/comments
- [ ] Verified no secrets committed

**Reviewer guidelines:**

- Check for code quality and consistency
- Verify documentation is clear
- Test locally if needed
- Provide constructive feedback
- Approve when satisfied

## Git Best Practices

### What to Commit

**DO commit:**

- Source code
- Configuration files
- Documentation
- Scripts
- Test files
- Generated configs (e.g., `.cursor/mcp.json`)

**DON'T commit:**

- Secrets or API keys
- Personal IDE settings (use global gitignore)
- Build artifacts (unless necessary)
- Temporary files
- Large binary files (use Git LFS if needed)

### .gitignore

```gitignore
# Secrets
.env
.env.local
**/secrets.*
**/*secret*
*.key
*.pem

# OS files
.DS_Store
Thumbs.db

# IDE (personal settings only)
.vscode/settings.json
.idea/workspace.xml

# Build artifacts
dist/
build/
*.log

# Dependencies
node_modules/
```

**Note:** Some agent configs ARE committed:

- `.cursor/mcp.json` ✅ (generated)
- `.claude/mcp.json` ✅ (generated)
- `.gemini/settings.json` ✅ (generated)

### Symlink Handling

**Committing symlinks:**

```bash
# Git automatically handles symlinks correctly
git add .cursor/rules  # Commits as symlink, not contents

# Verify symlink in git
git ls-files -s .cursor/rules
# 120000 means symlink
```

**Cloning with symlinks:**

```bash
# Symlinks are restored on clone
git clone repo.git
ls -la .cursor/rules  # Shows symlink
```

## Common Workflows

### Adding a New Feature

```bash
# 1. Create feature branch
git checkout -b feature/add-new-feature

# 2. Make changes
# ... edit files ...

# 3. Test changes
./script.sh --dry-run
./script.sh

# 4. Commit changes
git add .
git commit -m "feat: Add new feature

Detailed explanation of feature and rationale.

- Implementation detail 1
- Implementation detail 2

Refs: #123"

# 5. Push to remote
git push -u origin feature/add-new-feature

# 6. Create pull request
# Use GitHub/GitLab UI
```

### Fixing a Bug

```bash
# 1. Create fix branch
git checkout -b fix/resolve-bug

# 2. Fix bug
# ... edit files ...

# 3. Test fix
# ... verify fix works ...

# 4. Commit
git add .
git commit -m "fix: Resolve bug in sync script

Fixed issue where symlink validation failed on existing
directories. Now properly removes existing paths before
creating new symlinks.

Refs: #456"

# 5. Push and PR
git push -u origin fix/resolve-bug
```

### Updating Documentation

```bash
# 1. Create docs branch
git checkout -b docs/update-guide

# 2. Update docs
# ... edit markdown files ...

# 3. Review changes
git diff

# 4. Commit
git add docs/
git commit -m "docs: Update setup guide with new steps

Added verification section and troubleshooting tips
for common symlink issues.

Refs: #789"

# 5. Push and PR
git push -u origin docs/update-guide
```

## Syncing Generated Files

### MCP Configuration Workflow

```bash
# 1. Update source of truth
vim .agents/mcp/mcp-servers.json

# 2. Run sync script
./.agents/mcp/sync-mcp.sh

# 3. Review generated files
git diff .cursor/mcp.json
git diff .claude/mcp.json
git diff .gemini/settings.json

# 4. Commit source AND generated
git add .agents/mcp/mcp-servers.json
git add .cursor/mcp.json
git add .claude/mcp.json
git add .gemini/settings.json

git commit -m "feat: Add new MCP server

Added Context7 MCP server for documentation access.

- Updated source: .agents/mcp/mcp-servers.json
- Generated configs for all platforms
- Tested with all agents

Refs: #101"
```

### Rules/Skills Workflow

```bash
# 1. Add new rule
echo "# New Rule" > .agents/rules/new-rule.md

# 2. Run sync (creates symlinks)
./.agents/rules/sync-rules.sh

# 3. Verify symlinks work
cat .cursor/rules/new-rule.md

# 4. Commit source only (symlinks auto-restore)
git add .agents/rules/new-rule.md
git commit -m "docs: Add new project rule

Added rule for handling third-party dependencies.

Refs: #202"

# 5. Commit symlinks (one-time setup)
# Only needed if adding NEW symlink directories
git add .cursor/rules
git commit -m "chore: Add rules symlink for Cursor"
```

## Troubleshooting

### Symlinks Not Showing

**Issue:** Symlinks appear as directories after clone

**Solution:**

```bash
# Check Git config
git config core.symlinks
# Should be: true

# Re-clone if false
git config core.symlinks true
git clone repo.git
```

### Merge Conflicts in Generated Files

**Issue:** Merge conflict in `.cursor/mcp.json`

**Solution:**

```bash
# 1. Accept either version
git checkout --ours .cursor/mcp.json

# 2. Manually merge source
vim .agents/mcp/mcp-servers.json
# Resolve conflicts in source

# 3. Regenerate
./.agents/mcp/sync-mcp.sh

# 4. Commit
git add .agents/mcp/mcp-servers.json .cursor/mcp.json
git commit -m "merge: Resolve MCP config conflict"
```

### Accidentally Committed Secrets

**Solution:**

```bash
# 1. Remove from current commit
git reset HEAD~1
git add . # re-add without secret
git commit -m "Same message"

# 2. If already pushed, use git-filter-repo
# Install: brew install git-filter-repo
git filter-repo --invert-paths --path path/to/secret

# 3. Force push (DANGEROUS - coordinate with team)
git push --force

# 4. Rotate the secret immediately
```

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Best Practices](https://git-scm.com/book/en/v2)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Semantic Versioning](https://semver.org/)
