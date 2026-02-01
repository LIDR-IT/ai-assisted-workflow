# Platform Limitations

Understanding Antigravity's MCP configuration constraints and their implications for project setup and team collaboration.

## Critical Limitation: No Project-Level MCP Support

**Status:** Current platform limitation (as of February 2026)

**Impact:** High - Affects team collaboration and project portability

Antigravity currently **does not support project-level MCP configuration files**. Unlike other platforms (Cursor, Claude Code, Gemini CLI), Antigravity only reads MCP server configurations from user-level (global) locations.

### What Doesn't Work

These configurations are **ignored** by Antigravity:

```
❌ .gemini/mcp_config.json        (project directory)
❌ <project-root>/mcp_config.json  (project root)
❌ .antigravity/mcp_config.json    (project directory)
```

### What Works

Only this configuration location is recognized:

```
✅ ~/.gemini/antigravity/mcp_config.json  (user home directory)
```

**Windows equivalent:**
```
C:\Users\<USERNAME>\.gemini\antigravity\mcp_config.json
```

## Why This Limitation Exists

According to Antigravity's current architecture:

### Architectural Design

- MCP servers are configured at the **user level only**
- No API exists for workspace-specific or project-specific configurations
- All Antigravity sessions share the same global MCP configuration
- The platform prioritizes user-wide tool availability over project isolation

### Development Roadmap

**Current Status:**
- Feature request discussion on [Google AI Forum](https://discuss.ai.google.dev/t/support-for-per-workspace-mcp-config-on-antigravity/111952)
- No official timeline for project-level support
- Community actively requesting this feature

**Tracking:**
- Forum thread active since January 2026
- Multiple users reporting same limitation
- Google team aware of the request

## Comparison with Other Platforms

Understanding how Antigravity differs from other AI development platforms:

### Platform Support Matrix

| Platform | Project-Level | User-Level | Team Collaboration |
|----------|---------------|------------|-------------------|
| **Cursor** | ✅ `.cursor/mcp.json` | ✅ `~/.cursor/mcp.json` | ✅ Git-committed config |
| **Claude Code** | ✅ `.mcp.json` | ✅ `~/.claude.json` | ✅ Git-committed config |
| **Gemini CLI** | ✅ `.gemini/settings.json` | ✅ `~/.gemini/settings.json` | ✅ Git-committed config |
| **Antigravity** | ❌ Not supported | ✅ `~/.gemini/antigravity/mcp_config.json` | ⚠️ Manual setup required |

### Key Differences

**Cursor, Claude Code, and Gemini CLI:**
```bash
# Clone repository
git clone project.git

# MCP servers automatically configured
# Works immediately - no additional setup needed
```

**Antigravity:**
```bash
# Clone repository
git clone project.git

# MCP servers NOT configured
# Manual setup required for each developer
# Must follow documentation to configure ~/.gemini/antigravity/mcp_config.json
```

### Configuration Portability

**Other Platforms:**
- MCP configuration travels with the project
- New team members get servers automatically
- Consistent environment across the team
- One-time setup per project

**Antigravity:**
- MCP configuration stays with the user
- Each developer configures independently
- Potential for inconsistent environments
- Setup required for every new machine

## Impact on Team Collaboration

This limitation creates several challenges for teams using Antigravity:

### 1. Manual Configuration Required

**Problem:** Every team member must manually configure MCP servers.

**Impact:**
- Increased onboarding time
- Higher chance of configuration errors
- Inconsistent tool availability across team

**Example:**
```json
// .gemini/mcp_config.json in project (not read by Antigravity)
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY}"
      }
    }
  }
}
```

Every developer must:
1. Read project documentation
2. Manually copy configuration to `~/.gemini/antigravity/mcp_config.json`
3. Set up required environment variables
4. Verify configuration works

### 2. Documentation Burden

**Problem:** Projects must provide detailed setup instructions.

**Requirements:**
- Document all required MCP servers
- Explain configuration process
- List environment variables needed
- Provide troubleshooting steps

**Example README addition:**
```markdown
## Antigravity Setup

This project uses the following MCP servers:
- **context7**: Documentation access
- **github**: Repository integration
- **database**: PostgreSQL access

### Manual Configuration Required

Antigravity does not support project-level MCP configuration.
Follow [ANTIGRAVITY_SETUP.md](docs/setup/antigravity.md) to configure.
```

### 3. Environment Inconsistencies

**Problem:** Different developers may have different MCP servers configured.

**Scenarios:**
- Developer A has all project servers configured
- Developer B missing some servers
- Developer C has different versions

**Result:**
- AI assistance varies between team members
- Hard to reproduce issues
- Difficult to standardize workflows

### 4. Multi-Project Conflicts

**Problem:** Single global configuration shared across all projects.

**Issues:**

**Scenario 1: Version conflicts**
```
Project A needs: @supabase/mcp-server-supabase@1.0.0
Project B needs: @supabase/mcp-server-supabase@2.0.0
```
Only one version can be globally configured.

**Scenario 2: Configuration overload**
```
~/.gemini/antigravity/mcp_config.json contains:
- Servers for Project A
- Servers for Project B
- Servers for Project C
- Personal utility servers
```
Result: 50+ servers, performance degradation, cluttered interface.

### 5. Security and Access Control

**Problem:** Cannot scope server access to specific projects.

**Concerns:**
- Production credentials in global config
- Development servers always available
- Cannot isolate sensitive project tools
- Risk of using wrong servers in wrong projects

**Example:**
```json
{
  "mcpServers": {
    "prod-database": {
      "env": {
        "DATABASE_URL": "postgresql://prod-server/production"
      }
    },
    "dev-database": {
      "env": {
        "DATABASE_URL": "postgresql://dev-server/development"
      }
    }
  }
}
```
Both available in all projects - risk of accessing production from development session.

## Workarounds and Alternatives

Strategies to mitigate the limitations:

### 1. Reference Configuration File

**Strategy:** Include `.gemini/mcp_config.json` in project as documentation.

**Purpose:**
- Serves as reference for manual setup
- Documents required servers
- Can be copied by developers
- Version controlled

**Implementation:**
```bash
# Create reference file
mkdir -p .gemini
cat > .gemini/mcp_config.json << 'EOF'
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY}"
      }
    }
  }
}
EOF

# Commit to git
git add .gemini/mcp_config.json
git commit -m "docs: add reference MCP configuration for Antigravity"
```

**Usage:**
```bash
# Developers can copy reference to global location
cp .gemini/mcp_config.json ~/.gemini/antigravity/mcp_config.json
```

### 2. Automated Setup Script

**Strategy:** Provide script to merge project servers into user config.

**Benefits:**
- Reduces manual work
- Standardizes setup process
- Handles merging with existing config

**Example script:**
```bash
#!/bin/bash
# scripts/setup-antigravity-mcp.sh

set -e

echo "🔧 Setting up Antigravity MCP servers..."

PROJECT_CONFIG=".gemini/mcp_config.json"
USER_CONFIG="$HOME/.gemini/antigravity/mcp_config.json"

# Verify project config exists
if [ ! -f "$PROJECT_CONFIG" ]; then
  echo "❌ Project MCP config not found: $PROJECT_CONFIG"
  exit 1
fi

# Create user config directory if needed
mkdir -p "$(dirname "$USER_CONFIG")"

# Check if user config exists
if [ ! -f "$USER_CONFIG" ]; then
  echo "📝 Creating new user config..."
  cp "$PROJECT_CONFIG" "$USER_CONFIG"
  echo "✅ Configuration created"
else
  echo "🔄 Merging with existing user config..."

  # Backup existing
  cp "$USER_CONFIG" "$USER_CONFIG.backup"

  # Merge configurations using jq
  if command -v jq &> /dev/null; then
    jq -s '.[0] * .[1]' "$USER_CONFIG.backup" "$PROJECT_CONFIG" > "$USER_CONFIG"
    echo "✅ Configuration merged"
  else
    echo "⚠️  jq not installed - manual merge required"
    echo "Project config location: $PROJECT_CONFIG"
    echo "User config location: $USER_CONFIG"
    exit 1
  fi
fi

echo ""
echo "✅ Setup complete!"
echo "Verify with: gemini mcp list"
```

**Usage:**
```bash
# Make executable
chmod +x scripts/setup-antigravity-mcp.sh

# Run setup
./scripts/setup-antigravity-mcp.sh
```

### 3. Environment Variable Management

**Strategy:** Document and standardize environment variable setup.

**Create `.env.example`:**
```bash
# Required for MCP servers
CONTEXT7_API_KEY=your_api_key_here
GITHUB_TOKEN=ghp_your_token_here
DATABASE_URL=postgresql://user:pass@host:5432/db

# Optional
LOG_LEVEL=info
API_TIMEOUT=30000
```

**Setup instructions:**
```bash
# Copy example
cp .env.example .env

# Edit with your credentials
vim .env

# Source in shell profile
echo "source $(pwd)/.env" >> ~/.zshrc
source ~/.zshrc
```

### 4. Documentation-First Approach

**Strategy:** Comprehensive documentation for Antigravity users.

**Create `docs/setup/ANTIGRAVITY_SETUP.md`:**
```markdown
# Antigravity MCP Setup

⚠️ Antigravity requires manual MCP server configuration.

## Required MCP Servers

| Server | Purpose | Configuration |
|--------|---------|---------------|
| context7 | Documentation access | See below |
| github | Repository integration | See below |

## Setup Steps

### 1. Open Configuration File

\`\`\`bash
# macOS/Linux
vim ~/.gemini/antigravity/mcp_config.json

# Windows
notepad %USERPROFILE%\.gemini\antigravity\mcp_config.json
\`\`\`

### 2. Add Servers

Copy configuration from `.gemini/mcp_config.json`

### 3. Verify

\`\`\`bash
gemini mcp list
\`\`\`

Should show all project servers.
```

### 5. UI-Based Configuration

**Strategy:** Use Antigravity's MCP Store for setup.

**Steps:**
1. Open Antigravity
2. Click Agent session → "..." (menu)
3. Select "MCP Servers"
4. Click "Manage MCP Servers"
5. Click "View raw config"
6. Paste project configuration

**Advantages:**
- Visual interface
- Validation built-in
- No file path confusion
- Immediate feedback

**Disadvantages:**
- Still manual process
- Must repeat for each project
- Cannot automate easily

## Migration Considerations

Planning for future project-level support:

### Preparing for Migration

When Antigravity adds project-level support, prepare your projects:

**1. Maintain Reference Configuration**
```bash
# Keep .gemini/mcp_config.json updated
# Will become active when support is added
```

**2. Document Current Workarounds**
```markdown
## Current Setup (Manual)
Using global configuration due to platform limitation.

## Future Setup (Automatic)
When Antigravity supports project-level MCP, this configuration
will be read automatically from `.gemini/mcp_config.json`.
```

**3. Track Feature Request**
- Monitor [forum thread](https://discuss.ai.google.dev/t/support-for-per-workspace-mcp-config-on-antigravity/111952)
- Test beta releases
- Prepare migration plan

### Migration Path

When project-level support is added:

**Before:**
```bash
# Manual configuration
~/.gemini/antigravity/mcp_config.json (global)
```

**After:**
```bash
# Automatic configuration
.gemini/mcp_config.json (project-level, preferred)
~/.gemini/antigravity/mcp_config.json (global, fallback)
```

**Migration steps:**
1. Verify project-level support available
2. Remove project-specific servers from global config
3. Verify project-level config loads
4. Update team documentation
5. Remove setup scripts (no longer needed)

## Best Practices Under Current Limitations

Recommendations for working with Antigravity today:

### For Individual Developers

**1. Organize Global Configuration**
```json
{
  "mcpServers": {
    // === Project A Servers ===
    "projecta-database": { ... },
    "projecta-api": { ... },

    // === Project B Servers ===
    "projectb-database": { ... },
    "projectb-api": { ... },

    // === Personal Utilities ===
    "filesystem": { ... },
    "context7": { ... }
  }
}
```

**2. Use Clear Naming**
```json
{
  "mcpServers": {
    "myproject-prod-db": { ... },   // ✅ Clear context
    "myproject-dev-db": { ... },    // ✅ Clear context
    "database": { ... }             // ❌ Ambiguous
  }
}
```

**3. Document Personal Config**
```bash
# Add comment to config file
# Or maintain separate notes on which servers belong to which projects
```

### For Teams

**1. Standardize Server Names**
```json
// Team convention: <project>-<service>-<environment>
{
  "mcpServers": {
    "acme-database-dev": { ... },
    "acme-api-staging": { ... },
    "acme-storage-prod": { ... }
  }
}
```

**2. Provide Setup Automation**
```bash
# Include in project
scripts/setup-antigravity.sh
docs/setup/ANTIGRAVITY_SETUP.md
.gemini/mcp_config.json
```

**3. Regular Verification**
```bash
# Add to CI/CD or documentation checks
# Verify .gemini/mcp_config.json is up to date
```

**4. Onboarding Checklist**
```markdown
## New Developer Setup

- [ ] Clone repository
- [ ] Install dependencies
- [ ] Configure Antigravity MCP servers (see docs/ANTIGRAVITY_SETUP.md)
- [ ] Verify: `gemini mcp list` shows all project servers
- [ ] Test AI assistance with project-specific tools
```

### For Project Maintainers

**1. Keep Reference Config Updated**
```bash
# Whenever adding new MCP server
# Update .gemini/mcp_config.json
# Update documentation
# Notify team
```

**2. Monitor Platform Updates**
```bash
# Check for project-level support
# Test new Antigravity releases
# Plan migration when available
```

**3. Provide Multiple Setup Methods**
```markdown
## Antigravity Setup Options

1. **Automated:** Run `scripts/setup-antigravity.sh`
2. **Manual:** Copy from `.gemini/mcp_config.json`
3. **UI:** Use MCP Store (see detailed guide)
```

## Alternative: Use Other Platforms for Team Projects

If project-level MCP support is critical:

### Consider These Alternatives

**1. Claude Code**
- Full project-level support
- Scoped configurations (local, project, user)
- Team collaboration built-in
- Git-committed configs

**2. Cursor**
- Project-level `.cursor/mcp.json`
- Team-wide standardization
- Visual configuration UI
- Automatic setup for new team members

**3. Gemini CLI**
- Project-level `.gemini/settings.json`
- Command-line workflow
- Same backend as Antigravity
- Better multi-project isolation

### Hybrid Approach

**Use multiple platforms based on needs:**

```
Team Development: Cursor or Claude Code (project-level support)
Personal Exploration: Antigravity (powerful AI, global config acceptable)
CI/CD Automation: Gemini CLI (scriptable, project-level support)
```

## Summary

### Key Takeaways

1. **Antigravity does NOT support project-level MCP configurations**
2. **Only global user configuration works**: `~/.gemini/antigravity/mcp_config.json`
3. **Manual setup required for each developer**
4. **Team collaboration requires workarounds**
5. **Feature requested but no timeline for implementation**

### Implications

**For Individual Developers:**
- Manage multiple projects in single global config
- Use clear naming conventions
- Document which servers belong to which projects

**For Teams:**
- Provide setup scripts and documentation
- Standardize server naming
- Consider alternative platforms for critical projects

**For Projects:**
- Include reference configuration
- Document manual setup process
- Plan for future migration when support is added

## Related Resources

### Documentation

**In This Repository:**
- [Antigravity Setup Guide](setup.md) - Manual configuration steps
- [MCP Server Configuration](../../02-using-mcp/scoped-configuration.md) - Cross-platform comparison
- [Platform Comparison](../../01-fundamentals/architecture.md) - MCP across platforms

**External:**
- [Antigravity MCP Documentation](https://antigravity.google/docs/mcp)
- [Forum: Project-Level Support Request](https://discuss.ai.google.dev/t/support-for-per-workspace-mcp-config-on-antigravity/111952)
- [How to Add MCP Servers](https://lilys.ai/en/notes/google-antigravity-20260129/mcp-servers-antigravity-ide)
- [Model Context Protocol](https://modelcontextprotocol.io/)

### Related Guides

- **Setup:** [Antigravity Setup](setup.md) - Global configuration guide
- **Comparison:** [Platform Features](../../01-fundamentals/platform-support.md) - What each platform offers
- **Workarounds:** Scripts and automation examples in project repository

---

**Last Updated:** February 2026
**Status:** Current platform limitation, feature requested
**Impact:** High for team collaboration
**Workaround:** Manual configuration with reference files and scripts
