# BlockSight.live - Deployment Diagram (High Level)

## Overview

Physical deployment and traffic flow aligned with Electrum TCP (50001/50002), a Node.js Electrum adapter exposing HTTP/JSON + WebSocket, multi‑tier caching in front of our adapter, and private electrs/Core networking.

## Deployment Diagram (Production)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              PRODUCTION INFRASTRUCTURE                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              EDGE & LOAD BALANCING                         │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   CDN/Edge      │    │   Load Balancer │    │   HTTP Cache (L3)      │  │ │
│  │  │   (Cloudflare)  │    │   (HAProxy/NLB) │    │   (Adapter Responses)  │  │ │
│  │  │ • Global CDN    │    │ • SSL/TLS       │    │ • 1s–24h TTL           │  │ │
│  │  │ • DDoS          │    │   Termination   │    │ • ~5–20ms              │  │ │
│  │  │   Protection    │    │ • Health Checks │    │ • Public HTTP only     │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  │           │                       │                       │                │ │
│  │           └───────────────────────┼───────────────────────┘                │ │
│  │                                   │                                        │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                        CORE APPLICATION TIER                          │ │ │
│  │  │                              (Node.js)                                │ │ │
│  │  │                                                                       │ │ │
│  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    │ │ │
│  │  │  │   API Server 1  │    │   API Server 2  │    │   API Server 3  │    │ │ │
│  │  │  │  (Adapter:      │    │  (Adapter:      │    │  (Adapter:      │    │ │ │
│  │  │  │   HTTP+WS)      │    │   HTTP+WS)      │    │   HTTP+WS)      │    │ │ │
│  │  │  │ • ElectrumClient│    │ • ElectrumClient│    │ • ElectrumClient│    │ │ │
│  │  │  │ • REST/WS       │    │ • REST/WS       │    │ • REST/WS       │    │ │ │
│  │  │  │ • Cache (L1/L2) │    │ • Cache (L1/L2) │    │ • Cache (L1/L2) │    │ │ │
│  │  │  │ • Subscriptions │    │ • Subscriptions │    │ • Subscriptions │    │ │ │
│  │  │  └─────────────────┘    └─────────────────┘    └─────────────────┘    │ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                         ELECTRUM INTEGRATION LAYER                         │ │
│  │                           (Private Networking)                             │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │ Connection Pool │    │ Circuit Breaker │    │ Endpoint Router        │  │ │
│  │  │ • Persistent    │    │ • Open/Half/    │    │ • Multiple electrs     │  │ │
│  │  │   sockets       │    │   Closed        │    │   endpoints (TCP)      │  │ │
│  │  │ • Heartbeats    │    │ • JitterBackoff │    │ • Health Scores        │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  │                                   │                                        │ │
│  │                                   ▼                                        │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                           ELECTRS TIER                                │ │ │
│  │  │                         (Open Source, Rust)                           │ │ │
│  │  │                                                                       │ │ │
│  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    │ │ │
│  │  │  │   electrs 1     │    │   electrs 2     │    │   electrs 3     │    │ │ │
│  │  │  │ • Electrum TCP  │    │ • Electrum TCP  │    │ • Electrum TCP  │    │ │ │
│  │  │  │   50001/50002   │    │   50001/50002   │    │   50001/50002   │    │ │ │
│  │  │  │ • RocksDB (int.)│    │ • RocksDB (int.)│    │ • RocksDB (int.)│    │ │ │
│  │  │  │ • Two‑phase idx │    │ • Two‑phase idx │    │ • Two‑phase idx │    │ │ │
│  │  │  └─────────────────┘    └─────────────────┘    └─────────────────┘    │ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                           BITCOIN CORE TIER                                │ │
│  │  • Full nodes (RPC/.blk/P2P)  • Private subnets  • SSD/NVMe                │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                        MULTI‑TIER CACHE & STORAGE                          │ │
│  │  • Redis L1 (hot, 1–2s)  • Memory‑mapped L2 (warm) • PostgreSQL (analytics)│ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                           MONITORING & OBSERVABILITY                       │ │
│  │  • Prometheus/Grafana • Alerts • Tracing (OTel) • Tip‑lag/Errors/Reconn    │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Deployment Diagram (Dev - Containerized)

```mermaid
graph TD
  subgraph Dev[Docker Compose Network]
    Backend[Backend Container]
    Redis[(Redis Container)]
    UI[Frontend Container]
    Electrs[electrs (container or host service)]
  end
  VM[Linux VM: Bitcoin Core]

  Backend --> Redis
  Backend --> Electrs
  UI --> Backend

  classDef dim fill:#f7f7f7,stroke:#ccc,color:#333;
  class Dev dim;
```

## Architecture Notes

### Electrum Integration Architecture (corrected)
- Transport: TCP (Electrum JSON messages). Keep persistent sockets, limited concurrency.
- Connection management: heartbeats (server.ping), timeouts, jittered backoff, endpoint health.
- Subscriptions‑first: headers/mempool subscriptions drive WS; polling is fallback only.
- High availability: multiple electrs endpoints; route by health score; quarantine on errors.

### Performance Characteristics (signals and cadence)
- Real‑time: WS freshness 1–2s for headers; new blocks ~10 min average.
- Cache: Redis L1 ~0.1–1ms; mmap L2 ~1–5ms; HTTP cache (adapter) ~5–20ms.
- Electrum calls: bounded latency (pooled); shed load on budget breaches.

### Multi‑Tier Caching
- HTTP cache fronts our adapter endpoints (not electrs).
- Redis L1 for hot data; memory‑mapped L2 for warm UTXO/recent sets.
- PostgreSQL is a read‑only mirror (views/MVs) for heavy queries; no direct RocksDB reads.

### Network Security
- Private subnets for Bitcoin Core and electrs; expose only Electrum TCP (50001/50002) internally.
- Public subnets for API/WS behind gateway/LB; TLS termination at edge.
- Strict SG/ACL rules; no public electrs/Core.

### Monitoring, CI, & Alerts
- Metrics: electrum_call_latency_ms{method}, electrum_errors_total{type}, tip_lag_blocks, subscriptions_active, reconnects_total, cache_hit_rate.
- Alerts: Core/electrs divergence, persistent tip lag, reconnect storms, error‑rate spikes.
 - CI: container builds; backend checks (typecheck, ESLint v9 flat config lint, build, Jest tests).

### Deployment & Rollback
- Blue‑green / canary on API tier; feature flags for risky paths.
- Breaker‑guarded Electrum calls; automated rollback on SLO breach.

### Disaster Recovery
- PostgreSQL PITR, Redis persistence; electrs can reindex from Core; configuration in VCS.

### Security
- Least privilege (users, fs), secret management, SBOM/licensing; TLS on inter‑tier hops where needed.
