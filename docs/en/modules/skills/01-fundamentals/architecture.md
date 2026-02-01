# Agent + Skills + Computer Architecture

## Overview

The **Agent + Skills + Computer** architecture represents the standard model for how modern AI agents integrate skills and computational tools to execute tasks autonomously.

![Architecture Concept](https://via.placeholder.com/800x400?text=Agent+%2B+Skills+%2B+Computer)

## Three Core Components

### 1. Agent Configuration

The agent is configured with three key components:

#### Core System Prompt
- Fundamental instructions defining agent behavior
- Personality, objectives, and operating rules
- Base capabilities and constraints

#### Equipped Skills
- Modular packages of procedural knowledge
- Examples: `react-best-practices`, `security-audit`, `deployment`
- Each skill teaches specific task execution

#### Equipped MCP Servers
- Model Context Protocol servers extending capabilities
- Can be local or remote (internet-based)
- Provide access to external systems, APIs, and tools

### 2. Agent Virtual Machine

The agent operates within a computational environment:

#### Execution Runtimes
- **Bash:** Shell scripting and system commands
- **Python:** Scripts and Python tools
- **Node.js:** JavaScript/TypeScript applications

#### File System
- Skills live in the agent's file system
- Organized structure: `skills/skill-name/`
- Each skill contains:
  - `SKILL.md` - Main instruction file
  - Additional resources: specs, rules, scripts

**Example structure:**
```
skills/
├── react-best-practices/
│   ├── SKILL.md
│   ├── patterns.md
│   └── examples.md
│
├── security-audit/
│   ├── SKILL.md
│   ├── checklist.md
│   └── scripts/
│       └── scan.py
│
└── deployment/
    ├── SKILL.md
    ├── references/
    │   └── aws-setup.md
    └── scripts/
        ├── build.sh
        └── deploy.sh
```

### 3. Use Computer

The agent can:
- Execute bash commands
- Run Python/Node.js scripts
- Read files from the file system
- Access skills via file system
- Connect to MCP servers remotely

## Workflow

### 1. Configuration Phase

**Setup:**
- Agent configured with specific skills
- MCP servers connected
- System prompt loaded

**Example:**
```yaml
Agent Configuration:
  Skills:
    - react-best-practices
    - security-audit
    - deployment
  MCP Servers:
    - database (PostgreSQL)
    - cloud-api (AWS)
  System Prompt:
    - "You are a senior full-stack developer"
```

### 2. Loading Phase

**Skill Storage:**
- Skill directories stored in file system
- Metadata indexed for discovery
- Full content available on-demand

**Progressive Disclosure:**
- Level 1: Metadata always loaded (~100 words)
- Level 2: SKILL.md loaded when triggered (<5,000 words)
- Level 3: Resources loaded as needed (variable size)

### 3. Execution Phase

**User Request:**
```
User: "Review this React component for performance issues"
```

**Agent Process:**
1. Scans skill metadata
2. Matches "react-best-practices" skill
3. Loads full SKILL.md content
4. Reads component file
5. Applies performance review patterns
6. Reports findings

**Tool Usage:**
- Bash: Run linters, analyzers
- Python: Execute custom scripts
- File System: Read skill resources
- MCP: Query performance metrics

### 4. Skills Access

**File System Pattern:**
```bash
# Agent reads skill content
cat ~/.claude/skills/react-best-practices/SKILL.md

# Agent executes skill script
python ~/.claude/skills/security-audit/scripts/scan.py

# Agent references skill resources
cat ~/.claude/skills/deployment/references/aws-setup.md
```

**Dynamic Loading:**
- Skills don't saturate working memory
- Loaded from file system on demand
- Multiple skills can be active simultaneously

### 5. MCP Integration

**External System Access:**
```
Agent → MCP Server → External System
   ↓
Load skill: "database-query"
   ↓
Use skill knowledge to construct query
   ↓
Execute via MCP database server
   ↓
Process results
```

## Information Flow

```
User Request
    ↓
Agent Core (System Prompt)
    ↓
    ├─→ Check Skills (File System)
    │   ├─→ Load metadata
    │   ├─→ Match intent
    │   └─→ Load full skill
    ↓
    ├─→ Execute Tools (Bash/Python/Node)
    │   ├─→ Run scripts
    │   ├─→ Read files
    │   └─→ Process data
    ↓
    └─→ Access MCP Servers (Remote/Local)
        ├─→ Query databases
        ├─→ Call APIs
        └─→ Access services
    ↓
Generate Response
```

## Benefits of This Architecture

### Modularity

**Skills are independent:**
- Easy to add, update, or remove
- No interference between skills
- Clear separation of concerns

**Example:**
```bash
# Add new skill
npx skills add vercel-labs/skills --skill testing

# Remove skill
npx skills remove testing

# Update skill
npx skills update testing
```

### Scalability

**Horizontal scaling:**
- MCP servers can be anywhere (local or remote)
- Add more skills without performance impact
- Agent can access unlimited external resources

**Example:**
```
Local Skills: 20 installed
Remote MCP Servers: 5 connected
Performance: No degradation
Context: Lean and efficient
```

### Portability

**Cross-platform compatibility:**
- Skills are standard files
- Work in any agent supporting the format
- Shareable between teams and projects

**Example:**
```bash
# Export skills directory
tar -czf my-skills.tar.gz ~/.claude/skills/

# Import on another machine
tar -xzf my-skills.tar.gz -C ~/.claude/
```

### Efficiency

**Optimized resource usage:**
- Skills don't saturate memory
- Loaded from disk on-demand
- Quick activation/deactivation

**Metrics:**
- Context usage: Minimal (only metadata)
- Load time: Milliseconds
- Memory footprint: Low

### Extensibility

**Easy to extend:**
- MCP servers for external integrations
- Skills can include executable code
- No agent modification needed

**Example:**
```
Add New Capability:
1. Create skill or MCP server
2. Install/configure
3. Immediately available
```

## Storage Locations

### Skills Storage

**Global Skills:**
```
~/.claude/skills/
├── skill-1/
├── skill-2/
└── skill-3/
```

**Project Skills:**
```
project-dir/.claude/skills/
├── project-specific-1/
└── project-specific-2/
```

**Platform-Specific:**
- **Claude Code:** `.claude/skills/`
- **Antigravity:** `.agent/skills/`
- **Cursor:** `.cursor/skills/`

### MCP Configuration

**Global MCP:**
```
~/.claude/mcp.json
```

**Project MCP:**
```
project-dir/.claude/mcp.json
```

## Real-World Example

### Scenario: Web App Development

**Agent Configuration:**
```yaml
Skills:
  - react-best-practices
  - api-design
  - database-migrations
  - security-audit
  - deployment

MCP Servers:
  - postgres (local)
  - aws-s3 (remote)
  - github (remote)

System Prompt:
  "You are a senior full-stack developer specializing in React and Node.js"
```

**User Request:**
```
"Create a new API endpoint for user registration with email verification"
```

**Agent Execution:**

1. **Load Skills:**
   - `api-design` (REST patterns)
   - `database-migrations` (schema changes)
   - `security-audit` (validation, encryption)

2. **Use Tools:**
   - **Bash:** Run tests, start dev server
   - **Node.js:** Execute migration scripts
   - **File System:** Read skill templates

3. **Access MCP:**
   - **postgres:** Create users table
   - **aws-s3:** Store user avatars
   - **github:** Create feature branch

4. **Generate:**
   - API endpoint code
   - Database migration
   - Security validations
   - Tests
   - Documentation

## Platform-Specific Architectures

### Claude Code

```
Agent
  ↓
.claude/
├── skills/          # Skills directory
├── agents/          # Custom subagents
├── commands/        # Slash commands
└── mcp.json         # MCP configuration
```

### Antigravity

```
Agent
  ↓
.agent/
├── skills/          # Skills directory
└── rules/           # Project rules

~/.gemini/antigravity/
├── skills/          # Global skills
└── mcp_config.json  # Global MCP (no project-level)
```

### Cross-Platform (OpenSkills)

```
Agent
  ↓
.agent/
└── skills/          # Universal skills directory

AGENTS.md            # Skill metadata (XML format)
```

## Best Practices

### Skill Organization

✅ **DO:**
- Keep skills focused and single-purpose
- Use descriptive names
- Include comprehensive documentation
- Organize with subdirectories

❌ **DON'T:**
- Create monolithic "everything" skills
- Use vague names
- Skip documentation
- Flatten all files in one directory

### Resource Management

✅ **DO:**
- Use progressive disclosure
- Keep SKILL.md under 500 lines
- Move large content to references/
- Compress assets when possible

❌ **DON'T:**
- Load everything upfront
- Put entire docs in SKILL.md
- Include unused resources
- Ignore file sizes

### MCP Integration

✅ **DO:**
- Use MCP for external systems
- Document MCP requirements
- Handle connection errors gracefully
- Provide fallbacks

❌ **DON'T:**
- Duplicate MCP functionality in skills
- Assume MCP always available
- Ignore error states
- Skip connection testing

## Troubleshooting

### Skill Not Loading

**Issue:** Skill exists but doesn't load

**Check:**
1. Verify file location
2. Check SKILL.md format
3. Validate YAML frontmatter
4. Review skill metadata

**Solution:**
```bash
# List installed skills
npx skills list

# Verify skill structure
ls -la ~/.claude/skills/skill-name/

# Check SKILL.md
cat ~/.claude/skills/skill-name/SKILL.md
```

### MCP Connection Failed

**Issue:** Cannot connect to MCP server

**Check:**
1. MCP configuration file
2. Server running status
3. Network connectivity
4. Credentials

**Solution:**
```bash
# Check MCP config
cat ~/.claude/mcp.json

# Test connection
curl http://localhost:3000/health

# Restart MCP server
npm run mcp:restart
```

## Next Steps

- **Understand skill structure:** [Skill Anatomy](skill-anatomy.md)
- **Learn to use skills:** [Using Skills](../02-using-skills/discovery.md)
- **Create your first skill:** [Creation Workflow](../03-creating-skills/workflow.md)

---

**Related:**
- [What Are Skills](what-are-skills.md) - Core concepts
- [Skill Anatomy](skill-anatomy.md) - SKILL.md structure
- [MCP Integration](../../mcp/) - Model Context Protocol

**External:**
- [Agent Skills Standard](https://agentskills.io)
- [Model Context Protocol](https://modelcontextprotocol.io)
