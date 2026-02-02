---
name: product-mission
description: LIDR Template product mission, vision, and success metrics
alwaysApply: false
globs: ["docs/**/*.md", "README.md"]
argument-hint: <product-doc>
paths: ["docs/**/*.md"]
trigger: always_on
---

# Product Mission

## Product Identity

**Name:** LIDR Multi-Agent AI Development Template

**Tagline:** Centralized configuration management for multi-agent AI development across 4 platforms

**Version:** 1.0.0 (Q1 2026)

**Repository:** Enterprise-grade template for teams managing AI-assisted development workflows

## Target Audience

### Primary Users
- **Development Teams (5-50 developers):** Need consistent AI tooling across team members
- **Enterprise Organizations:** Require standardized AI development practices and compliance
- **DevOps Engineers:** Manage AI agent configurations across multiple platforms and projects

### Use Cases
- Onboarding new developers with pre-configured AI environments (<5 min vs 2-4 hours)
- Maintaining configuration consistency across Cursor, Claude Code, Gemini CLI, and Antigravity
- Scaling AI-assisted development practices across teams and departments
- Enforcing coding standards, security policies, and quality gates via AI agents

## Core Problem

**Configuration Fragmentation:** Teams using multiple AI platforms face:
- Manual duplication of rules, skills, commands, and MCP configurations
- Inconsistent behavior across platforms (rules work in Cursor but not Claude)
- 2-4 hours setup time per developer per project
- Configuration drift over time (changes not synchronized)
- No single source of truth for AI agent configurations

**Impact:**
- Wasted developer time on configuration management
- Inconsistent code quality and standards enforcement
- Security risks from outdated or missing configurations
- Poor onboarding experience for new team members

## Solution

**Centralized Source-of-Truth Pattern** with automated synchronization:

### Architecture
- **`.agents/` Directory:** Single source of truth for all configurations
- **Sync Scripts:** Automated propagation to platform-specific directories
- **Universal Patterns:** YAML frontmatter and structures work across all 4 platforms
- **Graceful Degradation:** Platform limitations handled automatically

### Key Components
1. **Rules:** Project-specific coding standards and guidelines (8 categories)
2. **Skills:** Reusable agent capabilities and knowledge modules
3. **Commands:** Slash commands for workflow automation
4. **Agents:** Specialized subagents for complex tasks
5. **MCP Servers:** External tool integrations (Context7, etc.)
6. **Hooks:** Git workflow automation (pre-commit, post-merge validation)

### Synchronization Strategies
- **Symlinks:** Instant propagation for Claude Code, Gemini CLI, Antigravity (skills/commands/agents)
- **Copy + Convert:** Cursor rules (flattened, .md → .mdc conversion)
- **Script Generation:** Platform-specific MCP configs and Gemini index files

## Success Metrics

**ALL 4 metrics are critical for product success:**

### 1. Setup Time Reduction
**Target:** <5 minutes vs 2-4 hours baseline (95%+ reduction)
**Measurement:** Time from `git clone` to fully configured environment
**Validation:** `time (./.agents/sync-all.sh)` completes in <5 minutes

### 2. Team Adoption Rate
**Target:** 80% of team members using template within 30 days
**Measurement:** Percentage of developers with synchronized configurations
**Validation:** Track commits with TICK-IDs, /command usage in logs

### 3. Configuration Consistency
**Target:** 99.9% synchronization accuracy across platforms
**Measurement:** Zero drift detected in periodic validation checks
**Validation:** `./.agents/sync-all.sh --dry-run` reports "No changes needed"

### 4. Developer Productivity
**Target:** 10+ hours saved per developer per quarter
**Breakdown:**
- Setup time savings: 2-4 hours per project
- Onboarding time reduction: 8 hours → 2 hours (6 hours saved)
- Maintenance overhead: 1 hour/week → 15 min/week (3 hours/month saved)
**Validation:** Quarterly developer surveys and time tracking

## Vision

**Short-term (Q1 2026):** Complete 6 pillars (Rules, Skills, Commands, Agents, MCP, Hooks) with spec-driven development workflows

**Mid-term (Q2-Q3 2026):** Industry adoption as standard for multi-agent AI development, community contributions, plugin ecosystem

**Long-term (2027+):** Platform-agnostic AI development framework, vendor-neutral standards, enterprise SaaS offering

## Core Values

### 1. Simplicity
- Native tools (bash, symlinks) over complex frameworks
- Clear documentation over clever code
- Explicit patterns over implicit magic

### 2. Consistency
- Single source of truth for all configurations
- Universal YAML frontmatter works everywhere
- Predictable synchronization behavior

### 3. Automation
- Sync scripts handle platform differences
- Hooks automate validation and quality gates
- Agents assist with repetitive tasks

### 4. Extensibility
- Plugin-based MCP server architecture
- Modular skills and commands
- Platform-agnostic patterns support future tools

## Anti-Patterns

**Never do these:**
- Manual config duplication across platforms (use sync scripts)
- Platform-specific silos (use universal YAML)
- Undocumented architectural decisions (document in .agents/rules/)
- Committing secrets or API keys (use environment variables)
- Breaking changes without migration guides (provide backwards compatibility)
- Ignoring platform limitations (document and handle gracefully)

## Product Boundaries

**In Scope:**
- Configuration management for 4 supported platforms
- Workflow automation via commands, agents, hooks
- Documentation and guidelines
- Example projects and templates

**Out of Scope:**
- AI model training or fine-tuning
- Custom AI agent development (outside MCP standard)
- Platform-specific feature development
- Real-time collaboration features
- Cloud hosting or SaaS delivery (initially)

## References

- Architecture: `.agents/rules/code/principles.md`
- Roadmap: `.agents/rules/product/roadmap.md`
- Workflow: `.agents/rules/process/ai-workflow-system.md`
- Setup Guide: `docs/guides/mcp/mcp-setup-guide.md`
