/**
 * @fileoverview External API Context Plugin - Price and FX data management
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-31
 * @lastModified 2025-08-31
 *
 * @description
 * External API context plugin that manages price data, foreign exchange rates,
 * and external market information. Integrates with the MainOrchestrator for
 * unified state management.
 */

import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react'
import { useMainOrchestrator } from '../MainOrchestrator'
import { ContextPlugin, PluginStatus } from '../../types/orchestrator'

// External API types (no Bitcoin Core RPC types needed)
interface PriceData {
  symbol: string
  price: number
  change24h: number
  changePercent24h: number
  volume24h: number
  marketCap: number
  lastUpdated: number
}

interface FXRate {
  from: string
  to: string
  rate: number
  inverseRate: number
  lastUpdated: number
}

interface MarketData {
  totalMarketCap: number
  totalVolume24h: number
  bitcoinDominance: number
  activeCryptocurrencies: number
  lastUpdated: number
}

interface ExternalAPIState {
  prices: Record<string, PriceData>
  fxRates: Record<string, FXRate>
  marketData: MarketData | null
  isLoading: boolean
  error: string | null
  lastUpdated: number
  apiConnected: boolean
}

type ExternalAPIAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PRICE'; payload: { symbol: string; data: PriceData } }
  | { type: 'SET_FX_RATE'; payload: { pair: string; rate: FXRate } }
  | { type: 'SET_MARKET_DATA'; payload: MarketData }
  | { type: 'SET_API_STATUS'; payload: boolean }
  | { type: 'UPDATE_TIMESTAMP' }
  | { type: 'RESET_STATE' }

// Initial state
const initialState: ExternalAPIState = {
  prices: {},
  fxRates: {},
  marketData: null,
  isLoading: false,
  error: null,
  lastUpdated: Date.now(),
  apiConnected: false
}

// Reducer
const externalAPIReducer = (state: ExternalAPIState, action: ExternalAPIAction): ExternalAPIState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'SET_PRICE':
      return {
        ...state,
        prices: {
          ...state.prices,
          [action.payload.symbol]: action.payload.data
        },
        lastUpdated: Date.now()
      }
    case 'SET_FX_RATE':
      return {
        ...state,
        fxRates: {
          ...state.fxRates,
          [action.payload.pair]: action.payload.rate
        },
        lastUpdated: Date.now()
      }
    case 'SET_MARKET_DATA':
      return { ...state, marketData: action.payload, lastUpdated: Date.now() }
    case 'SET_API_STATUS':
      return { ...state, apiConnected: action.payload }
    case 'UPDATE_TIMESTAMP':
      return { ...state, lastUpdated: Date.now() }
    case 'RESET_STATE':
      return { ...state, ...initialState, lastUpdated: Date.now() }
    default:
      return state
  }
}

// Context
const ExternalAPIContext = createContext<ExternalAPIState | undefined>(undefined)

// Hook
export const useExternalAPIContext = (): ExternalAPIState => {
  const context = useContext(ExternalAPIContext)
  if (!context) {
    throw new Error('useExternalAPIContext must be used within an ExternalAPIContextProvider')
  }
  return context
}

// Provider Component
export const ExternalAPIContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(externalAPIReducer, initialState)
  const { 
    registerPlugin, 
    state: orchestratorState
  } = useMainOrchestrator()

  // Plugin registration - only register once
  useEffect(() => {
    const plugin: ContextPlugin = {
      id: 'external-api',
      name: 'External API Context',
      version: '1.0.0',
      description: 'External API data management plugin',
      status: PluginStatus.ACTIVE,
      dependencies: ['websocket', 'cache'],
      metadata: { priority: 'medium' },
      onWebSocketMessage: (message: Record<string, unknown>) => {
        // Handle WebSocket messages for external API events with proper type safety
        if (message.type === 'price.current' && message.data && typeof message.data === 'object' && message.data !== null) {
          const data = message.data as Record<string, unknown>
          if (data.price && typeof data.price === 'object' && data.price !== null) {
            const priceData = data.price as Record<string, unknown>
            const symbol = priceData.symbol as string
            if (symbol) {
              dispatch({ 
                type: 'SET_PRICE', 
                payload: { 
                  symbol, 
                  data: { 
                    symbol, 
                    price: priceData.price as number || 0,
                    change24h: priceData.change24h as number || 0,
                    changePercent24h: priceData.changePercent24h as number || 0,
                    volume24h: priceData.volume24h as number || 0,
                    marketCap: priceData.marketCap as number || 0,
                    lastUpdated: Date.now() 
                  } 
                }
              })
            }
          }
        } else if (message.type === 'fx.rates' && message.data && typeof message.data === 'object' && message.data !== null) {
          const data = message.data as Record<string, unknown>
          if (data.rates && typeof data.rates === 'object' && data.rates !== null) {
            const rates = data.rates as Record<string, unknown>
            Object.entries(rates).forEach(([pair, rateData]) => {
              if (typeof rateData === 'object' && rateData !== null) {
                const rate = rateData as Record<string, unknown>
                dispatch({ 
                  type: 'SET_FX_RATE', 
                  payload: { 
                    pair, 
                    rate: { 
                      from: rate.from as string || '',
                      to: rate.to as string || '',
                      rate: rate.rate as number || 0,
                      inverseRate: rate.inverseRate as number || 0,
                      lastUpdated: Date.now() 
                    } 
                  }
                })
              }
            })
          }
        }
      },
      canHandleEvent: (eventType: string) => {
        return ['price.current', 'fx.rates'].includes(eventType)
      }
    }

    registerPlugin(plugin)

    // Don't unregister on cleanup - let MainOrchestrator manage lifecycle
    // This prevents the registration/unregistration cycle
  }, [registerPlugin]) // Include registerPlugin dependency

  // API status monitoring
  useEffect(() => {
    const checkAPIStatus = () => {
      // For now, we'll assume connection based on orchestrator WebSocket status
      // In the future, this could check actual external API connectivity
      const wsStatus = orchestratorState.websocket.connected
      dispatch({ type: 'SET_API_STATUS', payload: wsStatus })
    }

    const interval = setInterval(checkAPIStatus, 15000) // Check every 15 seconds
    checkAPIStatus()

    return () => clearInterval(interval)
  }, [orchestratorState.websocket.connected])

  // Simple performance monitoring
  useEffect(() => {
    if (state.lastUpdated > 0) {
      const timeSinceUpdate = Date.now() - state.lastUpdated
      if (timeSinceUpdate > 300000) { // 5 minutes for external API data
        console.warn(`[ExternalAPIContext] Stale data warning: ${timeSinceUpdate}ms since last update`)
      }
    }
  }, [state.lastUpdated])

  const contextValue = useMemo(() => state, [state])

  return (
    <ExternalAPIContext.Provider value={contextValue}>
      {children}
    </ExternalAPIContext.Provider>
  )
}

export default ExternalAPIContextProvider
