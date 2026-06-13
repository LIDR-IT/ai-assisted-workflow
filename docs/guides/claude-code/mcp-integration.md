---
id: guide-mcp-integration
version: "0.1.1"
last_updated: "2026-05-15"
updated_by: "audit-standards skill"
status: active
type: standard
owner_role: "TL"
review_cycle: 90
next_review: "2026-08-13"
---

# MCP Integration for Claude Code

## Overview

Model Context Protocol (MCP) enables Claude Code to integrate with external services and APIs by providing structured tool access.

## Configuration: .mcp.json

```json
{
  "database-tools": {
    "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
    "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
    "env": {
      "DB_URL": "${DB_URL}"
    }
  }
}
```

## Server Types

| Type      | Use Case        | Example                         |
| --------- | --------------- | ------------------------------- |
| **stdio** | Local processes | Database tools, file processors |
| **SSE**   | Remote services | Cloud APIs, SaaS integrations   |
| **HTTP**  | Web APIs        | REST services                   |

## {{CLIENT_NAME}} MCPs (5)

| MCP            | Connection            | Used By                                                 |
| -------------- | --------------------- | ------------------------------------------------------- |
| **Jira**       | mcp.atlassian.com     | implement-ticket, prepare-testing, create-release-notes |
| **GitHub**     | api.githubcopilot.com | implement-ticket, create-pr, create-release-notes       |
| **Confluence** | mcp.atlassian.com     | create-release-notes, lidr-requirements                 |
| **Xray**       | xray-mcp-server       | prepare-testing                                         |
| **Slack**      | mcp.slack.com         | implement-ticket, prepare-testing, create-release-notes |

## Best Practices

1. Use environment variables for credentials (never hardcode)
2. Set appropriate timeouts per server
3. Handle connection failures gracefully
4. Document capabilities per MCP in a central reference
5. Test with mock data before connecting to production
