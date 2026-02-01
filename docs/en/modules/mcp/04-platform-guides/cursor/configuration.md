# MCP Configuration in Cursor

## Overview

Cursor uses a JSON-based configuration file called `mcp.json` to define Model Context Protocol servers and their connection parameters. This guide covers the complete configuration structure, advanced features, and best practices for managing MCP servers in Cursor.

**Key Configuration Features:**
- Project-specific and global configuration files
- Multiple transport methods (stdio, SSE, HTTP)
- Environment variable interpolation
- Static OAuth authentication
- Dynamic configuration via Extension API

---

## Configuration File Locations

### Project-Specific Configuration

**Location:** `.cursor/mcp.json` in your project directory

**Purpose:**
- Team-shared MCP server configurations
- Project-specific tools and integrations
- Version controlled with your codebase
- Automatically loaded when project opens

**When to Use:**
- Tools specific to your project
- Team collaboration on shared servers
- Development environment consistency
- Project documentation integrations

**Example Structure:**
```bash
project-root/
├── .cursor/
│   └── mcp.json          # Project MCP configuration
├── src/
└── README.md
```

### Global Configuration

**Location:** `~/.cursor/mcp.json` in your home directory

**Purpose:**
- Personal tools and utilities
- Cross-project MCP servers
- User-specific preferences
- Private integrations

**When to Use:**
- Personal productivity tools
- Servers used across multiple projects
- Private API integrations
- User-specific workflows

---

## Configuration File Structure

### Basic Structure

```json
{
  "mcpServers": {
    "server-name": {
      // Server configuration object
    }
  }
}
```

**Top-Level Fields:**
- `mcpServers` (object, required): Dictionary of server configurations
  - Key: Unique server identifier (string)
  - Value: Server configuration object

---

## STDIO Server Configuration

STDIO servers run as local processes, communicating via standard input/output streams. This is the most common configuration for locally-installed MCP servers.

### Required Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `command` | string | Yes | Executable command to start the server |
| `args` | array | No | Command-line arguments passed to the server |
| `env` | object | No | Environment variables for the server process |
| `envFile` | string | No | Path to environment file (stdio only) |

### Basic STDIO Configuration

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["server.js"]
    }
  }
}
```

### Node.js Server with NPX

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"],
      "env": {
        "CONTEXT7_API_KEY": "${env:CONTEXT7_API_KEY}"
      }
    }
  }
}
```

**Explanation:**
- `npx`: Node Package Runner (automatically downloads and runs packages)
- `-y`: Auto-confirm installation prompts
- `@context7/mcp-server`: NPM package name
- Environment variable interpolation for API key

### Python Server

```json
{
  "mcpServers": {
    "python-tools": {
      "command": "python",
      "args": ["${workspaceFolder}/tools/mcp_server.py"],
      "env": {
        "PYTHONPATH": "${workspaceFolder}",
        "API_KEY": "${env:MY_API_KEY}"
      }
    }
  }
}
```

**Explanation:**
- Uses project-relative path with `${workspaceFolder}`
- Sets `PYTHONPATH` for module imports
- Passes API key from environment variable

### Docker Container Server

```json
{
  "mcpServers": {
    "docker-server": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e", "API_KEY=${env:API_KEY}",
        "my-mcp-server:latest"
      ]
    }
  }
}
```

**Explanation:**
- `-i`: Interactive mode (keeps stdin open)
- `--rm`: Automatically remove container on exit
- `-e`: Pass environment variables to container
- Uses latest tagged image

### Using Environment Files

```json
{
  "mcpServers": {
    "env-based-server": {
      "command": "node",
      "args": ["server.js"],
      "envFile": "${workspaceFolder}/.env"
    }
  }
}
```

**Environment File Example (`.env`):**
```bash
API_KEY=sk-abc123
DATABASE_URL=postgresql://localhost/mydb
LOG_LEVEL=debug
```

**Note:** `envFile` is STDIO-only. Remote servers must configure environment variables through their hosting environment.

---

## Remote Server Configuration

Remote servers communicate over HTTP or Server-Sent Events (SSE), enabling multi-user deployments and cloud-hosted MCP servers.

### Required Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | Yes | Server endpoint URL (HTTP or SSE) |
| `headers` | object | No | HTTP headers for authentication |
| `auth` | object | No | OAuth configuration |

### Basic Remote Configuration

```json
{
  "mcpServers": {
    "remote-server": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

### Remote Server with API Key

```json
{
  "mcpServers": {
    "api-server": {
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${env:API_TOKEN}",
        "X-API-Key": "${env:API_KEY}"
      }
    }
  }
}
```

**Security Best Practice:** Always use environment variables for credentials, never hardcode in configuration files.

### SSE (Server-Sent Events) Configuration

```json
{
  "mcpServers": {
    "sse-server": {
      "url": "https://sse.example.com/events",
      "headers": {
        "Authorization": "Bearer ${env:SSE_TOKEN}"
      }
    }
  }
}
```

**SSE Benefits:**
- Persistent connection for real-time updates
- Server can push notifications to client
- Efficient for long-running operations
- Lower latency than polling

---

## Static OAuth Configuration

For OAuth providers offering fixed client credentials, Cursor supports static OAuth configuration using a predefined redirect URL.

### OAuth Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `CLIENT_ID` | string | Yes | OAuth client ID from provider |
| `CLIENT_SECRET` | string | Yes | OAuth client secret from provider |
| `scopes` | array | No | Requested OAuth scopes |

### Basic OAuth Configuration

```json
{
  "mcpServers": {
    "oauth-server": {
      "url": "https://api.example.com/mcp",
      "auth": {
        "CLIENT_ID": "${env:OAUTH_CLIENT_ID}",
        "CLIENT_SECRET": "${env:OAUTH_CLIENT_SECRET}",
        "scopes": ["read", "write"]
      }
    }
  }
}
```

### Static Redirect URL

**Redirect URL for OAuth Registration:**
```
cursor://anysphere.cursor-mcp/oauth/callback
```

**How It Works:**
1. Register this exact URL with your OAuth provider
2. The server is identified via OAuth's `state` parameter
3. One redirect URL works for all MCP servers
4. Cursor automatically handles the callback

**OAuth Provider Setup Example (GitHub):**
```markdown
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL to:
   cursor://anysphere.cursor-mcp/oauth/callback
4. Copy Client ID and Client Secret
5. Add to environment variables
```

### Environment Variables for OAuth

```bash
# Add to ~/.bashrc, ~/.zshrc, or equivalent
export OAUTH_CLIENT_ID="your-client-id"
export OAUTH_CLIENT_SECRET="your-client-secret"
```

**Then reference in mcp.json:**
```json
{
  "mcpServers": {
    "github-mcp": {
      "url": "https://api.github.com/mcp",
      "auth": {
        "CLIENT_ID": "${env:OAUTH_CLIENT_ID}",
        "CLIENT_SECRET": "${env:OAUTH_CLIENT_SECRET}",
        "scopes": ["repo", "user"]
      }
    }
  }
}
```

---

## Variable Interpolation

Cursor supports several interpolation variables for dynamic configuration values.

### Available Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `${env:NAME}` | Environment variable | Value of `$NAME` |
| `${userHome}` | User home directory | `/Users/username` |
| `${workspaceFolder}` | Project root directory | `/Users/username/project` |
| `${workspaceFolderBasename}` | Project directory name | `project` |
| `${pathSeparator}` or `${/}` | OS-specific path separator | `/` or `\` |

### Environment Variable Interpolation

```json
{
  "mcpServers": {
    "server": {
      "command": "node",
      "args": ["server.js"],
      "env": {
        "API_KEY": "${env:API_KEY}",
        "API_SECRET": "${env:API_SECRET}",
        "LOG_LEVEL": "${env:LOG_LEVEL}"
      }
    }
  }
}
```

**Environment Setup:**
```bash
export API_KEY="sk-abc123"
export API_SECRET="secret-xyz"
export LOG_LEVEL="debug"
```

### Path Interpolation

```json
{
  "mcpServers": {
    "workspace-server": {
      "command": "python",
      "args": [
        "${workspaceFolder}/scripts/mcp_server.py"
      ],
      "env": {
        "DATA_DIR": "${workspaceFolder}/data",
        "CONFIG_FILE": "${userHome}/.config/server.conf",
        "CACHE_DIR": "${userHome}/.cache/mcp"
      }
    }
  }
}
```

**Resolves to (example):**
```json
{
  "args": ["/Users/username/project/scripts/mcp_server.py"],
  "env": {
    "DATA_DIR": "/Users/username/project/data",
    "CONFIG_FILE": "/Users/username/.config/server.conf",
    "CACHE_DIR": "/Users/username/.cache/mcp"
  }
}
```

### Cross-Platform Path Configuration

```json
{
  "mcpServers": {
    "cross-platform": {
      "command": "node",
      "args": [
        "${workspaceFolder}${/}tools${/}server.js"
      ],
      "env": {
        "PATH_VAR": "${userHome}${pathSeparator}bin"
      }
    }
  }
}
```

**Resolves on Unix:**
```
args: ["/Users/username/project/tools/server.js"]
PATH_VAR: "/Users/username/bin"
```

**Resolves on Windows:**
```
args: ["C:\Users\username\project\tools\server.js"]
PATH_VAR: "C:\Users\username\bin"
```

### Combining Variables

```json
{
  "mcpServers": {
    "complex-server": {
      "command": "${env:PYTHON_PATH}",
      "args": [
        "${workspaceFolder}/mcp/server.py",
        "--config=${userHome}/.config/${workspaceFolderBasename}.json",
        "--log-level=${env:LOG_LEVEL}"
      ],
      "env": {
        "PYTHONPATH": "${workspaceFolder}:${env:EXTRA_PYTHON_PATH}",
        "DATA_PATH": "${workspaceFolder}/data${pathSeparator}inputs"
      }
    }
  }
}
```

---

## Complete Configuration Examples

### Example 1: Multi-Server Development Setup

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"],
      "env": {
        "CONTEXT7_API_KEY": "${env:CONTEXT7_API_KEY}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem"],
      "env": {
        "ALLOWED_DIRS": "${workspaceFolder}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${env:DATABASE_URL}"
      }
    },
    "custom-tools": {
      "command": "python",
      "args": ["${workspaceFolder}/mcp/custom_server.py"],
      "envFile": "${workspaceFolder}/.env"
    }
  }
}
```

### Example 2: Remote and Local Hybrid

```json
{
  "mcpServers": {
    "production-api": {
      "url": "https://api.production.com/mcp",
      "headers": {
        "Authorization": "Bearer ${env:PROD_API_TOKEN}",
        "X-Environment": "production"
      }
    },
    "local-dev-server": {
      "url": "http://localhost:3000/mcp",
      "headers": {
        "X-Environment": "development"
      }
    },
    "local-tools": {
      "command": "node",
      "args": ["${workspaceFolder}/dev/mcp-server.js"],
      "env": {
        "NODE_ENV": "development",
        "DEBUG": "mcp:*"
      }
    }
  }
}
```

### Example 3: Docker-Based Microservices

```json
{
  "mcpServers": {
    "data-processor": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "--network", "mcp-network",
        "-e", "API_KEY=${env:DATA_API_KEY}",
        "-v", "${workspaceFolder}/data:/data",
        "mcp-data-processor:latest"
      ]
    },
    "ml-model": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "--gpus", "all",
        "-e", "MODEL_PATH=/models/current",
        "-v", "${userHome}/.models:/models",
        "mcp-ml-server:gpu"
      ]
    },
    "cache-service": {
      "url": "http://cache-container:8080/mcp",
      "headers": {
        "X-Container-Network": "mcp-network"
      }
    }
  }
}
```

### Example 4: OAuth-Enabled Cloud Services

```json
{
  "mcpServers": {
    "github-integration": {
      "url": "https://api.github.com/mcp",
      "auth": {
        "CLIENT_ID": "${env:GITHUB_CLIENT_ID}",
        "CLIENT_SECRET": "${env:GITHUB_CLIENT_SECRET}",
        "scopes": ["repo", "user", "read:org"]
      }
    },
    "google-workspace": {
      "url": "https://workspace.googleapis.com/mcp",
      "auth": {
        "CLIENT_ID": "${env:GOOGLE_CLIENT_ID}",
        "CLIENT_SECRET": "${env:GOOGLE_CLIENT_SECRET}",
        "scopes": [
          "https://www.googleapis.com/auth/drive.readonly",
          "https://www.googleapis.com/auth/calendar"
        ]
      }
    },
    "slack-bot": {
      "url": "https://slack.com/api/mcp",
      "auth": {
        "CLIENT_ID": "${env:SLACK_CLIENT_ID}",
        "CLIENT_SECRET": "${env:SLACK_CLIENT_SECRET}",
        "scopes": ["channels:read", "chat:write"]
      }
    }
  }
}
```

### Example 5: Cross-Platform Team Configuration

```json
{
  "mcpServers": {
    "project-analyzer": {
      "command": "node",
      "args": [
        "${workspaceFolder}${/}mcp${/}analyzer.js",
        "--workspace=${workspaceFolderBasename}",
        "--output=${workspaceFolder}${/}reports"
      ],
      "env": {
        "NODE_PATH": "${workspaceFolder}${/}node_modules",
        "CONFIG_DIR": "${userHome}${pathSeparator}.mcp-analyzer"
      }
    },
    "documentation": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-markdown",
        "--root=${workspaceFolder}${/}docs"
      ]
    }
  }
}
```

---

## Project vs Global Configuration

### Decision Matrix

| Use Case | Configuration Location | Rationale |
|----------|----------------------|-----------|
| Team-shared tools | Project (`.cursor/mcp.json`) | Consistency across team members |
| Project-specific integrations | Project | Required for project functionality |
| Personal productivity tools | Global (`~/.cursor/mcp.json`) | Individual preferences |
| Cross-project utilities | Global | Reusable across all projects |
| Development environment | Project | Reproducible setup |
| Private API keys | Global (with env vars) | Security and privacy |

### Project Configuration Best Practices

**DO:**
- ✅ Version control `.cursor/mcp.json`
- ✅ Use environment variable interpolation for secrets
- ✅ Document required environment variables in README
- ✅ Include setup instructions for new team members
- ✅ Test configuration across team members

**DON'T:**
- ❌ Hardcode API keys or secrets
- ❌ Include personal tools in project config
- ❌ Use absolute paths (use interpolation)
- ❌ Commit sensitive configuration data

**Example README Section:**
```markdown
## MCP Server Setup

This project uses Model Context Protocol servers. After cloning:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set environment variables:
   ```bash
   export CONTEXT7_API_KEY="your-api-key"
   export DATABASE_URL="postgresql://..."
   ```

3. Restart Cursor to load MCP servers

See `.cursor/mcp.json` for configured servers.
```

### Global Configuration Best Practices

**DO:**
- ✅ Keep personal tools in global config
- ✅ Use for cross-project utilities
- ✅ Store user-specific preferences
- ✅ Configure once, use everywhere

**DON'T:**
- ❌ Rely on global config for team collaboration
- ❌ Include project-specific servers
- ❌ Share global config file (it's personal)

---

## Configuration Best Practices

### Security

**1. Never Hardcode Secrets**

```json
// ❌ BAD - Hardcoded API key
{
  "mcpServers": {
    "server": {
      "env": {
        "API_KEY": "sk-abc123def456"
      }
    }
  }
}

// ✅ GOOD - Environment variable
{
  "mcpServers": {
    "server": {
      "env": {
        "API_KEY": "${env:API_KEY}"
      }
    }
  }
}
```

**2. Use Scoped API Keys**

Create API keys with minimal required permissions:
- Read-only access when possible
- Limited to specific resources
- Time-limited tokens when available
- Separate keys per environment (dev/prod)

**3. Secure OAuth Credentials**

```bash
# Store in secure environment configuration
export OAUTH_CLIENT_ID="public-client-id"
export OAUTH_CLIENT_SECRET="private-secret-keep-safe"

# Use password managers or secret management tools
# Never commit to version control
```

**4. Review Server Code**

Before installing third-party MCP servers:
- ✅ Check GitHub repository
- ✅ Review permissions and data access
- ✅ Verify developer reputation
- ✅ Audit source code for sensitive operations
- ✅ Check for recent updates and maintenance

### Performance

**1. Enable Only Needed Servers**

```json
// ❌ BAD - All servers enabled
{
  "mcpServers": {
    "server1": { /* ... */ },
    "server2": { /* ... */ },
    "server3": { /* ... */ },
    // ... 20 more servers
  }
}

// ✅ GOOD - Only project-relevant servers
{
  "mcpServers": {
    "context7": { /* documentation */ },
    "filesystem": { /* file operations */ }
  }
}
```

**2. Use Local Servers When Possible**

```json
// Prefer stdio for better performance
{
  "mcpServers": {
    "local-fast": {
      "command": "node",
      "args": ["server.js"]
    }
  }
}
```

### Maintainability

**1. Use Descriptive Server Names**

```json
// ❌ BAD - Vague names
{
  "mcpServers": {
    "server1": { /* ... */ },
    "api": { /* ... */ },
    "tool": { /* ... */ }
  }
}

// ✅ GOOD - Clear, descriptive names
{
  "mcpServers": {
    "context7-documentation": { /* ... */ },
    "github-repo-manager": { /* ... */ },
    "database-query-tool": { /* ... */ }
  }
}
```

**2. Add Comments (Unofficial but Helpful)**

While JSON doesn't officially support comments, some parsers allow them:

```json
{
  "mcpServers": {
    // Documentation search via Context7
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"]
    }
  }
}
```

**Note:** Cursor's JSON parser may strip comments. Use external documentation for complex setups.

**3. Organize by Purpose**

```json
{
  "mcpServers": {
    // === Documentation & Search ===
    "context7": { /* ... */ },
    "markdown-docs": { /* ... */ },

    // === Development Tools ===
    "filesystem": { /* ... */ },
    "git-integration": { /* ... */ },

    // === External APIs ===
    "github": { /* ... */ },
    "slack": { /* ... */ }
  }
}
```

### Testing and Validation

**1. Test Configuration Locally**

```bash
# Test stdio server manually
npx -y @context7/mcp-server

# Test Python server
python mcp/server.py

# Test Docker server
docker run -i --rm mcp-server:latest
```

**2. Validate JSON Syntax**

```bash
# Use jq to validate JSON
jq empty .cursor/mcp.json

# Or use online validators
# https://jsonlint.com/
```

**3. Monitor MCP Logs**

In Cursor:
1. Open Output panel (Cmd+Shift+U)
2. Select "MCP Logs" from dropdown
3. Check for connection errors or warnings

---

## Advanced Configuration Options

### Custom Server Discovery

Some MCP servers support custom discovery mechanisms. Consult server documentation for specific options.

**Example:**
```json
{
  "mcpServers": {
    "custom-discovery": {
      "command": "node",
      "args": ["server.js", "--discover-mode"],
      "env": {
        "DISCOVERY_PATH": "${workspaceFolder}/plugins"
      }
    }
  }
}
```

### Server Dependencies

For servers with complex dependencies:

```json
{
  "mcpServers": {
    "ml-server": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "--network", "mcp-ml-network",
        "--depends-on", "redis,postgres",
        "-e", "REDIS_URL=redis://redis:6379",
        "-e", "DB_URL=${env:DATABASE_URL}",
        "ml-mcp-server:latest"
      ]
    }
  }
}
```

### Multi-Stage Server Initialization

For servers requiring setup before running:

```json
{
  "mcpServers": {
    "init-server": {
      "command": "bash",
      "args": [
        "-c",
        "npm install && node server.js"
      ],
      "env": {
        "CWD": "${workspaceFolder}/mcp"
      }
    }
  }
}
```

**Note:** This approach has limitations. Consider containerization for complex setups.

### Conditional Configuration

While Cursor doesn't directly support conditional configuration, you can use shell scripts:

```json
{
  "mcpServers": {
    "env-specific": {
      "command": "bash",
      "args": [
        "-c",
        "if [ \"$ENV\" = \"production\" ]; then node prod-server.js; else node dev-server.js; fi"
      ],
      "env": {
        "ENV": "${env:NODE_ENV}"
      }
    }
  }
}
```

---

## Extension API Configuration

For programmatic MCP server registration without editing `mcp.json`, Cursor provides an Extension API. This is particularly valuable for:

- Enterprise environment automation
- Dynamic server provisioning
- Programmatic configuration management
- Integration with deployment pipelines

**Use Cases:**
- Automatically register servers based on project detection
- Dynamic OAuth credential injection
- Environment-specific server configurations
- Automated testing and CI/CD integration

**Note:** Extension API details are beyond the scope of this guide. Refer to Cursor's Extension API documentation for implementation details.

---

## Troubleshooting Configuration Issues

### Server Won't Start

**Symptoms:**
- Server doesn't appear in Available Tools
- "Failed to connect" errors in MCP logs

**Solutions:**

1. **Verify command path:**
   ```bash
   # Test command manually
   which npx
   which python
   which docker
   ```

2. **Check environment variables:**
   ```bash
   # Verify variables are set
   echo $API_KEY
   echo $DATABASE_URL
   ```

3. **Test server manually:**
   ```bash
   # Run command from mcp.json directly
   npx -y @context7/mcp-server
   ```

4. **Review MCP logs:**
   - Open Output panel (Cmd+Shift+U)
   - Select "MCP Logs"
   - Look for error messages

### Invalid JSON Syntax

**Symptoms:**
- Cursor doesn't load MCP servers
- Silent failures with no error messages

**Solutions:**

1. **Validate JSON:**
   ```bash
   jq empty .cursor/mcp.json
   ```

2. **Common JSON errors:**
   - Trailing commas
   - Missing closing braces
   - Unescaped quotes in strings
   - Incorrect nested structure

3. **Use JSON formatter:**
   ```bash
   jq . .cursor/mcp.json > temp.json
   mv temp.json .cursor/mcp.json
   ```

### Variable Interpolation Not Working

**Symptoms:**
- Literal `${env:VAR}` appears in logs
- Server can't find files at interpolated paths

**Solutions:**

1. **Verify variable syntax:**
   ```json
   // ✅ Correct
   "${env:VAR_NAME}"

   // ❌ Incorrect
   "$env:VAR_NAME"
   "${VAR_NAME}"
   "$VAR_NAME"
   ```

2. **Check environment variables are exported:**
   ```bash
   # Add to shell profile (~/.bashrc, ~/.zshrc)
   export VAR_NAME="value"

   # Restart Cursor after modifying profile
   ```

3. **Test interpolation:**
   ```bash
   # Print interpolated value
   echo ${workspaceFolder}
   ```

### OAuth Authentication Fails

**Symptoms:**
- OAuth flow doesn't start
- Redirect fails after authorization
- "Invalid credentials" errors

**Solutions:**

1. **Verify redirect URL:**
   ```
   cursor://anysphere.cursor-mcp/oauth/callback
   ```
   Must match exactly in OAuth provider settings

2. **Check environment variables:**
   ```bash
   echo $OAUTH_CLIENT_ID
   echo $OAUTH_CLIENT_SECRET
   ```

3. **Verify scopes:**
   - Ensure requested scopes are available
   - Check OAuth provider documentation
   - Request minimum required scopes

4. **Test OAuth manually:**
   - Use OAuth playground or CLI tools
   - Verify credentials work outside Cursor
   - Check for expired or revoked tokens

---

## Migration and Upgrading

### Migrating from Old Configuration Format

If you have existing MCP configurations using older formats:

**Old Format:**
```json
{
  "servers": {
    "server-name": { /* ... */ }
  }
}
```

**New Format:**
```json
{
  "mcpServers": {
    "server-name": { /* ... */ }
  }
}
```

**Migration Script:**
```bash
# Backup existing config
cp .cursor/mcp.json .cursor/mcp.json.backup

# Update structure (manual edit required)
# Change "servers" to "mcpServers"
```

### Updating Server Versions

**NPM-based servers:**
```bash
# Clear npm cache
npm cache clean --force

# Restart Cursor to fetch latest version
# NPX automatically downloads latest when using -y flag
```

**Custom servers:**
```bash
# Update local files
git pull origin main

# Or rebuild Docker images
docker build -t mcp-server:latest .

# Restart Cursor
```

---

## Related Resources

**In This Documentation:**
- [Getting Started with Cursor MCP](./getting-started.md) - Initial setup
- [MCP in Cursor Reference](../../references/mcp/mcp-cursor.md) - Complete reference
- [Security Guidelines](../../guidelines/team-conventions/third-party-security-guidelines.md) - Security best practices

**External Resources:**
- [Cursor MCP Documentation](https://cursor.com/es/docs/context/mcp) - Official docs
- [Model Context Protocol](https://modelcontextprotocol.io/) - MCP specification
- [JSON Schema](https://json-schema.org/) - JSON validation

---

**Last Updated:** February 2026
**Category:** Platform Configuration
**Difficulty:** Intermediate
**Estimated Reading Time:** 25 minutes
