# Tool Filtering

Learn how to control which MCP tools are available using allowlists, blocklists, pattern matching, and dynamic loading strategies for optimal performance and security.

## Overview

Tool filtering allows you to control which tools from an MCP server are available to the AI model. This is essential for:

- **Performance:** Reduce context window usage by loading only needed tools
- **Security:** Restrict access to dangerous or destructive operations
- **User Experience:** Present a cleaner, more focused tool set
- **Compliance:** Enforce organizational policies on tool usage
- **Resource Management:** Minimize memory and processing overhead

When you have servers exposing dozens or hundreds of tools, filtering becomes critical for both functionality and safety.

## Why Filter Tools

### Performance Optimization

**Context Window Management:**
- Each tool definition consumes context window space
- Tool descriptions, parameters, and schemas add up quickly
- Large servers (50+ tools) can consume 10-20% of context
- Filtering reduces this overhead significantly

**Example impact:**
```
Without filtering:
  - 100 tools × 200 tokens average = 20,000 tokens
  - ~10% of 200k context window consumed

With filtering (10 tools):
  - 10 tools × 200 tokens = 2,000 tokens
  - ~1% of context window
```

**Tool Discovery Time:**
- Fewer tools = faster server startup
- Reduced validation overhead
- Quicker tool lookup during execution
- Better responsiveness

### Security Hardening

**Principle of Least Privilege:**
- Only enable tools necessary for the task
- Disable destructive operations by default
- Prevent accidental execution of dangerous commands
- Reduce attack surface

**Common security scenarios:**
```
Read-only analysis task:
  ✅ Include: read_file, search_files, analyze_code
  ❌ Exclude: write_file, delete_file, execute_command

Production environment:
  ✅ Include: list_*, read_*, get_*
  ❌ Exclude: delete_*, update_*, create_*

Untrusted server:
  ✅ Include: specific_safe_tool
  ❌ Exclude: everything else
```

**Preventing accidental damage:**
- Block destructive operations during exploration
- Require explicit enablement for dangerous tools
- Audit trail of enabled capabilities

### User Experience

**Tool Clarity:**
- Focused tool list easier to understand
- Reduced cognitive load for users
- Clear purpose for each enabled tool
- Better discoverability

**Relevant Capabilities:**
- Task-specific tool sets
- Remove unused or irrelevant tools
- Context-aware filtering
- Cleaner command completion

### Organizational Compliance

**Policy Enforcement:**
- Centralized tool restrictions
- Consistent security posture
- Auditable configurations
- Regulatory compliance

**Use cases:**
- Financial services: Block data export tools
- Healthcare: Restrict PII access tools
- Enterprise: Enforce approved tool lists
- Education: Limit file system access

## Platform Support Matrix

| Platform | Include Tools | Exclude Tools | Pattern Matching | Global Filters | Dynamic Loading |
|----------|---------------|---------------|------------------|----------------|-----------------|
| Gemini CLI | ✅ | ✅ | ❌ Exact match | ✅ | ❌ |
| Claude Code | ⚠️ Via permissions | ⚠️ Via permissions | ❌ | ⚠️ Tool Search | ✅ Tool Search |
| Cursor | ❌ | ❌ | ❌ | ❌ | ❌ |
| Antigravity | ⚠️ Unknown | ⚠️ Unknown | ❌ | ❌ | ❌ |

**Legend:**
- ✅ Fully supported
- ⚠️ Partial or alternative approach
- ❌ Not supported

## Allow-List Patterns (Include Tools)

### Basic Allow-List

Explicitly specify which tools to enable from a server.

**Gemini CLI Example:**

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
1. Only `read_file`, `write_file`, and `list_directory` are registered
2. All other tools from the server are ignored
3. AI model only sees the specified tools
4. Unmatched tools don't appear in discovery

**When to use allow-lists:**
- ✅ Security-critical environments
- ✅ Limiting server scope
- ✅ Performance optimization
- ✅ Compliance requirements
- ✅ Controlled rollout of new servers

### Use Cases for Allow-Lists

**Scenario 1: Read-Only Analysis**

```json
{
  "mcpServers": {
    "codeAnalysis": {
      "command": "code-server",
      "includeTools": [
        "read_file",
        "search_files",
        "list_directory",
        "analyze_syntax",
        "find_references"
      ]
    }
  }
}
```

**Benefits:**
- No risk of accidental modifications
- Safe for production analysis
- Clear intent: read-only operations

**Scenario 2: Restricted API Access**

```json
{
  "mcpServers": {
    "github": {
      "command": "github-mcp",
      "includeTools": [
        "github_list_issues",
        "github_get_issue",
        "github_search_code"
      ]
    }
  }
}
```

**Benefits:**
- Cannot create or modify resources
- Query-only access to GitHub
- Prevents accidental issue creation

**Scenario 3: Gradual Server Adoption**

```json
{
  "mcpServers": {
    "newServer": {
      "command": "experimental-server",
      "includeTools": [
        "safe_tool_1",
        "safe_tool_2"
      ]
    }
  }
}
```

**Adoption path:**
1. Start with 2-3 verified safe tools
2. Test in development environment
3. Gradually expand allow-list
4. Eventually enable all tools once verified

### Allow-List Best Practices

**1. Start Restrictive, Expand Gradually**

```json
// Phase 1: Minimal permissions
"includeTools": ["read_only_tool"]

// Phase 2: After validation
"includeTools": ["read_only_tool", "safe_write_tool"]

// Phase 3: Full capabilities
"includeTools": null  // Enable all
```

**2. Document Why Tools Are Included**

```json
{
  "mcpServers": {
    "database": {
      "command": "db-server",
      // Allow read-only query tools for analytics dashboard
      "includeTools": [
        "query_data",      // Read customer metrics
        "generate_report"  // Create PDF reports
      ]
    }
  }
}
```

**3. Group Related Tools**

```json
{
  "mcpServers": {
    "fileOps": {
      "command": "file-server",
      // File reading tools
      "includeTools": [
        "read_file",
        "read_directory",
        "search_content",
        // File metadata tools
        "get_stats",
        "check_exists"
      ]
    }
  }
}
```

**4. Use Environment-Specific Configurations**

```json
// development.json
{
  "includeTools": null  // All tools in dev
}

// production.json
{
  "includeTools": ["read_only_tool_1", "read_only_tool_2"]
}
```

## Block-List Patterns (Exclude Tools)

### Basic Block-List

Block specific tools while enabling all others.

**Gemini CLI Example:**

```json
{
  "mcpServers": {
    "powerfulServer": {
      "command": "server",
      "excludeTools": [
        "delete_all",
        "execute_code",
        "system_command",
        "format_disk"
      ]
    }
  }
}
```

**Behavior:**
1. All tools are registered EXCEPT those in `excludeTools`
2. Blocked tools are invisible to AI model
3. Server still exposes them, but MCP integration filters them out
4. Simpler than listing dozens of allowed tools

**When to use block-lists:**
- ✅ Server with mostly safe tools and few dangerous ones
- ✅ Removing specific destructive operations
- ✅ Compliance-required restrictions
- ✅ Testing without side effects
- ✅ Emergency safety measures

### Use Cases for Block-Lists

**Scenario 1: Remove Destructive Operations**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "file-server",
      "excludeTools": [
        "delete_file",
        "delete_directory",
        "format_volume",
        "remove_all"
      ]
    }
  }
}
```

**Benefits:**
- Preserve all read operations
- Keep safe write operations
- Block only dangerous deletions

**Scenario 2: Compliance Restrictions**

```json
{
  "mcpServers": {
    "dataAccess": {
      "command": "data-server",
      "excludeTools": [
        "export_user_data",       // GDPR compliance
        "export_financial_data",  // PCI compliance
        "backup_to_external",     // Data residency
        "email_data_dump"         // Privacy policy
      ]
    }
  }
}
```

**Benefits:**
- Enforce regulatory requirements
- Prevent data exfiltration
- Auditable compliance

**Scenario 3: Testing Safety**

```json
{
  "mcpServers": {
    "productionAPI": {
      "command": "api-server",
      "excludeTools": [
        "create_order",      // No test orders in prod
        "charge_payment",    // No real transactions
        "send_email",        // No test emails
        "trigger_webhook"    // No side effects
      ]
    }
  }
}
```

**Benefits:**
- Safe production testing
- Read-only operations allowed
- No accidental side effects

**Scenario 4: Security Incident Response**

```json
{
  "mcpServers": {
    "compromised": {
      "command": "suspect-server",
      "excludeTools": [
        "execute_*",      // Block all execution
        "delete_*",       // Block all deletions
        "update_*",       // Block all updates
        "create_*"        // Block all creates
      ]
    }
  }
}
```

**Emergency restriction:**
- Quickly disable dangerous operations
- Keep read-only access for investigation
- Prevent further damage

### Block-List Best Practices

**1. Be Specific About Blocked Tools**

```json
// Good: Explicit and documented
"excludeTools": [
  "delete_user",      // Prevents accidental user deletion
  "purge_cache",      // Cache should persist during analysis
  "reset_database"    // Catastrophic operation
]

// Bad: Vague
"excludeTools": ["dangerous_tool"]
```

**2. Document WHY Tools Are Blocked**

```json
{
  "mcpServers": {
    "api": {
      "command": "api-server",
      // Block write operations during read-only analysis phase
      "excludeTools": [
        "create_record",   // Analysis only, no modifications
        "update_record",   // Analysis only, no modifications
        "delete_record"    // Analysis only, no modifications
      ]
    }
  }
}
```

**3. Review Regularly**

```json
// Add review date comment
{
  "excludeTools": [
    "experimental_tool"  // TODO: Review after Q1 2026 testing
  ]
}
```

**4. Prefer Block-Lists for Large Tool Sets**

```
If server has 50 tools and you want to block 3:
  ✅ Use excludeTools: ["tool1", "tool2", "tool3"]
  ❌ Don't use includeTools: [47 tools listed...]

If server has 50 tools and you want to enable 5:
  ✅ Use includeTools: ["tool1", ..., "tool5"]
  ❌ Don't use excludeTools: [45 tools listed...]
```

## Combining Allow-Lists and Block-Lists

### Filter Priority Rules

When both `includeTools` and `excludeTools` are specified:

**Processing order:**
1. Apply `includeTools` filter (allowlist)
2. Apply `excludeTools` filter (blocklist)
3. Result: Tools matching allow-list EXCEPT those in block-list

**Gemini CLI Example:**

```json
{
  "mcpServers": {
    "database": {
      "command": "db-server",
      "includeTools": [
        "read_users",
        "read_orders",
        "read_analytics",
        "read_sensitive_data"
      ],
      "excludeTools": [
        "read_sensitive_data"
      ]
    }
  }
}
```

**Result:**
- ✅ Enabled: `read_users`, `read_orders`, `read_analytics`
- ❌ Blocked: `read_sensitive_data` (blocked by exclude)
- ❌ Blocked: All other tools (not in include)

### Use Cases for Combined Filtering

**Scenario 1: Category-Based with Exceptions**

```json
{
  "mcpServers": {
    "files": {
      "command": "file-server",
      // Include all read operations
      "includeTools": [
        "read_file",
        "read_directory",
        "search_files",
        "read_metadata",
        "read_system_file"
      ],
      // But exclude system file reading
      "excludeTools": [
        "read_system_file"
      ]
    }
  }
}
```

**Result:** All read tools except `read_system_file`

**Scenario 2: Broad Access with Safety Blocks**

```json
{
  "mcpServers": {
    "devTools": {
      "command": "dev-server",
      // Include all development tools
      "includeTools": [
        "git_*",
        "npm_*",
        "docker_*",
        "test_*"
      ],
      // But exclude destructive operations
      "excludeTools": [
        "git_force_push",
        "docker_remove_all",
        "npm_uninstall_all"
      ]
    }
  }
}
```

**Scenario 3: Temporary Override**

```json
{
  "mcpServers": {
    "api": {
      "command": "api-server",
      // Normal: Enable all read/write tools
      "includeTools": [
        "read_data",
        "write_data",
        "update_data",
        "delete_data"
      ],
      // Temporary: Disable write during migration
      "excludeTools": [
        "write_data",
        "update_data",
        "delete_data"
      ]
    }
  }
}
```

### Combined Filtering Best Practices

**1. Keep It Simple When Possible**

```json
// Prefer single filter when sufficient
// Good: Simple block-list
{
  "excludeTools": ["dangerous_tool"]
}

// Avoid: Unnecessary complexity
{
  "includeTools": ["safe1", "safe2", "...", "safe50"],
  "excludeTools": ["dangerous_tool"]
}
```

**2. Use Comments to Explain Logic**

```json
{
  "mcpServers": {
    "complex": {
      "command": "server",
      // Include all file operations
      "includeTools": [
        "read_*",
        "write_*",
        "list_*"
      ],
      // But exclude operations on system directories
      "excludeTools": [
        "read_system",
        "write_system",
        "list_system"
      ]
    }
  }
}
```

**3. Test Filter Combinations**

```bash
# Verify which tools are available
gemini mcp list

# Or check in conversation
/mcp
# Look for "Available tools" section
```

## Pattern Matching and Wildcards

### Current State

**Limited pattern support** across platforms:

| Platform | Wildcards | Regex | Prefix Match | Exact Match |
|----------|-----------|-------|--------------|-------------|
| Gemini CLI | ❌ | ❌ | ❌ | ✅ |
| Claude Code | ❌ | ❌ | ❌ | ✅ Via permissions |
| Cursor | ❌ | ❌ | ❌ | ❌ |

**Note:** Despite examples showing `*` patterns in documentation, current implementations require exact tool name matches.

### Exact Matching (Current Standard)

**Gemini CLI - List each tool explicitly:**

```json
{
  "mcpServers": {
    "github": {
      "command": "github-server",
      "includeTools": [
        "github_list_issues",
        "github_list_pull_requests",
        "github_list_repositories",
        "github_list_branches",
        "github_list_commits"
      ]
    }
  }
}
```

**Cannot use:**
```json
// These patterns don't work (yet)
"includeTools": ["github_list_*"]
"includeTools": ["github_*"]
"includeTools": ["*_list_*"]
```

### Workarounds for Pattern-Like Filtering

**1. Server-Side Tool Grouping**

Configure the server to expose only certain tool categories:

```bash
# Server with built-in filtering
github-server --tools=list,read

# Results in server exposing:
# - list_issues, list_prs, list_repos
# - read_issue, read_pr, read_repo
```

**2. Multiple Server Instances**

Run same server multiple times with different configurations:

```json
{
  "mcpServers": {
    "github-read": {
      "command": "github-server",
      "args": ["--mode=read"],
      // Server only exposes read tools
      "includeTools": null
    },
    "github-write": {
      "command": "github-server",
      "args": ["--mode=write"],
      // Server only exposes write tools
      "includeTools": null
    }
  }
}
```

**3. Pre-Processing Scripts**

Wrapper script filters tools before MCP integration:

```bash
#!/bin/bash
# github-filtered.sh

# Start server with all tools
github-server | \
  jq '.result.tools[] |= select(.name | startswith("github_list_"))'
```

```json
{
  "mcpServers": {
    "github-filtered": {
      "command": "./github-filtered.sh"
    }
  }
}
```

### Future Pattern Support (Proposed)

**Potential wildcard syntax:**

```json
// Future feature - not currently supported
{
  "includeTools": [
    "github_list_*",      // All list operations
    "github_get_*",       // All get operations
    "*_read_*"            // All read operations from any service
  ],
  "excludeTools": [
    "*_delete_*",         // Block all delete operations
    "*_admin_*"           // Block all admin operations
  ]
}
```

**Potential regex support:**

```json
// Future feature - not currently supported
{
  "includeTools": {
    "pattern": "^github_(list|get)_.*$"
  }
}
```

## Platform-Specific Filtering Mechanisms

### Gemini CLI Tool Filtering

**Configuration:**

```json
{
  "mcpServers": {
    "serverName": {
      "command": "server",
      "includeTools": ["tool1", "tool2"],
      "excludeTools": ["tool3"]
    }
  }
}
```

**Discovery process:**
1. CLI connects to server
2. Server returns all available tools
3. CLI applies `includeTools` filter
4. CLI applies `excludeTools` filter
5. Filtered tools registered with conflict resolution
6. Only filtered tools available to AI model

**Global filtering:**

```json
{
  "mcp": {
    "allowed": ["read_*", "list_*"],
    "excluded": ["delete_*", "admin_*"]
  },
  "mcpServers": {
    "server1": { "command": "server1" },
    "server2": { "command": "server2" }
  }
}
```

**Behavior:**
- Global filters apply to ALL servers
- Server-specific filters override global
- Useful for organization-wide policies

**CLI commands:**

```bash
# View available tools
gemini mcp list

# View specific server
gemini mcp get serverName

# Check tool availability in session
/mcp
```

### Claude Code Tool Search

**Automatic filtering based on context window usage.**

**How it works:**
1. **Threshold Detection:** When tool descriptions exceed 10% of context window
2. **Lazy Loading:** Tools are NOT preloaded into context
3. **Search-Based Discovery:** AI uses `MCPSearch` tool to find relevant tools
4. **Dynamic Loading:** Only needed tools loaded into context

**Configuration:**

```bash
# Default: Auto mode (10% threshold)
claude

# Custom threshold (5%)
ENABLE_TOOL_SEARCH=auto:5 claude

# Always enable
ENABLE_TOOL_SEARCH=true claude

# Disable (preload all tools)
ENABLE_TOOL_SEARCH=false claude
```

**In settings.json:**

```json
{
  "env": {
    "ENABLE_TOOL_SEARCH": "auto:5"
  }
}
```

**Disable tool search:**

```json
{
  "permissions": {
    "deny": ["MCPSearch"]
  }
}
```

**Best practices for server authors:**

Add clear server instructions to improve tool discovery:

```typescript
// Server configuration
export const server = new Server({
  name: "database-tools",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {},
    // Add instructions for tool search
    instructions: `
This server provides database query and analysis tools.

Use these tools when you need to:
- Query databases (PostgreSQL, MySQL, SQLite)
- Analyze database schemas
- Generate SQL queries
- Inspect table structures

Available tool categories:
- query_* : Execute database queries
- analyze_* : Analyze schemas and data
- list_* : List databases, tables, columns
    `
  }
});
```

**Model support:**
- ✅ Sonnet 4 and later
- ✅ Opus 4 and later
- ❌ Haiku models (no `tool_reference` support)

### Claude Code Permissions

**Alternative filtering approach using permissions system.**

**Deny specific tools:**

```json
{
  "permissions": {
    "deny": [
      "MCPSearch",
      "github_delete_repository",
      "filesystem_delete_all"
    ]
  }
}
```

**Behavior:**
- Tools are still discovered
- Denied tools cannot be executed
- AI model sees tools but gets error on use
- Less efficient than includeTools/excludeTools

**Use cases:**
- Quick emergency blocks
- User-level restrictions
- Runtime security enforcement

### Cursor Tool Management

**Manual server enable/disable only.**

**Through Settings UI:**
1. Open Settings (`Cmd+Shift+J`)
2. Navigate to Features → Model Context Protocol
3. Toggle servers on/off

**Behavior:**
- Disabled servers don't load
- All tools from enabled servers are available
- No per-tool filtering support
- Server-level granularity only

**Workaround for tool filtering:**

Run server with tool-specific configuration:

```json
{
  "mcpServers": {
    "github-readonly": {
      "command": "github-server",
      "args": ["--readonly"]
    }
  }
}
```

Server itself limits exposed tools based on `--readonly` flag.

### Antigravity Tool Filtering

**Status:** Unknown (documentation limited)

**Likely approaches:**
- Global MCP configuration at `~/.gemini/antigravity/mcp_config.json`
- May inherit Gemini CLI patterns
- Server-level management only

**Requires verification** through Antigravity-specific documentation.

## Dynamic Tool Loading

### Tool Search in Claude Code

**Purpose:** Reduce context window usage for servers with many tools.

**Mechanism:**
1. **Defer tool loading:** Tools not preloaded into context
2. **Search-based discovery:** AI searches for relevant tools when needed
3. **Selective loading:** Only matching tools loaded into context
4. **Seamless execution:** Tools work normally once loaded

**Configuration:**

```bash
# Environment variable
export ENABLE_TOOL_SEARCH=auto:5
claude

# Or in settings.json
{
  "env": {
    "ENABLE_TOOL_SEARCH": "auto:10"
  }
}
```

**Options:**

| Value | Behavior |
|-------|----------|
| `auto` | Activate when tools exceed 10% of context |
| `auto:<N>` | Activate at custom threshold (e.g., `auto:5` = 5%) |
| `true` | Always enabled |
| `false` | Disabled, all tools preloaded |

**Example scenario:**

```
Server exposes 100 tools (20,000 tokens of descriptions)

Without tool search:
  - All 100 tools loaded upfront
  - 20,000 tokens consumed immediately
  - 10% of 200k context used

With tool search (threshold: 10%):
  - MCPSearch tool loaded (200 tokens)
  - AI searches when it needs database tools
  - Finds and loads 3 relevant tools (600 tokens)
  - Only 800 tokens used (0.4% of context)
```

**Benefits:**
- ✅ Dramatically reduced context usage
- ✅ Faster startup (no tool validation)
- ✅ Better scalability (100+ tool servers)
- ✅ Improved performance

**Tradeoffs:**
- ⚠️ Extra search step before tool use
- ⚠️ Requires good tool descriptions
- ⚠️ Depends on model support (Sonnet 4+)

### Optimizing for Tool Search

**1. Write Clear Tool Descriptions**

```typescript
// Good: Detailed, keyword-rich description
export const queryDatabaseTool = {
  name: "database_query_postgres",
  description: `
Execute SQL queries against PostgreSQL database.
Use for: SELECT queries, data analysis, report generation,
finding records, aggregations, joins, filtering data.
Supports: WHERE, GROUP BY, ORDER BY, LIMIT clauses.
  `.trim()
};

// Bad: Vague description
export const queryDatabaseTool = {
  name: "database_query_postgres",
  description: "Query database"
};
```

**2. Add Rich Server Instructions**

```typescript
export const server = new Server({
  name: "database",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {},
    instructions: `
This server provides comprehensive database operations.

# Query Operations
Use query_* tools for:
- SELECT data retrieval
- Complex joins and aggregations
- Filtering and searching records
- Report generation

# Schema Operations
Use schema_* tools for:
- Inspecting table structures
- Viewing column definitions
- Understanding relationships

# Analysis Operations
Use analyze_* tools for:
- Data quality checks
- Statistical analysis
- Performance insights
    `
  }
});
```

**3. Use Semantic Tool Names**

```typescript
// Good: Clear semantic names
"database_query_users_by_email"
"database_analyze_sales_trends"
"database_list_active_sessions"

// Bad: Unclear names
"db_q1"
"analyze_v2"
"list_things"
```

### Other Dynamic Approaches

**1. Lazy Server Initialization**

Load servers only when first tool is needed:

```typescript
// Pseudo-code
class ServerManager {
  async getTool(toolName: string) {
    const serverName = extractServerName(toolName);

    if (!this.loadedServers.has(serverName)) {
      await this.loadServer(serverName);
    }

    return this.tools.get(toolName);
  }
}
```

**2. Tool Demand Tracking**

Track which tools are actually used:

```typescript
// Analytics
{
  "github_list_issues": { "calls": 45, "last_used": "2026-02-01" },
  "github_create_issue": { "calls": 2, "last_used": "2026-01-15" },
  "github_delete_repo": { "calls": 0, "last_used": null }
}

// Auto-disable unused tools
if (tool.calls === 0 && daysSince(tool.last_used) > 30) {
  disableTool(tool.name);
}
```

**3. Context-Aware Filtering**

Adjust available tools based on conversation context:

```typescript
// Pseudo-code
if (conversationAbout("code analysis")) {
  enableTools(["read_*", "search_*", "analyze_*"]);
  disableTools(["write_*", "delete_*"]);
}

if (conversationAbout("deployment")) {
  enableTools(["deploy_*", "rollback_*", "monitor_*"]);
}
```

## Tool Search and Discovery Optimization

### Improving Tool Discoverability

**1. Descriptive Tool Names**

```typescript
// Excellent: Self-documenting
"github_create_issue_with_labels"
"database_query_users_by_email_pattern"
"filesystem_search_files_by_content"

// Good: Clear action and target
"github_create_issue"
"database_query_users"
"filesystem_search_files"

// Poor: Too generic
"create"
"query"
"search"
```

**2. Rich Descriptions**

```typescript
export const createIssueTool = {
  name: "github_create_issue",
  description: `
Create a new issue in a GitHub repository.

Use this tool when you need to:
- Report bugs or problems
- Request new features
- Track tasks and work items
- Document technical debt
- Create discussion threads

Parameters:
- repository: owner/repo format (e.g., "facebook/react")
- title: Brief, descriptive issue title
- body: Detailed markdown description
- labels: Optional tags like "bug", "enhancement"
- assignees: Optional GitHub usernames to assign

Returns:
- Issue number and URL
- Created timestamp
- Full issue metadata

Example:
Create an issue in "myorg/myrepo" with title "Fix login bug"
and labels ["bug", "priority-high"]
  `.trim()
};
```

**3. Categorized Tool Groups**

```typescript
// Group related tools with prefixes
const tools = [
  // Read operations
  "github_read_issue",
  "github_read_pull_request",
  "github_read_repository",

  // List operations
  "github_list_issues",
  "github_list_pull_requests",
  "github_list_repositories",

  // Create operations
  "github_create_issue",
  "github_create_pull_request",
  "github_create_repository",
];
```

### Server Organization Strategies

**1. Single-Purpose Servers**

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
    "github-prs": {
      "command": "github-mcp",
      "args": ["--focus=pull-requests"]
    }
  }
}
```

**Benefits:**
- Clear separation of concerns
- Easier to enable/disable functionality
- Better tool organization
- Simpler filtering

**2. Layered Server Architecture**

```json
{
  "mcpServers": {
    // Core read-only layer
    "data-read": {
      "command": "data-server",
      "args": ["--mode=read"],
      "trust": true
    },

    // Write operations layer
    "data-write": {
      "command": "data-server",
      "args": ["--mode=write"],
      "trust": false
    },

    // Admin operations layer
    "data-admin": {
      "command": "data-server",
      "args": ["--mode=admin"],
      "trust": false,
      "includeTools": ["backup", "restore"]
    }
  }
}
```

**3. Feature-Gated Tools**

```typescript
// Server-side feature flags
const tools = [
  createTool({
    name: "experimental_feature",
    enabled: process.env.ENABLE_EXPERIMENTAL === "true"
  }),
  createTool({
    name: "beta_feature",
    enabled: process.env.ENABLE_BETA === "true"
  })
];
```

### Performance Monitoring

**Track tool usage metrics:**

```typescript
interface ToolMetrics {
  name: string;
  calls: number;
  avgDuration: number;
  lastUsed: Date;
  errors: number;
  contextTokens: number;
}

function shouldKeepTool(tool: ToolMetrics): boolean {
  // Remove if never used in 30 days
  if (tool.calls === 0 && daysSince(tool.lastUsed) > 30) {
    return false;
  }

  // Remove if high error rate
  if (tool.errors / tool.calls > 0.5) {
    return false;
  }

  // Remove if too expensive (context-wise)
  if (tool.contextTokens > 5000) {
    return false;
  }

  return true;
}
```

## Best Practices for Tool Organization

### Design Principles

**1. Principle of Least Privilege**

```json
// Start with minimal access
{
  "includeTools": ["read_only_tool"]
}

// Gradually expand as needed
{
  "includeTools": ["read_only_tool", "safe_write_tool"]
}

// Full access only when verified
{
  "includeTools": null
}
```

**2. Explicit Over Implicit**

```json
// Good: Clear intent
{
  "includeTools": [
    "read_users",      // Read customer data
    "read_orders",     // Read order history
    "generate_report"  // Create analytics
  ]
}

// Bad: Unclear what's enabled
{
  "includeTools": null,  // Everything? What tools exist?
  "excludeTools": ["some_tool"]  // Why blocked?
}
```

**3. Documentation as Code**

```json
{
  "mcpServers": {
    "production": {
      "command": "api-server",
      // Production policy: read-only during business hours
      // Full access during maintenance windows
      // See: docs/operations/mcp-policies.md
      "includeTools": ["read_*", "list_*"],
      "excludeTools": ["delete_*", "update_*"]
    }
  }
}
```

### Configuration Management

**1. Environment-Specific Configs**

```
project/
├── .gemini/
│   ├── settings.json            # Default/development
│   ├── settings.production.json # Production restrictions
│   ├── settings.staging.json    # Staging environment
│   └── settings.test.json       # Test automation
```

**2. Version Control**

```bash
# Commit configurations (without secrets)
git add .gemini/settings*.json
git commit -m "feat: Add tool filtering for production"

# Document in README
echo "## MCP Configuration" >> README.md
echo "- Development: All tools enabled" >> README.md
echo "- Production: Read-only tools only" >> README.md
```

**3. Template Configurations**

```json
// template-readonly.json
{
  "mcpServers": {
    "__SERVER_NAME__": {
      "command": "__COMMAND__",
      "includeTools": ["read_*", "list_*", "get_*"],
      "excludeTools": ["delete_*", "create_*", "update_*"]
    }
  }
}
```

### Testing Tool Filters

**1. Verify Available Tools**

```bash
# Gemini CLI
gemini mcp list

# Claude Code (in conversation)
/mcp

# Check specific server
gemini mcp get serverName
```

**2. Test Tool Execution**

```bash
# Try executing filtered tool
# Should fail if blocked
gemini "Use blocked_tool to do something"
# Expected: Error or tool not found

# Try executing allowed tool
# Should succeed
gemini "Use allowed_tool to do something"
# Expected: Tool executes successfully
```

**3. Automated Tests**

```typescript
// Test tool filtering
describe('Tool Filtering', () => {
  it('blocks excluded tools', async () => {
    const config = {
      excludeTools: ['dangerous_tool']
    };

    const tools = await discoverTools(config);

    expect(tools.map(t => t.name)).not.toContain('dangerous_tool');
  });

  it('includes only allowed tools', async () => {
    const config = {
      includeTools: ['safe_tool_1', 'safe_tool_2']
    };

    const tools = await discoverTools(config);

    expect(tools).toHaveLength(2);
    expect(tools.map(t => t.name)).toEqual(['safe_tool_1', 'safe_tool_2']);
  });
});
```

## Security Implications

### Security Benefits of Filtering

**1. Attack Surface Reduction**

```json
{
  "mcpServers": {
    "untrustedServer": {
      "command": "third-party-server",
      // Only enable absolutely necessary tools
      "includeTools": ["read_public_data"],
      // Block everything else
      "excludeTools": [
        "write_*",
        "delete_*",
        "execute_*",
        "admin_*"
      ]
    }
  }
}
```

**2. Defense in Depth**

```json
{
  "mcpServers": {
    "production": {
      "command": "prod-server",
      // Layer 1: Server runs with minimal permissions
      "env": {
        "DB_USER": "readonly_user"
      },
      // Layer 2: MCP filtering blocks destructive tools
      "excludeTools": ["delete_*", "drop_*", "truncate_*"],
      // Layer 3: No automatic trust
      "trust": false
    }
  }
}
```

**3. Compliance Enforcement**

```json
{
  "mcpServers": {
    "customerData": {
      "command": "crm-server",
      // GDPR: No data export without explicit approval
      "excludeTools": [
        "export_users",
        "export_contacts",
        "export_to_csv",
        "email_data"
      ],
      // PCI: No credit card operations
      "excludeTools": [
        "read_payment_methods",
        "charge_card",
        "refund_payment"
      ]
    }
  }
}
```

### Security Risks to Avoid

**1. Over-Trusting Filtered Servers**

```json
// DANGEROUS: Trust + filtering
{
  "command": "powerful-server",
  "trust": true,        // ⚠️ Bypasses all confirmations
  "excludeTools": ["delete_all"]  // ⚠️ Only blocks one tool
}
```

**Problem:** If filtering fails or is bypassed, server has unchecked access.

**Better approach:**

```json
{
  "command": "powerful-server",
  "trust": false,       // ✅ Require confirmations
  "excludeTools": ["delete_all"]
}
```

**2. Inadequate Filtering**

```json
// INSUFFICIENT: Blocks obvious tools but misses alternatives
{
  "excludeTools": ["delete_user"]  // ⚠️ What about remove_user, purge_user?
}
```

**Better approach:**

```json
{
  "includeTools": ["read_user", "list_users"]  // ✅ Explicit allowlist
}
```

**3. Sensitive Tool Exposure**

```json
// RISKY: Admin tools available in production
{
  "includeTools": [
    "read_data",
    "write_data",
    "admin_reset_database"  // ⚠️ Should not be available
  ]
}
```

**Better approach:**

```json
// Production: read-only
{
  "includeTools": ["read_data"]
}

// Admin: separate server with strict access control
{
  "admin-tools": {
    "command": "admin-server",
    "includeTools": ["admin_reset_database"],
    "trust": false
  }
}
```

### Security Audit Checklist

- [ ] Review all enabled tools
- [ ] Document why each tool is needed
- [ ] Test that excluded tools are actually blocked
- [ ] Verify trust settings are appropriate
- [ ] Check for alternative tool names (delete vs remove vs purge)
- [ ] Ensure sensitive operations require confirmation
- [ ] Validate environment variable usage
- [ ] Review server permissions and access levels
- [ ] Test failure scenarios (blocked tool attempts)
- [ ] Monitor tool usage and audit logs

## Examples Across Platforms

### Gemini CLI Complete Example

```json
{
  "mcpServers": {
    // Development: Full access
    "dev-api": {
      "command": "python",
      "args": ["-m", "api_server", "--dev"],
      "env": {
        "DEBUG": "true",
        "API_KEY": "$DEV_API_KEY"
      },
      "trust": true,
      "includeTools": null
    },

    // Production: Read-only with specific tools
    "prod-api": {
      "command": "python",
      "args": ["-m", "api_server", "--prod"],
      "env": {
        "API_KEY": "$PROD_API_KEY"
      },
      "trust": false,
      "includeTools": [
        "query_data",
        "generate_report",
        "list_records"
      ],
      "excludeTools": [
        "query_admin_data"
      ]
    },

    // GitHub: Limited operations
    "github": {
      "command": "npx",
      "args": ["-y", "github-mcp-server"],
      "env": {
        "GITHUB_TOKEN": "$GITHUB_TOKEN"
      },
      "includeTools": [
        "github_list_issues",
        "github_get_issue",
        "github_create_issue",
        "github_update_issue"
      ],
      "excludeTools": [
        "github_delete_repository"
      ]
    },

    // Filesystem: Safe operations only
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem"],
      "includeTools": [
        "read_file",
        "list_directory",
        "search_files"
      ],
      "excludeTools": [
        "write_file",
        "delete_file",
        "delete_directory"
      ]
    }
  }
}
```

### Claude Code Complete Example

```json
{
  "env": {
    // Enable tool search for large servers
    "ENABLE_TOOL_SEARCH": "auto:5"
  },
  "permissions": {
    // Block specific dangerous tools
    "deny": [
      "filesystem_delete_all",
      "database_drop_table",
      "github_delete_repository"
    ]
  }
}
```

**With tool search, server instructions are critical:**

```typescript
export const server = new Server({
  name: "comprehensive-tools",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {},
    instructions: `
This server provides 150+ tools across multiple categories.

# When to use this server:
- File operations: Use filesystem_* tools
- Database queries: Use database_* tools
- GitHub operations: Use github_* tools
- Cloud services: Use cloud_* tools

# Tool naming convention:
- service_action_target pattern
- Examples: github_create_issue, database_query_users

# Safety notes:
- All destructive operations require confirmation
- Read operations are marked with readOnlyHint
- Batch operations have built-in limits
    `
  }
});
```

### Multi-Platform Configuration

**Project structure:**

```
project/
├── .cursor/
│   └── mcp.json           # Cursor: Limited filtering via UI
├── .claude/
│   └── settings.json      # Claude Code: Tool search + permissions
└── .gemini/
    └── settings.json      # Gemini CLI: Full filtering support
```

**Cursor (`mcp.json`):**

```json
{
  "mcpServers": {
    "safe-tools": {
      "command": "safe-server",
      // No per-tool filtering
      // Must rely on server-side filtering
      "args": ["--mode=readonly"]
    }
  }
}
```

**Claude Code (`settings.json`):**

```json
{
  "env": {
    "ENABLE_TOOL_SEARCH": "auto:5"
  },
  "permissions": {
    "deny": ["dangerous_tool"]
  }
}
```

**Gemini CLI (`settings.json`):**

```json
{
  "mcpServers": {
    "safe-tools": {
      "command": "safe-server",
      "includeTools": ["read_*", "list_*"],
      "excludeTools": ["admin_*"]
    }
  }
}
```

## Troubleshooting

### Tool Not Appearing

**Symptom:** Expected tool doesn't show up in available tools list.

**Checks:**

1. **Verify tool name is correct:**

```bash
# List all tools from server
gemini mcp get serverName

# Check exact tool names
jq '.tools[] | .name' < server-response.json
```

2. **Check filter configuration:**

```json
{
  "includeTools": ["my_tool"],  // ⚠️ Check spelling
  "excludeTools": ["my_tool"]   // ⚠️ Conflict!
}
```

3. **Test without filters:**

```json
{
  // Temporarily remove filters
  // "includeTools": ["my_tool"],
  // "excludeTools": []
}
```

4. **Check server logs:**

```bash
# Enable debug mode
gemini --debug

# Or check server stderr
server-command 2> error.log
cat error.log
```

### Filter Not Working

**Symptom:** Blocked tool is still available.

**Checks:**

1. **Verify configuration is loaded:**

```bash
# Check active configuration
gemini mcp get serverName

# Should show includeTools/excludeTools
```

2. **Check for multiple server instances:**

```bash
# List all servers
gemini mcp list

# Look for duplicate server names
```

3. **Restart MCP integration:**

```bash
# Gemini CLI: Restart CLI
gemini mcp remove serverName
gemini mcp add ...

# Claude Code: Restart process
# Cursor: Restart application
```

4. **Check tool name conflicts:**

```bash
# Tool might be from different server
# Format: serverName__toolName
github__create_issue  # From github server
gitlab__create_issue  # From gitlab server
```

### Performance Issues

**Symptom:** Slow tool discovery or execution.

**Solutions:**

1. **Enable tool filtering:**

```json
{
  "includeTools": ["tool1", "tool2", "tool3"]
  // Instead of loading all 100 tools
}
```

2. **Use tool search (Claude Code):**

```bash
ENABLE_TOOL_SEARCH=auto:5 claude
```

3. **Increase timeout:**

```json
{
  "timeout": 60000  // 60 seconds
}
```

4. **Monitor metrics:**

```bash
# Check tool usage
gemini --debug 2>&1 | grep "tool_duration"

# Identify slow tools
# Consider excluding or replacing
```

### Security Concerns

**Symptom:** Worried about tool access.

**Actions:**

1. **Audit current tools:**

```bash
# List all available tools
gemini mcp list

# Check each server's tools
gemini mcp get serverName
```

2. **Apply restrictive filtering:**

```json
{
  "includeTools": ["only", "safe", "tools"]
}
```

3. **Disable trust:**

```json
{
  "trust": false  // Require confirmations
}
```

4. **Review server code:**

```bash
# Check what server actually does
cat $(which server-command)

# For npm packages
npm info server-package
```

5. **Use multiple layers:**

```json
{
  "command": "server",
  "args": ["--readonly"],      // Layer 1: Server config
  "includeTools": ["read_*"],  // Layer 2: MCP filtering
  "trust": false,              // Layer 3: User confirmation
  "env": {
    "DB_USER": "readonly"      // Layer 4: System permissions
  }
}
```

## Summary

Tool filtering is essential for:

- **Performance:** Reducing context window usage and improving responsiveness
- **Security:** Limiting access to dangerous operations and enforcing policies
- **User Experience:** Presenting focused, relevant tool sets
- **Compliance:** Meeting organizational and regulatory requirements

**Key takeaways:**

1. **Start restrictive:** Use allowlists when onboarding new servers
2. **Prefer blocklists:** For servers with mostly safe tools
3. **Combine filters:** Use both for fine-grained control
4. **Document intent:** Explain why tools are included/excluded
5. **Test thoroughly:** Verify filters work as expected
6. **Monitor usage:** Track which tools are actually needed
7. **Layer security:** Don't rely on filtering alone

**Platform support varies:**
- Gemini CLI: Full filtering with includeTools/excludeTools
- Claude Code: Tool Search for dynamic loading
- Cursor: Server-level enable/disable only
- Antigravity: Limited documentation

**Best practices:**
- Document all filtering decisions
- Use environment-specific configurations
- Review and update filters regularly
- Test filter effectiveness
- Monitor for blocked tool attempts

## Related Documentation

- [MCP Configuration](../02-using-mcp/installation-overview.md) - General configuration guide
- [Security Best Practices](./security.md) - Security considerations
- [Tool Design](../03-creating-servers/tools-and-schemas.md) - Designing effective tools
- [Gemini CLI Configuration](../04-platform-guides/gemini-cli/configuration.md) - Platform-specific filtering
- [Claude Code Tool Search](../04-platform-guides/claude-code/configuration.md) - Dynamic tool loading

---

**Last Updated:** February 2026
**Applies To:** All MCP platforms
**Complexity:** Intermediate to Advanced
