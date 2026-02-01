# NPM Package Ecosystem for Skills

## Overview

The **skills** npm package represents a breakthrough in AI agent extensibility, serving as a comprehensive package manager for AI coding assistants. Often described as "npm for AI agents," it provides a standardized, command-line interface for installing and managing specialized knowledge, best practices, and domain-specific capabilities across multiple AI platforms.

**Package:** `skills`
**Latest Version:** 1.0.6
**Registry:** [npm](https://www.npmjs.com/package/skills)
**Platform:** [skills.sh](https://skills.sh/)
**Weekly Installs:** 55.6K+ (find-skills skill alone)

### The "npm for AI Agents" Concept

Just as npm revolutionized JavaScript package management by providing a centralized registry and simple installation workflow, the skills package brings the same paradigm to AI agent capabilities. Instead of manually crafting prompts or searching for best practices, developers can now install battle-tested, community-vetted skills with a single command.

This ecosystem enables:
- **Instant knowledge transfer** to AI agents
- **Standardized best practices** across teams and projects
- **Community-driven skill development** and sharing
- **Cross-platform compatibility** across different AI coding assistants
- **Versioned skill management** with update mechanisms

## Installation

### Package Installation

Install the skills CLI globally for system-wide access:

```bash
npm i skills
```

Or install locally within a project:

```bash
npm i --save-dev skills
```

### Using npx (No Installation)

For one-off usage without installation:

```bash
npx skills [command]
```

This approach is ideal for:
- Testing the CLI before committing to installation
- CI/CD pipelines where you don't want global dependencies
- Ensuring you're always using the latest version

## Complete CLI Reference

The skills CLI provides a comprehensive set of commands for discovering, installing, managing, and updating agent skills.

### 1. Finding Skills: `npx skills find`

Search the skills registry interactively or by keyword to discover capabilities that match your needs.

**Syntax:**
```bash
npx skills find [query]
```

**Interactive Mode:**
```bash
npx skills find
```
Opens an interactive browser interface to explore available skills by category, popularity, or search.

**Keyword Search:**
```bash
npx skills find react performance
npx skills find docker deployment
npx skills find testing e2e
```

**Examples:**
```bash
# Find React optimization skills
npx skills find react performance

# Search for DevOps skills
npx skills find kubernetes deployment

# Discover testing frameworks
npx skills find playwright testing

# Find security best practices
npx skills find security audit
```

**Output:**
- Skill name and description
- Installation command
- skills.sh link for detailed documentation
- Popularity metrics (weekly installs)

### 2. Adding Skills: `npx skills add`

Install skills from GitHub, the skills.sh registry, or custom sources.

**Syntax:**
```bash
npx skills add <package> [flags]
```

**Flags:**
- `-g, --global` — Install globally (available in all projects)
- `-y, --yes` — Auto-accept installation (skip confirmation)
- `--verbose` — Show detailed installation logs
- `--from-config <file>` — Batch install from configuration file

**Examples:**

**Basic Installation:**
```bash
# Install from skills.sh registry
npx skills add vercel-labs/skills@react-performance
```

**Global Installation with Auto-Confirm:**
```bash
# Install globally and skip prompts
npx skills add vercel-labs/skills@react-performance -g -y
```

**Custom Sources:**
```bash
# Install from GitHub repository
npx skills add username/custom-repo@skill-name

# Install from local directory
npx skills add ./path/to/skill

# Install from private repository
npx skills add git@github.com:org/private-skills.git@skill-name
```

**Batch Installation:**
```bash
# Create skills configuration
cat > skills.json << EOF
{
  "skills": [
    "vercel-labs/skills@react-performance",
    "vercel-labs/skills@docker-best-practices",
    "vercel-labs/skills@playwright-e2e"
  ]
}
EOF

# Install all skills from config
npx skills add --from-config skills.json
```

**Installation Locations:**

**Global Skills:**
```
~/.claude/skills/
```

**Project Skills:**
```
project-dir/.claude/skills/
```

### 3. Checking for Updates: `npx skills check`

Check if installed skills have available updates without applying them.

**Syntax:**
```bash
npx skills check [skill-name]
```

**Examples:**
```bash
# Check all installed skills
npx skills check

# Check specific skill
npx skills check react-performance
```

**Output:**
```
Checking for updates...
  ✓ react-performance: 1.2.0 → 1.3.0 (update available)
  ✓ docker-best-practices: 2.0.1 (up to date)
  ✓ playwright-e2e: 1.5.0 → 1.6.2 (update available)

2 skills have updates available
Run 'npx skills update' to apply
```

### 4. Updating Skills: `npx skills update`

Update installed skills to their latest versions.

**Syntax:**
```bash
npx skills update [skill-name] [flags]
```

**Flags:**
- `-y, --yes` — Auto-accept updates (skip confirmation)
- `--all` — Update all skills regardless of version changes

**Examples:**
```bash
# Update all skills with confirmation
npx skills update

# Update all skills, auto-confirm
npx skills update -y

# Update specific skill
npx skills update react-performance

# Force update all skills
npx skills update --all -y
```

**Update Process:**
1. Checks for available updates
2. Shows changelog or version differences
3. Requests confirmation (unless `-y` flag used)
4. Downloads and applies updates
5. Validates skill integrity
6. Refreshes agent metadata

### 5. Listing Installed Skills: `npx skills list`

Display all currently installed skills with their versions and locations.

**Syntax:**
```bash
npx skills list [flags]
```

**Flags:**
- `--global` — Show only globally installed skills
- `--local` — Show only project-local skills
- `--verbose` — Show detailed information including file paths

**Examples:**
```bash
# List all installed skills
npx skills list

# List only global skills
npx skills list --global

# Show detailed information
npx skills list --verbose
```

**Output:**
```
Installed Skills:

Global Skills:
  react-performance (v1.3.0)
  └─ ~/.claude/skills/react-performance

  docker-best-practices (v2.0.1)
  └─ ~/.claude/skills/docker-best-practices

Project Skills:
  playwright-e2e (v1.6.2)
  └─ ./.claude/skills/playwright-e2e

Total: 3 skills (2 global, 1 local)
```

### 6. Removing Skills: `npx skills remove`

Uninstall skills from your system or project.

**Syntax:**
```bash
npx skills remove <skill-name> [flags]
```

**Flags:**
- `-g, --global` — Remove from global installation
- `-y, --yes` — Auto-confirm removal (skip prompt)

**Examples:**
```bash
# Remove project-local skill
npx skills remove playwright-e2e

# Remove global skill
npx skills remove react-performance -g

# Remove with auto-confirm
npx skills remove docker-best-practices -g -y
```

**Safety Features:**
- Confirmation prompt before removal (unless `-y` flag)
- Backup creation before deletion
- Dependency checking (warns if other skills depend on removed skill)

## Related Packages in the Ecosystem

The skills npm ecosystem comprises several complementary packages that work together to provide comprehensive agent skill management across platforms.

### OpenSkills: Universal Skills Loader

**Package:** `openskills`
**Purpose:** Universal skills loader for AI coding agents
**Repository:** [GitHub - numman-ali/openskills](https://github.com/numman-ali/openskills)
**Installation:** `npm i -g openskills`

**Description:**

OpenSkills brings Anthropic's skills system to multiple AI coding agents beyond Claude Code. Often described as "the universal installer for SKILL.md," it enables skill compatibility across:

- **Claude Code** — Anthropic's official CLI
- **Cursor** — AI-powered code editor
- **Windsurf** — AI development environment
- **Aider** — AI pair programming in the terminal
- **Codex** — OpenAI's code generation model

**Key Features:**

1. **Cross-Platform Compatibility:**
   - Automatically detects active AI agent
   - Adapts skill format to agent requirements
   - Maintains consistent skill behavior across platforms

2. **Universal Installation:**
   ```bash
   # Install for all compatible agents
   openskills install vercel-labs/skills@react-performance
   ```

3. **Skill Format Translation:**
   - Converts between different skill formats
   - Preserves metadata and examples
   - Ensures feature parity where possible

4. **Centralized Management:**
   - Single installation point for all agents
   - Shared skill cache to reduce duplication
   - Unified update mechanism

**Use Cases:**

- Teams using multiple AI coding assistants
- Developers switching between different AI agents
- Projects requiring consistent skills across tools
- Organizations standardizing AI agent capabilities

### npm-agentskills: Framework-Agnostic Discovery

**Package:** `npm-agentskills`
**Purpose:** Framework-agnostic skill discovery and export for AI coding agents
**Repository:** [GitHub - onmax/npm-agentskills](https://github.com/onmax/npm-agentskills)

**Description:**

npm-agentskills provides contextual documentation that AI coding assistants load automatically, delivering accurate guidance on APIs, patterns, and best practices. It enables npm package authors to bundle AI agent documentation directly with their packages.

**Key Features:**

1. **Automatic Documentation Discovery:**
   - AI agents automatically detect bundled skills
   - No manual installation required
   - Documentation stays in sync with package versions

2. **Package Integration:**
   ```json
   {
     "name": "my-library",
     "version": "1.0.0",
     "agentSkills": {
       "path": "./agent-skills/",
       "skills": [
         "api-reference",
         "best-practices",
         "migration-guide"
       ]
     }
   }
   ```

3. **Framework-Agnostic:**
   - Works with any AI coding assistant that supports skills
   - No platform-specific configuration required
   - Standard SKILL.md format

4. **Version-Aware:**
   - Skills version with package releases
   - Ensures documentation matches installed package version
   - Prevents outdated guidance

**Use Cases:**

- npm package authors providing AI agent documentation
- Libraries with complex APIs requiring detailed guidance
- Frameworks offering best practices and patterns
- Tools with specific configuration requirements

### agent-skill-npm-boilerplate: Skill Creation Template

**Repository:** [GitHub - neovateai/agent-skill-npm-boilerplate](https://github.com/neovateai/agent-skill-npm-boilerplate)
**Purpose:** Template for creating and publishing Claude Code skills as npm packages

**Description:**

A comprehensive boilerplate that provides the scaffolding needed to create, test, and publish professional agent skills as npm packages. It includes templates, testing frameworks, and publishing workflows.

**Key Features:**

1. **Complete Project Structure:**
   ```
   agent-skill-npm-boilerplate/
   ├── SKILL.md              # Main skill content
   ├── examples/             # Usage examples
   ├── tests/                # Skill validation tests
   ├── package.json          # npm package config
   └── README.md             # Documentation
   ```

2. **Built-in Testing:**
   - Skill syntax validation
   - Example verification
   - Integration tests
   - CI/CD configuration

3. **Publishing Workflow:**
   ```bash
   # Initialize from template
   npx degit neovateai/agent-skill-npm-boilerplate my-skill

   # Develop skill
   npm run dev

   # Test skill
   npm test

   # Publish to npm
   npm publish
   ```

4. **Documentation Templates:**
   - SKILL.md structure
   - README examples
   - Contributing guidelines
   - Changelog format

**Use Cases:**

- Creating custom skills for internal teams
- Publishing open-source skills to the community
- Standardizing skill development workflow
- Learning skill creation best practices

## Domain Coverage

The skills ecosystem provides comprehensive coverage across major software development domains, with particular strength in modern web development and cloud infrastructure.

### Front-End Development

**React & Next.js:**
- 10+ years of React optimization patterns
- Performance best practices and profiling
- State management strategies (Redux, Zustand, Context)
- Server-side rendering and static generation
- Component composition patterns
- Hooks best practices and custom hook patterns

**Styling & Design:**
- CSS-in-JS strategies (styled-components, Emotion)
- Tailwind CSS utility patterns
- Responsive design patterns
- Accessibility (a11y) guidelines
- Design system implementation
- Component library integration

**Build & Bundling:**
- Webpack optimization
- Vite configuration
- Build performance tuning
- Code splitting strategies
- Tree shaking optimization

### Back-End Development

**Node.js & APIs:**
- Express.js best practices
- RESTful API design patterns
- GraphQL schema design
- Authentication and authorization
- Microservices architecture
- Error handling and logging

**Databases:**
- SQL query optimization
- NoSQL data modeling
- ORM/ODM best practices
- Database migration strategies
- Connection pooling
- Caching strategies

**Security:**
- OWASP Top 10 mitigations
- Secure authentication patterns
- API security best practices
- Dependency vulnerability scanning
- Secrets management
- Security audit workflows

### DevOps & Infrastructure

**Containerization:**
- Docker best practices
- Multi-stage build optimization
- Container security
- Docker Compose orchestration
- Image size optimization

**Orchestration:**
- Kubernetes deployment patterns
- Service mesh configuration
- Helm chart development
- Resource management
- Auto-scaling strategies

**CI/CD:**
- GitHub Actions workflows
- GitLab CI pipelines
- Jenkins configuration
- Deployment strategies (blue-green, canary)
- Automated testing integration
- Release automation

**Cloud Platforms:**
- AWS services integration
- Google Cloud Platform patterns
- Azure deployment strategies
- Serverless architectures
- Infrastructure as Code (Terraform, CloudFormation)

### Testing & Quality

**Testing Frameworks:**
- Jest configuration and patterns
- Playwright E2E testing
- Cypress integration testing
- Unit testing strategies
- Test coverage optimization
- Mock data generation

**Code Quality:**
- ESLint configurations
- Prettier formatting rules
- TypeScript strict mode patterns
- Code review automation
- Static analysis tools
- Performance profiling

## Security Considerations

The skills ecosystem, while powerful, introduces important security considerations that all users must understand and address.

### The Hallucinated npx Command Problem

**Critical Security Notice:**

AI agent skills can propagate hallucinated npx commands, creating real security and reliability risks for developers and supply chains. This phenomenon occurs when:

1. **AI generates plausible but non-existent packages:**
   ```bash
   # AI might suggest:
   npx create-perfect-app@latest my-app
   # But this package doesn't actually exist
   ```

2. **Malicious actors squat on hallucinated names:**
   - Monitor AI outputs for commonly hallucinated package names
   - Register those packages with malicious code
   - Wait for developers to blindly execute suggested commands

3. **Supply chain compromise:**
   - Developers trust AI suggestions without verification
   - Execute malicious code with npx (which auto-installs)
   - Compromise local development environment or credentials

**Reference:** [Agent Skills Are Spreading Hallucinated npx Commands](https://www.aikido.dev/blog/agent-skills-spreading-hallucinated-npx-commands)

### Verification Best Practices

**Before Installing Any Skill:**

1. **Verify Package Existence:**
   ```bash
   # Check on npm registry
   npm view skills

   # Check GitHub repository
   open https://github.com/vercel-labs/skills
   ```

2. **Review Package Metadata:**
   ```bash
   # View package info
   npm info <package-name>

   # Check weekly downloads (popularity indicator)
   npm info <package-name> dist.tarball
   ```

3. **Check Repository Authenticity:**
   - Verify GitHub organization/user reputation
   - Check repository age and activity
   - Review commit history and contributors
   - Look for official verification badges

4. **Examine Source Code:**
   ```bash
   # Clone and inspect before installing
   git clone https://github.com/owner/repo
   cd repo
   cat SKILL.md
   ```

5. **Use Explicit Sources:**
   ```bash
   # Good: Explicit GitHub source
   npx skills add vercel-labs/skills@react-performance

   # Risky: Implicit package resolution
   npx random-package-name
   ```

### Source Validation

**Trusted Sources:**

1. **Official Vercel Labs Skills:**
   ```bash
   npx skills add vercel-labs/skills@<skill-name>
   ```
   - Maintained by Vercel
   - High install counts
   - Regular updates
   - Community vetted

2. **Popular Community Skills:**
   - Check weekly install counts (>1K indicates adoption)
   - Review on skills.sh platform
   - Examine GitHub stars and forks
   - Look for active maintenance

3. **Internal/Team Skills:**
   ```bash
   # Install from private repository
   npx skills add git@github.com:your-org/skills.git@skill-name
   ```
   - Full control over source
   - Internal security review process
   - Team-specific best practices

**Red Flags:**

- Package suggested by AI but not found on npm/GitHub
- Very low or zero install counts
- Recently created with no commit history
- Suspicious package name (typosquatting)
- Requests unusual permissions
- No source code available for inspection

### Safe Usage Guidelines

1. **Never Blindly Execute AI Suggestions:**
   - Always verify package names
   - Check multiple sources (npm, GitHub, skills.sh)
   - Review what the skill does before installation

2. **Use Project-Local Installation by Default:**
   ```bash
   # Project-local (safer)
   npx skills add vercel-labs/skills@react-performance

   # Global (affects all projects)
   npx skills add vercel-labs/skills@react-performance -g
   ```

3. **Pin Versions in Production:**
   ```json
   {
     "skills": [
       "vercel-labs/skills@react-performance@1.3.0"
     ]
   }
   ```

4. **Review Skills in Code Review:**
   - Include `.claude/skills/` in version control
   - Review skill additions in pull requests
   - Document why each skill is needed

5. **Audit Installed Skills Regularly:**
   ```bash
   # List all installed skills
   npx skills list --verbose

   # Remove unused skills
   npx skills remove unused-skill
   ```

## Use Cases

The skills npm ecosystem excels in several key scenarios that benefit from standardized, shareable agent capabilities.

### Multi-Domain Projects

**Scenario:** Building a full-stack application requiring expertise in multiple domains.

**Challenge:**
- Front-end (React/Next.js)
- Back-end (Node.js/Express)
- DevOps (Docker/Kubernetes)
- Security best practices
- Testing strategies

**Solution with Skills:**
```bash
# Front-end skills
npx skills add vercel-labs/skills@react-performance -g -y
npx skills add vercel-labs/skills@nextjs-best-practices -g -y

# Back-end skills
npx skills add vercel-labs/skills@nodejs-patterns -g -y
npx skills add vercel-labs/skills@api-security -g -y

# DevOps skills
npx skills add vercel-labs/skills@docker-best-practices -g -y
npx skills add vercel-labs/skills@kubernetes-deployment -g -y

# Testing skills
npx skills add vercel-labs/skills@playwright-e2e -g -y
```

**Benefits:**
- AI agent gains expertise across all domains
- Consistent best practices throughout stack
- No need to manually specify requirements for each area
- Faster development with domain-specific guidance

### Cross-Agent Compatibility

**Scenario:** Team uses multiple AI coding assistants (Claude Code, Cursor, Windsurf).

**Challenge:**
- Different agents with different capabilities
- Need consistent behavior across tools
- Skill compatibility issues

**Solution with OpenSkills:**
```bash
# Install OpenSkills globally
npm i -g openskills

# Install skills for all agents at once
openskills install vercel-labs/skills@react-performance
openskills install vercel-labs/skills@testing-best-practices
```

**Benefits:**
- Single installation works across all agents
- Consistent skill behavior regardless of tool
- Reduced management overhead
- Team members can choose preferred AI assistant

### Team Standardization

**Scenario:** Development team needs standardized coding practices and patterns.

**Challenge:**
- Inconsistent code styles across developers
- Different approaches to common problems
- Knowledge silos (some developers know best practices, others don't)
- Onboarding friction for new team members

**Solution with Custom Skills:**

**Step 1: Create Team Skills Repository**
```bash
# Initialize team skills repo
git clone https://github.com/neovateai/agent-skill-npm-boilerplate team-skills
cd team-skills

# Customize for team
vim SKILL.md
```

**Step 2: Define Team Standards**
```markdown
# Team Coding Standards

## React Component Patterns

Always use functional components with hooks:
```typescript
// Good
export const Component = () => {
  const [state, setState] = useState()
  return <div>{state}</div>
}

// Avoid
export class Component extends React.Component {
  // ...
}
```

## Error Handling

Use centralized error handling:
```typescript
try {
  await riskyOperation()
} catch (error) {
  logger.error('Operation failed', { error, context })
  throw new AppError('User-friendly message', { cause: error })
}
```
```

**Step 3: Distribute to Team**
```bash
# Publish to private npm
npm publish --access restricted

# Or install from GitHub
npx skills add your-org/team-skills@coding-standards -g -y
```

**Benefits:**
- AI agents learn team-specific patterns
- Automatic code review against team standards
- Consistent onboarding experience
- Living documentation that evolves with team practices

### React/Next.js Development with 10+ Years of Best Practices

**Scenario:** Building a modern React/Next.js application.

**Pre-Skills Workflow:**
- Manually research performance patterns
- Trial and error with optimization techniques
- Inconsistent application of best practices
- Time spent on preventable mistakes

**With Skills:**
```bash
npx skills add vercel-labs/skills@react-performance -g -y
npx skills add vercel-labs/skills@nextjs-patterns -g -y
```

**AI Agent Now Knows:**
- React.memo() and useMemo() optimization patterns
- Lazy loading and code splitting strategies
- Image optimization with Next.js Image component
- Font loading best practices
- Incremental Static Regeneration (ISR) patterns
- Server Components vs Client Components decisions
- Hydration optimization
- Bundle size reduction techniques

**Result:**
- Faster development with fewer performance issues
- Automatic application of battle-tested patterns
- Reduced technical debt from day one

---

## Related Documentation

### Core Skills Documentation
- [Installation Guide](../02-installation/installation.md) — Installing and configuring skills
- [Discovery Methods](../05-discovery/discovery.md) — Finding the right skills
- [Local Skills Development](../03-creating-skills/local-skills.md) — Creating custom skills

### Platform Integration
- [Skills in Claude Code](../../references/skills/README.md) — Claude Code skills ecosystem
- [MCP Skills Integration](../../guides/mcp/mcp-setup-guide.md) — Model Context Protocol for skills

### Security
- [Third-Party Security Guidelines](../../guidelines/team-conventions/third-party-security-guidelines.md) — Security best practices
- [Skills Management Guidelines](../../guidelines/team-conventions/skills-management-guidelines.md) — Team skill governance

---

**Last Updated:** February 2026
**Status:** Active Development
**Maintainer:** Vercel Labs
**Ecosystem Size:** 55.6K+ weekly installs (growing)
