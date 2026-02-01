# MCP Setup in Cursor

## Introduction

The Model Context Protocol (MCP) enables Cursor to connect with external tools, services, and data sources through a standardized interface. Instead of manually describing your project structure, databases, or APIs in every conversation, you can integrate Cursor directly with your development environment using MCP servers.

This guide covers everything you need to know to configure and use MCP in Cursor, from basic setup to advanced configurations.

## What is MCP in Cursor?

MCP allows Cursor to:

- **Execute tools**: Run functions in external systems (file operations, API calls, database queries)
- **Access resources**: Query structured data sources (documentation, codebases, databases)
- **Use prompts**: Leverage pre-defined workflows and message templates
- **Navigate filesystems**: Server-initiated boundary queries for workspace exploration
- **Request information**: Servers can ask users for additional context when needed

### How It Works

1. You configure MCP servers in `mcp.json`
2. Cursor connects to these servers on startup
3. Servers expose tools, prompts, and resources
4. The AI agent can discover and use these capabilities during conversations
5. You approve tool executions (or enable auto-run for trusted tools)

## Transport Methods

Cursor supports three ways to connect with MCP servers:

### stdio Transport

**Local, single-user, Cursor-managed execution**

The server runs as a subprocess spawned by Cursor. Communication happens through standard input/output streams.

**Best for:**
- Local development tools
- Project-specific utilities
- Personal automation scripts
- Simple integrations

**Advantages:**
- Easy to set up
- No network configuration needed
- Automatic process management
- Good for single-user environments

**Limitations:**
- Single user only
- Local execution only
- Manual authentication management

### SSE Transport

**Local or remote, multi-user, Server-Sent Events**

The server runs independently and communicates via SSE endpoints. Multiple users can connect to the same server.

**Best for:**
- Shared team tools
- Remote services
- Multi-user environments
- Scalable deployments

**Advantages:**
- Supports multiple concurrent users
- Can run on remote servers
- OAuth authentication support
- Better for production environments

**Limitations:**
- Requires server deployment
- More complex setup
- Network dependency

### Streamable HTTP Transport

**Local or remote, multi-user, HTTP endpoints**

Similar to SSE but uses HTTP streaming for bidirectional communication.

**Best for:**
- RESTful service integrations
- Cloud-hosted tools
- Enterprise deployments
- Cross-platform services

**Advantages:**
- Standard HTTP protocol
- Wide compatibility
- OAuth support
- Scalable architecture

**Limitations:**
- Requires server infrastructure
- Network latency considerations
- More setup complexity

### Comparison Table

| Feature | stdio | SSE | HTTP |
|---------|-------|-----|------|
| **Environment** | Local only | Local/Remote | Local/Remote |
| **Deployment** | Cursor-managed | Custom server | Custom server |
| **Users** | Single | Multiple | Multiple |
| **Configuration** | Shell command | Endpoint URL | Endpoint URL |
| **Authentication** | Manual env vars | OAuth supported | OAuth supported |
| **Complexity** | Low | Medium | Medium |
| **Scalability** | Low | High | High |

## Protocol Capabilities

Cursor fully implements all MCP protocol features:

### Tools

**AI-executable functions** that perform actions on behalf of the user.

**Examples:**
- File operations (read, write, search)
- API calls (REST, GraphQL)
- Database queries
- External service interactions
- Code generation or analysis

**Usage in Cursor:**
```markdown
User: "Search for all TODO comments in the codebase"
Agent: [uses search_files tool from MCP server]
Agent: "Found 23 TODO comments across 8 files..."
```

### Prompts

**Templated messages and workflows** that can be invoked by name.

**Examples:**
- Code review templates
- Documentation generation workflows
- Testing scenarios
- Refactoring patterns

**Usage in Cursor:**
```markdown
User: "/code-review"
Agent: [loads code review prompt template]
Agent: "I'll review this code for: security, performance, maintainability..."
```

### Resources

**Structured, queryable data sources** that the AI can read from.

**Examples:**
- Documentation databases
- Project metadata
- API specifications
- Configuration files
- Knowledge bases

**Usage in Cursor:**
```markdown
Agent: [queries resource://docs/api for API documentation]
Agent: "According to your API docs, this endpoint requires authentication..."
```

### Roots

**Server-initiated queries** about filesystem or URI boundaries.

**Examples:**
- Workspace root detection
- Project structure analysis
- Module boundary identification

**Usage:**
The server asks Cursor about filesystem roots to understand project organization and scope.

### Elicitation

**Server requests** for additional information from the user.

**Examples:**
- Asking for missing API keys
- Requesting clarification on ambiguous queries
- Gathering additional context for complex operations

**Usage:**
```markdown
Server: "I need your API key to continue. Please provide GITHUB_TOKEN."
User: [provides token]
Server: [continues operation]
```

## Configuration Locations

Cursor supports two configuration locations for MCP servers:

### Project-Specific Configuration

**Location:** `.cursor/mcp.json` in your project root

**Purpose:** Share MCP configurations with your team

**Best for:**
- Project-specific tools
- Team-shared utilities
- Development environment setup
- Version-controlled configurations

**Example:**
```
my-project/
├── .cursor/
│   └── mcp.json          # Team configuration
├── src/
└── README.md
```

**Benefits:**
- Version controlled (git)
- Same setup for all team members
- Project-specific tools automatically available
- Easy onboarding for new developers

### Global Configuration

**Location:** `~/.cursor/mcp.json` in your home directory

**Purpose:** Personal tools available across all projects

**Best for:**
- Personal utilities
- Cross-project tools
- Global integrations
- Private configurations

**Example:**
```
~/.cursor/
└── mcp.json              # Personal configuration
```

**Benefits:**
- Available in all projects
- Private to your machine
- Personal preferences and tools
- Not shared with team

### Priority

When both configurations exist, Cursor merges them with **project-specific taking priority** over global configurations.

## Local CLI Server Setup

### Node.js Server (stdio)

**Use case:** MCP servers distributed as npm packages

#### Basic Configuration

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "mcp-server-package"]
    }
  }
}
```

**Explanation:**
- `mcpServers`: Object containing all server configurations
- `server-name`: Unique identifier for this server (choose descriptive name)
- `command`: Executable to run (`npx` for npm packages)
- `args`: Arguments passed to command
  - `-y`: Auto-confirm npx prompts
  - `mcp-server-package`: npm package name

#### With Environment Variables

```json
{
  "mcpServers": {
    "github-mcp": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${env:GITHUB_TOKEN}"
      }
    }
  }
}
```

**Environment variable patterns:**
- `"value"`: Hardcoded value (avoid for secrets)
- `"${env:VAR_NAME}"`: Read from environment variable
- Use environment variables for API keys and secrets

#### Multiple Servers

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/username/projects"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${env:GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_URL": "${env:DATABASE_URL}"
      }
    }
  }
}
```

### Python Server (stdio)

**Use case:** MCP servers written in Python

#### Basic Configuration

```json
{
  "mcpServers": {
    "python-server": {
      "command": "python",
      "args": ["server.py"]
    }
  }
}
```

#### With Virtual Environment

```json
{
  "mcpServers": {
    "python-tools": {
      "command": "${workspaceFolder}/venv/bin/python",
      "args": ["${workspaceFolder}/tools/mcp_server.py"]
    }
  }
}
```

**Path interpolation variables:**
- `${workspaceFolder}`: Project root directory
- `${userHome}`: User's home directory
- `${workspaceFolderBasename}`: Project folder name
- `${pathSeparator}` or `${/}`: OS-specific path separator

#### With Environment File

```json
{
  "mcpServers": {
    "data-analyzer": {
      "command": "python",
      "args": ["${workspaceFolder}/analysis/server.py"],
      "envFile": "${workspaceFolder}/.env"
    }
  }
}
```

**Note:** `envFile` loads environment variables from a file (stdio only).

#### Complete Python Example

```json
{
  "mcpServers": {
    "ml-tools": {
      "command": "${workspaceFolder}/.venv/bin/python",
      "args": [
        "${workspaceFolder}/mcp/ml_server.py",
        "--model-path",
        "${workspaceFolder}/models"
      ],
      "env": {
        "OPENAI_API_KEY": "${env:OPENAI_API_KEY}",
        "CUDA_VISIBLE_DEVICES": "0"
      },
      "envFile": "${workspaceFolder}/.env.local"
    }
  }
}
```

### Docker Container Server

```json
{
  "mcpServers": {
    "docker-tools": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "--network=host",
        "-e", "API_KEY=${env:API_KEY}",
        "mcp-server-image:latest"
      ]
    }
  }
}
```

**Docker flags explained:**
- `--rm`: Remove container after exit
- `-i`: Interactive mode (for stdio communication)
- `--network=host`: Share host network
- `-e`: Pass environment variables

## Remote Server Configuration

### HTTP Server

**Use case:** Servers hosted on remote machines or cloud services

#### Basic HTTP Configuration

```json
{
  "mcpServers": {
    "remote-api": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

#### With Authentication Headers

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

#### Production Remote Server

```json
{
  "mcpServers": {
    "production-tools": {
      "url": "https://mcp.company.com/api/v1/mcp",
      "headers": {
        "Authorization": "Bearer ${env:COMPANY_MCP_TOKEN}",
        "X-Workspace": "${workspaceFolderBasename}",
        "X-User": "${env:USER}"
      }
    }
  }
}
```

### SSE Server

**Use case:** Server-Sent Events for streaming responses

```json
{
  "mcpServers": {
    "streaming-server": {
      "url": "https://stream.example.com/mcp/sse",
      "type": "sse",
      "headers": {
        "Authorization": "Bearer ${env:SSE_TOKEN}"
      }
    }
  }
}
```

### OAuth-Authenticated Server

**Use case:** Services requiring OAuth 2.0 authentication

```json
{
  "mcpServers": {
    "oauth-service": {
      "url": "https://api.service.com/mcp",
      "auth": {
        "CLIENT_ID": "${env:OAUTH_CLIENT_ID}",
        "CLIENT_SECRET": "${env:OAUTH_CLIENT_SECRET}",
        "scopes": ["read", "write", "admin"]
      }
    }
  }
}
```

**OAuth redirect URL:** `cursor://anysphere.cursor-mcp/oauth/callback`

**Setup steps:**
1. Register this redirect URL with your OAuth provider
2. Obtain client ID and client secret
3. Store credentials in environment variables
4. Configure scopes based on required permissions

**Note:** The server is identified via OAuth's `state` parameter, allowing one redirect URL for all servers.

### Mixed Local and Remote Configuration

```json
{
  "mcpServers": {
    "local-filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "${workspaceFolder}"]
    },
    "remote-database": {
      "url": "https://db.company.com/mcp",
      "headers": {
        "Authorization": "Bearer ${env:DB_MCP_TOKEN}"
      }
    },
    "team-tools": {
      "url": "http://internal-tools.local:8080/mcp",
      "headers": {
        "X-Team": "engineering"
      }
    }
  }
}
```

## Configuration Interpolation

Cursor supports dynamic value substitution in `mcp.json`:

### Environment Variables

```json
{
  "mcpServers": {
    "server": {
      "command": "npx",
      "args": ["-y", "mcp-server"],
      "env": {
        "API_KEY": "${env:MY_API_KEY}",
        "DATABASE_URL": "${env:DATABASE_URL}",
        "LOG_LEVEL": "${env:LOG_LEVEL}"
      }
    }
  }
}
```

**Setup:**
```bash
# In ~/.bashrc, ~/.zshrc, or environment
export MY_API_KEY="sk-abc123..."
export DATABASE_URL="postgresql://..."
export LOG_LEVEL="debug"
```

### Path Variables

```json
{
  "mcpServers": {
    "project-tools": {
      "command": "python",
      "args": [
        "${workspaceFolder}/scripts/mcp_server.py",
        "--config",
        "${workspaceFolder}/config.json",
        "--output",
        "${workspaceFolder}/output"
      ],
      "env": {
        "HOME": "${userHome}",
        "PROJECT_NAME": "${workspaceFolderBasename}"
      }
    }
  }
}
```

**Available variables:**
- `${env:VAR}`: Environment variable value
- `${userHome}`: User's home directory (e.g., `/Users/username`)
- `${workspaceFolder}`: Current workspace root (e.g., `/Users/username/project`)
- `${workspaceFolderBasename}`: Workspace folder name (e.g., `project`)
- `${pathSeparator}` or `${/}`: OS path separator (`/` on Unix, `\` on Windows)

### Complete Interpolation Example

```json
{
  "mcpServers": {
    "advanced-server": {
      "command": "${userHome}${/}.local${/}bin${/}custom-server",
      "args": [
        "--workspace", "${workspaceFolder}",
        "--project", "${workspaceFolderBasename}",
        "--user", "${env:USER}",
        "--config", "${userHome}${/}.config${/}server.yaml"
      ],
      "env": {
        "SERVER_HOME": "${userHome}${/}.server",
        "PROJECT_ROOT": "${workspaceFolder}",
        "API_KEY": "${env:SERVER_API_KEY}",
        "LOG_PATH": "${workspaceFolder}${/}logs${/}mcp.log"
      },
      "envFile": "${workspaceFolder}${/}.env"
    }
  }
}
```

## Configuration Fields Reference

### STDIO Server Fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `type` | No | string | Transport type (default: `"stdio"`) |
| `command` | Yes | string | Executable command to run |
| `args` | No | string[] | Command-line arguments |
| `env` | No | object | Environment variables |
| `envFile` | No | string | Path to .env file (stdio only) |

**Example:**
```json
{
  "type": "stdio",
  "command": "python",
  "args": ["server.py", "--verbose"],
  "env": {
    "API_KEY": "${env:API_KEY}"
  },
  "envFile": "${workspaceFolder}/.env"
}
```

### Remote Server Fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `url` | Yes | string | Server endpoint URL |
| `type` | No | string | Transport type (`"http"` or `"sse"`) |
| `headers` | No | object | HTTP headers for authentication |
| `auth` | No | object | OAuth configuration |

**Example:**
```json
{
  "url": "https://api.example.com/mcp",
  "type": "http",
  "headers": {
    "Authorization": "Bearer ${env:TOKEN}"
  }
}
```

### OAuth Fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `CLIENT_ID` | Yes | string | OAuth client identifier |
| `CLIENT_SECRET` | Yes | string | OAuth client secret |
| `scopes` | No | string[] | Required OAuth scopes |

**Example:**
```json
{
  "url": "https://oauth.example.com/mcp",
  "auth": {
    "CLIENT_ID": "${env:OAUTH_CLIENT_ID}",
    "CLIENT_SECRET": "${env:OAUTH_CLIENT_SECRET}",
    "scopes": ["read", "write"]
  }
}
```

## Quick Start Examples

### Example 1: Filesystem Access

**Goal:** Enable AI to read/write project files

**Setup:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "${workspaceFolder}"
      ]
    }
  }
}
```

**Usage in chat:**
```
User: "Read the README file and summarize it"
Agent: [uses filesystem tool to read README.md]
Agent: "This project is a..."
```

### Example 2: GitHub Integration

**Goal:** Query GitHub repositories, issues, PRs

**Setup:**
1. Get GitHub Personal Access Token from [github.com/settings/tokens](https://github.com/settings/tokens)
2. Export token: `export GITHUB_TOKEN="ghp_..."`
3. Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${env:GITHUB_TOKEN}"
      }
    }
  }
}
```

**Usage in chat:**
```
User: "List open issues in my repository"
Agent: [uses github_list_issues tool]
Agent: "You have 12 open issues..."
```

### Example 3: Database Queries

**Goal:** Query PostgreSQL database

**Setup:**
1. Set database URL: `export DATABASE_URL="postgresql://user:pass@localhost/db"`
2. Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "database": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_URL": "${env:DATABASE_URL}"
      }
    }
  }
}
```

**Usage in chat:**
```
User: "Show me the users table schema"
Agent: [uses postgres_query tool]
Agent: "The users table has these columns..."
```

### Example 4: Multiple Servers

**Goal:** Combine filesystem, GitHub, and custom tools

**Setup in `.cursor/mcp.json`:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "${workspaceFolder}"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${env:GITHUB_TOKEN}"
      }
    },
    "custom-tools": {
      "command": "python",
      "args": ["${workspaceFolder}/tools/mcp_server.py"],
      "env": {
        "TOOL_CONFIG": "${workspaceFolder}/config.json"
      }
    }
  }
}
```

**Usage:**
```
User: "Read our API documentation, create a GitHub issue for improvements,
      and generate a migration plan"
Agent: [uses filesystem to read docs]
Agent: [uses github to create issue]
Agent: [uses custom-tools to generate plan]
Agent: "I've completed all three tasks..."
```

### Example 5: Remote Team Server

**Goal:** Connect to company-hosted MCP server

**Setup:**
1. Get access token from admin
2. Export token: `export COMPANY_MCP_TOKEN="..."`
3. Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "company-tools": {
      "url": "https://mcp.company.com/api",
      "headers": {
        "Authorization": "Bearer ${env:COMPANY_MCP_TOKEN}",
        "X-Team": "engineering"
      }
    }
  }
}
```

**Usage:**
```
User: "Deploy to staging environment"
Agent: [uses company deploy tool from remote server]
Agent: "Deployment initiated..."
```

## Using MCP in Chat

### Automatic Tool Discovery

Once configured, MCP servers expose their tools to Cursor automatically. The AI agent can see available tools under "Available Tools" in the chat interface.

**How it works:**
1. Cursor connects to all enabled MCP servers on startup
2. Each server reports its available tools, prompts, and resources
3. The AI agent receives this information in its context
4. Agent uses tools when appropriate to answer your questions

### Requesting Specific Tools

You can explicitly ask the agent to use MCP tools:

**By name:**
```
User: "Use the github_search_code tool to find all instances of 'TODO'"
```

**By description:**
```
User: "Search the codebase for security vulnerabilities"
Agent: [automatically selects appropriate security scanning tool]
```

**By capability:**
```
User: "I need to query the database"
Agent: [uses database MCP server tools]
```

### Tool Approval

By default, Cursor asks for approval before executing MCP tools.

**Approval dialog shows:**
- Tool name
- Arguments being passed
- Server providing the tool
- Potential impact

**Options:**
- **Approve:** Execute once
- **Reject:** Cancel execution
- **Inspect:** View detailed arguments (click arrow beside tool name)

### Auto-Run Mode

Enable auto-run to allow the agent to execute trusted tools without prompting.

**To enable:**
1. Open Settings: `Cmd+Shift+J` (macOS) or `Ctrl+Shift+J` (Windows/Linux)
2. Navigate to Features → Model Context Protocol
3. Enable "Auto-run tools"

**Security consideration:** Only enable auto-run for trusted, well-tested tools from known sources.

### Returning Images

MCP servers can return images that Cursor will display inline.

**Server implementation (JavaScript):**
```javascript
server.tool("generate_diagram", async (params) => {
  const imageData = generateDiagram(params.type);

  return {
    content: [
      {
        type: "image",
        data: imageData, // base64-encoded
        mimeType: "image/png"
      }
    ]
  };
});
```

**Usage:**
```
User: "Generate a class diagram for our User model"
Agent: [uses generate_diagram tool]
Agent: [displays diagram image]
Agent: "Here's the class diagram showing..."
```

**Supported formats:**
- `image/png`
- `image/jpeg`
- `image/gif`
- `image/svg+xml`

**Note:** The model analyzes images if it supports vision capabilities (GPT-4 Vision, Claude with vision, etc.).

## Debugging MCP Servers

### Accessing MCP Logs

**Steps:**
1. Open Output panel: `Cmd+Shift+U` (macOS) or `Ctrl+Shift+U` (Windows/Linux)
2. Select "MCP Logs" from the dropdown menu
3. Review connection logs, errors, and tool executions

**What to look for:**
- Connection errors
- Authentication failures
- Tool execution errors
- Server startup issues
- Network problems

### Common Log Messages

**Successful connection:**
```
[INFO] Connected to MCP server: server-name
[INFO] Discovered 5 tools from server-name
```

**Connection failure:**
```
[ERROR] Failed to connect to server-name
[ERROR] Command not found: npx
```

**Authentication error:**
```
[ERROR] Authentication failed for server-name
[ERROR] Invalid API key
```

**Tool execution error:**
```
[ERROR] Tool execution failed: tool_name
[ERROR] Permission denied: /path/to/file
```

### Manual Testing

Test MCP servers independently before using in Cursor:

**For stdio servers:**
```bash
# Test Node.js server
npx -y @modelcontextprotocol/server-filesystem /path/to/test

# Test Python server
python tools/mcp_server.py

# Test with environment variables
GITHUB_TOKEN="..." npx -y @modelcontextprotocol/server-github
```

**For remote servers:**
```bash
# Test HTTP endpoint
curl https://api.example.com/mcp \
  -H "Authorization: Bearer $TOKEN"

# Test SSE endpoint
curl -N https://stream.example.com/mcp/sse \
  -H "Authorization: Bearer $TOKEN"
```

## Managing Servers

### Enabling/Disabling Servers

**Through Settings:**
1. Open Settings: `Cmd+Shift+J` (macOS) or `Ctrl+Shift+J` (Windows/Linux)
2. Navigate to Features → Model Context Protocol
3. Toggle individual servers on/off

**Effects:**
- Disabled servers don't load on startup
- Tools from disabled servers don't appear in chat
- Useful for troubleshooting or reducing tool clutter

### Updating MCP Servers

**For npm-based servers:**
```bash
# Clear npm cache
npm cache clean --force

# Remove and reinstall
# (Remove from mcp.json, restart Cursor, re-add)
```

**For custom servers:**
```bash
# Update local files
cd tools/
git pull origin main

# Restart Cursor to reload
```

**For remote servers:**
No action needed on client side. Server updates are automatic.

## Security Best Practices

### Server Verification

Before installing MCP servers:

- **Verify source:** Only install from trusted developers/organizations
- **Review code:** Check GitHub repository for transparency
- **Read permissions:** Understand what data the server can access
- **Check updates:** Prefer actively maintained projects
- **Community trust:** Look for community adoption and reviews

### API Key Management

**Do:**
- ✅ Use environment variables for all secrets
- ✅ Use restricted API keys with minimal permissions
- ✅ Rotate keys regularly
- ✅ Document required environment variables in README
- ✅ Use different keys for development and production

**Don't:**
- ❌ Never hardcode credentials in `mcp.json`
- ❌ Never commit `.env` files to git
- ❌ Never share API keys in chat or logs
- ❌ Never use admin/root keys when restricted keys suffice

### Transport Security

**stdio transport:**
- Most secure (local execution only)
- No network exposure
- Recommended for sensitive operations

**HTTP/SSE transport:**
- Use HTTPS only (never HTTP for remote servers)
- Validate SSL certificates
- Use OAuth for user authentication
- Implement rate limiting on server side

### Isolated Environments

For sensitive data handling:

```json
{
  "mcpServers": {
    "production-db": {
      "command": "docker",
      "args": [
        "run", "--rm", "-i",
        "--network=none",  // No network access
        "--read-only",     // Read-only filesystem
        "-e", "DB_URL=${env:PROD_DB_URL}",
        "db-mcp-server:latest"
      ]
    }
  }
}
```

## Complete Configuration Examples

### Example: Full-Stack Development Setup

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "${workspaceFolder}"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${env:GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_URL": "${env:DATABASE_URL}"
      }
    },
    "docker": {
      "command": "python",
      "args": ["${workspaceFolder}/tools/docker_mcp.py"],
      "env": {
        "DOCKER_HOST": "unix:///var/run/docker.sock"
      }
    }
  }
}
```

### Example: Data Science Workflow

```json
{
  "mcpServers": {
    "jupyter": {
      "command": "${userHome}/miniconda3/bin/python",
      "args": ["${workspaceFolder}/mcp/jupyter_server.py"],
      "env": {
        "JUPYTER_TOKEN": "${env:JUPYTER_TOKEN}",
        "NOTEBOOK_DIR": "${workspaceFolder}/notebooks"
      }
    },
    "data-loader": {
      "command": "${userHome}/miniconda3/bin/python",
      "args": ["${workspaceFolder}/mcp/data_server.py"],
      "env": {
        "DATA_PATH": "${workspaceFolder}/data",
        "AWS_ACCESS_KEY_ID": "${env:AWS_ACCESS_KEY_ID}",
        "AWS_SECRET_ACCESS_KEY": "${env:AWS_SECRET_ACCESS_KEY}"
      }
    },
    "ml-models": {
      "url": "https://ml-api.company.com/mcp",
      "headers": {
        "Authorization": "Bearer ${env:ML_API_TOKEN}",
        "X-Project": "${workspaceFolderBasename}"
      }
    }
  }
}
```

### Example: Enterprise Multi-Server Setup

```json
{
  "mcpServers": {
    "local-filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "${workspaceFolder}"]
    },
    "company-docs": {
      "url": "https://docs.company.com/mcp",
      "headers": {
        "Authorization": "Bearer ${env:COMPANY_DOCS_TOKEN}"
      }
    },
    "deployment-tools": {
      "url": "https://deploy.company.com/mcp/api",
      "auth": {
        "CLIENT_ID": "${env:DEPLOY_OAUTH_ID}",
        "CLIENT_SECRET": "${env:DEPLOY_OAUTH_SECRET}",
        "scopes": ["deploy:staging", "deploy:production"]
      }
    },
    "monitoring": {
      "url": "https://monitor.company.com/mcp",
      "headers": {
        "X-API-Key": "${env:MONITORING_API_KEY}",
        "X-Team": "platform"
      }
    },
    "custom-linters": {
      "command": "docker",
      "args": [
        "run", "--rm", "-i",
        "-v", "${workspaceFolder}:/workspace:ro",
        "company/mcp-linters:latest"
      ]
    }
  }
}
```

## Troubleshooting

### Server Won't Connect

**Symptoms:**
- Server doesn't appear in Available Tools
- Error in MCP logs about connection failure

**Check:**
- Command/executable exists and is in PATH
- Required dependencies installed (Node.js, Python, etc.)
- Environment variables set correctly
- Network connectivity (for remote servers)
- Firewall not blocking connections

**Solutions:**
```bash
# Verify command exists
which npx
which python

# Test manually
npx -y @modelcontextprotocol/server-filesystem /path

# Check environment variables
echo $GITHUB_TOKEN

# Test network
curl https://api.example.com/mcp
```

### Tools Not Appearing

**Symptoms:**
- Server connects but no tools available
- "No tools found" message

**Check:**
- Server is enabled in settings
- No errors in MCP logs
- Server implements tool discovery correctly
- Correct server version

**Solutions:**
- Restart Cursor
- Disable and re-enable server in settings
- Update server to latest version
- Check server documentation for required setup

### Authentication Failures

**Symptoms:**
- "Authentication failed" in logs
- 401/403 errors for remote servers
- OAuth flow doesn't complete

**Check:**
- API keys are valid and not expired
- OAuth credentials correct
- Scopes match requirements
- Network access to auth endpoints
- Redirect URL configured correctly

**Solutions:**
```bash
# Verify API key
echo $API_KEY

# Test authentication manually
curl https://api.example.com/test \
  -H "Authorization: Bearer $API_KEY"

# Re-authenticate OAuth
# (Remove server, re-add, complete OAuth flow)
```

### Performance Issues

**Symptoms:**
- Slow tool execution
- Cursor freezes when using tools
- High CPU/memory usage

**Check:**
- Server resource usage
- Network latency (for remote servers)
- Large data transfers
- Inefficient tool implementations

**Solutions:**
- Use remote servers for heavy operations
- Implement caching in servers
- Limit data returned from tools
- Use pagination for large result sets
- Monitor server logs for bottlenecks

### Environment Variable Issues

**Symptoms:**
- "Environment variable not found" errors
- Tools fail with missing configuration

**Check:**
```bash
# List all environment variables
env

# Check specific variable
echo $VARIABLE_NAME

# Check Cursor can see variable
# (restart Cursor if variable added to shell profile)
```

**Solutions:**
```bash
# Add to shell profile
echo 'export API_KEY="value"' >> ~/.bashrc
source ~/.bashrc

# For project-specific variables
echo 'API_KEY="value"' > .env

# Reference in mcp.json
"envFile": "${workspaceFolder}/.env"
```

## Next Steps

After setting up MCP in Cursor:

1. **Explore available servers:** Browse [MCP Server Ecosystem](https://github.com/modelcontextprotocol/servers)
2. **Build custom servers:** Read [Building MCP Servers](../../03-creating-servers/overview.md)
3. **Learn advanced patterns:** See [Advanced MCP Usage](../../05-advanced/optimization.md)
4. **Share with team:** Commit `.cursor/mcp.json` to version control
5. **Monitor usage:** Review MCP logs regularly for issues

## Related Resources

**In this documentation:**
- [MCP Introduction](../../01-fundamentals/overview.md) - Core concepts
- [Creating MCP Servers](../../03-creating-servers/overview.md) - Build your own
- [Security Guidelines](/docs/en/guidelines/team-conventions/third-party-security-guidelines.md) - Security best practices

**External resources:**
- [Cursor MCP Documentation](https://cursor.com/docs/context/mcp) - Official docs
- [MCP Specification](https://spec.modelcontextprotocol.io/) - Protocol details
- [MCP Server Examples](https://github.com/modelcontextprotocol/servers) - Reference implementations

---

**Last Updated:** February 2026
**Estimated Reading Time:** 25 minutes
**Difficulty:** Beginner to Intermediate
