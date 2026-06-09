---
name: lidr-mcp-integration
id: mcp-integration
version: "2.2.0"
last_updated: "2026-03-25"
updated_by: "TL: tier3-remediation"
status: active
phase: 0
owner_role: "TL"
automation: false
domain_agnostic: true
description: >
  Configure and integrate Model Context Protocol (MCP) servers into Claude Code workflows to expose external services as native tools.
  Domain-agnostic — works for any external service integration regardless of industry or tech stack.
  Use for connecting Jira, GitHub, TestRail, databases, or any API-accessible service to Claude Code.
  Essential when a team workflow requires Claude Code to read from or write to an external system.
  Always use when connecting external services like project trackers, version control, or test management tools; always use when automating cross-tool workflows.
  Do NOT use for hook creation (use hook-development), for command orchestration (use command-development), or for tool use that doesn't require persistent external connections.
  Triggers on "add MCP server", "integrate MCP", "configure MCP in plugin", "set up Model Context Protocol", "connect external service", "MCP server types", "SSE", "stdio", "HTTP MCP".
  Output in English (configuration files), team language (documentation).
  Audience: Tech Lead (configures MCP), Developer (uses MCP tools), DevOps (manages server infrastructure).
---

# MCP Integration: Connect External Services to Claude Code

## Why MCP Integration is Critical for Automation

**Essential for development workflow automation.** Model Context Protocol (MCP) transforms external services into Claude Code tools, enabling automated workflows across the development pipeline.

**Must-use scenarios:**

- **Jira MCP**: Auto-create project tickets, update epic status, track task progress
- **GitHub MCP**: Manage repos, auto-create PRs, sync releases, query code
- **TestRail MCP**: Generate test cases, execute test suites, track quality metrics
- **Custom Domain MCP**: Expose proprietary APIs, domain-specific algorithms, or internal tools as Claude-native tools

> **Domain note**: Examples below reference a software development context. Replace service names and use cases with your team's actual external service integrations.

**Critical automation benefits:**

- **10+ related tools** from a single service (e.g., jira_create_ticket + jira_update_epic + jira_search_issues)
- **OAuth flows** handled automatically (GitHub, Jira Cloud authentication)
- **Bundle with plugins** for zero-setup automation
- **Environment-aware** configuration using ${CLAUDE_PLUGIN_ROOT}

## MCP Server Configuration Methods

Plugins can bundle MCP servers in two ways:

### Method 1: Dedicated .mcp.json (Recommended for dedicated services)

Create `.mcp.json` at plugin root for multi-service workflow automation:

```json
{
  "jira-project": {
    "type": "sse",
    "url": "https://mcp.atlassian.com/sse",
    "env": {
      "JIRA_URL": "${JIRA_URL}",
      "PROJECT_KEY": "${PROJECT_KEY}"
    }
  },
  "github-repos": {
    "type": "sse",
    "url": "https://mcp.github.com/sse"
  },
  "data-processor": {
    "command": "${CLAUDE_PLUGIN_ROOT}/servers/domain-mcp",
    "args": ["--config-dir", "${CLAUDE_PLUGIN_ROOT}/config"],
    "env": {
      "PROCESSING_MODE": "${PROCESSING_MODE}",
      "LOG_LEVEL": "info"
    }
  }
}
```

**Benefits:**

- **Multi-service integration**: Jira + GitHub + custom domain processing
- **Environment isolation**: Different configs for dev/staging/prod
- **Clear separation**: External cloud services vs custom domain logic

### Method 2: Inline in plugin.json

Add `mcpServers` field for simpler plugins:

```json
{
  "name": "my-service-automation",
  "version": "1.0.0",
  "mcpServers": {
    "my-service-github": {
      "type": "sse",
      "url": "https://mcp.github.com/sse"
    },
    "validation-service": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/validator-mcp",
      "args": ["--model", "validator-v3"],
      "env": {
        "CONFIG_PATH": "${CLAUDE_PLUGIN_ROOT}/config/validator.json"
      }
    }
  }
}
```

**Best for:**

- **Single domain feature** (e.g., data validation only)
- **Simple GitHub integration** for SDK or library releases
- **Prototype workflows** before scaling to dedicated `.mcp.json`

## MCP Server Types

### stdio (Local Process) - Essential for custom domain processing

Execute custom MCP servers as child processes. **Critical for proprietary algorithms and local data processing.**

**Domain Processing Configuration:**

```json
{
  "domain-processor": {
    "command": "python",
    "args": ["-m", "myapp.mcp.custom_server"],
    "env": {
      "DATA_DIR": "${CLAUDE_PLUGIN_ROOT}/data",
      "ENCRYPTION_KEY": "${APP_ENCRYPTION_KEY}",
      "COMPLIANCE_MODE": "strict",
      "LOG_LEVEL": "info"
    }
  },
  "validation-service": {
    "command": "${CLAUDE_PLUGIN_ROOT}/servers/validator-mcp",
    "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/validator.json"],
    "env": {
      "MODEL_VERSION": "v3.1",
      "STRICT_VALIDATION": "enabled"
    }
  }
}
```

**Common stdio use cases:**

- **Data processing**: Transform, validate, or enrich domain data (compliance-aware)
- **Model inference**: Run local ML models or rule engines
- **Performance metrics**: Calculate domain-specific KPIs and thresholds
- **Document parsing**: Extract structured data from files (PDFs, CSVs, images)
- **Behavioral analysis**: Analyze usage patterns, logs, or event streams

**Process management benefits:**

- Isolated process per algorithm (failure isolation)
- Secure stdin/stdout for sensitive data exchange
- Auto-terminate on Claude Code exit (no lingering processes)

### SSE (Server-Sent Events) - Perfect for Cloud Services

Connect to hosted MCP servers with OAuth. **Always use for Jira, GitHub, TestRail integration.**

**Cloud Integration:**

```json
{
  "jira-project": {
    "type": "sse",
    "url": "https://mcp.atlassian.com/sse"
  },
  "github-repos": {
    "type": "sse",
    "url": "https://mcp.github.com/sse"
  },
  "testrail-project": {
    "type": "sse",
    "url": "https://mcp.testrail.com/sse"
  }
}
```

**Critical use cases:**

- **Jira**: Auto-create epics, track task status, update sprint progress
- **GitHub**: Manage repos, auto-merge PRs, trigger CI/CD pipelines
- **TestRail**: Execute test suites, track quality metrics, automate regression testing
- **Confluence**: Sync documentation, update architecture diagrams

**OAuth benefits:**

- **Zero-setup**: No API keys to manage per developer
- **Secure**: OAuth tokens auto-refreshed, no hardcoded credentials
- **Team-ready**: Each developer authenticates independently

### HTTP & WebSocket for Advanced Integration

**HTTP** for custom API backends:

```json
{
  "domain-api": {
    "type": "http",
    "url": "https://api.example.com/domain-mcp",
    "headers": { "Authorization": "Bearer ${APP_API_TOKEN}" }
  }
}
```

**WebSocket** for real-time data processing:

```json
{
  "event-stream": {
    "type": "ws",
    "url": "wss://service.example.com/stream-ws",
    "headers": { "Authorization": "Bearer ${STREAM_TOKEN}" }
  }
}
```

**Advanced use cases:**

- **Real-time event streaming** (IoT sensors, payment events, fraud signals)
- **Compliance validation APIs** for regulatory checks
- **Low-latency scoring** for recommendation or risk engines

## Critical Environment Variables for MCP Servers

**${CLAUDE_PLUGIN_ROOT}** - Always use for portable resource paths:

```json
{
  "command": "${CLAUDE_PLUGIN_ROOT}/servers/domain-mcp",
  "env": {
    "CONFIG_DIR": "${CLAUDE_PLUGIN_ROOT}/config",
    "DATA_DIR": "${CLAUDE_PLUGIN_ROOT}/data"
  }
}
```

**Common environment variable patterns:**

```json
{
  "env": {
    "APP_ENCRYPTION_KEY": "${APP_ENCRYPTION_KEY}",
    "COMPLIANCE_MODE": "${COMPLIANCE_MODE}",
    "QUALITY_THRESHOLD_HIGH": "${QUALITY_THRESHOLD_HIGH}",
    "QUALITY_THRESHOLD_LOW": "${QUALITY_THRESHOLD_LOW}",
    "JIRA_URL": "${JIRA_URL}",
    "GITHUB_ORG": "${GITHUB_ORG}"
  }
}
```

**Security requirement:** Document all sensitive environment variables with security notes in plugin README. Never hardcode secrets.

## MCP Tool Naming

When MCP servers provide tools, they're automatically prefixed:

**Format:** `mcp__plugin_<plugin-name>_<server-name>__<tool-name>`
**Example:** `mcp__myproject_jira_server__create_epic`

### Using MCP Tools in Commands

Pre-allow specific MCP tools in command frontmatter:

```markdown
---
allowed-tools:
  [
    "mcp__project_jira_server__create_epic",
    "mcp__project_jira_server__update_sprint",
    "mcp__project_github_server__create_pr",
    "mcp__data_processor__validate_record",
    "mcp__testrail_server__execute_test_suite",
  ]
---
```

**For agents with controlled processors:**

```markdown
---
allowed-tools: [
    "mcp__data_processor__*", # All data processing tools
    "mcp__testrail_server__execute_*", # All test execution tools
  ]
---
```

**Critical security guidelines:**

- **Never wildcard external services** (Jira, GitHub, CRM) - security risk
- **Wildcard only custom internal processors** - controlled environment
- **Always validate sensitive data access** - compliance and audit requirements

## Service MCP Lifecycle & Authentication

**Automatic server startup:**

- MCP servers start when the plugin loads (critical for real-time processing)
- Use `/mcp` to verify registered tools, e.g. `mcp__data_processor__validate_record`

**Authentication patterns by server type:**

- **OAuth (SSE)**: Jira, GitHub, TestRail, CRM — auto-handled, zero-setup
- **Token (HTTP)**: Custom domain APIs — use `${APP_API_TOKEN}`
- **Environment (stdio)**: Local processors — encryption keys, config paths

```json
{
  "domain-processor": {
    "command": "python",
    "args": ["-m", "myapp.custom_mcp"],
    "env": {
      "APP_ENCRYPTION_KEY": "${APP_ENCRYPTION_KEY}",
      "COMPLIANCE_MODE": "strict",
      "LOG_LEVEL": "info"
    }
  }
}
```

## Domain-Specific MCP Integration Patterns

> **Domain-specific examples** (e.g., identity verification, healthcare, fintech) are in `examples/client-domain-example.md`.

### Pattern 1: Feature Development Command

```markdown
# Command: implement-feature.md

---

allowed-tools: [
"mcp__jira_project__create_subtask",
"mcp__github_project__create_branch",
"mcp__data_processor__validate_record"
]

---

Steps: Create Jira task → GitHub branch → Validate domain compliance → Ready for dev
```

### Pattern 2: Autonomous Quality Monitor Agent

```markdown
# Agent: quality-monitor.md

Process: Query GitHub commits → Validate data models → Update Jira metrics → Alert if quality thresholds exceeded
```

### Pattern 3: Multi-Service Platform

```json
{
  "jira-project": { "type": "sse", "url": "https://mcp.atlassian.com/sse" },
  "github-project": { "type": "sse", "url": "https://mcp.github.com/sse" },
  "domain-algorithms": {
    "command": "${CLAUDE_PLUGIN_ROOT}/servers/domain-mcp",
    "env": { "MODEL_VERSION": "v3.1", "COMPLIANCE_MODE": "strict" }
  }
}
```

**Powers complete SDLC:** Epic → Development → Testing → Deployment → Monitoring.

## MCP Security & Testing

### Critical Security Practices

**Essential security practices:**

- ✅ **HTTPS/WSS only** for sensitive data transmission
- ✅ **Environment variables** for encryption keys and tokens — never hardcode
- ✅ **Specific tool permissions** (never wildcard external services)
- ✅ **Compliance mode** for regulated data handling (GDPR, HIPAA, PCI-DSS as applicable)

```markdown
# Secure command example

---

allowed-tools: [
"mcp__data_processor__validate_record", # Specific internal tool
"mcp__jira_project__create_epic" # Specific Jira tool
]

---
```

### MCP Testing Checklist

**Essential validation for MCP servers:**

- [ ] **Domain server** connects: `/mcp` lists expected tools
- [ ] **Jira/GitHub OAuth** works: Auto-authentication flows complete
- [ ] **Data encryption** works: Sensitive payloads properly encrypted/decrypted
- [ ] **Compliance mode** validated: Required consent and audit logging functional
- [ ] **Quality metrics** accurate: Domain KPIs match expected thresholds
- [ ] **Error handling** robust: Invalid inputs, connection failures handled gracefully

### Quick Debug for MCP Issues

```bash
# Debug MCP connections
claude --debug

# Verify registered tools
/mcp | grep domain-processor

# Test a specific tool
mcp__data_processor__validate_record --input="test_record.json"
```

**Common MCP fixes:**

- **Server not starting**: Check environment variables (encryption keys, config paths)
- **Validation failing**: Verify compliance mode and configuration
- **Metrics wrong**: Validate threshold environment variable values

## Quality Assurance

### Validation Script

This skill includes automated validation via `scripts/validate-examples.ts`:

```bash
# Validate skill examples and structure
npx tsx scripts/validate-examples.ts
```

**Validation includes:**

- Example completeness and correctness
- MCP configuration compliance patterns
- Progressive disclosure adherence
- Resource organization standards

**When to use:**

- Before skill release/packaging
- In CI/CD pipeline (quality gates)
- After major example updates
- During skill maintenance cycles

**Integration with ecosystem:**

- Used by `bmad-eval-runner` for ecosystem validation
- Supports quality gates in SDLC workflow
- Provides consistent validation across all skills

## Resources for MCP Integration

### Essential Documentation & Debugging

**Key references:**

- @docs/guides/claude-code/mcp-integration.md - Detailed server configuration guide
- @docs/standards/tool-integrations.md - CSV workflows when MCP unavailable
- **MCP Protocol**: https://modelcontextprotocol.io/
- **Claude Code MCP**: https://docs.claude.com/en/docs/claude-code/mcp

**Domain-specific examples:**

- `examples/client-domain-example.md` — Domain-specific identity platform patterns

**Debugging MCPs:**

```bash
claude --debug          # Debug connections
/mcp                    # Verify tools available
```

**Log indicators:** Server startup status, encryption setup, compliance validation, threshold accuracy

## Changelog

| Version | Date       | Author                | Changes                                                                                            |
| ------- | ---------- | --------------------- | -------------------------------------------------------------------------------------------------- |
| 2.2.0   | 2026-03-25 | TL: tier3-remediation | Domain-agnostic normalization: moved domain-specific patterns to examples/client-domain-example.md |
| 2.1.0   | 2026-03-16 | TL: Claude            | Added Quality Assurance section with MCP validation patterns                                       |
| 2.0.0   | 2026-03-09 | TL: Claude            | Complete rewrite with actionable descriptions, realistic examples                                  |
| 0.1.0   | 2025-12-01 | TL: Original          | Initial generic MCP integration skill                                                              |

## MCP Implementation Workflow

**Essential steps for custom MCP automation:**

### Phase 1: Design Integration

1. **Identify required services** (Jira epics, GitHub repos, TestRail suites, custom domain processors)
2. **Choose MCP types**: SSE for cloud services (Jira/GitHub/CRM), stdio for custom domain processing
3. **Map domain workflows**: Epic → Development → Testing → Deployment

### Phase 2: Configure MCP Servers

4. **Create `.mcp.json`** with server configuration:
   ```json
   {
     "jira-project": { "type": "sse", "url": "https://mcp.atlassian.com/sse" },
     "domain-processor": {
       "command": "${CLAUDE_PLUGIN_ROOT}/servers/domain-mcp",
       "env": { "COMPLIANCE_MODE": "strict", "ENCRYPTION_REQUIRED": "true" }
     }
   }
   ```
5. **Document environment variables**: encryption keys, model/config paths, compliance flags
6. **Use ${CLAUDE_PLUGIN_ROOT}** for all portable resource paths

### Phase 3: Integrate with Commands

7. **Test MCPs** with `/mcp` command (verify tools are listed and accessible)
8. **Pre-allow tools** in command frontmatter:
   - Jira: `mcp__jira_project__create_epic`
   - GitHub: `mcp__github_project__create_pr`
   - Domain: `mcp__domain_processor__validate_record`
9. **Handle authentication** (OAuth for cloud services, environment keys for local processors)

### Phase 4: Validate Security

10. **Test error cases**: Connection failures, invalid inputs, compliance violations
11. **Validate compliance**: Data encryption, consent mechanisms, audit logging
12. **Document integration** in plugin README with environment variables and security considerations

**Focus strategy:**

- **SSE for external integrations** (Jira, GitHub, CRM, analytics platforms)
- **stdio for custom domain logic** (data validation, model inference, metric calculation)
- **Security first** (encryption, compliance, audit trails for regulated data)
