# Discovering and Installing Plugins in Claude Code

## Overview

**Plugins** extend Claude Code with skills, agents, hooks, and MCP servers. Plugin marketplaces are catalogs that help you discover and install these extensions without building them yourself.

**Official Documentation:** [code.claude.com/docs/en/discover-plugins](https://code.claude.com/docs/en/discover-plugins)

**Key Benefit:** "Find and install plugins from marketplaces to extend Claude Code with new commands, agents, and capabilities."

---

## Core Concept

### What Are Plugins?

Plugins are **prebuilt extensions** that provide:
- **Skills** - Specialized knowledge and workflows
- **Agents** - Autonomous task executors
- **Hooks** - Lifecycle customizations
- **MCP Servers** - External tool integrations

### What Are Marketplaces?

Marketplaces are **catalogs of plugins** that enable:
- **Discovery** - Browse available plugins
- **Installation** - Install with single command
- **Updates** - Automatic or manual updates
- **Distribution** - Share plugins with teams or community

### How Marketplaces Work

**Two-step process:**

**Step 1: Add marketplace**
- Registers catalog with Claude Code
- Browse what's available
- No plugins installed yet

**Step 2: Install plugins**
- Choose specific plugins from catalog
- Install to desired scope

**Analogy:** Like adding an app store—adding the store gives access to browse, but you choose which apps to download.

---

## Official Anthropic Marketplace

The official marketplace (`claude-plugins-official`) is **automatically available** when you start Claude Code.

### Browse Official Marketplace

```
/plugin
```

Go to **Discover** tab to browse.

### Install from Official Marketplace

```bash
/plugin install plugin-name@claude-plugins-official
```

**Note:** Official marketplace maintained by Anthropic. To distribute your own plugins, create your own marketplace.

---

## Plugin Categories

### 1. Code Intelligence

Enable Claude Code's built-in LSP tool for language-specific features.

**What they provide:**
- Jump to definitions
- Find references
- Type error detection immediately after edits
- Language Server Protocol connections

**Available plugins:**

| Language   | Plugin              | Binary Required              |
|:-----------|:--------------------|:-----------------------------|
| C/C++      | `clangd-lsp`        | `clangd`                     |
| C#         | `csharp-lsp`        | `csharp-ls`                  |
| Go         | `gopls-lsp`         | `gopls`                      |
| Java       | `jdtls-lsp`         | `jdtls`                      |
| Kotlin     | `kotlin-lsp`        | `kotlin-language-server`     |
| Lua        | `lua-lsp`           | `lua-language-server`        |
| PHP        | `php-lsp`           | `intelephense`               |
| Python     | `pyright-lsp`       | `pyright-langserver`         |
| Rust       | `rust-analyzer-lsp` | `rust-analyzer`              |
| Swift      | `swift-lsp`         | `sourcekit-lsp`              |
| TypeScript | `typescript-lsp`    | `typescript-language-server` |

**Requirements:** Language server binary must be installed on your system.

**Note:** If you see `Executable not found in $PATH` in `/plugin` Errors tab, install the required binary.

#### Claude's Code Intelligence Capabilities

Once installed and binary available:

**1. Automatic diagnostics (no configuration needed):**
- After every file edit, language server analyzes changes
- Reports errors and warnings automatically
- Claude sees type errors, missing imports, syntax issues
- No compiler/linter run needed
- Claude notices and fixes errors in same turn
- View diagnostics: Press **Ctrl+O** when "diagnostics found" indicator appears

**2. Code navigation:**
- Jump to definitions
- Find references
- Get type info on hover
- List symbols
- Find implementations
- Trace call hierarchies
- More precise than grep-based search
- Availability varies by language and environment

### 2. External Integrations

Pre-configured MCP servers for external services (no manual setup needed).

**Source control:**
- `github`
- `gitlab`

**Project management:**
- `atlassian` (Jira/Confluence)
- `asana`
- `linear`
- `notion`

**Design:**
- `figma`

**Infrastructure:**
- `vercel`
- `firebase`
- `supabase`

**Communication:**
- `slack`

**Monitoring:**
- `sentry`

### 3. Development Workflows

Commands and agents for common development tasks.

**Available plugins:**
- `commit-commands` - Git commit workflows (commit, push, PR creation)
- `pr-review-toolkit` - Specialized agents for reviewing pull requests
- `agent-sdk-dev` - Tools for building with Claude Agent SDK
- `plugin-dev` - Toolkit for creating your own plugins

### 4. Output Styles

Customize how Claude responds.

**Available plugins:**
- `explanatory-output-style` - Educational insights about implementation choices
- `learning-output-style` - Interactive learning mode for skill building

---

## Try It: Demo Marketplace

Anthropic maintains a [demo plugins marketplace](https://github.com/anthropics/claude-code/tree/main/plugins) (`claude-code-plugins`) with example plugins.

### Step 1: Add Demo Marketplace

```bash
/plugin marketplace add anthropics/claude-code
```

Downloads marketplace catalog and makes plugins available.

### Step 2: Browse Available Plugins

```
/plugin
```

Opens tabbed interface with four tabs (cycle with **Tab**):

**Discover** - Browse available plugins from all marketplaces

**Installed** - View and manage installed plugins

**Marketplaces** - Add, remove, or update marketplaces

**Errors** - View plugin loading errors

### Step 3: Install a Plugin

Select plugin to view details, choose installation scope:

- **User scope** - For yourself across all projects
- **Project scope** - For all collaborators on this repository
- **Local scope** - For yourself in this repository only

**Example: Install commit-commands**

Interactive UI or command line:

```bash
/plugin install commit-commands@anthropics-claude-code
```

**See:** Configuration scopes for more details.

### Step 4: Use Your New Plugin

After installing, commands immediately available.

**Plugin command format:** Namespaced by plugin name

```bash
/commit-commands:commit
```

**What it does:**
1. Stages your changes
2. Generates commit message
3. Creates the commit

**Note:** Each plugin works differently. Check plugin description in **Discover** tab or homepage.

---

## Add Marketplaces

Use `/plugin marketplace add` to add marketplaces from different sources.

**Shortcuts:**
- `/plugin market` instead of `/plugin marketplace`
- `rm` instead of `remove`

### Supported Sources

**GitHub repositories:** `owner/repo` format

**Git URLs:** Any git repository URL (GitLab, Bitbucket, self-hosted)

**Local paths:** Directories or direct paths to `marketplace.json` files

**Remote URLs:** Direct URLs to hosted `marketplace.json` files

---

## Add from GitHub

Use `owner/repo` format for GitHub repositories containing `.claude-plugin/marketplace.json`.

**Format:** `owner` = GitHub username/organization, `repo` = repository name

**Example:**

```bash
/plugin marketplace add anthropics/claude-code
```

**Reference:** `anthropics/claude-code` = `claude-code` repository owned by `anthropics`

---

## Add from Other Git Hosts

Provide full URL for any Git host (GitLab, Bitbucket, self-hosted).

### Using HTTPS

```bash
/plugin marketplace add https://gitlab.com/company/plugins.git
```

### Using SSH

```bash
/plugin marketplace add git@gitlab.com:company/plugins.git
```

### Specific Branch or Tag

Append `#` followed by ref:

```bash
/plugin marketplace add https://gitlab.com/company/plugins.git#v1.0.0
```

---

## Add from Local Paths

### Local Directory

Add directory containing `.claude-plugin/marketplace.json`:

```bash
/plugin marketplace add ./my-marketplace
```

### Direct Path to marketplace.json

```bash
/plugin marketplace add ./path/to/marketplace.json
```

---

## Add from Remote URLs

Add remote `marketplace.json` via URL:

```bash
/plugin marketplace add https://example.com/marketplace.json
```

**Note:** URL-based marketplaces have limitations. If you encounter "path not found" errors, see Troubleshooting section.

---

## Install Plugins

Once marketplaces added, install plugins directly.

### Default Installation (User Scope)

```bash
/plugin install plugin-name@marketplace-name
```

### Choose Installation Scope

**Interactive UI:** Run `/plugin`, go to **Discover** tab, press **Enter** on plugin.

**Scope options:**

**User scope** (default)
- Install for yourself across all projects

**Project scope**
- Install for all collaborators on repository
- Adds to `.claude/settings.json`

**Local scope**
- Install for yourself in repository only
- Not shared with collaborators

**Managed scope**
- Installed by administrators via managed settings
- Cannot be modified

**View by scope:** Run `/plugin`, go to **Installed** tab (plugins grouped by scope).

**Warning:** Trust plugins before installing. Anthropic doesn't control MCP servers, files, or software included in plugins and cannot verify they work as intended. Check plugin homepage for details.

---

## Manage Installed Plugins

Run `/plugin` and go to **Installed** tab to:
- View plugins
- Enable plugins
- Disable plugins
- Uninstall plugins

**Filter:** Type to filter by plugin name or description

### Direct Commands

**Disable without uninstalling:**

```bash
/plugin disable plugin-name@marketplace-name
```

**Re-enable disabled plugin:**

```bash
/plugin enable plugin-name@marketplace-name
```

**Completely remove:**

```bash
/plugin uninstall plugin-name@marketplace-name
```

### Target Specific Scope

Use `--scope` option with CLI commands:

```bash
claude plugin install formatter@your-org --scope project
claude plugin uninstall formatter@your-org --scope project
```

---

## Manage Marketplaces

### Interactive Interface

Run `/plugin`, go to **Marketplaces** tab to:
- View all added marketplaces with sources and status
- Add new marketplaces
- Update marketplace listings (fetch latest plugins)
- Remove marketplaces

### CLI Commands

**List all marketplaces:**

```bash
/plugin marketplace list
```

**Refresh plugin listings:**

```bash
/plugin marketplace update marketplace-name
```

**Remove marketplace:**

```bash
/plugin marketplace remove marketplace-name
```

**Warning:** Removing marketplace uninstalls all plugins installed from it.

---

## Configure Auto-Updates

Claude Code can automatically update marketplaces and installed plugins at startup.

### How Auto-Update Works

**When enabled for marketplace:**
1. Claude Code refreshes marketplace data at startup
2. Updates installed plugins to latest versions
3. If plugins updated, notification suggests restarting Claude Code

### Toggle Auto-Update (Interactive UI)

**Steps:**
1. Run `/plugin`
2. Select **Marketplaces**
3. Choose marketplace from list
4. Select **Enable auto-update** or **Disable auto-update**

**Defaults:**
- Official Anthropic marketplaces: Auto-update **enabled**
- Third-party and local development marketplaces: Auto-update **disabled**

### Disable All Auto-Updates

Disable automatic updates for both Claude Code and all plugins:

```bash
export DISABLE_AUTOUPDATER=true
```

**See:** Auto updates documentation for details.

### Plugin Auto-Updates Only

Keep plugin auto-updates enabled while disabling Claude Code auto-updates:

```bash
export DISABLE_AUTOUPDATER=true
export FORCE_AUTOUPDATE_PLUGINS=true
```

**Use case:** Manage Claude Code updates manually but receive automatic plugin updates.

---

## Configure Team Marketplaces

Team admins can set up automatic marketplace installation for projects.

**Configuration:** Add marketplace configuration to `.claude/settings.json`

**Behavior:** When team members trust repository folder, Claude Code prompts them to install these marketplaces and plugins.

**Full options:** See Plugin settings for `extraKnownMarketplaces` and `enabledPlugins`.

---

## Troubleshooting

### /plugin Command Not Recognized

**If you see:** "unknown command" or `/plugin` doesn't appear

**Solution:**

**1. Check version:**

```bash
claude --version
```

Plugins require **version 1.0.33 or later**.

**2. Update Claude Code:**

**Homebrew:**
```bash
brew upgrade claude-code
```

**npm:**
```bash
npm update -g @anthropic-ai/claude-code
```

**Native installer:**
Re-run install command from Setup documentation.

**3. Restart Claude Code:**

After updating, restart terminal and run `claude` again.

---

## Common Issues

### Marketplace Not Loading

**Check:**
- URL is accessible
- `.claude-plugin/marketplace.json` exists at the path

### Plugin Installation Failures

**Check:**
- Plugin source URLs are accessible
- Repositories are public (or you have access)

### Files Not Found After Installation

**Issue:** Plugins copied to cache, paths outside plugin directory won't work

**Solution:** Ensure plugin references files within plugin directory

### Plugin Skills Not Appearing

**Solution:**
1. Clear cache: `rm -rf ~/.claude/plugins/cache`
2. Restart Claude Code
3. Reinstall plugin

**Detailed troubleshooting:** See Troubleshooting in marketplace guide

**Debugging tools:** See Debugging and development tools in plugins reference

---

## Code Intelligence Issues

### Language Server Not Starting

**Check:**
- Binary is installed
- Binary available in `$PATH`
- Check `/plugin` Errors tab for details

**Example:** If you see `Executable not found in $PATH` for `pyright-lsp`, install `pyright-langserver`:

```bash
# npm
npm install -g pyright

# Or via your package manager
brew install pyright
```

### High Memory Usage

**Issue:** Language servers like `rust-analyzer` and `pyright` can consume significant memory on large projects.

**Solution:**

```bash
/plugin disable rust-analyzer-lsp
```

**Alternative:** Rely on Claude's built-in search tools instead.

### False Positive Diagnostics in Monorepos

**Issue:** Language servers may report unresolved import errors for internal packages if workspace isn't configured correctly.

**Note:** These don't affect Claude's ability to edit code.

**Solutions:**
- Configure language server workspace settings
- Add workspace configuration files (e.g., `tsconfig.json`, `Cargo.toml` workspace)
- Disable diagnostics for specific paths

---

## Installation Scopes in Detail

### User Scope

**Storage:** User-level configuration (`~/.claude/settings.json`)

**Applies to:** All projects for this user

**Use for:**
- Personal development tools
- Utilities used across multiple projects
- Personal preferences

**Install command:**

```bash
/plugin install plugin-name@marketplace-name --scope user
```

### Project Scope

**Storage:** Project configuration (`.claude/settings.json`)

**Applies to:** All collaborators on this repository

**Use for:**
- Team-shared plugins
- Project-specific workflows
- Collaboration tools

**Install command:**

```bash
/plugin install plugin-name@marketplace-name --scope project
```

**Benefit:** Checked into version control, all team members get same plugins.

### Local Scope

**Storage:** Local project configuration (`.claude/settings.local.json`)

**Applies to:** You only, in this repository

**Use for:**
- Experimental plugins
- Personal workflow in specific project
- Testing before team adoption

**Install command:**

```bash
/plugin install plugin-name@marketplace-name --scope local
```

### Managed Scope

**Storage:** System-wide managed configuration

**Applies to:** All users in organization

**Managed by:** IT administrators

**Use for:**
- Organization policies
- Required security tools
- Compliance plugins

**Note:** Cannot be modified by individual users.

---

## Plugin Command Namespacing

Plugins use namespaced commands to prevent conflicts.

**Format:** `/plugin-name:command-name`

**Examples:**

```bash
# commit-commands plugin
/commit-commands:commit
/commit-commands:push
/commit-commands:pr

# pr-review-toolkit plugin
/pr-review-toolkit:review
/pr-review-toolkit:suggest-improvements
```

**Benefit:** Multiple plugins can provide similar functionality without command name conflicts.

---

## Best Practices

### 1. Trust Before Installing

✅ **DO:** Review plugin before installation

- Check plugin homepage
- Read description and capabilities
- Verify source repository
- Review what MCP servers are included

❌ **DON'T:** Install unknown plugins without verification

### 2. Use Appropriate Scopes

✅ **DO:** Choose correct scope for each plugin

- **User:** Personal tools across projects
- **Project:** Team collaboration
- **Local:** Experimentation

❌ **DON'T:** Install everything to project scope (pollutes team configuration)

### 3. Keep Plugins Updated

✅ **DO:** Enable auto-updates for trusted marketplaces

- Official Anthropic marketplaces: Keep auto-update enabled
- Team/company marketplaces: Enable after vetting

❌ **DON'T:** Disable updates and use outdated plugins

### 4. Review Errors Tab

✅ **DO:** Check `/plugin` Errors tab regularly

- See plugin loading errors
- Verify required binaries installed
- Debug configuration issues

❌ **DON'T:** Ignore error indicators

### 5. Clean Up Unused Plugins

✅ **DO:** Uninstall plugins you don't use

- Reduces context overhead
- Improves performance
- Keeps configuration clean

❌ **DON'T:** Accumulate unused plugins

---

## Security Considerations

### Plugin Trust Model

**Warning:** Plugins can:
- Execute code on your system
- Access your files and data
- Connect to external services
- Modify Claude Code behavior

### Before Installing

**Check:**
1. **Plugin source** - Verify repository is trustworthy
2. **MCP servers** - Review what external services are accessed
3. **Permissions** - Understand what capabilities plugin has
4. **Maintenance** - Check if plugin is actively maintained

### Official vs Third-Party

**Official Anthropic plugins:**
- Maintained by Anthropic
- Vetted and tested
- Recommended for general use

**Third-party plugins:**
- Created by community
- Varying quality and maintenance
- Review before installing
- Anthropic cannot verify security

### Managed Plugins

**Organization policies:**
- IT administrators control which plugins available
- Managed plugins cannot be uninstalled
- May be required for compliance

---

## Next Steps

### Build Your Own Plugins

**See:** Plugins documentation to create skills, agents, and hooks

**Plugin components:**
- Skills (SKILL.md files)
- Agents (custom agents)
- Hooks (lifecycle customizations)
- MCP servers (external integrations)

### Create a Marketplace

**See:** Create a plugin marketplace documentation

**Distribution options:**
- GitHub repositories
- Git hosting (GitLab, Bitbucket)
- Self-hosted URLs
- Local development

### Technical Reference

**See:** Plugins reference for complete specifications

**Covers:**
- Plugin structure
- Marketplace format
- LSP server configuration
- Debugging tools

---

## Related Resources

### In This Repository

**Plugins:**
- Plugin creation documentation (when available)
- Plugin marketplace creation (when available)
- Plugins reference (when available)

**Related Features:**
- `docs/references/skills/skills-claude-code.md` - Skills in Claude Code
- `docs/references/mcp/mcp-usage-claude-code.md` - MCP in Claude Code
- `docs/references/hooks/hooks-guide-claude-code.md` - Hooks in Claude Code
- `docs/references/agents/sub-agents-claude-code.md` - Sub-agents

**Settings:**
- Settings documentation for configuration scopes and plugin settings

### External Resources

- **Official Documentation:** [code.claude.com/docs/en/discover-plugins](https://code.claude.com/docs/en/discover-plugins)
- **Plugin Marketplaces:** [code.claude.com/docs/en/plugin-marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)
- **Plugins Reference:** [code.claude.com/docs/en/plugins-reference](https://code.claude.com/docs/en/plugins-reference)
- **Plugins Guide:** [code.claude.com/docs/en/plugins](https://code.claude.com/docs/en/plugins)
- **Demo Marketplace:** [github.com/anthropics/claude-code/tree/main/plugins](https://github.com/anthropics/claude-code/tree/main/plugins)

---

**Last Updated:** January 2026
**Category:** Plugins
**Status:** Official Claude Code Feature
**Minimum Version:** 1.0.33
