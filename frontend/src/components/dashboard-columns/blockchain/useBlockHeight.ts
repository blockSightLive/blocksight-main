/**
 * @fileoverview Custom hook for fetching current blockchain height
 * @version 1.0.0
 * @since 2025-08-30
 * @lastModified 2025-08-30
 * 
 * @description
 * Fetches current blockchain height from Bitcoin Core via our existing API.
 * Provides real-time updates for 3D blockchain visualization.
 * 
 * @dependencies
 * - Existing Bitcoin Core integration
 * - Core controller height endpoint
 * 
 * @usage
 * const { blockHeight, isLoading, error } = useBlockHeight()
 * 
 * @state
 * ✅ In Development - Core height integration
 * 
 * @performance
 * - Efficient polling with configurable intervals
 * - Error handling and retry logic
 */

import { useState, useEffect } from 'react'

interface BlockHeightData {
  height: number
  timestamp: number
}

interface UseBlockHeightReturn {
  blockHeight: number | null
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
}

export const useBlockHeight = (pollingIntervalMs: number = 10000): UseBlockHeightReturn => {
  const [blockHeight, setBlockHeight] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchBlockHeight = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Use our existing Bitcoin Core height endpoint
      const response = await fetch('/api/v1/core/height')
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data: BlockHeightData = await response.json()
      
      if (typeof data.height === 'number') {
        setBlockHeight(data.height)
        setLastUpdated(new Date())
      } else {
        throw new Error('Invalid height data received')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch block height'
      setError(errorMessage)
      console.error('[useBlockHeight] Error:', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchBlockHeight()
  }, [])

  // Polling for updates
  useEffect(() => {
    if (pollingIntervalMs <= 0) return

    const interval = setInterval(fetchBlockHeight, pollingIntervalMs)
    return () => clearInterval(interval)
  }, [pollingIntervalMs])

  return {
    blockHeight,
    isLoading,
    error,
    lastUpdated
  }
}
