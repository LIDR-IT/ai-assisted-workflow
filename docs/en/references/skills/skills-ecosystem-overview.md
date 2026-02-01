# Skills Ecosystem Overview

## What is Skills.sh?

**Skills.sh** is an open ecosystem platform for AI agents that hosts reusable capabilities. It serves as a central directory where developers can discover, install, and share skills that enhance AI agents with procedural knowledge.

**Official Site:** [skills.sh](https://skills.sh)

---

## Core Concept

### What Are Skills?

Skills are **reusable capabilities for AI agents** that provide:
- **Procedural knowledge** - How to accomplish specific tasks
- **Specialized expertise** - Domain-specific guidance
- **Workflows** - Step-by-step processes
- **Tools** - Scripts and utilities for common operations

### Key Benefit

**"Install them with a single command to enhance your agents with access to procedural knowledge."**

Instead of explaining the same patterns repeatedly, install a skill once and the agent has permanent access to that knowledge.

---

## How It Works

### Installation

Single command installation:

```bash
npx skills add <owner/repo>
```

**Examples:**

```bash
# Install React best practices
npx skills add vercel-labs/skills --skill vercel-react-best-practices

# Install web design guidelines
npx skills add vercel-labs/skills --skill web-design-guidelines

# Install from custom repo
npx skills add username/custom-skills
```

### Discovery

**Browse at:** [skills.sh](https://skills.sh)

**Features:**
- Search functionality
- Category filtering
- Installation counts
- Trending indicators
- Time-based filters (All Time, 24h, Hot)

### Usage

Once installed, skills are automatically available to your AI agent:

1. **Agent loads skill metadata** (always in context)
2. **Skill triggers** when relevant to user query
3. **Agent uses skill knowledge** to accomplish task
4. **Progressive disclosure** loads additional resources as needed

---

## Supported AI Agents

Skills.sh supports **20+ AI coding agents**, including:

### Major Platforms

- **Claude Code** (Anthropic)
- **GitHub Copilot** (GitHub/Microsoft)
- **Cursor** (Anysphere)
- **Cline** (Cline AI)
- **Gemini** (Google)
- **OpenAI Codex** (OpenAI)

### Additional Agents

- Windsurf
- Aider
- Continue
- Supermaven
- Tabnine
- Codeium
- And many more...

### Universal Compatibility

Skills follow standardized formats (SKILL.md) that work across different AI agents, enabling:
- **Write once, use everywhere**
- **Cross-platform compatibility**
- **Community sharing**
- **No vendor lock-in**

---

## Popular Skills Categories

### 1. Development

**Focus:** Programming best practices, frameworks, languages

**Popular Skills:**
- **vercel-react-best-practices** (72.7K installs)
  - React optimization patterns
  - Performance best practices
  - Modern React patterns

- **Next.js patterns**
  - App Router guidance
  - Server Components
  - Deployment optimization

- **Vue expertise**
  - Vue 3 Composition API
  - Reactivity patterns
  - Component design

- **TypeScript patterns**
  - Type safety
  - Advanced types
  - Generics and utilities

### 2. Design

**Focus:** UI/UX, visual design, user experience

**Popular Skills:**
- **web-design-guidelines** (55.1K installs)
  - Accessibility rules
  - Responsive design
  - Design systems

- **UI/UX patterns**
  - Component libraries
  - Design tokens
  - User flows

- **Frontend design**
  - Layout techniques
  - Animation patterns
  - CSS architecture

### 3. Infrastructure

**Focus:** DevOps, deployment, cloud platforms

**Popular Skills:**
- **Supabase integration**
  - Database setup
  - Authentication
  - Real-time features

- **Deployment pipelines**
  - CI/CD workflows
  - Automated testing
  - Release management

- **Kubernetes patterns**
  - Container orchestration
  - Service mesh
  - Scaling strategies

### 4. Marketing

**Focus:** SEO, content, copywriting

**Popular Skills:**
- **SEO audits**
  - Technical SEO
  - Content optimization
  - Performance metrics

- **Copywriting** (covered in this repository)
  - Conversion optimization
  - Brand voice
  - Call-to-action patterns

- **Content strategy**
  - Content planning
  - Distribution
  - Analytics

### 5. Business

**Focus:** Strategy, planning, analysis

**Popular Skills:**
- **Pricing strategy**
  - Pricing models
  - Value-based pricing
  - Competitive analysis

- **Launch planning**
  - Go-to-market strategy
  - Launch checklists
  - Success metrics

- **Market analysis**
  - Competitor research
  - Market sizing
  - Trend analysis

### 6. Specialized Tools

**Focus:** File handling, automation, integrations

**Popular Skills:**
- **PDF/PPTX/XLSX handling**
  - Document generation
  - Data extraction
  - Format conversion

- **Browser automation**
  - Web scraping
  - Testing automation
  - Workflow automation

- **Email workflows**
  - Email templates
  - Automation rules
  - Integration patterns

---

## Top Skills Leaderboard

### Most Installed (All Time)

1. **vercel-react-best-practices** - 72.7K installs
   - React optimization and best practices

2. **find-skills** - 56.5K installs
   - Skill discovery and recommendation

3. **web-design-guidelines** - 55.1K installs
   - Web interface design standards

4. **copywriting** - 48.2K installs
   - Effective copywriting principles

5. **mcp-integration** - 45.3K installs
   - Model Context Protocol integration

### Trending Skills (24h)

Skills with rapid recent growth in installations, indicating:
- New releases gaining traction
- Viral discovery
- Community validation
- Emerging needs

### Hot Skills

Skills with sustained high install velocity, showing:
- Consistent value delivery
- Strong community adoption
- Essential capabilities
- Quality implementations

---

## Skill Quality Indicators

### Installation Count

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
- Experimental
- Highly specialized
- Beta/testing

### Time-Based Metrics

**All Time:**
- Total lifetime installs
- Long-term value
- Sustained usefulness

**Trending 24h:**
- Recent popularity spike
- New discoveries
- Rapid adoption

**Hot:**
- High velocity
- Consistent growth
- Current relevance

---

## Using Skills Effectively

### Discovery Strategy

1. **Browse by Category**
   - Start with your domain (Development, Design, etc.)
   - Explore related skills
   - Check installation counts

2. **Search by Need**
   - Use specific keywords
   - Filter by relevance
   - Compare similar skills

3. **Check Trending**
   - Discover new patterns
   - Stay current
   - Find emerging best practices

4. **Review Top Skills**
   - Learn from community choices
   - Understand proven value
   - Adopt industry standards

### Installation Best Practices

**For General Use:**
```bash
# Install globally for all projects
npx skills add vercel-labs/skills --skill react-best-practices -g
```

**For Project-Specific:**
```bash
# Install locally for this project only
npx skills add username/custom-skill
```

**For Testing:**
```bash
# Install without confirmation
npx skills add skill-repo --skill test-skill -y
```

### Skill Management

**List installed skills:**
```bash
npx skills list
```

**Update skills:**
```bash
npx skills update
```

**Remove skills:**
```bash
npx skills remove skill-name
```

**Check for updates:**
```bash
npx skills check
```

---

## Creating and Sharing Skills

### Why Create Skills?

1. **Share expertise** with the community
2. **Standardize practices** across teams
3. **Document patterns** in reusable format
4. **Reduce repetition** in AI interactions
5. **Build reputation** in AI agent ecosystem

### Publishing Skills

**Steps:**

1. **Create skill** following SKILL.md format
2. **Test locally** with your AI agent
3. **Push to GitHub** repository
4. **Submit to skills.sh** directory
5. **Share with community**

**See:** `skill-creator.md` and `skill-development-claude-code.md` in this directory for complete guides.

### Skill Promotion

**Increase adoption:**
- Write clear descriptions
- Provide concrete examples
- Document use cases
- Share on social media
- Respond to feedback
- Keep updated

---

## Ecosystem Benefits

### For Developers

✅ **Reduced repetition** - Don't explain same patterns repeatedly
✅ **Instant expertise** - Access specialized knowledge immediately
✅ **Community validation** - Use proven, tested patterns
✅ **Cross-project consistency** - Same standards everywhere
✅ **Time savings** - Skip onboarding explanations

### For AI Agents

✅ **Enhanced capabilities** - Access specialized knowledge
✅ **Domain expertise** - Deep understanding of specific areas
✅ **Workflow knowledge** - Step-by-step process guidance
✅ **Tool integration** - Scripts and utilities for common tasks
✅ **Progressive learning** - Skills load on-demand

### For Teams

✅ **Standardization** - Consistent practices across team
✅ **Knowledge sharing** - Team expertise codified
✅ **Onboarding** - New members get instant context
✅ **Best practices** - Industry standards built-in
✅ **Quality assurance** - Proven patterns reduce errors

### For Community

✅ **Open ecosystem** - Anyone can contribute
✅ **Collective intelligence** - Best practices aggregated
✅ **Continuous improvement** - Skills evolve with feedback
✅ **Cross-pollination** - Ideas spread across domains
✅ **Innovation acceleration** - Build on existing work

---

## Integration with Other Tools

### OpenSkills

Universal skills loader for multiple AI agents.

**Benefit:** Use same skills across Claude Code, Cursor, Windsurf, etc.

**See:** `openskills.md` in this directory

### Skills CLI

Package manager for agent skills.

**Commands:**
- `npx skills find [query]` - Search skills
- `npx skills add <package>` - Install skill
- `npx skills check` - Check for updates
- `npx skills update` - Update all skills

**See:** `npm-skills-package.md` in this directory

### MCP Integration

Skills can work with Model Context Protocol servers.

**Benefit:** Combine skills (knowledge) with MCP (tools/resources)

**See:** MCP references in `docs/references/mcp/`

---

## Future of Skills

### Emerging Trends

1. **AI-Generated Skills**
   - Skills created by AI for AI
   - Auto-documentation
   - Self-improvement

2. **Skill Composition**
   - Skills that combine other skills
   - Meta-skills for complex workflows
   - Hierarchical skill systems

3. **Dynamic Skills**
   - Skills that adapt to context
   - Personalized skill variants
   - Learning from usage

4. **Enterprise Skills**
   - Company-specific knowledge
   - Internal best practices
   - Proprietary workflows

5. **Skill Marketplaces**
   - Premium skills
   - Verified publishers
   - Quality guarantees

---

## Getting Started

### Quick Start

1. **Browse skills.sh**
   ```
   https://skills.sh
   ```

2. **Find relevant skill**
   - Use search
   - Browse categories
   - Check top skills

3. **Install skill**
   ```bash
   npx skills add <owner/repo> --skill <skill-name>
   ```

4. **Use with your agent**
   - Skill automatically available
   - Triggers on relevant queries
   - Provides specialized knowledge

### Learning Path

1. **Start with top skills**
   - Install highly-rated skills
   - Learn from community choices
   - Understand value patterns

2. **Explore your domain**
   - Find category-specific skills
   - Try specialized tools
   - Compare similar skills

3. **Create custom skills**
   - Codify your expertise
   - Share with team
   - Contribute to community

4. **Advanced usage**
   - Combine multiple skills
   - Create skill collections
   - Build domain-specific skill sets

---

## Resources

- **Official Site:** [skills.sh](https://skills.sh)
- **Skills CLI:** [npm package: skills](https://www.npmjs.com/package/skills)
- **OpenSkills:** [Universal skills loader](https://github.com/numman-ali/openskills)
- **Documentation:** See other files in this directory
  - `npm-skills-package.md` - Skills CLI reference
  - `openskills.md` - Universal loader guide
  - `find-skills-vercel.md` - Skill discovery tool
  - `skill-creator.md` - Creating skills guide
  - `skill-development-claude-code.md` - Claude Code specific guide

---

## Related References

### In This Repository

**Skills:**
- `npm-skills-package.md` - Skills package manager
- `openskills.md` - Universal skills loader
- `find-skills-vercel.md` - Skill discovery
- `skill-creator.md` - Creating skills
- `skill-development-claude-code.md` - Claude Code skills

**MCP:**
- `docs/references/mcp/mcp-introduction.md` - MCP overview
- `docs/references/mcp/mcp-integration-claude-code.md` - MCP integration
- `docs/references/mcp/mcp-server-builder.md` - Building MCP servers

**Commands & Agents:**
- `docs/references/commands/command-development.md` - Creating commands
- `docs/references/agents/agent-development-claude-code.md` - Creating agents

---

**Last Updated:** January 2026
**Category:** Skills Ecosystem
**Status:** Active & Growing
