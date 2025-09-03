/**
 * @fileoverview React Router Error Handler for Navigation Errors
 * @version 1.0.0
 * @author Development Team
 * @since 2025-09-01
 * @lastModified 2025-09-01
 * 
 * @description
 * React Router error handler that catches navigation errors, route loading failures,
 * and provides graceful fallbacks with retry mechanisms.
 * 
 * @dependencies
 * - React Router DOM error handling
 * - Error boundary integration
 * - Performance monitoring
 * 
 * @usage
 * Wrap routes or entire router with this error handler
 * 
 * @state
 * ✅ New - Router error handling implementation
 * 
 * @performance
 * - Prevents navigation error cascades
 * - Graceful degradation
 * - Retry mechanisms
 * 
 * @security
 * - Safe error handling
 * - No sensitive data exposure
 */

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorBoundary } from './error-handling'

interface RouterErrorHandlerProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const RouterErrorHandler: React.FC<RouterErrorHandlerProps> = ({ 
  children, 
  fallback 
}) => {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const navigate = useNavigate()

  // Catch React Router errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Check if it's a navigation-related error
      if (event.error?.message?.includes('router') || 
          event.error?.message?.includes('navigation') ||
          event.error?.message?.includes('route')) {
        setHasError(true)
        setError(event.error)
        console.error('[RouterErrorHandler] Navigation error caught:', event.error)
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Check if it's a route loading rejection
      if (event.reason?.message?.includes('router') ||
          event.reason?.message?.includes('navigation') ||
          event.reason?.message?.includes('route')) {
        setHasError(true)
        setError(new Error(event.reason))
        console.error('[RouterErrorHandler] Route loading rejection:', event.reason)
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  if (hasError && error) {
    return fallback || (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        margin: '20px',
        border: '1px solid #dee2e6'
      }}>
        <h2>🚨 Navigation Error</h2>
        <p>There was a problem loading this page.</p>
        
        {error.message && (
          <details style={{ margin: '15px 0' }}>
            <summary>Error Details</summary>
            <pre style={{ 
              fontSize: '12px', 
              backgroundColor: '#e9ecef', 
              padding: '10px',
              borderRadius: '4px',
              overflow: 'auto',
              textAlign: 'left'
            }}>
              {error.message}
            </pre>
          </details>
        )}

        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => {
              setHasError(false)
              setError(null)
              // Try to navigate to the same route again
              navigate(0)
            }}
            style={{
              marginRight: '10px',
              padding: '12px 24px',
              backgroundColor: '#74b9ff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Retry Navigation
          </button>
          
          <button
            onClick={() => {
              setHasError(false)
              setError(null)
              // Navigate to home
              navigate('/')
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: '#00b894',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Go Home
          </button>
        </div>

        <p style={{ 
          fontSize: '12px', 
          color: '#6c757d', 
          marginTop: '20px',
          fontStyle: 'italic'
        }}>
          If this error persists, please refresh the page or contact support.
        </p>
      </div>
    )
  }

  return (
    <ErrorBoundary componentName="Router" maxRetries={2}>
      {children}
    </ErrorBoundary>
  )
}

// Hook for functional components to handle router errors
export const useRouterError = () => {
  const [hasRouterError, setHasRouterError] = useState(false)
  const [routerError, setRouterError] = useState<Error | null>(null)

  useEffect(() => {
    const handleRouterError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('router') || 
          event.error?.message?.includes('navigation') ||
          event.error?.message?.includes('route')) {
        setHasRouterError(true)
        setRouterError(event.error)
      }
    }

    window.addEventListener('error', handleRouterError)
    return () => window.removeEventListener('error', handleRouterError)
  }, [])

  const resetRouterError = () => {
    setHasRouterError(false)
    setRouterError(null)
  }

  return { hasRouterError, routerError, resetRouterError }
}
