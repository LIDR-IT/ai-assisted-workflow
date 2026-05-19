# Rules Reference for Gemini CLI

> **Note:** Gemini CLI does not support rules like other agents. This document serves as an index to the project's rules located in `.agents/rules/`.

## Project Rules Location

All rules are centralized in: `.agents/rules/`

## Rules by Category

### Ucode

#### **[](../.agents/rules/code/principles.md)**
Core principles and architectural decisions

#### **[](../.agents/rules/code/style.md)**
Code style guidelines and conventions


---

### Ucontent

#### **[](../.agents/rules/content/copywriting.md)**
Review copy for effective copywriting principles and best practices


---

### Udesign

#### **[](../.agents/rules/design/web-design.md)**
Review UI code for Vercel Web Interface Guidelines compliance


---

### Uframeworks

#### **[](../.agents/rules/frameworks/react-native.md)**
Review React Native code for Vercel React Native Best Practices compliance


---

### LIDR SDLC

#### **[](../.agents/rules/lidr-sdlc/documentation.md)**
LIDR SDLC: Documentation governance — obligatory frontmatter, versioning, change tracking, staleness detection, update rules. Always applies when creating, reading or modifying any .md in the ecosystem.

#### **[](../.agents/rules/lidr-sdlc/org.md)**
LIDR SDLC: Organizational standards — values, methodology (Scrum + SDD), 8 SDLC phases with gates, RACI by role, quality and security policy. Tier-1 rule, always loaded.

#### **[](../.agents/rules/lidr-sdlc/project.md)**
LIDR SDLC: Active project context — domain, team, architecture, project-specific rules and current state. The rule that changes most between projects. Tier-1, always loaded.

#### **[](../.agents/rules/lidr-sdlc/tech-stack.md)**
LIDR SDLC: Tech stack conventions — TypeScript strict, React 18+, Node 20 LTS, ESM, Tailwind v4. Load when writing, reviewing or generating code.

#### **[](../.agents/rules/lidr-sdlc/workflows.md)**
LIDR SDLC: Workflow orchestration map — authorized roles per command, gate preconditions, skill chaining. Load when executing a command, evaluating a gate, or checking role permissions.


---

### Uprocess

#### **[](../.agents/rules/process/ai-workflow-system.md)**
Spec-driven development workflow from ticket creation to PR merge

#### **[](../.agents/rules/process/documentation.md)**
Documentation standards and practices

#### **[](../.agents/rules/process/git-workflow.md)**
Git workflow and commit conventions


---

### Uproduct

#### **[](../.agents/rules/product/mission.md)**
LIDR Template product mission, vision, and success metrics

#### **[](../.agents/rules/product/roadmap.md)**
LIDR Template Q1 2026 roadmap with phased delivery timeline


---

### Uquality

#### **[](../.agents/rules/quality/protect-secrets.md)**
Prevent AI from editing sensitive files (environment, keys, certificates)

#### **[](../.agents/rules/quality/testing-scripts.md)**
Review bash scripts for testing patterns and best practices

#### **[](../.agents/rules/quality/testing.md)**
Testing guidelines and best practices


---

### Uteam

#### **[](../.agents/rules/team/skills-management.md)**
Review project for skills structure and compliance

#### **[](../.agents/rules/team/third-party-security.md)**
Review third-party MCP/Skill security before installation


---

### Utools

#### **[](../.agents/rules/tools/claude-code-extensions.md)**
Review Claude Code extension structure and usage

#### **[](../.agents/rules/tools/use-context7.md)**
Always use Context7 MCP for library/API documentation


## Synchronization

Rules are synchronized across agents using:

```bash
./.agents/sync.sh
```

**Platform Support:**
- **Cursor:** Rules copied as .mdc files (flattened)
- **Claude Code:** Rules symlinked with subdirectories
- **Gemini CLI:** Index file (this document) - no native rules support
- **Copilot (VSCode):** Rules copied as .instructions.md (flattened)
- **Antigravity:** Rules read natively from .agents/rules/
