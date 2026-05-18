# LIDR Init — Client Setup Script

Interactive CLI for initializing the LIDR SDLC Methodology for a new client project.

## What It Does

1. **Collects client configuration** via interactive prompts (name, industry, project code, products).
2. **Generates `src/data/client.ts`** with centralized client data, domain terms, and regulations based on the selected industry pack.
3. **Scans `.claude/` files** for `{{VARIABLE}}` template placeholders and reports how many would be resolved by the new configuration.
4. **Optionally applies replacements** across `.claude/skills/`, `.claude/commands/`, and `.claude/rules/` directories.
5. **Prints a summary report** with next steps.

## Usage

```bash
# Scan only (generates client.ts, reports placeholders, changes nothing else)
npx tsx scripts/lidr-init.ts

# Preview what would change without writing files (except client.ts)
npx tsx scripts/lidr-init.ts --dry-run

# Apply all resolvable placeholder replacements
npx tsx scripts/lidr-init.ts --apply
```

## Industry Packs

The script includes five built-in industry packs, each providing domain terminology, regulations, and default template variable values:

| Key                  | Label                           | Regulations                                                     |
| -------------------- | ------------------------------- | --------------------------------------------------------------- |
| `biometric-identity` | Biometric Identity Verification | GDPR Art. 9, eIDAS, PSD2, ISO 27001, ISO 30107, NIST SP 800-63B |
| `healthcare`         | Healthcare & Life Sciences      | HIPAA, HITECH, FDA 21 CFR Part 11, GDPR, ISO 13485, IEC 62304   |
| `fintech`            | Fintech & Financial Services    | PSD2, PCI DSS, SOX, GDPR, AML/KYC Directives, MiFID II          |
| `government`         | Government & Public Sector      | FedRAMP, FISMA, NIST SP 800-53, WCAG 2.1 AA, Section 508, GDPR  |
| `ecommerce`          | E-commerce & Retail             | PCI DSS, GDPR, CCPA, Consumer Rights Directive, ePrivacy, DSA   |

## Resolvable Variables

The script resolves a small set of **global** variables that apply project-wide:

- `{{CLIENT_NAME}}` -- Short client name
- `{{CLIENT_FULL_NAME}}` -- Full client name
- `{{CLIENT_CODE}}` / `{{PROJECT_CODE}}` -- Project identifier
- `{{PROJECT_NAME}}` -- Project display name
- `{{PRODUCT_NAME}}` -- Primary product name
- `{{DOMAIN}}` -- Industry domain label
- `{{APP_NAME}}` -- Application name
- `{{CLIENT_REGULATIONS}}` -- Key regulations (from industry pack)
- `{{STAKEHOLDER_TYPES}}` -- Typical stakeholder types
- `{{DOMAIN_SYSTEMS}}` -- Domain system description
- `{{SENSITIVE_DATA_TYPE}}` -- Primary sensitive data category
- `{{COMPLIANCE_FRAMEWORK}}` -- Compliance framework label

The remaining variables (1200+) are **skill-level template placeholders** filled at runtime when each skill generates a document. They do not need global replacement.

## Output

The generated `src/data/client.ts` exports a `clientConfig` object consumed by UI components and other scripts. It follows the same structure as the existing file but with the new client's data.

## After Running

1. Review `src/data/client.ts` and adjust team sizes, colors, or subdomain as needed.
2. Update `.claude/rules/project.md` with project-specific architecture and ADRs.
3. Update `.claude/rules/org.md` with organization-specific standards.
4. Run `npm run validate:coherence` to confirm ecosystem consistency.
