# Model Context Protocol (MCP) in Cursor

## Overview

MCP enables Cursor to connect with external tools and data sources. Rather than repeatedly explaining project structure, you can integrate Cursor directly with your tools using servers written in Python, JavaScript, Go, or any language supporting `stdout` or HTTP endpoints.

**Official Documentation:** [cursor.com/docs/context/mcp](https://cursor.com/es/docs/context/mcp)

---

## Transport Methods

Cursor supports three transport approaches:

| Method              | Environment  | Deployment     | Users    | Input             | Auth   |
| ------------------- | ------------ | -------------- | -------- | ----------------- | ------ |
| **stdio**           | Local        | Cursor-managed | Single   | Shell command     | Manual |
| **SSE**             | Local/Remote | Custom server  | Multiple | SSE endpoint URL  | OAuth  |
| **Streamable HTTP** | Local/Remote | Custom server  | Multiple | HTTP endpoint URL | OAuth  |

---

## Protocol Capabilities

Cursor fully supports these MCP features:

- **Tools**: AI-executable functions
- **Prompts**: Templated messages and workflows
- **Resources**: Structured, queryable data sources
- **Roots**: Server-initiated URI/filesystem boundary queries
- **Elicitation**: Server requests for additional user information

---

## Configuration via mcp.json

### Configuration Locations

- **Project-specific**: `.cursor/mcp.json` in your project directory
- **Global**: `~/.cursor/mcp.json` in your home directory

### Local CLI Server (Node.js)

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "mcp-server"],
      "env": {
        "API_KEY": "value"
      }
    }
  }
}
```

### Local CLI Server (Python)

```json
{
  "mcpServers": {
    "server-name": {
      "command": "python",
      "args": ["mcp-server.py"],
      "env": {
        "API_KEY": "value"
      }
    }
  }
}
```

### Remote Server Configuration

```json
{
  "mcpServers": {
    "server-name": {
      "url": "http://localhost:3000/mcp",
      "headers": {
        "API_KEY": "value"
      }
    }
  }
}
```

---

## Static OAuth for Remote Servers

For providers offering fixed OAuth credentials:

```json
{
  "mcpServers": {
    "oauth-server": {
      "url": "https://api.example.com/mcp",
      "auth": {
        "CLIENT_ID": "your-oauth-client-id",
        "CLIENT_SECRET": "your-client-secret",
        "scopes": ["read", "write"]
      }
    }
  }
}
```

**Static Redirect URL**: `cursor://anysphere.cursor-mcp/oauth/callback`

Register this with your OAuth provider. The server is identified via OAuth's `state` parameter, allowing one URL for all servers.

---

## Configuration Interpolation

Use variables in `mcp.json`:

- `${env:NAME}` — environment variables
- `${userHome}` — home directory path
- `${workspaceFolder}` — project root
- `${workspaceFolderBasename}` — project name
- `${pathSeparator}` or `${/}` — OS path separator

**Example:**

```json
{
  "mcpServers": {
    "local-server": {
      "command": "python",
      "args": ["${workspaceFolder}/tools/mcp_server.py"],
      "env": {
        "API_KEY": "${env:API_KEY}"
      }
    }
  }
}
```

---

## STDIO Server Configuration Fields

| Field       | Required | Description               | Examples                              |
| ----------- | -------- | ------------------------- | ------------------------------------- |
| **type**    | Yes      | Connection type           | `"stdio"`                             |
| **command** | Yes      | Server executable command | `"npx"`, `"python"`, `"docker"`       |
| **args**    | No       | Command arguments         | `["server.py", "--port", "3000"]`     |
| **env**     | No       | Environment variables     | `{"API_KEY": "${env:api-key}"}`       |
| **envFile** | No       | Environment file path     | `".env"`, `"${workspaceFolder}/.env"` |

**Note:** `envFile` is STDIO-only; remote servers require environment configuration via shell profile or system settings.

---

## Using MCP in Chat

The agent automatically leverages MCP tools listed under "Available Tools" when appropriate. You can request specific tools by name or describe what you need.

### Tool Approval & Auto-run

- **Default behavior**: Agent requests approval before using tools
- **Inspection**: Click arrow beside tool names to inspect arguments
- **Auto-run**: Enable to allow agent to execute tools without prompting (similar to terminal commands)

### Returning Images

MCP servers can return base64-encoded images:

```javascript
server.tool("generate_image", async (params) => {
  return {
    content: [
      {
        type: "image",
        data: RED_CIRCLE_BASE64,
        mimeType: "image/jpeg",
      },
    ],
  };
});
```

The model analyzes images if it supports vision capabilities.

---

## Extension API Registration

For programmatic MCP server registration without editing `mcp.json`, Cursor provides an Extension API supporting dynamic configuration—particularly valuable for enterprise environments and automated setup workflows.

---

## Debugging

Access MCP logs via:

1. Open Output panel (<kbd>Cmd+Shift+U</kbd>)
2. Select "MCP Logs" from dropdown
3. Review connection errors, authentication issues, or server blockages

---

## Security Considerations

- **Verify server origins**: Install only from trusted developers
- **Review permissions**: Check data access requirements
- **Use restricted API keys**: Minimum required permissions
- **Audit source code**: For critical integrations
- **Store secrets safely**: Environment variables, never hardcode
- **Run sensitive servers locally**: Use `stdio` transport
- **Isolated environments**: For sensitive data handling

---

## Enabling/Disabling Servers

Through Settings (<kbd>Cmd+Shift+J</kbd>) → Features → Model Context Protocol:

- Toggle any server on/off
- Disabled servers don't load or appear in chat
- Useful for troubleshooting or reducing tool clutter

---

## Updating MCP Servers

**For npm-based servers:**

1. Remove the server
2. Run `npm cache clean --force`
3. Reinstall for latest version

**For custom servers:**

1. Update local files
2. Restart Cursor

---

## Best Practices

### Configuration Management

- ✅ Use project-specific `.cursor/mcp.json` for team-shared configurations
- ✅ Use global `~/.cursor/mcp.json` for personal tools
- ✅ Version control project `mcp.json` files
- ✅ Use environment variables for secrets
- ✅ Document required environment variables in README

### Security

- ✅ Review MCP server code before installation
- ✅ Use scoped API keys with minimal permissions
- ✅ Prefer stdio transport for local servers
- ✅ Enable auto-run only for trusted tools
- ❌ Never hardcode credentials in mcp.json
- ❌ Never install servers from unknown sources

### Tool Management

- ✅ Enable only needed tools to reduce clutter
- ✅ Use descriptive server names
- ✅ Test in development before production use
- ✅ Monitor MCP logs for errors
- ❌ Don't enable all tools at once

---

## Troubleshooting

### Server Won't Connect

**Check:**

- Command path is correct
- Required dependencies installed
- Environment variables set
- Network connectivity (for remote servers)

**Solution:**

- Review MCP logs in Output panel
- Test command manually in terminal
- Verify server is running (for remote)

### Tools Not Appearing

**Check:**

- Server is enabled in settings
- No errors in MCP logs
- Server implements tool discovery correctly

**Solution:**

- Restart Cursor
- Disable/re-enable server
- Check server documentation

### Authentication Failures

**Check:**

- API keys are valid
- OAuth credentials correct
- Network access to auth endpoints

**Solution:**

- Verify environment variables
- Re-authenticate OAuth flow
- Check redirect URL configuration

---

## Related Resources

**In This Repository:**

- `docs/references/mcp/mcp-introduction.md` - MCP overview
- `docs/references/mcp/mcp-server-builder.md` - Building MCP servers
- `docs/references/guidelines/team-conventions/third-party-security-guidelines.md` - Security guidelines

**External:**

- [Cursor MCP Documentation](https://cursor.com/es/docs/context/mcp)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP Specification](https://spec.modelcontextprotocol.io/)

---

**Last Updated:** January 2026
**Category:** MCP Integration
**Platform:** Cursor
**Status:** Official Documentation
