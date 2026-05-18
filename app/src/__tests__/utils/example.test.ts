import { describe, it, expect } from 'vitest';

// Simple utility function for testing infrastructure validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function formatDisplayName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

describe('Utility Functions', () => {
  describe('isValidEmail', () => {
    it('validates correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(isValidEmail('user123@test.io')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('missing@domain')).toBe(false);
      expect(isValidEmail('@missing-local.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('spaces in@email.com')).toBe(false);
    });
  });

  describe('formatDisplayName', () => {
    it('formats full names correctly', () => {
      expect(formatDisplayName('John', 'Doe')).toBe('John Doe');
      expect(formatDisplayName('María', 'González')).toBe('María González');
    });

    it('handles single names', () => {
      expect(formatDisplayName('John', '')).toBe('John');
      expect(formatDisplayName('', 'Doe')).toBe('Doe');
    });

    it('handles empty input', () => {
      expect(formatDisplayName('', '')).toBe('');
    });

    it('trims whitespace', () => {
      expect(formatDisplayName(' John ', ' Doe ')).toBe('John   Doe');
      expect(formatDisplayName('John', ' ')).toBe('John');
    });
  });
});
