/**
 * @fileoverview Shared components index for BlockSight.live
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-30
 * @lastModified 2025-08-30
 * 
 * @description
 * Central export file for all shared components used across the application.
 * Provides clean imports and better organization.
 * 
 * @dependencies
 * - All shared component files
 * 
 * @usage
 * import { LoadingBlocks, ErrorBoundary } from '@/components/shared'
 * 
 * @state
 * ✅ Functional - Complete export of all shared components
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - [LOW] Add component documentation
 * - [LOW] Group by functionality
 * 
 * @performance
 * - Efficient imports
 * - Tree-shaking friendly
 * 
 * @security
 * - Safe component exports
 */

export { default as LoadingBlocks } from './LoadingBlocks'
// ErrorBoundary moved to error-handling module
export { ErrorDisplay } from './ErrorDisplay'
