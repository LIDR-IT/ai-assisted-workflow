# MCP (Model Context Protocol) Module

Comprehensive documentation for Model Context Protocol - the standard for connecting AI agents to external tools and data sources.

## Quick Navigation

### 🎯 Getting Started
- New to MCP? Start with [What is MCP](01-fundamentals/what-is-mcp.md)
- Learn the [Protocol Architecture](01-fundamentals/protocol-architecture.md)
- Understand [Core Primitives](01-fundamentals/core-primitives.md)

### 📦 Using MCP
- [Installation Overview](02-using-mcp/installation-overview.md) - Choose the right transport
- [Environment Variables](02-using-mcp/environment-variables.md) - Configuration interpolation
- [OAuth Guide](02-using-mcp/authentication/oauth-guide.md) - Authentication setup
- [Scoped Configuration](02-using-mcp/scoped-configuration.md) - Local/Project/User levels
- [Resources & Prompts](02-using-mcp/resources-and-prompts.md) - @ mentions and commands

### 🛠️ Creating MCP Servers
- [Getting Started](03-creating-servers/getting-started.md) - Research and planning
- [Implementation Guide](03-creating-servers/implementation-guide.md) - Building your server
- [TypeScript Setup](03-creating-servers/project-structure/typescript-setup.md) - TS project structure
- [Python Setup](03-creating-servers/project-structure/python-setup.md) - Python project structure
- [Tools & Schemas](03-creating-servers/tools-and-schemas.md) - Defining tools
- [Testing](03-creating-servers/testing.md) - MCP Inspector workflow
- [Best Practices](03-creating-servers/best-practices.md) - Server development guidelines

### 🤖 Platform-Specific Guides
- **[Claude Code](04-platform-guides/claude-code/)** - Installation, plugins, managed MCP
- **[Cursor](04-platform-guides/cursor/)** - Configuration, extension API, debugging
- **[Gemini CLI](04-platform-guides/gemini-cli/)** - Setup, OAuth, rich content
- **[Antigravity](04-platform-guides/antigravity/)** - MCP Store, Google Cloud integration

### 🚀 Advanced Topics
- [Multiple Servers](05-advanced/multiple-servers.md) - Managing many servers
- [Tool Filtering](05-advanced/tool-filtering.md) - includeTools/excludeTools
- [Performance](05-advanced/performance.md) - Token limits and optimization
- [Custom Transports](05-advanced/custom-transports.md) - Beyond stdio/SSE/HTTP
- [Enterprise Deployment](05-advanced/enterprise-deployment.md) - Organization-wide MCP

### 🔧 Ecosystem Tools
- [MCP Inspector](06-ecosystem-tools/mcp-inspector.md) - Testing and debugging tool
- [MCP Registry](06-ecosystem-tools/mcp-registry.md) - Finding existing servers
- [TypeScript SDK](06-ecosystem-tools/sdks/typescript-sdk.md) - Official TypeScript SDK
- [Python SDK](06-ecosystem-tools/sdks/python-sdk.md) - Official Python SDK
- [Available Servers](06-ecosystem-tools/available-servers.md) - Index of common servers

### 📚 Reference
- [Protocol Specification](07-reference/protocol-specification.md) - JSON-RPC details
- [Transport Comparison](07-reference/transport-comparison.md) - stdio vs SSE vs HTTP
- [Security Checklist](07-reference/security-checklist.md) - Security best practices
- [Troubleshooting](07-reference/troubleshooting.md) - Common issues and solutions
- [Configuration Schema](07-reference/configuration-schema.md) - JSON schema reference
- [FAQ](07-reference/faq.md) - Frequently asked questions
- [Glossary](07-reference/glossary.md) - MCP terminology

---

## Quick Start Paths

### I want to use existing MCP servers
1. [What is MCP](01-fundamentals/what-is-mcp.md) - Understand the concept
2. [Installation Overview](02-using-mcp/installation-overview.md) - Choose transport method
3. Platform guide - [Claude Code](04-platform-guides/claude-code/) | [Cursor](04-platform-guides/cursor/) | [Gemini CLI](04-platform-guides/gemini-cli/) | [Antigravity](04-platform-guides/antigravity/)

### I want to build an MCP server
1. [What is MCP](01-fundamentals/what-is-mcp.md) - Understand the protocol
2. [Core Primitives](01-fundamentals/core-primitives.md) - Learn Tools, Resources, Prompts
3. [Getting Started](03-creating-servers/getting-started.md) - Plan your server
4. [Implementation Guide](03-creating-servers/implementation-guide.md) - Build it

### I need platform-specific help
- **Claude Code users:** [Claude Code Guide](04-platform-guides/claude-code/)
- **Cursor users:** [Cursor Guide](04-platform-guides/cursor/)
- **Gemini CLI users:** [Gemini CLI Guide](04-platform-guides/gemini-cli/)
- **Antigravity users:** [Antigravity Guide](04-platform-guides/antigravity/)

---

## Module Organization

### By Topic
- **Fundamentals:** What is MCP, architecture, primitives, lifecycle
- **Using:** Installation, authentication, configuration, resources
- **Creating:** Getting started, implementation, testing, best practices
- **Platforms:** Claude Code, Cursor, Gemini CLI, Antigravity
- **Advanced:** Multiple servers, filtering, performance, enterprise
- **Tools:** Inspector, registry, SDKs, available servers
- **Reference:** Protocol spec, transports, security, troubleshooting

### By Skill Level
- **Beginner:** 01-fundamentals/, 02-using-mcp/
- **Intermediate:** 03-creating-servers/, 04-platform-guides/
- **Advanced:** 05-advanced/, 06-ecosystem-tools/, 07-reference/

---

## Platform Comparison

| Feature | Claude Code | Cursor | Gemini CLI | Antigravity |
|---------|-------------|--------|------------|-------------|
| **Transport** | stdio, SSE, HTTP, WebSocket | stdio, SSE, HTTP | stdio, SSE, HTTP | stdio, SSE |
| **Configuration** | .mcp.json | mcp.json | settings.json | mcp_config.json |
| **Scopes** | Local/Project/User | Local/Project | Global/Project | Global only |
| **OAuth** | ✅ Dynamic | ✅ Static | ✅ Google/Dynamic | ✅ Dynamic |
| **Plugin Integration** | ✅ Native | ✅ Extensions | ❌ | ❌ |
| **MCP Store** | ❌ | ❌ | ❌ | ✅ UI Store |
| **Managed Config** | ✅ Enterprise | ❌ | ❌ | ❌ |

See [Platform Guides](04-platform-guides/) for detailed comparisons.

---

## External Resources

### Official Documentation
- [Model Context Protocol](https://modelcontextprotocol.io) - Official MCP site
- [MCP Specification](https://spec.modelcontextprotocol.io) - Protocol specification
- [MCP GitHub](https://github.com/modelcontextprotocol) - Official repositories

### Tools & SDKs
- [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) - Official TypeScript SDK
- [Python SDK](https://github.com/modelcontextprotocol/python-sdk) - Official Python SDK
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector) - Testing tool

### Related Modules
- [Skills Module](../skills/) - AI agent skills and capabilities
- [Commands Module](../commands/) - Slash commands reference
- [Agents Module](../agents/) - Sub-agents and custom agents

---

## Module Status

**Status:** 🚧 In Progress
**Last Updated:** February 2026
**Maintainer:** LIDR Team

### Completion Progress
- [x] Module structure created
- [x] README index completed
- [ ] Fundamentals section
- [ ] Using MCP section
- [ ] Creating Servers section
- [ ] Platform Guides section
- [ ] Advanced section
- [ ] Ecosystem Tools section
- [ ] Reference section

---

## Contributing

Found an issue or want to improve the documentation? Check our [contribution guidelines](../../CONTRIBUTING.md).

---

**Navigation:** [Back to Modules](../) | [Back to Docs](../../) | [Skills Module](../skills/)
