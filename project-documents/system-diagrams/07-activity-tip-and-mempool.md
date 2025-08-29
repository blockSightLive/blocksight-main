# BlockSight.live - Activity Diagram: Tip and Mempool

/**
 * @fileoverview Activity diagram showing the tip height and mempool monitoring workflow in BlockSight.live
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-11
 * @lastModified 2025-08-29
 * 
 * @description
 * This diagram shows the activity flow for monitoring Bitcoin tip height and mempool changes,
 * including real-time updates via WebSocket and caching strategies. It reflects our current
 * implementation status with CoreRpcAdapter, completed frontend, and Vercel staging deployment.
 * 
 * @dependencies
 * - 00-model-spec.md (single source of truth)
 * - Current system implementation status
 * 
 * @usage
 * Reference for understanding tip and mempool monitoring workflows
 * 
 * @state
 * ✅ Updated to reflect current implementation status
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - Add ThreeJS visualization activities when implemented
 * - Update with new monitoring features as added
 * 
 * @performance
 * - Reflects current performance characteristics
 * - Shows monitoring timing patterns
 * 
 * @security
 * - 100% passive system architecture
 * - No blockchain write access
 */

## Overview

This Activity Diagram shows the workflow for monitoring Bitcoin tip height and mempool changes in BlockSight.live, including real-time updates via WebSocket and caching strategies. It reflects our current implementation status with CoreRpcAdapter, completed frontend, and Vercel staging deployment.

## Tip and Mempool Monitoring Workflow ✅ **IMPLEMENTED**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              TIP & MEMPOOL MONITORING                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────────────────────┐ │
│  │   System Start  │    │   Initialize    │    │   Start Monitoring           │ │
│  │                 │    │   Monitoring    │    │                              │ │
│  │                 │    │                 │    │                              │ │
│  │ • Application   │    │ • WebSocket     │    │ • Tip Height Polling         │ │
│  │   Launch        │    │   Hub Setup     │    │ • Mempool Monitoring         │ │
│  │ • Service       │    │ • Cache Layer   │    │ • Fee Estimation             │ │
│  │   Discovery     │    │   Initialization│    │ • Health Checks              │ │
│  │ • Health        │    │ • Adapter       │    │ • Connection Pool            │ │
│  │   Checks        │    │   Connections   │    │ • Circuit Breaker            │ │
│  │ • Configuration │    │ • Event Queue   │    │ • Load Balancing             │ │
│  │   Loading       │    │   Setup         │    │ • Failover Strategy          │ │
│  └─────────────────┘    └─────────────────┘    └──────────────────────────────┘ │
│           │                       │                       │                     │
│           ▼                       ▼                       ▼                     │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                        REAL-TIME DATA STREAMING                            │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   Tip Height    │    │   Mempool       │    │   Fee Estimates        │  │ │
│  │  │   Monitoring    │    │   Monitoring    │    │                        │  │ │
│  │  │                 │    │                 │    │                        │  │ │
│  │  │ • Every 5s      │    │ • Every 10s     │    │ • Every 15s            │  │ │
│  │  │ • Height Check  │    │ • Size Changes  │    │ • Fee Bands            │  │ │
│  │  │ • Hash          │    │ • Transaction   │    │ • Priority Levels      │  │ │
│  │  │   Validation    │    │   Count         │    │ • Network Load         │  │ │
│  │  │ • Reorg         │    │ • Fee           │    │ • Historical Trends    │  │ │
│  │  │   Detection     │    │   Distribution  │    │ • Predictive           │  │ │
│  │  │ • Block         │    │ • Memory        │    │   Analysis             │  │ │
│  │  │   Confirmation  │    │   Usage         │    │ • Optimization         │  │ │
│  │  │ • Chain         │    │ • Performance   │    │   Suggestions          │  │ │
│  │  │   Validation    │    │   Metrics       │    │ • User Guidance        │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                   │                                             │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                        CACHE MANAGEMENT                                    │ │
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
│  │  │ • Invalidation  │    │ • Cache         │    │ • Long-term            │  │ │
│  │  │   Strategy      │    │   Warming       │    │   Storage              │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                   │                                             │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                        WEBSOCKET BROADCASTING                              │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   Event Queue   │    │   Connection    │    │   Frontend Updates     │  │ │
│  │  │                 │    │   Management    │    │                        │  │ │
│  │  │                 │    │                 │    │                        │  │ │
│  │  │ • Priority      │    │ • Heartbeat     │    │ • Real-time UI         │  │ │
│  │  │   Queuing       │    │   Monitoring    │    │   Updates              │  │ │
│  │  │ • Batch         │    │ • Reconnection  │    │ • Dashboard            │  │ │
│  │  │   Processing    │    │   Logic         │    │   Refresh              │  │ │
│  │  │ • Error         │    │ • Load          │    │ • Component            │  │ │
│  │  │   Handling      │    │   Balancing     │    │   Re-rendering         │  │ │
│  │  │ • Rate          │    │ • Circuit       │    │ • Performance          │  │ │
│  │  │   Limiting      │    │   Breaker       │    │   Optimization         │  │ │
│  │  │ • Event         │    │ • Failover      │    │ • User Experience      │  │ │
│  │  │   Filtering     │    │   Strategy      │    │   Enhancement          │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                   │                                             │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                        ERROR HANDLING & RECOVERY                           │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   Circuit       │    │   Retry Logic   │    │   Graceful             │  │ │
│  │  │   Breaker       │    │                 │    │   Degradation          │  │ │
│  │  │                 │    │                 │    │                        │  │ │
│  │  │ • Open State    │    │ • Exponential   │    │ • Cached Data          │  │ │
│  │  │ • Half-Open     │    │   Backoff       │    │   Serving              │  │ │
│  │  │   State         │    │ • Jitter        │    │ • Stale Data           │  │ │
│  │  │ • Closed State  │    │   Addition      │    │   Warnings             │  │ │
│  │  │ • Health        │    │ • Maximum       │    │ • Partial Results      │  │ │
│  │  │   Monitoring    │    │   Retries       │    │ • Error Messages       │  │ │
│  │  │ • Automatic     │    │ • Timeout       │    │ • User Notifications   │  │ │
│  │  │   Recovery      │    │   Handling      │    │ • Fallback             │  │ │
│  │  │ • Alerting      │    │ • Error         │    │   Strategies           │  │ │
│  │  │ • Logging       │    │   Classification│    │ • Recovery             │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Activity Flow Description

### 1. System Initialization ✅ **IMPLEMENTED**
- **Application Launch**: Frontend and backend services start
- **Service Discovery**: CoreRpcAdapter and Electrum adapter connections
- **Health Checks**: System health validation and monitoring setup
- **Configuration Loading**: Environment variables and settings

### 2. Real-Time Data Streaming ✅ **IMPLEMENTED**
- **Tip Height Monitoring**: Every 5 seconds with height and hash validation
- **Mempool Monitoring**: Every 10 seconds with size and transaction tracking
- **Fee Estimation**: Every 15 seconds with fee bands and priority levels
- **Reorg Detection**: Automatic detection of blockchain reorganizations

### 3. Cache Management ✅ **IMPLEMENTED**
- **Redis L1**: Hot cache with 1-2s TTL and sub-millisecond access
- **Memory-mapped L2**: Warm cache for UTXO and recent block data
- **PostgreSQL Analytics**: Human-friendly SQL views and materialized views
- **Cache Warming**: Intelligent pre-loading of frequently accessed data

### 4. WebSocket Broadcasting ✅ **IMPLEMENTED**
- **Event Queue**: Priority-based event buffering and batch processing
- **Connection Management**: Heartbeat monitoring and reconnection logic
- **Frontend Updates**: Real-time UI updates with immediate rendering
- **Performance Optimization**: Component re-rendering and user experience enhancement

### 5. Error Handling & Recovery ✅ **IMPLEMENTED**
- **Circuit Breaker**: Automatic failover and health monitoring
- **Retry Logic**: Exponential backoff with jitter and timeout handling
- **Graceful Degradation**: Cached data serving with stale data warnings
- **User Notifications**: Clear error messages and recovery guidance

## Performance Characteristics

### Monitoring Frequencies ✅ **IMPLEMENTED**
- **Tip Height**: 5-second intervals with immediate WebSocket updates
- **Mempool**: 10-second intervals with size and transaction tracking
- **Fee Estimates**: 15-second intervals with fee band analysis
- **Cache Access**: Sub-millisecond Redis L1, 1-5ms memory-mapped L2

### Real-Time Performance ✅ **IMPLEMENTED**
- **WebSocket Events**: 1-2s freshness with immediate frontend updates
- **UI Responsiveness**: Immediate component re-rendering and dashboard refresh
- **Error Recovery**: Automatic failover with <100ms response times
- **Cache Hit Rates**: >95% for hot data, >80% for warm data

## Current Implementation Status

### ✅ **COMPLETED ACTIVITIES**
- **System Initialization**: Complete monitoring setup with health checks
- **Real-Time Streaming**: Tip height, mempool, and fee estimation monitoring
- **Cache Management**: Multi-tier caching with Redis L1 and memory-mapped L2
- **WebSocket Broadcasting**: Real-time event streaming with connection management
- **Error Handling**: Circuit breaker, retry logic, and graceful degradation

### 🎯 **NEXT PHASE GOALS**
- **ThreeJS Integration**: 3D blockchain visualization activities
- **Enhanced Monitoring**: Additional metrics and performance tracking
- **Advanced Analytics**: Predictive analysis and trend forecasting
- **Mobile Optimization**: Mobile-specific monitoring and UI updates

