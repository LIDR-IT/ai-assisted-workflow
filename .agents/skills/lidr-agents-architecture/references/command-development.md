---
id: command-development
version: "1.0.0"
last_updated: "2026-06-12"
updated_by: "TL: meta-tooling consolidation"
status: active
type: reference
review_cycle: 90
next_review: "2026-09-12"
owner_role: "Tech Lead"
---

# Command Development — Design Fundamentals

Deep-dive on slash-command **design** (frontmatter, arguments, file references, bash
execution, interactivity, plugin features). This complements
`command-creation-guide.md`, which covers the `.agents/`-integration workflow
(create → sync → verify). Use this file for the command-authoring patterns
themselves.

> Trigger phrases this reference covers: "create a slash command", "add a command",
> "write a custom command", "define command arguments", "use command frontmatter",
> "organize commands", "create command with file references", "interactive command",
> "use AskUserQuestion in command", "bash execution in commands".

## Commands are instructions FOR the agent

**Commands are written for agent consumption, not human consumption.** When a user
invokes `/command-name`, the command content becomes the agent's instructions. Write
directives TO the agent, not messages TO the user.

```markdown
# ✅ Correct — instructs the agent

Review this code for security vulnerabilities including:

- SQL injection
- XSS attacks
- Authentication issues
  Provide specific line numbers and severity ratings.

# ❌ Incorrect — describes to the user, gives the agent nothing to do

This command will review your code for security issues.
You'll receive a report with vulnerability details.
```

## File format

Commands are Markdown files (`.md`). In the LIDR ecosystem the source of truth is
`.agents/commands/{name}.md`. Basic commands need no frontmatter; add YAML frontmatter
for configuration:

```markdown
---
description: Review code for security issues
allowed-tools: Read, Grep, Bash(git:*)
model: sonnet
---

Review this code for security vulnerabilities...
```

## YAML frontmatter fields

| Field                      | Purpose                                                             | Notes                                                              |
| -------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `description`              | Shown in `/help`                                                    | Clear, actionable, under ~60 chars. Defaults to first prompt line. |
| `allowed-tools`            | Which tools the command may use                                     | `Read, Write, Edit`, scoped `Bash(git:*)`, or `*` (rarely)         |
| `model`                    | Model for execution (`sonnet`/`opus`/`haiku`)                       | `haiku` fast/simple, `sonnet` standard, `opus` complex analysis    |
| `argument-hint`            | Documents expected args for autocomplete                            | e.g. `[pr-number] [priority] [assignee]`                           |
| `disable-model-invocation` | Prevent SlashCommand tool from calling the command programmatically | Boolean, default false; set true for manual-only commands          |

For the complete per-platform frontmatter matrix (Claude/Cursor/Gemini/Antigravity/
Copilot), see `architecture-overview.md` and the project `CLAUDE.md` "Commands System".

## Dynamic arguments

**`$ARGUMENTS`** captures all args as one string:

```markdown
Fix issue #$ARGUMENTS following our coding standards.
```

`> /fix-issue 123` → `Fix issue #123 following our coding standards.`

**Positional `$1`, `$2`, `$3`** capture individual args:

```markdown
Review pull request #$1 with priority level $2. After review, assign to $3.
```

`> /review-pr 123 high alice` → `Review pull request #123 with priority level high.
After review, assign to alice.`

Mix positional + remaining: `Deploy $1 to $2 with options: $3`.

## File references (`@` syntax)

Include file contents in a command. The agent reads the file before processing:

```markdown
Review @$1 for code quality, best practices, potential bugs.
```

`> /review-file src/api/users.ts` reads `src/api/users.ts`. Multiple/static refs work
too: `Compare @src/old.js with @src/new.js`, `Review @package.json and @tsconfig.json`.

## Bash execution

Commands can run bash inline (`!` + backticks) to gather context before processing —
git state, environment, project status. Requires `allowed-tools` to include `Bash`
(scope it: `Bash(git:*)`, not `Bash(*)`).

```markdown
---
description: Review code changes
allowed-tools: Read, Bash(git:*)
---

Files changed: !`git diff --name-only`

Review each file for quality, bugs, test coverage, and documentation needs.
```

## Command organization

- **Flat** (`build.md`, `test.md`, `deploy.md`) — for 5–15 commands, no clear categories.
- **Namespaced** (subdirectories `ci/build.md`, `git/commit.md`) — for 15+ commands.
  Namespace appears in `/help`, e.g. `/build (project:ci)`.

## Best practices

- **Single responsibility** — one command, one task.
- **Clear `description`** — self-explanatory in `/help`.
- **Explicit `allowed-tools`** when the command needs specific access; scope bash narrowly.
- **Always provide `argument-hint`**; document format and validate required args in the prompt.
- **Verb-noun naming** — `review-pr`, `fix-issue`.
- **Handle missing/invalid args** gracefully; suggest defaults and usage.

## Common patterns

```markdown
# Review pattern

---

description: Review code changes
allowed-tools: Read, Bash(git:\*)

---

Files changed: !`git diff --name-only`
Review each file for: quality/style, bugs, test coverage, docs.

# Testing pattern

---

argument-hint: [test-file]
allowed-tools: Bash(npm:\*)

---

Run tests: !`npm test $1`
Analyze results and suggest fixes for failures.

# Workflow pattern

---

argument-hint: [pr-number]
allowed-tools: Bash(gh:\*), Read

---

PR #$1: 1) Fetch !`gh pr view $1` 2) Review 3) Run checks 4) Approve/request changes.
```

## Interactive commands (AskUserQuestion)

For commands that must branch on a user decision, prompt with a structured question
rather than free-text. Use validation early — check args/files before doing work, give
helpful error messages, suggest corrective actions:

```markdown
---
argument-hint: [environment]
---

Validate environment: !`echo "$1" | grep -E "^(dev|staging|prod)$" || echo "INVALID"`
If $1 is valid: deploy to $1.
Otherwise: explain valid environments (dev, staging, prod) and show usage.
```

File-existence and resource checks follow the same shape (`test -f $1 && echo EXISTS ||
echo MISSING`, then branch). Handle build/command failures by appending
`2>&1 || echo "FAILED"` and analyzing the output.

## Plugin features (`CLAUDE_PLUGIN_ROOT`)

When a command ships inside a plugin, `${CLAUDE_PLUGIN_ROOT}` resolves to the plugin's
absolute path — use it for portable references to scripts, config, templates:

```markdown
Run analysis: !`node ${CLAUDE_PLUGIN_ROOT}/scripts/analyze.js $1`
Load config: @${CLAUDE_PLUGIN_ROOT}/config/settings.json
Use template: @${CLAUDE_PLUGIN_ROOT}/templates/report.md
```

Plugin commands are discovered from the plugin's `commands/` directory and namespaced
in `/help` (`/foo (plugin:plugin-name)`). Commands can integrate with plugin **agents**
(launch via Task tool — agent must exist in `plugin/agents/`), **skills** (mention the
skill name to trigger it), and **hooks** (commands prepare state, hooks fire on tool
events). Combine all three for multi-component workflows.

## Command vs skill vs subagent

| Need                                               | Use          |
| -------------------------------------------------- | ------------ |
| Reusable prompt, no bundled resources, single-turn | **Command**  |
| Reusable knowledge + scripts/templates/references  | **Skill**    |
| Autonomous multi-step task with its own context    | **Subagent** |

See `architecture-overview.md` for the full decision guide.

## Troubleshooting

- **Command not appearing** — wrong directory, missing `.md`, malformed Markdown.
  Re-sync: `./.agents/sync.sh --only=commands`.
- **Arguments not working** — verify `$1`/`$2` syntax, no extra spaces, `argument-hint`
  matches usage.
- **Bash failing** — `allowed-tools` must include `Bash`; test the command in a terminal
  first; check permissions.
- **File refs not working** — verify `@` syntax, valid path, `Read` allowed.

For the create → sync → verify workflow, see `command-creation-guide.md`. For a
copy-paste starting point, see `../examples/command-template.md`.
