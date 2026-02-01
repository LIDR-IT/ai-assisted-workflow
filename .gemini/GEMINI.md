# Rules Reference for Gemini CLI

> **Note:** Gemini CLI does not support rules like other agents. This document serves as an index to the project's rules located in `.agents/rules/`.

## Project Rules Location

All rules are centralized in: `.agents/rules/`

## Rules by Category

### Code Standards

#### **[Principles](../.agents/rules/code/principles.md)**
Core principles and architectural decisions for the project.

#### **[Style](../.agents/rules/code/style.md)**
Code style guidelines and formatting standards.

---

### Content Guidelines

#### **[Copywriting](../.agents/rules/content/copywriting.md)**
Copywriting and content standards for user-facing text.

---

### Design Standards

#### **[Web Design](../.agents/rules/design/web-design.md)**
Web interface guidelines and accessibility standards.

---

### Framework-Specific

#### **[React Native](../.agents/rules/frameworks/react-native.md)**
React Native best practices and performance optimization.

---

### Process & Workflow

#### **[Git Workflow](../.agents/rules/process/git-workflow.md)**
Git branching strategy, commit conventions, and PR guidelines.

#### **[Documentation](../.agents/rules/process/documentation.md)**
Documentation standards and writing guidelines.

---

### Quality Assurance

#### **[Testing](../.agents/rules/quality/testing.md)**
Testing philosophy, manual testing checklists, and verification.

#### **[Testing Scripts](../.agents/rules/quality/testing-scripts.md)**
Bash script testing patterns and best practices.

---

### Team Conventions

#### **[Skills Management](../.agents/rules/team/skills-management.md)**
Guidelines for managing AI agent skills at project level.

#### **[Third-Party Security](../.agents/rules/team/third-party-security.md)**
Security guidelines for third-party MCP servers and Skills.

---

### Tools & Extensions

#### **[Claude Code Extensions](../.agents/rules/tools/claude-code-extensions.md)**
Reference for extending Claude Code with skills, commands, and agents.

#### **[Use Context7](../.agents/rules/tools/use-context7.md)**
Guidelines for using Context7 MCP for library/API documentation.

---

## Synchronization

Rules are synchronized across agents using:

```bash
./.agents/rules/sync-rules.sh
```

**Platform Support:**
- **Cursor:** Rules copied as .mdc files (flattened)
- **Claude Code:** Rules symlinked with subdirectories
- **Gemini CLI:** Index file (this document) - no native rules support
- **Antigravity:** Rules symlinked with subdirectories

---

## Additional Resources

- **[README](../.agents/rules/README.md)** - Rules best practices guide
- **[YAML Formats](../.agents/rules/YAML-FORMATS.md)** - Platform-specific YAML frontmatter

---

*Last synchronized: 2026-02-02 00:53:16*
