#!/usr/bin/env tsx
/**
 * Client Configuration Manager
 *
 * Utility for exporting, importing, and managing client configurations
 * for the LIDR SDLC Methodology multi-client system.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { glob } from 'glob';
import * as readline from 'readline';
import {
  validateClientConfig as _validateClientConfig,
  getConfigQualityReport as _getConfigQualityReport,
} from '../src/data/schemas/client-schema';

interface ExportOptions {
  clientId: string;
  outputPath?: string;
  includeDiagrams?: boolean;
  format?: 'json' | 'zip';
}

interface ImportOptions {
  inputPath: string;
  clientId?: string;
  overwrite?: boolean;
  validate?: boolean;
}

interface ClientBundle {
  metadata: {
    clientId: string;
    exportedAt: string;
    version: string;
    sdlcVersion: string;
  };
  config: any;
  diagrams?: Record<string, any>;
  assets?: Record<string, string>; // Base64 encoded assets
}

class ClientManager {
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

  /**
   * Export a client configuration and all associated files
   */
  async exportClient(options: ExportOptions): Promise<void> {
    console.log(`📦 Exporting client: ${options.clientId}`);

    try {
      // Validate client exists
      const clientDir = join(process.cwd(), 'src/data/clients', options.clientId);
      if (!existsSync(clientDir)) {
        throw new Error(`Client '${options.clientId}' not found`);
      }

      // Load client configuration
      const configPath = join(clientDir, 'config.ts');
      if (!existsSync(configPath)) {
        throw new Error(`Client configuration not found: ${configPath}`);
      }

      // Read config file (simplified - in production would use dynamic import)
      const configContent = readFileSync(configPath, 'utf8');

      // Create export bundle
      const bundle: ClientBundle = {
        metadata: {
          clientId: options.clientId,
          exportedAt: new Date().toISOString(),
          version: '1.0.0',
          sdlcVersion: '2.7.0',
        },
        config: {
          // Note: In production, we'd dynamically import and serialize the config
          rawContent: configContent,
        },
      };

      // Include diagrams if requested
      if (options.includeDiagrams) {
        console.log('📊 Including diagrams...');
        const diagramsDir = join(clientDir, 'diagrams');
        if (existsSync(diagramsDir)) {
          const diagramFiles = await glob('**/*.json', { cwd: diagramsDir });
          bundle.diagrams = {};

          for (const diagramFile of diagramFiles) {
            const diagramPath = join(diagramsDir, diagramFile);
            const diagramContent = JSON.parse(readFileSync(diagramPath, 'utf8'));
            bundle.diagrams[diagramFile] = diagramContent;
          }

          console.log(`✅ Included ${Object.keys(bundle.diagrams).length} diagrams`);
        }
      }

      // Determine output path
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const defaultOutputPath = join(
        process.cwd(),
        'exports',
        `${options.clientId}-${timestamp}.json`
      );
      const outputPath = options.outputPath || defaultOutputPath;

      // Ensure output directory exists
      mkdirSync(dirname(outputPath), { recursive: true });

      // Write export file
      writeFileSync(outputPath, JSON.stringify(bundle, null, 2), 'utf8');

      console.log(`✅ Client exported successfully:`);
      console.log(`   Client: ${options.clientId}`);
      console.log(`   Output: ${outputPath}`);
      console.log(`   Size: ${Math.round(JSON.stringify(bundle).length / 1024)} KB`);

      if (bundle.diagrams) {
        console.log(`   Diagrams: ${Object.keys(bundle.diagrams).length} included`);
      }
    } catch (error) {
      console.error('❌ Export failed:', error);
      throw error;
    }
  }

  /**
   * Import a client configuration from exported bundle
   */
  async importClient(options: ImportOptions): Promise<void> {
    console.log(`📥 Importing client from: ${options.inputPath}`);

    try {
      // Validate input file exists
      if (!existsSync(options.inputPath)) {
        throw new Error(`Import file not found: ${options.inputPath}`);
      }

      // Load bundle
      const bundleContent = readFileSync(options.inputPath, 'utf8');
      const bundle: ClientBundle = JSON.parse(bundleContent);

      console.log(`📋 Import Details:`);
      console.log(`   Client: ${bundle.metadata.clientId}`);
      console.log(`   Exported: ${bundle.metadata.exportedAt}`);
      console.log(`   Version: ${bundle.metadata.version}`);

      // Determine client ID (use from options or bundle metadata)
      const clientId = options.clientId || bundle.metadata.clientId;
      const clientDir = join(process.cwd(), 'src/data/clients', clientId);

      // Check if client already exists
      if (existsSync(clientDir) && !options.overwrite) {
        const overwrite = await this.prompt(
          `Client '${clientId}' already exists. Overwrite? (y/N): `
        );
        if (overwrite.toLowerCase() !== 'y') {
          console.log('❌ Import cancelled');
          return;
        }
      }

      // Create client directory
      mkdirSync(clientDir, { recursive: true });
      mkdirSync(join(clientDir, 'diagrams'), { recursive: true });
      mkdirSync(join(clientDir, 'branding'), { recursive: true });

      // Write configuration
      const configPath = join(clientDir, 'config.ts');
      writeFileSync(configPath, bundle.config.rawContent, 'utf8');
      console.log('✅ Configuration imported');

      // Import diagrams if included
      if (bundle.diagrams) {
        console.log('📊 Importing diagrams...');
        for (const [diagramFile, diagramContent] of Object.entries(bundle.diagrams)) {
          const diagramPath = join(clientDir, 'diagrams', diagramFile);
          mkdirSync(dirname(diagramPath), { recursive: true });
          writeFileSync(diagramPath, JSON.stringify(diagramContent, null, 2), 'utf8');
        }
        console.log(`✅ Imported ${Object.keys(bundle.diagrams).length} diagrams`);
      }

      // Validate imported configuration if requested
      if (options.validate) {
        console.log('🔍 Validating imported configuration...');
        try {
          // Note: In production, we'd dynamically import and validate the config
          console.log('⚠️ Validation requires manual review of imported configuration');
        } catch (validationError) {
          console.warn('⚠️ Validation failed:', validationError);
        }
      }

      console.log(`✅ Client '${clientId}' imported successfully`);
      console.log(`\n📝 Next Steps:`);
      console.log(`1. Review configuration in: ${configPath}`);
      console.log(`2. Update client registry if needed`);
      console.log(`3. Test client switching in application`);
      console.log(`4. Customize diagrams and branding as needed`);
    } catch (error) {
      console.error('❌ Import failed:', error);
      throw error;
    }
  }

  /**
   * List all available clients
   */
  async listClients(): Promise<void> {
    console.log('📋 Available Clients:');

    const clientsDir = join(process.cwd(), 'src/data/clients');
    if (!existsSync(clientsDir)) {
      console.log('❌ No clients directory found');
      return;
    }

    const clientFolders = await glob('*/', { cwd: clientsDir });

    if (clientFolders.length === 0) {
      console.log('   No clients found');
      return;
    }

    for (const clientFolder of clientFolders) {
      const clientId = clientFolder.replace('/', '');
      const configPath = join(clientsDir, clientId, 'config.ts');
      const diagramsDir = join(clientsDir, clientId, 'diagrams');

      let status = '✅';
      let info = '';

      if (!existsSync(configPath)) {
        status = '❌';
        info = 'Missing config.ts';
      } else {
        const diagramFiles = existsSync(diagramsDir)
          ? await glob('**/*.json', { cwd: diagramsDir })
          : [];
        info = `${diagramFiles.length} diagrams`;
      }

      console.log(`   ${status} ${clientId.padEnd(20)} ${info}`);
    }
  }

  /**
   * Validate a client configuration
   */
  async validateClient(clientId: string): Promise<void> {
    console.log(`🔍 Validating client: ${clientId}`);

    try {
      const configPath = join(process.cwd(), 'src/data/clients', clientId, 'config.ts');

      if (!existsSync(configPath)) {
        console.error('❌ Configuration file not found');
        return;
      }

      console.log('⚠️ Configuration validation requires manual review');
      console.log(`📁 Config location: ${configPath}`);

      // Check for required files
      const clientDir = join(process.cwd(), 'src/data/clients', clientId);
      const diagramsDir = join(clientDir, 'diagrams');
      const brandingDir = join(clientDir, 'branding');

      console.log('\n📁 Directory Structure:');
      console.log(`   Config: ${existsSync(configPath) ? '✅' : '❌'}`);
      console.log(`   Diagrams: ${existsSync(diagramsDir) ? '✅' : '❌'}`);
      console.log(`   Branding: ${existsSync(brandingDir) ? '✅' : '❌'}`);

      if (existsSync(diagramsDir)) {
        const diagramFiles = await glob('**/*.json', { cwd: diagramsDir });
        console.log(`   Diagram count: ${diagramFiles.length}`);
      }
    } catch (error) {
      console.error('❌ Validation failed:', error);
    }
  }

  /**
   * Create a backup of all clients
   */
  async backupAll(): Promise<void> {
    console.log('💾 Creating backup of all clients...');

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupDir = join(process.cwd(), 'backups', `clients-${timestamp}`);
      mkdirSync(backupDir, { recursive: true });

      const clientsDir = join(process.cwd(), 'src/data/clients');
      const clientFolders = await glob('*/', { cwd: clientsDir });

      for (const clientFolder of clientFolders) {
        const clientId = clientFolder.replace('/', '');
        console.log(`   Backing up: ${clientId}`);

        await this.exportClient({
          clientId,
          outputPath: join(backupDir, `${clientId}.json`),
          includeDiagrams: true,
        });
      }

      console.log(`✅ Backup completed: ${backupDir}`);
    } catch (error) {
      console.error('❌ Backup failed:', error);
    }
  }

  close(): void {
    this.rl.close();
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    console.log(`
🔧 LIDR SDLC Client Manager

Usage:
  npx tsx scripts/client-manager.ts <command> [options]

Commands:
  export <clientId>              Export client configuration
  import <filePath>              Import client from exported file
  list                          List all available clients
  validate <clientId>           Validate client configuration
  backup                        Backup all clients

Export Options:
  --output <path>               Output file path
  --include-diagrams           Include diagram files
  --format <json|zip>          Export format (json default)

Import Options:
  --client-id <id>             Override client ID from import
  --overwrite                  Overwrite existing client
  --validate                   Validate after import

Examples:
  npx tsx scripts/client-manager.ts list
  npx tsx scripts/client-manager.ts export docline --include-diagrams
  npx tsx scripts/client-manager.ts import ./exports/docline-backup.json
  npx tsx scripts/client-manager.ts validate healthcare-demo
  npx tsx scripts/client-manager.ts backup
`);
    return;
  }

  const manager = new ClientManager();

  try {
    switch (command) {
      case 'export': {
        const clientId = args[1];
        if (!clientId) {
          console.error('❌ Client ID required for export');
          return;
        }

        const options: ExportOptions = {
          clientId,
          includeDiagrams: args.includes('--include-diagrams'),
          outputPath: args.includes('--output') ? args[args.indexOf('--output') + 1] : undefined,
          format: args.includes('--format')
            ? (args[args.indexOf('--format') + 1] as 'json')
            : 'json',
        };

        await manager.exportClient(options);
        break;
      }

      case 'import': {
        const inputPath = args[1];
        if (!inputPath) {
          console.error('❌ Input file path required for import');
          return;
        }

        const options: ImportOptions = {
          inputPath,
          clientId: args.includes('--client-id')
            ? args[args.indexOf('--client-id') + 1]
            : undefined,
          overwrite: args.includes('--overwrite'),
          validate: args.includes('--validate'),
        };

        await manager.importClient(options);
        break;
      }

      case 'list': {
        await manager.listClients();
        break;
      }

      case 'validate': {
        const clientId = args[1];
        if (!clientId) {
          console.error('❌ Client ID required for validation');
          return;
        }

        await manager.validateClient(clientId);
        break;
      }

      case 'backup': {
        await manager.backupAll();
        break;
      }

      default: {
        console.error(`❌ Unknown command: ${command}`);
        console.log('Use --help for usage information');
      }
    }
  } catch (error) {
    console.error('❌ Command failed:', error);
    process.exit(1);
  } finally {
    manager.close();
  }
}

// Always run main when this script is executed
main().catch(console.error);

export { ClientManager };
