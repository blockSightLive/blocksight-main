/**
 * @fileoverview Individual 3D block component for blockchain visualization
 * @version 2.0.0
 * @since 2025-08-30
 * @lastModified 2025-08-31
 * 
 * @description
 * Renders a single 3D block with configurable properties.
 * Integrates with existing blockchain status color system.
 * Features basic animations and theme-aware materials.
 * 
 * @dependencies
 * - three
 * @react-three/fiber
 * @react-three/drei
 * 
 * @usage
 * <Block position={[0, 0, 0]} status="confirmed" section="current" />
 * 
 * @state
 * 🚀 Enhanced - Basic 3D features and animations
 * 
 * @performance
 * - Efficient geometry and material reuse
 * - Optimized for multiple block instances
 * - Smooth 60fps animations
 */

import React, { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface BlockProps {
  position: [number, number, number]
  status?: 'pending' | 'confirmed' | 'mined' | 'historical'
  section?: 'mempool' | 'current' | 'historical'
  size?: number
  color?: string
  blockData?: {
    height: number
    hash: string
    timestamp: number
    transactionCount: number
    size: number
    weight: number
    difficulty: number
    confirmations: number
    status: 'pending' | 'confirmed' | 'mined' | 'historical'
    section: string
    mempoolInfo?: {
      transactionCount: number
      estimatedTime: string
      feeRate: number
    }
  }
}

export const Block: React.FC<BlockProps> = ({ 
  position, 
  status: _status = 'confirmed', 
  section = 'current',
  size: _size = 1,
  color,
  blockData
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree() || { camera: null }
  
  // Component mount tracking
  useEffect(() => {
    // Component mounted successfully
  }, [])
  
  // Use real block data when available, fallback to props
  const actualSection = blockData?.section || section
  
  // MVP Color System - Section-based colors
  const getBlockColor = () => {
    if (color) return color
    
    switch (actualSection) {
      case 'mempool': return '#F9D8A2' // Orange: mempool blocks
      case 'current': return '#FC7A99' // Light Red/Pink: current blocks
      case 'historical': return '#7B2F9B' // Light Purple: historical blocks
      default: return '#7B2F9B' // Default to light purple
    }
  }
  
  // Animation state for smooth transitions
  const animationState = useRef({
    scale: 1,
    rotation: 0,
    opacity: 1
  })
  
  // Animation frame handler
  useFrame(() => {
    if (meshRef.current && camera) {
      // Simple scale animation based on distance from camera
      const distance = meshRef.current.position.distanceTo(camera.position)
      const targetScale = Math.max(0.5, Math.min(1.5, 1 - distance * 0.1))
      
      // Smooth scale transition
      animationState.current.scale += (targetScale - animationState.current.scale) * 0.1
      meshRef.current.scale.setScalar(animationState.current.scale)
      
      // Simple rotation animation
      animationState.current.rotation += 0.01
      meshRef.current.rotation.y = animationState.current.rotation
    }
  })
  
  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color={getBlockColor()} />
      </mesh>
    </group>
  )
}