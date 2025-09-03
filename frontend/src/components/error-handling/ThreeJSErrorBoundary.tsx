import React from 'react';
import { BaseErrorBoundary } from './BaseErrorBoundary';
import { ThreeJSErrorBoundaryProps, ErrorCategory, ErrorSeverity } from './types';
import { ThreeJSErrorInterceptor } from './ThreeJSErrorInterceptor';

/**
 * Specialized error boundary for Three.js/WebGL components
 * Integrates with ThreeJSErrorInterceptor for runtime error catching
 */
export class ThreeJSErrorBoundary extends BaseErrorBoundary {
  private interceptor: ThreeJSErrorInterceptor;
  private isMountedFlag = false;

  constructor(props: ThreeJSErrorBoundaryProps) {
    super(props);
    
    this.interceptor = ThreeJSErrorInterceptor.getInstance();
    
    // CRITICAL FIX: Bind the callback properly to avoid context issues
    this.handleInterceptedError = this.handleInterceptedError.bind(this);
  }

  componentDidMount(): void {
    // Mark as mounted and then register callback to avoid setState-before-mount
    this.isMountedFlag = true;
    // Register this boundary with the interceptor
    this.interceptor.registerErrorBoundary(this.handleInterceptedError);
    // Interceptor is started globally (AppRouter). Do not start here to avoid duplicates.
  }

  componentWillUnmount(): void {
    // Unregister from interceptor
    this.interceptor.unregisterErrorBoundary(this.handleInterceptedError);
    this.isMountedFlag = false;
  }

  /**
   * Handles errors intercepted by ThreeJSErrorInterceptor
   */
  private handleInterceptedError(error: Error, _category: ErrorCategory, _severity: ErrorSeverity): void {
    console.log(`[ThreeJSErrorBoundary] Intercepted error:`, error.message);
    
    // CRITICAL FIX: Safely access state with proper null checking
    const currentRetryCount = this.state?.retryCount || 0;
    // Guard: do not set state if boundary is not yet mounted
    if (!this.isMountedFlag) {
      return;
    }
    
    // Update state to show fallback UI
    this.setState({
      hasError: true,
      error,
      errorInfo: { componentStack: 'Intercepted by ThreeJSErrorInterceptor' },
      retryCount: currentRetryCount + 1,
      lastErrorTime: Date.now()
    });
  }

  /**
   * Custom fallback UI for Three.js errors
   */
  protected renderFallbackUI(): React.ReactNode {
    const { error, retryCount, isRecovering } = this.state;
    const { componentName } = this.props;

    return (
      <div className="threejs-error-boundary-fallback">
        <h3>Three.js Rendering Error in {componentName || '3D Component'}</h3>
        <p>A WebGL/Three.js error occurred while rendering this 3D component.</p>
        
        {error && (
          <details className="error-details">
            <summary>Error Details</summary>
            <pre className="error-message">{error.message}</pre>
            <pre className="error-stack">{error.stack}</pre>
          </details>
        )}

        <div className="error-actions">
          <button 
            onClick={this.handleRetry}
            disabled={isRecovering}
            className="retry-button threejs"
          >
            {isRecovering ? 'Recovering...' : 'Restart 3D Rendering'}
          </button>
          
          {retryCount > 0 && (
            <span className="retry-count">
              Recovery attempt {retryCount} of {this.props.maxRetries || 3}
            </span>
          )}
        </div>

        <div className="threejs-error-help">
          <p><strong>Common causes:</strong></p>
          <ul>
            <li>WebGL context loss or initialization failure</li>
            <li>Graphics driver issues</li>
            <li>Memory constraints</li>
            <li>Browser compatibility issues</li>
          </ul>
        </div>
      </div>
    );
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.renderFallbackUI();
    }

    return this.props.children;
  }
}
