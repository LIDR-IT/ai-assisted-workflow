# TODO — lidr-ecosystem

Pending items for future sessions. Each entry is a discrete unit of work with clear acceptance criteria.

## Platform parity

- [ ] **Copilot/VSCode** (`.github/` + `.vscode/`) — Delete, regenerate, verify (Skills ✅ / Agents ✅ / Commands ✅ / MCP ✅ / Rules ❌ / Memories ✅ / Hooks ✅)
- [ ] **Copilot CLI** — Create system (Skills / Agents / Commands / MCP / Rules / Memories / Hooks)

## Claude Code meta-tooling: sync with upstream + personalize

**Status:** Rename done in Phase E (2026-05-20). Remaining work is content sync + personalization.

Skills affected (5, all `claude-*` `anytime` `optional`):

- `claude-agents-architecture`
- `claude-command-development`
- `claude-generate-rule`
- `claude-hook-development`
- `claude-mcp-integration`

### Remaining acceptance criteria

- [ ] Compare each skill content against Anthropic's latest official Claude Code skills (e.g. via `npx ctx7@latest docs /anthropic/claude-code`). Merge upstream improvements.
- [ ] Mark LIDR personalizations with `<!-- LIDR customization -->` blocks (so future upstream syncs are easy to apply selectively).
- [ ] Reflect OUR conventions:
  - `claude-agents-architecture` — document our `sync.sh` + `.agents/` adapters (5-platform sync)
  - `claude-command-development` — show our `/lidr-advance-gate` style command patterns
  - `claude-generate-rule` — reflect our `.agents/rules/lidr-sdlc/` layout
  - `claude-hook-development` — reflect our `dtc-write-guard`, `load-context` hooks
  - `claude-mcp-integration` — reflect our `.agents/mcp/mcp-servers.json` catalog
- [ ] Bump `version:` in each frontmatter; add CHANGELOG section per skill

### Notes

- Anthropic upstream `skill-creator` is archived at `.agents/_shared/anthropic/skill-creator/` (PR #2 reference).
- `lidr-playwright-cli` remains LIDR opcional (browser automation tool, not Claude meta).
- ✅ **Phase F (2026-05-20)** completed: `commit-management` and `ticket-validation` got `lidr-` prefix; 4 LIDR skills refactored as BMad wrappers; sitemap restructured with BMad official phases.
