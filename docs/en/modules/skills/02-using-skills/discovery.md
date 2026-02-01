# Discovering Skills

## Overview

Skill discovery is the first step in extending your AI agent's capabilities. With thousands of community-contributed skills available, finding the right skill for your specific need is essential. This guide covers all the methods and tools available for discovering skills in the ecosystem.

**Key Discovery Methods:**
- Browse the skills.sh platform
- Use the find-skills tool
- Search via Skills CLI
- Explore by category
- Check trending and popular skills

## The skills.sh Platform

### What is skills.sh?

[skills.sh](https://skills.sh) is the official registry and discovery platform for the open agent skills ecosystem. It serves as the central hub where developers can browse, search, and explore skills across all domains.

**Platform Features:**
- **Central Repository:** Community and official skills in one place
- **Search Functionality:** Find skills by keyword or use case
- **Category Browsing:** Explore skills organized by domain
- **Installation Metrics:** See popularity and adoption stats
- **Documentation Hub:** Detailed skill descriptions and usage examples
- **Version Management:** Track skill versions and updates
- **Quality Indicators:** Trending, Hot, and install count badges

### URL Structure

Skills are organized using a consistent URL pattern:

```
https://skills.sh/<owner>/<repo>/<skill-name>
```

**Examples:**
```
https://skills.sh/vercel-labs/skills/find-skills
https://skills.sh/vercel-labs/skills/vercel-react-best-practices
https://skills.sh/vercel-labs/skills/web-design-guidelines
```

### Browsing by Category

The skills.sh platform organizes skills into major categories, making it easy to explore domain-specific capabilities:

#### 1. Development

**Focus:** Programming languages, frameworks, and development best practices

**Popular Skills:**
- **vercel-react-best-practices** (72.7K installs)
  - React optimization patterns
  - Performance best practices
  - Modern React patterns
- **Next.js patterns** — App Router, Server Components, deployment
- **Vue expertise** — Vue 3 Composition API, reactivity, components
- **TypeScript patterns** — Type safety, advanced types, generics

#### 2. Design

**Focus:** UI/UX, visual design, accessibility, user experience

**Popular Skills:**
- **web-design-guidelines** (55.1K installs)
  - Accessibility standards
  - Responsive design patterns
  - Design system implementation
- **UI/UX patterns** — Component libraries, design tokens, user flows
- **Frontend design** — Layout techniques, animations, CSS architecture

#### 3. Infrastructure

**Focus:** DevOps, deployment, cloud platforms, containerization

**Popular Skills:**
- **Supabase integration** — Database setup, authentication, real-time
- **Deployment pipelines** — CI/CD workflows, automated testing, releases
- **Kubernetes patterns** — Container orchestration, scaling, service mesh

#### 4. Marketing

**Focus:** SEO, content strategy, copywriting, analytics

**Popular Skills:**
- **SEO audits** — Technical SEO, content optimization, performance
- **copywriting** (48.2K installs) — Conversion optimization, brand voice, CTAs
- **Content strategy** — Content planning, distribution, analytics

#### 5. Business

**Focus:** Strategy, planning, analysis, pricing

**Popular Skills:**
- **Pricing strategy** — Pricing models, value-based pricing, competitive analysis
- **Launch planning** — Go-to-market strategy, launch checklists, metrics
- **Market analysis** — Competitor research, market sizing, trends

#### 6. Specialized Tools

**Focus:** File handling, automation, integrations

**Popular Skills:**
- **PDF/PPTX/XLSX handling** — Document generation, data extraction, conversion
- **Browser automation** — Web scraping, testing, workflow automation
- **Email workflows** — Email templates, automation rules, integrations

### Quality Indicators

Understanding quality metrics helps you choose the right skills:

#### Installation Count

**High installs (>50K):**
- Community validated
- Production ready
- Well documented
- Actively maintained

**Medium installs (10K-50K):**
- Growing adoption
- Specialized use cases
- Niche expertise
- Emerging patterns

**Low installs (<10K):**
- New releases
- Experimental features
- Highly specialized
- Beta/testing phase

#### Time-Based Metrics

**All Time:**
- Total lifetime installs
- Long-term value indicator
- Sustained usefulness

**Trending (24h):**
- Recent popularity spike
- New discoveries
- Rapid adoption
- Emerging needs

**Hot:**
- High velocity growth
- Consistent adoption
- Current relevance
- Essential capabilities

## The find-skills Discovery Tool

### Overview

**find-skills** is a specialized skill that acts as a discovery layer for the entire ecosystem. With 56.5K installs, it's one of the most popular tools in the skills registry.

**Purpose:** Help users discover and install skills through an intelligent search and recommendation system.

**Source:** [skills.sh/vercel-labs/skills/find-skills](https://skills.sh/vercel-labs/skills/find-skills)

### When to Use find-skills

Deploy find-skills when you:
- Ask **"how do I do X"** where X is a common task with existing skills
- Request skill discovery: **"find a skill for X"**
- Ask about specialized capabilities: **"is there a skill that can..."**
- Want to extend agent functionality
- Search for tools, templates, or domain-specific workflows
- Need capabilities beyond the base agent

### Installing find-skills

```bash
npx skills add vercel-labs/skills@find-skills -g -y
```

**Flags:**
- `-g` — Global installation (available in all projects)
- `-y` — Auto-accept (skip confirmation prompt)

### Using find-skills

Once installed, find-skills integrates with your AI agent and automatically activates when you express discovery needs:

**Natural language queries:**
```
"Find a skill for React performance optimization"
"Is there a skill for Docker deployment?"
"Help me find E2E testing skills"
"What skills are available for SEO?"
```

**Direct invocation:**
```bash
npx skills find react performance
npx skills find docker deployment
npx skills find testing e2e
```

The tool searches the ecosystem and presents relevant results with:
- Skill name and description
- Installation command ready to copy
- Link to skills.sh page for more details

## Skills CLI Commands

### Overview

The **Skills CLI** is the core package manager for agent skills, operating similarly to npm but specifically designed for AI agent capabilities.

**Package:** `skills` (npm)
**Latest Version:** 1.0.6
**Installation:** `npm i skills`

### Core Commands

#### 1. Find Skills

Search skills interactively or by keyword:

```bash
npx skills find [query]
```

**Examples:**

```bash
# Interactive search (opens browser)
npx skills find

# Keyword search
npx skills find react performance
npx skills find docker deployment
npx skills find testing e2e
npx skills find copywriting
```

**What it does:**
- Searches the skills registry by keyword
- Displays matching skills with descriptions
- Shows installation counts
- Provides installation commands

#### 2. Add Skills

Install skills from the registry:

```bash
npx skills add <owner/repo>
npx skills add <owner/repo>@<skill-name>
```

**Examples:**

```bash
# Install specific skill
npx skills add vercel-labs/skills@vercel-react-best-practices

# Install with flags
npx skills add vercel-labs/skills@react-performance -g -y

# Install from custom repo
npx skills add username/custom-skills
```

**Common Flags:**
- `-g` — Install globally (available in all projects)
- `-y` — Auto-accept (skip confirmation)
- `--skill` — Specify skill name

#### 3. Check Updates

Check for updates to installed skills:

```bash
npx skills check
```

**Output example:**
```
Checking for skill updates...
✓ vercel-react-best-practices (current: 2.1.0, latest: 2.2.0)
✓ web-design-guidelines (current: 1.5.0, latest: 1.5.0)
✓ find-skills (current: 1.3.0, latest: 1.4.0)
```

#### 4. Update Skills

Update all installed skills:

```bash
npx skills update
```

**Update specific skill:**
```bash
npx skills update <skill-name>
```

**Example:**
```bash
npx skills update vercel-react-best-practices
```

## Discovery Workflow

### Step-by-Step Discovery Process

#### Step 1: Identify Your Needs

Determine:
- **Domain:** What area are you working in? (web dev, DevOps, design, etc.)
- **Specific task:** What do you want to accomplish?
- **Skill likelihood:** Is this a common need with existing solutions?

**Examples:**
- "I need React performance patterns" → Development domain, optimization task
- "I want to improve my landing page copy" → Marketing domain, copywriting task
- "I need to set up Docker deployment" → Infrastructure domain, deployment task

#### Step 2: Choose Discovery Method

**Browse skills.sh:**
- Best for: Exploring options, discovering new skills
- Use when: You're not sure exactly what you need
- Strategy: Start with category, filter by popularity

**Use find-skills:**
- Best for: Targeted searches, specific needs
- Use when: You know what you're looking for
- Strategy: Natural language or keyword search

**CLI search:**
- Best for: Command-line workflow, quick installation
- Use when: You prefer terminal-based discovery
- Strategy: `npx skills find` with specific keywords

#### Step 3: Search with Targeted Queries

**Good search queries:**
```bash
# Specific and focused
npx skills find react performance
npx skills find docker deployment
npx skills find playwright e2e
npx skills find seo audit

# Domain + task
npx skills find frontend design
npx skills find backend api
npx skills find devops automation
```

**Poor search queries:**
```bash
# Too vague
npx skills find help
npx skills find coding
npx skills find web
```

#### Step 4: Evaluate Results

Compare skills based on:
- **Relevance:** Does it match your exact need?
- **Install count:** Higher = more validated
- **Description:** Clear explanation of capabilities?
- **Source:** Trusted publisher or community contributor?
- **Recency:** Recently updated or stale?

#### Step 5: Review Documentation

Before installing, visit the skill's page on skills.sh:

```
https://skills.sh/<owner>/<repo>/<skill-name>
```

Check for:
- Detailed description
- Use cases and examples
- Prerequisites
- Related skills
- Community feedback

#### Step 6: Install and Test

Install the skill:

```bash
npx skills add <owner/repo>@<skill-name> -g -y
```

**Verification:**
1. Confirm installation success
2. Check skill is available to agent
3. Test with relevant query
4. Verify expected behavior

## Discovery Strategies

### Strategy 1: Top-Down Exploration

**Best for:** Learning the ecosystem, finding general-purpose skills

**Process:**
1. Browse skills.sh by category
2. Check "All Time" top skills
3. Install highest-rated skills in your domain
4. Explore related skills
5. Build foundational skill set

**Example:**
```
Development Category → React → vercel-react-best-practices
Design Category → Web Design → web-design-guidelines
Marketing Category → Copywriting → copywriting
```

### Strategy 2: Need-Based Search

**Best for:** Solving specific problems, targeted discovery

**Process:**
1. Identify specific task
2. Search with focused keywords
3. Compare top 3-5 results
4. Review documentation
5. Install best match

**Example:**
```
Need: React performance optimization
Search: "react performance"
Results: react-performance, react-rendering-patterns, react-profiling
Choose: react-performance (highest installs + best description)
Install: npx skills add vercel-labs/skills@react-performance
```

### Strategy 3: Trend Following

**Best for:** Staying current, discovering emerging patterns

**Process:**
1. Check "Trending 24h" on skills.sh
2. Review "Hot" skills
3. Investigate rapid growth
4. Read descriptions
5. Install promising skills

**Example:**
```
Trending: new-framework-skill (spike from 100 → 5K installs)
Investigate: Check what problem it solves
Test: Install in test project
Adopt: Add to main projects if valuable
```

### Strategy 4: Complementary Skills

**Best for:** Building comprehensive capability sets

**Process:**
1. Install core skill
2. Check "Related Skills" section
3. Identify complementary capabilities
4. Install skill combinations

**Example:**
```
Core: react-best-practices
Related: typescript-patterns, testing-strategies, performance-optimization
Result: Complete React development skill set
```

## Best Practices

### Discovery Best Practices

1. **Search before building**
   - Always check if a skill exists before creating custom solutions
   - Use multiple search terms if first attempt fails
   - Browse category even if search yields no results

2. **Use specific queries**
   - Include domain keywords (react, docker, seo)
   - Add task type (performance, deployment, testing)
   - Combine related terms (react performance optimization)

3. **Review skill documentation**
   - Read full description on skills.sh
   - Check examples and use cases
   - Verify prerequisites
   - Look for recent updates

4. **Check quality indicators**
   - Higher installs = more validated
   - Recent updates = actively maintained
   - Trending status = emerging value
   - Hot badge = sustained growth

5. **Test before committing**
   - Try in test project first
   - Verify expected behavior
   - Check for conflicts
   - Evaluate actual value

### Installation Best Practices

1. **Global vs. Local**
   ```bash
   # Global: For general-purpose skills used across projects
   npx skills add vercel-labs/skills@react-best-practices -g

   # Local: For project-specific skills
   npx skills add company/internal-standards
   ```

2. **Version Pinning**
   ```bash
   # Production: Pin to specific version
   npx skills add skill@1.2.3

   # Development: Use latest
   npx skills add skill
   ```

3. **Batch Installation**
   ```bash
   # Install multiple skills at once
   npx skills add vercel-labs/skills@react -g -y
   npx skills add vercel-labs/skills@typescript -g -y
   npx skills add vercel-labs/skills@testing -g -y
   ```

4. **Documentation**
   - Document installed skills in project README
   - Track version numbers
   - Note why each skill was chosen
   - List skill dependencies

### Maintenance Best Practices

1. **Regular updates**
   ```bash
   # Weekly or monthly
   npx skills check
   npx skills update
   ```

2. **Skill auditing**
   - Review installed skills quarterly
   - Remove unused skills
   - Check for better alternatives
   - Update documentation

3. **Stay informed**
   - Follow skills.sh trending
   - Check for new releases
   - Monitor community discussions
   - Subscribe to skill updates

## Common Discovery Patterns

### Pattern 1: Framework Skill Discovery

**Scenario:** Starting a new React project

**Discovery flow:**
```bash
# 1. Search for React skills
npx skills find react

# 2. Install core framework skill
npx skills add vercel-labs/skills@vercel-react-best-practices -g

# 3. Find related skills
npx skills find react performance
npx skills find react testing

# 4. Build skill stack
npx skills add react-performance -g
npx skills add react-testing -g
npx skills add typescript-react -g
```

### Pattern 2: Problem-Solving Discovery

**Scenario:** App performance is slow

**Discovery flow:**
```bash
# 1. Identify problem domain
# Problem: React app slow → Performance optimization

# 2. Search for solution
npx skills find react performance optimization

# 3. Review top results
# - react-performance-patterns
# - react-rendering-optimization
# - performance-profiling

# 4. Install best match
npx skills add react-performance-patterns -g
```

### Pattern 3: Learning Discovery

**Scenario:** Want to learn Docker best practices

**Discovery flow:**
```bash
# 1. Browse infrastructure category on skills.sh
Category: Infrastructure → Containerization

# 2. Check top Docker skills
# - docker-best-practices (high installs)
# - docker-deployment (trending)
# - kubernetes-docker (related)

# 3. Install learning path
npx skills add docker-best-practices -g
npx skills add docker-deployment -g
```

## Troubleshooting Discovery

### Skill Not Found

**Problem:** Search yields no results

**Solutions:**
1. **Try alternative keywords**
   ```bash
   # Instead of:
   npx skills find authentication

   # Try:
   npx skills find auth
   npx skills find login
   npx skills find user security
   ```

2. **Browse category on skills.sh**
   - Visit [skills.sh](https://skills.sh)
   - Navigate to relevant category
   - Manually browse available skills

3. **Search with broader terms**
   ```bash
   # Too specific:
   npx skills find react hooks optimization patterns

   # Better:
   npx skills find react performance
   ```

### Too Many Results

**Problem:** Search returns overwhelming number of skills

**Solutions:**
1. **Add more specific keywords**
   ```bash
   # Too broad:
   npx skills find testing

   # More specific:
   npx skills find react testing jest
   npx skills find e2e playwright
   ```

2. **Filter by install count**
   - Check skills.sh platform
   - Sort by "All Time" installs
   - Focus on top 3-5 results

3. **Use category filters**
   - Browse specific category
   - Apply domain filters
   - Narrow by subcategory

### Unclear Skill Purpose

**Problem:** Skill description is vague

**Solutions:**
1. **Visit skills.sh page**
   ```
   https://skills.sh/<owner>/<repo>/<skill-name>
   ```

2. **Check source repository**
   - Look for GitHub link
   - Read detailed README
   - Check examples and use cases

3. **Review install metrics**
   - High installs = likely valuable
   - Trending = gaining traction
   - Low installs = might be experimental

## Discovery Resources

### Official Resources

- **Skills.sh Platform:** [https://skills.sh](https://skills.sh)
  - Browse all skills
  - Search by keyword
  - Filter by category
  - Check popularity metrics

- **Skills CLI Documentation:** [npm package: skills](https://www.npmjs.com/package/skills)
  - CLI command reference
  - Installation instructions
  - Usage examples

- **find-skills Tool:** [skills.sh/vercel-labs/skills/find-skills](https://skills.sh/vercel-labs/skills/find-skills)
  - Interactive discovery
  - Smart recommendations
  - Usage patterns

### Related Documentation

**In This Module:**
- [Installation Guide](./installation.md) — How to install discovered skills
- [Usage Guide](./usage.md) — Using installed skills effectively
- [Management Guide](./management.md) — Managing your skill collection

**References:**
- [Skills Ecosystem Overview](../../references/skills/skills-ecosystem-overview.md) — Complete ecosystem guide
- [find-skills Reference](../../references/skills/find-skills-vercel.md) — Detailed find-skills documentation
- [Skills CLI Reference](../../references/skills/npm-skills-package.md) — Complete CLI documentation

## Summary

Effective skill discovery is essential for maximizing your AI agent's capabilities:

**Key Takeaways:**
- Browse skills.sh for exploration and learning
- Use find-skills for intelligent discovery
- Search via CLI for quick terminal workflow
- Filter by quality indicators (install counts, trending, hot)
- Review documentation before installing
- Test skills before committing to production
- Keep skills updated and well-documented

**Discovery Flow:**
1. Identify need → 2. Search with specific keywords → 3. Evaluate results → 4. Review documentation → 5. Install and test → 6. Integrate and maintain

With over 56K weekly installs of find-skills alone and 72K+ installs of top skills, the ecosystem is mature, active, and continuously growing. Take advantage of the community's collective knowledge by discovering and installing skills that match your specific needs.

---

**Next Steps:**
- [Learn how to install skills](./installation.md)
- [Understand skill usage patterns](./usage.md)
- [Master skill management](./management.md)
