/**
 * @fileoverview LoadingBlocks Component - 3D Cube Loading Animation
 * @version 1.0.0
 * @author Development Team
 * @since 2025-08-27
 * @lastModified 2025-08-27
 * 
 * @description
 * React component that renders a 3D cube loading animation using CSS Modules.
 * Currently configured with 6 cubes and blockchain-inspired colors.
 * Based on the original CSS animation from Uiverse.io by gsperandio.
 * 
 * @dependencies
 * - React for component lifecycle
 * - CSS Modules for styling
 * 
 * @usage
 * <LoadingBlocks />
 * 
 * @state
 * ✅ Functional - 3D cube loading animation with proper CSS Module integration
 * 
 * @bugs
 * - None currently identified
 * 
 * @todo
 * - [MEDIUM] Extend to 10 cubes as originally requested
 * - [LOW] Add accessibility attributes for screen readers
 * 
 * @styling
 * - CSS Modules: All 3D cube styling and animations
 * - 3D Transforms: Hardware-accelerated animations with preserve-3d
 * 
 * @performance
 * - Hardware-accelerated 3D transforms
 * - Efficient CSS animations
 * - Minimal DOM manipulation
 * 
 * @security
 * - Safe CSS properties only
 * - No external dependencies
 */

import React from 'react';
import styles from './LoadingBlocks.module.css';

// ========================================
// MAIN COMPONENT - 6 BLOCKCHAIN CUBES
// ========================================

interface LoadingBlocksProps {
  className?: string;
}

const LoadingBlocks: React.FC<LoadingBlocksProps> = ({ className }) => {
  // Create an array of 6 cubes with explicit numbering for debugging
  const cubes = Array.from({ length: 6 }, (_, index) => index + 1);

  return (
    <div className={`${styles.cubes} ${className || ''}`}>
      <div className={styles.loop}>
        {/* 6 cubes with blockchain-inspired colors - numbered for debugging */}
        {cubes.map((cubeNumber) => (
          <div 
            key={cubeNumber}
            className={styles.item}
            data-cube-number={cubeNumber}
            data-cube-position={cubeNumber <= 3 ? 'top' : 'bottom'}
            data-cube-color={cubeNumber <= 2 ? 'orange' : cubeNumber <= 4 ? 'red' : 'purple'}
            title={`Cube ${cubeNumber}`}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingBlocks;