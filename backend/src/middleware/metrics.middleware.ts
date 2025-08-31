/**
 * @fileoverview Metrics and monitoring middleware for BlockSight.live API
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-30
 * @lastModified 2025-08-30
 * 
 * @description
 * Implements comprehensive API metrics collection including response times, endpoint usage,
 * error rates, and performance monitoring for all API endpoints.
 * 
 * @dependencies
 * - Express types
 * - Performance measurement utilities
 * 
 * @usage
 * Apply early in the middleware chain to capture all requests
 * 
 * @state
 * ✅ Functional - Complete metrics implementation
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - Add Prometheus metrics export
 * - Implement metrics aggregation
 * - Add alerting thresholds
 * 
 * @performance
 * - Minimal overhead for metrics collection
 * - Efficient data storage and retrieval
 * 
 * @security
 * - No sensitive data collection
 * - Metrics sanitization for production
 */

import { Request, Response, NextFunction } from 'express';

// Metrics data structure
interface RequestMetrics {
  method: string;
  path: string;
  statusCode: number;
  responseTime: number;
  timestamp: number;
  requestId: string;
  userAgent?: string;
  ip?: string;
}

interface EndpointMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  lastRequestTime: number;
  errorCounts: Record<number, number>;
}

interface PerformanceMetrics {
  p50: number;
  p95: number;
  p99: number;
  p999: number;
}

interface SystemMetrics {
  totalRequests: number;
  totalEndpoints: number;
  averageResponseTime: number;
  errorRate: number;
  uptime: number;
}

// Global metrics storage
class MetricsCollector {
  private metrics: Map<string, EndpointMetrics> = new Map();
  private responseTimes: Map<string, number[]> = new Map();
  private readonly maxResponseTimeHistory = 1000; // Keep last 1000 response times per endpoint

  // Record a request
  recordRequest(metrics: RequestMetrics): void {
    const endpoint = `${metrics.method} ${metrics.path}`;
    
    // Get or create endpoint metrics
    let endpointMetrics = this.metrics.get(endpoint);
    if (!endpointMetrics) {
      endpointMetrics = {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        minResponseTime: Infinity,
        maxResponseTime: 0,
        lastRequestTime: 0,
        errorCounts: {}
      };
      this.metrics.set(endpoint, endpointMetrics);
    }

    // Update metrics
    endpointMetrics.totalRequests++;
    endpointMetrics.lastRequestTime = metrics.timestamp;
    
    if (metrics.statusCode >= 200 && metrics.statusCode < 400) {
      endpointMetrics.successfulRequests++;
    } else {
      endpointMetrics.failedRequests++;
      endpointMetrics.errorCounts[metrics.statusCode] = 
        (endpointMetrics.errorCounts[metrics.statusCode] || 0) + 1;
    }

    // Update response time metrics
    endpointMetrics.minResponseTime = Math.min(endpointMetrics.minResponseTime, metrics.responseTime);
    endpointMetrics.maxResponseTime = Math.max(endpointMetrics.maxResponseTime, metrics.responseTime);
    
    // Calculate running average
    const totalTime = endpointMetrics.averageResponseTime * (endpointMetrics.totalRequests - 1) + metrics.responseTime;
    endpointMetrics.averageResponseTime = totalTime / endpointMetrics.totalRequests;

    // Store response time for percentile calculations
    let responseTimes = this.responseTimes.get(endpoint);
    if (!responseTimes) {
      responseTimes = [];
      this.responseTimes.set(endpoint, responseTimes);
    }
    
    responseTimes.push(metrics.responseTime);
    
    // Keep only the last N response times
    if (responseTimes.length > this.maxResponseTimeHistory) {
      responseTimes.splice(0, responseTimes.length - this.maxResponseTimeHistory);
    }
  }

  // Get metrics for a specific endpoint
  getEndpointMetrics(endpoint: string): EndpointMetrics | undefined {
    return this.metrics.get(endpoint);
  }

  // Get all metrics
  getAllMetrics(): Map<string, EndpointMetrics> {
    return new Map(this.metrics);
  }

  // Calculate performance percentiles for an endpoint
  getPerformanceMetrics(endpoint: string): PerformanceMetrics | null {
    const responseTimes = this.responseTimes.get(endpoint);
    if (!responseTimes || responseTimes.length === 0) {
      return null;
    }

    const sortedTimes = [...responseTimes].sort((a, b) => a - b);
    const length = sortedTimes.length;

    return {
      p50: sortedTimes[Math.floor(length * 0.5)],
      p95: sortedTimes[Math.floor(length * 0.95)],
      p99: sortedTimes[Math.floor(length * 0.99)],
      p999: sortedTimes[Math.floor(length * 0.999)]
    };
  }

  // Get system-wide metrics summary
  getSystemMetrics(): SystemMetrics {
    let totalRequests = 0;
    let totalFailed = 0;
    let totalResponseTime = 0;
    let endpointCount = 0;

    for (const metrics of this.metrics.values()) {
      totalRequests += metrics.totalRequests;
      totalFailed += metrics.failedRequests;
      totalResponseTime += metrics.averageResponseTime * metrics.totalRequests;
      endpointCount++;
    }

    return {
      totalRequests,
      totalEndpoints: endpointCount,
      averageResponseTime: totalRequests > 0 ? totalResponseTime / totalRequests : 0,
      errorRate: totalRequests > 0 ? (totalFailed / totalRequests) * 100 : 0,
      uptime: Date.now() - (global.startTime || Date.now())
    };
  }

  // Reset metrics (useful for testing)
  reset(): void {
    this.metrics.clear();
    this.responseTimes.clear();
  }
}

// Global metrics collector instance
export const metricsCollector = new MetricsCollector();

// Store application start time
declare global {
  var startTime: number;
}
global.startTime = Date.now();

// Metrics collection middleware
export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  const requestId = req.requestId || 'unknown';
  
  // Capture response data using response events instead of overriding res.end
  res.on('finish', () => {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Record response time using the correct method
    if (metricsCollector) {
      // Create request metrics object
      const requestMetrics: RequestMetrics = {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        responseTime,
        timestamp: endTime,
        requestId
      };
      
      // Record the request metrics
      metricsCollector.recordRequest(requestMetrics);
    }
  });
  
  next();
}

// Health check endpoint for metrics
export function getMetricsHealth(): { ok: boolean; metrics: unknown; timestamp: number } {
  const systemMetrics = metricsCollector.getSystemMetrics();
  
  return {
    ok: true,
    metrics: {
      system: systemMetrics,
      endpoints: Object.fromEntries(metricsCollector.getAllMetrics()),
      performance: Object.fromEntries(
        Array.from(metricsCollector.getAllMetrics().keys()).map(endpoint => [
          endpoint,
          metricsCollector.getPerformanceMetrics(endpoint)
        ])
      )
    },
    timestamp: Date.now()
  };
}

// Metrics export for monitoring systems
export function exportMetrics(): string {
  const systemMetrics = metricsCollector.getSystemMetrics();
  const endpointMetrics = metricsCollector.getAllMetrics();
  
  let prometheusMetrics = '';
  
  // System metrics
  prometheusMetrics += `# HELP blocksight_total_requests Total number of API requests\n`;
  prometheusMetrics += `# TYPE blocksight_total_requests counter\n`;
  prometheusMetrics += `blocksight_total_requests ${systemMetrics.totalRequests}\n`;
  
  prometheusMetrics += `# HELP blocksight_error_rate Error rate percentage\n`;
  prometheusMetrics += `# TYPE blocksight_error_rate gauge\n`;
  prometheusMetrics += `blocksight_error_rate ${systemMetrics.errorRate}\n`;
  
  prometheusMetrics += `# HELP blocksight_average_response_time Average response time in milliseconds\n`;
  prometheusMetrics += `# TYPE blocksight_average_response_time gauge\n`;
  prometheusMetrics += `blocksight_average_response_time ${systemMetrics.averageResponseTime}\n`;
  
  // Endpoint-specific metrics
  for (const [endpoint, metrics] of endpointMetrics) {
    const sanitizedEndpoint = endpoint.replace(/[^a-zA-Z0-9_]/g, '_');
    
    prometheusMetrics += `# HELP blocksight_endpoint_requests_total Total requests for endpoint\n`;
    prometheusMetrics += `# TYPE blocksight_endpoint_requests_total counter\n`;
    prometheusMetrics += `blocksight_endpoint_requests_total{endpoint="${sanitizedEndpoint}"} ${metrics.totalRequests}\n`;
    
    prometheusMetrics += `# HELP blocksight_endpoint_response_time_seconds Response time for endpoint\n`;
    prometheusMetrics += `# TYPE blocksight_endpoint_response_time_seconds histogram\n`;
    prometheusMetrics += `blocksight_endpoint_response_time_seconds{endpoint="${sanitizedEndpoint}",quantile="0.5"} ${metrics.averageResponseTime / 1000}\n`;
    prometheusMetrics += `blocksight_endpoint_response_time_seconds{endpoint="${sanitizedEndpoint}",quantile="0.95"} ${metrics.maxResponseTime / 1000}\n`;
  }
  
  return prometheusMetrics;
}

// Export all metrics utilities
export const MetricsMiddleware = {
  collect: metricsMiddleware,
  health: getMetricsHealth,
  export: exportMetrics,
  collector: metricsCollector
};

export default MetricsMiddleware;
