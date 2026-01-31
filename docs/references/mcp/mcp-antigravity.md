# Model Context Protocol (MCP) in Google Antigravity

## Overview

Google Antigravity is an Agentic development platform that changes how software is built by letting developers work at a higher task-focused level. With Gemini 3, Antigravity allows AI Agents to plan, code, and validate complete software tasks autonomously.

**Official Documentation:** [antigravity.google/docs/mcp](https://antigravity.google/docs/mcp)

**Platform Announcement:** Late 2025

---

## What is Antigravity?

Antigravity enables AI agents to:
- **Plan**: Break down complex tasks
- **Code**: Generate complete implementations
- **Validate**: Test and verify solutions

With MCP integration, agents can securely connect to:
- Google Cloud services (AlloyDB, BigQuery, Spanner, Cloud SQL, Looker)
- External tools and APIs
- Custom development workflows

---

## Configuration File Locations

### User-Level (Global)
```
~/.gemini/antigravity/mcp_config.json
```

All Antigravity sessions use these servers.

### Project-Level
```
<project-root>/.gemini/mcp_config.json
```

Specific to the current project (recommended for team collaboration).

### Alternative: settings.json

MCP servers can also be configured in:
```
~/.gemini/settings.json
```

Under the `mcpServers` key.

---

## Installation Methods

### 1. MCP Store (Recommended)

**Access:**
1. Click on Agent session
2. Select "…" dropdown at top of editor's side panel
3. Select **MCP Servers** to open MCP Store

**Install:**
1. Search for service (e.g., "BigQuery", "AlloyDB")
2. Click **Install**
3. Follow setup process

### 2. Manual Configuration

**Edit config file:**
1. Open MCP Store
2. Select **Manage MCP Servers** at top
3. Click **View raw config** in main tab
4. Modify `mcp_config.json`

### 3. Extensions

Install extensions that bundle MCP servers automatically.

---

## Configuration Format

### Basic Structure

```json
{
  "mcpServers": {
    "server-name": {
      "command": "executable",
      "args": ["arg1", "arg2"],
      "env": {
        "API_KEY": "your-key"
      }
    }
  }
}
```

### Node.js Server Example

```json
{
  "mcpServers": {
    "custom-server": {
      "command": "node",
      "args": ["path/to/server/index.js"],
      "env": {
        "API_KEY": "${env:MY_API_KEY}"
      }
    }
  }
}
```

### NPX Server Example

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "your-token"
      ],
      "env": {}
    }
  }
}
```

### Python Server Example

```json
{
  "mcpServers": {
    "python-tools": {
      "command": "python",
      "args": ["-m", "my_mcp_server"],
      "env": {
        "DATABASE_URL": "postgresql://..."
      }
    }
  }
}
```

### HTTP/SSE Server Example

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

### Local Binary Example

```json
{
  "mcpServers": {
    "pencil": {
      "command": "/path/to/.antigravity/extensions/mcp-server-binary",
      "args": ["--ws-port", "54989"],
      "env": {}
    }
  }
}
```

---

## Configuration Fields

| Field | Required | Description |
|-------|----------|-------------|
| `command` | Yes | Executable path or command |
| `args` | No | Array of command-line arguments |
| `env` | No | Environment variables object |

**Note:** For HTTP-based servers, Antigravity uses `serverUrl` instead of `url` (different from other platforms).

---

## Google Cloud MCP Servers

Antigravity MCP Store includes official Google Cloud servers:

### Available Services

- **AlloyDB for PostgreSQL**: Database operations
- **BigQuery**: Data warehouse queries
- **Cloud Spanner**: Globally distributed database
- **Cloud SQL**: Managed relational databases
- **Looker**: Business intelligence
- **Firebase**: Backend services

### Installation from Store

1. Open MCP Store in Antigravity
2. Search for service name
3. Click **Install**
4. Provide required credentials/configuration
5. Server appears in available tools

---

## Project-Level Configuration

### Setup for Team Collaboration

**Create project config:**
```bash
mkdir -p .gemini
cat > .gemini/mcp_config.json << 'EOF'
{
  "mcpServers": {
    "project-server": {
      "command": "npx",
      "args": ["-y", "project-mcp-server"],
      "env": {}
    }
  }
}
EOF
```

**Commit to version control:**
```bash
git add .gemini/
git commit -m "feat: add project MCP configuration"
```

### AGENTS.md Integration

Create `AGENTS.md` in project root for Antigravity-specific instructions:

```markdown
# Project AI Instructions

## MCP Servers

This project uses the following MCP servers:
- **project-server**: Custom project tools
- **bigquery**: Data analysis

## Setup

Run setup script to configure MCP:
\`\`\`bash
./scripts/setup-mcp.sh
\`\`\`
```

---

## Performance Considerations

**Tool Limit:**
- Antigravity recommends **< 50 total enabled tools** for optimal performance
- Disable unused servers to improve response time
- Use tool filtering when needed

**Startup:**
- Servers start on-demand when accessed
- First use may have slight delay
- Subsequent uses are faster

---

## Managing MCP Servers

### Enable/Disable Servers

**Via UI:**
1. Open MCP Store
2. Click **Manage MCP Servers**
3. Toggle servers on/off

**Via Config:**

Remove or comment out server in `mcp_config.json`:
```json
{
  "mcpServers": {
    // "disabled-server": {
    //   "command": "server"
    // }
  }
}
```

### Update Servers

**NPX-based servers:**
```bash
# Update to latest
# Remove @latest version specifier, clear cache
npm cache clean --force
# Re-add with @latest
```

**Local servers:**
- Update source code
- Restart Antigravity

---

## Security Considerations

### Credentials Management

**Never hardcode secrets:**
```json
{
  "mcpServers": {
    "secure-server": {
      "command": "server",
      "env": {
        "API_KEY": "${env:API_KEY}"  // ✅ Reference env var
      }
    }
  }
}
```

### Authentication

**OAuth Personal (Recommended):**
- Configured in `~/.gemini/settings.json`
- `"auth": {"selectedType": "oauth-personal"}`

**Environment Variables:**
- Store sensitive data in shell profile
- Never commit credentials to git

### Best Practices

- ✅ Review MCP server code before installation
- ✅ Use MCP Store for verified servers
- ✅ Install only from official sources
- ✅ Use project-level config for teams
- ✅ Store secrets in environment variables
- ❌ Never commit API keys to version control
- ❌ Never install unverified third-party servers
- ❌ Never enable all tools simultaneously

---

## Debugging

### Check Server Status

**Via UI:**
1. Open MCP Store
2. Select **Manage MCP Servers**
3. View server status and errors

**Via Logs:**
- Check Antigravity console output
- Review server-specific logs if available

### Common Issues

**Server won't start:**
- Verify command path is correct
- Check dependencies are installed
- Ensure environment variables are set
- Test command manually in terminal

**Tools not appearing:**
- Confirm server is enabled
- Check MCP Store for errors
- Verify server implements MCP protocol correctly
- Restart Antigravity

**Authentication failures:**
- Verify credentials in environment
- Check OAuth configuration
- Review server-specific auth requirements

---

## Example Configurations

### Supabase MCP Server

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "${env:SUPABASE_TOKEN}"
      ],
      "env": {}
    }
  }
}
```

### Figma Dev Mode

```json
{
  "mcpServers": {
    "figma": {
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

### Custom Extension Binary

```json
{
  "mcpServers": {
    "pencil": {
      "command": "/Users/username/.antigravity/extensions/highagency.pencildev-0.6.20-universal/out/mcp-server-darwin-arm64",
      "args": ["--ws-port", "54989"],
      "env": {}
    }
  }
}
```

### Multiple Servers

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
    "custom-tools": {
      "command": "node",
      "args": ["./tools/mcp-server.js"],
      "env": {
        "PROJECT_ROOT": "${workspaceFolder}"
      }
    }
  }
}
```

---

## Best Practices

### Configuration Management

- ✅ Use project-level `.gemini/mcp_config.json` for team-shared servers
- ✅ Use user-level for personal tools
- ✅ Version control project configurations
- ✅ Document required environment variables in README
- ✅ Use MCP Store for discovery and installation
- ❌ Never commit credentials
- ❌ Never duplicate configs across locations

### Server Selection

- ✅ Start with MCP Store verified servers
- ✅ Enable only needed tools (< 50 total)
- ✅ Test in development before production
- ✅ Monitor performance impact
- ❌ Don't enable all available servers
- ❌ Don't install unverified third-party servers

### Team Collaboration

- ✅ Share project `.gemini/mcp_config.json` in git
- ✅ Document setup in README or AGENTS.md
- ✅ Use consistent server names across team
- ✅ Provide setup scripts for onboarding
- ❌ Don't assume team has all env vars set
- ❌ Don't mix personal and project configs

---

## Migration from Other Platforms

### From Cursor mcp.json

**Cursor format:**
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

**Antigravity format (same):**
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

**Note:** HTTP servers use `serverUrl` in Antigravity (not `url`).

---

## Related Resources

**In This Repository:**
- `docs/references/mcp/mcp-introduction.md` - MCP overview
- `docs/references/mcp/mcp-server-builder.md` - Building servers
- `docs/references/guidelines/team-conventions/third-party-security-guidelines.md` - Security

**External:**
- [Antigravity MCP Documentation](https://antigravity.google/docs/mcp)
- [Google Cloud MCP Integration](https://cloud.google.com/blog/products/data-analytics/connect-google-antigravity-ide-to-googles-data-cloud-services)
- [Composio: MCP with Antigravity](https://composio.dev/blog/howto-mcp-antigravity)
- [Medium: Custom MCP Integration](https://medium.com/google-developer-experts/google-antigravity-custom-mcp-server-integration-to-improve-vibe-coding-f92ddbc1c22d)
- [Lilys.ai: MCP Servers Guide](https://lilys.ai/en/notes/google-antigravity-20260129/mcp-servers-antigravity-ide)
- [Model Context Protocol](https://modelcontextprotocol.io/)

---

**Last Updated:** January 2026
**Category:** MCP Integration
**Platform:** Google Antigravity
**Status:** Official Documentation
