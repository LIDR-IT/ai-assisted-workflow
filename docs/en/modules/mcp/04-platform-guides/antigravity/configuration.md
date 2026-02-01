# Configuration

Complete guide to configuring MCP servers in Google Antigravity, including file structure, authentication, environment variables, and practical examples.

## Configuration File Structure

### mcp_config.json Format

Antigravity uses a standard JSON configuration format for MCP servers:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "executable-path-or-command",
      "args": ["array", "of", "arguments"],
      "env": {
        "KEY": "value"
      }
    }
  }
}
```

**Key Components:**

- **mcpServers**: Root object containing all server configurations
- **server-name**: Unique identifier for each MCP server (lowercase, hyphens recommended)
- **command**: Path to executable or command to run
- **args**: Optional array of command-line arguments
- **env**: Optional object of environment variables

### Configuration Locations

#### User-Level (Global)

```bash
~/.gemini/antigravity/mcp_config.json
```

**Use for:**
- Personal tools and utilities
- Authentication credentials
- Development environments
- Tools specific to your workflow

**Scope:** All Antigravity sessions across all projects

#### Project-Level

```bash
<project-root>/.gemini/mcp_config.json
```

**Use for:**
- Team-shared tools
- Project-specific integrations
- Development workflows
- Collaborative configurations

**Scope:** Only when working within the project directory

**Best Practice:** Commit to version control for team collaboration

#### Alternative: settings.json

MCP servers can also be configured in `~/.gemini/settings.json` under the `mcpServers` key, but using dedicated `mcp_config.json` files is recommended for clarity.

### Precedence Rules

When the same server name appears in multiple locations:

1. **Project-level** configuration takes precedence
2. **User-level** configuration is used as fallback
3. **settings.json** is used if neither exists

**Example:**
```bash
# Project overrides user configuration
~/.gemini/antigravity/mcp_config.json    # Has "github" server
project/.gemini/mcp_config.json           # Also has "github" server
# → Project "github" config is used
```

## Server Configuration Fields

### Required Fields

#### command

**Type:** String
**Description:** Executable path or command to launch the MCP server

**Examples:**
```json
// Node.js binary
"command": "node"

// NPX (recommended for npm packages)
"command": "npx"

// Python interpreter
"command": "python"

// Direct executable path
"command": "/usr/local/bin/custom-server"

// Relative path (to project root)
"command": "./bin/mcp-server"

// Absolute path to extension binary
"command": "/Users/username/.antigravity/extensions/server-binary"
```

### Optional Fields

#### args

**Type:** Array of strings
**Description:** Command-line arguments passed to the executable

**Examples:**
```json
// NPX with package name
"args": ["-y", "@package/mcp-server@latest"]

// Python module
"args": ["-m", "my_mcp_server"]

// Custom arguments
"args": ["--port", "3000", "--debug"]

// Environment variable references
"args": ["--token", "${env:API_TOKEN}"]

// Multiple configuration flags
"args": [
  "--config",
  "/path/to/config.json",
  "--verbose",
  "--timeout",
  "30"
]
```

#### env

**Type:** Object (key-value pairs)
**Description:** Environment variables available to the MCP server process

**Examples:**
```json
// API credentials
"env": {
  "API_KEY": "${env:MY_API_KEY}",
  "API_SECRET": "${env:MY_API_SECRET}"
}

// Database connection
"env": {
  "DATABASE_URL": "postgresql://localhost/mydb"
}

// Multiple variables
"env": {
  "NODE_ENV": "production",
  "LOG_LEVEL": "info",
  "TIMEOUT": "30000"
}

// Empty object (no variables)
"env": {}
```

### HTTP/SSE Server Fields

For HTTP-based MCP servers using Server-Sent Events (SSE):

```json
{
  "mcpServers": {
    "remote-server": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://127.0.0.1:3845/sse"
      ],
      "env": {}
    }
  }
}
```

**Note:** Antigravity uses `serverUrl` in some contexts (different from Cursor/Claude which use `url`). When using `npx mcp-remote`, pass the URL as an argument.

## Authentication Methods

### OAuth Personal (Recommended)

OAuth Personal is the recommended authentication method for Antigravity MCP servers accessing Google Cloud services.

#### Setup in settings.json

```json
{
  "auth": {
    "selectedType": "oauth-personal"
  }
}
```

**Location:** `~/.gemini/settings.json`

#### How It Works

1. User authenticates once via browser OAuth flow
2. Antigravity stores refresh token securely
3. MCP servers automatically use authenticated context
4. No manual credential management needed

#### Supported Services

- Google Cloud Platform (GCP) services
- BigQuery
- Cloud Spanner
- AlloyDB
- Cloud SQL
- Looker
- Firebase

#### Configuration Example

```json
{
  "mcpServers": {
    "bigquery": {
      "command": "npx",
      "args": ["-y", "@google-cloud/mcp-server-bigquery"],
      "env": {}
    }
  }
}
```

**No explicit credentials needed** - OAuth Personal handles authentication automatically.

### Environment Variables

For non-Google services or custom authentication:

#### Using Environment Variable References

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@github/mcp-server"],
      "env": {
        "GITHUB_TOKEN": "${env:GITHUB_TOKEN}"
      }
    }
  }
}
```

#### Setting Environment Variables

**macOS/Linux (bash/zsh):**
```bash
# In ~/.bashrc or ~/.zshrc
export GITHUB_TOKEN="ghp_your_token_here"
export SUPABASE_TOKEN="your_supabase_token"

# Reload shell
source ~/.bashrc  # or source ~/.zshrc
```

**Environment variable file:**
```bash
# .env (load before starting Antigravity)
GITHUB_TOKEN=ghp_your_token_here
SUPABASE_TOKEN=your_supabase_token
API_KEY=your_api_key
```

**Load in terminal:**
```bash
export $(cat .env | xargs)
```

**Security Warning:** Never commit `.env` files with credentials to version control.

### API Keys and Tokens

#### Inline Credentials (Not Recommended)

```json
{
  "mcpServers": {
    "service": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-server",
        "--api-key",
        "hardcoded-key"  // ❌ Avoid this
      ],
      "env": {}
    }
  }
}
```

**Problems:**
- Credentials visible in config file
- Risk of accidental git commits
- No rotation without config updates
- Security vulnerability

#### Environment Variable Pattern (Recommended)

```json
{
  "mcpServers": {
    "service": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-server",
        "--api-key",
        "${env:SERVICE_API_KEY}"  // ✅ Use this
      ],
      "env": {}
    }
  }
}
```

**Benefits:**
- Credentials separate from config
- Safe to commit to version control
- Easy rotation and management
- Better security posture

### Service Account Authentication

For Google Cloud services using service accounts:

```json
{
  "mcpServers": {
    "gcp-service": {
      "command": "npx",
      "args": ["-y", "@google-cloud/mcp-server"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/service-account.json"
      }
    }
  }
}
```

**Setup:**
1. Create service account in GCP Console
2. Download JSON key file
3. Store in secure location (not in project directory)
4. Reference path in config

## Environment Variables

### Syntax

**Reference environment variable:**
```json
"env": {
  "KEY": "${env:VARIABLE_NAME}"
}
```

**Direct value:**
```json
"env": {
  "KEY": "direct-value"
}
```

**Mixed usage:**
```json
"env": {
  "API_KEY": "${env:MY_API_KEY}",
  "NODE_ENV": "production",
  "LOG_LEVEL": "debug"
}
```

### Common Environment Variables

#### API and Authentication

```json
"env": {
  "API_KEY": "${env:SERVICE_API_KEY}",
  "API_SECRET": "${env:SERVICE_API_SECRET}",
  "ACCESS_TOKEN": "${env:SERVICE_ACCESS_TOKEN}",
  "REFRESH_TOKEN": "${env:SERVICE_REFRESH_TOKEN}"
}
```

#### Database Connections

```json
"env": {
  "DATABASE_URL": "${env:DATABASE_URL}",
  "DB_HOST": "${env:DB_HOST}",
  "DB_PORT": "${env:DB_PORT}",
  "DB_NAME": "${env:DB_NAME}",
  "DB_USER": "${env:DB_USER}",
  "DB_PASSWORD": "${env:DB_PASSWORD}"
}
```

#### Application Settings

```json
"env": {
  "NODE_ENV": "production",
  "LOG_LEVEL": "info",
  "TIMEOUT": "30000",
  "DEBUG": "false",
  "CACHE_ENABLED": "true"
}
```

#### Project Paths

```json
"env": {
  "PROJECT_ROOT": "${workspaceFolder}",
  "CONFIG_PATH": "/path/to/config",
  "DATA_DIR": "/var/data"
}
```

### Best Practices

**Security:**
- ✅ Use `${env:VAR}` for sensitive data
- ✅ Store credentials in shell profile
- ✅ Add `.env` to `.gitignore`
- ❌ Never hardcode secrets in config
- ❌ Never commit credentials to git

**Organization:**
- ✅ Group related variables
- ✅ Use consistent naming (UPPER_SNAKE_CASE)
- ✅ Document required variables in README
- ✅ Provide `.env.example` template

## Transport Options

### STDIO (Standard Input/Output)

**Default transport method** for most MCP servers.

```json
{
  "mcpServers": {
    "stdio-server": {
      "command": "npx",
      "args": ["-y", "mcp-server-package"],
      "env": {}
    }
  }
}
```

**Characteristics:**
- Direct process communication
- Low latency
- Simple configuration
- Most common method

### HTTP/SSE (Server-Sent Events)

For remote or browser-based MCP servers.

```json
{
  "mcpServers": {
    "remote-server": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://127.0.0.1:3845/sse"
      ],
      "env": {}
    }
  }
}
```

**Use cases:**
- Remote server connections
- Browser-based tools
- Services behind proxies
- Cross-network communication

### WebSocket

For bidirectional real-time communication.

```json
{
  "mcpServers": {
    "websocket-server": {
      "command": "/path/to/server-binary",
      "args": ["--ws-port", "54989"],
      "env": {}
    }
  }
}
```

**Use cases:**
- Real-time updates
- Bidirectional streaming
- Custom protocols
- High-performance scenarios

## Configuration Examples

### Node.js Server

```json
{
  "mcpServers": {
    "custom-node-server": {
      "command": "node",
      "args": ["/path/to/project/mcp-server/index.js"],
      "env": {
        "NODE_ENV": "production",
        "API_KEY": "${env:CUSTOM_API_KEY}",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

### Python Server

```json
{
  "mcpServers": {
    "python-tools": {
      "command": "python",
      "args": ["-m", "my_mcp_server"],
      "env": {
        "PYTHONPATH": "/path/to/modules",
        "DATABASE_URL": "${env:DATABASE_URL}",
        "DEBUG": "false"
      }
    }
  }
}
```

### NPX Package Server

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "${env:SUPABASE_ACCESS_TOKEN}"
      ],
      "env": {}
    }
  }
}
```

### GitHub Integration

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@github/mcp-server"],
      "env": {
        "GITHUB_TOKEN": "${env:GITHUB_TOKEN}"
      }
    }
  }
}
```

### Google BigQuery

```json
{
  "mcpServers": {
    "bigquery": {
      "command": "npx",
      "args": ["-y", "@google-cloud/mcp-server-bigquery"],
      "env": {}
    }
  }
}
```

**Note:** Uses OAuth Personal authentication automatically.

### Local Binary (Extension)

```json
{
  "mcpServers": {
    "pencil-design": {
      "command": "/Users/username/.antigravity/extensions/highagency.pencildev-0.6.20-universal/out/mcp-server-darwin-arm64",
      "args": ["--ws-port", "54989"],
      "env": {}
    }
  }
}
```

### Remote HTTP Server

```json
{
  "mcpServers": {
    "figma-dev-mode": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://127.0.0.1:3845/sse"
      ],
      "env": {}
    }
  }
}
```

### Multiple Services

```json
{
  "mcpServers": {
    "bigquery": {
      "command": "npx",
      "args": ["-y", "@google-cloud/mcp-server-bigquery"],
      "env": {}
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@github/mcp-server"],
      "env": {
        "GITHUB_TOKEN": "${env:GITHUB_TOKEN}"
      }
    },
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "${env:SUPABASE_TOKEN}"
      ],
      "env": {}
    },
    "custom-tools": {
      "command": "node",
      "args": ["./tools/mcp-server.js"],
      "env": {
        "PROJECT_ROOT": "${workspaceFolder}",
        "API_KEY": "${env:TOOLS_API_KEY}"
      }
    }
  }
}
```

## Complete Configuration Examples

### Development Environment

**~/.gemini/antigravity/mcp_config.json:**
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@github/mcp-server"],
      "env": {
        "GITHUB_TOKEN": "${env:GITHUB_TOKEN}"
      }
    },
    "database-tools": {
      "command": "npx",
      "args": ["-y", "mcp-server-postgres"],
      "env": {
        "DATABASE_URL": "${env:DEV_DATABASE_URL}"
      }
    },
    "local-tools": {
      "command": "node",
      "args": ["/Users/username/dev/tools/mcp-server.js"],
      "env": {
        "NODE_ENV": "development",
        "DEBUG": "true"
      }
    }
  }
}
```

### Team Project Configuration

**project-root/.gemini/mcp_config.json:**
```json
{
  "mcpServers": {
    "bigquery": {
      "command": "npx",
      "args": ["-y", "@google-cloud/mcp-server-bigquery"],
      "env": {}
    },
    "project-database": {
      "command": "npx",
      "args": ["-y", "mcp-server-postgres"],
      "env": {
        "DATABASE_URL": "${env:PROJECT_DATABASE_URL}"
      }
    },
    "project-api": {
      "command": "node",
      "args": ["./scripts/mcp-server.js"],
      "env": {
        "API_ENDPOINT": "https://api.project.com",
        "API_KEY": "${env:PROJECT_API_KEY}"
      }
    }
  }
}
```

**README.md:**
```markdown
## MCP Setup

### Required Environment Variables

```bash
export PROJECT_DATABASE_URL="postgresql://..."
export PROJECT_API_KEY="your-api-key"
```

### Installation

```bash
# Install dependencies
npm install

# Configure MCP
# File already exists: .gemini/mcp_config.json
```

### Usage

Open project in Antigravity. MCP servers will be available automatically.
```

### Production Configuration

**~/.gemini/antigravity/mcp_config.json:**
```json
{
  "mcpServers": {
    "bigquery-prod": {
      "command": "npx",
      "args": ["-y", "@google-cloud/mcp-server-bigquery"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/secure/path/service-account.json"
      }
    },
    "monitoring": {
      "command": "npx",
      "args": ["-y", "mcp-server-monitoring"],
      "env": {
        "API_KEY": "${env:MONITORING_API_KEY}",
        "ENVIRONMENT": "production",
        "LOG_LEVEL": "warn"
      }
    },
    "analytics": {
      "command": "python",
      "args": ["-m", "analytics_mcp_server"],
      "env": {
        "DATABASE_URL": "${env:ANALYTICS_DB_URL}",
        "CACHE_ENABLED": "true",
        "TIMEOUT": "30000"
      }
    }
  }
}
```

## Configuration Management

### Version Control

**Commit to git:**
```bash
# Add project configuration
git add .gemini/mcp_config.json
git commit -m "feat: add MCP server configuration"
```

**Add to .gitignore:**
```gitignore
# Never commit user-level configs
~/.gemini/antigravity/mcp_config.json

# Never commit environment files
.env
.env.local
.env.*.local
```

### Documentation

**Create .env.example:**
```bash
# .env.example
# Copy to .env and fill in values

# GitHub Integration
GITHUB_TOKEN=your_github_token_here

# Database
PROJECT_DATABASE_URL=postgresql://localhost/mydb

# API Keys
PROJECT_API_KEY=your_api_key_here
SUPABASE_TOKEN=your_supabase_token_here
```

**Document in README:**
```markdown
## Environment Setup

1. Copy environment template:
   ```bash
   cp .env.example .env
   ```

2. Fill in credentials in `.env`

3. Load environment:
   ```bash
   export $(cat .env | xargs)
   ```

4. Restart Antigravity
```

### Validation

**Check configuration syntax:**
```bash
# Validate JSON
cat .gemini/mcp_config.json | python -m json.tool

# Or with jq
jq empty .gemini/mcp_config.json
```

**Test server configuration:**
```bash
# Run command manually
npx -y @package/mcp-server

# Check environment variables
echo $GITHUB_TOKEN
echo $DATABASE_URL
```

## Troubleshooting

### Common Issues

**Server won't start:**
- Verify `command` path is correct
- Check dependencies installed (`npx` packages)
- Test command manually in terminal
- Review Antigravity console for errors

**Environment variables not found:**
- Confirm variables set: `echo $VAR_NAME`
- Restart Antigravity after setting variables
- Check syntax: `${env:VAR_NAME}`
- Verify shell profile loaded

**Authentication failures:**
- Check OAuth Personal enabled in settings.json
- Verify credentials in environment
- Test API keys manually
- Review server-specific auth docs

**Tools not appearing:**
- Confirm server enabled in MCP Store
- Check server implements MCP protocol
- Verify JSON syntax valid
- Restart Antigravity

### Debug Steps

1. **Validate configuration:**
   ```bash
   jq empty .gemini/mcp_config.json
   ```

2. **Test command manually:**
   ```bash
   npx -y @package/mcp-server
   ```

3. **Check environment:**
   ```bash
   env | grep TOKEN
   ```

4. **Review logs:**
   - Open MCP Store
   - Select "Manage MCP Servers"
   - View error messages

5. **Simplify configuration:**
   - Test with minimal config
   - Add complexity incrementally

## Best Practices

### Security

- ✅ Use OAuth Personal for Google services
- ✅ Store secrets in environment variables
- ✅ Reference with `${env:VAR}`
- ✅ Add `.env` to `.gitignore`
- ✅ Use service accounts for production
- ❌ Never hardcode credentials
- ❌ Never commit secrets to git

### Organization

- ✅ Use descriptive server names
- ✅ Group related servers
- ✅ Document required variables
- ✅ Provide setup instructions
- ✅ Use consistent naming conventions

### Performance

- ✅ Enable only needed servers (< 50 tools total)
- ✅ Disable unused servers
- ✅ Monitor startup times
- ✅ Use latest server versions

### Team Collaboration

- ✅ Commit project-level configs
- ✅ Use user-level for personal tools
- ✅ Document setup in README
- ✅ Provide `.env.example`
- ✅ Test on team member machines

## Next Steps

- [Installation Guide](./installation.md) - Installing MCP servers
- [Usage Guide](./usage.md) - Using MCP servers in Antigravity
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions
- [MCP Server Builder](../../03-creating-servers/quickstart.md) - Creating custom servers

## Related Resources

- [Antigravity MCP Documentation](https://antigravity.google/docs/mcp)
- [Google Cloud MCP Integration](https://cloud.google.com/blog/products/data-analytics/connect-google-antigravity-ide-to-googles-data-cloud-services)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
