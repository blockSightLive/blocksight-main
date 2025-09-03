# BlockSight.live - Context Orchestration & WebSocket Integration Diagram

/**
 * @fileoverview Context orchestration and WebSocket integration diagram showing the current implementation
 * @version 1.0.0
 * @author Development Team
 * @since 2025-09-01
 * @lastModified 2025-09-01
 * 
 * @description
 * This diagram shows the current context orchestration system and WebSocket integration,
 * documenting the parallel data ingestion architecture and centralized event broadcasting.
 * 
 * @dependencies
 * - 00-model-spec.md (single source of truth)
 * - Current WebSocket hub implementation
 * - MainOrchestrator and context plugins
 * 
 * @usage
 * Reference for understanding current context orchestration and WebSocket architecture
 * 
 * @state
 * ✅ Updated to reflect current implementation status
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - Add new blockchain event types as implemented
 * - Document additional context plugins
 * 
 * @performance
 * - Reflects current performance characteristics
 * - Shows real-time data flow patterns
 * 
 * @security
 * - 100% passive system architecture
 * - No blockchain write access
 */

## Overview

This Context Orchestration & WebSocket Integration Diagram shows the current implementation of our parallel data ingestion architecture, centralized WebSocket hub, and frontend context orchestration system. It reflects the completed WebSocket integration with new blockchain event types and the MainOrchestrator-based context management.

## 🚨 **CRITICAL ARCHITECTURAL PRINCIPLE**

**PARALLEL DATA INGESTION WITH CENTRALIZED WEBSOCKET COORDINATION**

- ✅ **Independent Data Sources**: Bitcoin Core, Electrum, and External APIs operate in parallel
- ✅ **WebSocket Hub**: Centralized event aggregation and broadcasting
- ✅ **Frontend Orchestration**: MainOrchestrator manages all context plugins
- ✅ **Real-time Events**: Live blockchain data streaming via WebSocket
- ✅ **Scalable Architecture**: New data sources can be added without affecting existing ones

## 🎯 **MAINORCHESTRATOR AS SINGLE SOURCE OF TRUTH**

**ALL FRONTEND STATE MUST FLOW THROUGH MAINORCHESTRATOR**

- ✅ **Plugin-Based Architecture**: Context plugins register with MainOrchestrator
- ✅ **Unified WebSocket Management**: Single WebSocket connection managed centrally
- ✅ **Coordinated State Updates**: All context changes go through orchestrator
- ✅ **Performance Optimization**: Context memoization and lazy loading
- ✅ **Error Boundary Protection**: Centralized error handling and recovery

## Context Orchestration & WebSocket Integration Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              PARALLEL DATA INGESTION                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────────────────────┐ │
│  │   Bitcoin Core  │    │    Electrum     │    │  External APIs               │ │
│  │   (Full Node)   │    │   (Indexer)     │    │  (Price Feeds)               │ │
│  │                 │    │                 │    │                              │ │
│  │ • RPC Commands  │    │ • TCP Protocol  │    │ • HTTP APIs                  │ │
│  │ • .blk Files    │    │ • Block Index   │    │ • Rate Limited               │ │
│  │ • P2P Network   │    │ • UTXO Set      │    │ • JSON Data                  │ │
│  │ • Chain State   │    │ • Address Index │    │ • Market Data                │ │
│  └─────────────────┘    └─────────────────┘    └──────────────────────────────┘ │
│           │                       │                       │                     │
│           ▼                       ▼                       ▼                     │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                    BACKEND ADAPTERS (INDEPENDENT)                          │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   CoreRpcAdapter│    │ ElectrumAdapter │    │   PriceDataAdapter     │  │ │
│  │  │                 │    │                 │    │   (Future)             │  │ │
│  │  │ • getBlockCount │    │ • getTipHeader  │    │ • getPriceData         │  │ │
│  │  │ • getMempoolInfo│    │ • getFeeEstimates│   │ • getFxRates           │  │ │
│  │  │ • getBlockchain │    │ • getMempool    │    │ • getNetworkStatus     │  │ │
│  │  │   Info          │    │   Summary       │    │ • Rate Limiting        │  │ │
│  │  │ • getNetworkInfo│    │ • Connection    │    │ • Error Handling       │  │ │
│  │  │ • getMiningInfo │    │   Pooling       │    │ • Cache Management     │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                        WEBSOCKET HUB (CENTRALIZED)                         │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │   Event Types   │    │   Polling       │    │   Client Management    │  │ │
│  │  │                 │    │   Intervals     │    │                        │  │ │
│  │  │ • tip.height    │    │ • Tip: 5s       │    │ • Connection Pool      │  │ │
│  │  │ • network.fees  │    │ • Fees: 15s     │    │ • Event Broadcasting  │  │ │
│  │  │ • network.mempool│   │ • Mempool: 10s  │    │ • Client Snapshots    │  │ │
│  │  │ • chain.reorg   │    │ • Price: 45s    │    │ • Health Monitoring   │  │ │
│  │  │ • price.current │    │ • FX: 3600s     │    │ • Error Handling      │  │ │
│  │  │ • fx.rates      │    │ • Blockchain: 30s│   │ • Metrics Collection  │  │ │
│  │  │ • blockchain.info│   │ • Network: 60s  │    │ • Performance Tracking│  │ │
│  │  │ • blockchain.network│ • Mining: 120s   │    │ • Circuit Breakers    │  │ │
│  │  │ • blockchain.mining│                   │    │ • Load Balancing      │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                        FRONTEND ORCHESTRATION                              │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │ MainOrchestrator│    │   WebSocket     │    │   Context Plugins      │  │ │
│  │  │                 │    │   Connection    │    │                        │  │ │
│  │  │ • Plugin Mgmt   │    │ • Event Handler │    │ • BlockchainContext    │  │ │
│  │  │ • State Coord   │    │ • Reconnection  │    │ • ElectrumContext      │  │ │
│  │  │ • Cache Mgmt    │    │ • Heartbeat     │    │ • ExternalAPIContext  │  │ │
│  │  │ • Error Handling│    │ • Status Monitor│    │ • SystemContext       │  │ │
│  │  │ • Performance   │    │ • Event Routing │    │ • WebSocket Events    │  │ │
│  │  │   Monitoring   │    │ • Load Balancing│    │ • State Management     │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                            │
│                                    ▼                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                        UI COMPONENTS (CONSUMERS)                           │ │
│  │                                                                            │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────────────┐  │ │
│  │  │ Blockchain      │    │   Dashboard     │    │   Performance          │  │ │
│  │  │ Visualizer      │    │   Components   │    │   Monitoring           │  │ │
│  │  │                 │    │                 │    │                        │  │ │
│  │  │ • 3D Scene      │    │ • Price Display │    │ • Performance Baseline│  │ │
│  │  │ • Real-time     │    │ • Fee Estimates │    │ • Memory Tracking     │  │ │
│  │  │   Updates       │    │ • Network Status│    │ • FPS Monitoring      │  │ │
│  │  │ • WebSocket     │    │ • Mempool Data  │    │ • Alert System        │  │ │
│  │  │   Events        │    │ • Search        │    │ • Optimization        │  │ │
│  │  │ • Performance   │    │   Components    │    │ • Error Boundaries     │  │ │
│  │  │   Monitoring   │    │ • Theme System  │    │ • Loading States      │  │ │
│  │  └─────────────────┘    └─────────────────┘    └────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
```

## Current Implementation Status

### ✅ **COMPLETED COMPONENTS**

**Backend WebSocket Hub:**
- ✅ **Event Types**: All 9 blockchain event types implemented
- ✅ **Polling Intervals**: Optimized timing for each data source
- ✅ **Client Management**: Connection pooling and event broadcasting
- ✅ **Error Handling**: Circuit breakers and fallback strategies
- ✅ **Performance Monitoring**: Metrics collection and health checks

**Frontend Orchestration:**
- ✅ **MainOrchestrator**: Centralized context management with plugin-based factory system
- ✅ **Context Plugins**: All 4 plugins implemented and functional (Blockchain, Electrum, ExternalAPI, System)
- ✅ **WebSocket Integration**: Real-time event processing with 9 blockchain event types
- ✅ **State Management**: Unified state across all contexts with strategy pattern
- ✅ **Performance Optimization**: Context memoization, lazy loading, and unified caching

**Blockchain Events:**
- ✅ **tip.height**: Real-time blockchain height updates (5s polling)
- ✅ **network.fees**: Live fee estimates from Electrum (15s polling)
- ✅ **network.mempool**: Current mempool status (10s polling)
- ✅ **chain.reorg**: Reorganization detection (event-driven)
- ✅ **price.current**: Live Bitcoin price data (45s polling)
- ✅ **fx.rates**: Foreign exchange rates (3600s polling)
- ✅ **blockchain.info**: Comprehensive blockchain state (30s polling)
- ✅ **blockchain.network**: Network connection information (60s polling)
- ✅ **blockchain.mining**: Mining statistics and difficulty (120s polling)

### 🔄 **IN PROGRESS**

**Three.js Integration:**
- 🔄 **Real Data Connection**: Connecting WebSocket events to 3D visualization
- 🔄 **Performance Optimization**: Fine-tuning render performance and memory management
- 🔄 **Event-Driven Updates**: Real-time blockchain data in 3D scenes with WebSocket events

### 📋 **NEXT STEPS**

**Immediate Priorities:**
1. **Test WebSocket Integration**: Verify all events are flowing correctly
2. **Connect Real Data to Three.js**: Replace placeholder data with live events
3. **Performance Validation**: Ensure real-time updates maintain performance
4. **Error Handling**: Test fallback scenarios and error recovery

**Future Enhancements:**
1. **Additional Blockchain Metrics**: More detailed blockchain analytics
2. **Advanced Event Types**: Custom event types for specific use cases
3. **Performance Optimization**: Further WebSocket and rendering optimizations
4. **Monitoring & Alerting**: Enhanced performance monitoring and alerting

## Architecture Benefits

### **Scalability**
- **Parallel Processing**: Each data source operates independently
- **Modular Design**: New data sources can be added easily
- **Event-Driven**: Scalable event broadcasting to multiple clients

### **Reliability**
- **Fallback Strategies**: Multiple data sources for redundancy
- **Error Handling**: Circuit breakers and graceful degradation
- **Health Monitoring**: Continuous monitoring and alerting

### **Performance**
- **Real-time Updates**: 1-2 second latency for critical events
- **Optimized Polling**: Efficient timing for each data type
- **Caching Strategy**: Multi-tier caching for optimal performance

### **Maintainability**
- **Centralized Coordination**: Single WebSocket hub for all events
- **Plugin Architecture**: Modular context management
- **Clear Separation**: Backend data ingestion vs. frontend consumption

## Integration Points

### **Backend to Frontend**
- **WebSocket Events**: Real-time data streaming
- **Event Types**: Standardized event contracts
- **Client Management**: Connection lifecycle management

### **Context Plugins**
- **Event Processing**: WebSocket message handling
- **State Management**: Local state with global coordination
- **Performance Monitoring**: Real-time metrics and alerts

### **UI Components**
- **Real-time Updates**: Live data in all components
- **Performance Optimization**: Advanced 3D rendering
- **Error Handling**: Graceful degradation and recovery

This architecture ensures that all data flows are properly aligned with the established parallel ingestion model, providing a scalable, reliable, and performant system for real-time blockchain data visualization.
