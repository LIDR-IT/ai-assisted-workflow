---
description: Create conventional commit from staged changes
allowed-tools: Bash(git:*)
model: sonnet
argument-hint: [commit-message]
---

# Git Commit Workflow

You are an expert Git workflow assistant. Help the user create a well-formatted conventional commit following the project's standards.

## Your Task

### 1. Check Staged Changes

First, execute the following commands to see what's being committed:

```bash
git diff --cached --stat
git diff --cached
```

Show the user what files and changes are staged for commit.

### 2. Handle Arguments

**If user provided $ARGUMENTS (commit message):**

1. Validate the message follows conventional commit format:
   - Format: `type(scope): description` or `type: description`
   - Valid types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, `style`

2. If format is **correct**:
   - Proceed to create the commit with the provided message
   - Show confirmation

3. If format is **incorrect**:
   - Explain what's wrong
   - Suggest corrected version(s)
   - Ask user for confirmation or modification

**If NO arguments provided (guided mode):**

1. Analyze the staged changes shown in git diff
2. Based on the changes, suggest an appropriate conventional commit message:
   - Determine the correct type (feat, fix, docs, etc.)
   - Identify the scope from changed files
   - Write clear, concise description
3. Present the suggested message to the user
4. Ask if they want to:
   - Use the suggested message
   - Modify it
   - Provide their own message

### 3. Commit Message Guidelines

Follow the project standards from `.agents/rules/process/git-workflow.md`:

**Format:**
```
type(scope): Brief summary (50 chars or less)

Optional detailed explanation if needed. Wrap at 72 characters.
Explain WHAT changed and WHY, not HOW (code shows how).

- Bullet points for multiple changes
- Each change on its own line
- Focus on impact and rationale

Refs: #123
```

**Commit Types:**
- `feat:` New feature or functionality
- `fix:` Bug fix
- `docs:` Documentation only changes
- `refactor:` Code restructuring without behavior change
- `test:` Adding or updating tests
- `chore:` Maintenance tasks (dependencies, configs)
- `perf:` Performance improvements
- `style:` Code formatting (no logic change)

**Best Practices:**
- Use **imperative mood**: "Add feature" not "Added feature"
- Explain **WHY**, not just WHAT
- Keep subject line **under 50 characters**
- **Atomic commits** - one logical change per commit
- Be specific and descriptive

### 4. Create Commit

Once the commit message is confirmed by the user, create the commit using:

```bash
git commit -m "$(cat <<'EOF'
[commit message here]
EOF
)"
```

Replace `[commit message here]` with the actual commit message.

### 5. Verify Success

After creating the commit, verify it was successful:

```bash
git log -1 --oneline
git status
```

Show the user the created commit and current git status.

## Examples

### Example 1: With full message (quick mode)

**User input:**
```
/commit feat(api): add user authentication endpoint
```

**Your response:**
```
✅ Checking staged changes...

Files to commit:
  src/api/auth.js    | 45 +++++++++++++++++++++
  1 file changed, 45 insertions(+)

✅ Validating commit message format...
Format: ✅ Valid conventional commit
Type: feat (New feature)
Scope: api
Description: add user authentication endpoint

✅ Creating commit...

[main a1b2c3d] feat(api): add user authentication endpoint
 1 file changed, 45 insertions(+)

✅ Commit created successfully:
a1b2c3d feat(api): add user authentication endpoint

Current status: working tree clean
```

### Example 2: Invalid format correction

**User input:**
```
/commit added new sync script
```

**Your response:**
```
⚠️  Commit message format needs correction

Current message: "added new sync script"
Issue:
- Missing conventional commit type
- Not in imperative mood ("added" should be "add")

Suggested corrections:
1. `feat: add new sync script`
2. `chore: add new sync script`
3. `feat(scripts): add new sync script`

Which would you prefer, or would you like to provide a different message?
```

### Example 3: Guided mode (no arguments)

**User input:**
```
/commit
```

**Your response:**
```
📋 Analyzing staged changes...

Staged files:
  .agents/commands/commit.md        | 156 ++++++++++++++++++++++++++
  1 file changed, 156 insertions(+)

Changes detected:
- Created new commit.md command file
- Implements conventional commit workflow
- Includes validation and guided mode
- Restricted to git commands only for security

💡 Suggested commit message:

feat(commands): add /commit command for git workflow

Implement conventional commit command with validation and
guided mode. Command analyzes staged changes and suggests
properly formatted commit messages following project standards.

- Validates conventional commit format
- Provides guided mode when no message provided
- Restricted to git commands only (Bash(git:*))
- Includes usage examples and documentation

Would you like to:
1. Use this message as-is
2. Modify it
3. Provide your own message

Please let me know your choice.
```

## Validation Rules

Before creating any commit, ensure:

1. **Type validation**: Must be one of: feat, fix, docs, refactor, test, chore, perf, style
2. **Format validation**: Must match `type(scope): description` or `type: description`
3. **Length validation**: Subject line should be under 50 characters (warn if longer)
4. **Mood validation**: Should use imperative mood (suggest corrections if not)
5. **Staged changes**: Verify there are staged changes before attempting commit

## Safety Notes

- This command is restricted to **git commands only** (`allowed-tools: Bash(git:*)`)
- Commits are created but **NOT pushed** automatically (requires explicit `git push`)
- Always shows what will be committed **before** creating the commit
- Validates all commit messages against project standards
- Uses HEREDOC with single quotes (`<<'EOF'`) to prevent variable expansion

## Error Handling

If any errors occur:

1. **No staged changes:**
   ```
   ❌ Error: No changes staged for commit

   Please stage your changes first:
   git add <files>

   Or stage all changes:
   git add .
   ```

2. **Git command fails:**
   ```
   ❌ Error: Failed to create commit

   [Show git error message]

   Please check your git configuration and try again.
   ```

3. **Invalid commit type:**
   ```
   ❌ Error: Invalid commit type "xyz"

   Valid types: feat, fix, docs, refactor, test, chore, perf, style

   Please use one of the valid types.
   ```

## Additional Notes

- If the commit is for multiple types of changes, suggest splitting into separate commits
- If changes are extensive, suggest adding a commit body with more details
- Remind users they can always use `git commit --amend` if they need to modify the commit
- For breaking changes, suggest adding "BREAKING CHANGE:" in the commit body
