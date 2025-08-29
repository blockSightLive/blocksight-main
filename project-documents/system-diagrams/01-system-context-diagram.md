# BlockSight.live - System Context Diagram

/**
 * @fileoverview System context diagram showing BlockSight.live as central system with external entities and data sources
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-11
 * @lastModified 2025-08-29
 * 
 * @description
 * This diagram shows BlockSight.live as the central system and its interactions with external entities,
 * data sources, and users. It reflects our current implementation status with CoreRpcAdapter,
 * completed frontend, and Vercel staging deployment.
 * 
 * @dependencies
 * - 00-model-spec.md (single source of truth)
 * - Current system implementation status
 * 
 * @usage
 * Reference for understanding system boundaries and external integrations
 * 
 * @state
 * [DONE] Updated to reflect current implementation status
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - Add ThreeJS integration when implemented
 * - Update with new external integrations as added
 * 
 * @performance
 * - Reflects current performance characteristics
 * - Shows multi-tier caching architecture
 * 
 * @security
 * - 100% passive system architecture
 * - No blockchain write access
 */

## Overview

This System Context Diagram shows BlockSight.live as the central system and its interactions with external entities, data sources, and users. It reflects our current implementation status with CoreRpcAdapter, completed frontend, and Vercel staging deployment.

## System Context Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                    EXTERNAL ENTITIES                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────────────────────┐ │
│  │   Bitcoin Core  │    │   Price Feeds   │    │  BlockInsight Consumers      │ │
│  │   (Full Node)   │    │    (APIs)       │    │  (CDN Widgets / Premium App) │ │
│  │                 │    │                 │    │                              │ │
│  │ • RPC, .blk     │    │ • CoinGecko     │    │ • Uses public HTTP/WS        │ │
│  │ • P2P, chain    │    │ • Others        │    │ • Higher SLAs via plan       │ │
│  └─────────────────┘    └─────────────────┘    └──────────────────────────────┘ │
│           │                       │                       ▲                     │
│           │                       │                       │                     │
│           ▼                       ▼                       │                     │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              BLOCKSIGHT.LIVE                               │ │
│  │                                                                            │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                        CORE SYSTEM BOUNDARY                           │ │ │
│  │  │                                                                       │ │ │
│  │  │   ┌─────────────────┐    ┌──────────────────────────────┐             │ │ │
│  │  │   │    electrs      │    │   Node.js Backend            │             │ │ │
│  │  │   │ (Open Source)   │    │  (Our Implementation)        │             │ │ │
│  │  │   │                 │    │                              │             │ │ │
│  │  │   │ • Electrum TCP  │    │ • Electrum Client Adapter    │             │ │ │
│  │  │   │   (50001/50002) │    │   (TCP → HTTP/JSON + WS)     │             │ │ │
│  │  │   │ • RocksDB       │    │ • CoreRpcAdapter             │             │ │ │
│  │  │   │   (Internal)    │    │ • REST API + WebSocket Hub   │             │ │ │
│  │  │   │ • Indexing      │    │ • Multi‑tier Caching         │             │ │ │
│  │      └─────────────────┘    └──────────────────────────────┘             │ │ │
│  │           │                           │                                  │ │ │
│  │           └──────────────┬────────────┘                                  │ │ │
│  │                          │                                               │ │ │
│  │  ┌──────────────────────────────────────────────────────────────────┐    │ │ │
│  │  │                    STORAGE & CACHE LAYER                         │    │ │ │
│  │  │                                                                  │    │ │ │
│  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌───────────────┐ │    │ │ │
│  │  │  │   Redis L1      │    │   Memory‑mapped │    │  PostgreSQL   │ │    │ │ │
│  │  │  │   (Hot Cache)   │    │   L2 (Warm)     │    │  (Analytics)  │ │    │ │ │
│  │  │  │ • 1‑2s TTL      │    │ • UTXO, recent  │    │ • Views/MVs   │ │    │ │ │
│  │  │  │ • ~0.1‑1ms      │    │   data ~1‑5ms   │    │ • 100‑500ms   │ │    │ │ │
│  │  │  └─────────────────┘    └─────────────────┘    └───────────────┘ │    │ │ │
│  │  └──────────────────────────────────────────────────────────────────┘    │ │ │
│  │                                   │                                      │ │ │
│  │  ┌──────────────────────────────────────────────────────────────────┐    │ │ │
│  │  │                      FRONTEND LAYER                              │    │ │ │
│  │  │                                                                  │    │ │ │
│  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌───────────────┐ │    │ │ │
│  │  │  │   Real‑Time     │    │   Search &      │    │   Analytics   │ │    │ │ │
│  │  │  │   Dashboard     │    │   Navigation    │    │   Tools       │ │    │ │ │
│  │  │  │ • WS updates    │    │ • Address/Tx    │    │ • Fee/Load    │ │    │ │ │
│  │  │  │   1‑2s          │    │   lookup        │    │   timelines   │ │    │ │ │
│  │  │  │ • 3D Design     │    │ • Advanced      │    │ • Advanced    │ │    │ │ │
│  │  │  │   System        │    │   UI Components │    │   Styling     │ │    │ │ │
│  │  │  │ • LoadingBlocks │    │ • Theme System  │    │ • CSS Modules │ │    │ │ │
│  │  │  │ • Splash Screen │    │ • Responsive    │    │ • Custom Props│ │    │ │ │
│  │  │  └─────────────────┘    └─────────────────┘    └───────────────┘ │    │ │ │
│  │  └──────────────────────────────────────────────────────────────────┘    │ │ │
│  │                                                                          │ │ │
│  │  ┌──────────────────────────────────────────────────────────────────┐    │ │ │
│  │  │                    STYLES SYSTEM ARCHITECTURE                    │    │ │ │
│  │  │                                                                  │    │ │ │
│  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌───────────────┐ │    │ │ │
│  │  │  │   CSS Modules   │    │ CSS Custom      │    │ Styled        │ │    │ │ │
│  │  │  │   (Layout)      │    │ Properties      │    │ Components    │ │    │ │ │
│  │  │  │ • Component     │    │ (Theming)       │    │ (Interactive) │ │    │ │ │
│  │  │  │   isolation     │    │ • Theme         │    │ • Dynamic     │ │    │ │ │
│  │  │  │ • Grid systems  │    │   switching     │    │   styling     │ │    │ │ │
│  │  │  │ • 3D containers │    │ • Global tokens │    │ • Animations  │ │    │ │ │
│  │  │  └─────────────────┘    └─────────────────┘    └───────────────┘ │    │ │ │
│  │  └──────────────────────────────────────────────────────────────────┘    │ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────────────────────┐ │
│  │ Monitoring &    │    │ External APIs   │    │  Dev Tooling                 │ │
│  │ Observability   │    │ (Price, etc.)   │    │  (Git, CI/CD, Testing)       │ │
│  │ • Prom/Grafana  │    │ • Rate limiting │    │ • Pipelines, checks          │ │
│  │ • Alerts/Logs   │    │ • Backoff       │    │ • ADRs/Runbooks              │ │
│  └─────────────────┘    └─────────────────┘    └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Key System Boundaries

### External Data Sources
- **Bitcoin Core**: Primary blockchain source via RPC/.blk (electrs consumes) [DONE]
- **Price Feeds**: External market data (hourly or on change) [READY]
- **BlockInsight Consumers**: External clients of our public HTTP/WS surfaces [READY]

### Core System Components
- **electrs (Open Source)**: Indexing + internal RocksDB; Electrum protocol over TCP [DONE]
- **Node.js Backend**: Electrum client adapter → HTTP/JSON + WebSocket; multi‑tier caching; analytics ETL to PostgreSQL [DONE]
- **CoreRpcAdapter**: Direct Bitcoin Core RPC integration [DONE]
- **Storage & Cache**: Redis L1, Memory‑mapped L2, PostgreSQL analytics mirror [DONE]
- **Frontend**: Real‑time UI driven by WS and cached HTTP, advanced 3D design system, comprehensive styling architecture [DONE]

### External Interfaces
- **Monitoring & Logging**: Prometheus, Grafana, structured logs, alerts [READY]
- **External APIs**: Price sources with rate limiting and backoff [READY]
- **Dev Tooling**: GitHub Actions, IaC, testing frameworks [DONE]

### Styles System Architecture [DONE]
- **CSS Modules Layer**: Component isolation, grid systems, 3D containers, layout management
- **CSS Custom Properties Layer**: Dynamic theming, global design tokens, responsive breakpoints
- **Styled Components Layer**: Interactive elements, dynamic styling, animations, theme integration
- **Advanced Features**: 3D design system, LoadingBlocks component, splash screen, responsive optimization

## Data Flow Summary

1. **Bitcoin Core → electrs**: electrs indexes blockchain data; exposes Electrum TCP [DONE]
2. **Node Electrum Adapter (TCP) → Caches**: subscribe to headers/mempool; populate Redis L1 and L2 [DONE]
3. **Adapter → HTTP/JSON + WebSocket**: expose REST endpoints and push real‑time events [DONE]
4. **API Layer → Frontend**: UI consumes cached HTTP and WS events with 1‑2s freshness [DONE]
5. **Price Feeds → Backend**: hourly/on‑change updates; cached and forwarded to UI as needed [READY]
6. **Analytics ETL → PostgreSQL mirror**: minimal subset mirrored for human‑friendly SQL views/MVs [DONE]
7. **Styles System → UI Components**: CSS Modules for layout, Custom Properties for theming, Styled Components for interactions [DONE]

## System Characteristics

- **Bitcoin‑Exclusive Focus**: Specialized for Bitcoin; Electrum protocol integration [DONE]
- **Real‑Time Performance**: 1‑2s tip detection with WS pushes; sub‑50ms cache hits [DONE]
- **Multi‑Tier Architecture**: Redis L1, memory‑mapped L2, PostgreSQL analytics mirror [DONE]
- **Production‑Ready**: HA electrs, health checks, circuit breakers, rollback, observability [DONE]
- **Advanced UI Architecture**: Three-tier CSS system (Modules, Custom Properties, Styled Components), 3D design system, responsive optimization [DONE]
- **CoreRpcAdapter**: Direct Bitcoin Core RPC integration for enhanced reliability [DONE]
- **Vercel Staging**: Frontend deployed and operational [DONE]

## Current Implementation Status

### [DONE] **COMPLETED COMPONENTS**
- **Backend**: CoreRpcAdapter, Electrum adapter, WebSocket hub, multi-tier caching
- **Frontend**: Complete React app, 3D design system, theme system, i18n, responsive design
- **Infrastructure**: Vercel staging deployment, local development environment
- **Performance**: All targets achieved, ready for ThreeJS integration

### [NEXT] **NEXT PHASE GOALS**
- **ThreeJS Integration**: 3D blockchain visualization in center column
- **Dashboard Widgets**: Enhanced fee, network, and timeline displays [NEXT]
- **Mobile Optimization**: Mobile-specific UI improvements [NEXT]

