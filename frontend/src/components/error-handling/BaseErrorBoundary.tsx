import React, { Component, ErrorInfo } from 'react';
import { 
  ErrorBoundaryProps, 
  ErrorBoundaryState, 
  ErrorDetails,
  ErrorCategory,
  ErrorSeverity 
} from './types';
import { 
  categorizeError, 
  assessErrorSeverity, 
  createErrorDetails,
  formatErrorForLogging,
  shouldAutoRecover,
  calculateRecoveryDelay
} from './utils';

/**
 * Base error boundary with core error handling functionality
 * Provides error categorization, severity assessment, and auto-recovery
 */
export abstract class BaseErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  
  public constructor(props: ErrorBoundaryProps) {
    super(props);
    
    // Initialize state with proper typing
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      errorHistory: [],
      isRecovering: false,
      lastErrorTime: 0
    };
  }

  /**
   * Catches errors during rendering, lifecycle, and constructor
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(`[${this.props.componentName || 'ErrorBoundary'}] Error caught:`, error, errorInfo);

    // Categorize and assess the error
    const category = categorizeError(error);
    const severity = assessErrorSeverity(error, category);

    // Create error details
    const errorDetails = createErrorDetails(
      error, 
      errorInfo, 
      category, 
      severity, 
      this.props.componentName,
      this.state.retryCount
    );

    // Update error count and check thresholds
    this.updateErrorCount(errorDetails);

    // Report to MainOrchestrator if available
    this.reportToMainOrchestrator(errorDetails);

    // Log error for monitoring
    this.logErrorToMonitoring(errorDetails);

    // Schedule auto-recovery if enabled
    if (this.props.enableAutoRecovery && shouldAutoRecover(errorDetails)) {
      this.scheduleAutoRecovery();
    }

    // Update state
    this.setState({
      hasError: true,
      error,
      errorInfo: {
        componentStack: errorInfo.componentStack || '',
        errorBoundaryId: this.props.componentName
      },
      errorHistory: [...this.state.errorHistory, errorDetails],
      lastErrorTime: Date.now()
    });
  }

  /**
   * Categorizes errors based on type and context
   */
  private categorizeError(error: Error): ErrorCategory {
    return categorizeError(error);
  }

  /**
   * Assesses error severity for appropriate handling
   */
  private assessErrorSeverity(error: Error, category: ErrorCategory): ErrorSeverity {
    return assessErrorSeverity(error, category);
  }

  /**
   * Updates internal error count and checks thresholds
   */
  private updateErrorCount(_errorDetails: ErrorDetails): void {
    const newRetryCount = this.state.retryCount + 1;
    
    this.setState({
      retryCount: newRetryCount
    });

    // Check if we've exceeded the error threshold
    if (newRetryCount >= (this.props.errorThreshold || 5)) {
      this.handlePermanentFailure();
    }
  }

  /**
   * Schedules automatic recovery attempt
   */
  private scheduleAutoRecovery(): void {
    const delay = calculateRecoveryDelay(this.state.retryCount);
    
    this.setState({ isRecovering: true });
    
          setTimeout(() => {
        this.setState({ isRecovering: false });
        this.resetError();
      }, delay);
  }

  /**
   * Handles permanent failure by triggering page reload
   */
  private handlePermanentFailure(): void {
    // Permanent failure threshold exceeded. Reloading page.
    
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  /**
   * Reports error to MainOrchestrator for centralized handling
   */
  private reportToMainOrchestrator(errorDetails: ErrorDetails): void {
    try {
      // Access MainOrchestrator through window for global error reporting
      if (window.MainOrchestrator && typeof window.MainOrchestrator.reportError === 'function') {
        window.MainOrchestrator.reportError(errorDetails);
      }
    } catch (reportError) {
      // Failed to report error to MainOrchestrator
    }
  }

  /**
   * Logs error to monitoring systems
   */
  private logErrorToMonitoring(errorDetails: ErrorDetails): void {
    const logMessage = formatErrorForLogging(errorDetails);
    
    // Log to console with appropriate level
    switch (errorDetails.severity) {
      case ErrorSeverity.CRITICAL:
        console.error(logMessage);
        break;
      case ErrorSeverity.HIGH:
        console.error(logMessage);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn(logMessage);
        break;
      case ErrorSeverity.LOW:
        console.info(logMessage);
        break;
    }

    // TODO: Send to external monitoring service if configured
    // this.sendToMonitoringService(errorDetails);
  }

  /**
   * Resets error state for recovery
   */
  protected resetError(): void {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRecovering: false
    });
  }

  /**
   * Handles retry button click
   */
  protected handleRetry = (): void => {
    console.log(`[${this.props.componentName || 'ErrorBoundary'}] Retry requested`);
    this.resetError();
  };

  /**
   * Renders fallback UI when errors occur
   */
  protected renderFallbackUI(): React.ReactNode {
    const { error, retryCount, errorHistory, isRecovering } = this.state;
    const { componentName, fallback } = this.props;

    // Use custom fallback if provided
    if (fallback) {
      const FallbackComponent = fallback;
      return <FallbackComponent error={error!} retry={this.handleRetry} />;
    }

    // Default fallback UI
    return (
      <div className="error-boundary-fallback">
        <h3>Something went wrong in {componentName || 'this component'}</h3>
        <p>An error occurred while rendering this component.</p>
        
        {error && (
          <details className="error-details">
            <summary>Error Details</summary>
            <pre className="error-message">{error.message}</pre>
            <pre className="error-stack">{error.stack}</pre>
          </details>
        )}

        {errorHistory.length > 0 && (
          <details className="error-history">
            <summary>Error History ({errorHistory.length} errors)</summary>
            <ul>
              {errorHistory.slice(-5).map((err, index) => (
                <li key={index}>
                  {err.category} - {err.severity}: {err.error.message}
                </li>
              ))}
            </ul>
          </details>
        )}

        <div className="error-actions">
          <button 
            onClick={this.handleRetry}
            disabled={isRecovering}
            className="retry-button"
          >
            {isRecovering ? 'Recovering...' : 'Try Again'}
          </button>
          
          {retryCount > 0 && (
            <span className="retry-count">
              Retry attempt {retryCount} of {this.props.maxRetries || 3}
            </span>
          )}
        </div>
      </div>
    );
  }

  /**
   * Abstract render method to be implemented by subclasses
   */
  abstract render(): React.ReactNode;
}

// Extend window interface for MainOrchestrator
declare global {
  interface Window {
    MainOrchestrator?: {
      reportError: (errorDetails: unknown) => void;
    };
  }
}
