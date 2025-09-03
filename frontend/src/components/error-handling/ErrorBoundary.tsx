import React from 'react';
import { BaseErrorBoundary } from './BaseErrorBoundary';
// import { ErrorBoundaryProps } from './types'; // Removed unused import

/**
 * Standard error boundary component
 * Catches and handles React component errors with fallback UI
 */
export class ErrorBoundary extends BaseErrorBoundary {
  
  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.renderFallbackUI();
    }

    return this.props.children;
  }
}

/**
 * Hook for using error boundary functionality in functional components
 */
export function useErrorBoundary() {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: Error) => {
    setError(error);
    setHasError(true);
  }, []);

  const resetError = React.useCallback(() => {
    setError(null);
    setHasError(false);
  }, []);

  return {
    hasError,
    error,
    handleError,
    resetError
  };
}
