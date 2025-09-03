/**
 * @fileoverview Electrum Context Plugin - Domain-specific Electrum state management
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-31
 * @lastModified 2025-08-31
 *
 * @description
 * Electrum context plugin that manages Electrum-specific state including server info,
 * fee estimates, address balances, and transaction history. Replaces isolated Electrum
 * logic with orchestrated state management.
 */

import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react'
import { useMainOrchestrator } from '../MainOrchestrator'
import { ContextPlugin, PluginStatus } from '../../types/orchestrator'

// Electrum-specific types (no Bitcoin Core RPC types needed)
// interface SmartFeeEstimate {
//   feerate: number
//   blocks: number
//   errors?: string[]
// }

// Electrum-specific types
interface ElectrumServerInfo {
  version: string
  protocolVersion: string
  genesisBlockHash: string
  bestBlockHash: string
  bestBlockHeight: number
  lastBlockTime: number
}

interface FeeEstimate {
  target: number
  feerate: number
  blocks: number
}

interface AddressBalance {
  address: string
  confirmed: number
  unconfirmed: number
  total: number
}

interface TransactionHistory {
  txid: string
  height: number
  timestamp: number
  amount: number
  fee: number
  confirmations: number
}

interface ElectrumState {
  serverInfo: ElectrumServerInfo | null
  feeEstimates: FeeEstimate[]
  addressBalances: Record<string, AddressBalance>
  transactionHistory: Record<string, TransactionHistory[]>
  isLoading: boolean
  error: string | null
  lastUpdated: number
  serverConnected: boolean
}

type ElectrumAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SERVER_INFO'; payload: ElectrumServerInfo }
  | { type: 'SET_FEE_ESTIMATES'; payload: FeeEstimate[] }
  | { type: 'SET_ADDRESS_BALANCE'; payload: { address: string; balance: AddressBalance } }
  | { type: 'SET_TRANSACTION_HISTORY'; payload: { address: string; history: TransactionHistory[] } }
  | { type: 'SET_SERVER_STATUS'; payload: boolean }
  | { type: 'UPDATE_TIMESTAMP' }
  | { type: 'RESET_STATE' }

// Initial state
const initialState: ElectrumState = {
  serverInfo: null,
  feeEstimates: [],
  addressBalances: {},
  transactionHistory: {},
  isLoading: false,
  error: null,
  lastUpdated: Date.now(),
  serverConnected: false
}

// Reducer
const electrumReducer = (state: ElectrumState, action: ElectrumAction): ElectrumState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'SET_SERVER_INFO':
      return { ...state, serverInfo: action.payload, lastUpdated: Date.now() }
    case 'SET_FEE_ESTIMATES':
      return { ...state, feeEstimates: action.payload, lastUpdated: Date.now() }
    case 'SET_ADDRESS_BALANCE':
      return {
        ...state,
        addressBalances: {
          ...state.addressBalances,
          [action.payload.address]: action.payload.balance
        },
        lastUpdated: Date.now()
      }
    case 'SET_TRANSACTION_HISTORY':
      return {
        ...state,
        transactionHistory: {
          ...state.transactionHistory,
          [action.payload.address]: action.payload.history
        },
        lastUpdated: Date.now()
      }
    case 'SET_SERVER_STATUS':
      return { ...state, serverConnected: action.payload }
    case 'UPDATE_TIMESTAMP':
      return { ...state, lastUpdated: Date.now() }
    case 'RESET_STATE':
      return { ...state, ...initialState, lastUpdated: Date.now() }
    default:
      return state
  }
}

// Context
const ElectrumContext = createContext<ElectrumState | undefined>(undefined)

// Hook
export const useElectrumContext = (): ElectrumState => {
  const context = useContext(ElectrumContext)
  if (!context) {
    throw new Error('useElectrumContext must be used within an ElectrumContextProvider')
  }
  return context
}

// Provider Component
export const ElectrumContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(electrumReducer, initialState)
  const { 
    registerPlugin
  } = useMainOrchestrator()

  // Plugin registration - only register once
  useEffect(() => {
    const plugin: ContextPlugin = {
      id: 'electrum',
      name: 'Electrum Context',
      version: '1.0.0',
      description: 'Electrum server state management plugin',
      status: PluginStatus.ACTIVE,
      dependencies: ['websocket', 'cache'],
      metadata: { priority: 'high' },
      onWebSocketMessage: (message: Record<string, unknown>) => {
        // Handle WebSocket messages for Electrum events with proper type safety
        if (message.type === 'electrum.server_info' && message.data && typeof message.data === 'object' && message.data !== null) {
          const data = message.data as Record<string, unknown>
          if (data.serverInfo) {
            dispatch({ type: 'SET_SERVER_INFO', payload: data.serverInfo as ElectrumServerInfo })
          }
        } else if (message.type === 'electrum.fee_estimates' && message.data && typeof message.data === 'object' && message.data !== null) {
          const data = message.data as Record<string, unknown>
          if (data.feeEstimates && Array.isArray(data.feeEstimates)) {
            dispatch({ type: 'SET_FEE_ESTIMATES', payload: data.feeEstimates as FeeEstimate[] })
          }
        }
      },
      canHandleEvent: (eventType: string) => {
        return eventType.startsWith('electrum.')
      }
    }

    registerPlugin(plugin)

    // Don't unregister on cleanup - let MainOrchestrator manage lifecycle
    // This prevents the registration/unregistration cycle
  }, [registerPlugin]) // Include registerPlugin dependency

  // Server status monitoring - check actual backend health
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        // Check backend health endpoint for actual Electrum status
        const response = await fetch('http://localhost:8000/api/v1/network/health')
        if (response.ok) {
          const health = await response.json()
          const electrumHealthy = health?.services?.electrum === true
          dispatch({ type: 'SET_SERVER_STATUS', payload: electrumHealthy })
        } else {
          dispatch({ type: 'SET_SERVER_STATUS', payload: false })
        }
      } catch (error) {
        // If backend is unreachable, Electrum is definitely down
        dispatch({ type: 'SET_SERVER_STATUS', payload: false })
      }
    }

    const interval = setInterval(checkServerStatus, 10000) // Check every 10 seconds
    checkServerStatus()

    return () => clearInterval(interval)
  }, [])

  // Simple performance monitoring
  useEffect(() => {
    if (state.lastUpdated > 0) {
      const timeSinceUpdate = Date.now() - state.lastUpdated
      if (timeSinceUpdate > 120000) { // 2 minutes for Electrum data
        // Stale data warning
      }
    }
  }, [state.lastUpdated])

  const contextValue = useMemo(() => state, [state])

  return (
    <ElectrumContext.Provider value={contextValue}>
      {children}
    </ElectrumContext.Provider>
  )
}

export default ElectrumContextProvider
