#!/usr/bin/env tsx
/**
 * validate-skill-examples.ts
 *
 * Validates that all skills with examples/ or templates/ directories
 * have properly implemented, non-placeholder content.
 *
 * Checks per file:
 *   - Not empty (≥ MIN_BYTES)
 *   - Has at least one markdown header (#)
 *   - Is not dominated by placeholder text (TODO/TBD/PENDING/PLACEHOLDER)
 *   - YAML frontmatter is well-formed when present
 *   - No file is just a copy of another file (basic hash check)
 *
 * Reports per skill:
 *   - PASS  — all files meet quality standards
 *   - WARN  — files exist but have quality concerns
 *   - FAIL  — critical issues (empty files, invalid structure)
 *
 * Usage:
 *   npx tsx scripts/validate-skill-examples.ts
 *   npm run validate:examples
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, extname, basename } from 'path';
import { createHash } from 'crypto';

/* ─────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────── */
interface FileIssue {
  severity: 'ERROR' | 'WARN' | 'INFO';
  message: string;
}

interface FileValidation {
  path: string;
  name: string;
  bytes: number;
  status: 'PASS' | 'WARN' | 'FAIL';
  issues: FileIssue[];
}

interface SkillValidation {
  skill: string;
  status: 'PASS' | 'WARN' | 'FAIL' | 'SKIP';
  examplesFiles: FileValidation[];
  templatesFiles: FileValidation[];
  summary: {
    examplesCount: number;
    templatesCount: number;
    passCount: number;
    warnCount: number;
    failCount: number;
  };
}

interface ValidationReport {
  totalSkills: number;
  skillsWithExamples: number;
  skillsWithTemplates: number;
  skillsWithBoth: number;
  skillsWithNeither: number;
  results: SkillValidation[];
  summary: {
    pass: number;
    warn: number;
    fail: number;
    skip: number;
  };
  duplicateHashes: Map<string, string[]>;
}

/* ─────────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────────── */
const SKILLS_DIR = '.claude/skills';
const MIN_BYTES = 150; // Files below this are likely empty stubs
const _MIN_HEADERS = 1; // Must have at least one markdown header
const MAX_PLACEHOLDER_RATIO = 0.4; // If >40% of lines are placeholders → WARN
const PLACEHOLDER_PATTERNS = [
  /^\s*#{0,6}\s*(TODO|TBD|PENDING|PLACEHOLDER|EXAMPLE_OUTPUT_HERE|XXX|FIXME)\b/i,
  /^\s*\[.*\]\s*$/, // Lines that are just [placeholder text]
  /^\s*{.*}\s*$/, // Lines that are just {template variables}
  /^\s*<.*>\s*$/, // Lines that are just <xml-like placeholders>
  /^\s*\.\.\.\s*$/, // Just "..."
];
const IGNORED_DIRS = ['validations', '_shared', '.git'];
const ALLOWED_EXTENSIONS = new Set([
  '.md',
  '.ts',
  '.js',
  '.json',
  '.yaml',
  '.yml',
  '.txt',
  '.sh',
  '.py',
]);

// Known intentional shared templates — identical content between skills is expected
const KNOWN_SHARED_TEMPLATE_NAMES = new Set([
  'architecture.md', // Shared between architecture-doc and brainstorming
  'rf-format.md', // Shared between generate-rf and validate-requirements
]);

/* ─────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────── */
function getSkillDirectories(): string[] {
  return readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.') && d.name !== '_shared')
    .map((d) => d.name)
    .sort();
}

function getFilesRecursive(dir: string, base: string = dir): string[] {
  if (!existsSync(dir)) {
    return [];
  }
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.includes(entry.name)) {
        files.push(...getFilesRecursive(full, base));
      }
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      if (ALLOWED_EXTENSIONS.has(ext)) {
        files.push(full);
      }
    }
  }
  return files;
}

function countPlaceholderLines(content: string): number {
  const lines = content.split('\n');
  return lines.filter((line) => PLACEHOLDER_PATTERNS.some((p) => p.test(line))).length;
}

function hasMarkdownHeaders(content: string): boolean {
  return /^#{1,6}\s+\S/m.test(content);
}

function isYamlFrontmatterValid(content: string): { hasYaml: boolean; valid: boolean } {
  if (!content.trimStart().startsWith('---')) {
    return { hasYaml: false, valid: true };
  }
  const closingIdx = content.indexOf('\n---', 3);
  if (closingIdx === -1) {
    return { hasYaml: true, valid: false };
  } // Unclosed frontmatter
  return { hasYaml: true, valid: true };
}

function md5(content: string): string {
  return createHash('md5').update(content).digest('hex');
}

/* ─────────────────────────────────────────────────────────────────────
   CORE VALIDATION
───────────────────────────────────────────────────────────────────── */
function validateFile(filePath: string): FileValidation {
  const name = basename(filePath);
  const issues: FileIssue[] = [];
  let status: 'PASS' | 'WARN' | 'FAIL' = 'PASS';

  let content = '';
  let bytes = 0;

  try {
    const stat = statSync(filePath);
    bytes = stat.size;
    content = readFileSync(filePath, 'utf-8');
  } catch {
    return {
      path: filePath,
      name,
      bytes: 0,
      status: 'FAIL',
      issues: [{ severity: 'ERROR', message: 'Cannot read file' }],
    };
  }

  // Check 1: Minimum size
  if (bytes < MIN_BYTES) {
    issues.push({
      severity: 'ERROR',
      message: `File too small (${bytes} bytes < ${MIN_BYTES} minimum) — likely empty stub`,
    });
    status = 'FAIL';
  }

  // For markdown files, apply additional checks
  const ext = extname(name).toLowerCase();
  if (ext === '.md' && bytes >= MIN_BYTES) {
    // Check 2: Markdown headers
    if (!hasMarkdownHeaders(content)) {
      issues.push({
        severity: 'WARN',
        message: 'No markdown headers found — content may be unstructured',
      });
      if (status === 'PASS') {
        status = 'WARN';
      }
    }

    // Check 3: YAML frontmatter validity
    const { hasYaml, valid } = isYamlFrontmatterValid(content);
    if (hasYaml && !valid) {
      issues.push({
        severity: 'ERROR',
        message: 'YAML frontmatter is unclosed (missing closing ---)',
      });
      status = 'FAIL';
    }

    // Check 4: Placeholder ratio
    const lines = content.split('\n').filter((l) => l.trim().length > 0);
    const placeholderLines = countPlaceholderLines(content);
    if (lines.length > 5) {
      const ratio = placeholderLines / lines.length;
      if (ratio > MAX_PLACEHOLDER_RATIO) {
        issues.push({
          severity: 'WARN',
          message: `High placeholder ratio: ${(ratio * 100).toFixed(0)}% of lines are placeholders`,
        });
        if (status === 'PASS') {
          status = 'WARN';
        }
      }
    }

    // Check 5: Minimum substantive lines
    const substantiveLines = lines.filter((l) => l.trim().length > 10).length;
    if (substantiveLines < 3 && bytes >= MIN_BYTES) {
      issues.push({
        severity: 'WARN',
        message: `Very few substantive lines (${substantiveLines}) — may lack real content`,
      });
      if (status === 'PASS') {
        status = 'WARN';
      }
    }
  }

  return { path: filePath, name, bytes, status, issues };
}

function validateSkill(skillName: string): SkillValidation {
  const skillPath = join(SKILLS_DIR, skillName);
  const examplesDir = join(skillPath, 'examples');
  const templatesDir = join(skillPath, 'templates');

  const hasExamples = existsSync(examplesDir);
  const hasTemplates = existsSync(templatesDir);

  if (!hasExamples && !hasTemplates) {
    return {
      skill: skillName,
      status: 'SKIP',
      examplesFiles: [],
      templatesFiles: [],
      summary: { examplesCount: 0, templatesCount: 0, passCount: 0, warnCount: 0, failCount: 0 },
    };
  }

  const examplesFiles = hasExamples ? getFilesRecursive(examplesDir).map(validateFile) : [];
  const templatesFiles = hasTemplates ? getFilesRecursive(templatesDir).map(validateFile) : [];

  const allFiles = [...examplesFiles, ...templatesFiles];

  // Additional check: templates/ dir exists but is empty
  if (hasTemplates && templatesFiles.length === 0) {
    const emptyResult: FileValidation = {
      path: templatesDir,
      name: 'templates/ (directory)',
      bytes: 0,
      status: 'WARN',
      issues: [{ severity: 'WARN', message: 'templates/ directory exists but contains no files' }],
    };
    templatesFiles.push(emptyResult);
    allFiles.push(emptyResult);
  }

  if (hasExamples && examplesFiles.length === 0) {
    const emptyResult: FileValidation = {
      path: examplesDir,
      name: 'examples/ (directory)',
      bytes: 0,
      status: 'WARN',
      issues: [{ severity: 'WARN', message: 'examples/ directory exists but contains no files' }],
    };
    examplesFiles.push(emptyResult);
    allFiles.push(emptyResult);
  }

  const failCount = allFiles.filter((f) => f.status === 'FAIL').length;
  const warnCount = allFiles.filter((f) => f.status === 'WARN').length;
  const passCount = allFiles.filter((f) => f.status === 'PASS').length;

  const status: SkillValidation['status'] =
    failCount > 0 ? 'FAIL' : warnCount > 0 ? 'WARN' : 'PASS';

  return {
    skill: skillName,
    status,
    examplesFiles,
    templatesFiles,
    summary: {
      examplesCount: examplesFiles.length,
      templatesCount: templatesFiles.length,
      passCount,
      warnCount,
      failCount,
    },
  };
}

/* ─────────────────────────────────────────────────────────────────────
   DUPLICATE DETECTION
───────────────────────────────────────────────────────────────────── */
function detectDuplicates(results: SkillValidation[]): Map<string, string[]> {
  const hashMap = new Map<string, string[]>();

  for (const r of results) {
    for (const file of [...r.examplesFiles, ...r.templatesFiles]) {
      if (file.bytes < MIN_BYTES) {
        continue;
      }
      // Skip known shared templates — identical content is intentional
      if (KNOWN_SHARED_TEMPLATE_NAMES.has(basename(file.path))) {
        continue;
      }
      try {
        const content = readFileSync(file.path, 'utf-8');
        const hash = md5(content);
        if (!hashMap.has(hash)) {
          hashMap.set(hash, []);
        }
        hashMap.get(hash)!.push(file.path);
      } catch {
        // skip unreadable files
      }
    }
  }

  // Keep only those with duplicates
  for (const [hash, paths] of hashMap.entries()) {
    if (paths.length < 2) {
      hashMap.delete(hash);
    }
  }

  return hashMap;
}

/* ─────────────────────────────────────────────────────────────────────
   REPORT OUTPUT
───────────────────────────────────────────────────────────────────── */
function printReport(report: ValidationReport): void {
  const { results, summary, duplicateHashes } = report;

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║   SKILL EXAMPLES & TEMPLATES VALIDATION REPORT          ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  console.log(`📊 Ecosystem Coverage:`);
  console.log(`   Total skills scanned : ${report.totalSkills}`);
  console.log(`   Skills with examples  : ${report.skillsWithExamples}`);
  console.log(`   Skills with templates : ${report.skillsWithTemplates}`);
  console.log(`   Skills with both      : ${report.skillsWithBoth}`);
  console.log(`   Skills with neither   : ${report.skillsWithNeither}\n`);

  console.log(`🏁 Validation Results:`);
  console.log(`   ✅ PASS : ${summary.pass}`);
  console.log(`   ⚠️  WARN : ${summary.warn}`);
  console.log(`   ❌ FAIL : ${summary.fail}`);
  console.log(`   ⏭️  SKIP : ${summary.skip}\n`);

  // FAIL cases first
  const fails = results.filter((r) => r.status === 'FAIL');
  if (fails.length > 0) {
    console.log('─── ❌ FAIL ────────────────────────────────────────────────');
    for (const r of fails) {
      console.log(`\n  ${r.skill}`);
      for (const file of [...r.examplesFiles, ...r.templatesFiles]) {
        if (file.status === 'FAIL') {
          console.log(`    📄 ${file.name} (${file.bytes}B)`);
          for (const issue of file.issues) {
            console.log(`       ${issue.severity === 'ERROR' ? '🔴' : '🟡'} ${issue.message}`);
          }
        }
      }
    }
    console.log();
  }

  // WARN cases
  const warns = results.filter((r) => r.status === 'WARN');
  if (warns.length > 0) {
    console.log('─── ⚠️  WARN ───────────────────────────────────────────────');
    for (const r of warns) {
      console.log(
        `\n  ${r.skill} (${r.summary.examplesCount} examples, ${r.summary.templatesCount} templates)`
      );
      for (const file of [...r.examplesFiles, ...r.templatesFiles]) {
        if (file.issues.length > 0) {
          console.log(`    📄 ${file.name}`);
          for (const issue of file.issues) {
            console.log(`       🟡 ${issue.message}`);
          }
        }
      }
    }
    console.log();
  }

  // PASS summary
  const passes = results.filter((r) => r.status === 'PASS');
  if (passes.length > 0) {
    console.log(`─── ✅ PASS (${passes.length} skills) ─────────────────────────────────`);
    for (const r of passes) {
      const ex = r.summary.examplesCount;
      const tpl = r.summary.templatesCount;
      console.log(`  ✓ ${r.skill.padEnd(30)} ${ex} examples  ${tpl} templates`);
    }
    console.log();
  }

  // Skipped (no examples or templates)
  const skips = results.filter((r) => r.status === 'SKIP');
  if (skips.length > 0) {
    console.log(`─── ⏭️  NO EXAMPLES/TEMPLATES (${skips.length} skills) ─────────────────`);
    for (const r of skips) {
      console.log(`  ⏭  ${r.skill}`);
    }
    console.log();
  }

  // Duplicate detection
  if (duplicateHashes.size > 0) {
    console.log('─── 🔁 DUPLICATE CONTENT DETECTED ─────────────────────────');
    for (const [, paths] of duplicateHashes.entries()) {
      console.log(`\n  Identical files:`);
      for (const p of paths) {
        console.log(`    ${p}`);
      }
    }
    console.log();
  }

  // Coverage stats
  const totalWithContent =
    report.skillsWithExamples + report.skillsWithTemplates - report.skillsWithBoth;
  const coveragePercent = Math.round((totalWithContent / report.totalSkills) * 100);
  console.log('─── 📈 COVERAGE SUMMARY ────────────────────────────────────');
  console.log(
    `  Skills with examples or templates : ${totalWithContent}/${report.totalSkills} (${coveragePercent}%)`
  );
  console.log(`  Skills with no examples/templates : ${report.skillsWithNeither}`);

  if (report.skillsWithNeither > 0) {
    console.log('\n  📌 Recommendation: Add examples or templates to these skills:');
    for (const r of skips) {
      console.log(`     - ${r.skill}`);
    }
  }
  console.log();

  // Quality score
  const qualityDenominator = summary.pass + summary.warn + summary.fail;
  const qualityScore =
    qualityDenominator > 0 ? Math.round((summary.pass / qualityDenominator) * 100) : 100;
  console.log(
    `  🎯 Quality Score: ${qualityScore}%  (${summary.pass} PASS / ${qualityDenominator} with content)`
  );
  console.log();
}

/* ─────────────────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────────────────────── */
async function main(): Promise<void> {
  const skillNames = getSkillDirectories();
  console.log(`🔍 Scanning ${skillNames.length} skills in ${SKILLS_DIR}...`);

  const results: SkillValidation[] = skillNames.map((name) => validateSkill(name));

  const skillsWithExamples = results.filter((r) => r.summary.examplesCount > 0).length;
  const skillsWithTemplates = results.filter((r) => r.summary.templatesCount > 0).length;
  const skillsWithBoth = results.filter(
    (r) => r.summary.examplesCount > 0 && r.summary.templatesCount > 0
  ).length;
  const skillsWithNeither = results.filter((r) => r.status === 'SKIP').length;

  const duplicateHashes = detectDuplicates(results);

  const report: ValidationReport = {
    totalSkills: skillNames.length,
    skillsWithExamples,
    skillsWithTemplates,
    skillsWithBoth,
    skillsWithNeither,
    results,
    summary: {
      pass: results.filter((r) => r.status === 'PASS').length,
      warn: results.filter((r) => r.status === 'WARN').length,
      fail: results.filter((r) => r.status === 'FAIL').length,
      skip: results.filter((r) => r.status === 'SKIP').length,
    },
    duplicateHashes,
  };

  printReport(report);

  const exitCode = report.summary.fail > 0 ? 1 : 0;
  process.exit(exitCode);
}

if (typeof import.meta !== 'undefined' && import.meta.url.endsWith('validate-skill-examples.ts')) {
  main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
