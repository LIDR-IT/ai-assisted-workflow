#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Review cycle mapping based on document type/location
const REVIEW_CYCLES = {
  'adr': 90,           // Architecture decisions are stable
  'standards': 90,     // Organizational standards
  'guides': 60,        // Documentation guides
  'discovery': 90,     // Historical discovery docs
  'hooks': 90,         // Hook documentation
  'tools': 60,         // Tool documentation
  'audits': 90,        // Audit documentation
  'proposals': 90,     // Proposals are stable once written
  'reference': 60,     // Reference documentation
  'settings': 60       // Settings reference
};

function addDays(dateStr, days) {
  const date = new Date(dateStr + 'T00:00:00.000Z');
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().split('T')[0];
}

function determineReviewCycle(filePath) {
  const pathParts = filePath.split('/');

  if (pathParts.includes('adr')) return REVIEW_CYCLES.adr;
  if (pathParts.includes('standards')) return REVIEW_CYCLES.standards;
  if (pathParts.includes('guides')) return REVIEW_CYCLES.guides;
  if (pathParts.includes('discovery')) return REVIEW_CYCLES.discovery;
  if (pathParts.includes('hooks')) return REVIEW_CYCLES.hooks;
  if (pathParts.includes('tools')) return REVIEW_CYCLES.tools;
  if (pathParts.includes('audits')) return REVIEW_CYCLES.audits;
  if (pathParts.includes('proposals')) return REVIEW_CYCLES.proposals;
  if (pathParts.includes('reference')) return REVIEW_CYCLES.reference;
  if (filePath.includes('settings')) return REVIEW_CYCLES.settings;

  // Default for other docs
  return 60;
}

function determineDocType(filePath) {
  const pathParts = filePath.split('/');

  if (pathParts.includes('adr')) return 'standard';
  if (pathParts.includes('standards')) return 'standard';
  if (pathParts.includes('guides')) return 'standard';
  if (pathParts.includes('discovery')) return 'project';
  if (pathParts.includes('hooks')) return 'standard';
  if (pathParts.includes('tools')) return 'standard';
  if (pathParts.includes('audits')) return 'standard';
  if (pathParts.includes('proposals')) return 'project';
  if (pathParts.includes('reference')) return 'standard';
  if (filePath.includes('settings')) return 'standard';

  return 'standard';
}

function updateFrontmatter(content, filePath) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    console.log(`❌ No frontmatter found in ${filePath}`);
    return content;
  }

  const [, frontmatterContent, bodyContent] = match;
  const lines = frontmatterContent.split('\n');

  // Parse existing frontmatter
  const frontmatter = {};
  let hasReviewCycle = false;

  lines.forEach(line => {
    if (line.includes('review_cycle:')) hasReviewCycle = true;
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      frontmatter[key] = value.replace(/^['"]|['"]$/g, '');
    }
  });

  if (hasReviewCycle) {
    console.log(`⏭️  ${filePath} already has review_cycle`);
    return content;
  }

  const reviewCycle = determineReviewCycle(filePath);
  const docType = determineDocType(filePath);

  // Calculate next_review
  const lastUpdated = frontmatter.last_updated;
  if (!lastUpdated) {
    console.log(`❌ No last_updated found in ${filePath}`);
    return content;
  }

  const nextReview = addDays(lastUpdated, reviewCycle);

  // Rebuild frontmatter with review_cycle added
  const newLines = [];
  let addedReviewCycle = false;

  lines.forEach(line => {
    newLines.push(line);

    // Add type if missing
    if (line.startsWith('status:') && !lines.some(l => l.startsWith('type:'))) {
      newLines.push(`type: ${docType}`);
    }

    // Add review_cycle and next_review after type
    if (line.startsWith('type:') && !addedReviewCycle) {
      newLines.push(`review_cycle: ${reviewCycle}`);
      newLines.push(`next_review: '${nextReview}'`);
      addedReviewCycle = true;
    }

    // Add at end if no type found
    if (line.startsWith('owner_role:') && !addedReviewCycle) {
      newLines.push(`type: ${docType}`);
      newLines.push(`review_cycle: ${reviewCycle}`);
      newLines.push(`next_review: '${nextReview}'`);
      addedReviewCycle = true;
    }
  });

  return `---\n${newLines.join('\n')}\n---\n${bodyContent}`;
}

// Files to process (from the list we identified)
const filesToProcess = [
  'docs/adr/ADR-0001-context-loading-strategy.md',
  'docs/adr/ADR-0004-static-site-architecture.md',
  'docs/adr/ADR-0003-tailwind-css-v4-configuration.md',
  'docs/adr/ADR-0002-react-flow-interactive-diagrams.md',
  'docs/discovery/README.md',
  'docs/settings-reference.md',
  'docs/guides/claude-code/rule-development.md',
  'docs/guides/claude-code/command-development.md',
  'docs/guides/claude-code/README.md',
  'docs/guides/claude-code/agent-development.md',
  'docs/guides/claude-code/mcp-integration.md',
  'docs/guides/claude-code/skill-template-architecture.md',
  'docs/guides/claude-code/hook-development.md',
  'docs/hooks/dtc-session-check.md',
  'docs/hooks/notify-desktop.md',
  'docs/hooks/context-loader.md',
  'docs/hooks/dtc-write-guard.md',
  'docs/hooks/README.md',
  'docs/standards/sprint-commitment.md'
  // Note: excluding discovery docs that might be historical/frozen
];

console.log('🔧 Fixing review_cycle in docs...\n');

let processed = 0;
let skipped = 0;
let errors = 0;

filesToProcess.forEach(filePath => {
  try {
    const fullPath = path.resolve(filePath);

    if (!fs.existsSync(fullPath)) {
      console.log(`❌ File not found: ${filePath}`);
      errors++;
      return;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const updatedContent = updateFrontmatter(content, filePath);

    if (content !== updatedContent) {
      fs.writeFileSync(fullPath, updatedContent);
      console.log(`✅ Updated ${filePath}`);
      processed++;
    } else {
      skipped++;
    }
  } catch (error) {
    console.log(`❌ Error processing ${filePath}: ${error.message}`);
    errors++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`  ✅ Processed: ${processed}`);
console.log(`  ⏭️  Skipped: ${skipped}`);
console.log(`  ❌ Errors: ${errors}`);
console.log(`  📁 Total: ${filesToProcess.length}`);