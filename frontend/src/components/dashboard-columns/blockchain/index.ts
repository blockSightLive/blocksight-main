/**
 * @fileoverview Clean exports for Three.js components
 * @version 1.0.0
 * @since 2025-08-30
 * @lastModified 2025-08-30
 * 
 * @description
 * Exports for blockchain components that are NOT lazy loaded.
 * Lazy loaded components (Scene, Block) are imported directly in BlockchainScene.tsx
 * to avoid import conflicts and enable proper chunk separation.
 */

// Export only components that are NOT lazy loaded
export { useBlockHeight } from './useBlockHeight'
export { PerformanceMonitor } from './PerformanceMonitor'