# Tool Restrictions and Permissions

## Overview

Tool restrictions control what Claude can do when executing skills. By limiting available tools and setting appropriate permissions, you can create safe execution environments for specific tasks, prevent unintended modifications, and enforce security policies.

Claude Code provides two levels of tool control: **skill-level restrictions** (via `allowed-tools` frontmatter) and **system-level permissions** (via `/permissions` command). Understanding both mechanisms enables fine-grained control over Claude's capabilities.

## What Are Tool Restrictions?

Tool restrictions limit which tools Claude can use in specific contexts:

**Skill-level restrictions:**
- Defined in skill frontmatter using `allowed-tools` field
- Apply only when that skill is active
- Override system-level permissions for allowed tools
- Enable zero-friction workflows for trusted operations

**System-level permissions:**
- Configured via `/permissions` command
- Apply globally across all conversations
- Control which skills can be invoked
- Require user approval for restricted tools

## When to Use Tool Restrictions

### Use Skill-Level `allowed-tools` When:

- **Read-only operations** should never modify files
- **Specific tools required** for the task (and no others)
- **Trusted workflows** where friction would slow you down
- **Domain-specific tasks** with known tool requirements
- **Security-sensitive operations** need containment

**Examples:**
- Code exploration (Read, Grep, Glob only)
- API documentation generation (Read, Bash(curl *))
- Git analysis (Bash(git *) only)
- System diagnostics (Bash(systemctl *), Bash(journalctl *))

### Use System-Level Permissions When:

- **Blocking specific skills** entirely
- **Requiring approval** for dangerous operations
- **Enforcing security policies** across projects
- **Limiting Claude's autonomy** globally
- **Protecting against accidental execution**

**Examples:**
- Disable deployment skills in production
- Require approval for all file writes
- Block specific MCP tools
- Prevent skill invocation entirely

## Skill-Level Restrictions

### The `allowed-tools` Field

The `allowed-tools` frontmatter field specifies which tools Claude can use **without asking permission** when the skill is active.

**Syntax:**
```yaml
allowed-tools: Tool1, Tool2, Tool3(args)
```

**Effects:**
- Tools listed: Claude can use without permission
- Tools not listed: Claude must ask for permission
- Empty or omitted: Default behavior (all tools require permission)

### Basic Examples

**Read-only research:**
```yaml
---
name: code-explorer
description: Explore codebase without modifications
allowed-tools: Read, Grep, Glob
---

Explore the codebase to answer questions.
You can read files but cannot modify them.
```

**Git operations only:**
```yaml
---
name: git-analyzer
description: Analyze git history
allowed-tools: Bash(git *)
---

Analyze the git repository history.
```

**Web API access:**
```yaml
---
name: api-checker
description: Check API endpoint status
allowed-tools: Bash(curl *), Bash(jq *)
---

Check the health of all API endpoints.
```

### Tool Syntax Reference

| Syntax | Meaning | Example |
|--------|---------|---------|
| `ToolName` | Allow tool with any arguments | `Read` |
| `ToolName(arg)` | Allow tool with specific argument | `Bash(git status)` |
| `ToolName(prefix *)` | Allow tool with arguments starting with prefix | `Bash(gh *)` |
| `ToolName1, ToolName2` | Allow multiple tools | `Read, Grep, Glob` |

### Common Tool Patterns

**Read-only file access:**
```yaml
allowed-tools: Read, Grep, Glob
```

**Git operations:**
```yaml
allowed-tools: Bash(git *)
```

**GitHub CLI operations:**
```yaml
allowed-tools: Bash(gh *)
```

**Web requests:**
```yaml
allowed-tools: Bash(curl *), Bash(wget *)
```

**JSON processing:**
```yaml
allowed-tools: Bash(jq *), Bash(cat *)
```

**Docker operations:**
```yaml
allowed-tools: Bash(docker ps *), Bash(docker logs *)
```

**Kubernetes operations:**
```yaml
allowed-tools: Bash(kubectl get *), Bash(kubectl describe *)
```

**System monitoring:**
```yaml
allowed-tools: Bash(top *), Bash(ps *), Bash(netstat *)
```

### Advanced Patterns

**Multiple tool categories:**
```yaml
allowed-tools: Read, Grep, Glob, Bash(git *), Bash(gh *)
```

**Specific commands only:**
```yaml
allowed-tools: Bash(npm test), Bash(npm run lint)
```

**Tool combinations:**
```yaml
allowed-tools: Read, Bash(grep *), Bash(awk *), Bash(sed *)
```

## Complete Examples

### Example 1: Safe Code Review

Read-only review with no modification capability.

**.claude/skills/safe-review/SKILL.md:**
```yaml
---
name: safe-review
description: Review code changes without making modifications
allowed-tools: Read, Grep, Glob, Bash(git diff *), Bash(git log *)
context: fork
---

# Code Review Task

Review the recent changes in the codebase:

## Steps

1. **Check what changed**
   - Use git diff to see modifications
   - Use git log to see commit history

2. **Read modified files**
   - Use Read to examine changed files
   - Use Grep to find related code

3. **Analyze changes**
   - Code quality assessment
   - Security considerations
   - Performance implications
   - Test coverage

4. **Generate report**
   - Summary of changes
   - Issues identified
   - Recommendations
   - Specific file/line references

## Constraints

- You CANNOT modify files
- You CANNOT run tests
- You CANNOT commit changes
- You CAN ONLY read and analyze

Focus on thorough analysis and clear recommendations.
```

**Result:** Claude can explore code but cannot make changes.

### Example 2: API Documentation Generator

Controlled API access for documentation.

**.claude/skills/api-docs/SKILL.md:**
```yaml
---
name: api-docs
description: Generate API documentation from live endpoints
allowed-tools: Read, Bash(curl *), Bash(jq *)
context: fork
---

# API Documentation Generation

Generate comprehensive API documentation:

## Steps

1. **Read endpoint definitions**
   - Use Read to get route definitions
   - Identify all API endpoints

2. **Test endpoints**
   - Use curl to test each endpoint
   - Use jq to format JSON responses

3. **Document each endpoint**
   - HTTP method
   - URL path
   - Request parameters
   - Response format
   - Status codes
   - Example requests/responses

4. **Generate markdown**
   - Create structured documentation
   - Include usage examples
   - Add authentication details

## Allowed Operations

- Read source files ✅
- Make HTTP GET requests ✅
- Process JSON responses ✅
- Modify files ❌
- Execute application code ❌
```

**Usage:**
```
/api-docs
```

**Result:** Documentation generated using only allowed tools.

### Example 3: Database Query Analyzer

Restricted database access.

**.claude/skills/db-analyzer/SKILL.md:**
```yaml
---
name: db-analyzer
description: Analyze database queries without modifications
allowed-tools: Bash(psql -c "SELECT *"), Bash(psql -c "EXPLAIN *")
---

# Database Query Analyzer

Analyze database queries for performance:

## Allowed Queries

- SELECT statements only ✅
- EXPLAIN plans ✅
- INSERT/UPDATE/DELETE ❌
- DROP/TRUNCATE ❌
- CREATE/ALTER ❌

## Your Task

For $ARGUMENTS:

1. Run EXPLAIN to get query plan
2. Analyze execution time
3. Identify slow operations
4. Suggest optimizations
5. Check index usage

Provide specific, actionable recommendations.
```

**Result:** Can analyze queries but cannot modify data.

### Example 4: Deployment Validator

Controlled infrastructure checks.

**.claude/skills/validate-deployment/SKILL.md:**
```yaml
---
name: validate-deployment
description: Validate deployment readiness
argument-hint: [environment]
allowed-tools: Bash(kubectl get *), Bash(kubectl describe *), Bash(curl *)
context: fork
---

# Deployment Validation

Validate deployment to **$0** environment:

## Validation Steps

1. **Check pods status**
   ```bash
   kubectl get pods -n $0
   ```

2. **Verify services**
   ```bash
   kubectl get services -n $0
   ```

3. **Check pod details**
   ```bash
   kubectl describe pods -n $0
   ```

4. **Test health endpoints**
   ```bash
   curl https://$0.example.com/health
   ```

## Allowed Operations

- Get resource status ✅
- Describe resources ✅
- Test HTTP endpoints ✅
- Apply changes ❌
- Delete resources ❌
- Restart pods ❌

## Output

Provide GO/NO-GO decision with:
- All pods running? (yes/no)
- Services accessible? (yes/no)
- Health checks passing? (yes/no)
- Any warnings or errors? (list)
- Recommendation: GO or NO-GO
```

**Usage:**
```
/validate-deployment staging
```

**Result:** Deployment validated using read-only operations.

### Example 5: Log Analyzer

Restricted log access.

**.claude/skills/analyze-logs/SKILL.md:**
```yaml
---
name: analyze-logs
description: Analyze application logs for issues
allowed-tools: Bash(tail *), Bash(grep *), Bash(awk *), Bash(journalctl *)
context: fork
---

# Log Analysis

Analyze application logs for issues:

## Steps

1. **Get recent logs**
   - Application logs: `tail -1000 /var/log/app.log`
   - System logs: `journalctl -n 500`

2. **Search for errors**
   - Use grep to find ERROR/WARN/CRITICAL
   - Use awk to extract timestamps

3. **Identify patterns**
   - Recurring errors
   - Time-based patterns
   - Correlation between events

4. **Analyze impact**
   - Affected components
   - User impact
   - Performance degradation

## Output Format

```
## Summary
[Brief overview]

## Errors Found
- Error 1 (count, first seen, last seen)
- Error 2 (count, first seen, last seen)

## Patterns
[Describe patterns]

## Recommendations
[Specific actions]
```

## Allowed Operations

- Read logs ✅
- Search logs ✅
- Process logs ✅
- Delete logs ❌
- Modify logs ❌
- Restart services ❌
```

**Usage:**
```
/analyze-logs
```

**Result:** Comprehensive log analysis without system modifications.

## System-Level Permissions

### The `/permissions` Command

Control global tool and skill access via the `/permissions` command.

**View current permissions:**
```
/permissions
```

**Modify permissions:**
```
# Enable all tools
/permissions

# In the editor, configure permissions
```

### Permission Syntax

**Deny all skills:**
```
Skill
```

**Allow specific skills only:**
```
Skill(commit)
Skill(review *)
```

**Deny specific skills:**
```
Skill(deploy *)
Skill(delete-*)
```

**Deny specific tools:**
```
Write
Bash(rm *)
Bash(git push *)
```

**Require approval for tools:**
```
# Default behavior - user must approve each tool use
```

### Common Permission Patterns

**Read-only mode (global):**
```
Write
Edit
Bash(*)
```

**Block deployments:**
```
Skill(deploy)
Skill(deploy-*)
Skill(*-deploy)
```

**Block destructive operations:**
```
Bash(rm *)
Bash(git push --force)
Bash(kubectl delete *)
```

**Allow only safe skills:**
```
Skill  # Deny all
Skill(review *)  # Allow review skills
Skill(analyze *)  # Allow analysis skills
```

## Interaction Between Levels

### Priority Rules

1. **`allowed-tools` overrides system permissions** for listed tools
2. **System permissions apply** to tools not in `allowed-tools`
3. **Skill denial** prevents skill invocation entirely

### Example Interaction

**System permissions:**
```
Bash(*)  # All bash commands require approval
```

**Skill with `allowed-tools`:**
```yaml
---
allowed-tools: Bash(git status), Bash(git diff)
---
```

**Result:**
- `git status` and `git diff`: No approval needed (skill allows them)
- Other bash commands: Approval required (system default)

## Best Practices

### 1. Principle of Least Privilege

✅ **DO:** Grant minimum tools needed:

```yaml
# Only what's needed for the task
allowed-tools: Read, Grep, Glob
```

❌ **DON'T:** Grant broad access:

```yaml
# Too permissive
allowed-tools: Read, Write, Edit, Bash(*)
```

### 2. Specific Tool Patterns

✅ **DO:** Use specific patterns:

```yaml
allowed-tools: Bash(git status), Bash(git log *), Bash(git diff *)
```

❌ **DON'T:** Use wildcards unnecessarily:

```yaml
allowed-tools: Bash(git *)  # Too broad, allows git push, git reset, etc.
```

### 3. Document Restrictions

✅ **DO:** Explain why tools are restricted:

```yaml
---
allowed-tools: Read, Grep, Glob
---

# Read-Only Code Explorer

You can explore the codebase but cannot modify files.
This ensures safe exploration without accidental changes.
```

### 4. Test Tool Restrictions

✅ **DO:** Test that restrictions work:

```
# Invoke skill
/safe-review

# Try restricted operation
"Can you fix this bug?"
# Should fail or ask permission
```

### 5. Combine with Context Fork

✅ **DO:** Use restrictions in isolated contexts:

```yaml
---
context: fork
allowed-tools: Read, Grep
---

Research task in isolated, read-only environment.
```

### 6. Security-Sensitive Skills

✅ **DO:** Restrict dangerous operations:

```yaml
---
name: production-deploy
allowed-tools: Bash(kubectl apply *), Bash(kubectl rollout status *)
disable-model-invocation: true
---

Controlled deployment with specific allowed operations.
```

❌ **DON'T:** Allow unrestricted access:

```yaml
# Dangerous for production deployment
allowed-tools: Bash(*)
```

## Platform Compatibility

### Claude Code

| Feature | Support |
|---------|---------|
| `allowed-tools` field | ✅ Full support |
| Tool-specific patterns | ✅ Full support |
| System permissions | ✅ Full support |
| Skill permissions | ✅ Full support |

### Other Platforms

**Cursor, Gemini CLI, Antigravity:**
- Tool restriction support varies by platform
- Check platform-specific documentation
- Some platforms may not support `allowed-tools`
- Permission systems may differ

## Common Pitfalls

### 1. Overly Permissive Patterns

❌ **Problem:**

```yaml
allowed-tools: Bash(*)
```

**Issue:** Allows any bash command, including destructive operations.

✅ **Solution:** Be specific:

```yaml
allowed-tools: Bash(git status), Bash(git log *), Bash(git diff *)
```

### 2. Forgetting Tool Prefixes

❌ **Problem:**

```yaml
allowed-tools: git status  # Wrong
```

**Issue:** Must include tool name.

✅ **Solution:**

```yaml
allowed-tools: Bash(git status)
```

### 3. Conflicting Restrictions

❌ **Problem:**

```yaml
allowed-tools: Read, Write
```

**Skill says:** "You cannot modify files"

**Issue:** Allowed tools conflict with instructions.

✅ **Solution:** Align tools with instructions:

```yaml
allowed-tools: Read, Grep, Glob
```

Instructions: "Explore code without modifications."

### 4. Missing Required Tools

❌ **Problem:**

```yaml
allowed-tools: Read
```

**Skill needs:** Grep to search files.

**Issue:** Task fails due to missing tool.

✅ **Solution:** Include all required tools:

```yaml
allowed-tools: Read, Grep, Glob
```

## Troubleshooting

### Skill Fails with Permission Error

**Problem:** Skill reports it cannot use a tool.

**Diagnosis:**
1. Check if tool is in `allowed-tools`
2. Verify tool pattern matches actual usage
3. Check system-level permissions

**Solution:**
```yaml
# Add missing tool
allowed-tools: Read, Grep, Glob, Bash(git log *)
```

### Tool Pattern Not Matching

**Problem:** `Bash(git *)` doesn't allow `git status`.

**Diagnosis:**
1. Verify pattern syntax
2. Check for typos
3. Test pattern manually

**Solution:**
```yaml
# Correct pattern
allowed-tools: Bash(git *)

# Verify it matches
# "git status" -> Matches "git *" ✅
```

### System Permissions Override Skill

**Problem:** Skill allows tool, but system denies it.

**Diagnosis:**
1. Check `/permissions` settings
2. Look for global denies

**Solution:**
```
/permissions

# Remove global deny for the tool
# OR add skill-specific allow
```

## Related Documentation

- [Skills in Claude Code](../claude-code.md) - Complete skills reference
- [Subagent Integration](subagents-integration.md) - Skills with subagents
- [Dynamic Context](dynamic-context.md) - Command injection
- [Security Best Practices](../../../guidelines/team-conventions/third-party-security-guidelines.md)

## Further Reading

- **Official Documentation:** [code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)
- **Permissions Guide:** [code.claude.com/docs/en/permissions](https://code.claude.com/docs/en/permissions)
- **Security Best Practices:** [Least Privilege Principle](https://en.wikipedia.org/wiki/Principle_of_least_privilege)

---

**Last Updated:** February 2026
**Category:** Skills - Advanced
**Platform:** Claude Code
