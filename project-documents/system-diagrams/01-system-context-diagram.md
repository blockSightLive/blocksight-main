# BlockSight.live - System Context Diagram

## Overview

This System Context Diagram shows BlockSight.live as the central system and its interactions with external entities, data sources, and users. It reflects the corrected electrs interface (Electrum protocol over TCP) and our thin HTTP/JSON + WebSocket adapter in the Node.js backend.

## System Context Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                    EXTERNAL ENTITIES                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────────────────────┐  │
│  │   Bitcoin Core  │    │   Price Feeds   │    │  BlockInsight Consumers      │  │
│  │   (Full Node)   │    │    (APIs)       │    │  (CDN Widgets / Premium App) │  │
│  │                 │    │                 │    │                              │  │
│  │ • RPC, .blk     │    │ • CoinGecko     │    │ • Uses public HTTP/WS        │  │
│  │ • P2P, chain    │    │ • Others        │    │ • Higher SLAs via plan       │  │
│  └─────────────────┘    └─────────────────┘    └──────────────────────────────┘  │
│           │                       │                       ▲                      │
│           │                       │                       │                      │
│           ▼                       ▼                       │                      │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              BLOCKSIGHT.LIVE                               │ │
│  │                                                                            │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                        CORE SYSTEM BOUNDARY                           │ │ │
│  │  │                                                                       │ │ │
│  │  │  ┌─────────────────┐    ┌──────────────────────────────┐             │ │ │
│  │  │  │    electrs      │    │   Node.js Backend            │             │ │ │
│  │  │  │ (Open Source)   │    │  (Our Implementation)        │             │ │ │
│  │  │  │                 │    │                              │             │ │ │
│  │  │  │ • Electrum TCP  │    │ • Electrum Client Adapter    │             │ │ │
│  │  │  │   (50001/50002) │    │   (TCP → HTTP/JSON + WS)     │             │ │ │
│  │  │  │ • RocksDB       │    │ • REST API + WebSocket Hub   │             │ │ │
│  │  │  │   (Internal)    │    │ • Multi‑tier Caching         │             │ │ │
│  │  │  │ • Indexing      │    │ • Analytics ETL → PostgreSQL │             │ │ │
│  │  │  └─────────────────┘    └──────────────────────────────┘             │ │ │
│  │  │           │                           │                               │ │ │
│  │  │           └──────────────┬────────────┘                               │ │ │
│  │  │                          │                                            │ │ │
│  │  │  ┌──────────────────────────────────────────────────────────────────┐ │ │ │
│  │  │  │                    STORAGE & CACHE LAYER                         │ │ │ │
│  │  │  │                                                                  │ │ │ │
│  │  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌───────────────┐ │ │ │ │
│  │  │  │  │   Redis L1      │    │   Memory‑mapped │    │  PostgreSQL   │ │ │ │ │
│  │  │  │  │   (Hot Cache)   │    │   L2 (Warm)     │    │  (Analytics)  │ │ │ │ │
│  │  │  │  │ • 1‑2s TTL      │    │ • UTXO, recent  │    │ • Views/MVs   │ │ │ │ │
│  │  │  │  │ • ~0.1‑1ms      │    │   data ~1‑5ms   │    │ • 100‑500ms   │ │ │ │ │
│  │  │  │  └─────────────────┘    └─────────────────┘    └───────────────┘ │ │ │ │
│  │  │  └──────────────────────────────────────────────────────────────────┘ │ │ │
│  │  │                                   │                                   │ │ │
│  │  │  ┌──────────────────────────────────────────────────────────────────┐ │ │ │
│  │  │  │                      FRONTEND LAYER                              │ │ │ │
│  │  │  │                                                                  │ │ │ │
│  │  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌───────────────┐ │ │ │ │
│  │  │  │  │   Real‑Time     │    │   Search &      │    │   Analytics   │ │ │ │ │
│  │  │  │  │   Dashboard     │    │   Navigation    │    │   Tools       │ │ │ │ │
│  │  │  │  │ • WS updates    │    │ • Address/Tx    │    │ • Fee/Load    │ │ │ │ │
│  │  │  │  │   1‑2s          │    │   lookup        │    │   timelines   │ │ │ │ │
│  │  │  │  └─────────────────┘    └─────────────────┘    └───────────────┘ │ │ │ │
│  │  │  └──────────────────────────────────────────────────────────────────┘ │ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────────────────────┐  │
│  │ Monitoring &    │    │ External APIs   │    │  Dev Tooling                 │  │
│  │ Observability   │    │ (Price, etc.)   │    │  (Git, CI/CD, Testing)       │  │
│  │ • Prom/Grafana  │    │ • Rate limiting │    │ • Pipelines, checks          │  │
│  │ • Alerts/Logs   │    │ • Backoff       │    │ • ADRs/Runbooks              │  │
│  └─────────────────┘    └─────────────────┘    └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Key System Boundaries

### External Data Sources
- Bitcoin Core: Primary blockchain source via RPC/.blk (electrs consumes)
- Price Feeds: External market data (hourly or on change)
- BlockInsight Consumers: External clients of our public HTTP/WS surfaces

### Core System Components
- electrs (Open Source): Indexing + internal RocksDB; Electrum protocol over TCP
- Node.js Backend: Electrum client adapter → HTTP/JSON + WebSocket; multi‑tier caching; analytics ETL to PostgreSQL
- Storage & Cache: Redis L1, Memory‑mapped L2, PostgreSQL analytics mirror
- Frontend: Real‑time UI driven by WS and cached HTTP

### External Interfaces
- Monitoring & Logging: Prometheus, Grafana, structured logs, alerts
- External APIs: Price sources with rate limiting and backoff
- Dev Tooling: GitHub Actions, IaC, testing frameworks

## Data Flow Summary

1. Bitcoin Core → electrs: electrs indexes blockchain data; exposes Electrum TCP
2. Node Electrum Adapter (TCP) → Caches: subscribe to headers/mempool; populate Redis L1 and L2
3. Adapter → HTTP/JSON + WebSocket: expose REST endpoints and push real‑time events
4. API Layer → Frontend: UI consumes cached HTTP and WS events with 1‑2s freshness
5. Price Feeds → Backend: hourly/on‑change updates; cached and forwarded to UI as needed
6. Analytics ETL → PostgreSQL mirror: minimal subset mirrored for human‑friendly SQL views/MVs (no direct RocksDB reads)

## System Characteristics

- Bitcoin‑Exclusive Focus: Specialized for Bitcoin; Electrum protocol integration
- Real‑Time Performance: 1‑2s tip detection with WS pushes; sub‑50ms cache hits
- Multi‑Tier Architecture: Redis L1, memory‑mapped L2, PostgreSQL analytics mirror
- Production‑Ready: HA electrs, health checks, circuit breakers, rollback, observability
