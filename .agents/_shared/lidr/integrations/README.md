---
name: lidr-integrations-readme
description: How LIDR skills stay tool-agnostic and language-agnostic — the central tool-registry + per-skill adapters (hybrid model) and per-client language/tool binding.
last_updated: "2026-06-09"
status: active
type: reference
---

# LIDR Integrations — Tool & Language Agnosticism

LIDR skills are complementary best-practice wrappers over BMad outputs. By
**nature they are agnostic**; concrete tools and output language are **client
configuration**, never hardcoded in a skill.

## Two axes of agnosticism

| Axis         | Rule                                                                                        | Where bound                              |
| ------------ | ------------------------------------------------------------------------------------------- | ---------------------------------------- |
| **Domain**   | No client/industry vocabulary in `SKILL.md`; examples live in `examples/`.                  | already done (tier3 migration)           |
| **Language** | Skill content authored in **English**. Generated artifact language is a per-client setting. | `tool-registry.yaml` `language` + client |
| **Tool**     | Skills reference abstract capabilities (`{{TRACKING_TOOL}}`), never `Jira`.                 | `tool-registry.yaml` + client config     |

## Hybrid model (central registry + per-skill adapters)

```
.agents/_shared/lidr/integrations/
├── tool-registry.yaml      # central abstract→concrete map (DRY source of truth)
├── clients/
│   ├── _example.yaml       # schema + worked examples
│   └── <CODE>.yaml         # one file per client: tool + language choices
└── README.md               # this file

.agents/skills/<skill>/adapters/   # per-skill code ONLY when the registry
                                   # binding is not enough (the DRY exception)
```

- **Central registry** holds the capability list, supported tools, and each
  tool's binding (adapter path / MCP server / CLI / export format / env vars).
  Bind a tool once, every skill benefits.
- **Per-skill `adapters/`** hold executable code (e.g. `jira-adapter.py`) when a
  capability needs real integration. Adapters implement a shared ABC so they are
  swappable. Reference implementation: `lidr-tracking-integration/adapters/`
  (`jira` / `linear` / `redmine` — all implement `TrackingToolAdapter`).

## How a skill should be written

1. Use the abstract variable, never a product name:
   - ✅ `Export the user stories to {{TRACKING_TOOL}} via the bound adapter.`
   - ❌ `Export the user stories to Jira as CSV.`
2. Declare which capabilities it touches in `SKILL.md` frontmatter:
   ```yaml
   integrations: [tracking] # capabilities from tool-registry.yaml
   language_default: en # artifact language; overridable per client
   ```
3. Declare output as English-default-configurable, not Spanish:
   - ✅ `Output: English (default); artifact language follows the client `language` setting.`
   - ❌ `Output in Spanish (functional), English (technical).`

## Resolution at run time

```
skill writes {{TRACKING_TOOL}}
        │
        ▼
client config clients/<CODE>.yaml  →  tools.tracking: redmine
        │
        ▼
tool-registry.yaml  →  redmine.adapter / .mcp / .cli / .export / .env
        │
        ▼
skill invokes adapter | MCP | CLI, or emits export format for manual import
artifact language = client `language` (default en)
```

## Adding a tool (e.g. a client's custom tracker)

1. Add an entry under the capability's `tools:` map in `tool-registry.yaml`
   (set `mcp:` to the client's MCP server, or point `adapter:` at a new file).
2. If the capability has an `adapter_interface`, implement that ABC.
3. Reference the new tool from the client's `clients/<CODE>.yaml`.

No skill edits required — that is the point.

## Migration status

This pattern is being rolled out across the 35 LIDR skills. Tracking:
`tracking-integration` (reference) ✅. Remaining language flips (16 skills) and
tool abstractions (21 with hardcoded Jira) tracked in `MIGRATION.md` Phase G.
