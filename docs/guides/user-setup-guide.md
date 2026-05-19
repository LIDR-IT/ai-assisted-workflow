---
id: user-setup-guide
version: "1.1.0"
last_updated: "2026-04-06"
updated_by: "TL: skills count update"
status: active
type: guide
owner_role: "TL"
review_cycle: 60
next_review: "2026-05-25"
---

# User Setup Guide — LIDR SDLC Methodology

> **Complete setup guide for teams implementing the LIDR SDLC Methodology framework**

## Quick Start (15 Minutes)

### Prerequisites

- Node.js 20+ installed
- Git repository access
- Claude Code CLI installed
- Project directory ready

### 1. Initialize LIDR SDLC Framework

```bash
# Navigate to your project directory
cd your-project-directory

# Initialize LIDR SDLC methodology
npx tsx scripts/lidr-init.ts

# Follow the interactive prompts to configure:
# - Industry pack selection
# - Client information
# - Technology stack
# - Team composition
```

### 2. Verify Installation

```bash
# Check that .claude/ directory was created
ls -la .claude/

# Verify skills are installed
ls .claude/skills/ | wc -l
# Should show 61+ skills

# Verify rules are configured
ls .claude/rules/
# Should show: documentation.md, org.md, project.md, tech-stack.md, workflows.md
```

### 3. First Workflow Test

```bash
# Open Claude Code in your project
code .

# Test basic help functionality
/lidr-help "business case"

# Should return skills and workflows related to business case creation
```

---

## Multi-Client Configuration

### Understanding Client Systems

The LIDR SDLC framework supports multiple client configurations:

```
your-project/
├── .claude/                     # Framework core (61 skills, 23 commands, 5 rules)
├── src/data/client.ts          # Current client configuration
├── clients/                    # Client-specific configurations
│   ├── default/
│   ├── {{CLIENT_CODE}}/               # domain-specific identity industry pack
│   ├── healthcare-demo/       # Healthcare industry pack
│   └── your-client/           # Your custom configuration
└── docs/projects/             # Client-specific documentation
```

### Setting Up Additional Clients

```bash
# Add a new client configuration
npx tsx scripts/add-client.ts --name "YourCompany" --code "YCOM" --industry "fintech"

# Switch between clients
npx tsx scripts/client-manager.ts switch --client "your-client"

# Export current configuration for sharing
npx tsx scripts/client-manager.ts export --client "your-client" --output "client-backup.json"

# Import shared configuration
npx tsx scripts/client-manager.ts import --file "client-backup.json"
```

---

## Team Onboarding

### Role-Based Access

The framework defines specific roles with different access patterns:

| Role          | Primary Access                    | Key Skills                                         | Commands Authorized             |
| ------------- | --------------------------------- | -------------------------------------------------- | ------------------------------- |
| **PME**       | Portfolio management, governance  | business-case, stakeholder-map, epic-review        | /advance-gate, /track-sdlc      |
| **PO**        | Product definition, requirements  | prd-funcional, user-stories, validate-requirements | /validate-prd, /quick-spec      |
| **Tech Lead** | Technical decisions, architecture | prd-tecnico, adr, architecture-doc                 | /implement-ticket, /sync-docs   |
| **Developer** | Implementation, code quality      | pr-description, dev-handoff-qa, tech-debt          | /create-branch, /create-pr      |
| **QA**        | Testing strategy, validation      | test-plan, bug-report, test-execution-report       | /prepare-testing, /advance-gate |
| **Security**  | Security assessment, compliance   | vuln-assessment, security-checklist                | /advance-gate (Gate 6)          |
| **DevOps**    | Deployment, infrastructure        | change-request, rollback-plan, release-notes       | /create-release-notes           |

### Individual Setup

Each team member should configure their environment:

```bash
# 1. Clone project with LIDR SDLC framework
git clone <project-repo>
cd <project>

# 2. Install dependencies
npm install

# 3. Configure Claude Code (if not installed)
npm install -g @anthropics/claude-code

# 4. Set role in environment (optional)
export LIDR_ROLE="Developer"  # or PME, PO, etc.

# 5. Test role-appropriate workflow
/lidr-help "my role"
```

---

## Daily Workflow Examples

### For Product Owners

```bash
# Start new feature specification
/quick-spec "user profile enhancement"

# Generate functional requirements
/prd-funcional "user-profile-project"

# Validate requirements quality
/validate-prd "user-profile-project"

# Advance to development
/advance-gate 2
```

### For Developers

```bash
# Pick up ticket from sprint
/create-branch PROJ-123

# Implement ticket completely
/implement-ticket PROJ-123

# Create pull request
/create-pr PROJ-123

# Check project documentation is current
/sync-docs
```

### For QA Engineers

```bash
# Prepare testing for ready ticket
/prepare-testing PROJ-123

# Generate comprehensive test plan
skills/test-plan

# Execute tests and document
skills/test-execution-report

# Quality gate approval
/advance-gate 5
```

---

## Configuration Management

### Environment Variables

```bash
# Set in your shell profile (.bashrc, .zshrc, etc.)
export LIDR_CLIENT="your-client-code"
export LIDR_ROLE="Developer"
export LIDR_DEBUG="false"

# Project-specific settings
export JIRA_PROJECT="PROJ"
export GITHUB_REPO="org/repo"
```

### Claude Code Settings

Create `.claude/settings.local.json` for user-specific settings:

```json
{
  "permissions": {
    "filesystem": "allow",
    "bash": "allow"
  },
  "model": "claude-3-5-sonnet-20241022",
  "debug": false,
  "client": {
    "name": "YourCompany",
    "code": "YCOM"
  }
}
```

### Integration Settings

Configure external tool integrations in `docs/standards/tool-integrations.md`:

- **Jira**: Project keys, custom fields, workflow states
- **GitHub**: Repository settings, branch protection, PR templates
- **Confluence**: Space keys, page templates, permissions
- **Slack**: Channels, webhook URLs, notification preferences

---

## Troubleshooting

### Common Setup Issues

#### 1. "Skills not found" Error

```bash
# Verify .claude/skills directory exists
ls -la .claude/skills/

# Reinstall if missing
npx tsx scripts/lidr-init.ts --force
```

#### 2. "Permission denied" on Commands

```bash
# Check your role configuration
echo $LIDR_ROLE

# Verify role permissions in rules/workflows.md
/lidr-help "roles"
```

#### 3. "Client configuration missing"

```bash
# Check current client
npx tsx scripts/client-manager.ts status

# Reset to default if corrupted
npx tsx scripts/client-manager.ts reset
```

### Performance Issues

#### Slow Command Execution

```bash
# Enable debug mode to identify bottlenecks
export LIDR_DEBUG="true"
/implement-ticket PROJ-123

# Check hooks configuration
cat .claude/settings.json | grep -A5 "hooks"
```

#### Memory Issues

```bash
# Reduce parallel processing
export LIDR_MAX_PARALLEL="2"

# Clear cache if needed
rm -rf .claude/cache/
```

### Getting Help

#### Built-in Help System

```bash
# General ecosystem help
/lidr-help

# Search for specific functionality
/lidr-help "testing workflow"

# Role-specific guidance
/lidr-help "role: Developer"

# Troubleshooting specific issues
/lidr-help "troubleshoot"
```

#### Support Resources

- **Documentation**: `docs/` directory in your project
- **Examples**: `.claude/skills/*/examples/` for usage patterns
- **Validation**: Run `/validate-project-docs` for health check
- **Community**: GitHub issues for framework improvements

---

## Advanced Configuration

### Custom Industry Packs

Create custom industry configurations:

```bash
# Create new industry pack
mkdir clients/your-industry/
cp -r clients/default/* clients/your-industry/

# Customize for your domain
# Edit: client-config.json, variables.json, customizations.json
```

### Extending the Framework

#### Adding Custom Skills

```bash
# Generate new skill template
npx tsx scripts/skill-creator.ts --name "custom-skill" --phase 5

# Implement skill in .claude/skills/custom-skill/
# Test with examples and validation
```

#### Custom Commands

```bash
# Create command template
npx tsx scripts/command-development.ts --name "custom-command" --tier 2

# Implement in commands/custom-command.md
# Add to rules/workflows.md for role authorization
```

### Integration Patterns

#### CI/CD Integration

```bash
# Add to your CI pipeline
- name: Validate SDLC Compliance
  run: |
    npx tsx scripts/validate-coherence.ts
    /validate-project-docs
```

#### Git Hooks Integration

```bash
# Pre-commit validation
echo 'npx tsx scripts/validate-coherence.ts' > .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

---

## Migration Guide

### From Existing Workflows

#### Jira-Based Teams

1. Export current project configuration from Jira
2. Map existing custom fields to LIDR fields
3. Import historical data with `/track-sdlc`
4. Train team on LIDR-specific workflows

#### GitHub-Only Teams

1. Analyze current PR and issue templates
2. Configure LIDR templates in `.github/`
3. Set up branch protection with LIDR gates
4. Implement LIDR workflow checks in Actions

#### Confluence Documentation Teams

1. Audit existing documentation structure
2. Map to LIDR document types (PRDs, ADRs, etc.)
3. Migrate critical documents to `docs/projects/`
4. Set up bi-directional sync with Confluence

### Validation Checklist

After setup completion:

- [ ] All 57 skills accessible via `/lidr-help`
- [ ] Role permissions working per `rules/workflows.md`
- [ ] Client configuration displays correctly
- [ ] External tool integrations responding
- [ ] Documentation generates successfully
- [ ] Gates and workflows operational
- [ ] Team members can execute role-appropriate commands
- [ ] Project validation passes: `/validate-project-docs`

---

## Success Metrics

Track implementation success with these KPIs:

### Adoption Metrics

- **Skill Usage**: Commands executed per sprint
- **Gate Compliance**: % of stories passing gates on first attempt
- **Documentation Health**: % of docs that are current and complete
- **Team Velocity**: Story points delivered per sprint (baseline vs LIDR)

### Quality Metrics

- **Defect Escape Rate**: % bugs found in production vs QA
- **Requirements Traceability**: % of code linked to requirements
- **Technical Debt**: Hours spent on debt vs new features
- **Deployment Success Rate**: % deployments without rollback

### Efficiency Metrics

- **Lead Time**: Days from story creation to production
- **Code Review Cycle Time**: Hours from PR creation to merge
- **Documentation Lag**: Days between code change and doc update
- **Sprint Predictability**: % sprints delivered as committed

---

_This guide provides complete setup instructions for implementing the LIDR SDLC Methodology in your organization. For technical implementation details, see the [Developer Guide](developer-guide.md)._

## Changelog

| Versión | Fecha      | Autor             | Cambios                                                         |
| ------- | ---------- | ----------------- | --------------------------------------------------------------- |
| 1.0.0   | 2026-03-26 | TL: Lead Engineer | Versión inicial del User Setup Guide para LIDR SDLC Methodology |
