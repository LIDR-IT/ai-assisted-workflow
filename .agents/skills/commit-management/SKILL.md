---
name: commit-management
description: This skill should be used when the user asks about "commit best practices", "fix commit", "amend commit", "commit message guidelines", "conventional commits", "rewrite commits", "commit history", or needs help managing git commits following project standards.
version: 1.0.0
---

# Commit Management Skill

Comprehensive guidance for managing git commits following conventional commit standards and project best practices.

## Overview

This skill helps you:

- ✅ **Create well-formatted commits** following conventional commit standards
- ✅ **Fix and amend commits** when mistakes happen
- ✅ **Manage commit history** with rebase and squash
- ✅ **Follow best practices** for atomic commits and clear messages
- ✅ **Troubleshoot** common commit issues

## Quick Start

### For Quick Commits

Use the **`/commit` command** for fast, guided commit creation:

```bash
# Quick mode (with message)
/commit feat(api): add user authentication

# Guided mode (AI suggests message)
/commit
```

The `/commit` command is optimized for single-commit workflows with validation and suggestions.

### For Advanced Commit Workflows

Use **this skill** when you need:

- Multiple related commits (atomic commit strategy)
- Commit history management (amend, rebase, squash)
- Complex commit messages with body and footer
- Breaking change documentation
- Commit troubleshooting and fixes

## When to Use This Skill

**Use `/commit` command when:**

- ✅ Creating a single, straightforward commit
- ✅ You want AI to suggest a commit message
- ✅ Quick validation of commit format

**Use this skill when:**

- ✅ Managing multiple related commits
- ✅ Fixing or amending previous commits
- ✅ Rewriting commit history
- ✅ Understanding commit best practices
- ✅ Troubleshooting commit issues
- ✅ Creating complex commits (with body/footer)

## Conventional Commit Format

This project follows the **Conventional Commits** specification.

### Basic Format

```
type(scope): subject

body

footer
```

### Components

**Type** (required):

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `refactor` - Code restructuring
- `test` - Adding/updating tests
- `chore` - Maintenance tasks
- `perf` - Performance improvements
- `style` - Code formatting

**Scope** (optional):

- Component, module, or area affected
- Examples: `api`, `auth`, `ui`, `database`

**Subject** (required):

- Brief description (< 50 characters)
- Imperative mood: "add" not "added"
- No period at the end
- Lowercase after type

**Body** (optional):

- Detailed explanation
- Wrap at 72 characters
- Explain WHAT and WHY, not HOW
- Separate from subject with blank line

**Footer** (optional):

- Breaking changes: `BREAKING CHANGE: description`
- Issue references: `Refs: #123`, `Closes: #456`
- Co-authors: `Co-Authored-By: Name <email>`

### Examples

**Simple commit:**

```
feat(auth): add JWT token validation
```

**With body:**

```
feat(auth): add JWT token validation

Implement middleware to validate JWT tokens on protected routes.
Tokens are verified using the secret key from environment variables.
Expired tokens are rejected with 401 status.
```

**With breaking change:**

```
feat(api): change user endpoint response format

BREAKING CHANGE: User API now returns { data: user } instead of
direct user object. Update all API clients to access user.data.

Refs: #234
```

**Full example:**

```
fix(database): resolve connection pool exhaustion

Database connections were not being released properly after queries,
causing the pool to exhaust under high load. Added explicit connection
release in finally blocks and reduced pool timeout from 30s to 10s.

Performance testing shows 40% improvement under concurrent load.

Closes: #567
Refs: #543
```

For more examples, see: `examples/commit-examples.md`

## Common Workflows

### 1. Creating Atomic Commits

**Strategy:** Break work into logical, independent commits.

**Workflow:**

```bash
# Stage specific files only
git add src/auth/login.js
git commit -m "feat(auth): add login endpoint"

git add src/auth/logout.js
git commit -m "feat(auth): add logout endpoint"

git add tests/auth.test.js
git commit -m "test(auth): add authentication tests"
```

**Best practices:**

- One logical change per commit
- Each commit should be revertable independently
- Keep commits focused and small
- Write clear, descriptive messages

See: `references/commit-patterns.md` for more atomic commit strategies

### 2. Amending the Last Commit

**Use case:** Fix typo, add forgotten file, or improve commit message

**Workflow:**

```bash
# Fix the file
vim src/file.js

# Stage the fix
git add src/file.js

# Amend the last commit
git commit --amend

# Or amend without changing message
git commit --amend --no-edit
```

**Warning:** Only amend commits that haven't been pushed. Amending pushed commits requires force push.

### 3. Fixing Commit Messages

**Use case:** Improve clarity of recent commit message

**Workflow:**

```bash
# Amend last commit message
git commit --amend -m "feat(api): add user authentication endpoint"

# Or edit in editor
git commit --amend
```

### 4. Interactive Rebase (Rewriting History)

**Use case:** Clean up commit history before pushing

**Workflow:**

```bash
# Rebase last 3 commits interactively
git rebase -i HEAD~3

# In the editor:
# - pick = keep commit
# - reword = change commit message
# - squash = combine with previous commit
# - fixup = squash but discard commit message
# - drop = remove commit
```

**Example rebase:**

```
pick a1b2c3d feat(auth): add login
fixup d4e5f6g fix typo in login
reword g7h8i9j feat(auth): add logout
```

**Warning:** Never rebase commits that have been pushed to shared branches.

See: `references/troubleshooting.md` for rebase conflict resolution

### 5. Squashing Multiple Commits

**Use case:** Combine multiple WIP commits into one clean commit

**Workflow:**

```bash
# Squash last 4 commits into 1
git rebase -i HEAD~4

# Mark all but first as 'squash'
pick a1b2c3d WIP: start feature
squash b2c3d4e WIP: continue
squash c3d4e5f WIP: almost done
squash d4e5f6g WIP: finished

# Write final commit message when prompted
```

### 6. Splitting a Large Commit

**Use case:** Break a large commit into smaller, atomic commits

**Workflow:**

```bash
# Reset last commit but keep changes
git reset HEAD~1

# Stage and commit in smaller chunks
git add src/feature-part1.js
git commit -m "feat(api): add endpoint structure"

git add src/feature-part2.js
git commit -m "feat(api): add validation logic"

git add tests/
git commit -m "test(api): add endpoint tests"
```

## Best Practices

### Writing Good Commit Messages

**DO:**

- ✅ Use imperative mood: "Add feature" not "Added feature"
- ✅ Keep subject under 50 characters
- ✅ Explain WHY, not HOW (code shows how)
- ✅ Reference issues/tickets when relevant
- ✅ Be specific and descriptive
- ✅ Use conventional commit format

**DON'T:**

- ❌ Use vague messages: "fix stuff", "updates", "WIP"
- ❌ Combine unrelated changes in one commit
- ❌ Write commit messages in past tense
- ❌ Include debugging statements in final commits
- ❌ Commit commented-out code

### Atomic Commit Strategy

**Principles:**

1. **One logical change per commit**
   - Feature addition = one commit
   - Bug fix = one commit
   - Refactor = separate commit from feature

2. **Commits should be revertable**
   - Rolling back one commit shouldn't break the project
   - Each commit should leave the code in a working state

3. **Meaningful progression**
   - Commit history tells a story
   - Each commit builds upon the previous

**Example progression:**

```
1. feat(database): add user schema
2. feat(database): add user repository
3. feat(api): add user CRUD endpoints
4. test(api): add user endpoint tests
5. docs(api): document user endpoints
```

### Breaking Changes

**Format:**

```
feat(api): change authentication flow

BREAKING CHANGE: Authentication now requires API key in header
instead of query parameter. Update all API clients to send
X-API-Key header.

Migration guide: See docs/migration/v2-auth.md

Refs: #789
```

**Guidelines:**

- Always use `BREAKING CHANGE:` footer
- Explain what changed and why
- Provide migration instructions
- Consider creating migration guide document

### Co-Authoring

**Format:**

```
feat(feature): add collaborative feature

Implement feature with pair programming.

Co-Authored-By: Alice Smith <alice@example.com>
Co-Authored-By: Bob Jones <bob@example.com>
```

**When to use:**

- Pair programming sessions
- Significant contributions from multiple people
- AI-assisted development (optional)

**Project standard:**

```
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## Troubleshooting

### Issue: "Committed to wrong branch"

**Solution:**

```bash
# Move commit to new branch
git branch new-branch
git reset HEAD~1 --hard
git checkout new-branch
```

### Issue: "Need to undo last commit"

**Solution:**

```bash
# Undo commit but keep changes
git reset HEAD~1

# Undo commit and discard changes (DANGEROUS)
git reset HEAD~1 --hard
```

### Issue: "Accidentally committed sensitive data"

**Solution:**

```bash
# If not yet pushed
git reset HEAD~1
# Remove sensitive data from files
git add .
git commit

# If already pushed - IMMEDIATELY rotate secrets
# Then use git-filter-repo to remove from history
git filter-repo --invert-paths --path path/to/secret
git push --force
```

### Issue: "Merge conflict during rebase"

**Solution:**

```bash
# Fix conflicts in files
vim conflicted-file.js

# Stage resolved files
git add conflicted-file.js

# Continue rebase
git rebase --continue

# Or abort if needed
git rebase --abort
```

### Issue: "Commit message has typo"

**Solution:**

```bash
# If last commit
git commit --amend -m "corrected message"

# If older commit
git rebase -i HEAD~N
# Mark commit as 'reword', save, then edit message
```

For more troubleshooting scenarios, see: `references/troubleshooting.md`

## Advanced Topics

### Cherry-Picking Commits

**Use case:** Apply specific commit from another branch

```bash
# Apply commit abc123 to current branch
git cherry-pick abc123

# Apply multiple commits
git cherry-pick abc123 def456

# Cherry-pick without committing (stage only)
git cherry-pick abc123 --no-commit
```

### Reverting Commits

**Use case:** Undo a commit that was already pushed

```bash
# Create new commit that undoes abc123
git revert abc123

# Revert without committing
git revert abc123 --no-commit

# Revert multiple commits
git revert abc123..def456
```

### Stashing Changes

**Use case:** Temporarily save uncommitted changes

```bash
# Stash all changes
git stash

# Stash with message
git stash save "WIP: feature in progress"

# List stashes
git stash list

# Apply most recent stash
git stash pop

# Apply specific stash
git stash apply stash@{1}
```

## References

For deeper dives into specific topics:

- **`references/conventional-commits.md`** - Complete conventional commit specification
- **`references/commit-patterns.md`** - Common commit scenarios and best practices
- **`references/troubleshooting.md`** - Comprehensive troubleshooting guide

## Examples

For real-world commit examples:

- **`examples/commit-examples.md`** - Annotated examples of good commits
- **`examples/multi-commit-workflow.md`** - Breaking features into atomic commits

## Templates

For complex commits:

- **`assets/commit-message-template.txt`** - Template for detailed commit messages
- **`assets/breaking-change-template.txt`** - Template for breaking change commits

## Integration with Project Tools

### Using with /commit Command

The `/commit` command is your primary tool for creating commits:

```bash
# Let AI analyze and suggest message
/commit

# Provide message for validation
/commit feat(api): add endpoint
```

This skill provides **knowledge and context** for commit workflows, while the command provides **execution and automation**.

### Project Git Workflow

This skill follows project standards defined in:

- `.agents/rules/process/git-workflow.md` - Git workflow guidelines
- `.agents/rules/code/principles.md` - Core project principles

## Quick Reference

### Commit Type Cheat Sheet

```
feat     - New feature
fix      - Bug fix
docs     - Documentation only
refactor - Code restructuring (no behavior change)
test     - Adding/updating tests
chore    - Maintenance (dependencies, configs)
perf     - Performance improvement
style    - Code formatting (no logic change)
```

### Common Commands

```bash
# Create commit
git commit -m "type(scope): message"

# Amend last commit
git commit --amend

# Interactive rebase
git rebase -i HEAD~N

# Undo last commit (keep changes)
git reset HEAD~1

# Undo last commit (discard changes)
git reset HEAD~1 --hard

# Squash last N commits
git rebase -i HEAD~N
```

### Validation Checklist

Before committing, verify:

- [ ] Type is valid (feat, fix, docs, etc.)
- [ ] Subject is under 50 characters
- [ ] Imperative mood used ("Add" not "Added")
- [ ] Message explains WHY, not HOW
- [ ] Breaking changes documented if applicable
- [ ] Related issues referenced
- [ ] Code is working (tests pass)
- [ ] No sensitive data included
- [ ] Commit is atomic (single logical change)

---

**Need help?** Ask about specific commit scenarios, and this skill will guide you through the appropriate workflow following project standards.
