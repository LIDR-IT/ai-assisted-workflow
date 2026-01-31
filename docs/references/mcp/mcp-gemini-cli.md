# MCP Server Usage in Gemini CLI

## Overview

MCP (Model Context Protocol) servers extend Gemini CLI capabilities by exposing tools and resources to external systems. They bridge the CLI with APIs, databases, and custom workflows through standardized protocol definitions.

**Official Documentation:** [geminicli.com/docs/tools/mcp-server](https://geminicli.com/docs/tools/mcp-server/)

---

## Core Architecture

The integration operates through two main layers:

### Discovery Layer
- Iterates through configured servers
- Establishes connections
- Fetches tool definitions
- Sanitizes schemas
- Registers tools with conflict resolution

### Execution Layer
- Each tool wrapped in `DiscoveredMCPTool` instance
- Manages confirmations
- Executes calls
- Processes responses for LLM context and user display

---

## Setup and Configuration

### Basic Configuration Structure

Add `mcpServers` object to `settings.json`:

```json
{
  "mcpServers": {
    "serverName": {
      "command": "path/to/server",
      "args": ["--arg1"],
      "env": {"API_KEY": "$MY_API_TOKEN"},
      "timeout": 30000,
      "trust": false
    }
  }
}
```

### Required Properties (Choose One)

- **`command`**: Local executable path (stdio transport)
- **`url`**: SSE endpoint (e.g., `http://localhost:8080/sse`)
- **`httpUrl`**: HTTP streaming endpoint

### Optional Properties

| Property | Purpose |
|----------|---------|
| `args` | Command-line arguments for stdio |
| `headers` | Custom HTTP headers |
| `env` | Environment variables (supports `$VAR_NAME` syntax) |
| `cwd` | Working directory |
| `timeout` | Request timeout in milliseconds (default: 600,000) |
| `trust` | Bypass all confirmations for this server |
| `includeTools` | Allowlist specific tools |
| `excludeTools` | Block specific tools |

---

## Transport Mechanisms

Three transport types supported:

- **Stdio**: Spawns subprocess, communicates via stdin/stdout
- **SSE**: Server-Sent Events endpoints for streaming
- **HTTP Streaming**: Streamable HTTP for communication

---

## Configuration Examples

### Python Server (Stdio)

```json
{
  "mcpServers": {
    "pythonTools": {
      "command": "python",
      "args": ["-m", "my_mcp_server"],
      "env": {"DATABASE_URL": "$DB_CONNECTION_STRING"},
      "timeout": 15000
    }
  }
}
```

### Docker-Based Server

```json
{
  "mcpServers": {
    "dockerServer": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "my-server:latest"],
      "env": {"API_KEY": "$EXTERNAL_TOKEN"}
    }
  }
}
```

### HTTP Server with Authentication

```json
{
  "mcpServers": {
    "httpAuth": {
      "httpUrl": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer your-token",
        "X-Custom-Header": "value"
      }
    }
  }
}
```

---

## OAuth Support

Gemini CLI supports OAuth 2.0 for remote servers with three authentication methods:

### Dynamic Discovery (Default)

```json
{
  "mcpServers": {
    "discoveredServer": {
      "url": "https://api.example.com/sse"
    }
  }
}
```

### Google Credentials

```json
{
  "mcpServers": {
    "googleServer": {
      "httpUrl": "https://service.run.app/mcp",
      "authProviderType": "google_credentials",
      "oauth": {
        "scopes": ["https://www.googleapis.com/auth/userinfo.email"]
      }
    }
  }
}
```

### Service Account Impersonation

```json
{
  "mcpServers": {
    "iapServer": {
      "url": "https://service.run.app/sse",
      "authProviderType": "service_account_impersonation",
      "targetAudience": "YOUR_CLIENT_ID.apps.googleusercontent.com",
      "targetServiceAccount": "sa@project.iam.gserviceaccount.com"
    }
  }
}
```

---

## Discovery Process

When starting, Gemini CLI follows this sequence:

1. **Connection**: Establishes connections to configured servers
2. **Tool Listing**: Fetches available tools from each server
3. **Validation**: Ensures schemas meet Gemini API requirements
4. **Filtering**: Applies `includeTools`/`excludeTools` rules
5. **Conflict Resolution**: Auto-prefixes duplicate tool names (e.g., `serverName__toolName`)
6. **Resource Discovery**: Registers server resources for `@` referencing

---

## Tool Execution Flow

### Confirmation Process

- **Trust bypass**: Skipped if `trust: true`
- **Dynamic allowlisting**: Server or tool-level trust preferences
- **User choice**: Proceed once, always allow tool, always allow server, or cancel

### Response Handling

Tools can return rich, multi-part content including text, images, audio, and binary data. Responses separate into:
- `llmContent` for model context
- `returnDisplay` for user output

---

## Using MCP Servers

### Status and Information

```bash
/mcp
```

Displays:
- All servers
- Connection status
- Available tools
- Discovery state

---

## Managing Servers via CLI

### Add a Server

```bash
gemini mcp add [options] <name> <command> [args...]
gemini mcp add --transport sse my-sse-server https://api.example.com/sse
gemini mcp add -e API_KEY=123 my-server python server.py
```

### List Servers

```bash
gemini mcp list
```

### Remove a Server

```bash
gemini mcp remove <name>
```

### Enable/Disable

```bash
gemini mcp enable <name>
gemini mcp disable <name>
```

---

## Working with Resources

MCP servers expose contextual resources referenced using `@` syntax:

```
@server://resource/path
```

**Features:**
- Resources appear in completion menus alongside filesystem paths
- When submitted, CLI calls `resources/read`
- Content injected into conversation

---

## MCP Prompts as Slash Commands

Servers can expose predefined prompts invoked as commands:

```bash
/poem-writer --title="Gemini CLI" --mood="reverent"
```

The server substitutes arguments into templates and returns prompt text for model execution.

---

## Security Considerations

### Trust Carefully

- **`trust` option**: Bypasses all confirmations
- **Sensitive variables**: Automatically redacted (`*TOKEN*`, `*SECRET*`, `*PASSWORD*`)
- **Explicit configuration**: Define needed environment variables in `env` property
- **Untrusted servers**: Malicious implementations could exfiltrate data

### Best Practices

- ✅ Review server code before installation
- ✅ Use scoped API keys
- ✅ Enable trust only for verified servers
- ✅ Monitor server behavior
- ✅ Use environment variables for secrets
- ❌ Never trust unknown servers
- ❌ Never hardcode sensitive data
- ❌ Never disable all confirmations globally

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Server won't connect | Verify command path, test manually, check permissions |
| No tools discovered | Confirm server registers tools, verify MCP protocol implementation |
| Tools fail to execute | Check parameter schemas, validate input compatibility |
| Sandbox conflicts | Use Docker containers, ensure executables accessible, verify network |

### Debugging

**Enable debug mode:**
```bash
gemini --debug
```

**Check stderr** for server messages

**Test independently** before integration

---

## Advanced Features

### Tool Filtering

**Allowlist specific tools:**
```json
{
  "mcpServers": {
    "server": {
      "command": "server",
      "includeTools": ["tool1", "tool2"]
    }
  }
}
```

**Blocklist specific tools:**
```json
{
  "mcpServers": {
    "server": {
      "command": "server",
      "excludeTools": ["dangerous-tool"]
    }
  }
}
```

### Global Settings

Configure defaults via:
- `mcp.allowed` - Global allowlist
- `mcp.excluded` - Global blocklist

### Rich Content Returns

Tools can return multi-part responses:
- Text content
- Images (base64)
- Audio files
- Binary data

### Schema Sanitization

System automatically removes incompatible properties:
- `$schema`
- `additionalProperties`

---

## Best Practices

### Configuration Management

- ✅ Use project-specific settings for team tools
- ✅ Use global settings for personal utilities
- ✅ Document required environment variables
- ✅ Version control settings files
- ❌ Never commit credentials

### Server Development

- ✅ Implement proper error handling
- ✅ Return meaningful error messages
- ✅ Support graceful shutdown
- ✅ Log important events
- ❌ Don't expose sensitive data in errors

### Performance

- ✅ Set appropriate timeouts
- ✅ Cache expensive operations
- ✅ Use streaming for large responses
- ✅ Filter tools to reduce overhead
- ❌ Don't enable all tools unnecessarily

---

## Related Resources

**In This Repository:**
- `docs/references/mcp/mcp-introduction.md` - MCP overview
- `docs/references/mcp/mcp-server-builder.md` - Building servers
- `docs/references/guidelines/team-conventions/third-party-security-guidelines.md` - Security

**External:**
- [Gemini CLI MCP Documentation](https://geminicli.com/docs/tools/mcp-server/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP Specification](https://spec.modelcontextprotocol.io/)

---

**Last Updated:** January 2026
**Category:** MCP Integration
**Platform:** Gemini CLI
**Status:** Official Documentation
