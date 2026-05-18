---
name: lidr-hook-development
id: hook-development
version: "2.3.0"
last_updated: "2026-03-25"
updated_by: "TL: tier3-remediation"
status: active
phase: 0
owner_role: "TL"
automation: false
domain_agnostic: true
description: >
  Design and implement Claude Code hooks for event-driven workflow automation: quality gates, security guards, session context loading, and DTC validation.
  Domain-agnostic — works for any SDLC workflow automation regardless of industry or tech stack.
  Use for creating PreToolUse/PostToolUse/Stop/SessionStart hooks, security guards, automated quality enforcement.
  Essential when a quality or security check must be enforced automatically on every relevant AI action.
  Always use when creating event-driven workflows, always use when setting up automated guards for sensitive data or compliance requirements.
  Do NOT use for slash command creation (use command-development), for skill creation (use skill-development), or for one-time checks that don't need automation.
  Triggers on "hooks", "PreToolUse", "PostToolUse", "Stop", "SessionStart", "DTC validation", "security scanning", "workflow automation", "write guard", "session hook".
  Output in English (hook scripts), team language (documentation).
  Audience: Tech Lead (creates hooks), Developer (relies on hook enforcement), Security (validates hook coverage).
---

# Hook Development: Essential Claude Code Automation

## Why Hooks are Critical for SDLC Quality

**Hooks are your automated quality gates** — essential for sensitive data protection, compliance enforcement, and security-first development. Teams handling regulated data require zero-tolerance automation.

**Core use cases:**

- **NEVER log sensitive data** — PreToolUse hooks block accidental PII/secrets exposure
- **Enforce compliance requirements** — Auto-validate consent mechanisms and data minimization
- **Security gate automation** — Stop hooks ensure security checklists before deploy
- **DTC validation** — Write guards ensure docs travel with code changes
- **Context loading** — SessionStart hooks inject project rules and compliance frameworks

**Essential for regulated environments:** Manual validation is error-prone. Hooks ensure consistent enforcement of security and quality requirements across all development workflows.

> **Domain note**: Examples below use a security-sensitive tech context. Replace with your project's specific compliance and quality requirements when implementing hooks.

## Hook Types for Security-First Development

### Prompt-Based Hooks (Essential for Complex Validation)

**Always use for sensitive data protection** — LLM reasoning detects complex policy violations that regex cannot catch:

```json
{
  "type": "prompt",
  "prompt": "CRITICAL: Evaluate if this operation violates the project's data protection policy. Check for: sensitive data in logs, PII exposure, missing consent mechanisms, data minimization violations. BLOCK if any violation detected. $TOOL_INPUT",
  "timeout": 30
}
```

**Supported events:** PreToolUse, Stop, SubagentStop, UserPromptSubmit

**Why prompt-based hooks excel for security-sensitive projects:**

- **Semantic understanding** — Detects "user payment_token" vs safe "user display_name"
- **Contextual privacy** — Understands when consent or authorization is required vs optional
- **Regulatory compliance** — Applies GDPR, HIPAA, PCI-DSS rules intelligently based on context
- **False positive reduction** — Distinguishes synthetic test data from real sensitive data

### Command Hooks (Performance-Critical Security)

**Use for fast, deterministic security validations** that must execute in <100ms:

```json
{
  "type": "command",
  "command": "bash ${CLAUDE_PLUGIN_ROOT}/scripts/security-scan.sh",
  "timeout": 10
}
```

**Common use cases:**

- **Secret detection** — Fast regex scan for API keys, tokens, credentials
- **File path validation** — Block path traversal, writes to sensitive directories
- **Dependency scanning** — Validate new packages against security whitelist
- **Build artifact checks** — Ensure no test data or debug credentials in production builds

## Hook Configuration Formats

### Plugin hooks.json Format

**For plugin hooks** in `hooks/hooks.json`, use wrapper format:

```json
{
  "description": "Brief explanation of hooks (optional)",
  "hooks": {
    "PreToolUse": [...],
    "Stop": [...],
    "SessionStart": [...]
  }
}
```

**Key points:**

- `description` field is optional
- `hooks` field is required wrapper containing actual hook events
- This is the **plugin-specific format**

**Example:**

```json
{
  "description": "Validation hooks for code quality",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/validate.sh"
          }
        ]
      }
    ]
  }
}
```

### Settings Format (Direct)

**For user settings** in `.claude/settings.json`, use direct format:

```json
{
  "PreToolUse": [...],
  "Stop": [...],
  "SessionStart": [...]
}
```

**Key points:**

- No wrapper - events directly at top level
- No description field
- This is the **settings format**

**Important:** The examples below show the hook event structure that goes inside either format. For plugin hooks.json, wrap these in `{"hooks": {...}}`.

## Hook Events

### PreToolUse

Execute before any tool runs. Use to approve, deny, or modify tool calls.

**Sensitive Data Protection Hook:**

```json
{
  "PreToolUse": [
    {
      "matcher": "Write|Edit|Bash",
      "hooks": [
        {
          "type": "prompt",
          "prompt": "SENSITIVE DATA GUARD: Analyze this operation for data protection violations. BLOCK if: 1) Logging API keys, tokens, or user credentials 2) Storing sensitive data unencrypted 3) Processing regulated data without documented consent 4) Transmitting sensitive data without TLS 1.2+ 5) Missing compliance markers required by project policy. Context: $TOOL_INPUT. Return: 'approve', 'deny', or 'ask' with policy reference.",
          "timeout": 45
        }
      ]
    }
  ]
}
```

**Output for PreToolUse:**

```json
{
  "hookSpecificOutput": {
    "permissionDecision": "allow|deny|ask",
    "updatedInput": { "field": "modified_value" }
  },
  "systemMessage": "Explanation for Claude"
}
```

### PostToolUse

Execute after tool completes. Use to react to results, provide feedback, or log.

**DTC (Docs Travel with Code) Enforcement Hook:**

```json
{
  "PostToolUse": [
    {
      "matcher": "Edit|Write",
      "hooks": [
        {
          "type": "prompt",
          "prompt": "DTC VALIDATION: Code changed but docs may be stale. Check if this edit impacts: API contracts (update OpenAPI), database schema (update ERD), algorithms (update security analysis), UI components (update design specs). If docs need updates, generate list. Context: $TOOL_RESULT",
          "timeout": 30
        }
      ]
    }
  ]
}
```

**Output behavior:**

- Exit 0: stdout shown in transcript
- Exit 2: stderr fed back to Claude
- systemMessage included in context

### Stop

Execute when main agent considers stopping. Use to validate completeness.

**Security Gate Validation Hook:**

```json
{
  "Stop": [
    {
      "matcher": "*",
      "hooks": [
        {
          "type": "prompt",
          "prompt": "SECURITY GATE CHECK: Before stopping, verify security compliance: 1) SAST scan completed (0 high/critical vulns) 2) No hardcoded credentials or test tokens 3) Encryption keys rotated if needed 4) Compliance requirements verified 5) Security sign-off obtained if touching sensitive data or regulated systems. BLOCK until all security gates pass. Context: $REASON",
          "timeout": 60
        }
      ]
    }
  ]
}
```

**Decision output:**

```json
{
  "decision": "approve|block",
  "reason": "Explanation",
  "systemMessage": "Additional context"
}
```

### SubagentStop

Execute when subagent considers stopping. Use to ensure subagent completed its task.

Similar to Stop hook, but for subagents.

### UserPromptSubmit

Execute when user submits a prompt. Use to add context, validate, or block prompts.

**Sensitive Domain Context Injection Hook:**

```json
{
  "UserPromptSubmit": [
    {
      "matcher": "*",
      "hooks": [
        {
          "type": "prompt",
          "prompt": "COMPLIANCE CONTEXT ADVISOR: If the user's prompt involves processing regulated or sensitive data (payment data, health records, personal credentials, financial transactions), inject critical reminders: applicable compliance requirements, explicit consent/authorization needed, data minimization mandatory, security review required. Add relevant project security policy rules. User prompt: $USER_PROMPT",
          "timeout": 20
        }
      ]
    }
  ]
}
```

### SessionStart

Execute when Claude Code session begins. Use to load context and set environment.

**Project Security Context Loader:**

```json
{
  "SessionStart": [
    {
      "matcher": "*",
      "hooks": [
        {
          "type": "command",
          "command": "bash ${CLAUDE_PLUGIN_ROOT}/scripts/load-project-context.sh",
          "timeout": 15
        }
      ]
    }
  ]
}
```

**Critical environment injection for security-sensitive projects:**

```bash
#!/bin/bash
# load-project-context.sh
echo "export PROJECT_TYPE=regulated" >> "$CLAUDE_ENV_FILE"
echo "export COMPLIANCE_REQUIRED=true" >> "$CLAUDE_ENV_FILE"
echo "export SECURITY_LEVEL=high" >> "$CLAUDE_ENV_FILE"
echo "export DTC_ACTIVE=true" >> "$CLAUDE_ENV_FILE"
echo "export PII_PROTECTION_MODE=strict" >> "$CLAUDE_ENV_FILE"

# Load project-specific security policy rules
cat "${CLAUDE_PLUGIN_ROOT}/config/security-policy-rules.txt" >> "$CLAUDE_ENV_FILE"
```

**Environment variables auto-injected in every development session for consistent policy enforcement.**

### SessionEnd

Execute when session ends. Use for cleanup, logging, and state preservation.

### PreCompact

Execute before context compaction. Use to add critical information to preserve.

### Notification

Execute when Claude sends notifications. Use to react to user notifications.

## Hook Output Format

### Standard Output (All Hooks)

```json
{
  "continue": true,
  "suppressOutput": false,
  "systemMessage": "Message for Claude"
}
```

- `continue`: If false, halt processing (default true)
- `suppressOutput`: Hide output from transcript (default false)
- `systemMessage`: Message shown to Claude

### Exit Codes

- `0` - Success (stdout shown in transcript)
- `2` - Blocking error (stderr fed back to Claude)
- Other - Non-blocking error

## Hook Input Format

All hooks receive JSON via stdin with common fields:

```json
{
  "session_id": "abc123",
  "transcript_path": "/path/to/transcript.txt",
  "cwd": "/current/working/dir",
  "permission_mode": "ask|allow",
  "hook_event_name": "PreToolUse"
}
```

**Event-specific fields:**

- **PreToolUse/PostToolUse:** `tool_name`, `tool_input`, `tool_result`
- **UserPromptSubmit:** `user_prompt`
- **Stop/SubagentStop:** `reason`

Access fields in prompts using `$TOOL_INPUT`, `$TOOL_RESULT`, `$USER_PROMPT`, etc.

## Environment Variables

Available in all command hooks:

- `$CLAUDE_PROJECT_DIR` - Project root path
- `$CLAUDE_PLUGIN_ROOT` - Plugin directory (use for portable paths)
- `$CLAUDE_ENV_FILE` - SessionStart only: persist env vars here
- `$CLAUDE_CODE_REMOTE` - Set if running in remote context

**Always use ${CLAUDE_PLUGIN_ROOT} in hook commands for portability:**

```json
{
  "type": "command",
  "command": "bash ${CLAUDE_PLUGIN_ROOT}/scripts/validate.sh"
}
```

## Plugin Hook Configuration

In plugins, define hooks in `hooks/hooks.json`:

```json
{
  "PreToolUse": [
    {
      "matcher": "Write|Edit",
      "hooks": [
        {
          "type": "prompt",
          "prompt": "Validate file write safety"
        }
      ]
    }
  ],
  "Stop": [
    {
      "matcher": "*",
      "hooks": [
        {
          "type": "prompt",
          "prompt": "Verify task completion"
        }
      ]
    }
  ],
  "SessionStart": [
    {
      "matcher": "*",
      "hooks": [
        {
          "type": "command",
          "command": "bash ${CLAUDE_PLUGIN_ROOT}/scripts/load-context.sh",
          "timeout": 10
        }
      ]
    }
  ]
}
```

Plugin hooks merge with user's hooks and run in parallel.

## Matchers

### Tool Name Matching

**Exact match:**

```json
"matcher": "Write"
```

**Multiple tools:**

```json
"matcher": "Read|Write|Edit"
```

**Wildcard (all tools):**

```json
"matcher": "*"
```

**Regex patterns:**

```json
"matcher": "mcp__.*__delete.*"
```

**Note:** Matchers are case-sensitive.

### Common Patterns

```javascript
// All MCP tools
"matcher": "mcp__.*"

// Specific plugin's MCP tools
"matcher": "mcp__plugin_asana_.*"

// All file operations
"matcher": "Read|Write|Edit"

// Bash commands only
"matcher": "Bash"
```

## Security Best Practices

### Input Validation

Always validate inputs in command hooks:

```bash
#!/bin/bash
set -euo pipefail

input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name')

# Validate tool name format
if [[ ! "$tool_name" =~ ^[a-zA-Z0-9_]+$ ]]; then
  echo '{"decision": "deny", "reason": "Invalid tool name"}' >&2
  exit 2
fi
```

### Sensitive Data Protection

**Essential patterns for any project handling regulated or sensitive data** — prevent accidental credential and PII exposure:

```bash
#!/bin/bash
# sensitive-data-guard.sh
set -euo pipefail

input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')
content=$(echo "$input" | jq -r '.tool_input.content // empty')

# Block credential and token patterns
if echo "$content" | grep -iE "(api_key|secret_key|auth_token|private_key|password_hash)" > /dev/null; then
  echo '{"decision": "deny", "reason": "Security policy violation: credential or token detected in file content"}' >&2
  exit 2
fi

# Block PII logging patterns
if echo "$content" | grep -iE "(console\.log.*userId|logger\.info.*email|print.*credit_card)" > /dev/null; then
  echo '{"decision": "deny", "reason": "PII logging detected - violates data minimization policy"}' >&2
  exit 2
fi

# Block writes to sensitive directories
case "$file_path" in
  */secrets/* | */credentials/* | */user-data/*)
    echo '{"decision": "deny", "reason": "Writing to sensitive directory requires security review"}' >&2
    exit 2
    ;;
esac

# Approve if no violations
echo '{"decision": "approve", "reason": "No sensitive data protection violations detected"}'
```

**Adapt the patterns above to your project's specific sensitive data types.** For domain-specific examples (identity verification data, healthcare records, financial PII), see `examples/client-domain-example.md`.

### Quote All Variables

```bash
# GOOD: Quoted
echo "$file_path"
cd "$CLAUDE_PROJECT_DIR"

# BAD: Unquoted (injection risk)
echo $file_path
cd $CLAUDE_PROJECT_DIR
```

### Set Appropriate Timeouts

```json
{
  "type": "command",
  "command": "bash script.sh",
  "timeout": 10
}
```

**Defaults:** Command hooks (60s), Prompt hooks (30s)

## Performance Considerations

### Parallel Execution

All matching hooks run **in parallel**:

```json
{
  "PreToolUse": [
    {
      "matcher": "Write",
      "hooks": [
        { "type": "command", "command": "check1.sh" },
        { "type": "command", "command": "check2.sh" },
        { "type": "prompt", "prompt": "Validate..." }
      ]
    }
  ]
}
```

**Design implications:**

- Hooks don't see each other's output
- Non-deterministic ordering
- Design for independence

### Optimization

1. Use command hooks for quick deterministic checks
2. Use prompt hooks for complex reasoning
3. Cache validation results in temp files
4. Minimize I/O in hot paths

## Production vs Development Hook Strategies

**Critical**: Projects handling sensitive data need different hook strictness by environment.

### Production Mode Hooks (Zero Tolerance)

```bash
#!/bin/bash
# production-guard.sh
input=$(cat)
ENVIRONMENT=$(echo "$input" | jq -r '.environment // "development"')
content=$(echo "$input" | jq -r '.tool_input.content // empty')

if [[ "$ENVIRONMENT" == "production" || -f "$CLAUDE_PROJECT_DIR/.production-mode" ]]; then
  # ZERO TOLERANCE in production
  if echo "$content" | grep -iE "(test_token|sample_key|debug_credential)" > /dev/null; then
    echo '{"decision": "deny", "reason": "Test credentials BLOCKED in production"}' >&2
    exit 2
  fi
fi
```

### Development Mode Hooks (Configurable Strictness)

```bash
#!/bin/bash
# development-helper.sh
STRICT_MODE=$(jq -r '.security.strictMode // false' "$CLAUDE_PROJECT_DIR/.claude/project-config.json")

if [[ "$STRICT_MODE" == "true" ]]; then
  # Enable all security validations
  : # ... full compliance checks ...
else
  # Relaxed mode for development
  echo '{"systemMessage": "Development mode: Relaxed security validations"}'
fi
```

### Security Review Auto-Trigger

```bash
#!/bin/bash
# security-review-trigger.sh
input=$(cat)
content=$(echo "$input" | jq -r '.tool_input.content // empty')

# Automatically trigger security review for sensitive changes
if echo "$content" | grep -iE "(encrypt|process.*pii|payment.*data|auth.*token)" > /dev/null; then
  echo '{"systemMessage": "SECURITY REVIEW REQUIRED: sensitive data processing changes detected. Auto-assigning to security reviewer."}'
  # Could integrate with Jira/GitHub to auto-assign security reviewer
fi
```

**Hook activation patterns:**

- **`.production-mode`** file → Enable zero-tolerance production guards
- **`.security-review-mode`** file → Auto-assign security reviewer for sensitive changes
- **`project-config.json`** → Configure validation strictness levels per environment

## Hook Lifecycle and Limitations

### Hooks Load at Session Start

**Important:** Hooks are loaded when Claude Code session starts. Changes to hook configuration require restarting Claude Code.

**Cannot hot-swap hooks:**

- Editing `hooks/hooks.json` won't affect current session
- Adding new hook scripts won't be recognized
- Changing hook commands/prompts won't update
- Must restart Claude Code: exit and run `claude` again

**To test hook changes:**

1. Edit hook configuration or scripts
2. Exit Claude Code session
3. Restart: `claude` or `cc`
4. New hook configuration loads
5. Test hooks with `claude --debug`

### Hook Validation at Startup

Hooks are validated when Claude Code starts:

- Invalid JSON in hooks.json causes loading failure
- Missing scripts cause warnings
- Syntax errors reported in debug mode

Use `/hooks` command to review loaded hooks in current session.

## Debugging Hooks

### Enable Debug Mode

```bash
claude --debug
```

Look for hook registration, execution logs, input/output JSON, and timing information.

### Test Hook Scripts

Test command hooks directly:

```bash
echo '{"tool_name": "Write", "tool_input": {"file_path": "/test"}}' | \
  bash ${CLAUDE_PLUGIN_ROOT}/scripts/validate.sh

echo "Exit code: $?"
```

### Validate JSON Output

Ensure hooks output valid JSON:

```bash
output=$(./your-hook.sh < test-input.json)
echo "$output" | jq .
```

## Quick Reference

### Hook Events Summary

| Event            | When           | Use For                  |
| ---------------- | -------------- | ------------------------ |
| PreToolUse       | Before tool    | Validation, modification |
| PostToolUse      | After tool     | Feedback, logging        |
| UserPromptSubmit | User input     | Context, validation      |
| Stop             | Agent stopping | Completeness check       |
| SubagentStop     | Subagent done  | Task validation          |
| SessionStart     | Session begins | Context loading          |
| SessionEnd       | Session ends   | Cleanup, logging         |
| PreCompact       | Before compact | Preserve context         |
| Notification     | User notified  | Logging, reactions       |

### Best Practices

**DO:**

- ✅ Use prompt-based hooks for complex logic
- ✅ Use ${CLAUDE_PLUGIN_ROOT} for portability
- ✅ Validate all inputs in command hooks
- ✅ Quote all bash variables
- ✅ Set appropriate timeouts
- ✅ Return structured JSON output
- ✅ Test hooks thoroughly

**DON'T:**

- ❌ Use hardcoded paths
- ❌ Trust user input without validation
- ❌ Create long-running hooks (>60s timeout)
- ❌ Rely on hook execution order
- ❌ Log sensitive data, PII, or credentials
- ❌ Skip security hooks for "quick fixes"
- ❌ Allow operations on regulated data without compliance checks
- ❌ Deploy to production without zero-tolerance security guards

## Additional Resources

### Reference Files

For detailed patterns and advanced techniques, consult:

- **`references/patterns.md`** - Common hook patterns (8+ proven patterns)
- **`references/migration.md`** - Migrating from basic to advanced hooks
- **`references/advanced.md`** - Advanced use cases and techniques

### Example Hook Scripts

Working examples in `examples/`:

- **`validate-write.sh`** - File write validation example
- **`validate-bash.sh`** - Bash command validation example
- **`load-context.sh`** - SessionStart context loading example

### Utility Scripts

Development tools in `scripts/`:

- **`validate-hook-schema.sh`** - Validate hooks.json structure and syntax
- **`test-hook.sh`** - Test hooks with sample input before deployment
- **`hook-linter.sh`** - Check hook scripts for common issues and best practices

### Additional Resources

- **Security Rules**: `docs/standards/org.md` — compliance requirements for your organization
- **Hook Strategy**: `docs/standards/hooks-strategy.md` — hook deployment guide
- **DTC Guidelines**: `docs/checklists/dod.md` — Docs Travel with Code enforcement
- **Testing Framework**: Use `claude --debug` for hook execution logs
- **Validation Tools**: `jq` for JSON validation + project-specific security linters
- **Domain examples**: `examples/client-domain-example.md` — domain-specific hook patterns for regulated identity verification

## Hook Implementation Strategy

**Essential workflow for automated security and quality enforcement:**

### Phase 1: Security Foundation (Must Do First)

1. **Deploy sensitive data protection hooks** — PreToolUse guards against PII/credential logging
2. **Configure environment context** — SessionStart loads compliance policy rules
3. **Set up security gates** — Stop hooks enforce security checklist completion
4. **Enable DTC validation** — PostToolUse ensures docs stay synced with code changes

### Phase 2: Quality Gates Automation

1. **Add SAST/DAST integration** — PostToolUse hooks parse security scan results
2. **Implement test coverage gates** — Stop hooks block deploys without adequate testing
3. **Set up dependency scanning** — PreToolUse hooks validate new packages against security whitelist
4. **Configure compliance reporting** — Stop hooks generate compliance audit reports

### Phase 3: Advanced Workflow Automation

1. **Auto-assign security reviews** — UserPromptSubmit detects sensitive topics, routes to reviewer
2. **Dynamic security policies** — Environment-specific hook activation (prod vs dev)
3. **Audit trail automation** — All hooks log decisions for compliance auditing
4. **Integration triggers** — Hooks spawn external security tools (Snyk, OWASP ZAP)

### Critical Implementation Steps

```bash
# 1. Create hooks structure
mkdir -p hooks/scripts
mkdir -p hooks/config

# 2. Deploy core security hooks (non-negotiable)
cp sensitive-data-guard.sh hooks/scripts/
cp security-gate-check.sh hooks/scripts/
cp dtc-validation.sh hooks/scripts/

# 3. Configure environment-specific activation
echo '{"security": {"strictMode": true, "environment": "production"}}' > .claude/project-config.json

# 4. Test hook activation
claude --debug  # Verify hooks activate on relevant operations

# 5. Document for team
echo "SECURITY PROTECTION: All hooks mandatory for compliance" > hooks/README.md
```

**Never deploy code handling sensitive or regulated data without these security hooks active.**

## Real-World Hook Examples

### 1. Complete API Security Protection Hook

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit|Bash",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "API SECURITY PROTECTION: Analyze for violations: 1) Applicable compliance requirements (GDPR, HIPAA, PCI-DSS per project) 2) API key or token exposure 3) Credential or secret logging 4) Unencrypted sensitive data storage 5) Missing authorization checks 6) PII transmission without TLS. BLOCK any violation. Include policy reference in denial. $TOOL_INPUT",
            "timeout": 45
          }
        ]
      }
    ]
  }
}
```

### 2. SAST/DAST Integration Hook

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash ${CLAUDE_PLUGIN_ROOT}/scripts/parse-sast-results.sh",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

### 3. Production Deployment Gate

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "PRODUCTION DEPLOYMENT GATE: MANDATORY CHECKS: ✅ SAST scan 0 critical/high vulns ✅ DAST completed ✅ Sensitive data encryption verified ✅ Compliance requirements documented ✅ Security sign-off obtained ✅ Penetration test passed (if applicable) ✅ No test credentials in production build ✅ Audit trail configured. BLOCK deployment until ALL checks pass. $REASON",
            "timeout": 90
          }
        ]
      }
    ]
  }
}
```

---

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- Claude Code hook development and workflow automation compliance patterns
- Progressive disclosure adherence
- Resource organization standards

**When to use:**

- Before skill release/packaging
- In CI/CD pipeline (quality gates)
- After major example updates
- During skill maintenance cycles

**Integration with ecosystem:**

- Used by `/multi-agent-audit` for ecosystem validation
- Supports quality gates in SDLC workflow
- Provides consistent validation across all skills

## Changelog

| Version | Date       | Author                | Changes                                                                                                                            |
| ------- | ---------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 2.3.0   | 2026-03-25 | TL: tier3-remediation | Domain-agnostic normalization: moved domain-specific patterns to examples/client-domain-example.md. Genericized all hook examples. |
| 2.2.0   | 2026-03-16 | Tech Lead: System     | Added Quality Assurance section with validation framework                                                                          |
| 2.0.0   | 2026-03-09 | Claude Agent          | Complete rewrite with security-focused hook examples, DTC validation, security gate automation                                     |
| 1.0.0   | 2024-12-01 | Tech Lead             | Initial generic hook development guide                                                                                             |
