/**
 * @fileoverview Rate limiting middleware for BlockSight.live API
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-30
 * @lastModified 2025-08-30
 * 
 * @description
 * Implements rate limiting for different API endpoint types with configurable limits
 * and proper error responses following API standards.
 * 
 * @dependencies
 * - express-rate-limit
 * - API standards for error responses
 * 
 * @usage
 * Apply to specific route groups or globally to the app
 * 
 * @state
 * ✅ Functional - Complete rate limiting implementation
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - Add Redis store for distributed rate limiting
 * - Implement dynamic rate limit adjustment based on load
 * 
 * @performance
 * - Minimal overhead with in-memory store
 * - Configurable window sizes for different endpoint types
 * 
 * @security
 * - Prevents API abuse and DoS attacks
 * - Configurable limits per endpoint type
 */

import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Rate limit configuration for different endpoint types
export const RATE_LIMIT_CONFIG = {
  // Public endpoints (electrum data, network status)
  public: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
    message: 'Too many requests from this IP for public endpoints',
    statusCode: 429
  },
  
  // Core RPC endpoints (Bitcoin Core data)
  core: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 50, // 50 requests per 15 minutes (more restrictive)
    message: 'Too many requests from this IP for Core RPC endpoints',
    statusCode: 429
  },
  
  // WebSocket connections
  websocket: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 10, // 10 connection attempts per minute
    message: 'Too many WebSocket connection attempts from this IP',
    statusCode: 429
  },
  
  // Health check endpoints
  health: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 30, // 30 health checks per minute
    message: 'Too many health check requests from this IP',
    statusCode: 429
  }
};

// Standardized error response following API standards
interface RateLimitErrorResponse {
  ok: false;
  error: 'rate_limit_exceeded';
  message: string;
  details: {
    limit: number;
    windowMs: number;
    retryAfter: number;
  };
  timestamp: number;
}

// Create rate limit middleware for public endpoints
export const publicRateLimit = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.public.windowMs,
  max: RATE_LIMIT_CONFIG.public.maxRequests,
  message: (req: Request, res: Response) => {
    const errorResponse: RateLimitErrorResponse = {
      ok: false,
      error: 'rate_limit_exceeded',
      message: RATE_LIMIT_CONFIG.public.message,
      details: {
        limit: RATE_LIMIT_CONFIG.public.maxRequests,
        windowMs: RATE_LIMIT_CONFIG.public.windowMs,
        retryAfter: Math.ceil(RATE_LIMIT_CONFIG.public.windowMs / 1000)
      },
      timestamp: Date.now()
    };
    
    res.status(RATE_LIMIT_CONFIG.public.statusCode).json(errorResponse);
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    // Custom handler for rate limit exceeded
    const errorResponse: RateLimitErrorResponse = {
      ok: false,
      error: 'rate_limit_exceeded',
      message: RATE_LIMIT_CONFIG.public.message,
      details: {
        limit: RATE_LIMIT_CONFIG.public.maxRequests,
        windowMs: RATE_LIMIT_CONFIG.public.windowMs,
        retryAfter: Math.ceil(RATE_LIMIT_CONFIG.public.windowMs / 1000)
      },
      timestamp: Date.now()
    };
    
    res.status(RATE_LIMIT_CONFIG.public.statusCode).json(errorResponse);
  }
});

// Create rate limit middleware for Core RPC endpoints
export const coreRateLimit = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.core.windowMs,
  max: RATE_LIMIT_CONFIG.core.maxRequests,
  message: (req: Request, res: Response) => {
    const errorResponse: RateLimitErrorResponse = {
      ok: false,
      error: 'rate_limit_exceeded',
      message: RATE_LIMIT_CONFIG.core.message,
      details: {
        limit: RATE_LIMIT_CONFIG.core.maxRequests,
        windowMs: RATE_LIMIT_CONFIG.core.windowMs,
        retryAfter: Math.ceil(RATE_LIMIT_CONFIG.core.windowMs / 1000)
      },
      timestamp: Date.now()
    };
    
    res.status(RATE_LIMIT_CONFIG.core.statusCode).json(errorResponse);
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    const errorResponse: RateLimitErrorResponse = {
      ok: false,
      error: 'rate_limit_exceeded',
      message: RATE_LIMIT_CONFIG.core.message,
      details: {
        limit: RATE_LIMIT_CONFIG.core.maxRequests,
        windowMs: RATE_LIMIT_CONFIG.core.windowMs,
        retryAfter: Math.ceil(RATE_LIMIT_CONFIG.core.windowMs / 1000)
      },
      timestamp: Date.now()
    };
    
    res.status(RATE_LIMIT_CONFIG.core.statusCode).json(errorResponse);
  }
});

// Create rate limit middleware for WebSocket connections
export const websocketRateLimit = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.websocket.windowMs,
  max: RATE_LIMIT_CONFIG.websocket.maxRequests,
  message: (req: Request, res: Response) => {
    const errorResponse: RateLimitErrorResponse = {
      ok: false,
      error: 'rate_limit_exceeded',
      message: RATE_LIMIT_CONFIG.websocket.message,
      details: {
        limit: RATE_LIMIT_CONFIG.websocket.maxRequests,
        windowMs: RATE_LIMIT_CONFIG.websocket.windowMs,
        retryAfter: Math.ceil(RATE_LIMIT_CONFIG.websocket.windowMs / 1000)
      },
      timestamp: Date.now()
    };
    
    res.status(RATE_LIMIT_CONFIG.websocket.statusCode).json(errorResponse);
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    const errorResponse: RateLimitErrorResponse = {
      ok: false,
      error: 'rate_limit_exceeded',
      message: RATE_LIMIT_CONFIG.websocket.message,
      details: {
        limit: RATE_LIMIT_CONFIG.websocket.maxRequests,
        windowMs: RATE_LIMIT_CONFIG.websocket.windowMs,
        retryAfter: Math.ceil(RATE_LIMIT_CONFIG.websocket.windowMs / 1000)
      },
      timestamp: Date.now()
    };
    
    res.status(RATE_LIMIT_CONFIG.websocket.statusCode).json(errorResponse);
  }
});

// Create rate limit middleware for health check endpoints
export const healthRateLimit = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.health.windowMs,
  max: RATE_LIMIT_CONFIG.health.maxRequests,
  message: (req: Request, res: Response) => {
    const errorResponse: RateLimitErrorResponse = {
      ok: false,
      error: 'rate_limit_exceeded',
      message: RATE_LIMIT_CONFIG.health.message,
      details: {
        limit: RATE_LIMIT_CONFIG.health.maxRequests,
        windowMs: RATE_LIMIT_CONFIG.health.windowMs,
        retryAfter: Math.ceil(RATE_LIMIT_CONFIG.health.windowMs / 1000)
      },
      timestamp: Date.now()
    };
    
    res.status(RATE_LIMIT_CONFIG.health.statusCode).json(errorResponse);
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    const errorResponse: RateLimitErrorResponse = {
      ok: false,
      error: 'rate_limit_exceeded',
      message: RATE_LIMIT_CONFIG.health.message,
      details: {
        limit: RATE_LIMIT_CONFIG.health.maxRequests,
        windowMs: RATE_LIMIT_CONFIG.health.windowMs,
        retryAfter: Math.ceil(RATE_LIMIT_CONFIG.health.windowMs / 1000)
      },
      timestamp: Date.now()
    };
    
    res.status(RATE_LIMIT_CONFIG.health.statusCode).json(errorResponse);
  }
});

// Global rate limit for all endpoints (fallback)
export const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per 15 minutes
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    const errorResponse: RateLimitErrorResponse = {
      ok: false,
      error: 'rate_limit_exceeded',
      message: 'Too many requests from this IP',
      details: {
        limit: 200,
        windowMs: 15 * 60 * 1000,
        retryAfter: 900
      },
      timestamp: Date.now()
    };
    
    res.status(429).json(errorResponse);
  }
});

// Export all rate limit middlewares
export const rateLimitMiddleware = {
  public: publicRateLimit,
  core: coreRateLimit,
  websocket: websocketRateLimit,
  health: healthRateLimit,
  global: globalRateLimit
};
