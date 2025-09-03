/**
 * @fileoverview Two-dimensional blockchain visualization fallback using CSS
 * @version 1.0.0
 * @since 2025-01-01
 * @lastModified 2025-01-01
 * 
 * @description
 * CSS-based 2D blockchain visualization for browsers that don't support WebGL.
 * This is the fallback component that provides:
 * - Pure CSS animations for smooth performance
 * - Static display with no camera controls
 * - Real-time blockchain data display
 * - WebSocket integration for live updates
 * - Continuous vertical stacking inspired by LoadingBlocks.tsx
 * 
 * @dependencies
 * - WebSocketHandler for real-time updates
 * - MainOrchestrator for blockchain data
 * - CSS Modules for styling
 * 
 * @usage
 * <TwoDBlockchain />
 * 
 * @state
 * ✅ Phase 4 - Clean 2D blockchain fallback with single responsibility
 * 
 * @performance
 * - Pure CSS animations for smooth performance
 * - No WebGL overhead
 * - Efficient WebSocket event processing
 * 
 * @security
 * - Input validation for WebSocket data
 * - Error handling for malformed blockchain data
 */

import React, { useState, useEffect, useCallback } from 'react'
// import { useMainOrchestrator } from '../../../contexts/MainOrchestrator' // Temporarily disabled
import { WebSocketHandler } from './WebSocketHandler'
import styles from './TwoDBlockchain.module.css'

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
  type: 'mempool' | 'current' | 'historical'
}

export const TwoDBlockchain: React.FC = () => {
  const [blocks, setBlocks] = useState<BlockchainBlock[]>([])
  const [isLoading, setIsLoading] = useState(true)
  // const { state: orchestratorState } = useMainOrchestrator() // Removed unused variable

  // WebSocket event handlers for real-time updates
  const handleBlockUpdate = useCallback((blockData: unknown) => {
    // Process real-time block update
    if (!blockData || typeof blockData !== 'object') return
    
    const data = blockData as Record<string, unknown>
    
    const newBlock: BlockchainBlock = {
      height: typeof data.height === 'number' ? data.height : 0,
      hash: typeof data.hash === 'string' ? data.hash : '',
      timestamp: typeof data.timestamp === 'number' ? data.timestamp : Date.now(),
      transactionCount: typeof data.transactionCount === 'number' ? data.transactionCount : 0,
      size: typeof data.size === 'number' ? data.size : 0,
      weight: typeof data.weight === 'number' ? data.weight : 0,
      difficulty: typeof data.difficulty === 'number' ? data.difficulty : 0,
      confirmations: typeof data.confirmations === 'number' ? data.confirmations : 0,
      status: (typeof data.status === 'string' && ['pending', 'confirmed', 'mined', 'historical'].includes(data.status)) 
        ? data.status as 'pending' | 'confirmed' | 'mined' | 'historical' 
        : 'confirmed',
      type: (typeof data.confirmations === 'number' && data.confirmations === 0) ? 'mempool' : 
            (typeof data.confirmations === 'number' && data.confirmations < 6) ? 'current' : 'historical'
    }
    
    setBlocks(prev => {
      const updated = [newBlock, ...prev].slice(0, 20)
      return updated
    })
  }, [])

  const handleMempoolUpdate = useCallback((mempoolData: unknown) => {
    // Process real-time mempool update
    
    // Create mempool blocks from pending transactions
    const mempoolBlocks: BlockchainBlock[] = ((mempoolData as { pendingTransactions?: unknown[] })?.pendingTransactions || [])
      .slice(0, 5)
      .map((tx: unknown, _index: number) => {
        const txData = tx as Record<string, unknown>
        return {
          height: 0,
          hash: typeof txData.txid === 'string' ? txData.txid : '',
          timestamp: Date.now(),
          transactionCount: 1,
          size: typeof txData.size === 'number' ? txData.size : 0,
          weight: typeof txData.weight === 'number' ? txData.weight : 0,
          difficulty: 0,
          confirmations: 0,
          status: 'pending' as const,
          type: 'mempool' as const
        }
      })
    
    setBlocks(prev => {
      const nonMempoolBlocks = prev.filter(block => block.type !== 'mempool')
      return [...mempoolBlocks, ...nonMempoolBlocks].slice(0, 20)
    })
  }, [])

  const handleNetworkStatusUpdate = useCallback((_statusData: unknown) => {
    // Process real-time network status update
  }, [])

  const handleChainReorg = useCallback((_reorgData: unknown) => {
    // Process chain reorganization
  }, [])

  // Initialize with placeholder data
  useEffect(() => {
    const placeholderBlocks: BlockchainBlock[] = [
      // Mempool blocks (above center)
      { height: 0, hash: 'mempool-1', timestamp: Date.now(), transactionCount: 1, size: 250, weight: 1000, difficulty: 0, confirmations: 0, status: 'pending', type: 'mempool' },
      { height: 0, hash: 'mempool-2', timestamp: Date.now(), transactionCount: 1, size: 180, weight: 720, difficulty: 0, confirmations: 0, status: 'pending', type: 'mempool' },
      { height: 0, hash: 'mempool-3', timestamp: Date.now(), transactionCount: 1, size: 320, weight: 1280, difficulty: 0, confirmations: 0, status: 'pending', type: 'mempool' },
      
      // Current blocks (center - bigger and more visible)
      { height: 800000, hash: 'current-1', timestamp: Date.now(), transactionCount: 3278, size: 1000000, weight: 4000000, difficulty: 50000000000, confirmations: 1, status: 'confirmed', type: 'current' },
      { height: 799999, hash: 'current-2', timestamp: Date.now(), transactionCount: 2156, size: 800000, weight: 3200000, difficulty: 50000000000, confirmations: 2, status: 'confirmed', type: 'current' },
      
      // Historical blocks (below center)
      { height: 799998, hash: 'historical-1', timestamp: Date.now(), transactionCount: 1890, size: 750000, weight: 3000000, difficulty: 50000000000, confirmations: 3, status: 'historical', type: 'historical' },
      { height: 799997, hash: 'historical-2', timestamp: Date.now(), transactionCount: 2100, size: 850000, weight: 3400000, difficulty: 50000000000, confirmations: 4, status: 'historical', type: 'historical' },
      { height: 799996, hash: 'historical-3', timestamp: Date.now(), transactionCount: 1750, size: 700000, weight: 2800000, difficulty: 50000000000, confirmations: 5, status: 'historical', type: 'historical' },
      { height: 799995, hash: 'historical-4', timestamp: Date.now(), transactionCount: 1950, size: 780000, weight: 3120000, difficulty: 50000000000, confirmations: 6, status: 'historical', type: 'historical' },
    ]
    
    setBlocks(placeholderBlocks)
    setIsLoading(false)
  }, [])

  // Get center block index for highlighting
  const centerBlockIndex = Math.floor(blocks.length / 2)

  return (
    <div className={styles.twoDBlockchain}>
      {/* WebSocket Handler for real-time updates */}
      <WebSocketHandler
        onBlockUpdate={handleBlockUpdate}
        onMempoolUpdate={handleMempoolUpdate}
        onNetworkStatusUpdate={handleNetworkStatusUpdate}
        onChainReorg={handleChainReorg}
      />
      
      {/* Continuous vertical stack of blocks */}
      <div className={styles.blockStack}>
        {blocks.map((block, index) => {
          const isCenter = index === centerBlockIndex
          const isAboveCenter = index < centerBlockIndex
          const isBelowCenter = index > centerBlockIndex
          
          return (
            <div
              key={`${block.type}-${block.height}-${index}`}
              className={`${styles.block} ${styles[block.type]} ${
                isCenter ? styles.centerBlock : ''
              } ${isAboveCenter ? styles.aboveCenter : ''} ${
                isBelowCenter ? styles.belowCenter : ''
              }`}
              data-block-height={block.height}
              data-block-type={block.type}
              data-block-status={block.status}
              title={`Block ${block.height || 'Mempool'} - ${block.transactionCount} transactions`}
            >
              {/* Block content */}
              <div className={styles.blockContent}>
                <div className={styles.blockHeight}>
                  {block.height > 0 ? block.height.toLocaleString() : 'Mempool'}
                </div>
                <div className={styles.blockInfo}>
                  <span className={styles.transactionCount}>
                    {block.transactionCount.toLocaleString()} tx
                  </span>
                  {block.confirmations > 0 && (
                    <span className={styles.confirmations}>
                      {block.confirmations} conf
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className={styles.loadingIndicator}>
          <div className={styles.loadingText}>Loading blockchain...</div>
        </div>
      )}
    </div>
  )
}

export default TwoDBlockchain
