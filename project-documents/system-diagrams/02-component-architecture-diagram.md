# BlockSight.live - Component Architecture Diagram

/**
 * @fileoverview Component architecture diagram showing the internal structure and relationships of BlockSight.live components
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-11
 * @lastModified 2025-08-29
 * 
 * @description
 * This diagram shows the internal component architecture of BlockSight.live, including the completed
 * frontend components, backend adapters, and infrastructure components. It reflects our current
 * implementation status with CoreRpcAdapter, completed frontend, and Vercel staging deployment.
 * 
 * @dependencies
 * - 00-model-spec.md (single source of truth)
 * - Current system implementation status
 * 
 * @usage
 * Reference for understanding internal component relationships and architecture
 * 
 * @state
 * ✅ Updated to reflect current implementation status
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - Add ThreeJS components when implemented
 * - Update with new components as added
 * 
 * @performance
 * - Reflects current performance characteristics
 * - Shows component interaction patterns
 * 
 * @security
 * - 100% passive system architecture
 * - No blockchain write access
 */

## Overview

This Component Architecture Diagram shows the internal structure and relationships of BlockSight.live components, including the completed frontend components, backend adapters, and infrastructure components. It reflects our current implementation status with CoreRpcAdapter, completed frontend, and Vercel staging deployment.

## Component Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              COMPONENT ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              FRONTEND LAYER                                │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌────────────────┐    ┌─────────────────────────┐  │ │
│  │  │   App.tsx       │    │  Dashboard.tsx │    │   BitcoinContext.tsx    │  │ │
│  │  │                 │    │                │    │                         │  │ │
│  │  │ • Splash Screen │    │ • Three-Column │    │ • Bitcoin State Mgmt    │  │ │
│  │  │ • Routing       │    │   Layout       │    │ • API Integration       │  │ │
│  │  │ • Theme Context │    │ • Search Area  │    │ • WebSocket Hook        │  │ │
│  │  │ • i18n Setup    │    │ • Visualizer   │    │ • Validation Utils      │  │ │
│  │  │ • Performance   │    │ • Dashboard    │    │ • Pattern Recognition   │  │ │
│  │  └─────────────────┘    └────────────────┘    └─────────────────────────┘  │ │
│  │           │                       │                       │                │ │
│  │           ▼                       ▼                       ▼                │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                    COMPONENT LIBRARY                                  │ │ │
│  │  │                                                                       │ │ │
│  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐│ │ │
│  │  │  │   Header        │    │   LoadingBlocks │    │   BitcoinPrice      ││ │ │
│  │  │  │                 │    │                 │    │   Dashboard         ││ │ │
│  │  │  │ • Navigation    │    │ • Loading       │    │ • Real-time Price   ││ │ │
│  │  │  │ • Theme Toggle  │    │   Animations    │    │ • Fee Estimates     ││ │ │
│  │  │  │ • Language      │    │ • 3D Design     │    │ • Network Status    ││ │ │
│  │  │  │   Switcher      │    │   System        │    │ • Mempool Data      ││ │ │
│  │  │  │ • Responsive    │    │ • Splash        │    │ • Performance       ││ │ │
│  │  │  │   Design        │    │   Screen        │    │   Metrics           ││ │ │
│  │  │  └─────────────────┘    └─────────────────┘    └─────────────────────┘│ │ │
│  │  │                                                                       │ │ │
│  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐│ │ │
│  │  │  │   Theme System  │    │   i18n System   │    │   Performance       ││ │ │
│  │  │  │                 │    │                 │    │   Components        ││ │ │
│  │  │  │ • Light/Dark    │    │ • EN/ES/HE/PT   │    │ • Loading States    ││ │ │
│  │  │  │   Themes        │    │ • RTL Support   │    │ • Error Boundaries  ││ │ │
│  │  │  │ • Cosmic Theme  │    │ • Dynamic       │    │ • Lazy Loading      ││ │ │
│  │  │  │ • Dynamic       │    │   Switching     │    │ • Code Splitting    ││ │ │
│  │  │  │   Switching     │    │ • Cultural      │    │ • Bundle Analysis   ││ │ │
│  │  │  │ • CSS Props     │    │   Adaptation    │    │ • Performance       ││ │ │
│  │  │  └─────────────────┘    └─────────────────┘    └─────────────────────┘│ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  │                                   │                                        │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                        STYLES SYSTEM                                  │ │ │
│  │  │                                                                       │ │ │
│  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐│ │ │
│  │  │  │   CSS Modules   │    │ CSS Custom      │    │ Styled Components   ││ │ │
│  │  │  │                 │    │ Properties      │    │                     ││ │ │
│  │  │  │ • Component     │    │ • Theme Tokens  │    │ • Dynamic Styling   ││ │ │
│  │  │  │   Isolation     │    │ • Global Vars   │    │ • Theme Integration ││ │ │
│  │  │  │ • Grid Systems  │    │ • Responsive    │    │ • Animations        ││ │ │
│  │  │  │ • 3D Containers │    │   Breakpoints   │    │ • Interactive       ││ │ │
│  │  │  │ • Layout Mgmt   │    │ • Color Schemes │    │   Elements          ││ │ │
│  │  │  │ • Responsive    │    │ • Typography    │    │ • Performance       ││ │ │
│  │  │  │   Design        │    │ • Spacing       │    │   Optimized         ││ │ │
│  │  │  └─────────────────┘    └─────────────────┘    └─────────────────────┘│ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                   │                                             │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                              BACKEND LAYER                                 │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────┐ │ │
│  │  │   CoreRpcAdapter│    │ Electrum Adapter│    │   WebSocket Hub         │ │ │
│  │  │                 │    │                 │    │                         │ │ │
│  │  │ • Bitcoin Core  │    │ • TCP Client    │    │ • Real-time Events      │ │ │
│  │  │   RPC           │    │ • HTTP/JSON     │    │ • Tip Height            │ │ │
│  │  │ • Direct        │    │   Conversion    │    │ • Reorg Detection       │ │ │
│  │  │   Integration   │    │ • Mempool       │    │ • Fee Updates           │ │ │
│  │  │ • Enhanced      │    │   Monitoring    │    │ • Price Updates         │ │ │
│  │  │   Reliability   │    │ • Block Index   │    │ • Event Broadcasting    │ │ │
│  │  │ • Fallback      │    │ • UTXO Data     │    │ • Connection Mgmt       │ │ │
│  │  │   Strategy      │    │ • Health Checks │    │ • Heartbeat Monitor     │ │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────────────┘ │ │
│  │           │                       │                       │                │ │
│  │           ▼                       ▼                       ▼                │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                        API LAYER                                      │ │ │
│  │  │                                                                       │ │ │
│  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────┐ │ │ │
│  │  │  │   Routes        │    │   Controllers   │    │   Middleware       │ │ │ │
│  │  │  │                 │    │                 │    │                    │ │ │ │
│  │  │  │ • /electrum/*   │    │ • Health        │    │ • CORS             │ │ │ │
│  │  │  │ • /health       │    │ • Fee Estimates │    │ • Rate Limiting    │ │ │ │
│  │  │  │ • /network/*    │    │ • Network Data  │    │ • Error Handling   │ │ │ │
│  │  │  │ • /mempool      │    │ • Mempool Info  │    │ • Logging          │ │ │ │
│  │  │  │ • RESTful       │    │ • Data          │    │ • Authentication   │ │ │ │
│  │  │  │   Endpoints     │    │   Validation    │    │ • Compression      │ │ │ │
│  │  │  │ • WebSocket     │    │ • Response      │    │ • Security         │ │ │ │
│  │  │  │   Support       │    │   Formatting    │    │   Headers          │ │ │ │
│  │  │  └─────────────────┘    └─────────────────┘    └────────────────────┘ │ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  │                                   │                                        │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                      CACHE LAYER                                      │ │ │
│  │  │                                                                       │ │ │
│  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐│ │ │
│  │  │  │   Redis L1      │    │ Memory-mapped   │    │ PostgreSQL          ││ │ │
│  │  │  │                 │    │ L2              │    │                     ││ │ │
│  │  │  │ • Hot Cache     │    │ • Warm Cache    │    │ • Analytics Mirror  ││ │ │
│  │  │  │ • 1-2s TTL      │    │ • UTXO Data     │    │ • Views/MVs         ││ │ │
│  │  │  │ • ~0.1-1ms      │    │ • Recent Blocks │    │ • 100-500ms         ││ │ │
│  │  │  │ • Real-time     │    │ • ~1-5ms        │    │ • Human-friendly    ││ │ │
│  │  │  │   Updates       │    │ • Memory        │    │   SQL               ││ │ │
│  │  │  │ • WebSocket     │    │   Efficient     │    │ • Performance       ││ │ │
│  │  │  │   Events        │    │ • Fast Access   │    │   Analytics         ││ │ │
│  │  │  │ • Session Mgmt  │    │ • Persistent    │    │ • Data Mining       ││ │ │
│  │  │  └─────────────────┘    └─────────────────┘    └─────────────────────┘│ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                   │                                             │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                            INFRASTRUCTURE                                  │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────┐ │ │
│  │  │   Vercel        │    │   Docker        │    │   GitHub Actions        │ │ │
│  │  │                 │    │                 │    │                         │ │ │
│  │  │ • Frontend      │    │ • Local Dev     │    │ • CI/CD Pipeline        │ │ │
│  │  │   Staging       │    │   Environment   │    │ • Automated Testing     │ │ │
│  │  │ • Auto-deploy   │    │ • electrs       │    │ • Type Checking         │ │ │
│  │  │ • Edge Network  │    │   Container     │    │ • Linting               │ │ │
│  │  │ • Analytics     │    │ • Redis         │    │ • Build Verification    │ │ │
│  │  │ • Performance   │    │   Container     │    │ • Security Scanning     │ │ │
│  │  │   Monitoring    │    │ • PostgreSQL    │    │ • Dependency Updates    │ │ │
│  │  │ • Global CDN    │    │   Container     │    │ • Release Management    │ │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────────────┘ │ │
│  │           │                       │                       │                │ │
│  │           ▼                       ▼                       ▼                │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                        MONITORING                                     │ │ │
│  │  │                                                                       │ │ │
│  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐│ │ │
│  │  │  │   Prometheus    │    │   Grafana       │    │   Logging           ││ │ │
│  │  │  │                 │    │                 │    │                     ││ │ │
│  │  │  │ • Metrics       │    │ • Dashboards    │    │ • Structured Logs   ││ │ │
│  │  │  │   Collection    │    │ • Visualization │    │ • Error Tracking    ││ │ │
│  │  │  │ • Performance   │    │ • Alerting      │    │ • Performance       ││ │ │
│  │  │  │   Data          │    │ • Real-time     │    │   Monitoring        ││ │ │
│  │  │  │ • Health        │    │   Monitoring    │    │ • Audit Trail       ││ │ │
│  │  │  │   Checks        │    │ • Custom        │    │ • Debug Info        ││ │ │
│  │  │  │ • Custom        │    │   Metrics       │    │ • Security Events   ││ │ │
│  │  │  │   Metrics       │    │ • Historical    │    │ • System Health     ││ │ │
│  │  │  └─────────────────┘    └─────────────────┘    └─────────────────────┘│ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Component Relationships

### Frontend Layer ✅ **IMPLEMENTED**
- **App.tsx**: Root component with splash screen, routing, theme context, and i18n setup
- **Dashboard.tsx**: Three-column layout (Search, Visualizer, Dashboard Data) with responsive design
- **BitcoinContext.tsx**: State management for Bitcoin data, API integration, and WebSocket connectivity
- **Component Library**: 15+ components including Header, LoadingBlocks, BitcoinPriceDashboard
- **Styles System**: Three-tier architecture (CSS Modules, Custom Properties, Styled Components)
- **Theme System**: Light/Dark/Cosmic themes with dynamic switching and CSS Custom Properties
- **i18n System**: EN/ES/HE/PT languages with RTL support and cultural adaptation
- **Performance Components**: Loading states, error boundaries, lazy loading, code splitting

### Backend Layer ✅ **IMPLEMENTED**
- **CoreRpcAdapter**: Direct Bitcoin Core RPC integration for enhanced reliability
- **Electrum Adapter**: TCP client with HTTP/JSON conversion and real-time monitoring
- **WebSocket Hub**: Real-time event broadcasting (tip height, reorg detection, fees, prices)
- **API Layer**: RESTful endpoints (/api/v1/electrum/*, /api/v1/core/*, /api/v1/network/*, /ws)
- **Cache Layer**: Multi-tier architecture (Redis L1, Memory-mapped L2, PostgreSQL)

### Infrastructure ✅ **IMPLEMENTED**
- **Vercel**: Frontend staging deployment with auto-deploy and edge network
- **Docker**: Local development environment with electrs, Redis, and PostgreSQL containers
- **GitHub Actions**: CI/CD pipeline with automated testing, type checking, and linting
- **Monitoring**: Prometheus metrics, Grafana dashboards, structured logging
- **Testing Framework**: Comprehensive testing architecture with background process management

## Data Flow Patterns

### Frontend Data Flow ✅ **IMPLEMENTED**
1. **App.tsx** → **BitcoinContext.tsx**: Global state initialization and WebSocket setup
2. **BitcoinContext.tsx** → **Components**: Real-time data distribution and state updates
3. **Components** → **Styles System**: Dynamic theming and responsive design application
4. **Performance Components** → **User Experience**: Loading states, error handling, and optimization

### Backend Data Flow ✅ **IMPLEMENTED**
1. **CoreRpcAdapter** ↔ **Bitcoin Core**: Direct RPC communication for enhanced reliability
2. **Electrum Adapter** ↔ **electrs**: TCP communication for blockchain data indexing
3. **WebSocket Hub** → **Frontend**: Real-time event broadcasting with 1-2s freshness
4. **Cache Layer** → **API Responses**: Multi-tier caching for optimal performance

### Infrastructure Data Flow ✅ **IMPLEMENTED**
1. **GitHub Actions** → **Vercel**: Automated deployment triggers on main branch pushes
2. **Monitoring** → **Performance**: Real-time metrics collection and alerting
3. **Docker** → **Local Development**: Consistent environment across development team

## Component Characteristics

### Frontend Components ✅ **IMPLEMENTED**
- **React 18+**: Modern React with TypeScript and strict mode compliance
- **Vite Build System**: Fast development and optimized production builds
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **3D Design System**: Advanced UI components with LoadingBlocks and splash screen
- **Performance Optimized**: Code splitting, lazy loading, and bundle analysis

### Backend Components ✅ **IMPLEMENTED**
- **Node.js**: TypeScript backend with Express.js framework
- **Dual Adapter Strategy**: CoreRpcAdapter + Electrum adapter for reliability
- **WebSocket Hub**: Real-time data broadcasting with connection management
- **Multi-tier Caching**: Redis L1, memory-mapped L2, PostgreSQL analytics

### Infrastructure Components ✅ **IMPLEMENTED**
- **Vercel Staging**: Frontend deployment with global CDN and analytics
- **Docker Compose**: Local development environment with all services
- **CI/CD Pipeline**: Automated testing, building, and deployment
- **Monitoring Stack**: Prometheus, Grafana, and structured logging

## Current Implementation Status

### ✅ **COMPLETED COMPONENTS**
- **Frontend**: Complete React app with 3D design system, theme system, i18n, and performance features
- **Backend**: CoreRpcAdapter, Electrum adapter, WebSocket hub, and multi-tier caching
- **Infrastructure**: Vercel staging deployment, Docker development environment, and CI/CD pipeline
- **Performance**: All targets achieved, ready for ThreeJS integration

### 🎯 **NEXT PHASE GOALS**
- **ThreeJS Components**: 3D blockchain visualization in center column
- **Enhanced Dashboard**: Additional widgets for fee, network, and timeline data
- **Mobile Optimization**: Mobile-specific UI improvements and performance optimization

