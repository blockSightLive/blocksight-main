# BlockSight.live - Component Architecture Diagram

## Overview

This Component Architecture Diagram shows the major system components of BlockSight.live, their responsibilities, and interconnections with realistic implementation boundaries. It corrects electrs integration to Electrum TCP and positions our Node.js adapter as the HTTP/JSON + WebSocket surface.

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
│  │  │   Bitcoin Core  │◄──────────────────►│     electrs     │                │ │
│  │  │   (Full Node)   │   RPC/.blk + P2P   │ (Open Source)   │                │ │
│  │  │                 │                    │ • Electrum TCP  │                │ │
│  │  │ • RPC, .blk     │                    │   (50001/50002) │                │ │
│  │  │ • P2P, chain    │                    │ • RocksDB (int.)│                │ │
│  │  └─────────────────┘                    └─────────────────┘                │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                        ELECTRUM INTEGRATION LAYER                          │ │
│  │                           (Our Implementation)                             │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │ ElectrumClient  │    │ Connection Pool │    │ Circuit Breaker        │  │ │
│  │  │ (TCP JSON msgs) │    │ (Keep‑alive)    │    │ (Open/Half‑open/Closed)│  │ │
│  │  │ • headers.sub   │    │ • Max sockets   │    │ • Backoff+health       │  │ │
│  │  │ • scripthash.*  │    │ • Heartbeats    │    │ • Quarantine nodes     │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                            MULTI‑TIER CACHE LAYER                          │ │
│  │                           (Our Implementation)                             │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   Redis L1      │    │ Memory‑Mapped L2│    │   HTTP Cache (L3)      │  │ │
│  │  │   (Hot)         │    │   (Warm)        │    │   (Nginx, our API)     │  │ │
│  │  │ • 1‑2s TTL      │    │ • UTXO/recent   │    │ • 1s‑24h TTL           │  │ │
│  │  │ • ~0.1‑1ms      │    │   data ~1‑5ms   │    │ • ~5‑20ms              │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                        POSTGRESQL ANALYTICS MIRROR                         │ │
│  │                          (Read‑Only, Views/MVs)                            │ │
│  │   • Minimal subset mirrored via adapter ETL                                │ │
│  │   • Human‑friendly SQL, long/complex queries                               │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                                API LAYER                                   │ │
│  │                              (Node.js Adapter)                             │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   REST API      │    │   WebSocket     │    │   Search & Aggregates  │  │ │
│  │  │ • Blocks/Txs    │    │• Headers/mempool│    │ • Address summary      │  │ │
│  │  │ • Address sum   │    │• Fee bands      │    │ • Fee/Load analytics   │  │ │
│  │  │ • Health/metrics│    │• Tip updates    │    │ • ETL control          │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              FRONTEND LAYER                                │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   Dashboard     │    │   Search        │    │   Analytics Tools      │  │ │
│  │  │ • Real‑time WS  │    │ • Address/Tx    │    │ • Fee/Load graphs      │  │ │
│  │  │ • Tip/blocks    │    │ • Block lookup  │    │ • Timeline, calculator │  │ │
│  │  │ • 3D Design     │    │ • Advanced      │    │ • Advanced             │  │ │
│  │  │   System        │    │   UI Components │    │   Styling              │  │ │
│  │  │ • LoadingBlocks │    │ • Theme System  │    │ • CSS Modules          │  │ │
│  │  │ • Splash Screen │    │ • Responsive    │    │ • Custom Props         │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                            STYLES SYSTEM LAYER                             │ │
│  │                           (CSS Architecture)                               │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   CSS Modules   │    │ CSS Custom      │    │ Styled                 │  │ │
│  │  │   (Layout)      │    │ Properties      │    │ Components             │  │ │
│  │  │ • Component     │    │ (Theming)       │    │ (Interactive)          │  │ │
│  │  │   isolation     │    │ • Theme         │    │ • Dynamic              │  │ │
│  │  │ • Grid systems  │    │   switching     │    │   styling              │  │ │
│  │  │ • 3D containers │    │ • Global tokens │    │ • Animations           │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                      MONITORING & OBSERVABILITY                            │ │
│  │ • Prometheus/Grafana  • Alerts/Logs  • Tracing (OTel)  • Tip‑lag SLOs      │ │
│  │ • Parity checks vs Core (height/hash)  • Error rates  • Reconnect storms   │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

### Data Ingestion Layer
- Bitcoin Core: primary blockchain source via RPC/.blk
- electrs: indexing, internal RocksDB, Electrum protocol over TCP

### Electrum Integration Layer (Our Implementation)
- ElectrumClient: TCP JSON messaging, headers/scripthash subscriptions, requests
- Connection Pool: persistent sockets, heartbeats, bounded concurrency
- Circuit Breaker: backoff, half‑open probes, endpoint quarantine

### Multi‑Tier Cache Layer (Our Implementation)
- Redis L1 (hot): 1‑2s TTL for live data, sub‑millisecond reads
- Memory‑Mapped L2 (warm): UTXO/recent data, ~1‑5ms
- HTTP Cache L3: cache our HTTP adapter responses (not electrs), ~5‑20ms

### PostgreSQL Analytics Mirror
- Read‑only schema, SQL views/MVs for exploration and heavy analytics
- Fed by adapter ETL; idempotent batches; bounded lag

### API Layer (Node.js Adapter)
- REST endpoints: blocks, txs, address summary, mempool/fees, health/metrics
- WebSocket hub: headers, tip changes, mempool/fee updates
- Search/Aggregates: bounded, cached, paginated; ETL orchestration

### Frontend Layer
- Real‑time dashboard with WS updates (1‑2s)
- Search/navigation for blocks/txs/addresses
- Analytics tools: fee gauge, network load, timelines, calculator
- Advanced UI components: 3D design system, LoadingBlocks, splash screen, responsive optimization

### Styles System Layer (CSS Architecture)
- **CSS Modules**: Component isolation, grid systems, 3D containers, layout management
- **CSS Custom Properties**: Dynamic theming, global design tokens, responsive breakpoints
- **Styled Components**: Interactive elements, dynamic styling, animations, theme integration

### Monitoring & Observability
- Metrics: electrum_call_latency, errors_total, tip_lag_blocks, cache_hit
- Alerts: Core/electrs divergence, elevated error rate, reconnect storms
- Tracing: spans around Electrum requests and API routes
