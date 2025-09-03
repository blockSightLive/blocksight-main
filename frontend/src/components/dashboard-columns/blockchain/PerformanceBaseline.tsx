/**
 * @fileoverview Performance baseline and optimization component for 3D blockchain visualization
 * @version 1.0.0
 * @since 2025-08-31
 * @lastModified 2025-08-31
 * 
 * @description
 * Establishes performance benchmarks and optimization strategies for 3D blockchain visualization.
 * Provides performance targets and monitoring for Phase 1 improvements.
 * 
 * @dependencies
 * - Performance monitoring system
 * - 3D rendering performance metrics
 * 
 * @usage
 * <PerformanceBaseline onPerformanceAlert={handleAlert} />
 * 
 * @state
 * ✅ In Development - Performance baseline establishment
 * 
 * @performance
 * - Performance target monitoring
 * - Optimization strategy implementation
 * - Baseline establishment for future improvements
 */

import React, { useEffect, useState, useRef } from 'react'

interface PerformanceTargets {
  fps: { min: number; target: number; max: number }
  renderTime: { min: number; target: number; max: number }
  memoryUsage: { min: number; target: number; max: number }
  blockCount: { min: number; target: number; max: number }
}

interface PerformanceMetrics {
  fps: number
  renderTime: number
  memoryUsage: number
  blockCount: number
}

interface PerformanceAlert {
  type: 'warning' | 'critical' | 'info'
  message: string
  metric: string
  currentValue: number
  targetValue: number
  timestamp: Date
}

interface PerformanceBaselineProps {
  onPerformanceAlert?: (alert: PerformanceAlert) => void
}

export const PerformanceBaseline: React.FC<PerformanceBaselineProps> = ({
  onPerformanceAlert
}) => {
  const [currentMetrics, setCurrentMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    renderTime: 0,
    memoryUsage: 0,
    blockCount: 0
  })
  
  // Performance targets based on our code standards and MVP requirements
  const performanceTargets: PerformanceTargets = {
    fps: { min: 45, target: 60, max: 60 },
    renderTime: { min: 0, target: 16, max: 22 }, // 16ms = 60fps, 22ms = 45fps
    memoryUsage: { min: 0, target: 100, max: 200 }, // MB
    blockCount: { min: 0, target: 15, max: 30 } // Total blocks across all sections
  }
  
  // Performance monitoring interval
  const monitoringInterval = useRef<NodeJS.Timeout | null>(null)
  
  // Monitor performance metrics
  useEffect(() => {
    const monitorPerformance = () => {
      // Simulate performance metrics for now
      // In production, these would come from our PerformanceMonitor
      const simulatedMetrics = {
        fps: Math.floor(Math.random() * 20) + 45, // 45-65 FPS
        renderTime: Math.random() * 10 + 12, // 12-22ms
        memoryUsage: Math.floor(Math.random() * 100) + 50, // 50-150 MB
        blockCount: Math.floor(Math.random() * 10) + 10 // 10-20 blocks
      }
      
      setCurrentMetrics(simulatedMetrics)
      
      // Check performance targets and generate alerts
      checkPerformanceTargets(simulatedMetrics)
    }
    
    // Monitor every 10 seconds (reduced frequency to prevent console spam)
    monitoringInterval.current = setInterval(monitorPerformance, 10000)
    
    return () => {
      if (monitoringInterval.current) {
        clearInterval(monitoringInterval.current)
      }
    }
  }, [])
  
  // Check performance against targets
  const checkPerformanceTargets = (metrics: typeof currentMetrics) => {
    const newAlerts: PerformanceAlert[] = []
    
    // Check FPS
    if (metrics.fps < performanceTargets.fps.min) {
      newAlerts.push({
        type: 'critical',
        message: `FPS below minimum target: ${metrics.fps} < ${performanceTargets.fps.min}`,
        metric: 'fps',
        currentValue: metrics.fps,
        targetValue: performanceTargets.fps.min,
        timestamp: new Date()
      })
    } else if (metrics.fps < performanceTargets.fps.target) {
      newAlerts.push({
        type: 'warning',
        message: `FPS below target: ${metrics.fps} < ${performanceTargets.fps.target}`,
        metric: 'fps',
        currentValue: metrics.fps,
        targetValue: performanceTargets.fps.target,
        timestamp: new Date()
      })
    }
    
    // Check render time
    if (metrics.renderTime > performanceTargets.renderTime.max) {
      newAlerts.push({
        type: 'critical',
        message: `Render time above maximum: ${metrics.renderTime.toFixed(2)}ms > ${performanceTargets.renderTime.max}ms`,
        metric: 'renderTime',
        currentValue: metrics.renderTime,
        targetValue: performanceTargets.renderTime.max,
        timestamp: new Date()
      })
    }
    
    // Check memory usage
    if (metrics.memoryUsage > performanceTargets.memoryUsage.max) {
      newAlerts.push({
        type: 'warning',
        message: `Memory usage above target: ${metrics.memoryUsage}MB > ${performanceTargets.memoryUsage.max}MB`,
        metric: 'memoryUsage',
        currentValue: metrics.memoryUsage,
        targetValue: performanceTargets.memoryUsage.max,
        timestamp: new Date()
      })
    }
    
    // Add new alerts (only critical ones to reduce console noise)
    if (newAlerts.length > 0) {
      // Only show critical alerts to reduce console spam
      const criticalAlerts = newAlerts.filter(alert => alert.type === 'critical')
      if (criticalAlerts.length > 0) {
        criticalAlerts.forEach(alert => {
          onPerformanceAlert?.(alert)
        })
      }
    }
  }
  
  // This component doesn't render anything visible
  // It's used for performance monitoring and baseline establishment
  return null
}

// Export performance targets for use in other components
export const PERFORMANCE_TARGETS = {
  fps: { min: 45, target: 60, max: 60 },
  renderTime: { min: 0, target: 16, max: 22 },
  memoryUsage: { min: 0, target: 100, max: 200 },
  blockCount: { min: 0, target: 15, max: 30 }
}
