# Orchestrator

**One orchestrator, multiple subagents** - Single source of truth for agent documentation.

## Overview

The orchestrator directory contains the master documentation (`AGENTS.md`) that provides guidance to all AI platforms. Root-level symlinks (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`) point here for platform-specific access.

## Files

- **`AGENTS.md`** - Master documentation (source of truth)
- **`sync-orchestrator.sh`** - Synchronization script
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
./.agents/orchestrator/sync-orchestrator.sh

# Sync all components (includes orchestrator)
./.agents/sync-all.sh
```

### Command Sync

```bash
# Using /sync-setup command
/sync-setup
```

### Dry Run

```bash
# Preview changes without applying
./.agents/orchestrator/sync-orchestrator.sh --dry-run
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

## Platform Access

**Cursor:** Reads from root `CLAUDE.md` → orchestrator
**Claude Code:** Reads from root `CLAUDE.md` → orchestrator
**Gemini CLI:** Reads from root `GEMINI.md` → orchestrator
**Antigravity:** Reads from root `AGENTS.md` → orchestrator

## Design Decisions

### Why Orchestrator?

**Problem:** Different platforms expect agent docs in different locations
- Cursor: Prefers `CLAUDE.md` at root
- Gemini CLI: Expects `GEMINI.md` or `.gemini/` directory
- Standards: `AGENTS.md` follows [agents.md](https://agents.md) spec

**Solution:** One source, multiple access points via symlinks
- Single `.agents/orchestrator/AGENTS.md` source
- Platform-specific symlinks at root
- Edit anywhere, updates everywhere

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
./.agents/orchestrator/sync-orchestrator.sh

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
- [Sync All Script](./../sync-all.sh) - Master synchronization
