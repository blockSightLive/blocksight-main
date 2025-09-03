/**
 * @fileoverview Context for managing blockchain visualization mode (2D/3D)
 * @version 1.0.0
 * @since 2025-01-01
 * @lastModified 2025-01-01
 * 
 * @description
 * Provides context for managing blockchain visualization mode selection.
 * Allows users to switch between 2D and 3D blockchain visualization.
 * 
 * @dependencies
 * - React Context API
 * 
 * @usage
 * <BlockchainVisualizationProvider>
 *   <App />
 * </BlockchainVisualizationProvider>
 * 
 * @state
 * ✅ New - Blockchain visualization mode management
 */

import React, { createContext, useContext, useState, ReactNode } from 'react'

export type BlockchainVisualizationMode = '2d' | '3d'

interface BlockchainVisualizationContextType {
  mode: BlockchainVisualizationMode
  setMode: (mode: BlockchainVisualizationMode) => void
  toggleMode: () => void
}

const BlockchainVisualizationContext = createContext<BlockchainVisualizationContextType | undefined>(undefined)

interface BlockchainVisualizationProviderProps {
  children: ReactNode
}

export const BlockchainVisualizationProvider: React.FC<BlockchainVisualizationProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<BlockchainVisualizationMode>('3d') // Default to 3D

  const toggleMode = () => {
    setMode(prevMode => prevMode === '2d' ? '3d' : '2d')
  }

  const value: BlockchainVisualizationContextType = {
    mode,
    setMode,
    toggleMode
  }

  return (
    <BlockchainVisualizationContext.Provider value={value}>
      {children}
    </BlockchainVisualizationContext.Provider>
  )
}

export const useBlockchainVisualization = (): BlockchainVisualizationContextType => {
  const context = useContext(BlockchainVisualizationContext)
  if (context === undefined) {
    throw new Error('useBlockchainVisualization must be used within a BlockchainVisualizationProvider')
  }
  return context
}
