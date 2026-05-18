#!/usr/bin/env node

/**
 * Common API utilities for script integration
 * Used by: import-to-xray.sh, export-from-xray.sh, sync-issues.sh
 * Based on: docs/standards/tool-integrations.md
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

/**
 * Make HTTP request with proper error handling
 * @param {string} url - Request URL
 * @param {Object} options - Request options
 * @param {string} data - Request body data
 * @returns {Promise<Object>} Response object
 */
function makeRequest(url, options = {}, data = null) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const requestModule = urlObj.protocol === 'https:' ? https : http;

        const requestOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'SDLC-Scripts/1.0',
                ...options.headers
            },
            timeout: options.timeout || 30000
        };

        if (data) {
            requestOptions.headers['Content-Length'] = Buffer.byteLength(data);
        }

        const req = requestModule.request(requestOptions, (res) => {
            let body = '';

            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                const response = {
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: body,
                    json: null
                };

                // Try to parse JSON
                if (body) {
                    try {
                        response.json = JSON.parse(body);
                    } catch {
                        // Not JSON, leave as string
                    }
                }

                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(response);
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${body}`));
                }
            });
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        if (data) {
            req.write(data);
        }

        req.end();
    });
}

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} baseDelay - Base delay in ms
 * @returns {Promise<any>} Function result
 */
async function retry(fn, maxRetries = 3, baseDelay = 1000) {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            if (attempt === maxRetries) {
                throw lastError;
            }

            // Exponential backoff with jitter
            const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

/**
 * Basic auth header generator
 * @param {string} username - Username
 * @param {string} password - Password or token
 * @returns {string} Authorization header value
 */
function basicAuth(username, password) {
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    return `Basic ${credentials}`;
}

/**
 * Bearer token header generator
 * @param {string} token - Bearer token
 * @returns {string} Authorization header value
 */
function bearerAuth(token) {
    return `Bearer ${token}`;
}

/**
 * Rate limiter class
 */
class RateLimiter {
    constructor(maxRequests = 10, windowMs = 1000) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = [];
    }

    async wait() {
        const now = Date.now();

        // Remove old requests outside the window
        this.requests = this.requests.filter(time => now - time < this.windowMs);

        // If we've hit the limit, wait
        if (this.requests.length >= this.maxRequests) {
            const oldestRequest = Math.min(...this.requests);
            const waitTime = this.windowMs - (now - oldestRequest) + 10; // 10ms buffer

            if (waitTime > 0) {
                await new Promise(resolve => setTimeout(resolve, waitTime));
                return this.wait(); // Recursively check again
            }
        }

        // Add current request
        this.requests.push(now);
    }
}

/**
 * Pagination helper
 * @param {Function} requestFn - Function that makes paginated requests
 * @param {Object} options - Pagination options
 * @returns {AsyncGenerator} Generator that yields pages
 */
async function* paginate(requestFn, options = {}) {
    let page = options.startPage || 1;
    let hasMore = true;
    const maxPages = options.maxPages || 100;

    while (hasMore && page <= maxPages) {
        const response = await requestFn(page, options.pageSize || 50);

        yield response;

        // Check if there are more pages (implementation depends on API)
        hasMore = response.json && (
            (response.json.hasNext) ||
            (response.json.total && page * (options.pageSize || 50) < response.json.total) ||
            (Array.isArray(response.json) && response.json.length === (options.pageSize || 50))
        );

        page++;
    }
}

/**
 * Environment variable validator
 * @param {Array<string>} requiredVars - Required environment variables
 * @throws {Error} If any required variables are missing
 */
function validateEnvironment(requiredVars) {
    const missing = requiredVars.filter(varName => !process.env[varName]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}

/**
 * Safe JSON parse with default value
 * @param {string} jsonString - JSON string to parse
 * @param {any} defaultValue - Default value if parsing fails
 * @returns {any} Parsed JSON or default value
 */
function safeJsonParse(jsonString, defaultValue = null) {
    try {
        return JSON.parse(jsonString);
    } catch {
        return defaultValue;
    }
}

/**
 * Format date to ISO string
 * @param {Date|string|number} date - Date to format
 * @returns {string} ISO formatted date
 */
function formatDate(date) {
    return new Date(date).toISOString();
}

/**
 * Log function with timestamp
 * @param {string} message - Message to log
 * @param {string} level - Log level
 */
function log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ${level}: ${message}`);
}

// Export all utilities
module.exports = {
    makeRequest,
    retry,
    basicAuth,
    bearerAuth,
    RateLimiter,
    paginate,
    validateEnvironment,
    safeJsonParse,
    formatDate,
    log
};

// CLI usage
if (require.main === module) {
    console.log('API Helpers utility module');
    console.log('Available functions:', Object.keys(module.exports).join(', '));
}