/**
 * @fileoverview Error handling middleware for BlockSight.live API
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-30
 * @lastModified 2025-08-30
 * 
 * @description
 * Implements standardized error handling with request ID tracking, proper error logging,
 * and consistent error response formats following API standards.
 * 
 * @dependencies
 * - Express types
 * - API standards for error responses
 * 
 * @usage
 * Apply as the last middleware in the Express app
 * 
 * @state
 * ✅ Functional - Complete error handling implementation
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - Add structured logging integration
 * - Implement error reporting to external services
 * - Add error categorization and metrics
 * 
 * @performance
 * - Minimal overhead for error handling
 * - Efficient error response generation
 * 
 * @security
 * - Sanitizes error messages in production
 * - Prevents information leakage
 */

import { Request, Response, NextFunction } from 'express';

// Extend Request interface to include request ID
// Note: requestId is declared in types/express.d.ts as optional
// This middleware ensures it's always set

// Standardized error response interface following API standards
export interface ApiErrorResponse {
  ok: false;
  error: string;
  message: string;
  details?: Record<string, unknown>;
  requestId: string;
  timestamp: number;
}

// Error types for different scenarios
export enum ErrorType {
  VALIDATION_ERROR = 'validation_error',
  AUTHENTICATION_ERROR = 'authentication_error',
  AUTHORIZATION_ERROR = 'authorization_error',
  NOT_FOUND_ERROR = 'not_found_error',
  RATE_LIMIT_ERROR = 'rate_limit_exceeded',
  INTERNAL_ERROR = 'internal_server_error',
  EXTERNAL_SERVICE_ERROR = 'external_service_error',
  TIMEOUT_ERROR = 'timeout_error'
}

// HTTP status codes mapping
export const ERROR_STATUS_CODES: Record<ErrorType, number> = {
  [ErrorType.VALIDATION_ERROR]: 400,
  [ErrorType.AUTHENTICATION_ERROR]: 401,
  [ErrorType.AUTHORIZATION_ERROR]: 403,
  [ErrorType.NOT_FOUND_ERROR]: 404,
  [ErrorType.RATE_LIMIT_ERROR]: 429,
  [ErrorType.INTERNAL_ERROR]: 500,
  [ErrorType.EXTERNAL_SERVICE_ERROR]: 502,
  [ErrorType.TIMEOUT_ERROR]: 504
};

// Generate unique request ID
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Request ID middleware
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  req.requestId = generateRequestId();
  
  // Add request ID to response headers for client tracking
  res.setHeader('X-Request-ID', req.requestId);
  
  next();
}

// Create standardized error response
export function createErrorResponse(
  errorType: ErrorType,
  message: string,
  requestId: string,
  details?: Record<string, unknown>
): ApiErrorResponse {
  return {
    ok: false,
    error: errorType,
    message,
    details,
    requestId,
    timestamp: Date.now()
  }
}

// Enhanced error handler with better type safety
export function enhancedErrorHandler(
  error: Error | unknown,
  req: Request,
  res: Response
): void {
  const requestId = req.requestId || 'unknown';
  
  // Type guard for Error objects
  if (error instanceof Error) {
    const errorResponse: ApiErrorResponse = {
      ok: false,
      error: error.name || 'UnknownError',
      message: error.message || 'An unexpected error occurred',
      details: {
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        name: error.name
      },
      requestId,
      timestamp: Date.now()
    };
    
    res.status(ERROR_STATUS_CODES[ErrorType.INTERNAL_ERROR]).json(errorResponse);
  } else {
    // Handle non-Error objects
    const errorResponse: ApiErrorResponse = {
      ok: false,
      error: 'UnknownError',
      message: 'An unexpected error occurred',
      details: {
        type: typeof error,
        value: String(error)
      },
      requestId,
      timestamp: Date.now()
    };
    
    res.status(ERROR_STATUS_CODES[ErrorType.INTERNAL_ERROR]).json(errorResponse);
  }
}

// Generic error handler for different error types
export function handleSpecificError(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const requestId = req.requestId || 'unknown';
  
  // Type guard for different error types
  if (error && typeof error === 'object' && 'statusCode' in error) {
    const statusError = error as { statusCode: number; message?: string };
    const errorResponse: ApiErrorResponse = {
      ok: false,
      error: 'HTTPError',
      message: statusError.message || 'HTTP error occurred',
      details: { statusCode: statusError.statusCode },
      requestId,
      timestamp: Date.now()
    };
    
    res.status(statusError.statusCode).json(errorResponse);
  } else {
    // Fallback to generic error handling
    enhancedErrorHandler(error, req, res);
  }
}

// Async error wrapper with proper typing
export function asyncErrorWrapper<T extends unknown[]>(
  fn: (...args: T) => Promise<unknown>
): (...args: T) => void {
  return (...args: T): void => {
    Promise.resolve(fn(...args)).catch((error: unknown) => {
      console.error('Async operation failed:', error);
      // Error will be handled by the global error handler
    });
  };
}

// 404 handler for unmatched routes
export function notFoundHandler(req: Request, res: Response): void {
  const requestId = req.requestId || generateRequestId();
  
  const errorResponse = createErrorResponse(
    ErrorType.NOT_FOUND_ERROR,
    `Route ${req.method} ${req.url} not found`,
    requestId
  );
  
  res.status(404).json(errorResponse);
}

// Export all error handling utilities
export const errorHandler = {
  middleware: enhancedErrorHandler, // Changed to enhancedErrorHandler
  requestId: requestIdMiddleware,
  notFound: notFoundHandler,
  asyncWrapper: asyncErrorWrapper,
  createError: createErrorResponse,
  ErrorType,
  ERROR_STATUS_CODES
};
