# Dynamic Context Injection

## Overview

Dynamic context injection allows skills to execute shell commands and inject their output directly into the skill content **before** Claude sees it. This preprocessing capability enables skills to work with live data, current system state, or external APIs without requiring Claude to execute commands.

The `` !`command` `` syntax is a powerful feature that transforms static skill instructions into dynamic, context-aware prompts.

## What is Dynamic Context Injection?

Dynamic context injection uses special syntax to execute shell commands during skill loading:

```yaml
---
name: pr-summary
description: Summarize GitHub pull request
---

## Pull Request Context
- PR diff: !`gh pr diff`
- PR comments: !`gh pr view --comments`
- Changed files: !`gh pr diff --name-only`

## Your Task
Summarize the above pull request.
```

**Key concept:** The `` !`command` `` syntax is **preprocessing**, not execution. Claude never runs these commands—they execute before Claude sees the skill content.

## When to Use Dynamic Context

### Use Dynamic Context When:

- **You need live data** that changes between invocations
- **External commands provide context** (GitHub API, git status, system info)
- **Current state matters** (open files, recent commits, environment variables)
- **Data is too large** to hardcode in skill content
- **Information comes from external sources** (APIs, databases, files)

**Examples:**
- Pull request summaries (live PR data)
- Git commit assistance (current diff, staged files)
- System diagnostics (current resource usage, logs)
- API documentation (live endpoint status)
- Environment-specific workflows (current deployment, active services)

### Don't Use Dynamic Context When:

- **Static guidelines** that don't change (style guides, conventions)
- **Commands have side effects** (deployments, deletions)
- **Slow or unreliable commands** (could block skill loading)
- **Security-sensitive operations** (credentials exposure risk)
- **Simple string substitutions** (`$ARGUMENTS` is better)

## How It Works

### Execution Flow

1. **Skill Invocation**: User or Claude invokes skill
2. **Preprocessing Phase**: Each `` !`command` `` executes immediately
3. **Output Injection**: Command output replaces the placeholder
4. **Skill Loading**: Claude receives fully-rendered content
5. **Task Execution**: Claude follows instructions with injected data

### Example Transformation

**Before preprocessing (skill file):**
```markdown
Current branch: !`git branch --show-current`
Recent commits: !`git log --oneline -5`

Review these commits for issues.
```

**After preprocessing (what Claude sees):**
```markdown
Current branch: feature/authentication
Recent commits:
a1b2c3d Add login endpoint
d4e5f6g Update user model
g7h8i9j Fix validation bug
j0k1l2m Add tests
m3n4o5p Update docs

Review these commits for issues.
```

## Syntax Reference

### Basic Syntax

```markdown
!`command`
```

**Examples:**
```markdown
!`date`
!`whoami`
!`pwd`
!`git status --short`
```

### With Arguments

```markdown
!`command arg1 arg2`
```

**Examples:**
```markdown
!`gh pr diff 123`
!`git log --oneline -n 10`
!`curl https://api.example.com/status`
```

### Combining with Skill Arguments

```markdown
!`command $0`
!`command $ARGUMENTS`
```

**Examples:**
```markdown
# Skill invoked with: /analyze-pr 456
!`gh pr view $0`  # Executes: gh pr view 456

# Skill invoked with: /check-file src/auth.ts
!`cat $ARGUMENTS`  # Executes: cat src/auth.ts
```

### Multiple Commands

```markdown
- First: !`command1`
- Second: !`command2`
- Third: !`command3`
```

**Example:**
```markdown
## Repository Status
- Branch: !`git branch --show-current`
- Status: !`git status --short`
- Last commit: !`git log -1 --oneline`
```

## Complete Examples

### Example 1: Pull Request Summarizer

Injects live PR data for comprehensive summaries.

**.claude/skills/pr-summary/SKILL.md:**
```yaml
---
name: pr-summary
description: Summarize pull request with current data
argument-hint: [pr-number]
context: fork
agent: Explore
allowed-tools: Bash(gh *)
---

# Pull Request Summary Task

## PR Context

### Metadata
- PR Number: $0
- Title: !`gh pr view $0 --json title -q .title`
- Author: !`gh pr view $0 --json author -q .author.login`
- Status: !`gh pr view $0 --json state -q .state`
- Created: !`gh pr view $0 --json createdAt -q .createdAt`

### Changes
!`gh pr diff $0`

### Files Changed
!`gh pr diff $0 --name-only`

### Comments
!`gh pr view $0 --comments`

### Checks Status
!`gh pr checks $0`

## Your Task

Analyze this pull request and provide:

1. **Summary**: What does this PR do? (2-3 sentences)
2. **Key Changes**: Bullet list of main modifications
3. **Potential Issues**: Security, performance, or logic concerns
4. **Testing Recommendations**: What should reviewers test?
5. **Review Comments**: Specific suggestions with file/line references

Be thorough but concise. Focus on actionable feedback.
```

**Usage:**
```
/pr-summary 123
```

**Result:** Claude receives fully-populated PR data and generates comprehensive summary.

### Example 2: Smart Commit Assistant

Injects current git state to suggest commit messages.

**.claude/skills/smart-commit/SKILL.md:**
```yaml
---
name: smart-commit
description: Generate conventional commit message from staged changes
disable-model-invocation: true
---

# Commit Message Generation

## Current Repository State

### Branch
!`git branch --show-current`

### Staged Changes
!`git diff --cached --stat`

### Full Diff
!`git diff --cached`

### Recent Commits (for style reference)
!`git log --oneline -10`

## Your Task

Based on the staged changes above, generate a conventional commit message:

**Format:**
```
type(scope): Brief description (max 50 chars)

Detailed explanation if needed (wrap at 72 chars).

- Bullet points for multiple changes
- Each on its own line

Refs: #issue-number (if applicable)
```

**Types:** feat, fix, docs, refactor, test, chore, perf, style

**Guidelines:**
1. Use imperative mood ("Add feature" not "Added feature")
2. Be specific about WHAT changed and WHY
3. Reference issue numbers if applicable
4. Match the style of recent commits

Generate the commit message now.
```

**Usage:**
```
/smart-commit
```

**Result:** Claude sees actual staged changes and generates appropriate commit message.

### Example 3: System Diagnostics

Injects system state for troubleshooting.

**.claude/skills/diagnose-system/SKILL.md:**
```yaml
---
name: diagnose-system
description: Diagnose system performance issues
context: fork
agent: Explore
---

# System Diagnostics

## Current System State

### Resource Usage
**Memory:**
!`free -h`

**Disk:**
!`df -h`

**CPU:**
!`top -bn1 | head -15`

### Active Services
!`systemctl --type=service --state=running`

### Recent Errors
**System logs (last 50 lines):**
!`journalctl -n 50 --no-pager`

**Application logs:**
!`tail -50 /var/log/application.log`

### Network Status
!`netstat -tulpn | grep LISTEN`

## Your Task

Analyze the system state above and:

1. **Identify Issues**: What's causing problems?
2. **Resource Analysis**: Any bottlenecks (CPU, memory, disk)?
3. **Service Status**: Are all expected services running?
4. **Error Patterns**: Any recurring errors in logs?
5. **Recommendations**: Specific actions to resolve issues

Prioritize by severity (Critical, High, Medium, Low).
```

**Usage:**
```
/diagnose-system
```

**Result:** Real-time system diagnostics analyzed by Claude.

### Example 4: API Status Dashboard

Injects live API health data.

**.claude/skills/api-status/SKILL.md:**
```yaml
---
name: api-status
description: Check API health and generate status report
context: fork
---

# API Health Check

## Endpoint Status

### Authentication Service
!`curl -s -o /dev/null -w "%{http_code}" https://api.example.com/health/auth`

### User Service
!`curl -s -o /dev/null -w "%{http_code}" https://api.example.com/health/users`

### Payment Service
!`curl -s -o /dev/null -w "%{http_code}" https://api.example.com/health/payments`

## Response Times
!`curl -s -w "\nTime: %{time_total}s\n" https://api.example.com/health`

## Database Status
!`curl -s https://api.example.com/health/database`

## Recent Error Logs
!`tail -100 logs/api-errors.log | grep ERROR`

## Your Task

Generate a status report:

1. **Overall Health**: All services operational?
2. **Performance**: Are response times acceptable?
3. **Database**: Any connection issues?
4. **Recent Errors**: Patterns or critical issues?
5. **Recommendations**: Immediate actions needed?

Use this format:
- 🟢 Healthy
- 🟡 Degraded
- 🔴 Down
```

**Usage:**
```
/api-status
```

**Result:** Live API health report with current data.

### Example 5: Environment Configuration

Injects environment-specific settings.

**.claude/skills/deploy-config/SKILL.md:**
```yaml
---
name: deploy-config
description: Generate deployment configuration
argument-hint: [environment]
disable-model-invocation: true
---

# Deployment Configuration

## Environment: $0

### Current Configuration
!`cat config/$0.env`

### Infrastructure State
!`terraform workspace select $0 && terraform show`

### Active Services
!`kubectl get pods -n $0`

### Recent Deployments
!`kubectl rollout history deployment -n $0`

## Your Task

Validate the deployment configuration for **$0**:

1. **Configuration Check**: Are all required variables set?
2. **Infrastructure**: Is infrastructure in expected state?
3. **Services**: Are all required services running?
4. **Recent Changes**: Any recent failed deployments?
5. **Readiness**: Is environment ready for deployment?

Provide a GO/NO-GO decision with specific reasons.
```

**Usage:**
```
/deploy-config staging
```

**Result:** Environment-specific deployment readiness check.

## Best Practices

### 1. Fast Commands Only

✅ **DO:** Use fast commands (< 2 seconds):

```markdown
!`git status --short`
!`gh pr view $0 --json title`
!`cat config.json`
```

❌ **DON'T:** Use slow commands (blocks skill loading):

```markdown
!`npm install`  # Too slow
!`docker build .`  # Too slow
!`pytest`  # Too slow
```

### 2. Idempotent Commands

✅ **DO:** Use read-only, side-effect-free commands:

```markdown
!`git log -5`
!`curl -s https://api.example.com/status`
!`cat file.txt`
```

❌ **DON'T:** Use commands with side effects:

```markdown
!`git commit -m "Auto commit"`  # Modifies state
!`rm -rf temp/`  # Destructive
!`curl -X POST https://api.example.com/deploy`  # Side effects
```

### 3. Error Handling

✅ **DO:** Provide fallback context if command fails:

```markdown
## PR Status
!`gh pr view $0 2>/dev/null || echo "PR not found or gh not authenticated"`
```

✅ **DO:** Use commands that fail gracefully:

```markdown
!`git log -5 2>/dev/null || echo "No git repository"`
```

### 4. Security Considerations

✅ **DO:** Avoid exposing secrets:

```markdown
# Good - only shows if variable exists
!`echo "API configured: ${API_KEY:+YES}"`

# Bad - exposes secret
!`echo $API_KEY`
```

✅ **DO:** Sanitize user input:

```markdown
# Validate argument is a number
!`[[ "$0" =~ ^[0-9]+$ ]] && gh pr view $0 || echo "Invalid PR number"`
```

### 5. Output Formatting

✅ **DO:** Format output for readability:

```markdown
!`git log --oneline --graph -10`  # Formatted log
!`jq '.' config.json`  # Pretty JSON
!`df -h`  # Human-readable sizes
```

### 6. Combine with Tool Restrictions

✅ **DO:** Restrict tools when using dynamic context:

```yaml
---
allowed-tools: Bash(gh *), Bash(git *)
---

!`gh pr diff`
!`git status`
```

**Prevents:** Claude from running arbitrary bash commands after preprocessing.

## Platform Compatibility

### Claude Code

| Feature | Support |
|---------|---------|
| `` !`command` `` syntax | ✅ Full support |
| Shell command execution | ✅ Full support |
| String substitutions | ✅ Full support |
| Error handling | ✅ Full support |

### Other Platforms

**Cursor, Gemini CLI, Antigravity:**
- Check platform-specific documentation
- Dynamic context may not be supported
- Syntax may differ or be unavailable
- Test thoroughly on target platform

## Common Pitfalls

### 1. Slow Commands

❌ **Problem:**

```markdown
!`npm test`  # Takes 30 seconds
```

**Issue:** Blocks skill loading, poor user experience.

✅ **Solution:** Use fast commands or run tests separately.

### 2. Commands with Side Effects

❌ **Problem:**

```markdown
!`git commit -m "Auto commit"`
```

**Issue:** Every skill invocation creates a commit.

✅ **Solution:** Use read-only commands only.

### 3. Unquoted Arguments

❌ **Problem:**

```markdown
!`cat $ARGUMENTS`  # If argument has spaces: cat my file.txt
```

**Issue:** Breaks on arguments with spaces.

✅ **Solution:** Quote arguments:

```markdown
!`cat "$ARGUMENTS"`
```

### 4. Missing Error Handling

❌ **Problem:**

```markdown
!`gh pr view $0`  # Fails if gh not authenticated
```

**Issue:** Skill fails silently or shows confusing error.

✅ **Solution:** Add fallback:

```markdown
!`gh pr view $0 2>/dev/null || echo "Error: gh not authenticated or PR not found"`
```

### 5. Secret Exposure

❌ **Problem:**

```markdown
!`echo $DATABASE_PASSWORD`
```

**Issue:** Secrets visible in skill content.

✅ **Solution:** Never inject secrets. Use existence checks:

```markdown
!`echo "Database configured: ${DATABASE_PASSWORD:+YES}"`
```

## Troubleshooting

### Commands Not Executing

**Problem:** `` !`command` `` appears literally in output.

**Diagnosis:**
1. Check syntax is exactly `` !`command` `` (backticks, not quotes)
2. Verify platform supports dynamic context
3. Look for syntax errors in command

**Solution:**
```markdown
# Wrong
!'command'  # Single quotes
!`command'  # Mismatched quotes

# Correct
!`command`
```

### Command Fails Silently

**Problem:** No output from `` !`command` ``.

**Diagnosis:**
1. Run command manually to check for errors
2. Add error output redirection: `2>&1`
3. Check command is in PATH

**Solution:**
```markdown
# Debug version
!`command 2>&1 || echo "Command failed"`
```

### Unexpected Output Format

**Problem:** Command output doesn't format well.

**Diagnosis:**
1. Check if output has unwanted newlines or formatting
2. Test command output manually
3. Add formatting tools (jq, awk, sed)

**Solution:**
```markdown
# Format JSON
!`curl -s https://api.example.com | jq '.'`

# Format lines
!`git log --oneline -5`

# Remove extra whitespace
!`command | tr -s ' '`
```

## Related Documentation

- [Skills in Claude Code](../claude-code.md) - Complete skills reference
- [Subagent Integration](subagents-integration.md) - Skills with subagents
- [Tool Restrictions](tool-restrictions.md) - Controlling tool access
- [String Substitutions](../02-fundamentals/arguments-substitutions.md) - `$ARGUMENTS` syntax

## Further Reading

- **Official Documentation:** [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)
- **Shell Command Reference:** [GNU Bash Manual](https://www.gnu.org/software/bash/manual/)
- **GitHub CLI:** [cli.github.com](https://cli.github.com/)

---

**Last Updated:** February 2026
**Category:** Skills - Advanced
**Platform:** Claude Code
