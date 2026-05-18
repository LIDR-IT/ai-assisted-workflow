import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

// Filesystem scanner for actual artifact counts
async function scanFilesystemCounts() {
  const baseDir = process.cwd();

  try {
    const counts = {};

    // Count skills
    const skillsDir = path.join(baseDir, '.claude', 'skills');
    const skillFiles = await fs.readdir(skillsDir);
    const skillDirs = [];
    for (const file of skillFiles) {
      const stat = await fs.stat(path.join(skillsDir, file));
      if (stat.isDirectory()) {
        const skillFile = path.join(skillsDir, file, 'SKILL.md');
        try {
          await fs.access(skillFile);
          skillDirs.push(file);
        } catch {
          // SKILL.md doesn't exist
        }
      }
    }
    counts.skills = skillDirs.length;

    // Count commands
    const commandsDir = path.join(baseDir, '.claude', 'commands');
    const commandFiles = await fs.readdir(commandsDir);
    counts.commands = commandFiles.filter(f => f.endsWith('.md')).length;

    // Count rules
    const rulesDir = path.join(baseDir, '.claude', 'rules');
    const ruleFiles = await fs.readdir(rulesDir);
    counts.rules = ruleFiles.filter(f => f.endsWith('.md')).length;

    // Count docs
    const docsDir = path.join(baseDir, 'docs');
    counts.docs = await countDocsRecursively(docsDir);

    return counts;
  } catch (err) {
    console.error('Error scanning filesystem:', err);
    return null;
  }
}

async function countDocsRecursively(dir) {
  let count = 0;
  try {
    const items = await fs.readdir(dir);
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = await fs.stat(itemPath);
      if (stat.isDirectory()) {
        count += await countDocsRecursively(itemPath);
      } else if (item.endsWith('.md')) {
        count++;
      }
    }
  } catch {
    // Directory might not exist
  }
  return count;
}

async function testComprehensiveIntegrity() {
  console.log('🔍 COMPREHENSIVE ECOSYSTEM INTEGRITY VALIDATION');
  console.log('═'.repeat(80));

  // Phase 1: Filesystem scan
  console.log('\n📁 Phase 1: Scanning filesystem for actual counts...');
  const filesystemCounts = await scanFilesystemCounts();

  if (!filesystemCounts) {
    console.log('❌ Failed to scan filesystem');
    return false;
  }

  console.log('Filesystem counts:', filesystemCounts);

  // Phase 2: Web UI validation
  console.log('\n🌐 Phase 2: Testing web UI components...');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Test Integrity Tests page
    console.log('🚀 Testing IntegrityTests page (/integrity)...');
    await page.goto('http://localhost:5174/integrity', { waitUntil: 'networkidle' });

    // Wait for React to render the integrity tests
    try {
      await page.waitForSelector('text=Integrity Tests', { timeout: 10000 });
      await page.waitForTimeout(3000); // Additional time for all tests to render
      console.log('   ✅ IntegrityTests page loaded successfully');
    } catch {
      console.log('   ⚠️ IntegrityTests page may not have loaded properly');
    }

    const pageText = await page.evaluate(() => document.body.textContent);

    // Show available tests for debugging
    const testMatches = pageText.match(/T\d+/g);
    console.log(`\n🔍 Found tests: ${testMatches ? testMatches.join(', ') : 'None'}`);

    // Critical tests T6 and T29
    console.log('\n🎯 Critical Tests (T6 & T29):');
    console.log('─'.repeat(60));

    // T6: HelpCenter artifact count validation
    const t6Match = pageText.match(/T6[^]*?(?=T7|T[0-9]|$)/);
    let t6Status = 'NOT_FOUND';
    if (t6Match) {
      const t6Text = t6Match[0];
      if (t6Text.includes('PASS')) t6Status = 'PASS';
      else if (t6Text.includes('FAIL')) t6Status = 'FAIL';
      else t6Status = 'UNKNOWN';

      console.log(`T6 (HelpCenter Count): ${t6Status}`);
      if (t6Status === 'FAIL') {
        console.log(`   Details: ${t6Text.substring(0, 200)}...`);
      }
    } else {
      console.log('T6: NOT_FOUND');
    }

    // T29: Stats synchronization
    const t29Match = pageText.match(/T29[^]*?(?=T30|T[0-9]|$)/);
    let t29Status = 'NOT_FOUND';
    if (t29Match) {
      const t29Text = t29Match[0];
      if (t29Text.includes('PASS')) t29Status = 'PASS';
      else if (t29Text.includes('FAIL')) t29Status = 'FAIL';
      else t29Status = 'UNKNOWN';

      console.log(`T29 (Stats Sync): ${t29Status}`);
      if (t29Status === 'FAIL') {
        console.log(`   Details: ${t29Text.substring(0, 200)}...`);
      }
    } else {
      console.log('T29: NOT_FOUND');
    }

    // Test HelpCenter page
    console.log('\n🏠 Testing HelpCenter page (/help)...');
    await page.goto('http://localhost:5174/help', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Extract displayed counts from HelpCenter
    const helpText = await page.evaluate(() => document.body.textContent);
    const skillCountMatch = helpText.match(/(\d+)\s+skills?/i);
    const helpCenterSkillCount = skillCountMatch ? parseInt(skillCountMatch[1]) : null;

    console.log(`HelpCenter displayed skill count: ${helpCenterSkillCount}`);

    // Test SitemapView page
    console.log('\n🗺️  Testing SitemapView page (/sitemap)...');
    await page.goto('http://localhost:5173/sitemap', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await page.evaluate(() => document.body.textContent);

    // Phase 3: Cross-validation
    console.log('\n🔄 Phase 3: Cross-validation analysis...');
    console.log('═'.repeat(80));

    const results = {
      filesystemSkills: filesystemCounts.skills,
      helpCenterSkills: helpCenterSkillCount,
      t6Status,
      t29Status,
      criticalTestsPassing: t6Status === 'PASS' && t29Status === 'PASS',
      countConsistency: filesystemCounts.skills === helpCenterSkillCount
    };

    console.log('📊 VALIDATION SUMMARY:');
    console.log(`   Filesystem Skills: ${results.filesystemSkills}`);
    console.log(`   HelpCenter Skills: ${results.helpCenterSkills}`);
    console.log(`   Count Consistency: ${results.countConsistency ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   T6 (HelpCenter): ${results.t6Status}`);
    console.log(`   T29 (Stats Sync): ${results.t29Status}`);
    console.log(`   Critical Tests: ${results.criticalTestsPassing ? '✅ PASS' : '❌ FAIL'}`);

    // Overall status
    const overallPass = results.criticalTestsPassing && results.countConsistency;

    console.log('\n🎯 OVERALL ECOSYSTEM HEALTH:');
    console.log(`${overallPass ? '✅ HEALTHY' : '❌ CRITICAL ISSUES DETECTED'}`);

    if (!overallPass) {
      console.log('\n⚠️  ISSUES TO RESOLVE:');
      if (!results.countConsistency) {
        console.log(`   • Count mismatch: Filesystem(${results.filesystemSkills}) vs HelpCenter(${results.helpCenterSkills})`);
      }
      if (results.t6Status !== 'PASS') {
        console.log('   • T6 test failing - HelpCenter artifact count validation');
      }
      if (results.t29Status !== 'PASS') {
        console.log('   • T29 test failing - Stats synchronization validation');
      }
    }

    return overallPass;

  } catch (err) {
    console.error('❌ Error during web validation:', err.message);
    console.log('🔧 Ensure the development server is running on http://localhost:5174');
    return false;
  } finally {
    await browser.close();
  }
}

// Run the comprehensive validation
testComprehensiveIntegrity()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });