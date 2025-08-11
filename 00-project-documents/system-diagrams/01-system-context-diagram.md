# BlockSight.live - System Context Diagram

## Overview

This System Context Diagram shows BlockSight.live as the central system and its interactions with external entities, data sources, and users.

## System Context Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                    EXTERNAL ENTITIES                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐              │
│  │   Bitcoin Core  │    │  Price Feeds    │    │   Web Users     │              │
│  │   (Full Node)   │    │   (APIs)        │    │                 │              │
│  │                 │    │                 │    │ • Beginners     │              │
│  │ • Blockchain    │    │ • CoinGecko     │    │ • Professionals │              │
│  │ • Memory pool   │    │ • CoinMarketCap │    │ • Developers    │              │
│  │ • Network Data  │    │ • Exchange APIs │    │ • Analysts      │              │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘              │
│           │                       │                       │                     │
│           │                       │                       │                     │
│           ▼                       ▼                       ▼                     │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              BLOCKSIGHT.LIVE                               │ │
│  │                                                                            │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                        CORE SYSTEM BOUNDARY                           │ │ │
│  │  │                                                                       │ │ │
│  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    │ │ │
│  │  │  │   electrs       │    │   HTTP API      │    │   NodeJS API    │    │ │ │
│  │  │  │   (Open Source) │    │   Integration   │    │   Layer         │    │ │ │
│  │  │  │                 │    │                 │    │                 │    │ │ │
│  │  │  │ • Raw Data      │    │ • HTTP Client   │    │ • REST APIs     │    │ │ │
│  │  │  │ • Indexing      │    │ • Connection    │    │ • WebSocket     │    │ │ │
│  │  │  │ • RocksDB       │    │   Pooling       │    │ • Multi-tier    │    │ │ │
│  │  │  │   (Internal)    │    │ • 1-2s Polling  │    │   Caching       │    │ │ │
│  │  │  │ • HTTP API      │    │ • Circuit       │    │ • Analytics     │    │ │ │
│  │  │  │   (Port 3000)   │    │   Breaker       │    │   Engine        │    │ │ │
│  │  │  └─────────────────┘    └─────────────────┘    └─────────────────┘    │ │ │
│  │  │           │                       │                       │           │ │ │
│  │  │           │                       │                       │           │ │ │
│  │  │           └───────────────────────┼───────────────────────┘           │ │ │
│  │  │                                   │                                   │ │ │
│  │  │  ┌──────────────────────────────────────────────────────────────────┐ │ │ │
│  │  │  │                    STORAGE & CACHE LAYER                         │ │ │ │
│  │  │  │                                                                  │ │ │ │
│  │  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌───────────────┐ │ │ │ │
│  │  │  │  │   Redis L1      │    │   Memory-mapped │    │   PostgreSQL  │ │ │ │ │
│  │  │  │  │   (Hot Cache)   │    │   L2 (Warm)     │    │   (Analytics) │ │ │ │ │
│  │  │  │  │                 │    │                 │    │               │ │ │ │ │
│  │  │  │  │ • 1-2s TTL      │    │ • UTXO Set      │    │ • Complex     │ │ │ │ │
│  │  │  │  │ • Recent Data   │    │ • 50GB+ Dataset │    │   Queries     │ │ │ │ │
│  │  │  │  │ • Fast Access   │    │ • O(1) Lookups  │    │ • Historical  │ │ │ │ │
│  │  │  │  │   ~0.1-1ms      │    │ • Fast Access   │    │   Data        │ │ │ │ │
│  │  │  │  │                 │    │   ~1-5ms        │    │ • ~100-500ms  │ │ │ │ │
│  │  │  │  └─────────────────┘    └─────────────────┘    └───────────────┘ │ │ │ │
│  │  │  └──────────────────────────────────────────────────────────────────┘ │ │ │
│  │  │                                   │                                   │ │ │
│  │  │  ┌──────────────────────────────────────────────────────────────────┐ │ │ │
│  │  │  │                      FRONTEND LAYER                              │ │ │ │
│  │  │  │                                                                  │ │ │ │
│  │  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌───────────────┐ │ │ │ │
│  │  │  │  │   Real-Time     │    │   Search &      │    │   Analytics   │ │ │ │ │
│  │  │  │  │   Dashboard     │    │   Navigation    │    │   Tools       │ │ │ │ │
│  │  │  │  │                 │    │                 │    │               │ │ │ │ │
│  │  │  │  │ • Block         │    │ • Address       │    │ • Fee Gauge   │ │ │ │ │
│  │  │  │  │   Visualization │    │   Search        │    │ • Network Load│ │ │ │ │
│  │  │  │  │ • Transaction   │    │ • Transaction   │    │ • Bitcoin     │ │ │ │ │
│  │  │  │  │   Tracking      │    │   Lookup        │    │   Timeline    │ │ │ │ │
│  │  │  │  │ • Network       │    │ • Block Search  │    │ • Price       │ │ │ │ │
│  │  │  │  │   Status        │    │ • Calculator    │    │   Dashboard   │ │ │ │ │
│  │  │  │  │ • 1-2s Updates  │    │ • Multi-format  │    │ • Hourly      │ │ │ │ │
│  │  │  │  │                 │    │   Search        │    │   Updates     │ │ │ │ │
│  │  │  │  └─────────────────┘    └─────────────────┘    └───────────────┘ │ │ │ │
│  │  │  └──────────────────────────────────────────────────────────────────┘ │ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐              │
│  │   Monitoring    │    │   External      │    │   Development   │              │
│  │   & Logging     │    │   APIs          │    │   Tools         │              │
│  │                 │    │                 │    │                 │              │
│  │ • Prometheus    │    │ • API Access    │    │ • Git           │              │
│  │ • Grafana       │    │ • Enterprise    │    │ • CI/CD         │              │
│  │ • AlertManager  │    │   Integrations  │    │ • Testing       │              │
│  │ • Jaeger        │    │ • Rate Limiting │    │ • Documentation │              │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘              │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Key System Boundaries

### **External Data Sources**

- **Bitcoin Core**: Primary blockchain data source via RPC and .blk files
- **Price Feeds**: Real-time cryptocurrency pricing data (updated hourly)
- **Web Users**: End users accessing the platform

### **Core System Components**

- **electrs (Open Source)**: Raw blockchain data processing with internal RocksDB
- **HTTP API Integration**: Connection pooling, polling, and circuit breaker patterns
- **NodeJS API Layer**: REST and WebSocket APIs with multi-tier caching
- **Storage & Cache Layer**: Redis L1, Memory-mapped L2, PostgreSQL analytics
- **Frontend Layer**: User interface with realistic update frequencies

### **External Interfaces**

- **Monitoring & Logging**: System observability and alerting
- **External APIs**: API access with rate limiting and enterprise integrations
- **Development Tools**: Version control, CI/CD, and testing infrastructure

## Data Flow Summary

1. **Bitcoin Core** → **electrs**: Raw blockchain data ingestion via RPC/.blk files
2. **electrs** → **HTTP API (port 3000)**: Indexed data access via REST endpoints
3. **HTTP Client** → **NodeJS Backend**: 1-2 second polling with connection pooling
4. **NodeJS** → **Multi-tier Cache**: Redis L1, Memory-mapped L2, PostgreSQL analytics
5. **API Layer** → **Frontend**: Real-time data delivery via WebSocket (1-2s latency)
6. **Price Feeds** → **Frontend**: Cryptocurrency pricing (hourly updates)
7. **Users** ↔ **Frontend**: Interactive blockchain exploration

## System Characteristics

- **Bitcoin-Exclusive Focus**: Specialized for Bitcoin blockchain analysis
- **Realistic Performance**: 10-50ms cached, 100-500ms database, 1-5s complex queries
- **Multi-Tier Architecture**: HTTP API integration with sophisticated caching
- **User-Centric Design**: Accessible to beginners and professionals
- **Production Ready**: Comprehensive monitoring and error handling with realistic expectations
