/**
 * @fileoverview Lazy Page Loading System for BlockSight.live
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-30
 * @lastModified 2025-08-30
 * 
 * @description
 * Centralized lazy page loading system for route-based code splitting.
 * Exports all pages with lazy loading for better chunk organization.
 * Integrates with AppRouter for seamless routing.
 * 
 * @dependencies
 * - React.lazy for code splitting
 * - All page components
 * 
 * @usage
 * Import pages from this index for consistent lazy loading
 * 
 * @state
 * ✅ In Development - Lazy page loading system
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - [HIGH] Add all existing pages
 * - [MEDIUM] Implement error boundaries
 * - [LOW] Add loading state customization
 * 
 * @performance
 * - Centralized lazy loading
 * - Better chunk organization
 * - Efficient code splitting
 * - Improved caching
 * 
 * @security
 * - Safe page loading
 * - No sensitive data exposure
 */

import { lazy } from 'react'

// Lazy load all pages for route-based code splitting
export const Dashboard = lazy(() => import('./Dashboard').then(module => ({ default: module.Dashboard })))

// Future pages - ready for lazy loading
// export const Settings = lazy(() => import('./Settings').then(module => ({ default: module.Settings })))
// export const Analytics = lazy(() => import('./Analytics').then(module => ({ default: module.Analytics })))
// export const Profile = lazy(() => import('./Profile').then(module => ({ default: module.Profile })))

// Export all lazy-loaded pages
export const LazyPages = {
  Dashboard,
  // Settings,
  // Analytics,
  // Profile,
}

// Default export for convenience
export default LazyPages
