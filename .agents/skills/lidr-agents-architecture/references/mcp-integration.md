---
id: mcp-integration
version: "1.0.0"
last_updated: "2026-06-12"
updated_by: "TL: meta-tooling consolidation"
status: active
type: reference
review_cycle: 90
next_review: "2026-09-12"
owner_role: "Tech Lead"
---

# MCP Integration — Connect External Services

Configure and integrate Model Context Protocol (MCP) servers to expose external services
as native agent tools. Domain-agnostic — works for any external service regardless of
industry or tech stack.

> Trigger phrases this reference covers: "add MCP server", "integrate MCP", "configure
> MCP", "set up Model Context Protocol", "connect external service", "MCP server types",
> "SSE", "stdio", "HTTP MCP". Use MCP **when a workflow needs the agent to read from or
> write to an external system** (Jira, GitHub, TestRail, databases, custom APIs). Do NOT
> use for hook creation (`hook-development.md`) or command orchestration
> (`command-development.md`).

In the LIDR ecosystem, MCP **source of truth** is `.agents/mcp/mcp-servers.json`; sync
generates per-platform configs (`.mcp.json` at repo root for Claude, `.cursor/mcp.json`,
`.gemini/settings.json`, `.vscode/mcp.json` for Copilot; Antigravity is global-only). See
the project `CLAUDE.md` "MCP Integration" + "Adding an MCP Server" for the add-and-sync
flow and per-platform JSON shapes.

## Why MCP

MCP turns external services into agent tools, enabling automated cross-pipeline
workflows: Jira (create tickets, update epics), GitHub (PRs, releases, code queries),
TestRail (test cases, suites), custom domain MCP (proprietary APIs as native tools). One
server can expose 10+ related tools; OAuth flows are handled automatically.

## Configuration methods (plugins)

- **Dedicated `.mcp.json`** at plugin root — best for multi-service workflows
  (Jira + GitHub + custom processor), environment isolation, clear cloud-vs-custom split.
- **Inline `mcpServers` in `plugin.json`** — best for a single feature, simple GitHub
  integration, or prototypes.

## Server types

| Type      | Transport             | Use for                                                                 |
| --------- | --------------------- | ----------------------------------------------------------------------- |
| **stdio** | Local child process   | Custom domain processing, proprietary algorithms, local ML, doc parsing |
| **SSE**   | Hosted + OAuth        | Cloud services — Jira, GitHub, TestRail, Confluence (zero-setup auth)   |
| **HTTP**  | REST endpoint + token | Custom API backends with bearer-token auth                              |
| **ws**    | WebSocket             | Real-time streaming (events, low-latency scoring)                       |

**stdio** (isolated process, secure stdin/stdout, auto-terminates on exit):

```json
{
  "domain-processor": {
    "command": "python",
    "args": ["-m", "myapp.mcp.custom_server"],
    "env": { "DATA_DIR": "${CLAUDE_PLUGIN_ROOT}/data", "LOG_LEVEL": "info" }
  }
}
```

**SSE** (OAuth, zero per-developer key management, auto-refreshed tokens):

```json
{
  "jira-project": { "type": "sse", "url": "https://mcp.atlassian.com/sse" },
  "github-repos": { "type": "sse", "url": "https://mcp.github.com/sse" }
}
```

**HTTP** (custom API backends):

```json
{
  "domain-api": {
    "type": "http",
    "url": "https://api.example.com/mcp",
    "headers": { "Authorization": "Bearer ${APP_API_TOKEN}" }
  }
}
```

Full copy-paste configs in `../examples/mcp-servers/{stdio,sse,http}-server.json`.

## Environment variables

Always use `${CLAUDE_PLUGIN_ROOT}` for portable resource paths and reference secrets via
`${VAR}` — **never hardcode credentials**. Document every sensitive env var in the plugin
README.

```json
{
  "command": "${CLAUDE_PLUGIN_ROOT}/servers/domain-mcp",
  "env": { "CONFIG_DIR": "${CLAUDE_PLUGIN_ROOT}/config", "APP_API_TOKEN": "${APP_API_TOKEN}" }
}
```

## Tool naming & permissions

MCP tools are auto-prefixed: `mcp__plugin_<plugin>_<server>__<tool>` (e.g.
`mcp__myproject_jira_server__create_epic`). Pre-allow specific tools in command/agent
frontmatter:

```markdown
---
allowed-tools: ["mcp__project_jira_server__create_epic", "mcp__data_processor__validate_record"]
---
```

**Security:** never wildcard external services (Jira, GitHub, CRM) — only wildcard
controlled internal processors (`mcp__data_processor__*`). Use HTTPS/WSS only for
sensitive data; apply compliance mode (GDPR/HIPAA/PCI-DSS) where regulated data flows.

## Authentication patterns

- **OAuth (SSE)** — Jira, GitHub, TestRail, CRM: auto-handled, zero-setup, per-developer.
- **Token (HTTP)** — custom domain APIs: `${APP_API_TOKEN}` bearer header.
- **Environment (stdio)** — local processors: keys/config paths via env vars.

## Lifecycle, testing & debugging

MCP servers start when the plugin loads. Verify with `/mcp` (lists registered tools).
Debug connections with `claude --debug`. Test a tool directly once registered.

Testing checklist: server connects (`/mcp` lists expected tools), OAuth flows complete,
sensitive payloads encrypted, compliance/audit logging functional, error handling robust
(invalid inputs, connection failures handled gracefully).

Common fixes: server not starting → check env vars (keys, config paths); validation
failing → verify compliance mode + config; wrong metrics → validate threshold env values.

## Resources

- MCP Protocol: https://modelcontextprotocol.io/
- Claude Code MCP: https://docs.claude.com/en/docs/claude-code/mcp
- When MCP is unavailable, fall back to CSV import/export workflows (see
  `.agents/rules/lidr-sdlc/org.md` §9 tool integrations).
