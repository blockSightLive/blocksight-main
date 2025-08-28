/**
 * @fileoverview Performance Monitor for Cosmic Backgrounds
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-25
 * @lastModified 2025-08-25
 * 
 * @description
 * Performance monitoring component that tracks FPS, memory usage, and
 * rendering performance for both CSS and HTML5 Canvas cosmic backgrounds.
 * Helps developers compare performance characteristics of different approaches.
 * 
 * @dependencies
 * - React hooks for state management
 * - Browser performance APIs
 * - Custom performance measurement algorithms
 * 
 * @usage
 * Import and render alongside BackgroundToggle for performance comparison
 * 
 * @state
 * 🔧 In Development - Performance monitoring implementation
 * 
 * @bugs
 * - Performance metrics calculation in progress
 * - Memory usage tracking needs optimization
 * 
 * @todo
 * - [HIGH] Implement accurate FPS calculation
 * - [HIGH] Add memory usage tracking
 * - [MEDIUM] Add performance history charts
 * - [LOW] Add performance recommendations
 * 
 * @mockData
 * - No mock data - real-time performance metrics
 * 
 * @styling
 * - CSS Modules: Monitor panel styling
 * - Inline styles: Real-time metric display
 * 
 * @performance
 * - Minimal overhead monitoring
 * - Efficient metric calculation
 * - Real-time updates
 * 
 * @security
 * - Safe performance API usage
 * - No sensitive data collection
 * - Controlled metric exposure
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage?: number;
  renderTime: number;
  timestamp: number;
}

interface PerformanceMonitorProps {
  backgroundType: 'css' | 'canvas';
  quality?: 'low' | 'medium' | 'high';
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  backgroundType, 
  quality = 'high' 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    renderTime: 0,
    timestamp: Date.now()
  });
  
  const [isMonitoring, setIsMonitoring] = useState(false);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const frameTimeRef = useRef<number[]>([]);

  // Calculate FPS
  const calculateFPS = useCallback(() => {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTimeRef.current;
    
    if (deltaTime >= 1000) { // Update every second
      const fps = Math.round((frameCountRef.current * 1000) / deltaTime);
      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
      
      // Calculate average frame time
      const avgFrameTime = frameTimeRef.current.length > 0 
        ? frameTimeRef.current.reduce((a, b) => a + b, 0) / frameTimeRef.current.length 
        : 0;
      
      // Keep only last 60 frame times for rolling average
      if (frameTimeRef.current.length > 60) {
        frameTimeRef.current.shift();
      }
      
      setMetrics(prev => ({
        ...prev,
        fps,
        renderTime: avgFrameTime,
        timestamp: Date.now()
      }));
    }
    
    frameCountRef.current++;
    frameTimeRef.current.push(deltaTime);
  }, []);

  // Get memory usage if available
  const getMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as { memory?: { usedJSHeapSize: number } }).memory;
      if (memory && memory.usedJSHeapSize) {
        return Math.round(memory.usedJSHeapSize / 1024 / 1024); // MB
      }
      return 0;
    }
    return undefined;
  }, []);

  // Start/stop monitoring
  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      frameCountRef.current = 0;
      lastTimeRef.current = performance.now();
      frameTimeRef.current = [];
    }
  };

  // Performance monitoring loop
  useEffect(() => {
    if (!isMonitoring) return;

    const monitorLoop = () => {
      calculateFPS();
      requestAnimationFrame(monitorLoop);
    };

    const animationId = requestAnimationFrame(monitorLoop);
    return () => cancelAnimationFrame(animationId);
  }, [isMonitoring, calculateFPS]);

  // Update memory usage periodically
  useEffect(() => {
    if (!isMonitoring) return;

    const memoryInterval = setInterval(() => {
      const memoryUsage = getMemoryUsage();
      if (memoryUsage !== undefined) {
        setMetrics(prev => ({
          ...prev,
          memoryUsage
        }));
      }
    }, 1000);

    return () => clearInterval(memoryInterval);
  }, [isMonitoring, getMemoryUsage]);

  // Performance rating based on metrics
  const getPerformanceRating = (fps: number, renderTime: number): { rating: string; color: string } => {
    if (fps >= 58 && renderTime < 16.67) return { rating: 'Excellent', color: '#10b981' };
    if (fps >= 50 && renderTime < 20) return { rating: 'Good', color: '#f59e0b' };
    if (fps >= 30 && renderTime < 33.33) return { rating: 'Fair', color: '#f97316' };
    return { rating: 'Poor', color: '#ef4444' };
  };

  const performanceRating = getPerformanceRating(metrics.fps, metrics.renderTime);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      zIndex: 10000,
      background: 'rgba(0, 0, 0, 0.9)',
      padding: '15px',
      borderRadius: '10px',
      color: 'white',
      fontFamily: 'monospace',
      fontSize: '12px',
      minWidth: '200px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>📊 Performance Monitor</h3>
      
      {/* Background Info */}
      <div style={{ marginBottom: '15px' }}>
        <div><strong>Background:</strong> {backgroundType === 'css' ? 'CSS' : 'HTML5 Canvas'}</div>
        <div><strong>Quality:</strong> {quality}</div>
        <div><strong>Status:</strong> 
          <span style={{ color: isMonitoring ? '#10b981' : '#ef4444' }}>
            {isMonitoring ? ' Monitoring' : ' Stopped'}
          </span>
        </div>
      </div>

      {/* Performance Metrics */}
      {isMonitoring && (
        <>
          <div style={{ marginBottom: '10px' }}>
            <div><strong>FPS:</strong> 
              <span style={{ color: metrics.fps >= 50 ? '#10b981' : metrics.fps >= 30 ? '#f59e0b' : '#ef4444' }}>
                {metrics.fps}
              </span>
            </div>
            <div><strong>Frame Time:</strong> {metrics.renderTime.toFixed(2)}ms</div>
            {metrics.memoryUsage !== undefined && (
              <div><strong>Memory:</strong> {metrics.memoryUsage}MB</div>
            )}
          </div>

          {/* Performance Rating */}
          <div style={{
            padding: '8px',
            background: `rgba(${performanceRating.color === '#10b981' ? '16, 185, 129' : 
                                   performanceRating.color === '#f59e0b' ? '245, 158, 11' : 
                                   performanceRating.color === '#f97316' ? '249, 115, 22' : '239, 68, 68'}, 0.2)`,
            borderRadius: '5px',
            borderLeft: `3px solid ${performanceRating.color}`,
            fontSize: '11px'
          }}>
            <strong>Rating:</strong> {performanceRating.rating}
          </div>
        </>
      )}

      {/* Controls */}
      <div style={{ marginTop: '15px' }}>
        <button
          onClick={toggleMonitoring}
          style={{
            padding: '6px 12px',
            background: isMonitoring ? '#ef4444' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            width: '100%'
          }}
        >
          {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        </button>
      </div>

      {/* Performance Tips */}
      <div style={{
        marginTop: '10px',
        padding: '8px',
        background: 'rgba(139, 92, 246, 0.2)',
        borderRadius: '4px',
        fontSize: '10px',
        borderLeft: '3px solid #8b5cf6'
      }}>
        <strong>Tip:</strong> {backgroundType === 'css' 
          ? 'CSS backgrounds are lightweight but limited in complexity'
          : 'Canvas provides better performance for complex animations'
        }
      </div>
    </div>
  );
};

export default PerformanceMonitor;
