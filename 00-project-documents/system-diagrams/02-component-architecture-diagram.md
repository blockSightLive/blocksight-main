# BlockSight.live - Component Architecture Diagram

## Overview

This Component Architecture Diagram shows the major system components of BlockSight.live, their responsibilities, and interconnections with realistic implementation boundaries.

## Component Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              BLOCKSIGHT.LIVE SYSTEM                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              DATA INGESTION LAYER                          │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐                    ┌─────────────────┐                │ │
│  │  │   Bitcoin Core  │                    │   electrs       │                │ │
│  │  │   (Full Node)   │◄──────────────────►│   (Open Source) │                │ │
│  │  │                 │                    │                 │                │ │
│  │  │ • Blockchain    │                    │ • Raw Data      │                │ │
│  │  │ • Memory pool   │                    │ • Indexing      │                │ │
│  │  │ • Network Data  │                    │ • RocksDB       │                │ │
│  │  │ • RPC Interface │                    │   (Internal)    │                │ │
│  │  │ • .blk Files    │                    │ • HTTP API      │                │ │
│  │  │                 │                    │   (Port 3000)   │                │ │
│  │  └─────────────────┘                    └─────────────────┘                │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                        HTTP API INTEGRATION LAYER                          │ │
│  │                              (Our Implementation)                          │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │ │
│  │  │   HTTP Client   │    │   Connection    │    │   Circuit       │         │ │
│  │  │   Manager       │    │   Pool          │    │   Breaker       │         │ │
│  │  │                 │    │                 │    │                 │         │ │
│  │  │ • 1-2s Polling  │    │ • Keep-Alive    │    │ • Failure       │         │ │
│  │  │ • Retry Logic   │    │ • 50 Max Conn   │    │ • Auto Failover │         │ │
│  │  │ • Error         │    │ • 10s Timeout   │    │ • Detection     │         │ │
│  │  │   Handling      │    │ • Load Balance  │    │ • Health Check  │         │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘         │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                            MULTI-TIER CACHE LAYER                          │ │
│  │                              (Our Implementation)                          │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │ │
│  │  │   Redis L1      │    │   Memory-Mapped │    │   Nginx L3      │         │ │
│  │  │   (Hot Cache)   │    │   L2 (Warm)     │    │   (HTTP Cache)  │         │ │
│  │  │                 │    │                 │    │                 │         │ │
│  │  │ • 1-2s TTL      │    │ • UTXO Set      │    │ • electrs       │         │ │
│  │  │ • Recent Blocks │    │ • 50GB+ Dataset │    │   Response      │         │ │
│  │  │ • Mempool Data  │    │ • O(1) Lookups  │    │   Cache         │         │ │
│  │  │ • ~0.1-1ms      │    │ • LZ4 Compress  │    │ • 1s-24h TTL    │         │ │
│  │  │                 │    │ • ~1-5ms        │    │ • ~5-20ms       │         │ │
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
│  │  │  └─────────────────┘    └─────────────────┘    └─────────────────┘    │ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              API LAYER                                     │ │
│  │                              (NodeJS)                                      │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │ │
│  │  │   REST API      │    │   WebSocket     │    │   Search API    │         │ │
│  │  │   Server        │    │   Server        │    │   Engine        │         │ │
│  │  │                 │    │                 │    │                 │         │ │
│  │  │ • Block Data    │    │ • 1-2s Updates  │    │ • Address       │         │ │
│  │  │ • Transaction   │    │ • Event Push    │    │   Search        │         │ │
│  │  │   Data          │    │ • Connection    │    │ • Transaction   │         │ │
│  │  │ • Fee Analysis  │    │   Management    │    │   Lookup        │         │ │
│  │  │ • Network Load  │    │ • Subscription  │    │ • Block Search  │         │ │
│  │  │ • ~10-50ms      │    │   Handling      │    │ • Calculator    │         │ │
│  │  │   (Cached)      │    │                 │    │ • ~20-100ms     │         │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘         │ │
│  │           │                       │                      │                 │ │
│  │           └───────────────────────┼──────────────────────┘                 │ │
│  │                                   │                                        │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                        ANALYTICS ENGINE                               │ │ │
│  │  │                          (Our Implementation)                         │ │ │
│  │  │                                                                       │ │ │
│  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    │ │ │
│  │  │  │   Fee Analysis  │    │   Network Load  │    │   Economic      │    │ │ │
│  │  │  │   Engine        │    │   Analyzer      │    │   Metrics       │    │ │ │
│  │  │  │                 │    │                 │    │   Calculator    │    │ │ │
│  │  │  │ • Real-time     │    │ • Congestion    │    │ • Market Cap    │    │ │ │
│  │  │  │   Calculation   │    │   Analysis      │    │ • Velocity      │    │ │ │
│  │  │  │ • sats/vB       │    │ • Confirmation  │    │ • HODL Ratio    │    │ │ │
│  │  │  │ • Percentiles   │    │   Estimates     │    │ • Exchange      │    │ │ │
│  │  │  │ • ~500-2000ms   │    │ • Load Cat.     │    │   Flows         │    │ │ │
│  │  │  │                 │    │ • ~200-1000ms   │    │ • ~1-5s         │    │ │ │
│  │  │  └─────────────────┘    └─────────────────┘    └─────────────────┘    │ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              FRONTEND LAYER                                │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │ │
│  │  │   Real-Time     │    │   Search &      │    │   Analytics     │         │ │
│  │  │   Dashboard     │    │   Navigation    │    │   Tools         │         │ │
│  │  │                 │    │                 │    │                 │         │ │
│  │  │ • Block         │    │ • Address       │    │ • Fee Gauge     │         │ │
│  │  │   Visualization │    │   Search        │    │ • Network Load  │         │ │
│  │  │ • Transaction   │    │ • Transaction   │    │ • Bitcoin       │         │ │
│  │  │   Tracking      │    │   Lookup        │    │   Timeline      │         │ │
│  │  │ • Network       │    │ • Block Search  │    │ • Price         │         │ │
│  │  │   Status        │    │ • Calculator    │    │   Dashboard     │         │ │
│  │  │ • 1-2s Updates  │    │ • Multi-format  │    │ • Hourly Price  │         │ │
│  │  │ • Event Push    │    │   Search        │    │   Updates       │         │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘         │ │
│  │           │                       │                       │                │ │
│  │           └───────────────────────┼───────────────────────┘                │ │
│  │                                   │                                        │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                        USER SETTINGS & PREFERENCES                    │ │ │
│  │  │                                                                       │ │ │
│  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    │ │ │
│  │  │  │   Language      │    │   Display       │    │   Currency      │    │ │ │
│  │  │  │   Settings      │    │   Settings      │    │   Preferences   │    │ │ │
│  │  │  │                 │    │                 │    │                 │    │ │ │
│  │  │  │ • English       │    │ • Dark/Light    │    │ • Primary       │    │ │ │
│  │  │  │ • Spanish       │    │   Theme         │    │   Currency      │    │ │ │
│  │  │  │ • Hebrew        │    │ • Responsive    │    │ • Secondary     │    │ │ │
│  │  │  │ • Localization  │    │   Design        │    │   Currency      │    │ │ │
│  │  │  │ • RTL Support   │    │ • Mobile        │    │ • 12 Supported  │    │ │ │
│  │  │  └─────────────────┘    │   Optimization  │    │   Currencies    │    │ │ │
│  │  │                         └─────────────────┘    └─────────────────┘    │ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              MONITORING & OBSERVABILITY                    │ │
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
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘         │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

### **Data Ingestion Layer**

- **Bitcoin Core**: Primary blockchain data source via RPC and .blk files
- **electrs (Open Source)**: Raw data processing with internal RocksDB and HTTP API

### **HTTP API Integration Layer (Our Implementation)**

- **HTTP Client Manager**: 1-2 second polling with retry logic and error handling
- **Connection Pool**: Keep-alive connections with 50 max concurrent, 10s timeout
- **Circuit Breaker**: Failure detection, auto failover, and health monitoring

### **Multi-Tier Cache Layer (Our Implementation)**

- **Redis L1 (Hot Cache)**: 1-2s TTL for recent data, ~0.1-1ms access
- **Memory-mapped L2 (Warm Cache)**: UTXO set and recent data, ~1-5ms access
- **Nginx L3 (HTTP Cache)**: electrs response caching, 1s-24h TTL, ~5-20ms access
- **PostgreSQL Analytics**: Read-only replica for complex queries, ~100-500ms

### **API Layer (NodeJS)**

- **REST API Server**: Block, transaction, fee data with ~10-50ms cached responses
- **WebSocket Server**: 1-2s event updates with connection and subscription management
- **Search API Engine**: Address, transaction, block search with ~20-100ms responses
- **Analytics Engine**: Real-time fee analysis, network load, economic metrics

### **Frontend Layer**

- **Real-Time Dashboard**: Live blockchain visualization with 1-2s updates via WebSocket
- **Search & Navigation**: Multi-format search interface with cached responses
- **Analytics Tools**: Fee gauge, network load, timeline with realistic update frequencies
- **User Settings**: Language, display, currency preferences with local storage

### **Monitoring & Observability**

- **Prometheus**: Metrics collection from all system components
- **Grafana**: Real-time visualization and custom dashboards
- **AlertManager**: Error, performance, and capacity alerting with SLA monitoring

## Data Flow Patterns

1. **Ingestion**: Bitcoin Core → electrs (internal RocksDB) → HTTP API (port 3000)
2. **Integration**: HTTP Client → 1-2s Polling → Connection Pool → Circuit Breaker
3. **Caching**: Multi-tier cache hierarchy (Redis L1 → Memory-mapped L2 → Nginx L3)
4. **Processing**: API Layer → Analytics Engine → PostgreSQL → Frontend
5. **Real-time**: WebSocket Server → 1-2s Event Push → Frontend UI
6. **Monitoring**: All Components → Prometheus → Grafana → AlertManager

## Performance Characteristics

- **Cache Hit Rates**: L1: ~0.1-1ms, L2: ~1-5ms, L3: ~5-20ms
- **Database Queries**: PostgreSQL: ~100-500ms, Complex Analytics: ~1-5s
- **API Response Times**: Cached: ~10-50ms, Database: ~100-500ms
- **Real-Time Updates**: 1-2 second latency via WebSocket events
- **System Capacity**: 1000+ concurrent users, 100-500 RPS depending on cache hit rate
