---
id: client-creation-guide
version: "1.0.0"
last_updated: "2026-03-26"
updated_by: "TL: Lead Engineer"
status: active
type: guide
owner_role: "TL"
review_cycle: 60
next_review: "2026-05-25"
---

# Client Creation Guide — LIDR SDLC Methodology

> **Complete guide for creating and configuring client-specific implementations using CLI tools**

## Overview

The LIDR SDLC Methodology supports multiple client configurations through industry packs and customizable templates. This guide covers the complete workflow for setting up new clients.

## Quick Start (10 Minutes)

### Interactive Setup

```bash
# Navigate to your project directory
cd your-project

# Run interactive client setup
npx tsx scripts/lidr-init.ts

# Follow prompts:
# 1. Client name (e.g., "Acme Corporation")
# 2. Client code (e.g., "ACME")
# 3. Industry pack selection
# 4. Technology stack
# 5. Team configuration
```

### Verification

```bash
# Verify client configuration
npx tsx scripts/client-manager.ts status

# Expected output:
# Active Client: Acme Corporation (ACME)
# Industry Pack: fintech
# Variables: 12 configured
# Documents: 23 generated
```

---

## Industry Packs

### Available Industry Packs

| Industry Pack          | Description                              | Key Features                                                  |
| ---------------------- | ---------------------------------------- | ------------------------------------------------------------- |
| **biometric-identity** | Identity verification, biometric systems | GDPR Art.9 compliance, liveness detection, KYC workflows      |
| **healthcare**         | Healthcare applications, patient data    | HIPAA compliance, clinical workflows, patient safety          |
| **fintech**            | Financial services, payment systems      | PCI-DSS compliance, fraud detection, regulatory reporting     |
| **government**         | Government systems, public services      | Security clearance, accessibility (WCAG 2.1 AA), transparency |
| **ecommerce**          | E-commerce platforms, retail             | PCI compliance, inventory management, customer analytics      |

### Selecting Industry Packs

```bash
# List available packs
npx tsx scripts/lidr-init.ts --list-packs

# Use specific pack
npx tsx scripts/lidr-init.ts --industry fintech --auto-configure

# Custom pack (advanced)
npx tsx scripts/lidr-init.ts --industry custom --pack-path ./custom-pack/
```

---

## CLI Tools Reference

### 1. lidr-init.ts — Main Setup Tool

Initialize complete LIDR SDLC framework for new client.

```bash
# Interactive mode (recommended for first-time setup)
npx tsx scripts/lidr-init.ts

# Automated mode with parameters
npx tsx scripts/lidr-init.ts \
  --name "Acme Corporation" \
  --code "ACME" \
  --industry "fintech" \
  --stack "react,node,postgres" \
  --auto-configure

# Advanced options
npx tsx scripts/lidr-init.ts \
  --name "Custom Corp" \
  --code "CUST" \
  --industry "custom" \
  --pack-path "./industry-packs/custom/" \
  --template-override \
  --dry-run
```

#### Options

- `--name`: Client display name (spaces allowed)
- `--code`: Client code (uppercase, no spaces)
- `--industry`: Industry pack to use
- `--stack`: Technology stack (comma-separated)
- `--auto-configure`: Skip interactive prompts
- `--pack-path`: Path to custom industry pack
- `--template-override`: Allow template customization
- `--dry-run`: Show changes without applying

#### Process

1. **Scan**: Analyze existing project structure
2. **Configure**: Apply industry pack and client settings
3. **Generate**: Create client-specific documentation
4. **Validate**: Run integrity checks
5. **Report**: Show summary of changes

### 2. client-manager.ts — Client Administration

Manage multiple client configurations.

```bash
# Show current client status
npx tsx scripts/client-manager.ts status

# List all configured clients
npx tsx scripts/client-manager.ts list

# Switch to different client
npx tsx scripts/client-manager.ts switch --client "acme"

# Create new client configuration
npx tsx scripts/client-manager.ts create \
  --name "New Client" \
  --code "NEW" \
  --industry "healthcare"

# Remove client configuration
npx tsx scripts/client-manager.ts remove --client "old-client"

# Export client configuration
npx tsx scripts/client-manager.ts export \
  --client "acme" \
  --output "acme-backup.json" \
  --include-docs

# Import client configuration
npx tsx scripts/client-manager.ts import \
  --file "acme-backup.json" \
  --merge-conflicts "prompt"

# Reset to default configuration
npx tsx scripts/client-manager.ts reset --confirm
```

### 3. add-client.ts — Add New Client

Quick command to add additional client without full setup.

```bash
# Add new client with minimal config
npx tsx scripts/add-client.ts \
  --name "Quick Client" \
  --code "QUICK" \
  --industry "ecommerce"

# Add with full configuration
npx tsx scripts/add-client.ts \
  --name "Full Client" \
  --code "FULL" \
  --industry "fintech" \
  --description "Full-service financial platform" \
  --contact "tech@fullclient.com" \
  --timezone "America/New_York"
```

---

## Configuration Structure

### Client Directory Structure

After setup, your project will have:

```
your-project/
├── .claude/                     # Framework core (unchanged)
├── clients/                     # Client configurations
│   ├── default/                 # Default fallback
│   ├── acme/                    # Your client config
│   │   ├── client-config.json   # Basic client info
│   │   ├── variables.json       # Template variables
│   │   ├── customizations.json  # UI customizations
│   │   └── industry-pack.json   # Industry-specific config
├── src/data/client.ts          # Active client config
└── docs/projects/acme/         # Client-specific docs
    ├── requirements/
    ├── architecture/
    └── specifications/
```

### Configuration Files

#### client-config.json

```json
{
  "name": "Acme Corporation",
  "code": "ACME",
  "displayName": "Acme Corp - Financial Services Platform",
  "industry": "fintech",
  "description": "Full-service financial platform with AI-powered risk assessment",
  "contact": "tech@acmecorp.com",
  "timezone": "America/New_York",
  "created": "2026-03-26T00:00:00Z",
  "lastModified": "2026-03-26T00:00:00Z"
}
```

#### variables.json

```json
{
  "CLIENT_NAME": "Acme Corporation",
  "CLIENT_CODE": "ACME",
  "CLIENT_DISPLAY": "Acme Corp - Financial Services Platform",
  "DOMAIN": "Financial Services",
  "INDUSTRY": "fintech",
  "PRIMARY_COLOR": "#2563eb",
  "SECONDARY_COLOR": "#1e40af",
  "TECH_STACK": ["React", "Node.js", "PostgreSQL"],
  "COMPLIANCE": ["PCI-DSS", "SOX", "GDPR"],
  "KEY_FEATURES": ["Risk Assessment Engine", "Fraud Detection", "Regulatory Reporting"]
}
```

#### industry-pack.json

```json
{
  "pack": "fintech",
  "version": "1.0.0",
  "compliance": {
    "required": ["PCI-DSS", "SOX"],
    "recommended": ["ISO 27001", "GDPR"]
  },
  "workflows": {
    "risk_assessment": true,
    "fraud_detection": true,
    "regulatory_reporting": true
  },
  "templates": {
    "prd_sections": ["regulatory_requirements", "risk_assessment", "fraud_prevention"]
  }
}
```

#### customizations.json

```json
{
  "ui": {
    "primaryColor": "#2563eb",
    "secondaryColor": "#1e40af",
    "logoUrl": "/assets/acme-logo.png",
    "faviconUrl": "/assets/acme-favicon.ico"
  },
  "branding": {
    "companyName": "Acme Corporation",
    "tagline": "Powering Financial Innovation",
    "websiteUrl": "https://acmecorp.com"
  },
  "features": {
    "enableRiskDashboard": true,
    "enableComplianceReporting": true,
    "enableFraudAlerts": true
  }
}
```

---

## Advanced Configuration

### Custom Industry Packs

Create custom industry configurations for unique requirements:

#### 1. Create Industry Pack Directory

```bash
mkdir industry-packs/custom-finance/
```

#### 2. Define Pack Configuration

```json
// industry-packs/custom-finance/pack.json
{
  "id": "custom-finance",
  "name": "Custom Financial Services",
  "version": "1.0.0",
  "description": "Specialized financial services with crypto support",
  "compliance": ["PCI-DSS", "AML", "KYC", "FATCA"],
  "templates": {
    "prd_sections": ["crypto_compliance", "aml_requirements", "kyc_verification"]
  },
  "variables": {
    "CRYPTO_SUPPORTED": true,
    "AML_LEVEL": "enhanced",
    "KYC_VERIFICATION": "automated"
  }
}
```

#### 3. Custom Templates

```bash
# Create custom templates
mkdir industry-packs/custom-finance/templates/
cp -r industry-packs/fintech/templates/* industry-packs/custom-finance/templates/

# Customize templates for your industry
# Edit templates to include crypto-specific sections
```

#### 4. Apply Custom Pack

```bash
npx tsx scripts/lidr-init.ts \
  --industry custom-finance \
  --pack-path ./industry-packs/custom-finance/
```

### Template Customization

#### Variable Resolution

Templates support variable substitution:

```markdown
<!-- Template: templates/prd-template.md -->

# {{CLIENT_NAME}} - Project Requirements Document

## 1. Overview

{{CLIENT_NAME}} is developing a {{DOMAIN}} platform with the following key features:

{{#each KEY_FEATURES}}

- {{this}}
  {{/each}}

## 2. Compliance Requirements

{{#each COMPLIANCE}}

- {{this}} compliance mandatory
  {{/each}}
```

#### Custom Template Variables

Add custom variables for your industry:

```json
// clients/acme/variables.json
{
  "CUSTOM_VARS": {
    "RISK_TOLERANCE": "medium",
    "FRAUD_THRESHOLD": "0.05",
    "REGULATORY_BODY": "SEC",
    "AUDIT_FREQUENCY": "quarterly"
  }
}
```

#### Template Override

Override specific templates for client needs:

```bash
# Create client-specific template override
mkdir clients/acme/templates/
cp .claude/skills/prd-funcional/templates/prd.md clients/acme/templates/custom-prd.md

# Customize for client
# Edit clients/acme/templates/custom-prd.md

# Apply override
npx tsx scripts/client-manager.ts apply-templates --client "acme"
```

---

## Workflow Examples

### Example 1: Setting Up Financial Services Client

```bash
# 1. Initialize with fintech pack
npx tsx scripts/lidr-init.ts \
  --name "SecureBank Corp" \
  --code "SBC" \
  --industry "fintech" \
  --stack "react,node,postgres,redis"

# 2. Verify setup
npx tsx scripts/client-manager.ts status

# 3. Customize for banking
npx tsx scripts/client-manager.ts customize \
  --client "securebank" \
  --add-compliance "SOX,FFIEC" \
  --add-feature "loan-origination,credit-scoring"

# 4. Generate initial documentation
/document-project "securebank-platform"

# 5. Validate configuration
npx tsx scripts/validate-coherence.ts
```

### Example 2: Healthcare Client with HIPAA

```bash
# 1. Setup with healthcare pack
npx tsx scripts/lidr-init.ts \
  --name "MedTech Solutions" \
  --code "MTS" \
  --industry "healthcare"

# 2. Add HIPAA-specific configurations
npx tsx scripts/client-manager.ts configure \
  --client "medtech" \
  --set "HIPAA_LEVEL=full" \
  --set "PHI_ENCRYPTION=required" \
  --set "AUDIT_TRAIL=comprehensive"

# 3. Apply healthcare templates
npx tsx scripts/client-manager.ts apply-pack \
  --client "medtech" \
  --pack "healthcare-plus"

# 4. Validate HIPAA compliance
/validate-project-docs medtech-platform
```

### Example 3: Multi-Tenant SaaS Setup

```bash
# 1. Create tenant configurations
for tenant in "acme" "globex" "initech"; do
  npx tsx scripts/add-client.ts \
    --name "${tenant^} Corporation" \
    --code "${tenant^^}" \
    --industry "saas"
done

# 2. Configure shared settings
npx tsx scripts/client-manager.ts bulk-configure \
  --clients "acme,globex,initech" \
  --set "MULTI_TENANT=true" \
  --set "SHARED_INFRASTRUCTURE=true"

# 3. Generate tenant-specific docs
for tenant in "acme" "globex" "initech"; do
  npx tsx scripts/client-manager.ts switch --client "$tenant"
  /document-project "${tenant}-tenant"
done
```

---

## Migration and Backup

### Exporting Client Configurations

#### Full Export

```bash
# Export everything for client
npx tsx scripts/client-manager.ts export \
  --client "acme" \
  --output "acme-full-backup.json" \
  --include-docs \
  --include-generated \
  --include-history
```

#### Selective Export

```bash
# Export only configuration
npx tsx scripts/client-manager.ts export \
  --client "acme" \
  --output "acme-config.json" \
  --config-only

# Export only documentation
npx tsx scripts/client-manager.ts export \
  --client "acme" \
  --output "acme-docs.json" \
  --docs-only
```

### Importing Configurations

#### Standard Import

```bash
# Import client configuration
npx tsx scripts/client-manager.ts import \
  --file "acme-backup.json" \
  --merge-conflicts "prompt"
```

#### Advanced Import Options

```bash
# Import with specific merge strategy
npx tsx scripts/client-manager.ts import \
  --file "acme-backup.json" \
  --merge-conflicts "overwrite" \
  --preserve-local-changes \
  --backup-existing
```

### Version Migration

When upgrading LIDR SDLC framework versions:

```bash
# Backup current configuration
npx tsx scripts/client-manager.ts backup-all \
  --output "pre-migration-backup.json"

# Check migration requirements
npx tsx scripts/migration-check.ts \
  --from "1.0.0" \
  --to "2.0.0"

# Run migration
npx tsx scripts/migrate-clients.ts \
  --version "2.0.0" \
  --apply-changes \
  --preserve-customizations

# Validate post-migration
npx tsx scripts/validate-coherence.ts --strict
```

---

## Troubleshooting

### Common Issues

#### 1. Client Configuration Not Found

```bash
# Check if client exists
npx tsx scripts/client-manager.ts list

# If missing, recreate
npx tsx scripts/add-client.ts --name "Missing Client" --code "MISS"

# Or restore from backup
npx tsx scripts/client-manager.ts import --file "backup.json"
```

#### 2. Variable Resolution Failures

```bash
# Check variable configuration
npx tsx scripts/client-manager.ts validate --client "acme"

# Fix missing variables
npx tsx scripts/client-manager.ts configure \
  --client "acme" \
  --set "MISSING_VAR=value"

# Regenerate templates
npx tsx scripts/client-manager.ts apply-templates --client "acme" --force
```

#### 3. Industry Pack Conflicts

```bash
# Check pack compatibility
npx tsx scripts/validate-pack.ts --pack "fintech" --client "acme"

# Reset to default pack
npx tsx scripts/client-manager.ts reset-pack --client "acme" --pack "default"

# Apply compatible pack
npx tsx scripts/client-manager.ts apply-pack --client "acme" --pack "fintech-v2"
```

#### 4. Documentation Generation Failures

```bash
# Check template paths
npx tsx scripts/debug-templates.ts --client "acme"

# Regenerate with verbose output
npx tsx scripts/client-manager.ts generate-docs \
  --client "acme" \
  --verbose \
  --force-regenerate

# Validate generated docs
npx tsx scripts/validate-docs.ts --client "acme"
```

### Debugging CLI Tools

#### Enable Debug Mode

```bash
# Set debug environment
export LIDR_DEBUG="true"
export LIDR_LOG_LEVEL="verbose"

# Run command with debug output
npx tsx scripts/lidr-init.ts --name "Debug Client" --code "DEBUG"
```

#### Check Tool Status

```bash
# Verify tool installations
npx tsx scripts/check-dependencies.ts

# Test CLI tool functionality
npx tsx scripts/test-cli-tools.ts

# Validate environment
npx tsx scripts/validate-environment.ts
```

### Recovery Procedures

#### Complete Reset

```bash
# Backup current state
npx tsx scripts/client-manager.ts backup-all --output "emergency-backup.json"

# Reset framework to defaults
npx tsx scripts/client-manager.ts reset --confirm --full-reset

# Restore from backup
npx tsx scripts/client-manager.ts import --file "emergency-backup.json"
```

#### Partial Recovery

```bash
# Reset specific client
npx tsx scripts/client-manager.ts reset-client --client "acme" --confirm

# Restore client from backup
npx tsx scripts/client-manager.ts import \
  --file "acme-backup.json" \
  --client "acme" \
  --overwrite-existing
```

---

## Best Practices

### 1. Configuration Management

- **Version control**: Store client configs in git
- **Backup regularly**: Export configs before major changes
- **Document changes**: Use git commits to track config evolution
- **Test changes**: Use `--dry-run` before applying

### 2. Template Customization

- **Minimal changes**: Customize only what's necessary
- **Version templates**: Track template changes separately
- **Test generation**: Validate template output before deployment
- **Document overrides**: Explain why templates were customized

### 3. Multi-Client Environments

- **Consistent naming**: Use clear, predictable client codes
- **Shared configurations**: Leverage common settings across clients
- **Environment separation**: Keep dev/staging/prod configs separate
- **Access controls**: Limit who can modify client configurations

### 4. Industry Pack Usage

- **Standard packs first**: Use provided packs when possible
- **Custom pack documentation**: Document custom pack rationale
- **Pack versioning**: Track industry pack versions
- **Regular updates**: Keep packs current with industry standards

---

## CLI Tool Reference

### Quick Command Reference

| Command             | Purpose        | Usage                                                  |
| ------------------- | -------------- | ------------------------------------------------------ |
| `lidr-init.ts`      | Initial setup  | `npx tsx scripts/lidr-init.ts [options]`               |
| `client-manager.ts` | Manage clients | `npx tsx scripts/client-manager.ts <action> [options]` |
| `add-client.ts`     | Add new client | `npx tsx scripts/add-client.ts --name "X" --code "Y"`  |

### Exit Codes

| Code | Meaning             |
| ---- | ------------------- |
| 0    | Success             |
| 1    | General error       |
| 2    | Invalid arguments   |
| 3    | File not found      |
| 4    | Configuration error |
| 5    | Validation failed   |

### Environment Variables

| Variable           | Purpose             | Default     |
| ------------------ | ------------------- | ----------- |
| `LIDR_DEBUG`       | Enable debug output | `false`     |
| `LIDR_CLIENT`      | Default client code | `DEFAULT`   |
| `LIDR_CONFIG_PATH` | Config directory    | `./clients` |

---

_This guide provides complete instructions for creating and managing client configurations in the LIDR SDLC Methodology. For setup instructions, see the [User Setup Guide](user-setup-guide.md). For technical details, see the [Developer Guide](developer-guide.md)._

## Changelog

| Versión | Fecha      | Autor             | Cambios                                                              |
| ------- | ---------- | ----------------- | -------------------------------------------------------------------- |
| 1.0.0   | 2026-03-26 | TL: Lead Engineer | Versión inicial del Client Creation Guide para LIDR SDLC Methodology |
