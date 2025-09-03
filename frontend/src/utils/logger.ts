/**
 * @fileoverview Frontend Logging System for BlockSight
 * @version 1.0.0
 * @since 2025-01-15
 * @lastModified 2025-01-15
 * 
 * @description
 * Frontend logging system that provides structured, performance-optimized logging
 * with different levels for development and production environments.
 * Implements user interaction tracking, performance monitoring, and error reporting.
 * 
 * @dependencies
 * - Browser console APIs
 * - Performance API for timing
 * - React error boundaries
 * 
 * @usage
 * import { logger } from './utils/logger'
 * logger.info('Component mounted')
 * logger.performance('API call', 150)
 * 
 * @state
 * ✅ NEW - Frontend logging system
 * 
 * @performance
 * - Zero overhead in production for disabled log levels
 * - Structured logging for better performance
 * - User interaction tracking without spam
 * 
 * @security
 * - No sensitive data in logs
 * - User privacy protection
 * - Production-safe logging practices
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export enum LogCategory {
  COMPONENT = 'COMPONENT',
  API = 'API',
  WEBSOCKET = 'WEBSOCKET',
  USER_INTERACTION = 'USER_INTERACTION',
  PERFORMANCE = 'PERFORMANCE',
  ERROR = 'ERROR',
  THREEJS = 'THREEJS',
  ROUTING = 'ROUTING',
  STATE = 'STATE',
  CACHE = 'CACHE'
}

interface LogEntry {
  timestamp: string
  level: string
  category: string
  message: string
  data?: unknown
  userId?: string
  sessionId?: string
  duration?: number
  memoryUsage?: number
  componentName?: string
  route?: string
}

interface PerformanceMetrics {
  pageLoadTime: number
  componentRenderTime: number
  apiCallCount: number
  averageApiResponseTime: number
  memoryUsage: number
  lastUpdated: string
}

class FrontendLogger {
  private logLevel: LogLevel
  private isProduction: boolean
  private performanceMetrics: PerformanceMetrics
  private logBuffer: LogEntry[] = []
  private maxBufferSize: number = 500
  private flushInterval: number | null = null
  private sessionId: string

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production'
    this.logLevel = this.getLogLevel()
    this.sessionId = this.generateSessionId()
    
    // Initialize performance metrics
    this.performanceMetrics = {
      pageLoadTime: 0,
      componentRenderTime: 0,
      apiCallCount: 0,
      averageApiResponseTime: 0,
      memoryUsage: 0,
      lastUpdated: new Date().toISOString()
    }
    
    // Start log buffer flushing in production
    if (this.isProduction) {
      this.startLogBufferFlushing()
    }
    
    // Track page load performance
    this.trackPageLoad()
  }

  private getLogLevel(): LogLevel {
    const envLevel = process.env.REACT_APP_LOG_LEVEL?.toUpperCase()
    switch (envLevel) {
      case 'ERROR': return LogLevel.ERROR
      case 'WARN': return LogLevel.WARN
      case 'INFO': return LogLevel.INFO
      case 'DEBUG': return LogLevel.DEBUG
      default: return this.isProduction ? LogLevel.WARN : LogLevel.INFO
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel
  }

  private formatLog(level: string, category: string, message: string, data?: unknown): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data: data ? this.sanitizeData(data) : undefined,
      sessionId: this.sessionId,
      memoryUsage: this.getMemoryUsage()
    }
  }

  private sanitizeData(data: unknown): unknown {
    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...data as Record<string, unknown> }
      
      // Remove sensitive fields
      const sensitiveFields = ['password', 'token', 'key', 'secret', 'auth', 'email']
      sensitiveFields.forEach(field => {
        if (field in sanitized) {
          sanitized[field] = '[REDACTED]'
        }
      })
      
      return sanitized
    }
    return data
  }

  private log(level: LogLevel, category: LogCategory, message: string, data?: unknown): void {
    if (!this.shouldLog(level)) return

    const logEntry = this.formatLog(
      LogLevel[level],
      category,
      message,
      data
    )

    const logMessage = `[${logEntry.timestamp}] ${logEntry.level} [${logEntry.category}] ${logEntry.message}`
    
    switch (level) {
      case LogLevel.ERROR:
        console.error(logMessage, logEntry.data || '')
        break
      case LogLevel.WARN:
        console.warn(logMessage, logEntry.data || '')
        break
      case LogLevel.INFO:
        console.info(logMessage, logEntry.data || '')
        break
      case LogLevel.DEBUG:
        console.debug(logMessage, logEntry.data || '')
        break
    }

    // Add to buffer for production
    if (this.isProduction) {
      this.logBuffer.push(logEntry)
      if (this.logBuffer.length >= this.maxBufferSize) {
        this.flushLogBuffer()
      }
    }
  }

  // Public logging methods
  public error(category: LogCategory, message: string, data?: unknown): void {
    this.log(LogLevel.ERROR, category, message, data)
  }

  public warn(category: LogCategory, message: string, data?: unknown): void {
    this.log(LogLevel.WARN, category, message, data)
  }

  public info(category: LogCategory, message: string, data?: unknown): void {
    this.log(LogLevel.INFO, category, message, data)
  }

  public debug(category: LogCategory, message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, category, message, data)
  }

  // Component-specific logging
  public component(componentName: string, event: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, LogCategory.COMPONENT, `${componentName}: ${event}`, {
      componentName,
      event,
      ...(data as Record<string, unknown>)
    })
  }

  // User interaction logging
  public userInteraction(action: string, target: string, data?: unknown): void {
    this.log(LogLevel.INFO, LogCategory.USER_INTERACTION, `User ${action} on ${target}`, {
      action,
      target,
      ...(data as Record<string, unknown>)
    })
  }

  // Performance monitoring
  public performance(operation: string, duration: number, data?: unknown): void {
    this.log(LogLevel.DEBUG, LogCategory.PERFORMANCE, `${operation} completed in ${duration}ms`, {
      operation,
      duration,
      ...(data as Record<string, unknown>)
    })
    
    // Update performance metrics
    this.updatePerformanceMetrics(operation, duration)
  }

  // API call logging
  public apiCall(method: string, url: string, statusCode: number, duration: number): void {
    this.log(LogLevel.INFO, LogCategory.API, `${method} ${url} ${statusCode}`, {
      method,
      url,
      statusCode,
      duration: `${duration}ms`
    })
    
    // Update API metrics
    this.performanceMetrics.apiCallCount++
    this.performanceMetrics.averageApiResponseTime = 
      (this.performanceMetrics.averageApiResponseTime + duration) / 2
  }

  // Three.js specific logging
  public threejs(event: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, LogCategory.THREEJS, `Three.js: ${event}`, data)
  }

  // Routing logging
  public routing(from: string, to: string, duration?: number): void {
    this.log(LogLevel.INFO, LogCategory.ROUTING, `Route: ${from} → ${to}`, {
      from,
      to,
      duration: duration ? `${duration}ms` : undefined
    })
  }

  // State management logging
  public state(action: string, context: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, LogCategory.STATE, `${context}: ${action}`, {
      action,
      context,
      ...(data as Record<string, unknown>)
    })
  }

  // Cache operation logging
  public cache(operation: 'hit' | 'miss' | 'set' | 'delete', key: string, duration?: number): void {
    this.log(LogLevel.DEBUG, LogCategory.CACHE, `Cache ${operation}: ${key}`, {
      operation,
      key,
      duration: duration ? `${duration}ms` : undefined
    })
  }

  // Get performance metrics
  public getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics }
  }

  // Get system health summary
  public getSystemHealth(): {
    performance: PerformanceMetrics
    sessionId: string
    userAgent: string
    memoryUsage: number
  } {
    return {
      performance: this.getPerformanceMetrics(),
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      memoryUsage: this.getMemoryUsage()
    }
  }

  // Private methods
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as { memory?: { usedJSHeapSize?: number } }).memory
      return Math.round((memory?.usedJSHeapSize || 0) / 1024 / 1024)
    }
    return 0
  }

  private trackPageLoad(): void {
    window.addEventListener('load', () => {
      const loadTime = performance.now()
      this.performanceMetrics.pageLoadTime = loadTime
      this.performance('Page Load', loadTime)
    })
  }

  private updatePerformanceMetrics(operation: string, duration: number): void {
    if (operation.includes('render')) {
      this.performanceMetrics.componentRenderTime = duration
    }
    this.performanceMetrics.lastUpdated = new Date().toISOString()
  }

  private startLogBufferFlushing(): void {
    this.flushInterval = window.setInterval(() => {
      if (this.logBuffer.length > 0) {
        this.flushLogBuffer()
      }
    }, 10000) // Flush every 10 seconds
  }

  private flushLogBuffer(): void {
    // In a real implementation, this would send logs to a monitoring service
    console.log(`[Frontend Logger] Flushing ${this.logBuffer.length} log entries`)
    this.logBuffer = []
  }

  // Cleanup method
  public destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }
    this.flushLogBuffer()
  }
}

// Singleton instance
export const logger = new FrontendLogger()

// Export for use in other modules
export default logger
