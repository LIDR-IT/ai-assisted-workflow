# MCP Setup in Antigravity

## Introduction

The Model Context Protocol (MCP) enables Google Antigravity to connect with external tools, services, and data sources through a standardized interface. With MCP, Antigravity agents can access databases, APIs, cloud services, and custom tools to perform complex development tasks autonomously.

This guide covers everything you need to know about configuring and using MCP in Antigravity, including the critical limitation that sets it apart from other platforms.

## What is MCP in Antigravity?

Antigravity is an Agentic development platform that changes how software is built by letting developers work at a higher task-focused level. With Gemini 3, Antigravity allows AI agents to plan, code, and validate complete software tasks autonomously.

MCP integration enables Antigravity agents to:

- **Execute tools**: Run functions in external systems (database operations, API calls, file management)
- **Access Google Cloud services**: Connect to AlloyDB, BigQuery, Spanner, Cloud SQL, Looker, Firebase
- **Query external APIs**: Integrate with third-party services and tools
- **Extend capabilities**: Add custom tools for project-specific workflows
- **Automate workflows**: Chain multiple operations across different services

### How It Works

1. You configure MCP servers in `mcp_config.json` (global configuration only)
2. Antigravity connects to these servers when starting agent sessions
3. Servers expose tools and resources to the AI agent
4. The agent can discover and use these capabilities during task execution
5. Tools execute automatically based on agent decisions

## Critical Limitation: Global Configuration Only

**IMPORTANT:** Unlike Cursor, Claude Code, and Gemini CLI, Antigravity **DOES NOT support project-level MCP configurations**.

### What This Means

**Supported:**
- Global user-level configuration: `~/.gemini/antigravity/mcp_config.json`
- Servers configured globally are available in all Antigravity sessions
- MCP Store for easy installation and management

**NOT Supported:**
- Project-level configuration files
- `.gemini/mcp_config.json` in project directories (ignored)
- Team-shared MCP configurations via git
- Automatic per-project server loading

### Implications for Teams

Since project-level configuration isn't supported:

1. **Each developer must configure MCP servers manually** on their machine
2. **Documentation is critical** - document required servers in README
3. **Reference configurations** can be committed to git as templates
4. **Onboarding scripts** can help automate setup for new team members
5. **Consistency challenges** - no guarantee all team members have same servers

See [Platform Configuration Comparison](../../01-fundamentals/overview.md#configuration-locations) for how this compares to other platforms.

## Configuration File Location

### macOS/Linux

```
~/.gemini/antigravity/mcp_config.json
```

**Full path example:**
```
/Users/username/.gemini/antigravity/mcp_config.json
```

### Windows

```
C:\Users\<USERNAME>\.gemini\antigravity\mcp_config.json
```

**Full path example:**
```
C:\Users\JohnDoe\.gemini\antigravity\mcp_config.json
```

### Creating the Directory

If the directory doesn't exist, create it:

```bash
# macOS/Linux
mkdir -p ~/.gemini/antigravity

# Windows (PowerShell)
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.gemini\antigravity"
```

## Installation Methods

Antigravity provides three ways to configure MCP servers:

### Method 1: MCP Store (Recommended)

The MCP Store is the easiest way to discover and install verified MCP servers.

**Steps:**

1. Open Antigravity and start an Agent session
2. Click the "..." dropdown menu at the top of the editor's side panel
3. Select **MCP Servers** to open the MCP Store
4. Search for a service (e.g., "BigQuery", "Context7", "Supabase")
5. Click **Install** on the server you want
6. Follow the setup process (provide credentials if needed)
7. Server appears in available tools automatically

**Advantages:**
- Verified, official servers
- Easy discovery
- Automatic configuration
- Visual interface
- No manual JSON editing required

**Best for:**
- First-time MCP users
- Google Cloud service integrations
- Popular third-party services
- Quick prototyping

### Method 2: UI Configuration

Edit the configuration directly through Antigravity's UI.

**Steps:**

1. Open Antigravity
2. Start an Agent session
3. Click "..." (dropdown menu) at the top of the side panel
4. Select **MCP Servers**
5. Click **Manage MCP Servers** at the top
6. Click **View raw config** in the main tab
7. Edit the JSON configuration directly
8. Save changes

**Advantages:**
- Visual feedback
- JSON validation
- Immediate error checking
- No need to locate config file manually

**Best for:**
- Modifying existing configurations
- Adding custom servers
- Quick configuration changes
- Users unfamiliar with file system locations

### Method 3: Manual File Editing

Directly edit `~/.gemini/antigravity/mcp_config.json` with a text editor.

**Steps:**

```bash
# macOS/Linux - open in editor
code ~/.gemini/antigravity/mcp_config.json

# Or with vim
vim ~/.gemini/antigravity/mcp_config.json

# Or with nano
nano ~/.gemini/antigravity/mcp_config.json
```

```powershell
# Windows (PowerShell) - open in editor
notepad "$env:USERPROFILE\.gemini\antigravity\mcp_config.json"
```

**Advantages:**
- Full control over configuration
- Can use version control for personal backup
- Batch editing multiple servers
- Scriptable for automation

**Best for:**
- Advanced users
- Bulk configuration changes
- Automated setup scripts
- Power users comfortable with JSON

## Configuration Format

### Basic Structure

```json
{
  "mcpServers": {
    "server-name": {
      "command": "executable",
      "args": ["arg1", "arg2"],
      "env": {
        "API_KEY": "your-key-or-reference"
      }
    }
  }
}
```

**Key components:**

- `mcpServers`: Top-level object containing all server configurations
- `server-name`: Unique identifier for each server (choose descriptive names)
- `command`: Executable to run (e.g., `npx`, `node`, `python`)
- `args`: Array of command-line arguments
- `env`: Environment variables object (optional)

### Configuration Fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `command` | Yes | string | Executable path or command to run |
| `args` | No | string[] | Command-line arguments array |
| `env` | No | object | Environment variables for the server |

**Note:** Unlike Cursor and Claude, Antigravity does not support `envFile` for loading environment variables from files. Use direct environment variable references instead.

## Quick Start Examples

### Example 1: Context7 Documentation Server

**Purpose:** Access up-to-date library documentation and code examples

**Configuration:**

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "${env:CONTEXT7_API_KEY}"
      }
    }
  }
}
```

**Setup:**

1. Get free API key from [context7.com/dashboard](https://context7.com/dashboard)
2. Add to shell profile:

```bash
# Add to ~/.zshrc or ~/.bashrc
export CONTEXT7_API_KEY="your-api-key-here"

# Reload shell
source ~/.zshrc  # or ~/.bashrc
```

3. Add configuration (shown above)
4. Restart Antigravity

**Usage:**

```
@context7 How do I use React hooks?
@context7 What's new in Next.js 15?
```

### Example 2: Supabase Integration

**Purpose:** Interact with Supabase projects and databases

**Configuration:**

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

**Setup:**

1. Get Supabase access token from your project settings
2. Add to environment:

```bash
export SUPABASE_ACCESS_TOKEN="your-token"
source ~/.zshrc
```

3. Add configuration
4. Restart Antigravity

### Example 3: Google BigQuery

**Purpose:** Query BigQuery datasets

**Installation via MCP Store:**

1. Open MCP Store in Antigravity
2. Search "BigQuery"
3. Click **Install**
4. Follow authentication prompts
5. Grant necessary permissions

**Manual configuration:**

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

### Example 4: Filesystem Access

**Purpose:** Read and write files in a specific directory

**Configuration:**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/projects"
      ],
      "env": {}
    }
  }
}
```

**Security note:** The filesystem server has access to all files in the specified directory and subdirectories. Only grant access to trusted directories.

### Example 5: Multiple Servers

**Configuration:**

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "${env:CONTEXT7_API_KEY}"
      }
    },
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "${env:SUPABASE_ACCESS_TOKEN}"
      ],
      "env": {}
    },
    "bigquery": {
      "command": "npx",
      "args": ["-y", "@google-cloud/mcp-server-bigquery"],
      "env": {}
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/username/projects"],
      "env": {}
    }
  }
}
```

## Transport Methods

Antigravity supports different ways to connect with MCP servers:

### STDIO Transport (Default)

**Local execution with standard input/output communication**

```json
{
  "mcpServers": {
    "local-server": {
      "command": "npx",
      "args": ["-y", "mcp-server-package"],
      "env": {}
    }
  }
}
```

**Characteristics:**
- Server runs as subprocess
- Communication via stdin/stdout
- Local execution only
- Simple setup
- Good for development

**Best for:**
- NPM packages
- Python scripts
- Local tools
- Single-user scenarios

### HTTP/SSE Transport

**Remote servers with HTTP or Server-Sent Events**

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

**Note:** Antigravity uses `serverUrl` in some contexts instead of `url` (platform-specific difference from Cursor/Claude).

**Characteristics:**
- Server runs independently
- Network-based communication
- Can be remote or local
- Supports multiple clients
- More complex setup

**Best for:**
- Shared team tools
- Cloud services
- Figma Dev Mode
- Production deployments

### Docker Container Servers

**Isolated execution in containers**

```json
{
  "mcpServers": {
    "docker-tools": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "mcp-server-image:latest"
      ],
      "env": {}
    }
  }
}
```

**Best for:**
- Complex dependencies
- Isolated environments
- Reproducible setups
- Security-sensitive operations

## Environment Variables

### Using Environment Variables

Antigravity supports environment variable interpolation for security:

```json
{
  "mcpServers": {
    "secure-server": {
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

### Setting Environment Variables

**macOS/Linux:**

Add to `~/.zshrc` or `~/.bashrc`:

```bash
# API Keys
export CONTEXT7_API_KEY="your-context7-key"
export SUPABASE_ACCESS_TOKEN="your-supabase-token"
export GITHUB_TOKEN="your-github-token"

# Configuration
export LOG_LEVEL="info"
export DATABASE_URL="postgresql://user:pass@localhost/db"
```

Reload shell:

```bash
source ~/.zshrc  # or ~/.bashrc
```

**Windows:**

PowerShell (persistent):

```powershell
[System.Environment]::SetEnvironmentVariable('CONTEXT7_API_KEY', 'your-key', 'User')
[System.Environment]::SetEnvironmentVariable('SUPABASE_ACCESS_TOKEN', 'your-token', 'User')
```

Or add to PowerShell profile (`$PROFILE`):

```powershell
$env:CONTEXT7_API_KEY = "your-key"
$env:SUPABASE_ACCESS_TOKEN = "your-token"
```

### Verifying Environment Variables

```bash
# Check specific variable
echo $CONTEXT7_API_KEY

# List all environment variables
env | grep -i api

# Windows
echo $env:CONTEXT7_API_KEY
```

## Server Examples by Type

### Node.js Server (NPX)

```json
{
  "mcpServers": {
    "npm-server": {
      "command": "npx",
      "args": ["-y", "@scope/mcp-server-package"],
      "env": {
        "API_KEY": "${env:API_KEY}"
      }
    }
  }
}
```

### Python Server

```json
{
  "mcpServers": {
    "python-server": {
      "command": "python",
      "args": ["-m", "my_mcp_server"],
      "env": {
        "DATABASE_URL": "${env:DATABASE_URL}"
      }
    }
  }
}
```

### Local Binary

```json
{
  "mcpServers": {
    "custom-binary": {
      "command": "/path/to/mcp-server-binary",
      "args": ["--config", "/path/to/config.json"],
      "env": {}
    }
  }
}
```

### Remote HTTP Server

```json
{
  "mcpServers": {
    "remote-api": {
      "command": "npx",
      "args": ["mcp-remote", "https://api.example.com/mcp"],
      "env": {}
    }
  }
}
```

## Google Cloud MCP Servers

Antigravity's MCP Store includes official Google Cloud integrations:

### Available Services

- **AlloyDB for PostgreSQL**: Database operations
- **BigQuery**: Data warehouse queries and analytics
- **Cloud Spanner**: Globally distributed database
- **Cloud SQL**: Managed relational databases (MySQL, PostgreSQL, SQL Server)
- **Looker**: Business intelligence and data visualization
- **Firebase**: Backend services and real-time databases

### Installation from Store

1. Open MCP Store in Antigravity (... → MCP Servers)
2. Search for the Google Cloud service
3. Click **Install**
4. Authenticate with Google Cloud credentials
5. Grant necessary permissions
6. Server appears in available tools

### Example: BigQuery Configuration

**Via MCP Store (Recommended):**
- Automatic authentication
- Simplified setup
- OAuth integration

**Manual configuration:**

```json
{
  "mcpServers": {
    "bigquery": {
      "command": "npx",
      "args": ["-y", "@google-cloud/mcp-server-bigquery"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "${env:GOOGLE_APPLICATION_CREDENTIALS}"
      }
    }
  }
}
```

## Managing MCP Servers

### Viewing Installed Servers

**Via CLI:**

```bash
gemini mcp list
```

**Expected output:**

```
✓ context7: npx -y @upstash/context7-mcp (stdio) - Connected
✓ supabase: npx -y @supabase/mcp-server-supabase@latest (stdio) - Connected
✓ bigquery: npx -y @google-cloud/mcp-server-bigquery (stdio) - Connected
```

**Via UI:**

1. Open Antigravity
2. Start Agent session
3. Click "..." → **MCP Servers**
4. Click **Manage MCP Servers**
5. View list of installed servers with status

### Enabling/Disabling Servers

**Via UI:**

1. Open **Manage MCP Servers**
2. Toggle servers on/off using switches
3. Changes apply immediately

**Via Configuration:**

Remove or comment out server in `mcp_config.json`:

```json
{
  "mcpServers": {
    "active-server": {
      "command": "npx",
      "args": ["-y", "active-package"]
    }
    // "disabled-server": {
    //   "command": "npx",
    //   "args": ["-y", "disabled-package"]
    // }
  }
}
```

### Updating Servers

**NPX-based servers:**

npm caches packages, so updates may require cache clearing:

```bash
# Clear npm cache
npm cache clean --force

# Server will update on next Antigravity restart
```

**Local servers:**

```bash
# Navigate to server directory
cd /path/to/mcp-server

# Update code
git pull origin main

# Restart Antigravity
```

### Removing Servers

**Via UI:**

1. Open **Manage MCP Servers**
2. Find server to remove
3. Click uninstall or remove button
4. Confirm removal

**Via Configuration:**

Delete server entry from `mcp_config.json`:

```json
{
  "mcpServers": {
    "keep-this": { /* ... */ }
    // Removed: "delete-this": { /* ... */ }
  }
}
```

## Performance Considerations

### Tool Limit Recommendation

Antigravity recommends **fewer than 50 total enabled tools** for optimal performance.

**Why it matters:**
- Too many tools slow down agent decision-making
- Increases context size
- Reduces response time
- May cause confusion in tool selection

**Best practices:**
- Only enable servers you actively use
- Disable unused servers
- Group related functionality into fewer servers
- Review enabled tools periodically

### Startup Performance

**How servers load:**
- Servers start on-demand when first accessed
- First use may have slight delay
- Subsequent uses are faster (server already running)
- Servers remain running during session

**Optimization tips:**
- Keep server list lean
- Use lightweight servers when possible
- Consider remote servers for heavy operations
- Monitor server resource usage

## Using MCP in Agent Sessions

### Automatic Tool Discovery

Once configured, MCP servers expose their tools automatically to Antigravity agents.

**How it works:**

1. Start an Agent session in Antigravity
2. Agent connects to all enabled MCP servers
3. Servers report available tools and capabilities
4. Agent uses tools automatically when relevant to task
5. No explicit approval required (unlike Cursor)

### Invoking Tools

**Implicit usage:**

```
User: "Query the users table and show me the schema"
Agent: [uses database MCP tool automatically]
Agent: "The users table has the following columns..."
```

**Explicit usage with mentions:**

```
@bigquery Query the sales data from last quarter
@context7 How do I use React hooks?
@supabase List all tables in my project
```

### Tool Execution

**Characteristics:**
- Tools execute automatically based on agent decisions
- No approval prompts (trust-based model)
- Results are incorporated into agent response
- Errors are handled and reported by agent

**Security note:** Only install trusted MCP servers, as tools execute without approval prompts.

## Team Collaboration Strategies

Since Antigravity doesn't support project-level MCP configs, teams need alternative strategies:

### Strategy 1: Documentation

**Create comprehensive MCP documentation:**

```markdown
# MCP Server Setup for This Project

## Required Servers

### Context7 (Documentation Access)
- Install: MCP Store → Search "Context7" → Install
- Or manual: Add to `~/.gemini/antigravity/mcp_config.json`
- API Key: Get from https://context7.com/dashboard
- Environment: `export CONTEXT7_API_KEY="your-key"`

### Supabase (Database Access)
- Install: MCP Store → Search "Supabase" → Install
- Access Token: Project Settings → Access Tokens
- Environment: `export SUPABASE_ACCESS_TOKEN="your-token"`

### BigQuery (Analytics)
- Install: MCP Store → Search "BigQuery" → Install
- Auth: Follow OAuth prompts
- Permissions: BigQuery Data Viewer
```

### Strategy 2: Reference Configuration

**Commit a reference config as template:**

Create `.gemini/mcp_config.json` in project (for reference only):

```json
{
  "_note": "This file is a REFERENCE only. Antigravity does NOT read project-level configs.",
  "_instructions": "Copy servers to ~/.gemini/antigravity/mcp_config.json",
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "${env:CONTEXT7_API_KEY}"
      }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest", "--access-token", "${env:SUPABASE_ACCESS_TOKEN}"],
      "env": {}
    }
  }
}
```

### Strategy 3: Onboarding Script

**Automate setup for new team members:**

```bash
#!/bin/bash
# scripts/setup-antigravity-mcp.sh

echo "🚀 Setting up MCP servers for Antigravity..."

CONFIG_FILE="$HOME/.gemini/antigravity/mcp_config.json"
REFERENCE_FILE=".gemini/mcp_config.json"

# Check if reference exists
if [ ! -f "$REFERENCE_FILE" ]; then
  echo "❌ Reference config not found: $REFERENCE_FILE"
  exit 1
fi

# Create directory if needed
mkdir -p "$(dirname "$CONFIG_FILE")"

# Check if config already exists
if [ -f "$CONFIG_FILE" ]; then
  echo "⚠️  Config already exists: $CONFIG_FILE"
  echo "📄 Reference config: $REFERENCE_FILE"
  echo "🔄 Manually merge if needed"
  exit 0
fi

# Copy reference to global config
echo "📝 Creating initial configuration..."
cp "$REFERENCE_FILE" "$CONFIG_FILE"

echo "✅ Configuration created at: $CONFIG_FILE"
echo ""
echo "📋 Next steps:"
echo "1. Set required environment variables (see README)"
echo "2. Restart Antigravity"
echo "3. Verify: gemini mcp list"
```

**Usage:**

```bash
chmod +x scripts/setup-antigravity-mcp.sh
./scripts/setup-antigravity-mcp.sh
```

### Strategy 4: Environment Setup Script

**Provide template for environment variables:**

```bash
#!/bin/bash
# scripts/setup-env-template.sh

cat << 'EOF'
# Add these to your ~/.zshrc or ~/.bashrc

# Context7 API Key
# Get from: https://context7.com/dashboard
export CONTEXT7_API_KEY="your-key-here"

# Supabase Access Token
# Get from: Your Supabase project settings
export SUPABASE_ACCESS_TOKEN="your-token-here"

# GitHub Token
# Get from: https://github.com/settings/tokens
export GITHUB_TOKEN="your-token-here"

# After adding, reload shell:
# source ~/.zshrc  # or ~/.bashrc
EOF
```

## Validation and Testing

### Verify Configuration

**Check JSON syntax:**

```bash
# macOS/Linux
jq '.' ~/.gemini/antigravity/mcp_config.json

# If valid, outputs formatted JSON
# If invalid, shows syntax error
```

**Check file exists:**

```bash
# macOS/Linux
ls -la ~/.gemini/antigravity/mcp_config.json

# Windows (PowerShell)
Get-Item "$env:USERPROFILE\.gemini\antigravity\mcp_config.json"
```

### Verify Servers

**List servers:**

```bash
gemini mcp list
```

**Expected output format:**

```
✓ server-name: command args (transport) - Status
```

**Status indicators:**
- `Connected` - Server running and available
- `Error` - Server failed to start (check logs)
- `Disabled` - Server exists but is disabled

### Test Tools

**Start Agent session and test:**

```
User: "List available tools"
Agent: [shows tools from all enabled MCP servers]

User: "Use the context7 tool to search React documentation"
Agent: [executes tool and returns results]
```

### Manual Server Testing

**Test NPX command:**

```bash
# Test if command works
npx -y @upstash/context7-mcp --help

# Test with environment variables
CONTEXT7_API_KEY="test-key" npx -y @upstash/context7-mcp
```

**Test Python server:**

```bash
python -m my_mcp_server --test
```

## Security Best Practices

### Credential Management

**Do:**
- ✅ Use environment variables for all secrets
- ✅ Store credentials in shell profile (`~/.zshrc`, `~/.bashrc`)
- ✅ Use restricted API keys with minimal permissions
- ✅ Rotate keys regularly
- ✅ Document required environment variables

**Don't:**
- ❌ Never hardcode credentials in `mcp_config.json`
- ❌ Never commit secrets to git
- ❌ Never share API keys in documentation
- ❌ Never use admin/root keys when restricted keys suffice
- ❌ Never store credentials in project files

### Server Verification

**Before installing MCP servers:**

- **Verify source:** Only install from trusted developers/organizations
- **Review code:** Check GitHub repository for transparency
- **Read permissions:** Understand what data the server can access
- **Check maintenance:** Prefer actively maintained projects
- **Community trust:** Look for community adoption and reviews

### MCP Store vs Manual

**MCP Store (Safer):**
- Verified servers
- Official Google Cloud integrations
- Automatic updates
- Known security posture

**Manual installation:**
- Review server code before installing
- Verify package authenticity
- Check for known vulnerabilities
- Monitor for updates

### Filesystem Access

**Be cautious with filesystem servers:**

```json
{
  "mcpServers": {
    "limited-filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/safe-directory"  // Specific directory only
      ],
      "env": {}
    }
  }
}
```

**Don't grant access to:**
- Home directory (`~` or `/Users/username`)
- System directories (`/`, `/usr`, `/etc`)
- Sensitive data locations
- Parent directories of sensitive data

## Troubleshooting

### Server Won't Connect

**Symptoms:**
- Server doesn't appear in `gemini mcp list`
- Error messages in Antigravity console
- Tools not available in Agent session

**Solutions:**

1. **Verify configuration syntax:**
   ```bash
   jq '.' ~/.gemini/antigravity/mcp_config.json
   ```

2. **Check command exists:**
   ```bash
   which npx
   which python
   ```

3. **Test command manually:**
   ```bash
   npx -y @upstash/context7-mcp
   ```

4. **Restart Antigravity completely:**
   - Quit application
   - Restart
   - Start new Agent session

5. **Check file permissions:**
   ```bash
   ls -la ~/.gemini/antigravity/mcp_config.json
   # Should be readable: -rw-r--r--
   ```

### Environment Variable Not Found

**Symptoms:**
- "Environment variable not set" errors
- Authentication failures
- Server starts but tools fail

**Solutions:**

1. **Verify variable is set:**
   ```bash
   echo $CONTEXT7_API_KEY
   # Should output your key
   ```

2. **Check shell profile:**
   ```bash
   cat ~/.zshrc | grep CONTEXT7_API_KEY
   # Should show export line
   ```

3. **Reload shell:**
   ```bash
   source ~/.zshrc
   ```

4. **Restart Antigravity:**
   - Antigravity needs restart to pick up new environment variables

### Tools Not Appearing

**Symptoms:**
- Server connected but no tools available
- Agent says "no tools found"

**Solutions:**

1. **Check server is enabled:**
   - Open MCP Store → Manage MCP Servers
   - Verify toggle is on

2. **Review server logs:**
   - Check Antigravity console for errors
   - Look for tool registration failures

3. **Update server:**
   ```bash
   npm cache clean --force
   # Restart Antigravity
   ```

4. **Verify server version:**
   - Some servers require specific versions
   - Check server documentation

### Authentication Failures

**Symptoms:**
- "Authentication failed" errors
- 401/403 HTTP errors
- OAuth flow failures

**Solutions:**

1. **Verify credentials:**
   ```bash
   echo $API_KEY
   # Check value is correct
   ```

2. **Check OAuth configuration:**
   - Ensure OAuth flow completed
   - Verify scopes are correct
   - Re-authenticate if needed

3. **Test credentials manually:**
   ```bash
   curl https://api.service.com/test \
     -H "Authorization: Bearer $API_KEY"
   ```

4. **Rotate keys:**
   - Generate new API key
   - Update environment variable
   - Restart Antigravity

### Performance Issues

**Symptoms:**
- Slow tool execution
- Agent takes long to respond
- High CPU/memory usage

**Solutions:**

1. **Reduce enabled servers:**
   - Disable unused servers
   - Keep total tools under 50

2. **Monitor resource usage:**
   ```bash
   # macOS
   ps aux | grep npx

   # Check Antigravity memory usage
   top -o MEM | grep -i antigravity
   ```

3. **Use remote servers for heavy operations:**
   - Offload compute-intensive tasks
   - Use cloud services when possible

4. **Check network latency:**
   - Test remote server response times
   - Consider geographic proximity

### JSON Syntax Errors

**Symptoms:**
- "Invalid JSON" errors
- Configuration not loading
- Server list empty

**Solutions:**

1. **Validate JSON:**
   ```bash
   jq '.' ~/.gemini/antigravity/mcp_config.json
   ```

2. **Common mistakes:**
   - Missing commas between objects
   - Trailing commas after last item
   - Unquoted keys
   - Unclosed brackets/braces

3. **Use JSON formatter:**
   - Copy config to [jsonlint.com](https://jsonlint.com)
   - Fix reported errors

4. **Start from template:**
   ```json
   {
     "mcpServers": {}
   }
   ```

## Complete Configuration Examples

### Example: Full-Stack Development

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "${env:CONTEXT7_API_KEY}"
      }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest", "--access-token", "${env:SUPABASE_ACCESS_TOKEN}"],
      "env": {}
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${env:GITHUB_TOKEN}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/username/projects"],
      "env": {}
    }
  }
}
```

### Example: Data Science Workflow

```json
{
  "mcpServers": {
    "bigquery": {
      "command": "npx",
      "args": ["-y", "@google-cloud/mcp-server-bigquery"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "${env:GOOGLE_APPLICATION_CREDENTIALS}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_URL": "${env:DATABASE_URL}"
      }
    },
    "python-analysis": {
      "command": "python",
      "args": ["-m", "data_analysis_mcp"],
      "env": {
        "DATA_PATH": "/Users/username/data",
        "AWS_ACCESS_KEY_ID": "${env:AWS_ACCESS_KEY_ID}",
        "AWS_SECRET_ACCESS_KEY": "${env:AWS_SECRET_ACCESS_KEY}"
      }
    }
  }
}
```

### Example: Google Cloud Integration

```json
{
  "mcpServers": {
    "alloydb": {
      "command": "npx",
      "args": ["-y", "@google-cloud/mcp-server-alloydb"],
      "env": {}
    },
    "bigquery": {
      "command": "npx",
      "args": ["-y", "@google-cloud/mcp-server-bigquery"],
      "env": {}
    },
    "cloud-sql": {
      "command": "npx",
      "args": ["-y", "@google-cloud/mcp-server-cloudsql"],
      "env": {}
    },
    "spanner": {
      "command": "npx",
      "args": ["-y", "@google-cloud/mcp-server-spanner"],
      "env": {}
    }
  }
}
```

## Migration from Other Platforms

### From Cursor

**Cursor configuration** (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "server": {
      "command": "npx",
      "args": ["-y", "package"]
    }
  }
}
```

**Antigravity equivalent:**

Same format! Copy to `~/.gemini/antigravity/mcp_config.json`

**Key differences:**
- Antigravity: Global only (`~/.gemini/antigravity/`)
- Cursor: Project and global (`.cursor/` and `~/.cursor/`)

### From Claude Code

**Claude configuration** (`.claude/mcp.json`):

```json
{
  "mcpServers": {
    "server": {
      "command": "npx",
      "args": ["-y", "package"]
    }
  }
}
```

**Antigravity equivalent:**

Same format! Copy to `~/.gemini/antigravity/mcp_config.json`

**Key differences:**
- Configuration format is identical
- Location differs (global only for Antigravity)

### From Gemini CLI

**Gemini CLI** (`~/.gemini/settings.json`):

```json
{
  "mcpServers": {
    "server": {
      "command": "npx",
      "args": ["-y", "package"]
    }
  }
}
```

**Antigravity:**

Copy entire `mcpServers` object to `~/.gemini/antigravity/mcp_config.json`

**Note:** Antigravity has separate config from Gemini CLI (different file locations).

## Next Steps

After setting up MCP in Antigravity:

1. **Explore MCP Store:** Discover verified servers for Google Cloud services
2. **Build custom servers:** Create project-specific tools ([Building MCP Servers](../../03-creating-servers/overview.md))
3. **Document for team:** Create setup guides for your team members
4. **Monitor usage:** Review server performance and tool execution
5. **Share configurations:** Commit reference configs to version control

## Related Resources

**In this documentation:**
- [MCP Introduction](../../01-fundamentals/overview.md) - Core concepts
- [Creating MCP Servers](../../03-creating-servers/overview.md) - Build your own
- [Security Guidelines](/docs/en/guidelines/team-conventions/third-party-security-guidelines.md) - Security best practices
- [MCP Configuration Comparison](../../01-fundamentals/overview.md#configuration-locations) - Platform differences

**Official documentation:**
- [Antigravity MCP Documentation](https://antigravity.google/docs/mcp)
- [Google Cloud MCP Integration](https://cloud.google.com/blog/products/data-analytics/connect-google-antigravity-ide-to-googles-data-cloud-services)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)

**Community resources:**
- [Composio: MCP with Antigravity](https://composio.dev/blog/howto-mcp-antigravity)
- [Medium: Custom MCP Integration](https://medium.com/google-developer-experts/google-antigravity-custom-mcp-server-integration-to-improve-vibe-coding-f92ddbc1c22d)
- [Lilys.ai: MCP Servers Guide](https://lilys.ai/en/notes/google-antigravity-20260129/mcp-servers-antigravity-ide)

---

**Last Updated:** February 2026
**Estimated Reading Time:** 30 minutes
**Difficulty:** Beginner to Intermediate
**Platform Version:** Antigravity (Google AI Studio)
