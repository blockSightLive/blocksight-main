/**
 * @fileoverview Clean, concise action types for BlockSight.live Bitcoin state management
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-19
 * @lastModified 2025-08-19
 * 
 * @description
 * Action types following our naming convention: [ENTITY]_[ACTION]
 * Clean, concise names that are self-explanatory in context.
 * 
 * @dependencies
 * - frontend/src/types/bitcoin.ts (Bitcoin data interfaces)
 * 
 * @usage
 * ```typescript
 * import { BitcoinActionTypes } from './constants/action-types';
 * 
 * dispatch({ type: BitcoinActionTypes.BLOCK_NEW, payload: block });
 * ```
 * 
 * @state
 * ✅ Production Ready - Clean naming convention implemented
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - [MEDIUM] Add more specific action types as needed
 * - [LOW] Consider grouping actions by domain
 * 
 * @mockData
 * - No mock data (pure constants file)
 * 
 * @styling
 * - No styling needed (pure constants file)
 * 
 * @performance
 * - Constant values, no runtime overhead
 * 
 * @security
 * - No security concerns for constants
 */

// ============================================================================
// BLOCK ACTIONS
// ============================================================================

export const BLOCK_ACTIONS = {
  // Core block operations
  NEW: 'BLOCK_NEW',           // New block received
  UPDATE: 'BLOCK_UPDATE',     // Block data updated
  REMOVE: 'BLOCK_REMOVE',     // Block removed (reorg)
  BATCH: 'BLOCKS_UPDATE',     // Multiple blocks updated
  
  // Block-specific operations
  CONFIRM: 'BLOCK_CONFIRM',   // Block confirmed
  REORG: 'BLOCK_REORG',       // Block reorganized
  VALIDATE: 'BLOCK_VALIDATE'  // Block validation
} as const;

// ============================================================================
// TRANSACTION ACTIONS
// ============================================================================

export const TX_ACTIONS = {
  // Core transaction operations
  NEW: 'TX_NEW',              // New transaction
  UPDATE: 'TX_UPDATE',        // Transaction updated
  REMOVE: 'TX_REMOVE',        // Transaction removed
  BATCH: 'TXS_UPDATE',        // Multiple transactions updated
  
  // Transaction-specific operations
  MEMPOOL: 'TX_MEMPOOL',      // Mempool transaction
  CONFIRMED: 'TX_CONFIRMED',  // Transaction confirmed
  RBF: 'TX_RBF',              // Replace-by-fee
  CPFP: 'TX_CPFP'             // Child-pays-for-parent
} as const;

// ============================================================================
// ADDRESS ACTIONS
// ============================================================================

export const ADDRESS_ACTIONS = {
  // Core address operations
  NEW: 'ADDRESS_NEW',         // New address data
  UPDATE: 'ADDRESS_UPDATE',   // Address data updated
  REMOVE: 'ADDRESS_REMOVE',   // Address removed
  BATCH: 'ADDRESSES_UPDATE',  // Multiple addresses updated
  
  // Address-specific operations
  BALANCE: 'ADDRESS_BALANCE', // Balance update
  UTXOS: 'ADDRESS_UTXOS',     // UTXO update
  HISTORY: 'ADDRESS_HISTORY'  // History update
} as const;

// ============================================================================
// NETWORK ACTIONS
// ============================================================================

export const NETWORK_ACTIONS = {
  // Core network operations
  STATUS: 'NETWORK_STATUS',    // Network status update
  ONLINE: 'NETWORK_ONLINE',   // Online/offline status
  
  // Network-specific operations
  DIFFICULTY: 'NETWORK_DIFFICULTY', // Difficulty adjustment
  HASHRATE: 'NETWORK_HASHRATE',     // Hashrate update
  MEMPOOL: 'NETWORK_MEMPOOL',       // Mempool update
  SYNC: 'NETWORK_SYNC'              // Sync progress
} as const;

// ============================================================================
// FEE ACTIONS
// ============================================================================

export const FEE_ACTIONS = {
  // Core fee operations
  UPDATE: 'FEES_UPDATE',      // Fee estimates updated
  
  // Fee-specific operations
  MEMPOOL: 'FEES_MEMPOOL',    // Mempool fee update
  CONFIRMED: 'FEES_CONFIRMED', // Confirmed fee update
  PREDICT: 'FEES_PREDICT'     // Fee prediction
} as const;

// ============================================================================
// PRICE ACTIONS
// ============================================================================

export const PRICE_ACTIONS = {
  UPDATE: 'PRICE_UPDATE'       // Current BTC/USD price update
} as const;

// ============================================================================
// FX ACTIONS
// ============================================================================

export const FX_ACTIONS = {
  UPDATE: 'FX_UPDATE'          // FX rates update (USD base)
} as const;

// ============================================================================
// UI ACTIONS
// ============================================================================

export const UI_ACTIONS = {
  // Core UI operations
  LOADING: 'UI_LOADING',      // Loading state
  ERROR: 'UI_ERROR',          // Error state
  CLEAR_ERROR: 'UI_CLEAR_ERROR', // Clear error
  
  // UI-specific operations
  SELECT_BLOCK: 'UI_SELECT_BLOCK',       // Select block
  SELECT_TX: 'UI_SELECT_TX',             // Select transaction
  SELECT_ADDRESS: 'UI_SELECT_ADDRESS',   // Select address
  VIEW_MODE: 'UI_VIEW_MODE',             // Change view mode
  SORT: 'UI_SORT'                        // Change sort order
} as const;

// ============================================================================
// SEARCH ACTIONS
// ============================================================================

export const SEARCH_ACTIONS = {
  // Core search operations
  QUERY: 'SEARCH_QUERY',      // Search query
  RESULTS: 'SEARCH_RESULTS',  // Search results
  CLEAR: 'SEARCH_CLEAR',      // Clear search
  
  // Search-specific operations
  FILTERS: 'SEARCH_FILTERS',  // Search filters
  SUGGESTIONS: 'SEARCH_SUGGESTIONS' // Search suggestions
} as const;

// ============================================================================
// CACHE ACTIONS
// ============================================================================

export const CACHE_ACTIONS = {
  // Core cache operations
  CLEAR: 'CACHE_CLEAR',       // Clear cache
  UPDATE_STATS: 'CACHE_STATS', // Update cache statistics
  
  // Cache-specific operations
  INVALIDATE: 'CACHE_INVALIDATE', // Invalidate specific cache
  OPTIMIZE: 'CACHE_OPTIMIZE'      // Optimize cache
} as const;

// ============================================================================
// WEBSOCKET ACTIONS
// ============================================================================

export const WS_ACTIONS = {
  // Core WebSocket operations
  CONNECT: 'WS_CONNECT',       // WebSocket connected
  DISCONNECT: 'WS_DISCONNECT', // WebSocket disconnected
  STATUS: 'WS_STATUS',         // WebSocket status
  
  // WebSocket-specific operations
  MESSAGE: 'WS_MESSAGE',       // WebSocket message
  ERROR: 'WS_ERROR',           // WebSocket error
  RECONNECT: 'WS_RECONNECT'    // WebSocket reconnection
} as const;

// ============================================================================
// PREFERENCE ACTIONS
// ============================================================================

export const PREF_ACTIONS = {
  // Core preference operations
  UPDATE: 'PREF_UPDATE',       // Update preference
  BATCH: 'PREFS_UPDATE',       // Update multiple preferences
  
  // Preference-specific operations
  THEME: 'PREF_THEME',         // Theme preference
  LANGUAGE: 'PREF_LANGUAGE',   // Language preference
  CURRENCY: 'PREF_CURRENCY'    // Currency preference
} as const;

// ============================================================================
// METRICS ACTIONS
// ============================================================================

export const METRICS_ACTIONS = {
  // Core metrics operations
  UPDATE: 'METRICS_UPDATE',    // Update metrics
  RESET: 'METRICS_RESET',      // Reset metrics
  
  // Metrics-specific operations
  REQUEST: 'METRICS_REQUEST',  // Request metric
  PERFORMANCE: 'METRICS_PERF'  // Performance metric
} as const;

// ============================================================================
// UTILITY ACTIONS
// ============================================================================

export const UTILITY_ACTIONS = {
  // Core utility operations
  RESET: 'RESET_STATE',        // Reset entire state
  BATCH: 'BATCH_UPDATE',       // Batch multiple actions
  
  // Utility-specific operations
  UNDO: 'UNDO',                // Undo action
  REDO: 'REDO',                // Redo action
  SAVE: 'SAVE_STATE'           // Save state
} as const;

// ============================================================================
// COMPOSITE ACTION TYPES
// ============================================================================

export const BitcoinActionTypes = {
  // Block actions
  ...BLOCK_ACTIONS,
  
  // Transaction actions
  ...TX_ACTIONS,
  
  // Address actions
  ...ADDRESS_ACTIONS,
  
  // Network actions
  ...NETWORK_ACTIONS,
  
  // Fee actions
  ...FEE_ACTIONS,
  // Price actions
  ...PRICE_ACTIONS,
  // FX actions
  ...FX_ACTIONS,
  
  // UI actions
  ...UI_ACTIONS,
  
  // Search actions
  ...SEARCH_ACTIONS,
  
  // Cache actions
  ...CACHE_ACTIONS,
  
  // WebSocket actions
  ...WS_ACTIONS,
  
  // Preference actions
  ...PREF_ACTIONS,
  
  // Metrics actions
  ...METRICS_ACTIONS,
  
  // Utility actions
  ...UTILITY_ACTIONS
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type BitcoinActionType = typeof BitcoinActionTypes[keyof typeof BitcoinActionTypes];

// ============================================================================
// BACKWARD COMPATIBILITY (DEPRECATED)
// ============================================================================

/** @deprecated Use BitcoinActionTypes.BLOCK_NEW instead */
export const SET_BLOCKS = BitcoinActionTypes.BATCH;
/** @deprecated Use BitcoinActionTypes.BLOCK_NEW instead */
export const ADD_BLOCK = BitcoinActionTypes.NEW;
/** @deprecated Use BitcoinActionTypes.TXS_UPDATE instead */
export const SET_TRANSACTIONS = BitcoinActionTypes.BATCH;
/** @deprecated Use BitcoinActionTypes.TX_NEW instead */
export const ADD_TRANSACTION = BitcoinActionTypes.NEW;
/** @deprecated Use BitcoinActionTypes.ADDRESSES_UPDATE instead */
export const SET_ADDRESSES = BitcoinActionTypes.BATCH;
/** @deprecated Use BitcoinActionTypes.ADDRESS_NEW instead */
export const ADD_ADDRESS = BitcoinActionTypes.NEW;
/** @deprecated Use BitcoinActionTypes.NETWORK_STATUS instead */
export const SET_NETWORK_STATUS = BitcoinActionTypes.STATUS;
/** @deprecated Use BitcoinActionTypes.FEES_UPDATE instead */
export const SET_FEE_ESTIMATES = BitcoinActionTypes.UPDATE;
/** @deprecated Use BitcoinActionTypes.NETWORK_ONLINE instead */
export const SET_ONLINE = BitcoinActionTypes.ONLINE;
/** @deprecated Use BitcoinActionTypes.UI_LOADING instead */
export const SET_LOADING = BitcoinActionTypes.LOADING;
/** @deprecated Use BitcoinActionTypes.UI_ERROR instead */
export const SET_ERROR = BitcoinActionTypes.ERROR;
/** @deprecated Use BitcoinActionTypes.UI_CLEAR_ERROR instead */
export const CLEAR_ERROR = BitcoinActionTypes.CLEAR_ERROR;
/** @deprecated Use BitcoinActionTypes.UTILITY_ACTIONS.RESET instead */
export const RESET_STATE = BitcoinActionTypes.RESET;
