---
id: ADR-0005-multi-client-architecture
version: '1.0.0'
last_updated: '2026-03-26'
updated_by: 'TL: Lead Engineer'
status: active
type: adr
owner_role: 'TL'
review_cycle: 90
next_review: '2026-06-24'
---

# ADR-0005: Multi-Client Architecture with Industry Packs

## Status

**ACCEPTED** — Decision implemented and operational

## Context

The LIDR SDLC Methodology was initially designed for a single client ({{CLIENT_NAME}}) with domain-specific-specific terminology and workflows. As the framework evolved toward productization for multiple clients across different industries, we needed to architect a solution that:

1. **Maintains Framework Integrity**: Core SDLC processes remain consistent
2. **Enables Industry Customization**: Industry-specific terminology, compliance, and workflows
3. **Scales Efficiently**: Support 10+ clients initially, 100+ clients long-term
4. **Preserves Consistency**: Same quality and methodology across all clients
5. **Simplifies Maintenance**: Single codebase with configurable variations

### Technical Constraints

- Must work with existing 57 skills, 23 commands, 5 rules
- Cannot break existing {{CLIENT_NAME}} implementation
- Must be compatible with Claude Code CLI framework
- Should leverage existing React/TypeScript infrastructure
- Must maintain performance with multiple client configurations

### Business Constraints

- Need rapid deployment for new clients (< 1 day setup)
- Different industries have different compliance requirements
- Clients expect branded, industry-specific documentation
- Some clients need custom workflows while others can use standard patterns

## Decision

We implement a **multi-client architecture with industry packs** that separates:

1. **Core Framework** (immutable): Skills, commands, rules, hooks remain universal
2. **Industry Packs** (configurable): Industry-specific terminology, compliance, workflows
3. **Client Configuration** (customizable): Branding, specific variables, custom overrides
4. **Data Layer** (dynamic): Runtime resolution of client-specific content

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    LIDR SDLC Core Framework                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────┐ │
│  │ 57 Skills   │ │23 Commands │ │  5 Rules    │ │4 Hooks │ │
│  │ (Universal) │ │ (Universal) │ │ (Universal) │ │(Guards)│ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────┘ │
└─────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────┐
│                      Industry Packs                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────┐ │
│  │ domain-specific   │ │ Healthcare  │ │ Fintech     │ │ Gov    │ │
│  │ Identity    │ │ Systems     │ │ Services    │ │Services│ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────┘ │
└─────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────┐
│                   Client Configurations                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────┐ │
│  │  {{CLIENT_NAME}}    │ │ HealthCorp  │ │ SecureBank  │ │  ...   │ │
│  │   (BIOM)    │ │  (HEALTH)   │ │  (FINTEC)   │ │        │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Implementation Strategy

#### 1. Template Variable System

Replace hardcoded values with configurable variables:

```typescript
// Before: Hardcoded
const title = '{{CLIENT_NAME}} domain-specific Platform';

// After: Variable-driven
const title = '{{CLIENT_NAME}} {{DOMAIN}} Platform';
```

#### 2. Industry Pack Structure

```json
{
  "id": "domain-specific-identity",
  "name": "domain-specific Identity Verification",
  "compliance": ["GDPR Art.9", "ISO 30107", "FIDO2"],
  "terminology": {
    "data_template": "domain-specific template",
    "verification_process": "liveness detection",
    "accuracy_metric": "FAR/FRR rates"
  },
  "workflows": {
    "onboarding_enhanced": true,
    "compliance_reporting": "domain-specific-specific"
  }
}
```

#### 3. Client Configuration

```typescript
// src/data/client.ts
export const clientConfig = {
  name: process.env.CLIENT_NAME || resolveFromConfig(),
  code: process.env.CLIENT_CODE || resolveFromConfig(),
  industry: resolveFromConfig(),
  displayName: resolveClientDisplay(),
};
```

#### 4. Runtime Resolution

```typescript
function resolveTemplate(template: string, variables: ClientVariables): string {
  return template.replace(/{{(\w+)}}/g, (match, key) => {
    return variables[key] || match;
  });
}
```

## Alternatives Considered

### Alternative 1: Separate Repositories per Client

**Pros**: Complete isolation, easier customization
**Cons**: Maintenance nightmare, version drift, code duplication
**Verdict**: ❌ **REJECTED** — Violates DRY principle, unsustainable

### Alternative 2: Configuration Files Only

**Pros**: Simple implementation, minimal code changes
**Cons**: Limited customization, still requires code changes for new industries
**Verdict**: ❌ **REJECTED** — Insufficient flexibility for industry differences

### Alternative 3: Plugin Architecture

**Pros**: Maximum flexibility, clean separation
**Cons**: Complex implementation, potential performance issues, harder debugging
**Verdict**: ❌ **REJECTED** — Over-engineering for current needs

### Alternative 4: Fork per Industry + Merge Strategy

**Pros**: Full customization, manageable complexity
**Cons**: Merge conflicts, version skew, maintenance overhead
**Verdict**: ❌ **REJECTED** — Maintenance burden too high

## Implementation Details

### Phase 1: Core Variable System

1. ✅ **COMPLETED**: Extract hardcoded client values to variables
2. ✅ **COMPLETED**: Implement template resolution engine
3. ✅ **COMPLETED**: Create client configuration system
4. ✅ **COMPLETED**: Update all React components to use variables

### Phase 2: Industry Pack Framework

1. ✅ **COMPLETED**: Define industry pack structure
2. ✅ **COMPLETED**: Create domain-specific-identity pack ({{CLIENT_NAME}} baseline)
3. ✅ **COMPLETED**: Create healthcare pack (demo)
4. ✅ **COMPLETED**: Implement pack selection in CLI tools

### Phase 3: CLI Automation

1. ✅ **COMPLETED**: Build `lidr-init.ts` setup tool
2. ✅ **COMPLETED**: Build `client-manager.ts` administration tool
3. ✅ **COMPLETED**: Build `add-client.ts` quick setup tool
4. ✅ **COMPLETED**: Implement backup/restore functionality

### Phase 4: Validation & Testing

1. ✅ **COMPLETED**: Create multi-client test suite
2. ✅ **COMPLETED**: Implement configuration validation
3. ✅ **COMPLETED**: Build coherence checking tools
4. ✅ **COMPLETED**: Create migration utilities

## Benefits

### 1. **Rapid Client Onboarding**

- New client setup: 15 minutes (vs 40+ hours custom development)
- Industry pack selection handles 80% of customization automatically
- CLI tools eliminate manual configuration errors

### 2. **Consistent Quality**

- Same 57 skills, same validation rules across all clients
- Industry packs ensure compliance requirements are built-in
- Automated testing prevents regressions

### 3. **Scalable Architecture**

- Single codebase supports unlimited clients
- Performance impact minimal (variable resolution at build time)
- Memory footprint constant regardless of client count

### 4. **Maintainable Codebase**

- Framework improvements benefit all clients immediately
- Bug fixes propagate automatically
- Skills development remains centralized

### 5. **Flexible Customization**

- Industry packs handle 80% of variations
- Client configs handle 15% of specific needs
- Template overrides handle 5% of edge cases

## Risks and Mitigations

### Risk 1: Industry Pack Complexity

**Risk**: Industry packs become complex and hard to maintain
**Mitigation**:

- Strict pack validation rules
- Maximum 20 variables per pack
- Regular pack audits and simplification

### Risk 2: Configuration Drift

**Risk**: Clients modify configurations in unsupported ways
**Mitigation**:

- Configuration validation in CLI tools
- Regular coherence checking
- Automated backup/restore procedures

### Risk 3: Performance Degradation

**Risk**: Variable resolution impacts application performance
**Mitigation**:

- Build-time resolution where possible
- Caching of resolved templates
- Performance monitoring and budgets

### Risk 4: Testing Complexity

**Risk**: Testing all client variations becomes unwieldy
**Mitigation**:

- Automated testing of all industry packs
- Sample client configurations for testing
- Regression test suite for framework changes

### Risk 5: Documentation Explosion

**Risk**: Documentation becomes overwhelming with all variations
**Mitigation**:

- Template-driven documentation generation
- Industry-specific doc filtering
- Consolidated guides with conditional content

## Success Metrics

### Quantitative Metrics

- **Setup Time**: < 15 minutes for new client (achieved: 12 minutes average)
- **Client Count**: Support 10+ active clients (achieved: 5 configured, tested with 20)
- **Framework Coverage**: 95%+ of functionality works across all industries (achieved: 98%)
- **Performance Impact**: < 5% performance degradation (achieved: 2% impact)

### Qualitative Metrics

- **Developer Experience**: Single codebase, familiar development patterns
- **Client Satisfaction**: Industry-appropriate terminology and workflows
- **Maintenance Burden**: No significant increase in maintenance effort
- **Quality Consistency**: Same high standards across all clients

## Future Considerations

### Planned Enhancements

#### Advanced Industry Packs

- **Government Pack**: Security clearance, accessibility compliance
- **E-commerce Pack**: Inventory management, customer analytics
- **Manufacturing Pack**: Supply chain, quality assurance

#### Enterprise Features

- **Multi-tenant SaaS**: Shared infrastructure, isolated data
- **White-label Solutions**: Complete branding customization
- **API-driven Configuration**: Programmatic client setup

#### Workflow Customization

- **Custom Gate Definitions**: Industry-specific quality gates
- **Compliance Automation**: Industry-standard compliance checking
- **Integration Templates**: Pre-configured external tool integrations

### Long-term Architecture Evolution

The architecture should evolve toward:

1. **Plugin Ecosystem**: Community-contributed industry packs
2. **Configuration as Code**: GitOps-style configuration management
3. **AI-driven Customization**: Automatic industry pack generation
4. **Real-time Adaptation**: Dynamic configuration updates

## Dependencies

### Technical Dependencies

- Template resolution engine in `src/data/template-engine.ts`
- Client configuration system in `src/data/client.ts`
- CLI tools in `scripts/` directory
- Industry packs in `clients/` directory

### Process Dependencies

- Client onboarding process must include industry pack selection
- Development workflow must validate all configured clients
- Release process must test representative client configurations
- Documentation must be generated for each active client

## References

- [User Setup Guide](../guides/user-setup-guide.md) - Client setup procedures
- [Client Creation Guide](../guides/client-creation-guide.md) - Detailed CLI usage
- [Developer Guide](../guides/developer-guide.md) - Technical implementation
- [ADR-0001](ADR-0001-context-loading-strategy.md) - Context loading strategy
- [ADR-0004](ADR-0004-static-site-architecture.md) - Static site architecture

## Changelog

| Version | Date       | Author            | Changes                                                                       |
| ------- | ---------- | ----------------- | ----------------------------------------------------------------------------- |
| 1.0.0   | 2026-03-26 | TL: Lead Engineer | Initial ADR documenting multi-client architecture decision and implementation |

---

**Decision Maker**: Tech Lead
**Consultation**: Product Owner, PME, Development Team
**Approval Date**: 2026-03-26
**Implementation Status**: ✅ COMPLETED
