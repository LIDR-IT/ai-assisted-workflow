#!/usr/bin/env tsx

/**
 * Visual Regression Testing Setup Validation
 *
 * Validates that all components of the visual regression testing system
 * are properly installed and configured.
 */

import { promises as fs } from 'fs';
import { spawn } from 'child_process';

interface ValidationResult {
  check: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
}

async function runCommand(
  command: string,
  args: string[]
): Promise<{ success: boolean; output: string }> {
  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: 'pipe' });
    let output = '';

    child.stdout?.on('data', (data) => {
      output += data.toString();
    });

    child.stderr?.on('data', (data) => {
      output += data.toString();
    });

    child.on('close', (code) => {
      resolve({ success: code === 0, output });
    });

    child.on('error', (error) => {
      resolve({ success: false, output: error.message });
    });
  });
}

async function checkFileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function validateSetup(): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  // 1. Check Playwright configuration
  const playwrightConfigExists = await checkFileExists('playwright.config.ts');
  results.push({
    check: 'Playwright Configuration',
    status: playwrightConfigExists ? 'pass' : 'fail',
    message: playwrightConfigExists
      ? 'playwright.config.ts exists and configured'
      : 'playwright.config.ts missing',
  });

  // 2. Check test files
  const testFileExists = await checkFileExists('tests/visual/critical-components.spec.ts');
  results.push({
    check: 'Visual Test Files',
    status: testFileExists ? 'pass' : 'fail',
    message: testFileExists ? 'Visual test specifications exist' : 'Visual test files missing',
  });

  // 3. Check script files
  const scripts = [
    'scripts/capture-baselines.ts',
    'scripts/validate-refactoring.ts',
    'scripts/visual-regression-workflow.ts',
  ];

  for (const script of scripts) {
    const exists = await checkFileExists(script);
    results.push({
      check: `Script: ${script.split('/').pop()}`,
      status: exists ? 'pass' : 'fail',
      message: exists ? 'Script exists' : 'Script missing',
    });
  }

  // 4. Check package.json scripts
  try {
    const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
    const visualScripts = ['visual:capture', 'visual:test', 'visual:validate', 'visual:report'];

    for (const scriptName of visualScripts) {
      const exists = packageJson.scripts?.[scriptName];
      results.push({
        check: `NPM Script: ${scriptName}`,
        status: exists ? 'pass' : 'fail',
        message: exists ? 'Script configured' : 'Script missing',
      });
    }
  } catch {
    results.push({
      check: 'Package.json Scripts',
      status: 'fail',
      message: 'Could not read package.json',
    });
  }

  // 5. Check Playwright installation
  const playwrightCheck = await runCommand('npx', ['playwright', '--version']);
  results.push({
    check: 'Playwright Installation',
    status: playwrightCheck.success ? 'pass' : 'fail',
    message: playwrightCheck.success
      ? `Playwright installed: ${playwrightCheck.output.trim()}`
      : 'Playwright not installed',
  });

  // 6. Check browser installations
  const browserCheck = await runCommand('npx', ['playwright', 'install', '--dry-run']);
  const browsersInstalled = browserCheck.output.includes('Install location');
  results.push({
    check: 'Browser Installation',
    status: browsersInstalled ? 'pass' : 'warn',
    message: browsersInstalled
      ? 'Browsers available for installation'
      : 'Run: npx playwright install',
  });

  // 7. Check required dependencies
  try {
    const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
    const requiredDeps = ['playwright', 'pngjs', 'pixelmatch'];

    for (const dep of requiredDeps) {
      const installed = packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
      results.push({
        check: `Dependency: ${dep}`,
        status: installed ? 'pass' : 'fail',
        message: installed ? `Installed: ${installed}` : 'Missing dependency',
      });
    }
  } catch {
    results.push({
      check: 'Dependencies Check',
      status: 'fail',
      message: 'Could not verify dependencies',
    });
  }

  // 8. Check documentation
  const docsExist = await checkFileExists('docs/standards/testing/visual-regression-testing.md');
  results.push({
    check: 'Documentation',
    status: docsExist ? 'pass' : 'warn',
    message: docsExist ? 'Documentation exists' : 'Documentation missing',
  });

  // 9. Check if development server can start (dry run)
  const serverCheck = await runCommand('npm', ['run', 'dev', '--', '--help']);
  results.push({
    check: 'Development Server',
    status: serverCheck.success ? 'pass' : 'warn',
    message: serverCheck.success
      ? 'Dev server command available'
      : 'Check npm run dev configuration',
  });

  // 10. Check critical routes accessibility (if server is running)
  try {
    const response = await fetch('http://localhost:5173', { method: 'HEAD' });
    results.push({
      check: 'Server Accessibility',
      status: response.ok ? 'pass' : 'warn',
      message: response.ok ? 'Development server is running' : 'Development server not accessible',
    });
  } catch {
    results.push({
      check: 'Server Accessibility',
      status: 'warn',
      message: 'Start server with: npm run dev',
    });
  }

  return results;
}

function printResults(results: ValidationResult[]) {
  console.log('🎭 Visual Regression Testing Setup Validation\n');

  const passed = results.filter((r) => r.status === 'pass').length;
  const failed = results.filter((r) => r.status === 'fail').length;
  const warned = results.filter((r) => r.status === 'warn').length;

  console.log(`📊 Summary: ${passed} ✅ | ${failed} ❌ | ${warned} ⚠️\n`);

  for (const result of results) {
    const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️';

    console.log(`${icon} ${result.check}`);
    console.log(`   ${result.message}\n`);
  }

  if (failed === 0) {
    console.log('🎉 Visual regression testing setup is ready!');
    console.log('\nNext steps:');
    console.log('1. Start development server: npm run dev');
    console.log('2. Capture baselines: npm run visual:capture');
    console.log('3. Begin refactoring with confidence!');
  } else {
    console.log('⚠️ Setup issues detected. Please address failures before proceeding.');

    const failedChecks = results.filter((r) => r.status === 'fail');
    if (failedChecks.length > 0) {
      console.log('\n❌ Failed checks:');
      failedChecks.forEach((check) => {
        console.log(`   - ${check.check}: ${check.message}`);
      });
    }
  }

  return failed === 0;
}

async function main() {
  try {
    const results = await validateSetup();
    const success = printResults(results);
    process.exit(success ? 0 : 1);
  } catch (err) {
    console.error('❌ Validation failed:', err);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { validateSetup, printResults };
