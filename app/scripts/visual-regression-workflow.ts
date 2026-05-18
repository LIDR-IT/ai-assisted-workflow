#!/usr/bin/env tsx

/**
 * Visual Regression Testing Workflow
 *
 * Complete automation for visual regression testing workflow:
 * 1. Pre-refactoring: Capture baselines
 * 2. Post-refactoring: Validate changes
 * 3. Report generation and analysis
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';

interface WorkflowOptions {
  mode: 'capture' | 'validate' | 'full-workflow';
  skipBuild?: boolean;
  skipServer?: boolean;
  viewports?: string[];
  browsers?: string[];
}

async function runCommand(
  command: string,
  args: string[],
  cwd: string = process.cwd()
): Promise<boolean> {
  return new Promise((resolve) => {
    console.log(`🔧 Running: ${command} ${args.join(' ')}`);

    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    child.on('close', (code) => {
      resolve(code === 0);
    });

    child.on('error', (error) => {
      console.error(`❌ Command failed: ${error.message}`);
      resolve(false);
    });
  });
}

async function checkServerRunning(url: string = 'http://localhost:5173'): Promise<boolean> {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForServer(
  url: string = 'http://localhost:5173',
  maxWaitTime: number = 60000
): Promise<boolean> {
  const startTime = Date.now();
  const checkInterval = 2000;

  while (Date.now() - startTime < maxWaitTime) {
    if (await checkServerRunning(url)) {
      console.log('✅ Development server is running');
      return true;
    }
    console.log('⏳ Waiting for development server...');
    await new Promise((resolve) => setTimeout(resolve, checkInterval));
  }

  console.error('❌ Development server did not start within timeout');
  return false;
}

async function captureBaselines(options: WorkflowOptions) {
  console.log('🎯 PHASE 1: Capturing baseline screenshots\n');

  // Start dev server if needed
  if (!options.skipServer) {
    if (!(await checkServerRunning())) {
      console.log('🚀 Starting development server...');
      const serverProcess = spawn('npm', ['run', 'dev'], {
        stdio: 'pipe',
        shell: process.platform === 'win32',
      });

      // Wait for server to start
      if (!(await waitForServer())) {
        serverProcess.kill();
        throw new Error('Failed to start development server');
      }
    }
  }

  // Capture baselines
  const success = await runCommand('tsx', ['scripts/capture-baselines.ts']);
  if (!success) {
    throw new Error('Baseline capture failed');
  }

  console.log('✅ Baseline capture completed successfully\n');
}

async function validateRefactoring(options: WorkflowOptions): Promise<boolean> {
  console.log('🔍 PHASE 2: Validating refactoring results\n');

  // Ensure dev server is running
  if (!options.skipServer) {
    if (!(await checkServerRunning())) {
      console.log('🚀 Starting development server for validation...');
      const serverProcess = spawn('npm', ['run', 'dev'], {
        stdio: 'pipe',
        shell: process.platform === 'win32',
      });

      if (!(await waitForServer())) {
        serverProcess.kill();
        throw new Error('Failed to start development server for validation');
      }
    }
  }

  // Run validation
  const success = await runCommand('tsx', ['scripts/validate-refactoring.ts']);
  return success;
}

async function runPlaywrightTests(): Promise<boolean> {
  console.log('🎭 PHASE 3: Running Playwright visual tests\n');

  const success = await runCommand('npx', ['playwright', 'test']);
  if (success) {
    console.log('✅ Playwright tests completed successfully');

    // Generate HTML report
    console.log('📊 Generating visual test report...');
    await runCommand('npx', ['playwright', 'show-report', '--host', '0.0.0.0']);
  }

  return success;
}

async function generateSummaryReport(): Promise<void> {
  console.log('📋 Generating summary report...\n');

  const timestamp = new Date().toISOString();
  const summary = {
    timestamp,
    workflow: 'visual-regression-testing',
    version: '1.0.0',
    phases: {
      baselineCapture: { completed: true },
      validation: { completed: false, success: false },
      playwrightTests: { completed: false, success: false },
    },
    artifacts: {
      baselines: 'tests/baselines/',
      comparisons: 'tests/current/',
      diffs: 'tests/diffs/',
      reports: 'tests/visual-reports/',
    },
    nextSteps: [],
  };

  try {
    // Check if validation report exists
    const validationReportPath = 'tests/visual-comparison-report.json';
    try {
      const validationData = JSON.parse(await fs.readFile(validationReportPath, 'utf8'));
      summary.phases.validation.completed = true;
      summary.phases.validation.success = validationData.summary.failed === 0;

      if (!summary.phases.validation.success) {
        summary.nextSteps.push('Review failed visual tests');
        summary.nextSteps.push('Check diff images for unexpected changes');
        summary.nextSteps.push('Update baselines if changes are intentional');
      }
    } catch {
      summary.nextSteps.push('Run validation phase: npm run visual:validate');
    }

    // Check if Playwright report exists
    try {
      await fs.access('tests/visual-reports/index.html');
      summary.phases.playwrightTests.completed = true;
      summary.phases.playwrightTests.success = true;
    } catch {
      summary.nextSteps.push('Run Playwright tests: npm run visual:test');
    }

    if (summary.phases.validation.success && summary.phases.playwrightTests.success) {
      summary.nextSteps.push('🎉 All visual tests passed - refactoring is safe to proceed');
    }

    await fs.writeFile('tests/visual-workflow-summary.json', JSON.stringify(summary, null, 2));

    console.log('📊 Visual Regression Workflow Summary');
    console.log('=====================================');
    console.log(`Timestamp: ${timestamp}`);
    console.log(`Baseline Capture: ${summary.phases.baselineCapture.completed ? '✅' : '❌'}`);
    console.log(
      `Validation: ${summary.phases.validation.completed ? (summary.phases.validation.success ? '✅' : '❌') : '⏳'}`
    );
    console.log(
      `Playwright Tests: ${summary.phases.playwrightTests.completed ? (summary.phases.playwrightTests.success ? '✅' : '❌') : '⏳'}`
    );

    if (summary.nextSteps.length > 0) {
      console.log('\n📝 Next Steps:');
      summary.nextSteps.forEach((step, i) => console.log(`${i + 1}. ${step}`));
    }
  } catch (error) {
    console.error('❌ Failed to generate summary report:', error);
  }
}

async function fullWorkflow(options: WorkflowOptions): Promise<boolean> {
  console.log('🎯 Starting Complete Visual Regression Workflow\n');

  try {
    // Phase 1: Capture baselines (only if not already done)
    try {
      await fs.access('tests/baselines/manifest.json');
      console.log('📁 Baselines already exist, skipping capture phase\n');
    } catch {
      await captureBaselines(options);
    }

    // Phase 2: Validate refactoring
    const validationSuccess = await validateRefactoring(options);

    // Phase 3: Run Playwright tests
    const playwrightSuccess = await runPlaywrightTests();

    // Generate summary
    await generateSummaryReport();

    const overallSuccess = validationSuccess && playwrightSuccess;

    console.log('\n🏁 Workflow Complete');
    console.log('====================');
    if (overallSuccess) {
      console.log('✅ All visual tests passed - refactoring maintains visual parity');
    } else {
      console.log('❌ Some visual tests failed - review results before proceeding');
    }

    return overallSuccess;
  } catch (error) {
    console.error('❌ Workflow failed:', error);
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const mode = (args[0] as WorkflowOptions['mode']) || 'full-workflow';

  const options: WorkflowOptions = {
    mode,
    skipBuild: args.includes('--skip-build'),
    skipServer: args.includes('--skip-server'),
  };

  console.log('🎭 Visual Regression Testing Workflow');
  console.log('====================================\n');

  try {
    let success = false;

    switch (mode) {
      case 'capture':
        await captureBaselines(options);
        success = true;
        break;

      case 'validate':
        success = await validateRefactoring(options);
        break;

      case 'full-workflow':
        success = await fullWorkflow(options);
        break;

      default:
        console.error('❌ Invalid mode. Use: capture | validate | full-workflow');
        process.exit(1);
    }

    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('❌ Visual regression workflow failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { captureBaselines, validateRefactoring, runPlaywrightTests, fullWorkflow };
