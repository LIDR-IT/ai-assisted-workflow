# Gemini CLI Configuration

Complete reference for configuring MCP servers in Gemini CLI, including all properties, authentication methods, tool filtering, and advanced scenarios.

## Overview

Gemini CLI uses a `settings.json` file to configure MCP servers. Each server is defined within the `mcpServers` object with properties that determine how the CLI connects, authenticates, and interacts with the server.

**Location:**
- **Project-level:** `.gemini/settings.json`
- **User-level:** `~/.gemini/settings.json`

**Configuration hierarchy:** Project-level settings override user-level settings.

---

## Basic Configuration Structure

```json
{
  "mcpServers": {
    "serverName": {
      "command": "path/to/server",
      "args": ["--arg1", "--arg2"],
      "env": {
        "API_KEY": "$MY_API_TOKEN"
      },
      "timeout": 30000,
      "trust": false
    }
  }
}
```

**Key concepts:**
- **`mcpServers`**: Top-level object containing all server definitions
- **`serverName`**: Unique identifier for the server (used in CLI commands)
- Each server requires one transport mechanism (`command`, `url`, or `httpUrl`)

---

## Transport Configuration

Gemini CLI supports three transport types for communicating with MCP servers.

### Stdio Transport

Spawns a local process and communicates via stdin/stdout.

```json
{
  "mcpServers": {
    "localServer": {
      "command": "python",
      "args": ["-m", "my_mcp_server"],
      "cwd": "/path/to/working/directory"
    }
  }
}
```

**Properties:**
- **`command`** (required): Path to executable or command name
- **`args`** (optional): Array of command-line arguments
- **`cwd`** (optional): Working directory for the process

**Use cases:**
- Local Python/Node.js servers
- Development and testing
- Desktop applications
- Filesystem-based tools

### SSE Transport

Connects to Server-Sent Events endpoint for streaming communication.

```json
{
  "mcpServers": {
    "sseServer": {
      "url": "https://api.example.com/sse",
      "headers": {
        "Authorization": "Bearer token"
      }
    }
  }
}
```

**Properties:**
- **`url`** (required): SSE endpoint URL
- **`headers`** (optional): HTTP headers object

**Use cases:**
- Cloud-hosted services
- Real-time streaming responses
- Event-driven architectures
- Remote team tools

### HTTP Streaming Transport

Uses HTTP streaming for server communication.

```json
{
  "mcpServers": {
    "httpServer": {
      "httpUrl": "https://api.example.com/mcp",
      "headers": {
        "Content-Type": "application/json",
        "X-Custom-Header": "value"
      }
    }
  }
}
```

**Properties:**
- **`httpUrl`** (required): HTTP streaming endpoint URL
- **`headers`** (optional): HTTP headers object

**Use cases:**
- RESTful services
- API gateways
- Load-balanced endpoints
- Stateless architectures

---

## Complete Property Reference

### Required Properties

Choose **one** transport mechanism:

| Property | Type | Description |
|----------|------|-------------|
| `command` | string | Local executable path (stdio transport) |
| `url` | string | SSE endpoint URL |
| `httpUrl` | string | HTTP streaming endpoint URL |

### Optional Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `args` | string[] | `[]` | Command-line arguments for stdio transport |
| `headers` | object | `{}` | Custom HTTP headers for remote transports |
| `env` | object | `{}` | Environment variables (supports `$VAR_NAME` syntax) |
| `cwd` | string | process cwd | Working directory for stdio transport |
| `timeout` | number | 600000 | Request timeout in milliseconds (10 minutes) |
| `trust` | boolean | `false` | Bypass all confirmation prompts |
| `includeTools` | string[] | all | Allowlist specific tools |
| `excludeTools` | string[] | none | Blocklist specific tools |

### Authentication Properties

| Property | Type | Description |
|----------|------|-------------|
| `authProviderType` | string | OAuth authentication method |
| `oauth` | object | OAuth configuration (scopes, etc.) |
| `targetAudience` | string | Service account impersonation audience |
| `targetServiceAccount` | string | Service account email for impersonation |

---

## Environment Variables

### Syntax

Environment variables are referenced using `$VAR_NAME` syntax:

```json
{
  "mcpServers": {
    "authenticated": {
      "command": "server",
      "env": {
        "API_KEY": "$MY_API_KEY",
        "DATABASE_URL": "$DB_CONNECTION_STRING",
        "DEBUG_MODE": "$DEBUG"
      }
    }
  }
}
```

### Variable Resolution

1. Checks project-level `.env` file
2. Checks user-level environment variables
3. Falls back to empty string if not found

### Security Features

**Automatic redaction** for sensitive variable names:
- Patterns containing `TOKEN`, `SECRET`, `PASSWORD`, `KEY`
- Displayed as `***REDACTED***` in logs and errors

**Example:**
```json
{
  "env": {
    "GITHUB_TOKEN": "$GITHUB_ACCESS_TOKEN",
    "API_SECRET": "$SERVICE_SECRET"
  }
}
```

### Best Practices

**DO:**
- ✅ Use environment variables for all secrets
- ✅ Document required variables in README
- ✅ Provide example `.env.example` file
- ✅ Use descriptive variable names

**DON'T:**
- ❌ Never hardcode sensitive values
- ❌ Never commit `.env` files
- ❌ Never expose secrets in error messages

**Example `.env` file:**
```bash
# MCP Server Configuration
CONTEXT7_API_KEY=your-api-key-here
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
DATABASE_URL=postgresql://user:pass@localhost/db
```

---

## Tool Filtering

Control which tools are available from a server using allowlists and blocklists.

### Include Tools (Allowlist)

Explicitly specify which tools to enable:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem"],
      "includeTools": ["read_file", "write_file", "list_directory"]
    }
  }
}
```

**Behavior:**
- Only listed tools are registered
- All other tools are ignored
- Useful for limiting capabilities

**Use cases:**
- Restricting powerful servers
- Limiting scope for specific tasks
- Improving performance (fewer tools)
- Security hardening

### Exclude Tools (Blocklist)

Block specific tools while enabling all others:

```json
{
  "mcpServers": {
    "fullServer": {
      "command": "python",
      "args": ["server.py"],
      "excludeTools": ["delete_all", "execute_code", "system_command"]
    }
  }
}
```

**Behavior:**
- All tools except listed ones are registered
- Blocklist takes precedence over allowlist
- Useful for removing dangerous operations

**Use cases:**
- Disabling destructive operations
- Preventing accidental execution
- Compliance requirements
- Testing without side effects

### Combining Filters

**Allowlist + Blocklist:**
```json
{
  "mcpServers": {
    "filtered": {
      "command": "server",
      "includeTools": ["read_*", "list_*", "search_*"],
      "excludeTools": ["read_sensitive", "search_private"]
    }
  }
}
```

**Processing order:**
1. Apply `includeTools` filter
2. Apply `excludeTools` filter
3. Result: Tools matching include pattern except those in exclude list

### Global Filtering

Configure default filters in `settings.json`:

```json
{
  "mcp": {
    "allowed": ["read_*", "list_*"],
    "excluded": ["delete_*", "execute_*"]
  },
  "mcpServers": {
    "server1": {
      "command": "server1"
    },
    "server2": {
      "command": "server2"
    }
  }
}
```

**Behavior:**
- Global filters apply to all servers
- Server-specific filters override global filters
- Useful for organization-wide policies

---

## OAuth Authentication

Gemini CLI supports OAuth 2.0 for authenticating with remote MCP servers using three methods.

### Method 1: Dynamic Discovery (Default)

Server provides OAuth configuration dynamically.

```json
{
  "mcpServers": {
    "autodiscovery": {
      "url": "https://api.example.com/sse"
    }
  }
}
```

**Process:**
1. CLI connects to server
2. Server responds with OAuth metadata
3. CLI initiates OAuth flow
4. User authenticates in browser
5. CLI receives and stores token

**Use cases:**
- Third-party services with built-in OAuth
- SaaS platforms
- Public APIs with OAuth

### Method 2: Google Credentials

Authenticate using Google OAuth with application default credentials.

```json
{
  "mcpServers": {
    "googleAuth": {
      "httpUrl": "https://service.run.app/mcp",
      "authProviderType": "google_credentials",
      "oauth": {
        "scopes": [
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/cloud-platform"
        ]
      }
    }
  }
}
```

**Properties:**
- **`authProviderType`**: Set to `"google_credentials"`
- **`oauth.scopes`**: Array of OAuth scope URIs

**Authentication sources (in order):**
1. `GOOGLE_APPLICATION_CREDENTIALS` environment variable
2. Application default credentials
3. Interactive login

**Use cases:**
- Google Cloud Platform services
- Cloud Run applications
- Firebase backends
- Google Workspace integrations

### Method 3: Service Account Impersonation

Impersonate a service account for Identity-Aware Proxy (IAP) protected endpoints.

```json
{
  "mcpServers": {
    "iapProtected": {
      "url": "https://service.run.app/sse",
      "authProviderType": "service_account_impersonation",
      "targetAudience": "123456789-abc.apps.googleusercontent.com",
      "targetServiceAccount": "mcp-service@project.iam.gserviceaccount.com"
    }
  }
}
```

**Properties:**
- **`authProviderType`**: Set to `"service_account_impersonation"`
- **`targetAudience`**: OAuth client ID for IAP
- **`targetServiceAccount`**: Service account email to impersonate

**Requirements:**
- User must have `roles/iam.serviceAccountTokenCreator` on target service account
- Target service account must have IAP access

**Use cases:**
- IAP-protected Cloud Run services
- Internal corporate APIs
- Cross-project service access
- Secure production environments

---

## Trust and Confirmation Settings

### Trust Property

The `trust` property bypasses all confirmation prompts for a server.

```json
{
  "mcpServers": {
    "trustedServer": {
      "command": "verified-server",
      "trust": true
    }
  }
}
```

**Behavior when `trust: true`:**
- No confirmation before tool execution
- No prompts for file access
- No warnings for destructive operations
- Immediate execution of all tools

**Security implications:**
- Server has unrestricted access
- Tools run with user permissions
- Potential for data exfiltration
- Risk of destructive operations

### When to Trust

**✅ Trust these servers:**
- First-party internal tools
- Verified open-source servers
- Audited codebases
- Read-only operations

**❌ Never trust:**
- Unknown third-party servers
- Unverified sources
- Servers with write access
- Network-accessible tools

### Confirmation Levels

When `trust: false` (default), user can choose:

1. **Proceed once**: Execute this call only
2. **Trust tool**: Always allow this specific tool
3. **Trust server**: Always allow all tools from this server
4. **Cancel**: Abort operation

**Example prompt:**
```
Server 'github' wants to execute tool 'create_issue'

Parameters:
  title: "Bug report"
  body: "Description..."

[1] Proceed once
[2] Trust tool (create_issue)
[3] Trust server (github)
[4] Cancel

Choice:
```

### Runtime Trust Management

**Enable trust for a server:**
```bash
gemini mcp trust serverName
```

**Disable trust:**
```bash
gemini mcp untrust serverName
```

**List trusted servers:**
```bash
gemini mcp list --trusted
```

---

## Advanced Configuration Examples

### Example 1: Python Server with Environment Variables

```json
{
  "mcpServers": {
    "pythonAnalytics": {
      "command": "python",
      "args": ["-m", "analytics_server"],
      "env": {
        "DATABASE_URL": "$ANALYTICS_DB",
        "API_KEY": "$ANALYTICS_API_KEY",
        "LOG_LEVEL": "INFO"
      },
      "cwd": "/opt/analytics",
      "timeout": 45000,
      "includeTools": ["query_data", "generate_report"]
    }
  }
}
```

**Features:**
- Environment variable substitution
- Custom working directory
- Extended timeout for long operations
- Tool filtering for specific use case

### Example 2: Docker-Based Server

```json
{
  "mcpServers": {
    "dockerized": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "--network=host",
        "-v", "/data:/data:ro",
        "my-mcp-server:latest"
      ],
      "env": {
        "DOCKER_HOST": "$DOCKER_HOST"
      },
      "timeout": 60000
    }
  }
}
```

**Features:**
- Docker container execution
- Volume mounting (read-only)
- Network passthrough
- Container cleanup on exit

### Example 3: Remote HTTP Server with Authentication

```json
{
  "mcpServers": {
    "enterpriseAPI": {
      "httpUrl": "https://mcp.company.com/api",
      "headers": {
        "Authorization": "Bearer $COMPANY_TOKEN",
        "X-API-Version": "2024-01-01",
        "X-Client-ID": "gemini-cli"
      },
      "timeout": 20000,
      "trust": false,
      "excludeTools": ["admin_*"]
    }
  }
}
```

**Features:**
- Bearer token authentication
- API versioning header
- Client identification
- Admin tool blocking

### Example 4: Multi-Transport Development Setup

```json
{
  "mcpServers": {
    "localDev": {
      "command": "npm",
      "args": ["start", "--", "--dev"],
      "cwd": "./servers/local",
      "trust": true,
      "env": {
        "NODE_ENV": "development"
      }
    },
    "stagingAPI": {
      "url": "https://staging.example.com/sse",
      "headers": {
        "Authorization": "Bearer $STAGING_TOKEN"
      },
      "trust": false
    },
    "prodAPI": {
      "httpUrl": "https://api.example.com/mcp",
      "authProviderType": "google_credentials",
      "oauth": {
        "scopes": ["https://www.googleapis.com/auth/cloud-platform"]
      },
      "trust": false,
      "includeTools": ["read_*", "list_*"]
    }
  }
}
```

**Features:**
- Local development server (trusted)
- Staging environment with manual auth
- Production with OAuth (restricted tools)
- Environment-specific configurations

### Example 5: High-Security Configuration

```json
{
  "mcpServers": {
    "secureServer": {
      "command": "server",
      "args": ["--secure-mode"],
      "env": {
        "ENABLE_AUDIT": "true",
        "LOG_PATH": "/var/log/mcp"
      },
      "trust": false,
      "includeTools": [
        "read_file",
        "search_files",
        "analyze_code"
      ],
      "excludeTools": [
        "write_file",
        "delete_file",
        "execute_command"
      ],
      "timeout": 10000
    }
  }
}
```

**Security features:**
- Explicit tool allowlist
- Additional blocklist for safety
- Audit logging enabled
- Short timeout to prevent hanging
- Trust disabled (manual approval required)

### Example 6: Load-Balanced Cluster

```json
{
  "mcpServers": {
    "cluster-node-1": {
      "httpUrl": "https://mcp-1.cluster.internal/mcp",
      "headers": {
        "X-Node-ID": "node-1"
      }
    },
    "cluster-node-2": {
      "httpUrl": "https://mcp-2.cluster.internal/mcp",
      "headers": {
        "X-Node-ID": "node-2"
      }
    },
    "cluster-node-3": {
      "httpUrl": "https://mcp-3.cluster.internal/mcp",
      "headers": {
        "X-Node-ID": "node-3"
      }
    }
  }
}
```

**Features:**
- Multiple servers for redundancy
- Node identification headers
- Distribute load across servers
- Failover capability

---

## Configuration Patterns

### Pattern: Shared Configuration

Use environment variables to share configuration across multiple servers:

```json
{
  "mcpServers": {
    "server1": {
      "command": "server1",
      "env": {
        "API_KEY": "$SHARED_API_KEY",
        "BASE_URL": "$API_BASE_URL"
      }
    },
    "server2": {
      "command": "server2",
      "env": {
        "API_KEY": "$SHARED_API_KEY",
        "BASE_URL": "$API_BASE_URL"
      }
    }
  }
}
```

**Benefits:**
- Single source of truth
- Easier credential rotation
- Consistent configuration

### Pattern: Progressive Trust

Start untrusted, gradually enable trust after verification:

```json
{
  "mcpServers": {
    "newServer": {
      "command": "new-server",
      "trust": false,
      "includeTools": ["safe_tool_1", "safe_tool_2"]
    }
  }
}
```

**After verification, expand access:**
```json
{
  "mcpServers": {
    "newServer": {
      "command": "new-server",
      "trust": true,
      "includeTools": null
    }
  }
}
```

### Pattern: Environment-Specific Settings

Use separate settings files for different environments:

**`.gemini/settings.development.json`:**
```json
{
  "mcpServers": {
    "api": {
      "command": "dev-server",
      "trust": true,
      "env": {
        "DEBUG": "true"
      }
    }
  }
}
```

**`.gemini/settings.production.json`:**
```json
{
  "mcpServers": {
    "api": {
      "httpUrl": "https://api.production.com/mcp",
      "trust": false,
      "env": {
        "DEBUG": "false"
      }
    }
  }
}
```

**Usage:**
```bash
# Development
gemini --settings=settings.development.json

# Production
gemini --settings=settings.production.json
```

### Pattern: Namespace Collision Prevention

Prefix server names to avoid tool conflicts:

```json
{
  "mcpServers": {
    "github-issues": {
      "command": "github-mcp",
      "args": ["--focus=issues"]
    },
    "github-repos": {
      "command": "github-mcp",
      "args": ["--focus=repos"]
    },
    "gitlab-issues": {
      "command": "gitlab-mcp",
      "args": ["--focus=issues"]
    }
  }
}
```

**Tool naming:**
- `github-issues__create_issue`
- `github-repos__create_repo`
- `gitlab-issues__create_issue`

---

## Configuration Validation

### JSON Schema Validation

Gemini CLI validates `settings.json` on startup. Common issues:

**Invalid JSON syntax:**
```
Error: Unexpected token } in JSON at position 123
```

**Missing required properties:**
```
Error: Server 'myserver' missing transport property (command, url, or httpUrl)
```

**Invalid property types:**
```
Error: Server 'myserver' property 'timeout' must be a number
```

### Validation Tools

**Check syntax:**
```bash
# Using jq
jq empty .gemini/settings.json

# Using Python
python -m json.tool .gemini/settings.json
```

**Check specific server:**
```bash
jq '.mcpServers.serverName' .gemini/settings.json
```

### Common Validation Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Unexpected token | Trailing comma, missing quote | Use JSON validator |
| Missing property | No transport specified | Add `command`, `url`, or `httpUrl` |
| Invalid type | String instead of array | Check property types |
| Duplicate keys | Same server name twice | Use unique names |

---

## Performance Optimization

### Timeout Configuration

Set appropriate timeouts based on operation complexity:

```json
{
  "mcpServers": {
    "fastServer": {
      "command": "fast-server",
      "timeout": 5000
    },
    "slowServer": {
      "command": "slow-server",
      "timeout": 120000
    }
  }
}
```

**Guidelines:**
- **5-10 seconds**: Simple queries, file reads
- **30-60 seconds**: API calls, database queries
- **2-5 minutes**: Heavy computation, large file processing
- **10+ minutes**: Data analysis, model training

### Tool Filtering Performance

Reduce overhead by limiting enabled tools:

```json
{
  "mcpServers": {
    "largeServer": {
      "command": "server-with-100-tools",
      "includeTools": ["tool1", "tool2", "tool3"]
    }
  }
}
```

**Benefits:**
- Faster discovery
- Reduced memory usage
- Clearer tool selection
- Improved UX

### Connection Pooling

For HTTP servers, reuse connections:

```json
{
  "mcpServers": {
    "httpServer": {
      "httpUrl": "https://api.example.com/mcp",
      "headers": {
        "Connection": "keep-alive"
      }
    }
  }
}
```

---

## Troubleshooting Configuration Issues

### Server Won't Connect

**Check command exists:**
```bash
which python
which npx
which docker
```

**Test command manually:**
```bash
python -m my_mcp_server
```

**Verify permissions:**
```bash
ls -la /path/to/server
chmod +x /path/to/server
```

### Environment Variables Not Working

**Check variable exists:**
```bash
echo $MY_API_KEY
```

**Test resolution:**
```bash
# In settings.json
"env": {"TEST": "$MY_VAR"}

# Run CLI with debug
gemini --debug
# Check logs for resolved value
```

**Verify .env file:**
```bash
cat .env
# MY_VAR=value
```

### Tools Not Discovered

**Enable debug mode:**
```bash
gemini --debug
```

**Check server output:**
```bash
# Stdio servers log to stderr
server-command 2> debug.log
cat debug.log
```

**Verify MCP protocol:**
```bash
# Server should respond to:
echo '{"jsonrpc": "2.0", "method": "tools/list", "id": 1}' | server-command
```

### OAuth Authentication Failing

**Check credentials:**
```bash
# Google credentials
gcloud auth application-default login

# Environment variable
echo $GOOGLE_APPLICATION_CREDENTIALS
```

**Verify scopes:**
```json
{
  "oauth": {
    "scopes": [
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  }
}
```

**Check IAP configuration:**
```bash
# Test IAP endpoint
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  https://service.run.app/mcp
```

---

## Best Practices

### Security

**DO:**
- ✅ Use environment variables for secrets
- ✅ Review server code before installation
- ✅ Enable trust only for verified servers
- ✅ Use tool filtering to limit capabilities
- ✅ Set appropriate timeouts
- ✅ Monitor server behavior

**DON'T:**
- ❌ Hardcode API keys or passwords
- ❌ Trust unknown servers
- ❌ Disable confirmations globally
- ❌ Expose sensitive data in logs
- ❌ Use root privileges unnecessarily

### Configuration Management

**DO:**
- ✅ Version control settings files (without secrets)
- ✅ Document required environment variables
- ✅ Provide `.env.example` templates
- ✅ Use consistent naming conventions
- ✅ Organize servers by function
- ✅ Comment complex configurations

**DON'T:**
- ❌ Commit `.env` files
- ❌ Use unclear server names
- ❌ Mix development and production configs
- ❌ Leave unused servers enabled

### Performance

**DO:**
- ✅ Filter tools to reduce overhead
- ✅ Set appropriate timeouts
- ✅ Use local servers when possible
- ✅ Cache server responses
- ✅ Monitor resource usage

**DON'T:**
- ❌ Enable all tools from large servers
- ❌ Use excessively long timeouts
- ❌ Run servers unnecessarily
- ❌ Ignore performance warnings

---

## Related Documentation

- [Gemini CLI Quick Start](./quick-start.md) - Getting started guide
- [Tool Execution](./tool-execution.md) - How tools work
- [Security Best Practices](../../05-advanced/security.md) - Security guidelines
- [Troubleshooting](../../05-advanced/troubleshooting.md) - Common issues
- [Official Documentation](https://geminicli.com/docs/tools/mcp-server/) - Gemini CLI docs

---

**Last Updated:** February 2026
**Applies To:** Gemini CLI 1.x
**Reference:** [geminicli.com/docs/tools/mcp-server](https://geminicli.com/docs/tools/mcp-server/)
