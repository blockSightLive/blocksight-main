/**
 * @fileoverview Central column container for 3D blockchain visualization
 * @version 1.0.0
 * @since 2025-08-30
 * @lastModified 2025-08-31
 * 
 * @description
 * Main container for the center column 3D blockchain visualization.
 * Integrates section-specific blockchain scenes with real-time data updates.
 * Now uses MainOrchestrator for centralized state management and WebSocket handling.
 * 
 * @dependencies
 * - ThreeDBlockchain and TwoDBlockchain components
 * - MainOrchestrator for centralized state management
 * - PerformanceBaseline for performance monitoring
 * - Context plugins for domain-specific state
 * 
 * @usage
 * <BlockchainVisualizer />
 * 
 * @state
 * ✅ Enhanced - Real blockchain data integration with WebSocket and performance monitoring
 * 
 * @performance
 * - Real-time blockchain data updates through MainOrchestrator
 * - Performance baseline monitoring
 * - Centralized WebSocket event handling
 * - Section-specific 3D visualization
 */

import React, { lazy, Suspense, useState, useCallback } from 'react'
import { LoadingBlocks } from '../shared'
import { PerformanceBaseline } from './blockchain'
import { useBlockchainVisualization } from '../../contexts/BlockchainVisualizationContext'
import { ErrorBoundary } from '../error-handling'
import styles from './BlockchainVisualizer.module.css'

// Lazy load blockchain visualization components
const ThreeDBlockchain = lazy(() => import('./blockchain/ThreeDBlockchain').then(module => ({ default: module.ThreeDBlockchain })))
const TwoDBlockchain = lazy(() => import('./blockchain/TwoDBlockchain').then(module => ({ default: module.TwoDBlockchain })))

// WebSocket event types are now handled by MainOrchestrator

interface PerformanceAlert {
  type: 'warning' | 'critical' | 'info'
  message: string
  metric?: string
  currentValue?: number
  targetValue?: number
  timestamp: Date
}

export const BlockchainVisualizer: React.FC = () => {
  const [performanceAlerts, setPerformanceAlerts] = useState<PerformanceAlert[]>([])
  
  // Use blockchain visualization context for mode selection
  const { mode: blockchainMode } = useBlockchainVisualization()
  
  // No need for WebGL detection - user controls the mode via header selector
  
  // WebSocket events are now handled by the MainOrchestrator
  // The orchestrator automatically routes events to appropriate context plugins
  // and updates state accordingly
  
  // Performance alert handler - reduced logging for stability
  const handlePerformanceAlert = useCallback((alert: PerformanceAlert) => {
    // Only log critical alerts to reduce console noise
    if (alert.type === 'critical') {
      // Critical performance alert detected
    }
    setPerformanceAlerts(prev => [...prev.slice(-5), alert]) // Keep last 5 alerts
  }, [])
  
  // Error boundary is now handled by the ErrorBoundary component wrapper
  
  // CRITICAL FIX: Removed renderCount check that was causing crash
  // The renderCount tracking was removed to prevent infinite loops

  // No loading state needed - mode is controlled by user selection

  return (
    <ErrorBoundary componentName="BlockchainVisualizer" maxRetries={3}>
      <div className={styles.container}>
        {/* Performance Baseline Monitoring */}
        <PerformanceBaseline onPerformanceAlert={handlePerformanceAlert} />
        
        {/* Three.js Control - Removed for cleaner UI */}
        
        {/* Status bar removed - WebSocket state now handled by MainOrchestrator */}
        
        {/* Performance Alerts */}
        {performanceAlerts.length > 0 && (
          <div className={styles.performanceAlerts}>
            <h4>Performance Alerts</h4>
            {performanceAlerts.slice(-3).map((alert, index) => (
              <div key={index} className={`${styles.alert} ${styles[alert.type]}`}>
                {alert.message}
              </div>
              ))}
          </div>
        )}
        
        {/* Blockchain Visualization - 3D or 2D based on user selection */}
        <div className={styles.visualizationContainer}>
          {blockchainMode === '3d' ? (
            <Suspense fallback={<LoadingBlocks />}>
              <ThreeDBlockchain />
            </Suspense>
          ) : (
            <Suspense fallback={<LoadingBlocks />}>
              <TwoDBlockchain />
            </Suspense>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default BlockchainVisualizer