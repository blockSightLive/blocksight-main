# BlockSight.live - Class Diagrams

/**
 * @fileoverview Class diagrams showing the object-oriented structure of BlockSight.live
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-11
 * @lastModified 2025-08-29
 * 
 * @description
 * This file contains class diagrams showing the object-oriented architecture of BlockSight.live,
 * including frontend components, backend adapters, and infrastructure classes. It reflects our
 * current implementation status with CoreRpcAdapter, completed frontend, and Vercel staging.
 * 
 * @dependencies
 * - 00-model-spec.md (single source of truth)
 * - Current system implementation status
 * 
 * @usage
 * Reference for understanding object relationships and class structure
 * 
 * @state
 * Updated to reflect current implementation status
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - Add ThreeJS classes when implemented
 * - Update with new components as added
 * 
 * @performance
 * - Reflects current performance characteristics
 * - Shows class interaction patterns
 * 
 * @security
 * - 100% passive system architecture
 * - No blockchain write access
 */

## Overview

This file contains class diagrams showing the object-oriented architecture of BlockSight.live, including frontend components, backend adapters, and infrastructure classes. It reflects our current implementation status with CoreRpcAdapter, completed frontend, and Vercel staging deployment.

## Frontend Class Architecture ✅ **IMPLEMENTED**

### Core Application Classes

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND CLASS ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────────────────────┐ │
│  │     App.tsx     │    │   Dashboard.tsx │    │   BitcoinContext.tsx         │ │
│  │                 │    │                 │    │                              │ │
│  │                 │    │                 │    │                              │ │
│  │ • Splash Screen │    │ • Three-Column  │    │ • Bitcoin State Mgmt         │ │
│  │ • Routing       │    │   Layout        │    │ • API Integration            │ │
│  │ • Theme Context │    │ • Search Area   │    │ • WebSocket Hook             │ │
│  │ • i18n Setup    │    │ • Visualizer    │    │ • Validation Utils           │ │
│  │ • Performance   │    │ • Dashboard     │    │ • Pattern Recognition        │ │
│  │   Features      │    │   Data          │    │ • Error Handling             │ │
│  └─────────────────┘    └─────────────────┘    └──────────────────────────────┘ │
│           │                       │                       │                     │
│           ▼                       ▼                       ▼                     │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                           COMPONENT LIBRARY                                │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │     Header      │    │  LoadingBlocks  │    │   BitcoinPrice         │  │ │
│  │  │                 │    │                 │    │   Dashboard            │  │ │
│  │  │                 │    │                 │    │                        │  │ │
│  │  │ • Navigation    │    │ • Loading       │    │ • Real-time Price      │  │ │
│  │  │ • Theme Toggle  │    │   Animations    │    │ • Fee Estimates        │  │ │
│  │  │ • Language      │    │ • 3D Design     │    │ • Network Status       │  │ │
│  │  │   Switcher      │    │   System        │    │ • Mempool Data         │  │ │
│  │  │ • Responsive    │    │ • Splash        │    │ • Performance          │  │ │
│  │  │   Design        │    │   Screen        │    │   Metrics              │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                            STYLES SYSTEM                                   │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   CSS Modules   │    │ CSS Custom      │    │ Styled Components      │  │ │
│  │  │                 │    │ Properties      │    │                        │  │ │
│  │  │                 │    │                 │    │                        │  │ │
│  │  │ • Component     │    │ • Theme Tokens  │    │ • Dynamic Styling      │  │ │
│  │  │   Isolation     │    │ • Global Vars   │    │ • Theme Integration    │  │ │
│  │  │ • Grid Systems  │    │ • Responsive    │    │ • Animations           │  │ │
│  │  │ • 3D Containers │    │   Breakpoints   │    │ • Interactive          │  │ │
│  │  │ • Layout Mgmt   │    │ • Color Schemes │    │ • Performance          │  │ │
│  │  │ • Responsive    │    │ • Typography    │    │ • Spacing              │  │ │
│  │  │   Design        │    │ • Spacing       │    │ • Optimized            │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Frontend Class Relationships

- **App.tsx** → **BitcoinContext.tsx**: Global state initialization
- **App.tsx** → **Dashboard.tsx**: Main application routing
- **Dashboard.tsx** → **Component Library**: UI component composition
- **BitcoinContext.tsx** → **WebSocket Hook**: Real-time data management
- **Components** → **Styles System**: Dynamic styling and theming

## Backend Class Architecture **IMPLEMENTED**

### Adapter Classes

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND CLASS ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────────────────────┐ │
│  │ CoreRpcAdapter  │    │ ElectrumAdapter │    │   WebSocketHub               │ │
│  │                 │    │                 │    │                              │ │
│  │                 │    │                 │    │                              │ │
│  │ • Bitcoin Core  │    │ • TCP Client    │    │ • Real-time Events           │ │
│  │   RPC           │    │ • JSON Parsing  │    │ • Tip Height                 │ │
│  │ • Direct        │    │ • Event         │    │ • Reorg Detection            │ │
│  │   Integration   │    │   Streaming     │    │ • Fee Updates                │ │
│  │ • Enhanced      │    │ • Connection    │    │ • Price Updates              │ │
│  │   Reliability   │    │   Pooling       │    │ • Event Broadcasting         │ │
│  │ • Fallback      │    │ • Health Checks │    │ • Connection Mgmt            │ │
│  │   Strategy      │    │ • Error Handling│    │ • Heartbeat Monitor          │ │
│  └─────────────────┘    └─────────────────┘    └──────────────────────────────┘ │
│           │                       │                       │                     │
│           ▼                       ▼                       ▼                     │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                            API LAYER                                       │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │     Routes      │    │   Controllers   │    │   Middleware           │  │ │
│  │  │                 │    │                 │    │                        │  │ │
│  │  │                 │    │                 │    │                        │  │ │
│  │  │ • /electrum/*   │    │ • Health        │    │ • CORS                 │  │ │
│  │  │ • /health       │    │ • Fee Estimates │    │ • Rate Limiting        │  │ │
│  │  │ • /network/*    │    │ • Network Data  │    │ • Error Handling       │  │ │
│  │  │ • /mempool      │    │ • Mempool Info  │    │ • Logging              │  │ │
│  │  │ • RESTful       │    │ • Data          │    │ • Authentication       │  │ │
│  │  │   Endpoints     │    │   Validation    │    │ • Compression          │  │ │
│  │  │ • WebSocket     │    │ • Response      │    │ • Security             │  │ │
│  │  │   Support       │    │   Formatting    │    │   Headers              │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                      CACHE LAYER                                           │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   Redis L1      │    │ Memory-mapped   │    │ PostgreSQL Analytics   │  │ │
│  │  │                 │    │ L2              │    │ Mirror                 │  │ │
│  │  │                 │    │                 │    │                        │  │ │
│  │  │ • Hot Cache     │    │ • Warm Cache    │    │ • Analytics Views      │  │ │
│  │  │ • 1-2s TTL      │    │ • UTXO Data     │    │ • Materialized Views   │  │ │
│  │  │ • ~0.1-1ms      │    │ • Recent Blocks │    │ • 100-500ms            │  │ │
│  │  │ • Real-time     │    │ • ~1-5ms        │    │ • Human-friendly SQL   │  │ │
│  │  │   Updates       │    │ • Memory        │    │ • Performance          │  │ │
│  │  │ • WebSocket     │    │   Efficient     │    │   Analytics            │  │ │
│  │  │   Events        │    │ • Fast Access   │    │ • Data Mining          │  │ │
│  │  │ • Session Mgmt  │    │ • Persistent    │    │ • Historical Trends    │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Backend Class Relationships

- **CoreRpcAdapter** ↔ **Bitcoin Core**: Direct RPC communication
- **ElectrumAdapter** ↔ **electrs**: TCP-based blockchain indexing
- **WebSocketHub** → **Frontend**: Real-time event broadcasting
- **Routes** → **Controllers**: `/api/v1/*` endpoint handling with standardized response formats
- **Controllers** → **Adapters**: Data retrieval and processing
- **Cache Layer** → **API Responses**: Multi-tier caching optimization

## Infrastructure Class Architecture **IMPLEMENTED**

### Deployment & Monitoring Classes

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           INFRASTRUCTURE CLASS ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────────────────────┐ │
│  │     Vercel      │    │     Docker      │    │   GitHub Actions             │ │
│  │                 │    │                 │    │                              │ │
│  │                 │    │                 │    │                              │ │
│  │ • Frontend      │    │ • Local Dev     │    │ • CI/CD Pipeline             │ │
│  │   Staging       │    │   Environment   │    │ • Automated Testing          │ │
│  │ • Auto-deploy   │    │ • electrs       │    │ • Type Checking              │ │
│  │ • Edge Network  │    │   Container     │    │ • Linting                    │ │
│  │ • Analytics     │    │ • Redis         │    │ • Build Verification         │ │
│  │ • Performance   │    │   Container     │    │ • Security Scanning          │ │
│  │   Monitoring    │    │ • PostgreSQL    │    │ • Dependency Updates         │ │
│  │ • Global CDN    │    │   Container     │    │ • Release Management         │ │
│  └─────────────────┘    └─────────────────┘    └──────────────────────────────┘ │
│           │                       │                       │                     │
│           ▼                       ▼                       ▼                     │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                        MONITORING                                          │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   Prometheus    │    │     Grafana     │    │       Logging          │  │ │
│  │  │                 │    │                 │    │                        │  │ │
│  │  │                 │    │                 │    │                        │  │ │
│  │  │ • Metrics       │    │ • Dashboards    │    │ • Structured Logs      │  │ │
│  │  │   Collection    │    │ • Visualization │    │ • Error Tracking       │  │ │
│  │  │ • Performance   │    │ • Alerting      │    │ • Performance          │  │ │
│  │  │   Data          │    │ • Real-time     │    │   Monitoring           │  │ │
│  │  │ • Health        │    │   Monitoring    │    │ • Audit Trail          │  │ │
│  │  │   Checks        │    │ • Custom        │    │ • Debug Info           │  │ │
│  │  │ • Custom        │    │   Metrics       │    │ • Security Events      │  │ │
│  │  │   Metrics       │    │ • Historical    │    │ • System Health        │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Infrastructure Class Relationships

- **Vercel** → **Frontend**: Staging deployment and global CDN
- **Docker** → **Local Development**: Consistent environment containers
- **GitHub Actions** → **CI/CD**: Automated testing and deployment
- **Monitoring Stack** → **Performance**: Real-time metrics and alerting

## Class Design Patterns **IMPLEMENTED**

### Frontend Patterns
- **Context Pattern**: BitcoinContext for global state management
- **Hook Pattern**: useWebSocket for real-time data handling
- **Component Composition**: Modular UI component architecture
- **CSS-in-JS**: Styled Components for dynamic styling

### Backend Patterns
- **Adapter Pattern**: CoreRpcAdapter and ElectrumAdapter
- **Factory Pattern**: Connection pooling and adapter creation
- **Observer Pattern**: WebSocket event broadcasting
- **Strategy Pattern**: Multi-tier caching strategies

### Infrastructure Patterns
- **Container Pattern**: Docker-based service isolation
- **Pipeline Pattern**: CI/CD automation workflows
- **Observer Pattern**: Monitoring and alerting systems

## Current Implementation Status

### **COMPLETED CLASSES**
- **Frontend**: Complete React component hierarchy with 3D design system
- **Backend**: CoreRpcAdapter, ElectrumAdapter, WebSocketHub, and API layer
- **Infrastructure**: Vercel staging, Docker development, and CI/CD pipeline
- **Performance**: All targets achieved, ready for ThreeJS integration

### 🎯 **NEXT PHASE GOALS**
- **ThreeJS Classes**: 3D blockchain visualization component hierarchy
- **Enhanced Components**: Additional dashboard widgets and analytics components
- **Mobile Classes**: Mobile-specific component architecture
- **Advanced Patterns**: Additional design patterns for scalability

