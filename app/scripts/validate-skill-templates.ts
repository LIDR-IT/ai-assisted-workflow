#!/usr/bin/env tsx
/**
 * Template Validation Script
 *
 * Validates that all skills with templates follow the correct structure
 * and have proper template references.
 *
 * Usage: npm run validate:templates
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

interface ValidationResult {
  skill: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  issues: string[];
  templateCount: number;
  referenceCount: number;
}

interface TemplateStructure {
  hasTemplatesDir: boolean;
  templateFiles: string[];
  skillMdExists: boolean;
  skillMdReferences: string[];
  orphanedTemplates: string[];
}

class TemplateValidator {
  private skillsDir = '.claude/skills';
  private results: ValidationResult[] = [];

  async validateAllSkills(): Promise<ValidationResult[]> {
    const skillDirs = this.getSkillDirectories();

    console.log(`🔍 Validating ${skillDirs.length} skills for template structure...`);

    for (const skillDir of skillDirs) {
      const result = await this.validateSkill(skillDir);
      this.results.push(result);
    }

    return this.results;
  }

  private getSkillDirectories(): string[] {
    return readdirSync(this.skillsDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
      .filter((name) => !name.startsWith('.'));
  }

  private async validateSkill(skillName: string): Promise<ValidationResult> {
    const skillPath = join(this.skillsDir, skillName);
    const result: ValidationResult = {
      skill: skillName,
      status: 'PASS',
      issues: [],
      templateCount: 0,
      referenceCount: 0,
    };

    try {
      const structure = this.analyzeSkillStructure(skillPath);

      // Check if skill has templates directory
      if (structure.hasTemplatesDir) {
        result.templateCount = structure.templateFiles.length;

        // Validate template structure
        this.validateTemplateStructure(structure, result);

        // Validate SKILL.md references
        this.validateSkillReferences(structure, result);

        // Check for orphaned templates
        this.checkOrphanedTemplates(structure, result);
      } else {
        // Check if skill should have templates (has template references in SKILL.md)
        if (structure.skillMdReferences.length > 0) {
          result.status = 'FAIL';
          result.issues.push(`Has template references but no templates/ directory`);
        }
      }
    } catch (error) {
      result.status = 'FAIL';
      result.issues.push(`Validation error: ${error.message}`);
    }

    return result;
  }

  private analyzeSkillStructure(skillPath: string): TemplateStructure {
    const templatesDir = join(skillPath, 'templates');
    const skillMdPath = join(skillPath, 'SKILL.md');

    const structure: TemplateStructure = {
      hasTemplatesDir: existsSync(templatesDir),
      templateFiles: [],
      skillMdExists: existsSync(skillMdPath),
      skillMdReferences: [],
      orphanedTemplates: [],
    };

    // Get template files
    if (structure.hasTemplatesDir) {
      structure.templateFiles = this.getTemplateFiles(templatesDir);
    }

    // Parse SKILL.md for template references
    if (structure.skillMdExists) {
      structure.skillMdReferences = this.extractTemplateReferences(skillMdPath);
    }

    return structure;
  }

  private getTemplateFiles(templatesDir: string): string[] {
    const files: string[] = [];

    const items = readdirSync(templatesDir, { withFileTypes: true });
    for (const item of items) {
      if (item.isFile() && item.name.endsWith('.md')) {
        files.push(item.name);
      } else if (item.isDirectory()) {
        // Handle subdirectories (like specs/)
        const subDir = join(templatesDir, item.name);
        const subFiles = readdirSync(subDir)
          .filter((f) => f.endsWith('.md'))
          .map((f) => `${item.name}/${f}`);
        files.push(...subFiles);
      }
    }

    return files;
  }

  private extractTemplateReferences(skillMdPath: string): string[] {
    const raw = readFileSync(skillMdPath, 'utf-8');
    // Strip fenced code blocks: meta-skills (e.g. lidr-command-development) show
    // illustrative `templates/...` paths inside examples — those are not real refs.
    const content = raw.replace(/```[\s\S]*?```/g, '');
    const references: string[] = [];

    // Match `templates/<file>.md`, but EXCLUDE:
    //  - variable-prefixed illustrative paths (`${VAR}/templates/...`) → preceded by `}`
    //  - wildcard/prose patterns (`templates/*.md`) → `*` is not in the filename class
    const templateRegex = /(?:^|[^}\w])templates\/([a-z0-9._-]+\.md)/gi;
    for (const m of content.matchAll(templateRegex)) {
      const ref = m[1];
      if (ref && !references.includes(ref)) {
        references.push(ref);
      }
    }

    return references;
  }

  private validateTemplateStructure(structure: TemplateStructure, result: ValidationResult): void {
    if (structure.templateFiles.length === 0) {
      result.status = 'WARN';
      result.issues.push('templates/ directory exists but is empty');
      return;
    }

    // Validate template file naming
    for (const templateFile of structure.templateFiles) {
      if (!this.isValidTemplateName(templateFile)) {
        result.status = 'WARN';
        result.issues.push(`Template file has non-standard name: ${templateFile}`);
      }
    }
  }

  private validateSkillReferences(structure: TemplateStructure, result: ValidationResult): void {
    result.referenceCount = structure.skillMdReferences.length;

    if (structure.skillMdReferences.length === 0) {
      result.status = 'WARN';
      result.issues.push('Has templates/ but no references in SKILL.md');
      return;
    }

    // Check that all references point to existing templates
    for (const reference of structure.skillMdReferences) {
      const exists = structure.templateFiles.some(
        (file) => file === reference || file.endsWith(`/${reference}`)
      );

      if (!exists) {
        result.status = 'FAIL';
        result.issues.push(`SKILL.md references non-existent template: ${reference}`);
      }
    }
  }

  private checkOrphanedTemplates(structure: TemplateStructure, result: ValidationResult): void {
    for (const templateFile of structure.templateFiles) {
      const fileName = templateFile.split('/').pop()!;
      const isReferenced = structure.skillMdReferences.some(
        (ref) => ref === fileName || ref.endsWith(fileName)
      );

      if (!isReferenced) {
        result.status = 'WARN';
        result.issues.push(`Orphaned template (not referenced): ${templateFile}`);
        structure.orphanedTemplates.push(templateFile);
      }
    }
  }

  private isValidTemplateName(fileName: string): boolean {
    // Template files should be kebab-case or match skill patterns
    const validPatterns = [
      /^[a-z0-9-]+\.md$/, // kebab-case.md
      /^[a-z0-9-]+\/[a-z0-9-]+\.md$/, // subdirectory/kebab-case.md
    ];

    return validPatterns.some((pattern) => pattern.test(fileName));
  }

  printSummary(): void {
    const passCount = this.results.filter((r) => r.status === 'PASS').length;
    const warnCount = this.results.filter((r) => r.status === 'WARN').length;
    const failCount = this.results.filter((r) => r.status === 'FAIL').length;
    const totalTemplates = this.results.reduce((sum, r) => sum + r.templateCount, 0);

    console.log('\n📊 Template Validation Summary');
    console.log('================================');
    console.log(`✅ PASS: ${passCount}`);
    console.log(`⚠️  WARN: ${warnCount}`);
    console.log(`❌ FAIL: ${failCount}`);
    console.log(`📁 Total Templates: ${totalTemplates}`);

    // Print detailed results for non-passing skills
    for (const result of this.results) {
      if (result.status !== 'PASS') {
        const status = result.status === 'FAIL' ? '❌' : '⚠️';
        console.log(`\n${status} ${result.skill}`);
        console.log(`   Templates: ${result.templateCount}, References: ${result.referenceCount}`);
        for (const issue of result.issues) {
          console.log(`   • ${issue}`);
        }
      }
    }

    if (failCount === 0) {
      console.log('\n🎉 All skills passed template validation!');
    } else {
      console.log(`\n⚠️  ${failCount} skills need attention.`);
      process.exit(1);
    }
  }
}

// Main execution
async function main() {
  const validator = new TemplateValidator();
  await validator.validateAllSkills();
  validator.printSummary();
}

if (typeof import.meta !== 'undefined' && import.meta.url.endsWith('validate-skill-templates.ts')) {
  main().catch(console.error);
}
