# BlockSight.live - Data Flow Diagram

## Overview

This Data Flow Diagram reflects the corrected Electrum TCP integration, our Node.js adapter (HTTP/JSON + WebSocket), subscriptions-first real-time model, multi-tier caching, and a read-only PostgreSQL mirror for analytics and exploration.

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
│  │  │ headers.sub     │    │ keep‑alive TCP  │    │ backoff/half‑open      │  │ │
│  │  │ scripthash.*    │    │ bounded sockets │    │ node quarantine        │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                            MULTI‑TIER CACHE FLOW                           │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   Redis L1      │    │  Memory‑Mapped  │    │   HTTP Cache (Our API) │  │ │
│  │  │   (Hot, 1‑2s)   │    │  L2 (Warm)      │    │   L3 (1s‑24h)          │  │ │
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
│  │  │ blocks/txs/addr │    │ headers/fees    │    │ mirror (views/MVs)     │  │ │
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

### 1. Ingestion & Subscriptions (Real‑Time)
1. Bitcoin Core → electrs: electrs indexes blockchain data into internal RocksDB and serves Electrum TCP.
2. Node ElectrumClient subscribes to headers and (optionally) scripthash/mempool signals.
3. On new header/mempool change: update Redis L1 and Memory‑Mapped L2; emit WebSocket events.

### 2. Read Path (User/API Retrieval)
1. Client/API request → L1 (Redis) lookup (~0.1‑1ms)
2. Miss → L2 (Memory‑mapped) (~1‑5ms)
3. Miss → HTTP Cache (our adapter responses) (~5‑20ms)
4. Miss → Electrum call via ElectrumClient (bounded, circuit‑protected)
5. Heavy analytics → PostgreSQL mirror (views/MVs, ~100‑500ms)

### 3. Real‑Time Push
- Electrum headers/mempool → ElectrumClient → Cache (L1/L2) → WebSocket broadcast (1‑2s freshness)
- Price feeds → Adapter → Cache → WS update on change (hourly default)

### 4. Analytics & ETL
- Adapter batches minimal subset into PostgreSQL (append‑only, idempotent upserts)
- Provide SQL views/MVs for human‑friendly queries and dashboards
- Scheduled/materialized refresh; bounded lag with backpressure

### 5. Search Flow (Address/Tx/Block)
1. Address query → derive scripthash → Electrum get_history/get_balance (paged)
2. Cache responses; enforce pagination and response size limits
3. Long histories/rollups → PostgreSQL views/MVs

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
