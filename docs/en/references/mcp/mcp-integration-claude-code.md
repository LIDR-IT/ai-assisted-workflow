# MCP Integration for Claude Code

## Overview

**MCP Integration** is a skill that enables Claude Code plugins to leverage the **Model Context Protocol (MCP)**, allowing structured integration with external services through tool access.

**Source:** [skills.sh/anthropics/claude-code/mcp-integration](https://skills.sh/anthropics/claude-code/mcp-integration)
**Provider:** Anthropic
**Category:** Claude Code Plugin Development

## What is Model Context Protocol (MCP)?

**Model Context Protocol** is a framework that enables Claude Code plugins to integrate with external services and APIs by providing structured tool access. It acts as a bridge between Claude Code and external capabilities, allowing plugins to:

- Connect to external services (databases, APIs, file systems)
- Provide 10+ related tools from a single service
- Handle OAuth and complex authentication flows
- Bundle MCP servers with plugins for automatic setup

## Key Capabilities

### External Service Integration

- **Databases**: Connect to SQL, NoSQL, and other database systems
- **APIs**: Integrate with REST, GraphQL, and custom APIs
- **File Systems**: Access local or remote file systems
- **Cloud Services**: Connect to AWS, Google Cloud, Azure, etc.

### Multi-Tool Support

- Expose multiple related tools from a single MCP server
- Group related functionality under one service connection
- Reduce configuration overhead

### Authentication Management

- **OAuth Flows**: Handle complex OAuth 2.0 authentication
- **Token Management**: Secure token storage and refresh
- **API Keys**: Support for API key authentication
- **Custom Auth**: Implement custom authentication schemes

### Automatic Setup

- Bundle MCP servers with plugins
- Automatic installation and configuration
- Seamless user experience

## Configuration Methods

### Method 1: Dedicated .mcp.json (Recommended)

Create a separate configuration file at the plugin root.

**Advantages:**

- Clear separation of concerns
- Easier maintenance
- Better support for multiple servers
- Cleaner plugin.json structure

**File Structure:**

```
my-plugin/
├── plugin.json
├── .mcp.json
├── commands/
└── README.md
```

**Example .mcp.json:**

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "${DATABASE_URL}"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

### Method 2: Inline in plugin.json

Add `mcpServers` field directly to plugin.json.

**Advantages:**

- Simpler for single-server plugins
- All configuration in one file
- Quick setup

**Disadvantages:**

- Less scalable for multiple servers
- Mixes plugin metadata with MCP config

**Example plugin.json:**

```json
{
  "name": "database-plugin",
  "description": "Database integration plugin",
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "${DATABASE_URL}"
      }
    }
  }
}
```

## MCP Server Types

### 1. stdio (Local Process)

Execute local MCP servers as child processes.

**Best For:**

- File systems
- Local databases
- Custom servers
- Tools requiring local execution

**Configuration Example:**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/directory"],
      "env": {}
    }
  }
}
```

**Characteristics:**

- Process spawned locally
- Direct stdin/stdout communication
- Full control over execution
- Best performance for local operations

### 2. SSE (Server-Sent Events)

Connect to hosted MCP servers with OAuth support.

**Best For:**

- Cloud services
- OAuth-protected APIs
- Hosted MCP servers
- Services requiring persistent connections

**Configuration Example:**

```json
{
  "mcpServers": {
    "cloud-service": {
      "url": "https://api.example.com/mcp",
      "transport": "sse",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      }
    }
  }
}
```

**Characteristics:**

- Server-sent events for updates
- OAuth flow support
- Remote server connectivity
- Automatic reconnection

### 3. HTTP (REST API)

Connect to RESTful servers with token authentication.

**Best For:**

- Stateless API interactions
- REST endpoints
- Simple token authentication
- Request/response patterns

**Configuration Example:**

```json
{
  "mcpServers": {
    "rest-api": {
      "url": "https://api.example.com/mcp",
      "transport": "http",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}",
        "Content-Type": "application/json"
      }
    }
  }
}
```

**Characteristics:**

- Standard HTTP requests
- Token-based auth
- Stateless communication
- Simple integration

### 4. WebSocket (Real-time)

Enable bidirectional communication for streaming data.

**Best For:**

- Streaming data
- Real-time updates
- Persistent connections
- Bidirectional communication

**Configuration Example:**

```json
{
  "mcpServers": {
    "realtime-service": {
      "url": "wss://api.example.com/mcp",
      "transport": "websocket",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      }
    }
  }
}
```

**Characteristics:**

- Full-duplex communication
- Real-time data streaming
- Persistent connection
- Low latency

## Environment Variables

All configurations support environment variable substitution for security and portability.

### Built-in Variables

**`${CLAUDE_PLUGIN_ROOT}`**

- Points to the plugin's root directory
- Ensures portability across installations
- Use for relative paths within plugin

**Example:**

```json
{
  "mcpServers": {
    "local-server": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/server/index.js"]
    }
  }
}
```

### User Environment Variables

Access any environment variable set by the user:

```json
{
  "mcpServers": {
    "github": {
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}",
        "DATABASE_URL": "${DATABASE_URL}",
        "API_KEY": "${MY_API_KEY}"
      }
    }
  }
}
```

### Best Practices for Environment Variables

1. **Never hardcode secrets**: Always use environment variables
2. **Document required vars**: List in README.md
3. **Provide .env.example**: Template for users
4. **Validate at runtime**: Check for missing variables
5. **Use descriptive names**: Clear variable purposes

## MCP Tool Naming

Tools automatically receive prefixes to avoid naming conflicts:

### Naming Convention

```
mcp__plugin_<plugin-name>_<server-name>__<tool-name>
```

### Example

If you have:

- Plugin name: `database-tools`
- Server name: `postgres`
- Tool name: `query`

The full tool name becomes:

```
mcp__plugin_database-tools_postgres__query
```

### Using Tools in Commands

**Pre-allow specific tools** in command frontmatter:

```markdown
---
name: query-database
description: Query the database
allowed_tools:
  - mcp__plugin_database-tools_postgres__query
  - mcp__plugin_database-tools_postgres__execute
---

Query the database using the provided SQL statement.
```

**Avoid wildcards** for security:

```markdown
# ❌ Don't do this

allowed_tools:

- mcp\__plugin_database-tools_\*

# ✅ Do this instead

allowed_tools:

- mcp**plugin_database-tools_postgres**query
- mcp**plugin_database-tools_postgres**execute
```

## Implementation Workflow

### Step 1: Select Server Type

Choose the appropriate MCP server type based on your integration needs:

- **stdio**: Local processes, file systems
- **SSE**: Cloud services, OAuth
- **HTTP**: REST APIs, simple auth
- **WebSocket**: Real-time, streaming

### Step 2: Create .mcp.json

Create configuration file with server details:

```json
{
  "mcpServers": {
    "my-service": {
      "command": "npx",
      "args": ["-y", "@my-org/mcp-server"],
      "env": {
        "API_TOKEN": "${MY_SERVICE_TOKEN}"
      }
    }
  }
}
```

### Step 3: Document Environment Variables

Create README.md with setup instructions:

```markdown
## Setup

1. Install the plugin
2. Set required environment variables:
   - `MY_SERVICE_TOKEN`: Your API token from https://myservice.com/settings
3. Reload Claude Code
```

Create .env.example:

```bash
# My Service API Token
MY_SERVICE_TOKEN=your_token_here
```

### Step 4: Test Locally

Use the `/mcp` command to test your MCP integration:

```bash
/mcp list
/mcp test my-service
```

### Step 5: Pre-allow Tools in Commands

Add allowed_tools to command frontmatter:

```markdown
---
name: my-command
allowed_tools:
  - mcp__plugin_my-plugin_my-service__tool1
  - mcp__plugin_my-plugin_my-service__tool2
---
```

### Step 6: Handle Authentication and Errors

Implement error handling:

```markdown
## Troubleshooting

**Error: Missing API token**

- Set the `MY_SERVICE_TOKEN` environment variable
- Get your token from https://myservice.com/settings

**Error: Connection refused**

- Check your internet connection
- Verify the service is accessible
```

### Step 7: Document Integration

Update README with:

- Overview of MCP integration
- Required environment variables
- Setup instructions
- Available tools
- Usage examples
- Troubleshooting guide

## Security Best Practices

### 1. Always Use Secure Connections

```json
{
  "mcpServers": {
    "secure-api": {
      "url": "https://api.example.com", // ✅ HTTPS
      "transport": "http"
    }
  }
}
```

```json
{
  "mcpServers": {
    "secure-ws": {
      "url": "wss://api.example.com", // ✅ WSS (secure WebSocket)
      "transport": "websocket"
    }
  }
}
```

### 2. Store Tokens in Environment Variables

```json
// ❌ Don't do this
{
  "mcpServers": {
    "api": {
      "env": {
        "API_TOKEN": "hardcoded-secret-token-123"
      }
    }
  }
}
```

```json
// ✅ Do this
{
  "mcpServers": {
    "api": {
      "env": {
        "API_TOKEN": "${MY_API_TOKEN}"
      }
    }
  }
}
```

### 3. Pre-allow Only Required Tools

```markdown
---
# ❌ Too permissive
allowed_tools:
  - mcp__*

# ✅ Specific tools only
allowed_tools:
  - mcp__plugin_myapp_api__read
  - mcp__plugin_myapp_api__write
---
```

### 4. Validate Configuration

Add validation in your plugin:

```javascript
// Validate required environment variables
const requiredVars = ["API_TOKEN", "DATABASE_URL"];
const missing = requiredVars.filter((v) => !process.env[v]);

if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
}
```

### 5. Handle Sensitive Data

- Never log sensitive data
- Sanitize error messages
- Use secure credential storage
- Implement token rotation

## Practical Examples

### Example 1: PostgreSQL Database Integration

**Plugin Structure:**

```
postgres-plugin/
├── plugin.json
├── .mcp.json
├── .env.example
└── README.md
```

**.mcp.json:**

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "${DATABASE_URL}"
      }
    }
  }
}
```

**.env.example:**

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

**Command (commands/query.md):**

```markdown
---
name: query-db
description: Execute SQL queries
allowed_tools:
  - mcp__plugin_postgres_postgres__query
---

Execute the provided SQL query on the PostgreSQL database.
```

### Example 2: GitHub API Integration

**.mcp.json:**

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**Available Tools:**

- `mcp__plugin_github_github__list_repos`
- `mcp__plugin_github_github__create_issue`
- `mcp__plugin_github_github__get_pr`
- `mcp__plugin_github_github__merge_pr`

### Example 3: File System Integration

**.mcp.json:**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "${CLAUDE_PLUGIN_ROOT}/workspace"]
    }
  }
}
```

**Available Tools:**

- `mcp__plugin_fs_filesystem__read_file`
- `mcp__plugin_fs_filesystem__write_file`
- `mcp__plugin_fs_filesystem__list_directory`
- `mcp__plugin_fs_filesystem__delete_file`

### Example 4: Custom MCP Server

**Custom Server (server/index.js):**

```javascript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({
  name: "my-custom-server",
  version: "1.0.0",
});

// Define tools
server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "custom_tool",
      description: "My custom tool",
      inputSchema: {
        type: "object",
        properties: {
          input: { type: "string" },
        },
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "custom_tool") {
    return {
      content: [
        {
          type: "text",
          text: `Processed: ${args.input}`,
        },
      ],
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

**.mcp.json:**

```json
{
  "mcpServers": {
    "custom": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/server/index.js"]
    }
  }
}
```

## Troubleshooting

### MCP Server Not Starting

**Symptom:** Server fails to start or connect

**Solutions:**

```bash
# Check MCP server logs
/mcp logs my-server

# Verify environment variables are set
echo $MY_API_TOKEN

# Test MCP server manually
npx @my-org/mcp-server

# Check for conflicting processes
ps aux | grep mcp
```

### Tools Not Appearing

**Symptom:** MCP tools not showing up in Claude Code

**Solutions:**

```bash
# List MCP servers
/mcp list

# Reload plugin
/plugin reload my-plugin

# Check tool naming
# Ensure tools follow: mcp__plugin_<plugin>_<server>__<tool>

# Verify allowed_tools in command frontmatter
```

### Authentication Failures

**Symptom:** 401 Unauthorized or 403 Forbidden errors

**Solutions:**

- Verify API token is set correctly
- Check token has required permissions
- Test token with curl or API client
- Regenerate token if expired
- Review authentication flow in MCP server

### Environment Variable Not Substituted

**Symptom:** Variables appear as literal `${VAR}` strings

**Solutions:**

- Ensure variable is exported in shell
- Restart Claude Code after setting variables
- Check variable name spelling
- Use `.env` file with proper loading
- Verify no special characters in variable names

## Official MCP Servers

Popular MCP servers from the community:

| Server       | Purpose           | Package                                   |
| ------------ | ----------------- | ----------------------------------------- |
| PostgreSQL   | Database queries  | `@modelcontextprotocol/server-postgres`   |
| GitHub       | GitHub API access | `@modelcontextprotocol/server-github`     |
| File System  | File operations   | `@modelcontextprotocol/server-filesystem` |
| Google Drive | Drive integration | `@modelcontextprotocol/server-gdrive`     |
| Slack        | Slack messaging   | `@modelcontextprotocol/server-slack`      |

## Resources

- **Skill Page:** [skills.sh/anthropics/claude-code/mcp-integration](https://skills.sh/anthropics/claude-code/mcp-integration)
- **MCP Documentation:** [modelcontextprotocol.io](https://modelcontextprotocol.io)
- **Claude Code Docs:** [docs.anthropic.com/claude-code](https://docs.anthropic.com/claude-code)
- **MCP SDK:** [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk)

---

**Last Updated:** January 2026
**Status:** Active
**Provider:** Anthropic
**Category:** Plugin Development
