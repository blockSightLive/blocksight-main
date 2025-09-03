# 🚀 BlockSight.live API Endpoints Documentation

**Document Type:** API Reference  
**Version:** 1.0.0  
**Created:** 2025-08-30  
**Status:** Active Development  
**Last Modified:** 2025-08-30

---

## 🏗️ **API ARCHITECTURE OVERVIEW**

### **Base URL Structure:**
```
http://localhost:8000/api/v1/
```

### **Critical Port Usage Notes:**
- **Backend API Server**: Runs on port 8000 (`localhost:8000`)
- **Frontend Development Server**: Runs on port 3000 (`localhost:3000`)
- **Frontend API Calls**: Must use `localhost:8000` for all backend API requests
- **WebSocket Connection**: Frontend connects to `ws://localhost:8000/ws`
- **CORS Configuration**: Backend allows frontend origin `http://localhost:3000`

### **Frontend Integration Example:**
```typescript
// ✅ CORRECT - Use backend port (8000)
const response = await fetch('http://localhost:8000/api/v1/core/height')

// ❌ INCORRECT - Don't use relative paths (resolves to frontend port 3000)
const response = await fetch('/api/v1/core/height')
```

### **Consistent Namespacing Strategy:**
- **`/electrum/*`** - All Electrum-related endpoints
- **`/core/*`** - All Bitcoin Core RPC endpoints
- **`/network/*`** - Network status and health endpoints
- **`/metrics/*`** - API metrics and monitoring endpoints
- **`/cache/*`** - Cache management endpoints
- **`/ws`** - WebSocket connection endpoint

### **API Versioning Strategy:**
- **Current Version:** v1
- **Breaking Changes:** Will increment major version (v2, v3)
- **Deprecation Policy:** Legacy endpoints marked deprecated 6 months before removal
- **Migration Path:** Clear upgrade guides for breaking changes

---

## 📡 **ELECTRUM ENDPOINTS**

### **Base Path:** `/api/v1/electrum/*`

#### **Bootstrap (System Orchestration Service)**
- **GET** `/api/v1/bootstrap`
- **Purpose**: System-level orchestration service that provides frontend cold-start data for dashboard initialization
- **Response**: Complete system snapshot including blockchain height, mempool status, price data, and service health
- **Cache**: L1 cache with 3-second TTL for high-frequency access
- **Features**: 
  - Graceful degradation when services are unavailable
  - Service health monitoring with detailed status
  - Performance metrics and timing breakdowns
  - Parallel data fetching from multiple sources
  - Automatic fallback between Electrum and Core RPC
  - **NOT an electrum service** - aggregates data from all available services

#### **Bootstrap Health Check**
- **GET** `/api/v1/bootstrap/health`
- **Purpose**: Detailed health status of the bootstrap service and its dependencies
- **Response**: Service status, uptime, version, and individual service health details

#### **Health Check**
- **GET** `/api/v1/electrum/health`
- **Description:** Electrum server health status
- **Response Schema:**
```json
{
  "ok": true,
  "data": {
    "connected": true,
    "serverVersion": "1.4",
    "protocolVersion": "1.4",
    "lastPing": 1693425600000
  },
  "timestamp": 1693425600000
}
```

#### **Fee Estimates**
- **GET** `/api/v1/electrum/fee/estimates`
- **Description:** Current network fee estimates
- **Response Schema:**
```json
{
  "ok": true,
  "data": {
    "fast": 20,
    "normal": 10,
    "slow": 5,
    "unit": "sat/vB",
    "asOfMs": 1693425600000
  },
  "timestamp": 1693425600000
}
```

#### **Network Height**
- **GET** `/api/v1/electrum/network/height`
- **Description:** Current blockchain height from Electrum
- **Response Schema:**
```json
{
  "ok": true,
  "data": {
    "height": 910659,
    "timestamp": 1693425600000,
    "source": "electrum"
  },
  "timestamp": 1693425600000
}
```

#### **Network Mempool**
- **GET** `/api/v1/electrum/network/mempool`
- **Description:** Current mempool status from Electrum
- **Response Schema:**
```json
{
  "ok": true,
  "data": {
    "pendingTransactions": 1250,
    "vsize": 1250000,
    "asOfMs": 1693425600000,
    "source": "electrum"
  },
  "timestamp": 1693425600000
}
```

---

## ⛓️ **BITCOIN CORE RPC ENDPOINTS**

### **Base Path:** `/api/v1/core/*`

#### **Blockchain Height**
- **GET** `/api/v1/core/height`
- **Description:** Current blockchain height from Bitcoin Core
- **Authentication:** Requires Core RPC credentials
- **Response Schema:**
```json
{
  "ok": true,
  "data": {
    "height": 910659,
    "timestamp": 1693425600000,
    "source": "bitcoin-core"
  },
  "timestamp": 1693425600000
}
```

#### **Mempool Summary**
- **GET** `/api/v1/core/mempool`
- **Description:** Mempool information from Bitcoin Core
- **Authentication:** Requires Core RPC credentials
- **Response Schema:**
```json
{
  "ok": true,
  "data": {
    "size": 1250,
    "bytes": 1250000,
    "usage": 1000000,
    "maxmempool": 300000000,
    "mempoolminfee": 0.00001000,
    "minrelaytxfee": 0.00001000,
    "asOfMs": 1693425600000,
    "source": "bitcoin-core"
  },
  "timestamp": 1693425600000
}
```

---

## 🌐 **NETWORK ENDPOINTS**

### **Base Path:** `/api/v1/network/*`

#### **Health Check**
- **GET** `/api/v1/network/health`
- **Description:** Overall system health status
- **Response Schema:**
```json
{
  "ok": true,
  "data": {
    "services": {
      "electrum": true,
      "core": true,
      "websocket": true
    },
    "timestamp": 1693425600000
  },
  "timestamp": 1693425600000
}
```

---

## 🔌 **WEBSOCKET ENDPOINT**

### **WebSocket Connection:**
- **URL:** `ws://localhost:8000/ws`
- **Protocol:** WebSocket
- **Description:** Real-time blockchain updates and events
- **Event Types:**
  - `tip.height` - New blockchain tip height detected (maps to block updates)
  - `network.mempool` - Mempool status change
  - `network.fees` - Fee estimate change
  - `chain.reorg` - Blockchain reorganization detected
  - `price.current` - Current price updates
  - `fx.rates` - Foreign exchange rate updates

### **Event Handling Notes:**
- **Frontend Integration**: The frontend WebSocketHandler processes these events and maps them to appropriate UI updates
- **Event Mapping**: `tip.height` events trigger block update handlers for real-time blockchain visualization
- **Subscription**: Frontend automatically subscribes to all event types on connection

---

## 🔧 **ENVIRONMENT CONFIGURATION**

### **Required Environment Variables:**

#### **Electrum Configuration:**
```bash
ELECTRUM_ENABLED=true
ELECTRUM_HOST=host.docker.internal
ELECTRUM_PORT=50001
ELECTRUM_TLS=false
```

#### **Bitcoin Core Configuration:**
```bash
BITCOIN_CORE_URL=http://localhost:8332
BITCOIN_CORE_USERNAME=rpcuser
BITCOIN_CORE_PASSWORD=rpcpassword
```

#### **General Configuration:**
```bash
PORT=8000
CORS_ORIGIN=http://localhost:3000
REDIS_URL=redis://redis:6379
```

---

## 📊 **RESPONSE FORMATS**

### **Standard Success Response:**
```json
{
  "ok": true,
  "data": {},
  "timestamp": 1693425600000
}
```

### **Standard Error Response:**
```json
{
  "ok": false,
  "error": "error_code",
  "message": "Human readable error message",
  "details": {},
  "timestamp": 1693425600000
}
```

### **Error Codes Reference:**
- `validation_error` - Request validation failed
- `service_unavailable` - Backend service unavailable
- `authentication_failed` - Invalid credentials
- `rate_limit_exceeded` - Too many requests
- `internal_error` - Server internal error

---

## 📊 **METRICS & MONITORING ENDPOINTS**

### **Base Path:** `/api/v1/metrics/*`

#### **Metrics Health**
- **GET** `/api/v1/metrics/health`
- **Description:** Comprehensive API metrics and performance data
- **Response Schema:**
```json
{
  "ok": true,
  "metrics": {
    "system": {
      "totalRequests": 1250,
      "totalEndpoints": 15,
      "averageResponseTime": 45.2,
      "errorRate": 2.1,
      "uptime": 86400000
    },
    "endpoints": {
      "GET /api/v1/electrum/health": {
        "totalRequests": 150,
        "successfulRequests": 148,
        "failedRequests": 2,
        "averageResponseTime": 25.5
      }
    },
    "performance": {
      "GET /api/v1/electrum/health": {
        "p50": 20,
        "p95": 45,
        "p99": 80,
        "p999": 120
      }
    }
  },
  "timestamp": 1693425600000
}
```

#### **Prometheus Metrics**
- **GET** `/metrics`
- **Description:** Prometheus-compatible metrics export
- **Content-Type:** `text/plain`
- **Response:** Prometheus metrics format

---

## 🗄️ **CACHE MANAGEMENT ENDPOINTS**

### **Base Path:** `/api/v1/cache/*`

#### **Cache Statistics**
- **GET** `/api/v1/cache/stats`
- **Description:** Redis cache statistics and performance metrics
- **Response Schema:**
```json
{
  "ok": true,
  "data": {
    "totalKeys": 1250,
    "memoryUsage": "45.2MB",
    "hitRate": 78.5,
    "serviceStats": {}
  },
  "timestamp": 1693425600000
}
```

#### **Cache Invalidation by Service**
- **POST** `/api/v1/cache/invalidate/:service`
- **Description:** Invalidate all cache entries for a specific service
- **Parameters:** `service` - Service name (electrum, core, network, mempool, blocks)
- **Response Schema:**
```json
{
  "ok": true,
  "data": {
    "deleted": 45,
    "service": "electrum"
  },
  "timestamp": 1693425600000
}
```

#### **Cache Invalidation All**
- **POST** `/api/v1/cache/invalidate-all`
- **Description:** Invalidate all cache entries
- **Response Schema:**
```json
{
  "ok": true,
  "data": {
    "deleted": 1250
  },
  "timestamp": 1693425600000
}
```

---

## 🚨 **CRITICAL NOTES**

### **API Versioning:**
- **Current Version:** v1
- **Breaking Changes:** Will increment major version
- **Deprecation:** Legacy endpoints will be marked deprecated before removal

### **Authentication:**
- **Electrum Endpoints:** No authentication required
- **Core RPC Endpoints:** Require Bitcoin Core RPC credentials
- **WebSocket:** No authentication required

### **Rate Limiting:**
- **Current:** ✅ **IMPLEMENTED** - Comprehensive rate limiting for all endpoints
- **Public Endpoints:** 100 requests per 15 minutes per IP
- **Core RPC Endpoints:** 50 requests per 15 minutes per IP (more restrictive)
- **WebSocket Connections:** 10 connection attempts per minute per IP
- **Health Check Endpoints:** 30 requests per minute per IP
- **Global Fallback:** 200 requests per 15 minutes per IP

### **Security Headers:**
- **CORS:** ✅ **IMPLEMENTED** - Enhanced CORS with origin validation
- **Content Security Policy:** ✅ **IMPLEMENTED** - Comprehensive CSP with Helmet
- **Security Headers:** ✅ **IMPLEMENTED** - XSS protection, frame guards, HSTS
- **Request Sanitization:** ✅ **IMPLEMENTED** - Input sanitization and validation
- **Rate Limiting:** ✅ **IMPLEMENTED** - Comprehensive rate limiting (see above)

---

## 🔍 **TESTING ENDPOINTS**

### **Health Check:**
```bash
curl http://localhost:8000/health
```

### **API Introspection:**
```bash
curl http://localhost:8000/api/v1/electrum/
curl http://localhost:8000/api/v1/core/
```

### **Core Height Test:**
```bash
curl http://localhost:8000/api/v1/core/height
```

### **Network Health Test:**
```bash
curl http://localhost:8000/api/v1/network/health
```

---

## 📚 **RELATED DOCUMENTATION**

- **System Architecture:** `docs/system-diagrams/`
- **Development Guide:** `docs/developer-handbook.md`
- **ThreeJS Implementation:** `project-documents/THREEJS_IMPLEMENTATION_PLAN.md`
- **Model Specification:** `project-documents/00-model-spec.md`

---

## 🎯 **API ROADMAP**

### **Phase 1 (Current):**
- ✅ Basic endpoint structure
- ✅ Electrum and Core RPC integration
- ✅ WebSocket real-time updates
- ✅ Health monitoring

### **Phase 2 (Next):**
- ✅ Response caching and optimization
- ✅ Rate limiting implementation
- ✅ Enhanced error handling
- ✅ API metrics and monitoring
- ✅ **API Endpoint Fixes (COMPLETED)** - Fixed port mismatches and WebSocket event alignment

### **Phase 3 (Future):**
- 📋 GraphQL endpoint for complex queries
- 📋 Bulk data export endpoints
- 📋 Advanced filtering and search
- 📋 API key management for premium features

---

**Maintainer:** Development Team  
**Last Review:** 2025-08-30  
**Next Review:** 2025-08-31
