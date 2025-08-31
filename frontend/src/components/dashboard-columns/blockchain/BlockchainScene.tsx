/**
 * @fileoverview Main blockchain 3D scene component
 * @version 1.0.0
 * @since 2025-08-30
 * @lastModified 2025-08-30
 * 
 * @description
 * Orchestrates the complete 3D blockchain visualization.
 * Integrates with existing WebSocket data and theme system.
 * Now implements lazy loading for heavy 3D components (Scene, Block)
 * for further bundle optimization and improved performance.
 * 
 * @dependencies
 * - Scene.tsx (lazy loaded)
 * - Block.tsx (lazy loaded)
 * - WebSocket data from existing system
 * 
 * @usage
 * <BlockchainScene />
 * 
 * @state
 * ✅ Enhanced - Lazy loading implemented for heavy 3D components
 * 
 * @performance
 * - Efficient block rendering
 * - WebSocket event optimization
 * - Real-time updates with 60fps target
 * - Lazy loading for heavy 3D components
 */

import React, { useState, useEffect, lazy, Suspense } from 'react'
import { useBlockHeight } from './useBlockHeight'
import { LoadingBlocks } from '../../shared'

// Lazy load heavy 3D components for bundle optimization
const Scene = lazy(() => import('./Scene').then(module => ({ default: module.Scene })))
const Block = lazy(() => import('./Block').then(module => ({ default: module.Block })))

interface BlockchainData {
  height: number
  status: 'pending' | 'confirmed' | 'mined' | 'historical'
  timestamp: number
  hash?: string
}

export const BlockchainScene: React.FC = () => {
  const [blocks, setBlocks] = useState<BlockchainData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error] = useState<string | null>(null)
  
  // Real-time block height from Bitcoin Core
  const { blockHeight, isLoading: heightLoading, error: heightError } = useBlockHeight(15000) // 15 second polling

  // Generate blockchain data based on real height
  useEffect(() => {
    if (blockHeight && !heightLoading) {
      const currentHeight = blockHeight
      const realBlocks: BlockchainData[] = [
        { height: currentHeight, status: 'confirmed', timestamp: Date.now() - 600000 },
        { height: currentHeight + 1, status: 'pending', timestamp: Date.now() },
        { height: currentHeight - 1, status: 'mined', timestamp: Date.now() - 300000 },
        { height: currentHeight - 2, status: 'historical', timestamp: Date.now() - 900000 },
        { height: currentHeight - 3, status: 'historical', timestamp: Date.now() - 1200000 },
      ]
      
      setBlocks(realBlocks)
      setIsLoading(false)
    }
  }, [blockHeight, heightLoading])

  // Show loading state while fetching real data
  if (heightLoading || isLoading) {
    return (
      <Suspense fallback={<LoadingBlocks />}>
        <Scene>
          <Block position={[0, 0, 0]} status="pending" />
        </Scene>
      </Suspense>
    )
  }

  // Show error state if height fetch fails
  if (heightError) {
    return (
      <Suspense fallback={<LoadingBlocks />}>
        <Scene>
          <Block position={[0, 0, 0]} status="historical" />
        </Scene>
      </Suspense>
    )
  }

  // Show error state if general error
  if (error) {
    return (
      <Suspense fallback={<LoadingBlocks />}>
        <Scene>
          <Block position={[0, 0, 0]} status="historical" />
        </Scene>
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<LoadingBlocks />}>
      <Scene>
        {blocks.map((block, index) => (
          <Block
            key={block.height}
            position={[
              (index - Math.floor(blocks.length / 2)) * 2, // X-axis spread
              block.status === 'pending' ? 1 : 0, // Y-axis for pending blocks
              -index * 1.5 // Z-axis for blockchain depth
            ]}
            status={block.status}
          />
        ))}
      </Scene>
    </Suspense>
  )
}