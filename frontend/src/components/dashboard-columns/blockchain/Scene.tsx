/**
 * @fileoverview Basic Three.js scene setup for blockchain visualization
 * @version 1.0.0
 * @since 2025-08-30
 * @lastModified 2025-08-30
 * 
 * @description
 * Provides basic Three.js scene with camera, lighting, and renderer setup.
 * Now includes integrated performance monitoring within Canvas context.
 * Designed for integration with existing BlockchainVisualizer component.
 * 
 * @dependencies
 * - three
 * - @react-three/fiber
 * - @react-three/drei
 * - PerformanceMonitor (integrated)
 * 
 * @usage
 * <Scene>
 *   <Block position={[0, 0, 0]} />
 * </Scene>
 * 
 * @state
 * ✅ In Development - Performance monitoring integrated
 * 
 * @performance
 * - Optimized for 60fps rendering
 * - Efficient camera and lighting setup
 * - Integrated performance metrics
 */

import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { PerformanceMonitor } from './PerformanceMonitor'

interface SceneProps {
  children: React.ReactNode
  className?: string
}

export const Scene: React.FC<SceneProps> = ({ children, className }) => {
  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 5, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        {/* Environment */}
        <Environment preset="city" />
        
        {/* Controls */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={20}
        />
        
        {/* Performance Monitor - Now inside Canvas context */}
        <PerformanceMonitor />
        
        {/* 3D Content */}
        {children}
      </Canvas>
    </div>
  )
}