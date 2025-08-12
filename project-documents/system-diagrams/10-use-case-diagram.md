# BlockSight.live - Use Case Diagram (High Level)

## Scope
End users and system actors interacting with the adapter and analytics surfaces.

```mermaid
flowchart TB
  actorUser([End User])
  actorDev([Developer / Integrator])
  actorNode([Bitcoin Core / electrs])
  actorAnalytics([Data Analyst])

  subgraph Adapter[Electrum Adapter]
    uc1((Query Address History))
    uc2((Subscribe Mempool Tx))
    uc3((Get Fee Estimates))
    uc4((Broadcast Transaction))
  end

  subgraph Analytics[Analytics Platform]
    uc5((Aggregate On‑chain Metrics))
    uc6((Export to Warehouse))
  end

  actorUser --> uc1
  actorUser --> uc2
  actorUser --> uc3
  actorUser --> uc4

  actorDev --> uc1
  actorDev --> uc2
  actorDev --> uc4

  actorAnalytics --> uc5
  uc5 --> uc6

  actorNode <---> Adapter
```

Notes
- End User and Developer consume REST/WS surfaces; Node provides ground truth (Bitcoin Core/electrs).
- Analytics aggregates derived metrics and exports to long‑term storage.
