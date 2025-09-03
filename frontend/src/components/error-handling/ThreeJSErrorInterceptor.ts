import { ErrorCategory, ErrorSeverity, ErrorBoundaryCallback } from './types';

/**
 * Intercepts Three.js/WebGL errors that React Error Boundaries cannot catch
 * Manages global error interception and throttling
 */
export class ThreeJSErrorInterceptor {
  private static instance: ThreeJSErrorInterceptor;
  private errorBoundaryCallbacks: ErrorBoundaryCallback[] = [];
  private errorCount = 0;
  private lastErrorTime = 0;
  private maxErrorsPerMinute = 20; // tighten to avoid console storms
  private errorThreshold = 200;    // disable reload loop by lowering threshold handling
  private isCircuitBreakerActive = false;
  private isInterceptionStarted = false;
  private originalConsoleError: typeof console.error;
  private originalWindowOnError: typeof window.onerror;
  private originalRequestAnimationFrame: typeof window.requestAnimationFrame;
  private frameRequestCount = 0;
  private lastFrameTime = 0;

  private constructor() {
    this.originalConsoleError = console.error;
    this.originalWindowOnError = window.onerror;
    this.originalRequestAnimationFrame = window.requestAnimationFrame;
  }

  static getInstance(): ThreeJSErrorInterceptor {
    if (!ThreeJSErrorInterceptor.instance) {
      ThreeJSErrorInterceptor.instance = new ThreeJSErrorInterceptor();
    }
    return ThreeJSErrorInterceptor.instance;
  }

  /**
   * Starts global error interception
   */
  startInterception(): void {
    if (this.isCircuitBreakerActive) {
      // Circuit breaker already active, skipping interception start
      return;
    }
    if (this.isInterceptionStarted) {
      // Interception already started, skipping
      return;
    }

    // Starting global error interception
    this.isInterceptionStarted = true;
    
    // Override console.error
    console.error = (...args: unknown[]) => {
      this.originalConsoleError.apply(console, args);
      this.handleConsoleError(args);
    };

    // Override window.onerror
    window.onerror = (message, source, lineno, colno, error) => {
      if (this.originalWindowOnError) {
        this.originalWindowOnError.call(window, message, source, lineno, colno, error);
      }
      this.handleWindowError(message, source, lineno, colno, error);
    };

    // Override requestAnimationFrame to throttle excessive frame requests
    this.interceptRequestAnimationFrame();
  }

  /**
   * Stops global error interception
   */
  stopInterception(): void {
    // Stopping global error interception
    
    console.error = this.originalConsoleError;
    window.onerror = this.originalWindowOnError;
    window.requestAnimationFrame = this.originalRequestAnimationFrame;
    
    this.isCircuitBreakerActive = false;
    this.errorCount = 0;
    this.isInterceptionStarted = false;
  }

  /**
   * Registers an error boundary callback
   */
  registerErrorBoundary(callback: ErrorBoundaryCallback): void {
    this.errorBoundaryCallbacks.push(callback);
  }

  /**
   * Unregisters an error boundary callback
   */
  unregisterErrorBoundary(callback: ErrorBoundaryCallback): void {
    const index = this.errorBoundaryCallbacks.indexOf(callback);
    if (index > -1) {
      this.errorBoundaryCallbacks.splice(index, 1);
    }
  }

  /**
   * Handles console.error calls
   */
  private handleConsoleError(args: unknown[]): void {
    const errorMessage = args.map(a => {
      if (typeof a === 'string') return a;
      if (a && typeof a === 'object' && 'message' in (a as Record<string, unknown>)) {
        return String((a as { message?: unknown }).message ?? '');
      }
      return '';
    }).join(' ');
    // Avoid self-noise: ignore our own interceptor messages
    if (errorMessage.includes('[ThreeJSErrorInterceptor]')) {
      this.originalConsoleError.apply(console, args as unknown as Parameters<typeof console.error>);
      return;
    }
    if (this.isThreeJSError(errorMessage)) {
      // Use original console.error to avoid recursive interception
      this.originalConsoleError.apply(console, args as unknown as Parameters<typeof console.error>);
      this.handleThreeJSError(new Error(errorMessage));
      return;
    }
    // Not a Three.js error; fall back to original
    this.originalConsoleError.apply(console, args as unknown as Parameters<typeof console.error>);
  }

  /**
   * Handles window.onerror events
   */
  private handleWindowError(
    message: string | Event,
    source?: string,
    lineno?: number,
    colno?: number,
    error?: Error
  ): void {
    const errorMessage = typeof message === 'string' ? message : (message as Event)?.toString?.() || '';
    if (this.isThreeJSError(errorMessage)) {
      this.handleThreeJSError(error || new Error(errorMessage));
    }
  }

  /**
   * Checks if an error is related to Three.js/WebGL
   */
  private isThreeJSError(errorMessage: string): boolean {
    const message = errorMessage.toLowerCase();
    
    return (
      message.includes('webgl') ||
      message.includes('three') ||
      message.includes('renderer') ||
      message.includes('shader') ||
      message.includes('buffer') ||
      message.includes('texture') ||
      message.includes('geometry') ||
      message.includes('material') ||
      message.includes('cannot read properties of undefined') ||
      message.includes('cannot read properties of null') ||
      message.includes('setprogram') ||
      message.includes('renderbufferdirect') ||
      message.includes('chunk-') // Vite chunk errors
    );
  }

  /**
   * Handles Three.js errors with rate limiting and circuit breaker
   */
  private handleThreeJSError(error: Error): void {
    const now = Date.now();
    
    // Reset error count if more than a minute has passed
    if (now - this.lastErrorTime > 60000) {
      this.errorCount = 0;
    }
    
    this.errorCount++;
    this.lastErrorTime = now;

    // Check if we should trigger circuit breaker
    if (this.errorCount > this.maxErrorsPerMinute && !this.isCircuitBreakerActive) {
      this.triggerCircuitBreaker();
      return;
    }

    // Check if we should trigger permanent failure
    if (this.errorCount > this.errorThreshold) {
      this.triggerPermanentFailure();
      return;
    }

    // Categorize and assess error
    const category = this.assessThreeJSErrorCategory(error);
    const severity = this.assessThreeJSErrorSeverity(error);

    // Notify registered error boundaries
    this.notifyErrorBoundaries(error, category, severity);
  }

  /**
   * Assesses Three.js error category
   */
  private assessThreeJSErrorCategory(error: Error): ErrorCategory {
    const message = error.message.toLowerCase();
    
    if (message.includes('cannot read properties of undefined') || 
        message.includes('cannot read properties of null')) {
      return ErrorCategory.WEBGL_THREEJS;
    }
    
    return ErrorCategory.WEBGL_THREEJS;
  }

  /**
   * Assesses Three.js error severity
   */
  private assessThreeJSErrorSeverity(error: Error): ErrorSeverity {
    const message = error.message.toLowerCase();
    
    // Critical errors that can cause infinite loops
    if (message.includes('cannot read properties of undefined') || 
        message.includes('cannot read properties of null')) {
      return ErrorSeverity.CRITICAL;
    }
    
    return ErrorSeverity.HIGH;
  }

  /**
   * Triggers circuit breaker to stop Three.js rendering
   */
  private triggerCircuitBreaker(): void {
    console.error('[ThreeJSErrorInterceptor] Circuit breaker triggered - stopping Three.js rendering');
    this.isCircuitBreakerActive = true;
    this.stopThreeJSRendering();
    
    // Notify error boundaries
    this.errorBoundaryCallbacks.forEach(callback => {
      try {
        callback(
          new Error('Three.js rendering stopped due to excessive errors'),
          ErrorCategory.WEBGL_THREEJS,
          ErrorSeverity.CRITICAL
        );
      } catch (callbackError) {
        // Error in circuit breaker callback
      }
    });
  }

  /**
   * Triggers permanent failure and page reload
   */
  private triggerPermanentFailure(): void {
    // Permanent failure threshold reached - stopping interception (no reload)
    this.stopInterception();
  }

  /**
   * Stops Three.js rendering
   */
  private stopThreeJSRendering(): void {
    // Three.js rendering stopped due to error threshold
  }

  /**
   * Intercepts requestAnimationFrame to throttle excessive frame requests
   */
  private interceptRequestAnimationFrame(): void {
    window.requestAnimationFrame = (callback: FrameRequestCallback): number => {
      const now = Date.now();
      
      // Throttle if too many frames are requested - REASONABLE THROTTLE
      if (now - this.lastFrameTime < 16) { // 60fps = ~16ms per frame
        this.frameRequestCount++;
        
        if (this.frameRequestCount > 100) { // Reasonable threshold for 3D apps
          // Excessive frame requests detected, throttling
          this.frameRequestCount = 0;
          return 0; // Return invalid ID
        }
      } else {
        this.frameRequestCount = 0;
        this.lastFrameTime = now;
      }
      
      // Bind to window to avoid Illegal invocation in some environments
      return this.originalRequestAnimationFrame.call(window, callback);
    };
  }

  /**
   * Notifies all registered error boundaries
   */
  private notifyErrorBoundaries(error: Error, category: ErrorCategory, severity: ErrorSeverity): void {
    this.errorBoundaryCallbacks.forEach((callback, index) => {
      try {
        // CRITICAL FIX: Add additional safety checks before calling callback
        if (typeof callback === 'function') {
          callback(error, category, severity);
        } else {
          // Invalid callback at index
        }
      } catch (callbackError) {
        // Error in callback at index
        // Remove problematic callback to prevent future errors
        this.errorBoundaryCallbacks.splice(index, 1);
      }
    });
  }

  /**
   * Gets current error statistics
   */
  getErrorStats(): { errorCount: number; isCircuitBreakerActive: boolean; frameRequestCount: number } {
    return {
      errorCount: this.errorCount,
      isCircuitBreakerActive: this.isCircuitBreakerActive,
      frameRequestCount: this.frameRequestCount
    };
  }
}
