import { describe, it, expect } from 'vitest';
import { skills } from '@/data/artifacts/skills';

/**
 * T22 (trigger uniqueness) data invariant — mirrors the exemption logic in
 * `useTestExecution.ts`: a trigger collision is only ambiguous when 2+ NON-deprecated
 * skills own the phrase. A DEPRECATED skill (its description says so) intentionally
 * shares its trigger with its replacement (e.g. bmad-create-prd → bmad-prd, removed in
 * v7) — catching the phrase and redirecting IS its purpose, so it is exempt.
 */
function activeTriggerCollisions(): Array<[string, string[]]> {
  const isDeprecated = new Map(skills.map((s) => [s.id, /\bDEPRECATED\b/i.test(s.description)]));
  const owners = new Map<string, string[]>();
  for (const s of skills) {
    for (const t of s.triggers ?? []) {
      const key = t.toLowerCase().trim();
      if (!key) {
        continue;
      }
      owners.set(key, [...(owners.get(key) ?? []), s.id]);
    }
  }
  return [...owners.entries()].filter(
    ([, ids]) => ids.filter((id) => !isDeprecated.get(id)).length > 1
  );
}

describe('T22 — trigger uniqueness (deprecated-alias exemption)', () => {
  it('exempts deprecated-alias trigger sharing (bmad-create/edit/validate-prd ↔ bmad-prd)', () => {
    const active = new Map(activeTriggerCollisions());
    for (const phrase of ['create prd', 'update prd', 'validate prd']) {
      expect(active.has(phrase), `"${phrase}" must be exempt (deprecated alias)`).toBe(false);
    }
  });

  it('no two active LIDR skills share a trigger (project-tracking ambiguity resolved)', () => {
    const active = new Map(activeTriggerCollisions());
    expect(active.has('project tracking')).toBe(false);
  });

  it('any remaining active collision involves ONLY BMad CIS skills (no LIDR drift)', () => {
    // The remaining shared triggers are BMad CIS persona-agent ↔ workflow pairs
    // (e.g. "human-centered design") — BMad's own curation, flagged for BMad review,
    // not masked here (we must not edit BMad triggers nor create app↔skill drift).
    for (const [phrase, ids] of activeTriggerCollisions()) {
      expect(
        ids.every((id) => id.startsWith('bmad-cis-')),
        `"${phrase}" → ${ids.join(', ')} is a non-CIS active collision that must be disambiguated`
      ).toBe(true);
    }
  });
});
