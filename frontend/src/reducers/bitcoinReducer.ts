/**
 * @fileoverview Bitcoin state management reducer for BlockSight.live
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-19
 * @lastModified 2025-08-11
 * 
 * @description
 * Simple, minimal Bitcoin state management reducer. Starting with basic
 * functionality and building up incrementally.
 * 
 * @dependencies
 * - frontend/src/types/bitcoin.ts (Bitcoin data interfaces)
 * 
 * @usage
 * ```typescript
 * import { bitcoinReducer, initialState } from './bitcoinReducer';
 * import { useReducer } from 'react';
 * 
 * const [state, dispatch] = useReducer(bitcoinReducer, initialState);
 * ```
 * 
 * @state
 * 🔄 In Development - Basic skeleton, building incrementally
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - [HIGH] Add basic block/transaction/address actions
 * - [HIGH] Implement simple state updates
 * - [MEDIUM] Add validation and error handling
 * - [MEDIUM] Implement undo/redo functionality
 * - [LOW] Add advanced features and optimizations
 * 
 * @mockData
 * - Initial state uses minimal sample data for testing
 * - All data structures are simplified for initial development
 * - Replace with real data as backend integration progresses
 * 
 * @styling
 * - No styling needed (pure Redux reducer file)
 * 
 * @performance
 * - Basic immutable state updates
 * - Simple action handling without complex optimizations
 * 
 * @security
 * - Basic input validation (to be implemented)
 * - Simple state mutation prevention
 */

import { 
  BitcoinBlock, 
  BitcoinTransaction, 
  BitcoinAddress, 
  BitcoinState,
  BitcoinAction,
  NetworkLoad
} from '../types/bitcoin';
import { 
  BLOCK_ACTIONS, 
  TX_ACTIONS, 
  ADDRESS_ACTIONS, 
  NETWORK_ACTIONS, 
  FEE_ACTIONS, 
  PRICE_ACTIONS,
  FX_ACTIONS,
  UI_ACTIONS, 
  UTILITY_ACTIONS 
} from '../constants/action-types';

// ============================================================================
// CONSTANTS
// ============================================================================

// Using centralized action types from constants
// BitcoinActionTypes is imported from '../constants/action-types'

// ============================================================================
// INITIAL STATE
// ============================================================================

export const initialState: BitcoinState = {
  // Core Bitcoin Data
  blocks: [],
  transactions: [],
  addresses: [],
  utxos: [],
  
  // Network & Status
  networkStatus: {
    isOnline: true,
    lastBlockHeight: 800000,
    lastBlockTime: Date.now(),
    syncProgress: 100,
    mempoolSize: 15000,
    networkDifficulty: '0x1a123456',
    averageBlockTime: 600000,
    lastUpdated: Date.now(),
    // Additional properties components need
    load: NetworkLoad.NEUTRAL, // NetworkLoad enum
    pendingTransactions: 5000,
    difficulty: 123456789.123
  },
  
  // Fee Information
  feeEstimates: {
    fast: 25,
    medium: 15,
    slow: 5,
    lastUpdated: Date.now(),
    confidence: 0.95,
    // Additional properties components need
    confirmationTimes: {
      fast: 1,
      medium: 6,
      slow: 24
    },
    mempoolSize: 15000,
    pendingCount: 5000,
    timestamp: Date.now()
  },
  
  // Price and FX (initialized minimal; populated from bootstrap/WS)
  priceUSD: null,
  fx: null,
  
  // Search & Filtering
  searchResults: [],
  searchQuery: '',
  searchFilters: {
    type: 'all',
    dateRange: '24h',
    minAmount: 0,
    maxAmount: Infinity,
    confirmed: true
  },
  
  // UI State
  ui: {
    isLoading: false,
    loadingStates: {
      blocks: false,
      transactions: false,
      addresses: false,
      search: false
    },
    error: null,
    selectedBlock: null,
    selectedTransaction: null,
    selectedAddress: null,
    viewMode: 'grid',
    sortBy: 'time',
    sortOrder: 'desc'
  },
  
  // Caching & Performance
  cache: {
    blockCache: new Map(),
    transactionCache: new Map(),
    addressCache: new Map(),
    lastCacheCleanup: Date.now(),
    cacheHits: 0,
    cacheMisses: 0
  },
  
  // Undo/Redo System
  undoRedo: {
    history: [],
    currentIndex: -1,
    maxHistory: 50,
    isUndoRedoAction: false
  },
  
  // Real-time Updates
  realtime: {
    lastWebSocketUpdate: null,
    pendingUpdates: [],
    updateQueue: [],
    isConnected: false,
    connectionStatus: 'disconnected'
  },
  
  // User Preferences
  preferences: {
    autoRefresh: true,
    refreshInterval: 30000,
    showUnconfirmed: true,
    defaultCurrency: 'USD',
    theme: 'cosmic',
    language: 'en'
  },
  
  // Analytics & Metrics
  metrics: {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    lastMetricsReset: Date.now()
  }
};

// ============================================================================
// ACTION CREATORS
// ============================================================================

export const bitcoinActions = {
  // Block Actions
  updateBlocks: (blocks: BitcoinBlock[]) => ({
    type: BLOCK_ACTIONS.BATCH,
    payload: blocks
  }),
  
  newBlock: (block: BitcoinBlock) => ({
    type: BLOCK_ACTIONS.NEW,
    payload: block
  }),
  
  // Transaction Actions
  updateTransactions: (transactions: BitcoinTransaction[]) => ({
    type: TX_ACTIONS.BATCH,
    payload: transactions
  }),
  
  newTransaction: (transaction: BitcoinTransaction) => ({
    type: TX_ACTIONS.NEW,
    payload: transaction
  }),
  
  // Address Actions
  updateAddresses: (addresses: BitcoinAddress[]) => ({
    type: ADDRESS_ACTIONS.BATCH,
    payload: addresses
  }),
  
  newAddress: (address: BitcoinAddress) => ({
    type: ADDRESS_ACTIONS.NEW,
    payload: address
  }),
  
  // Network & Fee Actions
  updateNetworkStatus: (status: BitcoinState['networkStatus']) => ({
    type: NETWORK_ACTIONS.STATUS,
    payload: status
  }),
  updateFees: (estimates: BitcoinState['feeEstimates']) => ({
    type: FEE_ACTIONS.UPDATE,
    payload: estimates
  }),
  setOnline: (isOnline: boolean) => ({
    type: NETWORK_ACTIONS.ONLINE,
    payload: isOnline
  }),
  
  // UI Actions
  setLoading: (isLoading: boolean) => ({
    type: UI_ACTIONS.LOADING,
    payload: isLoading
  }),
  
  setError: (error: string | null) => ({
    type: UI_ACTIONS.ERROR,
    payload: error
  }),
  
  clearError: () => ({
    type: UI_ACTIONS.CLEAR_ERROR
  }),
  
  updateLastUpdated: () => ({
    type: NETWORK_ACTIONS.STATUS
  }),
  
  // Reset Action
  resetState: () => ({
    type: UTILITY_ACTIONS.RESET
  })
};

// ============================================================================
// MAIN REDUCER
// ============================================================================

export function bitcoinReducer(
  state: BitcoinState = initialState,
  action: BitcoinAction
): BitcoinState {
  switch (action.type) {
    // ========================================================================
    // BLOCK ACTIONS
    // ========================================================================
    
    case BLOCK_ACTIONS.BATCH: {
      return {
        ...state,
        blocks: action.payload,
        ui: { ...state.ui, error: null }
      };
    }
    
    case BLOCK_ACTIONS.NEW: {
      return {
        ...state,
        blocks: [action.payload, ...state.blocks],
        ui: { ...state.ui, error: null }
      };
    }
    
    // ========================================================================
    // TRANSACTION ACTIONS
    // ========================================================================
    
    case TX_ACTIONS.BATCH: {
      return {
        ...state,
        transactions: action.payload,
        ui: { ...state.ui, error: null }
      };
    }
    
    case TX_ACTIONS.NEW: {
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
        ui: { ...state.ui, error: null }
      };
    }
    
    // ========================================================================
    // ADDRESS ACTIONS
    // ========================================================================
    
    case ADDRESS_ACTIONS.BATCH: {
      return {
        ...state,
        addresses: action.payload,
        ui: { ...state.ui, error: null }
      };
    }
    
    case ADDRESS_ACTIONS.NEW: {
      return {
        ...state,
        addresses: [action.payload, ...state.addresses],
        ui: { ...state.ui, error: null }
      };
    }
    
    // ========================================================================
    // NETWORK & FEE ACTIONS
    // ========================================================================
    
    case NETWORK_ACTIONS.STATUS: {
      return {
        ...state,
        networkStatus: {
          ...action.payload,
          lastUpdated: Date.now()
        }
      };
    }
    
    case FEE_ACTIONS.UPDATE: {
      return {
        ...state,
        feeEstimates: action.payload
      };
    }

    // ========================================================================
    // PRICE & FX ACTIONS
    // ========================================================================
    case PRICE_ACTIONS.UPDATE: {
      return {
        ...state,
        priceUSD: action.payload
      }
    }

    case FX_ACTIONS.UPDATE: {
      return {
        ...state,
        fx: action.payload
      }
    }
    
    case NETWORK_ACTIONS.ONLINE: {
      return {
        ...state,
        networkStatus: {
          ...state.networkStatus,
          isOnline: action.payload
        }
      };
    }
    
    // ========================================================================
    // UI ACTIONS
    // ========================================================================
    
    case UI_ACTIONS.LOADING: {
      return {
        ...state,
        ui: { ...state.ui, isLoading: action.payload }
      };
    }
    
    case UI_ACTIONS.ERROR: {
      return {
        ...state,
        ui: { ...state.ui, error: action.payload }
      };
    }
    
    case UI_ACTIONS.CLEAR_ERROR: {
      return {
        ...state,
        ui: { ...state.ui, error: null }
      };
    }
    

    
    // ========================================================================
    // RESET ACTION
    // ========================================================================
    
    case UTILITY_ACTIONS.RESET: {
      return {
        ...initialState,
        metrics: {
          ...initialState.metrics,
          lastMetricsReset: Date.now()
        }
      };
    }
    
    // ========================================================================
    // DEFAULT CASE
    // ========================================================================
    
    default: {
      return state;
    }
  }
}

// ============================================================================
// BASIC SELECTORS
// ============================================================================

export const bitcoinSelectors = {
  // Block Selectors
  getBlockByHash: (state: BitcoinState, hash: string) =>
    state.blocks.find(block => block.hash === hash),
  
  getLatestBlocks: (state: BitcoinState, count: number = 10) =>
    state.blocks.slice(0, count),
  
  // Transaction Selectors
  getTransactionById: (state: BitcoinState, txid: string) =>
    state.transactions.find(tx => tx.txid === txid),
  
  // Address Selectors
  getAddressByHash: (state: BitcoinState, address: string) =>
    state.addresses.find(addr => addr.address === address),
  
  // UI Selectors
  getLoadingState: (state: BitcoinState) => state.ui.isLoading,
  getError: (state: BitcoinState) => state.ui.error,
  
  // Convenience selectors for components
  getIsOnline: (state: BitcoinState) => state.networkStatus.isOnline,
  getLatestBlocksForDisplay: (state: BitcoinState, count: number = 5) =>
    state.blocks.slice(0, count),
  // Derived: time since last block in seconds (based on lastBlockTime)
  getTimeSinceLastBlockSec: (state: BitcoinState): number | null => {
    const ts = state.networkStatus.lastBlockTime;
    if (!ts) return null;
    const diffMs = Date.now() - ts;
    if (diffMs < 0) return 0;
    return Math.floor(diffMs / 1000);
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export default bitcoinReducer;
