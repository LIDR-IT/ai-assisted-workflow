# Configuration Schema Reference

Complete reference for MCP server configuration formats across all platforms. This document covers configuration schemas, field specifications, validation rules, and migration guides.

## Table of Contents

- [Universal Source Schema](#universal-source-schema)
- [Platform-Specific Schemas](#platform-specific-schemas)
  - [Claude Code](#claude-code-schema)
  - [Cursor](#cursor-schema)
  - [Gemini CLI](#gemini-cli-schema)
  - [Antigravity](#antigravity-schema)
- [Field Reference](#field-reference)
- [Environment Variables](#environment-variables)
- [Validation Rules](#validation-rules)
- [Configuration Examples](#configuration-examples)
- [Migration Guide](#migration-guide)

---

## Universal Source Schema

The universal configuration format used in `.agents/mcp/mcp-servers.json` serves as the single source of truth for all platforms.

### Schema Structure

```json
{
  "version": "1.0",
  "description": "Project description",
  "_notes": {
    "key": "Optional metadata for documentation"
  },
  "servers": {
    "server-name": {
      "type": "stdio" | "http",
      "command": "string",
      "args": ["array", "of", "strings"],
      "env": {
        "KEY": "value"
      },
      "platforms": ["cursor", "claude", "gemini", "antigravity"],
      "description": "Server description"
    }
  }
}
```

### JSON Schema Definition

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["version", "servers"],
  "properties": {
    "version": {
      "type": "string",
      "description": "Configuration format version",
      "default": "1.0"
    },
    "description": {
      "type": "string",
      "description": "Project description"
    },
    "_notes": {
      "type": "object",
      "description": "Optional metadata (ignored during generation)"
    },
    "servers": {
      "type": "object",
      "patternProperties": {
        "^[a-zA-Z0-9_-]+$": {
          "$ref": "#/definitions/server"
        }
      }
    }
  },
  "definitions": {
    "server": {
      "type": "object",
      "required": ["type", "platforms"],
      "properties": {
        "type": {
          "type": "string",
          "enum": ["stdio", "http"],
          "description": "Communication protocol"
        },
        "platforms": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": ["cursor", "claude", "gemini", "antigravity"]
          },
          "minItems": 1,
          "uniqueItems": true,
          "description": "Target platforms for this server"
        },
        "description": {
          "type": "string",
          "description": "Human-readable server description"
        },
        "command": {
          "type": "string",
          "description": "Executable command (for stdio type)"
        },
        "args": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Command arguments (for stdio type)"
        },
        "env": {
          "type": "object",
          "patternProperties": {
            "^[A-Z_][A-Z0-9_]*$": {
              "type": "string"
            }
          },
          "description": "Environment variables"
        },
        "url": {
          "type": "string",
          "format": "uri",
          "description": "Server URL (for http type)"
        },
        "headers": {
          "type": "object",
          "patternProperties": {
            "^[A-Za-z-]+$": {
              "type": "string"
            }
          },
          "description": "HTTP headers (for http type)"
        }
      },
      "allOf": [
        {
          "if": {
            "properties": { "type": { "const": "stdio" } }
          },
          "then": {
            "required": ["command"]
          }
        },
        {
          "if": {
            "properties": { "type": { "const": "http" } }
          },
          "then": {
            "required": ["url"]
          }
        }
      ]
    }
  }
}
```

### Universal Schema Examples

**STDIO Server (npx package):**
```json
{
  "servers": {
    "context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "${env:CONTEXT7_API_KEY}"
      },
      "platforms": ["cursor", "claude", "gemini", "antigravity"],
      "description": "Context7 documentation provider"
    }
  }
}
```

**STDIO Server (local script):**
```json
{
  "servers": {
    "custom-tool": {
      "type": "stdio",
      "command": "node",
      "args": ["./scripts/mcp-server.js"],
      "env": {
        "DEBUG": "true"
      },
      "platforms": ["cursor", "claude"],
      "description": "Custom project tool"
    }
  }
}
```

**HTTP Server:**
```json
{
  "servers": {
    "api-service": {
      "type": "http",
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "${env:API_TOKEN}",
        "X-Client-Version": "1.0.0"
      },
      "platforms": ["cursor", "claude", "gemini"],
      "description": "Remote API service"
    }
  }
}
```

---

## Platform-Specific Schemas

Each platform has its own configuration format. These are generated automatically from the universal schema.

### Claude Code Schema

**Location:** `.claude/mcp.json` (project) or `~/.config/claude/mcp.json` (global)

**Format:**
```json
{
  "mcpServers": {
    "server-name": {
      "command": "string",
      "args": ["array"],
      "env": {
        "KEY": "value"
      }
    }
  }
}
```

**JSON Schema:**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["mcpServers"],
  "properties": {
    "mcpServers": {
      "type": "object",
      "patternProperties": {
        "^[a-zA-Z0-9_-]+$": {
          "oneOf": [
            { "$ref": "#/definitions/stdioServer" },
            { "$ref": "#/definitions/httpServer" }
          ]
        }
      }
    }
  },
  "definitions": {
    "stdioServer": {
      "type": "object",
      "required": ["command"],
      "properties": {
        "command": {
          "type": "string",
          "description": "Executable command"
        },
        "args": {
          "type": "array",
          "items": { "type": "string" },
          "default": []
        },
        "env": {
          "type": "object",
          "patternProperties": {
            "^[A-Z_][A-Z0-9_]*$": { "type": "string" }
          },
          "default": {}
        }
      }
    },
    "httpServer": {
      "type": "object",
      "required": ["url"],
      "properties": {
        "url": {
          "type": "string",
          "format": "uri"
        },
        "headers": {
          "type": "object",
          "patternProperties": {
            "^[A-Za-z-]+$": { "type": "string" }
          },
          "default": {}
        }
      }
    }
  }
}
```

**Example:**
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
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"]
    }
  }
}
```

---

### Cursor Schema

**Location:** `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global)

**Format:** Identical to Claude Code
```json
{
  "mcpServers": {
    "server-name": {
      "command": "string",
      "args": ["array"],
      "env": {
        "KEY": "value"
      }
    }
  }
}
```

**JSON Schema:** Same as [Claude Code Schema](#claude-code-schema)

**Example:**
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

---

### Gemini CLI Schema

**Location:** `.gemini/settings.json` (project) or `~/.gemini/settings.json` (global)

**Format:**
```json
{
  "experimental": {
    "enableAgents": boolean
  },
  "context": {
    "fileName": ["array"]
  },
  "mcpServers": {
    "server-name": {
      "command": "string",
      "args": ["array"],
      "env": {
        "KEY": "value"
      }
    }
  }
}
```

**JSON Schema:**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "experimental": {
      "type": "object",
      "properties": {
        "enableAgents": {
          "type": "boolean",
          "default": false,
          "description": "Enable experimental agents feature"
        }
      }
    },
    "context": {
      "type": "object",
      "properties": {
        "fileName": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Context files to load automatically"
        }
      }
    },
    "mcpServers": {
      "type": "object",
      "patternProperties": {
        "^[a-zA-Z0-9_-]+$": {
          "oneOf": [
            { "$ref": "#/definitions/stdioServer" },
            { "$ref": "#/definitions/httpServer" }
          ]
        }
      }
    }
  },
  "definitions": {
    "stdioServer": {
      "type": "object",
      "required": ["command"],
      "properties": {
        "command": { "type": "string" },
        "args": {
          "type": "array",
          "items": { "type": "string" },
          "default": []
        },
        "env": {
          "type": "object",
          "default": {}
        }
      }
    },
    "httpServer": {
      "type": "object",
      "required": ["url"],
      "properties": {
        "url": { "type": "string", "format": "uri" },
        "headers": {
          "type": "object",
          "default": {}
        }
      }
    }
  }
}
```

**Example:**
```json
{
  "experimental": {
    "enableAgents": true
  },
  "context": {
    "fileName": [
      "AGENTS.md",
      "CONTEXT.md",
      "GEMINI.md",
      "CLAUDE.md"
    ]
  },
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

**Important Notes:**
- `experimental` and `context` sections are preserved during sync
- Gemini CLI requires both project and potentially global configuration
- The sync script merges MCP servers while preserving other settings

---

### Antigravity Schema

**Location:** `~/.gemini/antigravity/mcp_config.json` (GLOBAL ONLY)

**Format:**
```json
{
  "mcpServers": {
    "server-name": {
      "command": "string",
      "args": ["array"],
      "env": {
        "KEY": "value"
      }
    }
  }
}
```

**JSON Schema:**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["mcpServers"],
  "properties": {
    "mcpServers": {
      "type": "object",
      "patternProperties": {
        "^[a-zA-Z0-9_-]+$": {
          "oneOf": [
            { "$ref": "#/definitions/stdioServer" },
            { "$ref": "#/definitions/httpServer" }
          ]
        }
      }
    }
  },
  "definitions": {
    "stdioServer": {
      "type": "object",
      "required": ["command"],
      "properties": {
        "command": { "type": "string" },
        "args": {
          "type": "array",
          "items": { "type": "string" },
          "default": []
        },
        "env": {
          "type": "object",
          "default": {}
        }
      }
    },
    "httpServer": {
      "type": "object",
      "required": ["serverUrl"],
      "properties": {
        "serverUrl": {
          "type": "string",
          "format": "uri",
          "description": "Note: Antigravity uses 'serverUrl' instead of 'url'"
        },
        "headers": {
          "type": "object",
          "default": {}
        }
      }
    }
  }
}
```

**Example:**
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "your-api-key-here"
      }
    },
    "api-service": {
      "serverUrl": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer token123"
      }
    }
  }
}
```

**Critical Limitations:**
- **Global configuration ONLY** - no project-level support
- **Manual configuration required** - not managed by sync scripts
- HTTP servers use `serverUrl` field (different from other platforms)
- Configuration must be absolute paths, cannot use `${env:VAR}` syntax
- See [Antigravity Platform Guide](../04-platform-guides/antigravity.md) for details

---

## Field Reference

Complete reference for all configuration fields across all formats.

### Universal Schema Fields

#### `version`
- **Type:** `string`
- **Required:** Yes
- **Default:** `"1.0"`
- **Description:** Configuration format version
- **Values:** `"1.0"`
- **Example:** `"version": "1.0"`

#### `description`
- **Type:** `string`
- **Required:** No
- **Default:** None
- **Description:** Human-readable project description
- **Example:** `"description": "MCP servers for project X"`

#### `_notes`
- **Type:** `object`
- **Required:** No
- **Default:** None
- **Description:** Metadata for documentation (ignored during generation)
- **Example:**
  ```json
  "_notes": {
    "sync_behavior": "Preserves experimental settings",
    "last_updated": "2026-02-01"
  }
  ```

#### `servers`
- **Type:** `object`
- **Required:** Yes
- **Description:** Map of server configurations keyed by server name
- **Naming:** Alphanumeric, hyphens, underscores only
- **Example:** `"servers": { "context7": {...} }`

### Server Configuration Fields

#### `type`
- **Type:** `string`
- **Required:** Yes
- **Values:** `"stdio"` | `"http"`
- **Description:** Communication protocol type
- **Default:** None
- **Example:** `"type": "stdio"`

#### `platforms`
- **Type:** `array<string>`
- **Required:** Yes (in universal schema only)
- **Values:** `["cursor", "claude", "gemini", "antigravity"]`
- **Description:** Target platforms for this server
- **Validation:** Must contain at least one platform, no duplicates
- **Example:** `"platforms": ["cursor", "claude", "gemini"]`

#### `description`
- **Type:** `string`
- **Required:** No (in universal schema only)
- **Description:** Human-readable server description
- **Example:** `"description": "Provides access to documentation"`

### STDIO Server Fields

#### `command`
- **Type:** `string`
- **Required:** Yes (for stdio type)
- **Description:** Executable command or path
- **Common Values:**
  - `"npx"` - Run npm packages
  - `"node"` - Run Node.js scripts
  - `"python"` - Run Python scripts
  - `"/absolute/path/to/binary"` - Run local binary
- **Example:** `"command": "npx"`

#### `args`
- **Type:** `array<string>`
- **Required:** No
- **Default:** `[]`
- **Description:** Command-line arguments
- **Example:** `"args": ["-y", "@upstash/context7-mcp"]`

#### `env`
- **Type:** `object<string, string>`
- **Required:** No
- **Default:** `{}`
- **Description:** Environment variables
- **Key Format:** Uppercase with underscores (e.g., `API_KEY`)
- **Value Format:** String or environment variable reference
- **Example:**
  ```json
  "env": {
    "CONTEXT7_API_KEY": "${env:CONTEXT7_API_KEY}",
    "DEBUG": "true"
  }
  ```

### HTTP Server Fields

#### `url` / `serverUrl`
- **Type:** `string` (URI format)
- **Required:** Yes (for http type)
- **Description:** Server endpoint URL
- **Field Name:**
  - `url` for Claude, Cursor, Gemini
  - `serverUrl` for Antigravity
- **Format:** Must be valid HTTP/HTTPS URL
- **Example:** `"url": "https://api.example.com/mcp"`

#### `headers`
- **Type:** `object<string, string>`
- **Required:** No
- **Default:** `{}`
- **Description:** HTTP request headers
- **Common Headers:**
  - `Authorization` - Authentication token
  - `Content-Type` - Request content type
  - `X-Custom-Header` - Custom headers
- **Example:**
  ```json
  "headers": {
    "Authorization": "${env:API_TOKEN}",
    "X-Client-Version": "1.0.0"
  }
  ```

### Gemini-Specific Fields

#### `experimental`
- **Type:** `object`
- **Required:** No
- **Location:** `.gemini/settings.json` only
- **Description:** Experimental feature flags
- **Properties:**
  - `enableAgents` (boolean) - Enable experimental agents
- **Example:**
  ```json
  "experimental": {
    "enableAgents": true
  }
  ```

#### `context`
- **Type:** `object`
- **Required:** No
- **Location:** `.gemini/settings.json` only
- **Description:** Auto-loaded context files
- **Properties:**
  - `fileName` (array<string>) - List of markdown files
- **Example:**
  ```json
  "context": {
    "fileName": ["AGENTS.md", "CONTEXT.md"]
  }
  ```

---

## Environment Variables

Environment variables provide secure, dynamic configuration without hardcoding sensitive values.

### Syntax

**Universal Schema (Recommended):**
```json
{
  "env": {
    "API_KEY": "${env:CONTEXT7_API_KEY}"
  }
}
```

**Platform-Specific:**
- **Claude Code:** `${env:VAR_NAME}`
- **Cursor:** `${env:VAR_NAME}`
- **Gemini CLI:** `${env:VAR_NAME}`
- **Antigravity:** Direct values only (no variable references)

### Setting Environment Variables

**macOS/Linux (bash/zsh):**
```bash
# Temporary (current session)
export CONTEXT7_API_KEY="your-api-key"

# Permanent (add to ~/.bashrc or ~/.zshrc)
echo 'export CONTEXT7_API_KEY="your-api-key"' >> ~/.bashrc
source ~/.bashrc
```

**Windows (PowerShell):**
```powershell
# Temporary (current session)
$env:CONTEXT7_API_KEY = "your-api-key"

# Permanent (user environment)
[System.Environment]::SetEnvironmentVariable('CONTEXT7_API_KEY', 'your-api-key', 'User')
```

**Windows (Command Prompt):**
```cmd
# Temporary (current session)
set CONTEXT7_API_KEY=your-api-key

# Permanent (system-wide, requires admin)
setx CONTEXT7_API_KEY "your-api-key"
```

### Validation

**Check if variable is set:**
```bash
echo $CONTEXT7_API_KEY
```

**Test in configuration:**
```bash
# Claude Code
claude mcp list

# Gemini CLI
gemini /mcp
```

### Security Best Practices

1. **Never commit secrets to version control**
   ```gitignore
   # .gitignore
   .env
   .env.local
   **/secrets.*
   *.key
   ```

2. **Use environment variable references**
   ```json
   ✅ Good: "API_KEY": "${env:CONTEXT7_API_KEY}"
   ❌ Bad:  "API_KEY": "sk-abc123def456"
   ```

3. **Document required variables**
   ```markdown
   ## Required Environment Variables
   - `CONTEXT7_API_KEY` - Get from https://context7.com/dashboard
   ```

4. **Use `.env` files for local development**
   ```bash
   # .env (not committed)
   CONTEXT7_API_KEY=your-api-key
   GITHUB_TOKEN=your-token
   ```

---

## Validation Rules

### Server Name Validation

**Rules:**
- Must match pattern: `^[a-zA-Z0-9_-]+$`
- Alphanumeric characters, hyphens, underscores only
- No spaces or special characters
- Case-sensitive (lowercase recommended)

**Valid:**
```json
✅ "context7"
✅ "my-server"
✅ "tool_v2"
✅ "server123"
```

**Invalid:**
```json
❌ "my server" (space)
❌ "server@home" (special char)
❌ "café" (non-ASCII)
```

### Platform Array Validation

**Rules:**
- Must contain at least one platform
- No duplicate platforms
- Only valid platform names

**Valid:**
```json
✅ ["cursor"]
✅ ["cursor", "claude", "gemini"]
✅ ["antigravity"]
```

**Invalid:**
```json
❌ [] (empty)
❌ ["cursor", "cursor"] (duplicate)
❌ ["vscode"] (invalid platform)
```

### Environment Variable Validation

**Key Rules:**
- Must match pattern: `^[A-Z_][A-Z0-9_]*$`
- Uppercase letters, numbers, underscores only
- Must start with letter or underscore
- Convention: ALL_CAPS_WITH_UNDERSCORES

**Valid Keys:**
```json
✅ "API_KEY"
✅ "CONTEXT7_API_KEY"
✅ "_INTERNAL_VAR"
✅ "DEBUG_LEVEL_2"
```

**Invalid Keys:**
```json
❌ "api-key" (lowercase, hyphen)
❌ "2FA_CODE" (starts with number)
❌ "API.KEY" (contains dot)
```

### URL Validation

**Rules:**
- Must be valid URI format
- Must use http:// or https:// scheme
- Must include domain

**Valid:**
```json
✅ "https://api.example.com/mcp"
✅ "http://localhost:8080/mcp"
✅ "https://example.com:3000/endpoint"
```

**Invalid:**
```json
❌ "api.example.com" (missing scheme)
❌ "ftp://example.com" (wrong scheme)
❌ "/api/endpoint" (relative path)
```

### Type-Specific Validation

**STDIO servers must have:**
- `command` field (string)
- `args` field (optional array)
- `env` field (optional object)

**HTTP servers must have:**
- `url` field (valid URI) OR
- `serverUrl` field (Antigravity only)
- `headers` field (optional object)

### Automated Validation

**Using `jq`:**
```bash
# Validate JSON syntax
jq empty .agents/mcp/mcp-servers.json

# Check required fields
jq '.servers | to_entries[] | select(.value.type == "stdio" and (.value.command | not))' .agents/mcp/mcp-servers.json

# Validate platforms
jq '.servers | to_entries[] | select(.value.platforms | length == 0)' .agents/mcp/mcp-servers.json
```

**Using JSON Schema validator:**
```bash
npm install -g ajv-cli

ajv validate -s schema.json -d .agents/mcp/mcp-servers.json
```

---

## Configuration Examples

### Complete Project Configuration

**Universal source (`.agents/mcp/mcp-servers.json`):**
```json
{
  "version": "1.0",
  "description": "Production MCP servers configuration",
  "_notes": {
    "last_updated": "2026-02-01",
    "maintainer": "DevOps Team"
  },
  "servers": {
    "context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "${env:CONTEXT7_API_KEY}"
      },
      "platforms": ["cursor", "claude", "gemini", "antigravity"],
      "description": "Documentation and code examples"
    },
    "filesystem": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/workspace/data"
      ],
      "platforms": ["cursor", "claude", "gemini"],
      "description": "File system access for data directory"
    },
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${env:GITHUB_TOKEN}"
      },
      "platforms": ["cursor", "claude"],
      "description": "GitHub integration for repository operations"
    },
    "api-gateway": {
      "type": "http",
      "url": "https://api.company.com/mcp",
      "headers": {
        "Authorization": "${env:API_TOKEN}",
        "X-Client-Id": "mcp-client"
      },
      "platforms": ["cursor", "claude", "gemini"],
      "description": "Internal API gateway"
    }
  }
}
```

### Platform-Specific Generated Configs

**Claude Code (`.claude/mcp.json`):**
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
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/workspace/data"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${env:GITHUB_TOKEN}"
      }
    },
    "api-gateway": {
      "url": "https://api.company.com/mcp",
      "headers": {
        "Authorization": "${env:API_TOKEN}",
        "X-Client-Id": "mcp-client"
      }
    }
  }
}
```

**Gemini CLI (`.gemini/settings.json`):**
```json
{
  "experimental": {
    "enableAgents": true
  },
  "context": {
    "fileName": [
      "AGENTS.md",
      "CONTEXT.md"
    ]
  },
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "${env:CONTEXT7_API_KEY}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/workspace/data"
      ]
    },
    "api-gateway": {
      "url": "https://api.company.com/mcp",
      "headers": {
        "Authorization": "${env:API_TOKEN}",
        "X-Client-Id": "mcp-client"
      }
    }
  }
}
```

---

## Migration Guide

### From Individual Platform Configs to Universal Schema

**Step 1: Create universal configuration**

Extract common servers from existing platform configs:

```bash
# Backup existing configs
cp .cursor/mcp.json .cursor/mcp.json.bak
cp .claude/mcp.json .claude/mcp.json.bak
cp .gemini/settings.json .gemini/settings.json.bak
```

**Step 2: Build `.agents/mcp/mcp-servers.json`**

```json
{
  "version": "1.0",
  "description": "Migrated from individual platform configs",
  "servers": {
    "server-name": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "package-name"],
      "env": {
        "API_KEY": "${env:API_KEY}"
      },
      "platforms": ["cursor", "claude", "gemini"],
      "description": "Server description"
    }
  }
}
```

**Step 3: Run sync script**

```bash
./.agents/mcp/sync-mcp.sh
```

**Step 4: Verify generated configs**

```bash
# Check generated files
diff .cursor/mcp.json.bak .cursor/mcp.json
diff .claude/mcp.json.bak .claude/mcp.json

# Test with platforms
claude mcp list
```

**Step 5: Commit changes**

```bash
git add .agents/mcp/mcp-servers.json
git add .cursor/mcp.json .claude/mcp.json .gemini/settings.json
git commit -m "feat: Migrate to universal MCP configuration"
```

### Migrating HTTP Servers

**Old format (platform-specific):**
```json
{
  "mcpServers": {
    "api": {
      "url": "https://api.example.com",
      "headers": {
        "Authorization": "Bearer token123"
      }
    }
  }
}
```

**New format (universal):**
```json
{
  "servers": {
    "api": {
      "type": "http",
      "url": "https://api.example.com",
      "headers": {
        "Authorization": "${env:API_TOKEN}"
      },
      "platforms": ["cursor", "claude", "gemini"],
      "description": "API service"
    }
  }
}
```

### Migrating Environment Variables

**Old (hardcoded):**
```json
{
  "env": {
    "API_KEY": "sk-abc123def456"
  }
}
```

**New (environment reference):**
```json
{
  "env": {
    "API_KEY": "${env:CONTEXT7_API_KEY}"
  }
}
```

Set in shell:
```bash
export CONTEXT7_API_KEY="sk-abc123def456"
```

### Adding Antigravity Support

Antigravity requires **global configuration only**:

1. **Extract servers targeting Antigravity:**
   ```json
   {
     "servers": {
       "context7": {
         "platforms": ["antigravity"]
       }
     }
   }
   ```

2. **Manually configure globally:**
   ```bash
   mkdir -p ~/.gemini/antigravity
   ```

3. **Create `~/.gemini/antigravity/mcp_config.json`:**
   ```json
   {
     "mcpServers": {
       "context7": {
         "command": "npx",
         "args": ["-y", "@upstash/context7-mcp"],
         "env": {
           "CONTEXT7_API_KEY": "your-actual-key"
         }
       }
     }
   }
   ```

**Important:** Use actual values, not `${env:...}` syntax for Antigravity.

### Version Updates

**From pre-1.0 to 1.0:**

Add version field:
```json
{
  "version": "1.0",
  "servers": { ... }
}
```

**Future version migrations:**

Check release notes for breaking changes and migration guides.

---

## Related Documentation

- [MCP Setup Guide](../../guides/mcp/mcp-setup-guide.md)
- [Platform-Specific Guides](../04-platform-guides/)
- [Creating Custom Servers](../03-creating-servers/)
- [Troubleshooting](../05-advanced/troubleshooting.md)

---

**Last Updated:** 2026-02-01
**Schema Version:** 1.0
