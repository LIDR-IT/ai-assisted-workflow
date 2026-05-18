#!/usr/bin/env tsx
/**
 * Skill Health Report Generator
 *
 * Generates a comprehensive health report for all skills including:
 * - Template structure compliance
 * - Reference integrity
 * - Pattern usage
 * - Performance metrics
 * - Autonomy score
 *
 * Usage: npm run skills:health
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

interface SkillHealth {
  name: string;
  autonomyScore: number;
  templateCount: number;
  referenceIntegrity: number;
  patternUsage: number;
  lastUpdated: string;
  issues: HealthIssue[];
  recommendations: string[];
}

interface HealthIssue {
  level: 'ERROR' | 'WARNING' | 'INFO';
  category: 'STRUCTURE' | 'REFERENCES' | 'PATTERNS' | 'MAINTENANCE';
  message: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
}

class SkillHealthAnalyzer {
  private skillsDir = '.claude/skills';
  private sharedPatternsPath = '.claude/skills/_shared/template-patterns.md';
  private healthReports: SkillHealth[] = [];

  async generateHealthReport(): Promise<SkillHealth[]> {
    const skillDirs = this.getSkillDirectories();
    console.log(`🏥 Analyzing health of ${skillDirs.length} skills...`);

    for (const skillDir of skillDirs) {
      if (skillDir !== '_shared') {
        const health = await this.analyzeSkillHealth(skillDir);
        this.healthReports.push(health);
      }
    }

    this.healthReports.sort((a, b) => b.autonomyScore - a.autonomyScore);
    return this.healthReports;
  }

  private getSkillDirectories(): string[] {
    return readdirSync(this.skillsDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
      .filter((name) => !name.startsWith('.'));
  }

  private async analyzeSkillHealth(skillName: string): Promise<SkillHealth> {
    const skillPath = join(this.skillsDir, skillName);
    const health: SkillHealth = {
      name: skillName,
      autonomyScore: 0,
      templateCount: 0,
      referenceIntegrity: 100,
      patternUsage: 0,
      lastUpdated: 'Unknown',
      issues: [],
      recommendations: [],
    };

    try {
      // Analyze autonomy (does it have its own templates?)
      health.autonomyScore = this.calculateAutonomyScore(skillPath, health);

      // Analyze template structure
      this.analyzeTemplateStructure(skillPath, health);

      // Analyze reference integrity
      this.analyzeReferenceIntegrity(skillPath, health);

      // Analyze pattern usage
      this.analyzePatternUsage(skillPath, health);

      // Check maintenance status
      this.analyzeMaintenanceStatus(skillPath, health);

      // Generate recommendations
      this.generateRecommendations(health);
    } catch (error) {
      health.issues.push({
        level: 'ERROR',
        category: 'STRUCTURE',
        message: `Analysis failed: ${error.message}`,
        impact: 'HIGH',
      });
    }

    return health;
  }

  private calculateAutonomyScore(skillPath: string, health: SkillHealth): number {
    let score = 0;

    // Has templates directory (+40 points)
    const templatesDir = join(skillPath, 'templates');
    if (existsSync(templatesDir)) {
      score += 40;
      health.templateCount = this.countTemplates(templatesDir);

      // Additional points for multiple templates (+20 more)
      if (health.templateCount > 1) {
        score += 20;
      }
    } else {
      health.issues.push({
        level: 'WARNING',
        category: 'STRUCTURE',
        message: 'No templates directory found',
        impact: 'MEDIUM',
      });
    }

    // Has references directory (+15 points)
    if (existsSync(join(skillPath, 'references'))) {
      score += 15;
    }

    // Has examples directory (+15 points)
    if (existsSync(join(skillPath, 'examples'))) {
      score += 15;
    }

    // Has scripts directory (+10 points)
    if (existsSync(join(skillPath, 'scripts'))) {
      score += 10;
    }

    return Math.min(score, 100);
  }

  private countTemplates(templatesDir: string): number {
    let count = 0;
    const items = readdirSync(templatesDir, { withFileTypes: true });

    for (const item of items) {
      if (item.isFile() && item.name.endsWith('.md')) {
        count++;
      } else if (item.isDirectory()) {
        const subDir = join(templatesDir, item.name);
        const subItems = readdirSync(subDir).filter((f) => f.endsWith('.md'));
        count += subItems.length;
      }
    }

    return count;
  }

  private analyzeTemplateStructure(skillPath: string, health: SkillHealth): void {
    const skillMdPath = join(skillPath, 'SKILL.md');

    if (!existsSync(skillMdPath)) {
      health.issues.push({
        level: 'ERROR',
        category: 'STRUCTURE',
        message: 'Missing SKILL.md file',
        impact: 'HIGH',
      });
      return;
    }

    const content = readFileSync(skillMdPath, 'utf-8');

    // Check for proper frontmatter
    if (!content.startsWith('---\n')) {
      health.issues.push({
        level: 'ERROR',
        category: 'STRUCTURE',
        message: 'SKILL.md missing YAML frontmatter',
        impact: 'HIGH',
      });
    }

    // Check for template references
    const templateRefs = content.match(/templates\/[^)]+\.md/g) || [];
    const templatesDir = join(skillPath, 'templates');

    if (templateRefs.length > 0 && !existsSync(templatesDir)) {
      health.issues.push({
        level: 'ERROR',
        category: 'REFERENCES',
        message: 'References templates but no templates directory exists',
        impact: 'HIGH',
      });
      health.referenceIntegrity = 0;
    }
  }

  private analyzeReferenceIntegrity(skillPath: string, health: SkillHealth): void {
    const skillMdPath = join(skillPath, 'SKILL.md');

    if (!existsSync(skillMdPath)) {
      return;
    }

    const content = readFileSync(skillMdPath, 'utf-8');
    const templateRefs = content.match(/templates\/[^)]+\.md/g) || [];
    const templatesDir = join(skillPath, 'templates');

    if (templateRefs.length === 0) {
      if (existsSync(templatesDir)) {
        health.issues.push({
          level: 'WARNING',
          category: 'REFERENCES',
          message: 'Has templates but no references in SKILL.md',
          impact: 'MEDIUM',
        });
        health.referenceIntegrity = 70;
      }
      return;
    }

    let validRefs = 0;
    for (const ref of templateRefs) {
      const templatePath = join(templatesDir, ref.replace('templates/', ''));
      if (existsSync(templatePath)) {
        validRefs++;
      } else {
        health.issues.push({
          level: 'ERROR',
          category: 'REFERENCES',
          message: `Broken template reference: ${ref}`,
          impact: 'HIGH',
        });
      }
    }

    health.referenceIntegrity = Math.round((validRefs / templateRefs.length) * 100);
  }

  private analyzePatternUsage(skillPath: string, health: SkillHealth): void {
    const templatesDir = join(skillPath, 'templates');

    if (!existsSync(templatesDir)) {
      health.patternUsage = 0;
      return;
    }

    let patternCount = 0;
    let totalTemplates = 0;

    const checkForPatterns = (filePath: string): void => {
      if (existsSync(filePath)) {
        const content = readFileSync(filePath, 'utf-8');
        totalTemplates++;

        // Look for pattern references
        const patternRefs = content.match(/{@patterns\/[^}]+}/g) || [];
        if (patternRefs.length > 0) {
          patternCount++;
        }
      }
    };

    // Check all template files
    const items = readdirSync(templatesDir, { withFileTypes: true });
    for (const item of items) {
      const itemPath = join(templatesDir, item.name);
      if (item.isFile() && item.name.endsWith('.md')) {
        checkForPatterns(itemPath);
      } else if (item.isDirectory()) {
        const subItems = readdirSync(itemPath).filter((f) => f.endsWith('.md'));
        for (const subItem of subItems) {
          checkForPatterns(join(itemPath, subItem));
        }
      }
    }

    health.patternUsage =
      totalTemplates > 0 ? Math.round((patternCount / totalTemplates) * 100) : 0;

    if (health.patternUsage < 50 && totalTemplates > 1) {
      health.issues.push({
        level: 'INFO',
        category: 'PATTERNS',
        message: 'Low pattern usage - consider using shared patterns for consistency',
        impact: 'LOW',
      });
    }
  }

  private analyzeMaintenanceStatus(skillPath: string, health: SkillHealth): void {
    const skillMdPath = join(skillPath, 'SKILL.md');

    if (!existsSync(skillMdPath)) {
      return;
    }

    const content = readFileSync(skillMdPath, 'utf-8');
    const lastUpdatedMatch = content.match(/last_updated: ["']([^"']+)["']/);

    if (lastUpdatedMatch) {
      health.lastUpdated = lastUpdatedMatch[1];

      const lastUpdate = new Date(lastUpdatedMatch[1]);
      const now = new Date();
      const daysSinceUpdate = Math.floor(
        (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceUpdate > 90) {
        health.issues.push({
          level: 'WARNING',
          category: 'MAINTENANCE',
          message: `Not updated for ${daysSinceUpdate} days`,
          impact: 'MEDIUM',
        });
      }
    } else {
      health.issues.push({
        level: 'WARNING',
        category: 'MAINTENANCE',
        message: 'Missing last_updated field in frontmatter',
        impact: 'LOW',
      });
    }
  }

  private generateRecommendations(health: SkillHealth): void {
    // Autonomy recommendations
    if (health.autonomyScore < 60) {
      if (health.templateCount === 0) {
        health.recommendations.push('🏗️ Create templates/ directory with skill-specific templates');
      }
      health.recommendations.push('📚 Add references/ directory with detailed documentation');
      health.recommendations.push('💡 Add examples/ directory with usage examples');
    }

    // Reference integrity recommendations
    if (health.referenceIntegrity < 100) {
      health.recommendations.push('🔗 Fix broken template references in SKILL.md');
    }

    // Pattern usage recommendations
    if (health.patternUsage < 30 && health.templateCount > 0) {
      health.recommendations.push(
        '🎨 Consider using shared patterns from _shared/template-patterns.md'
      );
    }

    // Maintenance recommendations
    const criticalIssues = health.issues.filter((i) => i.level === 'ERROR').length;
    if (criticalIssues > 0) {
      health.recommendations.push('🚨 Address critical errors first');
    }

    const maintenanceIssues = health.issues.filter((i) => i.category === 'MAINTENANCE').length;
    if (maintenanceIssues > 0) {
      health.recommendations.push('🔧 Update skill metadata and frontmatter');
    }
  }

  generateSummaryReport(): void {
    const totalSkills = this.healthReports.length;
    const autonomousSkills = this.healthReports.filter((h) => h.autonomyScore >= 80).length;
    const averageAutonomy = Math.round(
      this.healthReports.reduce((sum, h) => sum + h.autonomyScore, 0) / totalSkills
    );
    const skillsWithTemplates = this.healthReports.filter((h) => h.templateCount > 0).length;
    const totalTemplates = this.healthReports.reduce((sum, h) => sum + h.templateCount, 0);
    const averageIntegrity = Math.round(
      this.healthReports.reduce((sum, h) => sum + h.referenceIntegrity, 0) / totalSkills
    );

    console.log('\n🏥 Skill Health Summary Report');
    console.log('===============================');
    console.log(`📊 Total Skills: ${totalSkills}`);
    console.log(
      `🤖 Autonomous Skills (≥80%): ${autonomousSkills} (${Math.round((autonomousSkills / totalSkills) * 100)}%)`
    );
    console.log(`📈 Average Autonomy Score: ${averageAutonomy}%`);
    console.log(
      `📁 Skills with Templates: ${skillsWithTemplates} (${Math.round((skillsWithTemplates / totalSkills) * 100)}%)`
    );
    console.log(`📄 Total Templates: ${totalTemplates}`);
    console.log(`🔗 Average Reference Integrity: ${averageIntegrity}%`);

    console.log('\n🏆 Top Performing Skills');
    console.log('========================');
    const topSkills = this.healthReports.slice(0, 5);
    for (const skill of topSkills) {
      const status = skill.autonomyScore >= 80 ? '🟢' : skill.autonomyScore >= 60 ? '🟡' : '🔴';
      console.log(
        `${status} ${skill.name}: ${skill.autonomyScore}% autonomy, ${skill.templateCount} templates`
      );
    }

    console.log('\n⚠️ Skills Needing Attention');
    console.log('===========================');
    const needsAttention = this.healthReports.filter(
      (h) =>
        h.autonomyScore < 60 ||
        h.referenceIntegrity < 100 ||
        h.issues.filter((i) => i.level === 'ERROR').length > 0
    );

    if (needsAttention.length === 0) {
      console.log('🎉 All skills are in good health!');
    } else {
      for (const skill of needsAttention) {
        const criticalIssues = skill.issues.filter((i) => i.level === 'ERROR').length;
        const warningIssues = skill.issues.filter((i) => i.level === 'WARNING').length;
        console.log(`🔴 ${skill.name}: ${skill.autonomyScore}% autonomy`);
        if (criticalIssues > 0) {
          console.log(`   ❌ ${criticalIssues} critical issues`);
        }
        if (warningIssues > 0) {
          console.log(`   ⚠️ ${warningIssues} warnings`);
        }
        if (skill.recommendations.length > 0) {
          console.log(`   💡 Top recommendation: ${skill.recommendations[0]}`);
        }
      }
    }

    console.log('\n📋 Ecosystem Health Score');
    console.log('=========================');
    const ecosystemScore = Math.round(
      averageAutonomy * 0.4 + // 40% weight on autonomy
        averageIntegrity * 0.3 + // 30% weight on integrity
        (skillsWithTemplates / totalSkills) * 100 * 0.3 // 30% weight on template adoption
    );

    const healthStatus =
      ecosystemScore >= 90
        ? '🟢 EXCELLENT'
        : ecosystemScore >= 80
          ? '🟡 GOOD'
          : ecosystemScore >= 70
            ? '🟠 NEEDS IMPROVEMENT'
            : '🔴 CRITICAL';

    console.log(`Overall Health: ${ecosystemScore}% ${healthStatus}`);

    if (ecosystemScore < 80) {
      console.log('\n🎯 Improvement Plan:');
      console.log('1. Migrate skills to autonomous template structure');
      console.log('2. Fix broken template references');
      console.log('3. Adopt shared patterns for consistency');
      console.log('4. Regular maintenance updates');
    }
  }

  async exportDetailedReport(outputPath: string = 'skill-health-report.json'): Promise<void> {
    const report = {
      generated_at: new Date().toISOString(),
      ecosystem_health: {
        total_skills: this.healthReports.length,
        autonomous_skills: this.healthReports.filter((h) => h.autonomyScore >= 80).length,
        average_autonomy: Math.round(
          this.healthReports.reduce((sum, h) => sum + h.autonomyScore, 0) /
            this.healthReports.length
        ),
        skills_with_templates: this.healthReports.filter((h) => h.templateCount > 0).length,
        total_templates: this.healthReports.reduce((sum, h) => sum + h.templateCount, 0),
        average_integrity: Math.round(
          this.healthReports.reduce((sum, h) => sum + h.referenceIntegrity, 0) /
            this.healthReports.length
        ),
      },
      skills: this.healthReports,
    };

    const fs = await import('fs/promises');
    await fs.writeFile(outputPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report exported to: ${outputPath}`);
  }
}

// Main execution
async function main() {
  const analyzer = new SkillHealthAnalyzer();
  await analyzer.generateHealthReport();
  analyzer.generateSummaryReport();

  // Export detailed report for CI/CD integration
  if (process.argv.includes('--export')) {
    await analyzer.exportDetailedReport();
  }
}

if (typeof import.meta !== 'undefined' && import.meta.url.endsWith('skill-health-report.ts')) {
  main().catch(console.error);
}
