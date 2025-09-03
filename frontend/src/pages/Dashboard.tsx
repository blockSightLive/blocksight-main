/**
 * @fileoverview Dashboard component for BlockSight.live
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-25
 * @lastModified 2025-08-31
 * 
 * @description
 * Main dashboard with three-column layout: Search, Blockchain Visualizer, and Dashboard Data.
 * Implements lazy loading for performance optimization.
 * ThreeJS visualizations are now properly integrated within BlockchainVisualizer.
 * 
 * @dependencies
 * - React with lazy loading and Suspense
 * - CSS custom properties from styles system
 * - Blockchain visualizer components (lazy loaded)
 * 
 * @usage
 * Main landing page with clean three-column responsive layout
 * 
 * @state
 * ✅ Lazy Loaded - Component is now lazy loaded for bundle optimization
 * ✅ ThreeJS Integrated - 3D visualizations properly integrated in BlockchainVisualizer
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - [MEDIUM] Add real data integration
 * - [LOW] Enhance column interactions
 * - [COMPLETED] Implement lazy loading for internal 3D components
 * - [COMPLETED] Integrate ThreeJS visualizations in BlockchainVisualizer
 * 
 * @styling
 * - CSS Modules: Layout and grid structure
 * - CSS Custom Properties: Theme colors and spacing
 * - Responsive Design: Mobile-first with equal columns
 * 
 * @performance
 * - Efficient grid layout
 * - Minimal re-renders
 * - Responsive breakpoints
 * - Lazy loaded for bundle optimization
 * - ThreeJS components properly integrated
 * 
 * @security
 * - No external data yet
 * - Safe placeholder content
 */

import React, { lazy, Suspense } from 'react'
import './Dashboard.css'
import { LoadingBlocks } from '../components/shared'
import { ErrorBoundary } from '../components/error-handling'

// Lazy load heavy components for bundle optimization
const DashboardData = lazy(() => import('../components/dashboard-columns/DashboardData').then(module => ({ default: module.DashboardData })))
const BlockchainVisualizer = lazy(() => import('../components/dashboard-columns/BlockchainVisualizer').then(module => ({ default: module.BlockchainVisualizer })))

export const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      {/* Left Column - Search Results */}
      <div className="dashboard-left">
        <div className="column-content">
          <ErrorBoundary componentName="SearchColumn" maxRetries={2}>
            <p>Search functionality coming soon...</p>
          </ErrorBoundary>
        </div>
      </div>
      
      {/* Center Column - Blockchain Visualizer with integrated 3D scenes */}
      <div className="dashboard-center">
        <div className="column-content">
          {/* Use generic boundary here so blockchain visualization can manage WebGL fallback */}
          <ErrorBoundary componentName="BlockchainVisualizer" maxRetries={1}>
            <Suspense fallback={<LoadingBlocks />}>
              <BlockchainVisualizer />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
      
      {/* Right Column - Dashboard Data */}
      <div className="dashboard-right">
        <ErrorBoundary componentName="DashboardData" maxRetries={2}>
          <Suspense fallback={<LoadingBlocks />}>
            <DashboardData />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
