/**
 * Ecosystem Coherence — regression guard
 *
 * Codifies the 2026-06-11 A/B/C coherence audit so its 53 findings cannot recur.
 * Runs in CI via `test:coverage` (test-coverage.yml) → blocks PRs on regression.
 *
 * Each block answers "what would silently break if someone edits the ecosystem?"
 * and fails with the exact offenders. When you ADD an artifact and a test goes red,
 * the message tells you precisely which reference/count/contract to update.
 *
 * Source of truth = the `.agents/` filesystem (read directly, not the app registry).
 */
import { describe, it, expect } from 'vitest';
import { parse as parseYaml } from 'yaml';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { commands as appCommands } from '@/data/artifacts/commands';
import { skills as appSkills } from '@/data/artifacts/skills';

const HERE = path.dirname(fileURLToPath(import.meta.url)); // app/src/__tests__
const REPO = path.resolve(HERE, '../../..'); // repo root
const AGENTS = path.join(REPO, '.agents');

// ── helpers ──────────────────────────────────────────────────────────────────
const read = (p: string) => fs.readFileSync(p, 'utf8');
const exists = (p: string) => fs.existsSync(p);
const lsDirs = (p: string) =>
  exists(p)
    ? fs
        .readdirSync(p, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
    : [];
const lsMd = (p: string) => (exists(p) ? fs.readdirSync(p).filter((f) => f.endsWith('.md')) : []);

function frontmatter(content: string): string | null {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  return m ? (m[1] ?? null) : null;
}
function walk(dir: string, filter: (f: string) => boolean): string[] {
  if (!exists(dir)) {
    return [];
  }
  const out: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...walk(full, filter));
    } else if (filter(e.name)) {
      out.push(full);
    }
  }
  return out;
}

// ── ground truth from the filesystem ───────────────────────────────────────────
const skillDirs = lsDirs(path.join(AGENTS, 'skills')).filter((d) =>
  exists(path.join(AGENTS, 'skills', d, 'SKILL.md'))
);
const lidrSkills = skillDirs.filter((d) => d.startsWith('lidr-'));
const commandFiles = lsMd(path.join(AGENTS, 'commands'));
const commandIds = commandFiles.map((f) => f.replace(/\.md$/, ''));
const subagentFiles = lsMd(path.join(AGENTS, 'subagents'));
const ruleFiles = walk(path.join(AGENTS, 'rules'), (f) => f.endsWith('.md') && f !== 'README.md');
const hookScripts = exists(path.join(AGENTS, 'hooks/scripts'))
  ? fs.readdirSync(path.join(AGENTS, 'hooks/scripts')).filter((f) => f.endsWith('.sh'))
  : [];
const realSkillSet = new Set(skillDirs);
const realCommandSet = new Set(commandIds);

// command/subagent bodies (where the audit found ~250 stale refs)
const bodyFiles = [
  ...commandFiles.map((f) => path.join(AGENTS, 'commands', f)),
  ...subagentFiles.map((f) => path.join(AGENTS, 'subagents', f)),
];

// ──────────────────────────────────────────────────────────────────────────────
describe('ecosystem counts are internally consistent (filesystem ↔ CLAUDE.md)', () => {
  const claude = read(path.join(REPO, 'CLAUDE.md'));
  const claimed = (re: RegExp) => {
    const m = claude.match(re);
    return m && m[1] ? parseInt(m[1], 10) : null;
  };
  it('skills: filesystem count matches the number CLAUDE.md advertises', () => {
    expect(skillDirs.length).toBe(claimed(/\*\*(\d+)\s+skills?\*\*/i));
  });
  it('commands: filesystem count matches CLAUDE.md', () => {
    expect(commandFiles.length).toBe(claimed(/\*\*(\d+)\s+commands?\*\*/i));
  });
  it('rules: filesystem count matches CLAUDE.md', () => {
    expect(ruleFiles.length).toBe(claimed(/\*\*(\d+)\s+rules?\*\*/i));
  });
  it('subagents: filesystem count matches CLAUDE.md', () => {
    expect(subagentFiles.length).toBe(claimed(/\*\*(\d+)\s+subagents?\*\*/i));
  });
  it('hooks: 6 scripts present', () => {
    expect(hookScripts.length).toBe(6);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
describe('no dead artifact names survive in command/subagent bodies', () => {
  // skills/commands/hooks that were renamed or removed in the BMad+LIDR unification
  const DEAD_SKILLS = [
    'test-plan',
    'regression-suite',
    'epic-breakdown',
    'epic-review',
    'architecture-doc',
    'prd-tecnico',
    'prd-funcional',
    'ux-design-spec',
    'bdd-patterns',
    'skill-development',
    'implementation-phases',
  ];
  const DEAD_HOOKS = ['dtc-write-guard', 'dtc-session-check', 'notify-desktop', 'context-loader'];

  it.each(bodyFiles)('%s has no dead skill names', (file) => {
    const content = read(file);
    const hits = DEAD_SKILLS.filter((name) =>
      // match the dead name as a skill reference, not incidental prose:
      // `skills/test-plan`, `Skill(test-plan)`, backtick/quote `test-plan`, or skill: test-plan
      new RegExp(`(skills?/|Skill\\(|[\`'"]|skill:\\s*)${name}\\b`).test(content)
    );
    expect(hits, `${path.basename(file)} references removed skills: ${hits.join(', ')}`).toEqual(
      []
    );
  });

  it.each(bodyFiles)('%s references no fictional hooks', (file) => {
    const content = read(file);
    const hits = DEAD_HOOKS.filter((h) => new RegExp(`\\b${h}\\b`).test(content));
    expect(hits, `${path.basename(file)} names hooks that don't exist: ${hits.join(', ')}`).toEqual(
      []
    );
  });
});

// ──────────────────────────────────────────────────────────────────────────────
describe('no unprefixed legacy slash commands in command/subagent bodies', () => {
  // every real command is /lidr-* (plus sync-setup, test-hooks). These bare names are dead.
  const LEGACY = [
    'advance-gate',
    'implement-ticket',
    'prepare-testing',
    'validate-requirements',
    'validate-prd',
    'init-project-docs',
    'validate-project-docs',
    'create-release-notes',
    'create-branch',
    'create-pr',
    'quick-spec',
    'update-changelog',
    'sync-docs',
    'sprint-health',
    'enrich-ticket',
    'create-ticket',
    'improve-docs',
    'implement-ticket',
    'course-correct',
    'quick-dev',
  ];
  it.each(bodyFiles)('%s uses no bare /command (must be /lidr-*)', (file) => {
    const content = read(file);
    const hits = LEGACY.filter((c) => new RegExp(`/${c}(?![\\w-])`).test(content));
    expect(
      hits,
      `${path.basename(file)} uses unprefixed slash commands: ${hits.map((c) => '/' + c).join(', ')}`
    ).toEqual([]);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
describe('@ cross-references in command/subagent bodies resolve to real files', () => {
  it.each(bodyFiles)('%s @../rules|skills references all exist', (file) => {
    const content = read(file);
    const refs = content.match(/@\.\.\/(rules|skills)\/[\w\-/.]+\.md/g) || [];
    const broken = refs.filter((ref) => {
      const rel = ref.slice(1); // strip @  →  ../rules/...
      return !exists(path.join(AGENTS, rel.replace(/^\.\.\//, '')));
    });
    expect(broken, `${path.basename(file)} has broken @-refs: ${broken.join(', ')}`).toEqual([]);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
describe('every skill + command frontmatter is valid YAML', () => {
  const allMd = [
    ...skillDirs.map((d) => path.join(AGENTS, 'skills', d, 'SKILL.md')),
    ...commandFiles.map((f) => path.join(AGENTS, 'commands', f)),
  ];
  // `argument-hint: [x] [y]` is the documented Claude Code arg-hint convention
  // (lenient YAML the platforms accept). Normalize it to a quoted string before
  // strict-parsing so the test still catches REAL breakage (e.g. unescaped quotes
  // inside a double-quoted description) without false-positiving on the convention.
  const normalize = (fm: string) =>
    fm.replace(/^(argument-hint:\s*)(.+)$/gm, (_m, k) => `${k}"<hint>"`);
  it.each(allMd)('%s frontmatter parses', (file) => {
    const fm = frontmatter(read(file));
    expect(fm, `${file} has no frontmatter`).not.toBeNull();
    expect(
      () => parseYaml(normalize(fm as string)),
      `${path.basename(file)} frontmatter is not valid YAML`
    ).not.toThrow();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
describe('lidr-* skills declare a valid unified phase + stage', () => {
  const VALID_STAGES = new Set([
    'context',
    'anytime',
    'analysis',
    'planning',
    'specification',
    'sprint-planning',
    'development',
    'qa',
    'security',
    'release',
  ]);
  it.each(lidrSkills)('%s has phase 0-4 and a valid stage', (skill) => {
    const fm = frontmatter(read(path.join(AGENTS, 'skills', skill, 'SKILL.md')));
    const meta = parseYaml(fm as string) as { phase?: unknown; stage?: unknown };
    expect(typeof meta.phase, `${skill} missing numeric phase`).toBe('number');
    expect(meta.phase as number, `${skill} phase out of 0-4`).toBeGreaterThanOrEqual(0);
    expect(meta.phase as number, `${skill} phase out of 0-4`).toBeLessThanOrEqual(4);
    expect(VALID_STAGES.has(String(meta.stage)), `${skill} stage "${meta.stage}" invalid`).toBe(
      true
    );
  });
});

// ──────────────────────────────────────────────────────────────────────────────
describe('gate-evidence.yaml contract is satisfiable', () => {
  const gePath = path.join(AGENTS, '_shared/lidr/gate-evidence.yaml');
  const ge = parseYaml(read(gePath)) as {
    gates: Record<string, { bmad_evidence?: any[]; lidr_evidence?: any[] }>;
  };

  it('parses and defines G0-G7', () => {
    expect(Object.keys(ge.gates).sort()).toEqual(['G0', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7']);
  });

  it('every referenced producer is a real skill or command', () => {
    const missing: string[] = [];
    for (const [gate, def] of Object.entries(ge.gates)) {
      for (const e of [...(def.bmad_evidence || []), ...(def.lidr_evidence || [])]) {
        const name = e.skill || e.command;
        if (!name) {
          continue;
        }
        if (!realSkillSet.has(name) && !realCommandSet.has(name)) {
          missing.push(`${gate}: ${name}`);
        }
      }
    }
    expect(
      missing,
      `gate-evidence references non-existent producers: ${missing.join(' | ')}`
    ).toEqual([]);
  });

  it('every gate has at least one required producer', () => {
    const empty: string[] = [];
    for (const [gate, def] of Object.entries(ge.gates)) {
      const all = [...(def.bmad_evidence || []), ...(def.lidr_evidence || [])];
      if (!all.some((e) => e.required === true)) {
        empty.push(gate);
      }
    }
    // G6/G7 may be governance-only; document expected exceptions explicitly
    expect(
      empty,
      `gates with no required evidence (verify intentional): ${empty.join(', ')}`
    ).toEqual([]);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
describe('no fictional hooks are claimed anywhere in rules', () => {
  const DEAD_HOOKS = ['dtc-write-guard', 'dtc-session-check', 'notify-desktop', 'context-loader'];
  it.each(ruleFiles)('%s has no fictional hook references', (file) => {
    const content = read(file);
    // allow historical/changelog mention only if the line says "removed"/"renamed"/"obsolet"
    const hits = DEAD_HOOKS.filter((h) =>
      content
        .split('\n')
        .some(
          (line) =>
            new RegExp(`\\b${h}\\b`).test(line) && !/remov|renam|obsolet|former|→|->/.test(line)
        )
    );
    expect(
      hits,
      `${path.relative(AGENTS, file)} names fictional hooks as current: ${hits.join(', ')}`
    ).toEqual([]);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// App registries must not advertise artifacts that don't exist on disk ("UI lies").
// The audit found phantom commands (product-brief, help-as-command, validate-
// requirements-cmd) and an under-count (26-vs-30) here that no test caught.
describe('app artifact registries match the .agents/ filesystem', () => {
  it('every command in artifacts/commands.ts exists on disk', () => {
    const phantom = appCommands.filter((c) => !exists(path.join(AGENTS, 'commands', `${c.id}.md`)));
    expect(
      phantom.map((c) => c.id),
      `commands.ts advertises non-existent commands: ${phantom.map((c) => c.id).join(', ')}`
    ).toEqual([]);
  });

  it('commands.ts count matches the filesystem (no silent under-report)', () => {
    expect(
      appCommands.length,
      `commands.ts lists ${appCommands.length} but .agents/commands has ${commandFiles.length}`
    ).toBe(commandFiles.length);
  });

  it('every skill in artifacts/skills.ts exists on disk', () => {
    const phantom = appSkills.filter((s) => !realSkillSet.has(s.id));
    expect(
      phantom.map((s) => s.id),
      `skills.ts advertises non-existent skills: ${phantom.map((s) => s.id).join(', ')}`
    ).toEqual([]);
  });

  it('skills.ts count matches the filesystem', () => {
    expect(
      appSkills.length,
      `skills.ts lists ${appSkills.length} but .agents/skills has ${skillDirs.length}`
    ).toBe(skillDirs.length);
  });
  // Note: docPath resolution (dead links) is covered by the integrity suite (t1/t2).
});

// ──────────────────────────────────────────────────────────────────────────────
// Shared-template references must resolve. The audit found legacy LIDR document
// templates (prd-funcional, architecture, …) that BMad now owns; when one is
// removed, every body that still cites it must be updated or the link dies.
describe('_shared/lidr/templates references resolve to real files', () => {
  const templateBodies = [
    ...bodyFiles,
    ...ruleFiles,
    ...skillDirs.map((d) => path.join(AGENTS, 'skills', d, 'SKILL.md')),
  ];
  it.each(templateBodies)('%s cites no removed shared template', (file) => {
    const content = read(file);
    const refs = content.match(/_shared\/lidr\/templates\/[\w/-]+\.md/g) || [];
    const broken = [...new Set(refs)].filter(
      (ref) => !exists(path.join(AGENTS, ref.replace(/^.*?_shared/, '_shared')))
    );
    expect(
      broken,
      `${path.relative(AGENTS, file)} references removed templates: ${broken.join(', ')}`
    ).toEqual([]);
  });
});
