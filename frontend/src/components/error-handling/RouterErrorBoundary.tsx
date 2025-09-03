import React from 'react';
import { BaseErrorBoundary } from './BaseErrorBoundary';
import { RouterErrorBoundaryProps } from './types';

/**
 * Specialized error boundary for routing and navigation errors
 * Handles React Router specific errors and provides navigation recovery
 */
export class RouterErrorBoundary extends BaseErrorBoundary {
  declare props: RouterErrorBoundaryProps;
  
  /**
   * Custom fallback UI for routing errors
   */
  protected renderFallbackUI(): React.ReactNode {
    const { error, retryCount, isRecovering } = this.state;
    const { componentName, onNavigateToError } = this.props;

    return (
      <div className="router-error-boundary-fallback">
        <h3>Navigation Error in {componentName || 'Router'}</h3>
        <p>A routing or navigation error occurred while loading this page.</p>
        
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
            className="retry-button router"
          >
            {isRecovering ? 'Recovering...' : 'Retry Navigation'}
          </button>
          
          {onNavigateToError && (
            <button 
              onClick={onNavigateToError}
              className="navigate-error-button"
            >
              Go to Error Page
            </button>
          )}
          
          <button 
            onClick={() => window.history.back()}
            className="go-back-button"
          >
            Go Back
          </button>
          
          {retryCount > 0 && (
            <span className="retry-count">
              Retry attempt {retryCount} of {this.props.maxRetries || 3}
            </span>
          )}
        </div>

        <div className="router-error-help">
          <p><strong>Common causes:</strong></p>
          <ul>
            <li>Route configuration issues</li>
            <li>Component loading failures</li>
            <li>Navigation state corruption</li>
            <li>Browser history problems</li>
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
