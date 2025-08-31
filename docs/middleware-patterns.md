# 🔧 Middleware Architecture & Patterns

/**
 * @fileoverview Complete middleware architecture and patterns documentation for BlockSight.live
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-30
 * @lastModified 2025-08-30
 * 
 * @description
 * Comprehensive middleware architecture documentation including patterns, standards,
 * and implementation details for all middleware in the system.
 * 
 * @dependencies
 * - Express.js framework
 * - Custom middleware implementations
 * - Security and validation libraries
 * 
 * @usage
 * Reference for implementing middleware, understanding middleware patterns,
 * and maintaining middleware standards across the codebase.
 */

## Overview

This document contains the complete middleware architecture, patterns, and standards for BlockSight.live. It covers middleware stack order, security implementation, validation patterns, and monitoring integration.

## Middleware Architecture

### Middleware Stack Order (CRITICAL)

The middleware stack order is **CRITICAL** for proper request processing. Always maintain this exact order:

```typescript
// 1. Request ID Generation - errorHandler.requestId
app.use(errorHandler.requestId);

// 2. Metrics Collection - MetricsMiddleware.collect
app.use(MetricsMiddleware.collect);

// 3. Security Headers - SecurityMiddleware.comprehensive
app.use(SecurityMiddleware.comprehensive);

// 4. Rate Limiting - globalRateLimit + service-specific limits
app.use(globalRateLimit);

// 5. Body Parsing - express.json(), express.urlencoded()
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 6. Request Validation - Zod schemas via ValidationMiddleware
// Applied to specific routes before handlers

// 7. Route Handlers - Controllers and business logic
// Your actual endpoint implementations

// 8. Error Handling - errorHandler.middleware
app.use(errorHandler.middleware);

// 9. 404 Handler - errorHandler.notFound
app.use(errorHandler.notFound);
```

### Required Middleware for All Endpoints

```typescript
// Apply to all routes
app.use(errorHandler.requestId);           // Request tracking
app.use(MetricsMiddleware.collect);        // Performance metrics
app.use(SecurityMiddleware.comprehensive); // Security headers
app.use(globalRateLimit);                  // Global rate limiting

// Apply to specific route groups
app.use('/api/v1/health', healthRateLimit);
app.use('/api/v1/electrum', publicRateLimit);
app.use('/api/v1/core', coreRateLimit);
```

## Security Middleware

### Security Implementation (MANDATORY)

```typescript
// SecurityMiddleware.comprehensive
export const comprehensive = [
  helmet(),                    // Security headers
  cors(corsOptions),          // CORS configuration
  rateLimit(rateLimitConfig), // Rate limiting
  sanitization,               // Input sanitization
  validation                  // Input validation
];
```

### CORS Configuration

```typescript
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Request-ID', 'X-Response-Time']
};
```

### Security Headers

```typescript
// Helmet configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

## Validation Middleware

### Zod Schema Implementation

```typescript
// Common schemas available in ValidationMiddleware.CommonSchemas
import { ValidationMiddleware, CommonSchemas } from '../middleware';

// Apply validation to route
app.get('/api/v1/electrum/address/:address', 
  ValidationMiddleware.validateParams(CommonSchemas.bitcoinAddress),
  electrumController.getBalance
);
```

### Common Validation Schemas

```typescript
// CommonSchemas.bitcoinAddress
export const bitcoinAddress = z.string()
  .regex(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/, 'Invalid Bitcoin address')
  .min(26, 'Address too short')
  .max(35, 'Address too long');

// CommonSchemas.bitcoinHash
export const bitcoinHash = z.string()
  .regex(/^[a-fA-F0-9]{64}$/, 'Invalid Bitcoin hash')
  .length(64, 'Hash must be exactly 64 characters');

// CommonSchemas.blockHeight
export const blockHeight = z.number()
  .int('Block height must be an integer')
  .min(0, 'Block height cannot be negative')
  .max(1000000, 'Block height too high');
```

### Service-Specific Validation

```typescript
// Electrum-specific validation schemas
export const ElectrumSchemas = {
  getBalance: z.object({
    address: CommonSchemas.bitcoinAddress
  }),
  
  getTransaction: z.object({
    txid: CommonSchemas.bitcoinHash
  }),
  
  getBlock: z.object({
    height: CommonSchemas.blockHeight.optional(),
    hash: CommonSchemas.bitcoinHash.optional()
  }).refine(data => data.height || data.hash, {
    message: 'Either height or hash must be provided'
  })
};
```

## Error Handling Middleware

### Standardized Error Responses

```typescript
// ApiErrorResponse interface
interface ApiErrorResponse {
  ok: false;
  error: string;
  message: string;
  timestamp: number;
  requestId?: string;
}

// Error status codes mapping
export const ERROR_STATUS_CODES = {
  validation_error: 400,
  authentication_failed: 401,
  authorization_failed: 403,
  not_found: 404,
  rate_limit_exceeded: 429,
  service_unavailable: 503,
  internal_error: 500
} as const;
```

### Error Handler Implementation

```typescript
// errorHandler.middleware
export const middleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = req.headers['x-request-id'] as string;
  
  // Log error with request ID
  console.error(`[${requestId}] Error:`, error);
  
  // Determine error type and status code
  const errorType = getErrorType(error);
  const statusCode = ERROR_STATUS_CODES[errorType] || 500;
  
  // Send standardized error response
  res.status(statusCode).json({
    ok: false,
    error: errorType,
    message: error.message || 'Internal server error',
    timestamp: Date.now(),
    requestId
  });
};
```

### Async Error Wrapping

```typescript
// asyncErrorWrapper utility
export const asyncErrorWrapper = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage in routes
app.get('/api/v1/electrum/height', 
  asyncErrorWrapper(async (req: Request, res: Response) => {
    const height = await electrumAdapter.getTipHeight();
    res.json({ ok: true, data: { height }, timestamp: Date.now() });
  })
);
```

## Monitoring & Metrics Middleware

### Performance Tracking

```typescript
// MetricsMiddleware.collect
export const collect = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const requestId = req.headers['x-request-id'] as string;
  
  // Add response time tracking
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    
    // Record metrics
    recordRequestDuration(req.path, duration, statusCode);
    recordRequestCount(req.path, statusCode);
    
    // Add response headers
    res.setHeader('X-Response-Time', `${duration}ms`);
    res.setHeader('X-Request-ID', requestId);
  });
  
  next();
};
```

### Available Monitoring Endpoints

```typescript
// Metrics endpoints
app.get('/metrics', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send(MetricsMiddleware.export());
});

app.get('/api/v1/metrics/health', (req: Request, res: Response) => {
  res.json(MetricsMiddleware.health());
});

app.get('/api/v1/cache/stats', async (req: Request, res: Response) => {
  try {
    const stats = await CacheUtilities.stats.getStats();
    res.json({
      ok: true,
      data: stats,
      timestamp: Date.now()
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: 'cache_stats_error',
      message: 'Failed to get cache statistics',
      timestamp: Date.now()
    });
  }
});
```

### Performance Budgets (MANDATORY)

- **API Response Time**: P95 < 200ms (cached), P95 < 1000ms (uncached)
- **Cache Hit Rate**: > 80% for read-heavy endpoints
- **Error Rate**: < 1% for all endpoints
- **Memory Usage**: < 512MB for backend process

## Caching Middleware

### Redis Integration

```typescript
// CacheMiddleware implementation
export class CacheMiddleware {
  static async cache(
    key: string,
    ttl: number,
    fetchFn: () => Promise<any>
  ) {
    try {
      // Try to get from cache first
      const cached = await redis.get(key);
      if (cached) {
        return JSON.parse(cached);
      }
      
      // Fetch fresh data
      const data = await fetchFn();
      
      // Cache the result
      await redis.setex(key, ttl, JSON.stringify(data));
      
      return data;
    } catch (error) {
      // Fallback to direct fetch on cache failure
      return await fetchFn();
    }
  }
}
```

### TTL Management

```typescript
// TTL configuration by cache tier
export const CACHE_TTL = {
  L1: 1,      // 1 second - Hot cache
  L2: 300,    // 5 minutes - Warm cache  
  L3: 3600    // 1 hour - Cold cache
} as const;

// Usage in middleware
app.get('/api/v1/electrum/height', 
  async (req: Request, res: Response) => {
    const height = await CacheMiddleware.cache(
      'electrum:height',
      CACHE_TTL.L1,
      () => electrumAdapter.getTipHeight()
    );
    
    res.json({ ok: true, data: { height }, timestamp: Date.now() });
  }
);
```

### Cache Invalidation

```typescript
// Cache invalidation endpoints
app.post('/api/v1/cache/invalidate/:service', async (req: Request, res: Response) => {
  try {
    const { service } = req.params;
    const deleted = await CacheUtilities.invalidator.invalidateService(
      service as 'electrum' | 'core' | 'network'
    );
    
    res.json({
      ok: true,
      data: { deleted, service },
      timestamp: Date.now()
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: 'cache_invalidation_error',
      message: 'Failed to invalidate cache',
      timestamp: Date.now()
    });
  }
});

app.post('/api/v1/cache/invalidate-all', async (req: Request, res: Response) => {
  try {
    const deleted = await CacheUtilities.invalidator.invalidateAll();
    
    res.json({
      ok: true,
      data: { deleted },
      timestamp: Date.now()
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: 'cache_invalidation_error',
      message: 'Failed to invalidate all cache',
      timestamp: Date.now()
    });
  }
});
```

## Rate Limiting Middleware

### Global Rate Limiting

```typescript
// Global rate limit configuration
export const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    ok: false,
    error: 'rate_limit_exceeded',
    message: 'Too many requests, please try again later',
    timestamp: Date.now()
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'unknown'
});
```

### Service-Specific Rate Limits

```typescript
// Health endpoint rate limiting
export const healthRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per minute
  message: {
    ok: false,
    error: 'rate_limit_exceeded',
    message: 'Health check rate limit exceeded',
    timestamp: Date.now()
  }
});

// Public API rate limiting
export const publicRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per 15 minutes
  message: {
    ok: false,
    error: 'rate_limit_exceeded',
    message: 'API rate limit exceeded',
    timestamp: Date.now()
  }
});

// Core RPC rate limiting (more restrictive)
export const coreRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per 15 minutes
  message: {
    ok: false,
    error: 'rate_limit_exceeded',
    message: 'Core RPC rate limit exceeded',
    timestamp: Date.now()
  }
});
```

## Middleware Development Patterns

### Creating New Middleware

#### 1. Follow Naming Convention

```typescript
// {purpose}.middleware.ts
// Example: validation.middleware.ts, security.middleware.ts
```

#### 2. Export from Index

```typescript
// backend/src/middleware/index.ts
export { ValidationMiddleware } from './validation.middleware';
export { SecurityMiddleware } from './security.middleware';
export { CacheMiddleware } from './cache.middleware';
```

#### 3. Apply in App.ts

```typescript
// backend/src/app.ts
import { ValidationMiddleware, SecurityMiddleware } from './middleware';

// Add to middleware stack in correct order
app.use(SecurityMiddleware.comprehensive);
app.use(ValidationMiddleware.global);
```

#### 4. Add Tests

```typescript
// backend/tests/middleware.test.ts
describe('Validation Middleware', () => {
  it('should validate request parameters', async () => {
    const app = createTestApp();
    app.use(ValidationMiddleware.validateParams(CommonSchemas.bitcoinAddress));
    
    // Test validation logic
    const response = await request(app)
      .get('/test/address/invalid-address')
      .expect(400);
    
    expect(response.body.error).toBe('validation_error');
  });
});
```

#### 5. Update Documentation

Document new middleware in this file and update API documentation as needed.

### Middleware Testing (MANDATORY)

#### Testing Middleware in Isolation

```typescript
// Test middleware in isolation
describe('Validation Middleware', () => {
  it('should validate request parameters', async () => {
    const app = createTestApp();
    app.use(ValidationMiddleware.validateParams(CommonSchemas.bitcoinAddress));
    
    // Test validation logic
    const response = await request(app)
      .get('/test/address/1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')
      .expect(200);
    
    expect(response.body).toBeDefined();
  });
});
```

#### Testing Middleware Stack

```typescript
// Test middleware stack integration
describe('Middleware Stack Integration', () => {
  it('should apply middleware in correct order', async () => {
    const app = createTestApp();
    
    // Verify middleware order
    const response = await request(app)
      .get('/api/v1/health')
      .expect(200);
    
    // Check that security headers are applied
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['x-request-id']).toBeDefined();
    expect(response.headers['x-response-time']).toBeDefined();
  });
});
```

#### Testing Error Handling

```typescript
// Test error handling and fallback behavior
describe('Middleware Error Handling', () => {
  it('should handle validation errors gracefully', async () => {
    const app = createTestApp();
    
    const response = await request(app)
      .get('/api/v1/electrum/address/invalid')
      .expect(400);
    
    expect(response.body.ok).toBe(false);
    expect(response.body.error).toBe('validation_error');
    expect(response.body.requestId).toBeDefined();
  });
});
```

#### Testing Performance Impact

```typescript
// Test performance impact of middleware
describe('Middleware Performance', () => {
  it('should not significantly impact response time', async () => {
    const app = createTestApp();
    
    const startTime = Date.now();
    
    await request(app)
      .get('/api/v1/health')
      .expect(200);
    
    const responseTime = Date.now() - startTime;
    
    // Middleware should add < 10ms overhead
    expect(responseTime).toBeLessThan(50);
  });
});
```

## Middleware Integration Examples

### Complete Route Implementation

```typescript
// Example: Complete route with all middleware
app.get('/api/v1/electrum/address/:address/balance',
  // Rate limiting
  publicRateLimit,
  
  // Parameter validation
  ValidationMiddleware.validateParams(ElectrumSchemas.getBalance),
  
  // Request handler with error wrapping
  asyncErrorWrapper(async (req: Request, res: Response) => {
    const { address } = req.params;
    
    // Get balance with caching
    const balance = await CacheMiddleware.cache(
      `electrum:balance:${address}`,
      CACHE_TTL.L1,
      () => electrumAdapter.getBalance(address)
    );
    
    res.json({
      ok: true,
      data: { address, balance },
      timestamp: Date.now()
    });
  })
);
```

### Health Check Endpoint

```typescript
// Health check with specific rate limiting
app.get('/health',
  healthRateLimit,
  async (req: Request, res: Response) => {
    try {
      const status = {
        ok: true,
        services: {
          electrum: await electrumAdapter.isConnected(),
          core: true,
          cache: await redis.ping() === 'PONG'
        },
        timestamp: Date.now()
      };
      
      res.json(status);
    } catch (error) {
      res.status(503).json({
        ok: false,
        error: 'health_check_failed',
        message: 'Health check failed',
        timestamp: Date.now()
      });
    }
  }
);
```

### Metrics Endpoint

```typescript
// Metrics endpoint for monitoring
app.get('/metrics',
  async (req: Request, res: Response) => {
    try {
      const metrics = MetricsMiddleware.export();
      
      res.setHeader('Content-Type', 'text/plain');
      res.send(metrics);
    } catch (error) {
      res.status(500).json({
        ok: false,
        error: 'metrics_export_error',
        message: 'Failed to export metrics',
        timestamp: Date.now()
      });
    }
  }
);
```

## Best Practices Summary

### Do's:

- ✅ **Always maintain middleware stack order** - it's critical for proper processing
- ✅ **Use standardized error responses** via ApiErrorResponse interface
- ✅ **Implement proper rate limiting** for all endpoints
- ✅ **Add request ID tracking** for debugging and correlation
- ✅ **Use Zod schemas** for all request validation
- ✅ **Implement caching** with appropriate TTL management
- ✅ **Add security headers** via Helmet and CORS
- ✅ **Test middleware** in isolation and integration

### Don'ts:

- ❌ **Never change middleware order** without understanding the impact
- ❌ **Don't skip validation** - always validate inputs
- ❌ **Avoid hardcoded error messages** - use standardized error codes
- ❌ **Don't forget rate limiting** - protect against abuse
- ❌ **Avoid exposing sensitive information** in error responses
- ❌ **Don't skip middleware testing** - test all middleware thoroughly

## External References

- **Express.js Middleware**: https://expressjs.com/en/guide/using-middleware.html
- **Helmet Security**: https://helmetjs.github.io/
- **Express Rate Limit**: https://github.com/nfriedly/express-rate-limit
- **Zod Validation**: https://zod.dev/
- **CORS Configuration**: https://github.com/expressjs/cors

---

**Last Updated**: 2025-08-30
**Version**: 1.0.0
