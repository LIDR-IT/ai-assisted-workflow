#!/usr/bin/env tsx

/**
 * Validates that dynamic stats calculation matches filesystem reality
 * Phase 2 verification: Single Source of Truth Architecture
 */

import { ecosystemStats } from '../src/data/computed/stats';
import { execSync } from 'child_process';

function runCommand(command: string): number {
  try {
    const result = execSync(command, { encoding: 'utf8' }).trim();
    return parseInt(result) || 0;
  } catch (error) {
    console.error(`Command failed: ${command}`, error);
    return 0;
  }
}

// Filesystem verification commands
const verificationCommands = {
  skills: "find .claude/skills -name 'SKILL.md' | wc -l",
  rules: "find .claude/rules -name '*.md' | wc -l",
  hooks: "find .claude/hooks -name '*.sh' | wc -l",
  agents: "find .claude/agents -name '*.md' | wc -l",
  docsSupport: "find docs -name '*.md' | wc -l",
  sharedValidators:
    "find .claude/_shared/validators -name '*.ts' | grep -v index.ts | grep -v types.ts | wc -l",
  skillValidators: "find .claude/skills -name 'validate-examples.ts' | wc -l",
};

console.log('🔍 Validating Dynamic Stats vs Filesystem Reality');
console.log('='.repeat(60));

let allMatch = true;

// Basic counts verification
const verifications = [
  {
    name: 'Skills',
    dynamic: ecosystemStats.skills,
    filesystem: runCommand(verificationCommands.skills),
  },
  {
    name: 'Rules',
    dynamic: ecosystemStats.rules,
    filesystem: runCommand(verificationCommands.rules),
  },
  {
    name: 'Hooks',
    dynamic: ecosystemStats.hooks,
    filesystem: runCommand(verificationCommands.hooks),
  },
  {
    name: 'Agents',
    dynamic: ecosystemStats.agents,
    filesystem: runCommand(verificationCommands.agents),
  },
  {
    name: 'Docs Support',
    dynamic: ecosystemStats.docsSupport,
    filesystem: runCommand(verificationCommands.docsSupport),
  },
];

// Validation scripts verification (computed)
const sharedValidators = runCommand(verificationCommands.sharedValidators);
const skillValidators = runCommand(verificationCommands.skillValidators);
const totalValidationScripts = sharedValidators + skillValidators;

verifications.push({
  name: 'Validation Scripts',
  dynamic: ecosystemStats.validationScripts,
  filesystem: totalValidationScripts,
});

// Print results
verifications.forEach(({ name, dynamic, filesystem }) => {
  const match = dynamic === filesystem;
  const status = match ? '✅' : '❌';

  console.log(
    `${status} ${name.padEnd(20)} Dynamic: ${dynamic.toString().padStart(3)} | Filesystem: ${filesystem.toString().padStart(3)}`
  );

  if (!match) {
    allMatch = false;
    console.log(`   ⚠️  Mismatch detected for ${name}`);
  }
});

console.log('\n' + '='.repeat(60));

// Total artifacts verification
const calculatedTotal =
  ecosystemStats.skills +
  ecosystemStats.commands +
  ecosystemStats.rules +
  ecosystemStats.mcps +
  ecosystemStats.hooks +
  ecosystemStats.agents +
  ecosystemStats.docsSupport +
  ecosystemStats.validationScripts;

console.log(`📊 Total Artifacts: ${calculatedTotal} (computed from dynamic stats)`);
console.log(`📊 ecosystemStats.totalArtifacts: ${ecosystemStats.totalArtifacts}`);

const totalsMatch = calculatedTotal === ecosystemStats.totalArtifacts;
console.log(
  `${totalsMatch ? '✅' : '❌'} Total calculation: ${totalsMatch ? 'MATCH' : 'MISMATCH'}`
);

if (!totalsMatch) {
  allMatch = false;
}

console.log('\n' + '='.repeat(60));

// Summary
if (allMatch) {
  console.log('✅ SUCCESS: All dynamic stats match filesystem reality!');
  console.log('📈 Single Source of Truth architecture working correctly');
  process.exit(0);
} else {
  console.log('❌ FAILURE: Stats drift detected!');
  console.log('🔧 Review dynamic count functions in src/data/computed/stats.ts');
  process.exit(1);
}
