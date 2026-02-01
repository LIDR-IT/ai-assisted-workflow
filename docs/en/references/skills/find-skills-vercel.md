# find-skills - Skill Discovery Tool

## Overview

**find-skills** is a discovery and installation tool for the open agent skills ecosystem. It enables users to search for and install specialized skills that extend AI agent capabilities through an interactive interface.

**Source:** [skills.sh/vercel-labs/skills/find-skills](https://skills.sh/vercel-labs/skills/find-skills)
**Repository:** vercel-labs/skills
**Platform:** skills.sh
**Weekly Installs:** 55.6K

## Purpose

This skill helps you discover and install skills from the open agent skills ecosystem. It acts as a discovery layer that connects users with the right skills for their specific needs, making it easier to extend AI agent functionality without manually searching repositories.

## When to Use find-skills

Deploy this skill when users:
- Ask **"how do I do X"** where X is a common task with existing skills
- Request skill discovery: **"find a skill for X"**
- Ask about specialized capabilities: **"is there a skill that can..."**
- Want to extend agent functionality
- Search for tools, templates, or domain-specific workflows
- Need capabilities beyond the base agent

## Core Functionality

The underlying **Skills CLI** (`npx skills`) operates as a package manager with four primary commands:

### 1. Find Skills
```bash
npx skills find [query]
```
Search skills interactively or by keyword

### 2. Add Skills
```bash
npx skills add <package>
```
Install from GitHub or other sources

### 3. Check Updates
```bash
npx skills check
```
Check for updates to installed skills

### 4. Update Skills
```bash
npx skills update
```
Update all installed skills

## Usage Workflow

### Step 1: Identify User Needs
Determine:
- The user's domain (web dev, DevOps, testing, etc.)
- Specific task they want to accomplish
- Likelihood that a skill exists for this need

### Step 2: Search with Targeted Queries
Run focused searches:
```bash
npx skills find react performance
npx skills find docker deployment
npx skills find testing e2e
```

### Step 3: Present Results
Show users:
- **Skill name** and description
- **Install command** ready to copy
- **skills.sh link** for more details

### Step 4: Install the Skill
Execute installation:
```bash
npx skills add <owner/repo@skill> -g -y
```

**Flags:**
- `-g` — Global installation
- `-y` — Auto-accept (skip confirmation)

## Common Skill Categories

### Web Development
- React best practices and optimization
- Next.js patterns and performance
- TypeScript configurations
- CSS and styling strategies
- Tailwind CSS utilities

### Testing & Quality
- Jest configuration and patterns
- Playwright E2E testing
- Unit testing strategies
- Integration testing
- Test coverage optimization

### DevOps & Infrastructure
- Docker containerization
- Kubernetes deployment
- CI/CD pipelines
- Cloud platform integrations
- Infrastructure as Code

### Documentation
- API documentation generation
- Changelog automation
- README templates
- Documentation sites
- Code commenting standards

### Code Quality
- ESLint configurations
- Code refactoring patterns
- Pull request reviews
- Code style guides
- Automated formatting

### Design & UX
- UI/UX best practices
- Accessibility (a11y) guidelines
- Design system implementation
- Component libraries
- Responsive design patterns

### Productivity & Automation
- Git workflow automation
- Task automation scripts
- Development tooling
- Scaffolding generators
- Boilerplate templates

## Practical Examples

### Example 1: React Performance Optimization

**User Query:** "How can I optimize my React app's performance?"

**Workflow:**
```bash
# Step 1: Search for React performance skills
npx skills find react performance

# Step 2: Review results and select appropriate skill
# Results might include:
# - react-performance-optimization
# - react-rendering-patterns
# - react-profiling-guide

# Step 3: Install chosen skill
npx skills add vercel-labs/skills@react-performance -g -y
```

### Example 2: Setting Up E2E Testing

**User Query:** "I need to set up end-to-end testing"

**Workflow:**
```bash
# Search for E2E testing skills
npx skills find e2e testing

# Install Playwright skill
npx skills add vercel-labs/skills@playwright-e2e -g -y
```

### Example 3: Docker Deployment

**User Query:** "Help me containerize my application"

**Workflow:**
```bash
# Search for Docker skills
npx skills find docker deployment

# Install Docker skill
npx skills add vercel-labs/skills@docker-best-practices -g -y
```

## Integration with AI Agents

### Discovery Pattern

1. **User expresses need** → "I want to add authentication to my app"
2. **Agent uses find-skills** → Searches for authentication skills
3. **Agent presents options** → Shows available skills with descriptions
4. **User selects skill** → Agent installs the chosen skill
5. **Skill becomes available** → Agent can now use authentication patterns

### Proactive Suggestions

The agent can proactively suggest skills when:
- Detecting repetitive manual tasks
- Identifying common patterns that have skill support
- User struggles with a problem that has a known solution
- Starting a new project type with established best practices

## Skills.sh Platform

### What is skills.sh?

skills.sh is the official registry and discovery platform for agent skills. It serves as:
- **Central repository** for community and official skills
- **Discovery interface** for browsing available skills
- **Documentation hub** for skill usage and examples
- **Installation source** for the Skills CLI

### Platform Features

- **Browse by Category:** Explore skills organized by domain
- **Search Functionality:** Find skills by keyword or use case
- **Install Stats:** See popularity and adoption metrics
- **Version Management:** Track skill versions and updates
- **Community Contributions:** Submit and share custom skills

### URL Structure

```
https://skills.sh/<owner>/<repo>/<skill-name>
```

**Example:**
```
https://skills.sh/vercel-labs/skills/find-skills
```

## Skills CLI Architecture

### Installation Locations

**Global Skills:**
```
~/.claude/skills/
```

**Project Skills:**
```
project-dir/.claude/skills/
```

### Metadata Storage

Installed skills are registered in:
- `AGENTS.md` — Skill discovery metadata
- `package.json` — Dependency tracking (if npm-based)
- `.claude/skills/` — Skill content and files

### Update Mechanism

```bash
# Check for updates
npx skills check

# Apply updates
npx skills update

# Update specific skill
npx skills update <skill-name>
```

## Best Practices

### For Users

1. **Search before building**: Always check if a skill exists before creating custom solutions
2. **Use specific queries**: Narrow down searches with domain-specific keywords
3. **Review skill documentation**: Read skills.sh pages before installing
4. **Keep skills updated**: Regularly run `npx skills check` and `npx skills update`
5. **Install globally for common needs**: Use `-g` flag for skills you'll use across projects

### For Skill Discovery

1. **Start broad, then narrow**: Begin with category searches, refine with specifics
2. **Check install counts**: Higher installs often indicate mature, well-tested skills
3. **Read descriptions carefully**: Ensure the skill matches your exact need
4. **Test in isolation**: Try new skills in a test project first
5. **Combine complementary skills**: Some skills work better together

### For Skill Installation

1. **Use auto-confirm for known skills**: `-y` flag speeds up installation
2. **Global vs local**: Use global for general skills, local for project-specific
3. **Version pinning**: Pin versions for production projects
4. **Review permissions**: Check what access skills require
5. **Document in README**: List installed skills in project documentation

## Troubleshooting

### Skill Not Found

```bash
# Verify query syntax
npx skills find "exact skill name"

# Browse on skills.sh
open https://skills.sh/

# Search with different keywords
npx skills find alternative-keyword
```

### Installation Fails

```bash
# Check CLI version
npx skills --version

# Clear cache
rm -rf ~/.claude/skills/cache

# Reinstall CLI
npm install -g skills

# Try manual installation
npx skills add owner/repo@skill --verbose
```

### Skill Not Loading

```bash
# Verify installation
ls ~/.claude/skills/

# Check AGENTS.md
cat AGENTS.md

# Restart agent or IDE
# Skills may require agent reload
```

## Advanced Usage

### Custom Skill Sources

Install from custom sources:

```bash
# GitHub repository
npx skills add username/custom-repo@skill-name

# Local directory
npx skills add ./path/to/skill

# Private repository
npx skills add git@github.com:org/private-skills.git@skill-name
```

### Batch Installation

Install multiple skills at once:

```bash
# Create skills.json
cat > skills.json << EOF
{
  "skills": [
    "vercel-labs/skills@react-performance",
    "vercel-labs/skills@docker-best-practices",
    "vercel-labs/skills@playwright-e2e"
  ]
}
EOF

# Install from config
npx skills add --from-config skills.json
```

### Skill Development

Create and publish your own skills:

```bash
# Initialize new skill
npx skills init my-custom-skill

# Develop skill
# Edit SKILL.md and add supporting files

# Publish to GitHub
git add .
git commit -m "Add custom skill"
git push

# Share via skills.sh
# Submit PR to vercel-labs/skills registry
```

## Ecosystem Stats

- **Weekly Installs:** 55.6K (find-skills specifically)
- **Total Skills:** Growing community-driven ecosystem
- **Active Maintainers:** Vercel Labs + community contributors
- **Platform:** skills.sh with open-source CLI

## Related Tools

- **openskills** — Universal skills loader for multiple AI agents
- **npm-agentskills** — Framework-agnostic skill discovery
- **Claude Code** — Native skills support in Anthropic's CLI
- **skills npm package** — Core package manager for agent skills

## Resources

- **Browse Skills:** [skills.sh](https://skills.sh/)
- **find-skills Skill:** [skills.sh/vercel-labs/skills/find-skills](https://skills.sh/vercel-labs/skills/find-skills)
- **Skills CLI Repo:** [github.com/vercel-labs/skills](https://github.com/vercel-labs/skills)
- **Documentation:** [skills.sh/docs](https://skills.sh/docs)

---

**Last Updated:** January 2026
**Status:** Active Development
**Maintainer:** Vercel Labs
**Weekly Installs:** 55.6K
