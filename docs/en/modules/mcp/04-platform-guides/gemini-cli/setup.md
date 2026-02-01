# MCP Setup Guide for Gemini CLI

Complete guide to configuring and using MCP servers in Gemini CLI.

## Overview

MCP (Model Context Protocol) servers extend Gemini CLI capabilities by exposing tools, resources, and prompts to the AI agent. This integration enables Gemini CLI to interact with APIs, databases, file systems, and custom workflows through a standardized protocol.

**What MCP Enables:**
- **Tools**: Executable functions the AI can call (e.g., file operations, API requests)
- **Resources**: Contextual data the AI can reference (e.g., documents, database records)
- **Prompts**: Reusable templates with argument substitution

**Official Documentation:** [geminicli.com/docs/tools/mcp-server](https://geminicli.com/docs/tools/mcp-server/)

## Core Architecture

Understanding how Gemini CLI integrates with MCP servers helps in configuration and troubleshooting.

### Discovery Layer

When Gemini CLI starts, it performs server discovery:

1. **Connection Establishment**: Iterates through all configured servers in `settings.json`
2. **Tool Fetching**: Requests available tool definitions from each server
3. **Schema Sanitization**: Removes incompatible properties for Gemini API
4. **Tool Filtering**: Applies `includeTools`/`excludeTools` rules if specified
5. **Conflict Resolution**: Auto-prefixes duplicate tool names (e.g., `serverName__toolName`)
6. **Resource Registration**: Makes server resources available via `@` syntax

### Execution Layer

When the AI invokes a tool:

1. **Tool Wrapping**: Each tool wrapped in `DiscoveredMCPTool` instance
2. **Confirmation**: Prompts user unless `trust: true` is set
3. **Execution**: Sends request to appropriate MCP server
4. **Response Processing**: Separates content for LLM context (`llmContent`) and user display (`returnDisplay`)

This two-layer architecture ensures secure, validated communication between Gemini CLI and external services.

## Configuration Structure

### Location

MCP servers are configured in `settings.json`, which can be:

**Project-level:**
```
your-project/.gemini/settings.json
```

**Global-level:**
```
~/.gemini/settings.json
```

**Priority:** Project settings override global settings.

### Basic Structure

The `mcpServers` object contains server configurations:

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

**Key Points:**
- **Server name** (`serverName`): Unique identifier for the server
- **Configuration object**: Defines how to connect and communicate
- **Multiple servers**: Add multiple entries for different services

### Required Properties

**Choose ONE of the following:**

| Property | Type | Description |
|----------|------|-------------|
| `command` | string | Path to executable for stdio transport |
| `url` | string | SSE endpoint URL (Server-Sent Events) |
| `httpUrl` | string | HTTP streaming endpoint URL |

### Optional Properties

| Property | Type | Description |
|----------|------|-------------|
| `args` | string[] | Command-line arguments (stdio only) |
| `headers` | object | Custom HTTP headers (SSE/HTTP only) |
| `env` | object | Environment variables (supports `$VAR_NAME`) |
| `cwd` | string | Working directory for command |
| `timeout` | number | Request timeout in milliseconds (default: 600000) |
| `trust` | boolean | Bypass all confirmations (default: false) |
| `includeTools` | string[] | Allowlist specific tools |
| `excludeTools` | string[] | Blocklist specific tools |

### Environment Variable Syntax

Reference environment variables using `$VAR_NAME` syntax:

```json
{
  "mcpServers": {
    "myServer": {
      "command": "server",
      "env": {
        "API_KEY": "$EXTERNAL_API_KEY",
        "DB_URL": "$DATABASE_CONNECTION_STRING"
      }
    }
  }
}
```

**Security:** Variables matching sensitive patterns (`*TOKEN*`, `*SECRET*`, `*PASSWORD*`) are automatically redacted in logs.

## Transport Mechanisms

Gemini CLI supports three transport types for communicating with MCP servers:

### 1. Stdio Transport

**How it works:**
- Spawns subprocess with specified command
- Communicates via stdin/stdout
- Best for local executables

**Configuration:**
```json
{
  "mcpServers": {
    "localServer": {
      "command": "python",
      "args": ["-m", "my_mcp_server"],
      "cwd": "/path/to/project"
    }
  }
}
```

**Use cases:**
- Local Python/Node.js servers
- Binary executables
- Docker containers

### 2. SSE Transport (Server-Sent Events)

**How it works:**
- Connects to SSE endpoint
- Server pushes events to client
- Supports long-lived connections

**Configuration:**
```json
{
  "mcpServers": {
    "sseServer": {
      "url": "http://localhost:8080/sse",
      "headers": {
        "Authorization": "Bearer token"
      }
    }
  }
}
```

**Use cases:**
- Remote HTTP services
- Cloud-hosted servers
- Services requiring authentication

### 3. HTTP Streaming Transport

**How it works:**
- Uses streamable HTTP endpoints
- Request/response over HTTP
- Simpler than SSE for some use cases

**Configuration:**
```json
{
  "mcpServers": {
    "httpServer": {
      "httpUrl": "https://api.example.com/mcp",
      "headers": {
        "X-API-Key": "your-key"
      }
    }
  }
}
```

**Use cases:**
- RESTful services
- API gateways
- Services with HTTP-based authentication

## Basic Configuration Examples

### Python MCP Server (Stdio)

**Scenario:** Local Python MCP server installed via pip

```json
{
  "mcpServers": {
    "pythonTools": {
      "command": "python",
      "args": ["-m", "my_mcp_server"],
      "env": {
        "DATABASE_URL": "$DB_CONNECTION_STRING"
      },
      "timeout": 15000
    }
  }
}
```

**Setup:**
```bash
# Install server
pip install my-mcp-server

# Set environment variable
export DB_CONNECTION_STRING="postgresql://localhost/mydb"

# Start Gemini CLI
gemini
```

### Node.js MCP Server (Stdio)

**Scenario:** NPM package MCP server

```json
{
  "mcpServers": {
    "nodeTools": {
      "command": "npx",
      "args": ["-y", "@organization/mcp-server"],
      "env": {
        "API_KEY": "$SERVICE_API_KEY"
      }
    }
  }
}
```

**Setup:**
```bash
# Set environment variable
export SERVICE_API_KEY="your-api-key"

# Start Gemini CLI (npx will auto-install)
gemini
```

### Docker-Based Server

**Scenario:** MCP server running in Docker container

```json
{
  "mcpServers": {
    "dockerServer": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "--network", "host",
        "my-server:latest"
      ],
      "env": {
        "API_KEY": "$EXTERNAL_TOKEN"
      },
      "timeout": 45000
    }
  }
}
```

**Setup:**
```bash
# Build Docker image
docker build -t my-server:latest .

# Set environment variable
export EXTERNAL_TOKEN="your-token"

# Start Gemini CLI
gemini
```

### Remote HTTP Server

**Scenario:** Cloud-hosted MCP server with authentication

```json
{
  "mcpServers": {
    "remoteAPI": {
      "httpUrl": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer your-token",
        "X-Custom-Header": "value"
      },
      "timeout": 20000
    }
  }
}
```

### SSE Server with Dynamic Discovery

**Scenario:** SSE endpoint with OAuth 2.0 authentication

```json
{
  "mcpServers": {
    "sseService": {
      "url": "https://api.example.com/sse",
      "authProviderType": "google_credentials",
      "oauth": {
        "scopes": [
          "https://www.googleapis.com/auth/userinfo.email"
        ]
      }
    }
  }
}
```

## Complete settings.json Examples

### Minimal Configuration

**Single local server:**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/data"]
    }
  }
}
```

### Multi-Server Configuration

**Multiple servers with different transports:**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/documents"],
      "trust": false
    },
    "database": {
      "command": "python",
      "args": ["-m", "postgres_mcp_server"],
      "env": {
        "DB_URL": "$DATABASE_CONNECTION_STRING"
      },
      "timeout": 30000,
      "includeTools": ["query", "insert", "update"]
    },
    "cloudAPI": {
      "httpUrl": "https://api.cloud-service.com/mcp",
      "headers": {
        "Authorization": "Bearer $CLOUD_API_TOKEN"
      },
      "timeout": 20000
    }
  }
}
```

### Advanced Configuration with Filtering

**Tool filtering and trust settings:**

```json
{
  "mcpServers": {
    "trustedServer": {
      "command": "npx",
      "args": ["-y", "@verified/mcp-server"],
      "trust": true,
      "timeout": 10000
    },
    "untrustedServer": {
      "command": "python",
      "args": ["-m", "external_server"],
      "trust": false,
      "includeTools": ["read_only_tool", "safe_operation"],
      "excludeTools": ["dangerous_operation", "delete_tool"]
    },
    "apiServer": {
      "httpUrl": "https://api.example.com/mcp",
      "headers": {
        "X-API-Key": "$API_KEY"
      },
      "includeTools": ["search", "retrieve"],
      "timeout": 15000
    }
  }
}
```

### OAuth Configuration Examples

**Google Credentials:**

```json
{
  "mcpServers": {
    "googleService": {
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

**Service Account Impersonation:**

```json
{
  "mcpServers": {
    "iapProtected": {
      "url": "https://service.run.app/sse",
      "authProviderType": "service_account_impersonation",
      "targetAudience": "YOUR_CLIENT_ID.apps.googleusercontent.com",
      "targetServiceAccount": "service-account@project.iam.gserviceaccount.com"
    }
  }
}
```

## Quick Start Guide

### Step 1: Install MCP Server

Choose an MCP server to install:

**Option A: NPM Package**
```bash
npm install -g @modelcontextprotocol/server-filesystem
```

**Option B: Python Package**
```bash
pip install mcp-server-example
```

**Option C: Clone Repository**
```bash
git clone https://github.com/example/mcp-server.git
cd mcp-server
npm install  # or pip install -r requirements.txt
```

### Step 2: Configure settings.json

Create or edit `.gemini/settings.json`:

**For project-level:**
```bash
mkdir -p .gemini
touch .gemini/settings.json
```

**For global:**
```bash
mkdir -p ~/.gemini
touch ~/.gemini/settings.json
```

**Add configuration:**
```json
{
  "mcpServers": {
    "myServer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/data"]
    }
  }
}
```

### Step 3: Set Environment Variables

If your server requires API keys or credentials:

```bash
export API_KEY="your-api-key-here"
export DB_URL="postgresql://localhost/mydb"
```

**Permanent setup** (add to `~/.bashrc` or `~/.zshrc`):
```bash
echo 'export API_KEY="your-api-key-here"' >> ~/.bashrc
source ~/.bashrc
```

### Step 4: Start Gemini CLI

```bash
gemini
```

**First-time startup:**
- Gemini CLI discovers configured servers
- Fetches available tools
- Displays connection status

### Step 5: Verify MCP Server

Check server status:

```
/mcp
```

**Expected output:**
```
Connected MCP Servers:
- myServer (3 tools available)
  ✓ read_file
  ✓ write_file
  ✓ list_directory
```

### Step 6: Test Tool Execution

Try using a tool from the server:

```
Can you list the files in my documents folder?
```

**First execution:**
- Gemini CLI prompts for confirmation
- Choose: "Once", "Always allow this tool", "Always allow this server", or "Cancel"
- Tool executes and returns results

### Step 7: Configure Trust (Optional)

If you trust the server, enable auto-execution:

Edit `settings.json`:
```json
{
  "mcpServers": {
    "myServer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/data"],
      "trust": true
    }
  }
}
```

**Security Warning:** Only trust servers you've reviewed and verified.

## Discovery Process

Understanding the discovery process helps troubleshoot connection issues.

### Startup Sequence

When Gemini CLI starts with MCP servers configured:

1. **Configuration Loading**
   - Reads `settings.json` (global, then project)
   - Merges configurations with project overriding global
   - Validates required properties

2. **Connection Establishment**
   - Stdio: Spawns subprocess
   - SSE: Opens connection to endpoint
   - HTTP: Prepares HTTP client

3. **Tool Discovery**
   - Sends `tools/list` request to each server
   - Receives tool definitions with schemas
   - Validates schemas against Gemini API requirements

4. **Schema Sanitization**
   - Removes incompatible properties:
     - `$schema`
     - `additionalProperties`
   - Ensures compatibility with Gemini's function calling

5. **Tool Filtering**
   - Applies `includeTools` allowlist (if specified)
   - Applies `excludeTools` blocklist (if specified)
   - Logs filtered tools for debugging

6. **Conflict Resolution**
   - Detects duplicate tool names across servers
   - Auto-prefixes with server name: `serverName__toolName`
   - Logs prefixing for user awareness

7. **Resource Registration**
   - Fetches available resources from servers
   - Makes resources available via `@` syntax
   - Enables resource completion in prompts

8. **Ready State**
   - All servers connected and tools registered
   - User can start conversation
   - Tools available for AI invocation

### Visual Flow

```
settings.json → Load Config
                    ↓
              Connect to Servers
                    ↓
              Fetch Tool Definitions
                    ↓
              Sanitize Schemas
                    ↓
              Apply Filters
                    ↓
              Resolve Conflicts
                    ↓
              Register Resources
                    ↓
              Ready for Use
```

## Tool Execution Flow

Understanding how tools execute helps with debugging and security.

### Execution Steps

1. **AI Decision**
   - AI determines tool is needed
   - Selects appropriate tool and parameters
   - Prepares function call request

2. **Confirmation Prompt** (unless `trust: true`)
   - Displays tool name and parameters
   - Shows server name
   - User options:
     - **Once**: Execute this time only
     - **Always allow this tool**: Skip future confirmations for this tool
     - **Always allow this server**: Trust all tools from this server
     - **Cancel**: Abort execution

3. **Parameter Validation**
   - Validates parameters against tool schema
   - Ensures required parameters present
   - Type-checks parameter values

4. **Server Communication**
   - Sends `tools/call` request to server
   - Includes tool name and parameters
   - Waits for response (respects timeout)

5. **Response Processing**
   - Receives multi-part response from server
   - Separates content types:
     - `llmContent`: Added to conversation context
     - `returnDisplay`: Shown to user
   - Handles rich content (text, images, audio, binary)

6. **Context Integration**
   - Adds result to conversation history
   - AI uses result to continue reasoning
   - User sees formatted output

### Confirmation Bypass

Set `trust: true` to skip confirmations:

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

**Warning:** Only trust servers you've audited. Malicious servers can:
- Exfiltrate sensitive data
- Execute arbitrary commands
- Access filesystem
- Make network requests

## Using MCP Features

### Checking Server Status

View all configured servers and their status:

```
/mcp
```

**Output includes:**
- Server names
- Connection status (connected/disconnected)
- Number of available tools
- Tool names
- Resource count

### Referencing Resources

MCP servers can expose contextual resources:

```
@serverName://resource/path
```

**Example:**
```
Can you summarize @docs://api/authentication?
```

**How it works:**
- Gemini CLI calls `resources/read` on the server
- Server returns resource content
- Content injected into conversation
- AI processes content to answer question

**Resource Completion:**
- Type `@` to see available resources
- Autocomplete suggests server resources
- Tab completion works like file paths

### Using MCP Prompts

Servers can expose reusable prompt templates:

```
/prompt-name --arg1="value1" --arg2="value2"
```

**Example:**
```
/poem-writer --title="Gemini CLI" --mood="reverent"
```

**How it works:**
- Server receives prompt request with arguments
- Substitutes arguments into template
- Returns completed prompt text
- Gemini CLI executes prompt with AI

## Managing Servers via CLI

Gemini CLI provides commands to manage MCP servers without editing JSON.

### Add a Server

**Basic syntax:**
```bash
gemini mcp add [options] <name> <command> [args...]
```

**Examples:**

Add stdio server:
```bash
gemini mcp add myServer python -m mcp_server
```

Add SSE server:
```bash
gemini mcp add --transport sse remoteServer https://api.example.com/sse
```

Add with environment variables:
```bash
gemini mcp add -e API_KEY=123 -e DB_URL=postgres://localhost authServer python server.py
```

Add with timeout:
```bash
gemini mcp add --timeout 20000 slowServer python slow_server.py
```

### List Servers

View all configured servers:

```bash
gemini mcp list
```

**Output:**
```
MCP Servers:
- myServer (stdio) - python -m mcp_server
- remoteServer (sse) - https://api.example.com/sse
- authServer (stdio) - python server.py
```

### Remove a Server

Remove server from configuration:

```bash
gemini mcp remove <name>
```

**Example:**
```bash
gemini mcp remove oldServer
```

### Enable/Disable Servers

Temporarily disable without removing:

```bash
gemini mcp disable <name>
gemini mcp enable <name>
```

**Example:**
```bash
# Disable for testing
gemini mcp disable experimentalServer

# Re-enable later
gemini mcp enable experimentalServer
```

## Security Considerations

### Trust Settings

**The `trust` property is powerful and dangerous:**

```json
{
  "mcpServers": {
    "dangerousExample": {
      "command": "untrusted-server",
      "trust": true  // ⚠️ DANGEROUS
    }
  }
}
```

**Why it's dangerous:**
- Bypasses ALL confirmations
- Server can execute without user knowledge
- Malicious servers can exfiltrate data
- No opportunity to review tool calls

**When to use `trust: true`:**
- ✅ Servers you've personally audited
- ✅ Official servers from trusted organizations
- ✅ Open-source servers you've reviewed
- ✅ Internal company servers with security review

**When NOT to use:**
- ❌ Third-party servers you haven't reviewed
- ❌ Closed-source commercial servers
- ❌ Servers with filesystem/network access
- ❌ Any server handling sensitive data

### Environment Variables

**Automatic redaction** protects sensitive variables:

Gemini CLI redacts variables matching patterns:
- `*TOKEN*`
- `*SECRET*`
- `*PASSWORD*`
- `*KEY*` (in some contexts)

**Best practices:**

```json
{
  "mcpServers": {
    "secure": {
      "command": "server",
      "env": {
        "API_TOKEN": "$MY_API_TOKEN",        // ✅ Redacted in logs
        "DB_PASSWORD": "$DB_PASS",           // ✅ Redacted in logs
        "SERVICE_URL": "https://api.com"     // ✅ Not sensitive, no redaction needed
      }
    }
  }
}
```

**Never hardcode secrets:**

```json
{
  "mcpServers": {
    "insecure": {
      "command": "server",
      "env": {
        "API_TOKEN": "sk-abc123xyz"  // ❌ NEVER DO THIS
      }
    }
  }
}
```

### Server Isolation

**Use Docker for untrusted servers:**

```json
{
  "mcpServers": {
    "isolated": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "--network", "none",        // No network access
        "--read-only",              // Read-only filesystem
        "--security-opt", "no-new-privileges",
        "untrusted-server:latest"
      ]
    }
  }
}
```

**Benefits:**
- Filesystem isolation
- Network isolation (if desired)
- Resource limits
- Easy cleanup

### Security Checklist

Before configuring an MCP server:

- [ ] Review server source code (if available)
- [ ] Check server permissions and capabilities
- [ ] Understand what data the server accesses
- [ ] Use scoped API keys (not root credentials)
- [ ] Test with `trust: false` first
- [ ] Monitor server behavior during use
- [ ] Use environment variables for secrets
- [ ] Consider Docker isolation for unknown servers
- [ ] Document server purpose and security considerations
- [ ] Review server logs for suspicious activity

## Troubleshooting

### Common Issues

#### Server Won't Connect

**Symptoms:**
- "Failed to connect to server" error
- Server not listed in `/mcp` output

**Solutions:**

1. **Verify command path:**
   ```bash
   which python  # or node, npx, etc.
   ```

2. **Test command manually:**
   ```bash
   python -m my_mcp_server
   ```

3. **Check permissions:**
   ```bash
   chmod +x /path/to/server
   ```

4. **Review settings.json syntax:**
   ```bash
   cat .gemini/settings.json | jq .  # Validate JSON
   ```

5. **Check working directory:**
   ```json
   {
     "mcpServers": {
       "server": {
         "command": "python",
         "args": ["-m", "server"],
         "cwd": "/correct/path"  // Add explicit cwd
       }
     }
   }
   ```

#### No Tools Discovered

**Symptoms:**
- Server connects but shows 0 tools
- `/mcp` shows server but no tool list

**Solutions:**

1. **Verify server implements MCP protocol:**
   - Check server logs for `tools/list` handling
   - Ensure server returns valid tool definitions

2. **Check tool filtering:**
   ```json
   {
     "mcpServers": {
       "server": {
         "command": "server",
         // Remove or adjust filters
         "includeTools": ["tool1", "tool2"],
         "excludeTools": []
       }
     }
   }
   ```

3. **Test server independently:**
   ```bash
   # Run server and send test request
   echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | python -m server
   ```

#### Tools Fail to Execute

**Symptoms:**
- Tool calls return errors
- Timeout errors
- Parameter validation failures

**Solutions:**

1. **Check parameter schemas:**
   - Ensure parameters match tool schema
   - Verify required parameters provided
   - Check data types

2. **Increase timeout:**
   ```json
   {
     "mcpServers": {
       "slowServer": {
         "command": "server",
         "timeout": 60000  // Increase from default
       }
     }
   }
   ```

3. **Review tool implementation:**
   - Check server logs for errors
   - Verify tool handles edge cases
   - Ensure proper error responses

#### Environment Variables Not Working

**Symptoms:**
- Server can't access API keys
- "Missing credential" errors

**Solutions:**

1. **Verify variable is set:**
   ```bash
   echo $MY_API_KEY
   ```

2. **Check settings.json syntax:**
   ```json
   {
     "mcpServers": {
       "server": {
         "command": "server",
         "env": {
           "API_KEY": "$MY_API_KEY"  // Must start with $
         }
       }
     }
   }
   ```

3. **Export variable before starting Gemini:**
   ```bash
   export MY_API_KEY="value"
   gemini
   ```

4. **Check variable scope:**
   ```bash
   # Add to shell profile for persistence
   echo 'export MY_API_KEY="value"' >> ~/.bashrc
   source ~/.bashrc
   ```

### Debugging Strategies

#### Enable Debug Mode

Get detailed connection and execution logs:

```bash
gemini --debug
```

**Debug output includes:**
- Server connection attempts
- Tool discovery process
- Schema sanitization details
- Tool execution traces
- Server stderr messages

#### Check Server Logs

Many servers output logs to stderr:

**Capture stderr:**
```bash
gemini 2>&1 | tee gemini-debug.log
```

**Look for:**
- Connection errors
- Schema validation issues
- Tool execution failures
- Authentication problems

#### Test Server Independently

Before integrating with Gemini CLI:

```bash
# Test server starts
python -m my_mcp_server

# Send test request
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | python -m my_mcp_server

# Check response format
```

#### Verify JSON Syntax

Validate `settings.json`:

```bash
# Check for syntax errors
cat .gemini/settings.json | jq .

# Pretty-print for readability
cat .gemini/settings.json | jq . > settings-pretty.json
```

#### Check File Permissions

Ensure Gemini CLI can read configuration:

```bash
# Check permissions
ls -la .gemini/settings.json

# Fix if needed
chmod 644 .gemini/settings.json
```

## Best Practices

### Configuration Management

**Project vs. Global:**

```
Use project-level for:
- Team-shared tools
- Project-specific APIs
- Development servers

Use global for:
- Personal utilities
- Universal tools (filesystem, git)
- Cross-project services
```

**Document required variables:**

Add comments to settings.json (in commit message or README):

```markdown
## Required Environment Variables

- `CONTEXT7_API_KEY`: Context7 API key from https://context7.com/dashboard
- `DB_URL`: PostgreSQL connection string
- `SLACK_TOKEN`: Slack bot token with `chat:write` scope
```

**Version control:**

```bash
# Commit settings.json
git add .gemini/settings.json
git commit -m "Add MCP server configuration"

# Never commit with hardcoded secrets
# Use .env files (gitignored) for local secrets
```

### Performance Optimization

**Set appropriate timeouts:**

```json
{
  "mcpServers": {
    "fastServer": {
      "command": "fast-server",
      "timeout": 5000  // 5 seconds for quick operations
    },
    "slowServer": {
      "command": "slow-server",
      "timeout": 60000  // 60 seconds for database queries
    }
  }
}
```

**Filter unnecessary tools:**

```json
{
  "mcpServers": {
    "largeServer": {
      "command": "server-with-100-tools",
      "includeTools": ["tool1", "tool2", "tool3"]  // Only load needed tools
    }
  }
}
```

**Cache expensive operations:**

Design servers to cache results when possible:
- Database query results
- API responses
- File system operations

### Server Development Guidelines

When creating your own MCP servers:

**Error handling:**
```python
# Good: Clear error messages
if not api_key:
    raise ValueError("API_KEY environment variable required")

# Bad: Generic errors
raise Exception("Error")
```

**Graceful shutdown:**
```python
# Handle SIGTERM and SIGINT
import signal
import sys

def handle_shutdown(signum, frame):
    cleanup()
    sys.exit(0)

signal.signal(signal.SIGTERM, handle_shutdown)
signal.signal(signal.SIGINT, handle_shutdown)
```

**Logging:**
```python
# Use stderr for logs (stdout for MCP protocol)
import sys

def log(message):
    print(f"[Server] {message}", file=sys.stderr)
```

**Security:**
```python
# Validate all inputs
def safe_read_file(path):
    # Prevent directory traversal
    clean_path = os.path.normpath(path)
    if not clean_path.startswith(ALLOWED_DIR):
        raise PermissionError("Access denied")
    return read_file(clean_path)
```

## Related Documentation

**In This Repository:**
- [MCP Introduction](../../01-fundamentals/introduction.md) - Protocol overview
- [MCP Server Builder](../../03-creating-servers/building.md) - Create custom servers
- [Security Guidelines](../../../../guidelines/team-conventions/third-party-security-guidelines.md) - Third-party security

**External Resources:**
- [Gemini CLI Official Docs](https://geminicli.com/docs/tools/mcp-server/)
- [Model Context Protocol Spec](https://spec.modelcontextprotocol.io/)
- [MCP GitHub Repository](https://github.com/modelcontextprotocol)

**Platform Comparisons:**
- [Cursor MCP Setup](../cursor/setup.md)
- [Claude Code MCP Setup](../claude-code/setup.md)
- [Antigravity MCP Setup](../antigravity/setup.md)

---

**Last Updated:** January 2026
**Category:** Platform Guide
**Platform:** Gemini CLI
**Difficulty:** Intermediate
