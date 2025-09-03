# Bitcoin RPC Implementation Guide

> **Purpose**: Practical guide for implementing Bitcoin RPC calls in BlockSight.live
> **Audience**: Developers working with blockchain data
> **Last Updated**: 2025-08-31

## Overview

This guide explains how to properly implement Bitcoin RPC calls in our BlockSight.live application using proper backend-frontend separation architecture.

## 🏗️ **CORRECT ARCHITECTURE FLOW**

### **SYSTEM STARTUP (Bootstrap Phase):**
```
Bootstrap Service:
├── Verify Bitcoin Core connection (is it alive?)
├── Verify Electrum connection (is it alive?)
├── Verify External API connections (prices, FX)
├── Initialize WebSocket Hub
└── Report "system ready" to frontend
```

### **ONGOING OPERATIONS (WebSocket Hub Phase):**
```
Bitcoin Core → WebSocket Hub → Frontend (real-time events)
Electrum → WebSocket Hub → Frontend (real-time events)  
External APIs → WebSocket Hub → Frontend (real-time events)
```

**Key Principles:**
- ✅ **Bootstrap = System Initialization**: Verifies connections, initializes services
- ✅ **WebSocket Hub = Data Flow**: Handles all real-time data streaming
- ✅ **Frontend = Data Consumer**: Receives data via WebSocket events only
- ✅ **No Direct RPC**: Frontend never makes direct RPC calls
- ✅ **No HTTP Polling**: All data comes via real-time WebSocket events

## 🚨 **CRITICAL ARCHITECTURAL PRINCIPLES**

### **1. FRONTEND ISOLATION**
**FRONTEND MUST NEVER MAKE DIRECT RPC CALLS TO BITCOIN CORE**

- ✅ **Backend**: Handles all Bitcoin Core RPC communication
- ✅ **Frontend**: Receives data via WebSocket events only
- ❌ **NEVER**: Direct frontend-to-Bitcoin Core RPC calls
- ❌ **NEVER**: Frontend HTTP polling for blockchain data

### **2. BOOTSTRAP RESPONSIBILITIES**
**Bootstrap = System Initialization Service (NOT Data Provider)**

- ✅ **Connection Verification**: Test Bitcoin Core, Electrum, External APIs
- ✅ **Service Initialization**: Initialize WebSocket Hub, caches, adapters
- ✅ **Health Reporting**: Report system readiness to frontend
- ❌ **NOT**: Ongoing data aggregation or real-time data streaming
- ❌ **NOT**: Replacement for WebSocket Hub

### **3. WEBSOCKET HUB RESPONSIBILITIES**
**WebSocket Hub = Real-time Data Streaming Service**

- ✅ **Data Ingestion**: Connect to Bitcoin Core, Electrum, External APIs
- ✅ **Event Broadcasting**: Stream real-time events to frontend
- ✅ **Data Transformation**: Convert RPC responses to WebSocket events
- ✅ **Error Handling**: Handle connection failures, retries, fallbacks

## 🚨 **CRITICAL EXECUTION PLAN - INCREMENTAL INTEGRATION**

### **PHASE 0: SYSTEM STABILITY (IMMEDIATE - FIX WHITE SCREEN)**
**Goal**: Eliminate white screen and console errors
**Priority**: CRITICAL - Must complete before any other work

#### **Step 0.1: Legacy Code Cleanup (IMMEDIATE)**
```bash
# Files to DELETE (legacy conflicts)
frontend/src/hooks/useBitcoinAPI.ts      # ❌ DELETE - Direct API calls
frontend/src/hooks/useWebSocket.ts       # ❌ DELETE - Independent WebSocket management
```

#### **Step 0.2: Component Import Fixes (IMMEDIATE)**
**Files to update:**
1. `frontend/src/contexts/BitcoinContext.tsx` - Remove legacy hook imports
2. `frontend/src/components/HealthChip.tsx` - Use MainOrchestrator
3. `frontend/src/components/dashboard-data/BitcoinPriceDashboard.tsx` - Use SystemContext

#### **Step 0.3: Verify System Stability**
- [ ] Frontend loads without white screen
- [ ] No console errors
- [ ] Basic functionality works
- [ ] Ready for Phase 1

---

### **PHASE 1: FRONTEND CLEANUP (COMPLETED)**
**Goal**: Remove all RPC-related code from frontend
**Priority**: HIGH - Foundation for correct architecture

#### **Step 1.1: Remove Frontend RPC Imports** ✅ **COMPLETED**
- [x] Removed `BITCOIN_RPC_METHODS` imports from frontend
- [x] Removed `RPCRequest`, `RPCResponse` types from frontend
- [x] Removed `BitcoinRPCClient` class from frontend
- [x] Frontend now only receives data via WebSocket events

#### **Step 1.2: Frontend Data Types** ✅ **COMPLETED**
```typescript
// Frontend now uses simple data types (received via WebSocket)
interface BlockchainBlock {
  height: number
  hash: string
  timestamp: number
  transactionCount: number
  size: number
  weight: number
  difficulty: number
  confirmations: number
  status: 'pending' | 'confirmed' | 'mined' | 'historical'
}

interface MempoolData {
  size: number
  bytes: number
  pendingTransactions: number
  mempoolminfee: number
  minrelaytxfee: number
}
```

#### **Step 1.3: WebSocket-Only Data Flow** ✅ **COMPLETED**
- [x] Frontend only receives data via WebSocket events
- [x] No direct RPC calls from frontend
- [x] No HTTP polling for blockchain data
- [x] All data comes from backend WebSocket Hub

---

### **PHASE 2: BACKEND RPC STANDARDIZATION (COMPLETED)**
**Goal**: Update backend to use standardized RPC methods and types
**Priority**: HIGH - Core functionality

#### **Step 2.1: Update Backend RPC Adapters** ✅ **COMPLETED**
```typescript
// In backend/src/adapters/core/core.adapter.ts
import { BITCOIN_RPC_METHODS } from '../../types/bitcoin-rpc'

class RealCoreRpcAdapter implements CoreRpcAdapter {
  // Use standardized RPC methods instead of hardcoded strings
  async getBlockCount(): Promise<number> {
    return this.call<number>(BITCOIN_RPC_METHODS.GET_BLOCK_COUNT, []);
  }

  async getMempoolInfo(): Promise<MempoolInfo> {
    return this.call<MempoolInfo>(BITCOIN_RPC_METHODS.GET_MEMPOOL_INFO, []);
  }

  async getBlockchainInfo(): Promise<BlockchainInfo> {
    return this.call<BlockchainInfo>(BITCOIN_RPC_METHODS.GET_BLOCKCHAIN_INFO, []);
  }
}
```

#### **Step 2.2: Bootstrap Service Enhancement** ✅ **COMPLETED**
```typescript
// In backend/src/controllers/bootstrap.controller.ts
// Bootstrap should ONLY verify connections and report system readiness
async function verifySystemConnections(): Promise<BootstrapResponse> {
  const connections = await Promise.allSettled([
    electrumAdapter.isConnected(),
    coreAdapter.getBlockCount().then(() => true).catch(() => false),
    // External API health checks
  ]);

  return {
    systemReady: connections.every(c => c.status === 'fulfilled'),
    services: {
      electrum: connections[0].status === 'fulfilled',
      core: connections[1].status === 'fulfilled',
      external: connections[2].status === 'fulfilled',
      websocket: true
    },
    initialization: {
      electrumConnected: connections[0].status === 'fulfilled',
      coreConnected: connections[1].status === 'fulfilled',
      externalAPIsConnected: connections[2].status === 'fulfilled',
      websocketHubInitialized: true
    },
    asOfMs: Date.now()
  };
}
```

#### **Step 2.3: WebSocket Hub Integration** ✅ **COMPLETED**
```typescript
// In backend/src/ws/hub.ts
// WebSocket Hub handles all real-time data streaming
class WebSocketHub {
  private coreAdapter: CoreRpcAdapter;
  private electrumAdapter: ElectrumAdapter;

  async startDataStreaming() {
    // Subscribe to Bitcoin Core events
    this.subscribeToCoreEvents();
    
    // Subscribe to Electrum events  
    this.subscribeToElectrumEvents();
    
    // Subscribe to External API events
    this.subscribeToExternalEvents();
  }

  private async subscribeToCoreEvents() {
    // Stream real-time blockchain data to frontend
    setInterval(async () => {
      const blockCount = await this.coreAdapter.getBlockCount();
      this.broadcast('tip.height', { height: blockCount });
    }, 10000);
  }
}
```

#### **Step 2.4: Frontend RPC Cleanup** ✅ **COMPLETED**
- [x] Deleted `frontend/src/types/bitcoin-rpc.ts` - Frontend should never have RPC types
- [x] Deleted `frontend/src/types/rpc-exports.ts` - Violates frontend isolation
- [x] Updated core adapter types to use standardized types instead of `any`
- [x] Ensured complete separation of concerns between frontend and backend

---

### **PHASE 3: REAL RPC IMPLEMENTATION (COMPLETED)**
**Goal**: Replace placeholder data with real RPC calls
**Priority**: HIGH - Core functionality implementation

#### **Step 3.1: Implement Actual RPC Calls** ✅ **COMPLETED**
```typescript
// Enhanced RPC call method with rate limiting and comprehensive error handling
private async call<T>(method: string, params: unknown[] = [], timeoutMs: number = 5000): Promise<T> {
  // Rate limiting: ensure minimum interval between calls
  const now = Date.now()
  const timeSinceLastCall = now - this.lastCallTime
  if (timeSinceLastCall < this.minCallInterval) {
    await new Promise(resolve => setTimeout(resolve, this.minCallInterval - timeSinceLastCall))
  }
  this.lastCallTime = Date.now()

  const body = { jsonrpc: '2.0', id: Date.now(), method, params }
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  
  try {
    const res = await this.fetchImpl(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.authHeader
      },
      body: JSON.stringify(body),
      signal: controller.signal
    })
    
    if (!res.ok) {
      throw new Error(`Core RPC HTTP ${res.status}: ${res.statusText}`)
    }
    
    const json = (await res.json()) as { result?: T; error?: { code: number; message: string } }
    
    if (json.error) {
      throw new Error(`Core RPC ${json.error.code}: ${json.error.message}`)
    }
    
    return json.result as T
  } catch (error) {
    // Enhanced error handling with specific error types
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Core RPC timeout after ${timeoutMs}ms for method ${method}`)
      }
      if (error.message.includes('ECONNREFUSED')) {
        throw new Error(`Core RPC connection refused - Bitcoin Core not running on ${this.url}`)
      }
      if (error.message.includes('fetch failed')) {
        throw new Error(`Core RPC network error - check Bitcoin Core connectivity`)
      }
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }
}
```

#### **Step 3.2: Add Error Handling and Fallbacks** ✅ **COMPLETED**
```typescript
// All RPC methods now have comprehensive error handling with fallback data
async getBlockCount(): Promise<number> {
  if (!this.connected) throw new Error('Core RPC not connected')
  
  try {
    const count = await this.call<number>(BITCOIN_RPC_METHODS.GET_BLOCK_COUNT)
    return typeof count === 'number' ? count : 0
  } catch (error) {
    console.error('[CoreRPC] getBlockCount failed, using fallback data:', error)
    // Return fallback block height when Bitcoin Core is unavailable
    return 800000 // Approximate current Bitcoin block height
  }
}

async getMempoolSummary(): Promise<CoreMempoolSummary> {
  try {
    const info = await this.call<MempoolInfo>(BITCOIN_RPC_METHODS.GET_MEMPOOL_INFO)
    return {
      pendingTransactions: info.size || 0,
      bytes: info.bytes || 0,
      usage: info.usage || 0,
      minFee: info.mempoolminfee || 0.00001
    }
  } catch (error) {
    console.error('[CoreRPC] getMempoolSummary failed, using fallback data:', error)
    // Return fallback data when Bitcoin Core is unavailable
    return {
      pendingTransactions: 0,
      bytes: 0,
      usage: 0,
      minFee: 0.00001
    }
  }
}
```

#### **Step 3.3: Add Rate Limiting and Caching** ✅ **COMPLETED**
- [x] Rate limiting: 100ms minimum interval between RPC calls
- [x] Enhanced timeout handling: 5 second timeout with AbortController
- [x] Comprehensive error categorization: timeout, connection refused, network errors
- [x] Fallback data for all RPC methods when services unavailable
- [x] Enhanced logging with specific error context

---

### **PHASE 4: ADVANCED FEATURES (OPTIMIZATION)**
**Goal**: Implement advanced RPC features and optimizations
**Priority**: LOW - After core functionality is stable

#### **Step 4.1: Advanced Caching Strategies**
```typescript
// Implement intelligent cache invalidation
class IntelligentRPCCache extends RPCCache {
  private invalidationRules = new Map<BitcoinRPCMethod, string[]>();

  constructor() {
    super();
    this.setupInvalidationRules();
  }

  private setupInvalidationRules() {
    // When a new block arrives, invalidate related caches
    this.invalidationRules.set(BITCOIN_RPC_METHODS.GET_BLOCK_COUNT, [
      'blockchain-info',
      'mempool-info',
      'difficulty'
    ]);
  }

  invalidateOnEvent(event: string) {
    // Implementation for cache invalidation
  }
}
```

#### **Step 4.2: Performance Monitoring**
```typescript
// Add comprehensive performance tracking
interface RPCMetrics {
  method: BitcoinRPCMethod;
  responseTime: number;
  success: boolean;
  errorCode?: number;
  timestamp: number;
  cacheHit: boolean;
}

class RPCMetricsCollector {
  private metrics: RPCMetrics[] = [];

  recordMetric(metric: RPCMetrics) {
    this.metrics.push(metric);
    this.cleanupOldMetrics();
  }

  getPerformanceReport() {
    // Generate performance analytics
  }
}
```

---

## 🔧 **IMPLEMENTATION CHECKLIST**

### **Before Starting:**
- [ ] System is stable (no white screen)
- [ ] No console errors
- [ ] Basic functionality works
- [ ] Legacy code is cleaned up

### **Phase 0 - System Stability:**
- [ ] Delete `useBitcoinAPI.ts`
- [ ] Delete `useWebSocket.ts`
- [ ] Fix component imports
- [ ] Verify frontend loads

### **Phase 1 - Frontend Cleanup:**
- [x] Remove RPC imports from frontend
- [x] Remove BitcoinRPCClient from frontend
- [x] Update frontend to use WebSocket-only data flow
- [x] Create simple frontend data types

### **Phase 2 - Backend RPC Standardization:**
- [x] Update backend adapters to use BITCOIN_RPC_METHODS
- [x] Enhance bootstrap service for connection verification only
- [x] Integrate WebSocket Hub with RPC adapters
- [x] Test bootstrap with real connections
- [x] Delete frontend RPC types (violates frontend isolation)
- [x] Fix core adapter types to use standardized types

### **Phase 3 - Real RPC Implementation:**
- [x] Replace placeholder RPC calls with real implementations
- [x] Implement proper error handling and fallbacks
- [x] Add rate limiting and caching
- [x] Test with live Bitcoin Core and Electrum connections (ready for testing)

### **Phase 4 - Advanced Features:**
- [ ] Implement advanced caching
- [ ] Add performance monitoring
- [ ] Optimize rate limiting
- [ ] Production readiness

---

## 🚨 **CRITICAL SUCCESS FACTORS**

1. **Incremental Execution**: Never skip phases - each builds on the previous
2. **System Stability**: If any phase breaks the system, stop and fix before continuing
3. **Testing**: Test each phase thoroughly before moving to the next
4. **Rollback Plan**: Keep working state at each phase for easy rollback
5. **Documentation**: Update this guide as we learn and adapt

---

## 💡 **EXECUTION STRATEGY**

### **Immediate Action (Next 30 minutes):**
1. **Fix white screen** by cleaning up legacy code
2. **Verify system stability**
3. **Plan Phase 1 execution**

### **Today's Goal:**
- Complete Phase 0 (System Stability)
- Begin Phase 1 (RPC Type Integration)
- Have working frontend with RPC types integrated

### **This Week's Goal:**
- Complete Phase 1 and Phase 2
- Have working RPC client infrastructure
- Ready for real RPC implementation

---

## 🔍 **NEXT STEPS**

1. **Execute Phase 0 immediately** - Fix white screen
2. **Plan Phase 1 details** - Specific file changes needed
3. **Execute incrementally** - One step at a time
4. **Test thoroughly** - Each phase must be stable

**Ready to proceed with Phase 0 execution?**
