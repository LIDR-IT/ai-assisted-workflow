/**
 * Ecosystem Coherence Validator
 * Validates consistency across skills, commands, templates, and documentation
 */

import {
  ValidationResult,
  ValidationIssue,
  ValidationSeverity,
  EcosystemCoherence,
} from "./types.js";
import * as fs from "fs";
import * as path from "path";

export interface EcosystemCoherenceOptions {
  checkCrossReferences: boolean;
  validateNaming: boolean;
  checkVersions: boolean;
  validateTemplates: boolean;
  strictMode: boolean;
}

const DEFAULT_OPTIONS: EcosystemCoherenceOptions = {
  checkCrossReferences: true,
  validateNaming: true,
  checkVersions: true,
  validateTemplates: true,
  strictMode: false,
};

interface EcosystemArtifact {
  path: string;
  type: "skill" | "command" | "template" | "checklist" | "rule" | "signoff";
  id: string;
  version?: string;
  phase?: number;
  references: string[];
  content: string;
}

/**
 * Validates ecosystem-wide coherence and consistency
 */
export function validateEcosystemCoherence(
  ecosystemPath: string,
  options: Partial<EcosystemCoherenceOptions> = {}
): ValidationResult {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const issues: ValidationIssue[] = [];

  // Discover all ecosystem artifacts
  const artifacts = discoverEcosystemArtifacts(ecosystemPath);

  if (artifacts.length === 0) {
    return createNoArtifactsResult();
  }

  // Validate cross-references
  if (config.checkCrossReferences) {
    validateCrossReferences(artifacts, issues);
  }

  // Validate naming conventions
  if (config.validateNaming) {
    validateNamingConventions(artifacts, issues);
  }

  // Validate version consistency
  if (config.checkVersions) {
    validateVersionConsistency(artifacts, issues);
  }

  // Validate template consistency
  if (config.validateTemplates) {
    validateTemplateConsistency(artifacts, issues);
  }

  // Validate phase consistency
  validatePhaseConsistency(artifacts, issues);

  // Check for orphaned artifacts
  validateOrphanedArtifacts(artifacts, issues);

  // Validate ecosystem completeness
  validateEcosystemCompleteness(artifacts, issues);

  const score = calculateCoherenceScore(artifacts, issues);

  return {
    success: issues.filter((i) => i.severity === ValidationSeverity.ERROR).length === 0,
    score,
    issues,
    metadata: {
      validator: "validate-ecosystem-coherence",
      timestamp: new Date().toISOString(),
      fileCount: artifacts.length,
    },
  };
}

function discoverEcosystemArtifacts(ecosystemPath: string): EcosystemArtifact[] {
  const artifacts: EcosystemArtifact[] = [];

  // Discover skills
  const skillsPath = path.join(ecosystemPath, "skills");
  if (fs.existsSync(skillsPath)) {
    const skillDirs = fs
      .readdirSync(skillsPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const skillName of skillDirs) {
      const skillMdPath = path.join(skillsPath, skillName, "SKILL.md");
      if (fs.existsSync(skillMdPath)) {
        const content = fs.readFileSync(skillMdPath, "utf-8");
        artifacts.push({
          path: skillMdPath,
          type: "skill",
          id: skillName,
          version: extractVersion(content),
          phase: extractPhase(content),
          references: extractReferences(content),
          content,
        });
      }
    }
  }

  // Discover commands
  const commandsPath = path.join(ecosystemPath, "commands");
  if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".md"));

    for (const commandFile of commandFiles) {
      const commandPath = path.join(commandsPath, commandFile);
      const content = fs.readFileSync(commandPath, "utf-8");
      const commandId = path.basename(commandFile, ".md");

      artifacts.push({
        path: commandPath,
        type: "command",
        id: commandId,
        version: extractVersion(content),
        references: extractReferences(content),
        content,
      });
    }
  }

  // Discover docs artifacts
  const docsPath = path.join(ecosystemPath, "..", "docs");
  if (fs.existsSync(docsPath)) {
    discoverDocsArtifacts(docsPath, artifacts);
  }

  // Discover rules
  const rulesPath = path.join(ecosystemPath, "rules");
  if (fs.existsSync(rulesPath)) {
    const ruleFiles = fs.readdirSync(rulesPath).filter((file) => file.endsWith(".md"));

    for (const ruleFile of ruleFiles) {
      const rulePath = path.join(rulesPath, ruleFile);
      const content = fs.readFileSync(rulePath, "utf-8");
      const ruleId = path.basename(ruleFile, ".md");

      artifacts.push({
        path: rulePath,
        type: "rule",
        id: ruleId,
        version: extractVersion(content),
        references: extractReferences(content),
        content,
      });
    }
  }

  return artifacts;
}

function discoverDocsArtifacts(docsPath: string, artifacts: EcosystemArtifact[]): void {
  // Templates
  const templatesPath = path.join(docsPath, "templates");
  if (fs.existsSync(templatesPath)) {
    const walk = (dir: string) => {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
          walk(fullPath);
        } else if (file.name.endsWith(".md")) {
          const content = fs.readFileSync(fullPath, "utf-8");
          const relativePath = path.relative(templatesPath, fullPath);
          const templateId = relativePath.replace(/\.md$/, "").replace(/\//g, "-");

          artifacts.push({
            path: fullPath,
            type: "template",
            id: templateId,
            version: extractVersion(content),
            references: extractReferences(content),
            content,
          });
        }
      }
    };
    walk(templatesPath);
  }

  // Checklists
  const checklistsPath = path.join(docsPath, "checklists");
  if (fs.existsSync(checklistsPath)) {
    const checklistFiles = fs.readdirSync(checklistsPath).filter((file) => file.endsWith(".md"));

    for (const checklistFile of checklistFiles) {
      const checklistPath = path.join(checklistsPath, checklistFile);
      const content = fs.readFileSync(checklistPath, "utf-8");
      const checklistId = path.basename(checklistFile, ".md");

      artifacts.push({
        path: checklistPath,
        type: "checklist",
        id: checklistId,
        version: extractVersion(content),
        references: extractReferences(content),
        content,
      });
    }
  }

  // Signoffs
  const signoffsPath = path.join(docsPath, "signoffs");
  if (fs.existsSync(signoffsPath)) {
    const signoffFiles = fs.readdirSync(signoffsPath).filter((file) => file.endsWith(".md"));

    for (const signoffFile of signoffFiles) {
      const signoffPath = path.join(signoffsPath, signoffFile);
      const content = fs.readFileSync(signoffPath, "utf-8");
      const signoffId = path.basename(signoffFile, ".md");

      artifacts.push({
        path: signoffPath,
        type: "signoff",
        id: signoffId,
        version: extractVersion(content),
        references: extractReferences(content),
        content,
      });
    }
  }
}

function extractVersion(content: string): string | undefined {
  const versionMatch = content.match(/^version:\s*["']?([^"'\n]+)["']?/m);
  return versionMatch ? versionMatch[1] : undefined;
}

function extractPhase(content: string): number | undefined {
  const phaseMatch = content.match(/^phase:\s*(\d+)/m);
  return phaseMatch ? parseInt(phaseMatch[1]) : undefined;
}

function extractReferences(content: string): string[] {
  const references = content.match(/@[\w\-\/\.]+\.md/g) || [];
  return references.map((ref) => ref.substring(1)); // Remove @
}

function validateCrossReferences(artifacts: EcosystemArtifact[], issues: ValidationIssue[]): void {
  const artifactPaths = new Set(artifacts.map((a) => a.path));
  const relativePathMap = new Map<string, string>();

  // Build relative path mapping
  artifacts.forEach((artifact) => {
    const relativePath = artifact.path.replace(/.*\.claude\//, "").replace(/.*\/docs\//, "docs/");
    relativePathMap.set(relativePath, artifact.path);
  });

  for (const artifact of artifacts) {
    for (const reference of artifact.references) {
      // Try to resolve reference
      const possiblePaths = [
        reference,
        `docs/${reference}`,
        `.claude/${reference}`,
        path.join(path.dirname(artifact.path), reference),
      ];

      let resolved = false;
      for (const possiblePath of possiblePaths) {
        if (relativePathMap.has(possiblePath) || fs.existsSync(possiblePath)) {
          resolved = true;
          break;
        }
      }

      if (!resolved) {
        issues.push({
          severity: ValidationSeverity.ERROR,
          message: `Broken cross-reference: ${reference}`,
          context: `Referenced from ${artifact.type} "${artifact.id}"`,
          suggestion: "Fix the reference path or remove the broken reference",
          ruleId: "COHERENCE-REF-001",
        });
      }
    }
  }
}

function validateNamingConventions(
  artifacts: EcosystemArtifact[],
  issues: ValidationIssue[]
): void {
  const namingRules = {
    skill: /^[a-z]+(-[a-z]+)*$/,
    command: /^[a-z]+(-[a-z]+)*$/,
    template: /^[a-z]+(-[a-z]+)*$/,
    checklist: /^[a-z]+(-[a-z]+)*$/,
    rule: /^[a-z]+(-[a-z]+)*$/,
    signoff: /^[a-z]+-signoff$/,
  };

  for (const artifact of artifacts) {
    const expectedPattern = namingRules[artifact.type];
    if (expectedPattern && !expectedPattern.test(artifact.id)) {
      issues.push({
        severity: ValidationSeverity.WARNING,
        message: `Naming convention violation: ${artifact.id}`,
        context: `${artifact.type} names should follow pattern: ${expectedPattern.source}`,
        suggestion: "Rename to follow kebab-case convention",
        ruleId: "COHERENCE-NAMING-001",
      });
    }
  }

  // Check for naming conflicts
  const nameGroups = new Map<string, EcosystemArtifact[]>();
  artifacts.forEach((artifact) => {
    const key = artifact.id;
    if (!nameGroups.has(key)) {
      nameGroups.set(key, []);
    }
    nameGroups.get(key)!.push(artifact);
  });

  nameGroups.forEach((group, name) => {
    if (group.length > 1) {
      const types = group.map((a) => a.type);
      if (new Set(types).size > 1) {
        // Different types with same name
        issues.push({
          severity: ValidationSeverity.WARNING,
          message: `Name conflict: "${name}"`,
          context: `Used by: ${types.join(", ")}`,
          suggestion: "Consider using more specific names to avoid confusion",
          ruleId: "COHERENCE-NAMING-002",
        });
      }
    }
  });
}

function validateVersionConsistency(
  artifacts: EcosystemArtifact[],
  issues: ValidationIssue[]
): void {
  // Check for artifacts without versions
  const artifactsWithoutVersions = artifacts.filter((a) => !a.version);

  artifactsWithoutVersions.forEach((artifact) => {
    issues.push({
      severity: ValidationSeverity.WARNING,
      message: `Missing version: ${artifact.id}`,
      context: `${artifact.type} should have version in frontmatter`,
      suggestion: "Add version field to frontmatter",
      ruleId: "COHERENCE-VERSION-001",
    });
  });

  // Check version format
  const validVersionPattern = /^\d+\.\d+\.\d+$/;
  artifacts.forEach((artifact) => {
    if (artifact.version && !validVersionPattern.test(artifact.version)) {
      issues.push({
        severity: ValidationSeverity.WARNING,
        message: `Invalid version format: ${artifact.version}`,
        context: `${artifact.type} "${artifact.id}" should use semantic versioning`,
        suggestion: "Use MAJOR.MINOR.PATCH format (e.g., 1.0.0)",
        ruleId: "COHERENCE-VERSION-002",
      });
    }
  });
}

function validateTemplateConsistency(
  artifacts: EcosystemArtifact[],
  issues: ValidationIssue[]
): void {
  const templates = artifacts.filter((a) => a.type === "template");

  // Check for required sections in templates
  const requiredTemplateSections = ["propósito", "estructura", "criterios de completitud"];

  templates.forEach((template) => {
    for (const section of requiredTemplateSections) {
      const hasSection = new RegExp(
        `##\\s*${section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
        "i"
      ).test(template.content);

      if (!hasSection) {
        issues.push({
          severity: ValidationSeverity.WARNING,
          message: `Template missing section: "${section}"`,
          context: `Template "${template.id}" should follow standard structure`,
          suggestion: `Add "## ${section}" section`,
          ruleId: "COHERENCE-TEMPLATE-001",
        });
      }
    }
  });
}

function validatePhaseConsistency(artifacts: EcosystemArtifact[], issues: ValidationIssue[]): void {
  const skills = artifacts.filter((a) => a.type === "skill" && a.phase !== undefined);

  // Check for invalid phases
  skills.forEach((skill) => {
    if (skill.phase! < 0 || skill.phase! > 4) {
      issues.push({
        severity: ValidationSeverity.ERROR,
        message: `Invalid phase: ${skill.phase}`,
        context: `Skill "${skill.id}" phase should be 0-4`,
        suggestion: "Correct phase to valid unified phase (0-4)",
        ruleId: "COHERENCE-PHASE-001",
      });
    }
  });

  // Check for phase gaps (missing essential phases)
  const phaseMap = new Map<number, EcosystemArtifact[]>();
  skills.forEach((skill) => {
    const phase = skill.phase!;
    if (!phaseMap.has(phase)) {
      phaseMap.set(phase, []);
    }
    phaseMap.get(phase)!.push(skill);
  });

  const essentialPhases = [1, 2, 3, 4, 5, 6, 7]; // Phases that should have skills
  essentialPhases.forEach((phase) => {
    if (!phaseMap.has(phase) || phaseMap.get(phase)!.length === 0) {
      issues.push({
        severity: ValidationSeverity.WARNING,
        message: `No skills found for phase ${phase}`,
        context: "Essential SDLC phases should have associated skills",
        suggestion: "Consider adding skills for this phase or verify phase assignments",
        ruleId: "COHERENCE-PHASE-002",
      });
    }
  });
}

function validateOrphanedArtifacts(
  artifacts: EcosystemArtifact[],
  issues: ValidationIssue[]
): void {
  // Find artifacts that are not referenced by any other artifact
  const referencedPaths = new Set<string>();

  artifacts.forEach((artifact) => {
    artifact.references.forEach((ref) => {
      referencedPaths.add(ref);
    });
  });

  artifacts.forEach((artifact) => {
    const relativePath = artifact.path.replace(/.*\.claude\//, "").replace(/.*\/docs\//, "docs/");
    const isReferenced =
      referencedPaths.has(relativePath) ||
      referencedPaths.has(artifact.path) ||
      artifact.type === "rule"; // Rules are always loaded

    if (!isReferenced && artifact.type !== "template") {
      // Templates may not be directly referenced
      issues.push({
        severity: ValidationSeverity.INFO,
        message: `Orphaned artifact: ${artifact.id}`,
        context: `${artifact.type} is not referenced by any other artifact`,
        suggestion: "Consider adding references or removing if unused",
        ruleId: "COHERENCE-ORPHAN-001",
      });
    }
  });
}

function validateEcosystemCompleteness(
  artifacts: EcosystemArtifact[],
  issues: ValidationIssue[]
): void {
  // Check for missing essential artifacts
  const essentialArtifacts = {
    rules: ["org", "project", "tech-stack", "documentation"],
    // PRD/UX/architecture templates are BMad-owned now (LIDR wraps, not duplicates).
    // Only LIDR-genuine templates remain essential.
    templates: ["epic"],
    checklists: ["dor", "dod"],
    signoffs: ["qa-signoff", "security-signoff"],
  };

  Object.entries(essentialArtifacts).forEach(([type, essentialIds]) => {
    const typeArtifacts = artifacts.filter((a) => a.type === (type.slice(0, -1) as any)); // Remove 's'
    const existingIds = new Set(typeArtifacts.map((a) => a.id));

    essentialIds.forEach((essentialId) => {
      if (!existingIds.has(essentialId)) {
        issues.push({
          severity: ValidationSeverity.ERROR,
          message: `Missing essential artifact: ${essentialId}`,
          context: `Essential ${type.slice(0, -1)} not found in ecosystem`,
          suggestion: `Create ${type.slice(0, -1)}/${essentialId}.md`,
          ruleId: "COHERENCE-COMPLETE-001",
        });
      }
    });
  });
}

function calculateCoherenceScore(
  artifacts: EcosystemArtifact[],
  issues: ValidationIssue[]
): number {
  if (artifacts.length === 0) return 0;

  // Base score from artifact count (more artifacts = more complex ecosystem)
  const artifactScore = Math.min(2, Math.log10(artifacts.length + 1) * 1.5);

  // Cross-reference health (percentage of valid references)
  const totalReferences = artifacts.reduce((sum, a) => sum + a.references.length, 0);
  const brokenReferences = issues.filter((i) => i.ruleId === "COHERENCE-REF-001").length;
  const referenceHealth = totalReferences > 0 ? 1 - brokenReferences / totalReferences : 1;
  const referenceScore = referenceHealth * 1.5;

  // Naming consistency score
  const namingIssues = issues.filter((i) => i.ruleId.startsWith("COHERENCE-NAMING")).length;
  const namingScore = Math.max(0, 1 - namingIssues / artifacts.length);

  // Completeness bonus
  const completenessIssues = issues.filter((i) => i.ruleId.startsWith("COHERENCE-COMPLETE")).length;
  const completenessBonus = completenessIssues === 0 ? 0.5 : 0;

  // Penalty for critical issues
  const errorPenalty = issues.filter((i) => i.severity === ValidationSeverity.ERROR).length * 0.3;
  const warningPenalty =
    issues.filter((i) => i.severity === ValidationSeverity.WARNING).length * 0.1;

  const finalScore =
    artifactScore +
    referenceScore +
    namingScore +
    completenessBonus -
    errorPenalty -
    warningPenalty;

  return Math.max(0, Math.min(5, finalScore));
}

function createNoArtifactsResult(): ValidationResult {
  return {
    success: false,
    score: 0,
    issues: [
      {
        severity: ValidationSeverity.ERROR,
        message: "No ecosystem artifacts found",
        context: "Unable to locate skills, commands, or documentation",
        suggestion: "Verify ecosystem directory structure",
        ruleId: "COHERENCE-000",
      },
    ],
    metadata: {
      validator: "validate-ecosystem-coherence",
      timestamp: new Date().toISOString(),
      fileCount: 0,
    },
  };
}

/**
 * Extract ecosystem coherence metrics for analysis
 */
export function extractCoherenceMetrics(ecosystemPath: string): EcosystemCoherence {
  const artifacts = discoverEcosystemArtifacts(ecosystemPath);

  // Analyze cross-references
  const crossReferences = artifacts.flatMap((artifact) =>
    artifact.references.map((ref) => ({
      sourceDocument: artifact.id,
      targetDocument: ref,
      sourceId: artifact.id,
      targetId: ref,
      verified: fs.existsSync(ref), // Simple verification
    }))
  );

  // Check template consistency
  const templates = artifacts.filter((a) => a.type === "template");
  const templateConsistency = templates.every((template) =>
    /##\s*(propósito|estructura|criterios de completitud)/i.test(template.content)
  );

  // Check naming conventions
  const namingConventions = artifacts.every((artifact) => {
    const pattern = /^[a-z]+(-[a-z]+)*$/;
    return pattern.test(artifact.id);
  });

  // Check version alignment
  const artifactsWithVersions = artifacts.filter((a) => a.version);
  const versionAlignment = artifactsWithVersions.every((artifact) =>
    /^\d+\.\d+\.\d+$/.test(artifact.version!)
  );

  return {
    templateConsistency,
    crossReferences,
    namingConventions,
    versionAlignment,
  };
}
