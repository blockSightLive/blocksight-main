/**
 * @fileoverview AppRouter - Central routing system with lazy loading for BlockSight.live
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-30
 * @lastModified 2025-08-30
 * 
 * @description
 * Implements route-based code splitting with lazy loading for all pages.
 * Separates pages into different chunks for better performance and caching.
 * Integrates with existing lazy loading patterns from Phase 1.
 * Note: BrowserRouter is provided by main.tsx, so this component only handles routes.
 * 
 * @dependencies
 * - React Router DOM for routing (Router context provided by main.tsx)
 * - React.lazy and Suspense for code splitting
 * - LoadingBlocks component for fallback UI
 * 
 * @usage
 * Main routing component that handles all application routes
 * 
 * @state
 * ✅ Fixed - Router conflict resolved, route-based splitting implementation
 * 
 * @bugs
 * - ✅ Router conflict resolved
 * 
 * @todo
 * - [HIGH] Implement route-based chunking
 * - [MEDIUM] Add error boundaries for routes
 * - [LOW] Add route transition animations
 * 
 * @performance
 * - Route-based code splitting
 * - Lazy page loading
 * - Efficient chunk organization
 * - Better caching strategies
 * 
 * @security
 * - Safe route handling
 * - No sensitive data exposure
 */

import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { LoadingBlocks } from '../components/shared'

// Lazy load all pages for route-based code splitting
const Dashboard = lazy(() => import('../pages/Dashboard').then(module => ({ default: module.Dashboard })))

// Future pages - ready for lazy loading
// const Settings = lazy(() => import('../pages/Settings').then(module => ({ default: module.Settings })))
// const Analytics = lazy(() => import('../pages/Analytics').then(module => ({ default: module.Analytics })))
// const Profile = lazy(() => import('../pages/Profile').then(module => ({ default: module.Profile })))

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Main Dashboard Route - Lazy loaded */}
      <Route 
        path="/" 
        element={
          <Suspense fallback={<LoadingBlocks />}>
            <Dashboard />
          </Suspense>
        } 
      />
      
      {/* Dashboard Route - Explicit path */}
      <Route 
        path="/dashboard" 
        element={
          <Suspense fallback={<LoadingBlocks />}>
            <Dashboard />
          </Suspense>
        } 
      />
      
      {/* Future Routes - Ready for implementation */}
      {/* 
      <Route 
        path="/settings" 
        element={
          <Suspense fallback={<LoadingBlocks />}>
            <Settings />
          </Suspense>
        } 
      />
      
      <Route 
        path="/analytics" 
        element={
          <Suspense fallback={<LoadingBlocks />}>
            <Analytics />
          </Suspense>
        } 
      />
      
      <Route 
        path="/profile" 
        element={
          <Suspense fallback={<LoadingBlocks />}>
            <Profile />
          </Suspense>
        } 
      />
      */}
      
      {/* Catch-all route - Redirect to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRouter
