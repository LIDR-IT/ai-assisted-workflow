/**
 * Security utilities for input validation and sanitization
 *
 * CRITICAL: These functions prevent XSS, injection attacks, and data exfiltration
 * for sensitive data processing per applicable data protection regulations.
 */

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Uses DOMPurify for comprehensive sanitization
 */
import DOMPurify from 'dompurify';

export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['script', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  });
};

/**
 * Sanitizes SVG content for diagram rendering
 * Allows SVG-specific tags while blocking script execution
 */
export const sanitizeSVG = (svg: string): string => {
  return DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: ['script', 'foreignObject'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror'],
  });
};

/**
 * Sanitizes CSS values to prevent CSS injection
 * Used for dynamic style generation
 */
export const sanitizeCSSValue = (value: string): string => {
  // Remove potentially dangerous characters and sequences
  return value
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/expression\(/gi, '') // Remove CSS expressions
    .replace(/url\(/gi, '') // Remove url() functions for now
    .trim();
};

/**
 * Validates and sanitizes CSS identifiers (class names, IDs)
 */
export const sanitizeCSSIdentifier = (identifier: string): string => {
  return identifier.replace(/[^a-zA-Z0-9-_]/g, '');
};

/**
 * Validates hex color codes
 */
export const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

/**
 * Validates CSS color values (hex, named colors, CSS variables)
 */
export const isValidCSSColor = (color: string): boolean => {
  const patterns = [
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, // Hex colors
    /^var\(--[a-zA-Z0-9-_]+\)$/, // CSS variables
    /^(red|blue|green|yellow|orange|purple|black|white|transparent)$/i, // Basic color names
  ];

  return patterns.some((pattern) => pattern.test(color));
};

/**
 * Sanitizes file names for safe download
 */
export const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s.-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .substring(0, 100); // Limit length
};

/**
 * Rate limiting helper for preventing abuse
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  constructor(
    private maxRequests: number = 10,
    private windowMs: number = 60000 // 1 minute
  ) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];

    // Remove old requests outside the window
    const validRequests = requests.filter((time) => now - time < this.windowMs);

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }
}

/**
 * Content Security Policy (CSP) helper
 */
export const CSP_DIRECTIVES = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'"], // TODO: Remove unsafe-inline when possible
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'", 'data:', 'blob:'],
  fontSrc: ["'self'"],
  connectSrc: ["'self'"],
  frameSrc: ["'none'"],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
  upgradeInsecureRequests: [],
} as const;

/**
 * Generates CSP header value
 */
export const generateCSPHeader = (): string => {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => {
      const kebabCase = directive.replace(/([A-Z])/g, '-$1').toLowerCase();
      return sources.length > 0 ? `${kebabCase} ${sources.join(' ')}` : kebabCase;
    })
    .join('; ');
};

/**
 * Security headers for production
 */
export const SECURITY_HEADERS = {
  'Content-Security-Policy': generateCSPHeader(),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
} as const;
