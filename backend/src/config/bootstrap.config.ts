/**
 * @fileoverview Bootstrap service configuration
 * @version 1.0.0
 * @since 2025-08-30
 * @lastModified 2025-08-30
 * @state ✅ Complete - Configuration management
 * 
 * @description
 * Centralized configuration for bootstrap service including:
 * - Health check timeouts
 * - Cache TTL settings
 * - Circuit breaker thresholds
 * - Background monitoring intervals
 * 
 * @dependencies
 * - Environment variables
 * - Default fallback values
 * 
 * @usage
 * Import and use for bootstrap service configuration
 * 
 * @state
 * ✅ Complete - Configuration management
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - Add validation for configuration values
 * - Add configuration schema validation
 * - Add configuration hot-reload capability
 * 
 * @performance
 * - Configuration loaded once at startup
 * - No runtime configuration changes
 * - Minimal memory footprint
 * 
 * @security
 * - No sensitive data in configuration
 * - Environment variable validation
 * - Default fallback values
 */

// Bootstrap service configuration
export const BOOTSTRAP_CONFIG = {
  // Health check configuration
  HEALTH_CHECK: {
    TIMEOUT_MS: parseInt(process.env.HEALTH_CHECK_TIMEOUT || '2000', 10),
    RETRY_ATTEMPTS: parseInt(process.env.HEALTH_CHECK_RETRY_ATTEMPTS || '3', 10),
    RETRY_DELAY_MS: parseInt(process.env.HEALTH_CHECK_RETRY_DELAY || '1000', 10)
  },
  
  // Cache configuration
  CACHE: {
    TTL_SECONDS: parseInt(process.env.BOOTSTRAP_CACHE_TTL || '3', 10),
    MAX_SIZE: parseInt(process.env.BOOTSTRAP_CACHE_MAX_SIZE || '1000', 10),
    CLEANUP_INTERVAL_MS: parseInt(process.env.BOOTSTRAP_CACHE_CLEANUP_INTERVAL || '60000', 10)
  },
  
  // Circuit breaker configuration
  CIRCUIT_BREAKER: {
    FAILURE_THRESHOLD: parseInt(process.env.CIRCUIT_BREAKER_THRESHOLD || '5', 10),
    TIMEOUT_MS: parseInt(process.env.CIRCUIT_BREAKER_TIMEOUT || '30000', 10),
    SUCCESS_THRESHOLD: parseInt(process.env.CIRCUIT_BREAKER_SUCCESS_THRESHOLD || '2', 10),
    HALF_OPEN_MAX_REQUESTS: parseInt(process.env.CIRCUIT_BREAKER_HALF_OPEN_MAX || '3', 10)
  },
  
  // Background monitoring configuration
  MONITORING: {
    HEALTH_CHECK_INTERVAL_MS: parseInt(process.env.BACKGROUND_HEALTH_INTERVAL || '30000', 10),
    METRICS_COLLECTION_INTERVAL_MS: parseInt(process.env.METRICS_COLLECTION_INTERVAL || '60000', 10),
    LOG_LEVEL: process.env.BOOTSTRAP_LOG_LEVEL || 'info'
  },
  
  // Performance configuration
  PERFORMANCE: {
    MAX_CONCURRENT_REQUESTS: parseInt(process.env.MAX_CONCURRENT_REQUESTS || '50', 10),
    REQUEST_TIMEOUT_MS: parseInt(process.env.REQUEST_TIMEOUT || '5000', 10),
    TARGET_RESPONSE_TIME_MS: parseInt(process.env.TARGET_RESPONSE_TIME || '200', 10),
    MAX_RESPONSE_TIME_MS: parseInt(process.env.MAX_RESPONSE_TIME || '1000', 10)
  },
  
  // Rate limiting configuration
  RATE_LIMITING: {
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW || '60000', 10),
    MAX_REQUESTS_PER_WINDOW: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    BURST_LIMIT: parseInt(process.env.RATE_LIMIT_BURST || '20', 10)
  }
} as const

// Configuration validation
export function validateBootstrapConfig(): void {
  const errors: string[] = []
  
  // Validate health check configuration
  if (BOOTSTRAP_CONFIG.HEALTH_CHECK.TIMEOUT_MS < 100 || BOOTSTRAP_CONFIG.HEALTH_CHECK.TIMEOUT_MS > 10000) {
    errors.push('HEALTH_CHECK_TIMEOUT must be between 100ms and 10000ms')
  }
  
  if (BOOTSTRAP_CONFIG.HEALTH_CHECK.RETRY_ATTEMPTS < 0 || BOOTSTRAP_CONFIG.HEALTH_CHECK.RETRY_ATTEMPTS > 10) {
    errors.push('HEALTH_CHECK_RETRY_ATTEMPTS must be between 0 and 10')
  }
  
  // Validate cache configuration
  if (BOOTSTRAP_CONFIG.CACHE.TTL_SECONDS < 1 || BOOTSTRAP_CONFIG.CACHE.TTL_SECONDS > 3600) {
    errors.push('BOOTSTRAP_CACHE_TTL must be between 1 and 3600 seconds')
  }
  
  if (BOOTSTRAP_CONFIG.CACHE.MAX_SIZE < 100 || BOOTSTRAP_CONFIG.CACHE.MAX_SIZE > 100000) {
    errors.push('BOOTSTRAP_CACHE_MAX_SIZE must be between 100 and 100000')
  }
  
  // Validate circuit breaker configuration
  if (BOOTSTRAP_CONFIG.CIRCUIT_BREAKER.FAILURE_THRESHOLD < 1 || BOOTSTRAP_CONFIG.CIRCUIT_BREAKER.FAILURE_THRESHOLD > 100) {
    errors.push('CIRCUIT_BREAKER_THRESHOLD must be between 1 and 100')
  }
  
  if (BOOTSTRAP_CONFIG.CIRCUIT_BREAKER.TIMEOUT_MS < 1000 || BOOTSTRAP_CONFIG.CIRCUIT_BREAKER.TIMEOUT_MS > 300000) {
    errors.push('CIRCUIT_BREAKER_TIMEOUT must be between 1000ms and 300000ms')
  }
  
  // Validate performance configuration
  if (BOOTSTRAP_CONFIG.PERFORMANCE.TARGET_RESPONSE_TIME_MS < 50 || BOOTSTRAP_CONFIG.PERFORMANCE.TARGET_RESPONSE_TIME_MS > 1000) {
    errors.push('TARGET_RESPONSE_TIME must be between 50ms and 1000ms')
  }
  
  if (BOOTSTRAP_CONFIG.PERFORMANCE.MAX_RESPONSE_TIME_MS < BOOTSTRAP_CONFIG.PERFORMANCE.TARGET_RESPONSE_TIME_MS) {
    errors.push('MAX_RESPONSE_TIME must be greater than TARGET_RESPONSE_TIME')
  }
  
  // Validate rate limiting configuration
  if (BOOTSTRAP_CONFIG.RATE_LIMITING.WINDOW_MS < 1000 || BOOTSTRAP_CONFIG.RATE_LIMITING.WINDOW_MS > 3600000) {
    errors.push('RATE_LIMIT_WINDOW must be between 1000ms and 3600000ms')
  }
  
  if (BOOTSTRAP_CONFIG.RATE_LIMITING.MAX_REQUESTS_PER_WINDOW < 1 || BOOTSTRAP_CONFIG.RATE_LIMITING.MAX_REQUESTS_PER_WINDOW > 10000) {
    errors.push('RATE_LIMIT_MAX_REQUESTS must be between 1 and 10000')
  }
  
  if (errors.length > 0) {
    throw new Error(`Bootstrap configuration validation failed:\n${errors.join('\n')}`)
  }
}

// Configuration getters for specific sections
export const getHealthCheckConfig = () => BOOTSTRAP_CONFIG.HEALTH_CHECK
export const getCacheConfig = () => BOOTSTRAP_CONFIG.CACHE
export const getCircuitBreakerConfig = () => BOOTSTRAP_CONFIG.CIRCUIT_BREAKER
export const getMonitoringConfig = () => BOOTSTRAP_CONFIG.MONITORING
export const getPerformanceConfig = () => BOOTSTRAP_CONFIG.PERFORMANCE
export const getRateLimitingConfig = () => BOOTSTRAP_CONFIG.RATE_LIMITING

// Environment-specific configuration overrides
export function getEnvironmentConfig() {
  const env = process.env.NODE_ENV || 'development'
  
  switch (env) {
    case 'production':
      return {
        ...BOOTSTRAP_CONFIG,
        HEALTH_CHECK: {
          ...BOOTSTRAP_CONFIG.HEALTH_CHECK,
          TIMEOUT_MS: Math.max(BOOTSTRAP_CONFIG.HEALTH_CHECK.TIMEOUT_MS, 1000)
        },
        CACHE: {
          ...BOOTSTRAP_CONFIG.CACHE,
          TTL_SECONDS: Math.max(BOOTSTRAP_CONFIG.CACHE.TTL_SECONDS, 5)
        },
        CIRCUIT_BREAKER: {
          ...BOOTSTRAP_CONFIG.CIRCUIT_BREAKER,
          FAILURE_THRESHOLD: Math.min(BOOTSTRAP_CONFIG.CIRCUIT_BREAKER.FAILURE_THRESHOLD, 3)
        }
      }
      
    case 'test':
      return {
        ...BOOTSTRAP_CONFIG,
        HEALTH_CHECK: {
          ...BOOTSTRAP_CONFIG.HEALTH_CHECK,
          TIMEOUT_MS: 100
        },
        CACHE: {
          ...BOOTSTRAP_CONFIG.CACHE,
          TTL_SECONDS: 1
        },
        MONITORING: {
          ...BOOTSTRAP_CONFIG.MONITORING,
          HEALTH_CHECK_INTERVAL_MS: 1000
        }
      }
      
    default: // development
      return BOOTSTRAP_CONFIG
  }
}

// Configuration documentation
export const CONFIG_DOCUMENTATION = {
  HEALTH_CHECK_TIMEOUT: 'Timeout for individual service health checks in milliseconds (100-10000)',
  HEALTH_CHECK_RETRY_ATTEMPTS: 'Number of retry attempts for failed health checks (0-10)',
  HEALTH_CHECK_RETRY_DELAY: 'Delay between health check retries in milliseconds (1000+)',
  BOOTSTRAP_CACHE_TTL: 'Time-to-live for bootstrap data cache in seconds (1-3600)',
  BOOTSTRAP_CACHE_MAX_SIZE: 'Maximum number of items in bootstrap cache (100-100000)',
  BOOTSTRAP_CACHE_CLEANUP_INTERVAL: 'Cache cleanup interval in milliseconds (60000+)',
  CIRCUIT_BREAKER_THRESHOLD: 'Number of failures before opening circuit breaker (1-100)',
  CIRCUIT_BREAKER_TIMEOUT: 'Time to wait before attempting to close circuit breaker (1000-300000ms)',
  CIRCUIT_BREAKER_SUCCESS_THRESHOLD: 'Number of successes to close circuit breaker (1-10)',
  CIRCUIT_BREAKER_HALF_OPEN_MAX: 'Maximum requests in half-open state (1-10)',
  BACKGROUND_HEALTH_INTERVAL: 'Background health check interval in milliseconds (10000+)',
  METRICS_COLLECTION_INTERVAL: 'Metrics collection interval in milliseconds (30000+)',
  BOOTSTRAP_LOG_LEVEL: 'Log level for bootstrap service (debug, info, warn, error)',
  MAX_CONCURRENT_REQUESTS: 'Maximum concurrent bootstrap requests (10-1000)',
  REQUEST_TIMEOUT: 'Request timeout in milliseconds (1000-30000)',
  TARGET_RESPONSE_TIME: 'Target response time in milliseconds (50-1000)',
  MAX_RESPONSE_TIME: 'Maximum allowed response time in milliseconds (100-5000)',
  RATE_LIMIT_WINDOW: 'Rate limiting window in milliseconds (1000-3600000)',
  RATE_LIMIT_MAX_REQUESTS: 'Maximum requests per rate limiting window (1-10000)',
  RATE_LIMIT_BURST: 'Burst limit for rate limiting (1-100)'
} as const
