/**
 * @fileoverview Central export file for all BlockSight.live constants
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-19
 * @lastModified 2025-08-19
 * 
 * @description
 * Single import point for all constants, following our naming conventions.
 * 
 * @dependencies
 * - ./action-types.ts
 * - ./api-endpoints.ts
 * 
 * @usage
 * ```typescript
 * import { BitcoinActionTypes, API_ENDPOINTS } from './constants';
 * 
 * // Use action types
 * dispatch({ type: BitcoinActionTypes.BLOCK_NEW, payload: block });
 * 
 * // Use API endpoints
 * const response = await fetch(API_ENDPOINTS.BLOCKS.LATEST);
 * ```
 * 
 * @state
 * ✅ Production Ready - All constants exported
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - [LOW] Add more constants as needed
 * 
 * @mockData
 * - No mock data (pure export file)
 * 
 * @styling
 * - No styling needed (pure export file)
 * 
 * @performance
 * - No runtime overhead
 * 
 * @security
 * - No security concerns
 */

// ============================================================================
// ACTION TYPES
// ============================================================================

export {
  BitcoinActionTypes,
  BLOCK_ACTIONS,
  TX_ACTIONS,
  ADDRESS_ACTIONS,
  NETWORK_ACTIONS,
  FEE_ACTIONS,
  UI_ACTIONS,
  SEARCH_ACTIONS,
  CACHE_ACTIONS,
  WS_ACTIONS,
  PREF_ACTIONS,
  METRICS_ACTIONS,
  UTILITY_ACTIONS
} from './action-types';

export type { BitcoinActionType } from './action-types';

// ============================================================================
// API ENDPOINTS
// ============================================================================

export {
  API_ENDPOINTS,
  BLOCK_ENDPOINTS,
  TX_ENDPOINTS,
  ADDRESS_ENDPOINTS,
  NETWORK_ENDPOINTS,
  SEARCH_ENDPOINTS,
  ANALYTICS_ENDPOINTS,
  WS_ENDPOINTS,
  HEALTH_ENDPOINTS,
  resolveEndpoint,
  getEndpoint
} from './api-endpoints';

// ============================================================================
// BACKWARD COMPATIBILITY (DEPRECATED)
// ============================================================================

export {
  // Deprecated action types
  SET_BLOCKS,
  ADD_BLOCK,
  SET_TRANSACTIONS,
  ADD_TRANSACTION,
  SET_ADDRESSES,
  ADD_ADDRESS,
  SET_NETWORK_STATUS,
  SET_FEE_ESTIMATES,
  SET_ONLINE,
  SET_LOADING,
  SET_ERROR,
  CLEAR_ERROR,
  RESET_STATE
} from './action-types';

export {
  // Deprecated API endpoints
  GET_BLOCKS,
  GET_TRANSACTION,
  GET_ADDRESS,
  GET_NETWORK_STATUS,
  GET_FEE_ESTIMATES
} from './api-endpoints';
