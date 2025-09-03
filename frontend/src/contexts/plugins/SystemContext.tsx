/**
 * @fileoverview System Context Plugin - System health and metrics management
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-31
 * @lastModified 2025-08-31
 *
 * @description
 * System context plugin that manages system health, performance metrics, and
 * overall application status. Integrates with the MainOrchestrator for unified
 * state management.
 */

import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react'
import { useMainOrchestrator } from '../MainOrchestrator'
import { ContextPlugin, PluginStatus } from '../../types/orchestrator'

// System types (no Bitcoin Core RPC types needed)
interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  score: number // 0-100
  lastCheck: number
  issues: string[]
}

interface PerformanceMetrics {
  fps: number
  memoryUsage: number
  renderTime: number
  networkLatency: number
  lastUpdated: number
}

interface ServiceStatus {
  bitcoinCore: 'online' | 'offline' | 'degraded'
  electrum: 'online' | 'offline' | 'degraded'
  websocket: 'online' | 'offline' | 'degraded'
  externalAPI: 'online' | 'offline' | 'degraded'
  lastUpdated: number
}

interface SystemState {
  health: SystemHealth
  performance: PerformanceMetrics
  services: ServiceStatus
  fiatPreference: {
    preferredFiat: string
    supportedCurrencies: string[]
    defaultFiat: string
  }
  isLoading: boolean
  error: string | null
  lastUpdated: number
  systemInitialized: boolean
}

type SystemAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_HEALTH'; payload: SystemHealth }
  | { type: 'SET_PERFORMANCE'; payload: PerformanceMetrics }
  | { type: 'SET_SERVICE_STATUS'; payload: { service: keyof ServiceStatus; status: string } }
  | { type: 'SET_SYSTEM_INITIALIZED'; payload: boolean }
  | { type: 'SET_FIAT_PREFERENCE'; payload: string }
  | { type: 'UPDATE_TIMESTAMP' }
  | { type: 'RESET_STATE' }

// Initial state
const initialState: SystemState = {
  health: {
    status: 'healthy',
    score: 100,
    lastCheck: Date.now(),
    issues: []
  },
  performance: {
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    networkLatency: 0,
    lastUpdated: Date.now()
  },
  services: {
    bitcoinCore: 'offline',
    electrum: 'offline',
    websocket: 'offline',
    externalAPI: 'offline',
    lastUpdated: Date.now()
  },
  fiatPreference: {
    preferredFiat: 'USD',
    supportedCurrencies: ['USD', 'EUR', 'BRL', 'ARS', 'ILS'],
    defaultFiat: 'USD'
  },
  isLoading: false,
  error: null,
  lastUpdated: Date.now(),
  systemInitialized: false
}

// Reducer
const systemReducer = (state: SystemState, action: SystemAction): SystemState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'SET_HEALTH':
      return { ...state, health: action.payload, lastUpdated: Date.now() }
    case 'SET_PERFORMANCE':
      return { ...state, performance: action.payload, lastUpdated: Date.now() }
    case 'SET_SERVICE_STATUS':
      return {
        ...state,
        services: {
          ...state.services,
          [action.payload.service]: action.payload.status,
          lastUpdated: Date.now()
        },
        lastUpdated: Date.now()
      }
    case 'SET_SYSTEM_INITIALIZED':
      return { ...state, systemInitialized: action.payload }
    case 'SET_FIAT_PREFERENCE':
      return { 
        ...state, 
        fiatPreference: { 
          ...state.fiatPreference, 
          preferredFiat: action.payload 
        }, 
        lastUpdated: Date.now() 
      }
    case 'UPDATE_TIMESTAMP':
      return { ...state, lastUpdated: Date.now() }
    case 'RESET_STATE':
      return { ...state, ...initialState, lastUpdated: Date.now() }
    default:
      return state
  }
}

// Context
const SystemContext = createContext<(SystemState & {
  setPreferredFiat: (fiat: string) => void
  resetFiatPreference: () => void
}) | undefined>(undefined)

// Hook
export const useSystemContext = (): SystemState & {
  setPreferredFiat: (fiat: string) => void
  resetFiatPreference: () => void
} => {
  const context = useContext(SystemContext)
  if (!context) {
    throw new Error('useSystemContext must be used within a SystemContextProvider')
  }
  return context
}

// Provider Component
export const SystemContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(systemReducer, initialState)
  const { 
    registerPlugin, 
    state: orchestratorState
  } = useMainOrchestrator()

  // Plugin registration - only register once
  useEffect(() => {
    const plugin: ContextPlugin = {
      id: 'system',
      name: 'System Context',
      version: '1.0.0',
      description: 'System health and metrics management plugin',
      status: PluginStatus.ACTIVE,
      dependencies: ['websocket', 'cache'],
      metadata: { priority: 'high' },
      onWebSocketMessage: (message: Record<string, unknown>) => {
        // Handle WebSocket messages for system events
        const messageType = message.type as string
        const messageData = message.data as Record<string, unknown> | undefined
        
        if (messageType === 'system.health' && messageData?.health) {
          dispatch({ type: 'SET_HEALTH', payload: messageData.health as SystemHealth })
        } else if (messageType === 'system.performance' && messageData?.performance) {
          dispatch({ type: 'SET_PERFORMANCE', payload: messageData.performance as PerformanceMetrics })
        } else if (messageType === 'system.service_status' && messageData?.serviceStatus) {
          const serviceStatus = messageData.serviceStatus as Record<string, string>
          Object.entries(serviceStatus).forEach(([service, status]) => {
            if (service in state.services && typeof status === 'string') {
              dispatch({ 
                type: 'SET_SERVICE_STATUS', 
                payload: { service: service as keyof ServiceStatus, status } 
              })
            }
          })
        }
      },
      canHandleEvent: (eventType: string) => {
        return eventType.startsWith('system.')
      }
    }

    registerPlugin(plugin)

    // Don't unregister on cleanup - let MainOrchestrator manage lifecycle
    // This prevents the registration/unregistration cycle
  }, [registerPlugin]) // Include registerPlugin dependency

  // System initialization
  useEffect(() => {
    const initializeSystem = () => {
      // Load fiat preference from localStorage
      try {
        const stored = localStorage.getItem('blocksight.preferredFiat')
        if (stored && state.fiatPreference.supportedCurrencies.includes(stored)) {
          dispatch({ type: 'SET_FIAT_PREFERENCE', payload: stored })
        }
      } catch (error) {
        console.warn('Failed to load fiat preference from localStorage:', error)
      }
      
      dispatch({ type: 'SET_SYSTEM_INITIALIZED', payload: true })
      dispatch({ type: 'UPDATE_TIMESTAMP' })
    }

    // Initialize system after a short delay to allow other contexts to register
    const timer = setTimeout(initializeSystem, 1000)
    return () => clearTimeout(timer)
  }, [state.fiatPreference.supportedCurrencies])

  // Service status monitoring
  useEffect(() => {
    const updateServiceStatus = () => {
      // Update service status based on orchestrator state
      const wsStatus = orchestratorState.websocket.connected ? 'online' : 'offline'
      dispatch({ 
        type: 'SET_SERVICE_STATUS', 
        payload: { service: 'websocket', status: wsStatus } 
      })

      // For now, we'll assume other services are offline until we implement proper health checks
      // In the future, this could check actual service connectivity
    }

    const interval = setInterval(updateServiceStatus, 20000) // Check every 20 seconds
    updateServiceStatus()

    return () => clearInterval(interval)
  }, [orchestratorState.websocket.connected])

  // Health monitoring
  useEffect(() => {
    const updateHealth = () => {
      const services = Object.values(state.services)
      const onlineServices = services.filter(status => status === 'online').length
      const totalServices = services.length
      const healthScore = Math.round((onlineServices / totalServices) * 100)
      
      let healthStatus: 'healthy' | 'degraded' | 'unhealthy'
      if (healthScore >= 80) healthStatus = 'healthy'
      else if (healthScore >= 50) healthStatus = 'degraded'
      else healthStatus = 'unhealthy'

      const issues: string[] = []
      if (state.services.bitcoinCore === 'offline') issues.push('Bitcoin Core offline')
      if (state.services.electrum === 'offline') issues.push('Electrum server offline')
      if (state.services.websocket === 'offline') issues.push('WebSocket disconnected')
      if (state.services.externalAPI === 'offline') issues.push('External API unavailable')

      dispatch({
        type: 'SET_HEALTH',
        payload: {
          status: healthStatus,
          score: healthScore,
          lastCheck: Date.now(),
          issues
        }
      })
    }

    const interval = setInterval(updateHealth, 30000) // Check every 30 seconds
    updateHealth()

    return () => clearInterval(interval)
  }, [state.services])

  // Performance monitoring
  useEffect(() => {
    const updatePerformance = () => {
      // For now, we'll use basic performance metrics
      // In the future, this could integrate with actual performance monitoring
      const performanceMetrics: PerformanceMetrics = {
        fps: 60, // Placeholder - could be measured from Three.js
        memoryUsage: (window.performance as Performance & { memory?: { usedJSHeapSize: number } })?.memory?.usedJSHeapSize || 0,
        renderTime: 16, // Placeholder - 60fps = ~16ms per frame
        networkLatency: 0, // Placeholder - could measure actual API response times
        lastUpdated: Date.now()
      }

      dispatch({ type: 'SET_PERFORMANCE', payload: performanceMetrics })
    }

    const interval = setInterval(updatePerformance, 10000) // Update every 10 seconds
    updatePerformance()

    return () => clearInterval(interval)
  }, [])

  // Fiat preference management
  const setPreferredFiat = useCallback((fiat: string) => {
    if (state.fiatPreference.supportedCurrencies.includes(fiat)) {
      dispatch({ type: 'SET_FIAT_PREFERENCE', payload: fiat })
      // Persist to localStorage
      try {
        localStorage.setItem('blocksight.preferredFiat', fiat)
      } catch (error) {
        console.warn('Failed to save fiat preference to localStorage:', error)
      }
    }
  }, [state.fiatPreference.supportedCurrencies])

  const resetFiatPreference = useCallback(() => {
    setPreferredFiat(state.fiatPreference.defaultFiat)
  }, [state.fiatPreference.defaultFiat, setPreferredFiat])

  const contextValue = useMemo(() => ({
    ...state,
    setPreferredFiat,
    resetFiatPreference
  }), [state, setPreferredFiat, resetFiatPreference])

  return (
    <SystemContext.Provider value={contextValue}>
      {children}
    </SystemContext.Provider>
  )
}

export default SystemContextProvider
