# BlockSight.live - Activity Diagram: Tip & Mempool Pipeline (High Level)

## Overview

Subscriptions-first real-time flow: Electrum TCP → Node adapter (ElectrumClient + Pool/Breaker) → Multi-tier caches (L1/L2) → WebSocket push; mempool-driven fee analysis; backpressure and degradation paths.

```mermaid
flowchart TD
  %% Sources
  A[Bitcoin Core] --> B[electrs (Electrum TCP 50001/50002)]
  B -- headers.subscribe / mempool signals --> C[ElectrumClient (Node Adapter)]

  %% Reliability gates
  C --> D{Breaker / Pool OK?}
  D -- No --> E[Serve from Cache (L1/L2)] --> F[Degraded Mode Notice]
  F --> G[Alert & Metrics] --> H[End]

  D -- Yes --> I[Fetch/Receive Header or Mempool Summary]
  I --> J[Update Redis L1 (hot, 1–2s TTL)]
  J --> K[Update Memory‑Mapped L2 (warm)]

  %% Branch: Tip updates
  I --> L{Event Type}
  L -- Header/Tip --> M[Broadcast WS: tip/header]
  M --> N[Frontend UI update (1–2s freshness)]

  %% Branch: Mempool → fee analysis
  L -- Mempool --> O[Analyze fees (sats/vB, percentiles)]
  O --> P[Cache fee bands (short TTL)]
  P --> Q[Broadcast WS: fee update]
  Q --> R[Frontend fee gauge update]

  %% Backpressure / Budgets
  subgraph Backpressure
    S{Over Budget?}
    S -- Yes --> T[Degrade: reduce freq / cap payload / drop non‑critical]
    T --> U[Persist minimal summary only]
    U --> V[WS minimal events]
    S -- No --> W[Normal cadence]
  end

  K --> S
  P --> S

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
- Primary path is subscriptions; polling is fallback only through the adapter.
- Cache-first delivery ensures sub-50ms hits on hot paths; TTLs enforce freshness.
- Backpressure enforces SLO budgets with graceful degradation; alerts fire on divergence/tip lag.
- ETL mirrors a minimal subset to PostgreSQL for human‑friendly analytics without touching RocksDB directly.
