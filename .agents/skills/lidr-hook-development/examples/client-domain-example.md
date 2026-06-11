---
id: hook-development-{{CLIENT_CODE}}-example
version: "1.0.0"
last_updated: "2026-03-25"
updated_by: "TL: tier3-remediation"
status: active
type: example
domain: biometric-identity
---

# {{CLIENT_NAME}} Domain Example: Biometric Hook Patterns

> **Purpose**: This file contains {{CLIENT_NAME}}/biometric-specific hook examples extracted from the main SKILL.md during domain-agnostic normalization.
> **Audience**: Teams working on biometric identity verification platforms ({{CLIENT_NAME}} or equivalent) subject to GDPR Art. 9, PSD2, and eIDAS.
> **Main skill**: See `../SKILL.md` for the generic, reusable hook development guide.

---

## Why Prompt-Based Hooks Are Critical for Biometric Projects

LLM reasoning detects complex privacy violations that regex cannot catch:

```json
{
  "type": "prompt",
  "prompt": "CRITICAL: Evaluate if this operation violates GDPR Art. 9 biometric data protection. Check for: biometric templates in logs, PII exposure, explicit consent mechanisms missing, data minimization violations. BLOCK if any violation detected. $TOOL_INPUT",
  "timeout": 30
}
```

**Why prompt-based hooks are mandatory for {{CLIENT_NAME}}**:

- **Semantic understanding**: Detects "user facial template" vs safe "user ID"
- **Contextual privacy**: Understands when GDPR consent is required vs optional
- **Regulatory compliance**: Applies GDPR, eIDAS, PSD2 rules intelligently
- **False positive reduction**: Distinguishes biometric test data from real sensitive data

---

## Biometric Data Protection Hook (PreToolUse)

```json
{
  "PreToolUse": [
    {
      "matcher": "Write|Edit|Bash",
      "hooks": [
        {
          "type": "prompt",
          "prompt": "BIOMETRIC GUARD: Analyze this operation for GDPR Art. 9 violations. BLOCK if: 1) Logging facial templates, fingerprint vectors, voice prints 2) Storing biometric data unencrypted 3) Processing biometric data without explicit consent 4) Transmitting biometric data without TLS 1.2+ 5) Missing GDPR compliance markers. Context: $TOOL_INPUT. Return: 'approve', 'deny', or 'ask' with GDPR citation.",
          "timeout": 45
        }
      ]
    }
  ]
}
```

---

## {{CLIENT_NAME}} Sensitive Data Protection Script

```bash
#!/bin/bash
# biometric-protection.sh — Deploy on ALL {{CLIENT_NAME}} projects (mandatory for GDPR Art. 9)
set -euo pipefail

input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')
content=$(echo "$input" | jq -r '.tool_input.content // empty')

# Block biometric template patterns
if echo "$content" | grep -iE "(facial_template|fingerprint_vector|voice_print|biometric_hash|template_data)" > /dev/null; then
  echo '{"decision": "deny", "reason": "GDPR Art. 9 violation: biometric template detected in file content"}' >&2
  exit 2
fi

# Block PII logging patterns
if echo "$content" | grep -iE "(console\.log.*userId|logger.*biometric|print.*template)" > /dev/null; then
  echo '{"decision": "deny", "reason": "PII logging detected - violates GDPR data minimization"}' >&2
  exit 2
fi

# Block writes to sensitive biometric directories
case "$file_path" in
  */biometric-data/* | */templates/* | */user-data/*)
    echo '{"decision": "deny", "reason": "Writing to sensitive biometric directory requires security review"}' >&2
    exit 2
    ;;
esac

echo '{"decision": "approve", "reason": "No biometric data protection violations detected"}'
```

---

## Biometric Context Injection (UserPromptSubmit)

```json
{
  "UserPromptSubmit": [
    {
      "matcher": "*",
      "hooks": [
        {
          "type": "prompt",
          "prompt": "BIOMETRIC CONTEXT ADVISOR: If user mentions facial recognition, voice verification, fingerprint analysis, liveness detection, or identity verification, inject critical warnings: GDPR Art. 9 compliance required, explicit consent needed, data minimization mandatory, security audit required. Add relevant {{CLIENT_NAME}} security rules. User prompt: $USER_PROMPT",
          "timeout": 20
        }
      ]
    }
  ]
}
```

---

## {{CLIENT_NAME}} Security Context Loader (SessionStart)

```json
{
  "SessionStart": [
    {
      "matcher": "*",
      "hooks": [
        {
          "type": "command",
          "command": "bash ${CLAUDE_PLUGIN_ROOT}/scripts/{{CLIENT_CODE}}-context.sh",
          "timeout": 15
        }
      ]
    }
  ]
}
```

```bash
#!/bin/bash
# {{CLIENT_CODE}}-context.sh
echo "export BIOMETRIC_PROJECT=true" >> "$CLAUDE_ENV_FILE"
echo "export GDPR_COMPLIANCE_REQUIRED=true" >> "$CLAUDE_ENV_FILE"
echo "export SECURITY_LEVEL=high" >> "$CLAUDE_ENV_FILE"
echo "export DTC_ACTIVE=true" >> "$CLAUDE_ENV_FILE"
echo "export PII_PROTECTION_MODE=strict" >> "$CLAUDE_ENV_FILE"

# Load {{CLIENT_NAME}} security rules
cat "${CLAUDE_PLUGIN_ROOT}/config/biometric-security-rules.txt" >> "$CLAUDE_ENV_FILE"
```

---

## Security Gate for Biometric Stop Hook

```json
{
  "Stop": [
    {
      "matcher": "*",
      "hooks": [
        {
          "type": "prompt",
          "prompt": "BIOMETRIC SECURITY GATE: Before stopping, verify security compliance for biometric data processing: 1) SAST scan completed (0 high/critical vulns) 2) No hardcoded biometric test data 3) Encryption keys rotated if needed 4) GDPR compliance verified 5) Security sign-off obtained if touching biometric data. BLOCK until all security gates pass. Context: $REASON",
          "timeout": 60
        }
      ]
    }
  ]
}
```

---

## {{CLIENT_NAME}} Production vs Development Hook Strategies

### Production Mode Hooks (Zero Tolerance)

```bash
#!/bin/bash
# production-biometric-guard.sh
input=$(cat)
ENVIRONMENT=$(echo "$input" | jq -r '.environment // "development"')

if [[ "$ENVIRONMENT" == "production" || -f "$CLAUDE_PROJECT_DIR/.production-mode" ]]; then
  content=$(echo "$input" | jq -r '.tool_input.content // empty')
  if echo "$content" | grep -iE "(test.*biometric|sample.*template|debug.*face)" > /dev/null; then
    echo '{"decision": "deny", "reason": "Test biometric data BLOCKED in production"}' >&2
    exit 2
  fi
fi
```

### Development Mode Hooks (Configurable Strictness)

```bash
#!/bin/bash
# development-helper.sh
STRICT_MODE=$(jq -r '.biometric.strictMode // false' "$CLAUDE_PROJECT_DIR/.claude/{{CLIENT_CODE}}-config.json")

if [[ "$STRICT_MODE" == "true" ]]; then
  # Enable all biometric validations
  : # ... full GDPR security checks ...
else
  echo '{"systemMessage": "Development mode: Relaxed biometric validations"}'
fi
```

### Security Review Auto-Trigger

```bash
#!/bin/bash
# security-review-trigger.sh
input=$(cat)
content=$(echo "$input" | jq -r '.tool_input.content // empty')

if echo "$content" | grep -iE "(encrypt|biometric.*process|face.*recognition)" > /dev/null; then
  echo '{"systemMessage": "SECURITY REVIEW REQUIRED: biometric processing changes detected. Auto-assigning to CISO for review."}'
fi
```

**{{CLIENT_NAME}} hook activation patterns**:

- **`.production-mode`** file → Enable zero-tolerance biometric guards
- **`.security-review-mode`** file → Auto-assign CISO for sensitive changes
- **`{{CLIENT_CODE}}-config.json`** → Configure biometric validation strictness levels

---

## Complete Biometric API Protection Hook (PreToolUse)

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit|Bash",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "{{CLIENT_CODE_UPPER}} BIOMETRIC API PROTECTION: Analyze for violations: 1) GDPR Art. 9 (biometric data = special category) 2) PSD2 SCA requirements 3) eIDAS compliance levels 4) Facial template logging 5) Voice print storage 6) Fingerprint vector transmission 7) Liveness detection bypasses 8) OCR document data exposure. BLOCK any violation. Include GDPR citation in denial. $TOOL_INPUT",
            "timeout": 45
          }
        ]
      }
    ]
  }
}
```

---

## SAST/DAST Integration Hook (PostToolUse)

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash ${CLAUDE_PLUGIN_ROOT}/scripts/{{CLIENT_CODE}}/parse-sast-results.sh",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

---

## Production Deployment Gate (Stop)

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "PRODUCTION DEPLOYMENT GATE for biometric systems: MANDATORY CHECKS: ✅ SAST scan 0 critical/high vulns ✅ DAST completed ✅ biometric template encryption verified ✅ GDPR compliance documented ✅ Security sign-off obtained ✅ Penetration test passed ✅ No test biometric data in production build ✅ Audit trail configured. BLOCK deployment until ALL checks pass. $REASON",
            "timeout": 90
          }
        ]
      }
    ]
  }
}
```

---

## {{CLIENT_NAME}} Hook Implementation Strategy

### Phase 1: Security Foundation (Must Do First)

1. Deploy biometric protection hooks — PreToolUse guards against PII/template logging
2. Configure environment context — SessionStart loads GDPR compliance rules
3. Set up security gates — Stop hooks enforce security checklist completion
4. Enable DTC validation — PostToolUse ensures docs stay synced with code changes

### Phase 2: Quality Gates Automation

1. Add SAST/DAST integration — PostToolUse hooks parse security scan results
2. Implement test coverage gates — Stop hooks block deploys without adequate testing
3. Set up dependency scanning — PreToolUse hooks validate new packages against security whitelist
4. Configure compliance reporting — Stop hooks generate GDPR compliance reports

### Phase 3: Advanced Workflow Automation

1. Auto-assign security reviews — UserPromptSubmit detects sensitive topics, assigns CISO
2. Dynamic security policies — Environment-specific hook activation (prod vs dev)
3. Audit trail automation — All hooks log decisions for compliance auditing
4. Integration triggers — Hooks spawn external security tools (Snyk, OWASP ZAP)

### Critical Implementation Steps

```bash
# 1. Create {{CLIENT_NAME}} hooks structure
mkdir -p hooks/scripts/{{CLIENT_CODE}}
mkdir -p hooks/config

# 2. Deploy core biometric security hooks (non-negotiable)
cp biometric-protection.sh hooks/scripts/{{CLIENT_CODE}}/
cp security-gate-check.sh hooks/scripts/{{CLIENT_CODE}}/
cp dtc-validation.sh hooks/scripts/{{CLIENT_CODE}}/

# 3. Configure environment-specific activation
echo '{"biometric": {"strictMode": true, "environment": "production"}}' > .claude/{{CLIENT_CODE}}-config.json

# 4. Test with biometric scenarios
claude --debug  # Verify hooks activate on biometric operations

# 5. Document for team
echo "BIOMETRIC PROTECTION: All hooks mandatory for GDPR compliance" > hooks/README.md
```

**Never deploy biometric data processing code without these security hooks active.**

---

## {{CLIENT_NAME}} Additional Resources

- **Security Rules**: `docs/standards/org.md` — GDPR compliance requirements
- **Hook Strategy**: `docs/standards/hooks-strategy.md` — {{CLIENT_NAME}} hook deployment guide
- **DTC Guidelines**: `docs/checklists/dod.md` — Docs Travel with Code enforcement

---

## Changelog

| Version | Date       | Author                | Changes                                                                     |
| ------- | ---------- | --------------------- | --------------------------------------------------------------------------- |
| 1.0.0   | 2026-03-25 | TL: tier3-remediation | Created from hook-development/SKILL.md during domain-agnostic normalization |
