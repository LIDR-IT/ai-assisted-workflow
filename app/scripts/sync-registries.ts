/**
 * sync-registries.ts — keep the page registries linked to the canonical ones.
 *
 * Canonical source of truth (per artifact): `src/data/artifacts/skills.ts` and
 * `src/data/artifacts/commands.ts`. The page registries (`helpCenter.ts`) carry
 * their OWN curated descriptions/triggers, so we never overwrite them — we only
 * ADD entries for canonical artifacts that are MISSING, as stubs derived from the
 * canonical entry. Existing curated entries are left untouched.
 *
 *   npm run data:sync         → inserts missing helpCenter entries (and prettifies)
 *   npm run data:sync:check   → reports gaps, exits 1 if any (CI / pre-push)
 *
 * The ecosystem-coherence test is the backstop: it FAILS if a canonical artifact
 * has no helpCenter entry, so drift can never merge.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { skills } from '../src/data/artifacts/skills.ts';
import { commands } from '../src/data/artifacts/commands.ts';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const HELP = path.join(HERE, '../src/data/features/helpCenter.ts');
const CHECK = process.argv.includes('--check');

// stage slug → unified phase (0-4), the number /help filters by
const STAGE_TO_PHASE: Record<string, number> = {
  context: 0,
  anytime: 0,
  analysis: 1,
  planning: 2,
  specification: 3,
  'sprint-planning': 3,
  development: 4,
  qa: 4,
  security: 4,
  release: 4,
};
const PHASE_LABEL: Record<number, string> = {
  0: 'Fase 0 — Context & Anytime',
  1: 'Fase 1 — Analysis',
  2: 'Fase 2 — Planning',
  3: 'Fase 3 — Solutioning',
  4: 'Fase 4 — Implementation',
};
const TIER_LABEL: Record<string, string> = {
  orchestrator: 'Tier 1 — Orchestrator',
  tactical: 'Tier 2 — Tactical',
  utility: 'Tier 3 — Utility',
};

const S = (v: unknown) => JSON.stringify(v ?? '');
const arr = (v?: string[]) => (v && v.length ? `[${v.map(S).join(', ')}]` : '[]');

/** ids already present inside a named `export const NAME: Artifact[] = [ ... ]` block */
function idsIn(text: string, name: string): { ids: Set<string>; closeIdx: number } {
  const start = text.indexOf(`export const ${name}: Artifact[] = [`);
  if (start === -1) {
    return { ids: new Set(), closeIdx: -1 };
  }
  const closeIdx = text.indexOf('\n];', start);
  const block = text.slice(start, closeIdx);
  const ids = new Set([...block.matchAll(/id: '([a-z0-9-]+)'/g)].map((m) => m[1]!));
  return { ids, closeIdx };
}

function skillStub(s: (typeof skills)[number]): string {
  const phaseNum = s.stage ? (STAGE_TO_PHASE[s.stage] ?? 0) : 0;
  const docPath = (s.docPath ?? `.claude/skills/${s.id}/SKILL.md`).replace(
    '.agents/skills/',
    '.claude/skills/'
  );
  return `  {
    id: ${S(s.id)},
    name: ${S(s.name)},
    type: 'skill',
    source: ${S(s.source)},${s.criticality ? `\n    criticality: ${S(s.criticality)},` : ''}
    phase: ${S(PHASE_LABEL[phaseNum])},
    phaseNum: ${phaseNum},${s.stage ? `\n    stage: ${S(s.stage)},` : ''}
    description: ${S(s.description)},
    triggers: ${arr(s.triggers)},
    roles: ${arr(s.roles)},${s.gateContribution ? `\n    gateContribution: ${S(s.gateContribution)},` : ''}
    docPath: ${S(docPath)},
  },`;
}

function commandStub(c: (typeof commands)[number]): string {
  const docPath = (c.docPath ?? `.claude/commands/${c.id}.md`).replace(
    '.agents/commands/',
    '.claude/commands/'
  );
  return `  {
    id: ${S(c.id)},
    name: ${S('/' + c.name)},
    type: 'command',
    source: 'lidr',
    tier: ${S(TIER_LABEL[c.tier] ?? c.tier)},
    description: ${S(c.description)},${c.argument ? `\n    argument: ${S(c.argument)},` : ''}${c.model ? `\n    model: ${S(c.model)},` : ''}
    roles: ${arr(c.authorizedRoles)},${c.precondition ? `\n    precondition: ${S(c.precondition)},` : ''}${c.gateContribution ? `\n    gateContribution: ${S(c.gateContribution)},` : ''}
    docPath: ${S(docPath)},
  },`;
}

function insertBefore(text: string, closeIdx: number, literals: string[]): string {
  return text.slice(0, closeIdx) + '\n' + literals.join('\n') + text.slice(closeIdx);
}

let text = fs.readFileSync(HELP, 'utf8');
const help = {
  skills: idsIn(text, 'skills'),
  bmadSkills: idsIn(text, 'bmadSkills'),
  commands: idsIn(text, 'commands'),
};
const helpSkillIds = new Set([...help.skills.ids, ...help.bmadSkills.ids]);

// bmad skills live in the `bmadSkills` array; lidr + anytime live in `skills`
const missingMain = skills.filter((s) => s.source !== 'bmad' && !helpSkillIds.has(s.id));
const missingBmad = skills.filter((s) => s.source === 'bmad' && !helpSkillIds.has(s.id));
const missingCmds = commands.filter((c) => !help.commands.ids.has(c.id));
const total = missingMain.length + missingBmad.length + missingCmds.length;

if (total === 0) {
  console.log('✓ registries in sync: every canonical skill/command has a /help entry');
  process.exit(0);
}

console.log(
  `helpCenter gaps — skills: ${missingMain.length} lidr/anytime + ${missingBmad.length} bmad missing; commands: ${missingCmds.length} missing`
);
[...missingMain, ...missingBmad].forEach((s) => console.log(`   skill  ${s.id}`));
missingCmds.forEach((c) => console.log(`   command ${c.id}`));

if (CHECK) {
  console.error(`\n✗ ${total} artifact(s) missing from /help. Run: npm run data:sync`);
  process.exit(1);
}

// --write: insert missing entries (re-resolve closeIdx after each splice, indices shift)
function fill(name: 'skills' | 'bmadSkills' | 'commands', literals: string[]) {
  if (!literals.length) {
    return;
  }
  const { closeIdx } = idsIn(text, name);
  if (closeIdx === -1) {
    throw new Error(`array ${name} not found in helpCenter.ts`);
  }
  text = insertBefore(text, closeIdx, literals);
}
fill('skills', missingMain.map(skillStub));
fill('bmadSkills', missingBmad.map(skillStub));
fill('commands', missingCmds.map(commandStub));
fs.writeFileSync(HELP, text);

execSync(`npx prettier --write "${HELP}"`, { cwd: path.join(HERE, '..'), stdio: 'inherit' });
console.log(`\n✓ added ${total} entries to helpCenter.ts and prettified`);
