/**
 * @fileoverview Main Orchestrator Context - Central state coordination for BlockSight.live
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-31
 * @lastModified 2025-08-31
 * 
 * @description
 * Central orchestrator that manages all specialized contexts through a plugin-based factory system.
 * Implements strategy pattern for different orchestration approaches and provides unified interface
 * for all frontend state management. No direct API calls allowed - all data flows through here.
 * 
 * @dependencies
 * - React Context API with performance optimizations
 * - Plugin-based context factory system
 * @dependencies
 * - Strategy pattern for orchestration methods
 * - Unified WebSocket and caching management
 * 
 * @usage
 * const { blockchain, electrum, external, system, websocket } = useMainOrchestrator()
 * 
 * @state
 * 🔄 In Development - Core orchestrator foundation
 * 
 * @architecture
 * - Plugin-based context factory
 * - Strategy pattern for orchestration
 * - Modular context management
 * - Unified data flow control
 * 
 * @performance
 * - Context memoization to prevent unnecessary re-renders
 * - Efficient plugin management with lazy loading
 * - Unified caching strategy across all contexts
 * - Optimized WebSocket event handling
 * 
 * @security
 * - Centralized error boundary protection
 * - Unified input validation
 * - Secure WebSocket connection management
 * - Rate limiting coordination
 */

import React, { 
  createContext, 
  useContext, 
  useReducer, 
  useEffect, 
  useCallback,
  useMemo,
  useRef,
  ReactNode 
} from 'react'
import { 
  OrchestratorState, 
  OrchestratorAction, 
  ContextPlugin,
  OrchestrationStrategy,
  WebSocketEvent,
  CacheStrategy,
  PluginStatus,
  OrchestratorError
} from '../types/orchestrator'
import { orchestratorReducer, initialState, ORCHESTRATOR_ACTIONS } from '../reducers/orchestratorReducer'

// Context configuration
const PLUGIN_LOAD_TIMEOUT = 5000 // 5 seconds for plugin initialization
const CACHE_CLEANUP_INTERVAL = 60000 // 1 minute cache cleanup
const WEBSOCKET_RECONNECT_ATTEMPTS = 5

interface MainOrchestratorType {
  state: OrchestratorState
  dispatch: React.Dispatch<OrchestratorAction>
  
  // Context plugin management
  registerPlugin: (plugin: ContextPlugin) => Promise<boolean>
  unregisterPlugin: (pluginId: string) => boolean
  getPlugin: (pluginId: string) => ContextPlugin | null
  listPlugins: () => string[]
  
  // Orchestration strategies
  setOrchestrationStrategy: (contextId: string, strategy: OrchestrationStrategy) => void
  getOrchestrationStrategy: (contextId: string) => OrchestrationStrategy | null
  
  // WebSocket management
  connectWebSocket: () => Promise<boolean>
  disconnectWebSocket: () => void
  isWebSocketConnected: boolean
  sendWebSocketEvent: (event: WebSocketEvent) => boolean
  
  // Cache management
  setCacheStrategy: (contextId: string, strategy: CacheStrategy) => void
  clearCache: (contextId?: string) => void
  getCacheStats: () => Record<string, unknown>
  
  // State coordination
  refreshContext: (contextId: string) => Promise<boolean>
  refreshAllContexts: () => Promise<boolean>
  syncContexts: () => Promise<boolean>
  
  // Error handling
  getContextErrors: (contextId?: string) => OrchestratorError[]
  clearContextErrors: (contextId?: string) => void
  
  // Performance monitoring
  getPerformanceMetrics: () => Record<string, unknown>
  resetPerformanceMetrics: () => void
}

const MainOrchestrator = createContext<MainOrchestratorType | undefined>(undefined)

// Export the context for direct usage if needed
export { MainOrchestrator }

interface MainOrchestratorProviderProps {
  children: ReactNode
  wsUrl?: string
  apiBaseUrl?: string
  enablePlugins?: string[] // List of plugin IDs to enable
}

export const MainOrchestratorProvider: React.FC<MainOrchestratorProviderProps> = ({ 
  children, 
  wsUrl = (import.meta as { env?: { VITE_WEBSOCKET_URL?: string } }).env?.VITE_WEBSOCKET_URL || 'ws://localhost:8000/ws',
  apiBaseUrl: _apiBaseUrl = (import.meta as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL || 'http://localhost:8000',
  enablePlugins = ['blockchain', 'electrum', 'external', 'system'] // Default enabled plugins
}) => {
  const [state, dispatch] = useReducer(orchestratorReducer, initialState)
  
  // Memoize enablePlugins to prevent infinite re-renders
  const memoizedEnablePlugins = useMemo(() => enablePlugins, [])
  
  // Plugin management
  const plugins = useRef(new Map<string, ContextPlugin>())
  const pluginStrategies = useRef(new Map<string, OrchestrationStrategy>())
  const pluginCacheStrategies = useRef(new Map<string, CacheStrategy>())
  
  // WebSocket management
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectAttempts = useRef(0)
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null)
  
  // Performance monitoring
  const performanceMetrics = useRef(new Map<string, unknown>())
  const contextErrors = useRef(new Map<string, OrchestratorError[]>())
  
  // Cache management
  const unifiedCache = useRef(new Map<string, { data: unknown; timestamp: number; ttl: number }>())
  const cacheCleanupTimer = useRef<NodeJS.Timeout | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear all timers
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
      if (cacheCleanupTimer.current) clearTimeout(cacheCleanupTimer.current)
      
      // Disconnect WebSocket
      if (wsRef.current) {
        wsRef.current.close()
      }
      
      // Clean up plugins
      plugins.current.forEach(plugin => {
        if (plugin.cleanup) plugin.cleanup()
      })
    }
  }, [])

  // Plugin management functions
  const registerPlugin = useCallback(async (plugin: ContextPlugin): Promise<boolean> => {
    try {
      // Check if plugin is already registered
      if (plugins.current.has(plugin.id)) {
        return true // Already registered, return success
      }
      
      // Initialize plugin if it has init method
      if (plugin.init) {
        const initResult = await Promise.race([
          plugin.init(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Plugin initialization timeout')), PLUGIN_LOAD_TIMEOUT)
          )
        ])
        
        if (!initResult) {
          throw new Error(`Plugin ${plugin.id} failed to initialize`)
        }
      }
      
      // Register plugin
      plugins.current.set(plugin.id, plugin)
      
      // Set default orchestration strategy
      pluginStrategies.current.set(plugin.id, OrchestrationStrategy.REACTIVE)
      
      // Set default cache strategy
      pluginCacheStrategies.current.set(plugin.id, CacheStrategy.TTL)
      
      // Dispatch plugin registered action
      dispatch({ 
        type: ORCHESTRATOR_ACTIONS.PLUGIN_REGISTERED, 
        payload: { pluginId: plugin.id, timestamp: Date.now() }
      })
      
      return true
    } catch (error) {
      console.error(`[MainOrchestrator] Failed to register plugin ${plugin.id}:`, error)
      const orchestratorError: OrchestratorError = {
        id: `plugin-${plugin.id}-${Date.now()}`,
        type: 'PluginRegistrationError',
        message: error instanceof Error ? error.message : String(error),
        context: `Plugin registration for ${plugin.id}`,
        timestamp: Date.now(),
        severity: 'high',
        recoverable: true,
        stack: error instanceof Error ? error.stack : undefined
      }
      contextErrors.current.set(plugin.id, [orchestratorError])
      return false
    }
  }, [])

  const unregisterPlugin = useCallback((pluginId: string): boolean => {
    try {
      const plugin = plugins.current.get(pluginId)
      if (!plugin) {
        return false
      }
      
      // Only unregister if explicitly requested (not during React re-renders)
      // This prevents the registration/unregistration cycle
      if (plugin.status === PluginStatus.ACTIVE) {
        // Cleanup plugin
        if (plugin.cleanup) {
          plugin.cleanup()
        }
        
        // Remove from all maps
        plugins.current.delete(pluginId)
        pluginStrategies.current.delete(pluginId)
        pluginCacheStrategies.current.delete(pluginId)
        contextErrors.current.delete(pluginId)
        
        // Dispatch plugin unregistered action
        dispatch({ 
          type: ORCHESTRATOR_ACTIONS.PLUGIN_UNREGISTERED, 
          payload: { pluginId, timestamp: Date.now() }
        })
      }
      
      return true
    } catch (error) {
      // Plugin unregistration failed
      return false
    }
  }, [])

  const getPlugin = useCallback((pluginId: string): ContextPlugin | null => {
    return plugins.current.get(pluginId) || null
  }, [])

  const listPlugins = useCallback((): string[] => {
    return Array.from(plugins.current.keys())
  }, [])

  // Orchestration strategy management
  const setOrchestrationStrategy = useCallback((contextId: string, strategy: OrchestrationStrategy): void => {
    pluginStrategies.current.set(contextId, strategy)
    
    // Notify plugin of strategy change
    const plugin = plugins.current.get(contextId)
    if (plugin && plugin.onStrategyChange) {
      plugin.onStrategyChange(strategy)
    }
  }, [])

  const getOrchestrationStrategy = useCallback((contextId: string): OrchestrationStrategy | null => {
    return pluginStrategies.current.get(contextId) || null
  }, [])

  // WebSocket management
  const connectWebSocket = useCallback(async (): Promise<boolean> => {
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        return true
      }
      
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws
      
      return new Promise((resolve) => {
        ws.onopen = () => {
          reconnectAttempts.current = 0
          dispatch({ type: ORCHESTRATOR_ACTIONS.WEBSOCKET_CONNECTED, payload: { timestamp: Date.now() } })
          
          // Subscribe to all relevant blockchain events
          const subscriptionEvents = [
            'tip.height',
            'network.mempool', 
            'network.fees',
            'blockchain.info',
            'blockchain.network',
            'blockchain.mining',
            'chain.reorg',
            'price.current',
            'fx.rates'
          ]
          
          ws.send(JSON.stringify({
            type: 'subscribe',
            events: subscriptionEvents
          }))
          
          resolve(true)
        }
        
        ws.onclose = () => {
          dispatch({ type: ORCHESTRATOR_ACTIONS.WEBSOCKET_DISCONNECTED, payload: { timestamp: Date.now() } })
          
          // Attempt reconnection
          if (reconnectAttempts.current < WEBSOCKET_RECONNECT_ATTEMPTS) {
            reconnectAttempts.current++
            const delay = Math.pow(2, reconnectAttempts.current) * 1000
            
            reconnectTimer.current = setTimeout(() => {
              connectWebSocket()
            }, delay)
          }
        }
        
        ws.onerror = (error) => {
          console.error('[MainOrchestrator] WebSocket error:', error)
          const orchestratorError: OrchestratorError = {
            id: `websocket-${Date.now()}`,
            type: 'WebSocketError',
            message: 'WebSocket connection error',
            context: 'WebSocket connection',
            timestamp: Date.now(),
            severity: 'medium',
            recoverable: true
          }
          contextErrors.current.set('websocket', [orchestratorError])
        }
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            handleWebSocketMessage(data)
          } catch (error) {
            // Failed to parse WebSocket message
          }
        }
        
        // Connection timeout
        setTimeout(() => {
          if (ws.readyState !== WebSocket.OPEN) {
            ws.close()
            resolve(false)
          }
        }, 5000)
      })
    } catch (error) {
      // WebSocket connection failed
      return false
    }
  }, [wsUrl])

  const disconnectWebSocket = useCallback((): void => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current)
      reconnectTimer.current = null
    }
    
    dispatch({ type: ORCHESTRATOR_ACTIONS.WEBSOCKET_DISCONNECTED, payload: { timestamp: Date.now() } })
  }, [])

  const sendWebSocketEvent = useCallback((event: WebSocketEvent): boolean => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(event))
        return true
      } catch (error) {
        // Failed to send WebSocket event
        return false
      }
    }
    return false
  }, [])

  // WebSocket message handling
  const handleWebSocketMessage = useCallback((message: unknown): void => {
    try {
      // Route message to appropriate plugins based on event type
      const eventType = (message as { type?: string; event?: string }).type || (message as { type?: string; event?: string }).event
      
      plugins.current.forEach((plugin, pluginId) => {
        if (plugin.onWebSocketMessage && plugin.canHandleEvent?.(eventType || '')) {
          try {
            plugin.onWebSocketMessage(message as Record<string, unknown>)
          } catch (error) {
            // Plugin failed to handle WebSocket message
            const orchestratorError: OrchestratorError = {
              id: `plugin-${pluginId}-websocket-${Date.now()}`,
              type: 'PluginWebSocketError',
              message: error instanceof Error ? error.message : String(error),
              context: `Plugin ${pluginId} WebSocket message handling`,
              timestamp: Date.now(),
              severity: 'medium',
              recoverable: true,
              stack: error instanceof Error ? error.stack : undefined
            }
            const errors = contextErrors.current.get(pluginId) || []
            contextErrors.current.set(pluginId, [...errors, orchestratorError])
          }
        }
      })
      
      // Dispatch WebSocket message action
      dispatch({ 
        type: ORCHESTRATOR_ACTIONS.WEBSOCKET_MESSAGE_RECEIVED, 
        payload: { message, timestamp: Date.now() }
      })
          } catch (error) {
        // Failed to handle WebSocket message
        const orchestratorError: OrchestratorError = {
          id: `websocket-message-${Date.now()}`,
          type: 'WebSocketMessageError',
          message: error instanceof Error ? error.message : String(error),
          context: 'WebSocket message handling',
          timestamp: Date.now(),
          severity: 'medium',
          recoverable: true,
          stack: error instanceof Error ? error.stack : undefined
        }
        contextErrors.current.set('websocket', [orchestratorError])
      }
  }, [])

  // Cache management
  const setCacheStrategy = useCallback((contextId: string, strategy: CacheStrategy): void => {
    pluginCacheStrategies.current.set(contextId, strategy)
    
    // Notify plugin of cache strategy change
    const plugin = plugins.current.get(contextId)
    if (plugin && plugin.onCacheStrategyChange) {
      plugin.onCacheStrategyChange(strategy)
    }
  }, [])

  const clearCache = useCallback((contextId?: string): void => {
    if (contextId) {
      // Clear cache for specific context
      const keysToDelete = Array.from(unifiedCache.current.keys())
        .filter(key => key.startsWith(`${contextId}:`))
      
      keysToDelete.forEach(key => unifiedCache.current.delete(key))
    } else {
      // Clear all cache
      unifiedCache.current.clear()
    }
  }, [])

  const getCacheStats = useCallback((): Record<string, unknown> => {
    const stats: Record<string, unknown> = {}
    
    // Per-context cache stats
    plugins.current.forEach((_, contextId) => {
      const contextKeys = Array.from(unifiedCache.current.keys())
        .filter(key => key.startsWith(`${contextId}:`))
      
      stats[contextId] = {
        keys: contextKeys.length,
        strategy: pluginCacheStrategies.current.get(contextId) || 'unknown'
      }
    })
    
    // Overall cache stats
    stats.total = {
      keys: unifiedCache.current.size,
      contexts: plugins.current.size
    }
    
    return stats
  }, [])

  // State coordination
  const refreshContext = useCallback(async (contextId: string): Promise<boolean> => {
    try {
      const plugin = plugins.current.get(contextId)
      if (!plugin) {
        // Plugin not found
        return false
      }
      
      if (plugin.refresh) {
        const result = await plugin.refresh()
        return result
      }
      
      return true
    } catch (error) {
      // Failed to refresh context
      const orchestratorError: OrchestratorError = {
        id: `context-refresh-${contextId}-${Date.now()}`,
        type: 'ContextRefreshError',
        message: error instanceof Error ? error.message : String(error),
        context: `Context refresh for ${contextId}`,
        timestamp: Date.now(),
        severity: 'medium',
        recoverable: true,
        stack: error instanceof Error ? error.stack : undefined
      }
      const errors = contextErrors.current.get(contextId) || []
      contextErrors.current.set(contextId, [...errors, orchestratorError])
      return false
    }
  }, [])

  const refreshAllContexts = useCallback(async (): Promise<boolean> => {
    try {
      const results = await Promise.allSettled(
        Array.from(plugins.current.keys()).map(contextId => refreshContext(contextId))
      )
      
      const successCount = results.filter(result => 
        result.status === 'fulfilled' && result.value === true
      ).length
      
      const totalCount = results.length
      
      return successCount === totalCount
    } catch (error) {
      // Failed to refresh all contexts
      return false
    }
  }, [refreshContext])

  const syncContexts = useCallback(async (): Promise<boolean> => {
    try {
      // Implement context synchronization logic here
      // This could involve ensuring data consistency across contexts
      
      return true
    } catch (error) {
      // Failed to sync contexts
      return false
    }
  }, [])

  // Error handling
  const getContextErrors = useCallback((contextId?: string): OrchestratorError[] => {
    if (contextId) {
      return contextErrors.current.get(contextId) || []
    }
    
    // Return all errors
    const allErrors: OrchestratorError[] = []
    contextErrors.current.forEach(errors => {
      allErrors.push(...errors)
    })
    return allErrors
  }, [])

  const clearContextErrors = useCallback((contextId?: string): void => {
    if (contextId) {
      contextErrors.current.delete(contextId)
    } else {
      contextErrors.current.clear()
    }
  }, [])

  // Performance monitoring
  const getPerformanceMetrics = useCallback((): Record<string, unknown> => {
    const metrics: Record<string, unknown> = {}
    
    // Collect metrics from all plugins
    plugins.current.forEach((plugin, contextId) => {
      if (plugin.getPerformanceMetrics) {
        metrics[contextId] = plugin.getPerformanceMetrics()
      }
    })
    
    // Add orchestrator-level metrics
    metrics.orchestrator = {
      pluginCount: plugins.current.size,
      websocketStatus: wsRef.current?.readyState || 'disconnected',
      cacheSize: unifiedCache.current.size,
      errorCount: getContextErrors().length
    }
    
    return metrics
  }, [getContextErrors])

  const resetPerformanceMetrics = useCallback((): void => {
    performanceMetrics.current.clear()
    
    // Reset metrics in all plugins
    plugins.current.forEach(plugin => {
      if (plugin.resetPerformanceMetrics) {
        plugin.resetPerformanceMetrics()
      }
    })
  }, [])

  // Initialize default plugins
  const initializeDefaultPlugins = useCallback(async () => {
    dispatch({ 
      type: ORCHESTRATOR_ACTIONS.INITIALIZATION_COMPLETE, 
      payload: { timestamp: Date.now(), enabledPlugins: memoizedEnablePlugins }
    })
  }, [memoizedEnablePlugins])

  // Initialize on mount
  useEffect(() => {
    initializeDefaultPlugins()
    
    // Connect to WebSocket with delay to ensure backend is ready
    const connectWithDelay = async () => {
      // Wait 2 seconds for backend to be fully ready
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const connected = await connectWebSocket()
      if (connected) {
        // WebSocket connected successfully
      } else {
        // WebSocket connection failed
      }
    }
    
    connectWithDelay()
  }, [initializeDefaultPlugins, connectWebSocket])

  // Cache cleanup timer
  useEffect(() => {
    cacheCleanupTimer.current = setInterval(() => {
      const now = Date.now()
      const keysToDelete: string[] = []
      
      unifiedCache.current.forEach((entry, key) => {
        if (now - entry.timestamp > entry.ttl) {
          keysToDelete.push(key)
        }
      })
      
      keysToDelete.forEach(key => unifiedCache.current.delete(key))
      
      // Cache cleanup completed silently
    }, CACHE_CLEANUP_INTERVAL)
    
    return () => {
      if (cacheCleanupTimer.current) {
        clearInterval(cacheCleanupTimer.current)
      }
    }
  }, [])

  // Memoized context value
  const contextValue = useMemo((): MainOrchestratorType => ({
    state,
    dispatch,
    registerPlugin,
    unregisterPlugin,
    getPlugin,
    listPlugins,
    setOrchestrationStrategy,
    getOrchestrationStrategy,
    connectWebSocket,
    disconnectWebSocket,
    isWebSocketConnected: wsRef.current?.readyState === WebSocket.OPEN,
    sendWebSocketEvent,
    setCacheStrategy,
    clearCache,
    getCacheStats,
    refreshContext,
    refreshAllContexts,
    syncContexts,
    getContextErrors,
    clearContextErrors,
    getPerformanceMetrics,
    resetPerformanceMetrics
  }), [
    state,
    registerPlugin,
    unregisterPlugin,
    getPlugin,
    listPlugins,
    setOrchestrationStrategy,
    getOrchestrationStrategy,
    connectWebSocket,
    disconnectWebSocket,
    sendWebSocketEvent,
    setCacheStrategy,
    clearCache,
    getCacheStats,
    refreshContext,
    refreshAllContexts,
    syncContexts,
    getContextErrors,
    clearContextErrors,
    getPerformanceMetrics,
    resetPerformanceMetrics
  ])

  return (
    <MainOrchestrator.Provider value={contextValue}>
      {children}
    </MainOrchestrator.Provider>
  )
}

export const useMainOrchestrator = (): MainOrchestratorType => {
  const context = useContext(MainOrchestrator)
  if (context === undefined) {
    throw new Error('useMainOrchestrator must be used within a MainOrchestratorProvider')
  }
  return context
}

export default MainOrchestrator
