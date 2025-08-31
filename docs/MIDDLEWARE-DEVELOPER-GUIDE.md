# 🔧 BlockSight.live Middleware Developer Guide

/**
 * @fileoverview Comprehensive guide to the BlockSight.live middleware architecture
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-30
 * @lastModified 2025-08-30
 * 
 * @description
 * This guide explains the middleware architecture, how to use existing middleware,
 * how to create new middleware, and how to monitor system performance.
 * 
 * @dependencies
 * - All middleware files in backend/src/middleware/
 * - Express.js framework
 * - Redis for caching
 * - Prometheus for metrics
 * 
 * @state
 * ✅ PRODUCTION READY - Complete middleware stack implemented
 * 
 * @todo
 * - Add more specific validation schemas
 * - Implement custom middleware patterns
 * - Add middleware performance profiling
 */

## 🎯 **Purpose**

This guide provides developers with comprehensive information about the BlockSight.live middleware system, including:

- **Middleware Architecture** - How the middleware stack works
- **Using Existing Middleware** - How to apply middleware to routes
- **Creating New Middleware** - Patterns and best practices
- **Monitoring & Observability** - How to track system performance
- **Validation System** - How to use and extend validation schemas
- **Testing Middleware** - How to test middleware components

## 🏗️ **Middleware Architecture Overview**

### **Request Processing Pipeline**

Every request to the BlockSight.live API goes through this middleware stack in order:

```
Request → Request ID → Metrics → Security → Rate Limit → Body Parse → Validation → Route → Response → Error Handler
```

### **Middleware Stack Order (CRITICAL)**

1. **`errorHandler.requestId`** - Generate unique request ID for tracking
2. **`MetricsMiddleware.collect`** - Collect performance metrics
3. **`SecurityMiddleware.comprehensive`** - Apply security headers and CORS
4. **`globalRateLimit`** - Global rate limiting
5. **`express.json()` & `express.urlencoded()`** - Parse request bodies
6. **Service-specific rate limits** - Apply to specific route groups
7. **Validation middleware** - Validate request parameters
8. **Route handlers** - Execute business logic
9. **Error handling** - Process errors and generate responses
10. **404 handler** - Handle unmatched routes

### **File Structure**

```
backend/src/middleware/
├── index.ts                    # Central export file
├── error-handler.middleware.ts # Error handling and request ID
├── metrics.middleware.ts       # Performance metrics collection
├── security.middleware.ts      # Security headers and CORS
├── validation.middleware.ts    # Request validation schemas
├── cache.middleware.ts         # Redis caching and management
└── rate-limit.middleware.ts    # Rate limiting configuration
```

## 🚀 **Using Existing Middleware**

### **Applying Middleware to Routes**

#### **Global Middleware (Applied to All Routes)**

```typescript
// In app.ts - applied to all routes automatically
app.use(errorHandler.requestId);           // Request tracking
app.use(MetricsMiddleware.collect);        // Performance metrics
app.use(SecurityMiddleware.comprehensive); // Security headers
app.use(globalRateLimit);                  // Global rate limiting
```

#### **Service-Specific Middleware**

```typescript
// Apply to specific route groups
app.use('/api/v1/health', healthRateLimit);
app.use('/api/v1/electrum', publicRateLimit);
app.use('/api/v1/core', coreRateLimit);
app.use('/api/v1/network', publicRateLimit);
```

#### **Route-Level Middleware**

```typescript
// Apply validation to specific routes
app.get('/api/v1/electrum/address/:address', 
  ValidationMiddleware.validateParams(ElectrumSchemas.getBalance),
  electrumController.getBalance
);

app.post('/api/v1/electrum/tx/broadcast',
  ValidationMiddleware.validateBody(ElectrumSchemas.broadcastTransaction),
  electrumController.broadcastTransaction
);
```

### **Validation Middleware Usage**

#### **Available Validation Schemas**

```typescript
import { ValidationMiddleware, CommonSchemas, ElectrumSchemas } from '../middleware';

// Common schemas for all services
CommonSchemas.bitcoinAddress      // Bitcoin address validation
CommonSchemas.transactionHash     // Transaction hash validation
CommonSchemas.blockHeight         // Block height validation
CommonSchemas.pagination          // Pagination parameters
CommonSchemas.network             // Network parameter validation
CommonSchemas.timestamp           // Timestamp validation
CommonSchemas.numericRange        // Numeric range validation

// Electrum-specific schemas
ElectrumSchemas.getBalance        // Get balance request
ElectrumSchemas.getTransaction    // Get transaction request
ElectrumSchemas.getHistory        // Get history request
ElectrumSchemas.getMempool        // Get mempool request
ElectrumSchemas.getFeeEstimate    // Get fee estimate request
```

#### **Validation Examples**

```typescript
// Validate path parameters
app.get('/api/v1/electrum/address/:address',
  ValidationMiddleware.validateParams({
    address: CommonSchemas.bitcoinAddress
  }),
  electrumController.getBalance
);

// Validate query parameters
app.get('/api/v1/electrum/history/:address',
  ValidationMiddleware.validateParams({
    address: CommonSchemas.bitcoinAddress
  }),
  ValidationMiddleware.validateQuery(CommonSchemas.pagination),
  electrumController.getHistory
);

// Validate request body
app.post('/api/v1/electrum/tx/broadcast',
  ValidationMiddleware.validateBody({
    hex: CommonSchemas.transactionHex
  }),
  electrumController.broadcastTransaction
);
```

### **Error Handling Middleware**

#### **Standardized Error Responses**

All errors follow the `ApiErrorResponse` interface:

```typescript
interface ApiErrorResponse {
  ok: false;
  error: string;        // Error type (e.g., 'validation_error')
  message: string;      // Human-readable error message
  timestamp: number;    // Unix timestamp
}
```

#### **Available Error Types**

```typescript
enum ErrorType {
  VALIDATION_ERROR = 'validation_error',
  AUTHENTICATION_FAILED = 'authentication_failed',
  SERVICE_UNAVAILABLE = 'service_unavailable',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  NOT_FOUND = 'not_found',
  INTERNAL_ERROR = 'internal_error',
  EXTERNAL_SERVICE_ERROR = 'external_service_error',
  TIMEOUT_ERROR = 'timeout_error'
}
```

#### **Using Error Handler in Controllers**

```typescript
import { asyncErrorWrapper } from '../middleware/error-handler.middleware';

// Wrap async controller methods
export const getBalance = asyncErrorWrapper(async (req: Request, res: Response) => {
  const { address } = req.params;
  
  try {
    const balance = await electrumService.getBalance(address);
    res.json({
      ok: true,
      data: balance,
      timestamp: Date.now()
    });
  } catch (error) {
    // Error will be automatically handled by errorHandler.middleware
    throw error;
  }
});
```

## 📊 **Monitoring & Observability**

### **Available Monitoring Endpoints**

#### **Prometheus Metrics Export**

```bash
# Get Prometheus-compatible metrics
curl http://localhost:8000/metrics

# Example output:
# http_requests_total{method="GET",endpoint="/api/v1/electrum/health",status="200"} 42
# http_request_duration_seconds{method="GET",endpoint="/api/v1/electrum/health",quantile="0.95"} 0.15
# cache_hits_total{service="electrum"} 156
# cache_misses_total{service="electrum"} 23
```

#### **System Health Monitoring**

```bash
# Check system health and performance
curl http://localhost:8000/api/v1/metrics/health

# Example response:
{
  "ok": true,
  "data": {
    "uptime": 3600,
    "memory": {
      "used": 128,
      "total": 512,
      "percentage": 25
    },
    "redis": {
      "connected": true,
      "keys": 1250,
      "memory": "64MB"
    },
    "performance": {
      "p50": 45,
      "p95": 150,
      "p99": 300
    }
  },
  "timestamp": 1693425600000
}
```

#### **Cache Performance Statistics**

```bash
# View cache performance metrics
curl http://localhost:8000/api/v1/cache/stats

# Example response:
{
  "ok": true,
  "data": {
    "totalKeys": 1250,
    "memoryUsage": "64MB",
    "hitRate": 87.2,
    "services": {
      "electrum": {
        "keys": 450,
        "hitRate": 89.1,
        "memory": "28MB"
      },
      "core": {
        "keys": 800,
        "hitRate": 85.8,
        "memory": "36MB"
      }
    }
  },
  "timestamp": 1693425600000
}
```

### **Cache Management Endpoints**

#### **Invalidate Cache for Specific Service**

```bash
# Invalidate all cache for electrum service
curl -X POST http://localhost:8000/api/v1/cache/invalidate/electrum

# Invalidate all cache for core service
curl -X POST http://localhost:8000/api/v1/cache/invalidate/core
```

#### **Clear All Cache**

```bash
# Clear all cache (use with caution)
curl -X POST http://localhost:8000/api/v1/cache/invalidate-all
```

### **Performance Metrics Available**

#### **Request Metrics**

- **Total Requests** - Count of all requests by endpoint and method
- **Response Times** - P50, P95, P99 latencies by endpoint
- **Error Rates** - Error counts by type and endpoint
- **Status Codes** - Distribution of HTTP status codes

#### **Cache Metrics**

- **Hit Rates** - Cache hit percentage by service
- **Memory Usage** - Redis memory consumption
- **Key Counts** - Number of cached keys by service
- **TTL Distribution** - Distribution of cache TTL values

#### **System Metrics**

- **Uptime** - System uptime in seconds
- **Memory Usage** - Node.js process memory consumption
- **Redis Status** - Connection status and performance
- **WebSocket Metrics** - Connection counts and broadcast latencies

## 🛠️ **Creating New Middleware**

### **Middleware Development Pattern**

#### **1. Create Middleware File**

```typescript
// backend/src/middleware/custom.middleware.ts

import { Request, Response, NextFunction } from 'express';

/**
 * Custom middleware example
 */
export function customMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    // Middleware logic here
    console.log(`Custom middleware processing: ${req.method} ${req.path}`);
    
    // Add data to request object if needed
    (req as any).customData = 'processed';
    
    next();
  } catch (error) {
    next(error);
  }
}

// Export middleware object
export const CustomMiddleware = {
  process: customMiddleware
};
```

#### **2. Add to Middleware Index**

```typescript
// backend/src/middleware/index.ts

export * from './custom.middleware';

// Add to the main export object if needed
export const AllMiddleware = {
  // ... existing middleware
  custom: CustomMiddleware
};
```

#### **3. Apply in Application**

```typescript
// backend/src/app.ts

import { CustomMiddleware } from './middleware';

// Apply globally
app.use(CustomMiddleware.process);

// Or apply to specific routes
app.use('/api/v1/custom', CustomMiddleware.process);
```

### **Validation Schema Development**

#### **Creating New Validation Schemas**

```typescript
// Add to validation.middleware.ts or create new file

export const CustomSchemas = {
  // Custom validation schema
  customRequest: z.object({
    id: z.string().uuid(),
    data: z.object({
      name: z.string().min(1).max(100),
      value: z.number().positive(),
      tags: z.array(z.string()).optional()
    }),
    metadata: z.record(z.string(), z.unknown()).optional()
  }),

  // Custom parameter validation
  customParams: z.object({
    id: z.string().uuid(),
    version: z.coerce.number().int().min(1).max(10)
  })
};
```

#### **Using Custom Schemas**

```typescript
import { ValidationMiddleware, CustomSchemas } from '../middleware';

app.post('/api/v1/custom',
  ValidationMiddleware.validateBody(CustomSchemas.customRequest),
  customController.process
);

app.get('/api/v1/custom/:id/version/:version',
  ValidationMiddleware.validateParams(CustomSchemas.customParams),
  customController.getVersion
);
```

## 🧪 **Testing Middleware**

### **Middleware Testing Pattern**

#### **Testing Individual Middleware**

```typescript
// backend/tests/middleware.test.ts

import request from 'supertest';
import express from 'express';
import { CustomMiddleware } from '../src/middleware';

function createTestApp() {
  const app = express();
  app.use(CustomMiddleware.process);
  app.get('/test', (req, res) => {
    res.json({ customData: (req as any).customData });
  });
  return app;
}

describe('Custom Middleware', () => {
  it('should process requests and add custom data', async () => {
    const app = createTestApp();
    
    const response = await request(app)
      .get('/test')
      .expect(200);
    
    expect(response.body.customData).toBe('processed');
  });
});
```

#### **Testing Middleware Integration**

```typescript
describe('Middleware Integration', () => {
  it('should apply all middleware in correct order', async () => {
    const app = createTestApp();
    
    // Test that middleware stack works correctly
    const response = await request(app)
      .get('/api/v1/electrum/health')
      .expect(200);
    
    // Verify response format
    expect(response.body).toHaveProperty('ok');
    expect(response.body).toHaveProperty('timestamp');
  });
});
```

### **Validation Testing**

#### **Testing Validation Schemas**

```typescript
describe('Validation Schemas', () => {
  it('should validate Bitcoin addresses correctly', () => {
    const validAddress = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
    const invalidAddress = 'invalid-address';
    
    expect(CommonSchemas.bitcoinAddress.safeParse(validAddress).success).toBe(true);
    expect(CommonSchemas.bitcoinAddress.safeParse(invalidAddress).success).toBe(false);
  });
});
```

## 🔍 **Debugging Middleware**

### **Request ID Tracking**

Every request gets a unique ID that can be used for debugging:

```typescript
// In your controller or middleware
console.log(`Processing request: ${req.requestId}`);

// The ID is automatically added to error responses
// Use it to correlate logs across the system
```

### **Middleware Debugging**

#### **Enable Debug Logging**

```typescript
// Set environment variable for detailed middleware logging
DEBUG=middleware:* npm run dev
```

#### **Check Middleware Order**

```typescript
// Add logging to see middleware execution order
app.use((req, res, next) => {
  console.log(`Middleware: ${req.method} ${req.path}`);
  next();
});
```

### **Performance Debugging**

#### **Check Response Times**

```bash
# Use curl with timing to see response times
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:8000/api/v1/electrum/health"

# Create curl-format.txt with:
#      time_namelookup:  %{time_namelookup}\n
#         time_connect:  %{time_connect}\n
#      time_appconnect:  %{time_appconnect}\n
#     time_pretransfer:  %{time_pretransfer}\n
#        time_redirect:  %{time_redirect}\n
#   time_starttransfer:  %{time_starttransfer}\n
#                      ----------\n
#           time_total:  %{time_total}\n
```

#### **Monitor Cache Performance**

```bash
# Check cache hit rates in real-time
watch -n 5 'curl -s http://localhost:8000/api/v1/cache/stats | jq ".data.hitRate"'
```

## 🚀 **Performance Optimization**

### **Middleware Performance Best Practices**

#### **1. Minimize Middleware Overhead**

```typescript
// Avoid expensive operations in middleware
// Use async operations sparingly
// Cache expensive computations
```

#### **2. Optimize Validation**

```typescript
// Use efficient validation patterns
// Cache validation results when possible
// Avoid deep object validation in hot paths
```

#### **3. Monitor Performance Impact**

```typescript
// Track middleware execution time
// Monitor memory usage
// Profile hot paths
```

### **Caching Strategies**

#### **TTL Management**

```typescript
// Use appropriate TTL values
const TTL_STRATEGIES = {
  L1: 1000,      // 1 second - frequently changing data
  L2: 300000,    // 5 minutes - moderately stable data
  L3: 3600000    // 1 hour - stable data
};
```

#### **Cache Invalidation**

```typescript
// Invalidate related cache when data changes
await CacheInvalidator.invalidateByPattern('electrum:*');
await CacheInvalidator.invalidateByService('core');
```

## 🔒 **Security Considerations**

### **Input Validation**

- **Always validate** all input parameters
- **Use Zod schemas** for consistent validation
- **Sanitize user input** before processing
- **Implement rate limiting** to prevent abuse

### **Error Handling**

- **Don't expose** internal system details in errors
- **Log errors** with request IDs for debugging
- **Use appropriate** HTTP status codes
- **Implement graceful** error handling

### **Monitoring Security**

- **Track failed** validation attempts
- **Monitor rate** limit violations
- **Alert on** unusual error patterns
- **Log security** events for audit

## 📚 **Additional Resources**

### **Related Documentation**

- **`docs/code-standard.md`** - Development standards including middleware requirements
- **`docs/API-STANDARDS.md`** - API development standards and patterns
- **`docs/API-ENDPOINTS.md`** - Complete API endpoint documentation
- **`project-documents/00-model-spec.md`** - System architecture including middleware

### **External Resources**

- **Express.js Middleware** - [Express.js Documentation](https://expressjs.com/en/guide/using-middleware.html)
- **Zod Validation** - [Zod Documentation](https://zod.dev/)
- **Prometheus Metrics** - [Prometheus Documentation](https://prometheus.io/docs/)
- **Redis Caching** - [Redis Documentation](https://redis.io/documentation)

---

**Last Updated**: 2025-08-30  
**Status**: ✅ **PRODUCTION READY** - Complete middleware stack implemented and documented
