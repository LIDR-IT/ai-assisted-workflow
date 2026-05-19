# Lib — shared bash libraries

Internal infrastructure used by `sync.sh` and the 5 platform adapters. Single implementation of cross-cutting concerns (logging, symlinks, frontmatter, registry queries) to avoid duplication.

## Files

| File             | LOC | Purpose                                                             |
| ---------------- | --- | ------------------------------------------------------------------- |
| `core.sh`        | 106 | Logging, colors, dry-run guards, validation, idempotent file writes |
| `symlink.sh`     | 151 | Symlink primitives + `NO_SYMLINKS` copy mode + verifiers            |
| `frontmatter.sh` | 66  | YAML frontmatter parser + smart flat-rule basename for adapters     |
| `registry.sh`    | 45  | `platforms.json` queries (list, name, emoji, supports, strategy)    |

## `core.sh` — logging + validation + write_if_changed

**Logging:**

- `log_info "msg"` — ✅ green
- `log_warn "msg"` — ⚠️ yellow (to stdout)
- `log_error "msg"` — ❌ red (to stderr, exit code not changed)
- `log_detail "msg"` — indented ✅ for sub-items
- `log_section "TITLE"` — boxed header
- `log_verbose "msg"` — cyan `[DEBUG]` (only if `VERBOSE=true`)

**Dry-run guard:**

```bash
sync_my_thing() {
  if run_or_dry "create config file"; then return 0; fi
  # ... actually do the work ...
}
```

Returns 0 if dry-run (caller returns immediately), 1 otherwise.

**Validation helpers (exit 1 on failure):**

- `require_dir "/path" "label"` — fail if dir missing
- `require_file "/path" "label"` — fail if file missing
- `require_command "jq"` — fail if command not in `$PATH`

**Idempotent writes:**

- `echo "content" | write_if_changed "/out/path" "label"` — only touches file if content differs (avoids spurious git diffs)
- `echo '{}' | write_json_if_changed "/out/path" "label"` — same, but pipes through repo's `node_modules/.bin/prettier --parser=json` first so output matches what pre-commit hook would produce. Falls back to raw `write_if_changed` if prettier not installed.

## `symlink.sh` — symlink + copy primitives

**Main API:**

```bash
create_symlink "<target>" "<link_path>" "<description>"
# Example:
create_symlink "../.agents/skills" "$CLAUDE_DIR/skills" "skills"
```

Behavior:

- Removes existing file/dir/symlink at `link_path`
- Creates parent dir if needed
- Creates symlink with `ln -s`
- Respects `DRY_RUN` (logs intent) and `NO_SYMLINKS` (falls through to `_create_copy`)

**`NO_SYMLINKS=true` mode:**

Use for distributing a self-contained copy (e.g. CI artifacts, environments that don't trust symlinks). `_create_copy`:

1. Resolves relative target to absolute via `_resolve_target`
2. `cp -RL` (recursive, dereferences symlinks) — destination is fully independent

**Verifiers:**

- `verify_symlink "$link" "<expected_target>"` — fails if not a symlink or target mismatches
- `verify_link_or_copy "$path" "<desc>"` — mode-aware: checks symlink in normal mode, regular file/dir in `NO_SYMLINKS` mode

## `frontmatter.sh` — YAML parsing

**Parsing API:**

```bash
has_frontmatter "file.md"                   # → exit 0 if starts with ---
extract_field "file.md" "description"       # → field value (single line)
extract_body "file.md"                      # → markdown after frontmatter
extract_yaml_block "file.md"                # → YAML lines without --- delimiters
```

**Limitations of the parser** (it's grep/awk/sed, NOT a real YAML parser):

- Multi-line scalar values (`description: |\n...`) are truncated to the first line
- Quotes are stripped naively (won't handle escaped quotes inside)
- No support for nested keys (uses top-level keys only)
- Use a real YAML parser (Python `yaml`, `yq`) for non-trivial cases

**Smart flat-rule basename:**

```bash
flat_rule_basename "$rule_file" "$rules_root"
# e.g. "$AGENTS_DIR/rules/code/principles.md" → "principles"
# e.g. "$AGENTS_DIR/rules/lidr-sdlc/documentation.md" → "lidr-sdlc-documentation" if `documentation.md` exists elsewhere too
```

Used by Cursor and Copilot adapters when flattening the categorized rules tree into a flat directory. Only prefixes with subdirectory name when there's a name collision (avoids unnecessary renames).

## `registry.sh` — `platforms.json` queries

**Wrapper API around `jq`** for the platforms registry. All functions take a platform ID (`cursor`/`claude`/`gemini`/`copilot`/`antigravity`):

```bash
list_platforms                              # → all platform IDs (newline-separated)
platform_name "copilot"                     # → "Copilot (VSCode)"
platform_emoji "gemini"                     # → "💎"
platform_output_dir "antigravity"           # → ".agents"
platform_supports "antigravity" "agents"    # → exit 1 (antigravity has no agents)
platform_strategy "cursor" "rules"          # → "copy-flatten"
platform_config "copilot" "rules" "extension"  # → ".instructions.md"
```

Backed by `.agents/platforms.json`:

```json
{
  "platforms": {
    "<id>": {
      "name": "...",
      "emoji": "...",
      "output_dir": "...",
      "components": {
        "<component>": {
          "strategy": "symlink | copy-flatten | copy-rename | generate | generate-index | convert-toml | native | native-workflows",
          "extension": "...",
          "_note": "..."
        }
      }
    }
  }
}
```

`platforms.json` is the **single source of truth** for what each platform supports. To add a new platform: extend the JSON + write a new `.agents/adapters/<id>.sh` exposing `<id>_<component>()` functions.

## Adding to lib

New functions should be:

- **Domain-agnostic:** if it's specific to one platform, put it in `.agents/adapters/<platform>.sh`
- **Pure-bash where possible:** avoid hard external dependencies (jq is required globally, prettier is optional)
- **Self-contained:** declare any new globals at the top with `${VAR:-default}` fallbacks
- **Tested by use:** add a usage example in this README

## Style guidelines

- Use `local` for all function-internal variables
- Use `${var:-default}` for optional env vars
- Always quote variable expansions (`"$path"`, not `$path`)
- Prefer `[ ]` over `[[ ]]` for portability (bash 3 is still on macOS)
- Avoid arithmetic substitution gotchas: `((i++))` returns exit 1 when `i=0` — use `i=$((i+1))` if `set -e` is active
