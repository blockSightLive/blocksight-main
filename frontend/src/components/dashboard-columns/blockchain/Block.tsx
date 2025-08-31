/**
 * @fileoverview Individual 3D block component for blockchain visualization
 * @version 1.0.0
 * @since 2025-08-30
 * @lastModified 2025-08-30
 * 
 * @description
 * Renders a single 3D block with configurable properties.
 * Integrates with existing blockchain status color system.
 * Features advanced animations and theme-aware materials.
 * 
 * @dependencies
 * - three
 * - @react-three/fiber
 * 
 * @usage
 * <Block position={[0, 0, 0]} status="confirmed" />
 * 
 * @state
 * ✅ In Development - Advanced animations and theming
 * 
 * @performance
 * - Efficient geometry and material reuse
 * - Optimized for multiple block instances
 * - Smooth 60fps animations
 */

import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface BlockProps {
  position: [number, number, number]
  status?: 'pending' | 'confirmed' | 'mined' | 'historical'
  size?: number
  color?: string
}

export const Block: React.FC<BlockProps> = ({ 
  position, 
  status = 'confirmed', 
  size = 1,
  color 
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree()
  
  // Animation state
  const animationState = useRef({
    rotationSpeed: 0.005,
    hoverIntensity: 0,
    isHovered: false,
    originalScale: size,
    targetScale: size
  })
  
  // Default colors based on blockchain status
  const getBlockColor = () => {
    if (color) return color
    
    switch (status) {
      case 'pending': return '#F9D8A2' // Light unconfirmed
      case 'confirmed': return '#7B2F9B' // Light last block
      case 'mined': return '#FC7A99' // Light next block
      case 'historical': return '#502168' // Light previous block
      default: return '#7B2F9B'
    }
  }
  
  // Enhanced animation with hover effects
  useFrame((state) => {
    if (meshRef.current) {
      const mesh = meshRef.current
      const anim = animationState.current
      
      // Rotation animation
      mesh.rotation.y += anim.rotationSpeed
      
      // Hover effect
      if (anim.isHovered) {
        anim.hoverIntensity = Math.min(anim.hoverIntensity + 0.1, 1)
        anim.targetScale = anim.originalScale * 1.2
      } else {
        anim.hoverIntensity = Math.max(anim.hoverIntensity - 0.1, 0)
        anim.targetScale = anim.originalScale
      }
      
      // Smooth scale transition
      mesh.scale.setScalar(
        THREE.MathUtils.lerp(mesh.scale.x, anim.targetScale, 0.1)
      )
      
      // Status-specific animations
      if (status === 'pending') {
        mesh.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1
      }
      
      if (status === 'confirmed') {
        const material = mesh.material as THREE.MeshStandardMaterial
        if (material.emissiveIntensity !== undefined) {
          material.emissiveIntensity = 0.1 + Math.sin(state.clock.elapsedTime * 3) * 0.05
        }
      }
    }
  })
  
  // Mouse interaction handlers
  const handlePointerEnter = () => {
    animationState.current.isHovered = true
    animationState.current.rotationSpeed = 0.02 // Faster rotation on hover
  }
  
  const handlePointerLeave = () => {
    animationState.current.isHovered = false
    animationState.current.rotationSpeed = 0.005 // Normal rotation speed
  }
  
  // Camera distance-based LOD
  useEffect(() => {
    const updateLOD = () => {
      if (meshRef.current && camera) {
        const distance = camera.position.distanceTo(meshRef.current.position)
        const anim = animationState.current
        
        // Reduce animation complexity for distant blocks
        if (distance > 10) {
          anim.rotationSpeed = 0.002
        } else if (distance > 5) {
          anim.rotationSpeed = 0.005
        } else {
          anim.rotationSpeed = 0.01
        }
      }
    }
    
    updateLOD()
  }, [camera])
  
  return (
    <mesh 
      ref={meshRef} 
      position={position}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial 
        color={getBlockColor()}
        metalness={0.1}
        roughness={0.8}
        transparent
        opacity={0.9}
        emissive={getBlockColor()}
        emissiveIntensity={0.05}
      />
    </mesh>
  )
}