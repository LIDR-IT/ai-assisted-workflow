#!/usr/bin/env node

/**
 * Ecosystem Coherence Validator
 * Validates that all documented counts match actual filesystem reality
 * Prevents documentation drift by checking centralized data against filesystem
 *
 * Usage: node validate-ecosystem-coherence.js [--fix] [--verbose]
 * Based on: docs/standards/tool-integrations.md
 */

const fs = require('fs');
const path = require('path');

/**
 * Log function with timestamp
 * @param {string} message - Message to log
 * @param {string} level - Log level
 */
function log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ${level}: ${message}`);
}

/**
 * Count directories in a path
 * @param {string} dirPath - Directory to count
 * @param {Function} filter - Optional filter function
 * @returns {number} Count of items
 */
function countDirectories(dirPath, filter = () => true) {
    try {
        if (!fs.existsSync(dirPath)) {
            return 0;
        }

        const items = fs.readdirSync(dirPath);
        return items.filter(item => {
            const fullPath = path.join(dirPath, item);
            return fs.statSync(fullPath).isDirectory() && filter(item);
        }).length;
    } catch (error) {
        log(`Error counting directories in ${dirPath}: ${error.message}`, 'ERROR');
        return 0;
    }
}

/**
 * Count files in a path
 * @param {string} dirPath - Directory to count
 * @param {string} extension - File extension to filter by
 * @returns {number} Count of files
 */
function countFiles(dirPath, extension) {
    try {
        if (!fs.existsSync(dirPath)) {
            return 0;
        }

        const items = fs.readdirSync(dirPath);
        return items.filter(item => {
            const fullPath = path.join(dirPath, item);
            return fs.statSync(fullPath).isFile() && item.endsWith(extension);
        }).length;
    } catch (error) {
        log(`Error counting files in ${dirPath}: ${error.message}`, 'ERROR');
        return 0;
    }
}

/**
 * Parse MCP configuration
 * @param {string} mcpJsonPath - Path to .mcp.json
 * @returns {Object} MCP configuration analysis
 */
function analyzeMCPConfig(mcpJsonPath) {
    try {
        if (!fs.existsSync(mcpJsonPath)) {
            return { count: 0, servers: [], error: 'File not found' };
        }

        const content = fs.readFileSync(mcpJsonPath, 'utf8');
        const config = JSON.parse(content);
        const servers = Object.keys(config.mcpServers || {});

        return {
            count: servers.length,
            servers,
            config: config.mcpServers
        };
    } catch (error) {
        return { count: 0, servers: [], error: error.message };
    }
}

/**
 * Extract count from CLAUDE.md
 * @param {string} claudeMdPath - Path to CLAUDE.md
 * @returns {Object} Extracted counts from documentation
 */
function extractDocumentedCounts(claudeMdPath) {
    try {
        if (!fs.existsSync(claudeMdPath)) {
            return {};
        }

        const content = fs.readFileSync(claudeMdPath, 'utf8');
        const counts = {};

        // Extract skills count
        const skillsMatch = content.match(/Skills \((\d+)\)/);
        if (skillsMatch) counts.skills = parseInt(skillsMatch[1]);

        // Extract commands count
        const commandsMatch = content.match(/Commands \((\d+)\)/);
        if (commandsMatch) counts.commands = parseInt(commandsMatch[1]);

        // Extract MCPs count
        const mcpsMatch = content.match(/MCPs \((\d+)\)/);
        if (mcpsMatch) counts.mcps = parseInt(mcpsMatch[1]);

        // Extract rules count
        const rulesMatch = content.match(/Rules \((\d+)\)/);
        if (rulesMatch) counts.rules = parseInt(rulesMatch[1]);

        // Extract hooks count
        const hooksMatch = content.match(/Hooks \((\d+)\)/);
        if (hooksMatch) counts.hooks = parseInt(hooksMatch[1]);

        // Extract agents count
        const agentsMatch = content.match(/Agents \((\d+)\)/);
        if (agentsMatch) counts.agents = parseInt(agentsMatch[1]);

        return counts;
    } catch (error) {
        log(`Error reading CLAUDE.md: ${error.message}`, 'ERROR');
        return {};
    }
}

/**
 * Validate ecosystem coherence
 * @param {string} projectPath - Root project path
 * @returns {Object} Validation results
 */
function validateEcosystemCoherence(projectPath) {
    const results = {
        valid: true,
        warnings: [],
        errors: [],
        findings: {}
    };

    // Count actual filesystem artifacts
    const actualCounts = {
        skills: countDirectories(path.join(projectPath, '.claude/skills'), (name) =>
            !name.startsWith('.') && !name.startsWith('_')  // Exclude hidden and utility directories
        ),
        commands: countFiles(path.join(projectPath, '.claude/commands'), '.md'),
        rules: countFiles(path.join(projectPath, '.claude/rules'), '.md'),
        hooks: countFiles(path.join(projectPath, 'docs/hooks'), '.md') - 1, // Subtract README.md
        agents: countFiles(path.join(projectPath, '.claude/agents'), '.md'),
        mcps: analyzeMCPConfig(path.join(projectPath, '.mcp.json')).count
    };

    // Extract documented counts
    const documentedCounts = extractDocumentedCounts(path.join(projectPath, '.claude/CLAUDE.md'));

    // Analyze MCP configuration
    const mcpAnalysis = analyzeMCPConfig(path.join(projectPath, '.mcp.json'));

    // Store findings
    results.findings = {
        actual: actualCounts,
        documented: documentedCounts,
        mcpServers: mcpAnalysis.servers
    };

    // Compare actual vs documented
    for (const [artifact, actualCount] of Object.entries(actualCounts)) {
        const documentedCount = documentedCounts[artifact];

        if (documentedCount === undefined) {
            results.warnings.push(`No documented count found for ${artifact}`);
        } else if (actualCount !== documentedCount) {
            results.errors.push(
                `${artifact} count mismatch: documented ${documentedCount}, actual ${actualCount}`
            );
            results.valid = false;
        }
    }

    // Validate MCP configuration
    if (mcpAnalysis.error) {
        results.errors.push(`MCP configuration error: ${mcpAnalysis.error}`);
        results.valid = false;
    }

    // Check for automated skills
    const automatedSkillsPath = path.join(projectPath, '.claude/skills');
    let automatedCount = 0;

    if (fs.existsSync(automatedSkillsPath)) {
        try {
            const skillDirs = fs.readdirSync(automatedSkillsPath);

            for (const skillDir of skillDirs) {
                const skillMdPath = path.join(automatedSkillsPath, skillDir, 'SKILL.md');
                if (fs.existsSync(skillMdPath)) {
                    const skillContent = fs.readFileSync(skillMdPath, 'utf8');
                    // Check if skill has Python automation
                    if (skillContent.includes('🤖') || skillContent.includes('automation')) {
                        automatedCount++;
                    }
                }
            }

            results.findings.automatedSkills = automatedCount;

        } catch (error) {
            results.warnings.push(`Error analyzing automated skills: ${error.message}`);
        }
    }

    return results;
}

/**
 * Generate coherence report
 * @param {Object} results - Validation results
 * @param {boolean} verbose - Include detailed findings
 */
function generateReport(results, verbose = false) {
    console.log('\n=== Ecosystem Coherence Validation Report ===\n');

    // Overall status
    console.log(`Overall Status: ${results.valid ? '✅ COHERENT' : '❌ DRIFT DETECTED'}\n`);

    // Errors
    if (results.errors.length > 0) {
        console.log('🔴 ERRORS (must fix):');
        results.errors.forEach(error => console.log(`  - ${error}`));
        console.log();
    }

    // Warnings
    if (results.warnings.length > 0) {
        console.log('🟡 WARNINGS:');
        results.warnings.forEach(warning => console.log(`  - ${warning}`));
        console.log();
    }

    // Detailed findings
    if (verbose) {
        console.log('📊 DETAILED FINDINGS:\n');

        console.log('Filesystem Reality:');
        Object.entries(results.findings.actual).forEach(([key, value]) => {
            console.log(`  ${key}: ${value}`);
        });

        console.log('\nDocumented Counts:');
        Object.entries(results.findings.documented).forEach(([key, value]) => {
            console.log(`  ${key}: ${value}`);
        });

        if (results.findings.mcpServers) {
            console.log('\nConfigured MCPs:');
            results.findings.mcpServers.forEach(server => console.log(`  - ${server}`));
        }

        if (results.findings.automatedSkills !== undefined) {
            console.log(`\nAutomated Skills: ${results.findings.automatedSkills}`);
        }

        console.log();
    }

    // Summary statistics
    const totalActual = Object.values(results.findings.actual).reduce((sum, count) => sum + count, 0);
    const totalDocumented = Object.values(results.findings.documented).reduce((sum, count) => sum + count, 0);

    console.log(`Total Artifacts: ${totalActual} (filesystem) vs ${totalDocumented} (documented)`);
    console.log(`Validation Accuracy: ${results.valid ? '100%' : '< 100%'}`);

    if (!results.valid) {
        console.log('\n💡 RECOMMENDATION: Update CLAUDE.md and centralized data files to match filesystem reality');
        console.log('   Run: scripts/validate-ecosystem-coherence.js --fix (when implemented)');
    }
}

/**
 * Main execution
 */
function main() {
    const args = process.argv.slice(2);
    const fix = args.includes('--fix');
    const verbose = args.includes('--verbose') || args.includes('-v');

    const projectPath = process.cwd();

    log('Starting ecosystem coherence validation...');

    const results = validateEcosystemCoherence(projectPath);

    generateReport(results, verbose);

    if (fix) {
        log('Auto-fix mode not yet implemented', 'WARN');
        log('Manual updates required for now', 'WARN');
    }

    // Exit with error code if validation failed
    process.exit(results.valid ? 0 : 1);
}

// CLI usage
if (require.main === module) {
    main();
}

module.exports = {
    validateEcosystemCoherence,
    countDirectories,
    countFiles,
    analyzeMCPConfig,
    extractDocumentedCounts
};