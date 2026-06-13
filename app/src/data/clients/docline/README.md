# Docline Client Configuration

This directory contains the client-specific configuration for Docline, a healthcare technology platform specializing in telemedicine services. This setup demonstrates the separation between the generic LIDR SDLC Methodology framework and domain-specific content.

## File Structure

```
src/data/clients/docline/
├── config.ts               # Client configuration with healthcare domain settings
├── domain-context.md       # Healthcare domain glossary, regulations, and context
├── nav.ts                  # Navigation structure (if client-specific)
├── diagrams/               # Client-specific diagram data
└── README.md               # This file
```

## Framework vs Client Content Separation

### Framework Content (Generic)

Located in `.claude/rules/` and core framework files:

- **SDLC process structure**: 8 phases, 8 gates, workflows
- **Role definitions**: PME, PO, Tech Lead, QA, Security, DevOps, SM
- **Skill templates**: 60+ skills with templates, checklists, validation
- **Command orchestration**: 30 commands for SDLC automation
- **Quality standards**: DoR/DoD, code review, testing, documentation
- **Architecture patterns**: React Flow, TypeScript, testing strategies

### Client Content (Healthcare Domain)

Located in `src/data/clients/docline/`:

- **Domain glossary**: Healthcare terms, telemedicine, clinical workflows, EHR integration, etc.
- **Product context**: Telemedicine Video Platform, E-Prescription System, Patient Portal, Clinical Dashboard
- **Regulatory requirements**: HIPAA, HITECH, FDA 21 CFR Part 11, HL7 FHIR, DICOM, etc.
- **Team composition**: Clinical-focused roles, healthcare compliance specialists
- **Compliance constraints**: Zero-tolerance for PHI data exposure and patient safety violations
- **Industry context**: Healthcare providers, insurance companies, patient care use cases

## Content Migration

The following content was moved FROM generic framework rules TO client-specific files:

### From Generic Rules → Client Configuration

| Content                  | Source             | Destination              | Reason                      |
| ------------------------ | ------------------ | ------------------------ | --------------------------- |
| Healthcare glossary      | `rules/project.md` | `domain-context.md`      | Domain-specific terminology |
| Product portfolio        | `rules/project.md` | `config.ts` mainProducts | Business context            |
| Regulatory framework     | `rules/project.md` | `config.ts` regulations  | Compliance requirements     |
| Team clinical focus      | `rules/project.md` | `config.ts` team         | Industry-specific roles     |
| Healthcare risk language | `rules/project.md` | `config.ts` templateVars | Communication style         |

### Maintained in Framework

| Content                  | Location                      | Reason                                 |
| ------------------------ | ----------------------------- | -------------------------------------- |
| SDLC phases/gates        | `rules/org.md`                | Universal process structure            |
| DoR/DoD criteria         | Skills checklists             | Quality standards apply to all clients |
| Skill templates          | `.claude/skills/*/templates/` | Immutable format standards             |
| Code standards           | `rules/tech-stack.md`         | Technical consistency                  |
| Documentation governance | `rules/documentation.md`      | Universal documentation standards      |

## Benefits of This Separation

### ✅ Framework Portability

- LIDR SDLC Methodology can be applied to any industry
- Generic skills work across healthcare, fintech, government, etc.
- Rules contain no healthcare-specific content

### ✅ Client Customization

- Domain glossary matches client's business language (telemedicine, clinical workflows)
- Regulatory context reflects actual compliance requirements (HIPAA, FDA)
- Team structure reflects industry-specific roles (clinical specialists, patient safety)
- Risk language matches organizational culture (patient safety-focused)

### ✅ Maintenance Efficiency

- Framework improvements benefit all clients
- Client-specific changes don't affect framework
- Clear boundaries for customization vs standardization

### ✅ Knowledge Transfer

- New team members get healthcare domain context immediately
- Framework training is industry-agnostic
- Client onboarding focuses on healthcare business specifics

## Usage Examples

### Generating Domain-Aware Content

```typescript
// Skills automatically use client configuration
const client = getCurrentClient(); // Returns 'docline'
const templateVars = getClientData('docline').templateVars;

// Template processing with healthcare context
const content = processTemplate(template, {
  CLIENT_REGULATIONS: 'HIPAA, HITECH, FDA 21 CFR Part 11, GDPR, HL7 FHIR...',
  SENSITIVE_DATA_TYPE: 'protected health information (PHI), clinical records, patient data...',
  STAKEHOLDER_TYPES: 'patients, healthcare providers, clinical staff, insurance companies...',
});
```

### Framework Skills with Client Context

```typescript
// lidr-requirements (per-rf mode) uses client domain terms
const requirements = await generateRF({
  domain: 'healthcare technology and telemedicine services',
  regulations: ['HIPAA', 'HITECH', 'FDA 21 CFR Part 11'],
  domainTerms: client.domainTerms,
});
```

## Next Steps for Other Clients

When adding a new client (e.g., fintech, government):

1. **Copy client structure**:

   ```
   src/data/clients/[new-client]/
   ├── config.ts
   ├── domain-context.md
   └── diagrams/
   ```

2. **Update domain context**:
   - Replace healthcare terms with industry-specific glossary
   - Update regulatory requirements (PCI-DSS, SOX, etc.)
   - Modify product portfolio and use cases

3. **Configure template variables**:
   - Adjust risk language and communication style
   - Update tool ecosystem and team structure
   - Set compliance framework and governance style

4. **Framework remains unchanged**:
   - Skills, commands, rules work as-is
   - Only client configuration changes
   - Universal SDLC methodology preserved

## Real Docline Business Context

Docline is a healthcare technology platform founded in 2015 that connects:

- **6,000 doctors** across their network
- **2M+ patients** actively using the platform
- **23,000 pharmacies** integrated for e-prescriptions
- Operations in **Spain and Morocco**, expanding to Latin America
- Recent **€4.6M funding** (October 2025) for growth and expansion

### Core Services

- **Telemedicine consultations** via secure video platform
- **E-prescription management** with pharmacy network integration
- **Clinical workflow optimization** for healthcare providers
- **Patient portal** for appointment management and health records access
- **EHR integration** supporting HL7 FHIR standards

This separation ensures the LIDR SDLC Methodology remains a portable, scalable framework while providing deep healthcare industry customization for Docline's telemedicine platform development needs.
