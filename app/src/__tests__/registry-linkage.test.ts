/**
 * Registry linkage guard — page registries stay linked to the canonical ones.
 *
 * Canonical source of truth per artifact: `src/data/artifacts/skills.ts` and
 * `src/data/artifacts/commands.ts`. The page registries (helpCenter = /help) keep
 * their own curated descriptions, so they silently drifted (helpCenter showed
 * 86/113 skills, 16/30 commands). This locks coverage: every canonical artifact
 * MUST have a /help entry, so "added a skill, forgot the page" can never merge.
 *
 * Fix a red test with `npm run data:sync` (additive — preserves curated entries).
 * See scripts/sync-registries.ts. A fast pre-push gate runs `data:sync:check`.
 */
import { describe, it, expect } from 'vitest';
import { skills as appSkills } from '@/data/artifacts/skills';
import { commands as appCommands } from '@/data/artifacts/commands';
import {
  skills as helpSkills,
  bmadSkills as helpBmadSkills,
  commands as helpCommands,
} from '@/data/features/helpCenter';

describe('/help registry covers every canonical skill and command', () => {
  const helpSkillIds = new Set([...helpSkills, ...helpBmadSkills].map((a) => a.id));
  const helpCommandIds = new Set(helpCommands.map((a) => a.id));

  it('every skills.ts skill has a /help entry', () => {
    const missing = appSkills.filter((s) => !helpSkillIds.has(s.id)).map((s) => s.id);
    expect(
      missing,
      `skills missing from helpCenter.ts (run: npm run data:sync): ${missing.join(', ')}`
    ).toEqual([]);
  });

  it('every commands.ts command has a /help entry', () => {
    const missing = appCommands.filter((c) => !helpCommandIds.has(c.id)).map((c) => c.id);
    expect(
      missing,
      `commands missing from helpCenter.ts (run: npm run data:sync): ${missing.join(', ')}`
    ).toEqual([]);
  });

  it('/help has no orphan skill entries (not in skills.ts)', () => {
    const canon = new Set(appSkills.map((s) => s.id));
    const orphans = [...helpSkillIds].filter((id) => !canon.has(id));
    expect(orphans, `helpCenter skills not in skills.ts: ${orphans.join(', ')}`).toEqual([]);
  });
});
