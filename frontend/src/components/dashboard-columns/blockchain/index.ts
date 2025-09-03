/**
 * @fileoverview Blockchain visualization components export
 * @version 2.0.0
 * @since 2025-08-30
 * @lastModified 2025-08-31
 * 
 * @description
 * Exports all blockchain visualization components including the new Phase 3 completion components.
 * WebSocket handling and blockchain data are now managed by MainOrchestrator.
 * 
 * @dependencies
 * - All blockchain visualization components
 * - MainOrchestrator for state management
 */

// Core blockchain visualization components
export { Block } from './Block'

export { PerformanceBaseline } from './PerformanceBaseline'
export { ThreeDBlockchain } from './ThreeDBlockchain'
export { TwoDBlockchain } from './TwoDBlockchain'

// Additional blockchain components
export { WebSocketHandler } from './WebSocketHandler'