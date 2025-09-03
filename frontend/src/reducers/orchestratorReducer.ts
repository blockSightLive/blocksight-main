/**
 * @fileoverview Orchestrator Reducer - State management for MainOrchestrator
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-31
 * @lastModified 2025-08-31
 * 
 * @description
 * Reducer for managing the MainOrchestrator context state.
 * Handles plugin registration, WebSocket state, cache management, and performance monitoring.
 * 
 * @dependencies
 * - OrchestratorState and OrchestratorAction types
 * - PluginStatus and other orchestrator enums
 * 
 * @usage
 * Used by MainOrchestrator context for state management
 * 
 * @state
 * ✅ Complete - Full reducer implementation
 */

import { 
  OrchestratorState, 
  OrchestratorAction, 
  PluginStatus,
  WebSocketEvent,
  OrchestratorError
} from '../types/orchestrator'

// ============================================================================
// ACTION TYPES
// ============================================================================

export const ORCHESTRATOR_ACTIONS = {
  // Plugin management
  PLUGIN_REGISTERED: 'PLUGIN_REGISTERED',
  PLUGIN_UNREGISTERED: 'PLUGIN_UNREGISTERED',
  PLUGIN_STATUS_CHANGED: 'PLUGIN_STATUS_CHANGED',
  PLUGIN_ERROR: 'PLUGIN_ERROR',
  PLUGIN_ERROR_CLEARED: 'PLUGIN_ERROR_CLEARED',
  
  // WebSocket management
  WEBSOCKET_CONNECTED: 'WEBSOCKET_CONNECTED',
  WEBSOCKET_DISCONNECTED: 'WEBSOCKET_DISCONNECTED',
  WEBSOCKET_MESSAGE_RECEIVED: 'WEBSOCKET_MESSAGE_RECEIVED',
  WEBSOCKET_RECONNECT_ATTEMPT: 'WEBSOCKET_RECONNECT_ATTEMPT',
  
  // Cache management
  CACHE_STRATEGY_CHANGED: 'CACHE_STRATEGY_CHANGED',
  CACHE_STATS_UPDATED: 'CACHE_STATS_UPDATED',
  CACHE_CLEANED: 'CACHE_CLEANED',
  
  // Performance management
  PERFORMANCE_METRICS_UPDATED: 'PERFORMANCE_METRICS_UPDATED',
  PERFORMANCE_ALERT: 'PERFORMANCE_ALERT',
  PERFORMANCE_METRICS_RESET: 'PERFORMANCE_METRICS_RESET',
  
  // System management
  SYSTEM_INITIALIZED: 'SYSTEM_INITIALIZED',
  SYSTEM_SYNC: 'SYSTEM_SYNC',
  SYSTEM_HEALTH_CHANGED: 'SYSTEM_HEALTH_CHANGED',
  
  // UI management
  UI_LOADING: 'UI_LOADING',
  UI_ERROR: 'UI_ERROR',
  UI_ERROR_CLEARED: 'UI_ERROR_CLEARED',
  UI_UPDATED: 'UI_UPDATED',
  
  // Initialization
  INITIALIZATION_COMPLETE: 'INITIALIZATION_COMPLETE',
  INITIALIZATION_FAILED: 'INITIALIZATION_FAILED'
} as const;

// ============================================================================
// INITIAL STATE
// ============================================================================

export const initialState: OrchestratorState = {
  // Plugin management
  plugins: {
    registered: [],
    active: [],
    errors: {},
    status: {}
  },
  
  // WebSocket state
  websocket: {
    connected: false,
    lastConnected: null,
    lastDisconnected: null,
    reconnectAttempts: 0,
    lastMessage: null,
    messageCount: 0
  },
  
  // Cache state
  cache: {
    strategy: {},
    stats: {},
    lastCleanup: Date.now()
  },
  
  // Performance state
  performance: {
    lastMetrics: {},
    lastReset: Date.now(),
    alerts: []
  },
  
  // System state
  system: {
    initialized: false,
    initializationTime: null,
    lastSync: null,
    health: 'unhealthy'
  },
  
  // UI state
  ui: {
    loading: false,
    error: null,
    lastUpdate: Date.now()
  }
};

// ============================================================================
// MAIN REDUCER
// ============================================================================

export function orchestratorReducer(
  state: OrchestratorState = initialState,
  action: OrchestratorAction
): OrchestratorState {
  switch (action.type) {
    // ========================================================================
    // PLUGIN MANAGEMENT ACTIONS
    // ========================================================================
    
    case ORCHESTRATOR_ACTIONS.PLUGIN_REGISTERED: {
      const { pluginId, timestamp } = action.payload
      
      return {
        ...state,
        plugins: {
          ...state.plugins,
          registered: [...state.plugins.registered, pluginId],
          status: {
            ...state.plugins.status,
            [pluginId]: PluginStatus.REGISTERED
          }
        },
        ui: {
          ...state.ui,
          lastUpdate: timestamp || Date.now()
        }
      }
    }
    
    case ORCHESTRATOR_ACTIONS.PLUGIN_UNREGISTERED: {
      const { pluginId, timestamp } = action.payload
      
      const newRegistered = state.plugins.registered.filter(id => id !== pluginId)
      const newActive = state.plugins.active.filter(id => id !== pluginId)
      const newStatus = { ...state.plugins.status }
      const newErrors = { ...state.plugins.errors }
      
      delete newStatus[pluginId]
      delete newErrors[pluginId]
      
      return {
        ...state,
        plugins: {
          ...state.plugins,
          registered: newRegistered,
          active: newActive,
          status: newStatus,
          errors: newErrors
        },
        ui: {
          ...state.ui,
          lastUpdate: timestamp || Date.now()
        }
      }
    }
    
    case ORCHESTRATOR_ACTIONS.PLUGIN_STATUS_CHANGED: {
      const { pluginId, status, timestamp } = action.payload
      
      const newActive = [...state.plugins.active]
      if (status === PluginStatus.ACTIVE && !newActive.includes(pluginId)) {
        newActive.push(pluginId)
      } else if (status !== PluginStatus.ACTIVE) {
        newActive.splice(newActive.indexOf(pluginId), 1)
      }
      
      return {
        ...state,
        plugins: {
          ...state.plugins,
          active: newActive,
          status: {
            ...state.plugins.status,
            [pluginId]: status
          }
        },
        ui: {
          ...state.ui,
          lastUpdate: timestamp || Date.now()
        }
      }
    }
    
    case ORCHESTRATOR_ACTIONS.PLUGIN_ERROR: {
      const { pluginId, error, timestamp } = action.payload
      
      const existingErrors = state.plugins.errors[pluginId] || []
      const newErrors = [...existingErrors, error]
      
      return {
        ...state,
        plugins: {
          ...state.plugins,
          errors: {
            ...state.plugins.errors,
            [pluginId]: newErrors
          },
          status: {
            ...state.plugins.status,
            [pluginId]: PluginStatus.ERROR
          }
        },
        ui: {
          ...state.ui,
          lastUpdate: timestamp || Date.now()
        }
      }
    }
    
    case ORCHESTRATOR_ACTIONS.PLUGIN_ERROR_CLEARED: {
      const { pluginId, timestamp } = action.payload
      
      const newErrors = { ...state.plugins.errors }
      delete newErrors[pluginId]
      
      return {
        ...state,
        plugins: {
          ...state.plugins,
          errors: newErrors
        },
        ui: {
          ...state.ui,
          lastUpdate: timestamp || Date.now()
        }
      }
    }
    
    // ========================================================================
    // WEBSOCKET MANAGEMENT ACTIONS
    // ========================================================================
    
    case ORCHESTRATOR_ACTIONS.WEBSOCKET_CONNECTED: {
      const { timestamp } = action.payload
      
      return {
        ...state,
        websocket: {
          ...state.websocket,
          connected: true,
          lastConnected: timestamp || Date.now(),
          reconnectAttempts: 0
        },
        ui: {
          ...state.ui,
          lastUpdate: timestamp || Date.now()
        }
      }
    }
    
    case ORCHESTRATOR_ACTIONS.WEBSOCKET_DISCONNECTED: {
      const { timestamp } = action.payload
      
      return {
        ...state,
        websocket: {
          ...state.websocket,
          connected: false,
          lastDisconnected: timestamp || Date.now()
        },
        ui: {
          ...state.ui,
          lastUpdate: timestamp || Date.now()
        }
      }
    }
    
    case ORCHESTRATOR_ACTIONS.WEBSOCKET_MESSAGE_RECEIVED: {
      const { message, timestamp } = action.payload
      
      return {
        ...state,
        websocket: {
          ...state.websocket,
          lastMessage: message as WebSocketEvent | null,
          messageCount: state.websocket.messageCount + 1
        },
        ui: {
          ...state.ui,
          lastUpdate: timestamp || Date.now()
        }
      }
    }
    
    case ORCHESTRATOR_ACTIONS.WEBSOCKET_RECONNECT_ATTEMPT: {
      const { attempt, timestamp } = action.payload
      
      return {
        ...state,
        websocket: {
          ...state.websocket,
          reconnectAttempts: attempt
        },
        ui: {
          ...state.ui,
          lastUpdate: timestamp || Date.now()
        }
      }
    }
    
    // ========================================================================
    // CACHE MANAGEMENT ACTIONS
    // ========================================================================
    
    case ORCHESTRATOR_ACTIONS.CACHE_STRATEGY_CHANGED: {
      const { contextId, strategy, timestamp } = action.payload
      
      return {
        ...state,
        cache: {
          ...state.cache,
          strategy: {
            ...state.cache.strategy,
            [contextId]: strategy
          }
        },
        ui: {
          ...state.ui,
          lastUpdate: timestamp || Date.now()
        }
      }
    }
    
    case ORCHESTRATOR_ACTIONS.CACHE_STATS_UPDATED: {
      const { stats, timestamp } = action.payload
      
      return {
        ...state,
        cache: {
          ...state.cache,
          stats
        },
        ui: {
          ...state.ui,
          lastUpdate: timestamp || Date.now()
        }
      }
    }
    
    case ORCHESTRATOR_ACTIONS.CACHE_CLEANED: {
      const { timestamp } = action.payload
      
      return {
        ...state,
        cache: {
          ...state.cache,
          lastCleanup: timestamp || Date.now()
        },
        ui: {
          ...state.ui,
          lastUpdate: timestamp || Date.now()
        }
      }
    }
    
    // ========================================================================
    // PERFORMANCE MANAGEMENT ACTIONS
    // ========================================================================
    
    case ORCHESTRATOR_ACTIONS.PERFORMANCE_METRICS_UPDATED: {
      const { metrics, timestamp } = action.payload
      
      return {
        ...state,
        performance: {
          ...state.performance,
          lastMetrics: metrics as unknown as Record<string, unknown>
        },
        ui: {
          ...state.ui,
          lastUpdate: timestamp || Date.now()
        }
      }
    }
    
    case ORCHESTRATOR_ACTIONS.PERFORMANCE_ALERT: {
      const { alert, timestamp } = action.payload
      
      const newAlerts = [...state.performance.alerts, alert as unknown as OrchestratorError]
      // Keep only the last 100 alerts
      if (newAlerts.length > 100) {
        newAlerts.splice(0, newAlerts.length - 100)
      }
      
      return {
        ...state,
        performance: {
          ...state.performance,
          alerts: newAlerts
        },
        ui: {
          ...state.ui,
          lastUpdate: timestamp || Date.now()
        }
      }
    }
    
    case ORCHESTRATOR_ACTIONS.PERFORMANCE_METRICS_RESET: {
      const { timestamp } = action.payload
      
      return {
        ...state,
        performance: {
          ...state.performance,
          lastMetrics: {},
          lastReset: timestamp || Date.now(),
          alerts: []
        },
        ui: {
          ...state.ui,
          lastUpdate: timestamp || Date.now()
        }
      }
    }
    
    // ========================================================================
    // SYSTEM MANAGEMENT ACTIONS
    // ========================================================================
    
    case ORCHESTRATOR_ACTIONS.SYSTEM_INITIALIZED: {
      const { timestamp } = action.payload
      
      return {
        ...state,
        system: {
          ...state.system,
          initialized: true,
          initializationTime: timestamp || Date.now(),
          health: 'healthy'
        },
        ui: {
          ...state.ui,
          lastUpdate: timestamp || Date.now()
        }
      }
    }
    
    case ORCHESTRATOR_ACTIONS.SYSTEM_SYNC: {
      const { timestamp } = action.payload
      
      return {
        ...state,
        system: {
          ...state.system,
          lastSync: timestamp || Date.now()
        },
        ui: {
          ...state.ui,
          lastUpdate: timestamp || Date.now()
        }
      }
    }
    
    case ORCHESTRATOR_ACTIONS.SYSTEM_HEALTH_CHANGED: {
      const { health, timestamp } = action.payload
      
      return {
        ...state,
        system: {
          ...state.system,
          health
        },
        ui: {
          ...state.ui,
          lastUpdate: timestamp || Date.now()
        }
      }
    }
    
    // ========================================================================
    // UI MANAGEMENT ACTIONS
    // ========================================================================
    
    case ORCHESTRATOR_ACTIONS.UI_LOADING: {
      const { loading, timestamp } = action.payload
      
      return {
        ...state,
        ui: {
          ...state.ui,
          loading,
          lastUpdate: timestamp || Date.now()
        }
      }
    }
    
    case ORCHESTRATOR_ACTIONS.UI_ERROR: {
      const { error, timestamp } = action.payload
      
      return {
        ...state,
        ui: {
          ...state.ui,
          error,
          lastUpdate: timestamp || Date.now()
        }
      }
    }
    
    case ORCHESTRATOR_ACTIONS.UI_ERROR_CLEARED: {
      const { timestamp } = action.payload
      
      return {
        ...state,
        ui: {
          ...state.ui,
          error: null,
          lastUpdate: timestamp || Date.now()
        }
      }
    }
    
    case ORCHESTRATOR_ACTIONS.UI_UPDATED: {
      const { timestamp } = action.payload
      
      return {
        ...state,
        ui: {
          ...state.ui,
          lastUpdate: timestamp || Date.now()
        }
      }
    }
    
    // ========================================================================
    // INITIALIZATION ACTIONS
    // ========================================================================
    
    case ORCHESTRATOR_ACTIONS.INITIALIZATION_COMPLETE: {
      const { timestamp, enabledPlugins } = action.payload
      
      return {
        ...state,
        system: {
          ...state.system,
          initialized: true,
          initializationTime: timestamp || Date.now(),
          health: 'healthy'
        },
        plugins: {
          ...state.plugins,
          registered: enabledPlugins || []
        },
        ui: {
          ...state.ui,
          loading: false,
          lastUpdate: timestamp || Date.now()
        }
      }
    }
    
    case ORCHESTRATOR_ACTIONS.INITIALIZATION_FAILED: {
      const { error, timestamp } = action.payload
      
      return {
        ...state,
        system: {
          ...state.system,
          initialized: false,
          health: 'unhealthy'
        },
        ui: {
          ...state.ui,
          loading: false,
          error: error || 'Initialization failed',
          lastUpdate: timestamp || Date.now()
        }
      }
    }
    
    // ========================================================================
    // DEFAULT CASE
    // ========================================================================
    
    default: {
      return state
    }
  }
}

// ============================================================================
// ACTION CREATORS
// ============================================================================

export const orchestratorActions = {
  // Plugin management
  pluginRegistered: (pluginId: string, timestamp?: number) => ({
    type: ORCHESTRATOR_ACTIONS.PLUGIN_REGISTERED,
    payload: { pluginId, timestamp: timestamp || Date.now() }
  }),
  
  pluginUnregistered: (pluginId: string, timestamp?: number) => ({
    type: ORCHESTRATOR_ACTIONS.PLUGIN_UNREGISTERED,
    payload: { pluginId, timestamp: timestamp || Date.now() }
  }),
  
  pluginStatusChanged: (pluginId: string, status: PluginStatus, timestamp?: number) => ({
    type: ORCHESTRATOR_ACTIONS.PLUGIN_STATUS_CHANGED,
    payload: { pluginId, status, timestamp: timestamp || Date.now() }
  }),
  
  pluginError: (pluginId: string, error: OrchestratorError, timestamp?: number) => ({
    type: ORCHESTRATOR_ACTIONS.PLUGIN_ERROR,
    payload: { pluginId, error, timestamp: timestamp || Date.now() }
  }),
  
  pluginErrorCleared: (pluginId: string, timestamp?: number) => ({
    type: ORCHESTRATOR_ACTIONS.PLUGIN_ERROR_CLEARED,
    payload: { pluginId, timestamp: timestamp || Date.now() }
  }),
  
  // WebSocket management
  websocketConnected: (timestamp?: number) => ({
    type: ORCHESTRATOR_ACTIONS.WEBSOCKET_CONNECTED,
    payload: { timestamp: timestamp || Date.now() }
  }),
  
  websocketDisconnected: (timestamp?: number) => ({
    type: ORCHESTRATOR_ACTIONS.WEBSOCKET_DISCONNECTED,
    payload: { timestamp: timestamp || Date.now() }
  }),
  
  websocketMessageReceived: (message: WebSocketEvent, timestamp?: number) => ({
    type: ORCHESTRATOR_ACTIONS.WEBSOCKET_MESSAGE_RECEIVED,
    payload: { message, timestamp: timestamp || Date.now() }
  }),
  
  websocketReconnectAttempt: (attempt: number, timestamp?: number) => ({
    type: ORCHESTRATOR_ACTIONS.WEBSOCKET_RECONNECT_ATTEMPT,
    payload: { attempt, timestamp: timestamp || Date.now() }
  }),
  
  // Cache management
  cacheStrategyChanged: (contextId: string, strategy: string, timestamp?: number) => ({
    type: ORCHESTRATOR_ACTIONS.CACHE_STRATEGY_CHANGED,
    payload: { contextId, strategy, timestamp: timestamp || Date.now() }
  }),
  
  cacheStatsUpdated: (stats: Record<string, unknown>, timestamp?: number) => ({
    type: ORCHESTRATOR_ACTIONS.CACHE_STATS_UPDATED,
    payload: { stats, timestamp: timestamp || Date.now() }
  }),
  
  cacheCleaned: (contextId?: string, cleanedCount?: number, timestamp?: number) => ({
    type: ORCHESTRATOR_ACTIONS.CACHE_CLEANED,
    payload: { contextId, cleanedCount, timestamp: timestamp || Date.now() }
  }),
  
  // Performance management
  performanceMetricsUpdated: (metrics: Record<string, unknown>, timestamp?: number) => ({
    type: ORCHESTRATOR_ACTIONS.PERFORMANCE_METRICS_UPDATED,
    payload: { metrics, timestamp: timestamp || Date.now() }
  }),
  
  performanceAlert: (alert: Record<string, unknown>, timestamp?: number) => ({
    type: ORCHESTRATOR_ACTIONS.PERFORMANCE_ALERT,
    payload: { alert, timestamp: timestamp || Date.now() }
  }),
  
  performanceMetricsReset: (timestamp?: number) => ({
    type: ORCHESTRATOR_ACTIONS.PERFORMANCE_METRICS_RESET,
    payload: { timestamp: timestamp || Date.now() }
  }),
  
  // System management
  systemInitialized: (timestamp?: number) => ({
    type: ORCHESTRATOR_ACTIONS.SYSTEM_INITIALIZED,
    payload: { timestamp: timestamp || Date.now() }
  }),
  
  systemSync: (timestamp?: number) => ({
    type: ORCHESTRATOR_ACTIONS.SYSTEM_SYNC,
    payload: { timestamp: timestamp || Date.now() }
  }),
  
  systemHealthChanged: (health: 'healthy' | 'degraded' | 'unhealthy', timestamp?: number) => ({
    type: ORCHESTRATOR_ACTIONS.SYSTEM_HEALTH_CHANGED,
    payload: { health, timestamp: timestamp || Date.now() }
  }),
  
  // UI management
  uiLoading: (loading: boolean, timestamp?: number) => ({
    type: ORCHESTRATOR_ACTIONS.UI_LOADING,
    payload: { loading, timestamp: timestamp || Date.now() }
  }),
  
  uiError: (error: string, timestamp?: number) => ({
    type: ORCHESTRATOR_ACTIONS.UI_ERROR,
    payload: { error, timestamp: timestamp || Date.now() }
  }),
  
  uiErrorCleared: (timestamp?: number) => ({
    type: ORCHESTRATOR_ACTIONS.UI_ERROR_CLEARED,
    payload: { timestamp: timestamp || Date.now() }
  }),
  
  uiUpdated: (timestamp?: number) => ({
    type: ORCHESTRATOR_ACTIONS.UI_UPDATED,
    payload: { timestamp: timestamp || Date.now() }
  }),
  
  // Initialization
  initializationComplete: (enabledPlugins: string[], timestamp?: number) => ({
    type: ORCHESTRATOR_ACTIONS.INITIALIZATION_COMPLETE,
    payload: { enabledPlugins, timestamp: timestamp || Date.now() }
  }),
  
  initializationFailed: (error: string, timestamp?: number) => ({
    type: ORCHESTRATOR_ACTIONS.INITIALIZATION_FAILED,
    payload: { error, timestamp: timestamp || Date.now() }
  })
}

// ============================================================================
// SELECTORS
// ============================================================================

export const orchestratorSelectors = {
  // Plugin selectors
  getRegisteredPlugins: (state: OrchestratorState) => state.plugins.registered,
  getActivePlugins: (state: OrchestratorState) => state.plugins.active,
  getPluginStatus: (state: OrchestratorState, pluginId: string) => state.plugins.status[pluginId],
  getPluginErrors: (state: OrchestratorState, pluginId: string) => state.plugins.errors[pluginId] || [],
  hasPluginErrors: (state: OrchestratorState, pluginId: string) => (state.plugins.errors[pluginId] || []).length > 0,
  
  // WebSocket selectors
  isWebSocketConnected: (state: OrchestratorState) => state.websocket.connected,
  getWebSocketStats: (state: OrchestratorState) => ({
    connected: state.websocket.connected,
    messageCount: state.websocket.messageCount,
    lastConnected: state.websocket.lastConnected,
    lastDisconnected: state.websocket.lastDisconnected,
    reconnectAttempts: state.websocket.reconnectAttempts
  }),
  
  // Cache selectors
  getCacheStrategy: (state: OrchestratorState, contextId: string) => state.cache.strategy[contextId],
  getCacheStats: (state: OrchestratorState) => state.cache.stats,
  getLastCacheCleanup: (state: OrchestratorState) => state.cache.lastCleanup,
  
  // Performance selectors
  getPerformanceMetrics: (state: OrchestratorState) => state.performance.lastMetrics,
  getPerformanceAlerts: (state: OrchestratorState) => state.performance.alerts,
  getLastPerformanceReset: (state: OrchestratorState) => state.performance.lastReset,
  
  // System selectors
  isSystemInitialized: (state: OrchestratorState) => state.system.initialized,
  getSystemHealth: (state: OrchestratorState) => state.system.health,
  getSystemUptime: (state: OrchestratorState) => {
    if (!state.system.initializationTime) return 0
    return Date.now() - state.system.initializationTime
  },
  getLastSync: (state: OrchestratorState) => state.system.lastSync,
  
  // UI selectors
  isUILoading: (state: OrchestratorState) => state.ui.loading,
  getUIError: (state: OrchestratorState) => state.ui.error,
  getLastUIUpdate: (state: OrchestratorState) => state.ui.lastUpdate,
  
  // Convenience selectors
  getOverallHealth: (state: OrchestratorState) => {
    if (state.system.health === 'unhealthy') return 'unhealthy'
    if (Object.keys(state.plugins.errors).length > 0) return 'degraded'
    return 'healthy'
  },
  
  getPluginCount: (state: OrchestratorState) => state.plugins.registered.length,
  getActivePluginCount: (state: OrchestratorState) => state.plugins.active.length,
  
  getTotalErrorCount: (state: OrchestratorState) => {
    return Object.values(state.plugins.errors).reduce((total, errors) => total + errors.length, 0)
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export default orchestratorReducer;
