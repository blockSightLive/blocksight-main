# BlockSight.live - Data Flow Diagram

/**
 * @fileoverview Data flow diagram showing how data moves through the BlockSight.live system
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-11
 * @lastModified 2025-08-29
 * 
 * @description
 * This diagram shows the data flow patterns through BlockSight.live, including real-time
 * data streaming, caching strategies, and frontend-backend communication. It reflects our
 * current implementation status with CoreRpcAdapter, completed frontend, and Vercel staging.
 * 
 * @dependencies
 * - 00-model-spec.md (single source of truth)
 * - Current system implementation status
 * 
 * @usage
 * Reference for understanding data movement and processing patterns
 * 
 * @state
 * ✅ Updated to reflect current implementation status
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - Add ThreeJS data flow when implemented
 * - Update with new data sources as added
 * 
 * @performance
 * - Reflects current performance characteristics
 * - Shows data processing latencies
 * 
 * @security
 * - 100% passive system architecture
 * - No blockchain write access
 */

## Overview

This Data Flow Diagram shows how data moves through the BlockSight.live system, including real-time data streaming, caching strategies, and frontend-backend communication. It reflects our current implementation status with CoreRpcAdapter, completed frontend, and Vercel staging deployment.

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────────────────────┐ │
│  │   Bitcoin Core  │    │   Price Feeds   │    │  External APIs               │ │
│  │   (Full Node)   │    │    (APIs)       │    │  (Rate Limited)              │ │
│  │                 │    │                 │    │                              │ │
│  │ • RPC Commands  │    │ • CoinGecko     │    │ • Market Data                │ │
│  │ • .blk Files    │    │ • Others        │    │ • Network Status             │ │
│  │ • P2P Network   │    │ • Hourly/Change │    │ • Fee Estimates              │ │
│  │ • Chain State   │    │ • JSON/HTTP     │    │ • Historical Data            │ │
│  └─────────────────┘    └─────────────────┘    └──────────────────────────────┘ │
│           │                       │                       │                     │
│           ▼                       ▼                       ▼                     │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                        DATA INGESTION LAYER                                │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   CoreRpcAdapter│    │ Electrum Adapter│    │   Price Data Adapter   │  │ │
│  │  │                 │    │                 │    │   (Future)             │  │ │
│  │  │ • Direct RPC    │    │ • TCP Client    │    │ • Rate Limiting        │  │ │
│  │  │   Integration   │    │ • JSON Parsing  │    │ • Backoff Strategy     │  │ │
│  │  │ • Enhanced      │    │ • Event         │    │ • Data Validation      │  │ │
│  │  │   Reliability   │    │   Streaming     │    │ • Cache Management     │  │ │
│  │  │ • Fallback      │    │ • Connection    │    │ • Error Handling       │  │ │
│  │  │   Strategy      │    │   Pooling       │    │ • Retry Logic          │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                        REAL-TIME DATA STREAMING                            │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   WebSocket     │    │   Event Queue   │    │   Connection Manager   │  │ │
│  │  │   Hub           │    │                 │    │                        │  │ │
│  │  │ • Tip Height    │    │ • Event         │    │ • Heartbeat Monitor    │  │ │
│  │  │   Updates       │    │   Buffering     │    │ • Reconnection Logic   │  │ │
│  │  │ • Reorg         │    │ • Priority      │    │ • Load Balancing       │  │ │
│  │  │   Detection     │    │   Queuing       │    │ • Circuit Breaker      │  │ │
│  │  │ • Fee Updates   │    │ • Batch         │    │ • Connection Pool      │  │ │
│  │  │ • Mempool       │    │   Processing    │    │ • Health Checks        │  │ │
│  │  │   Changes       │    │ • Error         │    │ • Failover Strategy    │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                        MULTI-TIER CACHING STRATEGY                         │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   Redis L1      │    │ Memory-mapped   │    │ PostgreSQL Analytics   │  │ │
│  │  │                 │    │ L2              │    │ Mirror                 │  │ │
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
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                        API LAYER & DATA TRANSFORMATION                     │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   REST API      │    │   Data          │    │   Response             │  │ │
│  │  │                 │    │   Transformers  │    │   Formatters           │  │ │
│  │  │ • /electrum/*   │    │                 │    │ • JSON Standard        │  │ │
│  │  │ • /health       │    │ • Bitcoin       │    │ • Error Codes          │  │ │
│  │  │ • /network/*    │    │   Data Types    │    │ • Success Responses    │  │ │
│  │  │ • /mempool      │    │ • Address       │    │ • Pagination           │  │ │
│  │  │ • Rate Limiting │    │   Formatting    │    │ • Caching Headers      │  │ │
│  │  │ • CORS Support  │    │ • Transaction   │    │ • Compression          │  │ │
│  │  │ • Authentication│    │   Parsing       │    │ • Performance          │  │ │
│  │  │ • Compression   │    │ • Block Data    │    │   Metrics              │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                        FRONTEND DATA CONSUMPTION                           │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   Bitcoin       │    │   WebSocket     │    │   Component State      │  │ │
│  │  │   Context       │    │   Hook          │    │   Management           │  │ │
│  │  │ • Global State  │    │ • Real-time     │    │ • Local State          │  │ │
│  │  │ • API Calls     │    │   Updates       │    │ • Component Updates    │  │ │
│  │  │ • Data          │    │ • Event         │    │ • Performance          │  │ │
│  │  │   Validation    │    │   Processing    │    │   Optimization         │  │ │
│  │  │ • Pattern       │    │ • Connection    │    │ • Error Handling       │  │ │
│  │  │   Recognition   │    │   Management    │    │ • Loading States       │  │ │
│  │  │ • Error         │    │ • Reconnection  │    │ • Cache Invalidation   │  │ │
│  │  │   Handling      │    │   Logic         │    │ • State Persistence    │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  │                                   │                                        │ │
│  │  ┌───────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                        UI COMPONENT RENDERING                         │ │ │
│  │  │                                                                       │ │ │
│  │  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────┐ │ │ │
│  │  │  │   Dashboard     │    │   Search        │    │   Analytics        │ │ │ │
│  │  │  │                 │    │   Components    │    │   Components       │ │ │ │
│  │  │  │ • Real-time     │    │ • Block Lookup  │    │ • Fee Displays     │ │ │ │
│  │  │  │   Updates       │    │ • Transaction   │    │ • Network Load     │ │ │ │
│  │  │  │ • Three-column  │    │   Search        │    │ • Timeline Views   │ │ │ │
│  │  │  │   Layout        │    │ • Address       │    │ • Performance      │ │ │ │
│  │  │  │ • Theme System  │    │   Lookup        │    │   Metrics          │ │ │ │
│  │  │  │ • Responsive    │    │ • Advanced      │    │ • Data             │ │ │ │
│  │  │  │   Design        │    │   Filtering     │    │   Visualization    │ │ │ │
│  │  │  │ • Performance   │    │ • Search        │    │ • Interactive      │ │ │ │
│  │  │  │   Optimized     │    │   History       │    │   Elements         │ │ │ │
│  │  │  └─────────────────┘    └─────────────────┘    └────────────────────┘ │ │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                        PERFORMANCE MONITORING & OPTIMIZATION               │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   Prometheus    │    │   Performance   │    │   Optimization         │  │ │
│  │  │                 │    │   Metrics       │    │   Engine               │  │ │
│  │  │ • Metrics       │    │ • Response      │    │ • Cache Hit Rates      │  │ │
│  │  │   Collection    │    │   Times         │    │ • Memory Usage         │  │ │
│  │  │ • Performance   │    │ • Throughput    │    │ • CPU Utilization      │  │ │
│  │  │   Data          │    │ • Error Rates   │    │ • Network Latency      │  │ │
│  │  │ • Health        │    │ • Cache         │    │ • Database             │  │ │
│  │  │   Checks        │    │   Performance   │    │   Performance          │  │ │
│  │  │ • Custom        │    │ • Frontend      │    │ • Frontend             │  │ │
│  │  │   Metrics       │    │   Metrics       │    │   Performance          │  │ │
│  │  │ • Alerting      │    │ • User          │    │ • Bundle Analysis      │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Patterns

### Primary Data Sources ✅ **IMPLEMENTED**
1. **Bitcoin Core**: Direct RPC integration via CoreRpcAdapter for enhanced reliability
2. **electrs**: TCP-based blockchain indexing and data streaming
3. **Price Feeds**: External market data APIs with rate limiting and backoff strategies

### Real-Time Data Streaming ✅ **IMPLEMENTED**
1. **WebSocket Hub**: Real-time event broadcasting with 1-2s freshness
2. **Event Queue**: Priority-based event buffering and batch processing
3. **Connection Manager**: Heartbeat monitoring, reconnection logic, and load balancing

### Multi-Tier Caching Strategy ✅ **IMPLEMENTED**
1. **Redis L1**: Hot cache with 1-2s TTL and sub-millisecond access
2. **Memory-mapped L2**: Warm cache for UTXO and recent block data
3. **PostgreSQL Analytics**: Human-friendly SQL views and materialized views

### API Layer & Data Transformation ✅ **IMPLEMENTED**
1. **REST API**: Standardized endpoints with rate limiting and CORS support
2. **Data Transformers**: Bitcoin data type formatting and validation
3. **Response Formatters**: JSON standardization, error codes, and caching headers

### Frontend Data Consumption ✅ **IMPLEMENTED**
1. **Bitcoin Context**: Global state management and API integration
2. **WebSocket Hook**: Real-time updates with connection management
3. **Component State**: Local state management and performance optimization

### UI Component Rendering ✅ **IMPLEMENTED**
1. **Dashboard**: Real-time updates with three-column layout and theme system
2. **Search Components**: Block, transaction, and address lookup with advanced filtering
3. **Analytics Components**: Fee displays, network load, timeline views, and performance metrics

### Performance Monitoring & Optimization ✅ **IMPLEMENTED**
1. **Prometheus**: Metrics collection and performance monitoring
2. **Performance Metrics**: Response times, throughput, error rates, and cache performance
3. **Optimization Engine**: Cache hit rates, memory usage, CPU utilization, and bundle analysis

## Data Flow Characteristics

### Real-Time Performance ✅ **IMPLEMENTED**
- **Tip Height Updates**: 1-2s freshness via WebSocket streaming
- **Cache Access**: Sub-millisecond Redis L1, 1-5ms memory-mapped L2
- **API Response**: 5-20ms for cached data, 100-500ms for analytics queries
- **Frontend Updates**: Immediate UI updates with real-time data streaming

### Data Reliability ✅ **IMPLEMENTED**
- **Dual Adapter Strategy**: CoreRpcAdapter + Electrum adapter for redundancy
- **Circuit Breaker**: Automatic failover and health monitoring
- **Connection Pooling**: Persistent connections with heartbeat monitoring
- **Error Handling**: Comprehensive error recovery and retry logic

### Scalability Features ✅ **IMPLEMENTED**
- **Multi-Tier Caching**: Optimized for different access patterns and latencies
- **Event Queuing**: Priority-based processing and batch optimization
- **Load Balancing**: Connection distribution and failover strategies
- **Performance Monitoring**: Real-time metrics and optimization insights

## Current Implementation Status

### ✅ **COMPLETED DATA FLOWS**
- **Backend Data Ingestion**: CoreRpcAdapter, Electrum adapter, and price data preparation
- **Real-Time Streaming**: WebSocket hub with event queuing and connection management
- **Multi-Tier Caching**: Redis L1, memory-mapped L2, and PostgreSQL analytics
- **API Layer**: RESTful endpoints with data transformation and response formatting
- **Frontend Consumption**: Bitcoin context, WebSocket hook, and component state management
- **UI Rendering**: Dashboard, search components, and analytics with real-time updates
- **Performance Monitoring**: Prometheus metrics, performance tracking, and optimization

### 🎯 **NEXT PHASE GOALS**
- **ThreeJS Data Flow**: 3D blockchain visualization data streaming
- **Enhanced Analytics**: Additional data sources and visualization components
- **Mobile Optimization**: Mobile-specific data flow and performance optimization
- **Advanced Caching**: Predictive caching and intelligent data prefetching

