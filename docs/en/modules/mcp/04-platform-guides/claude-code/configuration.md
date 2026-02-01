# Configuration Reference

A comprehensive guide to configuring MCP servers in Claude Code, covering configuration file locations, environment variables, authentication, and advanced options.

## Configuration File Locations

Claude Code supports MCP server configurations at three different scopes, each serving different use cases.

### Local Scope (Default)

**Storage Location:** `~/.claude.json` under your project's path

**Applies to:** You only, within the current project

**Best for:**
- Personal development servers
- Experimental configurations
- Sensitive credentials not to be shared
- Project-specific personal tools

**Adding a local-scoped server:**

```bash
# Default scope (local)
claude mcp add --transport http stripe https://mcp.stripe.com

# Explicitly specify local scope
claude mcp add --transport http stripe --scope local https://mcp.stripe.com
```

**Important Note:**

MCP "local scope" differs from general local settings:
- **MCP local-scoped servers:** Stored in `~/.claude.json` (home directory)
- **General local settings:** Stored in `.claude/settings.local.json` (project directory)

### Project Scope

**Storage Location:** `.mcp.json` at project root (checked into version control)

**Applies to:** All team members in the project

**Best for:**
- Team-shared servers
- Project-specific tools
- Collaboration services
- Standardized development tools

**Adding a project-scoped server:**

```bash
# Add to project configuration
claude mcp add --transport http paypal --scope project https://mcp.paypal.com/mcp
```

**Resulting `.mcp.json` format:**

```json
{
  "mcpServers": {
    "shared-server": {
      "command": "/path/to/server",
      "args": ["--config", "production"],
      "env": {
        "API_KEY": "${SHARED_API_KEY}"
      }
    }
  }
}
```

**Security Considerations:**

- Claude Code prompts for approval before using project-scoped servers
- Users must explicitly trust project configurations
- Prevents automatic execution of untrusted code

**Reset project approvals:**

```bash
# Clear all project-level trust decisions
claude mcp reset-project-choices
```

### User Scope

**Storage Location:** `~/.claude.json`

**Applies to:** You, across all projects

**Best for:**
- Personal utility servers
- Development tools used everywhere
- Services needed across multiple projects
- Personal productivity tools

**Adding a user-scoped server:**

```bash
# Add to user configuration
claude mcp add --transport http hubspot --scope user https://mcp.hubspot.com/anthropic
```

### Scope Priority

When servers with the same name exist at multiple scopes:

**Precedence Order:** Local > Project > User

Personal configurations override shared ones, allowing you to:
- Test alternative configurations locally
- Override project defaults for specific needs
- Maintain personal preferences across projects

**Example:**

```bash
# User scope (base configuration)
claude mcp add --transport http github --scope user https://api.githubcopilot.com/mcp/

# Project scope (team configuration)
claude mcp add --transport http github --scope project https://api.githubcopilot.com/mcp/

# Local scope (personal override)
claude mcp add --transport http github --scope local https://dev.githubcopilot.com/mcp/
```

The local-scoped configuration takes precedence.

## Configuration File Structure

### Basic Structure

All MCP configuration files follow this schema:

```json
{
  "mcpServers": {
    "server-name": {
      "type": "stdio|http|sse|websocket",
      "command": "executable",
      "args": ["arg1", "arg2"],
      "env": {
        "KEY": "value"
      },
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer token"
      }
    }
  }
}
```

### stdio Configuration

For local MCP servers that run as child processes:

```json
{
  "mcpServers": {
    "local-server": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/dir"],
      "env": {
        "NODE_ENV": "production",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

**Key Fields:**
- `type`: Set to `"stdio"`
- `command`: Executable path or command
- `args`: Array of command-line arguments
- `env`: Environment variables passed to the process

### HTTP Configuration

For remote MCP servers using HTTP transport:

```json
{
  "mcpServers": {
    "remote-api": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}",
        "Content-Type": "application/json",
        "X-API-Version": "2024-01"
      },
      "timeout": 30000,
      "retries": 3
    }
  }
}
```

**Key Fields:**
- `type`: Set to `"http"`
- `url`: Full URL to the MCP endpoint
- `headers`: HTTP headers for authentication and configuration
- `timeout`: Request timeout in milliseconds (optional)
- `retries`: Number of retry attempts (optional)

### SSE Configuration (Deprecated)

**Warning:** SSE (Server-Sent Events) transport is deprecated. Use HTTP servers instead.

```json
{
  "mcpServers": {
    "sse-server": {
      "type": "sse",
      "url": "https://api.example.com/sse",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      }
    }
  }
}
```

### WebSocket Configuration

For real-time bidirectional communication:

```json
{
  "mcpServers": {
    "realtime-server": {
      "type": "websocket",
      "url": "wss://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      },
      "reconnect": true,
      "reconnectInterval": 5000
    }
  }
}
```

**Key Fields:**
- `type`: Set to `"websocket"`
- `url`: WebSocket URL (wss:// for secure)
- `reconnect`: Enable automatic reconnection (optional)
- `reconnectInterval`: Time between reconnect attempts in ms (optional)

## Environment Variables

Claude Code supports environment variable expansion in all configuration files, enabling secure credential management and machine-specific settings.

### Supported Syntax

**Simple expansion:**
```json
{
  "mcpServers": {
    "api": {
      "env": {
        "API_KEY": "${API_TOKEN}"
      }
    }
  }
}
```

**With default values:**
```json
{
  "mcpServers": {
    "api": {
      "url": "${API_BASE_URL:-https://api.example.com}/mcp",
      "env": {
        "LOG_LEVEL": "${LOG_LEVEL:-info}"
      }
    }
  }
}
```

Syntax:
- `${VAR}`: Expands to the value of `VAR`
- `${VAR:-default}`: Expands to `VAR` if set, otherwise uses `default`

### Expansion Locations

Variables can be expanded in these configuration fields:

**1. Command and Arguments (stdio servers):**

```json
{
  "mcpServers": {
    "custom-server": {
      "command": "${CUSTOM_SERVER_PATH:-npx}",
      "args": ["-y", "${SERVER_PACKAGE}"]
    }
  }
}
```

**2. Environment Variables:**

```json
{
  "mcpServers": {
    "database": {
      "env": {
        "DATABASE_URL": "${DATABASE_URL}",
        "DB_POOL_SIZE": "${DB_POOL_SIZE:-10}",
        "DB_TIMEOUT": "${DB_TIMEOUT:-5000}"
      }
    }
  }
}
```

**3. URLs (remote servers):**

```json
{
  "mcpServers": {
    "api": {
      "type": "http",
      "url": "${API_BASE_URL}/mcp/v1"
    }
  }
}
```

**4. Headers (authentication):**

```json
{
  "mcpServers": {
    "api": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}",
        "X-API-Key": "${API_KEY}",
        "X-Tenant-ID": "${TENANT_ID:-default}"
      }
    }
  }
}
```

### Setting Environment Variables

**For a single session:**

```bash
# Set variable and run Claude
export API_TOKEN="your-token-here"
export DATABASE_URL="postgresql://user:pass@host:5432/db"
claude
```

**For persistent configuration:**

Create `.env` file in your project:

```bash
# .env
API_TOKEN=your-token-here
DATABASE_URL=postgresql://user:pass@host:5432/db
LOG_LEVEL=debug
```

Load before running:

```bash
# Load .env and run Claude
source .env
claude
```

**For system-wide configuration:**

Add to shell profile (`~/.bashrc`, `~/.zshrc`, etc.):

```bash
# ~/.zshrc
export API_TOKEN="your-token-here"
export DATABASE_URL="postgresql://user:pass@host:5432/db"
```

**For Claude Code settings:**

Add to `.claude/settings.json`:

```json
{
  "env": {
    "API_TOKEN": "your-token-here",
    "DATABASE_URL": "postgresql://user:pass@host:5432/db"
  }
}
```

### Error Handling

If a required variable is not set and has no default, Claude Code will fail to parse the configuration:

```bash
# Error message
Error: Required environment variable not set: API_TOKEN
Failed to parse .mcp.json configuration
```

**Best practice:** Always provide sensible defaults or clear error messages:

```json
{
  "mcpServers": {
    "api": {
      "url": "${API_URL:-https://api.example.com}",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      }
    }
  }
}
```

### Built-in Variables

**`${CLAUDE_PLUGIN_ROOT}`** (Plugin MCP servers only):

Points to the plugin's root directory for portable path resolution:

```json
{
  "mcpServers": {
    "plugin-server": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/server/index.js"],
      "env": {
        "CONFIG_PATH": "${CLAUDE_PLUGIN_ROOT}/config.json"
      }
    }
  }
}
```

## Authentication and Headers

### Bearer Token Authentication

Most common for API authentication:

```json
{
  "mcpServers": {
    "api-server": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      }
    }
  }
}
```

**Using CLI:**

```bash
# Add with Bearer token
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer your-token"
```

### API Key Authentication

For services using API key headers:

```json
{
  "mcpServers": {
    "api-server": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "headers": {
        "X-API-Key": "${API_KEY}"
      }
    }
  }
}
```

**Using CLI:**

```bash
# Add with API key
claude mcp add --transport http api-server https://api.example.com/mcp \
  --header "X-API-Key: your-api-key"
```

### Custom Headers

Add any custom headers required by your service:

```json
{
  "mcpServers": {
    "custom-api": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}",
        "X-Custom-Header": "custom-value",
        "X-Tenant-ID": "${TENANT_ID}",
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Claude-Code/1.0"
      }
    }
  }
}
```

### OAuth 2.0 Configuration

Claude Code supports OAuth 2.0 authentication flows for remote servers.

**Step 1: Add server that requires OAuth:**

```bash
# Add OAuth-enabled server
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
```

**Step 2: Initiate authentication:**

Within Claude Code:

```
> /mcp
```

Follow the browser prompts to complete OAuth flow.

**OAuth Features:**
- Tokens stored securely in system keychain
- Automatic token refresh
- Clear authentication via `/mcp` menu
- Works with HTTP and SSE transports

**Manual OAuth configuration:**

Some servers may require manual OAuth setup:

```json
{
  "mcpServers": {
    "oauth-service": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "oauth": {
        "clientId": "${OAUTH_CLIENT_ID}",
        "clientSecret": "${OAUTH_CLIENT_SECRET}",
        "tokenUrl": "https://auth.example.com/oauth/token",
        "authUrl": "https://auth.example.com/oauth/authorize",
        "scope": "read write",
        "redirectUri": "http://localhost:8080/callback"
      }
    }
  }
}
```

### Basic Authentication

For services using HTTP Basic Auth:

```json
{
  "mcpServers": {
    "basic-auth-api": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Basic ${BASE64_CREDENTIALS}"
      }
    }
  }
}
```

Generate Base64 credentials:

```bash
# Create Base64-encoded credentials
echo -n "username:password" | base64
# dXNlcm5hbWU6cGFzc3dvcmQ=

# Set environment variable
export BASE64_CREDENTIALS="dXNlcm5hbWU6cGFzc3dvcmQ="
```

### Multiple Authentication Methods

Combine authentication methods when needed:

```json
{
  "mcpServers": {
    "multi-auth": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}",
        "X-API-Key": "${API_KEY}",
        "X-Client-ID": "${CLIENT_ID}",
        "X-Secret": "${CLIENT_SECRET}"
      }
    }
  }
}
```

## Advanced Configuration Options

### Timeout Configuration

Control how long Claude Code waits for MCP server responses.

**MCP Server Startup Timeout:**

```bash
# Set 10-second startup timeout
MCP_TIMEOUT=10000 claude
```

**Request Timeout (HTTP servers):**

```json
{
  "mcpServers": {
    "slow-api": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "timeout": 60000,
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      }
    }
  }
}
```

Default timeouts:
- **Startup:** 5000ms (5 seconds)
- **HTTP requests:** 30000ms (30 seconds)

### Retry Configuration

Configure automatic retry behavior for failed requests.

**Retry settings:**

```json
{
  "mcpServers": {
    "resilient-api": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "retries": 5,
      "retryDelay": 1000,
      "retryBackoff": 2.0,
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      }
    }
  }
}
```

**Fields:**
- `retries`: Number of retry attempts (default: 3)
- `retryDelay`: Initial delay between retries in ms (default: 1000)
- `retryBackoff`: Exponential backoff multiplier (default: 2.0)

**Retry behavior:**
- 1st retry: 1000ms delay
- 2nd retry: 2000ms delay (1000 × 2.0)
- 3rd retry: 4000ms delay (2000 × 2.0)
- 4th retry: 8000ms delay (4000 × 2.0)
- 5th retry: 16000ms delay (8000 × 2.0)

### Output Token Limits

Control maximum tokens returned by MCP tool outputs.

**Default limits:**
- **Warning threshold:** 10,000 tokens
- **Default maximum:** 25,000 tokens

**Increase output limit:**

```bash
# Set higher limit (50,000 tokens)
export MAX_MCP_OUTPUT_TOKENS=50000
claude
```

**Use cases:**
- Querying large datasets or databases
- Generating detailed reports or documentation
- Processing extensive log files
- Retrieving large code files

**Best practice:** If you frequently encounter output warnings, consider:
- Increasing the limit for specific use cases
- Configuring the server to paginate responses
- Implementing filtering on the server side

### Connection Pooling

For HTTP servers with high request volume:

```json
{
  "mcpServers": {
    "high-volume-api": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "connectionPool": {
        "maxConnections": 10,
        "keepAlive": true,
        "keepAliveTimeout": 30000
      },
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      }
    }
  }
}
```

### Logging Configuration

Control MCP server logging verbosity:

```json
{
  "mcpServers": {
    "debug-server": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@my-org/mcp-server"],
      "env": {
        "LOG_LEVEL": "${LOG_LEVEL:-info}",
        "LOG_FORMAT": "json",
        "LOG_OUTPUT": "/tmp/mcp-server.log"
      }
    }
  }
}
```

**Log levels:**
- `error`: Only errors
- `warn`: Errors and warnings
- `info`: General information (default)
- `debug`: Detailed debugging
- `trace`: Extremely verbose

### Resource Limits

Limit resource consumption for local MCP servers:

```json
{
  "mcpServers": {
    "resource-limited": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@my-org/mcp-server"],
      "env": {
        "NODE_OPTIONS": "--max-old-space-size=512",
        "MAX_CPU_PERCENT": "25"
      }
    }
  }
}
```

## Configuration Examples

### Example 1: GitHub Integration

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      },
      "timeout": 30000,
      "retries": 3
    }
  }
}
```

**Using CLI:**

```bash
# Add GitHub server
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# Authenticate via OAuth
> /mcp
```

### Example 2: PostgreSQL Database

```json
{
  "mcpServers": {
    "postgres": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "${DATABASE_URL}",
        "POSTGRES_MAX_CONNECTIONS": "${DB_POOL_SIZE:-5}",
        "POSTGRES_QUERY_TIMEOUT": "${DB_TIMEOUT:-10000}"
      }
    }
  }
}
```

**Using CLI:**

```bash
# Add PostgreSQL server
claude mcp add --transport stdio \
  --env POSTGRES_CONNECTION_STRING="${DATABASE_URL}" \
  postgres -- npx -y @modelcontextprotocol/server-postgres
```

### Example 3: File System Access

```json
{
  "mcpServers": {
    "filesystem": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "${WORKSPACE_PATH:-/home/user/projects}"
      ],
      "env": {
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

**Using CLI:**

```bash
# Add filesystem server
claude mcp add --transport stdio filesystem \
  -- npx -y @modelcontextprotocol/server-filesystem /home/user/projects
```

### Example 4: Multiple Environment Configs

Different configurations for development, staging, and production:

```json
{
  "mcpServers": {
    "api-dev": {
      "type": "http",
      "url": "${DEV_API_URL:-https://dev.api.example.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${DEV_API_TOKEN}",
        "X-Environment": "development"
      },
      "timeout": 60000
    },
    "api-staging": {
      "type": "http",
      "url": "${STAGING_API_URL:-https://staging.api.example.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${STAGING_API_TOKEN}",
        "X-Environment": "staging"
      },
      "timeout": 45000
    },
    "api-prod": {
      "type": "http",
      "url": "${PROD_API_URL:-https://api.example.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${PROD_API_TOKEN}",
        "X-Environment": "production"
      },
      "timeout": 30000,
      "retries": 5
    }
  }
}
```

### Example 5: Sentry Error Monitoring

```json
{
  "mcpServers": {
    "sentry": {
      "type": "http",
      "url": "https://mcp.sentry.dev/mcp",
      "oauth": true,
      "timeout": 30000,
      "headers": {
        "Content-Type": "application/json"
      }
    }
  }
}
```

**Using CLI:**

```bash
# Add Sentry with OAuth
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

# Authenticate
> /mcp
```

### Example 6: Custom Internal API

```json
{
  "mcpServers": {
    "company-internal": {
      "type": "http",
      "url": "${INTERNAL_API_URL}/mcp/v1",
      "headers": {
        "Authorization": "Bearer ${INTERNAL_API_TOKEN}",
        "X-Company-ID": "${COMPANY_ID}",
        "X-Team-ID": "${TEAM_ID}",
        "X-User-ID": "${USER_ID}"
      },
      "timeout": 45000,
      "retries": 3,
      "retryDelay": 2000
    }
  }
}
```

### Example 7: Slack Integration

```json
{
  "mcpServers": {
    "slack": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "${SLACK_TEAM_ID}"
      }
    }
  }
}
```

**Using CLI:**

```bash
# Add Slack server
claude mcp add --transport stdio \
  --env SLACK_BOT_TOKEN="${SLACK_BOT_TOKEN}" \
  --env SLACK_TEAM_ID="${SLACK_TEAM_ID}" \
  slack -- npx -y @modelcontextprotocol/server-slack
```

### Example 8: Google Drive

```json
{
  "mcpServers": {
    "gdrive": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gdrive"],
      "env": {
        "GDRIVE_CLIENT_ID": "${GOOGLE_CLIENT_ID}",
        "GDRIVE_CLIENT_SECRET": "${GOOGLE_CLIENT_SECRET}",
        "GDRIVE_REDIRECT_URI": "http://localhost:8080/callback"
      }
    }
  }
}
```

### Example 9: WebSocket Real-time Server

```json
{
  "mcpServers": {
    "realtime-updates": {
      "type": "websocket",
      "url": "wss://realtime.api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${REALTIME_TOKEN}"
      },
      "reconnect": true,
      "reconnectInterval": 5000,
      "maxReconnectAttempts": 10
    }
  }
}
```

### Example 10: Multi-Service Plugin

For plugins bundling multiple MCP servers:

```json
{
  "mcpServers": {
    "database": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/servers/database.js"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    },
    "api": {
      "type": "http",
      "url": "${API_URL}",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      }
    },
    "cache": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/servers/cache.js"],
      "env": {
        "REDIS_URL": "${REDIS_URL}"
      }
    }
  }
}
```

## Configuration Management Commands

### View Configuration

```bash
# List all configured servers
claude mcp list

# Get details for specific server
claude mcp get github

# Show configuration file location
claude mcp config-path
```

### Modify Configuration

```bash
# Add new server
claude mcp add --transport http myserver https://api.example.com/mcp

# Add with JSON
claude mcp add-json myserver '{"type":"http","url":"https://api.example.com/mcp"}'

# Remove server
claude mcp remove myserver

# Update server (remove and re-add)
claude mcp remove myserver
claude mcp add --transport http myserver https://new-api.example.com/mcp
```

### Import Configuration

```bash
# Import from Claude Desktop
claude mcp add-from-claude-desktop

# Import from JSON file
cat servers.json | jq .myserver | xargs -0 claude mcp add-json myserver
```

### Verify Configuration

```bash
# Test server connection
claude mcp test myserver

# Check server status
> /mcp

# View server logs
> /mcp logs myserver
```

## Troubleshooting Configuration

### Configuration Not Loading

**Symptom:** Changes to `.mcp.json` not reflected

**Solutions:**
```bash
# Verify file location
pwd
ls -la .mcp.json

# Check JSON syntax
cat .mcp.json | jq .

# Reload Claude Code
# Exit and restart Claude

# Check for scope conflicts
claude mcp list
```

### Environment Variables Not Expanding

**Symptom:** Variables appear as literal `${VAR}` strings

**Solutions:**
```bash
# Verify variable is set
echo $API_TOKEN

# Export variable if needed
export API_TOKEN="your-token"

# Check variable spelling in config
cat .mcp.json | grep API_TOKEN

# Restart Claude Code
```

### Authentication Failures

**Symptom:** 401 Unauthorized or 403 Forbidden

**Solutions:**
```bash
# Verify token is valid
curl -H "Authorization: Bearer $API_TOKEN" https://api.example.com/test

# Check token permissions
# Review API documentation for required scopes

# Regenerate token
# Visit service provider dashboard

# Clear and re-authenticate (OAuth)
> /mcp
# Select "Clear authentication"
```

### Server Not Starting

**Symptom:** MCP server fails to connect

**Solutions:**
```bash
# Check server logs
> /mcp logs myserver

# Test server manually
npx -y @my-org/mcp-server

# Verify command path
which npx
which node

# Check environment variables
env | grep API

# Increase startup timeout
MCP_TIMEOUT=15000 claude
```

### Configuration Conflicts

**Symptom:** Unexpected server configuration

**Solutions:**
```bash
# Check all scopes
claude mcp list

# Remove conflicting configurations
claude mcp remove --scope local myserver
claude mcp remove --scope project myserver
claude mcp remove --scope user myserver

# Re-add with correct scope
claude mcp add --scope project myserver ...
```

## Best Practices

### 1. Use Environment Variables for Secrets

```json
{
  "mcpServers": {
    "api": {
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      }
    }
  }
}
```

Never hardcode credentials in configuration files.

### 2. Provide Sensible Defaults

```json
{
  "mcpServers": {
    "api": {
      "url": "${API_URL:-https://api.example.com}/mcp",
      "timeout": "${API_TIMEOUT:-30000}"
    }
  }
}
```

### 3. Document Required Variables

Create `.env.example`:

```bash
# Required API credentials
API_TOKEN=your_token_here
DATABASE_URL=postgresql://user:pass@host:5432/db

# Optional configuration
API_TIMEOUT=30000
LOG_LEVEL=info
```

### 4. Use Appropriate Scopes

- **Local:** Personal development, experiments
- **Project:** Team-shared, checked into version control
- **User:** Personal tools across all projects

### 5. Configure Timeouts Appropriately

Match timeouts to expected response times:
- Fast APIs: 5-15 seconds
- Standard APIs: 30 seconds (default)
- Long-running operations: 60+ seconds

### 6. Implement Retry Logic for Reliability

```json
{
  "retries": 3,
  "retryDelay": 1000,
  "retryBackoff": 2.0
}
```

### 7. Use HTTPS and WSS

Always use secure protocols for remote servers:
- `https://` for HTTP servers
- `wss://` for WebSocket servers

### 8. Version Control Project Configurations

Commit `.mcp.json` to version control for team consistency, but use environment variables for sensitive data.

### 9. Test Configurations

```bash
# Test before committing
claude mcp test myserver

# Verify in conversation
> /mcp
```

### 10. Monitor and Log

Enable appropriate logging for troubleshooting:

```json
{
  "env": {
    "LOG_LEVEL": "${LOG_LEVEL:-info}"
  }
}
```

## Related Resources

### In This Guide
- [Installation Guide](installation.md) - Installing MCP servers
- [Usage Guide](usage.md) - Using MCP servers in conversations
- [Troubleshooting](troubleshooting.md) - Common issues and solutions

### External Resources
- [Official MCP Documentation](https://modelcontextprotocol.io)
- [Claude Code Documentation](https://code.claude.com/docs/en/mcp)
- [MCP Server Registry](https://github.com/modelcontextprotocol/servers)
- [MCP SDK](https://modelcontextprotocol.io/quickstart/server)

---

**Last Updated:** February 2026
**Category:** Platform Guide - Claude Code
**Related:** Installation, Usage, Authentication, Advanced Configuration
