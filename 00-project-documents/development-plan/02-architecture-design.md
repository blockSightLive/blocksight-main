# Bitcoin Blockchain Analysis Tool - Architecture Design

## **System Architecture Overview**

### **High-Level Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Bitcoin Core  │    │     electrs     │    │   Storage Layer │
│   (Full Node)   │───▶│   (Indexer)     │───▶│   (Single Source│
│                 │    │                 │    │    of Truth)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Cache Layer   │
                       │   (Multi-tier)  │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   REST API      │
                       │   (Your Backend)│
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Frontend Web  │
                       │   (React/Vue/   │
                       │    Angular)     │
                       └─────────────────┘
```

## **Core Components**

### **1. electrs Pre-Indexer**

**Purpose**: Raw blockchain data collection and indexing
**Technology**: Rust-based indexing engine from [romanz/electrs](https://github.com/romanz/electrs) (MIT licensed)
**Input**: Bitcoin Core RPC or .blk files
**Output**: RocksDB database with indexed transaction data

**Responsibilities**:

- Parse all blocks from genesis to tip
- Extract transaction inputs/outputs
- Index addresses and scripts
- Handle all Bitcoin script types
- Maintain UTXO set
- Provide HTTP REST API for data access (port 3000)

### **2. Storage Layer (Single Source of Truth)**

**Primary Storage**: RocksDB - Fast key-value storage for blockchain data (electrs internal)
**Secondary Storage**: PostgreSQL - Read-only replica for complex analytics
**Cache Layer**: Redis - Hot data caching for real-time access
**UTXO Storage**: Memory-mapped files - High-performance UTXO set management (50GB+ dataset)
**Synchronization**: Async replication with consistency guarantees

**Design Principle**: Single source of truth with specialized storage layers for different data types

### **3. Multi-Tier Cache Architecture (Our Implementation)**

**L1 Cache**: Redis in-memory cache for hot data (most recent blocks)
**L2 Cache**: Memory-mapped files for warm data (recent blocks)
**L3 Cache**: RocksDB for cold data (all historical data)
**Predictive Cache**: Pre-load likely-to-be-accessed data

**Cache Tiers (Our Development)**:

- **Hot Cache**: 1-2 second TTL for real-time data
- **Warm Cache**: 10-30 second TTL for recent data
- **Normal Cache**: 2-5 minute TTL for standard queries
- **Cold Cache**: 24-hour+ TTL for historical data

**UTXO State Management**: Memory-mapped files with compression to handle 50GB+ UTXO set efficiently

### **4. HTTP API Integration Layer (Our Implementation)**

**Technology**: NodeJS (separate from core indexing)
**Purpose**: Bridge between electrs HTTP API and our application
**Architecture**: HTTP client polling electrs every 1-2 seconds
**Performance**: Handle connection pooling, retry logic, error handling

**Integration Pattern (Our Development)**:

```
electrs HTTP API (port 3000) ← HTTP Polling (1-2s) ← NodeJS Backend ← REST API ← Frontend
```

### **5. WebSocket Real-Time System (Our Implementation)**

**Technology**: NodeJS WebSocket server
**Purpose**: Real-time event distribution to frontend clients
**Update Frequencies**:

- **WebSocket Events**: New transactions, block confirmations
- **Live Updates**: 1-2s polling for changes, network stats
- **Periodic Updates**: Hourly for price data, complex analytics
- **Event-Based**: ~10min average for new blocks

### **6. Economic Data Tracking**

**Fee Analysis**: Real-time fee rate calculation and historical trends
**Mining Pool Analysis**: Pool identification and dominance tracking
**Economic Metrics**: Market cap, velocity, HODL ratio, exchange flows
**Address Clustering**: Entity identification and linking
**Multi-Signature Analysis**: Multi-sig detection and spending patterns

### **7. Data Fetching Strategy**

**Hybrid Approach**: Strategically choose best data source for each query type

- **Real-time data**: Direct HTTP API calls to electrs (every 1-2 seconds)
- **Historical block data**: Pre-indexed database (electrs + RocksDB)
- **Transaction details**: Cached database first, then API fallback
- **Address queries**: Pre-indexed database (address index)
- **Statistics**: Calculated and cached in PostgreSQL database

**Performance Optimization**: Minimize electrs load by:

- Only polling for block heights and transaction lists
- Fetching detailed data from cached sources
- Caching everything aggressively with proper TTL
- Using bulk operations when possible

### **8. Frontend Application**

**Technology**: React/Vue/Angular
**Purpose**: User interface for blockchain exploration
**Features**: Live updates, mobile-responsive design, caching for performance

### **9. Backend Configuration Options**

**Single Backend Configuration Supported**:

**Esplora Backend (Production-Ready)**:

- **Data Source**: electrs server (open-source from romanz/electrs)
- **Database Strategy**: Uses RocksDB indexes + PostgreSQL for additional data
- **Real-time Strategy**: HTTP API polling with caching layers
- **Performance**: Optimized through multi-tier caching

## **Critical Design Decisions**

### **1. Single Source of Truth Architecture**

**Problem**: Dual database approach creates consistency issues and performance bottlenecks

**Solution**: RocksDB as primary storage with PostgreSQL as read-only analytics replica

**Benefits**:

- Eliminates data synchronization complexity
- Ensures transaction integrity
- Simplifies query routing
- Reduces write latency

### **2. Technology Choice: Open Source Foundation**

**electrs Approach (Chosen)**:

- **Language**: Rust with electrs from [romanz/electrs](https://github.com/romanz/electrs)
- **Database**: RocksDB (embedded key-value store)
- **Architecture**: Client-server with HTTP REST API
- **Focus**: Real-time blockchain exploration with proven indexing
- **Performance**: Sub-second response for cached queries, supports thousands of concurrent users

**Integration Strategy**: Use official electrs with our own backend development

### **3. UTXO State Management**

**Challenge**: Every block depends on complete UTXO state from genesis to current block

**Approaches Considered**:

- **In-Memory**: Fast but requires massive RAM (50GB+ at block 800,000)
- **Database-Only**: Slow with millions of queries per block
- **Hybrid**: Optimal balance with multi-tier caching

**Decision**: Hybrid approach with multi-tier caching

### **4. Script Parsing Strategy**

**Challenge**: Bitcoin scripts have numerous edge cases and complex nested structures

**Required Coverage**:

- Standard types: P2PKH, P2SH, P2WPKH, P2WSH, P2TR
- Multisig variations with different required/total combinations
- OP_RETURN variations and provably unspendable outputs
- Legacy types like P2PK
- Complex nested scripts (P2SH-wrapped P2WPKH, P2SH-wrapped P2WSH)
- Taproot variations (key path, script path spending)

**Inner Script Extraction**: Handle P2SH redeem scripts and P2WSH witness scripts from spending transactions

**Confidence Scoring**: Rate extraction confidence for uncertain cases

### **5. Advanced Testing Framework**

#### **5.1 electrs Built-in Testing**

**electrs provides robust testing mechanisms**:

- **Unit Tests**: `cargo test --lib --all-features`
- **Database Compatibility**: Automatic version checking and reindexing
- **Reorg Handling**: Automatic chain reorganization detection
- **Cross-Reference Validation**: Bitcoin Core RPC validation

#### **5.2 Multi-Tier Testing Strategy**

**Challenge**: Full blockchain testing takes 15+ hours per iteration

**Solution**: Four-tier testing approach

**Tier 1: Unit Tests (Seconds)**

- Genesis block (simple P2PKH)
- Early blocks (P2PKH only)
- Script parsing edge cases
- Database operations

**Tier 2: Integration Tests (Minutes)**

- First P2SH transaction (block 170,059)
- First SegWit transaction (block 481,824)
- Known problematic blocks
- Cross-reference validation

**Tier 3: Regression Tests (Hours)**

- Recent 10,000 blocks with all script types
- Known historical issues
- Performance benchmarks

**Tier 4: Full Chain Tests (Days)**

- Complete blockchain validation
- Production deployment verification
- Stress testing

#### **5.3 Stateful Testing Solutions**

**Problem Mitigation**:

- **Checkpoint System**: Resume from any block height
- **Incremental Validation**: Test only new blocks
- **Parallel Test Environments**: Multiple test instances
- **Snapshot Testing**: Pre-built database snapshots

### **6. Error Recovery Strategy**

**Multi-Strategy Approach**:

- **Immediate Recovery**: Retry with exponential backoff
- **Data Recovery**: Fetch from Bitcoin Core, use alternative sources
- **State Recovery**: Rollback to checkpoints, partial rebuilds
- **Data Repair**: Corrupted data detection and repair

### **7. Performance Optimization**

**Parallel Processing**: Block-level and transaction-level parallelism
**I/O Optimization**: Sequential access patterns, read-ahead buffering
**Memory Management**: Memory-mapped files, custom allocators
**Batch Operations**: Group database operations for efficiency

### **8. Physical Constraints and System Limits**

#### **8.1 Hardware-Constrained Architecture**

**Memory Hierarchy Optimization**:

- **L1 Cache**: Hot UTXO data (<1% of total, ~1GB)
- **L2 Cache**: Warm transaction data (<5% of total, ~5GB)
- **L3 Cache**: Recent blocks (<10% of total, ~10GB)
- **Main Memory**: Active working set (<50% of total, ~50GB)
- **Storage**: Cold data and archives (unlimited)

**Bandwidth Constraints**:

- **Memory Bandwidth**: 50GB/s max (DDR4-3200)
- **Storage I/O**: 7GB/s max (NVMe SSD)
- **Network**: 10Gbps max (typical datacenter)

#### **8.2 Concurrency and Race Condition Mitigation**

**Lock-Free Data Structures (Our Implementation)**:

- **Atomic UTXO Updates**: Version-controlled updates
- **Lock-Free Caching**: Concurrent read/write access
- **Memory Ordering**: Proper memory barriers for consistency

**Consistency Models**:

- **Strong Consistency**: Critical financial data
- **Eventual Consistency**: Analytics and statistics
- **Causal Consistency**: Transaction ordering

#### **8.3 Fault Tolerance and Error Isolation**

**Circuit Breaker Pattern (Our Implementation)**:

- **Bitcoin Core**: Automatic failover to cached data
- **Database**: Graceful degradation with partial data
- **Network**: Local mode with eventual sync

**Error Isolation**:

- **Process Boundaries**: Isolate failures to components
- **Resource Limits**: Prevent cascade failures
- **Monitoring**: Real-time failure detection and alerting

### **9. Exponential Scaling Strategies**

**Adaptive UTXO Management**: Compression, partitioning, and eviction strategies
**Incremental Address Clustering**: Approximate clustering with periodic updates
**Predictive Caching**: Machine learning for cache optimization

## **Data Flow Architecture**

### **Write Path**

1. Write to RocksDB (electrs internal) with ACID guarantees
2. Async replication to PostgreSQL (analytics)
3. Update L1 cache (Redis) for hot data
4. Update L2 cache (memory-mapped) for warm data
5. Invalidate related cache entries

### **Read Path**

1. Check L1 cache (Redis) - ~0.1ms
2. Check L2 cache (memory-mapped) - ~1ms
3. Check L3 cache (RocksDB via HTTP API) - ~10ms
4. Fallback to PostgreSQL (analytics) - ~100ms

## **Integration Points**

### **Bitcoin Core Integration**

- RPC interface for real-time block and data updates
- .blk file reading for initial indexing
- Validation and cross-reference checking

### **electrs Integration**

- MIT licensed component for core indexing
- HTTP REST API for data access (port 3000)
- Custom configuration for performance optimization

### **External APIs**

- REST API for transaction and block data
- WebSocket API for real-time updates
- Search and analytics endpoints

## **Scalability Considerations**

### **Horizontal Scaling**

- Multiple electrs instances for load distribution
- Database read replicas for analytics
- API load balancing

### **Vertical Scaling**

- Memory optimization for large UTXO sets
- Storage optimization with compression
- CPU optimization with parallel processing

### **Performance Monitoring**

- Real-time metrics collection
- Performance bottleneck identification
- Capacity planning and scaling decisions
