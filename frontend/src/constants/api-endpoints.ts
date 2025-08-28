/**
 * @fileoverview Clean, concise API endpoints for BlockSight.live
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-19
 * @lastModified 2025-08-19
 * 
 * @description
 * API endpoints following our naming convention: [RESOURCE]/[ACTION]
 * Clean, RESTful endpoints that are self-explanatory.
 * 
 * @dependencies
 * - None (pure constants file)
 * 
 * @usage
 * ```typescript
 * import { API_ENDPOINTS } from './constants/api-endpoints';
 * 
 * const response = await fetch(API_ENDPOINTS.BLOCKS.LATEST);
 * ```
 * 
 * @state
 * ✅ Production Ready - Clean endpoint naming implemented
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - [MEDIUM] Add WebSocket endpoints
 * - [LOW] Add authentication endpoints
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
 * - Endpoints follow REST security best practices
 */

// ============================================================================
// BASE URL CONFIGURATION
// ============================================================================

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.blocksight.live' 
  : 'http://localhost:8000';

const API_VERSION = 'v1';
const API_BASE = `${BASE_URL}/api/${API_VERSION}`;

// ============================================================================
// BLOCK ENDPOINTS
// ============================================================================

export const BLOCK_ENDPOINTS = {
  // Core block operations
  LIST: `${API_BASE}/blocks`,                    // GET - List blocks
  BY_HASH: `${API_BASE}/blocks/:hash`,          // GET - Get block by hash
  BY_HEIGHT: `${API_BASE}/blocks/height/:num`,  // GET - Get block by height
  LATEST: `${API_BASE}/blocks/latest`,          // GET - Get latest blocks
  
  // Block-specific operations
  TRANSACTIONS: `${API_BASE}/blocks/:hash/txs`, // GET - Get block transactions
  STATS: `${API_BASE}/blocks/stats`,            // GET - Get block statistics
  TIMELINE: `${API_BASE}/blocks/timeline`       // GET - Get block timeline
} as const;

// ============================================================================
// TRANSACTION ENDPOINTS
// ============================================================================

export const TX_ENDPOINTS = {
  // Core transaction operations
  LIST: `${API_BASE}/transactions`,                    // GET - List transactions
  BY_ID: `${API_BASE}/transactions/:txid`,            // GET - Get transaction by ID
  MEMPOOL: `${API_BASE}/transactions/mempool`,        // GET - Get mempool transactions
  
  // Transaction-specific operations
  BY_ADDRESS: `${API_BASE}/transactions/address/:addr`, // GET - Get transactions for address
  BY_BLOCK: `${API_BASE}/transactions/block/:hash`,     // GET - Get transactions in block
  STATS: `${API_BASE}/transactions/stats`,              // GET - Get transaction statistics
  
  // Advanced operations
  RBF: `${API_BASE}/transactions/rbf`,                 // GET - Get RBF transactions
  CPFP: `${API_BASE}/transactions/cpfp`,               // GET - Get CPFP transactions
  OP_RETURN: `${API_BASE}/transactions/op-return`      // GET - Get OP_RETURN transactions
} as const;

// ============================================================================
// ADDRESS ENDPOINTS
// ============================================================================

export const ADDRESS_ENDPOINTS = {
  // Core address operations
  INFO: `${API_BASE}/addresses/:addr`,                 // GET - Get address info
  BALANCE: `${API_BASE}/addresses/:addr/balance`,      // GET - Get address balance
  UTXOS: `${API_BASE}/addresses/:addr/utxos`,          // GET - Get address UTXOs
  HISTORY: `${API_BASE}/addresses/:addr/history`,      // GET - Get address history
  
  // Address-specific operations
  TRANSACTIONS: `${API_BASE}/addresses/:addr/txs`,     // GET - Get address transactions
  STATS: `${API_BASE}/addresses/:addr/stats`,          // GET - Get address statistics
  CLUSTER: `${API_BASE}/addresses/:addr/cluster`       // GET - Get address clustering
} as const;

// ============================================================================
// NETWORK ENDPOINTS
// ============================================================================

export const NETWORK_ENDPOINTS = {
  // Core network operations
  STATUS: `${API_BASE}/network/status`,         // GET - Network status (future)
  HEIGHT: `${API_BASE}/network/height`,         // GET - Current tip height (MVP)
  FEES: `${API_BASE}/network/fees`,             // GET - Fee estimates
  MEMPOOL: `${API_BASE}/network/mempool`,       // GET - Mempool info
  DIFFICULTY: `${API_BASE}/network/difficulty`, // GET - Current difficulty
  
  // Network-specific operations
  HASHRATE: `${API_BASE}/network/hashrate`,     // GET - Network hashrate
  SYNC: `${API_BASE}/network/sync`,             // GET - Sync progress
  STATS: `${API_BASE}/network/stats`,           // GET - Network statistics
  HEALTH: `${API_BASE}/network/health`          // GET - Network health
} as const;

// ============================================================================
// SEARCH ENDPOINTS
// ============================================================================

export const SEARCH_ENDPOINTS = {
  // Core search operations
  QUERY: `${API_BASE}/search`,                  // GET - Search query
  SUGGESTIONS: `${API_BASE}/search/suggest`,    // GET - Search suggestions
  
  // Search-specific operations
  ADVANCED: `${API_BASE}/search/advanced`,      // POST - Advanced search
  HISTORY: `${API_BASE}/search/history`,        // GET - Search history
  POPULAR: `${API_BASE}/search/popular`         // GET - Popular searches
} as const;

// ============================================================================
// ANALYTICS ENDPOINTS
// ============================================================================

export const ANALYTICS_ENDPOINTS = {
  // Core analytics operations
  DASHBOARD: `${API_BASE}/analytics/dashboard`, // GET - Analytics dashboard
  CHARTS: `${API_BASE}/analytics/charts`,       // GET - Chart data
  
  // Analytics-specific operations
  FEES: `${API_BASE}/analytics/fees`,           // GET - Fee analytics
  VOLUME: `${API_BASE}/analytics/volume`,       // GET - Volume analytics
  ADOPTION: `${API_BASE}/analytics/adoption`    // GET - Adoption analytics
} as const;

// ============================================================================
// WEBSOCKET ENDPOINTS
// ============================================================================

export const WS_ENDPOINTS = {
  // Core WebSocket operations
  MAIN: `${BASE_URL.replace('http', 'ws')}/ws`, // WebSocket connection (ws://localhost:8000/ws)
  
  // WebSocket-specific operations
  BLOCKS: `${BASE_URL.replace('http', 'ws')}/ws/blocks`,       // Block updates
  TRANSACTIONS: `${BASE_URL.replace('http', 'ws')}/ws/txs`,    // Transaction updates
  NETWORK: `${BASE_URL.replace('http', 'ws')}/ws/network`,     // Network updates
  FEES: `${BASE_URL.replace('http', 'ws')}/ws/fees`            // Fee updates
} as const;

// ============================================================================
// HEALTH & MONITORING ENDPOINTS
// ============================================================================

export const HEALTH_ENDPOINTS = {
  // Core health operations
  STATUS: `${API_BASE}/health`,                 // GET - Health status
  READY: `${API_BASE}/health/ready`,            // GET - Ready status
  LIVE: `${API_BASE}/health/live`,              // GET - Liveness check
  
  // Health-specific operations
  METRICS: `${API_BASE}/health/metrics`,        // GET - Health metrics
  INFO: `${API_BASE}/health/info`               // GET - Health information
} as const;

// ============================================================================
// COMPOSITE API ENDPOINTS
// ============================================================================

export const API_ENDPOINTS = {
  // Group endpoints by resource
  BLOCKS: BLOCK_ENDPOINTS,
  TRANSACTIONS: TX_ENDPOINTS,
  ADDRESSES: ADDRESS_ENDPOINTS,
  NETWORK: NETWORK_ENDPOINTS,
  SEARCH: SEARCH_ENDPOINTS,
  ANALYTICS: ANALYTICS_ENDPOINTS,
  WEBSOCKET: WS_ENDPOINTS,
  HEALTH: HEALTH_ENDPOINTS
} as const;

// ============================================================================
// ENDPOINT UTILITIES
// ============================================================================

/**
 * Replace path parameters in endpoint URLs
 * @param endpoint - The endpoint template
 * @param params - Parameters to replace
 * @returns The resolved endpoint URL
 */
export const resolveEndpoint = (endpoint: string, params: Record<string, string>): string => {
  let resolved = endpoint;
  Object.entries(params).forEach(([key, value]) => {
    resolved = resolved.replace(`:${key}`, value);
  });
  return resolved;
};

/**
 * Get endpoint with path parameters resolved
 * @param endpoint - The endpoint template
 * @param params - Parameters to replace
 * @returns The resolved endpoint URL
 */
export const getEndpoint = (endpoint: string, params: Record<string, string> = {}): string => {
  return resolveEndpoint(endpoint, params);
};

// ============================================================================
// BACKWARD COMPATIBILITY (DEPRECATED)
// ============================================================================

/** @deprecated Use API_ENDPOINTS.BLOCKS.LIST instead */
export const GET_BLOCKS = API_ENDPOINTS.BLOCKS.LIST;
/** @deprecated Use API_ENDPOINTS.TRANSACTIONS.BY_ID instead */
export const GET_TRANSACTION = API_ENDPOINTS.TRANSACTIONS.BY_ID;
/** @deprecated Use API_ENDPOINTS.ADDRESSES.INFO instead */
export const GET_ADDRESS = API_ENDPOINTS.ADDRESSES.INFO;
/** @deprecated Use API_ENDPOINTS.NETWORK.STATUS instead */
export const GET_NETWORK_STATUS = API_ENDPOINTS.NETWORK.STATUS;
/** @deprecated Use API_ENDPOINTS.NETWORK.FEES instead */
export const GET_FEE_ESTIMATES = API_ENDPOINTS.NETWORK.FEES;
