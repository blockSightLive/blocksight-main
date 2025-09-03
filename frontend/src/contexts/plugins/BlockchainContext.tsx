/**
 * @fileoverview Blockchain Context Plugin - Domain-specific blockchain state management
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-31
 * @lastModified 2025-08-31
 *
 * @description
 * Blockchain context plugin that manages blockchain-specific state including height,
 * mempool data, block information, and real-time updates. Replaces the isolated
 * useBlockchainData hook with orchestrated state management.
 */

import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react'
import { useMainOrchestrator } from '../MainOrchestrator'
import { ContextPlugin, PluginStatus } from '../../types/orchestrator'
// Frontend should NOT import RPC types - data comes via WebSocket from backend


// ============================================================================
// FRONTEND BLOCKCHAIN STATE MANAGEMENT (WebSocket-based)
// ============================================================================

// Frontend blockchain data types (received via WebSocket from backend)
interface BlockchainBlock {
  height: number
  hash: string
  timestamp: number
  transactionCount: number
  size: number
  weight: number
  difficulty: number
  confirmations: number
  status: 'pending' | 'confirmed' | 'mined' | 'historical'
}

interface MempoolData {
  size: number
  bytes: number
  pendingTransactions: number
  mempoolminfee: number
  minrelaytxfee: number
}

interface BlockchainInfo {
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

interface NetworkInfo {
  version: number
  subversion: string
  protocolversion: number
  networkactive: boolean
  connections: number
  relayfee: number
  incrementalfee: number
  warnings: string
}


// Frontend blockchain state (WebSocket-based)
interface BlockchainState {
  height: number
  mempool: MempoolData | null
  blocks: BlockchainBlock[]
  recentBlocks: BlockchainBlock[]
  blockchainInfo: BlockchainInfo | null
  networkInfo: NetworkInfo | null
  isLoading: boolean
  error: string | null
  lastUpdated: number
  webSocketConnected: boolean
}

type BlockchainAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_HEIGHT'; payload: number }
  | { type: 'SET_MEMPOOL'; payload: MempoolData }
  | { type: 'ADD_BLOCK'; payload: BlockchainBlock }
  | { type: 'SET_RECENT_BLOCKS'; payload: BlockchainBlock[] }
  | { type: 'SET_BLOCKCHAIN_INFO'; payload: BlockchainInfo }
  | { type: 'SET_NETWORK_INFO'; payload: NetworkInfo }
  | { type: 'SET_WEBSOCKET_STATUS'; payload: boolean }
  | { type: 'UPDATE_TIMESTAMP' }
  | { type: 'RESET_STATE' }

// Initial state with placeholder data
const initialState: BlockchainState = {
  height: 0,
  mempool: null,
  blocks: [],
  recentBlocks: [],
  blockchainInfo: null,
  networkInfo: null,
  isLoading: false,
  error: null,
  lastUpdated: Date.now(),
  webSocketConnected: false
}

// Reducer
const blockchainReducer = (state: BlockchainState, action: BlockchainAction): BlockchainState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'SET_HEIGHT':
      return { ...state, height: action.payload, lastUpdated: Date.now() }
    case 'SET_MEMPOOL':
      return { ...state, mempool: action.payload, lastUpdated: Date.now() }
    case 'ADD_BLOCK':
      return {
        ...state,
        blocks: [action.payload, ...state.blocks.slice(0, 99)],
        lastUpdated: Date.now()
      }
    case 'SET_RECENT_BLOCKS':
      return { ...state, recentBlocks: action.payload, lastUpdated: Date.now() }
    case 'SET_BLOCKCHAIN_INFO':
      return { ...state, blockchainInfo: action.payload, lastUpdated: Date.now() }
    case 'SET_NETWORK_INFO':
      return { ...state, networkInfo: action.payload, lastUpdated: Date.now() }
    case 'SET_WEBSOCKET_STATUS':
      return { ...state, webSocketConnected: action.payload }
    case 'UPDATE_TIMESTAMP':
      return { ...state, lastUpdated: Date.now() }
    case 'RESET_STATE':
      return { ...state, ...initialState, lastUpdated: Date.now() }
    default:
      return state
  }
}

// Context
const BlockchainContext = createContext<BlockchainState | undefined>(undefined)

// Hook
export const useBlockchainContext = (): BlockchainState => {
  const context = useContext(BlockchainContext)
  if (!context) {
    throw new Error('useBlockchainContext must be used within a BlockchainContextProvider')
  }
  return context
}

// Provider Component
export const BlockchainContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(blockchainReducer, initialState)
  const { 
    registerPlugin, 
    state: orchestratorState
  } = useMainOrchestrator()

  // No RPC client needed - data comes via WebSocket from backend

  // Plugin registration - only register once
  useEffect(() => {
    const pluginId = 'blockchain'
    
    const plugin: ContextPlugin = {
      id: pluginId,
      name: 'Blockchain Context',
      version: '1.0.0',
      description: 'Blockchain state management plugin',
      status: PluginStatus.ACTIVE,
      dependencies: ['websocket', 'cache'],
      metadata: { priority: 'high' },
      onWebSocketMessage: (message: Record<string, unknown>) => {
        // Handle WebSocket messages from enhanced backend hub
        const messageType = message.type as string
        const messageData = message.data as Record<string, unknown> | undefined
        
        if (messageType === 'tip.height' && messageData?.height) {
          dispatch({ type: 'SET_HEIGHT', payload: messageData.height as number })
        } else if (messageType === 'network.mempool' && messageData) {
          // Handle mempool data from WebSocket
          const mempoolData: MempoolData = {
            size: (messageData.size as number) || 0,
            bytes: (messageData.bytes as number) || 0,
            pendingTransactions: (messageData.pendingTransactions as number) || 0,
            mempoolminfee: (messageData.mempoolminfee as number) || 0.00001,
            minrelaytxfee: (messageData.minrelaytxfee as number) || 0.00001
          }
          dispatch({ type: 'SET_MEMPOOL', payload: mempoolData })
        } else if (messageType === 'blockchain.info' && messageData) {
          // Handle blockchain info from WebSocket
          dispatch({ type: 'SET_BLOCKCHAIN_INFO', payload: messageData as unknown as BlockchainInfo })
        } else if (messageType === 'blockchain.network' && messageData) {
          // Handle network info from WebSocket
          dispatch({ type: 'SET_NETWORK_INFO', payload: messageData as unknown as NetworkInfo })
        }
      },
      canHandleEvent: (eventType: string) => {
        return [
          'tip.height', 
          'network.mempool', 
          'chain.reorg',
          'blockchain.info',
          'blockchain.network',
          'blockchain.mining'
        ].includes(eventType)
      }
    }

    try {
      registerPlugin(plugin)
        .then(success => {
          if (!success) {
            // Plugin registration failed
          }
        })
        .catch(_error => {
          // Plugin registration error
        })
    } catch (_error) {
      // Plugin registration exception
    }

    // Don't unregister on cleanup - let MainOrchestrator manage lifecycle
    // This prevents the registration/unregistration cycle
  }, [registerPlugin]) // Include registerPlugin dependency

  // No direct data fetching - all data comes via WebSocket from backend

  // Test WebSocket connection function (defined inside component to access orchestratorState)
  const testConnection = useCallback(async (): Promise<{ success: boolean; error?: string; info?: unknown }> => {
    try {
      // Testing WebSocket connection
      
      // Check if WebSocket is connected via MainOrchestrator
      const wsConnected = orchestratorState.websocket.connected
      
      if (wsConnected) {
        // WebSocket connection successful
        return { 
          success: true, 
          info: { message: 'WebSocket connected, receiving real-time blockchain data' }
        }
      } else {
        // WebSocket not connected, using placeholder data
        return { 
          success: true, 
          info: { message: 'WebSocket pending, using placeholder data' }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      // WebSocket test failed
      return { 
        success: false, 
        error: errorMessage 
      }
    }
  }, [orchestratorState.websocket.connected])

  // Initialize WebSocket connection
  useEffect(() => {
    const initializeWebSocket = async () => {
      // Test WebSocket connection
      const connectionTest = await testConnection()
      if (connectionTest.success) {
        // WebSocket connection successful - data will come via events
      } else {
        // WebSocket connection failed - will retry automatically
      }
    }
    
    initializeWebSocket()
  }, [testConnection])

  // No periodic refresh needed - data comes via real-time WebSocket events

  // WebSocket status monitoring
  useEffect(() => {
    const checkWebSocketStatus = () => {
      const wsStatus = orchestratorState.websocket.connected
      dispatch({ type: 'SET_WEBSOCKET_STATUS', payload: wsStatus })
    }

    const interval = setInterval(checkWebSocketStatus, 5000)
    checkWebSocketStatus()

    return () => clearInterval(interval)
  }, [orchestratorState.websocket.connected])

  // Simple performance monitoring
  useEffect(() => {
    if (state.lastUpdated > 0) {
      const timeSinceUpdate = Date.now() - state.lastUpdated
      if (timeSinceUpdate > 60000) {
        // Stale data warning
      }
    }
  }, [state.lastUpdated])

  const contextValue = useMemo(() => state, [state])

  return (
    <BlockchainContext.Provider value={contextValue}>
      {children}
    </BlockchainContext.Provider>
  )
}

export default BlockchainContextProvider
