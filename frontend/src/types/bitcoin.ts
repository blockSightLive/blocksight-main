/**
 * @fileoverview Bitcoin type definitions and interfaces for the BlockSight.live application
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-19
 * @lastModified 2025-08-23
 * 
 * @description
 * Comprehensive TypeScript type definitions for Bitcoin blockchain entities including
 * blocks, transactions, addresses, UTXOs, and network status. These types implement
 * the Bitcoin data models from the roadmap and ensure type safety across the application.
 * 
 * @dependencies
 * - TypeScript strict mode
 * - React types for context integration
 * - Bitcoin protocol specifications
 * - Electrum API response types
 * - BIP standards (BIP32, BIP39, BIP44, BIP84, BIP86)
 * - Lightning Network specifications
 * 
 * @usage
 * Provides type safety for all Bitcoin-related data structures in the application
 * 
 * @state
 * 🔄 In Development - Enhanced with BIP types and validation schemas
 * 
 * @bugs
 * - Validation schemas need integration with runtime validation library
 * - BIP types need testing with real wallet implementations
 * 
 * @todo
 * - [HIGH] Integrate validation schemas with runtime validation (zod/joi)
 * - [HIGH] Test BIP types with real wallet implementations
 * - [MEDIUM] Add more Bitcoin script type definitions for advanced scripts
 * - [MEDIUM] Implement validation schemas for data integrity
 * - [LOW] Add BIP-specific types for future protocol upgrades
 * - [LOW] Add Lightning Network type definitions
 * 
 * @mockData
 * - No mock data in types file - types are pure interfaces
 * 
 * @performance
 * - Efficient type checking
 * - Minimal runtime overhead
 * 
 * @security
 * - Type-safe Bitcoin address handling
 * - Validation-ready data structures
 * - BIP-compliant wallet path structures
 * 
 * @styling
 * - No styling needed (pure TypeScript file)
 */

import React from 'react';

// Bitcoin Script Types (from roadmap MVP features)
export enum ScriptType {
  P2PKH = 'P2PKH',           // Legacy Pay-to-Public-Key-Hash
  P2SH = 'P2SH',             // Pay-to-Script-Hash (including nested SegWit)
  P2WPKH = 'P2WPKH',         // Native SegWit Pay-to-Witness-Public-Key-Hash
  P2WSH = 'P2WSH',           // Native SegWit Pay-to-Witness-Script-Hash
  P2TR = 'P2TR',             // Taproot Pay-to-Taproot
  MULTISIG = 'MULTISIG',     // Multi-signature scripts
  OP_RETURN = 'OP_RETURN',   // Data carrier scripts
  UNKNOWN = 'UNKNOWN'        // Unknown or custom scripts
}

// Bitcoin Network Status (from roadmap MVP features)
export enum NetworkLoad {
  BELOW_AVERAGE = 'Below Average',
  NEUTRAL = 'Neutral',
  LOAD = 'Load',
  EXTREME_LOAD = 'Extreme Load'
}

// Bitcoin Block Status (from roadmap MVP features)
export enum BlockStatus {
  UNCONFIRMED = 'unconfirmed',
  AWAITING = 'awaiting',
  CONFIRMED = 'confirmed'
}

// BIP32 Hierarchical Deterministic Wallet Types
export interface BIP32Path {
  purpose: number      // BIP purpose (44 for BIP44, 84 for BIP84, 86 for BIP86)
  coinType: number     // 0 for Bitcoin, 1 for Bitcoin Testnet
  account: number      // Account index
  change: number       // 0 for external chain, 1 for internal chain
  addressIndex: number // Address index within the chain
}

export interface BIP32Key {
  publicKey: string
  privateKey?: string
  chainCode: string
  fingerprint: string
  depth: number
  index: number
  path: BIP32Path
}

// BIP39 Mnemonic Types
export interface BIP39Mnemonic {
  words: string[]
  entropy: string
  seed: string
  passphrase?: string
  language: 'english' | 'spanish' | 'french' | 'italian' | 'portuguese' | 'japanese' | 'korean' | 'chinese_simplified' | 'chinese_traditional'
  strength: 128 | 160 | 192 | 224 | 256 // bits
}

// BIP44/BIP84/BIP86 Wallet Types
export interface BIP44Wallet {
  purpose: 44
  scriptType: ScriptType.P2PKH | ScriptType.P2SH
  derivationPath: string
  addresses: BitcoinAddress[]
}

export interface BIP84Wallet {
  purpose: 84
  scriptType: ScriptType.P2WPKH
  derivationPath: string
  addresses: BitcoinAddress[]
}

export interface BIP86Wallet {
  purpose: 86
  scriptType: ScriptType.P2TR
  derivationPath: string
  addresses: BitcoinAddress[]
}

export type BitcoinWallet = BIP44Wallet | BIP84Wallet | BIP86Wallet

// Lightning Network Types
export interface LightningNode {
  pubkey: string
  alias: string
  color: string
  lastUpdate: number
  addresses: LightningAddress[]
  features: LightningFeature[]
}

export interface LightningChannel {
  channelId: string
  capacity: number
  node1Pubkey: string
  node2Pubkey: string
  node1Policy?: LightningPolicy
  node2Policy?: LightningPolicy
  lastUpdate: number
  status: 'OPEN' | 'CLOSING' | 'CLOSED'
}

export interface LightningAddress {
  type: 'ipv4' | 'ipv6' | 'torv2' | 'torv3'
  address: string
  port: number
}

export interface LightningFeature {
  name: string
  isRequired: boolean
  isSupported: boolean
}

export interface LightningPolicy {
  feeBaseMsat: number
  feeRateMilliMsat: number
  disabled: boolean
  minHtlcMsat: number
  maxHtlcMsat: number
  timeLockDelta: number
}

// Bitcoin Block Interface
export interface BitcoinBlock {
  hash: string
  height: number
  timestamp: number
  size: number
  weight: number
  transactionCount: number
  feeRange: {
    min: number
    max: number
    average: number
  }
  scriptTypeBreakdown: Record<ScriptType, number>
  status: BlockStatus
  confirmations: number
  previousHash: string
  nextHash?: string
  merkleRoot: string
  difficulty: number
  nonce: number
  bits: string
  version: number
}

// Bitcoin Transaction Interface
export interface BitcoinTransaction {
  txid: string
  blockHash?: string
  blockHeight?: number
  timestamp: number
  confirmations: number
  size: number
  weight: number
  fee: number
  feeRate: number // sats/vB
  inputs: BitcoinInput[]
  outputs: BitcoinOutput[]
  isRBF: boolean
  isCoinbase: boolean
  locktime: number
  version: number
}

// Bitcoin Input Interface
export interface BitcoinInput {
  txid: string
  vout: number
  scriptSig: {
    asm: string
    hex: string
  }
  sequence: number
  witness?: string[]
  value: number
  address: string
  scriptType: ScriptType
}

// Bitcoin Output Interface
export interface BitcoinOutput {
  value: number
  n: number
  scriptPubKey: {
    asm: string
    hex: string
    type: ScriptType
    addresses: string[]
  }
  spent: boolean
  spentTxid?: string
  spentHeight?: number
}

// Bitcoin Address Interface
export interface BitcoinAddress {
  address: string
  scriptType: ScriptType
  balance: {
    confirmed: number
    unconfirmed: number
    total: number
  }
  transactionCount: number
  received: number
  sent: number
  firstSeen: number
  lastSeen: number
  utxoCount: number
  confidence: number // 0-1 score for address clustering
}

// Bitcoin UTXO Interface
export interface BitcoinUTXO {
  txid: string
  vout: number
  value: number
  scriptPubKey: {
    asm: string
    hex: string
    type: ScriptType
    addresses: string[]
  }
  confirmations: number
  blockHeight: number
  blockHash: string
  spendable: boolean
  solvable: boolean
  safe: boolean
}

// Bitcoin Fee Estimates Interface (from roadmap MVP features)
export interface BitcoinFeeEstimates {
  fast: number      // Next block (sats/vB)
  medium: number    // 6 blocks (sats/vB)
  slow: number      // 24 blocks (sats/vB)
  lastUpdated: number
  confidence: number
  // Additional fields for future use
  timestamp?: number
  mempoolSize?: number
  pendingCount?: number
  confirmationTimes?: {
    fast: number    // Minutes
    medium: number  // Minutes
    slow: number    // Minutes
  }
}

// Bitcoin Network Status Interface (from roadmap MVP features)
export interface BitcoinNetworkStatus {
  isOnline: boolean
  lastBlockHeight: number
  lastBlockTime: number
  syncProgress: number
  mempoolSize: number
  networkDifficulty: string
  averageBlockTime: number
  lastUpdated: number
  // Additional fields for future use
  load?: NetworkLoad
  pendingTransactions?: number
  difficulty?: number
  hashrate?: number
  nextDifficultyAdjustment?: number
  segwitAdoption?: number
  rbfUsage?: number
}

// Bitcoin Price Data Interface (from roadmap MVP features)
export interface BitcoinPriceData {
  usd: number
  change24h: number
  change7d: number
  change30d: number
  timestamp: number
}

export interface PriceUSD {
  currency: 'BTC'
  fiat: 'USD'
  value: number
  asOfMs: number
  provider: string
}

export interface FxRatesUSD {
  base: 'USD'
  rates: Record<string, number>
  asOfMs: number
  provider: string
}

// Bitcoin Search Result Interface
export interface BitcoinSearchResult {
  type: 'block' | 'transaction' | 'address'
  data: BitcoinBlock | BitcoinTransaction | BitcoinAddress
  relevance: number
  timestamp: number
}

// Bitcoin Context State Interface (for React context)
export interface BitcoinContextState {
  state: BitcoinState
  dispatch: React.Dispatch<BitcoinAction>
  actions: Record<string, unknown> // Will be properly typed when imported
  selectors: Record<string, unknown> // Will be properly typed when imported
}

// Bitcoin State Interface (for React context and reducer)
export interface BitcoinState {
  // Core Bitcoin Data
  blocks: BitcoinBlock[]
  transactions: BitcoinTransaction[]
  addresses: BitcoinAddress[]
  utxos: BitcoinUTXO[]
  
  // Network & Status
  networkStatus: BitcoinNetworkStatus
  feeEstimates: BitcoinFeeEstimates
  
  // Price & FX Data
  priceUSD: PriceUSD | null
  fx: FxRatesUSD | null
  
  // Search & Filtering
  searchResults: BitcoinSearchResult[]
  searchQuery: string
  searchFilters: {
    type: 'all' | 'block' | 'transaction' | 'address'
    dateRange: '1h' | '24h' | '7d' | '30d' | '1y'
    minAmount: number
    maxAmount: number
    confirmed: boolean
  }
  
  // UI State
  ui: {
    isLoading: boolean
    loadingStates: {
      blocks: boolean
      transactions: boolean
      addresses: boolean
      search: boolean
    }
    error: string | null
    selectedBlock: BitcoinBlock | null
    selectedTransaction: BitcoinTransaction | null
    selectedAddress: BitcoinAddress | null
    viewMode: 'grid' | 'list' | 'detail'
    sortBy: string
    sortOrder: 'asc' | 'desc'
  }
  
  // Caching & Performance
  cache: {
    blockCache: Map<string, BitcoinBlock>
    transactionCache: Map<string, BitcoinTransaction>
    addressCache: Map<string, BitcoinAddress>
    lastCacheCleanup: number
    cacheHits: number
    cacheMisses: number
  }
  
  // Undo/Redo System
  undoRedo: UndoRedoState
  
  // Real-time Updates
  realtime: {
    lastWebSocketUpdate: number | null
    pendingUpdates: unknown[]
    updateQueue: unknown[]
    isConnected: boolean
    connectionStatus: 'connected' | 'disconnected' | 'connecting'
  }
  
  // User Preferences
  preferences: {
    autoRefresh: boolean
    refreshInterval: number
    showUnconfirmed: boolean
    defaultCurrency: string
    theme: string
    language: string
  }
  
  // Analytics & Metrics
  metrics: {
    totalRequests: number
    successfulRequests: number
    failedRequests: number
    averageResponseTime: number
    lastMetricsReset: number
  }
}

// Undo/Redo State Interface
export interface UndoRedoState {
  history: BitcoinState[]
  currentIndex: number
  maxHistory: number
  isUndoRedoAction: boolean
}

// Bitcoin Action Types Constants
export const BitcoinActionTypes = {
  // Data Actions
  SET_BLOCKS: 'SET_BLOCKS',
  ADD_BLOCK: 'ADD_BLOCK',
  UPDATE_BLOCK: 'UPDATE_BLOCK',
  REMOVE_BLOCK: 'REMOVE_BLOCK',
  
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  REMOVE_TRANSACTION: 'REMOVE_TRANSACTION',
  
  SET_ADDRESSES: 'SET_ADDRESSES',
  ADD_ADDRESS: 'ADD_ADDRESS',
  UPDATE_ADDRESS: 'UPDATE_ADDRESS',
  REMOVE_ADDRESS: 'REMOVE_ADDRESS',
  
  SET_UTXOS: 'SET_UTXOS',
  ADD_UTXO: 'ADD_UTXO',
  UPDATE_UTXO: 'UPDATE_UTXO',
  REMOVE_UTXO: 'REMOVE_UTXO',
  
  // Network Actions
  SET_NETWORK_STATUS: 'SET_NETWORK_STATUS',
  UPDATE_NETWORK_STATUS: 'UPDATE_NETWORK_STATUS',
  
  // Fee Actions
  SET_FEE_ESTIMATES: 'SET_FEE_ESTIMATES',
  UPDATE_FEE_ESTIMATES: 'UPDATE_FEE_ESTIMATES',
  
  // Price & FX Actions
  SET_PRICE_USD: 'SET_PRICE_USD',
  UPDATE_PRICE_USD: 'UPDATE_PRICE_USD',
  SET_FX_RATES: 'SET_FX_RATES',
  UPDATE_FX_RATES: 'UPDATE_FX_RATES',
  
  // Search Actions
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_SEARCH_FILTERS: 'SET_SEARCH_FILTERS',
  CLEAR_SEARCH: 'CLEAR_SEARCH',
  
  // UI Actions
  SET_LOADING: 'SET_LOADING',
  SET_LOADING_STATE: 'SET_LOADING_STATE',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SELECT_BLOCK: 'SELECT_BLOCK',
  SELECT_TRANSACTION: 'SELECT_TRANSACTION',
  SELECT_ADDRESS: 'SELECT_ADDRESS',
  SET_VIEW_MODE: 'SET_VIEW_MODE',
  SET_SORT: 'SET_SORT',
  
  // Cache Actions
  CLEAR_CACHE: 'CLEAR_CACHE',
  UPDATE_CACHE_STATS: 'UPDATE_CACHE_STATS',
  
  // Undo/Redo Actions
  UNDO: 'UNDO',
  REDO: 'REDO',
  SAVE_STATE: 'SAVE_STATE',
  
  // Real-time Actions
  SET_WEBSOCKET_STATUS: 'SET_WEBSOCKET_STATUS',
  ADD_PENDING_UPDATE: 'ADD_PENDING_UPDATE',
  PROCESS_UPDATE_QUEUE: 'PROCESS_UPDATE_QUEUE',
  
  // Preference Actions
  SET_PREFERENCE: 'SET_PREFERENCE',
  SET_PREFERENCES: 'SET_PREFERENCES',
  
  // Metrics Actions
  UPDATE_METRICS: 'UPDATE_METRICS',
  RESET_METRICS: 'RESET_METRICS',
  
  // Batch Actions
  BATCH_UPDATE: 'BATCH_UPDATE',
  RESET_STATE: 'RESET_STATE'
} as const;

// Bitcoin Action Types (for React reducer)
export type BitcoinAction =
  // Block Actions
  | { type: 'BLOCKS_UPDATE'; payload: BitcoinBlock[] }
  | { type: 'BLOCK_NEW'; payload: BitcoinBlock }
  | { type: 'BLOCK_UPDATE'; payload: BitcoinBlock }
  | { type: 'BLOCK_REMOVE'; payload: string }
  
  // Transaction Actions
  | { type: 'TXS_UPDATE'; payload: BitcoinTransaction[] }
  | { type: 'TX_NEW'; payload: BitcoinTransaction }
  | { type: 'TX_UPDATE'; payload: BitcoinTransaction }
  | { type: 'TX_MEMPOOL'; payload: BitcoinTransaction }
  | { type: 'TX_CONFIRMED'; payload: BitcoinTransaction }
  
  // Address Actions
  | { type: 'ADDRESSES_UPDATE'; payload: BitcoinAddress[] }
  | { type: 'ADDRESS_NEW'; payload: BitcoinAddress }
  | { type: 'ADDRESS_UPDATE'; payload: BitcoinAddress }
  | { type: 'ADDRESS_BALANCE'; payload: { address: string; balance: BitcoinAddress['balance'] } }
  
  // UTXO Actions
  | { type: 'SET_UTXOS'; payload: BitcoinUTXO[] }
  | { type: 'ADD_UTXO'; payload: BitcoinUTXO }
  | { type: 'UPDATE_UTXO'; payload: { utxoId: string; updates: Partial<BitcoinUTXO> } }
  | { type: 'REMOVE_UTXO'; payload: string }
  
  // Network Actions
  | { type: 'NETWORK_STATUS'; payload: BitcoinNetworkStatus }
  | { type: 'NETWORK_ONLINE'; payload: boolean }
  | { type: 'NETWORK_DIFFICULTY'; payload: number }
  | { type: 'NETWORK_HASHRATE'; payload: number }
  
  // Fee Actions
  | { type: 'FEES_UPDATE'; payload: BitcoinFeeEstimates }
  | { type: 'FEES_MEMPOOL'; payload: Partial<BitcoinFeeEstimates> }
  | { type: 'FEES_CONFIRMED'; payload: Partial<BitcoinFeeEstimates> }
  
  // Price & FX Actions
  | { type: 'PRICE_UPDATE'; payload: PriceUSD }
  | { type: 'FX_UPDATE'; payload: FxRatesUSD }
  
  // Search Actions
  | { type: 'SEARCH_QUERY'; payload: string }
  | { type: 'SEARCH_RESULTS'; payload: BitcoinSearchResult[] }
  | { type: 'SEARCH_FILTERS'; payload: Partial<BitcoinState['searchFilters']> }
  | { type: 'SEARCH_CLEAR' }
  
  // UI Actions
  | { type: 'UI_LOADING'; payload: boolean }
  | { type: 'UI_ERROR'; payload: string | null }
  | { type: 'UI_CLEAR_ERROR' }
  | { type: 'UI_SELECT_BLOCK'; payload: BitcoinBlock | null }
  | { type: 'UI_SELECT_TX'; payload: BitcoinTransaction | null }
  | { type: 'UI_SELECT_ADDRESS'; payload: BitcoinAddress | null }
  | { type: 'UI_VIEW_MODE'; payload: 'grid' | 'list' | 'detail' }
  | { type: 'UI_SORT'; payload: { sortBy: string; sortOrder: 'asc' | 'desc' } }
  
  // Cache Actions
  | { type: 'CACHE_CLEAR' }
  | { type: 'CACHE_STATS'; payload: { hits: number; misses: number } }
  
  // Undo/Redo Actions
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SAVE_STATE' }
  
  // WebSocket Actions
  | { type: 'WS_CONNECT'; payload: { status: 'connected' | 'disconnected' | 'connecting' } }
  | { type: 'WS_MESSAGE'; payload: unknown }
  | { type: 'WS_ERROR'; payload: string }
  
  // Preference Actions
  | { type: 'PREF_UPDATE'; payload: { key: keyof BitcoinState['preferences']; value: unknown } }
  | { type: 'PREFS_UPDATE'; payload: Partial<BitcoinState['preferences']> }
  
  // Metrics Actions
  | { type: 'METRICS_UPDATE'; payload: Partial<BitcoinState['metrics']> }
  | { type: 'METRICS_RESET' }
  
  // Utility Actions
  | { type: 'RESET_STATE' }
  | { type: 'BATCH_UPDATE'; payload: BitcoinAction[] }

// Bitcoin API Response Types
export interface BitcoinAPIResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: number
}

// Bitcoin WebSocket Event Types
export interface BitcoinWebSocketEvent {
  // Event type identifiers, e.g., 'tip.height', 'block.new', 'network.status'
  type: string
  data: unknown
  timestamp: number
}

// Bitcoin Validation Types
export interface BitcoinValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  confidence: number
}

// Bitcoin Cache Types
export interface BitcoinCacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  key: string
}

// Validation Schema Types (for runtime validation)
export interface BitcoinValidationSchema {
  validateBlock: (data: unknown) => BitcoinValidationResult
  validateTransaction: (data: unknown) => BitcoinValidationResult
  validateAddress: (data: unknown) => BitcoinValidationResult
  validateUTXO: (data: unknown) => BitcoinValidationResult
  validateFeeEstimates: (data: unknown) => BitcoinValidationResult
  validateNetworkStatus: (data: unknown) => BitcoinValidationResult
  validatePriceData: (data: unknown) => BitcoinValidationResult
}

// BIP Path Validation
export interface BIPPathValidation {
  isValidPath: (path: string) => boolean
  parsePath: (path: string) => BIP32Path | null
  formatPath: (path: BIP32Path) => string
  validatePurpose: (purpose: number) => boolean
  validateCoinType: (coinType: number) => boolean
}

// Lightning Network Validation
export interface LightningValidation {
  validateNodePubkey: (pubkey: string) => boolean
  validateChannelId: (channelId: string) => boolean
  validateInvoice: (invoice: string) => boolean
  validatePaymentRequest: (request: string) => boolean
}
