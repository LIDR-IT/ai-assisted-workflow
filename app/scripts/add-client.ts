#!/usr/bin/env tsx
/**
 * CLI Tool for Adding New Clients to LIDR SDLC Methodology
 *
 * This script helps create new client configurations with industry-specific
 * templates and validation.
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import * as readline from 'readline';

// Available industry templates
const INDUSTRY_TEMPLATES = {
  'biometric-identity': {
    name: 'Biometric Identity Verification',
    regulations: ['GDPR', 'CCPA', 'ISO 30107', 'NIST SP 800-63B'],
    defaultTerms: {
      CLIENT_REGULATIONS: 'GDPR, biometric data protection',
      STAKEHOLDER_TYPES: 'usuarios finales, oficiales de cumplimiento',
      DOMAIN_SYSTEMS: 'sistemas de verificación de identidad',
      SENSITIVE_DATA_TYPE: 'datos biométricos',
      COMPLIANCE_FRAMEWORK: 'protección de datos biométricos',
    },
  },
  healthcare: {
    name: 'Healthcare Technology',
    regulations: ['HIPAA', 'GDPR', 'FDA 21 CFR Part 820', 'ISO 27799', 'HL7 FHIR'],
    defaultTerms: {
      CLIENT_REGULATIONS: 'HIPAA, GDPR, FDA regulations',
      STAKEHOLDER_TYPES: 'médicos, pacientes, administradores hospitalarios',
      DOMAIN_SYSTEMS: 'sistemas de gestión sanitaria',
      SENSITIVE_DATA_TYPE: 'datos de salud protegidos (PHI)',
      COMPLIANCE_FRAMEWORK: 'protección de datos de salud (HIPAA)',
    },
  },
  fintech: {
    name: 'Financial Technology',
    regulations: ['PSD2', 'GDPR', 'SOX', 'PCI DSS', 'AML/KYC'],
    defaultTerms: {
      CLIENT_REGULATIONS: 'PSD2, regulación bancaria, AML/KYC',
      STAKEHOLDER_TYPES: 'usuarios bancarios, oficiales de riesgo, auditores',
      DOMAIN_SYSTEMS: 'sistemas de pagos y servicios financieros',
      SENSITIVE_DATA_TYPE: 'datos financieros y de pago',
      COMPLIANCE_FRAMEWORK: 'cumplimiento bancario y financiero',
    },
  },
  government: {
    name: 'Government & Public Sector',
    regulations: ['eIDAS', 'GDPR', 'accessibility standards', 'data sovereignty'],
    defaultTerms: {
      CLIENT_REGULATIONS: 'eIDAS, regulación nacional de identidad',
      STAKEHOLDER_TYPES: 'ciudadanos, funcionarios públicos, auditores',
      DOMAIN_SYSTEMS: 'sistemas de identidad electrónica',
      SENSITIVE_DATA_TYPE: 'datos de identidad ciudadana',
      COMPLIANCE_FRAMEWORK: 'cumplimiento gubernamental y soberanía de datos',
    },
  },
  ecommerce: {
    name: 'E-commerce & Retail',
    regulations: ['GDPR', 'CCPA', 'PCI DSS', 'consumer protection'],
    defaultTerms: {
      CLIENT_REGULATIONS: 'GDPR, CCPA, protección del consumidor',
      STAKEHOLDER_TYPES: 'compradores, comerciantes, equipos de fraude',
      DOMAIN_SYSTEMS: 'plataformas de comercio electrónico',
      SENSITIVE_DATA_TYPE: 'datos de compra y preferencias',
      COMPLIANCE_FRAMEWORK: 'protección del consumidor y comercio electrónico',
    },
  },
};

interface ClientConfig {
  name: string;
  fullName: string;
  industry: string;
  segment: string;
  projectCode: string;
  projectName: string;
  domain: string;
  mainProducts: string[];
  regulations: string[];
  templateVars: Record<string, string>;
  domainTerms: Record<string, string>;
  team: Record<string, number>;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  subdomain: string;
}

class ClientCreator {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  private async prompt(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }

  private async selectIndustry(): Promise<keyof typeof INDUSTRY_TEMPLATES> {
    console.log('\n🏢 Available Industry Templates:');
    const industries = Object.keys(INDUSTRY_TEMPLATES) as Array<keyof typeof INDUSTRY_TEMPLATES>;

    industries.forEach((key, index) => {
      const template = INDUSTRY_TEMPLATES[key];
      console.log(`${index + 1}. ${key} - ${template.name}`);
    });

    while (true) {
      const choice = await this.prompt('\nSelect industry (1-5): ');
      const index = parseInt(choice) - 1;

      if (index >= 0 && index < industries.length) {
        return industries[index];
      }
      console.log('❌ Invalid choice. Please select 1-5.');
    }
  }

  private generateClientId(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private generateColors(industry: keyof typeof INDUSTRY_TEMPLATES): ClientConfig['colors'] {
    const colorSchemes = {
      'biometric-identity': { primary: '#4F46E5', secondary: '#DC2626', accent: '#059669' }, // Indigo/Red/Green
      healthcare: { primary: '#0D9488', secondary: '#DC2626', accent: '#16A34A' }, // Teal/Red/Green
      fintech: { primary: '#1D4ED8', secondary: '#F59E0B', accent: '#10B981' }, // Blue/Amber/Emerald
      government: { primary: '#1E40AF', secondary: '#6B7280', accent: '#059669' }, // Blue/Gray/Green
      ecommerce: { primary: '#EC4899', secondary: '#F97316', accent: '#8B5CF6' }, // Pink/Orange/Purple
    };

    return colorSchemes[industry];
  }

  private async createClientConfig(
    clientId: string,
    industryKey: keyof typeof INDUSTRY_TEMPLATES
  ): Promise<ClientConfig> {
    const industry = INDUSTRY_TEMPLATES[industryKey];

    console.log('\n📋 Client Information:');
    const name = await this.prompt('Client name (e.g., "MediCorp"): ');
    const fullName = await this.prompt(
      'Full company name (e.g., "MediCorp Healthcare Solutions"): '
    );
    const segment =
      (await this.prompt(`Industry segment (default: "${industry.name}"): `)) || industry.name;

    console.log('\n📊 Project Information:');
    const projectCode = await this.prompt('Project code (e.g., "HEALTH-001"): ');
    const projectName = await this.prompt('Project name: ');
    const domain = await this.prompt('Domain/focus area: ');

    console.log('\n🛍️ Main Products (comma-separated):');
    const mainProductsInput = await this.prompt('Main products: ');
    const mainProducts = mainProductsInput.split(',').map((p) => p.trim());

    console.log('\n👥 Team Configuration:');
    const pme = parseInt((await this.prompt('PME (default: 1): ')) || '1');
    const productOwner = parseInt((await this.prompt('Product Owners (default: 1): ')) || '1');
    const techLead = parseInt((await this.prompt('Tech Leads (default: 1): ')) || '1');
    const developers = parseInt((await this.prompt('Developers (default: 4): ')) || '4');
    const qaLead = parseInt((await this.prompt('QA Lead (default: 1): ')) || '1');
    const qaEngineers = parseInt((await this.prompt('QA Engineers (default: 2): ')) || '2');
    const security = parseInt((await this.prompt('Security specialists (default: 1): ')) || '1');
    const devOps = parseInt((await this.prompt('DevOps engineers (default: 1): ')) || '1');
    const scrumMaster = parseInt((await this.prompt('Scrum Masters (default: 1): ')) || '1');

    console.log('\n🌐 Optional Configuration:');
    const subdomain =
      (await this.prompt('Subdomain (e.g., "sdlc.client.com"): ')) || `sdlc.${clientId}.com`;

    return {
      name,
      fullName,
      industry: industry.name,
      segment,
      projectCode,
      projectName,
      domain,
      mainProducts,
      regulations: industry.regulations,
      templateVars: industry.defaultTerms,
      domainTerms: {}, // User can customize later
      team: {
        pme,
        productOwner,
        techLead,
        developers,
        qaLead,
        qaEngineers,
        security,
        devOps,
        scrumMaster,
      },
      colors: this.generateColors(industryKey),
      subdomain,
    };
  }

  private generateConfigFile(clientId: string, config: ClientConfig): string {
    return `/**
 * ${config.fullName} Client Configuration
 *
 * Client configuration for ${config.industry} industry to support
 * the LIDR SDLC Methodology.
 */

import type { ClientConfig } from '../../client-registry';

export const ${clientId}ClientConfig: ClientConfig = {
  // Client Identity
  name: '${config.name}',
  fullName: '${config.fullName}',
  industry: '${config.industry}',
  segment: '${config.segment}',

  // Project Context
  projectCode: '${config.projectCode}',
  projectName: '${config.projectName}',
  domain: '${config.domain}',

  // Technical Context
  mainProducts: ${JSON.stringify(config.mainProducts, null, 4).replace(/\n/g, '\n  ')},

  // Regulatory Context
  regulations: ${JSON.stringify(config.regulations, null, 4).replace(/\n/g, '\n  ')},

  // Template Variables
  templateVars: ${JSON.stringify(config.templateVars, null, 4).replace(/\n/g, '\n  ')},

  // Domain-Specific Terminology (customize as needed)
  domainTerms: ${JSON.stringify(config.domainTerms, null, 4).replace(/\n/g, '\n  ')},

  // Team Configuration
  team: ${JSON.stringify(config.team, null, 4).replace(/\n/g, '\n  ')},

  // Branding
  colors: ${JSON.stringify(config.colors, null, 4).replace(/\n/g, '\n  ')},

  // Subdomain (proposed)
  subdomain: '${config.subdomain}',
} as const;
`;
  }

  private updateClientRegistry(clientId: string): void {
    const registryPath = join(process.cwd(), 'src/data/client-registry.ts');

    if (!existsSync(registryPath)) {
      console.error('❌ Client registry not found:', registryPath);
      return;
    }

    let content = readFileSync(registryPath, 'utf8');

    // Add import
    const importLine = `import { ${clientId}ClientConfig } from './clients/${clientId}/config';`;
    const importRegex =
      /import { healthcareDemoConfig } from '\.\/clients\/healthcare-demo\/config';/;

    if (content.includes(importLine)) {
      console.log('✅ Import already exists in client registry');
    } else {
      content = content.replace(importRegex, `$&\n${importLine}`);
      console.log('✅ Added import to client registry');
    }

    // Add client registration
    const registrationLine = `    this._clients.set('${clientId}', ${clientId}ClientConfig);`;
    const registrationRegex = /this\._clients\.set\('healthcare-demo', healthcareDemoConfig\);/;

    if (content.includes(registrationLine)) {
      console.log('✅ Client registration already exists');
    } else {
      content = content.replace(registrationRegex, `$&\n${registrationLine}`);
      console.log('✅ Added client registration');
    }

    writeFileSync(registryPath, content, 'utf8');
    console.log('✅ Updated client registry');
  }

  private createDirectoryStructure(clientId: string): void {
    const clientDir = join(process.cwd(), 'src/data/clients', clientId);
    const diagramsDir = join(clientDir, 'diagrams');
    const brandingDir = join(clientDir, 'branding');

    mkdirSync(clientDir, { recursive: true });
    mkdirSync(diagramsDir, { recursive: true });
    mkdirSync(brandingDir, { recursive: true });

    console.log('✅ Created client directory structure');
  }

  private createPlaceholderFiles(clientId: string): void {
    const clientDir = join(process.cwd(), 'src/data/clients', clientId);

    // Create basic diagram placeholder
    const sampleDiagram = {
      metadata: {
        id: 'sample-diagram',
        title: 'Sample Workflow',
        description: 'Sample diagram for new client',
        version: '1.0.0',
        client: '{{CLIENT_NAME}}',
        industry: '{{INDUSTRY}}',
      },
      configuration: {
        height: 600,
        exportName: 'Sample Workflow',
      },
      nodes: [
        {
          id: 'start',
          x: 100,
          y: 100,
          label: 'Start Process',
          variant: 'blue',
          subtitle: 'Initial step',
        },
        {
          id: 'end',
          x: 300,
          y: 100,
          label: 'Complete Process',
          variant: 'green',
          subtitle: 'Final step',
        },
      ],
      edges: [
        {
          id: 'e1',
          source: 'start',
          target: 'end',
          label: 'Process',
        },
      ],
      legend: [
        { color: 'bg-blue-200', label: 'Process Steps' },
        { color: 'bg-green-200', label: 'Completion' },
      ],
    };

    writeFileSync(
      join(clientDir, 'diagrams', 'sample.json'),
      JSON.stringify(sampleDiagram, null, 2),
      'utf8'
    );

    // Create branding placeholders
    writeFileSync(
      join(clientDir, 'branding', 'README.md'),
      `# ${clientId} Branding\n\nCustom branding assets and terminology for this client.\n\n## Usage\n\n- Add custom domain terminology to config.ts\n- Place custom logos and assets here\n- Define client-specific color schemes\n`,
      'utf8'
    );

    console.log('✅ Created placeholder files');
  }

  async create(): Promise<void> {
    console.log('🚀 LIDR SDLC Methodology - Client Creator\n');

    try {
      // Step 1: Select industry
      const industryKey = await this.selectIndustry();
      console.log(`✅ Selected industry: ${INDUSTRY_TEMPLATES[industryKey].name}`);

      // Step 2: Get client information
      const clientId = this.generateClientId(
        await this.prompt('\nClient identifier (e.g., "medicorp"): ')
      );
      const config = await this.createClientConfig(clientId, industryKey);

      // Step 3: Create directory structure
      console.log('\n📁 Creating client structure...');
      this.createDirectoryStructure(clientId);

      // Step 4: Generate configuration file
      const configContent = this.generateConfigFile(clientId, config);
      const configPath = join(process.cwd(), 'src/data/clients', clientId, 'config.ts');
      writeFileSync(configPath, configContent, 'utf8');
      console.log('✅ Generated client configuration');

      // Step 5: Create placeholder files
      this.createPlaceholderFiles(clientId);

      // Step 6: Update client registry
      console.log('\n🔧 Updating client registry...');
      this.updateClientRegistry(clientId);

      // Step 7: Summary
      console.log(`\n🎉 Client '${clientId}' created successfully!`);
      console.log('\n📋 Summary:');
      console.log(`   Name: ${config.name} (${config.fullName})`);
      console.log(`   Industry: ${config.industry}`);
      console.log(`   Team Size: ${Object.values(config.team).reduce((a, b) => a + b, 0)} members`);
      console.log(`   Configuration: src/data/clients/${clientId}/config.ts`);

      console.log('\n📝 Next Steps:');
      console.log('1. Customize domain terminology in config.ts');
      console.log('2. Create industry-specific diagrams in diagrams/ folder');
      console.log('3. Test client switching in the application');
      console.log('4. Add custom branding assets if needed');

      console.log('\n🔄 To test the new client:');
      console.log(`   npm run dev`);
      console.log(`   → Navigate to client selector`);
      console.log(`   → Select "${config.name}"`);
    } catch (error) {
      console.error('\n❌ Error creating client:', error);
    } finally {
      this.rl.close();
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🚀 LIDR SDLC Methodology - Client Creator

Usage:
  npx tsx scripts/add-client.ts        Create a new client interactively
  npx tsx scripts/add-client.ts -h     Show this help

Features:
  - Interactive client creation wizard
  - Industry-specific templates
  - Automatic client registry updates
  - Directory structure creation
  - Validation and error checking

Supported Industries:
  - Biometric Identity Verification
  - Healthcare Technology
  - Financial Technology (Fintech)
  - Government & Public Sector
  - E-commerce & Retail

The tool will guide you through:
  1. Industry template selection
  2. Client information gathering
  3. Team configuration
  4. Automatic file generation
  5. Registry integration
`);
    return;
  }

  const creator = new ClientCreator();
  await creator.create();
}

// Always run main when this script is executed
main().catch(console.error);

export { ClientCreator };
