#!/usr/bin/env tsx
/// <reference types="node" />
/**
 * LIDR SDLC Methodology — Client Initialization Script
 *
 * Interactive CLI that configures the LIDR ecosystem for a new client.
 * Generates src/data/client.ts, scans for template placeholders, and
 * optionally applies variable substitution across .claude/ files.
 *
 * Usage:
 *   npx tsx scripts/lidr-init.ts            # Interactive mode (scan only)
 *   npx tsx scripts/lidr-init.ts --apply    # Interactive mode + apply replacements
 *   npx tsx scripts/lidr-init.ts --dry-run  # Show what would change, change nothing
 */

import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// ANSI color helpers
// ---------------------------------------------------------------------------
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  underline: '\x1b[4m',
  // Foreground
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  // Background
  bgGreen: '\x1b[42m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
} as const;

function banner(text: string): string {
  return `${c.bold}${c.cyan}${text}${c.reset}`;
}
function success(text: string): string {
  return `${c.green}${text}${c.reset}`;
}
function warn(text: string): string {
  return `${c.yellow}${text}${c.reset}`;
}
function error(text: string): string {
  return `${c.red}${text}${c.reset}`;
}
function info(text: string): string {
  return `${c.blue}${text}${c.reset}`;
}
function dim(text: string): string {
  return `${c.dim}${text}${c.reset}`;
}
function heading(text: string): string {
  return `\n${c.bold}${c.magenta}--- ${text} ---${c.reset}\n`;
}

// ---------------------------------------------------------------------------
// Industry packs — domain terms, regulations, and template variable defaults
// ---------------------------------------------------------------------------
interface IndustryPack {
  readonly label: string;
  readonly domain: string;
  readonly segment: string;
  readonly regulations: readonly string[];
  readonly domainTerms: Record<string, string>;
  readonly templateVarDefaults: Record<string, string>;
}

const INDUSTRY_PACKS: Record<string, IndustryPack> = {
  'biometric-identity': {
    label: 'Biometric Identity Verification',
    domain: 'Biometrics & Digital Identity',
    segment: 'Fintech / Digital Identity',
    regulations: ['GDPR Art. 9', 'eIDAS', 'PSD2', 'ISO 27001', 'ISO 30107', 'NIST SP 800-63B'],
    domainTerms: {
      template: 'biometric template',
      liveness: 'liveness detection',
      verification: '1:1 verification',
      identification: '1:N identification',
      onboarding: 'digital onboarding',
      ocr: 'document OCR',
      nfc: 'NFC chip reading',
      far: 'FAR (False Accept Rate)',
      frr: 'FRR (False Reject Rate)',
      eer: 'EER (Equal Error Rate)',
      dpia: 'DPIA (Data Protection Impact Assessment)',
      kyc: 'KYC (Know Your Customer)',
      aml: 'AML (Anti-Money Laundering)',
    },
    templateVarDefaults: {
      CLIENT_REGULATIONS: 'GDPR Art. 9, PSD2, AML',
      STAKEHOLDER_TYPES: 'banks, end-users, regulators',
      DOMAIN_SYSTEMS: 'identity verification systems',
      SENSITIVE_DATA_TYPE: 'biometric data',
      COMPLIANCE_FRAMEWORK: 'data protection (GDPR Art. 9)',
    },
  },
  healthcare: {
    label: 'Healthcare & Life Sciences',
    domain: 'Healthcare & MedTech',
    segment: 'Healthcare / Life Sciences',
    regulations: ['HIPAA', 'HITECH', 'FDA 21 CFR Part 11', 'GDPR', 'ISO 13485', 'IEC 62304'],
    domainTerms: {
      ehr: 'Electronic Health Record (EHR)',
      phi: 'Protected Health Information (PHI)',
      emr: 'Electronic Medical Record (EMR)',
      hl7: 'HL7 FHIR',
      dicom: 'DICOM imaging',
      cds: 'Clinical Decision Support',
      interop: 'health data interoperability',
      consent: 'patient consent management',
      audit: 'access audit trail',
      deidentify: 'de-identification',
      baa: 'Business Associate Agreement (BAA)',
    },
    templateVarDefaults: {
      CLIENT_REGULATIONS: 'HIPAA, HITECH, GDPR',
      STAKEHOLDER_TYPES: 'clinicians, patients, hospital admins, payers',
      DOMAIN_SYSTEMS: 'electronic health record systems',
      SENSITIVE_DATA_TYPE: 'protected health information (PHI)',
      COMPLIANCE_FRAMEWORK: 'HIPAA Privacy & Security Rules',
    },
  },
  fintech: {
    label: 'Fintech & Financial Services',
    domain: 'Financial Technology',
    segment: 'Fintech / Banking',
    regulations: ['PSD2', 'PCI DSS', 'SOX', 'GDPR', 'AML/KYC Directives', 'MiFID II'],
    domainTerms: {
      kyc: 'KYC (Know Your Customer)',
      aml: 'AML (Anti-Money Laundering)',
      pci: 'PCI DSS compliance',
      sca: 'Strong Customer Authentication (SCA)',
      openBanking: 'Open Banking API',
      ledger: 'general ledger',
      reconciliation: 'transaction reconciliation',
      settlement: 'payment settlement',
      fraud: 'fraud detection engine',
      riskScoring: 'risk scoring model',
    },
    templateVarDefaults: {
      CLIENT_REGULATIONS: 'PSD2, PCI DSS, AML/KYC',
      STAKEHOLDER_TYPES: 'account holders, merchants, compliance officers, regulators',
      DOMAIN_SYSTEMS: 'payment processing and banking systems',
      SENSITIVE_DATA_TYPE: 'financial and payment card data',
      COMPLIANCE_FRAMEWORK: 'PCI DSS and PSD2 SCA',
    },
  },
  government: {
    label: 'Government & Public Sector',
    domain: 'GovTech & Public Services',
    segment: 'Government / Public Sector',
    regulations: ['FedRAMP', 'FISMA', 'NIST SP 800-53', 'WCAG 2.1 AA', 'Section 508', 'GDPR'],
    domainTerms: {
      ato: 'Authority to Operate (ATO)',
      fips: 'FIPS 140-2 validated',
      pii: 'Personally Identifiable Information (PII)',
      cve: 'CVE vulnerability tracking',
      conops: 'Concept of Operations (ConOps)',
      iam: 'Identity & Access Management',
      piv: 'PIV credential',
      tlp: 'Traffic Light Protocol (TLP)',
      poam: 'Plan of Actions & Milestones (POA&M)',
    },
    templateVarDefaults: {
      CLIENT_REGULATIONS: 'FedRAMP, FISMA, NIST 800-53',
      STAKEHOLDER_TYPES: 'agency staff, citizens, oversight bodies',
      DOMAIN_SYSTEMS: 'government information systems',
      SENSITIVE_DATA_TYPE: 'personally identifiable information (PII)',
      COMPLIANCE_FRAMEWORK: 'NIST RMF (Risk Management Framework)',
    },
  },
  ecommerce: {
    label: 'E-commerce & Retail',
    domain: 'E-commerce & Digital Retail',
    segment: 'Retail / E-commerce',
    regulations: ['PCI DSS', 'GDPR', 'CCPA', 'Consumer Rights Directive', 'ePrivacy', 'DSA'],
    domainTerms: {
      sku: 'SKU (Stock Keeping Unit)',
      pdp: 'Product Detail Page (PDP)',
      cart: 'shopping cart',
      checkout: 'checkout flow',
      fulfillment: 'order fulfillment',
      catalog: 'product catalog',
      search: 'product search & ranking',
      recommendation: 'recommendation engine',
      inventory: 'inventory management',
      returns: 'returns & refunds',
    },
    templateVarDefaults: {
      CLIENT_REGULATIONS: 'PCI DSS, GDPR, CCPA',
      STAKEHOLDER_TYPES: 'shoppers, merchants, warehouse ops, customer support',
      DOMAIN_SYSTEMS: 'e-commerce platform and order management',
      SENSITIVE_DATA_TYPE: 'payment card and personal data',
      COMPLIANCE_FRAMEWORK: 'PCI DSS and GDPR/CCPA privacy',
    },
  },
} as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ClientInput {
  name: string;
  fullName: string;
  industry: string;
  projectCode: string;
  projectName: string;
  mainProducts: string[];
}

interface ScanResult {
  filePath: string;
  variables: string[];
  count: number;
}

interface ScanSummary {
  totalFiles: number;
  totalOccurrences: number;
  uniqueVariables: string[];
  resolved: string[];
  unresolved: string[];
  fileResults: ScanResult[];
}

interface ApplyResult {
  filePath: string;
  replacements: number;
  variablesReplaced: string[];
}

// ---------------------------------------------------------------------------
// Readline helper — promise-based prompt
// ---------------------------------------------------------------------------
function createPrompter(): {
  ask: (question: string) => Promise<string>;
  close: () => void;
} {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return {
    ask(question: string): Promise<string> {
      return new Promise((resolve) => {
        rl.question(question, (answer) => {
          resolve(answer.trim());
        });
      });
    },
    close() {
      rl.close();
    },
  };
}

// ---------------------------------------------------------------------------
// File system helpers
// ---------------------------------------------------------------------------
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function walkDir(dir: string, ext: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) {
    return results;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip hidden dirs, node_modules, .git
      if (entry.name.startsWith('.') && entry.name !== '.claude') {
        continue;
      }
      if (entry.name === 'node_modules') {
        continue;
      }
      results.push(...walkDir(fullPath, ext));
    } else if (entry.name.endsWith(ext)) {
      results.push(fullPath);
    }
  }
  return results;
}

function relativePath(absPath: string): string {
  return path.relative(ROOT, absPath);
}

// ---------------------------------------------------------------------------
// Build variable map from client input + industry pack
// ---------------------------------------------------------------------------
function buildVariableMap(input: ClientInput, pack: IndustryPack): Record<string, string> {
  const vars: Record<string, string> = {
    // Core client variables
    CLIENT_NAME: input.name,
    CLIENT_FULL_NAME: input.fullName,
    CLIENT_CODE: input.projectCode,
    PROJECT_CODE: input.projectCode,
    PROJECT_NAME: input.projectName,
    PRODUCT_NAME: input.mainProducts[0] ?? input.name,
    DOMAIN: pack.domain,
    APP_NAME: input.projectName,

    // Industry pack defaults
    ...pack.templateVarDefaults,
  };

  return vars;
}

// ---------------------------------------------------------------------------
// Scan .claude/ for {{VARIABLE}} placeholders
// ---------------------------------------------------------------------------
const PLACEHOLDER_RE = /\{\{([A-Z_]+)\}\}/g;

function scanForPlaceholders(dirs: string[]): ScanResult[] {
  const results: ScanResult[] = [];

  for (const dir of dirs) {
    const files = walkDir(dir, '.md');
    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const matches = [...content.matchAll(PLACEHOLDER_RE)];
      if (matches.length > 0) {
        const vars = [...new Set(matches.map((m) => m[1] as string))];
        results.push({
          filePath,
          variables: vars,
          count: matches.length,
        });
      }
    }
  }

  return results;
}

function summarizeScan(
  fileResults: ScanResult[],
  variableMap: Record<string, string>
): ScanSummary {
  const allVars = new Set<string>();
  let totalOccurrences = 0;

  for (const result of fileResults) {
    totalOccurrences += result.count;
    for (const v of result.variables) {
      allVars.add(v);
    }
  }

  const uniqueVariables = [...allVars].sort();
  const resolved = uniqueVariables.filter((v) => v in variableMap);
  const unresolved = uniqueVariables.filter((v) => !(v in variableMap));

  return {
    totalFiles: fileResults.length,
    totalOccurrences,
    uniqueVariables,
    resolved,
    unresolved,
    fileResults,
  };
}

// ---------------------------------------------------------------------------
// Apply variable replacement
// ---------------------------------------------------------------------------
function applyReplacements(
  dirs: string[],
  variableMap: Record<string, string>,
  dryRun: boolean
): ApplyResult[] {
  const results: ApplyResult[] = [];

  for (const dir of dirs) {
    const files = walkDir(dir, '.md');
    for (const filePath of files) {
      const original = fs.readFileSync(filePath, 'utf-8');
      let modified = original;
      const replacedVars: string[] = [];
      let replacements = 0;

      for (const [varName, value] of Object.entries(variableMap)) {
        const pattern = new RegExp(`\\{\\{${varName}\\}\\}`, 'g');
        const matches = modified.match(pattern);
        if (matches && matches.length > 0) {
          modified = modified.replace(pattern, value);
          replacements += matches.length;
          replacedVars.push(varName);
        }
      }

      if (replacements > 0) {
        if (!dryRun) {
          fs.writeFileSync(filePath, modified, 'utf-8');
        }
        results.push({
          filePath,
          replacements,
          variablesReplaced: replacedVars,
        });
      }
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Generate src/data/client.ts
// ---------------------------------------------------------------------------
function generateClientTs(input: ClientInput, pack: IndustryPack): string {
  const productsArray = input.mainProducts
    .map((p) => `    '${p.replace(/'/g, "\\'")}'`)
    .join(',\n');

  const regulationsArray = pack.regulations.map((r) => `    '${r}'`).join(',\n');

  const domainTermsEntries = Object.entries(pack.domainTerms)
    .map(([key, val]) => `    ${key}: '${val.replace(/'/g, "\\'")}'`)
    .join(',\n');

  const templateVarsEntries = Object.entries(pack.templateVarDefaults)
    .map(([key, val]) => `    ${key}: '${val.replace(/'/g, "\\'")}'`)
    .join(',\n');

  return `/**
 * Client Configuration - Centralized client-specific data
 *
 * Generated by: npx tsx scripts/lidr-init.ts
 * Generated at: ${new Date().toISOString()}
 *
 * This replaces hardcoded client references throughout the ecosystem
 * making the LIDR SDLC Methodology portable across clients.
 */

export const clientConfig = {
  // Client Identity
  name: '${input.name.replace(/'/g, "\\'")}',
  fullName: '${input.fullName.replace(/'/g, "\\'")}',
  industry: '${pack.label}',
  segment: '${pack.segment}',

  // Project Context
  projectCode: '${input.projectCode.replace(/'/g, "\\'")}',
  projectName: '${input.projectName.replace(/'/g, "\\'")}',
  domain: '${pack.domain}',

  // Technical Context
  mainProducts: [
${productsArray},
  ],

  // Regulatory Context
  regulations: [
${regulationsArray},
  ],

  // Template Variables (for skills migration)
  templateVars: {
${templateVarsEntries},
  },

  // Domain-Specific Terminology (${pack.label})
  domainTerms: {
${domainTermsEntries},
  },

  // Team Configuration
  team: {
    pme: 1,
    productOwner: 1,
    techLead: 1,
    developers: 4,
    qaLead: 1,
    qaEngineers: 2,
    security: 1,
    devOps: 1,
    scrumMaster: 1,
  },

  // Branding
  colors: {
    primary: '#1E40AF',
    secondary: '#7C3AED',
    accent: '#059669',
  },

  // Subdomain (proposed)
  subdomain: 'sdlc.${input.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com',
} as const;

export type ClientConfig = typeof clientConfig;
`;
}

// ---------------------------------------------------------------------------
// Printing helpers
// ---------------------------------------------------------------------------
function printLogo(): void {
  console.log('');
  console.log(
    `${c.bold}${c.cyan}  _     ___ ____  ____    ${c.magenta} ____  ____  _     ____${c.reset}`
  );
  console.log(
    `${c.bold}${c.cyan} | |   |_ _|  _ \\|  _ \\   ${c.magenta}/ ___||  _ \\| |   / ___|${c.reset}`
  );
  console.log(
    `${c.bold}${c.cyan} | |    | || | | | |_) |  ${c.magenta}\\___ \\| | | | |  | |    ${c.reset}`
  );
  console.log(
    `${c.bold}${c.cyan} | |___ | || |_| |  _ <    ${c.magenta}___) | |_| | |__| |___ ${c.reset}`
  );
  console.log(
    `${c.bold}${c.cyan} |_____|___|____/|_| \\_\\  ${c.magenta}|____/|____/|_____\\____|${c.reset}`
  );
  console.log('');
  console.log(`  ${c.bold}${c.white}LIDR SDLC Methodology — Client Initialization${c.reset}`);
  console.log(`  ${dim('v1.0.0 — Portable ecosystem setup for new clients')}`);
  console.log('');
}

function printSeparator(): void {
  console.log(dim('─'.repeat(64)));
}

function printKeyValue(key: string, value: string): void {
  console.log(`  ${c.bold}${key}:${c.reset} ${value}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const applyMode = args.includes('--apply');
  const dryRunMode = args.includes('--dry-run');

  printLogo();

  if (applyMode && dryRunMode) {
    console.log(error('  Cannot use --apply and --dry-run together.\n'));
    process.exit(1);
  }

  // ── Step 1: Interactive prompts ──────────────────────────────────────────
  console.log(heading('Step 1/5: Client Configuration'));

  const prompter = createPrompter();

  let clientName: string;
  try {
    clientName = await prompter.ask(
      `  ${c.bold}Client name${c.reset} ${dim('(e.g., TechCorp)')}: `
    );
    if (!clientName) {
      console.log(error('\n  Client name is required. Aborting.\n'));
      prompter.close();
      process.exit(1);
    }

    const defaultFullName = `${clientName} Solutions`;
    const fullNameInput = await prompter.ask(
      `  ${c.bold}Client full name${c.reset} ${dim(`[${defaultFullName}]`)}: `
    );
    const clientFullName = fullNameInput || defaultFullName;

    // Industry selection
    const industryKeys = Object.keys(INDUSTRY_PACKS);
    console.log(`\n  ${c.bold}Available industries:${c.reset}`);
    industryKeys.forEach((key, i) => {
      const pack = INDUSTRY_PACKS[key];
      if (pack) {
        console.log(`    ${c.cyan}${i + 1}${c.reset}) ${pack.label} ${dim(`[${key}]`)}`);
      }
    });
    console.log('');

    const industryChoice = await prompter.ask(
      `  ${c.bold}Industry${c.reset} ${dim('(number or key)')}: `
    );

    let selectedIndustry: string;
    const choiceNum = parseInt(industryChoice, 10);
    if (!isNaN(choiceNum) && choiceNum >= 1 && choiceNum <= industryKeys.length) {
      selectedIndustry = industryKeys[choiceNum - 1] ?? '';
    } else if (industryKeys.includes(industryChoice)) {
      selectedIndustry = industryChoice;
    } else {
      console.log(error(`\n  Invalid industry selection: "${industryChoice}". Aborting.\n`));
      prompter.close();
      process.exit(1);
    }

    const pack = INDUSTRY_PACKS[selectedIndustry];
    if (!pack) {
      console.log(error('\n  Industry pack not found. Aborting.\n'));
      prompter.close();
      process.exit(1);
    }

    const projectCode = await prompter.ask(
      `  ${c.bold}Project code${c.reset} ${dim('(e.g., EHR-MOD)')}: `
    );
    if (!projectCode) {
      console.log(error('\n  Project code is required. Aborting.\n'));
      prompter.close();
      process.exit(1);
    }

    const projectName = await prompter.ask(
      `  ${c.bold}Project name${c.reset} ${dim('(e.g., EHR Modernization)')}: `
    );
    if (!projectName) {
      console.log(error('\n  Project name is required. Aborting.\n'));
      prompter.close();
      process.exit(1);
    }

    const productsInput = await prompter.ask(
      `  ${c.bold}Main products${c.reset} ${dim('(comma-separated)')}: `
    );
    const mainProducts = productsInput
      ? productsInput
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean)
      : [clientName];

    prompter.close();

    const input: ClientInput = {
      name: clientName,
      fullName: clientFullName,
      industry: selectedIndustry,
      projectCode,
      projectName,
      mainProducts,
    };

    // ── Step 2: Generate src/data/client.ts ─────────────────────────────────
    console.log(heading('Step 2/5: Generating src/data/client.ts'));

    const clientTsContent = generateClientTs(input, pack);
    const clientTsPath = path.join(ROOT, 'src', 'data', 'client.ts');

    if (dryRunMode) {
      console.log(warn('  [DRY RUN] Would write to:'));
      console.log(`  ${info(relativePath(clientTsPath))}\n`);
      console.log(dim('  Preview (first 20 lines):'));
      const previewLines = clientTsContent.split('\n').slice(0, 20);
      for (const line of previewLines) {
        console.log(`  ${dim('|')} ${line}`);
      }
      console.log(dim('  | ...'));
    } else {
      // Ensure directory exists
      const dir = path.dirname(clientTsPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(clientTsPath, clientTsContent, 'utf-8');
      console.log(success(`  Generated: ${relativePath(clientTsPath)}`));
    }

    // ── Step 3: Scan for placeholders ───────────────────────────────────────
    console.log(heading('Step 3/5: Scanning for Template Placeholders'));

    const scanDirs = [
      path.join(ROOT, '.claude', 'skills'),
      path.join(ROOT, '.claude', 'commands'),
      path.join(ROOT, '.claude', 'rules'),
    ];

    const variableMap = buildVariableMap(input, pack);
    const fileResults = scanForPlaceholders(scanDirs);
    const summary = summarizeScan(fileResults, variableMap);

    printKeyValue('Files with placeholders', `${summary.totalFiles}`);
    printKeyValue('Total placeholder occurrences', `${summary.totalOccurrences}`);
    printKeyValue('Unique variables found', `${summary.uniqueVariables.length}`);
    console.log('');
    printKeyValue('Resolvable by this config', success(`${summary.resolved.length} variables`));
    if (summary.resolved.length > 0) {
      for (const v of summary.resolved) {
        console.log(`    ${c.green}+${c.reset} {{${v}}} -> ${dim(variableMap[v] ?? '')}`);
      }
    }
    console.log('');
    printKeyValue(
      'Remaining unresolved',
      summary.unresolved.length > 0
        ? warn(`${summary.unresolved.length} variables`)
        : success('0 (all resolved)')
    );
    if (summary.unresolved.length > 0) {
      // Show first 20 unresolved, then summarize
      const shown = summary.unresolved.slice(0, 20);
      for (const v of shown) {
        console.log(`    ${c.yellow}?${c.reset} {{${v}}}`);
      }
      if (summary.unresolved.length > 20) {
        console.log(dim(`    ... and ${summary.unresolved.length - 20} more`));
      }
    }

    // ── Step 4: Apply replacements (if --apply or --dry-run) ────────────────
    console.log(heading('Step 4/5: Template Processing'));

    if (!applyMode && !dryRunMode) {
      console.log(
        info('  Scan-only mode. Use --apply to replace placeholders or --dry-run to preview.')
      );
      console.log(dim('  Run: npx tsx scripts/lidr-init.ts --apply'));
    } else {
      const applyResults = applyReplacements(scanDirs, variableMap, dryRunMode);

      if (applyResults.length === 0) {
        console.log(info('  No resolvable placeholders found in scanned files.'));
      } else {
        const modeLabel = dryRunMode ? '[DRY RUN] Would modify' : 'Modified';
        console.log(success(`  ${modeLabel} ${applyResults.length} file(s):\n`));

        let totalReplacements = 0;
        for (const result of applyResults) {
          totalReplacements += result.replacements;
          console.log(
            `  ${dryRunMode ? warn('~') : success('+')} ${relativePath(result.filePath)}`
          );
          console.log(
            dim(`    ${result.replacements} replacement(s): ${result.variablesReplaced.join(', ')}`)
          );
        }

        console.log('');
        printKeyValue(
          'Total replacements',
          `${totalReplacements} across ${applyResults.length} files`
        );
      }
    }

    // ── Step 5: Summary report ──────────────────────────────────────────────
    console.log(heading('Step 5/5: Summary Report'));

    printSeparator();
    console.log(`  ${c.bold}${c.bgBlue}${c.white} LIDR INIT COMPLETE ${c.reset}`);
    printSeparator();
    console.log('');
    printKeyValue('Client', `${input.fullName} (${input.name})`);
    printKeyValue('Industry', pack.label);
    printKeyValue('Domain', pack.domain);
    printKeyValue('Project', `${input.projectCode} — ${input.projectName}`);
    printKeyValue('Products', input.mainProducts.join(', '));
    printKeyValue('Regulations', pack.regulations.join(', '));
    console.log('');
    printKeyValue('client.ts', dryRunMode ? warn('DRY RUN (not written)') : success('Generated'));
    printKeyValue('Placeholders scanned', `${summary.totalFiles} files`);
    printKeyValue(
      'Variables resolvable',
      `${summary.resolved.length}/${summary.uniqueVariables.length}`
    );

    if (applyMode && !dryRunMode) {
      printKeyValue('Mode', success('APPLIED'));
    } else if (dryRunMode) {
      printKeyValue('Mode', warn('DRY RUN'));
    } else {
      printKeyValue('Mode', info('SCAN ONLY'));
    }

    console.log('');
    console.log(`  ${c.bold}Next steps:${c.reset}`);
    console.log('');

    if (!applyMode && !dryRunMode) {
      console.log(`  1. Review the generated ${info('src/data/client.ts')}`);
      console.log(
        `  2. Run ${banner('npx tsx scripts/lidr-init.ts --dry-run')} to preview replacements`
      );
      console.log(
        `  3. Run ${banner('npx tsx scripts/lidr-init.ts --apply')} to apply replacements`
      );
    } else {
      console.log(`  1. Review changes with ${banner('git diff')}`);
      console.log(`  2. Update ${info('.claude/rules/project.md')} with project-specific context`);
      console.log(`  3. Update ${info('.claude/rules/org.md')} with organization standards`);
      console.log(
        `  4. Run ${banner('npm run validate:coherence')} to verify ecosystem consistency`
      );
    }

    console.log(
      `\n  5. Remaining ${warn(`${summary.unresolved.length}`)} unresolved variables are`
    );
    console.log(`     template placeholders filled at runtime by individual skills.`);
    console.log(`     They do ${c.bold}not${c.reset} need to be replaced globally.`);
    console.log('');
    printSeparator();
    console.log('');
  } catch (err) {
    prompter.close();
    if (err instanceof Error && err.message.includes('readline was closed')) {
      console.log(error('\n  Input cancelled. Aborting.\n'));
      process.exit(1);
    }
    throw err;
  }
}

main().catch((err: unknown) => {
  console.error(error('\n  Fatal error:'));
  console.error(err);
  process.exit(1);
});
