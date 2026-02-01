# Environment Variables in MCP Configurations

## Overview

Environment variables are essential for making MCP server configurations portable, secure, and flexible across different machines and deployment environments. They allow you to:

- **Share configurations** while keeping sensitive data private
- **Support machine-specific paths** without hardcoding
- **Manage API keys and credentials** securely
- **Enable team collaboration** with version-controlled configs
- **Simplify deployment** across development, staging, and production

This guide consolidates all environment variable expansion patterns supported across MCP platforms, providing a single source of truth for variable configuration.

---

## Why Environment Variables Matter

### Security

**Problem:** Hardcoded credentials in configuration files
```json
{
  "mcpServers": {
    "github": {
      "env": {
        "GITHUB_TOKEN": "ghp_1234567890abcdef"
      }
    }
  }
}
```

**Solution:** Use environment variables
```json
{
  "mcpServers": {
    "github": {
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**Benefits:**
- Credentials never committed to version control
- Different tokens per environment (dev, staging, prod)
- Easy credential rotation without config changes
- Reduced risk of accidental exposure

### Portability

**Problem:** Hardcoded absolute paths
```json
{
  "mcpServers": {
    "local-tools": {
      "command": "/Users/alice/projects/tools/server.py"
    }
  }
}
```

**Solution:** Use path variables
```json
{
  "mcpServers": {
    "local-tools": {
      "command": "${workspaceFolder}/tools/server.py"
    }
  }
}
```

**Benefits:**
- Works on any team member's machine
- Supports different operating systems
- No manual path adjustments needed
- Simplified onboarding

### Flexibility

Environment variables enable:
- **Multi-environment support**: Same config for dev/staging/prod
- **User-specific settings**: Personal API keys and preferences
- **Dynamic configuration**: Change behavior without editing files
- **Conditional logic**: Different values based on environment

---

## Variable Expansion Syntax

### Basic Syntax: `${VAR}`

Expands to the value of environment variable `VAR`.

**Example:**
```json
{
  "mcpServers": {
    "api-server": {
      "url": "${API_BASE_URL}/mcp",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      }
    }
  }
}
```

**Shell environment:**
```bash
export API_BASE_URL="https://api.example.com"
export API_TOKEN="secret-token-123"
```

**Expanded result:**
```json
{
  "mcpServers": {
    "api-server": {
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer secret-token-123"
      }
    }
  }
}
```

**Error handling:** If `VAR` is not set, most platforms fail to parse the configuration.

---

### Default Values: `${VAR:-default}`

Expands to `VAR` if set, otherwise uses the default value.

**Example:**
```json
{
  "mcpServers": {
    "api-server": {
      "url": "${API_BASE_URL:-https://api.example.com}/mcp",
      "env": {
        "CACHE_DIR": "${CACHE_DIR:-/tmp/mcp-cache}",
        "LOG_LEVEL": "${LOG_LEVEL:-info}"
      }
    }
  }
}
```

**Use cases:**
- Provide sensible defaults for optional settings
- Support both local and production environments
- Simplify setup for new users
- Graceful degradation when variables missing

**Shell example:**
```bash
# LOG_LEVEL not set → defaults to "info"
# CACHE_DIR set → uses custom value
export CACHE_DIR="/var/cache/mcp"
```

**Expanded result:**
```json
{
  "mcpServers": {
    "api-server": {
      "url": "https://api.example.com/mcp",
      "env": {
        "CACHE_DIR": "/var/cache/mcp",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

**Platform support:**
- ✅ Claude Code
- ⚠️ Check platform-specific documentation for Cursor, Gemini, Antigravity

---

### Explicit Environment: `${env:VAR}`

Explicitly references environment variables (Cursor-specific syntax).

**Example:**
```json
{
  "mcpServers": {
    "database": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${env:DATABASE_URL}",
        "DB_POOL_SIZE": "${env:DB_POOL_SIZE}"
      }
    }
  }
}
```

**Benefits:**
- Explicit intent (clarity in configuration)
- Distinguishes from other variable types
- Platform-specific optimization

**Platform support:**
- ✅ Cursor (primary syntax)
- ⚠️ May not work in Claude Code, Gemini, Antigravity

**Recommendation:** Use `${VAR}` for cross-platform compatibility unless Cursor-specific features required.

---

### Special Variables: `${userHome}`

Expands to the user's home directory path.

**Example:**
```json
{
  "mcpServers": {
    "local-config": {
      "command": "python",
      "args": ["${userHome}/.mcp-servers/custom/server.py"],
      "env": {
        "CONFIG_PATH": "${userHome}/.config/mcp/settings.json"
      }
    }
  }
}
```

**Cross-platform expansion:**
- **macOS/Linux:** `/Users/username` or `/home/username`
- **Windows:** `C:\Users\username`

**Use cases:**
- User-specific configuration files
- Personal tool installations
- Local cache directories
- User-level credentials

**Platform support:**
- ✅ Cursor
- ⚠️ Check Claude Code, Gemini, Antigravity documentation

---

### Special Variables: `${workspaceFolder}`

Expands to the current project/workspace root directory.

**Example:**
```json
{
  "mcpServers": {
    "project-tools": {
      "command": "node",
      "args": ["${workspaceFolder}/scripts/mcp-server.js"],
      "env": {
        "PROJECT_ROOT": "${workspaceFolder}",
        "CONFIG_FILE": "${workspaceFolder}/config/mcp.json"
      }
    }
  }
}
```

**Use cases:**
- Project-relative paths
- Local development tools
- Project-specific configurations
- Team-shared setups

**Platform support:**
- ✅ Cursor
- ⚠️ Check Claude Code, Gemini, Antigravity documentation

**Alternative:** Use relative paths when possible:
```json
{
  "command": "./scripts/mcp-server.js"
}
```

---

### Special Variables: `${CLAUDE_PLUGIN_ROOT}`

Claude Code plugin-specific variable pointing to the plugin's root directory.

**Example:**
```json
{
  "mcpServers": {
    "plugin-server": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/servers/api-server.js"],
      "env": {
        "PLUGIN_CONFIG": "${CLAUDE_PLUGIN_ROOT}/config.json",
        "PLUGIN_CACHE": "${CLAUDE_PLUGIN_ROOT}/cache"
      }
    }
  }
}
```

**Use cases:**
- Plugin-bundled MCP servers
- Plugin-relative paths
- Portable plugin distributions
- Multi-plugin installations

**Benefits:**
- Ensures portability across installations
- Eliminates hardcoded paths in plugins
- Supports plugin directory relocation
- Works regardless of installation location

**Platform support:**
- ✅ Claude Code plugins only
- ❌ Not available in other platforms

**See also:** [MCP Integration for Claude Code](../../references/mcp/mcp-integration-claude-code.md)

---

### Path Separators: `${pathSeparator}` or `${/}`

Platform-agnostic path separator.

**Example:**
```json
{
  "mcpServers": {
    "cross-platform": {
      "command": "python",
      "args": ["${workspaceFolder}${/}tools${/}server.py"]
    }
  }
}
```

**Expansion:**
- **Unix/macOS:** `/`
- **Windows:** `\`

**Platform support:**
- ✅ Cursor
- ⚠️ Limited support elsewhere

**Recommendation:** Modern systems generally accept forward slashes on all platforms. Prefer `/` unless Windows-specific tools require backslashes.

---

## Platform Compatibility Matrix

| Syntax | Claude Code | Cursor | Gemini CLI | Antigravity | Notes |
|--------|-------------|--------|------------|-------------|-------|
| `${VAR}` | ✅ | ✅ | ✅ | ✅ | Universal, recommended |
| `${VAR:-default}` | ✅ | ⚠️ | ⚠️ | ⚠️ | Claude Code confirmed |
| `${env:VAR}` | ⚠️ | ✅ | ⚠️ | ❌ | Cursor-specific |
| `${userHome}` | ⚠️ | ✅ | ⚠️ | ❌ | Cursor-specific |
| `${workspaceFolder}` | ⚠️ | ✅ | ⚠️ | ❌ | Cursor-specific |
| `${CLAUDE_PLUGIN_ROOT}` | ✅ | ❌ | ❌ | ❌ | Claude plugins only |
| `${pathSeparator}` | ❌ | ✅ | ❌ | ❌ | Cursor-specific |

**Legend:**
- ✅ Fully supported and documented
- ⚠️ May work but not officially documented
- ❌ Not supported

**Best practice:** Use `${VAR}` syntax for maximum cross-platform compatibility.

---

## Complete Examples

### Example 1: Multi-Platform API Server

**Configuration (`.mcp.json`):**
```json
{
  "mcpServers": {
    "company-api": {
      "url": "${API_BASE_URL:-https://api.company.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}",
        "X-Environment": "${ENVIRONMENT:-production}"
      }
    }
  }
}
```

**Development environment (`.env`):**
```bash
API_BASE_URL=http://localhost:3000
API_TOKEN=dev-token-123
ENVIRONMENT=development
```

**Production environment:**
```bash
export API_TOKEN=prod-token-secret
# API_BASE_URL and ENVIRONMENT use defaults
```

**Result:**
- Development: Local API at `http://localhost:3000/mcp`
- Production: Production API at `https://api.company.com/mcp`

---

### Example 2: Database Connection

**Configuration:**
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "${DATABASE_URL}",
        "PG_POOL_SIZE": "${PG_POOL_SIZE:-10}",
        "PG_TIMEOUT": "${PG_TIMEOUT:-30000}"
      }
    }
  }
}
```

**Environment setup:**
```bash
# Required
export DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"

# Optional (use defaults if not set)
export PG_POOL_SIZE=20
export PG_TIMEOUT=60000
```

**Expanded configuration:**
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://user:pass@localhost:5432/dbname",
        "PG_POOL_SIZE": "20",
        "PG_TIMEOUT": "60000"
      }
    }
  }
}
```

---

### Example 3: Local Development Tools

**Configuration (Cursor-specific):**
```json
{
  "mcpServers": {
    "local-tools": {
      "command": "python",
      "args": ["${workspaceFolder}/tools/mcp-server.py"],
      "env": {
        "PROJECT_ROOT": "${workspaceFolder}",
        "USER_CONFIG": "${userHome}/.config/tools/settings.json",
        "API_KEY": "${env:TOOLS_API_KEY}",
        "LOG_LEVEL": "${env:LOG_LEVEL:-info}"
      }
    }
  }
}
```

**Cross-platform alternative:**
```json
{
  "mcpServers": {
    "local-tools": {
      "command": "python",
      "args": ["./tools/mcp-server.py"],
      "env": {
        "API_KEY": "${TOOLS_API_KEY}",
        "LOG_LEVEL": "${LOG_LEVEL:-info}"
      }
    }
  }
}
```

---

### Example 4: Claude Code Plugin

**Plugin `.mcp.json`:**
```json
{
  "mcpServers": {
    "plugin-database": {
      "command": "${CLAUDE_PLUGIN_ROOT}/bin/db-server",
      "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config/db.json"],
      "env": {
        "DB_URL": "${DATABASE_URL}",
        "PLUGIN_CACHE": "${CLAUDE_PLUGIN_ROOT}/cache",
        "LOG_LEVEL": "${LOG_LEVEL:-warn}"
      }
    }
  }
}
```

**User environment:**
```bash
export DATABASE_URL="postgresql://localhost/mydb"
export LOG_LEVEL=debug
```

**Expanded paths (example):**
```json
{
  "mcpServers": {
    "plugin-database": {
      "command": "/home/user/.claude/plugins/my-plugin/bin/db-server",
      "args": ["--config", "/home/user/.claude/plugins/my-plugin/config/db.json"],
      "env": {
        "DB_URL": "postgresql://localhost/mydb",
        "PLUGIN_CACHE": "/home/user/.claude/plugins/my-plugin/cache",
        "LOG_LEVEL": "debug"
      }
    }
  }
}
```

---

## Security Best Practices

### 1. Never Commit Secrets

**Bad:**
```json
{
  "mcpServers": {
    "github": {
      "env": {
        "GITHUB_TOKEN": "ghp_1234567890abcdef"
      }
    }
  }
}
```

**Good:**
```json
{
  "mcpServers": {
    "github": {
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**`.gitignore`:**
```gitignore
.env
.env.local
*.secret
*.key
```

---

### 2. Use Scoped API Keys

Request minimum required permissions for API tokens.

**Example:**
```bash
# ❌ Full access token
export GITHUB_TOKEN=ghp_full_access_token

# ✅ Read-only token with specific scopes
export GITHUB_TOKEN=ghp_readonly_repo_token
```

---

### 3. Separate Environments

Use different credentials for development, staging, and production.

**Development (`.env.development`):**
```bash
API_BASE_URL=http://localhost:3000
API_TOKEN=dev-token-123
DATABASE_URL=postgresql://localhost/dev_db
```

**Production (environment variables):**
```bash
export API_BASE_URL=https://api.production.com
export API_TOKEN=prod-secure-token
export DATABASE_URL=postgresql://prod-db.internal/prod
```

---

### 4. Document Required Variables

Create `.env.example` for team members:

```bash
# .env.example
# Copy to .env and fill in your values

# Required
GITHUB_TOKEN=your_github_token_here
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname

# Optional (defaults provided)
API_BASE_URL=https://api.example.com
LOG_LEVEL=info
CACHE_DIR=/tmp/mcp-cache
```

**README.md:**
```markdown
## Setup

1. Copy `.env.example` to `.env`
2. Fill in required environment variables:
   - `GITHUB_TOKEN`: Personal access token from https://github.com/settings/tokens
   - `DATABASE_URL`: PostgreSQL connection string
3. Optional: Set `LOG_LEVEL` (default: info) and other variables
```

---

### 5. Validate at Runtime

Check for missing required variables before server starts.

**Example validation script:**
```bash
#!/bin/bash
# validate-env.sh

REQUIRED_VARS=("DATABASE_URL" "API_TOKEN" "GITHUB_TOKEN")

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Missing required environment variable: $var"
    exit 1
  fi
done

echo "✅ All required environment variables are set"
```

**MCP server wrapper:**
```bash
#!/bin/bash
./validate-env.sh && npx -y @my-org/mcp-server
```

---

## Common Patterns

### Pattern 1: Multi-Environment Configuration

**Single config for all environments:**
```json
{
  "mcpServers": {
    "api": {
      "url": "${API_URL:-https://api.production.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}",
        "X-Environment": "${ENVIRONMENT:-production}"
      }
    }
  }
}
```

**Environment-specific variables:**
```bash
# .env.development
API_URL=http://localhost:3000
ENVIRONMENT=development
API_TOKEN=dev-token

# .env.staging
API_URL=https://staging-api.example.com
ENVIRONMENT=staging
API_TOKEN=staging-token

# .env.production (or export in deployment)
API_TOKEN=prod-token
# API_URL and ENVIRONMENT use defaults
```

---

### Pattern 2: User-Specific Configuration

**Shared config (version controlled):**
```json
{
  "mcpServers": {
    "shared-db": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    }
  }
}
```

**User-specific `.env` (not version controlled):**
```bash
# Alice's .env
DATABASE_URL=postgresql://alice:password@localhost:5432/dev

# Bob's .env
DATABASE_URL=postgresql://bob:password@db.internal:5432/bob_dev
```

---

### Pattern 3: Plugin Portability

**Plugin config using `${CLAUDE_PLUGIN_ROOT}`:**
```json
{
  "mcpServers": {
    "plugin-tools": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/server.js"],
      "env": {
        "CONFIG": "${CLAUDE_PLUGIN_ROOT}/config.json",
        "API_KEY": "${PLUGIN_API_KEY}"
      }
    }
  }
}
```

**Benefits:**
- Works regardless of plugin installation location
- Supports multiple plugin instances
- No path hardcoding needed

---

### Pattern 4: Conditional Behavior

**Use environment variables to control behavior:**
```json
{
  "mcpServers": {
    "smart-server": {
      "command": "python",
      "args": ["server.py"],
      "env": {
        "DEBUG_MODE": "${DEBUG_MODE:-false}",
        "USE_CACHE": "${USE_CACHE:-true}",
        "MAX_RETRIES": "${MAX_RETRIES:-3}",
        "TIMEOUT": "${TIMEOUT:-30000}"
      }
    }
  }
}
```

**Development:**
```bash
export DEBUG_MODE=true
export USE_CACHE=false
export TIMEOUT=60000
```

**Production uses defaults (fast, cached, resilient).**

---

## Troubleshooting

### Variable Not Expanding

**Symptom:** Literal `${VAR}` appears in configuration

**Causes:**
1. Environment variable not set
2. Typo in variable name
3. Platform doesn't support syntax

**Solutions:**
```bash
# Verify variable is set
echo $MY_VAR

# Set variable
export MY_VAR=value

# Restart platform after setting
# Claude Code, Cursor, etc. need restart to pick up changes

# Check platform documentation for supported syntax
```

---

### Missing Required Variable

**Symptom:** MCP server fails to start, error about missing variable

**Solutions:**
```bash
# List all environment variables
env | grep MCP

# Check .env file is loaded
cat .env

# Verify variable exported (not just set)
export MY_VAR=value  # ✅ Exported
MY_VAR=value         # ❌ Not exported

# Source .env file
set -a
source .env
set +a
```

---

### Default Value Not Working

**Symptom:** `${VAR:-default}` doesn't use default

**Causes:**
1. Platform doesn't support default syntax
2. Variable is set to empty string (not unset)
3. Syntax error

**Solutions:**
```bash
# Check if variable is set to empty
if [ -z "$VAR" ]; then echo "Empty or unset"; fi

# Unset variable to use default
unset VAR

# Use fallback in platform-specific way
# Or set explicit default in .env file
```

---

### Path Expansion Issues

**Symptom:** Paths not resolving correctly

**Solutions:**
```bash
# For ${workspaceFolder}, ensure you're in a workspace/project
# Check current directory
pwd

# Use absolute paths as fallback
export PROJECT_ROOT=/full/path/to/project

# Test path manually
ls -la ${workspaceFolder}/tools/

# Prefer relative paths when possible
"command": "./tools/server.py"  # Instead of ${workspaceFolder}/tools/server.py
```

---

### Cross-Platform Incompatibility

**Symptom:** Config works on one platform but not another

**Solutions:**
1. Use universal `${VAR}` syntax
2. Avoid platform-specific variables (`${env:VAR}`, `${userHome}`)
3. Test on all target platforms
4. Document platform-specific configurations

**Example multi-platform config:**
```json
{
  "mcpServers": {
    "universal": {
      "command": "npx",
      "args": ["-y", "@my-org/server"],
      "env": {
        "API_KEY": "${API_KEY}",
        "BASE_URL": "${BASE_URL:-https://api.example.com}"
      }
    }
  }
}
```

---

## Loading Environment Variables

### From `.env` Files

**Create `.env` file:**
```bash
# .env
API_TOKEN=my-secret-token
DATABASE_URL=postgresql://localhost/mydb
LOG_LEVEL=debug
```

**Shell loading:**
```bash
# Export all variables from .env
set -a
source .env
set +a

# Verify
echo $API_TOKEN
```

**Platform-specific:**
- **Claude Code:** May automatically load `.env` from project root
- **Cursor:** Check `envFile` field in stdio configs
- **Gemini/Antigravity:** Manual export required

---

### From Shell Profile

**Add to `~/.bashrc`, `~/.zshrc`, or equivalent:**
```bash
# ~/.zshrc
export GITHUB_TOKEN=ghp_your_token_here
export DATABASE_URL=postgresql://localhost/mydb

# Platform-specific paths
export MCP_CONFIG_DIR="$HOME/.config/mcp"
```

**Reload shell:**
```bash
source ~/.zshrc
```

---

### From Environment Management Tools

**Using `direnv`:**
```bash
# Install direnv
brew install direnv  # macOS
apt install direnv   # Linux

# Add to shell profile
eval "$(direnv hook zsh)"

# Create .envrc in project
echo 'export API_TOKEN=secret' > .envrc

# Allow directory
direnv allow .

# Variables auto-load when entering directory
```

**Using `dotenv`:**
```bash
npm install -g dotenv-cli

# Run with .env loaded
dotenv -- claude
```

---

## Platform-Specific Considerations

### Claude Code

**Supported syntax:**
- ✅ `${VAR}`
- ✅ `${VAR:-default}`
- ✅ `${CLAUDE_PLUGIN_ROOT}` (plugins only)

**Example:**
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}",
        "POOL_SIZE": "${POOL_SIZE:-10}"
      }
    }
  }
}
```

---

### Cursor

**Supported syntax:**
- ✅ `${env:VAR}`
- ✅ `${userHome}`
- ✅ `${workspaceFolder}`
- ✅ `${workspaceFolderBasename}`
- ✅ `${pathSeparator}` or `${/}`

**Example:**
```json
{
  "mcpServers": {
    "local": {
      "command": "python",
      "args": ["${workspaceFolder}/tools/server.py"],
      "env": {
        "API_KEY": "${env:API_KEY}",
        "CONFIG": "${userHome}/.config/mcp/settings.json"
      },
      "envFile": "${workspaceFolder}/.env"
    }
  }
}
```

**Note:** `envFile` is stdio-only in Cursor.

---

### Gemini CLI & Antigravity

**Supported syntax:**
- ✅ `${VAR}` (basic, likely supported)
- ⚠️ Other syntax: Check official documentation

**Recommendation:** Use basic `${VAR}` syntax and export variables in shell.

---

## Quick Reference

### Syntax Summary

| Syntax | Expands To | Platform Support | Use Case |
|--------|------------|------------------|----------|
| `${VAR}` | Value of VAR | Universal | General use |
| `${VAR:-default}` | VAR or default | Claude Code | Optional settings |
| `${env:VAR}` | Environment VAR | Cursor | Explicit env vars |
| `${userHome}` | Home directory | Cursor | User paths |
| `${workspaceFolder}` | Project root | Cursor | Project paths |
| `${CLAUDE_PLUGIN_ROOT}` | Plugin directory | Claude plugins | Plugin resources |

---

### Common Variables

| Variable | Typical Value | Purpose |
|----------|---------------|---------|
| `API_TOKEN` | Secret token | API authentication |
| `DATABASE_URL` | Connection string | Database access |
| `LOG_LEVEL` | info/debug/warn | Logging verbosity |
| `CACHE_DIR` | /tmp/cache | Cache location |
| `ENVIRONMENT` | dev/staging/prod | Environment indicator |

---

## Related Documentation

**In This Repository:**
- [MCP Usage in Claude Code](../../../references/mcp/mcp-usage-claude-code.md)
- [MCP in Cursor](../../../references/mcp/mcp-cursor.md)
- [MCP Integration for Plugins](../../../references/mcp/mcp-integration-claude-code.md)
- [Security Guidelines](../../../guidelines/team-conventions/third-party-security-guidelines.md)

**External:**
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Claude Code Documentation](https://code.claude.com/docs)
- [Cursor MCP Documentation](https://cursor.com/docs/context/mcp)

---

**Last Updated:** February 2026
**Category:** MCP Configuration
**Status:** Single Source of Truth for Environment Variables
**Audience:** All MCP platforms (Claude Code, Cursor, Gemini, Antigravity)
