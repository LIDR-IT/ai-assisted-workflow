# Skills.sh Marketplace Platform

## Overview

**Skills.sh** is the official registry and discovery platform for the open agent skills ecosystem. It serves as the central marketplace where developers can browse, search, and explore thousands of community-contributed skills designed to enhance AI agents with specialized procedural knowledge.

**Official Site:** [https://skills.sh](https://skills.sh)

**Platform Purpose:**
- Central directory of reusable agent capabilities
- Discovery interface for browsing and searching skills
- Community hub for sharing expertise
- Quality metrics and validation through install counts
- Version management and tracking

With over 72,000 installs for top skills and consistent growth across categories, skills.sh has become the primary marketplace for AI agent capabilities, similar to how npm serves the JavaScript ecosystem or PyPI serves Python.

## Platform Overview

### What is Skills.sh?

Skills.sh is an open ecosystem platform that hosts reusable capabilities for AI agents. Unlike traditional package registries that distribute code libraries, skills.sh distributes procedural knowledge — the "how-to" instructions that teach AI agents to accomplish specific tasks, follow domain-specific best practices, and execute complex workflows.

**Core Concept:**
Instead of explaining the same patterns and procedures repeatedly to your AI agent, you install a skill once and the agent has permanent access to that specialized knowledge.

### Central Directory Concept

Skills.sh operates as a centralized registry where:

**Publishers** can:
- Share expertise with the community
- Distribute best practices across teams
- Build reputation in specific domains
- Contribute to the AI agent ecosystem

**Users** can:
- Discover skills by browsing categories
- Search for specific capabilities
- Compare similar skills
- Install with a single command
- Track versions and updates

**The Platform** provides:
- Standardized skill format (SKILL.md)
- Quality indicators (install counts, trending status)
- Documentation hub
- Version control
- Community validation

### Discovery Interface

The skills.sh discovery interface offers multiple pathways to find relevant skills:

**Browse by Category:**
- Organized into major domains (Development, Design, Infrastructure, Marketing, Business, Tools)
- Subcategories for specialized areas
- Curated collections of related skills

**Search Functionality:**
- Keyword-based search
- Multi-term queries
- Relevance ranking
- Filter by install count
- Sort by trending status

**Quality Metrics:**
- Installation counts (All Time, 24h, Hot)
- Trending indicators
- Community validation
- Version tracking

**Documentation Hub:**
- Detailed skill descriptions
- Use cases and examples
- Installation instructions
- Prerequisites and dependencies
- Related skills

## Platform Features

### 1. Browse by Category

Skills.sh organizes the ecosystem into six major categories, making domain-specific discovery intuitive and efficient.

**Category Structure:**
```
Development/
├── Frameworks (React, Vue, Angular, Next.js)
├── Languages (TypeScript, JavaScript, Python)
├── Best Practices (Code quality, performance, testing)
└── Tools (Build systems, linters, formatters)

Design/
├── UI/UX (Component design, user flows)
├── Accessibility (WCAG compliance, a11y patterns)
├── Visual Design (Layout, typography, color)
└── Design Systems (Tokens, components, guidelines)

Infrastructure/
├── Cloud Platforms (AWS, Azure, GCP, Supabase)
├── DevOps (CI/CD, deployment, monitoring)
├── Containers (Docker, Kubernetes, orchestration)
└── Security (Auth, encryption, compliance)

Marketing/
├── SEO (Technical SEO, content optimization)
├── Copywriting (Conversion, brand voice, CTAs)
├── Content Strategy (Planning, distribution, analytics)
└── Analytics (Metrics, tracking, insights)

Business/
├── Strategy (Market analysis, competitive research)
├── Pricing (Models, value-based pricing)
├── Launch (Go-to-market, checklists, metrics)
└── Operations (Process optimization, workflows)

Specialized Tools/
├── File Handling (PDF, PPTX, XLSX, documents)
├── Automation (Browser, email, workflows)
├── Integrations (APIs, third-party services)
└── Data Processing (ETL, transformation, analysis)
```

### 2. Search Functionality

The platform's search engine enables precise skill discovery through keyword matching and relevance ranking.

**Search Features:**
- **Keyword matching:** Search by skill name, description, or tags
- **Multi-term queries:** Combine keywords for precision (e.g., "react performance optimization")
- **Relevance ranking:** Results ordered by match quality and popularity
- **Fuzzy matching:** Finds skills even with slight spelling variations
- **Category filtering:** Narrow results to specific domains

**Search Examples:**
```bash
# Framework-specific
Search: "react performance"
Results: vercel-react-best-practices, react-rendering-patterns, react-profiling

# Task-oriented
Search: "docker deployment"
Results: docker-best-practices, kubernetes-deployment, container-optimization

# Domain-focused
Search: "copywriting conversion"
Results: copywriting, landing-page-copy, email-marketing-copy
```

**Search Best Practices:**
- Be specific: "react hooks optimization" vs. "react"
- Include domain: "frontend design" vs. "design"
- Combine task + tool: "playwright e2e testing"
- Use common terminology: "auth" may work better than "authentication"

### 3. Install Stats and Metrics

Skills.sh provides transparency through installation metrics, enabling data-driven skill selection.

**Metrics Tracked:**

**Installation Count (All Time):**
- Total lifetime installs
- Indicator of long-term value
- Community validation signal
- Production readiness gauge

**Trending (24h):**
- Recent install velocity
- Sudden popularity spikes
- New discoveries
- Emerging needs indicator

**Hot:**
- Sustained high growth
- Consistent adoption rate
- Current relevance
- Essential capability marker

**Metric Interpretation:**

| Install Count | Interpretation |
|---------------|----------------|
| >50K | Community validated, production ready, well documented, actively maintained |
| 10K-50K | Growing adoption, specialized use cases, niche expertise, emerging patterns |
| <10K | New releases, experimental, highly specialized, beta/testing |

**Example Metrics:**
```
vercel-react-best-practices: 72.7K installs (All Time)
  → Highly validated, production-ready React guidance

find-skills: 56.5K installs (All Time)
  → Essential discovery tool, widely adopted

web-design-guidelines: 55.1K installs (All Time)
  → Trusted design standards, community favorite

copywriting: 48.2K installs (All Time)
  → Proven copywriting patterns, strong adoption

mcp-integration: 45.3K installs (All Time)
  → Critical integration skill, growing need
```

### 4. Version Management

Skills.sh tracks skill versions, enabling:
- Stable production deployments
- Controlled updates
- Backward compatibility
- Change tracking

**Version Features:**
- **Semantic versioning:** Major.minor.patch (e.g., 2.1.3)
- **Update notifications:** Alerts when new versions available
- **Changelog tracking:** See what changed between versions
- **Pinning support:** Lock to specific version

**Version Commands:**
```bash
# Install latest version
npx skills add vercel-labs/skills@react-best-practices

# Install specific version
npx skills add vercel-labs/skills@react-best-practices@2.1.0

# Check for updates
npx skills check

# Update to latest
npx skills update react-best-practices
```

### 5. Community Contributions

Skills.sh thrives on community participation, with thousands of contributors sharing expertise.

**Contribution Benefits:**
- Share specialized knowledge
- Build professional reputation
- Help standardize best practices
- Receive community feedback
- Iterate based on usage patterns

**Popular Contributors:**
- **vercel-labs:** Official Vercel skills (React, Next.js, web design)
- **Community experts:** Domain specialists sharing niche knowledge
- **Organizations:** Companies sharing internal best practices
- **Open source maintainers:** Framework-specific guidance

**Contribution Process:**
1. Create skill in SKILL.md format
2. Test with AI agents
3. Publish to GitHub repository
4. Submit to skills.sh directory
5. Promote and maintain

### 6. URL Structure

Skills.sh uses a consistent, predictable URL pattern that mirrors repository structure.

**Pattern:**
```
https://skills.sh/<owner>/<repo>/<skill-name>
```

**Components:**
- `owner`: GitHub username or organization
- `repo`: Repository name
- `skill-name`: Specific skill identifier

**Examples:**
```
https://skills.sh/vercel-labs/skills/find-skills
https://skills.sh/vercel-labs/skills/vercel-react-best-practices
https://skills.sh/vercel-labs/skills/web-design-guidelines
https://skills.sh/vercel-labs/skills/copywriting
https://skills.sh/vercel-labs/skills/mcp-integration
```

**URL Benefits:**
- Direct linking to specific skills
- Repository navigation
- Share skills via link
- Bookmark favorite skills
- Embed in documentation

## Popular Skills Categories

### 1. Development

**Focus:** Programming languages, frameworks, libraries, and development best practices

**Description:**
The Development category encompasses skills for modern software development, including framework-specific patterns, language best practices, testing strategies, and performance optimization. These skills help developers write better code, follow industry standards, and avoid common pitfalls.

**Popular Skills:**

**vercel-react-best-practices** (72.7K installs)
- React optimization patterns
- Modern React patterns (hooks, context, suspense)
- Performance best practices
- Component architecture
- State management strategies
- Server Components guidance

**Next.js patterns**
- App Router best practices
- Server Components vs. Client Components
- Deployment optimization
- API route patterns
- Incremental Static Regeneration
- Edge runtime usage

**Vue expertise**
- Vue 3 Composition API
- Reactivity system patterns
- Component design principles
- Pinia state management
- Vue Router navigation
- Nuxt.js integration

**TypeScript patterns**
- Type safety strategies
- Advanced type techniques
- Generics and utilities
- Strict mode configuration
- Third-party library typing
- Monorepo TypeScript setup

**Examples:**
```bash
# Install React best practices
npx skills add vercel-labs/skills@vercel-react-best-practices -g

# Install TypeScript patterns
npx skills add typescript-patterns -g

# Install testing strategies
npx skills add testing-best-practices -g
```

### 2. Design

**Focus:** UI/UX design, visual design, accessibility, user experience patterns

**Description:**
Design skills provide guidance on creating accessible, responsive, and visually appealing user interfaces. They cover design systems, component libraries, accessibility standards, and user experience principles that ensure applications are both beautiful and usable.

**Popular Skills:**

**web-design-guidelines** (55.1K installs)
- Accessibility standards (WCAG compliance)
- Responsive design patterns
- Design system implementation
- Typography best practices
- Color theory and usage
- Layout techniques

**UI/UX patterns**
- Component library design
- Design tokens and theming
- User flow optimization
- Interaction patterns
- Micro-interactions
- Design handoff processes

**Frontend design**
- Modern layout techniques (Grid, Flexbox)
- CSS architecture (BEM, CSS Modules, Tailwind)
- Animation patterns
- Mobile-first design
- Progressive enhancement
- Performance optimization

**Examples:**
```bash
# Install web design guidelines
npx skills add vercel-labs/skills@web-design-guidelines -g

# Install accessibility patterns
npx skills add a11y-best-practices -g

# Install component design
npx skills add component-library-design -g
```

### 3. Infrastructure

**Focus:** DevOps, deployment, cloud platforms, containerization, orchestration

**Description:**
Infrastructure skills cover modern DevOps practices, cloud platform integration, container orchestration, and deployment pipelines. They help teams build reliable, scalable, and maintainable infrastructure that supports continuous delivery.

**Popular Skills:**

**Supabase integration**
- Database schema design
- Row-level security (RLS) patterns
- Authentication setup
- Real-time subscriptions
- Edge Functions deployment
- Storage bucket configuration

**Deployment pipelines**
- CI/CD workflow design
- Automated testing integration
- Release management strategies
- Blue-green deployments
- Canary releases
- Rollback procedures

**Kubernetes patterns**
- Container orchestration
- Service mesh implementation
- Horizontal pod autoscaling
- ConfigMap and Secret management
- Ingress configuration
- Monitoring and observability

**Examples:**
```bash
# Install Supabase patterns
npx skills add supabase-integration -g

# Install Docker best practices
npx skills add docker-best-practices -g

# Install Kubernetes patterns
npx skills add kubernetes-patterns -g
```

### 4. Marketing

**Focus:** SEO, content strategy, copywriting, analytics, conversion optimization

**Description:**
Marketing skills help teams optimize content for search engines, write compelling copy that converts, and develop data-driven content strategies. They combine technical SEO knowledge with persuasive writing techniques and analytics insights.

**Popular Skills:**

**SEO audits**
- Technical SEO optimization
- Content optimization strategies
- Performance metrics (Core Web Vitals)
- Schema markup implementation
- Link building strategies
- Local SEO patterns

**copywriting** (48.2K installs)
- Conversion optimization techniques
- Brand voice development
- Call-to-action patterns
- Headline formulas
- Storytelling frameworks
- Email copywriting

**Content strategy**
- Content calendar planning
- Distribution channel optimization
- Content repurposing
- Analytics and measurement
- Audience targeting
- Content lifecycle management

**Examples:**
```bash
# Install copywriting patterns
npx skills add vercel-labs/skills@copywriting -g

# Install SEO best practices
npx skills add seo-optimization -g

# Install content strategy
npx skills add content-strategy -g
```

### 5. Business

**Focus:** Strategy, planning, analysis, pricing, go-to-market

**Description:**
Business skills provide frameworks for strategic decision-making, competitive analysis, pricing strategies, and product launches. They help teams make data-driven business decisions and execute effective go-to-market strategies.

**Popular Skills:**

**Pricing strategy**
- Pricing model selection (subscription, usage-based, tiered)
- Value-based pricing techniques
- Competitive analysis frameworks
- Price optimization
- Discount strategies
- Pricing psychology

**Launch planning**
- Go-to-market strategy development
- Launch checklist creation
- Success metrics definition
- Channel selection
- Messaging and positioning
- Post-launch optimization

**Market analysis**
- Competitor research methods
- Market sizing techniques
- Trend analysis frameworks
- Customer segmentation
- SWOT analysis
- Product-market fit validation

**Examples:**
```bash
# Install pricing strategy
npx skills add pricing-strategy -g

# Install launch planning
npx skills add product-launch -g

# Install market analysis
npx skills add market-research -g
```

### 6. Specialized Tools

**Focus:** File handling, automation, integrations, data processing

**Description:**
Specialized tool skills provide capabilities for working with specific file formats, automating workflows, integrating third-party services, and processing data. These skills extend AI agents with practical utilities for common but complex tasks.

**Popular Skills:**

**PDF/PPTX/XLSX handling**
- Document generation from templates
- Data extraction from files
- Format conversion (PDF to text, Excel to JSON)
- Batch processing
- Watermarking and security
- Report generation

**Browser automation**
- Web scraping techniques
- End-to-end testing automation
- Workflow automation (form filling, data entry)
- Screenshot capture
- Session management
- Error handling

**Email workflows**
- Email template design
- Automation rule creation
- Integration patterns (SendGrid, Mailgun)
- Deliverability optimization
- Analytics tracking
- Transactional email patterns

**Examples:**
```bash
# Install PDF handling
npx skills add pdf-generation -g

# Install browser automation
npx skills add playwright-automation -g

# Install email workflows
npx skills add email-automation -g
```

## Top Skills Leaderboard

### Most Installed (All Time)

The all-time leaderboard showcases skills with proven long-term value and widespread community adoption.

**Top 5 Skills:**

**1. vercel-react-best-practices** — 72.7K installs
- **Category:** Development
- **Focus:** React optimization and modern patterns
- **Why it's popular:** Comprehensive React guidance from Vercel, covering performance, Server Components, and production best practices
- **Key features:** Hook patterns, component architecture, rendering optimization, state management
- **Use case:** Essential for any React development project

**2. find-skills** — 56.5K installs
- **Category:** Ecosystem Tool
- **Focus:** Skill discovery and recommendation
- **Why it's popular:** Makes discovering new skills effortless through intelligent search and recommendations
- **Key features:** Keyword search, category filtering, smart suggestions, direct installation
- **Use case:** First skill to install when starting with the skills ecosystem

**3. web-design-guidelines** — 55.1K installs
- **Category:** Design
- **Focus:** Web interface design standards
- **Why it's popular:** Comprehensive accessibility, responsive design, and visual design best practices
- **Key features:** WCAG compliance, design systems, layout patterns, typography
- **Use case:** Building accessible, beautiful web interfaces

**4. copywriting** — 48.2K installs
- **Category:** Marketing
- **Focus:** Effective copywriting principles
- **Why it's popular:** Proven frameworks for conversion-focused copy across all formats
- **Key features:** Headline formulas, CTA patterns, brand voice, storytelling
- **Use case:** Landing pages, marketing content, product copy

**5. mcp-integration** — 45.3K installs
- **Category:** Infrastructure
- **Focus:** Model Context Protocol integration
- **Why it's popular:** Critical for extending AI agents with external tools and resources
- **Key features:** MCP server setup, tool integration, resource management
- **Use case:** Connecting AI agents to databases, APIs, file systems

### Trending Skills (24h)

Trending skills show rapid recent growth, indicating emerging needs, viral discovery, or new releases gaining traction.

**Trending Indicators:**
- **Spike pattern:** Sudden increase in 24h install rate
- **New releases:** Recently published skills gaining attention
- **Viral discovery:** Shared on social media or forums
- **Emerging needs:** New problems being solved
- **Community validation:** Rapid testing and adoption

**What trending means:**
- High velocity in last 24 hours
- Install rate significantly above baseline
- Community actively testing and evaluating
- Potential to become mainstream
- Early adoption opportunity

**How to use trending:**
1. Check trending section daily
2. Investigate high-velocity skills
3. Read descriptions and use cases
4. Test in development environment
5. Adopt if valuable to your workflow

### Hot Skills

Hot skills maintain sustained high install velocity over extended periods, indicating essential capabilities and consistent value delivery.

**Hot Indicators:**
- **Consistent growth:** Steady high install rate over weeks/months
- **Community adoption:** Widespread use across projects
- **Essential capability:** Solves common, recurring problems
- **Quality implementation:** Well-documented, maintained, reliable
- **Strong retention:** Users continue using after installation

**Hot vs. Trending:**
- **Trending:** Spike in 24h (may be temporary)
- **Hot:** Sustained velocity (proven staying power)

**Hot skill characteristics:**
- Consistently in top 20 by install velocity
- Regular updates and maintenance
- Active community engagement
- High satisfaction and retention
- Cross-domain applicability

### Quality Indicators Explained

Understanding quality metrics helps make informed skill selection decisions.

**Installation Count Significance:**

**>50K installs:**
- **Community validated:** Thousands of users trust this skill
- **Production ready:** Proven in real-world projects
- **Well documented:** Comprehensive guides and examples
- **Actively maintained:** Regular updates and improvements
- **Low risk:** Safe bet for critical projects

**10K-50K installs:**
- **Growing adoption:** Gaining community traction
- **Specialized use cases:** Solves specific problems well
- **Niche expertise:** Domain-specific deep knowledge
- **Emerging patterns:** New approaches being validated
- **Medium risk:** Test before production use

**<10K installs:**
- **New releases:** Recently published, early stage
- **Experimental:** Testing new approaches
- **Highly specialized:** Very narrow use case
- **Beta/testing:** Not yet production-ready
- **Higher risk:** Thorough testing required

**Time-Based Metrics:**

**All Time:**
- Measures total lifetime value
- Indicates sustained usefulness
- Shows long-term community trust
- Best for: Production decisions

**Trending 24h:**
- Measures recent popularity spike
- Indicates emerging needs
- Shows viral discovery
- Best for: Early adoption, innovation

**Hot:**
- Measures sustained velocity
- Indicates essential capability
- Shows consistent value
- Best for: Critical infrastructure

## Supported AI Agents

Skills.sh supports 20+ AI coding agents through a standardized SKILL.md format, enabling write-once, use-everywhere compatibility.

### Major Platforms

**Claude Code** (Anthropic)
- Official CLI for Claude Sonnet
- Comprehensive skills support
- Command and agent integration
- MCP compatibility

**GitHub Copilot** (GitHub/Microsoft)
- VS Code integration
- Skills loaded via workspace
- Inline suggestions enhanced by skills
- Chat interface support

**Cursor** (Anysphere)
- IDE-integrated AI agent
- Skills directory support
- Command palette integration
- Full skills ecosystem access

**Cline** (Cline AI)
- Terminal-based agent
- Skills discovery tools
- CLI-first workflow
- Cross-platform support

**Gemini** (Google)
- Google's AI agent platform
- Skills integration support
- Android Studio compatibility
- Cloud integration

**OpenAI Codex** (OpenAI)
- Underlying model for many agents
- Skills format compatible
- API integration
- Third-party client support

### Full Agent List (20+ Platforms)

- Claude Code
- GitHub Copilot
- Cursor
- Cline
- Gemini
- OpenAI Codex
- Windsurf
- Aider
- Continue
- Supermaven
- Tabnine
- Codeium
- Amazon CodeWhisperer
- Replit AI
- SourceGraph Cody
- JetBrains AI
- Mintlify Writer
- Pieces for Developers
- CodeGPT
- Bito AI
- And more...

### Universal Compatibility

The skills ecosystem achieves cross-platform compatibility through:

**Standardized Format:**
- All skills use SKILL.md markdown format
- Consistent frontmatter structure
- Platform-agnostic instructions
- Universal trigger mechanisms

**Benefits:**
- **Write once, use everywhere:** Single skill works across all agents
- **No vendor lock-in:** Switch agents without losing skills
- **Community sharing:** Skills benefit entire ecosystem
- **Future-proof:** New agents automatically compatible

**Compatibility Features:**
- Platform-agnostic skill loading
- Universal trigger patterns
- Cross-agent skill transfer
- Backward compatibility

## Using the Platform

### Browsing Strategies

**Strategy 1: Category-First Exploration**

Best for: Learning the ecosystem, discovering general-purpose skills

**Process:**
1. Visit [skills.sh](https://skills.sh)
2. Select relevant category (Development, Design, etc.)
3. Browse top skills in category
4. Filter by install count
5. Review skill descriptions
6. Install most relevant skills

**Example:**
```
1. Navigate to Development category
2. See React subcategory
3. Find vercel-react-best-practices (72.7K installs)
4. Read description
5. Install: npx skills add vercel-labs/skills@vercel-react-best-practices -g
```

**Strategy 2: Problem-Solving Search**

Best for: Specific needs, targeted discovery

**Process:**
1. Identify specific problem
2. Search with focused keywords
3. Compare top 3-5 results
4. Review documentation
5. Install best match

**Example:**
```
Problem: React app performance issues
Search: "react performance optimization"
Results:
  - react-performance-patterns (25K installs)
  - react-rendering-optimization (18K installs)
  - performance-profiling (12K installs)
Choose: react-performance-patterns (highest installs + best description)
Install: npx skills add react-performance-patterns -g
```

**Strategy 3: Trending Discovery**

Best for: Staying current, finding emerging patterns

**Process:**
1. Check "Trending 24h" section
2. Review "Hot" skills
3. Investigate rapid growth patterns
4. Read skill descriptions
5. Test promising skills

**Example:**
```
Trending: new-framework-skill (spike from 500 → 8K installs)
Investigate: Read what problem it solves
Test: Install in test project
Evaluate: Determine production readiness
Adopt: Add to main projects if valuable
```

### Search Tips

**Effective Search Queries:**

**Be Specific:**
```bash
# Good
npx skills find react performance optimization

# Too vague
npx skills find react
```

**Include Domain:**
```bash
# Good
npx skills find frontend design patterns

# Less effective
npx skills find design
```

**Combine Task + Tool:**
```bash
# Good
npx skills find playwright e2e testing

# Less effective
npx skills find testing
```

**Use Common Terminology:**
```bash
# Good
npx skills find auth security

# Less effective
npx skills find authentication authorization
```

**Search Query Patterns:**

| Pattern | Example | Use Case |
|---------|---------|----------|
| Framework + Task | "react performance" | Framework-specific optimization |
| Tool + Purpose | "docker deployment" | Infrastructure setup |
| Domain + Action | "frontend design" | Design guidance |
| Technology Stack | "next.js typescript" | Multi-technology patterns |
| Problem + Solution | "slow loading optimization" | Problem-solving |

### Filtering and Discovery

**Filter by Install Count:**
1. Visit skills.sh
2. Select category
3. Sort by "All Time" installs
4. Focus on top 10-20 results
5. High installs = proven value

**Filter by Recency:**
1. Check "Trending 24h" tab
2. Find recently popular skills
3. Investigate new solutions
4. Early adoption opportunity

**Filter by Domain:**
1. Use category navigation
2. Select specific subcategory
3. Narrow to exact domain
4. Browse focused results

**Advanced Discovery:**
- Combine filters (category + install count)
- Use search within category
- Check related skills section
- Follow skill publisher for updates
- Bookmark favorite skills

**Discovery Workflow:**
```
1. Identify Need
   ↓
2. Choose Discovery Method
   (Browse | Search | Trending)
   ↓
3. Apply Filters
   (Category | Install Count | Recency)
   ↓
4. Review Results
   (Read descriptions | Check metrics)
   ↓
5. Evaluate Quality
   (Install count | Documentation | Source)
   ↓
6. Install and Test
   (Development | Staging | Production)
```

## Summary

Skills.sh serves as the central marketplace for the open agent skills ecosystem, providing discovery, validation, and distribution for thousands of community-contributed capabilities.

**Key Takeaways:**

**Platform Strengths:**
- Central directory with 70K+ installs for top skills
- Six major categories covering all domains
- Search and browse discovery methods
- Quality indicators through install metrics
- Universal compatibility across 20+ agents

**Discovery Features:**
- Category-based browsing
- Keyword search with filtering
- Trending and hot skill tracking
- Installation metrics for validation
- Version management and updates

**Popular Categories:**
- Development: React, TypeScript, frameworks
- Design: Web design, accessibility, UI/UX
- Infrastructure: Docker, Kubernetes, Supabase
- Marketing: SEO, copywriting, content
- Business: Pricing, launch, analysis
- Tools: PDF handling, automation, integrations

**Quality Indicators:**
- >50K installs = production ready
- Trending 24h = emerging value
- Hot = sustained essential capability
- Community validation through adoption

**Universal Access:**
- Works with Claude Code, Cursor, Copilot, and 20+ more agents
- Write once, use everywhere
- No vendor lock-in
- Future-proof skill investment

## Related Documentation

**Discovery:**
- [Discovery Guide](../../02-using-skills/discovery.md) — Complete discovery methods
- [find-skills Tool](../../../references/skills/find-skills-vercel.md) — Discovery skill reference

**Ecosystem:**
- [Skills Ecosystem Overview](../../../references/skills/skills-ecosystem-overview.md) — Complete ecosystem guide
- [npm Skills Package](../../../references/skills/npm-skills-package.md) — Skills CLI documentation
- [OpenSkills](../../../references/skills/openskills.md) — Universal skills loader

**Platform Tools:**
- [Skills CLI](../../../references/skills/npm-skills-package.md) — Command-line interface
- [Installation Guide](../../02-using-skills/installation.md) — How to install skills
- [Management Guide](../../02-using-skills/management.md) — Managing installed skills

---

**Last Updated:** February 2026
**Platform:** skills.sh
**Status:** Active & Growing
**Community:** 72K+ installs on top skills
