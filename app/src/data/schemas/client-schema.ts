/**
 * Client Configuration Schema Validation
 *
 * Zod schemas for validating client configurations to ensure they meet
 * LIDR SDLC Methodology requirements.
 */

import { z } from 'zod';

// Base validation patterns
const clientIdPattern = /^[a-z][a-z0-9-]*[a-z0-9]$/;
const colorHexPattern = /^#[0-9A-Fa-f]{6}$/;
const domainPattern = /^[a-z0-9][a-z0-9.-]*[a-z0-9]\.[a-z]{2,}$/;

// Industry-specific validation
const knownIndustries = [
  'Biometric Identity Verification',
  'Healthcare Technology',
  'Financial Technology',
  'Government & Public Sector',
  'E-commerce & Retail',
  'Software Development',
  'Custom',
] as const;

const commonRegulations = [
  'GDPR',
  'CCPA',
  'HIPAA',
  'PSD2',
  'SOX',
  'ISO 27001',
  'ISO 30107',
  'NIST SP 800-63B',
  'eIDAS',
  'FDA 21 CFR Part 820',
  'PCI DSS',
  'AML/KYC',
] as const;

// Team role validation
const teamRoleSchema = z.object({
  pme: z.number().int().min(1).max(10),
  productOwner: z.number().int().min(1).max(5),
  techLead: z.number().int().min(1).max(3),
  developers: z.number().int().min(2).max(20),
  qaLead: z.number().int().min(1).max(3),
  qaEngineers: z.number().int().min(1).max(10),
  security: z.number().int().min(1).max(5),
  devOps: z.number().int().min(1).max(5),
  scrumMaster: z.number().int().min(1).max(3),
});

// Color scheme validation
const colorSchemeSchema = z.object({
  primary: z.string().regex(colorHexPattern, 'Primary color must be a valid hex color'),
  secondary: z.string().regex(colorHexPattern, 'Secondary color must be a valid hex color'),
  accent: z.string().regex(colorHexPattern, 'Accent color must be a valid hex color'),
});

// Template variables validation
const templateVarsSchema = z.object({
  // Core template variables (required)
  CLIENT_REGULATIONS: z.string().min(5).max(200),
  STAKEHOLDER_TYPES: z.string().min(10).max(200),
  DOMAIN_SYSTEMS: z.string().min(5).max(100),
  SENSITIVE_DATA_TYPE: z.string().min(5).max(100),
  COMPLIANCE_FRAMEWORK: z.string().min(5).max(200),

  // Enhanced template variables for dynamic content
  GOVERNANCE_STYLE: z.string().min(5).max(100),
  TEAM_STRUCTURE: z.string().min(10).max(200),
  CRISIS_LANGUAGE: z.string().min(10).max(200),
  TOOL_ECOSYSTEM: z.string().min(10).max(300),
  PROCESS_MATURITY: z.string().min(10).max(200),
  DELIVERY_PRESSURE: z.string().min(10).max(200),
});

// Domain terms validation (optional but structured)
const domainTermsSchema = z.record(z.string(), z.string()).optional();

// Main client configuration schema
export const clientConfigSchema = z
  .object({
    // Client Identity (required)
    name: z.string().min(2).max(50),
    fullName: z.string().min(5).max(200),
    industry: z.enum(knownIndustries),
    segment: z.string().min(5).max(100),

    // Project Context (required)
    projectCode: z
      .string()
      .min(3)
      .max(20)
      .regex(/^[A-Z][A-Z0-9-]*$/, 'Project code must be uppercase with hyphens'),
    projectName: z.string().min(5).max(100),
    domain: z.string().min(3).max(100),

    // Technical Context (required)
    mainProducts: z.array(z.string().min(2).max(50)).min(1).max(10),

    // Regulatory Context (required)
    regulations: z.array(z.enum(commonRegulations)).min(1).max(15),

    // Template Variables (required for LIDR SDLC)
    templateVars: templateVarsSchema,

    // Domain Terms (optional but validated structure)
    domainTerms: domainTermsSchema,

    // Team Configuration (required)
    team: teamRoleSchema,

    // Branding (required)
    colors: colorSchemeSchema,

    // Optional fields
    subdomain: z.string().regex(domainPattern, 'Subdomain must be a valid domain').optional(),

    // Internal metadata (auto-generated)
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
    version: z.string().optional(),
  })
  .strict();

// Client ID validation (separate for file naming)
export const clientIdSchema = z
  .string()
  .min(2)
  .max(30)
  .regex(
    clientIdPattern,
    'Client ID must be lowercase, alphanumeric with hyphens, start and end with alphanumeric'
  );

// Extended validation for business rules
export const clientConfigExtendedSchema = clientConfigSchema.superRefine((data, ctx) => {
  // Team size validation
  const totalTeamSize = Object.values(data.team).reduce((sum, count) => sum + count, 0);
  if (totalTeamSize > 50) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Total team size cannot exceed 50 members',
      path: ['team'],
    });
  }

  if (totalTeamSize < 5) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Team must have at least 5 members total',
      path: ['team'],
    });
  }

  // Developer to QA ratio validation
  const devToQaRatio = data.team.developers / (data.team.qaEngineers + data.team.qaLead);
  if (devToQaRatio > 5) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Developer to QA ratio should not exceed 5:1',
      path: ['team'],
    });
  }

  // Industry-specific regulation validation
  const industryRegulationMap = {
    'Healthcare Technology': ['HIPAA', 'GDPR'],
    'Financial Technology': ['PSD2', 'GDPR'],
    'Government & Public Sector': ['eIDAS', 'GDPR'],
    'Biometric Identity Verification': ['GDPR', 'ISO 30107'],
  };

  const requiredRegs = industryRegulationMap[data.industry as keyof typeof industryRegulationMap];
  if (requiredRegs) {
    const missingRegs = requiredRegs.filter((reg) => !data.regulations.includes(reg as any));
    if (missingRegs.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Industry "${data.industry}" typically requires regulations: ${missingRegs.join(', ')}`,
        path: ['regulations'],
      });
    }
  }

  // Color contrast validation (basic)
  const colors = [data.colors.primary, data.colors.secondary, data.colors.accent];
  const uniqueColors = new Set(colors);
  if (uniqueColors.size !== colors.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'All brand colors must be different',
      path: ['colors'],
    });
  }
});

// Type exports
export type ClientConfig = z.infer<typeof clientConfigSchema>;
export type ClientId = z.infer<typeof clientIdSchema>;
export type ValidationResult = {
  success: boolean;
  errors?: z.ZodError;
  warnings?: string[];
  score?: number;
};

// Validation functions
export function validateClientConfig(config: unknown): ValidationResult {
  const result = clientConfigExtendedSchema.safeParse(config);

  if (!result.success) {
    return {
      success: false,
      errors: result.error,
    };
  }

  // Calculate quality score
  const score = calculateConfigScore(result.data);
  const warnings = generateWarnings(result.data);

  return {
    success: true,
    score,
    warnings,
  };
}

export function validateClientId(id: unknown): ValidationResult {
  const result = clientIdSchema.safeParse(id);

  return {
    success: result.success,
    errors: result.success ? undefined : result.error,
  };
}

// Quality scoring function
function calculateConfigScore(config: ClientConfig): number {
  let score = 70; // Base score

  // Completeness bonuses
  if (config.domainTerms && Object.keys(config.domainTerms).length > 0) {
    score += 5;
  }
  if (config.subdomain) {
    score += 3;
  }
  if (config.mainProducts.length > 1) {
    score += 2;
  }

  // Quality bonuses
  if (config.regulations.length >= 3) {
    score += 5;
  }
  if (config.fullName !== config.name) {
    score += 3;
  }
  if (config.domain.length > 10) {
    score += 2;
  }

  // Team structure bonuses
  const teamSize = Object.values(config.team).reduce((sum, count) => sum + count, 0);
  if (teamSize >= 8 && teamSize <= 15) {
    score += 5;
  } // Optimal team size
  if (config.team.security >= 1) {
    score += 3;
  } // Security focus

  // Template vars quality
  const avgVarLength =
    Object.values(config.templateVars).reduce((sum, val) => sum + val.length, 0) / 5;
  if (avgVarLength > 20) {
    score += 5;
  }

  return Math.min(100, score);
}

// Warning generation
function generateWarnings(config: ClientConfig): string[] {
  const warnings: string[] = [];

  const teamSize = Object.values(config.team).reduce((sum, count) => sum + count, 0);

  if (teamSize > 20) {
    warnings.push('Large team size may affect communication efficiency');
  }

  if (config.team.developers > 10) {
    warnings.push('Consider splitting development into multiple squads');
  }

  if (!config.subdomain) {
    warnings.push('Consider adding a subdomain for the SDLC portal');
  }

  if (!config.domainTerms || Object.keys(config.domainTerms).length === 0) {
    warnings.push('Domain-specific terminology would improve template customization');
  }

  if (config.regulations.length < 2) {
    warnings.push('Most industries require multiple regulatory compliances');
  }

  return warnings;
}

// Utility functions for common validation scenarios
export function isValidClientConfig(config: unknown): config is ClientConfig {
  return clientConfigExtendedSchema.safeParse(config).success;
}

export function getValidationErrors(config: unknown): string[] {
  const result = clientConfigExtendedSchema.safeParse(config);
  if (result.success) {
    return [];
  }

  return result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
}

export function getConfigQualityReport(config: ClientConfig): {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  recommendations: string[];
} {
  const score = calculateConfigScore(config);
  const warnings = generateWarnings(config);

  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (score >= 90) {
    grade = 'A';
  } else if (score >= 80) {
    grade = 'B';
  } else if (score >= 70) {
    grade = 'C';
  } else if (score >= 60) {
    grade = 'D';
  } else {
    grade = 'F';
  }

  const recommendations = warnings.map((warning) => `Consider: ${warning}`);

  return { score, grade, recommendations };
}
