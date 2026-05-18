#!/usr/bin/env tsx
/// <reference types="node" />
/**
 * COHERENCE VALIDATION SCRIPT
 * Detects desynchronization between centralized data and hardcoded values in components
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { ecosystemStats, validateCounts } from '../src/data/computed/stats';

interface CoherenceIssue {
  file: string;
  line: number;
  issue: string;
  expected: string | number;
  found: string;
  severity: 'error' | 'warning' | 'info';
}

class CoherenceValidator {
  private issues: CoherenceIssue[] = [];
  private srcPath = join(process.cwd(), 'src');

  // Files that are sources of truth and should be excluded from coherence validation
  private excludedFiles = [
    'src/data/phases.ts', // Source of truth for phase colors
    'src/data/client.ts', // Source of truth for client registry
    'src/data/computed/stats.ts', // Source of truth for ecosystem stats
    'src/data/artifacts/', // All artifacts are source of truth
  ];

  // Patterns to detect hardcoded values that should be centralized
  private hardcodedPatterns = [
    // Skills count variations
    { pattern: /39\s*skills/i, expected: ecosystemStats.skills, type: 'skills' },
    { pattern: /45\s*skills/i, expected: ecosystemStats.skills, type: 'skills' },
    { pattern: /47\s*skills/i, expected: ecosystemStats.skills, type: 'skills' },

    // Commands count variations
    { pattern: /12\s*commands/i, expected: ecosystemStats.commands, type: 'commands' },
    { pattern: /34\s*commands/i, expected: ecosystemStats.commands, type: 'commands' },

    // Templates count variations
    { pattern: /35\s*templates/i, expected: ecosystemStats.templates, type: 'templates' },
    { pattern: /38\s*templates/i, expected: ecosystemStats.templates, type: 'templates' },
    { pattern: /50\s*templates/i, expected: ecosystemStats.templates, type: 'templates' },
    { pattern: /72\s*templates/i, expected: ecosystemStats.templates, type: 'templates' },

    // Total artifacts
    {
      pattern: /137\s*artefactos/i,
      expected: ecosystemStats.totalArtifacts,
      type: 'totalArtifacts',
    },
    {
      pattern: /149\s*artefactos/i,
      expected: ecosystemStats.totalArtifacts,
      type: 'totalArtifacts',
    },
    {
      pattern: /151\s*artefactos/i,
      expected: ecosystemStats.totalArtifacts,
      type: 'totalArtifacts',
    },
    {
      pattern: /155\s*artefactos/i,
      expected: ecosystemStats.totalArtifacts,
      type: 'totalArtifacts',
    },
  ];

  // Deprecated string patterns that should use computed values
  private deprecatedStrings = [
    '"39 skills estandarizados"',
    '"35 templates"',
    '"137 artefactos operativos"',
    '"45 skills"',
    '"12 commands"',
    "mejora: '39 skills",
    "mejora: '35 templates",
    "subtitle: '137 artefactos",
  ];

  validateFile(filePath: string): void {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        this.checkHardcodedValues(filePath, line, index + 1);
        this.checkDeprecatedStrings(filePath, line, index + 1);
        this.checkInconsistentPhaseColors(filePath, line, index + 1);
      });
    } catch (error) {
      this.addIssue({
        file: filePath,
        line: 0,
        issue: `Failed to read file: ${error}`,
        expected: 'readable file',
        found: 'error',
        severity: 'error',
      });
    }
  }

  private checkHardcodedValues(file: string, line: string, lineNumber: number): void {
    this.hardcodedPatterns.forEach(({ pattern, expected, type }) => {
      const match = line.match(pattern);
      if (match) {
        const foundValue = match[0];
        const extractedNumber = parseInt(foundValue.match(/\d+/)?.[0] || '0');

        if (extractedNumber !== expected) {
          this.addIssue({
            file,
            line: lineNumber,
            issue: `Hardcoded ${type} count is outdated`,
            expected: `${expected} ${type}`,
            found: foundValue,
            severity: extractedNumber < expected ? 'error' : 'warning',
          });
        }
      }
    });
  }

  private checkDeprecatedStrings(file: string, line: string, lineNumber: number): void {
    this.deprecatedStrings.forEach((deprecated) => {
      if (line.includes(deprecated)) {
        this.addIssue({
          file,
          line: lineNumber,
          issue: 'Deprecated hardcoded string found',
          expected: 'Use computed value from summaryStrings',
          found: deprecated,
          severity: 'warning',
        });
      }
    });
  }

  private checkInconsistentPhaseColors(file: string, line: string, lineNumber: number): void {
    // Look for hardcoded phase colors that should use centralized phase data
    const colorPatterns = [
      /purple.*originaci/i,
      /blue.*discovery/i,
      /cyan.*especificaci/i,
      /orange.*desarrollo/i,
      /sky.*qa/i,
      /red.*seguridad/i,
      /emerald.*despliegue/i,
    ];

    colorPatterns.forEach((pattern) => {
      if (line.match(pattern) && !line.includes('phases.') && !line.includes('getPhaseColor')) {
        this.addIssue({
          file,
          line: lineNumber,
          issue: 'Hardcoded phase color found',
          expected: 'Use getPhaseColor() or phases array',
          found: line.trim(),
          severity: 'info',
        });
      }
    });
  }

  private addIssue(issue: CoherenceIssue): void {
    this.issues.push(issue);
  }

  private shouldExcludeFile(filePath: string): boolean {
    // Normalize path to use forward slashes and remove process.cwd()
    const normalizedPath = filePath.replace(process.cwd() + '/', '').replace(/\\/g, '/');

    return this.excludedFiles.some((excludedPath) => {
      if (excludedPath.endsWith('/')) {
        // Directory exclusion
        return normalizedPath.startsWith(excludedPath);
      } else {
        // Exact file exclusion
        return normalizedPath === excludedPath;
      }
    });
  }

  private scanDirectory(dir: string): void {
    const entries = readdirSync(dir, { withFileTypes: true });

    entries.forEach((entry) => {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules, .git, dist, etc.
        if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(entry.name)) {
          this.scanDirectory(fullPath);
        }
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        if (!this.shouldExcludeFile(fullPath)) {
          this.validateFile(fullPath);
        }
      }
    });
  }

  public async validate(): Promise<void> {
    console.warn('🔍 Starting coherence validation...\n');

    // First validate the centralized data itself
    const dataValidation = validateCounts();
    if (!dataValidation.isValid) {
      dataValidation.issues.forEach((issue) => {
        this.addIssue({
          file: 'src/data/artifacts/*',
          line: 0,
          issue,
          expected: 'Valid data relationships',
          found: 'Data inconsistency',
          severity: 'error',
        });
      });
    }

    // Scan all TypeScript files in src/
    this.scanDirectory(this.srcPath);

    // Report results
    this.generateReport();
  }

  private generateReport(): void {
    const errorCount = this.issues.filter((i) => i.severity === 'error').length;
    const warningCount = this.issues.filter((i) => i.severity === 'warning').length;
    const infoCount = this.issues.filter((i) => i.severity === 'info').length;

    console.warn('📊 COHERENCE VALIDATION REPORT');
    console.warn('═'.repeat(50));
    console.warn(`Total issues found: ${this.issues.length}`);
    console.warn(`❌ Errors: ${errorCount}`);
    console.warn(`⚠️  Warnings: ${warningCount}`);
    console.warn(`ℹ️  Info: ${infoCount}\n`);

    if (this.issues.length === 0) {
      console.warn('✅ No coherence issues detected! All data is synchronized.\n');
      return;
    }

    // Group issues by file
    const issuesByFile = this.issues.reduce(
      (acc, issue) => {
        if (!acc[issue.file]) {
          acc[issue.file] = [];
        }
        acc[issue.file].push(issue);
        return acc;
      },
      {} as Record<string, CoherenceIssue[]>
    );

    Object.entries(issuesByFile).forEach(([file, issues]) => {
      const relativePath = file.replace(this.srcPath, 'src');
      console.warn(`📁 ${relativePath}`);

      issues.forEach((issue) => {
        const icon = issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️';

        console.warn(`  ${icon} Line ${issue.line}: ${issue.issue}`);
        console.warn(`     Expected: ${issue.expected}`);
        console.warn(`     Found: ${issue.found}`);
      });
      console.warn();
    });

    // Provide fix suggestions
    console.warn('🔧 SUGGESTED FIXES:');
    console.warn('═'.repeat(30));

    if (errorCount > 0) {
      console.warn('1. Update hardcoded numbers to use ecosystemStats:');
      console.warn('   import { ecosystemStats } from "src/data/computed/stats";');
      console.warn('   - Replace "39 skills" → `${ecosystemStats.skills} skills`');
      console.warn(
        '   - Replace "137 artefactos" → `${ecosystemStats.totalArtifacts} artefactos`\n'
      );
    }

    if (warningCount > 0) {
      console.warn('2. Replace deprecated strings with summaryStrings:');
      console.warn('   import { summaryStrings } from "src/data/computed/stats";');
      console.warn('   - Use summaryStrings.skillsStandardized');
      console.warn('   - Use summaryStrings.artifactsOperational\n');
    }

    if (infoCount > 0) {
      console.warn('3. Use centralized phase colors:');
      console.warn('   import { getPhaseColor } from "src/data/phases";');
      console.warn('   - Use getPhaseColor(1) instead of hardcoded "purple"\n');
    }

    // Exit with error code if there are errors
    if (errorCount > 0) {
      console.error('❌ Validation failed due to errors. Please fix and re-run.');
      process.exit(1);
    } else if (warningCount > 0) {
      console.warn(
        '⚠️  Validation completed with warnings. Consider fixing for better maintainability.'
      );
    } else {
      console.warn('✅ Validation completed successfully!');
    }
  }
}

// CLI execution for ESM
if (typeof import.meta !== 'undefined' && import.meta.url.endsWith('validate-coherence.ts')) {
  const validator = new CoherenceValidator();
  validator.validate().catch((error) => {
    console.error('💥 Validation script failed:', error);
    process.exit(1);
  });
}

export default CoherenceValidator;
