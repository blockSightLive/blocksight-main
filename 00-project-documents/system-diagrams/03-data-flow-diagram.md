# BlockSight.live - Data Flow Diagram

## Overview

This Data Flow Diagram shows the complex information flow through BlockSight.live, from raw blockchain data ingestion to real-time user interactions with realistic performance characteristics.

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              EXTERNAL DATA SOURCES                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐              │
│  │   Bitcoin Core  │    │  Price Feeds    │    │   Web Users     │              │
│  │   (Full Node)   │    │   (APIs)        │    │                 │              │
│  │                 │    │                 │    │ • Beginners     │              │
│  │ • Blockchain    │    │ • CoinGecko     │    │ • Professionals │              │
│  │ • Memory Pool   │    │ • CoinMarketCap │    │ • Developers    │              │
│  │ • Network Data  │    │ • Exchange APIs │    │ • Analysts      │              │
│  │ • RPC Interface │    │ • Hourly        │    │ • Researchers   │              │
│  │ • .blk Files    │    │   Updates       │    │ • Traders       │              │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘              │
│           │                       │                       │                     │
│           │                       │                       │                     │
│           ▼                       ▼                       ▼                     │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              DATA INGESTION FLOW                           │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐                    ┌─────────────────┐                │ │
│  │  │   Raw Block     │                    │   electrs       │                │ │
│  │  │   Data Stream   │───────────────────►│   (Open Source) │                │ │
│  │  │                 │                    │                 │                │ │
│  │  │ • Block Headers │                    │ • Phase 1:      │                │ │
│  │  │ • Transactions  │                    │   Raw Data      │                │ │
│  │  │ • Memory Pool   │                    │ • Phase 2:      │                │ │
│  │  │ • Network Info  │                    │   History       │                │ │
│  │  │ • UTXO Updates  │                    │   Indexing      │                │ │
│  │  └─────────────────┘                    │ • HTTP API      │                │ │
│  │                                         │   (Port 3000)   │                │ │
│  │                                         └─────────────────┘                │ │
│  │                                                    │                       │ │
│  │                                                    ▼                       │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                        TWO-PHASE INDEXING PROCESS                     │ │ │
│  │  │                          (electrs Internal)                           │ │ │
│  │  │                                                                       │ │ │
│  │  │  ┌─────────────────┐                    ┌─────────────────┐           │ │ │
│  │  │  │   Phase 1:      │                    │   Phase 2:      │           │ │ │
│  │  │  │   Raw Data      │                    │   History       │           │ │ │
│  │  │  │   Storage       │                    │   Indexing      │           │ │ │
│  │  │  │                 │                    │                 │           │ │ │
│  │  │  │ • T{txid}       │                    │ • H{scripthash} │           │ │ │
│  │  │  │ • O{txid}{vout} │                    │ • Address       │           │ │ │
│  │  │  │ • B{blockhash}  │                    │   Resolution    │           │ │ │
│  │  │  │ • X{blockhash}  │                    │ • Script        │           │ │ │
│  │  │  │ • M{blockhash}  │                    │   Parsing       │           │ │ │
│  │  │  │ • RocksDB       │                    │ • History       │           │ │ │
│  │  │  │   (Internal)    │                    │   Building      │           │ │ │
│  │  │  └─────────────────┘                    └─────────────────┘           │ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                        HTTP API INTEGRATION FLOW                           │ │
│  │                              (Our Implementation)                          │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │ │
│  │  │   HTTP Client   │    │   Connection    │    │   Circuit       │         │ │
│  │  │   Manager       │    │   Pool          │    │   Breaker       │         │ │
│  │  │                 │    │                 │    │                 │         │ │
│  │  │ • 1-2s Polling  │    │ • Keep-Alive    │    │ • Failure       │         │ │
│  │  │ • Retry Logic   │    │ • 50 Max Conn   │    │ • Auto Failover │         │ │
│  │  │ • Error         │    │ • 10s Timeout   │    │ • Load Balance  │         │ │
│  │  │   Handling      │    │ • Health Check  │    │ • Exponential   │         │ │
│  │  │ • ~5-20ms       │    │ • Async Ops     │    │ • Backoff       │         │ │
│  │  │   Latency       │    │                 │    │                 │         │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘         │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                            MULTI-TIER CACHE FLOW                           │ │
│  │                              (Our Implementation)                          │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │ │
│  │  │   Redis L1      │    │   Memory-Mapped │    │   Nginx L3      │         │ │
│  │  │   (Hot Cache)   │    │   L2 (Warm)     │    │   (HTTP Cache)  │         │ │
│  │  │                 │    │                 │    │                 │         │ │
│  │  │ • 1-2s TTL      │    │ • UTXO Set      │    │ • electrs       │         │ │
│  │  │ • Recent Blocks │    │ • 50GB+ Dataset │    │   Response      │         │ │
│  │  │ • Memory Pool   │    │ • O(1) Lookups  │    │   Cache         │         │ │
│  │  │ • Fee Data      │    │ • LZ4 Compress  │    │ • 1s-24h TTL    │         │ │
│  │  │ • Price Data    │    │ • ~1-5ms        │    │ • ~5-20ms       │         │ │
│  │  │ • ~0.1-1ms      │    │                 │    │                 │         │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘         │ │
│  │           │                       │                       │                │ │
│  │           └───────────────────────┼───────────────────────┘                │ │
│  │                                   │                                        │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                        POSTGRESQL ANALYTICS                           │ │ │
│  │  │                          (Read-Only Replica)                          │ │ │
│  │  │                                                                       │ │ │
│  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    │ │ │
│  │  │  │   Complex       │    │   Historical    │    │   Economic      │    │ │ │
│  │  │  │   Analytics     │    │   Data          │    │   Metrics       │    │ │ │
│  │  │  │                 │    │                 │    │                 │    │ │ │
│  │  │  │ • Address       │    │ • Block History │    │ • Fee Analysis  │    │ │ │
│  │  │  │   Clustering    │    │ • Transaction   │    │ • Network Load  │    │ │ │
│  │  │  │ • Multi-sig     │    │   Archive       │    │ • Mining Pool   │    │ │ │
│  │  │  │   Analysis      │    │ • Balance       │    │   Detection     │    │ │ │
│  │  │  │ • ~100-500ms    │    │   History       │    │ • ~500-2000ms   │    │ │ │
│  │  │  │                 │    │ • ~100-500ms    │    │                 │    │ │ │
│  │  │  └─────────────────┘    └─────────────────┘    └─────────────────┘    │ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              READ PATH FLOW                                │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │ │
│  │  │   L1 Cache      │    │   L2 Cache      │    │   L3 Cache      │         │ │
│  │  │   (Redis)       │    │   (Memory-      │    │   (Nginx)       │         │ │
│  │  │                 │    │   mapped)       │    │                 │         │ │
│  │  │ • Check First   │    │ • Check Second  │    │ • Check Third   │         │ │
│  │  │ • ~0.1-1ms      │    │ • ~1-5ms        │    │ • ~5-20ms       │         │ │
│  │  │ • Hot Data      │    │ • Warm Data     │    │ • HTTP Cache    │         │ │
│  │  │ • Recent Blocks │    │ • Recent        │    │ • electrs API   │         │ │
│  │  │ • Memory Pool   │    │   Transactions  │    │   Responses     │         │ │
│  │  │ • Fee Data      │    │ • UTXO Set      │    │ • Cached        │         │ │
│  │  │ • Price Data    │    │ • Block Data    │    │   Queries       │         │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘         │ │
│  │           │                       │                       │                │ │
│  │           └───────────────────────┼───────────────────────┘                │ │
│  │                                   │                                        │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                        FALLBACK PATH                                  │ │ │
│  │  │                                                                       │ │ │
│  │  │  ┌─────────────────┐                    ┌─────────────────┐           │ │ │
│  │  │  │   PostgreSQL    │                    │   electrs       │           │ │ │
│  │  │  │   (Analytics)   │                    │   HTTP API      │           │ │ │
│  │  │  │                 │                    │                 │           │ │ │
│  │  │  │ • Complex       │                    │ • Direct HTTP   │           │ │ │
│  │  │  │   Queries       │                    │   Calls         │           │ │ │
│  │  │  │ • Analytics     │                    │ • Real-time     │           │ │ │
│  │  │  │ • Statistics    │                    │   Data          │           │ │ │
│  │  │  │ • Reports       │                    │ • Memory Pool   │           │ │ │
│  │  │  │ • Historical    │                    │   Updates       │           │ │ │
│  │  │  │   Data          │                    │ • Network       │           │ │ │
│  │  │  │ • ~100-500ms    │                    │   Status        │           │ │ │
│  │  │  │                 │                    │ • ~50-200ms     │           │ │ │
│  │  │  └─────────────────┘                    └─────────────────┘           │ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              API LAYER FLOW                                │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │ │
│  │  │   REST API      │    │   WebSocket     │    │   Search API    │         │ │
│  │  │   Server        │    │   Server        │    │   Engine        │         │ │
│  │  │                 │    │                 │    │                 │         │ │
│  │  │ • HTTP          │    │ • 1-2s Updates  │    │ • Multi-format  │         │ │
│  │  │   Endpoints     │    │ • Event Push    │    │   Search        │         │ │
│  │  │ • Block Data    │    │ • Connection    │    │ • Address       │         │ │
│  │  │ • Transaction   │    │   Management    │    │   Search        │         │ │
│  │  │   Data          │    │ • Subscription  │    │ • Transaction   │         │ │
│  │  │ • Fee Analysis  │    │   Handling      │    │   Lookup        │         │ │
│  │  │ • Network Load  │    │ • Block         │    │ • Block Search  │         │ │
│  │  │ • Price Data    │    │   Discovery     │    │ • Calculator    │         │ │
│  │  │ • ~10-50ms      │    │ • ~1-2s         │    │ • ~20-100ms     │         │ │
│  │  │   (Cached)      │    │   Latency       │    │                 │         │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘         │ │
│  │           │                       │                       │                │ │
│  │           └───────────────────────┼───────────────────────┘                │ │
│  │                                   │                                        │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                        ANALYTICS ENGINE FLOW                          │ │ │
│  │  │                          (Our Implementation)                         │ │ │
│  │  │                                                                       │ │ │
│  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    │ │ │
│  │  │  │   Fee Analysis  │    │   Network Load  │    │   Economic      │    │ │ │
│  │  │  │   Engine        │    │   Analyzer      │    │   Metrics       │    │ │ │
│  │  │  │                 │    │                 │    │   Calculator    │    │ │ │
│  │  │  │ • Memory Pool   │    │ • Pending       │    │ • Market Cap    │    │ │ │
│  │  │  │   Analysis      │    │   Transactions  │    │ • Velocity      │    │ │ │
│  │  │  │ • sats/vB       │    │ • Confirmation  │    │ • HODL Ratio    │    │ │ │
│  │  │  │   Calculation   │    │   Estimates     │    │ • Exchange      │    │ │ │
│  │  │  │ • Fee           │    │ • Load          │    │   Flows         │    │ │ │
│  │  │  │   Categories    │    │   Categories    │    │ • Address       │    │ │ │
│  │  │  │ • 1-2s Updates  │    │ • Network       │    │   Clustering    │    │ │ │
│  │  │  │ • ~500-2000ms   │    │   Congestion    │    │ • Multi-sig     │    │ │ │
│  │  │  │                 │    │ • ~200-1000ms   │    │ • ~1-5s         │    │ │ │
│  │  │  └─────────────────┘    └─────────────────┘    └─────────────────┘    │ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              FRONTEND FLOW                                 │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │ │
│  │  │   Real-Time     │    │   Search &      │    │   Analytics     │         │ │
│  │  │   Dashboard     │    │   Navigation    │    │   Tools         │         │ │
│  │  │                 │    │                 │    │                 │         │ │
│  │  │ • WebSocket     │    │ • REST API      │    │ • Fee Gauge     │         │ │
│  │  │   Connection    │    │   Calls         │    │ • Network Load  │         │ │
│  │  │ • 1-2s Block    │    │ • Address       │    │ • Bitcoin       │         │ │
│  │  │   Updates       │    │   Search        │    │   Timeline      │         │ │
│  │  │ • Transaction   │    │ • Transaction   │    │ • Price         │         │ │
│  │  │   Tracking      │    │   Lookup        │    │   Dashboard     │         │ │
│  │  │ • Network       │    │ • Block Search  │    │ • Economic      │         │ │
│  │  │   Status        │    │ • Calculator    │    │   Metrics       │         │ │
│  │  │ • Event Push    │    │ • Multi-format  │    │ • Hourly Price  │         │ │
│  │  │ • 1-2s Latency  │    │   Search        │    │   Updates       │         │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘         │ │
│  │           │                       │                       │                │ │
│  │           └───────────────────────┼───────────────────────┘                │ │
│  │                                   │                                        │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                        USER INTERACTION FLOW                          │ │ │
│  │  │                                                                       │ │ │
│  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    │ │ │
│  │  │  │   User Input    │    │   Real-time     │    │   Data          │    │ │ │
│  │  │  │   Processing    │    │   Visualization │    │   Presentation  │    │ │ │
│  │  │  │                 │    │                 │    │                 │    │ │ │
│  │  │  │ • Search        │    │ • Block         │    │ • Interactive   │    │ │ │
│  │  │  │   Queries       │    │   Visualization │    │   Charts        │    │ │ │
│  │  │  │ • Navigation    │    │ • Transaction   │    │ • Color-coded   │    │ │ │
│  │  │  │ • Settings      │    │   Tracking      │    │   Status        │    │ │ │
│  │  │  │ • Preferences   │    │ • Network       │    │ • 1-2s Updates  │    │ │ │
│  │  │  │ • Language      │    │   Monitoring    │    │ • Responsive    │    │ │ │
│  │  │  │ • Currency      │    │ • Fee Analysis  │    │   Design        │    │ │ │
│  │  │  │ • Theme         │    │ • Timeline      │    │ • Cached Resp.  │    │ │ │
│  │  │  └─────────────────┘    └─────────────────┘    └─────────────────┘    │ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              MONITORING FLOW                               │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │ │
│  │  │   Prometheus    │    │   Grafana       │    │   AlertManager  │         │ │
│  │  │   (Metrics)     │    │   (Visualization│    │   (Alerting)    │         │ │
│  │  │                 │    │   & Dashboards) │    │                 │         │ │
│  │  │ • Performance   │    │ • Real-time     │    │ • Error Alerts  │         │ │
│  │  │   Metrics       │    │   Dashboards    │    │ • Performance   │         │ │
│  │  │ • System Health │    │ • Custom        │    │   Alerts        │         │ │
│  │  │ • Error Rates   │    │   Visualizations│    │ • Capacity      │         │ │
│  │  │ • Response      │    │ • Historical    │    │   Alerts        │         │ │
│  │  │   Times         │    │   Data          │    │ • SLA Monitoring│         │ │
│  │  │ • Throughput    │    │ • Alerting      │    │ • Notification  │         │ │
│  │  │ • Latency       │    │   Rules         │    │   System        │         │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘         │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Patterns

### **1. Write Path (Data Ingestion)**

1. **Bitcoin Core** → **Raw Block Data Stream**
2. **Raw Data** → **electrs (Open Source)** (Two-phase indexing with internal RocksDB)
3. **electrs** → **HTTP API (Port 3000)** (REST endpoints for data access)
4. **HTTP Client** → **1-2s Polling** → **Connection Pool** → **Circuit Breaker**
5. **HTTP API Integration** → **Multi-tier Cache** (Redis L1, Memory-mapped L2, Nginx L3)
6. **Cache Updates** → **PostgreSQL Analytics** (Async replication for complex queries)

### **2. Read Path (Data Retrieval)**

1. **User Request** → **L1 Cache (Redis)** (~0.1-1ms)
2. **Cache Miss** → **L2 Cache (Memory-mapped)** (~1-5ms)
3. **Cache Miss** → **L3 Cache (Nginx)** (~5-20ms)
4. **Cache Miss** → **electrs HTTP API** (~50-200ms)
5. **Complex Analytics** → **PostgreSQL** (~100-500ms)
6. **Timeout/Failover** → **Circuit Breaker** → **Cached Data**

### **3. Real-time Flow**

1. **Bitcoin Core** → **electrs** → **HTTP API** → **NodeJS Backend**
2. **HTTP Polling (1-2s)** → **WebSocket Server** → **Frontend**
3. **Price Feeds (Hourly)** → **API Layer** → **Cache** → **Frontend**
4. **Memory Pool Updates** → **Fee Analysis Engine** → **WebSocket** → **Frontend**

### **4. Analytics Flow**

1. **HTTP API Integration** → **Analytics Engine** (Our Implementation)
2. **Analytics Engine** → **Fee Analysis** / **Network Load** / **Economic Metrics**
3. **Analytics Results** → **Multi-tier Cache** → **API Layer**
4. **API Layer** → **Frontend** → **User Visualization** (1-2s latency)

### **5. Search Flow**

1. **User Query** → **Search API Engine** (Our Implementation)
2. **Search Engine** → **Multi-tier Cache** (Address, Transaction, Block)
3. **Cache Miss** → **electrs HTTP API** → **Database Query**
4. **Search Results** → **Cache** → **API Layer** → **Frontend**

## Performance Characteristics

### **Realistic Latency Targets**

- **L1 Cache (Redis)**: ~0.1-1ms
- **L2 Cache (Memory-mapped)**: ~1-5ms
- **L3 Cache (Nginx)**: ~5-20ms
- **electrs HTTP API**: ~50-200ms
- **PostgreSQL (Analytics)**: ~100-500ms
- **Complex Analytics**: ~1-5s

### **Throughput Targets**

- **Concurrent Users**: 1000+
- **API Requests/Second**: 100-500 (cache-dependent)
- **Real-time Updates**: 1-2 second latency
- **Search Queries**: 20-100ms response time (cached)

### **Data Volume**

- **UTXO Set**: 50GB+ (memory-mapped L2 cache)
- **electrs RocksDB**: 1.3TB+ (internal to electrs)
- **Analytics Data**: PostgreSQL read-only replica
- **Cache Data**: 16GB+ (Redis L1)

## Error Handling & Recovery

### **Circuit Breaker Pattern**

- **electrs HTTP API Failure**: Fallback to cached data with degraded service mode
- **Connection Pool Exhaustion**: Load balancing and connection retry logic
- **Network Partition**: Local cache mode with eventual consistency

### **Data Validation**

- **HTTP Response Validation**: Checksum and format verification
- **Cross-reference Validation**: electrs API consistency checks
- **Statistical Validation**: Anomaly detection and pattern analysis
