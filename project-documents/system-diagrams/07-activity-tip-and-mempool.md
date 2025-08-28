# BlockSight.live - Activity Diagram: Tip & Mempool Pipeline (High Level)

## Overview

Current polling-first real-time flow (subscriptions planned): Electrum TCP → Node adapter (ElectrumClient + polling loops) → WebSocket push; mempool-driven fee snapshots; backpressure and degradation paths. Caches and breaker are planned.

```mermaid
flowchart TD
  %% Sources
  A[Bitcoin Core] --> B[electrs (Electrum TCP 50001/50002)]
  B -. TCP connect .-> C[ElectrumClient (Node Adapter)]

  %% Reliability gates
  C --> D{Adapter reachable?}
  D -- No --> E[Degraded Mode Notice]
  F --> G[Alert & Metrics] --> H[End]

  D -- Yes --> I[Poll height/fees/mempool (5s/15s/10s)]

  %% Branch: Tip updates
  I --> L{Change Detected?}
  L -- Tip height --> M[Broadcast WS: tip.height]
  M --> N[Frontend UI update (1–2s freshness)]

  %% Branch: Mempool → fee analysis
  L -- Fees --> O[Fee estimates changed]
  O --> Q[Broadcast WS: network.fees]
  Q --> R[Frontend fee gauge update]

  %% Backpressure / Budgets
  subgraph Backpressure
    S{Over Budget?}
    S -- Yes --> T[Degrade: reduce freq / cap payload / drop non‑critical]
    T --> U[Persist minimal summary only]
    U --> V[WS minimal events]
    S -- No --> W[Normal cadence]
  end

  %% Backpressure hooks integrate with polling cadence (planned)

  %% ETL to PostgreSQL mirror (async, bounded)
  subgraph Analytics Mirror
    X[Adapter ETL: blocks/tx/address summaries] --> Y[PostgreSQL Views/MVs]
  end
  I --> X

  %% Monitoring
  subgraph Observability
    Z[Prometheus metrics: electrum_call_latency_ms, tip_lag_blocks, errors_total, subscriptions_active, reconnects_total, cache_hit_rate]
  end
  C --> Z
  E --> Z
  O --> Z
  M --> Z
  Q --> Z

  H[End]
```

Notes
- Primary path is polling (current); subscriptions will replace or augment polling.
- Cache-first delivery ensures sub-50ms hits on hot paths; TTLs enforce freshness.
- Backpressure enforces SLO budgets with graceful degradation; alerts fire on divergence/tip lag.
- ETL mirrors a minimal subset to PostgreSQL for human‑friendly analytics without touching RocksDB directly.
