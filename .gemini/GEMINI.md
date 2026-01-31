# Gemini Context for Template Best Practices

This `GEMINI.md` file provides essential context and instructions for working within the `template-best-practices` repository. This project is a reference implementation for managing and synchronizing configurations across multiple AI agents (Cursor, Claude Code, Gemini CLI, and Antigravity).

## Project Overview

**Purpose:** To demonstrate a centralized "Source of Truth" pattern for AI development environments, ensuring consistent capabilities (Skills and MCP Servers) across different AI agents.

**Core Architecture:**
*   **Source of Truth (`.agents/`):** The master directory for all shared configurations.
    *   `.agents/skills/`: The master definition of all agent skills.
    *   `.agents/mcp/`: The master configuration for MCP (Model Context Protocol) servers.
*   **Agent-Specific Directories:** Derived from the source of truth.
    *   `.cursor/`, `.claude/`, `.gemini/`, `.agent/`: These contain generated configuration files (for MCP) or symlinks (for Skills) to ensure synchronization.

## Setup & Usage

### 1. Synchronize Configuration
The primary workflow involves generating agent-specific configs from the central definitions.

**Command:**
```bash
./.agents/mcp/sync-mcp.sh
```

**What this does:**
*   Reads `.agents/mcp/mcp-servers.json`.
*   Generates `.cursor/mcp.json`.
*   Generates `.claude/mcp.json`.
*   Generates `.gemini/settings.json` (for Gemini CLI).
*   Generates `.gemini/mcp_config.json` (Reference only for Antigravity).

### 2. Managing MCP Servers
To add or modify an MCP server:

1.  **Edit Source:** Modify `.agents/mcp/mcp-servers.json`.
2.  **Configure:** Add the server details and specify supported platforms:
    ```json
    "server-name": {
      "type": "stdio",
      "command": "...",
      "platforms": ["cursor", "claude", "gemini"]
    }
    ```
3.  **Sync:** Run the synchronization script `./.agents/mcp/sync-mcp.sh`.
4.  **Commit:** Commit both the source and the generated files.

### 3. Managing Skills
Skills are modular capabilities located in `.agents/skills/`.

*   **Edit Location:** ALWAYS make changes in `.agents/skills/{skill-name}/`.
*   **Propagation:** Changes are automatically reflected in agent directories via symlinks.
*   **Creation:** Use the `skill-creator` skill or manually duplicate the structure of an existing skill.

### 4. Antigravity Specifics
**Warning:** Antigravity does **NOT** support project-level MCP configuration.
*   The file `.gemini/mcp_config.json` is generated for reference only.
*   You must manually configure `~/.gemini/antigravity/mcp_config.json` globally.
*   See `docs/guides/mcp/ANTIGRAVITY_SETUP.md` for details.

## Key Directories

*   **`.agents/`**: **MASTER CONFIG**. Edit files here.
*   **`.agents/mcp/`**: MCP server definitions and sync script.
*   **`.agents/skills/`**: Skill definitions (e.g., `agent-development`, `command-development`).
*   **`.cursor/`**: Configuration for Cursor editor.
*   **`.claude/`**: Configuration for Claude Code.
*   **`.gemini/`**: Configuration for Gemini CLI and Antigravity reference.
*   **`docs/`**: Comprehensive project documentation.

## Documentation References

*   **Quick Start:** `SETUP_MCP.md`
*   **Claude Guidelines:** `.claude/CLAUDE.md`
*   **Antigravity Setup:** `docs/guides/mcp/ANTIGRAVITY_SETUP.md`
*   **Validation:** `docs/guides/mcp/VALIDATION.md`
