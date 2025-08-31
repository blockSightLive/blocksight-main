# 🚀 BlockSight.live API Development Standards

**Document Type:** Development Standards  
**Version:** 1.0.0  
**Created:** 2025-08-30  
**Status:** Active Development  
**Last Modified:** 2025-08-30

---

## 🎯 **PURPOSE**

This document defines the development standards and best practices for BlockSight.live API development. It ensures consistency, maintainability, and scalability across all API endpoints.

---

## 🏗️ **ARCHITECTURE PRINCIPLES**

### **1. Consistent Naming Convention**
- **Endpoints:** Use kebab-case for URL paths (`/api/v1/electrum/network/height`)
- **Methods:** Use camelCase for JavaScript/TypeScript methods
- **Variables:** Use camelCase for variables and parameters
- **Constants:** Use UPPER_SNAKE_CASE for constants

### **2. RESTful Design**
- **GET:** Retrieve data (no side effects)
- **POST:** Create new resources
- **PUT:** Update entire resources
- **PATCH:** Partial resource updates
- **DELETE:** Remove resources

### **3. Resource-Oriented URLs**
```
/api/v1/{service}/{resource}/{identifier}
/api/v1/electrum/network/height
/api/v1/core/block/123456
/api/v1/network/health
```

---

## 📊 **RESPONSE FORMAT STANDARDS**

### **Success Response Structure**
```typescript
interface ApiSuccessResponse<T> {
  ok: true;
  data: T;
  timestamp: number;
  metadata?: {
    source: string;
    version: string;
    cache?: {
      hit: boolean;
      ttl: number;
    };
  };
}
```

### **Error Response Structure**
```typescript
interface ApiErrorResponse {
  ok: false;
  error: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: number;
  requestId?: string;
}
```

### **Standard Error Codes**
```typescript
enum ApiErrorCodes {
  VALIDATION_ERROR = 'validation_error',
  AUTHENTICATION_FAILED = 'authentication_failed',
  AUTHORIZATION_FAILED = 'authorization_failed',
  RESOURCE_NOT_FOUND = 'resource_not_found',
  SERVICE_UNAVAILABLE = 'service_unavailable',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  INTERNAL_ERROR = 'internal_error'
}
```

---

## 🔧 **IMPLEMENTATION STANDARDS**

### **1. Controller Pattern**
```typescript
export class ElectrumController {
  constructor(
    private adapter: ElectrumAdapter,
    private cache?: L1Cache
  ) {}

  async getHeight(req: Request, res: Response): Promise<void> {
    try {
      const height = await this.adapter.getTipHeight();
      res.json({
        ok: true,
        data: { height, timestamp: Date.now() },
        timestamp: Date.now()
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private handleError(error: unknown, res: Response): void {
    console.error('[ElectrumController] Error:', error);
    res.status(500).json({
      ok: false,
      error: 'internal_error',
      message: 'Internal server error',
      timestamp: Date.now()
    });
  }
}
```

### **2. Route Definition**
```typescript
export function createElectrumRouter(adapter: ElectrumAdapter): Router {
  const r = Router();
  const c = new ElectrumController(adapter);

  // Health check
  r.get('/health', c.getHealth.bind(c));
  
  // Network data
  r.get('/network/height', c.getHeight.bind(c));
  r.get('/network/mempool', c.getMempool.bind(c));

  return r;
}
```

### **3. Middleware Standards**
```typescript
// CORS middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Error handling middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    ok: false,
    error: 'internal_error',
    message: 'Internal server error',
    timestamp: Date.now()
  });
});
```

---

## 🚨 **ERROR HANDLING STANDARDS**

### **1. Error Classification**
- **4xx Errors:** Client errors (validation, authentication, etc.)
- **5xx Errors:** Server errors (internal, service unavailable, etc.)

### **2. Error Response Format**
```typescript
interface DetailedErrorResponse extends ApiErrorResponse {
  details: {
    field?: string;
    value?: unknown;
    constraint?: string;
    suggestions?: string[];
  };
  help?: {
    documentation?: string;
    support?: string;
  };
}
```

### **3. Error Logging**
```typescript
private logError(error: unknown, context: string): void {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    context,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    requestId: this.requestId
  };
  
  console.error('[API Error]', JSON.stringify(errorInfo, null, 2));
}
```

---

## 📈 **PERFORMANCE STANDARDS**

### **1. Response Time Targets**
- **Simple Queries:** < 100ms
- **Complex Queries:** < 500ms
- **Database Queries:** < 1000ms
- **External API Calls:** < 2000ms

### **2. Caching Strategy**
```typescript
interface CacheConfig {
  ttl: number;           // Time to live in seconds
  key: string;           // Cache key
  tags?: string[];       // Cache invalidation tags
  compression?: boolean;  // Enable compression
}

// Example usage
const cacheConfig: CacheConfig = {
  ttl: 300, // 5 minutes
  key: `electrum:height:${Date.now()}`,
  tags: ['electrum', 'height'],
  compression: true
};
```

### **3. Rate Limiting**
```typescript
interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  maxRequests: number;   // Maximum requests per window
  message: string;        // Error message
  statusCode: number;     // HTTP status code
}

const rateLimitConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,           // 100 requests per 15 minutes
  message: 'Too many requests from this IP',
  statusCode: 429
};
```

---

## 🔒 **SECURITY STANDARDS**

### **1. Input Validation**
```typescript
import { z } from 'zod';

const HeightQuerySchema = z.object({
  height: z.number().int().positive().max(1000000),
  includeHeader: z.boolean().optional()
});

// Usage in controller
async getBlock(req: Request, res: Response): Promise<void> {
  try {
    const query = HeightQuerySchema.parse(req.query);
    // Process validated query
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: 'validation_error',
      message: 'Invalid query parameters',
      details: { validation: error },
      timestamp: Date.now()
    });
  }
}
```

### **2. Authentication & Authorization**
```typescript
interface AuthConfig {
  required: boolean;
  roles?: string[];
  permissions?: string[];
}

// Middleware for protected routes
const requireAuth = (config: AuthConfig) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!config.required) return next();
    
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        ok: false,
        error: 'authentication_failed',
        message: 'Authentication required',
        timestamp: Date.now()
      });
    }
    
    // Validate token and check permissions
    next();
  };
};
```

---

## 📝 **DOCUMENTATION STANDARDS**

### **1. API Documentation Requirements**
- **Endpoint Description:** Clear purpose and usage
- **Request Parameters:** All parameters with types and constraints
- **Response Schemas:** Complete response structure with examples
- **Error Codes:** All possible error responses
- **Authentication:** Required permissions and scopes
- **Rate Limits:** Request limits and restrictions

### **2. Code Documentation**
```typescript
/**
 * Retrieves the current blockchain height from Electrum server.
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @returns Promise<void>
 * 
 * @throws {ServiceUnavailableError} When Electrum server is unreachable
 * @throws {ValidationError} When request parameters are invalid
 * 
 * @example
 * GET /api/v1/electrum/network/height
 * Response: { "ok": true, "data": { "height": 910659 } }
 */
async getHeight(req: Request, res: Response): Promise<void> {
  // Implementation
}
```

---

## 🧪 **TESTING STANDARDS**

### **1. Unit Test Requirements**
- **Coverage:** Minimum 90% for all controllers
- **Mocking:** Use dependency injection for external services
- **Assertions:** Test both success and error scenarios

### **2. Integration Test Requirements**
- **End-to-End:** Test complete request/response cycles
- **Database:** Test with real database connections
- **External APIs:** Mock external service responses

### **3. Test Structure**
```typescript
describe('ElectrumController', () => {
  let controller: ElectrumController;
  let mockAdapter: jest.Mocked<ElectrumAdapter>;

  beforeEach(() => {
    mockAdapter = createMockElectrumAdapter();
    controller = new ElectrumController(mockAdapter);
  });

  describe('getHeight', () => {
    it('should return height when adapter succeeds', async () => {
      // Test implementation
    });

    it('should handle adapter errors gracefully', async () => {
      // Test error handling
    });
  });
});
```

---

## 📊 **MONITORING STANDARDS**

### **1. Metrics Collection**
```typescript
interface ApiMetrics {
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  timestamp: number;
  userId?: string;
  requestId: string;
}

// Middleware for metrics collection
const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const metrics: ApiMetrics = {
      endpoint: req.path,
      method: req.method,
      responseTime: Date.now() - startTime,
      statusCode: res.statusCode,
      timestamp: Date.now(),
      requestId: req.headers['x-request-id'] as string
    };
    
    // Send to metrics service
    metricsService.record(metrics);
  });
  
  next();
};
```

### **2. Health Check Endpoints**
```typescript
// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  const health = await healthService.check();
  
  if (health.healthy) {
    res.json({
      ok: true,
      data: health,
      timestamp: Date.now()
    });
  } else {
    res.status(503).json({
      ok: false,
      error: 'service_unhealthy',
      message: 'Service health check failed',
      data: health,
      timestamp: Date.now()
    });
  }
});
```

---

## 🚀 **DEPLOYMENT STANDARDS**

### **1. Environment Configuration**
```typescript
interface EnvironmentConfig {
  nodeEnv: 'development' | 'staging' | 'production';
  port: number;
  corsOrigin: string;
  databaseUrl: string;
  redisUrl: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

const config: EnvironmentConfig = {
  nodeEnv: process.env.NODE_ENV as EnvironmentConfig['nodeEnv'] || 'development',
  port: parseInt(process.env.PORT || '8000', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://localhost:5432/blocksight',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  logLevel: (process.env.LOG_LEVEL as EnvironmentConfig['logLevel']) || 'info'
};
```

### **2. Graceful Shutdown**
```typescript
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, starting graceful shutdown');
  
  // Close HTTP server
  server.close(() => {
    console.log('HTTP server closed');
  });
  
  // Close database connections
  await database.close();
  console.log('Database connections closed');
  
  // Close Redis connections
  await redis.quit();
  console.log('Redis connections closed');
  
  process.exit(0);
});
```

---

## 📚 **REFERENCES**

- **Express.js Documentation:** https://expressjs.com/
- **REST API Design Guidelines:** https://restfulapi.net/
- **OpenAPI Specification:** https://swagger.io/specification/
- **Node.js Best Practices:** https://github.com/goldbergyoni/nodebestpractices

---

**Maintainer:** Development Team  
**Last Review:** 2025-08-30  
**Next Review:** 2025-08-31
