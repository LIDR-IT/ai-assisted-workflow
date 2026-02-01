# The Skills Ecosystem Landscape

## Overview

The skills ecosystem represents a paradigm shift in how we extend AI agents with specialized knowledge. Rather than repeatedly explaining the same patterns, frameworks, and best practices to your AI agent, you install a skill once and the agent gains permanent access to that procedural knowledge. This ecosystem has grown to support thousands of skills, 20+ AI agent platforms, and over 72,000 installs for top skills.

**What Makes Up the Ecosystem:**
- **Central marketplace:** Skills.sh platform hosting and distributing skills
- **Package management:** Skills CLI for discovery, installation, and updates
- **Universal compatibility:** Standardized format working across all major AI agents
- **Community contribution:** Open ecosystem where anyone can share expertise
- **Quality validation:** Install metrics and trending indicators provide trust signals
- **Continuous evolution:** Skills improve through feedback and iteration

This guide explores the complete skills ecosystem landscape, from understanding what makes a skill valuable to recognizing emerging trends shaping the future of AI agent capabilities.

## What is the Skills Ecosystem?

### Core Components

The skills ecosystem consists of several interconnected components working together to deliver reusable AI agent capabilities:

**1. Skills.sh Platform**

The central marketplace where skills are discovered, documented, and distributed. Think of it as "npm for AI agent knowledge" — a registry where developers publish reusable capabilities and users discover solutions to common problems.

**Key Features:**
- Centralized skill directory with search and browse capabilities
- Category organization (Development, Design, Infrastructure, Marketing, Business, Tools)
- Quality metrics (install counts, trending status, hot badges)
- Documentation hub with detailed skill descriptions
- Version management and update tracking
- Community validation through adoption metrics

**2. Skills CLI (Package Manager)**

The command-line interface for interacting with the ecosystem, providing discovery, installation, and management capabilities.

**Core Commands:**
- `npx skills find [query]` — Search for skills
- `npx skills add <owner/repo>@<skill-name>` — Install skills
- `npx skills check` — Check for updates
- `npx skills update` — Update installed skills

**3. Individual Skills**

The actual capabilities that extend AI agents with specialized knowledge. Each skill is a markdown document (SKILL.md) containing:
- Procedural knowledge for specific tasks
- Domain-specific best practices
- Step-by-step workflows
- Tools and scripts for common operations
- Examples and use cases

**4. AI Agent Platforms**

The 20+ AI coding agents that consume skills, including Claude Code, GitHub Copilot, Cursor, Cline, Gemini, and many more. These platforms load skills and make them available to agents through standardized mechanisms.

**5. Community Contributors**

Developers, teams, and organizations who create and maintain skills, sharing expertise with the broader ecosystem. Contributors range from individual developers solving niche problems to major organizations like Vercel sharing official framework guidance.

### Ecosystem Flow

```
Developer has need
     ↓
Browse/search skills.sh
     ↓
Find relevant skill
     ↓
Install via Skills CLI
     ↓
Skill loaded by AI agent
     ↓
Agent uses skill knowledge
     ↓
Developer provides feedback
     ↓
Skill author iterates
     ↓
Community benefits from improvements
```

This cycle creates a virtuous feedback loop where skills continuously improve based on real-world usage, benefiting the entire community.

## Top Skills by Category

Understanding which skills the community has validated helps inform discovery and installation decisions. Here are the most popular skills across major categories:

### Development (72.7K+ installs)

**vercel-react-best-practices** — 72.7K installs
- React optimization patterns and performance best practices
- Modern React patterns (hooks, context, suspense, Server Components)
- Component architecture and state management strategies
- Production-ready guidance from Vercel
- **Why it's popular:** Comprehensive, authoritative React guidance covering the entire ecosystem
- **Use case:** Essential for any React development project

**Next.js patterns** — High adoption
- App Router best practices and Server vs. Client Components
- Deployment optimization and API route patterns
- Incremental Static Regeneration and Edge runtime usage
- **Why it's popular:** Next.js is the leading React framework; official patterns are essential
- **Use case:** Building production Next.js applications

**TypeScript patterns** — Growing adoption
- Type safety strategies and advanced type techniques
- Generics, utilities, and strict mode configuration
- Monorepo TypeScript setup and third-party library typing
- **Why it's popular:** TypeScript adoption continues to grow; type safety is critical
- **Use case:** Type-safe JavaScript development

### Design (55.1K+ installs)

**web-design-guidelines** — 55.1K installs
- Accessibility standards (WCAG compliance)
- Responsive design patterns and design system implementation
- Typography, color theory, and layout techniques
- **Why it's popular:** Comprehensive design guidance covering all aspects of web interfaces
- **Use case:** Building accessible, beautiful, responsive websites

**UI/UX patterns** — High adoption
- Component library design and design tokens
- User flow optimization and interaction patterns
- Design handoff processes and collaboration
- **Why it's popular:** Bridges design and development; essential for product quality
- **Use case:** Creating user-centered interfaces

**Accessibility best practices** — Growing adoption
- WCAG 2.1 AA/AAA compliance patterns
- Screen reader optimization and keyboard navigation
- Color contrast and semantic HTML
- **Why it's popular:** Accessibility is increasingly required and expected
- **Use case:** Ensuring applications are usable by everyone

### Marketing (48.2K+ installs)

**copywriting** — 48.2K installs
- Conversion optimization techniques and brand voice development
- Call-to-action patterns and headline formulas
- Storytelling frameworks and email copywriting
- **Why it's popular:** Proven frameworks for persuasive, conversion-focused copy
- **Use case:** Landing pages, marketing content, product messaging

**SEO optimization** — High adoption
- Technical SEO best practices and content optimization
- Schema markup implementation and link building
- Core Web Vitals and performance metrics
- **Why it's popular:** SEO is critical for organic traffic and discoverability
- **Use case:** Optimizing websites and content for search engines

**Content strategy** — Growing adoption
- Content calendar planning and distribution optimization
- Content repurposing and lifecycle management
- Analytics, measurement, and audience targeting
- **Why it's popular:** Content marketing requires strategic planning
- **Use case:** Building and executing content marketing programs

### Infrastructure (45.3K+ installs)

**mcp-integration** — 45.3K installs
- Model Context Protocol server setup and configuration
- Tool integration and resource management patterns
- External service connection (databases, APIs, file systems)
- **Why it's popular:** MCP is essential for extending AI agents with external capabilities
- **Use case:** Connecting AI agents to data sources and tools

**Docker best practices** — High adoption
- Container optimization and multi-stage builds
- Image security and size reduction
- Docker Compose patterns and orchestration basics
- **Why it's popular:** Docker is standard for modern deployment
- **Use case:** Containerizing applications for deployment

**Kubernetes patterns** — Growing adoption
- Container orchestration and service mesh implementation
- Horizontal pod autoscaling and configuration management
- Monitoring, observability, and production operations
- **Why it's popular:** Kubernetes is the de facto orchestration standard
- **Use case:** Running containerized applications at scale

### Discovery Tools (56.5K+ installs)

**find-skills** — 56.5K installs
- Intelligent skill discovery through search and recommendations
- Category filtering and installation guidance
- Ecosystem navigation and skill evaluation
- **Why it's popular:** Makes discovering relevant skills effortless
- **Use case:** Finding skills for specific needs without manual browsing

**OpenSkills** — Growing adoption
- Universal skills loader for multiple AI agents
- Cross-platform skill compatibility layer
- Unified skill management across agents
- **Why it's popular:** Simplifies using same skills across different AI agents
- **Use case:** Managing skills in multi-agent environments

## Quality Indicators

Not all skills are created equal. The ecosystem provides several quality indicators to help evaluate skills before installation:

### Installation Count Metrics

**High installs (>50K):**
- **Community validated:** Thousands of users trust this skill
- **Production ready:** Proven in real-world projects
- **Well documented:** Comprehensive guides, examples, clear use cases
- **Actively maintained:** Regular updates, bug fixes, improvements
- **Low risk:** Safe for critical production projects

**Examples:** vercel-react-best-practices (72.7K), find-skills (56.5K), web-design-guidelines (55.1K)

**Medium installs (10K-50K):**
- **Growing adoption:** Gaining community traction and validation
- **Specialized use cases:** Solves specific problems effectively
- **Niche expertise:** Deep domain-specific knowledge
- **Emerging patterns:** New approaches being validated by community
- **Medium risk:** Test thoroughly before production deployment

**Examples:** mcp-integration (45.3K), copywriting (48.2K)

**Low installs (<10K):**
- **New releases:** Recently published, early adoption phase
- **Experimental:** Testing innovative approaches or techniques
- **Highly specialized:** Very narrow, specific use case
- **Beta/testing:** Not yet production-ready or fully validated
- **Higher risk:** Requires thorough testing and evaluation

**Note:** Low install count doesn't mean low quality — some excellent niche skills serve small audiences.

### Time-Based Metrics

**All Time Installs:**
- Measures total lifetime value and sustained usefulness
- Indicates long-term community trust and adoption
- Shows proven track record across many projects
- **Best for:** Production deployment decisions requiring stability

**Trending (24h):**
- Measures recent popularity spike and rapid adoption
- Indicates emerging needs or viral discovery
- Shows new releases gaining community attention
- **Best for:** Early adoption, innovation, staying current

**Hot:**
- Measures sustained high install velocity over weeks/months
- Indicates essential capability with consistent value
- Shows strong retention and continued adoption
- **Best for:** Critical infrastructure requiring proven reliability

### Source Reputation

**Trusted Publishers:**
- **vercel-labs:** Official Vercel skills (React, Next.js, web design)
- **Major frameworks:** Official skills from framework maintainers
- **Established companies:** Skills from recognized organizations
- **Well-known developers:** Skills from community leaders

**Community Contributors:**
- Check GitHub profile and contribution history
- Review other published skills and their adoption
- Assess documentation quality and responsiveness
- Look for active maintenance and recent updates

### Documentation Quality

**High-quality documentation includes:**
- Clear description of what the skill does
- Specific use cases with concrete examples
- Prerequisites and dependencies listed
- Installation and usage instructions
- Expected outcomes and success criteria
- Troubleshooting guidance

**Red flags:**
- Vague or generic descriptions
- No examples or use cases
- Missing installation instructions
- No version history or changelog
- Abandoned (no recent updates)

## Community Aspects

The skills ecosystem thrives on community participation, with thousands of contributors sharing expertise and collaborating on improvements.

### Contribution

**Why Contribute:**
1. **Share expertise** with the broader development community
2. **Standardize practices** across teams and organizations
3. **Document patterns** in reusable, accessible format
4. **Reduce repetition** in AI agent interactions
5. **Build professional reputation** in specific domains
6. **Receive feedback** from real-world usage
7. **Iterate and improve** based on community needs

**What to Contribute:**
- Domain-specific best practices (React patterns, Docker workflows)
- Framework guidance (Next.js, Vue, Angular)
- Tool integrations (MCP servers, API clients)
- Process workflows (testing strategies, deployment pipelines)
- Design patterns (accessibility, responsive design)
- Business frameworks (pricing strategies, launch planning)

**Contribution Process:**
1. Identify valuable knowledge to share
2. Create skill in SKILL.md format
3. Test locally with AI agents
4. Publish to GitHub repository
5. Submit to skills.sh directory
6. Promote through community channels
7. Maintain based on feedback

### Sharing

**Discovery and Promotion:**
- Share on social media (Twitter, LinkedIn, dev.to)
- Post in relevant communities (Discord, Slack, forums)
- Write blog posts or tutorials
- Present at meetups or conferences
- Contribute to discussions and Q&A
- Cross-reference in documentation

**Effective Sharing:**
- Write compelling descriptions with clear value propositions
- Provide concrete examples and use cases
- Create screenshots or demo videos
- Share success stories from users
- Respond to questions and feedback
- Build community around your skills

### Validation

**Community Validation Process:**
1. **Initial publication:** Skill released to ecosystem
2. **Early adoption:** First users install and test
3. **Feedback cycle:** Users report issues and suggestions
4. **Iteration:** Author improves based on feedback
5. **Growing adoption:** More users install as quality improves
6. **Community trust:** High install count validates quality
7. **Ecosystem integration:** Skill becomes standard reference

**Validation Signals:**
- Install count growth trajectory
- Trending or hot badge acquisition
- Positive community feedback and testimonials
- Forks and contributions from other developers
- Referenced in documentation and tutorials
- Recommended by community leaders
- Integration into workflows and templates

**Quality Improvement:**
- Monitor usage patterns and common questions
- Track issues and feature requests
- Respond to community feedback promptly
- Iterate based on real-world experience
- Update for platform changes and new patterns
- Maintain clear changelog and version history

## Ecosystem Benefits

### For Developers

**Reduced Repetition:**
Stop explaining the same patterns repeatedly to your AI agent. Install a skill once and the agent has permanent access to that knowledge.

**Example:**
```bash
# Instead of explaining React best practices every session
# Install once:
npx skills add vercel-labs/skills@vercel-react-best-practices -g

# Agent now has React expertise permanently
```

**Instant Expertise:**
Access specialized knowledge immediately without becoming an expert yourself. Skills provide deep domain knowledge on-demand.

**Example:**
```bash
# Need Kubernetes guidance but not a K8s expert?
npx skills add kubernetes-patterns -g

# Agent now has container orchestration expertise
```

**Community Validation:**
Use proven, tested patterns from thousands of successful implementations. High install counts indicate community trust.

**Cross-Project Consistency:**
Apply the same standards and patterns across all projects. Global skill installation ensures consistency.

**Time Savings:**
Skip lengthy onboarding explanations. New projects benefit immediately from installed skills.

### For AI Agents

**Enhanced Capabilities:**
Skills extend base capabilities with specialized knowledge beyond training data. Agents gain domain expertise on-demand.

**Domain Expertise:**
Deep understanding of specific areas (React performance, Docker deployment, copywriting) through curated procedural knowledge.

**Workflow Knowledge:**
Step-by-step process guidance for complex multi-step tasks. Skills provide structured approaches to common workflows.

**Tool Integration:**
Scripts and utilities for common operations. Skills can include executable tools and automation.

**Progressive Learning:**
Skills load on-demand based on context, avoiding information overload. Agents access only relevant knowledge for current tasks.

### For Teams

**Standardization:**
Ensure consistent practices across the entire team. Shared skills create shared understanding and approaches.

**Example Team Setup:**
```bash
# Install team-wide skills globally for all members
npx skills add company/internal-standards -g
npx skills add company/deployment-workflows -g
npx skills add company/testing-patterns -g
```

**Knowledge Sharing:**
Codify team expertise in reusable format. Senior developers share knowledge through skills rather than repeated explanations.

**Onboarding:**
New team members get instant context through pre-installed skills. Ramp-up time dramatically reduced.

**Best Practices:**
Industry standards built into development workflow. Skills encode proven patterns and anti-patterns.

**Quality Assurance:**
Proven patterns reduce errors and inconsistencies. Skills act as guardrails for code quality.

### For Community

**Open Ecosystem:**
Anyone can contribute skills and benefit from others' expertise. No gatekeepers or approval required.

**Collective Intelligence:**
Best practices from thousands of developers aggregated in one place. Community learns from collective experience.

**Continuous Improvement:**
Skills evolve based on real-world feedback and usage. Community drives quality through adoption metrics.

**Cross-Pollination:**
Ideas and patterns spread across domains and disciplines. React patterns inspire Vue patterns; DevOps influences frontend practices.

**Innovation Acceleration:**
Build on existing work rather than starting from scratch. Skills provide foundation for further innovation.

## Getting Involved

### Using Skills

**Getting Started:**
1. **Browse skills.sh** to explore available skills
2. **Search for relevant skills** in your domain
3. **Install top skills** in categories you work in
4. **Test with your AI agent** to verify value
5. **Integrate into workflow** for daily use

**Recommended First Installs:**
```bash
# Essential discovery tool
npx skills add vercel-labs/skills@find-skills -g -y

# Development (choose based on stack)
npx skills add vercel-labs/skills@vercel-react-best-practices -g
# or
npx skills add vue-best-practices -g

# Design (if doing frontend work)
npx skills add vercel-labs/skills@web-design-guidelines -g

# Marketing (if writing content)
npx skills add vercel-labs/skills@copywriting -g

# Infrastructure (if deploying)
npx skills add docker-best-practices -g
```

**Best Practices:**
- Install globally (`-g`) for general-purpose skills
- Install locally for project-specific skills
- Check for updates regularly (`npx skills check`)
- Document installed skills in project README
- Share valuable skills with team members

### Creating Skills

**When to Create:**
- You have domain expertise worth sharing
- You repeatedly explain same patterns
- Team needs consistent standards
- Community lacks coverage in specific area
- You've developed unique workflows or approaches

**Creation Process:**
1. **Identify valuable knowledge** to codify
2. **Structure in SKILL.md format** following standards
3. **Test locally** with your AI agent
4. **Refine based on testing** for clarity and completeness
5. **Publish to GitHub** repository
6. **Submit to skills.sh** directory
7. **Promote to community** through sharing
8. **Maintain based on feedback** and usage

**See Also:**
- [Creating Skills](../03-creating-skills/skill-creation.md) — Complete skill creation guide
- [Best Practices](../03-creating-skills/best-practices.md) — Quality guidelines
- [Publishing](../03-creating-skills/publishing.md) — Distribution strategies

### Contributing

**Contribution Types:**

**1. Create New Skills:**
Share your expertise by creating original skills for underserved domains or emerging patterns.

**2. Improve Existing Skills:**
Submit pull requests to existing skills with improvements, corrections, or additional examples.

**3. Provide Feedback:**
Use GitHub issues to report bugs, suggest improvements, or request features in skills you use.

**4. Share Use Cases:**
Document how you use skills in real projects to help others understand practical applications.

**5. Community Support:**
Answer questions, help troubleshoot issues, and guide new users in community forums.

**Making an Impact:**
- Focus on quality over quantity
- Provide clear documentation and examples
- Respond to feedback and iterate
- Maintain your contributions over time
- Engage with users and contributors
- Build on existing work rather than duplicating

## Future Trends

The skills ecosystem continues to evolve rapidly. Here are emerging trends shaping the future:

### AI-Generated Skills

**Concept:**
AI agents creating skills for other AI agents, automating the knowledge codification process.

**Current State:**
- Manual skill creation by human experts
- AI assists in formatting and structure
- Human review ensures quality and accuracy

**Future Vision:**
- AI analyzes successful patterns and automatically generates skills
- Self-documenting workflows extracted from execution traces
- Continuous skill refinement through AI-driven iteration
- Personalized skill variants optimized for individual workflows

**Implications:**
- Faster skill creation and updates
- Coverage of long-tail use cases
- Reduced barrier to contribution
- Quality validation becomes more critical

### Skill Composition

**Concept:**
Skills that combine or reference other skills, creating hierarchical knowledge structures.

**Current State:**
- Skills are largely independent
- Some cross-referencing in documentation
- Manual combination by users

**Future Vision:**
- Meta-skills orchestrating multiple domain skills
- Workflow skills composing task-specific skills
- Dependency management for skill hierarchies
- Automatic skill combination based on context

**Examples:**
```bash
# Future: Composite skill for full-stack development
npx skills add fullstack-webapp
# Automatically includes: react, typescript, node, postgres, docker

# Meta-skill for e-commerce project
npx skills add ecommerce-platform
# Includes: payment-integration, inventory-management, shipping-workflows
```

**Implications:**
- Simplified discovery (install one skill, get whole stack)
- Better organization of related knowledge
- Reduced redundancy across skills
- Complex dependency management challenges

### Dynamic Skills

**Concept:**
Skills that adapt to context, user preferences, and project characteristics.

**Current State:**
- Static skills with fixed content
- Same skill behavior for all users
- Manual customization required

**Future Vision:**
- Skills that personalize based on user history
- Context-aware skill activation and content
- Learning from usage patterns to improve relevance
- Project-specific skill customization

**Examples:**
- React skill that adapts based on project's React version
- Testing skill that adjusts to project's testing framework
- Deployment skill that customizes for detected infrastructure

**Implications:**
- More relevant, targeted guidance
- Reduced information overload
- Complexity in skill authoring
- Privacy and data concerns

### Enterprise Skills

**Concept:**
Private, company-specific skills encoding internal best practices and proprietary workflows.

**Current State:**
- Mostly public, open-source skills
- Some companies create internal skill repositories
- No enterprise-specific tooling

**Future Vision:**
- Private skill registries for companies
- Access controls and permissions
- Integration with internal systems and tools
- Compliance and security validation
- Company-wide skill deployment automation

**Use Cases:**
- Internal API usage patterns
- Company-specific deployment workflows
- Proprietary technology stacks
- Compliance and security requirements
- Brand and style guidelines

**Implications:**
- Balancing open source and proprietary knowledge
- Enterprise-grade tooling requirements
- Security and access control challenges
- Standardization across organizations

### Skill Marketplaces

**Concept:**
Commercial skills marketplace with premium, paid skills and verified publishers.

**Current State:**
- Free, open-source ecosystem
- Community-driven quality validation
- Install counts as trust signal

**Future Vision:**
- Tiered skill offerings (free, premium, enterprise)
- Verified publisher badges and certifications
- Quality guarantees and SLAs
- Support and maintenance contracts
- Revenue sharing for skill authors

**Potential Models:**
- Subscription for premium skill bundles
- Pay-per-install for specialized skills
- Enterprise licensing for company-wide use
- Certification programs for skill authors
- Marketplace fees for skill distribution

**Implications:**
- Sustainable funding for skill maintenance
- Professional skill development ecosystem
- Quality differentiation mechanisms
- Balancing commercial and open-source

### Integration Evolution

**Emerging Integrations:**
- **IDE integration:** Skills accessible directly in development environments
- **CI/CD integration:** Skills guiding automated pipelines
- **Documentation integration:** Skills embedded in technical documentation
- **Learning platforms:** Skills as interactive learning resources
- **Code review integration:** Skills informing automated code review

**Platform Evolution:**
- More AI agent platforms adopting skills
- Standardization of skill formats across platforms
- Cross-platform skill synchronization
- Universal skill management tools

## Summary

The skills ecosystem represents a fundamental shift in how we extend AI agents with specialized knowledge. By transforming procedural knowledge into reusable, installable capabilities, the ecosystem enables:

**Key Ecosystem Components:**
- Central marketplace (skills.sh) with 72K+ installs for top skills
- Package manager (Skills CLI) for discovery and installation
- 20+ supported AI agent platforms with universal compatibility
- Thousands of community-contributed skills across all domains
- Quality validation through install metrics and community feedback

**Top Skills:**
- **Development:** vercel-react-best-practices (72.7K), TypeScript patterns, Next.js guidance
- **Design:** web-design-guidelines (55.1K), UI/UX patterns, accessibility best practices
- **Marketing:** copywriting (48.2K), SEO optimization, content strategy
- **Infrastructure:** mcp-integration (45.3K), Docker best practices, Kubernetes patterns
- **Discovery:** find-skills (56.5K), OpenSkills universal loader

**Quality Indicators:**
- Install counts (>50K = production ready, 10K-50K = growing, <10K = experimental)
- Time-based metrics (All Time = proven value, Trending = emerging needs, Hot = essential)
- Source reputation (trusted publishers, active maintainers)
- Documentation quality (clear examples, comprehensive guides)

**Community Benefits:**
- **For developers:** Reduced repetition, instant expertise, community validation
- **For agents:** Enhanced capabilities, domain expertise, progressive learning
- **For teams:** Standardization, knowledge sharing, faster onboarding
- **For community:** Open ecosystem, collective intelligence, innovation acceleration

**Getting Involved:**
- **Using:** Install top skills, explore categories, integrate into workflow
- **Creating:** Share expertise, codify patterns, publish to ecosystem
- **Contributing:** Improve existing skills, provide feedback, support community

**Future Trends:**
- AI-generated skills automating knowledge codification
- Skill composition creating hierarchical knowledge structures
- Dynamic skills adapting to context and preferences
- Enterprise skills encoding proprietary workflows
- Skill marketplaces with premium offerings and guarantees

The skills ecosystem continues to grow and evolve, driven by community contribution and validated by real-world usage. With proven value across thousands of installations and expanding platform support, skills have become essential infrastructure for AI-assisted development.

## Related Documentation

**Discovery and Installation:**
- [Discovering Skills](./discovery.md) — How to find relevant skills
- [Installation Guide](./installation.md) — Installing and configuring skills
- [Management Guide](./management.md) — Managing your skill collection

**Creation and Publishing:**
- [Creating Skills](../03-creating-skills/skill-creation.md) — Complete skill creation guide
- [Best Practices](../03-creating-skills/best-practices.md) — Quality guidelines
- [Publishing](../03-creating-skills/publishing.md) — Distribution strategies

**Platform and Tools:**
- [Skills.sh Platform](../06-ecosystem-tools/skills-sh-platform.md) — Marketplace features and usage
- [Skills CLI Reference](../../references/skills/npm-skills-package.md) — Command-line interface
- [find-skills Tool](../../references/skills/find-skills-vercel.md) — Discovery skill reference

**Ecosystem References:**
- [Skills Ecosystem Overview](../../references/skills/skills-ecosystem-overview.md) — Complete technical overview
- [OpenSkills](../../references/skills/openskills.md) — Universal skills loader
- [MCP Integration](../../references/mcp/mcp-introduction.md) — Connecting skills with tools

---

**Last Updated:** February 2026
**Ecosystem Status:** Active & Growing
**Top Skill Installs:** 72.7K (vercel-react-best-practices)
**Supported Platforms:** 20+ AI agents
