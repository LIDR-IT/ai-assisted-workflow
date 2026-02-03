---
title: MCP (Model Context Protocol) Reference
description: Quick reference and external resources for MCP integration
category: reference
platforms: [claude-code, cursor, gemini-cli, antigravity]
---

# MCP (Model Context Protocol) Reference

> Part of [Template Best Practices](/) - AI Agent Synchronization Framework

Model Context Protocol (MCP) enables AI agents to connect to external tools and services through a standardized interface.

## Official Documentation

**Core Resources:**

- [MCP Specification](https://modelcontextprotocol.io/specification) - Protocol specification and architecture
- [MCP Introduction](https://modelcontextprotocol.io/introduction) - Getting started guide
- [MCP Quickstart](https://modelcontextprotocol.io/quickstart) - Quick setup tutorial

**SDKs:**

- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) - Official TypeScript implementation
- [Python SDK](https://github.com/modelcontextprotocol/python-sdk) - Official Python implementation

**Tools:**

- [MCP Inspector](https://github.com/modelcontextprotocol/inspector) - Debug and test MCP servers
- [MCP Registry](https://github.com/modelcontextprotocol/servers) - Community MCP servers

## Platform Setup Guides

### Claude Code

- [MCP Integration Guide](https://docs.anthropic.com/en/docs/build-with-claude/mcp)
- CLI: `claude mcp add <server-name>`
- Config: `.claude/mcp.json`

### Cursor

- [MCP in Cursor](https://docs.cursor.com/context/mcp)
- Config: `.cursor/mcp.json`
- Settings UI: Cursor Settings → Features → MCP Servers

### Gemini CLI

- [MCP Servers Documentation](https://geminicli.com/docs/tools/mcp-server)
- Config: `~/.gemini/settings.json`
- CLI: `gemini mcp list`

### Antigravity

- **Note:** Antigravity only supports **global** MCP configuration
- Config: `~/.gemini/antigravity/mcp_config.json`
- See: [Antigravity Limitations](../guides/mcp/ANTIGRAVITY_LIMITATION.md)

## Team Configuration

This project uses centralized MCP configuration in `.agents/mcp/`:

```bash
# Source of truth
.agents/mcp/mcp-servers.json

# Sync script generates platform-specific configs
.agents/mcp/sync-mcp.sh
```

**Current MCP Servers:**

- **Context7** - Documentation and code examples access

**To add a new MCP server:**

1. Edit `.agents/mcp/mcp-servers.json`
2. Run `.agents/mcp/sync-mcp.sh`
3. Verify with `claude mcp list` or platform-specific command

## Quick Start

**Install Context7 MCP:**

```bash
# Automatic (via sync script)
.agents/mcp/sync-mcp.sh

# Manual (Claude Code)
claude mcp add context7
```

**Test MCP server:**

```bash
# Claude Code
claude mcp list
claude mcp test context7

# Using MCP Inspector
npx @modelcontextprotocol/inspector npx -y @context7/mcp-server
```

## Common Use Cases

**Documentation Access:**

- Query up-to-date library docs via Context7
- Access API references without leaving IDE

**Tool Integration:**

- Connect to databases, APIs, file systems
- Extend agent capabilities with external services

**Development Workflows:**

- Automate repetitive tasks
- Access project-specific tools

## Troubleshooting

**MCP server not appearing:**

```bash
# Verify config syntax
cat .claude/mcp.json | jq .

# Check server installation
npx -y <package-name> --version

# Test server manually
npx @modelcontextprotocol/inspector npx -y <package-name>
```

**Antigravity MCP not working:**

- Remember: Antigravity uses global config only
- Edit: `~/.gemini/antigravity/mcp_config.json`
- Restart Antigravity after changes

**Environment variables not loaded:**

- Use `${VARIABLE_NAME}` syntax in configs
- Set in shell profile or `.env` file
- Verify with `echo $VARIABLE_NAME`

## Key Concepts

**Transports:**

- **stdio** - Standard input/output (most common)
- **HTTP** - REST API endpoints
- **SSE** - Server-Sent Events

**Resources:**

- Files, databases, APIs exposed to agents
- Accessed via URI scheme

**Tools:**

- Functions agents can call
- Defined with JSON schemas

**Prompts:**

- Pre-defined prompt templates
- Reusable conversation starters

## Security Considerations

- Never commit API keys in MCP configs
- Use environment variables: `${API_KEY}`
- Validate MCP server sources before installation
- Review server permissions and access scopes

## Related

- [MCP Setup Guide](../guides/mcp/mcp-setup-guide.md) - Detailed setup instructions
- [Antigravity Limitations](../guides/mcp/ANTIGRAVITY_LIMITATION.md) - Platform constraints
- [Sync System](../guides/sync-system.md) - How configuration sync works

## External References

- [MCP Official Site](https://modelcontextprotocol.io)
- [MCP GitHub Organization](https://github.com/modelcontextprotocol)
- [Context7 Dashboard](https://context7.com/dashboard)
- [Anthropic MCP Docs](https://docs.anthropic.com/en/docs/build-with-claude/mcp)

---

_Maintained by LIDR Template Team | Last updated: 2026-02-01_
