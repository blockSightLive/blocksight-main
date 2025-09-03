import { ErrorCategory, ErrorSeverity, ErrorDetails } from './types';

/**
 * Categorizes errors based on error message and stack trace
 */
export function categorizeError(error: Error): ErrorCategory {
  const message = error.message.toLowerCase();
  const stack = error.stack?.toLowerCase() || '';

  // Three.js/WebGL errors
  if (
    message.includes('webgl') ||
    message.includes('three') ||
    message.includes('renderer') ||
    message.includes('shader') ||
    message.includes('buffer') ||
    message.includes('texture') ||
    message.includes('geometry') ||
    message.includes('material') ||
    stack.includes('webgl') ||
    stack.includes('three') ||
    stack.includes('renderer')
  ) {
    return ErrorCategory.WEBGL_THREEJS;
  }

  // React lifecycle errors
  if (
    message.includes('render') ||
    message.includes('component') ||
    message.includes('hook') ||
    message.includes('state') ||
    message.includes('effect')
  ) {
    return ErrorCategory.LIFECYCLE;
  }

  // Event handler errors
  if (
    message.includes('event') ||
    message.includes('click') ||
    message.includes('input') ||
    message.includes('change')
  ) {
    return ErrorCategory.EVENT_HANDLER;
  }

  // Async operation errors
  if (
    message.includes('fetch') ||
    message.includes('api') ||
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('promise')
  ) {
    return ErrorCategory.ASYNC_OPERATION;
  }

  // WebSocket errors
  if (
    message.includes('websocket') ||
    message.includes('socket') ||
    message.includes('connection')
  ) {
    return ErrorCategory.WEBSOCKET;
  }

  // State management errors
  if (
    message.includes('context') ||
    message.includes('reducer') ||
    message.includes('store') ||
    message.includes('state')
  ) {
    return ErrorCategory.STATE_MANAGEMENT;
  }

  // Routing errors
  if (
    message.includes('route') ||
    message.includes('navigation') ||
    message.includes('router')
  ) {
    return ErrorCategory.ROUTING;
  }

  return ErrorCategory.UNKNOWN;
}

/**
 * Assesses error severity based on category and message
 */
export function assessErrorSeverity(error: Error, category: ErrorCategory): ErrorSeverity {
  const message = error.message.toLowerCase();
  const stack = error.stack?.toLowerCase() || '';

  // Critical errors that can crash the app
  if (
    message.includes('cannot read properties of undefined') ||
    message.includes('cannot read properties of null') ||
    message.includes('maximum update depth exceeded') ||
    message.includes('webgl context lost') ||
    message.includes('out of memory') ||
    stack.includes('maximum update depth exceeded')
  ) {
    return ErrorSeverity.CRITICAL;
  }

  // High severity errors that affect major functionality
  if (
    category === ErrorCategory.WEBGL_THREEJS ||
    category === ErrorCategory.STATE_MANAGEMENT ||
    message.includes('render') ||
    message.includes('component')
  ) {
    return ErrorSeverity.HIGH;
  }

  // Medium severity errors that affect specific features
  if (
    category === ErrorCategory.ASYNC_OPERATION ||
    category === ErrorCategory.WEBSOCKET ||
    message.includes('network') ||
    message.includes('timeout')
  ) {
    return ErrorSeverity.MEDIUM;
  }

  // Low severity errors that don't affect core functionality
  return ErrorSeverity.LOW;
}

/**
 * Creates error details object
 */
export function createErrorDetails(
  error: Error,
  errorInfo: unknown,
  category: ErrorCategory,
  severity: ErrorSeverity,
  componentName?: string,
  retryCount?: number
): ErrorDetails {
  return {
    error,
    errorInfo: {
      componentStack: (errorInfo as { componentStack?: string })?.componentStack || '',
      errorBoundaryId: componentName
    },
    category,
    severity,
    timestamp: Date.now(),
    componentName,
    retryCount
  };
}

/**
 * Formats error for logging
 */
export function formatErrorForLogging(errorDetails: ErrorDetails): string {
  const { error, category, severity, componentName, timestamp } = errorDetails;
  const date = new Date(timestamp).toISOString();
  
  return `[${date}] ${severity} ${category} Error in ${componentName || 'Unknown'}: ${error.message}`;
}

/**
 * Checks if error should trigger auto-recovery
 */
export function shouldAutoRecover(errorDetails: ErrorDetails): boolean {
  return (
    errorDetails.severity !== ErrorSeverity.CRITICAL &&
    errorDetails.retryCount !== undefined &&
    errorDetails.retryCount < 3
  );
}

/**
 * Calculates recovery delay based on retry count
 */
export function calculateRecoveryDelay(retryCount: number): number {
  // Exponential backoff: 1s, 2s, 4s, 8s...
  return Math.min(1000 * Math.pow(2, retryCount), 10000);
}
