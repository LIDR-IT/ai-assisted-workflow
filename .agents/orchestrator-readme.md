# Orchestrator

**One orchestrator, multiple subagents** - Single source of truth for agent documentation.

## Overview

The orchestrator directory contains the master documentation (`AGENTS.md`) that provides guidance to all AI platforms. Root-level symlinks (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`) point here for platform-specific access.

## Files

- **`AGENTS.md`** - Master documentation (source of truth)
- **`sync.sh --only=orchestrator`** - Synchronization command
- **`README.md`** - This file

## Root Symlinks

```
AGENTS.md → .agents/orchestrator/AGENTS.md
CLAUDE.md → .agents/orchestrator/AGENTS.md
GEMINI.md → .agents/orchestrator/AGENTS.md
```

**Bidirectional editing:** Edit any symlink and changes reflect in the orchestrator source.

## Architecture

```
.agents/orchestrator/
└── AGENTS.md              # ← Source of truth

Root level:
├── AGENTS.md  →  .agents/orchestrator/AGENTS.md
├── CLAUDE.md  →  .agents/orchestrator/AGENTS.md
└── GEMINI.md  →  .agents/orchestrator/AGENTS.md
```

## Synchronization

### Manual Sync

```bash
# Sync orchestrator only
./.agents/sync.sh --only=orchestrator

# Sync all components (includes orchestrator)
./.agents/sync.sh
```

### Command Sync

```bash
# Using /sync-setup command
/sync-setup
```

### Dry Run

```bash
# Preview changes without applying
./.agents/sync.sh --only=orchestrator --dry-run
```

## Verification

```bash
# Verify symlinks exist and point correctly
ls -la AGENTS.md CLAUDE.md GEMINI.md

# Expected output:
# lrwxr-xr-x  AGENTS.md -> .agents/orchestrator/AGENTS.md
# lrwxr-xr-x  CLAUDE.md -> .agents/orchestrator/AGENTS.md
# lrwxr-xr-x  GEMINI.md -> .agents/orchestrator/AGENTS.md

# Test bidirectional editing
cat CLAUDE.md | head -5
cat GEMINI.md | head -5
cat AGENTS.md | head -5
# All should show identical content
```

## Editing

Edit the orchestrator documentation by modifying any of these files:

1. **Direct:** `.agents/orchestrator/AGENTS.md`
2. **Via AGENTS.md:** Edit root `AGENTS.md` symlink
3. **Via CLAUDE.md:** Edit root `CLAUDE.md` symlink
4. **Via GEMINI.md:** Edit root `GEMINI.md` symlink

All paths update the same source file due to symlinks.

## Platform Access (verified May 2026)

| Platform        | Root file(s) read                                             | Notes                                                   |
| --------------- | ------------------------------------------------------------- | ------------------------------------------------------- |
| **Claude Code** | `CLAUDE.md`                                                   | Primary orchestrator                                    |
| **Cursor**      | `CLAUDE.md` + `AGENTS.md`                                     | Same content via symlink (no duplication)               |
| **Gemini CLI**  | `GEMINI.md`                                                   | Same content via symlink                                |
| **Antigravity** | `GEMINI.md` (shared with Gemini CLI)                          | Per Google Codelabs — uses same context file convention |
| **Copilot**     | `CLAUDE.md` + `AGENTS.md` + `.github/copilot-instructions.md` | Last file is auto-generated index of rules              |

All 3 root files (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`) are symlinks to the same `.agents/orchestrator/AGENTS.md` source — single edit propagates to every platform.

## Design Decisions

### Why Orchestrator?

**Problem:** Different platforms expect agent docs at different filenames

- Claude Code: `CLAUDE.md` at root
- Cursor: `CLAUDE.md` + `AGENTS.md`
- Gemini CLI / Antigravity: `GEMINI.md` (default context filename)
- Copilot/VSCode: `CLAUDE.md` + `AGENTS.md` + `.github/copilot-instructions.md`
- Standards: `AGENTS.md` follows [agents.md](https://agents.md) universal spec

**Solution:** One source, three symlinks — zero duplication

- Source: `.agents/orchestrator/AGENTS.md`
- Symlinks at repo root: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`
- Each platform reads its preferred filename; all resolve to the same content
- Edit any of the symlinks (or the source directly) — all paths see the change instantly

### Why Symlinks?

**Advantages:**

- Instant propagation of changes
- Zero duplication
- Filesystem-native (Git handles correctly)
- Bidirectional editing support

**Verification:**

- Symlinks committed to Git
- Restored automatically on clone
- Work across macOS/Linux (Windows requires Developer Mode)

### Why Centralized?

**Consistency:**

- One source of truth prevents drift
- Changes synchronized automatically
- Clear ownership and maintenance

**Simplicity:**

- Edit once, available everywhere
- No manual copying or transformation
- Standard sync workflow

## Troubleshooting

### Symlinks Not Created

```bash
# Re-run sync
./.agents/sync.sh --only=orchestrator

# Or manually create
cd /path/to/project
ln -s .agents/orchestrator/AGENTS.md AGENTS.md
ln -s .agents/orchestrator/AGENTS.md CLAUDE.md
ln -s .agents/orchestrator/AGENTS.md GEMINI.md
```

### Changes Not Propagating

```bash
# Verify symlink target
readlink CLAUDE.md
# Should output: .agents/orchestrator/AGENTS.md

# Check source file exists
ls -la .agents/orchestrator/AGENTS.md
```

### Symlink Shows as Regular File

**Cause:** Windows without Developer Mode
**Solution:** Enable Developer Mode in Windows Settings → Update & Security → For Developers

### Git Shows Symlink Changes

**Cause:** `core.symlinks` is false
**Solution:**

```bash
# Enable symlink support
git config core.symlinks true

# Re-clone repository
git clone <repo-url>
```

## References

- [AGENTS.md Standard](https://agents.md) - Universal agent documentation format
- [Source-of-Truth Pattern](./../rules/code/principles.md) - Architecture principles
- [Sync Script](./../sync.sh) - Master synchronization
