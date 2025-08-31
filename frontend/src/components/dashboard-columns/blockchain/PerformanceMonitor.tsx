/**
 * @fileoverview Performance monitoring component for Three.js blockchain visualization
 * @version 1.0.0
 * @since 2025-08-30
 * @lastModified 2025-08-30
 * 
 * @description
 * Monitors 3D rendering performance, WebSocket event processing, and system health.
 * Provides real-time metrics for optimization and debugging.
 * 
 * @dependencies
 * - @react-three/fiber
 * - @react-three/drei
 * 
 * @usage
 * <PerformanceMonitor />
 * 
 * @state
 * ✅ In Development - Performance monitoring system
 * 
 * @performance
 * - Minimal overhead monitoring
 * - Real-time FPS tracking
 * - Memory usage monitoring
 */

import React, { useState, useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

interface PerformanceMetrics {
  fps: number
  renderTime: number
  memoryUsage: number
  blockCount: number
  webSocketEvents: number
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    renderTime: 0,
    memoryUsage: 0,
    blockCount: 0,
    webSocketEvents: 0
  })
  
  const [isVisible, setIsVisible] = useState(false)
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const { gl } = useThree()
  
  // FPS calculation
  useFrame(() => {
    frameCount.current++
    const currentTime = performance.now()
    
    if (currentTime - lastTime.current >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current))
      setMetrics(prev => ({ ...prev, fps }))
      frameCount.current = 0
      lastTime.current = currentTime
    }
  })
  
  // Memory usage monitoring
  useEffect(() => {
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory
        if (memory) {
          setMetrics(prev => ({
            ...prev,
            memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1024) // MB
          }))
        }
      }
    }
    
    const interval = setInterval(updateMemoryUsage, 1000)
    return () => clearInterval(interval)
  }, [])
  
  // Toggle visibility with keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'p' && event.ctrlKey) {
        setIsVisible(prev => !prev)
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])
  
  if (!isVisible) return null
  
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 1000,
      minWidth: '200px'
    }}>
      <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>
        🚀 Performance Monitor (Ctrl+P)
      </div>
      <div>FPS: {metrics.fps}</div>
      <div>Memory: {metrics.memoryUsage} MB</div>
      <div>Blocks: {metrics.blockCount}</div>
      <div>WS Events: {metrics.webSocketEvents}</div>
      <div style={{ marginTop: '5px', fontSize: '10px', opacity: 0.7 }}>
        Renderer: {gl.getContext().getParameter(gl.getContext().VERSION)}
      </div>
    </div>
  )
}
