/**
 * @fileoverview Centralized Logging System for BlockSight Backend
 * @version 1.0.0
 * @since 2025-01-15
 * @lastModified 2025-01-15
 * 
 * @description
 * Centralized logging system that provides structured, performance-optimized logging
 * with different levels for development and production environments.
 * Implements bootstrap status tracking and connection monitoring.
 * 
 * @dependencies
 * - Node.js built-in console
 * - Environment variables for log level control
 * 
 * @usage
 * import { logger } from './utils/logger'
 * logger.info('Service started')
 * logger.bootstrap('All services connected')
 * 
 * @state
 * ✅ NEW - Centralized logging system
 * 
 * @performance
 * - Zero overhead in production for disabled log levels
 * - Structured logging for better performance
 * - Connection status tracking without spam
 * 
 * @security
 * - No sensitive data in logs
 * - Environment-based log level control
 * - Production-safe logging practices
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export enum LogCategory {
  BOOTSTRAP = 'BOOTSTRAP',
  RPC = 'RPC',
  WEBSOCKET = 'WEBSOCKET',
  API = 'API',
  SYSTEM = 'SYSTEM',
  CONNECTION = 'CONNECTION',
  PERFORMANCE = 'PERFORMANCE',
  SECURITY = 'SECURITY',
  CACHE = 'CACHE',
  DATABASE = 'DATABASE'
}

interface LogEntry {
  timestamp: string
  level: string
  category: string
  message: string
  data?: unknown
  requestId?: string
  userId?: string
  sessionId?: string
  duration?: number
  memoryUsage?: number
  cpuUsage?: number
}

interface PerformanceMetrics {
  requestCount: number
  averageResponseTime: number
  errorRate: number
  memoryUsage: number
  cpuUsage: number
  lastUpdated: string
}

class Logger {
  private logLevel: LogLevel
  private isProduction: boolean
  private connectionStates: Map<string, boolean> = new Map()
  private bootstrapCompleted: boolean = false
  private performanceMetrics: PerformanceMetrics
  private logBuffer: LogEntry[] = []
  private maxBufferSize: number = 1000
  private flushInterval: NodeJS.Timeout | null = null

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production'
    this.logLevel = this.getLogLevel()
    
    // Initialize connection states
    this.connectionStates.set('bitcoin-core', false)
    this.connectionStates.set('electrum', false)
    this.connectionStates.set('bitcoin-price-api', false)
    this.connectionStates.set('fx-rates-api', false)
    
    // Initialize performance metrics
    this.performanceMetrics = {
      requestCount: 0,
      averageResponseTime: 0,
      errorRate: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      lastUpdated: new Date().toISOString()
    }
    
    // Start log buffer flushing in production
    if (this.isProduction) {
      this.startLogBufferFlushing()
    }
  }

  private getLogLevel(): LogLevel {
    const envLevel = process.env.LOG_LEVEL?.toUpperCase()
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
      data: data ? this.sanitizeData(data) : undefined
    }
  }

  private sanitizeData(data: unknown): unknown {
    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...data as Record<string, unknown> }
      
      // Remove sensitive fields
      const sensitiveFields = ['password', 'token', 'key', 'secret', 'auth']
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

  // Bootstrap-specific logging
  public bootstrap(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, LogCategory.BOOTSTRAP, message, data)
  }

  // Connection status tracking
  public updateConnectionStatus(service: string, connected: boolean): void {
    const wasConnected = this.connectionStates.get(service) || false
    this.connectionStates.set(service, connected)

    // Only log status changes, not every check
    if (wasConnected !== connected) {
      if (connected) {
        this.info(LogCategory.CONNECTION, `${service} connected`)
      } else {
        this.warn(LogCategory.CONNECTION, `${service} disconnected`)
      }
    }
  }

  // Bootstrap completion tracking
  public markBootstrapComplete(): void {
    if (!this.bootstrapCompleted) {
      this.bootstrapCompleted = true
      this.bootstrap('🚀 BOOTSTRAP COMPLETE - All services operational', {
        services: Object.fromEntries(this.connectionStates),
        timestamp: new Date().toISOString()
      })
    }
  }

  // Get connection status summary
  public getConnectionStatus(): Record<string, boolean> {
    return Object.fromEntries(this.connectionStates)
  }

  // Check if all services are connected
  public areAllServicesConnected(): boolean {
    return Array.from(this.connectionStates.values()).every(status => status)
  }

  // Performance-optimized RPC logging
  public rpcCall(method: string, success: boolean, duration?: number): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.debug(LogCategory.RPC, `RPC ${method} ${success ? 'success' : 'failed'}`, {
        method,
        success,
        duration: duration ? `${duration}ms` : undefined
      })
    }
  }

  // WebSocket event logging
  public websocketEvent(event: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.debug(LogCategory.WEBSOCKET, `WebSocket event: ${event}`, data)
    }
  }

  // API request logging
  public apiRequest(method: string, path: string, statusCode: number, duration?: number): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.info(LogCategory.API, `${method} ${path} ${statusCode}`, {
        method,
        path,
        statusCode,
        duration: duration ? `${duration}ms` : undefined
      })
    }
  }

  // Performance monitoring
  public performance(operation: string, duration: number, memoryUsage?: number): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.debug(LogCategory.PERFORMANCE, `${operation} completed in ${duration}ms`, {
        operation,
        duration,
        memoryUsage: memoryUsage ? `${memoryUsage}MB` : undefined
      })
    }
    
    // Update performance metrics
    this.updatePerformanceMetrics(duration)
  }

  // Security event logging
  public security(event: string, data?: unknown): void {
    this.log(LogLevel.WARN, LogCategory.SECURITY, `Security event: ${event}`, data)
  }

  // Cache operation logging
  public cache(operation: 'hit' | 'miss' | 'set' | 'delete', key: string, duration?: number): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.debug(LogCategory.CACHE, `Cache ${operation}: ${key}`, {
        operation,
        key,
        duration: duration ? `${duration}ms` : undefined
      })
    }
  }

  // Database operation logging
  public database(operation: string, table: string, duration?: number, recordCount?: number): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.debug(LogCategory.DATABASE, `DB ${operation} on ${table}`, {
        operation,
        table,
        duration: duration ? `${duration}ms` : undefined,
        recordCount
      })
    }
  }

  // Advanced request logging with context
  public request(method: string, path: string, statusCode: number, duration: number, requestId?: string, userId?: string): void {
    const logEntry = this.formatLog(
      LogLevel[LogLevel.INFO],
      LogCategory.API,
      `${method} ${path} ${statusCode}`,
      {
        method,
        path,
        statusCode,
        duration: `${duration}ms`,
        requestId,
        userId
      }
    )

    // Add context to log entry
    logEntry.requestId = requestId
    logEntry.userId = userId
    logEntry.duration = duration

    if (this.shouldLog(LogLevel.INFO)) {
      this.log(LogLevel.INFO, LogCategory.API, `${method} ${path} ${statusCode}`, logEntry.data)
    }

    // Update performance metrics
    this.updatePerformanceMetrics(duration)
  }

  // Get performance metrics
  public getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics }
  }

  // Get system health summary
  public getSystemHealth(): {
    connections: Record<string, boolean>
    performance: PerformanceMetrics
    bootstrap: boolean
    uptime: number
  } {
    return {
      connections: this.getConnectionStatus(),
      performance: this.getPerformanceMetrics(),
      bootstrap: this.bootstrapCompleted,
      uptime: Date.now() - ((global as { startTime?: number }).startTime || 0)
    }
  }

  // Private methods for advanced features
  private updatePerformanceMetrics(duration: number): void {
    this.performanceMetrics.requestCount++
    this.performanceMetrics.averageResponseTime = 
      (this.performanceMetrics.averageResponseTime + duration) / 2
    this.performanceMetrics.lastUpdated = new Date().toISOString()
    
    // Update memory usage
    if (typeof process !== 'undefined' && 'memoryUsage' in process) {
      const memUsage = (process as { memoryUsage: () => { heapUsed: number } }).memoryUsage()
      this.performanceMetrics.memoryUsage = Math.round(memUsage.heapUsed / 1024 / 1024)
    }
  }

  private startLogBufferFlushing(): void {
    this.flushInterval = setInterval(() => {
      if (this.logBuffer.length > 0) {
        this.flushLogBuffer()
      }
    }, 5000) // Flush every 5 seconds
  }

  private flushLogBuffer(): void {
    // In a real implementation, this would send logs to a monitoring service
    console.log(`[Logger] Flushing ${this.logBuffer.length} log entries`)
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
export const logger = new Logger()

// Export for use in other modules
export default logger
