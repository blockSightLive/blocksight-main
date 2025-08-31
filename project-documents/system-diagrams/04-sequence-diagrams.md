# BlockSight.live - Sequence Diagrams

/**
 * @fileoverview Sequence diagrams showing key interactions in the BlockSight.live system
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-11
 * @lastModified 2025-08-29
 * 
 * @description
 * This file contains sequence diagrams showing key system interactions including real-time
 * data flow, user interactions, and system operations. It reflects our current implementation
 * status with CoreRpcAdapter, completed frontend, and Vercel staging deployment.
 * 
 * @dependencies
 * - 00-model-spec.md (single source of truth)
 * - Current system implementation status
 * 
 * @usage
 * Reference for understanding system interaction patterns and timing
 * 
 * @state
 * ✅ Updated to reflect current implementation status
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - Add ThreeJS interaction sequences when implemented
 * - Update with new user flows as added
 * 
 * @performance
 * - Reflects current performance characteristics
 * - Shows interaction timing patterns
 * 
 * @security
 * - 100% passive system architecture
 * - No blockchain write access
 */

## Overview

This file contains sequence diagrams showing key interactions in the BlockSight.live system, including real-time data flow, user interactions, and system operations. It reflects our current implementation status with CoreRpcAdapter, completed frontend, and Vercel staging deployment.

## Key Sequence Diagrams

### 1. Real-Time Bitcoin Data Flow ✅ **IMPLEMENTED**

```
User Browser    Frontend App    WebSocket Hub    Backend Adapters    Bitcoin Core/electrs
     │               │               │               │               │
     │               │               │               │               │
     │  Connect      │               │               │               │
     │ ─────────────►│               │               │               │
     │               │  WS Connect   │               │               │
     │               │ ─────────────►│               │               │
     │               │               │  Poll Data    │               │
     │               │               │ ─────────────►│               │
     │               │               │               │  RPC Call     │
     │               │               │               │ ─────────────►│
     │               │               │               │  Response     │
     │               │               │               │◄──────────────│
     │               │               │  Cache Data   │               │
     │               │               │◄──────────────│               │
     │               │  WS Event     │               │               │
     │               │◄──────────────│               │               │
     │  UI Update    │               │               │               │
     │◄──────────────│               │               │               │
```

**Timing**: 1-2s freshness, sub-millisecond cache access, immediate UI updates

### 2. User Dashboard Interaction ✅ **IMPLEMENTED**

```
User Browser    Dashboard    BitcoinContext    API Layer    Cache Layer
     │             │             │             │             │
     │  Load Page  │             │             │             │
     │ ───────────►│             │             │             │
     │             │  Init State │             │             │
     │             │ ───────────►│             │             │
     │             │             │  API Call   │             │
     │             │             │ ───────────►│             │
     │             │             │             │  Check L1   │
     │             │             │             │ ───────────►│
     │             │             │             │  Cache Hit  │
     │             │             │             │◄────────────│
     │             │  Data       │             │             │
     │             │◄────────────│             │             │
     │  Render UI  │             │             │             │
     │◄────────────│             │             │             │
```

**Performance**: Sub-50ms cache hits, immediate UI rendering, responsive design

### 3. Theme System Switching ✅ **IMPLEMENTED**

```
User Browser    Header Component    Theme Context    CSS System    UI Components
     │               │               │               │               │
     │  Click Theme  │               │               │               │
     │ ─────────────►│               │               │               │
     │               │  Update Theme │               │               │
     │               │ ─────────────►│               │               │
     │               │               │  CSS Props    │               │
     │               │               │ ─────────────►│               │
     │               │               │               │  Apply Theme  │
     │               │               │               │ ─────────────►│
     │               │               │               │  Theme Applied│
     │               │               │               │◄──────────────│
     │               │               │  Props Update │               │
     │               │               │◄──────────────│               │
     │               │  State Update │               │               │
     │               │◄──────────────│               │               │
     │  UI Update    │               │               │               │
     │◄──────────────│               │               │               │
```

**Performance**: <100ms theme switching, instant CSS variable updates, smooth transitions

### 4. WebSocket Reconnection Flow ✅ **IMPLEMENTED**

```
Frontend App    WebSocket Hook    WebSocket Hub    Backend
     │               │               │               │
     │               │  Connection   │               │
     │               │  Lost         │               │
     │               │◄──────────────│               │
     │               │  Reconnect    │               │
     │               │ ─────────────►│               │
     │               │               │  Auth Check   │
     │               │               │ ─────────────►│
     │               │               │  Auth OK      │
     │               │               │◄──────────────│
     │               │  Connected    │               │
     │               │◄──────────────│               │
     │               │  Resume       │               │
     │               │ ─────────────►│               │
     │               │  Data Stream  │               │
     │               │◄──────────────│               │
     │  UI Update    │               │               │
     │◄──────────────│               │               │
```

**Reliability**: Automatic reconnection, connection pooling, heartbeat monitoring

### 5. Search Functionality ✅ **IMPLEMENTED**

```
User Browser    Search Component    API Layer    Cache Layer    Backend Adapters
     │               │               │             │             │
     │  Search Query │               │             │             │
     │ ─────────────►│               │             │             │
     │               │  API Request  │             │             │
     │               │ ─────────────►│             │             │
     │               │               │  Check L1   │             │
     │               │               │ ───────────►│             │
     │               │               │  Cache Miss │             │
     │               │               │◄────────────│             │
     │               │               │  Check L2   │             │
     │               │               │ ───────────►│             │
     │               │               │  Cache Hit  │             │
     │               │               │◄────────────│             │
     │               │  Data         │             │             │
     │               │◄──────────────│             │             │
     │  Results      │               │             │             │
     │◄──────────────│               │             │             │
```

**Performance**: 1-5ms L2 cache access, advanced filtering, search history

## Performance Characteristics

### Response Times ✅ **IMPLEMENTED**
- **Cache L1 (Redis)**: ~0.1-1ms
- **Cache L2 (Memory-mapped)**: ~1-5ms  
- **API Responses**: 5-20ms (cached), 100-500ms (analytics)
- **WebSocket Events**: 1-2s freshness
- **UI Updates**: Immediate with real-time data

### Reliability Features ✅ **IMPLEMENTED**
- **Circuit Breaker**: Automatic failover and health monitoring
- **Connection Pooling**: Persistent connections with heartbeat
- **Error Recovery**: Comprehensive retry logic and graceful degradation
- **Load Balancing**: Connection distribution and failover strategies

## Current Implementation Status

### ✅ **COMPLETED SEQUENCES**
- **Real-Time Data Flow**: WebSocket streaming with 1-2s freshness
- **User Dashboard**: Complete interaction flow with responsive design
- **Theme System**: Dynamic switching with CSS Custom Properties
- **WebSocket Management**: Connection handling and reconnection logic
- **Search Functionality**: Advanced filtering and caching strategies

### 🎯 **NEXT PHASE GOALS**
- **ThreeJS Interactions**: 3D blockchain visualization sequences
- **Enhanced Search**: Additional search types and result presentation
- **Mobile Flows**: Mobile-specific interaction patterns
- **Advanced Analytics**: Complex query sequences and data visualization

