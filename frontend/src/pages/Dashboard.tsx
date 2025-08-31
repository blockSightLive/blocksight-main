/**
 * @fileoverview Simplified Dashboard page component for BlockSight.live
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-25
 * @lastModified 2025-08-30
 * 
 * @description
 * Simplified dashboard with three equal columns:
 * - Left: Search Results (mostly transparent)
 * - Center: Blockchain Visualizer (mostly transparent) 
 * - Right: Dashboard Data (mostly transparent)
 * All columns are responsive and fill the screen without overflow.
 * 
 * This component is now lazy loaded from App.tsx for bundle optimization.
 * Internal heavy components (BlockchainVisualizer, DashboardData) are now lazy loaded
 * for further bundle optimization and improved initial load performance.
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
 * ✅ Internal Lazy Loading - Heavy 3D components are lazy loaded
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - [MEDIUM] Add real data integration
 * - [LOW] Enhance column interactions
 * - [COMPLETED] Implement lazy loading for internal 3D components
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
 * - Internal components lazy loaded for further optimization
 * 
 * @security
 * - No external data yet
 * - Safe placeholder content
 */

import React, { lazy, Suspense } from 'react'
import './Dashboard.css'
import { LoadingBlocks } from '../components/shared'

// Lazy load heavy 3D components for bundle optimization
const DashboardData = lazy(() => import('../components/dashboard-columns/DashboardData').then(module => ({ default: module.DashboardData })))
const BlockchainVisualizer = lazy(() => import('../components/dashboard-columns/BlockchainVisualizer').then(module => ({ default: module.BlockchainVisualizer })))
const BlockchainScene = lazy(() => import('../components/dashboard-columns/blockchain/BlockchainScene').then(module => ({ default: module.BlockchainScene })))

export const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      {/* Left Column - Search Results */}
      <div className="dashboard-left">
        <div className="column-content">
          <p>Search functionality coming soon...</p>
        </div>
      </div>
      
      {/* Center Column - Blockchain Visualizer */}
      <div className="dashboard-center">
        <div className="column-content">
          <Suspense fallback={<LoadingBlocks />}>
            <BlockchainVisualizer />
          </Suspense>          
          {/* 3D Visualizations - Lazy loaded for performance */}
          <div className="dashboard-3d-visualizations">
            {/* Memory Pool 3D Visualization */}
            <div className="visualization-section">
              <h4>Memory Pool</h4>
              <Suspense fallback={<LoadingBlocks />}>
                <BlockchainScene />
              </Suspense>
            </div>
            
            {/* Current Blocks 3D Visualization */}
            <div className="visualization-section">
              <h4>Current Blocks</h4>
              <Suspense fallback={<LoadingBlocks />}>
                <BlockchainScene />
              </Suspense>
            </div>
            
            {/* Built Blockchain 3D Visualization */}
            <div className="visualization-section">
              <h4>Built Blockchain</h4>
              <Suspense fallback={<LoadingBlocks />}>
                <BlockchainScene />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Column - Dashboard Data */}
      <div className="dashboard-right">
        <Suspense fallback={<LoadingBlocks />}>
          <DashboardData />
        </Suspense>
      </div>
    </div>
  );
}
