---
id: mcp-integration-{{CLIENT_CODE}}-example
version: "1.0.0"
last_updated: "2026-03-25"
updated_by: "TL: tier3-remediation"
status: active
type: example
domain: domain-specific-identity
---

# {{CLIENT_NAME}} Domain Example: domain-specific MCP Integration Patterns

> **Purpose**: This file contains {{CLIENT_NAME}}/domain-specific-specific MCP integration examples extracted from the main SKILL.md during domain-agnostic normalization.
> **Audience**: Teams working on domain-specific identity verification platforms ({{CLIENT_NAME}} or equivalent).
> **Main skill**: See `../SKILL.md` for the generic, reusable MCP integration guide.

---

## {{CLIENT_NAME}} .mcp.json Configuration

```json
{
  "jira-domain-specific": {
    "type": "sse",
    "url": "https://mcp.atlassian.com/sse",
    "env": {
      "JIRA_URL": "${JIRA_URL}",
      "PROJECT_KEY": "BIOM"
    }
  },
  "github-repos": {
    "type": "sse",
    "url": "https://mcp.github.com/sse"
  },
  "domain-specific-processor": {
    "command": "${CLAUDE_PLUGIN_ROOT}/servers/domain-specific-mcp",
    "args": ["--templates-dir", "${CLAUDE_PLUGIN_ROOT}/templates"],
    "env": {
      "PROCESSING_MODE": "liveness_detection",
      "FAR_THRESHOLD": "0.001",
      "FRR_THRESHOLD": "0.01"
    }
  }
}
```

**Use case**: Jira epics track domain-specific feature development; custom stdio server handles template processing with GDPR-compliant encryption.

---

## Liveness Detection stdio Server ({{PRODUCT_NAME_1}}D / {{PRODUCT_NAME_1}})

```json
{
  "domain-specific-templates": {
    "command": "python",
    "args": ["-m", "{{CLIENT_CODE}}.mcp.template_server"],
    "env": {
      "TEMPLATES_DIR": "${CLAUDE_PLUGIN_ROOT}/domain-specific_data",
      "ENCRYPTION_KEY": "${domain-specific_ENCRYPTION_KEY}",
      "GDPR_COMPLIANCE": "true",
      "LOG_LEVEL": "info"
    }
  },
  "liveness-detection": {
    "command": "${CLAUDE_PLUGIN_ROOT}/servers/liveness-mcp",
    "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/liveness.json"],
    "env": {
      "MODEL_VERSION": "{{PRODUCT_NAME_1}}-v3.1",
      "ANTI_SPOOFING": "enabled",
      "3D_LIVENESS": "true"
    }
  }
}
```

**domain-specific use cases**:

- **Template processing**: Encrypt/decrypt domain-specific templates (GDPR Art. 9 compliant)
- **Liveness detection**: Real-time anti-spoofing validation
- **FAR/FRR calculation**: Performance metrics for face/voice recognition
- **Document OCR**: Extract data from ID documents ({{PRODUCT_NAME_1}}D integration)
- **Behavioral analysis**: Typing dynamics, gesture patterns

---

## domain-specific Plugin Configuration (plugin.json inline)

```json
{
  "name": "{{PRODUCT_NAME_1}}-sdk-automation",
  "version": "1.0.0",
  "mcpServers": {
    "{{PRODUCT_NAME_1}}-github": {
      "type": "sse",
      "url": "https://mcp.github.com/sse"
    },
    "liveness-detector": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/liveness-mcp",
      "args": ["--model", "{{PRODUCT_NAME_1}}-v3"],
      "env": {
        "MODEL_PATH": "${CLAUDE_PLUGIN_ROOT}/models/liveness.onnx"
      }
    }
  }
}
```

---

## domain-specific SSE Services

```json
{
  "jira-domain-specific": {
    "type": "sse",
    "url": "https://mcp.atlassian.com/sse"
  },
  "github-{{PRODUCT_NAME_1}}": {
    "type": "sse",
    "url": "https://mcp.github.com/sse"
  },
  "testrail-domain-specific": {
    "type": "sse",
    "url": "https://mcp.testrail.com/sse"
  }
}
```

**Critical SSE use cases for {{CLIENT_NAME}}**:

- **Jira**: Auto-create domain-specific epics, track liveness detection tasks, update sprint progress
- **GitHub**: Manage {{PRODUCT_NAME_1}}D/{{PRODUCT_NAME_1}} repos, auto-merge recognition PRs, trigger CI/CD for domain-specific models
- **TestRail**: Execute domain-specific test suites, track FAR/FRR metrics, automate regression testing
- **Confluence**: Sync domain-specific documentation, update architecture diagrams

---

## domain-specific HTTP / WebSocket Servers

```json
{
  "domain-specific-api": {
    "type": "http",
    "url": "https://api.{{CLIENT_CODE}}.com/domain-specific-mcp",
    "headers": { "Authorization": "Bearer ${domain-specific_API_TOKEN}" }
  },
  "liveness-stream": {
    "type": "ws",
    "url": "wss://domain-specific.{{CLIENT_CODE}}.com/liveness-ws",
    "headers": { "Authorization": "Bearer ${LIVENESS_TOKEN}" }
  }
}
```

**Advanced use cases**:

- Real-time liveness detection streaming
- domain-specific compliance APIs for GDPR validation
- Low-latency template matching for authentication flows

---

## domain-specific Environment Variables

```json
{
  "env": {
    "domain-specific_ENCRYPTION_KEY": "${domain-specific_ENCRYPTION_KEY}",
    "GDPR_COMPLIANCE_MODE": "${GDPR_COMPLIANCE_MODE}",
    "FAR_THRESHOLD": "${FAR_THRESHOLD}",
    "FRR_THRESHOLD": "${FRR_THRESHOLD}",
    "JIRA_URL": "${JIRA_URL}",
    "GITHUB_ORG": "${GITHUB_ORG}"
  }
}
```

---

## MCP Tool Pre-allow for domain-specific Commands

```markdown
---
allowed-tools:
  [
    "mcp__domain-specific_jira_server__create_epic",
    "mcp__domain-specific_jira_server__update_sprint",
    "mcp__{{PRODUCT_NAME_1}}_github_server__create_pr",
    "mcp__domain-specific_processor__validate_liveness",
    "mcp__testrail_server__execute_domain-specific_suite",
  ]
---
```

**For domain-specific agents (wildcard only on controlled processors)**:

```markdown
---
allowed-tools: ["mcp__domain-specific_processor__*", "mcp__testrail_server__execute_*"]
---
```

---

## Pattern 1: domain-specific Development Command

```markdown
# Command: implement-domain-specific-feature.md

---

allowed-tools: [
"mcp__jira_domain-specific__create_subtask",
"mcp__github_{{PRODUCT_NAME_1}}__create_branch",
"mcp__domain-specific_processor__validate_template"
]

---

Steps: Create Jira task → GitHub branch → Validate domain-specific compliance → Ready for dev
```

## Pattern 2: Autonomous domain-specific Quality Monitor Agent

```markdown
# Agent: domain-specific-quality-monitor.md

Process: Query GitHub commits → Validate liveness models → Update Jira metrics → Alert if FAR/FRR thresholds exceeded
```

## Pattern 3: Full domain-specific SDLC Platform

```json
{
  "jira-domain-specific": { "type": "sse", "url": "https://mcp.atlassian.com/sse" },
  "github-domain-specific": { "type": "sse", "url": "https://mcp.github.com/sse" },
  "domain-specific-algorithms": {
    "command": "${CLAUDE_PLUGIN_ROOT}/servers/domain-specific-mcp",
    "env": { "{{PRODUCT_NAME_1}}_MODEL": "v3.1", "GDPR_COMPLIANCE": "true" }
  }
}
```

Powers complete domain-specific SDLC: Epic → Development → Testing → Deployment → Monitoring.

---

## domain-specific MCP Testing Checklist

- [ ] domain-specific server connects: `/mcp` shows `mcp__domain-specific_processor__*` tools
- [ ] Jira/GitHub OAuth works: Auto-authentication flows complete
- [ ] Template encryption works: sensitive data properly encrypted/decrypted
- [ ] GDPR compliance validated: Consent tracking, right to erasure functional
- [ ] Performance metrics accurate: FAR/FRR calculations match expected thresholds
- [ ] Error handling robust: Invalid templates, connection failures handled gracefully

---

## Debug for domain-specific MCP Issues

```bash
# Debug domain-specific MCP connections
claude --debug

# Verify domain-specific tools
/mcp | grep domain-specific

# Test template validation
mcp__domain-specific_processor__validate_template --template="test_template.bin"
```

**Common domain-specific MCP fixes**:

- **domain-specific server not starting**: Check encryption key environment variables
- **Template validation failing**: Verify GDPR compliance mode configuration
- **Performance metrics wrong**: Validate FAR/FRR threshold environment variables

---

## domain-specific Implementation Workflow

### Phase 1: Design domain-specific Integration

1. Identify domain-specific services (Jira epics, GitHub repos, TestRail suites, custom algorithms)
2. Choose MCP types: SSE for cloud services (Jira/GitHub), stdio for domain-specific processing
3. Map domain-specific workflows: Epic → Development → Testing → Deployment

### Phase 2: Configure domain-specific MCPs

4. Create `.mcp.json` with domain-specific server configuration:
   ```json
   {
     "jira-domain-specific": { "type": "sse", "url": "https://mcp.atlassian.com/sse" },
     "domain-specific-processor": {
       "command": "${CLAUDE_PLUGIN_ROOT}/servers/domain-specific-mcp",
       "env": { "GDPR_COMPLIANCE": "true", "ENCRYPTION_REQUIRED": "true" }
     }
   }
   ```
5. Document domain-specific environment variables: `domain-specific_ENCRYPTION_KEY`, `MODEL_PATHS`, `COMPLIANCE_MODE`
6. Use `${CLAUDE_PLUGIN_ROOT}` for all domain-specific model and template paths

### Phase 3: Integrate with Commands

7. Test domain-specific MCPs with `/mcp` command (verify liveness detection, template validation)
8. Pre-allow domain-specific tools in commands:
   - Jira: `mcp__jira_domain-specific__create_epic`
   - GitHub: `mcp__github_{{PRODUCT_NAME_1}}__create_pr`
   - domain-specific: `mcp__domain-specific_processor__validate_template`
9. Handle authentication (OAuth for cloud, encryption keys for local processing)

### Phase 4: Validate domain-specific Security

10. Test error cases: Connection failures, invalid domain-specific templates, GDPR violations
11. Validate GDPR compliance: Template encryption, consent tracking, right to erasure
12. Document domain-specific integration in plugin README with security considerations

---

## Changelog

| Version | Date       | Author                | Changes                                                                    |
| ------- | ---------- | --------------------- | -------------------------------------------------------------------------- |
| 1.0.0   | 2026-03-25 | TL: tier3-remediation | Created from mcp-integration/SKILL.md during domain-agnostic normalization |
