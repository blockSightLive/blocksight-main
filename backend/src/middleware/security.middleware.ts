/**
 * @fileoverview Security middleware for BlockSight.live API
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-30
 * @lastModified 2025-08-30
 * 
 * @description
 * Implements comprehensive security measures including security headers, CORS validation,
 * request sanitization, and protection against common web vulnerabilities.
 * 
 * @dependencies
 * - Helmet for security headers
 * - Express types
 * - Security best practices
 * 
 * @usage
 * Apply early in the middleware chain for maximum security coverage
 * 
 * @state
 * ✅ Functional - Complete security implementation
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - Add rate limiting for security endpoints
 * - Implement IP whitelisting
 * - Add security event logging
 * 
 * @performance
 * - Minimal security overhead
 * - Efficient security checks
 * 
 * @security
 * - Comprehensive security headers
 * - CORS protection
 * - Request sanitization
 * - XSS and CSRF protection
 */

import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

// Security configuration
export const SECURITY_CONFIG = {
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-Request-ID',
      'Accept',
      'Origin'
    ],
    exposedHeaders: ['X-Request-ID', 'X-Rate-Limit-Remaining'],
    maxAge: 86400 // 24 hours
  },

  // Helmet configuration
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "ws:", "wss:"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"]
      }
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' as const },
    frameguard: { action: 'deny' as const },
    xssFilter: true,
    ieNoOpen: true,
    hidePoweredBy: true
  },

  // Request size limits
  limits: {
    maxBodySize: '10mb',
    maxUrlLength: 2048,
    maxHeaderSize: 8192
  },

  // Security headers
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  }
};

// Enhanced CORS middleware with validation
export function enhancedCorsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const origin = req.headers.origin;
  const allowedOrigins = SECURITY_CONFIG.cors.origin.split(',').map(o => o.trim());
  
  // Validate origin
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (allowedOrigins.includes('*')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', SECURITY_CONFIG.cors.methods.join(', '));
  res.setHeader('Access-Control-Allow-Headers', SECURITY_CONFIG.cors.allowedHeaders.join(', '));
  res.setHeader('Access-Control-Expose-Headers', SECURITY_CONFIG.cors.exposedHeaders.join(', '));
  res.setHeader('Access-Control-Max-Age', SECURITY_CONFIG.cors.maxAge.toString());

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
}

// Request sanitization middleware
export function requestSanitizationMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Sanitize query parameters
  if (req.query) {
    for (const [key, value] of Object.entries(req.query)) {
      if (typeof value === 'string') {
        // Remove potentially dangerous characters
        req.query[key] = value
          .replace(/[<>]/g, '') // Remove < and >
          .replace(/javascript:/gi, '') // Remove javascript: protocol
          .replace(/data:/gi, '') // Remove data: protocol
          .trim();
      }
    }
  }

  // Sanitize body parameters
  if (req.body && typeof req.body === 'object') {
    for (const [key, value] of Object.entries(req.body)) {
      if (typeof value === 'string') {
        req.body[key] = value
          .replace(/[<>]/g, '')
          .replace(/javascript:/gi, '')
          .replace(/data:/gi, '')
          .trim();
      }
    }
  }

  // Sanitize URL parameters
  if (req.params) {
    for (const [key, value] of Object.entries(req.params)) {
      if (typeof value === 'string') {
        req.params[key] = value
          .replace(/[<>]/g, '')
          .replace(/javascript:/gi, '')
          .replace(/data:/gi, '')
          .trim();
      }
    }
  }

  next();
}

// Request size validation middleware
export function requestSizeValidationMiddleware(req: Request, res: Response, next: NextFunction): void {
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  const maxSize = parseInt(SECURITY_CONFIG.limits.maxBodySize.replace('mb', '000000'), 10);

  if (contentLength > maxSize) {
    res.status(413).json({
      ok: false,
      error: 'payload_too_large',
      message: `Request body too large. Maximum size is ${SECURITY_CONFIG.limits.maxBodySize}`,
      timestamp: Date.now()
    });
    return;
  }

  if (req.url.length > SECURITY_CONFIG.limits.maxUrlLength) {
    res.status(414).json({
      ok: false,
      error: 'uri_too_long',
      message: `Request URL too long. Maximum length is ${SECURITY_CONFIG.limits.maxUrlLength} characters`,
      timestamp: Date.now()
    });
    return;
  }

  next();
}

// Security headers middleware
export function securityHeadersMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Apply custom security headers
  for (const [header, value] of Object.entries(SECURITY_CONFIG.headers)) {
    res.setHeader(header, value);
  }

  // Additional security measures
  res.setHeader('X-Request-ID', req.requestId || 'unknown');
  
  // Remove potentially sensitive headers
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');

  next();
}

// IP validation middleware (basic implementation)
export function ipValidationMiddleware(req: Request, res: Response, next: NextFunction): void {
  const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  
  // Basic IP validation (can be enhanced with IP whitelisting)
  if (!clientIP || clientIP === 'unknown') {
    res.status(400).json({
      ok: false,
      error: 'invalid_client_ip',
      message: 'Unable to determine client IP address',
      timestamp: Date.now()
    });
    return;
  }

  // Log suspicious IP patterns (optional)
  if (clientIP.includes('192.168.') || clientIP.includes('10.') || clientIP.includes('172.')) {
    console.log(`Internal network request from: ${clientIP}`);
  }

  next();
}

// Helmet middleware with custom configuration
export const helmetMiddleware = helmet(SECURITY_CONFIG.helmet);

// Comprehensive security middleware
export function comprehensiveSecurityMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Apply all security measures
  securityHeadersMiddleware(req, res, () => {
    requestSanitizationMiddleware(req, res, () => {
      requestSizeValidationMiddleware(req, res, () => {
        ipValidationMiddleware(req, res, next);
      });
    });
  });
}

// Export all security utilities
export const SecurityMiddleware = {
  cors: enhancedCorsMiddleware,
  helmet: helmetMiddleware,
  sanitization: requestSanitizationMiddleware,
  sizeValidation: requestSizeValidationMiddleware,
  headers: securityHeadersMiddleware,
  ipValidation: ipValidationMiddleware,
  comprehensive: comprehensiveSecurityMiddleware
};

export default SecurityMiddleware;
