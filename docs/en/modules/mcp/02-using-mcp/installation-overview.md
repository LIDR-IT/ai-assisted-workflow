# Installation Overview: Choosing Your Transport Method

Understanding MCP transport methods is critical for successful integration. This guide helps you select the right transport mechanism for your use case and provides quick-start instructions for each approach.

## Overview

MCP (Model Context Protocol) supports three transport methods for client-server communication. Each has distinct characteristics that make it suitable for different deployment scenarios. Choosing the right transport affects performance, security, deployment complexity, and scalability.

**Transport Methods:**
- **Stdio**: Local process communication via standard input/output
- **SSE (Server-Sent Events)**: Streaming updates over HTTP with persistent connections
- **HTTP**: Request-response communication for remote servers

---

## Transport Methods Comparison

### Quick Comparison Table

| Feature | Stdio | SSE | HTTP |
|---------|-------|-----|------|
| **Location** | Local only | Local or Remote | Local or Remote |
| **Performance** | Excellent (no network) | Good (persistent connection) | Good (stateless) |
| **Network Required** | No | Yes | Yes |
| **Authentication** | Process isolation | OAuth, Bearer tokens, API keys | Bearer tokens, API keys |
| **Connection Type** | Synchronous pipes | Persistent streaming | Request-response |
| **Firewall Friendly** | N/A | Yes | Yes |
| **Scalability** | Single machine | High | High |
| **Setup Complexity** | Simple | Moderate | Moderate |
| **Bidirectional** | Yes | Server→Client notifications only | No (request-response only) |
| **Use Cases** | File systems, local DBs, dev tools | Real-time services, cloud APIs | REST APIs, simple remote services |

### Detailed Characteristics

#### Stdio Transport

**What It Is:**
- Direct communication via standard input/output streams
- Server runs as a child process spawned by the client
- Messages exchanged through stdin (client→server) and stdout (server→client)

**Architecture:**
```
┌─────────┐                    ┌─────────┐
│ Client  │  stdin  (write)    │ Server  │
│ Process │───────────────────▶│ Process │
│         │  stdout (read)     │         │
│         │◀───────────────────│         │
└─────────┘                    └─────────┘
```

**Advantages:**
- Zero network overhead
- Excellent performance (direct IPC)
- Simple to implement and debug
- Automatic process lifecycle management
- Inherits client's environment and permissions

**Disadvantages:**
- Local machine only
- Single client per server instance
- No remote access capability
- Requires server executable locally installed

**Best For:**
- File system operations
- Local database access
- Development tools (Git, Docker, npm)
- Custom business logic requiring local execution
- Performance-critical operations
- Secure operations (process isolation)

#### SSE (Server-Sent Events) Transport

**What It Is:**
- HTTP-based transport with persistent connection
- Client sends requests via HTTP POST
- Server streams notifications via Server-Sent Events
- Supports OAuth and complex authentication flows

**Architecture:**
```
┌─────────┐                        ┌─────────┐
│ Client  │  HTTP POST (request)   │ Server  │
│         │───────────────────────▶│         │
│         │  HTTP Response         │         │
│         │◀───────────────────────│         │
│         │                        │         │
│         │  SSE Stream (notifications)     │
│         │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│         │
└─────────┘                        └─────────┘
```

**Advantages:**
- Remote server support
- Real-time server-to-client notifications
- OAuth 2.0 integration
- Firewall-friendly (standard HTTP/HTTPS)
- Scalable server deployment
- Multiple clients supported

**Disadvantages:**
- Network latency
- More complex setup than stdio
- Requires server hosting infrastructure
- Connection management overhead

**Best For:**
- Cloud services and SaaS platforms
- Services requiring OAuth authentication
- Real-time notification requirements
- Multi-user/multi-client scenarios
- Remote API integrations
- Hosted MCP server deployments

#### HTTP Transport

**What It Is:**
- Standard HTTP request-response pattern
- Client sends requests via HTTP POST
- Server responds with JSON-RPC results
- Stateless communication model

**Architecture:**
```
┌─────────┐                        ┌─────────┐
│ Client  │  HTTP POST (request)   │ Server  │
│         │───────────────────────▶│         │
│         │                        │         │
│         │  HTTP Response         │         │
│         │◀───────────────────────│         │
└─────────┘                        └─────────┘
```

**Advantages:**
- Simple stateless communication
- Easy to implement and test
- Standard HTTP tooling available
- Token-based authentication
- Load balancing friendly
- Works with existing REST infrastructure

**Disadvantages:**
- No server-to-client notifications
- Higher latency per request
- Repeated authentication overhead
- Not suitable for streaming data

**Best For:**
- RESTful API integrations
- Simple remote services
- Stateless operations
- Services with token authentication
- Integration with existing HTTP APIs
- Low-frequency tool calls

---

## Decision Tree: Choosing Your Transport

### Start Here

**Question 1: Is your server local or remote?**

- **Local (same machine as client)** → Consider **Stdio** first
- **Remote (different machine/cloud)** → Skip to Question 2

**Question 2: Do you need real-time server notifications?**

- **Yes (server must push updates to client)** → Use **SSE**
- **No (simple request-response)** → Continue to Question 3

**Question 3: What authentication do you need?**

- **OAuth 2.0 or complex auth flows** → Use **SSE**
- **Simple API keys or bearer tokens** → Use **HTTP**
- **Process isolation** → Use **Stdio**

**Question 4: What's your performance requirement?**

- **Lowest latency, highest throughput** → Use **Stdio** (if local)
- **Real-time updates** → Use **SSE**
- **Standard REST performance** → Use **HTTP**

**Question 5: How many clients?**

- **Single client** → **Stdio** works well
- **Multiple clients** → Use **SSE** or **HTTP**

### Decision Matrix

| Your Requirement | Recommended Transport |
|------------------|----------------------|
| File system access | **Stdio** |
| Local database queries | **Stdio** |
| GitHub API integration | **SSE** (supports OAuth) |
| Cloud service (Google, AWS) | **SSE** |
| Custom REST API | **HTTP** |
| Development tools (Git, Docker) | **Stdio** |
| Real-time data streaming | **SSE** |
| Simple token-authenticated API | **HTTP** |
| Maximum performance | **Stdio** |
| Multi-user service | **SSE** or **HTTP** |

---

## Platform Support Matrix

Different AI platforms support transports differently:

| Platform | Stdio | SSE | HTTP | Notes |
|----------|-------|-----|------|-------|
| **Cursor** | ✅ Full | ✅ Full | ✅ Full | All transports fully supported |
| **Claude Code** | ✅ Full | ✅ Full | ✅ Full | Excellent stdio support for plugins |
| **Gemini CLI** | ✅ Full | ✅ Full | ✅ Full | Strong OAuth support |
| **Antigravity** | ✅ Full | ✅ Via proxy | ✅ Via proxy | Uses `mcp-remote` for HTTP/SSE |

**Key Platform Differences:**

**Cursor:**
- Native support for all transports
- Static OAuth redirect URL: `cursor://anysphere.cursor-mcp/oauth/callback`
- Configuration via `.cursor/mcp.json`

**Claude Code:**
- Excellent stdio support for plugins
- MCP servers bundle with plugins
- `.mcp.json` or inline in `plugin.json`

**Gemini CLI:**
- Sophisticated OAuth support with multiple auth types
- Dynamic OAuth discovery
- Google credentials and service account impersonation
- Configuration in `settings.json`

**Antigravity:**
- Uses `npx mcp-remote <url>` for HTTP/SSE servers
- MCP Store for verified servers
- Configuration in `~/.gemini/antigravity/mcp_config.json` or project `.gemini/mcp_config.json`
- Note: uses `serverUrl` instead of `url` for HTTP configs

---

## Quick Start Guides

### Stdio Transport Quick Start

**1. Install Server (Example: Filesystem)**

```bash
# Install MCP server package
npm install -g @modelcontextprotocol/server-filesystem
```

**2. Configure Client**

**Cursor (`.cursor/mcp.json`):**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"],
      "env": {}
    }
  }
}
```

**Claude Code (`.mcp.json` in plugin):**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "${CLAUDE_PLUGIN_ROOT}/workspace"],
      "env": {}
    }
  }
}
```

**Gemini CLI (`settings.json`):**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"],
      "env": {},
      "timeout": 30000
    }
  }
}
```

**Antigravity (`~/.gemini/antigravity/mcp_config.json`):**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"],
      "env": {}
    }
  }
}
```

**3. Test**

```bash
# Cursor: Restart and check MCP logs
# Claude Code: Run /mcp list
# Gemini CLI: Run /mcp or gemini mcp list
# Antigravity: Open MCP Store → Manage MCP Servers
```

### SSE Transport Quick Start

**1. Deploy SSE Server**

Example using Node.js:

```javascript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import express from 'express';

const app = express();
const server = new Server({ name: 'my-server', version: '1.0.0' });

// Define tools
server.setRequestHandler('tools/list', async () => ({
  tools: [{ name: 'example', description: 'Example tool' }]
}));

// SSE endpoint
app.get('/sse', async (req, res) => {
  const transport = new SSEServerTransport('/messages', res);
  await server.connect(transport);
});

app.listen(3000);
```

**2. Configure Client**

**Cursor:**
```json
{
  "mcpServers": {
    "remote-server": {
      "url": "http://localhost:3000/sse",
      "headers": {
        "Authorization": "Bearer ${env:API_TOKEN}"
      }
    }
  }
}
```

**Gemini CLI:**
```json
{
  "mcpServers": {
    "remote-server": {
      "url": "http://localhost:3000/sse",
      "headers": {
        "Authorization": "Bearer ${env:API_TOKEN}"
      }
    }
  }
}
```

**Antigravity:**
```json
{
  "mcpServers": {
    "remote-server": {
      "command": "npx",
      "args": ["mcp-remote", "http://localhost:3000/sse"],
      "env": {}
    }
  }
}
```

### HTTP Transport Quick Start

**1. Configure HTTP Endpoint**

Ensure your server supports HTTP POST at `/mcp`:

```javascript
app.post('/mcp', express.json(), async (req, res) => {
  // Handle JSON-RPC request
  const result = await handleRequest(req.body);
  res.json(result);
});
```

**2. Configure Client**

**Cursor:**
```json
{
  "mcpServers": {
    "http-server": {
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${env:API_TOKEN}"
      }
    }
  }
}
```

**Claude Code:**
```json
{
  "mcpServers": {
    "http-server": {
      "url": "https://api.example.com/mcp",
      "transport": "http",
      "headers": {
        "Authorization": "Bearer ${env:API_TOKEN}"
      }
    }
  }
}
```

**Gemini CLI:**
```json
{
  "mcpServers": {
    "http-server": {
      "httpUrl": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${env:API_TOKEN}"
      }
    }
  }
}
```

---

## Performance Considerations

### Latency Comparison

**Stdio:**
- **Latency**: < 1ms (inter-process communication)
- **Throughput**: Very high (limited by process scheduling)
- **Best for**: Performance-critical operations, frequent small calls

**SSE:**
- **Latency**: 10-100ms (network + processing)
- **Throughput**: Good (persistent connection reduces overhead)
- **Best for**: Real-time updates, moderate call frequency

**HTTP:**
- **Latency**: 10-200ms (network + TLS handshake per request)
- **Throughput**: Moderate (stateless, connection overhead)
- **Best for**: Infrequent calls, simple operations

### Optimization Tips

**Stdio:**
- Keep server logic efficient
- Minimize stdout logging (use stderr)
- Batch operations when possible

**SSE:**
- Maintain persistent connections
- Use connection pooling
- Implement retry logic for reconnection
- Cache authentication tokens

**HTTP:**
- Use HTTP/2 when possible
- Implement client-side caching
- Consider request batching
- Use connection keep-alive

### Resource Usage

| Transport | Memory | CPU | Network |
|-----------|--------|-----|---------|
| Stdio | Low (single process) | Low | None |
| SSE | Moderate (persistent connection) | Low | Moderate (persistent) |
| HTTP | Low (stateless) | Moderate | High (per request) |

---

## Security Implications

### Stdio Security

**Isolation:**
- Process-level isolation via OS
- Inherits client permissions
- No network exposure

**Best Practices:**
- ✅ Use for sensitive local operations
- ✅ Validate all input from client
- ✅ Run with minimal required permissions
- ❌ Don't trust client input blindly
- ❌ Don't expose to network

### SSE Security

**Authentication:**
- OAuth 2.0 support
- Bearer token authentication
- Custom header authentication

**Best Practices:**
- ✅ Always use HTTPS in production
- ✅ Implement OAuth for user-facing services
- ✅ Validate tokens on every request
- ✅ Use short-lived access tokens
- ✅ Implement rate limiting
- ❌ Never use HTTP (unencrypted) for sensitive data
- ❌ Never hardcode tokens in configs

**Example Secure SSE Config:**
```json
{
  "mcpServers": {
    "secure-api": {
      "url": "https://api.example.com/sse",
      "headers": {
        "Authorization": "Bearer ${env:API_TOKEN}"
      }
    }
  }
}
```

### HTTP Security

**Authentication:**
- API key authentication
- Bearer token authentication
- Custom authentication schemes

**Best Practices:**
- ✅ Use HTTPS exclusively
- ✅ Store tokens in environment variables
- ✅ Implement request signing for critical operations
- ✅ Use API keys with minimal required permissions
- ✅ Rotate credentials regularly
- ❌ Never commit credentials to version control
- ❌ Never use HTTP for authenticated requests

**Example Secure HTTP Config:**
```json
{
  "mcpServers": {
    "api": {
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${env:API_KEY}",
        "X-API-Version": "2025-01-01"
      }
    }
  }
}
```

### General Security Guidelines

**Credential Management:**
- Use environment variables: `${env:VAR_NAME}`
- Never hardcode secrets in configuration files
- Use platform-specific secret management when available
- Implement credential rotation policies

**Server Verification:**
- Review server source code before installation
- Use official servers from MCP community
- Verify package signatures (npm, pip)
- Monitor server behavior and logs

**Access Control:**
- Apply principle of least privilege
- Use scoped API keys
- Implement tool-level permissions (Claude Code `allowed_tools`)
- Regularly audit server access

---

## Common Use Cases by Transport

### Local Development Tools (Stdio)

**File System Access:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"]
    }
  }
}
```

**Git Operations:**
```json
{
  "mcpServers": {
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git"]
    }
  }
}
```

**Database (Local):**
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://localhost:5432/mydb"
      }
    }
  }
}
```

### Cloud Services (SSE)

**GitHub Integration:**
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${env:GITHUB_TOKEN}"
      }
    }
  }
}
```

**Google Cloud (Antigravity):**
```json
{
  "mcpServers": {
    "bigquery": {
      "command": "npx",
      "args": ["-y", "@google-cloud/mcp-server-bigquery"]
    }
  }
}
```

### REST APIs (HTTP)

**Custom API:**
```json
{
  "mcpServers": {
    "custom-api": {
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${env:API_TOKEN}",
        "Content-Type": "application/json"
      }
    }
  }
}
```

---

## Troubleshooting by Transport

### Stdio Issues

**Server Won't Start:**
- Check command path is correct
- Verify executable has correct permissions (`chmod +x`)
- Test command manually in terminal
- Check for missing dependencies

**No Output from Server:**
- Ensure server writes JSON-RPC to stdout only
- Move debug logs to stderr
- Check for buffering issues (flush stdout)

**Process Crashes:**
- Review server logs (stderr)
- Check for unhandled exceptions
- Verify environment variables are set
- Test with minimal input

### SSE Issues

**Connection Failures:**
- Verify server is running and accessible
- Check firewall rules
- Confirm correct URL and port
- Test with curl: `curl -N http://localhost:3000/sse`

**Authentication Errors:**
- Verify token is valid
- Check token has required scopes
- Ensure headers are correctly formatted
- Review OAuth flow if applicable

**Disconnections:**
- Implement reconnection logic
- Check server timeout settings
- Monitor network stability
- Review server-side connection limits

### HTTP Issues

**Request Failures:**
- Verify URL is correct
- Check network connectivity
- Confirm server is running
- Test with curl: `curl -X POST http://api.example.com/mcp`

**Timeout Errors:**
- Increase timeout setting
- Optimize server response time
- Check for blocking operations
- Review network latency

**Authentication Rejected:**
- Verify API key is valid
- Check header format
- Ensure token hasn't expired
- Review server authentication requirements

---

## Next Steps

### For Stdio Transport

Continue to platform-specific guides:
- [Cursor Installation](../04-platform-guides/cursor/01-cursor-installation.md)
- [Claude Code Installation](../04-platform-guides/claude-code/01-claude-code-installation.md)
- [Gemini CLI Installation](../04-platform-guides/gemini-cli/01-gemini-cli-installation.md)
- [Antigravity Installation](../04-platform-guides/antigravity/01-antigravity-installation.md)

### For SSE Transport

Learn about:
- [Building MCP Servers](../03-creating-servers/server-basics.md)
- [OAuth Authentication](./authentication.md)
- [Server Deployment](../03-creating-servers/deployment.md)

### For HTTP Transport

Explore:
- [HTTP Server Implementation](../03-creating-servers/http-servers.md)
- [API Integration Patterns](../03-creating-servers/integration-patterns.md)

---

## Related Documentation

- [What is MCP?](../01-fundamentals/what-is-mcp.md) - Core concepts
- [Protocol Architecture](../01-fundamentals/protocol-architecture.md) - Technical details
- [Authentication Guide](./authentication.md) - Security setup
- [Platform Comparison](../04-platform-guides/platform-comparison.md) - Platform differences

---

**Last Updated:** February 2026
**Protocol Version:** 2025-06-18
**Status:** Active Documentation
