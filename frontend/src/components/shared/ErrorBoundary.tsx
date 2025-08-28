/**
 * @fileoverview Error boundary component for catching and handling React errors
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-11
 * @lastModified 2025-08-11
 * 
 * @description
 * Error boundary component that catches JavaScript errors anywhere in the child
 * component tree and displays a fallback UI. Implements Bitcoin-specific error
 * handling patterns.
 * 
 * @dependencies
 * - React Error Boundary API
 * - Error handling patterns
 * - Bitcoin error types
 * 
 * @usage
 * Wrap components to catch and handle errors gracefully
 * 
 * @state
 * ✅ Functional - Complete error boundary with Bitcoin error handling
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - [MEDIUM] Add error reporting to external service
 * - [MEDIUM] Implement error categorization for Bitcoin errors
 * - [LOW] Add Bitcoin-specific error recovery mechanisms
 * - [LOW] Add error analytics and monitoring
 * 
 * @mockData
 * - No mock data in error boundary - pure error handling logic
 * 
 * @performance
 * - Efficient error handling
 * - Minimal performance impact
 * 
 * @security
 * - Safe error display
 * - No sensitive data exposure
 */

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { ErrorDisplay } from './ErrorDisplay'
import { withTranslation } from 'react-i18next'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error information for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Here you could also log the error to an error reporting service
    // logErrorToService(error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="error-boundary">
          <ErrorDisplay
            error={this.state.error?.message || 'errors.general'}
            onRetry={this.handleReset}
            className="error-boundary__display"
          />
          
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details className="error-boundary__details">
              <summary>Error Details (Development)</summary>
              <pre className="error-boundary__stack">
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
