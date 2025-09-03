/**
 * @fileoverview Orchestrator TypeScript types for BlockSight.live
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-31
 * @lastModified 2025-08-31
 * 
 * @description
 * TypeScript type definitions for the MainOrchestrator context system.
 * Defines interfaces for context plugins, orchestration strategies, and cache strategies.
 * 
 * @dependencies
 * - TypeScript interfaces and enums
 * - WebSocket event types
 * - Performance monitoring types
 * 
 * @usage
 * Import types for orchestrator implementation and plugin development
 * 
 * @state
 * ✅ Complete - All orchestrator types defined
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum OrchestrationStrategy {
  REACTIVE = 'reactive',           // React to events as they happen
  PROACTIVE = 'proactive',         // Predict and prepare for events
  BATCH = 'batch',                 // Process events in batches
  STREAMING = 'streaming',         // Process events as streams
  HYBRID = 'hybrid'                // Combination of strategies
}

export enum CacheStrategy {
  TTL = 'ttl',                     // Time-based expiration
  LRU = 'lru',                     // Least recently used
  LFU = 'lfu',                     // Least frequently used
  ADAPTIVE = 'adaptive',           // Dynamic strategy selection
  NONE = 'none'                    // No caching
}

export enum PluginStatus {
  UNREGISTERED = 'unregistered',
  REGISTERING = 'registering',
  REGISTERED = 'registered',
  INITIALIZING = 'initializing',
  ACTIVE = 'active',
  ERROR = 'error',
  CLEANING_UP = 'cleaning_up'
}

export enum WebSocketEventType {
  TIP_HEIGHT = 'tip.height',
  NETWORK_MEMPOOL = 'network.mempool',
  NETWORK_FEES = 'network.fees',
  CHAIN_REORG = 'chain.reorg',
  PRICE_CURRENT = 'price.current',
  FX_RATES = 'fx.rates',
  BLOCKCHAIN_INFO = 'blockchain.info',
  BLOCKCHAIN_NETWORK = 'blockchain.network',
  BLOCKCHAIN_MINING = 'blockchain.mining',
  CUSTOM = 'custom'
}

// ============================================================================
// INTERFACES
// ============================================================================

export interface WebSocketEvent {
  type: WebSocketEventType | string
  data: Record<string, unknown>
  timestamp: number
  source?: string
  correlationId?: string
}

// Blockchain data payloads (matching backend types)
export interface BlockchainInfoPayload {
  chain: string
  blocks: number
  headers: number
  bestblockhash: string
  difficulty: number
  mediantime: number
  verificationprogress: number
  chainwork: string
  pruned: boolean
  initialblockdownload: boolean
  size_on_disk: number
  warnings: string
}

export interface BlockchainNetworkPayload {
  version: number
  subversion: string
  protocolversion: number
  localservices: string
  localservicesnames: string[]
  localrelay: boolean
  timeoffset: number
  networkactive: boolean
  connections: number
  connections_in: number
  connections_out: number
  networks: Array<{
    name: string
    limited: boolean
    reachable: boolean
    proxy: string
    proxy_randomize_credentials: boolean
  }>
  relayfee: number
  incrementalfee: number
  localaddresses: Array<{
    address: string
    port: number
    score: number
  }>
  warnings: string
}

export interface BlockchainMiningPayload {
  blocks: number
  currentblockweight?: number
  currentblocktx?: number
  difficulty: number
  networkhashps: number
  pooledtx: number
  chain: string
  warnings: string
}

export interface ContextPlugin {
  id: string
  name: string
  version: string
  description: string
  status: PluginStatus
  
  // Lifecycle methods
  init?: () => Promise<boolean>
  cleanup?: () => void
  
  // Data management
  refresh?: () => Promise<boolean>
  sync?: () => Promise<boolean>
  
  // WebSocket integration
  onWebSocketMessage?: (message: Record<string, unknown>) => void
  canHandleEvent?: (eventType: string) => boolean
  
  // Strategy management
  onStrategyChange?: (strategy: OrchestrationStrategy) => void
  onCacheStrategyChange?: (strategy: CacheStrategy) => void
  
  // Performance monitoring
  getPerformanceMetrics?: () => Record<string, unknown>
  resetPerformanceMetrics?: () => void
  
  // Error handling
  getErrors?: () => OrchestratorError[]
  clearErrors?: () => void
  
  // Metadata
  metadata?: Record<string, unknown>
  dependencies?: string[]
  capabilities?: string[]
}

export interface OrchestratorState {
  // Plugin management
  plugins: {
    registered: string[]
    active: string[]
    errors: Record<string, OrchestratorError[]>
    status: Record<string, PluginStatus>
  }
  
  // WebSocket state
  websocket: {
    connected: boolean
    lastConnected: number | null
    lastDisconnected: number | null
    reconnectAttempts: number
    lastMessage: WebSocketEvent | null
    messageCount: number
  }
  
  // Cache state
  cache: {
    strategy: Record<string, CacheStrategy>
    stats: Record<string, unknown>
    lastCleanup: number
  }
  
  // Performance state
  performance: {
    lastMetrics: Record<string, unknown>
    lastReset: number
    alerts: OrchestratorError[]
  }
  
  // System state
  system: {
    initialized: boolean
    initializationTime: number | null
    lastSync: number | null
    health: 'healthy' | 'degraded' | 'unhealthy'
  }
  
  // UI state
  ui: {
    loading: boolean
    error: string | null
    lastUpdate: number
  }
}

// ============================================================================
// ACTION PAYLOAD TYPES
// ============================================================================

export interface PluginRegisteredPayload {
  pluginId: string
  timestamp: number
}

export interface PluginUnregisteredPayload {
  pluginId: string
  timestamp: number
}

export interface PluginStatusChangedPayload {
  pluginId: string
  status: PluginStatus
  timestamp: number
}

export interface PluginErrorPayload {
  pluginId: string
  error: OrchestratorError
  timestamp: number
}

export interface PluginErrorClearedPayload {
  pluginId: string
  timestamp: number
}

export interface WebSocketConnectedPayload {
  timestamp: number
}

export interface WebSocketDisconnectedPayload {
  timestamp: number
}

export interface WebSocketMessageReceivedPayload {
  message: unknown
  timestamp: number
}

export interface WebSocketReconnectAttemptPayload {
  attempt: number
  timestamp: number
}

export interface CacheStrategyChangedPayload {
  contextId: string
  strategy: CacheStrategy
  timestamp: number
}

export interface CacheStatsUpdatedPayload {
  stats: Record<string, unknown>
  timestamp: number
}

export interface CacheCleanedPayload {
  contextId?: string
  timestamp: number
}

export interface PerformanceMetricsUpdatedPayload {
  metrics: PerformanceMetrics
  timestamp: number
}

export interface PerformanceAlertPayload {
  alert: PerformanceAlert
  timestamp: number
}

export interface PerformanceMetricsResetPayload {
  timestamp: number
}

export interface SystemInitializedPayload {
  timestamp: number
}

export interface SystemSyncPayload {
  timestamp: number
}

export interface SystemHealthChangedPayload {
  health: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: number
}

export interface UILoadingPayload {
  loading: boolean
  timestamp: number
}

export interface UIErrorPayload {
  error: string
  timestamp: number
}

export interface UIErrorClearedPayload {
  timestamp: number
}

export interface UIUpdatedPayload {
  updates: Record<string, unknown>
  timestamp: number
}

export interface InitializationCompletePayload {
  timestamp: number
  enabledPlugins: string[]
}

export interface InitializationFailedPayload {
  error: string
  timestamp: number
}

// ============================================================================
// DISCRIMINATED UNION ACTION TYPES
// ============================================================================

export type OrchestratorAction =
  // Plugin management
  | { type: 'PLUGIN_REGISTERED'; payload: PluginRegisteredPayload; timestamp?: number; correlationId?: string }
  | { type: 'PLUGIN_UNREGISTERED'; payload: PluginUnregisteredPayload; timestamp?: number; correlationId?: string }
  | { type: 'PLUGIN_STATUS_CHANGED'; payload: PluginStatusChangedPayload; timestamp?: number; correlationId?: string }
  | { type: 'PLUGIN_ERROR'; payload: PluginErrorPayload; timestamp?: number; correlationId?: string }
  | { type: 'PLUGIN_ERROR_CLEARED'; payload: PluginErrorClearedPayload; timestamp?: number; correlationId?: string }
  
  // WebSocket management
  | { type: 'WEBSOCKET_CONNECTED'; payload: WebSocketConnectedPayload; timestamp?: number; correlationId?: string }
  | { type: 'WEBSOCKET_DISCONNECTED'; payload: WebSocketDisconnectedPayload; timestamp?: number; correlationId?: string }
  | { type: 'WEBSOCKET_MESSAGE_RECEIVED'; payload: WebSocketMessageReceivedPayload; timestamp?: number; correlationId?: string }
  | { type: 'WEBSOCKET_RECONNECT_ATTEMPT'; payload: WebSocketReconnectAttemptPayload; timestamp?: number; correlationId?: string }
  
  // Cache management
  | { type: 'CACHE_STRATEGY_CHANGED'; payload: CacheStrategyChangedPayload; timestamp?: number; correlationId?: string }
  | { type: 'CACHE_STATS_UPDATED'; payload: CacheStatsUpdatedPayload; timestamp?: number; correlationId?: string }
  | { type: 'CACHE_CLEANED'; payload: CacheCleanedPayload; timestamp?: number; correlationId?: string }
  
  // Performance management
  | { type: 'PERFORMANCE_METRICS_UPDATED'; payload: PerformanceMetricsUpdatedPayload; timestamp?: number; correlationId?: string }
  | { type: 'PERFORMANCE_ALERT'; payload: PerformanceAlertPayload; timestamp?: number; correlationId?: string }
  | { type: 'PERFORMANCE_METRICS_RESET'; payload: PerformanceMetricsResetPayload; timestamp?: number; correlationId?: string }
  
  // System management
  | { type: 'SYSTEM_INITIALIZED'; payload: SystemInitializedPayload; timestamp?: number; correlationId?: string }
  | { type: 'SYSTEM_SYNC'; payload: SystemSyncPayload; timestamp?: number; correlationId?: string }
  | { type: 'SYSTEM_HEALTH_CHANGED'; payload: SystemHealthChangedPayload; timestamp?: number; correlationId?: string }
  
  // UI management
  | { type: 'UI_LOADING'; payload: UILoadingPayload; timestamp?: number; correlationId?: string }
  | { type: 'UI_ERROR'; payload: UIErrorPayload; timestamp?: number; correlationId?: string }
  | { type: 'UI_ERROR_CLEARED'; payload: UIErrorClearedPayload; timestamp?: number; correlationId?: string }
  | { type: 'UI_UPDATED'; payload: UIUpdatedPayload; timestamp?: number; correlationId?: string }
  
  // Initialization
  | { type: 'INITIALIZATION_COMPLETE'; payload: InitializationCompletePayload; timestamp?: number; correlationId?: string }
  | { type: 'INITIALIZATION_FAILED'; payload: InitializationFailedPayload; timestamp?: number; correlationId?: string }

// ============================================================================
// PLUGIN-SPECIFIC INTERFACES
// ============================================================================

export interface BlockchainPlugin extends ContextPlugin {
  id: 'blockchain'
  name: 'Blockchain Context'
  
  // Blockchain-specific methods
  getBlockHeight?: () => Promise<number>
  getMempoolInfo?: () => Promise<Record<string, unknown>>
  getBlockData?: (height: number) => Promise<Record<string, unknown>>
  getTransactionData?: (txid: string) => Promise<Record<string, unknown>>
  
  // Blockchain state
  state: {
    height: number
    mempoolSize: number
    lastBlock: Record<string, unknown>
    pendingTransactions: Record<string, unknown>[]
  }
}

export interface ElectrumPlugin extends ContextPlugin {
  id: 'electrum'
  name: 'Electrum Context'
  
  // Electrum-specific methods
  getServerInfo?: () => Promise<Record<string, unknown>>
  getFeeEstimates?: () => Promise<Record<string, unknown>>
  getAddressBalance?: (address: string) => Promise<Record<string, unknown>>
  
  // Electrum state
  state: {
    connected: boolean
    serverVersion: string
    protocolVersion: string
    lastPing: number
  }
}

export interface ExternalAPIPlugin extends ContextPlugin {
  id: 'external'
  name: 'External API Context'
  
  // External API methods
  getPriceData?: () => Promise<Record<string, unknown>>
  getFXRates?: () => Promise<Record<string, unknown>>
  getMarketData?: () => Promise<Record<string, unknown>>
  
  // External API state
  state: {
    priceUSD: number | null
    fxRates: Record<string, number>
    lastPriceUpdate: number
    lastFXUpdate: number
  }
}

export interface SystemPlugin extends ContextPlugin {
  id: 'system'
  name: 'System Context'
  
  // System methods
  getHealthStatus?: () => Promise<Record<string, unknown>>
  getMetrics?: () => Promise<Record<string, unknown>>
  getConfiguration?: () => Promise<Record<string, unknown>>
  
  // System state
  state: {
    health: 'healthy' | 'degraded' | 'unhealthy'
    uptime: number
    version: string
    configuration: Record<string, unknown>
  }
}

// ============================================================================
// PERFORMANCE MONITORING TYPES
// ============================================================================

export interface PerformanceMetrics {
  // Timing metrics
  responseTime: {
    p50: number
    p95: number
    p99: number
    average: number
    min: number
    max: number
  }
  
  // Throughput metrics
  throughput: {
    requestsPerSecond: number
    eventsPerSecond: number
    cacheHitRate: number
  }
  
  // Resource metrics
  resources: {
    memoryUsage: number
    cpuUsage: number
    activeConnections: number
  }
  
  // Error metrics
  errors: {
    total: number
    rate: number
    lastError: OrchestratorError | null
  }
  
  // Custom metrics
  custom: Record<string, unknown>
}

export interface PerformanceAlert {
  id: string
  type: 'warning' | 'critical' | 'info'
  message: string
  metric: string
  currentValue: number
  threshold: number
  timestamp: number
  context: string
  severity: 'low' | 'medium' | 'high'
}

// ============================================================================
// CACHE TYPES
// ============================================================================

export interface CacheEntry<T = unknown> {
  data: T
  timestamp: number
  ttl: number
  accessCount: number
  lastAccessed: number
  metadata?: Record<string, unknown>
}

export interface CacheStats {
  totalEntries: number
  totalSize: number
  hitCount: number
  missCount: number
  hitRate: number
  averageTTL: number
  oldestEntry: number
  newestEntry: number
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface OrchestratorError {
  id: string
  type: string
  message: string
  context: string
  timestamp: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  stack?: string
  metadata?: Record<string, unknown>
  recoverable: boolean
}

export interface ErrorContext {
  pluginId?: string
  operation?: string
  correlationId?: string
  userAgent?: string
  timestamp: number
  metadata?: Record<string, unknown>
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface OrchestratorConfig {
  // Plugin configuration
  plugins: {
    enabled: string[]
    disabled: string[]
    config: Record<string, unknown>
  }
  
  // WebSocket configuration
  websocket: {
    url: string
    reconnectAttempts: number
    reconnectDelay: number
    heartbeatInterval: number
  }
  
  // Cache configuration
  cache: {
    defaultStrategy: CacheStrategy
    cleanupInterval: number
    maxSize: number
    defaultTTL: number
  }
  
  // Performance configuration
  performance: {
    metricsInterval: number
    alertThresholds: Record<string, number>
    maxAlerts: number
  }
  
  // Error handling configuration
  errorHandling: {
    maxErrorsPerContext: number
    errorRetentionPeriod: number
    autoRecovery: boolean
  }
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type PluginMap = Map<string, ContextPlugin>
export type StrategyMap = Map<string, OrchestrationStrategy>
export type CacheStrategyMap = Map<string, CacheStrategy>
export type ErrorMap = Map<string, OrchestratorError[]>

export type PluginFactory = (config: Record<string, unknown>) => ContextPlugin
export type StrategyFactory = (contextId: string) => OrchestrationStrategy
export type CacheFactory = (contextId: string) => CacheStrategy

// ============================================================================
// EXPORTS
// ============================================================================

// All types are already exported above as interfaces/enums
// No need for re-exporting as types
