#!/usr/bin/env node

/**
 * CSV parsing utilities for SDLC scripts
 * Used by: import-to-xray.sh, export-from-xray.sh, sync-issues.sh
 * Based on: docs/standards/tool-integrations.md
 */

const fs = require('fs');
const path = require('path');

/**
 * Parse CSV string to array of objects
 * @param {string} csvData - Raw CSV content
 * @param {Object} options - Parsing options
 * @returns {Array<Object>} Parsed rows as objects
 */
function parseCSV(csvData, options = {}) {
    const {
        delimiter = ',',
        quote = '"',
        hasHeaders = true,
        trimWhitespace = true
    } = options;

    const lines = csvData.split('\n').filter(line => line.trim());
    if (lines.length === 0) {
        return [];
    }

    const rows = [];
    const headers = hasHeaders ? parseCSVLine(lines[0], delimiter, quote, trimWhitespace) : null;
    const startIndex = hasHeaders ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
        const values = parseCSVLine(lines[i], delimiter, quote, trimWhitespace);

        if (hasHeaders && headers) {
            const row = {};
            for (let j = 0; j < Math.max(headers.length, values.length); j++) {
                const key = headers[j] || `column_${j + 1}`;
                row[key] = values[j] || '';
            }
            rows.push(row);
        } else {
            rows.push(values);
        }
    }

    return rows;
}

/**
 * Parse a single CSV line handling quotes and delimiters
 * @param {string} line - CSV line to parse
 * @param {string} delimiter - Field delimiter
 * @param {string} quote - Quote character
 * @param {boolean} trim - Whether to trim whitespace
 * @returns {Array<string>} Parsed values
 */
function parseCSVLine(line, delimiter, quote, trim) {
    const values = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
        const char = line[i];

        if (char === quote) {
            if (inQuotes && line[i + 1] === quote) {
                // Escaped quote
                current += quote;
                i += 2;
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
                i++;
            }
        } else if (char === delimiter && !inQuotes) {
            // Field separator
            values.push(trim ? current.trim() : current);
            current = '';
            i++;
        } else {
            // Regular character
            current += char;
            i++;
        }
    }

    // Add the last field
    values.push(trim ? current.trim() : current);
    return values;
}

/**
 * Convert array of objects to CSV string
 * @param {Array<Object>} data - Array of objects to convert
 * @param {Object} options - Export options
 * @returns {string} CSV formatted string
 */
function arrayToCSV(data, options = {}) {
    const {
        delimiter = ',',
        quote = '"',
        includeHeaders = true,
        columns = null
    } = options;

    if (!Array.isArray(data) || data.length === 0) {
        return '';
    }

    // Determine columns from first object or use provided columns
    const headers = columns || Object.keys(data[0]);
    const lines = [];

    // Add headers if requested
    if (includeHeaders) {
        lines.push(headers.map(header => escapeCSVField(header, delimiter, quote)).join(delimiter));
    }

    // Add data rows
    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header] || '';
            return escapeCSVField(String(value), delimiter, quote);
        });
        lines.push(values.join(delimiter));
    }

    return lines.join('\n');
}

/**
 * Escape a field for CSV output
 * @param {string} field - Field value to escape
 * @param {string} delimiter - Field delimiter
 * @param {string} quote - Quote character
 * @returns {string} Escaped field
 */
function escapeCSVField(field, delimiter, quote) {
    // Check if field needs quoting
    if (field.includes(delimiter) || field.includes(quote) || field.includes('\n') || field.includes('\r')) {
        // Escape internal quotes by doubling them
        const escaped = field.replace(new RegExp(quote, 'g'), quote + quote);
        return quote + escaped + quote;
    }
    return field;
}

/**
 * Read and parse CSV file
 * @param {string} filePath - Path to CSV file
 * @param {Object} options - Parsing options
 * @returns {Promise<Array<Object>>} Parsed CSV data
 */
async function readCSV(filePath, options = {}) {
    try {
        const csvData = fs.readFileSync(filePath, 'utf8');
        return parseCSV(csvData, options);
    } catch (error) {
        throw new Error(`Failed to read CSV file ${filePath}: ${error.message}`);
    }
}

/**
 * Write array of objects to CSV file
 * @param {string} filePath - Output file path
 * @param {Array<Object>} data - Data to write
 * @param {Object} options - Export options
 * @returns {Promise<void>}
 */
async function writeCSV(filePath, data, options = {}) {
    try {
        const csvContent = arrayToCSV(data, options);
        const dir = path.dirname(filePath);

        // Ensure directory exists
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(filePath, csvContent, 'utf8');
    } catch (error) {
        throw new Error(`Failed to write CSV file ${filePath}: ${error.message}`);
    }
}

/**
 * Validate CSV structure against expected schema
 * @param {Array<Object>} data - Parsed CSV data
 * @param {Object} schema - Expected schema
 * @returns {Object} Validation result
 */
function validateCSVSchema(data, schema) {
    const errors = [];
    const warnings = [];

    if (!Array.isArray(data) || data.length === 0) {
        errors.push('CSV data is empty or invalid');
        return { valid: false, errors, warnings };
    }

    const firstRow = data[0];
    const actualHeaders = Object.keys(firstRow);
    const expectedHeaders = schema.headers || [];

    // Check for missing required headers
    for (const header of expectedHeaders) {
        if (!actualHeaders.includes(header)) {
            errors.push(`Missing required header: ${header}`);
        }
    }

    // Check for unexpected headers
    for (const header of actualHeaders) {
        if (expectedHeaders.length > 0 && !expectedHeaders.includes(header)) {
            warnings.push(`Unexpected header: ${header}`);
        }
    }

    // Validate row data if schema has field validators
    if (schema.validators) {
        for (let i = 0; i < Math.min(data.length, 100); i++) { // Validate first 100 rows
            const row = data[i];
            for (const [field, validator] of Object.entries(schema.validators)) {
                const value = row[field];
                if (validator.required && !value) {
                    errors.push(`Row ${i + 1}: Missing required field '${field}'`);
                }
                if (value && validator.pattern && !validator.pattern.test(value)) {
                    errors.push(`Row ${i + 1}: Invalid format in field '${field}': ${value}`);
                }
            }
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        rowCount: data.length,
        columnCount: actualHeaders.length
    };
}

/**
 * Transform CSV data using mapping functions
 * @param {Array<Object>} data - Input data
 * @param {Object} mapping - Field mapping configuration
 * @returns {Array<Object>} Transformed data
 */
function transformCSV(data, mapping) {
    return data.map(row => {
        const transformed = {};
        for (const [newField, config] of Object.entries(mapping)) {
            if (typeof config === 'string') {
                // Simple field mapping
                transformed[newField] = row[config] || '';
            } else if (typeof config === 'function') {
                // Function mapping
                transformed[newField] = config(row);
            } else if (config.source) {
                // Complex mapping with default and transformation
                let value = row[config.source] || config.default || '';
                if (config.transform) {
                    value = config.transform(value);
                }
                transformed[newField] = value;
            }
        }
        return transformed;
    });
}

/**
 * Filter CSV data based on criteria
 * @param {Array<Object>} data - Input data
 * @param {Function|Object} criteria - Filter criteria
 * @returns {Array<Object>} Filtered data
 */
function filterCSV(data, criteria) {
    if (typeof criteria === 'function') {
        return data.filter(criteria);
    }

    if (typeof criteria === 'object') {
        return data.filter(row => {
            for (const [field, expected] of Object.entries(criteria)) {
                const actual = row[field];
                if (Array.isArray(expected)) {
                    if (!expected.includes(actual)) return false;
                } else if (expected instanceof RegExp) {
                    if (!expected.test(actual)) return false;
                } else if (actual !== expected) {
                    return false;
                }
            }
            return true;
        });
    }

    return data;
}

/**
 * Group CSV data by field values
 * @param {Array<Object>} data - Input data
 * @param {string|Function} groupBy - Field name or grouping function
 * @returns {Object} Grouped data
 */
function groupCSV(data, groupBy) {
    const groups = {};

    for (const row of data) {
        const key = typeof groupBy === 'function' ? groupBy(row) : row[groupBy];
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(row);
    }

    return groups;
}

/**
 * Log CSV processing information
 * @param {string} message - Log message
 * @param {string} level - Log level
 */
function log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ${level}: ${message}`);
}

// Export all functions
module.exports = {
    parseCSV,
    parseCSVLine,
    arrayToCSV,
    escapeCSVField,
    readCSV,
    writeCSV,
    validateCSVSchema,
    transformCSV,
    filterCSV,
    groupCSV,
    log
};

// CLI usage
if (require.main === module) {
    const command = process.argv[2];
    const inputFile = process.argv[3];
    const outputFile = process.argv[4];

    if (!command || !inputFile) {
        console.log('CSV Parser Utility');
        console.log('Usage: node csv-parser.js <command> <input-file> [output-file]');
        console.log('Commands:');
        console.log('  parse     - Parse CSV and output JSON');
        console.log('  validate  - Validate CSV structure');
        console.log('  convert   - Convert JSON to CSV');
        console.log('  info      - Display CSV information');
        process.exit(1);
    }

    switch (command) {
        case 'parse':
            readCSV(inputFile)
                .then(data => {
                    const output = outputFile || inputFile.replace('.csv', '.json');
                    fs.writeFileSync(output, JSON.stringify(data, null, 2));
                    log(`Parsed ${data.length} rows to ${output}`);
                })
                .catch(error => {
                    log(error.message, 'ERROR');
                    process.exit(1);
                });
            break;

        case 'validate':
            readCSV(inputFile)
                .then(data => {
                    const result = validateCSVSchema(data, { headers: [] });
                    console.log(JSON.stringify(result, null, 2));
                })
                .catch(error => {
                    log(error.message, 'ERROR');
                    process.exit(1);
                });
            break;

        case 'info':
            readCSV(inputFile)
                .then(data => {
                    console.log(`Rows: ${data.length}`);
                    if (data.length > 0) {
                        console.log(`Columns: ${Object.keys(data[0]).join(', ')}`);
                    }
                })
                .catch(error => {
                    log(error.message, 'ERROR');
                    process.exit(1);
                });
            break;

        default:
            log(`Unknown command: ${command}`, 'ERROR');
            process.exit(1);
    }
}