# Performance Optimization for MCP Systems

A comprehensive guide to optimizing MCP server and client performance across all platforms, covering bottleneck identification, server startup optimization, connection management, caching strategies, and monitoring techniques.

## Table of Contents

- [Overview](#overview)
- [Performance Fundamentals](#performance-fundamentals)
- [Server Startup Optimization](#server-startup-optimization)
- [Tool Execution Performance](#tool-execution-performance)
- [Connection and Transport Optimization](#connection-and-transport-optimization)
- [Caching Strategies](#caching-strategies)
- [Timeout Configuration](#timeout-configuration)
- [Memory Management](#memory-management)
- [Network Optimization](#network-optimization)
- [Batch Operations](#batch-operations)
- [Monitoring and Profiling](#monitoring-and-profiling)
- [Platform-Specific Performance](#platform-specific-performance)
- [Performance Benchmarks](#performance-benchmarks)
- [Best Practices Summary](#best-practices-summary)

---

## Overview

Performance optimization in MCP systems is critical for providing responsive AI experiences. Poor performance manifests as:

- **Slow server initialization** delaying AI assistant startup
- **High latency tool execution** frustrating users
- **Memory leaks** causing system instability
- **Network timeouts** breaking workflows
- **Resource exhaustion** limiting scalability

This guide provides actionable strategies to optimize every aspect of MCP performance.

### Performance Goals

**Target Metrics:**
- Server initialization: < 2 seconds
- Tool execution (simple): < 500ms
- Tool execution (complex): < 5 seconds
- Memory footprint: < 100MB idle, < 500MB under load
- Network latency: < 100ms (local), < 300ms (remote)
- Connection establishment: < 1 second

---

## Performance Fundamentals

### Understanding MCP Performance Bottlenecks

MCP systems can experience bottlenecks at multiple points:

```
┌─────────────────────────────────────────────────────┐
│                 MCP Performance Stack               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Application Layer                                  │
│  ├─ AI Model Processing          [High impact]     │
│  ├─ Context Window Management    [High impact]     │
│  └─ Response Generation          [Medium impact]   │
│                                                     │
│  MCP Protocol Layer                                 │
│  ├─ Server Initialization        [Medium impact]   │
│  ├─ Tool Discovery               [Low impact]      │
│  ├─ Tool Execution               [High impact]     │
│  └─ Response Serialization       [Low impact]      │
│                                                     │
│  Transport Layer                                    │
│  ├─ Connection Establishment     [Medium impact]   │
│  ├─ Message Framing              [Low impact]      │
│  └─ Network Transmission         [High impact]     │
│                                                     │
│  External Services                                  │
│  ├─ API Rate Limits              [High impact]     │
│  ├─ Database Queries             [High impact]     │
│  └─ File System Operations       [Medium impact]   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Performance Profiling Strategy

**1. Identify the bottleneck:**
```typescript
// Add timing measurements
const start = performance.now();
const result = await operation();
const duration = performance.now() - start;
console.error(`Operation took ${duration.toFixed(2)}ms`);
```

**2. Profile systematically:**
```typescript
class PerformanceTracker {
  private timings: Map<string, number[]> = new Map();

  track<T>(name: string, fn: () => Promise<T>): Promise<T> {
    return this.measure(name, fn);
  }

  private async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      return await fn();
    } finally {
      const duration = performance.now() - start;
      if (!this.timings.has(name)) {
        this.timings.set(name, []);
      }
      this.timings.get(name)!.push(duration);
    }
  }

  report(): void {
    for (const [name, durations] of this.timings) {
      const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
      const max = Math.max(...durations);
      const min = Math.min(...durations);
      console.error(`${name}: avg=${avg.toFixed(2)}ms, min=${min.toFixed(2)}ms, max=${max.toFixed(2)}ms`);
    }
  }
}
```

**3. Measure before and after:**
- Establish baseline metrics
- Apply optimization
- Compare results
- Iterate

---

## Server Startup Optimization

Server initialization is the first performance touchpoint. Slow startup delays AI assistant availability.

### Lazy Initialization

**Problem:** Loading all resources upfront delays startup.

**Solution:** Initialize only essential components immediately, defer the rest.

```typescript
// ❌ Poor: Initialize everything upfront
class MCPServer {
  private database: Database;
  private cache: Cache;
  private apis: Map<string, APIClient>;

  constructor() {
    // Blocks startup
    this.database = new Database(process.env.DB_URL);
    this.cache = new Cache({ maxSize: 1000 });
    this.apis = this.initializeAllAPIs(); // Slow!
  }
}

// ✅ Good: Lazy initialization
class MCPServer {
  private database?: Database;
  private cache?: Cache;
  private apis: Map<string, APIClient> = new Map();

  async getDatabase(): Promise<Database> {
    if (!this.database) {
      this.database = await Database.connect(process.env.DB_URL);
    }
    return this.database;
  }

  getCache(): Cache {
    if (!this.cache) {
      this.cache = new Cache({ maxSize: 1000 });
    }
    return this.cache;
  }

  async getAPI(name: string): Promise<APIClient> {
    if (!this.apis.has(name)) {
      const api = await this.initializeAPI(name);
      this.apis.set(name, api);
    }
    return this.apis.get(name)!;
  }
}
```

### Parallel Initialization

**Problem:** Sequential initialization of independent resources wastes time.

**Solution:** Initialize resources in parallel.

```typescript
// ❌ Poor: Sequential initialization
async function initialize() {
  const config = await loadConfig();       // 100ms
  const database = await connectDB();      // 500ms
  const cache = await setupCache();        // 200ms
  const api = await initializeAPI();       // 300ms
  // Total: 1100ms
  return { config, database, cache, api };
}

// ✅ Good: Parallel initialization
async function initialize() {
  const [config, database, cache, api] = await Promise.all([
    loadConfig(),       // 100ms
    connectDB(),        // 500ms
    setupCache(),       // 200ms
    initializeAPI(),    // 300ms
  ]);
  // Total: 500ms (max of all)
  return { config, database, cache, api };
}
```

### Minimize Import Overhead

**Problem:** Large dependency trees slow module loading.

**Solution:** Use dynamic imports for heavy dependencies.

```typescript
// ❌ Poor: Import heavy dependency at module level
import { HeavyLibrary } from 'heavy-library'; // 200ms load time

export async function toolHandler() {
  return HeavyLibrary.process();
}

// ✅ Good: Dynamic import
export async function toolHandler() {
  const { HeavyLibrary } = await import('heavy-library');
  return HeavyLibrary.process();
}
```

### Connection Pooling for Databases

**Problem:** Creating database connections on every tool call is expensive.

**Solution:** Use connection pooling.

```typescript
// ❌ Poor: New connection per tool call
async function queryDatabase(query: string) {
  const connection = await createConnection(DB_URL); // 500ms
  const result = await connection.query(query);      // 100ms
  await connection.close();
  return result;
  // Total: 600ms per call
}

// ✅ Good: Connection pool
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: DB_URL,
  max: 10,           // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function queryDatabase(query: string) {
  const result = await pool.query(query); // 100ms (connection reused)
  return result;
}
```

---

## Tool Execution Performance

Tool execution is the most frequent operation and directly impacts user experience.

### Input Validation Performance

**Problem:** Complex validation can add significant overhead.

**Solution:** Optimize validation with caching and early exits.

```typescript
import { z } from 'zod';

// Create schema once (outside handler)
const CreateIssueSchema = z.object({
  repository: z.string().regex(/^[\w-]+\/[\w-]+$/),
  title: z.string().min(1).max(256),
  body: z.string().optional(),
});

// Cache compiled regex patterns
const REPO_PATTERN = /^[\w-]+\/[\w-]+$/;

// ✅ Optimized validation
function validateInput(input: unknown) {
  // Fast path: type check first
  if (typeof input !== 'object' || input === null) {
    throw new Error('Input must be an object');
  }

  const data = input as any;

  // Early exit on missing required fields
  if (!data.repository || !data.title) {
    throw new Error('Missing required fields: repository, title');
  }

  // Validate with cached patterns
  if (!REPO_PATTERN.test(data.repository)) {
    throw new Error('Invalid repository format');
  }

  // Full validation only if needed
  return CreateIssueSchema.parse(input);
}
```

### API Call Batching

**Problem:** Multiple sequential API calls have compounding latency.

**Solution:** Batch API calls when possible.

```typescript
// ❌ Poor: Sequential API calls
async function getIssuesWithComments(issueIds: number[]) {
  const results = [];
  for (const id of issueIds) {
    const issue = await api.getIssue(id);           // 100ms each
    const comments = await api.getComments(id);     // 100ms each
    results.push({ issue, comments });
  }
  return results;
  // Total: 200ms × n
}

// ✅ Good: Batch API calls
async function getIssuesWithComments(issueIds: number[]) {
  // Parallel fetch
  const [issues, allComments] = await Promise.all([
    api.getIssues(issueIds),                     // Single batched call
    api.getBatchComments(issueIds),              // Single batched call
  ]);

  return issues.map((issue, i) => ({
    issue,
    comments: allComments[i],
  }));
  // Total: ~200ms regardless of n
}
```

### Response Size Optimization

**Problem:** Large responses consume memory and slow serialization.

**Solution:** Return only necessary data.

```typescript
// ❌ Poor: Return entire object
async function getIssue(id: number) {
  const issue = await api.getIssue(id);
  return {
    content: [{
      type: 'text',
      text: JSON.stringify(issue) // Includes unnecessary fields
    }]
  };
}

// ✅ Good: Return essential data only
async function getIssue(id: number) {
  const issue = await api.getIssue(id);

  // Extract only needed fields
  const summary = {
    number: issue.number,
    title: issue.title,
    state: issue.state,
    created_at: issue.created_at,
    author: issue.author.login,
    labels: issue.labels.map(l => l.name),
  };

  return {
    content: [{
      type: 'text',
      text: JSON.stringify(summary, null, 2)
    }]
  };
}
```

### Streaming Large Results

**Problem:** Large tool responses block until complete.

**Solution:** Use progress notifications for long-running operations.

```typescript
// ✅ Stream progress for long operations
async function processLargeDataset(server: Server, requestId: string) {
  const total = 1000;
  const batchSize = 100;

  for (let i = 0; i < total; i += batchSize) {
    // Process batch
    await processBatch(i, batchSize);

    // Send progress notification
    server.notification({
      method: 'notifications/progress',
      params: {
        progressToken: requestId,
        progress: i + batchSize,
        total: total,
      },
    });
  }
}
```

---

## Connection and Transport Optimization

### Stdio vs HTTP Performance

**Stdio Transport:**
- **Latency:** ~1-5ms (local process communication)
- **Throughput:** High (no network overhead)
- **Use when:** Server runs locally

**HTTP Transport:**
- **Latency:** ~50-300ms (network + server processing)
- **Throughput:** Lower (network bandwidth limited)
- **Use when:** Server is remote or needs multi-client support

**Performance comparison:**

```typescript
// Stdio: ~5ms total
const stdioLatency = {
  connection: 1,      // Process spawn
  request: 2,         // IPC overhead
  processing: 100,    // Server logic
  response: 2,        // IPC overhead
  total: 105,
};

// HTTP: ~150ms total
const httpLatency = {
  connection: 50,     // TCP handshake + TLS
  request: 20,        // HTTP overhead
  processing: 100,    // Server logic
  response: 30,       // HTTP overhead + serialization
  total: 200,
};
```

### HTTP Keep-Alive

**Problem:** Creating new TCP connections for each request adds ~50ms overhead.

**Solution:** Use HTTP keep-alive to reuse connections.

```typescript
// ✅ Configure HTTP client with keep-alive
const client = new APIClient({
  baseURL: 'https://api.example.com',
  timeout: 30000,
  httpAgent: new http.Agent({
    keepAlive: true,
    keepAliveMsecs: 60000,  // Keep connection alive for 60s
    maxSockets: 10,          // Connection pool size
    maxFreeSockets: 5,       // Idle connection limit
  }),
  httpsAgent: new https.Agent({
    keepAlive: true,
    keepAliveMsecs: 60000,
    maxSockets: 10,
    maxFreeSockets: 5,
  }),
});
```

### Connection Reuse

**Problem:** Recreating connections for each tool call wastes resources.

**Solution:** Maintain persistent connections.

```typescript
class MCPClient {
  private session?: Session;
  private lastActivity: number = Date.now();
  private keepAliveInterval?: NodeJS.Timer;

  async connect() {
    if (this.session) {
      // Reuse existing session
      this.lastActivity = Date.now();
      return this.session;
    }

    // Create new session
    this.session = await this.createSession();
    this.startKeepAlive();
    return this.session;
  }

  private startKeepAlive() {
    // Ping server every 30s to keep connection alive
    this.keepAliveInterval = setInterval(() => {
      if (Date.now() - this.lastActivity > 30000) {
        this.session?.ping();
      }
    }, 30000);
  }

  async close() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
    }
    await this.session?.close();
    this.session = undefined;
  }
}
```

---

## Caching Strategies

Caching eliminates redundant operations and dramatically improves performance.

### In-Memory Caching

**Problem:** Repeated identical API calls waste time and resources.

**Solution:** Cache responses in memory.

```typescript
class CachedAPIClient {
  private cache = new Map<string, { data: any; expires: number }>();
  private defaultTTL = 60000; // 1 minute

  async get<T>(endpoint: string, ttl: number = this.defaultTTL): Promise<T> {
    const cached = this.cache.get(endpoint);

    // Return cached data if valid
    if (cached && Date.now() < cached.expires) {
      return cached.data;
    }

    // Fetch fresh data
    const data = await this.api.get<T>(endpoint);

    // Cache with expiration
    this.cache.set(endpoint, {
      data,
      expires: Date.now() + ttl,
    });

    return data;
  }

  invalidate(endpoint: string) {
    this.cache.delete(endpoint);
  }

  clear() {
    this.cache.clear();
  }
}
```

### LRU Cache for Limited Memory

**Problem:** Unbounded cache grows indefinitely.

**Solution:** Use LRU (Least Recently Used) cache with size limits.

```typescript
class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    // Remove if exists (to reinsert at end)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldest = this.cache.keys().next().value;
      this.cache.delete(oldest);
    }

    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }
}

// Usage
const cache = new LRUCache<string, APIResponse>(100); // Max 100 entries
```

### Cache Invalidation Strategies

**Time-based expiration:**
```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

function isExpired<T>(entry: CacheEntry<T>): boolean {
  return Date.now() - entry.timestamp > entry.ttl;
}
```

**Event-based invalidation:**
```typescript
// Invalidate on notifications
client.on('notification', (notification) => {
  if (notification.method === 'notifications/resources/updated') {
    const uri = notification.params.uri;
    cache.invalidate(uri);
  }
});
```

### Persistent Caching

**Problem:** In-memory cache lost on server restart.

**Solution:** Use disk-based caching for expensive operations.

```typescript
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

class PersistentCache {
  private cacheDir: string;

  constructor(cacheDir: string) {
    this.cacheDir = cacheDir;
  }

  private getCachePath(key: string): string {
    const hash = crypto.createHash('sha256').update(key).digest('hex');
    return path.join(this.cacheDir, `${hash}.json`);
  }

  async get<T>(key: string, maxAge: number): Promise<T | null> {
    try {
      const cachePath = this.getCachePath(key);
      const stat = await fs.stat(cachePath);

      // Check if expired
      if (Date.now() - stat.mtimeMs > maxAge) {
        return null;
      }

      const data = await fs.readFile(cachePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    const cachePath = this.getCachePath(key);
    await fs.mkdir(this.cacheDir, { recursive: true });
    await fs.writeFile(cachePath, JSON.stringify(value));
  }

  async clear(): Promise<void> {
    await fs.rm(this.cacheDir, { recursive: true, force: true });
  }
}
```

---

## Timeout Configuration

Proper timeout configuration prevents hung operations from blocking the system.

### Request Timeouts

**Problem:** Unresponsive servers block indefinitely.

**Solution:** Configure timeouts at multiple levels.

```typescript
// ✅ Comprehensive timeout configuration
class TimeoutConfig {
  // Connection establishment timeout
  connectionTimeout: number = 5000;      // 5 seconds

  // Individual request timeout
  requestTimeout: number = 30000;        // 30 seconds

  // Tool execution timeout
  toolTimeout: number = 60000;           // 60 seconds

  // Server initialization timeout
  initTimeout: number = 10000;           // 10 seconds
}

// Apply timeouts
async function fetchWithTimeout<T>(
  url: string,
  timeout: number
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
```

### Adaptive Timeouts

**Problem:** Fixed timeouts don't account for varying operation complexity.

**Solution:** Adjust timeouts based on operation type.

```typescript
class AdaptiveTimeout {
  private readonly baseTimeout = 5000;
  private readonly timeoutMultipliers = {
    simple: 1,      // 5s
    moderate: 3,    // 15s
    complex: 6,     // 30s
    expensive: 12,  // 60s
  };

  getTimeout(operation: keyof typeof this.timeoutMultipliers): number {
    return this.baseTimeout * this.timeoutMultipliers[operation];
  }
}

// Usage
const timeouts = new AdaptiveTimeout();

// Simple query
await fetch(url, { timeout: timeouts.getTimeout('simple') });

// Complex aggregation
await fetch(url, { timeout: timeouts.getTimeout('complex') });
```

### Timeout Error Handling

```typescript
async function executeWithTimeout<T>(
  operation: () => Promise<T>,
  timeout: number,
  operationName: string
): Promise<T> {
  try {
    return await Promise.race([
      operation(),
      new Promise<never>((_, reject) =>
        setTimeout(() =>
          reject(new Error(
            `Operation "${operationName}" timed out after ${timeout}ms. ` +
            'This may indicate a network issue or server overload.'
          )), timeout)
      ),
    ]);
  } catch (error) {
    if (error.message.includes('timed out')) {
      // Log for monitoring
      console.error(`Timeout: ${operationName} exceeded ${timeout}ms`);
    }
    throw error;
  }
}
```

---

## Memory Management

Memory leaks and excessive memory usage degrade performance over time.

### Memory Leak Prevention

**Problem:** Event listeners and timers not cleaned up.

**Solution:** Proper cleanup in lifecycle hooks.

```typescript
class MCPServer {
  private intervals: NodeJS.Timer[] = [];
  private listeners: Array<{ target: any; event: string; handler: Function }> = [];

  addInterval(callback: () => void, ms: number): void {
    const interval = setInterval(callback, ms);
    this.intervals.push(interval);
  }

  addEventListener(target: any, event: string, handler: Function): void {
    target.on(event, handler);
    this.listeners.push({ target, event, handler });
  }

  async cleanup(): Promise<void> {
    // Clear all intervals
    for (const interval of this.intervals) {
      clearInterval(interval);
    }
    this.intervals = [];

    // Remove all event listeners
    for (const { target, event, handler } of this.listeners) {
      target.off(event, handler);
    }
    this.listeners = [];
  }
}
```

### Memory-Efficient Data Structures

**Problem:** Keeping large objects in memory unnecessarily.

**Solution:** Use streams and iterators for large datasets.

```typescript
// ❌ Poor: Load entire dataset into memory
async function getAllIssues() {
  const issues = await api.getAllIssues(); // Loads 10,000 issues
  return issues.map(formatIssue);          // All in memory
}

// ✅ Good: Process in chunks
async function* streamIssues() {
  let page = 1;
  while (true) {
    const issues = await api.getIssuesPage(page, 100);
    if (issues.length === 0) break;

    for (const issue of issues) {
      yield formatIssue(issue);
    }

    page++;
  }
}

// Usage
for await (const issue of streamIssues()) {
  // Process one at a time
  await handleIssue(issue);
}
```

### WeakMap for Metadata

**Problem:** Storing metadata prevents garbage collection of main objects.

**Solution:** Use WeakMap for object associations.

```typescript
// ❌ Poor: Prevents garbage collection
class Cache {
  private metadata = new Map<object, Metadata>();

  setMetadata(obj: object, meta: Metadata) {
    this.metadata.set(obj, meta);
    // obj cannot be garbage collected even if unused
  }
}

// ✅ Good: Allows garbage collection
class Cache {
  private metadata = new WeakMap<object, Metadata>();

  setMetadata(obj: object, meta: Metadata) {
    this.metadata.set(obj, meta);
    // obj can be garbage collected when no other references exist
  }
}
```

### Memory Monitoring

```typescript
class MemoryMonitor {
  private threshold = 500 * 1024 * 1024; // 500MB

  checkMemory(): void {
    const usage = process.memoryUsage();

    if (usage.heapUsed > this.threshold) {
      console.warn(`High memory usage: ${(usage.heapUsed / 1024 / 1024).toFixed(2)}MB`);

      // Trigger cleanup
      this.cleanup();
    }
  }

  private cleanup(): void {
    // Clear caches
    cache.clear();

    // Force garbage collection (if flag enabled)
    if (global.gc) {
      global.gc();
    }
  }

  startMonitoring(intervalMs: number = 60000): void {
    setInterval(() => this.checkMemory(), intervalMs);
  }
}
```

---

## Network Optimization

Network latency is often the largest performance bottleneck for remote servers.

### Request Compression

**Problem:** Large payloads slow network transmission.

**Solution:** Enable compression.

```typescript
// HTTP server with compression
import compression from 'compression';
import express from 'express';

const app = express();

// Enable gzip compression
app.use(compression({
  threshold: 1024,    // Only compress responses > 1KB
  level: 6,           // Compression level (1-9)
}));
```

### Reduce Round Trips

**Problem:** Multiple sequential requests compound latency.

**Solution:** Batch operations and use GraphQL-style queries.

```typescript
// ❌ Poor: Multiple round trips
async function getUserData(userId: string) {
  const user = await api.getUser(userId);           // 100ms
  const posts = await api.getUserPosts(userId);     // 100ms
  const comments = await api.getUserComments(userId); // 100ms
  return { user, posts, comments };
  // Total: 300ms
}

// ✅ Good: Single batched request
async function getUserData(userId: string) {
  const data = await api.getBatchUserData(userId, {
    include: ['user', 'posts', 'comments']
  });
  return data;
  // Total: 100ms
}
```

### CDN and Edge Caching

For HTTP servers, leverage CDN caching:

```typescript
// Set cache headers for static data
app.get('/api/schema', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.setHeader('ETag', schemaVersion);
  res.json(schema);
});

// Conditional requests
app.get('/api/data', (req, res) => {
  if (req.headers['if-none-match'] === dataETag) {
    return res.status(304).end(); // Not Modified
  }
  res.setHeader('ETag', dataETag);
  res.json(data);
});
```

### Connection Pooling for HTTP

```typescript
import http from 'http';
import https from 'https';

// Configure global agent for all requests
const httpAgent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: 60000,
  maxSockets: 50,
  maxFreeSockets: 10,
});

const httpsAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 60000,
  maxSockets: 50,
  maxFreeSockets: 10,
});

// Use in all HTTP clients
const client = axios.create({
  httpAgent,
  httpsAgent,
});
```

---

## Batch Operations

Batching reduces overhead by processing multiple items together.

### Tool Call Batching

```typescript
// ✅ Support batch tool invocations
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'github_get_issues_batch') {
    // Handle multiple issue IDs in one call
    const issueIds = args.issueIds as number[];

    // Fetch all in parallel
    const issues = await Promise.all(
      issueIds.map(id => api.getIssue(id))
    );

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(issues, null, 2),
      }],
    };
  }
});
```

### Database Query Batching

```typescript
// ❌ Poor: N+1 queries
async function getUsersWithPosts(userIds: number[]) {
  const results = [];
  for (const id of userIds) {
    const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    const posts = await db.query('SELECT * FROM posts WHERE user_id = $1', [id]);
    results.push({ user, posts });
  }
  return results;
  // Total: 2n database queries
}

// ✅ Good: Batched queries
async function getUsersWithPosts(userIds: number[]) {
  const [users, posts] = await Promise.all([
    db.query('SELECT * FROM users WHERE id = ANY($1)', [userIds]),
    db.query('SELECT * FROM posts WHERE user_id = ANY($1)', [userIds]),
  ]);

  // Group posts by user
  const postsByUser = posts.reduce((acc, post) => {
    if (!acc[post.user_id]) acc[post.user_id] = [];
    acc[post.user_id].push(post);
    return acc;
  }, {});

  return users.map(user => ({
    user,
    posts: postsByUser[user.id] || [],
  }));
  // Total: 2 database queries
}
```

---

## Monitoring and Profiling

Continuous monitoring identifies performance regressions early.

### Performance Metrics Collection

```typescript
class PerformanceMetrics {
  private metrics = {
    toolCalls: new Map<string, number[]>(),
    errors: new Map<string, number>(),
    memoryUsage: [] as number[],
  };

  recordToolCall(toolName: string, durationMs: number): void {
    if (!this.metrics.toolCalls.has(toolName)) {
      this.metrics.toolCalls.set(toolName, []);
    }
    this.metrics.toolCalls.get(toolName)!.push(durationMs);
  }

  recordError(toolName: string): void {
    const count = this.metrics.errors.get(toolName) || 0;
    this.metrics.errors.set(toolName, count + 1);
  }

  recordMemoryUsage(): void {
    const usage = process.memoryUsage().heapUsed / 1024 / 1024; // MB
    this.metrics.memoryUsage.push(usage);
  }

  getReport(): string {
    let report = '=== Performance Report ===\n\n';

    // Tool call statistics
    report += 'Tool Execution Times:\n';
    for (const [tool, durations] of this.metrics.toolCalls) {
      const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
      const p95 = this.percentile(durations, 95);
      report += `  ${tool}: avg=${avg.toFixed(2)}ms, p95=${p95.toFixed(2)}ms, calls=${durations.length}\n`;
    }

    // Error rates
    report += '\nError Counts:\n';
    for (const [tool, count] of this.metrics.errors) {
      report += `  ${tool}: ${count} errors\n`;
    }

    // Memory usage
    if (this.metrics.memoryUsage.length > 0) {
      const avgMem = this.metrics.memoryUsage.reduce((a, b) => a + b, 0) / this.metrics.memoryUsage.length;
      const maxMem = Math.max(...this.metrics.memoryUsage);
      report += `\nMemory Usage: avg=${avgMem.toFixed(2)}MB, max=${maxMem.toFixed(2)}MB\n`;
    }

    return report;
  }

  private percentile(values: number[], p: number): number {
    const sorted = values.slice().sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[index];
  }
}

// Usage
const metrics = new PerformanceMetrics();

server.setRequestHandler('tools/call', async (request) => {
  const start = performance.now();
  try {
    const result = await handleToolCall(request);
    const duration = performance.now() - start;
    metrics.recordToolCall(request.params.name, duration);
    return result;
  } catch (error) {
    metrics.recordError(request.params.name);
    throw error;
  }
});

// Periodic reporting
setInterval(() => {
  console.error(metrics.getReport());
}, 300000); // Every 5 minutes
```

### Profiling with Node.js

```bash
# CPU profiling
node --prof src/index.js
node --prof-process isolate-*.log > profile.txt

# Heap snapshot
node --inspect src/index.js
# Then use Chrome DevTools to capture heap snapshot

# Trace events
node --trace-events-enabled src/index.js
# Open chrome://tracing and load the generated trace file
```

### APM Integration

```typescript
// Example: Integration with Application Performance Monitoring
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1, // 10% of transactions
});

// Instrument tool calls
server.setRequestHandler('tools/call', async (request) => {
  const transaction = Sentry.startTransaction({
    op: 'tool.call',
    name: request.params.name,
  });

  try {
    const result = await handleToolCall(request);
    transaction.setStatus('ok');
    return result;
  } catch (error) {
    transaction.setStatus('internal_error');
    Sentry.captureException(error);
    throw error;
  } finally {
    transaction.finish();
  }
});
```

---

## Platform-Specific Performance

### Claude Code Performance

**Optimization priorities:**
1. Server initialization speed (affects startup)
2. Tool execution latency (affects responsiveness)
3. Memory footprint (shared with IDE)

**Configuration:**
```json
{
  "mcpServers": {
    "optimized-server": {
      "type": "stdio",
      "command": "node",
      "args": ["--max-old-space-size=512", "server.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### Cursor Performance

**Optimization priorities:**
1. Response time (affects code suggestions)
2. Connection stability
3. Context window usage

**Best practices:**
- Use stdio for local servers (lower latency)
- Keep tool responses concise
- Implement caching for code context

### Gemini CLI Performance

**Optimization priorities:**
1. CLI responsiveness
2. Batch operation support
3. Offline capability

**Configuration:**
```json
{
  "mcpServers": {
    "fast-server": {
      "type": "stdio",
      "command": "python",
      "args": ["-O", "server.py"],
      "env": {
        "PYTHONUNBUFFERED": "1"
      }
    }
  }
}
```

### Antigravity Performance

**Limitations:**
- Global MCP configuration only
- No project-specific optimizations

**Workarounds:**
- Use efficient global servers
- Implement per-project configuration in server logic
- Cache project-specific data

---

## Performance Benchmarks

### Establishing Baselines

**Test suite for benchmarking:**

```typescript
// benchmark.ts
async function benchmark() {
  console.log('=== MCP Server Benchmarks ===\n');

  // 1. Server initialization
  const initStart = performance.now();
  const client = new MCPClient();
  await client.connect();
  await client.initialize();
  const initTime = performance.now() - initStart;
  console.log(`Server initialization: ${initTime.toFixed(2)}ms`);

  // 2. Simple tool call
  const simpleStart = performance.now();
  await client.callTool('echo', { message: 'test' });
  const simpleTime = performance.now() - simpleStart;
  console.log(`Simple tool call: ${simpleTime.toFixed(2)}ms`);

  // 3. Complex tool call
  const complexStart = performance.now();
  await client.callTool('analyze_code', { file: 'large.ts' });
  const complexTime = performance.now() - complexStart;
  console.log(`Complex tool call: ${complexTime.toFixed(2)}ms`);

  // 4. Batch operations
  const batchStart = performance.now();
  await Promise.all([
    client.callTool('read_file', { path: 'file1.txt' }),
    client.callTool('read_file', { path: 'file2.txt' }),
    client.callTool('read_file', { path: 'file3.txt' }),
  ]);
  const batchTime = performance.now() - batchStart;
  console.log(`Batch operations (3): ${batchTime.toFixed(2)}ms`);

  // 5. Memory usage
  const memUsage = process.memoryUsage();
  console.log(`\nMemory usage:`);
  console.log(`  Heap used: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`);
  console.log(`  Heap total: ${(memUsage.heapTotal / 1024 / 1024).toFixed(2)}MB`);
  console.log(`  RSS: ${(memUsage.rss / 1024 / 1024).toFixed(2)}MB`);

  await client.close();
}

benchmark().catch(console.error);
```

### Performance Targets

**Recommended targets by operation type:**

| Operation | Target | Acceptable | Poor |
|-----------|--------|------------|------|
| Server init (stdio) | < 1s | 1-2s | > 2s |
| Server init (HTTP) | < 2s | 2-5s | > 5s |
| Simple tool call | < 500ms | 500ms-2s | > 2s |
| Complex tool call | < 5s | 5-10s | > 10s |
| Memory (idle) | < 50MB | 50-100MB | > 100MB |
| Memory (active) | < 200MB | 200-500MB | > 500MB |

### Continuous Benchmarking

```bash
# Run benchmarks before and after changes
npm run benchmark > baseline.txt

# Make changes...

npm run benchmark > optimized.txt

# Compare
diff baseline.txt optimized.txt
```

---

## Best Practices Summary

### DO: Performance Optimization

✅ **Use lazy initialization** for non-critical components
✅ **Implement connection pooling** for databases
✅ **Cache frequently accessed data** with TTL
✅ **Batch API calls** to reduce round trips
✅ **Set appropriate timeouts** at all levels
✅ **Monitor memory usage** and implement cleanup
✅ **Use streaming** for large datasets
✅ **Profile before optimizing** to identify bottlenecks
✅ **Measure performance impact** of changes
✅ **Implement progress notifications** for long operations

### DON'T: Performance Anti-Patterns

❌ **Don't load everything upfront** during initialization
❌ **Don't create new connections** for every request
❌ **Don't return massive responses** without pagination
❌ **Don't ignore timeouts** leading to hung operations
❌ **Don't leak memory** with uncleaned resources
❌ **Don't optimize prematurely** without profiling
❌ **Don't block on I/O** in synchronous code
❌ **Don't ignore caching opportunities**
❌ **Don't forget to close** connections and cleanup
❌ **Don't mix synchronous and asynchronous** operations carelessly

### Quick Performance Checklist

**Before deployment:**
- [ ] Server initializes in < 2 seconds
- [ ] Simple tool calls complete in < 500ms
- [ ] Complex tool calls complete in < 5 seconds
- [ ] Memory usage < 100MB idle, < 500MB under load
- [ ] Timeouts configured at all levels
- [ ] Caching implemented for repeated operations
- [ ] Connection pooling for external services
- [ ] Error handling doesn't leak resources
- [ ] Cleanup logic in place
- [ ] Performance metrics being collected

---

## Related Documentation

- **[Error Handling](../03-creating-servers/error-handling.md)** - Efficient error handling patterns
- **[Testing](../03-creating-servers/testing.md)** - Performance testing strategies
- **[Best Practices](../03-creating-servers/best-practices.md)** - Server design best practices
- **[Protocol Architecture](../01-fundamentals/protocol-architecture.md)** - Understanding MCP layers
- **[Platform Guides](../04-platform-guides/)** - Platform-specific optimizations

## Resources

- [Node.js Performance Best Practices](https://nodejs.org/en/docs/guides/simple-profiling)
- [Chrome DevTools Performance Profiling](https://developer.chrome.com/docs/devtools/performance)
- [HTTP/2 Performance](https://developers.google.com/web/fundamentals/performance/http2)

---

**Last Updated:** February 2026
**Version:** 1.0.0
**Category:** MCP Advanced Topics
**Estimated Reading Time:** 45 minutes
