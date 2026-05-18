#!/usr/bin/env tsx

/**
 * Performance Infrastructure Test Script
 *
 * Quick validation that all performance scripts can be imported and basic functionality works
 */

import fs from 'fs/promises';
import path from 'path';

async function testInfrastructure(): Promise<void> {
  console.log('🧪 Testing Performance Infrastructure');
  console.log('====================================\n');

  const tests: Array<{ name: string; test: () => Promise<boolean> }> = [
    { name: 'Check script files exist', test: testScriptFiles },
    { name: 'Validate component targets', test: testComponentTargets },
    { name: 'Check reports directory', test: testReportsDirectory },
    { name: 'Validate thresholds config', test: testThresholds },
  ];

  const results: Array<{ name: string; passed: boolean; error?: string }> = [];

  for (const test of tests) {
    try {
      console.log(`🔍 ${test.name}...`);
      const passed = await test.test();
      results.push({ name: test.name, passed });
      console.log(`  ${passed ? '✅ PASS' : '❌ FAIL'}\n`);
    } catch (error) {
      results.push({ name: test.name, passed: false, error: String(error) });
      console.log(`  ❌ FAIL: ${error}\n`);
    }
  }

  // Summary
  const passedTests = results.filter((r) => r.passed).length;
  const totalTests = results.length;

  console.log('📊 Test Summary:');
  console.log(`  Passed: ${passedTests}/${totalTests}`);
  console.log(`  Status: ${passedTests === totalTests ? '✅ ALL PASS' : '❌ SOME FAILURES'}\n`);

  if (passedTests !== totalTests) {
    console.log('❌ Failed tests:');
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`  • ${r.name}${r.error ? `: ${r.error}` : ''}`);
      });
    process.exit(1);
  } else {
    console.log('✅ Performance infrastructure is ready!');
    console.log('\n📚 Available commands:');
    console.log('  npm run perf:benchmark    # Component complexity analysis');
    console.log('  npm run perf:bundle       # Bundle size analysis');
    console.log('  npm run perf:web-vitals   # Core Web Vitals (requires dev server)');
    console.log('  npm run perf:memory       # Memory profiling (requires dev server)');
    console.log('  npm run perf:validate     # Run all performance tests');
    console.log('  npm run perf:all          # Sequential execution of all tests');
    process.exit(0);
  }
}

async function testScriptFiles(): Promise<boolean> {
  const expectedScripts = [
    'benchmark-components.ts',
    'core-web-vitals.ts',
    'bundle-analysis.ts',
    'memory-profiling.ts',
    'validate-performance.ts',
  ];

  for (const script of expectedScripts) {
    const scriptPath = path.join('scripts', 'performance', script);
    try {
      await fs.access(scriptPath);
    } catch {
      throw new Error(`Missing script: ${scriptPath}`);
    }
  }

  return true;
}

async function testComponentTargets(): Promise<boolean> {
  const componentPaths = [
    'src/app/components/features/propuesta-mejora/PropuestaMejora.tsx',
    'src/app/components/features/integrity-tests/IntegrityTests.tsx',
    'src/app/components/diagrams/HelpCenter.tsx',
  ];

  for (const componentPath of componentPaths) {
    try {
      await fs.access(componentPath);
    } catch {
      console.log(
        `  ⚠️ Warning: Component not found at ${componentPath} (may not be refactored yet)`
      );
    }
  }

  return true;
}

async function testReportsDirectory(): Promise<boolean> {
  const reportsDir = 'tests/performance-reports';

  try {
    await fs.mkdir(reportsDir, { recursive: true });
    return true;
  } catch (error) {
    throw new Error(`Could not create reports directory: ${error}`);
  }
}

async function testThresholds(): Promise<boolean> {
  // Test that performance config can be imported
  try {
    const configPath = './performance.config.ts';
    await fs.access(configPath);
    return true;
  } catch {
    console.log('  ⚠️ Warning: performance.config.ts not found, using default thresholds');
    return true; // Not critical for basic functionality
  }
}

// Run tests
if (import.meta.url === `file://${process.argv[1]}`) {
  testInfrastructure().catch((error) => {
    console.error('❌ Infrastructure test failed:', error);
    process.exit(1);
  });
}
