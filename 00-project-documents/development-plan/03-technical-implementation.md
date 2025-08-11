# Bitcoin Blockchain Analysis Tool - Technical Implementation

## **Database Schema Specifications**

### **1. Primary Storage: RocksDB via electrs HTTP API**

#### **1.1 Core Integration Architecture**

The system integrates with electrs via HTTP REST API rather than direct database access:

**Integration Pattern**:

```
Bitcoin Core → electrs → RocksDB (internal to electrs)
                    ↓
             HTTP REST API (port 3000)
                    ↓
           NodeJS Backend (our implementation)
```

**HTTP API Endpoints (electrs provides)**:

- `GET /block/{hash}` - Block data by hash
- `GET /block-height/{height}` - Block data by height
- `GET /tx/{txid}` - Transaction data
- `GET /address/{address}/txs` - Address transaction history
- `GET /address/{address}/utxo` - Address UTXO set
- `GET /mempool` - Current mempool state

#### **1.2 electrs Internal Database Structure**

electrs uses three specialized RocksDB databases internally:

**Database 1: `txstore` - Transaction and Block Storage**

- **Purpose**: Store raw transaction data and block metadata
- **Key Format**: `{prefix}{identifier} → {serialized_data}`
- **Access**: Via HTTP API only

**Database 2: `history` - Address and Script History**

- **Purpose**: Store address transaction history and script relationships
- **Key Format**: `H{scripthash}{height}{type}{details} → {data}`
- **Access**: Via HTTP API endpoints

**Database 3: `cache` - Hot Data and Statistics**

- **Purpose**: Store frequently accessed data and computed statistics
- **Access**: Via HTTP API with caching headers

#### **1.3 Our HTTP Integration Layer**

**Connection Management (Our Implementation)**:

```javascript
class ElectrsClient {
  constructor(baseURL = 'http://127.0.0.1:3000') {
    this.baseURL = baseURL;
    this.httpAgent = new http.Agent({
      keepAlive: true,
      maxSockets: 50,
      timeout: 10000
    });
    this.retryConfig = {
      retries: 3,
      backoff: 'exponential',
      timeouts: [1000, 2000, 5000]
    };
  }
}
```

**Polling Strategy (Our Implementation)**:

- **Main Poll Rate**: 1-2 seconds for mempool and latest block
- **Block Discovery**: Poll `/block-height/{tip}` every 2 seconds
- **Mempool Updates**: Poll `/mempool` every 1 second
- **Connection Pooling**: Reuse HTTP connections for efficiency
- **Error Handling**: Exponential backoff with circuit breaker

### **2. Secondary Storage: PostgreSQL (Our Analytics Layer)**

#### **2.1 Analytics Database Schema**

**Core Tables for Complex Queries**:

**Blocks Table**:

```sql
CREATE TABLE blocks (
    height INTEGER PRIMARY KEY,
    hash VARCHAR(64) UNIQUE NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    size INTEGER NOT NULL,
    weight INTEGER NOT NULL,
    tx_count INTEGER NOT NULL,
    fee_total BIGINT NOT NULL,
    fee_rate_avg DECIMAL(10,2),
    difficulty DECIMAL(20,8),
    pool_id INTEGER,
    version INTEGER,
    bits INTEGER,
    nonce BIGINT,
    merkle_root VARCHAR(64),
    previous_block_hash VARCHAR(64),
    first_seen TIMESTAMP(6),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_blocks_timestamp ON blocks(timestamp);
CREATE INDEX idx_blocks_hash ON blocks(hash);
CREATE INDEX idx_blocks_pool_id ON blocks(pool_id);
CREATE INDEX idx_blocks_fee_rate ON blocks(fee_rate_avg);
```

**Transactions Table**:

```sql
CREATE TABLE transactions (
    txid VARCHAR(64) PRIMARY KEY,
    block_height INTEGER REFERENCES blocks(height),
    block_index INTEGER NOT NULL,
    size INTEGER NOT NULL,
    weight INTEGER NOT NULL,
    fee BIGINT NOT NULL,
    fee_rate DECIMAL(10,2),
    version INTEGER NOT NULL,
    locktime INTEGER NOT NULL,
    coinbase BOOLEAN DEFAULT FALSE,
    rbf BOOLEAN DEFAULT FALSE,
    first_seen TIMESTAMP(6),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_transactions_block_height ON transactions(block_height);
CREATE INDEX idx_transactions_fee_rate ON transactions(fee_rate);
CREATE INDEX idx_transactions_first_seen ON transactions(first_seen);
```

**Address Analytics Table**:

```sql
CREATE TABLE address_analytics (
    address VARCHAR(255) PRIMARY KEY,
    first_seen_block INTEGER NOT NULL,
    last_seen_block INTEGER NOT NULL,
    total_received BIGINT NOT NULL,
    total_sent BIGINT NOT NULL,
    current_balance BIGINT NOT NULL,
    transaction_count INTEGER NOT NULL,
    avg_transaction_value BIGINT,
    script_type VARCHAR(20) NOT NULL,
    cluster_id INTEGER,
    last_updated TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for analytics
CREATE INDEX idx_address_balance ON address_analytics(current_balance);
CREATE INDEX idx_address_tx_count ON address_analytics(transaction_count);
CREATE INDEX idx_address_script_type ON address_analytics(script_type);
CREATE INDEX idx_address_cluster ON address_analytics(cluster_id);
```

#### **2.2 Data Replication Strategy**

**Async Replication from electrs API**:

- **Polling Worker**: Background process polling electrs for new data
- **Batch Processing**: Process multiple blocks/transactions in batches
- **Consistency Checks**: Validate data integrity against electrs
- **Lag Tolerance**: Accept 1-2 block lag for analytics data

### **3. Multi-Tier Cache Architecture (Our Implementation)**

#### **3.1 L1 Cache: Redis (Hot Data)**

**Purpose**: Store hot data for sub-100ms access
**Capacity**: 16GB (configurable based on available RAM)
**TTL Strategy**:

- **Hot Cache**: 1-2 second TTL for real-time data
- **Warm Cache**: 10-30 second TTL for recent data
- **Normal Cache**: 2-5 minute TTL for standard queries
- **Cold Cache**: 24-hour+ TTL for historical data

**Cache Key Structure**:

```
Key Format: "l1:{type}:{identifier}" → Serialized Data
Types:
- "l1:block:{height}" → Block data
- "l1:tx:{txid}" → Transaction data
- "l1:address:{address}" → Address summary
- "l1:mempool:state" → Current mempool state
- "l1:stats:{type}" → Network statistics
```

**Cache Management (Our Implementation)**:

```javascript
class RedisCacheManager {
  constructor(redisClient) {
    this.redis = redisClient;
    this.defaultTTL = 300; // 5 minutes
    this.hotTTL = 2; // 2 seconds for real-time data
  }

  async set(key, value, ttl = this.defaultTTL) {
    return this.redis.setex(key, ttl, JSON.stringify(value));
  }

  async get(key) {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  // Batch invalidation for consistency
  async invalidatePattern(pattern) {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      return this.redis.del(...keys);
    }
  }
}
```

#### **3.2 L2 Cache: Memory-Mapped Files (Warm Data)**

**Purpose**: Store warm data with fast access (<10ms)
**Capacity**: 100GB (configurable)
**Technology**: Memory-mapped files with custom indexing

**File Structure**:

```
/data/cache/l2/
├── blocks.mmap          # Recent block data (last 10,000 blocks)
├── transactions.mmap    # Recent transaction data
├── addresses.mmap       # Active address data
├── utxos.mmap          # Recent UTXO changes
└── index.mmap          # Hash table index for fast lookups
```

**Memory-Mapped Implementation (Our Development)**:

- **Fixed-Size Records**: Enable O(1) random access
- **Hash Table Index**: Fast lookups without scanning
- **LZ4 Compression**: Reduce memory footprint by 60-70%
- **Atomic Updates**: Ensure consistency during updates

#### **3.3 L3 Cache: Nginx Reverse Proxy (Cold Data)**

**Purpose**: HTTP-level caching for electrs API responses
**Configuration**:

```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=electrs_cache:100m
                 max_size=10g inactive=24h use_temp_path=off;

location /api/electrs/ {
    proxy_pass http://127.0.0.1:3000/;
    proxy_cache electrs_cache;

    # Different cache times for different endpoints
    location ~* /block/ {
        proxy_cache_valid 200 24h;  # Blocks don't change
    }
    location ~* /tx/ {
        proxy_cache_valid 200 1h;   # Transactions confirmed
    }
    location ~* /mempool {
        proxy_cache_valid 200 1s;   # Mempool changes frequently
    }
    location ~* /address/.*/txs {
        proxy_cache_valid 200 10s;  # Address history
    }
}
```

### **4. HTTP API Integration Patterns (Our Implementation)**

#### **4.1 Polling Manager**

**Background Polling Service**:

```javascript
class ElectrsPollingManager {
  constructor(electrsClient, cacheManager, websocketServer) {
    this.electrs = electrsClient;
    this.cache = cacheManager;
    this.ws = websocketServer;
    this.isPolling = false;
    this.pollInterval = 1000; // 1 second
  }

  async startPolling() {
    this.isPolling = true;
    while (this.isPolling) {
      try {
        await this.pollForUpdates();
        await this.sleep(this.pollInterval);
      } catch (error) {
        console.error('Polling error:', error);
        await this.sleep(this.pollInterval * 2); // Backoff on error
      }
    }
  }

  async pollForUpdates() {
    // Check for new blocks
    const latestHeight = await this.electrs.getLatestBlockHeight();
    const cachedHeight = await this.cache.get('l1:latest:height');

    if (latestHeight > cachedHeight) {
      await this.processNewBlocks(cachedHeight + 1, latestHeight);
    }

    // Check mempool changes
    const mempoolState = await this.electrs.getMempoolState();
    await this.processMempoolUpdates(mempoolState);
  }
}
```

#### **4.2 Error Handling and Retry Logic**

**Circuit Breaker Pattern**:

```javascript
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.threshold = threshold;
    this.timeout = timeout;
    this.failureCount = 0;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = 0;
  }

  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}
```

#### **4.3 Data Transformation Pipeline**

**electrs API to Internal Format**:

```javascript
class DataTransformer {
  // Transform electrs block format to our internal format
  transformBlock(electrsBlock) {
    return {
      height: electrsBlock.height,
      hash: electrsBlock.id,
      timestamp: new Date(electrsBlock.timestamp * 1000),
      size: electrsBlock.size,
      weight: electrsBlock.weight,
      txCount: electrsBlock.tx_count,
      totalFees: electrsBlock.totalFees || 0,
      difficulty: electrsBlock.difficulty,
      version: electrsBlock.version,
      merkleRoot: electrsBlock.merkle_root,
      previousBlockHash: electrsBlock.previousblockhash
    };
  }

  // Transform electrs transaction format
  transformTransaction(electrsTx) {
    return {
      txid: electrsTx.txid,
      size: electrsTx.size,
      weight: electrsTx.weight,
      fee: electrsTx.fee || 0,
      feeRate:
        electrsTx.fee && electrsTx.weight
          ? ((electrsTx.fee / electrsTx.weight) * 4).toFixed(2)
          : null,
      version: electrsTx.version,
      locktime: electrsTx.locktime,
      inputs: electrsTx.vin.map(this.transformInput),
      outputs: electrsTx.vout.map(this.transformOutput)
    };
  }
}
```

## **electrs Configuration and Deployment**

### **1. electrs Configuration (Official Repository)**

#### **1.1 Base Configuration**

**Source**: Official electrs from [romanz/electrs](https://github.com/romanz/electrs)

**Configuration File (`electrs.toml`)**:

```toml
# Network configuration
network = "bitcoin"
daemon_dir = "/home/bitcoin/.bitcoin"
daemon_rpc_addr = "127.0.0.1:8332"
daemon_p2p_addr = "127.0.0.1:8333"

# Database configuration
db_dir = "/data/electrs/db"

# Performance settings
index_batch_size = 1000
index_lookup_limit = 1000
tx_cache_size = 10000

# HTTP API configuration
http_addr = "127.0.0.1:3000"
cors = "*"

# Advanced indexing features
address_search = true
utxos_limit = 1000
electrum_txs_limit = 1000

# Electrum protocol (optional)
electrum_rpc_addr = "127.0.0.1:50001"

# Logging
log_filters = "INFO"
timestamp = true
```

#### **1.2 Performance Optimization**

**Build Optimization**:

```bash
# Clone official electrs
git clone https://github.com/romanz/electrs.git
cd electrs

# Optimize build for production
export RUSTFLAGS="-C target-cpu=native -C target-feature=+avx2,+fma"
cargo build --release --bin electrs

# Alternative: Use system-specific optimizations
RUSTFLAGS="-C target-cpu=haswell" cargo build --release
```

**Runtime Configuration**:

```bash
# Increase file descriptor limits
ulimit -n 65536

# Set memory allocation
export MALLOC_ARENA_MAX=4

# Configure RocksDB
export ROCKSDB_MAX_OPEN_FILES=10000
```

#### **1.3 electrs Custom Indexes**

electrs creates these indexes internally (accessed via HTTP API):

- **Transaction Store** (`'T'`): Full transaction data by txid
- **Output Index** (`'O'`): Transaction outputs by txid:vout
- **Block Index** (`'B'`): Block headers by block hash
- **Block-TX Mapping** (`'X'`): Transaction lists by block hash
- **Block Metadata** (`'M'`): Block size, weight, statistics
- **History Index** (`'H'`): Address transaction history by script hash
- **Address Index** (`'a'`): Address search index (when enabled)

### **2. Integration Architecture Implementation**

#### **2.1 HTTP API Client Layer**

**Connection Pool Management**:

```javascript
class ElectrsConnectionPool {
  constructor(config) {
    this.baseURL = config.electrsURL || 'http://127.0.0.1:3000';
    this.maxConnections = config.maxConnections || 50;
    this.requestTimeout = config.requestTimeout || 10000;
    this.retryAttempts = config.retryAttempts || 3;

    this.agent = new http.Agent({
      keepAlive: true,
      maxSockets: this.maxConnections,
      maxFreeSockets: 10,
      timeout: this.requestTimeout
    });
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const requestConfig = {
      ...options,
      timeout: this.requestTimeout,
      agent: this.agent,
      validateStatus: (status) => status < 500 // Retry on 5xx errors
    };

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await axios.get(url, requestConfig);
        return response.data;
      } catch (error) {
        if (attempt === this.retryAttempts) throw error;
        await this.delay(Math.pow(2, attempt) * 1000); // Exponential backoff
      }
    }
  }
}
```

#### **2.2 Real-Time Update System**

**WebSocket Event Distribution (Our Implementation)**:

```javascript
class WebSocketManager {
  constructor(httpServer, cacheManager) {
    this.wss = new WebSocket.Server({ server: httpServer });
    this.cache = cacheManager;
    this.clients = new Map();
    this.subscriptions = new Map();
  }

  // Handle new WebSocket connections
  handleConnection(ws, req) {
    const clientId = this.generateClientId();
    this.clients.set(clientId, {
      ws: ws,
      subscriptions: new Set(),
      lastSeen: Date.now()
    });

    ws.on('message', (data) => {
      this.handleClientMessage(clientId, data);
    });

    ws.on('close', () => {
      this.handleClientDisconnect(clientId);
    });
  }

  // Broadcast new block to subscribed clients
  broadcastNewBlock(block) {
    const message = {
      type: 'new_block',
      data: block,
      timestamp: Date.now()
    };

    this.broadcastToSubscribers('blocks', message);
  }

  // Broadcast mempool updates
  broadcastMempoolUpdate(transactions) {
    const message = {
      type: 'mempool_update',
      data: {
        added: transactions.added,
        removed: transactions.removed
      },
      timestamp: Date.now()
    };

    this.broadcastToSubscribers('mempool', message);
  }
}
```

#### **2.3 Update Frequency Management**

**Polling Schedule (Our Implementation)**:

- **Block Discovery**: Poll every 2 seconds for new blocks
- **Mempool State**: Poll every 1 second for mempool changes
- **Network Stats**: Poll every 30 seconds for network statistics
- **Price Data**: Update every 1 hour from external APIs
- **Fee Estimates**: Calculate every 10 seconds from mempool data

## **Performance Optimization Strategies**

### **1. Caching Strategy Implementation**

#### **1.1 Cache Hierarchy Management**

**Multi-Tier Cache Logic**:

```javascript
class CacheHierarchy {
  constructor(l1Redis, l2MemoryMap, l3Nginx) {
    this.l1 = l1Redis; // ~0.1ms access
    this.l2 = l2MemoryMap; // ~1ms access
    this.l3 = l3Nginx; // ~10ms access
    this.misses = 0;
    this.hits = { l1: 0, l2: 0, l3: 0 };
  }

  async get(key) {
    // Try L1 cache first
    let value = await this.l1.get(key);
    if (value) {
      this.hits.l1++;
      return value;
    }

    // Try L2 cache
    value = await this.l2.get(key);
    if (value) {
      this.hits.l2++;
      // Promote to L1 with short TTL
      await this.l1.set(key, value, 60);
      return value;
    }

    // Try L3 cache (Nginx cached electrs response)
    value = await this.l3.get(key);
    if (value) {
      this.hits.l3++;
      // Promote to L2 and L1
      await this.l2.set(key, value);
      await this.l1.set(key, value, 60);
      return value;
    }

    // Cache miss - fetch from electrs
    this.misses++;
    return null;
  }
}
```

#### **1.2 Cache Invalidation Strategy**

**Intelligent Cache Invalidation**:

- **Block Confirmation**: Invalidate mempool-related caches
- **New Transaction**: Invalidate address-specific caches
- **Reorg Detection**: Invalidate recent block caches
- **Time-Based**: Expire statistical caches periodically

### **2. Memory Management**

#### **2.1 Memory-Mapped File Implementation**

**UTXO Set Caching**:

```javascript
class MemoryMappedUTXOCache {
  constructor(filePath, maxSize = 50 * 1024 * 1024 * 1024) {
    // 50GB
    this.filePath = filePath;
    this.maxSize = maxSize;
    this.recordSize = 64; // Fixed size per UTXO record
    this.maxRecords = Math.floor(maxSize / this.recordSize);
    this.index = new Map(); // In-memory hash table
  }

  // Memory-mapped file operations
  async init() {
    this.fd = await fs.open(this.filePath, 'a+');
    this.buffer = await this.fd.readFile();
    await this.buildIndex();
  }

  async get(outpoint) {
    const offset = this.index.get(outpoint);
    if (!offset) return null;

    return this.readRecord(offset);
  }

  async set(outpoint, utxo) {
    const serialized = this.serializeUTXO(utxo);
    const offset = this.allocateSpace();

    await this.writeRecord(offset, serialized);
    this.index.set(outpoint, offset);
  }
}
```

#### **2.2 Connection Pool Optimization**

**HTTP Connection Management**:

- **Keep-Alive**: Reuse connections to electrs
- **Pool Size**: Maintain 20-50 concurrent connections
- **Timeout Management**: 10-second request timeout
- **Circuit Breaker**: Automatic failover on electrs errors

### **3. Query Optimization**

#### **3.1 Address History Optimization**

**Pagination and Streaming**:

```javascript
class AddressHistoryManager {
  async getAddressHistory(address, limit = 100, offset = 0) {
    // Check cache first
    const cacheKey = `address:${address}:${offset}:${limit}`;
    let history = await this.cache.get(cacheKey);

    if (!history) {
      // Fetch from electrs with pagination
      history = await this.electrs.getAddressTransactions(address, {
        limit,
        offset
      });

      // Cache for 5 minutes
      await this.cache.set(cacheKey, history, 300);
    }

    return history;
  }

  // Stream large address histories
  async *streamAddressHistory(address) {
    let offset = 0;
    const batchSize = 100;

    while (true) {
      const batch = await this.getAddressHistory(address, batchSize, offset);
      if (batch.length === 0) break;

      for (const tx of batch) {
        yield tx;
      }

      offset += batchSize;

      // Rate limiting to avoid overwhelming electrs
      await this.delay(100);
    }
  }
}
```

## **Error Handling and Recovery**

### **1. Comprehensive Error Strategy**

#### **1.1 electrs Connection Failures**

**Automatic Failover**:

```javascript
class ElectrsFailoverManager {
  constructor(primaryURL, fallbackStrategies) {
    this.primary = primaryURL;
    this.fallbacks = fallbackStrategies;
    this.currentStrategy = 'primary';
    this.lastFailure = null;
  }

  async executeWithFailover(operation) {
    try {
      return await this.executePrimary(operation);
    } catch (error) {
      console.warn('Primary electrs failed:', error.message);
      return await this.executeFallback(operation);
    }
  }

  async executeFallback(operation) {
    // Strategy 1: Use cached data
    if (this.fallbacks.includes('cache')) {
      const cached = await this.getCachedResult(operation);
      if (cached) return cached;
    }

    // Strategy 2: Use PostgreSQL analytics data
    if (this.fallbacks.includes('postgres')) {
      const pgResult = await this.getFromPostgres(operation);
      if (pgResult) return pgResult;
    }

    // Strategy 3: Graceful degradation
    if (this.fallbacks.includes('degraded')) {
      return this.getDegradedResponse(operation);
    }

    throw new Error('All fallback strategies exhausted');
  }
}
```

#### **1.2 Data Consistency Management**

**Consistency Validation**:

```javascript
class DataConsistencyValidator {
  async validateBlockConsistency(height) {
    const [electrsBlock, pgBlock, cachedBlock] = await Promise.allSettled([
      this.electrs.getBlock(height),
      this.postgres.getBlock(height),
      this.cache.getBlock(height)
    ]);

    const validBlocks = [electrsBlock, pgBlock, cachedBlock]
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value);

    if (validBlocks.length === 0) {
      throw new Error(`No valid block data for height ${height}`);
    }

    // Verify all sources agree on block hash
    const hashes = validBlocks.map((block) => block.hash);
    const uniqueHashes = [...new Set(hashes)];

    if (uniqueHashes.length > 1) {
      console.error(
        `Block hash inconsistency at height ${height}:`,
        uniqueHashes
      );
      await this.resolveInconsistency(height, validBlocks);
    }

    return validBlocks[0];
  }
}
```

### **2. Recovery Mechanisms**

#### **2.1 State Recovery**

**Checkpoint System**:

```javascript
class CheckpointManager {
  constructor(postgres, cache) {
    this.db = postgres;
    this.cache = cache;
    this.checkpointInterval = 10000; // Every 10k blocks
  }

  async createCheckpoint(height) {
    const checkpoint = {
      height: height,
      timestamp: Date.now(),
      block_hash: await this.electrs.getBlockHash(height),
      cache_state: await this.cache.getMetrics(),
      postgres_lsn: await this.db.getCurrentLSN(),
      validation_hash: await this.computeValidationHash(height)
    };

    await this.db.saveCheckpoint(checkpoint);
    return checkpoint;
  }

  async recoverFromCheckpoint(checkpointHeight) {
    const checkpoint = await this.db.getCheckpoint(checkpointHeight);

    // Restore cache state
    await this.cache.restoreState(checkpoint.cache_state);

    // Validate recovery
    const currentHash = await this.electrs.getBlockHash(checkpointHeight);
    if (currentHash !== checkpoint.block_hash) {
      throw new Error(
        `Checkpoint validation failed at height ${checkpointHeight}`
      );
    }

    console.log(`Recovered from checkpoint at height ${checkpointHeight}`);
    return checkpoint;
  }
}
```

#### **2.2 Real-Time Monitoring**

**Health Check System**:

```javascript
class HealthMonitor {
  constructor(components) {
    this.components = components;
    this.healthStatus = new Map();
    this.alertThresholds = {
      electrs_response_time: 1000, // 1 second
      cache_hit_rate: 0.8, // 80%
      postgres_lag: 300000, // 5 minutes
      websocket_connections: 10000 // Max connections
    };
  }

  async checkHealth() {
    const results = await Promise.allSettled([
      this.checkElectrsHealth(),
      this.checkCacheHealth(),
      this.checkPostgresHealth(),
      this.checkWebSocketHealth()
    ]);

    const healthReport = {
      timestamp: Date.now(),
      status: 'healthy',
      components: {},
      alerts: []
    };

    for (const [index, result] of results.entries()) {
      const componentName = ['electrs', 'cache', 'postgres', 'websocket'][
        index
      ];

      if (result.status === 'fulfilled') {
        healthReport.components[componentName] = result.value;
      } else {
        healthReport.status = 'unhealthy';
        healthReport.components[componentName] = {
          status: 'error',
          error: result.reason.message
        };
        healthReport.alerts.push({
          component: componentName,
          severity: 'critical',
          message: result.reason.message
        });
      }
    }

    return healthReport;
  }
}
```

## **Advanced Analytics Implementation**

### **1. Economic Data Tracking**

#### **1.1 Fee Analysis Engine**

**Real-Time Fee Calculation**:

```javascript
class FeeAnalysisEngine {
  constructor(mempoolManager, cache) {
    this.mempool = mempoolManager;
    this.cache = cache;
    this.feeHistogram = new Map();
  }

  async calculateFeeRates() {
    const mempoolTxs = await this.mempool.getCurrentTransactions();
    const feeRates = mempoolTxs.map((tx) => ({
      txid: tx.txid,
      feeRate: tx.fee / (tx.weight / 4), // sat/vB
      weight: tx.weight,
      fee: tx.fee
    }));

    // Sort by fee rate (descending)
    feeRates.sort((a, b) => b.feeRate - a.feeRate);

    // Calculate percentiles
    const percentiles = this.calculatePercentiles(feeRates);

    // Update fee histogram
    this.updateFeeHistogram(feeRates);

    const analysis = {
      timestamp: Date.now(),
      totalTxs: feeRates.length,
      percentiles: percentiles,
      histogram: Array.from(this.feeHistogram.entries()),
      recommendations: this.generateFeeRecommendations(percentiles)
    };

    // Cache for 10 seconds
    await this.cache.set('fee:analysis', analysis, 10);
    return analysis;
  }

  calculatePercentiles(sortedFeeRates) {
    const count = sortedFeeRates.length;
    return {
      p1: this.getPercentile(sortedFeeRates, 0.01),
      p5: this.getPercentile(sortedFeeRates, 0.05),
      p10: this.getPercentile(sortedFeeRates, 0.1),
      p25: this.getPercentile(sortedFeeRates, 0.25),
      p50: this.getPercentile(sortedFeeRates, 0.5),
      p75: this.getPercentile(sortedFeeRates, 0.75),
      p90: this.getPercentile(sortedFeeRates, 0.9),
      p95: this.getPercentile(sortedFeeRates, 0.95),
      p99: this.getPercentile(sortedFeeRates, 0.99)
    };
  }
}
```

#### **1.2 Mining Pool Detection**

**Pool Identification System**:

```javascript
class MiningPoolDetector {
  constructor(knownPools) {
    this.knownPools = knownPools;
    this.patterns = this.compilePatterns(knownPools);
  }

  async identifyPool(block) {
    const coinbaseTx = block.transactions[0];
    const coinbaseScript = coinbaseTx.inputs[0].script_sig;

    // Try known pool patterns
    for (const [poolId, pattern] of this.patterns) {
      if (pattern.test(coinbaseScript)) {
        return {
          poolId: poolId,
          confidence: 'high',
          method: 'coinbase_pattern'
        };
      }
    }

    // Try coinbase output analysis
    const outputAnalysis = await this.analyzeCoinbaseOutputs(coinbaseTx);
    if (outputAnalysis.poolId) {
      return {
        poolId: outputAnalysis.poolId,
        confidence: 'medium',
        method: 'output_analysis'
      };
    }

    return {
      poolId: 'unknown',
      confidence: 'none',
      method: null
    };
  }
}
```

### **2. Address Analytics**

#### **2.1 Address Clustering Engine**

**Multi-Input Heuristic**:

```javascript
class AddressClusteringEngine {
  constructor(postgres, cache) {
    this.db = postgres;
    this.cache = cache;
    this.clusters = new Map();
    this.addressToCluster = new Map();
  }

  async processTransaction(tx) {
    if (tx.inputs.length <= 1) return; // No clustering for single input

    const inputAddresses = tx.inputs
      .map((input) => input.address)
      .filter((addr) => addr); // Remove null addresses

    if (inputAddresses.length <= 1) return;

    // Find existing clusters for these addresses
    const existingClusters = new Set();
    for (const address of inputAddresses) {
      const clusterId = this.addressToCluster.get(address);
      if (clusterId) {
        existingClusters.add(clusterId);
      }
    }

    if (existingClusters.size === 0) {
      // Create new cluster
      await this.createCluster(inputAddresses, tx);
    } else if (existingClusters.size === 1) {
      // Add to existing cluster
      const clusterId = existingClusters.values().next().value;
      await this.addToCluster(clusterId, inputAddresses, tx);
    } else {
      // Merge multiple clusters
      await this.mergeClusters(existingClusters, inputAddresses, tx);
    }
  }

  async createCluster(addresses, tx) {
    const clusterId = this.generateClusterId();
    const cluster = {
      id: clusterId,
      addresses: new Set(addresses),
      firstSeen: tx.block_height,
      lastSeen: tx.block_height,
      transactionCount: 1,
      totalVolume: tx.outputs.reduce((sum, out) => sum + out.value, 0),
      entityType: await this.detectEntityType(addresses)
    };

    this.clusters.set(clusterId, cluster);
    for (const address of addresses) {
      this.addressToCluster.set(address, clusterId);
    }

    return clusterId;
  }
}
```

#### **2.2 Balance History Tracking**

**Historical Balance Reconstruction**:

```javascript
class BalanceHistoryTracker {
  async reconstructBalanceHistory(address, fromHeight = 0, toHeight = null) {
    const txHistory = await this.getAddressTransactionHistory(address);
    const balanceHistory = [];
    let currentBalance = 0;

    for (const tx of txHistory) {
      if (tx.block_height < fromHeight) continue;
      if (toHeight && tx.block_height > toHeight) break;

      const balanceChange = this.calculateBalanceChange(address, tx);
      currentBalance += balanceChange;

      balanceHistory.push({
        block_height: tx.block_height,
        txid: tx.txid,
        balance_change: balanceChange,
        balance_after: currentBalance,
        timestamp: tx.timestamp
      });
    }

    return balanceHistory;
  }

  calculateBalanceChange(address, tx) {
    let change = 0;

    // Add received amounts
    for (const output of tx.outputs) {
      if (output.address === address) {
        change += output.value;
      }
    }

    // Subtract sent amounts
    for (const input of tx.inputs) {
      if (input.address === address) {
        change -= input.value;
      }
    }

    return change;
  }
}
```

## **Performance Targets and Realistic Limits**

### **1. Hardware-Constrained Performance**

#### **1.1 Realistic Response Times**

**Cache Performance Targets**:

- **L1 Cache Hit (Redis)**: ~0.1-1ms
- **L2 Cache Hit (Memory-mapped)**: ~1-5ms
- **L3 Cache Hit (Nginx)**: ~5-20ms
- **electrs API Call**: ~50-200ms
- **PostgreSQL Query**: ~100-500ms
- **Complex Analytics**: ~1-5s

**API Endpoint Targets**:

- **Block by Height/Hash**: ~10-50ms (usually cached)
- **Transaction by ID**: ~20-100ms
- **Address History (recent)**: ~100-500ms
- **Address History (full)**: ~1-10s (depends on activity)
- **Network Statistics**: ~200-1000ms
- **Fee Analysis**: ~500-2000ms

#### **1.2 Throughput Limitations**

**electrs API Constraints**:

- **Max Concurrent Requests**: 50-100 (limited by electrs)
- **Rate Limiting**: ~1000 requests/minute safe threshold
- **Large Address Queries**: May timeout after 10s
- **Mempool Queries**: Limited to recent transactions

**System Capacity**:

- **Concurrent WebSocket Connections**: 1000-5000
- **API Requests per Second**: 100-500 (depending on cache hit rate)
- **Real-Time Updates**: 1-2 second latency
- **Data Lag**: 1-5 second lag from Bitcoin network

### **2. Scalability Strategies**

#### **2.1 Horizontal Scaling**

**Load Distribution**:

- **Multiple electrs Instances**: Read-only scaling
- **API Server Clustering**: NodeJS cluster mode
- **Database Read Replicas**: PostgreSQL replication
- **Cache Sharding**: Redis cluster mode

#### **2.2 Optimization Priorities**

**Performance Optimization Order**:

1. **Cache Hit Rate**: Maximize L1/L2 cache utilization
2. **Connection Pooling**: Minimize connection overhead
3. **Query Optimization**: Optimize PostgreSQL queries
4. **Memory Management**: Efficient memory-mapped file usage
5. **Compression**: Reduce data transfer and storage

**Resource Allocation**:

- **Memory**: 40% cache, 30% applications, 30% system
- **CPU**: 50% NodeJS APIs, 30% electrs, 20% databases
- **Storage**: NVMe SSD required for acceptable performance
- **Network**: 1Gbps+ recommended for high load
