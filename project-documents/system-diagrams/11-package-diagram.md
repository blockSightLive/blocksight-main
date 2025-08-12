# BlockSight.live - Package Diagram

## Overview
Logical packaging of components and their dependencies.

```mermaid
classDiagram
  namespace Adapter {
    class HttpApi
    class WebSocketHub
    class ElectrumClient
    class CacheManager
    class CircuitBreaker
    class ContractSchemas
  }

  namespace Core {
    class DomainModels
    class UseCases
    class Validation
  }

  namespace Infra {
    class RedisL1
    class MemoryMapL2
    class PostgreSQL
    class Logger
    class Config
  }

  namespace Frontend {
    class WebApp
    class SDK
  }

  HttpApi --> ContractSchemas
  WebSocketHub --> ContractSchemas
  ElectrumClient --> CircuitBreaker
  CacheManager --> RedisL1
  CacheManager --> MemoryMapL2

  UseCases --> ElectrumClient
  UseCases --> CacheManager
  UseCases --> Validation
  UseCases --> DomainModels

  HttpApi --> UseCases
  WebSocketHub --> UseCases

  WebApp --> SDK
  SDK --> HttpApi
  SDK --> WebSocketHub

  ETL : from Adapter to Infra.PostgreSQL
```

Notes
- `Adapter` exposes interfaces, `Core` hosts business logic, `Infra` provides persistence and operational concerns, `Frontend` consumes exposed contracts.
- Electrum access is guarded by circuit breaker; caching uses multi‑tier approach.
- Current choice: use `electrum-client` behind an adapter interface; later we may swap to a custom TCP wrapper without changing higher layers.
