/**
 * @fileoverview Central export file for all Bitcoin reducer functionality
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-19
 * @lastModified 2025-08-19
 * 
 * @description
 * Central export point for Bitcoin reducer, actions, selectors, and types.
 * Provides clean imports for components and other modules.
 * 
 * @dependencies
 * - bitcoinReducer.ts (Main reducer implementation)
 * - bitcoin types (Bitcoin data interfaces)
 * 
 * @usage
 * ```typescript
 * import { bitcoinReducer, bitcoinActions, bitcoinSelectors } from '../reducers';
 * ```
 * 
 * @state
 * ✅ Functional - Complete export of all reducer functionality
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - [LOW] Add additional reducer exports as they are created
 * 
 * @mockData
 * - No mock data in index file - pure export file
 * 
 * @performance
 * - Efficient barrel exports
 * - No runtime overhead
 * 
 * @security
 * - No security concerns for export file
 * 
 * @styling
 * - No styling needed (pure export file)
 */

// Main reducer exports
export { default as bitcoinReducer, bitcoinActions, bitcoinSelectors, initialState } from './bitcoinReducer';

// Type exports - these come from the types file, not the reducer
export type { BitcoinAction, BitcoinState } from '../types/bitcoin';

// Re-export types from bitcoin types for convenience
export type {
  BitcoinBlock,
  BitcoinTransaction,
  BitcoinAddress,
  BitcoinUTXO,
  BitcoinFeeEstimates,
  BitcoinNetworkStatus,
  BitcoinSearchResult,
  BitcoinValidationResult,
  BitcoinContextState,
  UndoRedoState
} from '../types/bitcoin';
