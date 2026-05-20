# Commit Troubleshooting Guide

Solutions for common commit-related issues.

## Common Issues

### 1. Committed to Wrong Branch

**Symptom:** Made commit on `main` instead of feature branch

**Solution A: Move commit to new branch (before push)**

```bash
# Create new branch at current commit
git branch feature-branch

# Reset main to previous commit
git reset HEAD~1 --hard

# Switch to new branch
git checkout feature-branch
```

**Solution B: Move commit to existing branch (before push)**

```bash
# Switch to correct branch
git checkout feature-branch

# Cherry-pick the commit
git cherry-pick main

# Switch back to main
git checkout main

# Remove commit from main
git reset HEAD~1 --hard
```

**After Push:** Contact team before force-pushing to shared branches

---

### 2. Need to Undo Last Commit

**Scenario A: Keep changes, undo commit**

```bash
# Undo commit but keep files staged
git reset --soft HEAD~1

# Or undo commit and unstage files
git reset HEAD~1
```

**Scenario B: Discard commit and changes**

```bash
# DANGEROUS: Removes commit and changes
git reset --hard HEAD~1
```

**Scenario C: Undo multiple commits**

```bash
# Undo last 3 commits, keep changes
git reset HEAD~3
```

---

### 3. Accidentally Committed Sensitive Data

**Before Push:**

```bash
# Undo commit
git reset HEAD~1

# Remove sensitive data from files
vim .env
git add .env .gitignore

# Add to .gitignore
echo ".env" >> .gitignore
git add .gitignore

# Create new commit
git commit -m "chore: add environment config template"
```

**After Push:**

**CRITICAL STEPS:**

1. **Immediately rotate/invalidate the exposed secrets**
   - Change passwords
   - Regenerate API keys
   - Revoke tokens
   - Update credentials in secure storage

2. **Remove from git history**

```bash
# Using git-filter-repo (recommended)
git filter-repo --invert-paths --path path/to/secret/file

# Or remove specific content
git filter-repo --replace-text <(echo 'SECRET_KEY==>REMOVED')

# Force push (coordinate with team first!)
git push --force
```

3. **Notify team and security**

**Prevention:**

```bash
# Add pre-commit hook
# .git/hooks/pre-commit

#!/bin/bash
if git diff --cached | grep -E '(password|secret|key|token).*='; then
  echo "❌ Possible secret detected!"
  exit 1
fi
```

---

### 4. Commit Message Has Typo

**Last commit:**

```bash
# Fix message
git commit --amend -m "fix(auth): resolve session timeout issue"
```

**Older commit:**

```bash
# Interactive rebase
git rebase -i HEAD~N  # N = number of commits back

# Change 'pick' to 'reword' for commit to fix
# Save and close
# Edit message in next editor
```

**After push:** Create clarifying commit instead:

```bash
git commit --allow-empty -m "docs: clarify previous commit abc123"
```

---

### 5. Need to Combine Multiple Commits

**Scenario: Squash last 3 commits**

```bash
# Interactive rebase
git rebase -i HEAD~3
```

**In editor:**

```
pick a1b2c3d First commit
squash b2c3d4e Second commit
squash c3d4e5f Third commit
```

**Save and close. Next editor opens for final commit message:**

```
feat(api): add user management endpoints

Implement complete CRUD functionality:
- User creation with validation
- User retrieval with pagination
- User update with partial data support
- User deletion with cascade

Refs: #456
```

---

### 6. Need to Split Large Commit

**Scenario:** One commit contains multiple logical changes

**Solution:**

```bash
# Reset last commit, keep changes
git reset HEAD~1

# Stage first logical change
git add src/file1.js src/file2.js
git commit -m "feat(api): add user endpoint"

# Stage second logical change
git add tests/user.test.js
git commit -m "test(api): add user endpoint tests"

# Stage third logical change
git add docs/api.md
git commit -m "docs(api): document user endpoint"
```

**Advanced: Interactive staging**

```bash
# Stage parts of files interactively
git add -p

# For each hunk:
# y = stage this hunk
# n = don't stage this hunk
# s = split hunk into smaller hunks
# e = manually edit hunk
```

---

### 7. Merge Conflict During Rebase

**Scenario:** Conflict while rebasing branch

**Solution:**

```bash
# See conflicted files
git status

# Edit files, resolve conflicts
vim src/conflicted-file.js

# Remove conflict markers:
# <<<<<<< HEAD
# =======
# >>>>>>> branch

# Stage resolved files
git add src/conflicted-file.js

# Continue rebase
git rebase --continue

# Or abort if needed
git rebase --abort
```

**Tips:**

- Look for conflict markers: `<<<<<<<`, `=======`, `>>>>>>>`
- Keep both changes if both are needed
- Test after resolving each conflict
- Use `git diff` to see what changed

---

### 8. Accidentally Committed Too Much

**Scenario:** Committed files that shouldn't be committed

**Solution:**

```bash
# Remove file from last commit
git reset HEAD~1
git reset HEAD unwanted-file.txt
git add .
git commit -c ORIG_HEAD  # Reuse original message
```

**Or:**

```bash
# Remove file, keep commit
git rm --cached unwanted-file.txt
git commit --amend --no-edit

# Add to .gitignore
echo "unwanted-file.txt" >> .gitignore
git add .gitignore
git commit -m "chore: update gitignore"
```

---

### 9. Forgot to Add Files to Commit

**Last commit:**

```bash
# Add forgotten files
git add forgotten-file.js

# Amend commit
git commit --amend --no-edit
```

**Older commit:**

```bash
# Create fixup commit
git add forgotten-file.js
git commit --fixup abc123  # abc123 is the commit to fix

# Auto-squash during rebase
git rebase -i --autosquash HEAD~N
```

---

### 10. Wrong Author Information

**Last commit:**

```bash
# Fix author
git commit --amend --author="Name <email@example.com>"
```

**Multiple commits:**

```bash
# Set correct global config
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Rebase and edit
git rebase -i HEAD~N
# Mark commits as 'edit'

# For each commit:
git commit --amend --reset-author --no-edit
git rebase --continue
```

---

### 11. Need to Recover Lost Commit

**Scenario:** Accidentally reset/deleted commits

**Solution:**

```bash
# View reflog (history of HEAD changes)
git reflog

# Find lost commit
# reflog shows: abc123 HEAD@{2}: commit: lost commit message

# Recover commit
git cherry-pick abc123

# Or reset to that point
git reset --hard abc123
```

**Reflog expires after 90 days** by default

---

### 12. Commit Disappeared After Rebase

**Scenario:** Commit missing after interactive rebase

**Solution:**

```bash
# Check reflog
git reflog

# Find commit before rebase
# Example: def456 HEAD@{1}: rebase -i (start)

# Reset to before rebase
git reset --hard def456

# Redo rebase carefully
git rebase -i HEAD~N
```

---

### 13. Can't Push - Diverged History

**Error:**

```
! [rejected] main -> main (non-fast-forward)
```

**Solution A: Rebase (recommended)**

```bash
# Pull with rebase
git pull --rebase origin main

# Resolve conflicts if any
git add .
git rebase --continue

# Push
git push
```

**Solution B: Merge**

```bash
# Pull and merge
git pull origin main

# Resolve conflicts if any
git add .
git commit

# Push
git push
```

**Solution C: Force push (DANGEROUS)**

```bash
# ONLY if you're sure remote should match local
git push --force-with-lease

# NEVER do this on shared branches without team coordination
```

---

### 14. Rebase Conflicts Are Too Complex

**Solution: Abort and use merge**

```bash
# Abort rebase
git rebase --abort

# Use merge instead
git checkout main
git pull
git checkout feature
git merge main

# Resolve conflicts once
git add .
git commit

# Push
git push
```

---

### 15. Need to Change Commit Order

**Scenario:** Commits are in wrong order

**Solution:**

```bash
# Interactive rebase
git rebase -i HEAD~N
```

**In editor, reorder lines:**

```
pick c3d4e5f Third commit (should be first)
pick a1b2c3d First commit
pick b2c3d4e Second commit
```

**Save and close** - Git will reapply in new order

---

## Preventive Measures

### Pre-commit Checklist

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash

echo "🔍 Running pre-commit checks..."

# Check for debugging code
if git diff --cached | grep -E '(console\.log|debugger|TODO|FIXME)'; then
  echo "⚠️  Warning: Debugging code detected"
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Check for secrets
if git diff --cached | grep -E '(password|secret|key|token).*='; then
  echo "❌ Possible secret detected!"
  exit 1
fi

echo "✅ Pre-commit checks passed"
```

Make executable:

```bash
chmod +x .git/hooks/pre-commit
```

### Commit Message Validation

Create `.git/hooks/commit-msg`:

```bash
#!/bin/bash

commit_msg=$(cat "$1")

# Check conventional commit format
if ! echo "$commit_msg" | grep -qE '^(feat|fix|docs|refactor|test|chore|perf|style)(\(.+\))?: .+'; then
  echo "❌ Commit message must follow conventional commits format"
  echo "   Example: feat(api): add user endpoint"
  exit 1
fi

# Check subject length
subject=$(echo "$commit_msg" | head -1)
if [ ${#subject} -gt 72 ]; then
  echo "⚠️  Warning: Subject line longer than 72 characters"
fi

echo "✅ Commit message valid"
```

Make executable:

```bash
chmod +x .git/hooks/commit-msg
```

### .gitignore Best Practices

Always ignore:

```gitignore
# Secrets
.env
.env.local
*.key
*.pem
*secret*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/settings.json
.idea/workspace.xml

# Dependencies
node_modules/
vendor/

# Build
dist/
build/
*.log
```

### Global .gitignore

For OS and IDE files:

```bash
# Create global gitignore
git config --global core.excludesfile ~/.gitignore_global

# Add common patterns
cat >> ~/.gitignore_global << 'EOF'
.DS_Store
Thumbs.db
.vscode/
.idea/
*.swp
*.swo
EOF
```

---

## Emergency Procedures

### Complete History Rewrite Needed

**Use case:** Accidentally committed large files or secrets throughout history

**Tool:** `git-filter-repo` (better than `git filter-branch`)

```bash
# Install
brew install git-filter-repo  # macOS
# or
pip install git-filter-repo

# Remove file from all history
git filter-repo --invert-paths --path path/to/file

# Remove secrets from all history
git filter-repo --replace-text <(echo 'SECRET_KEY==>REMOVED')

# Force push
git push --force-with-lease
```

**WARNING:** Rewrites entire history. Coordinate with team. All collaborators must re-clone.

### Recovery from Catastrophic Mistake

**Scenario:** Severely messed up repository

**Options:**

1. **Use reflog** (if recent)

   ```bash
   git reflog
   git reset --hard abc123  # Before mistake
   ```

2. **Restore from backup** (if you have backups)

   ```bash
   cp -r /backup/repo/.git .
   ```

3. **Re-clone and cherry-pick work**

   ```bash
   # Clone fresh from remote
   git clone repo-url repo-fresh

   # Copy in-progress work
   cp -r old-repo/src new-repo/src

   # Commit and continue
   cd new-repo
   git checkout -b recovered-work
   git add .
   git commit
   ```

---

## Getting Help

### Useful Git Commands

```bash
# See what would be committed
git diff --cached

# See commit history
git log --oneline --graph

# See file history
git log --follow -- file.js

# See who changed what
git blame file.js

# Find commit that introduced bug
git bisect start
git bisect bad          # Current version is bad
git bisect good abc123  # Known good version
# Git will check out commits to test
# Mark each: git bisect good/bad
# Git finds the problematic commit

# Search commits
git log --grep="search term"

# Search code history
git log -S "function name" --source --all
```

### Understanding Git State

```bash
# Current status
git status

# Where is HEAD?
git log -1 --oneline

# What commits are ahead of origin?
git log origin/main..HEAD

# What commits are on origin but not local?
git log HEAD..origin/main

# Visualize branches
git log --oneline --graph --all --decorate
```

---

## When All Else Fails

1. **Don't panic** - Git rarely loses data permanently
2. **Check reflog** - `git reflog` shows everything
3. **Ask for help** - Share `git status` and `git log --oneline -10`
4. **Create backup** - `cp -r .git .git.backup` before risky operations
5. **Start fresh** - Re-clone if necessary, uncommitted work can be copied over

**Remember:** Git is designed to preserve history. Most "lost" commits can be recovered from reflog.
