---
layout: home

hero:
  name: LIDR
  text: Internal Documentation
  tagline: Team best practices, guides, and references
  actions:
    - theme: brand
      text: Get Started
      link: /en/modules/skills/
    - theme: alt
      text: View Guides
      link: /en/guides/

features:
  - icon: 🎓
    title: Learning Modules
    details: Structured documentation on Skills, MCP, Agents, and more
    link: /en/modules/skills/

  - icon: 📚
    title: Step-by-Step Guides
    details: Detailed instructions for setting up and using team tools
    link: /en/guides/

  - icon: 📖
    title: Technical References
    details: Technical documentation for agents, MCP servers, and development tools
    link: /en/references/

  - icon: ✨
    title: Guidelines
    details: Code standards, design patterns, and team conventions
    link: /en/guidelines/

  - icon: 🔬
    title: Research Notes
    details: Comparative analysis and exploration of new technologies
    link: /en/notes/
---

## Quick Start

This documentation is organized into main sections:

### 🎓 [Modules](/en/modules/skills/)
Structured and comprehensive documentation on different topics.

**Highlights:**
- [Skills Module](/en/modules/skills/) - Everything about Skills and their ecosystem

### 📚 [Guides](/en/guides/)
Step-by-step instructions for specific tasks.

### 📖 [References](/en/references/)
Detailed technical documentation about systems, APIs, and architecture.

### ✨ [Guidelines](/en/guidelines/)
Team standards and best practices.

### 🔬 [Notes](/en/notes/)
Research and technical analysis.

## Project Structure

```
.agents/              # Centralized configurations
├── mcp/             # MCP server configs
├── rules/           # Project rules
├── skills/          # Agent skills
├── commands/        # Slash commands
└── agents/          # Subagents

docs/                # This documentation
├── es/              # Spanish (default)
│   ├── modules/     # Learning modules
│   ├── guides/      # Practical guides
│   └── references/  # Technical references
└── en/              # English
```

## Contributing

To improve this documentation:

1. Edit files in `docs/es/` or `docs/en/`
2. Changes are reflected automatically in development
3. Create a PR with your improvements

```bash
# Local development
npm run docs:dev

# Production build
npm run docs:build
```

---

::: tip Quick Search
Use `Cmd/Ctrl + K` to search across all documentation
:::
