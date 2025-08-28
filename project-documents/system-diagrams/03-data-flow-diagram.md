# BlockSight.live - Data Flow Diagram

## Overview

This Data Flow Diagram reflects the implemented Electrum TCP integration, our Node.js adapter (HTTP/JSON + WebSocket), current polling-first real-time model (subscriptions planned), multi-tier caching (planned/in progress), and a read-only PostgreSQL mirror for analytics and exploration.

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              EXTERNAL DATA SOURCES                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────────────────────┐ │
│  │   Bitcoin Core  │    │   Price Feeds   │    │ BlockInsight Consumers       │ │
│  │   (Full Node)   │    │    (APIs)       │    │ (CDN / Premium App)          │ │
│  └─────────────────┘    └─────────────────┘    └──────────────────────────────┘ │
│           │                       │                       ▲                     │
│           ▼                       ▼                       │                     │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              INGESTION & INDEXING                          │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐                    ┌────────────────────────────────┐ │ │
│  │  │   Bitcoin Core  │  RPC/.blk + P2P    │            electrs             │ │ │
│  │  │                 │───────────────────▶│ (Electrum TCP, RocksDB inside) │ │ │
│  │  └─────────────────┘                    └────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                         ELECTRUM INTEGRATION (NODE)                        │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │ ElectrumClient  │    │ Connection Pool │    │ Circuit Breaker        │  │ │
│  │  │ tcp/json msgs   │    │ keep‑alive TCP  │    │ backoff/half‑open      │  │ │
│  │  │ (electrum‑client)│   │ bounded sockets │    │ node quarantine        │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                            MULTI‑TIER CACHE FLOW                           │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   Redis L1      │    │  Memory‑Mapped  │    │   HTTP Cache (Our API) │  │ │
│  │  │   (Hot, TTL)    │    │  L2 (Warm)      │    │   L3 (1s‑24h)          │  │ │
│  │  │   ~0.1‑1ms      │    │  ~1‑5ms         │    │   ~5‑20ms              │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              API & WS SURFACES                             │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │    REST API     │    │   WebSocket     │    │    ETL → PostgreSQL    │  │ │
│  │  │ health/fees     │    │ events:         │    │ mirror (views/MVs)     │  │ │
│  │  │ mempool/height  │    │ • tip.height    │    │                         │  │ │
│  │  │ (current MVP)   │    │ • network.fees  │    │                         │  │ │
│  │  │                 │    │ • network.mempool│   │                         │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                      │                     │
│                                    ▼                      ▼                     │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                                 FRONTEND                                   │ │
│  │  • Real‑time dashboard (WS)  • Search & navigation  • Analytics tools      │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Patterns

### 1. Ingestion & Real‑Time (Current: Polling‑First)
1. Bitcoin Core → electrs: electrs indexes blockchain data into internal RocksDB and serves Electrum TCP.
2. Node ElectrumClient connects over TCP and polls:
   - Tip height every ~5s
   - Fee estimates every ~15s
   - Mempool summary every ~10s (Core preferred when enabled; fallback via adapter)
3. On change detection: emit WebSocket events `tip.height`, `network.fees`, `network.mempool` to clients. Subscriptions‑first (headers.sub) is planned.

### 2. Read Path (User/API Retrieval)
1. Client/API request → Adapter endpoints (health, fees, mempool, height) with bounded timeouts.
2. L1 (Redis) lookup (~0.1‑1ms) for hot paths (fees, mempool). Future: L2 (Memory‑mapped) (~1‑5ms) → HTTP Cache (~5‑20ms).
3. Cache miss → Electrum call via ElectrumClient (bounded, circuit‑protected).
4. Heavy analytics (future) → PostgreSQL mirror (views/MVs).

### 3. Real‑Time Push
- Polling results (tip/fees/mempool) → WebSocket broadcast (`tip.height`, `network.fees`, `network.mempool`) with ~1–2s freshness budget.
- Price feeds (future) → Adapter → Cache → WS update on change (hourly default).

### 4. Analytics & ETL (Planned)
- Adapter to batch minimal subset into PostgreSQL (append‑only, idempotent upserts).
- Provide SQL views/MVs for human‑friendly queries and dashboards.
- Scheduled/materialized refresh; bounded lag with backpressure

### 5. Search Flow (Planned)
1. Address query → derive scripthash → Electrum get_history/get_balance (paged).
2. Cache responses; enforce pagination and response size limits.
3. Long histories/rollups → PostgreSQL views/MVs.

## Performance Characteristics

- L1 cache hit: ~0.1‑1ms; L2: ~1‑5ms; HTTP cache: ~5‑20ms
- Electrum call (via adapter): typically tens to hundreds of ms (bounded, pooled)
- PostgreSQL analytics: ~100‑500ms; complex rollups 1‑5s with timeouts
- WS freshness: 1‑2s for headers; blocks ~10min average cadence

## Error Handling & Recovery

### Circuit Breaker & Backoff
- Per‑endpoint breaker (Electrum methods); exponential backoff with jitter
- Half‑open probes to restore traffic; quarantine unhealthy endpoints

### Graceful Degradation
- On Electrum failure: serve cached (L1/L2/HTTP cache) data; warn on staleness
- For heavy queries: prefer PostgreSQL mirror; timeouts with partial results

## Data Validation & Parity
- Tip parity vs Bitcoin Core (height/hash) with alerting on divergence
- Structured response validation; contract tests on adapter endpoints
- Statistical sanity checks for mempool/fee histograms
