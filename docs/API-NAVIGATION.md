# 🧭 BlockSight.live API Navigation Guide

**Document Type:** Navigation Guide  
**Version:** 1.0.0  
**Created:** 2025-08-30  
**Status:** Active Development  
**Last Modified:** 2025-08-30

---

## 🎯 **PURPOSE**

This guide provides quick navigation to all API-related documentation and resources in the BlockSight.live system. Use this as your starting point for any API development work.

---

## 📚 **API DOCUMENTATION INDEX**

### **Core API Documents**
- **[API Endpoints](API-ENDPOINTS.md)** - Complete endpoint reference with schemas and examples
- **[API Standards](API-STANDARDS.md)** - Development standards and best practices
- **[API Navigation](API-NAVIGATION.md)** - This navigation guide

### **Related Documentation**
- **[Code Standards](code-standard.md)** - Development standards including API requirements
- **[Developer Handbook](developer-handbook.md)** - General development guidelines
- **[Model Specification](../project-documents/00-model-spec.md)** - System architecture including API layer

---

## 🚀 **QUICK START FOR API DEVELOPMENT**

### **Before You Begin (MANDATORY)**
1. **Read API Standards**: `docs/API-STANDARDS.md`
2. **Review Endpoints**: `docs/API-ENDPOINTS.md`
3. **Check Code Standards**: `docs/code-standard.md` (API section)
4. **Update Model-Spec**: Ensure `project-documents/00-model-spec.md` reflects changes

### **API Development Checklist**
- [ ] **API Standards Compliance**: Follow `docs/API-STANDARDS.md`
- [ ] **Endpoint Documentation**: Update `docs/API-ENDPOINTS.md`
- [ ] **Response Format**: Use standardized `{ ok: boolean, data: T, timestamp: number }`
- [ ] **Error Handling**: Implement proper error codes and messages
- [ ] **Input Validation**: Add Zod schemas for all endpoints
- [ ] **System Diagrams**: Update relevant diagrams in `project-documents/system-diagrams/`
- [ ] **Model-Spec Update**: Reflect changes in `project-documents/00-model-spec.md`

---

## 🔗 **API SERVICE NAVIGATION**

### **System Services**
- **Bootstrap**: `GET /api/v1/bootstrap` - System-level orchestration service for backend readiness and frontend initialization
- **Bootstrap Health**: `GET /api/v1/bootstrap/health` - Detailed health status and service monitoring

### **Electrum Service (`/api/v1/electrum/*`)**
- **Health**: `GET /api/v1/electrum/health` - Server health status
- **Fee Estimates**: `GET /api/v1/electrum/fee/estimates` - Network fees
- **Network Height**: `GET /api/v1/electrum/network/height` - Blockchain height
- **Network Mempool**: `GET /api/v1/electrum/network/mempool` - Mempool status

**Documentation**: See `docs/API-ENDPOINTS.md#electrum-endpoints`

### **Bitcoin Core Service (`/api/v1/core/*`)**
- **Height**: `GET /api/v1/core/height` - Blockchain height from Core
- **Mempool**: `GET /api/v1/core/mempool` - Mempool information

**Documentation**: See `docs/API-ENDPOINTS.md#bitcoin-core-rpc-endpoints`

### **Network Service (`/api/v1/network/*`)**
- **Health**: `GET /api/v1/network/health` - Overall system health

**Documentation**: See `docs/API-ENDPOINTS.md#network-endpoints`

### **WebSocket Service (`/ws`)**
- **Connection**: `ws://localhost:8000/ws` - Real-time updates
- **Events**: `block.new`, `mempool.update`, `fee.update`, `network.status`

**Documentation**: See `docs/API-ENDPOINTS.md#websocket-endpoint`

---

## 🛠️ **DEVELOPMENT RESOURCES**

### **API Standards Reference**
- **Response Formats**: Standardized success/error response structures
- **Error Codes**: Complete list of error codes and messages
- **Validation**: Zod schema implementation examples
- **Performance**: Response time targets and caching strategies
- **Security**: Authentication, CORS, and security headers

**Location**: `docs/API-STANDARDS.md`

### **Code Examples**
- **Controller Pattern**: Standard controller implementation
- **Route Definition**: Route setup and middleware
- **Error Handling**: Comprehensive error handling patterns
- **Validation**: Input validation with Zod
- **Testing**: Unit and integration test examples

**Location**: `docs/API-STANDARDS.md#implementation-standards`

---

## 🔍 **TROUBLESHOOTING & SUPPORT**

### **Common API Issues**
1. **Response Format Errors**: Check `docs/API-STANDARDS.md#response-format-standards`
2. **Validation Failures**: Review Zod schemas in `docs/API-STANDARDS.md#input-validation`
3. **Authentication Issues**: Check Core RPC credentials for protected endpoints
4. **Rate Limiting**: Review rate limit configuration and error responses

### **Development Support**
- **Code Standards**: `docs/code-standard.md` - API development requirements
- **System Diagrams**: `project-documents/system-diagrams/` - Architecture reference
- **Model Specification**: `project-documents/00-model-spec.md` - System overview

---

## 📊 **API MONITORING & METRICS**

### **Health Checks**
- **Electrum Health**: `GET /api/v1/electrum/health`
- **Network Health**: `GET /api/v1/network/health`
- **Core Health**: `GET /api/v1/core/height`

### **Performance Metrics**
- **Response Times**: P50/P95/P99 targets documented
- **Error Rates**: Comprehensive error tracking
- **Cache Performance**: Multi-tier caching metrics
- **Rate Limiting**: Request throttling statistics

---

## 🚨 **CRITICAL REMINDERS**

### **Before Every API Change**
1. **Read API Standards**: `docs/API-STANDARDS.md`
2. **Update Documentation**: Both `API-ENDPOINTS.md` and `API-STANDARDS.md`
3. **Update System Diagrams**: Reflect changes in relevant diagrams
4. **Update Model-Spec**: Ensure `00-model-spec.md` is current
5. **Follow Response Format**: Use standardized response structure
6. **Implement Validation**: Add Zod schemas for all endpoints

### **API Response Standards (MANDATORY)**
```typescript
// Success Response
interface ApiSuccessResponse<T> {
  ok: true;
  data: T;
  timestamp: number;
}

// Error Response  
interface ApiErrorResponse {
  ok: false;
  error: string;
  message: string;
  timestamp: number;
}
```

---

## 📚 **RELATED DOCUMENTATION**

### **System Architecture**
- **[System Context Diagram](../project-documents/system-diagrams/01-system-context-diagram.md)**
- **[Component Architecture](../project-documents/system-diagrams/02-component-architecture-diagram.md)**
- **[Data Flow Diagram](../project-documents/system-diagrams/03-data-flow-diagram.md)**

### **Development Standards**
- **[Code Standards](code-standard.md)** - Complete development guide
- **[Developer Handbook](developer-handbook.md)** - General development practices
- **[Frontend Naming Conventions](frontend/naming-conventions.md)** - Frontend standards

---

**Maintainer:** Development Team  
**Last Review:** 2025-08-30  
**Next Review:** 2025-08-31
