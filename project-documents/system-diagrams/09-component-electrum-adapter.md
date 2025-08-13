# BlockSight.live - Component Diagram: Electrum Adapter Internals (High Level)

## Overview

Internal components of the Node.js adapter that bridges Electrum TCP to public HTTP/JSON + WebSocket, with reliability and caching.

```mermaid
flowchart LR
  subgraph Adapter[Node.js Electrum Adapter]
    EC[ElectrumClient (adapter interface)]
    CP[ConnectionPool]
    BR[CircuitBreaker]
    CT[Contract Schemas]
    CA[CacheManager]
    API[REST Controllers]
    WS[WebSocket Hub]
    ETL[Analytics ETL]
  end

  EC --- CP
  EC --- BR
  API --- CA
  WS --- CA
  ETL --- CA
  API --- CT
  WS --- CT

  subgraph Caches
    L1[Redis L1]
    L2[Memory‑Mapped L2]
    HC[HTTP Cache (Adapter Responses)]
  end

  CA --- L1
  CA --- L2
  API -.-> HC

  subgraph External
    ELEC[electrs (Electrum TCP 50001/50002)]
    UI[Frontend Clients or Container]
    PSQL[PostgreSQL (Views/MVs)]
  end

  ELEC <-- TCP JSON --> EC
  %% Note: EC is an adapter interface; implementation starts with electrum-client and may be swapped for a custom TCP wrapper later without changing higher layers.
  API <-- HTTP/JSON --> UI
  WS  <-- WS Events --> UI
  ETL --> PSQL

  %% Notes
  classDef dim fill:#f7f7f7,stroke:#ccc,color:#333;
  class Adapter,Caches,External dim;
```

Notes
- ConnectionPool maintains persistent sockets; CircuitBreaker guards Electrum calls.
- CacheManager fronts Redis L1, Memory‑Mapped L2; HTTP cache sits on adapter endpoints (not electrs).
- Contract schemas keep responses stable for REST/WS clients.
- ETL mirrors a minimal subset to PostgreSQL for heavy analytics.
