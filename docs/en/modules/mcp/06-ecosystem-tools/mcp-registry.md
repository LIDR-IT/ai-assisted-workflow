# MCP Registry and Server Discovery

The MCP ecosystem includes several registry platforms for discovering, browsing, and installing MCP servers. These registries serve as central hubs where developers publish servers and users find integrations for their AI applications.

## What is an MCP Registry?

An **MCP Registry** is a searchable catalog of MCP servers that provides:

- **Server Discovery**: Browse available servers by category, functionality, or popularity
- **Documentation**: View server capabilities, installation instructions, and examples
- **Quality Indicators**: Assess server reliability through ratings, downloads, and maintenance status
- **Easy Installation**: Get installation commands and configuration snippets
- **Publishing Platform**: Share your own MCP servers with the community

Think of it like npm for Node.js packages or PyPI for Python packages, but specifically for MCP servers.

## Official MCP Registry

The **Official MCP Registry** is hosted at [registry.modelcontextprotocol.io](https://registry.modelcontextprotocol.io/) and serves as the primary discovery platform for MCP servers.

### Key Features

**Curated Collection**
- Official servers from Anthropic and partners
- Community-contributed servers
- Quality-checked implementations
- Regular updates and maintenance

**Comprehensive Documentation**
- Server descriptions and use cases
- Installation instructions per platform
- Configuration examples
- API reference and capabilities

**Search and Browse**
- Category-based navigation
- Keyword search
- Filter by language, platform, or features
- Sort by popularity or recency

**Server Information**
- Available tools and resources
- Supported platforms
- Dependencies and requirements
- License and maintenance status

### Example: Browsing the Registry

Visit the registry and you'll find servers organized by category:

**Development Tools:**
- `@modelcontextprotocol/server-filesystem` - File system operations
- `@modelcontextprotocol/server-github` - GitHub integration
- `@modelcontextprotocol/server-git` - Git operations

**Data Access:**
- `@modelcontextprotocol/server-postgres` - PostgreSQL database
- `@modelcontextprotocol/server-sqlite` - SQLite database
- `@modelcontextprotocol/server-google-drive` - Google Drive access

**Web Services:**
- `@modelcontextprotocol/server-brave-search` - Web search
- `@modelcontextprotocol/server-fetch` - HTTP requests
- `@modelcontextprotocol/server-puppeteer` - Browser automation

**Monitoring:**
- `@modelcontextprotocol/server-sentry` - Error tracking
- `@modelcontextprotocol/server-slack` - Team notifications

## GitHub MCP Registry

In January 2026, GitHub launched the **GitHub MCP Registry** as the fastest way to discover and install MCP servers directly from GitHub repositories.

### Key Features

**Repository-Backed Servers**
- Each server links to its GitHub repository
- View source code, issues, and contributions
- Check maintenance activity and community health
- Access comprehensive README documentation

**Seamless Integration**
- Direct installation from GitHub
- Automatic updates via repository versions
- GitHub authentication for private servers
- Integration with GitHub Copilot

**Community-Driven**
- Browse trending servers
- Star your favorites
- Report issues directly to maintainers
- Contribute via pull requests

**Discovery Mechanisms**
- Search by topic tags (`mcp-server` topic)
- Browse by language or framework
- Filter by stars, forks, or recent activity
- View related servers and dependencies

### Using GitHub Registry

**Finding Servers:**

1. Visit [github.com/topics/mcp-server](https://github.com/topics/mcp-server)
2. Browse repositories tagged with `mcp-server`
3. Check repository README for capabilities
4. Review code quality and maintenance

**Installation Example:**

```bash
# From GitHub repository
npx @org/mcp-server-name

# Or add to your MCP config
{
  "mcpServers": {
    "custom-server": {
      "command": "npx",
      "args": ["-y", "@org/mcp-server-name"]
    }
  }
}
```

### GitHub Registry vs Official Registry

| Feature | GitHub Registry | Official Registry |
|---------|----------------|-------------------|
| Source | GitHub repositories | Multiple sources |
| Curation | Community-driven | Partially curated |
| Installation | npx from GitHub | Various methods |
| Documentation | Repository README | Dedicated pages |
| Updates | Git-based | Registry-managed |
| Quality Check | Stars/forks/issues | Review process |

**Best Practice**: Use the official registry for vetted servers and GitHub registry for exploring community innovations.

## Skills.sh MCP Platform

**Skills.sh** provides a specialized platform for organizing MCP servers as reusable "skills" with automatic discovery, validation, and caching.

### Key Concepts

**Skills as Organized Packages**
- Servers grouped by domain expertise
- Standardized interfaces
- Validated implementations
- Cached for performance

**Features:**
- Modular AI assistance across domains
- Automatic capability discovery
- Version management
- Cross-platform compatibility

### Example: Skills MCP Server

The `skills-mcp` server from skills.sh provides a registry system:

```json
{
  "mcpServers": {
    "skills": {
      "command": "npx",
      "args": ["-y", "skills-mcp"],
      "env": {
        "SKILLS_API_KEY": "${SKILLS_API_KEY}"
      }
    }
  }
}
```

**Usage:**

```
Ask AI: "What skills are available?"
AI uses skills-mcp server to list registered skills

Ask AI: "Use the data-analysis skill to analyze sales.csv"
AI loads the data-analysis skill package and executes
```

## Popular MCP Servers

Here are some widely-used MCP servers across different categories:

### File System & Development

**@modelcontextprotocol/server-filesystem**
- Local file system access
- Read, write, search operations
- Directory navigation
- File metadata

```bash
npx -y @modelcontextprotocol/server-filesystem /path/to/directory
```

**@modelcontextprotocol/server-git**
- Git repository operations
- Commit, branch, merge
- Status and diff viewing
- Log and history

```bash
npx -y @modelcontextprotocol/server-git /path/to/repo
```

**@modelcontextprotocol/server-github**
- GitHub API integration
- Issues, PRs, repositories
- Actions and workflows
- Team management

```bash
# Requires GITHUB_TOKEN environment variable
npx -y @modelcontextprotocol/server-github
```

### Databases & Data

**@modelcontextprotocol/server-postgres**
- PostgreSQL database access
- Query execution
- Schema inspection
- Transaction management

```bash
npx -y @modelcontextprotocol/server-postgres postgres://localhost/db
```

**@modelcontextprotocol/server-sqlite**
- SQLite database operations
- Lightweight local storage
- Full SQL support
- File-based databases

```bash
npx -y @modelcontextprotocol/server-sqlite /path/to/database.db
```

**@modelcontextprotocol/server-google-drive**
- Google Drive integration
- File upload/download
- Folder organization
- Sharing and permissions

```bash
# Requires Google OAuth credentials
npx -y @modelcontextprotocol/server-google-drive
```

### Web & Search

**@modelcontextprotocol/server-brave-search**
- Web search via Brave Search API
- Real-time information retrieval
- Safe search results
- No tracking

```bash
# Requires BRAVE_API_KEY
npx -y @modelcontextprotocol/server-brave-search
```

**@modelcontextprotocol/server-fetch**
- HTTP requests
- REST API calls
- Web scraping
- Data retrieval

```bash
npx -y @modelcontextprotocol/server-fetch
```

**@modelcontextprotocol/server-puppeteer**
- Browser automation
- Web page interaction
- Screenshots and PDFs
- Testing and scraping

```bash
npx -y @modelcontextprotocol/server-puppeteer
```

### Productivity & Communication

**@modelcontextprotocol/server-slack**
- Slack workspace integration
- Send messages
- Read channels
- Manage conversations

```bash
# Requires SLACK_TOKEN
npx -y @modelcontextprotocol/server-slack
```

**@modelcontextprotocol/server-notion**
- Notion workspace access
- Pages and databases
- Content creation
- Organization

```bash
# Requires NOTION_API_KEY
npx -y @modelcontextprotocol/server-notion
```

### Monitoring & Analytics

**@modelcontextprotocol/server-sentry**
- Error tracking
- Performance monitoring
- Issue management
- Alerting

```bash
# Requires SENTRY_TOKEN
npx -y @modelcontextprotocol/server-sentry
```

### Specialized Tools

**@upstash/context7-mcp**
- Framework documentation
- Up-to-date API references
- Code examples
- Best practices

```bash
# Optional CONTEXT7_API_KEY for higher rate limits
npx -y @upstash/context7-mcp
```

**@modelcontextprotocol/server-figma**
- Figma design integration
- Read designs and components
- Export assets
- Design-to-code workflows

```bash
# Requires FIGMA_API_KEY
npx -y @modelcontextprotocol/server-figma
```

## Server Categories

MCP servers typically fall into these categories:

### 1. Local System Access
- File systems
- Databases
- Process management
- System utilities

**Characteristics:**
- Run locally via stdio transport
- Fast, direct access
- No network latency
- Privacy-preserving

### 2. Cloud Services
- SaaS platforms
- Storage services
- Communication tools
- Business applications

**Characteristics:**
- Require API keys/OAuth
- Network-based
- Rate-limited
- Feature-rich APIs

### 3. Development Tools
- Version control
- CI/CD systems
- Code analysis
- Testing frameworks

**Characteristics:**
- Developer-focused
- Integrate with workflows
- Support automation
- Often open source

### 4. Data & Analytics
- Databases
- Data warehouses
- Analytics platforms
- Reporting tools

**Characteristics:**
- Query-oriented
- Data transformation
- Aggregation support
- Schema awareness

### 5. AI & ML Services
- Model inference
- Vector databases
- ML pipelines
- Training platforms

**Characteristics:**
- Compute-intensive
- Async operations
- Specialized hardware
- API-based access

## Server Quality Indicators

When evaluating MCP servers, consider these quality indicators:

### Documentation Quality

**Excellent Documentation:**
- Clear description of capabilities
- Complete installation instructions
- Configuration examples
- Troubleshooting guide
- API reference

**Red Flags:**
- Missing README
- No examples
- Unclear requirements
- Outdated information

### Code Quality

**Good Signs:**
- TypeScript with types
- Comprehensive error handling
- Input validation
- Logging support
- Test coverage

**Warning Signs:**
- No error handling
- Missing input validation
- Hardcoded values
- No tests

### Maintenance Status

**Active Maintenance:**
- Recent commits (< 3 months)
- Responsive to issues
- Regular updates
- Clear versioning

**Potentially Abandoned:**
- No commits > 6 months
- Open issues ignored
- No releases
- Deprecated dependencies

### Community Health

**Strong Community:**
- Active discussions
- Contributors beyond author
- Stars and forks
- Clear contribution guidelines

**Weak Community:**
- Few/no stars
- No contributors
- Closed to contributions
- No community activity

### Security Considerations

**Security Best Practices:**
- Environment variables for secrets
- Input sanitization
- Rate limiting
- Audit logs

**Security Concerns:**
- Hardcoded credentials
- No input validation
- Unrestricted access
- No security documentation

## Installing Servers from Registries

### Installation Methods

**NPX (Recommended for Development):**

```bash
# One-time execution
npx -y @modelcontextprotocol/server-name

# Or add to MCP config
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-name", "arg1"]
    }
  }
}
```

**Global Installation:**

```bash
# Install globally
npm install -g @modelcontextprotocol/server-name

# Use in config
{
  "mcpServers": {
    "server-name": {
      "command": "server-name",
      "args": ["arg1"]
    }
  }
}
```

**Local Installation:**

```bash
# In your project
npm install @modelcontextprotocol/server-name

# Use with npx or node
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["server-name", "arg1"]
    }
  }
}
```

**From Source:**

```bash
# Clone repository
git clone https://github.com/org/mcp-server.git
cd mcp-server

# Install dependencies
npm install

# Build if needed
npm run build

# Use in config
{
  "mcpServers": {
    "server-name": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"]
    }
  }
}
```

### Platform-Specific Installation

**Cursor:**

1. Open Cursor settings
2. Navigate to MCP section
3. Add server configuration
4. Reload Cursor

**Claude Code:**

```bash
# Edit MCP config
vim ~/.claude/mcp.json

# Or project-level
vim .claude/mcp.json

# Verify installation
claude mcp list
```

**Gemini CLI:**

```bash
# Edit config
vim ~/.gemini/settings.json

# Verify
gemini /mcp
```

**Antigravity:**

```bash
# Global config only
vim ~/.gemini/antigravity/mcp_config.json

# Restart Antigravity
```

## Publishing Your Own Servers

### Preparation Checklist

Before publishing, ensure your server meets these standards:

**Code Requirements:**
- [ ] Follows MCP specification
- [ ] Handles errors gracefully
- [ ] Validates all inputs
- [ ] Uses environment variables for secrets
- [ ] Includes TypeScript types (if applicable)

**Documentation Requirements:**
- [ ] Clear README with description
- [ ] Installation instructions
- [ ] Configuration examples
- [ ] Available tools/resources listed
- [ ] Troubleshooting section

**Quality Requirements:**
- [ ] Tests written and passing
- [ ] No hardcoded credentials
- [ ] Proper versioning (semver)
- [ ] License specified
- [ ] Security considerations documented

### Publishing to npm

```bash
# Initialize package.json
npm init

# Set required fields
{
  "name": "@yourorg/mcp-server-name",
  "version": "1.0.0",
  "description": "MCP server for...",
  "main": "dist/index.js",
  "bin": {
    "mcp-server-name": "./dist/index.js"
  },
  "keywords": ["mcp", "mcp-server", "ai"],
  "license": "MIT"
}

# Publish to npm
npm publish --access public
```

### Publishing to GitHub

```bash
# Create repository
gh repo create mcp-server-name --public

# Add topic
gh repo edit --add-topic mcp-server

# Push code
git add .
git commit -m "Initial release"
git push origin main

# Create release
gh release create v1.0.0 --title "v1.0.0" --notes "Initial release"
```

### Submitting to Official Registry

1. **Test Your Server:**
```bash
# Use MCP Inspector
npx @modelcontextprotocol/inspector your-server
```

2. **Create Submission:**
- Visit [registry.modelcontextprotocol.io/submit](https://registry.modelcontextprotocol.io/submit)
- Provide server details
- Include npm package name or GitHub URL
- Add description and examples

3. **Review Process:**
- Automated checks run
- Manual review by maintainers
- Feedback provided if changes needed
- Approval and listing

4. **Post-Publication:**
- Monitor issues and feedback
- Respond to community questions
- Regular maintenance updates
- Version management

## Server Documentation Standards

Quality documentation is crucial for adoption. Follow these standards:

### README Structure

```markdown
# MCP Server Name

Brief one-line description.

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

### NPX (Recommended)
```bash
npx -y @yourorg/mcp-server-name
```

### Global
```bash
npm install -g @yourorg/mcp-server-name
```

## Configuration

### Environment Variables
- `API_KEY` - Your API key (required)
- `BASE_URL` - API base URL (optional)

### MCP Config
```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@yourorg/mcp-server-name"],
      "env": {
        "API_KEY": "${YOUR_API_KEY}"
      }
    }
  }
}
```

## Available Tools

### tool_name
**Description**: What the tool does
**Parameters**:
- `param1` (string, required): Description
- `param2` (number, optional): Description

**Example**:
```
Ask AI: "Use tool_name with param1=value"
```

## Available Resources

### resource://path
**Description**: What the resource provides
**Schema**: Data structure returned

## Troubleshooting

**Issue**: Common problem
**Solution**: How to fix

## License

MIT
```

### Examples and Use Cases

Include practical examples:

```markdown
## Examples

### Example 1: Basic Usage
```bash
# Setup
export API_KEY="your-key"
npx -y @yourorg/mcp-server-name

# Ask AI
"Read the data from source X"
```

### Example 2: Advanced Workflow
```bash
# Multi-step operation
"Fetch data from API, transform it, and save to database"
```

### Example 3: Integration
```bash
# Using with other servers
"Combine data from server A and server B, then analyze"
```
```

## Community and Contributions

### Getting Involved

**For Users:**
- Star servers you use
- Report issues with details
- Request features thoughtfully
- Share use cases and examples

**For Developers:**
- Contribute to existing servers
- Create new integrations
- Improve documentation
- Review pull requests

### Community Channels

**Official:**
- [MCP Discussions](https://github.com/modelcontextprotocol/specification/discussions)
- [Issue Tracker](https://github.com/modelcontextprotocol/specification/issues)
- [Discord Server](https://discord.gg/modelcontextprotocol)

**Community:**
- GitHub Topics: `mcp-server`
- Reddit: r/ModelContextProtocol
- Twitter: #MCPProtocol

### Contributing Guidelines

When contributing to MCP servers:

1. **Fork and Branch:**
```bash
git fork original-repo
git checkout -b feature/your-feature
```

2. **Follow Style:**
- Match existing code style
- Add tests for changes
- Update documentation

3. **Submit PR:**
- Clear description
- Link related issues
- Pass all checks

4. **Respond to Feedback:**
- Address review comments
- Update as requested
- Be patient and respectful

## Registry Federation (2026+)

Starting in 2026, MCP registries support **federation**, enabling:

### Cross-Registry Discovery

**Benefits:**
- Search across multiple registries
- Access enterprise-internal servers
- Regional/specialized registries
- Decentralized ecosystem

**How It Works:**
```json
{
  "registries": [
    "https://registry.modelcontextprotocol.io",
    "https://registry.company.com/mcp",
    "https://registry.region.gov/mcp"
  ]
}
```

### Self-Discovery Protocol

Servers advertise capabilities via `.well-known` URLs:

```bash
# Server discovery endpoint
https://api.example.com/.well-known/mcp-server.json

# Returns:
{
  "name": "example-server",
  "version": "1.0.0",
  "description": "...",
  "capabilities": {
    "tools": [...],
    "resources": [...],
    "prompts": [...]
  }
}
```

**Benefits:**
- No connection needed for discovery
- Browse capabilities before installing
- Automatic capability updates
- Better search and filtering

## Best Practices

### For Server Discovery

1. **Start with Official Registry**: Vetted, maintained servers
2. **Check GitHub**: Source code, issues, community
3. **Review Documentation**: Installation, configuration, examples
4. **Verify Maintenance**: Recent activity, responsive maintainers
5. **Test Locally**: Use MCP Inspector before production

### For Server Installation

1. **Read Requirements**: System dependencies, API keys
2. **Use Environment Variables**: Never hardcode secrets
3. **Test Configuration**: Verify server responds
4. **Monitor Logs**: Check for errors or warnings
5. **Update Regularly**: Keep servers current

### For Server Publishing

1. **Document Thoroughly**: Clear README, examples, troubleshooting
2. **Test Extensively**: Multiple scenarios, edge cases
3. **Version Semantically**: Follow semver conventions
4. **Respond to Issues**: Maintain your server actively
5. **Security First**: Validate inputs, protect credentials

## Next Steps

Now that you understand MCP registries and discovery:

**Using Servers:**
- [Installing Servers](../02-using-mcp/installing-servers.md) - Install and configure
- [Platform Guides](../04-platform-guides/) - Platform-specific setup

**Creating Servers:**
- [Server Development](../03-creating-servers/) - Build your own
- [Publishing Guide](../03-creating-servers/publishing.md) - Share with community

**Advanced Topics:**
- [MCP Inspector](./mcp-inspector.md) - Debug and test
- [Best Practices](../03-creating-servers/best-practices.md) - Server design patterns

## Resources

**Registries:**
- [Official MCP Registry](https://registry.modelcontextprotocol.io/)
- [GitHub MCP Registry](https://github.com/topics/mcp-server)
- [Skills.sh Platform](https://www.pulsemcp.com/servers/skills-mcp-skills)

**Tools:**
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector)
- [Server Templates](https://github.com/modelcontextprotocol/servers)

**Documentation:**
- [MCP Specification](https://modelcontextprotocol.io/specification)
- [Publishing Guide](https://modelcontextprotocol.io/docs/publish)

---

**Last Updated**: February 2026
**Registry Version**: 1.0
**Federation Support**: Yes (2026+)

## Sources

- [GitHub MCP Registry: The fastest way to discover MCP Servers](https://github.blog/ai-and-ml/github-copilot/meet-the-github-mcp-registry-the-fastest-way-to-discover-mcp-servers/)
- [Official MCP Registry](https://registry.modelcontextprotocol.io/)
- [Skills MCP Server by skills-mcp](https://www.pulsemcp.com/servers/skills-mcp-skills)
- [MCP Roadmap - Model Context Protocol](https://modelcontextprotocol.io/development/roadmap)
- [GitHub - modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)
