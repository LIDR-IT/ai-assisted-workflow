#!/usr/bin/env node

/**
 * Validate Xray CSV format before import
 * Usage: node validate-xray-csv.js <csv-file>
 * Based on: docs/standards/tool-integrations.md
 */

const fs = require('fs');

// Expected CSV format: Test Name,Test Type,Gherkin,Priority,Labels,Test Set
const EXPECTED_HEADERS = [
    'Test Name',
    'Test Type',
    'Gherkin',
    'Priority',
    'Labels',
    'Test Set'
];

const VALID_TEST_TYPES = ['Cucumber', 'Manual', 'Generic'];
const VALID_PRIORITIES = ['Highest', 'High', 'Medium', 'Low', 'Lowest'];

function log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ${type}: ${message}`);
}

function error(message) {
    log(message, 'ERROR');
    process.exit(1);
}

function validateInput() {
    if (process.argv.length !== 3) {
        error('Usage: node validate-xray-csv.js <csv-file>');
    }

    const csvFile = process.argv[2];
    if (!fs.existsSync(csvFile)) {
        error(`CSV file not found: ${csvFile}`);
    }

    return csvFile;
}

function parseCSV(content) {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length === 0) {
        error('Empty CSV file');
    }

    // Parse header
    const header = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const rows = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        return { lineNumber: index + 2, values };
    });

    return { header, rows };
}

function validateHeader(header) {
    const errors = [];

    if (header.length !== EXPECTED_HEADERS.length) {
        errors.push(`Expected ${EXPECTED_HEADERS.length} columns, found ${header.length}`);
    }

    for (let i = 0; i < EXPECTED_HEADERS.length; i++) {
        if (header[i] !== EXPECTED_HEADERS[i]) {
            errors.push(`Column ${i + 1}: expected "${EXPECTED_HEADERS[i]}", found "${header[i]}"`);
        }
    }

    return errors;
}

function validateRow(row, lineNumber) {
    const [testName, testType, gherkin, priority, labels, testSet] = row;
    const errors = [];

    // Test Name validation
    if (!testName || testName.length < 3) {
        errors.push(`Line ${lineNumber}: Test Name must be at least 3 characters`);
    }

    // Test Type validation
    if (!VALID_TEST_TYPES.includes(testType)) {
        errors.push(`Line ${lineNumber}: Invalid Test Type "${testType}". Must be one of: ${VALID_TEST_TYPES.join(', ')}`);
    }

    // Gherkin validation (for Cucumber tests)
    if (testType === 'Cucumber') {
        if (!gherkin || !gherkin.includes('Given') || !gherkin.includes('When') || !gherkin.includes('Then')) {
            errors.push(`Line ${lineNumber}: Cucumber tests must have valid Gherkin with Given/When/Then`);
        }

        // Check for proper Gherkin structure
        const gherkinLines = gherkin.split('\\n');
        const hasGiven = gherkinLines.some(line => line.trim().startsWith('Given'));
        const hasWhen = gherkinLines.some(line => line.trim().startsWith('When'));
        const hasThen = gherkinLines.some(line => line.trim().startsWith('Then'));

        if (!hasGiven || !hasWhen || !hasThen) {
            errors.push(`Line ${lineNumber}: Invalid Gherkin structure - missing Given/When/Then steps`);
        }
    }

    // Priority validation
    if (!VALID_PRIORITIES.includes(priority)) {
        errors.push(`Line ${lineNumber}: Invalid Priority "${priority}". Must be one of: ${VALID_PRIORITIES.join(', ')}`);
    }

    // Labels validation
    if (labels) {
        const labelList = labels.split(';');
        labelList.forEach(label => {
            if (label.trim() && !/^[a-zA-Z0-9_-]+$/.test(label.trim())) {
                errors.push(`Line ${lineNumber}: Invalid label format "${label}". Use alphanumeric, underscore, or hyphen only`);
            }
        });
    }

    // Test Set validation
    if (!testSet || testSet.length < 3) {
        errors.push(`Line ${lineNumber}: Test Set must be at least 3 characters`);
    }

    return errors;
}

function generateValidationReport(csvFile, headerErrors, rowErrors, validRows) {
    const report = {
        file: csvFile,
        validation_date: new Date().toISOString(),
        status: (headerErrors.length === 0 && rowErrors.length === 0) ? 'VALID' : 'INVALID',
        summary: {
            total_rows: validRows + rowErrors.length,
            valid_rows: validRows,
            invalid_rows: rowErrors.length,
            header_errors: headerErrors.length
        },
        errors: {
            header: headerErrors,
            rows: rowErrors
        }
    };

    // Save report to file
    const reportFile = `${csvFile.replace(/\.csv$/, '')}-validation-report.json`;
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

    log(`Validation report saved: ${reportFile}`);
    return report;
}

function main() {
    const csvFile = validateInput();

    log(`Validating CSV file: ${csvFile}`);

    // Read and parse CSV
    const content = fs.readFileSync(csvFile, 'utf8');
    const { header, rows } = parseCSV(content);

    // Validate header
    const headerErrors = validateHeader(header);
    if (headerErrors.length > 0) {
        log('Header validation failed:', 'ERROR');
        headerErrors.forEach(err => log(`  ${err}`, 'ERROR'));
    }

    // Validate rows
    const rowErrors = [];
    let validRows = 0;

    rows.forEach(({ lineNumber, values }) => {
        if (values.length !== EXPECTED_HEADERS.length) {
            rowErrors.push(`Line ${lineNumber}: Expected ${EXPECTED_HEADERS.length} columns, found ${values.length}`);
            return;
        }

        const errors = validateRow(values, lineNumber);
        if (errors.length > 0) {
            rowErrors.push(...errors);
        } else {
            validRows++;
        }
    });

    // Generate report
    const report = generateValidationReport(csvFile, headerErrors, rowErrors, validRows);

    // Print summary
    if (report.status === 'VALID') {
        log(`✅ CSV validation PASSED: ${validRows} valid test cases`);
        process.exit(0);
    } else {
        log(`❌ CSV validation FAILED: ${headerErrors.length + rowErrors.length} errors found`);
        if (headerErrors.length > 0) {
            log('Header errors:');
            headerErrors.forEach(err => log(`  - ${err}`));
        }
        if (rowErrors.length > 0 && rowErrors.length <= 10) {
            log('Row errors (first 10):');
            rowErrors.slice(0, 10).forEach(err => log(`  - ${err}`));
        }
        process.exit(1);
    }
}

// Run validation
if (require.main === module) {
    main();
}