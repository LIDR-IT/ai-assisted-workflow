# Scoped Configuration

## Overview

MCP servers can be configured at **three different scope levels** in Claude Code, providing flexibility for personal development, team collaboration, and cross-project workflows. Understanding scope hierarchy and precedence is essential for managing MCP configurations effectively across different contexts.

**Three Scope Levels:**
1. **Local Scope** - Personal configurations for specific projects
2. **Project Scope** - Team-shared configurations checked into version control
3. **User Scope** - Personal configurations applied across all projects

This guide explains how each scope works, when to use them, and how they interact with each other.

---

## Understanding Scope Levels

### Local Scope

**Definition:** Personal MCP servers scoped to a specific project directory path.

**Storage Location:** `~/.claude.json` under the project's path key

**Applies To:** You only, within the current project directory

**Visibility:** Not visible to other team members or in other projects

**Use Cases:**
- Personal development and testing servers
- Experimental configurations before team adoption
- Sensitive credentials that should not be shared
- Project-specific overrides of team configurations
- Local debugging tools

**Characteristics:**
- Default scope when adding servers (if `--scope` not specified)
- Stored in home directory (not project directory)
- Not tracked in version control
- Highest precedence in scope hierarchy
- Can override project and user scoped servers

### Project Scope

**Definition:** Team-shared MCP servers intended for all project contributors.

**Storage Location:** `.mcp.json` at project root (checked into git)

**Applies To:** All team members working in the project repository

**Visibility:** Visible to entire team through version control

**Use Cases:**
- Team-shared development servers (GitHub, Jira, etc.)
- Project-specific tools and integrations
- Collaboration services (Slack, Notion, etc.)
- Database connections for the project
- CI/CD integrations

**Characteristics:**
- Explicitly requires `--scope project` flag
- Tracked in version control (committed to repository)
- Security approval required before use
- Can be overridden by local scope
- Standardizes team tooling

### User Scope

**Definition:** Personal MCP servers available across all projects on your machine.

**Storage Location:** `~/.claude.json` (global configuration)

**Applies To:** You, across all projects and directories

**Visibility:** Not visible to other team members

**Use Cases:**
- Personal utility servers used everywhere
- Development tools (linters, formatters, etc.)
- Services used across multiple projects
- Personal productivity integrations
- Cross-project documentation servers

**Characteristics:**
- Explicitly requires `--scope user` flag
- Stored in home directory globally
- Not tracked in any version control
- Lowest precedence in scope hierarchy
- Provides consistent personal tooling

---

## Configuration File Locations

### Local Scope Storage

```bash
# Configuration stored in:
~/.claude.json

# Format within file:
{
  "mcpServers": {
    "/absolute/path/to/project": {
      "server-name": {
        "command": "...",
        "args": [],
        "env": {}
      }
    }
  }
}
```

**Important Note:** MCP "local scope" differs from general local settings:
- **MCP local-scoped servers:** `~/.claude.json` in home directory
- **General local settings:** `.claude/settings.local.json` in project directory

This distinction exists because MCP local scope is path-based rather than file-based.

### Project Scope Storage

```bash
# Configuration stored in:
/path/to/project/.mcp.json

# Format:
{
  "mcpServers": {
    "server-name": {
      "command": "...",
      "args": [],
      "env": {}
    }
  }
}
```

**Version Control:**
```bash
# Project-scoped configs should be committed
git add .mcp.json
git commit -m "feat: Add GitHub MCP server for team"
git push
```

### User Scope Storage

```bash
# Configuration stored in:
~/.claude.json

# Format:
{
  "mcpServers": {
    "global": {
      "server-name": {
        "command": "...",
        "args": [],
        "env": {}
      }
    }
  }
}
```

---

## Scope Hierarchy and Precedence

### Resolution Order

When multiple scopes define servers with the same name:

**Precedence:** Local > Project > User

Personal configurations override shared ones, and project configurations override global personal ones.

### Example: Same Server Name Across Scopes

```bash
# User scope (lowest precedence)
# ~/.claude.json global section
{
  "mcpServers": {
    "global": {
      "github": {
        "type": "http",
        "url": "https://api.githubcopilot.com/mcp/"
      }
    }
  }
}

# Project scope (medium precedence)
# /project/.mcp.json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "X-Team-ID": "${TEAM_ID}"
      }
    }
  }
}

# Local scope (highest precedence)
# ~/.claude.json under project path
{
  "mcpServers": {
    "/path/to/project": {
      "github": {
        "type": "http",
        "url": "https://api.githubcopilot.com/mcp/",
        "headers": {
          "X-Debug": "true"
        }
      }
    }
  }
}
```

**Result:** Claude Code uses local scope configuration (with debug header).

### Scope Resolution Examples

**Example 1: Different servers at each scope**

```bash
# User scope: Personal documentation tool
user: "context7"

# Project scope: Team GitHub integration
project: "github", "sentry"

# Local scope: Personal debugging server
local: "debug-logger"

# Available servers in project:
# - debug-logger (local)
# - github (project, overrides user if existed)
# - sentry (project)
# - context7 (user)
```

**Example 2: Override project server locally**

```bash
# Project scope: Production database (read-only)
{
  "database": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "db-server", "--mode", "readonly"]
  }
}

# Local scope: Development database (read-write)
{
  "/path/to/project": {
    "database": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "db-server", "--mode", "readwrite"]
    }
  }
}
```

**Result:** Your local environment uses read-write database, while team uses read-only (safer for collaboration).

---

## When to Use Each Scope

### Use Local Scope When

**Personal development needs:**
- Testing new MCP servers before team adoption
- Debugging with verbose logging enabled
- Connecting to personal sandbox environments

**Security requirements:**
- API keys that should not be shared
- Personal credentials for services
- Private authentication tokens

**Temporary overrides:**
- Switching from team's production database to local database
- Enabling debug mode on shared services
- Testing modified server configurations

**Commands:**
```bash
# Implicitly local (default)
claude mcp add --transport http stripe https://mcp.stripe.com

# Explicitly local
claude mcp add --scope local --transport http stripe https://mcp.stripe.com
```

### Use Project Scope When

**Team collaboration:**
- Shared development tools (GitHub, Jira, GitLab)
- Project-specific integrations (Slack channels, Notion workspaces)
- Monitoring services (Sentry, Datadog)

**Standardization:**
- Team should use same MCP servers
- Onboarding new team members easily
- Consistent development environment

**Documentation:**
- MCP configuration as code (reviewed in PRs)
- Version-controlled server definitions
- Clear audit trail of changes

**Commands:**
```bash
# Project-scoped server
claude mcp add --scope project --transport http github https://api.githubcopilot.com/mcp/

# Result: Creates .mcp.json at project root
```

**Security Approval:**

Claude Code prompts for approval before using project-scoped servers:

```
This project wants to use MCP server "github"
Command: npx -y @github/mcp-server
Do you approve? [y/N]
```

**Reset approvals:**
```bash
claude mcp reset-project-choices
```

### Use User Scope When

**Cross-project utilities:**
- Personal productivity tools (Context7, file system servers)
- Development utilities (formatters, linters)
- Documentation and reference servers

**Personal workflow:**
- Servers you use in every project
- Personal note-taking integrations
- Time tracking or logging tools

**Machine-specific:**
- Servers that depend on local machine setup
- Personal environment configurations
- Tools installed globally on your system

**Commands:**
```bash
# User-scoped server (available everywhere)
claude mcp add --scope user --transport http context7 https://mcp.context7.com
```

---

## Scope Configuration Examples

### Complete Local Scope Example

**Scenario:** Personal Stripe testing with debug mode enabled

```bash
# Add local-scoped Stripe server
claude mcp add --scope local --transport http stripe \
  --header "X-Debug: true" \
  --env STRIPE_API_KEY="${STRIPE_TEST_KEY}" \
  https://mcp.stripe.com

# Verify storage location
cat ~/.claude.json
```

**Result in `~/.claude.json`:**
```json
{
  "mcpServers": {
    "/Users/username/projects/ecommerce": {
      "stripe": {
        "type": "http",
        "url": "https://mcp.stripe.com",
        "headers": {
          "X-Debug": "true"
        },
        "env": {
          "STRIPE_API_KEY": "sk_test_..."
        }
      }
    }
  }
}
```

### Complete Project Scope Example

**Scenario:** Team GitHub and Sentry integration

```bash
# Navigate to project root
cd /path/to/project

# Add project-scoped GitHub server
claude mcp add --scope project --transport http github \
  https://api.githubcopilot.com/mcp/

# Add project-scoped Sentry server
claude mcp add --scope project --transport http sentry \
  https://mcp.sentry.dev/mcp

# Verify created file
cat .mcp.json
```

**Result in `.mcp.json`:**
```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "sentry": {
      "type": "http",
      "url": "https://mcp.sentry.dev/mcp"
    }
  }
}
```

**Commit to version control:**
```bash
git add .mcp.json
git commit -m "feat: Add GitHub and Sentry MCP servers

Add team-shared MCP servers for GitHub and Sentry integration.

- GitHub: PR reviews, issue tracking
- Sentry: Error monitoring and debugging

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
git push
```

### Complete User Scope Example

**Scenario:** Personal Context7 documentation server across all projects

```bash
# Add user-scoped Context7 server
claude mcp add --scope user --transport http context7 \
  --env CONTEXT7_API_KEY="${CONTEXT7_API_KEY}" \
  https://mcp.context7.com

# Verify storage location
cat ~/.claude.json
```

**Result in `~/.claude.json`:**
```json
{
  "mcpServers": {
    "global": {
      "context7": {
        "type": "http",
        "url": "https://mcp.context7.com",
        "env": {
          "CONTEXT7_API_KEY": "c7_..."
        }
      }
    }
  }
}
```

**Now available in all projects:**
```bash
# In project A
cd ~/projects/project-a
claude  # context7 server available

# In project B
cd ~/projects/project-b
claude  # context7 server available
```

---

## Team Collaboration Patterns

### Pattern 1: Project Base + Local Overrides

**Team configuration (`.mcp.json`):**
```json
{
  "mcpServers": {
    "database": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "db-server", "--host", "staging.db.company.com"]
    }
  }
}
```

**Individual override (local scope):**
```bash
# Developer wants to connect to local database
claude mcp add --scope local --transport stdio database -- \
  npx -y db-server --host localhost
```

**Result:** Team uses staging database, individual uses localhost.

### Pattern 2: Shared Base + Personal Extensions

**Team configuration (`.mcp.json`):**
```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "sentry": {
      "type": "http",
      "url": "https://mcp.sentry.dev/mcp"
    }
  }
}
```

**Personal additions (local/user scope):**
```bash
# Add personal debugging server (local scope)
claude mcp add --scope local --transport stdio debugger -- \
  npx -y debug-mcp-server

# Add personal documentation (user scope)
claude mcp add --scope user --transport http context7 \
  https://mcp.context7.com
```

**Result:** Individual has github + sentry (team) + debugger (local) + context7 (user).

### Pattern 3: Environment-Specific Configurations

**Production project (`.mcp.json`):**
```json
{
  "mcpServers": {
    "monitoring": {
      "type": "http",
      "url": "https://monitoring.prod.company.com/mcp"
    }
  }
}
```

**Developer local override:**
```bash
# Use development monitoring instead
claude mcp add --scope local --transport http monitoring \
  https://monitoring.dev.company.com/mcp
```

**Result:** Production pointing to prod monitoring, local development uses dev monitoring.

### Pattern 4: Sensitive Credentials Management

**Team configuration with placeholders (`.mcp.json`):**
```json
{
  "mcpServers": {
    "api-service": {
      "type": "http",
      "url": "${API_URL:-https://api.company.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      }
    }
  }
}
```

**Individual sets environment variables:**
```bash
# Set in shell profile or .env
export API_URL="https://api.dev.company.com"
export API_TOKEN="dev_token_abc123"

# Or set for current session
API_TOKEN="dev_token_abc123" claude
```

**Result:** Team shares configuration structure, individuals provide their own credentials.

---

## Best Practices for Scope Usage

### Security Best Practices

**Never commit secrets in project scope:**
```json
// BAD - Don't commit API keys
{
  "mcpServers": {
    "service": {
      "env": {
        "API_KEY": "sk_live_abc123"  // ❌ Never do this
      }
    }
  }
}

// GOOD - Use environment variable expansion
{
  "mcpServers": {
    "service": {
      "env": {
        "API_KEY": "${SERVICE_API_KEY}"  // ✅ Safe to commit
      }
    }
  }
}
```

**Use local scope for personal credentials:**
```bash
# Personal API key - use local scope
claude mcp add --scope local --transport http service \
  --env API_KEY="${MY_PERSONAL_API_KEY}" \
  https://mcp.service.com
```

### Onboarding Best Practices

**Document project-scoped servers in README:**
```markdown
## MCP Servers

This project uses the following MCP servers (configured in `.mcp.json`):

### GitHub
- **Purpose:** PR reviews, issue tracking
- **Authentication:** OAuth (run `/mcp` to authenticate)

### Sentry
- **Purpose:** Error monitoring
- **Authentication:** OAuth (run `/mcp` to authenticate)

### Database
- **Purpose:** Query staging database
- **Authentication:** None (read-only access)
- **Local override:** See [Database Setup](docs/database.md)
```

**Provide setup script:**
```bash
#!/bin/bash
# scripts/mcp-setup.sh

echo "Setting up MCP servers..."

# Verify project servers installed
if ! claude mcp get github &>/dev/null; then
  echo "❌ Project MCP servers not found"
  echo "Ensure you're in project directory and .mcp.json exists"
  exit 1
fi

echo "✅ Project MCP servers configured"

# Optional: Add user-scoped utilities
read -p "Install user-scoped Context7? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  claude mcp add --scope user --transport http context7 \
    --env CONTEXT7_API_KEY="${CONTEXT7_API_KEY}" \
    https://mcp.context7.com
fi

echo "🚀 MCP setup complete!"
```

### Maintenance Best Practices

**Review project-scoped configs in PRs:**
```bash
# In CI or pre-commit hook
if git diff --cached --name-only | grep -q ".mcp.json"; then
  echo "⚠️  MCP configuration changed"
  echo "Review .mcp.json for sensitive data before committing"
fi
```

**Document scope decisions:**
```markdown
## MCP Server Scopes

- **github** (project): Team-shared GitHub integration
- **sentry** (project): Error monitoring for all devs
- **database** (project): Staging database access
- **debugger** (local): Optional personal debugging tool
- **context7** (user): Personal documentation server
```

**Audit local overrides:**
```bash
# List all servers with scope information
claude mcp list

# Remove outdated local overrides
claude mcp remove --scope local old-server
```

---

## Platform Support Matrix

### Claude Code (Full Support)

| Feature | Local | Project | User | Notes |
|---------|-------|---------|------|-------|
| Stdio servers | ✅ | ✅ | ✅ | Full support |
| HTTP servers | ✅ | ✅ | ✅ | Full support |
| SSE servers | ⚠️ | ⚠️ | ⚠️ | Deprecated |
| Environment variables | ✅ | ✅ | ✅ | With expansion |
| Security approval | N/A | ✅ | N/A | Project only |
| Version control | ❌ | ✅ | ❌ | Project only |

### Cursor (Project Scope Only)

| Feature | Local | Project | User | Notes |
|---------|-------|---------|------|-------|
| Stdio servers | ❌ | ✅ | ❌ | Project scope only |
| HTTP servers | ❌ | ✅ | ❌ | Project scope only |
| Environment variables | ❌ | ✅ | ❌ | Project scope only |
| Version control | N/A | ✅ | N/A | `.cursor/mcp.json` |

**Cursor configuration:**
```json
// .cursor/mcp.json (project scope equivalent)
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "package"],
      "env": {}
    }
  }
}
```

### Gemini CLI (Limited Scope Support)

| Feature | Local | Project | User | Notes |
|---------|-------|---------|------|-------|
| Stdio servers | ❌ | ✅ | ✅ | User = global config |
| HTTP servers | ❌ | ✅ | ✅ | User = global config |
| Environment variables | ❌ | ✅ | ✅ | Limited expansion |
| Version control | N/A | ✅ | N/A | Project scope supported |

**Gemini project configuration:**
```json
// .gemini/mcp_config.json
{
  "servers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "package"],
      "env": {}
    }
  }
}
```

**Gemini user configuration:**
```json
// ~/.gemini/mcp_config.json
{
  "servers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "package"],
      "env": {}
    }
  }
}
```

### Antigravity (Global Scope Only)

| Feature | Local | Project | User | Notes |
|---------|-------|---------|------|-------|
| Stdio servers | ❌ | ❌ | ✅ | Global only |
| HTTP servers | ❌ | ❌ | ✅ | Global only |
| Environment variables | ❌ | ❌ | ✅ | Limited |
| Version control | N/A | ❌ | N/A | Not supported |

**Antigravity limitation:**

Antigravity does NOT support project-level MCP configurations. All MCP servers must be configured globally:

```json
// ~/.gemini/antigravity/mcp_config.json (global only)
{
  "servers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "package"],
      "env": {}
    }
  }
}
```

See [Antigravity Limitation Guide](../04-platform-guides/antigravity/limitations.md) for details.

---

## Troubleshooting Scope Issues

### Server Not Found

**Problem:** Added server but Claude Code doesn't see it

**Check scope:**
```bash
# List all servers (shows scope)
claude mcp list

# Check specific server
claude mcp get server-name
```

**Solutions:**
```bash
# If wrong scope, remove and re-add
claude mcp remove server-name
claude mcp add --scope project --transport http server-name https://...

# If local scope, ensure you're in correct directory
pwd  # Verify project path matches
```

### Project Server Override Not Working

**Problem:** Local override not taking precedence

**Verify precedence:**
```bash
# Check which server is active
claude mcp get server-name

# Should show local scope if configured
```

**Debug:**
```bash
# List all scopes
cat ~/.claude.json  # Check local and user
cat .mcp.json       # Check project

# Verify server name matches exactly
# "github" ≠ "GitHub" (case-sensitive)
```

### Team Member Can't See Project Server

**Problem:** Teammate doesn't have project-scoped servers

**Checklist:**
```bash
# 1. Verify .mcp.json committed
git ls-files .mcp.json

# 2. Verify teammate pulled latest
git pull

# 3. Verify teammate in project directory
pwd

# 4. Verify file exists for teammate
ls -la .mcp.json

# 5. Check for approval requirement
# Run `/mcp` in Claude Code and approve servers
```

### Environment Variables Not Expanding

**Problem:** `${VAR}` appearing literally instead of expanding

**Check configuration:**
```json
{
  "mcpServers": {
    "server": {
      "env": {
        "API_KEY": "${API_KEY}"  // Should expand
      }
    }
  }
}
```

**Verify variable set:**
```bash
# Check environment variable exists
echo $API_KEY

# If not set, add to shell profile
export API_KEY="your-key"

# Or set when launching
API_KEY="your-key" claude
```

---

## Related Documentation

**MCP Basics:**
- [Installation](installation.md) - Installing MCP servers
- [Authentication](authentication.md) - Authentication with remote servers

**Platform Guides:**
- [Claude Code Platform Guide](../04-platform-guides/claude-code/overview.md)
- [Cursor Platform Guide](../04-platform-guides/cursor/overview.md)
- [Gemini CLI Platform Guide](../04-platform-guides/gemini-cli/overview.md)
- [Antigravity Platform Guide](../04-platform-guides/antigravity/overview.md)

**Advanced Topics:**
- [Environment Variables](../05-advanced/environment-variables.md)
- [Managed Configuration](../05-advanced/managed-configuration.md)
- [Security Best Practices](../05-advanced/security.md)

---

**Last Updated:** February 2026
**Applies To:** Claude Code v1.0+
**Status:** Official Documentation
